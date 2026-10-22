import type { Meta, StoryObj } from '@storybook/react-vite';
import { Iconografia } from './Iconografia';
import { CatalogoIconos } from './Catalogo';

const meta = {
  title: 'Fundamentos de diseño/Iconografía',
  component: Iconografia,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Iconografia>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: casos de uso de íconos accionables e informativos */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Valores: línea, tamaños, márgenes de seguridad, zona tapeable y color */
export const Valores: Story = { name: 'Valores', args: { initialTab: 'valores' } };

/** Pestaña Catálogo: los 404 íconos con buscador, filtros y copia del código */
export const Catalogo: Story = { name: 'Catálogo', args: { initialTab: 'catalogo' } };

/** Catálogo a pantalla completa, sin encabezado ni pestañas: para enlazarlo directo */
export const CatalogoPantallaCompleta: Story = {
  name: 'Catálogo a pantalla completa',
  render: () => <CatalogoIconos fullscreen />,
};
