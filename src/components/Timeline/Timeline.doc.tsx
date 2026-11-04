import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { StatusTracker } from './StatusTracker';
import { Timeline } from './Timeline';
import type { TimelineItemData, TimelineStatus } from './Timeline.types';

/*
 * Contenido de la página de documentación de Timeline (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Timeline.types.ts`, `Timeline.variants.ts`, `Timeline.tsx`, `TimelineItem.tsx`, `StatusTracker.tsx`), luego
 * `Timeline.docs.json`. StatusTracker, el seguimiento horizontal con resumen, se documenta dentro de esta página: es un
 * grupo de Anatomía, un grupo de Tokens, una columna y una tarjeta de breakpoints y viñetas de Uso en Figma.
 * Medidas: barra de 16 (ancho en vertical, alto en horizontal), nodo de 8 (anillo de 12 en Currently, Warning y Error),
 * 16 entre barra y texto en vertical y 12 en horizontal, título 14/18 semibold, descripción 14/20 y fecha 10/14.
 * Diferencias con Figma: Figma solo dibuja el Timeline vertical (la horizontal sale del Indicator) y no define el
 * ícono del nodo, `dateTime`, el texto de estado para lector de pantalla ni la región `live`.
 */

// Figma: 13687:11466 (component set Timeline), 13576:32508 (component set Indicator) y 13770:10884 (Status tracker)

/** Paso de ejemplo del estado dado, con título, descripción y fecha. */
const step = (status: TimelineStatus, title: string, description?: string, when = true): TimelineItemData => ({
  title,
  description,
  date: when ? 'Hoy' : undefined,
  time: when ? '8:00pm' : undefined,
  status,
});

/** Timeline vertical (o la orientación que pida cada muestra) con los pasos dados. */
const timeline = (items: TimelineItemData[], orientation: 'vertical' | 'horizontal' = 'vertical') => (
  <Timeline orientation={orientation} items={items} />
);

/** Seguimiento de seis pasos con el segundo en curso. La figura del paso actual es un círculo, sin imágenes. */
const TRACKER_STEPS: TimelineItemData[] = [
  { title: 'Recibido', date: 'Hoy', time: '8:00pm', status: 'complete' },
  { title: 'En revisión', date: 'Hoy', time: '8:00pm', status: 'current' },
  { title: 'En proceso', date: 'Hoy', time: '8:00pm', status: 'incomplete' },
  { title: 'Verificado', date: 'Hoy', time: '8:00pm', status: 'incomplete' },
  { title: 'Aprobado', date: 'Hoy', time: '8:00pm', status: 'incomplete' },
  { title: 'Listo', date: 'Hoy', time: '8:00pm', status: 'incomplete' },
];

/**
 * Pasos sin fecha ni hora, para las muestras que se ven con la ventana de Mobile (anatomía, tokens y la tarjeta Mobile):
 * ahí el texto de los pasos horizontales queda oculto y la fecha no aporta a la vista.
 */
const withoutDates = (steps: TimelineItemData[]): TimelineItemData[] => steps.map(({ date: _date, time: _time, ...rest }) => rest);

const marker = () => <span className="block size-8 rounded-ds-radius-general-full bg-ds-background-acent-tertiary" />;

/** StatusTracker con referencia, figura y botón de historial (o sin ellos). */
const tracker = (steps: TimelineItemData[] = TRACKER_STEPS, withHistory = true) => (
  <StatusTracker items={steps} reference="Solicitud 2026-0142" marker={marker()} onShowHistory={withHistory ? () => {} : undefined} />
);

const states: DocStateItem[] = [
  {
    label: 'Incomplete',
    tone: 'neutral',
    description: (
      <>
        Paso pendiente (<code>incomplete</code>). Nodo apagado de 8, barra sin avance y título en el color de texto de cuerpo (<code>text/neutral/body</code>).
      </>
    ),
    samples: [timeline([step('incomplete', 'Aprobación', 'Aún no empieza.')])],
  },
  {
    label: 'Currently',
    tone: 'accent',
    description: (
      <>
        Paso en curso (<code>current</code>). Anillo de 12 con núcleo de acento, barra a la mitad y título de acento. Es el único con <code>aria-current=&quot;step&quot;</code>.
      </>
    ),
    samples: [timeline([step('current', 'En revisión', 'Un equipo valida los datos.')])],
  },
  {
    label: 'Warning',
    tone: 'alert',
    description: (
      <>
        Paso con advertencia (<code>warning</code>). Anillo y título de advertencia, y barra a la mitad.
      </>
    ),
    samples: [timeline([step('warning', 'Falta confirmar', 'Falta un dato opcional.')])],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Paso con error (<code>error</code>). Anillo y título de error, y barra a la mitad.
      </>
    ),
    samples: [timeline([step('error', 'Archivo rechazado', 'Falta adjuntar el archivo.')])],
  },
  {
    label: 'Check',
    tone: 'success',
    description: (
      <>
        Paso completado (<code>complete</code>). Nodo de 8 con el color de fondo del tema (<code>background/general/black</code>), barra completa y título en texto principal (<code>text/neutral/white</code>).
      </>
    ),
    samples: [timeline([step('complete', 'Recibido', 'Registrado sin cambios.')])],
  },
];

/** Los tres pasos de un caso bueno o malo de Do and Dont’s. */
const trio = (a: TimelineItemData, b: TimelineItemData, c: TimelineItemData) => <div className="w-full">{timeline([a, b, c])}</div>;

export const doc: ComponentDocContent = {
  name: 'Timeline',
  icon: 'clock',
  classification: 'molecula',
  summary:
    'El Timeline es la molécula para mostrar los pasos de un proceso en orden, cada uno con su estado, texto, fecha y hora, en vertical u horizontal. Incluye el StatusTracker, que resume el paso actual sobre una línea horizontal.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Una lista ordenada de pasos. Cada paso une una barra con su nodo y un bloque de texto. El StatusTracker suma encima una figura y debajo un botón de historial.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Timeline vertical',
                  preview: (
                    <div className="w-[335px]">
                      {timeline([
                        step('complete', 'Recibido', 'La solicitud quedó registrada.'),
                        step('current', 'En revisión', 'Un equipo valida los datos.'),
                        step('incomplete', 'Listo', 'Podrás descargarlo cuando esté disponible.'),
                      ])}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Indicator"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Step indicator"]', index: 1, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Text"]', index: 2, side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Title"]', index: 0, side: 'right' },
                    { n: 5, selector: '[data-figma-part="Description"]', index: 1, side: 'right' },
                    { n: 6, selector: '[data-figma-part="Fecha"]', index: 2, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Text"]', index: 1, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Barra:</strong> 16 de ancho y del alto del paso, con 16 de padding superior (<code>space/general/2xl</code>). Se rellena según el avance (<code>progress</code>) y redondea sus extremos con <code>radius/general/full</code> en el primer y el último paso.
                </>,
                <>
                  <strong>Nodo:</strong> punto de 8 en Incomplete y Check, o anillo de 12 con núcleo de 8 en Currently, Warning y Error. El slot <code>icon</code> lo centra sin cambiar su tamaño: usa <code>Icon</code> de 12.
                </>,
                <>
                  <strong>Texto:</strong> columna con 12 de padding vertical (<code>space/general/xl</code>) y 4 entre líneas (<code>space/general/md</code>), a 16 de la barra.
                </>,
                <>
                  <strong>Título:</strong> 14 con alto de línea de 18, semibold. Su color cambia con el estado y lleva antes el estado en texto oculto ("En curso: ").
                </>,
                <>
                  <strong>Descripción:</strong> 14 con alto de línea de 20, regular. Es opcional: sin ella no se dibuja.
                </>,
                <>
                  <strong>Fecha y hora:</strong> 10 con alto de línea de 14, con 4 entre ambas. Con <code>dateTime</code> se dibujan dentro de un <code>&lt;time&gt;</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Timeline horizontal',
                  preview: (
                    <div className="w-[600px]">
                      {timeline(
                        [step('complete', 'Recibido', undefined, false), step('current', 'En revisión', undefined, false), step('incomplete', 'Listo', undefined, false)],
                        'horizontal',
                      )}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Indicator"]', index: 1, side: 'top' },
                    { n: 2, selector: '[data-figma-part="Step indicator"]', index: 1, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Text"]', index: 1, side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Title"]', index: 1, side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Indicator"]', index: 1, side: 'left' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Barra:</strong> 16 de alto y del ancho del paso, con 4 de padding lateral (<code>space/general/md</code>). Los pasos se reparten el ancho por igual.
                </>,
                <>
                  <strong>Nodo:</strong> el mismo punto o anillo, pegado a la izquierda de la barra.
                </>,
                <>
                  <strong>Texto:</strong> va debajo de la barra, a 12 (<code>space/general/xl</code>). En Mobile se oculta a la vista y queda para el lector de pantalla.
                </>,
                <>
                  <strong>Título:</strong> las mismas medidas que en vertical.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'StatusTracker',
                  width: 1094,
                  preview: tracker(withoutDates(TRACKER_STEPS)),
                  marks: [
                    { n: 1, selector: '[data-current-index]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Indicator"]', index: 5, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Step indicator"]', index: 3, side: 'top' },
                    { n: 4, selector: '[data-figma-part="Title"]', index: 1, side: 'bottom' },
                    { n: 5, selector: '[data-figma-part="Button"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Car"]', to: '[data-figma-part="Timeline"]', axis: 'y' },
                    { kind: 'gap', from: '[data-figma-part="Timeline"]', to: '[data-figma-part="Button"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Figura:</strong> slot <code>marker</code> de 41 de alto sobre el paso actual. Es decorativo (<code>aria-hidden</code>) y se desplaza entre pasos en 500 ms.
                </>,
                <>
                  <strong>Barra:</strong> la de un Timeline horizontal, a 16 de la figura (<code>space/general/2xl</code>).
                </>,
                <>
                  <strong>Nodo:</strong> uno por paso; el del paso en curso es un anillo.
                </>,
                <>
                  <strong>Título:</strong> bajo la barra, sin descripción (el StatusTracker la ignora). La fecha y la hora, si las pasas, van debajo como en el Timeline.
                </>,
                <>
                  <strong>Botón de historial:</strong> <code>Button</code> tertiary de tamaño md, a 16 de la barra. Aparece con <code>onShowHistory</code> o se reemplaza con <code>historyAction</code>.
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
          Timeline no es interactivo: sus estados son variantes de aspecto. Tiene 5, uno por valor de <code>status</code> de cada paso. El avance de la barra (<code>progress</code>) sale del estado, pero puedes fijarlo en 0, 50 o 100.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada estado. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Barra',
              preview: timeline([step('complete', 'Recibido', undefined, false), step('current', 'En revisión', undefined, false), step('incomplete', 'Listo', undefined, false)]),
              entries: [
                { part: 'Barra sin avance (0%)', color: 'background-general-gray-seventh' },
                { part: 'Barra completa (100%)', color: 'background-general-white' },
                { part: 'Degradado al 50% (inicio)', color: 'background-general-gray-seventh' },
                { part: 'Degradado al 50% (final)', color: 'background-general-white' },
              ],
            },
            {
              title: 'Incomplete',
              preview: timeline([step('incomplete', 'Aprobación', 'Aún no empieza.')]),
              entries: [
                { part: 'Nodo', color: 'background-general-gray-fifth' },
                { part: 'Título', color: 'text-neutral-body', text: 'typography-body-size-md' },
                { part: 'Descripción', color: 'text-neutral-body', text: 'typography-body-size-md' },
                { part: 'Fecha y hora', color: 'text-neutral-body', text: 'typography-body-size-xs' },
              ],
            },
            {
              title: 'Currently',
              preview: timeline([step('current', 'En revisión', 'Un equipo valida los datos.')]),
              entries: [
                { part: 'Anillo', color: 'background-acent-secondary' },
                { part: 'Núcleo', color: 'background-acent-tertiary' },
                { part: 'Título', color: 'text-acent-firts', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Warning',
              preview: timeline([step('warning', 'Falta confirmar', 'Falta un dato opcional.')]),
              entries: [
                { part: 'Anillo', color: 'background-semantic-alert-firts' },
                { part: 'Núcleo', color: 'background-semantic-alert-fourth' },
                { part: 'Título', color: 'text-semantic-alert-secondary', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Error',
              preview: timeline([step('error', 'Archivo rechazado', 'Falta adjuntar el archivo.')]),
              entries: [
                { part: 'Anillo', color: 'background-semantic-error-firts' },
                { part: 'Núcleo', color: 'background-semantic-error-tertiary' },
                { part: 'Título', color: 'text-semantic-error-secondary', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Check',
              preview: timeline([step('complete', 'Recibido', 'Registrado sin cambios.')]),
              entries: [
                { part: 'Nodo', color: 'background-general-black' },
                { part: 'Título', color: 'text-neutral-white', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'StatusTracker',
              preview: tracker(withoutDates(TRACKER_STEPS.slice(0, 2)), false),
              entries: [
                { part: 'Título "Estado actual" (Mobile)', color: 'text-neutral-white', text: 'typography-body-size-md' },
                { part: 'Referencia (Mobile)', color: 'text-neutral-body', text: 'typography-body-size-md' },
                { part: 'Botón de historial', color: 'text-button-tertiary-default' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Timeline en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el paso suelto como Indicator en la librería de Assets. Timeline apila los pasos con un slot (Espacio): en código es <code>items</code> o <code>TimelineItem</code> como <code>children</code>. Status tracker es otro componente: en código es <code>StatusTracker</code>.
            </>,
            <>
              <strong>Orientation, Type y Percentage en Indicator:</strong> Orientation es <code>orientation</code>. Type (Initial, Middle, Finally) es <code>position</code> (<code>initial</code>, <code>middle</code>, <code>finally</code>); sin él, sale del lugar del paso. Percentage (0%, 50%, 100) es <code>progress</code> (0, 50, 100).
            </>,
            <>
              <strong>State en Indicator:</strong> Incomplete, Currently, Warning, Error y Check son <code>status</code>: <code>incomplete</code>, <code>current</code>, <code>warning</code>, <code>error</code> y <code>complete</code>. Title text, Description text, Date text y Hour text son <code>title</code>, <code>description</code>, <code>date</code> y <code>time</code>; Description desactivada es omitir <code>description</code>.
            </>,
            <>
              <strong>Button history en Status tracker:</strong> es <code>onShowHistory</code> (texto en <code>historyLabel</code>) o el slot <code>historyAction</code>. La figura sobre el paso actual es el slot <code>marker</code>: el componente no trae imagen.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> Timeline solo existe en vertical, y la horizontal sale del Indicator. Figma tampoco dibuja el ícono del nodo (<code>icon</code>), <code>dateTime</code>, el texto de estado para lector de pantalla ni la región <code>live</code> del StatusTracker.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Timeline es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Historial de un proceso:</strong> pasos en orden, cada uno con estado, fecha y hora. Pásalos como datos en <code>items</code> o compón con <code>TimelineItem</code>.
            </>,
            <>
              <strong>Resumen del estado actual:</strong> usa <code>StatusTracker</code> para ver todo el recorrido en una línea, con el paso en curso destacado y un botón para abrir el historial.
            </>,
            <>
              <strong>Estado que se lee, no solo se ve:</strong> cada paso antepone su estado en texto oculto (&quot;Completado: &quot;, &quot;En curso: &quot;…). Cámbialo con <code>statusLabels</code> o <code>statusLabel</code>.
            </>,
            <>
              <strong>Lista con nombre:</strong> es una lista ordenada. Si no hay un encabezado cerca, pasa <code>aria-label</code> o <code>aria-labelledby</code>. Solo el paso <code>current</code> lleva <code>aria-current=&quot;step&quot;</code>.
            </>,
            <>
              <strong>Cambios anunciados:</strong> con <code>live=&quot;polite&quot;</code> el StatusTracker anuncia el paso nuevo (<code>assertive</code> solo para errores). El primer render no se anuncia. La figura salta sin animar con <code>prefers-reduced-motion</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Pasos que la persona recorre y completa:</strong> el Timeline informa, no guía. (Alternativa: <code>Stepper</code>).
            </>,
            <>
              <strong>Avance de una sola tarea:</strong> un porcentaje no son pasos con nombre. (Alternativa: <code>ProgressBar</code>).
            </>,
            <>
              <strong>Un solo aviso:</strong> un mensaje suelto no necesita línea de tiempo. (Alternativa: <code>Alert</code>).
            </>,
            <>
              <strong>Un seguimiento de un solo paso:</strong> el StatusTracker pide al menos dos para que la barra tenga principio y final.
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
                title: 'Timeline',
                bullets: [
                  <>
                    <strong>Pasos:</strong> barra de 16 y nodo de 8, a 16 del texto. El Timeline ocupa todo el ancho disponible.
                  </>,
                  <>
                    <strong>Horizontal:</strong> los pasos se reparten el ancho y cada texto queda bajo su barra.
                  </>,
                ],
                preview: <div className="w-full">{timeline([step('complete', 'Recibido', 'Registrado sin cambios.'), step('current', 'En revisión', 'Un equipo valida los datos.')])}</div>,
              },
              {
                title: 'StatusTracker',
                bullets: [
                  <>
                    <strong>Línea completa:</strong> figura, barra con todos los pasos y botón de historial.
                  </>,
                  <>
                    <strong>Título y referencia:</strong> quedan ocultos a la vista y solo dan nombre al grupo.
                  </>,
                ],
                preview: tracker(TRACKER_STEPS.slice(0, 2)),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Horizontal sin texto:</strong> con menos de 768 px los textos de un Timeline horizontal se ocultan a la vista y quedan para el lector de pantalla (<code>mobile:sr-only</code>).
              </>,
              <>
                <strong>StatusTracker:</strong> muestra &quot;Estado actual&quot; con la referencia arriba, la barra sin textos y, debajo, el título del paso actual (y su fecha, si la tiene).
              </>,
              <>
                <strong>Vertical sin cambios:</strong> mide lo mismo que en Desktop. La tipografía tampoco cambia: 14/18, 14/20 y 10/14.
              </>,
            ],
            preview: tracker(withoutDates(TRACKER_STEPS.slice(0, 3)), false),
          },
          tablet: {
            bullets: [
              <>
                <strong>Mismas medidas que Desktop:</strong> desde 768 px el texto de la horizontal vuelve a verse.
              </>,
              <>
                <strong>StatusTracker:</strong> igual que en Desktop, con el encabezado oculto y sin resumen del paso.
              </>,
              <>
                <strong>Ancho completo:</strong> el Timeline ocupa todo el ancho de su contenedor, en vertical y en horizontal.
              </>,
            ],
            preview: tracker(TRACKER_STEPS.slice(0, 2), false),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de estado, texto y errores en un Timeline.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Un solo paso en curso',
              description: 'Completa los pasos anteriores y deja pendientes los siguientes.',
              preview: trio(step('complete', 'Recibido', undefined, false), step('current', 'En revisión', undefined, false), step('incomplete', 'Listo', undefined, false)),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Varios pasos en curso',
              description: (
                <>
                  No marques dos pasos como <code>current</code>: no queda claro cuál es el actual.
                </>
              ),
              preview: trio(step('current', 'Recibido', undefined, false), step('current', 'En revisión', undefined, false), step('incomplete', 'Listo', undefined, false)),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Título corto',
              description: 'Escribe el título en una a tres palabras y deja el detalle en la descripción.',
              preview: trio(step('complete', 'Recibido', undefined, false), step('current', 'En revisión', 'Un equipo valida los datos.', false), step('incomplete', 'Listo', undefined, false)),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título largo',
              description: 'No metas el detalle en el título.',
              preview: trio(
                step('complete', 'Recibido', undefined, false),
                step('current', 'Un equipo está validando los datos que enviaste', undefined, false),
                step('incomplete', 'Listo', undefined, false),
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error explicado',
              description: 'Di en la descripción qué falló y qué falta.',
              preview: trio(step('complete', 'Recibido', undefined, false), step('error', 'Archivo rechazado', 'Falta adjuntar el archivo.', false), step('incomplete', 'Listo', undefined, false)),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error sin explicación',
              description: 'No dejes un error sin descripción: el color solo no dice qué pasó.',
              preview: trio(step('complete', 'Recibido', undefined, false), step('error', 'Archivo rechazado', undefined, false), step('incomplete', 'Listo', undefined, false)),
            },
          ],
        },
      ],
    },
  ],
};
