import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Spinner } from './Spinner';

/*
 * Contenido de la página de documentación de Spinner (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Spinner.types.ts`, `Spinner.variants.ts`, `Spinner.tsx`), luego `Spinner.docs.json`. Figma tiene dos sets:
 * Spinner (`variant="ring"`) y Spinner button (`variant="dots"`). Las muestras van sin animar (el fotograma de
 * Figma) salvo donde la animación es lo que se documenta.
 */

// Figma: 11262:916 (component set Spinner) · 11309:1208 (component set Spinner button)

/** Spinner de ejemplo: sin animar por defecto, para que el fotograma se vea y se mida. */
const spin = (props: Partial<ComponentProps<typeof Spinner>> = {}): ReactNode => <Spinner animated={false} {...props} />;

/** Fila de muestras del mismo componente con distinto Type. */
const types = (list: ('1' | '2' | '3')[], props: Partial<ComponentProps<typeof Spinner>> = {}): ReactNode[] =>
  list.map((t) => <Fragment key={t}>{spin({ ...props, type: t, label: `Cargando, tipo ${t}` })}</Fragment>);

const states: DocStateItem[] = [
  {
    label: 'Spinner',
    tone: 'neutral',
    description: (
      <>
        Dos anillos concéntricos (<code>variant=&quot;ring&quot;</code>). Type 1 lleva <code>border/general/white</code> en el exterior y Type 2 lo lleva en el interior.
      </>
    ),
    samples: types(['1', '2']),
  },
  {
    label: 'Spinner button M',
    tone: 'neutral',
    description: (
      <>
        Tres puntos de 8 px en una caja de 24 px (<code>variant=&quot;dots&quot;</code>). Type es el fotograma inicial de la animación: los tres forman el mismo triángulo y cambia qué punto va en cada posición.
      </>
    ),
    samples: types(['1', '2', '3'], { variant: 'dots', size: 'md' }),
  },
  {
    label: 'Spinner button S',
    tone: 'neutral',
    description: (
      <>
        Tres puntos de 6 px en una caja de 16 px (<code>size=&quot;sm&quot;</code>). Type es el fotograma inicial, igual que en M.
      </>
    ),
    samples: types(['1', '2', '3'], { variant: 'dots', size: 'sm' }),
  },
  {
    label: 'Tone current',
    tone: 'neutral',
    description: (
      <>
        Hereda el color del texto (<code>tone=&quot;current&quot;</code>), para usarlo dentro de controles con otro color. En el anillo, el interior baja al 50%.
      </>
    ),
    samples: [
      <span key="ring" className="text-ds-text-neutral-heading">{spin({ tone: 'current', label: 'Cargando, tono actual' })}</span>,
      <span key="dots" className="text-ds-text-neutral-heading">{spin({ variant: 'dots', tone: 'current', label: 'Cargando puntos, tono actual' })}</span>,
    ],
  },
  {
    label: 'Animado',
    tone: 'neutral',
    description: (
      <>
        Es el estado por defecto (<code>animated</code>). El anillo late en contrafase; los puntos giran y se juntan. Con <code>prefers-reduced-motion</code> ambos pasan a un pulso suave.
      </>
    ),
    samples: [<Spinner key="ring" label="Cargando animado" />, <Spinner key="dots" variant="dots" label="Cargando puntos animado" />],
  },
];

/** Anillo y puntos juntos, para las vistas de breakpoints. */
const both = (): ReactNode => (
  <div className="flex items-center gap-ds-space-general-2xl">
    {spin({ label: 'Cargando anillo' })}
    {spin({ variant: 'dots', size: 'md', label: 'Cargando puntos M' })}
    {spin({ variant: 'dots', size: 'sm', label: 'Cargando puntos S' })}
  </div>
);

/** Texto breve junto al spinner, en los ejemplos de Do and Dont’s. */
const caption = (text: string): ReactNode => (
  <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-body">{text}</span>
);

export const doc: ComponentDocContent = {
  name: 'Spinner',
  icon: 'refresh',
  classification: 'atomo',
  summary:
    'El Spinner es el átomo que indica una espera de duración desconocida. Tiene dos formas, el anillo y los tres puntos del Spinner button, con tres fotogramas (Type) y dos tamaños para los puntos. Se anuncia como estado y respeta la preferencia de movimiento reducido.',
  definition: [
    {
      title: 'Anatomía',
      description: 'El anillo se compone de dos elipses dentro de un marco cuadrado; los puntos, de tres elipses en una caja más pequeña.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Spinner (anillo)',
                  preview: spin({ label: 'Cargando anillo' }),
                  marks: [
                    { n: 1, selector: '[role="status"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Ellipse 1"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Ellipse 2"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[role="status"]' },
                    { kind: 'height', selector: '[data-figma-part="Ellipse 2"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Marco:</strong> cuadrado de <code>dimention/icono/M</code>: 56 px en Desktop y Tablet, 48 px en Mobile. Es un <code>span</code> con <code>role=&quot;status&quot;</code> y nombre accesible.
                </>,
                <>
                  <strong>Anillo exterior:</strong> llena el marco, con trazo de 1.5 px hacia dentro (<code>border/general/lg</code>). En Type 1 usa <code>border/general/white</code>.
                </>,
                <>
                  <strong>Anillo interior:</strong> mide <code>dimention/icono/S</code>: 24 px en Desktop y Tablet, 16 px en Mobile. En Type 1 usa <code>border/general/gray-secondary</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Spinner button (puntos)',
                  preview: spin({ variant: 'dots', size: 'md', label: 'Cargando puntos' }),
                  marks: [
                    { n: 1, selector: '[role="status"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Ellipse 6"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Ellipse 7"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Ellipse 8"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[role="status"]' },
                    { kind: 'height', selector: '[data-figma-part="Ellipse 6"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Caja:</strong> cuadrado de 24 px en M y de 16 px en S, del tamaño de un ícono. No cambia entre breakpoints.
                </>,
                <>
                  <strong>Primer punto:</strong> círculo de 8 px en M y de 6 px en S, con el fondo <code>background/general/white</code>. En Type 1 queda arriba a la izquierda.
                </>,
                <>
                  <strong>Segundo punto:</strong> igual que el primero. En Type 1 queda arriba a la derecha.
                </>,
                <>
                  <strong>Tercer punto:</strong> igual que los otros dos. En Type 1 queda abajo, centrado. Type 2 y 3 rotan los tres puntos 120°.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños de Spinner button',
                  preview: (
                    <>
                      {spin({ variant: 'dots', size: 'md', label: 'Cargando puntos M' })}
                      {spin({ variant: 'dots', size: 'sm', label: 'Cargando puntos S' })}
                    </>
                  ),
                  marks: [
                    { n: 1, selector: '[role="status"]', index: 0, side: 'top' },
                    { n: 2, selector: '[role="status"]', index: 1, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[role="status"]', index: 0 },
                    { kind: 'height', selector: '[role="status"]', index: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>M:</strong> caja de 24 px y puntos de 8 px (<code>size=&quot;md&quot;</code>).
                </>,
                <>
                  <strong>S:</strong> caja de 16 px y puntos de 6 px (<code>size=&quot;sm&quot;</code>).
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
          Spinner no es interactivo: sus estados son 5 variantes de aspecto. Las muestras van sin animar, salvo la última, para ver cada fotograma; <code>{'animated={false}'}</code> deja el de Figma.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada forma. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Spinner Type 1',
              preview: spin({ type: '1', label: 'Cargando tipo 1' }),
              entries: [
                { part: 'Anillo exterior', color: 'border-general-white' },
                { part: 'Anillo interior', color: 'border-general-gray-secondary' },
              ],
            },
            {
              title: 'Spinner Type 2',
              preview: spin({ type: '2', label: 'Cargando tipo 2' }),
              entries: [
                { part: 'Anillo exterior', color: 'border-general-gray-secondary' },
                { part: 'Anillo interior', color: 'border-general-white' },
              ],
            },
            {
              title: 'Spinner button',
              preview: spin({ variant: 'dots', size: 'md', label: 'Cargando puntos' }),
              entries: [{ part: 'Puntos', color: 'background-general-white' }],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Spinner en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra Spinner y Spinner button como dos componentes en la librería de Assets. Spinner tiene la propiedad Type; Spinner button tiene Type y Size.
            </>,
            <>
              <strong>Spinner:</strong> Type 1 o 2 es <code>variant=&quot;ring&quot;</code> con <code>type</code>. Los dos anillos intercambian su token entre un Type y el otro.
            </>,
            <>
              <strong>Spinner button:</strong> es <code>variant=&quot;dots&quot;</code>. Type 1, 2 o 3 es <code>type</code> y Size M o S es <code>size=&quot;md&quot;</code> o <code>&quot;sm&quot;</code>.
            </>,
            <>
              <strong>Solo en código:</strong> Figma dibuja un fotograma fijo. El código añade <code>animated</code>, <code>tone</code>, <code>label</code> y <code>decorative</code>. El Load de Button es otro dibujo, aunque comparte el movimiento de los puntos.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Spinner es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Espera de una región o vista:</strong> el anillo con un <code>label</code> que diga qué carga, por ejemplo <code>label=&quot;Cargando resultados&quot;</code>.
            </>,
            <>
              <strong>Espera dentro de un control que no es Button:</strong> los puntos con <code>tone=&quot;current&quot;</code> y <code>decorative</code>, y <code>aria-busy</code> en el control, que ya anuncia el estado.
            </>,
            <>
              <strong>Duración desconocida:</strong> el Spinner no muestra avance, solo que el sistema trabaja.
            </>,
            <>
              <strong>Nombre accesible:</strong> por defecto es <code>role=&quot;status&quot;</code> con el nombre &quot;Cargando&quot;; con <code>decorative</code> queda oculto a lectores de pantalla.
            </>,
            <>
              <strong>Movimiento reducido:</strong> con <code>prefers-reduced-motion</code> el anillo late más lento (3 s) y los puntos dejan de girar y pulsan escalonados (2 s). El indicador no desaparece.
            </>,
          ],
          avoid: [
            <>
              <strong>Progreso medible:</strong> si conoces el avance, el Spinner no lo muestra. (Alternativa: <code>ProgressBar</code>).
            </>,
            <>
              <strong>Botón en espera:</strong> Button ya trae su propio indicador y anuncia <code>aria-busy</code>. (Alternativa: <code>loading</code> de Button).
            </>,
            <>
              <strong>Sin nombre propio:</strong> dos spinners con el nombre &quot;Cargando&quot; no se distinguen. (Alternativa: un <code>label</code> distinto en cada uno).
            </>,
            <>
              <strong>Varios a la vez:</strong> un spinner por cada fila de una lista resta claridad. (Alternativa: uno solo para toda la región).
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
                title: 'Spinner',
                bullets: [
                  <>
                    <strong>Marco de 56 px</strong> (<code>dimention/icono/M</code>) con trazo de 1.5 px.
                  </>,
                  <>
                    <strong>Anillo interior de 24 px</strong> (<code>dimention/icono/S</code>).
                  </>,
                ],
                preview: spin({ label: 'Cargando anillo' }),
              },
              {
                title: 'Spinner button',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> caja de 24 px en M y de 16 px en S.
                  </>,
                  <>
                    <strong>Puntos de 8 px</strong> en M y de 6 px en S.
                  </>,
                ],
                preview: (
                  <div className="flex items-center gap-ds-space-general-2xl">
                    {spin({ variant: 'dots', size: 'md', label: 'Cargando puntos M' })}
                    {spin({ variant: 'dots', size: 'sm', label: 'Cargando puntos S' })}
                  </div>
                ),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Spinner:</strong> el marco baja a 48 px (<code>dimention/icono/M</code>), con los tokens responsive de Mobile.
              </>,
              <>
                <strong>Spinner button:</strong> sin cambios, 24 px en M y 16 px en S.
              </>,
              <>
                <strong>Anillo interior:</strong> 16 px (<code>dimention/icono/S</code>) dentro del marco de 48 px.
              </>,
            ],
            preview: both(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Spinner:</strong> marco de 56 px y anillo interior de 24 px, los mismos valores que Desktop.
              </>,
              <>
                <strong>Spinner button:</strong> sin cambios, 24 px en M y 16 px en S.
              </>,
              <>
                <strong>Posición:</strong> no ocupa el ancho del contenedor; mide siempre lo mismo y se coloca con el diseño que lo rodea.
              </>,
            ],
            preview: both(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de cantidad, tamaño y movimiento.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Un indicador por región',
              description: 'Usa un solo Spinner para toda la región que carga.',
              preview: (
                <div className="flex flex-col items-center gap-ds-space-general-md">
                  {spin({ label: 'Cargando documentos' })}
                  {caption('Documentos')}
                </div>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Un indicador por fila',
              description: 'No pongas un Spinner en cada fila de la misma lista.',
              preview: (
                <div className="flex flex-col gap-ds-space-general-md">
                  {['Contrato', 'Informe', 'Acta'].map((n) => (
                    <div key={n} className="flex items-center gap-ds-space-general-md">
                      {spin({ variant: 'dots', size: 'sm', label: `Cargando ${n}` })}
                      {caption(n)}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Puntos junto al texto',
              description: 'Usa los puntos para una espera junto a una línea de texto o dentro de un control.',
              preview: (
                <div className="flex items-center gap-ds-space-general-md">
                  {spin({ variant: 'dots', size: 'sm', label: 'Guardando cambios' })}
                  {caption('Guardando cambios')}
                </div>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Anillo junto al texto',
              description: 'No pongas el anillo, de 56 px, al lado de una línea de texto: la desproporciona.',
              preview: (
                <div className="flex items-center gap-ds-space-general-md">
                  {spin({ label: 'Guardando cambios' })}
                  {caption('Guardando cambios')}
                </div>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Indicador en movimiento',
              description: 'Deja el Spinner animado mientras dure la espera.',
              preview: (
                <div className="flex items-center gap-ds-space-general-md">
                  <Spinner variant="dots" label="Cargando archivo" />
                  {caption('Subiendo archivo')}
                </div>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Indicador detenido',
              description: <>No uses <code>{'animated={false}'}</code> en una espera real: parece colgado.</>,
              preview: (
                <div className="flex items-center gap-ds-space-general-md">
                  {spin({ variant: 'dots', label: 'Cargando archivo' })}
                  {caption('Subiendo archivo')}
                </div>
              ),
            },
          ],
        },
      ],
    },
  ],
};
