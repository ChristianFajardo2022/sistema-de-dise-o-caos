import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { buildCode } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { Stepper } from './Stepper';
import { StepperStep } from './StepperStep';
import type { StepperItem, StepperOrientation, StepperStatus } from './Stepper.types';
import { doc } from './Stepper.doc';
import docsJson from './Stepper.docs.json';

// Pasos de ejemplo de la historia que alimenta Personalizar (también se escriben en el código generado)
const STEPS: StepperItem[] = [
  { title: 'Cuenta', description: 'Correo y contraseña' },
  { title: 'Perfil', description: 'Nombre y foto' },
  { title: 'Preferencias', description: 'Idioma y avisos' },
  { title: 'Revisión', description: 'Confirmar los datos' },
];

const ORIENTATION_VALUES = ['vertical', 'horizontal'];

const meta = {
  title: 'Feedback/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // La página Docs usa la plantilla de documentación (Stepper.doc.tsx) con la referencia de código al final
    docs: componentDocsParameters(doc, docsJson),
    // `steps` y `aria-label` no son controles: se agregan a los args para que el código generado muestre los pasos
    docsLive: {
      // Los pasos navegables (botones con foco) son lo que muestra Estados: el lienzo usa la historia `Clickable`
      story: 'Clickable',
      args: (a: Record<string, unknown>) => ({ steps: STEPS, 'aria-label': 'Progreso del registro', ...a }),
      // El código generado omite las funciones: el manejador se escribe a mano, con un nombre genérico
      code: (args: Record<string, unknown>) =>
        buildCode('Stepper', args, { orientation: 'vertical' }).replace('<Stepper', '<Stepper onStepClick={(index) => goTo(index)}'),
    },
  },
  // Las descripciones salen de Stepper.docs.json; aquí solo los controles y los tipos explícitos
  argTypes: argTypesFromDocsJson(docsJson, {
    orientation: {
      control: 'radio',
      options: ORIENTATION_VALUES,
      type: { name: 'enum', value: ORIENTATION_VALUES },
    },
    current: { control: { type: 'number', min: 0, max: 5 }, type: { name: 'number' } },
    children: { control: false },
  }),
  args: { orientation: 'vertical', current: 1 },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const sizeFor = (o: StepperOrientation | undefined) => (o === 'horizontal' ? 'w-[617px] max-w-full' : 'w-[335px] max-w-full');

export const Interactive: Story = {
  render: (args) => (
    <div className={sizeFor(args.orientation)}>
      <Stepper aria-label="Progreso del registro" steps={STEPS} {...args} />
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

function ClickableDemo(args: {
  orientation?: StepperOrientation;
  current?: number;
  label?: string;
  onStepClick?: (i: number) => void;
}) {
  const [current, setCurrent] = useState(args.current ?? 0);
  return (
    <div className={sizeFor(args.orientation)}>
      <Stepper
        orientation={args.orientation}
        aria-label={args.label ?? 'Pasos navegables'}
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
  // `key`: al cambiar el control `current` el lienzo parte de ese paso
  render: (args) => (
    <ClickableDemo
      key={args.current}
      orientation={args.orientation}
      current={args.current}
      label={args['aria-label']}
      onStepClick={args.onStepClick}
    />
  ),
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

// Figma: 13965:5884
/** `Stepper`: Vertical (335 de ancho) y Horizontal (617), con cinco pasos: completo, en curso y tres incompletos. */
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

// Figma: 13804:20926
/** `Indicators (Atom)`: 4 estados × 2 orientaciones, un `<li>` por variante. */
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

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Stepper' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Stepper en Figma:']);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática) se llega a Desarrollo
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Stepper' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
