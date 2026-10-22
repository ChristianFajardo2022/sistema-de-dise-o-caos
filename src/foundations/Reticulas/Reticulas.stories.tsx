import type { Meta, StoryObj } from '@storybook/react-vite';
import { Reticulas } from './Reticulas';

const meta = {
  title: 'Fundamentos de diseño/Retículas',
  component: Reticulas,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Reticulas>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: pantallas, estructura, columnas, márgenes y retícula secundaria */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Valores de token: tabla de especificaciones por breakpoint leída de tokens.css */
export const ValoresDeToken: Story = { name: 'Valores de token', args: { initialTab: 'valores-de-token' } };

/** Pestaña Aplicación: composición de contenedores en la retícula y casos de uso */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };
