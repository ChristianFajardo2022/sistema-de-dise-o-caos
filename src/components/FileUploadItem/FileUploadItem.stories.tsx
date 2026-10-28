import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
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

const meta = {
  title: 'Data Display/FileUploadItem',
  component: FileUploadItem,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: STATUSES,
      type: { name: 'enum', value: STATUSES },
      description: 'State de Figma',
    },
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Tittle de Figma' },
    message: { control: 'text', type: { name: 'string' }, description: 'Props Alert / Error state / Loading error' },
    progress: { control: { type: 'range', min: 0, max: 100 }, type: { name: 'number' } },
  },
  args: { title: 'Informe trimestral.pdf', status: 'loading', progress: 40 },
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

/** Set 11557:17694: cada variante una vez, con los textos de Figma (ancho 287.6). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [],
  render: () => (
    <div className="flex w-fit items-start gap-6 bg-ds-background-general-black p-6">
      {STATUSES.map((s) => (
        <div key={s} className="flex w-[230.2px] flex-col gap-2">
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
