import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NotificationGroupItem } from './NotificationGroupItem';
import { FIGMA_LOREM } from '../NotificationItem/NotificationItem.shared';

const meta = {
  title: 'Data Display/NotificationGroupItem',
  component: NotificationGroupItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <ul role="list" className="m-0 w-full max-w-[316px] list-none p-0">
          <Story />
        </ul>
      ),
  ],
  argTypes: {
    description: { control: 'text', type: { name: 'string' }, description: 'Prop Description de Figma' },
    time: { control: 'text', type: { name: 'string' }, description: 'Prop Time de Figma' },
    unread: { control: 'boolean', type: { name: 'boolean' }, description: 'State=Unread de Figma' },
    revealed: { control: 'boolean', type: { name: 'boolean' }, description: 'Type=Eliminate de Figma' },
  },
  args: {
    description: 'Tu pago de octubre fue confirmado.',
    time: 'Hace 22 min',
    unread: true,
  },
} satisfies Meta<typeof NotificationGroupItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. Normalmente va dentro de un `NotificationGroup`. */
export const Interactive: Story = { args: { onClick: fn() } };

/** Leída: sin punto y con la descripción en peso regular. */
export const Read: Story = { args: { unread: false } };

const FIGMA = [
  { name: 'Type=Default, State=Unread', unread: true, eliminate: false },
  { name: 'Type=Default, State=Read', unread: false, eliminate: false },
  { name: 'Type=Eliminate, State=Unread', unread: true, eliminate: true },
  { name: 'Type=Eliminate, State=Read', unread: false, eliminate: true },
];

/** Las cuatro variantes de Figma (316 de ancho, 318 con el botón eliminar). */
export const FigmaMatrix: Story = {
  parameters: { bare: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <ul role="list" className="m-0 flex list-none flex-col gap-6 p-0">
        {FIGMA.map((v) => (
          <NotificationGroupItem
            key={v.name}
            className={v.eliminate ? 'w-[318px]' : 'w-[316px]'}
            rootProps={{ 'data-figma': v.name }}
            time="Hace 22m"
            description={FIGMA_LOREM}
            unread={v.unread}
            onDelete={v.eliminate ? () => {} : undefined}
            revealed={v.eliminate ? true : undefined}
          />
        ))}
      </ul>
    </div>
  ),
};

/** Test: el control es la descripción y la hora y "No leída" son su descripción accesible. */
export const RoleTest: Story = {
  tags: ['!autodocs'],
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('button', { name: 'Tu pago de octubre fue confirmado.' });
    await expect(control).toHaveAccessibleDescription('Hace 22 min No leída');
    await userEvent.click(control);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
