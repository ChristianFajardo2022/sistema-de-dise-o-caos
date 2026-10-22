import type { Meta, StoryObj } from '@storybook/react-vite';
import { Colores } from './Colores';

const meta = {
  title: 'Fundamentos de diseño/Colores',
  component: Colores,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Colores>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: paleta primitiva por familia */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Parámetros: dominancia de color y roles */
export const Parametros: Story = { name: 'Parámetros', args: { initialTab: 'parametros' } };

/** Pestaña Tokens: tokens semánticos de color leídos de tokens.css, oscuro y claro */
export const Tokens: Story = { name: 'Tokens', args: { initialTab: 'tokens' } };

/** Pestaña Accesibilidad: contrastes calculados desde tokens.css y buenas prácticas */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };
