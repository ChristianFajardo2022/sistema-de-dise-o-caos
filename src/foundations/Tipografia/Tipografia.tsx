import type { CSSProperties, ReactNode } from 'react';
import {
  BREAKPOINT_LABELS,
  DocFigure,
  DocList,
  DocSection,
  DocSubsection,
  DocText,
  DocToc,
  FoundationPage,
  TokenChip,
  TokenTable,
  px as pxValue,
  resolveToken,
  stripPx,
  tokensIn,
} from '../_doc';
import type { TokenBreakpoint } from '../_doc';
import iconSvg from '../../../icons/caos/line/text.svg?raw';
import tarjetaImg from './assets/jerarquia-tarjeta-de-seguimiento.png';
import selectorImg from './assets/jerarquia-selector-documento.png';
import cargaImg from './assets/jerarquia-carga-de-archivos.png';

export type TipografiaTab = 'definicion' | 'parametros' | 'accesibilidad';

const BREAKPOINTS: TokenBreakpoint[] = ['mobile', 'tablet', 'desktop'];
const PRIMARY = 'var(--ds-primitives-typography-family-primary)';
const SECONDARY = 'var(--ds-primitives-typography-family-secondary)';

/** Orden de las tallas de los tokens (xs → 6xl); `md-uniform` va justo después de `md`. */
const SIZE_ORDER = ['xs', 'sm', 'md', 'md-uniform', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];

/** Valor numérico en px de un token (sin unidad), o "—" si no existe. */
function px(name: string, bp: TokenBreakpoint): string {
  return resolveToken(name, 'dark', bp) ? String(pxValue(name, bp)) : '—';
}

/** Nombres de todos los tokens `--ds-responsive-typography-<categoría>-size-<talla>`, ordenados por talla. */
function sizeTokens(category: string): { size: string; sizeVar: string }[] {
  const prefix = `--ds-responsive-typography-${category}-size-`;
  const found = new Set<string>();
  for (const scope of ['common', 'tablet', 'desktop'] as const) {
    for (const key of tokensIn(scope).keys()) if (key.startsWith(prefix)) found.add(key.slice(prefix.length));
  }
  return [...found]
    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b))
    .map((size) => ({ size, sizeVar: `${prefix}${size}` }));
}

interface StyleGroup {
  title: string;
  category: string;
  /** Variable de altura de línea para una talla; `undefined` si la categoría no la define */
  lineHeightVar?: (size: string) => string;
  weightVar: string;
  family: string;
  sample: (size: number) => string;
  note?: ReactNode;
}

const lh = (cat: string) => (size: string) => `--ds-responsive-typography-${cat}-line-height-${size}`;

const GROUPS: StyleGroup[] = [
  {
    title: 'Heading',
    category: 'heading',
    lineHeightVar: lh('heading'),
    weightVar: '--ds-primitives-typography-weight-semibold',
    family: SECONDARY,
    sample: (s) => (s > 32 ? 'Aa' : 'Envíos rápidos'),
  },
  {
    title: 'Body corto',
    category: 'body',
    lineHeightVar: (s) => `--ds-responsive-typography-body-line-height-short-${s}`,
    weightVar: '--ds-primitives-typography-weight-regular',
    family: PRIMARY,
    sample: () => 'Programa tu recogida',
  },
  {
    title: 'Body largo',
    category: 'body',
    lineHeightVar: (s) => `--ds-responsive-typography-body-line-height-large-${s}`,
    weightVar: '--ds-primitives-typography-weight-regular',
    family: PRIMARY,
    sample: () => 'Programa tu recogida',
  },
  {
    title: 'Button',
    category: 'button',
    weightVar: '--ds-primitives-typography-weight-semibold',
    family: PRIMARY,
    sample: () => 'Adjuntar',
    note: 'tokens.css no define altura de línea para Button: el interlineado es automático.',
  },
  {
    title: 'Field (label)',
    category: 'field',
    lineHeightVar: lh('field'),
    weightVar: '--ds-primitives-typography-weight-regular',
    family: PRIMARY,
    sample: () => 'Tipo de documento',
  },
];

/** Etiqueta "Semibold / 600" a partir del token de peso */
function weightLabel(weightVar: string): string {
  const name = weightVar.split('-').pop()!;
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} / ${resolveToken(weightVar, 'dark')}`;
}

/** Tabla de una categoría: token, peso, muestra viva y tamaño / altura de línea por breakpoint */
function StyleTable({ group }: { group: StyleGroup }) {
  const weight = resolveToken(group.weightVar, 'dark') ?? '400';
  const rows = sizeTokens(group.category)
    .map(({ size, sizeVar }) => ({ size, sizeVar, lhVar: group.lineHeightVar?.(size) }))
    // Body corto y largo comparten tallas; se descartan las que no tienen altura de línea propia
    .filter((r) => !group.lineHeightVar || resolveToken(r.lhVar!, 'dark', 'desktop') !== undefined);
  return (
    <TokenTable
      caption={`Estilos ${group.title}`}
      minWidth={900}
      columns={['Token', 'Peso', 'Muestra', ...BREAKPOINTS.map((bp) => `${BREAKPOINT_LABELS[bp].charAt(0).toUpperCase()}${BREAKPOINT_LABELS[bp].slice(1)}`)]}
      rows={rows.map(({ sizeVar, lhVar }) => {
        const style: CSSProperties = {
          fontFamily: group.family,
          fontWeight: Number(weight),
          fontSize: `var(${sizeVar})`,
          lineHeight: lhVar ? `var(${lhVar})` : 'normal',
        };
        const biggest = Number(px(sizeVar, 'desktop'));
        return [
          <span key="t" className="flex flex-col items-start gap-ds-space-general-sm">
            <TokenChip>{sizeVar.replace('--ds-responsive-', '')}</TokenChip>
            {lhVar && <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-gray">{lhVar.replace('--ds-responsive-', '')}</span>}
          </span>,
          <span key="w" className="whitespace-nowrap">{weightLabel(group.weightVar)}</span>,
          <span key="m" className="block max-w-56 overflow-hidden whitespace-nowrap text-ds-text-neutral-heading" style={style}>
            {group.sample(biggest)}
          </span>,
          ...BREAKPOINTS.map((bp) => (
            <span key={bp} className="whitespace-nowrap">
              {px(sizeVar, bp)}
              {lhVar ? ` / ${px(lhVar, bp)}` : ''}
            </span>
          )),
        ];
      })}
    />
  );
}

/** Muestra de una familia sobre fondo oscuro fijo (como la figura de Figma). */
function FamilySpecimen({ family, name }: { family: string; name: string }) {
  return (
    <DocFigure>
      <div
        role="img"
        aria-label={`Muestra de la fuente ${name}: Te damos la bienvenida`}
        className="flex min-h-48 items-center justify-center rounded-ds-radius-general-xl bg-ds-background-container-default-on-canva px-ds-space-general-4xl py-ds-primitives-space-6xl text-center text-ds-text-neutral-heading"
        style={{ fontFamily: family, fontWeight: 600, fontSize: 'var(--ds-responsive-typography-heading-size-xl)', lineHeight: 1.2 }}
      >
        Te damos la bienvenida
        <br />a los productos digitales de CAOS
      </div>
    </DocFigure>
  );
}

/** Peso Regular / Semibold / Bold, en recto y en cursiva, con las familias reales */
function WeightSpecimen() {
  const weights = ['regular', 'semibold', 'bold'] as const;
  const weightVar = {
    regular: '--ds-primitives-typography-weight-regular',
    semibold: '--ds-primitives-typography-weight-semibold',
    bold: '--ds-primitives-typography-weight-bold',
  } as const;
  return (
    <DocFigure className="overflow-x-auto">
      <div className="grid grid-cols-3 gap-y-ds-space-general-4xl text-center text-ds-text-neutral-heading">
        {(['normal', 'italic'] as const).flatMap((fontStyle) =>
          weights.map((w) => (
            <div key={`${w}-${fontStyle}`} className="flex flex-col items-center gap-ds-space-general-md">
              <span
                style={{
                  fontFamily: PRIMARY,
                  fontStyle,
                  fontWeight: `var(${weightVar[w]})`,
                  fontSize: 'var(--ds-primitives-typography-size-4xl)',
                  lineHeight: 1.2,
                }}
              >
                {w.charAt(0).toUpperCase() + w.slice(1)}
              </span>
              <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-gray">
                {resolveToken(weightVar[w], 'dark')}
                {fontStyle === 'italic' ? ' · italic' : ''}
              </span>
            </div>
          )),
        )}
      </div>
    </DocFigure>
  );
}

/** Tamaños primitivos de tokens.css, de mayor a menor, cada uno con una "A" real */
function SizeSpecimen() {
  const sizes = [...tokensIn('base'), ...tokensIn('common'), ...tokensIn('tablet'), ...tokensIn('desktop')]
    .filter(([k]) => /^--ds-primitives-typography-size-/.test(k))
    .map(([k, v]) => ({ name: k, value: Number(stripPx(v)) }))
    .sort((a, b) => b.value - a.value);
  const unique = sizes.filter((s, i) => sizes.findIndex((o) => o.name === s.name) === i);
  return (
    <DocFigure>
      <ul className="m-0 grid list-none grid-cols-2 gap-ds-space-general-4xl p-0 tablet:grid-cols-4 desktop:grid-cols-6">
        {unique.map(({ name, value }) => (
          <li key={name} className="flex flex-col items-center justify-end gap-ds-space-general-md text-center">
            <span
              aria-hidden="true"
              className="text-ds-text-neutral-heading"
              style={{ fontFamily: PRIMARY, fontWeight: 700, fontSize: value, lineHeight: 1 }}
            >
              A
            </span>
            <span className="text-ds-primitives-typography-size-md font-semibold text-ds-text-neutral-heading">{value} px</span>
            <span className="text-ds-primitives-typography-size-sm break-all text-ds-text-neutral-gray">
              {name.replace('--ds-primitives-typography-', '')}
            </span>
          </li>
        ))}
      </ul>
    </DocFigure>
  );
}

/** Lista de estilos señalados en un ejemplo de jerarquía (columna izquierda, como las líneas guía de Figma) */
function Anotaciones({ estilos }: { estilos: string[] }) {
  return (
    <ul className="m-0 flex list-none flex-row flex-wrap gap-ds-space-general-md p-0 tablet:flex-col">
      {estilos.map((e, i) => (
        <li key={`${e}-${i}`}>
          <TokenChip>{e}</TokenChip>
        </li>
      ))}
    </ul>
  );
}

function EjemploJerarquia({ estilos, children }: { estilos: string[]; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-ds-space-general-2xl tablet:grid-cols-[12rem_1fr]">
      <Anotaciones estilos={estilos} />
      {children}
    </div>
  );
}

function Definicion(): ReactNode {
  return (
    <>
      <DocSection title="Definición">
        <DocText>
          La tipografía <strong>facilita la lectura, organiza la información en pantalla</strong> y garantiza una
          experiencia de usuario conversacional.
        </DocText>
      </DocSection>

      <DocToc
        items={[
          { id: 'tipografia-fuentes', label: 'Fuentes del sistema' },
          { id: 'tipografia-familia', label: 'Familia tipográfica y pesos' },
          { id: 'tipografia-tamanos', label: 'Tamaños permitidos' },
          { id: 'tipografia-interlineado', label: 'Interlineado y aplicación' },
          { id: 'tipografia-jerarquia', label: 'Jerarquía' },
        ]}
      />

      <DocSection title="Fuentes del sistema" id="tipografia-fuentes">
        <DocSubsection title="Helvetica Neue">
          <DocText>
            Es nuestra <strong>fuente primaria</strong>. Se utiliza en textos de cuerpo, formularios, tablas,
            notificaciones y elementos de interacción para garantizar la máxima legibilidad.
          </DocText>
          <FamilySpecimen family={PRIMARY} name="Helvetica Neue" />
        </DocSubsection>
        <DocSubsection title="Prospero">
          <DocText>
            Es nuestra <strong>fuente secundaria</strong>. Se utiliza en títulos principales, encabezados y pantallas
            de bienvenida.
          </DocText>
          <FamilySpecimen family={SECONDARY} name="Prospero" />
        </DocSubsection>
      </DocSection>

      <DocSection title="Familia tipográfica" id="tipografia-familia">
        <DocText>
          Definimos la jerarquía del sistema con los pesos <strong>Regular, Semibold y Bold</strong> y sus variantes
          Italic.
        </DocText>
        <WeightSpecimen />
      </DocSection>

      <DocSection title="Tamaños permitidos" id="tipografia-tamanos">
        <DocText>
          Definimos tamaños desde 10 px hasta 120 px, organizados en las categorías{' '}
          <strong>Display, Heading, Body, Button y Label</strong>. Cada tamaño está vinculado a un token.
        </DocText>
        <SizeSpecimen />
      </DocSection>

      <DocSection title="Interlineado" id="tipografia-interlineado">
        <DocText>
          El interlineado es la distancia vertical entre las líneas de un párrafo. Define la densidad de la interfaz y
          asegura una lectura fluida, evitando la superposición o la fatiga visual. Se calcula mediante dos ecuaciones
          estandarizadas:
        </DocText>
        <DocList
          items={[
            <>
              <strong>1.1 × tamaño de fuente</strong> para textos cortos y elementos de alta densidad.
            </>,
            <>
              <strong>1.2 × tamaño de fuente</strong> para textos largos y de lectura continua.
            </>,
          ]}
        />
        <DocText>Estas ecuaciones se aplican según el caso de uso, bajo los siguientes criterios:</DocText>
        <TokenTable
          caption="Interlineado por categoría"
          minWidth={720}
          columns={['Categoría', 'Valor', 'Aplicación']}
          rows={[
            ['Heading', '1.1', 'Títulos principales y encabezados de sección.'],
            ['Body largo', '1.1', 'Frases introductorias o destacadas breves, de 1 a 2 líneas.'],
            ['Body corto', '1.2', 'Bloques de texto denso, de 3 o más líneas, en modales explicativos, notificaciones y párrafos de ayuda.'],
            ['Button', 'Auto', 'Textos cortos dentro de botones.'],
            ['Label', '1.1', 'Etiquetas de campos de entrada, encabezados de tablas y badges.'],
          ]}
        />
        <DocSubsection title="¿Qué pasa si tengo decimales?">
          <DocText>Se redondea al número entero inferior, por ejemplo:</DocText>
          <DocFigure>
            <p className="m-0 flex flex-wrap items-center justify-center gap-ds-space-general-4xl text-ds-primitives-typography-size-lg text-ds-text-neutral-heading">
              <span>1.1 × 48</span>
              <span aria-hidden="true">=</span>
              <span>52.8</span>
              <span aria-hidden="true">→</span>
              <strong>52</strong>
            </p>
          </DocFigure>
        </DocSubsection>
      </DocSection>

      <DocSection title="Jerarquía" id="tipografia-jerarquia">
        <DocText>
          La jerarquía tipográfica garantiza claridad en la presentación de la información, permitiendo que los
          usuarios <strong>escaneen la información de forma efectiva</strong>.
        </DocText>

        <EjemploJerarquia estilos={['Display', 'Subheading', 'Body']}>
          <DocFigure>
            <div className="flex flex-col gap-ds-space-general-lg">
              <span
                className="text-ds-text-neutral-heading"
                style={{ fontFamily: SECONDARY, fontWeight: 600, fontSize: 'var(--ds-responsive-typography-heading-size-3xl)', lineHeight: 1.1 }}
              >
                Envíos rápidos
              </span>
              <span
                className="text-ds-text-neutral-heading"
                style={{ fontFamily: SECONDARY, fontWeight: 600, fontSize: 'var(--ds-responsive-typography-heading-size-xl)', lineHeight: 1.2 }}
              >
                Programa tu recogida sin salir de casa
              </span>
              <span className="max-w-[48ch] text-ds-primitives-typography-size-lg leading-normal text-ds-text-neutral-body">
                Elige el horario que prefieras y te avisamos cuando todo esté listo. Sigue cada paso del
                proceso desde tu aplicación.
              </span>
            </div>
          </DocFigure>
        </EjemploJerarquia>

        <EjemploJerarquia estilos={['Field / Category', 'Subheading', 'Body', 'Field / Label', 'Field / Number']}>
          <DocFigure
            className="mx-auto max-w-sm"
            image={tarjetaImg}
            alt="Tarjeta de seguimiento de un envío: la categoría «En ruta», el subtítulo «Tu envío está en tránsito», un cuerpo de texto con el detalle del recorrido, y al final la etiqueta «Total a pagar» con el valor $ 10.000."
          />
        </EjemploJerarquia>

        <EjemploJerarquia estilos={['Field / Input text', 'Field / Radio button']}>
          <DocFigure
            className="mx-auto max-w-sm"
            image={selectorImg}
            alt="Campo «Tipo de documento» con la opción «Cédula de ciudadanía» seleccionada y la lista desplegada con las opciones «Cédula de ciudadanía» y «Pasaporte»."
          />
        </EjemploJerarquia>

        <DocFigure
          image={cargaImg}
          alt="Ventana «Adjuntar documento» con una zona para arrastrar el archivo, el aviso de formato PDF o JPG con un máximo de 5 MB, una lista de archivos cargados y los botones Cancelar y Adjuntar. Líneas guía señalan los estilos Subheading, Body y Button."
        />
      </DocSection>
    </>
  );
}

function Parametros(): ReactNode {
  return (
    <>
      <DocSection title="Cuándo usar body vs. label">
        <DocText>
          El estilo <strong>Body</strong> se aplica en bloques de lectura de uno o más párrafos, así como en datos
          específicos (palabras cortas o valores numéricos) dentro de tablas y gráficos. Por otro lado, los{' '}
          <strong>Labels</strong> se reservan para elementos funcionales como campos de formulario, selectores,
          filtros, estados y categorización de información.
        </DocText>
      </DocSection>

      <DocSection title="Cuándo usar display vs. heading">
        <DocText>
          Implementamos el estilo <strong>Display</strong> en títulos que exigen el máximo protagonismo y peso visual
          en la interfaz. A diferencia de los <strong>Headings</strong>, que estructuran el contenido como títulos
          principales o secundarios con un impacto moderado, el estilo Display se reserva para piezas gráficas de alto
          relieve.
        </DocText>
      </DocSection>

      <DocSection title="Categorías tipográficas">
        <DocText>
          Se definen cinco categorías principales: <strong>Heading, Body, Button, Field y Graphic</strong>, las cuales
          se aplican a los distintos componentes que conforman los productos digitales de CAOS. Cada tabla lee
          tokens.css: las columnas Móvil, Tablet y Escritorio muestran el tamaño y la altura de línea en px
          (tamaño / altura) y la muestra se renderiza con las fuentes y los tokens reales. Los nombres de token llevan el prefijo{' '}
          <code>--ds-responsive-</code>; las variantes en cursiva usan los mismos valores con <code>font-style: italic</code>.
        </DocText>

        <DocSubsection title="Heading">
          <StyleTable group={GROUPS[0]} />
        </DocSubsection>

        <DocSubsection title="Body">
          <DocSubsection title="Texto largo">
            <DocText>
              Utilizamos el estilo de cuerpo de texto largo para párrafos con una extensión mayor a cuatro líneas o
              cuando el contenido requiere una estructura multipárrafo.
            </DocText>
            <StyleTable group={GROUPS[2]} />
          </DocSubsection>
          <DocSubsection title="Texto corto">
            <DocText>
              Aplicamos el estilo de cuerpo de texto corto para escenarios donde usamos un número reducido de palabras
              (palabras destacadas, valores numéricos, tablas y gráficas) o cuando es un párrafo de máximo tres líneas.
            </DocText>
            <StyleTable group={GROUPS[1]} />
          </DocSubsection>
          <DocText>
            En ambos estilos, el peso Semibold (<strong>{weightLabel('--ds-primitives-typography-weight-semibold')}</strong>) se usa
            para destacar palabras dentro del texto.
          </DocText>
        </DocSubsection>

        <DocSubsection title="Button">
          <StyleTable group={GROUPS[3]} />
          {GROUPS[3].note && <DocText>{GROUPS[3].note}</DocText>}
        </DocSubsection>

        <DocSubsection title="Label y Field">
          <DocText>
            Las tallas grandes se reservan para casos puntuales: la de 32 px es el tamaño sugerido para el campo de
            precio, y la de 20 px para campos de búsqueda principales.
          </DocText>
          <StyleTable group={GROUPS[4]} />
        </DocSubsection>
      </DocSection>
    </>
  );
}

function Accesibilidad(): ReactNode {
  return (
    <>
      <DocSection title="Accesibilidad">
        <DocText>
          Los parámetros de accesibilidad tipográfica cumplen con los requisitos de contraste, legibilidad y jerarquía,
          a través del uso correcto de los niveles H1, H2 y P. Esto garantiza escalabilidad, consistencia y
          adaptabilidad en los diferentes productos digitales de CAOS.
        </DocText>
      </DocSection>
      <DocSection title="Buenas prácticas en accesibilidad">
        <DocText>Dentro de las buenas prácticas de accesibilidad tipográfica se deben tener en cuenta las siguientes reglas:</DocText>
        <DocList
          items={[
            <>
              <strong>Jerarquía correcta:</strong> la estructura jerárquica debe respetar los niveles de información
              definidos: heading (H1), subheading (H2) y body (p), fortaleciendo los principios de SEO y accesibilidad.
            </>,
            <>
              <strong>Tamaños de texto para lectura:</strong> en textos de lectura continua, la tipografía debe ser
              superior a 16 px, lo que permite una lectura fluida, reduce la fatiga visual y mejora la comprensión de
              la información.
            </>,
            <>
              <strong>Alto contraste tipográfico:</strong> la tipografía debe mantener un alto contraste con el fondo.
              Se deben evitar colores neutros o cercanos a tonos claros que afecten la legibilidad. Se recomienda el uso
              de los códigos de color <strong>05 y 06 de los colores secundarios, terciarios y semánticos</strong> y{' '}
              <strong>del G08 al N01 de los colores primarios</strong>, los cuales cumplen con los parámetros de
              accesibilidad.
            </>,
          ]}
        />
        <DocFigure>
          <p className="m-0 text-ds-primitives-typography-size-lg leading-normal text-ds-text-neutral-body">
            <strong className="text-ds-text-neutral-heading">Validación de accesibilidad.</strong> Si quieres verificar
            si un elemento cumple con los parámetros de accesibilidad descritos en este documento, puedes usar las
            herramientas de accesibilidad de Adobe.
          </p>
        </DocFigure>
      </DocSection>
    </>
  );
}

/**
 * Página "Tipografía" de Fundamentos de diseño.
 * `initialTab` permite abrirla directamente en una pestaña (una historia por pestaña).
 */
export function Tipografia({ initialTab = 'definicion' }: { initialTab?: TipografiaTab }) {
  return (
    <FoundationPage
      iconSvg={iconSvg}
      title="Tipografía"
      subtitle="Fundamentos sobre los parámetros y aplicación de tipografía en los productos digitales de CAOS."
      initialTab={initialTab}
      tabs={[
        { id: 'definicion', label: 'Definición', content: <Definicion /> },
        { id: 'parametros', label: 'Parámetros', content: <Parametros /> },
        { id: 'accesibilidad', label: 'Accesibilidad', content: <Accesibilidad /> },
      ]}
    />
  );
}
