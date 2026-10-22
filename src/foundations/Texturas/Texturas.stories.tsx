import type { Meta, StoryObj } from '@storybook/react-vite';
import { Texturas } from './Texturas';

const meta = {
  title: 'Fundamentos de diseño/Texturas',
  component: Texturas,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Texturas>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: degradado, glass, blur y recursos de textura */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Valores de token: tokens de degradado y efecto de tokens.css, y valores de referencia de diseño */
export const ValoresDeToken: Story = { name: 'Valores de token', args: { initialTab: 'valores-de-token' } };

/** Pestaña Aplicación: usos correctos e incorrectos de degradados y glass */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };
