import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DropdownMenu } from './DropdownMenu';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuPanel } from './DropdownMenuPanel';
import type {
  DropdownMenuItemState,
  DropdownMenuItemType,
  DropdownMenuMode,
  DropdownMenuProps,
  DropdownMenuType,
} from './DropdownMenu.types';
import { Avatar, AvatarPlus } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import type { PhotoName } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';

const TYPE_OPTIONS: DropdownMenuType[] = ['simple', 'search'];
const MODE_OPTIONS: DropdownMenuMode[] = ['menu', 'list'];

const PEOPLE: { name: string; photo: PhotoName }[] = [
  { name: 'Ana Pérez', photo: 'Woman_1' },
  { name: 'Hugo García', photo: 'Men_1' },
  { name: 'Lucía Torres', photo: 'Woman_2' },
  { name: 'Mateo Ruiz', photo: 'Men_2' },
  { name: 'Sara Molina', photo: 'Woman_3' },
  { name: 'Diego Vega', photo: 'Men_3' },
];

const photo = (name: PhotoName) => <Avatar variant="photo" size="xs" src={PHOTO_SRC[name]} alt="" />;

/** Dos ítems del tipo pedido, como en las muestras de Figma. */
function SampleItems({ itemType, secondSelected = false }: { itemType: DropdownMenuItemType; secondSelected?: boolean }) {
  const common = (i: number) => ({
    type: itemType,
    selected: secondSelected && i === 1 && itemType !== 'checkbox' && itemType !== 'radio',
    ...(itemType === 'checkbox' || itemType === 'radio' ? { defaultChecked: secondSelected && i === 1 } : {}),
    ...(itemType === 'avatar' ? { avatar: photo(PEOPLE[i].photo) } : {}),
  });
  return (
    <>
      {[0, 1].map((i) => (
        <DropdownMenuItem key={i} {...common(i)}>
          Text item
        </DropdownMenuItem>
      ))}
    </>
  );
}

const meta = {
  title: 'Overlays/Dropdown menu',
  component: DropdownMenu,
  subcomponents: { DropdownMenuPanel, DropdownMenuItem },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: TYPE_OPTIONS, type: { name: 'enum', value: TYPE_OPTIONS }, description: 'Type de Figma: simple o search' },
    mode: { control: 'radio', options: MODE_OPTIONS, type: { name: 'enum', value: MODE_OPTIONS }, description: 'menu (acciones, Menu Button) o list (lista informativa)' },
    align: { control: 'radio', options: ['start', 'end'], type: { name: 'enum', value: ['start', 'end'] }, description: 'Alineación con el disparador' },
    side: { control: 'radio', options: ['bottom', 'top'], type: { name: 'enum', value: ['bottom', 'top'] }, description: 'Lado preferido' },
    scrollbar: { control: 'boolean', type: { name: 'boolean' }, description: 'Prop Scroll bar de Figma' },
    searchLabel: { control: 'text', type: { name: 'string' }, description: 'Label del campo de búsqueda' },
  },
  args: {
    type: 'simple',
    mode: 'menu',
    align: 'end',
    side: 'bottom',
    scrollbar: true,
    'aria-label': 'Acciones',
    searchLabel: 'Buscar',
    trigger: <Button variant="secondary" size="sm">Acciones</Button>,
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Menú de acciones con disparador (patrón Menu Button): iconos, un checkbox y un ítem deshabilitado. */
export const Interactive: Story = {
  render: (args) => (
    <div className="flex min-h-80 w-[28rem] max-w-full justify-end p-4">
      <DropdownMenu {...args}>
        <DropdownMenuItem type="icon" icon="add-circle">Nuevo archivo</DropdownMenuItem>
        <DropdownMenuItem type="icon" icon="add-circle">Duplicar</DropdownMenuItem>
        <DropdownMenuItem type="icon" icon="add-circle" disabled>Archivar</DropdownMenuItem>
        <DropdownMenuItem>Compartir</DropdownMenuItem>
      </DropdownMenu>
    </div>
  ),
};

function typeStory(itemType: DropdownMenuItemType): Story {
  return {
    render: (args) => (
      <div className="flex min-h-72 w-[28rem] max-w-full justify-end p-4">
        <DropdownMenu {...args} defaultOpen>
          <SampleItems itemType={itemType} secondSelected />
        </DropdownMenu>
      </div>
    ),
  };
}

/** Item=Simple: solo texto. */
export const ItemSimple: Story = typeStory('simple');
/** Item=Icon: ícono de 16 + texto. */
export const ItemIcon: Story = typeStory('icon');
/** Item=Checkbox: `menuitemcheckbox`; no cierra al marcar. */
export const ItemCheckbox: Story = typeStory('checkbox');
/** Radio (RadioButton del ítem de Figma): `menuitemradio`. */
export const ItemRadio: Story = typeStory('radio');
/** Item=Avatar: el avatar entra por la prop `avatar`. */
export const ItemAvatar: Story = typeStory('avatar');

function SearchExample(args: DropdownMenuProps) {
  const [query, setQuery] = useState('');
  const [checked, setChecked] = useState<string[]>(['Ana Pérez']);
  const shown = PEOPLE.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <div className="flex min-h-96 w-[28rem] max-w-full justify-end p-4">
      <DropdownMenu
        {...args}
        type="search"
        searchValue={query}
        onSearchChange={setQuery}
        aria-label="Personas"
        trigger={<Button variant="secondary" size="sm">{`Personas (${checked.length})`}</Button>}
      >
        {shown.map((p) => (
          <DropdownMenuItem
            key={p.name}
            type="checkbox"
            checked={checked.includes(p.name)}
            onCheckedChange={(on) => setChecked((c) => (on ? [...c, p.name] : c.filter((n) => n !== p.name)))}
          >
            {p.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenu>
    </div>
  );
}

/** Type=Search: el campo filtra los ítems (el filtrado lo hace quien usa el menú) y los checkbox no cierran el panel. */
export const Search: Story = { render: (args) => <SearchExample {...args} /> };

/** Modo `list`: lista informativa de los avatares ocultos de un grupo, abierta desde el "+N". */
export const InfoList: Story = {
  render: (args) => (
    <div className="flex min-h-72 w-[28rem] max-w-full justify-end p-4">
      <div className="flex items-center">
        {PEOPLE.slice(0, 3).map((p) => (
          <Avatar key={p.name} variant="photo" size="sm" src={PHOTO_SRC[p.photo]} alt={p.name} ringed className="-ml-2 first:ml-0" />
        ))}
        <DropdownMenu
          {...args}
          mode="list"
          aria-label="Personas ocultas"
          trigger={<AvatarPlus count={3} className="-ml-4" />}
        >
          {PEOPLE.slice(3).map((p) => (
            <DropdownMenuItem key={p.name} type="avatar" avatar={photo(p.photo)}>
              {p.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      </div>
    </div>
  ),
};

/** En 375 de ancho el panel no se sale de la pantalla aunque el disparador esté pegado al borde. */
export const NarrowScreen: Story = {
  parameters: { layout: 'fullscreen', viewport: { defaultViewport: 'mobile1' } },
  render: (args) => (
    <div className="flex w-[375px] max-w-full justify-start p-2">
      <DropdownMenu {...args} align="end">
        <SampleItems itemType="icon" />
      </DropdownMenu>
    </div>
  ),
};

const SURFACE = 'bg-ds-background-general-black';

const MENU_VARIANTS: { type: DropdownMenuType; item: 'Simple' | 'Icon' | 'Checkbox' | 'Avatar' }[] = [
  { type: 'simple', item: 'Simple' },
  { type: 'simple', item: 'Icon' },
  { type: 'simple', item: 'Checkbox' },
  { type: 'simple', item: 'Avatar' },
  { type: 'search', item: 'Simple' },
  { type: 'search', item: 'Icon' },
  { type: 'search', item: 'Checkbox' },
  { type: 'search', item: 'Avatar' },
];

/** Las 8 variantes de Figma (Type × Item) abiertas en línea, sin popover. Ancho 310. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen', a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className={`grid w-fit grid-cols-[repeat(4,310px)] items-start gap-6 p-6 ${SURFACE}`}>
      {MENU_VARIANTS.map(({ type, item }) => {
        const itemType = item.toLowerCase() as DropdownMenuItemType;
        // En Figma, Checkbox y Avatar muestran su segundo ítem en Select salvo en Simple+Checkbox
        const secondSelected = item === 'Avatar' || (item === 'Checkbox' && type === 'search');
        return (
          <DropdownMenuPanel
            key={`${type}-${item}`}
            type={type}
            aria-label={`Type ${type}, Item ${item}`}
            searchLabel="Label"
            data-figma={`Type=${type === 'simple' ? 'Simple' : 'Search'}, Item=${item}`}
          >
            <SampleItems itemType={itemType} secondSelected={secondSelected} />
          </DropdownMenuPanel>
        );
      })}
    </div>
  ),
};

const LIST_TYPES: { figma: string; type: DropdownMenuItemType }[] = [
  { figma: 'List Item Checkbox', type: 'checkbox' },
  { figma: 'List Item RadioButton', type: 'radio' },
  { figma: 'List Item Avatar', type: 'avatar' },
  { figma: 'List Item simple', type: 'icon' },
  { figma: 'List Item Dropdown', type: 'dropdown' },
];
const LIST_STATES: { figma: string; state: DropdownMenuItemState }[] = [
  { figma: 'Default', state: 'default' },
  { figma: 'Hover', state: 'hover' },
  { figma: 'Select', state: 'select' },
  { figma: 'Disabled', state: 'disabled' },
];

/** Las 16 variantes del ítem "Dropdown list" (Type × State), sueltas a 304 de ancho. */
export const FigmaMatrixList: Story = {
  parameters: { layout: 'fullscreen', a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className={`grid w-fit grid-cols-[repeat(4,304px)] items-start gap-6 p-6 ${SURFACE}`}>
      {LIST_TYPES.flatMap(({ figma, type }) =>
        LIST_STATES.map(({ figma: stateName, state }) => (
          <div key={`${figma}-${stateName}`} role="menu" aria-label={`${figma} ${stateName}`}>
            <DropdownMenuItem
              type={type}
              state={state}
              avatar={type === 'avatar' ? <Avatar variant="photo" size="xs" src={PHOTO_SRC[state === 'disabled' ? 'Disabled' : 'Woman_1']} alt="" disabled={state === 'disabled'} /> : undefined}
              data-figma={`Type=${figma}, State=${stateName}`}
            >
              Text item
            </DropdownMenuItem>
          </div>
        ))
      )}
    </div>
  ),
};

/** Pruebas: Menu Button del APG (ARIA, flechas, Inicio, Fin, Enter, Esc, Tab) y selección que cierra. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <div className="flex min-h-72 w-[28rem] max-w-full justify-end p-4">
      <DropdownMenu {...args}>
        <DropdownMenuItem>Uno</DropdownMenuItem>
        <DropdownMenuItem disabled>Dos</DropdownMenuItem>
        <DropdownMenuItem type="checkbox">Tres</DropdownMenuItem>
        <DropdownMenuItem>Cuatro</DropdownMenuItem>
      </DropdownMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Acciones' });
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    const menu = canvas.getByRole('menu', { hidden: true });
    expect(button).toHaveAttribute('aria-controls', menu.closest('[popover]')!.id);

    // Enter abre y enfoca el primer ítem
    button.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'true'));
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Uno' })).toHaveFocus());
    expect(canvas.getByRole('menuitemcheckbox', { name: 'Tres' })).toHaveAttribute('aria-checked', 'false');

    // Flechas (salta el deshabilitado), Fin, Inicio y vuelta
    await userEvent.keyboard('{ArrowDown}');
    expect(canvas.getByRole('menuitemcheckbox', { name: 'Tres' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(canvas.getByRole('menuitem', { name: 'Cuatro' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(canvas.getByRole('menuitem', { name: 'Uno' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(canvas.getByRole('menuitem', { name: 'Cuatro' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(canvas.getByRole('menuitem', { name: 'Uno' })).toHaveFocus();
    await userEvent.keyboard('t');
    expect(canvas.getByRole('menuitemcheckbox', { name: 'Tres' })).toHaveFocus();

    // El checkbox se marca y el menú sigue abierto
    await userEvent.keyboard('{Enter}');
    expect(canvas.getByRole('menuitemcheckbox', { name: 'Tres' })).toHaveAttribute('aria-checked', 'true');
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Esc cierra y devuelve el foco
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'false'));
    expect(button).toHaveFocus();

    // Flecha arriba abre y enfoca el último
    await userEvent.keyboard('{ArrowUp}');
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Cuatro' })).toHaveFocus());

    // Activar un ítem cierra y devuelve el foco
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'false'));
    expect(button).toHaveFocus();

    // Flecha abajo abre y enfoca el primero; Tab cierra
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Uno' })).toHaveFocus());
    await userEvent.tab();
    await waitFor(() => expect(button).toHaveAttribute('aria-expanded', 'false'));
  },
};

/**
 * Pruebas: la lista informativa (sin roles de menú, foco en el disparador) y Esc.
 * El clic fuera es cierre ligero nativo del popover: el navegador solo lo ejecuta con eventos reales,
 * no con los sintéticos de `userEvent`, así que se verifica con Playwright (ver el reporte).
 */
export const DismissTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <div className="flex min-h-72 w-[28rem] max-w-full flex-col items-end gap-8 p-4">
      <DropdownMenu {...args} mode="list" aria-label="Personas ocultas" trigger={<AvatarPlus count={2} />}>
        <DropdownMenuItem type="avatar" avatar={photo('Men_2')}>Mateo Ruiz</DropdownMenuItem>
        <DropdownMenuItem type="avatar" avatar={photo('Woman_3')}>Sara Molina</DropdownMenuItem>
      </DropdownMenu>
      <button type="button">Fuera</button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const plus = canvas.getByRole('button', { name: 'Ver +2 más' });
    expect(plus).not.toHaveAttribute('aria-haspopup');
    expect(plus).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(plus);
    await waitFor(() => expect(plus).toHaveAttribute('aria-expanded', 'true'));
    const list = canvas.getByRole('list', { name: 'Personas ocultas' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(canvas.queryByRole('menu')).toBeNull();
    // El foco se queda en el disparador
    expect(plus).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(plus).toHaveAttribute('aria-expanded', 'false'));

    await userEvent.click(plus);
    await waitFor(() => expect(plus).toHaveAttribute('aria-expanded', 'true'));

  },
};
