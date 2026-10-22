import type { Preview, Decorator } from '@storybook/react-vite';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import '../src/index.css';

// Primitivos de tokens.css: no hay semánticos con el mismo valor en cada modo (heading claro es #1d1c1c, no #000)
const BG = { dark: 'var(--color-ds-primitives-color-primary-n01)', light: 'var(--color-ds-primitives-color-primary-g01)' };
const FG = { dark: 'var(--color-ds-primitives-color-primary-b01)', light: 'var(--color-ds-primitives-color-primary-n01)' };

function ThemeWrapper({ theme: selectedTheme, children }: { theme: string; children: ReactNode }) {
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
        padding: '32px',
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

const withThemeDecorator: Decorator = (Story, context) => (
  <ThemeWrapper theme={context.globals?.['theme'] ?? 'dark'}>
    <Story />
  </ThemeWrapper>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        // Sin el fallo de "unicolor": solo props que se llamen background o color, o terminen en Background/Color
        color: /^(background|color)$|(Background|Color)$/,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true, // Usamos nuestro propio selector de tema
    },
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      name: 'Tema',
      description: 'Selector de tema del sistema CAOS',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Modo Claro' },
          { value: 'dark', icon: 'moon', title: 'Modo Oscuro' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [withThemeDecorator],
};

export default preview;