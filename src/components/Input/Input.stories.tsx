import { useEffect, useRef, useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Input } from './Input';
import type { InputState, InputVariant } from './Input.types';

const meta: Meta<typeof Input> = {
  title: 'Form Controls/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'password', 'search', 'search-header'],
      description: 'Type de Figma',
    },
    state: {
      control: 'select',
      options: [
        'default',
        'filled',
        'active',
        'burnt-in',
        'disabled',
        'error',
        'success',
      ],
      description: 'State forzado (solo para visualización)',
    },
    optional: {
      control: 'boolean',
      description: 'Agrega " | Opcional" al label',
    },
    disabled: { control: 'boolean', description: 'Estado disabled' },
    readOnly: { control: 'boolean', description: 'Estado Burnt-In' },
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa el 100 % del contenedor',
    },
  },
  args: {
    label: 'Label',
    variant: 'text',
    state: 'default',
    optional: false,
    disabled: false,
    readOnly: false,
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    label: 'Nombre completo',
    placeholder: 'Ej. Camilo Hernández',
    helperText: 'Como aparece en tu documento',
  },
};

export const Password: Story = {
  args: {
    variant: 'password',
    label: 'Contraseña',
    placeholder: 'Ingresa tu contraseña',
  },
};

export const Search: Story = {
  args: {
    variant: 'search',
    label: 'Buscar',
    placeholder: 'Buscar componente o token',
  },
};

export const SearchHeader: Story = {
  args: {
    variant: 'search-header',
    label: 'Buscar en el portal',
    placeholder: 'Escribe para buscar',
  },
};

export const OptionalWithTooltip: Story = {
  args: {
    label: 'Teléfono',
    optional: true,
    tooltip: 'Solo lo usamos para notificaciones',
    type: 'tel',
  },
};

export const Interactive: Story = {
  render: (args) => <InteractiveInput {...args} />,
};

function InteractiveInput(args: ComponentProps<typeof Input>) {
  const [value, setValue] = useState('');
  const invalid = value.length > 0 && !value.includes('@');
  return (
    <Input
      {...args}
      label="Correo electrónico"
      type="email"
      placeholder="correo@dominio.com"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      errorText={invalid ? 'Escribe un correo válido' : undefined}
      successText={value.includes('@') ? 'Correo válido' : undefined}
      helperText="Te enviaremos la confirmación"
    />
  );
}

const VARIANTS: InputVariant[] = [
  'text',
  'password',
  'search',
  'search-header',
];
const STATES: { id: string; state: InputState; helper?: boolean }[] = [
  { id: 'default', state: 'default' },
  { id: 'filled', state: 'filled' },
  { id: 'active', state: 'active' },
  { id: 'burnt-in', state: 'burnt-in' },
  { id: 'disabled', state: 'disabled' },
  { id: 'error', state: 'error' },
  { id: 'success', state: 'success' },
  { id: 'helper', state: 'filled', helper: true },
];

/** Los 4 tipos × 8 estados del component set de Figma. */
export const StatesMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))] items-start gap-x-6 gap-y-6">
      <span />
      {VARIANTS.map((v) => (
        <span key={v} className="text-xs text-neutral-400">
          {v}
        </span>
      ))}
      {STATES.map(({ id, state, helper }) => (
        <div key={id} className="contents">
          <span className="pt-4 text-xs text-neutral-400">{id}</span>
          {VARIANTS.map((v) => (
            <Input
              key={v}
              fullWidth
              variant={v}
              state={state}
              label="Label"
              placeholder="Placeholder"
              defaultValue={id === 'filled' ? 'Valor' : undefined}
              errorText={state === 'error' ? 'Error text' : undefined}
              successText={state === 'success' ? 'Success text' : undefined}
              helperText={helper ? 'Helper text' : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

const FIGMA_TYPES: { figma: string; variant: InputVariant }[] = [
  { figma: 'Text', variant: 'text' },
  { figma: 'Password', variant: 'password' },
  { figma: 'Search', variant: 'search' },
  { figma: 'Search header', variant: 'search-header' },
];
const FIGMA_STATES: { figma: string; state: InputState; helper?: boolean }[] = [
  { figma: 'Default', state: 'default' },
  { figma: 'Filled', state: 'filled' },
  { figma: 'Active/Focus', state: 'active' },
  { figma: 'Burnt-In', state: 'burnt-in' },
  { figma: 'Disabled', state: 'disabled' },
  { figma: 'Error', state: 'error' },
  { figma: 'Success', state: 'success' },
  { figma: 'Helper text', state: 'filled', helper: true },
];

/**
 * Los tipos Text, Password, Search y Search header de `input/general-input` × 8 estados, con `data-figma` = nombre exacto.
 * Los otros tipos del set (Code, Coment, Dropdown, Multiple, Number, Time picker) son componentes aparte con su propia
 * matriz; aquí el comparador los marca como FALTA. `Type=Search, State=Default` aparece dos veces en Figma: se dibuja una.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))] items-start gap-x-6 gap-y-6">
        <span />
        {FIGMA_TYPES.map((t) => (
          <span key={t.figma} className="text-xs text-ds-text-neutral-body">{t.figma}</span>
        ))}
        {FIGMA_STATES.map((st) => (
          <div key={st.figma} className="contents">
            <span className="pt-4 text-xs text-ds-text-neutral-body">{st.figma}</span>
            {FIGMA_TYPES.map((t) => (
              <Input
                key={t.figma}
                fullWidth
                variant={t.variant}
                state={st.state}
                label="Label"
                placeholder="Placeholder"
                defaultValue={st.state === 'filled' ? 'Valor' : undefined}
                errorText={st.state === 'error' ? 'Error text' : undefined}
                successText={st.state === 'success' ? 'Success text' : undefined}
                helperText={st.helper ? 'Helper text' : undefined}
                rootProps={{ 'data-figma': `Type=${t.figma}, State=${st.figma}` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Test: escribir actualiza el valor y el label sigue asociado */
export const TypingTest: Story = {
  tags: ['!autodocs'],
  args: { label: 'Nombre completo', placeholder: 'Ej. Camilo Hernández' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Nombre completo');
    await userEvent.type(input, 'Camilo Pérez');
    await expect(input).toHaveValue('Camilo Pérez');
    await expect(within(canvasElement).getByRole('textbox', { name: 'Nombre completo' })).toBe(input);
  },
};

/** Test: en error aria-invalid y aria-describedby apuntan al mensaje visible */
export const ErrorTest: Story = {
  tags: ['!autodocs'],
  args: { label: 'Correo', errorText: 'Escribe un correo válido', defaultValue: 'abc' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Correo');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    const id = input.getAttribute('aria-describedby');
    await expect(id).toBeTruthy();
    const message = canvasElement.querySelector(`[id="${id}"]`);
    await expect(message).toBeVisible();
    await expect(message).toHaveTextContent('Escribe un correo válido');
  },
};

/** Test: el botón de contraseña alterna tipo y nombre con teclado */
export const PasswordToggleTest: Story = {
  tags: ['!autodocs'],
  args: { variant: 'password', label: 'Contraseña' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Contraseña');
    await userEvent.type(input, 'secreto');
    await expect(input).toHaveAttribute('type', 'password');
    await userEvent.tab();
    const show = canvas.getByRole('button', { name: 'Mostrar contraseña' });
    await expect(show).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveAttribute('type', 'text');
    const hide = canvas.getByRole('button', { name: 'Ocultar contraseña' });
    await expect(hide).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard(' ');
    await expect(input).toHaveAttribute('type', 'password');
    await expect(canvas.getByRole('button', { name: 'Mostrar contraseña' })).toBeVisible();
    await expect(input).toHaveValue('secreto');
  },
};

/** Test: disabled no acepta texto */
export const DisabledTest: Story = {
  tags: ['!autodocs'],
  args: { label: 'Campo', disabled: true },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Campo');
    await expect(input).toBeDisabled();
    await userEvent.type(input, 'hola');
    await expect(input).toHaveValue('');
  },
};

function FieldBaseDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState('');
  const [refs, setRefs] = useState('');
  useEffect(() => setRefs(`${inputRef.current?.tagName}|${rootRef.current?.dataset.testid}`), []);
  return (
    <div className="flex flex-col gap-4 p-4">
      <Input
        ref={inputRef}
        label="Correo"
        errorText="Escribe un correo válido"
        onValueChange={setValue}
        rootProps={{ ref: rootRef, 'data-testid': 'raiz' }}
      />
      <Input label="Usuario" successText="Disponible" />
      <output data-testid="valor">{value}</output>
      <output data-testid="refs">{refs}</output>
    </div>
  );
}

/**
 * Test de la base común de los campos: `ref` al input y `rootProps` (con su `ref`) a la raíz, `onValueChange` con el
 * texto, foco visible en Error y Success (anillo de 2 en el recuadro, WCAG 2.4.7) y una sola región viva por campo.
 */
export const FieldBaseTest: Story = {
  tags: ['!autodocs'],
  render: () => <FieldBaseDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('refs')).toHaveTextContent('INPUT|raiz');
    const email = canvas.getByLabelText('Correo');
    await userEvent.type(email, 'ana');
    await expect(canvas.getByTestId('valor')).toHaveTextContent('ana');
    const ring = (input: HTMLElement) => getComputedStyle(input.parentElement!.parentElement!);
    await expect(ring(email).outlineStyle).toBe('solid');
    await expect(ring(email).outlineWidth).toBe('2px');
    await userEvent.tab();
    const user = canvas.getByLabelText('Usuario');
    await expect(user).toHaveFocus();
    await expect(ring(user).outlineStyle).toBe('solid');
    await expect(ring(email).outlineStyle).toBe('none');
    // Mensajes: región viva polite por campo, sin role="alert"
    await expect(canvasElement.querySelectorAll('[aria-live="polite"]')).toHaveLength(2);
    await expect(canvas.queryByRole('alert')).toBeNull();
    await expect(email).toHaveAccessibleDescription('Escribe un correo válido');
  },
};
