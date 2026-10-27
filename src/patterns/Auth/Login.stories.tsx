import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ForgotPasswordScreen, LoginScreen, RegisterScreen } from './Login.screens';

/**
 * Pantallas de acceso (component set "Login" de Figma, 14454:47131, estados Login y Register / Forgot).
 *
 * Son **composiciones**, no componentes exportados: cada producto enlaza su autenticación y su ruteo. Se arman con
 * Logo, PhoneInput, Input (contraseña con botón de mostrar), Button y ButtonLink.
 *
 * - `<form noValidate>` con `onSubmit`: la validación es propia, los mensajes quedan asociados al campo
 *   (`aria-describedby`, `aria-invalid`) y el foco va al primer campo con error.
 * - `autocomplete`: `current-password` al iniciar sesión, `new-password` al registrarse; el número lo fija
 *   PhoneInput en `tel-national`.
 * - Registro y recuperación comparten la plantilla "Register / Forgot" de Figma (título, descripción y espacio para los campos).
 * - En móvil la pantalla es de página completa: la tarjeta (`Canva`) solo existe en escritorio.
 */
const meta = {
  title: 'Patterns/Auth/Login',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Page = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen items-start justify-center bg-ds-background-general-black p-6 mobile:p-0">{children}</div>
);

/** Inicio de sesión: número, contraseña, recuperar acceso, acceso social y registro. */
export const Login: Story = {
  args: {},
  render: () => (
    <Page>
      <LoginScreen onSubmit={() => new Promise((resolve) => setTimeout(resolve, 600))} />
    </Page>
  ),
};

/** Registro: número, contraseña y confirmación, con "Anterior". */
export const Register: Story = {
  render: () => (
    <Page>
      <RegisterScreen onSubmit={() => new Promise((resolve) => setTimeout(resolve, 600))} />
    </Page>
  ),
};

/** Recuperar acceso: pide el número; después sigue la pantalla de código (Patterns/Auth/Code OTP). */
export const ForgotPassword: Story = {
  render: () => (
    <Page>
      <ForgotPasswordScreen />
    </Page>
  ),
};

const FrameLabel = ({ children }: { children: ReactNode }) => <p className="m-0 mb-2 text-xs text-ds-text-neutral-body">{children}</p>;

const MATRIX_LABELS = { prefix: 'Label', phone: 'Label', password: 'Label', confirmPassword: 'Label' };

/** Las dos variantes de Figma con sus textos genéricos, para el comparador. */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de Login" className="flex max-w-full flex-wrap items-start gap-10 overflow-x-auto">
        <div>
          <FrameLabel>State=Login</FrameLabel>
          <LoginScreen frame="State=Login" labels={MATRIX_LABELS} defaultCountryCode={null} />
        </div>
        <div>
          <FrameLabel>State=Register/ Forgot</FrameLabel>
          <RegisterScreen frame="State=Register/ Forgot" labels={MATRIX_LABELS} defaultCountryCode={null} title="Crear cuenta" description="Descripción" />
        </div>
      </div>
    </div>
  ),
};

const loginSpy = fn();

/** Test: enviar vacío marca los campos con error, los asocia y enfoca el primero; con datos válidos envía. */
export const LoginValidationTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Page>
      <LoginScreen onSubmit={loginSpy} />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Iniciar sesión' }));
    const phone = canvas.getByRole('textbox', { name: /Número de celular/ });
    await waitFor(() => expect(phone).toHaveFocus());
    await expect(phone).toBeInvalid();
    await expect(phone).toHaveAccessibleDescription('Escribe un número de celular válido.');
    await userEvent.type(phone, '5550100');
    await userEvent.click(canvas.getByRole('button', { name: 'Iniciar sesión' }));
    const password = canvas.getByLabelText('Contraseña', { selector: 'input' });
    await waitFor(() => expect(password).toHaveFocus());
    await expect(password).toHaveAttribute('autocomplete', 'current-password');
    await userEvent.type(password, 'secreta-1');
    await userEvent.click(canvas.getByRole('button', { name: 'Mostrar contraseña' }));
    await expect(password).toHaveAttribute('type', 'text');
    await userEvent.click(canvas.getByRole('button', { name: 'Iniciar sesión' }));
    await waitFor(() => expect(loginSpy).toHaveBeenCalledWith({ phone: '5550100', password: 'secreta-1' }));
  },
};

/** Test: el registro exige que las contraseñas coincidan y enfoca la confirmación. */
export const RegisterValidationTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Page>
      <RegisterScreen />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: /Número de celular/ }), '5550100');
    await userEvent.type(canvas.getByLabelText('Contraseña', { selector: 'input' }), 'clave-segura');
    const confirm = canvas.getByLabelText('Confirmar contraseña', { selector: 'input' });
    await userEvent.type(confirm, 'otra-clave-1');
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    await waitFor(() => expect(confirm).toHaveFocus());
    await expect(confirm).toHaveAccessibleDescription('Las contraseñas no coinciden.');
    await expect(confirm).toHaveAttribute('autocomplete', 'new-password');
  },
};

const rejectSpy = fn(async () => {
  throw new Error('rechazado');
});

/** Test: si el producto rechaza el envío, el registro muestra un aviso (`role="alert"`) y devuelve el foco al primer campo. */
export const RegisterRejectTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Page>
      <RegisterScreen onSubmit={rejectSpy} />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const phone = canvas.getByRole('textbox', { name: /Número de celular/ });
    await userEvent.type(phone, '5550100');
    await userEvent.type(canvas.getByLabelText('Contraseña', { selector: 'input' }), 'clave-segura');
    await userEvent.type(canvas.getByLabelText('Confirmar contraseña', { selector: 'input' }), 'clave-segura');
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('No pudimos crear tu cuenta'));
    await expect(phone).toHaveFocus();
    await expect(canvas.getByRole('button', { name: 'Continuar' })).toBeEnabled();
  },
};

/** Test: si el producto rechaza el envío, Recuperar acceso muestra un aviso y devuelve el foco al campo. */
export const ForgotRejectTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Page>
      <ForgotPasswordScreen onSubmit={rejectSpy} />
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const phone = canvas.getByRole('textbox', { name: /Número de celular/ });
    await userEvent.type(phone, '5550100');
    await userEvent.click(canvas.getByRole('button', { name: 'Continuar' }));
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('No pudimos enviar el código'));
    await expect(phone).toHaveFocus();
  },
};
