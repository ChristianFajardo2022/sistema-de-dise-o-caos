import { readFileSync } from 'node:fs';
import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

/** Bloque `@layer base` de tokens.css (variables de los dos modos, sin Tailwind) para el menú del administrador. */
function tokenVariables() {
  const css = read('../src/styles/tokens.css');
  const start = css.indexOf('@layer base {');
  let depth = 0;
  for (let i = css.indexOf('{', start); i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return css.slice(start, i + 1);
  }
  throw new Error('tokens.css: no se encontró el bloque @layer base');
}

/** Helvetica Neue Light (300) y Regular (400), las que usa el menú; los archivos se sirven en caos-fonts/. */
const FONT_FACES = ['Light:300', 'Regular:400']
  .map((f) => f.split(':'))
  .map(
    ([name, weight]) =>
      `@font-face{font-family:"Helvetica Neue";src:url("./caos-fonts/HelveticaNeue-${name}.woff2") format("woff2");font-weight:${weight};font-style:normal;font-display:swap}`,
  )
  .join('');

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
  staticDirs: [{ from: '../src/assets/fonts', to: '/caos-fonts' }],
  managerHead: (head) => `${head}
<style>${FONT_FACES}</style>
<style>${tokenVariables()}</style>
<style>${read('./caos-sidebar/caos-sidebar.css')}</style>`,
  /**
   * viteFinal ensures @tailwindcss/vite is injected into the Storybook
   * iframe's own Vite build pipeline — without this, Tailwind utilities
   * are never generated inside the canvas.
   */
  viteFinal: async (config) => {
    config.plugins = config.plugins ?? [];
    // Prepend so Tailwind processes CSS before other plugins
    config.plugins.unshift(tailwindcss());
    return config;
  },
};

export default config;