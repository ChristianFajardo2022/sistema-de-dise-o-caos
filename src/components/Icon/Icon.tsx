import type { IconProps } from './Icon.types';
import { IconBase } from './IconBase';
import { caosIcons } from '../../icons/caos/registry.generated';

/** Ícono de la biblioteca CAOS: `<Icon name="search" />`. Hereda el color del texto (currentColor) */
export function Icon({ name, icon, ...restProps }: IconProps) {
  const data = icon ?? (name ? caosIcons[name] : undefined);
  if (!data) return null;
  return <IconBase icon={data} {...restProps} />;
}

Icon.displayName = 'Icon';
