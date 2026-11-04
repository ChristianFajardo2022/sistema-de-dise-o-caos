import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { TripleSelect } from './TripleSelect';
import type { TripleSelectFields } from './TripleSelect.types';

/*
 * Contenido de la página de documentación de TripleSelect (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`TripleSelect.tsx`, `TripleSelect.types.ts`, `TripleSelect.variants.ts`), luego `TripleSelect.docs.json`. Medidas: un
 * recuadro con la base de Input (alto 56 en Desktop y Tablet y 48 en Mobile, padding 12 a los lados y 8 arriba y abajo,
 * 4 en Mobile, radio 16) y tres Select sin marco propio, separados por 16 y por una línea de 1 × 40 px; ancho 496 o 100%
 * con `fullWidth`; el mensaje va debajo, a 8.
 *
 * La lista de cada sección se abre en la capa superior (`popover`) y no se puede medir ni recortar en un lienzo; con
 * `state` el componente nunca la abre, así que ni la anatomía ni los estados la dibujan.
 * Diferencias con Figma: la línea entre secciones usa `border/general/default-on-canva` en el código y
 * `border/general/default-on-card` en Figma; Figma no dibuja el label del grupo (`label`, nombre accesible) ni el foco de
 * cada sección; Helper text es un estado en Figma y en el código es `helperText`; el set de Figma no deja leer sus
 * propiedades (error "Component set has existing errors").
 */

// Figma: 7856:1485 (component set General input, Type=Multiple)

type TripleProps = Partial<ComponentProps<typeof TripleSelect>>;

const DAYS = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map(
  (label, i) => ({ value: String(i + 1), label })
);
const YEARS = Array.from({ length: 7 }, (_, i) => ({ value: String(2026 - i), label: String(2026 - i) }));

/** Tres listas de ejemplo (día, mes y año), sin valor elegido. */
const EMPTY: TripleSelectFields = [
  { label: 'Día', placeholder: 'Elige el día', options: DAYS },
  { label: 'Mes', placeholder: 'Elige el mes', options: MONTHS },
  { label: 'Año', placeholder: 'Elige el año', options: YEARS },
];

/** Las mismas listas con una fecha fija elegida (15 de marzo de 2024). */
const FILLED: TripleSelectFields = [
  { ...EMPTY[0], defaultValue: '15' },
  { ...EMPTY[1], defaultValue: '3' },
  { ...EMPTY[2], defaultValue: '2024' },
];

/** TripleSelect de ejemplo: label real y fecha fija, sin el nombre del componente como texto. */
const triple = (props: TripleProps = {}) => <TripleSelect label="Fecha" fields={EMPTY} {...props} />;

/** Con la fecha elegida (los labels suben). */
const filled = (props: TripleProps = {}) => triple({ fields: FILLED, ...props });

/** Tres listas que no forman un solo dato, para el ejemplo de lo que no se debe agrupar. */
const UNRELATED: TripleSelectFields = [
  { label: 'Turno', options: [{ value: 'manana', label: 'Mañana' }, { value: 'tarde', label: 'Tarde' }], defaultValue: 'manana' },
  { label: 'Color', options: [{ value: 'azul', label: 'Azul' }, { value: 'verde', label: 'Verde' }], defaultValue: 'azul' },
  { label: 'Idioma', options: [{ value: 'es', label: 'Español' }, { value: 'en', label: 'Inglés' }], defaultValue: 'es' },
];

/** Tres listas de lugar que sí forman un solo dato. */
const PLACE: TripleSelectFields = [
  { label: 'País', options: [{ value: 'co', label: 'Colombia' }, { value: 'mx', label: 'México' }], defaultValue: 'co' },
  { label: 'Región', options: [{ value: 'a', label: 'Norte' }, { value: 'b', label: 'Sur' }], defaultValue: 'a' },
  { label: 'Ciudad', options: [{ value: 'm', label: 'Medellín' }, { value: 'b', label: 'Bogotá' }], defaultValue: 'm' },
];

/** Labels demasiado largos para una sección de un tercio del recuadro. */
const LONG_LABELS: TripleSelectFields = [
  { ...FILLED[0], label: 'Día en que naciste' },
  { ...FILLED[1], label: 'Mes en que naciste' },
  { ...FILLED[2], label: 'Año en que naciste' },
];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo, sin opciones elegidas. Cada sección lleva su label dentro y el borde del recuadro es el neutro de formulario.',
    samples: [triple()],
  },
  {
    label: 'Filled',
    tone: 'neutral',
    description: (
      <>
        Con opciones elegidas. Los labels suben y los valores quedan debajo. Salen de <code>value</code> o <code>defaultValue</code> de cada sección; <code>state</code> solo lo fuerza.
      </>
    ),
    samples: [filled({ state: 'filled' })],
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: (
      <>
        Con foco en cualquier sección. El borde del recuadro pasa al color activo y las secciones no dibujan anillo propio. <code>state=&quot;active&quot;</code> solo lo fuerza y nunca abre la lista.
      </>
    ),
    samples: [filled({ state: 'active' })],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Fondo propio y valores atenuados. Se enfoca y se lee, pero ninguna sección abre su lista.
      </>
    ),
    samples: [filled({ readOnly: true })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code> las tres secciones no se enfocan, no abren y no se envían con el formulario. Borde, labels y valores atenuados.
      </>
    ),
    samples: [filled({ disabled: true })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>errorText</code>. Borde y labels en rojo, <code>aria-invalid</code> en las tres secciones y el mensaje debajo. Gana sobre éxito y ayuda.
      </>
    ),
    samples: [triple({ errorText: 'Elige una fecha válida' })],
  },
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Con <code>successText</code>. Borde y labels en verde, y el mensaje debajo.
      </>
    ),
    samples: [filled({ successText: 'Fecha guardada' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'TripleSelect',
  icon: 'grid',
  classification: 'composicion',
  summary:
    'El TripleSelect es la composición para elegir un dato en tres listas dentro de un solo recuadro, como día, mes y año. Une tres Select separados por líneas bajo un solo nombre y un solo mensaje, y cada lista se abre bajo todo el recuadro.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un recuadro con la base de Input que reúne tres Select sin marco propio, separados por líneas, y un solo mensaje debajo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Tres secciones y ayuda',
                  preview: filled({ helperText: 'Como aparece en tu documento' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Input"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Label"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Placeholder"]', index: 0, side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Line"]', index: 0, side: 'top' },
                    { n: 5, selector: '[data-figma-part="Icon 3"]', side: 'top' },
                    { n: 6, selector: '[data-figma-part="Helper text"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Input"]', side: 'left' },
                    { kind: 'height', selector: '[data-figma-part="Input"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Recuadro:</strong> es <code>role=&quot;group&quot;</code> y su nombre accesible es <code>label</code>, que no se dibuja. Mide 56 de alto en Desktop y Tablet y 48 en Mobile, con padding de 12 a los lados (<code>space/field/md</code>), radio de 16 (<code>radius/field/md</code>) y trazo interior de 1 px. Mide 496 de ancho, o el 100% con <code>fullWidth</code>.
                </>,
                <>
                  <strong>Label de la sección:</strong> es el nombre accesible de su lista. Vacío y sin foco va dentro en 14/18; con valor o con foco sube a 12/16. <code>optional</code> le suma &quot; | Opcional&quot;.
                </>,
                <>
                  <strong>Valor:</strong> el texto de la opción elegida, en 14/18. Sin valor y con foco muestra el <code>placeholder</code> de la sección. Si no cabe, se corta con puntos suspensivos.
                </>,
                <>
                  <strong>Línea:</strong> separa las secciones. Mide 1 px de ancho y 40 de alto, y deja 16 a cada lado (<code>space/general/2xl</code>). La primera sección no lleva línea.
                </>,
                <>
                  <strong>Chevron:</strong> ícono chevron-down de 16 px, decorativo, al final de cada sección. Toda la sección abre su lista, chevron incluido.
                </>,
                <>
                  <strong>Mensaje:</strong> ayuda, éxito o error debajo del recuadro, a 8 px (<code>space/general/lg</code>). Las tres secciones lo enlazan con <code>aria-describedby</code>, el grupo no.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Opcional y tooltip',
                  preview: filled({
                    fields: [{ ...FILLED[0], optional: true }, FILLED[1], FILLED[2]],
                    tooltip: 'Elige la fecha en que ocurrió',
                  }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="| Opcional"]', index: 0, side: 'top' },
                    { n: 2, selector: 'button[aria-label="Elige la fecha en que ocurrió"]', side: 'top' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="Input"]', to: 'button[aria-label="Elige la fecha en que ocurrió"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>| Opcional:</strong> se suma al label de una sección con <code>optional</code> en su campo de <code>fields</code>. Cada sección lo decide por su cuenta.
                </>,
                <>
                  <strong>Tooltip:</strong> ícono de información de 16 px fuera del recuadro, a 8 de su borde derecho (<code>tooltip</code>). Su texto también describe a las tres secciones.
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
          TripleSelect tiene 7 estados. Filled y Active/Focus se fuerzan con <code>state</code> solo para documentar; en uso salen de los valores y del foco. No tiene Hover: el borde solo cambia con el foco.
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
              preview: triple({ fields: [{ ...EMPTY[0], optional: true }, EMPTY[1], EMPTY[2]] }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Borde (aparece en Active/Focus)', color: 'border-field-active' },
                { part: 'Línea entre secciones', color: 'border-general-default-on-canva' },
                { part: 'Label dentro de la sección', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Label arriba (con valor)', color: 'text-field-label-secondary', text: 'typography-field-size-xs' },
                { part: 'Valor y placeholder', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: 'Chevron', color: 'icon-general-default' },
                { part: '| Opcional', color: 'text-acent-firts' },
              ],
            },
            {
              title: 'Error',
              preview: triple({ errorText: 'Elige una fecha válida' }),
              entries: [
                { part: 'Borde', color: 'border-semantic-error' },
                { part: 'Label arriba', color: 'text-semantic-error-secondary' },
                { part: 'Mensaje', color: 'text-semantic-error-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-error-firts' },
                { part: 'Anillo de foco de teclado', color: 'border-field-active' },
              ],
            },
            {
              title: 'Success',
              preview: filled({ successText: 'Fecha guardada' }),
              entries: [
                { part: 'Borde', color: 'border-semantic-success' },
                { part: 'Label arriba', color: 'text-semantic-success-secondary' },
                { part: 'Mensaje', color: 'text-semantic-success-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-success-secondary' },
                { part: 'Anillo de foco de teclado', color: 'border-field-active' },
              ],
            },
            {
              title: 'Burnt-In',
              preview: filled({ readOnly: true }),
              entries: [
                { part: 'Fondo', color: 'background-field-burnt-in' },
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Línea entre secciones', color: 'border-general-default-on-card' },
                { part: 'Label arriba', color: 'text-field-label-secondary' },
                { part: 'Valor', color: 'text-field-disabled-negative' },
                { part: 'Chevron', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'Disabled',
              preview: filled({ disabled: true }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Línea entre secciones', color: 'border-general-default-on-canva' },
                { part: 'Label y valor', color: 'text-field-disabled-negative' },
                { part: 'Chevron', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'Mensaje de ayuda (helperText)',
              preview: filled({ helperText: 'Como aparece en tu documento' }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Mensaje', color: 'text-semantic-information-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-information-secondary' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente TripleSelect en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como General input en la librería de Assets y elige Type Multiple (antes Triple). Su propiedad es State, con 8 valores. Los labels y los placeholders de las tres secciones se editan como texto de la instancia.
            </>,
            <>
              <strong>Type:</strong> Multiple es el TripleSelect. El mismo set trae Text, Password, Search, Search header, Number, Code, Coment, Dropdown y Time picker, que en código son otros componentes (Input, PhoneInput, CodeInput, Textarea, Select y TimePicker).
            </>,
            <>
              <strong>State:</strong> Default, Filled, Active/Focus, Burnt-In, Disabled, Error, Success y Helper text. Helper text es un valor de State en Figma, pero en código es un mensaje (<code>helperText</code>), no un estado. El resto sale del uso: <code>readOnly</code> da Burnt-In, <code>disabled</code> Disabled, <code>errorText</code> Error y <code>successText</code> Success. <code>state</code> solo fuerza Filled y Active/Focus.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja el label del grupo (<code>label</code>), que en código es su nombre accesible, ni el foco de cada sección. La línea entre secciones usa <code>border/general/default-on-card</code> en Figma y <code>border/general/default-on-canva</code> en código. El set de Figma tiene errores y no deja leer sus propiedades.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el TripleSelect es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Un dato en tres partes:</strong> día, mes y año, o país, región y ciudad. Las tres listas comparten un solo nombre y un solo mensaje.
            </>,
            <>
              <strong>Listas cerradas y conocidas:</strong> cada sección solo admite valores de su lista, así que no hay datos mal escritos. La API no depende de lo que representen.
            </>,
            <>
              <strong>Formularios:</strong> con <code>name</code> en cada sección, el formulario envía el valor de cada lista. <code>required</code> marca las tres con <code>aria-required</code>.
            </>,
            <>
              <strong>Listas que dependen entre sí:</strong> cada sección se controla con <code>value</code> y <code>onValueChange</code>, así que quien lo usa decide qué opciones ofrece según lo elegido en las demás.
            </>,
            <>
              <strong>Teclado:</strong> cada sección es un combobox con flechas, Inicio, Fin, Enter, Espacio y Esc. Tab pasa de una sección a la siguiente y la lista se abre bajo todo el recuadro.
            </>,
          ],
          avoid: [
            <>
              <strong>Fecha exacta con calendario:</strong> para elegir un día cercano o dentro de un rango, el calendario es más rápido. (Alternativa: <code>DatePicker</code>).
            </>,
            <>
              <strong>Una hora:</strong> hora y minutos tienen su propia pieza. (Alternativa: <code>TimePicker</code>).
            </>,
            <>
              <strong>Una sola lista:</strong> con una elección, el recuadro triple sobra. (Alternativa: <code>Select</code>).
            </>,
            <>
              <strong>Listas sin relación entre sí:</strong> comparten el nombre del grupo y el mensaje, que no describen datos distintos. (Alternativa: un <code>Select</code> por dato).
            </>,
            <>
              <strong>Más o menos de tres listas:</strong> <code>fields</code> acepta exactamente tres secciones. (Alternativa: varios <code>Select</code> en una fila).
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
                title: 'Recuadro',
                bullets: [
                  <>
                    <strong>Alto de 56</strong> con padding de 8 arriba y abajo y de 12 a los lados; label de 12/16 y valor de 14/18.
                  </>,
                  <>
                    <strong>Tres secciones iguales</strong> separadas por 16 y por una línea de 40 de alto.
                  </>,
                ],
                preview: filled({ helperText: 'Como aparece en tu documento' }),
              },
              {
                title: 'Ancho',
                bullets: [
                  <>
                    <strong>Ancho de 496</strong> por defecto; con <code>fullWidth</code> ocupa el 100% del contenedor.
                  </>,
                  <>
                    <strong>Lista abierta:</strong> se abre bajo todo el recuadro y con su ancho, no con el de la sección.
                  </>,
                ],
                preview: triple({ fullWidth: true }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Alto de 48:</strong> el padding de arriba y abajo baja a 4 (<code>space/field/sm</code>); el label y el valor no cambian.
              </>,
              <>
                <strong>Ancho:</strong> el recuadro de 496 se encoge con la pantalla (<code>max-w-full</code>) y cada sección con él, así que un valor largo se corta con puntos suspensivos.
              </>,
              <>
                <strong>Toque:</strong> tocar cualquier parte de una sección abre o cierra su lista; tocar una opción la elige y la cierra.
              </>,
            ],
            preview: filled({ fullWidth: true, helperText: 'Como aparece en tu documento' }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> las mismas de Desktop, con el recuadro de 56 de alto.
              </>,
              <>
                <strong>Entrada mixta:</strong> con puntero, toque o teclado se abre igual que en Desktop.
              </>,
              <>
                <strong>Ancho:</strong> 496 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: filled({ fullWidth: true, helperText: 'Como aparece en tu documento' }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de agrupación, labels de las secciones y mensajes de error en el TripleSelect.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Listas de un solo dato',
              description: 'Agrupa solo las listas que forman un dato.',
              preview: triple({ label: 'Ubicación', fields: PLACE }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Listas sin relación',
              description: 'No juntes listas que no forman un dato.',
              preview: triple({ label: 'Preferencias', fields: UNRELATED }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Labels cortos',
              description: 'Nombra cada sección con una palabra.',
              preview: filled(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Labels largos',
              description: 'No escribas frases en los labels: se cortan.',
              preview: filled({ fields: LONG_LABELS }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error con mensaje',
              description: 'Di en el mensaje qué se necesita: el color solo no basta.',
              preview: triple({ errorText: 'Elige una fecha válida' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error solo en rojo',
              description: 'No dejes el error solo en rojo: agrega el mensaje.',
              preview: triple({ state: 'error' }),
            },
          ],
        },
      ],
    },
  ],
};
