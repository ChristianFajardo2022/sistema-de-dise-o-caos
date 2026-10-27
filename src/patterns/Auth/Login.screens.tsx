import { useId, useRef, useState } from 'react';
import type { FormEvent, MouseEventHandler } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { ButtonLink } from '../../components/ButtonLink';
import { Icon } from '../../components/Icon';
import { Input } from '../../components/Input';
import { PhoneInput } from '../../components/PhoneInput';
import { cn } from '../../utils/cn';
import { AUTH_HINT_TEXT, AuthDivider, AuthHeader, AuthSurface } from './Auth.parts';

/**
 * Pantallas de acceso (component set "Login" de Figma, 14454:47131): inicio de sesión, registro y recuperación de
 * acceso. Son composiciones de Logo, PhoneInput, Input, Button y ButtonLink; el producto aporta la autenticación
 * (`onSubmit`) y el ruteo. Los datos que se ven son de ejemplo.
 *
 * Formularios reales: `<form noValidate>` con validación propia (mensajes en español asociados a cada campo con
 * `aria-describedby`), foco en el primer campo con error y `autocomplete` correcto (`current-password`,
 * `new-password`; el número lo fija PhoneInput en `tel-national`).
 */

const NEXT_ICON = <Icon name="chevron-right" size={20} variant="fill" data-figma-part="Icon-sizes" />;

/** Dígitos mínimos de un celular de ejemplo. */
const MIN_PHONE_DIGITS = 7;
const MIN_PASSWORD_LENGTH = 8;

export interface AuthFieldLabels {
  /** Label del selector de indicativo (prop `prefixLabel` de PhoneInput). */
  prefix?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

interface AuthScreenBase {
  /** `data-figma` de la raíz (lo usa el comparador). */
  frame?: string;
  /** Textos de los campos. Por defecto, en español. */
  labels?: AuthFieldLabels;
  /** País inicial del selector de indicativo (`code` de PhoneInput). `null` = sin país (como el estado vacío de Figma). Por defecto, el primero de la lista. */
  defaultCountryCode?: string | null;
  className?: string;
}

// ───────────────────────── Inicio de sesión ─────────────────────────

export type SocialProvider = 'google' | 'facebook';

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface LoginScreenProps extends AuthScreenBase {
  /** Envío válido del formulario. Si rechaza, se muestra un aviso de error y el foco vuelve al primer campo. */
  onSubmit?: (credentials: LoginCredentials) => void | Promise<void>;
  onSocial?: (provider: SocialProvider) => void;
  recoverHref?: string;
  onRecover?: MouseEventHandler<HTMLAnchorElement>;
  registerHref?: string;
  onRegister?: MouseEventHandler<HTMLAnchorElement>;
  title?: string;
  description?: string;
}

export function LoginScreen({
  onSubmit,
  onSocial,
  recoverHref = '#recuperar',
  onRecover,
  registerHref = '#registro',
  onRegister,
  title = '¡Hola!',
  description = 'Un mundo simple te espera',
  labels,
  defaultCountryCode,
  frame,
  className,
}: LoginScreenProps) {
  const titleId = useId();
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const next: typeof errors = {};
    if (phone.length < MIN_PHONE_DIGITS) next.phone = 'Escribe un número de celular válido.';
    if (!password) next.password = 'Escribe tu contraseña.';
    setErrors(next);
    setFormError(null);
    if (next.phone) return phoneRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();
    setBusy(true);
    try {
      await onSubmit?.({ phone, password });
    } catch {
      setFormError('No pudimos iniciar sesión. Revisa tus datos e inténtalo de nuevo.');
      phoneRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthSurface aria-labelledby={titleId} data-figma={frame} contentClassName="gap-ds-space-general-3xl" className={className}>
      <AuthHeader id={titleId} title={title} description={description} variant="welcome" logo />

      <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-ds-space-general-3xl">
        <div className="flex w-full flex-col gap-ds-space-general-2xl" data-figma-part="Espacio 3">
          <PhoneInput
            ref={phoneRef}
            fullWidth
            name="phone"
            required
            label={labels?.phone ?? 'Número de celular'}
            prefixLabel={labels?.prefix ?? 'Indicativo'}
            defaultCountryCode={defaultCountryCode}
            value={phone}
            onValueChange={(v) => {
              setPhone(v);
              setErrors((e) => ({ ...e, phone: undefined }));
            }}
            errorText={errors.phone}
          />
          <Input
            ref={passwordRef}
            fullWidth
            variant="password"
            name="password"
            autoComplete="current-password"
            required
            label={labels?.password ?? 'Contraseña'}
            value={password}
            onValueChange={(v) => {
              setPassword(v);
              setErrors((e) => ({ ...e, password: undefined }));
            }}
            errorText={errors.password}
          />
        </div>

        {formError && (
          <Alert type="error" background={false} role="alert">
            {formError}
          </Alert>
        )}

        <div className="flex w-full flex-col items-center gap-ds-space-general-xl" data-figma-part="CTA">
          <Button type="submit" size="md" loading={busy} className="w-full" data-figma-part="Button">
            Iniciar sesión
          </Button>
          <ButtonLink href={recoverHref} onClick={onRecover} iconRight={false} data-figma-part="Button">
            Recuperar acceso
          </ButtonLink>
        </div>
      </form>

      <div className="flex w-full flex-col gap-ds-space-general-2xl">
        <AuthDivider>o inicia sesión con</AuthDivider>
        <div className="flex w-full gap-ds-space-general-lg" data-figma-part="CTA">
          <Button variant="secondary" rightIcon={NEXT_ICON} className="flex-1" data-figma-part="Button" onClick={() => onSocial?.('google')}>
            Google
          </Button>
          <Button variant="secondary" rightIcon={NEXT_ICON} className="flex-1" data-figma-part="Button" onClick={() => onSocial?.('facebook')}>
            Facebook
          </Button>
        </div>
      </div>

      <p className={cn(AUTH_HINT_TEXT, 'flex items-center gap-ds-space-general-xl font-ds-primitives-typography-family-secondary text-ds-typography-body-size-md leading-4 text-ds-text-neutral-white')}>
        <span data-figma-part="¿Aún no tienes cuenta?">¿Aún no tienes cuenta?</span>
        <ButtonLink href={registerHref} onClick={onRegister} iconRight={false} data-figma-part="Button">
          Regístrate
        </ButtonLink>
      </p>
    </AuthSurface>
  );
}

// ───────────────────────── Registro y recuperación ─────────────────────────

const BackButton = ({ onBack }: { onBack?: () => void }) => (
  <Button
    variant="tertiary"
    size="xs"
    leftIcon={<Icon name="chevron-left" size={14} variant="fill" data-figma-part="Icon-sizes" />}
    onClick={onBack}
    className="w-full justify-start"
    data-figma-part="Button"
  >
    Anterior
  </Button>
);

interface StepScreenBase extends AuthScreenBase {
  onBack?: () => void;
  title?: string;
  description?: string;
}

export interface RegisterData {
  phone: string;
  password: string;
}

export interface RegisterScreenProps extends StepScreenBase {
  onSubmit?: (data: RegisterData) => void | Promise<void>;
}

export function RegisterScreen({
  onSubmit,
  onBack,
  title = 'Crear cuenta',
  description = 'Completa tus datos para empezar',
  labels,
  defaultCountryCode,
  frame,
  className,
}: RegisterScreenProps) {
  const titleId = useId();
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    const next: typeof errors = {};
    if (phone.length < MIN_PHONE_DIGITS) next.phone = 'Escribe un número de celular válido.';
    if (password.length < MIN_PASSWORD_LENGTH) next.password = `Usa al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    if (confirm !== password) next.confirm = 'Las contraseñas no coinciden.';
    setErrors(next);
    setFormError(null);
    if (next.phone) return phoneRef.current?.focus();
    if (next.password) return passwordRef.current?.focus();
    if (next.confirm) return confirmRef.current?.focus();
    setBusy(true);
    try {
      await onSubmit?.({ phone, password });
    } catch {
      setFormError('No pudimos crear tu cuenta. Revisa tus datos e inténtalo de nuevo.');
      phoneRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  const clear = (key: keyof typeof errors) => setErrors((e) => ({ ...e, [key]: undefined }));

  return (
    <AuthSurface aria-labelledby={titleId} data-figma={frame} contentClassName="pt-ds-space-general-5xl" className={className}>
      <BackButton onBack={onBack} />
      <AuthHeader id={titleId} title={title} description={description} logo />
      <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-ds-space-general-4xl">
        <div className="flex w-full flex-col gap-ds-space-general-2xl" data-figma-part="Espacio">
          <PhoneInput
            ref={phoneRef}
            fullWidth
            name="phone"
            required
            label={labels?.phone ?? 'Número de celular'}
            prefixLabel={labels?.prefix ?? 'Indicativo'}
            defaultCountryCode={defaultCountryCode}
            value={phone}
            onValueChange={(v) => {
              setPhone(v);
              clear('phone');
            }}
            errorText={errors.phone}
          />
          <Input
            ref={passwordRef}
            fullWidth
            variant="password"
            name="password"
            autoComplete="new-password"
            required
            label={labels?.password ?? 'Contraseña'}
            value={password}
            onValueChange={(v) => {
              setPassword(v);
              clear('password');
            }}
            errorText={errors.password}
          />
          <Input
            ref={confirmRef}
            fullWidth
            variant="password"
            name="confirm-password"
            autoComplete="new-password"
            required
            label={labels?.confirmPassword ?? 'Confirmar contraseña'}
            value={confirm}
            onValueChange={(v) => {
              setConfirm(v);
              clear('confirm');
            }}
            errorText={errors.confirm}
          />
        </div>

        {formError && (
          <Alert type="error" background={false} role="alert">
            {formError}
          </Alert>
        )}
        <Button type="submit" size="md" loading={busy} className="w-full" data-figma-part="Button">
          Continuar
        </Button>
      </form>
    </AuthSurface>
  );
}

export interface ForgotPasswordScreenProps extends StepScreenBase {
  /** Envío válido: el producto manda el código (después sigue la pantalla Code OTP). */
  onSubmit?: (data: { phone: string }) => void | Promise<void>;
}

export function ForgotPasswordScreen({
  onSubmit,
  onBack,
  title = 'Recuperar acceso',
  description = 'Te enviaremos un código para confirmar que eres tú',
  labels,
  defaultCountryCode,
  frame,
  className,
}: ForgotPasswordScreenProps) {
  const titleId = useId();
  const phoneRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setFormError(null);
    if (phone.length < MIN_PHONE_DIGITS) {
      setError('Escribe un número de celular válido.');
      phoneRef.current?.focus();
      return;
    }
    setBusy(true);
    try {
      await onSubmit?.({ phone });
    } catch {
      setFormError('No pudimos enviar el código. Inténtalo de nuevo.');
      phoneRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthSurface aria-labelledby={titleId} data-figma={frame} contentClassName="pt-ds-space-general-5xl" className={className}>
      <BackButton onBack={onBack} />
      <AuthHeader id={titleId} title={title} description={description} logo />
      <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-ds-space-general-4xl">
        <PhoneInput
          ref={phoneRef}
          fullWidth
          name="phone"
          required
          label={labels?.phone ?? 'Número de celular'}
          prefixLabel={labels?.prefix ?? 'Indicativo'}
          defaultCountryCode={defaultCountryCode}
          value={phone}
          onValueChange={(v) => {
            setPhone(v);
            setError(undefined);
          }}
          errorText={error}
        />

        {formError && (
          <Alert type="error" background={false} role="alert">
            {formError}
          </Alert>
        )}
        <Button type="submit" size="md" loading={busy} className="w-full" data-figma-part="Button">
          Continuar
        </Button>
      </form>
    </AuthSurface>
  );
}
