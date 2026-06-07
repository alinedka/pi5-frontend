import { cn } from '@core/helpers';
import { SpectateGame } from '@feature/game/components/spectate-game';
import { Typography } from '@ui/text/typography';
import { useNavigate, useParams } from 'react-router';

export function SpectatePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  return (
    <div className={cn('flex flex-col gap-4 py-8', 'flex-1')}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className={cn(
            'flex items-center gap-1.5 text-sm text-slate-500',
            'hover:text-indigo-600 transition-colors'
          )}
        >
          ← Partidas
        </button>
      </div>

      <Typography variant={'h1'} asTag={'h1'} className={cn('text-4xl', 'font-bold')}>
        Assistindo #{gameId}
      </Typography>

      <SpectateGame gameId={gameId} />
    </div>
  );
}
