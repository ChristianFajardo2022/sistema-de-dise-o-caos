import type { DocInline, DocPractice } from '../../docs/types';
import type { FoundationBlock, FoundationDocContent } from '../_doc/foundationDoc.types';
import { ListaVinetas } from '../_doc/ListaVinetas';
import { px, rawToken } from '../_doc/tokensCss';
import { THEMES, THEME_LABELS, pairRatio, ratioText } from '../Colores/colorData';
import {
  BordeValor,
  ComposicionPorBreakpoint,
  MuestraAdaptabilidad,
  MuestraAltoContraste,
  MuestraAnilloFoco,
  MuestraCircular,
  MuestraConsistencia,
  MuestraCuadrada,
  MuestraDivisor,
  MuestraGrosores,
  MuestraLinea1px,
  MuestraLineas,
  MuestraObjetivo,
  MuestraPequenos,
  MuestraPildoras,
  MuestraRadioPrimitivo,
  MuestraRangoContenedor,
  MuestraSoloForma,
  MuestraTrazo,
  RadiosAnidados,
  TarjetaAnotada,
} from './FormasMuestras';
import {
  BORDERS,
  BREAKPOINTS_ASC,
  FAMILIES,
  FIGMA,
  NIVELES,
  RADII,
  RESPONSIVE,
  STROKES,
  VARS,
  borderUtilityOf,
  checked,
  primitiveOf,
  pxText,
  radiusAt,
  radiusPrimitiveUtilityOf,
  radiusUtilityOf,
  serie,
  shortName,
  strokeUtilityOf,
} from './formaData';
import type { RadiusFamily } from './formaData';

/*
 * Contenido de la página Formas (plantilla v2 de fundamentos, como Tipografía, Colores, Retículas y Contenedores y
 * espacios). Manda `src/styles/tokens.css`: los radios y los grosores salen de `formaData.ts`. El texto de Definición y
 * Aplicación viene de la documentación anterior de Figma, sin IDs, sin el nombre de la empresa y con voz y tono. Los
 * ejemplos del rubro se cambiaron por otros neutros. Accesibilidad y parte de Desarrollo son criterio propio: la
 * documentación anterior no los tenía. Degradado, glass y blur (y sus Do and Dont’s) son del fundamento Texturas.
 */

// Figma: 484:590 (página "Formas"; documentación anterior 2176:357: frames Formas 2176:358, Texturas 3055:1371, Valores de
// token 2176:649 y Espacios, que son los usos correctos e incorrectos, 2176:761)

// ───────────────────────── datos ─────────────────────────

const totalResponsive = FAMILIES.reduce((n, f) => n + RESPONSIVE[f.family].length, 0);

/** Nombre de una variable en `<code>`. Si no existe en tokens.css, lo dice en la consola. */
function tk(variable: string): DocInline {
  return <code>{checked(variable)}</code>;
}

/** Nombre corto de una variable responsive en `<code>` ("radius-container-on-canva"). */
function tkShort(variable: string): DocInline {
  return <code>{shortName(checked(variable))}</code>;
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

/** Subtítulo de un grupo de variables o de un par de Do and Dont’s (Heading-lg-600), como en Retículas. */
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

/** Valor de una variable responsive de radio en un breakpoint, con el primitivo al que apunta. */
function valueCell(variable: string, bp: (typeof BREAKPOINTS_ASC)[number]['bp']): DocInline {
  return lines(pxText(radiusAt(variable, bp)), <code key="p">{primitiveOf(variable, bp)}</code>);
}

/** Tabla de las variables responsive de radio de una familia, de Mobile a Desktop. */
function familyTable(family: RadiusFamily, caption: string): FoundationBlock {
  return {
    type: 'table',
    caption,
    minWidth: 760,
    columns: [{ header: 'Variable', width: 400 }, ...BREAKPOINTS_ASC.map(({ label }) => ({ header: label, width: 200 }))],
    rows: RESPONSIVE[family].map((v) => [tkShort(v), ...BREAKPOINTS_ASC.map(({ bp }) => valueCell(v, bp))]),
  };
}

/** Variables de radio que Tablet no comparte con Desktop. */
const TABLET_DISTINTO = Object.values(RESPONSIVE)
  .flat()
  .filter((v) => radiusAt(v, 'tablet') !== radiusAt(v, 'desktop'))
  .map((v) => `${shortName(v)} (${radiusAt(v, 'tablet')} y ${radiusAt(v, 'desktop')} px)`);

/** Variables de radio que cambian entre Mobile y Desktop. */
const CAMBIAN = Object.values(RESPONSIVE)
  .flat()
  .filter((v) => radiusAt(v, 'mobile') !== radiusAt(v, 'desktop'))
  .map(shortName);

/** Esquemas de Figma frente a los niveles que se dibujan: ¿coinciden? */
const NIVELES_MOBILE = NIVELES.mobile.map((n) => radiusAt(n.token, 'mobile'));
const NIVELES_DESKTOP = NIVELES.desktop.map((n) => radiusAt(n.token, 'desktop'));
const FIGMA_NIVELES_IGUALES =
  NIVELES_MOBILE.join() === FIGMA.mobileNested.join() && NIVELES_DESKTOP.join() === FIGMA.desktopNested.join();

// ───────────────────────── contraste de bordes ─────────────────────────

const SURFACE = '--color-ds-background-container-surface';
const ON_CANVA = '--color-ds-background-container-default-on-canva';

/** Pares borde/fondo que se miden. `solo`: el borde es la única señal que delimita el control. */
const BORDE_PAIRS: { label: string; fg: string; bg: string; solo?: boolean }[] = [
  { label: 'Borde del campo en reposo', fg: '--color-ds-border-field-default', bg: SURFACE, solo: true },
  { label: 'Borde del campo sobre una tarjeta del lienzo', fg: '--color-ds-border-field-default', bg: ON_CANVA, solo: true },
  { label: 'Borde del campo activo y anillo de foco', fg: '--color-ds-border-field-active', bg: SURFACE },
  { label: 'Borde de un campo con error', fg: '--color-ds-border-semantic-error', bg: SURFACE },
  { label: 'Borde del botón secundario, contraste bajo', fg: '--color-ds-border-button-secondary-low-default', bg: SURFACE },
  { label: 'Borde del botón secundario, contraste alto', fg: '--color-ds-border-button-secondary-high-default', bg: SURFACE },
  { label: 'Borde del chip', fg: '--color-ds-border-general-gray-fourth', bg: SURFACE },
  { label: 'Borde de una tarjeta', fg: '--color-ds-border-general-default-on-card', bg: SURFACE },
];

const tokenName = (variable: string) => variable.replace(/^--color-ds-/, '');

/** Pares con un borde que es la única señal del control y no llega a 3:1 en algún modo. */
const BORDE_BAJOS = BORDE_PAIRS.filter((p) => p.solo).flatMap((p) =>
  THEMES.flatMap((theme) => {
    const ratio = pairRatio(p.fg, p.bg, theme);
    return ratio !== undefined && ratio < 3 ? [{ ...p, theme, ratio }] : [];
  }),
);

// ───────────────────────── tamaños de objetivo ─────────────────────────

const MIN_OBJETIVO = 24;
/** Avatar: tamaño leído de tokens.css. */
const avatarPx = (size: string) => px(`--ds-responsive-dimention-avatar-${size}`);

// ───────────────────────── código de ejemplo ─────────────────────────

const TAILWIND_EJEMPLO = [
  '<section className="rounded-ds-radius-container-on-canva',
  '  bg-ds-background-container-default-on-canva',
  '  p-ds-space-container-on-canva">',
  '  <article className="rounded-ds-radius-container-on-card',
  '    border-ds-border-general-md border-solid',
  '    border-ds-border-general-default-on-card',
  '    bg-ds-background-container-surface',
  '    p-ds-space-container-on-card">',
  '    <div className="rounded-ds-radius-general-lg">',
  '      …',
  '    </div>',
  '    <button className="rounded-ds-radius-button-full">',
  '      Guardar',
  '    </button>',
  '  </article>',
  '</section>',
].join('\n');

const CSS_EJEMPLO = [
  '.seccion {',
  `  /* Radio sobre el lienzo: ${serie(VARS.onCanva)} */`,
  '  border-radius:',
  '    var(--ds-responsive-radius-container-on-canva);',
  '}',
  '',
  '.tarjeta {',
  `  /* Radio sobre una tarjeta: ${serie(VARS.onCard)} */`,
  '  border-radius:',
  '    var(--ds-responsive-radius-container-on-card);',
  '  /* Línea de 1 px */',
  '  border: var(--ds-responsive-border-general-md) solid',
  '    var(--color-ds-border-general-default-on-card);',
  '}',
  '',
  '.pildora {',
  `  /* Píldora: ${serie(VARS.buttonFull)} */`,
  '  border-radius:',
  '    var(--ds-responsive-radius-button-full);',
  '}',
].join('\n');

const TRAZO_FINO = [
  '/* Chrome redondea border-width a px enteros: 0,5 y 1,5 px salen como 1 px. */',
  '.chip {',
  '  box-shadow: inset 0 0 0 var(--ds-primitives-stroke-dm)',
  '    var(--color-ds-border-general-gray-fourth);',
  '}',
].join('\n');

const COLORES_FORZADOS = [
  '/* Un borde transparente se ve en colores forzados. */',
  '.control {',
  '  border: 1px solid transparent;',
  '  outline: 2px solid transparent;',
  '}',
  '',
  '@media (forced-colors: active) {',
  '  .control {',
  '    border-color: ButtonText;',
  '  }',
  '}',
].join('\n');

const FOCO = [
  '.control:focus-visible {',
  '  outline: 2px solid var(--color-ds-border-field-active);',
  '  outline-offset: 2px; /* el anillo sigue el border-radius del control */',
  '}',
].join('\n');

/** Utilidades de la tabla de Desarrollo: uso, variable y utilidad de Tailwind. */
const UTILIDADES_RADIO: [string, string][] = [
  ['Contenedor madre, sobre el lienzo', VARS.onCanva],
  ['Contenedor secundario, sobre una tarjeta', VARS.onCard],
  ['Elemento de 16 px', VARS.general('xl')],
  ['Elemento de 12 px', VARS.general('lg')],
  ['Elemento de 8 px', VARS.general('md')],
  ['Campo de texto', VARS.field('md')],
  ['Campo pequeño', VARS.field('sm')],
  ['Píldora: botón, etiqueta y chip', VARS.buttonFull],
  ['Parte superior de un modal', VARS.modalTop],
];

/** Utilidad de radio de una variable; avisa en la consola si `@theme` no la expone. */
function utilidadRadio(variable: string): DocInline {
  const name = radiusUtilityOf(variable);
  if (!name) console.error(`Formas: ${variable} no tiene utilidad de radio en @theme`);
  const shown = variable === VARS.modalTop && name ? name.replace('rounded-', 'rounded-t-') : name;
  return <code>{shown ?? '?'}</code>;
}

/** Utilidad de ancho de borde; avisa en la consola si tokens.css no la define. */
function utilidadBorde(name: string | undefined, label: string): DocInline {
  if (!name) console.error(`Formas: ${label} no tiene utilidad de ancho de borde`);
  return <code>{name ?? '?'}</code>;
}

// ───────────────────────── contenido ─────────────────────────

export const doc: FoundationDocContent = {
  name: 'Formas',
  icon: 'scan',
  summary: `Cómo se construyen los contenedores: formas cuadradas y circulares que varían por tamaño, radio de borde y grosor de línea. ${RADII.length} radios primitivos, ${totalResponsive} responsive y ${STROKES.length} grosores de línea.`,
  definition: [
    {
      title: 'Definición y propósito',
      description: 'La interfaz se compone de formas cuadradas y circulares que se usan como contenedores en todo el sistema de diseño.',
      blocks: [
        {
          type: 'text',
          content: 'Según su función, una forma puede variar en tres propiedades.',
        },
        {
          type: 'cards',
          columns: 3,
          items: [
            { title: 'Tamaño', content: <>Alto y ancho de la forma (<code>dimensions</code> en Figma).</> },
            { title: 'Radio de borde', content: <>Redondeo de las esquinas (<code>border-radius</code>).</> },
            { title: 'Grosor de línea', content: <>Ancho del trazo que delimita el contenedor (<code>stroke</code> en Figma).</> },
          ],
        },
        {
          type: 'table',
          caption: 'Propiedades de una forma y sus variables',
          minWidth: 720,
          columns: [
            { header: 'Propiedad', width: 220 },
            { header: 'Qué controla', width: 400 },
            { header: 'Variables', width: 420 },
          ],
          rows: [
            ['Tamaño', 'Alto y ancho de la forma.', <code key="d">dimention-*</code>],
            ['Radio de borde', 'Redondeo de las esquinas, según el nivel y el tamaño del contenedor.', lines(<code key="r1">radius-*</code>, <code key="r2">responsive-radius-*</code>)],
            ['Grosor de línea', 'Ancho del trazo de bordes y divisores.', lines(<code key="s1">stroke-*</code>, <code key="s2">responsive-border-*</code>)],
          ],
        },
      ],
    },
    {
      title: 'Formas',
      description: 'Los contenedores son cuadrados o circulares. Los cuadrados llevan radio de borde; los circulares escalan sin perder la proporción.',
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Cuadrada',
              content: 'Los contenedores cuadrados deben incluir radio de borde. Este varía según su tamaño y su función en la interfaz.',
              preview: <MuestraCuadrada />,
            },
            {
              title: 'Circular',
              content: 'Las formas circulares ajustan su tamaño (alto y ancho) y mantienen siempre su proporción.',
              preview: <MuestraCircular />,
            },
          ],
        },
      ],
    },
    {
      title: 'Radio de borde',
      description: 'El radio de borde da consistencia a la interfaz y suaviza las esquinas de los contenedores.',
      blocks: [
        {
          type: 'text',
          content: (
            <>
              En contenedores anidados, <strong>el radio disminuye con la profundidad de la jerarquía</strong>. Cada nivel lleva el radio de su token.
            </>
          ),
        },
        {
          type: 'cards',
          items: [
            {
              preview: <RadiosAnidados />,
              footer: `Cuatro niveles anidados. Móvil: ${NIVELES_MOBILE.join(', ')} px. Escritorio: ${NIVELES_DESKTOP.join(', ')} px. Los valores salen de los tokens de cada nivel.`,
            },
          ],
        },
        {
          type: 'table',
          caption: 'Radio de cada nivel por breakpoint',
          minWidth: 760,
          columns: [
            { header: 'Nivel', width: 280 },
            { header: 'Variable', width: 320 },
            { header: 'Móvil', width: 220 },
            { header: 'Escritorio', width: 220 },
          ],
          rows: NIVELES.mobile.map((m, i) => [
            m.name,
            NIVELES.desktop[i].token === m.token ? tkShort(m.token) : lines(<span key="m">Móvil: {tkShort(m.token)}</span>, <span key="d">Escritorio: {tkShort(NIVELES.desktop[i].token)}</span>),
            pxText(radiusAt(m.token, 'mobile')),
            pxText(radiusAt(NIVELES.desktop[i].token, 'desktop')),
          ]),
        },
        {
          type: 'text',
          content: `La escala completa es de ${RADII.length} radios, de ${RADII[0].value} a ${RADII[RADII.length - 1].value} px. El 48 px se reserva para casos específicos: los elementos totalmente redondeados.`,
        },
      ],
    },
    {
      title: 'Rangos de radio',
      description: 'Cada rango se aplica según la posición del contenedor en la jerarquía y su tamaño.',
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: `${radiusAt(VARS.onCanva, 'mobile')} - ${radiusAt(VARS.onCanva, 'desktop')} px`,
              content: 'Se aplica a los contenedores principales (contenedores madre). Permite que convivan contenedores anidados.',
              preview: <MuestraRangoContenedor token={VARS.onCanva} className="h-24 w-40" />,
            },
            {
              title: `${radiusAt(VARS.onCard, 'mobile')} - ${radiusAt(VARS.onCard, 'desktop')} px`,
              content: 'Se aplica a los contenedores secundarios dentro de un contenedor principal.',
              preview: <MuestraRangoContenedor token={VARS.onCard} className="h-20 w-32" />,
            },
            {
              title: `${radiusAt(VARS.general('md'), 'mobile')} - ${radiusAt(VARS.general('lg'), 'mobile')} px`,
              content: (
                <>
                  Se aplica según el tamaño del contenedor: de 40 a 70 px lleva {radiusAt(VARS.general('lg'), 'mobile')} px; de menos de 40 px, {radiusAt(VARS.general('md'), 'mobile')} px.
                </>
              ),
              preview: <MuestraPequenos />,
            },
            {
              title: `${radiusAt(VARS.full, 'mobile')} px`,
              content: 'Uso exclusivo en elementos totalmente redondeados, como botones, etiquetas y chips.',
              preview: <MuestraPildoras />,
            },
          ],
        },
        {
          type: 'table',
          caption: 'Rangos de radio y sus variables',
          minWidth: 760,
          columns: [
            { header: 'Rango', width: 200 },
            { header: 'Se aplica a', width: 400 },
            { header: 'Variables', width: 440 },
          ],
          rows: [
            ['24 a 32 px', 'Contenedores madre', tkShort(VARS.onCanva)],
            ['16 a 24 px', 'Contenedores secundarios', tkShort(VARS.onCard)],
            ['8 y 12 px', 'Contenedores pequeños', lines(tkShort(VARS.general('md')), tkShort(VARS.general('lg')))],
            ['48 px', 'Botones, etiquetas y chips', lines(tkShort(VARS.buttonFull), tkShort(VARS.full))],
          ],
        },
      ],
    },
    {
      title: 'Valores de línea',
      description: 'Las líneas delimitan contenedores y ayudan a establecer jerarquías visuales.',
      blocks: [
        {
          type: 'text',
          content: (
            <>
              Se definen dos valores principales: <strong>1 px</strong> y <strong>de 2 a 3 px</strong>.
            </>
          ),
        },
        { type: 'cards', items: [{ preview: <MuestraGrosores />, footer: 'Comparación de 1, 2 y 3 px.' }] },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Línea de 1 px',
              content: 'Uso principal en:',
              preview: <ListaVinetas items={['Contenedores estructurales.', 'Formularios.', 'Tablas.', 'Tarjetas.', 'Modales.', 'Botones.']} />,
            },
            {
              title: 'Línea de 2 a 3 px',
              content: 'Uso en divisores de sección, según la necesidad visual.',
            },
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Los grosores de 2 y 3 px no tienen token',
          content: `tokens.css define grosores de ${STROKES[0].value} a ${String(STROKES[STROKES.length - 1].value).replace('.', ',')} px (${STROKES.map((s) => String(s.value).replace('.', ',')).join(', ')}). La línea de 1 px es stroke-lg y su responsive, border-general-md. Hasta que existan los tokens, un divisor de 2 o 3 px es una medida suelta.`,
        },
      ],
    },
    {
      title: 'Variables / Radios y líneas',
      description: `${RADII.length} radios primitivos, ${totalResponsive} responsive de radio y ${STROKES.length} grosores de línea. Las variables responsive cambian con el breakpoint: Mobile es la base y Tablet y Desktop la reemplazan.`,
      blocks: [
        subTitle('Radios primitivos'),
        {
          type: 'table',
          caption: 'Radios primitivos',
          minWidth: 720,
          columns: [
            { header: 'Variable', width: 360 },
            { header: 'Valor', width: 140 },
            { header: 'Muestra', width: 160 },
            { header: 'Utilidad', width: 380 },
          ],
          rows: RADII.map((r) => [
            <code key="v">{r.variable}</code>,
            pxText(r.value),
            <MuestraRadioPrimitivo key="m" value={r.value} />,
            <code key="u">{radiusPrimitiveUtilityOf(r.key) ?? '?'}</code>,
          ]),
        },
        ...FAMILIES.flatMap((f) => [subTitle(`Radios responsive: ${f.title.toLowerCase()}`), familyTable(f.family, f.caption)]),
        subTitle('Grosores de línea primitivos'),
        {
          type: 'table',
          caption: 'Grosores de línea primitivos',
          minWidth: 720,
          columns: [
            { header: 'Variable', width: 360 },
            { header: 'Valor', width: 140 },
            { header: 'Muestra', width: 160 },
            { header: 'Utilidad', width: 380 },
          ],
          rows: STROKES.map((s) => [
            <code key="v">{s.variable}</code>,
            pxText(s.value),
            s.value > 0 ? <MuestraTrazo key="m" width={s.value} /> : 'Sin trazo',
            <code key="u">{strokeUtilityOf(s.key) ?? '?'}</code>,
          ]),
        },
        subTitle('Bordes responsive'),
        {
          type: 'table',
          caption: 'Bordes responsive',
          minWidth: 720,
          columns: [
            { header: 'Variable', width: 400 },
            { header: 'Apunta a', width: 260 },
            { header: 'Valor', width: 140 },
            { header: 'Utilidad', width: 240 },
          ],
          rows: BORDERS.map((b) => [
            tkShort(b),
            <code key="p">{primitiveOf(b, 'mobile')}</code>,
            pxText(px(b)),
            <code key="u">{borderUtilityOf(b) ?? '?'}</code>,
          ]),
        },
      ],
    },
  ],
  application: [
    {
      title: 'Radio según el contenedor',
      description: 'El radio de un elemento depende del nivel del contenedor en que está. Cada nivel baja un paso.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              preview: <TarjetaAnotada />,
              footer: 'La misma tarjeta con el radio de cada nivel en Desktop (en móvil, los niveles 3 y 4 bajan un paso, como muestra la tabla): 1 lienzo, 2 tarjeta, 3 bloque interno y 4 elemento pequeño. Los botones y las etiquetas son píldoras.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Radio de cada nivel de la tarjeta por breakpoint',
          minWidth: 760,
          columns: [{ header: 'Nivel', width: 300 }, ...BREAKPOINTS_ASC.map(({ label }) => ({ header: label, width: 140 })), { header: 'Variable', width: 360 }],
          rows: [
            ...NIVELES.mobile.map((m, i) => {
              const d = NIVELES.desktop[i];
              return [
                `${i + 1} · ${m.name}`,
                pxText(radiusAt(m.token, 'mobile')),
                pxText(radiusAt(d.token, 'tablet')),
                pxText(radiusAt(d.token, 'desktop')),
                d.token === m.token ? tkShort(m.token) : lines(<span key="m">Móvil: {tkShort(m.token)}</span>, <span key="d">Tablet y Desktop: {tkShort(d.token)}</span>),
              ];
            }),
            ['Botones y etiquetas', ...BREAKPOINTS_ASC.map(({ bp }) => pxText(radiusAt(VARS.buttonFull, bp))), tkShort(VARS.buttonFull)],
          ],
        },
      ],
    },
    {
      title: 'Líneas en contexto',
      description: 'La línea de 1 px delimita campos, tablas y tarjetas. La de 2 a 3 px separa secciones.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Línea de 1 px',
              content: 'Delimita los campos, la tarjeta y los botones secundarios de un formulario.',
              preview: <MuestraLinea1px />,
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Línea de 2 a 3 px',
              content: 'Separa dos secciones de una misma tarjeta. Úsala solo cuando el espacio no basta para separarlas.',
              preview: <MuestraDivisor />,
            },
          ],
        },
      ],
    },
    {
      title: 'Desktop / Tablet / Mobile',
      description: `Cada vista se dibuja con los radios de su breakpoint. Tablet comparte los radios de Desktop${TABLET_DISTINTO.length ? ` salvo ${TABLET_DISTINTO.join(' y ')}` : ''}.`,
      blocks: [
        { type: 'custom', content: <ComposicionPorBreakpoint /> },
        {
          type: 'table',
          caption: 'Radios de la composición por breakpoint',
          minWidth: 760,
          columns: [{ header: 'Elemento', width: 400 }, ...BREAKPOINTS_ASC.map(({ label }) => ({ header: label, width: 200 }))],
          rows: [
            ['Contenedor sobre el lienzo', VARS.onCanva],
            ['Tarjeta', VARS.onCard],
            ['Bloque interno', VARS.general('lg')],
            ['Botón y etiqueta', VARS.buttonFull],
          ].map(([label, variable]) => [label, ...BREAKPOINTS_ASC.map(({ bp }) => pxText(radiusAt(variable, bp)))]),
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Solo algunos radios cambian con el breakpoint',
          content: `Cambian entre Mobile y Desktop: ${CAMBIAN.join(', ')}. Los general-* no cambian. Para un elemento interno más grande en Desktop, elige el general del paso siguiente.`,
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Pautas para aplicar el radio de borde y las líneas al construir componentes.',
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: 'Criterio propio',
          content: 'Consistencia visual y Adaptabilidad vienen de la documentación anterior. Líneas es criterio propio: revísalo con diseño.',
        },
        subTitle('Consistencia visual'),
        {
          type: 'text',
          content: 'Mantén una jerarquía clara en los radios de borde para que haya armonía entre contenedores.',
        },
        {
          type: 'practices',
          items: [
            practice(
              'do',
              'Un radio menor por nivel',
              `La tarjeta baja el radio con cada nivel de anidación: ${radiusAt(VARS.onCanva, 'mobile')}, ${radiusAt(VARS.onCard, 'mobile')} y ${radiusAt(VARS.general('lg'), 'mobile')} px.`,
              <MuestraConsistencia good />,
            ),
            practice(
              'dont',
              'El mismo radio en todos los niveles',
              `El contenedor padre y el hijo tienen el mismo valor (${radiusAt(VARS.onCard, 'mobile')} px): se rompe la armonía.`,
              <MuestraConsistencia good={false} />,
            ),
          ],
        },
        subTitle('Adaptabilidad'),
        {
          type: 'text',
          content: 'Ajusta los valores de borde al dispositivo para mantener la proporción visual.',
        },
        {
          type: 'practices',
          items: [
            practice(
              'do',
              'Radios por dispositivo',
              `Móvil y escritorio adaptan los radios de forma proporcional: la tarjeta pasa de ${radiusAt(VARS.onCanva, 'mobile')} a ${radiusAt(VARS.onCanva, 'desktop')} px.`,
              <MuestraAdaptabilidad good />,
            ),
            practice('dont', 'Los mismos radios en todo', 'Escritorio repite los valores de móvil: la tarjeta pierde proporción y legibilidad.', <MuestraAdaptabilidad good={false} />),
          ],
        },
        subTitle('Líneas'),
        {
          type: 'text',
          content: 'Usa la línea de 1 px para delimitar y deja que el espacio y el color marquen la jerarquía.',
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Línea de 1 px y jerarquía por espacio', 'Las líneas delimitan; el tamaño del texto y el espacio entre bloques ordenan la información.', <MuestraLineas good />),
            practice('dont', 'Líneas gruesas en todo', 'Subir el grosor a 3 px en cada contenedor no jerarquiza: recarga la pantalla y quita peso a lo importante.', <MuestraLineas good={false} />),
          ],
        },
      ],
    },
  ],
  accessibility: [
    {
      title: 'Accesibilidad / WCAG 2.2',
      description: 'Una forma debe verse, entenderse y poder enfocarse. Estos criterios aplican a los bordes, los radios y las líneas de todo control.',
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: 'Criterio propio',
          content: 'La documentación anterior no tenía esta pestaña. Los criterios salen de WCAG 2.2; las cifras, de tokens.css y de los componentes. Revísalos con diseño.',
        },
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Borde de un control',
              figure: '3:1',
              content: 'Contraste mínimo entre la línea que delimita un control y su fondo (1.4.11, AA).',
            },
            {
              title: 'Objetivo',
              figure: `${MIN_OBJETIVO} px`,
              content: 'Tamaño mínimo de un control circular o de ícono, o separación suficiente entre controles pequeños (2.5.8, AA).',
            },
            {
              title: 'Anillo de foco',
              figure: '2 px',
              content: 'Trazo del anillo, a 2 px del control. Sigue el radio del control y no lo recorta el contenedor (2.4.7 y 2.4.11, AA).',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Criterios WCAG que aplican a formas y líneas',
          minWidth: 720,
          columns: [
            { header: 'Criterio', width: 340 },
            { header: 'Qué pide a formas y líneas', width: 700 },
          ],
          rows: [
            ['1.4.11 · Contraste de elementos no textuales (AA)', 'El borde que delimita un control, y el que marca un estado, llega a 3:1 con su fondo. Los bordes decorativos y los de controles inactivos quedan fuera.'],
            ['1.4.1 · Uso del color (A) y 1.3.3 · Características sensoriales (A)', 'La forma y el color no son la única señal. Suma texto o un ícono, y no pidas "pulsa el botón redondo".'],
            ['2.4.7 · Foco visible (AA) y 2.4.11 · Foco no oculto (AA)', 'El anillo se ve completo, sigue el radio del control y no queda tapado ni recortado.'],
            ['2.5.8 · Tamaño del objetivo, mínimo (AA)', 'Cada control circular o de ícono mide 24 × 24 px o tiene separación suficiente respecto de otro.'],
          ],
        },
      ],
    },
    {
      title: 'Contraste de los bordes',
      description: 'Relación medida con la fórmula de WCAG 2 sobre los valores de tokens.css en cada modo. El mínimo es 3:1.',
      blocks: [
        {
          type: 'table',
          caption: 'Contraste de pares de borde y fondo por modo',
          minWidth: 880,
          columns: [
            { header: 'Borde', width: 240 },
            { header: 'Tokens', width: 380 },
            ...THEMES.map((t) => ({ header: THEME_LABELS[t], width: 220 })),
          ],
          rows: BORDE_PAIRS.map((p) => [
            p.label,
            lines(<code key="f">{tokenName(p.fg)}</code>, <code key="b">{tokenName(p.bg)}</code>),
            ...THEMES.map((t) => <BordeValor key={t} fg={p.fg} bg={p.bg} theme={t} />),
          ]),
        },
        ...(BORDE_BAJOS.length
          ? [
              {
                type: 'note',
                tone: 'alert',
                title: 'El borde del campo no llega a 3:1 en todos los casos',
                content: `Es la única línea que delimita un campo, y queda por debajo de 3:1 en: ${BORDE_BAJOS.map((p) => `${p.label.toLowerCase()}, modo ${THEME_LABELS[p.theme].toLowerCase()} (${ratioText(p.ratio)})`).join('; ')}. Pendiente con diseño.`,
              } satisfies FoundationBlock,
            ]
          : []),
        {
          type: 'text',
          content: 'Los bordes de botón y chip bajan de 3:1 en claro, pero el texto los identifica: la línea no es la única señal. El de una tarjeta es decorativo, así que 1.4.11 no lo exige.',
        },
      ],
    },
    {
      title: 'No comuniques solo con la forma',
      description: 'Una esquina cuadrada o una línea de otro color no bastan para decir un estado.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice('do', 'Forma y texto', 'El estado se dice con una palabra, y la forma lo refuerza.', <MuestraSoloForma good />),
            practice('dont', 'Solo la forma', 'Un círculo y un cuadrado no explican nada sin una leyenda: quien no distingue la forma no recibe el dato.', <MuestraSoloForma good={false} />),
          ],
        },
        {
          type: 'text',
          content: (
            <>
              Esto aplica también al color de un borde: en un campo con error, suma un mensaje con <code>errorText</code> y no dependas del trazo rojo.
            </>
          ),
        },
      ],
    },
    {
      title: 'Alto contraste y colores forzados',
      description: 'Con el modo de contraste alto del sistema (forced-colors), el navegador quita los rellenos y las sombras. Un control que solo se delimita con relleno desaparece.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice('do', 'Borde que queda', 'El control conserva una línea de 1 px: con los rellenos fuera, aún se ve.', <MuestraAltoContraste good />),
            practice('dont', 'Solo relleno', 'Sin borde, al forzar los colores el control pierde su relleno y se confunde con el fondo.', <MuestraAltoContraste good={false} />),
          ],
        },
        {
          type: 'text',
          content: (
            <>
              Un borde o un <code>outline</code> transparente sí se pinta en colores forzados. La muestra lo simula con los colores del sistema; no reemplaza una prueba con
              el modo de contraste alto de Windows.
            </>
          ),
        },
      ],
    },
    {
      title: 'Anillo de foco y radio',
      description: 'El foco de teclado se dibuja a 2 px del control. Debe seguir su forma para que se entienda a qué pertenece.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice('do', 'Anillo con el radio del control', 'El anillo es del control y copia su radio: en la píldora es redondo y en el chip, de 16 px.', <MuestraAnilloFoco good />),
            practice('dont', 'Anillo cuadrado', 'El anillo está en un contenedor sin radio: no sigue al control y parece otro elemento.', <MuestraAnilloFoco good={false} />),
          ],
        },
        {
          type: 'text',
          content: (
            <>
              Usa <code>outline</code> con <code>outline-offset</code> de 2 px en el propio control. El anillo ocupa 4 px fuera de él: deja ese espacio libre y evita{' '}
              <code>overflow-hidden</code> en el contenedor, como se explica en Contenedores y espacios.
            </>
          ),
        },
      ],
    },
    {
      title: 'Objetivos circulares y de ícono',
      description: 'Un círculo de menos de 24 px no llena el cuadro de 24 × 24 px que pide WCAG 2.5.8.',
      blocks: [
        { type: 'cards', items: [{ preview: <MuestraObjetivo />, footer: 'Círculos de 16 a 48 px. El cuadro punteado mide 24 × 24 px.' }] },
        {
          type: 'table',
          caption: 'Tamaño de los controles circulares y de ícono',
          minWidth: 720,
          columns: [
            { header: 'Control', width: 340 },
            { header: 'Tamaño', width: 220 },
            { header: '¿Llega a 24 px?', width: 480 },
          ],
          rows: [
            ['Avatar xs', pxText(avatarPx('xs')), 'Sí. Solo es objetivo si va dentro de un botón o un enlace.'],
            ['Avatar sm, md y lg', `${avatarPx('sm')}, ${avatarPx('md')} y ${avatarPx('lg')} px`, 'Sí, con el mismo criterio.'],
            ['ButtonCorner sm y md', '32 y 40 px', 'Sí. Con el ícono de 20 px miden 36 y 44 px.'],
            ['Tag sm', '24 px de alto', 'Sí, justo en el mínimo. Si hay otro objetivo al lado, sepáralo.'],
            ['Caja de Checkbox y Radio', '16 px', 'No sola. La etiqueta forma parte del objetivo, así que el área real es mayor.'],
          ],
        },
        {
          type: 'text',
          content: 'Para tocar con el dedo, usa de 44 a 48 px. Un ícono de 16 px sin etiqueta necesita un área de toque de 24 px como mínimo.',
        },
      ],
    },
    {
      title: 'Criterios vs. evidencia',
      description: 'Esta página describe el uso de las formas y las líneas. No reemplaza una auditoría WCAG del producto.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Evidencia disponible',
              content:
                'Los contrastes se miden con los valores de tokens.css. El anillo de foco y los tamaños salen de las clases de los componentes. No hay pruebas con colores forzados, con lector de pantalla ni con el foco de teclado en las pantallas del producto: hazlas en cada vista.',
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Lista de salida',
              preview: (
                <ListaVinetas
                  items={[
                    'Borde de cada control de 3:1 o más con su fondo.',
                    'Ningún estado depende solo de la forma o del color.',
                    'Controles visibles con colores forzados.',
                    'Anillo de foco completo y con el radio del control.',
                    'Objetivos de 24 px o con separación.',
                  ]}
                />
              ),
            },
          ],
        },
      ],
    },
  ],
  development: [
    {
      title: 'Aplicar en Figma',
      description: 'Radio y línea se enlazan a variables, no se escriben.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Radio y línea con variables',
              steps: [
                {
                  title: 'Enlaza el radio a una variable',
                  content: (
                    <>
                      En el radio de las esquinas, elige una variable de radio en lugar de escribir el valor: <code>radius/container/on-canva</code> o <code>radius/container/on-card</code>{' '}
                      para los contenedores, <code>radius/general/*</code> para los demás. Los primitivos (<code>radius/*</code>) solo si el valor no debe cambiar con el breakpoint.
                    </>
                  ),
                },
                {
                  title: 'Enlaza el grosor de la línea',
                  content: (
                    <>
                      En el trazo (stroke), elige <code>border/general/md</code> para 1 px. Para 2 o 3 px no hay variable todavía: anótalo en el diseño.
                    </>
                  ),
                },
                {
                  title: 'Configura el modo del frame',
                  content: 'Aplica el modo Desktop, Tablet o Mobile de la colección Responsive al frame. Los radios toman su valor en ese breakpoint.',
                },
              ],
            },
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Nombres de variable por confirmar',
          content: 'Los nombres de variable de Figma se tomaron de los de tokens.css (con barras en lugar de guiones). Confírmalos con diseño antes de enlazarlos.',
        },
      ],
    },
    {
      title: 'Consumo técnico',
      description: (
        <>
          Cada radio responsive es una variable (<code>--ds-responsive-radius-…</code>) con su utilidad de Tailwind. El valor cambia solo con el breakpoint.
        </>
      ),
      blocks: [
        {
          type: 'table',
          caption: 'Variables y utilidades de radio de borde',
          minWidth: 880,
          columns: [
            { header: 'Uso', width: 340 },
            { header: 'Variable', width: 400 },
            { header: 'Utilidad', width: 340 },
          ],
          rows: UTILIDADES_RADIO.map(([label, variable]) => [label, tk(variable), utilidadRadio(variable)]),
        },
        {
          type: 'table',
          caption: 'Variables y utilidades de línea',
          minWidth: 880,
          columns: [
            { header: 'Uso', width: 340 },
            { header: 'Variable', width: 400 },
            { header: 'Utilidad', width: 340 },
          ],
          rows: [
            ['Línea de 1 px', tk(VARS.borderMd), utilidadBorde(borderUtilityOf(VARS.borderMd), VARS.borderMd)],
            ['Línea fina de 0,5 px', tk(VARS.borderSm), utilidadBorde(borderUtilityOf(VARS.borderSm), VARS.borderSm)],
            ['Línea de 1,5 px', tk(VARS.borderLg), utilidadBorde(borderUtilityOf(VARS.borderLg), VARS.borderLg)],
            ['Línea de 1 px, primitivo', tk('--ds-primitives-stroke-lg'), utilidadBorde(strokeUtilityOf('lg'), 'stroke-lg')],
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Tailwind',
              content: (
                <>
                  Usa <code>rounded-ds-radius-*</code> para el radio y <code>border-ds-border-general-*</code> para el grosor. El color de la línea va aparte.
                </>
              ),
              code: { label: 'Tarjeta con radio y línea en Tailwind', code: TAILWIND_EJEMPLO },
            },
            {
              title: 'CSS / variables',
              content: 'Las mismas variables, sin Tailwind. Los comentarios muestran el valor de cada breakpoint.',
              code: { label: 'Tarjeta con radio y línea en CSS', code: CSS_EJEMPLO },
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Responsive primero',
              content: (
                <>
                  Usa las variables responsive (<code>radius-container-*</code>, <code>radius-general-*</code>): siguen los ajustes del sistema y cambian con el breakpoint.
                </>
              ),
            },
            {
              title: 'Primitivos para medidas fijas',
              content: (
                <>
                  Usa los primitivos (<code>ds-primitives-radius-*</code>) solo cuando la medida no deba cambiar, como en un esquema a escala, o cuando ninguna responsive tenga el valor.
                </>
              ),
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Líneas de 0,5 y 1,5 px',
              content: (
                <>
                  Chrome redondea <code>border-width</code> a píxeles enteros. Para un trazo fino, dibújalo con <code>box-shadow</code> inset, como Chip.
                </>
              ),
              code: { label: 'Trazo fino con box-shadow', code: TRAZO_FINO },
            },
            {
              title: 'Colores forzados',
              content: 'Deja un borde transparente en todo control que se delimite con relleno. En colores forzados se pinta con el color del sistema.',
              code: { label: 'Control visible en colores forzados', code: COLORES_FORZADOS },
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Anillo de foco',
              content: 'El anillo es un outline del propio control. Los navegadores actuales lo dibujan con el border-radius del control.',
              code: { label: 'Anillo de foco con outline', code: FOCO },
            },
          ],
        },
        {
          type: 'text',
          content: (
            <>
              En <code>cn()</code>, el grupo <code>border-w</code> separa el ancho del borde de su color. <code>npm run check:tokens</code> falla si usas una variable o una utilidad <code>ds-</code> que no existe.
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
          caption: 'Auditoría de formas',
          minWidth: 720,
          columns: [
            { header: 'Hallazgo', width: 340 },
            { header: 'Decisión o pendiente', width: 700 },
          ],
          rows: [
            [
              'Tabla de radios',
              `Figma: radius.xs ${FIGMA.radiusTable[0][1]} px, radius.sm ${FIGMA.radiusTable[1][1]} px y radius.md ${FIGMA.radiusTable[2][1]} px. tokens.css: ${RADII.length} radios (${RADII.map((r) => `${r.key} ${r.value}`).join(', ')} px). Los nombres coinciden y los valores no. Manda el código.`,
            ],
            [
              'Tabla de línea',
              `Figma: stroke.xs 1 px, stroke.sm 2 px y stroke.md 3 px. tokens.css: ${STROKES.map((s) => `${s.key} ${String(s.value).replace('.', ',')}`).join(', ')} px. No hay token de 2 ni de 3 px. Pendiente con diseño.`,
            ],
            [
              'Valores de línea',
              'El texto dice "1px y 2px", pero el encabezado de Figma y su dibujo muestran 1, 2 y 3 px. La página usa 1 px y de 2 a 3 px.',
            ],
            [
              'Radios por breakpoint',
              `Figma: móvil ${FIGMA.mobile.join(', ')} px y escritorio ${FIGMA.desktop.join(', ')} px. En código solo cambian ${CAMBIAN.join(', ')}; los general-* son fijos. ${FIGMA_NIVELES_IGUALES ? 'Los esquemas anidados de Figma (24, 16, 12 y 8 px en móvil; 32, 24, 16 y 12 px en escritorio) se reproducen con los tokens de cada nivel.' : 'Los esquemas anidados no coinciden con los de Figma: revísalos.'}`,
            ],
            [
              'Tamaño del contenedor y radio',
              'Figma dice 12 px para contenedores de 40 a 70 px y 8 px para los menores de 40 px. Ninguna variable lo calcula: lo elige quien diseña, entre general-lg y general-md.',
            ],
            [
              'Texturas',
              'Figma mezcla formas y texturas en una sola documentación. Degradado, glass y blur, sus valores de token y los Do and Dont’s "Degradados" y "Glass no cuenta con elevación" son del fundamento Texturas y no están aquí.',
            ],
            [
              'Contenido de la página',
              'Las pestañas de Figma eran Formas, Texturas, Valores de token y Aplicación. Valores de token se repartió entre Definición (Variables) y Desarrollo; el frame llamado "Espacios" son los usos correctos e incorrectos y pasó a Aplicación.',
            ],
            [
              'Erratas de Figma',
              'El texto trae "**Móvil: [**8px]" con marcas sueltas, "Margen" como encabezado de las tablas de radio y de línea, y el título "Formas y texturas" con el nombre de la empresa en la bajada. Se corrigieron.',
            ],
            [
              'Ejemplos y marca',
              'Los ejemplos de la documentación anterior eran del rubro de la empresa. Se cambiaron por ejemplos neutros (perfil, formulario de contacto, ajustes) y por componentes reales de CAOS.',
            ],
            [
              'Ícono del encabezado',
              <>Figma usa un cuadrado con esquinas marcadas que no está en la biblioteca de CAOS. Se usa <code>scan</code> (esquinas redondeadas con una forma dentro).</>,
            ],
            [
              'Errata en los tokens',
              <>
                <code>radius-modal-botton</code> y <code>dimention-*</code> tienen una errata en el nombre. La página los cita como están en tokens.css.
              </>,
            ],
            [
              'Colores forzados',
              'Ningún componente declara estilos para forced-colors. La muestra es una simulación: falta probar los controles con el modo de contraste alto de Windows.',
            ],
            [
              'Contraste de bordes',
              BORDE_BAJOS.length
                ? `El borde del campo en reposo no llega a 3:1 (${BORDE_BAJOS.map((p) => `${THEME_LABELS[p.theme].toLowerCase()} ${ratioText(p.ratio)}`).join(', ')}). Pendiente con diseño.`
                : 'Todos los bordes que delimitan un control llegan a 3:1.',
            ],
            ['Accesibilidad', 'Criterio propio. Faltan pruebas con colores forzados, lector de pantalla y foco de teclado en las pantallas del producto.'],
          ],
        },
      ],
    },
  ],
};

// Comprobación en desarrollo: las variables que cita el texto existen en tokens.css.
for (const v of Object.values(VARS)) {
  if (typeof v === 'string' && rawToken(v, 'dark') === undefined) console.error(`Formas: la variable ${v} no está en tokens.css`);
}
