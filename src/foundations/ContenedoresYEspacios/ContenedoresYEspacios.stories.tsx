import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContenedoresYEspacios } from './ContenedoresYEspacios';

const meta = {
  title: 'Fundamentos de diseño/Contenedores y espacios',
  component: ContenedoresYEspacios,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ContenedoresYEspacios>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: jerarquía de contenedores, padding, gap y escala de equivalencias */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Valores de token: escala de espacios leída de tokens.css, con valores por breakpoint */
export const ValoresDeToken: Story = { name: 'Valores de token', args: { initialTab: 'valores-de-token' } };

/** Pestaña Aplicación: usos correctos e incorrectos */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };
