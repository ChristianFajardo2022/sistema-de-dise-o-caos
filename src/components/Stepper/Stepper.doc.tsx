import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Stepper } from './Stepper';
import type { StepperItem, StepperStatus } from './Stepper.types';

/*
 * Contenido de la página de documentación de Stepper (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Stepper.types.ts`, `Stepper.variants.ts`, `Stepper.tsx`, `StepperStep.tsx`), luego `Stepper.docs.json`. Diferencias
 * con Figma: la barra de Incomplete usa `background/container/disabled-on-canva` y Figma pide
 * `background/container/default-on-card`; Figma no dibuja el anillo de foco de los pasos navegables y el código lo agrega.
 */

// Figma: 13965:5884 (component set Stepper) y 13804:20926 (component set Indicators (Atom))

type StepperProps = Partial<ComponentProps<typeof Stepper>>;

const STEPS: StepperItem[] = [
  { title: 'Cuenta', description: 'Correo y contraseña' },
  { title: 'Perfil', description: 'Nombre y foto' },
  { title: 'Preferencias', description: 'Idioma y avisos' },
  { title: 'Revisión', description: 'Confirmar los datos' },
];

/** Stepper de ejemplo: por defecto vertical, con cuatro pasos y el segundo en curso. */
const stepper = (props: StepperProps = {}, steps: StepperItem[] = STEPS) => (
  <Stepper aria-label="Progreso del registro" current={1} steps={steps} {...props} />
);

/** Un solo paso con el estado indicado, vertical u horizontal. */
const one = (status: StepperStatus, orientation: 'vertical' | 'horizontal' = 'vertical') => (
  <Stepper
    aria-label={`Paso ${status}`}
    orientation={orientation}
    steps={[{ title: 'Perfil', description: 'Nombre y foto', status }]}
  />
);

/** Marco de ancho fijo para los lienzos y las tarjetas. */
const frame = (width: string, content: ReactNode) => <div className={width}>{content}</div>;

const states: DocStateItem[] = [
  {
    label: 'Incomplete',
    tone: 'neutral',
    description: (
      <>
        Paso pendiente. Barra deshabilitada, ícono de información con trazo (<code>info-circle</code>) y título en el color del texto.
      </>
    ),
    samples: [frame('w-full', one('incomplete')), frame('w-full', one('incomplete', 'horizontal'))],
  },
  {
    label: 'In progress',
    tone: 'accent',
    description: (
      <>
        Paso en curso. Barra de énfasis (<code>background/general/white</code>), aro de 12 px en lugar del ícono y <code>aria-current=&quot;step&quot;</code>.
      </>
    ),
    samples: [frame('w-full', one('in-progress')), frame('w-full', one('in-progress', 'horizontal'))],
  },
  {
    label: 'Complete',
    tone: 'success',
    description: (
      <>
        Paso terminado. Barra de énfasis (<code>background/general/white</code>), ícono de verificación (<code>tick-circle</code>) y título destacado.
      </>
    ),
    samples: [frame('w-full', one('complete')), frame('w-full', one('complete', 'horizontal'))],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Paso con un problema. Barra, ícono (<code>close-circle</code>) y título en el color de error. Se fuerza con <code>status=&quot;error&quot;</code>.
      </>
    ),
    samples: [frame('w-full', one('error')), frame('w-full', one('error', 'horizontal'))],
  },
];

const long: StepperItem[] = [
  { title: 'Crear una cuenta con correo y contraseña', description: 'Correo y contraseña' },
  { title: 'Completar el perfil con nombre y foto', description: 'Nombre y foto' },
  { title: 'Elegir las preferencias de idioma y avisos', description: 'Idioma y avisos' },
];

/** Pasos de título corto y texto de apoyo largo: necesitan varias líneas. */
const wordy: StepperItem[] = [
  { title: 'Cuenta', description: 'Escribe el correo y elige una contraseña segura' },
  { title: 'Perfil', description: 'Agrega tu nombre completo y una foto reciente' },
  { title: 'Avisos', description: 'Decide qué mensajes quieres recibir y cada cuánto' },
];

const short: StepperItem[] = [
  { title: 'Cuenta', description: 'Correo y contraseña' },
  { title: 'Perfil', description: 'Nombre y foto' },
  { title: 'Preferencias', description: 'Idioma y avisos' },
];

export const doc: ComponentDocContent = {
  name: 'Stepper',
  icon: 'clipboard-tick',
  classification: 'molecula',
  summary:
    'El Stepper es la molécula para mostrar el avance de un proceso por pasos, como un registro o unos ajustes guiados. Une varios pasos, cada uno con su barra, su estado, un título y un texto de apoyo, en columna o en fila. Con una acción, cada paso es navegable.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Una lista ordenada agrupa los pasos. Cada paso une una barra de estado y un contenido con el título, su ícono y el texto de apoyo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Vertical',
                  preview: frame('w-64', stepper()),
                  marks: [
                    { n: 1, selector: 'ol', side: 'right' },
                    { n: 2, selector: '[data-figma-part="indicator"]', index: 1, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', index: 0, side: 'top' },
                    { n: 4, selector: '[data-figma-part="Step 1"]', index: 0, side: 'top' },
                    { n: 5, selector: '[data-figma-part="Personal info"]', index: 0, side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: 'ol > li', fromIndex: 0, to: 'ol > li', toIndex: 1, axis: 'y' },
                    { kind: 'gap', from: '[data-figma-part="indicator"]', fromIndex: 0, to: '[data-figma-part="Content"]', toIndex: 0 },
                    { kind: 'padding', selector: '[data-figma-part="Content"]', index: 0, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Lista:</strong> <code>ol</code> en columna con 8 px entre pasos (<code>space/general/lg</code>). Recibe <code>className</code> y <code>aria-label</code>.
                </>,
                <>
                  <strong>Barra:</strong> 2 px de ancho y todo el alto del paso, con radio completo (<code>radius/general/full</code>). Su color dice el estado.
                </>,
                <>
                  <strong>Ícono:</strong> 14 px a la izquierda del título, según el estado. Es decorativo: el estado lo dice un texto oculto.
                </>,
                <>
                  <strong>Título:</strong> 14/18 px semibold (<code>typography/body/size/md</code>), a 8 px del ícono. Sin título no se dibuja la fila.
                </>,
                <>
                  <strong>Texto de apoyo y contenido:</strong> 14/18 px regular bajo el título. El contenido va a 16 px de la barra (<code>space/general/2xl</code>), con 12 px de padding arriba y abajo (<code>space/general/xl</code>) y 8 px entre sus partes.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Horizontal',
                  preview: frame('w-[360px]', stepper({ orientation: 'horizontal' }, STEPS.slice(0, 3))),
                  marks: [
                    { n: 1, selector: 'ol', side: 'left' },
                    { n: 2, selector: '[data-figma-part="indicator"]', index: 1, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Content"]', index: 1, side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: 'ol > li', fromIndex: 0, to: 'ol > li', toIndex: 1 },
                    { kind: 'gap', from: '[data-figma-part="indicator"]', fromIndex: 0, to: '[data-figma-part="Content"]', toIndex: 0, axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Lista:</strong> <code>orientation=&quot;horizontal&quot;</code> pone los pasos en fila, con 8 px entre ellos. Cada paso ocupa la misma fracción del ancho.
                </>,
                <>
                  <strong>Barra:</strong> pasa arriba del paso, de 2 px de alto y todo su ancho.
                </>,
                <>
                  <strong>Contenido:</strong> a 16 px de la barra y sin padding vertical. El título y el texto de apoyo se parten en varias líneas si no caben.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Íconos de cada estado',
                  preview: frame(
                    'w-64',
                    <Stepper
                      aria-label="Estados del paso"
                      steps={[
                        { title: 'Pendiente', description: 'Aún sin empezar', status: 'incomplete' },
                        { title: 'En curso', description: 'Paso actual', status: 'in-progress' },
                        { title: 'Completado', description: 'Paso terminado', status: 'complete' },
                        { title: 'Con error', description: 'Requiere revisión', status: 'error' },
                      ]}
                    />
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Icon-sizes"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Ellipse 1"]', index: 0, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', index: 1, side: 'left' },
                    { n: 4, selector: '[data-figma-part="Icon-sizes"]', index: 2, side: 'left' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Incomplete:</strong> <code>info-circle</code> de 14 px con trazo, en <code>background/general/gray-secondary</code>.
                </>,
                <>
                  <strong>In progress:</strong> aro de 12 px con trazo de 1 px (<code>border/general/white</code>) en lugar del ícono.
                </>,
                <>
                  <strong>Complete:</strong> <code>tick-circle</code> de 14 px con relleno, en <code>background/general/white</code>.
                </>,
                <>
                  <strong>Error:</strong> <code>close-circle</code> de 14 px con relleno, en <code>background/semantic/error/tertiary</code>.
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
          Stepper no es interactivo: sus estados son 4 variantes de aspecto, una por <code>status</code> del paso. <code>current</code> los deriva o <code>status</code> fuerza uno. Con <code>onStepClick</code> cada paso es un botón y muestra un anillo de 2 px al recibir el foco con el teclado.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada estado del paso. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Incomplete',
              preview: frame('w-full', one('incomplete')),
              entries: [
                { part: 'Barra', color: 'background-container-disabled-on-canva' },
                { part: 'Ícono', color: 'background-general-gray-secondary' },
                { part: 'Título', color: 'text-neutral-body', text: 'typography-body-size-md' },
                { part: 'Texto de apoyo', color: 'text-neutral-body', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'In progress',
              preview: frame('w-full', one('in-progress')),
              entries: [
                { part: 'Barra', color: 'background-general-white' },
                { part: 'Trazo del aro', color: 'border-general-white' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-body-size-md' },
                { part: 'Texto de apoyo', color: 'text-neutral-body', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Complete',
              preview: frame('w-full', one('complete')),
              entries: [
                { part: 'Barra', color: 'background-general-white' },
                { part: 'Ícono', color: 'background-general-white' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-body-size-md' },
                { part: 'Texto de apoyo', color: 'text-neutral-body', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Error',
              preview: frame('w-full', one('error')),
              entries: [
                { part: 'Barra', color: 'background-semantic-error-tertiary' },
                { part: 'Ícono', color: 'background-semantic-error-tertiary' },
                { part: 'Título', color: 'text-semantic-error-secondary', text: 'typography-body-size-md' },
                { part: 'Texto de apoyo', color: 'text-neutral-body', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Paso navegable',
              preview: frame('w-full', stepper({ onStepClick: () => {} }, STEPS.slice(0, 2))),
              entries: [{ part: 'Anillo de foco (Focus)', color: 'border-field-active' }],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Stepper en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Stepper en la librería de Assets. Su propiedad es Orientation, y los pasos van como instancias de Indicators (Atom) dentro de su slot Container.
            </>,
            <>
              <strong>Orientation:</strong> Vertical y Horizontal son <code>orientation=&quot;vertical&quot;</code> y <code>&quot;horizontal&quot;</code>. Indicators (Atom) también la tiene; en código cada paso la hereda del Stepper.
            </>,
            <>
              <strong>Propiedad 1:</strong> Incomplete, In progress, Complete y Error son <code>status=&quot;incomplete&quot;</code>, <code>&quot;in-progress&quot;</code>, <code>&quot;complete&quot;</code> y <code>&quot;error&quot;</code>. Title es <code>title</code> y Text es <code>description</code>.
            </>,
            <>
              <strong>Lo que difiere de Figma:</strong> en Figma el estado se elige paso por paso y el código lo deriva de <code>current</code>. Figma no dibuja el anillo de foco ni la versión navegable (<code>onStepClick</code>), y el código los agrega.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Stepper es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Procesos de varios pasos:</strong> un registro, unos ajustes guiados o una carga por etapas. <code>current</code> marca el paso en curso y deja completos los anteriores.
            </>,
            <>
              <strong>Pasos que se pueden revisar:</strong> <code>onStepClick</code> vuelve cada paso un botón que recibe su índice. Se alcanza con Tab y se activa con Enter o Espacio.
            </>,
            <>
              <strong>Un paso con problemas:</strong> <code>status=&quot;error&quot;</code> en ese paso. Los demás siguen el avance de <code>current</code>.
            </>,
            <>
              <strong>Estado sin depender del color:</strong> cada paso incluye un texto oculto con su estado (<code>statusLabels</code> lo traduce) y el paso en curso lleva <code>aria-current=&quot;step&quot;</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Un avance continuo:</strong> una carga o un porcentaje sin pasos con nombre. (Alternativa: <code>ProgressBar</code>).
            </>,
            <>
              <strong>Una espera sin pasos:</strong> una acción en curso de duración incierta. (Alternativa: <code>Spinner</code>).
            </>,
            <>
              <strong>Secciones de una misma vista:</strong> contenidos entre los que se alterna a voluntad. (Alternativa: <code>Tabs</code>).
            </>,
            <>
              <strong>Historial de eventos:</strong> registro de lo que ocurrió y cuándo. (Alternativa: <code>Timeline</code>).
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
                title: 'Vertical',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile. Ocupa el ancho de su contenedor.
                  </>,
                  <>
                    <strong>Medidas:</strong> barra de 2 px, 16 px hasta el contenido y 8 px entre pasos.
                  </>,
                ],
                preview: frame('w-full', stepper()),
              },
              {
                title: 'Horizontal',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile. Cada paso toma la misma fracción del ancho.
                  </>,
                  <>
                    <strong>Texto:</strong> 14/18 px, partido en varias líneas si el paso no tiene ancho.
                  </>,
                ],
                preview: frame('w-full', stepper({ orientation: 'horizontal' }, STEPS.slice(0, 3))),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile. La orientación no cambia sola con el ancho.
              </>,
              <>
                <strong>Medidas fijas:</strong> barra de 2 px, texto de 14/18 px y 12 px de padding vertical en el contenido vertical.
              </>,
              <>
                <strong>Ancho disponible:</strong> el paso vertical ocupa todo el ancho y su texto se parte en varias líneas.
              </>,
            ],
            preview: frame('w-full', stepper()),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile. La orientación no cambia sola con el ancho.
              </>,
              <>
                <strong>Medidas fijas:</strong> barra de 2 px, texto de 14/18 px y 12 px de padding vertical en el contenido vertical.
              </>,
              <>
                <strong>Ancho disponible:</strong> el paso vertical ocupa todo el ancho y su texto se parte en varias líneas.
              </>,
            ],
            preview: frame('w-full', stepper()),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de longitud del texto, paso en curso y orientación.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Títulos breves',
              description: 'Deja el detalle para el texto de apoyo.',
              preview: stepper({}, short),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Títulos largos',
              description: 'No metas el detalle dentro del título.',
              preview: stepper({}, long),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Un paso en curso',
              description: (
                <>
                  Marca el avance con <code>current</code>.
                </>
              ),
              preview: stepper({ current: 2 }, short),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Varios pasos en curso',
              description: (
                <>
                  No fuerces dos pasos en <code>in-progress</code>.
                </>
              ),
              preview: stepper(
                { current: undefined },
                short.map((s, i) => ({ ...s, status: i < 2 ? ('in-progress' as const) : ('incomplete' as const) }))
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Vertical con texto largo',
              description: (
                <>
                  Usa <code>orientation=&quot;vertical&quot;</code> si el texto necesita varias líneas.
                </>
              ),
              preview: stepper({}, wordy),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Horizontal con texto largo',
              description: (
                <>
                  No uses <code>orientation=&quot;horizontal&quot;</code> con pasos que se parten en muchas líneas.
                </>
              ),
              preview: stepper({ orientation: 'horizontal' }, wordy),
            },
          ],
        },
      ],
    },
  ],
};
