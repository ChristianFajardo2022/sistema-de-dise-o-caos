import { createContext } from 'react';
import type { AvatarSize } from './Avatar.types';

/** Lo que `AvatarGroup` impone a sus avatares: tamaño común y anillo de separación. */
export interface AvatarGroupContextValue {
  size: AvatarSize;
}

export const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(null);
