import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
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
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './InformationCard.doc';
import docsJson from './InformationCard.docs.json';

const TAGS_POSITION_OPTIONS = ['header', 'content'] as const;

const meta = {
  title: 'Data Display/InformationCard',
  component: InformationCard,
  // El lienzo de Desarrollo usa `Interactive`: sus args llevan los slots, así el código copiado da lo que se ve
  parameters: { layout: 'padded', docs: componentDocsParameters(doc, docsJson), docsLive: { story: 'Interactive' } },
  tags: ['autodocs'],
  // Ancho de Figma, salvo en las historias con `parameters.fullWidth` (la matriz)
  decorators: [
    (Story, { parameters }) =>
      parameters.fullWidth ? (
        <Story />
      ) : (
        <div className="w-full max-w-[402.33px]">
          <Story />
        </div>
      ),
  ],
  argTypes: argTypesFromDocsJson(docsJson, {
    title: { control: 'text', type: { name: 'string' } },
    subtitle: { control: 'text', type: { name: 'string' } },
    description: { control: 'text', type: { name: 'string' } },
    variant: { control: 'radio', options: ['default', 'simple'], type: { name: 'enum', value: ['default', 'simple'] } },
    image: { control: 'boolean', type: { name: 'boolean' } },
    tagsPosition: { control: 'radio', options: TAGS_POSITION_OPTIONS, type: { name: 'enum', value: [...TAGS_POSITION_OPTIONS] } },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6, 'none'], type: { name: 'enum', value: ['2', '3', '4', '5', '6', 'none'] } },
  }),
  args: {
    title: 'Lanzamiento de la app',
    subtitle: 'Equipo de producto',
    description: 'Versión con modo oscuro, notificaciones y un nuevo panel de ajustes para el equipo.',
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
          onView={i === 0 ? () => {} : undefined}
          onEdit={i === 0 ? undefined : () => {}}
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
        <p className="m-0 truncate font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-typography-heading-size-sm leading-ds-typography-heading-line-height-sm text-ds-text-neutral-heading">
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

/** Página de documentación v2 para revisar la estructura y la pestaña Desarrollo. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'InformationCard' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente InformationCard en Figma:']);
    // Marcadores: 6 de la composición completa y 3 de la simple
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(10));
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de InformationCard' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};

/** Con todos los controles de Personalizar: título, textos, tipo, rejilla, etiquetas y nivel del encabezado. Los slots van en los args. */
export const Interactive: Story = {
  args: {
    leading: <Avatar variant="icon" size="lg" />,
    tags: <Tag iconLeft={false}>Diseño</Tag>,
    actions: <Button size="sm">Unirme</Button>,
  },
};

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

/** Type=Simple: título arriba, descripción abajo y, con `image`, la rejilla de puntos de fondo. */
export const Simple: Story = {
  args: { variant: 'simple', image: true, title: 'Aquí va un título', description: 'Lorem ipsum dolor sit amet consectetur. Lobortis orci sed dolor nisi massa laoreet in hendrerit.' },
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
      >
        <ItemList figma />
      </InformationCard>
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
        <div className="grid w-max grid-cols-[repeat(3,402.33px)] items-start gap-6">
          <MatrixCards figma />
          <InformationCard
            data-figma="Type=Simple"
            variant="simple"
            image
            title="Aquí va un título"
            description="Lorem ipsum dolor sit amet consectetur. Lobortis orci sed dolor nisi massa laoreet in hendrerit."
          />
        </div>
        <p className="mt-6 mb-2 text-xs text-ds-text-neutral-body">Revisión a ojo sobre background/container/default-on-card (sin data-figma)</p>
        <div className="grid w-max grid-cols-[repeat(3,402.33px)] items-start gap-6 bg-ds-background-container-default-on-card p-6">
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
