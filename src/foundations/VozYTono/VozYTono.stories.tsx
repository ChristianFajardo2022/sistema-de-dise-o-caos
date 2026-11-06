import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { VozYTono } from './VozYTono';

const meta = {
  title: 'Fundamentos de diseño/Voz y tono',
  component: VozYTono,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof VozYTono>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pestaña Definición: voz, atributos, audiencias, tono y glosario. */
export const Definicion: Story = { name: 'Definición', args: { initialTab: 'definicion' } };

/** Pestaña Aplicación: cómo escribimos, mecánica de escritura y patrones por componente con muestras vivas. */
export const Aplicacion: Story = { name: 'Aplicación', args: { initialTab: 'aplicacion' } };

/** Pestaña Accesibilidad: lenguaje claro, enlaces, etiquetas, errores y textos para lectores de pantalla. */
export const Accesibilidad: Story = { name: 'Accesibilidad', args: { initialTab: 'accesibilidad' } };

/** Pestaña Desarrollo: revisión de textos de un componente nuevo, fundamentos de UX Writing y consumo técnico. */
export const Desarrollo: Story = { name: 'Desarrollo', args: { initialTab: 'desarrollo' } };

const H2 = {
  Definición: [
    'Propósito de la guía',
    'Ruta rápida',
    'Voz en 30 segundos',
    'Checklist antes de publicar',
    'La voz de Inter Rapidísimo',
    'Atributos de la voz',
    'Somos / No somos',
    'Para quién escribimos',
    'Tono',
    'Tono en un flujo',
    'Mapa de tonos por situación',
    'Cómo elegir el tono en 4 preguntas',
    'Glosario',
  ],
  Aplicación: [
    'Persona y trato',
    'Estilo',
    'Estructura sin relleno',
    'Botones',
    'Campos',
    'Lenguaje neutro',
    'Mecánica de escritura',
    'Límites de caracteres',
    'Abreviaturas',
    'Patrones por componente',
    'Así se ve en los componentes',
  ],
  Accesibilidad: [
    'Accesibilidad / WCAG 2.2',
    'Accesibilidad aplicada',
    'Enlaces, botones y etiquetas',
    'Mensajes de error',
    'Cómo lo lee un lector de pantalla',
    'Textos alternativos y aria-label',
  ],
  Desarrollo: ['Revisión de textos de un componente nuevo', 'Cómo se usa al crear un componente', 'Fundamentos de UX Writing', 'Consumo técnico'],
};

/** Test de la página: h1, las cuatro pestañas (clic y flechas) y los h2 de cada una. Oculto en el menú. */
export const DocPageTest: Story = {
  tags: ['!dev'],
  args: { initialTab: 'definicion' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Voz y tono' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(Object.keys(H2));
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Definición']);
    await expect(canvas.getByRole('table', { name: 'Ruta rápida: qué necesitas y dónde está' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Mapa de tonos por situación' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Aplicación']);
    await expect(canvas.getByRole('table', { name: 'Mecánica de escritura' })).toBeInTheDocument();
    await expect(canvas.getByRole('table', { name: 'Patrones de mensajes por componente' })).toBeInTheDocument();
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Accesibilidad']);
    await expect(canvas.getByRole('table', { name: 'Accesibilidad aplicada a los textos' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', { name: /^Copiar código/ })).toHaveLength(1);
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[3]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(H2['Desarrollo']);
    await expect(canvas.getByRole('table', { name: 'Revisión de textos de un componente nuevo' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', { name: /^Copiar código/ })).toHaveLength(2);
  },
};
