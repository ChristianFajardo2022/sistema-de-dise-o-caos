import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { CheckboxTree } from './CheckboxTree';
import type { CheckboxTreeNode } from './CheckboxTree.types';

const CATEGORIAS: CheckboxTreeNode[] = [
  {
    value: 'ropa',
    label: 'Ropa',
    children: [
      { value: 'camisas', label: 'Camisas' },
      { value: 'pantalones', label: 'Pantalones' },
      { value: 'chaquetas', label: 'Chaquetas' },
    ],
  },
  {
    value: 'calzado',
    label: 'Calzado',
    children: [
      { value: 'tenis', label: 'Tenis' },
      { value: 'botas', label: 'Botas', disabled: true },
    ],
  },
];

const meta = {
  title: 'Form Controls/CheckboxTree',
  component: CheckboxTree,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    contrast: { control: 'radio', options: ['positive', 'negative'], type: { name: 'enum', value: ['positive', 'negative'] } },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
  },
  args: { items: CATEGORIAS, 'aria-label': 'Categorías', contrast: 'positive', disabled: false },
} satisfies Meta<typeof CheckboxTree>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(args: Story['args']) {
  const [value, setValue] = useState<string[]>(['camisas']);
  return (
    <div className="flex w-76 flex-col gap-4">
      <CheckboxTree {...args} items={args?.items ?? CATEGORIAS} value={value} onValueChange={setValue} />
      <p className="text-xs text-ds-text-neutral-body">Marcadas: {value.join(', ') || 'ninguna'}</p>
    </div>
  );
}

export const Interactive: Story = { render: (args) => <Controlled {...args} /> };

/** Tres niveles: la madre de arriba refleja a nietas y bisnietas. */
export const Nested: Story = {
  args: {
    'aria-label': 'Zonas de entrega',
    defaultValue: ['norte-1'],
    items: [
      {
        value: 'ciudad',
        label: 'Toda la ciudad',
        children: [
          { value: 'norte', label: 'Norte', children: [{ value: 'norte-1', label: 'Sector 1' }, { value: 'norte-2', label: 'Sector 2' }] },
          { value: 'sur', label: 'Sur', children: [{ value: 'sur-1', label: 'Sector 3' }] },
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
    const ropa = canvas.getByRole('checkbox', { name: 'Ropa' });
    const camisas = canvas.getByRole('checkbox', { name: 'Camisas' });
    const pantalones = canvas.getByRole('checkbox', { name: 'Pantalones' });
    await expect(canvas.getByRole('group', { name: 'Ropa' })).toBeInTheDocument();
    await expect(ropa).not.toBePartiallyChecked();

    // Una hija marcada: la madre queda mixta
    await userEvent.click(camisas);
    await expect(ropa).toBePartiallyChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['camisas']);

    // Teclado: Tab llega a la madre y Espacio marca toda la rama
    ropa.focus();
    await userEvent.keyboard(' ');
    await expect(ropa).toBeChecked();
    await expect(ropa).not.toBePartiallyChecked();
    await expect(pantalones).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['camisas', 'pantalones', 'chaquetas']);

    // Tab pasa a la primera hija; Espacio la desmarca y la madre vuelve a mixto
    await userEvent.tab();
    await expect(camisas).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(ropa).toBePartiallyChecked();

    // Con la hoja deshabilitada, la madre de Calzado marca solo Tenis
    const calzado = canvas.getByRole('checkbox', { name: 'Calzado' });
    await userEvent.click(calzado);
    await expect(canvas.getByRole('checkbox', { name: 'Tenis' })).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: 'Botas' })).not.toBeChecked();
    await expect(calzado).toBePartiallyChecked();
    // Desde mixto con todo lo habilitado marcado, vuelve a desmarcar
    await userEvent.click(calzado);
    await expect(canvas.getByRole('checkbox', { name: 'Tenis' })).not.toBeChecked();
  },
};
