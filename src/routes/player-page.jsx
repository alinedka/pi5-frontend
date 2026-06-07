import { cn } from '@core/helpers';
import { listPlayers } from '@feature/game/api';
import { PlayerLoginForm } from '@feature/game/components/player-login-form';
import { PlayerRegisterForm } from '@feature/game/components/player-register-form';
import { PlayerUpdateForm } from '@feature/game/components/player-update-form';
import { useGameContext } from '@feature/game/context/game-context';
import { Typography } from '@ui/text/typography';
import { useEffect, useState } from 'react';

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-slate-700 font-medium break-all">{value}</span>
    </div>
  );
}

export function PlayerPage() {
  const { player, setPlayer } = useGameContext();
  const [tab, setTab] = useState('login');

  useEffect(() => {
    if (!player?.id) return;
    listPlayers()
      .then((players) => {
        const updated = players?.find((p) => p.id === player.id);
        if (updated) setPlayer({ ...updated, player_access_token: player.player_access_token });
      })
      .catch(() => {});
  }, []);

  const isTokenOnly = player && !player?.id;
  const hasProfile = player?.group_name || player?.ai_player_name;

  return (
    <div className={cn('flex flex-col gap-8 py-8 max-w-xl', 'flex-1')}>
      <Typography variant={'h1'} asTag={'h1'} className={cn('text-4xl font-bold text-slate-800')}>
        {player?.ai_player_name ?? 'Jogador'}
      </Typography>

      {!player && (
        <div className="flex flex-col gap-6">
          <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white w-fit">
            {[
              { key: 'login',    label: 'Entrar' },
              { key: 'register', label: 'Registrar' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  'px-6 py-2.5 text-sm font-semibold transition-colors',
                  tab === key
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-500 hover:bg-slate-50'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            {tab === 'login' && (
              <>
                <Typography variant={'h3'} asTag={'h3'} className="text-slate-700 mb-1">
                  Entrar com token existente
                </Typography>
                <p className="text-sm text-slate-400 mb-4">
                  Já possui um grupo registrado? Cole seu token para acessar.
                </p>
                <PlayerLoginForm />
              </>
            )}
            {tab === 'register' && (
              <>
                <Typography variant={'h3'} asTag={'h3'} className="text-slate-700 mb-1">
                  Registrar novo jogador
                </Typography>
                <p className="text-sm text-slate-400 mb-4">
                  Primeira vez? Crie seu grupo na competição e receba seu token de acesso.
                </p>
                <PlayerRegisterForm />
              </>
            )}
          </div>
        </div>
      )}

      {player && (
        <div className="flex flex-col gap-6">

          {isTokenOnly && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
              <p className="font-semibold">Logado com token simples</p>
              <p className="mt-1 text-amber-600">
                Os dados do perfil não estão disponíveis neste modo. Para ver as informações completas do grupo, saia e faça o registro.
              </p>
            </div>
          )}

          {hasProfile && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {player?.ai_player_avatar && (
                  <img
                    src={player.ai_player_avatar}
                    alt={player?.ai_player_name ?? 'Avatar'}
                    className="w-16 h-16 rounded-full object-cover border border-slate-200 shrink-0"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <Typography variant={'h3'} asTag={'h3'} className="text-slate-700">
                  Informações do grupo
                </Typography>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Nome do grupo"   value={player?.group_name} />
                <InfoRow label="Nome do jogador" value={player?.ai_player_name} />
                <InfoRow label="Descrição"       value={player?.ai_player_description} />
              </div>
              <InfoRow label="Endpoint de movimento" value={player?.ai_player_move_endpoint} />
            </div>
          )}

          {!isTokenOnly && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Partidas', value: player?.games_played ?? 0 },
                { label: 'Vitórias', value: player?.games_won ?? 0, highlight: true },
                { label: 'Derrotas', value: player?.games_lost ?? 0 },
              ].map(({ label, value, highlight }) => (
                <div
                  key={label}
                  className={cn(
                    'bg-white rounded-xl border p-4 text-center shadow-sm',
                    highlight ? 'border-indigo-200' : 'border-slate-200'
                  )}
                >
                  <p className={cn('text-2xl font-bold', highlight ? 'text-indigo-600' : 'text-slate-700')}>
                    {value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          )}

          {player?.id && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
              <Typography variant={'h3'} asTag={'h3'} className="text-slate-700">
                Atualizar Endpoint de Movimento
              </Typography>
              <p className="text-sm text-slate-400">
                Após fazer o deploy da sua IA, informe a URL pública do endpoint{' '}
                <code className="bg-slate-100 px-1 rounded font-mono text-indigo-600">POST /move</code>.
              </p>
              <PlayerUpdateForm />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
