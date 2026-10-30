import type { Meta, StoryObj } from '@storybook/react';
import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { FilterSection } from './FilterSection';
import type { FilterValue } from './FilterPanel.types';
import { Checkbox } from '../Checkbox';
import { CheckboxTree } from '../CheckboxTree';
import type { CheckboxTreeNode } from '../CheckboxTree';
import { Chip, ChipGroup } from '../Chip';
import type { ChipColor } from '../Chip';
import { DatePicker } from '../DatePicker';
import { FilterTabs } from '../FilterTabs';
import type { FilterTabsTab } from '../FilterTabs';
import { Input } from '../Input';
import { NumberPicker } from '../NumberPicker';
import { Radio } from '../Radio';
import { RatingFilter } from '../RatingFilter';
import { Select } from '../Select';
import { Slider } from '../Slider';
import { Switch } from '../Switch';

const meta = {
  title: 'Form Controls/FilterSection',
  component: FilterSection,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'radio', options: ['card', 'plain'], type: { name: 'enum', value: ['card', 'plain'] } },
    icon: { control: 'boolean', type: { name: 'boolean' } },
    clearable: { control: 'boolean', type: { name: 'boolean' } },
  },
  args: { id: 'color', title: 'Color', variant: 'card', icon: true, clearable: true },
} satisfies Meta<typeof FilterSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const COLORES = [
  { value: 'rojo', label: 'Rojo' },
  { value: 'azul', label: 'Azul' },
  { value: 'verde', label: 'Verde' },
  { value: 'negro', label: 'Negro' },
];

/** Sección suelta con ChipGroup conectado por la función hija. */
export const Interactive: Story = {
  args: { defaultValue: ['azul'] },
  render: (args) => (
    <div className="w-96 bg-ds-background-container-default-on-canva p-6">
      <FilterSection {...args}>
        {({ value, onValueChange }) => (
          <ChipGroup
            selectionMode="multiple"
            aria-label="Colores"
            value={(value as string[] | undefined) ?? []}
            onValueChange={onValueChange}
            className="flex-wrap"
          >
            {COLORES.map((c) => (
              <Chip key={c.value} value={c.value} icon={false}>
                {c.label}
              </Chip>
            ))}
          </ChipGroup>
        )}
      </FilterSection>
    </div>
  ),
};

/** "Individual filter": título y chips sin tarjeta, para un filtro suelto en la página. */
export const Plain: Story = {
  args: { variant: 'plain', id: 'talla', title: 'Talla', defaultValue: ['m'] },
  render: (args) => (
    <div className="w-[554px]">
      <FilterSection {...args}>
        {({ value, onValueChange, labelId }) => (
          <ChipGroup
            selectionMode="multiple"
            aria-labelledby={labelId}
            value={(value as string[] | undefined) ?? []}
            onValueChange={onValueChange}
            className="flex-wrap"
          >
            {['S', 'M', 'L', 'XL'].map((t) => (
              <Chip key={t} value={t.toLowerCase()} icon={false}>
                {t}
              </Chip>
            ))}
          </ChipGroup>
        )}
      </FilterSection>
    </div>
  ),
};

// ───────────── Matriz de Figma: tipos del set Atoms ─────────────

const TEXT = 'font-ds-primitives-typography-family-primary text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-white';

const TREE: CheckboxTreeNode[] = ['a', 'b'].map((g) => ({
  value: g,
  label: 'Text description',
  children: [1, 2].map((n) => ({ value: `${g}${n}`, label: 'Text description' })),
}));

const TABS: FilterTabsTab[] = [1, 2, 3].map((n) => ({
  value: String(n),
  label: 'Heading',
  icon: 'heart',
  options: [1, 2, 3].map((o) => ({ value: `${n}-${o}`, label: 'Text description' })),
}));

// Los ocho puntos de Figma (tono strong): acent-firts, acent-secondary, tertiary-secondary, success/alert/error/
// information-secondary y acent-firts otra vez
const CHIP_COLORS: ChipColor[] = ['purple', 'violet', 'blue', 'green', 'yellow', 'red', 'cyan', 'purple'];

function Toggles() {
  const base = useId();
  return [1, 2, 3].map((n) => (
    <div key={n} className="flex items-center gap-ds-space-general-2xl" data-figma-part="Toogle">
      <span id={`${base}-${n}`} className={`flex-1 ${TEXT}`} data-figma-part="Text">
        Text
      </span>
      <Switch aria-labelledby={`${base}-${n}`} data-figma-part="Toggle" />
    </div>
  ));
}

/** "Weight": NumberPicker con la unidad visible asociada como descripción. */
function Weight() {
  const unitId = `${useId()}-unidad`;
  return (
    <>
      <div className="min-w-0 flex-1">
        <NumberPicker
          fullWidth
          placeholder="00"
          aria-label="Peso"
          aria-describedby={unitId}
          rootProps={{ 'data-figma-part': 'Number picker input' }}
        />
      </div>
      <span id={unitId} className={TEXT} data-figma-part="Kilogramos">
        Kilogramos
      </span>
    </>
  );
}

function Radios() {
  const name = useId();
  return [1, 2, 3].map((n) => (
    <Radio key={n} name={name} value={String(n)} className="flex w-full" data-figma-part="Selection">
      <span data-figma-part="Text description">Text description</span>
    </Radio>
  ));
}

const ATOMS: { type: string; className: string; render: () => ReactNode }[] = [
  {
    type: 'Rate date',
    className: 'flex-col',
    render: () => <DatePicker label="Label " fullWidth rootProps={{ 'data-figma-part': 'Date picker input' }} />,
  },
  {
    type: 'Chips',
    className: 'flex-col',
    render: () => (
      <ChipGroup aria-label="Chips" className="flex-wrap" data-figma-part="List">
        {Array.from({ length: 10 }, (_, i) => (
          <Chip key={i} value={String(i)} icon={false} rootProps={{ 'data-figma-part': 'Chips' }}>
            Text
          </Chip>
        ))}
      </ChipGroup>
    ),
  },
  {
    type: 'Chips colors',
    className: 'flex-col',
    render: () => (
      <ChipGroup aria-label="Chips de color" className="flex-wrap" data-figma-part="List">
        {CHIP_COLORS.map((color, i) => (
          <Chip key={i} value={String(i)} type="primary-color" color={color} tone="strong" rootProps={{ 'data-figma-part': 'Chips' }}>
            Text
          </Chip>
        ))}
      </ChipGroup>
    ),
  },
  {
    type: 'Dropdown',
    className: 'flex-col',
    render: () => (
      <>
        <Select label="Label " fullWidth options={[{ value: 'a', label: 'Opción A' }]} />
        <Select label="Label " fullWidth options={[{ value: 'b', label: 'Opción B' }]} />
      </>
    ),
  },
  {
    type: 'Weight',
    className: 'flex-row items-center',
    render: () => <Weight />,
  },
  { type: 'Rating', className: 'flex-col', render: () => <RatingFilter defaultValue={3} data-figma-part="Rating" /> },
  { type: 'Toogles', className: 'flex-col', render: () => <Toggles /> },
  {
    type: 'Checkbox',
    className: 'flex-col',
    render: () => (
      <div role="group" aria-label="Casillas" className="flex flex-col gap-ds-space-general-2xl" data-figma-part="List">
        {[1, 2, 3].map((n) => (
          <Checkbox key={n} className="flex w-full">
            <span data-figma-part="Text description">Text description</span>
          </Checkbox>
        ))}
      </div>
    ),
  },
  {
    type: 'Selection tree',
    className: 'flex-col',
    render: () => <CheckboxTree aria-label="Árbol" items={TREE} data-figma-part="List" />,
  },
  {
    type: 'Radiobutton',
    className: 'flex-col',
    render: () => (
      <div role="radiogroup" aria-label="Opciones" className="flex flex-col gap-ds-space-general-2xl">
        <Radios />
      </div>
    ),
  },
  {
    type: 'Quantity',
    className: 'flex-row items-center',
    render: () => (
      <>
        <div className="min-w-0 flex-1">
          <Input label="Label " fullWidth inputMode="numeric" rootProps={{ 'data-figma-part': 'General input' }} />
        </div>
        <span className={TEXT} data-figma-part="a">
          a
        </span>
        <div className="min-w-0 flex-1">
          <Input label="Label " fullWidth inputMode="numeric" rootProps={{ 'data-figma-part': 'General input' }} />
        </div>
      </>
    ),
  },
  {
    type: 'Quantit 2',
    className: 'flex-row',
    render: () => (
      <div className="flex w-full flex-col gap-ds-space-general-2xl" data-figma-part="Container">
        <div className="flex gap-ds-space-general-2xl" data-figma-part="Texts">
          <span className={`flex-1 ${TEXT}`} data-figma-part="Min.">
            Min.
          </span>
          <span className={`flex-1 ${TEXT}`} data-figma-part="Max.">
            Max.
          </span>
        </div>
        <Slider defaultValue={[25, 75]} showValue aria-label="Rango" data-figma-part="Slide bar" />
      </div>
    ),
  },
  { type: 'Tabs', className: 'flex-col', render: () => <FilterTabs tabs={TABS} aria-label="Pestañas" data-figma-part="Filter tabs" /> },
];

// Figma: 13874:43337
/**
 * Los 13 tipos del set "Atoms": el contenido de una sección armado con componentes existentes.
 * "Weight" es un NumberPicker con unidad; "Quantity", un rango escrito (dos Input con "a" entre ellos); "Quantit 2", el
 * mismo rango con Slider de dos pulgares y las etiquetas Mín./Máx.; "Selection tree", el CheckboxTree.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded', a11y: { config: { rules: [{ id: 'duplicate-id-aria', enabled: false }] } } },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-8 bg-ds-background-general-black p-6">
      {ATOMS.map((a) => (
        <div key={a.type} className="flex flex-col gap-2">
          <span className="text-xs text-ds-text-neutral-body">Type={a.type}</span>
          <div data-figma={`Type=${a.type}`} className={`flex w-76 gap-ds-space-general-2xl ${a.className}`}>
            {a.render()}
          </div>
        </div>
      ))}
    </div>
  ),
};

// Figma: 15489:48186
/** "Individual filter": título y chips, sin tarjeta. */
export const FigmaMatrixIndividual: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="w-full max-w-[602px] bg-ds-background-general-black p-6">
      <FilterSection id="muestra" variant="plain" title="Heading" className="w-full max-w-[554px]" data-figma="Individual filter">
        <ChipGroup aria-label="Opciones" className="flex-wrap" data-figma-part="List">
          {['Ácido', 'Ajustado'].map((t) => (
            <Chip key={t} value={t} icon={false} rootProps={{ 'data-figma-part': 'Chips' }}>
              {t}
            </Chip>
          ))}
        </ChipGroup>
      </FilterSection>
    </div>
  ),
};

/** Test: el conteo del título sigue al valor y "Limpiar" lo quita (sección suelta, no controlada). */
export const ClearTest: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: ['azul', 'rojo'] },
  render: Interactive.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Color 2 seleccionados' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Verde' }));
    await expect(canvas.getByRole('button', { name: 'Color 3 seleccionados' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar Color' }));
    await expect(canvas.getByRole('button', { name: 'Color' })).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Limpiar Color' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Color' })).toHaveFocus();
    await expect(canvas.getByRole('button', { name: 'Verde' })).toHaveAttribute('aria-pressed', 'false');
  },
};

function ControlledSection() {
  const [value, setValue] = useState<FilterValue>(['azul']);
  return (
    <div className="w-96 bg-ds-background-container-default-on-canva p-6">
      <FilterSection id="color" title="Color" value={value} onValueChange={setValue}>
        {({ value: current, onValueChange }) => (
          <ChipGroup
            selectionMode="multiple"
            aria-label="Colores"
            value={(current as string[] | undefined) ?? []}
            onValueChange={onValueChange}
            className="flex-wrap"
          >
            {COLORES.map((c) => (
              <Chip key={c.value} value={c.value} icon={false}>
                {c.label}
              </Chip>
            ))}
          </ChipGroup>
        )}
      </FilterSection>
      <output data-testid="valor">{JSON.stringify(value) ?? 'sin valor'}</output>
    </div>
  );
}

/** Test: suelta y controlada, "Limpiar" deja el valor en `undefined` y la sección se vacía (no vuelve al último valor). */
export const ClearControlledTest: Story = {
  tags: ['!autodocs'],
  render: () => <ControlledSection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Color 1 seleccionado' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar Color' }));
    await expect(canvas.getByTestId('valor')).toHaveTextContent('sin valor');
    await expect(canvas.getByRole('button', { name: 'Color' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Azul' })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Rojo' }));
    await expect(canvas.getByTestId('valor')).toHaveTextContent('["rojo"]');
  },
};
