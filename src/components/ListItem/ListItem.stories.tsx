import { useState } from 'react';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ListItem } from './ListItem';
import type { ListItemProps, ListItemVariant } from './ListItem.types';
import { Avatar, AvatarGroup } from '../Avatar';
import { DropdownMenuItem } from '../DropdownMenu';

const VARIANT_OPTIONS: ListItemVariant[] = ['simple', 'complex'];

/** Envuelve la historia en un `ul` (un `li` suelto no es válido). Las historias con `parameters.ownList` arman el suyo. */
const withList: Decorator = (Story, { parameters }) =>
  parameters.ownList ? (
    <Story />
  ) : (
  <div className="bg-ds-background-general-black">
    <ul role="list" className="m-0 w-full max-w-5xl p-0">
      <Story />
    </ul>
  </div>
  );

const meta = {
  title: 'Data Display/List item',
  component: ListItem,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: VARIANT_OPTIONS, type: { name: 'enum', value: VARIANT_OPTIONS }, description: 'Type de Figma' },
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Tittle de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Descripción (opcional)' },
    category: { control: 'text', type: { name: 'string' }, description: 'Categoría (solo complex)' },
    selectable: { control: 'boolean', type: { name: 'boolean' }, description: 'Dibuja el checkbox' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'State Disabled de Figma' },
  },
  args: {
    variant: 'complex',
    title: 'Nombre del item',
    description: 'Descripción',
    category: 'Categoría',
    selectable: true,
    disabled: false,
  },
  decorators: [withList],
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const menuItems = [
  <DropdownMenuItem key="dup" type="icon" icon="add-circle">Duplicar</DropdownMenuItem>,
  <DropdownMenuItem key="mov" type="icon" icon="add-circle">Mover</DropdownMenuItem>,
];

const folder = <Avatar variant="icon" size="sm" label="Carpeta" />;

/** Preview con controles. Los controles de la derecha aparecen porque se pasan `onEdit`, `onDelete` y `menu`. */
export const Interactive: Story = {
  args: { leading: folder, onEdit: fn(), onDelete: fn(), menu: menuItems },
};

export const Simple: Story = {
  args: { variant: 'simple', onEdit: fn(), onDelete: fn(), menu: menuItems },
};

export const Disabled: Story = {
  args: { leading: folder, disabled: true, onEdit: fn(), onDelete: fn(), menu: menuItems },
};

/** `leading` es un slot: aquí un grupo de avatares (prop `Avatar group` de Figma). */
export const WithAvatarGroup: Story = {
  args: {
    title: 'Equipo de diseño',
    description: 'Tres personas',
    category: 'Proyecto',
    leading: (
      <AvatarGroup size="sm">
        <Avatar name="Ana Pérez" />
        <Avatar name="Hugo García" color="blue" />
        <Avatar name="Luz Mora" color="green" />
      </AvatarGroup>
    ),
    onEdit: fn(),
  },
};

/** Sin acciones ni selección: solo el contenido. */
export const ContentOnly: Story = {
  args: { selectable: false, leading: folder },
};

/** Lista con selección controlada. */
function SelectableList(args: ListItemProps) {
  const [selected, setSelected] = useState<string[]>(['b']);
  const items = [
    { id: 'a', title: 'Informe trimestral', category: 'Documento' },
    { id: 'b', title: 'Presupuesto 2027', category: 'Hoja de cálculo' },
    { id: 'c', title: 'Notas de la reunión', category: 'Documento' },
  ];
  return (
    <div className="bg-ds-background-general-black">
      <ul role="list" className="m-0 w-full max-w-5xl p-0">
      {items.map((item) => (
        <ListItem
          {...args}
          key={item.id}
          title={item.title}
          category={item.category}
          description="Actualizado hoy"
          leading={folder}
          selectable
          selected={selected.includes(item.id)}
          onSelectedChange={(on) => setSelected((cur) => (on ? [...cur, item.id] : cur.filter((x) => x !== item.id)))}
        />
      ))}
      </ul>
      <p role="status" className="m-0 p-2 text-xs text-ds-text-neutral-body">{selected.length} seleccionados</p>
    </div>
  );
}

export const SelectableLists: Story = {
  parameters: { ownList: true },
  render: (args) => <SelectableList {...args} />,
};

/** Container query: por debajo de 18rem (288 px) de contenido la categoría sube sobre el título y la descripción baja a todo el ancho. */
export const Narrow: Story = {
  parameters: { ownList: true },
  args: { leading: folder, onEdit: fn(), onDelete: fn(), menu: menuItems },
  render: (args) => (
    <div className="w-[280px] max-w-full bg-ds-background-general-black">
      <ul role="list" className="m-0 p-0">
        <ListItem {...args} />
      </ul>
    </div>
  ),
};

const FIGMA_VARIANTS: { name: string; variant: ListItemVariant; disabled: boolean }[] = [
  { name: 'Type=Complex, State=Default', variant: 'complex', disabled: false },
  { name: 'Type=Complex, State=Disabled', variant: 'complex', disabled: true },
  { name: 'Type=Simple, State=Default', variant: 'simple', disabled: false },
  { name: 'Type=Simple, State=Disabled', variant: 'simple', disabled: true },
];

// Figma: 12174:13893
/** Las 4 variantes del set de Figma, en el ancho de Figma (1286) con scroll horizontal si no cabe. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded', ownList: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de List item" className="max-w-full overflow-x-auto">
        <ul role="list" className="m-0 w-[1286px] p-0">
          {FIGMA_VARIANTS.map(({ name, variant, disabled }) => (
            <ListItem
              key={name}
              data-figma={name}
              variant={variant}
              title="Nombre del item"
              description="Descripción"
              category="Categoría"
              leading={folder}
              selectable
              disabled={disabled}
              onEdit={() => {}}
              onDelete={() => {}}
              menu={menuItems}
            />
          ))}
        </ul>
      </div>
    </div>
  ),
};

/** Test: rol listitem, checkbox con el título como nombre y botones nombrados con el título */
export const AccessibleNamesTest: Story = {
  tags: ['!autodocs'],
  args: { leading: folder, onEdit: fn(), onDelete: fn(), menu: menuItems },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('listitem')).toBeInTheDocument();
    await expect(canvas.getByRole('checkbox', { name: 'Nombre del item' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Editar Nombre del item' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Eliminar Nombre del item' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Más opciones de Nombre del item' })).toBeInTheDocument();
  },
};

/** Test: Tab recorre checkbox, editar, eliminar y menú; Espacio marca; Enter dispara los callbacks */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { leading: folder, onEdit: fn(), onDelete: fn(), onSelectedChange: fn(), menu: menuItems },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const checkbox = canvas.getByRole('checkbox', { name: 'Nombre del item' });
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(args.onSelectedChange).toHaveBeenLastCalledWith(true);
    await expect(checkbox).toBeChecked();
    await userEvent.keyboard(' ');
    await expect(args.onSelectedChange).toHaveBeenLastCalledWith(false);

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Editar Nombre del item' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onEdit).toHaveBeenCalledTimes(1);

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Eliminar Nombre del item' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onDelete).toHaveBeenCalledTimes(1);

    await userEvent.tab();
    const more = canvas.getByRole('button', { name: 'Más opciones de Nombre del item' });
    await expect(more).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(more).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(more).toHaveFocus());
  },
};

/** Test: con clic también se llaman los callbacks */
export const ClickTest: Story = {
  tags: ['!autodocs'],
  args: { onEdit: fn(), onDelete: fn(), onSelectedChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Nombre del item' }));
    await expect(args.onSelectedChange).toHaveBeenCalledWith(true);
    await userEvent.click(canvas.getByRole('button', { name: 'Editar Nombre del item' }));
    await expect(args.onEdit).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Eliminar Nombre del item' }));
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};

/** Test: Disabled no lleva aria-disabled en el li y no deja activar ni enfocar nada */
export const DisabledTest: Story = {
  tags: ['!autodocs'],
  args: { disabled: true, onEdit: fn(), onDelete: fn(), onSelectedChange: fn(), menu: menuItems },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('listitem')).not.toHaveAttribute('aria-disabled');
    const checkbox = canvas.getByRole('checkbox', { name: 'Nombre del item' });
    const edit = canvas.getByRole('button', { name: 'Editar Nombre del item' });
    const del = canvas.getByRole('button', { name: 'Eliminar Nombre del item' });
    const more = canvas.getByRole('button', { name: 'Más opciones de Nombre del item' });
    for (const el of [checkbox, edit, del, more]) await expect(el).toBeDisabled();
    await userEvent.click(edit);
    await userEvent.click(del);
    await userEvent.click(checkbox);
    await expect(args.onEdit).not.toHaveBeenCalled();
    await expect(args.onDelete).not.toHaveBeenCalled();
    await expect(args.onSelectedChange).not.toHaveBeenCalled();
    await userEvent.tab();
    await expect(document.body).toHaveFocus();
  },
};

/** Acción "navegar": la fila entera abre otra vista; el título es el botón (o enlace con `href`) y lleva la flecha. */
export const Navigation: Story = {
  args: { selectable: false, description: undefined, category: undefined, leading: folder, title: 'Documentos', onNavigate: fn() },
};

/** Test: con `onNavigate` el título es un botón con su nombre, el clic en cualquier parte de la fila navega y la flecha es decorativa. */
export const NavigationTest: Story = {
  tags: ['!autodocs'],
  parameters: { ownList: true },
  args: { selectable: false, description: undefined, category: undefined, leading: folder, title: 'Documentos', onNavigate: fn() },
  render: (args) => (
    <ul role="list" className="m-0 w-96 list-none p-0">
      <ListItem {...args} />
      <ListItem title="Fotografías" leading={folder} href="#fotos" />
    </ul>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Documentos' });
    await expect(button).toHaveAttribute('data-list-control');
    await expect(canvas.getByRole('link', { name: 'Fotografías' })).toHaveAttribute('href', '#fotos');
    // Clic sobre el borde derecho de la fila (fuera del texto): lo recibe el área estirada del título
    const row = button.closest('li')!;
    const box = row.getBoundingClientRect();
    const hit = document.elementFromPoint(box.right - 60, box.top + box.height / 2);
    await expect(hit === button || button.contains(hit)).toBe(true);
    await userEvent.click(button);
    await expect(args.onNavigate).toHaveBeenCalledTimes(1);
    // La flecha no se anuncia
    const chevron = row.querySelector('[data-figma-part="Actions Block"] [aria-hidden="true"]');
    await expect(chevron).not.toBeNull();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Fotografías' })).toHaveFocus();
  },
};
