import type { Meta, StoryObj } from '@storybook/react-vite';
import { Formas } from './Formas';

const meta = {
  title: 'Fundamentos de diseño/Formas',
  component: Formas,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Formas>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: formas, radio de borde y valores de línea */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Valores de token: radios y líneas leídos de tokens.css */
export const ValoresDeToken: Story = { name: 'Valores de token', args: { initialTab: 'valores-de-token' } };

/** Pestaña Aplicación: usos correctos e incorrectos de los radios */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };
