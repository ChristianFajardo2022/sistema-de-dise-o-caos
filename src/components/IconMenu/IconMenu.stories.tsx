import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { IconMenu } from './IconMenu';
import type { IconMenuVariant } from './IconMenu.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './IconMenu.doc';
import docsJson from './IconMenu.docs.json';

const docsCode = () => `const [open, setOpen] = useState(false);

<button
  type="button"
  aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
  aria-expanded={open}
  onClick={() => setOpen(!open)}
>
  <IconMenu variant={open ? 'close' : 'menu'} />
</button>`;

const meta = {
  title: 'Navigation/Icon menu',
  component: IconMenu,
  tags: ['autodocs'],
  // El lienzo de Desarrollo es el botón de la historia Toggle: el clic alterna menu y close, y el código lo muestra con su estado
  parameters: { docs: componentDocsParameters(doc, docsJson), docsLive: { story: 'Toggle', code: docsCode, exclude: ['variant', 'aria-label'] } },
  argTypes: argTypesFromDocsJson(docsJson, {
    variant: {
      control: 'radio',
      options: ['menu', 'half', 'close'],
      type: { name: 'enum', value: ['menu', 'half', 'close'] },
      description: 'Property 1 de Figma: 1 menu, 2 half, 3 close',
    },
  }),
  args: { variant: 'menu' },
  decorators: [
    (Story, { parameters }) =>
      parameters.sinMarco ? (
        <Story />
      ) : (
        <div className="bg-ds-background-container-surface p-6">
          <Story />
        </div>
      ),
  ],
} satisfies Meta<typeof IconMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. */
export const Interactive: Story = { parameters: { sinMarco: true } };

function ToggleDemo() {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="inline-flex size-8 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
    >
      <IconMenu variant={open ? 'close' : 'menu'} />
    </button>
  );
}

/** Dentro de un botón con nombre: el dibujo es decorativo y las rayas se mueven al cambiar de estado. */
export const Toggle: Story = { parameters: { sinMarco: true }, render: () => <ToggleDemo /> };

const VARIANTS: { name: string; variant: IconMenuVariant }[] = [
  { name: '1', variant: 'menu' },
  { name: '2', variant: 'half' },
  { name: '3', variant: 'close' },
];

/** Los tres Property 1 del set de Figma. */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex items-center gap-8 bg-ds-background-container-surface p-6">
      {VARIANTS.map((v) => (
        <div key={v.name} data-figma={`Property 1=${v.name}`} className="size-8">
          <IconMenu variant={v.variant} />
        </div>
      ))}
    </div>
  ),
};

/** Test: decorativo por defecto, y con `aria-label` es una imagen con nombre; el botón cambia su nombre. */
export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex items-center gap-4 bg-ds-background-container-surface p-6">
      <ToggleDemo />
      <IconMenu aria-label="Menú" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Menú' })).toBeVisible();
    const button = canvas.getByRole('button', { name: 'Abrir menú' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await expect(canvas.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true');
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Icon menu' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Icon menu en Figma:']);
    await expect(canvas.getByRole('switch', { name: 'Modo oscuro' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
    const props = canvas.getByRole('table', { name: 'Props de IconMenu' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
    await expect(canvas.queryByRole('group', { name: 'Personalizar' })).not.toBeInTheDocument();
  },
};
