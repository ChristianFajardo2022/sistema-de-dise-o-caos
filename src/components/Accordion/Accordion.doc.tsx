import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Accordion, AccordionItem } from './Accordion';
import { Button } from '../Button';

/*
 * Contenido de la página de documentación de Accordion (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Accordion.types.ts`, `Accordion.variants.ts`, `Accordion.tsx`), luego `Accordion.docs.json`. La página cubre los dos
 * sets de Figma: Card accordion (Atom) es `AccordionItem` y Accordion es la lista `Accordion`. Diferencias con Figma:
 * Figma no tiene estado bloqueado ni foco, no distingue selección única de múltiple y dibuja la celda de Table con
 * `background/table/default`, `border/table/default` y `text/neutral/gray-2`, mientras que el código pinta las celdas sin
 * fondo ni trazo y con `text/neutral/white`.
 */

// Figma: 11733:11413 (component set Card accordion (Atom)) y 12174:11667 (component set Accordion)

type ItemProps = Partial<ComponentProps<typeof AccordionItem>>;

/** Contenido de muestra del slot: texto a todo el ancho y una acción alineada al final, como en Figma. */
const body = (text = 'Texto de apoyo con el detalle del archivo.') => (
  <>
    <p className="m-0 self-stretch font-ds-primitives-typography-family-primary text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-body">
      {text}
    </p>
    <Button variant="secondary" size="sm">
      Descargar
    </Button>
  </>
);

/** Ítem suelto. Cada ítem abierto lleva un título distinto: su panel es una región con ese nombre (axe `landmark-unique`). */
const item = (title: string, props: ItemProps = {}, content: ReactNode = body()) => (
  <AccordionItem title={title} {...props}>
    {content}
  </AccordionItem>
);

/** Grupo de tres ítems; `open` es el valor del ítem abierto al inicio. */
const group = (titles: [string, string, string], open: string, props: Partial<ComponentProps<typeof Accordion>> = {}) => (
  <Accordion defaultValue={open} {...(props as object)}>
    <AccordionItem value="a" title={titles[0]} description="Al día">
      {body()}
    </AccordionItem>
    <AccordionItem value="b" title={titles[1]}>
      {body()}
    </AccordionItem>
    <AccordionItem value="c" title={titles[2]}>
      {body()}
    </AccordionItem>
  </Accordion>
);

/** Superficie sobre la que se usa cada Contrast: On canva sobre el lienzo de la página, On card sobre un contenedor. */
const surface = (contrast: 'on-canva' | 'on-card', node: ReactNode) => (
  // Ancho de diseño fijo: la plantilla lo reduce entero cuando la muestra no cabe (no se encoge el componente)
  <div
    style={{ width: 360 }}
    className={
      contrast === 'on-canva'
        ? 'bg-ds-background-general-black p-ds-space-general-2xl'
        : 'bg-ds-background-container-default-on-canva p-ds-space-general-2xl'
    }
  >
    {node}
  </div>
);

const CELLS = ['Informe', 'Ana Pérez', 'Aprobado'];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description:
      'Ítem cerrado. Muestra el avatar, el título y la descripción, con el Button corner en la muesca. El panel queda fuera del orden de tabulación y del lector de pantalla.',
    samples: [surface('on-card', item('Informe trimestral', { description: 'Al día' }))],
  },
  {
    label: 'Dropdown',
    tone: 'accent',
    description: 'Ítem abierto. El panel se despliega en 300 ms y el ícono del Button corner gira 180 grados. Con movimiento reducido la altura salta sin animación.',
    samples: [surface('on-card', item('Acta de reunión', { description: 'Al día', defaultOpen: true }))],
  },
  {
    label: 'Abierto sin cierre',
    tone: 'neutral',
    description: (
      <>
        Con <code>collapsible={'{false}'}</code>, el ítem abierto de un grupo <code>single</code> queda con <code>aria-disabled</code> y el clic no lo cierra. Se ve igual que Dropdown hasta que se abre otro ítem.
      </>
    ),
    samples: [
      surface(
        'on-card',
        <Accordion defaultValue="a" collapsible={false}>
          <AccordionItem value="a" title="Manual de uso" description="Al día">
            {body()}
          </AccordionItem>
          <AccordionItem value="b" title="Registro de cambios">
            {body()}
          </AccordionItem>
        </Accordion>
      ),
    ],
  },
];

export const doc: ComponentDocContent = {
  name: 'Accordion',
  icon: 'chevron-down',
  classification: 'molecula',
  summary:
    'El Accordion es la molécula que organiza el contenido en ítems plegables: cada ítem es una tarjeta con título y descripción que abre o cierra su panel. Une un Avatar, un Button corner y un espacio para el contenido, y funciona suelto o en una lista.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Cada ítem es una tarjeta con un encabezado que se pulsa y un panel que se despliega. Un grupo reúne varios ítems en una columna. Type Table cambia el encabezado por una fila de celdas.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Card accordion (Atom) abierto',
                  width: 480,
                  preview: item('Informe trimestral', { description: 'Al día', contrast: 'on-canva', defaultOpen: true }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Card accordion (Atom)"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Avatar"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Filename"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Status"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="Button corner "]', side: 'right' },
                    { n: 6, selector: '[role="region"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Card accordion (Atom)"]', side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Card accordion (Atom)"]', side: 'top' },
                    { kind: 'gap', from: 'h3', to: '[role="region"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Tarjeta:</strong> columna con padding de 24 (<code>space/container/on-card</code>) que ocupa el ancho de su contenedor. Su fondo sigue <code>contrast</code>. La silueta tiene radio de 24 (<code>radius/general/2xl</code>) y una muesca de 40 × 40 px en la esquina superior derecha.
                </>,
                <>
                  <strong>Avatar:</strong> Avatar de ícono sm de 40 con el ícono de 24. Se activa con <code>icon</code> y su ícono sale de <code>iconName</code> (<code>folder</code> por defecto).
                </>,
                <>
                  <strong>Título:</strong> texto semibold de 16/20 (<code>typography/heading/size/md</code>) dentro del botón del encabezado. Es el nombre accesible del ítem.
                </>,
                <>
                  <strong>Descripción:</strong> texto semibold de 14/20 con el color de éxito (<code>text/semantic/success-secondary</code>). Es opcional: sin ella el encabezado mide 38 como mínimo.
                </>,
                <>
                  <strong>Button corner:</strong> Button corner sm de 32 en la muesca. Es solo el indicador del botón del título: queda fuera del orden de tabulación y su flecha gira 180 grados al abrir.
                </>,
                <>
                  <strong>Panel:</strong> región con el contenido (<code>children</code>) en columna, con 16 entre elementos (<code>space/general/2xl</code>) y alineado al final. Queda a 24 del encabezado (<code>space/general/3xl</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Type Table abierto',
                  width: 480,
                  preview: item('Detalle del informe', { type: 'table', cells: CELLS, contrast: 'on-canva', defaultOpen: true }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Table"]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Cell table"]', index: 2, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Frame"]', side: 'left' },
                    { n: 4, selector: '[data-figma-part="Frame"] [data-figma-part="Filename"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="Frame"] > div:last-child', side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Card accordion (Atom)"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Card accordion (Atom)"]', side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Frame"]', side: 'left' },
                    { kind: 'gap', from: 'h3', to: '[data-figma-part="Frame"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila de celdas:</strong> en <code>type=&quot;table&quot;</code> el encabezado muestra <code>cells</code> en una fila de celdas del mismo ancho, sin padding derecho. El texto de todas las celdas es el nombre accesible.
                </>,
                <>
                  <strong>Celda:</strong> padding horizontal de 12 (<code>space/general/xl</code>), alto mínimo de 42 y texto de 14/20. Si una palabra no cabe, se parte en vez de invadir la celda vecina.
                </>,
                <>
                  <strong>Marco interior:</strong> aparece al abrir, con trazo de 1 px (<code>border/general/default-on-card</code>), radio de 24, padding de 24 (<code>space/general/3xl</code>) y 24 entre sus partes.
                </>,
                <>
                  <strong>Título y descripción:</strong> pasan al marco interior, con el avatar de 32 y su ícono de 16.
                </>,
                <>
                  <strong>Contenido:</strong> el mismo slot <code>children</code>, alineado al final y dentro del marco.
                </>,
                <>
                  <strong>Tarjeta:</strong> padding de 16 (<code>space/general/2xl</code>) en vez de 24, y 16 entre el encabezado y el marco interior.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Accordion con tres ítems',
                  width: 480,
                  preview: group(['Plan de proyecto', 'Calendario de revisión', 'Registro de cambios'], 'a', { contrast: 'on-canva' }),
                  marks: [
                    { n: 1, selector: '[data-accordion-root]', side: 'left' },
                    { n: 2, selector: '[data-accordion-root] > div', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Card accordion (Atom)"]', index: 0, side: 'right' },
                    { n: 4, selector: '[data-figma-part="Card accordion (Atom)"]', index: 1, side: 'right' },
                  ],
                  dimensions: [
                    {
                      kind: 'gap',
                      from: '[data-figma-part="Card accordion (Atom)"]',
                      fromIndex: 1,
                      to: '[data-figma-part="Card accordion (Atom)"]',
                      toIndex: 2,
                      axis: 'y',
                    },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Accordion:</strong> raíz de la lista, al ancho de su contenedor. Decide qué ítems están abiertos y reparte <code>contrast</code> y <code>headingLevel</code> a todos.
                </>,
                <>
                  <strong>Contenedor:</strong> columna con 8 entre tarjetas (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Ítem abierto:</strong> un <code>AccordionItem</code> con su panel desplegado. En <code>type=&quot;single&quot;</code> solo hay uno.
                </>,
                <>
                  <strong>Ítem cerrado:</strong> solo el encabezado. Su panel no está en el orden de tabulación ni en el árbol de accesibilidad.
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
          Accordion tiene 3 estados. No tiene prop <code>state</code>, así que Hover, Focus y Press no se fuerzan para documentar. Default y Dropdown son los valores de State en Figma. El foco del teclado dibuja un contorno de 2 px que Figma no tiene.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default de cada Type y Contrast. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Normal · On card',
              preview: surface('on-card', item('Resumen de ajustes', { description: 'Al día', defaultOpen: true })),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-card' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
                { part: 'Descripción', color: 'text-semantic-success-secondary', text: 'typography-body-size-md' },
                { part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Normal · On canva',
              preview: surface('on-canva', item('Notas de versión', { description: 'Al día', contrast: 'on-canva', defaultOpen: true })),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
                { part: 'Descripción', color: 'text-semantic-success-secondary', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Table · On canva',
              preview: surface('on-canva', item('Detalle del informe', { type: 'table', cells: CELLS, contrast: 'on-canva', defaultOpen: true })),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Texto de las celdas', color: 'text-neutral-white', text: 'typography-body-size-md' },
                { part: 'Trazo del marco interior (aparece al abrir)', color: 'border-general-default-on-card' },
                { part: 'Título dentro del marco', color: 'text-neutral-heading', text: 'typography-heading-size-md' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Accordion en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra los componentes como Accordion y Card accordion (Atom) en la librería de Assets. Accordion es la lista, con el slot Container para las tarjetas. Card accordion (Atom) es cada ítem. En código son <code>Accordion</code> y <code>AccordionItem</code>.
            </>,
            <>
              <strong>Type, State y Contrast:</strong> Type es <code>type=&quot;normal&quot;</code> o <code>type=&quot;table&quot;</code> del ítem. State es cerrado (Default) o abierto (Dropdown): en un grupo lo decide <code>value</code> y en un ítem suelto, <code>open</code>. Contrast es <code>contrast=&quot;on-canva&quot;</code> o <code>contrast=&quot;on-card&quot;</code>.
            </>,
            <>
              <strong>Textos y opciones:</strong> Tittle y Description-2 son <code>title</code> y <code>description</code>. Description e Icon son interruptores: en código, omitir <code>description</code> o poner <code>icon={'{false}'}</code>. El slot Container es <code>children</code>.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> Table existe solo en On canva; el código también lo admite en On card. Figma tampoco dibuja el foco, el estado bloqueado, la selección única o múltiple (<code>type</code> del grupo), <code>collapsible</code> ni <code>headingLevel</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Accordion es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Contenido secundario que se lee por partes:</strong> cada ítem es un encabezado con su botón y un panel. La persona abre solo lo que busca.
            </>,
            <>
              <strong>Una sección a la vez:</strong> <code>type=&quot;single&quot;</code> (por defecto) cierra el ítem abierto al abrir otro. Con <code>collapsible={'{false}'}</code> siempre queda uno abierto.
            </>,
            <>
              <strong>Varias secciones abiertas:</strong> <code>type=&quot;multiple&quot;</code> deja abrir cada ítem por separado y <code>value</code> es la lista de los abiertos.
            </>,
            <>
              <strong>Estado en tu código:</strong> <code>value</code> y <code>onValueChange</code> en un grupo; <code>open</code> y <code>onOpenChange</code> en un ítem suelto. Sin estado propio, usa <code>defaultValue</code> o <code>defaultOpen</code>.
            </>,
            <>
              <strong>Teclado:</strong> Enter y Espacio abren o cierran. Las flechas, Inicio y Fin mueven el foco entre encabezados.
            </>,
            <>
              <strong>Uso en otros componentes:</strong> el Footer lo usa en móvil para plegar sus grupos de enlaces, con selección única. El Footer es un componente aparte.
            </>,
          ],
          avoid: [
            <>
              <strong>Avisos que hay que ver siempre:</strong> un ítem cerrado los esconde. (Alternativa: <code>Alert</code>).
            </>,
            <>
              <strong>Pasos de un proceso:</strong> el orden y el avance se pierden entre ítems plegables. (Alternativa: <code>Stepper</code>).
            </>,
            <>
              <strong>Vistas del mismo nivel:</strong> si solo se muestra una y se alterna, el patrón es otro. (Alternativa: <code>Tabs</code>).
            </>,
            <>
              <strong>Acciones de un menú:</strong> el ítem abre contenido, no ejecuta acciones. (Alternativa: <code>DropdownMenu</code>).
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
                title: 'Card accordion (Atom)',
                bullets: [
                  <>
                    <strong>Tarjeta:</strong> padding de 24 (<code>space/container/on-card</code>) y 24 entre el encabezado y el panel al abrir (<code>space/general/3xl</code>).
                  </>,
                  <>
                    <strong>Encabezado:</strong> padding derecho de 24 cerrado y de 40 abierto, para dejar sitio al Button corner (<code>space/general/3xl</code> y <code>space/general/5xl</code>).
                  </>,
                ],
                preview: item('Informe de avance', { description: 'Al día', defaultOpen: true }),
              },
              {
                title: 'Accordion',
                bullets: [
                  <>
                    <strong>Lista:</strong> ocupa el ancho de su contenedor y deja 8 entre tarjetas (<code>space/general/lg</code>).
                  </>,
                  <>
                    <strong>Type Table:</strong> padding de 16 (<code>space/general/2xl</code>) y 16 entre el encabezado y el marco interior, en cualquier breakpoint.
                  </>,
                ],
                preview: group(['Lista de tareas', 'Notas de la reunión', 'Archivo de apoyo'], 'a'),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Tarjeta:</strong> el padding baja a 16 y el espacio entre encabezado y panel, a 20.
              </>,
              <>
                <strong>Encabezado:</strong> el padding derecho baja a 20 cerrado y a 32 abierto.
              </>,
              <>
                <strong>Sin cambios:</strong> el texto (16/20 y 14/20), el radio de 24, la muesca y las 8 entre tarjetas miden igual.
              </>,
            ],
            preview: group(['Resumen del día', 'Plan semanal', 'Archivo de notas'], 'a'),
          },
          tablet: {
            bullets: [
              <>
                <strong>Como Desktop:</strong> padding de 24 y 24 entre encabezado y panel.
              </>,
              <>
                <strong>Encabezado:</strong> padding derecho de 24 cerrado y de 40 abierto.
              </>,
              <>
                <strong>Ancho:</strong> la tarjeta ocupa el ancho de su contenedor; el título y la descripción ajustan línea.
              </>,
            ],
            preview: group(['Informe mensual', 'Presupuesto de equipo', 'Documentos de apoyo'], 'a'),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de títulos, descripciones y niveles.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título del tema',
              description: 'Titula cada ítem con el tema que contiene: Presupuesto anual.',
              preview: group(['Presupuesto anual', 'Plan de proyecto', 'Acta de reunión'], ''),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título genérico',
              description: 'No uses títulos como Más información: no dicen qué hay dentro.',
              preview: group(['Más información', 'Detalles', 'Otros'], ''),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Descripción de estado',
              description: 'Deja en la descripción una palabra o frase breve de estado: Aprobado.',
              preview: (
                <Accordion>
                  <AccordionItem title="Presupuesto anual" description="Aprobado">
                    {body()}
                  </AccordionItem>
                </Accordion>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Descripción larga',
              description: 'No escribas párrafos en la descripción: alargan el encabezado.',
              preview: (
                <Accordion>
                  <AccordionItem title="Presupuesto anual" description="Aprobado el 12 de octubre por el equipo tras revisar todas las observaciones pendientes">
                    {body()}
                  </AccordionItem>
                </Accordion>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Un solo nivel',
              description: 'Deja el contenido a la vista dentro del panel, sin otro nivel de plegado.',
              preview: item('Guía de estilo', { defaultOpen: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Acordeón anidado',
              description: 'No pongas un acordeón dentro de otro: cuesta saber qué está abierto.',
              preview: item(
                'Guía de colores',
                { defaultOpen: true },
                <Accordion contrast="on-canva" className="self-stretch">
                  <AccordionItem title="Paleta de apoyo" icon={false}>
                    {body()}
                  </AccordionItem>
                </Accordion>
              ),
            },
          ],
        },
      ],
    },
  ],
};
