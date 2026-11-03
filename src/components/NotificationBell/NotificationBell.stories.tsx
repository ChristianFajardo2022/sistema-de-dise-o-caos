import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NotificationBell } from './NotificationBell';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './NotificationBell.doc';
import docsJson from './NotificationBell.docs.json';

const meta = {
  title: 'General Controls/NotificationBell',
  component: NotificationBell,
  tags: ['autodocs'],
  parameters: { docs: componentDocsParameters(doc, docsJson) },
  // Tipos explícitos en las uniones: sin ellos Storybook descarta los args de la URL
  argTypes: argTypesFromDocsJson(docsJson, {
    count: { control: { type: 'number', min: 0 }, type: { name: 'number' } },
    max: { control: { type: 'number', min: 1 }, type: { name: 'number' } },
    size: { control: 'radio', options: ['xs', 'sm', 'md'], type: { name: 'enum', value: ['xs', 'sm', 'md'] } },
    open: { control: 'boolean', type: { name: 'boolean' } },
    label: { control: 'text', type: { name: 'string' } },
  }),
  args: { count: 3, size: 'xs' },
} satisfies Meta<typeof NotificationBell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. */
export const Interactive: Story = {
  args: { onClick: fn() },
};

/** Con el contador pasado del máximo se lee "99+" y el nombre dice "más de 99 sin leer". */
export const Overflow: Story = {
  args: { count: 150 },
};

/** Tamaños de los botones de Figma: 32 (átomo), 48 (paneles) y 56. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <NotificationBell {...args} size="xs" />
      <NotificationBell {...args} size="sm" />
      <NotificationBell {...args} size="md" />
    </div>
  ),
};

/** Abre y cierra un panel: `open` expone `aria-expanded` y pinta Press. */
function OpenDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <NotificationBell
        size="sm"
        count={5}
        open={open}
        aria-controls="panel-demo"
        aria-haspopup="dialog"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <p id="panel-demo" className="m-0 text-ds-text-neutral-white">
          Aquí iría el panel de notificaciones.
        </p>
      )}
    </div>
  );
}
export const ControlsPanel: Story = { render: () => <OpenDemo /> };

const FIGMA = [
  { name: 'Type=Default', count: 0 },
  { name: 'Type=Icon+badge', count: 99 },
];

/** Las dos variantes de Figma (32×32). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex gap-6 bg-ds-background-general-black p-6">
      {FIGMA.map((v) => (
        <NotificationBell key={v.name} rootProps={{ 'data-figma': v.name }} count={v.count} size="xs" />
      ))}
    </div>
  ),
};

/** Test: el nombre incluye el conteo, el badge es decorativo y `aria-expanded` sigue a `open`. */
export const NameTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex items-center gap-6">
      <NotificationBell count={3} />
      <NotificationBell />
      <NotificationBell count={120} />
      <NotificationBell count={2} open aria-controls="p" />
      <div id="p" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Notificaciones, 3 sin leer' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Notificaciones' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Notificaciones, más de 99 sin leer' })).toBeInTheDocument();
    const open = canvas.getByRole('button', { name: 'Notificaciones, 2 sin leer' });
    await expect(open).toHaveAttribute('aria-expanded', 'true');
    await expect(open).toHaveAttribute('aria-controls', 'p');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Notificaciones, 3 sin leer' })).toHaveFocus();
  },
};

/** Test: la página Docs (plantilla v2) se dibuja con su encabezado, sus secciones y la referencia de código */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'NotificationBell' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente NotificationBell en Figma:']);
    await expect(canvas.getByRole('switch', { name: 'Modo oscuro' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
    // Sin Storybook no hay lienzo, código ni Personalizar: solo el bloque Props, de solo lectura
    const props = canvas.getByRole('table', { name: 'Props de NotificationBell' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
    await expect(canvas.queryByRole('group', { name: 'Personalizar' })).not.toBeInTheDocument();
  },
};
