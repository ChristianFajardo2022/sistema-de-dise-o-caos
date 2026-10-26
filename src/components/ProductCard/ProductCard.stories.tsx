import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ProductCard } from './ProductCard';
import type { ProductCardProps, ProductCardState } from './ProductCard.types';
import { Button } from '../Button';
import { Icon } from '../Icon';
import productPhoto from './assets/producto.jpg';

const STATES: ProductCardState[] = ['default', 'hover'];

/** Textos de Figma (variantes del set 15863:66763). */
const FIGMA = {
  title: 'Audífonos Bluetooth Pro',
  description: 'Audífonos de alta fidelidad con cancelación de ruido activa y hasta 30 horas de batería continua.',
  price: '$129.999',
  rating: 4.5,
};

/** Acción secundaria de Figma: Button secondary sm solo ícono con el ícono `edit`. */
const editAction = (title: string) => (
  <Button variant="secondary" size="sm" iconOnly aria-label={`Personalizar ${title}`} data-figma-part="Button">
    <Icon name="edit" size={20} data-figma-part="Icon-sizes" />
  </Button>
);

const meta = {
  title: 'Data Display/ProductCard',
  component: ProductCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', type: { name: 'string', required: true } },
    description: { control: 'text', type: { name: 'string' } },
    price: { control: 'text', type: { name: 'string', required: true } },
    rating: { control: { type: 'number', min: 0, max: 5, step: 0.1 }, type: { name: 'number' } },
    quantity: {
      control: { type: 'number', min: 0, step: 1 },
      type: { name: 'number' },
      description: 'Cantidad en el carrito; con 1 o más se ve el State "+" de Figma',
    },
    favorite: { control: 'boolean', type: { name: 'boolean' } },
    href: { control: 'text', type: { name: 'string' } },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6, 'none'],
      type: { name: 'enum', value: [2, 3, 4, 5, 6, 'none'] },
    },
    state: {
      control: 'select',
      options: [undefined, ...STATES],
      type: { name: 'enum', value: STATES },
      description: 'State forzado, solo para documentación',
    },
    src: { control: false },
  },
  args: {
    title: 'Audífonos inalámbricos',
    description: 'Cancelación de ruido activa, 30 horas de batería y carga rápida por USB-C.',
    price: '$129.999',
    rating: 4.5,
    src: productPhoto,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[337px] bg-ds-background-general-black p-6 box-content">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

/** Las tres variantes de Figma, cada una una vez, con sus textos. Debajo, la silueta sobre la superficie de tarjeta. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [],
  render: () => {
    const cards = (figma: boolean) => (
      <div className="flex gap-6">
        {(
          [
            ['State=Default', { state: 'default' }],
            ['State=Hover', { state: 'hover', action: editAction(FIGMA.title) }],
            ['State=+', { defaultQuantity: 2 }],
          ] as [string, Partial<ProductCardProps>][]
        ).map(([name, props]) => (
          <div key={name} className="flex w-[337px] shrink-0 flex-col gap-2">
            <span className="text-xs text-ds-text-neutral-body">{name}</span>
            <ProductCard
              {...FIGMA}
              src={productPhoto}
              {...props}
              {...(figma ? { 'data-figma': name } : {})}
            />
          </div>
        ))}
      </div>
    );
    return (
      <div className="flex w-fit flex-col">
        <div className="bg-ds-background-general-black p-6">{cards(true)}</div>
        <div className="bg-ds-background-container-default-on-card p-6">{cards(false)}</div>
      </div>
    );
  },
};

/** Toda la tarjeta lleva a la ficha: el título es un enlace estirado y los controles quedan encima. */
export const WithLink: Story = {
  args: { href: '#ficha', action: editAction('Audífonos inalámbricos') },
};

function CartDemo() {
  const [quantity, setQuantity] = useState(0);
  const [favorite, setFavorite] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <ProductCard
        title="Audífonos inalámbricos"
        description="Cancelación de ruido activa, 30 horas de batería y carga rápida por USB-C."
        price="$129.999"
        rating={4.5}
        ratingCount={128}
        src={productPhoto}
        quantity={quantity}
        onQuantityChange={setQuantity}
        maxQuantity={10}
        favorite={favorite}
        onFavoriteChange={setFavorite}
      />
      <p className="m-0 text-sm text-ds-text-neutral-body" data-testid="estado">
        {quantity} en el carrito · {favorite ? 'en favoritos' : 'sin favorito'}
      </p>
    </div>
  );
}

/** Controlado: agregar pasa al selector de cantidad; quitar la última unidad vuelve al botón. */
export const Controlled: Story = {
  render: () => <CartDemo />,
};

export const TestCart: Story = {
  tags: ['!autodocs'],
  render: () => <CartDemo />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const estado = c.getByTestId('estado');
    // Precio y calificación se leen como texto, no solo estrellas
    await expect(c.getByText('Precio:', { exact: false })).toBeInTheDocument();
    await expect(c.getByRole('img', { name: '4,5 de 5 estrellas, 128 reseñas' })).toBeInTheDocument();
    await expect(c.getByRole('heading', { level: 3, name: 'Audífonos inalámbricos' })).toBeInTheDocument();

    // Favorito: toggle con aria-pressed
    const fav = c.getByRole('button', { name: 'Agregar Audífonos inalámbricos a favoritos' });
    await expect(fav).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(fav);
    await expect(fav).toHaveAttribute('aria-pressed', 'true');
    await expect(estado).toHaveTextContent('en favoritos');

    // Agregar: el nombre empieza por el texto visible e incluye el producto; el foco pasa al selector
    const add = c.getByRole('button', { name: 'Agregar al carrito: Audífonos inalámbricos' });
    await userEvent.click(add);
    await expect(estado).toHaveTextContent('1 en el carrito');
    const picker = c.getByRole('spinbutton', { name: 'Cantidad de Audífonos inalámbricos' });
    await waitFor(() => expect(picker).toHaveFocus());

    // Teclado del selector
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect(estado).toHaveTextContent('3 en el carrito');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    await expect(estado).toHaveTextContent('0 en el carrito');

    // Sin unidades vuelve el botón y recibe el foco
    const addAgain = await c.findByRole('button', { name: 'Agregar al carrito: Audífonos inalámbricos' });
    await waitFor(() => expect(addAgain).toHaveFocus());
  },
};

export const TestKeyboardReveal: Story = {
  tags: ['!autodocs'],
  args: { onAddToCart: fn(), href: '#ficha' },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const link = c.getByRole('link', { name: 'Audífonos inalámbricos' });
    const add = c.getByRole('button', { name: 'Agregar al carrito: Audífonos inalámbricos' });
    // Plegado: el botón está oculto a la vista pero sigue en el árbol y en el orden de tabulación
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.tab();
    await expect(add).toHaveFocus();
    // Con el foco dentro la tarjeta se expande: el botón ya no está recortado a 1 px
    await waitFor(() => expect(add.getBoundingClientRect().width).toBeGreaterThan(100));
    await userEvent.keyboard('{Enter}');
    await expect(args.onAddToCart).toHaveBeenCalledTimes(1);
    // El enlace no anida controles
    await expect(link.querySelector('button')).toBeNull();
  },
};
