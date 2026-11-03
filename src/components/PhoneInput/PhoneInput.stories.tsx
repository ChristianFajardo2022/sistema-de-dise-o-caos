import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { PhoneInput } from './PhoneInput';
import type { PhoneInputState } from './PhoneInput.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './PhoneInput.doc';
import docsJson from './PhoneInput.docs.json';

const STATES: PhoneInputState[] = ['default', 'filled', 'active', 'burnt-in', 'disabled', 'error', 'success'];

const meta: Meta<typeof PhoneInput> = {
  title: 'Form Controls/PhoneInput',
  component: PhoneInput,
  tags: ['autodocs'],
  parameters: {
    docs: componentDocsParameters(doc, docsJson),
    // `value` y `countryCode` los controlaría el lienzo sin devolver el cambio; `open` y `defaultOpen` abren la lista en la
    // capa superior; `id` remite a otro elemento; `defaultCountryCode` con texto libre deja el prefijo sin país
    docsLive: {
      exclude: ['value', 'countryCode', 'open', 'defaultOpen', 'id', 'defaultCountryCode', 'autoComplete'],
    },
  },
  argTypes: argTypesFromDocsJson(docsJson, {
    state: {
      control: 'select',
      options: STATES,
      type: { name: 'enum', value: STATES },
      description: 'State forzado (solo para visualización). `active` dibuja además una lista de muestra.',
    },
    groupDigits: { control: 'boolean', type: { name: 'boolean' }, description: 'Muestra el número agrupado con espacios' },
    optional: { control: 'boolean', type: { name: 'boolean' }, description: 'Agrega " | Opcional" a los labels' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Estado Disabled' },
    readOnly: { control: 'boolean', type: { name: 'boolean' }, description: 'Estado Burnt-In' },
    required: { control: 'boolean', type: { name: 'boolean' }, description: 'Número obligatorio' },
    fullWidth: { control: 'boolean', type: { name: 'boolean' }, description: '100% del contenedor (si no, 320)' },
    maxDigits: { control: 'number', type: { name: 'number' }, description: 'Máximo de dígitos' },
    helperText: { control: 'text', type: { name: 'string' } },
    errorText: { control: 'text', type: { name: 'string' } },
    successText: { control: 'text', type: { name: 'string' } },
  }),
  // Con número ficticio desde el inicio para que `groupDigits` y `maxDigits` se vean en Personalizar
  args: { label: 'Celular', placeholder: '300 000 0000', defaultValue: '3000000000', helperText: undefined },
  decorators: [
    (Story, { parameters }) =>
      parameters.sinMarco ? (
        <Story />
      ) : (
        <div className="min-h-72 w-[420px] max-w-full">
          <Story />
        </div>
      ),
  ],
};
export default meta;
type Story = StoryObj<typeof PhoneInput>;

export const Interactive: Story = { args: { groupDigits: true, helperText: 'Sin el indicativo' } };

export const Controlled: Story = {
  render: function ControlledDemo(args) {
    const [country, setCountry] = useState<string | null>('MX');
    const [number, setNumber] = useState('5500000000');
    return (
      <div className="flex flex-col gap-4">
        <PhoneInput {...args} countryCode={country} onCountryCodeChange={setCountry} value={number} onValueChange={setNumber} groupDigits />
        <p className="text-ds-typography-body-size-xs text-ds-text-neutral-white">
          {country} · {number}
        </p>
      </div>
    );
  },
};

export const WithMessages: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <PhoneInput {...args} helperText="Sin espacios ni guiones" />
      <PhoneInput {...args} errorText="Escribe el número completo" defaultValue="300" />
      <PhoneInput {...args} successText="Celular verificado" defaultValue="3000000000" groupDigits />
      <PhoneInput {...args} disabled defaultValue="3000000000" />
      <PhoneInput {...args} readOnly defaultValue="3000000000" groupDigits />
    </div>
  ),
};

// ───────────────────────── FigmaMatrix ─────────────────────────

const SURFACE = 'bg-ds-background-general-black';
const FIGMA_VARIANTS: { name: string; props: Partial<ComponentProps<typeof PhoneInput>> }[] = [
  { name: 'Default', props: { state: 'default' } },
  { name: 'Filled', props: { state: 'filled' } },
  { name: 'Active/Focus', props: { state: 'active' } },
  { name: 'Burnt-In', props: { state: 'burnt-in' } },
  { name: 'Disabled', props: { state: 'disabled' } },
  { name: 'Error', props: { state: 'error', errorText: 'Error text' } },
  { name: 'Success', props: { state: 'success', successText: 'Confirmation text' } },
  { name: 'Helper text', props: { state: 'filled', helperText: 'Helper text' } },
];

/** Países de muestra con los textos de Figma: la lista real del prefijo dibuja "Text item" en Active/Focus. */
const FIGMA_COUNTRIES = [
  { code: 'A', dialCode: '+57', label: 'Text item' },
  { code: 'B', dialCode: '+1', label: 'Text item' },
];

/**
 * Los 8 estados del Type=Number de "General input", con los textos de muestra de Figma y el prefijo sin elegir.
 * Active/Focus abre la lista real del prefijo (capa superior, bajo todo el control, como en Figma).
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen', sinMarco: true },
  render: () => (
    <div className={`grid max-w-full grid-cols-[repeat(auto-fill,minmax(min(100%,496px),496px))] items-start gap-x-6 gap-y-10 p-6 ${SURFACE}`}>
      {FIGMA_VARIANTS.map(({ name, props }) => (
        // La lista abierta de Active/Focus va en la capa superior: se le deja sitio debajo para no tapar la fila siguiente
        <div key={name} className={`flex flex-col gap-2 ${name === 'Active/Focus' ? 'pb-24' : ''}`}>
          <span className="text-ds-typography-body-size-xs text-ds-text-neutral-white">{name}</span>
          <PhoneInput
            fullWidth
            label="Label"
            prefixLabel="Label"
            placeholder="Placeholder"
            defaultCountryCode={null}
            countries={FIGMA_COUNTRIES}
            getCountryLabel={(c) => c.label}
            data-figma={`Type=Number, State=${name}`}
            {...props}
          />
        </div>
      ))}
    </div>
  ),
};

// ───────────────────────── pruebas ─────────────────────────

const renderTest = (args: ComponentProps<typeof PhoneInput>) => (
  <form aria-label="Formulario" className="flex min-h-96 flex-col items-start gap-4 p-4">
    <PhoneInput {...args} name="telefono" />
    <button type="button">Siguiente</button>
  </form>
);

/** Rol de grupo, nombres, atributos del número, elegir indicativo con teclado, escribir y valor E.164 del input oculto. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { helperText: 'Sin el indicativo', groupDigits: true, defaultValue: '' },
  render: renderTest,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'Celular' });
    const prefix = within(group).getByRole('combobox', { name: 'Indicativo' });
    const number = within(group).getByRole('textbox', { name: 'Celular' });
    const form = canvasElement.querySelector('form')!;
    const e164 = () => new FormData(form).get('telefono');

    await expect(number).toHaveAttribute('type', 'tel');
    await expect(number).toHaveAttribute('inputmode', 'tel');
    await expect(number).toHaveAttribute('autocomplete', 'tel-national');
    await expect(number).toHaveAccessibleDescription('Sin el indicativo');
    await expect(prefix).toHaveAccessibleDescription('Sin el indicativo');
    await expect(prefix).toHaveTextContent('+57');
    await expect(e164()).toBe('');

    // Elegir indicativo con el teclado: +57 -> +1 -> +52
    prefix.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(prefix).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await waitFor(() => expect(prefix).toHaveAttribute('aria-expanded', 'false'));
    await expect(prefix).toHaveTextContent('+52');
    await expect(prefix).toHaveFocus();

    // Escribir: solo dígitos, agrupados al mostrar
    await userEvent.tab();
    await expect(number).toHaveFocus();
    await userEvent.keyboard('00 abc 0000-0000');
    await expect(number).toHaveValue('000 000 0000');
    await expect(e164()).toBe('+520000000000');

    await userEvent.clear(number);
    await expect(e164()).toBe('');
  },
};

/** Controlado: onCountryCodeChange y onValueChange (solo dígitos) y errorText con aria-invalid. */
export const ControlledTest: Story = {
  tags: ['!autodocs'],
  args: { errorText: 'Escribe el número completo', defaultValue: '' },
  render: function Demo(args) {
    const [log, setLog] = useState('');
    return (
      <form aria-label="Formulario" className="flex min-h-96 flex-col items-start gap-4 p-4">
        <PhoneInput
          {...args}
          name="telefono"
          defaultCountryCode="ES"
          onCountryCodeChange={(c) => setLog((l) => `${l}[${c}]`)}
          onValueChange={(v) => setLog((l) => `${l}<${v}>`)}
        />
        <output aria-label="Registro">{log}</output>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const prefix = canvas.getByRole('combobox', { name: 'Indicativo' });
    const number = canvas.getByRole('textbox', { name: 'Celular' });
    await expect(number).toHaveAttribute('aria-invalid', 'true');
    await expect(number).toHaveAccessibleDescription('Escribe el número completo');
    await expect(prefix).toHaveTextContent('+34');
    await userEvent.click(number);
    await userEvent.keyboard('6 12');
    await expect(canvas.getByLabelText('Registro')).toHaveTextContent('<6><61><612>');
    await expect(new FormData(canvasElement.querySelector('form')!).get('telefono')).toBe('+34612');
    prefix.focus();
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(prefix).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByLabelText('Registro')).toHaveTextContent('[AR]');
    await expect(new FormData(canvasElement.querySelector('form')!).get('telefono')).toBe('+54612');
  },
};

/** La lista muestra el país con su indicativo ("Colombia +57") y el campo solo el indicativo; escribir salta por país. */
export const CountryListTest: Story = {
  tags: ['!autodocs'],
  render: renderTest,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const prefix = canvas.getByRole('combobox', { name: 'Indicativo' });
    await expect(prefix).toHaveTextContent(/^\+57$/);
    prefix.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(prefix).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByRole('option', { name: 'Colombia +57' })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('option', { name: 'Estados Unidos +1' })).toBeInTheDocument();
    await userEvent.keyboard('esp');
    const spain = canvas.getByRole('option', { name: 'España +34' });
    await expect(prefix).toHaveAttribute('aria-activedescendant', spain.id);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(prefix).toHaveAttribute('aria-expanded', 'false'));
    await expect(prefix).toHaveTextContent(/^\+34$/);
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', sinMarco: true },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'PhoneInput' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente PhoneInput en Figma:']);
    // Marcadores de la anatomía: uno por pauta (6 + 2)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(8);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de PhoneInput' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
