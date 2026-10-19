import type { InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'checked'> {
  /**
   * The checked state of the checkbox.
   * Can be boolean or 'indeterminate'
   */
  checked?: boolean | 'indeterminate';
  /**
   * Default checked state for uncontrolled usage
   */
  defaultChecked?: boolean;
  /**
   * Label to display next to the checkbox
   */
  label?: ReactNode;
  /**
   * Supporting text to display below the label
   */
  description?: ReactNode;
  /**
   * Size of the checkbox
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Validation state
   */
  error?: boolean | string;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Visual alignment of the label and description relative to the checkbox
   * @default 'top'
   */
  align?: 'top' | 'center';
  /**
   * Event handler when the value changes
   */
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
}
