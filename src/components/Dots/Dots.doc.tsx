import { Fragment, type ComponentProps, type ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Button } from '../Button';
import { Dots } from './Dots';

/*
 * Contenido de la página de documentación de Dots (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Dots.types.ts`, `Dots.variants.ts`, `Dots.tsx`), luego `Dots.docs.json`. Diferencias con Figma: Figma no dibuja
 * el foco con teclado y el código agrega un contorno de 2 px; en Press Figma muestra el menú abierto debajo y el
 * código lo deja al componente DropdownMenu.
 */

// Figma: 11194:12200 (component set Dots-moreoptions)

type DotsProps = Partial<ComponentProps<typeof Dots>>;

/** Dots de ejemplo, con el tamaño y el estado que pida cada muestra. */
const dots = (props: DotsProps = {}) => <Dots label="Más opciones" {...props} />;

/** Los tres tamaños en fila, con el estado indicado. */
const sizes = (state?: DotsProps['state']) => (
  <div className="flex items-center gap-4">
    {dots({ size: 'md', state })}
    {dots({ size: 'sm', state })}
    {dots({ size: 'xs', state })}
  </div>
);

/** Fila de lista de ejemplo: texto y el Dots al final. */
const row = (name: string, props: DotsProps = {}) => (
  <div className="flex w-full items-center justify-between gap-4 text-ds-text-neutral-body">
    <span>{name}</span>
    {dots(props)}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Círculo sin relleno con el ícono de tres puntos.',
    samples: [sizes('default')],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero. Aparece el relleno circular y el ícono cambia a su color de hover.',
    samples: [sizes('hover')],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al recibir el foco del teclado. Sin relleno; el ícono toma su color de foco y se dibuja un contorno de 2 px.',
    samples: [sizes('focus')],
  },
  {
    label: 'Press',
    tone: 'accent',
    description: (
      <>
        Mientras se presiona, y también mientras el menú que abre está abierto (<code>aria-expanded=&quot;true&quot;</code>). Usa el mismo relleno que Hover.
      </>
    ),
    samples: [sizes('press')],
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        No interactivo (<code>disabled</code> o <code>state=&quot;inactive&quot;</code>). Sin relleno y con el ícono atenuado.
      </>
    ),
    samples: [sizes('inactive')],
  },
];

const stackSamples = (...items: ReactNode[]): ReactNode => (
  <div className="flex w-full flex-col gap-4">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

export const doc: ComponentDocContent = {
  name: 'Dots',
  icon: '3-dots-more',
  classification: 'atomo',
  summary:
    'El Dots es el átomo del botón de tres puntos que abre las acciones secundarias de una fila, una tarjeta o un panel. Es circular, solo lleva ícono, tiene tres tamaños y cinco estados.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un botón circular con un solo ícono centrado; el tamaño cambia el diámetro y, en xs, el ícono.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Dots md',
                  preview: dots({ size: 'md', state: 'hover' }),
                  marks: [
                    { n: 1, selector: 'button', side: 'left' },
                    { n: 2, selector: 'svg', side: 'top' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'button' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> círculo de radio completo (<code>radius/button/full</code>) y sin padding. Mide 56 px en md, 48 en sm y 32 en xs. Sin relleno en reposo; la muestra usa <code>state=&quot;hover&quot;</code> para que el círculo se vea.
                </>,
                <>
                  <strong>Ícono:</strong> tres puntos rellenos (<code>3-dots-more</code>) centrados. Mide 24 px en md y sm, y 16 px en xs. Es decorativo: el nombre accesible viene de <code>label</code> (por defecto &quot;Más opciones&quot;).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños',
                  preview: (
                    <>
                      {dots({ size: 'md' })}
                      {dots({ size: 'sm' })}
                      {dots({ size: 'xs' })}
                    </>
                  ),
                  marks: [
                    { n: 1, selector: 'button', index: 0, side: 'top' },
                    { n: 2, selector: 'button', index: 1, side: 'top' },
                    { n: 3, selector: 'button', index: 2, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'button', index: 0 },
                    { kind: 'height', selector: 'button', index: 1 },
                    { kind: 'height', selector: 'button', index: 2 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>md:</strong> 56 px de diámetro, ícono de 24 px.
                </>,
                <>
                  <strong>sm:</strong> 48 px de diámetro, ícono de 24 px.
                </>,
                <>
                  <strong>xs:</strong> 32 px de diámetro, ícono de 16 px.
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
          Dots tiene 5 estados. Hover, Focus y Press se fuerzan con <code>state</code> solo para documentar; en uso salen de la interacción.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default; los de otros estados llevan el estado entre paréntesis. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'md y sm',
              preview: dots({ size: 'md' }),
              entries: [
                { part: 'Ícono', color: 'icon-button-tertiary-default' },
                { part: 'Ícono (Hover y Press)', color: 'icon-button-tertiary-hover' },
                { part: 'Ícono (Focus)', color: 'icon-button-tertiary-focus-press' },
                { part: 'Ícono (Inactive)', color: 'icon-button-tertiary-inactive' },
                { part: 'Relleno (aparece en Hover y Press)', color: 'background-button-tertiary-hover' },
                { part: 'Contorno (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'xs',
              preview: dots({ size: 'xs' }),
              entries: [{ part: 'Ícono', color: 'icon-general-default' }],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Dots en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Dots-moreoptions en la librería de Assets y arrástralo al lienzo. Sus propiedades son State y Size.
            </>,
            <>
              <strong>State y Size:</strong> Default, Hover, Focus, Press o Inactive; y xs, sm o md. En código son <code>state</code> y <code>size</code>; Inactive se logra con <code>disabled</code>.
            </>,
            <>
              <strong>Press:</strong> en Figma el estado dibuja el menú abierto debajo del botón. En código ese menú es el componente DropdownMenu, que pone <code>aria-expanded</code> y el botón lo pinta como Press.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja el foco con teclado y el código agrega un contorno de 2 px. En Default, el ícono xs usa <code>icon/general/default</code> y md y sm usan <code>icon/button/tertiary/default</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Dots es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Acciones secundarias de una fila o tarjeta:</strong> agrupa varias opciones (duplicar, mover, eliminar) en un solo punto de entrada.
            </>,
            <>
              <strong>Disparador de menú:</strong> pásalo en <code>trigger</code> de DropdownMenu. El menú pone <code>aria-expanded</code> y <code>aria-haspopup</code>, y devuelve el foco al cerrarse.
            </>,
            <>
              <strong>Lugares con poco espacio:</strong> un círculo de 32 a 56 px reemplaza varios botones con texto.
            </>,
            <>
              <strong>Nombre accesible propio:</strong> <code>label</code> describe qué abre (&quot;Acciones de la fila&quot;), porque el ícono no lleva texto.
            </>,
          ],
          avoid: [
            <>
              <strong>Acción principal:</strong> lo más importante de la vista no se esconde. (Alternativa: <code>Button</code>).
            </>,
            <>
              <strong>Una sola acción:</strong> un menú de un ítem sobra. Dots abre un menú; Button corner ejecuta una acción directa. (Alternativa: <code>ButtonCorner</code>).
            </>,
            <>
              <strong>Etiqueta genérica repetida:</strong> varias filas con &quot;Más opciones&quot; no se distinguen al leerlas. Cambia <code>label</code> en cada una.
            </>,
            <>
              <strong>Acción que necesita texto visible:</strong> Dots no muestra etiqueta. (Alternativa: <code>Button</code> con texto).
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
                title: 'Tamaños',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas fijas:</strong> md 56, sm 48 y xs 32 px, con ícono de 24, 24 y 16 px.
                  </>,
                ],
                preview: sizes(),
              },
              {
                title: 'Disparador de menú',
                bullets: [
                  <>
                    <strong>Estado abierto:</strong> con el menú abierto, <code>aria-expanded</code> dibuja el botón como Press.
                  </>,
                  <>
                    <strong>Alineación:</strong> el menú se alinea al borde derecho del botón.
                  </>,
                ],
                preview: dots({ size: 'sm', state: 'press' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> md 56, sm 48 y xs 32 px; los tokens de tamaño no tienen versión responsive.
              </>,
              <>
                <strong>Al final de la fila:</strong> no ocupa el ancho disponible; el texto de la fila se ajusta y el botón conserva su tamaño.
              </>,
            ],
            preview: row('Documento 1', { size: 'sm' }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas fijas:</strong> md 56, sm 48 y xs 32 px; los tokens de tamaño no tienen versión responsive.
              </>,
              <>
                <strong>Al final de la fila:</strong> no ocupa el ancho disponible; el texto de la fila se ajusta y el botón conserva su tamaño.
              </>,
            ],
            preview: row('Documento 1', { size: 'sm' }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre accesible, jerarquía de acciones y tamaño.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Nombre que dice qué abre',
              description: <>Da a cada <code>label</code> el nombre de la fila que controla.</>,
              preview: stackSamples(row('Documento 1', { label: 'Acciones de Documento 1' }), row('Documento 2', { label: 'Acciones de Documento 2' })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Mismo nombre en cada fila',
              description: 'No repitas el mismo nombre accesible: un lector de pantalla no distingue las filas.',
              preview: stackSamples(row('Documento 1'), row('Documento 2')),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Acción principal visible',
              description: 'Deja la acción principal a la vista y manda las secundarias a Dots.',
              preview: (
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm">
                    Guardar
                  </Button>
                  {dots({ size: 'sm', label: 'Más acciones' })}
                </div>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Acción principal oculta',
              description: 'No escondas la acción principal detrás de Dots.',
              preview: (
                <div className="flex items-center gap-2">
                  {dots({ size: 'sm', label: 'Guardar y más acciones' })}
                </div>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Tamaño táctil',
              description: 'Usa md o sm donde se toque; deja xs para filas densas con puntero.',
              preview: row('Documento 1', { size: 'md' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'xs en pantalla táctil',
              description: 'No uses xs en pantallas táctiles: sus 32 px quedan bajo los 44 px recomendados.',
              preview: row('Documento 1', { size: 'xs' }),
            },
          ],
        },
      ],
    },
  ],
};
