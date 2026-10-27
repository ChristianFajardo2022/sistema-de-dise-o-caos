import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface FoundationTab {
  /** Identificador estable de la pestaña (se usa para `initialTab` y para los ids ARIA) */
  id: string;
  /** Texto de la pestaña */
  label: string;
  /** Contenido del panel */
  content: ReactNode;
}

interface FoundationPageProps {
  /** SVG de `icons/caos/line/` importado con `?raw`. Se pinta con currentColor, 32 px. */
  iconSvg: string;
  /** Título de la página (h1) */
  title: string;
  /** Subtítulo bajo el título */
  subtitle: string;
  /** Pestañas de la página (Definición, Valores de token, Aplicación…) */
  tabs: FoundationTab[];
  /** Pestaña inicial; por defecto la primera. Sirve para enlazar cada pestaña como historia. */
  initialTab?: string;
}

/** Contenedor de ancho de contenido de Figma (1024 px dentro de 1440) con márgenes laterales responsivos. */
const content = 'mx-auto w-full max-w-[1056px] px-ds-space-general-2xl tablet:max-w-[1088px] tablet:px-ds-primitives-space-5xl';

/**
 * Página de un fundamento de diseño: encabezado negro (ícono, título, subtítulo), barra de pestañas
 * accesible (WAI-ARIA tabs: flechas, Home/End) y panel de contenido. La raíz es el `<main>` de la página.
 * Usar con `parameters: { layout: 'fullscreen' }` en la historia.
 */
export function FoundationPage({ iconSvg, title, subtitle, tabs, initialTab }: FoundationPageProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(initialTab && tabs.some((t) => t.id === initialTab) ? initialTab : tabs[0].id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = (id: string, focus = false) => {
    setActiveId(id);
    if (focus) tabRefs.current[id]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    const next =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    select(tabs[next].id, true);
  };

  return (
    <main className="min-h-dvh bg-ds-background-container-surface font-ds-primitives-typography-family-primary text-ds-text-neutral-body">
      <header className="relative overflow-hidden bg-ds-primitives-color-primary-n01 text-ds-primitives-color-primary-b01">
        {/* Círculo decorativo del encabezado */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-ds-primitives-space-6xl -right-40 size-[420px] rounded-full bg-ds-primitives-color-primary-g13 opacity-70 tablet:-right-24 tablet:size-[560px]"
        />
        <div className={cn(content, 'relative flex flex-col gap-ds-space-general-5xl py-ds-primitives-space-6xl tablet:py-ds-primitives-space-7xl')}>
          <span
            aria-hidden="true"
            className="flex size-16 items-center justify-center rounded-ds-radius-general-xl border border-ds-primitives-color-primary-g13 bg-ds-primitives-color-primary-n01 [&_svg]:size-8"
            dangerouslySetInnerHTML={{ __html: iconSvg }}
          />
          <h1 className="m-0 font-ds-primitives-typography-family-secondary text-ds-primitives-typography-size-5xl leading-none font-ds-primitives-typography-weight-semibold tablet:text-ds-primitives-typography-size-6xl">
            {title}
          </h1>
          <p className="m-0 max-w-[560px] text-ds-primitives-typography-size-lg leading-normal text-pretty">{subtitle}</p>
        </div>
      </header>

      <div
        role="tablist"
        aria-label={`Secciones de ${title}`}
        // A 320 px las pestañas no caben: la barra hace scroll propio (las pestañas son enfocables y se traen a la vista al enfocarlas)
        className="flex overflow-x-auto border-y border-ds-border-general-default-on-card bg-ds-background-container-surface"
      >
        {tabs.map((tab, i) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                'flex-1 shrink-0 cursor-pointer border-0 px-ds-space-general-md py-ds-primitives-space-5xl text-center font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md text-ds-text-neutral-heading transition-colors motion-reduce:transition-none tablet:text-ds-primitives-typography-size-lg',
                'not-last:border-r not-last:border-ds-border-general-default-on-card',
                'focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ds-text-neutral-heading',
                !selected && 'font-medium',
                // Seleccionada: además del fondo, subrayado de 3 px y peso semibold (indicador no cromático, 1.4.1 y 1.4.11)
                selected
                  ? 'bg-ds-background-tab-select-on-canva font-ds-primitives-typography-weight-semibold shadow-[inset_0_-3px_0_0_var(--color-ds-text-neutral-heading)]'
                  : 'bg-transparent hover:bg-ds-background-tab-hover-on-canva',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== activeId}
          tabIndex={0}
          className="focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ds-text-neutral-heading"
        >
          {/* Solo se monta el contenido de la pestaña activa; el panel (con su id) existe siempre para que aria-controls sea válido */}
          {tab.id === activeId && (
            <div className={cn(content, 'flex flex-col gap-ds-primitives-space-8xl py-ds-primitives-space-7xl tablet:py-ds-primitives-space-9xl')}>
              {tab.content}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
