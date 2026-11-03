import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { FloatButton } from './FloatButton';
import type { FloatButtonProps, FloatButtonState } from './FloatButton.types';

/*
 * Contenido de la página de documentación de FloatButton (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`FloatButton.types.ts`, `FloatButton.variants.ts`, `FloatButton.tsx`), luego `FloatButton.docs.json`. Figma solo
 * dibuja Default (Icon single y With text); Hover, Press y Focus son propuesta del código.
 */

// Figma: 21900:67738 (component set Float button)

/** FloatButton de solo ícono, con nombre accesible. */
const single = (props: Partial<FloatButtonProps> = {}) => <FloatButton icon="add" aria-label="Crear" {...(props as FloatButtonProps)} />;

/** FloatButton extendido: el texto es el nombre accesible. */
const extended = (props: Partial<FloatButtonProps> = {}, label: ReactNode = 'Crear') => (
  <FloatButton icon="add" {...(props as FloatButtonProps)}>
    {label}
  </FloatButton>
);

/** Una muestra por forma (solo ícono y extendido), con `state` forzado. */
const stateSamples = (state: FloatButtonState): ReactNode[] => [single({ state }), extended({ state })];

/** Pareja de muestras para breakpoints y Tokens y modos. */
const both = () => (
  <div className="flex flex-wrap items-center gap-ds-space-general-2xl">
    {single()}
    {extended()}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Círculo con fondo de acento y sombra; el ícono y el texto son blancos en ambos modos.',
    samples: stateSamples('default'),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero. El fondo pasa a un tono más oscuro del acento.',
    samples: stateSamples('hover'),
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al recibir el foco del teclado. Aparece un contorno de 2 px, separado 2 px del botón.',
    samples: stateSamples('focus'),
  },
  {
    label: 'Press',
    tone: 'accent',
    description: 'Mientras se presiona. El fondo se oscurece un paso más que en Hover.',
    samples: stateSamples('press'),
  },
];

export const doc: ComponentDocContent = {
  name: 'FloatButton',
  icon: 'add-circle',
  classification: 'atomo',
  summary:
    'El FloatButton es el átomo para la acción principal de una pantalla que se mantiene a la vista sobre el contenido. Es un botón circular con sombra, solo con ícono o extendido con texto. Quien lo usa decide dónde se coloca.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un contenedor circular con un ícono y, en la forma extendida, un texto. Ambas formas comparten fondo, sombra y color.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Solo ícono',
                  preview: single(),
                  marks: [
                    { n: 1, selector: 'button', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'button', side: 'left' },
                    { kind: 'padding', selector: 'button', side: 'top' },
                    { kind: 'height', selector: 'button' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> círculo de 48 × 48 px (<code>radius/button/full</code>) con padding de 12 px (<code>space/general/xl</code>), fondo de acento y la sombra del token on-canva sm del grupo effect.
                </>,
                <>
                  <strong>Ícono:</strong> 24 px, blanco y decorativo para el lector de pantalla. Sin texto, el botón exige <code>aria-label</code> o <code>aria-labelledby</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Extendido',
                  preview: extended(),
                  marks: [
                    { n: 1, selector: 'button', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Text-button"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'button', side: 'left' },
                    { kind: 'padding', selector: 'button', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="Icon-sizes"]', to: '[data-figma-part="Text-button"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> píldora de 48 px de alto y ancho según el contenido. Padding X de 24 px en Desktop y Tablet y de 20 px en Mobile (<code>space/general/3xl</code>); padding Y de 8 px (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Ícono:</strong> 24 px, a la izquierda del texto. Entre ícono y texto hay 10 px.
                </>,
                <>
                  <strong>Texto:</strong> Helvetica Neue Semibold, de 14 px en Desktop y Tablet y de 16 px en Mobile (token <code>button/size/md</code> de tipografía). Lleva 2 px de padding inferior (<code>space/button/sm</code>).
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
          FloatButton tiene 4 estados. Hover, Focus y Press se fuerzan con <code>state</code> solo para documentar; en uso salen de la interacción. Figma solo dibuja Default y el componente no tiene estado inactivo ni de espera.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default y los de hover, press y foco. El ícono no tiene token propio: hereda el color del texto, el token unicolor de texto del botón. La sombra no se lista: es un color translúcido.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Solo ícono',
              preview: single(),
              entries: [
                { part: 'Fondo', color: 'background-acent-tertiary' },
                { part: 'Ícono (hereda el color del texto)', color: 'text-button-secondary-low-unicolor' },
              ],
            },
            {
              title: 'Extendido',
              preview: extended(),
              entries: [
                { part: 'Fondo', color: 'background-acent-tertiary' },
                { part: 'Texto', color: 'text-button-secondary-low-unicolor', text: 'typography-button-size-md' },
                { part: 'Ícono (hereda el color del texto)', color: 'text-button-secondary-low-unicolor' },
              ],
            },
            {
              title: 'Hover, Press y Focus',
              preview: single(),
              entries: [
                { part: 'Fondo (aparece en Hover)', color: 'primitives-color-tertiary-m04' },
                { part: 'Fondo (aparece en Press)', color: 'primitives-color-tertiary-m05' },
                { part: 'Contorno (aparece en Focus)', color: 'border-field-active' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente FloatButton en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Float button en la librería de Assets y arrástralo al lienzo. Sus propiedades son Status y Text.
            </>,
            <>
              <strong>Status:</strong> Icon single (48 × 48 px, solo ícono) o With text (48 px de alto y ancho según el texto). En código, sin <code>children</code> es solo ícono y con <code>children</code> es extendido.
            </>,
            <>
              <strong>Text:</strong> es el texto del botón extendido y en código es <code>children</code>. El ícono es una instancia de Icon-sizes y en código se elige con <code>icon</code>.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja Hover, Press ni Focus; el código los agrega con <code>state</code>. Figma pone el texto en Medium y el código usa Semibold. Para una acción rectangular usa el componente Button.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el FloatButton es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Acción principal de la pantalla:</strong> crear, agregar o redactar, siempre a la vista mientras el contenido se desplaza.
            </>,
            <>
              <strong>Solo ícono:</strong> cuando la acción es conocida (agregar, editar). Lleva <code>aria-label</code> que nombra la acción.
            </>,
            <>
              <strong>Extendido:</strong> cuando el ícono solo no basta. El texto es el nombre accesible.
            </>,
            <>
              <strong>Posición definida por quien lo usa:</strong> el componente no se fija solo. Pásale <code>className=&quot;fixed bottom-6 right-6&quot;</code> o el equivalente de tu diseño.
            </>,
          ],
          avoid: [
            <>
              <strong>Varias acciones flotantes:</strong> compiten entre sí. (Alternativa: un solo FloatButton y el resto en <code>Button</code>).
            </>,
            <>
              <strong>Acciones secundarias o destructivas:</strong> no merecen estar siempre a la vista. (Alternativa: <code>Button</code> en la barra o el contenido de la página).
            </>,
            <>
              <strong>Navegar a otra página:</strong> es un <code>button</code> y no admite <code>href</code>. (Alternativa: <code>Button</code> con <code>href</code>).
            </>,
            <>
              <strong>Tapar contenido o controles:</strong> flota sobre lo que haya debajo. (Alternativa: reserva un margen al final de la página).
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
                title: 'Solo ícono',
                bullets: [
                  <>
                    <strong>48 × 48 px</strong> con padding de 12 px.
                  </>,
                  <>
                    <strong>Ícono de 24 px</strong> centrado en el círculo.
                  </>,
                ],
                preview: single(),
              },
              {
                title: 'Extendido',
                bullets: [
                  <>
                    <strong>48 px de alto,</strong> padding X de 24 px y padding Y de 8 px.
                  </>,
                  <>
                    <strong>Texto de 14 px,</strong> con 10 px entre ícono y texto.
                  </>,
                ],
                preview: extended(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Extendido:</strong> padding X de 20 px y texto de 16 px (tokens responsive de Mobile).
              </>,
              <>
                <strong>Solo ícono:</strong> 48 × 48 px, igual que en Desktop.
              </>,
              <>
                <strong>Ancho:</strong> el botón extendido se ajusta al texto y no ocupa todo el ancho.
              </>,
            ],
            preview: both(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Extendido:</strong> padding X de 24 px y texto de 14 px, los mismos valores que Desktop.
              </>,
              <>
                <strong>Solo ícono:</strong> 48 × 48 px, igual que en Desktop.
              </>,
              <>
                <strong>Posición:</strong> no cambia por breakpoint; la define quien lo usa.
              </>,
            ],
            preview: both(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de cantidad, texto y posición del FloatButton.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Una acción flotante',
              description: 'Deja un solo FloatButton por vista, con la acción principal.',
              preview: single(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Varias acciones flotantes',
              description: 'No apiles varios FloatButton: compiten por la atención.',
              preview: (
                <div className="flex items-center gap-ds-space-general-md">
                  {single()}
                  {single({ icon: 'edit', 'aria-label': 'Editar' })}
                  {single({ icon: 'heart', 'aria-label': 'Favoritos' })}
                </div>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Texto corto',
              description: 'Usa un verbo en infinitivo, de una a tres palabras, que nombre la acción.',
              preview: extended({}, 'Agregar tarea'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto largo',
              description: 'No escribas frases largas: el botón crece y tapa más contenido.',
              preview: extended({}, 'Crear tarea nueva ahora'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Con margen al borde',
              description: <>Separa el botón del borde, por ejemplo <code>bottom-6 right-6</code> (24 px), para que no se corte.</>,
              preview: (
                <div className="relative h-28 w-56 max-w-full border border-ds-border-general-gray-fourth rounded-ds-radius-general-md bg-ds-background-general-black">
                  <FloatButton icon="add" aria-label="Crear" className="absolute right-6 bottom-6" />
                </div>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Pegado al borde',
              description: 'No lo pegues al borde de la pantalla: se corta y se confunde con el sistema.',
              preview: (
                <div className="relative h-28 w-56 max-w-full border border-ds-border-general-gray-fourth overflow-hidden rounded-ds-radius-general-md bg-ds-background-general-black">
                  <FloatButton icon="add" aria-label="Crear" className="absolute right-0 bottom-0" />
                </div>
              ),
            },
          ],
        },
      ],
    },
  ],
};
