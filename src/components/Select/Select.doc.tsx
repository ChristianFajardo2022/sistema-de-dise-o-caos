import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Radio } from '../Radio';
import { Select } from './Select';
import type { SelectOptionData } from './Select.types';

/*
 * Contenido de la página de documentación de Select (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Select.tsx`, `Select.types.ts`, `Select.variants.ts`), luego `Select.docs.json`. Medidas: el campo es el de Input
 * (alto 56 en Desktop y Tablet y 48 en Mobile, padding 12 a los lados y 8 arriba y abajo, 4 en Mobile, radio 16, ancho
 * 320 o 100% con `fullWidth`), chevron de 16 px; la lista es el panel de DropdownMenu (radio 16, padding 8, ítems de 34
 * con radio 12 y separados 4, riel de 6, alto máximo 20rem) a 8 px del campo.
 *
 * La lista real se abre en la capa superior (`popover`) y no se puede medir ni recortar en un lienzo: las vistas usan
 * `state="active"`, que la dibuja abierta en el flujo, debajo del campo.
 * Diferencias con Figma: Figma no dibuja foco de teclado en las opciones (el código marca la activa con un contorno de
 * 2 px); Helper text es un estado en Figma y en el código es `helperText`.
 */

// Figma: 7856:1485 (component set General input, Type=Dropdown) y 11673:7804 (component set Dropdown, ítems Dropdown list)

type SelectProps = Partial<ComponentProps<typeof Select>>;

const COUNTRIES: SelectOptionData[] = [
  { value: 'co', label: 'Colombia' },
  { value: 'mx', label: 'México' },
  { value: 'pe', label: 'Perú', disabled: true },
  { value: 'cl', label: 'Chile' },
];

const SORT: SelectOptionData[] = [
  { value: 'recientes', label: 'Más recientes', icon: 'clock' },
  { value: 'destacados', label: 'Destacados', icon: 'star' },
  { value: 'archivados', label: 'Archivados', icon: 'folder', disabled: true },
  { value: 'nombre', label: 'Nombre', icon: 'text' },
];

/** Select de ejemplo: label y opciones reales, sin el nombre del componente como texto. */
const select = (props: SelectProps = {}) => <Select label="País" options={COUNTRIES} {...props} />;

/** Lista abierta en el flujo (`state="active"`), para medirla y verla dentro del lienzo. */
const opened = (props: SelectProps = {}) => select({ state: 'active', defaultValue: 'mx', ...props });

/** Pila de muestras con clave (evita el aviso de React en modo dev). */
const stack = (...items: ReactNode[]) => (
  <div className="flex w-full flex-col items-center gap-ds-space-general-xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

const SHIFTS: SelectOptionData[] = [
  { value: 'manana', label: 'Mañana' },
  { value: 'tarde', label: 'Tarde' },
];

/** Grupo de Radio con las mismas opciones que la muestra de Select. */
const radios = () => (
  <div role="radiogroup" aria-label="Turno" className="flex flex-col gap-ds-space-general-lg">
    <Radio name="doc-select-turno" value="manana" defaultChecked>
      Mañana
    </Radio>
    <Radio name="doc-select-turno" value="tarde">
      Tarde
    </Radio>
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo, sin opción elegida. El label va dentro del campo y el borde es el neutro de formulario.',
    samples: [select()],
  },
  {
    label: 'Filled',
    tone: 'neutral',
    description: (
      <>
        Con una opción elegida. El label sube y el valor queda debajo. Sale de <code>value</code> o <code>defaultValue</code>; <code>state</code> solo lo fuerza.
      </>
    ),
    samples: [select({ state: 'filled', defaultValue: 'co' })],
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: (
      <>
        Con foco o con la lista abierta. El borde pasa al color activo. Aquí <code>state=&quot;active&quot;</code> dibuja la lista en el flujo; en uso se abre en la capa superior.
      </>
    ),
    samples: [opened()],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Fondo propio y valor atenuado. Se enfoca y se lee, pero no abre la lista.
      </>
    ),
    samples: [select({ readOnly: true, defaultValue: 'co' })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code> no se enfoca, no abre ni se envía con el formulario. Borde, label, valor y chevron atenuados.
      </>
    ),
    samples: [select({ disabled: true, defaultValue: 'co' })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>errorText</code>. Borde y label en rojo, <code>aria-invalid</code> y el mensaje debajo. Gana sobre éxito y ayuda.
      </>
    ),
    samples: [select({ errorText: 'Elige el país donde vives' })],
  },
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Con <code>successText</code>. Borde y label en verde, y el mensaje debajo.
      </>
    ),
    samples: [select({ defaultValue: 'co', successText: 'País guardado' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'Select',
  icon: 'chevron-down',
  classification: 'molecula',
  summary:
    'El Select es la molécula para elegir una sola opción de una lista cerrada. Une el campo de Input con el panel de Dropdown: muestra la opción elegida, abre la lista con puntero o teclado y lleva un mensaje de ayuda, éxito o error.',
  definition: [
    {
      title: 'Anatomía',
      description: 'El campo de Input con un chevron a la derecha y, al abrirlo, la lista de opciones debajo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Campo con valor y ayuda',
                  preview: select({ defaultValue: 'co', helperText: 'Donde vives actualmente' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Input"]', side: 'right' },
                    { n: 2, selector: '[data-figma-part="Label"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Placeholder"]', side: 'left' },
                    { n: 4, selector: '[data-figma-part="Icon Right"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Helper text"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Input"]', side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Input"]', side: 'top' },
                    { kind: 'height', selector: '[data-figma-part="Input"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Campo:</strong> alto de 56 en Desktop y Tablet y 48 en Mobile, padding de 12 a los lados (<code>space/field/md</code>) y 8 arriba y abajo (<code>space/field/sm</code>, 4 en Mobile), radio de 16 (<code>radius/field/md</code>) y trazo interior de 1 px. Mide 320 de ancho, o el 100% con <code>fullWidth</code>.
                </>,
                <>
                  <strong>Label:</strong> obligatorio (<code>label</code>) y nombre accesible del campo y de la lista. Sin valor va dentro en 14/18; con valor o con foco sube a 12/16. <code>optional</code> le suma &quot; | Opcional&quot;.
                </>,
                <>
                  <strong>Valor:</strong> el texto de la opción elegida, en 14/18, o su <code>displayLabel</code> si es distinto. Si no cabe, se corta con puntos suspensivos. Sin valor y con foco muestra el <code>placeholder</code>.
                </>,
                <>
                  <strong>Chevron:</strong> ícono chevron-down de 16 px en line, decorativo. Todo el campo abre la lista, chevron incluido.
                </>,
                <>
                  <strong>Mensaje:</strong> ayuda, éxito o error debajo del campo, a 8 px (<code>space/general/lg</code>). El campo lo enlaza con <code>aria-describedby</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Lista abierta',
                  preview: opened({ label: 'Ordenar por', options: SORT, defaultValue: 'destacados' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Dropdown"]', side: 'right' },
                    { n: 2, selector: '[data-figma-part="Dropdown list"]', index: 0, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', index: 3, side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Dropdown list"]', index: 1, side: 'left' },
                    { n: 5, selector: '[data-figma-part="Dropdown list"]', index: 2, side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Input"]', to: '[data-figma-part="Dropdown"]', axis: 'y' },
                    { kind: 'padding', selector: '[data-figma-part="Dropdown list"]', index: 3, side: 'right' },
                    { kind: 'height', selector: '[data-figma-part="Dropdown list"]', index: 3 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Lista:</strong> el panel de Dropdown a 8 px del campo y con su ancho. Radio de 16, padding de 8 y riel de scroll de 6 (<code>scrollbar</code>). Crece hasta 20rem de alto (<code>maxHeight</code>) y luego se recorre.
                </>,
                <>
                  <strong>Opción:</strong> alto de 34, padding de 8, radio de 12 (<code>radius/field/sm</code>) y texto de 14/18. Las opciones van separadas 4 px y un texto largo se corta con puntos suspensivos.
                </>,
                <>
                  <strong>Ícono:</strong> opcional (<code>icon</code> de cada opción), de 16 px en fill, a 8 px del texto.
                </>,
                <>
                  <strong>Opción elegida:</strong> fondo <code>background/field/active-slow-contrast</code> y <code>aria-selected</code>. Con el teclado, la opción activa lleva un contorno interior de 2 px.
                </>,
                <>
                  <strong>Opción deshabilitada:</strong> texto e ícono atenuados (<code>disabled</code> de la opción). Las flechas la saltan y no se puede elegir.
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
          Select tiene 7 estados. Se fuerzan con <code>state</code> solo para documentar; en uso salen del foco, del valor y de <code>readOnly</code>, <code>disabled</code>, <code>errorText</code> y <code>successText</code>.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del campo en Default, de la lista abierta y de los estados con mensaje. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Campo',
              preview: select({ optional: true }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Borde (con foco o abierto)', color: 'border-field-active' },
                { part: 'Label dentro', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Label arriba', color: 'text-field-label-secondary', text: 'typography-field-size-xs' },
                { part: 'Valor y placeholder', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: '| Opcional', color: 'text-acent-firts' },
                { part: 'Chevron', color: 'icon-general-default' },
              ],
            },
            {
              title: 'Lista',
              preview: opened({ label: 'Ordenar por', options: SORT, defaultValue: 'destacados' }),
              entries: [
                { part: 'Fondo', color: 'background-field-surface' },
                { part: 'Trazo', color: 'border-general-default-on-card' },
                { part: 'Texto de la opción', color: 'text-neutral-white', text: 'typography-field-size-sm' },
                { part: 'Ícono de la opción', color: 'icon-general-default' },
                { part: 'Opción elegida', color: 'background-field-active-slow-contrast' },
                { part: 'Opción activa (puntero)', color: 'background-field-hover' },
                { part: 'Opción deshabilitada', color: 'text-neutral-disabled-on-canva' },
                { part: 'Riel', color: 'background-general-gray-sixth' },
                { part: 'Barra del riel', color: 'background-general-gray-firts' },
              ],
            },
            {
              title: 'Error',
              preview: select({ errorText: 'Elige el país donde vives' }),
              entries: [
                { part: 'Borde', color: 'border-semantic-error' },
                { part: 'Label arriba', color: 'text-semantic-error-secondary' },
                { part: 'Mensaje', color: 'text-semantic-error-secondary' },
              ],
            },
            {
              title: 'Success',
              preview: select({ defaultValue: 'co', successText: 'País guardado' }),
              entries: [
                { part: 'Borde', color: 'border-semantic-success' },
                { part: 'Label arriba', color: 'text-semantic-success-secondary' },
                { part: 'Mensaje', color: 'text-semantic-success-secondary' },
              ],
            },
            {
              title: 'Burnt-In y Disabled',
              preview: stack(select({ readOnly: true, defaultValue: 'co' }), select({ disabled: true, defaultValue: 'co' })),
              entries: [
                { part: 'Fondo (Burnt-In)', color: 'background-field-burnt-in' },
                { part: 'Borde (Disabled)', color: 'border-field-disabled' },
                { part: 'Valor', color: 'text-field-disabled-negative' },
                { part: 'Chevron', color: 'icon-general-disabled-positive' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Select en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como General input en la librería de Assets y elige Type Dropdown. Su propiedad es State, con 8 valores.
            </>,
            <>
              <strong>State:</strong> Default, Filled, Active/Focus, Burnt-In, Disabled, Error y Success salen en código de la interacción y de <code>value</code>, <code>readOnly</code>, <code>disabled</code>, <code>errorText</code> y <code>successText</code>; <code>state</code> solo fuerza el aspecto. Helper text no es un estado: es <code>helperText</code>.
            </>,
            <>
              <strong>Lista:</strong> en Active/Focus, Figma dibuja debajo el set Dropdown con ítems Dropdown list (Type List Item simple). Su propiedad Icono es el <code>icon</code> de cada opción; Default, Hover, Select y Disabled son la opción en reposo, la activa, la elegida y la <code>disabled</code>; Scroll bar es <code>scrollbar</code>.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja el foco de teclado en las opciones; el código marca la opción activa con un contorno de 2 px. En código la lista se abre arriba si abajo no cabe.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Select es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Una opción de una lista cerrada:</strong> país, mes o tipo de documento. Solo admite valores de la lista, así que no hay datos mal escritos.
            </>,
            <>
              <strong>Listas de cuatro o más opciones:</strong> ocupa el alto de un campo y la lista solo aparece al abrirla.
            </>,
            <>
              <strong>Formularios:</strong> con <code>name</code>, un input oculto envía el <code>value</code>; el mensaje de ayuda o error se lee con <code>aria-describedby</code> y el error marca <code>aria-invalid</code>.
            </>,
            <>
              <strong>Teclado completo:</strong> patrón Select-Only Combobox. El foco no sale del campo; flechas, Inicio, Fin, Re Pág y Av Pág recorren las opciones, y escribir salta a la que empieza así.
            </>,
            <>
              <strong>Controles compuestos:</strong> <code>frame=&quot;none&quot;</code> deja solo el disparador y <code>anchorRef</code> abre la lista bajo todo el control, como en PhoneInput.
            </>,
          ],
          avoid: [
            <>
              <strong>Dos o tres opciones:</strong> a la vista se comparan mejor y se eligen con un toque. (Alternativa: <code>Radio</code>).
            </>,
            <>
              <strong>Sí o no, activar o desactivar:</strong> una lista sobra para un valor binario. (Alternativa: <code>Switch</code> o <code>Checkbox</code>).
            </>,
            <>
              <strong>Varias opciones a la vez:</strong> Select solo admite una. (Alternativa: <code>Checkbox</code>).
            </>,
            <>
              <strong>Acciones sobre un elemento:</strong> editar o eliminar no son valores de un formulario. (Alternativa: <code>DropdownMenu</code>).
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
                title: 'Campo',
                bullets: [
                  <>
                    <strong>Alto de 56</strong> con padding de 8 arriba y abajo y de 12 a los lados; label de 12/16 y valor de 14/18.
                  </>,
                  <>
                    <strong>Ancho de 320</strong> por defecto; con <code>fullWidth</code> ocupa el 100% del contenedor.
                  </>,
                ],
                preview: select({ defaultValue: 'co', helperText: 'Donde vives actualmente' }),
              },
              {
                title: 'Lista abierta',
                bullets: [
                  <>
                    <strong>A 8 px del campo</strong> y con su ancho. Si abajo no cabe, se abre arriba.
                  </>,
                  <>
                    <strong>Alto máximo de 20rem:</strong> con más opciones, la lista se recorre con el riel o con el teclado.
                  </>,
                ],
                preview: opened(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Alto de 48:</strong> el padding de arriba y abajo baja a 4 (<code>space/field/sm</code>); el label y el valor no cambian.
              </>,
              <>
                <strong>Ancho:</strong> el campo de 320 se encoge con la pantalla (<code>max-w-full</code>); <code>fullWidth</code> lo alinea con los demás campos.
              </>,
              <>
                <strong>Toque:</strong> tocar cualquier parte del campo abre o cierra la lista; tocar una opción la elige y la cierra.
              </>,
            ],
            preview: select({ defaultValue: 'co', helperText: 'Donde vives actualmente', fullWidth: true }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> las mismas de Desktop, con el campo de 56 de alto.
              </>,
              <>
                <strong>Entrada mixta:</strong> con puntero, toque o teclado se abre igual que en Desktop.
              </>,
              <>
                <strong>Bordes de la pantalla:</strong> la lista sigue al campo al recorrer la página y se abre arriba si abajo no cabe.
              </>,
            ],
            preview: select({ defaultValue: 'co', helperText: 'Donde vives actualmente' }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de cantidad de opciones, mensajes de error y texto de las opciones.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Dos opciones a la vista',
              description: 'Con dos o tres opciones, muéstralas a la vista con Radio.',
              preview: radios(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Dos opciones en una lista',
              description: 'No escondas dos opciones en una lista: hay que abrirla para ver qué hay.',
              preview: select({ label: 'Turno', options: SHIFTS, defaultValue: 'manana' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error que dice qué falta',
              description: 'Di en el error qué se necesita, sin culpar.',
              preview: select({ errorText: 'Elige el país donde vives' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error genérico',
              description: 'No uses mensajes genéricos: no dicen qué hacer para seguir.',
              preview: select({ errorText: 'Campo inválido' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Opciones cortas',
              description: 'Escribe opciones cortas que se lean completas.',
              preview: select({
                label: 'Horario',
                options: [
                  { value: 'manana', label: 'Mañana' },
                  { value: 'tarde', label: 'Tarde' },
                  { value: 'noche', label: 'Noche' },
                ],
                state: 'active',
                defaultValue: 'tarde',
              }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Opciones largas',
              description: 'No escribas frases en las opciones: se cortan con puntos suspensivos.',
              preview: select({
                label: 'Horario',
                options: [
                  { value: 'manana', label: 'En la mañana, entre las 8:00 a.m. y las 12:00 m., de lunes a viernes' },
                  { value: 'tarde', label: 'En la tarde, entre las 12:00 m. y las 6:00 p.m., de lunes a viernes' },
                  { value: 'noche', label: 'En la noche, entre las 6:00 p.m. y las 9:00 p.m., de lunes a viernes' },
                ],
                state: 'active',
                defaultValue: 'tarde',
              }),
            },
          ],
        },
      ],
    },
  ],
};
