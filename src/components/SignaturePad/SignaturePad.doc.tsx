import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Input } from '../Input';
import { SignaturePad } from './SignaturePad';
import type { SignatureValue } from './SignaturePad.types';

/*
 * Contenido de la página de documentación de SignaturePad (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`SignaturePad.types.ts`, `SignaturePad.variants.ts`, `SignaturePad.tsx`), luego `SignaturePad.docs.json`. Medidas:
 * horizontal de 178 de alto con radio de 16, padding de 16 × 12 y franja de texto guía de 76; vertical de 376 × 812 con
 * la interfaz girada −90°. Diferencias con Figma: el ícono de acción usa `icon/general/default` en el código y Figma
 * enlaza `icon/general/white` (el valor de ambos es el mismo, pero el token del código cambia con el tema); sin firma,
 * los íconos usan `text/neutral/disabled-on-canva` porque el token de Figma (`background/container/disabled-on-card`)
 * vale lo mismo que el relleno de la tarjeta y el ícono no se vería; Figma tiene la propiedad Line (línea de la columna
 * de cierre) y el código siempre la dibuja; el estado Disabled, el foco y el teclado de los botones no existen en
 * Figma. Propiedad 1 (Default o Filled) no es una prop: depende de que haya trazos.
 */

// Figma: 17805:32039 (component set Firm)

type PadProps = Partial<ComponentProps<typeof SignaturePad>>;

/** Firma inventada (un garabato con subrayado), normalizada: la usan las muestras para verse sin que nadie dibuje. */
const SAMPLE: SignatureValue = [
  Array.from({ length: 40 }, (_, i): [number, number] => {
    const t = i / 39;
    return [0.3 + 0.4 * t, 0.5 + 0.18 * Math.sin(t * Math.PI * 5) * (1 - t * 0.5) - 0.1 * t];
  }),
  [
    [0.32, 0.78],
    [0.5, 0.74],
    [0.68, 0.76],
  ],
];

const SIGNER = { signerName: 'Ana Pérez', signerId: '1.000.000.000' } as const;

/** Tarjeta horizontal dentro de un ancho de muestra (el marco la reduce si no cabe). */
const horizontal = (props: PadProps = {}, width = 'w-[320px]') => (
  <div className={`${width} max-w-full`}>
    <SignaturePad {...props} />
  </div>
);

/** Pantalla vertical con el firmante de ejemplo. */
const vertical = (props: PadProps = {}) => <SignaturePad orientation="vertical" {...SIGNER} {...props} />;

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Sin firma: muestra el texto guía y los íconos de deshacer y borrar apagados (<code>aria-disabled</code>).
      </>
    ),
    samples: [horizontal()],
  },
  {
    label: 'Filled',
    tone: 'accent',
    description: (
      <>
        Con trazos: el texto guía desaparece y los íconos de acción se encienden. Pasa al dibujar o con <code>value</code>; aquí se fuerza con una firma de ejemplo.
      </>
    ),
    samples: [horizontal({ defaultValue: SAMPLE })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code>: baja a 50% de opacidad, muestra el cursor <code>not-allowed</code> y no dibuja ni borra. No existe en Figma.
      </>
    ),
    samples: [horizontal({ disabled: true, defaultValue: SAMPLE })],
  },
];

export const doc: ComponentDocContent = {
  name: 'SignaturePad',
  icon: 'edit',
  classification: 'molecula',
  summary:
    'El SignaturePad es la molécula para capturar una firma manuscrita. Se dibuja con el puntero, el mouse o el dedo, y ofrece deshacer y borrar. La versión vertical suma el firmante y las acciones Cancelar y Crear firma. Entrega la firma como trazos, no como imagen.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un área de dibujo con el texto guía al centro y los íconos de acción al final. La versión vertical es la misma interfaz girada, con el firmante y los botones.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Horizontal',
                  preview: horizontal({ maximizable: true, 'data-slot': 'pad' } as PadProps, 'w-[560px]'),
                  marks: [
                    { n: 1, selector: '[data-slot="pad"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Dibuja tu firma aquí"]', side: 'top' },
                    { n: 3, selector: '[aria-label="Maximizar"]', side: 'top' },
                    { n: 4, selector: '[aria-label="Deshacer último trazo"]', side: 'bottom' },
                    { n: 5, selector: '[aria-label="Borrar firma"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="pad"]', side: 'left' },
                    { kind: 'padding', selector: '[data-slot="pad"]', side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Tarjeta:</strong> ancho fluido (1102 en Figma) y 178 de alto, con radio de 16 (<code>radius/general/xl</code>), relleno <code>background/container/default-on-card</code> y trazo de 1 px en <code>border/general/default-on-canva</code>. El padding es de 16 arriba y abajo (<code>space/general/2xl</code>) y de 12 a los lados (<code>space/general/xl</code>). El área de dibujo la ocupa entera. En oscuro el relleno casi no se distingue de la superficie del tema y solo se ve el texto guía.
                </>,
                <>
                  <strong>Texto guía:</strong> franja de 76 de alto con el texto centrado, en Helvetica Neue regular de 16 con interlineado de 22 (<code>typography/body/size/lg</code>) y <code>text/neutral/disabled-on-canva</code>. Es <code>labels.placeholder</code> y desaparece al empezar a dibujar.
                </>,
                <>
                  <strong>Maximizar:</strong> ícono <code>maximize</code> de 24 px, arriba a la derecha. Va oculto: se muestra con <code>maximizable</code> y llama a <code>onMaximize</code>.
                </>,
                <>
                  <strong>Deshacer:</strong> ícono <code>rotate-left</code> de 24 px, abajo a la derecha. Quita el último trazo. Su área táctil mide 40 px.
                </>,
                <>
                  <strong>Borrar:</strong> ícono <code>trash</code> de 24 px, a 10 de Deshacer. Vacía la firma y la región de estado anuncia el cambio.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Vertical',
                  preview: vertical({ defaultValue: SAMPLE, maximizable: true, 'data-slot': 'screen' } as PadProps),
                  marks: [
                    { n: 1, selector: '[data-slot="screen"]', side: 'left' },
                    { n: 2, selector: '[aria-label="Deshacer último trazo"]', side: 'left' },
                    { n: 3, selector: 'canvas', side: 'left' },
                    { n: 4, selector: '[aria-label="Cerrar"]', side: 'left' },
                    { n: 5, selector: '[data-figma-part="Signer name"]', side: 'right' },
                    { n: 6, selector: '[data-figma-part="Buttons"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="screen"]', side: 'left' },
                    { kind: 'padding', selector: '[data-slot="screen"]', side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Pantalla:</strong> 376 × 812 en Figma, sin relleno, con el ancho limitado al del contenedor. El padding es de 32 arriba, abajo y a la derecha (<code>space/container/on-canva</code>), y de 40 a la izquierda (<code>space/general/5xl</code>). Cuatro columnas separadas por 10.
                </>,
                <>
                  <strong>Íconos:</strong> columna de 24 con Maximizar, Deshacer y Borrar. El contenido se lee de abajo hacia arriba porque la interfaz horizontal se gira −90°.
                </>,
                <>
                  <strong>Firma:</strong> columna de 174 con el área de dibujo y el texto guía. Los puntos se guardan normalizados, así que la rotación no cambia el valor.
                </>,
                <>
                  <strong>Cierre:</strong> columna de 28 con el ícono <code>close</code> de 24 px abajo y una línea de 1 px en <code>border/general/default-on-card</code>. Llama a <code>onClose</code>.
                </>,
                <>
                  <strong>Firmante:</strong> nombre y documento de 16 con interlineado de 20 (<code>typography/body/size/lg</code>), en <code>text/neutral/white</code>. Salen de <code>signerName</code> y <code>signerId</code>; sin ellos no se dibuja el bloque.
                </>,
                <>
                  <strong>Botones:</strong> Cancelar (<code>Button</code> secondary low) y Crear firma (<code>Button</code> primary), a 12 uno de otro. Crear firma queda inactivo mientras no haya firma (<code>requireSignature</code>).
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
          SignaturePad tiene 3 estados: Default, Filled y Disabled. No tiene prop <code>state</code>: Default y Filled salen de que haya trazos, y las muestras usan una firma de ejemplo (<code>defaultValue</code>) para verse sin dibujar. Hover y Focus son de los botones de acción y salen de CSS.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default, con los de Filled y de la versión vertical donde cambian. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Tarjeta horizontal',
              preview: horizontal(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-card' },
                { part: 'Trazo', color: 'border-general-default-on-canva' },
                { part: 'Texto guía', color: 'text-neutral-disabled-on-canva', text: 'typography-body-size-lg' },
                { part: 'Íconos de acción (sin firma)', color: 'text-neutral-disabled-on-canva' },
              ],
            },
            {
              title: 'Con firma',
              preview: horizontal({ defaultValue: SAMPLE }),
              entries: [
                { part: 'Trazo de la firma', color: 'icon-general-default' },
                { part: 'Íconos de acción', color: 'icon-general-default' },
                { part: 'Foco de los íconos', color: 'border-field-active' },
              ],
            },
            {
              title: 'Pantalla vertical',
              preview: vertical({ defaultValue: SAMPLE }),
              entries: [
                { part: 'Nombre y documento', color: 'text-neutral-white', text: 'typography-body-size-lg' },
                { part: 'Línea de la columna de cierre', color: 'border-general-default-on-card' },
                { part: 'Crear firma (fondo)', color: 'background-button-primary-default' },
                { part: 'Crear firma (texto)', color: 'text-button-primary-default' },
                { part: 'Cancelar (trazo)', color: 'border-button-secondary-low-default' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente SignaturePad en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Firm en la librería de Assets. Sus propiedades son Position, Propiedad 1, Maximize, Name,cc, Name, cc y Line.
            </>,
            <>
              <strong>Position:</strong> Horizontal y Vertical son los valores de <code>orientation</code> (<code>horizontal</code> y <code>vertical</code>). Vertical es la pantalla de celular con la interfaz girada.
            </>,
            <>
              <strong>Propiedad 1:</strong> Default y Filled no son una prop en el código. Filled es que haya trazos (<code>value</code> o <code>defaultValue</code>).
            </>,
            <>
              <strong>Maximize, Name,cc, Name y cc:</strong> son <code>maximizable</code>, el bloque del firmante y sus dos textos (<code>signerName</code> y <code>signerId</code>). En código el bloque aparece solo si pasas alguno de los dos.
            </>,
            <>
              <strong>Diferencias:</strong> Figma tiene la propiedad Line y el código siempre dibuja la línea. El estado Disabled, el foco, el teclado de los botones y la salida como trazos o imagen (<code>ref</code>) solo existen en código.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el SignaturePad es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Capturar una firma manuscrita:</strong> se dibuja con puntero, mouse o dedo. El trazo es suave, se escala con la pantalla y se redibuja al cambiar el tamaño o el tema. Con <code>touch-action: none</code> el dedo no desplaza la página.
            </>,
            <>
              <strong>Guardar la firma como dato:</strong> el valor son trazos normalizados (<code>value</code> y <code>onValueChange</code>), no una imagen. Para obtener la imagen usa <code>toDataURL</code> del <code>ref</code> con el color y el fondo que necesites.
            </>,
            <>
              <strong>Flujo de firma en móvil:</strong> <code>orientation=&quot;vertical&quot;</code> suma el firmante, Cancelar y Crear firma. Crear firma recibe los trazos en <code>onCreate</code>.
            </>,
            <>
              <strong>Corregir y avisar:</strong> Deshacer quita el último trazo y Borrar vacía la firma. Son botones nativos: se alcanzan con Tab y se activan con Enter o Espacio. El área tiene el nombre &quot;Firma vacía&quot; o &quot;Firma registrada&quot;, y una región <code>role=&quot;status&quot;</code> anuncia cada cambio.
            </>,
          ],
          avoid: [
            <>
              <strong>Que sea la única forma de firmar:</strong> dibujar no tiene equivalente por teclado y el área no recibe el foco. Ofrece otra vía junto a ella, como escribir el nombre. (Alternativa: <code>Input</code>).
            </>,
            <>
              <strong>Subir una firma ya hecha:</strong> el componente no abre archivos. (Alternativa: <code>FileDropzone</code>).
            </>,
            <>
              <strong>Comprobar quién firma:</strong> captura trazos, no valida identidad. Haz esa verificación fuera del componente.
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet y Desktop solo difieren en el padding de la versión vertical.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Horizontal',
                bullets: [
                  <>
                    <strong>Ancho fluido:</strong> ocupa el del contenedor (1102 en Figma) y mide 178 de alto. El padding es de 16 × 12.
                  </>,
                  <>
                    <strong>Texto guía:</strong> 16 con interlineado de 22 (<code>typography/body/size/lg</code>).
                  </>,
                ],
                preview: horizontal(),
              },
              {
                title: 'Vertical',
                bullets: [
                  <>
                    <strong>Pantalla fija:</strong> 376 × 812, limitada al ancho del contenedor. El padding es de 32 arriba, abajo y a la derecha (<code>space/container/on-canva</code>), y de 40 a la izquierda.
                  </>,
                  <>
                    <strong>Firmante:</strong> nombre y documento de 16 con interlineado de 20.
                  </>,
                ],
                preview: vertical({ defaultValue: SAMPLE }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Padding menor:</strong> en la vertical baja a 20 arriba, abajo y a la derecha, y a 32 a la izquierda (<code>space/general/5xl</code>).
              </>,
              <>
                <strong>Textos menores:</strong> el texto guía y el firmante bajan a 14 con interlineado de 20 (<code>typography/body/size/lg</code>).
              </>,
              <>
                <strong>Toque:</strong> el dedo dibuja sin desplazar la página y los íconos de 24 px tienen un área táctil de 40.
              </>,
            ],
            preview: vertical({ defaultValue: SAMPLE }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Padding intermedio:</strong> en la vertical es de 24 arriba, abajo y a la derecha, y de 40 a la izquierda.
              </>,
              <>
                <strong>Textos:</strong> el texto guía y el firmante miden lo mismo que en Desktop: 16 con interlineado de 22 y de 20.
              </>,
              <>
                <strong>Ancho:</strong> la horizontal sigue al contenedor; la vertical mide 376 como máximo.
              </>,
            ],
            preview: vertical({ defaultValue: SAMPLE }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de accesibilidad, texto guía y trazo del SignaturePad.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Otra vía de firma',
              description: 'Ofrece una alternativa junto al área de dibujo.',
              preview: (
                <div className="flex w-full flex-col gap-ds-space-general-xl">
                  <SignaturePad />
                  <Input label="O escribe tu nombre" fullWidth />
                </div>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Solo dibujo',
              description: 'No dejes el dibujo como única forma de firmar.',
              preview: <SignaturePad />,
            },
            {
              kind: 'do',
              framed: true,
              title: 'Texto guía visible',
              description: 'Di dónde y cómo firmar con el texto guía.',
              preview: <SignaturePad labels={{ placeholder: 'Firma con el dedo o el mouse' }} />,
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Sin texto guía',
              description: 'No quites el texto guía: el área queda sin indicación.',
              preview: <SignaturePad labels={{ placeholder: '' }} />,
            },
            {
              kind: 'do',
              framed: true,
              title: 'Trazo fino',
              description: 'Mantén el grosor cerca del valor por defecto, 2,5 px.',
              preview: <SignaturePad defaultValue={SAMPLE} />,
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Trazo grueso',
              description: 'No engroses el trazo: tapa los detalles de la firma.',
              preview: <SignaturePad defaultValue={SAMPLE} strokeWidth={10} />,
            },
          ],
        },
      ],
    },
  ],
};
