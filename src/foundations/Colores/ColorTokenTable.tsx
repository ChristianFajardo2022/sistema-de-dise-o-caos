import { TokenChip, TokenTable } from '../_doc';
import type { TokenTheme } from '../_doc';
import { THEMES, THEME_LABELS, colorInfo } from './colorData';

/** Muestra de color: cuadro con el valor real sobre un fondo neutro (para ver las opacidades) y su primitivo y hex. */
export function ColorCell({ variable, theme }: { variable: string; theme: TokenTheme }) {
  const info = colorInfo(variable, theme);
  if (!info) return <span className="text-ds-text-neutral-gray">—</span>;
  return (
    <span className="flex items-center gap-ds-space-general-xl whitespace-nowrap">
      <span
        aria-hidden="true"
        className="size-8 shrink-0 overflow-hidden rounded-ds-radius-general-md border border-ds-border-general-gray-fifth bg-ds-background-general-gray-secondary"
      >
        <span className="block size-full" style={{ background: info.css }} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-ds-text-neutral-heading">
          {info.primitive}
          {info.percent < 100 && <span className="text-ds-text-neutral-gray"> · {info.percent} %</span>}
        </span>
        <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-gray">{info.hex}</span>
      </span>
    </span>
  );
}

/** Tabla de tokens semánticos de color: token, y su muestra en oscuro y claro lado a lado. */
export function ColorTokenTable({ caption, tokens }: { caption: string; tokens: string[] }) {
  return (
    <TokenTable
      caption={caption}
      minWidth={640}
      columns={['Token', ...THEMES.map((t) => THEME_LABELS[t])]}
      rows={tokens.map((variable) => [
        <TokenChip key="n">{variable.replace('--color-', '')}</TokenChip>,
        ...THEMES.map((t) => <ColorCell key={t} variable={variable} theme={t} />),
      ])}
    />
  );
}
