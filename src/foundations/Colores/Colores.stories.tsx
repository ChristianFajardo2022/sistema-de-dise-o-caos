import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Colores } from './Colores';

const meta = {
  title: 'Fundamentos de diseño/Colores',
  component: Colores,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Colores>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: propósito, paleta por familia, dominancia, roles y variables semánticas por categoría. */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Aplicación: dominancia y roles en una interfaz, modo claro y oscuro, y Do and Dont’s. */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };

/** Pestaña Accesibilidad: umbrales WCAG, contraste medido de pares de tokens y buenas prácticas. */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };

/** Pestaña Desarrollo: aplicar en Figma, consumo técnico, primitivos y semánticos, y auditoría. */
export const Desarrollo: Story = { name: 'Desarrollo', args: { initialTab: 'desarrollo' } };

const H2 = {
  Definición: [
    'Definición y propósito',
    'Paleta de color',
    'Dominancia de color',
    'Roles de color',
    'Variables / Text',
    'Variables / Buttons',
    'Variables / Icon',
    'Variables / Link',
    'Variables / Background',
    'Variables / Border',
    'Variables / Divider',
    'Variables / Shadow',
    'Variables / Graphics',
  ],
  Aplicación: ['Dominancia y roles en una interfaz', 'Modo claro y modo oscuro', 'Do and Dont’s'],
  Accesibilidad: ['Accesibilidad / WCAG 2.2', 'Contraste de los pares de tokens', 'Buenas prácticas', 'Criterios vs. evidencia'],
  Desarrollo: ['Aplicar en Figma', 'Consumo técnico', 'Primitivos y semánticos', 'Auditoría, supuestos y pendientes'],
};

/** Test de la página: h1, las cuatro pestañas (clic y flechas) y los h2 de cada una. Oculto en el menú. */
export const DocPageTest: Story = {
  tags: ['!dev'],
  args: { initialTab: 'definicion' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Colores' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(Object.keys(H2));
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Definición']);
    // Tablas con nombre, muestras de primitivos como listas
    await expect(canvas.getByRole('table', { name: 'Familias de color' })).toBeInTheDocument();
    await expect(canvas.getByRole('list', { name: 'Primitivos Primario' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Aplicación']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Accesibilidad']);
    await expect(canvas.getByRole('table', { name: 'Contraste de pares de texto y fondo por modo' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Desarrollo']);
    await expect(canvas.getAllByRole('button', { name: /^Copiar código/ })).toHaveLength(3);
  },
};
