import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Elevaciones } from './Elevaciones';

const meta = {
  title: 'Fundamentos de diseño/Elevaciones',
  component: Elevaciones,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Elevaciones>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: los tres niveles, su integración y las sombras de tokens.css. */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Aplicación: dónde va cada nivel, la composición por breakpoint y Do and Dont’s. */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };

/** Pestaña Accesibilidad: delimitación, colores forzados, foco y diálogo, y movimiento. */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };

/** Pestaña Desarrollo: aplicar en Figma, consumo técnico y auditoría. */
export const Desarrollo: Story = { name: 'Desarrollo', args: { initialTab: 'desarrollo' } };

const H2 = {
  Definición: ['Definición y propósito', 'Lógica de elevación', 'Integración de elevaciones', 'Variables / Elevaciones'],
  Aplicación: ['Dónde va cada nivel', 'Desktop / Tablet / Mobile', 'Do and Dont’s'],
  Accesibilidad: [
    'Accesibilidad / WCAG 2.2',
    'Contraste de la superficie y el borde',
    'Colores forzados',
    'Flotantes: foco y diálogo',
    'Movimiento',
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
    await expect(canvas.getByRole('heading', { level: 1, name: 'Elevaciones' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(Object.keys(H2));
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Definición']);
    // Tablas con nombre leídas de tokens.css
    await expect(canvas.getByRole('table', { name: 'Valores de los tokens de sombra por modo y breakpoint' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Qué cambia por breakpoint en cada sombra' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Valores de referencia de sombra de Figma' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Aplicación']);
    await expect(canvas.getByRole('table', { name: 'Sombra y componentes de cada nivel' })).toBeInTheDocument();
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Accesibilidad']);
    await expect(canvas.getByRole('table', { name: 'Contraste de superficies y bordes contra su fondo por modo' })).toBeInTheDocument();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Desarrollo']);
    await expect(canvas.getAllByRole('button', { name: /^Copiar código/ })).toHaveLength(6);
  },
};
