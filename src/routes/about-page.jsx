import { cn } from '@core/helpers';
import { Typography } from '@ui/text/typography';

const Section = ({ title, children }) => (
  <div className={cn('flex flex-col gap-3')}>
    <Typography variant={'h2'} asTag={'h2'} className={cn('text-indigo-700 font-semibold border-b border-indigo-100 pb-2')}>
      {title}
    </Typography>
    {children}
  </div>
);

const RuleCard = ({ icon, title, description }) => (
  <div className={cn('flex gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm')}>
    <span className="text-2xl mt-0.5">{icon}</span>
    <div>
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  </div>
);

const StepCard = ({ step, title, description }) => (
  <div className={cn('flex gap-4 items-start p-4 bg-white rounded-xl border border-slate-200 shadow-sm')}>
    <span className={cn('w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0')}>
      {step}
    </span>
    <div>
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  </div>
);

export function AboutPage() {
  return (
    <div className={cn('flex flex-col gap-10 py-8 max-w-3xl', 'flex-1')}>
      <div>
        <Typography variant={'h1'} asTag={'h1'} className={cn('text-4xl font-bold text-slate-800')}>
          Sobre o projeto
        </Typography>
        <p className="mt-3 text-slate-500 text-lg leading-relaxed">
          O <strong className="text-slate-700">PI5</strong> é um projeto integrador onde cada grupo desenvolve uma
          <strong className="text-slate-700"> IA jogadora</strong> para competir em partidas do jogo de tabuleiro{' '}
          <strong className="text-slate-700">The Last Graduation</strong>, exposta como uma API web que o servidor do professor orquestra automaticamente.
        </p>
      </div>

      <Section title="O jogo: The Last Graduation">
        <p className="text-slate-600 leading-relaxed">
          Inspirado no Santorini, é disputado em um tabuleiro <strong>5×5</strong>. Cada célula possui um
          nível de construção (0 a 4) e pode estar ocupada por um professor. Dois times se enfrentam
          tentando ser o primeiro a levar um de seus professores ao <strong>nível 3</strong>.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
            <p className="font-bold text-indigo-700">Time Turing</p>
            <p className="text-sm text-slate-500 mt-1">CLARO · REY</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
            <p className="font-bold text-rose-600">Time Lovelace</p>
            <p className="text-sm text-slate-500 mt-1">KARIN · BEATRIZ</p>
          </div>
        </div>
      </Section>

      <Section title="Como funciona uma partida">
        <div className="flex flex-col gap-3">
          <RuleCard
            icon="📐"
            title="Fase de Setup"
            description="Cada time posiciona seus dois professores em células de nível 0. A ordem é: Time 1, Time 2, Time 1, Time 2."
          />
          <RuleCard
            icon="🚶"
            title="Movimento"
            description="Em cada turno, escolha um professor e mova-o para uma célula adjacente (diagonal incluída). Só é permitido subir no máximo 1 nível por turno. Células no nível 4 e células ocupadas são bloqueadas."
          />
          <RuleCard
            icon="🧱"
            title="Mentoria (construção)"
            description="Após mover, escolha uma célula adjacente ao destino para 'mentorar': ela sobe 1 nível. Não é possível mentorar células no nível 4 ou ocupadas por outros professores."
          />
          <RuleCard
            icon="🏆"
            title="Vitória"
            description="O time que mover um professor para uma célula de nível 3 vence imediatamente. Ao vencer assim, a mentoria é dispensada."
          />
        </div>
      </Section>

      <Section title="Níveis do tabuleiro">
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          {[
            { nivel: 0, cor: 'bg-slate-200', label: 'Térreo' },
            { nivel: 1, cor: 'bg-sky-300', label: '1º andar' },
            { nivel: 2, cor: 'bg-sky-500 text-white', label: '2º andar' },
            { nivel: 3, cor: 'bg-amber-400', label: '3º — vitória' },
            { nivel: 4, cor: 'bg-slate-800 text-white', label: 'Cúpula (bloqueado)' },
          ].map(({ nivel, cor, label }) => (
            <div key={nivel} className="flex flex-col gap-1 items-center">
              <div className={cn('w-full h-12 rounded-lg flex items-center justify-center font-bold text-lg', cor)}>
                {nivel}
              </div>
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Como funciona para o PI5">
        <p className="text-slate-600 leading-relaxed">
          Cada grupo sobe uma API que expõe o endpoint <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono text-sm">POST /move</code>.
          O servidor do professor chama esse endpoint a cada turno, enviando o estado atual do tabuleiro,
          e aguarda a jogada escolhida pela IA do grupo.
        </p>
        <div className="flex flex-col gap-3 mt-1">
          <StepCard step="1" title="Registre seu grupo" description="Acesse a página Jogador e cadastre seu grupo na API do professor. Você receberá um token de acesso." />
          <StepCard step="2" title="Suba sua API" description="Faça deploy da sua IA (ex: Railway). Ela precisa ter uma URL pública para que o servidor do professor consiga chamá-la." />
          <StepCard step="3" title="Cadastre o endpoint" description="Informe a URL do seu POST /move no cadastro do jogador. O servidor usará essa URL para enviar o estado do jogo à sua IA." />
          <StepCard step="4" title="Jogue!" description="Crie ou entre em uma partida. A cada turno, o servidor chama sua IA automaticamente e executa a jogada retornada." />
        </div>
      </Section>

      <Section title="Formato da jogada">
        <p className="text-slate-600 text-sm leading-relaxed mb-2">
          Seu endpoint recebe um JSON com o estado do jogo e deve retornar a jogada:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Setup (posicionamento)</p>
            <pre className={cn('bg-slate-900 text-green-400 p-4 rounded-xl text-sm overflow-auto font-mono')}>
{`{ "row": 2, "col": 2 }`}
            </pre>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Turno normal</p>
            <pre className={cn('bg-slate-900 text-green-400 p-4 rounded-xl text-sm overflow-auto font-mono')}>
{`{
  "professor": "CLARO",
  "move_to": { "row": 1, "col": 2 },
  "mentor_at": { "row": 0, "col": 2 }
}`}
            </pre>
          </div>
        </div>
      </Section>
    </div>
  );
}