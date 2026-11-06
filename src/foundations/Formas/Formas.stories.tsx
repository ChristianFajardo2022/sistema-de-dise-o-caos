import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Formas } from './Formas';

const meta = {
  title: 'Fundamentos de diseño/Formas',
  component: Formas,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Formas>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: formas, radio de borde, rangos de radio, valores de línea y variables. */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Aplicación: radio según el contenedor, líneas en contexto, la composición por breakpoint y Do and Dont’s. */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };

/** Pestaña Accesibilidad: contraste de bordes, forma y color, colores forzados, anillo de foco y objetivos. */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };

/** Pestaña Desarrollo: aplicar en Figma, consumo técnico y auditoría. */
export const Desarrollo: Story = { name: 'Desarrollo', args: { initialTab: 'desarrollo' } };

const H2 = {
  Definición: ['Definición y propósito', 'Formas', 'Radio de borde', 'Rangos de radio', 'Valores de línea', 'Variables / Radios y líneas'],
  Aplicación: ['Radio según el contenedor', 'Líneas en contexto', 'Desktop / Tablet / Mobile', 'Do and Dont’s'],
  Accesibilidad: [
    'Accesibilidad / WCAG 2.2',
    'Contraste de los bordes',
    'No comuniques solo con la forma',
    'Alto contraste y colores forzados',
    'Anillo de foco y radio',
    'Objetivos circulares y de ícono',
    'Criterios vs. evidencia',
  ],
  Desarrollo: ['Aplicar en Figma', 'Consumo técnico', 'Auditoría, supuestos y pendientes'],
};

/** Test de la página: h1, las cuatro pestañas (clic y flechas) y los h2 de cada una. Oculto en el menú. */
export const DocPageTest: Story = {
  tags: ['!dev'],
  args: { initialTab: 'definicion' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Formas' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(Object.keys(H2));
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Definición']);
    // Tablas con nombre leídas de tokens.css
    await expect(canvas.getByRole('table', { name: 'Radios primitivos' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Radios de contenedor por breakpoint' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Grosores de línea primitivos' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Aplicación']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Accesibilidad']);
    await expect(canvas.getByRole('table', { name: 'Contraste de pares de borde y fondo por modo' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Desarrollo']);
    await expect(canvas.getAllByRole('button', { name: /^Copiar código/ })).toHaveLength(5);
  },
};
