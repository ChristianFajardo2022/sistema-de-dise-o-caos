import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Iconografia } from './Iconografia';
import { CatalogoIconos } from './Catalogo';

const meta = {
  title: 'Fundamentos de diseño/Iconografía',
  component: Iconografia,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Iconografia>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: estilo y tamaño, casos de uso, valores, color, variables y el acceso al catálogo de íconos. */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Aplicación: accionable frente a informativo, el ícono por breakpoint y Do and Dont’s. */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };

/** Pestaña Accesibilidad: nombre accesible, contraste medido, solo con el ícono, zona tapeable y RTL. */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };

/** Pestaña Desarrollo: aplicar en Figma, consumo técnico, agregar un ícono y auditoría. */
export const Desarrollo: Story = { name: 'Desarrollo', args: { initialTab: 'desarrollo' } };

/** Catálogo a pantalla completa, sin encabezado ni pestañas: para enlazarlo directo */
export const CatalogoPantallaCompleta: Story = {
  name: 'Catálogo a pantalla completa',
  render: () => <CatalogoIconos fullscreen />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // El buscador filtra
    const buscar = canvas.getByRole('searchbox', { name: /Buscar ícono/ });
    await userEvent.type(buscar, 'calendar');
    await expect(await canvas.findByRole('button', { name: 'calendar, copiar código' })).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'search, copiar código' })).not.toBeInTheDocument();
    await userEvent.clear(buscar);
  },
};

const H2 = {
  Definición: [
    'Definición y propósito',
    'Estilo y tamaño',
    'Accionables e informativos',
    'Valores de línea',
    'Tamaños permitidos',
    'Márgenes de seguridad',
    'Zona tapeable',
    'Color',
    'Variables / Iconografía',
    'Catálogo',
  ],
  Aplicación: ['Accionable frente a informativo', 'Desktop / Tablet / Mobile', 'Do and Dont’s'],
  Accesibilidad: [
    'Accesibilidad / WCAG 2.2',
    'Decorativo o con significado',
    'Contraste del ícono',
    'No comuniques solo con el ícono',
    'Zona tapeable y tamaño del dibujo',
    'Íconos direccionales',
    'Criterios vs. evidencia',
  ],
  Desarrollo: ['Aplicar en Figma', 'Consumo técnico', 'Agregar un ícono a la biblioteca', 'Auditoría, supuestos y pendientes'],
};

/** Test de la página: h1, las cuatro pestañas (clic y flechas), los h2 de cada una y el enlace al catálogo. Oculto en el menú. */
export const DocPageTest: Story = {
  tags: ['!dev'],
  args: { initialTab: 'definicion' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Iconografía' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(Object.keys(H2));
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Definición']);
    // Tablas con nombre leídas del componente y de tokens.css
    await expect(canvas.getByRole('table', { name: 'Tamaños de Icon y su variante por defecto' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Tokens de dimensión y de espacio de ícono por breakpoint' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Colores de ícono semánticos por modo' })).toBeInTheDocument();
    // Catálogo: enlace a su propia historia
    await expect(canvas.getByRole('link', { name: 'Abrir el catálogo de íconos' })).toHaveAttribute(
      'href',
      './?path=/story/fundamentos-de-diseño-iconografía--catalogo-pantalla-completa',
    );
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Aplicación']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Accesibilidad']);
    await expect(canvas.getByRole('table', { name: 'Contraste de pares de ícono y fondo por modo' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Desarrollo']);
    await expect(canvas.getAllByRole('button', { name: /^Copiar código/ })).toHaveLength(8);
  },
};
