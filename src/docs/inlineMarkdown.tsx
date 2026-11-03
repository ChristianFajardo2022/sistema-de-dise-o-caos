import type { ReactNode } from 'react';

/**
 * Marcado en línea de los textos de la documentación (bajada del encabezado, descripciones de props): `código`,
 * **negrita**, *cursiva*, [enlace](url). El `Markdown` de Storybook no sirve aquí: sus piezas necesitan el tema de
 * Storybook, que solo existe dentro de su contenedor.
 */
export function inlineMarkdown(text: string): ReactNode[] {
  const pattern = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = m.index;
    if (m[1] !== undefined) out.push(<code key={key}>{m[1]}</code>);
    else if (m[2] !== undefined) out.push(<strong key={key}>{m[2]}</strong>);
    else if (m[3] !== undefined) out.push(<em key={key}>{m[3]}</em>);
    else out.push(<a key={key} href={m[5]} className="text-ds-text-link-default underline">{m[4]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
