import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { NavBar, NavBarItem } from './NavBar';
import type { NavBarItemData, NavBarMoreItem, NavBarProps } from './NavBar.types';

const ITEMS: NavBarItemData[] = [
  { value: 'inicio', label: 'Inicio', icon: 'add-circle' },
  { value: 'pagos', label: 'Pagos', icon: 'add-circle' },
  { value: 'ahorro', label: 'Ahorro', icon: 'add-circle' },
  { value: 'perfil', label: 'Perfil', icon: 'add-circle' },
];

const MORE: NavBarMoreItem[] = [
  { value: 'favoritos', label: 'Favoritos', icon: 'heart' },
  { value: 'galeria', label: 'Galería', icon: 'image' },
  { value: 'recomendados', label: 'Recomendados', icon: 'like' },
  { value: 'notas', label: 'Notas', icon: 'note-favorite' },
  { value: 'tienda', label: 'Tienda', icon: 'shop-add' },
];

const meta = {
  title: 'Navigation/Nav bar',
  component: NavBar,
  subcomponents: { NavBarItem },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text', type: { name: 'string' }, description: 'Opción activa (controlada)' },
    defaultValue: { control: 'text', type: { name: 'string' }, description: 'Opción activa inicial' },
    moreLabel: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible del botón "más"' },
    moreOpen: { control: 'boolean', type: { name: 'boolean' }, description: 'Hoja "más" abierta (controlada)' },
  },
  args: { 'aria-label': 'Navegación principal', items: ITEMS, defaultValue: 'inicio' },
  decorators: [
    (Story) => (
      <div className="w-[376px] bg-ds-background-general-black">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Estilo "4 options" (sin `moreItems`). */
export const Interactive: Story = {};

/** Estilo "3 options": tres opciones y el botón "más" con la hoja de opciones extra. */
export const WithMore: Story = {
  args: { items: ITEMS.slice(0, 3), moreItems: MORE },
};

function Controlled(args: NavBarProps) {
  const [value, setValue] = useState('pagos');
  return (
    <div>
      <NavBar {...args} value={value} onValueChange={setValue} />
      <p className="m-0 p-4 font-ds-primitives-typography-family-primary text-ds-typography-body-size-sm text-ds-text-neutral-body">Activa: {value}</p>
    </div>
  );
}

/** Controlada con `value` / `onValueChange`. */
export const ControlledValue: Story = {
  render: (args) => <Controlled {...args} />,
};

/** Composición con `NavBarItem` y enlaces (`href`). */
export const Composition: Story = {
  render: (args) => (
    <NavBar aria-label={args['aria-label']} defaultValue="b">
      <NavBarItem value="a" label="Inicio" icon="add-circle" href="#inicio" />
      <NavBarItem value="b" label="Pagos" icon="add-circle" href="#pagos" />
      <NavBarItem value="c" label="Ahorro" icon="add-circle" href="#ahorro" />
    </NavBar>
  ),
};

const LABELS = 'Transferencia';
const TRANSFER: NavBarItemData[] = [1, 2, 3, 4].map((n) => ({ value: `t${n}`, label: LABELS, icon: 'add-circle' as const }));

/** Una variante de la spec: 3 o 4 opciones, `tab` 1-4 (en "3 options" el 4 es la hoja "más" abierta). */
function Variant({ style, tab }: { style: 3 | 4; tab: 1 | 2 | 3 | 4 }) {
  const name = `Style=${style} options, tab=${tab}`;
  if (style === 4) {
    return <NavBar aria-label={name} data-figma={name} items={TRANSFER} defaultValue={`t${tab}`} />;
  }
  return (
    <NavBar
      aria-label={name}
      data-figma={name}
      items={TRANSFER.slice(0, 3)}
      moreItems={MORE}
      defaultValue={tab === 4 ? 't1' : `t${tab}`}
      defaultMoreOpen={tab === 4}
    />
  );
}

/** Las 8 variantes del set "Nav bar" (`Style` × `tab`). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <div className="grid grid-cols-[repeat(3,376px)] items-end gap-ds-space-general-2xl bg-ds-background-general-black p-ds-space-general-2xl">
      {([4, 3] as const).flatMap((style) => ([1, 2, 3, 4] as const).map((tab) => <Variant key={`${style}-${tab}`} style={style} tab={tab} />))}
    </div>
  ),
};

/** Los tres estados del átomo "Options tab bar" (`Propiedad 1`). */
export const FigmaOptionsTabBar: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <div className="flex gap-ds-space-general-2xl bg-ds-background-container-default-on-canva p-ds-space-general-2xl">
      {(['default', 'focus', 'select'] as const).map((state) => (
        <NavBarItem
          key={state}
          value="x"
          label="Transferencia"
          icon="add-circle"
          state={state}
          className="w-[75px] flex-none"
          data-figma={`Propiedad 1=${state[0].toUpperCase()}${state.slice(1)}`}
        />
      ))}
    </div>
  ),
};

/** Test: la barra es una navegación con nombre y la opción activa lleva aria-current="page". */
export const RoleTest: Story = {
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Inicio' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('button', { name: 'Pagos' })).not.toHaveAttribute('aria-current');
  },
};

/** Test: clic y teclado cambian la opción activa y llaman onValueChange; el foco es visible. */
export const SelectTest: Story = {
  tags: ['!autodocs'],
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Pagos' }));
    await expect(canvas.getByRole('button', { name: 'Pagos' })).toHaveAttribute('aria-current', 'page');
    await expect(args.onValueChange).toHaveBeenCalledWith('pagos');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Ahorro' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button', { name: 'Ahorro' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('button', { name: 'Pagos' })).not.toHaveAttribute('aria-current');
  },
};

/** Test: las opciones con href son enlaces. */
export const LinkTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <NavBar aria-label={args['aria-label']} defaultValue="a">
      <NavBarItem value="a" label="Inicio" icon="add-circle" href="#inicio" />
      <NavBarItem value="b" label="Pagos" icon="add-circle" href="#pagos" />
    </NavBar>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Inicio' });
    await expect(link).toHaveAttribute('href', '#inicio');
    await expect(link).toHaveAttribute('aria-current', 'page');
  },
};

/** Test: el botón "más" abre la hoja, el foco entra, las flechas se mueven y Escape cierra devolviendo el foco. */
export const MoreMenuTest: Story = {
  tags: ['!autodocs'],
  args: { items: ITEMS.slice(0, 3), moreItems: MORE, onMoreSelect: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const more = canvas.getByRole('button', { name: 'Más opciones' });
    await expect(more).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(more);
    await expect(more).toHaveAttribute('aria-expanded', 'true');
    const menu = canvas.getByRole('menu', { name: 'Más opciones' });
    await expect(menu).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Favoritos' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: 'Galería' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('menuitem', { name: 'Tienda' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
    await expect(more).toHaveFocus();
    await userEvent.click(more);
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Notas' }));
    await expect(args.onMoreSelect).toHaveBeenCalledWith('notas');
    await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
  },
};
