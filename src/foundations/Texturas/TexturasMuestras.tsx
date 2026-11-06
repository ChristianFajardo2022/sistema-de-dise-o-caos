import type { CSSProperties, ReactNode } from 'react';
import { Backdrop } from '../../components/Backdrop';
import { Button } from '../../components/Button';
import { ModalPanel } from '../../components/Modal';
import { Tag } from '../../components/Tag';
import { DocDeviceFrame } from '../../docs/DocDeviceFrame';
import { ShrinkToFit } from '../../docs/DocParts';
import { cn } from '../../utils/cn';
import { colorInfo, ratioText } from '../Colores/colorData';
import type { TokenBreakpoint, TokenTheme } from '../_doc/tokensCss';
import lineas6 from './assets/patron-lineas-6.svg?raw';
import lineas7 from './assets/patron-lineas-7.svg?raw';
import lineas9 from './assets/patron-lineas-9.svg?raw';
import lineas10 from './assets/patron-lineas-10.svg?raw';
import { GLASS_CSS, REFERENCIA, colorCell, medir } from './texturaData';
import type { ParContraste } from './texturaData';

/*
 * Muestras propias de Texturas (bloques `custom` y `preview` de la página): el degradado, el glass, el blur, los
 * patrones de líneas, la misma composición con cada textura en su sitio, los ejemplos de Do and Dont’s y de accesibilidad.
 * Los componentes son los reales de CAOS. Las muestras son ilustraciones: van con `inert` para que no sumen paradas de
 * teclado. Los valores sueltos (el blanco de la luz del glass y su borde) están marcados en `texturaData.ts`.
 */

// ───────────────────────── base ─────────────────────────

const primary = 'font-ds-primitives-typography-family-primary';
const semibold = 'font-ds-primitives-typography-weight-semibold';

/** Etiqueta de una muestra (Body/Short text/Body-sm-600), como en Formas, Retículas y Contenedores. */
const sampleLabel = cn(primary, semibold, 'm-0 text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-heading');
/** Texto de cota y de muestra: 12/16. */
const small = cn(primary, 'text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-md');
const heading = cn(primary, semibold, 'text-ds-primitives-typography-size-xl leading-ds-primitives-typography-line-height-2xl text-ds-text-neutral-heading');
const body = cn(primary, 'text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-lg text-ds-text-neutral-body');

const SURFACE = 'bg-ds-background-container-surface';
const BORDER = 'border border-ds-border-general-default-on-card';

/** Degradado de contenedores principales: lineal a 45°, de N01 (0%) a A06 (100%), como indica Figma. Sin token. */
const GRADIENT = `bg-linear-${REFERENCIA.degradado.angulo} from-ds-primitives-color-primary-n01 to-ds-primitives-color-secondary-a06`;

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

/** Etiqueta oscura con el valor, como las de Figma. */
function ValueTag({ children }: { children: ReactNode }) {
  return (
    <span className={cn(small, 'inline-flex w-fit rounded-ds-radius-general-md bg-ds-text-neutral-heading px-ds-space-general-lg py-ds-space-general-sm tabular-nums text-ds-background-container-surface')}>
      {children}
    </span>
  );
}

/** Rótulo numerado de una textura en una composición anotada. */
function Rotulo({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className={cn(small, 'flex w-fit items-center gap-ds-space-general-md rounded-full bg-ds-text-neutral-heading px-ds-space-general-lg py-ds-space-general-xs text-ds-background-container-surface tabular-nums')}>
      <span className={semibold}>{n}</span>
      <span>{children}</span>
    </span>
  );
}

// ───────────────────────── fondo de colores ─────────────────────────

/**
 * Fondo de color para explicar el glass y el blur. Usa primitivos fijos (A06 de base): se ve igual en los dos modos,
 * porque la textura se explica sobre un fondo vivo.
 */
function Escena({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative isolate overflow-hidden rounded-ds-radius-container-on-card bg-ds-primitives-color-secondary-a06 p-ds-space-general-4xl', className)}>
      {children}
    </div>
  );
}

/**
 * Panel de vidrio con formas de color detrás de sus esquinas: asoman solo por el relleno del panel, así el efecto se ve en
 * los bordes y el texto no queda sobre una forma. Las formas cumplen 4,5:1 con texto B01 (A04, M04 y AI05).
 */
function Vidrio({ children, className, claro = false }: { children: ReactNode; className?: string; claro?: boolean }) {
  const circulo = claro ? 'bg-ds-primitives-color-secondary-a03' : 'bg-ds-primitives-color-secondary-a04';
  return (
    <div className={cn('relative isolate w-full max-w-sm', className)}>
      <span aria-hidden="true" className={cn('absolute -top-6 -left-6 -z-10 size-16 rounded-full', circulo)} />
      <span aria-hidden="true" className="absolute -top-8 right-10 -z-10 size-16 rounded-full bg-ds-primitives-color-tertiary-m04" />
      <span aria-hidden="true" className={cn('absolute -right-6 -bottom-6 -z-10 size-16 rounded-full', circulo)} />
      <span aria-hidden="true" className="absolute -bottom-3 -left-10 -z-10 h-6 w-40 -rotate-12 rounded-full bg-ds-primitives-color-information-ai05" />
      {children}
    </div>
  );
}

/** Formas vivas que cruzan el centro de la escena: lo que queda detrás de un panel sin relleno ni filtro. */
function FormasCentro() {
  return (
    <>
      <span aria-hidden="true" className="absolute top-6 left-1/3 -z-10 size-28 rounded-full bg-ds-primitives-color-secondary-a03" />
      <span aria-hidden="true" className="absolute right-1/4 bottom-4 -z-10 size-24 rounded-full bg-ds-primitives-color-tertiary-m03" />
      <span aria-hidden="true" className="absolute top-1/2 left-1/4 -z-10 h-8 w-64 -rotate-12 rounded-full bg-ds-primitives-color-information-ai04" />
    </>
  );
}

/** Formas sueltas de la escena (para el blur, donde no hay un panel de vidrio que las acompañe). */
function FormasDeFondo() {
  return (
    <>
      <span aria-hidden="true" className="absolute top-8 left-[18%] -z-10 size-24 rounded-full bg-ds-primitives-color-secondary-a04" />
      <span aria-hidden="true" className="absolute right-[22%] bottom-6 -z-10 size-28 rounded-full bg-ds-primitives-color-tertiary-m04" />
      <span aria-hidden="true" className="absolute top-[58%] left-[8%] -z-10 h-8 w-56 -rotate-12 rounded-full bg-ds-primitives-color-information-ai05" />
    </>
  );
}

// ───────────────────────── degradado ─────────────────────────

/** Contenedor con degradado: unicolor (siempre oscuro), así que su contenido usa los tokens de Dark. */
function ContenedorDegradado({ title, text, className, children }: { title: string; text: string; className?: string; children?: ReactNode }) {
  return (
    <div data-theme="dark" className={cn('flex flex-col gap-ds-space-general-lg rounded-ds-radius-container-on-card p-ds-space-general-4xl', GRADIENT, className)}>
      <span className={heading}>{title}</span>
      <span className={body}>{text}</span>
      {children}
    </div>
  );
}

/** Degradado lineal de 45° con sus dos extremos rotulados. */
export function MuestraDegradado() {
  return (
    <Ilustracion className="mx-auto flex w-full max-w-lg flex-col gap-ds-space-general-xl">
      <ContenedorDegradado title="Resumen de la semana" text="12 tareas completadas y 3 por revisar." className="min-h-44">
        <div>
          <Button size="sm">Ver detalle</Button>
        </div>
      </ContenedorDegradado>
      <div className="flex justify-between gap-ds-space-general-lg">
        <ValueTag>0%, N01</ValueTag>
        <ValueTag>100%, A06</ValueTag>
      </div>
    </Ilustracion>
  );
}

// ───────────────────────── glass ─────────────────────────

/** Estilo del efecto glass: desenfoque, saturación y brillo del filtro. La luz y el borde van en clases. */
const GLASS_STYLE = {
  backdropFilter: GLASS_CSS.filtro,
  WebkitBackdropFilter: GLASS_CSS.filtro,
} as const;

/** Clases del glass puro: solo efecto y luz a -45°, sin relleno. */
const GLASS_PURO = 'border border-white/25 bg-linear-135 from-white/20 to-transparent to-55%';
/** Clases del glass con opacidad: relleno B01 al 60%. */
const GLASS_OPACIDAD = 'border border-white/25 bg-ds-primitives-color-primary-b01/60';

/** Panel de glass puro. Su texto usa los tokens de Dark: el glass puro no tiene relleno y se lee sobre un fondo oscuro. */
function GlassPuro({ sombra = false, children }: { sombra?: boolean; children?: ReactNode }) {
  return (
    <div
      data-theme="dark"
      className={cn('flex w-full flex-col gap-ds-space-general-sm rounded-ds-radius-container-on-card p-ds-space-general-4xl', GLASS_PURO)}
      style={{ ...GLASS_STYLE, ...(sombra ? { boxShadow: '0 20px 40px 0 color-mix(in srgb, var(--color-ds-primitives-color-primary-n01) 85%, transparent)' } : null) }}
    >
      {children ?? (
        <>
          <span className={heading}>Glass puro</span>
          <span className={body}>Sin relleno: interviene el fondo del contenedor.</span>
        </>
      )}
    </div>
  );
}

/** Panel de glass con opacidad. El relleno es B01 (igual en los dos modos), así que el texto usa los tokens de Light. */
function GlassOpacidad({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div
      data-theme="light"
      className={cn('flex w-full flex-col gap-ds-space-general-sm rounded-ds-radius-container-on-card p-ds-space-general-4xl', GLASS_OPACIDAD, className)}
      style={GLASS_STYLE}
    >
      {children ?? (
        <>
          <span className={heading}>Glass con opacidad</span>
          <span className={cn(body, 'text-ds-text-neutral-heading')}>Relleno B01 al 60% para menús y modales flotantes.</span>
        </>
      )}
    </div>
  );
}

/** Glass puro sobre un fondo de color. */
export function MuestraGlassPuro() {
  return (
    <Ilustracion>
      <Escena className="flex min-h-72 items-center justify-center">
        <Vidrio>
          <GlassPuro />
        </Vidrio>
      </Escena>
    </Ilustracion>
  );
}

/** Glass con opacidad sobre un fondo de color. */
export function MuestraGlassOpacidad() {
  return (
    <Ilustracion>
      <Escena className="flex min-h-72 items-center justify-center">
        <Vidrio>
          <GlassOpacidad />
        </Vidrio>
      </Escena>
    </Ilustracion>
  );
}

// ───────────────────────── blur ─────────────────────────

/** Contenido de la vista que queda detrás del diálogo. */
function VistaDetras() {
  return (
    <div data-theme="dark" className="flex flex-col gap-ds-space-general-lg">
      <span className={heading}>Panel de equipo</span>
      <span className={body}>Esta vista se desenfoca al abrir el diálogo.</span>
      <div>
        <Button size="sm" variant="secondary">
          Nueva tarea
        </Button>
      </div>
    </div>
  );
}

/** Diálogo abierto: el `Backdrop` real (velo y desenfoque) entre la vista y el panel del Modal. */
export function MuestraBlur() {
  return (
    <Ilustracion>
      <Escena className="min-h-96 p-0">
        <FormasDeFondo />
        <div className="relative flex min-h-96 items-center justify-center p-ds-space-general-4xl">
          <div className="absolute inset-0 -z-10 p-ds-space-general-4xl">
            <VistaDetras />
          </div>
          <Backdrop position="absolute" className="-z-10" />
          <ModalPanel headingLevel={4} title="Mover a una carpeta" description="Elige el destino de los archivos." onClose={() => undefined} primaryAction={{ label: 'Mover' }} secondaryAction={{ label: 'Cancelar' }}>
            <span className={body}>El panel conserva su nitidez.</span>
          </ModalPanel>
        </div>
      </Escena>
    </Ilustracion>
  );
}

// ───────────────────────── patrones ─────────────────────────

const PATRONES = [
  { id: 'patron-lineas-6', svg: lineas6, name: 'Patrón de líneas 6' },
  { id: 'patron-lineas-7', svg: lineas7, name: 'Patrón de líneas 7' },
  { id: 'patron-lineas-9', svg: lineas9, name: 'Patrón de líneas 9' },
  { id: 'patron-lineas-10', svg: lineas10, name: 'Patrón de líneas 10' },
];

/** URL de descarga generada desde el SVG ya importado (`?raw`), sin importar cada archivo dos veces. */
const svgDownloadUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Los cuatro patrones de líneas, tintados con el color de texto del contenedor, con enlace de descarga. */
export function PatronesGrid() {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-ds-space-general-4xl p-0 tablet:grid-cols-2">
      {PATRONES.map((p) => (
        <li key={p.id} className="flex flex-col gap-ds-space-general-lg">
          <div
            role="img"
            aria-label={`${p.name}: líneas finas de contorno que se desvanecen`}
            className="aspect-square overflow-hidden rounded-ds-radius-container-on-card bg-ds-background-container-default-on-canva text-ds-text-neutral-heading [&>svg]:block [&>svg]:size-full"
            dangerouslySetInnerHTML={{ __html: p.svg }}
          />
          <span className={cn(body, 'flex items-center justify-between gap-ds-space-general-lg')}>
            <code>{p.id}.svg</code>
            <a href={svgDownloadUrl(p.svg)} download={`${p.id}.svg`} className="text-ds-text-neutral-heading underline underline-offset-4">
              Descargar<span className="sr-only"> {p.id}.svg</span>
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Patrón de líneas decorativo que cubre su contenedor, tintado con `currentColor`. */
function PatronFondo({ svg = lineas7, className }: { svg?: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden text-ds-text-neutral-body opacity-50 [&>svg]:block [&>svg]:size-full [&>svg]:object-cover', className)}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// ───────────────────────── composición ─────────────────────────

/** Menú flotante con glass con opacidad: dos acciones. Es la textura, no un control que la imite. */
function MenuFlotante({ className }: { className?: string }) {
  return (
    <GlassOpacidad className={cn('gap-ds-space-general-md p-ds-space-general-lg', className)}>
      <span className={cn(body, semibold, 'text-ds-text-neutral-heading')}>Acciones rápidas</span>
      <div className="flex flex-wrap gap-ds-space-general-md">
        <Button variant="secondary" size="xs">
          Nueva tarea
        </Button>
        <Button variant="secondary" size="xs">
          Invitar
        </Button>
      </div>
    </GlassOpacidad>
  );
}

/**
 * Pantalla de ejemplo: patrón de fondo, un contenedor principal con degradado, dos tarjetas lisas y un menú de glass. En
 * Tablet y Desktop el menú flota sobre el degradado; en Mobile va debajo.
 */
function Pantalla({ bp, notas = false, abierto = false }: { bp: TokenBreakpoint; notas?: boolean; abierto?: boolean }) {
  const flota = bp !== 'mobile';
  const menu = <MenuFlotante className="w-full max-w-64" />;
  return (
    <div className={cn('relative isolate flex flex-col gap-ds-space-general-4xl overflow-hidden rounded-ds-radius-container-on-canva p-ds-space-container-on-canva', SURFACE)}>
      <PatronFondo className="opacity-100" />
      {notas && <Rotulo n={1}>Patrón de fondo</Rotulo>}
      <div className="relative flex flex-col gap-ds-space-general-lg">
        {notas && <Rotulo n={2}>Degradado</Rotulo>}
        <ContenedorDegradado title="Reunión de equipo" text="Jueves, 10:00 · 6 personas">
          <div className="flex flex-wrap items-center gap-ds-space-general-lg">
            <Button size="sm">Unirse</Button>
            <Tag size="sm">Hoy</Tag>
          </div>
        </ContenedorDegradado>
        {flota && <div className="absolute top-ds-space-general-4xl right-ds-space-general-4xl">{menu}</div>}
        {!flota && (
          <div className="flex flex-col items-start gap-ds-space-general-sm pl-ds-space-general-4xl">
            {menu}
            {notas && <Rotulo n={3}>Glass con opacidad</Rotulo>}
          </div>
        )}
      </div>
      <div className={cn('grid gap-ds-space-general-4xl', flota ? 'grid-cols-2' : 'grid-cols-1')}>
        <TarjetaLisa title="Tareas" text="12 completadas esta semana." />
        <TarjetaLisa title="Mensajes" text="3 sin leer en el canal." />
      </div>
      {abierto && (
        <>
          <Backdrop position="absolute" className="z-10" />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-ds-space-general-lg p-ds-space-general-4xl">
            {notas && <Rotulo n={4}>Blur y velo</Rotulo>}
            <ModalPanel headingLevel={4} title="Salir de la reunión" description="Se cerrará tu sesión." onClose={() => undefined} primaryAction={{ label: 'Salir' }} secondaryAction={{ label: 'Cancelar' }} />
          </div>
        </>
      )}
    </div>
  );
}

/** Composición anotada: la vista con las tres primeras texturas y la misma vista con un diálogo abierto. */
export function ComposicionAnotada() {
  return (
    <Ilustracion className="grid grid-cols-1 gap-ds-space-general-4xl @3xl:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-ds-space-general-xl">
        <h3 className={sampleLabel}>Vista</h3>
        <Ajustar minWidth={400}>
          <Pantalla bp="mobile" notas />
        </Ajustar>
      </div>
      <div className="flex min-w-0 flex-col gap-ds-space-general-xl">
        <h3 className={sampleLabel}>Con un diálogo abierto</h3>
        <Ajustar minWidth={400}>
          <Pantalla bp="mobile" notas abierto />
        </Ajustar>
      </div>
    </Ilustracion>
  );
}

/** Pantalla de un breakpoint dentro de su marco: lienzo del ancho del token. */
function PantallaPorBreakpoint({ bp }: { bp: TokenBreakpoint }) {
  return (
    <ShrinkToFit innerClassName="justify-start">
      <Ilustracion className={cn('w-ds-dimention-canva-width shrink-0 p-ds-space-canva-lateral', SURFACE)}>
        <Pantalla bp={bp} />
      </Ilustracion>
    </ShrinkToFit>
  );
}

/** La misma composición en Desktop, Tablet y Mobile, cada una en su marco. */
export function ComposicionPorBreakpoint({ breakpoints }: { breakpoints: { bp: TokenBreakpoint; label: string }[] }) {
  const frame = (bp: TokenBreakpoint, label: string) => (
    <div key={bp} className="flex min-w-0 flex-col gap-ds-space-general-xl">
      <h3 className={sampleLabel}>{label}</h3>
      <DocDeviceFrame breakpoint={bp}>
        <PantallaPorBreakpoint bp={bp} />
      </DocDeviceFrame>
    </div>
  );
  const [mobile, tablet, desktop] = breakpoints;
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
  return <Ilustracion className="mx-auto w-full max-w-[340px]">{children}</Ilustracion>;
}

/** Tarjeta lisa, sin textura: título y texto sobre la superficie de tarjeta. */
function TarjetaLisa({ title, text, className }: { title: string; text: string; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-ds-space-general-sm rounded-ds-radius-container-on-card bg-ds-background-container-default-on-card p-ds-space-general-xl', BORDER, className)}>
      <span className={heading}>{title}</span>
      <span className={body}>{text}</span>
    </div>
  );
}

/** Bloque liso de una lista de ejemplo (sin textura). */
const liso = (title: string, text: string) => <TarjetaLisa key={title} title={title} text={text} />;

/** Lista de contenedores: `degradados` indica en qué posiciones lleva degradado. */
export function MuestraDegradados({ good }: { good: boolean }) {
  const items = [
    { title: 'Resumen', text: 'Semana del 3 al 7.' },
    { title: 'Reunión de equipo', text: 'Jueves, 10:00.' },
    { title: 'Tareas', text: '12 completadas.' },
    { title: 'Mensajes', text: '3 sin leer.' },
    { title: 'Plan del mes', text: 'Revisa las metas.' },
  ];
  const degradados = good ? [1, 4] : [1, 2, 3, 4];
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-lg rounded-ds-radius-container-on-canva bg-ds-background-container-default-on-canva p-ds-space-general-lg', BORDER)}>
        {items.map((it, i) =>
          degradados.includes(i) ? (
            <ContenedorDegradado key={it.title} title={it.title} text={it.text} className="p-ds-space-general-xl" />
          ) : (
            liso(it.title, it.text)
          ),
        )}
      </div>
    </Panel>
  );
}

/** Glass sin sombra (correcto) o con sombra de elevación (incorrecto). */
export function MuestraGlassSombra({ good }: { good: boolean }) {
  return (
    <Panel>
      <Escena className="flex min-h-56 items-center justify-center bg-ds-primitives-color-secondary-a04">
        <Vidrio claro>
          <GlassPuro sombra={!good}>
            <span className={heading}>Menú flotante</span>
            <span className={body}>{good ? 'Sin sombra: el fondo da el relieve.' : 'La sombra le quita su transparencia.'}</span>
          </GlassPuro>
        </Vidrio>
      </Escena>
    </Panel>
  );
}

/** Texto sobre glass: con relleno B01 y texto de contraste fijo (correcto), o glass puro sobre un color claro (incorrecto). */
export function MuestraTextoGlass({ good }: { good: boolean }) {
  return (
    <Panel>
      <div className="relative isolate flex min-h-56 items-center justify-center overflow-hidden rounded-ds-radius-container-on-card bg-ds-primitives-color-secondary-a03 p-ds-space-general-4xl">
        <span aria-hidden="true" className="absolute -right-8 -bottom-10 -z-10 size-28 rounded-full bg-ds-primitives-color-secondary-a06" />
        <div className="relative isolate w-full">
          {good ? (
            <GlassOpacidad>
              <span className={heading}>Nueva versión</span>
              <span className={body}>Revisa los cambios antes de publicar.</span>
            </GlassOpacidad>
          ) : (
            <div className={cn('flex w-full flex-col gap-ds-space-general-sm rounded-ds-radius-container-on-card p-ds-space-general-4xl text-ds-primitives-color-primary-b01', GLASS_PURO)} style={GLASS_STYLE}>
              <span className={cn(heading, 'text-inherit')}>Nueva versión</span>
              <span className={cn(body, 'text-inherit')}>Revisa los cambios antes de publicar.</span>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}

// ───────────────────────── accesibilidad ─────────────────────────

/** Contraste de un par en un modo: la muestra es el texto sobre el fondo ya compuesto, y el valor dice si llega a 4,5:1. */
export function TextoValor({ par, theme }: { par: ParContraste; theme: TokenTheme }) {
  const m = medir(par, theme);
  if (!m) return <span>Sin valor en este modo</span>;
  return (
    <span className="flex items-center gap-ds-space-general-lg">
      {/* La palabra va en un pseudoelemento: es una ilustración del par medido, no texto de la página que deba cumplir el contraste. */}
      <span
        aria-hidden="true"
        data-texto="Texto"
        className={cn(small, semibold, 'flex shrink-0 items-center justify-center rounded-ds-radius-general-lg px-ds-space-general-lg py-ds-space-general-md before:content-[attr(data-texto)]')}
        style={{ background: m.bg, color: m.fg }}
      />
      <span className="flex min-w-0 flex-col">
        <span className="text-ds-text-neutral-heading tabular-nums">{ratioText(m.ratio)}</span>
        <span>{m.ratio >= 4.5 ? 'Cumple 4,5:1' : 'No cumple 4,5:1'}</span>
      </span>
    </span>
  );
}

/** Color de un token en un modo, sobre la superficie de ese modo (para las tablas de variables). */
export function MuestraToken({ token, theme }: { token: string; theme: TokenTheme }) {
  const info = colorInfo(token, theme);
  const claro = colorInfo('--color-ds-primitives-color-primary-g03', theme);
  const medio = colorInfo('--color-ds-primitives-color-primary-g09', theme);
  if (!info || !claro || !medio) return <span>—</span>;
  // Damero de dos grises fijos con el color encima y su opacidad: 5% deja ver el damero y 80% lo tapa casi del todo
  return (
    <span
      aria-hidden="true"
      className="flex size-ds-primitives-dimention-xl overflow-hidden rounded-ds-radius-general-md border border-ds-border-general-default-on-card"
      style={{ background: `repeating-conic-gradient(${claro.hex} 0 25%, ${medio.hex} 0 50%) 0 0 / 8px 8px` }}
    >
      <span className="block size-full" style={{ background: `color-mix(in srgb, ${info.hex} ${info.percent}%, transparent)` }} />
    </span>
  );
}

/** Celda de una tabla de tokens: la muestra del color sobre la superficie del modo y su valor (primitivo y opacidad). */
export function ValorToken({ token, theme }: { token: string; theme: TokenTheme }) {
  return (
    <span className="flex items-center gap-ds-space-general-lg">
      <MuestraToken token={token} theme={theme} />
      <span>{colorCell(token, theme)}</span>
    </span>
  );
}

/** Texto sobre un patrón: en una tarjeta con fondo sólido (correcto) o directo sobre las líneas (incorrecto). */
export function MuestraTextoPatron({ good }: { good: boolean }) {
  return (
    <Panel>
      <div className={cn('relative isolate flex min-h-56 items-center justify-center overflow-hidden rounded-ds-radius-container-on-card p-ds-space-general-4xl', SURFACE, BORDER)}>
        {/* Dos capas del mismo patrón, ampliado, para que las líneas se lean también en claro */}
        <PatronFondo svg={lineas9} className="text-ds-text-neutral-heading opacity-100 [&>svg]:scale-150" />
        <PatronFondo svg={lineas9} className="text-ds-text-neutral-heading opacity-100 [&>svg]:scale-150" />
        {good ? (
          <div className={cn('flex w-full flex-col gap-ds-space-general-sm rounded-ds-radius-container-on-card p-ds-space-general-4xl', SURFACE, BORDER)}>
            <span className={heading}>Resumen</span>
            <span className={body}>El texto va sobre una tarjeta sólida.</span>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-ds-space-general-sm p-ds-space-general-4xl">
            <span className={heading}>Resumen</span>
            <span className={body}>El texto va directo sobre las líneas.</span>
          </div>
        )}
      </div>
    </Panel>
  );
}

/**
 * Respaldo del glass: con relleno sólido (correcto) o solo con el efecto, que sin `backdrop-filter` deja el texto sobre el
 * fondo vivo (incorrecto). Simula el navegador sin soporte o con transparencia reducida: quita el filtro.
 */
export function MuestraRespaldo({ good }: { good: boolean }) {
  return (
    <Panel>
      <Escena className="flex min-h-56 items-center justify-center">
        <FormasCentro />
        <div className="relative isolate w-full">
          {good ? (
            <div className={cn('flex w-full flex-col gap-ds-space-general-sm rounded-ds-radius-container-on-card p-ds-space-general-4xl', SURFACE, BORDER)}>
              <span className={heading}>Menú flotante</span>
              <span className={body}>Sin el filtro, el relleno sólido mantiene el texto legible.</span>
            </div>
          ) : (
            <div data-theme="dark" className={cn('flex w-full flex-col gap-ds-space-general-sm rounded-ds-radius-container-on-card p-ds-space-general-4xl', GLASS_PURO)}>
              <span className={heading}>Menú flotante</span>
              <span className={body}>Sin el filtro, el texto queda sobre el fondo de color.</span>
            </div>
          )}
        </div>
      </Escena>
    </Panel>
  );
}
