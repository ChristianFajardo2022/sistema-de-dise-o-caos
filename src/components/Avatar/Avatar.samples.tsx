/**
 * Material de muestra para las historias y las pruebas: las fotos y el logo reales de Figma,
 * reducidos, que viven en `assets/` (carpeta aislada para poder quitarla al publicar).
 * No se exporta desde el paquete: el consumidor aporta `src` y `logo`.
 */

import { PHOTO_SRC } from './Avatar.sample-data';
import type { PhotoName } from './Avatar.sample-data';

export { BrandLogo as SampleLogo } from './assets/BrandLogo';

/** Foto de muestra para usar como `children` de un Avatar photo; cubre el contenedor. */
export function PhotoSample({ name = 'Woman_1' }: { name?: PhotoName }) {
  return <img src={PHOTO_SRC[name]} alt="" className="size-full object-cover" />;
}
