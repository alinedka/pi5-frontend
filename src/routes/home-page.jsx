import { cn } from '@core/helpers';
import { setAccessToken } from '@core/helpers/fetch';
import { getGame, joinGame, listGames } from '@feature/game/api';
import { CreateGameForm } from '@feature/game/components/create-game-form';
import { useGameContext } from '@feature/game/context/game-context';
import { Typography } from '@ui/text/typography';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';

const PAGE_SIZE = 10;

const STATUS_CONFIG = {
  PLAYING:         { label: 'Em andamento', className: 'bg-green-100 text-green-700 border-green-200' },
  WAITING_PLAYERS: { label: 'Aguardando',   className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  FINISHED:        { label: 'Finalizado',   className: 'bg-slate-100 text-slate-500 border-slate-200' },
  PAUSED:          { label: 'Pausado',      className: 'bg-orange-100 text-orange-700 border-orange-200' },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: 'bg-slate-100 text-slate-500 border-slate-200' };
  return (
    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', config.className)}>
      {config.label}
    </span>
  );
}

function UnauthenticatedHome() {
  const { setPlayer } = useGameContext();
  const [token, setToken]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function entrarComToken(e) {
    e.preventDefault();
    const t = token.trim();
    if (!t) return;
    setLoading(true);
    setError(null);
    try {
      setAccessToken(t);
      await listGames({ page: 1, page_size: 1 });
      // Atualiza o contexto — HomePage re-renderiza automaticamente 
      setPlayer({ player_access_token: t });
    } catch {
      setAccessToken(null);
      setError('Token inválido ou sem permissão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 py-8 flex-1')}>
      <Typography variant={'h1'} asTag={'h1'} className={cn('text-4xl font-bold text-slate-800')}>
        Partidas
      </Typography>

      <div className="grid md:grid-cols-2 gap-4 max-w-2xl">

        {/* Telespectador com token */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
          <div>
            <p className="font-semibold text-slate-700">Assistir como telespectador</p>
            <p className="text-xs text-slate-400 mt-1">
              Cole seu token de acesso para ver e assistir as partidas.
            </p>
          </div>
          <form onSubmit={entrarComToken} className="flex flex-col gap-3 mt-auto">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Cole seu token aqui"
              className={cn(
                'border border-slate-200 rounded-lg px-4 py-2.5 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent'
              )}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading || !token.trim()}
              className={cn(
                'px-4 py-2.5 bg-slate-700 text-white text-sm font-semibold rounded-lg',
                'hover:bg-slate-800 transition-colors',
                (loading || !token.trim()) && 'opacity-40 cursor-not-allowed'
              )}
            >
              {loading ? 'Verificando...' : 'Assistir partidas →'}
            </button>
          </form>
        </div>

        {/* Jogador */}
        <div className="bg-white rounded-xl border border-indigo-200 shadow-sm p-6 flex flex-col gap-4">
          <div>
            <p className="font-semibold text-slate-700">Entrar como jogador</p>
            <p className="text-xs text-slate-400 mt-1">
              Registre sua IA ou acesse com seu token para criar partidas e competir.
            </p>
          </div>
          <Link
            to="/player"
            className={cn(
              'mt-auto px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg text-center',
              'hover:bg-indigo-700 transition-colors'
            )}
          >
            Ir para Jogador →
          </Link>
        </div>

      </div>
    </div>
  );
}

export function HomePage() {
  const { player, setPlayer } = useGameContext();

  // Derivado diretamente do contexto — reage imediatamente ao login/logout
  const isAuthenticated = !!(player?.player_access_token);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const navigate = useNavigate();

  const [partidas, setPartidas] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinGameId, setJoinGameId] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [search, setSearch] = useState('');
  const [joiningGameId, setJoiningGameId] = useState(null);

  async function handleJoin(e) {
    e.preventDefault();
    const id = joinGameId.trim();
    if (!id) return;
    setJoinLoading(true);
    setJoinError(null);
    try {
      const gameData = await getGame(id);
      const team_slot = gameData?.turing_player == null ? 1 : 2;
      await joinGame(id, { player_id: player.id, team_slot });
      setShowJoin(false);
      setJoinGameId('');
      navigate(`/spectate/${id}`);
    } catch (err) {
      setJoinError(err?.message ?? 'Não foi possível entrar na partida.');
    } finally {
      setJoinLoading(false);
    }
  }

  const totalPages = Math.ceil((partidas?.total ?? 0) / PAGE_SIZE);

  function setPage(valueOrUpdater) {
    const next = typeof valueOrUpdater === 'function' ? valueOrUpdater(page) : valueOrUpdater;
    setSearchParams({ page: String(next) }, { replace: true });
  }

  async function buscarPartidas(p = page) {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const pageSize = search.trim() ? 100 : PAGE_SIZE;
      const response = await listGames({ page: search.trim() ? 1 : p, page_size: pageSize });
      setPartidas(response);
    } catch (err) {
      console.error(err);
      if (err?.message?.includes('401') || err?.message?.includes('403')) {
        setAccessToken(null);
        setPlayer(null);
      } else {
        setError(err?.message ?? 'Erro ao buscar partidas.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinGame(game) {
    if (!player?.id) return;
    setJoiningGameId(game.id);
    try {
      const team_slot = game.turing_player == null ? 1 : 2;
      await joinGame(game.id, { player_id: player.id, team_slot });
      navigate(`/spectate/${game.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setJoiningGameId(null);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { buscarPartidas(page); }, [page, isAuthenticated, search]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredGames = search.trim()
    ? (partidas?.items ?? []).filter((game) => {
        const q = search.toLowerCase();
        return (
          game?.turing_player?.group_name?.toLowerCase().includes(q) ||
          game?.lovelace_player?.group_name?.toLowerCase().includes(q)
        );
      })
    : (partidas?.items ?? []);

  if (!isAuthenticated) {
    return <UnauthenticatedHome />;
  }

  return (
    <div className={cn('flex flex-col gap-6 py-8', 'flex-1')}>
      <div className="flex items-center justify-between">
        <Typography variant={'h1'} asTag={'h1'} className={cn('text-4xl font-bold text-slate-800')}>
          Partidas
        </Typography>
        <div className="flex items-center gap-3">
          {partidas?.total > 0 && !search.trim() && (
            <span className="text-sm text-slate-400">{partidas.total} partida{partidas.total !== 1 ? 's' : ''}</span>
          )}
          {player?.id && (
            <>
              <button
                onClick={() => setShowJoin(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Entrar por ID
              </button>
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + Criar partida
              </button>
            </>
          )}
        </div>
      </div>

      {/* Busca por grupo */}
      <div className="relative max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Buscar por grupo..."
          className={cn(
            'w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white',
            'focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent'
          )}
        />
        {search && (
          <button
            onClick={() => { setSearch(''); setPage(1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Modal criar partida */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Typography variant={'h3'} asTag={'h3'} className="text-slate-800">
                Nova partida
              </Typography>
              <button
                onClick={() => setShowCreate(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <CreateGameForm onClose={() => { setShowCreate(false); buscarPartidas(page); }} />
          </div>
        </div>
      )}

      {/* Modal entrar por ID */}
      {showJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Typography variant={'h3'} asTag={'h3'} className="text-slate-800">
                Entrar numa partida
              </Typography>
              <button
                onClick={() => { setShowJoin(false); setJoinGameId(''); setJoinError(null); }}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">ID da partida</label>
                <input
                  type="text"
                  value={joinGameId}
                  onChange={(e) => setJoinGameId(e.target.value)}
                  placeholder="Cole o UUID da partida"
                  className={cn(
                    'border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-mono',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent'
                  )}
                />
              </div>
{joinError && <p className="text-red-500 text-sm">{joinError}</p>}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => { setShowJoin(false); setJoinGameId(''); setJoinError(null); }}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={joinLoading || !joinGameId.trim()}
                  className={cn(
                    'flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg',
                    'hover:bg-indigo-700 transition-colors',
                    (joinLoading || !joinGameId.trim()) && 'opacity-40 cursor-not-allowed'
                  )}
                >
                  {joinLoading ? 'Entrando...' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-slate-400">
          <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm">Carregando partidas...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && filteredGames.length === 0 && (
        <div className="p-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          {search.trim() ? `Nenhuma partida encontrada para "${search}".` : 'Nenhuma partida encontrada.'}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filteredGames.map((game, g) => {
          const turingNome = game?.turing_player?.group_name;
          const lovelaceNome = game?.lovelace_player?.group_name;
          const versus =
            turingNome && lovelaceNome
              ? `${turingNome} x ${lovelaceNome}`
              : turingNome ?? lovelaceNome ?? null;

          const canJoin = game?.status === 'WAITING_PLAYERS' && player?.id;
          const isJoining = joiningGameId === game.id;

          return (
            <div
              key={g}
              className={cn(
                'p-4 bg-white rounded-xl border border-slate-200 shadow-sm',
                'grid items-center gap-4',
                'hover:border-indigo-200 hover:shadow-md transition-all'
              )}
              style={{ gridTemplateColumns: '1fr 130px auto' }}
            >
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-xs text-slate-400 font-mono truncate">#{game.id}</p>
                {versus && (
                  <p className="text-sm font-semibold text-slate-700 truncate">{versus}</p>
                )}
              </div>

              <div className="flex justify-center">
                <StatusBadge status={game?.status} />
              </div>

              <div className="flex justify-end gap-2">
                {canJoin && (
                  <button
                    onClick={() => handleJoinGame(game)}
                    disabled={isJoining}
                    className={cn(
                      'shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      'bg-green-600 text-white hover:bg-green-700',
                      isJoining && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isJoining ? 'Entrando...' : 'Entrar'}
                  </button>
                )}
                <Link
                  to={`/spectate/${game.id}`}
                  className={cn(
                    'shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    game?.status === 'FINISHED'
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : canJoin
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  )}
                >
                  {game?.status === 'FINISHED' ? 'Ver partida' : 'Assistir'}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && !search.trim() && (
        <div className={cn('flex items-center justify-between pt-2')}>
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1 || loading}
            className={cn(
              'px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white',
              'hover:bg-slate-50 transition-colors',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            ← Anterior
          </button>

          <span className="text-sm text-slate-500">
            Página <strong className="text-slate-800">{page}</strong> de <strong className="text-slate-800">{totalPages}</strong>
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages || loading}
            className={cn(
              'px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-white',
              'hover:bg-slate-50 transition-colors',
              'disabled:opacity-40 disabled:cursor-not-allowed'
            )}
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
