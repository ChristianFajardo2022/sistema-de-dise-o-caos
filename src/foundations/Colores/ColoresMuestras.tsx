import type { ReactNode } from 'react';
import { Alert } from '../../components/Alert';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ButtonLink } from '../../components/ButtonLink';
import { Icon } from '../../components/Icon';
import type { IconName } from '../../components/Icon/Icon.types';
import { DocDeviceFrame } from '../../docs/DocDeviceFrame';
import { docBody } from '../../docs/docShared';
import { cn } from '../../utils/cn';
import type { TokenTheme } from '../_doc';
import { DocExamplePanel } from '../_doc/FoundationBlocks';
import { FAMILY_LABELS, colorInfo, decimal, pairRatio, ratioText, primitiveHex, primitiveVar, ratioLevel, upperHex } from './colorData';
import type { FamilyId, Primitive } from './colorData';

/*
 * Muestras propias de Colores (bloques `custom` / `preview` de la página): muestras de primitivos, principal por modo,
 * barra de dominancia, valores de un token por modo, contraste medido y la interfaz de ejemplo de Aplicación. Todo se
 * pinta con variables de tokens.css (variables `--color-ds-…` o utilidades `ds-`); los hex que se leen salen del mismo archivo.
 */

// ───────────────────────── base ─────────────────────────

const primary = 'font-ds-primitives-typography-family-primary';
const secondary = 'font-ds-primitives-typography-family-secondary';
const semibold = 'font-ds-primitives-typography-weight-semibold';

/** Etiqueta de una muestra (Body/Short text/Body-sm-600), como en Tipografía. */
const sampleLabel = cn(primary, semibold, 'm-0 text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-heading');
/** Texto pequeño de apoyo (hex, porcentaje): 12/16. */
const smallText = cn(primary, 'm-0 text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-md text-ds-text-neutral-body tabular-nums');

/** Trazo interior de 1 px para que un color cercano al de la tarjeta no se pierda (no suma al tamaño). */
const ring = 'shadow-[inset_0_0_0_1px_var(--color-ds-border-general-default-on-card)]';

const MODE_LABEL: Record<TokenTheme, string> = { light: 'Modo claro', dark: 'Modo oscuro' };

/** Cuadro de color (decorativo: el texto de al lado nombra el color). */
function Chip({ css, className }: { css: string; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('relative block shrink-0 overflow-hidden', className)}>
      <span className="absolute inset-0" style={{ background: css }} />
      <span className={cn('absolute inset-0 rounded-[inherit]', ring)} />
    </span>
  );
}

// ───────────────────────── primitivos ─────────────────────────

/**
 * Muestras de una familia de primitivos: el color, su nombre corto y su hex. Los primitivos no cambian con el modo.
 * `wide`: familia larga (Primario, 16 tonos): 8 por fila en anchos grandes.
 */
export function PrimitiveSwatches({ items, label, wide = false }: { items: Primitive[]; label: string; wide?: boolean }) {
  return (
    <ul
      role="list"
      aria-label={label}
      className={cn(
        'm-0 grid list-none grid-cols-3 gap-ds-space-general-xl p-0',
        wide ? '@xl:grid-cols-4 @3xl:grid-cols-8' : '@2xl:grid-cols-6',
      )}
    >
      {items.map((p) => (
        <li key={p.variable} className="flex min-w-0 flex-col gap-ds-space-general-md">
          <Chip css={`var(${p.variable})`} className="h-16 w-full rounded-ds-radius-general-lg" />
          <span className="flex flex-col">
            <span className={sampleLabel}>{p.code}</span>
            <span className={smallText}>{upperHex(p.hex)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Una fila de la tarjeta de principal: muestra, nombre y hex de un primitivo. */
function PrincipalItem({ code, label }: { code: string; label?: string }) {
  const variable = primitiveVar(code);
  const hex = variable ? primitiveHex(variable) : undefined;
  if (!variable || !hex) return null;
  return (
    <li className="flex min-w-0 items-center gap-ds-space-general-xl">
      <Chip css={`var(${variable})`} className="size-12 rounded-ds-radius-general-md" />
      <span className="flex min-w-0 flex-col">
        <span className={sampleLabel}>{label ? `${label} · ${code}` : code}</span>
        <span className={smallText}>{upperHex(hex)}</span>
      </span>
    </li>
  );
}

/**
 * Primitivo principal de una familia en cada modo (norma de la documentación de Figma), en dos paneles "Ejemplo".
 * Con varias filas (Semánticos), cada fila lleva el nombre de su familia.
 */
export function PrincipalPanels({ rows }: { rows: { family?: FamilyId; light: string; dark: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-ds-space-general-3xl @2xl:grid-cols-2">
      {(['light', 'dark'] as const).map((mode) => (
        <DocExamplePanel key={mode}>
          <p className={sampleLabel}>Principal en {MODE_LABEL[mode].toLowerCase()}</p>
          <ul role="list" className={cn('m-0 grid list-none grid-cols-1 gap-ds-space-general-xl p-0', rows.length > 1 && '@4xl:grid-cols-2')}>
            {rows.map((row) => (
              <PrincipalItem key={row[mode]} code={row[mode]} label={row.family ? FAMILY_LABELS[row.family] : undefined} />
            ))}
          </ul>
        </DocExamplePanel>
      ))}
    </div>
  );
}

// ───────────────────────── dominancia ─────────────────────────

/** Barra de dominancia: un tramo por color con su porcentaje, y la leyenda con nombre, porcentaje y hex. */
export function DominanceBar({ items }: { items: { code: string; percent: number }[] }) {
  const rows = items.flatMap((d) => {
    const variable = primitiveVar(d.code);
    const hex = variable ? primitiveHex(variable) : undefined;
    return variable && hex ? [{ ...d, variable, hex }] : [];
  });
  return (
    <div className="flex flex-col gap-ds-space-general-3xl">
      <div
        role="img"
        aria-label={`Dominancia de color: ${rows.map((d) => `${d.code} ${d.percent}%`).join(', ')}`}
        className="relative flex h-16 overflow-hidden rounded-ds-radius-general-lg"
      >
        {rows.map((d) => (
          <span key={d.code} className="h-full" style={{ flexGrow: d.percent, flexBasis: 0, background: `var(${d.variable})` }} />
        ))}
        <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', ring)} />
      </div>
      <ul role="list" className="m-0 grid list-none grid-cols-2 gap-ds-space-general-xl p-0 @2xl:grid-cols-4">
        {rows.map((d) => (
          <li key={d.code} className="flex min-w-0 items-center gap-ds-space-general-lg">
            <Chip css={`var(${d.variable})`} className="size-6 rounded-ds-radius-general-full" />
            <span className="flex flex-col">
              <span className={sampleLabel}>
                {d.code} · {d.percent}%
              </span>
              <span className={smallText}>{upperHex(d.hex)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ───────────────────────── roles ─────────────────────────

/** Primitivos de un rol en línea: un punto de color y su nombre corto. */
export function RoleChips({ items }: { items: Primitive[] }) {
  return (
    <span className="flex flex-wrap gap-x-ds-space-general-xl gap-y-ds-space-general-md">
      {items.map((p) => (
        <span key={p.variable} className="inline-flex items-center gap-ds-space-general-md whitespace-nowrap">
          <Chip css={`var(${p.variable})`} className="size-3 rounded-ds-radius-general-full" />
          {p.code}
        </span>
      ))}
    </span>
  );
}

// ───────────────────────── celdas de tabla ─────────────────────────

/** Fondo de cuadros para ver la opacidad de un color translúcido. */
const checker =
  'bg-[conic-gradient(var(--color-ds-primitives-color-primary-g06)_25%,var(--color-ds-primitives-color-primary-b01)_0_50%,var(--color-ds-primitives-color-primary-g06)_0_75%,var(--color-ds-primitives-color-primary-b01)_0)] bg-[length:8px_8px]';

/** Valor de un token en un modo: muestra (sobre cuadros si es translúcido), primitivo y opacidad, y hex. */
export function TokenValue({ variable, theme }: { variable: string; theme: TokenTheme }) {
  const info = colorInfo(variable, theme);
  if (!info) return <span>Sin valor en este modo</span>;
  const translucent = info.percent < 100;
  return (
    <span className="flex items-center gap-ds-space-general-lg">
      <span aria-hidden="true" className={cn('relative size-8 shrink-0 overflow-hidden rounded-ds-radius-general-md', translucent && checker)}>
        <span className="absolute inset-0" style={{ background: info.css }} />
        <span className={cn('absolute inset-0 rounded-[inherit]', ring)} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-ds-text-neutral-heading">
          {info.primitive ?? 'Valor directo'}
          {translucent && ` · ${decimal(info.percent)}%`}
        </span>
        <span className="tabular-nums">{upperHex(info.hex)}</span>
      </span>
    </span>
  );
}

/** Contraste medido de un par en un modo: muestra "Aa" con los dos colores, relación y nivel que alcanza. */
export function ContrastValue({ fg, bg, theme }: { fg: string; bg: string; theme: TokenTheme }) {
  const ratio = pairRatio(fg, bg, theme);
  const f = colorInfo(fg, theme);
  const b = colorInfo(bg, theme);
  if (ratio === undefined || !f || !b) return <span>Sin valor en este modo</span>;
  return (
    <span className="flex items-center gap-ds-space-general-lg">
      <span
        aria-hidden="true"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-ds-radius-general-md text-ds-primitives-typography-size-lg',
          semibold,
          ring,
        )}
        style={{ background: b.css, color: f.css }}
      >
        Aa
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-ds-text-neutral-heading tabular-nums">{ratioText(ratio)}</span>
        <span>{ratioLevel(ratio)}</span>
      </span>
    </span>
  );
}

// ───────────────────────── interfaz de ejemplo ─────────────────────────

const eyebrow = cn(primary, semibold, 'm-0 text-ds-typography-body-size-sm leading-ds-typography-body-line-height-short-sm uppercase');
const titleText = cn(secondary, semibold, 'm-0 text-ds-typography-heading-size-xl leading-ds-typography-heading-line-height-xl');
const bodyText = cn(primary, 'm-0 font-ds-primitives-typography-weight-regular text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md');

/**
 * Variante de la interfaz de ejemplo:
 * - `default`: superficie y texto neutros, un acento (antetítulo y enlace), la acción primaria y un aviso de éxito.
 * - `all-accent`: título, cuerpo y acciones en colores de acento (mal ejemplo: el acento deja de guiar).
 */
export type MuestraColorVariant = 'default' | 'all-accent';

/**
 * Interfaz neutra con componentes de CAOS: tarjeta `background/container/surface` con antetítulo de acento, título,
 * cuerpo, aviso de éxito (Alert) y acciones (Button primario y ButtonLink).
 */
export function MuestraColor({ variant = 'default' }: { variant?: MuestraColorVariant }) {
  const accent = variant === 'all-accent';
  return (
    <div className="flex w-full min-w-0 flex-col gap-ds-space-general-xl rounded-ds-radius-general-xl bg-ds-background-container-surface p-ds-space-general-2xl text-left">
      <div className="flex items-center justify-between gap-ds-space-general-lg">
        <p className={cn(eyebrow, 'text-ds-text-acent-firts')}>Mis proyectos</p>
        <Badge type="number" state="success" label="documentos aprobados">
          3
        </Badge>
      </div>
      <p className={cn(titleText, accent ? 'text-ds-text-link-default' : 'text-ds-text-neutral-heading')}>Informe trimestral</p>
      <p className={cn(bodyText, accent ? 'text-ds-text-acent-firts' : 'text-ds-text-neutral-body')}>
        Revisa los cambios antes de compartir el documento con tu equipo.
      </p>
      {accent ? (
        <div className="flex flex-wrap gap-ds-space-general-lg">
          <ButtonLink iconRight={false}>Ver historial</ButtonLink>
          <ButtonLink iconRight={false}>Ver versiones</ButtonLink>
          <ButtonLink iconRight={false}>Ver comentarios</ButtonLink>
        </div>
      ) : (
        <Alert type="success" title="Documento guardado">
          La última versión ya está disponible.
        </Alert>
      )}
      <div className="flex flex-wrap items-center gap-ds-space-general-xl">
        <Button variant="primary" size="sm">
          Compartir
        </Button>
        <ButtonLink iconRight={false}>Ver historial</ButtonLink>
      </div>
    </div>
  );
}

/** La misma interfaz en el modo claro y en el oscuro (cada marco fuerza su modo con `data-theme`). */
export function MuestraModos() {
  return (
    <div className="grid grid-cols-1 gap-ds-primitives-space-4xl @3xl:grid-cols-2">
      {(['light', 'dark'] as const).map((mode) => (
        <div key={mode} className="flex min-w-0 flex-col gap-ds-space-general-xl">
          <h3 className={sampleLabel}>{MODE_LABEL[mode]}</h3>
          <div data-theme={mode} className="flex flex-1 rounded-ds-radius-general-2xl outline-1 outline-ds-border-general-default-on-canva outline-solid">
            <DocDeviceFrame breakpoint="mobile" className="flex-1">
              <MuestraColor />
            </DocDeviceFrame>
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────── Do and Dont’s ─────────────────────────

/**
 * Par "Color por token": la misma tarjeta en los dos modos. `fixed` pinta el fondo con un primitivo
 * (`color/primary/B01`), que no cambia con el modo: en oscuro, el texto del token se pierde.
 */
export function MuestraTokenOValor({ fixed = false }: { fixed?: boolean }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-ds-space-general-lg">
      {(['light', 'dark'] as const).map((mode) => (
        <div
          key={mode}
          data-theme={mode}
          className={cn(
            'flex flex-col gap-ds-space-general-md rounded-ds-radius-general-xl p-ds-space-general-2xl',
            fixed ? 'bg-ds-primitives-color-primary-b01' : 'bg-ds-background-container-surface',
          )}
        >
          <p className={cn(eyebrow, 'text-ds-text-neutral-gray')}>{MODE_LABEL[mode]}</p>
          <p className={cn(titleText, 'text-ds-text-neutral-heading')}>Informe trimestral</p>
          <p className={cn(bodyText, 'text-ds-text-neutral-body')}>Última edición hace 2 horas.</p>
        </div>
      ))}
    </div>
  );
}

const STATES: { name: string; label: string; icon: IconName; iconClass: string; dotClass: string }[] = [
  { name: 'Contrato de servicios', label: 'Aprobado', icon: 'tick-circle', iconClass: 'text-ds-icon-semantic-success-secondary', dotClass: 'bg-ds-icon-semantic-success-secondary' },
  { name: 'Plan de trabajo', label: 'En revisión', icon: 'warning', iconClass: 'text-ds-icon-semantic-alert-secondary', dotClass: 'bg-ds-icon-semantic-alert-secondary' },
  { name: 'Acta de reunión', label: 'Rechazado', icon: 'forbidden-2', iconClass: 'text-ds-icon-semantic-error-secondary', dotClass: 'bg-ds-icon-semantic-error-secondary' },
];

/** Par "Significado no solo por color": estados con ícono y texto, o (`colorOnly`) solo con un punto de color. */
export function MuestraEstados({ colorOnly = false }: { colorOnly?: boolean }) {
  return (
    <ul role="list" className="m-0 flex w-full min-w-0 list-none flex-col gap-ds-space-general-lg rounded-ds-radius-general-xl bg-ds-background-container-surface p-ds-space-general-2xl">
      {STATES.map((s) => (
        <li key={s.name} className="flex items-center justify-between gap-ds-space-general-xl">
          <span className={cn(bodyText, 'text-ds-text-neutral-heading')}>{s.name}</span>
          {colorOnly ? (
            <span aria-hidden="true" className={cn('size-3 shrink-0 rounded-ds-radius-general-full', s.dotClass)} />
          ) : (
            <span className={cn(bodyText, 'inline-flex shrink-0 items-center gap-ds-space-general-md text-ds-text-neutral-body')}>
              <Icon name={s.icon} size={16} variant="fill" className={s.iconClass} />
              {s.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

// ───────────────────────── receta ─────────────────────────

/** Roles de la interfaz de ejemplo y los tokens que pintan cada uno. */
export function RecetaRoles({ items }: { items: { role: string; content: ReactNode }[] }) {
  return (
    <div className="grid grid-cols-1 gap-ds-space-general-3xl @3xl:grid-cols-2 @3xl:items-center">
      <MuestraColor />
      <dl className="m-0 flex min-w-0 flex-col gap-ds-space-general-2xl">
        {items.map((item) => (
          <div key={item.role} className="flex flex-col gap-ds-space-general-md">
            <dt className={sampleLabel}>{item.role}</dt>
            <dd className={cn(docBody, 'm-0')}>{item.content}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
