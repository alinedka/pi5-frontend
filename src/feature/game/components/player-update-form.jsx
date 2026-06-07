import { cn } from '@core/helpers';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { updatePlayerMoveEndpoint } from '../api';
import { useGameContext } from '../context/game-context';

const inputClass = cn(
  'border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800',
  'focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent',
  'placeholder:text-slate-300 transition-all'
);

export function PlayerUpdateForm() {
  const { player, setPlayer } = useGameContext();

  const form = useForm({
    defaultValues: {
      ai_player_move_endpoint: player?.ai_player_move_endpoint || '',
    },
  });
  const { formState } = form;
  const { isSubmitting, errors } = formState;

  async function handleSubmit(dto) {
    try {
      const response = await updatePlayerMoveEndpoint(player?.id, { ...dto });

      if (!response?.id) {
        throw new Error('[ERR]: resposta inesperada ao atualizar jogador');
      }

      setPlayer(Object.assign({}, player, response));
    } catch (err) {
      console.error(err?.message || '[ERR]: erro ao atualizar jogador', err);
    }
  }

  useEffect(() => {
    if (player?.id) {
      form.reset({
        ai_player_move_endpoint: player?.ai_player_move_endpoint || '',
      });
    }
  }, [player]);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <Controller
        name={'ai_player_move_endpoint'}
        control={form.control}
        rules={{ required: 'O endpoint de movimento é obrigatório' }}
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              URL do endpoint
            </label>
            <input
              className={inputClass}
              type="text"
              placeholder="https://minha-api.railway.app/move"
              {...field}
            />
            {errors.ai_player_move_endpoint && (
              <span className="text-red-500 text-xs">{errors.ai_player_move_endpoint.message}</span>
            )}
          </div>
        )}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg',
          'hover:bg-indigo-700 transition-colors',
          isSubmitting && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Atualizando...' : 'Atualizar Endpoint'}
      </button>
    </form>
  );
}
