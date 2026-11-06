import type { DocInline, DocPractice } from '../../docs/types';
import type { FoundationBlock, FoundationDocContent } from '../_doc/foundationDoc.types';
import { ListaVinetas } from '../_doc/ListaVinetas';
import { THEMES, THEME_LABELS, ratioText } from '../Colores/colorData';
import {
  ComposicionAnotada,
  ComposicionPorBreakpoint,
  MuestraBlur,
  MuestraDegradado,
  MuestraDegradados,
  MuestraGlassOpacidad,
  MuestraGlassPuro,
  MuestraGlassSombra,
  MuestraRespaldo,
  MuestraTextoGlass,
  MuestraTextoPatron,
  PatronesGrid,
  TextoValor,
  ValorToken,
} from './TexturasMuestras';
import {
  BREAKPOINTS_ASC,
  DEGRADE_TOKENS,
  EFFECT_TOKENS,
  GLASS_CSS,
  PARES_DEGRADADO,
  PARES_GLASS,
  REFERENCIA,
  USADO_POR,
  bajos,
  hexOf,
  tokenSlash,
  utilidadColor,
} from './texturaData';

/*
 * Contenido de la página Texturas (plantilla v2 de fundamentos, como Tipografía, Colores, Retículas, Contenedores y
 * espacios y Formas). Manda `src/styles/tokens.css`: los tokens de degradado y de efecto salen de `texturaData.ts`. El
 * texto de Definición y Aplicación viene de la documentación anterior de Figma (que está dentro de la de Formas), sin IDs,
 * sin el nombre de la empresa y con voz y tono. Los ejemplos del rubro se cambiaron por otros neutros. Accesibilidad y parte
 * de Desarrollo son criterio propio: la documentación anterior no los tenía.
 */

// Figma: 3055:1371 (frame Texturas, dentro de la doc de la página "Formas" 484:590), 2176:649 (Valores de token), 2176:761
// (usos correctos e incorrectos: "Degradados" y "Glass no cuenta con elevación"). Página "Texturas" 6029:4: lienzo de
// exploración sin documentación (patrones de líneas "Asset 6/7/9/10", patrón de puntos "Dots" y pantallas de ejemplo)

// ───────────────────────── ayudas ─────────────────────────

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

/** Subtítulo de un grupo de variables o de un par de Do and Dont’s (Heading-lg-600), como en Formas y Retículas. */
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

/** Porcentaje con coma y sin espacio. */
const pct = (n: number): string => `${String(n).replace('.', ',')}%`;

/** Nombre de un token en `<code>`, con barras. */
const tk = (variable: string): DocInline => <code>{tokenSlash(variable)}</code>;

/** Tabla de parámetros de una textura: Parámetro y Valor. */
const parametros = (caption: string, rows: [DocInline, DocInline][]): FoundationBlock => ({
  type: 'table',
  caption,
  minWidth: 560,
  columns: [
    { header: 'Parámetro', width: 360 },
    { header: 'Valor', width: 520 },
  ],
  rows,
});

const GLASS_PARAMS: [DocInline, DocInline][] = REFERENCIA.glass.map((p) => [`${p.es} (${p.figma})`, p.valor]);

const hex = (variable: string) => hexOf(variable, 'dark')?.toUpperCase() ?? '?';

// ───────────────────────── contraste ─────────────────────────

const BAJOS_DEGRADADO = bajos(PARES_DEGRADADO);
const BAJOS_GLASS = bajos(PARES_GLASS);

/** "El encabezado sobre el inicio (N01), modo claro (1,23:1)" para cada par que no llega a 4,5:1. */
const describir = (lista: ReturnType<typeof bajos>): string =>
  lista.map((p) => `${p.label.charAt(0).toLowerCase()}${p.label.slice(1)}, modo ${THEME_LABELS[p.theme].toLowerCase()} (${ratioText(p.ratio)})`).join('; ');

/** "Sobre glass: 4 pares no llegan a 4,5:1 (de 1,02:1 a 2,86:1). " */
const resumen = (titulo: string, lista: ReturnType<typeof bajos>): string => {
  if (!lista.length) return '';
  const ratios = lista.map((p) => p.ratio);
  return `${titulo}: ${lista.length} pares no llegan a 4,5:1 (de ${ratioText(Math.min(...ratios))} a ${ratioText(Math.max(...ratios))}). `;
};

// ───────────────────────── código de ejemplo ─────────────────────────

const TAILWIND_DEGRADADO = [
  '<section data-theme="dark"',
  '  className="rounded-ds-radius-container-on-card',
  '    bg-linear-45',
  '    from-ds-primitives-color-primary-n01',
  '    to-ds-primitives-color-secondary-a06',
  '    p-ds-space-container-on-card">',
  '  <h2 className="text-ds-text-neutral-heading">',
  '    Resumen de la semana',
  '  </h2>',
  '</section>',
].join('\n');

const CSS_DEGRADADO = [
  '.destacado {',
  '  /* degraded.default: lineal, 45°, */',
  '  /* de N01 (0%) a A06 (100%) */',
  '  background: linear-gradient(45deg in oklab,',
  '    var(--color-ds-primitives-color-primary-n01) 0%,',
  '    var(--color-ds-primitives-color-secondary-a06) 100%);',
  '}',
].join('\n');

const TAILWIND_TOKEN = [
  '<nav className="bg-linear-to-b',
  '  from-ds-background-degrade-nav-bar-0',
  '  to-ds-background-degrade-nav-bar-100">',
  '  …',
  '</nav>',
].join('\n');

const CSS_GLASS = [
  '/* Glass con opacidad: relleno B01 al 60%. */',
  '/* Texto fijo N01: el relleno no cambia con el modo. */',
  '.glass {',
  '  /* Respaldo: relleno sólido */',
  '  background: var(--color-ds-primitives-color-primary-b01);',
  '  border: 1px solid rgb(255 255 255 / 0.25);',
  '}',
  '',
  '@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {',
  '  .glass {',
  '    background: color-mix(in srgb,',
  '      var(--color-ds-primitives-color-primary-b01) 60%, transparent);',
  `    -webkit-backdrop-filter: ${GLASS_CSS.filtro};`,
  `    backdrop-filter: ${GLASS_CSS.filtro};`,
  '  }',
  '}',
  '',
  '@media (prefers-reduced-transparency: reduce) {',
  '  .glass {',
  '    background: var(--color-ds-primitives-color-primary-b01);',
  '    -webkit-backdrop-filter: none;',
  '    backdrop-filter: none;',
  '  }',
  '}',
].join('\n');

const CSS_GLASS_PURO = [
  '/* Glass puro: sin relleno. */',
  '/* Respaldo sólido y oscuro; texto con los tokens de Dark. */',
  '.glass-puro {',
  '  background: var(--color-ds-primitives-color-primary-n01);',
  '  border: 1px solid rgb(255 255 255 / 0.25);',
  '}',
  '',
  '@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {',
  '  .glass-puro {',
  '    background: linear-gradient(135deg,',
  `      rgb(255 255 255 / ${GLASS_CSS.luz}), transparent 55%);`,
  `    -webkit-backdrop-filter: ${GLASS_CSS.filtro};`,
  `    backdrop-filter: ${GLASS_CSS.filtro};`,
  '  }',
  '}',
].join('\n');

const TAILWIND_GLASS = [
  '<div data-theme="light"',
  '  className="rounded-ds-radius-container-on-card',
  '    border border-white/25',
  '    bg-ds-primitives-color-primary-b01',
  '    supports-[backdrop-filter]:bg-ds-primitives-color-primary-b01/60',
  '    supports-[backdrop-filter]:backdrop-blur-xs',
  '    supports-[backdrop-filter]:backdrop-saturate-180',
  '    supports-[backdrop-filter]:backdrop-brightness-115',
  '    p-ds-space-container-on-card">',
  '  …',
  '</div>',
].join('\n');

const CODIGO_MODAL = [
  'const [open, setOpen] = useState(false);',
  '',
  '<Modal',
  '  open={open}',
  '  onOpenChange={setOpen}',
  '  title="Mover a una carpeta"',
  '  primaryAction={{ label: \'Mover\' }}',
  '  secondaryAction={{ label: \'Cancelar\' }}',
  '>',
  '  …',
  '</Modal>',
].join('\n');

const CODIGO_DIALOG = [
  '<dialog',
  '  className="backdrop:bg-ds-background-effect-backdrop',
  '    backdrop:backdrop-blur-lg">',
  '  …',
  '</dialog>',
].join('\n');

const CODIGO_PATRON = [
  "import lineas7 from './patron-lineas-7.svg?raw';",
  '',
  '<div',
  '  aria-hidden="true"',
  '  className="absolute inset-0 -z-10 text-ds-text-neutral-body',
  '    opacity-50 [&>svg]:size-full"',
  '  dangerouslySetInnerHTML={{ __html: lineas7 }}',
  '/>',
].join('\n');

// ───────────────────────── contenido ─────────────────────────

const tokensTabla = (caption: string, tokens: string[]): FoundationBlock => ({
  type: 'table',
  caption,
  minWidth: 880,
  columns: [
    { header: 'Token', width: 380 },
    { header: THEME_LABELS.dark, width: 200 },
    { header: THEME_LABELS.light, width: 200 },
    { header: 'Se usa en', width: 280 },
  ],
  rows: tokens.map((t) => [tk(t), ...THEMES.map((theme) => <ValorToken key={theme} token={t} theme={theme} />), USADO_POR[t] ?? 'Ningún componente todavía']),
});

export const doc: FoundationDocContent = {
  name: 'Texturas',
  icon: 'sun-fog',
  summary: `Cómo se aplican el degradado, el glass y el blur para dar dinamismo y jerarquía a los contenedores, y los cuatro patrones de líneas para fondos. ${DEGRADE_TOKENS.length} tokens de degradado y ${EFFECT_TOKENS.length} de efecto en tokens.css; los valores de referencia de diseño aún no tienen token.`,
  definition: [
    {
      title: 'Definición y propósito',
      description: 'Las texturas dan dinamismo a la interfaz y crean jerarquía visual entre los contenidos relacionados.',
      blocks: [
        { type: 'text', content: 'Se definen tres tipos de textura.' },
        {
          type: 'cards',
          columns: 3,
          items: [
            { title: 'Degradado', content: 'Fondo de los contenedores principales, los que deben destacar.' },
            { title: 'Glass', content: 'Efecto de vidrio esmerilado: puro en un fondo o con opacidad en un elemento flotante.' },
            { title: 'Blur', content: 'Desenfoque del contenido que queda detrás de un diálogo abierto.' },
          ],
        },
        {
          type: 'table',
          caption: 'Texturas, dónde se aplican y su token',
          minWidth: 760,
          columns: [
            { header: 'Textura', width: 240 },
            { header: 'Se aplica a', width: 480 },
            { header: 'Token en tokens.css', width: 300 },
          ],
          rows: [
            ['Degradado', 'Contenedores principales que necesitan destacar.', <>No. Valor <code key="a">degraded.default</code>.</>],
            ['Glass puro', 'Textura de fondo de un contenedor, sin relleno.', <>No. Valor <code key="b">glass.default</code>.</>],
            ['Glass con opacidad', 'Elementos flotantes, como menús y modales.', <>No. Valor <code key="c">glass.opacity</code>.</>],
            ['Blur', 'Filtro al abrir un modal de diálogo.', <>No. Valor <code key="d">blur.default</code>.</>],
            ['Patrones de líneas', 'Fondos de vistas y de contenedores.', 'Cuatro recursos SVG, sin token.'],
          ],
        },
      ],
    },
    {
      title: 'Degradado',
      description: 'El degradado marca los contenedores de mayor nivel jerárquico. Su valor es el mismo en todo el sistema, para dar unidad gráfica.',
      blocks: [
        {
          type: 'text',
          content: (
            <>
              Se aplica a contenedores con un <strong>nivel jerárquico mayor</strong> que el resto de los elementos de la interfaz.
            </>
          ),
        },
        {
          type: 'cards',
          items: [
            {
              preview: <MuestraDegradado />,
              footer: `Lineal, a ${REFERENCIA.degradado.angulo}°, de N01 (${pct(REFERENCIA.degradado.inicio)}) a A06 (${pct(REFERENCIA.degradado.fin)}). N01 y A06 son primitivos y no cambian con el modo: el degradado se ve igual en oscuro y en claro.`,
            },
          ],
        },
        parametros('Parámetros del degradado', [
          ['Tipo', 'Lineal'],
          ['Ángulo', `${REFERENCIA.degradado.angulo}°`],
          ['Inicio', <>{pct(REFERENCIA.degradado.inicio)}, <code key="n">N01</code> ({hex('--color-ds-primitives-color-primary-n01')})</>],
          ['Final', <>{pct(REFERENCIA.degradado.fin)}, <code key="a">A06</code> ({hex('--color-ds-primitives-color-secondary-a06')})</>],
        ]),
      ],
    },
    {
      title: 'Glass',
      description: 'La interfaz usa glass en dos casos: como textura de fondo (glass puro) y en elementos flotantes (glass con opacidad).',
      blocks: [
        subTitle('Glass puro'),
        {
          type: 'text',
          content: 'El glass puro usa solo los valores del efecto, sin relleno. Interviene directamente en el fondo del contenedor.',
        },
        {
          type: 'cards',
          items: [
            {
              preview: <MuestraGlassPuro />,
              footer: 'Aproximación en CSS con backdrop-filter. La refracción de Figma no tiene un equivalente exacto.',
            },
          ],
        },
        parametros('Parámetros del glass puro', GLASS_PARAMS),
        subTitle('Glass con opacidad'),
        {
          type: 'text',
          content: (
            <>
              El glass con opacidad suma un relleno a los valores del efecto, para dar contraste con los elementos que quedan detrás. Se aplica{' '}
              <strong>solo a elementos flotantes</strong>, como menús y modales.
            </>
          ),
        },
        { type: 'cards', items: [{ preview: <MuestraGlassOpacidad /> }] },
        parametros('Parámetros del glass con opacidad', [...GLASS_PARAMS, ['Relleno', <><code key="b">B01</code>, {pct(REFERENCIA.glassRelleno)}</>]]),
      ],
    },
    {
      title: 'Blur',
      description: 'El blur desenfoca el contenido que queda detrás de un diálogo, para que el diálogo sea lo único nítido.',
      blocks: [
        {
          type: 'text',
          content: 'Se acompaña de un relleno y se aplica como filtro justo al abrir un modal de diálogo.',
        },
        {
          type: 'cards',
          items: [
            {
              preview: <MuestraBlur />,
              footer: 'El velo y el desenfoque son los del componente Backdrop: 12 px y el token background/effect/backdrop. El panel es ModalPanel.',
            },
          ],
        },
        parametros('Parámetros del blur', [
          ['Blur (Figma)', `${REFERENCIA.blur}`],
          ['Relleno (Figma)', <><code key="b">B01</code>, sin opacidad indicada</>],
          ['En código (Backdrop)', <>12 px (<code key="m">backdrop-blur-md</code>) y <code key="t">background/effect/backdrop</code></>],
        ]),
        {
          type: 'note',
          tone: 'alert',
          title: 'El código no coincide con Figma',
          content: 'Figma indica un blur de 16 con un relleno de color B01. Backdrop dibuja 12 px con el token background/effect/backdrop, que cambia con el modo. Pendiente con diseño.',
        },
      ],
    },
    {
      title: 'Patrones de líneas',
      description: 'Cuatro patrones vectoriales para fondos de vistas y de contenedores.',
      blocks: [
        {
          type: 'text',
          content: (
            <>
              Usan <code>currentColor</code>: toman el color de texto del elemento que los contiene y se desvanecen hacia transparente, así que sirven en oscuro y en claro. Para tintarlos, insértalos en línea y no con <code>img</code>.
            </>
          ),
        },
        { type: 'custom', content: <PatronesGrid /> },
      ],
    },
    {
      title: 'Variables / Texturas',
      description: `${DEGRADE_TOKENS.length} tokens de degradado y ${EFFECT_TOKENS.length} de efecto en tokens.css, y cuatro valores de referencia de diseño que aún no tienen token. Los tokens de color cambian con el modo.`,
      blocks: [
        subTitle('Tokens de degradado'),
        tokensTabla('Tokens de degradado por modo', DEGRADE_TOKENS),
        subTitle('Tokens de efecto'),
        tokensTabla('Tokens de efecto por modo', EFFECT_TOKENS),
        {
          type: 'text',
          content: 'Los tokens de efecto no incluyen las sombras (background/effect/shadow/*): son de elevación.',
        },
        subTitle('Valores de referencia de diseño'),
        {
          type: 'note',
          tone: 'alert',
          title: 'Estos valores no tienen token',
          content: 'degraded.default, glass.default, glass.opacity y blur.default no existen en tokens.css. Las muestras los arman con primitivos y valores sueltos, y la columna Token los marca con «No existe».',
        },
        {
          type: 'table',
          caption: 'Valores de referencia de textura de Figma',
          minWidth: 900,
          columns: [
            { header: 'Valor de Figma', width: 220 },
            { header: 'Parámetros', width: 420 },
            { header: 'Función', width: 280 },
            { header: 'Token', width: 200 },
          ],
          rows: [
            [
              <code key="d">degraded.default</code>,
              lines('Lineal, 45°, de 0% a 100%', 'N01 a A06'),
              'Fondo de contenedores principales.',
              'No existe',
            ],
            [
              <code key="g">glass.default</code>,
              lines(...REFERENCIA.glass.map((p) => `${p.es} (${p.figma}): ${p.valor}`)),
              'Textura de fondo, sin relleno.',
              'No existe',
            ],
            [
              <code key="o">glass.opacity</code>,
              lines(...REFERENCIA.glass.map((p) => `${p.es} (${p.figma}): ${p.valor}`), `Relleno: B01, ${pct(REFERENCIA.glassRelleno)}`),
              'Elementos flotantes.',
              'No existe',
            ],
            [<code key="b">blur.default</code>, `Blur: ${REFERENCIA.blur}`, 'Filtro al abrir un diálogo.', 'No existe'],
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Dónde va cada textura',
      description: 'Cada textura tiene su lugar: el degradado destaca, el glass flota, el blur acompaña a un diálogo y el patrón decora el fondo.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              preview: <ComposicionAnotada />,
              footer: 'La misma vista con las texturas numeradas: 1 patrón de fondo, 2 degradado en el contenedor principal, 3 glass con opacidad en el menú flotante y 4 blur con velo al abrir un diálogo.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Dónde va cada textura y dónde no',
          minWidth: 820,
          columns: [
            { header: 'Textura', width: 220 },
            { header: 'Dónde va', width: 340 },
            { header: 'Dónde no', width: 340 },
          ],
          rows: [
            ['Degradado', 'En el contenedor principal que debe destacar.', 'En contenedores consecutivos, ni en más de dos de un mismo espacio.'],
            ['Glass puro', 'Como textura de fondo de un contenedor.', 'Con sombra, ni sosteniendo texto sin un fondo oscuro y controlado detrás.'],
            ['Glass con opacidad', 'Solo en elementos flotantes: menús y modales.', 'En contenedores fijos de la página.'],
            ['Blur', 'Al abrir un diálogo, sobre el contenido de detrás.', 'Como decoración permanente de una vista.'],
            ['Patrón de líneas', 'Como fondo de una vista o de un contenedor.', 'Directamente detrás de un texto, sin una superficie sólida.'],
          ],
        },
      ],
    },
    {
      title: 'Desktop / Tablet / Mobile',
      description: 'Cada vista se dibuja con los valores de su breakpoint. Las texturas no cambian con el breakpoint: cambian el espacio y los radios, que siguen sus tokens responsive.',
      blocks: [{ type: 'custom', content: <ComposicionPorBreakpoint breakpoints={BREAKPOINTS_ASC} /> }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Pautas para aplicar degradados, glass y patrones al construir componentes.',
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: 'Criterio propio',
          content: 'Degradados y Glass no cuenta con elevación vienen de la documentación anterior de Figma. Texto sobre glass y Texto sobre un patrón son criterio propio: revísalos con diseño.',
        },
        subTitle('Degradados'),
        {
          type: 'text',
          content: (
            <>
              Usa el degradado solo en contenedores principales que necesiten destacar. No lo pongas en elementos consecutivos: en un mismo espacio caben{' '}
              <strong>máximo dos contenedores con degradado</strong>.
            </>
          ),
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Dos degradados separados', 'Hay dos contenedores con degradado en la vista y entre ellos hay otros lisos.', <MuestraDegradados good />),
            practice('dont', 'Degradados consecutivos', 'Más de dos degradados, y seguidos, saturan la vista y quitan peso a lo importante.', <MuestraDegradados good={false} />),
          ],
        },
        subTitle('Glass no cuenta con elevación'),
        {
          type: 'text',
          content: 'No combines el glass con sombras.',
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Glass sin sombra', 'El relieve lo da el fondo desenfocado que se ve a través del panel.', <MuestraGlassSombra good />),
            practice('dont', 'Glass con sombra', 'La sombra tapa la transparencia y contradice la naturaleza del glass.', <MuestraGlassSombra good={false} />),
          ],
        },
        subTitle('Texto sobre glass'),
        {
          type: 'text',
          content: 'Pon el texto sobre un glass con relleno y con un color fijo. El glass puro solo sostiene texto sobre un fondo oscuro y controlado.',
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Relleno y texto fijo', 'El relleno B01 al 60% y el texto N01 no cambian con el modo y conservan el contraste sobre fondos oscuros y claros.', <MuestraTextoGlass good />),
            practice('dont', 'Glass puro sobre un color claro', 'El texto B01 se pierde: su contraste lo decide lo que hay detrás.', <MuestraTextoGlass good={false} />),
          ],
        },
      ],
    },
  ],
  accessibility: [
    {
      title: 'Accesibilidad / WCAG 2.2',
      description: 'Una textura no debe quitar legibilidad ni transmitir información. Estos criterios aplican al texto sobre degradados, glass y patrones, y a las capas de un diálogo.',
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: 'Criterio propio',
          content: 'La documentación anterior no tenía esta pestaña. Los criterios salen de WCAG 2.2; las cifras, de tokens.css y de las muestras. Revísalos con diseño.',
        },
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Texto sobre una textura',
              figure: '4,5:1',
              content: 'Contraste mínimo del texto normal, medido en el peor punto de la textura (1.4.3, AA).',
            },
            {
              title: 'Texto sobre imagen o textura',
              figure: '14 px',
              content: 'Regla propia del sistema: texto de 14 px como mínimo, con fondo sólido detrás, borde visible y contraste medido por modo. WCAG solo fija el contraste.',
            },
            {
              title: 'Texturas decorativas',
              figure: 'aria-hidden',
              content: 'Los patrones y los degradados no se anuncian ni transmiten información (1.1.1, A).',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Criterios WCAG que aplican a las texturas',
          minWidth: 720,
          columns: [
            { header: 'Criterio', width: 340 },
            { header: 'Qué pide a las texturas', width: 700 },
          ],
          rows: [
            ['1.4.3 · Contraste mínimo (AA)', 'El texto llega a 4,5:1 (3:1 si es grande) contra el punto más claro del degradado y contra lo peor que pueda haber detrás de un glass.'],
            ['1.4.11 · Contraste de elementos no textuales (AA)', 'El control que va sobre una textura mantiene su borde con 3:1 contra el fondo. El borde del glass es decorativo y no lo cumple por sí solo.'],
            ['1.1.1 · Contenido no textual (A)', 'Un patrón o un degradado decorativo se oculta a las tecnologías de asistencia (aria-hidden en el SVG en línea).'],
            ['1.4.1 · Uso del color (A)', 'Una textura no dice un estado: un contenedor con degradado no significa "importante" para quien no lo ve. Suma texto o un ícono.'],
            ['2.4.3 · Orden del foco (A)', 'Al abrir un diálogo con blur, el foco entra en el diálogo y el resto de la vista queda inerte. El desenfoque no lo logra: lo hace el componente.'],
          ],
        },
      ],
    },
    {
      title: 'Contraste del texto sobre degradado',
      description: 'Relación medida con la fórmula de WCAG 2 sobre los valores de tokens.css en cada modo. El degradado se mide en sus dos extremos; el peor punto es A06, el más claro.',
      blocks: [
        {
          type: 'table',
          caption: 'Contraste del texto sobre los extremos del degradado por modo',
          minWidth: 900,
          columns: [
            { header: 'Texto sobre el degradado', width: 300 },
            { header: 'Tokens', width: 340 },
            ...THEMES.map((t) => ({ header: THEME_LABELS[t], width: 240 })),
          ],
          rows: PARES_DEGRADADO.map((p) => [
            p.label,
            lines(<code key="f">{p.fg.replace(/^--color-ds-/, '')}</code>, <code key="b">{p.bg.replace(/^--color-ds-/, '')}</code>),
            ...THEMES.map((t) => <TextoValor key={t} par={p} theme={t} />),
          ]),
        },
        ...(BAJOS_DEGRADADO.length
          ? [
              {
                type: 'note',
                tone: 'alert',
                title: 'Los tokens de texto de claro no sirven sobre el degradado',
                content: `El degradado es oscuro en los dos modos, pero los tokens de texto cambian con el modo. No llegan a 4,5:1 en: ${describir(BAJOS_DEGRADADO)}. Pon el contenedor con data-theme="dark" o usa un texto fijo B01.`,
              } satisfies FoundationBlock,
            ]
          : []),
        {
          type: 'text',
          content: 'El texto fijo B01 llega a 4,5:1 en los dos extremos y en los dos modos. Con data-theme="dark", los tokens de texto toman sus valores de Dark y dan el mismo resultado.',
        },
      ],
    },
    {
      title: 'Contraste del texto sobre glass',
      description: 'El contraste sobre un glass lo decide lo que hay detrás. La tabla mezcla el relleno o la luz del glass con lo que queda detrás, sin contar el desenfoque, la saturación ni el brillo del filtro.',
      blocks: [
        {
          type: 'table',
          caption: 'Contraste del texto sobre glass por modo',
          minWidth: 900,
          columns: [
            { header: 'Texto sobre el glass', width: 340 },
            { header: 'Texto y fondo', width: 300 },
            ...THEMES.map((t) => ({ header: THEME_LABELS[t], width: 240 })),
          ],
          rows: PARES_GLASS.map((p) => [
            p.label,
            lines(<code key="f">{p.fg.replace(/^--color-ds-/, '')}</code>, <code key="b">{p.bg.replace(/^--color-ds-/, '')}</code>),
            ...THEMES.map((t) => <TextoValor key={t} par={p} theme={t} />),
          ]),
        },
        ...(BAJOS_GLASS.length
          ? [
              {
                type: 'note',
                tone: 'alert',
                title: 'El glass no garantiza el contraste',
                content: `No llegan a 4,5:1: ${describir(BAJOS_GLASS)}. El glass con opacidad y el texto fijo N01 cumplen sobre la superficie; el glass puro depende del fondo.`,
              } satisfies FoundationBlock,
            ]
          : []),
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Relleno suficiente',
              content: 'Sobre un glass que lleve texto, exige un relleno (B01 al 60% como mínimo) o un fondo sólido detrás del texto. El glass puro es una textura de fondo, no una superficie de lectura.',
            },
            {
              title: 'Tamaño y borde',
              content: 'Regla propia del sistema: el texto sobre un glass mide 14 px o más. Si el glass contiene un control, el control lleva su propio borde: el del glass es decorativo.',
            },
          ],
        },
      ],
    },
    {
      title: 'Patrones y degradados decorativos',
      description: 'Un patrón de líneas o un degradado adorna: no puede ser la única forma de transmitir algo, ni quedar detrás de un texto sin un fondo sólido.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice('do', 'Texto sobre una superficie', 'El texto va en una tarjeta sólida y el patrón queda en el fondo.', <MuestraTextoPatron good />),
            practice('dont', 'Texto sobre las líneas', 'Las líneas cruzan el texto y hacen que el contraste cambie letra a letra.', <MuestraTextoPatron good={false} />),
          ],
        },
        {
          type: 'text',
          content: (
            <>
              Inserta el SVG en línea con <code>aria-hidden=&quot;true&quot;</code>. Un <code>role=&quot;img&quot;</code> con nombre solo cabe en la galería de recursos de esta página, donde el patrón es el contenido.
            </>
          ),
        },
      ],
    },
    {
      title: 'Transparencia reducida y respaldo',
      description: 'Sin soporte de backdrop-filter, o con la preferencia de transparencia reducida, el glass pierde su efecto. El texto debe seguir legible con un respaldo sólido.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice('do', 'Respaldo sólido', 'El panel tiene un relleno sólido de reserva, así que el texto se lee sin el filtro.', <MuestraRespaldo good />),
            practice('dont', 'Solo el efecto', 'Sin el filtro, el panel no tiene relleno y el texto queda sobre el fondo de color.', <MuestraRespaldo good={false} />),
          ],
        },
        {
          type: 'text',
          content: (
            <>
              La muestra simula el navegador sin <code>backdrop-filter</code>. La preferencia <code>prefers-reduced-transparency</code> aún tiene soporte limitado: úsala como mejora y deja el respaldo con <code>@supports</code> como base.
            </>
          ),
        },
      ],
    },
    {
      title: 'Blur y manejo del diálogo',
      description: 'El desenfoque es solo visual. No reemplaza lo que hace un diálogo accesible.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Qué hace el componente',
              content: (
                <>
                  Modal y AlertModal abren con <code>showModal()</code>. El velo con blur es el <code>::backdrop</code> del <code>&lt;dialog&gt;</code> y no decide nada del foco.
                </>
              ),
              preview: (
                <ListaVinetas
                  items={['El foco queda atrapado en el diálogo.', 'El resto de la vista queda inerte.', 'Escape cierra el diálogo y el foco vuelve a quien lo abrió.', 'El documento no se desplaza debajo.']}
                />
              ),
            },
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Un velo con blur no es un diálogo',
          content: 'Si armas un panel sin Modal, un velo desenfocado deja el foco y el lector de pantalla en la vista de detrás. Usa Modal o AlertModal.',
        },
      ],
    },
    {
      title: 'Criterios vs. evidencia',
      description: 'Esta página describe el uso de las texturas. No reemplaza una auditoría WCAG del producto.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Evidencia disponible',
              content:
                'Los contrastes se miden con los valores de tokens.css y con las mezclas del glass, sin el filtro. No hay pruebas con transparencia reducida, con lector de pantalla ni con el foco de teclado en las pantallas del producto: hazlas en cada vista.',
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
                    'Texto de 4,5:1 o más en el punto más claro de cada degradado.',
                    'Texto sobre glass con relleno y de 14 px o más.',
                    'Patrones y degradados decorativos fuera del árbol de accesibilidad.',
                    'Respaldo sólido sin backdrop-filter y con transparencia reducida.',
                    'Diálogo con foco atrapado y fondo inerte, además del blur.',
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
      description: 'Cada textura se arma con los valores de referencia y los primitivos de color, no con valores escritos al ojo.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Texturas con los valores de referencia',
              steps: [
                {
                  title: 'Degradado',
                  content: (
                    <>
                      En el relleno del contenedor elige Linear, a {REFERENCIA.degradado.angulo}°, con dos paradas: {pct(REFERENCIA.degradado.inicio)} con <code>N01</code> y {pct(REFERENCIA.degradado.fin)} con <code>A06</code>, enlazadas a los primitivos de color.
                    </>
                  ),
                },
                {
                  title: 'Glass',
                  content: (
                    <>
                      Agrega el efecto Glass al contenedor con los valores de la tabla de Variables. Para glass con opacidad, suma un relleno <code>B01</code> al {pct(REFERENCIA.glassRelleno)}.
                    </>
                  ),
                },
                {
                  title: 'Blur',
                  content: `Agrega un desenfoque de fondo uniforme de ${REFERENCIA.blur} a la capa que cubre la vista, con su relleno, justo debajo del diálogo.`,
                },
                {
                  title: 'Patrón',
                  content: 'Importa el SVG y pinta su trazo con el color de texto del contenedor, para que cambie con el modo.',
                },
              ],
            },
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Estilos por confirmar',
          content: 'La documentación de Figma no nombra estilos de relleno ni de efecto para estas texturas. Confirma con diseño si existirán y cómo se llamarán.',
        },
      ],
    },
    {
      title: 'Consumo técnico',
      description: (
        <>
          Los tokens de color tienen utilidades <code>bg-</code>, <code>from-</code> y <code>to-</code> de Tailwind. El degradado de 45°, el glass y el blur de 16 no tienen token: se arman con primitivos y valores sueltos.
        </>
      ),
      blocks: [
        {
          type: 'table',
          caption: 'Utilidades de los tokens de degradado y de efecto',
          minWidth: 900,
          columns: [
            { header: 'Token', width: 420 },
            { header: 'Utilidad de fondo', width: 480 },
          ],
          rows: [...DEGRADE_TOKENS, ...EFFECT_TOKENS].map((t) => [tk(t), <code key="u">{utilidadColor(t) ?? '?'}</code>]),
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Degradado en Tailwind',
              content: (
                <>
                  Usa <code>bg-linear-45</code> con los primitivos <code>from-</code> y <code>to-</code>. El contenedor lleva <code>data-theme=&quot;dark&quot;</code>, como el resto de las superficies unicolor.
                </>
              ),
              code: { label: 'Contenedor con degradado en Tailwind', code: TAILWIND_DEGRADADO },
            },
            {
              title: 'Degradado en CSS',
              content: 'La misma regla con variables, sin Tailwind. Tailwind interpola en oklab y el CSS lo declara igual.',
              code: { label: 'Contenedor con degradado en CSS', code: CSS_DEGRADADO },
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Degradado con tokens',
              content: (
                <>
                  Si el degradado es de un componente, usa sus tokens de extremo (<code>from-ds-background-degrade-*</code> y <code>to-ds-background-degrade-*</code>). NavBar lo hace así.
                </>
              ),
              code: { label: 'Degradado de la barra de navegación', code: TAILWIND_TOKEN },
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Glass con respaldo',
              content: (
                <>
                  Deja un relleno sólido como base y mejora con <code>@supports</code>. Con transparencia reducida vuelve al relleno sólido.
                </>
              ),
              code: { label: 'Glass con opacidad y su respaldo en CSS', code: CSS_GLASS },
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Glass puro con respaldo',
              content: 'El glass puro no tiene relleno: su respaldo es un fondo oscuro sólido, y el texto usa los tokens de Dark.',
              code: { label: 'Glass puro y su respaldo en CSS', code: CSS_GLASS_PURO },
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Glass en Tailwind',
              content: (
                <>
                  Con la variante <code>supports-[backdrop-filter]</code> el efecto solo se aplica donde existe. La transparencia reducida se escribe con CSS: Tailwind no tiene una variante para ella.
                </>
              ),
              code: { label: 'Glass con opacidad en Tailwind', code: TAILWIND_GLASS },
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Blur con el componente',
              content: (
                <>
                  Usa <code>Modal</code> o <code>AlertModal</code>: traen el velo, el desenfoque de 12 px, el foco atrapado y el fondo inerte.
                </>
              ),
              code: { label: 'Diálogo con Modal', code: CODIGO_MODAL },
            },
            {
              title: 'Blur en un dialog propio',
              content: (
                <>
                  El velo es el <code>::backdrop</code> del <code>&lt;dialog&gt;</code>. <code>backdrop:backdrop-blur-lg</code> da los 16 px de Figma; Modal usa <code>backdrop-blur-md</code> (12 px).
                </>
              ),
              code: { label: 'Velo con blur en un dialog', code: CODIGO_DIALOG },
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Patrón en línea',
              content: (
                <>
                  Importa el SVG con <code>?raw</code> e insértalo en línea. Toma el color de <code>currentColor</code>, así que se tinta con una clase de texto.
                </>
              ),
              code: { label: 'Patrón de líneas en línea', code: CODIGO_PATRON },
            },
          ],
        },
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'No lo animes',
              content: 'Animar un backdrop-filter obliga al navegador a recalcularlo en cada cuadro. Anima la opacidad del panel.',
            },
            {
              title: 'No lo anides',
              content: 'Un glass dentro de otro suma el costo y el de adentro no ve el fondo original. Usa uno por pila de capas.',
            },
            {
              title: 'Acota el área',
              content: 'El costo crece con el área. Aplícalo a paneles y evita cubrir la vista entera cuando no haya un diálogo abierto.',
            },
          ],
        },
        {
          type: 'text',
          content: (
            <>
              <code>npm run check:tokens</code> falla si usas una variable o una utilidad <code>ds-</code> que no existe.
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
          caption: 'Auditoría de texturas',
          minWidth: 720,
          columns: [
            { header: 'Hallazgo', width: 340 },
            { header: 'Decisión o pendiente', width: 700 },
          ],
          rows: [
            [
              'Dónde está el texto',
              'La documentación de Texturas está dentro de la de Formas (pestañas Texturas, Valores de token y Aplicación). La página Texturas de Figma no tiene documentación: es un lienzo de exploración con los patrones y pantallas de ejemplo.',
            ],
            [
              'Valores sin token',
              'degraded.default, glass.default, glass.opacity y blur.default no existen en tokens.css. Pendiente con diseño.',
            ],
            [
              'Tabla de glass',
              'La tabla de Figma tiene las columnas Desenfoque (4) y Luz (0), pero el panel dice Frost 4, Splay 0 y Light -45°, 80%. Se usaron los nombres del panel: Luz es -45°, 80% y el 0 es Abertura (Splay).',
            ],
            [
              'Blur',
              'Figma indica 16 y un relleno sin porcentaje; se asume B01. El código usa 12 px y el token background/effect/backdrop. La página anterior dibujaba un relleno del 30%, que Figma no da.',
            ],
            [
              'Valores sueltos del glass',
              `La luz del ${pct(GLASS_CSS.luz * 100)} (rgb 255 255 255), el borde del ${pct(GLASS_CSS.borde * 100)}, la saturación de 180% y el brillo de 1,15 vienen de la aproximación de la página anterior, no de Figma, y no tienen token. La luz estaba en 22% en el CSS y en 20% en la muestra: queda en 20%.`,
            ],
            [
              'Tokens sin uso',
              'Los tokens de degradado de stepper, scan e image y el de efecto filter-hover existen en tokens.css, pero ningún componente los usa. Los usan NavBar (nav-bar-0 y nav-bar-100), Button (effect-button) y Backdrop, Modal y AlertModal (effect-backdrop).',
            ],
            [
              'Sombras en oscuro',
              'Los tokens de elevación on-canva-md y on-card valen 0% en oscuro. El Don’t de glass con sombra pinta su propia sombra (N01 al 70%) para que se vea en los dos modos.',
            ],
            [
              'Ruido (noise)',
              'Los ejemplos de Figma parecen llevar grano sobre las superficies. El sistema no tiene recurso ni token de ruido, como ya anota Backdrop. Pendiente con diseño.',
            ],
            [
              'Patrones',
              'Figma repite cada patrón (Asset 6, 7, 9 y 10) y tiene un patrón de puntos (Dots) sin recurso exportado. La página usa los cuatro SVG de líneas. InformationCard dibuja una rejilla de puntos con su prop image.',
            ],
            [
              'Ejemplos y marca',
              'Los ejemplos de la documentación anterior eran del rubro de la empresa. Se cambiaron por ejemplos neutros (reunión, tareas, mensajes) y por componentes reales de CAOS.',
            ],
            [
              'Contenido de la página',
              'Las pestañas de Figma eran Formas, Texturas, Valores de token y Aplicación. Valores de token se repartió entre Definición (Variables) y Desarrollo; los usos correctos e incorrectos pasaron a Aplicación.',
            ],
            [
              'Ícono del encabezado',
              <>Figma usa un cuadrado con esquinas marcadas, que no está en la biblioteca de CAOS. Se usa <code key="i">sun-fog</code> (un sol entre bandas de niebla); <code key="m">magic-star</code> ya es el de Colores.</>,
            ],
            [
              'Contraste',
              BAJOS_DEGRADADO.length + BAJOS_GLASS.length
                ? `${resumen('Sobre el degradado', BAJOS_DEGRADADO)}${resumen('Sobre glass', BAJOS_GLASS)}El detalle está en la pestaña Accesibilidad. El texto sobre degradado se resuelve con data-theme="dark".`
                : 'Todos los pares medidos llegan a 4,5:1.',
            ],
            [
              'Transparencia reducida',
              'Ningún componente respeta prefers-reduced-transparency ni tiene respaldo sin backdrop-filter (Backdrop, Tooltip y BlogCard usan backdrop-blur-md). Pendiente.',
            ],
            ['Accesibilidad', 'Criterio propio. Faltan pruebas con transparencia reducida, lector de pantalla y foco de teclado en las pantallas del producto.'],
          ],
        },
      ],
    },
  ],
};
