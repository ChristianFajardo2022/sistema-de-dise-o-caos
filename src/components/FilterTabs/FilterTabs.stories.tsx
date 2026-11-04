import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { buildCode } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './FilterTabs.doc';
import docsJson from './FilterTabs.docs.json';
import { FilterTabs } from './FilterTabs';
import type { FilterTabsProps, FilterTabsTab } from './FilterTabs.types';

const TABS: FilterTabsTab[] = [
  {
    value: 'fecha',
    label: 'Fecha',
    icon: 'calendar',
    options: [
      { value: 'hoy', label: 'Hoy' },
      { value: 'semana', label: 'Esta semana' },
      { value: 'mes', label: 'Este mes' },
    ],
  },
  {
    value: 'estado',
    label: 'Estado',
    icon: 'tag',
    options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'aprobado', label: 'Aprobado' },
      { value: 'rechazado', label: 'Rechazado' },
    ],
  },
  {
    value: 'tipo',
    label: 'Tipo',
    icon: 'document',
    options: [
      { value: 'informe', label: 'Informe' },
      { value: 'acta', label: 'Acta' },
      { value: 'presentacion', label: 'Presentación' },
    ],
  },
];

const TAB_VALUES = TABS.map((t) => t.value);

const meta = {
  title: 'Form Controls/FilterTabs',
  component: FilterTabs,
  parameters: {
    layout: 'centered',
    docs: componentDocsParameters(doc, docsJson),
    docsLive: {
      story: 'Interactive',
      // El render guarda las opciones marcadas y `tabs` es una lista de objetos: sin control (siguen en Props)
      exclude: ['tabs', 'value', 'defaultValue', 'tab'],
      // El código copiable declara `tabs` y el estado de `value`; el generado omite las funciones
      code: ({ tabs: _tabs, value: _value, defaultValue: _defaultValue, tab: _tab, ...a }: Record<string, unknown>) => {
        const code = buildCode('FilterTabs', { tabs: '__TABS__', value: '__VALUE__', ...a }, { defaultTab: 'fecha', showCounts: true, contrast: 'on-canva', checkboxContrast: 'positive', 'aria-label': 'Categorías' });
        return code
          .replace('tabs="__TABS__"', 'tabs={tabs}')
          .replace('value="__VALUE__"', 'value={value}\n  onValueChange={(value) => setValue(value)}');
      },
    },
  },
  tags: ['autodocs'],
  decorators: [(Story, { parameters }) => (parameters.sinMarco ? <Story /> : <div className="w-80 max-w-full"><Story /></div>)],
  // Tipos explícitos en las uniones: sin ellos Storybook descarta los args que vienen por URL
  argTypes: argTypesFromDocsJson(docsJson, {
    contrast: { control: 'radio', options: ['on-canva', 'on-card'], type: { name: 'enum', value: ['on-canva', 'on-card'] } },
    showCounts: { control: 'boolean', type: { name: 'boolean' } },
    checkboxContrast: { control: 'radio', options: ['positive', 'negative'], type: { name: 'enum', value: ['positive', 'negative'] } },
    defaultTab: { control: 'select', options: TAB_VALUES, type: { name: 'enum', value: TAB_VALUES } },
  }),
  args: { tabs: TABS, defaultValue: ['aprobado'], contrast: 'on-canva', showCounts: true, defaultTab: 'fecha' },
} satisfies Meta<typeof FilterTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveDemo({ value: _value, defaultValue, onValueChange, ...args }: FilterTabsProps) {
  const [value, setValue] = useState<string[]>(defaultValue ?? []);
  return (
    <FilterTabs
      {...args}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
    />
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
};

const FIGMA_TABS: FilterTabsTab[] = [1, 2, 3].map((n) => ({
  value: String(n),
  label: 'Heading',
  icon: 'heart',
  options: [1, 2, 3].map((o) => ({ value: `${n}-${o}`, label: 'Text description' })),
}));

/** Type=3/2/1 de Figma: la pestaña seleccionada. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded', sinMarco: true },
  render: () => (
    <div className="flex flex-wrap gap-6 bg-ds-background-general-black p-6">
      {(['3', '2', '1'] as const).map((type) => (
        <div key={type} className="flex flex-col gap-2">
          <span className="text-xs text-ds-text-neutral-body">Type={type}</span>
          <FilterTabs className="w-76 max-w-full" tabs={FIGMA_TABS} defaultTab={type} aria-label={`Categorías ${type}`} data-figma={`Type=${type}`} />
        </div>
      ))}
    </div>
  ),
};

/** Test: flechas cambian de pestaña (APG Tabs) y el conteo de la pestaña sigue a las casillas marcadas. */
export const SelectionTest: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: [], onValueChange: fn(), onTabChange: fn(), defaultTab: undefined },
  render: (args) => <InteractiveDemo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const fecha = canvas.getByRole('tab', { name: 'Fecha' });
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Esta semana' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['semana']);
    await expect(canvas.getByRole('tab', { name: 'Fecha 1 seleccionada' })).toBe(fecha);

    fecha.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Estado' })).toHaveAttribute('aria-selected', 'true');
    await expect(args.onTabChange).toHaveBeenLastCalledWith('estado');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Aprobado' }));
    // El orden de la lista es el de las pestañas
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['semana', 'aprobado']);
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', sinMarco: true },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'FilterTabs' })).toBeInTheDocument();
    // Las muestras traen sus propias pestañas: las de la página son las tres primeras del documento
    const tabs = canvas.getAllByRole('tab').slice(0, 3);
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente FilterTabs en Figma:']);
    await expect(canvas.getByRole('switch', { name: 'Modo oscuro' })).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('[data-doc-mark]').length).toBeGreaterThan(0);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
    // Sin Storybook no hay lienzo, código ni Personalizar: solo el bloque Props, de solo lectura
    const props = canvas.getByRole('table', { name: 'Props de FilterTabs' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
    await expect(canvas.queryByRole('group', { name: 'Personalizar' })).not.toBeInTheDocument();
  },
};
