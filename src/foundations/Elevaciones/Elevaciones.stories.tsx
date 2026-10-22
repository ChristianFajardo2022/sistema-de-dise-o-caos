import type { Meta, StoryObj } from '@storybook/react-vite';
import { Elevaciones } from './Elevaciones';

const meta = {
  title: 'Fundamentos de diseño/Elevaciones',
  component: Elevaciones,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Elevaciones>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: lógica de los tres niveles e integración */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Valores de token: tabla de sombras leída de tokens.css */
export const ValoresDeToken: Story = { name: 'Valores de token', args: { initialTab: 'valores-de-token' } };

/** Pestaña Aplicación: usos correctos e incorrectos */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };
