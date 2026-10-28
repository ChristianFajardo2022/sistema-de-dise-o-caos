type Item = number | 'ellipsis-start' | 'ellipsis-end';

const range = (from: number, to: number) => Array.from({ length: Math.max(to - from + 1, 0) }, (_, i) => from + i);

/**
 * Páginas visibles del Type numeric. Con `boundaryCount` 0 es una ventana de `2 × siblingCount + 1` números seguidos
 * (la de Figma: 5 números, sin puntos) que empieza en la página actual (con la 6 activa: 6 7 8 9 10); cerca del final
 * la ventana se queda en las últimas páginas (con 20 páginas, de la 16 en adelante: 16 17 18 19 20). Con 1 o más es el
 * esquema habitual de bordes y vecinos, centrado en la actual, con puntos suspensivos y siempre la misma cantidad de
 * elementos (Figma no dibuja ese caso).
 */
export function getPaginationItems(page: number, totalPages: number, siblingCount: number, boundaryCount: number): Item[] {
  if (boundaryCount <= 0) {
    const size = Math.min(siblingCount * 2 + 1, totalPages);
    const start = Math.max(Math.min(page, totalPages - size + 1), 1);
    return range(start, start + size - 1);
  }
  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);
  const siblingsStart = Math.max(Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2);
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
  );
  const before: Item[] =
    siblingsStart > boundaryCount + 2
      ? ['ellipsis-start']
      : boundaryCount + 1 < totalPages - boundaryCount
        ? [boundaryCount + 1]
        : [];
  const after: Item[] =
    siblingsEnd < totalPages - boundaryCount - 1
      ? ['ellipsis-end']
      : totalPages - boundaryCount > boundaryCount
        ? [totalPages - boundaryCount]
        : [];
  return [...startPages, ...before, ...range(siblingsStart, siblingsEnd), ...after, ...endPages];
}

