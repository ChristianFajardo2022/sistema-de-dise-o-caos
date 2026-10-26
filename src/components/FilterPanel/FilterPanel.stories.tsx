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

const meta = {
  title: 'Form Controls/FilterPanel',
  component: FilterPanel,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    modal: { control: 'boolean', type: { name: 'boolean' } },
    showSummary: { control: 'boolean', type: { name: 'boolean' } },
    title: { control: 'text' },
  },
  args: { title: 'Filtros avanzados', modal: true, showSummary: true },
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const TEXT = 'font-ds-primitives-typography-family-primary text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-white';

const CATEGORIAS = [
  { value: 'ropa', label: 'Ropa', children: [{ value: 'camisas', label: 'Camisas' }, { value: 'pantalones', label: 'Pantalones' }] },
  { value: 'calzado', label: 'Calzado', children: [{ value: 'tenis', label: 'Tenis' }, { value: 'botas', label: 'Botas' }] },
];

/** Secciones de ejemplo, cada una conectada con un componente existente. */
function DemoSections() {
  return (
    <>
      <FilterSection id="categoria" title="Categoría">
        {({ value, onValueChange, labelId }) => (
          <CheckboxTree aria-labelledby={labelId} items={CATEGORIAS} value={(value as string[]) ?? []} onValueChange={onValueChange} />
        )}
      </FilterSection>
      <FilterSection id="color" title="Color">
        {({ value, onValueChange, labelId }) => (
          <ChipGroup selectionMode="multiple" aria-labelledby={labelId} value={(value as string[]) ?? []} onValueChange={onValueChange} className="flex-wrap">
            {['Rojo', 'Azul', 'Verde', 'Negro', 'Blanco'].map((c) => (
              <Chip key={c} value={c.toLowerCase()} icon={false}>
                {c}
              </Chip>
            ))}
          </ChipGroup>
        )}
      </FilterSection>
      <FilterSection id="fecha" title="Fecha de publicación">
        {({ value, onValueChange }) => (
          <DatePicker label="Desde" fullWidth value={(value as Date | null) ?? null} onValueChange={onValueChange} />
        )}
      </FilterSection>
      <FilterSection id="ciudad" title="Ciudad">
        {({ value, onValueChange }) => (
          <Select
            label="Ciudad"
            fullWidth
            value={(value as string | null) ?? null}
            onValueChange={onValueChange}
            options={[
              { value: 'norte', label: 'Ciudad del Norte' },
              { value: 'sur', label: 'Ciudad del Sur' },
            ]}
          />
        )}
      </FilterSection>
      <FilterSection id="peso" title="Peso máximo">
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
              Kilogramos
            </span>
          </div>
        )}
      </FilterSection>
      <FilterSection id="calificacion" title="Calificación">
        {({ value, onValueChange, labelId }) => (
          <RatingFilter aria-labelledby={labelId} value={(value as number | null) ?? null} onValueChange={onValueChange} />
        )}
      </FilterSection>
      <FilterSection id="envio" title="Envío">
        {({ value, onValueChange }) => (
          <Switch checked={Boolean(value)} onCheckedChange={(on) => onValueChange(on || undefined)}>
            Solo con envío gratis
          </Switch>
        )}
      </FilterSection>
    </>
  );
}

/** Patrón completo: FilterButton abre el panel modal; "Aplicar" guarda los valores y el badge muestra el total. */
function ModalDemo(args: Partial<FilterPanelProps>) {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState<FilterValues>({ color: ['azul'] });
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
      <FilterPanel {...args} modal={false} defaultValue={{ color: ['rojo', 'negro'], calificacion: 4 }}>
        <DemoSections />
      </FilterPanel>
    </div>
  ),
};

/** "Filters" de Figma (14014:6050): marco Desktop, con las cinco secciones abiertas y los textos de Figma. */
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

    await userEvent.click(canvas.getByRole('button', { name: 'Rojo' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Azul' }));
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Ropa' }));
    await expect(canvas.getByRole('button', { name: 'Color 2 seleccionados' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Categoría 2 seleccionados' })).toBeInTheDocument();
    await expect(canvas.getByRole('status')).toHaveTextContent('4 filtros seleccionados');
    // Resumen: un chip por sección con valor
    await expect(canvas.getByRole('group', { name: 'Filtros seleccionados' })).toHaveTextContent('Color (2)');

    // Limpiar de la sección Color
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar Color' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('2 filtros seleccionados');
    await expect(args.onValueChange).toHaveBeenLastCalledWith({ categoria: ['camisas', 'pantalones'] });

    // Aplicar entrega el objeto por sección
    await userEvent.click(canvas.getByRole('button', { name: 'Aplicar' }));
    await expect(args.onApply).toHaveBeenLastCalledWith({ categoria: ['camisas', 'pantalones'] });

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
    await userEvent.click(panel.getByRole('button', { name: 'Rojo' }));
    await userEvent.click(panel.getByRole('button', { name: 'Verde' }));
    await userEvent.click(panel.getByRole('button', { name: 'Aplicar' }));
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    await expect(trigger).toHaveAccessibleDescription('3 filtros aplicados');
    await expect(document.documentElement.style.overflow).toBe('');

    // Abierto, el documento no se desplaza debajo
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await expect(document.documentElement.style.overflow).toBe('hidden');

    // Quitar el último chip del resumen: el foco pasa al encabezado de la sección, no a `body`
    await userEvent.click(panel.getByRole('button', { name: 'Quitar filtro Color' }));
    await expect(panel.queryByRole('button', { name: /^Quitar filtro/ })).not.toBeInTheDocument();
    const colorHeader = dialog.querySelector<HTMLElement>('[data-filter-section="color"] [data-accordion-trigger]');
    await expect(colorHeader).not.toBeNull();
    await expect(colorHeader).toHaveFocus();

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
