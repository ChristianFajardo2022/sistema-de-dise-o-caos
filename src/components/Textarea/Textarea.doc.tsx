import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Textarea } from './Textarea';
import type { TextareaState } from './Textarea.types';

/*
 * Contenido de la página de documentación de Textarea (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Textarea.types.ts`, `Textarea.variants.ts`, `Textarea.tsx`), luego `Textarea.docs.json`. Medidas: padding lateral 12
 * y vertical 8 (4 en Mobile), radio 16, gap de 16 entre el texto y el contador. Diferencias con Figma: el set mide 88
 * en Default y Disabled y 86 en los demás; el código mide 86 con una línea y contador. Figma no trae `rows`,
 * `autoResize`, `maxRows` ni `resize`, y no dibuja el foco de Error y Success; el código suma un anillo de 2 px.
 */

// Figma: 7856:1485 (component set General input, Type=Coment)

type AreaProps = Partial<ComponentProps<typeof Textarea>>;

/** Textarea de ejemplo con label y placeholder neutros. */
const area = (props: AreaProps = {}) => <Textarea label="Comentario" placeholder="Revisar el ancho de las columnas" {...props} />;

/** Columna de campos separados: deja sitio a las cotas de la anatomía. */
const stack = (...items: ReactNode[]) => (
  <div className="flex w-full flex-col gap-ds-primitives-space-6xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Muestra de un estado forzado con `state`: dos líneas, ancho completo. */
const stateSample = (state: TextareaState, props: AreaProps = {}) => area({ state, rows: 2, fullWidth: true, ...props });

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo con el campo vacío. El label va dentro, en el primer renglón.',
    samples: [stateSample('default')],
  },
  {
    label: 'Filled',
    tone: 'neutral',
    description: 'Con texto escrito. El label sube y el texto queda debajo.',
    samples: [stateSample('filled', { defaultValue: 'La reunión empezó puntual.' })],
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: (
      <>
        Con el cursor dentro. El borde pasa al color activo y se ve el placeholder. Se fuerza con <code>state=&quot;active&quot;</code>.
      </>
    ),
    samples: [stateSample('active')],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Fondo propio y texto atenuado; se puede enfocar y seleccionar, pero no editar.
      </>
    ),
    samples: [stateSample('burnt-in', { readOnly: true, defaultValue: 'La reunión empezó puntual.' })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        No editable ni enfocable (<code>disabled</code>). Borde, label y texto atenuados, sin tirador de tamaño.
      </>
    ),
    samples: [stateSample('disabled', { disabled: true })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>errorText</code>. Borde y label en rojo, mensaje debajo y <code>aria-invalid</code>. Con foco suma un anillo de 2 px.
      </>
    ),
    samples: [stateSample('error', { defaultValue: 'Muy corto', errorText: 'Escribe al menos 10 caracteres' })],
  },
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Con <code>successText</code>. Borde y label en verde y mensaje de confirmación debajo; no marca <code>aria-invalid</code>.
      </>
    ),
    samples: [stateSample('success', { defaultValue: 'La reunión empezó puntual.', successText: 'Comentario listo' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'Textarea',
  icon: 'commentary',
  classification: 'molecula',
  summary:
    'El Textarea es la molécula para escribir texto de varias líneas, como un comentario o un motivo. Une un campo con label flotante, un tooltip opcional, un contador de caracteres y un mensaje de ayuda, error o éxito.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un recuadro con el label y el área de texto, un contador abajo y, fuera del recuadro, el tooltip y el mensaje.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Campo completo',
                  preview: area({ optional: true, tooltip: 'Visible para todo el equipo', helperText: 'Incluye lo que ya intentaste', maxLength: 200, defaultValue: 'La reunión empezó puntual' }),
                  marks: [
                    { n: 1, selector: '.border-solid', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Label"]', side: 'top' },
                    { n: 3, selector: 'textarea', side: 'right' },
                    { n: 4, selector: '[data-figma-part="0/200"]', side: 'bottom' },
                    { n: 5, selector: 'button', side: 'top' },
                    { n: 6, selector: '[aria-live]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '.border-solid', side: 'left' },
                    { kind: 'padding', selector: '.border-solid', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="Text field"]', to: '[data-figma-part="0/200"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> recuadro de 320 de ancho (o 100% con <code>fullWidth</code>), borde de 1 px (<code>border/field/default</code>) y radio de 16 (<code>radius/field/md</code>). Padding de 12 a los lados (<code>space/field/md</code>) y de 8 arriba y abajo (<code>space/field/sm</code>). La cota muestra 7 porque no cuenta el borde de 1 px. Entre el texto y el contador hay 16 (<code>space/general/2xl</code>).
                </>,
                <>
                  <strong>Label:</strong> 14/18 dentro del campo vacío; al escribir o enfocar sube a 12/16. Con <code>optional</code> suma &quot; | Opcional&quot; en color de acento.
                </>,
                <>
                  <strong>Área de texto:</strong> 14/18, sin borde propio. La primera línea empieza 20 px por debajo del label. Con <code>rows</code> de 1 el campo completo mide 86.
                </>,
                <>
                  <strong>Contador:</strong> <code>n/máx</code> en 12/16, abajo a la izquierda. Solo aparece con <code>maxLength</code>.
                </>,
                <>
                  <strong>Tooltip:</strong> ícono de información de 16 px a la derecha del campo, a 8 de distancia. Solo aparece con <code>tooltip</code>.
                </>,
                <>
                  <strong>Mensaje:</strong> debajo del campo, a 8, con ícono de 14 y texto 14/18 en semibold. Muestra error, éxito o ayuda, en ese orden de prioridad.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Altura según las líneas',
                  preview: stack(
                    area({ maxLength: 200 }),
                    area({ maxLength: 200, rows: 3 }),
                    area({ maxLength: 200, rows: 2, autoResize: true, maxRows: 4, defaultValue: 'La reunión empezó puntual.\nSe revisó el documento.\nQuedan dos puntos abiertos.' })
                  ),
                  marks: [
                    { n: 1, selector: '.border-solid', index: 0, side: 'left' },
                    { n: 2, selector: '.border-solid', index: 1, side: 'left' },
                    { n: 3, selector: '.border-solid', index: 2, side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '.border-solid', index: 0 },
                    { kind: 'height', selector: '.border-solid', index: 1 },
                    { kind: 'height', selector: '.border-solid', index: 2 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Una línea:</strong> <code>rows</code> de 1, el valor por defecto. Con contador mide 86.
                </>,
                <>
                  <strong>Tres líneas:</strong> <code>rows</code> de 3. Cada línea suma 18. El tirador <code>resize</code> permite cambiar el alto a mano; por defecto es vertical.
                </>,
                <>
                  <strong>Auto-crecimiento:</strong> con <code>autoResize</code> el campo crece con el contenido, desde <code>rows</code> hasta <code>maxRows</code>. Después aparece el scroll y el tirador se oculta.
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
          Textarea tiene 7 estados. Se pueden forzar con <code>state</code> solo para documentar; en uso salen del foco, <code>readOnly</code>, <code>disabled</code> y de los mensajes. No tiene Hover ni Press. La ayuda (<code>helperText</code>) es un mensaje, no un estado: se muestra en cualquiera de ellos, salvo si hay error o éxito.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default y los que aparecen en otros estados. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Default y Active/Focus',
              preview: area({ optional: true, tooltip: 'Visible para todo el equipo', maxLength: 200, defaultValue: 'La reunión empezó puntual', fullWidth: true }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Label en reposo', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Label arriba', color: 'text-field-label-secondary', text: 'typography-field-size-xs' },
                { part: 'Texto escrito', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: 'Contador', color: 'text-field-label-secondary', text: 'typography-field-size-xs' },
                { part: '| Opcional', color: 'text-acent-firts', text: 'typography-field-size-xs' },
                { part: 'Ícono del tooltip', color: 'icon-general-default' },
                { part: 'Borde (aparece en Active/Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Burnt-In y Disabled',
              preview: area({ readOnly: true, defaultValue: 'La reunión empezó puntual', maxLength: 200, fullWidth: true, state: 'burnt-in' }),
              entries: [
                { part: 'Fondo (Burnt-In)', color: 'background-field-burnt-in' },
                { part: 'Borde (Burnt-In)', color: 'border-field-default' },
                { part: 'Borde (Disabled)', color: 'border-field-disabled' },
                { part: 'Label y texto', color: 'text-field-disabled-negative' },
                { part: 'Contador', color: 'text-field-disabled-negative' },
                { part: 'Ícono del tooltip', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'Error y Success',
              preview: area({ errorText: 'Escribe al menos 10 caracteres', defaultValue: 'Muy corto', fullWidth: true }),
              entries: [
                { part: 'Borde (Error)', color: 'border-semantic-error' },
                { part: 'Label arriba (Error)', color: 'text-semantic-error-secondary', text: 'typography-field-size-xs' },
                { part: 'Borde (Success)', color: 'border-semantic-success' },
                { part: 'Label arriba (Success)', color: 'text-semantic-success-secondary', text: 'typography-field-size-xs' },
                { part: 'Anillo de foco', color: 'border-field-active' },
              ],
            },
            {
              title: 'Mensajes',
              preview: area({ helperText: 'Incluye lo que ya intentaste', fullWidth: true }),
              entries: [
                { part: 'Ayuda', color: 'text-semantic-information-secondary', text: 'typography-field-size-sm' },
                { part: 'Error', color: 'text-semantic-error-secondary', text: 'typography-field-size-sm' },
                { part: 'Éxito', color: 'text-semantic-success-secondary', text: 'typography-field-size-sm' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Textarea en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como General input en la librería de Assets, arrástralo al lienzo y elige Type Coment. Sus propiedades son Type y State.
            </>,
            <>
              <strong>State:</strong> Default, Filled, Active/Focus, Burnt-In, Disabled, Error, Success y Helper text. En código, Burnt-In sale de <code>readOnly</code>, Disabled de <code>disabled</code>, y Error, Success y Helper text de <code>errorText</code>, <code>successText</code> y <code>helperText</code>. El resto sale del foco y del valor; <code>state</code> solo los fuerza.
            </>,
            <>
              <strong>Contenido:</strong> el texto Label es <code>label</code>; &quot;| Opcional&quot; es <code>optional</code>; 0/200 es el contador de <code>maxLength</code>; la instancia Tooltip es <code>tooltip</code>. Figma no implementa Icon left, Icon right ni Tag, y el código tampoco.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no trae <code>rows</code>, <code>autoResize</code>, <code>maxRows</code> ni <code>resize</code>; el código sí. Para campos de una línea usa el set General input con Type Text, que corresponde a Input.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Textarea es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Texto libre de varias líneas:</strong> comentarios, notas, motivos o descripciones que no caben en una línea.
            </>,
            <>
              <strong>Texto con límite:</strong> <code>maxLength</code> corta la escritura y muestra el contador <code>n/máx</code>. El lector de pantalla lo anuncia al enfocar, no en cada tecla.
            </>,
            <>
              <strong>Largo variable:</strong> <code>autoResize</code> con <code>maxRows</code> evita un campo enorme o con scroll prematuro.
            </>,
            <>
              <strong>Validación y ayuda:</strong> <code>errorText</code> marca <code>aria-invalid</code> y toma prioridad sobre <code>successText</code> y <code>helperText</code>. El mensaje y el contador entran en <code>aria-describedby</code>.
            </>,
            <>
              <strong>Teclado:</strong> Tab enfoca el campo, Enter inserta un salto de línea y Shift + Tab sale. El label visible sigue asociado al campo.
            </>,
          ],
          avoid: [
            <>
              <strong>Texto de una línea:</strong> nombres, correos o búsquedas no necesitan varias líneas. (Alternativa: <code>Input</code>).
            </>,
            <>
              <strong>Valor de una lista cerrada:</strong> escribir obliga a adivinar las opciones. (Alternativa: <code>Select</code>).
            </>,
            <>
              <strong>Código de dígitos:</strong> un código de verificación se escribe casilla por casilla. (Alternativa: <code>CodeInput</code>).
            </>,
            <>
              <strong>Placeholder en lugar del label:</strong> el placeholder solo se ve al enfocar y desaparece al escribir. El <code>label</code> es obligatorio y siempre visible.
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
                title: 'Ancho fijo',
                bullets: [
                  <>
                    <strong>Medidas:</strong> 320 de ancho, padding de 12 a los lados y de 8 arriba y abajo.
                  </>,
                  <>
                    <strong>Ancho limitado:</strong> en un contenedor más estrecho se reduce hasta caber, sin desbordar.
                  </>,
                ],
                preview: area({ maxLength: 200, rows: 2 }),
              },
              {
                title: 'Ancho completo',
                bullets: [
                  <>
                    <strong>Con fullWidth:</strong> ocupa el 100% del contenedor; el alto no cambia.
                  </>,
                  <>
                    <strong>Texto:</strong> label y contador de 12/16, valor de 14/18, en todos los breakpoints.
                  </>,
                ],
                preview: area({ maxLength: 200, rows: 2, fullWidth: true }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Padding vertical menor:</strong> 4 arriba y abajo (<code>space/field/sm</code>), contra 8 en Desktop y Tablet; con una línea y contador mide 78.
              </>,
              <>
                <strong>Medidas fijas:</strong> los 12 laterales, el radio de 16 y la tipografía no cambian.
              </>,
              <>
                <strong>Ancho:</strong> mide 320 como máximo y se ajusta al ancho disponible; con <code>fullWidth</code> ocupa todo el contenedor.
              </>,
            ],
            preview: area({ maxLength: 200, rows: 2, fullWidth: true }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Mismos valores que Desktop:</strong> padding de 12 y de 8; con una línea y contador mide 86.
              </>,
              <>
                <strong>Medidas fijas:</strong> radio de 16 y tipografía 12/16 y 14/18.
              </>,
              <>
                <strong>Ancho:</strong> 320 por defecto o 100% con <code>fullWidth</code>.
              </>,
            ],
            preview: area({ maxLength: 200, rows: 2, fullWidth: true }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de mensajes, label y altura del Textarea.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Error que dice qué falta',
              description: 'Di qué necesita el campo para ser válido.',
              preview: area({ defaultValue: 'Muy corto', errorText: 'Escribe al menos 10 caracteres', fullWidth: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error sin salida',
              description: 'No avises solo que algo está mal.',
              preview: area({ defaultValue: 'Muy corto', errorText: 'Texto inválido', fullWidth: true }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Label corto',
              description: 'Nombra el campo en una a tres palabras.',
              preview: area({ label: 'Comentario', fullWidth: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Label largo',
              description: 'No pongas una frase como label: se recorta.',
              preview: area({ label: 'Escribe aquí el comentario que quieres dejar sobre la reunión', fullWidth: true }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Alto que sigue al texto',
              description: (
                <>
                  Usa <code>autoResize</code> con <code>maxRows</code> en textos largos.
                </>
              ),
              preview: area({ autoResize: true, rows: 2, maxRows: 4, fullWidth: true, defaultValue: 'La reunión empezó puntual.\nSe revisó el documento.\nQuedan dos puntos abiertos.' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Alto fijo de una línea',
              description: 'No dejes una línea sin tirador para textos largos.',
              preview: area({ resize: 'none', fullWidth: true, defaultValue: 'La reunión empezó puntual.\nSe revisó el documento.\nQuedan dos puntos abiertos.' }),
            },
          ],
        },
      ],
    },
  ],
};
