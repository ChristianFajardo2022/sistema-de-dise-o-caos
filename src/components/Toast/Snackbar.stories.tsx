import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Snackbar } from './Snackbar';
import type { ToastType } from './Toast.types';

const TYPE_OPTIONS: ToastType[] = ['success', 'alert', 'error', 'info'];

const meta = {
  title: 'Feedback/Snackbar',
  component: Snackbar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: { name: 'type', control: 'radio', options: TYPE_OPTIONS, type: { name: 'enum', value: TYPE_OPTIONS }, description: 'Type de Figma' },
    title: { control: 'text', type: { name: 'string' } },
    description: { control: 'text', type: { name: 'string' } },
    role: { control: 'radio', options: ['status', 'alert'], type: { name: 'enum', value: ['status', 'alert'] } },
    duration: { control: 'number', type: { name: 'number' } },
    closeOnAction: { control: 'boolean', type: { name: 'boolean' } },
  },
  args: {
    type: 'info',
    title: 'Elemento archivado',
    description: 'Puedes deshacerlo durante unos segundos.',
    action: { label: 'Deshacer', onClick: fn() },
    secondaryAction: { label: 'Ver archivo', onClick: fn() },
    onClose: fn(),
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

const TYPES: { type: ToastType; figma: string }[] = [
  { type: 'success', figma: 'Success' },
  { type: 'alert', figma: 'Alert' },
  { type: 'error', figma: 'Error' },
  { type: 'info', figma: 'Info' },
];

/** Las 4 variantes de Figma (Type), con las dos acciones. Unicolor: no cambian con el tema. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-start gap-6 bg-ds-background-general-black p-6">
      {TYPES.map((t) => (
        <Snackbar
          key={t.type}
          type={t.type}
          title="Subheading"
          description="Description"
          action={{ label: 'Button' }}
          secondaryAction={{ label: 'Button' }}
          data-figma={`Type=${t.figma}`}
        />
      ))}
    </div>
  ),
};

/** Sin segunda acción (Button 2=false) ni descripción. */
export const Partial: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Snackbar type="success" title="Enviado" action={{ label: 'Deshacer' }} />
      <Snackbar type="alert" title="Solo texto" description="Sin acciones." />
    </div>
  ),
};

/** Test: rol, acciones por teclado, cierre tras la acción y Escape */
export const A11yTest: Story = {
  tags: ['!autodocs'],
  args: { type: 'error', title: 'Fallo', description: 'Sin conexión', action: { label: 'Reintentar', onClick: fn() }, secondaryAction: undefined, onClose: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Error: FalloSin conexión');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Reintentar' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect((args.action as { onClick: () => void }).onClick).toHaveBeenCalled();
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledTimes(2);
  },
};
