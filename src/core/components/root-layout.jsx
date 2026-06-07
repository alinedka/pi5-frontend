import { Outlet } from 'react-router';
import { RootMenu } from './root-menu';
import { Container } from '@ui/layout/container';
import { Typography } from '@ui/text/typography';
import { cn } from '@core/helpers';

export function RootLayout() {
  return (
    <div className={cn('w-dvw min-h-dvh', 'flex flex-col gap-0', 'bg-slate-50')}>
      <header id={'site-header'} className={cn('bg-indigo-700 text-white shadow-md')}>
        <Container className={cn('p-4 flex flex-row items-center gap-3')}>
          <span className="text-2xl">🎓</span>
          <div>
            <Typography variant={'h1'} asTag={'h1'} className="text-xl font-bold leading-tight">
              The Last Graduation
            </Typography>
            <p className="text-indigo-200 text-xs">PI5 — Projeto Integrador</p>
          </div>
        </Container>
      </header>

      <RootMenu />

      <main id={'site-main'} className={cn('flex-1', 'flex flex-col')}>
        <Container className={cn('px-4', 'flex-1')}>
          <Outlet />
        </Container>
      </main>

      <footer id={'site-footer'} className={cn('bg-slate-800 text-white mt-8')}>
        <Container className={cn('p-4 flex flex-row items-center justify-between')}>
          <Typography variant={'p'} asTag={'p'} className={cn('text-xs opacity-50')}>
            &copy;2026 PI5
          </Typography>
          <Typography variant={'p'} asTag={'p'} className={cn('text-xs opacity-30')}>
            The Last Graduation
          </Typography>
        </Container>
      </footer>
    </div>
  );
}
