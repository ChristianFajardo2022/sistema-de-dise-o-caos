import type { ComponentProps, ReactNode, Ref } from 'react';
import { Button } from '../../components/Button';
import { buttonVariants } from '../../components/Button/Button.variants';
import { Logo } from '../../components/Logo';
import { cn } from '../../utils/cn';

/**
 * Página de error 404 / 500 sin juego (component set "Error pages" de Figma, 21691:376, variante Game=No).
 *
 * Es una **composición**: cada producto decide a dónde vuelve el botón y qué dice. Se arma con Logo y Button.
 * Estructura: `main` con `h1` (el título) y el número grande como adorno `aria-hidden` (el título ya dice el error).
 *
 * Responsive: en escritorio el número va arriba del logo (250 px); en móvil el logo va primero y el número baja a 150 px.
 * `layout` fuerza una de las dos disposiciones (para documentación y el comparador); por defecto sigue el viewport.
 */
export type ErrorPageLayout = 'auto' | 'desktop' | 'mobile';

export interface ErrorPageProps extends Omit<ComponentProps<'main'>, 'title' | 'ref'> {
  /** Número grande decorativo (`aria-hidden`): `404`, `500` o cualquier texto. Si el título no dice el error, inclúyelo ahí. */
  code?: '404' | '500' | (string & {});
  /** Título (h1). */
  title: ReactNode;
  /** Texto de apoyo. */
  description?: ReactNode;
  /** Acción propia (slot). Sustituye al botón por defecto. */
  action?: ReactNode;
  /** Texto del botón por defecto. */
  actionLabel?: string;
  /** Con `href` el botón por defecto es un enlace (navegación real); sin él, un botón que llama a `onAction`. */
  href?: string;
  onAction?: () => void;
  /** Logo de la marca. Por defecto el símbolo decorativo; `false` lo oculta. */
  logo?: ReactNode | false;
  /** Disposición: `auto` (según el viewport), `desktop` o `mobile` forzadas. */
  layout?: ErrorPageLayout;
  /** Contenedor raíz: `main` (por defecto) o `div` cuando varias páginas conviven en una vista (documentación). */
  as?: 'main' | 'div';
  ref?: Ref<HTMLElement>;
}

const HEADING_BASE =
  'm-0 w-full text-center font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-text-neutral-heading';
const BODY_BASE =
  'm-0 w-full text-center font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-text-neutral-heading';

/** Clases por disposición. Escritas completas para que Tailwind las detecte. */
const DESKTOP = {
  root: 'pt-ds-space-general-6xl pb-ds-space-canva-top',
  code: 'order-first text-[250px] leading-[196px]',
  title: 'text-ds-typography-heading-size-xl leading-ds-typography-heading-line-height-xl',
  description: 'text-ds-typography-body-size-2xl leading-ds-typography-body-line-height-short-2xl',
};
const MOBILE_FORCED = {
  root: 'pt-ds-space-general-7xl pb-ds-space-canva-bottom',
  code: 'order-none text-[150px] leading-[111px]',
  title: 'text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg',
  description: 'text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md',
};
const MOBILE_AUTO = {
  root: 'mobile:pt-ds-space-general-7xl mobile:pb-ds-space-canva-bottom',
  code: 'mobile:order-none mobile:text-[150px] mobile:leading-[111px]',
  title: 'mobile:text-ds-typography-heading-size-lg mobile:leading-ds-typography-heading-line-height-lg',
  description: 'mobile:text-ds-typography-body-size-md mobile:leading-ds-typography-body-line-height-short-md',
};

function pick(part: keyof typeof DESKTOP, layout: ErrorPageLayout) {
  if (layout === 'mobile') return MOBILE_FORCED[part];
  if (layout === 'desktop') return DESKTOP[part];
  return cn(DESKTOP[part], MOBILE_AUTO[part]);
}

export function ErrorPage({
  code = '404',
  title,
  description,
  action,
  actionLabel = 'Volver al inicio',
  href,
  onAction,
  logo,
  layout = 'auto',
  as: Root = 'main',
  className,
  ref,
  ...rest
}: ErrorPageProps) {
  const logoNode = logo === false ? null : (logo ?? <Logo type="icon" size="md" decorative />);

  const defaultAction = href ? (
    <a href={href} className={cn(buttonVariants({ variant: 'primary', size: 'md', state: 'default' }), 'no-underline')}>
      <span className="pb-ds-space-button-sm">{actionLabel}</span>
    </a>
  ) : (
    <Button onClick={onAction}>{actionLabel}</Button>
  );

  return (
    <Root
      ref={ref as Ref<HTMLDivElement>}
      {...rest}
      className={cn(
        'box-border flex min-h-screen w-full flex-col items-center justify-center gap-ds-space-general-5xl bg-ds-background-container-surface px-ds-space-canva-lateral',
        pick('root', layout),
        className
      )}
    >
      <div data-figma-part="Frame 18" className="contents">
        {logoNode && <div data-figma-part="Logo" className="flex">{logoNode}</div>}
        {code && (
          <p
            aria-hidden="true"
            data-figma-part={String(code)}
            className={cn(
              'm-0 w-full select-none text-center font-ds-primitives-typography-family-primary font-bold text-ds-text-neutral-body opacity-10',
              pick('code', layout)
            )}
          >
            {code}
          </p>
        )}
      </div>
      <div data-figma-part="Frame 24" className="flex w-full flex-col items-center gap-ds-space-general-xl">
        <h1 data-figma-part={typeof title === 'string' ? title : undefined} className={cn(HEADING_BASE, pick('title', layout))}>
          {title}
        </h1>
        {description && (
          <p data-figma-part={typeof description === 'string' ? description : undefined} className={cn(BODY_BASE, pick('description', layout))}>
            {description}
          </p>
        )}
      </div>
      {action ?? defaultAction}
    </Root>
  );
}

ErrorPage.displayName = 'ErrorPage';
