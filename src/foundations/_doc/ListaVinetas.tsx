import type { ReactNode } from 'react';
import { docBody } from '../../docs/docShared';
import { cn } from '../../utils/cn';

/** Lista con viñetas (`ul`/`li`) con el cuerpo de la plantilla. Va en el `preview` de una tarjeta de texto. */
export function ListaVinetas({ items }: { items: ReactNode[] }) {
  return (
    <ul className={cn(docBody, 'm-0 flex list-disc flex-col gap-ds-space-general-md pl-ds-space-general-4xl')}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
