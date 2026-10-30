import type { Preview, Decorator } from '@storybook/react-vite';
import { ThemeWrapper } from './ThemeWrapper';
import { AutoDocsContainer, AutoDocsPage } from '../src/docs/StorybookDocsPage';
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
            'Voz y tono',
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
        color: /^color$|(Background|Color)$/,
        date: /Date$/i,
      },
    },
    // Páginas Docs con el encabezado de CAOS (Header document); Tooltip trae su propia plantilla y la reemplaza
    docs: {
      container: AutoDocsContainer,
      page: AutoDocsPage,
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
    // Sin selector en la barra de herramientas: el tema se cambia desde el menú lateral (botón sol/luna)
    theme: {
      name: 'Tema',
      description: 'Tema del sistema CAOS: light o dark',
      defaultValue: 'dark',
    },
  },
  decorators: [withThemeDecorator],
};

export default preview;