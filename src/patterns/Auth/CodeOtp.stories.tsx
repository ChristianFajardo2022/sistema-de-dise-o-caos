import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { CodeOtpScreen } from './CodeOtp.screens';
import type { OtpContact, OtpInitialState } from './CodeOtp.screens';

// Figma: 14375:75370
/**
 * Verificación con código (component set "Code OTP" de Figma: Type=Modal | Start × States=Select, Default,
 * Focus, Filled, Loading, Check, Error).
 *
 * Es una **composición** de Alert, Button, ButtonCorner, ButtonLink, CodeInput (casillas DigitInput, "Input number
 * (Atom)" de Figma) e InteractiveCard (el radio de cada tarjeta es el control). El producto aporta `verify`, el reenvío y
 * el cierre; los datos que se ven son de ejemplo.
 *
 * - **Dos pasos.** Elegir dónde recibir el código (grupo de radios) y escribirlo. Al cambiar de paso el foco va al título.
 * - **Código.** `autocomplete="one-time-code"` en la primera casilla (la que recibe el código entero del sistema), pegar
 *   reparte los dígitos, flechas y Retroceso se mueven entre casillas. "Confirmar código" se habilita con los 6 dígitos.
 * - **Reenviar** espera 20 s: la cuenta regresiva es un `role="timer"` que no se anuncia segundo a segundo; al terminar
 *   (y al reenviar) una región `role="status"` lo dice. "Reenviar" es una acción: lleva rol de botón.
 * - **Error.** "Código incorrecto" queda asociado a las casillas (`aria-invalid`, `aria-describedby`) y el foco vuelve a
 *   la primera.
 * - `Modal` es la presentación de diálogo (`role="dialog"`, Button corner de cierre); el producto la monta dentro de su
 *   overlay. `Start` es la pantalla propia con "Anterior". En móvil la tarjeta no se dibuja.
 */
const meta = {
  title: 'Patterns/Auth/Code OTP',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const CONTACTS: OtpContact[] = [
  { id: 'phone', value: '555*****00', label: 'Celular' },
  { id: 'email', value: 'u********@ejemplo.co', label: 'Correo electrónico' },
];

/** Código correcto de ejemplo. */
const VALID_CODE = '123456';
const verifyExample = (code: string) => new Promise<boolean>((resolve) => setTimeout(() => resolve(code === VALID_CODE), 700));

const Page = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen items-start justify-center bg-ds-background-general-black p-6 mobile:p-0">{children}</div>
);

/** Diálogo: elegir dónde recibir el código, escribirlo y confirmarlo (el código de ejemplo es 123456). */
export const Modal: Story = {
  render: () => (
    <Page>
      <CodeOtpScreen type="modal" contacts={CONTACTS} verify={verifyExample} />
    </Page>
  ),
};

/** Pantalla propia con "Anterior" y la marca (el código de ejemplo es 123456). */
export const Start: Story = {
  render: () => (
    <Page>
      <CodeOtpScreen type="start" contacts={CONTACTS} verify={verifyExample} />
    </Page>
  ),
};

const FrameLabel = ({ children }: { children: ReactNode }) => <p className="m-0 mb-2 text-xs text-ds-text-neutral-body">{children}</p>;

const STATES: { name: string; initial: OtpInitialState }[] = [
  { name: 'Select', initial: { step: 'select' } },
  { name: 'Default', initial: { step: 'code', secondsLeft: 20 } },
  { name: 'Focus', initial: { step: 'code', code: '1', secondsLeft: 20, focusStyle: true } },
  { name: 'Filled', initial: { step: 'code', code: '111111', secondsLeft: 0 } },
  { name: 'Loading', initial: { step: 'code', code: '111111', secondsLeft: 0, status: 'loading' } },
  { name: 'Check', initial: { step: 'code', code: '111111', secondsLeft: 0, status: 'success' } },
  { name: 'Error', initial: { step: 'code', code: '111111', secondsLeft: 0, status: 'error' } },
];

/** Las 14 variantes de Figma (cuenta regresiva congelada), para el comparador. */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de Code OTP" className="flex max-w-full flex-col gap-10 overflow-x-auto">
        {(['Modal', 'Start'] as const).map((type) => (
          <div key={type} className="flex flex-wrap items-start gap-10">
            {STATES.map(({ name, initial }) => {
              const frame = `Type=${type}, States=${name}`;
              return (
                <div key={frame}>
                  <FrameLabel>{frame}</FrameLabel>
                  <CodeOtpScreen
                    type={type.toLowerCase() as 'modal' | 'start'}
                    contacts={CONTACTS}
                    initial={{ ...initial, paused: true }}
                    frame={frame}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  ),
};

const closeSpy = fn();
const resendSpy = fn();
const verifiedSpy = fn();

/**
 * Test: flujo completo. Continuar mueve el foco al título; un código incorrecto marca error y devuelve el foco a la
 * primera casilla; "Reenviar" espera la cuenta regresiva y la reinicia; el código correcto confirma.
 */
export const FlowTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Page>
      <CodeOtpScreen type="start" contacts={CONTACTS} verify={verifyExample} resendSeconds={2} onResend={resendSpy} onVerified={verifiedSpy} />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: /u\*+@ejemplo\.co/ }));
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    const heading = await canvas.findByRole('heading', { name: 'Escribe el código que recibiste' });
    await waitFor(() => expect(heading).toHaveFocus());

    const confirm = canvas.getByRole('button', { name: 'Confirmar código' });
    await expect(confirm).toBeDisabled();
    const first = canvas.getByRole('textbox', { name: 'Dígito 1 de 6' });
    await expect(first).toHaveAttribute('autocomplete', 'one-time-code');
    await userEvent.click(first);
    await userEvent.keyboard('111111');
    await expect(confirm).toBeEnabled();
    await userEvent.click(confirm);
    await waitFor(() => expect(canvas.getByText('Código incorrecto')).toBeInTheDocument());
    await waitFor(() => expect(first).toHaveFocus());
    await expect(first).toBeInvalid();
    await expect(first).toHaveAccessibleDescription('Código incorrecto');

    const resend = canvas.getByRole('button', { name: 'Reenviar' });
    await waitFor(() => expect(resend).toBeEnabled(), { timeout: 4000 });
    await userEvent.click(resend);
    await expect(resendSpy).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole('timer')).toHaveTextContent('Podrás pedir uno nuevo en');
    await expect(canvas.queryByText('Código incorrecto')).not.toBeInTheDocument();

    await waitFor(() => expect(first).toHaveFocus());
    await userEvent.keyboard(VALID_CODE);
    await userEvent.click(canvas.getByRole('button', { name: 'Confirmar código' }));
    await waitFor(() => expect(verifiedSpy).toHaveBeenCalledTimes(1), { timeout: 3000 });
    await expect(canvas.getByRole('status')).toHaveTextContent('Código verificado.');
  },
};

/** Test: el diálogo se nombra por su título y "Cerrar" avisa al producto. */
export const ModalTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Page>
      <CodeOtpScreen type="modal" contacts={CONTACTS} onClose={closeSpy} />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvas.getByRole('dialog', { name: /necesitamos confirmar que eres tú/ });
    await expect(within(dialog).getByRole('radiogroup', { name: 'Elige dónde quieres recibir el código de seguridad' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Cerrar' }));
    await expect(closeSpy).toHaveBeenCalledTimes(1);
  },
};


/** Test: al confirmar con clic, el botón se desmonta con el éxito y el foco pasa al título (no cae a `body`). */
export const ClickConfirmFocusTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Page>
      <CodeOtpScreen type="start" contacts={CONTACTS} verify={verifyExample} />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    const first = await canvas.findByRole('textbox', { name: 'Dígito 1 de 6' });
    await userEvent.click(first);
    await userEvent.keyboard(VALID_CODE);
    await userEvent.click(canvas.getByRole('button', { name: 'Confirmar código' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Código verificado.'), { timeout: 3000 });
    await expect(canvasElement.querySelector('button[type="submit"]')).toBeNull();
    const heading = canvas.getByRole('heading', { name: 'Escribe el código que recibiste' });
    await expect(heading).toHaveFocus();
  },
};
