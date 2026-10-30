import type { Meta, StoryObj } from '@storybook/react-vite';
import { VozYTono } from './VozYTono';

const meta = {
  title: 'Fundamentos de diseño/Voz y tono',
  component: VozYTono,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof VozYTono>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Voz: propósito, atributos, checklist y audiencias */
export const Voz: Story = { args: { initialTab: 'voz' } };

/** Pestaña Tono: cómo cambia el tono según la situación y cómo elegirlo */
export const Tono: Story = { args: { initialTab: 'tono' } };

/** Pestaña Cómo escribimos: persona, estilo, estructura, botones, campos y lenguaje neutro */
export const ComoEscribimos: Story = { name: 'Cómo escribimos', args: { initialTab: 'como-escribimos' } };

/** Pestaña Mecánica: mayúsculas, formatos, límites, abreviaturas y accesibilidad */
export const Mecanica: Story = { name: 'Mecánica', args: { initialTab: 'mecanica' } };

/** Pestaña Patrones: fórmulas por componente con muestras vivas de CAOS */
export const Patrones: Story = { args: { initialTab: 'patrones' } };

/** Pestaña Glosario: términos aprobados, definiciones y usos a evitar */
export const Glosario: Story = { args: { initialTab: 'glosario' } };

/** Pestaña Revisión: puntos que revisa cada componente nuevo */
export const Revision: Story = { name: 'Revisión', args: { initialTab: 'revision' } };

/** Pestaña Anexo: fundamentos de UX Writing */
export const Anexo: Story = { args: { initialTab: 'anexo' } };
