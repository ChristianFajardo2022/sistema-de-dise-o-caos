import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { IconMenu } from './IconMenu';

/*
 * Contenido de la página de documentación de IconMenu (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`IconMenu.types.ts`, `IconMenu.variants.ts`, `IconMenu.tsx`), luego `IconMenu.docs.json`. Diferencias con Figma: el
 * set solo dibuja el ícono (tres fotogramas); el código añade la transición de 200 ms entre ellos, el nombre accesible
 * opcional (`aria-label`) y el `className`. El trazo es `border/general/lg` en Figma y en la cabecera de
 * `IconMenu.variants.ts`; el token del código es `--ds-responsive-border-general-lg` (alias de `stroke/xl`).
 */

// Figma: 13616:14074 (component set Icon menu (Atom))

/** Ícono de ejemplo; decorativo, como va dentro de un botón con nombre. */
const icon = (props: Partial<ComponentProps<typeof IconMenu>> = {}) => <IconMenu {...props} />;

/** Botón de menú de ejemplo: el nombre y `aria-expanded` los lleva el botón, no el ícono. */
const toggle = (open: boolean, props: Partial<ComponentProps<typeof IconMenu>> = {}) => (
  <button
    type="button"
    aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
    aria-expanded={open}
    className="inline-flex size-8 items-center justify-center border-0 bg-transparent p-0"
  >
    <IconMenu variant={open ? 'close' : 'menu'} {...props} />
  </button>
);

/** Botón de 44 × 44 px con el ícono dentro (área táctil recomendada). */
const touchButton = () => (
  <button
    type="button"
    aria-label="Abrir menú"
    aria-expanded={false}
    className="inline-flex size-11 items-center justify-center rounded-full border border-ds-border-general-white bg-transparent p-0"
  >
    <IconMenu />
  </button>
);

const states: DocStateItem[] = [
  {
    label: 'Menu',
    tone: 'neutral',
    description: (
      <>
        Reposo con el menú cerrado. Tres rayas horizontales (<code>variant=&quot;menu&quot;</code>).
      </>
    ),
    samples: [icon({ variant: 'menu' })],
  },
  {
    label: 'Half',
    tone: 'neutral',
    description: (
      <>
        Fotograma intermedio. Las rayas de arriba y de abajo se inclinan 15° y la del medio no se mueve (<code>variant=&quot;half&quot;</code>).
      </>
    ),
    samples: [icon({ variant: 'half' })],
  },
  {
    label: 'Close',
    tone: 'neutral',
    description: (
      <>
        Menú abierto. Dos rayas cruzadas a 45° forman una X y la del medio desaparece (<code>variant=&quot;close&quot;</code>).
      </>
    ),
    samples: [icon({ variant: 'close' })],
  },
];

const row = (variants: ('menu' | 'half' | 'close')[]) => (
  <div className="flex items-center gap-ds-space-general-6xl">
    {variants.map((variant) => (
      <IconMenu key={variant} variant={variant} />
    ))}
  </div>
);

export const doc: ComponentDocContent = {
  name: 'Icon menu',
  icon: 'menu',
  classification: 'atomo',
  summary:
    'El Icon menu es el átomo que dibuja el ícono del botón de menú: tres rayas que pasan a una X cuando el menú se abre. No es un botón ni se puede presionar: va dentro de uno, que le da el nombre y el estado abierto o cerrado.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un marco cuadrado de 32 px contiene tres rayas horizontales. Las rayas giran sobre su propio centro al cambiar de variante.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Tres rayas',
                  preview: icon({ variant: 'menu' }),
                  marks: [
                    { n: 1, selector: 'svg', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Vector 24"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Vector 25"]', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Vector 26"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'svg' },
                    { kind: 'gap', from: '[data-figma-part="Vector 24"]', to: '[data-figma-part="Vector 25"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Marco:</strong> <code>svg</code> de 32 × 32 px, sin padding. Es decorativo (<code>aria-hidden</code>) salvo que reciba <code>aria-label</code>.
                </>,
                <>
                  <strong>Raya superior:</strong> 24 px de largo, a 8 px del borde de arriba y con 4 px de margen a cada lado. Su trazo mide 1,5 px (<code>border/general/lg</code>).
                </>,
                <>
                  <strong>Raya central:</strong> la misma medida, al centro del marco (a 16 px). En close desaparece.
                </>,
                <>
                  <strong>Raya inferior:</strong> la misma medida, a 24 px del borde de arriba, con 8 px de separación entre rayas.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Variantes',
                  preview: row(['menu', 'half', 'close']),
                  marks: [
                    { n: 1, selector: 'svg', index: 0, side: 'top' },
                    { n: 2, selector: 'svg', index: 1, side: 'top' },
                    { n: 3, selector: 'svg', index: 2, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>menu:</strong> tres rayas horizontales.
                </>,
                <>
                  <strong>half:</strong> las rayas de arriba y de abajo giran 15° y la del medio queda quieta.
                </>,
                <>
                  <strong>close:</strong> las rayas de arriba y de abajo giran a ±45° y forman una X; la del medio se oculta.
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
          Icon menu no es interactivo: sus 3 estados son variantes de aspecto, una por cada valor de <code>variant</code>. Al cambiar de una a otra, las rayas se mueven en 200 ms.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de las tres variantes: usan el mismo trazo. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Rayas',
              preview: row(['menu', 'close']),
              entries: [{ part: 'Trazo', color: 'border-general-white' }],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Icon menu en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Icon menu (Atom) en la librería de Assets y arrástralo al lienzo. Su única propiedad es Property 1.
            </>,
            <>
              <strong>Property 1:</strong> 1 es <code>variant=&quot;menu&quot;</code> (por defecto), 2 es <code>half</code> y 3 es <code>close</code>.
            </>,
            <>
              <strong>Lo que no dibuja Figma:</strong> la transición entre variantes, que el código mueve en 200 ms y detiene con <code>prefers-reduced-motion</code>, y el nombre accesible (<code>aria-label</code>).
            </>,
            <>
              <strong>Otros íconos:</strong> la biblioteca Icon también tiene <code>menu</code> y <code>close</code>, pero son dibujos fijos y no se animan. Para el botón de menú usa este átomo.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Icon menu es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Botón que abre y cierra el menú de navegación:</strong> es el que usan el Header y el SideBar en móvil. El botón alterna <code>menu</code> y <code>close</code> según el estado.
            </>,
            <>
              <strong>Nombre y estado en el botón:</strong> el botón lleva <code>aria-label</code> (&quot;Abrir menú&quot; o &quot;Cerrar menú&quot;) y <code>aria-expanded</code>. El ícono se queda decorativo.
            </>,
            <>
              <strong>Ícono fuera de un botón:</strong> si va solo, como imagen, pasa <code>aria-label</code>: el lector de pantalla lo anuncia como imagen con nombre.
            </>,
            <>
              <strong>Movimiento al cambiar:</strong> las rayas giran y se desplazan en 200 ms. Con <code>prefers-reduced-motion</code> el cambio es inmediato.
            </>,
          ],
          avoid: [
            <>
              <strong>Un botón sin nombre:</strong> el ícono es decorativo y el botón queda sin texto para el lector de pantalla. (Alternativa: <code>aria-label</code> en el botón).
            </>,
            <>
              <strong>Acciones que no abren un menú:</strong> las tres rayas significan menú. (Alternativa: <code>Icon</code> con el ícono de la acción).
            </>,
            <>
              <strong>Un menú con texto visible:</strong> el Icon menu no trae etiqueta. (Alternativa: <code>ButtonMenu</code>).
            </>,
            <>
              <strong>Dejar fija la variante half:</strong> es un fotograma de paso, no un estado de reposo. (Alternativa: <code>menu</code> o <code>close</code>).
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
                title: 'Sin cambios',
                bullets: [
                  <>
                    <strong>Mismas medidas:</strong> el ícono mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas fijas:</strong> marco de 32 × 32 px y trazo de 1,5 px (<code>border/general/lg</code>), sin escala por tamaño.
                  </>,
                ],
                preview: row(['menu', 'half', 'close']),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Mismas medidas:</strong> el ícono mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> marco de 32 × 32 px y trazo de 1,5 px, que no escalan por breakpoint.
              </>,
              <>
                <strong>Dónde aparece:</strong> es el botón de menú de la cabecera móvil. El área táctil la define el botón que lo contiene.
              </>,
            ],
            preview: row(['menu', 'half', 'close']),
          },
          tablet: {
            bullets: [
              <>
                <strong>Mismas medidas:</strong> el ícono mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> marco de 32 × 32 px y trazo de 1,5 px, los mismos valores que Desktop.
              </>,
              <>
                <strong>Ajuste al ancho:</strong> no se estira. El botón que lo contiene decide su espacio.
              </>,
            ],
            preview: row(['menu', 'half', 'close']),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de botón contenedor, estado del botón y variantes de reposo.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Dentro de un botón',
              description: <>Pon el ícono en un botón de 44 × 44 px como mínimo.</>,
              preview: touchButton(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ícono suelto',
              description: 'No lo uses suelto como control: mide 32 px y no responde al teclado.',
              preview: icon(),
            },
            {
              kind: 'do',
              framed: true,
              title: 'X con el menú abierto',
              description: <>Muestra <code>close</code> cuando el menú está abierto.</>,
              preview: toggle(true),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Rayas con el menú abierto',
              description: <>No dejes <code>menu</code> si el botón ya abrió el menú.</>,
              preview: (
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  aria-expanded
                  className="inline-flex size-8 items-center justify-center border-0 bg-transparent p-0"
                >
                  <IconMenu variant="menu" />
                </button>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Variante de reposo',
              description: <>Deja <code>menu</code> o <code>close</code> en reposo.</>,
              preview: icon({ variant: 'menu' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Variante intermedia fija',
              description: <>No fijes <code>half</code>: es un fotograma de paso.</>,
              preview: icon({ variant: 'half' }),
            },
          ],
        },
      ],
    },
  ],
};
