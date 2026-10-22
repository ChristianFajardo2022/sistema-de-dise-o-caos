/**
 * Material de muestra para las historias y las pruebas: retratos neutros y un logo genérico
 * dibujados en código con colores de tokens. No se exporta desde el paquete.
 * El sistema no incluye fotos ni logos de marca: el consumidor aporta `src` y `logo`.
 */

import type { PortraitName } from './Avatar.sample-data';

interface PortraitTone {
  background: string;
  body: string;
  head: string;
  hair: 'long' | 'short' | 'bun' | 'cap';
}

const PORTRAITS: Record<PortraitName, PortraitTone> = {
  'woman-1': { background: 'fill-ds-background-acent-secondary', body: 'fill-ds-icon-acent-tertiary', head: 'fill-ds-icon-semantic-alert-secondary', hair: 'bun' },
  'woman-2': { background: 'fill-ds-background-semantic-information-secondary', body: 'fill-ds-icon-semantic-information-neutral', head: 'fill-ds-icon-acent-tertiary', hair: 'long' },
  'woman-3': { background: 'fill-ds-background-semantic-error-secondary', body: 'fill-ds-icon-semantic-error-secundary', head: 'fill-ds-icon-semantic-alert-secondary', hair: 'long' },
  'woman-4': { background: 'fill-ds-background-semantic-success-secondary', body: 'fill-ds-icon-semantic-success-secondary', head: 'fill-ds-icon-acent-tertiary', hair: 'bun' },
  'man-1': { background: 'fill-ds-background-semantic-alert-secondary', body: 'fill-ds-icon-semantic-alert-secondary', head: 'fill-ds-icon-semantic-error-secundary', hair: 'short' },
  'man-2': { background: 'fill-ds-background-acent-secondary', body: 'fill-ds-icon-semantic-information-neutral', head: 'fill-ds-icon-semantic-alert-secondary', hair: 'cap' },
  'man-3': { background: 'fill-ds-background-semantic-error-secondary', body: 'fill-ds-icon-acent-tertiary', head: 'fill-ds-icon-semantic-error-secundary', hair: 'short' },
  'man-4': { background: 'fill-ds-background-semantic-information-secondary', body: 'fill-ds-icon-semantic-success-secondary', head: 'fill-ds-icon-semantic-alert-secondary', hair: 'cap' },
};

/** Retrato neutro: fondo, hombros, cabeza y un peinado geométrico. Cubre el contenedor. */
export function PortraitSample({ name = 'woman-1' }: { name?: PortraitName }) {
  const tone = PORTRAITS[name];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="size-full">
      <rect width="100" height="100" className={tone.background} />
      <ellipse cx="50" cy="104" rx="38" ry="34" className={tone.body} />
      {tone.hair === 'long' && <rect x="26" y="22" width="48" height="52" rx="24" className="fill-ds-icon-general-black" />}
      <circle cx="50" cy="44" r="18" className={tone.head} />
      {tone.hair === 'bun' && <circle cx="50" cy="20" r="9" className="fill-ds-icon-general-black" />}
      {tone.hair === 'bun' && <path d="M32 44a18 18 0 0 1 36 0c-8-4-28-4-36 0Z" className="fill-ds-icon-general-black" />}
      {tone.hair === 'long' && <path d="M32 46a18 18 0 0 1 36 0c-10-8-26-8-36 0Z" className="fill-ds-icon-general-black" />}
      {tone.hair === 'short' && <path d="M32 42a18 18 0 0 1 36 0c-10-5-26-5-36 0Z" className="fill-ds-icon-general-black" />}
      {tone.hair === 'cap' && <path d="M31 42a19 17 0 0 1 38 0Z" className="fill-ds-icon-general-black" />}
    </svg>
  );
}

/** Logo genérico (anillo con rombo): usa currentColor, como debe hacerlo el logo real que pase el consumidor. */
export function SampleLogo() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" fill="none" className="size-full">
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="3" />
      <path d="M16 8l6 8-6 8-6-8 6-8Z" fill="currentColor" />
    </svg>
  );
}
