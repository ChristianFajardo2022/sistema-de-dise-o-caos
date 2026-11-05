import type { DocInline, DocPractice } from '../../docs/types';
import { docBody } from '../../docs/docShared';
import { cn } from '../../utils/cn';
import type { FoundationBlock, FoundationDocContent } from '../_doc/foundationDoc.types';
import { resolveToken } from '../_doc/tokensCss';
import {
  MuestraInterfaz,
  TipografiaAnatomia,
  TipografiaEscalaEnContexto,
  TipografiaFamilias,
  TipografiaPorBreakpoint,
  TipografiaTruncado,
} from './TipografiaMuestras';
import type { MuestraInterfazVariant } from './TipografiaMuestras';
import {
  BODY_STYLES,
  BREAKPOINTS,
  BUTTON_STYLES,
  FIELD_STYLES,
  HEADING_STYLES,
  familyName,
  figmaName,
  primitiveValue,
  primitiveVars,
  ratio,
  responsiveCell,
  responsiveVars,
  sizeLine,
  tokenPx,
  weightLabel,
} from './tipografiaTokens';
import type { TextStyleDef } from './tipografiaTokens';

/*
 * Contenido de la página Tipografía (plantilla v2 de fundamentos). Manda `src/styles/tokens.css`: cada cifra de las
 * tablas y de los textos sale de `tipografiaTokens.ts`. El texto viene de la documentación de Figma, con los cambios de
 * `.qa/docs/fundamentos/tipografia/spec.md` (sin IDs, sin vocabulario del rubro y sin marcas de "Por verificar").
 */

// Figma: 23455:55864 (sección "Tipografía — Documentación"; frames 23455:55865 a 23455:59772)

// ───────────────────────── datos ─────────────────────────

const weight = (name: 'regular' | 'semibold' | 'bold') => resolveToken(`--ds-primitives-typography-weight-${name}`, 'dark');
const ALL_STYLES = [...HEADING_STYLES, ...BODY_STYLES, ...BUTTON_STYLES, ...FIELD_STYLES];
const SIZE_VARS = primitiveVars('size');
const sizes = SIZE_VARS.map((v) => tokenPx(v) ?? 0);
const PRIMITIVE_COUNT = ['family', 'weight', 'style', 'size', 'line-height', 'spacing'].reduce((n, g) => n + primitiveVars(g).length, 0);
const RESPONSIVE_GROUPS = {
  heading: responsiveVars('heading', ['size', 'line-height']),
  body: responsiveVars('body', ['size', 'line-height-large', 'line-height-short']),
  interaction: [
    ...responsiveVars('field', ['size', 'line-height']),
    ...responsiveVars('button', ['size']),
    ...responsiveVars('interaction', ['font-size', 'font-line-height']),
  ],
};
const RESPONSIVE_COUNT = Object.values(RESPONSIVE_GROUPS).reduce((n, g) => n + g.length, 0);
const byName = (name: string, index = 0) => ALL_STYLES.filter((s) => s.name === name)[index];

/** Valores de un estilo en los tres breakpoints, si cambian: "16 / 22 px en Desktop y Tablet, 14 / 20 px en Mobile". */
function porBreakpoint(style: Pick<TextStyleDef, 'size' | 'lineHeight'>): string {
  const [d, t, m] = BREAKPOINTS.map(({ bp }) => sizeLine(style, bp));
  if (d === t && t === m) return `${d} en todos los breakpoints`;
  if (d === t) return `${d} en Desktop y Tablet, ${m} en Mobile`;
  return `${d} en Desktop, ${t} en Tablet y ${m} en Mobile`;
}

// ───────────────────────── tablas ─────────────────────────

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

/** Tabla de una escala de estilos (valores de Desktop). */
function styleTable(caption: string, styles: TextStyleDef[]): FoundationBlock {
  return {
    type: 'table',
    caption,
    minWidth: 960,
    columns: [
      { header: 'Estilo local', width: 230 },
      { header: 'Familia · peso', width: 170 },
      { header: 'Tamaño / interlineado', width: 170 },
      { header: 'Tokens en código', width: 330 },
      { header: 'Uso recomendado', width: 220 },
    ],
    rows: styles.map((s) => [
      s.name,
      lines(familyName(s.family), weightLabel(s.weight)),
      lines(sizeLine(s), ratio(s)),
      lines(figmaName(s.size), s.lineHeight ? figmaName(s.lineHeight) : 'Interlineado automático'),
      s.use,
    ]),
  };
}

/** Scopes de las variables primitivas en Figma (dato de Figma; los valores salen de tokens.css). */
function scopeOf(cssVar: string): string {
  if (cssVar.includes('-family-')) return 'FONT_FAMILY';
  if (cssVar.includes('-weight-')) return 'FONT_WEIGHT';
  if (cssVar.includes('-size-')) return 'FONT_SIZE';
  // Interlineados xs a 5xl con scope LINE_HEIGHT; de 6xl a 14xl, sin scope
  const lh = cssVar.match(/-line-height-(\w+)$/);
  if (lh) return ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].includes(lh[1]) ? 'LINE_HEIGHT' : '[]';
  return '[]';
}

function primitiveTable(caption: string, groups: string[], valueHeader = 'Valor'): FoundationBlock {
  return {
    type: 'table',
    caption,
    columns: [
      { header: 'Variable', width: 400 },
      { header: valueHeader, width: 400 },
      { header: 'Scopes en Figma', width: 400 },
    ],
    rows: groups.flatMap((g) => primitiveVars(g)).map((v) => [figmaName(v), primitiveValue(v), scopeOf(v)]),
  };
}

function responsiveTable(caption: string, vars: string[]): FoundationBlock {
  return {
    type: 'table',
    caption,
    minWidth: 720,
    columns: [{ header: 'Variable', width: 400 }, ...BREAKPOINTS.map(({ label }) => ({ header: label, width: 266 }))],
    rows: vars.map((v) => [figmaName(v), ...BREAKPOINTS.map(({ bp }) => responsiveCell(v, bp))]),
  };
}

/** Fila de la tabla de breakpoints: tamaño / interlineado por breakpoint y aviso si el interlineado queda por debajo. */
function breakpointRow(label: DocInline, style: Pick<TextStyleDef, 'size' | 'lineHeight'>): DocInline[] {
  return [
    label,
    ...BREAKPOINTS.map(({ bp }) => {
      const size = tokenPx(style.size, bp) ?? 0;
      const line = style.lineHeight ? (tokenPx(style.lineHeight, bp) ?? 0) : 0;
      return line > 0 && line < size ? `${sizeLine(style, bp)} · interlineado menor que el tamaño` : sizeLine(style, bp);
    }),
  ];
}

// ───────────────────────── muestras ─────────────────────────

const practice = (kind: DocPractice['kind'], title: string, description: string, variant: MuestraInterfazVariant): DocPractice => ({
  kind,
  framed: true,
  title,
  description,
  preview: <MuestraInterfaz variant={variant} />,
});

/** Subtítulo de cada par de Do and Dont’s (Heading-lg-600). */
const pairTitle = (text: string): FoundationBlock => ({
  type: 'custom',
  content: (
    <h3 className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-xl leading-ds-typography-heading-line-height-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
      {text}
    </h3>
  ),
});

const headingLg = byName('Heading/Heading-lg-600');
const bodyMd = byName('Body/Large text/Body-md-400');
const shortXs = byName('Body/Short text/Body-xs-400', 1);
const headingXl = byName('Heading/Heading-xl-600');
const heading3xl = byName('Heading/Heading-3xl-600');
const displayMd = byName('Heading/Display-md-700');
const bodySm = byName('Body/Large text/Body-sm-400');
const shortLg = byName('Body/Short text/Body-lg-400', 1);

const receta = (
  <div className="grid grid-cols-1 gap-ds-space-general-3xl @3xl:grid-cols-2 @3xl:items-center">
    <MuestraInterfaz />
    <div className="flex min-w-0 flex-col gap-ds-space-general-xl">
      <h4 className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
        Título, cuerpo y leyenda
      </h4>
      <ul role="list" className="m-0 flex list-none flex-col gap-ds-space-general-lg p-0">
        {[headingLg, bodyMd, shortXs].map((s) => (
          <li key={`${s.name}-${s.size}`} className={docBody}>
            <strong>{s.name}</strong> · {familyName(s.family)} {weightLabel(s.weight)} · {sizeLine(s)}
          </li>
        ))}
      </ul>
      <p className={cn(docBody)}>
        En HTML: <code>h2</code>, <code>p</code> y <code>p</code>. El nivel del encabezado depende de la estructura de la página.
      </p>
    </div>
  </div>
);

const CSS_EJEMPLO = [
  '/* Body/Large text/Body-md-400 */',
  'font-family: var(--ds-primitives-typography-family-primary);',
  `font-weight: var(--ds-primitives-typography-weight-regular); /* ${weight('regular')} */`,
  `font-size: var(--ds-responsive-typography-body-size-lg); /* ${tokenPx(bodyMd.size)} px en Desktop */`,
  `line-height: var(--ds-responsive-typography-body-line-height-large-lg); /* ${tokenPx(bodyMd.lineHeight!)} px en Desktop */`,
].join('\n');

const TAILWIND_EJEMPLO = [
  '<p',
  '  className="font-ds-primitives-typography-family-primary',
  '    font-ds-primitives-typography-weight-regular',
  '    text-ds-typography-body-size-lg',
  '    leading-ds-typography-body-line-height-large-lg"',
  '>',
  '  Texto de lectura',
  '</p>',
].join('\n');

const JSON_EJEMPLO = JSON.stringify(
  { [figmaName(bodyMd.size)]: Object.fromEntries(BREAKPOINTS.map(({ bp, label }) => [label, tokenPx(bodyMd.size, bp)])) },
  null,
  2,
);

const canvas = BREAKPOINTS.map(({ bp }) => tokenPx('--ds-responsive-dimention-canva-width', bp)).join(', ');
const mobileSize = tokenPx('--ds-responsive-typography-interaction-font-size-md', 'mobile');
const mobileLine = tokenPx('--ds-responsive-typography-interaction-font-line-height-md', 'mobile');

// ───────────────────────── contenido ─────────────────────────

export const doc: FoundationDocContent = {
  name: 'Tipografía',
  icon: 'document-text',
  summary: 'Roles y medidas que ordenan la lectura en CAOS: dos familias, una escala por categoría y valores por breakpoint.',
  definition: [
    {
      title: 'Definición y propósito',
      description:
        'Una escala tipográfica es un conjunto de roles y medidas que ordena la lectura. No es una lista de tamaños intercambiables: cada estilo responde a una intención de contenido.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Un sistema, dos familias',
              preview: <TipografiaFamilias />,
              footer: (
                <>
                  Pesos: <code>typography/weight/regular</code> = {weight('regular')} · <code>semibold</code> = {weight('semibold')} · <code>bold</code> ={' '}
                  {weight('bold')}. El sufijo del nombre de un estilo (-400, -700) no es su peso real.
                </>
              ),
            },
          ],
        },
        {
          type: 'table',
          caption: 'Roles tipográficos',
          columns: [
            { header: 'Rol', width: 150 },
            { header: 'Intención de uso', width: 480 },
            { header: 'Fuente de verdad', width: 395 },
          ],
          rows: [
            ['Display', 'Máximo protagonismo, para campañas y mensajes breves. No lo uses en párrafos.', `Heading/Display-* · ${familyName('secondary')} Bold`],
            ['Headings', 'Estructura páginas, secciones y subsecciones. El tamaño visual no define el nivel semántico.', 'Heading/Heading-* y Heading/subheading-*'],
            ['Body', 'Lectura continua con Large text; datos breves, tablas y apoyo con Short text.', 'Body/Large text/* · Body/Short text/*'],
            ['Label', 'Identifica campos, filtros, estados y acciones. No reemplaza párrafos.', 'Field/* · Button/*'],
            [
              'Code',
              'Código técnico. Los tokens no tienen un estilo ni una familia para código.',
              <>
                Sin estilo: la documentación usa la monoespaciada del sistema (<code>font-mono</code>)
              </>,
            ],
          ],
        },
      ],
    },
    {
      title: 'Anatomía',
      description: 'La caja de contención marca los límites del texto, no el contorno de los glifos. La fuente no expone sus métricas internas.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              preview: <TipografiaAnatomia />,
              footer: (
                <>
                  Estilo: {heading3xl.name} · {familyName('secondary')} {weightLabel('semibold')} · {sizeLine(heading3xl)} en Desktop. El tamaño usa un primitivo (
                  <code>{figmaName(heading3xl.size)}</code>) y no cambia con el breakpoint; el interlineado (<code>{figmaName(heading3xl.lineHeight!)}</code>) sí.
                </>
              ),
            },
          ],
        },
      ],
    },
    {
      title: 'Escala y reglas de lectura',
      description: 'La escala usa valores fijos por estilo. Las pautas de lectura son recomendaciones editoriales.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Usa valores, no fórmulas',
              content: [
                <>
                  No hay ratio modular: los tamaños son una escala de {SIZE_VARS.length} valores, de {Math.min(...sizes)} a {Math.max(...sizes)} px (
                  <code>typography/size</code>).
                </>,
                'Los tokens están en px y el código no los convierte a rem. La guía anterior calculaba el interlineado con 1,1 y 1,2 × el tamaño; esas fórmulas no describen todos los tokens actuales: usa el valor de cada estilo.',
              ],
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Longitud y alineación',
              content: 'Recomendación editorial, no token: de 45 a 75 caracteres por línea en lectura continua. Alinea los párrafos a la izquierda; evita justificar o centrar bloques largos.',
            },
            {
              title: 'Contenido claro',
              content: 'Usa mayúscula solo inicial en títulos, botones y etiquetas. Deja las mayúsculas sostenidas para etiquetas breves. Prefiere frases concretas y encabezados descriptivos.',
            },
          ],
        },
      ],
    },
    {
      title: 'Escala / Heading',
      description: `${HEADING_STYLES.length} de los ${ALL_STYLES.length} estilos de texto. La tabla muestra los valores de Desktop; los demás breakpoints están en Variables / Responsive.`,
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'El nombre no sustituye al dato',
              content: `Display-lg-700 existe en ${HEADING_STYLES.filter((s) => s.name === 'Heading/Display-lg-700')
                .map((s) => tokenPx(s.size))
                .join(' y ')} px, y subheading-xs-600 en ${HEADING_STYLES.filter((s) => s.name === 'Heading/subheading-xs-600')
                .map((s) => tokenPx(s.size))
                .join(' y ')} px: se distinguen por su tamaño. Bold usa el peso ${weight('bold')} aunque el nombre termine en -700. Las proporciones de la tabla son cálculos, no tokens.`,
            },
          ],
        },
        styleTable('Escala Heading', HEADING_STYLES),
      ],
    },
    {
      title: 'La escala en contexto',
      description: 'Tres niveles de la escala en una misma pieza: protagonismo, título y lectura.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              preview: <TipografiaEscalaEnContexto />,
              footer: `${displayMd.name.replace('Heading/', '')} ${sizeLine(displayMd)} · ${headingXl.name.replace('Heading/', '')} ${sizeLine(headingXl)} · ${bodySm.name} ${sizeLine(bodySm)} (valores de Desktop).`,
            },
          ],
        },
      ],
    },
    {
      title: 'Escala / Body',
      description: `${BODY_STYLES.length} de los ${ALL_STYLES.length} estilos de texto. Large text es para lectura continua; Short text, para datos breves.`,
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Large text y Short text',
              content: `Los dos usan ${familyName('primary')}: ${weightLabel('regular')} (Light) para el texto y ${weightLabel('semibold')} (Medium) para el énfasis. En el mismo tamaño, Short text tiene un interlineado más justo que Large text.`,
            },
          ],
        },
        styleTable('Escala Body', BODY_STYLES),
        { type: 'text', content: 'Los estilos con el mismo nombre se distinguen por su tamaño; eso no indica que uno esté en desuso.' },
      ],
    },
    {
      title: 'Escala / Button',
      description: `${BUTTON_STYLES.length} de los ${ALL_STYLES.length} estilos de texto. Usan interlineado automático: no hay token de interlineado para Button.`,
      blocks: [
        styleTable('Escala Button', BUTTON_STYLES),
        {
          type: 'text',
          content: (
            <>
              Button-md cambia con el breakpoint ({porBreakpoint(byName('Button/Button-md-600'))}); Button-md-uni mantiene{' '}
              {tokenPx(byName('Button/Button-md-600-uni').size)} px en todos.
            </>
          ),
        },
      ],
    },
    {
      title: 'Escala / Field',
      description: `${FIELD_STYLES.length} de los ${ALL_STYLES.length} estilos de texto. Con Heading (${HEADING_STYLES.length}), Body (${BODY_STYLES.length}) y Button (${BUTTON_STYLES.length}) suman los ${ALL_STYLES.length}.`,
      blocks: [
        styleTable('Escala Field', FIELD_STYLES),
        {
          type: 'note',
          tone: 'alert',
          title: 'Peso sin resolver: Field/Field-lg-600',
          content: `En Figma, el estilo guarda ${familyName('primary')} Regular, sin peso enlazado, y su estilo de fuente apunta a typography/style/semibold-italic. La tabla muestra el peso que indica su nombre (${weightLabel('semibold')}). Resuélvelo con diseño antes de usarlo.`,
        },
      ],
    },
    {
      title: 'Variables / Primitives',
      description: `${PRIMITIVE_COUNT} de las ${PRIMITIVE_COUNT + RESPONSIVE_COUNT} variables typography/: colección Primitives, un solo modo y valores directos, sin alias.`,
      blocks: [primitiveTable('Familia, peso y estilo', ['family', 'weight', 'style'])],
    },
    {
      title: 'Tamaños de fuente',
      description: `${SIZE_VARS.length} tamaños en px, de ${Math.min(...sizes)} a ${Math.max(...sizes)}. No hay ratio modular: es una escala discreta.`,
      blocks: [primitiveTable('Tamaños de fuente', ['size'])],
    },
    {
      title: 'Interlineado y espaciado',
      description: 'typography/spacing no es tracking: no tiene scope y ningún estilo de texto lo usa como espaciado entre letras.',
      blocks: [
        primitiveTable('Interlineado y espaciado', ['line-height', 'spacing']),
        {
          type: 'cards',
          items: [
            {
              title: 'Qué significa []',
              content: 'Un scope vacío no declara para qué sirve la variable. Tampoco dice que esté en desuso: solo que ningún estilo de texto la usa directamente.',
            },
          ],
        },
      ],
    },
    {
      title: 'Variables / Responsive',
      description: `${RESPONSIVE_COUNT} de las ${PRIMITIVE_COUNT + RESPONSIVE_COUNT} variables typography/, con un valor por modo. Cada celda muestra el valor en px y el primitivo al que apunta.`,
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Modo y breakpoint no son lo mismo',
              content: [
                'En Figma, los modos Desktop, Tablet y Mobile se aplican a un frame. En código son media queries: Mobile por debajo de 768 px, Tablet desde 768 px y Desktop desde 1024 px.',
                <>
                  La variable <code>dimention/canva/width</code> ({canvas}) es el ancho del lienzo de diseño, no un breakpoint.
                </>,
              ],
            },
          ],
        },
        responsiveTable('Variables responsive de Heading', RESPONSIVE_GROUPS.heading),
      ],
    },
    {
      title: 'Body / valores por modo',
      description: 'Tamaños e interlineados de Large text y Short text en cada modo.',
      blocks: [responsiveTable('Variables responsive de Body', RESPONSIVE_GROUPS.body)],
    },
    {
      title: 'Field, Button e Interaction',
      description: 'Variables de formularios, botones e interacción en cada modo.',
      blocks: [
        responsiveTable('Variables responsive de Field, Button e Interaction', RESPONSIVE_GROUPS.interaction),
        {
          type: 'note',
          tone: 'alert',
          title: 'Interlineado menor que el tamaño en Mobile',
          content: `En Mobile, typography/interaction/font-size/md vale ${mobileSize} px y typography/interaction/font-line-height/md, ${mobileLine} px. Valida la combinación antes de usarla. Ningún estilo de texto ni componente usa las cuatro variables interaction.`,
        },
      ],
    },
  ],
  application: [
    {
      title: 'Jerarquía en una interfaz real',
      description:
        'Título, cuerpo y leyenda guían la lectura sin competir entre sí. El nivel semántico es una decisión de estructura: no sale del nombre del estilo.',
      blocks: [{ type: 'cards', items: [{ title: 'Detalle de la reunión', preview: receta }] }],
    },
    {
      title: 'Desktop / Tablet / Mobile',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos valores tipográficos que Desktop.',
      blocks: [
        { type: 'custom', content: <TipografiaPorBreakpoint /> },
        {
          type: 'table',
          caption: 'Tamaño e interlineado por breakpoint',
          minWidth: 720,
          columns: [{ header: 'Estilo y tokens', width: 420 }, ...BREAKPOINTS.map(({ label }) => ({ header: label, width: 260 }))],
          rows: [
            breakpointRow(`${headingXl.name} → ${figmaName(headingXl.size)} + ${figmaName(headingXl.lineHeight!)}`, headingXl),
            breakpointRow(`${bodyMd.name} → ${figmaName(bodyMd.size)} + ${figmaName(bodyMd.lineHeight!)}`, bodyMd),
            breakpointRow(`Heading-3xl-600 y Display-sm-700: tamaño primitivo (${figmaName(heading3xl.size)}) e interlineado responsive`, heading3xl),
            breakpointRow(`Display-md-700: tamaño e interlineado primitivos`, displayMd),
            breakpointRow(`Body/Short text/Body-lg-400 de ${tokenPx(shortLg.size)} px: tamaño e interlineado primitivos`, shortLg),
          ],
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Pautas de jerarquía, ajuste de línea y contraste de pesos.',
      blocks: [
        pairTitle('Jerarquía semántica'),
        {
          type: 'practices',
          items: [
            practice('do', 'Título dominante', 'Usa un título dominante, un cuerpo legible y una leyenda secundaria, y respeta el orden de los encabezados.', 'default'),
            practice('dont', 'Leyenda más grande que el título', 'No hagas la leyenda más grande que el título ni saltes niveles de encabezado por gusto visual.', 'caption-first'),
          ],
        },
        pairTitle('Wrapping en Auto Layout'),
        {
          type: 'practices',
          items: [
            practice('do', 'Texto que ajusta su línea', 'Usa ancho Fill container y alto Hug contents: el texto salta de línea solo cuando cambia el ancho.', 'default'),
            practice('dont', 'Saltos de línea forzados', 'No fuerces saltos para que un título encaje en una composición: en otros anchos parten la lectura.', 'forced-breaks'),
          ],
        },
        pairTitle('Contraste de pesos'),
        {
          type: 'practices',
          items: [
            practice('do', 'Énfasis solo en lo clave', 'Reserva el peso de énfasis para títulos y datos clave; deja el cuerpo en su peso regular.', 'default'),
            practice('dont', 'Todo el párrafo en énfasis', 'No pongas en énfasis el párrafo entero: si todo destaca, nada tiene prioridad.', 'all-emphasis'),
          ],
        },
      ],
    },
    {
      title: 'Truncado y contenido variable',
      description: 'El texto que cambia de largo necesita una regla: ajustar la línea o, en espacios fijos, truncar.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              preview: (
                <TipografiaTruncado>
                  Trunca solo en espacios fijos y cuando el texto completo se pueda leer en otro lugar. En web, <code>text-overflow: ellipsis</code> necesita un
                  ancho resuelto, <code>overflow: hidden</code> y <code>white-space: nowrap</code>. En instrucciones, errores y lectura continua, deja que el
                  texto ajuste su línea y prueba con traducciones y textos largos.
                </TipografiaTruncado>
              ),
            },
          ],
        },
      ],
    },
  ],
  accessibility: [
    {
      title: 'Accesibilidad / WCAG 2.2',
      description: 'Elegir un estilo no garantiza la conformidad. Verifica cada combinación de texto, fondo, tamaño, peso y comportamiento en el producto final.',
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Texto normal',
              figure: '4,5:1',
              content: 'Contraste mínimo AA (1.4.3) para el texto que no llega al umbral de texto grande, salvo las excepciones del criterio.',
            },
            {
              title: 'Texto grande',
              figure: '3:1',
              content: 'Desde 24 px en regular o 18,67 px en bold (18 y 14 pt). El sufijo -600 no prueba que una fuente sea bold.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Criterios WCAG de tipografía',
          columns: [
            { header: 'Criterio normativo', width: 320 },
            { header: 'Qué comprobar', width: 760 },
          ],
          rows: [
            ['1.4.3 · Contraste mínimo (AA)', 'Mide el contraste real de texto y fondo en cada modo y estado. No lo certifiques por el nombre del color.'],
            ['1.4.4 · Cambio de tamaño del texto (AA)', 'Texto al 200% sin perder contenido ni funciones. Evita altos fijos en contenedores de texto variable.'],
            ['1.4.10 · Reflow (AA)', 'El contenido se reorganiza sin scroll en dos direcciones, según el criterio y sus excepciones.'],
            ['1.4.12 · Espaciado del texto (AA)', 'Nada se pierde con interlineado de 1,5×, párrafos de 2×, letras de 0,12× y palabras de 0,16×. Son condiciones de prueba, no tokens.'],
            ['1.3.1 · Información y relaciones (A)', 'Encabezados, etiquetas y orden de lectura se comunican en el código, no solo con el estilo.'],
          ],
        },
      ],
    },
    {
      title: 'Escalar sin perder contenido',
      description: 'Cada plataforma escala el texto a su manera: pruébalo en cada una.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'QA multiplataforma',
              columns: [
                {
                  title: 'Front-end',
                  content:
                    'Prueba zoom al 200%, reflow, nombres largos, idiomas y errores. Comprueba que el texto ajuste su línea y que el truncado se pueda recuperar. Los tokens están en px: el zoom los escala; el tamaño de letra del navegador, no.',
                },
                {
                  title: 'iOS / Dynamic Type',
                  content: 'Prueba las categorías de tamaño y los tamaños de accesibilidad en un dispositivo. Usa un escalado compatible con fuentes personalizadas.',
                },
                {
                  title: 'Android / font scale',
                  content: 'Prueba el escalado de fuente del sistema con textos de varias líneas y sus contenedores. No pases px de Figma a sp sin una estrategia acordada.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Criterios vs. evidencia',
      description: 'Esta documentación no reemplaza una auditoría WCAG del producto ni una prueba en navegador o dispositivo.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Evidencia disponible',
              content: [
                `La página recoge los ${ALL_STYLES.length} estilos de texto y las ${PRIMITIVE_COUNT + RESPONSIVE_COUNT} variables typography/ de Figma con sus valores en código. No incluye pruebas de zoom, Dynamic Type, font scale ni lectores de pantalla en el producto. El nombre de un estilo no prueba su semántica HTML ni su accesibilidad.`,
                'La guía anterior recomendaba más de 16 px para lectura continua: es una recomendación de diseño, no un mínimo de WCAG. Un código de color (05, 06, de G08 a N01) no certifica el contraste: mide cada pareja real.',
              ],
            },
          ],
        },
        {
          type: 'text',
          content: 'Lista de salida: contraste medido · texto escalado · sin desbordes · títulos y labels anunciados · foco y errores comprensibles.',
        },
      ],
    },
  ],
  development: [
    {
      title: 'Aplicar en Figma',
      description: 'Primero el estilo de texto; después, el modo del frame.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Estilo primero, modo después',
              steps: [
                {
                  title: 'Elige el estilo local exacto',
                  content:
                    'En el panel Text styles del archivo, aplica, por ejemplo, Heading/Heading-xl-600 o Body/Large text/Body-md-400. Si hay nombres repetidos, comprueba el tamaño; no renombres ni desvincules el estilo.',
                },
                {
                  title: 'Configura el modo y el contenedor',
                  content:
                    'Aplica el modo Desktop, Tablet o Mobile de la colección Responsive al frame. Usa ancho Fill container y alto Hug contents en Auto Layout. Los estilos con tamaño primitivo no cambian con el modo.',
                },
                {
                  title: 'Revisa antes de publicar',
                  content:
                    'Comprueba familia, peso y variables enlazadas. No cambies de familia para resolver una fuente que falta. Revisa truncado, ajuste de línea, idiomas, zoom y estados.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Consumo técnico',
      description: (
        <>
          Cada variable es una propiedad CSS (<code>--ds-…</code>) y una utilidad de Tailwind (<code>text-ds-…</code>, <code>leading-ds-…</code>,{' '}
          <code>font-ds-…</code>). No hay una clase por estilo: un estilo se arma con sus tokens.
        </>
      ),
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'CSS / resolución del estilo',
              code: { label: 'CSS de Body/Large text/Body-md-400', code: CSS_EJEMPLO },
              footer: `Las variables responsive cambian solas con el ancho de la ventana: ${porBreakpoint(bodyMd)}.`,
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Tailwind',
              content: 'Cada token tiene su utilidad con el prefijo ds-. Combina familia, peso, tamaño e interlineado; no inventes clases de estilo.',
              code: { label: 'Clases de Body/Large text/Body-md-400', code: TAILWIND_EJEMPLO },
            },
            {
              title: 'Variables JSON',
              content: (
                <>
                  El export de las variables de Figma está en <code>tokens/variables-principal.json</code> y <code>npm run build:tokens</code> genera{' '}
                  <code>tokens.css</code>. El fragmento resume los valores por modo; no es el formato del archivo.
                </>
              ),
              code: { label: `Valores de ${figmaName(bodyMd.size)} por modo`, code: JSON_EJEMPLO },
            },
          ],
        },
        {
          type: 'text',
          content: (
            <>
              Los bloques de código usan la monoespaciada del sistema operativo (<code>font-mono</code>): CAOS no tiene una familia monoespaciada propia.
            </>
          ),
        },
      ],
    },
    {
      title: 'Auditoría, supuestos y pendientes',
      description: 'Lo que se revisó en Figma y cómo queda en código.',
      blocks: [
        {
          type: 'table',
          caption: 'Auditoría de tipografía',
          columns: [
            { header: 'Hallazgo', width: 360 },
            { header: 'Decisión o pendiente', width: 720 },
          ],
          rows: [
            [
              `${ALL_STYLES.length} estilos y ${PRIMITIVE_COUNT + RESPONSIVE_COUNT} variables typography/`,
              `${HEADING_STYLES.length} Heading, ${BODY_STYLES.length} Body, ${BUTTON_STYLES.length} Button y ${FIELD_STYLES.length} Field; ${PRIMITIVE_COUNT} variables Primitives y ${RESPONSIVE_COUNT} Responsive. Las variables están en tokens.css con los mismos valores que en Figma.`,
            ],
            ['Nombres repetidos y enlaces mixtos', 'Se distinguen por tamaño; no se fusionan ni se marcan en desuso.'],
            ['Textos sin estilo en la documentación anterior', 'De 471 textos, 133 no tienen estilo de texto; casi todos conservan variables enlazadas, así que no son valores sueltos.'],
            [
              'Field-lg-600 y pesos por nombre',
              `No se corrige aquí: Figma guarda Regular con estilo semibold-italic. En código, regular = ${weight('regular')}, semibold = ${weight('semibold')} y bold = ${weight('bold')}.`,
            ],
            [
              'Raíz rem, ratio, breakpoints y mappings',
              'Resueltos en código: tokens en px, sin ratio modular, breakpoints de 768 y 1024 px y utilidades ds- de Tailwind. Falta el mapping para SwiftUI y Compose.',
            ],
          ],
        },
      ],
    },
  ],
};
