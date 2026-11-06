import type { CSSProperties, ReactNode } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { ButtonCorner } from '../../components/ButtonCorner';
import { Icon } from '../../components/Icon';
import type { IconName, IconSize, IconVariant } from '../../components/Icon/Icon.types';
import { AlertModalPanel, ModalPanel } from '../../components/Modal';
import { Stepper } from '../../components/Stepper';
import { Tag } from '../../components/Tag';
import { DocDeviceFrame } from '../../docs/DocDeviceFrame';
import { ShrinkToFit } from '../../docs/DocParts';
import { cn } from '../../utils/cn';
import { colorInfo, ratioText } from '../Colores/colorData';
import { contrast } from '../_doc/color';
import type { TokenBreakpoint, TokenTheme } from '../_doc/tokensCss';
import { MIN_OBJETIVO, REFERENCIA, TAMANOS, margenGeometrico, pxAt, pxText, tokenSlash } from './iconografiaData';
import type { ParIcono } from './iconografiaData';

/*
 * Muestras propias de Iconografía (bloques `custom` y `preview` de la página): los formatos por tamaño, los esquemas de
 * márgenes y zonas tapeables, la paleta, la composición con componentes reales de CAOS, los Do and Dont’s y las muestras
 * de accesibilidad. Los íconos son siempre `<Icon>` de la biblioteca; los componentes, los reales. Las muestras son
 * ilustraciones: van con `inert` para que no sumen paradas de teclado.
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
const ON_CARD = 'bg-ds-background-container-default-on-card';
const BORDER = 'border border-ds-border-general-default-on-card';

/** Ícono de las muestras de tamaño y estilo: la línea y el relleno se distinguen bien. */
const MUESTRA: IconName = 'notification';

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

/** Rótulo numerado de una pieza en una composición anotada. */
function Rotulo({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className={cn(small, 'flex w-fit items-center gap-ds-space-general-md rounded-full bg-ds-text-neutral-heading px-ds-space-general-lg py-ds-space-general-xs text-ds-background-container-surface tabular-nums')}>
      <span className={semibold}>{n}</span>
      <span>{children}</span>
    </span>
  );
}

const VARIANTE: Record<IconVariant, string> = { fill: 'Relleno', line: 'Línea' };

/** Ficha de un tamaño: el ícono sobre una baldosa de superficie, su variante y su medida (como en Figma). */
function Ficha({ size, variant, name = MUESTRA }: { size: IconSize; variant: IconVariant; name?: IconName }) {
  return (
    <li className="flex flex-col items-center gap-ds-space-general-md">
      <span className={cn('flex items-center justify-center rounded-ds-radius-general-lg p-ds-space-general-lg text-ds-text-neutral-heading', SURFACE, BORDER)}>
        <Icon name={name} size={size} variant={variant} />
      </span>
      <span className={cn(small, 'text-ds-text-neutral-body')}>{VARIANTE[variant]}</span>
      <span className={cn(small, semibold, 'tabular-nums text-ds-text-neutral-heading')}>{pxText(size)}</span>
    </li>
  );
}

// ───────────────────────── definición ─────────────────────────

/** Formatos de la documentación nueva: los tamaños dados con la variante que dibuja el componente por defecto. */
export function MuestraFormatos({ sizes }: { sizes: readonly IconSize[] }) {
  return (
    <Ilustracion className={cn('flex min-h-44 items-center justify-center rounded-ds-radius-general-xl p-ds-space-general-4xl', ON_CARD)}>
      <ul className="m-0 flex list-none flex-wrap items-end justify-center gap-ds-space-general-4xl p-0">
        {sizes.map((s) => (
          <Ficha key={s} size={s} variant={TAMANOS.find((t) => t.size === s)?.variant ?? 'line'} />
        ))}
      </ul>
    </Ilustracion>
  );
}

/** Todos los tamaños del componente, con la variante por defecto. Los que no están en el set de Figma llevan nota. */
export function MuestraTamanos() {
  return (
    <Ilustracion className={cn('rounded-ds-radius-general-xl p-ds-space-general-4xl', ON_CARD)}>
      <ul className="m-0 flex list-none flex-wrap items-end justify-center gap-ds-space-general-4xl p-0">
        {TAMANOS.map((t) => (
          <li key={t.size} className="flex flex-col items-center gap-ds-space-general-md">
            <span className={cn('flex items-center justify-center rounded-ds-radius-general-lg p-ds-space-general-lg text-ds-text-neutral-heading', SURFACE, BORDER)}>
              <Icon name={MUESTRA} size={t.size} />
            </span>
            <span className={cn(small, 'text-ds-text-neutral-body')}>{VARIANTE[t.variant]}</span>
            <span className={cn(small, semibold, 'tabular-nums text-ds-text-neutral-heading')}>{pxText(t.size)}</span>
            <span className={cn(small, 'text-ds-text-neutral-gray')}>{t.figma ? 'Icon-sizes' : 'Solo en código'}</span>
          </li>
        ))}
      </ul>
    </Ilustracion>
  );
}

/** El mismo ícono a 24 px en línea y en relleno, y ampliado al doble para ver el trazo. */
export function MuestraLineaRelleno() {
  const par = (variant: IconVariant) => (
    <div key={variant} className="flex flex-col items-center gap-ds-space-general-lg">
      <div className="flex items-end gap-ds-space-general-2xl text-ds-text-neutral-heading">
        <span className={cn('flex items-center justify-center rounded-ds-radius-general-lg p-ds-space-general-lg', SURFACE, BORDER)}>
          <Icon name={MUESTRA} size={24} variant={variant} />
        </span>
        <span className={cn('flex items-center justify-center rounded-ds-radius-general-lg p-ds-space-general-lg', SURFACE, BORDER)}>
          <Icon name={MUESTRA} size={56} variant={variant} />
        </span>
      </div>
      <span className={cn(small, semibold, 'text-ds-text-neutral-heading')}>
        {VARIANTE[variant]} (<code>{variant}</code>)
      </span>
    </div>
  );
  return (
    <Ilustracion className={cn('flex flex-wrap items-end justify-center gap-ds-space-general-4xl rounded-ds-radius-general-xl p-ds-space-general-4xl', ON_CARD)}>
      {par('line')}
      {par('fill')}
    </Ilustracion>
  );
}

/** Caja de un ícono dentro de su contenedor: el borde punteado es el límite y el relleno tintado, el margen. */
function Caja({ icon, container, name, alerta = false, variant }: { icon: number; container: number; name: IconName; alerta?: boolean; variant?: IconVariant }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-ds-radius-general-md border border-dashed text-ds-text-neutral-heading',
        alerta ? 'border-ds-border-semantic-error bg-ds-background-graphic-error-secondary-opacity' : 'border-ds-border-acent-purpple bg-ds-background-graphic-information-secondary-opacity',
      )}
      style={{ width: container, height: container }}
    >
      <span className={cn('flex items-center justify-center', SURFACE)}>
        <Icon name={name} size={icon as IconSize} variant={variant} />
      </span>
    </span>
  );
}

/** Márgenes de seguridad de la documentación anterior, a escala real: Light y Bold. */
export function EsquemaSeguridad() {
  const fila = (titulo: string, rows: readonly { icon: number; margin: number }[], name: IconName) => (
    <div className="flex flex-col gap-ds-space-general-xl">
      <h3 className={sampleLabel}>{titulo}</h3>
      <ul className="m-0 flex list-none flex-wrap items-end gap-ds-space-general-4xl p-0">
        {rows.map((r) => (
          <li key={r.icon} className="flex flex-col items-center gap-ds-space-general-md">
            <Caja icon={r.icon} container={r.icon + 2 * r.margin} name={name} variant="line" />
            <span className={cn(small, 'tabular-nums text-ds-text-neutral-heading')}>Ícono {pxText(r.icon)}</span>
            <span className={cn(small, 'tabular-nums text-ds-text-neutral-body')}>Margen {pxText(r.margin)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <Ilustracion className={cn('flex flex-col gap-ds-space-general-4xl rounded-ds-radius-general-xl p-ds-space-general-4xl', ON_CARD)}>
      {fila('Light line', REFERENCIA.seguridad.light, 'tick-circle')}
      {fila('Bold line', REFERENCIA.seguridad.bold, 'notification')}
    </Ilustracion>
  );
}

/** Zonas tapeables de la documentación anterior, a escala real, con el margen que da la geometría. */
export function EsquemaZonas() {
  return (
    <Ilustracion className={cn('rounded-ds-radius-general-xl p-ds-space-general-4xl', ON_CARD)}>
      <ul className="m-0 flex list-none flex-wrap items-end gap-ds-space-general-4xl p-0">
        {REFERENCIA.zonas.flatMap((z) =>
          z.icons.map((i) => {
            const geo = margenGeometrico(z.zone, i.icon);
            return (
              <li key={`${z.zone}-${i.icon}`} className="flex flex-col items-center gap-ds-space-general-md">
                <Caja icon={i.icon} container={z.zone} name="setting" alerta={geo !== i.figma} />
                <span className={cn(small, semibold, 'tabular-nums text-ds-text-neutral-heading')}>Zona {pxText(z.zone)}</span>
                <span className={cn(small, 'tabular-nums text-ds-text-neutral-body')}>Ícono {pxText(i.icon)}</span>
                <span className={cn(small, 'tabular-nums text-ds-text-neutral-body')}>Margen {pxText(geo)}</span>
              </li>
            );
          }),
        )}
      </ul>
    </Ilustracion>
  );
}

/**
 * Paleta: un ícono por token, sobre la superficie del tema, con el nombre del token. `lista` apila ícono y nombre en
 * filas (para tarjetas angostas); si no, una cuadrícula.
 */
/**
 * Fondo de la baldosa de los tokens que no van sobre la superficie del tema: `black` es el inverso de `default` (va sobre
 * la superficie inversa) y los `-unicolor` van sobre su relleno fijo (G13 y B01), en los dos modos.
 */
const FONDO_PROPIO: Record<string, string> = {
  '--color-ds-icon-general-black': 'bg-ds-icon-general-default',
  '--color-ds-icon-general-default-unicolor': 'bg-ds-primitives-color-primary-g13',
  '--color-ds-icon-general-black-unicolor': 'bg-ds-primitives-color-primary-b01',
};

/** Lo mismo, como variable: para pintar el fondo de un modo concreto en las tablas. */
const FONDO_VAR: Record<string, string> = {
  '--color-ds-icon-general-black': '--color-ds-icon-general-default',
  '--color-ds-icon-general-default-unicolor': '--color-ds-primitives-color-primary-g13',
  '--color-ds-icon-general-black-unicolor': '--color-ds-primitives-color-primary-b01',
};

export function PaletaIconos({ tokens, lista = false }: { tokens: string[]; lista?: boolean }) {
  return (
    <Ilustracion className={cn('rounded-ds-radius-general-xl p-ds-space-general-4xl', ON_CARD)}>
      <ul className={cn('m-0 list-none p-0', lista ? 'flex flex-col gap-ds-space-general-xl' : 'grid grid-cols-1 gap-ds-space-general-2xl @md:grid-cols-2 @3xl:grid-cols-4')}>
        {tokens.map((t) => (
          <li key={t} className={cn('flex items-center gap-ds-space-general-lg', !lista && 'flex-col')}>
            <span className={cn('flex shrink-0 items-center justify-center rounded-ds-radius-general-lg p-ds-space-general-lg', FONDO_PROPIO[t] ?? SURFACE, BORDER)} style={{ color: `var(${t})` }}>
              <Icon name="notification" size={32} />
            </span>
            <code className={cn(small, 'min-w-0 text-ds-text-neutral-body [overflow-wrap:anywhere]', !lista && 'text-center')}>{tokenSlash(t)}</code>
          </li>
        ))}
      </ul>
    </Ilustracion>
  );
}

/** Celda de una tabla de color: el ícono pintado con el valor del token en ese modo, sobre la superficie de ese modo. */
export function IconoToken({ token, theme, valor, fondo: esFondo = false }: { token: string; theme: TokenTheme; valor: string; fondo?: boolean }) {
  // Un token de fondo (`background/icon/*`) se pinta como relleno, con el ícono general encima
  const icono = colorInfo(esFondo ? '--color-ds-icon-general-default' : token, theme);
  const fondo = colorInfo(esFondo ? token : (FONDO_VAR[token] ?? '--color-ds-background-container-surface'), theme);
  return (
    <span className="flex items-center gap-ds-space-general-lg">
      {icono && fondo && (
        <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-ds-radius-general-md border border-ds-border-general-default-on-card p-ds-space-general-md" style={{ background: fondo.css, color: icono.css }}>
          <Icon name="notification" size={20} variant="fill" />
        </span>
      )}
      <span>{valor}</span>
    </span>
  );
}

// ───────────────────────── aplicación ─────────────────────────

/** Tarjeta de proyecto con íconos accionables e informativos en componentes reales. `notas` numera las piezas. */
function Proyecto({ notas = false }: { notas?: boolean }) {
  return (
    <div className={cn('flex flex-col gap-ds-space-general-2xl rounded-ds-radius-container-on-card p-ds-space-general-4xl', ON_CARD, BORDER)}>
      <div className="flex items-start justify-between gap-ds-space-general-lg">
        <div className="flex flex-col gap-ds-space-general-sm">
          <span className={heading}>Rediseño del sitio</span>
          <span className={body}>Revisión con el equipo el viernes.</span>
        </div>
        <div className="flex flex-col items-end gap-ds-space-general-sm">
          <ButtonCorner variant="dots" contrast="on-card" aria-label="Más opciones" />
          {notas && <Rotulo n={1}>Accionable</Rotulo>}
        </div>
      </div>
      <div className="flex flex-col items-start gap-ds-space-general-sm">
        <div className="flex flex-wrap gap-ds-space-general-md">
          <Tag type="info" size="sm" icon="clock">
            En curso
          </Tag>
          <Tag type="success" size="sm" icon="tick-circle">
            Aprobado
          </Tag>
        </div>
        {notas && <Rotulo n={2}>Informativo</Rotulo>}
      </div>
      <div className="flex flex-col gap-ds-space-general-sm">
        <Stepper
          orientation="horizontal"
          current={1}
          steps={[{ title: 'Boceto' }, { title: 'Revisión' }, { title: 'Publicación' }]}
        />
        {notas && <Rotulo n={3}>Relleno al completar</Rotulo>}
      </div>
      <div className="flex flex-col gap-ds-space-general-sm">
        <Alert type="alert" title="Falta un archivo">
          Sube el plano antes de la revisión.
        </Alert>
        {notas && <Rotulo n={4}>Informativo</Rotulo>}
      </div>
      <div className="flex flex-col gap-ds-space-general-sm">
        <div className="flex flex-wrap items-center gap-ds-space-general-lg">
          <Button size="sm" leftIcon={<Icon name="document-download" size={16} />} iconSize={16}>
            Descargar
          </Button>
          <Button size="sm" variant="secondary" iconOnly aria-label="Compartir" leftIcon={<Icon name="share" size={20} />} iconSize={20} />
        </div>
        {notas && <Rotulo n={5}>Accionable</Rotulo>}
      </div>
    </div>
  );
}

/** Composición anotada: accionables (1, 5), informativos (2, 4) y relleno al completar (3). */
export function ComposicionAnotada() {
  return (
    <Ilustracion className="mx-auto w-full max-w-lg">
      <Ajustar minWidth={340}>
        <Proyecto notas />
      </Ajustar>
    </Ilustracion>
  );
}

/** Ícono informativo grande (AlertModal) que cambia de tamaño con el breakpoint (`dimention/icono-m`). */
function DialogoBreakpoint({ bp }: { bp: TokenBreakpoint }) {
  return (
    <ShrinkToFit>
      <Ilustracion className="flex w-full justify-center">
        <AlertModalPanel
          type="success"
          headingLevel={4}
          title="Cambios guardados"
          description={`El ícono mide ${pxText(pxAt('--ds-responsive-dimention-icono-m', bp))} en este breakpoint.`}
          primaryAction={{ label: 'Entendido' }}
        />
      </Ilustracion>
    </ShrinkToFit>
  );
}

/** El mismo diálogo en Desktop, Tablet y Mobile, cada uno en su marco. */
export function ComposicionPorBreakpoint({ breakpoints }: { breakpoints: { bp: TokenBreakpoint; label: string }[] }) {
  const frame = (bp: TokenBreakpoint, label: string) => (
    <div key={bp} className="flex min-w-0 flex-col gap-ds-space-general-xl">
      <h3 className={sampleLabel}>{label}</h3>
      <DocDeviceFrame breakpoint={bp}>
        <DialogoBreakpoint bp={bp} />
      </DocDeviceFrame>
    </div>
  );
  const [mobile, tablet, desktop] = breakpoints;
  return (
    <div className="flex flex-col gap-ds-space-general-4xl">
      {frame(desktop.bp, desktop.label)}
      <div className="grid grid-cols-1 items-start gap-ds-space-general-4xl @3xl:grid-cols-2">
        {frame(tablet.bp, tablet.label)}
        {frame(mobile.bp, mobile.label)}
      </div>
    </div>
  );
}

// ───────────────────────── Do and Dont’s ─────────────────────────

/** Panel de una práctica: el ejemplo centrado, a lo ancho útil del marco de teléfono. */
function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <Ilustracion className={cn('mx-auto w-full max-w-[340px]', className)}>{children}</Ilustracion>;
}

/** Botones con ícono de 16 px: relleno (correcto) o línea (incorrecto). */
export function MuestraIconoPequeno({ good }: { good: boolean }) {
  const variant: IconVariant = good ? 'fill' : 'line';
  return (
    <Panel>
      <div className={cn('flex flex-col items-start gap-ds-space-general-2xl rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE)}>
        <span className={heading}>Informe mensual</span>
        <div className="flex flex-wrap gap-ds-space-general-lg">
          <Button size="sm" leftIcon={<Icon name="document-download" size={16} variant={variant} />} iconSize={16}>
            Descargar
          </Button>
          <Button size="sm" variant="secondary" leftIcon={<Icon name="share" size={16} variant={variant} />} iconSize={16}>
            Compartir
          </Button>
        </div>
      </div>
    </Panel>
  );
}

/** Barra de acciones con íconos de 24 px: línea (correcto) o relleno (incorrecto). */
export function MuestraIconoGrande({ good }: { good: boolean }) {
  const variant: IconVariant = good ? 'line' : 'fill';
  const acciones: { name: IconName; label: string }[] = [
    { name: 'search', label: 'Buscar' },
    { name: 'notification', label: 'Notificaciones' },
    { name: 'setting', label: 'Ajustes' },
    { name: 'user', label: 'Perfil' },
  ];
  return (
    <Panel>
      <div className={cn('flex items-center justify-between gap-ds-space-general-md rounded-ds-radius-general-xl p-ds-space-general-xl', SURFACE)}>
        {acciones.map((a) => (
          <Button key={a.name} variant="tertiary" size="sm" iconOnly aria-label={a.label} leftIcon={<Icon name={a.name} size={24} variant={variant} />} iconSize={24} />
        ))}
      </div>
    </Panel>
  );
}

/** Opción activa: el ícono pasa a relleno (correcto) o se queda en línea (incorrecto). */
export function MuestraActivo({ good }: { good: boolean }) {
  const opciones: { name: IconName; label: string; activa?: boolean }[] = [
    { name: 'heart', label: 'Me gusta', activa: true },
    { name: 'star', label: 'Destacar' },
    { name: 'folder', label: 'Guardar en carpeta' },
  ];
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-2xl rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE)}>
        <span className={heading}>Foto de portada</span>
        <div className="flex gap-ds-space-general-lg">
          {opciones.map((o) => (
            <ButtonCorner
              key={o.name}
              contrast="on-canva"
              state={o.activa ? 'select' : 'default'}
              aria-label={o.label}
              icon={<Icon name={o.name} size={20} variant={o.activa && good ? 'fill' : 'line'} />}
              iconSize={20}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}

/** Ícono informativo grande en un diálogo: línea (correcto) o relleno (incorrecto). */
export function MuestraDialogo({ good }: { good: boolean }) {
  return (
    <Panel>
      <ModalPanel headingLevel={4} title="Cambios guardados" closable={false} primaryAction={{ label: 'Entendido' }}>
        <div className="flex flex-col items-center gap-ds-space-general-lg text-center">
          <Icon name="tick-circle" size={48} variant={good ? 'line' : 'fill'} className="text-ds-icon-semantic-success-secondary" />
          <span className={body}>Tus ajustes ya están activos.</span>
        </div>
      </ModalPanel>
    </Panel>
  );
}

/** Color sólido (correcto) o ícono translúcido, como con un degradado (incorrecto). */
export function MuestraColorSolido({ good }: { good: boolean }) {
  const filas: { name: IconName; text: string; color: string }[] = [
    { name: 'tick-circle', text: 'Copia de seguridad lista', color: 'text-ds-icon-semantic-success-secondary' },
    { name: 'warning', text: 'Quedan 2 GB libres', color: 'text-ds-icon-semantic-alert-secondary' },
    { name: 'info-circle', text: 'Nueva versión disponible', color: 'text-ds-icon-semantic-information-secondary' },
  ];
  return (
    <Panel>
      <ul className={cn('m-0 flex list-none flex-col gap-ds-space-general-xl rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE)}>
        {filas.map((f) => (
          <li key={f.name} className={cn(body, 'flex items-center gap-ds-space-general-lg')}>
            <Icon name={f.name} size={24} className={cn(f.color, !good && 'opacity-40')} />
            {f.text}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

// ───────────────────────── accesibilidad ─────────────────────────

/** Contraste de un ícono contra su fondo en un modo: la muestra pinta el ícono y el fondo de ese modo. */
export function IconoValor({ par, theme }: { par: ParIcono; theme: TokenTheme }) {
  const f = colorInfo(par.fg, theme);
  const b = colorInfo(par.bg, theme);
  if (!f || !b) return <span>Sin valor en este modo</span>;
  const ratio = contrast(f.hex, b.hex);
  return (
    <span className="flex items-center gap-ds-space-general-lg">
      <span aria-hidden="true" className="flex shrink-0 items-center justify-center rounded-ds-radius-general-lg border border-ds-border-general-default-on-card p-ds-space-general-lg" style={{ background: b.css, color: f.css }}>
        <Icon name="notification" size={24} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-ds-text-neutral-heading tabular-nums">{ratioText(ratio)}</span>
        <span>{par.exento ? 'Exento (inactivo)' : ratio >= 3 ? 'Cumple 3:1' : 'No cumple 3:1'}</span>
      </span>
    </span>
  );
}

/** Botón de solo ícono: lo que anuncia el lector de pantalla con nombre (correcto) y sin él (incorrecto). */
export function MuestraNombreAccesible({ good }: { good: boolean }) {
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-2xl rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE)}>
        <div className="flex items-center gap-ds-space-general-lg">
          <Button variant="secondary" size="sm" iconOnly aria-label={good ? 'Buscar' : ''} leftIcon={<Icon name="search" size={20} />} iconSize={20} />
          <span className={body}>Proyectos</span>
        </div>
        <div className={cn('flex flex-col gap-ds-space-general-sm rounded-ds-radius-general-lg p-ds-space-general-xl', ON_CARD)}>
          <span className={cn(small, 'text-ds-text-neutral-body')}>Lector de pantalla</span>
          <span className={cn(body, semibold, 'text-ds-text-neutral-heading')}>{good ? '«Buscar, botón»' : '«Botón»'}</span>
        </div>
      </div>
    </Panel>
  );
}

/** Estado de una lista: ícono y texto (correcto) o solo el ícono de color (incorrecto). */
export function MuestraSoloIcono({ good }: { good: boolean }) {
  const filas: { name: string; type: 'success' | 'error'; icon: IconName; text: string; color: string }[] = [
    { name: 'Respaldo diario', type: 'success', icon: 'tick-circle', text: 'Completo', color: 'text-ds-icon-semantic-success-secondary' },
    { name: 'Sincronización', type: 'error', icon: 'close-circle', text: 'Falló', color: 'text-ds-icon-semantic-error-secondary' },
  ];
  return (
    <Panel>
      <div className={cn('flex flex-col gap-ds-space-general-xl rounded-ds-radius-general-xl p-ds-space-general-4xl', SURFACE)}>
        <span className={heading}>Tareas</span>
        {filas.map((f) => (
          <div key={f.name} className={cn(body, 'flex items-center justify-between gap-ds-space-general-lg')}>
            <span>{f.name}</span>
            {good ? (
              <Tag type={f.type} size="sm" icon={f.icon}>
                {f.text}
              </Tag>
            ) : (
              <Icon name={f.icon} size={20} className={f.color} />
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

/**
 * Dibujo del ícono frente al cuadro de 24 × 24 px que pide WCAG 2.5.8: el dibujo puede ser menor si la zona llega. Se
 * dibuja al doble de tamaño para que se lean el cuadro y la zona.
 */
export function EsquemaObjetivo() {
  const ESCALA = 2;
  const casos: { icon: number; zone: number; label: string }[] = [
    { icon: 16, zone: 16, label: 'Sin zona' },
    { icon: 16, zone: 24, label: 'Zona de 24' },
    { icon: 20, zone: 32, label: 'Zona de 32' },
    { icon: 24, zone: 40, label: 'Zona de 40' },
  ];
  return (
    <Ilustracion className={cn('flex flex-col gap-ds-space-general-2xl rounded-ds-radius-general-xl p-ds-space-general-4xl', ON_CARD)}>
      <ul className="m-0 flex list-none flex-wrap items-end justify-center gap-ds-space-general-4xl p-0">
        {casos.map((c) => {
          const cumple = c.zone >= MIN_OBJETIVO;
          const caja = Math.max(c.zone, MIN_OBJETIVO) * ESCALA + 16;
          return (
            <li key={c.label} className="flex flex-col items-center gap-ds-space-general-md">
              <span className="relative flex items-center justify-center" style={{ width: caja, height: caja }}>
                <span
                  aria-hidden="true"
                  className={cn('absolute rounded-ds-radius-general-md', cumple ? 'bg-ds-background-graphic-success-secondary-opacity' : 'bg-ds-background-graphic-error-secondary-opacity')}
                  style={{ width: c.zone * ESCALA, height: c.zone * ESCALA }}
                />
                <span
                  aria-hidden="true"
                  className="absolute border-2 border-dashed border-ds-border-acent-purpple"
                  style={{ width: MIN_OBJETIVO * ESCALA, height: MIN_OBJETIVO * ESCALA }}
                />
                <Icon name="setting" size={(c.icon * ESCALA) as IconSize} className="relative text-ds-text-neutral-heading" />
              </span>
              <span className={cn(small, semibold, 'text-ds-text-neutral-heading')}>{c.label}</span>
              <span className={cn(small, 'tabular-nums text-ds-text-neutral-body')}>Ícono {pxText(c.icon)}</span>
              <span className={cn(small, semibold, 'text-ds-text-neutral-heading')}>{cumple ? 'Cumple' : 'No llega'}</span>
            </li>
          );
        })}
      </ul>
      <span className={cn(small, 'text-center text-ds-text-neutral-body')}>Dibujo al doble de tamaño. Tintado: la zona que se toca. Punteado: el cuadro de {MIN_OBJETIVO} × {MIN_OBJETIVO} px.</span>
    </Ilustracion>
  );
}

/** Íconos direccionales: en una interfaz de derecha a izquierda la flecha se refleja; el resto no. */
export function MuestraDireccional() {
  const fila = (dir: 'ltr' | 'rtl', label: string) => (
    <div className="flex flex-col gap-ds-space-general-md">
      <span className={sampleLabel}>{label}</span>
      <div dir={dir} className={cn('flex flex-wrap items-center gap-ds-space-general-lg rounded-ds-radius-general-lg p-ds-space-general-xl', SURFACE, BORDER)}>
        <Button size="sm" variant="secondary" rightIcon={<Icon name="chevron-right" size={16} className="rtl:-scale-x-100" />} iconSize={16}>
          Siguiente
        </Button>
        <span className="flex items-center gap-ds-space-general-md text-ds-text-neutral-heading">
          <Icon name="search" size={24} />
          <span className={body}>No se refleja</span>
        </span>
      </div>
    </div>
  );
  return (
    <Ilustracion className={cn('flex flex-col gap-ds-space-general-2xl rounded-ds-radius-general-xl p-ds-space-general-4xl', ON_CARD)}>
      {fila('ltr', 'De izquierda a derecha')}
      {fila('rtl', 'De derecha a izquierda (simulado)')}
    </Ilustracion>
  );
}
