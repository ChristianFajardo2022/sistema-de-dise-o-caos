import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { ButtonCorner } from './ButtonCorner';
import type { ButtonCornerState, ButtonCornerVariant } from './ButtonCorner.types';

/*
 * Contenido de la página de documentación de Button corner (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el
 * código (`ButtonCorner.types.ts`, `ButtonCorner.variants.ts`, `ButtonCorner.tsx`), luego `ButtonCorner.docs.json`.
 * Medidas: md 40 y sm 32 (padding 12 y 8; Dots 4 y 0); el círculo no cambia entre breakpoints. Diferencias con
 * Figma: el set no trae Select en On card ni Hover, Select o Inactive en sm; el código sí los admite. Figma no
 * dibuja foco; el código agrega un contorno de 2 px.
 */

// Figma: set "Button corner" (Type × Contrast × State × Size × Stroke, 65 variantes)

type CornerProps = Partial<ComponentProps<typeof ButtonCorner>>;

const LABELS: Record<ButtonCornerVariant, string> = {
  icon: 'Abrir detalle',
  dots: 'Más opciones',
  radiobutton: 'Seleccionar opción',
  checkbox: 'Seleccionar elemento',
  favorite: 'Marcar como favorito',
};

/** Button corner de ejemplo con el nombre accesible de su tipo. */
const corner = (variant: ButtonCornerVariant = 'icon', props: CornerProps = {}) => (
  <ButtonCorner variant={variant} aria-label={LABELS[variant]} {...props} />
);

/** Fila de ejemplos: el marco no tiene separación entre hijos. */
const row = (...items: ReactNode[]) => <div className="flex items-center gap-ds-space-general-xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>;

/** Fila con más separación: deja sitio a las cotas de la anatomía. */
const wideRow = (...items: ReactNode[]) => (
  <div className="flex items-center gap-ds-primitives-space-6xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Superficie fija para Unicolor canva: va sobre foto o color y no cambia con el tema. */
const onPhoto = (children: ReactNode) => (
  <div className="rounded-ds-radius-general-md bg-ds-primitives-color-primary-n01 p-ds-space-general-2xl">{children}</div>
);

/** Tres tipos con `state` forzado (Unicolor canva no define Hover, Select ni Inactive). */
const stateSamples = (state: ButtonCornerState): ReactNode[] => [
  corner('icon', { state, stroke: true }),
  corner('dots', { state, stroke: true }),
  corner('favorite', { state, stroke: true }),
];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Círculo con relleno liso; con Stroke suma un trazo de 1 px.',
    samples: stateSamples('default'),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero sobre un botón habilitado. Cambia el relleno y aparece un trazo de 1.5 px.',
    samples: stateSamples('hover'),
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        Seleccionado: <code>pressed</code> en Checkbox, Radiobutton y Favorite, o <code>aria-expanded</code> en Dots. Cambia el relleno y el trazo pasa a 1 px.
      </>
    ),
    samples: stateSamples('select'),
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        No interactivo (<code>disabled</code> o <code>state=&quot;inactive&quot;</code>). Relleno e ícono atenuados y sin trazo; Favorite conserva el trazo del corazón.
      </>
    ),
    samples: stateSamples('inactive'),
  },
];

export const doc: ComponentDocContent = {
  name: 'Button corner',
  icon: 'arrow-diagonal-right',
  classification: 'atomo',
  summary:
    'El Button corner es el átomo para una acción pequeña en la esquina de una tarjeta o de una pantalla: abrir, ver más opciones, marcar un favorito o seleccionar. Es un círculo con cinco tipos, tres contrastes y dos tamaños.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un círculo con un solo contenido centrado; el tipo decide si es un ícono, un corazón o un control de selección.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Icon y Favorite',
                  preview: wideRow(corner('icon', { stroke: true }), corner('favorite', { stroke: true })),
                  marks: [
                    { n: 1, selector: 'button', index: 0, side: 'left' },
                    { n: 2, selector: '[data-slot="icon"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-slot="icon"]', index: 1, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'button', index: 0, side: 'left' },
                    { kind: 'padding', selector: 'button', index: 0, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> círculo de 40 en md y de 32 en sm (<code>radius/button/full</code>). Padding de 12 en md y de 8 en sm (<code>space/general/xl</code> y <code>space/general/lg</code>). Con <code>stroke</code> dibuja un trazo interior de 1 px.
                </>,
                <>
                  <strong>Ícono:</strong> 16 px, en la caja de ícono centrada. Por defecto es la flecha diagonal y se reemplaza con <code>icon</code>. Hereda el color del estado.
                </>,
                <>
                  <strong>Corazón de Favorite:</strong> 16 px, solo con trazo. Con <code>pressed</code> se rellena.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Dots',
                  preview: corner('dots', { stroke: true }),
                  marks: [
                    { n: 1, selector: 'button', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Dots-moreoptions"]', side: 'bottom' },
                    { n: 3, selector: '[data-slot="icon"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Dots-moreoptions"]', side: 'left' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> mismo círculo de 40 o de 32, pero con padding de 4 en md y de 0 en sm (<code>space/general/md</code> y <code>space/general/xs</code>).
                </>,
                <>
                  <strong>Botón interno:</strong> círculo decorativo de 32 con padding de 8 (<code>space/button/lg</code>). Es la parte de Figma Dots-moreoptions.
                </>,
                <>
                  <strong>Ícono:</strong> tres puntos de 16 px, centrados.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Checkbox y Radiobutton',
                  preview: wideRow(corner('checkbox', { stroke: true }), corner('radiobutton', { stroke: true })),
                  marks: [
                    { n: 1, selector: 'button', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Selection"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Selection"]', index: 1, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'button', index: 0, side: 'left' },
                    { kind: 'padding', selector: 'button', index: 0, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> el mismo círculo de 40 o de 32, con padding de 12 en md y de 8 en sm.
                </>,
                <>
                  <strong>Control de Checkbox:</strong> cuadrado de 16 px con esquinas redondeadas. Es una pieza decorativa (Selection en Figma): no es un campo de formulario.
                </>,
                <>
                  <strong>Control de Radiobutton:</strong> círculo de 16 px, también decorativo. El estado seleccionado sale de <code>pressed</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños',
                  preview: wideRow(corner('icon', { size: 'md', stroke: true }), corner('icon', { size: 'sm', stroke: true }), corner('icon', { size: 'md', iconSize: 20, stroke: true })),
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
                  <strong>md:</strong> 40 × 40.
                </>,
                <>
                  <strong>sm:</strong> 32 × 32.
                </>,
                <>
                  <strong>iconSize 20:</strong> solo en Icon. El círculo conserva el padding y crece a 44 en md y a 36 en sm; es la flecha de volver de las pantallas móviles.
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
          Button corner tiene 4 estados. Hover y Select se fuerzan con <code>state</code> solo para documentar; en uso salen de la interacción. El foco de teclado no tiene estado forzado: dibuja un contorno de 2 px. Unicolor canva solo tiene Default.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default de cada contraste, más los que aparecen en otros estados. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'On canva',
              preview: row(corner('icon', { stroke: true }), corner('favorite', { stroke: true })),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Trazo (con Stroke)', color: 'border-general-default-on-card' },
                { part: 'Corazón (Favorite)', color: 'border-general-gray-secondary' },
                { part: 'Fondo (aparece en Hover)', color: 'background-container-hover-on-canva' },
                { part: 'Trazo (aparece en Hover)', color: 'border-general-hover-on-canva' },
                { part: 'Fondo (aparece en Select)', color: 'background-container-select-on-canva' },
                { part: 'Trazo (aparece en Select)', color: 'border-general-select-on-canva' },
                { part: 'Fondo (aparece en Inactive)', color: 'background-container-disabled-on-canva' },
                { part: 'Ícono (aparece en Inactive)', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'On card',
              preview: row(corner('icon', { contrast: 'on-card', stroke: true }), corner('favorite', { contrast: 'on-card', stroke: true })),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-card' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Trazo (con Stroke)', color: 'border-general-default-on-card' },
                { part: 'Corazón (Favorite)', color: 'border-general-gray-secondary' },
                { part: 'Fondo (aparece en Hover)', color: 'background-container-hover-on-card' },
                { part: 'Trazo (aparece en Hover)', color: 'border-general-hover-on-card' },
                { part: 'Fondo (aparece en Select)', color: 'background-container-select-on-card' },
                { part: 'Trazo (aparece en Select)', color: 'border-general-select-on-card' },
                { part: 'Fondo (aparece en Inactive)', color: 'background-icon-disable-on-card' },
                { part: 'Ícono (aparece en Inactive)', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'Unicolor canva',
              preview: onPhoto(row(corner('icon', { contrast: 'unicolor-canva', stroke: true }), corner('favorite', { contrast: 'unicolor-canva', stroke: true }))),
              entries: [
                { part: 'Fondo (md)', color: 'background-icon-disable-on-card' },
                { part: 'Fondo (sm)', color: 'background-container-hover-unicolor' },
                { part: 'Ícono', color: 'icon-general-default-unicolor' },
                { part: 'Trazo (con Stroke)', color: 'border-general-gray-fifth-unicolor' },
                { part: 'Corazón (Favorite)', color: 'border-general-white-unicolor' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Button corner en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Button corner en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type, Contrast, State, Size y Stroke.
            </>,
            <>
              <strong>Type:</strong> Icon, Dots, Radiobutton, Checkbox o Favorite; en código es <code>variant</code>. El ícono de Icon se reemplaza con <code>icon</code>. Checkbox y Radiobutton dibujan un control decorativo; la selección sale de <code>pressed</code>.
            </>,
            <>
              <strong>Contrast y State:</strong> On canva, On card o Unicolor canva (<code>contrast</code>); y Default, Hover, Select o Inactive. En código el hover es real y <code>state</code> solo lo fuerza; Inactive sale de <code>disabled</code>. Unicolor canva solo tiene Default.
            </>,
            <>
              <strong>Size y Stroke:</strong> md (40) o sm (32) y Stroke Yes o No (<code>size</code> y <code>stroke</code>). Figma solo trae Hover, Select e Inactive en md, y no trae Select en On card; el código sí los admite. Figma tampoco tiene <code>iconSize</code> ni dibuja el foco.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Button corner es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Abrir el detalle desde una tarjeta:</strong> Icon en la esquina o en la muesca de la tarjeta, con su nombre accesible.
            </>,
            <>
              <strong>Menú de opciones:</strong> Dots con <code>aria-haspopup=&quot;menu&quot;</code> y <code>aria-expanded</code>; mientras el menú está abierto se ve en Select.
            </>,
            <>
              <strong>Marcar o seleccionar un elemento:</strong> Favorite, Checkbox o Radiobutton con <code>pressed</code>, que expone <code>aria-pressed</code>.
            </>,
            <>
              <strong>Sobre foto o color:</strong> <code>contrast=&quot;unicolor-canva&quot;</code>; no cambia con el tema.
            </>,
            <>
              <strong>Volver en pantallas móviles:</strong> Icon con <code>iconSize</code> de 20 (44 × 44 en md).
            </>,
          ],
          avoid: [
            <>
              <strong>Acciones con texto:</strong> el círculo no tiene etiqueta visible. (Alternativa: <code>Button</code>).
            </>,
            <>
              <strong>Campos de formulario:</strong> el control de Checkbox y Radiobutton es decorativo, no envía valor ni forma un grupo. (Alternativa: <code>Checkbox</code> o <code>Radio</code>).
            </>,
            <>
              <strong>Botón sin nombre accesible:</strong> el círculo no tiene texto y el tipo exige <code>aria-label</code> o <code>aria-labelledby</code>. (Alternativa: <code>aria-label</code> con la acción, como &quot;Más opciones&quot;).
            </>,
            <>
              <strong>Unicolor sobre la superficie del tema:</strong> pensado para foto o color. (Alternativa: <code>contrast=&quot;on-canva&quot;</code> u <code>&quot;on-card&quot;</code>).
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
                title: 'Todos los tipos',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas:</strong> md 40 y sm 32; ícono de 16 px.
                  </>,
                ],
                preview: (
                  <div className="flex flex-col items-center gap-ds-space-general-xl">
                    {row(corner('icon'), corner('dots'), corner('favorite'), corner('checkbox'), corner('radiobutton'))}
                    {row(
                      corner('icon', { size: 'sm' }),
                      corner('dots', { size: 'sm' }),
                      corner('favorite', { size: 'sm' }),
                      corner('checkbox', { size: 'sm' }),
                      corner('radiobutton', { size: 'sm' })
                    )}
                  </div>
                ),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas:</strong> md 40 y sm 32, con padding de 12 y de 8 (Dots 4 y 0).
              </>,
              <>
                <strong>Volver:</strong> con <code>iconSize</code> de 20 el círculo mide 44 en md y 36 en sm.
              </>,
            ],
            preview: (
              <div className="flex flex-col items-center gap-ds-space-general-xl">
                {row(corner('icon'), corner('dots'), corner('favorite'), corner('checkbox'), corner('radiobutton'))}
                {row(
                  corner('icon', { size: 'sm' }),
                  corner('dots', { size: 'sm' }),
                  corner('favorite', { size: 'sm' }),
                  corner('checkbox', { size: 'sm' }),
                  corner('radiobutton', { size: 'sm' })
                )}
              </div>
            ),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas:</strong> md 40 y sm 32, con padding de 12 y de 8 (Dots 4 y 0).
              </>,
              <>
                <strong>Tamaño fijo:</strong> no se estira con el ancho disponible; quien lo coloca decide su posición.
              </>,
            ],
            preview: (
              <div className="flex flex-col items-center gap-ds-space-general-xl">
                {row(corner('icon'), corner('dots'), corner('favorite'), corner('checkbox'), corner('radiobutton'))}
                {row(
                  corner('icon', { size: 'sm' }),
                  corner('dots', { size: 'sm' }),
                  corner('favorite', { size: 'sm' }),
                  corner('checkbox', { size: 'sm' }),
                  corner('radiobutton', { size: 'sm' })
                )}
              </div>
            ),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de contraste, estado y tamaño del Button corner.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Favorite activo con pressed',
              description: (
                <>
                  Marca el favorito activo con <code>pressed</code>: el corazón se rellena.
                </>
              ),
              preview: corner('favorite', { stroke: true, pressed: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Favorite activo sin pressed',
              description: 'No dejes el corazón vacío en un favorito ya marcado: parece que no lo es.',
              preview: corner('favorite', { stroke: true }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Menú abierto en Select',
              description: (
                <>
                  Marca Dots con <code>aria-expanded</code> mientras el menú está abierto.
                </>
              ),
              preview: corner('dots', { 'aria-haspopup': 'menu', 'aria-expanded': true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Menú abierto sin estado',
              description: 'No dejes Dots en reposo con el menú abierto: no se ve que está activo.',
              preview: corner('dots', { 'aria-haspopup': 'menu' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Mismo tamaño en el grupo',
              description: 'Usa un solo tamaño en los botones de una misma fila.',
              preview: row(corner('icon', { stroke: true }), corner('dots', { stroke: true }), corner('favorite', { stroke: true })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tamaños mezclados',
              description: 'No mezcles md y sm en una misma fila.',
              preview: row(corner('icon', { stroke: true }), corner('dots', { stroke: true, size: 'sm' }), corner('favorite', { stroke: true })),
            },
          ],
        },
      ],
    },
  ],
};
