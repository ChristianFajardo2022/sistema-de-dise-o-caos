import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Avatar } from './Avatar';
import { AvatarGroup } from './AvatarGroup';
import { AvatarPlus } from './AvatarPlus';
import { DropdownMenu, DropdownMenuItem } from '../DropdownMenu';
import type { AvatarColor, AvatarContrast, AvatarSize, AvatarState, AvatarVariant } from './Avatar.types';
import { PhotoSample, SampleLogo } from './Avatar.samples';
import { PHOTO_SRC, SAMPLE_PHOTO_SRC } from './Avatar.sample-data';
import type { PhotoName } from './Avatar.sample-data';

const VARIANT_OPTIONS: AvatarVariant[] = ['initials', 'user', 'photo', 'brand', 'icon'];
const SIZE_OPTIONS: AvatarSize[] = ['xs', 'sm', 'md', 'lg'];
const COLOR_OPTIONS: AvatarColor[] = ['purple', 'yellow', 'blue', 'green', 'red'];
const CONTRAST_OPTIONS: AvatarContrast[] = ['on-canva', 'on-card'];

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  subcomponents: { AvatarGroup, AvatarPlus },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      name: 'variant',
      control: 'radio',
      options: VARIANT_OPTIONS,
      type: { name: 'enum', value: VARIANT_OPTIONS },
      description: 'Type de Figma: iniciales, silueta, foto, logo o ícono',
    },
    size: {
      name: 'size',
      control: 'radio',
      options: SIZE_OPTIONS,
      type: { name: 'enum', value: SIZE_OPTIONS },
      description: 'Diámetro: xs 24, sm 32, md 48, lg 56',
    },
    color: {
      name: 'color',
      control: 'select',
      options: COLOR_OPTIONS,
      type: { name: 'enum', value: COLOR_OPTIONS },
      description: 'Color de initials y user',
    },
    contrast: {
      name: 'contrast',
      control: 'radio',
      options: CONTRAST_OPTIONS,
      type: { name: 'enum', value: CONTRAST_OPTIONS },
      description: 'Contrast de brand e icon',
    },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Aspecto Disabled (solo visual)' },
    inactive: { control: 'boolean', type: { name: 'boolean' }, description: 'State Inactive de icon (Disabled de brand)' },
    selected: { control: 'boolean', type: { name: 'boolean' }, description: 'State Select de icon' },
    state: {
      name: 'state',
      control: 'radio',
      options: ['default', 'hover', 'select', 'inactive'],
      type: { name: 'enum', value: ['default', 'hover', 'select', 'inactive'] },
      description: 'Fuerza el State de icon (solo documentación)',
    },
    badge: { control: 'boolean', type: { name: 'boolean' }, description: 'Indicador de estado (lg y md)' },
    name: { control: 'text', type: { name: 'string' }, description: 'Nombre completo: iniciales y nombre accesible' },
    alt: { control: 'text', type: { name: 'string' }, description: 'Texto alternativo de photo' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible de user, brand e icon' },
    badgeLabel: { control: 'text', type: { name: 'string' }, description: 'Texto sr-only del indicador' },
  },
  args: {
    variant: 'initials',
    size: 'lg',
    color: 'purple',
    contrast: 'on-canva',
    disabled: false,
    badge: true,
    name: 'Hugo García',
    badgeLabel: 'En línea',
  },
  // Al cambiar variant desde los controles, brand y photo necesitan contenido: se usa el de muestra
  render: (args) => (
    <Avatar
      {...args}
      logo={args.logo ?? (args.variant === 'brand' ? <SampleLogo /> : undefined)}
      src={args.src ?? (args.variant === 'photo' && args.children == null ? SAMPLE_PHOTO_SRC : undefined)}
      alt={args.alt ?? (args.variant === 'photo' ? args.name : undefined)}
      label={args.label ?? (args.variant === 'brand' ? 'Marca' : undefined)}
    />
  ),
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: { variant: 'photo', alt: 'Hugo García', src: SAMPLE_PHOTO_SRC },
};

export const Initials: Story = {};

export const User: Story = { args: { variant: 'user', color: 'blue', label: 'Hugo García' } };

export const Photo: Story = {
  render: (args) => (
    <Avatar {...args} variant="photo" alt="Hugo García">
      <PhotoSample name="Woman_1" />
    </Avatar>
  ),
};

export const Brand: Story = {
  args: { variant: 'brand', badge: false, label: 'Marca de ejemplo' },
  render: (args) => <Avatar {...args} logo={<SampleLogo />} />,
};

export const IconAvatar: Story = { args: { variant: 'icon', badge: false, label: 'Carpeta', icon: 'folder' } };

/** Nombres de ejemplo (inventados) para las fotos de muestra */
const SAMPLE_NAMES: Record<PhotoName, string> = {
  Woman_1: 'Laura Méndez',
  Woman_2: 'Sofía Ramírez',
  Woman_3: 'Valentina Ortiz',
  Woman_4: 'Camila Torres',
  Men_1: 'Andrés Rojas',
  Men_2: 'Diego Castro',
  Men_3: 'Mateo Vargas',
  Men_4: 'Samuel Pineda',
  Disabled: 'Tomás Herrera',
};

export const Group: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex min-h-64 w-[28rem] max-w-full justify-end p-4">
      <AvatarGroup aria-label="Participantes" max={4}>
        {(['Woman_1', 'Woman_2', 'Men_1', 'Men_2', 'Woman_3', 'Men_3'] as PhotoName[]).map((p) => (
          <Avatar key={p} variant="photo" alt={SAMPLE_NAMES[p]}>
            <PhotoSample name={p} />
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  ),
};

/**
 * El "+2" abre la lista de los avatares ocultos (Dropdown menu Simple, Item=Avatar de Figma): avatar de 24
 * (foto, o iniciales con su color) y nombre. Aquí se abre al cargar para verla; en uso normal se abre con clic, Enter o Espacio.
 */
export const GroupOverflowMenu: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex min-h-64 w-[28rem] max-w-full justify-end p-4">
      <AvatarGroup aria-label="Participantes" max={3}>
        <Avatar variant="photo" alt="Ana Bernal">
          <PhotoSample name="Woman_2" />
        </Avatar>
        <Avatar variant="photo" alt="Carlos Duarte">
          <PhotoSample name="Men_2" />
        </Avatar>
        <Avatar variant="photo" alt="Fabiola Gil">
          <PhotoSample name="Woman_3" />
        </Avatar>
        <Avatar variant="photo" alt="Hugo García">
          <PhotoSample name="Men_1" />
        </Avatar>
        <Avatar variant="initials" color="green" name="Angélica Chávez" />
      </AvatarGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Ver +2 más' }));
  },
};

/* ---------------------------------- Matrices ---------------------------------- */

const LABEL = 'text-xs text-ds-text-neutral-body';
const SURFACE = 'bg-ds-background-general-black p-6';

const COLORS: { color: AvatarColor | 'disabled'; figma: string }[] = [
  { color: 'purple', figma: 'Purple' },
  { color: 'blue', figma: 'Blue' },
  { color: 'yellow', figma: 'Yellow' },
  { color: 'green', figma: 'Green' },
  { color: 'disabled', figma: 'Disabled' },
  { color: 'red', figma: 'Red' },
];
const SIZES_4: { size: AvatarSize; figma: string }[] = [
  { size: 'lg', figma: 'lg' },
  { size: 'md', figma: 'md' },
  { size: 'sm', figma: 'sm' },
  { size: 'xs', figma: 'xs' },
];
/** Brand e icon: Figma nombra md, sm y xs a lo que aquí es lg, md y sm. */
const SIZES_PILL: { size: AvatarSize; figma: string }[] = [
  { size: 'lg', figma: 'md' },
  { size: 'md', figma: 'sm' },
  { size: 'sm', figma: 'xs' },
];

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className={SURFACE}>
      <div role="region" tabIndex={0} aria-label="Matriz de Avatar" className="max-w-full overflow-x-auto">{children}</div>
    </div>
  );
}

/** Set "Avatar" (Type Text, Photo, Brand, Icon; 56): envoltorio de cada átomo, como en Figma. */
export const FigmaMatrixAvatar: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Frame>
      <div className="flex items-center gap-8">
        <div data-figma="Type=Photo" className="inline-flex gap-2.5">
          <Avatar variant="photo" size="lg" badge alt="Hugo García" badgeLabel="En línea">
            <PhotoSample name="Woman_1" />
          </Avatar>
        </div>
        <div data-figma="Type=Brand" className="inline-flex gap-2.5">
          <Avatar variant="brand" size="lg" label="Marca de ejemplo" logo={<SampleLogo />} />
        </div>
        <div data-figma="Type=Text" className="inline-flex gap-2.5">
          <Avatar variant="initials" size="lg" badge name="Hugo García" badgeLabel="En línea" />
        </div>
        <div data-figma="Type=User" className="inline-flex gap-2.5">
          <Avatar variant="user" size="lg" badge label="Hugo García" badgeLabel="En línea" />
        </div>
        <div data-figma="Type=Icon" className="inline-flex gap-2.5">
          <Avatar variant="icon" size="lg" contrast="on-card" label="Carpeta" />
        </div>
      </div>
    </Frame>
  ),
};

/** Set "Avatar colors": Type Names/User × Size × Color (48 variantes). Badge en lg y md, salvo Disabled. */
export const FigmaMatrixAvatarColors: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Frame>
      <div className="grid grid-cols-[auto_repeat(8,auto)] items-center justify-items-start gap-x-8 gap-y-4">
        <span />
        {(['Names', 'User'] as const).flatMap((t) => SIZES_4.map((s) => <span key={t + s.size} className={LABEL}>{t} {s.size}</span>))}
        {COLORS.map((c) => (
          <div key={c.figma} className="contents">
            <span className={LABEL}>{c.figma}</span>
            {(['Names', 'User'] as const).flatMap((t) =>
              SIZES_4.map((s) => (
                <Avatar
                  key={t + s.size}
                  variant={t === 'Names' ? 'initials' : 'user'}
                  size={s.size}
                  color={c.color === 'disabled' ? undefined : c.color}
                  disabled={c.color === 'disabled'}
                  badge
                  badgeLabel="En línea"
                  name="Hugo García"
                  data-figma={`Type=${t}, Size=${s.figma}, Color=${c.figma}`}
                />
              ))
            )}
          </div>
        ))}
      </div>
    </Frame>
  ),
};

/** Set "Avatar photo": Size xs-lg con indicador en lg y md. */
export const FigmaMatrixAvatarPhoto: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Frame>
      <div className="flex items-center gap-8">
        {SIZES_4.map((s) => (
          <Avatar
            key={s.size}
            variant="photo"
            size={s.size}
            badge
            badgeLabel="En línea"
            alt="Hugo García"
            data-figma={`Size=${s.figma}`}
          >
            <PhotoSample name="Woman_1" />
          </Avatar>
        ))}
      </div>
    </Frame>
  ),
};

const SURFACES: { contrast: AvatarContrast; figma: string; bg: string }[] = [
  { contrast: 'on-canva', figma: 'On Canva', bg: 'bg-ds-background-container-default-on-canva' },
  { contrast: 'on-card', figma: 'On Card', bg: 'bg-ds-background-container-default-on-card' },
];

function BrandMatrix() {
  return (
    <div className="flex flex-col">
      {SURFACES.map((sf) => (
        <div key={sf.contrast} className={`${sf.bg} flex flex-col gap-4 p-6`}>
          <span className={LABEL}>{sf.figma}</span>
          {[false, true].map((disabled) => (
            <div key={String(disabled)} className="flex items-center gap-8">
              <span className={LABEL}>{disabled ? 'Disabled' : 'Default'}</span>
              {SIZES_PILL.map((s) => (
                <Avatar
                  key={s.size}
                  variant="brand"
                  size={s.size}
                  contrast={sf.contrast}
                  inactive={disabled}
                  label="Marca de ejemplo"
                  logo={<SampleLogo />}
                  data-figma={`Contrast=${sf.figma}, State=${disabled ? 'Disabled' : 'Default'}, Size=${s.figma}`}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Avatar icon: Figma nombra md, sm y xs a lo que aquí es lg, md y sm (56, 48 y 40). */
const ICON_SIZES: { size: AvatarSize; figma: string }[] = [
  { size: 'lg', figma: 'md' },
  { size: 'md', figma: 'sm' },
  { size: 'sm', figma: 'xs' },
];
const ICON_STATES: { state: AvatarState; figma: string }[] = [
  { state: 'default', figma: 'Default' },
  { state: 'hover', figma: 'Hover' },
  { state: 'select', figma: 'Select' },
  { state: 'inactive', figma: 'Inactive' },
];
const ICON_SURFACES: { contrast: AvatarContrast; figma: string; bg: string }[] = [
  { contrast: 'on-canva', figma: 'On canva', bg: 'bg-ds-background-container-default-on-canva' },
  { contrast: 'on-card', figma: 'On card', bg: 'bg-ds-background-container-default-on-card' },
];

function IconMatrix() {
  return (
    <div className="flex flex-col">
      {ICON_SURFACES.map((sf) => (
        <div key={sf.contrast} className={`${sf.bg} flex flex-col gap-4 p-6`}>
          <span className={LABEL}>{sf.figma}</span>
          {ICON_STATES.map((st) => (
            <div key={st.state} className="flex items-center gap-8">
              <span className={`${LABEL} w-16`}>{st.figma}</span>
              {ICON_SIZES.map((s) => (
                <Avatar
                  key={s.size}
                  variant="icon"
                  size={s.size}
                  contrast={sf.contrast}
                  // Select e Inactive también existen como props propias; aquí se fuerza por `state`
                  state={st.state === 'inactive' ? undefined : st.state}
                  inactive={st.state === 'inactive'}
                  selected={st.state === 'select'}
                  label="Carpeta"
                  data-figma={`Contrast=${sf.figma}, Size=${s.figma}, State=${st.figma}`}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Set "Avatar brand": Contrast × State × Size (12). Una superficie por Contrast. */
export const FigmaMatrixAvatarBrand: Story = {
  parameters: { layout: 'padded' },
  render: () => <BrandMatrix />,
};

/** Set "Avatar icon": Contrast × Size × State (24). Una superficie por Contrast. */
export const FigmaMatrixAvatarIcon: Story = {
  parameters: { layout: 'padded' },
  render: () => <IconMatrix />,
};

/**
 * Set "Avatar plus": Default y Hover. En Hover Figma muestra abierto el Dropdown menu (Simple, Item=Avatar) con los
 * avatares ocultos; aquí es el mismo `DropdownMenu` que usa `AvatarGroup`, abierto al cargar.
 */
export const FigmaMatrixAvatarPlus: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Frame>
      <div className="flex min-h-48 items-start gap-8 pl-52">
        <div data-figma="State=Default, Size=lg" className="inline-flex gap-2.5">
          <AvatarPlus count={2} />
        </div>
        <div data-figma="State=Hover, Size=lg" className="inline-flex gap-2">
          <DropdownMenu
            mode="list"
            aria-label="Personas ocultas"
            defaultOpen
            trigger={<AvatarPlus count={2} state="hover" />}
          >
            <DropdownMenuItem
              type="avatar"
              avatar={
                <span aria-hidden="true" className="inline-flex">
                  <Avatar variant="photo" size="xs" alt="Hugo García">
                    <PhotoSample name="Woman_1" />
                  </Avatar>
                </span>
              }
            >
              Hugo García
            </DropdownMenuItem>
            <DropdownMenuItem
              type="avatar"
              avatar={
                <span aria-hidden="true" className="inline-flex">
                  <Avatar variant="initials" size="xs" name="Ana Chávez" />
                </span>
              }
            >
              Ana Chávez
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      </div>
    </Frame>
  ),
};

const GROUP_COLORS: AvatarColor[] = ['purple', 'green', 'blue', 'yellow', 'red', 'purple', 'green'];
const GROUP_NAMES = ['Ana Bernal', 'Carlos Duarte', 'Fabiola Gil', 'Hugo Imbert', 'Julia Kent', 'Laura Mejia', 'Nora Ortiz'];
/** Figma: el grupo Photo usa Woman_1..4 y Men_1; los dos "+N" restantes no dibujan foto. */
const GROUP_PHOTOS: PhotoName[] = ['Woman_1', 'Woman_2', 'Woman_3', 'Woman_4', 'Men_1', 'Men_2', 'Men_3'];

/** Set "Avatar group": Type names, user y Photo (Size lg: avatares de 32 + "+2"). */
export const FigmaMatrixAvatarGroup: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Frame>
      <div className="flex flex-col items-start gap-12">
        <AvatarGroup data-figma="Type=names, Size=lg">
          {GROUP_NAMES.map((n, i) => (
            <Avatar key={n} variant="initials" color={GROUP_COLORS[i]} name={n} />
          ))}
        </AvatarGroup>
        <AvatarGroup data-figma="Type=user, Size=lg">
          {GROUP_NAMES.map((n, i) => (
            <Avatar key={n} variant="user" color={GROUP_COLORS[i]} label={n} />
          ))}
        </AvatarGroup>
        <AvatarGroup data-figma="Type=Photo, Size=lg">
          {GROUP_NAMES.map((n, i) => (
            <Avatar key={n} variant="photo" alt={n}>
              <PhotoSample name={GROUP_PHOTOS[i]} />
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </Frame>
  ),
};

/** Set "photos": las 9 fotos de Figma (102 × 68.53). Disabled es otra foto, en grises como en Figma. */
export const FigmaMatrixPhotos: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Frame>
      <div className="flex flex-wrap items-center gap-8">
        {(Object.keys(PHOTO_SRC) as PhotoName[]).map((p) => (
          <div
            key={p}
            data-figma={`Photo=${p}`}
            className={p === 'Disabled' ? 'overflow-hidden grayscale' : 'overflow-hidden'}
            style={{ width: 102, height: 68.53 }}
          >
            <PhotoSample name={p} />
          </div>
        ))}
      </div>
    </Frame>
  ),
};

/* ------------------------------------ Tests ------------------------------------ */

/** Test: nombre accesible de cada tipo y decorativos con aria-hidden */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <Avatar variant="initials" name="Hugo García" badge badgeLabel="En línea" data-testid="initials" />
      <Avatar variant="user" data-testid="user-decorative" />
      <Avatar variant="user" label="Angélica Chavez" />
      <Avatar variant="photo" alt="Retrato de Hugo" src={SAMPLE_PHOTO_SRC} />
      <Avatar variant="photo" src={SAMPLE_PHOTO_SRC} data-testid="photo-decorative" />
      <Avatar variant="photo" alt="Retrato con hijos" data-testid="photo-children">
        <PhotoSample name="Woman_1" />
      </Avatar>
      <Avatar variant="photo" data-testid="photo-children-decorative">
        <PhotoSample name="Woman_2" />
      </Avatar>
      <Avatar variant="icon" label="Carpeta" />
      <Avatar variant="brand" label="Marca de ejemplo" logo={<SampleLogo />} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Hugo García' })).toHaveTextContent('HG');
    await expect(canvas.getByTestId('initials')).toHaveTextContent('En línea');
    await expect(canvas.getByTestId('user-decorative').firstElementChild).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByRole('img', { name: 'Angélica Chavez' })).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: 'Retrato de Hugo' }).tagName).toBe('IMG');
    await expect(canvas.getByRole('img', { name: 'Carpeta' })).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: 'Marca de ejemplo' })).toBeInTheDocument();
    await expect(canvas.getByTestId('photo-decorative').firstElementChild).toHaveAttribute('aria-hidden', 'true');
    const withChildren = canvas.getByRole('img', { name: 'Retrato con hijos' });
    await expect(withChildren.tagName).toBe('SPAN');
    await expect(withChildren.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByTestId('photo-children-decorative').firstElementChild).toHaveAttribute('aria-hidden', 'true');
  },
};

const onOverflowClick = fn();

/** Test: el grupo recorta a max, resume el resto en "+N" y el botón responde a clic y teclado (cuenta las activaciones) */
export const GroupOverflowTest: Story = {
  tags: ['!autodocs'],
  args: { variant: 'initials' },
  beforeEach: () => {
    onOverflowClick.mockClear();
  },
  render: () => {
    return (
      <AvatarGroup aria-label="Participantes" max={3} overflowMenu={false} onOverflowClick={onOverflowClick} data-testid="group">
        {['Ana Bernal', 'Carlos Duarte', 'Fabiola Gil', 'Hugo Imbert', 'Julia Kent'].map((n) => (
          <Avatar key={n} name={n} />
        ))}
      </AvatarGroup>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Participantes' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('img')).toHaveLength(3);
    const plus = canvas.getByRole('button', { name: 'Ver +2 más' });
    await expect(plus).toHaveTextContent('+2');
    await userEvent.tab();
    await expect(plus).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(onOverflowClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(onOverflowClick).toHaveBeenCalledTimes(2);
    await userEvent.click(plus);
    await expect(onOverflowClick).toHaveBeenCalledTimes(3);
    await expect(canvas.queryByRole('list')).toBeNull();
  },
};

/** Test: el "+N" abre con Enter la lista de ocultos (con nombre), Esc la cierra y el foco sigue en el "+N" */
export const GroupOverflowMenuTest: Story = {
  tags: ['!autodocs'],
  beforeEach: () => {
    onOverflowClick.mockClear();
  },
  render: () => (
    <AvatarGroup aria-label="Participantes" max={2} onOverflowClick={onOverflowClick}>
      <Avatar name="Ana Bernal" />
      <Avatar name="Carlos Duarte" />
      <Avatar variant="photo" alt="Fabiola Gil">
        <PhotoSample name="Woman_1" />
      </Avatar>
      <Avatar variant="initials" color="blue" name="Hugo Imbert" />
      <Avatar variant="user" />
    </AvatarGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const plus = canvas.getByRole('button', { name: 'Ver +3 más' });
    await expect(canvas.queryByRole('list')).toBeNull();
    await userEvent.tab();
    await expect(plus).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(plus).toHaveAttribute('aria-expanded', 'true');
    await expect(onOverflowClick).toHaveBeenCalledTimes(1);
    const list = await canvas.findByRole('list', { name: 'Personas ocultas' });
    const items = within(list).getAllByRole('listitem');
    await expect(items).toHaveLength(3);
    await expect(items[0]).toHaveTextContent('Fabiola Gil');
    await expect(items[1]).toHaveTextContent('Hugo Imbert');
    await expect(items[2]).toHaveTextContent('Persona sin nombre');
    await userEvent.keyboard('{Escape}');
    await expect(plus).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('list')).toBeNull();
    await expect(plus).toHaveFocus();
  },
};

/** Test: sin desbordar no hay "+N"; el indicador solo existe en lg y md y no en disabled */
export const BadgeRulesTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <AvatarGroup max={5} data-testid="group-small">
        <Avatar name="Ana Bernal" />
        <Avatar name="Carlos Duarte" />
      </AvatarGroup>
      <Avatar name="Ana Bernal" badge badgeLabel="Ocupada" size="md" data-testid="md" />
      <Avatar name="Ana Bernal" badge badgeLabel="Ocupada" size="sm" data-testid="sm" />
      <Avatar name="Ana Bernal" badge badgeLabel="Ocupada" disabled data-testid="disabled" />
      <Avatar name="Ana Bernal" badge badgeLabel="En línea" badgeState="success" size="md" data-testid="online" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvas.getByTestId('md')).toHaveTextContent('Ocupada');
    await expect(canvas.getByTestId('sm')).not.toHaveTextContent('Ocupada');
    await expect(canvas.getByTestId('disabled')).not.toHaveTextContent('Ocupada');
    // badgeState cambia el color del indicador; sin él queda el de siempre
    const dot = (id: string) => getComputedStyle(canvas.getByTestId(id).querySelector('[data-figma-part="Badge"] [data-figma-part="Badge"]')!).backgroundColor;
    await expect(dot('online')).not.toBe(dot('md'));
  },
};
