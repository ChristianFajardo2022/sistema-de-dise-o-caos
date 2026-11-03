import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Radio } from './Radio';

/*
 * Contenido de la página de documentación de Radio (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Radio.types.ts`, `Radio.variants.ts`, `Radio.tsx`), luego `Radio.docs.json`. Medidas: control de 16 px, anillo de
 * 1.5 px, hueco de Select de 6.4 px, punto de Disabled Select de unos 8 px y gap de 8 px con el texto; no cambian entre
 * breakpoints. Diferencias con Figma: Figma no dibuja el foco ni agrupa; el código agrega un contorno de 2 px y el
 * agrupado nativo con `name`. Figma pide tokens de trazo y de texto deshabilitado que no existen en `tokens.css`.
 */

// Figma: 9545:6413 (component set Selection, sin texto) y 9558:6975 (component set Selection, con texto)

type RadioProps = Partial<ComponentProps<typeof Radio>>;

/** Radio de ejemplo con texto. Sin `name`: las muestras no se agrupan entre sí. */
const radio = (props: RadioProps = {}, label: ReactNode = 'Correo') => <Radio {...props}>{label}</Radio>;

/** Solo el control, con nombre accesible. */
const bare = (props: RadioProps = {}) => <Radio aria-label="Correo" {...props} />;

/** Fila de ejemplos: el marco no tiene separación entre hijos. */
const wideRow = (...items: ReactNode[]) => (
  <div className="flex items-center gap-ds-primitives-space-6xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Columna de opciones. */
const column = (...items: ReactNode[]) => (
  <div className="flex flex-col gap-ds-space-general-lg">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Superficie inversa a la del tema (clara en oscuro, oscura en claro), donde va Negative. */
const onInverse = (children: ReactNode) => (
  <div className="rounded-ds-radius-general-md bg-ds-background-general-white p-ds-space-general-xl">{children}</div>
);

/** Lista de opciones con los cuatro estados forzados, para las vistas de breakpoints. */
const options = () =>
  column(
    radio({ state: 'select' }, 'Correo'),
    radio({ state: 'default' }, 'Mensaje'),
    radio({ state: 'default' }, 'Llamada para confirmar los datos')
  );

/** Muestras de un estado: Positive sobre la superficie del tema y Negative sobre la inversa. */
const stateSamples = (state: NonNullable<RadioProps['state']>): ReactNode[] => [
  radio({ state }),
  onInverse(radio({ state, contrast: 'negative' })),
];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Opción sin elegir. Anillo de 1.5 px y el interior vacío.',
    samples: stateSamples('default'),
  },
  {
    label: 'Select',
    tone: 'accent',
    description: 'Opción elegida. Disco con un hueco transparente de 6.4 px y el color de campo activo.',
    samples: stateSamples('select'),
  },
  {
    label: 'Disabled Default',
    tone: 'neutral',
    description: 'Opción sin elegir y no disponible. Anillo y texto atenuados; no recibe foco ni se puede elegir.',
    samples: stateSamples('disabled-default'),
  },
  {
    label: 'Disabled Select',
    tone: 'neutral',
    description: 'Opción elegida y no disponible. Anillo de 1.5 px con un punto de unos 8 px, atenuados.',
    samples: stateSamples('disabled-select'),
  },
];

export const doc: ComponentDocContent = {
  name: 'Radio',
  icon: 'record-circle',
  classification: 'atomo',
  summary:
    'El Radio es el átomo para elegir una sola opción dentro de un grupo. Es un control circular de 16 px, con o sin texto, en dos contrastes y cuatro estados: sin elegir, elegido y sus dos versiones deshabilitadas.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila con un control circular y, si lo hay, su texto. El control es un input nativo oculto; el círculo es su dibujo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Radio con texto',
                  preview: radio({ state: 'default' }, 'Correo'),
                  marks: [
                    { n: 1, selector: 'label', side: 'left' },
                    { n: 2, selector: 'label > span[aria-hidden="true"]', side: 'top' },
                    { n: 3, selector: 'label > span:not([aria-hidden])', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: 'label > span[aria-hidden="true"]', to: 'label > span:not([aria-hidden])' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila:</strong> una etiqueta que envuelve el control y el texto; un clic en cualquiera de los dos elige la opción. Separa el control del texto con un gap de 8 px (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Control:</strong> círculo de 16 × 16 px sobre un input nativo oculto pero accesible. El foco de teclado dibuja un contorno de 2 px (<code>border/field/active</code>) que Figma no define.
                </>,
                <>
                  <strong>Texto:</strong> 16 px con interlineado de 20 px, tipografía principal regular. Es opcional: sin texto, pasa <code>aria-label</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Dibujo del control',
                  preview: wideRow(bare({ state: 'default' }), bare({ state: 'select' }), bare({ state: 'disabled-select' })),
                  marks: [
                    { n: 1, selector: 'label > span[aria-hidden="true"]', index: 0, side: 'top' },
                    { n: 2, selector: 'label > span[aria-hidden="true"]', index: 1, side: 'top' },
                    { n: 3, selector: 'label > span[aria-hidden="true"]', index: 2, side: 'top' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'label > span[aria-hidden="true"]', index: 0 }],
                },
              ],
              guidelines: [
                <>
                  <strong>Anillo:</strong> trazo interior de 1.5 px (<code>stroke/xl</code>) y el centro vacío. Es el dibujo de Default y de Disabled Default.
                </>,
                <>
                  <strong>Disco con hueco:</strong> círculo relleno con un hueco transparente de 6.4 px de diámetro. Es el dibujo de Select.
                </>,
                <>
                  <strong>Anillo con punto:</strong> anillo de 1.5 px y un punto central de unos 8 px. Es el dibujo de Disabled Select.
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
          Radio tiene 4 estados. Se fuerzan con <code>state</code> solo para documentar; en uso salen de <code>checked</code> y <code>disabled</code>. No existe un estado Hover: solo cambia el cursor. El foco de teclado no tiene estado forzado: dibuja un contorno de 2 px. Cada columna muestra Positive y, sobre la superficie inversa del tema, Negative.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default de cada contraste, más los que aparecen en otros estados. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Positive',
              preview: column(radio({ state: 'default' }), radio({ state: 'select' })),
              entries: [
                { part: 'Anillo', color: 'background-field-surface-tertiary' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Foco', color: 'border-field-active' },
                { part: 'Disco (aparece en Select)', color: 'background-field-active-high-contrast' },
                { part: 'Anillo y punto (aparece en Disabled)', color: 'background-field-disabled' },
                { part: 'Texto (aparece en Disabled Default)', color: 'text-neutral-disabled-on-canva' },
                { part: 'Texto (aparece en Disabled Select)', color: 'text-neutral-disabled-on-card' },
              ],
            },
            {
              title: 'Negative',
              preview: onInverse(column(radio({ state: 'default', contrast: 'negative' }), radio({ state: 'select', contrast: 'negative' }))),
              entries: [
                { part: 'Anillo', color: 'background-field-active-slow-contrast' },
                { part: 'Texto', color: 'text-neutral-black', text: 'typography-field-size-md' },
                { part: 'Foco', color: 'border-field-active' },
                { part: 'Disco (aparece en Select)', color: 'background-field-active-slow-contrast' },
                { part: 'Anillo y punto (aparece en Disabled)', color: 'background-field-disabled-negative' },
                { part: 'Texto (aparece en Disabled)', color: 'text-neutral-disabled-on-card' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Radio en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Selection en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type, State, Contrast y Text. El set se comparte con Checkbox: elige Type en Radio button.
            </>,
            <>
              <strong>State y Contrast:</strong> Default, Disabled Default, Select o Disabled Select (<code>state</code>), y Positive o Negative (<code>contrast</code>). En código el estado sale de <code>checked</code> y <code>disabled</code>; <code>state</code> solo lo fuerza.
            </>,
            <>
              <strong>Text y Text description:</strong> activa Text para mostrar la etiqueta y escribe su contenido en Text description. En código es el hijo del componente (<code>children</code>).
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> el foco con teclado ni el agrupado de opciones (<code>name</code>); el código agrega ambos. Dos variables de Figma no existen en <code>tokens.css</code>: <code>color/border/container/Primary</code> (trazo del anillo) y <code>color/text/field/placeholder/disabled</code> (texto de Disabled Select). El código usa los tokens de campo más cercanos.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Radio es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Elegir una opción entre varias:</strong> agrupa dos o más Radio con el mismo <code>name</code>. Solo una queda elegida y elegir otra desmarca la anterior.
            </>,
            <>
              <strong>Grupo con nombre:</strong> envuelve las opciones en un <code>role=&quot;radiogroup&quot;</code> con <code>aria-label</code> que diga qué se elige.
            </>,
            <>
              <strong>Teclado:</strong> las flechas mueven la selección dentro del grupo y omiten las opciones deshabilitadas. Tab entra al grupo y sale de él.
            </>,
            <>
              <strong>Opción no disponible:</strong> usa <code>disabled</code> para mostrarla sin que se pueda elegir.
            </>,
            <>
              <strong>Superficie inversa al tema:</strong> usa <code>contrast=&quot;negative&quot;</code>; <code>positive</code> es para la superficie del tema.
            </>,
          ],
          avoid: [
            <>
              <strong>Elegir varias opciones:</strong> un Radio no se puede desmarcar al pulsarlo. (Alternativa: <code>Checkbox</code>).
            </>,
            <>
              <strong>Activar o desactivar un ajuste:</strong> es una sola opción con efecto inmediato. (Alternativa: <code>Switch</code>).
            </>,
            <>
              <strong>Muchas opciones:</strong> una lista larga ocupa mucho espacio. (Alternativa: <code>Select</code>).
            </>,
            <>
              <strong>Radio sin nombre accesible:</strong> el círculo solo no dice qué opción es. (Alternativa: pasa texto o <code>aria-label</code>).
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
                title: 'Radio con texto',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas:</strong> control de 16 × 16 px, gap de 8 px y texto de 16 px con interlineado de 20 px.
                  </>,
                ],
                preview: options(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas:</strong> control de 16 × 16 px y gap de 8 px, con tipografía de 16 px.
              </>,
              <>
                <strong>Texto largo:</strong> pasa a otra línea y el control queda centrado en vertical.
              </>,
            ],
            preview: options(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas:</strong> control de 16 × 16 px y gap de 8 px, con tipografía de 16 px.
              </>,
              <>
                <strong>Texto largo:</strong> pasa a otra línea y el control queda centrado en vertical.
              </>,
            ],
            preview: options(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de agrupado, contraste y texto del Radio.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Opciones con name',
              description: (
                <>
                  Une las opciones con el mismo <code>name</code>: solo una queda elegida.
                </>
              ),
              preview: column(
                radio({ name: 'doc-do-contacto', defaultChecked: true }, 'Correo'),
                radio({ name: 'doc-do-contacto' }, 'Mensaje'),
                radio({ name: 'doc-do-contacto' }, 'Llamada')
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Opciones sin name',
              description: (
                <>
                  No dejes radios sin <code>name</code>: se pueden elegir varios a la vez.
                </>
              ),
              preview: column(
                radio({ defaultChecked: true }, 'Correo'),
                radio({ defaultChecked: true }, 'Mensaje'),
                radio({}, 'Llamada')
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Contraste según la superficie',
              description: (
                <>
                  Usa <code>contrast=&quot;negative&quot;</code> sobre la superficie inversa al tema.
                </>
              ),
              preview: onInverse(radio({ state: 'select', contrast: 'negative' }, 'Correo')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Contraste invertido',
              description: (
                <>
                  No uses <code>positive</code> sobre la superficie inversa al tema: el control y el texto se pierden.
                </>
              ),
              preview: onInverse(radio({ state: 'select', contrast: 'positive' }, 'Correo')),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Opción con texto',
              description: 'Escribe el texto de cada opción junto al círculo.',
              preview: column(radio({ state: 'select' }, 'Correo'), radio({ state: 'default' }, 'Mensaje')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Solo el círculo',
              description: 'No dejes el círculo solo: sin texto visible no se sabe qué opción es.',
              preview: wideRow(bare({ state: 'select', 'aria-label': 'Correo' }), bare({ state: 'default', 'aria-label': 'Mensaje' })),
            },
          ],
        },
      ],
    },
  ],
};
