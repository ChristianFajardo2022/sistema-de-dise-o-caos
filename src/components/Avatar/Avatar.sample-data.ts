/** Datos de muestra de las historias; no se exportan desde el paquete. */

import photoWoman1 from './assets/photo-woman-1.jpg';
import photoWoman2 from './assets/photo-woman-2.jpg';
import photoWoman3 from './assets/photo-woman-3.jpg';
import photoWoman4 from './assets/photo-woman-4.jpg';
import photoMen1 from './assets/photo-men-1.jpg';
import photoMen2 from './assets/photo-men-2.jpg';
import photoMen3 from './assets/photo-men-3.jpg';
import photoMen4 from './assets/photo-men-4.jpg';
import photoDisabled from './assets/photo-disabled.jpg';

/** Valores de `Photo` del set "Photos (Atom)" de Figma. */
export type PhotoName = 'Woman_1' | 'Woman_2' | 'Woman_3' | 'Woman_4' | 'Men_1' | 'Men_2' | 'Men_3' | 'Men_4' | 'Disabled';

export const PHOTO_SRC: Record<PhotoName, string> = {
  Woman_1: photoWoman1,
  Woman_2: photoWoman2,
  Woman_3: photoWoman3,
  Woman_4: photoWoman4,
  Men_1: photoMen1,
  Men_2: photoMen2,
  Men_3: photoMen3,
  Men_4: photoMen4,
  Disabled: photoDisabled,
};

export const PHOTO_NAMES = Object.keys(PHOTO_SRC) as PhotoName[];

/** Foto de ejemplo para la prop `src`. */
export const SAMPLE_PHOTO_SRC = PHOTO_SRC.Woman_1;
