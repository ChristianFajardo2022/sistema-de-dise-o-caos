import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { ScanGuide } from './ScanGuide';
import { ScanPoints } from './ScanPoints';
import { ScanProgress } from './ScanProgress';

/*
 * Contenido de la página de documentación de Scan (plantilla v2, `.qa/docs/plantilla-v2.md`): una sola página para
 * ScanGuide, ScanPoints y ScanProgress. Manda el código (`Scan.types.ts`, `Scan.variants.ts`, `ScanGuide.tsx`,
 * `ScanPoints.tsx`, `ScanProgress.tsx`), luego los `*.docs.json`. Medidas fijas: 334 × 140, 129 × 175 y 60 × 60.
 * ScanGuide sigue el tema; ScanPoints y ScanProgress usan tokens unicolor y se muestran sobre la vista oscura
 * de la cámara, como en sus historias. Las muestras van sin animar (`animated={false}`) para que se vea cada fotograma.
 * El código no combina las tres piezas: cada una se documenta por separado. Diferencias con Figma: en Type QR,
 * Figma enlaza `background/field/active-opacity` en la estela de QR y el código usa
 * `background/general/white` al 40% (mismo valor).
 */

// Figma: 20889:54087 (component set Animation scan), 19548:38784 (Points scan) y 21258:21640 (Progress scan)

type GuideProps = Partial<ComponentProps<typeof ScanGuide>>;
type PointsProps = Partial<ComponentProps<typeof ScanPoints>>;
type ProgressProps = Partial<ComponentProps<typeof ScanProgress>>;

/** Guía sin animar sobre la superficie del lienzo (el foco de luz se apaga hacia `default-on-canva`). */
const guide = (props: GuideProps = {}): ReactNode => (
  <div className="flex rounded-ds-radius-general-lg bg-ds-background-container-default-on-canva">
    <ScanGuide animated={false} {...props} />
  </div>
);

/** Puntos de captura sin animar. */
const points = (props: PointsProps = {}): ReactNode => <ScanPoints animated={false} {...props} />;

/** Progreso del escaneo. */
const progress = (props: ProgressProps = {}): ReactNode => <ScanProgress {...props} />;

/** Vista oscura de la cámara: ScanPoints y ScanProgress usan tokens unicolor (no cambian con el modo) y van sobre ella en ambos temas. */
const camera = (...items: ReactNode[]): ReactNode => (
  <div
    data-theme="dark"
    className="flex items-center justify-center gap-ds-space-general-2xl rounded-ds-radius-general-lg bg-ds-background-general-black p-ds-space-general-2xl"
  >
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Vista oscura de la cámara a todo el ancho de la pantalla (ejemplos de Do and Dont’s). */
const cameraScreen = (child: ReactNode): ReactNode => (
  <div data-theme="dark" className="flex w-full items-center justify-center rounded-ds-radius-general-lg bg-ds-background-general-black p-ds-space-general-2xl">
    {child}
  </div>
);

/** Superficie clara (el caso que se evita en Do and Dont’s): gris claro del modo claro, para que los puntos apenas se perciban. */
const lightSurface = (child: ReactNode): ReactNode => (
  <div data-theme="light" className="flex w-full items-center justify-center rounded-ds-radius-general-lg bg-ds-background-general-gray-fifth p-ds-space-general-2xl">
    {child}
  </div>
);

/** Columna de ejemplos. */
const column = (...items: ReactNode[]): ReactNode => (
  <div className="flex flex-col items-start gap-ds-space-general-xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Instrucción visible junto a la guía, en los ejemplos de Do and Dont’s. */
const instruction = (text: string): ReactNode => (
  <p className="m-0 font-ds-primitives-typography-family-primary text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md text-ds-text-neutral-white">
    {text}
  </p>
);

const states: DocStateItem[] = [
  {
    label: 'Face',
    tone: 'neutral',
    description: (
      <>
        Rostro dentro del visor (<code>type=&quot;face&quot;</code>). En la animación, la figura sube y baja levemente.
      </>
    ),
    samples: [guide({ type: 'face' })],
  },
  {
    label: 'Code',
    tone: 'neutral',
    description: (
      <>
        Código de barras con líneas de barrido (<code>type=&quot;code&quot;</code>).
      </>
    ),
    samples: [guide({ type: 'code' })],
  },
  {
    label: 'Id',
    tone: 'neutral',
    description: (
      <>
        Documento de identidad (<code>type=&quot;id&quot;</code>). Es el único con 3 fotogramas: el documento crece y su frente se desliza para mostrar el reverso.
      </>
    ),
    samples: [guide({ type: 'id', frame: 2 }), guide({ type: 'id', frame: 3 })],
  },
  {
    label: 'QR',
    tone: 'neutral',
    description: (
      <>
        Ícono scan-barcode con una línea de barrido (<code>type=&quot;qr&quot;</code>). En la animación, la línea deja una estela.
      </>
    ),
    samples: [guide({ type: 'qr', frame: 1 })],
  },
  {
    label: 'Points scan',
    tone: 'neutral',
    description: (
      <>
        ScanPoints con un fotograma fijo (<code>step</code>, de 0 a 8). En 4 hay cuatro puntos capturados y el resto al 30%; en 8, todos. En 0 no se ve ninguno.
      </>
    ),
    samples: [camera(points({ step: 4 })), camera(points({ step: 8 }))],
  },
  {
    label: 'Progress scan',
    tone: 'neutral',
    description: (
      <>
        ScanProgress con el avance de 0 a 100 (<code>value</code>): el arco crece desde arriba en sentido horario y el porcentaje va al centro.
      </>
    ),
    samples: [camera(progress({ value: 0 }), progress({ value: 60 }), progress({ value: 90 }))],
  },
  {
    label: 'Variante12',
    tone: 'success',
    description: (
      <>
        Estado terminado (<code>complete</code>): disco con el degradado de éxito (<code>success</code>) y el ícono tick-circle. Anuncia &quot;Completado&quot;.
      </>
    ),
    samples: [camera(progress({ complete: true, label: 'Escaneo completado' }))],
  },
];

/** Vista de las tres piezas, cada una por separado, para los breakpoints. */
const pieces = (): ReactNode => column(guide(), camera(points({ step: 8 }), progress({ value: 60 })));

export const doc: ComponentDocContent = {
  name: 'Scan',
  icon: 'scan',
  classification: 'atomo',
  summary:
    'Scan reúne los tres átomos que acompañan un escaneo con cámara: ScanGuide indica qué colocar frente a la cámara, ScanPoints marca los puntos capturados y ScanProgress muestra el avance hasta terminar. Son piezas independientes y animadas.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Tres piezas independientes, cada una en su lienzo. ScanPoints y ScanProgress se muestran sobre la vista oscura de la cámara.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'ScanGuide (Id)',
                  preview: guide({ type: 'id', frame: 2, label: 'Ubica tu documento dentro del marco' }),
                  marks: [
                    { n: 1, selector: '[role="img"]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="points"]', side: 'left' },
                    { n: 3, selector: 'svg > g > path', index: 3, side: 'right' },
                    { n: 4, selector: 'svg > g > g', side: 'bottom' },
                    { n: 5, selector: '[data-figma-part="Icon-sizes"]', index: -1, side: 'top' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[role="img"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 334 × 140 con padding de 4 (medidas sin token). No se estira con el ancho disponible.
                </>,
                <>
                  <strong>Rejilla de puntos:</strong> 15 × 8 puntos con un foco de luz radial: centro en <code>background/general/gray-fifth</code> que se apaga hacia <code>background/container/default-on-canva</code>.
                </>,
                <>
                  <strong>Visor:</strong> cuatro esquinas redondeadas alrededor de la figura, en <code>background/general/white</code>.
                </>,
                <>
                  <strong>Figura:</strong> rostro, código de barras, documento o QR según <code>type</code>. Las líneas van en <code>border/general/white</code>.
                </>,
                <>
                  <strong>Ícono:</strong> Id usa user-tag y QR usa scan-barcode, de la biblioteca de íconos, en <code>icon/general/default</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'ScanPoints (step 4)',
                  preview: camera(points({ step: 4, label: 'Puntos de captura' })),
                  marks: [
                    { n: 1, selector: '[data-figma-part="6"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="1"]', side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="2"]', side: 'left' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'svg[role="img"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Punto capturado:</strong> círculo de 5 × 5 (<code>radius/general/full</code>) en <code>background/general/white-unicolor</code>, con opacidad completa. Los 8 puntos tienen posiciones fijas en un marco de 129 × 175 sin relleno.
                </>,
                <>
                  <strong>Punto pendiente:</strong> el mismo punto al 30% de opacidad.
                </>,
                <>
                  <strong>Orden de captura:</strong> los puntos se encienden en el orden 6, 3, 7, 5, 4, 1, 8, 2. Este es el 2, el último.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'ScanProgress (60% y terminado)',
                  preview: camera(progress({ value: 60 }), progress({ complete: true, label: 'Escaneo completado' })),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Ellipse 1"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Ellipse 2"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="60%"]', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Ellipse 2"]', index: 1, side: 'top' },
                    { n: 5, selector: '[data-figma-part="Icon-sizes"]', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[role="progressbar"]', index: 1 }],
                },
              ],
              guidelines: [
                <>
                  <strong>Anillo:</strong> círculo de 60 × 60 con trazo de 3 en <code>background/general/white-unicolor</code>.
                </>,
                <>
                  <strong>Arco:</strong> trazo de 3 con extremos redondeados y degradado de <code>background/semantic/success/secondary</code> a <code>success/fourth</code>. Arranca arriba y crece en sentido horario.
                </>,
                <>
                  <strong>Porcentaje:</strong> heading sm 14/18 (<code>typography/heading/size/sm</code>), Prospero semibold, en <code>text/neutral/white-unicolor</code>. Es redundante para el lector de pantalla y queda oculto.
                </>,
                <>
                  <strong>Disco terminado:</strong> círculo de 60 con degradado de <code>success/tertiary</code> a <code>success/fourth</code> al 72%.
                </>,
                <>
                  <strong>Ícono:</strong> tick-circle line de 24 en <code>icon/general/default</code>, centrado en el disco.
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
          Scan tiene 7 variantes de aspecto: los 4 Type de ScanGuide, los puntos de ScanPoints, el avance de ScanProgress y su estado terminado. No es interactivo. Las muestras van sin animar (<code>animated={'{false}'}</code>) para que se vea cada fotograma.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada pieza. ScanGuide cambia con el modo; ScanPoints y ScanProgress van sobre la vista oscura de la cámara y se leen siempre en modo oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'ScanGuide',
              preview: guide(),
              entries: [
                { part: 'Rejilla (centro del foco)', color: 'background-general-gray-fifth' },
                { part: 'Rejilla (fuera del foco)', color: 'background-container-default-on-canva' },
                { part: 'Visor y figura', color: 'background-general-white' },
                { part: 'Líneas de la figura', color: 'border-general-white' },
                { part: 'Íconos (Id y QR)', color: 'icon-general-default' },
              ],
            },
            {
              title: 'ScanPoints',
              preview: camera(points()),
              entries: [{ part: 'Puntos (pendientes al 30%)', color: 'background-general-white-unicolor', mode: 'dark' }],
            },
            {
              title: 'ScanProgress',
              preview: camera(progress({ value: 60 })),
              entries: [
                { part: 'Anillo', color: 'background-general-white-unicolor', mode: 'dark' },
                { part: 'Arco (inicio del degradado)', color: 'background-semantic-success-secondary', mode: 'dark' },
                { part: 'Arco (final del degradado)', color: 'background-semantic-success-fourth', mode: 'dark' },
                { part: 'Porcentaje', color: 'text-neutral-white-unicolor', text: 'typography-heading-size-sm', mode: 'dark' },
              ],
            },
            {
              title: 'ScanProgress terminado (Variante12)',
              preview: camera(progress({ complete: true, label: 'Escaneo completado' })),
              entries: [
                { part: 'Disco (inicio del degradado)', color: 'background-semantic-success-tertiary', mode: 'dark' },
                { part: 'Disco (final del degradado)', color: 'background-semantic-success-fourth', mode: 'dark' },
                { part: 'Ícono', color: 'icon-general-default', mode: 'dark' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Scan en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra los tres sets en la página Scan de la librería de Assets: Animation scan es <code>ScanGuide</code>, Points scan es <code>ScanPoints</code> y Progress scan es <code>ScanProgress</code>.
            </>,
            <>
              <strong>Type y Transition en Animation scan:</strong> Type (Face, Code, Id, QR) es <code>type</code> (<code>&quot;face&quot;</code>, <code>&quot;code&quot;</code>, <code>&quot;id&quot;</code>, <code>&quot;qr&quot;</code>). Transition es <code>frame</code>: son fotogramas de la animación, no estados. Id tiene 3 y el resto, 2.
            </>,
            <>
              <strong>Propiedad 1 en Points scan:</strong> 0 a 8 es <code>step</code>, la cantidad de puntos capturados. En código, <code>animated</code> recorre los 9 fotogramas solo.
            </>,
            <>
              <strong>Propiedad 1 en Progress scan:</strong> 0 a 100 son fotogramas de <code>value</code>, que en código acepta cualquier número de 0 a 100. Variante12 es el estado terminado (<code>complete</code>).
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> la animación en bucle, el nombre accesible (<code>label</code>) y la opción de ocultar el porcentaje (<code>showValue</code>).
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: (
        <>
          Cuándo Scan es la pieza correcta y cuándo conviene otra. Desarrollo muestra las props de ScanGuide; las de ScanPoints (<code>step</code>, <code>animated</code>, <code>label</code>) y ScanProgress (<code>value</code>, <code>complete</code>, <code>label</code>, <code>showValue</code>) están en esta página y en sus ejemplos de uso.
        </>
      ),
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Guiar antes de capturar:</strong> ScanGuide muestra qué poner frente a la cámara (<code>type</code>): rostro, código de barras, documento o QR.
            </>,
            <>
              <strong>Mostrar el avance del escaneo:</strong> ScanProgress es un <code>role=&quot;progressbar&quot;</code> con <code>aria-valuenow</code> y <code>aria-valuetext</code>. Con <code>complete</code> anuncia &quot;Completado&quot;.
            </>,
            <>
              <strong>Nombre accesible:</strong> ScanGuide y ScanPoints son decorativas (<code>aria-hidden</code>) salvo que pases <code>label</code>, que las expone como imagen.
            </>,
            <>
              <strong>Movimiento reducido:</strong> con <code>prefers-reduced-motion: reduce</code>, ScanGuide queda fija en <code>frame</code> (por defecto 2) y ScanPoints en <code>step</code> (por defecto 8), igual que con <code>animated={'{false}'}</code>. ScanProgress salta al valor nuevo sin la transición de 300 ms.
            </>,
            <>
              <strong>Bucles:</strong> la guía cambia de fotograma cada 1,2 s con un fundido cruzado; los puntos se encienden uno cada 0,45 s y el ciclo se repite cada 4,5 s.
            </>,
            <>
              <strong>Piezas independientes:</strong> el código no las combina. La pantalla de escaneo coloca cada una donde la necesita.
            </>,
          ],
          avoid: [
            <>
              <strong>Indicar una carga sin cámara:</strong> Scan es para escanear, no para esperas. (Alternativa: <code>Spinner</code>).
            </>,
            <>
              <strong>Mostrar el avance de una tarea:</strong> el anillo de ScanProgress es para el escaneo. (Alternativa: <code>ProgressBar</code>).
            </>,
            <>
              <strong>ScanPoints o ScanProgress sobre una superficie clara:</strong> sus tokens unicolor (<code>white-unicolor</code>) no cambian con el modo y se pierden. (Alternativa: la vista oscura de la cámara).
            </>,
            <>
              <strong>Usar <code>step</code> o <code>frame</code> como estado:</strong> son fotogramas de una animación, no valores. (Alternativa: <code>value</code> de <code>ScanProgress</code>).
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
                title: 'ScanGuide',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Tamaño fijo:</strong> 334 × 140; no se estira con el ancho disponible.
                  </>,
                ],
                preview: guide(),
              },
              {
                title: 'ScanPoints y ScanProgress',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> miden lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Tamaños fijos:</strong> ScanPoints 129 × 175 y ScanProgress 60 × 60.
                  </>,
                ],
                preview: camera(points({ step: 8 }), progress({ value: 60 })),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Tamaños fijos:</strong> ScanGuide 334 × 140, ScanPoints 129 × 175 y ScanProgress 60 × 60.
              </>,
              <>
                <strong>Porcentaje:</strong> heading sm 14/18 (<code>typography/heading/size/sm</code>), igual en los tres breakpoints.
              </>,
            ],
            preview: pieces(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Tamaños fijos:</strong> ScanGuide 334 × 140, ScanPoints 129 × 175 y ScanProgress 60 × 60.
              </>,
              <>
                <strong>Porcentaje:</strong> heading sm 14/18 (<code>typography/heading/size/sm</code>), igual en los tres breakpoints.
              </>,
            ],
            preview: pieces(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de instrucción, superficie y cierre del escaneo.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Guía con instrucción',
              description: 'Acompaña la guía con un texto visible que diga qué hacer.',
              preview: (
                <>
                  {instruction('Ubica tu rostro dentro del marco')}
                  <ScanGuide type="face" animated={false} className="self-center" />
                </>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Guía sola',
              description: 'No dejes la guía sin texto: es decorativa y el lector de pantalla no la anuncia.',
              preview: <ScanGuide type="face" animated={false} className="self-center" />,
            },
            {
              kind: 'do',
              framed: true,
              title: 'Puntos sobre la cámara',
              description: 'Usa ScanPoints donde el fondo es siempre oscuro: su token unicolor no cambia con el modo.',
              preview: cameraScreen(points({ step: 8 })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Puntos sin contraste',
              description: (
                <>
                  No pongas ScanPoints sobre una superficie clara: <code>white-unicolor</code> casi no se distingue.
                </>
              ),
              preview: lightSurface(points({ step: 8 })),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Escaneo terminado',
              description: (
                <>
                  Marca el final con <code>complete</code>: dibuja el disco y anuncia &quot;Completado&quot;.
                </>
              ),
              preview: cameraScreen(progress({ complete: true, label: 'Escaneo completado' })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Avance al 100%',
              description: (
                <>
                  No cierres el escaneo con <code>value={'{100}'}</code>: falta la confirmación.
                </>
              ),
              preview: cameraScreen(progress({ value: 100 })),
            },
          ],
        },
      ],
    },
  ],
};
