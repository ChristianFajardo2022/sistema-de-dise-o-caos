import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FilterTabs } from './FilterTabs';
import type { FilterTabsTab } from './FilterTabs.types';

const TABS: FilterTabsTab[] = [
  {
    value: 'estado',
    label: 'Estado',
    icon: 'heart',
    options: [
      { value: 'nuevo', label: 'Nuevo' },
      { value: 'usado', label: 'Usado' },
      { value: 'reacondicionado', label: 'Reacondicionado' },
    ],
  },
  {
    value: 'envio',
    label: 'Envío',
    icon: 'heart',
    options: [
      { value: 'gratis', label: 'Envío gratis' },
      { value: 'mismo-dia', label: 'Llega hoy' },
    ],
  },
  {
    value: 'pago',
    label: 'Pago',
    icon: 'heart',
    options: [
      { value: 'cuotas', label: 'En cuotas' },
      { value: 'contraentrega', label: 'Contraentrega' },
    ],
  },
];

const meta = {
  title: 'Form Controls/FilterTabs',
  component: FilterTabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story) => <div className="w-80"><Story /></div>],
  argTypes: {
    contrast: { control: 'radio', options: ['on-canva', 'on-card'], type: { name: 'enum', value: ['on-canva', 'on-card'] } },
    showCounts: { control: 'boolean', type: { name: 'boolean' } },
  },
  args: { tabs: TABS, defaultValue: ['usado'], contrast: 'on-canva', showCounts: true },
} satisfies Meta<typeof FilterTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

const FIGMA_TABS: FilterTabsTab[] = [1, 2, 3].map((n) => ({
  value: String(n),
  label: 'Heading',
  icon: 'heart',
  options: [1, 2, 3].map((o) => ({ value: `${n}-${o}`, label: 'Text description' })),
}));

/** Type=3/2/1 de Figma: la pestaña seleccionada. */
export const FigmaMatrix: Story = {
  decorators: [(Story) => <Story />],
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap gap-6 bg-ds-background-general-black p-6">
      {(['3', '2', '1'] as const).map((type) => (
        <div key={type} className="flex flex-col gap-2">
          <span className="text-xs text-ds-text-neutral-body">Type={type}</span>
          <FilterTabs className="w-76" tabs={FIGMA_TABS} defaultTab={type} aria-label={`Categorías ${type}`} data-figma={`Type=${type}`} />
        </div>
      ))}
    </div>
  ),
};

/** Test: flechas cambian de pestaña (APG Tabs) y el conteo de la pestaña sigue a las casillas marcadas. */
export const SelectionTest: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: [], onValueChange: fn(), onTabChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const estado = canvas.getByRole('tab', { name: 'Estado' });
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Usado' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['usado']);
    await expect(canvas.getByRole('tab', { name: 'Estado 1 seleccionada' })).toBe(estado);

    estado.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Envío' })).toHaveAttribute('aria-selected', 'true');
    await expect(args.onTabChange).toHaveBeenLastCalledWith('envio');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Envío gratis' }));
    // El orden de la lista es el de las pestañas
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['usado', 'gratis']);
  },
};
