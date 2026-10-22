import { useEffect } from 'react';
import type { ReactNode } from 'react';

// Primitivos de tokens.css: no hay semánticos con el mismo valor en cada modo (heading claro es #1d1c1c, no #000)
const BG = { dark: 'var(--color-ds-primitives-color-primary-n01)', light: 'var(--color-ds-primitives-color-primary-g01)' };
const FG = { dark: 'var(--color-ds-primitives-color-primary-b01)', light: 'var(--color-ds-primitives-color-primary-n01)' };

/** flush: sin relleno, para historias con layout fullscreen (páginas que llevan su propio encabezado a sangre) */
export function ThemeWrapper({ theme: selectedTheme, flush = false, children }: { theme: string; flush?: boolean; children: ReactNode }) {
  const mode = selectedTheme === 'dark' ? 'dark' : 'light';
  const bg = BG[mode];
  const fg = FG[mode];
  useEffect(() => {
    const root = document.documentElement;
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    document.body.style.backgroundColor = bg;
    document.body.style.color = fg;
  }, [bg, fg, selectedTheme]);

  return (
    <div
      style={{
        padding: flush ? 0 : '32px',
        minHeight: '100px',
        backgroundColor: bg,
        color: fg,
      }}
      className="transition-[background-color,color] duration-200 motion-reduce:transition-none"
    >
      {children}
    </div>
  );
}
