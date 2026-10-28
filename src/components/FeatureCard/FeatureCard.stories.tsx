import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { FeatureCard } from './FeatureCard';
import type { FeatureCardProps } from './FeatureCard.types';
import featurePhoto from './assets/destacar-archivo.png';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { ButtonCorner } from '../ButtonCorner';
import { Icon } from '../Icon';
import { ListItem } from '../ListItem';

const VARIANT_OPTIONS = ['photo', 'surface', 'cutout'] as const;
const HEADING_OPTIONS = [2, 3, 4, 5, 6, 'none'] as const;

/** Anchos de Figma por tipo. */
const WIDTH: Record<(typeof VARIANT_OPTIONS)[number], string> = {
  photo: 'max-w-[498px]',
  surface: 'max-w-[498px]',
  cutout: 'max-w-[612px]',
};

const meta = {
  title: 'Data Display/FeatureCard',
  component: FeatureCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story, { parameters, args }) =>
      parameters.fullWidth ? (
        <Story />
      ) : (
        <div className={`w-full ${WIDTH[(args.variant as keyof typeof WIDTH) ?? 'photo']}`}>
          <Story />
        </div>
      ),
  ],
  argTypes: {
    variant: {
      control: 'radio',
      options: VARIANT_OPTIONS,
      type: { name: 'enum', value: [...VARIANT_OPTIONS] },
      description: 'photo y surface sin set en Figma (se conservan) · cutout = "Type=2"',
    },
    title: { control: 'text', type: { name: 'string' } },
    description: { control: 'text', type: { name: 'string' } },
    eyebrow: { control: 'text', type: { name: 'string' }, description: 'Solo cutout' },
    date: { control: 'text', type: { name: 'string' } },
    dateTime: { control: 'text', type: { name: 'string' } },
    headingLevel: {
      control: 'select',
      options: HEADING_OPTIONS,
      type: { name: 'enum', value: [...HEADING_OPTIONS] },
    },
  },
  args: {
    variant: 'photo',
    title: 'Nueva colección de empaques',
    description: 'Cajas rígidas en negro mate para los pedidos de regalo.',
    date: '7 feb 2024',
    dateTime: '2024-02-07',
  },
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Lista del slot "Espacio": un ítem con avatar y uno solo con título. */
function ItemList({ figma = false }: { figma?: boolean }) {
  return (
    <ul role="list" data-figma-part="List" className="m-0 flex min-w-0 flex-col p-0">
      <ListItem
        title={figma ? 'Nombre del item' : 'Pedido 1024'}
        leading={<Avatar name="Hugo García" size="sm" />}
      />
      <ListItem variant="simple" title={figma ? 'Nombre del item' : 'Pedido 1025'} />
    </ul>
  );
}

function Corner({ label }: { label: string }) {
  return (
    <ButtonCorner
      contrast="on-card"
      size="md"
      aria-label={label}
      icon={<Icon name="arrow-diagonal-right" size={16} variant="line" data-figma-part="Icon-sizes" />}
    />
  );
}

/** Interactivo: cambia el tipo con los controles. */
export const Interactive: Story = {
  render: (args) => (
    <FeatureCard
      {...args}
      src={args.variant === 'photo' ? featurePhoto : undefined}
      eyebrow={args.variant === 'cutout' ? (args.eyebrow ?? 'Guía') : undefined}
      action={
        args.variant === 'photo' ? (
          <Button variant="secondary" size="sm" unicolor aria-label={`Ver colección ${String(args.title)}`}>
            Ver colección
          </Button>
        ) : args.variant === 'surface' ? (
          <Corner label={`Abrir ${String(args.title)}`} />
        ) : undefined
      }
    >
      {args.variant === 'surface' ? <ItemList /> : undefined}
    </FeatureCard>
  ),
};

/** photo: foto de fondo, texto y un botón. */
export const Photo: Story = {
  render: (args) => (
    <FeatureCard
      {...args}
      variant="photo"
      src={featurePhoto}
      action={
        <Button variant="secondary" size="sm" unicolor aria-label={`Ver colección ${String(args.title)}`}>
          Ver colección
        </Button>
      }
    />
  ),
};

/** surface: superficie con muesca para el Button corner y una lista en el slot. */
export const Surface: Story = {
  args: { variant: 'surface', title: 'Tareas por revisar', description: 'Dos pedidos esperan guía de envío.' },
  render: (args) => (
    <FeatureCard {...args} action={<Corner label="Abrir Tareas por revisar" />}>
      <ItemList />
    </FeatureCard>
  ),
};

/**
 * cutout: foto grande con recorte para el texto. La imagen de Figma está excluida a propósito (es un producto real):
 * sin `src` se ve el marcador neutro. El recorte se ajusta al bloque de texto.
 */
export const Cutout: Story = {
  args: { variant: 'cutout', eyebrow: 'Guía', title: 'Cómo preparar\ntu primer envío', description: undefined, date: undefined },
};

const FIGMA_TEXT = {
  title: 'Esto es un texto',
  description: 'Esto es un texto descriptivo',
  date: '7 Feb 2024',
  dateTime: '2024-02-07',
} satisfies Partial<FeatureCardProps>;

/**
 * Las 3 variantes con los textos de Figma. El set vigente (16903:57057) solo tiene `Type=2` (= cutout): `photo` y `surface`
 * ya no tienen set y no llevan `data-figma`. `figma` pone `data-figma` (solo una copia lo lleva).
 */
function MatrixCards({ figma }: { figma: boolean }) {
  return (
    <>
      <FeatureCard
        className="w-[498px]"
        variant="photo"
        {...FIGMA_TEXT}
        src={featurePhoto}
        action={
          <Button variant="secondary" size="sm" unicolor data-figma-part="Button">
            Button
          </Button>
        }
      />
      <FeatureCard
        data-figma={figma ? 'Type=2' : undefined}
        className="w-[612px]"
        variant="cutout"
        eyebrow="Subtítulo"
        title={'Best Full Body\nHome Gym Machines'}
      />
      <FeatureCard
        className="w-[498px]"
        variant="surface"
        {...FIGMA_TEXT}
        action={<Corner label="Abrir Esto es un texto" />}
      >
        <ItemList figma />
      </FeatureCard>
    </>
  );
}

/**
 * Cada variante de Figma una vez (con `data-figma`). Debajo, solo para revisar a ojo, las mismas tarjetas sobre
 * background/container/default-on-card: sobre background/general/black la superficie de `surface` se funde.
 */
export const FigmaMatrix: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de FeatureCard" className="max-w-full overflow-x-auto">
        <div className="flex flex-wrap items-start gap-6">
          <MatrixCards figma />
        </div>
        <p className="mt-6 mb-2 text-xs text-ds-text-neutral-body">Revisión a ojo sobre background/container/default-on-card (sin data-figma)</p>
        <div className="flex flex-wrap items-start gap-6 bg-ds-background-container-default-on-card p-6">
          <MatrixCards figma={false} />
        </div>
      </div>
    </div>
  ),
};

/** Test: cada tipo es un artículo nombrado por su título; la fecha va en `<time>` y las acciones tienen nombre */
export const AccessibleNamesTest: Story = {
  tags: ['!autodocs'],
  parameters: { fullWidth: true },
  render: () => (
    <div className="flex flex-col gap-6">
      <FeatureCard className="max-w-[498px]" variant="photo" title="Empaques" date="7 feb 2024" dateTime="2024-02-07" src={featurePhoto} action={<Button size="sm" aria-label="Ver colección Empaques">Ver colección</Button>} />
      <FeatureCard className="max-w-[498px]" variant="surface" title="Pedidos" headingLevel={2} action={<Corner label="Abrir Tareas" />}>
        <ItemList />
      </FeatureCard>
      <FeatureCard className="max-w-[612px]" variant="cutout" eyebrow="Guía" title="Primer envío" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('article', { name: 'Empaques' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Empaques' })).toBeInTheDocument();
    await expect(canvasElement.querySelector('time[datetime="2024-02-07"]')).toHaveTextContent('7 feb 2024');
    await expect(canvas.getByRole('button', { name: 'Ver colección Empaques' })).toBeInTheDocument();
    await expect(canvas.getByRole('article', { name: 'Pedidos' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 2, name: 'Pedidos' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Abrir Tareas' })).toBeInTheDocument();
    await expect(canvas.getByRole('article', { name: 'Primer envío' })).toBeInTheDocument();
    // Cutout: el recorte se mide del bloque de texto
    const cutout = canvas.getByRole('article', { name: 'Primer envío' });
    await expect(parseFloat(cutout.style.getPropertyValue('--fc-cut-w'))).toBeGreaterThan(0);
    // El encabezado va antes que la línea corta en el DOM (la línea se ve arriba con order-first)
    const heading = within(cutout).getByRole('heading', { name: 'Primer envío' });
    const eyebrow = within(cutout).getByText('Guía');
    await expect(heading.compareDocumentPosition(eyebrow) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // El texto no se sale de la tarjeta: la tarjeta crece si no cabe
    const card = cutout.getBoundingClientRect();
    const text = heading.parentElement!.getBoundingClientRect();
    await expect(text.top).toBeGreaterThanOrEqual(card.top - 0.5);
  },
};
