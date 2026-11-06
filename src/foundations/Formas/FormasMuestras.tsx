import type { CSSProperties, ReactNode } from 'react';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Input } from '../../components/Input';
import { Tag } from '../../components/Tag';
import { DocDeviceFrame } from '../../docs/DocDeviceFrame';
import { ShrinkToFit } from '../../docs/DocParts';
import { cn } from '../../utils/cn';
import { colorInfo, pairRatio, ratioText } from '../Colores/colorData';
import type { TokenBreakpoint, TokenTheme } from '../_doc/tokensCss';
import { px } from '../_doc/tokensCss';
import { BREAKPOINTS_ASC, NIVELES, VARS, pxText, radiusAt, radiusVarAt } from './formaData';

/*
 * Muestras propias de Formas (bloques `custom` y `preview` de la página): las formas básicas, los radios anidados, los
 * rangos de radio, las líneas, la misma composición en cada breakpoint y los ejemplos de Do and Dont’s y de
 * accesibilidad. Los radios y los grosores salen de tokens.css (`formaData.ts`); los componentes son los reales de CAOS.
 * Las muestras son ilustraciones: van con `inert` para que no sumen paradas de teclado.
 */

// ───────────────────────── base ─────────────────────────

const primary = 'font-ds-primitives-typography-family-primary';
const semibold = 'font-ds-primitives-typography-weight-semibold';

/** Etiqueta de una muestra (Body/Short text/Body-sm-600), como en Tipografía, Colores, Retículas y Contenedores. */
const sampleLabel = cn(primary, semibold, 'm-0 text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-heading');
/** Texto de cota y de muestra: 12/16. */
const small = cn(primary, 'text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-md');
const heading = cn(primary, semibold, 'text-ds-primitives-typography-size-xl leading-ds-primitives-typography-line-height-2xl text-ds-text-neutral-heading');
const body = cn(primary, 'text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-lg text-ds-text-neutral-body');

const SURFACE = 'bg-ds-background-container-surface';
const BORDER = 'border border-ds-border-general-default-on-card';

/** Relleno de cada nivel de los esquemas anidados: los mismos cuatro de Contenedores y espacios. */
const NIVEL_FILL = [
  'bg-ds-background-graphic-error-secondary-opacity',
  'bg-ds-background-graphic-alert-secondary-opacity',
  'bg-ds-background-graphic-success-secondary-opacity',
  'bg-ds-background-graphic-information-secondary-opacity',
] as const;

/** Ilustración: se ve pero no entra al foco ni al árbol de accesibilidad como controles. */
function Ilustracion({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div inert className={className} style={style}>
      {children}
    </div>
  );
}

/**
 * Esquema que no se comprime: si no cabe, `ShrinkToFit` lo reduce entero (sin scroll horizontal). `minWidth` es el
 * ancho al que se dibuja antes de reducirse.
 */
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

/** Radio de un token responsive en un breakpoint, como estilo en línea (se dibuja a ese breakpoint, sin importar la ventana). */
const radiusStyle = (token: string, bp: TokenBreakpoint): CSSProperties => ({ borderRadius: radiusVarAt(token, bp) });

// ───────────────────────── formas ─────────────────────────

/** Tres cuadrados con radio: el radio sube con el tamaño del contenedor. */
export function MuestraCuadrada() {
  const items = [
    { token: VARS.general('md'), className: 'size-ds-primitives-dimention-2xl rounded-ds-radius-general-md' },
    { token: VARS.general('lg'), className: 'size-ds-primitives-dimention-5xl rounded-ds-radius-general-lg' },
    { token: VARS.general('xl'), className: 'h-ds-primitives-dimention-6xl w-28 rounded-ds-radius-general-xl' },
  ];
  return (
    <Ilustracion className="flex flex-wrap items-end gap-ds-space-general-4xl">
      {items.map((item) => (
        <div key={item.token} className="flex flex-col items-start gap-ds-space-general-lg">
          <span aria-hidden="true" className={cn('block bg-ds-text-neutral-heading', item.className)} />
          <ValueTag>{pxText(radiusAt(item.token, 'mobile'))}</ValueTag>
        </div>
      ))}
    </Ilustracion>
  );
}

/** Formas circulares: el avatar en sus cuatro tamaños, un botón circular y una píldora. Mantienen la proporción. */
export function MuestraCircular() {
  const avatars = ['xs', 'sm', 'md', 'lg'] as const;
  return (
    <Ilustracion className="flex flex-col gap-ds-space-general-4xl">
      <div className="flex flex-wrap items-end gap-ds-space-general-4xl">
        {avatars.map((size) => (
          <div key={size} className="flex flex-col items-start gap-ds-space-general-lg">
            <Avatar variant="initials" size={size} name="Ana Pérez" />
            <ValueTag>{pxText(px(`--ds-responsive-dimention-avatar-${size}`))}</ValueTag>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-ds-space-general-xl">
        <Button size="sm">Continuar</Button>
        <Tag size="sm">Nuevo</Tag>
      </div>
    </Ilustracion>
  );
}

// ───────────────────────── radios anidados ─────────────────────────

/** Contenedores anidados: cada nivel dibuja el radio de su token y lo rotula arriba. */
function Anidado({ bp, index = 0 }: { bp: 'mobile' | 'desktop'; index?: number }) {
  const niveles = NIVELES[bp];
  const nivel = niveles[index];
  const last = index === niveles.length - 1;
  return (
    <div className={cn('flex flex-col gap-ds-space-general-lg p-ds-space-general-xl', BORDER, NIVEL_FILL[index])} style={radiusStyle(nivel.token, bp)}>
      <span className={cn(small, 'flex flex-wrap items-baseline gap-x-ds-space-general-lg text-ds-text-neutral-heading')}>
        <span className={cn(semibold, 'tabular-nums')}>{pxText(radiusAt(nivel.token, bp))}</span>
        <span className="text-ds-text-neutral-body [overflow-wrap:anywhere]">{nivel.token.replace('--ds-responsive-', '')}</span>
      </span>
      {last ? <div aria-hidden="true" className="h-ds-primitives-dimention-xl" /> : <Anidado bp={bp} index={index + 1} />}
    </div>
  );
}

/** Esquema de radios anidados: Móvil y Escritorio, con el token de cada nivel. */
export function RadiosAnidados() {
  const bps = [
    { bp: 'mobile', label: 'Móvil' },
    { bp: 'desktop', label: 'Escritorio' },
  ] as const;
  return (
    <Ilustracion className="grid grid-cols-1 gap-ds-space-general-4xl @3xl:grid-cols-2">
      {bps.map(({ bp, label }) => (
        <div key={bp} className="flex min-w-0 flex-col gap-ds-space-general-lg">
          <p className={sampleLabel}>{label}</p>
          <Ajustar minWidth={300}>
            <Anidado bp={bp} />
          </Ajustar>
        </div>
      ))}
    </Ilustracion>
  );
}

// ───────────────────────── rangos de radio ─────────────────────────

/** Caja con el radio de un token en un breakpoint, rotulada con su valor. */
function CajaRadio({ token, bp, label, className }: { token: string; bp: TokenBreakpoint; label?: string; className: string }) {
  return (
    <div className="flex flex-col items-start gap-ds-space-general-lg">
      {label && <p className={cn(small, 'm-0 text-ds-text-neutral-body')}>{label}</p>}
      <span aria-hidden="true" className={cn('block bg-ds-background-tab-select-on-canva', BORDER, className)} style={radiusStyle(token, bp)} />
      <ValueTag>{pxText(radiusAt(token, bp))}</ValueTag>
    </div>
  );
}

/** El mismo token de contenedor en Móvil y en Escritorio (24 y 32, o 16 y 24 px). */
export function MuestraRangoContenedor({ token, className }: { token: string; className: string }) {
  return (
    <Ilustracion className="flex flex-wrap items-end gap-ds-space-general-4xl">
      <CajaRadio token={token} bp="mobile" label="Móvil" className={className} />
      <CajaRadio token={token} bp="desktop" label="Escritorio" className={className} />
    </Ilustracion>
  );
}

/** Contenedores pequeños: menos de 40 px llevan 8 px; de 40 a 70 px, 12 px. */
export function MuestraPequenos() {
  return (
    <Ilustracion className="flex flex-wrap items-end gap-ds-space-general-4xl">
      <CajaRadio token={VARS.general('md')} bp="mobile" label="Menos de 40 px" className="size-ds-primitives-dimention-2xl" />
      <CajaRadio token={VARS.general('lg')} bp="mobile" label="De 40 a 70 px" className="size-ds-primitives-dimention-5xl" />
    </Ilustracion>
  );
}

/** Elementos totalmente redondeados: botón, etiqueta y chip, con el radio de los componentes reales. */
export function MuestraPildoras() {
  return (
    <Ilustracion className="flex flex-col items-start gap-ds-space-general-xl">
      <div className="flex flex-wrap items-center gap-ds-space-general-xl">
        <Button size="sm">Continuar</Button>
        <Tag size="sm">Nuevo</Tag>
        <Chip icon={false}>Filtro</Chip>
      </div>
      <ValueTag>{pxText(radiusAt(VARS.full, 'mobile'))}</ValueTag>
    </Ilustracion>
  );
}

// ───────────────────────── líneas ─────────────────────────

/** Tres líneas de 1, 2 y 3 px, para comparar el grosor. */
export function MuestraGrosores() {
  return (
    <Ilustracion className="mx-auto flex w-full max-w-xl flex-col gap-ds-space-general-4xl">
      {[1, 2, 3].map((w) => (
        <div key={w} className="flex items-center gap-ds-space-general-4xl">
          <span className="w-14 shrink-0">
            <ValueTag>{pxText(w)}</ValueTag>
          </span>
          <span aria-hidden="true" className="block flex-1 bg-ds-text-neutral-heading" style={{ height: w }} />
        </div>
      ))}
    </Ilustracion>
  );
}

/**
 * Línea de un grosor dado. Chrome redondea `border-width` a píxeles enteros (0,2, 0,5 y 1,5 px salen como 1 px), así que
 * la línea es una caja de 1 px escalada en vertical: `scaleY` no se redondea y el trazo se dibuja con el grosor real.
 */
export function MuestraTrazo({ width }: { width: number }) {
  return (
    <span aria-hidden="true" className="flex h-4 w-24 items-center">
      <span
        data-stroke={width}
        className="block h-px w-full bg-ds-text-neutral-heading"
        style={{ transform: `scaleY(${width})`, visibility: width > 0 ? 'visible' : 'hidden' }}
      />
    </span>
  );
}

/** Muestra de un radio primitivo en la tabla de variables. */
export function MuestraRadioPrimitivo({ value }: { value: number }) {
  return (
    <span aria-hidden="true" className={cn('block size-ds-primitives-dimention-3xl bg-ds-background-tab-select-on-canva', BORDER)} style={{ borderRadius: `${value}px` }} />
  );
}

/** Formulario con campos y botones: los controles se delimitan con una línea de 1 px. */
export function MuestraLinea1px() {
  return (
    <Ajustar minWidth={420}>
      <Ilustracion className={cn('mx-auto flex w-full max-w-[560px] flex-col gap-ds-space-general-4xl rounded-ds-radius-container-on-card p-ds-space-container-on-card', BORDER, SURFACE)}>
        <span className={heading}>Datos de contacto</span>
        <div className="grid grid-cols-2 gap-ds-space-general-2xl">
          <Input label="Nombre" placeholder="Ana Pérez" fullWidth />
          <Input label="Correo electrónico" placeholder="ana@correo.com" fullWidth />
        </div>
        <div className="flex justify-end gap-ds-space-general-lg">
          <Button variant="secondary" size="sm">
            Cancelar
          </Button>
          <Button size="sm">Guardar</Button>
        </div>
      </Ilustracion>
    </Ajustar>
  );
}

/** Divisor de sección: una línea de 2 a 3 px separa dos grupos de contenido. */
export function MuestraDivisor() {
  return (
    <Ilustracion className={cn('mx-auto flex w-full max-w-[480px] flex-col gap-ds-space-general-4xl rounded-ds-radius-container-on-card p-ds-space-container-on-card', BORDER, SURFACE)}>
      <div className="flex flex-col gap-ds-space-general-md">
        <span className={heading}>Resumen semanal</span>
        <span className={body}>Revisa los avances del equipo.</span>
      </div>
      <hr aria-hidden="true" className="m-0 border-0 bg-ds-border-general-gray-fourth" style={{ height: 3 }} />
      <div className="flex flex-col gap-ds-space-general-md">
        <span className={heading}>Próximos pasos</span>
        <span className={body}>Define las prioridades de la semana.</span>
      </div>
    </Ilustracion>
  );
}

// ───────────────────────── radio según el contenedor ─────────────────────────

/** Rótulo de un nivel del esquema anotado: número y token. */
function Rotulo({ n, token, bp }: { n: number; token: string; bp: TokenBreakpoint }) {
  return (
    <span className={cn(small, 'flex w-fit items-center gap-ds-space-general-md rounded-full bg-ds-text-neutral-heading px-ds-space-general-lg py-ds-space-general-xs text-ds-background-container-surface tabular-nums')}>
      <span className={semibold}>{n}</span>
      <span>{pxText(radiusAt(token, bp))}</span>
      <span className="opacity-80">{token.replace('--ds-responsive-radius-', '')}</span>
    </span>
  );
}

/** La misma tarjeta con contenido anidado: cada nivel lleva el radio de su token, rotulado. */
export function TarjetaAnotada() {
  const bp: TokenBreakpoint = 'desktop';
  const [, , l3, l4] = NIVELES.desktop.map((n) => n.token);
  return (
    <Ajustar minWidth={520}>
      <Ilustracion className="mx-auto w-full max-w-[640px]">
        <div className={cn('flex flex-col gap-ds-space-general-xl bg-ds-background-container-default-on-canva p-ds-space-general-4xl', BORDER)} style={radiusStyle(VARS.onCanva, bp)}>
          <Rotulo n={1} token={VARS.onCanva} bp={bp} />
          <div className={cn('flex flex-col gap-ds-space-general-xl p-ds-space-general-4xl', BORDER, SURFACE)} style={radiusStyle(VARS.onCard, bp)}>
            <Rotulo n={2} token={VARS.onCard} bp={bp} />
            <div className="flex items-center gap-ds-space-general-xl">
              <Avatar variant="initials" size="md" name="Ana Pérez" />
              <span className="flex flex-col">
                <span className={heading}>Ana Pérez</span>
                <span className={body}>Diseñadora de producto</span>
              </span>
            </div>
            <div className="flex flex-col gap-ds-space-general-lg bg-ds-background-tab-select-on-canva p-ds-space-general-2xl" style={radiusStyle(l3, bp)}>
              <Rotulo n={3} token={l3} bp={bp} />
              <span className={body}>Diseña flujos y componentes, y coordina las pruebas de uso.</span>
              <div className={cn('w-fit bg-ds-background-container-surface p-ds-space-general-lg', BORDER)} style={radiusStyle(l4, bp)}>
                <Rotulo n={4} token={l4} bp={bp} />
                <span className="flex items-center gap-ds-space-general-md">
                  <Avatar variant="icon" icon="info-circle" size="xs" />
                  <span className={cn(body, 'text-ds-primitives-typography-size-sm')}>Nota breve</span>
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-ds-space-general-lg">
              <Button variant="secondary" size="sm">
                Ver perfil
              </Button>
              <Button size="sm">Contactar</Button>
              <Tag size="sm">2 años</Tag>
            </div>
          </div>
        </div>
      </Ilustracion>
    </Ajustar>
  );
}

// ───────────────────────── composición por breakpoint ─────────────────────────

const TARJETAS = [
  { title: 'Reunión de equipo', text: 'Revisión de avances y próximos pasos.', tag: 'Hoy', who: 'Ana Pérez' },
  { title: 'Taller de diseño', text: 'Ejercicio práctico sobre jerarquía visual.', tag: 'Mañana', who: 'Marta Ortiz' },
  { title: 'Cierre del trimestre', text: 'Resumen de resultados y aprendizajes.', tag: 'Viernes', who: 'Pablo Rojas' },
];

/** Tarjeta de la composición: radio de contenedor sobre tarjeta, bloque interno general y botón de píldora. */
function TarjetaEvento({ title, text, tag, who }: (typeof TARJETAS)[number]) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-ds-space-general-lg rounded-ds-radius-container-on-card p-ds-space-container-on-card', BORDER, SURFACE)}>
      <div className="flex items-center justify-between gap-ds-space-general-lg">
        <Avatar variant="initials" size="sm" name={who} />
        <Tag size="sm">{tag}</Tag>
      </div>
      <div className="flex flex-1 flex-col gap-ds-space-general-md rounded-ds-radius-general-lg bg-ds-background-tab-select-on-canva p-ds-space-general-2xl">
        <p className={cn(heading, 'm-0')}>{title}</p>
        <p className={cn(body, 'm-0')}>{text}</p>
      </div>
      <div>
        <Button variant="secondary" size="xs">
          Ver detalles
        </Button>
      </div>
    </div>
  );
}

/** Pantalla de un breakpoint: lienzo del ancho del token, contenedor con radio sobre el lienzo y tarjetas con el de tarjeta. */
function PantallaComposicion({ bp }: { bp: TokenBreakpoint }) {
  const cols = bp === 'desktop' ? 'grid-cols-3' : bp === 'tablet' ? 'grid-cols-2' : 'grid-cols-1';
  const cards = bp === 'tablet' ? TARJETAS.slice(0, 2) : TARJETAS;
  return (
    <ShrinkToFit innerClassName="justify-start">
      <Ilustracion className={cn('w-ds-dimention-canva-width shrink-0 p-ds-space-canva-lateral', SURFACE)}>
        <div className={cn('flex flex-col rounded-ds-radius-container-on-canva bg-ds-background-container-default-on-canva p-ds-space-container-on-canva', BORDER)}>
          <div className={cn('grid gap-ds-space-general-4xl', cols)}>
            {cards.map((c) => (
              <TarjetaEvento key={c.title} {...c} />
            ))}
          </div>
        </div>
      </Ilustracion>
    </ShrinkToFit>
  );
}

/** La misma composición en Desktop, Tablet y Mobile, cada una en su marco con los radios de su breakpoint. */
export function ComposicionPorBreakpoint() {
  const frame = (bp: TokenBreakpoint, label: string) => (
    <div key={bp} className="flex min-w-0 flex-col gap-ds-space-general-xl">
      <h3 className={sampleLabel}>{label}</h3>
      <DocDeviceFrame breakpoint={bp}>
        <PantallaComposicion bp={bp} />
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

/** Panel de una práctica: el ejemplo centrado sobre la superficie. */
function Panel({ children }: { children: ReactNode }) {
  return <Ilustracion className="mx-auto w-full max-w-[340px]">{children}</Ilustracion>;
}

/** Rótulo de un nivel en los ejemplos de Do and Dont’s: el radio, en una etiqueta oscura. */
function Nivel({ children }: { children: ReactNode }) {
  return <ValueTag>{children}</ValueTag>;
}

/** Tarjeta de perfil con tres niveles anidados: cada nivel baja de radio (correcto) o los tres valen igual (incorrecto). */
export function MuestraConsistencia({ good }: { good: boolean }) {
  const bp: TokenBreakpoint = 'mobile';
  const [outer, mid, inner] = good ? [VARS.onCanva, VARS.onCard, VARS.general('lg')] : [VARS.onCard, VARS.onCard, VARS.onCard];
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-lg bg-ds-background-container-default-on-canva p-ds-space-general-lg', BORDER)} style={radiusStyle(outer, bp)}>
        <Nivel>{pxText(radiusAt(outer, bp))}</Nivel>
        <div className={cn('flex flex-col gap-ds-space-general-lg p-ds-space-general-lg', BORDER, SURFACE)} style={radiusStyle(mid, bp)}>
          <Nivel>{pxText(radiusAt(mid, bp))}</Nivel>
          <div className="flex items-center gap-ds-space-general-lg">
            <Avatar variant="initials" size="sm" name="Ana Pérez" />
            <span className={heading}>Ana Pérez</span>
          </div>
          <div className={cn('flex flex-col gap-ds-space-general-md bg-ds-background-tab-select-on-canva p-ds-space-general-lg', BORDER)} style={radiusStyle(inner, bp)}>
            <Nivel>{pxText(radiusAt(inner, bp))}</Nivel>
            <span className={cn(body, 'text-ds-primitives-typography-size-sm')}>Diseña flujos y componentes.</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/** Tarjeta de ajustes con el radio de su breakpoint (correcto) o con los de móvil en los dos (incorrecto). */
function TarjetaAjustes({ radiusBp, label }: { radiusBp: 'mobile' | 'desktop'; label: string }) {
  const [outer, , , inner] = NIVELES[radiusBp].map((n) => n.token);
  return (
    <div className="flex flex-col gap-ds-space-general-lg">
      <ValueTag>{label}</ValueTag>
      <div className={cn('flex flex-col gap-ds-space-general-lg bg-ds-background-container-default-on-canva p-ds-space-general-lg', BORDER)} style={radiusStyle(outer, radiusBp)}>
        <span className={heading}>Ajustes</span>
        {['Notificaciones', 'Privacidad'].map((row) => (
          <span key={row} className={cn(body, 'flex items-center gap-ds-space-general-lg bg-ds-background-container-surface p-ds-space-general-lg', BORDER)} style={radiusStyle(inner, radiusBp)}>
            <Avatar variant="icon" icon="setting" size="xs" />
            {row}
          </span>
        ))}
        <span className={cn(small, 'text-ds-text-neutral-body tabular-nums')}>
          Tarjeta {pxText(radiusAt(outer, radiusBp))} · filas {pxText(radiusAt(inner, radiusBp))}
        </span>
      </div>
    </div>
  );
}

/** Mismo componente en móvil y escritorio: los radios cambian (correcto) o se repiten los de móvil (incorrecto). */
export function MuestraAdaptabilidad({ good }: { good: boolean }) {
  return (
    <Panel>
      <div className="flex flex-col gap-ds-space-general-xl">
        <TarjetaAjustes radiusBp="mobile" label="Móvil" />
        <TarjetaAjustes radiusBp={good ? 'desktop' : 'mobile'} label="Escritorio" />
      </div>
    </Panel>
  );
}

/** Grosor de línea: 1 px y jerarquía con espacio y color (correcto) o líneas de 3 px en todo (incorrecto). */
export function MuestraLineas({ good }: { good: boolean }) {
  const line = good ? undefined : ({ borderWidth: 3, borderStyle: 'solid' } as CSSProperties);
  const border = good ? BORDER : 'border-ds-border-general-gray-fourth';
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-xl rounded-ds-radius-container-on-card p-ds-space-general-xl', border, SURFACE)} style={line}>
        <div className="flex items-center justify-between gap-ds-space-general-lg">
          <span className={heading}>Resumen</span>
          <Tag size="sm" type="info" className={cn(!good && 'border-ds-border-semantic-information')} style={line}>
            Nuevo
          </Tag>
        </div>
        <div className={cn('flex flex-col gap-ds-space-general-md rounded-ds-radius-general-lg bg-ds-background-tab-select-on-canva p-ds-space-general-xl', border)} style={line}>
          <span className={body}>Revisa los avances del equipo.</span>
        </div>
        <Button size="sm" variant="secondary" fullWidth className={cn(!good && 'border-ds-border-general-gray-fourth')} style={line}>
          Ver detalles
        </Button>
      </div>
    </Panel>
  );
}

// ───────────────────────── accesibilidad ─────────────────────────

/** Contraste de un borde contra su superficie en un modo: la muestra dibuja el borde, y el valor dice si llega a 3:1. */
export function BordeValor({ fg, bg, theme }: { fg: string; bg: string; theme: TokenTheme }) {
  const ratio = pairRatio(fg, bg, theme);
  const f = colorInfo(fg, theme);
  const b = colorInfo(bg, theme);
  if (ratio === undefined || !f || !b) return <span>Sin valor en este modo</span>;
  return (
    <span className="flex items-center gap-ds-space-general-lg">
      <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-ds-radius-general-lg p-ds-space-general-lg" style={{ background: b.css }}>
        <span
          className="block h-ds-primitives-dimention-xl w-ds-primitives-dimention-4xl rounded-ds-radius-general-md border-solid"
          style={{ borderWidth: 'var(--ds-responsive-border-general-md)', borderColor: f.css }}
        />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-ds-text-neutral-heading tabular-nums">{ratioText(ratio)}</span>
        <span>{ratio >= 3 ? 'Cumple 3:1' : 'No cumple 3:1'}</span>
      </span>
    </span>
  );
}

/** Estado en una lista: forma y texto (correcto) o solo la forma (incorrecto). */
export function MuestraSoloForma({ good }: { good: boolean }) {
  const rows = [
    { name: 'Notificaciones', shape: 'rounded-full', text: 'Activo' },
    { name: 'Respaldo', shape: 'rounded-none', text: 'Pausado' },
  ];
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-lg rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE)}>
        <span className={heading}>Servicios</span>
        {rows.map((row) => (
          <div key={row.name} className={cn(body, 'flex items-center justify-between gap-ds-space-general-lg')}>
            <span>{row.name}</span>
            <span className="flex items-center gap-ds-space-general-md">
              <span aria-hidden="true" className={cn('block size-ds-primitives-dimention-lg bg-ds-text-neutral-heading', row.shape)} />
              {good && <span>{row.text}</span>}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/**
 * Simulación de colores forzados: los rellenos se pierden y solo quedan el texto y los bordes. Con borde (correcto) el
 * control se ve; solo con relleno (incorrecto) desaparece. Colores del sistema (`Canvas`, `ButtonText`), no de CAOS.
 */
export function MuestraAltoContraste({ good }: { good: boolean }) {
  const control = {
    background: 'Canvas',
    color: 'CanvasText',
    border: good ? '1px solid ButtonText' : '1px solid transparent',
  } as CSSProperties;
  return (
    <Panel>
      <div className="flex flex-col gap-ds-space-general-lg rounded-ds-radius-general-xl p-ds-space-general-4xl" style={{ background: 'Canvas', color: 'CanvasText', forcedColorAdjust: 'none' }}>
        <span className={cn(small, 'font-ds-primitives-typography-weight-semibold')}>Vista con colores forzados (simulada)</span>
        <span className={cn(body, 'flex h-ds-dimention-field-input-default items-center px-ds-space-general-xl')} style={{ ...control, color: 'CanvasText', borderRadius: radiusVarAt(VARS.field('md'), 'mobile') }}>
          Correo electrónico
        </span>
        <span className={cn(body, 'flex h-ds-primitives-dimention-3xl items-center justify-center')} style={{ ...control, color: 'CanvasText', borderRadius: radiusVarAt(VARS.buttonFull, 'mobile') }}>
          Guardar
        </span>
      </div>
    </Panel>
  );
}

/**
 * Anillo de foco: el real de los componentes, que sigue el radio del control (correcto), o un anillo cuadrado puesto en un
 * contenedor sin radio alrededor de controles redondeados (incorrecto). Con `outline-offset` de 2 px, el anillo queda a 4 px.
 */
export function MuestraAnilloFoco({ good }: { good: boolean }) {
  const ring = 'rounded-none outline-2 outline-offset-2 outline-solid outline-ds-border-field-active';
  const controls = (
    <>
      <Tag state="focus" iconLeft={false} onClick={() => undefined}>
        Aplicar filtros
      </Tag>
      <Chip type="primary-box" state="focus" icon={false}>
        Filtro
      </Chip>
    </>
  );
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-4xl rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE)}>
        <span className={heading}>Filtros</span>
        {good ? (
          <div className="flex flex-wrap items-center gap-ds-space-general-4xl p-ds-space-general-md">{controls}</div>
        ) : (
          <div className="flex flex-wrap items-center gap-ds-space-general-4xl p-ds-space-general-md">
            <span className={cn('inline-flex', ring)}>
              <Tag iconLeft={false}>Aplicar filtros</Tag>
            </span>
            <span className={cn('inline-flex', ring)}>
              <Chip type="primary-box" icon={false}>
                Filtro
              </Chip>
            </span>
          </div>
        )}
      </div>
    </Panel>
  );
}

/** Círculos de 16 a 48 px dentro del cuadro de 24 × 24 px que pide WCAG 2.5.8: debajo de 24 px no lo llenan. */
export function MuestraObjetivo() {
  const sizes = [16, 24, 32, 40, 48];
  return (
    <Ilustracion className="flex flex-wrap items-end gap-ds-space-general-4xl">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-ds-space-general-lg">
          <span className="relative flex items-center justify-center" style={{ width: Math.max(size, 24), height: Math.max(size, 24) }}>
            <span aria-hidden="true" className="block rounded-full bg-ds-text-neutral-heading" style={{ width: size, height: size }} />
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2 border border-dashed border-ds-border-acent-purpple"
              style={{ width: 24, height: 24 }}
            />
          </span>
          <span className={cn(small, 'tabular-nums text-ds-text-neutral-heading')}>{pxText(size)}</span>
          <span className={cn(small, semibold, 'text-ds-text-neutral-heading')}>{size >= 24 ? 'Cumple' : 'No llega'}</span>
        </div>
      ))}
    </Ilustracion>
  );
}
