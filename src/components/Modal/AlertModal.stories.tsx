import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { AlertModal, AlertModalPanel } from './AlertModal';
import type { AlertModalProps, AlertModalType } from './Modal.types';
import { Button } from '../Button';

const TYPE_OPTIONS: AlertModalType[] = ['info', 'error', 'alert', 'success'];
const SURFACE = 'bg-ds-background-general-black';
const LABEL = 'font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm text-ds-text-neutral-gray';

const LOREM_1 = 'Lorem ipsum dolor sit amet consectetur. Adipiscing egestas pellentesque faucibus lectus.';
const LOREM_2 =
  'Lorem ipsum dolor sit amet consectetur. Adipiscing egestas pellentesque faucibus lectus purus viverra curabitur risus metus. Sit ut donec cras viverra massa purus in egestas. ';

type DemoArgs = AlertModalProps & { withSecondary?: boolean; withTertiary?: boolean };

const meta = {
  title: 'Overlays/AlertModal',
  component: AlertModal,
  subcomponents: { AlertModalPanel },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: TYPE_OPTIONS, type: { name: 'enum', value: TYPE_OPTIONS }, description: 'Type de Figma' },
    title: { control: 'text', type: { name: 'string' }, description: 'Text heading de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: '↪ Text description1 de Figma (semibold)' },
    children: { control: 'text', type: { name: 'string' }, description: '↪ Text descriptio2 de Figma (regular)' },
    closable: { control: 'boolean', type: { name: 'boolean' }, description: 'Icon close de Figma' },
    closeOnBackdrop: { control: 'boolean', type: { name: 'boolean' } },
    withSecondary: { control: 'boolean', type: { name: 'boolean' }, description: 'Btn secondary de Figma (solo en la historia)' },
    withTertiary: { control: 'boolean', type: { name: 'boolean' }, description: 'Btn tertiary de Figma (solo en la historia)' },
  },
  args: {
    type: 'alert',
    title: '¿Eliminar el documento?',
    description: 'El documento se borrará de la carpeta compartida.',
    children: 'Las personas con acceso dejarán de verlo. Puedes recuperarlo desde la papelera durante 30 días.',
    closable: true,
    closeOnBackdrop: true,
    withSecondary: true,
    withTertiary: true,
  },
} satisfies Meta<DemoArgs>;

export default meta;
type Story = StoryObj<DemoArgs>;

/** Botón que abre el modal y el modal con estado propio (no controlado desde fuera). */
function Demo({ withSecondary, withTertiary, ...args }: DemoArgs) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Abrir aviso
      </Button>
      <AlertModal
        {...args}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          args.onOpenChange?.(next);
        }}
        primaryAction={{ label: 'Eliminar', onClick: args.primaryAction?.onClick }}
        secondaryAction={withSecondary ? { label: 'Cancelar', onClick: args.secondaryAction?.onClick } : undefined}
        tertiaryAction={withTertiary ? { label: 'Ver detalles', onClick: args.tertiaryAction?.onClick } : undefined}
      />
    </>
  );
}

/** Preview con controles: el botón abre el modal. */
export const Interactive: Story = {
  render: (args) => <Demo {...args} />,
};

/** Un aviso por tipo, cada uno con su ícono y color semánticos. */
export const Types: Story = {
  render: () => {
    const items: { type: AlertModalType; label: string; title: string; text: string }[] = [
      { type: 'success', label: 'Éxito', title: 'Cambios guardados', text: 'Tus cambios ya están disponibles para el equipo.' },
      { type: 'info', label: 'Información', title: 'Nueva versión', text: 'Hay una versión nueva del documento.' },
      { type: 'alert', label: 'Alerta', title: 'Espacio casi lleno', text: 'Te queda menos del 10 % del espacio.' },
      { type: 'error', label: 'Error', title: 'No se pudo guardar', text: 'Revisa tu conexión e inténtalo de nuevo.' },
    ];
    return (
      <div className="flex flex-wrap gap-ds-space-general-lg">
        {items.map((item) => (
          <TypeDemo key={item.type} {...item} />
        ))}
      </div>
    );
  },
};

function TypeDemo({ type, label, title, text }: { type: AlertModalType; label: string; title: string; text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <AlertModal type={type} title={title} open={open} onOpenChange={setOpen} primaryAction={{ label: 'Entendido' }}>
        {text}
      </AlertModal>
    </>
  );
}

const FIGMA_VARIANTS: { name: string; type: AlertModalType }[] = [
  { name: 'Type=Info', type: 'info' },
  { name: 'Type=Error', type: 'error' },
  { name: 'Type=Alert', type: 'alert' },
  { name: 'Type=Success', type: 'success' },
];

/** Las cuatro variantes del set de Figma (superficie suelta, sin diálogo). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className={`flex w-fit flex-col gap-10 p-6 ${SURFACE}`}>
      {FIGMA_VARIANTS.map(({ name, type }) => (
        <div key={name} className="flex flex-col gap-ds-space-general-lg">
          <span className={LABEL}>{name}</span>
          <AlertModalPanel
            data-figma={name}
            type={type}
            title="Heading"
            description={<span data-figma-part={LOREM_1}>{LOREM_1}</span>}
            primaryAction={{ label: 'Button' }}
            secondaryAction={{ label: 'Button' }}
            tertiaryAction={{ label: 'Button' }}
            onClose={() => {}}
          >
            <span data-figma-part={LOREM_2.trim()}>{LOREM_2}</span>
          </AlertModalPanel>
        </div>
      ))}
    </div>
  ),
};

/** Test: rol y nombre, foco inicial en la acción menos destructiva, Tab atrapado, Escape y retorno del foco. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { onOpenChange: fn() },
  render: (args) => <Demo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Abrir aviso' });
    await userEvent.click(trigger);

    const dialog = await canvas.findByRole('alertdialog', { name: '¿Eliminar el documento?' });
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await expect(dialog).toHaveAccessibleDescription(/El documento se borrará/);
    const modal = within(dialog);
    // Foco inicial: Secondary (la acción menos destructiva)
    await expect(modal.getByRole('button', { name: 'Cancelar' })).toHaveFocus();

    // Tab sigue el orden del pie (Tertiary, Secondary, Primary); el resto de la página es inerte (showModal)
    await userEvent.tab();
    await expect(modal.getByRole('button', { name: 'Eliminar' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await userEvent.tab({ shift: true });
    await expect(modal.getByRole('button', { name: 'Ver detalles' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveFocus();
  },
};

/** Test: una acción llama a su `onClick` y cierra; con `preventDefault` el modal sigue abierto; el cerrar cierra. */
export const ActionsTest: Story = {
  tags: ['!autodocs'],
  render: () => <ActionsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Abrir' });

    await userEvent.click(trigger);
    const dialog = await canvas.findByRole('alertdialog', { name: 'Confirmar envío' });
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    const modal = within(dialog);

    // Primary con preventDefault: no cierra
    await userEvent.click(modal.getByRole('button', { name: 'Enviar' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Enviar: 1');
    await expect(dialog).toHaveAttribute('open');

    // Secondary: cierra
    await userEvent.click(modal.getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    await expect(trigger).toHaveFocus();

    // Botón cerrar (Button corner)
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await userEvent.click(modal.getByRole('button', { name: 'Cerrar' }));
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
  },
};

function ActionsDemo() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir</Button>
      <p role="status" className={LABEL}>
        Enviar: {count}
      </p>
      <AlertModal
        type="info"
        title="Confirmar envío"
        open={open}
        onOpenChange={setOpen}
        primaryAction={{
          label: 'Enviar',
          onClick: (event) => {
            event.preventDefault();
            setCount((n) => n + 1);
          },
        }}
        secondaryAction={{ label: 'Cancelar' }}
      >
        Se enviará una copia a cada participante.
      </AlertModal>
    </>
  );
}
