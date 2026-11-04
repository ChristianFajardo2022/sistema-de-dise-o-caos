import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { cn } from '../../utils/cn';
import { Calendar } from './Calendar';
import type { CalendarCellState, CalendarRangeCellState, CalendarRangeProps, CalendarSingleProps } from './Calendar.types';
import { calendarVariants } from './Calendar.variants';
import { CalendarDayCell, CalendarPeriodCell, CalendarRangeCell } from './CalendarCells';

/*
 * Contenido de la página de documentación de Calendar (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Calendar.tsx`, `CalendarCells.tsx`, `CalendarGrids.tsx`, `Calendar.variants.ts`), luego `Calendar.docs.json`.
 * Las muestras usan fechas fijas (hoy = 23 de octubre de 2026) para no depender del reloj del equipo.
 * Diferencias con Figma: Figma no dibuja el foco de teclado ni el anillo de hoy; los días de la semana de Only date
 * enlazan un primitivo (el código usa text/neutral/gray-2); los días de meses vecinos usan en Figma una variable que no
 * está en tokens.css. Las celdas `select` (inicio sin fin) y `full-curve` (banda de un solo día) son del código.
 */

// Figma: 8098:2263 (component set Calendar), Number cell (Date range), Number cell (Only day), Month cell y Year cell

const TODAY = new Date(2026, 9, 23);
const OCTOBER = new Date(2026, 9, 1);
const PICKED = new Date(2026, 9, 14);
/** Rango del domingo 11 al miércoles 28: pasa por Active firts, Half active, Right curve, Left curve y Active finish. */
const RANGE = { start: new Date(2026, 9, 11), end: new Date(2026, 9, 28) };

/** Calendario de una fecha con fecha de hoy y mes fijos. */
const single = (props: Partial<CalendarSingleProps> = {}) => (
  <Calendar today={TODAY} defaultMonth={OCTOBER} defaultValue={PICKED} {...props} />
);

/** Calendario de rango con fecha de hoy y mes fijos. */
const range = (props: Partial<Omit<CalendarRangeProps, 'mode'>> = {}) => (
  <Calendar mode="range" today={TODAY} defaultMonth={OCTOBER} defaultValue={RANGE} {...props} />
);

/** Fila de muestras con clave (evita el aviso de React en modo dev). */
const row = (...items: ReactNode[]) => (
  <div className="flex items-center gap-ds-space-general-lg">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Celda de día de Only date (61 de ancho en Figma). */
const day = (state: CalendarCellState, text = '14', props: Partial<ComponentProps<typeof CalendarDayCell>> = {}) => (
  <div className="w-15">
    <CalendarDayCell state={state} tabIndex={-1} {...props}>
      {text}
    </CalendarDayCell>
  </div>
);

/** Celda de mes de la vista Mes. */
const month = (state: CalendarCellState) => (
  <div className="w-24">
    <CalendarPeriodCell period="month" state={state} tabIndex={-1} className="text-ds-typography-field-size-xs">
      Octubre
    </CalendarPeriodCell>
  </div>
);

/** Celda de año de la vista Año. */
const year = (state: CalendarCellState) => (
  <div className="w-20">
    <CalendarPeriodCell period="year" state={state} tabIndex={-1}>
      2026
    </CalendarPeriodCell>
  </div>
);

/** Celdas de Date range seguidas, sin separación (la banda es continua), 56 de ancho como en Figma. */
const strip = (...cells: [CalendarRangeCellState, string][]) => (
  <div className="flex">
    {cells.map(([state, text]) => (
      <div key={text} className="w-14">
        <CalendarRangeCell state={state} tabIndex={-1}>
          {text}
        </CalendarRangeCell>
      </div>
    ))}
  </div>
);

/** Foco de teclado forzado solo para documentar: el mismo contorno que da `:focus-visible` en las celdas. */
const focused = (content: ReactNode) => (
  <div className="[&_button]:outline-2 [&_button]:-outline-offset-2 [&_button]:outline-solid [&_button]:outline-ds-border-field-active">
    {content}
  </div>
);

/**
 * Celdas sobre la superficie del calendario (las mismas clases del contenedor): en claro, el relleno Default y Hover de
 * las celdas casi no se distingue del panel de la documentación, pero sí de su superficie real.
 */
const surface = (content: ReactNode) => <div className={cn(calendarVariants(), 'w-auto max-w-none')}>{content}</div>;
const onSurface = (items: ReactNode[]) => items.map((item, i) => <Fragment key={i}>{surface(item)}</Fragment>);

/** Muestras de un estado: día, mes y año de Only date en fila, y debajo la celda de Date range. */
const cellsOf = (state: CalendarCellState) => [row(day(state), month(state), year(state)), strip([state, '14'])];

/** Textos en inglés para el par de Do and Dont’s de idioma. */
const LABELS_EN = {
  calendar: 'Calendar',
  previous: { day: 'Previous month', month: 'Previous year', year: 'Previous years' },
  next: { day: 'Next month', month: 'Next year', year: 'Next years' },
  views: { day: 'Day', month: 'Month', year: 'Year' },
  changeView: 'change view',
  cancel: 'Clear',
  apply: 'Apply',
};

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Día, mes o año que se puede elegir. Círculo o píldora con el relleno neutro de campo.',
    samples: onSurface(cellsOf('default')),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero, el relleno pasa a <code>background/field/hover</code>; en claro vale lo mismo que Default.
      </>
    ),
    samples: onSurface(cellsOf('hover')),
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: (
      <>
        Con teclado, la celda activa lleva un contorno interior de 2 px. Solo una celda de la cuadrícula está en el orden de tabulación.
      </>
    ),
    samples: onSurface([focused(row(day('default'), month('default'), year('default')))]),
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        La fecha elegida: relleno púrpura y <code>aria-selected</code>. En las vistas Mes y Año se marca el mes o el año de esa fecha. En Date range es el inicio mientras falta el fin.
      </>
    ),
    samples: onSurface([row(day('select'), month('select'), year('select')), strip(['select', '12'])]),
  },
  {
    label: 'Active firts y Active finish',
    tone: 'accent',
    description: 'Inicio y fin de un rango. El círculo púrpura lleva la banda del tramo hacia el lado interior. Mientras falta el fin, el puntero o el foco dibujan este tramo hasta su día.',
    samples: onSurface([strip(['active-first', '12'], ['half-active', '13'], ['active-finish', '14'])]),
  },
  {
    label: 'Half active',
    tone: 'accent',
    description: 'Días entre el inicio y el fin. Solo la banda del tramo, sin bordes redondeados, para que se lea continua.',
    samples: onSurface([strip(['half-active', '13'], ['half-active', '14'], ['half-active', '15'])]),
  },
  {
    label: 'Left curve y Right curve',
    tone: 'accent',
    description: (
      <>
        Tramo que empieza o termina una fila de la semana o el mes: la banda se redondea en ese borde. Un tramo de un solo día en su fila se redondea a los dos lados (<code>full-curve</code>, solo en código).
      </>
    ),
    samples: onSurface([strip(['half-active', '16'], ['right-curve', '17']), strip(['left-curve', '18'], ['half-active', '19'])]),
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Fuera de <code>minDate</code> y <code>maxDate</code> o bloqueado con <code>isDateDisabled</code>: sin relleno, texto atenuado y <code>aria-disabled</code>. Los días de meses vecinos se ven igual y no se anuncian.
      </>
    ),
    samples: onSurface([row(day('disabled', '6'), month('disabled'), year('disabled')), strip(['disabled', '6'])]),
  },
];

export const doc: ComponentDocContent = {
  name: 'Calendar',
  icon: 'calendar',
  classification: 'composicion',
  summary:
    'Calendar es la composición para elegir una fecha o un rango a la vista. Une la navegación por mes, las vistas de día, mes y año, la cuadrícula de días y un pie opcional con dos acciones. Es la pieza que DatePicker abre debajo de su campo.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un contenedor con encabezado de navegación, una cuadrícula de días, meses o años y, si se pide, el pie con dos botones.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Una fecha (Only date)',
                  // La fecha elegida en el borde derecho de la cuadrícula: la línea del marcador no cruza otras celdas
                  preview: single({ showActions: true, defaultValue: new Date(2026, 9, 31), className: 'w-md' }),
                  marks: [
                    { n: 1, selector: '[data-mode="single"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Date Text"]', side: 'top' },
                    { n: 3, selector: 'button[aria-label$="cambiar vista"]', side: 'top' },
                    { n: 4, selector: '[role="columnheader"]', index: 0, side: 'left' },
                    { n: 5, selector: '[role="gridcell"][aria-selected="true"]', side: 'right' },
                    // El botón entero (no su texto): la línea sale de su borde derecho sin cruzar Filtrar
                    { n: 6, selector: '[data-mode="single"] > div:last-child > button', index: -1, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-mode="single"]', side: 'left' },
                    { kind: 'gap', from: '[data-mode="single"] > div > div', fromIndex: 0, to: '[role="grid"]', axis: 'y' },
                    { kind: 'gap', from: '[data-mode="single"] > div', fromIndex: 0, to: '[data-mode="single"] > div', toIndex: 1, axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> relleno <code>background/field/surface</code>, radio de 24 (<code>radius/field/lg</code>), padding de 16 (<code>space/field/lg</code>) y trazo interior de 1 px. Hasta 448 px de ancho; Figma lo dibuja a 413.
                </>,
                <>
                  <strong>Título:</strong> ícono calendar de 16 px en fill y el mes visible en 16/20 (<code>typography/field/size/md</code>). Es una región viva: al cambiar de mes, el lector anuncia el nuevo título.
                </>,
                <>
                  <strong>Navegación:</strong> dos Button secondary xs de solo ícono (32 × 32, chevron de 16 px) a los lados de un chip que cambia la vista: Día, Mes, Año y de vuelta a Día. Separados 8 px.
                </>,
                <>
                  <strong>Días de la semana:</strong> dos letras sin tilde en 12/16 (<code>typography/field/size/xs</code>). Cada uno lleva el nombre completo para el lector. La semana empieza en domingo (<code>weekStartsOn</code>).
                </>,
                <>
                  <strong>Celda de día:</strong> círculo con padding de 4 (<code>space/field/day-cells/sm</code>) y número en 14/18 (<code>typography/field/size/sm</code>). Columnas y filas separadas 8 px. Hoy lleva un anillo de 1 px y <code>aria-current=&quot;date&quot;</code>.
                </>,
                <>
                  <strong>Pie:</strong> con <code>showActions</code>, un Button secondary high y un Button primary, los dos sm, a 32 px del cuerpo. Dicen Limpiar y Filtrar (<code>labels.cancel</code> y <code>labels.apply</code>); DatePicker los cambia a Cancelar y Aplicar.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Rango (Date range)',
                  preview: range({ showActions: true }),
                  marks: [
                    { n: 1, selector: 'button:has([data-figma-part="Label"])', index: 0, side: 'top' },
                    { n: 2, selector: 'button[aria-label="Mes anterior"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Date Range Text"]', index: 0, side: 'left' },
                    { n: 4, selector: '[data-figma-state="active-first"]', side: 'left' },
                    { n: 5, selector: '[data-figma-state="left-curve"]', index: 0, side: 'left' },
                    { n: 6, selector: '[data-figma-state="active-finish"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'button:has([data-figma-part="Label"])', index: 1 },
                    { kind: 'gap', from: 'button:has([data-figma-part="Label"])', fromIndex: 0, to: 'button:has([data-figma-part="Label"])', toIndex: 1 },
                    { kind: 'padding', selector: '[data-figma-state="default"]', index: 0, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Campos Mes y Año:</strong> desplegables de 56 de alto (48 en Mobile), radio de 16 y separados 12 px. Cada uno abre una lista (DropdownMenu) para saltar a otro mes o año. El campo abierto lleva el borde activo.
                </>,
                <>
                  <strong>Navegación:</strong> anterior y siguiente a los lados del título de los meses visibles, en 16/22 (<code>typography/body/size/lg</code>; 14/20 en Mobile).
                </>,
                <>
                  <strong>Meses:</strong> dos lado a lado desde Tablet, cada uno con su título en 14/18, separados 16 px por una línea de 1 px. En Mobile, uno solo.
                </>,
                <>
                  <strong>Inicio:</strong> círculo púrpura (Active firts) con la banda del tramo hacia la derecha. La celda mide lo que su columna y tiene padding de 4 (<code>space/field/xs</code>; 2 en Mobile).
                </>,
                <>
                  <strong>Tramo:</strong> banda <code>background/acent/tertiary-opacity</code> sin separación entre columnas, para que se lea continua. Se redondea donde empieza una fila (Left curve) y donde termina (Right curve).
                </>,
                <>
                  <strong>Fin:</strong> círculo púrpura (Active finish) con la banda hacia la izquierda. Todos los días del rango llevan <code>aria-selected</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Vista Mes',
                  preview: single({ defaultView: 'month', className: 'w-md' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Month Text Only"]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Month"]', index: 0, side: 'left' },
                    { n: 3, selector: '[role="gridcell"][aria-selected="true"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-cal-cell]', index: 0 },
                    { kind: 'padding', selector: '[data-cal-cell]', index: 4, side: 'left' },
                  ],
                },
                {
                  label: 'Vista Año',
                  preview: single({ defaultView: 'year', className: 'w-md' }),
                  marks: [
                    { n: 4, selector: '[data-figma-part="Year Text Only"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Year"]', index: 0, side: 'left' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-cal-cell]', fromIndex: 0, to: '[data-cal-cell]', toIndex: 1 }],
                },
              ],
              guidelines: [
                <>
                  <strong>Título de la vista Mes:</strong> el año visible. Anterior y siguiente cambian de año.
                </>,
                <>
                  <strong>Celda de mes:</strong> píldora de 42 de alto con padding de 12 arriba y abajo (<code>space/field/day-cells/lg</code>) y 8 a los lados (<code>space/field/day-cells/md</code>), texto en 12. Tres por fila.
                </>,
                <>
                  <strong>Mes elegido:</strong> el de la fecha elegida, en púrpura. Elegir un mes vuelve a la vista Día en ese mes.
                </>,
                <>
                  <strong>Título de la vista Año:</strong> la página de 20 años (2020 – 2039). Anterior y siguiente pasan de página.
                </>,
                <>
                  <strong>Celda de año:</strong> la misma píldora con el año en 14/18, cuatro por fila y separadas 8 px. Elegir un año lleva a la vista Mes.
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
          Calendar tiene 8 estados en sus celdas. Los decide el calendario según la selección, el puntero, el teclado y los límites; no hay una prop <code>state</code> en Calendar. Las muestras usan las celdas internas sobre la superficie del calendario, y Focus se fuerza solo para documentar.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default de cada parte y de los estados que cambian el color. Los botones del pie usan los de Button. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Contenedor y encabezado',
              preview: single({ className: 'w-md' }),
              entries: [
                { part: 'Fondo', color: 'background-field-surface' },
                { part: 'Trazo', color: 'border-field-default' },
                { part: 'Ícono del título', color: 'icon-acent-secondary' },
                { part: 'Título', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Chevron de navegación', color: 'icon-general-default' },
                { part: 'Trazo del chip', color: 'border-general-gray-tertiary' },
                { part: 'Texto del chip', color: 'text-neutral-white', text: 'typography-button-size-sm' },
                { part: 'Días de la semana', color: 'text-neutral-gray-2', text: 'typography-field-size-xs' },
              ],
            },
            {
              title: 'Celdas',
              preview: surface(
                <div className="flex flex-col items-center gap-ds-space-general-lg">
                  {row(day('default'), day('hover', '15'), day('select', '16'))}
                  {row(day('disabled', '6'), day('default', '23', { today: true }))}
                </div>
              ),
              entries: [
                { part: 'Fondo', color: 'background-field-default' },
                { part: 'Fondo (Hover)', color: 'background-field-hover' },
                { part: 'Fondo (Select)', color: 'background-field-active-purpple' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-sm' },
                { part: 'Texto (Select)', color: 'text-neutral-white-unicolor' },
                { part: 'Texto (Disabled)', color: 'text-neutral-disabled-on-canva' },
                { part: 'Anillo de hoy y foco', color: 'border-field-active' },
              ],
            },
            {
              title: 'Rango',
              preview: surface(strip(['active-first', '12'], ['half-active', '13'], ['right-curve', '14'])),
              entries: [
                { part: 'Banda del tramo', color: 'background-acent-tertiary-opacity' },
                { part: 'Círculo de inicio y fin', color: 'background-field-active-purpple' },
                { part: 'Texto en el círculo', color: 'text-neutral-white-unicolor' },
                { part: 'Texto en la banda', color: 'text-neutral-white', text: 'typography-field-size-sm' },
                { part: 'Línea entre meses', color: 'border-general-default-on-card' },
                { part: 'Título de cada mes', color: 'text-neutral-white', text: 'typography-field-size-sm' },
                { part: 'Título de navegación', color: 'text-neutral-white', text: 'typography-body-size-lg' },
              ],
            },
            {
              title: 'Campos Mes y Año',
              // Caja con el ancho máximo del calendario de rango (460 en Mobile, 740 desde Tablet): el ancho mínimo no
              // depende de la escala de la vista
              preview: <div className="w-ds-dimention-field-calendar-calendar-max">{range()}</div>,
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Borde (abierto)', color: 'border-field-active' },
                { part: 'Label', color: 'text-field-label-secondary', text: 'typography-field-size-xs' },
                { part: 'Valor', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: 'Chevron', color: 'icon-general-default' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Calendar en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Calendar en la librería de Assets. Sus propiedades son Type, Date y los textos Month 1 y Month 2.
            </>,
            <>
              <strong>Type y Date:</strong> Only date es <code>mode=&quot;single&quot;</code> y Date range es <code>mode=&quot;range&quot;</code>. Day, Month y Year son <code>view</code> o <code>defaultView</code>. En Date range, Month y Year no cambian el cuerpo: marcan el campo Mes o Año abierto.
            </>,
            <>
              <strong>Celdas:</strong> los sets Number cell (Only day), Number cell (Date range), Month cell y Year cell. Su State lo pone el calendario según la selección y los límites. El código agrega dos estados que Figma no tiene: el inicio sin fin y la banda de un solo día.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja el foco de teclado ni el anillo de hoy. Month 1 y Month 2 son textos fijos; en código salen del mes visible y de <code>locale</code>. El State Active firts se escribe así en Figma (con errata) y en código es <code>active-first</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo Calendar es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Fechas cercanas:</strong> agendar una reunión o elegir un plazo. Ver la semana y el mes ayuda a decidir.
            </>,
            <>
              <strong>Rangos:</strong> con <code>mode=&quot;range&quot;</code>, el primer clic marca el inicio y el segundo el fin. Un clic anterior al inicio empieza otro rango.
            </>,
            <>
              <strong>Fechas con límites:</strong> <code>minDate</code>, <code>maxDate</code> e <code>isDateDisabled</code> atenúan y bloquean los días que no se pueden elegir.
            </>,
            <>
              <strong>Dentro de un popover o diálogo:</strong> <code>autoFocus</code> lleva el foco al día activo y <code>showActions</code> agrega el pie con <code>onApply</code> y <code>onCancel</code>.
            </>,
            <>
              <strong>Teclado completo:</strong> patrón APG de cuadrícula. Flechas, Inicio y Fin recorren los días; Re Pág y Av Pág cambian de mes, y con Mayús, de año.
            </>,
          ],
          avoid: [
            <>
              <strong>Campo de formulario:</strong> un calendario siempre abierto ocupa mucho espacio. (Alternativa: <code>DatePicker</code>).
            </>,
            <>
              <strong>Fechas lejanas y conocidas:</strong> una fecha de nacimiento obliga a recorrer muchos años. (Alternativa: <code>DatePicker</code> escrito o <code>TripleSelect</code>).
            </>,
            <>
              <strong>Horas:</strong> Calendar solo elige días. (Alternativa: <code>TimePicker</code>).
            </>,
            <>
              <strong>Pocas fechas posibles:</strong> si solo hay tres o cuatro opciones, una cuadrícula con casi todo bloqueado confunde. (Alternativa: <code>Radio</code> o <code>Select</code>).
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
                title: 'Una fecha',
                bullets: [
                  <>
                    <strong>Hasta 448 px de ancho</strong> (<code>max-w-md</code>): las celdas se reparten el ancho en siete columnas separadas 8 px.
                  </>,
                  <>
                    <strong>Celdas:</strong> radio de 48 (<code>radius/field/full</code>), 24 en Tablet y Mobile. Al ancho de Figma (413) la celda mide unos 48 px y queda redonda en los tres.
                  </>,
                ],
                preview: single({ showActions: true }),
              },
              {
                title: 'Rango',
                bullets: [
                  <>
                    <strong>Ancho fijo de 740:</strong> <code>dimention/field/calendar</code> min y max, con dos meses lado a lado.
                  </>,
                  <>
                    <strong>Campos de 56 de alto</strong> y título de navegación en 16/22.
                  </>,
                ],
                preview: range({ showActions: true }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Un solo mes en Date range:</strong> el calendario ocupa el ancho disponible, hasta 460 px.
              </>,
              <>
                <strong>Medidas:</strong> campos de 48 de alto con padding de 4 arriba y abajo, título de navegación en 14/20 y padding de 2 en la celda de rango.
              </>,
              <>
                <strong>Pie apilado:</strong> los botones ocupan todo el ancho, miden 40 de alto y Filtrar va arriba.
              </>,
            ],
            preview: range({ showActions: true }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> las mismas de Desktop: 740 de ancho en Date range y campos de 56.
              </>,
              <>
                <strong>Dos meses</strong> lado a lado desde 48rem, separados por una línea.
              </>,
              <>
                <strong>Pie en fila</strong> y alineado a la derecha, como en Desktop.
              </>,
            ],
            preview: range({ showActions: true }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de límites, idioma y mes inicial.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Días pasados bloqueados',
              description: (
                <>
                  Bloquea con <code>minDate</code> y <code>maxDate</code> las fechas que no se pueden elegir.
                </>
              ),
              preview: single({ defaultValue: null, minDate: TODAY }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Todos los días abiertos',
              description: 'No dejes elegir fechas que el formulario va a rechazar después.',
              preview: single({ defaultValue: null }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Idioma completo',
              description: (
                <>
                  Si cambias <code>locale</code>, traduce también los textos con <code>labels</code>.
                </>
              ),
              preview: single({ locale: 'en', labels: LABELS_EN, showActions: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Idiomas mezclados',
              description: (
                <>
                  No cambies solo <code>locale</code>: los botones y el chip siguen en español.
                </>
              ),
              preview: single({ locale: 'en', showActions: true }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Mes de la fecha elegida',
              description: 'Deja el mes inicial por defecto: la fecha elegida se ve y se confirma sin navegar.',
              preview: single(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Otro mes al abrir',
              description: (
                <>
                  No fijes un <code>defaultMonth</code> distinto: hay que navegar para encontrar la fecha elegida.
                </>
              ),
              preview: single({ defaultMonth: new Date(2026, 6, 1) }),
            },
          ],
        },
      ],
    },
  ],
};
