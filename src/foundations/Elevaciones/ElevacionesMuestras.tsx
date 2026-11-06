import type { CSSProperties, ReactNode } from 'react';
import { Chip } from '../../components/Chip';
import { DropdownMenuItem, DropdownMenuPanel } from '../../components/DropdownMenu';
import { InformationCard } from '../../components/InformationCard';
import { Tag } from '../../components/Tag';
import { DocDeviceFrame } from '../../docs/DocDeviceFrame';
import { ShrinkToFit } from '../../docs/DocParts';
import { cn } from '../../utils/cn';
import { THEMES, THEME_LABELS, colorInfo, pairRatio, ratioText } from '../Colores/colorData';
import type { TokenBreakpoint, TokenTheme } from '../_doc/tokensCss';
import { BREAKPOINTS_ASC, colorSombra, colorSombraTexto } from './elevacionData';
import type { ParBorde, SombraNombre } from './elevacionData';

/*
 * Muestras propias de Elevaciones (bloques `custom` y `preview` de la página): los tres niveles en oscuro y en claro, el
 * esquema de integración, la misma composición con componentes reales de CAOS, los ejemplos de Do and Dont’s y los de
 * accesibilidad. Las sombras son las de tokens.css (`shadow-ds-on-card`, `shadow-ds-on-canva-md`); los componentes son los
 * reales. Las muestras son ilustraciones: van con `inert` para que no sumen paradas de teclado. Las sombras que se pintan a
 * mano (solo en los ejemplos de lo que no se debe hacer) están marcadas.
 */

// ───────────────────────── base ─────────────────────────

const primary = 'font-ds-primitives-typography-family-primary';
const semibold = 'font-ds-primitives-typography-weight-semibold';

/** Etiqueta de una muestra (Body/Short text/Body-sm-600), como en Formas y Texturas. */
const sampleLabel = cn(primary, semibold, 'm-0 text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-heading');
/** Texto de cota y de muestra: 12/16. */
const small = cn(primary, 'text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-md');
const heading = cn(primary, semibold, 'text-ds-primitives-typography-size-xl leading-ds-primitives-typography-line-height-2xl text-ds-text-neutral-heading');
const body = cn(primary, 'text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-lg text-ds-text-neutral-body');

const SURFACE = 'bg-ds-background-container-surface';
const BORDER = 'border border-ds-border-general-default-on-card';

/** Sombras de los tres niveles. Primero y segundo usan las utilidades de tokens.css; el tercero suma el borde interior del DropdownMenu. */
const N1 = 'bg-ds-background-container-default-on-card shadow-ds-on-card rounded-ds-radius-general-xl';
const N2 = 'bg-ds-background-container-default-on-canva shadow-ds-on-canva-md rounded-ds-radius-container-on-card';
const N3: CSSProperties = {
  boxShadow: 'inset 0 0 0 var(--ds-primitives-stroke-lg) var(--color-ds-border-general-default-on-card), 0px 12px 28px -2px var(--color-ds-responsive-effect-shadow-on-canva-md)',
};
const N3_CLASS = 'bg-ds-background-field-surface rounded-ds-radius-field-md';

/**
 * Sombra pintada a mano para los ejemplos de lo que no se debe hacer: N01 al 100%, sin token. Con los tokens, en oscuro la
 * sombra vale 0% y el error no se vería.
 */
const SOMBRA_FUERTE = '0px 12px 40px 10px var(--color-ds-primitives-color-primary-n01)';
const SOMBRA_FILA = '0px 8px 16px 0px var(--color-ds-primitives-color-primary-n01)';

/**
 * Variables responsive de sombra de Mobile. El marco de dispositivo (`DocDeviceFrame` en Mobile, y el de Do and Dont’s) fija
 * en línea `--color-ds-responsive-effect-shadow-*: var(<ella misma>)` (error del generador de `breakpoints.generated.ts`): el
 * ciclo invalida la sombra y el `box-shadow` queda en `none`. Aquí se vuelve a apuntar a las variables de Mobile.
 */
const SOMBRAS_MOVIL = {
  '--color-ds-responsive-effect-shadow-on-card': 'var(--color-ds-background-effect-shadow-shadow-on-card-mobile)',
  '--color-ds-responsive-effect-shadow-on-canva-md': 'var(--color-ds-background-effect-shadow-shadow-on-canva-md-mobile)',
  '--color-ds-responsive-effect-shadow-on-canva-sm': 'var(--color-ds-background-effect-shadow-shadow-on-canva-sm-mobile)',
} as CSSProperties;

/** Ilustración: se ve pero no entra al foco ni al árbol de accesibilidad como controles. */
function Ilustracion({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div inert className={className} style={style}>
      {children}
    </div>
  );
}

/** Esquema que no se comprime: si no cabe, `ShrinkToFit` lo reduce entero (sin scroll horizontal). */
function Ajustar({ children, minWidth }: { children: ReactNode; minWidth: number }) {
  return (
    <ShrinkToFit>
      <div className="w-full" style={{ minWidth }}>
        {children}
      </div>
    </ShrinkToFit>
  );
}

/** Rótulo numerado de un nivel en una composición anotada. */
function Rotulo({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className={cn(small, 'flex w-fit items-center gap-ds-space-general-md rounded-full bg-ds-text-neutral-heading px-ds-space-general-lg py-ds-space-general-xs text-ds-background-container-surface tabular-nums')}>
      <span className={semibold}>{n}</span>
      <span>{children}</span>
    </span>
  );
}

// ───────────────────────── color de las sombras (tablas) ─────────────────────────

/** Damero de dos grises fijos con el color encima y su opacidad: 8% deja ver el damero y 0% lo deja entero. */
function Damero({ nombre, theme, bp }: { nombre: SombraNombre; theme: TokenTheme; bp: TokenBreakpoint }) {
  const c = colorSombra(nombre, theme, bp);
  const claro = colorInfo('--color-ds-primitives-color-primary-g03', theme);
  const medio = colorInfo('--color-ds-primitives-color-primary-g09', theme);
  if (!c || !claro || !medio) return <span>—</span>;
  return (
    <span
      aria-hidden="true"
      className="flex size-ds-primitives-dimention-xl shrink-0 overflow-hidden rounded-ds-radius-general-md border border-ds-border-general-default-on-card"
      style={{ background: `repeating-conic-gradient(${claro.hex} 0 25%, ${medio.hex} 0 50%) 0 0 / 8px 8px` }}
    >
      <span className="block size-full" style={{ background: `color-mix(in srgb, ${c.hex} ${c.percent}%, transparent)` }} />
    </span>
  );
}

/** Color de una sombra en un modo, por breakpoint: la muestra con su opacidad y su valor (primitivo y porcentaje). */
export function ColorSombraCelda({ nombre, theme }: { nombre: SombraNombre; theme: TokenTheme }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-ds-space-general-md p-0">
      {BREAKPOINTS_ASC.map(({ bp, label }) => {
        const c = colorSombra(nombre, theme, bp);
        return (
          <li key={bp} className="flex items-center gap-ds-space-general-lg whitespace-nowrap">
            <Damero nombre={nombre} theme={theme} bp={bp} />
            <span>
              <span className="text-ds-text-neutral-gray">{label}</span> {c ? colorSombraTexto(c) : '—'}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// ───────────────────────── niveles por modo ─────────────────────────

/** Caja de un nivel con su sombra real. El tercer nivel suma el borde interior de los flotantes. */
function Caja({ nivel, label, token }: { nivel: 1 | 2 | 3; label: string; token: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-ds-space-general-lg">
      <div
        className={cn('flex h-28 w-full items-center justify-center text-center', nivel === 1 ? N1 : nivel === 2 ? N2 : N3_CLASS)}
        style={nivel === 3 ? N3 : undefined}
      >
        <span className={cn(body, 'text-ds-text-neutral-heading')}>{label}</span>
      </div>
      <code className={cn(small, 'text-ds-text-neutral-body [overflow-wrap:anywhere]')}>{token}</code>
    </div>
  );
}

/** Los tres niveles sobre la superficie de un modo. `data-theme` fija el modo sin importar el tema de la página. */
function PanelModo({ theme }: { theme: TokenTheme }) {
  return (
    <div data-theme={theme} className={cn('flex flex-col gap-ds-space-general-4xl rounded-ds-radius-container-on-card p-ds-space-general-4xl', SURFACE, BORDER)}>
      <h3 className={sampleLabel}>Modo {THEME_LABELS[theme].toLowerCase()}</h3>
      <div className="grid grid-cols-3 gap-ds-space-general-4xl">
        <Caja nivel={1} label="Primer nivel" token="shadow-ds-on-card" />
        <Caja nivel={2} label="Segundo nivel" token="shadow-ds-on-canva-md" />
        <Caja nivel={3} label="Tercer nivel" token="shadow-ds-on-canva-md" />
      </div>
    </div>
  );
}

/** Los tres niveles en oscuro y en claro, cada uno con su sombra real. */
export function NivelesPorModo() {
  return (
    <Ilustracion>
      <Ajustar minWidth={460}>
        <div className="flex flex-col gap-ds-space-general-4xl">
          {THEMES.map((theme) => (
            <PanelModo key={theme} theme={theme} />
          ))}
        </div>
      </Ajustar>
    </Ilustracion>
  );
}

// ───────────────────────── integración (esquema) ─────────────────────────

/** Cómo se combinan los niveles: el primero dentro del segundo y el tercero encima de los dos. Cajas desnudas, sin componentes. */
export function EsquemaIntegracion() {
  return (
    <Ilustracion>
      <Ajustar minWidth={420}>
        <div className={cn('relative isolate flex flex-col gap-ds-space-general-lg rounded-ds-radius-container-on-canva p-ds-space-general-4xl', SURFACE, BORDER)}>
          <Rotulo n={2}>Segundo nivel</Rotulo>
          <div className={cn('flex flex-col gap-ds-space-general-lg p-ds-space-general-4xl', N2)}>
            <span className={heading}>Contenedor madre</span>
            <Rotulo n={1}>Primer nivel</Rotulo>
            <div className={cn('flex flex-col gap-ds-space-general-sm p-ds-space-general-xl', N1)}>
              <span className={cn(body, semibold, 'text-ds-text-neutral-heading')}>Elemento anidado</span>
              <span className={body}>Va dentro del contenedor madre.</span>
            </div>
          </div>
          <div className="relative -mt-6 flex flex-col items-end pr-ds-space-general-4xl">
            <div className={cn('relative flex w-3/5 flex-col gap-ds-space-general-sm p-ds-space-general-xl', N3_CLASS)} style={N3}>
              <span className="absolute top-ds-space-general-lg right-full mr-ds-space-general-lg whitespace-nowrap">
                <Rotulo n={3}>Tercer nivel</Rotulo>
              </span>
              <span className={cn(body, semibold, 'text-ds-text-neutral-heading')}>Elemento flotante</span>
              <span className={body}>Se superpone a los dos.</span>
            </div>
          </div>
        </div>
      </Ajustar>
    </Ilustracion>
  );
}

// ───────────────────────── composición con componentes ─────────────────────────

/** Menú flotante de tercer nivel: el panel real de DropdownMenu, en el flujo. */
function MenuFlotante() {
  return (
    <DropdownMenuPanel aria-label="Acciones" className="w-64">
      <DropdownMenuItem type="icon" icon="edit">
        Editar
      </DropdownMenuItem>
      <DropdownMenuItem type="icon" icon="document-copy">
        Duplicar
      </DropdownMenuItem>
      <DropdownMenuItem type="icon" icon="trash">
        Eliminar
      </DropdownMenuItem>
    </DropdownMenuPanel>
  );
}

/**
 * Vista de ejemplo con los tres niveles: un contenedor madre (InformationCard, segundo nivel), un elemento anidado con su
 * Chip (primer nivel) y un menú flotante (DropdownMenuPanel, tercer nivel) encima de los dos.
 */
function Vista({ notas = false }: { notas?: boolean }) {
  return (
    <div className={cn('relative isolate flex flex-col gap-ds-space-general-lg rounded-ds-radius-container-on-canva p-ds-space-container-on-canva', SURFACE)}>
      {notas && <Rotulo n={2}>Segundo nivel</Rotulo>}
      <InformationCard
        headingLevel="none"
        title="Plan semanal"
        description="Revisa las tareas y los mensajes pendientes."
        tags={<Tag size="sm">Hoy</Tag>}
      >
        <div className="flex flex-col gap-ds-space-general-md">
          {notas && <Rotulo n={1}>Primer nivel</Rotulo>}
          <div className={cn('flex items-center justify-between gap-ds-space-general-lg p-ds-space-general-xl', N1)}>
            <span className={cn(body, 'text-ds-text-neutral-heading')}>Tareas completadas</span>
            <Chip type="primary-box" icon={false}>
              12
            </Chip>
          </div>
        </div>
      </InformationCard>
      <div className="relative z-10 -mt-6 flex flex-col items-end pr-ds-space-general-4xl">
        <div className="relative">
          {notas && (
            <span className="absolute top-ds-space-general-lg right-full mr-ds-space-general-lg whitespace-nowrap">
              <Rotulo n={3}>Tercer nivel</Rotulo>
            </span>
          )}
          <MenuFlotante />
        </div>
      </div>
    </div>
  );
}

/** Composición anotada con los tres niveles numerados. */
export function ComposicionAnotada() {
  return (
    <Ilustracion>
      <Ajustar minWidth={460}>
        <Vista notas />
      </Ajustar>
    </Ilustracion>
  );
}

/** Vista de un breakpoint dentro de su marco: lienzo del ancho del token. */
function VistaPorBreakpoint({ bp }: { bp: TokenBreakpoint }) {
  return (
    <ShrinkToFit innerClassName="justify-start">
      <Ilustracion className={cn('w-ds-dimention-canva-width shrink-0 p-ds-space-canva-lateral', SURFACE)} style={bp === 'mobile' ? SOMBRAS_MOVIL : undefined}>
        <Vista />
      </Ilustracion>
    </ShrinkToFit>
  );
}

/** La misma vista en Desktop, Tablet y Mobile, cada una en su marco. */
export function ComposicionPorBreakpoint() {
  const frame = (bp: TokenBreakpoint, label: string) => (
    <div key={bp} className="flex min-w-0 flex-col gap-ds-space-general-xl">
      <h3 className={sampleLabel}>{label}</h3>
      <DocDeviceFrame breakpoint={bp}>
        <VistaPorBreakpoint bp={bp} />
      </DocDeviceFrame>
    </div>
  );
  const [mobile, tablet, desktop] = BREAKPOINTS_ASC;
  return (
    <div className="flex flex-col gap-ds-space-general-4xl">
      {frame(desktop.bp, desktop.label)}
      <div className="grid grid-cols-1 items-start gap-ds-space-general-4xl @3xl:grid-cols-[2fr_1fr]">
        {frame(tablet.bp, tablet.label)}
        {frame(mobile.bp, mobile.label)}
      </div>
    </div>
  );
}

// ───────────────────────── Do and Dont’s ─────────────────────────

/** Panel de una práctica: el ejemplo centrado. */
function Panel({ children }: { children: ReactNode }) {
  return (
    <Ilustracion className="mx-auto w-full max-w-[340px]" style={SOMBRAS_MOVIL}>
      {children}
    </Ilustracion>
  );
}

/** Elemento anidado de primer nivel: título y texto sobre la superficie de tarjeta, con su sombra o la que se le pase. */
function Elemento({ title, text, sombra }: { title: string; text: string; sombra?: string }) {
  return (
    <div className={cn('flex flex-col gap-ds-space-general-sm p-ds-space-general-xl', N1)} style={sombra ? { boxShadow: sombra } : undefined}>
      <span className={cn(body, semibold, 'text-ds-text-neutral-heading')}>{title}</span>
      <span className={body}>{text}</span>
    </div>
  );
}

/** El nivel sigue a la jerarquía: sombra de nivel en cada elemento (correcto), o una sombra mayor en el elemento secundario (incorrecto). */
export function MuestraJerarquia({ good }: { good: boolean }) {
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-xl p-ds-space-general-xl', N2)}>
        <span className={heading}>Resumen</span>
        <Elemento title="Tareas" text="12 completadas." />
        <Elemento title="Notas" text="3 sin leer." sombra={good ? undefined : SOMBRA_FUERTE} />
      </div>
    </Panel>
  );
}

/** Una sombra en el contenedor y líneas por dentro (correcto), o una sombra en cada fila (incorrecto). */
export function MuestraApilar({ good }: { good: boolean }) {
  const filas = ['Reunión de equipo', 'Revisión de metas', 'Plan del mes'];
  return (
    <Panel>
      <div className={cn('flex flex-col p-ds-space-general-xl', N2, good ? 'gap-0' : 'gap-ds-space-general-lg')}>
        <span className={cn(heading, 'pb-ds-space-general-lg')}>Agenda</span>
        {filas.map((fila, i) =>
          good ? (
            <span key={fila} className={cn(body, 'border-t border-ds-border-general-default-on-card py-ds-space-general-lg', i === 0 && 'border-t-0 pt-0')}>
              {fila}
            </span>
          ) : (
            <span
              key={fila}
              className={cn(body, 'rounded-ds-radius-general-xl bg-ds-background-container-default-on-card px-ds-space-general-xl py-ds-space-general-lg')}
              style={{ boxShadow: SOMBRA_FILA }}
            >
              {fila}
            </span>
          ),
        )}
      </div>
    </Panel>
  );
}

/**
 * Flotante con superficie y borde (correcto): el DropdownMenuPanel real. Flotante que solo tiene la sombra del token
 * (incorrecto): el mismo panel con el tono del contenedor y sin borde, que en oscuro se confunde con el fondo.
 */
export function MuestraSuperficieBorde({ good }: { good: boolean }) {
  const solo: CSSProperties = {
    boxShadow: '0px 12px 32px -2px var(--color-ds-responsive-effect-shadow-on-canva-md)',
    backgroundColor: 'var(--color-ds-background-container-default-on-canva)',
  };
  return (
    <Panel>
      <div className={cn('flex min-h-64 flex-col gap-ds-space-general-lg p-ds-space-general-xl', N2)}>
        <span className={heading}>Documento</span>
        <span className={body}>Elige una acción para el archivo.</span>
        <DropdownMenuPanel aria-label="Acciones" className="mt-ds-space-general-lg w-full self-end" style={good ? undefined : solo}>
          <DropdownMenuItem type="icon" icon="edit">
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem type="icon" icon="document-copy">
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuItem type="icon" icon="trash">
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuPanel>
      </div>
    </Panel>
  );
}

// ───────────────────────── accesibilidad ─────────────────────────

/** Contraste de una superficie o un borde contra lo que tiene detrás en un modo: la muestra lo dibuja, y el valor dice si llega a 3:1. */
export function DelimitaValor({ par, theme }: { par: ParBorde; theme: TokenTheme }) {
  const ratio = pairRatio(par.fg, par.bg, theme);
  const f = colorInfo(par.fg, theme);
  const b = colorInfo(par.bg, theme);
  if (ratio === undefined || !f || !b) return <span>Sin valor en este modo</span>;
  return (
    <span className="flex items-center gap-ds-space-general-lg">
      <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-ds-radius-general-lg p-ds-space-general-lg" style={{ background: b.css }}>
        <span
          className="block h-ds-primitives-dimention-xl w-ds-primitives-dimention-4xl rounded-ds-radius-general-md border-solid"
          style={par.tipo === 'superficie' ? { background: f.css, borderWidth: 0 } : { borderWidth: 'var(--ds-responsive-border-general-md)', borderColor: f.css }}
        />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-ds-text-neutral-heading tabular-nums">{ratioText(ratio)}</span>
        <span>{ratio >= 3 ? 'Cumple 3:1' : 'No cumple 3:1'}</span>
      </span>
    </span>
  );
}

/**
 * Simulación de colores forzados: los rellenos y las sombras se pierden y solo quedan el texto y los bordes. Con borde
 * (correcto) el menú se ve; solo con sombra (incorrecto) desaparece. Colores del sistema (`Canvas`, `ButtonText`), no de CAOS.
 */
export function MuestraColoresForzados({ good }: { good: boolean }) {
  const menu: CSSProperties = {
    background: 'Canvas',
    color: 'CanvasText',
    border: good ? '1px solid ButtonText' : '1px solid transparent',
  };
  return (
    <Panel>
      <div className="flex flex-col gap-ds-space-general-lg rounded-ds-radius-general-xl p-ds-space-general-4xl" style={{ background: 'Canvas', color: 'CanvasText', forcedColorAdjust: 'none' }}>
        <span className={cn(small, semibold)}>Vista con colores forzados (simulada)</span>
        <span className={body} style={{ color: 'CanvasText' }}>
          Documento
        </span>
        <span className={cn(body, 'flex flex-col gap-ds-space-general-md rounded-ds-radius-field-md p-ds-space-general-xl')} style={{ ...menu, color: 'CanvasText' }}>
          <span>Editar</span>
          <span>Duplicar</span>
          <span>Eliminar</span>
        </span>
      </div>
    </Panel>
  );
}
