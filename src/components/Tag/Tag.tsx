import { forwardRef } from 'react';
import type { Ref } from 'react';
import type { TagButtonProps, TagProps, TagStaticProps } from './Tag.types';
import { tagIconVariants, tagTextVariants, tagVariants } from './Tag.variants';
import { Icon } from '../Icon';
import { cn } from '../../utils/cn';

/**
 * Tag: etiqueta con texto e ícono opcional.
 * - Sin `onClick`: `<span>` estático, sin hover/focus/press (como Badge pero con texto).
 * - Con `onClick`: `<button type="button">` con hover, foco visible, press y `disabled` nativo.
 * Hover, focus y press salen de CSS; `state` solo fuerza el aspecto en documentación.
 */
export const Tag = forwardRef<HTMLElement, TagProps>(function Tag(props, ref) {
  const {
    type = 'default',
    size = 'md',
    children,
    iconLeft = true,
    icon = 'tag',
    state: forcedState,
    disabled,
    className,
    ...rest
  } = props;
  const interactive = typeof props.onClick === 'function';
  const inactive = disabled || forcedState === 'inactive';
  const state = inactive ? 'inactive' : (forcedState ?? 'default');
  const classes = cn(tagVariants({ type, size, state, interactive }), className);

  const content = (
    <>
      {iconLeft && (
        <Icon
          name={icon}
          size={14}
          variant="fill"
          className={tagIconVariants({ state, interactive })}
          data-figma-part="Icon-sizes"
        />
      )}
      <span className={tagTextVariants()} data-figma-part="Text-button">
        {children}
      </span>
    </>
  );

  if (interactive) {
    const { onClick, ...buttonRest } = rest as Pick<TagButtonProps, 'onClick'> & Record<string, unknown>;
    return (
      <button
        {...buttonRest}
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        disabled={inactive}
        onClick={onClick}
        className={classes}
      >
        {content}
      </button>
    );
  }

  const { onClick, ...spanRest } = rest as Omit<TagStaticProps, 'children'>;
  void onClick;
  return (
    <span
      {...spanRest}
      ref={ref as Ref<HTMLSpanElement>}
      className={classes}
    >
      {content}
    </span>
  );
});

Tag.displayName = 'Tag';
