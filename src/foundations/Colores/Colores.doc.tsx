import type { DocInline, DocPractice } from '../../docs/types';
import { DocExternalLink } from '../_doc/DocParts';
import type { FoundationBlock, FoundationDocContent, FoundationSectionContent } from '../_doc/foundationDoc.types';
import { rawToken, tokensIn } from '../_doc/tokensCss';
import {
  ContrastValue,
  DominanceBar,
  MuestraColor,
  MuestraEstados,
  MuestraModos,
  MuestraTokenOValor,
  PrimitiveSwatches,
  PrincipalPanels,
  RecetaRoles,
  RoleChips,
  TokenValue,
} from './ColoresMuestras';
import type { MuestraColorVariant } from './ColoresMuestras';
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  DIVIDER_TOKENS,
  DOMINANCE,
  FAMILY_LABELS,
  PAIRS,
  PRINCIPAL,
  SEMANTIC_PRINCIPAL,
  THEMES,
  THEME_LABELS,
  colorInfo,
  countTokens,
  ratioText,
  directValueTokens,
  pairRatio,
  readExternalPrimitives,
  readPrimitiveFamilies,
  readSemanticColors,
  tokenName,
  upperHex,
} from './colorData';
import type { FamilyId, Primitive, TokenCategory } from './colorData';

/*
 * Contenido de la página Colores (plantilla v2 de fundamentos, como Tipografía). Manda `src/styles/tokens.css`: cada
 * hex, primitivo, cantidad y contraste sale de `colorData.ts`. El texto viene de la documentación anterior de Figma
 * (Definición, Parámetros, Tokens y Accesibilidad), sin IDs, sin el nombre de la empresa y con voz y tono.
 */

// Figma: 70:2535 (página "Colores"; documentación anterior 624:3095: frames 420:244, 549:561, 604:1597 y 1830:224)

// ───────────────────────── datos ─────────────────────────

const families = readPrimitiveFamilies();
const family = (id: FamilyId) => families.find((f) => f.id === id)?.items ?? [];
const external = readExternalPrimitives();
const semantic = readSemanticColors();

const PRIMITIVE_COUNT = families.reduce((n, f) => n + f.items.length, 0);
/** Tokens semánticos por modo (Divider repite dos bordes: no suma). */
const SEMANTIC_COUNT = CATEGORY_ORDER.filter((c) => c !== 'divider').reduce((n, c) => n + countTokens(semantic[c]), 0);

/** Nombres cortos de una familia agrupados por letra: "N01, G01 a G14 y B01". */
function rangeLabel(items: Primitive[]): string {
  const groups = new Map<string, number[]>();
  for (const p of items) {
    const [, letters, num] = p.code.match(/^([A-Z]+)(\d+)$/) ?? [];
    if (letters) groups.set(letters, [...(groups.get(letters) ?? []), Number(num)]);
  }
  const parts = [...groups].map(([letters, nums]) => {
    const sorted = [...nums].sort((a, b) => a - b);
    const code = (n: number) => `${letters}${String(n).padStart(2, '0')}`;
    return sorted.length === 1 ? code(sorted[0]) : `${code(sorted[0])} a ${code(sorted[sorted.length - 1])}`;
  });
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}` : parts[0];
}

/** Primitivo y hex de un token en un modo, en texto ("B01, #FEFEFE"). */
function valueText(variable: string, theme: 'dark' | 'light'): string {
  const info = colorInfo(variable, theme);
  return info ? `${info.primitive ?? 'valor directo'} (${upperHex(info.hex)})` : 'sin valor';
}

/** Nombre de token en `<code>`. Si no existe en tokens.css, lo dice en la consola (el verificador lo detecta). */
function tk(name: string): DocInline {
  const variable = `--color-ds-${name}`;
  if (rawToken(variable, 'dark') === undefined && rawToken(variable, 'light') === undefined) console.error(`Colores: el token ${name} no está en tokens.css`);
  return <code>{name}</code>;
}

/** Pares que no llegan a 4,5:1 en algún modo. */
const LOW_PAIRS = PAIRS.flatMap((p) =>
  THEMES.flatMap((theme) => {
    const ratio = pairRatio(p.fg, p.bg, theme);
    return ratio !== undefined && ratio < 4.5 ? [{ ...p, theme, ratio }] : [];
  }),
);

/** Variables `--ds-external-*` que algún token usa. */
const usedExternal = external.filter((e) => THEMES.some((theme) => [...tokensIn(theme).values()].some((v) => v.includes(e.variable))));

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

/** Tabla de tokens: nombre en código y su valor en oscuro y en claro. */
function tokenTable(caption: string, tokens: string[]): FoundationBlock {
  return {
    type: 'table',
    caption,
    minWidth: 640,
    columns: [{ header: 'Token', width: 440 }, ...THEMES.map((t) => ({ header: THEME_LABELS[t], width: 300 }))],
    rows: tokens.map((variable) => [tokenName(variable), ...THEMES.map((t) => <TokenValue key={t} variable={variable} theme={t} />)]),
  };
}

/** Subtítulo de un grupo de tokens o de un par de Do and Dont’s (Heading-lg-600). */
const subTitle = (text: string): FoundationBlock => ({
  type: 'custom',
  content: (
    <h3 className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-xl leading-ds-typography-heading-line-height-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading [overflow-wrap:anywhere]">
      {text}
    </h3>
  ),
});

const CATEGORY_INTRO: Record<TokenCategory, string> = {
  text: 'Color del texto: encabezados, cuerpo, campos, acento y mensajes semánticos.',
  buttons: 'Fondo, borde, ícono y texto de los botones en cada estado.',
  icon: 'Color de los íconos generales, semánticos y de acento.',
  link: 'Color de los enlaces de texto en cada estado.',
  background: 'Fondos de la interfaz: superficie, contenedores, campos, pestañas, tablas, íconos, degradados, efectos y mensajes semánticos.',
  border: 'Bordes de contenedores, campos, tablas, acento y mensajes semánticos.',
  divider: 'Líneas que separan filas y grupos. tokens.css no tiene un grupo divider: el divisor usa el borde general de la superficie donde va.',
  shadow: 'Color de las sombras, con un valor por breakpoint y por modo. Las utilidades shadow-ds-… los toman según el ancho de la ventana.',
  graphics: 'Colores de los gráficos y de sus fondos translúcidos.',
};

function variableSection(category: TokenCategory): FoundationSectionContent {
  const groups = semantic[category];
  const n = countTokens(groups);
  const blocks: FoundationBlock[] =
    groups.length > 1
      ? groups.flatMap((g) => [subTitle(g.group), tokenTable(`Tokens ${g.group}`, g.tokens)])
      : groups.map((g) => tokenTable(`Tokens ${CATEGORY_LABELS[category]}`, g.tokens));
  const direct = directValueTokens(groups);
  if (direct.length > 0)
    blocks.push({
      type: 'note',
      tone: 'alert',
      title: 'Valores sin primitivo',
      content: `${direct.map(tokenName).join(' y ')} tienen un hex propio en tokens.css, sin un primitivo detrás. La tabla los marca como valor directo.`,
    });
  return {
    title: `Variables / ${CATEGORY_LABELS[category]}`,
    description: `${CATEGORY_INTRO[category]} ${n} ${n === 1 ? 'token' : 'tokens'}, con un valor por modo.`,
    blocks,
  };
}

// ───────────────────────── muestras ─────────────────────────

const practice = (kind: DocPractice['kind'], title: string, description: string, preview: DocPractice['preview']): DocPractice => ({
  kind,
  framed: true,
  title,
  description,
  preview,
});

const muestra = (variant: MuestraColorVariant) => <MuestraColor variant={variant} />;

const primarios = family('primary');
const roles: { role: string; use: string; items: Primitive[]; tokens: string[] }[] = [
  {
    role: 'Dominante',
    use: 'Superficies, fondos y texto principal. Ocupan la mayor parte de la interfaz.',
    items: [primarios[0], primarios[primarios.length - 1]].filter(Boolean),
    tokens: ['background-container-surface', 'text-neutral-heading'],
  },
  {
    role: 'Neutro',
    use: 'Texto secundario, bordes, divisores y estados inactivos.',
    items: primarios.slice(1, -1),
    tokens: ['text-neutral-body', 'border-general-default-on-card'],
  },
  {
    role: 'Acento',
    use: 'Acciones secundarias (Secundario) e interacciones terciarias (Terciario).',
    items: [...family('secondary'), ...family('tertiary')],
    tokens: ['text-link-default', 'text-acent-firts'],
  },
  {
    role: 'Semántico',
    use: 'Confirmación, información, alerta y error.',
    items: (['confirmation', 'information', 'alert', 'error'] as const).flatMap((id) => family(id)),
    tokens: ['background-semantic-success-firts', 'icon-semantic-error-firts'],
  },
];

const FAMILY_USE: Record<FamilyId, string> = {
  primary: 'Superficies, texto y neutros: el 80% de la interfaz.',
  secondary: 'Acento de la marca en las acciones secundarias: el 5%.',
  tertiary: 'Acento en las interacciones terciarias: el 3%.',
  information: 'Mensajes informativos: el 3%.',
  confirmation: 'Confirmación y éxito: el 3%.',
  error: 'Errores: el 3%.',
  alert: 'Advertencias: el 3%.',
};

const surface = '--color-ds-background-container-surface';
const heading = '--color-ds-text-neutral-heading';
const buttonPrimary = '--color-ds-background-button-primary-default';

const CSS_EJEMPLO = [
  '.tarjeta {',
  `  /* Oscuro: ${valueText(surface, 'dark')} · Claro: ${valueText(surface, 'light')} */`,
  '  background: var(--color-ds-background-container-surface);',
  `  /* Oscuro: ${valueText(heading, 'dark')} · Claro: ${valueText(heading, 'light')} */`,
  '  color: var(--color-ds-text-neutral-heading);',
  '  border: 1px solid var(--color-ds-border-general-default-on-card);',
  '}',
].join('\n');

const TAILWIND_EJEMPLO = [
  '<div',
  '  className="bg-ds-background-container-surface',
  '    text-ds-text-neutral-heading',
  '    border border-ds-border-general-default-on-card"',
  '>',
  '  Informe trimestral',
  '</div>',
].join('\n');

const MODO_EJEMPLO = [
  '<!-- Sin atributo, la página va en oscuro -->',
  '<html data-theme="light">',
  '',
  '<!-- Bloque que siempre va en oscuro -->',
  '<div data-theme="dark">…</div>',
  '',
  '// Cambiar el modo de la página',
  "document.documentElement.dataset.theme =",
  "  'light';",
].join('\n');

const dividerUse = DIVIDER_TOKENS.map(tokenName);

// ───────────────────────── contenido ─────────────────────────

export const doc: FoundationDocContent = {
  name: 'Colores',
  icon: 'magic-star',
  summary: 'Paleta y tokens de color de CAOS: primitivos por familia, roles con su proporción de uso y tokens semánticos con un valor en cada modo.',
  definition: [
    {
      title: 'Definición y propósito',
      description: 'La paleta de color estructura la jerarquía visual de la interfaz y asegura un alto contraste entre el contenido y su fondo.',
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Primitivos',
              content: `${PRIMITIVE_COUNT} colores en ${families.length} familias. Son valores fijos: no cambian con el modo.`,
            },
            {
              title: 'Tokens semánticos',
              content: `${SEMANTIC_COUNT} tokens con un valor para el modo oscuro y otro para el claro. Nombran una función (texto, fondo, borde), no un color.`,
            },
          ],
        },
        {
          type: 'table',
          caption: 'Familias de color',
          columns: [
            { header: 'Familia', width: 200 },
            { header: 'Tonos', width: 360 },
            { header: 'Uso y proporción', width: 520 },
          ],
          rows: families.map((f) => [f.label, `${f.items.length}: ${rangeLabel(f.items)}`, FAMILY_USE[f.id]]),
        },
      ],
    },
    {
      title: 'Paleta de color',
      description:
        'El sistema cromático tiene colores primarios, secundarios, terciarios y semánticos, con tonalidades dominantes, de acento y neutras. Cada muestra lleva su nombre corto y su valor en tokens.css.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Primario',
              content: `${PRINCIPAL.primary.light} es el color primario. Se usa en el 80% de la interfaz y en las interacciones principales. En modo oscuro, el principal es ${PRINCIPAL.primary.dark}.`,
              preview: (
                <>
                  <PrincipalPanels rows={[PRINCIPAL.primary]} />
                  <PrimitiveSwatches items={family('primary')} label="Primitivos Primario" wide />
                </>
              ),
            },
            {
              title: 'Secundario',
              content: `${PRINCIPAL.secondary.light} es el color de acento de la marca. Se usa en el 5% de la interfaz, en las acciones secundarias.`,
              preview: (
                <>
                  <PrincipalPanels rows={[PRINCIPAL.secondary]} />
                  <PrimitiveSwatches items={family('secondary')} label="Primitivos Secundario" />
                </>
              ),
            },
            {
              title: 'Terciario',
              content: `${PRINCIPAL.tertiary.light} es el segundo color de acento. Se usa en el 3% de la interfaz, en las interacciones terciarias.`,
              preview: (
                <>
                  <PrincipalPanels rows={[PRINCIPAL.tertiary]} />
                  <PrimitiveSwatches items={family('tertiary')} label="Primitivos Terciario" />
                </>
              ),
            },
            {
              title: 'Semánticos',
              content:
                'Los colores semánticos forman el sistema de información y alertas: ayudan a evitar errores, confirman acciones y dan retroalimentación del sistema.',
              preview: (
                <>
                  <PrincipalPanels rows={SEMANTIC_PRINCIPAL} />
                  {SEMANTIC_PRINCIPAL.map(({ family: id }) => (
                    <div key={id} className="flex flex-col gap-ds-space-general-xl">
                      <h4 className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
                        {FAMILY_LABELS[id]}
                      </h4>
                      <PrimitiveSwatches items={family(id)} label={`Primitivos ${FAMILY_LABELS[id]}`} />
                    </div>
                  ))}
                </>
              ),
            },
            {
              title: 'Primitivos externos',
              content: (
                <>
                  {external.length === 2 ? 'Dos variables' : `${external.length} variables`} (<code>--ds-external-…</code>) apuntan a una biblioteca externa de Figma.{' '}
                  {usedExternal.length === 0 ? 'Ningún token semántico las usa.' : `Las usan ${usedExternal.length} tokens.`}
                </>
              ),
              preview: <PrimitiveSwatches items={external} label="Primitivos externos" />,
              footer: external.map((e) => {
                const same = families.flatMap((f) => f.items).find((p) => p.code === e.code);
                return (
                  <>
                    <code>{e.variable}</code> vale {upperHex(e.hex)};{' '}
                    {same ? (same.hex === e.hex ? `igual que ${same.code}.` : `${same.code} de la familia vale ${upperHex(same.hex)}.`) : 'no tiene par en las familias.'}
                  </>
                );
              }),
            },
          ],
        },
      ],
    },
    {
      title: 'Dominancia de color',
      description:
        'La proporción de cada color en la interfaz: B01 y sus tonos ocupan el 50% y N01 y los suyos, el 30%. Respetar estas proporciones da unidad y equilibrio visual.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              preview: <DominanceBar items={DOMINANCE} />,
              footer: (
                <>
                  La proporción describe el modo claro. En modo oscuro se invierte: la superficie ({tk('background-container-surface')}) es{' '}
                  {colorInfo(surface, 'dark')?.primitive} y el texto principal ({tk('text-neutral-heading')}), {colorInfo(heading, 'dark')?.primitive}.
                </>
              ),
            },
          ],
        },
      ],
    },
    {
      title: 'Roles de color',
      description: 'Cuatro roles cromáticos: dominantes, neutros, de acento y semánticos. Cada rol dice para qué sirve un color y con qué contrasta.',
      blocks: [
        {
          type: 'table',
          caption: 'Roles de color',
          minWidth: 880,
          columns: [
            { header: 'Rol', width: 150 },
            { header: 'Uso', width: 330 },
            { header: 'Primitivos', width: 360 },
            { header: 'Tokens de ejemplo', width: 300 },
          ],
          rows: roles.map((r) => [r.role, r.use, <RoleChips key="p" items={r.items} />, lines(...r.tokens.map(tk))]),
        },
      ],
    },
    ...CATEGORY_ORDER.map(variableSection),
  ],
  application: [
    {
      title: 'Dominancia y roles en una interfaz',
      description: 'La superficie y el texto neutro ocupan casi todo; el acento marca una acción y el color semántico, un estado.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Detalle del documento',
              preview: (
                <RecetaRoles
                  items={[
                    { role: 'Dominante', content: <>Superficie y título: {tk('background-container-surface')} y {tk('text-neutral-heading')}.</> },
                    {
                      role: 'Acción principal',
                      content: (
                        <>
                          {tk('background-button-primary-default')}: {valueText(buttonPrimary, 'dark')} en oscuro y {valueText(buttonPrimary, 'light')} en claro.
                          Usa el primario, no el acento.
                        </>
                      ),
                    },
                    { role: 'Neutro', content: <>Cuerpo del texto: {tk('text-neutral-body')}.</> },
                    { role: 'Acento', content: <>Antetítulo y enlace: {tk('text-acent-firts')} y {tk('text-button-link-default')}.</> },
                    {
                      role: 'Semántico',
                      content: (
                        <>
                          Aviso y contador de éxito: {tk('border-semantic-success')}, {tk('icon-semantic-success-secondary')} y{' '}
                          {tk('background-semantic-success-tertiary')}.
                        </>
                      ),
                    },
                  ]}
                />
              ),
            },
          ],
        },
      ],
    },
    {
      title: 'Modo claro y modo oscuro',
      description: 'Los tokens semánticos cambian de valor con el modo; los primitivos, no. Es la misma interfaz, sin cambiar una clase.',
      blocks: [
        { type: 'custom', content: <MuestraModos /> },
        tokenTable('Mismo token, dos valores', [
          surface,
          '--color-ds-background-container-default-on-canva',
          heading,
          '--color-ds-text-neutral-body',
          '--color-ds-text-button-link-default',
          buttonPrimary,
        ]),
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Pautas para aplicar el color por función, con significado y con medida.',
      blocks: [
        subTitle('Color por token'),
        {
          type: 'practices',
          items: [
            practice('do', 'Tokens semánticos', 'Pinta con tokens semánticos: su valor cambia solo con el modo.', <MuestraTokenOValor />),
            practice('dont', 'Valor fijo', 'No pintes con un hex ni con un primitivo: en el otro modo, el texto se pierde.', <MuestraTokenOValor fixed />),
          ],
        },
        subTitle('Significado no solo por color'),
        {
          type: 'practices',
          items: [
            practice('do', 'Estado con ícono y texto', 'Acompaña el color de un estado con un ícono y un texto.', <MuestraEstados />),
            practice('dont', 'Estado solo por color', 'No indiques un estado solo con el color: no todas las personas lo distinguen.', <MuestraEstados colorOnly />),
          ],
        },
        subTitle('Acento con moderación'),
        {
          type: 'practices',
          items: [
            practice('do', 'Un acento', 'Reserva el acento para una acción o un dato clave de la vista.', muestra('default')),
            practice('dont', 'Todo en acento', 'No pongas títulos, textos y acciones en acento: si todo destaca, nada guía.', muestra('all-accent')),
          ],
        },
      ],
    },
  ],
  accessibility: [
    {
      title: 'Accesibilidad / WCAG 2.2',
      description: 'La paleta se definió con los umbrales de contraste de WCAG 2. Elegir un token no garantiza la conformidad: mide cada combinación en el producto.',
      blocks: [
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Texto normal',
              figure: '4,5:1',
              content: 'Contraste mínimo AA (1.4.3) para el texto que no llega al umbral de texto grande.',
            },
            {
              title: 'Texto grande y controles',
              figure: '3:1',
              content: 'AA para texto desde 24 px, o 18,67 px en bold (1.4.3), y para bordes, íconos y estados de los controles (1.4.11).',
            },
            {
              title: 'Nivel AAA',
              figure: '7:1',
              content: 'Contraste mejorado (1.4.6). Es la meta de la paleta para el texto de lectura, no un requisito de AA.',
            },
          ],
        },
        {
          type: 'text',
          content: 'La paleta tiene contrastes medios y altos para textos, tarjetas, botones y campos sobre sus fondos, en los dos modos.',
        },
      ],
    },
    {
      title: 'Contraste de los pares de tokens',
      description: 'Relación medida con la fórmula de WCAG 2 sobre los valores de tokens.css en cada modo.',
      blocks: [
        {
          type: 'table',
          caption: 'Contraste de pares de texto y fondo por modo',
          minWidth: 880,
          columns: [
            { header: 'Par', width: 240 },
            { header: 'Tokens', width: 380 },
            ...THEMES.map((t) => ({ header: THEME_LABELS[t], width: 200 })),
          ],
          rows: PAIRS.map((p) => [
            p.label,
            lines(<code key="f">{tokenName(p.fg)}</code>, <code key="b">{tokenName(p.bg)}</code>),
            ...THEMES.map((t) => <ContrastValue key={t} fg={p.fg} bg={p.bg} theme={t} />),
          ]),
        },
        ...LOW_PAIRS.map(
          (p): FoundationBlock => ({
            type: 'note',
            tone: 'alert',
            title: `${p.label} en modo ${THEME_LABELS[p.theme].toLowerCase()}: ${ratioText(p.ratio)}`,
            content: `No llega a 4,5:1 para texto normal${p.ratio >= 3 ? '; cumple 3:1 para texto grande' : ''}. Revísalo con diseño antes de usarlo en texto de lectura.`,
          }),
        ),
      ],
    },
    {
      title: 'Buenas prácticas',
      description: 'Reglas de aplicación del color para que la información se entienda en los dos modos.',
      blocks: [
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Altos contrastes',
              content: [
                'El alto contraste ayuda a entender la información y a completar las tareas.',
                'En modo claro, el texto usa los tonos oscuros del primario sobre las superficies claras; en modo oscuro, al revés. El nombre de un tono no certifica el contraste: mide cada par.',
              ],
            },
            {
              title: 'Estados de interacción',
              content: (
                <>
                  Los tonos de cada familia distinguen los estados de un componente. Cada estado tiene su token: el botón primario usa{' '}
                  {tk('background-button-primary-default')}, {tk('background-button-primary-hover')}, {tk('background-button-primary-press')} y{' '}
                  {tk('background-button-primary-inactive')}.
                </>
              ),
            },
            {
              title: 'Combinaciones que se confunden',
              content:
                'Verde con rojo y amarillo con azul pueden no distinguirse con daltonismo. Evita juntarlos o acompáñalos de un ícono o un texto descriptivo.',
            },
          ],
        },
      ],
    },
    {
      title: 'Criterios vs. evidencia',
      description: 'La tabla mide pares de tokens, no pantallas. No reemplaza una auditoría WCAG del producto.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Comprueba cada combinación',
              content: (
                <>
                  Mide el texto y su fondo reales en los dos modos y en cada estado, con un analizador de contraste como el{' '}
                  <DocExternalLink href="https://color.adobe.com/es/create/color-contrast-analyzer">comprobador de contraste de Adobe</DocExternalLink>.
                </>
              ),
            },
          ],
        },
        {
          type: 'text',
          content: 'Lista de salida: contraste medido en los dos modos · estados con ícono o texto · foco visible · nada que dependa solo del color.',
        },
      ],
    },
  ],
  development: [
    {
      title: 'Aplicar en Figma',
      description: 'Primero la variable; después, el modo del frame.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Variable primero, modo después',
              steps: [
                {
                  title: 'Aplica una variable semántica',
                  content:
                    'En el relleno o el trazo, elige una variable de la colección Mode (background/…, text/…, border/…, icon/…). No uses un hex ni una variable de Primitives en una pantalla.',
                },
                {
                  title: 'Configura el modo del frame',
                  content: 'Aplica el modo Dark o Light de la colección Mode al frame. Todo lo que contiene toma los valores de ese modo.',
                },
                {
                  title: 'Revisa los dos modos',
                  content: 'Cambia el modo del frame y comprueba el contraste, los estados y los textos sobre cada fondo.',
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
          Cada token es una propiedad CSS (<code>--color-ds-…</code>) y una utilidad de Tailwind (<code>bg-ds-…</code>, <code>text-ds-…</code>,{' '}
          <code>border-ds-…</code>). El valor cambia solo con el modo.
        </>
      ),
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'CSS / variables',
              code: { label: 'CSS de una tarjeta con tokens de color', code: CSS_EJEMPLO },
              footer: 'Los comentarios muestran el primitivo y el valor de cada modo; en el código basta la variable.',
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Tailwind',
              content: 'Cada token tiene sus utilidades con el prefijo ds-: bg- para fondos, text- para texto e íconos, border- para bordes.',
              code: { label: 'Clases de una tarjeta con tokens de color', code: TAILWIND_EJEMPLO },
            },
            {
              title: 'Cambio de modo',
              content: (
                <>
                  tokens.css declara Dark en <code>:root</code>, <code>.dark</code> y <code>[data-theme=&quot;dark&quot;]</code>, y Light en <code>.light</code> y{' '}
                  <code>[data-theme=&quot;light&quot;]</code>. Un elemento con <code>data-theme</code> fuerza su modo en todo lo que contiene.
                </>
              ),
              code: { label: 'Cambiar el modo de la página o de un bloque', code: MODO_EJEMPLO },
            },
          ],
        },
      ],
    },
    {
      title: 'Primitivos y semánticos',
      description: 'Usa siempre el token semántico. El primitivo es el valor de base y no cambia con el modo.',
      blocks: [
        {
          type: 'table',
          caption: 'Primitivos y semánticos',
          minWidth: 720,
          columns: [
            { header: 'Capa', width: 160 },
            { header: 'Ejemplo', width: 380 },
            { header: 'Cambia con el modo', width: 260 },
            { header: 'Úsala en', width: 280 },
          ],
          rows: [
            ['Primitivo', <code key="c">--color-ds-primitives-color-primary-n01</code>, 'No', 'La definición de los tokens semánticos.'],
            [
              'Semántico',
              <code key="c">--color-ds-background-container-surface</code>,
              `Sí: ${valueText(surface, 'dark')} en oscuro y ${valueText(surface, 'light')} en claro.`,
              'Componentes y pantallas.',
            ],
          ],
        },
        {
          type: 'text',
          content: (
            <>
              <code>npm run check:tokens</code> falla si el código usa una variable o una utilidad <code>ds-</code> que no existe en tokens.css. No avisa si usas un
              primitivo donde va un semántico: eso se revisa a mano.
            </>
          ),
        },
      ],
    },
    {
      title: 'Auditoría, supuestos y pendientes',
      description: 'Lo que se revisó en la guía anterior de Figma y cómo queda en código.',
      blocks: [
        {
          type: 'table',
          caption: 'Auditoría de color',
          columns: [
            { header: 'Hallazgo', width: 360 },
            { header: 'Decisión o pendiente', width: 720 },
          ],
          rows: [
            [
              `${PRIMITIVE_COUNT} primitivos y ${SEMANTIC_COUNT} tokens semánticos`,
              'Están en tokens.css con los valores del export de variables de Figma. La página los lee de ahí: no hay hex escritos a mano.',
            ],
            [
              'Guía anterior y tokens.css',
              `La guía anterior nombraba 10 tonos del primario; el código tiene ${primarios.length} (${rangeLabel(primarios)}). Varios hex de la guía anterior no coinciden con tokens.css: la página muestra los del código.`,
            ],
            ['Divider sin grupo propio', `No hay tokens divider en tokens.css: los divisores usan ${dividerUse.join(' y ')}.`],
            ...(directValueTokens(semantic.graphics).length > 0
              ? [['Valores sin primitivo', `${directValueTokens(semantic.graphics).map(tokenName).join(' y ')} tienen un hex propio. Falta decidir si pasan a un primitivo.`]]
              : []),
            ['Nombres con erratas', 'Los tokens conservan los nombres de Figma (firts, acent, purpple). Corregirlos cambia las variables y las utilidades de todo el código.'],
            ...LOW_PAIRS.map((p) => [`${p.label} (${THEME_LABELS[p.theme].toLowerCase()})`, `${ratioText(p.ratio)}, por debajo de 4,5:1. Pendiente con diseño.`]),
          ],
        },
      ],
    },
  ],
};
