import type { Preview, Decorator } from '@storybook/react-vite';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import '../src/index.css';

function ThemeWrapper({ theme: selectedTheme, children }: { theme: string; children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    document.body.style.backgroundColor =
      selectedTheme === 'dark' ? '#000000' : '#FAFBFC';
    document.body.style.color =
      selectedTheme === 'dark' ? '#FEFEFE' : '#000000';
  }, [selectedTheme]);

  return (
    <div
      style={{
        padding: '32px',
        minHeight: '100px',
        background: selectedTheme === 'dark' ? '#000000' : '#FAFBFC',
        color: selectedTheme === 'dark' ? '#FEFEFE' : '#000000',
        transition: 'all 0.2s',
      }}
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
        color: /(background|color)$/i,
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