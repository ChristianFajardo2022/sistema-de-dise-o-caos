import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'link';

export type ButtonContrast = 'low' | 'high';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type ButtonState = 'default' | 'hover' | 'press' | 'focus' | 'disabled' | 'delete' | 'load';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant type of the button */
  variant?: ButtonVariant;
  /** Contrast level variant (mainly for secondary/tertiary) */
  contrast?: ButtonContrast;
  /** Size variant */
  size?: ButtonSize;
  /** Explicit state override */
  state?: ButtonState;
  /** Whether the button is in a loading state (renders spinner & sets aria-busy) */
  loading?: boolean;
  /** Icon rendered before children text */
  leftIcon?: ReactNode;
  /** Icon rendered after children text */
  rightIcon?: ReactNode;
  /** Single icon button mode (renders circular/square compact layout) */
  iconOnly?: boolean;
  /** Whether the component delegates rendering to its child */
  asChild?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Button children node */
  children?: ReactNode;
}
