import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Texturas } from './Texturas';

const meta = {
  title: 'Fundamentos de diseño/Texturas',
  component: Texturas,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Texturas>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: degradado, glass, blur, patrones de líneas y variables. */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Aplicación: dónde va cada textura, la composición por breakpoint y Do and Dont’s. */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };

/** Pestaña Accesibilidad: contraste sobre degradado y glass, decorativos, transparencia reducida y diálogo. */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };

/** Pestaña Desarrollo: aplicar en Figma, consumo técnico y auditoría. */
export const Desarrollo: Story = { name: 'Desarrollo', args: { initialTab: 'desarrollo' } };

const H2 = {
  Definición: ['Definición y propósito', 'Degradado', 'Glass', 'Blur', 'Patrones de líneas', 'Variables / Texturas'],
  Aplicación: ['Dónde va cada textura', 'Desktop / Tablet / Mobile', 'Do and Dont’s'],
  Accesibilidad: [
    'Accesibilidad / WCAG 2.2',
    'Contraste del texto sobre degradado',
    'Contraste del texto sobre glass',
    'Patrones y degradados decorativos',
    'Transparencia reducida y respaldo',
    'Blur y manejo del diálogo',
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
    await expect(canvas.getByRole('heading', { level: 1, name: 'Texturas' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(Object.keys(H2));
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Definición']);
    // Tablas con nombre leídas de tokens.css
    await expect(canvas.getByRole('table', { name: 'Tokens de degradado por modo' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Tokens de efecto por modo' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Valores de referencia de textura de Figma' })).toBeInTheDocument();
    // Los cuatro patrones, con su descarga
    await expect(canvas.getAllByRole('link', { name: /^Descargar patron-lineas-/ })).toHaveLength(4);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Aplicación']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Accesibilidad']);
    await expect(canvas.getByRole('table', { name: 'Contraste del texto sobre los extremos del degradado por modo' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Contraste del texto sobre glass por modo' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Desarrollo']);
    await expect(canvas.getAllByRole('button', { name: /^Copiar código/ })).toHaveLength(9);
  },
};
