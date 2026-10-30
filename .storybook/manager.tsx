import React from 'react';
import { createRoot } from 'react-dom/client';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
import { CaosSidebar } from './caos-sidebar/CaosSidebar';
import { PanelAccordion } from './caos-sidebar/PanelAccordion';

const brand = {
  brandTitle: 'CAOS · Sistema de Diseño',
  brandUrl: '/',
  brandTarget: '_self',
} as const;

const themes = {
  dark: create({ base: 'dark', ...brand }),
  light: create({ base: 'light', ...brand }),
};

addons.setConfig({
  theme: themes.dark,
  sidebar: {
    showRoots: true,
  },
  // Sin barra superior (zoom, pantalla completa, Share): el menú lateral concentra la navegación y el tema
  layoutCustomisations: {
    showToolbar: () => false,
  },
});

// Menú lateral propio (Figma: Menu Library dev): se monta sobre la zona de navegación y oculta la de Storybook
addons.register('caos/sidebar', (api) => {
  const host = document.createElement('div');
  host.id = 'caos-sidebar-root';
  document.body.appendChild(host);
  let current: keyof typeof themes = 'dark';
  const onModeChange = (mode: keyof typeof themes) => {
    if (mode === current) return;
    current = mode;
    api.setOptions({ theme: themes[mode] });
  };
  createRoot(host).render(
    <>
      <CaosSidebar api={api} onModeChange={onModeChange} />
      <PanelAccordion api={api} />
    </>,
  );
});
