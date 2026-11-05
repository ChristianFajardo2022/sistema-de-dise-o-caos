import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { ModalPanel } from './Modal';

/*
 * Contenido de la página de documentación de Modal (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Modal.tsx`, `Modal.types.ts`, `Modal.variants.ts`, `ModalActions.tsx`, la pieza interna `ModalDialog`), luego
 * `Modal.docs.json`. Medidas: centrado de 500 de ancho y lateral de 576 a todo el alto; padding `space/container/on-canva`
 * (32 en Desktop, 24 en Tablet, 20 en Mobile), separación `space/general/4xl` (32; 24 en Mobile), título 20/24 (18/22 en
 * Mobile) y descripción 14/20. En Mobile (< 48rem) los dos son una hoja inferior con asa, sin botón cerrar y con las
 * acciones apiladas.
 *
 * Las vistas usan la superficie suelta (`ModalPanel`) en el flujo: el `Modal` real es un `<dialog>` con `showModal()`,
 * se abre en la capa superior y no se puede medir ni recortar dentro de un lienzo. Diferencias con Figma: Figma no
 * dibuja el velo, el foco ni el desplazamiento del contenido (solo la propiedad Scroll bar).
 */

// Figma: 14446:66166 (component set Complex modal)

type PanelProps = Partial<ComponentProps<typeof ModalPanel>>;

/** Contenido de ejemplo del slot: filas con ícono y nombre neutro (cada una es un componente de CAOS: Avatar). */
const cards = (titles: string[] = ['Proyectos', 'Archivo']) => (
  <ul role="list" className="m-0 flex list-none flex-col gap-ds-space-general-2xl p-0">
    {titles.map((t) => (
      <li key={t} className="flex items-center gap-ds-space-general-2xl rounded-ds-radius-container-on-card bg-ds-background-container-default-on-card p-ds-space-general-2xl">
        <Avatar variant="icon" size="sm" contrast="on-card" />
        <span className="font-ds-primitives-typography-family-primary text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-heading">{t}</span>
      </li>
    ))}
  </ul>
);

/** Superficie del modal en el flujo, con título, descripción, ícono y dos acciones. Lo demás se pasa en `props`. */
const panel = (props: PanelProps = {}, content: ReactNode = cards()) => (
  <ModalPanel
    title="Mover a una carpeta"
    description="Elige el destino de los archivos."
    icon="notification"
    onClose={() => {}}
    primaryAction={{ label: 'Mover' }}
    secondaryAction={{ label: 'Cancelar' }}
    {...props}
  >
    {content}
  </ModalPanel>
);

/** Panel lateral: ocupa todo el alto de su contenedor. */
const lateralPanel = (props: PanelProps = {}, content: ReactNode = cards(['Proyectos', 'Archivo', 'Compartido'])) => (
  <div className="h-150">{panel({ lateral: true, title: 'Detalles', description: 'Revisa los datos antes de mover.', ...props }, content)}</div>
);

/** Contenido que no cabe: seis filas dentro de un alto máximo de 480. */
const longPanel = () =>
  panel({ className: 'max-h-120', bodyLabel: 'Carpetas' }, cards(['Proyectos', 'Archivo', 'Compartido', 'Reuniones', 'Perfiles', 'Ajustes']));

const states: DocStateItem[] = [
  {
    label: 'Oculto',
    tone: 'neutral',
    description: (
      <>
        Reposo. Con <code>open</code> en <code>false</code> el diálogo no se ve y la página sigue activa. Lo abre un disparador, aquí un Button.
      </>
    ),
    samples: [<Button key="abrir">Mover archivos</Button>],
  },
  {
    label: 'Abierto',
    tone: 'accent',
    description: 'Se muestra sobre un velo. El foco va al título (sin título, al primer elemento enfocable, el cerrar), el resto de la página queda inerte y no se desplaza.',
    samples: [panel()],
  },
  {
    label: 'Con desplazamiento',
    tone: 'neutral',
    description: (
      <>
        Si el contenido no cabe en el 90% del alto, solo se desplaza esa zona. Es una región con nombre (<code>bodyLabel</code>) y se puede tabular.
      </>
    ),
    samples: [longPanel()],
  },
  {
    label: 'Acción en carga',
    tone: 'neutral',
    description: (
      <>
        Con <code>loading</code> el botón muestra el indicador de carga y queda ocupado (<code>aria-busy</code>). La acción terciaria no lo admite.
      </>
    ),
    samples: [panel({ primaryAction: { label: 'Mover', loading: true } })],
  },
  {
    label: 'Acción inactiva',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code> el botón no responde y el diálogo sigue abierto.
      </>
    ),
    samples: [panel({ primaryAction: { label: 'Mover', disabled: true } })],
  },
];

/** Contenido corto de los pares de Do and Dont’s: el mismo texto en el caso bueno y en el malo. */
const note = <p className="m-0 text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-body">Los archivos elegidos pasan al nuevo destino.</p>;

export const doc: ComponentDocContent = {
  name: 'Modal',
  icon: 'maximize',
  classification: 'composicion',
  summary:
    'El Modal es la composición que abre un diálogo sobre la página para completar una tarea: encabezado con ícono, título y descripción, contenido libre con desplazamiento y acciones en el pie. Va centrado o como panel lateral y, en móvil, como hoja inferior.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Una superficie en columna con encabezado, contenido y acciones. El cerrar va en la muesca de la esquina (centrado) o en una fila sobre el encabezado (lateral).',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Modal centrado',
                  preview: panel(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Desktop"]', side: 'left' },
                    { n: 2, selector: 'button[aria-label="Cerrar"]', side: 'right' },
                    { n: 3, selector: '[data-figma-part="Avatar"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Info"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Desktop"] > [data-figma-part="Container"]', side: 'left' },
                    { n: 6, selector: '[data-figma-part="CTA"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Desktop"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Header"]', to: '[data-figma-part="Desktop"] > [data-figma-part="Container"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 500 de ancho y hasta el 90% del alto de la pantalla. Padding de 32 (<code>space/container/on-canva</code>), separación de 32 entre zonas (<code>space/general/4xl</code>) y radio de 24 con muesca en la esquina (<code>radius/general/2xl</code>).
                </>,
                <>
                  <strong>Cerrar:</strong> Button corner md On canva de 40, con el ícono close de 16, en la muesca. Su nombre accesible es &quot;Cerrar&quot; (<code>closeLabel</code>); <code>closable</code> lo quita.
                </>,
                <>
                  <strong>Ícono:</strong> Avatar icon On card de 48 con el ícono de <code>icon</code>. Es decorativo y sin <code>icon</code> no se dibuja.
                </>,
                <>
                  <strong>Título y descripción:</strong> columna con separación de 4 (<code>space/general/md</code>). El título es Prospero semibold de 20/24 (<code>typography/heading/size/lg</code>) y nombra el diálogo; la descripción es de 14/20 (<code>typography/body/size/md</code>).
                </>,
                <>
                  <strong>Contenido:</strong> el slot <code>children</code>. Ocupa el alto libre, va en columna con separación de 32 y se desplaza si no cabe, con 8 hasta la barra (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Acciones:</strong> fila alineada a la derecha con separación de 8 (<code>space/general/lg</code>): Tertiary, Secondary y Primary md, de <code>tertiaryAction</code>, <code>secondaryAction</code> y <code>primaryAction</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Modal lateral',
                  preview: lateralPanel(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Desktop"]', side: 'left' },
                    { n: 2, selector: 'button[aria-label="Cerrar"]', side: 'right' },
                    { n: 3, selector: '[data-figma-part="Header"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Desktop"] > [data-figma-part="Container"]', side: 'left' },
                    { n: 5, selector: '[data-figma-part="CTA"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Desktop"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Header"]', to: '[data-figma-part="Desktop"] > [data-figma-part="Container"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 576 de ancho y todo el alto, pegado a la derecha. Radios de 32 a la izquierda (<code>radius/container/on-canva</code>) y 0 a la derecha, junto al borde de la pantalla. Mismo padding y separación que el centrado.
                </>,
                <>
                  <strong>Cerrar:</strong> ícono close de 24 en línea, sin caja, alineado a la derecha sobre el encabezado. Mismo nombre accesible (<code>closeLabel</code>).
                </>,
                <>
                  <strong>Encabezado:</strong> ícono, título y descripción como en el centrado, a 8 de la fila del cerrar (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Contenido:</strong> el slot <code>children</code>, con el mismo desplazamiento y la misma separación.
                </>,
                <>
                  <strong>Acciones:</strong> la misma fila a la derecha, siempre al pie del panel.
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
          Modal tiene 5 estados. Oculto y Abierto son del diálogo; Con desplazamiento, del contenido; Acción en carga y Acción inactiva, de sus botones. No hay prop <code>state</code>: salen de <code>open</code>, del alto del contenido y de las props de cada acción (<code>loading</code>, <code>disabled</code>). Hover, Focus y Press de los botones son los de Button.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Centrado',
              preview: panel(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-lg' },
                { part: 'Descripción', color: 'text-neutral-body', text: 'typography-body-size-md' },
                { part: 'Fondo del ícono', color: 'background-icon-default-on-card' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Fondo del botón cerrar', color: 'background-container-default-on-canva' },
                { part: 'Ícono del botón cerrar', color: 'icon-general-default' },
                { part: 'Velo detrás del diálogo (aparece al abrir)', color: 'background-effect-backdrop' },
                { part: 'Asa (aparece en Mobile)', color: 'background-general-gray-fifth' },
              ],
            },
            {
              title: 'Lateral',
              preview: lateralPanel(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Ícono de cerrar', color: 'background-general-white' },
                { part: 'Contorno de foco del cerrar (aparece en Focus)', color: 'border-field-active' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-lg' },
                { part: 'Descripción', color: 'text-neutral-body', text: 'typography-body-size-md' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Modal en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Complex modal en la librería de Assets. Es un set con los marcos Desktop y Mobile y la propiedad Lateral (off u on). En código es <code>Modal</code> con <code>lateral</code>: el marco lo elige el ancho de la pantalla.
            </>,
            <>
              <strong>Textos e íconos:</strong> Heading es <code>title</code>, Description2 es <code>description</code> e Icon es <code>icon</code>. Los interruptores Description, Icon, Icon close, Btn secondary y Btn tertiary equivalen a pasar o no <code>description</code>, <code>icon</code>, <code>closable</code>, <code>secondaryAction</code> y <code>tertiaryAction</code>.
            </>,
            <>
              <strong>Contenido:</strong> el slot Container es <code>children</code>. Las tarjetas, la lista y los perfiles del ejemplo de Figma son componentes aparte (InteractiveCard, ListItem, ProfileCard), no parte del Modal. La propiedad Scroll bar equivale al desplazamiento, que en código aparece solo cuando el contenido no cabe.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> el velo, el foco, Escape, el clic en el fondo y el bloqueo del desplazamiento de la página. El Simple modal de Figma corresponde a <code>AlertModal</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Modal es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Una tarea que pide decidir antes de seguir:</strong> elegir un destino, completar datos o revisar un detalle, con acciones Primary, Secondary y Tertiary en el pie.
            </>,
            <>
              <strong>Detalle junto a la página:</strong> con <code>lateral</code>, el panel ocupa todo el alto y deja la lista o la vista de fondo como referencia visual.
            </>,
            <>
              <strong>Contenido de largo variable:</strong> el slot se desplaza solo y el encabezado y las acciones quedan a la vista. Nombra la zona con <code>bodyLabel</code>.
            </>,
            <>
              <strong>Teclado:</strong> al abrir, el foco va al título; sin <code>title</code>, al primer elemento enfocable, el cerrar. Tab recorre solo el diálogo. Escape y el clic en el fondo cierran (<code>closeOnBackdrop</code>), y al cerrar el foco vuelve al disparador.
            </>,
            <>
              <strong>Lectores de pantalla:</strong> el título nombra el diálogo y la descripción lo describe. Sin título, pasa <code>aria-label</code>. Cada acción llama a su <code>onClick</code> y cierra, salvo que llame a <code>event.preventDefault()</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Una confirmación o un aviso corto:</strong> con una sola decisión no hace falta encabezado, contenido ni desplazamiento. (Alternativa: <code>AlertModal</code>).
            </>,
            <>
              <strong>Información de apoyo junto a un control:</strong> el modal bloquea toda la página. (Alternativa: <code>Popover</code>).
            </>,
            <>
              <strong>Un mensaje que no pide acción:</strong> no obliga a detener la tarea. (Alternativa: <code>Toast</code>).
            </>,
            <>
              <strong>Un modal dentro de otro:</strong> el foco y la salida se vuelven confusos. Pon los pasos en un solo diálogo.
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop, salvo el padding, que baja a 24.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Centrado',
                bullets: [
                  <>
                    <strong>Ancho:</strong> 500, centrado en la pantalla y de hasta el 90% del alto. Si el contenido no cabe, solo se desplaza su zona.
                  </>,
                  <>
                    <strong>Medidas:</strong> padding de 32 y separación de 32. Título de 20/24 y acciones en fila a la derecha.
                  </>,
                ],
                preview: panel({ headingLevel: 4 }),
              },
              {
                title: 'Lateral',
                bullets: [
                  <>
                    <strong>Panel:</strong> 576 de ancho y todo el alto, a la derecha, con radios de 32 a la izquierda (<code>radius/container/on-canva</code>).
                  </>,
                  <>
                    <strong>Medidas:</strong> mismo padding y separación. El cerrar es un ícono de 24 sobre el encabezado.
                  </>,
                ],
                preview: lateralPanel({ headingLevel: 4 }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Hoja inferior:</strong> por debajo de 48rem, centrado y lateral son la misma hoja: todo el ancho, pegada al borde inferior y de hasta el 90% del alto. Radios de 24 arriba (<code>radius/general/2xl</code>) y asa de 48 × 2.
              </>,
              <>
                <strong>Medidas:</strong> padding de 16 arriba, 20 a los lados y 20 abajo; separación de 24 y título de 18/22. El encabezado va en columna y centrado, sin botón cerrar: cierran Escape, el fondo o una acción.
              </>,
              <>
                <strong>Acciones apiladas:</strong> ocupan todo el ancho, con Primary arriba.
              </>,
            ],
            preview: panel({ headingLevel: 4 }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Padding menor:</strong> baja a 24 (<code>space/container/on-canva</code> en Tablet) y la separación sigue en 32. Es la única medida que cambia respecto a Desktop.
              </>,
              <>
                <strong>Mismas formas:</strong> desde 48rem sigue el modal centrado de 500 o el panel lateral de 576, con radios de 32.
              </>,
              <>
                <strong>Acciones en fila:</strong> alineadas a la derecha, como en Desktop.
              </>,
            ],
            preview: panel({ headingLevel: 4 }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de título, acciones y contenido del modal.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título con la tarea',
              description: 'Titula con la tarea que se hace: es lo primero que anuncia el lector de pantalla.',
              preview: panel({ title: 'Mover a una carpeta', description: undefined, icon: undefined }, note),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título genérico',
              description: 'Evita títulos como Atención: no dicen qué se decide.',
              preview: panel({ title: 'Atención', description: undefined, icon: undefined }, note),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Una acción principal',
              description: 'Deja un solo Primary y pon la salida como Secondary.',
              preview: panel({ description: undefined, icon: undefined }, note),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Dos acciones principales',
              description: 'No pongas dos Primary: se pierde la jerarquía.',
              preview: panel(
                {
                  description: undefined,
                  icon: undefined,
                  primaryAction: undefined,
                  secondaryAction: undefined,
                  actions: (
                    <>
                      <Button variant="primary">Mover</Button>
                      <Button variant="primary">Copiar</Button>
                    </>
                  ),
                },
                note
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Contenido corto',
              description: 'Deja en el modal solo lo que se decide ahora.',
              preview: panel({ title: 'Elegir carpeta', description: undefined, icon: undefined }, cards(['Proyectos', 'Archivo'])),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Lista larga',
              description: (
                <>
                  Evita volcar una lista larga: se desplaza dentro del modal. (Alternativa: una página).
                </>
              ),
              preview: panel({ title: 'Elegir carpeta', description: undefined, icon: undefined, className: 'max-h-120', bodyLabel: 'Carpetas' }, cards(['Proyectos', 'Archivo', 'Compartido', 'Reuniones', 'Perfiles', 'Ajustes'])),
            },
          ],
        },
      ],
    },
  ],
};
