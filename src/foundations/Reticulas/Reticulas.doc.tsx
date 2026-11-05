import type { DocInline, DocPractice } from '../../docs/types';
import type { FoundationBlock, FoundationDocContent } from '../_doc/foundationDoc.types';
import { rawToken } from '../_doc/tokensCss';
import {
  CasoDeUso,
  ComposicionColumnas,
  EstructuraReticula,
  GuiaCentral,
  GuiaDerecha,
  MargenesLaterales,
  MargenesVerticales,
  MuestraAlineacion,
  MuestraApilado,
  MuestraMargenes,
  OrdenDeLectura,
  PantallasAEscala,
  ReticulaPorBreakpoint,
  TipoReticula,
  TipoSecundaria,
} from './ReticulasMuestras';
import {
  BREAKPOINTS,
  BREAKPOINTS_ASC,
  COMPOSICION,
  FIGMA,
  GRID_VARS,
  SPECS,
  breakpointAt,
  breakpointRange,
  breakpointRem,
  breakpointStart,
  primitiveOf,
  pxText,
  spanWidth,
} from './reticulaData';
import type { GridParam } from './reticulaData';

/*
 * Contenido de la página Retículas (plantilla v2 de fundamentos, como Tipografía y Colores). Manda
 * `src/styles/tokens.css`: columnas, canal, márgenes, lienzos y breakpoints salen de `reticulaData.ts`. El texto viene de
 * la documentación anterior de Figma (Definición, Valores de token y Aplicación), sin IDs, sin el nombre de la empresa y
 * con voz y tono. Accesibilidad y parte de Desarrollo son criterio propio: la documentación anterior no los tenía.
 */

// Figma: 484:589 (página "Retículas"; documentación anterior 1328:4411: frames 1328:4412, 2079:2062, 1727:1993 y 1328:4714;
// retículas por breakpoint 2040:2359, 2040:2360 y 2040:2361)

// ───────────────────────── datos ─────────────────────────

const m = SPECS.mobile;
const t = SPECS.tablet;
const d = SPECS.desktop;

/** "16, 24 y 56 px": valores de un parámetro de Mobile a Desktop. */
function serie(param: GridParam): string {
  const values = BREAKPOINTS_ASC.map(({ bp }) => SPECS[bp][param]);
  return `${values.slice(0, -1).join(', ')} y ${values[values.length - 1]} px`;
}

const sameGutter = BREAKPOINTS.every(({ bp }) => SPECS[bp].gutter === d.gutter);

/** Nombre corto de una variable responsive en `<code>`. Si no existe en tokens.css, lo dice en la consola. */
function tk(variable: string): DocInline {
  if (rawToken(variable, 'dark') === undefined) console.error(`Retículas: la variable ${variable} no está en tokens.css`);
  return <code>{variable}</code>;
}

/** Celda de varias líneas (una por elemento). */
const lines = (...items: DocInline[]): DocInline => (
  <>
    {items.map((item, i) => (
      <span key={i} className="block">
        {item}
      </span>
    ))}
  </>
);

/** Subtítulo de un tipo de retícula o de un par de Do and Dont’s (Heading-lg-600). */
const subTitle = (text: string): FoundationBlock => ({
  type: 'custom',
  content: (
    <h3 className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-xl leading-ds-typography-heading-line-height-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading [overflow-wrap:anywhere]">
      {text}
    </h3>
  ),
});

const practice = (kind: DocPractice['kind'], title: string, description: string, preview: DocPractice['preview']): DocPractice => ({
  kind,
  framed: true,
  title,
  description,
  preview,
});

/** Valor de una variable en un breakpoint, con el primitivo al que apunta. */
function valueCell(variable: string, param: GridParam, bp: (typeof BREAKPOINTS)[number]['bp']): DocInline {
  const value = SPECS[bp][param];
  const primitive = primitiveOf(variable, bp);
  const text = param === 'columns' ? `${value} columnas` : pxText(value);
  return primitive.startsWith('space-') ? lines(text, <code key="p">{primitive}</code>) : text;
}

const PARAM_LABELS: Record<GridParam, string> = {
  columns: 'Columnas',
  gutter: 'Canal',
  lateral: 'Margen lateral fijo',
  lateralWeb: 'Margen lateral variable',
  top: 'Margen superior',
  bottom: 'Margen inferior',
  width: 'Ancho del lienzo',
  height: 'Alto del lienzo',
};

const UTILITIES: Partial<Record<GridParam, string>> = {
  columns: 'grid-cols-ds-default',
  gutter: 'gap-ds-gutter-default',
  lateral: 'px-ds-space-canva-lateral',
  lateralWeb: 'px-ds-space-canva-lateral-web',
  top: 'pt-ds-space-canva-top',
  bottom: 'pb-ds-space-canva-bottom',
  width: 'w-ds-dimention-canva-width',
};

/** Diferencias entre los márgenes de la retícula fija de Figma y tokens.css. */
const MARGIN_GAPS = BREAKPOINTS.flatMap(({ bp, label }) =>
  (['lateral', 'top', 'bottom'] as const).flatMap((param) => {
    const figma = FIGMA.fixed[bp][param];
    const code = SPECS[bp][param];
    return figma === code ? [] : [{ label, param, figma, code }];
  }),
);

const MARGIN_NAMES = { lateral: 'Margen lateral', top: 'Margen superior', bottom: 'Margen inferior' } as const;

/** Casos de uso: bloques `[columna, span, fila]` sobre la retícula de cada breakpoint. */
const CASOS: { title: string; bp: (typeof BREAKPOINTS)[number]['bp']; rows: string; blocks: [number, number, number][] }[] = (() => {
  const third = (c: number) => c / 3;
  const half = (c: number) => c / 2;
  const portada = (c: number): [number, number, number][] => [
    [1, c, 1],
    [1, third(c), 2],
    [1 + third(c), third(c), 2],
    [1 + 2 * third(c), third(c), 2],
    [1, half(c), 3],
    [1 + half(c), half(c), 3],
  ];
  const central = (c: number): [number, number, number][] => [
    [1, third(c), 1],
    [1 + third(c), third(c), 1],
    [1 + 2 * third(c), third(c), 1],
    [1, c, 2],
    [1, half(c), 3],
    [1 + half(c), half(c), 3],
  ];
  return [
    { title: 'Escritorio · portada', bp: 'desktop', rows: '2fr 1.4fr 1.4fr', blocks: portada(d.columns) },
    { title: 'Escritorio · bloque central', bp: 'desktop', rows: '1.2fr 2fr 1.4fr', blocks: central(d.columns) },
    { title: 'Tablet · portada', bp: 'tablet', rows: '2fr 1.4fr 1.4fr', blocks: portada(t.columns) },
    { title: 'Tablet · bloque central', bp: 'tablet', rows: '1.2fr 2fr 1.4fr', blocks: central(t.columns) },
    {
      title: 'Móvil · portada y mitades',
      bp: 'mobile',
      rows: '2fr 1.4fr 1.2fr',
      blocks: [
        [1, m.columns, 1],
        [1, m.columns, 2],
        [1, half(m.columns), 3],
        [1 + half(m.columns), half(m.columns), 3],
      ],
    },
    {
      title: 'Móvil · ancho completo',
      bp: 'mobile',
      rows: '1.6fr 2fr 1fr',
      blocks: [
        [1, m.columns, 1],
        [1, m.columns, 2],
        [1, m.columns, 3],
      ],
    },
  ];
})();

/** Retícula que entra con zoom: ventana, zoom, ancho en px CSS y el breakpoint resultante. */
const ZOOM_ROWS = [
  { window: 1440, zoom: 100 },
  { window: 1440, zoom: 200 },
  { window: 1440, zoom: 400 },
  { window: 1280, zoom: 400 },
].map((r) => {
  const css = (r.window * 100) / r.zoom;
  const bp = breakpointAt(css);
  const label = BREAKPOINTS.find((b) => b.bp === bp)!.label;
  return { ...r, css, bp, label, content: css - SPECS[bp].lateral * 2 };
});

const TAILWIND_EJEMPLO = [
  '<main className="px-ds-space-canva-lateral',
  '  pt-ds-space-canva-top pb-ds-space-canva-bottom">',
  '  <div className="grid grid-cols-ds-default',
  '    gap-ds-gutter-default">',
  '    <section className="col-span-full">…</section>',
  '    <article className="col-span-full',
  `      tablet:col-span-${t.columns / 3} desktop:col-span-${d.columns / 3}">`,
  '      …',
  '    </article>',
  '  </div>',
  '</main>',
].join('\n');

const CSS_EJEMPLO = [
  '.pagina {',
  `  /* Margen lateral: ${serie('lateral')} */`,
  '  padding-inline:',
  '    var(--ds-responsive-space-canva-lateral);',
  '  padding-block:',
  '    var(--ds-responsive-space-canva-top)',
  '    var(--ds-responsive-space-canva-bottom);',
  '}',
  '',
  '.reticula {',
  '  display: grid;',
  `  /* ${serie('columns').replace(' px', '')} columnas */`,
  '  grid-template-columns: repeat(',
  '    var(--ds-responsive-column-default),',
  '    minmax(0, 1fr)',
  '  );',
  '  gap: var(--ds-responsive-gutter-default);',
  '}',
].join('\n');

// ───────────────────────── contenido ─────────────────────────

export const doc: FoundationDocContent = {
  name: 'Retículas',
  icon: 'grid',
  summary: `Columnas, canal y márgenes que ordenan cada pantalla: ${m.columns}, ${t.columns} y ${d.columns} columnas según el breakpoint, con sus valores en tokens responsive.`,
  definition: [
    {
      title: 'Definición y propósito',
      description:
        'La retícula es la estructura que organiza los elementos visuales en pantalla. Da un maquetado consistente, proporcional y adaptable en todos los dispositivos.',
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Retícula base',
              content: `Columnas, canal y márgenes. Sus valores cambian con el breakpoint y están en tokens responsive: ${m.columns} columnas en móvil, ${t.columns} en tablet y ${d.columns} en escritorio.`,
            },
            {
              title: 'Retícula secundaria',
              content: 'Un panel que convive con la retícula base, como un menú principal. Se despliega y se pliega. Sus medidas todavía no tienen token.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Tipos de retícula',
          minWidth: 720,
          columns: [
            { header: 'Tipo', width: 220 },
            { header: 'Margen lateral', width: 420 },
            { header: 'Úsala en', width: 380 },
          ],
          rows: [
            ['Fija', lines(`Un valor por breakpoint: ${serie('lateral')}.`, tk(GRID_VARS.lateral)), 'Aplicaciones web y móviles.'],
            ['Variable', lines(`Más amplio en escritorio: ${serie('lateralWeb')}.`, tk(GRID_VARS.lateralWeb)), 'Sitios web y landing pages.'],
            ['Con función secundaria', 'El de la retícula fija, junto al panel secundario.', 'Vistas con un menú o un panel que se despliega junto al contenido.'],
          ],
        },
      ],
    },
    {
      title: 'Pantallas',
      description: 'Cuatro formatos estándar para prototipos e interfaces. Los tres primeros son los lienzos de tokens.css; el de 1920 px solo está en Figma.',
      blocks: [
        { type: 'cards', items: [{ preview: <PantallasAEscala /> }] },
        {
          type: 'table',
          caption: 'Pantallas y breakpoints',
          minWidth: 720,
          columns: [
            { header: 'Formato', width: 200 },
            { header: 'Lienzo', width: 260 },
            { header: 'Breakpoint', width: 260 },
            { header: 'Rango en código', width: 300 },
          ],
          rows: [
            ...BREAKPOINTS_ASC.map(({ bp, screen }) => [
              screen,
              `${SPECS[bp].width} × ${SPECS[bp].height} px`,
              bp === 'mobile' ? lines(<code key="b">{bp}</code>, 'Base, sin media query') : lines(<code key="b">{bp}</code>, <code key="r">{`--breakpoint-${bp}: ${breakpointRem(bp)}`}</code>),
              breakpointRange(bp),
            ]),
            [
              'Escritorio amplio',
              lines(`${FIGMA.screens.wide.width} × ${FIGMA.screens.wide.height} px`, 'Solo en Figma, sin token'),
              <code key="b">desktop</code>,
              'Toma los valores de desktop.',
            ],
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Cortes distintos en Figma y en código',
          content: `La documentación de Figma corta en ${FIGMA.breakpoints.tablet} y ${FIGMA.breakpoints.desktop} px y nombra una tablet de ${FIGMA.screens.tabletText} px. tokens.css corta en ${breakpointStart('tablet')} y ${breakpointStart('desktop')} px. La página usa los valores del código.`,
        },
      ],
    },
    {
      title: 'Estructura de la retícula',
      description: 'Tres parámetros: columnas, canal y márgenes. Dan consistencia a la interfaz y adaptan el contenido a cada pantalla.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              preview: <EstructuraReticula />,
              footer: `Retícula de escritorio con los valores de tokens.css: ${d.columns} columnas, canal de ${pxText(d.gutter)} y margen lateral de ${pxText(d.lateral)}.`,
            },
          ],
        },
        {
          type: 'table',
          caption: 'Parámetros de la retícula',
          minWidth: 720,
          columns: [
            { header: 'Parámetro', width: 220 },
            { header: 'Qué es', width: 480 },
            { header: 'Variable', width: 340 },
          ],
          rows: [
            ['Columnas', 'Divisiones verticales donde se alinea el contenido. Un bloque ocupa un número entero de columnas.', tk(GRID_VARS.columns)],
            [
              'Canal',
              sameGutter ? `Espacio entre columnas. Mide ${pxText(d.gutter)} en todos los breakpoints.` : `Espacio entre columnas: ${serie('gutter')}.`,
              tk(GRID_VARS.gutter),
            ],
            ['Margen lateral', 'Espacio entre el borde de la pantalla y la primera o la última columna.', lines(tk(GRID_VARS.lateral), tk(GRID_VARS.lateralWeb))],
            [
              'Margen superior e inferior',
              'Espacio entre la barra de navegación y el contenido, y entre el contenido y el pie de página.',
              lines(tk(GRID_VARS.top), tk(GRID_VARS.bottom)),
            ],
          ],
        },
        {
          type: 'text',
          content: `La base es la de Bootstrap: una guía de ${d.columns} columnas que se divide en ${t.columns} en tablet y en ${m.columns} en móvil.`,
        },
      ],
    },
    {
      title: 'Tipos de retícula',
      description: 'Fija para aplicaciones, variable para sitios web y con función secundaria cuando un panel convive con el contenido.',
      blocks: [
        subTitle('Retícula fija'),
        {
          type: 'text',
          content: `El margen lateral es el del sistema en cada breakpoint: ${serie('lateral')}. A 1920 px se mantienen los valores de escritorio y las columnas se estiran.`,
        },
        { type: 'cards', items: [{ preview: <TipoReticula margin="lateral" /> }] },
        subTitle('Retícula variable'),
        {
          type: 'text',
          content: `El margen lateral crece con la pantalla: ${serie('lateralWeb')} en tokens.css. En Figma, desde 1920 px la guía pasa a Center: el contenido conserva su ancho y los márgenes crecen.`,
        },
        { type: 'cards', items: [{ preview: <TipoReticula margin="lateralWeb" /> }] },
        {
          type: 'note',
          tone: 'alert',
          title: 'Guía central sin equivalente en código',
          content: `tokens.css no define un ancho máximo de contenido. A 1920 px, la retícula variable usa el margen de escritorio (${pxText(d.lateralWeb)}) y las columnas se estiran.`,
        },
        subTitle('Retícula con función secundaria'),
        {
          type: 'text',
          content:
            'Dos estructuras en la misma pantalla: la retícula base y una secundaria, como un menú principal. La base se alinea a la derecha del panel y conserva los márgenes de la retícula fija.',
        },
        {
          type: 'cards',
          items: [
            {
              preview: <TipoSecundaria />,
              columns: [
                {
                  title: 'Móvil',
                  content: `La secundaria ocupa la pantalla completa y va sobre la base, como un menú principal. Plegada, queda arriba con ${FIGMA.secondary.mobile.closedSize} px de alto.`,
                },
                {
                  title: 'Tablet y escritorio',
                  content: `La base va de ${t.columns} a ${d.columns} columnas. La secundaria mide ${FIGMA.secondary.tablet.openSize} px en tablet y ${FIGMA.secondary.desktop.openSize} px en escritorio; plegada, ${FIGMA.secondary.tablet.closedSize} y ${FIGMA.secondary.desktop.closedSize} px. En tablet puede ir sobre la base, como una columna plegable.`,
                },
              ],
            },
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Medidas sin token',
          content: 'Las medidas del panel secundario solo están en Figma. tokens.css no las tiene: usa estos valores hasta que diseño defina sus variables.',
        },
      ],
    },
    {
      title: 'Márgenes laterales',
      description: 'Separan el contenido de los bordes de la pantalla. Son fijos en aplicaciones y variables en sitios web.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Fijos',
              content: lines(<>Aplicaciones web y móviles: {serie('lateral')}.</>, tk(GRID_VARS.lateral)),
              preview: <MargenesLaterales margin="lateral" />,
            },
            {
              title: 'Variables',
              content: lines(<>Sitios web y landing pages: {serie('lateralWeb')}.</>, tk(GRID_VARS.lateralWeb)),
              preview: <MargenesLaterales margin="lateralWeb" />,
            },
          ],
        },
      ],
    },
    {
      title: 'Márgenes superior e inferior',
      description: 'Un valor por breakpoint para todos los productos, con retícula fija o variable.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              content: [
                <>
                  El margen superior va después de la barra de navegación: {serie('top')} ({tk(GRID_VARS.top)}).
                </>,
                <>
                  El margen inferior va antes del pie de página: {serie('bottom')} ({tk(GRID_VARS.bottom)}).
                </>,
              ],
              preview: <MargenesVerticales />,
            },
          ],
        },
      ],
    },
    {
      title: 'Variables / Responsive',
      description: `${Object.keys(GRID_VARS).length} variables con un valor por breakpoint, más dos cortes en @theme. Mobile es la base; Tablet empieza en ${breakpointStart('tablet')} px y Desktop en ${breakpointStart('desktop')} px.`,
      blocks: [
        {
          type: 'table',
          caption: 'Variables de la retícula por breakpoint',
          minWidth: 880,
          columns: [{ header: 'Variable', width: 400 }, ...BREAKPOINTS.map(({ label }) => ({ header: label, width: 200 }))],
          rows: (Object.entries(GRID_VARS) as [GridParam, string][]).map(([param, variable]) => [
            lines(PARAM_LABELS[param], tk(variable)),
            ...BREAKPOINTS.map(({ bp }) => valueCell(variable, param, bp)),
          ]),
        },
        {
          type: 'table',
          caption: 'Cortes de breakpoint',
          columns: [
            { header: 'Variable', width: 360 },
            { header: 'Valor', width: 200 },
            { header: 'En px', width: 200 },
          ],
          rows: (['tablet', 'desktop'] as const).map((bp) => [<code key="v">--breakpoint-{bp}</code>, breakpointRem(bp), pxText(breakpointStart(bp))]),
        },
      ],
    },
  ],
  application: [
    {
      title: 'Composición en retículas',
      description: 'Cada contenedor ocupa un número entero de columnas según su función. Varios pueden convivir en la misma vista.',
      blocks: [
        {
          type: 'cards',
          items: [{ preview: <ComposicionColumnas />, footer: `Contenedores de 1 a ${d.columns} columnas sobre la retícula de escritorio.` }],
        },
      ],
    },
    {
      title: 'Casos de uso',
      description: `Composiciones sobre la retícula de cada breakpoint: ${d.columns} columnas en escritorio, ${t.columns} en tablet y ${m.columns} en móvil.`,
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: CASOS.map((c) => ({ title: c.title, preview: <CasoDeUso bp={c.bp} rows={c.rows} blocks={c.blocks} /> })),
        },
      ],
    },
    {
      title: 'Desktop / Tablet / Mobile',
      description: `Cada vista se dibuja con los valores responsive de su breakpoint. Tablet baja a ${t.columns} columnas y ${pxText(t.lateral)} de margen; Mobile, a ${m.columns} columnas y ${pxText(m.lateral)}.`,
      blocks: [
        { type: 'custom', content: <ReticulaPorBreakpoint /> },
        {
          type: 'table',
          caption: 'Columnas de cada bloque por breakpoint',
          minWidth: 640,
          columns: [{ header: 'Bloque', width: 300 }, ...BREAKPOINTS.map(({ label }) => ({ header: label, width: 220 }))],
          rows: COMPOSICION.map((b) => [b.name, ...BREAKPOINTS.map(({ bp }) => `${b.span(SPECS[bp].columns)} de ${SPECS[bp].columns}`)]),
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Pautas para alinear, dejar márgenes y reorganizar el contenido.',
      blocks: [
        subTitle('Alinear a las columnas'),
        {
          type: 'practices',
          items: [
            practice('do', 'Bloques en columnas', 'Empieza y termina cada bloque en una columna, con el canal entre bloques.', <MuestraAlineacion />),
            practice('dont', 'Anchos libres', 'No uses anchos ni sangrías fuera de las columnas: los bordes dejan de alinear.', <MuestraAlineacion free />),
          ],
        },
        subTitle('Respetar los márgenes'),
        {
          type: 'practices',
          items: [
            practice('do', 'Contenido dentro del margen', 'Deja el margen lateral del token entre el borde de la pantalla y el contenido.', <MuestraMargenes />),
            practice('dont', 'Contenido al borde', 'No pegues el contenido al borde: pierde aire y se confunde con el marco.', <MuestraMargenes edge />),
          ],
        },
        subTitle('Apilar en móvil'),
        {
          type: 'practices',
          items: [
            practice('do', 'Bloques apilados', `En móvil, apila los bloques a ${m.columns} columnas, en el orden de lectura.`, <MuestraApilado />),
            practice('dont', 'Columnas apretadas', 'No mantengas la fila de escritorio en móvil: el texto se parte y los bloques salen de la retícula.', <MuestraApilado squeezed />),
          ],
        },
      ],
    },
  ],
  accessibility: [
    {
      title: 'Accesibilidad / WCAG 2.2',
      description: 'La retícula decide cómo se reorganiza el contenido. Estos criterios aplican a toda pantalla que la use.',
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: 'Criterio propio',
          content: 'La documentación anterior no tenía esta pestaña. Los criterios salen de WCAG 2.2 y las cifras, de tokens.css. Revísalos con diseño.',
        },
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Reflow',
              figure: '320 px',
              content: 'Ancho en el que el contenido se lee sin scroll horizontal (1.4.10, AA). Equivale a 1280 px con zoom al 400%.',
            },
            {
              title: 'Cambio de tamaño',
              figure: '200%',
              content: 'Zoom sin perder contenido ni funciones (1.4.4, AA). Los bloques crecen en alto; no se recortan.',
            },
            {
              title: 'Ancho de línea',
              figure: '80',
              content: 'Caracteres por línea como máximo en lectura continua (1.4.8, AAA). Es una recomendación, no un requisito AA.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Criterios WCAG que aplican a la retícula',
          minWidth: 720,
          columns: [
            { header: 'Criterio', width: 340 },
            { header: 'Qué pide a la retícula', width: 700 },
          ],
          rows: [
            [
              '1.4.10 · Reflow (AA)',
              `A 320 px de ancho, el contenido cabe sin scroll horizontal. La retícula de móvil (${m.columns} columnas) lo cumple si ningún bloque tiene un ancho fijo mayor.`,
            ],
            ['1.4.4 · Cambio de tamaño del texto (AA)', 'Al 200%, el contenido se reorganiza con la retícula del breakpoint que entra. Evita altos fijos en bloques con texto.'],
            ['1.3.2 · Secuencia significativa (A)', 'El orden del código es el orden de lectura. Mover bloques con CSS no cambia lo que anuncia un lector de pantalla.'],
            ['2.4.3 · Orden del foco (A)', 'El foco recorre los bloques en el orden en que se ven, en cada breakpoint.'],
            ['1.4.8 · Presentación visual (AAA)', 'Líneas de 80 caracteres como máximo en lectura continua.'],
          ],
        },
      ],
    },
    {
      title: 'Reflow y zoom',
      description: 'Con zoom, la ventana mide menos px CSS y entra otro breakpoint. La retícula cambia sola.',
      blocks: [
        {
          type: 'table',
          caption: 'Retícula que se aplica con zoom',
          minWidth: 720,
          columns: [
            { header: 'Ventana y zoom', width: 260 },
            { header: 'Ancho en px CSS', width: 220 },
            { header: 'Retícula', width: 260 },
            { header: 'Ancho del contenido', width: 300 },
          ],
          rows: ZOOM_ROWS.map((r) => [
            `${r.window} px al ${r.zoom}%`,
            pxText(r.css),
            `${r.label}: ${SPECS[r.bp].columns} columnas`,
            `${pxText(r.content)} (margen fijo de ${pxText(SPECS[r.bp].lateral)})`,
          ]),
        },
        {
          type: 'text',
          content: `Al 200%, una ventana de escritorio ya usa la retícula de móvil. Diseña cada vista para que funcione con ${m.columns} columnas, no solo para el ancho en que se dibujó.`,
        },
      ],
    },
    {
      title: 'Orden de lectura y del foco',
      description: 'El orden visual sigue al código en todos los breakpoints.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              preview: <OrdenDeLectura />,
              footer: [
                'Escribe los bloques en el orden en que se leen y deja que la retícula los acomode: en fila en escritorio, apilados en móvil.',
                <>
                  Evita reordenar con <code>order</code>, <code>grid-row</code> o posiciones explícitas: el lector de pantalla y el foco siguen el código, no lo que
                  se ve.
                </>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Ancho de línea',
      description: `Con el lienzo de ${d.width} px, un bloque de ${d.columns} columnas mide ${pxText(spanWidth('desktop', d.columns))}: demasiado para leer de corrido.`,
      blocks: [
        {
          type: 'table',
          caption: 'Ancho de un bloque de texto en escritorio',
          minWidth: 640,
          columns: [
            { header: 'Columnas', width: 200 },
            { header: 'Ancho', width: 200 },
            { header: 'Úsalo para', width: 640 },
          ],
          rows: [
            [`${d.columns} columnas`, pxText(spanWidth('desktop', d.columns)), 'Tablas, galerías y contenido que no es texto corrido.'],
            ['8 columnas', pxText(spanWidth('desktop', 8)), 'Texto con una imagen o una tabla al lado.'],
            ['6 columnas', pxText(spanWidth('desktop', 6)), 'Lectura continua: artículos, instrucciones y formularios largos.'],
          ],
        },
      ],
    },
    {
      title: 'Criterios vs. evidencia',
      description: 'Esta página describe la retícula. No reemplaza una auditoría WCAG del producto.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Evidencia disponible',
              content:
                'Columnas, canal y márgenes salen de tokens.css. No hay pruebas de reflow, zoom ni orden del foco en las pantallas del producto: hazlas en cada vista.',
            },
          ],
        },
        {
          type: 'text',
          content: 'Lista de salida: sin scroll horizontal a 320 px · zoom al 200% sin pérdidas · orden de lectura y del foco igual al visual · líneas de 80 caracteres o menos.',
        },
      ],
    },
  ],
  development: [
    {
      title: 'Aplicar en Figma',
      description: 'Primero la guía de columnas con sus variables; después, el modo del frame.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Guía primero, modo después',
              steps: [
                {
                  title: 'Agrega una guía de columnas',
                  content: (
                    <>
                      En Layout guide, elige Columns de tipo Stretch y enlaza Count, Gutter y Margin a <code>column/default</code>, <code>gutter/default</code> y{' '}
                      <code>space/canva/lateral</code> (o <code>space/canva/lateral-web</code> en sitios web).
                    </>
                  ),
                },
                {
                  title: 'Configura el modo del frame',
                  content: 'Aplica el modo Desktop, Tablet o Mobile de la colección Responsive al frame. La guía toma las columnas, el canal y el margen de ese breakpoint.',
                },
                {
                  title: 'Ajusta los casos especiales',
                  content:
                    'Desde 1920 px en sitios web, cambia la guía a Center. Con retícula secundaria, alinea la base a la derecha (Right) y agrega una segunda guía a la izquierda con el ancho del panel.',
                },
              ],
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Guía central',
              content: 'Sitios web desde 1920 px: las columnas tienen ancho fijo y los márgenes absorben el resto.',
              preview: <GuiaCentral />,
            },
            {
              title: 'Retícula derecha',
              content: 'La base se alinea a la derecha y conserva sus márgenes. A su izquierda va el panel secundario.',
              preview: <GuiaDerecha />,
            },
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Valores solo de Figma',
          content: 'La guía central, la retícula derecha y el panel secundario no tienen tokens. Las medidas de estos dos dibujos son las de Figma.',
        },
      ],
    },
    {
      title: 'Consumo técnico',
      description: (
        <>
          Cada parámetro es una variable responsive (<code>--ds-responsive-…</code>) con su utilidad de Tailwind. El valor cambia solo con el breakpoint.
        </>
      ),
      blocks: [
        {
          type: 'table',
          caption: 'Variables y utilidades de la retícula',
          minWidth: 880,
          columns: [
            { header: 'Parámetro', width: 240 },
            { header: 'Variable', width: 440 },
            { header: 'Utilidad', width: 360 },
          ],
          rows: (Object.entries(UTILITIES) as [GridParam, string][]).map(([param, utility]) => [PARAM_LABELS[param], tk(GRID_VARS[param]), <code key="u">{utility}</code>]),
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Tailwind',
              content: (
                <>
                  Las variantes <code>tablet:</code> y <code>desktop:</code> usan los cortes de tokens.css; <code>mobile:</code> aplica por debajo de{' '}
                  {pxText(breakpointStart('tablet'))}.
                </>
              ),
              code: { label: 'Página con retícula en Tailwind', code: TAILWIND_EJEMPLO },
            },
            {
              title: 'CSS / variables',
              content: 'Las mismas variables, sin Tailwind. Los comentarios muestran el valor de cada breakpoint.',
              code: { label: 'Página con retícula en CSS', code: CSS_EJEMPLO },
            },
          ],
        },
        {
          type: 'text',
          content: (
            <>
              Header y ErrorPage ya toman el margen lateral de <code>px-ds-space-canva-lateral</code>. <code>npm run check:tokens</code> falla si usas una variable o una
              utilidad <code>ds-</code> que no existe.
            </>
          ),
        },
      ],
    },
    {
      title: 'Auditoría, supuestos y pendientes',
      description: 'Lo que se revisó en la documentación anterior de Figma y cómo queda en código.',
      blocks: [
        {
          type: 'table',
          caption: 'Auditoría de retículas',
          minWidth: 720,
          columns: [
            { header: 'Hallazgo', width: 340 },
            { header: 'Decisión o pendiente', width: 700 },
          ],
          rows: [
            [
              'Breakpoints',
              `Figma corta en ${FIGMA.breakpoints.tablet} y ${FIGMA.breakpoints.desktop} px; tokens.css, en ${breakpointStart('tablet')} y ${breakpointStart('desktop')} px (${breakpointRem('tablet')} y ${breakpointRem('desktop')}). Manda el código.`,
            ],
            [
              'Lienzos',
              `El texto de Figma da ${FIGMA.screens.tabletText} px a la tablet y sus frames miden ${FIGMA.screens.mobile.width} × ${FIGMA.screens.mobile.height} y ${FIGMA.screens.desktop.width} × ${FIGMA.screens.desktop.height}. tokens.css: ${m.width} × ${m.height}, ${t.width} × ${t.height} y ${d.width} × ${d.height} px.`,
            ],
            ...MARGIN_GAPS.map((g) => [`${MARGIN_NAMES[g.param]} en ${g.label}`, `Figma: ${pxText(g.figma)}; tokens.css: ${pxText(g.code)}. Manda el código; pendiente con diseño.`]),
            [
              'Margen lateral variable',
              `Figma define seis cortes (${FIGMA.variable.slice(0, -1).map((v) => v.lateral.replace(' px', '')).join(', ')} px y más). tokens.css tiene tres valores: ${serie('lateralWeb')}.`,
            ],
            ['Configuraciones de columnas', `El texto de Figma dice 4, 8 o 12 columnas; su tabla y tokens.css usan ${m.columns}, ${t.columns} y ${d.columns}.`],
            [
              'Casos de uso en tablet',
              `Figma dibuja los casos de tablet con 12 columnas; la página usa las ${t.columns} de tokens.css.`,
            ],
            [
              'Retícula secundaria',
              `Sin tokens. El texto de Figma pliega el panel de escritorio a ${FIGMA.secondary.desktop.closedSize} px; uno de sus frames lo pliega a 80 px.`,
            ],
            [
              'Retícula derecha y guía central',
              `Sin tokens ni ancho máximo de contenido en código. El panel de Figma da columnas de ${FIGMA.right.column} px; el frame de ${d.width} px usa 71 px. La tabla de dispositivos da 340 px de ancho en móvil, que no es ningún lienzo.`,
            ],
            [
              'Nombres en la tabla de Figma',
              <>
                La tabla de valores usa nombres como <code>margin.page.mobile</code>, que no existen. Las variables reales son <code>column/default</code>,{' '}
                <code>gutter/default</code>, <code>space/canva/lateral</code> y <code>space/canva/lateral-web</code>.
              </>,
            ],
          ],
        },
      ],
    },
  ],
};
