import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { InformationCard } from './InformationCard';
import type { InformationCardProps } from './InformationCard.types';
import { Avatar, AvatarGroup } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import type { PhotoName } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import { ListItem } from '../ListItem';
import { ProgressBar } from '../ProgressBar';
import { NumberRating } from '../Rating';
import { Tag } from '../Tag';

const TAGS_POSITION_OPTIONS = ['header', 'content'] as const;

const meta = {
  title: 'Data Display/InformationCard',
  component: InformationCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  // Ancho de Figma, salvo en las historias con `parameters.fullWidth` (la matriz)
  decorators: [
    (Story, { parameters }) =>
      parameters.fullWidth ? (
        <Story />
      ) : (
        <div className="w-full max-w-[498px]">
          <Story />
        </div>
      ),
  ],
  argTypes: {
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Tittle de Figma' },
    subtitle: { control: 'text', type: { name: 'string' }, description: 'Prop Subtitle de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Prop Description de Figma' },
    tagsPosition: {
      control: 'radio',
      options: TAGS_POSITION_OPTIONS,
      type: { name: 'enum', value: [...TAGS_POSITION_OPTIONS] },
      description: 'Etiquetas arriba (Option 2 y 3) o bajo el título (Option 1)',
    },
  },
  args: {
    title: 'Lanzamiento de la app',
    subtitle: 'Equipo de producto',
    description: 'Versión con pagos en línea, notificaciones y un nuevo panel de pedidos para las tiendas.',
    tagsPosition: 'header',
  },
} satisfies Meta<typeof InformationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const PEOPLE: { photo: PhotoName; name: string }[] = [
  { photo: 'Woman_1', name: 'Ana Pérez' },
  { photo: 'Woman_2', name: 'Luz Mora' },
  { photo: 'Woman_3', name: 'Sara Gil' },
  { photo: 'Woman_4', name: 'Eva Ruiz' },
  { photo: 'Men_1', name: 'Hugo García' },
  { photo: 'Men_2', name: 'Iván Soto' },
  { photo: 'Men_3', name: 'Raúl Vega' },
];

function People({ label = 'Participantes' }: { label?: string }) {
  return (
    <AvatarGroup aria-label={label} max={5}>
      {PEOPLE.map((p) => (
        <Avatar key={p.photo} variant="photo" src={PHOTO_SRC[p.photo]} alt={p.name} />
      ))}
    </AvatarGroup>
  );
}

function Actions({ figma = false }: { figma?: boolean }) {
  return (
    <>
      <Button variant="secondary" size="sm" data-figma-part={figma ? 'Button' : undefined}>
        {figma ? 'Button' : 'Ver detalle'}
      </Button>
      <Button variant="primary" size="sm" data-figma-part={figma ? 'Button' : undefined}>
        {figma ? 'Button' : 'Unirme'}
      </Button>
    </>
  );
}

const folder = <Avatar variant="icon" size="lg" data-figma-part="Avatar" />;

/** Bloque de progreso (prop `Progress` de Figma): etiqueta, participantes y barra. */
function ProgressBlock({ figma = false }: { figma?: boolean }) {
  return (
    <div data-figma-part="Progress" className="flex min-w-0 flex-col gap-ds-space-general-2xl">
      <div className="flex min-w-0 items-center justify-between gap-ds-space-general-3xl">
        <Tag type="success" size="sm" iconLeft={false} data-figma-part={figma ? 'Text' : undefined}>
          {figma ? 'Text' : 'En curso'}
        </Tag>
        <People />
      </div>
      <ProgressBar value={50} label="Avance del proyecto" />
    </div>
  );
}

/** Lista (prop `List` de Figma). */
function ItemList({ figma = false }: { figma?: boolean }) {
  const items = figma
    ? [
        { title: 'Nombre del item', category: 'Categoría', description: 'Descripción' },
        { title: 'Nombre del item', category: 'Categoría', description: 'Descripción' },
      ]
    : [
        { title: 'Diseño de pantallas', category: 'Tarea', description: 'Vence el viernes' },
        { title: 'Pruebas con usuarios', category: 'Tarea', description: 'Vence el lunes' },
      ];
  return (
    <ul role="list" data-figma-part="List" className="m-0 flex min-w-0 flex-col p-0">
      {items.map((item, i) => (
        <ListItem
          key={i}
          {...item}
          selectable
          leading={<Avatar name="Hugo García" size="sm" />}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ))}
    </ul>
  );
}

/** Pie de la Option 3 (prop `Content` de Figma): título, texto y calificación. */
function RatingSummary({ figma = false }: { figma?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-ds-space-general-lg">
      <div className="flex min-w-0 flex-col gap-ds-space-general-md">
        <p className="m-0 truncate font-ds-primitives-typography-family-secundary [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm text-ds-text-neutral-heading">
          {figma ? 'Titulo' : 'Valoración'}
        </p>
        <p className="m-0 font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm leading-ds-typography-body-line-height-short-sm text-ds-text-neutral-gray">
          {figma ? 'Lorem ipsum dolor sit amet' : 'Según el equipo'}
        </p>
      </div>
      <NumberRating value={4.5} />
    </div>
  );
}

/** Option 1: avatar arriba, etiquetas bajo el título y pie con participantes. */
export const Option1: Story = {
  args: { tagsPosition: 'content' },
  render: (args) => (
    <InformationCard
      {...args}
      leading={folder}
      tags={
        <>
          <Tag>Diseño</Tag>
          <Tag iconLeft={false}>Web</Tag>
        </>
      }
      footer={<People />}
      actions={<Actions />}
    />
  ),
};

/** Option 2: etiquetas arriba, bloque de progreso y botones. */
export const Option2: Story = {
  render: (args) => (
    <InformationCard
      {...args}
      tags={
        <>
          <Tag iconLeft={false}>Diseño</Tag>
          <Tag iconLeft={false}>Web</Tag>
        </>
      }
      actions={<Actions />}
    >
      <ProgressBlock />
    </InformationCard>
  ),
};

/** Option 3: avatar y etiquetas arriba, lista de ítems y pie con calificación. */
export const Option3: Story = {
  render: (args) => (
    <InformationCard
      {...args}
      leading={folder}
      tags={
        <>
          <Tag iconLeft={false}>Diseño</Tag>
          <Tag iconLeft={false}>Web</Tag>
        </>
      }
      footer={<RatingSummary />}
      actions={<Actions />}
    >
      <ItemList />
    </InformationCard>
  ),
};

/** Solo lo mínimo: título y descripción. */
export const Minimal: Story = {};

const FIGMA_TEXT: Pick<InformationCardProps, 'title' | 'subtitle' | 'description'> = {
  title: 'Título',
  subtitle: 'Subtítulo',
  description: 'Lorem ipsum dolor sit amet consectetur. Tempus ornare maecenas integer viverra vitae faucibus. ',
};

/** Las 3 variantes del set 14195:31274 con los textos de Figma, a 498 de ancho. `figma` pone `data-figma` (solo una copia lo lleva). */
function MatrixCards({ figma }: { figma: boolean }) {
  return (
    <>
      <InformationCard
        data-figma={figma ? 'Type=Option 1' : undefined}
        {...FIGMA_TEXT}
        leading={folder}
        tagsPosition="content"
        tags={
          <>
            <Tag data-figma-part="Text">Text</Tag>
            <Tag iconLeft={false} data-figma-part="Text">Text</Tag>
          </>
        }
        footer={<People />}
        actions={<Actions figma />}
      />
      <InformationCard
        data-figma={figma ? 'Type=Option 2' : undefined}
        {...FIGMA_TEXT}
        tags={
          <>
            <Tag iconLeft={false} data-figma-part="Text">Text</Tag>
            <Tag iconLeft={false} data-figma-part="Text">Text</Tag>
          </>
        }
        actions={<Actions figma />}
      >
        <ProgressBlock figma />
      </InformationCard>
      <InformationCard
        data-figma={figma ? 'Type=Option 3' : undefined}
        {...FIGMA_TEXT}
        leading={folder}
        tags={
          <>
            <Tag iconLeft={false} data-figma-part="Text">Text</Tag>
            <Tag iconLeft={false} data-figma-part="Text">Text</Tag>
          </>
        }
        footer={<RatingSummary figma />}
        actions={<Actions figma />}
      >
        <ItemList figma />
      </InformationCard>
    </>
  );
}

/**
 * Cada variante de Figma una vez (con `data-figma`). Debajo, solo para revisar a ojo, las mismas tarjetas sobre una
 * superficie que contrasta: sobre background/general/black la superficie (default-on-canva) se funde y no se ven el
 * radio ni la sombra.
 */
export const FigmaMatrix: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de InformationCard" className="max-w-full overflow-x-auto">
        <div className="grid w-max grid-cols-[repeat(3,498px)] items-start gap-6">
          <MatrixCards figma />
        </div>
        <p className="mt-6 mb-2 text-xs text-ds-text-neutral-body">Revisión a ojo sobre background/container/default-on-card (sin data-figma)</p>
        <div className="grid w-max grid-cols-[repeat(3,498px)] items-start gap-6 bg-ds-background-container-default-on-card p-6">
          <MatrixCards figma={false} />
        </div>
      </div>
    </div>
  ),
};

/** Test: la tarjeta es un artículo nombrado por su título (encabezado de nivel 3) y sus controles son accesibles */
export const AccessibleNamesTest: Story = {
  tags: ['!autodocs'],
  render: Option3.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('article', { name: 'Lanzamiento de la app' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Lanzamiento de la app' })).toBeInTheDocument();
    await expect(canvas.getByRole('checkbox', { name: 'Diseño de pantallas' })).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: '4,5 de 5 estrellas' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', { name: 'Unirme' })).toHaveLength(1);
  },
};
