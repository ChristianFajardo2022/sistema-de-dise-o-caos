import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { DatePicker } from './DatePicker';
import type { DatePickerSingleProps } from './DatePicker.types';

/*
 * Contenido de la página de documentación de DatePicker (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`DatePicker.tsx`, `DatePicker.types.ts`, `DatePicker.variants.ts`), luego `DatePicker.docs.json`. Medidas: el campo
 * es el de Input (alto 56 en Desktop y Tablet y 48 en Mobile, padding 12 a los lados y 8 arriba y abajo, 4 en Mobile,
 * radio 16, ancho 320 o 100% con `fullWidth`); ícono calendar de 16 px dentro de un botón de 24; el calendario es el
 * Calendar (Only date) de 480 de ancho, a 8 px del campo y alineado a su borde derecho.
 *
 * El calendario real se abre en la capa superior (`popover`) y no se puede medir en un lienzo: las vistas usan
 * `state="active"`, que lo dibuja abierto debajo del campo. Ese panel es absoluto, así que las muestras le dejan sitio.
 * Fechas fijas (hoy = 23/10/2026, fecha de ejemplo = 14/10/2026): la página no depende del reloj del equipo.
 * Diferencias con Figma: el pie del calendario dice Limpiar y Filtrar (el código, Cancelar y Aplicar); Figma no tiene
 * rango ni dibuja el foco de teclado del botón; Helper text es un estado en Figma y en el código es `helperText`.
 */

// Figma: 8096:3344 (component set Date picker)

type SingleProps = Partial<DatePickerSingleProps>;

/** Hoy y fecha de ejemplo fijos. */
const TODAY = new Date(2026, 9, 23);
const SAMPLE = new Date(2026, 9, 14);

const HELP = 'Puedes escribirla o elegirla';

/** DatePicker de ejemplo: label real y hoy fijo, sin el nombre del componente como texto. */
const picker = (props: SingleProps = {}) => <DatePicker label="Fecha de inicio" calendarProps={{ today: TODAY }} {...props} />;

/**
 * Calendario abierto en el flujo (`state="active"`), con el campo al ancho del calendario. El panel es absoluto: el
 * contenedor le deja sitio debajo.
 */
const opened = (props: SingleProps = {}, space = 'pb-130') => (
  <div className={`w-120 max-w-full ${space}`}>{picker({ state: 'active', defaultValue: SAMPLE, fullWidth: true, ...props })}</div>
);

/**
 * Calendario abierto con el campo a su ancho por defecto (320): el calendario se alinea al borde derecho del campo y
 * sobresale a la izquierda, como en uso.
 */
const openedDefault = () => (
  <div className="flex w-120 max-w-full justify-end pb-130">{picker({ state: 'active', defaultValue: SAMPLE })}</div>
);

/** Pila de muestras con clave (evita el aviso de React en modo dev). */
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
    description: 'Reposo, sin fecha. El label va dentro del campo y el borde es el neutro de formulario.',
    samples: [picker()],
  },
  {
    label: 'Filled',
    tone: 'neutral',
    description: (
      <>
        Con fecha. El label sube y la fecha queda debajo. Sale de <code>value</code>, <code>defaultValue</code> o de lo escrito; <code>state</code> solo lo fuerza.
      </>
    ),
    samples: [picker({ state: 'filled', defaultValue: SAMPLE })],
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: (
      <>
        Con foco o con el calendario abierto. El borde pasa al color activo. Aquí <code>state=&quot;active&quot;</code> dibuja el calendario en el flujo; en uso se abre en la capa superior.
      </>
    ),
    samples: [opened()],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Fondo propio y fecha atenuada. Se enfoca y se copia, pero el botón no abre el calendario.
      </>
    ),
    samples: [picker({ readOnly: true, defaultValue: SAMPLE })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code> no se escribe, no se enfoca, no abre el calendario ni se envía con el formulario. Borde, label e ícono atenuados.
      </>
    ),
    samples: [picker({ disabled: true })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>errorText</code> o con la validación propia: una fecha imposible o fuera de límites marca el error al salir del campo. Borde y label en rojo y <code>aria-invalid</code>.
      </>
    ),
    samples: [picker({ defaultValue: SAMPLE, errorText: 'Elige una fecha desde el 20/10/2026' })],
  },
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Con <code>successText</code>. Borde y label en verde, y el mensaje debajo.
      </>
    ),
    samples: [picker({ defaultValue: SAMPLE, successText: 'Fecha disponible' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'DatePicker',
  icon: 'calendar',
  classification: 'composicion',
  summary:
    'El DatePicker es la composición para escribir o elegir una fecha, o un rango de fechas, en un formulario. Une el campo de Input con un botón que abre el Calendar debajo, y lleva un mensaje de ayuda, éxito o error.',
  definition: [
    {
      title: 'Anatomía',
      description: 'El campo de Input con un botón de calendario a la derecha y, al abrirlo, el Calendar debajo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Campo con fecha y ayuda',
                  preview: picker({ defaultValue: SAMPLE, helperText: HELP }),
                  marks: [
                    { n: 1, selector: '[data-slot="field"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Label"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="00/00/0000"]', side: 'bottom' },
                    { n: 4, selector: 'button[aria-haspopup="dialog"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Helper text"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="field"]', side: 'left' },
                    { kind: 'padding', selector: '[data-slot="field"]', side: 'top' },
                    { kind: 'height', selector: '[data-slot="field"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Campo:</strong> el de Input. Alto de 56 en Desktop y Tablet y 48 en Mobile, padding de 12 a los lados (<code>space/field/md</code>) y 8 arriba y abajo (<code>space/field/sm</code>, 4 en Mobile), radio de 16 (<code>radius/field/md</code>) y trazo interior de 1 px. Mide 320 de ancho, o el 100% con <code>fullWidth</code>.
                </>,
                <>
                  <strong>Label:</strong> obligatorio (<code>label</code>) y nombre accesible del campo. Sin fecha va dentro en 14/18; con fecha o con foco sube a 12/16. <code>optional</code> le suma &quot; | Opcional&quot;.
                </>,
                <>
                  <strong>Fecha:</strong> un <code>&lt;input&gt;</code> de texto en 14/18, con teclado numérico en el celular. Se escribe en el formato del idioma (dd/mm/aaaa en <code>es</code>) y una máscara pone las barras. Con foco y sin fecha muestra esa pista como placeholder.
                </>,
                <>
                  <strong>Botón de calendario:</strong> ícono calendar de 16 px en fill (<code>icon/general/gray-high-contrast</code>) dentro de un botón de 24. Su nombre es &quot;Elegir fecha&quot; más la fecha actual, y expone <code>aria-haspopup=&quot;dialog&quot;</code> y <code>aria-expanded</code>.
                </>,
                <>
                  <strong>Mensaje:</strong> ayuda, éxito o error debajo del campo, a 8 px (<code>space/general/lg</code>). El campo lo enlaza con <code>aria-describedby</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Calendario abierto',
                  preview: opened(),
                  marks: [
                    { n: 1, selector: '[data-slot="field"]', side: 'top' },
                    { n: 2, selector: '[role="group"][data-mode]', side: 'left' },
                    { n: 3, selector: '[data-figma-state="select"]', side: 'bottom' },
                    { n: 4, selector: '[role="group"][data-mode] button', index: -2, side: 'left' },
                    { n: 5, selector: '[role="group"][data-mode] button', index: -1, side: 'right' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-slot="field"]', to: '[role="group"][data-mode]', axis: 'y' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Campo activo:</strong> con el calendario abierto, el borde pasa a <code>border/field/active</code> y el botón expone <code>aria-expanded=&quot;true&quot;</code>.
                </>,
                <>
                  <strong>Calendario:</strong> el componente Calendar (Only date, vista de día) en un diálogo no modal. Va a 8 px del campo, alineado a su borde derecho, y mide 480 de ancho o el ancho disponible. Si abajo no cabe, se abre arriba.
                </>,
                <>
                  <strong>Día elegido:</strong> relleno <code>background/field/active-purpple</code>. Al abrir, el foco va a ese día o, sin fecha, a hoy.
                </>,
                <>
                  <strong>Cancelar:</strong> cierra sin aplicar y devuelve el foco al botón de calendario. Esc hace lo mismo.
                </>,
                <>
                  <strong>Aplicar:</strong> escribe el día elegido en el campo y cierra. Con <code>showActions={'{false}'}</code> no hay pie: elegir el día ya aplica.
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
          DatePicker tiene 7 estados. Se fuerzan con <code>state</code> solo para documentar; en uso salen del foco, de la fecha y de <code>readOnly</code>, <code>disabled</code>, <code>errorText</code> y <code>successText</code>.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del campo en Default, del calendario abierto y de los estados con mensaje. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Campo',
              preview: picker({ optional: true }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Borde (con foco o abierto)', color: 'border-field-active' },
                { part: 'Label dentro', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Label arriba', color: 'text-field-label-secondary', text: 'typography-field-size-xs' },
                { part: 'Fecha y placeholder', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: '| Opcional', color: 'text-acent-firts' },
                { part: 'Ícono de calendario', color: 'icon-general-gray-high-contrast' },
                { part: 'Foco del botón (teclado)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Calendario abierto',
              preview: opened(),
              entries: [
                { part: 'Fondo', color: 'background-field-surface' },
                { part: 'Trazo', color: 'border-field-default' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-sm' },
                { part: 'Día', color: 'background-field-default' },
                { part: 'Día elegido', color: 'background-field-active-purpple' },
                { part: 'Aplicar', color: 'background-button-primary-default' },
              ],
            },
            {
              title: 'Error',
              preview: picker({ defaultValue: SAMPLE, errorText: 'Elige una fecha desde el 20/10/2026' }),
              entries: [
                { part: 'Borde', color: 'border-semantic-error' },
                { part: 'Label arriba', color: 'text-semantic-error-secondary' },
                { part: 'Mensaje', color: 'text-semantic-error-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-error-firts' },
              ],
            },
            {
              title: 'Success',
              preview: picker({ defaultValue: SAMPLE, successText: 'Fecha disponible' }),
              entries: [
                { part: 'Borde', color: 'border-semantic-success' },
                { part: 'Label arriba', color: 'text-semantic-success-secondary' },
                { part: 'Mensaje', color: 'text-semantic-success-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-success-secondary' },
              ],
            },
            {
              title: 'Ayuda',
              preview: picker({ defaultValue: SAMPLE, helperText: HELP }),
              entries: [
                { part: 'Mensaje', color: 'text-semantic-information-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-information-secondary' },
              ],
            },
            {
              title: 'Burnt-In y Disabled',
              preview: stack(picker({ readOnly: true, defaultValue: SAMPLE }), picker({ disabled: true })),
              entries: [
                { part: 'Fondo (Burnt-In)', color: 'background-field-burnt-in' },
                { part: 'Borde (Disabled)', color: 'border-field-disabled' },
                { part: 'Label y fecha', color: 'text-field-disabled-negative' },
                { part: 'Ícono de calendario', color: 'icon-general-disabled-positive' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente DatePicker en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Date picker en la librería de Assets. Sus propiedades son State, Message, Tooltip, Optional, Placeholder+label y Only label.
            </>,
            <>
              <strong>State:</strong> Default (Dafault en Figma), Filled, Active/Focus, Burnt-In, Disabled, Error y Success salen de la interacción y de <code>value</code>, <code>readOnly</code>, <code>disabled</code>, <code>errorText</code> y <code>successText</code>; <code>state</code> solo fuerza el aspecto. Helper text no es un estado: es <code>helperText</code>.
            </>,
            <>
              <strong>Message, Tooltip y Optional:</strong> Message es el mensaje de <code>helperText</code>, <code>errorText</code> o <code>successText</code>; Tooltip es <code>tooltip</code> y Optional es <code>optional</code>. Placeholder+label y Only label no son props: el código sube el label y muestra la fecha o la pista según el valor y el foco.
            </>,
            <>
              <strong>Diferencias:</strong> en Active/Focus, Figma dibuja el set Calendar con un pie que dice Limpiar y Filtrar; el código dice Cancelar y Aplicar (<code>calendarProps.labels</code>). Figma no tiene rango: en código es <code>mode=&quot;range&quot;</code>, con el Calendar de Date range.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el DatePicker es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Una fecha en un formulario:</strong> inicio de un periodo, fecha de una reunión o de un documento. Se escribe si se conoce o se elige en el calendario.
            </>,
            <>
              <strong>Un rango de fechas:</strong> con <code>mode=&quot;range&quot;</code> un solo campo guarda inicio y fin, y el calendario muestra dos meses desde Tablet.
            </>,
            <>
              <strong>Fechas con límites:</strong> <code>minDate</code>, <code>maxDate</code> e <code>isDateDisabled</code> bloquean días en el calendario y validan lo escrito.
            </>,
            <>
              <strong>Teclado completo:</strong> patrón Date Picker Dialog. Alt + Flecha abajo abre desde el campo, las flechas recorren los días, Esc cierra y el foco vuelve al botón.
            </>,
            <>
              <strong>Formularios:</strong> con <code>name</code>, un input oculto manda la fecha en ISO (<code>2026-10-14</code>), sin depender del formato del idioma.
            </>,
          ],
          avoid: [
            <>
              <strong>Una hora:</strong> el calendario no elige horas ni minutos. (Alternativa: <code>TimePicker</code>).
            </>,
            <>
              <strong>Calendario siempre visible:</strong> una agenda o un panel de filtros no necesita campo ni capa. (Alternativa: <code>Calendar</code>).
            </>,
            <>
              <strong>Dos o tres fechas posibles:</strong> si solo valen unas pocas fechas, es más rápido verlas todas a la vista. (Alternativa: <code>Radio</code>).
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
                title: 'Campo y calendario',
                bullets: [
                  <>
                    <strong>Campo de 56 de alto</strong> y 320 de ancho por defecto; padding de 8 arriba y abajo y de 12 a los lados, label de 12/16 y fecha de 14/18.
                  </>,
                  <>
                    <strong>Calendario de 480</strong>, a 8 px del campo y alineado a su borde derecho: sobresale a la izquierda de un campo de 320. Si abajo no cabe, se abre arriba.
                  </>,
                ],
                preview: openedDefault(),
              },
              {
                title: 'Ancho completo y sin pie',
                bullets: [
                  <>
                    <strong>Con <code>fullWidth</code></strong> el campo ocupa el 100% del contenedor y, a 480, coincide con el calendario.
                  </>,
                  <>
                    <strong>Sin pie</strong> (<code>showActions={'{false}'}</code>): elegir el día aplica la fecha y cierra el calendario.
                  </>,
                ],
                preview: opened({ showActions: false }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Alto de 48:</strong> el padding de arriba y abajo baja a 4 (<code>space/field/sm</code>); el label y la fecha no cambian.
              </>,
              <>
                <strong>Calendario al ancho de la pantalla:</strong> no pasa del ancho disponible, y Cancelar y Aplicar se apilan, con Aplicar arriba.
              </>,
              <>
                <strong>Toque:</strong> el campo abre el teclado numérico para escribir la fecha; el botón de calendario abre el calendario.
              </>,
            ],
            // En Mobile el pie apilado suma alto: más sitio debajo
            preview: opened({}, 'pb-142'),
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> las de Desktop. Campo de 56 de alto y calendario de hasta 480, según el ancho disponible.
              </>,
              <>
                <strong>Entrada mixta:</strong> con puntero, toque o teclado se abre igual que en Desktop.
              </>,
              <>
                <strong>Bordes de la pantalla:</strong> el calendario sigue al campo al recorrer la página y se abre arriba si abajo no cabe.
              </>,
            ],
            preview: opened(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de placeholder, mensajes de error y límites de fecha.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Pista del formato',
              description: 'Deja la pista del idioma como placeholder: muestra el formato que se espera.',
              preview: picker({ state: 'filled' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Placeholder con instrucciones',
              description: 'No escribas instrucciones en el placeholder: no dicen en qué orden van día, mes y año.',
              preview: picker({ state: 'filled', placeholder: 'Escribe aquí la fecha' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error que dice qué falta',
              description: 'Di en el error qué fecha sirve, sin culpar.',
              preview: picker({ defaultValue: SAMPLE, errorText: 'Elige una fecha desde el 20/10/2026' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error genérico',
              description: 'No uses mensajes genéricos: no dicen qué hacer para seguir.',
              preview: picker({ defaultValue: SAMPLE, errorText: 'Fecha inválida' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Límites en la ayuda',
              description: 'Di los límites en la ayuda, antes de que alguien escriba.',
              preview: picker({ helperText: 'Entre el 5 de octubre y el 20 de noviembre' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Límites ocultos',
              description: 'No esperes al error para avisar del límite: obliga a adivinar y a escribir otra vez.',
              preview: picker({ defaultValue: new Date(2026, 11, 3), errorText: 'Esa fecha no está disponible' }),
            },
          ],
        },
      ],
    },
  ],
};
