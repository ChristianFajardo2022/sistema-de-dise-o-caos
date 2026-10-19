import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputType = 'text' | 'search' | 'password' | 'email' | 'number' | 'tel';

export type InputState = 'default' | 'filled' | 'active' | 'disabled' | 'error' | 'success';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text displayed above the input field */
  label?: string;
  /** Secondary label or description text */
  secondaryLabel?: string;
  /** Helper text or description below the input */
  helperText?: string;
  /** Error message to display when state is 'error' or aria-invalid is true */
  errorText?: string;
  /** Success message to display when state is 'success' */
  successText?: string;
  /** Type of input: text, search header, password, etc. */
  inputType?: InputType;
  /** State variant of the input */
  state?: InputState;
  /** Size variant of the input */
  sizeVariant?: InputSize;
  /** Icon component to render on the left side */
  leftIcon?: ReactNode;
  /** Icon component to render on the right side */
  rightIcon?: ReactNode;
  /** Tooltip text or trigger component */
  tooltip?: string;
  /** Whether the input container spans 100% of its parent width */
  fullWidth?: boolean;
}
