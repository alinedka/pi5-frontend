import { Controller, useForm } from 'react-hook-form';
import { registerPlayer } from '../api';
import { cn } from '@core/helpers';
import { useGameContext } from '../context/game-context';
import { useEffect } from 'react';

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</label>
      {children}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}

const inputClass = cn(
  'border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800',
  'focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent',
  'placeholder:text-slate-300 transition-all'
);

export function PlayerRegisterForm() {
  const { player, setPlayer } = useGameContext();

  const form = useForm({
    defaultValues: {
      ai_player_name: player?.ai_player_name || '',
      ai_player_avatar: player?.ai_player_avatar || '',
      group_name: player?.group_name || '',
      ai_player_description: player?.ai_player_description || '',
      ai_player_move_endpoint: player?.ai_player_move_endpoint || '',
    },
  });
  const { formState } = form;
  const { isSubmitting, errors } = formState;

  async function handleSubmit(dto) {
    try {
      const response = await registerPlayer({ ...dto });

      if (!response?.player_access_token) {
        throw new Error('[ERR]: resposta inesperada ao registrar jogador');
      }

      setPlayer(response);

      form?.reset({
        ai_player_name: response?.ai_player_name,
        ai_player_avatar: response?.ai_player_avatar,
        group_name: response?.group_name,
        ai_player_description: response?.ai_player_description,
        ai_player_move_endpoint: response?.ai_player_move_endpoint,
      });
    } catch (err) {
      console.error(err?.message || '[ERR]: erro ao registrar jogador', err);
    }
  }

  useEffect(() => {
    if (player?.id) {
      form.reset({
        ai_player_name: player?.ai_player_name || '',
        ai_player_avatar: player?.ai_player_avatar || '',
        group_name: player?.group_name || '',
        ai_player_description: player?.ai_player_description || '',
        ai_player_move_endpoint: player?.ai_player_move_endpoint || '',
      });
    }
  }, [player]);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <Controller
        name={'group_name'}
        control={form.control}
        rules={{ required: 'O nome do grupo é obrigatório' }}
        render={({ field }) => (
          <Field label="Nome do grupo" error={errors.group_name?.message}>
            <input className={inputClass} type="text" placeholder="Ex: Grupo Alpha" {...field} />
          </Field>
        )}
      />

      <Controller
        name={'ai_player_name'}
        control={form.control}
        rules={{ required: 'O nome do jogador de IA é obrigatório' }}
        render={({ field }) => (
          <Field label="Nome do jogador" error={errors.ai_player_name?.message}>
            <input className={inputClass} type="text" placeholder="Ex: AlphaBot" {...field} />
          </Field>
        )}
      />

      <Controller
        name={'ai_player_avatar'}
        control={form.control}
        rules={{ required: 'A URL do avatar é obrigatória' }}
        render={({ field }) => (
          <Field label="URL do avatar" error={errors.ai_player_avatar?.message}>
            <input className={inputClass} type="text" placeholder="https://..." {...field} />
          </Field>
        )}
      />

      <Controller
        name={'ai_player_description'}
        control={form.control}
        render={({ field }) => (
          <Field label="Descrição do jogador" error={errors.ai_player_description?.message}>
            <input className={inputClass} type="text" placeholder="Ex: IA baseada em heurística de bloqueio" {...field} />
          </Field>
        )}
      />

      <Controller
        name={'ai_player_move_endpoint'}
        control={form.control}
        rules={{ required: 'O endpoint de movimento é obrigatório' }}
        render={({ field }) => (
          <Field label="Endpoint de movimento (POST /move)" error={errors.ai_player_move_endpoint?.message}>
            <input className={inputClass} type="text" placeholder="https://minha-api.railway.app/move" {...field} />
          </Field>
        )}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'mt-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg',
          'hover:bg-indigo-700 transition-colors',
          isSubmitting && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Registrando...' : 'Registrar Jogador'}
      </button>
    </form>
  );
}
