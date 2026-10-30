import { ScrollRegion } from '../foundations/_doc/ScrollRegion';
import { cn } from '../utils/cn';

const code = 'font-mono text-ds-primitives-typography-size-sm leading-ds-primitives-typography-line-height-xl text-ds-text-neutral-heading';

/** Bloque de código con scroll horizontal propio (enfocable solo si desborda). */
export function DocCodeBlock({ children, label, id }: { children: string; label: string; id?: string }) {
  return (
    <ScrollRegion label={label} className={cn('rounded-ds-radius-general-lg border border-ds-border-general-default-on-canva bg-ds-background-container-surface')}>
      <pre id={id} className={cn('m-0 w-max min-w-full p-ds-space-general-2xl', code)}>
        <code>{children}</code>
      </pre>
    </ScrollRegion>
  );
}
