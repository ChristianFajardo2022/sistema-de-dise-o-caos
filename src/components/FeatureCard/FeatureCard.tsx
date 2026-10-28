import { forwardRef, useId, useLayoutEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { FeatureCardProps } from './FeatureCard.types';
import {
  featureCardBodyClass,
  featureCardCornerClass,
  featureCardCutoutShadowClass,
  featureCardCutoutShapeClass,
  featureCardCutoutTextClass,
  featureCardCutoutTitleClass,
  featureCardDateVariants,
  featureCardDescriptionClass,
  featureCardEyebrowClass,
  featureCardHeaderClass,
  featureCardImageClass,
  featureCardPhotoClass,
  featureCardPlaceholderClass,
  featureCardScrimClass,
  featureCardSlotClass,
  featureCardTitleClass,
  featureCardVariants,
} from './FeatureCard.variants';
import { Icon } from '../Icon';
import { MediaScrim } from '../_internal/MediaScrim';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { SOLID_MASK, maskStyle } from '../_internal/mask';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';

const has = (node: unknown) => node != null && node !== false;

const R = 'var(--ds-responsive-radius-general-2xl)';
const W = 'var(--fc-cut-w)';
const H = 'var(--fc-cut-h)';
/** Esquina convexa de la foto junto al recorte: se quita el cuadrado menos el cuarto de círculo. */
const FILLET = `radial-gradient(circle at 100% 0,transparent calc(${R} - 0.5px),#000 calc(${R} + 0.5px))`;

/**
 * Máscara del recorte de `cutout`: la foto entera menos un bloque de W×H abajo a la izquierda (el del texto), con su
 * esquina superior derecha redondeada y las dos esquinas de la foto que lo rodean (arriba del bloque y a su derecha)
 * también redondeadas, todas con radius/general/2xl. W y H los mide FeatureCard del bloque de texto.
 * La primera capa (foto entera) resta la unión de las demás (`subtract` / `source-out` en WebKit).
 */
function cutoutMask(): CSSProperties {
  return maskStyle(
    [
      [SOLID_MASK, '100% 100%', 'left 0 top 0'],
      // Bloque del texto sin su esquina superior derecha
      [SOLID_MASK, `${W} calc(${H} - ${R})`, 'left 0 bottom 0'],
      [SOLID_MASK, `calc(${W} - ${R}) ${R}`, `left 0 bottom calc(${H} - ${R})`],
      // Esquina superior derecha del bloque (cóncava para la foto)
      [`radial-gradient(circle at 0 100%,#000 calc(${R} - 0.5px),transparent calc(${R} + 0.5px))`, `${R} ${R}`, `left calc(${W} - ${R}) bottom calc(${H} - ${R})`],
      // Esquinas convexas de la foto: sobre el bloque (borde izquierdo) y a su derecha (borde inferior)
      [FILLET, `${R} ${R}`, `left 0 bottom ${H}`],
      [FILLET, `${R} ${R}`, `left ${W} bottom 0`],
    ],
    true
  );
}

const CUTOUT_MASK = cutoutMask();

/**
 * Tarjeta para destacar (set "Cards para destacar" de Figma, 16903:57057). No es interactiva: es un `<article>`
 * nombrado por su título; lo interactivo es la acción que se le pasa (Button o Button corner) y el contenido del slot.
 * Tres tipos: `photo` (foto de fondo), `surface` (superficie con muesca y slot) y `cutout` (foto con recorte para el
 * texto). El `ref` va al `<article>`.
 */
export const FeatureCard = forwardRef<HTMLElement, FeatureCardProps>(
  (
    {
      variant = 'photo',
      title,
      description,
      eyebrow,
      date,
      dateTime,
      src,
      alt,
      action,
      children,
      headingLevel = 3,
      className,
      ...rest
    },
    ref
  ) => {
    const titleId = useId();
    const Heading = headingLevel === 'none' ? 'p' : (`h${headingLevel}` as const);
    const rootRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, rootRef);
    const isCutout = variant === 'cutout';

    // Cutout: el recorte de la foto sigue el tamaño del bloque de texto (variables --fc-cut-w y --fc-cut-h). Antes de
    // la primera medida (o sin JS) valen lo de reserva de las clases. Medidas fraccionarias (getBoundingClientRect) y
    // acotadas a la tarjeta, para que la máscara nunca quede con tamaños negativos ni fuera de la foto.
    useLayoutEffect(() => {
      const root = rootRef.current;
      const text = textRef.current;
      if (!isCutout || !root || !text) return;
      const update = () => {
        const box = text.getBoundingClientRect();
        const card = root.getBoundingClientRect();
        root.style.setProperty('--fc-cut-w', `${Math.max(0, Math.min(box.width, card.width))}px`);
        root.style.setProperty('--fc-cut-h', `${Math.max(0, Math.min(box.height, card.height))}px`);
      };
      update();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(update);
      observer.observe(text);
      observer.observe(root);
      return () => observer.disconnect();
    }, [isCutout]);

    const media: ReactNode = src ? (
      <img src={src} alt={alt ?? ''} className={featureCardImageClass} />
    ) : (
      <span className={featureCardPlaceholderClass}>
        <Icon name="image" size={32} variant="line" />
      </span>
    );

    const rootProps = {
      ...rest,
      ref: mergedRef,
      'aria-labelledby': rest['aria-labelledby'] ?? titleId,
      className: cn(featureCardVariants({ variant }), className),
    };

    if (isCutout) {
      return (
        <article {...rootProps}>
          <span className={featureCardCutoutShadowClass}>
            <span data-figma-part="Subtract" className={featureCardCutoutShapeClass} style={CUTOUT_MASK}>
              {media}
            </span>
          </span>
          <div ref={textRef} data-figma-part="Frame 1984080612" className={featureCardCutoutTextClass}>
            {/* Encabezado primero en el DOM; la línea corta se ve arriba con `order-first`, como en Figma */}
            <Heading id={titleId} data-figma-part="Best Full Body Home Gym Machines" className={featureCardCutoutTitleClass}>
              {title}
            </Heading>
            {has(eyebrow) && (
              <p data-figma-part="Subtítulo" className={featureCardEyebrowClass}>
                {eyebrow}
              </p>
            )}
          </div>
        </article>
      );
    }

    const isSurface = variant === 'surface';
    const hasAction = has(action);

    const header = (
      <div data-figma-part="Title/state" className={featureCardHeaderClass}>
        {has(date) && (
          <p className={cn('m-0', featureCardDateVariants({ variant }))}>
            <Icon name="calendar" size={12} variant="line" data-slot="date-icon" data-figma-part="Icon-sizes" />
            <time dateTime={dateTime} data-figma-part="Filename">
              {date}
            </time>
          </p>
        )}
        <Heading id={titleId} data-figma-part="Filename" className={featureCardTitleClass}>
          {title}
        </Heading>
        {has(description) && (
          <p data-figma-part="Status" className={featureCardDescriptionClass}>
            {description}
          </p>
        )}
      </div>
    );

    const body = has(children) && (
      <div data-figma-part="Espacio" className={featureCardSlotClass}>
        {children}
      </div>
    );

    return (
      <article {...rootProps}>
        {isSurface ? (
          <NotchedSurface notch={hasAction ? 'md' : 'none'} shadow="on-card" />
        ) : (
          <span className={featureCardPhotoClass}>{media}</span>
        )}
        {isSurface && hasAction && (
          <span data-figma-part="Button corner " className={featureCardCornerClass}>
            {action}
          </span>
        )}
        {isSurface ? (
          <div data-figma-part="Frame 1984080535" className={featureCardBodyClass}>
            {header}
            {body}
          </div>
        ) : (
          // photo: texto sobre la foto con tema oscuro forzado y velo superior hasta los bordes de la tarjeta
          <MediaScrim edge="top" veil="outside" data-figma-part="Frame 1984080535" className={cn(featureCardBodyClass, featureCardScrimClass)}>
            {header}
            {action}
            {body}
          </MediaScrim>
        )}
      </article>
    );
  }
);

FeatureCard.displayName = 'FeatureCard';
