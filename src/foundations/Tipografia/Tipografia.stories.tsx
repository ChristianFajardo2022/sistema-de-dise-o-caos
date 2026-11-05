import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tipografia } from './Tipografia';

const meta = {
  title: 'Fundamentos de diseño/Tipografía',
  component: Tipografia,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Tipografia>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: propósito, anatomía, escalas de estilos y variables primitivas y responsive. */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Aplicación: jerarquía en una interfaz, breakpoints, Do and Dont’s y truncado. */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };

/** Pestaña Accesibilidad: umbrales de contraste, criterios WCAG y pruebas de escalado. */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };

/** Pestaña Desarrollo: aplicar en Figma, consumo técnico y auditoría. */
export const Desarrollo: Story = { name: 'Desarrollo', args: { initialTab: 'desarrollo' } };

const H2 = {
  Definición: [
    'Definición y propósito',
    'Anatomía',
    'Escala y reglas de lectura',
    'Escala / Heading',
    'La escala en contexto',
    'Escala / Body',
    'Escala / Button',
    'Escala / Field',
    'Variables / Primitives',
    'Tamaños de fuente',
    'Interlineado y espaciado',
    'Variables / Responsive',
    'Body / valores por modo',
    'Field, Button e Interaction',
  ],
  Aplicación: ['Jerarquía en una interfaz real', 'Desktop / Tablet / Mobile', 'Do and Dont’s', 'Truncado y contenido variable'],
  Accesibilidad: ['Accesibilidad / WCAG 2.2', 'Escalar sin perder contenido', 'Criterios vs. evidencia'],
  Desarrollo: ['Aplicar en Figma', 'Consumo técnico', 'Auditoría, supuestos y pendientes'],
};

/** Test de la página: h1, las cuatro pestañas (clic y flechas) y los h2 de cada una. Oculto en el menú. */
export const DocPageTest: Story = {
  tags: ['!dev'],
  args: { initialTab: 'definicion' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Tipografía' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(Object.keys(H2));
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Definición']);
    // Tablas con nombre y encabezados de columna
    await expect(canvas.getByRole('table', { name: 'Escala Heading' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Aplicación']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Accesibilidad']);
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Desarrollo']);
    await expect(canvas.getAllByRole('button', { name: /^Copiar código/ })).toHaveLength(3);
  },
};
