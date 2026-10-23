import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { CodeInput } from './CodeInput';
import type { CodeInputProps, CodeInputState } from './CodeInput.types';

const STATE_OPTIONS: CodeInputState[] = ['default', 'filled', 'active', 'burnt-in', 'disabled', 'error', 'success'];
const SIZE_OPTIONS = ['56', '32'];

const meta = {
  title: 'Form Controls/CodeInput',
  component: CodeInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    length: { name: 'length', control: { type: 'number', min: 2, max: 8 }, type: { name: 'number' }, description: 'Número de casillas' },
    size: {
      name: 'size',
      control: 'radio',
      options: SIZE_OPTIONS,
      type: { name: 'enum', value: SIZE_OPTIONS },
      description: 'Size de las casillas (DigitInput)',
    },
    state: {
      name: 'state',
      control: 'select',
      options: STATE_OPTIONS,
      type: { name: 'enum', value: STATE_OPTIONS },
      description: 'Fuerza el aspecto de un estado (solo documentación)',
    },
    hideLabel: { name: 'hideLabel', control: 'boolean', type: { name: 'boolean' }, description: 'Label solo para lectores de pantalla' },
    disabled: { name: 'disabled', control: 'boolean', type: { name: 'boolean' } },
    readOnly: { name: 'readOnly', control: 'boolean', type: { name: 'boolean' }, description: 'Estado Burnt-In' },
    fullWidth: { name: 'fullWidth', control: 'boolean', type: { name: 'boolean' } },
    onValueChange: { action: 'valueChange' },
    onComplete: { action: 'complete' },
  },
  args: {
    label: 'Código de verificación',
    length: 6,
    size: '56',
    state: 'default',
    hideLabel: false,
    disabled: false,
    readOnly: false,
    fullWidth: false,
    helperText: 'Escribe el código de 6 dígitos que enviamos a tu celular',
  },
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

function ControlledDemo(args: CodeInputProps) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<'idle' | 'ok' | 'error'>('idle');
  return (
    <CodeInput
      {...args}
      value={code}
      onValueChange={(v) => {
        setCode(v);
        setResult('idle');
      }}
      onComplete={(c) => setResult(c === '123456' ? 'ok' : 'error')}
      helperText="Prueba con 123456"
      errorText={result === 'error' ? 'El código no es válido' : undefined}
      successText={result === 'ok' ? 'Código verificado' : undefined}
    />
  );
}

/** Controlado: el valor vive en el padre y se valida al completar. */
export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

const VARIANTS: { figma: string; props: Partial<CodeInputProps> }[] = [
  { figma: 'Default', props: { state: 'default' } },
  { figma: 'Filled', props: { state: 'filled', defaultValue: '000000' } },
  { figma: 'Active/Focus', props: { state: 'active', defaultValue: '1' } },
  { figma: 'Burnt-In', props: { readOnly: true, defaultValue: '111111' } },
  { figma: 'Disabled', props: { disabled: true, defaultValue: '000000' } },
  { figma: 'Error', props: { defaultValue: '000000', errorText: 'Error text' } },
  { figma: 'Success', props: { defaultValue: '000000', successText: 'Confirmation text' } },
  { figma: 'Helper text', props: { defaultValue: '000000', helperText: 'Helper text' } },
];

/** Los 8 estados de Figma (Type=Code), cada uno una vez, sobre la superficie del tema. El label va oculto como en Figma. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de CodeInput" className="max-w-full overflow-x-auto">
        <div className="grid grid-cols-[auto_495.38px] items-start gap-x-8 gap-y-6">
          {VARIANTS.map((v) => (
            <div key={v.figma} className="contents">
              <span className="pt-5 text-xs text-ds-text-neutral-body">{v.figma}</span>
              <CodeInput
                label={`Código ${v.figma}`}
                hideLabel
                fullWidth
                {...v.props}
                data-figma={`Type=Code, State=${v.figma}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

const getCells = (canvasElement: HTMLElement) =>
  Array.from({ length: 6 }, (_, i) => within(canvasElement).getByRole('textbox', { name: `Dígito ${i + 1} de 6` }));

/** Test: grupo con nombre, escritura que avanza, retroceso que borra y retrocede, flechas y onComplete */
export const TypingTest: Story = {
  tags: ['!autodocs'],
  args: { onComplete: fn(), onValueChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'Código de verificación' });
    await expect(group).toBeInTheDocument();
    const cells = getCells(canvasElement);
    await expect(cells[0]).toHaveAttribute('inputmode', 'numeric');
    await expect(cells[0]).toHaveAttribute('autocomplete', 'one-time-code');
    await expect(cells[1]).toHaveAttribute('autocomplete', 'off');
    await expect(cells[2]).toHaveAccessibleDescription(/código de 6 dígitos/);
    // Roving tabindex: solo la primera casilla libre está en el orden de Tab
    await expect(cells[0]).toHaveAttribute('tabindex', '0');
    await expect(cells[1]).toHaveAttribute('tabindex', '-1');

    await userEvent.click(cells[0]);
    await userEvent.keyboard('12a3');
    await expect(cells.map((c) => (c as HTMLInputElement).value).join('')).toBe('123');
    await expect(cells[3]).toHaveFocus();

    // Retroceso en casilla vacía: borra la anterior y retrocede
    await userEvent.keyboard('{Backspace}');
    await expect(cells[2]).toHaveValue('');
    await expect(cells[2]).toHaveFocus();

    // Flechas
    await userEvent.keyboard('{ArrowLeft}');
    await expect(cells[1]).toHaveFocus();
    await userEvent.keyboard('9');
    await expect(cells[1]).toHaveValue('9');
    await expect(cells[2]).toHaveFocus();

    await userEvent.keyboard('4567');
    await expect(args.onComplete).toHaveBeenCalledTimes(1);
    await expect(args.onComplete).toHaveBeenCalledWith('194567');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('194567');

    // Una casilla vacía más allá de la primera libre no recibe el foco: va a la primera libre
    await userEvent.keyboard('{Backspace}{Backspace}');
    await expect(cells.map((c) => (c as HTMLInputElement).value).join('')).toBe('1945');
    await expect(cells[3]).toHaveFocus();
    await userEvent.click(cells[5]);
    await expect(cells[4]).toHaveFocus();
  },
};

/** Test: pegar un código con letras y espacios reparte solo los dígitos */
export const PasteTest: Story = {
  tags: ['!autodocs'],
  args: { onComplete: fn() },
  play: async ({ canvasElement, args }) => {
    const cells = getCells(canvasElement);
    await userEvent.click(cells[0]);
    await userEvent.paste('Tu código: 48 29-16');
    await expect(cells.map((c) => (c as HTMLInputElement).value).join('')).toBe('482916');
    await expect(cells[5]).toHaveFocus();
    await expect(args.onComplete).toHaveBeenCalledWith('482916');
  },
};

/** Test: autocompletado del sistema (one-time-code) en la primera casilla, que reparte lo recibido */
export const AutofillTest: Story = {
  tags: ['!autodocs'],
  args: { onComplete: fn() },
  play: async ({ canvasElement, args }) => {
    const cells = getCells(canvasElement);
    // La casilla que recibe el autocompletado acepta el código entero (DigitInput maxLength); las demás, un carácter
    await expect(cells[0]).toHaveAttribute('maxlength', String(cells.length));
    await expect(cells[1]).toHaveAttribute('maxlength', '1');
    cells[0].focus();
    // Simula al navegador: escribe el valor completo en el input y dispara el evento input
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setValue?.call(cells[0], '735104');
    cells[0].dispatchEvent(new Event('input', { bubbles: true }));
    await waitFor(() => expect(cells.map((c) => (c as HTMLInputElement).value).join('')).toBe('735104'));
    await expect(cells[0]).toHaveValue('7');
    await expect(args.onComplete).toHaveBeenCalledWith('735104');
  },
};

/** Test: error con aria-invalid y mensaje descrito; solo lectura y deshabilitado no se editan */
export const StatesTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-6">
      <CodeInput label="Con error" errorText="El código no es válido" defaultValue="12" getDigitLabel={(i) => `Error ${i + 1}`} />
      <CodeInput label="Solo lectura" readOnly defaultValue="111111" getDigitLabel={(i) => `Lectura ${i + 1}`} />
      <CodeInput label="Deshabilitado" disabled getDigitLabel={(i) => `Off ${i + 1}`} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const err = canvas.getByRole('textbox', { name: 'Error 1' });
    await expect(err).toHaveAttribute('aria-invalid', 'true');
    await expect(err).toHaveAccessibleDescription('El código no es válido');
    const ro = canvas.getByRole('textbox', { name: 'Lectura 2' });
    await userEvent.click(ro);
    await userEvent.keyboard('9{Backspace}');
    await expect(ro).toHaveValue('1');
    await expect(ro).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('textbox', { name: 'Lectura 3' })).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: 'Off 1' })).toBeDisabled();
  },
};

function CodeInputApiDemo() {
  const ref = useRef<HTMLInputElement>(null);
  const [refs, setRefs] = useState('');
  const [error, setError] = useState<string | undefined>();
  useEffect(() => setRefs(`${ref.current?.getAttribute('aria-label')}`), []);
  return (
    <div className="flex flex-col gap-4">
      <CodeInput ref={ref} label="Código" optional required tooltip="Llega por SMS" errorText={error} />
      <button type="button" onClick={() => setError('El código no es válido')}>
        Validar
      </button>
      <output data-testid="refs">{refs}</output>
    </div>
  );
}

/**
 * API común: `ref` a la primera casilla, `required` nativo, " | Opcional", tooltip, y el error en la región viva común
 * (`aria-live="polite"`, sin `role="alert"`) que describe cada casilla.
 */
export const ApiTest: Story = {
  tags: ['!autodocs'],
  render: () => <CodeInputApiDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('refs')).toHaveTextContent('Dígito 1 de 6');
    await expect(canvas.getByRole('group', { name: /^Código ?\| Opcional$/ })).toBeVisible();
    const cells = getCells(canvasElement);
    await expect(cells[0]).toBeRequired();
    await expect(cells[0]).toHaveAccessibleDescription('Llega por SMS');
    const region = canvasElement.querySelector('[aria-live="polite"]')!;
    await expect(region).toBeEmptyDOMElement();
    await userEvent.click(canvas.getByRole('button', { name: 'Validar' }));
    await expect(region).toHaveTextContent('El código no es válido');
    await expect(canvas.queryByRole('alert')).toBeNull();
    await expect(cells[2]).toHaveAttribute('aria-invalid', 'true');
    await expect(cells[2]).toHaveAccessibleDescription('El código no es válido Llega por SMS');
  },
};
