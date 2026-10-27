import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ProfileCard } from './ProfileCard';
import type { ProfileCardLayout, ProfileCardProps, ProfileCardStat } from './ProfileCard.types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { BrandLogo } from '../Avatar/assets/BrandLogo';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconStar } from '../Rating';
import { Tag } from '../Tag';

const LAYOUT_OPTIONS = ['vertical', 'horizontal', 'full', 'centered'] as const satisfies readonly ProfileCardLayout[];
const HEADING_OPTIONS = [2, 3, 4, 5, 6, 'none'] as const;

/** Ancho de Figma por disposición (hero es fluido). */
const WIDTH: Record<ProfileCardLayout, string> = {
  vertical: 'w-full max-w-[352px]',
  horizontal: 'w-full max-w-[352px]',
  full: 'w-full',
  hero: 'w-full',
  centered: 'w-full max-w-[321px]',
};

const meta = {
  title: 'Data Display/ProfileCard',
  component: ProfileCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story, { args, parameters }) =>
      parameters.fullWidth ? (
        <Story />
      ) : (
        <div className={WIDTH[(args.layout as ProfileCardLayout | undefined) ?? 'vertical']}>
          <Story />
        </div>
      ),
  ],
  argTypes: {
    layout: {
      control: 'inline-radio',
      options: LAYOUT_OPTIONS,
      type: { name: 'enum', value: [...LAYOUT_OPTIONS] },
      description: 'Type de Figma: Standar vertical, Standar horizontal, Full / Hero, Qualification (centered)',
    },
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Title de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Prop Description de Figma' },
    rating: { control: { type: 'number', min: 0, max: 5, step: 0.1 }, type: { name: 'number' } },
    stars: { control: { type: 'number', min: 0, max: 5, step: 1 }, type: { name: 'number' } },
    headingLevel: {
      control: 'select',
      options: HEADING_OPTIONS,
      type: { name: 'enum', value: [...HEADING_OPTIONS] },
    },
    selection: {
      control: 'inline-radio',
      options: ['checkbox', 'radio'],
      type: { name: 'enum', value: ['checkbox', 'radio'] },
    },
  },
  args: {
    layout: 'vertical',
    title: 'Ana Pérez',
    subtitle: ['Diseñadora de interiores', 'Medellín'],
    description: 'Proyectos de vivienda y locales pequeños. Diez años de experiencia y visitas a domicilio.',
    rating: 4.5,
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const photo = (alt?: string) => <Avatar variant="photo" size="lg" src={PHOTO_SRC.Woman_1} alt={alt} />;
const brand = <Avatar variant="brand" size="lg" logo={<BrandLogo />} />;

const realTags = (
  <>
    <Tag iconLeft={false}>Interiores</Tag>
    <Tag iconLeft={false}>Remodelación</Tag>
  </>
);

const realStats: ProfileCardStat[] = [
  { value: 128, label: 'Ventas' },
  { value: 54, label: 'Reseñas' },
  { value: '4,5', label: 'Calificaciones', icon: <IconStar state="select" size={16} /> },
];

/** Controles: todas las piezas, para jugar con `layout`. */
export const Interactive: Story = {
  args: { selection: 'checkbox', stars: 4 },
  render: (args) => (
    <ProfileCard
      {...args}
      leading={photo()}
      tags={realTags}
      stats={args.layout === 'full' || args.layout === 'centered' ? realStats : undefined}
      onMoreClick={args.layout === 'full' ? () => {} : undefined}
      actions={
        <Button variant={args.layout === 'vertical' || args.layout === 'horizontal' ? 'secondary' : 'primary'} size="sm" aria-label="Contactar a Ana Pérez">
          Contactar
        </Button>
      }
    />
  ),
};

/** Standar vertical: avatar arriba, selección en el Button corner y una acción. */
function ControlledVertical(args: ProfileCardProps) {
  const [checked, setChecked] = useState(false);
  return (
    <ProfileCard
      {...args}
      layout="vertical"
      leading={photo()}
      tags={realTags}
      selection="checkbox"
      checked={checked}
      onCheckedChange={setChecked}
      actions={
        <Button variant="secondary" size="sm" aria-label="Contactar a Ana Pérez">
          Contactar
        </Button>
      }
    />
  );
}

export const Vertical: Story = {
  render: (args) => <ControlledVertical {...args} />,
};

/** Standar horizontal: avatar a la izquierda; el nombre deja libre el Button corner. */
export const Horizontal: Story = {
  args: { layout: 'horizontal' },
  render: (args) => (
    <ProfileCard
      {...args}
      leading={photo()}
      tags={realTags}
      selection="checkbox"
      actions={
        <Button variant="secondary" size="sm" aria-label="Contactar a Ana Pérez">
          Contactar
        </Button>
      }
    />
  ),
};

/**
 * Full / Hero con las acciones (prop Icon buttons de Figma) y más opciones. Bajo 42rem de ancho pasa a la versión
 * Mobile (cambia el ancho del lienzo para verlo).
 */
export const Hero: Story = {
  args: {
    layout: 'full',
    title: 'Librería Central',
    subtitle: ['Libros y papelería', 'Cali'],
    description: 'Libros nuevos y usados, pedidos especiales y envío a todo el país.',
    rating: undefined,
  },
  render: (args) => (
    <ProfileCard
      {...args}
      leading={brand}
      tags={realTags}
      stats={realStats}
      onMoreClick={() => {}}
      actions={
        <>
          <Button variant="secondary" size="sm" iconOnly aria-label="Compartir perfil de Librería Central">
            <Icon name="export2" />
          </Button>
          <Button variant="secondary" size="sm" iconOnly aria-label="Editar perfil de Librería Central">
            <Icon name="edit" />
          </Button>
          <Button variant="primary" size="sm" aria-label="Seguir a Librería Central">
            Seguir
          </Button>
        </>
      }
    />
  ),
};

/** Hero en un contenedor angosto: versión Mobile de Figma. */
export const HeroMobile: Story = {
  ...Hero,
  parameters: { fullWidth: true },
  decorators: [
    (Story) => (
      <div className="w-[376px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

/** Qualification: centrada, con la calificación en estrellas y los contadores. */
export const Centered: Story = {
  args: { layout: 'centered', stars: 4 },
  render: (args) => (
    <ProfileCard
      {...args}
      leading={photo()}
      stats={realStats}
      actions={
        <Button variant="primary" size="sm" aria-label="Contactar a Ana Pérez">
          Contactar
        </Button>
      }
    />
  ),
};

/** Lista de selección única: Radio en el Button corner, agrupados por `name`. */
export const RadioSelection: Story = {
  parameters: { fullWidth: true },
  render: () => <RadioList />,
};

function RadioList() {
  const [selected, setSelected] = useState('ana');
  const people = [
    { id: 'ana', name: 'Ana Pérez', photo: PHOTO_SRC.Woman_1 },
    { id: 'hugo', name: 'Hugo García', photo: PHOTO_SRC.Men_1 },
  ];
  return (
    <fieldset className="m-0 flex flex-wrap gap-6 border-0 p-0">
      <legend className="sr-only">Profesional asignado</legend>
      {people.map((p) => (
        <div key={p.id} className="w-full max-w-[352px]">
          <ProfileCard
            title={p.name}
            subtitle={['Diseño de interiores', 'Medellín']}
            leading={<Avatar variant="photo" size="lg" src={p.photo} />}
            rating={4.5}
            selection="radio"
            name="profesional"
            value={p.id}
            checked={selected === p.id}
            onCheckedChange={(on) => on && setSelected(p.id)}
          />
        </div>
      ))}
    </fieldset>
  );
}

const FIGMA: Pick<ProfileCardProps, 'title' | 'subtitle'> = {
  title: 'Titulo',
  subtitle: ['Bogotá D.C', 'Bogotá D.C'],
};
const FIGMA_LOREM = 'Lorem ipsum dolor sit amet consectetur. Tempus ornare maecenas integer viverra vitae faucibus. ';
const FIGMA_SHOP =
  'Tienda oficial de artículos de papelería y oficina. Adquiere los productos originales y recíbelos con envío directo a todo el país.';
const figmaTags = (
  <>
    <Tag iconLeft={false} data-figma-part="Text">
      Text
    </Tag>
    <Tag iconLeft={false} data-figma-part="Text">
      Text
    </Tag>
  </>
);
const figmaStats: ProfileCardStat[] = [
  { value: 0, label: 'Ventas' },
  { value: 0, label: 'Reseñas' },
  { value: 0, label: 'Calificaciones', icon: <IconStar state="select" size={16} /> },
];

/** Las 4 variantes del set 12995:3291 con los textos de Figma. `figma` pone `data-figma` (solo una copia lo lleva). */
function MatrixCards({ figma }: { figma: boolean }) {
  const d = (name: string) => (figma ? name : undefined);
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-wrap items-start gap-6">
        <div className="w-[352px]">
          <ProfileCard
            data-figma={d('Type=Standar vertical')}
            {...FIGMA}
            layout="vertical"
            leading={photo()}
            rating={4.5}
            tags={figmaTags}
            description={FIGMA_LOREM}
            selection="checkbox"
            actions={
              <Button variant="secondary" size="sm" data-figma-part="Button">
                Button
              </Button>
            }
          />
        </div>
        <div className="w-[352px]">
          <ProfileCard
            data-figma={d('Type=Standar horizontal')}
            {...FIGMA}
            layout="horizontal"
            leading={photo()}
            rating={4.5}
            tags={figmaTags}
            description={FIGMA_LOREM}
            selection="checkbox"
            actions={
              <Button variant="secondary" size="sm" data-figma-part="Button">
                Button
              </Button>
            }
          />
        </div>
        <div className="w-[321px]">
          <ProfileCard
            data-figma={d('Type=Qualification')}
            {...FIGMA}
            layout="centered"
            leading={photo()}
            rating={4.5}
            stars={0}
            description={FIGMA_SHOP}
            stats={figmaStats}
            actions={
              <Button variant="primary" size="sm" data-figma-part="Button">
                Button
              </Button>
            }
          />
        </div>
      </div>
      <div className="w-[1534px]">
        <ProfileCard
          data-figma={d('Type=Full')}
          {...FIGMA}
          layout="full"
          leading={brand}
          description={FIGMA_SHOP}
          tags={figmaTags}
          stats={figmaStats}
          onMoreClick={() => {}}
        />
      </div>
    </div>
  );
}

/**
 * Cada variante de Figma una vez (con `data-figma`) sobre background/general/black. Debajo, solo para revisar a ojo,
 * las mismas tarjetas sobre background/container/default-on-card: ahí la superficie de vertical y horizontal
 * (default-on-card) se funde, y sobre el negro se ven mejor la muesca y el Button corner.
 */
export const FigmaMatrix: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de ProfileCard" className="max-w-full overflow-x-auto">
        <div className="w-max">
          <MatrixCards figma />
          <p className="mt-6 mb-2 text-xs text-ds-text-neutral-body">
            Revisión a ojo sobre background/container/default-on-card (sin data-figma)
          </p>
          <div className="bg-ds-background-container-default-on-card p-6">
            <MatrixCards figma={false} />
          </div>
        </div>
      </div>
    </div>
  ),
};

/** Test: artículo nombrado por la persona, calificación legible y selección real con teclado. */
export const SelectionTest: Story = {
  tags: ['!autodocs'],
  args: { onCheckedChange: fn() },
  render: (args) => (
    <ProfileCard
      {...args}
      layout="vertical"
      leading={photo()}
      selection="checkbox"
      actions={
        <Button variant="secondary" size="sm" aria-label="Contactar a Ana Pérez">
          Contactar
        </Button>
      }
    />
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const article = canvas.getByRole('article', { name: 'Ana Pérez' });
    await expect(canvas.getByRole('heading', { level: 3, name: 'Ana Pérez' })).toBeInTheDocument();
    await expect(article).toHaveTextContent(/4,5\s*de 5 estrellas/);
    const box = canvas.getByRole('checkbox', { name: 'Seleccionar Ana Pérez' });
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Contactar a Ana Pérez' })).toHaveFocus();
    await userEvent.tab();
    await expect(box).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(box).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

/** Test: hero con más opciones nombrado por la tienda y contadores como lista de definiciones. */
export const HeroTest: Story = {
  ...Hero,
  tags: ['!autodocs'],
  args: { ...Hero.args, onMoreClick: fn(), headingLevel: 2 },
  render: (args) => <ProfileCard {...args} leading={brand} stats={realStats} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2, name: 'Librería Central' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Más opciones de Librería Central' }));
    await expect(args.onMoreClick).toHaveBeenCalledTimes(1);
    const terms = canvas.getAllByRole('term').map((t) => t.textContent);
    await expect(terms).toEqual(['Ventas', 'Reseñas', 'Calificaciones']);
    await expect(canvas.getAllByRole('definition')[0]).toHaveTextContent('128');
  },
};

/** Test: la fila de estrellas de Qualification se lee como imagen con el puntaje. */
export const CenteredTest: Story = {
  ...Centered,
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: '4 de 5 estrellas' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Contactar a Ana Pérez' })).toBeInTheDocument();
  },
};
