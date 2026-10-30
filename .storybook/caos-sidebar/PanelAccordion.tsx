/**
 * Panel de complementos (Controles, Acciones…) como acordeón: la X de Storybook lo ocultaba y, sin barra superior, no
 * había cómo volver a abrirlo. Aquí la X se oculta (CSS) y en su lugar va una flecha que contrae el panel hasta su
 * barra de pestañas o lo vuelve a abrir con el alto que tenía. El panel siempre está visible en la vista de historia y
 * siempre abajo (el acordeón es vertical; el botón de orientación también se oculta).
 */
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { API } from 'storybook/manager-api';
import { IconChevronDown16 } from './icons';

const STORE_KEY = 'caos-panel';
/** Barra de pestañas del panel (40) + su borde superior. */
const BAR_HEIGHT = 41;
const DEFAULT_HEIGHT = 300;

function readStore(): { collapsed?: boolean; height?: number } {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeStore(value: { collapsed: boolean; height: number }) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {
    // Sin almacenamiento: el panel funciona igual, solo no recuerda su estado
  }
}

function layoutElement() {
  return document.querySelector<HTMLElement>('#root > div');
}

/** Alto actual del panel inferior (Storybook lo publica como --bottom-panel-height). */
function readPanelHeight(): number | undefined {
  const value = parseFloat(layoutElement()?.style.getPropertyValue('--bottom-panel-height') ?? '');
  return Number.isNaN(value) ? undefined : value;
}

/** El panel está a la derecha si su área está en la primera fila de la grilla. */
function panelOnRight(): boolean {
  const layout = layoutElement();
  if (!layout) return false;
  const firstRow = getComputedStyle(layout).gridTemplateAreas.split('"')[1] ?? '';
  return firstRow.includes('panel');
}

/**
 * Contenedor de los botones de la barra del panel (donde estaba la X), o null si el panel no está montado. Storybook
 * monta otra copia de la barra oculta (móvil): vale la que está dentro de una barra visible.
 */
function findActions(): HTMLElement | null {
  const buttons = document.querySelectorAll<HTMLElement>('#storybook-panel-region button[aria-keyshortcuts="alt+A"]');
  for (const button of buttons) {
    const actions = button.parentElement;
    if (actions?.parentElement && actions.parentElement.getBoundingClientRect().width > 0) return actions;
  }
  return null;
}

export function PanelAccordion({ api }: { api: API }) {
  const [stored] = useState(readStore);
  const [collapsed, setCollapsed] = useState(stored.collapsed ?? false);
  const [target, setTarget] = useState<HTMLElement | null>(null);
  const height = useRef(stored.height ?? DEFAULT_HEIGHT);
  const collapsedRef = useRef(collapsed);

  useEffect(() => {
    collapsedRef.current = collapsed;
    writeStore({ collapsed, height: height.current });
  }, [collapsed]);

  // Cada 200 ms (no hay suscripción fuera del árbol de Storybook): panel visible, abajo, con el alto que toca
  useEffect(() => {
    const tick = () => {
      if (api.getUrlState()?.viewMode !== 'story') {
        setTarget(null);
        return;
      }
      if (!api.getIsPanelShown()) api.togglePanel(true);
      if (panelOnRight()) api.togglePanelPosition('bottom');
      const current = readPanelHeight();
      if (current !== undefined) {
        if (collapsedRef.current) {
          // Si se arrastra el borde para agrandarlo, deja de estar contraído
          if (current > BAR_HEIGHT + 24) setCollapsed(false);
          else if (current !== BAR_HEIGHT) api.setSizes({ bottomPanelHeight: BAR_HEIGHT });
        } else if (current <= BAR_HEIGHT + 24) {
          api.setSizes({ bottomPanelHeight: height.current });
        } else if (current !== height.current) {
          height.current = current;
          writeStore({ collapsed: false, height: current });
        }
      }
      const actions = findActions();
      setTarget((prev) => (prev === actions ? prev : actions));
    };
    tick();
    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [api]);

  // Contraído, elegir una pestaña lo abre en esa pestaña
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!collapsedRef.current) return;
      if (!(e.target as Element | null)?.closest?.('#storybook-panel-region [role="tab"]')) return;
      setCollapsed(false);
      api.setSizes({ bottomPanelHeight: height.current });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [api]);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    api.setSizes({ bottomPanelHeight: next ? BAR_HEIGHT : height.current });
  };

  if (!target) return null;
  return createPortal(
    <button
      type="button"
      className="caos-panel-toggle"
      data-collapsed={collapsed}
      aria-expanded={!collapsed}
      aria-controls="storybook-panel-root"
      aria-label={collapsed ? 'Abrir panel de complementos' : 'Contraer panel de complementos'}
      title={collapsed ? 'Abrir panel' : 'Contraer panel'}
      onClick={toggle}
    >
      <IconChevronDown16 />
    </button>,
    target,
  );
}
