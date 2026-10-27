import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ButtonMenu } from './ButtonMenu';
import type { ButtonMenuState } from './ButtonMenu.types';

const meta = {
  title: 'Navigation/Button menu',
  component: ButtonMenu,
  tags: ['autodocs'],
  argTypes: {
    iconRight: { control: 'boolean', type: { name: 'boolean' }, description: 'Icon-rigth de Figma: chevron hacia abajo (abre un submenú)' },
    selected: { control: 'boolean', type: { name: 'boolean' }, description: 'Sección actual (Press/select, aria-current)' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'State Inactive' },
    state: {
      control: 'select',
      options: [undefined, 'default', 'hover', 'focus', 'press', 'inactive'],
      type: { name: 'enum', value: ['default', 'hover', 'focus', 'press', 'inactive'] },
      description: 'Fuerza el aspecto de un State (solo documentación)',
    },
    href: { control: 'text', type: { name: 'string' }, description: 'Con href es un enlace; sin él, un botón' },
    children: { control: 'text', type: { name: 'string' }, description: 'Text de Figma' },
  },
  args: { children: 'Servicios', iconRight: true },
  // Los botones se pintan sobre la superficie del tema
  decorators: [
    (Story) => (
      <div className="bg-ds-background-container-surface p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ButtonMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. */
export const Interactive: Story = { args: { onClick: fn() } };

/** Con `href` es un enlace; la sección actual se marca con `selected` (aria-current="page"). */
export const AsLink: Story = {
  args: { href: '#inicio', iconRight: false, children: 'Inicio', selected: true },
};

/** Un botón con submenú expone `aria-expanded`; abierto se pinta en Press/select. */
export const Expanded: Story = { args: { 'aria-expanded': true } };

/** Con ícono de la biblioteca antes del texto (Icon-left de Figma). */
export const WithLeftIcon: Story = { args: { iconLeft: 'heart', iconRight: false } };

const STATES: { name: string; label: ButtonMenuState }[] = [
  { name: 'Default', label: 'default' },
  { name: 'Hover', label: 'hover' },
  { name: 'Focus', label: 'focus' },
  { name: 'Press/select', label: 'press' },
  { name: 'Inactive', label: 'inactive' },
];

/** Los cinco State del set de Figma (Type Default). Sin chevron ni ícono: en el set de Figma ambos están ocultos (Icon-left e Icon-rigth en false). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8 bg-ds-background-container-surface p-6">
      {STATES.map((s) => (
        <ButtonMenu key={s.name} data-figma={`Type=Default, State=${s.name}`} state={s.label}>
          Button
        </ButtonMenu>
      ))}
    </div>
  ),
};

/** Test: rol y nombre, estado expandido, enlace actual y foco con teclado. */
export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex items-center gap-4 bg-ds-background-container-surface p-6">
      <ButtonMenu iconRight aria-expanded="false" aria-controls="x">
        Productos
      </ButtonMenu>
      <ButtonMenu href="#inicio" selected>
        Inicio
      </ButtonMenu>
      <ButtonMenu disabled>Soporte</ButtonMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Productos' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('button', { name: 'Soporte' })).toBeDisabled();
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};
