import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { FileUploadSimple } from './FileUploadSimple';
import type { FileUploadSimpleProps, FileUploadSimpleState, FileUploadSimpleStatus } from './FileUploadSimple.types';

const meta = {
  title: 'Form Controls/FileUploadSimple',
  component: FileUploadSimple,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'inline-radio', options: ['idle', 'uploading', 'loaded', 'error'], type: { name: 'enum', value: ['idle', 'uploading', 'loaded', 'error'] } },
    state: { control: 'inline-radio', options: ['default', 'hover', 'focus', 'disabled'], type: { name: 'enum', value: ['default', 'hover', 'focus', 'disabled'] } },
    progress: { control: { type: 'range', min: 0, max: 100 }, type: { name: 'number' } },
    accept: { control: 'text', type: { name: 'string' } },
    maxSize: { control: 'number', type: { name: 'number' }, description: 'Bytes' },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
  },
  args: { accept: '.pdf,.jpg', maxSize: 23 * 1024 ** 3 },
  decorators: [
    (Story, { parameters }) =>
      parameters.sinMarco ? (
        <Story />
      ) : (
        <div className="w-[352px] bg-ds-background-general-black p-6">
          <Story />
        </div>
      ),
  ],
} satisfies Meta<typeof FileUploadSimple>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Carga simulada: el archivo elegido avanza solo hasta completarse. Quien use el componente hace la carga real. */
function SimulatedUpload(args: FileUploadSimpleProps) {
  const [status, setStatus] = useState<FileUploadSimpleStatus>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status !== 'uploading') return;
    const t = setTimeout(() => {
      if (progress >= 100) setStatus('loaded');
      else setProgress((p) => Math.min(100, p + 20));
    }, 400);
    return () => clearTimeout(t);
  }, [status, progress]);

  return (
    <FileUploadSimple
      {...args}
      status={status}
      progress={progress}
      alert={status === 'loaded' ? { type: 'success', title: 'Carga completa', children: 'El archivo está listo.' } : null}
      onFileChange={(file) => {
        setProgress(0);
        setStatus(file ? 'uploading' : 'idle');
      }}
      onRemove={() => {
        setProgress(0);
        setStatus('idle');
      }}
    />
  );
}

export const Interactive: Story = {
  render: (args: FileUploadSimpleProps) => <SimulatedUpload {...args} />,
};

const sample = { name: 'Nombre archivo', size: 100 * 1024 };

/** Sin `status`: elegir un archivo pasa a cargado y eliminar vuelve al inicio. */
export const Uncontrolled: Story = {};

export const Uploading: Story = { args: { status: 'uploading', progress: 25, defaultFile: sample } };
export const Loaded: Story = { args: { defaultFile: sample } };
export const WithAlert: Story = {
  args: { status: 'error', alert: { type: 'error', title: 'No se pudo cargar', children: 'Intenta de nuevo con otro archivo.' } },
};
export const Disabled: Story = { args: { disabled: true } };

const bare = { accept: 'application/pdf,image/jpeg', maxSize: 23 * 1024 ** 3, formatsText: 'PDF, JPG', sizeText: 'Máx. 23 GB' } as const;

const cell = (name: string, props: FileUploadSimpleProps) => (
  <div key={name} className="flex w-full max-w-[304px] flex-col gap-2">
    <span className="text-xs text-ds-text-neutral-body">{name}</span>
    <FileUploadSimple {...bare} {...props} data-figma={name} />
  </div>
);

// Figma: 21407:3920
/** Set de Figma (simple-2): Type Default/Uploading × State Default/Loaded. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen', sinMarco: true },
  render: () => (
    <div className="grid w-full max-w-[680px] grid-cols-[repeat(auto-fill,minmax(min(100%,304px),304px))] items-start gap-6 bg-ds-background-general-black p-6">
      {cell('Type=Default, State=Default', { status: 'idle' })}
      {cell('Type=Uploading, State=Loaded', { status: 'uploading', progress: 25, file: sample })}
      {cell('Type=Default, State=Loaded', { status: 'loaded', file: sample })}
      {cell('Type=Uploading, State=Default', { status: 'uploading', progress: 25 })}
    </div>
  ),
};

const interaction: [string, FileUploadSimpleState][] = [
  ['Default', 'default'],
  ['Hover', 'hover'],
  ['Focus', 'focus'],
  ['Inactive', 'disabled'],
];

// Figma: 21412:4523
/** Set de Figma (simple): Default, Hover, Focus, Upload e Inactive × Default y Loaded. */
export const FigmaMatrixInteraction: Story = {
  parameters: { layout: 'fullscreen', sinMarco: true },
  render: () => (
    <div className="grid w-full max-w-[680px] grid-cols-[repeat(auto-fill,minmax(min(100%,304px),304px))] items-start gap-6 bg-ds-background-general-black p-6">
      {interaction.flatMap(([type, state]) => [
        cell(`Type=${type}, State=Default`, { status: 'idle', state }),
        cell(`Type=${type}, State=Loaded`, { status: 'loaded', file: sample, state }),
      ])}
      {cell('Type=Upload, State=Default', { status: 'uploading', progress: 25 })}
      {cell('Type=Upload, State=Loaded', { status: 'uploading', progress: 25, file: sample })}
    </div>
  ),
};

// ─────────────────────── tests ───────────────────────

const pdf = () => new File(['x'.repeat(2048)], 'informe.pdf', { type: 'application/pdf' });

export const TestSelectAndReplace: Story = {
  tags: ['!autodocs'],
  args: { accept: '.pdf', onFileChange: fn(), onReplace: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await userEvent.upload(c.getByLabelText('Selecciona tu archivo'), pdf());
    await expect(args.onFileChange).toHaveBeenCalledTimes(1);
    await expect(c.getByText('informe.pdf')).toBeVisible();
    await expect(c.getByText('2 KB')).toBeVisible();
    const replace = c.getByRole('button', { name: 'volver a cargar' });
    await expect(replace).toHaveAccessibleDescription('informe.pdf');
    // El foco pasa al botón que sustituye al input que desapareció
    await expect(replace).toHaveFocus();
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
    await userEvent.upload(input, new File(['y'], 'nuevo.pdf', { type: 'application/pdf' }));
    await expect(args.onReplace).toHaveBeenCalledTimes(1);
    await expect(c.getByText('nuevo.pdf')).toBeVisible();
  },
};

export const TestRejectsType: Story = {
  tags: ['!autodocs'],
  args: { accept: '.pdf', onFileChange: fn(), onFilesRejected: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const input = c.getByLabelText('Selecciona tu archivo');
    // applyAccept false: simula soltar un archivo que el diálogo nativo no habría dejado elegir
    await userEvent.upload(input, new File(['x'], 'foto.png', { type: 'image/png' }), { applyAccept: false });
    await expect(args.onFilesRejected).toHaveBeenCalledTimes(1);
    await expect(args.onFileChange).not.toHaveBeenCalled();
    await waitFor(() => expect(c.getByRole('status')).toHaveTextContent(/no se agreg/i));
  },
};

export const TestUploadingA11y: Story = {
  tags: ['!autodocs'],
  args: { status: 'uploading', progress: 40, file: sample, onRemove: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const bar = c.getByRole('progressbar', { name: 'Carga de Nombre archivo' });
    await expect(bar).toHaveAttribute('aria-valuenow', '40');
    await userEvent.click(c.getByRole('button', { name: 'Eliminar Nombre archivo' }));
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
  },
};

function FinishUpload(args: FileUploadSimpleProps) {
  const [status, setStatus] = useState<FileUploadSimpleStatus>('uploading');
  return (
    <>
      <button type="button" onClick={() => setStatus('loaded')}>
        Terminar
      </button>
      <FileUploadSimple {...args} status={status} progress={90} file={sample} />
    </>
  );
}

export const TestStatusAnnouncements: Story = {
  tags: ['!autodocs'],
  render: (args: FileUploadSimpleProps) => <FinishUpload {...args} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Terminar' }));
    await waitFor(() => expect(c.getByRole('status')).toHaveTextContent('Carga completa: Nombre archivo'));
  },
};

export const TestDisabled: Story = {
  tags: ['!autodocs'],
  args: { disabled: true, onFileChange: fn() },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText('Selecciona tu archivo')).toBeDisabled();
  },
};
