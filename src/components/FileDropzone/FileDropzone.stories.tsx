import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { FileDropzone } from './FileDropzone';
import type { FileDropzoneProps, FileDropzoneState } from './FileDropzone.types';

const STATES: Exclude<FileDropzoneState, 'static'>[] = ['default', 'hover', 'disabled', 'focus'];

/** Nombre de cada variante de Figma (set 11438:5774), en el orden del set. */
const FIGMA: Record<Exclude<FileDropzoneState, 'static'>, string> = {
  default: 'State=Default',
  hover: 'State=Hover',
  disabled: 'State=Disabled',
  focus: 'State=Focus',
};

const meta = {
  title: 'Form Controls/FileDropzone',
  component: FileDropzone,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: [undefined, ...STATES],
      type: { name: 'enum', value: STATES },
      description: 'State de Figma forzado (solo documentación)',
    },
    accept: { control: 'text', type: { name: 'string' }, description: 'Tipos admitidos (sintaxis de `accept`)' },
    maxSize: { control: 'number', type: { name: 'number' }, description: 'Tamaño máximo por archivo, en bytes' },
    multiple: { control: 'boolean', type: { name: 'boolean' } },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
    title: { control: 'text', type: { name: 'string' }, description: 'Capa Heading de Figma' },
    actionText: { control: 'text', type: { name: 'string' }, description: 'Segunda capa Heading de Figma' },
  },
  args: { accept: '.pdf,.jpg,.jpeg', maxSize: 25 * 1024 ** 2, multiple: false, disabled: false },
  decorators: [
    (Story) => (
      <div className="w-[400px] bg-ds-background-general-black p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo(args: FileDropzoneProps) {
  const [names, setNames] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-4">
      <FileDropzone {...args} onFilesSelected={(files) => setNames(files.map((f) => f.name))} />
      <p aria-live="polite" className="m-0 text-sm text-ds-text-neutral-body">
        {names.length ? `Seleccionado: ${names.join(', ')}` : 'Ningún archivo seleccionado'}
      </p>
    </div>
  );
}

export const Interactive: Story = {
  render: (args: FileDropzoneProps) => <Demo {...args} />,
};

/** Set 11438:5774: cada estado una vez, con los textos de Figma (ancho 304). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [],
  render: () => (
    <div className="flex w-fit items-start gap-6 bg-ds-background-general-black p-6">
      {STATES.map((s) => (
        <div key={s} className="flex w-[304px] flex-col gap-2">
          <span className="text-xs text-ds-text-neutral-body">{FIGMA[s]}</span>
          <FileDropzone
            state={s}
            specifications="PDF, JPG. "
            maxSizeLabel="Máx. 23 GB"
            rootProps={{ 'data-figma': FIGMA[s] }}
          />
        </div>
      ))}
    </div>
  ),
};

/** Sin límites declarados no se muestran los tipos ni el tamaño máximo. */
export const Minimal: Story = {
  args: { accept: undefined, maxSize: undefined },
};

/** Varios archivos y solo imágenes de hasta 5 MB. */
export const MultipleImages: Story = {
  args: { accept: 'image/*', maxSize: 5 * 1024 ** 2, multiple: true, title: 'Arrastra tus imágenes o', actionText: 'elígelas' },
  render: (args: FileDropzoneProps) => <Demo {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true },
};

// ─────────────────────── tests ───────────────────────

const pdf = (name = 'informe.pdf', size = 10) => new File([new Uint8Array(size)], name, { type: 'application/pdf' });

export const TestAccessibility: Story = {
  tags: ['!autodocs'],
  args: { onFilesSelected: fn(), onFilesRejected: fn() },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    // Input de archivo real, con nombre y descripción
    const input = c.getByLabelText('Selecciona tu archivo');
    await expect(input).toHaveAttribute('type', 'file');
    await expect(input).toHaveAccessibleDescription(/PDF, JPG, JPEG\.\s*Máx\. 25 MB/);
    // El teclado lo alcanza y el foco se ve en la raíz
    await userEvent.tab();
    await expect(input).toHaveFocus();
    const label = canvasElement.querySelector('label')!;
    await expect(label).toHaveClass('has-[input:focus-visible]:text-ds-border-field-active');
    // Indicador propio: outline de 2 px
    await expect(getComputedStyle(label).outlineStyle).toBe('solid');
    await expect(getComputedStyle(label).outlineWidth).toBe('2px');
    // Sin estilos de trazo falsos: el SVG es decorativo
    await expect(canvasElement.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};

export const TestRepeatedRejection: Story = {
  tags: ['!autodocs'],
  args: { accept: '.pdf', onFilesSelected: fn(), onFilesRejected: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const input = c.getByLabelText('Selecciona tu archivo');
    const status = c.getByRole('status');
    const bad = () => new File(['x'], 'a.exe', { type: 'application/x-msdownload' });
    const texts: string[] = [];
    const observer = new MutationObserver(() => texts.push(status.textContent ?? ''));
    observer.observe(status, { childList: true, characterData: true, subtree: true });
    await userEvent.upload(input, bad(), { applyAccept: false });
    await waitFor(() => expect(status).not.toHaveTextContent(/^$/));
    await userEvent.upload(input, bad(), { applyAccept: false });
    await waitFor(() => expect(args.onFilesRejected).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(texts.filter((t) => t !== '')).toHaveLength(2));
    observer.disconnect();
    // La región se vació entre los dos anuncios iguales
    await expect(texts).toContain('');
  },
};

export const TestSelect: Story = {
  tags: ['!autodocs'],
  args: { onFilesSelected: fn(), onFilesRejected: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const input = c.getByLabelText('Selecciona tu archivo');
    await userEvent.upload(input, pdf('a.pdf'));
    await expect(args.onFilesSelected).toHaveBeenCalledTimes(1);
    await expect((args.onFilesSelected as ReturnType<typeof fn>).mock.calls[0][0][0].name).toBe('a.pdf');
    await expect(args.onFilesRejected).not.toHaveBeenCalled();
  },
};

export const TestRejections: Story = {
  tags: ['!autodocs'],
  args: { onFilesSelected: fn(), onFilesRejected: fn(), maxSize: 100, accept: '.pdf', multiple: true },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const input = c.getByLabelText('Selecciona tu archivo');
    const big = pdf('grande.pdf', 500);
    const txt = new File(['x'], 'nota.txt', { type: 'text/plain' });
    // `applyAccept: false` simula soltar archivos: el diálogo nativo ya filtraría por tipo
    await userEvent.setup({ applyAccept: false }).upload(input, [pdf('ok.pdf'), big, txt]);
    await expect(args.onFilesSelected).toHaveBeenCalledTimes(1);
    const rejected = (args.onFilesRejected as ReturnType<typeof fn>).mock.calls[0][0];
    await expect(rejected.map((r: { reason: string }) => r.reason)).toEqual(['size', 'type']);
    await waitFor(() => expect(c.getByRole('status')).toHaveTextContent('2 archivos no se agregaron'));
  },
};

export const TestDrop: Story = {
  tags: ['!autodocs'],
  args: { onFilesSelected: fn(), onFilesRejected: fn(), multiple: false },
  play: async ({ canvasElement, args }) => {
    const label = canvasElement.querySelector('label') as HTMLLabelElement;
    const data = new DataTransfer();
    data.items.add(pdf('uno.pdf'));
    data.items.add(pdf('dos.pdf'));
    label.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: data }));
    await waitFor(() => expect(label).toHaveAttribute('data-dragging', 'true'));
    label.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: data }));
    await waitFor(() => expect(label).not.toHaveAttribute('data-dragging'));
    // Sin `multiple` solo entra el primero
    await expect(args.onFilesSelected).toHaveBeenCalledTimes(1);
    const rejected = (args.onFilesRejected as ReturnType<typeof fn>).mock.calls[0][0];
    await expect(rejected[0].reason).toBe('count');
  },
};

export const TestDisabled: Story = {
  tags: ['!autodocs'],
  args: { disabled: true, onFilesSelected: fn() },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    await expect(c.getByLabelText('Selecciona tu archivo')).toBeDisabled();
    const label = canvasElement.querySelector('label') as HTMLLabelElement;
    const data = new DataTransfer();
    data.items.add(pdf());
    label.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: data }));
    await expect(args.onFilesSelected).not.toHaveBeenCalled();
  },
};
