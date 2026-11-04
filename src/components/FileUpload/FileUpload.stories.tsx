import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { buildCode } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './FileUpload.doc';
import docsJson from './FileUpload.docs.json';
import { FileUpload } from './FileUpload';
import type { FileUploadEntry, FileUploadProps } from './FileUpload.types';

/** Archivos con los que arranca el lienzo de Desarrollo. */
const LIVE_ITEMS: FileUploadEntry[] = [
  { id: 'a', name: 'informe-trimestral.pdf', status: 'complete' },
  { id: 'b', name: 'foto-perfil.png', status: 'loading', progress: 40 },
];

const meta = {
  title: 'Form Controls/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'padded',
    docs: componentDocsParameters(doc, docsJson),
    docsLive: {
      story: 'Interactive',
      // El estado de la lista lo lleva la historia (R6): `items` de Interactive es solo la lista inicial
      // El código generado omite funciones y `items`: con los manejadores el ejemplo funciona al copiarlo
      code: ({ items: _items, ...a }: Record<string, unknown>) =>
        buildCode('FileUpload', a, { listLabel: 'Archivos', multiple: false, disabled: false }).replace(
          '<FileUpload',
          '<FileUpload\n  items={files}\n  onFilesSelected={(selected) => upload(selected)}\n  onRemove={(id) => remove(id)}'
        ),
    },
  },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    accept: { control: 'text', type: { name: 'string' } },
    maxSize: { control: 'number', type: { name: 'number' }, description: 'Bytes por archivo' },
    multiple: { control: 'boolean', type: { name: 'boolean' } },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
    listLabel: { control: 'text', type: { name: 'string' } },
    title: { control: 'text', type: { name: 'string' } },
    actionText: { control: 'text', type: { name: 'string' } },
    specifications: { control: 'text', type: { name: 'string' } },
    maxSizeLabel: { control: 'text', type: { name: 'string' } },
  }),
  args: { accept: '.pdf,.jpg,.png', maxSize: 25 * 1024 ** 2, multiple: true, listLabel: 'Archivos' },
  decorators: [
    (Story, { parameters }) =>
      parameters.sinMarco ? (
        <Story />
      ) : (
        <div className="w-[421px] max-w-full bg-ds-background-general-black p-6">
          <Story />
        </div>
      ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Carga simulada: cada archivo elegido avanza solo hasta completarse. Quien use el componente hace la carga real. */
function SimulatedUpload(args: FileUploadProps) {
  const [items, setItems] = useState<FileUploadEntry[]>(args.items ?? []);
  const counter = useRef(0);

  useEffect(() => {
    if (!items.some((i) => i.status === 'loading')) return;
    const t = setTimeout(
      () =>
        setItems((list) =>
          list.map((i) => {
            if (i.status !== 'loading') return i;
            const progress = Math.min(100, (i.progress ?? 0) + 20);
            return progress >= 100 ? { ...i, progress, status: 'complete' } : { ...i, progress };
          })
        ),
      500
    );
    return () => clearTimeout(t);
  }, [items]);

  return (
    <FileUpload
      {...args}
      items={items}
      onFilesSelected={(files) =>
        setItems((list) => [
          ...list,
          ...files.map((f) => ({ id: `f${(counter.current += 1)}`, name: f.name, status: 'loading' as const, progress: 0 })),
        ])
      }
      onRemove={(id) => setItems((list) => list.filter((i) => i.id !== id))}
      onDownload={() => {}}
    />
  );
}

export const Interactive: Story = {
  args: { items: LIVE_ITEMS },
  render: (args: FileUploadProps) => <SimulatedUpload {...args} />,
};

// Figma: 11592:8647
/** Set de Figma: una variante, con los textos de Figma (ancho 421). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen', sinMarco: true },
  render: () => (
    <div className="flex w-fit max-w-full items-start gap-6 bg-ds-background-general-black p-6">
      <div className="flex w-[421px] max-w-full flex-col gap-2">
        <span className="text-xs text-ds-text-neutral-body">File upload</span>
        <FileUpload
          specifications="PDF, JPG. "
          maxSizeLabel="Máx. 23 GB"
          items={[{ id: '1', name: 'Nombre del archivo ', status: 'loading', progress: 25, message: 'Estado' }]}
          onRemove={() => {}}
          data-figma="File upload complex"
        />
      </div>
    </div>
  ),
};

/** Todos los estados de la lista a la vez. */
export const States: Story = {
  args: {
    items: [
      { id: '1', name: 'Planos del proyecto.zip', status: 'loading', progress: 40 },
      { id: '2', name: 'Informe trimestral.pdf', status: 'complete' },
      { id: '3', name: 'Fotos de obra.zip', status: 'loading-error' },
      { id: '4', name: 'Presupuesto.xlsx', status: 'alert', message: 'Faltan hojas', progress: 70 },
    ],
    onRemove: fn(),
    onRetry: fn(),
    onDownload: fn(),
  },
};

export const WithoutFiles: Story = {
  args: { items: [] },
};

// ─────────────────────── tests ───────────────────────

export const TestList: Story = {
  tags: ['!autodocs'],
  args: {
    items: [
      { id: 'a', name: 'uno.pdf', status: 'complete' },
      { id: 'b', name: 'dos.pdf', status: 'loading-error' },
    ],
    onRemove: fn(),
    onRetry: fn(),
    onDownload: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const list = c.getByRole('list', { name: 'Archivos' });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    await userEvent.click(c.getByRole('button', { name: 'Descargar uno.pdf' }));
    await expect(args.onDownload).toHaveBeenCalledWith('a');
    await userEvent.click(c.getByRole('button', { name: 'Reintentar dos.pdf' }));
    await expect(args.onRetry).toHaveBeenCalledWith('b');
    // Eliminar devuelve el foco al área para soltar
    await userEvent.click(c.getByRole('button', { name: 'Eliminar uno.pdf' }));
    await expect(args.onRemove).toHaveBeenCalledWith('a');
    await expect(c.getByLabelText('Selecciona tu archivo')).toHaveFocus();
  },
};

export const TestDisabledFocus: Story = {
  tags: ['!autodocs'],
  args: {
    disabled: true,
    items: [
      { id: 'a', name: 'uno.pdf', status: 'complete' },
      { id: 'b', name: 'dos.pdf', status: 'complete' },
    ],
    onRemove: fn(),
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Con el área deshabilitada, eliminar un archivo deja el foco en la lista y no en el documento
    await userEvent.click(c.getByRole('button', { name: 'Eliminar uno.pdf' }));
    await expect(c.getByRole('list', { name: 'Archivos' })).toHaveFocus();
  },
};

export const TestEmptyList: Story = {
  tags: ['!autodocs'],
  args: { items: [] },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.queryByRole('list')).toBeNull();
    await expect(c.getByLabelText('Selecciona tu archivo')).toHaveAttribute('type', 'file');
  },
};

export const TestSelectFiles: Story = {
  tags: ['!autodocs'],
  args: { onFilesSelected: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const file = new File(['x'], 'nuevo.pdf', { type: 'application/pdf' });
    await userEvent.upload(c.getByLabelText('Selecciona tu archivo'), file);
    await expect(args.onFilesSelected).toHaveBeenCalledTimes(1);
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', sinMarco: true },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'FileUpload' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente FileUpload en Figma:']);
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-doc-mark]').length).toBeGreaterThan(0));
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de FileUpload' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
