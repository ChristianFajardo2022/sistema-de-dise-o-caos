import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

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