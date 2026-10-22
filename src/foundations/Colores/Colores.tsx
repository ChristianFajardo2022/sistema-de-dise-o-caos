import type { ReactNode } from 'react';
import {
  DocExternalLink,
  DocFigure,
  DocHeading,
  DocList,
  DocNote,
  DocSection,
  DocSubsection,
  DocText,
  DocToc,
  FoundationPage,
  TokenChip,
  TokenTable,
  contrast,
  onColor,
  resolveToken,
} from '../_doc';
import type { TokenTheme } from '../_doc';
import iconSvg from '../../../icons/caos/line/magic-star.svg?raw';
import { ColorTokenTable } from './ColorTokenTable';
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  THEMES,
  THEME_LABELS,
  colorInfo,
  countTokens,
  readExternalPrimitives,
  readPrimitiveFamilies,
  readSemanticColors,
} from './colorData';
import type { Primitive, PrimitiveFamily, TokenCategory } from './colorData';

export type ColoresTab = 'definicion' | 'parametros' | 'tokens' | 'accesibilidad';

/* ---------- Definición: paleta ---------- */

/** Muestra de un primitivo; si tokens.css lo redefine en un tema, la tarjeta se parte en dos mitades (oscuro | claro). */
function PrimitiveSwatch({ item }: { item: Primitive }) {
  const changes = item.value.dark !== item.value.light;
  const themes: TokenTheme[] = changes ? ['dark', 'light'] : ['light'];
  return (
    <li
      className="m-0 flex min-h-20 list-none overflow-hidden rounded-ds-radius-general-lg border border-ds-border-general-gray-fifth"
      aria-label={`${item.code} ${themes.map((t) => item.value[t]).join(' / ')}`}
    >
      {themes.map((t) => (
        <span
          key={t}
          className="flex flex-1 flex-col items-center justify-center gap-ds-space-general-sm p-ds-space-general-lg text-center"
          style={{ background: item.value[t], color: onColor(item.value[t]) }}
        >
          <span className="text-ds-primitives-typography-size-md font-semibold">{item.code}</span>
          <span className="text-ds-primitives-typography-size-sm">{item.value[t]}</span>
          {changes && <span className="text-ds-primitives-typography-size-sm opacity-80">{THEME_LABELS[t]}</span>}
        </span>
      ))}
    </li>
  );
}

function PrimitiveGrid({ items, label }: { items: Primitive[]; label: string }) {
  return (
    <ul
      aria-label={label}
      className="m-0 grid list-none grid-cols-2 gap-ds-space-general-md p-0 tablet:grid-cols-3 desktop:grid-cols-6"
    >
      {items.map((p) => (
        <PrimitiveSwatch key={p.variable} item={p} />
      ))}
    </ul>
  );
}

/** Tarjeta "principal" por tema: el token indica el color que adopta cada tema (leído de tokens.css) */
function PrincipalCard({ theme, token }: { theme: TokenTheme; token: string }) {
  const info = colorInfo(token, theme);
  const surface = resolveToken('--color-ds-background-container-surface', theme);
  const heading = resolveToken('--color-ds-text-neutral-heading', theme);
  if (!info) return null;
  return (
    <div
      className="flex items-center gap-ds-space-general-4xl rounded-ds-radius-container-on-canva border border-ds-border-general-gray-fifth p-ds-space-general-4xl"
      style={{ background: surface, color: heading }}
    >
      <span aria-hidden="true" className="size-20 shrink-0 rounded-ds-radius-general-md" style={{ background: info.css }} />
      <span className="flex flex-col gap-ds-space-general-sm text-ds-primitives-typography-size-md">
        <span className="text-ds-primitives-typography-size-lg font-semibold italic">{THEME_LABELS[theme]}</span>
        <span>{info.primitive}</span>
        <span>{info.hex}</span>
      </span>
    </div>
  );
}

function PrincipalPair({ token }: { token: string }) {
  return (
    <div className="grid grid-cols-1 gap-ds-space-general-2xl tablet:grid-cols-2">
      {THEMES.slice()
        .reverse()
        .map((t) => (
          <PrincipalCard key={t} theme={t} token={token} />
        ))}
    </div>
  );
}

function FamilyBlock({
  family,
  title,
  principal,
  id,
  children,
}: {
  family: PrimitiveFamily[];
  title: string;
  principal?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <DocSubsection title={title} id={id}>
      {children}
      {principal && <PrincipalPair token={principal} />}
      {family.map((f) => (
        <PrimitiveGrid key={f.id} items={f.items} label={`Primitivos ${f.label}`} />
      ))}
    </DocSubsection>
  );
}

function Definicion(): ReactNode {
  const families = readPrimitiveFamilies();
  const get = (...ids: string[]) => families.filter((f) => ids.includes(f.id));
  const external = readExternalPrimitives();
  return (
    <>
      <DocSection title="Definición">
        <DocText>
          La paleta de color de los productos digitales de CAOS <strong>estructura la jerarquía visual</strong> de la
          interfaz, asegura un alto contraste y garantiza la accesibilidad.
        </DocText>
      </DocSection>

      <DocToc
        items={[
          { id: 'colores-paleta', label: 'Paleta de color' },
          { id: 'colores-primario', label: 'Primario' },
          { id: 'colores-secundario', label: 'Secundario' },
          { id: 'colores-terciario', label: 'Terciario' },
          { id: 'colores-semanticos', label: 'Semánticos' },
        ]}
      />

      <DocSection title="Paleta de color" id="colores-paleta">
        <DocText>
          El sistema cromático se compone de colores primarios, secundarios, terciarios y semánticos. Define tonalidades
          dominantes, de acento y neutras. Cada muestra enseña el nombre corto del primitivo y su valor real en
          tokens.css.
        </DocText>

        <FamilyBlock family={get('primary')} title="Primario" id="colores-primario" principal="--color-ds-text-neutral-heading">
          <DocText>
            El negro digital es el color primario. <strong>Su uso corresponde al 80% de la interfaz</strong> y está
            destinado a las interacciones principales. En oscuro, el texto principal pasa a blanco digital (B01).
          </DocText>
        </FamilyBlock>

        <FamilyBlock family={get('secondary')} title="Secundario" id="colores-secundario" principal="--color-ds-text-link-default">
          <DocText>
            El azul digital actúa como color de acento de la marca y <strong>se utiliza en el 5% de la interfaz.</strong>{' '}
            Se aplica en las acciones secundarias del sistema.
          </DocText>
        </FamilyBlock>

        <FamilyBlock family={get('tertiary')} title="Terciario" id="colores-terciario" principal="--color-ds-icon-acent-secondary">
          <DocText>
            El morado digital funciona como color de acento de la marca y{' '}
            <strong>se utiliza en el 3% de la interfaz.</strong> Se aplica en las interacciones terciarias de los
            productos digitales.
          </DocText>
        </FamilyBlock>

        <FamilyBlock family={get('information', 'confirmation', 'alert', 'error')} title="Semánticos" id="colores-semanticos">
          <DocText>
            Los colores semánticos <strong>hacen parte del sistema de información y alertas</strong> de los productos
            digitales. Permiten al usuario evitar errores de interacción, confirmar acciones y recibir retroalimentación
            del sistema.
          </DocText>
          <div className="grid grid-cols-1 gap-ds-space-general-2xl tablet:grid-cols-2">
            {THEMES.slice()
              .reverse()
              .map((t) => (
                <PrincipalSemantic key={t} theme={t} />
              ))}
          </div>
        </FamilyBlock>

        {external.length > 0 && (
          <DocSubsection title="Primitivos externos">
            <DocText>
              tokens.css también define copias de algunos primitivos semánticos fuera de su familia. Su valor puede
              diferir del primitivo con el mismo nombre corto.
            </DocText>
            <PrimitiveGrid items={external} label="Primitivos externos" />
          </DocSubsection>
        )}
      </DocSection>
    </>
  );
}

const SEMANTIC_PRINCIPAL: [string, string][] = [
  ['Confirmación', '--color-ds-icon-semantic-success-firts'],
  ['Informativo', '--color-ds-icon-semantic-information-firts'],
  ['Alerta', '--color-ds-icon-semantic-alert-firts'],
  ['Error', '--color-ds-icon-semantic-error-firts'],
];

function PrincipalSemantic({ theme }: { theme: TokenTheme }) {
  const surface = resolveToken('--color-ds-background-container-surface', theme);
  const heading = resolveToken('--color-ds-text-neutral-heading', theme);
  return (
    <div
      className="flex flex-col gap-ds-space-general-2xl rounded-ds-radius-container-on-canva border border-ds-border-general-gray-fifth p-ds-space-general-4xl"
      style={{ background: surface, color: heading }}
    >
      <span className="text-ds-primitives-typography-size-lg font-semibold italic">{THEME_LABELS[theme]}</span>
      <ul className="m-0 grid list-none grid-cols-2 gap-ds-space-general-lg p-0">
        {SEMANTIC_PRINCIPAL.map(([label, token]) => {
          const info = colorInfo(token, theme);
          return (
            <li key={token} className="flex flex-col items-center gap-ds-space-general-md text-ds-primitives-typography-size-md">
              <span aria-hidden="true" className="h-12 w-full rounded-ds-radius-general-md" style={{ background: info?.css }} />
              <span>
                {label} · {info?.primitive}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Parámetros ---------- */

/** Porcentajes de dominancia documentados en Figma (norma de uso; los colores salen de tokens.css) */
const DOMINANCE: { label: string; percent: number; variable: string }[] = [
  { label: 'B01', percent: 50, variable: '--color-ds-primitives-color-primary-b01' },
  { label: 'N01', percent: 30, variable: '--color-ds-primitives-color-primary-n01' },
  { label: 'A05', percent: 5, variable: '--color-ds-primitives-color-secondary-a05' },
  { label: 'M05', percent: 3, variable: '--color-ds-primitives-color-tertiary-m05' },
  { label: 'V05', percent: 3, variable: '--color-ds-primitives-color-confirmation-v05' },
  { label: 'AI05', percent: 3, variable: '--color-ds-primitives-color-information-ai05' },
  { label: 'R05', percent: 3, variable: '--color-ds-primitives-color-error-r05' },
  { label: 'Y05', percent: 3, variable: '--color-ds-primitives-color-alert-y05' },
];

function DominanceBar() {
  return (
    <DocFigure caption="Proporción de cada color en la interfaz. Los colores son los primitivos de tokens.css.">
      <div className="flex flex-col gap-ds-space-general-2xl">
        <div role="img" aria-label={DOMINANCE.map((d) => `${d.label} ${d.percent}%`).join(', ')} className="flex h-20 overflow-hidden rounded-ds-radius-general-lg border border-ds-border-general-gray-fifth">
          {DOMINANCE.map((d) => {
            const hex = resolveToken(d.variable, 'light') ?? '#000000';
            return (
              <span
                key={d.label}
                className="flex items-center justify-center text-ds-primitives-typography-size-md font-semibold"
                style={{ flexGrow: d.percent, flexBasis: 0, background: `var(${d.variable})`, color: onColor(hex) }}
              >
                {d.percent >= 5 ? `${d.percent}%` : ''}
              </span>
            );
          })}
        </div>
        <ul className="m-0 grid list-none grid-cols-2 gap-ds-space-general-md p-0 text-ds-primitives-typography-size-md text-ds-text-neutral-body tablet:grid-cols-4">
          {DOMINANCE.map((d) => (
            <li key={d.label} className="flex items-center gap-ds-space-general-md">
              <span aria-hidden="true" className="size-4 shrink-0 rounded-full border border-ds-border-general-gray-fifth" style={{ background: `var(${d.variable})` }} />
              {d.label} · {d.percent} %
            </li>
          ))}
        </ul>
      </div>
    </DocFigure>
  );
}

const ROLES: { role: string; use: string; ids: string[] }[] = [
  { role: 'Dominante', use: 'Fondos, texto principal y superficies. Ocupan la mayor parte de la interfaz.', ids: ['primary'] },
  { role: 'Neutro', use: 'Texto secundario, bordes, divisores y estados inactivos.', ids: ['primary'] },
  { role: 'Acento', use: 'Acciones secundarias (azul) y terciarias (morado).', ids: ['secondary', 'tertiary'] },
  { role: 'Semántico', use: 'Confirmación, información, error y alerta.', ids: ['confirmation', 'information', 'error', 'alert'] },
];

function Parametros(): ReactNode {
  const families = readPrimitiveFamilies();
  return (
    <>
      <DocSection title="Dominancia de color">
        <DocText>
          El gráfico de porcentaje muestra la dominancia de un color frente a otro. En esta distribución, el blanco
          digital (B01) y sus tonalidades derivadas representan el 50% de la interfaz en los productos digitales,
          seguido del negro digital (N01) y sus tonalidades derivadas, con un 30%.{' '}
          <strong>
            Es importante regirse por los parámetros de dominancia de color definidos en el sistema de diseño, ya que
            estos garantizan una correcta aplicación, así como unidad y equilibrio visual.
          </strong>
        </DocText>
        <DominanceBar />
      </DocSection>

      <DocSection title="Roles de color">
        <DocText>
          El sistema de diseño define cuatro roles cromáticos: dominantes, neutros, de acento y semánticos. Esta
          definición aporta claridad sobre los usos del color en los productos digitales y los contrastes que pueden
          generarse dentro del sistema.
        </DocText>
        <TokenTable
          caption="Roles de color y primitivos que los componen"
          minWidth={720}
          columns={['Rol', 'Uso', 'Primitivos']}
          rows={ROLES.map((r) => [
            <strong key="r" className="text-ds-text-neutral-heading">{r.role}</strong>,
            r.use,
            <span key="p" className="flex flex-wrap gap-ds-space-general-sm">
              {families
                .filter((f) => r.ids.includes(f.id))
                .flatMap((f) => f.items.filter((_, i, a) => f.id !== 'primary' || (r.role === 'Dominante' ? i === 0 || i === a.length - 1 : i > 0 && i < a.length - 1)))
                .map((p) => (
                  <span
                    key={p.variable}
                    className="rounded-full border border-ds-border-general-gray-fifth px-ds-space-general-lg py-ds-space-general-sm text-ds-primitives-typography-size-sm"
                    style={{ background: p.value.light, color: onColor(p.value.light) }}
                  >
                    {p.code}
                  </span>
                ))}
            </span>,
          ])}
        />
      </DocSection>
    </>
  );
}

/* ---------- Tokens ---------- */

const CATEGORY_INTRO: Record<TokenCategory, string> = {
  text: 'Color del texto: encabezados, cuerpo, campos y mensajes semánticos.',
  buttons: 'Fondo, borde, ícono y texto de los botones en cada estado.',
  icon: 'Color de los íconos: generales, semánticos, de acento y de campos.',
  link: 'Color de los enlaces en cada estado.',
  background: 'Fondos de la interfaz por nivel de elevación: lienzo, tarjetas, campos, pestañas, tablas y semánticos.',
  border: 'Bordes de contenedores, campos y mensajes semánticos.',
  graphics: 'Colores de gráficos y fondos de elementos gráficos.',
  shadow: 'Color de las sombras en cada breakpoint.',
};

function Tokens(): ReactNode {
  const groups = readSemanticColors();
  return (
    <>
      <DocSection title="Tokens">
        <DocText>
          Los tokens semánticos de color se agrupan en categorías. Cada fila muestra el token, el color que adopta en
          los temas oscuro y claro, el primitivo al que apunta y su valor. Se generan leyendo tokens.css.
        </DocText>
        <ul className="m-0 flex list-none flex-wrap gap-ds-space-general-md p-0">
          {CATEGORY_ORDER.map((c) => (
            <li key={c}>
              <a
                href={`#colores-${c}`}
                className="inline-block rounded-full border border-ds-border-general-gray-fifth px-ds-space-general-2xl py-ds-space-general-md text-ds-primitives-typography-size-md text-ds-text-neutral-heading hover:bg-ds-background-tab-select-on-canva"
              >
                {CATEGORY_LABELS[c]} ({countTokens(groups[c])})
              </a>
            </li>
          ))}
        </ul>
      </DocSection>
      {CATEGORY_ORDER.map((c) => (
        <div key={c} id={`colores-${c}`} className="scroll-mt-ds-space-general-4xl">
          <DocSection title={CATEGORY_LABELS[c]}>
            <DocText>{CATEGORY_INTRO[c]}</DocText>
            {groups[c].map((g) => (
              <div key={g.group} className="flex flex-col gap-ds-space-general-lg">
                {groups[c].length > 1 && <DocHeading size="sm" className="mt-ds-space-general-2xl capitalize">{g.group}</DocHeading>}
                <ColorTokenTable caption={`Tokens ${CATEGORY_LABELS[c]} ${g.group}`} tokens={g.tokens} />
              </div>
            ))}
          </DocSection>
        </div>
      ))}
    </>
  );
}

/* ---------- Accesibilidad ---------- */

/** Pares texto/fondo que se miden: los ratios salen de los valores reales de tokens.css en cada tema */
const PAIRS: { label: string; fg: string; bg: string }[] = [
  { label: 'Texto de encabezado sobre superficie', fg: '--color-ds-text-neutral-heading', bg: '--color-ds-background-container-surface' },
  { label: 'Texto de cuerpo sobre superficie', fg: '--color-ds-text-neutral-body', bg: '--color-ds-background-container-surface' },
  { label: 'Texto gris sobre superficie', fg: '--color-ds-text-neutral-gray', bg: '--color-ds-background-container-surface' },
  { label: 'Texto de cuerpo sobre contenedor del lienzo', fg: '--color-ds-text-neutral-body', bg: '--color-ds-background-container-default-on-canva' },
  { label: 'Enlace sobre superficie', fg: '--color-ds-text-link-default', bg: '--color-ds-background-container-surface' },
  { label: 'Texto del botón primario sobre su fondo', fg: '--color-ds-text-button-primary-default', bg: '--color-ds-background-button-primary-default' },
  { label: 'Texto éxito sobre su fondo semántico', fg: '--color-ds-text-semantic-success', bg: '--color-ds-background-semantic-success-firts' },
  { label: 'Texto informativo sobre su fondo semántico', fg: '--color-ds-text-semantic-information', bg: '--color-ds-background-semantic-information-firts' },
  { label: 'Texto de alerta sobre su fondo semántico', fg: '--color-ds-text-semantic-alert', bg: '--color-ds-background-semantic-alert-firts' },
  { label: 'Texto de error sobre su fondo semántico', fg: '--color-ds-text-semantic-error', bg: '--color-ds-background-semantic-error-firts' },
];

function RatioCell({ fg, bg, theme }: { fg: string; bg: string; theme: TokenTheme }) {
  const f = colorInfo(fg, theme);
  const b = colorInfo(bg, theme);
  if (!f || !b) return <span className="text-ds-text-neutral-gray">—</span>;
  const ratio = contrast(f.hex, b.hex);
  const level = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'No cumple AA';
  return (
    <span className="flex items-center gap-ds-space-general-xl whitespace-nowrap">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-ds-radius-general-md border border-ds-border-general-gray-fifth font-semibold"
        style={{ background: b.css, color: f.css }}
      >
        Aa
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-ds-text-neutral-heading">{ratio.toFixed(2)}:1</span>
        <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-gray">{level}</span>
      </span>
    </span>
  );
}

function Accesibilidad(): ReactNode {
  return (
    <>
      <DocSection title="Accesibilidad">
        <DocText>
          La paleta de color se define bajo las Directrices de Accesibilidad al Contenido Web (WCAG 2) y cumple con los
          parámetros de contraste establecidos: <strong>4.5:1 para el nivel AA y 7:1 para el nivel AAA.</strong>
        </DocText>
        <DocText>
          Esto garantiza que los productos digitales de CAOS sean accesibles, especialmente para personas con
          discapacidad visual. Para cumplir con estos requisitos, se diseñó una paleta de color versátil, con contrastes
          medios y altos, aplicada principalmente en textos, tarjetas, botones y campos de texto en relación con sus
          fondos, lo que asegura una correcta legibilidad.
        </DocText>
      </DocSection>

      <DocSection title="Contrastes de la paleta">
        <DocText>
          Ratios calculados con la fórmula de WCAG 2 a partir de los valores reales de tokens.css en cada tema.
        </DocText>
        <TokenTable
          caption="Contraste de pares de texto y fondo en tema oscuro y claro"
          minWidth={720}
          columns={['Par', 'Tokens', ...THEMES.map((t) => THEME_LABELS[t])]}
          rows={PAIRS.map((p) => [
            p.label,
            <span key="t" className="flex flex-col gap-ds-space-general-sm">
              <TokenChip>{p.fg.replace('--color-', '')}</TokenChip>
              <TokenChip>{p.bg.replace('--color-', '')}</TokenChip>
            </span>,
            ...THEMES.map((t) => <RatioCell key={t} fg={p.fg} bg={p.bg} theme={t} />),
          ])}
        />
      </DocSection>

      <DocSection title="Buenas prácticas en accesibilidad">
        <DocText>
          Dentro de las buenas prácticas de accesibilidad del color, se deben tener en cuenta las siguientes reglas de
          aplicación:
        </DocText>
        <DocSubsection title="Altos contrastes">
          <DocText>
            El uso adecuado de altos contrastes{' '}
            <strong>permite que el usuario comprenda claramente la información presentada</strong> y complete
            correctamente las tareas dentro del sistema. En la construcción de la paleta se generaron altos contrastes
            entre diferentes colores y tonalidades, guiados por los parámetros 4.5:1 para nivel AA y 7:1 para nivel AAA,
            los cuales se cumplen tanto en formato claro como en oscuro.
          </DocText>
          <DocList
            items={[
              <>
                En formato claro, los tonos oscuros del primario y los grises hasta el nivel medio, y los tonos 05 y 06
                de las demás familias, <strong>sobre fondos claros</strong> (B01 y tonos 01 o 02).
              </>,
              <>
                En formato oscuro, el blanco digital, los grises claros y los tonos 01 y 02{' '}
                <strong>sobre fondos oscuros</strong> (negro digital, grises oscuros y tonos 06).
              </>,
            ]}
          />
        </DocSubsection>
        <DocSubsection title="Creación de estados">
          <DocText>
            La paleta permite identificar claramente los diferentes estados de interacción de un componente dentro del
            sistema de diseño, mitigando problemas de accesibilidad y guiando de forma intuitiva al usuario. Gracias a{' '}
            <strong>la versatilidad de sus tonalidades, un componente puede cubrir estados como activo, inactivo, presionado</strong>,
            entre otros. Un ejemplo común es la interacción del usuario con un botón en sus distintos estados.
          </DocText>
        </DocSubsection>
        <DocSubsection title="Evitar la coexistencia de ciertos colores">
          <DocText>
            Dentro del sistema de diseño existen combinaciones de color que requieren precaución al coexistir en un
            mismo entorno digital, como <strong>verde/rojo y amarillo/azul</strong>, ya que pueden no distinguirse
            claramente en personas con daltonismo. Se recomienda evitar estas combinaciones o, en caso de ser necesarias,
            acompañarlas de elementos adicionales que faciliten su diferenciación, como{' '}
            <strong>iconografía o textos descriptivos</strong>.
          </DocText>
        </DocSubsection>
        <DocNote title="Validación de accesibilidad">
          <span>
            Si quieres verificar si un elemento cumple con los parámetros de accesibilidad descritos en este documento,
            puedes usar el{' '}
            <DocExternalLink href="https://color.adobe.com/es/create/color-contrast-analyzer">
              comprobador de contraste de Adobe
            </DocExternalLink>
            .
          </span>
        </DocNote>
      </DocSection>
    </>
  );
}

/**
 * Página "Colores" de Fundamentos de diseño.
 * `initialTab` permite abrirla directamente en una pestaña (una historia por pestaña).
 */
export function Colores({ initialTab = 'definicion' }: { initialTab?: ColoresTab }) {
  return (
    <FoundationPage
      iconSvg={iconSvg}
      title="Colores"
      subtitle="Fundamentos y lineamientos para el uso del color en los productos digitales de CAOS."
      initialTab={initialTab}
      tabs={[
        { id: 'definicion', label: 'Definición', content: <Definicion /> },
        { id: 'parametros', label: 'Parámetros', content: <Parametros /> },
        { id: 'tokens', label: 'Tokens', content: <Tokens /> },
        { id: 'accesibilidad', label: 'Accesibilidad', content: <Accesibilidad /> },
      ]}
    />
  );
}
