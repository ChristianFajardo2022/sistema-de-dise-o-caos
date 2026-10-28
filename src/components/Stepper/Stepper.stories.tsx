import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Stepper } from './Stepper';
import { StepperStep } from './StepperStep';
import type { StepperItem, StepperOrientation, StepperStatus } from './Stepper.types';

const meta = {
  title: 'Feedback/Stepper',
  component: Stepper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      type: { name: 'enum', value: ['vertical', 'horizontal'] },
      description: 'Orientation de Figma',
    },
    current: { control: { type: 'number', min: 0, max: 5 }, type: { name: 'number' }, description: 'Índice del paso en curso' },
  },
  args: { orientation: 'vertical', current: 1 },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS: StepperItem[] = [
  { title: 'Datos personales', description: 'Nombre y contacto' },
  { title: 'Dirección', description: 'Lugar de residencia' },
  { title: 'Documentos', description: 'Adjuntar archivos' },
  { title: 'Revisión', description: 'Confirmar la información' },
];

const sizeFor = (o: StepperOrientation | undefined) => (o === 'horizontal' ? 'w-[617px] max-w-full' : 'w-[335px] max-w-full');

export const Interactive: Story = {
  render: (args) => (
    <div className={sizeFor(args.orientation)}>
      <Stepper {...args} aria-label="Progreso del registro" steps={STEPS} />
    </div>
  ),
};

/** Un paso forzado a `error` con `status`; el resto sale de `current`. */
export const WithError: Story = {
  args: { current: 2 },
  render: (args) => (
    <div className={sizeFor(args.orientation)}>
      <Stepper
        {...args}
        aria-label="Progreso del registro"
        steps={STEPS.map((s, i) => (i === 1 ? { ...s, status: 'error' as const } : s))}
      />
    </div>
  ),
};

/** Composición con `StepperStep`. */
export const Composition: Story = {
  render: (args) => (
    <div className={sizeFor(args.orientation)}>
      <Stepper {...args} aria-label="Pasos" current={1}>
        <StepperStep title="Paso 1" description="Primer paso" />
        <StepperStep title="Paso 2" description="Segundo paso" />
        <StepperStep title="Paso 3" description="Tercer paso" />
      </Stepper>
    </div>
  ),
};

function ClickableDemo(args: { orientation?: StepperOrientation; onStepClick?: (i: number) => void }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className={sizeFor(args.orientation)}>
      <Stepper
        orientation={args.orientation}
        aria-label="Pasos navegables"
        current={current}
        steps={STEPS}
        onStepClick={(i) => {
          setCurrent(i);
          args.onStepClick?.(i);
        }}
      />
    </div>
  );
}

/** Pasos navegables: cada uno es un botón con foco visible. */
export const Clickable: Story = {
  args: { onStepClick: fn() },
  render: (args) => <ClickableDemo orientation={args.orientation} onStepClick={args.onStepClick} />,
};

const STATUSES: { figma: string; status: StepperStatus }[] = [
  { figma: 'Incomplete', status: 'incomplete' },
  { figma: 'In progress', status: 'in-progress' },
  { figma: 'Complete', status: 'complete' },
  { figma: 'Error', status: 'error' },
];
const ORIENTATIONS: { figma: string; value: StepperOrientation }[] = [
  { figma: 'Vertical', value: 'vertical' },
  { figma: 'Horizontal', value: 'horizontal' },
];

/** `Stepper` (13965:5884): Vertical (335 de ancho) y Horizontal (617), con cinco pasos: completo, en curso y tres incompletos. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-6 bg-ds-background-general-black p-6">
      {ORIENTATIONS.map((o) => (
        <Stepper
          key={o.value}
          data-figma={`Orientation=${o.figma}`}
          aria-label={`Stepper ${o.figma}`}
          orientation={o.value}
          current={1}
          className={sizeFor(o.value)}
          steps={Array.from({ length: 5 }, () => ({ title: 'Step 1', description: 'Personal info' }))}
        />
      ))}
    </div>
  ),
};

/** `Indicators (Atom)` (13804:20926): 4 estados × 2 orientaciones, un `<li>` por variante. */
export const FigmaMatrixIndicators: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-6 bg-ds-background-general-black p-6">
      {ORIENTATIONS.map((o) => (
        <div key={o.value} className="flex flex-wrap gap-6">
          {STATUSES.map((s) => (
            <ol key={s.status} className="m-0 flex w-[152px] list-none p-0">
              <StepperStep
                orientation={o.value}
                status={s.status}
                title="Step 1"
                description="Personal info"
                data-figma={`Propiedad 1=${s.figma}, Orientation=${o.figma}`}
              />
            </ol>
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Test: lista ordenada, `aria-current` en el paso en curso y estado legible para lector de pantalla */
export const SemanticsTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Stepper
      aria-label="Progreso"
      current={1}
      steps={[{ title: 'Uno' }, { title: 'Dos', status: 'error' }, { title: 'Tres' }, { title: 'Cuatro' }]}
    />
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const items = c.getAllByRole('listitem');
    await expect(c.getByRole('list', { name: 'Progreso' }).tagName).toBe('OL');
    await expect(items).toHaveLength(4);
    await expect(items[1]).toHaveAttribute('aria-current', 'step');
    await expect(items[0]).not.toHaveAttribute('aria-current');
    await expect(items[0]).toHaveTextContent('Completado');
    await expect(items[1]).toHaveTextContent('Con error');
    await expect(items[2]).toHaveTextContent('Pendiente');
  },
};

/** Test: pasos navegables con teclado (Tab, Enter, Espacio) */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { onStepClick: fn() },
  render: (args) => <ClickableDemo orientation={args.orientation} onStepClick={args.onStepClick} />,
  play: async ({ args, canvasElement }) => {
    const c = within(canvasElement);
    const buttons = c.getAllByRole('button');
    await expect(buttons).toHaveLength(4);
    await userEvent.tab();
    await expect(buttons[0]).toHaveFocus();
    await userEvent.tab();
    await expect(buttons[1]).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onStepClick).toHaveBeenCalledWith(1);
    await expect(c.getAllByRole('listitem')[1]).toHaveAttribute('aria-current', 'step');
    await userEvent.tab();
    await userEvent.keyboard(' ');
    await expect(args.onStepClick).toHaveBeenLastCalledWith(2);
    await expect(c.getAllByRole('listitem')[2]).toHaveAttribute('aria-current', 'step');
  },
};
