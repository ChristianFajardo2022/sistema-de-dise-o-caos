import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { ButtonLink } from './ButtonLink';
import type { ButtonLinkProps, ButtonLinkState } from './ButtonLink.types';

/*
 * Contenido de la página de documentación de Button link (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`ButtonLink.types.ts`, `ButtonLink.variants.ts`, `ButtonLink.tsx`), luego `ButtonLink.docs.json`. Diferencias con
 * Figma: el set solo dibuja el enlace (Text, Icon right, State); el modo botón (sin `href`) y `icon` existen solo en
 * código. El texto es Semibold en código y Medium en Figma. No cambia entre breakpoints.
 */

// Figma: 13215:4751 (component set Button link)

/** Enlace de ejemplo: con `href`, texto neutro y el ícono de enlace externo por defecto. */
const link = (props: Partial<ButtonLinkProps> = {}, label: ReactNode = 'Ver guía') => (
  <ButtonLink href="#" {...props}>
    {label}
  </ButtonLink>
);

/** Acción en línea: sin `href` es un `<button>` real. */
const action = (props: Partial<ButtonLinkProps> = {}, label: ReactNode = 'Reenviar código') => (
  <ButtonLink iconRight={false} {...props}>
    {label}
  </ButtonLink>
);

/** Muestras de un estado: con ícono y sin ícono, con `state` forzado. */
const stateSamples = (state: ButtonLinkState): ReactNode[] => [
  link({ state }),
  link({ state, iconRight: false }, 'Ver detalle'),
];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Texto subrayado, sin contenedor, con el ícono de enlace externo a su derecha.',
    samples: stateSamples('default'),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero. Texto e ícono cambian a los colores de hover.',
    samples: stateSamples('hover'),
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al recibir el foco del teclado. Texto e ícono cambian de color; no hay anillo de foco.',
    samples: stateSamples('focus'),
  },
  {
    label: 'Press',
    tone: 'accent',
    description: 'Mientras se presiona. Usa los mismos colores que Focus.',
    samples: stateSamples('press'),
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        No interactivo (<code>disabled</code> o <code>state=&quot;inactive&quot;</code>). Colores atenuados, sin navegación y fuera del orden de tabulación.
      </>
    ),
    samples: stateSamples('inactive'),
  },
];

export const doc: ComponentDocContent = {
  name: 'Button link',
  icon: 'link4',
  classification: 'atomo',
  summary:
    'El Button link es el átomo para navegar o ejecutar una acción en línea con aspecto de texto subrayado, sin contenedor. Con href es un enlace y sin href es un botón. Tiene cinco estados y un ícono opcional de enlace externo.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Texto subrayado con un ícono opcional a la derecha. Sin contenedor visible ni anillo de foco.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Enlace con ícono',
                  preview: link(),
                  marks: [
                    { n: 1, selector: 'a', side: 'bottom' },
                    { n: 2, selector: 'a > span:first-child', side: 'top' },
                    { n: 3, selector: '[data-slot="icon"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'a' },
                    { kind: 'padding', selector: 'a', side: 'top' },
                    { kind: 'gap', from: 'a > span:first-child', to: '[data-slot="icon"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> sin fondo, borde ni radio. Alto de 32: padding Y 8 (<code>space/button/lg</code>) y una línea de 16. El padding X es 0, así que el texto queda alineado al borde.
                </>,
                <>
                  <strong>Texto:</strong> Helvetica Neue Semibold de 14 px fijo en todos los breakpoints, con subrayado sólido de 6% de grosor. No se divide en varias líneas.
                </>,
                <>
                  <strong>Ícono:</strong> opcional (<code>iconRight</code>, activo por defecto). Es el de enlace externo, de 12 px, con el color del estado; se reemplaza con <code>icon</code>. Entre texto e ícono hay 4 px.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Acción sin href',
                  preview: action(),
                  marks: [
                    { n: 1, selector: 'button', side: 'left' },
                    { n: 2, selector: 'button > span:first-child', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'button' },
                    { kind: 'padding', selector: 'button', side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> sin <code>href</code> se dibuja un <code>&lt;button type=&quot;button&quot;&gt;</code> real con las mismas medidas. Enter y Espacio son nativos y <code>disabled</code> es el del navegador.
                </>,
                <>
                  <strong>Texto:</strong> el mismo texto subrayado. En una acción suele ir sin ícono (<code>iconRight=&#123;false&#125;</code>), porque el de enlace externo promete una navegación.
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
          Button link tiene 5 estados, con y sin ícono. Hover, Focus y Press se fuerzan con <code>state</code> solo para documentar; en uso salen de la interacción.
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
              title: 'Default',
              preview: link(),
              entries: [
                { part: 'Texto', color: 'text-button-link-default', text: 'typography-button-size-md-uniform' },
                { part: 'Ícono', color: 'icon-button-link-default' },
              ],
            },
            {
              title: 'Hover',
              preview: link({ state: 'hover' }),
              entries: [
                { part: 'Texto', color: 'text-button-link-hover' },
                { part: 'Ícono', color: 'icon-button-link-hover' },
              ],
            },
            {
              title: 'Focus y Press',
              preview: link({ state: 'focus' }),
              entries: [
                { part: 'Texto', color: 'text-button-link-focus-press' },
                { part: 'Ícono', color: 'icon-button-link-focus-press' },
              ],
            },
            {
              title: 'Inactive',
              preview: link({ state: 'inactive' }),
              entries: [
                { part: 'Texto', color: 'text-button-link-inactive' },
                { part: 'Ícono', color: 'icon-button-link-inactive' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Button link en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Button link en la librería de Assets y arrástralo al lienzo. Sus propiedades son Text, Icon right y State.
            </>,
            <>
              <strong>Text e Icon right:</strong> Text es el texto del enlace (<code>children</code>). Icon right muestra u oculta el ícono de enlace externo (<code>iconRight</code>).
            </>,
            <>
              <strong>State:</strong> Default, Hover, Focus, Press o Inactive (<code>state</code>). Inactive equivale a <code>disabled</code>.
            </>,
            <>
              <strong>Diferencias con el código:</strong> Figma no tiene el modo botón (sin <code>href</code>) ni el ícono propio (<code>icon</code>). El texto de Figma es Medium; el código usa Semibold, igual que Button.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Button link es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Navegación en el texto:</strong> con <code>href</code> es un enlace real (<code>&lt;a&gt;</code>) hacia otra página, sección o recurso.
            </>,
            <>
              <strong>Enlaces externos:</strong> el ícono avisa que sales del sitio. Con <code>target=&quot;_blank&quot;</code> el nombre accesible suma &quot;(se abre en una pestaña nueva)&quot;.
            </>,
            <>
              <strong>Acciones en línea:</strong> sin <code>href</code> es un botón para acciones de bajo énfasis, como &quot;Reenviar código&quot; o &quot;Editar&quot;. Enter y Espacio lo activan.
            </>,
            <>
              <strong>Enlaces no disponibles:</strong> <code>disabled</code> quita el <code>href</code>, cancela el clic y deja el enlace fuera del orden de tabulación.
            </>,
          ],
          avoid: [
            <>
              <strong>Acción principal de la vista:</strong> un enlace no tiene contenedor ni énfasis. (Alternativa: <code>Button</code>).
            </>,
            <>
              <strong>Navegar desde un <code>onClick</code>:</strong> pierde el clic medio y Cmd/Ctrl. (Alternativa: <code>href</code>).
            </>,
            <>
              <strong>Ícono de enlace externo en acciones:</strong> promete una navegación que no ocurre. (Alternativa: <code>iconRight=&#123;false&#125;</code>).
            </>,
            <>
              <strong>Frases largas:</strong> el texto no se divide en varias líneas. (Alternativa: un texto corto que nombre el destino).
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
                title: 'Enlace',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Alto de 32</strong> y padding X 0; el ancho lo da el texto más el ícono de 12 px.
                  </>,
                ],
                preview: link(),
              },
              {
                title: 'Acción sin href',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> el botón sin <code>href</code> mide igual que el enlace en todos los breakpoints.
                  </>,
                  <>
                    <strong>Texto de 14 px</strong> fijo, sin ajuste de línea.
                  </>,
                ],
                preview: action(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> alto de 32, texto de 14 px e ícono de 12 px.
              </>,
              <>
                <strong>Ancho:</strong> depende del texto; no existe <code>fullWidth</code>.
              </>,
            ],
            preview: link(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> alto de 32, texto de 14 px e ícono de 12 px.
              </>,
              <>
                <strong>Ancho:</strong> depende del texto; no existe <code>fullWidth</code>.
              </>,
            ],
            preview: link(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de texto y de ícono del enlace.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Texto que nombra el destino',
              description: 'Nombra el destino o el resultado en dos o tres palabras.',
              preview: link({}, 'Ver guía de uso'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto vago',
              description: 'No uses textos vagos como "Haz clic aquí" o "Más": no dicen a dónde llevan.',
              preview: link({}, 'Haz clic aquí'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Ícono en enlace externo',
              description: 'Deja el ícono en los enlaces que salen del sitio o abren otra pestaña.',
              preview: link({ target: '_blank', rel: 'noopener noreferrer' }, 'Ver documentación'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ícono en una acción',
              description: 'No pongas el ícono de enlace externo en una acción: promete una navegación.',
              preview: action({ iconRight: true }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Verbo en infinitivo',
              description: 'Empieza con un verbo en infinitivo que diga qué pasa: Ver, Descargar, Reenviar.',
              preview: link({}, 'Ver condiciones'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Solo un sustantivo',
              description: 'No uses solo un sustantivo: no dice si el enlace abre, descarga o envía.',
              preview: link({}, 'Condiciones'),
            },
          ],
        },
      ],
    },
  ],
};
