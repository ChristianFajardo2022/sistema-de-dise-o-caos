import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ContenedoresYEspacios } from './ContenedoresYEspacios';

const meta = {
  title: 'Fundamentos de diseño/Contenedores y espacios',
  component: ContenedoresYEspacios,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContenedoresYEspacios>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: propósito, jerarquía de contenedores, padding, gap, escala de espacios y variables. */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Aplicación: usos del espacio, contenedor sobre lienzo y tarjeta, la composición por breakpoint y Do and Dont’s. */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };

/** Pestaña Accesibilidad: proximidad, espaciado de texto y reflow, objetivos táctiles y espacio para el foco. */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };

/** Pestaña Desarrollo: aplicar en Figma, consumo técnico y auditoría. */
export const Desarrollo: Story = { name: 'Desarrollo', args: { initialTab: 'desarrollo' } };

const H2 = {
  Definición: ['Definición y propósito', 'Jerarquía de contenedores', 'Padding', 'Gap', 'Escala de espacios', 'Variables / Espacios'],
  Aplicación: ['Usos del espacio', 'Contenedor sobre lienzo y sobre tarjeta', 'Desktop / Tablet / Mobile', 'Do and Dont’s'],
  Accesibilidad: ['Accesibilidad / WCAG 2.2', 'Proximidad y estructura', 'Espaciado de texto y reflow', 'Objetivos táctiles', 'Espacio para el foco', 'Criterios vs. evidencia'],
  Desarrollo: ['Aplicar en Figma', 'Consumo técnico', 'Auditoría, supuestos y pendientes'],
};

/** Test de la página: h1, las cuatro pestañas (clic y flechas) y los h2 de cada una. Oculto en el menú. */
export const DocPageTest: Story = {
  tags: ['!dev'],
  args: { initialTab: 'definicion' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Contenedores y espacios' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(Object.keys(H2));
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Definición']);
    // Tablas con nombre leídas de tokens.css
    await expect(canvas.getByRole('table', { name: 'Escala de espacios primitivos' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Padding de contenedores por breakpoint' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Aplicación']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Accesibilidad']);
    await expect(canvas.getByRole('table', { name: 'Separación mínima entre objetivos pequeños' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Desarrollo']);
    await expect(canvas.getAllByRole('button', { name: /^Copiar código/ })).toHaveLength(2);
  },
};
