import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FloatButton } from './FloatButton';
import type { FloatButtonBaseProps } from './FloatButton.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './FloatButton.doc';
import docsJson from './FloatButton.docs.json';

/** Args de Storybook: props base más texto (los args son parciales y no exigen aria-label). */
type FloatButtonArgs = FloatButtonBaseProps & { children?: string };

const meta: Meta<FloatButtonArgs> = {
  title: 'General Controls/FloatButton',
  component: FloatButton as unknown as ComponentType<FloatButtonArgs>,
  parameters: { layout: 'centered', docs: componentDocsParameters(doc, docsJson) },
  tags: ['autodocs'],
  // Las descripciones salen de FloatButton.docs.json; aquí solo los controles y los tipos explícitos
  argTypes: argTypesFromDocsJson(docsJson, {
    icon: { control: 'text' },
    children: { control: 'text' },
    state: {
      type: { name: 'enum', value: ['default', 'hover', 'press', 'focus'] },
      control: 'select',
      options: ['default', 'hover', 'press', 'focus'],
    },
  }),
  args: { icon: 'heart', 'aria-label': 'Favoritos', state: 'default', onClick: fn() },
};

export default meta;
type Story = StoryObj<FloatButtonArgs>;

export const Interactive: Story = {};

export const WithText: Story = { args: { children: 'Crear', 'aria-label': undefined } };

/** La posición la decide quien lo usa: aquí, fijo abajo a la derecha del recuadro. */
export const Positioned: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="relative h-64 w-full bg-ds-background-general-black">
      <FloatButton {...(args as React.ComponentProps<typeof FloatButton>)} className="absolute right-6 bottom-6" />
    </div>
  ),
};

// Figma: 21900:67738
/** Status=Icon single y With text de Figma. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-6 bg-ds-background-general-black p-6">
      <FloatButton data-figma="Status=Icon single" aria-label="Favoritos" />
      <FloatButton data-figma="Status=With text">Crear</FloatButton>
    </div>
  ),
};

/** Aspecto de hover, press y foco (no definidos en Figma). */
export const States: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-6 bg-ds-background-general-black p-6">
      {(['default', 'hover', 'press', 'focus'] as const).map((s) => (
        <FloatButton key={s} state={s} aria-label={`Favoritos ${s}`} />
      ))}
    </div>
  ),
};

/** Test: solo ícono tiene nombre accesible; Enter y Espacio lo activan. */
export const IconOnlyTest: Story = {
  tags: ['!autodocs'],
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Favoritos' });
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

/** Test: con texto, el texto es el nombre accesible. */
export const WithTextTest: Story = {
  tags: ['!autodocs'],
  args: { children: 'Crear', 'aria-label': undefined },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Crear' })).toBeVisible();
  },
};

/** Test: la página Docs (plantilla v2) se dibuja con su encabezado, sus secciones y la referencia de código */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'FloatButton' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente FloatButton en Figma:']);
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
    const props = canvas.getByRole('table', { name: 'Props de FloatButton' });
    await expect(within(props).getByRole('rowheader', { name: /state/ })).toBeInTheDocument();
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
