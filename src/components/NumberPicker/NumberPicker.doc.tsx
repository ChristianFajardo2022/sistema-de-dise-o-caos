import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { NumberPicker } from './NumberPicker';

/*
 * Contenido de la página de documentación de NumberPicker (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`NumberPicker.types.ts`, `NumberPicker.variants.ts`, `NumberPicker.tsx`), luego `NumberPicker.docs.json`. Medidas: alto 56
 * (sm) y 48 (md), padding X de 16, padding Y y gap de 8 en Desktop y Tablet (4 en Mobile), radio completo, trazo interior de
 * 1 px, botones Button tertiary xs de 32 con ícono de 20 px y valor de 14/18 centrado. Diferencias con Figma: Figma no dibuja
 * label, mensaje ni tooltip; en Burnt-In y Disabled el código deshabilita los botones y Figma los deja con el color de reposo.
 */

// Figma: 12609:18389 (component set Number picker)

type PickerProps = Partial<ComponentProps<typeof NumberPicker>>;

/** NumberPicker de ejemplo: nombre accesible y valor reales. */
const picker = (props: PickerProps = {}) => <NumberPicker aria-label="Personas" min={1} max={8} defaultValue={4} {...props} />;

/** Pila de campos de ejemplo. */
const stack = (...items: ReactNode[]) => (
  <div className="flex w-full flex-col items-center gap-ds-space-general-xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo y campo vacío. El borde es el neutro de formulario y los botones − y + están disponibles.',
    samples: [picker({ defaultValue: undefined })],
  },
  {
    label: 'Filled',
    tone: 'neutral',
    description: (
      <>
        Con valor. Se ve igual que Default: el borde no cambia. Sale del valor; <code>state</code> solo lo fuerza.
      </>
    ),
    samples: [picker({ state: 'filled' })],
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: 'Con foco en el campo. El borde pasa al color activo. Sale del foco real.',
    samples: [picker({ state: 'active' })],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Fondo y valor atenuados, y los botones quedan deshabilitados. Se puede enfocar.
      </>
    ),
    samples: [picker({ readOnly: true })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        No editable ni enfocable (<code>disabled</code>). Borde y valor atenuados, y los botones deshabilitados.
      </>
    ),
    samples: [picker({ disabled: true })],
  },
];

export const doc: ComponentDocContent = {
  name: 'NumberPicker',
  icon: 'add-2',
  classification: 'molecula',
  summary:
    'El NumberPicker es la molécula para elegir una cantidad pequeña, con los botones − y + o escribiéndola. Une un campo numérico, dos botones y un mensaje opcional. Admite valor mínimo y máximo, pasos decimales y un teclado completo.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una píldora con el valor al centro y un botón a cada lado, y un mensaje opcional debajo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Campo con ayuda',
                  preview: picker({ helperText: 'Máximo 8 personas' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Input"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Button"]', index: 0, side: 'top' },
                    { n: 3, selector: 'input', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Button"]', index: 1, side: 'top' },
                    { n: 5, selector: '[aria-live="polite"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Input"]', side: 'left' },
                    { kind: 'height', selector: '[data-figma-part="Input"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> píldora de 56 de alto en <code>sm</code> y 48 en <code>md</code>. Padding de 16 a los lados (<code>space/general/2xl</code>) y de 8 arriba y abajo (<code>space/field/sm</code>), radio completo (<code>radius/general/full</code>) y trazo interior de 1 px.
                </>,
                <>
                  <strong>Botón −:</strong> Button tertiary xs de solo ícono, de 32 con el ícono <code>minus</code> de 20 px. Baja el valor un <code>step</code> y se deshabilita al llegar al mínimo.
                </>,
                <>
                  <strong>Valor:</strong> es el <code>&lt;input&gt;</code> nativo con <code>role=&quot;spinbutton&quot;</code>, centrado y en 14/18. Se puede escribir en él. Entre las partes hay 8 desde Tablet y 4 en Mobile (<code>space/field/sm</code>).
                </>,
                <>
                  <strong>Botón +:</strong> el mismo Button con el ícono <code>add-2</code>. Sube el valor un <code>step</code> y se deshabilita al llegar al máximo.
                </>,
                <>
                  <strong>Mensaje:</strong> opcional, debajo del campo y a 8 de distancia. Es ayuda, éxito o error, y se anuncia en una región viva.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños sm y md',
                  preview: stack(picker({ size: 'sm' }), picker({ size: 'md' })),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Input"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Input"]', index: 1, side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Input"]', index: 0 },
                    { kind: 'height', selector: '[data-figma-part="Input"]', index: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Size sm:</strong> 56 de alto y es el tamaño por defecto.
                </>,
                <>
                  <strong>Size md:</strong> 48 de alto, con los mismos botones, padding X y tipografía. En el archivo de Figma los nombres de tamaño son estos.
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
          NumberPicker tiene 5 estados. Filled y Active/Focus se fuerzan con <code>state</code> solo para documentar; en uso salen del valor y del foco. El campo no tiene Hover: solo los botones reaccionan al puntero.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default y de los que cambian en cada estado. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Default',
              preview: picker({ defaultValue: undefined }),
              entries: [
                { part: 'Borde', color: 'border-field-disabled' },
                { part: 'Valor', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Ícono de los botones', color: 'icon-button-tertiary-default' },
              ],
            },
            {
              title: 'Active/Focus',
              preview: picker({ state: 'active' }),
              entries: [{ part: 'Borde', color: 'border-field-active' }],
            },
            {
              title: 'Burnt-In',
              preview: picker({ readOnly: true }),
              entries: [
                { part: 'Fondo', color: 'background-field-burnt-in' },
                { part: 'Borde', color: 'border-field-disabled' },
                { part: 'Valor', color: 'text-field-disabled-positive', text: 'typography-field-size-sm' },
              ],
            },
            {
              title: 'Disabled',
              preview: picker({ disabled: true }),
              entries: [
                { part: 'Borde', color: 'border-field-disabled' },
                { part: 'Valor', color: 'text-field-disabled-positive', text: 'typography-field-size-sm' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente NumberPicker en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Number picker en la librería de Assets y arrástralo al lienzo. Sus propiedades son State, Size y Text placeholder, que es el texto del valor.
            </>,
            <>
              <strong>Size:</strong> sm y md (<code>size</code> con <code>sm</code> y <code>md</code>). Miden 56 y 48 de alto.
            </>,
            <>
              <strong>State:</strong> Default, Filled, Active/Focus, Burnt-In y Disabled. En código salen del uso: <code>readOnly</code> da Burnt-In y <code>disabled</code> da Disabled. <code>state</code> solo fuerza el aspecto.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja nombre, mensaje ni tooltip; el código los suma con <code>aria-label</code>, <code>helperText</code>, <code>errorText</code>, <code>successText</code> y <code>tooltip</code>. En Burnt-In y Disabled Figma deja los botones con el color de reposo; el código los deshabilita.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el NumberPicker es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Cantidad pequeña:</strong> personas, unidades o noches, que se ajustan de uno en uno con los botones.
            </>,
            <>
              <strong>Valor con límites:</strong> <code>min</code> y <code>max</code> deshabilitan el botón del extremo sin quitar el foco al campo.
            </>,
            <>
              <strong>Pasos decimales:</strong> <code>step</code> define el incremento, por ejemplo 0.5. RePág y AvPág mueven <code>largeStep</code>, que por defecto es 10 × <code>step</code>.
            </>,
            <>
              <strong>Ajustar o escribir:</strong> las flechas suben y bajan, Inicio y Fin llevan a los límites, y el texto escrito se acota al salir del campo o con Enter.
            </>,
          ],
          avoid: [
            <>
              <strong>Rango amplio:</strong> cientos de pasos hacen tediosos los botones. (Alternativa: <code>Slider</code>).
            </>,
            <>
              <strong>Dato que no es una cantidad:</strong> celulares, códigos o textos. (Alternativa: <code>Input</code> o <code>PhoneInput</code>).
            </>,
            <>
              <strong>Elegir entre opciones con nombre:</strong> un número no describe cada opción. (Alternativa: <code>Select</code>).
            </>,
            <>
              <strong>Campo sin nombre accesible:</strong> no trae label visible, así que <code>aria-label</code> o <code>aria-labelledby</code> es obligatorio.
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
                title: 'Size sm',
                bullets: [
                  <>
                    <strong>Alto:</strong> 56, con padding de 16 a los lados y de 8 arriba y abajo.
                  </>,
                  <>
                    <strong>Ancho:</strong> 320 por defecto; con <code>fullWidth</code> ocupa el 100% del contenedor.
                  </>,
                ],
                preview: picker({ size: 'sm' }),
              },
              {
                title: 'Size md',
                bullets: [
                  <>
                    <strong>Alto:</strong> 48, con el mismo padding, botones y tipografía.
                  </>,
                  <>
                    <strong>Espacio entre partes:</strong> 8 entre los botones y el valor.
                  </>,
                ],
                preview: picker({ size: 'md' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Alto:</strong> no cambia, 56 en <code>sm</code> y 48 en <code>md</code>.
              </>,
              <>
                <strong>Espacio interior:</strong> el padding vertical y el espacio entre partes bajan a 4 (<code>space/field/sm</code>).
              </>,
              <>
                <strong>Ancho:</strong> 320 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: stack(picker({ size: 'sm' }), picker({ size: 'md' })),
          },
          tablet: {
            bullets: [
              <>
                <strong>Alto:</strong> 56 en <code>sm</code> y 48 en <code>md</code>, como en Desktop.
              </>,
              <>
                <strong>Espacio interior:</strong> padding vertical y espacio entre partes de 8, como en Desktop.
              </>,
              <>
                <strong>Ancho:</strong> 320 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: stack(picker({ size: 'sm' }), picker({ size: 'md' })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de límites, mensajes y rango del NumberPicker.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Mínimo definido',
              description: 'Con min, el botón − se deshabilita en el límite y no deja valores imposibles.',
              preview: picker({ defaultValue: 1 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Sin mínimo',
              description: 'Sin min, el botón − sigue activo y llega a valores negativos sin sentido.',
              preview: picker({ defaultValue: -1, min: undefined }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error con el rango',
              description: 'Con los valores aceptados en el mensaje, se corrige sin adivinar.',
              preview: picker({ defaultValue: 9, errorText: 'Elige entre 1 y 8 personas' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error vago',
              description: 'Un mensaje genérico no dice qué cambiar.',
              preview: picker({ defaultValue: 9, errorText: 'Valor no válido' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Rango corto',
              description: 'Con pocas unidades, los botones llegan al valor en pocos toques.',
              preview: picker({ defaultValue: 3, min: 1, max: 10 }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Rango amplio',
              description: 'Cientos de pasos hacen tediosos los botones: usa un Slider.',
              preview: picker({ defaultValue: 1500, min: 0, max: 2000 }),
            },
          ],
        },
      ],
    },
  ],
};
