import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Input } from '../components/Input';
import { Radio } from '../components/Radio';
import { Select } from '../components/Select';
import { Switch } from '../components/Switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Table/Table';
import { TableMobileField, TableMobileList, TableMobileRow } from '../components/Table/TableMobile';
import { TableText } from '../components/Table/TableContent';
import { Tag } from '../components/Tag';
import { Toast, Toaster } from '../components/Toast';
import { cn } from '../utils/cn';
import { DocCodeBlock } from './DocCodeBlock';
import { DocDotsCanvas } from './DocV2';
import { buildCode, controlFor, defaultValueOf, literalsFromType } from './liveCode';
import type { LiveArgType, PropControl } from './liveCode';
import type { DocPropRow } from './types';

/*
 * Sección Desarrollo de la plantilla v2, hecha con componentes de CAOS: lienzo con barra propia (zoom y abrir la
 * historia), código generado de los args y tabla de props con un control por tipo. De Storybook solo llega la
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

/** Barra del lienzo: acercar, alejar, restablecer zoom y abrir la historia sola. Todo con `Button`. */
function CanvasToolbar({ zoom, setZoom, storyId }: { zoom: number; setZoom: (z: number) => void; storyId: string }) {
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
        <Button variant="tertiary" size="xs" iconOnly iconSize={16} aria-label="Restablecer zoom" disabled={zoom === 1} onClick={() => setZoom(1)}>
          <Icon name="refresh" />
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
    <DocDotsCanvas>
      <CanvasToolbar zoom={zoom} setZoom={setZoom} storyId={live.storyId} />
      <div className="flex min-h-48 items-center justify-center overflow-auto px-ds-space-general-5xl pt-ds-space-general-lg pb-ds-primitives-space-6xl">
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

/** "Ver código" / "Copiar código" y el JSX generado de los args actuales. El aviso de copiado es un `Toast`. */
function DocLiveCode({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; n: number } | null>(null);
  const codeId = useId();
  return (
    <div className="flex flex-col gap-ds-space-general-2xl">
      <div className="flex flex-wrap gap-ds-space-general-lg">
        <Button
          variant="secondary"
          size="xs"
          iconSize={16}
          leftIcon={<Icon name="code" />}
          aria-expanded={open}
          aria-controls={open ? codeId : undefined}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Ocultar código' : 'Ver código'}
        </Button>
        <Button
          variant="secondary"
          size="xs"
          iconSize={16}
          leftIcon={<Icon name="document-copy" />}
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

// ───────────────────────── tabla de props ─────────────────────────

/** Control de una fila según el tipo de la prop. */
function PropControlInput({
  name,
  control,
  value,
  disabled,
  onChange,
}: {
  name: string;
  control: PropControl;
  value: unknown;
  disabled: boolean;
  onChange: (value: unknown) => void;
}) {
  switch (control.kind) {
    case 'boolean':
      return <Switch aria-label={name} checked={value === true} disabled={disabled} onCheckedChange={onChange} />;
    case 'radio':
      return (
        <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-x-ds-space-general-2xl gap-y-ds-space-general-md">
          {control.options.map((o) => (
            <Radio key={String(o)} name={`doc-control-${name}`} checked={value === o} disabled={disabled} onChange={() => onChange(o)}>
              {String(o)}
            </Radio>
          ))}
        </div>
      );
    case 'select':
      return (
        <Select
          label={name}
          fullWidth
          disabled={disabled}
          value={value === undefined || value === null ? null : String(value)}
          onValueChange={(v) => onChange(control.options.find((o) => String(o) === v) ?? v)}
          options={control.options.map((o) => ({ value: String(o), label: String(o) }))}
        />
      );
    case 'text':
      return (
        <Input
          label={name}
          fullWidth
          disabled={disabled}
          value={typeof value === 'string' ? value : ''}
          onValueChange={(v) => onChange(v === '' ? undefined : v)}
        />
      );
    case 'number':
      return (
        <Input
          label={name}
          type="number"
          fullWidth
          disabled={disabled}
          value={typeof value === 'number' ? String(value) : ''}
          onValueChange={(v) => onChange(v === '' || Number.isNaN(Number(v)) ? undefined : Number(v))}
        />
      );
    case 'none':
      return <span aria-label="Sin control">—</span>;
  }
}

/** Tipo de la prop: los valores literales como `Tag`, el resto como código. */
function PropType({ type }: { type: string | undefined }) {
  if (!type) return null;
  const literals = literalsFromType(type);
  if (literals) {
    return (
      <span className="flex flex-wrap gap-ds-space-general-md pt-ds-space-general-md">
        {literals.map((l) => (
          <Tag key={String(l)} size="sm" type="neutral" iconLeft={false}>
            {String(l)}
          </Tag>
        ))}
      </span>
    );
  }
  return <code className="font-mono">{type}</code>;
}

function PropName({ row }: { row: DocPropRow }) {
  return (
    <>
      <code className="font-mono text-ds-primitives-typography-size-md">{row.name}</code>
      {row.required && (
        <span className="text-ds-icon-semantic-error-firts">
          <span aria-hidden="true"> *</span>
          <span className="sr-only"> (obligatoria)</span>
        </span>
      )}
    </>
  );
}

/**
 * Tabla de props (`Table` de CAOS): prop, descripción con su tipo, valor por defecto y un control (`Switch`, `Radio`,
 * `Select`, `Input`). Cambiar un control cambia la historia; sin `live` los controles muestran el valor por defecto y no se pueden usar.
 */
function DocPropsTable({ importName, props, live }: { importName: string; props: DocPropRow[]; live?: DocLive }) {
  const label = `Props de ${importName}`;
  const rows = useMemo(
    () =>
      props.map((row) => {
        const control = controlFor(live?.argTypes[row.name], row.type);
        return { row, control, fallback: defaultValueOf(row, control) };
      }),
    [props, live?.argTypes],
  );
  const valueOf = (name: string, fallback: unknown) => (live ? live.args[name] : fallback);

  const mobile = (
    <TableMobileList aria-label={label}>
      {rows.map(({ row, control, fallback }) => (
        <TableMobileRow key={row.name}>
          <TableMobileField className="h-auto min-h-14" label="Prop">
            <PropName row={row} />
          </TableMobileField>
          <TableMobileField className="h-auto min-h-14" label="Descripción">
            <TableText description={<PropType type={row.type} />}>{row.description ?? ''}</TableText>
          </TableMobileField>
          <TableMobileField className="h-auto min-h-14" label="Por defecto">{row.defaultValue ? <code className="font-mono">{row.defaultValue}</code> : '—'}</TableMobileField>
          <TableMobileField className="h-auto min-h-14" label="Control">
            <PropControlInput
              name={row.name}
              control={control}
              value={valueOf(row.name, fallback)}
              disabled={!live}
              onChange={(v) => live?.updateArgs({ [row.name]: v })}
            />
          </TableMobileField>
        </TableMobileRow>
      ))}
    </TableMobileList>
  );

  return (
    <Table label={label} mobile={mobile} className="min-w-180">
      <TableHeader>
        <TableRow>
          <TableHead>Prop</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Por defecto</TableHead>
          <TableHead className="w-72">Control</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ row, control, fallback }) => (
          <TableRow key={row.name}>
            <TableCell role="rowheader">
              <PropName row={row} />
            </TableCell>
            <TableCell>
              <TableText description={<PropType type={row.type} />}>{row.description ?? ''}</TableText>
            </TableCell>
            <TableCell>{row.defaultValue ? <code className="font-mono">{row.defaultValue}</code> : '—'}</TableCell>
            <TableCell>
              <PropControlInput
                name={row.name}
                control={control}
                value={valueOf(row.name, fallback)}
                disabled={!live}
                onChange={(v) => live?.updateArgs({ [row.name]: v })}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ───────────────────────── conjunto ─────────────────────────

/** Lienzo, código generado y tabla de props con controles. Sin `live` solo dibuja la tabla, de solo lectura. */
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
          <DocCanvas live={live} />
          <DocLiveCode code={code} />
        </>
      )}
      <div className="flex min-w-0 flex-col gap-ds-space-general-2xl">
        {live && (
          <div className="flex flex-wrap items-center justify-between gap-ds-space-general-lg">
            <p className="m-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md leading-ds-primitives-typography-line-height-xl text-ds-text-neutral-body">
              Cambia un valor y se actualizan el lienzo y el código.
            </p>
            <Button variant="secondary" size="xs" iconSize={16} leftIcon={<Icon name="rotate-left" />} onClick={live.resetArgs}>
              Restablecer
            </Button>
          </div>
        )}
        <DocPropsTable importName={importName} props={props} live={live} />
      </div>
    </div>
  );
}
