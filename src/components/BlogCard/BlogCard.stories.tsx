import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { BlogCard } from './BlogCard';
import type { BlogCardProps } from './BlogCard.types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { ButtonCorner } from '../ButtonCorner';
import { Tag } from '../Tag';

const ORIENTATION_OPTIONS = ['vertical', 'horizontal'] as const;
const HEADING_OPTIONS = [2, 3, 4, 5, 6, 'none'] as const;

/** Anchos de Figma por orientación. */
const WIDTH = { vertical: 'max-w-[344px]', horizontal: 'max-w-[497px]' } as const;

const meta = {
  title: 'Data Display/BlogCard',
  component: BlogCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  decorators: [
    (Story, { parameters, args }) =>
      parameters.fullWidth ? (
        <Story />
      ) : (
        <div className={`w-full ${WIDTH[(args.orientation as keyof typeof WIDTH) ?? 'vertical']}`}>
          <Story />
        </div>
      ),
  ],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ORIENTATION_OPTIONS,
      type: { name: 'enum', value: [...ORIENTATION_OPTIONS] },
      description: 'Propiedad 2 de Figma: Blog vertical / Blog horizontal',
    },
    title: { control: 'text', type: { name: 'string' } },
    description: { control: 'text', type: { name: 'string' } },
    href: { control: 'text', type: { name: 'string' } },
    date: { control: 'text', type: { name: 'string' } },
    dateTime: { control: 'text', type: { name: 'string' } },
    author: { control: 'text', type: { name: 'string' } },
    linkLabel: { control: 'text', type: { name: 'string' } },
    headingLevel: {
      control: 'select',
      options: HEADING_OPTIONS,
      type: { name: 'enum', value: [...HEADING_OPTIONS] },
    },
  },
  args: {
    orientation: 'vertical',
    title: 'Cinco ideas para empacar mejor',
    description: 'Materiales, tamaños y trucos para que cada pedido llegue intacto.',
    href: '#articulo',
    date: '7 feb 2024',
    dateTime: '2024-02-07',
    author: 'Ana Pérez',
    linkLabel: 'Leer más',
  },
} satisfies Meta<typeof BlogCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const authorAvatar = <Avatar variant="photo" size="xs" src={PHOTO_SRC.Woman_1} />;

/**
 * Interactivo. La imagen del artículo de Figma está excluida a propósito (es un producto real): sin `src` se ve el
 * marcador neutro.
 */
export const Interactive: Story = {
  render: (args) => (
    <BlogCard
      {...args}
      authorAvatar={authorAvatar}
      tags={
        args.orientation === 'vertical' ? <Tag>Logística</Tag> : <Tag iconLeft={false}>Logística</Tag>
      }
    />
  ),
};

/** Blog vertical: foto arriba con el Button corner (parte del enlace) y autor con etiqueta. */
export const Vertical: Story = {
  render: (args) => <BlogCard {...args} orientation="vertical" authorAvatar={authorAvatar} tags={<Tag>Logística</Tag>} />,
};

/** Blog horizontal: foto a la izquierda con etiqueta y autor; texto a la derecha. */
export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => <BlogCard {...args} authorAvatar={authorAvatar} tags={<Tag iconLeft={false}>Logística</Tag>} />,
};

/** Con una acción propia en la muesca (Guardar), por encima del enlace estirado. */
export const WithAction: Story = {
  render: (args) => (
    <BlogCard
      {...args}
      authorAvatar={authorAvatar}
      tags={<Tag>Logística</Tag>}
      action={<ButtonCorner variant="favorite" contrast="on-canva" aria-label={`Guardar ${String(args.title)}`} />}
    />
  ),
};

const FIGMA_TEXT = {
  title: 'Titulo',
  description: 'Lorem ipsum dolor sit amet consectetur. Pretium at odio id turpis sem id. ',
  date: '7 Feb 2024',
  dateTime: '2024-02-07',
  href: '#articulo',
  linkLabel: 'Button',
  author: 'Ana Pérez',
} satisfies Partial<BlogCardProps>;

/** Las 2 variantes del set 17080:14028 con los textos de Figma (autor inventado). `figma` pone `data-figma`. */
function MatrixCards({ figma }: { figma: boolean }) {
  return (
    <>
      <BlogCard
        data-figma={figma ? 'Propiedad 1=Blog card, Propiedad 2=Blog vertical' : undefined}
        className="w-[344px]"
        orientation="vertical"
        {...FIGMA_TEXT}
        authorAvatar={authorAvatar}
        tags={<Tag data-figma-part="Text">Categoría</Tag>}
      />
      <BlogCard
        data-figma={figma ? 'Propiedad 1=Blog card, Propiedad 2=Blog horizontal' : undefined}
        className="w-[497px]"
        orientation="horizontal"
        {...FIGMA_TEXT}
        authorAvatar={authorAvatar}
        tags={
          <Tag iconLeft={false} data-figma-part="Text">
            Text
          </Tag>
        }
      />
    </>
  );
}

/**
 * Cada variante de Figma una vez (con `data-figma`). Debajo, solo para revisar a ojo, las mismas tarjetas sobre
 * background/container/default-on-card.
 */
export const FigmaMatrix: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de BlogCard" className="max-w-full overflow-x-auto">
        <div className="flex w-max items-start gap-6">
          <MatrixCards figma />
        </div>
        <p className="mt-6 mb-2 text-xs text-ds-text-neutral-body">Revisión a ojo sobre background/container/default-on-card (sin data-figma)</p>
        <div className="flex w-max items-start gap-6 bg-ds-background-container-default-on-card p-6">
          <MatrixCards figma={false} />
        </div>
      </div>
    </div>
  ),
};

/**
 * Test: artículo con encabezado, fecha en `<time>`, un solo enlace (el título) que cubre la tarjeta y la acción de la
 * muesca con su propio nombre, sin disparar el enlace.
 */
const onSave = fn();
const onOpen = fn((e: { preventDefault: () => void }) => e.preventDefault());

export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <BlogCard
      {...args}
      authorAvatar={authorAvatar}
      tags={<Tag>Logística</Tag>}
      linkProps={{ onClick: onOpen }}
      action={<ButtonCorner variant="favorite" contrast="on-canva" aria-label="Guardar Cinco ideas para empacar mejor" onClick={onSave} />}
    />
  ),
  play: async ({ canvasElement }) => {
    onSave.mockClear();
    onOpen.mockClear();
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('article', { name: 'Cinco ideas para empacar mejor' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Cinco ideas para empacar mejor' })).toBeInTheDocument();
    await expect(canvasElement.querySelector('time[datetime="2024-02-07"]')).toHaveTextContent('7 feb 2024');
    // Un solo enlace: el texto visible "Leer más", nombrado con el título + "Leer más" (2.5.3); la flecha es parte
    // visual de él y el encabezado queda solo con el título
    const links = canvas.getAllByRole('link');
    await expect(links).toHaveLength(1);
    await expect(links[0]).toHaveAccessibleName('Cinco ideas para empacar mejor Leer más');
    await expect(links[0]).toHaveTextContent('Leer más');
    await expect(links[0]).toHaveAttribute('href', '#articulo');
    // Teclado: primero el enlace, luego la acción de la muesca
    await userEvent.tab();
    await expect(links[0]).toHaveFocus();
    await userEvent.tab();
    const save = canvas.getByRole('button', { name: 'Guardar Cinco ideas para empacar mejor' });
    await expect(save).toHaveFocus();
    await userEvent.click(save);
    await expect(onSave).toHaveBeenCalledTimes(1);
    await expect(onOpen).not.toHaveBeenCalled();
    // El enlace estirado cubre la tarjeta: lo que hay bajo el puntero en el resumen y en la foto es el enlace
    for (const el of [canvas.getByText('Materiales, tamaños y trucos para que cada pedido llegue intacto.'), canvas.getByText('Ana Pérez')]) {
      const r = el.getBoundingClientRect();
      await expect(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)).toBe(links[0]);
    }
    // …y la acción de la muesca queda por encima
    const s = save.getBoundingClientRect();
    await expect(save.contains(document.elementFromPoint(s.left + s.width / 2, s.top + s.height / 2))).toBe(true);
  },
};
