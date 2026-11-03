import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { InlineField } from './InlineField';

/*
 * Contenido de la página de documentación de InlineField (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`InlineField.types.ts`, `InlineField.variants.ts`, `InlineField.tsx`), luego `InlineField.docs.json`. Medidas: alto 40
 * en sm y 56 en md, sin borde ni fondo, label de 12/16 arriba y valor de 14/18 en sm; en md el valor es de 32/36 en
 * Desktop y Tablet y de 24/28 en Mobile. Chip con radio completo, padding de 8 a los lados y gap de 4 (sm) u 8 (md).
 * Diferencias con Figma: Figma no tiene Hover ni dibuja el foco (el código suma un contorno de 2 px); Help text es una
 * propiedad booleana sin nodo en ninguna variante; Inactive=O parece un error de nombre y se trata como Inactive=On;
 * Type no existe como prop en código (depende de `placeholder` y `suffix`).
 */

// Figma: 18445:46293 (component set Text field 2)

type FieldProps = Partial<ComponentProps<typeof InlineField>>;

/** Campo de ejemplo: label real, sin el nombre del componente como texto. */
const field = (props: FieldProps = {}) => <InlineField label="Altura" {...props} />;

/** Campo con chip y placeholder (Type=Label+Placeholder en Figma). */
const chipField = (props: FieldProps = {}) => field({ placeholder: '170', suffix: 'cm', ...props });

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
    description: 'Reposo. Vacío y sin foco, el label va dentro del campo, sin recuadro ni fondo.',
    samples: [field()],
  },
  {
    label: 'Active/Filled',
    tone: 'accent',
    description: (
      <>
        Con foco o valor. El label sube y el placeholder se ve. El foco real suma un contorno de 2 px; <code>state</code> solo fuerza el aspecto.
      </>
    ),
    samples: [chipField({ state: 'active', defaultValue: '172' })],
  },
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Con <code>successText</code>. El label arriba pasa a verde y el mensaje queda debajo.
      </>
    ),
    samples: [chipField({ defaultValue: '172', successText: 'Altura guardada' })],
  },
  {
    label: 'Success placeholder',
    tone: 'success',
    description: (
      <>
        El valor en verde y el label neutro. Solo se logra con <code>state=&quot;success-value&quot;</code>.
      </>
    ),
    samples: [chipField({ state: 'success-value', defaultValue: '172' })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>errorText</code>. El label arriba pasa a rojo, <code>aria-invalid</code> y el mensaje debajo. Gana sobre éxito y ayuda.
      </>
    ),
    samples: [chipField({ defaultValue: '17a', errorText: 'Escribe solo números' })],
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        No editable ni enfocable (<code>disabled</code>). Label, valor y chip atenuados.
      </>
    ),
    samples: [chipField({ disabled: true, defaultValue: '172' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'InlineField',
  icon: 'edit',
  classification: 'molecula',
  summary:
    'El InlineField es la molécula para escribir un dato corto, como una cifra con su unidad, en un campo sin recuadro. Une un label flotante, el valor y un chip opcional a la derecha, con un mensaje de ayuda, éxito o error debajo.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un label flotante y el valor apilados, un chip opcional a su derecha y un mensaje debajo. No tiene borde ni fondo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Tamaño sm con chip',
                  preview: chipField({ className: 'w-56', optional: true, state: 'active', defaultValue: '172' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Text field"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Label"]', side: 'top' },
                    { n: 3, selector: 'input', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Container text"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Text field"]', to: '[data-figma-part="Container text"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Campo:</strong> sin borde ni fondo, de 40 de alto en sm. El label, el valor y el chip comparten una fila, con 4 de separación (<code>space/general/md</code>).
                </>,
                <>
                  <strong>Label:</strong> siempre visible y asociado al campo. Vacío y sin foco va dentro, en 14/18; con foco o valor sube a 12/16. <code>optional</code> suma &quot; | Opcional&quot;.
                </>,
                <>
                  <strong>Valor:</strong> es el <code>&lt;input&gt;</code> nativo, en 14/18 (<code>typography/field/size/sm</code>), debajo del label.
                </>,
                <>
                  <strong>Chip:</strong> opcional (<code>suffix</code>), una unidad o etiqueta corta. Radio completo, padding de 8 a los lados y texto de 12/16. Se enlaza al campo con <code>aria-describedby</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños sm y md',
                  preview: stack(
                    field({ className: 'w-56', state: 'active', defaultValue: '172' }),
                    field({ className: 'w-56', label: 'Peso', size: 'md', state: 'active', defaultValue: '72' })
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Text field"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Text field"]', index: 1, side: 'left' },
                    { n: 3, selector: 'input', index: 1, side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Label"]', index: 1, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Text field"]', index: 0 },
                    { kind: 'height', selector: '[data-figma-part="Text field"]', index: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>sm:</strong> 40 de alto, valor de 14/18 y 4 de separación hasta el chip. Es el tamaño por defecto.
                </>,
                <>
                  <strong>md:</strong> 56 de alto y 8 de separación (<code>space/general/lg</code>) hasta el chip.
                </>,
                <>
                  <strong>Valor en md:</strong> grande, de 32/36 en Desktop y Tablet y de 24/28 en Mobile (<code>typography/field/size/3xl</code>). Pensado para cifras.
                </>,
                <>
                  <strong>Label en md:</strong> de 12/16 arriba, igual que en sm. El chip va alineado abajo con la cifra, con padding de 4 arriba y abajo.
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
          InlineField tiene 6 estados. Active/Filled y Success placeholder se fuerzan con <code>state</code> solo para documentar; en uso salen del foco, el valor y los mensajes. No tiene Hover.
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
              preview: chipField({ optional: true, state: 'active', defaultValue: '172' }),
              entries: [
                { part: 'Label dentro del campo', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Label arriba (con valor)', color: 'text-field-label-secondary', text: 'typography-field-size-xs' },
                { part: 'Valor y placeholder', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: 'Valor en md', color: 'text-field-placeholder', text: 'typography-field-size-3xl' },
                { part: '| Opcional', color: 'text-acent-firts' },
                { part: 'Fondo del chip', color: 'background-general-gray-seventh' },
                { part: 'Texto del chip', color: 'text-field-placeholder', text: 'typography-field-size-xs' },
                { part: 'Contorno (aparece con foco)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Success',
              preview: chipField({ defaultValue: '172', successText: 'Altura guardada' }),
              entries: [
                { part: 'Label arriba', color: 'text-semantic-success-secondary' },
                { part: 'Mensaje', color: 'text-semantic-success-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-success-secondary' },
              ],
            },
            {
              title: 'Success placeholder',
              preview: chipField({ state: 'success-value', defaultValue: '172' }),
              entries: [
                { part: 'Label arriba', color: 'text-field-label-secondary' },
                { part: 'Valor', color: 'text-semantic-success-secondary', text: 'typography-field-size-sm' },
              ],
            },
            {
              title: 'Error',
              preview: chipField({ defaultValue: '17a', errorText: 'Escribe solo números' }),
              entries: [
                { part: 'Label arriba', color: 'text-semantic-error-secondary' },
                { part: 'Mensaje', color: 'text-semantic-error-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-error-firts' },
              ],
            },
            {
              title: 'Inactive',
              preview: chipField({ disabled: true, defaultValue: '172' }),
              entries: [
                { part: 'Label y valor', color: 'text-field-disabled-negative' },
                { part: '| Opcional', color: 'text-field-disabled-negative' },
                { part: 'Fondo del chip', color: 'background-container-disabled-on-canva' },
                { part: 'Texto del chip', color: 'text-field-disabled-positive' },
              ],
            },
            {
              title: 'Mensaje de ayuda (helperText)',
              preview: chipField({ defaultValue: '172', helperText: 'Sin decimales' }),
              entries: [
                { part: 'Mensaje', color: 'text-semantic-information-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-information-secondary' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente InlineField en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Text field 2 en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type, State, Size e Inactive; el label y el placeholder se editan como texto de la instancia.
            </>,
            <>
              <strong>Type y Size:</strong> Label trae solo el label; Label+Placeholder suma placeholder y chip. En código no hay <code>Type</code>: depende de si pasas <code>placeholder</code> y <code>suffix</code>. Size es <code>size</code> con <code>sm</code> y <code>md</code>.
            </>,
            <>
              <strong>State e Inactive:</strong> Default, Active/Filled, Success, Success placeholder y Error. <code>state</code> fuerza Default, Active/Filled y Success placeholder; Success y Error salen de <code>successText</code> y <code>errorText</code>. Inactive=On es <code>disabled</code>. Inactive=O, que solo existe en Active/Filled md, parece un error de nombre y el código lo trata como On.
            </>,
            <>
              <strong>Diferencias:</strong> Help text es una propiedad booleana sin nodo en ninguna variante; en código es <code>helperText</code> y va debajo del campo. Figma no dibuja el foco; el código suma un contorno de 2 px.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el InlineField es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Dato corto con unidad:</strong> una cifra con su medida, como altura en cm o peso en kg. El chip (<code>suffix</code>) deja la unidad junto al valor.
            </>,
            <>
              <strong>Cifra que debe destacar:</strong> con <code>size=&quot;md&quot;</code> el valor se ve grande. Para cifras, pasa <code>inputMode</code> y el teclado móvil se ajusta.
            </>,
            <>
              <strong>Edición dentro de una tarjeta o una fila:</strong> donde un recuadro estorba y basta el label flotante.
            </>,
            <>
              <strong>Validar con mensaje:</strong> <code>errorText</code> pone <code>aria-invalid</code> y se enlaza con <code>aria-describedby</code>; el error gana sobre éxito y ayuda.
            </>,
            <>
              <strong>Campo no obligatorio o con ayuda extra:</strong> <code>optional</code> suma &quot; | Opcional&quot; y <code>tooltip</code> agrega un texto de apoyo fuera del campo.
            </>,
          ],
          avoid: [
            <>
              <strong>Formulario largo de datos variados:</strong> sin recuadro, el área de escritura solo se nota con foco. (Alternativa: <code>Input</code>).
            </>,
            <>
              <strong>Texto de varias líneas:</strong> comentarios o descripciones largas. (Alternativa: <code>Textarea</code>).
            </>,
            <>
              <strong>Elegir entre opciones:</strong> escribir libre invita a errores. (Alternativa: <code>Select</code>).
            </>,
            <>
              <strong>Cantidad que sube y baja de a poco:</strong> el InlineField no tiene botones de más y menos. (Alternativa: <code>NumberPicker</code>).
            </>,
            <>
              <strong>Chip con frases:</strong> el chip es una unidad o una etiqueta corta; una frase le quita espacio al valor.
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
                title: 'Tamaño sm',
                bullets: [
                  <>
                    <strong>Alto:</strong> 40, con label de 12/16 arriba y valor de 14/18.
                  </>,
                  <>
                    <strong>Texto:</strong> igual en todos los breakpoints.
                  </>,
                ],
                preview: chipField({ state: 'active', defaultValue: '172' }),
              },
              {
                title: 'Tamaño md',
                bullets: [
                  <>
                    <strong>Alto:</strong> 56, con valor de 32/36 y chip a 8 de separación.
                  </>,
                  <>
                    <strong>Ancho:</strong> 320 por defecto; con <code>fullWidth</code> ocupa el 100% del contenedor.
                  </>,
                ],
                preview: chipField({ label: 'Peso', size: 'md', state: 'active', defaultValue: '72', placeholder: '70', suffix: 'kg' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Alto:</strong> 40 en sm y 56 en md, igual que en Desktop.
              </>,
              <>
                <strong>Valor en md:</strong> baja a 24/28; en sm no cambia, con label de 12/16 y valor de 14/18.
              </>,
              <>
                <strong>Ancho:</strong> 320 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: stack(
              chipField({ state: 'active', defaultValue: '172' }),
              chipField({ label: 'Peso', size: 'md', state: 'active', defaultValue: '72', placeholder: '70', suffix: 'kg' })
            ),
          },
          tablet: {
            bullets: [
              <>
                <strong>Alto:</strong> 40 en sm y 56 en md, como en Desktop.
              </>,
              <>
                <strong>Valor en md:</strong> 32/36; en sm no cambia, con label de 12/16 y valor de 14/18.
              </>,
              <>
                <strong>Ancho:</strong> 320 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: stack(
              chipField({ state: 'active', defaultValue: '172' }),
              chipField({ label: 'Peso', size: 'md', state: 'active', defaultValue: '72', placeholder: '70', suffix: 'kg' })
            ),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas del chip, los mensajes de error y el label del InlineField.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Chip con unidad',
              description: 'Pon solo la unidad o una etiqueta corta junto al valor.',
              preview: chipField({ state: 'active', defaultValue: '172' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Chip con frase',
              description: 'Deja el chip para la unidad: una frase le quita espacio al valor.',
              preview: chipField({ state: 'active', defaultValue: '172', suffix: 'centímetros de estatura' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error con mensaje',
              description: 'Di en el mensaje qué se necesita: el color solo no basta.',
              preview: chipField({ defaultValue: '17a', errorText: 'Escribe solo números' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error solo en rojo',
              description: 'Agrega siempre el mensaje: el rojo solo no lo ve todo el mundo.',
              preview: chipField({ defaultValue: '17a', state: 'error' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Label corto',
              description: 'Nombra el dato con una o dos palabras.',
              preview: chipField({ state: 'active' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Label largo',
              description: 'Mantén el label en pocas palabras: si es largo, se trunca.',
              preview: chipField({ state: 'active', label: 'Escribe aquí tu altura en centímetros, sin decimales' }),
            },
          ],
        },
      ],
    },
  ],
};
