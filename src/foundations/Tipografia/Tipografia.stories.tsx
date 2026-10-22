import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tipografia } from './Tipografia';

const meta = {
  title: 'Fundamentos de diseño/Tipografía',
  component: Tipografia,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Tipografia>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: fuentes, familia, tamaños, interlineado y jerarquía */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Parámetros: categorías tipográficas y tablas leídas de tokens.css */
export const Parametros: Story = { name: 'Parámetros', args: { initialTab: 'parametros' } };

/** Pestaña Accesibilidad: buenas prácticas */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };
