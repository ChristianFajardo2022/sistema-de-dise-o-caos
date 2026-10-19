import type { Preview, Decorator } from '@storybook/react-vite';
import { useEffect } from 'react';
import '../src/index.css';

const withThemeDecorator: Decorator = (Story, context) => {
  const selectedTheme: string = context.globals?.['theme'] ?? 'light';

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
      <Story />
    </div>
  );
};

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
      defaultValue: 'light',
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