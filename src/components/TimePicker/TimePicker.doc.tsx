import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { TimePicker } from './TimePicker';

/*
 * Contenido de la página de documentación de TimePicker (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`TimePicker.types.ts`, `TimePicker.variants.ts`, `TimePicker.tsx`), luego `TimePicker.docs.json`. Medidas: ancho 432,
 * alto de campo 56 en Desktop y Tablet y 48 en Mobile, padding de 12 a los lados y 8 arriba y abajo (4 en Mobile) en los
 * campos, radio 16, trazo interior de 1 px; AM/PM con padding X de 16, radio 12 y texto de 12/16; gap de 8 entre
 * controles y con el mensaje. Diferencias con Figma: Figma no tiene Hover ni dibuja el foco de teclado; en Active/Focus
 * dibuja con borde activo el campo de la hora y AM; el código lo marca solo en la hora y deja AM/PM según el valor.
 */

// Figma: set "General input" con Type=Time picker (State × 8)

type PickerProps = Partial<ComponentProps<typeof TimePicker>>;

/** TimePicker de ejemplo: nombre accesible real y sin el nombre del componente como texto. */
const picker = (props: PickerProps = {}) => <TimePicker label="Hora de inicio" {...props} />;

const HOUR = '09:30';

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo y sin hora. Los labels van dentro de los campos y el borde es el neutro de formulario.',
    samples: [picker()],
  },
  {
    label: 'Filled',
    tone: 'neutral',
    description: (
      <>
        Con hora. Los labels suben y el valor queda debajo; la opción elegida de AM/PM lleva el borde activo. Sale del valor; <code>state</code> solo lo fuerza.
      </>
    ),
    samples: [picker({ state: 'filled', defaultValue: HOUR })],
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: 'Con foco en un campo. Su borde pasa al color activo y se ve el placeholder. Sale del foco real.',
    samples: [picker({ state: 'active', defaultValue: HOUR, hourPlaceholder: '00' })],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Fondo y valor atenuados. Se puede enfocar, pero no cambiar.
      </>
    ),
    samples: [picker({ readOnly: true, defaultValue: HOUR })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        No editable ni enfocable (<code>disabled</code>). Borde, labels y valor atenuados en los tres controles.
      </>
    ),
    samples: [picker({ disabled: true })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>errorText</code>. Bordes y labels en rojo, <code>aria-invalid</code> y el mensaje debajo. Gana sobre éxito y ayuda.
      </>
    ),
    samples: [picker({ defaultValue: HOUR, errorText: 'Elige una hora entre 10:00 y 18:00' })],
  },
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Con <code>successText</code>. Bordes y labels en verde, y el mensaje debajo.
      </>
    ),
    samples: [picker({ defaultValue: '10:30', successText: 'Hora disponible' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'TimePicker',
  icon: 'clock',
  classification: 'molecula',
  summary:
    'El TimePicker es la molécula para elegir una hora del día escribiéndola o con las flechas del teclado. Une dos campos con label flotante (hora y minutos), el par AM/PM y un mensaje opcional. Su valor es siempre una cadena de 24 h con formato HH:mm.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila con tres controles del mismo ancho (hora, minutos y AM/PM), un tooltip opcional a la derecha y un mensaje debajo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Ciclo de 12 h con ayuda',
                  preview: picker({ defaultValue: HOUR, helperText: 'Las reuniones empiezan a las 10:00' }),
                  marks: [
                    { n: 1, selector: '[role="group"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Input hora"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Label"]', index: 0, side: 'top' },
                    { n: 4, selector: '[data-figma-part="Input minutos"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Container AM/PM"]', side: 'top' },
                    { n: 6, selector: '[data-figma-part="Helper text"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Input hora"] > div', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Input hora"]', to: '[data-figma-part="Input minutos"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> grupo con nombre accesible (<code>label</code>). Mide 432 de ancho, o el 100% con <code>fullWidth</code>, y separa sus controles 8 px (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Campo de la hora:</strong> un tercio del ancho. Alto de 56 en Desktop y Tablet y 48 en Mobile, padding de 12 a los lados (<code>space/field/md</code>) y 8 arriba y abajo (<code>space/field/sm</code>, 4 en Mobile), radio de 16 (<code>radius/field/md</code>) y trazo interior de 1 px. Admite de 1 a 12 en 12 h y de 0 a 23 en 24 h.
                </>,
                <>
                  <strong>Label:</strong> <code>hourLabel</code> y <code>minuteLabel</code>. Sin valor va dentro del campo en 14/18; con valor o con foco sube a 12/16. <code>optional</code> le suma &quot; | Opcional&quot;.
                </>,
                <>
                  <strong>Campo de los minutos:</strong> mismo recuadro y medidas que la hora, con valores de 0 a 59. Las flechas del teclado lo mueven de <code>minuteStep</code> en <code>minuteStep</code>.
                </>,
                <>
                  <strong>AM/PM:</strong> dos opciones excluyentes en un tercio del ancho, separadas 4 px (<code>space/general/md</code>). Cada una mide el alto del campo, con padding X de 16 (<code>space/general/2xl</code>), radio de 12 (<code>radius/field/sm</code>) y texto de 12/16. La elegida lleva el borde activo. En 24 h no se dibuja.
                </>,
                <>
                  <strong>Mensaje:</strong> ayuda, éxito o error debajo de los controles, a 8 px. Cada control lo enlaza con <code>aria-describedby</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Ciclo de 24 h con tooltip',
                  preview: picker({ hourCycle: 24, defaultValue: '17:45', tooltip: 'Escribe la hora o usa las flechas' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Input hora"]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Input minutos"]', side: 'top' },
                    { n: 3, selector: 'button', side: 'top' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="Input minutos"]', to: 'button' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Hora en 24 h:</strong> con <code>hourCycle</code> en <code>24</code> el campo acepta de 0 a 23 y desaparece el par AM/PM. Hora y minutos se reparten el ancho.
                </>,
                <>
                  <strong>Minutos:</strong> mismas medidas que en 12 h. El valor se emite igual, como <code>HH:mm</code>.
                </>,
                <>
                  <strong>Tooltip:</strong> ícono <code>info-circle</code> de 16 px a la derecha del grupo, a 8 px (<code>space/general/lg</code>). Es un botón con el texto como nombre accesible y se abre con clic, toque, Enter o Espacio.
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
          TimePicker tiene 7 estados. Filled y Active/Focus se fuerzan con <code>state</code> solo para documentar; en uso salen del valor y del foco. No tiene Hover: el borde solo cambia con el foco.
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
              preview: picker({ optional: true }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Label dentro del campo', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Label arriba (con valor)', color: 'text-field-label-secondary', text: 'typography-field-size-xs' },
                { part: 'Valor y placeholder', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: 'Texto de AM/PM', color: 'text-field-placeholder', text: 'typography-field-size-xs' },
                { part: 'Ícono del tooltip', color: 'icon-general-default' },
                { part: '| Opcional', color: 'text-acent-firts' },
                { part: 'Borde (aparece en Active/Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Error',
              preview: picker({ defaultValue: HOUR, errorText: 'Elige una hora entre 10:00 y 18:00' }),
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
              preview: picker({ defaultValue: '10:30', successText: 'Hora disponible' }),
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
              preview: picker({ readOnly: true, defaultValue: HOUR }),
              entries: [
                { part: 'Fondo', color: 'background-field-burnt-in' },
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Label arriba', color: 'text-field-label-secondary' },
                { part: 'Valor y texto de AM/PM', color: 'text-field-disabled-negative' },
              ],
            },
            {
              title: 'Disabled',
              preview: picker({ disabled: true }),
              entries: [
                { part: 'Borde', color: 'border-field-disabled' },
                { part: 'Labels, valor y texto de AM/PM', color: 'text-field-disabled-negative' },
              ],
            },
            {
              title: 'Mensaje de ayuda (helperText)',
              preview: picker({ defaultValue: HOUR, helperText: 'Las reuniones empiezan a las 10:00' }),
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
      title: 'Uso del componente TimePicker en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como General input en la librería de Assets, arrástralo al lienzo y elige <code>Type=Time picker</code>. Sus propiedades son Type y State; los labels y el texto de AM/PM se editan en la instancia.
            </>,
            <>
              <strong>Type:</strong> Time picker es el TimePicker. Text, Password, Search y los demás tipos del set son otros componentes (<code>Input</code>, <code>Select</code>, <code>PhoneInput</code>…). Figma dibuja solo el ciclo de 12 h; el de 24 h (<code>hourCycle=&quot;24&quot;</code>) existe solo en código.
            </>,
            <>
              <strong>State:</strong> Default, Filled, Active/Focus, Burnt-In, Disabled, Error, Success y Helper text. Helper text es un valor de State en Figma, pero en código es un mensaje (<code>helperText</code>), no un estado. El resto sale del uso: <code>readOnly</code> da Burnt-In, <code>errorText</code> Error y <code>successText</code> Success. <code>state</code> solo fuerza Filled y Active/Focus.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja el nombre del grupo ni el foco de teclado; el código suma <code>label</code> y un anillo de 2 px en AM/PM y en Error y Success. En Active/Focus Figma marca la hora y AM; el código marca solo la hora.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el TimePicker es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Hora exacta del día:</strong> inicio de una reunión, un recordatorio o un horario, que se escribe en pocos segundos.
            </>,
            <>
              <strong>Formato según el contexto:</strong> <code>hourCycle</code> elige entre 12 h con AM/PM y 24 h. El valor de <code>value</code> y <code>onValueChange</code> siempre es <code>HH:mm</code>.
            </>,
            <>
              <strong>Ajuste con teclado:</strong> las flechas suben y bajan con vuelta al llegar al extremo, e Inicio y Fin llevan al mínimo y al máximo. <code>minuteStep</code> define el salto de los minutos.
            </>,
            <>
              <strong>Valor en formularios:</strong> con <code>name</code> se envía un campo oculto con la hora. En 12 h el valor solo se emite cuando hay AM o PM elegido.
            </>,
          ],
          avoid: [
            <>
              <strong>Fecha y hora juntas:</strong> el componente solo elige la hora. (Alternativa: <code>DatePicker</code> junto al TimePicker).
            </>,
            <>
              <strong>Duración o cantidad de tiempo:</strong> no es una hora del día. (Alternativa: <code>NumberPicker</code>).
            </>,
            <>
              <strong>Pocos horarios fijos:</strong> elegir entre franjas es más rápido que escribir. (Alternativa: <code>Select</code> o <code>Radio</code>).
            </>,
            <>
              <strong>Grupo sin nombre:</strong> los campos tienen label visible, pero el grupo necesita <code>label</code> para el lector de pantalla.
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
                title: 'Ciclo de 12 h',
                bullets: [
                  <>
                    <strong>Alto de 56</strong> con padding de 8 arriba y abajo y de 12 a los lados; label de 12/16 y valor de 14/18.
                  </>,
                  <>
                    <strong>Ancho de 432</strong> por defecto; con <code>fullWidth</code> ocupa el 100% del contenedor.
                  </>,
                ],
                preview: picker({ defaultValue: HOUR }),
              },
              {
                title: 'Ciclo de 24 h',
                bullets: [
                  <>
                    <strong>Sin AM/PM:</strong> la hora y los minutos se reparten el ancho, con 8 entre ellos.
                  </>,
                  <>
                    <strong>Mismas medidas</strong> de campo que en 12 h: 56 de alto y radio de 16.
                  </>,
                ],
                preview: picker({ hourCycle: 24, defaultValue: '17:45' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Alto de 48:</strong> el padding de arriba y abajo baja a 4 (<code>space/field/sm</code>); labels y valores no cambian.
              </>,
              <>
                <strong>Ancho:</strong> el grupo de 432 se encoge con la pantalla (<code>max-w-full</code>) y sus tres controles se reparten el espacio.
              </>,
              <>
                <strong>Toque:</strong> AM y PM se eligen tocando su recuadro; el teclado numérico se abre al enfocar un campo.
              </>,
            ],
            preview: picker({ defaultValue: HOUR }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Alto de 56:</strong> con padding de 8 arriba y abajo, como en Desktop.
              </>,
              <>
                <strong>Ancho:</strong> 432 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
              <>
                <strong>Controles:</strong> hora, minutos y AM/PM de un tercio del ancho cada uno, con 8 entre ellos.
              </>,
            ],
            preview: picker({ defaultValue: HOUR }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de mensajes y formato del TimePicker.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Error con el horario',
              description: 'Di qué horas se aceptan: así se corrige sin adivinar.',
              preview: picker({ defaultValue: '07:30', errorText: 'Elige una hora entre 10:00 y 18:00' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error vago',
              description: 'No uses un mensaje genérico: no dice qué cambiar.',
              preview: picker({ defaultValue: '07:30', errorText: 'Hora no válida' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Formato de 24 h',
              description: 'Usa 24 h si el resto de la vista muestra horas de 0 a 23.',
              preview: picker({ hourCycle: 24, defaultValue: '17:45' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'AM/PM en vista de 24 h',
              description: 'No muestres AM/PM cuando la vista ya trabaja en 24 h.',
              preview: picker({ hourCycle: 12, defaultValue: '17:45' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Ayuda con un dato nuevo',
              description: 'Usa la ayuda para decir el horario válido.',
              preview: picker({ defaultValue: HOUR, helperText: 'Las reuniones empiezan a las 10:00' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ayuda que repite',
              description: 'No repitas lo que ya dicen los labels.',
              preview: picker({ defaultValue: HOUR, helperText: 'Escribe la hora' }),
            },
          ],
        },
      ],
    },
  ],
};
