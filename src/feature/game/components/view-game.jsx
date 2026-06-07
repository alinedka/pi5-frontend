import { cn } from '@core/helpers';
import { useGameSocket } from '@feature/game/hooks/useGameSocket';

const TEAM_MAP = { CLARO: 1, REY: 1, KARIN: 2, BEATRIZ: 2 };

const CELL_LEVEL_CLASS = {
  0: 'bg-sky-200',
  1: 'bg-sky-400',
  2: 'bg-sky-600',
  3: 'bg-amber-400',
  4: 'bg-slate-700',
};


function GameBoard({ board }) {
  if (!board) return null;
  return (
    <div
      className={cn('grid gap-1.5')}
      style={{ gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', maxWidth: 480 }}
    >
      {board.map((row, r) =>
        row.map((cell, c) => {
          const team = cell?.professor ? TEAM_MAP[cell.professor] : null;
          return (
            <div
              key={`${r}-${c}`}
              className={cn(
                'relative flex items-center justify-center rounded-xl aspect-square',
                CELL_LEVEL_CLASS[cell?.level] ?? 'bg-sky-200'
              )}
            >
              <span className="absolute top-1.5 right-2 text-[10px] font-bold text-white/60">
                {cell?.level}
              </span>
              {cell?.professor && (
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    'text-[9px] font-bold text-white text-center leading-tight',
                    'border-2 border-white/40 shadow-md',
                    team === 1 ? 'bg-blue-600' : 'bg-red-500'
                  )}
                >
                  {cell.professor}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function normalize(data) {
  if (!data?.board) return null;
  const isWs = data.turn_number !== undefined && data.current_turn_number === undefined;
  return {
    board:      data.board,
    status:     data.status,
    turnNumber: isWs ? data.turn_number      : data.current_turn_number,
    turnTeamId: isWs ? data.turn_team_id     : data.current_turn_team_id,
    turnPhase:  isWs ? data.turn_phase       : data.current_turn_phase,
    winnerTeam: data.winner_team,
  };
}

export function ViewGame({ gameId, restGame, spectatorToken }) {
  const { connected, gameState: wsGame } = useGameSocket(gameId, spectatorToken);

  // WebSocket tem prioridade; REST é fallback
  const state = normalize(wsGame) ?? normalize(restGame);

  return (
    <div className="flex flex-col gap-4">

      {/* Indicador de conexão ao vivo */}
      {spectatorToken && state?.status === 'PLAYING' && (
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className={cn('w-1.5 h-1.5 rounded-full', connected ? 'bg-green-400' : 'bg-yellow-400 animate-pulse')} />
          {connected ? 'Ao vivo' : 'Conectando...'}
        </div>
      )}

      {/* Tabuleiro */}
      <GameBoard board={state?.board} />

      {/* Legenda */}
      {state?.board && (
        <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1">
          {[
            { label: 'Nível 0', cls: 'bg-sky-200' },
            { label: 'Nível 1', cls: 'bg-sky-400' },
            { label: 'Nível 2', cls: 'bg-sky-600' },
            { label: 'Nível 3 (vitória)', cls: 'bg-amber-400' },
            { label: 'Nível 4', cls: 'bg-slate-700' },
          ].map(({ label, cls }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={cn('w-3 h-3 rounded-sm inline-block', cls)} />
              {label}
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" /> Turing
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Lovelace
          </div>
        </div>
      )}
    </div>
  );
}
