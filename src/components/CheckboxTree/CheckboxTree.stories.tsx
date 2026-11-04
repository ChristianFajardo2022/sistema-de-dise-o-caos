import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CheckboxTree } from './CheckboxTree';
import type { CheckboxTreeNode } from './CheckboxTree.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './CheckboxTree.doc';
import docsJson from './CheckboxTree.docs.json';

const CATEGORIAS: CheckboxTreeNode[] = [
  {
    value: 'documentos',
    label: 'Documentos',
    children: [
      { value: 'informes', label: 'Informes' },
      { value: 'contratos', label: 'Contratos' },
      { value: 'actas', label: 'Actas' },
    ],
  },
  {
    value: 'imagenes',
    label: 'Imágenes',
    children: [
      { value: 'fotos', label: 'Fotos' },
      { value: 'capturas', label: 'Capturas', disabled: true },
    ],
  },
];

const meta = {
  title: 'Form Controls/CheckboxTree',
  component: CheckboxTree,
  parameters: {
    layout: 'centered',
    docs: componentDocsParameters(doc, docsJson),
    // El lienzo de Desarrollo usa la forma no controlada (la que muestra el código); `value` y las referencias a otros elementos quedan fuera
    docsLive: { story: 'Interactive', exclude: ['value', 'aria-labelledby'] },
  },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    contrast: { control: 'radio', options: ['positive', 'negative'], type: { name: 'enum', value: ['positive', 'negative'] } },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
  }),
  args: { items: CATEGORIAS, 'aria-label': 'Categorías', contrast: 'positive', disabled: false },
} satisfies Meta<typeof CheckboxTree>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(args: Story['args']) {
  const [value, setValue] = useState<string[]>(['informes']);
  return (
    <div className="flex w-76 flex-col gap-4">
      <CheckboxTree {...args} items={args?.items ?? CATEGORIAS} value={value} onValueChange={setValue} />
      <p className="text-xs text-ds-text-neutral-body">Marcadas: {value.join(', ') || 'ninguna'}</p>
    </div>
  );
}

/** Forma no controlada: parte de `defaultValue` y el árbol guarda su propio estado. */
export const Interactive: Story = {
  args: { defaultValue: ['informes'] },
  render: (args) => (
    <div className="w-76">
      <CheckboxTree {...args} />
    </div>
  ),
};

/** Forma controlada: `value` y `onValueChange` con un estado propio. */
export const ControlledState: Story = { render: (args) => <Controlled {...args} /> };

/** Tres niveles: la madre de arriba refleja a las hijas y a las nietas. */
export const Nested: Story = {
  args: {
    'aria-label': 'Espacios de trabajo',
    defaultValue: ['diseno-1'],
    items: [
      {
        value: 'todos',
        label: 'Todos los espacios',
        children: [
          { value: 'diseno', label: 'Diseño', children: [{ value: 'diseno-1', label: 'Equipo 1' }, { value: 'diseno-2', label: 'Equipo 2' }] },
          { value: 'producto', label: 'Producto', children: [{ value: 'producto-1', label: 'Equipo 3' }] },
        ],
      },
    ],
  },
};

const FIGMA_ITEMS: CheckboxTreeNode[] = ['a', 'b'].map((g) => ({
  value: g,
  label: 'Text description',
  children: [1, 2].map((n) => ({ value: `${g}${n}`, label: 'Text description' })),
}));

/** Tipo "Selection tree" del set Atoms de Figma (la matriz completa de tipos está en FilterSection). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap gap-8 bg-ds-background-general-black p-6">
      {[
        { label: 'Default', value: [] as string[] },
        { label: 'Mixto', value: ['a1'] },
        { label: 'Todo', value: ['a1', 'a2', 'b1', 'b2'] },
      ].map((s) => (
        <div key={s.label} className="flex flex-col gap-2">
          <span className="text-xs text-ds-text-neutral-body">{s.label}</span>
          <div className="w-76" data-figma="Type=Selection tree">
            <CheckboxTree aria-label={`Árbol ${s.label}`} items={FIGMA_ITEMS} defaultValue={s.value} data-figma-part="List" />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Test: la madre pasa a mixto, marca toda la rama con Espacio y la desmarca; las hojas deshabilitadas no cambian. */
export const MixedStateTest: Story = {
  tags: ['!autodocs'],
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const documentos = canvas.getByRole('checkbox', { name: 'Documentos' });
    const informes = canvas.getByRole('checkbox', { name: 'Informes' });
    const contratos = canvas.getByRole('checkbox', { name: 'Contratos' });
    await expect(canvas.getByRole('group', { name: 'Documentos' })).toBeInTheDocument();
    await expect(documentos).not.toBePartiallyChecked();

    // Una hija marcada: la madre queda mixta
    await userEvent.click(informes);
    await expect(documentos).toBePartiallyChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['informes']);

    // Teclado: Tab llega a la madre y Espacio marca toda la rama
    documentos.focus();
    await userEvent.keyboard(' ');
    await expect(documentos).toBeChecked();
    await expect(documentos).not.toBePartiallyChecked();
    await expect(contratos).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['informes', 'contratos', 'actas']);

    // Tab pasa a la primera hija; Espacio la desmarca y la madre vuelve a mixto
    await userEvent.tab();
    await expect(informes).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(documentos).toBePartiallyChecked();

    // Con la hoja deshabilitada, la madre de Imágenes marca solo Fotos
    const imagenes = canvas.getByRole('checkbox', { name: 'Imágenes' });
    await userEvent.click(imagenes);
    await expect(canvas.getByRole('checkbox', { name: 'Fotos' })).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: 'Capturas' })).not.toBeChecked();
    await expect(imagenes).toBePartiallyChecked();
    // Desde mixto con todo lo habilitado marcado, vuelve a desmarcar
    await userEvent.click(imagenes);
    await expect(canvas.getByRole('checkbox', { name: 'Fotos' })).not.toBeChecked();
  },
};

/** Test: la página Docs (plantilla v2) se dibuja con su encabezado, sus secciones y la referencia de código */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'CheckboxTree' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente CheckboxTree en Figma:']);
    // Marcadores de la anatomía: uno por pauta (5 + 3 + 3)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(11);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
    const props = canvas.getByRole('table', { name: 'Props de CheckboxTree' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
    await expect(within(props).getByRole('rowheader', { name: /aria-labelledby/ })).toBeInTheDocument();
  },
};
