import type { CSSProperties, ReactNode } from 'react';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Tag } from '../../components/Tag';
import { DocDeviceFrame } from '../../docs/DocDeviceFrame';
import { ShrinkToFit } from '../../docs/DocParts';
import { cn } from '../../utils/cn';
import type { TokenBreakpoint } from '../_doc/tokensCss';
import { BREAKPOINTS, NIVELES, NIVELES_PADDING, SCALE, VARS, pxText, primitivePx, primitiveVar, spaceAt } from './espacioData';

/*
 * Muestras propias de Contenedores y espacios (bloques `custom` y `preview` de la página): el esquema de jerarquía, los
 * de padding y gap, la gráfica de equivalencias, el contenedor sobre lienzo y sobre tarjeta, la misma composición en cada
 * breakpoint y los ejemplos de Do and Dont’s. Los espacios salen de tokens.css (`espacioData.ts`); los componentes son
 * los reales de CAOS. Las muestras son ilustraciones: van con `inert` para que no sumen paradas de teclado.
 */

// ───────────────────────── base ─────────────────────────

const primary = 'font-ds-primitives-typography-family-primary';
const semibold = 'font-ds-primitives-typography-weight-semibold';

/** Etiqueta de una muestra (Body/Short text/Body-sm-600), como en Tipografía, Colores y Retículas. */
const sampleLabel = cn(primary, semibold, 'm-0 text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-heading');
/** Texto de cota y de muestra: 12/16. */
const small = cn(primary, 'text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-md');
const heading = cn(primary, semibold, 'text-ds-primitives-typography-size-xl leading-ds-primitives-typography-line-height-2xl text-ds-text-neutral-heading');
const body = cn(primary, 'text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-lg text-ds-text-neutral-body');

/** Franja de padding (relleno del contenedor), de gap (separación entre elementos) y de padding de tarjeta. */
export const PAD = 'bg-ds-background-graphic-information-secondary-opacity';
export const GAP = 'bg-ds-background-graphic-tertiary-secondary-opacity';
export const PAD_CARD = 'bg-ds-background-graphic-alert-secondary-opacity';

const SURFACE = 'bg-ds-background-container-surface';
const BORDER = 'border border-ds-border-general-default-on-card';

/** Ilustración: se ve pero no entra al foco ni al árbol de accesibilidad como controles. */
function Ilustracion({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div inert className={className}>
      {children}
    </div>
  );
}

/** Rellena un hueco de espacio con su medida (franja de padding o de gap). */
function Spacer({ size, label, className, horizontal }: { size: string; label?: string; className: string; horizontal?: boolean }) {
  const style: CSSProperties = horizontal ? { width: size } : { height: size };
  return (
    <div aria-hidden="true" className={cn(small, 'flex shrink-0 items-center justify-center text-ds-text-neutral-heading', horizontal && 'self-stretch', className)} style={style}>
      {label}
    </div>
  );
}

/**
 * Esquema que no se comprime: si no cabe, `ShrinkToFit` lo reduce entero (sin scroll horizontal), como las composiciones.
 * `minWidth` es el ancho al que se dibuja antes de reducirse.
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

/** Leyenda de una muestra (cuadro de color y texto). */
export function Leyenda({ items }: { items: { className: string; label: string }[] }) {
  return (
    <ul className={cn(small, 'm-0 flex list-none flex-wrap gap-x-ds-space-general-4xl gap-y-ds-space-general-lg p-0 text-ds-text-neutral-body')}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-ds-space-general-lg">
          <span aria-hidden="true" className={cn('size-4 shrink-0', BORDER, item.className)} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

// ───────────────────────── jerarquía ─────────────────────────

/** Contenedores anidados: cada nivel dibuja su padding con el valor de su token y lo rotula en la franja de arriba. */
function Anidados({ index = 0 }: { index?: number }) {
  const level = NIVELES[index];
  const last = index === NIVELES.length - 1;
  return (
    <div className={cn('relative border border-ds-border-general-default-on-card', level.className)} style={{ padding: primitiveVar(level.pad) }}>
      <span
        aria-hidden="true"
        className={cn(small, 'absolute inset-x-0 top-0 flex items-center justify-center text-ds-text-neutral-heading tabular-nums')}
        style={{ height: primitiveVar(level.pad) }}
      >
        {primitivePx(level.pad)} px
      </span>
      {last ? <div className={cn(small, 'flex h-16 items-center justify-center bg-ds-background-container-surface text-ds-text-neutral-body')}>Contenido</div> : <Anidados index={index + 1} />}
    </div>
  );
}

/** Esquema de jerarquía: el contenedor madre con tres niveles de hijos y la lista de niveles. */
export function Jerarquia() {
  return (
    <div className="flex flex-col gap-ds-space-general-4xl @3xl:flex-row @3xl:items-center">
      <div className="min-w-0 flex-1">
        <Ajustar minWidth={380}>
          <Anidados />
        </Ajustar>
      </div>
      <ol className={cn(body, 'm-0 flex list-none flex-col gap-ds-space-general-lg p-0 text-ds-text-neutral-heading @3xl:w-64')}>
        {NIVELES_PADDING.map((n) => (
          <li key={n.name} className="flex items-center gap-ds-space-general-lg">
            <span aria-hidden="true" className={cn('size-4 shrink-0', BORDER, n.className)} />
            <span>
              {n.name} <span className="text-ds-text-neutral-gray">· {n.value} px</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ───────────────────────── padding y gap ─────────────────────────

/** Formulario de contacto con el padding de 40 px resaltado. */
export function EsquemaPadding() {
  const pad = primitiveVar('6xl');
  const value = pxText(primitivePx('6xl'));
  return (
    <Ajustar minWidth={420}>
      <Ilustracion className={cn('mx-auto max-w-[640px] overflow-hidden rounded-ds-radius-container-on-canva', BORDER)}>
        <Spacer size={pad} label={value} className={PAD} />
        <div className="flex">
          <Spacer horizontal size={pad} label={String(primitivePx('6xl'))} className={PAD} />
          <div className={cn('flex min-w-0 flex-1 flex-col gap-ds-space-general-4xl p-ds-space-general-4xl', SURFACE)}>
            <div className="flex items-center justify-between gap-ds-space-general-2xl">
              <span className={heading}>Escríbenos</span>
              <Tag size="sm">Contacto</Tag>
            </div>
            <div className="grid grid-cols-2 gap-ds-space-general-2xl">
              <Input label="Nombre" placeholder="Laura Gómez" fullWidth />
              <Input label="Correo electrónico" placeholder="laura@correo.com" fullWidth />
            </div>
            <div className="flex justify-end gap-ds-space-general-lg">
              <Button variant="secondary" size="sm">
                Cancelar
              </Button>
              <Button size="sm">Enviar</Button>
            </div>
          </div>
          <Spacer horizontal size={pad} label={String(primitivePx('6xl'))} className={PAD} />
        </div>
        <Spacer size={pad} label={value} className={PAD} />
      </Ilustracion>
    </Ajustar>
  );
}

/** Tarjeta de perfil con los gaps señalados. */
export function EsquemaGap() {
  const box = cn(SURFACE, 'p-ds-space-general-4xl');
  return (
    <Ajustar minWidth={360}>
      <Ilustracion className={cn('mx-auto flex max-w-[480px] flex-col overflow-hidden rounded-ds-radius-container-on-canva', BORDER)}>
        <div className={cn(box, 'flex items-center')}>
          <Avatar variant="initials" size="md" name="Laura Gómez" />
          <Spacer horizontal size={primitiveVar('2xl')} label="" className={GAP} />
          <span className="flex flex-col">
            <span className={heading}>Laura Gómez</span>
            <span className={body}>Diseñadora de producto</span>
          </span>
        </div>
        <Spacer size={primitiveVar('6xl')} label={pxText(primitivePx('6xl'))} className={GAP} />
        <div className={cn(box, 'flex flex-col')}>
          <span className={heading}>Sobre su trabajo</span>
          <span className={body}>Diseña flujos y componentes, y coordina las pruebas de uso con los equipos.</span>
        </div>
        <Spacer size={primitiveVar('4xl')} label={pxText(primitivePx('4xl'))} className={GAP} />
        <div className={cn(box, 'flex flex-wrap items-center gap-ds-space-general-lg')}>
          <Tag size="sm">Experiencia: 2 años</Tag>
          <Tag size="sm" type="info">
            Calificación: 4,5
          </Tag>
        </div>
        <Spacer size={primitiveVar('6xl')} label={pxText(primitivePx('6xl'))} className={GAP} />
        <div className={cn(box, 'flex gap-ds-space-general-lg')}>
          <Button variant="secondary" size="sm">
            Ver perfil
          </Button>
          <Button size="sm">Contactar</Button>
        </div>
      </Ilustracion>
    </Ajustar>
  );
}

// ───────────────────────── escala ─────────────────────────

/** Gráfica de equivalencias: una barra por cada espacio primitivo, del tamaño real del token. */
export function EscalaEspacios() {
  const max = Math.max(...SCALE.map((s) => s.value));
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-x-ds-space-general-6xl gap-y-ds-space-general-lg p-0 @3xl:grid-flow-col @3xl:grid-cols-2 @3xl:grid-rows-8">
      {SCALE.map((s) => (
        <li key={s.key} className={cn(body, 'flex items-center gap-ds-space-general-xl text-ds-text-neutral-heading')}>
          <span className="w-14 shrink-0 text-right tabular-nums">{s.value} px</span>
          <span
            aria-hidden="true"
            className="h-4 rounded-sm bg-ds-background-semantic-information-fourth"
            style={{ width: `${Math.max((s.value / max) * 60, 0.4)}%`, minWidth: s.value ? 2 : 0 }}
          />
          <span className="text-ds-text-neutral-gray">{s.key}</span>
        </li>
      ))}
    </ul>
  );
}

// ───────────────────────── contenedor sobre lienzo y sobre tarjeta ─────────────────────────

/**
 * Un contenedor con su padding resaltado: la franja es el valor del token (`var`) y el rótulo, el valor leído de
 * tokens.css en Desktop, que es el breakpoint que fija el marco.
 */
function ContenedorConPadding({ variable, label, on }: { variable: string; label: string; on: 'canva' | 'card' }) {
  const value = spaceAt(variable, 'desktop');
  return (
    <div className="flex min-w-0 flex-col gap-ds-space-general-lg">
      <p className={sampleLabel}>
        {label} <span className="text-ds-text-neutral-gray">· {pxText(value)}</span>
      </p>
      <div
        aria-hidden="true"
        className={cn('rounded-ds-radius-general-md', BORDER, on === 'canva' ? PAD : PAD_CARD)}
        style={{ padding: `var(${variable})` }}
      >
        <div className={cn(small, 'flex h-16 items-center justify-center rounded-ds-radius-general-sm text-ds-text-neutral-body', SURFACE)}>Contenido</div>
      </div>
    </div>
  );
}

/** Contenedor sobre el lienzo (`on-canva`) o sobre una tarjeta (`on-card`), con su variante `-stretch`. */
export function ContenedorSobre({ on }: { on: 'canva' | 'card' }) {
  const [base, stretch] = on === 'canva' ? [VARS.onCanva, VARS.onCanvaStretch] : [VARS.onCard, VARS.onCardStretch];
  return (
    <DocDeviceFrame breakpoint="desktop">
      <div className={cn('flex w-full min-w-0 flex-col gap-ds-space-general-4xl', on === 'card' && 'rounded-ds-radius-general-lg bg-ds-background-container-default-on-card p-ds-space-general-2xl')}>
        <ContenedorConPadding variable={base} label="Base" on={on} />
        <ContenedorConPadding variable={stretch} label="Stretch" on={on} />
      </div>
    </DocDeviceFrame>
  );
}

// ───────────────────────── composición por breakpoint ─────────────────────────

const TARJETAS = [
  { title: 'Reunión de equipo', text: 'Revisión de avances y próximos pasos.', tag: 'Hoy', who: 'Laura Gómez' },
  { title: 'Taller de diseño', text: 'Ejercicio práctico sobre jerarquía visual.', tag: 'Mañana', who: 'Diego Parra' },
  { title: 'Cierre del trimestre', text: 'Resumen de resultados y aprendizajes.', tag: 'Viernes', who: 'Marta Ortiz' },
];

/** Tarjeta de la composición: padding `on-card` resaltado y contenido con componentes reales. */
function TarjetaEvento({ title, text, tag, who }: (typeof TARJETAS)[number]) {
  return (
    <div className={cn('flex min-w-0 flex-col rounded-ds-radius-general-lg', SURFACE)}>
      <div className={cn('flex flex-1 flex-col rounded-ds-radius-general-lg p-ds-space-container-on-card', PAD_CARD)}>
        <div className={cn('flex flex-1 flex-col gap-ds-space-general-lg rounded-ds-radius-general-md p-ds-space-general-2xl', SURFACE)}>
          <div className="flex items-center justify-between gap-ds-space-general-lg">
            <Avatar variant="initials" size="sm" name={who} />
            <Tag size="sm">{tag}</Tag>
          </div>
          <p className={cn(heading, 'm-0')}>{title}</p>
          <p className={cn(body, 'm-0')}>{text}</p>
          <div>
            <Button variant="secondary" size="xs">
              Ver detalles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Pantalla de un breakpoint: lienzo del ancho del token, contenedor con padding `on-canva` y tarjetas separadas por el gap. */
function PantallaComposicion({ bp }: { bp: TokenBreakpoint }) {
  const cols = bp === 'desktop' ? 'grid-cols-3' : bp === 'tablet' ? 'grid-cols-2' : 'grid-cols-1';
  const cards = bp === 'tablet' ? TARJETAS.slice(0, 2) : TARJETAS;
  return (
    <ShrinkToFit innerClassName="justify-start">
      <Ilustracion className={cn('w-ds-dimention-canva-width shrink-0 rounded-ds-radius-general-md p-ds-space-canva-lateral', SURFACE)}>
        <div className={cn('flex flex-col p-ds-space-container-on-canva', PAD)}>
          <div className={cn('grid', cols, 'gap-ds-space-general-4xl', GAP)}>
            {cards.map((c) => (
              <TarjetaEvento key={c.title} {...c} />
            ))}
          </div>
        </div>
      </Ilustracion>
    </ShrinkToFit>
  );
}

/** La misma composición en Desktop, Tablet y Mobile, cada una en su marco con las variables de su breakpoint. */
export function ComposicionPorBreakpoint() {
  const frame = (bp: TokenBreakpoint, label: string) => (
    <div key={bp} className="flex min-w-0 flex-col gap-ds-space-general-xl">
      <h3 className={sampleLabel}>{label}</h3>
      <DocDeviceFrame breakpoint={bp}>
        <PantallaComposicion bp={bp} />
      </DocDeviceFrame>
    </div>
  );
  const [desktop, tablet, mobile] = BREAKPOINTS;
  return (
    <div className="flex flex-col gap-ds-space-general-4xl">
      {frame(desktop.bp, desktop.label)}
      <div className="grid grid-cols-1 items-start gap-ds-space-general-4xl @3xl:grid-cols-[2fr_1fr]">
        {frame(tablet.bp, tablet.label)}
        {frame(mobile.bp, mobile.label)}
      </div>
      <Leyenda
        items={[
          { className: PAD, label: 'Padding sobre el lienzo' },
          { className: PAD_CARD, label: 'Padding de la tarjeta' },
          { className: GAP, label: 'Gap entre tarjetas' },
        ]}
      />
    </div>
  );
}

// ───────────────────────── Do and Dont’s ─────────────────────────

/** Panel de una práctica: el ejemplo centrado sobre la superficie. */
function Panel({ children }: { children: ReactNode }) {
  return <Ilustracion className="mx-auto w-full max-w-[340px]">{children}</Ilustracion>;
}

/** Aviso de confirmación: agrupa por proximidad (correcto) o separa todo por igual (incorrecto). */
export function MuestraJerarquia({ good }: { good: boolean }) {
  return (
    <Panel>
      <div className={cn('flex flex-col items-center rounded-ds-radius-general-xl p-ds-space-general-4xl text-center', SURFACE, good ? 'gap-ds-space-general-lg' : 'gap-ds-space-general-4xl')}>
        <Avatar variant="icon" icon="tick-circle" size="md" />
        <span className={heading}>Cambios guardados</span>
        <span className={body}>Tus datos se actualizaron en el perfil.</span>
        <Button size="sm" fullWidth className={cn(good && 'mt-ds-space-general-4xl')}>
          Entendido
        </Button>
      </div>
    </Panel>
  );
}

/** Tarjeta de perfil: contenidos alineados a la izquierda (correcto) o sin alineación común (incorrecto). */
export function MuestraAlineacion({ good }: { good: boolean }) {
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-4xl rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE)}>
        <div className={cn('flex items-center gap-ds-space-general-lg', !good && 'justify-end')}>
          <Avatar variant="initials" size="md" name="Laura Gómez" />
          <span className="flex flex-col">
            <span className={heading}>Laura Gómez</span>
            <span className={body}>Diseñadora de producto</span>
          </span>
        </div>
        <div className={cn('flex flex-col gap-ds-space-general-md', !good && 'items-center text-center')}>
          <span className={heading}>Sobre su trabajo</span>
          <span className={body}>Diseña flujos y componentes, y coordina las pruebas de uso.</span>
        </div>
        <div className={cn('flex gap-ds-space-general-lg', good ? 'justify-start' : 'justify-around')}>
          <Tag size="sm">2 años</Tag>
          <Tag size="sm" type="info">
            4,5
          </Tag>
        </div>
      </div>
    </Panel>
  );
}

/** Tarjeta de evento: con Auto Layout (columna con gaps de tokens) o con elementos separados a mano. */
export function MuestraAutoLayout({ good }: { good: boolean }) {
  const title = <span className={heading}>Taller de diseño</span>;
  const text = <span className={body}>Un ejercicio práctico sobre jerarquía visual y espacios.</span>;
  const meta = (
    <>
      <span className={body}>27 de octubre de 2026</span>
      <span className={body}>Auditorio principal</span>
    </>
  );
  const button = (
    <Button size="sm" fullWidth>
      Ver evento
    </Button>
  );
  return (
    <Panel>
      <div className={cn('overflow-hidden rounded-ds-radius-general-xl', SURFACE)}>
        <div className="h-20 bg-ds-background-graphic-neutral-secondary-opacity" />
        {good ? (
          <div className="flex flex-col gap-ds-space-general-2xl p-ds-space-general-4xl">
            <div className="flex flex-col gap-ds-space-general-lg">
              {title}
              {text}
            </div>
            <div className="flex flex-col gap-ds-space-general-md">{meta}</div>
            {button}
          </div>
        ) : (
          <div className="p-ds-space-general-4xl">
            <div style={{ marginBottom: 7 }}>{title}</div>
            <div style={{ marginBottom: 22, marginLeft: 5 }}>{text}</div>
            <div className="flex flex-col" style={{ marginBottom: 13, marginLeft: 14 }}>
              {meta}
            </div>
            <div style={{ marginTop: 31 }}>{button}</div>
          </div>
        )}
      </div>
    </Panel>
  );
}

// ───────────────────────── accesibilidad ─────────────────────────

/** Formulario en dos grupos: el gap interno es menor que el gap entre grupos (correcto) o todos iguales (incorrecto). */
export function MuestraProximidad({ good }: { good: boolean }) {
  const group = (title: string, fields: [string, string][]) => (
    <fieldset className={cn('m-0 flex min-w-0 flex-col border-0 p-0', good ? 'gap-ds-space-general-lg' : 'gap-ds-space-general-2xl')}>
      <legend className={cn(sampleLabel, 'mb-ds-space-general-lg p-0', !good && 'mb-ds-space-general-2xl')}>{title}</legend>
      {fields.map(([label, placeholder]) => (
        <Input key={label} label={label} placeholder={placeholder} fullWidth />
      ))}
    </fieldset>
  );
  return (
    <Panel>
      <div className={cn('flex flex-col rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE, good ? 'gap-ds-space-general-6xl' : 'gap-ds-space-general-2xl')}>
        {group('Datos personales', [
          ['Nombre', 'Laura Gómez'],
          ['Correo electrónico', 'laura@correo.com'],
        ])}
        {group('Dirección', [
          ['Ciudad', 'Medellín'],
          ['Barrio', 'Laureles'],
        ])}
      </div>
    </Panel>
  );
}

/** Texto con el espaciado que puede ajustar el usuario (1.4.12): el alto fijo lo recorta, el alto libre lo deja crecer. */
export function MuestraTextoAjustable({ fixed }: { fixed: boolean }) {
  return (
    <Panel>
      <div
        className={cn('flex flex-col gap-ds-space-general-lg overflow-hidden rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE, fixed ? 'h-28' : 'min-h-28')}
        style={{ lineHeight: 1.5, letterSpacing: '0.12em', wordSpacing: '0.16em' }}
      >
        <span className={heading}>Resumen semanal</span>
        <span className={body}>Revisa los avances del equipo y define las prioridades de la próxima semana antes del viernes.</span>
      </div>
    </Panel>
  );
}

/**
 * Anillo de foco real de los componentes (`outline-2`, `outline-offset-2` y el radio del control: aquí, una etiqueta
 * en `state="focus"`) dentro de un contenedor con `overflow: hidden`. Con padding, el anillo se ve completo; con el
 * control pegado a la esquina, el contenedor lo recorta arriba y a la izquierda.
 */
export function MuestraFoco({ clipped }: { clipped: boolean }) {
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-lg rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE)}>
        <span className={heading}>Filtros</span>
        <div
          className={cn('overflow-hidden rounded-ds-radius-general-md bg-ds-background-container-default-on-canva', BORDER, clipped ? 'pr-ds-space-general-lg pb-ds-space-general-lg' : 'p-ds-space-general-lg')}
        >
          <Tag state="focus" iconLeft={false} onClick={() => undefined}>
            Aplicar filtros
          </Tag>
        </div>
      </div>
    </Panel>
  );
}
