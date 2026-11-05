import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Button } from '../Button';
import { Backdrop } from './Backdrop';
import type { BackdropProps } from './Backdrop.types';

/*
 * Contenido de la página de documentación de Backdrop (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Backdrop.tsx`, `Backdrop.types.ts`, `Backdrop.variants.ts`), luego `Backdrop.docs.json`. La capa es un `div`
 * decorativo (`aria-hidden`) que cubre su padre (`inset-0`) con el relleno `background/effect/backdrop` (Dark: primary
 * g12 al 60%; Light: g11 al 40%) y un desenfoque de fondo de 12 px (`backdrop-blur-md`). No tiene medidas propias:
 * toma las de su padre (`absolute`) o las de la ventana (`fixed`).
 *
 * Diferencias con Figma: el set trae una sola variante (Property 1=Predeterminada) a tamaño de lienzo (1440 × 1080,
 * 768 × 1024 y 376 × 812 px según el modo) y un efecto NOISE (negro al 25%) que el código no dibuja. El `Modal` y el
 * `AlertModal` no usan este componente: su `<dialog>` pinta el mismo relleno y desenfoque con `::backdrop`.
 *
 * Las muestras dibujan la capa contenida en un recuadro (`position="absolute"` en un padre relativo). La muestra de
 * `position="fixed"` va dentro de un recuadro con `transform`, que se convierte en el bloque contenedor de la capa
 * fija: así no cubre la página de documentación.
 */

// Figma: 11443:12074 (component set Backdrop)

/** Pantalla de ejemplo: texto y un botón sobre la superficie del tema. `data-sample` solo sirve de selector. */
const content = () => (
  <div data-sample="content" className="flex w-fit flex-col items-start gap-ds-space-general-md">
    <span className="font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md text-ds-text-neutral-body">
      Ajustes de perfil
    </span>
    <Button variant="secondary" size="sm">
      Guardar cambios
    </Button>
  </div>
);

/** Recuadro que contiene la capa: padre relativo y recortado, con la superficie del tema. */
const frame = (children: ReactNode, className = 'h-40') => (
  <div
    data-sample="frame"
    className={`relative isolate w-72 transform-gpu overflow-hidden rounded-ds-radius-container-on-canva bg-ds-background-general-black p-ds-space-general-lg ${className}`}
  >
    {children}
  </div>
);

/** Pantalla con su capa encima. */
const scene = (props: BackdropProps = {}, className?: string) =>
  frame(
    <>
      {content()}
      <Backdrop position="absolute" className="rounded-[inherit]" {...props} />
    </>,
    className
  );

/** Panel de ejemplo sobre la capa, con o sin botón de cierre. */
const panel = (closable: boolean) => (
  <div className="relative flex w-fit flex-col items-start gap-ds-space-general-md rounded-ds-radius-general-md bg-ds-background-container-default-on-card p-ds-space-general-lg">
    <span className="font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md text-ds-text-neutral-body">
      Cambios sin guardar
    </span>
    {closable ? (
      <Button variant="secondary" size="sm">
        Cerrar
      </Button>
    ) : null}
  </div>
);

/** Capa con un panel encima. Con `closable`, el panel lleva su botón de cierre. */
const overlay = (closable: boolean) =>
  frame(
    <>
      <Backdrop position="absolute" className="rounded-[inherit]" />
      <div className="absolute inset-0 flex items-center justify-center">{panel(closable)}</div>
    </>,
    'h-44'
  );

/** Marco con una tarjeta dentro; la capa cubre solo la tarjeta si esta es el padre posicionado. */
const nested = (positioned: boolean, position: BackdropProps['position'] = 'absolute') => (
  <div
    data-sample="page"
    className="relative isolate flex h-44 w-72 transform-gpu flex-col gap-ds-space-general-md overflow-hidden rounded-ds-radius-container-on-canva bg-ds-background-general-black p-ds-space-general-lg"
  >
    <span className="font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md text-ds-text-neutral-body">
      Página de ajustes
    </span>
    <div
      data-sample="card"
      className={`${positioned ? 'relative' : ''} flex-1 overflow-hidden rounded-ds-radius-general-md bg-ds-background-container-default-on-card p-ds-space-general-md`}
    >
      <span className="font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md text-ds-text-neutral-body">
        Vista previa
      </span>
      <Backdrop position={position} className={position === 'fixed' ? 'rounded-ds-radius-container-on-canva' : 'rounded-[inherit]'} />
    </div>
  </div>
);

/** Capa y panel de ejemplo. Con `above`, el panel va después de la capa y con `z-10`; si no, antes y sin `z-index`. */
const layered = (above: boolean) => {
  const wrapper = (
    <div key="panel" className="absolute inset-0 flex items-center justify-center">
      <div className={`${above ? 'z-10' : ''} relative`}>{panel(true)}</div>
    </div>
  );
  const veil = <Backdrop key="veil" position="absolute" className="rounded-[inherit]" />;
  return frame(above ? [veil, wrapper] : [wrapper, veil], 'h-44');
};

const states: DocStateItem[] = [
  {
    label: 'Abierto',
    tone: 'neutral',
    description: (
      <>
        Cubre su padre con el relleno y el desenfoque. Se muestra por defecto.
      </>
    ),
    samples: [nested(true)],
  },
  {
    label: 'Cerrado',
    tone: 'neutral',
    description: (
      <>
        Con <code>{'open={false}'}</code> no renderiza nada: no hay capa en el DOM y el contenido se ve nítido.
      </>
    ),
    samples: [scene({ open: false })],
  },
  {
    label: 'Pantalla completa',
    tone: 'neutral',
    description: (
      <>
        Con <code>position=&quot;fixed&quot;</code> (por defecto) cubre la ventana, no su padre. Aquí el recuadro grande hace de ventana.
      </>
    ),
    samples: [nested(false, 'fixed')],
  },
];

export const doc: ComponentDocContent = {
  name: 'Backdrop',
  icon: 'eye-slash',
  classification: 'atomo',
  summary:
    'El Backdrop es el átomo que oscurece y desenfoca el contenido de atrás para dar protagonismo a un panel que se abre encima. Cubre su padre o la ventana entera. Es decorativo: no recibe foco, no atrapa el teclado y no lleva contenido.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una sola capa sin hijos. Su relleno y su desenfoque actúan sobre lo que tiene detrás.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Capa sobre el contenido',
                  preview: scene(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Backdrop"]', side: 'bottom' },
                    { n: 2, selector: '[data-sample="content"]', side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Capa:</strong> <code>div</code> que cubre todo su padre (<code>inset-0</code>), sin padding ni hijos. Relleno <code>background/effect/backdrop</code> y desenfoque de fondo de 12 px (<code>backdrop-blur-md</code>). Lleva <code>aria-hidden=&quot;true&quot;</code>.
                </>,
                <>
                  <strong>Contenido detrás:</strong> lo que queda cubierto. Se oscurece y se desenfoca, pero sigue en el DOM y en el orden de tabulación: la capa no lo oculta ni lo bloquea.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Contenida en un padre',
                  preview: nested(true),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Backdrop"]', side: 'bottom' },
                    { n: 2, selector: '[data-sample="page"] > span', side: 'top' },
                    { n: 3, selector: '[data-sample="card"]', side: 'right' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Capa contenida:</strong> con <code>position=&quot;absolute&quot;</code> mide lo mismo que el padre posicionado más cercano. Con <code>position=&quot;fixed&quot;</code> mide lo que la ventana.
                </>,
                <>
                  <strong>Contenido fuera del padre:</strong> la capa no lo toca: se ve nítido y sigue a su tamaño.
                </>,
                <>
                  <strong>Padre posicionado:</strong> el elemento con <code>position: relative</code> que la contiene. Sin él, la capa se apoya en otro ancestro.
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
          Figma tiene una sola variante; los estados salen de <code>open</code> y <code>position</code>. No es interactivo: no tiene hover, focus ni press y no recibe foco.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description:
        'Token de color de la capa. Cambia el modo para ver su valor: es un color con transparencia, 60% en oscuro y 40% en claro. El desenfoque de 12 px no tiene token.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Capa',
              preview: scene(),
              entries: [{ part: 'Relleno', color: 'background-effect-backdrop' }],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Backdrop en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Backdrop en la librería de Assets. Tiene una sola propiedad, Property 1, con un solo valor: Predeterminada.
            </>,
            <>
              <strong>Property 1:</strong> no tiene equivalente en el código: el aspecto es fijo. En código, la capa se activa con <code>open</code> y se ubica con <code>position</code>.
            </>,
            <>
              <strong>Tamaño:</strong> la variante mide como el lienzo: 1440 × 1080 px en Desktop, 768 × 1024 px en Tablet y 376 × 812 px en Mobile. En código mide lo que su padre (<code>absolute</code>) o la ventana (<code>fixed</code>).
            </>,
            <>
              <strong>Diferencias:</strong> Figma suma un efecto de ruido (NOISE, negro al 25%) que el código no dibuja: el sistema no tiene recurso de ruido. Figma tampoco tiene <code>onClick</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Backdrop es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Fondo de un panel propio:</strong> la capa va detrás de un drawer o un panel que armas tú. Con <code>onClick</code> cierras al tocar fuera.
            </>,
            <>
              <strong>Capa en un recuadro:</strong> con <code>position=&quot;absolute&quot;</code> dentro de un padre con <code>position: relative</code> oscureces solo esa región.
            </>,
            <>
              <strong>Mostrar y ocultar:</strong> controla <code>open</code> desde tu estado. Con <code>false</code> la capa desaparece del DOM.
            </>,
            <>
              <strong>Ambos temas:</strong> el relleno cambia solo con el modo (60% en oscuro, 40% en claro). No necesitas colores propios.
            </>,
          ],
          avoid: [
            <>
              <strong>Diálogo con foco atrapado:</strong> la capa no atrapa el foco ni oculta el resto de la página a los lectores de pantalla. (Alternativa: <code>Modal</code> o <code>AlertModal</code>, que ya pintan su propio fondo).
            </>,
            <>
              <strong>Cerrar solo con la capa:</strong> no tiene rol ni foco, así que el teclado no la alcanza. (Alternativa: ofrecer también Escape y un botón de cierre en el panel).
            </>,
            <>
              <strong>Contenido dentro de la capa:</strong> no recibe <code>children</code>. (Alternativa: poner el panel como hermano, encima de ella).
            </>,
            <>
              <strong>Varias capas apiladas:</strong> el relleno se acumula y tapa el contenido. (Alternativa: una sola capa por overlay).
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
                title: 'Contenida en un padre',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> cubre lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medida del padre:</strong> con <code>position=&quot;absolute&quot;</code> ocupa el 100% del padre posicionado, del tamaño que tenga.
                  </>,
                ],
                preview: scene(),
              },
              {
                title: 'Pantalla completa',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> el relleno y el desenfoque de 12 px valen igual en cada tamaño.
                  </>,
                  <>
                    <strong>Medida de la ventana:</strong> con <code>position=&quot;fixed&quot;</code> cubre la ventana, sin importar el contenido. Figma lo dibuja de 1440 × 1080 px.
                  </>,
                ],
                preview: nested(false, 'fixed'),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> cubre lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida de la ventana:</strong> Figma la dibuja de 376 × 812 px; en código cubre todo el ancho y el alto disponibles.
              </>,
              <>
                <strong>Toque:</strong> <code>onClick</code> responde igual al toque que al clic. La capa no tiene gestos propios.
              </>,
            ],
            preview: scene(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> cubre lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida de la ventana:</strong> Figma la dibuja de 768 × 1024 px; en código cubre todo el ancho y el alto disponibles.
              </>,
              <>
                <strong>Relleno:</strong> el color depende del modo claro u oscuro, no del breakpoint.
              </>,
            ],
            preview: scene(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de ubicación, cierre y orden de las capas.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Padre posicionado',
              description: (
                <>
                  Pon <code>position: relative</code> al padre cuando uses <code>absolute</code>.
                </>
              ),
              preview: nested(true),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Padre sin position',
              description: 'No omitas el padre posicionado: la capa cubre otro ancestro.',
              preview: nested(false),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Cierre alterno',
              description: 'Añade un botón de cierre y la tecla Escape: la capa no recibe teclado.',
              preview: overlay(true),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Solo clic fuera',
              description: 'No dependas solo de la capa para cerrar: sin puntero no hay salida.',
              preview: overlay(false),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Panel encima',
              description: 'Pon el panel después de la capa o con un z-index mayor.',
              preview: layered(true),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Panel debajo',
              description: 'No lo pongas antes ni sin z-index: la capa lo desenfoca.',
              preview: layered(false),
            },
          ],
        },
      ],
    },
  ],
};
