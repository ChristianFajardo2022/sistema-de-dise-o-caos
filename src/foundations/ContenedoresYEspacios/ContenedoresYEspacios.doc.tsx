import type { DocInline, DocPractice } from '../../docs/types';
import type { FoundationBlock, FoundationDocContent } from '../_doc/foundationDoc.types';
import { ListaVinetas } from '../_doc/ListaVinetas';
import { rawToken } from '../_doc/tokensCss';
import {
  ComposicionPorBreakpoint,
  ContenedorSobre,
  EscalaEspacios,
  EsquemaGap,
  EsquemaPadding,
  Jerarquia,
  MuestraAlineacion,
  MuestraAutoLayout,
  MuestraFoco,
  MuestraJerarquia,
  MuestraProximidad,
  MuestraTextoAjustable,
} from './ContenedoresYEspaciosMuestras';
import {
  BREAKPOINTS,
  BREAKPOINTS_ASC,
  FAMILIES,
  FIGMA,
  NIVELES_PADDING,
  RESPONSIVE,
  SCALE,
  VARS,
  checked,
  primitiveOf,
  primitiveUtilityOf,
  pxText,
  serie,
  shortName,
  spaceAt,
  utilityOf,
} from './espacioData';
import type { SpaceFamily } from './espacioData';

/*
 * Contenido de la página Contenedores y espacios (plantilla v2 de fundamentos, como Tipografía, Colores y Retículas).
 * Manda `src/styles/tokens.css`: la escala y los espacios responsivos salen de `espacioData.ts`. El texto de Definición y
 * Aplicación viene de la documentación anterior de Figma, sin IDs, sin el nombre de la empresa y con voz y tono. Los
 * ejemplos del rubro se cambiaron por otros neutros. Accesibilidad y parte de Desarrollo son criterio propio: la
 * documentación anterior no los tenía.
 */

// Figma: 1937:947 (página "Contenedores y espacios"; documentación anterior 1937:963: frames Definición 1937:1750, Valores
// de token 2079:1707 y Aplicación 2079:1365)

// ───────────────────────── datos ─────────────────────────

const first = SCALE[0].value;
const last = SCALE[SCALE.length - 1].value;
const totalResponsive = FAMILIES.reduce((n, f) => n + RESPONSIVE[f.family].length, 0);

/** Nombre de una variable en `<code>`. Si no existe en tokens.css, lo dice en la consola. */
function tk(variable: string): DocInline {
  return <code>{checked(variable)}</code>;
}

/** Nombre corto de una variable responsiva en `<code>` ("space-general-2xl"). */
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

/** Subtítulo de un par de Do and Dont’s (Heading-lg-600), como en Retículas. */
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

/** Valor de una variable responsiva en un breakpoint, con el primitivo al que apunta. */
function valueCell(variable: string, bp: (typeof BREAKPOINTS)[number]['bp']): DocInline {
  const primitive = primitiveOf(variable, bp);
  const text = pxText(spaceAt(variable, bp));
  return primitive.startsWith('space-') ? lines(text, <code key="p">{primitive}</code>) : text;
}

/** Tabla de las variables responsivas de una familia, de Mobile a Desktop. */
function familyTable(family: SpaceFamily, caption: string): FoundationBlock {
  return {
    type: 'table',
    caption,
    minWidth: 760,
    columns: [{ header: 'Variable', width: 400 }, ...BREAKPOINTS_ASC.map(({ label }) => ({ header: label, width: 200 }))],
    rows: RESPONSIVE[family].map((v) => [tkShort(v), ...BREAKPOINTS_ASC.map(({ bp }) => valueCell(v, bp))]),
  };
}

/** "tokens: 4 y 8 px" de una lista de variables generales. */
const generalText = (...sizes: string[]) => sizes.map((s) => `${shortName(VARS.general(s))} (${serie(VARS.general(s))})`);

/** Diferencias entre la escala de Figma y la de tokens.css. */
const codeValues = SCALE.map((s) => s.value);
const SOLO_CODIGO = codeValues.filter((v) => !(FIGMA.scale as readonly number[]).includes(v));
const SOLO_FIGMA = FIGMA.scale.filter((v) => !codeValues.includes(v));

/** Separación mínima (px) entre dos objetivos de `size` px para que los círculos de 24 px de sus centros no se crucen (2.5.8). */
const MIN_OBJETIVO = 24;
function separacion(size: number) {
  const need = Math.max(0, MIN_OBJETIVO - size);
  const token = need === 0 ? undefined : SCALE.find((s) => s.value >= need);
  return { need, token };
}

const TAILWIND_EJEMPLO = [
  '<section className="p-ds-space-container-on-canva">',
  '  <div className="flex flex-col',
  '    gap-ds-space-general-4xl">',
  '    <article className="p-ds-space-container-on-card">',
  '      <div className="flex flex-col',
  '        gap-ds-space-general-lg">',
  '        …',
  '      </div>',
  '    </article>',
  '  </div>',
  '</section>',
].join('\n');

const CSS_EJEMPLO = [
  '.seccion {',
  `  /* Padding sobre el lienzo: ${serie(VARS.onCanva)} */`,
  '  padding: var(--ds-responsive-space-container-on-canva);',
  '  display: flex;',
  '  flex-direction: column;',
  `  /* Gap general: ${serie(VARS.general('4xl'))} */`,
  '  gap: var(--ds-responsive-space-general-4xl);',
  '}',
  '',
  '.tarjeta {',
  `  /* Padding sobre una tarjeta: ${serie(VARS.onCard)} */`,
  '  padding: var(--ds-responsive-space-container-on-card);',
  '}',
].join('\n');

/** Utilidades de la tabla de Desarrollo: nombre, variable y prefijo de la utilidad de Tailwind. */
const UTILIDADES: [string, string, string][] = [
  ['Padding de un contenedor sobre el lienzo', VARS.onCanva, 'p'],
  ['Padding de un contenedor sobre el lienzo, estirado', VARS.onCanvaStretch, 'p'],
  ['Padding de un contenedor sobre una tarjeta', VARS.onCard, 'p'],
  ['Padding de un contenedor sobre una tarjeta, estirado', VARS.onCardStretch, 'p'],
  ['Gap o padding general', VARS.general('4xl'), 'gap'],
  ['Margen lateral del lienzo', VARS.lateral, 'px'],
  ['Margen superior del lienzo', VARS.top, 'pt'],
  ['Margen inferior del lienzo', VARS.bottom, 'pb'],
];

/** Utilidad de Tailwind (`p-ds-space-…`) de una variable; avisa en la consola si `@theme` no la expone. */
function utilidad(variable: string, prefix: string): DocInline {
  const suffix = utilityOf(variable);
  if (!suffix) console.error(`Contenedores y espacios: ${variable} no tiene utilidad de espaciado en @theme`);
  return <code>{`${prefix}-${suffix ?? '?'}`}</code>;
}

// ───────────────────────── contenido ─────────────────────────

export const doc: FoundationDocContent = {
  name: 'Contenedores y espacios',
  icon: 'row-vertical',
  summary: `Cómo se organizan los elementos en niveles de jerarquía y cómo se separan: padding, gap y una escala de ${SCALE.length} espacios, de ${first} a ${last} px, con tokens responsive.`,
  definition: [
    {
      title: 'Definición y propósito',
      description:
        'Los contenedores organizan los elementos visuales de la interfaz en niveles de jerarquía, estructurando la información para facilitar la navegación y la toma de decisiones del usuario.',
      blocks: [
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Contenedor',
              content: 'Agrupa elementos relacionados. Hay uno de primer nivel, como el fondo, y otros de segundo, tercer o cuarto nivel, como tarjetas o modales.',
            },
            {
              title: 'Padding',
              content: 'Espacio entre el borde del contenedor y su contenido. Se define con la regla de ocho: múltiplos de 8, como 16, 24 o 32 px.',
            },
            {
              title: 'Gap',
              content: 'Espacio entre los elementos de un mismo contenedor. También sigue la regla de ocho, con una excepción: 2 y 4 px.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Espacios del sistema',
          minWidth: 720,
          columns: [
            { header: 'Espacio', width: 220 },
            { header: 'Qué es', width: 440 },
            { header: 'Variables', width: 380 },
          ],
          rows: [
            [
              'Padding de contenedor',
              'Relleno de un contenedor sobre el lienzo o sobre una tarjeta, con una variante estirada.',
              lines(tkShort(VARS.onCanva), tkShort(VARS.onCard)),
            ],
            ['Espacios generales', 'Gap y padding de uso común, de menor a mayor.', <code key="g">space-general-*</code>],
            ['Márgenes del lienzo', 'Espacio entre el borde de la pantalla y el contenido. Su regla está en Retículas.', lines(tkShort(VARS.lateral), tkShort(VARS.top), tkShort(VARS.bottom))],
            ['Escala primitiva', 'Los valores base de los que salen todos los demás.', <code key="p">space-*</code>],
          ],
        },
      ],
    },
    {
      title: 'Jerarquía de contenedores',
      description: 'Los contenidos y elementos que componen una interfaz se rigen por el principio de contenedor.',
      blocks: [
        {
          type: 'text',
          content: 'Existe un contenedor de primer nivel (por ejemplo, el fondo) y contenedores de segundo, tercer o cuarto nivel (como tarjetas o modales).',
        },
        {
          type: 'text',
          content: (
            <>
              En un mismo ecosistema digital <strong>pueden coexistir diferentes contenedores organizados mediante jerarquías de información</strong>. Estas jerarquías
              guían al usuario dentro del entorno y facilitan el cumplimiento de tareas.
            </>
          ),
        },
        {
          type: 'text',
          content: 'Un caso común es la página de inicio, donde conviven contenedores informativos y de acción dentro de un mismo entorno o incluso dentro de un mismo contenedor.',
        },
        {
          type: 'text',
          content: (
            <>
              Los contenedores cuentan con <strong>valores de espaciado como padding y gap</strong>, que permiten una correcta agrupación de contenidos y una jerarquía
              clara de la información.
            </>
          ),
        },
        {
          type: 'cards',
          items: [
            {
              preview: <Jerarquia />,
              footer: `Contenedor madre y tres niveles de hijos anidados. El padding de cada nivel es el valor de su token (${NIVELES_PADDING.map((n) => n.value).join(', ')} px).`,
            },
          ],
        },
        {
          type: 'table',
          caption: 'Padding de cada nivel',
          minWidth: 640,
          columns: [
            { header: 'Nivel', width: 300 },
            { header: 'Padding', width: 160 },
            { header: 'Variable', width: 380 },
          ],
          rows: NIVELES_PADDING.map((n) => [n.name, pxText(n.value), <code key="v">{checked(`--ds-primitives-space-${n.pad}`)}</code>]),
        },
      ],
    },
    {
      title: 'Padding',
      description: 'El padding separa el contenido del borde de su contenedor.',
      blocks: [
        {
          type: 'text',
          content: (
            <>
              Los valores de padding <strong>se definen bajo la regla de ocho (8)</strong>.
            </>
          ),
        },
        {
          type: 'text',
          content: (
            <>
              Esto significa que las medidas se establecen en múltiplos de ocho, como 16 px, 24 px o 32 px. Esta regla garantiza <strong>consistencia visual entre elementos</strong>{' '}
              y fortalece la usabilidad del sistema.
            </>
          ),
        },
        { type: 'cards', items: [{ preview: <EsquemaPadding />, footer: 'El padding (franja resaltada) separa el contenido del borde del contenedor: 40 px arriba, abajo y a los lados.' }] },
      ],
    },
    {
      title: 'Gap',
      description: 'El gap separa los elementos de un mismo contenedor y los agrupa por proximidad.',
      blocks: [
        {
          type: 'text',
          content: (
            <>
              Al igual que el padding, los valores de gap <strong>se definen bajo la regla de ocho (8)</strong>. Sin embargo,{' '}
              <strong>existen excepciones en las que se utilizan valores de 2 px y 4 px</strong>, especialmente en botones o componentes que integran iconografía y requieren
              menor separación entre elementos.
            </>
          ),
        },
        {
          type: 'cards',
          items: [
            {
              preview: <EsquemaGap />,
              footer: 'Los gaps (franjas resaltadas) agrupan por proximidad: 16 px entre la foto y el nombre, 40 px entre bloques y 24 px entre la descripción y las etiquetas.',
            },
          ],
        },
      ],
    },
    {
      title: 'Escala de espacios',
      description: 'La gráfica muestra la escala de valores de padding y gap definidos en el sistema de diseño.',
      blocks: [
        {
          type: 'cards',
          items: [{ preview: <EscalaEspacios />, footer: `Escala primitiva de tokens.css: ${SCALE.length} espacios, de ${first} a ${last} px. Cada barra mide lo que vale el token.` }],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Escala distinta en Figma y en código',
          content: `Figma muestra ${FIGMA.scale.length} valores y llega a ${FIGMA.scale[FIGMA.scale.length - 1]} px. tokens.css tiene ${SCALE.length}: suma ${SOLO_CODIGO.map((v) => `${v}`).join(', ')} px y no tiene ${SOLO_FIGMA.join(', ')} px. La página usa los valores del código.`,
        },
      ],
    },
    {
      title: 'Variables / Espacios',
      description: `${SCALE.length} espacios primitivos y ${totalResponsive} variables responsive de espacio. Las responsive cambian con el breakpoint: Mobile es la base y Tablet y Desktop la reemplazan.`,
      blocks: [
        subTitle('Primitivos'),
        {
          type: 'table',
          caption: 'Escala de espacios primitivos',
          minWidth: 720,
          columns: [
            { header: 'Variable', width: 420 },
            { header: 'Valor', width: 160 },
            { header: 'Utilidad', width: 420 },
          ],
          rows: SCALE.map((s) => [
            <code key="v">{s.variable}</code>,
            pxText(s.value),
            <code key="u">{`p-${primitiveUtilityOf(s.key) ?? '?'}`}</code>,
          ]),
        },
        ...FAMILIES.flatMap((f) => [subTitle(f.title), familyTable(f.family, f.caption)]),
      ],
    },
  ],
  application: [
    {
      title: 'Usos del espacio',
      description: 'Las medidas de espacio se clasifican en tres niveles: pequeño, mediano y grande.',
      blocks: [
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Pequeño (4 px - 8 px)',
              content: 'Aplica a componentes con relación ícono–texto o texto–párrafo dentro de áreas reducidas, como:',
              preview: (
                <ListaVinetas
                  items={[
                    'Botones.',
                    'Controles de selección (Checkbox, Radio Button, Switch, Segmented Control).',
                    'Inputs de selección (Dropdown, Combobox, Date Picker).',
                    'Indicadores (Tag, Badge).',
                    'Filtros (Chips).',
                    'Navegación dinámica (Breadcrumbs, Stepper).',
                  ]}
                />
              ),
            },
            {
              title: 'Mediano (16 px - 40 px)',
              content: (
                <>
                  Se utiliza para agrupar componentes o secciones de contenido, como <strong>tarjetas, modales o listas</strong>.
                </>
              ),
            },
            {
              title: 'Grande (64 px - 80 px)',
              content: (
                <>
                  Se usa para generar separación amplia entre contenedores de mayor jerarquía, como las <strong>secciones de una página</strong>.
                </>
              ),
            },
          ],
        },
        {
          type: 'table',
          caption: 'Usos del espacio y sus variables',
          minWidth: 760,
          columns: [
            { header: 'Uso', width: 200 },
            { header: 'Rango', width: 180 },
            { header: 'Variables responsive', width: 520 },
          ],
          rows: [
            ['Pequeño', '4 a 8 px', lines(...generalText('md', 'lg'))],
            ['Mediano', '16 a 40 px', lines(...generalText('2xl', '4xl', '5xl', '6xl'))],
            ['Grande', '64 a 80 px', lines(...generalText('7xl', '8xl'))],
            [
              'Márgenes de página',
              'Según la retícula',
              lines(`${shortName(VARS.lateral)} (${serie(VARS.lateral)})`, `${shortName(VARS.top)} (${serie(VARS.top)})`, `${shortName(VARS.bottom)} (${serie(VARS.bottom)})`),
            ],
          ],
        },
        {
          type: 'note',
          tone: 'neutral',
          title: 'Márgenes de página',
          content: 'Los márgenes de página se definen según los niveles establecidos en la retícula del sistema de diseño. Sus valores y su regla están en Retículas.',
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Los responsive crecen con el breakpoint',
          content: `Las cifras del rango son las de la escala. Algunas variables general suben en Tablet o Desktop: ${shortName(VARS.general('6xl'))} pasa de ${spaceAt(VARS.general('6xl'), 'mobile')} a ${spaceAt(VARS.general('6xl'), 'desktop')} px y ${shortName(VARS.general('8xl'))} llega a ${spaceAt(VARS.general('8xl'), 'desktop')} px en Desktop. Lee el valor de cada breakpoint en la tabla de Variables.`,
        },
      ],
    },
    {
      title: 'Contenedor sobre lienzo y sobre tarjeta',
      description: 'El padding de un contenedor depende de la superficie en la que está: el lienzo de la página o una tarjeta.',
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Sobre el lienzo',
              content: lines(
                `Para secciones y tarjetas que van directamente sobre el fondo de la página: ${serie(VARS.onCanva)}.`,
                tk(VARS.onCanva),
              ),
              preview: <ContenedorSobre on="canva" />,
            },
            {
              title: 'Sobre una tarjeta',
              content: lines(
                `Para contenedores dentro de una tarjeta, con menos relleno porque ya hay un borde cerca: ${serie(VARS.onCard)}.`,
                tk(VARS.onCard),
              ),
              preview: <ContenedorSobre on="card" />,
            },
          ],
        },
        {
          type: 'table',
          caption: 'Padding de contenedor por breakpoint',
          minWidth: 760,
          columns: [{ header: 'Variable', width: 400 }, ...BREAKPOINTS_ASC.map(({ label }) => ({ header: label, width: 200 }))],
          rows: RESPONSIVE.container.map((v) => [tkShort(v), ...BREAKPOINTS_ASC.map(({ bp }) => valueCell(v, bp))]),
        },
        {
          type: 'text',
          content: (
            <>
              Las variantes <code>-stretch</code> llevan menos padding que la base y se usan en contenedores que se estiran con su contenedor padre. La muestra de arriba las
              pone junto a la base en Desktop.
            </>
          ),
        },
      ],
    },
    {
      title: 'Desktop / Tablet / Mobile',
      description: `La misma composición se dibuja con los valores responsive de cada breakpoint. El padding sobre el lienzo vale ${serie(VARS.onCanva)} y el gap general (${shortName(VARS.general('4xl'))}), ${serie(VARS.general('4xl'))}.`,
      blocks: [
        { type: 'custom', content: <ComposicionPorBreakpoint /> },
        {
          type: 'table',
          caption: 'Espacios de la composición por breakpoint',
          minWidth: 760,
          columns: [{ header: 'Espacio', width: 400 }, ...BREAKPOINTS_ASC.map(({ label }) => ({ header: label, width: 200 }))],
          rows: [
            ['Padding del contenedor sobre el lienzo', ...BREAKPOINTS_ASC.map(({ bp }) => pxText(spaceAt(VARS.onCanva, bp)))],
            ['Padding de la tarjeta', ...BREAKPOINTS_ASC.map(({ bp }) => pxText(spaceAt(VARS.onCard, bp)))],
            ['Gap entre tarjetas', ...BREAKPOINTS_ASC.map(({ bp }) => pxText(spaceAt(VARS.general('4xl'), bp)))],
            ['Gap dentro de la tarjeta', ...BREAKPOINTS_ASC.map(({ bp }) => pxText(spaceAt(VARS.general('lg'), bp)))],
          ],
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Pautas para agrupar, alinear y usar Auto Layout.',
      blocks: [
        subTitle('Jerarquía de información'),
        {
          type: 'text',
          content: 'La agrupación de contenidos mediante reglas de espaciado es fundamental para garantizar consistencia y adaptabilidad en el tiempo.',
        },
        {
          type: 'practices',
          items: [
            practice(
              'do',
              'Agrupación por proximidad',
              'El título y el cuerpo se agrupan por proximidad y el botón, como acción principal, se jerarquiza con un mayor espaciado superior.',
              <MuestraJerarquia good />,
            ),
            practice('dont', 'Mismo espaciado en todo', 'Todos los elementos tienen el mismo nivel de espaciado: no hay agrupación clara y se pierde la jerarquía.', <MuestraJerarquia good={false} />),
          ],
        },
        subTitle('Alineación de elementos'),
        {
          type: 'text',
          content: 'Los contenidos que pertenecen al mismo grupo deben estar alineados correctamente. Esto garantiza integración visual y guía al usuario de forma clara dentro de la interfaz.',
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Alineados a la izquierda', 'Los elementos están alineados a la izquierda del contenedor: facilitan la lectura y mantienen la coherencia visual.', <MuestraAlineacion good />),
            practice('dont', 'Grupos sin alineación común', 'Los grupos de información no mantienen una alineación uniforme: genera desequilibrio visual y rompe la jerarquía.', <MuestraAlineacion good={false} />),
          ],
        },
        subTitle('Aplicación del Auto Layout'),
        {
          type: 'text',
          content: (
            <>
              Todos los elementos que componen la interfaz deben integrar Auto Layout. Esto <strong>garantiza consistencia visual y optimiza la adaptación del contenido</strong> a
              diferentes tamaños de pantalla.
            </>
          ),
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Espacios con Auto Layout', 'El componente conserva alineación y jerarquía en diferentes resoluciones.', <MuestraAutoLayout good />),
            practice('dont', 'Espacios a mano', 'Sin Auto Layout se pierde precisión en el espaciado y coherencia entre componentes equivalentes.', <MuestraAutoLayout good={false} />),
          ],
        },
      ],
    },
  ],
  accessibility: [
    {
      title: 'Accesibilidad / WCAG 2.2',
      description: 'El espacio también comunica: agrupa, deja leer, separa los controles y protege el foco. Estos criterios aplican a toda pantalla que use los espacios del sistema.',
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: 'Criterio propio',
          content: 'La documentación anterior no tenía esta pestaña. Los criterios salen de WCAG 2.2 y las cifras, de tokens.css y de los componentes. Revísalos con diseño.',
        },
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Objetivo táctil',
              figure: `${MIN_OBJETIVO} px`,
              content: 'Tamaño mínimo de un control, o separación suficiente entre controles pequeños (2.5.8, AA). Se recomiendan de 44 a 48 px.',
            },
            {
              title: 'Reflow',
              figure: '320 px',
              content: 'Ancho en el que el contenido se lee sin scroll horizontal (1.4.10, AA), también con zoom al 200%.',
            },
            {
              title: 'Interlineado',
              figure: '1,5',
              content: 'Veces el tamaño de la fuente que el usuario puede aplicar al texto sin que se corte el contenido (1.4.12, AA).',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Criterios WCAG que aplican a contenedores y espacios',
          minWidth: 720,
          columns: [
            { header: 'Criterio', width: 340 },
            { header: 'Qué pide a los espacios', width: 700 },
          ],
          rows: [
            ['1.3.1 · Información y relaciones (A)', 'El agrupamiento visual coincide con la estructura del código: lo que se ve junto está junto en el marcado.'],
            [
              '1.4.12 · Espaciado del texto (AA)',
              'El contenido no se corta ni se pierde al ajustar el interlineado, el espacio entre párrafos, letras y palabras. Evita alturas fijas en contenedores con texto.',
            ],
            ['1.4.10 · Reflow (AA) y 1.4.4 · Cambio de tamaño del texto (AA)', 'A 320 px de ancho y con zoom al 200%, los contenedores se reorganizan sin scroll horizontal.'],
            ['2.5.8 · Tamaño del objetivo, mínimo (AA)', 'Cada control mide 24 × 24 px o tiene separación suficiente respecto de otro. Recomendado: 44 a 48 px.'],
            ['2.4.7 · Foco visible (AA) y 2.4.11 · Foco no oculto (AA)', <>El anillo de foco no queda recortado por el <code>overflow</code> del contenedor ni tapado por otros elementos.</>],
          ],
        },
      ],
    },
    {
      title: 'Proximidad y estructura',
      description: 'El espacio dice qué elementos van juntos. Esa relación también tiene que estar en el código.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice(
              'do',
              'Gap menor dentro del grupo',
              'Separa poco los elementos del mismo grupo y mucho un grupo del siguiente: el espacio marca la estructura.',
              <MuestraProximidad good />,
            ),
            practice('dont', 'Mismo gap en todo', 'Con el mismo espacio entre todo, los grupos no se distinguen y los campos parecen una sola lista.', <MuestraProximidad good={false} />),
          ],
        },
        {
          type: 'text',
          content: (
            <>
              Usa un gap pequeño dentro del grupo ({shortName(VARS.general('lg'))}, {serie(VARS.general('lg'))}) y uno mayor entre grupos ({shortName(VARS.general('6xl'))},{' '}
              {serie(VARS.general('6xl'))}). Marca el grupo con <code>fieldset</code> y <code>legend</code>, o con un encabezado: el lector de pantalla no anuncia el espacio.
            </>
          ),
        },
      ],
    },
    {
      title: 'Espaciado de texto y reflow',
      description: 'El usuario puede cambiar el espaciado del texto. Los contenedores tienen que crecer con él.',
      blocks: [
        {
          type: 'table',
          caption: 'Espaciado de texto que debe soportar el contenido',
          minWidth: 640,
          columns: [
            { header: 'Propiedad', width: 300 },
            { header: 'Valor', width: 300 },
            { header: 'CSS', width: 360 },
          ],
          rows: [
            ['Interlineado', '1,5 veces el tamaño de la fuente', <code key="a">line-height: 1.5</code>],
            ['Espacio entre párrafos', '2 veces el tamaño de la fuente', <code key="b">margin-block-end: 2em</code>],
            ['Espacio entre letras', '0,12 veces el tamaño de la fuente', <code key="c">letter-spacing: 0.12em</code>],
            ['Espacio entre palabras', '0,16 veces el tamaño de la fuente', <code key="d">word-spacing: 0.16em</code>],
          ],
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Alto libre', 'Define el tamaño con el padding de tokens y deja que el alto lo dé el contenido: crece con el texto.', <MuestraTextoAjustable fixed={false} />),
            practice('dont', 'Alto fijo', 'Con un alto fijo, al ajustar el espaciado el texto se corta o se sale del contenedor.', <MuestraTextoAjustable fixed />),
          ],
        },
        {
          type: 'text',
          content: (
            <>
              A 320 px, y con zoom al 200%, entra la retícula de móvil y los contenedores pasan a una columna. Usa <code>min-h-*</code> en lugar de <code>h-*</code> y evita anchos fijos
              mayores que el ancho de la pantalla. La regla del ancho está en Retículas.
            </>
          ),
        },
      ],
    },
    {
      title: 'Objetivos táctiles',
      description: 'Dos controles pequeños pueden estar juntos si el espacio entre ellos suma 24 px entre sus centros.',
      blocks: [
        {
          type: 'table',
          caption: 'Separación mínima entre objetivos pequeños',
          minWidth: 640,
          columns: [
            { header: 'Tamaño del control', width: 260 },
            { header: 'Separación mínima', width: 260 },
            { header: 'Variable que la cumple', width: 460 },
          ],
          rows: [24, 20, 16, 12].map((size) => {
            const { need, token } = separacion(size);
            return [
              `${size} × ${size} px`,
              need === 0 ? 'No necesita' : `${need} px`,
              token ? lines(`${pxText(token.value)}`, <code key="t">{token.variable}</code>) : 'Cualquiera',
            ];
          }),
        },
        {
          type: 'text',
          content: `La cuenta es 24 px menos el tamaño del control, redondeada hacia arriba a un valor de la escala. Un control de 24 px o más no necesita separación. Para tocar con el dedo, usa de 44 a 48 px y deja como mínimo ${serie(VARS.general('lg'))} (${shortName(VARS.general('lg'))}) entre controles.`,
        },
      ],
    },
    {
      title: 'Espacio para el foco',
      description: 'Los componentes con anillo exterior (Tag, Chip, Checkbox, Radio y otros) dibujan el foco con un trazo de 2 px y 2 px de separación: 4 px fuera del control. Button dibuja el suyo dentro.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice('do', 'Padding que deja ver el foco', 'El contenedor deja al menos 4 px entre el control y su borde: el anillo se ve completo.', <MuestraFoco clipped={false} />),
            practice('dont', 'Control al borde con overflow', 'Con el control pegado al borde de un contenedor que recorta, el anillo de foco queda cortado.', <MuestraFoco clipped />),
          ],
        },
        {
          type: 'text',
          content: (
            <>
              Los padding de contenedor del sistema ({serie(VARS.onCard)} sobre una tarjeta) ya cumplen. Si un contenedor con <code>overflow-hidden</code> o <code>overflow-auto</code> lleva
              controles junto al borde, súmale padding. En barras fijas, usa <code>scroll-padding</code> en el contenedor que se desplaza para que no tapen el foco.
            </>
          ),
        },
      ],
    },
    {
      title: 'Criterios vs. evidencia',
      description: 'Esta página describe el uso de los espacios. No reemplaza una auditoría WCAG del producto.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Evidencia disponible',
              content:
                'Los valores salen de tokens.css y el anillo de foco, de las clases de los componentes. No hay pruebas de reflow, zoom ni espaciado de texto en las pantallas del producto: hazlas en cada vista.',
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
                    'Grupos distinguibles por el espacio y por el código.',
                    'Texto sin cortes con el espaciado ajustado.',
                    'Sin scroll horizontal a 320 px.',
                    'Controles de 24 px o con separación.',
                    'Foco completo en todos los contenedores.',
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
      description: 'Auto Layout en todo contenedor, con variables de espacio en el padding y el gap.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Auto Layout con variables',
              steps: [
                {
                  title: 'Activa Auto Layout',
                  content: 'Todo contenedor lleva Auto Layout, con la dirección y la alineación de su contenido. Los elementos no se posicionan a mano.',
                },
                {
                  title: 'Enlaza el padding y el gap a variables',
                  content: (
                    <>
                      En Padding y Gap, elige una variable de espacio en lugar de escribir el valor: <code>space/container/on-canva</code> o <code>space/container/on-card</code> para el
                      padding de un contenedor, y <code>space/general/*</code> para los gaps. Los primitivos (<code>space/*</code>) solo si el valor no debe cambiar con el breakpoint.
                    </>
                  ),
                },
                {
                  title: 'Configura el modo del frame',
                  content: 'Aplica el modo Desktop, Tablet o Mobile de la colección Responsive al frame. Los espacios toman su valor en ese breakpoint.',
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
          Cada espacio responsive es una variable (<code>--ds-responsive-space-…</code>) con su utilidad de Tailwind. El valor cambia solo con el breakpoint.
        </>
      ),
      blocks: [
        {
          type: 'table',
          caption: 'Variables y utilidades de padding, gap y márgenes',
          minWidth: 880,
          columns: [
            { header: 'Uso', width: 340 },
            { header: 'Variable', width: 400 },
            { header: 'Utilidad', width: 300 },
          ],
          rows: UTILIDADES.map(([label, variable, prefix]) => [label, tk(variable), utilidad(variable, prefix)]),
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Tailwind',
              content: (
                <>
                  Las mismas utilidades sirven para <code>p-</code>, <code>px-</code>, <code>gap-</code> y <code>m-</code>. Por ejemplo, <code>gap-ds-space-general-4xl</code>.
                </>
              ),
              code: { label: 'Sección con espacios en Tailwind', code: TAILWIND_EJEMPLO },
            },
            {
              title: 'CSS / variables',
              content: 'Las mismas variables, sin Tailwind. Los comentarios muestran el valor de cada breakpoint.',
              code: { label: 'Sección con espacios en CSS', code: CSS_EJEMPLO },
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
                  Usa las variables responsive (<code>space-container-*</code>, <code>space-general-*</code>): cambian solas con el breakpoint y siguen los ajustes del sistema.
                </>
              ),
            },
            {
              title: 'Primitivos para medidas fijas',
              content: (
                <>
                  Usa los primitivos (<code>ds-primitives-space-*</code>) solo cuando la medida no deba cambiar, como en un esquema a escala, o cuando ningún responsive tenga el valor.
                </>
              ),
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
          caption: 'Auditoría de contenedores y espacios',
          minWidth: 720,
          columns: [
            { header: 'Hallazgo', width: 340 },
            { header: 'Decisión o pendiente', width: 700 },
          ],
          rows: [
            [
              'Escala de espacios',
              `Figma: ${FIGMA.scale.length} valores (${FIGMA.scale.join(', ')} px). tokens.css: ${SCALE.length}, de ${first} a ${last} px. Solo en el código: ${SOLO_CODIGO.join(', ')} px. Solo en Figma: ${SOLO_FIGMA.join(', ')} px. Manda el código.`,
            ],
            [
              'Nombres de la escala',
              <>
                La tabla de Figma nombra <code>space.xs</code> a <code>space.8xl</code>, y 4 px es <code>xs</code>. En tokens.css, 4 px es <code>space-md</code> y <code>space-xs</code> vale 0. La página usa
                los nombres del código.
              </>,
            ],
            [
              'Rango de padding y gap',
              `El texto de Figma dice ${FIGMA.rangeText}, pero su tabla llega a ${FIGMA.scale[FIGMA.scale.length - 1]} px. En código, los espacios general llegan a ${spaceAt(VARS.general('8xl'), 'desktop')} px en Desktop.`,
            ],
            [
              'Esquema de jerarquía',
              `Figma dibuja ${FIGMA.levels.join(', ')} px de padding. Son primitivos (${NIVELES_PADDING.map((n) => n.pad).filter((p, i, a) => a.indexOf(p) === i).join(', ')}); no usan los tokens de contenedor (${serie(VARS.onCanva)} y ${serie(VARS.onCard)}). El esquema conserva los valores de Figma.`,
            ],
            [
              'Sobre lienzo, sobre tarjeta y stretch',
              'Figma no los explica. La página los describe por cómo los usa el código: confirma con diseño el significado de stretch.',
            ],
            [
              'Contenido de la página',
              'Figma lista "Anidamiento y reglas de maquetación", que no tiene sección. La página no la incluye. La pestaña "Valores de token" se repartió entre Definición, Aplicación y Variables.',
            ],
            [
              'Excepciones de 2 y 4 px',
              `El texto las nombra, pero ningún dibujo de Figma las muestra. En código son ${shortName(VARS.general('sm'))} (${spaceAt(VARS.general('sm'), 'mobile')} px) y ${shortName(VARS.general('md'))} (${spaceAt(VARS.general('md'), 'mobile')} px).`,
            ],
            [
              'Ejemplos y marca',
              'Los ejemplos de la documentación anterior eran del rubro de la empresa. Se cambiaron por ejemplos neutros (formulario de contacto, perfil, evento) y por componentes reales de CAOS. El subtítulo con el nombre de la empresa se reescribió.',
            ],
            ['Ícono del encabezado', <>Figma usa <code>grid-equal</code>, que no está en la biblioteca de CAOS. Se usa <code>row-vertical</code> (dos contenedores apilados).</>],
            ['Frame "Parámetros"', 'Figma tiene un frame oculto con ese nombre. No se usó.'],
            ['Accesibilidad', 'Criterio propio. Faltan pruebas de reflow, zoom, espaciado de texto y foco en las pantallas del producto.'],
          ],
        },
      ],
    },
  ],
};

// Comprobación en desarrollo: las variables que cita el texto existen en tokens.css.
for (const v of Object.values(VARS)) {
  if (typeof v === 'string' && rawToken(v, 'dark') === undefined) console.error(`Contenedores y espacios: la variable ${v} no está en tokens.css`);
}
