import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toast } from './Toast';
import { Toaster } from './Toaster';
import type { ToastType } from './Toast.types';
import { Button } from '../Button';

const TYPE_OPTIONS: ToastType[] = ['success', 'alert', 'error', 'info'];

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: { name: 'type', control: 'radio', options: TYPE_OPTIONS, type: { name: 'enum', value: TYPE_OPTIONS }, description: 'Type de Figma' },
    title: { control: 'text', type: { name: 'string' }, description: 'Text subheading de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Text description de Figma (si se omite no se dibuja)' },
    role: { control: 'radio', options: ['status', 'alert'], type: { name: 'enum', value: ['status', 'alert'] }, description: 'Por defecto status en success e info, alert en error y alert' },
    duration: { control: 'number', type: { name: 'number' }, description: 'Cierre automático en ms (pausa con puntero o foco)' },
    closeLabel: { control: 'text', type: { name: 'string' } },
    label: { control: 'text', type: { name: 'string' }, description: 'Texto sr-only del tipo' },
  },
  args: { type: 'success', title: 'Cambios guardados', description: 'Tu perfil se actualizó correctamente.', onClose: fn() },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const onCloseSpy = fn();

export const Interactive: Story = {};

const TYPES: { type: ToastType; figma: string }[] = [
  { type: 'success', figma: 'Success' },
  { type: 'alert', figma: 'Alert' },
  { type: 'error', figma: 'Error' },
  { type: 'info', figma: 'Info' },
];

/** Las 4 variantes de Figma (Type). Son unicolor: no cambian con el tema, por eso se funden con la superficie oscura. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-start gap-6 bg-ds-background-general-black p-6">
      {TYPES.map((t) => (
        <Toast
          key={t.type}
          type={t.type}
          title="Subheading"
          description="Description"
          onClose={() => {}}
          data-figma={`Type=${t.figma}`}
        />
      ))}
    </div>
  ),
};

/** Sin descripción (Description=false de Figma) y sin botón de cierre. */
export const Partial: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toast type="info" title="Solo título" onClose={() => {}} />
      <Toast type="alert" title="Sin botón de cierre" description="Se cierra con duration o desde fuera." />
    </div>
  ),
};

function ToasterDemo() {
  const [items, setItems] = useState<{ id: number; type: ToastType }[]>([]);
  const add = (type: ToastType) => setItems((l) => [...l, { id: Date.now() + l.length, type }]);
  return (
    <div className="relative h-96 w-full bg-ds-background-general-black p-6">
      <div className="flex gap-2">
        <Button variant="secondary" size="xs" onClick={() => add('success')}>Éxito</Button>
        <Button variant="secondary" size="xs" onClick={() => add('error')}>Error</Button>
      </div>
      <Toaster position="absolute" placement="bottom-end">
        {items.map((i) => (
          <Toast
            key={i.id}
            type={i.type}
            title={i.type === 'error' ? 'No se pudo guardar' : 'Guardado'}
            description="Detalle del aviso."
            duration={i.type === 'error' ? undefined : 6000}
            onClose={() => setItems((l) => l.filter((x) => x.id !== i.id))}
          />
        ))}
      </Toaster>
    </div>
  );
}

/** Región que apila avisos: cada uno con su región viva, sin robar el foco. */
export const WithToaster: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <ToasterDemo />,
};

/** Test: roles, nombre del cierre, Escape y cierre por teclado */
export const A11yTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <Toast type="success" title="Listo" data-testid="t-status" onClose={onCloseSpy} />
      <Toast type="error" title="Fallo" description="Sin conexión" data-testid="t-alert" onClose={onCloseSpy} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    onCloseSpy.mockClear();
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('t-status')).toHaveAttribute('role', 'status');
    await expect(canvas.getByTestId('t-alert')).toHaveAttribute('role', 'alert');
    await expect(canvas.getByTestId('t-alert')).toHaveTextContent('Error: FalloSin conexión');
    const closes = canvas.getAllByRole('button', { name: 'Cerrar notificación' });
    await userEvent.tab();
    await expect(closes[0]).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{Escape}');
    await expect(onCloseSpy).toHaveBeenCalledTimes(2);
  },
};
