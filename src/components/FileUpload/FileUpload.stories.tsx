import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FileUpload } from './FileUpload';
import type { FileUploadEntry, FileUploadProps } from './FileUpload.types';

const meta = {
  title: 'Form Controls/FileUpload',
  component: FileUpload,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    accept: { control: 'text', type: { name: 'string' } },
    maxSize: { control: 'number', type: { name: 'number' }, description: 'Bytes por archivo' },
    multiple: { control: 'boolean', type: { name: 'boolean' } },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
  },
  args: { accept: '.pdf,.jpg,.png', maxSize: 25 * 1024 ** 2, multiple: true },
  decorators: [
    (Story, { parameters }) =>
      parameters.sinMarco ? (
        <Story />
      ) : (
        <div className="w-[421px] bg-ds-background-general-black p-6">
          <Story />
        </div>
      ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Carga simulada: cada archivo elegido avanza solo hasta completarse. Quien use el componente hace la carga real. */
function SimulatedUpload(args: FileUploadProps) {
  const [items, setItems] = useState<FileUploadEntry[]>([]);
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
