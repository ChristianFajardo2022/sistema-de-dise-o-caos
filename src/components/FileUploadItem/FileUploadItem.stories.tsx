import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './FileUploadItem.doc';
import docsJson from './FileUploadItem.docs.json';
import { FileUploadItem } from './FileUploadItem';
import type { FileUploadItemProps, FileUploadStatus } from './FileUploadItem.types';

const STATUSES: FileUploadStatus[] = ['loading', 'complete', 'error', 'loading-error', 'alert'];

/**
 * Nombre de cada variante de Figma y los textos que trae. Figma las llama `Charging` y `Charging error` (en el código
 * son `loading` y `loading-error`).
 */
const FIGMA: Record<FileUploadStatus, { figma: string; message: string }> = {
  loading: { figma: 'State=Charging', message: 'Estado' },
  complete: { figma: 'State=Complete', message: 'Estado' },
  error: { figma: 'State=Error', message: 'Error' },
  'loading-error': { figma: 'State=Charging error', message: 'Error de carga' },
  alert: { figma: 'State=Alert', message: 'Estado' },
};

const ICONS = ['folder', 'document', 'document-text', 'image', 'gallery'] as const;

/**
 * Código copiable de Personalizar: el generado omite las funciones, así que se agregan los manejadores que dibuja la
 * tarjeta en cada estado (Descargar en `complete` y `error`, Reintentar en `loading-error` y `alert`; Eliminar siempre),
 * con nombres genéricos declarados. `progress` solo cuenta con barra (`loading` y `alert`).
 */
function docsCode(args: Record<string, unknown>): string {
  const status = (args['status'] as FileUploadStatus | undefined) ?? 'loading';
  const hasBar = status === 'loading' || status === 'alert';
  const lines: string[] = [];
  for (const [name, value] of Object.entries(args)) {
    if (value === undefined || value === '' || typeof value === 'function') continue;
    if ((name === 'status' && value === 'loading') || (name === 'icon' && value === 'folder')) continue;
    if (name === 'progress' && (!hasBar || value === 0)) continue;
    lines.push(typeof value === 'string' ? `${name}="${value}"` : `${name}={${JSON.stringify(value)}}`);
  }
  const handlers: [string, string][] = [];
  if (status === 'complete' || status === 'error') handlers.push(['onDownload', 'download']);
  if (status === 'loading-error' || status === 'alert') handlers.push(['onRetry', 'retry']);
  handlers.push(['onDelete', 'remove']);
  const declarations = handlers.map(([, fnName]) => `const ${fnName} = () => {};`).join('\n');
  const props = [...lines, ...handlers.map(([prop, fnName]) => `${prop}={() => ${fnName}()}`)];
  return `${declarations}\n\n<FileUploadItem\n${props.map((l) => `  ${l}`).join('\n')}\n/>`;
}

const meta = {
  title: 'Data Display/FileUploadItem',
  component: FileUploadItem,
  parameters: {
    layout: 'padded',
    docs: componentDocsParameters(doc, docsJson),
    // Lo que dibuja `Interactive` con sus tres acciones; el código copiable lo escribe `docsCode`
    docsLive: { story: 'Interactive', code: docsCode },
  },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    icon: { control: 'select', options: ICONS, type: { name: 'enum', value: [...ICONS] } },
    status: {
      control: 'select',
      options: STATUSES,
      type: { name: 'enum', value: STATUSES },
    },
    title: { control: 'text', type: { name: 'string' } },
    message: { control: 'text', type: { name: 'string' } },
    deleteLabel: { control: 'text', type: { name: 'string' } },
    downloadLabel: { control: 'text', type: { name: 'string' } },
    retryLabel: { control: 'text', type: { name: 'string' } },
    progress: { control: { type: 'range', min: 0, max: 100 }, type: { name: 'number' } },
  }),
  args: { title: 'Informe.pdf', status: 'loading', progress: 40 },
  decorators: [
    (Story) => (
      <div className="w-[320px] bg-ds-background-general-black p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUploadItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args: FileUploadItemProps) => <FileUploadItem {...args} onDelete={fn()} onDownload={fn()} onRetry={fn()} />,
};

// Figma: 11557:17694
/** Set de Figma: cada variante una vez, con los textos de Figma (ancho 287.6). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [],
  render: () => (
    <div className="flex max-w-full flex-wrap items-start gap-6 bg-ds-background-general-black p-6">
      {STATUSES.map((s) => (
        <div key={s} className="flex w-[230.2px] shrink-0 flex-col gap-2">
          <span className="text-xs text-ds-text-neutral-body">{FIGMA[s].figma}</span>
          <FileUploadItem
            status={s}
            title="Nombre del archivo "
            message={FIGMA[s].message}
            progress={25}
            onDelete={() => {}}
            onDownload={() => {}}
            onRetry={() => {}}
            data-figma={FIGMA[s].figma}
          />
        </div>
      ))}
    </div>
  ),
};

function UploadDemo() {
  const [progress, setProgress] = useState(0);
  const done = progress >= 100;
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + 10)), 400);
    return () => clearTimeout(t);
  }, [progress, done]);
  return (
    <div className="flex flex-col gap-4">
      <FileUploadItem
        title="Planos del proyecto.zip"
        status={done ? 'complete' : 'loading'}
        progress={progress}
        onDownload={() => {}}
        onDelete={() => setProgress(0)}
      />
      <FileUploadItem title="Fotos de obra.zip" status="loading-error" onRetry={() => {}} onDelete={() => {}} />
      <FileUploadItem title="Presupuesto.xlsx" status="alert" message="Faltan hojas" progress={70} onRetry={() => {}} onDelete={() => {}} />
    </div>
  );
}

/** Carga simulada: el estado cambia de Cargando a Carga completa y se anuncia (aria-live). */
export const Uploading: Story = {
  render: () => <UploadDemo />,
};

// ─────────────────────── tests ───────────────────────

export const TestAccessibility: Story = {
  tags: ['!autodocs'],
  args: { onDelete: fn(), onRetry: fn() },
  render: (args: FileUploadItemProps) => (
    <div className="flex flex-col gap-4">
      <FileUploadItem title="Contrato.pdf" progress={25} onDelete={args.onDelete} />
      <FileUploadItem title="Anexo.pdf" status="loading-error" onRetry={args.onRetry} onDelete={args.onDelete} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const bar = c.getByRole('progressbar', { name: 'Contrato.pdf' });
    await expect(bar).toHaveAttribute('aria-valuenow', '25');
    await expect(c.getByText('Error de carga')).toHaveAttribute('aria-live', 'polite');
    // Cada acción se nombra con el archivo (no "Eliminar, Eliminar…" en una lista)
    const retry = c.getByRole('button', { name: 'Reintentar Anexo.pdf' });
    await expect(retry).not.toHaveAttribute('aria-describedby');
    await userEvent.click(retry);
    await expect(args.onRetry).toHaveBeenCalledTimes(1);
    await expect(c.getByRole('button', { name: 'Eliminar Anexo.pdf' })).toBeInTheDocument();
    await userEvent.click(c.getByRole('button', { name: 'Eliminar Contrato.pdf' }));
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
    // Sin barra fuera de loading y alert
    await expect(c.getAllByRole('progressbar')).toHaveLength(1);
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [],
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'FileUploadItem' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente FileUploadItem en Figma:']);
    // Marcadores de la anatomía: uno por pauta (6 + 4 + 4)
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(14));
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de FileUploadItem' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
