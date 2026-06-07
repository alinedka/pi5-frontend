import { cn } from '@core/helpers';
import { createGame } from '@feature/game/api';
import { useGameContext } from '@feature/game/context/game-context';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export function CreateGameForm({ onClose }) {
  const { player } = useGameContext();
  const navigate = useNavigate();

  const [teamSlot, setTeamSlot]       = useState(1);
  const [vsBot, setVsBot]             = useState(true);
  const [autoStart, setAutoStart]     = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!player?.id) {
      setError('Você precisa estar registrado como jogador para criar partidas.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const game = await createGame({
        player_id:     player.id,
        team_slot:     teamSlot,
        vs_random_bot: vsBot,
        auto_start:    autoStart,
      });
      onClose?.();
      navigate(`/spectate/${game.id}`);
    } catch (err) {
      console.error(err);
      setError('Erro ao criar partida. Verifique suas credenciais e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Team slot */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Seu time
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 1, label: 'Turing', desc: 'CLARO · REY', color: 'border-blue-400 bg-blue-50 text-blue-700' },
            { value: 2, label: 'Lovelace', desc: 'KARIN · BEATRIZ', color: 'border-red-400 bg-red-50 text-red-600' },
          ].map(({ value, label, desc, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTeamSlot(value)}
              className={cn(
                'p-3 rounded-xl border-2 text-left transition-all',
                teamSlot === value ? color : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              )}
            >
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs opacity-70 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Adversário */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          Adversário
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: true,  label: 'Bot aleatório', desc: 'Jogo imediato' },
            { value: false, label: 'Outro jogador',  desc: 'Aguarda alguém entrar' },
          ].map(({ value, label, desc }) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setVsBot(value)}
              className={cn(
                'p-3 rounded-xl border-2 text-left transition-all',
                vsBot === value
                  ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              )}
            >
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs opacity-70 mt-0.5">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Auto start */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="text-sm font-medium text-slate-700">Iniciar automaticamente</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {autoStart ? 'A partida começa assim que estiver pronta' : 'Você precisará iniciar manualmente'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAutoStart((p) => !p)}
          className={cn(
            'w-11 h-6 rounded-full transition-colors relative',
            autoStart ? 'bg-indigo-600' : 'bg-slate-300'
          )}
        >
          <span className={cn(
            'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all',
            autoStart ? 'left-5' : 'left-0.5'
          )} />
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            'flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg',
            'hover:bg-indigo-700 transition-colors',
            submitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          {submitting ? 'Criando...' : 'Criar partida'}
        </button>
      </div>
    </form>
  );
}
