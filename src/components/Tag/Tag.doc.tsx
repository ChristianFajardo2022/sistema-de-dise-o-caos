import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Tag } from './Tag';
import type { TagState } from './Tag.types';

/*
 * Contenido de la página de documentación de Tag (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Tag.types.ts`, `Tag.variants.ts`, `Tag.tsx`), luego `Tag.docs.json`. Medidas: cápsula de 32 de alto (md) o 24 (sm),
 * padding X de 12 (8 en Mobile), gap de 4, ícono de 14 y texto de 12 regular en un marco de 16 de alto.
 * Diferencias con Figma: Figma llama a la prop Icon-left y a sus valores Default, Hover, Focus, Press e Inactive; el
 * código usa `iconLeft` y `state` con los mismos valores en minúscula. Figma no dibuja el foco: el código añade un
 * contorno de 2 px. Sin `onClick` la etiqueta es un `span` estático: no reacciona al puntero, pero `state` y `disabled` cambian su aspecto.
 */

// Figma: 9541:10661 (component set Tag)

type TagProps = Partial<ComponentProps<typeof Tag>>;

/** Etiqueta de ejemplo. Con `clickable` recibe `onClick`: solo así existen Hover, Focus, Press e Inactive. */
const tag = (props: TagProps & { clickable?: boolean } = {}, label: ReactNode = 'Activo') => {
  const { clickable, ...rest } = props;
  const p = (clickable ? { ...rest, onClick: () => {} } : rest) as TagProps;
  return <Tag {...p}>{label}</Tag>;
};

/** Varias etiquetas en una fila, con `key`. */
const row = (...items: ReactNode[]) => (
  <div className="flex flex-wrap items-center gap-ds-space-general-lg">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

const stateSamples = (state: TagState): ReactNode[] => [
  tag({ clickable: true, state }, 'Reciente'),
  tag({ clickable: true, state, type: 'success', size: 'sm' }, 'Aprobado'),
];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Es el aspecto de la etiqueta estática y el de la clicable sin interacción.',
    samples: stateSamples('default'),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero sobre la etiqueta clicable. El fondo pasa de <code>secondary</code> a <code>firts</code> en los tipos de color (Success: <code>background-semantic-success-firts</code>).
      </>
    ),
    samples: stateSamples('hover'),
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al llegar con el teclado. Suma un contorno de 2 px, que Figma no dibuja. El fondo es el de Hover; solo Default en modo claro conserva el de reposo.',
    samples: stateSamples('focus'),
  },
  {
    label: 'Press',
    tone: 'accent',
    description: 'Mientras se pulsa. El fondo es el más marcado del tipo.',
    samples: stateSamples('press'),
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        Etiqueta no disponible. En el botón es <code>disabled</code> nativo: no recibe foco ni clic.
      </>
    ),
    samples: stateSamples('inactive'),
  },
];

export const doc: ComponentDocContent = {
  name: 'Tag',
  icon: 'tag',
  classification: 'atomo',
  summary:
    'El Tag es el átomo para marcar un elemento con una palabra corta: su estado, su categoría o un filtro. Une un ícono opcional de 14 px con un texto dentro de una cápsula y cambia de color según su tipo. Sin onClick es solo una marca; con onClick es un botón.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una cápsula con un ícono opcional a la izquierda y el texto de la etiqueta.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Etiqueta con ícono y texto',
                  preview: tag({ 'data-slot': 'tag' } as TagProps),
                  marks: [
                    { n: 1, selector: '[data-slot="tag"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Text-button"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="tag"]', side: 'left' },
                    { kind: 'padding', selector: '[data-slot="tag"]', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="Icon-sizes"]', to: '[data-figma-part="Text-button"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> cápsula con radio completo (<code>radius/button/full</code>). Su padding en X es de 12 (<code>space/button/xl</code>) y en Y de 8 (<code>space/button/lg</code>) en md; en sm, de 4 (<code>space/button/md</code>). Entre ícono y texto hay 4 (<code>gap/button/internal-margin/md</code>).
                </>,
                <>
                  <strong>Ícono:</strong> 14 px y relleno, a la izquierda. Es opcional (<code>iconLeft</code>) y por defecto es <code>tag</code>; se cambia con <code>icon</code>. Es decorativo.
                </>,
                <>
                  <strong>Texto:</strong> es la etiqueta (<code>children</code>), en Helvetica Neue regular de 12 (<code>typography/button/size/sm</code>), en un marco de 16 de alto (<code>dimention/button/container/xs</code>). No salta de línea.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños y sin ícono',
                  preview: row(
                    tag({ size: 'md', 'data-slot': 'tag' } as TagProps, 'Activo'),
                    tag({ size: 'sm', 'data-slot': 'tag' } as TagProps, 'Activo'),
                    tag({ size: 'md', iconLeft: false, 'data-slot': 'tag' } as TagProps, 'Activo')
                  ),
                  marks: [
                    { n: 1, selector: '[data-slot="tag"]', index: 0, side: 'top' },
                    { n: 2, selector: '[data-slot="tag"]', index: 1, side: 'top' },
                    { n: 3, selector: '[data-slot="tag"]', index: 2, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-slot="tag"]', index: 0 },
                    { kind: 'height', selector: '[data-slot="tag"]', index: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Tamaño md:</strong> 32 de alto. Es el valor por defecto (<code>size=&quot;md&quot;</code>).
                </>,
                <>
                  <strong>Tamaño sm:</strong> 24 de alto (<code>size=&quot;sm&quot;</code>). Ícono y texto miden lo mismo que en md; solo cambia el padding en Y.
                </>,
                <>
                  <strong>Sin ícono:</strong> con <code>iconLeft={'{false}'}</code> la cápsula queda solo con el texto y el padding en X no cambia.
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
          Tag tiene 5 estados, que se aplican solo cuando recibe <code>onClick</code> y es un botón. Sin <code>onClick</code> es un <code>span</code> estático y no es interactivo, pero <code>state</code> y <code>disabled</code> también cambian su aspecto. Hover, Focus y Press se fuerzan con <code>state</code> solo para documentar. Los tipos (aspecto) van en Tokens y modos.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default de cada tipo, en tamaño md. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Default',
              preview: tag({ type: 'default' }, 'Nuevo'),
              entries: [
                { part: 'Fondo', color: 'background-acent-secondary' },
                { part: 'Texto', color: 'text-acent-secondary', text: 'typography-button-size-sm' },
                { part: 'Ícono', color: 'icon-acent-tertiary' },
                { part: 'Contorno (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Success',
              preview: tag({ type: 'success' }, 'Aprobado'),
              entries: [
                { part: 'Fondo', color: 'background-semantic-success-secondary' },
                { part: 'Texto', color: 'text-semantic-success', text: 'typography-button-size-sm' },
                { part: 'Ícono', color: 'icon-semantic-success-tertiary' },
              ],
            },
            {
              title: 'Alert',
              preview: tag({ type: 'alert' }, 'Pendiente'),
              entries: [
                { part: 'Fondo', color: 'background-semantic-alert-secondary' },
                { part: 'Texto', color: 'text-semantic-alert', text: 'typography-button-size-sm' },
                { part: 'Ícono', color: 'icon-semantic-alert-tertiary' },
              ],
            },
            {
              title: 'Error',
              preview: tag({ type: 'error' }, 'Rechazado'),
              entries: [
                { part: 'Fondo', color: 'background-semantic-error-secondary' },
                { part: 'Texto', color: 'text-semantic-error', text: 'typography-button-size-sm' },
                { part: 'Ícono', color: 'icon-semantic-error-tertiary' },
              ],
            },
            {
              title: 'Info',
              preview: tag({ type: 'info' }, 'Reciente'),
              entries: [
                { part: 'Fondo', color: 'background-semantic-information-secondary' },
                { part: 'Texto', color: 'text-semantic-information', text: 'typography-button-size-sm' },
                { part: 'Ícono', color: 'icon-semantic-information-tertiary' },
              ],
            },
            {
              title: 'Neutral md',
              preview: tag({ type: 'neutral', size: 'md' }, 'Borrador'),
              entries: [
                { part: 'Fondo', color: 'background-general-white' },
                { part: 'Texto', color: 'text-neutral-black', text: 'typography-button-size-sm' },
                { part: 'Ícono', color: 'icon-general-black' },
              ],
            },
            {
              title: 'Neutral sm',
              preview: tag({ type: 'neutral', size: 'sm' }, 'Borrador'),
              entries: [
                { part: 'Fondo', color: 'background-general-gray-firts' },
                { part: 'Texto', color: 'text-neutral-black', text: 'typography-button-size-sm' },
                { part: 'Ícono', color: 'icon-general-black' },
              ],
            },
            {
              title: 'Inactive',
              preview: tag({ clickable: true, state: 'inactive' }, 'Reciente'),
              entries: [
                { part: 'Fondo', color: 'background-general-gray-sixth' },
                { part: 'Texto', color: 'text-neutral-disabled-on-card', text: 'typography-button-size-sm' },
                { part: 'Ícono', color: 'icon-general-disabled-negative' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Tag en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Tag en la librería de Assets y arrástralo junto al elemento que marca. Sus propiedades son Type, State, Size, Icon-left y Text.
            </>,
            <>
              <strong>Type y Size:</strong> Type tiene Default, Success, Alert, Error, Info y Neutral, que en código son <code>type</code> en minúscula. Size es md (32) o sm (24) y en código es <code>size</code>.
            </>,
            <>
              <strong>State:</strong> Default, Hover, Focus, Press e Inactive son los valores de <code>state</code> en minúscula. En código los estados salen de CSS y <code>state</code> solo los fuerza para documentar; <code>Inactive</code> equivale a <code>disabled</code>.
            </>,
            <>
              <strong>Icon-left y Text:</strong> Icon-left es <code>iconLeft</code> y el ícono se cambia con <code>icon</code>. Text es el contenido y en código es <code>children</code>.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja el foco ni distingue la etiqueta estática de la clicable. El código suma el contorno de Focus y decide el elemento por <code>onClick</code>: sin él es un <code>span</code>; con él, un <code>button</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Tag es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Marcar el estado o la categoría de un elemento:</strong> una palabra corta y sin <code>onClick</code>, como Activo o Borrador. Es un <code>span</code> y no recibe foco.
            </>,
            <>
              <strong>Filtros y selección rápida:</strong> pasa <code>onClick</code> para que sea un <code>button</code> con hover, foco visible y press. Se activa con Enter y con Espacio.
            </>,
            <>
              <strong>Dar significado con el tipo:</strong> <code>success</code>, <code>alert</code>, <code>error</code> e <code>info</code> refuerzan el texto con color. El texto debe bastar sin el color.
            </>,
            <>
              <strong>Etiqueta no disponible:</strong> en un botón, <code>disabled</code> la deja inactiva y fuera del orden de tabulación.
            </>,
          ],
          avoid: [
            <>
              <strong>Un contador o un punto sin texto:</strong> el Tag siempre lleva texto. (Alternativa: <code>Badge</code>).
            </>,
            <>
              <strong>La acción principal de una vista:</strong> una etiqueta clicable es un atajo, no una llamada a la acción. (Alternativa: <code>Button</code>).
            </>,
            <>
              <strong>Etiquetas que se pueden quitar:</strong> el Tag no trae ícono de cerrar ni <code>onRemove</code>. (Alternativa: <code>Chip</code>).
            </>,
            <>
              <strong>Texto largo:</strong> no salta de línea y la cápsula se alarga. Resume en una o dos palabras.
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
                title: 'Etiqueta en una fila',
                bullets: [
                  <>
                    <strong>Padding en X:</strong> 12 (<code>space/button/xl</code>), igual que en Tablet.
                  </>,
                  <>
                    <strong>Medidas:</strong> 32 de alto en md y 24 en sm, ícono de 14 px y texto de 12.
                  </>,
                ],
                preview: row(tag({}, 'Activo'), tag({ size: 'sm' }, 'Activo')),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Padding en X:</strong> 8 en Mobile (<code>space/button/xl</code>), 4 menos que en Desktop y Tablet.
              </>,
              <>
                <strong>Medidas:</strong> 32 de alto en md y 24 en sm, ícono de 14 px y texto de 12, sin cambios.
              </>,
              <>
                <strong>Ancho:</strong> se ajusta al texto y no salta de línea. Si la fila no cabe, las etiquetas pasan a la línea siguiente.
              </>,
            ],
            preview: row(tag({}, 'Activo'), tag({ size: 'sm' }, 'Activo')),
          },
          tablet: {
            bullets: [
              <>
                <strong>Padding en X:</strong> 12 (<code>space/button/xl</code>), igual que en Desktop.
              </>,
              <>
                <strong>Medidas:</strong> 32 de alto en md y 24 en sm, ícono de 14 px y texto de 12.
              </>,
              <>
                <strong>Ancho:</strong> se ajusta al texto y no salta de línea. Si la fila no cabe, las etiquetas pasan a la línea siguiente.
              </>,
            ],
            preview: row(tag({}, 'Activo'), tag({ size: 'sm' }, 'Activo')),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de texto, tipo y tamaño del Tag.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Texto corto',
              description: 'Escribe una o dos palabras.',
              preview: tag({}, 'En revisión'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto largo',
              description: 'No metas una frase en la etiqueta.',
              preview: tag({}, 'En revisión por el equipo de diseño'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Tipo según el significado',
              description: 'Usa success para un resultado correcto.',
              preview: tag({ type: 'success' }, 'Aprobado'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tipo que contradice',
              description: 'No uses error para un resultado correcto.',
              preview: tag({ type: 'error' }, 'Aprobado'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Mismo tamaño en grupo',
              description: 'Usa un solo tamaño en un grupo de etiquetas.',
              preview: row(tag({}, 'Nuevo'), tag({ type: 'info' }, 'Reciente')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tamaños mezclados',
              description: 'No mezcles md y sm en un mismo grupo.',
              preview: row(tag({}, 'Nuevo'), tag({ type: 'info', size: 'sm' }, 'Reciente')),
            },
          ],
        },
      ],
    },
  ],
};
