import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';
import type { EmptyStateType } from './EmptyState.types';

/*
 * Contenido de la página de documentación de EmptyState (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`EmptyState.types.ts`, `EmptyState.variants.ts`, `EmptyState.tsx`), luego `EmptyState.docs.json`. Medidas: columna
 * centrada de ancho fluido (326 en Figma) con gap de 24 (20 en Mobile); dibujo de 102 × 107.95; texto con gap de 10;
 * botones md con gap de 16. Diferencias con Figma: el fondo del cuadro del ícono usa
 * `background/container/hover-on-canva` en el código y Figma enlaza `background/container/default-on-canva`; en tokens.css
 * el par de título 20/24 (18/22 en Mobile) se llama `heading/lg` y variants.ts lo cita como `heading/md` de Figma; Figma
 * dibuja los botones en dos marcos (Desktop y Mobile) y el código resuelve ambos con un solo contenedor responsive; el
 * nivel del encabezado (`headingLevel`) y el ícono (`icon`) no existen en Figma.
 * Ilustraciones: solo las que trae el componente (cuadros y los cuatro íconos por tipo).
 */

// Figma: 12304:6287 (component set Empty states)

type EmptyStateProps = Partial<ComponentProps<typeof EmptyState>>;

const noop = () => {};

/** Textos de ejemplo por tipo: neutros y con la acción que corresponde. */
const SAMPLE: Record<EmptyStateType, { title: string; description: string; action?: string }> = {
  'first-use': { title: 'Aún no hay documentos', description: 'Sube el primero para verlo aquí.', action: 'Subir archivo' },
  'no-results': { title: 'Sin resultados', description: 'Prueba con otras palabras o quita algún filtro.', action: 'Limpiar filtros' },
  'errors-issues': { title: 'No se pudo cargar la lista', description: 'Revisa la conexión e inténtalo de nuevo.', action: 'Reintentar' },
  'no-content': { title: 'Nada por aquí', description: 'Esta sección todavía no tiene contenido.' },
};

/** Mensaje de ejemplo del tipo indicado, con su acción principal si la tiene. Los textos y acciones se pueden reemplazar. */
const message = (type: EmptyStateType = 'first-use', props: EmptyStateProps = {}) => {
  const s = SAMPLE[type];
  return (
    <EmptyState
      type={type}
      title={s.title}
      description={s.description}
      primaryAction={s.action ? { label: s.action, onClick: noop } : undefined}
      {...props}
    />
  );
};

/** Mensaje con sus dos acciones. */
const both = (props: EmptyStateProps = {}) =>
  message('first-use', { secondaryAction: { label: 'Ver ayuda', onClick: noop }, ...props });

/** Solo el dibujo, sin textos ni acciones. */
const art = (type: EmptyStateType, props: EmptyStateProps = {}) => <EmptyState type={type} {...props} />;

const states: DocStateItem[] = [
  {
    label: 'First Use',
    tone: 'neutral',
    description: (
      <>
        Primer uso: todavía no hay datos. Trae el ícono <code>add-circle</code> y suele ofrecer crear el primero.
      </>
    ),
    samples: [message('first-use')],
  },
  {
    label: 'No Results',
    tone: 'neutral',
    description: (
      <>
        Una búsqueda o un filtro sin coincidencias. Trae el ícono <code>search</code>.
      </>
    ),
    samples: [message('no-results')],
  },
  {
    label: 'Errors & Issues',
    tone: 'neutral',
    description: (
      <>
        Algo falló y se puede reintentar. Trae el ícono <code>warning</code> y conserva los colores neutros del resto.
      </>
    ),
    samples: [message('errors-issues')],
  },
  {
    label: 'No Content',
    tone: 'neutral',
    description: (
      <>
        Sección vacía sin acción posible. Trae el ícono <code>document</code> y no lleva botones.
      </>
    ),
    samples: [message('no-content')],
  },
];

export const doc: ComponentDocContent = {
  name: 'EmptyState',
  icon: 'document',
  classification: 'molecula',
  summary:
    'El EmptyState es la molécula que ocupa el lugar de un contenido que no existe, no tiene resultados o no se pudo cargar. Une un dibujo con ícono, un título, una descripción y hasta dos Button para seguir.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una columna centrada: dibujo de cuadros con un ícono, texto y una fila opcional de acciones.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Mensaje con dos acciones',
                  preview: <div className="w-[326px] max-w-full">{both({ 'data-slot': 'empty-state' } as EmptyStateProps)}</div>,
                  marks: [
                    { n: 1, selector: '[data-slot="empty-state"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Group"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Title"]', side: 'left' },
                    { n: 5, selector: '[data-figma-part="Descripción"]', side: 'right' },
                    { n: 6, selector: '[data-figma-part="Buttons"]', side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Group"]', to: '[data-figma-part="Text"]', axis: 'y' },
                    { kind: 'gap', from: '[data-figma-part="Title"]', to: '[data-figma-part="Descripción"]', axis: 'y' },
                    { kind: 'gap', from: '[data-figma-part="Text"]', to: '[data-figma-part="Buttons"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> columna centrada de ancho fluido (326 en Figma), sin padding. Entre dibujo, texto y botones hay 24 (<code>space/general/3xl</code>) y 20 en Mobile.
                </>,
                <>
                  <strong>Dibujo:</strong> grupo decorativo de 102 × 108. Suma un cuadro de 80 con contorno sólido de 1 px (<code>border/general/gray-fourth</code>, al 70%), otro con contorno punteado 5/5 y el cuadro del ícono. Los lectores de pantalla lo ignoran.
                </>,
                <>
                  <strong>Ícono:</strong> 32 px de línea (<code>icon/acent/firts</code>), centrado en un cuadro de 60 con radio de 12 (<code>radius/general/lg</code>). Cada tipo trae el suyo y se cambia con <code>icon</code>.
                </>,
                <>
                  <strong>Título:</strong> encabezado real, centrado, en Prospero semibold de 20 con interlineado de 24 (<code>typography/heading/size/lg</code>). Es opcional (<code>title</code>) y su nivel se elige con <code>headingLevel</code>.
                </>,
                <>
                  <strong>Descripción:</strong> párrafo centrado, en Helvetica Neue regular de 14 con interlineado de 20 (<code>typography/body/size/md</code>). Es opcional (<code>description</code>) y está a 10 del título.
                </>,
                <>
                  <strong>Acciones:</strong> hasta dos Button md, con 16 entre ellos (<code>space/general/2xl</code>). La secundaria (<code>secondaryAction</code>) va a la izquierda y la principal (<code>primaryAction</code>) a la derecha. Si no hay ninguna, la fila no se dibuja.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Ícono de cada tipo',
                  preview: (
                    <div className="flex items-center gap-ds-space-general-2xl">
                      {art('first-use')}
                      {art('no-results')}
                      {art('errors-issues')}
                      {art('no-content')}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Frame 12"]', index: 0, side: 'top' },
                    { n: 2, selector: '[data-figma-part="Frame 12"]', index: 1, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Frame 12"]', index: 2, side: 'top' },
                    { n: 4, selector: '[data-figma-part="Frame 12"]', index: 3, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>First Use:</strong> ícono <code>add-circle</code> (<code>type=&quot;first-use&quot;</code>). Es el tipo por defecto.
                </>,
                <>
                  <strong>No Results:</strong> ícono <code>search</code> (<code>type=&quot;no-results&quot;</code>).
                </>,
                <>
                  <strong>Errors &amp; Issues:</strong> ícono <code>warning</code> (<code>type=&quot;errors-issues&quot;</code>).
                </>,
                <>
                  <strong>No Content:</strong> ícono <code>document</code> (<code>type=&quot;no-content&quot;</code>). Con <code>icon</code> se reemplaza el de cualquier tipo.
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
          EmptyState tiene 4 variantes de aspecto, una por <code>type</code>, y no es interactivo: no tiene Hover, Focus ni Press. Sus botones sí lo son y siguen los estados de Button. La diferencia entre tipos es el ícono y el texto; los colores son los mismos.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens compartidos por los cuatro tipos, en estado Default. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Dibujo',
              preview: art('first-use'),
              entries: [
                { part: 'Contorno sólido', color: 'border-general-gray-fourth' },
                { part: 'Contorno punteado', color: 'border-general-gray-fourth' },
                { part: 'Fondo del cuadro del ícono', color: 'background-container-hover-on-canva' },
                { part: 'Ícono', color: 'icon-acent-firts' },
              ],
            },
            {
              title: 'Texto',
              preview: message('first-use', { primaryAction: undefined }),
              entries: [
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-lg' },
                { part: 'Descripción', color: 'text-neutral-body', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Acción principal',
              preview: <Button variant="primary" size="md">Continuar</Button>,
              entries: [
                { part: 'Fondo', color: 'background-button-primary-default' },
                { part: 'Texto', color: 'text-button-primary-default', text: 'typography-button-size-md-uniform' },
                { part: 'Ícono', color: 'icon-button-primary-default' },
              ],
            },
            {
              title: 'Acción secundaria',
              preview: <Button variant="secondary" size="md">Continuar</Button>,
              entries: [
                { part: 'Contorno', color: 'border-button-secondary-low-default' },
                { part: 'Texto', color: 'text-button-secondary-low-default', text: 'typography-button-size-md-uniform' },
                { part: 'Ícono', color: 'icon-button-secondary-low-default' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente EmptyState en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Empty states en la librería de Assets. Sus propiedades son Type, Title, Title text, Text, Buttons, Button primary y Button secondary.
            </>,
            <>
              <strong>Type:</strong> First Use, No Results, Errors &amp; Issues y No Content son los valores de <code>type</code> (<code>first-use</code>, <code>no-results</code>, <code>errors-issues</code> y <code>no-content</code>). Cada uno trae su ícono. Figma no tiene una propiedad para cambiarlo; el código la tiene (<code>icon</code>).
            </>,
            <>
              <strong>Title, Title text y Text:</strong> Title y Text muestran u ocultan el texto. Title text y Text son el contenido y en código son <code>title</code> y <code>description</code>. Sin la prop, la parte no se dibuja.
            </>,
            <>
              <strong>Buttons, Button primary y Button secondary:</strong> en código son <code>primaryAction</code> y <code>secondaryAction</code>, con la forma <code>{'{ label, ...atributos de button }'}</code>. La fila aparece solo si hay al menos una acción.
            </>,
            <>
              <strong>Diferencias:</strong> Figma dibuja las acciones en dos marcos, Desktop y Mobile. El código usa un solo contenedor que cambia con el breakpoint. Figma tampoco tiene nivel de encabezado; el código lo expone como <code>headingLevel</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el EmptyState es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Primer uso:</strong> una lista o sección que aún no tiene datos. Invita a crear el primero con <code>type=&quot;first-use&quot;</code>.
            </>,
            <>
              <strong>Búsqueda o filtro sin coincidencias:</strong> explica que no hay resultados y ofrece limpiar los filtros con <code>type=&quot;no-results&quot;</code>.
            </>,
            <>
              <strong>Contenido que no se pudo cargar:</strong> con <code>type=&quot;errors-issues&quot;</code> y una acción para reintentar.
            </>,
            <>
              <strong>Sección vacía sin acción posible:</strong> con <code>type=&quot;no-content&quot;</code>, solo título y descripción.
            </>,
          ],
          avoid: [
            <>
              <strong>Un mensaje junto a contenido visible:</strong> el EmptyState reemplaza al contenido ausente, no lo acompaña. (Alternativa: <code>Alert</code>).
            </>,
            <>
              <strong>Un aviso pasajero tras una acción:</strong> el EmptyState se queda en pantalla. (Alternativa: <code>Toast</code>).
            </>,
            <>
              <strong>Una carga en curso:</strong> el mensaje dice que no hay nada, no que algo está cargando. (Alternativa: <code>Spinner</code>).
            </>,
            <>
              <strong>Más de dos acciones:</strong> el componente admite una principal y una secundaria. Deja la principal y mueve el resto a la vista.
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
                title: 'Dos acciones',
                bullets: [
                  <>
                    <strong>Acciones en fila:</strong> la secundaria a la izquierda y la principal a la derecha, con 16 entre ellas. Si no caben, bajan de línea.
                  </>,
                  <>
                    <strong>Medidas:</strong> gap de 24 (<code>space/general/3xl</code>), título de 20 con interlineado de 24 y descripción de 14.
                  </>,
                ],
                preview: both(),
              },
              {
                title: 'Sin acciones',
                bullets: [
                  <>
                    <strong>Sin fila de botones:</strong> si no hay acciones, el mensaje termina en la descripción.
                  </>,
                  <>
                    <strong>Ancho:</strong> es fluido; ocupa el del contenedor y centra el contenido.
                  </>,
                ],
                preview: message('no-content'),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Acciones apiladas:</strong> los botones ocupan todo el ancho y la principal queda arriba. El orden del teclado no cambia: el foco va primero a la secundaria, que queda abajo.
              </>,
              <>
                <strong>Medidas:</strong> gap de 20 (<code>space/general/3xl</code>) y título de 18 con interlineado de 22. La descripción sigue en 14.
              </>,
              <>
                <strong>Dibujo:</strong> mide lo mismo que en Desktop (102 × 108).
              </>,
            ],
            preview: both(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Acciones en fila:</strong> igual que en Desktop, con la secundaria a la izquierda y la principal a la derecha; si no caben, bajan de línea.
              </>,
              <>
                <strong>Medidas:</strong> gap de 24, título de 20 con interlineado de 24 y descripción de 14.
              </>,
              <>
                <strong>Ancho:</strong> es fluido y el mensaje se centra en el contenedor.
              </>,
            ],
            preview: both(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de título, acciones y descripción del EmptyState.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título concreto',
              description: 'Nombra la situación en el título.',
              preview: message('first-use'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título vacío de sentido',
              description: 'No uses títulos genéricos como Ups.',
              preview: message('first-use', { title: 'Ups' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Acción con verbo',
              description: 'El botón dice qué pasa al pulsarlo.',
              preview: message('errors-issues'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Acción genérica',
              description: 'No uses Aceptar ni OK como acción.',
              preview: message('errors-issues', { primaryAction: { label: 'Aceptar', onClick: noop } }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Descripción breve',
              description: 'Explica en una frase qué hacer.',
              preview: message('no-results'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Descripción larga',
              description: 'No escribas párrafos.',
              preview: message('no-results', {
                description:
                  'No se encontró ninguna coincidencia con los datos que escribiste. Revisa cada palabra, prueba con sinónimos, quita los filtros uno por uno y vuelve a buscar con calma.',
              }),
            },
          ],
        },
      ],
    },
  ],
};
