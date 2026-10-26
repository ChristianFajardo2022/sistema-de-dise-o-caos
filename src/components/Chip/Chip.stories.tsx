import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Chip } from './Chip';
import { ChipGroup } from './ChipGroup';
import { ChipPlus } from './ChipPlus';
import type { ChipColor, ChipPlusState, ChipState, ChipType } from './Chip.types';
import { Avatar } from '../Avatar';
import { DropdownMenuItem, DropdownMenuPanel } from '../DropdownMenu';

const TYPES: { type: ChipType; figma: string }[] = [
  { type: 'primary', figma: 'Primary' },
  { type: 'primary-avatar', figma: 'Primary avatar' },
  { type: 'primary-color', figma: 'Primary color' },
  { type: 'primary-box', figma: 'Primary box' },
];
const STATES: { state: ChipState; figma: string }[] = [
  { state: 'default', figma: 'Default' },
  { state: 'hover', figma: 'Hover' },
  { state: 'focus', figma: 'Focus' },
  { state: 'select', figma: 'Select' },
  { state: 'inactive', figma: 'Inactive' },
];
// Figma cambia el color del punto en cada estado de Primary color
const DOT_BY_STATE: Record<ChipState, ChipColor> = {
  default: 'purple',
  hover: 'green',
  focus: 'yellow',
  select: 'red',
  inactive: 'blue',
};

const meta = {
  title: 'Data Display/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    type: {
      type: { name: 'enum', value: ['primary', 'primary-avatar', 'primary-color', 'primary-box'] },
      control: 'select',
      options: ['primary', 'primary-avatar', 'primary-color', 'primary-box'],
      description: 'Type de Figma',
    },
    state: {
      type: { name: 'enum', value: ['default', 'hover', 'focus', 'select', 'inactive'] },
      control: 'select',
      options: [undefined, 'default', 'hover', 'focus', 'select', 'inactive'],
      description: 'State forzado, solo para documentación. En uso real lo dan :hover, :focus-visible, selected y disabled.',
    },
    color: {
      type: { name: 'enum', value: ['purple', 'green', 'yellow', 'red', 'blue', 'violet', 'cyan'] },
      control: 'select',
      options: ['purple', 'green', 'yellow', 'red', 'blue', 'violet', 'cyan'],
      description: 'Color del punto de primary-color',
    },
    tone: {
      type: { name: 'enum', value: ['soft', 'strong'] },
      control: 'radio',
      options: ['soft', 'strong'],
      description: 'Intensidad del punto: soft (set Chips) o strong (filtro Chips colors)',
    },
    icon: { type: { name: 'boolean' }, control: 'boolean', description: 'Icon (primary y primary-box)' },
    close: { type: { name: 'boolean' }, control: 'boolean', description: 'Close' },
    disabled: { type: { name: 'boolean' }, control: 'boolean', description: 'Inactive' },
    selected: { type: { name: 'boolean' }, control: 'boolean', description: 'Seleccionado (controlado)' },
    children: { control: 'text', description: 'Text' },
  },
  args: { type: 'primary', children: 'Entrega hoy', icon: true, onRemove: fn() },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Chip informativo (sin acción): un span con su botón de quitar. */
export const Interactive: Story = {};

/** Con `selected`/`defaultSelected` es un botón de alternancia (`aria-pressed`). */
export const Toggle: Story = {
  args: { defaultSelected: false, onSelectedChange: fn(), children: 'Con garantía' },
};

/** `primary-avatar`: el avatar se pasa a `xs` y se deshabilita con el chip. */
export const WithAvatar: Story = {
  args: {
    type: 'primary-avatar',
    avatar: <Avatar variant="initials" name="Ana Pérez" />,
    children: 'Ana Pérez',
  },
};

/** `primary-color`: el punto de color solo informa con `colorLabel`. */
export const WithColor: Story = {
  args: { type: 'primary-color', color: 'green', colorLabel: 'Verde', children: 'Disponible' },
};

/** `primary-box`: rectangular, el texto se parte en varias líneas cuando falta ancho. */
export const Box: Story = {
  args: { type: 'primary-box', children: 'Entrega en horario extendido con firma del destinatario' },
  decorators: [(Story) => <div className="w-48"><Story /></div>],
};

/** Selección única: grupo de radios, las flechas mueven y seleccionan. */
export const GroupSingle: Story = {
  render: () => (
    <ChipGroup aria-label="Tamaño del envío" selectionMode="single" defaultValue={['m']}>
      <Chip value="s" icon={false}>Pequeño</Chip>
      <Chip value="m" icon={false}>Mediano</Chip>
      <Chip value="l" icon={false}>Grande</Chip>
      <Chip value="xl" icon={false} disabled>Extra grande</Chip>
    </ChipGroup>
  ),
};

/** Selección múltiple: botones de alternancia con una sola parada de tabulación. */
export const GroupMultiple: Story = {
  render: () => (
    <ChipGroup aria-label="Servicios adicionales" selectionMode="multiple" defaultValue={['seguro']}>
      <Chip value="seguro">Seguro</Chip>
      <Chip value="firma">Firma</Chip>
      <Chip value="frio">Cadena de frío</Chip>
    </ChipGroup>
  ),
};

/** Con `max`, los chips sobrantes se resumen en el "+N" de Chips plus y se eligen desde su lista. */
export const GroupOverflow: Story = {
  render: () => (
    <ChipGroup aria-label="Ciudades" selectionMode="multiple" defaultValue={['cali']} max={3}>
      <Chip value="bogota" icon={false}>Bogotá</Chip>
      <Chip value="medellin" icon={false}>Medellín</Chip>
      <Chip value="cali" icon={false}>Cali</Chip>
      <Chip value="barranquilla" icon={false}>Barranquilla</Chip>
      <Chip value="cartagena" icon={false}>Cartagena</Chip>
    </ChipGroup>
  ),
};

/** Chips quitables: Supr/Retroceso o el botón "Quitar" y el foco pasa al vecino. */
export const GroupRemovable: Story = {
  render: function Render() {
    const [tags, setTags] = useState(['Frágil', 'Urgente', 'Interno']);
    return (
      <ChipGroup aria-label="Etiquetas del envío">
        {tags.map((t) => (
          <Chip key={t} icon={false} onRemove={() => setTags((c) => c.filter((x) => x !== t))}>
            {t}
          </Chip>
        ))}
      </ChipGroup>
    );
  },
};

const SURFACE = 'bg-ds-background-general-black';

/** Las 20 variantes de Figma (Type × State), cada una con su texto "Text". */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className={`${SURFACE} p-6`}>
      <div role="region" tabIndex={0} aria-label="Matriz de Chip" className="max-w-full overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(5,auto)] items-center justify-items-start gap-x-8 gap-y-4">
          <span />
          {STATES.map((s) => (
            <span key={s.state} className="text-xs text-ds-text-neutral-gray">{s.state}</span>
          ))}
          {TYPES.map((t) => (
            <div key={t.type} className="contents">
              <span className="text-xs text-ds-text-neutral-gray">{t.type}</span>
              {STATES.map((s) => (
                <span key={s.state} className="inline-flex p-1">
                  <Chip
                    type={t.type}
                    state={s.state}
                    color={DOT_BY_STATE[s.state]}
                    avatar={<Avatar variant="initials" name="Hugo García" />}
                    onClick={() => {}}
                    onRemove={() => {}}
                    className={t.type === 'primary-box' ? 'w-[82px]' : undefined}
                    rootProps={{ 'data-figma': `Type=${t.figma}, State=${s.figma}` }}
                  >
                    Text
                  </Chip>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

const PLUS: { state: ChipPlusState; figma: string; open?: boolean }[] = [
  { state: 'default', figma: 'State=Default, Size=lg' },
  { state: 'hover', figma: 'State=Default, Size=lg' },
  { state: 'focus', figma: 'State=Default, Size=lg' },
  { state: 'select', figma: 'State=Hover, Size=lg', open: true },
  { state: 'inactive', figma: 'State=Default, Size=lg' },
];

/**
 * Las 5 variantes de "Chips plus". El set tiene errores en Figma (cuatro variantes se llaman
 * "State=Default, Size=lg" y solo Size=lg): aquí se asignan por aspecto, Default (trazo), Hover y Focus
 * (relleno + trazo), Select (menú abierto, la variante "Hover" de Figma) e Inactive.
 */
export const FigmaMatrixPlus: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className={`${SURFACE} p-6`}>
      <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
        {PLUS.map((p) => (
          <div key={p.state} data-figma={p.figma} className="relative inline-flex flex-col items-center gap-2">
            <ChipPlus count={2} state={p.state} />
            {p.open && (
              <DropdownMenuPanel aria-label="Chips ocultos" className="absolute top-9 right-0 z-10 w-[200px] max-w-none">
                {['1', '2', '3', '4'].map((t) => (
                  <DropdownMenuItem key={t} type="checkbox">Text item</DropdownMenuItem>
                ))}
              </DropdownMenuPanel>
            )}
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Test: alternancia con teclado y nombre accesible del botón de quitar. */
export const ToggleTest: Story = {
  tags: ['!autodocs'],
  render: () => {
    const onRemove = fn();
    return (
      <div>
        <Chip data-testid="info">Informativo</Chip>
        <Chip defaultSelected={false} onRemove={onRemove}>Frágil</Chip>
        <Chip disabled onClick={() => {}} onRemove={onRemove}>Apagado</Chip>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Frágil' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByRole('button', { name: 'Quitar Frágil' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Quitar Apagado' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Apagado' })).toBeDisabled();
  },
};

/** Test: radiogroup con una parada de tabulación; las flechas seleccionan y saltan los deshabilitados. */
export const GroupSingleTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <ChipGroup aria-label="Tamaño" selectionMode="single" defaultValue={['a']}>
      <Chip value="a" icon={false}>Uno</Chip>
      <Chip value="b" icon={false} disabled>Dos</Chip>
      <Chip value="c" icon={false}>Tres</Chip>
    </ChipGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('radiogroup', { name: 'Tamaño' });
    await expect(group).toBeInTheDocument();
    const uno = canvas.getByRole('radio', { name: 'Uno' });
    const tres = canvas.getByRole('radio', { name: 'Tres' });
    await expect(uno).toHaveAttribute('aria-checked', 'true');
    await expect(tres).toHaveAttribute('tabindex', '-1');
    await userEvent.tab();
    await expect(uno).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tres).toHaveFocus();
    await expect(tres).toHaveAttribute('aria-checked', 'true');
    await expect(uno).toHaveAttribute('aria-checked', 'false');
    await userEvent.keyboard('{ArrowRight}');
    await expect(uno).toHaveFocus();
  },
};

/** Test: quitar con Supr mueve el foco al vecino; el "+N" abre la lista con casillas. */
export const GroupMultipleTest: Story = {
  tags: ['!autodocs'],
  render: function Render() {
    const [tags, setTags] = useState(['a', 'b', 'c']);
    return (
      <div>
        <ChipGroup aria-label="Quitables">
          {tags.map((t) => (
            <Chip key={t} icon={false} onRemove={() => setTags((c) => c.filter((x) => x !== t))}>
              {t}
            </Chip>
          ))}
        </ChipGroup>
        <ChipGroup aria-label="Con límite" selectionMode="multiple" max={1}>
          <Chip value="x" icon={false}>X</Chip>
          <Chip value="y" icon={false}>Y</Chip>
          <Chip value="z" icon={false}>Z</Chip>
        </ChipGroup>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Quitar b' }));
    await expect(canvas.queryByText('b')).toBeNull();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Quitar c' })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Ver +2 más' }));
    const item = await within(document.body).findByRole('menuitemcheckbox', { name: 'Y' });
    await userEvent.click(item);
    await expect(item).toHaveAttribute('aria-checked', 'true');
  },
};

/** Test: toda la cápsula es el área de clic del cuerpo y Quitar tiene 24 × 24 por encima (WCAG 2.5.8). */
export const HitAreaTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="p-6">
      <Chip defaultSelected={false} onRemove={() => {}}>
        Frágil
      </Chip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = canvas.getByRole('button', { name: 'Frágil' });
    const close = canvas.getByRole('button', { name: 'Quitar Frágil' });
    const root = body.closest('[data-chip-root]')!.getBoundingClientRect();
    // Padding de la cápsula (izquierda, arriba y abajo): cae en el cuerpo
    for (const [x, y] of [
      [root.left + 6, root.top + root.height / 2],
      [root.left + root.width / 2 - 10, root.top + 2],
      [root.left + root.width / 2 - 10, root.bottom - 2],
    ]) {
      const hit = document.elementFromPoint(x, y);
      await expect(hit && body.contains(hit)).toBe(true);
    }
    const c = close.getBoundingClientRect();
    await expect(Math.round(c.width)).toBe(24);
    await expect(Math.round(c.height)).toBe(24);
    const hitClose = document.elementFromPoint(c.left + 2, c.top + c.height / 2);
    await expect(hitClose && close.contains(hitClose)).toBe(true);
    await userEvent.pointer({ keys: '[MouseLeft]', target: body });
    await expect(body).toHaveAttribute('aria-pressed', 'true');
  },
};

/** Test: al quitar el último chip el foco va al grupo (no se pierde en `body`). */
export const EmptyGroupFocusTest: Story = {
  tags: ['!autodocs'],
  render: GroupRemovable.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'Etiquetas del envío' });
    for (const t of ['Frágil', 'Urgente', 'Interno']) {
      await userEvent.click(canvas.getByRole('button', { name: `Quitar ${t}` }));
    }
    await waitFor(() => expect(group).toHaveFocus());
    await userEvent.tab();
    await expect(group).not.toHaveAttribute('tabindex');
  },
};

/** Test: selección múltiple como barra de herramientas (APG Toolbar) y acciones de los chips ocultos en `none`. */
export const ToolbarAndOverflowActionsTest: Story = {
  tags: ['!autodocs'],
  render: function Render() {
    const [last, setLast] = useState('');
    return (
      <div className="flex flex-col gap-4">
        <ChipGroup aria-label="Servicios" selectionMode="multiple">
          <Chip value="a" icon={false}>A</Chip>
          <Chip value="b" icon={false}>B</Chip>
        </ChipGroup>
        <ChipGroup aria-label="Filtros" max={1}>
          <Chip icon={false} onClick={() => setLast('uno')}>Uno</Chip>
          <Chip icon={false} onClick={() => setLast('dos')}>Dos</Chip>
          <Chip icon={false} onRemove={() => {}}>Tres</Chip>
        </ChipGroup>
        <p data-testid="last">{last}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('toolbar', { name: 'Servicios' })).toBeInTheDocument();
    // El chip con onRemove no se oculta; el oculto con onClick es un ítem de menú con esa acción
    await expect(canvas.getByRole('button', { name: 'Quitar Tres' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Ver +1 más' }));
    const item = await within(document.body).findByRole('menuitem', { name: 'Dos' });
    await userEvent.click(item);
    await expect(canvas.getByTestId('last')).toHaveTextContent('dos');
  },
};
