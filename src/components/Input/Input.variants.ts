import { cva } from 'class-variance-authority';

export const inputContainerVariants = cva(
  'flex flex-col gap-1 w-full font-sans transition-colors duration-200',
  {
    variants: {
      fullWidth: {
        true: 'w-full',
        false: 'max-w-md',
      },
    },
    defaultVariants: {
      fullWidth: true,
    },
  }
);

export const inputWrapperVariants = cva(
  'relative flex items-center transition-all duration-200 border border-solid box-border outline-none focus-within:ring-2',
  {
    variants: {
      state: {
        default: [
          'bg-[var(--background-field-default,#f6f8f9)]',
          'border-[var(--border-field-default,#d0d4dc)]',
          'text-[var(--text-field-label,#1d1c1c)]',
          'focus-within:border-[var(--border-field-active,#aa3bff)]',
          'focus-within:ring-[var(--border-field-active,#aa3bff)]/20',
          'hover:border-[var(--border-general-gray-firts,#5e6165)]',
        ],
        filled: [
          'bg-[var(--background-field-surface,#ffffff)]',
          'border-[var(--border-general-gray-secondary,#898e98)]',
          'text-[var(--text-field-label,#1d1c1c)]',
          'focus-within:border-[var(--border-field-active,#aa3bff)]',
        ],
        active: [
          'bg-[var(--background-field-surface,#ffffff)]',
          'border-[var(--border-field-active,#aa3bff)]',
          'ring-2 ring-[var(--border-field-active,#aa3bff)]/30',
        ],
        disabled: [
          'bg-[var(--background-field-disabled,#f0f2f5)]',
          'border-[var(--border-field-disabled,#adb0b4)]',
          'text-[var(--text-neutral-disabled-positive,#7e8187)]',
          'cursor-not-allowed opacity-75',
        ],
        error: [
          'bg-[var(--background-field-surface,#ffffff)]',
          'border-[var(--border-semantic-alert,#e53935)]',
          'ring-2 ring-[var(--border-semantic-alert,#e53935)]/20',
          'focus-within:border-[var(--border-semantic-alert,#e53935)]',
        ],
        success: [
          'bg-[var(--background-field-surface,#ffffff)]',
          'border-[var(--border-semantic-success,#43a047)]',
          'ring-2 ring-[var(--border-semantic-success,#43a047)]/20',
          'focus-within:border-[var(--border-semantic-success,#43a047)]',
        ],
      },
      sizeVariant: {
        sm: [
          'h-10 px-[var(--space-field-sm,8px)]',
          'rounded-[var(--radius-field-sm,6px)]',
          'text-[var(--typography-field-size-xs,12px)]',
        ],
        md: [
          'h-12 px-[var(--space-field-md,12px)]',
          'rounded-[var(--radius-field-md,8px)]',
          'text-[var(--typography-field-size-sm,14px)]',
        ],
        lg: [
          'h-14 px-[var(--space-field-lg,16px)]',
          'rounded-[var(--radius-field-lg,12px)]',
          'text-[var(--typography-field-size-md,16px)]',
        ],
      },
    },
    defaultVariants: {
      state: 'default',
      sizeVariant: 'md',
    },
  }
);

export const inputFieldVariants = cva(
  'w-full h-full bg-transparent border-none outline-none focus:ring-0 text-inherit placeholder-[var(--text-field-placeholder,#7e8187)] disabled:cursor-not-allowed font-sans',
  {
    variants: {
      sizeVariant: {
        sm: 'text-[var(--typography-field-size-xs,12px)]',
        md: 'text-[var(--typography-field-size-sm,14px)]',
        lg: 'text-[var(--typography-field-size-md,16px)]',
      },
    },
    defaultVariants: {
      sizeVariant: 'md',
    },
  }
);

export const labelVariants = cva(
  'flex items-center justify-between font-medium text-[var(--text-field-label,#2e3033)]',
  {
    variants: {
      sizeVariant: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      sizeVariant: 'md',
    },
  }
);

export const helperTextVariants = cva('text-xs flex items-center gap-1 mt-1 font-normal', {
  variants: {
    state: {
      default: 'text-[var(--text-neutral-body,#5e6165)]',
      filled: 'text-[var(--text-neutral-body,#5e6165)]',
      active: 'text-[var(--text-neutral-body,#5e6165)]',
      disabled: 'text-[var(--text-neutral-disabled-positive,#adb0b4)]',
      error: 'text-[var(--border-semantic-alert,#e53935)]',
      success: 'text-[var(--border-semantic-success,#43a047)]',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});
