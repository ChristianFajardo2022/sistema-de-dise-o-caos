import type { ComponentProps, ReactNode, Ref } from 'react';
import { Logo } from '../../components/Logo';
import { NotchedSurface } from '../../components/_internal/NotchedSurface';
import { cn } from '../../utils/cn';

/**
 * Piezas compartidas por las pantallas de autenticación (Login y Code OTP). No se exportan desde el paquete:
 * son solo estructura (superficie, encabezado, divisor) y no tienen comportamiento propio.
 */

/** Tipografía de Figma: título de pantalla (heading xl en la bienvenida, lg en los pasos). */
const HEADING_BASE =
  'm-0 text-center font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-text-neutral-heading outline-hidden whitespace-pre-line';
const HEADING_SIZE = {
  xl: 'text-ds-typography-heading-size-xl leading-ds-typography-heading-line-height-xl',
  lg: 'text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg',
} as const;

export interface AuthSurfaceProps extends Omit<ComponentProps<'section'>, 'ref'> {
  /** Muesca arriba a la derecha para el Button corner (Code OTP en modal). */
  notch?: 'none' | 'md';
  /** Clases del marco interior ("desktop" de Figma): padding y gap entre bloques (por defecto `space/general/6xl` y `4xl`). */
  contentClassName?: string;
  ref?: Ref<HTMLElement>;
}

/**
 * Superficie de la pantalla (marco "Canva" + "Subtract" de Figma: background/container/default-on-canva, radius 2xl)
 * y marco interior "desktop" con el padding. En móvil la pantalla es de página completa y no dibuja tarjeta
 * (Figma solo la define en escritorio).
 */
export function AuthSurface({ notch = 'none', contentClassName, className, children, ref, ...rest }: AuthSurfaceProps) {
  return (
    <section ref={ref} {...rest} className={cn('relative isolate box-border w-[544px] max-w-full', className)}>
      <NotchedSurface
        notch={notch}
        shadow="on-canva"
        className="[--surface-fill:var(--color-ds-background-container-default-on-canva)] mobile:hidden"
      />
      <div
        data-figma-part="desktop"
        className={cn(
          'box-border flex w-full flex-col items-center gap-ds-space-general-4xl p-ds-space-general-6xl',
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}

export interface AuthHeaderProps {
  /** Id del título (el contenedor lo usa en `aria-labelledby`). */
  id: string;
  title: ReactNode;
  /** Segunda línea. En `welcome` es cuerpo grande; en `step`, descripción en semibold gris. */
  description?: ReactNode;
  /** Id de la descripción (para `aria-describedby`). */
  descriptionId?: string;
  /** Nombre de la capa de Figma del título y de la descripción para el comparador (por defecto, el propio texto). */
  titlePart?: string;
  descriptionPart?: string;
  /** `welcome`: heading xl + cuerpo 2xl blanco (Login). `step`: heading lg + descripción semibold (registro y verificación). */
  variant?: 'welcome' | 'step';
  /** Nivel del título: h1 en pantalla completa, h2 dentro de un diálogo. */
  as?: 'h1' | 'h2';
  /** Ref del título: recibe el foco programático al cambiar de paso (`tabIndex=-1`). */
  headingRef?: Ref<HTMLHeadingElement>;
  /** Logo de la marca encima del título (Info de Figma). */
  logo?: boolean;
  /** Figma fija la descripción en 24 de alto salvo en el paso del código del diálogo (22, el alto de su línea). */
  compactDescription?: boolean;
  className?: string;
}

/** Bloque "Info" de Figma: logo opcional, título y descripción centrados. */
export function AuthHeader({
  id,
  title,
  description,
  descriptionId,
  titlePart,
  descriptionPart,
  variant = 'step',
  as: Heading = 'h1',
  headingRef,
  logo = false,
  compactDescription = false,
  className,
}: AuthHeaderProps) {
  const welcome = variant === 'welcome';
  return (
    <div
      data-figma-part="Info"
      className={cn(
        'flex w-full flex-col items-center',
        logo && (welcome ? 'gap-ds-space-general-3xl' : 'gap-ds-space-general-5xl'),
        className
      )}
    >
      {logo && <Logo type="icon" size="md" />}
      <div className={cn('flex w-full flex-col items-center', welcome ? 'gap-ds-space-general-md' : 'gap-ds-space-general-lg')}>
        <Heading id={id} ref={headingRef} tabIndex={-1} data-figma-part={titlePart ?? (typeof title === 'string' ? title : undefined)} className={cn(HEADING_BASE, HEADING_SIZE[welcome ? 'xl' : 'lg'])}>
          {title}
        </Heading>
        {description && (
          <p
            id={descriptionId}
            data-figma-part={descriptionPart ?? (typeof description === 'string' ? description : undefined)}
            className={cn(
              'm-0 w-full text-center font-ds-primitives-typography-family-primary',
              welcome
                ? 'text-ds-typography-body-size-2xl leading-ds-typography-body-line-height-short-2xl [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-text-neutral-white'
                : 'text-ds-typography-body-size-lg leading-ds-typography-body-line-height-large-lg [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-text-neutral-body',
              !welcome && !compactDescription && 'min-h-6'
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

/** Divisor con texto en el centro ("o inicia sesión con"): dos líneas border/general/gray-fourth. */
export function AuthDivider({ children }: { children: ReactNode }) {
  const line = 'h-px flex-1 bg-ds-border-general-gray-fourth';
  return (
    <div className="flex w-full items-center gap-ds-space-general-2xl">
      <span aria-hidden="true" className={line} />
      <span
        data-figma-part={typeof children === 'string' ? children : undefined}
        className="font-ds-primitives-typography-family-primary text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-body"
      >
        {children}
      </span>
      <span aria-hidden="true" className={line} />
    </div>
  );
}

/** Peso del texto de las filas de ayuda ("¿Aún no tienes cuenta?", "¿No lo recibiste?"). */
export const AUTH_HINT_TEXT = 'm-0 [font-weight:var(--ds-primitives-typography-weight-regular)]';
