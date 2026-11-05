import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar, AvatarGroup } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import type { PhotoName } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import { ButtonLink } from '../ButtonLink';
import { TooltipBubble } from '../Tooltip/TooltipBubble';
import { PopoverPanel } from './PopoverPanel';
import type { PopoverPanelProps } from './Popover.types';

/*
 * Contenido de la página de documentación de Popover (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Popover.tsx`, `PopoverPanel.tsx`, `Popover.types.ts`, `Popover.variants.ts`), luego `Popover.docs.json`. Medidas:
 * panel de 305 con padding de 12, radio 12 (Simple) o 24 (Complex), título 16/20, texto 14/18, contador 12/16 y 4 px
 * entre la punta de la flecha y el disparador.
 *
 * Las vistas usan `PopoverPanel` en el flujo: el `Popover` real se abre en la capa superior y no se puede medir ni
 * recortar dentro de un lienzo. Los títulos van como párrafo (`headingLevel="none"`) para no repetir el h2 de la página.
 */

// Figma: 11112:6700 (component set Popover, página Tooltip: Type Simple/Complex × Position × Photo)

const TITLE = 'Nuevo panel de ajustes';
const TEXT = 'Desde aquí cambias tus preferencias y ves lo que falta por revisar.';

const PEOPLE: { name: string; photo: PhotoName }[] = [
  { name: 'Ana Pérez', photo: 'Woman_1' },
  { name: 'Hugo García', photo: 'Men_1' },
  { name: 'Lucía Torres', photo: 'Woman_2' },
  { name: 'Mateo Ruiz', photo: 'Men_2' },
  { name: 'Sara Molina', photo: 'Woman_3' },
  { name: 'Diego Vega', photo: 'Men_3' },
];

/** Bloque de medios de ejemplo: un grupo de avatares y una acción. */
const media = () => (
  <>
    <AvatarGroup aria-label="Participantes" max={4} size="sm">
      {PEOPLE.map((p) => (
        <Avatar key={p.name} variant="photo" src={PHOTO_SRC[p.photo]} alt={p.name} />
      ))}
    </AvatarGroup>
    <Button size="xs">Unirme</Button>
  </>
);

/** Pie de ejemplo: la acción de cierre, y la de menor énfasis si hace falta. */
const actions = (withSecondary = true, label = 'Entendido') => (
  <>
    {withSecondary && (
      <Button variant="tertiary" size="xs" unicolor>
        Ahora no
      </Button>
    )}
    <Button variant="secondary" contrast="low" size="xs" unicolor>
      {label}
    </Button>
  </>
);

/** Pie de un recorrido: Anterior (desde el paso 2) y Siguiente o Finalizar. */
const tourActions = (first: boolean, last: boolean) => (
  <>
    {!first && (
      <Button variant="tertiary" size="xs" unicolor>
        Anterior
      </Button>
    )}
    <Button variant="secondary" contrast="low" size="xs" unicolor>
      {last ? 'Finalizar' : 'Siguiente'}
    </Button>
  </>
);

/** Panel estático de ejemplo (título como párrafo, con la acción de cierre por defecto). */
const panel = (props: Partial<PopoverPanelProps> = {}, text: ReactNode = TEXT) => (
  <PopoverPanel headingLevel="none" title={TITLE} actions={actions()} {...props}>
    {text}
  </PopoverPanel>
);

/** Disparador de ejemplo. */
const trigger = () => (
  <Button variant="secondary" size="sm">
    Ver novedades
  </Button>
);

/** Popover abierto: el disparador y, a 4 px, el panel con la flecha arriba (por defecto, `top-left`). */
const opened = (props: Partial<PopoverPanelProps> = {}, text: ReactNode = TEXT) => (
  <div className="flex flex-col items-start gap-ds-space-general-md">
    {trigger()}
    {panel(props, text)}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Oculto',
    tone: 'neutral',
    description: (
      <>
        Reposo. El panel no se ve y el disparador indica <code>aria-expanded=&quot;false&quot;</code>.
      </>
    ),
    samples: [trigger()],
  },
  {
    label: 'Abierto',
    tone: 'accent',
    description: 'Con clic, toque o Enter en el disparador. El foco pasa al panel. Escape, el clic fuera o un botón lo cierran y el foco vuelve al disparador.',
    samples: [opened()],
  },
  {
    label: 'Recorrido',
    tone: 'accent',
    description: (
      <>
        Con <code>step</code>, <code>totalSteps</code> y <code>onStepChange</code> suma el contador, Anterior y Siguiente. En el primer paso no hay Anterior.
      </>
    ),
    samples: [opened({ page: '2 de 3', actions: tourActions(false, false) }, 'Combina estado, fecha y área para encontrar más rápido.')],
  },
  {
    label: 'Último paso',
    tone: 'accent',
    description: (
      <>
        Siguiente pasa a Finalizar. Al pulsarlo llama a <code>onFinish</code> y cierra el panel.
      </>
    ),
    samples: [opened({ page: '3 de 3', actions: tourActions(false, true) }, 'Aquí llegan los avisos de cada reunión.')],
  },
];

export const doc: ComponentDocContent = {
  name: 'Popover',
  icon: 'info-circle',
  classification: 'molecula',
  summary:
    'El Popover es la molécula que abre un panel anclado a un elemento, con título, texto, enlace, medios y botones. Sirve para ayudas con acciones y recorridos paso a paso; para un texto breve sin botones se usa Tooltip.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un panel con flecha que apunta a su ancla. La posición dice en qué borde va la flecha.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Popover simple abierto',
                  preview: opened({ page: '1 de 2' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Content"]', side: 'right' },
                    { n: 2, selector: '[data-figma-part="Tooltip Title"]', side: 'right' },
                    { n: 3, selector: '[data-figma-part="Text"] [data-figma-part="Paragraph Default"]', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Actions"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="Polygon 1"]', side: 'left' },
                    { n: 6, selector: 'button', index: 0, side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Content"]', side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Content"]', side: 'top' },
                    { kind: 'gap', from: 'button', fromIndex: 0, to: '[data-figma-part="Polygon 1"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 305 de ancho, padding de 12 (<code>space/general/xl</code>) y radio de 12 (<code>radius/general/lg</code>) en Simple; en Complex el radio es 24 (<code>radius/general/2xl</code>). Relleno <code>background/general/gray-sixth</code>, igual en los dos temas.
                </>,
                <>
                  <strong>Título:</strong> Prospero Semibold de 16 px con interlineado de 20 (<code>typography/heading/size/md</code>), sin ícono. Nombra el diálogo para el lector de pantalla.
                </>,
                <>
                  <strong>Texto:</strong> Helvetica Neue Regular de 14 px con interlineado de 18. Describe el diálogo y crece hacia abajo.
                </>,
                <>
                  <strong>Pie:</strong> el contador a la izquierda (12/16, <code>text/neutral/body</code>) y los botones a la derecha, separados por 16 (<code>space/general/2xl</code>). Son Button xs, tertiary y secondary, unicolor.
                </>,
                <>
                  <strong>Flecha:</strong> triángulo de 16 × 12 en la esquina del panel (22 × 12 si va al centro). Si el panel se corre para no salirse de la pantalla, sigue apuntando al ancla.
                </>,
                <>
                  <strong>Disparador:</strong> un único botón. La punta de la flecha queda a 4 px de él.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Popover complejo con medios',
                  preview: panel({ media: media(), onClose: () => {}, arrow: 'center-top', page: '1 de 2', actions: tourActions(true, false) }, TEXT),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Content"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Frame 6"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Button corner "]', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Tooltip Title"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="Actions"]', side: 'right' },
                    { n: 6, selector: '[data-figma-part="Polygon 1"]', side: 'top' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-figma-part="Frame 6"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> igual que el simple, con radio de 24 y 12 de separación entre sus bloques (<code>space/general/xl</code>).
                </>,
                <>
                  <strong>Bloque de medios:</strong> 169,5 de alto, con radio de 16 (<code>radius/general/xl</code>) y una muesca para el botón cerrar. Admite avatares, una imagen o una acción; lo interactivo lleva su propio nombre accesible.
                </>,
                <>
                  <strong>Botón cerrar:</strong> Button corner sm de 32, en la esquina superior derecha del bloque. Su nombre accesible es Cerrar (<code>closeLabel</code>).
                </>,
                <>
                  <strong>Título y texto:</strong> van debajo del bloque de medios, con 8 de aire inferior (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Pie:</strong> con medios, el aire superior baja a 0 (<code>space/general/xs</code>) porque el bloque ya separa.
                </>,
                <>
                  <strong>Flecha:</strong> centrada (<code>arrow=&quot;center-top&quot;</code>), de 22 × 12. Sigue al centro del ancla.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Fila con enlace',
                  preview: panel({ linkDescription: 'Consulta la guía completa', link: <ButtonLink>Ver guía</ButtonLink>, actions: undefined }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Description+link"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Description+link"] > p', side: 'right' },
                    { n: 3, selector: '[data-figma-part="Description+link"] > :last-child', side: 'right' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="Description+link"] > p', to: '[data-figma-part="Description+link"] > :last-child' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila:</strong> texto y enlace en una línea (<code>link</code> y <code>linkDescription</code>), solo en Simple. Va entre el texto y el pie.
                </>,
                <>
                  <strong>Descripción:</strong> Helvetica Neue Regular de 14/18 (<code>text/neutral/white</code>) que ocupa el ancho libre a la izquierda.
                </>,
                <>
                  <strong>Enlace:</strong> un ButtonLink a la derecha, separado 16 de la descripción (<code>space/general/2xl</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Posiciones',
                  preview: (
                    <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                      {panel({ arrow: 'top-left', actions: undefined, title: 'Top left' }, 'Debajo del ancla, hacia la derecha.')}
                      {panel({ arrow: 'center-top', actions: undefined, title: 'Center top' }, 'Debajo del ancla, centrado.')}
                      {panel({ arrow: 'middle-left', actions: undefined, title: 'Middle left' }, 'A la derecha del ancla.')}
                      {panel({ arrow: 'bottom-right', actions: undefined, title: 'Bottom right' }, 'Encima del ancla, hacia la izquierda.')}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Polygon 1"]', index: 0, side: 'top' },
                    { n: 2, selector: '[data-figma-part="Polygon 1"]', index: 1, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Polygon 1"]', index: 2, side: 'left' },
                    { n: 4, selector: '[data-figma-part="Polygon 1"]', index: 3, side: 'bottom' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Top left y top right:</strong> flecha arriba, en la esquina izquierda o derecha. El panel aparece debajo del ancla.
                </>,
                <>
                  <strong>Center top y center bottom:</strong> flecha centrada. Siguen al centro del ancla, aunque el panel se corra.
                </>,
                <>
                  <strong>Middle left y middle right:</strong> flecha a un lado. El panel aparece a la derecha (left) o a la izquierda (right) del ancla.
                </>,
                <>
                  <strong>Bottom left y bottom right:</strong> flecha abajo. El panel aparece encima del ancla. Toda posición es una preferencia: si no cabe, pasa al lado o la alineación opuestos.
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
          Popover tiene 4 estados. Oculto y Abierto son del Popover; Recorrido y Último paso, del contenido con <code>step</code>. No hay prop <code>state</code>: salen de <code>open</code> y de <code>step</code>. Aquí el panel se dibuja en el flujo; en uso se abre en la capa superior.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado abierto. La superficie es unicolor: queda siempre en modo oscuro, en los dos temas.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Simple',
              preview: panel({ page: '1 de 2', linkDescription: 'Consulta la guía completa', link: <ButtonLink>Ver guía</ButtonLink> }),
              entries: [
                { part: 'Fondo y flecha', color: 'background-general-gray-sixth', mode: 'dark' },
                { part: 'Título', color: 'text-neutral-white-unicolor', text: 'typography-heading-size-md', mode: 'dark' },
                { part: 'Texto', color: 'text-neutral-white-unicolor', text: 'primitives-typography-size-md', mode: 'dark' },
                { part: 'Descripción del enlace', color: 'text-neutral-white', text: 'primitives-typography-size-md', mode: 'dark' },
                { part: 'Contador', color: 'text-neutral-body', text: 'primitives-typography-size-sm', mode: 'dark' },
              ],
            },
            {
              title: 'Complex',
              preview: panel({ media: media(), onClose: () => {}, page: '1 de 2', actions: tourActions(true, false) }),
              entries: [
                { part: 'Fondo y flecha', color: 'background-general-gray-sixth', mode: 'dark' },
                { part: 'Botón cerrar', color: 'background-container-default-on-canva', mode: 'dark' },
                { part: 'Título', color: 'text-neutral-white-unicolor', text: 'typography-heading-size-md', mode: 'dark' },
                { part: 'Texto', color: 'text-neutral-white-unicolor', text: 'primitives-typography-size-md', mode: 'dark' },
                { part: 'Contador', color: 'text-neutral-body', text: 'primitives-typography-size-sm', mode: 'dark' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Popover en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Popover (en la página Tooltip) en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type, Position y Photo, más los interruptores Title, Actions y Description+link y los textos Text title, Text y Page.
            </>,
            <>
              <strong>Type y Photo:</strong> Simple va sin foto y Complex con foto. En código, <code>type</code> sale de <code>media</code>: con medios es <code>complex</code> y sin ellos <code>simple</code>.
            </>,
            <>
              <strong>Position:</strong> el borde del panel con la flecha (top-left, center-top, middle-right…); en código es <code>arrow</code>. El panel aparece del lado opuesto a la flecha.
            </>,
            <>
              <strong>Tooltip:</strong> el Popover es un diálogo con botones. El texto breve sin botones es otro set, Tooltip (Atom), que en código es Tooltip.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Popover es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Ayuda con acciones:</strong> explica una función nueva y deja botones como Entendido o Ahora no (<code>actions</code>). Si solo hay texto, usa Tooltip.
            </>,
            <>
              <strong>Recorrido paso a paso:</strong> con <code>step</code>, <code>totalSteps</code> y <code>onStepChange</code>, cada paso señala un elemento distinto (<code>anchor</code>) y el último pasa a Finalizar.
            </>,
            <>
              <strong>Contenido con enlace o medios:</strong> una fila con enlace (<code>link</code>) o un bloque con avatares o imagen (<code>media</code>), con su botón cerrar.
            </>,
            <>
              <strong>Diálogo que no bloquea la página:</strong> el foco pasa al panel al abrir y vuelve al disparador al cerrar. No usa <code>aria-modal</code>, no atrapa el foco y no bloquea el scroll.
            </>,
          ],
          avoid: [
            <>
              <strong>Texto breve que aclara un ícono:</strong> el panel pide un clic y un cierre para algo que se lee de un vistazo. (Alternativa: <code>Tooltip</code>).
            </>,
            <>
              <strong>Decisión que debe resolverse antes de seguir:</strong> el panel no bloquea la página y se cierra con un clic fuera. (Alternativa: <code>Modal</code> o <code>AlertModal</code>).
            </>,
            <>
              <strong>Lista de acciones:</strong> no navega con flechas ni agrupa opciones. (Alternativa: <code>DropdownMenu</code>).
            </>,
            <>
              <strong>Error o aviso que se debe leer:</strong> se cierra con un clic fuera y se pierde. (Alternativa: <code>Alert</code> o el texto de ayuda del campo).
            </>,
            <>
              <strong>Panel sin cierre visible:</strong> sin <code>actions</code>, recorrido ni medios con botón cerrar solo queda Escape, que un lector de pantalla en móvil no tiene.
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
                title: 'Con disparador',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Ancho fijo de 305:</strong> el texto crece hacia abajo, no hacia los lados.
                  </>,
                ],
                preview: opened({ page: '1 de 2' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Ancho:</strong> 305, con tope en el ancho de la pantalla menos 16 (8 de margen a cada lado).
              </>,
              <>
                <strong>Entrada:</strong> un toque en el disparador lo abre y otro fuera lo cierra. Como no hay Escape, deja un botón visible.
              </>,
            ],
            preview: opened({ page: '1 de 2' }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Tipografía:</strong> título de 16/20 y texto de 14/18, igual en todos los breakpoints.
              </>,
              <>
                <strong>Bordes de la pantalla:</strong> si no cabe, pasa al lado o la alineación opuestos y la flecha sigue apuntando al ancla.
              </>,
            ],
            preview: opened({ page: '1 de 2' }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de cierre, longitud y qué contenido cabe en un Popover.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Con acción de cierre',
              description: 'Deja un botón visible para cerrarlo: en móvil con lector de pantalla no hay Escape.',
              preview: opened({ actions: actions(false) }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Sin cierre visible',
              description: 'No lo dejes sin botones, recorrido ni medios con botón cerrar.',
              preview: opened({ actions: undefined }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Texto de una idea',
              description: 'Escribe un título corto y un texto de una o dos frases.',
              preview: opened({ title: 'Revisar cambios', actions: actions(false, 'Guardar cambios') }, 'Tienes ajustes sin guardar.'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto largo',
              description: 'No escribas párrafos: el panel mide 305 px y solo crece hacia abajo.',
              preview: opened(
                { title: 'Revisar cambios', actions: actions(false, 'Guardar cambios') },
                'Tienes ajustes sin guardar en tu perfil, en las notificaciones y en la vista de reuniones, y además quedan documentos pendientes de revisar antes de cerrar la sesión de hoy.'
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Botones en un Popover',
              description: 'Pon botones y enlaces en un Popover, que recibe el foco.',
              preview: panel({ title: 'Vista nueva', actions: actions(false, 'Guardar vista') }, 'Puedes cambiarla después.'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Botones en un Tooltip',
              description: 'No metas botones en un Tooltip: nunca recibe el foco y no se alcanzan con teclado.',
              preview: (
                <TooltipBubble arrow="top">
                  <span className="flex flex-col items-start gap-ds-space-general-md">
                    Puedes cambiarla después.
                    <Button variant="secondary" contrast="low" size="xs" unicolor>
                      Guardar vista
                    </Button>
                  </span>
                </TooltipBubble>
              ),
            },
          ],
        },
      ],
    },
  ],
};
