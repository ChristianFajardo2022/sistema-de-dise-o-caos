import type { Preview, Decorator } from '@storybook/react-vite';
import { ThemeWrapper } from './ThemeWrapper';
import '../src/index.css';

const withThemeDecorator: Decorator = (Story, context) => (
  <ThemeWrapper theme={context.globals?.['theme'] ?? 'dark'} flush={context.parameters?.layout === 'fullscreen'}>
    <Story />
  </ThemeWrapper>
);

const preview: Preview = {
  parameters: {
    options: {
      // Fundamentos de diseño primero (con sus 8 páginas en este orden), luego los componentes
      storySort: {
        order: [
          'Fundamentos de diseño',
          [
            'Tipografía',
            'Colores',
            'Retículas',
            'Contenedores y espacios',
            'Formas',
            'Texturas',
            'Elevaciones',
            'Iconografía',
          ],
          'General Controls',
          'Form Controls',
          '*',
        ],
      },
    },
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
      // Los contrastes dependen de valores de tokens que define diseño y están en su reporte;
      // se vuelve a activar color-contrast cuando cambien los tokens.
      test: 'error',
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
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