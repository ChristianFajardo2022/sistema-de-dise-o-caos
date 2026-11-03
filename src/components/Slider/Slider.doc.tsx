import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Slider } from './Slider';
import type { SliderProps } from './Slider.types';

/*
 * Contenido de la página de documentación de Slider (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Slider.types.ts`, `Slider.variants.ts`, `Slider.tsx`), luego `Slider.docs.json`. Medidas: raíz de 6 de alto (pista de 4
 * y 1 de padding arriba y abajo), pulgar de 16 en Simple, 8 en Range y 22 con el valor adentro. Diferencias con Figma:
 * Figma pinta la pista con `background/general/gray-fifth` y el tramo con `background/general/gray-firts`; el código usa
 * `gray-sixth` y `gray-secondary`. Figma no dibuja foco ni estado deshabilitado; el código agrega un contorno de 2 px y
 * la opacidad al 50%. El texto del valor es Helvetica Neue Light en Figma y peso regular en el código.
 */

// Figma: 13839:56628 (component set Slide bar)

type OneProps = Omit<SliderProps<number>, 'value'>;
type TwoProps = Omit<SliderProps<[number, number]>, 'value'>;

/** Slider de un pulgar. */
const one = (props: OneProps = {}) => <Slider aria-label="Volumen" defaultValue={40} {...props} />;

/** Slider de rango: dos pulgares que no se cruzan. */
const two = (props: TwoProps = {}) => <Slider<[number, number]> aria-label="Edad" defaultValue={[25, 70]} {...props} />;

/** Columna de ejemplos: el Slider ocupa el ancho disponible, así que el marco le fija uno que cabe en el teléfono. */
const box = (...items: ReactNode[]) => (
  <div className="flex w-72 min-w-36 max-w-full flex-col gap-ds-primitives-space-6xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Contorno de foco como lo dibuja el pulgar con el teclado: se fuerza para documentarlo. */
const focused = (...items: ReactNode[]) => (
  <div className="[&_[role=slider]]:outline-2 [&_[role=slider]]:outline-offset-2 [&_[role=slider]]:outline-solid [&_[role=slider]]:outline-ds-border-field-active">
    {box(...items)}
  </div>
);

const ROOT = 'div:has(> [data-figma-part="Shape"])';

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Pista y tramo seleccionado en tonos distintos de gris, y el pulgar blanco con contorno. El cursor pasa a mano sobre el pulgar y a mano cerrada al arrastrar.',
    samples: [box(one(), two())],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al llegar con el teclado. El pulgar enfocado dibuja un contorno de 2 px, separado 2 px. En un rango, cada pulgar lo recibe por separado.',
    samples: [focused(one(), two())],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Sin respuesta (<code>disabled</code>). Todo el control baja al 50% de opacidad, sale del orden de tabulación y no envía valor en un formulario.
      </>
    ),
    samples: [box(one({ disabled: true }), two({ disabled: true }))],
  },
];

export const doc: ComponentDocContent = {
  name: 'Slider',
  icon: 'filter',
  classification: 'atomo',
  summary:
    'El Slider es el átomo para elegir un valor numérico dentro de un rango, arrastrando un pulgar sobre una pista. Tiene uno o dos pulgares, puede mostrar el valor dentro del pulgar y responde a puntero y teclado.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una pista con un tramo seleccionado y uno o dos pulgares que se desplazan sobre ella. No dibuja etiqueta: el nombre va en un atributo ARIA.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Simple',
                  preview: box(one()),
                  marks: [
                    { n: 1, selector: ROOT, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Shape"]', side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Form"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Rectangle 2"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Shape"]' },
                    { kind: 'height', selector: '[data-figma-part="Rectangle 2"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Raíz:</strong> ocupa todo el ancho disponible y mide 6 de alto: la pista de 4 más 1 de padding arriba y abajo. Un área táctil invisible la amplía a 26 de alto.
                </>,
                <>
                  <strong>Pista:</strong> 4 de alto con radio de píldora (<code>radius/general/full</code>) en <code>background/general/gray-sixth</code>.
                </>,
                <>
                  <strong>Tramo seleccionado:</strong> va del inicio de la pista hasta el pulgar, en <code>background/general/gray-secondary</code>.
                </>,
                <>
                  <strong>Pulgar:</strong> círculo de 16 en <code>background/general/white-unicolor</code> con contorno interior de 1.5 (<code>border/general/gray-fourth</code>). Su centro recorre la pista sin salirse: a 0% toca el borde izquierdo y a 100%, el derecho. Un área táctil de 24 lo amplía.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Range',
                  preview: box(two()),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Rectangle 2"]', index: 0, side: 'top' },
                    { n: 2, selector: '[data-figma-part="Form"]', side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Rectangle 2"]', index: 1, side: 'top' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-figma-part="Rectangle 2"]', index: 0 }],
                },
              ],
              guidelines: [
                <>
                  <strong>Pulgar mínimo:</strong> círculo de 8 con el mismo contorno que en Simple. Se llama &quot;Mínimo&quot; por defecto (<code>thumbLabels</code>).
                </>,
                <>
                  <strong>Tramo seleccionado:</strong> va entre los dos pulgares.
                </>,
                <>
                  <strong>Pulgar máximo:</strong> círculo de 8 llamado &quot;Máximo&quot;. No cruza al mínimo: los dos se detienen donde se tocan.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Con valor',
                  preview: box(two({ showValue: true })),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Number"]', index: 0, side: 'top' },
                    { n: 2, selector: '[data-figma-part="00"]', index: 0, side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Number"]', index: 1, side: 'top' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-figma-part="Number"]', index: 0 }],
                },
              ],
              guidelines: [
                <>
                  <strong>Pulgar con valor:</strong> 22 de alto y de ancho mínimo, con padding de 2 (<code>space/general/sm</code>). Crece si el texto es más largo.
                </>,
                <>
                  <strong>Valor:</strong> texto de 10 con alto de línea de 14 (<code>typography/body/xs</code>) en <code>text/neutral/black-unicolor</code>, con cifras de ancho fijo. El lector no lo repite: el valor se anuncia con <code>aria-valuetext</code>.
                </>,
                <>
                  <strong>Segundo pulgar:</strong> en un rango, cada pulgar lleva su propio valor. En Simple, el único pulgar lleva el suyo.
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
          Slider tiene 3 estados. Hover y Press no cambian su aspecto: solo cambia el cursor. Focus se fuerza aquí solo para documentarlo; en el componente sale del teclado. Los tamaños y el valor visible son variantes de aspecto (<code>showValue</code>), no estados.
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
              title: 'Simple y Range',
              preview: box(one(), two()),
              entries: [
                { part: 'Pista', color: 'background-general-gray-sixth' },
                { part: 'Tramo seleccionado', color: 'background-general-gray-secondary' },
                { part: 'Pulgar', color: 'background-general-white-unicolor' },
                { part: 'Contorno del pulgar', color: 'border-general-gray-fourth' },
                { part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Con valor',
              preview: box(one({ showValue: true, defaultValue: 60 }), two({ showValue: true })),
              entries: [
                { part: 'Pista', color: 'background-general-gray-sixth' },
                { part: 'Tramo seleccionado', color: 'background-general-gray-secondary' },
                { part: 'Pulgar', color: 'background-general-white-unicolor' },
                { part: 'Contorno del pulgar', color: 'border-general-gray-fourth' },
                { part: 'Valor', color: 'text-neutral-black-unicolor', text: 'typography-body-size-xs' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Slider en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Slide bar en la librería de Assets. Tiene dos propiedades: Type y Porcentage.
            </>,
            <>
              <strong>Type:</strong> Simple y Simple number son un pulgar; Range y Range number, dos (<code>defaultValue</code> con un número o con un par <code>[a, b]</code>). Los dos Number llevan el valor dentro del pulgar (<code>showValue</code>).
            </>,
            <>
              <strong>Porcentage:</strong> 0%, 25%, 50%, 75% y 100%. En Simple es la posición del pulgar; en Range, el ancho del tramo centrado. En código no es una prop: lo da <code>value</code> o <code>defaultValue</code>.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> no dibuja etiqueta, foco ni estado deshabilitado. El código agrega un contorno de foco de 2 px y <code>disabled</code> con opacidad al 50%; la etiqueta visible la pone la pantalla y se enlaza con <code>aria-labelledby</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Slider es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Valor dentro de un rango:</strong> volumen, brillo o zoom, donde importa la posición más que la cifra exacta (<code>min</code>, <code>max</code> y <code>step</code>).
            </>,
            <>
              <strong>Un valor o un intervalo:</strong> un número en <code>value</code> da un pulgar; un par <code>[a, b]</code> da dos que no se cruzan.
            </>,
            <>
              <strong>Nombre siempre definido:</strong> el Slider no dibuja etiqueta. Pasa <code>aria-label</code> o enlaza la etiqueta visible con <code>aria-labelledby</code>.
            </>,
            <>
              <strong>Teclado completo:</strong> las flechas mueven un paso, RePág y AvPág una décima parte del rango, e Inicio y Fin llevan al extremo. En un rango, Inicio y Fin se detienen en el otro pulgar.
            </>,
            <>
              <strong>Valor legible:</strong> <code>showValue</code> lo dibuja en el pulgar y <code>formatValue</code> da formato al texto y a <code>aria-valuetext</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Una cifra exacta:</strong> arrastrar no es preciso para un número concreto. (Alternativa: <code>NumberPicker</code> o <code>Input</code>).
            </>,
            <>
              <strong>Pocas opciones con nombre:</strong> elegir entre tamaños o planes no es un valor continuo. (Alternativa: <code>Radio</code>).
            </>,
            <>
              <strong>Encender o apagar:</strong> el Slider no tiene dos valores excluyentes. (Alternativa: <code>Switch</code>).
            </>,
            <>
              <strong>Sin nombre accesible:</strong> sin <code>aria-label</code> ni <code>aria-labelledby</code>, el lector solo anuncia un número.
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
                title: 'Simple y Range',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas:</strong> pista de 4 de alto y pulgar de 16 en Simple o de 8 en Range.
                  </>,
                ],
                preview: box(one(), two()),
              },
              {
                title: 'Con valor',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas:</strong> pulgar de 22 de alto con texto de 10 y alto de línea de 14.
                  </>,
                ],
                preview: box(one({ showValue: true, defaultValue: 60 }), two({ showValue: true })),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Ancho:</strong> ocupa todo el ancho disponible; se acorta la pista, no el pulgar.
              </>,
              <>
                <strong>Toque:</strong> el pulgar tiene un área de 24 y la raíz, 26 de alto. Arrastrar en horizontal mueve el pulgar y en vertical sigue desplazando la página.
              </>,
            ],
            preview: box(one(), two()),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Ancho:</strong> ocupa todo el ancho disponible y no tiene un máximo propio: limítalo desde el contenedor.
              </>,
              <>
                <strong>Pulgar:</strong> conserva su tamaño de 16, 8 o 22; solo la pista se alarga.
              </>,
            ],
            preview: box(one(), two()),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre, valor y uso del Slider.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Nombre accesible',
              description: (
                <>
                  Da nombre al Slider con un <code>aria-label</code> que diga qué ajusta.
                </>
              ),
              preview: box(<Slider aria-label="Volumen" defaultValue={40} />),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Nombre genérico',
              description: (
                <>
                  No uses un <code>aria-label</code> que no dice qué ajusta.
                </>
              ),
              preview: box(<Slider aria-label="Valor" defaultValue={40} />),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Valor visible',
              description: (
                <>
                  Activa <code>showValue</code> cuando la cifra exacta importa.
                </>
              ),
              preview: box(<Slider aria-label="Edad" min={18} max={99} defaultValue={[25, 40]} showValue />),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Valor oculto',
              description: 'No dejes sin cifra un rango donde hay que leerla.',
              preview: box(<Slider aria-label="Edad" min={18} max={99} defaultValue={[25, 40]} />),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Valor continuo',
              description: 'Usa Slider para un valor que varía de forma gradual.',
              preview: box(<Slider aria-label="Brillo" defaultValue={60} />),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Pocas opciones',
              description: 'No uses Slider para elegir entre pocas opciones con nombre.',
              preview: box(<Slider aria-label="Tamaño" min={1} max={3} defaultValue={2} showValue formatValue={(v) => ['S', 'M', 'L'][v - 1]} />),
            },
          ],
        },
      ],
    },
  ],
};
