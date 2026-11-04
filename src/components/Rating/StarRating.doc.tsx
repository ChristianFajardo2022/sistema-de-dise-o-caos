import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { StarRating } from './StarRating';
import { IconStar } from './IconStar';
import { NumberRating } from './NumberRating';
import { starRatingVariants } from './Rating.variants';

/*
 * Contenido de la página de documentación de StarRating (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Rating.types.ts`, `Rating.variants.ts`, `StarRating.tsx`), luego `StarRating.docs.json`. IconStar, la estrella suelta,
 * se documenta dentro de esta página: es un grupo de Anatomía, un grupo de Tokens y una viñeta de Uso en Figma.
 * Medidas: la fila mide 116 × 20 en sm (estrellas de 20, separación de 4) y 192 × 32 en md (estrellas de 32, separación
 * de 8). Diferencias con Figma: Figma solo dibuja el puntaje (State 0 a 5); el código agrega el modo interactivo con
 * radios nativos, el foco de 2 px, el estado deshabilitado (opacidad de 50%) y la previsualización al pasar el puntero.
 */

// Figma: 11252:401 (component set Star rating) y 11194:15685 (component set Icon Star (Atom))

type StarRatingSampleProps = Partial<ComponentProps<typeof StarRating>>;

/** StarRating de ejemplo en solo lectura de 3 de 5, del tamaño que pida cada muestra. */
const stars = (props: StarRatingSampleProps = {}) => <StarRating value={3} {...props} />;

/** StarRating interactivo (no controlado) con el puntaje inicial que pida cada muestra. */
const pick = (props: StarRatingSampleProps = {}) => <StarRating defaultValue={3} {...props} />;

/** Fila de ejemplos con separación para las cotas. */
const wideRow = (...items: ReactNode[]) => (
  <div className="flex items-center gap-ds-primitives-space-6xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Columna de ejemplos: caben en el marco de teléfono. */
const column = (...items: ReactNode[]) => (
  <div className="flex flex-col items-start gap-ds-space-general-xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Previsualización de Hover: el estado lo dibuja el puntero, no una prop. Se arma con las mismas estrellas y la misma fila. */
const hovered = (size: 'sm' | 'md') => (
  <div className={starRatingVariants({ size })}>
    {[1, 2, 3, 4, 5].map((n) => (
      <IconStar key={n} size={size === 'sm' ? 20 : 32} state={n <= 3 ? 'hover' : 'default'} />
    ))}
  </div>
);

/** Estrella suelta con un texto al lado. */
const starWithText = (text: string) => (
  <div className="flex items-center gap-ds-space-general-md text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-white">
    <IconStar state="select" size={16} />
    {text}
  </div>
);

/** Columna con más aire entre filas, para que las cotas de cada una no se pisen. */
const spacedColumn = (...items: ReactNode[]) => (
  <div className="flex flex-col items-start gap-ds-primitives-space-6xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Muestra de un estado: una sola talla (sm), porque md no cabe en la columna de un teléfono. */
const oneSize = (make: (size: 'sm' | 'md') => ReactNode): ReactNode[] => [make('sm')];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Sin puntaje. Las cinco estrellas en gris, listas para recibir una calificación.',
    samples: oneSize((size) => <StarRating defaultValue={0} size={size} />),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero. Las estrellas hasta la señalada se previsualizan en amarillo; el resto queda gris. Solo con ratón.',
    samples: oneSize(hovered),
  },
  {
    label: 'Select',
    tone: 'accent',
    description: 'Con puntaje. Las estrellas hasta el puntaje van en amarillo a caja completa y el resto en gris.',
    samples: oneSize((size) => <StarRating defaultValue={3} size={size} />),
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Sin respuesta (<code>disabled</code>). Conserva el puntaje y baja la opacidad a 50%. El cursor indica que no se puede usar.
      </>
    ),
    samples: oneSize((size) => <StarRating defaultValue={3} size={size} disabled />),
  },
  {
    label: 'Solo lectura',
    tone: 'neutral',
    description: (
      <>
        Muestra un puntaje sin pedir uno (<code>readOnly</code>, o sin <code>onChange</code> ni <code>defaultValue</code>). No recibe foco ni responde al puntero.
      </>
    ),
    samples: oneSize((size) => <StarRating value={3} size={size} />),
  },
];

export const doc: ComponentDocContent = {
  name: 'StarRating',
  icon: 'star',
  classification: 'molecula',
  summary:
    'El StarRating es la molécula que muestra o recoge un puntaje de 0 a 5 con cinco estrellas. Tiene dos tamaños y funciona en solo lectura o como grupo interactivo. Incluye IconStar, la estrella suelta que lo compone.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila de cinco estrellas con una separación fija. Hasta el puntaje van en amarillo y el resto en gris. Cada estrella es un IconStar.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Puntaje de 3 de 5',
                  preview: stars({ size: 'md' }),
                  marks: [
                    { n: 1, selector: '[role="img"]', side: 'top' },
                    { n: 2, selector: '[role="img"] > span', index: 0, side: 'top' },
                    { n: 3, selector: '[role="img"] > span', index: -1, side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[role="img"]' },
                    { kind: 'gap', from: '[role="img"] > span', fromIndex: 0, to: '[role="img"] > span', toIndex: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila:</strong> cinco estrellas en horizontal, centradas en vertical. La separación es de 8 (<code>space/general/lg</code>) en md y de 4 (<code>space/general/md</code>) en sm.
                </>,
                <>
                  <strong>Estrella con puntaje:</strong> un IconStar en <code>select</code>, amarillo y con el dibujo a caja completa.
                </>,
                <>
                  <strong>Estrella sin puntaje:</strong> un IconStar en <code>default</code>, gris y con el dibujo a 3/4 de la caja.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños sm y md',
                  preview: spacedColumn(stars({ size: 'sm' }), stars({ size: 'md' })),
                  marks: [
                    { n: 1, selector: '[role="img"]', index: 0, side: 'right' },
                    { n: 2, selector: '[role="img"]', index: 1, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[role="img"]', index: 0 },
                    { kind: 'height', selector: '[role="img"]', index: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>sm:</strong> 116 × 20 con estrellas de 20 y separación de 4. Es el tamaño por defecto.
                </>,
                <>
                  <strong>md:</strong> 192 × 32 con estrellas de 32 y separación de 8.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'IconStar: default, select y hover',
                  preview: wideRow(<IconStar state="default" size={32} />, <IconStar state="select" size={32} />, <IconStar state="hover" size={32} />),
                  marks: [
                    { n: 1, selector: 'div > span[aria-hidden="true"]', index: 0, side: 'top' },
                    { n: 2, selector: '[data-figma-part="_vector"]', index: 0, side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="_vector"]', index: 1, side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="_vector"]', index: 2, side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'div > span[aria-hidden="true"]', index: 0 }],
                },
              ],
              guidelines: [
                <>
                  <strong>Caja:</strong> cuadrada de 16, 20 o 32 (<code>size</code>), sin padding, con el dibujo centrado. Es decorativa: el significado lo da quien la usa.
                </>,
                <>
                  <strong>Default:</strong> estrella gris a 3/4 de la caja (12, 16 o 24).
                </>,
                <>
                  <strong>Select:</strong> estrella amarilla a caja completa (16, 20 o 32).
                </>,
                <>
                  <strong>Hover:</strong> estrella amarilla a 3/4 de la caja, como default. Previsualiza el puntaje.
                </>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description: (
        <>
          StarRating tiene 5 estados: Default, Hover, Select, Disabled y Solo lectura. Salen del puntero, del puntaje, de <code>disabled</code> y de <code>readOnly</code>; no hay prop <code>state</code>, así que Hover se dibuja con las mismas estrellas. El foco de teclado dibuja un contorno de 2 px.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'StarRating',
              preview: column(stars({ size: 'md' }), pick({ size: 'md' })),
              entries: [
                { part: 'Estrella con puntaje', color: 'icon-semantic-alert-firts' },
                { part: 'Estrella sin puntaje', color: 'icon-general-gray-low-contrast' },
                { part: 'Estrella previsualizada (aparece en Hover)', color: 'icon-semantic-alert-firts' },
                { part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'IconStar',
              preview: wideRow(<IconStar state="default" size={32} />, <IconStar state="select" size={32} />, <IconStar state="hover" size={32} />),
              entries: [
                { part: 'Estrella default', color: 'icon-general-gray-low-contrast' },
                { part: 'Estrella select', color: 'icon-semantic-alert-firts' },
                { part: 'Estrella hover', color: 'icon-semantic-alert-firts' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente StarRating en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Star rating en la librería de Assets. Tiene dos propiedades, Size y State. Size es el tamaño: 20px es <code>size=&quot;sm&quot;</code> y 32px es <code>size=&quot;md&quot;</code>.
            </>,
            <>
              <strong>State:</strong> de 0 a 5 es el puntaje, que en código es <code>value</code>. Figma solo dibuja estrellas completas: el código redondea un decimal para dibujar y conserva el valor real en el nombre accesible.
            </>,
            <>
              <strong>IconStar:</strong> cada estrella es el átomo Icon Star (Atom), con <code>state</code> (default, select o hover) y <code>size</code> (16, 20 o 32), como en el código. StarRating usa 20 y 32 según Size; 16 es para NumberRating y RatingBar.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> State es solo el puntaje, así que Disabled y Solo lectura no existen en Figma, y tampoco el modo interactivo ni el foco. El código agrega radios nativos (<code>onChange</code> o <code>defaultValue</code>), un contorno de 2 px y <code>disabled</code> con opacidad de 50%.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el StarRating es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Mostrar una calificación:</strong> en solo lectura se anuncia como una imagen con su puntaje, por ejemplo &quot;4 de 5 estrellas&quot;.
            </>,
            <>
              <strong>Recoger una calificación:</strong> con <code>onChange</code> o <code>defaultValue</code> es un grupo de radios que acepta de 1 a 5 estrellas.
            </>,
            <>
              <strong>Teclado:</strong> Tab entra al grupo y las flechas mueven y seleccionan, como un grupo de radios. El foco dibuja un contorno de 2 px.
            </>,
            <>
              <strong>Nombre del grupo:</strong> pasa <code>label</code> para decir qué se califica. Si no, el grupo se llama &quot;Calificación&quot;.
            </>,
            <>
              <strong>Dentro de un formulario:</strong> <code>name</code> envía el puntaje, también en solo lectura.
            </>,
          ],
          avoid: [
            <>
              <strong>Un promedio con decimales:</strong> las estrellas se redondean, así que 4,5 se dibuja como 5. (Alternativa: <code>NumberRating</code>).
            </>,
            <>
              <strong>La distribución de reseñas:</strong> StarRating muestra un solo puntaje. (Alternativa: <code>RatingBar</code>).
            </>,
            <>
              <strong>Un puntaje con otra escala:</strong> el máximo es 5. Para otra escala, muestra el número en texto.
            </>,
            <>
              <strong>Una estrella suelta como dato:</strong> IconStar es decorativa y el lector no la anuncia. Acompáñala siempre de un texto con el puntaje.
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'sm',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Fila:</strong> 116 × 20 con estrellas de 20 y separación de 4.
                  </>,
                ],
                preview: stars({ size: 'sm' }),
              },
              {
                title: 'md',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Fila:</strong> 192 × 32 con estrellas de 32 y separación de 8.
                  </>,
                ],
                preview: stars({ size: 'md' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> sm mide 116 × 20 y md, 192 × 32. Las separaciones no cambian con el breakpoint.
              </>,
              <>
                <strong>Toque:</strong> la previsualización de Hover no aparece con el dedo. La estrella se selecciona al tocarla.
              </>,
            ],
            preview: column(stars({ size: 'sm' }), stars({ size: 'md' })),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> sm mide 116 × 20 y md, 192 × 32.
              </>,
              <>
                <strong>Tamaño fijo:</strong> no se estira con el ancho disponible; la fila ocupa solo lo que miden sus estrellas.
              </>,
            ],
            preview: column(stars({ size: 'sm' }), stars({ size: 'md' })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de puntaje, tamaño y uso de la estrella suelta.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Promedio en número',
              description: (
                <>
                  Muestra un promedio con decimales con <code>NumberRating</code>.
                </>
              ),
              preview: <NumberRating value={4.5} />,
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Promedio en estrellas',
              description: 'Evita estrellas para un promedio decimal: se redondea y 4,5 se ve como 5.',
              preview: <StarRating value={4.5} size="md" />,
            },
            {
              kind: 'do',
              framed: true,
              title: 'Tamaño grande al tocar',
              description: (
                <>
                  Usa <code>md</code>, el tamaño más grande, para calificar con el dedo.
                </>
              ),
              preview: pick({ size: 'md' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tamaño chico al tocar',
              description: (
                <>
                  Evita <code>sm</code> para calificar con el dedo: las estrellas de 20 son difíciles de acertar.
                </>
              ),
              preview: pick({ size: 'sm' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Estrella con texto',
              description: 'Pon el puntaje en texto junto a una estrella suelta.',
              preview: starWithText('4,5 de 5'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Estrella sola',
              description: 'Evita la estrella suelta sola: el lector no la anuncia y no dice el puntaje.',
              preview: <IconStar state="select" size={16} />,
            },
          ],
        },
      ],
    },
  ],
};
