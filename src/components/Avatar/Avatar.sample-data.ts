/** Datos de muestra de las historias; no se exportan desde el paquete. */

export type PortraitName = 'woman-1' | 'woman-2' | 'woman-3' | 'woman-4' | 'man-1' | 'man-2' | 'man-3' | 'man-4';

export const PORTRAIT_NAMES: PortraitName[] = [
  'woman-1', 'woman-2', 'woman-3', 'woman-4', 'man-1', 'man-2', 'man-3', 'man-4',
];

/** Imagen de ejemplo para la prop `src` (data URI sin colores de marca). */
export const SAMPLE_PHOTO_SRC =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='lightgray'/><circle cx='50' cy='40' r='18' fill='gray'/><ellipse cx='50' cy='104' rx='38' ry='34' fill='gray'/></svg>";
