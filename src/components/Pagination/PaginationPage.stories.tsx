import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PaginationPage } from './PaginationPage';
import type { PaginationPageState } from './Pagination.types';

const meta = {
  title: 'Navigation/Pagination/Page',
  component: PaginationPage,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    number: { control: 'number', type: { name: 'number' }, description: 'Número de página' },
    selected: { control: 'boolean', type: { name: 'boolean' }, description: 'Página actual' },
    state: {
      control: 'select',
      options: [undefined, 'default', 'hover', 'select'],
      description: 'State forzado, solo para documentación',
    },
  },
  args: { number: 2 },
} satisfies Meta<typeof PaginationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

const STATES: { state: PaginationPageState; figma: string }[] = [
  { state: 'default', figma: 'Default' },
  { state: 'hover', figma: 'Hover' },
  { state: 'select', figma: 'Select' },
];

/** Set `Page (Atom)` (11953:4965): State Default, Hover y Select. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="flex items-center gap-8">
        {STATES.map((s) => (
          <div key={s.state} data-figma={`State=${s.figma}`} className="inline-flex">
            <PaginationPage number={0} state={s.state} aria-label={`Página 0, ${s.figma}`} />
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Test: nombre accesible, aria-current solo en la seleccionada y clic */
export const SelectedTest: Story = {
  tags: ['!autodocs'],
  args: { number: 3, onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: '3' });
    await expect(button).not.toHaveAttribute('aria-current');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const CurrentTest: Story = {
  tags: ['!autodocs'],
  args: { number: 3, selected: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page');
  },
};
