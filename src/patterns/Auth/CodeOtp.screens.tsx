import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { ButtonCorner } from '../../components/ButtonCorner';
import { ButtonLink } from '../../components/ButtonLink';
import { CodeInput } from '../../components/CodeInput';
import { Icon } from '../../components/Icon';
import { InteractiveCard } from '../../components/InteractiveCard';
import { ItemCard } from '../../components/_internal/ItemCardMark';
import { cn } from '../../utils/cn';
import { AUTH_HINT_TEXT, AuthHeader, AuthSurface } from './Auth.parts';

/**
 * Verificación con código de un solo uso (component set "Code OTP" de Figma, 14375:75370): primero se elige dónde
 * recibir el código (`select`) y después se escribe (`code`). Dos presentaciones: `modal` (diálogo con Button corner)
 * y `start` (pantalla propia con "Anterior" y la marca).
 *
 * El bloque del código (casillas, cuenta regresiva, "¿No lo recibiste?" y reenvío) solo se usa aquí, así que vive en
 * este patrón y no es un componente aparte. Lo que sí resuelve: cuenta regresiva sin anunciar cada segundo, reenvío
 * que reinicia el tiempo, foco al primer dígito en error y al título al cambiar de paso, y anuncios en una región
 * `role="status"`.
 *
 * Con `type="modal"` el `role="dialog"` queda sin `aria-modal`, sin Escape y sin foco inicial: eso lo resuelve el
 * overlay del producto (Modal o Backdrop). No se monta sin él.
 */

export interface OtpContact {
  id: string;
  /** Dato enmascarado (título de la tarjeta). */
  value: string;
  /** Tipo de dato (subtítulo de la tarjeta): "Celular", "Correo electrónico". */
  label: string;
}

export type OtpType = 'modal' | 'start';
export type OtpStep = 'select' | 'code';
export type OtpStatus = 'idle' | 'loading' | 'success' | 'error';

/** Estado inicial (y estados forzados para documentar cada variante de Figma). */
export interface OtpInitialState {
  step?: OtpStep;
  contactId?: string;
  code?: string;
  status?: OtpStatus;
  /** Segundos restantes para poder reenviar. 0 = ya se puede reenviar. */
  secondsLeft?: number;
  /** Dibuja las casillas con el aspecto de foco (State=Focus de Figma), sin mover el foco. */
  focusStyle?: boolean;
  /** Congela la cuenta regresiva (para capturas y para el comparador). */
  paused?: boolean;
}

export interface CodeOtpScreenProps {
  type?: OtpType;
  contacts: OtpContact[];
  /** Verifica el código. Devuelve `true` si es correcto. Por defecto acepta cualquier código completo. */
  verify?: (code: string, contact: OtpContact) => Promise<boolean>;
  onVerified?: (contact: OtpContact) => void;
  /** Se pidió reenviar el código (después de terminar la cuenta regresiva). */
  onResend?: (contact: OtpContact) => void;
  /** Cierra el diálogo (`modal`). */
  onClose?: () => void;
  /** Sale del flujo desde el primer paso con "Anterior" (`start`). */
  onBack?: () => void;
  /** Segundos de espera entre envíos. Por defecto 20. */
  resendSeconds?: number;
  initial?: OtpInitialState;
  /** `data-figma` de la raíz (lo usa el comparador). */
  frame?: string;
  className?: string;
}

const CODE_LENGTH = 6;
const SELECT_TITLE = 'Para continuar,\nnecesitamos confirmar que eres tú';
/** Nombre de la capa en Figma (el salto de línea es U+2028). */
const SELECT_TITLE_PART = 'Para continuar,  necesitamos confirmar que eres tú';

const seconds = (n: number) => `${n} ${n === 1 ? 'segundo' : 'segundos'}`;

export function CodeOtpScreen({
  type = 'modal',
  contacts,
  verify,
  onVerified,
  onResend,
  onClose,
  onBack,
  resendSeconds = 20,
  initial,
  frame,
  className,
}: CodeOtpScreenProps) {
  const modal = type === 'modal';
  const titleId = useId();
  const descId = useId();
  const frameId = useId();
  // En la matriz conviven 14 pantallas iguales: el nombre de cada punto de referencia se completa con la variante
  const labelledBy = frame ? `${titleId} ${frameId}` : titleId;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstCellRef = useRef<HTMLInputElement>(null);
  const moved = useRef(false);

  const [step, setStep] = useState<OtpStep>(initial?.step ?? 'select');
  const [contactId, setContactId] = useState(initial?.contactId ?? contacts[0]?.id ?? '');
  const [code, setCode] = useState(initial?.code ?? '');
  const [status, setStatus] = useState<OtpStatus>(initial?.status ?? 'idle');
  const [secondsLeft, setSecondsLeft] = useState(initial?.secondsLeft ?? resendSeconds);
  const [announcement, setAnnouncement] = useState('');
  const paused = initial?.paused ?? false;

  const contact = contacts.find((c) => c.id === contactId) ?? contacts[0];
  const counting = secondsLeft > 0;

  // Cuenta regresiva: un tick por segundo mientras se ve el paso del código
  useEffect(() => {
    if (step !== 'code' || paused || secondsLeft <= 0) return;
    const timer = setTimeout(() => {
      setSecondsLeft((s) => s - 1);
      if (secondsLeft - 1 === 0) setAnnouncement('Ya puedes pedir un código nuevo.');
    }, 1000);
    return () => clearTimeout(timer);
  }, [step, paused, secondsLeft]);

  // Al cambiar de paso (no en la carga) el foco va al título del paso nuevo
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);

  const goTo = (next: OtpStep) => {
    moved.current = true;
    setStep(next);
  };

  const handleSelect = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCode('');
    setStatus('idle');
    setSecondsLeft(resendSeconds);
    setAnnouncement(`Enviamos un código a ${contact?.value}.`);
    goTo('code');
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!contact || code.length < CODE_LENGTH || status === 'loading' || status === 'success') return;
    setStatus('loading');
    let ok = false;
    try {
      ok = verify ? await verify(code, contact) : true;
    } catch {
      ok = false;
    }
    if (ok) {
      // El botón "Confirmar código" se desmonta con el éxito: si tenía el foco (clic), se lleva al título para no perderlo
      headingRef.current?.focus();
      setStatus('success');
      setAnnouncement('Código verificado.');
      onVerified?.(contact);
    } else {
      setStatus('error');
      firstCellRef.current?.focus();
    }
  };

  const handleResend = () => {
    if (!contact || counting) return;
    setCode('');
    setStatus('idle');
    setSecondsLeft(resendSeconds);
    setAnnouncement(`Enviamos un código nuevo a ${contact.value}.`);
    onResend?.(contact);
    firstCellRef.current?.focus();
  };

  const back = step === 'code' ? () => goTo('select') : onBack;
  const isSelect = step === 'select';
  const busy = status === 'loading';

  return (
    <AuthSurface
      role={modal ? 'dialog' : undefined}
      aria-labelledby={labelledBy}
      data-figma={frame}
      notch={modal ? 'md' : 'none'}
      contentClassName={cn(!modal && 'py-ds-space-general-5xl', 'items-stretch')}
      className={className}
    >
      {modal && (
        <ButtonCorner
          variant="icon"
          contrast="on-canva"
          size="md"
          aria-label="Cerrar"
          onClick={onClose}
          icon={<Icon name="close" size={16} variant="line" data-figma-part="Icon-sizes" />}
          data-figma-part="Button corner "
          className="absolute top-0 right-0"
        />
      )}

      {!modal && (
        <Button
          variant="tertiary"
          size="xs"
          leftIcon={<Icon name="chevron-left" size={14} variant="fill" data-figma-part="Icon-sizes" />}
          onClick={back}
          className="w-full justify-start"
          data-figma-part="Button"
        >
          Anterior
        </Button>
      )}

      {isSelect ? (
        <>
          <AuthHeader
            id={titleId}
            descriptionId={descId}
            as={modal ? 'h2' : 'h1'}
            headingRef={headingRef}
            logo={!modal}
            title={SELECT_TITLE}
            titlePart={SELECT_TITLE_PART}
            description="Elige dónde quieres recibir el código de seguridad"
          />
          <form noValidate onSubmit={handleSelect} className="flex w-full flex-col gap-ds-space-general-4xl">
            <div className="flex w-full flex-col gap-ds-space-general-2xl" data-figma-part="Frame 1984080129">
              <div role="radiogroup" aria-labelledby={descId} className="flex w-full flex-col gap-ds-space-general-2xl">
                {contacts.map((c) => (
                  <InteractiveCard
                    key={c.id}
                    name="channel"
                    value={c.id}
                    title={c.value}
                    subtitle={c.label}
                    icon="folder"
                    checked={contactId === c.id}
                    onChange={() => setContactId(c.id)}
                    rootProps={{ 'data-figma-part': 'Interactive card ' }}
                  />
                ))}
              </div>
              <Alert type="info" background={false} data-figma-part="Alerts">
                Si los datos no son correctos, modifícalos en tu perfil
              </Alert>
            </div>
            <Button type="submit" size="md" className="w-full" data-figma-part="Button">
              Continuar
            </Button>
          </form>
        </>
      ) : (
        <>
          <AuthHeader
            id={titleId}
            descriptionId={descId}
            as={modal ? 'h2' : 'h1'}
            headingRef={headingRef}
            logo={!modal}
            compactDescription={modal}
            title="Escribe el código que recibiste"
            description={`Ingresa los ${CODE_LENGTH} dígitos`}
          />
          <form noValidate onSubmit={handleConfirm} className="flex w-full flex-col gap-ds-space-general-4xl">
            <div className="flex w-full flex-col items-center gap-ds-space-general-xl" data-figma-part="Container">
              <CodeInput
                ref={firstCellRef}
                fullWidth
                hideLabel
                name="code"
                label={`Código de ${CODE_LENGTH} dígitos`}
                length={CODE_LENGTH}
                required
                value={code}
                onValueChange={(v) => {
                  if (busy || status === 'success') return;
                  setCode(v);
                  if (status === 'error') setStatus('idle');
                }}
                errorText={status === 'error' ? 'Código incorrecto' : undefined}
                // `state` solo fuerza el aspecto: éxito sin mensaje (Figma lo oculta) y foco para documentar
                state={status === 'success' ? 'success' : initial?.focusStyle ? 'active' : undefined}
              />

              {counting && (
                <p
                  role="timer"
                  aria-live="off"
                  className={cn(
                    AUTH_HINT_TEXT,
                    'flex items-center gap-ds-space-general-lg font-ds-primitives-typography-family-primary text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg text-ds-text-neutral-heading'
                  )}
                >
                  <span data-figma-part="Podrás pedir uno nuevo en">Podrás pedir uno nuevo en</span>
                  <strong
                    data-figma-part="20 segundos"
                    className="[font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-text-semantic-alert-secondary"
                  >
                    {seconds(secondsLeft)}
                  </strong>
                </p>
              )}

              <div className="flex items-center gap-ds-space-general-lg">
                <p
                  className={cn(
                    AUTH_HINT_TEXT,
                    'font-ds-primitives-typography-family-primary text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg text-ds-text-neutral-body'
                  )}
                  data-figma-part="¿No lo recibiste?"
                >
                  ¿No lo recibiste?
                </p>
                {/* "Reenviar" es una acción, no una navegación: ButtonLink sin `href` es un <button> nativo */}
                <ButtonLink
                  iconRight={false}
                  disabled={counting || busy || status === 'success'}
                  onClick={handleResend}
                  data-figma-part="Button"
                >
                  Reenviar
                </ButtonLink>
              </div>
            </div>

            {status === 'success' ? (
              <div className="flex w-full justify-center" data-figma-part="CTA">
                <ItemCard icon="tick-circle" />
              </div>
            ) : (
              <Button
                type="submit"
                size="md"
                loading={busy}
                disabled={code.length < CODE_LENGTH && !busy}
                className="w-full"
                data-figma-part="Button"
              >
                Confirmar código
              </Button>
            )}
          </form>
        </>
      )}

      {frame && (
        <span id={frameId} hidden>
          {frame}
        </span>
      )}

      {/* Región de anuncios: el cambio de paso, el reenvío, la cuenta terminada y el resultado */}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </AuthSurface>
  );
}
