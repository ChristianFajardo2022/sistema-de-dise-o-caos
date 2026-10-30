import { forwardRef, useId } from 'react';
import type { ReactNode } from 'react';
import type { ContactCardProps } from './ContactCard.types';
import {
  contactCardActionsVariants,
  contactCardCornerSlotClass,
  contactCardEyebrowVariants,
  contactCardInfoVariants,
  contactCardItemVariants,
  contactCardLinkSlotClass,
  contactCardRatingVariants,
  contactCardSpacerVariants,
  contactCardTitleVariants,
  contactCardVariants,
} from './ContactCard.variants';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { ButtonCorner } from '../ButtonCorner';
import { DropdownMenu } from '../DropdownMenu';
import { Icon } from '../Icon';
import { ItemCard } from '../_internal/ItemCardMark';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cn } from '../../utils/cn';
import { RATING_SUFFIX, formatRating } from '../../utils/format';

const has = (node: unknown) => node != null && node !== false;

// Figma: 18867:20091
/**
 * Tarjeta de contacto con acción de llamada o chat (set "Call/chat card" de Figma). Es un `<article>`
 * nombrado por su título (el nombre de la persona); lo interactivo son sus botones (cada uno con ese nombre).
 * "Item card" (avatar + calificación) está fuera de las páginas del sistema: aquí es un marcador interno.
 * Orden del DOM: avatar, encabezado, línea corta y, al final, las acciones (las de la esquina son absolutas: no cambia
 * el dibujo). El `ref` va al `<article>`.
 */
export const ContactCard = forwardRef<HTMLElement, ContactCardProps>(
  (
    {
      variant = 'more',
      title,
      eyebrow,
      personName,
      leading,
      rating,
      ratingLabel = RATING_SUFFIX,
      headingLevel = 3,
      menuItems,
      moreLabel,
      onMoreClick,
      onCall,
      callLabel,
      onChat,
      chatLabel,
      actions,
      className,
      ...rest
    },
    ref
  ) => {
    const titleId = useId();
    const Heading = headingLevel === 'none' ? 'p' : (`h${headingLevel}` as const);
    const name = personName ?? (typeof title === 'string' ? title : undefined);
    const withName = (verb: string) => (name ? `${verb} ${name}` : verb);
    const custom = has(actions);
    const corner = custom ? 'none' : variant === 'more' ? 'more' : variant === 'external-link' ? 'link' : 'none';

    const moreCorner = (
      <ButtonCorner
        variant="dots"
        contrast="on-canva"
        size="md"
        aria-label={moreLabel ?? withName('Más opciones de')}
        onClick={has(menuItems) ? undefined : onMoreClick}
        className={contactCardCornerSlotClass}
        data-figma-part="Button corner "
      />
    );

    const callButton = (
      <Button
        iconOnly
        variant={variant === 'external-link' ? 'primary' : 'secondary'}
        size="sm"
        aria-label={callLabel ?? withName('Llamar a')}
        onClick={onCall}
        data-figma-part="Button"
      >
        <Icon name="call" size={20} variant="fill" data-figma-part="Icon-sizes" />
      </Button>
    );

    let right: ReactNode;
    if (custom) {
      right = actions;
    } else if (variant === 'more') {
      right = has(menuItems) ? (
        <DropdownMenu aria-label={moreLabel ?? withName('Opciones de')} trigger={moreCorner}>
          {menuItems}
        </DropdownMenu>
      ) : (
        moreCorner
      );
    } else if (variant === 'communication') {
      right = (
        <div data-figma-part="Frame 1984080549" className={contactCardActionsVariants()}>
          {callButton}
          <Button
            iconOnly
            variant="secondary"
            size="sm"
            aria-label={chatLabel ?? withName('Chatear con')}
            onClick={onChat}
            data-figma-part="Button"
          >
            <Icon name="message-question" size={20} variant="fill" data-figma-part="Icon-sizes" />
          </Button>
        </div>
      );
    } else {
      right = <span className={contactCardLinkSlotClass}>{callButton}</span>;
    }

    return (
      <article {...rest} ref={ref} aria-labelledby={rest['aria-labelledby'] ?? titleId} className={cn(contactCardVariants(), className)}>
        <NotchedSurface notch={corner === 'more' ? 'md' : corner === 'link' ? 'lg' : 'none'} />
        {(has(leading) || rating != null) && (
          <ItemCard className={contactCardItemVariants()}>
            {leading}
            {rating != null && (
              <Badge type="icon-number" label={ratingLabel} className={contactCardRatingVariants()} data-figma-part="Badge">
                <span data-figma-part="00">{formatRating(rating)}</span>
              </Badge>
            )}
          </ItemCard>
        )}
        <div data-figma-part="Information" className={contactCardInfoVariants()}>
          <Heading id={titleId} data-figma-part="Subtitulo" className={contactCardTitleVariants()}>
            {title}
          </Heading>
          {has(eyebrow) && (
            <p data-figma-part="Titulo" className={contactCardEyebrowVariants()}>
              {eyebrow}
            </p>
          )}
        </div>
        {/* Con un botón en la esquina, el texto no pasa por debajo: reserva su ancho */}
        {corner !== 'none' && <span aria-hidden="true" className={contactCardSpacerVariants({ corner })} />}
        {right}
      </article>
    );
  }
);

ContactCard.displayName = 'ContactCard';
