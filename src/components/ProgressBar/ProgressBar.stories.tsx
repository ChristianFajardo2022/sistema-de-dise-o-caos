import { useEffect, useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { ProgressBar } from './ProgressBar';
import type { ProgressBarProps, ProgressBarStatus, ProgressBarType } from './ProgressBar.types';

const TYPE_OPTIONS: ProgressBarType[] = ['linear-text', 'text-above', 'external-text'];
const STATUS_OPTIONS: ProgressBarStatus[] = ['default', 'success', 'error', 'alert'];

function AnimatedBar(args: ProgressBarProps) {
  const [v, setV] = useState(10);
  useEffect(() => {
    const id = setInterval(() => setV((x) => (x >= 100 ? 0 : x + 15)), 1200);
    return () => clearInterval(id);
  }, []);
  return <ProgressBar {...args} value={v} />;
}

/** Ancho de muestra de Figma (347) con aire arriba para la burbuja */
const narrow: Decorator = (Story) => (
  <div className="w-[347px] max-w-full pt-8">
    <Story />
  </div>
);

const meta = {
  title: 'Feedback/Progress bar',
  component: ProgressBar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 }, type: { name: 'number' }, description: 'Progreso continuo entre 0 y max' },
    max: { control: 'number', type: { name: 'number' }, description: 'Valor que equivale al 100 %' },
    type: {
      name: 'type',
      control: 'radio',
      options: TYPE_OPTIONS,
      type: { name: 'enum', value: TYPE_OPTIONS },
      description: 'Type de Figma: dónde va el texto del porcentaje',
    },
    status: {
      name: 'status',
      control: 'radio',
      options: STATUS_OPTIONS,
      type: { name: 'enum', value: STATUS_OPTIONS },
      description: 'State de Figma: color del progreso',
    },
    showValue: { control: 'boolean', type: { name: 'boolean' }, description: 'Muestra el texto del porcentaje' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible' },
    statusLabel: { control: 'text', type: { name: 'string' }, description: 'Texto del estado para lectores de pantalla' },
  },
  args: { value: 60, max: 100, type: 'linear-text', status: 'default', showValue: true, label: 'Carga del archivo' },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = { decorators: [narrow] };

/** Valor continuo y formato propio: 3 de 8 pasos. */
export const CustomFormat: Story = {
  decorators: [narrow],
  args: { value: 3, max: 8, status: 'success', formatValue: (v, p) => `${v}/8 (${Math.round(p)}%)` },
};

/** El valor cambia solo para ver la transición (se detiene con prefers-reduced-motion). */
export const Animated: Story = {
  decorators: [narrow],
  render: (args) => <AnimatedBar {...args} />,
};

const TYPES: { type: ProgressBarType; figma: string }[] = [
  { type: 'linear-text', figma: 'Linear text' },
  { type: 'text-above', figma: 'Text above' },
  { type: 'external-text', figma: 'External text' },
];
const STATUSES: { status: ProgressBarStatus; figma: string }[] = [
  { status: 'default', figma: 'Default' },
  { status: 'success', figma: 'Success' },
  { status: 'error', figma: 'Error' },
  { status: 'alert', figma: 'Alert' },
];
const STEPS = [0, 25, 50, 75, 100];

/** Las 60 variantes de Figma (Type × State × Progress), cada una una vez, sobre la superficie del tema. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de Progress bar" className="max-w-full overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(5,347.8px)] items-center gap-x-8 gap-y-8">
          <span />
          {STEPS.map((s) => (
            <span key={s} className="text-xs text-ds-text-neutral-body">{s}%</span>
          ))}
          {STATUSES.map((st) =>
            TYPES.map((t) => (
              <div key={`${st.status}-${t.type}`} className="contents">
                <span className="text-xs text-ds-text-neutral-body">{st.status} · {t.type}</span>
                {STEPS.map((s) => (
                  <ProgressBar
                    key={s}
                    type={t.type}
                    status={st.status}
                    value={s}
                    className={t.type === 'text-above' ? undefined : 'w-[347px]'}
                    label={`${t.figma} ${st.figma} ${s}%`}
                    data-figma={`Type=${t.figma}, State=${st.figma}, Progress=${s}%`}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  ),
};

/** Test: rol, valores y nombre accesible; recorte de valores fuera de rango */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex w-[347px] flex-col gap-8 pt-8">
      <ProgressBar label="Carga del archivo" value={40} status="error" statusLabel="con error" />
      <ProgressBar data-testid="clamped" label="Fuera de rango" value={250} type="text-above" />
      <ProgressBar data-testid="scaled" label="Pasos" value={3} max={8} type="external-text" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', { name: 'Carga del archivo' });
    await expect(bar).toHaveAttribute('aria-valuenow', '40');
    await expect(bar).toHaveAttribute('aria-valuemin', '0');
    await expect(bar).toHaveAttribute('aria-valuemax', '100');
    await expect(bar).toHaveAttribute('aria-valuetext', '40%, con error');
    await expect(canvas.getByTestId('clamped')).toHaveAttribute('aria-valuenow', '100');
    await expect(canvas.getByTestId('scaled')).toHaveAttribute('aria-valuetext', '38%');
    await expect(canvas.getByTestId('scaled')).toHaveAttribute('aria-valuemax', '8');
  },
};
