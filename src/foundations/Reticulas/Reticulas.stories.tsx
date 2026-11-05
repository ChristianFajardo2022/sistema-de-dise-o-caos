import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Reticulas } from './Reticulas';

const meta = {
  title: 'Fundamentos de diseño/Retículas',
  component: Reticulas,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Reticulas>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: propósito, pantallas, estructura, tipos de retícula, márgenes y variables responsive. */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Aplicación: composición en columnas, casos de uso, la retícula por breakpoint y Do and Dont’s. */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };

/** Pestaña Accesibilidad: reflow, zoom, orden de lectura y del foco, y ancho de línea. */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };

/** Pestaña Desarrollo: aplicar en Figma, consumo técnico y auditoría. */
export const Desarrollo: Story = { name: 'Desarrollo', args: { initialTab: 'desarrollo' } };

const H2 = {
  Definición: [
    'Definición y propósito',
    'Pantallas',
    'Estructura de la retícula',
    'Tipos de retícula',
    'Márgenes laterales',
    'Márgenes superior e inferior',
    'Variables / Responsive',
  ],
  Aplicación: ['Composición en retículas', 'Casos de uso', 'Desktop / Tablet / Mobile', 'Do and Dont’s'],
  Accesibilidad: ['Accesibilidad / WCAG 2.2', 'Reflow y zoom', 'Orden de lectura y del foco', 'Ancho de línea', 'Criterios vs. evidencia'],
  Desarrollo: ['Aplicar en Figma', 'Consumo técnico', 'Auditoría, supuestos y pendientes'],
};

/** Test de la página: h1, las cuatro pestañas (clic y flechas) y los h2 de cada una. Oculto en el menú. */
export const DocPageTest: Story = {
  tags: ['!dev'],
  args: { initialTab: 'definicion' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Retículas' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(Object.keys(H2));
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Definición']);
    // Tablas con nombre leídas de tokens.css
    await expect(canvas.getByRole('table', { name: 'Variables de la retícula por breakpoint' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Pantallas y breakpoints' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Aplicación']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Accesibilidad']);
    // El orden de lectura se anuncia como lista ordenada en cada breakpoint
    await expect(canvas.getByRole('list', { name: 'Orden de lectura en Desktop' })).toBeInTheDocument();
    await expect(canvas.getByRole('list', { name: 'Orden de lectura en Mobile' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Desarrollo']);
    await expect(canvas.getAllByRole('button', { name: /^Copiar código/ })).toHaveLength(2);
  },
};
