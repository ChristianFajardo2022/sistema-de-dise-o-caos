import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Switch } from '../components/Switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Table/Table';
import { TableMobileField, TableMobileList, TableMobileRow } from '../components/Table/TableMobile';
import { Tag } from '../components/Tag';
import { Toast, Toaster } from '../components/Toast';
import { cn } from '../utils/cn';
import { DocCodeBlock } from './DocCodeBlock';
import { DocBigCard, DocDotsCanvas } from './DocV2';
import { buildCode, controlFor, defaultValueOf } from './liveCode';
import type { LiveArgType, PropControl } from './liveCode';
import { docInline } from './docShared';
import type { DocPropRow } from './types';

/*
 * Sección Desarrollo de la plantilla v2, hecha con componentes de CAOS: lienzo con barra propia (zoom, restablecer y
 * abrir la historia), código generado de los args, tarjeta "Personalizar" (un control por prop) y tarjeta "Props" (tabla de solo lectura). De Storybook solo llega la
 * lógica (`DocLive`, ver StorybookDocsPage): la historia ya dibujada, los args y cómo cambiarlos.
 */

/** Conexión con la historia principal. Sin ella (p. ej. fuera de Docs) la sección es de solo lectura. */
export interface DocLive {
  /** Id de la historia (para abrirla sola en otra pestaña). */
  storyId: string;
  /** La historia dibujada (bloque `Story` de Storybook, sin su marco). */
  story: ReactNode;
  /** Args actuales de la historia. */
  args: Record<string, unknown>;
  /** ArgTypes de la historia (controles declarados). */
  argTypes: Record<string, LiveArgType>;
  /** Cambia args (llega a la historia por el canal de Storybook). */
  updateArgs: (args: Record<string, unknown>) => void;
  /** Vuelve a los args iniciales de la historia. */
  resetArgs: () => void;
}

// ───────────────────────── lienzo ─────────────────────────

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2];

/**
 * Barra del lienzo: acercar, alejar, restablecer y abrir la historia sola. Todo con `Button`. Restablecer vuelve el
 * zoom al 100 % y las props a sus valores iniciales (`onReset`).
 */
function CanvasToolbar({
  zoom,
  setZoom,
  onReset,
  storyId,
}: {
  zoom: number;
  setZoom: (z: number) => void;
  onReset: () => void;
  storyId: string;
}) {
  const step = ZOOM_STEPS.indexOf(zoom);
  return (
    <div className="flex justify-end p-ds-space-general-lg">
      <div
        role="toolbar"
        aria-label="Lienzo"
        className="flex items-center gap-ds-space-general-md rounded-ds-radius-general-full bg-ds-background-container-default-on-canva p-ds-space-general-md"
      >
        <Button
          variant="tertiary"
          size="xs"
          iconOnly
          iconSize={16}
          aria-label="Alejar"
          disabled={step <= 0}
          onClick={() => setZoom(ZOOM_STEPS[Math.max(0, step - 1)])}
        >
          <Icon name="minus-circle" />
        </Button>
        <span aria-live="polite" className="min-w-12 text-center font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm text-ds-text-neutral-heading tabular-nums">
          <span className="sr-only">Zoom </span>
          {Math.round(zoom * 100)} %
        </span>
        <Button
          variant="tertiary"
          size="xs"
          iconOnly
          iconSize={16}
          aria-label="Acercar"
          disabled={step >= ZOOM_STEPS.length - 1}
          onClick={() => setZoom(ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, step + 1)])}
        >
          <Icon name="add-circle" />
        </Button>
        <Button variant="tertiary" size="xs" iconOnly iconSize={16} aria-label="Restablecer zoom y props" onClick={onReset}>
          <Icon name="rotate-left" />
        </Button>
        <Button
          variant="tertiary"
          size="xs"
          iconOnly
          iconSize={16}
          aria-label="Abrir en una pestaña nueva"
          href={`iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`}
          target="_blank"
        >
          <Icon name="export" />
        </Button>
      </div>
    </div>
  );
}

// Figma: "Estado del indicador" con "Dots" (panel interno de la plantilla)
/** Lienzo de la historia principal: panel con puntos, barra propia y el zoom aplicado solo al contenido. */
function DocCanvas({ live }: { live: DocLive }) {
  const [zoom, setZoom] = useState(1);
  return (
    <DocDotsCanvas className="flex min-h-80 flex-col tablet:min-h-130.5">
      <CanvasToolbar
        zoom={zoom}
        setZoom={setZoom}
        onReset={() => {
          setZoom(1);
          live.resetArgs();
        }}
        storyId={live.storyId}
      />
      <div className="flex flex-1 items-center justify-center overflow-auto px-ds-space-general-5xl pt-ds-space-general-lg pb-ds-primitives-space-6xl">
        {/*
          `zoom` escala el contenido y su espacio en el flujo; el marco del lienzo no cambia. El decorador global de tema
          (.storybook/ThemeWrapper) pinta fondo y relleno propios alrededor de la historia: aquí se anulan para que el
          componente quede sobre el lienzo (la historia que se abre sola en otra pestaña sí los conserva).
        */}
        <div
          data-doc-zoom=""
          style={{ zoom }}
          className="max-w-full [&>.sb-story>div>div]:min-h-0! [&>.sb-story>div>div]:bg-transparent! [&>.sb-story>div>div]:p-0!"
        >
          {live.story}
        </div>
      </div>
    </DocDotsCanvas>
  );
}

// ───────────────────────── código ─────────────────────────

/** Copia al portapapeles (con respaldo para contextos sin permiso). */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

// Figma: botones de código 23024:64920
/**
 * "Ver código" / "Copiar código" (`Button` terciario xs con ícono de 14, separados 24, alineados a la izquierda) y el
 * JSX generado de los args actuales. El aviso de copiado es un `Toast`.
 */
function DocLiveCode({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; n: number } | null>(null);
  const codeId = useId();
  return (
    <div className="flex flex-col gap-ds-space-general-2xl">
      <div className="flex flex-wrap gap-ds-primitives-space-4xl">
        <Button
          variant="tertiary"
          size="xs"
          iconSize={14}
          leftIcon={<Icon name="code" variant="fill" />}
          aria-expanded={open}
          aria-controls={open ? codeId : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Ocultar código' : 'Ver código'}
        </Button>
        <Button
          variant="tertiary"
          size="xs"
          iconSize={14}
          leftIcon={<Icon name="document-copy" variant="fill" />}
          onClick={async () => setNotice({ ok: await copyText(code), n: Date.now() })}
        >
          Copiar código
        </Button>
      </div>
      {open && (
        <DocCodeBlock id={codeId} label="Código generado">
          {code}
        </DocCodeBlock>
      )}
      {notice && (
        <Toaster label="Avisos">
          <Toast
            key={notice.n}
            type={notice.ok ? 'success' : 'error'}
            title={notice.ok ? 'Código copiado' : 'No se pudo copiar'}
            description={notice.ok ? 'Ya está en el portapapeles.' : 'Selecciónalo y cópialo a mano.'}
            duration={2500}
            onClose={() => setNotice(null)}
          />
        </Toaster>
      )}
    </div>
  );
}

// ───────────────────────── Personalizar ─────────────────────────

/** Título de bloque, fuera de la tarjeta: el mismo h2 de las secciones (Heading-xl-600, 32/36, `text/neutral/heading`). */
const blockTitle =
  'm-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-2xl leading-ds-typography-heading-line-height-2xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading text-balance';

/**
 * Bloque de Desarrollo ("Personalizar", "Props") con su título arriba, fuera de la caja, como las secciones de la
 * plantilla: título (y a la derecha un dato opcional, p. ej. el contador), bajada y, debajo, el contenido a 32.
 */
function DevBlock({ title, aside, description, children }: { title: string; aside?: ReactNode; description?: ReactNode; children: ReactNode }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="flex min-w-0 flex-col gap-ds-primitives-space-4xl">
      <div className="flex flex-col gap-ds-space-general-xl">
        <div className="flex flex-wrap items-baseline justify-between gap-ds-space-general-lg">
          <h2 id={headingId} className={blockTitle}>
            {title}
          </h2>
          {aside}
        </div>
        {description}
      </div>
      {children}
    </section>
  );
}

/** Texto de apoyo de las tarjetas (Body 14/20 en `text/neutral/body`). */
const cardBody =
  'm-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-xl text-ds-text-neutral-body';

/**
 * Control del tipo de la prop. `labelId` apunta a la etiqueta visible de la tarjeta, que da el nombre accesible. El
 * `Input` y el `Select` llevan además su etiqueta flotante visible ("Texto", "Número", "Opción"), dentro del campo
 * mientras no hay valor, como "Number" en Figma.
 */
function PropControlInput({
  labelId,
  control,
  value,
  onChange,
}: {
  labelId: string;
  control: Exclude<PropControl, { kind: 'none' }>;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (control.kind) {
    case 'boolean':
      return <Switch aria-labelledby={labelId} checked={value === true} onCheckedChange={onChange} />;
    case 'select':
      return (
        // Label visible "Opción" (como "Texto" y "Número" de Input); el nombre accesible es la etiqueta de la tarjeta
        <Select
          label="Opción"
          aria-labelledby={labelId}
          className="w-40"
          value={value === undefined || value === null ? null : String(value)}
          onValueChange={(v) => onChange(control.options.find((o) => String(o) === v) ?? v)}
          options={control.options.map((o) => ({ value: String(o), label: String(o) }))}
        />
      );
    case 'text':
      return (
        <Input
          label="Texto"
          aria-labelledby={labelId}
          className="w-40"
          value={typeof value === 'string' ? value : ''}
          onValueChange={(v) => onChange(v === '' ? undefined : v)}
        />
      );
    case 'number':
      return (
        <Input
          label="Número"
          type="number"
          aria-labelledby={labelId}
          className="w-27"
          value={typeof value === 'number' ? String(value) : ''}
          onValueChange={(v) => onChange(v === '' || Number.isNaN(Number(v)) ? undefined : Number(v))}
        />
      );
  }
}

// Figma: "Card / Simple / On canva" 23013:22633 (tarjeta de control)
/**
 * Tarjeta de control: superficie `default-on-card` con su radio, padding `space/container/on-card-stretch` y la
 * etiqueta (Highlight 16/20 semibold) a la izquierda y el control a la derecha, con 10 de separación. Sin muesca:
 * lo que dibuja la silueta "Canva" en el resto del repo es `NotchedSurface`, que con `notch="none"` queda como un
 * rectángulo redondeado con trazo; aquí la tarjeta es plana (como en Figma), así que basta el relleno.
 */
function ControlCard({ name, control, value, onChange }: { name: string; control: Exclude<PropControl, { kind: 'none' }>; value: unknown; onChange: (value: unknown) => void }) {
  const labelId = useId();
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-2.5 rounded-ds-radius-container-on-card bg-ds-background-container-default-on-card p-ds-space-container-on-card-stretch">
      <span
        id={labelId}
        className={cn(
          'min-w-0 [overflow-wrap:anywhere] font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-lg leading-ds-primitives-typography-line-height-xl font-ds-primitives-typography-weight-semibold',
          control.kind === 'text' || control.kind === 'number' ? 'text-ds-text-neutral-body' : 'text-ds-text-neutral-white',
        )}
      >
        {name}
      </span>
      <div className="ml-auto shrink-0">
        <PropControlInput labelId={labelId} control={control} value={value} onChange={onChange} />
      </div>
    </div>
  );
}

/**
 * "Personalizar": título arriba y la tarjeta con una tarjeta de control por prop con control (3 columnas; 2 en tablet;
 * 1 en móvil), como la "Tarjeta" de la pantalla Desarrollo de Figma.
 */
function DocCustomize({ controls, live }: { controls: { name: string; control: Exclude<PropControl, { kind: 'none' }> }[]; live: DocLive }) {
  if (controls.length === 0) return null;
  return (
    <DevBlock title="Personalizar">
      <DocBigCard className="p-ds-primitives-space-2xl tablet:p-ds-primitives-space-5xl">
        <div className="grid grid-cols-1 gap-ds-primitives-space-4xl @2xl:grid-cols-2 @5xl:grid-cols-3">
          {controls.map(({ name, control }) => (
            <ControlCard key={name} name={name} control={control} value={live.args[name]} onChange={(v) => live.updateArgs({ [name]: v })} />
          ))}
        </div>
      </DocBigCard>
    </DevBlock>
  );
}

// ───────────────────────── Props ─────────────────────────

/** Nombre de la prop en código violeta claro (`text/acent/firts`); `*` si es obligatoria. */
function PropName({ row }: { row: DocPropRow }) {
  return (
    <>
      <code className="font-mono text-ds-primitives-typography-size-md text-ds-text-acent-firts">{row.name}</code>
      {row.required && (
        <span className="text-ds-icon-semantic-error-firts">
          <span aria-hidden="true"> *</span>
          <span className="sr-only"> (obligatoria)</span>
        </span>
      )}
    </>
  );
}

/** Tipo de la prop: mono en `text/neutral/body`, partido donde haga falta para que no desborde. */
function PropType({ type }: { type: string | undefined }) {
  return type ? <code className="font-mono [overflow-wrap:anywhere] text-ds-text-neutral-body">{type}</code> : <>—</>;
}

/** Valor por defecto como chip (`Tag` neutro). */
function PropDefault({ value }: { value: string | undefined }) {
  if (!value) return <>—</>;
  return (
    <Tag size="sm" type="neutral" iconLeft={false} className="max-w-full font-mono">
      {value}
    </Tag>
  );
}

// Figma: Table 13544:69675 (filas sueltas sobre el lienzo, sin tarjeta de fondo)
/**
 * "Props": título arriba con el contador a la derecha y la bajada; debajo, la `Table` de CAOS de solo lectura con todas
 * las props (también las que no tienen control): Prop, Tipo, Por defecto y Descripción. La tabla va directamente sobre
 * el lienzo, como en Figma: dentro de una tarjeta sus filas se confundían con el fondo.
 */
function DocPropsCard({ importName, props }: { importName: string; props: DocPropRow[] }) {
  const label = `Props de ${importName}`;
  const count = `${props.length} ${props.length === 1 ? 'propiedad' : 'propiedades'}`;

  const mobile = (
    <TableMobileList aria-label={label}>
      {props.map((row) => (
        <TableMobileRow key={row.name}>
          <TableMobileField className="h-auto min-h-14" label="Prop">
            <PropName row={row} />
          </TableMobileField>
          <TableMobileField className="h-auto min-h-14" label="Tipo">
            <PropType type={row.type} />
          </TableMobileField>
          <TableMobileField className="h-auto min-h-14" label="Por defecto">
            <PropDefault value={row.defaultValue} />
          </TableMobileField>
          <TableMobileField className="h-auto min-h-14" label="Descripción">
            {row.description ?? '—'}
          </TableMobileField>
        </TableMobileRow>
      ))}
    </TableMobileList>
  );

  return (
    <DevBlock
      title="Props"
      aside={<p className={cardBody}>{count}</p>}
      description={
        <p className={cn(cardBody, docInline)}>
          Props de <code>{importName}</code> tal como están en el código. Las de HTML nativas que no aparecen aquí (como <code>className</code> o{' '}
          <code>aria-*</code>) pasan al elemento raíz.
        </p>
      }
    >
      <Table label={label} mobile={mobile} className="min-w-180">
        <TableHeader>
          <TableRow>
            <TableHead className="w-44">Prop</TableHead>
            <TableHead className="w-56">Tipo</TableHead>
            <TableHead className="w-40">Por defecto</TableHead>
            <TableHead>Descripción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.map((row) => (
            <TableRow key={row.name}>
              <TableCell role="rowheader">
                <PropName row={row} />
              </TableCell>
              <TableCell>
                <PropType type={row.type} />
              </TableCell>
              <TableCell>
                <PropDefault value={row.defaultValue} />
              </TableCell>
              <TableCell>{row.description ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DevBlock>
  );
}

// ───────────────────────── conjunto ─────────────────────────

/**
 * Lienzo, botones de código, tarjeta "Personalizar" (controles) y tarjeta "Props" (tabla de solo lectura). Sin `live`
 * solo dibuja la tarjeta de props.
 */
export function DocDevelopment({
  importName,
  props,
  live,
  className,
}: {
  importName: string;
  props: DocPropRow[];
  live?: DocLive;
  className?: string;
}) {
  const controls = useMemo(
    () =>
      live
        ? props.flatMap((row) => {
            const control = controlFor(live.argTypes[row.name], row.type);
            return control.kind === 'none' ? [] : [{ name: row.name, control }];
          })
        : [],
    [props, live],
  );
  const code = useMemo(() => {
    if (!live) return '';
    const defaults: Record<string, string | number | boolean | undefined> = {};
    for (const row of props) defaults[row.name] = defaultValueOf(row, controlFor(live.argTypes[row.name], row.type));
    return buildCode(importName, live.args, defaults);
  }, [importName, props, live]);

  return (
    <div className={cn('flex min-w-0 flex-col gap-ds-primitives-space-5xl', className)}>
      {live && (
        <>
          <div className="flex min-w-0 flex-col gap-ds-space-general-2xl">
            <DocCanvas live={live} />
            <DocLiveCode code={code} />
          </div>
          <DocCustomize controls={controls} live={live} />
        </>
      )}
      <DocPropsCard importName={importName} props={props} />
    </div>
  );
}
