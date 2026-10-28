import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import type { TopAppBarProps } from './TopAppBar.types';
import {
  topAppBarActionRowVariants,
  topAppBarSubtitleVariants,
  topAppBarTitleBlockVariants,
  topAppBarTitleVariants,
  topAppBarVariants,
} from './TopAppBar.variants';
import { Button } from '../Button';
import { ButtonCorner } from '../ButtonCorner';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

export const TopAppBar = forwardRef<HTMLElement, TopAppBarProps>(
  (
    {
      title,
      headingLevel = 1,
      subtitle,
      platform = 'ios',
      titlePosition = 'centered',
      onBack,
      backLabel = 'Volver',
      leading,
      actions,
      avatar,
      className,
      ...restProps
    },
    ref
  ) => {
    const Heading = `h${headingLevel}` as const;
    const large = titlePosition === 'action-only' || titlePosition === 'title-only';
    // Title Only no dibuja subtítulo en Figma
    const showSubtitle = subtitle != null && titlePosition !== 'title-only';

    let back: ReactNode = null;
    if (leading != null) {
      back = leading;
    } else if (onBack) {
      back =
        platform === 'ios' ? (
          <ButtonCorner
            variant="icon"
            iconSize={20}
            aria-label={backLabel}
            onClick={onBack}
            icon={<Icon name="chevron-left" variant="fill" size={20} />}
          />
        ) : (
          <Button
            variant="tertiary"
            size="sm"
            iconOnly
            aria-label={backLabel}
            onClick={onBack}
            // Con título grande en Android, Figma recorta el botón a 32 de ancho (flecha pegada al borde)
            className={titlePosition === 'action-only' ? 'w-8 !px-0' : undefined}
          >
            <Icon name="arrow-left2" variant="fill" size={24} data-figma-part="Icon-sizes" />
          </Button>
        );
    }

    const titleBlock =
      title != null || showSubtitle ? (
        <div className={topAppBarTitleBlockVariants({ position: titlePosition })} data-figma-part="Tittle">
          {title != null && (
            <Heading className={topAppBarTitleVariants({ large })} data-figma-part="Title">
              {title}
            </Heading>
          )}
          {showSubtitle && (
            <p
              className={topAppBarSubtitleVariants({ weight: titlePosition === 'action-only' ? 'regular' : 'bold' })}
              data-figma-part="Subtitle"
            >
              {subtitle}
            </p>
          )}
        </div>
      ) : null;

    const avatarNode = avatar ? (
      <div className="flex shrink-0 items-center justify-center" data-figma-part="Avatar">
        {avatar}
      </div>
    ) : null;

    const actionsNode = actions ? (
      <div
        className={cn(
          'flex shrink-0 items-center',
          platform === 'ios' ? 'gap-ds-space-general-md' : 'gap-0',
          titlePosition === 'centered' && 'justify-self-end'
        )}
        data-figma-part="Espacio"
      >
        {actions}
      </div>
    ) : null;

    const body =
      titlePosition === 'action-only' ? (
        <>
          <div className={topAppBarActionRowVariants({ platform })}>
            <div className="flex items-center">{back}</div>
            {actionsNode}
          </div>
          {titleBlock}
        </>
      ) : titlePosition === 'centered' ? (
        <>
          <div className="flex items-center justify-self-start">{back}</div>
          {titleBlock ?? <span />}
          {actionsNode ?? <span />}
        </>
      ) : (
        <>
          {back}
          {avatarNode}
          {titleBlock}
          {actionsNode}
        </>
      );

    return (
      <header
        {...restProps}
        ref={ref}
        className={cn(topAppBarVariants({ platform, position: titlePosition }), className)}
      >
        {titlePosition === 'centered' && avatarNode ? (
          <>
            <div className="flex items-center gap-ds-space-general-xl justify-self-start">
              {back}
              {avatarNode}
            </div>
            {titleBlock ?? <span />}
            {actionsNode ?? <span />}
          </>
        ) : (
          body
        )}
      </header>
    );
  }
);

TopAppBar.displayName = 'TopAppBar';
