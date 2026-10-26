import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FilterButton } from './FilterButton';

const meta = {
  title: 'Form Controls/FilterButton',
  component: FilterButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    count: { control: 'number', description: 'Filtros aplicados (Badge Number)' },
    badge: { control: 'boolean', type: { name: 'boolean' } },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Type=Inactive' },
    layout: {
      control: 'radio',
      options: ['auto', 'desktop', 'mobile'],
      type: { name: 'enum', value: ['auto', 'desktop', 'mobile'] },
    },
    children: { control: 'text' },
  },
  args: { children: 'Filtros', count: 3, badge: true, disabled: false, layout: 'auto', onClick: fn() },
} satisfies Meta<typeof FilterButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const WithoutFilters: Story = { args: { count: 0 } };

export const Mobile: Story = { args: { layout: 'mobile' } };

export const Inactive: Story = { args: { disabled: true } };

/** Type=Default e Inactive de Figma (marco Desktop; el marco Mobile está oculto en el set). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-6 bg-ds-background-general-black p-6">
      {(['Default', 'Inactive'] as const).map((type) => (
        <div key={type} className="flex items-center gap-6">
          <span className="w-20 text-xs text-ds-text-neutral-body">Type={type}</span>
          <div data-figma={`Type=${type}`} className="inline-flex flex-col">
            <FilterButton layout="desktop" count="00" disabled={type === 'Inactive'} rootProps={{ 'data-figma-part': 'Desktop' }}>
              Button
            </FilterButton>
          </div>
          <span className="text-xs text-ds-text-neutral-body">Mobile</span>
          <FilterButton layout="mobile" count="00" disabled={type === 'Inactive'}>
            Button
          </FilterButton>
        </div>
      ))}
    </div>
  ),
};

/** Test: el número del badge describe al botón; clic y teclado lo activan. */
export const CountTest: Story = {
  tags: ['!autodocs'],
  args: { layout: 'desktop' },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Filtros' });
    await expect(button).toHaveAccessibleDescription('3 filtros aplicados');
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

/** Test: en móvil es solo ícono pero conserva nombre y descripción; Inactive no se activa. */
export const MobileAndInactiveTest: Story = {
  tags: ['!autodocs'],
  args: { layout: 'mobile', disabled: true, count: 1 },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Filtros' });
    await expect(button).toHaveAccessibleDescription('1 filtro aplicado');
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
