import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Alert } from './Alert';
import type { AlertType } from './Alert.types';

const TYPE_OPTIONS: AlertType[] = ['success', 'alert', 'error', 'info'];

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  // El Alert ocupa el ancho de su contenedor; aquí se muestra al ancho de Figma (344)
  decorators: [(Story, { parameters }) => (parameters.sinMarco ? <Story /> : <div className="w-86 max-w-full"><Story /></div>)],
  argTypes: {
    type: {
      name: 'type',
      control: 'radio',
      options: TYPE_OPTIONS,
      type: { name: 'enum', value: TYPE_OPTIONS },
      description: 'Type de Figma: success, alert, error o info',
    },
    background: { control: 'boolean', type: { name: 'boolean' }, description: 'Background de Figma: contorno y padding' },
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Tittle de Figma' },
    children: { control: 'text', type: { name: 'string' }, description: 'Prop Description de Figma' },
    role: {
      control: 'radio',
      options: ['status', 'alert'],
      type: { name: 'enum', value: ['status', 'alert'] },
      description: 'status (por defecto) o alert para errores dinámicos urgentes',
    },
    label: { control: 'text', type: { name: 'string' }, description: 'Texto sr-only del tipo' },
  },
  args: {
    type: 'success',
    background: true,
    title: 'Cambios guardados',
    children: 'Tu perfil se actualizó correctamente.',
    role: 'status',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

/** Error que aparece tras enviar un formulario: role="alert" interrumpe al lector. */
export const DynamicError: Story = {
  args: { type: 'error', title: 'No se pudo enviar', children: 'Revisa los campos marcados e inténtalo de nuevo.', role: 'alert' },
};

const TYPES: { type: AlertType; figma: string }[] = [
  { type: 'success', figma: 'Success' },
  { type: 'alert', figma: 'Alert' },
  { type: 'error', figma: 'Error' },
  { type: 'info', figma: 'Info' },
];

/** Las 8 variantes de Figma (Type × Background), con título y descripción visibles. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded', sinMarco: true },
  render: () => (
    <div className="flex flex-col gap-4 bg-ds-background-general-black p-6">
      {TYPES.map((t) => (
        <div key={t.type} className="flex items-start gap-x-8">
          <span className="w-16 shrink-0 text-xs text-ds-text-neutral-body">{t.type}</span>
          {/* Con fondo y sin fondo en la misma columna: si no caben lado a lado, la segunda baja alineada con la primera */}
          <div className="flex min-w-0 flex-1 flex-wrap items-start gap-x-8 gap-y-4">
            {[true, false].map((bg) => (
              <Alert
                key={String(bg)}
                type={t.type}
                background={bg}
                className="w-86 max-w-full shrink-0"
                title="Subheading"
                data-figma={`Type=${t.figma}, Background=${bg ? 'True' : 'False'}`}
              >
                Description
              </Alert>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Título y descripción opcionales (los booleanos Tittle y Description de Figma se resuelven por presencia: sin `title` o sin `children` no se dibuja). */
export const Partial: Story = {
  render: () => (
    <div className="flex w-86 max-w-full flex-col gap-4">
      <Alert type="info" title="Solo título" />
      <Alert type="alert">Solo descripción</Alert>
    </div>
  ),
};

/** Test: rol por defecto, rol alert, nombre accesible con el tipo */
export const RoleTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <Alert type="success" title="Listo" data-testid="a-status">Guardado</Alert>
      <Alert type="error" role="alert" title="Fallo" data-testid="a-alert">Sin conexión</Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('a-status')).toHaveAttribute('role', 'status');
    await expect(canvas.getByTestId('a-status')).toHaveTextContent('Éxito: ListoGuardado');
    await expect(canvas.getByTestId('a-alert')).toHaveAttribute('role', 'alert');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Error: FalloSin conexión');
  },
};
