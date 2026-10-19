import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'CAOS · Sistema de Diseño',
  brandUrl: '/',
  brandTarget: '_self',
});

addons.setConfig({
  theme,
  sidebar: {
    showRoots: true,
  },
});
