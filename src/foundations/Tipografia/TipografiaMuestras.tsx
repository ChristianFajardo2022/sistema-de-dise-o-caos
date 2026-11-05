import type { ReactNode } from 'react';
import { DocDeviceFrame } from '../../docs/DocDeviceFrame';
import { docBody } from '../../docs/docShared';
import { cn } from '../../utils/cn';
import { DocExamplePanel } from '../_doc/FoundationBlocks';
import { BREAKPOINTS, familyName, tokenPx, weightLabel } from './tipografiaTokens';

/*
 * Muestras propias de Tipografía (bloques `custom` / `preview` de la página): familias, anatomía tipográfica, escala en
 * contexto, interfaz de ejemplo, comparación por breakpoint y truncado. Cada texto usa las utilidades de los tokens
 * tipográficos (`text-ds-…`, `leading-ds-…`, `font-ds-…`), las mismas que arman cada estilo de Figma.
 */

// ───────────────────────── estilos (tokens) ─────────────────────────

const secondary = 'font-ds-primitives-typography-family-secondary';
const primary = 'font-ds-primitives-typography-family-primary';
const regular = 'font-ds-primitives-typography-weight-regular';
const semibold = 'font-ds-primitives-typography-weight-semibold';
const bold = 'font-ds-primitives-typography-weight-bold';

/** Heading/Display-md-700: tamaño y línea primitivos (56/60). */
const displayMd700 = cn(secondary, bold, 'text-ds-primitives-typography-size-7xl leading-ds-primitives-typography-line-height-11xl');
/** Heading/Heading-3xl-600: tamaño primitivo 48 e interlineado responsive. */
const heading3xl600 = cn(secondary, semibold, 'text-ds-primitives-typography-size-6xl leading-ds-typography-heading-line-height-3xl');
/** Heading/Heading-xl-600: heading/size/2xl + line-height/2xl. */
const headingXl600 = cn(secondary, semibold, 'text-ds-typography-heading-size-2xl leading-ds-typography-heading-line-height-2xl');
/** Heading/Heading-lg-600: heading/size/xl + line-height/xl. */
const headingLg600 = cn(secondary, semibold, 'text-ds-typography-heading-size-xl leading-ds-typography-heading-line-height-xl');
/** Heading/Subheading-sm-600: heading/size/md + line-height/md. */
const subheadingSm600 = cn(secondary, semibold, 'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md');
/** Body/Large text/Body-md-400: body/size/lg + line-height-large/lg. */
const bodyMd400 = cn(primary, regular, 'text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg');
/** Body/Large text/Body-sm-400: body/size/md + line-height-large/md. */
const bodySm400 = cn(primary, regular, 'text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md');
/** Body/Short text/Body-xs-400: body/size/sm + line-height-short/sm. */
const shortXs400 = cn(primary, regular, 'text-ds-typography-body-size-sm leading-ds-typography-body-line-height-short-sm');

const heading = 'm-0 text-ds-text-neutral-heading';

/** Etiqueta de una muestra (Body/Short text/Body-sm-600). */
const sampleLabel = cn(primary, semibold, 'm-0 text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-heading');

// ───────────────────────── familias ─────────────────────────

/** "Un sistema, dos familias": un panel "Ejemplo" por familia, con su nombre escrito en ella. */
export function TipografiaFamilias() {
  return (
    <div className="grid grid-cols-1 gap-ds-space-general-3xl @2xl:grid-cols-2">
      <DocExamplePanel>
        <p className={cn(heading, primary, regular, 'text-ds-typography-heading-size-2xl leading-ds-typography-heading-line-height-2xl')}>{familyName('primary')}</p>
        <p className={docBody}>
          Fuente primaria: cuerpo, formularios, tablas, notificaciones e interacción. Usa {weightLabel('regular')} (Light) y {weightLabel('semibold')} (Medium).
        </p>
      </DocExamplePanel>
      <DocExamplePanel>
        <p className={cn(heading, headingXl600)}>{familyName('secondary')}</p>
        <p className={docBody}>
          Fuente secundaria: títulos principales, encabezados y bienvenida. Usa {weightLabel('semibold')} y {weightLabel('bold')}.
        </p>
      </DocExamplePanel>
    </div>
  );
}

// ───────────────────────── anatomía ─────────────────────────

const LH_3XL = '--ds-responsive-typography-heading-line-height-3xl';

// Figma: 23455:56079 (Diagrama anotado)
/**
 * Anatomía tipográfica: "Hx ág" en Heading-3xl-600 dentro de su caja de contención (trazo de 1 px border/acent/purpple,
 * con box-shadow para no sumar al tamaño), la barra que mide el interlineado (alto = la variable del estilo) y la
 * leyenda de Altura de x, Cap height y Baseline, sin cifras: la fuente no expone esas métricas.
 */
export function TipografiaAnatomia() {
  const desktop = tokenPx(LH_3XL, 'desktop');
  const tablet = tokenPx(LH_3XL, 'tablet');
  const mobile = tokenPx(LH_3XL, 'mobile');
  const lineas = desktop === tablet ? `${desktop} px en Desktop y Tablet, ${mobile} px en Mobile` : `${desktop} px en Desktop, ${tablet} px en Tablet y ${mobile} px en Mobile`;
  return (
    <div className="grid grid-cols-1 gap-ds-primitives-space-6xl @3xl:grid-cols-2 @3xl:items-center">
      <div className="flex min-w-0 flex-col gap-ds-space-general-3xl">
        <p className={sampleLabel}>Caja de contención del texto</p>
        <span className={cn(heading3xl600, 'self-start text-ds-text-neutral-heading shadow-[inset_0_0_0_1px_var(--color-ds-border-acent-purpple)]')}>Hx ág</span>
        <div className="flex items-start gap-ds-space-general-2xl">
          <span aria-hidden="true" className="h-[var(--ds-responsive-typography-heading-line-height-3xl)] w-0.5 shrink-0 bg-ds-background-acent-secondary" />
          <p className={docBody}>
            Interlineado: {lineas}. La barra mide el interlineado del estilo; no marca la línea base ni la altura de una letra.
          </p>
        </div>
        <hr className="m-0 w-full border-0 border-t border-dashed border-ds-border-acent-purpple" />
        <p className={docBody}>La guía punteada es solo de lectura: no marca una métrica del glifo.</p>
      </div>
      <dl className="m-0 flex min-w-0 flex-col gap-ds-space-general-3xl">
        {[
          ['Altura de x', 'Altura de las minúsculas sin ascendentes. No lleva cota: la fuente no expone esa métrica.'],
          ['Cap height', 'Altura de las mayúsculas. No equivale al tamaño de fuente (font-size).'],
          ['Baseline', 'Línea sobre la que se apoyan los caracteres.'],
        ].map(([term, text]) => (
          <div key={term} className="flex flex-col gap-ds-space-general-lg">
            <dt className={cn(heading, subheadingSm600)}>{term}</dt>
            <dd className={cn(docBody, 'm-0')}>{text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ───────────────────────── escala en contexto ─────────────────────────

// Figma: 23455:56660 (Jerarquía editorial)
/** Jerarquía editorial apilada: Display-md-700, Heading-xl-600 y Body/Large text/Body-sm-400. */
export function TipografiaEscalaEnContexto() {
  return (
    <div className="flex min-w-0 flex-col gap-ds-space-general-2xl">
      <p className={cn(heading, displayMd700, 'text-balance')}>Cada reunión cuenta.</p>
      <p className={cn(heading, headingXl600, 'text-balance')}>Organiza tu reunión sin salir de casa</p>
      <p className={cn('m-0 text-ds-text-neutral-body', bodySm400)}>
        Elige la sala y el horario que mejor se ajusten a tu día. Sigue cada versión del documento, del borrador a la final.
      </p>
    </div>
  );
}

// ───────────────────────── interfaz de ejemplo ─────────────────────────

/**
 * Variante de la interfaz de ejemplo:
 * - `default`: contexto, título Heading-lg-600, cuerpo Body-md-400 y leyenda Body/Short Body-xs-400.
 * - `caption-first`: la leyenda en Heading-lg-600 y el título en cuerpo (mal ejemplo de jerarquía).
 * - `forced-breaks`: el título partido con saltos de línea forzados (mal ejemplo de wrapping).
 * - `all-emphasis`: el cuerpo entero en semibold (mal ejemplo de contraste de pesos).
 */
export type MuestraInterfazVariant = 'default' | 'caption-first' | 'forced-breaks' | 'all-emphasis';

const TITLE = 'Organiza tu reunión sin salir de casa';
const BODY = 'Elige la sala y el horario que mejor se ajusten a tu día. Te avisamos cuando el equipo confirme la cita.';
const CAPTION = 'Revisa tus datos antes de continuar.';

// Figma: 23455:58845 (Vista de producto)
/** Vista de producto de ejemplo (`background/container/surface`, radio 16, padding 16) con la jerarquía de la receta. */
export function MuestraInterfaz({ variant = 'default' }: { variant?: MuestraInterfazVariant }) {
  let title: ReactNode = <p className={cn(heading, headingLg600)}>{TITLE}</p>;
  if (variant === 'caption-first') title = <p className={cn('m-0 text-ds-text-neutral-body', shortXs400)}>{TITLE}</p>;
  if (variant === 'forced-breaks')
    title = (
      <p className={cn(heading, headingLg600)}>
        Organiza tu
        <br />
        reunión
        <br />
        sin salir de
        <br />
        casa
      </p>
    );
  return (
    <div className="flex w-full min-w-0 flex-col gap-ds-space-general-lg rounded-ds-radius-general-xl bg-ds-background-container-surface p-ds-space-general-2xl text-left">
      <p className={cn(shortXs400, semibold, 'm-0 text-ds-text-acent-firts uppercase')}>Mis proyectos</p>
      {title}
      <p className={cn('m-0 text-ds-text-neutral-body', bodyMd400, variant === 'all-emphasis' && semibold)}>{BODY}</p>
      {variant === 'caption-first' ? (
        <p className={cn(heading, headingLg600)}>{CAPTION}</p>
      ) : (
        <p className={cn('m-0 text-ds-text-neutral-gray', shortXs400)}>{CAPTION}</p>
      )}
    </div>
  );
}

// ───────────────────────── breakpoints ─────────────────────────

// Figma: 23455:58863 (Comparación de modos)
/**
 * Comparación Desktop / Tablet / Mobile: el mismo título (Heading-xl-600) y cuerpo (Body-md-400) en el marco de
 * dispositivo de cada breakpoint (`DocDeviceFrame` aplica sus variables responsive).
 */
export function TipografiaPorBreakpoint() {
  return (
    <div className="grid grid-cols-1 gap-ds-primitives-space-4xl @3xl:grid-cols-3">
      {BREAKPOINTS.map(({ bp, label }) => (
        <div key={bp} className="flex min-w-0 flex-col gap-ds-space-general-xl">
          <h3 className={sampleLabel}>{label}</h3>
          <DocDeviceFrame breakpoint={bp} className="flex-1">
            <p className={cn(heading, headingXl600)}>Tus proyectos, en un solo lugar</p>
            <p className={cn('m-0 text-ds-text-neutral-body', bodyMd400)}>Consulta el estado y organiza tu próxima reunión.</p>
          </DocDeviceFrame>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────── truncado ─────────────────────────

// Figma: 23455:59316 (Wrappers de texto)
/** Truncado en una línea (`truncate`: ancho resuelto, `overflow: hidden`, `white-space: nowrap` y puntos suspensivos). */
export function TipografiaTruncado({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-ds-space-general-3xl @3xl:grid-cols-2 @3xl:items-center">
      <DocExamplePanel>
        <p className={sampleLabel}>Truncado intencional</p>
        <p className={cn('m-0 truncate text-ds-text-neutral-heading', bodySm400)}>
          Revisión trimestral de documentos y contratos para la oficina principal del equipo
        </p>
      </DocExamplePanel>
      <p className={docBody}>{children}</p>
    </div>
  );
}
