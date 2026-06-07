import { cn } from '@core/helpers';
import { getGame, registerSpectator, startGame } from '@feature/game/api';
import { useGameContext } from '@feature/game/context/game-context';
import { useEffect, useRef, useState } from 'react';
import { ViewGame } from './view-game';

const STATUS_LABEL = {
  WAITING_PLAYERS: 'Aguardando jogadores',
  PAUSED:          'Partida pausada',
  PLAYING:         'Em andamento',
  FINISHED:        'Finalizada',
};

const STATUS_COLOR = {
  WAITING_PLAYERS: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  PAUSED:          'bg-orange-100 text-orange-700 border-orange-200',
  PLAYING:         'bg-green-100 text-green-700 border-green-200',
  FINISHED:        'bg-slate-100 text-slate-500 border-slate-200',
};

const POLL_INTERVAL_MS = 3000;

export function SpectateGame({ gameId }) {
  const { player, spectator: storedSpectator, setSpectator } = useGameContext();

  const [game, setGame]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [starting, setStarting] = useState(false);
  const pollRef                 = useRef(null);
  const autoRegisteredRef       = useRef(false);

  const spectatorToken = storedSpectator?.[gameId]?.spectator_access_token ?? null;

  const isMyGame = player?.id && game && (
    game.turing_player?.id === player.id ||
    game.lovelace_player?.id === player.id
  );
  const canStart = isMyGame && ['PAUSED', 'WAITING_PLAYERS'].includes(game?.status);

  async function fetchGame(silent = false) {
    if (!silent) setLoading(true);
    try {
      const data = await getGame(gameId);
      setGame(data);
      return data;
    } catch {
      if (!silent) setError('Não foi possível carregar a partida.');
    } finally {
      if (!silent) setLoading(false);
    }
  }

  // Auto-registrar como espectador quando o jogo está em andamento
  async function autoRegisterSpectator() {
    if (autoRegisteredRef.current || spectatorToken || !player?.player_access_token) return;
    autoRegisteredRef.current = true;
    try {
      const name   = player?.ai_player_name ?? player?.group_name ?? 'Espectador';
      const avatar = player?.ai_player_avatar ?? '';
      const res = await registerSpectator(gameId, { spectator_name: name, spectator_avatar: avatar });
      if (res?.spectator_access_token) setSpectator(res);
    } catch {
      // Silencioso — não bloqueia a visualização
    }
  }

  // Carga inicial
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchGame(); }, [gameId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-registro e polling — continua até FINISHED independente do WebSocket
  useEffect(() => {
    const isActive = game?.status && game.status !== 'FINISHED';

    if (isActive) {
      if (game?.status === 'PLAYING') autoRegisterSpectator();
      pollRef.current = setInterval(() => fetchGame(true), POLL_INTERVAL_MS);
    } else {
      clearInterval(pollRef.current);
    }

    return () => clearInterval(pollRef.current);
  }, [game?.status]);

  async function handleStart() {
    setStarting(true);
    try {
      const updated = await startGame(gameId, {});
      setGame(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 py-8">
        <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-sm">Carregando partida...</span>
      </div>
    );
  }

  if (error) return <p className="text-red-500 py-8">{error}</p>;

  const status = game?.status;

  return (
    <div className="flex flex-col gap-6">

      {/* Info da partida */}
      <div className="flex flex-wrap items-center gap-3">
        <span className={cn('text-xs font-semibold px-3 py-1 rounded-full border', STATUS_COLOR[status])}>
          {STATUS_LABEL[status] ?? status}
        </span>

        {game?.turing_player && (
          <span className="text-sm text-slate-600">
            <span className="font-semibold text-blue-600">{game.turing_player.group_name}</span>
            {' vs '}
            <span className="font-semibold text-red-500">{game.lovelace_player?.group_name ?? 'Bot'}</span>
          </span>
        )}

      </div>

      {/* Botão iniciar */}
      {canStart && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-amber-700">
              {status === 'WAITING_PLAYERS' ? 'Partida aguardando início' : 'Partida pausada'}
            </p>
            <p className="text-sm text-amber-600 mt-0.5">
              Você é um dos jogadores desta partida. Clique para iniciar.
            </p>
          </div>
          <button
            onClick={handleStart}
            disabled={starting}
            className={cn(
              'shrink-0 px-5 py-2 bg-amber-500 text-white font-semibold rounded-lg',
              'hover:bg-amber-600 transition-colors',
              starting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {starting ? 'Iniciando...' : '▶ Iniciar partida'}
          </button>
        </div>
      )}

      {/* Detalhes da partida finalizada */}
      {status === 'FINISHED' && (
        <div className="flex flex-col gap-3">
          {game?.winner_team && (
            <div className={cn(
              'p-5 rounded-xl border-2 text-center',
              game.winner_team === 1
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-red-50 border-red-300 text-red-600'
            )}>
              <p className="text-2xl font-bold">
                🏆 {game.winner_team === 1
                  ? (game.turing_player?.group_name ?? 'Turing')
                  : (game.lovelace_player?.group_name ?? 'Lovelace')} venceu!
              </p>
              <p className="text-sm opacity-70 mt-1">
                em {game.current_turn_number} turno{game.current_turn_number !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {[
              { team: 1, player: game?.turing_player, won: game?.winner_team === 1,
                color: { card: 'border-blue-200 bg-blue-50', name: 'text-blue-700', badge: 'bg-blue-600' } },
              { team: 2, player: game?.lovelace_player, won: game?.winner_team === 2,
                color: { card: 'border-red-200 bg-red-50', name: 'text-red-600', badge: 'bg-red-500' } },
            ].map(({ team, player: p, won, color }) => (
              <div key={team} className={cn('p-4 rounded-xl border-2 flex flex-col gap-2', color.card)}>
                <div className="flex items-center justify-between">
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded text-white', color.badge)}>
                    {team === 1 ? 'Turing' : 'Lovelace'}
                  </span>
                  {won && <span className="text-sm">🏆</span>}
                </div>
                {p ? (
                  <>
                    <p className={cn('font-semibold text-sm', color.name)}>{p.group_name}</p>
                    {p.ai_player_name && <p className="text-xs text-slate-500">{p.ai_player_name}</p>}
                  </>
                ) : (
                  <p className="text-sm text-slate-400">Bot aleatório</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabuleiro */}
      {game?.board && (
        <ViewGame
          gameId={gameId}
          restGame={game}
          spectatorToken={spectatorToken}
        />
      )}
    </div>
  );
}
