import { cn } from '@core/helpers';
import { setAccessToken } from '@core/helpers/fetch';
import { listPlayers } from '@feature/game/api';
import { useGameContext } from '@feature/game/context/game-context';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const inputClass = cn(
  'border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800',
  'focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent',
  'placeholder:text-slate-300 transition-all'
);

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}

export function PlayerLoginForm() {
  const { setPlayer } = useGameContext();
  const [error, setError] = useState(null);

  const form = useForm({ defaultValues: { token: '', player_id: '' } });
  const { formState: { isSubmitting }, control } = form;

  async function handleSubmit({ token, player_id }) {
    setError(null);
    const trimmed = token.trim();
    try {
      setAccessToken(trimmed);
      const players = await listPlayers();

      // Prioridade: ID informado manualmente → JWT → fallback
      const jwtPayload = decodeJwtPayload(trimmed);
      const resolvedId = player_id
        ? parseInt(player_id)
        : (jwtPayload?.sub ?? jwtPayload?.id ?? jwtPayload?.player_id);

      const found = resolvedId
        ? players?.find((p) => String(p.id) === String(resolvedId))
        : null;

      if (found) {
        setPlayer({ ...found, player_access_token: trimmed });
      } else {
        setPlayer({ player_access_token: trimmed });
      }
    } catch (err) {
      setAccessToken(null);
      console.error(err);
      setError('Token inválido ou sem permissão. Verifique e tente novamente.');
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
      <Controller
        name="token"
        control={control}
        rules={{ required: 'O token é obrigatório' }}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Token de acesso
            </label>
            <input
              className={inputClass}
              type="password"
              placeholder="Cole seu player_access_token aqui"
              {...field}
            />
            {fieldState.error && (
              <span className="text-red-500 text-xs">{fieldState.error.message}</span>
            )}
          </div>
        )}
      />

      <Controller
        name="player_id"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              ID do jogador <span className="normal-case text-slate-400">(opcional)</span>
            </label>
            <input
              className={inputClass}
              type="number"
              placeholder="Ex: 42"
              {...field}
            />
            {fieldState.error && (
              <span className="text-red-500 text-xs">{fieldState.error.message}</span>
            )}
          </div>
        )}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'mt-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg',
          'hover:bg-indigo-700 transition-colors',
          isSubmitting && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Verificando...' : 'Entrar'}
      </button>
    </form>
  );
}
