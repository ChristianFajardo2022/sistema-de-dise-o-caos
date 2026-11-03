import { useRef, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Select, SelectOption } from './Select';
import type { SelectOptionData, SelectState } from './Select.types';
import { Input, inputFieldVariants } from '../Input';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { cn } from '../../utils/cn';
import { doc } from './Select.doc';
import docsJson from './Select.docs.json';

const COUNTRIES: SelectOptionData[] = [
  { value: 'co', label: 'Colombia' },
  { value: 'mx', label: 'México' },
  { value: 'pe', label: 'Perú', disabled: true },
  { value: 'cl', label: 'Chile' },
  { value: 'ar', label: 'Argentina' },
  { value: 'pa', label: 'Panamá' },
];

const DEFAULT_VALUES = COUNTRIES.filter((o) => !o.disabled).map((o) => o.value);

const STATES: SelectState[] = ['default', 'filled', 'active', 'burnt-in', 'disabled', 'error', 'success'];

const meta: Meta<typeof Select> = {
  title: 'Form Controls/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    // La página Docs usa la plantilla de documentación (Select.doc.tsx) con la referencia de código al final
    docs: componentDocsParameters(doc, docsJson),
    // `open` y `defaultOpen` abren la lista en la capa superior, fuera del lienzo: sin control en Personalizar. La lista
    // abierta se ve en el lienzo con `state="active"`, que la dibuja en el flujo
    // `id`, `aria-labelledby` y `name` remiten a otros elementos o al formulario: con texto libre no se ve nada o se rompe
    docsLive: { exclude: ['open', 'defaultOpen', 'id', 'aria-labelledby', 'name'] },
  },
  // Las descripciones salen de Select.docs.json; aquí solo los controles y los tipos explícitos
  argTypes: argTypesFromDocsJson(docsJson, {
    state: { control: 'select', options: STATES, type: { name: 'enum', value: STATES } },
    frame: { control: 'inline-radio', options: ['field', 'none'], type: { name: 'enum', value: ['field', 'none'] } },
    optional: { control: 'boolean', type: { name: 'boolean' } },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
    readOnly: { control: 'boolean', type: { name: 'boolean' } },
    required: { control: 'boolean', type: { name: 'boolean' } },
    fullWidth: { control: 'boolean', type: { name: 'boolean' } },
    scrollbar: { control: 'boolean', type: { name: 'boolean' } },
    children: { control: false },
    // Solo valores que existen en las opciones (con texto libre el label sube y el campo queda vacío)
    defaultValue: { control: 'select', options: DEFAULT_VALUES, type: { name: 'enum', value: DEFAULT_VALUES } },
  }),
  args: {
    label: 'País',
    options: COUNTRIES,
    state: 'default',
    frame: 'field',
    optional: false,
    disabled: false,
    readOnly: false,
    required: false,
    fullWidth: false,
    scrollbar: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { helperText: 'Donde vives actualmente' },
};

/** Controlado: el valor vive fuera y se valida al cambiar. */
export const Interactive: Story = {
  render: (args) => <ControlledSelect {...args} />,
};

function ControlledSelect(args: ComponentProps<typeof Select>) {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <Select
        {...args}
        value={value}
        onValueChange={setValue}
        successText={value ? 'Listo' : undefined}
        helperText="Define la moneda y el formato de las fechas"
      />
      <p className="text-ds-typography-body-size-sm text-ds-text-neutral-white">Valor: {value ?? '—'}</p>
    </div>
  );
}

/** Opciones como hijos `SelectOption`, con ícono. */
export const WithChildren: Story = {
  args: { options: undefined, label: 'Ordenar por' },
  render: (args) => (
    <Select {...args}>
      <SelectOption value="recientes" icon="clock">
        Más recientes
      </SelectOption>
      <SelectOption value="destacados" icon="star">
        Destacados
      </SelectOption>
      <SelectOption value="archivados" icon="folder" disabled>
        Archivados
      </SelectOption>
    </Select>
  ),
};

/**
 * `frame="none"` + `anchorRef`: solo el disparador, para controles compuestos. Así lo usarán TripleInput (tres
 * selectores en un recuadro, separados por línea) y PhoneInput (prefijo + número): la lista se abre bajo todo el control.
 */
export const Composed: Story = {
  render: () => <ComposedDemo />,
};

function ComposedDemo() {
  const tripleRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const days = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map((m, i) => ({ value: String(i + 1), label: m }));
  const years = ['2026', '2025', '2024', '2023'].map((y) => ({ value: y, label: y }));
  return (
    <div className="flex w-[496px] max-w-full flex-col gap-6">
      <div
        ref={tripleRef}
        role="group"
        aria-label="Fecha de nacimiento"
        className={cn(inputFieldVariants({ state: 'default' }), 'gap-ds-space-general-2xl [--input-field-gap:var(--ds-responsive-space-general-2xl)]')}
      >
        <Select frame="none" anchorRef={tripleRef} label="Día" options={days} className="flex-1" />
        <span aria-hidden="true" className="h-10 w-px shrink-0 bg-ds-border-general-default-on-canva" />
        <Select frame="none" anchorRef={tripleRef} label="Mes" options={months} className="flex-1" />
        <span aria-hidden="true" className="h-10 w-px shrink-0 bg-ds-border-general-default-on-canva" />
        <Select frame="none" anchorRef={tripleRef} label="Año" options={years} className="flex-1" />
      </div>
      <div ref={phoneRef} className="flex items-start gap-ds-space-general-lg">
        <Select
          anchorRef={phoneRef}
          label="Prefijo"
          defaultValue="57"
          options={[
            { value: '57', label: '+57' },
            { value: '52', label: '+52' },
            { value: '56', label: '+56' },
          ]}
          className="w-[96px] shrink-0"
        />
        <Input label="Teléfono" type="tel" fullWidth />
      </div>
    </div>
  );
}

const SURFACE = 'bg-ds-background-general-black';
const TWO_ITEMS: SelectOptionData[] = [
  { value: 'a', label: 'Text item' },
  { value: 'b', label: 'Text item' },
];
const FIGMA_VARIANTS: { name: string; props: Partial<ComponentProps<typeof Select>> }[] = [
  { name: 'Default', props: { state: 'default' } },
  { name: 'Filled', props: { state: 'filled' } },
  { name: 'Active/Focus', props: { state: 'active' } },
  { name: 'Burnt-In', props: { state: 'burnt-in' } },
  { name: 'Disabled', props: { state: 'disabled' } },
  { name: 'Error', props: { state: 'error', errorText: 'Error text' } },
  { name: 'Success', props: { state: 'success', successText: 'Confirmation text' } },
  { name: 'Helper text', props: { state: 'filled', helperText: 'Helper text' } },
];

/** Los 8 estados del Type=Dropdown de "General input". Active/Focus con la lista abierta en el flujo. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className={`grid max-w-full grid-cols-[repeat(auto-fill,496px)] items-start gap-x-6 gap-y-10 p-6 ${SURFACE}`}>
      {FIGMA_VARIANTS.map(({ name, props }) => (
        <div key={name} className="flex flex-col gap-2">
          <span className="text-ds-typography-body-size-xs text-ds-text-neutral-white">{name}</span>
          <Select
            fullWidth
            label="Label"
            placeholder="Placeholder"
            options={TWO_ITEMS}
            data-figma={`Type=Dropdown, State=${name}`}
            {...props}
          />
        </div>
      ))}
    </div>
  ),
};

// ───────────────────────── pruebas ─────────────────────────

const renderTest = (args: ComponentProps<typeof Select>) => (
  <form aria-label="Formulario" className="flex min-h-96 flex-col items-start gap-4 p-4">
    <Select {...args} name="pais" />
    <button type="button">Siguiente</button>
  </form>
);

/** APG Select-Only Combobox: roles, apertura, flechas (saltan la deshabilitada), Inicio, Fin, Enter, Esc. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { helperText: 'Donde vives' },
  render: renderTest,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combo = canvas.getByRole('combobox', { name: 'País' });
    const listbox = canvas.getByRole('listbox', { hidden: true });
    await expect(combo).toHaveAttribute('aria-expanded', 'false');
    await expect(combo).toHaveAttribute('aria-controls', listbox.id);
    await expect(combo).toHaveAccessibleDescription('Donde vives');

    combo.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
    const option = (name: string) => canvas.getByRole('option', { name });
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Colombia').id);
    await expect(combo).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    // Perú está deshabilitada: México -> Chile
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Chile').id);
    await userEvent.keyboard('{End}');
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Panamá').id);
    await userEvent.keyboard('{ArrowDown}');
    // Sin dar la vuelta
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Panamá').id);
    await userEvent.keyboard('{Home}');
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Colombia').id);

    await userEvent.keyboard('{ArrowDown}{Enter}');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));
    await expect(combo).toHaveTextContent('México');
    await expect(combo).not.toHaveAttribute('aria-activedescendant');
    const form = canvasElement.querySelector('form')!;
    await expect(new FormData(form).get('pais')).toBe('mx');

    // Reabre en la elegida; Esc cierra sin cambiar
    await userEvent.keyboard(' ');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
    await expect(combo).toHaveAttribute('aria-activedescendant', option('México').id);
    await expect(option('México')).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowDown}{Escape}');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));
    await expect(combo).toHaveTextContent('México');
    await expect(combo).toHaveFocus();
  },
};

/** Escribir para saltar (cerrado abre), Alt + flechas y Tab que elige y deja seguir el foco. */
export const TypeaheadAndTabTest: Story = {
  tags: ['!autodocs'],
  render: renderTest,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combo = canvas.getByRole('combobox', { name: 'País' });
    const option = (name: string) => canvas.getByRole('option', { name });
    combo.focus();

    await userEvent.keyboard('a');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Argentina').id);
    // Alt + Flecha arriba elige y cierra
    await userEvent.keyboard('{Alt>}{ArrowUp}{/Alt}');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));
    await expect(combo).toHaveTextContent('Argentina');

    // Alt + Flecha abajo abre; "c" repetida recorre Colombia -> Chile
    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('c');
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Colombia').id);
    await userEvent.keyboard('c');
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Chile').id);
    await new Promise((r) => setTimeout(r, 600));
    await userEvent.keyboard('co');
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Colombia').id);

    // Tab elige la activa, cierra y el foco sigue
    await userEvent.tab();
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));
    await expect(combo).toHaveTextContent('Colombia');
    await expect(canvas.getByRole('button', { name: 'Siguiente' })).toHaveFocus();
  },
};

/** Puntero: clic abre, la opción deshabilitada no se elige, clic en otra elige y cierra. */
export const PointerTest: Story = {
  tags: ['!autodocs'],
  render: (args) => <ControlledSelect {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combo = canvas.getByRole('combobox', { name: 'País' });
    await userEvent.click(combo);
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
    await expect(combo).toHaveFocus();
    await userEvent.click(canvas.getByRole('option', { name: 'Perú' }));
    await expect(combo).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('option', { name: 'Chile' }));
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));
    await expect(canvas.getByText('Valor: cl')).toBeVisible();
    await expect(combo).toHaveAccessibleDescription('Listo');
  },
};

/** Disabled no se enfoca ni abre; readOnly (Burnt-In) se enfoca pero no abre. Error marca aria-invalid. */
export const StatesTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <Select label="Deshabilitado" options={COUNTRIES} disabled />
      <Select label="Solo lectura" options={COUNTRIES} defaultValue="co" readOnly />
      <Select label="Con error" options={COUNTRIES} errorText="Elige un país" required />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disabled = canvas.getByRole('combobox', { name: 'Deshabilitado' });
    await expect(disabled).toBeDisabled();

    const readOnly = canvas.getByRole('combobox', { name: 'Solo lectura' });
    await expect(readOnly).toHaveAttribute('aria-readonly', 'true');
    readOnly.focus();
    await expect(readOnly).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.click(readOnly);
    await expect(readOnly).toHaveAttribute('aria-expanded', 'false');
    await expect(readOnly).toHaveTextContent('Colombia');

    const invalid = canvas.getByRole('combobox', { name: 'Con error' });
    await expect(invalid).toHaveAttribute('aria-invalid', 'true');
    await expect(invalid).toHaveAttribute('aria-required', 'true');
    await expect(invalid).toHaveAccessibleDescription('Elige un país');
  },
};

const DIAL_CODES: SelectOptionData[] = [
  { value: 'CO', label: 'Colombia +57', displayLabel: '+57' },
  { value: 'US', label: 'Estados Unidos +1', displayLabel: '+1' },
  { value: 'MX', label: 'México +52', displayLabel: '+52' },
];

/** `displayLabel`: la lista dice "México +52", el campo "+52"; escribir salta por el texto de la lista. */
export const DisplayLabelTest: Story = {
  tags: ['!autodocs'],
  render: () => <Select label="Indicativo" options={DIAL_CODES} defaultValue="CO" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const combo = canvas.getByRole('combobox', { name: 'Indicativo' });
    await expect(combo).toHaveTextContent(/^\+57$/);
    combo.focus();
    await userEvent.keyboard('m');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
    const mexico = canvas.getByRole('option', { name: 'México +52' });
    await expect(combo).toHaveAttribute('aria-activedescendant', mexico.id);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));
    await expect(combo).toHaveTextContent(/^\+52$/);
  },
};

/** `open` controlado: la lista sigue la prop y `onOpenChange` avisa al pedir cerrar (Esc). `defaultOpen` abre al montar. */
export const ControlledOpenTest: Story = {
  tags: ['!autodocs'],
  args: { onOpenChange: fn() },
  render: (args) => (
    <div className="flex min-h-96 flex-col gap-4 p-4">
      <Select label="Abierto" options={COUNTRIES} open onOpenChange={args.onOpenChange} />
      <Select label="Inicial" options={COUNTRIES} defaultOpen />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const combo = canvas.getByRole('combobox', { name: 'Abierto' });
    await expect(combo).toHaveAttribute('aria-expanded', 'true');
    combo.focus();
    await userEvent.keyboard('{Escape}');
    await expect(args.onOpenChange).toHaveBeenCalledWith(false);
    // Controlado: sigue abierto hasta que el padre cambie `open`
    await expect(combo).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('combobox', { name: 'Inicial' })).toHaveAttribute('aria-expanded', 'true');
  },
};

/** Solo lectura sin valor: el label se queda dentro del campo (14/18); con valor, sube (12/16). */
export const ReadOnlyLabelTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <Select label="Sin valor" options={COUNTRIES} readOnly />
      <Select label="Con valor" options={COUNTRIES} defaultValue="co" readOnly />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const label = (text: string) => within(canvasElement).getByText(text, { selector: 'label' });
    await expect(getComputedStyle(label('Sin valor')).fontSize).toBe('14px');
    await expect(getComputedStyle(label('Con valor')).fontSize).toBe('12px');
  },
};

/** Página de documentación (plantilla v2): encabezado, 3 pestañas y secciones en orden. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Select' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Select en Figma:']);
    // Anatomía: un marcador por pauta (5 + 5), y las vistas son ilustraciones (inert)
    const views = canvasElement.querySelectorAll('[data-doc-anatomy-view="marks"]');
    await expect(views).toHaveLength(2);
    for (const view of views) await expect(view).toHaveAttribute('inert');
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(10));
    // La lista abierta de la anatomía va en el flujo (state="active"), no en la capa superior
    await expect(views[1].querySelector('[role="listbox"]')?.closest('[popover]')).toBeNull();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática) se llega a Desarrollo
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Select' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
