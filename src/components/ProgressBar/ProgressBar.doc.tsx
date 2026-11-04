import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { ProgressBar } from './ProgressBar';
import type { ProgressBarProps } from './ProgressBar.types';

/*
 * Contenido de la página de documentación de ProgressBar (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`ProgressBar.types.ts`, `ProgressBar.variants.ts`, `ProgressBar.tsx`), luego `ProgressBar.docs.json`. Medidas:
 * Linear text con pista de 8 y píldora de 22 (padding 8 × 2); Text above con pista de 12, margen vertical de 1 y burbuja
 * de 26 (padding 8 × 4); External text con barra de 4, burbuja de 22, puntero y punto, alto total 41. Texto Helvetica
 * Neue Semibold 12/16.
 * Diferencias con Figma: Figma dibuja solo los 5 pasos 0, 25, 50, 75 y 100 con un ancho de muestra (347); el código
 * acepta cualquier valor entre 0 y `max`, ocupa el ancho del contenedor, pide un nombre accesible y suma `statusLabel`
 * y `formatValue`, que Figma no define. Figma tampoco tiene estado indeterminado ni el movimiento de 300 ms.
 */

// Figma: 11210:8045 (component set Progress bar)

type BarProps = Partial<Omit<ProgressBarProps, 'label' | 'aria-labelledby'>> & { label?: string };

/** Barra de muestra al ancho de Figma (347) con aire arriba y abajo para la burbuja de Text above. */
const bar = ({ label = 'Carga del archivo', ...props }: BarProps = {}) => (
  <div className="w-[347px] max-w-full py-ds-space-general-md">
    <ProgressBar label={label} value={60} {...props} />
  </div>
);

/** Las tres posiciones del texto, una sobre otra. */
const stack = (props: BarProps = {}) => (
  <div className="flex w-full flex-col gap-ds-space-general-lg">
    {bar({ ...props, type: 'linear-text' })}
    {bar({ ...props, type: 'text-above' })}
    {bar({ ...props, type: 'external-text' })}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Valor por defecto (<code>status=&quot;default&quot;</code>). El relleno usa <code>background/general/white</code>, el de mayor contraste con la pista.
      </>
    ),
    samples: [stack()],
  },
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Con <code>status=&quot;success&quot;</code> el relleno es verde. Úsalo cuando el proceso termina bien.
      </>
    ),
    samples: [stack({ status: 'success' })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>status=&quot;error&quot;</code> el relleno es rojo. Añade <code>statusLabel</code>: el color solo no informa a un lector de pantalla.
      </>
    ),
    samples: [stack({ status: 'error', statusLabel: 'con error' })],
  },
  {
    label: 'Alert',
    tone: 'alert',
    description: (
      <>
        Con <code>status=&quot;alert&quot;</code> el relleno es ámbar. Señala un avance que necesita atención.
      </>
    ),
    samples: [stack({ status: 'alert', statusLabel: 'con advertencia' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'ProgressBar',
  icon: 'chart',
  classification: 'atomo',
  summary:
    'El ProgressBar es el átomo que muestra cuánto avanzó un proceso con un valor conocido, de 0 a un máximo. Tiene tres posiciones del texto (a la derecha, sobre la barra y con puntero) y cuatro colores de estado. No es interactivo: solo informa.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una pista con su relleno y, si muestras el valor, una píldora o burbuja con el porcentaje. Su posición depende de Type.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Linear text',
                  preview: bar(),
                  marks: [
                    { n: 1, selector: '[role="progressbar"]', side: 'left' },
                    { n: 2, selector: '[role="progressbar"] > div:first-child', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Bar"]', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Container"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Percentage"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[role="progressbar"] > div:first-child' },
                    { kind: 'height', selector: '[data-figma-part="Container"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> fila con 8 de separación (<code>space/general/lg</code>) que ocupa el ancho del contenedor (Figma la dibuja de 347) y se nombra con <code>label</code>.
                </>,
                <>
                  <strong>Pista:</strong> 8 de alto, forma completa (<code>radius/general/full</code>) y fondo <code>background/general/gray-sixth</code>. Absorbe el espacio que deja la píldora.
                </>,
                <>
                  <strong>Relleno:</strong> escala de 0 a <code>max</code> desde la izquierda. Termina recto (<code>radius/general/xs</code>) salvo al 100%.
                </>,
                <>
                  <strong>Píldora:</strong> 22 de alto, con padding 8 × 2 (<code>space/button/lg</code> y <code>space/general/sm</code>) y forma completa (<code>radius/field/full</code>).
                </>,
                <>
                  <strong>Texto:</strong> porcentaje en Helvetica Neue Semibold de 12/16 (<code>typography/field/size/xs</code>). Tiene un ancho mínimo de &quot;100%&quot; para que la pista no cambie de largo al animar.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Text above',
                  preview: bar({ type: 'text-above', value: 50 }),
                  marks: [
                    { n: 1, selector: '[role="progressbar"]', side: 'right' },
                    { n: 2, selector: '[role="progressbar"] > div:first-child', side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Bar"]', side: 'left' },
                    { n: 4, selector: '[data-figma-part="Container"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Percentage"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[role="progressbar"] > div:first-child' },
                    { kind: 'height', selector: '[data-figma-part="Container"]' },
                    { kind: 'padding', selector: '[data-figma-part="Container"]', side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Container"]', side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 14 de alto: la pista más 1 de margen arriba y abajo. La burbuja sobresale de él.
                </>,
                <>
                  <strong>Pista:</strong> 12 de alto, forma completa y fondo <code>background/general/gray-sixth</code>.
                </>,
                <>
                  <strong>Relleno:</strong> llena la pista desde la izquierda y termina redondeado, también por debajo del 100%.
                </>,
                <>
                  <strong>Burbuja:</strong> 26 de alto, con padding 8 × 4 (<code>space/button/lg</code> y <code>space/general/md</code>). Se centra en el extremo del progreso y se alinea al borde en 0% y 100%.
                </>,
                <>
                  <strong>Texto:</strong> el mismo porcentaje de 12/16 Semibold, centrado en la burbuja.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'External text',
                  preview: bar({ type: 'external-text', value: 50 }),
                  marks: [
                    { n: 1, selector: '[role="progressbar"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Container"] > span', side: 'top' },
                    { n: 3, selector: '[role="progressbar"] > span > span:nth-of-type(2)', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Dot"]', side: 'left' },
                    { n: 5, selector: '[role="progressbar"] > div:first-child', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[role="progressbar"]' },
                    { kind: 'height', selector: '[data-figma-part="Container"] > span' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 41 de alto, con la barra en la parte inferior y el texto arriba.
                </>,
                <>
                  <strong>Burbuja:</strong> 22 de alto, con padding 8 × 2 y forma completa (<code>radius/field/full</code>). Con 0% y 100% su esquina inferior hacia la barra queda recta.
                </>,
                <>
                  <strong>Puntero:</strong> triángulo de 8 × 10 px bajo la burbuja que señala el progreso. No aparece en 0% ni en 100%.
                </>,
                <>
                  <strong>Punto:</strong> círculo de 8 px sobre la barra, anclado al extremo del progreso.
                </>,
                <>
                  <strong>Barra:</strong> 4 de alto, con pista <code>background/general/gray-sixth</code> y relleno que sigue el estado.
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
          ProgressBar tiene 4 variantes de aspecto (State en Figma), que se eligen con <code>status</code>. No es interactivo: no tiene Hover, Focus ni Press. Cada muestra dibuja las tres posiciones del texto, de arriba abajo. En claro, la pista y la píldora (<code>background/general/gray-sixth</code>) se funden con el panel.
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
              title: 'Linear text',
              preview: bar({ value: 40 }),
              entries: [
                { part: 'Pista', color: 'background-general-gray-sixth' },
                { part: 'Relleno', color: 'background-general-white' },
                { part: 'Píldora', color: 'background-general-gray-sixth' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-xs' },
              ],
            },
            {
              title: 'Text above',
              preview: bar({ type: 'text-above', value: 40 }),
              entries: [
                { part: 'Pista', color: 'background-general-gray-sixth' },
                { part: 'Relleno', color: 'background-general-white' },
                { part: 'Burbuja', color: 'background-general-gray-sixth' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-xs' },
              ],
            },
            {
              title: 'External text',
              preview: bar({ type: 'external-text', value: 40 }),
              entries: [
                { part: 'Barra', color: 'background-general-gray-sixth' },
                { part: 'Relleno', color: 'background-general-white' },
                { part: 'Burbuja, puntero y punto', color: 'background-general-gray-sixth' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-xs' },
              ],
            },
            {
              title: 'Relleno por State',
              preview: (
                <div className="flex w-full flex-col">
                  {bar({ status: 'success', value: 40 })}
                  {bar({ status: 'error', value: 40 })}
                  {bar({ status: 'alert', value: 40 })}
                </div>
              ),
              entries: [
                { part: 'Relleno (Success)', color: 'background-semantic-success-tertiary' },
                { part: 'Relleno (Error)', color: 'background-semantic-error-tertiary' },
                { part: 'Relleno (Alert)', color: 'background-semantic-alert-tertiary' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente ProgressBar en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Progress bar en la librería de Assets. Tiene 60 variantes: Type × State × Progress.
            </>,
            <>
              <strong>Type:</strong> Linear text, Text above o External text. En código es <code>type</code> con <code>linear-text</code>, <code>text-above</code> o <code>external-text</code>.
            </>,
            <>
              <strong>State y Progress:</strong> State (Default, Success, Error, Alert) es el color y equivale a <code>status</code>. Progress solo ofrece 0%, 25%, 50%, 75% y 100%; en código <code>value</code> es continuo, de 0 a <code>max</code>.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no define <code>max</code>, <code>formatValue</code>, <code>statusLabel</code>, el nombre accesible (<code>label</code>) ni el movimiento de 300 ms. Dibuja un ancho de muestra de 347; el código ocupa el ancho del contenedor.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el ProgressBar es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Avance medible:</strong> muestra cuánto va de un proceso que tiene un total conocido, como una carga o un formulario de varias partes.
            </>,
            <>
              <strong>Texto según el espacio:</strong> usa <code>linear-text</code> cuando hay ancho de sobra, <code>text-above</code> para leer el valor en el extremo del progreso y <code>external-text</code> cuando la barra debe ser fina.
            </>,
            <>
              <strong>Valor propio:</strong> pasa <code>max</code> y <code>formatValue</code> para contar pasos u otras unidades (&quot;3/8&quot;). El texto visible y <code>aria-valuetext</code> usan el mismo formato.
            </>,
            <>
              <strong>Nombre y estado:</strong> pasa <code>label</code> (o <code>aria-labelledby</code>, con el id de un texto visible) para nombrar la barra. Si usas un estado de color, añade <code>statusLabel</code>.
            </>,
            <>
              <strong>Movimiento:</strong> el relleno y la burbuja se animan 300 ms al cambiar <code>value</code>. Con <code>prefers-reduced-motion</code> la duración baja a 0,01 ms y el cambio es casi inmediato.
            </>,
          ],
          avoid: [
            <>
              <strong>Duración desconocida:</strong> la barra no tiene modo indeterminado. (Alternativa: <code>Spinner</code>).
            </>,
            <>
              <strong>Pasos de un recorrido:</strong> una barra no nombra cada paso. (Alternativa: <code>Stepper</code>).
            </>,
            <>
              <strong>Elegir un valor:</strong> la barra no es interactiva y no recibe foco. (Alternativa: <code>Slider</code>).
            </>,
            <>
              <strong>Subida de archivos con su estado:</strong> el campo ya trae su propia barra y sus mensajes. (Alternativa: <code>FileUploadSimple</code>).
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
                title: 'Texto a la derecha',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Linear text:</strong> pista de 8 y píldora de 22, con el texto de 12/16 a la derecha.
                  </>,
                ],
                preview: bar(),
              },
              {
                title: 'Texto sobre la barra',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas:</strong> Text above, pista de 12 y burbuja de 26; External text, barra de 4, burbuja de 22 y 41 de alto en total.
                  </>,
                ],
                preview: (
                  <div className="flex w-full flex-col gap-ds-space-general-lg">
                    {bar({ type: 'text-above' })}
                    {bar({ type: 'external-text' })}
                  </div>
                ),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> pista de 8, 12 o 4 según Type, y texto de 12/16 en los tres breakpoints.
              </>,
              <>
                <strong>Ancho:</strong> la barra ocupa el ancho del contenedor. En Linear text la pista absorbe el espacio que deja la píldora.
              </>,
            ],
            preview: stack(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> pista de 8, 12 o 4 según Type, y texto de 12/16 en los tres breakpoints.
              </>,
              <>
                <strong>Ancho:</strong> la barra ocupa el ancho del contenedor. En Linear text la pista absorbe el espacio que deja la píldora.
              </>,
            ],
            preview: stack(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de valor, color y texto del ProgressBar.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Máximo propio',
              description: (
                <>
                  Define <code>max</code> y <code>formatValue</code> cuando el avance se cuenta en pasos.
                </>
              ),
              preview: bar({ value: 3, max: 8, formatValue: (v) => `${v}/8` }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Pasos sin máximo',
              description: (
                <>
                  No pases pasos sin <code>max</code>: 3 de 8 se lee como 3%.
                </>
              ),
              preview: bar({ value: 3 }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Estado con texto',
              description: 'Acompaña el color de error con un texto que lo diga.',
              preview: bar({ status: 'error', formatValue: (_v, p) => `${Math.round(p)}%, con error` }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Solo color',
              description: 'No uses el rojo como único aviso de error.',
              preview: bar({ status: 'error', showValue: false }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Texto corto',
              description: 'Escribe solo el valor: la píldora comparte el ancho con la pista.',
              preview: bar(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto largo',
              description: 'No añadas frases al valor: la pista se encoge.',
              preview: bar({ formatValue: (_v, p) => `${Math.round(p)}% del archivo cargado` }),
            },
          ],
        },
      ],
    },
  ],
};
