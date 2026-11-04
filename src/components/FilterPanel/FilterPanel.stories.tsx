import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { FilterPanel } from './FilterPanel';
import { FilterSection } from './FilterSection';
import { countFilters } from './FilterPanel.utils';
import type { FilterPanelProps, FilterValues } from './FilterPanel.types';
import { Chip, ChipGroup } from '../Chip';
import { CheckboxTree } from '../CheckboxTree';
import { DatePicker } from '../DatePicker';
import { FilterButton } from '../FilterButton';
import { NumberPicker } from '../NumberPicker';
import { RatingFilter } from '../RatingFilter';
import { Select } from '../Select';
import { Switch } from '../Switch';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { formatLiteral } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './FilterPanel.doc';
import docsJson from './FilterPanel.docs.json';

const TEXT = 'font-ds-primitives-typography-family-primary text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-white';

const ESTADOS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'revision', label: 'En revisión' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'archivado', label: 'Archivado' },
];

const TIPOS = [
  { value: 'texto', label: 'Documentos de texto', children: [{ value: 'informe', label: 'Informe' }, { value: 'acta', label: 'Acta' }] },
  { value: 'datos', label: 'Archivos de datos', children: [{ value: 'hoja', label: 'Hoja de cálculo' }, { value: 'tabla', label: 'Tabla' }] },
];

/** Sección Estado: ChipGroup de selección múltiple unido a la sección. */
function EstadoSection() {
  return (
    <FilterSection id="estado" title="Estado">
      {({ value, onValueChange, labelId }) => (
        <ChipGroup selectionMode="multiple" aria-labelledby={labelId} value={(value as string[]) ?? []} onValueChange={onValueChange} className="flex-wrap">
          {ESTADOS.map((e) => (
            <Chip key={e.value} value={e.value} icon={false}>
              {e.label}
            </Chip>
          ))}
        </ChipGroup>
      )}
    </FilterSection>
  );
}

/** Sección Calificación: RatingFilter unido a la sección. */
function CalificacionSection() {
  return (
    <FilterSection id="calificacion" title="Calificación">
      {({ value, onValueChange, labelId }) => (
        <RatingFilter aria-labelledby={labelId} value={(value as number | null) ?? null} onValueChange={onValueChange} />
      )}
    </FilterSection>
  );
}

/**
 * Lienzo de Desarrollo (`docsLive.render`): el panel sin modal, en el flujo, con su estado de apertura. El modal se abre
 * en la capa superior y taparía la página (receta R4); con "Cerrar filtros" el panel se oculta y un FilterButton lo
 * vuelve a abrir.
 */
function DocsCanvas(args: Record<string, unknown>) {
  const { modal: _modal, open: _open, defaultOpen: _defaultOpen, ...rest } = args as Partial<FilterPanelProps>;
  const [open, setOpen] = useState(true);
  // El ancho del panel (416) sin pasarse del lienzo: en Mobile la hoja ocupa todo el ancho disponible
  return open ? (
    <div className="w-104 max-w-full">
      <FilterPanel {...rest} modal={false} open={open} onOpenChange={setOpen} defaultValue={{ estado: ['aprobado'] }}>
        <EstadoSection />
        <CalificacionSection />
      </FilterPanel>
    </div>
  ) : (
    <FilterButton aria-expanded={false} onClick={() => setOpen(true)} />
  );
}

/** Valor de una prop escrito como en JSX. */
const jsxProp = (name: string, value: unknown) =>
  typeof value === 'string' ? `${name}="${value.replace(/"/g, '&quot;')}"` : value === true ? name : `${name}={${formatLiteral(value)}}`;

/** Código de Desarrollo: el mismo panel del lienzo, con los manejadores y las secciones, listo para copiar (receta R2). */
function docsCode(args: Record<string, unknown>) {
  const { modal: _modal, open: _open, defaultOpen: _defaultOpen, children: _children, ...rest } = args;
  const props = [
    'modal={false}',
    'open={open}',
    'onOpenChange={(open) => setOpen(open)}',
    "defaultValue={{ estado: ['aprobado'] }}",
    'onApply={(values) => apply(values)}',
    ...Object.entries(rest).map(([name, value]) => jsxProp(name, value)),
  ];
  return [
    '<FilterPanel',
    ...props.map((p) => `  ${p}`),
    '>',
    '  <FilterSection id="estado" title="Estado">',
    '    {({ value, onValueChange, labelId }) => (',
    '      <ChipGroup',
    '        selectionMode="multiple"',
    '        aria-labelledby={labelId}',
    '        value={(value as string[]) ?? []}',
    '        onValueChange={onValueChange}',
    '      >',
    ...ESTADOS.map((e) => `        <Chip value="${e.value}" icon={false}>${e.label}</Chip>`),
    '      </ChipGroup>',
    '    )}',
    '  </FilterSection>',
    '  <FilterSection id="calificacion" title="Calificación">',
    '    {({ value, onValueChange, labelId }) => (',
    '      <RatingFilter',
    '        aria-labelledby={labelId}',
    '        value={(value as number | null) ?? null}',
    '        onValueChange={onValueChange}',
    '      />',
    '    )}',
    '  </FilterSection>',
    '</FilterPanel>',
  ].join('\n');
}

const meta = {
  title: 'Form Controls/FilterPanel',
  component: FilterPanel,
  parameters: {
    layout: 'fullscreen',
    docs: componentDocsParameters(doc, docsJson),
    // Apertura y modo son del lienzo (R4, R6): el panel va sin modal y su `open` lo lleva el lienzo. El código muestra
    // las secciones y los manejadores (R2)
    docsLive: { render: DocsCanvas, code: docsCode, exclude: ['modal', 'open', 'defaultOpen'] },
  },
  tags: ['autodocs'],
  // Las descripciones salen de FilterPanel.docs.json; aquí solo los controles y los tipos explícitos
  argTypes: argTypesFromDocsJson(docsJson, {
    modal: { control: 'boolean', type: { name: 'boolean' } },
    showSummary: { control: 'boolean', type: { name: 'boolean' } },
    title: { control: 'text' },
  }),
  args: { title: 'Filtros avanzados', modal: true, showSummary: true },
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Secciones de ejemplo, cada una unida a un componente existente. */
function DemoSections() {
  return (
    <>
      <EstadoSection />
      <FilterSection id="tipo" title="Tipo de documento">
        {({ value, onValueChange, labelId }) => (
          <CheckboxTree aria-labelledby={labelId} items={TIPOS} value={(value as string[]) ?? []} onValueChange={onValueChange} />
        )}
      </FilterSection>
      <FilterSection id="fecha" title="Fecha de creación">
        {({ value, onValueChange }) => (
          <DatePicker label="Desde" fullWidth value={(value as Date | null) ?? null} onValueChange={onValueChange} />
        )}
      </FilterSection>
      <FilterSection id="area" title="Área">
        {({ value, onValueChange }) => (
          <Select
            label="Área"
            fullWidth
            value={(value as string | null) ?? null}
            onValueChange={onValueChange}
            options={[
              { value: 'diseno', label: 'Diseño' },
              { value: 'producto', label: 'Producto' },
            ]}
          />
        )}
      </FilterSection>
      <FilterSection id="tamano" title="Tamaño máximo">
        {({ value, onValueChange, labelId }) => (
          <div className="flex items-center gap-ds-space-general-2xl">
            <div className="min-w-0 flex-1">
              <NumberPicker
                fullWidth
                min={0}
                aria-labelledby={labelId}
                aria-describedby={`${labelId}-unidad`}
                value={value as number | undefined}
                onValueChange={onValueChange}
              />
            </div>
            <span id={`${labelId}-unidad`} className={TEXT}>
              MB
            </span>
          </div>
        )}
      </FilterSection>
      <CalificacionSection />
      <FilterSection id="favoritos" title="Favoritos">
        {({ value, onValueChange }) => (
          <Switch checked={Boolean(value)} onCheckedChange={(on) => onValueChange(on || undefined)}>
            Solo favoritos
          </Switch>
        )}
      </FilterSection>
    </>
  );
}

/** Patrón completo: FilterButton abre el panel modal; "Aplicar" guarda los valores y el badge muestra el total. */
function ModalDemo(args: Partial<FilterPanelProps>) {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState<FilterValues>({ estado: ['aprobado'] });
  const [draft, setDraft] = useState<FilterValues>(applied);
  return (
    <div className="flex min-h-screen flex-col items-start gap-4 p-6">
      <FilterButton
        count={countFilters(applied)}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setDraft(applied);
          setOpen(true);
        }}
      />
      <p className="text-xs text-ds-text-neutral-body">Aplicados: {JSON.stringify(applied)}</p>
      <FilterPanel
        {...args}
        modal
        open={open}
        onOpenChange={setOpen}
        value={draft}
        onValueChange={setDraft}
        onApply={(v) => {
          setApplied(v);
          args.onApply?.(v);
        }}
      >
        <DemoSections />
      </FilterPanel>
    </div>
  );
}

export const Interactive: Story = {
  args: { onApply: fn() },
  render: (args) => <ModalDemo {...args} />,
};

/** En una ventana de menos de 48rem el panel modal es una hoja inferior con los botones apilados. */
export const MobileSheet: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: (args) => <ModalDemo {...args} />,
};

/** Sin modal: barra lateral en el flujo de la página (no atrapa el foco; Escape no aplica). */
export const Sidebar: Story = {
  args: { modal: false },
  render: (args) => (
    <div className="flex h-screen justify-end bg-ds-background-general-black">
      <FilterPanel {...args} modal={false} defaultValue={{ estado: ['pendiente', 'revision'], calificacion: 4 }}>
        <DemoSections />
      </FilterPanel>
    </div>
  ),
};

// Figma: 14014:6050
/** "Filters" de Figma: marco Desktop, con las cinco secciones abiertas y los textos de Figma. */
export const FigmaMatrix: Story = {
  parameters: {
    layout: 'fullscreen',
    a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }, { id: 'duplicate-id-aria', enabled: false }] } },
  },
  render: () => (
    <div className="flex w-fit bg-ds-background-general-black p-6">
      <div data-figma="Filters" className="flex h-[1080px]">
        <FilterPanel modal={false} clearLabel="Button" applyLabel="Button" onOpenChange={() => {}} surfaceProps={{ 'data-figma-part': 'Desktop' }}>
          <FilterSection id="a" title="Heading">
            <DatePicker label="Label " fullWidth rootProps={{ 'data-figma-part': 'Date picker input' }} />
          </FilterSection>
          <FilterSection id="b" title="Heading">
            <ChipGroup aria-label="Chips" className="flex-wrap" data-figma-part="List">
              {Array.from({ length: 10 }, (_, i) => (
                <Chip key={i} value={String(i)} icon={false} rootProps={{ 'data-figma-part': 'Chips' }}>
                  Text
                </Chip>
              ))}
            </ChipGroup>
          </FilterSection>
          <FilterSection id="c" title="Heading">
            <Select label="Label " fullWidth options={[{ value: 'a', label: 'Opción A' }]} />
            <Select label="Label " fullWidth options={[{ value: 'b', label: 'Opción B' }]} />
          </FilterSection>
          <FilterSection id="d" title="Heading">
            <div className="flex items-center gap-ds-space-general-2xl">
              <div className="min-w-0 flex-1">
                <NumberPicker fullWidth placeholder="00" aria-label="Cantidad" aria-describedby="filterpanel-matriz-unidad" />
              </div>
              <span id="filterpanel-matriz-unidad" className={TEXT} data-figma-part="Kilogramos">
                Kilogramos
              </span>
            </div>
          </FilterSection>
          <FilterSection id="e" title="Heading">
            <RatingFilter defaultValue={3} data-figma-part="Rating" />
          </FilterSection>
        </FilterPanel>
      </div>
    </div>
  ),
};

/** Test: elegir, conteo por sección, Limpiar de sección y global, y Aplicar con el objeto por sección. */
export const ApplyAndClearTest: Story = {
  tags: ['!autodocs'],
  args: { onApply: fn(), onValueChange: fn(), modal: false },
  render: (args) => (
    <div className="flex h-screen justify-end">
      <FilterPanel {...args} modal={false}>
        <DemoSections />
      </FilterPanel>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Ningún filtro seleccionado');

    await userEvent.click(canvas.getByRole('button', { name: 'Pendiente' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Aprobado' }));
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Documentos de texto' }));
    await expect(canvas.getByRole('button', { name: 'Estado 2 seleccionados' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Tipo de documento 2 seleccionados' })).toBeInTheDocument();
    await expect(canvas.getByRole('status')).toHaveTextContent('4 filtros seleccionados');
    // Resumen: un chip por sección con valor
    await expect(canvas.getByRole('group', { name: 'Filtros seleccionados' })).toHaveTextContent('Estado (2)');

    // Limpiar de la sección Estado
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar Estado' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('2 filtros seleccionados');
    await expect(args.onValueChange).toHaveBeenLastCalledWith({ tipo: ['informe', 'acta'] });

    // Aplicar devuelve el objeto por sección
    await userEvent.click(canvas.getByRole('button', { name: 'Aplicar' }));
    await expect(args.onApply).toHaveBeenLastCalledWith({ tipo: ['informe', 'acta'] });

    // Limpiar global deja {}
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith({});
    await expect(canvas.getByRole('status')).toHaveTextContent('Ningún filtro seleccionado');
  },
};

/** Test: el modal abre con el foco dentro, Escape cierra y el foco vuelve al FilterButton; el badge sigue lo aplicado. */
export const ModalTest: Story = {
  tags: ['!autodocs'],
  args: { onApply: fn() },
  render: (args) => <ModalDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Filtros' });
    await expect(trigger).toHaveAccessibleDescription('1 filtro aplicado');
    await userEvent.click(trigger);

    const dialog = await canvas.findByRole('dialog', { name: 'Filtros avanzados' });
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await expect(dialog.contains(document.activeElement)).toBe(true);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    await expect(trigger).toHaveFocus();

    // Abrir, elegir dos chips más y aplicar: el badge pasa a 3 y el panel se cierra
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    const panel = within(dialog);
    await userEvent.click(panel.getByRole('button', { name: 'Pendiente' }));
    await userEvent.click(panel.getByRole('button', { name: 'En revisión' }));
    await userEvent.click(panel.getByRole('button', { name: 'Aplicar' }));
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    await expect(trigger).toHaveAccessibleDescription('3 filtros aplicados');
    await expect(document.documentElement.style.overflow).toBe('');

    // Abierto, el documento no se desplaza debajo
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await expect(document.documentElement.style.overflow).toBe('hidden');

    // Quitar el último chip del resumen: el foco pasa al encabezado de la sección, no a `body`
    await userEvent.click(panel.getByRole('button', { name: 'Quitar filtro Estado' }));
    await expect(panel.queryByRole('button', { name: /^Quitar filtro/ })).not.toBeInTheDocument();
    const estadoHeader = dialog.querySelector<HTMLElement>('[data-filter-section="estado"] [data-accordion-trigger]');
    await expect(estadoHeader).not.toBeNull();
    await expect(estadoHeader).toHaveFocus();

    // Arrastrar desde la superficie y soltar en el fondo no cierra
    const heading = panel.getByRole('heading', { name: 'Filtros avanzados' });
    fireEvent.pointerDown(heading);
    fireEvent.click(dialog);
    await expect(dialog).toHaveAttribute('open');

    // Clic completo en el fondo sí cierra y suelta el bloqueo de scroll
    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    await expect(document.documentElement.style.overflow).toBe('');
  },
};

/** Página de documentación (plantilla v2): la revisan vitest y axe. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'FilterPanel' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    // Sin los títulos de los paneles de ejemplo, que también son h2 (`data-figma-part`)
    const h2 = () =>
      canvas
        .getAllByRole('heading', { level: 2 })
        .filter((h) => !h.hasAttribute('data-figma-part'))
        .map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente FilterPanel en Figma:']);
    // Marcadores de la anatomía: uno por pauta (6 del panel + 6 de la sección card + 4 de la sección plain)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(16);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de FilterPanel' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
