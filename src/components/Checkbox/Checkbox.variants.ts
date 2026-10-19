import { cva } from 'class-variance-authority';

export const checkboxContainerVariants = cva(
  'inline-flex group',
  {
    variants: {
      align: {
        top: 'items-start',
        center: 'items-center',
      },
      disabled: {
        true: 'cursor-not-allowed opacity-50',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      align: 'top',
      disabled: false,
    },
  }
);

export const checkboxControlVariants = cva(
  [
    'peer relative shrink-0 transition-all duration-200 ease-out',
    'flex items-center justify-center',
    'border border-solid box-border',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-field-active)] focus-visible:ring-offset-2',
    // The actual input is hidden visually but accessible, we use a span to render the box
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'w-[16px] h-[16px] rounded-[var(--radius-field-checkbox-radiobutton-sm,4px)]',
        md: 'w-[20px] h-[20px] rounded-[var(--radius-field-checkbox-radiobutton-md,6px)]',
        lg: 'w-[24px] h-[24px] rounded-[var(--radius-field-checkbox-radiobutton-lg,8px)]',
      },
      state: {
        unchecked: [
          'bg-[var(--background-field-surface)]',
          'border-[var(--border-field-default)]',
          'group-hover:border-[var(--border-field-active)]',
        ],
        checked: [
          'bg-[var(--background-field-active-purpple)]',
          'border-[var(--border-field-active)]',
          'text-white',
        ],
        indeterminate: [
          'bg-[var(--background-field-active-purpple)]',
          'border-[var(--border-field-active)]',
          'text-white',
        ],
        disabled: [
          'bg-[var(--background-field-disabled)]',
          'border-[var(--border-field-disabled)]',
        ],
        error: [
          'bg-[var(--background-field-surface)]',
          'border-[var(--border-alert-error,#E53935)]',
        ],
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'unchecked',
    },
  }
);
