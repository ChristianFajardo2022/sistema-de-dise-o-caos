import type { ReactNode } from 'react';
import {
  BREAKPOINT_LABELS,
  DocFigure,
  DocList,
  DocSection,
  DocSubsection,
  DocText,
  DocNote,
  FoundationPage,
  TokenChip,
  TokenTable,
  px,
  tokensIn,
} from '../_doc';
import type { TokenBreakpoint } from '../_doc';
import iconSvg from '../../../icons/caos/line/grid.svg?raw';
import panelEstiramiento from './assets/panel-guias-estiramiento.png';
import panelCentro from './assets/panel-guias-centro.png';
import panelDerecha from './assets/panel-guias-derecha.png';
import { COLUMN_CLASS, GridDiagram, Legend, MARGIN_CLASS, PANEL_CLASS, ScreenRow } from './GridDiagram';

export type ReticulasTab = 'definicion' | 'valores-de-token' | 'aplicacion';

const BREAKPOINTS: TokenBreakpoint[] = ['mobile', 'tablet', 'desktop'];

/** Medidas de la retícula en un breakpoint, leídas de tokens.css */
function spec(bp: TokenBreakpoint) {
  return {
    width: px('--ds-responsive-dimention-canva-width', bp),
    height: px('--ds-responsive-dimention-canva-height', bp),
    columns: px('--ds-responsive-column-default', bp),
    gutter: px('--ds-responsive-gutter-default', bp),
    lateral: px('--ds-responsive-space-canva-lateral', bp),
    lateralWeb: px('--ds-responsive-space-canva-lateral-web', bp),
    top: px('--ds-responsive-space-canva-top', bp),
    bottom: px('--ds-responsive-space-canva-bottom', bp),
  };
}

/** Inicio de cada breakpoint en px (los umbrales de tokens.css están en rem) */
function breakpointStart(bp: TokenBreakpoint): number {
  if (bp === 'mobile') return 0;
  const rem = parseFloat(tokensIn('theme').get(`--breakpoint-${bp}`) ?? '0');
  return rem * 16;
}

function breakpointRange(bp: TokenBreakpoint): string {
  const next = BREAKPOINTS[BREAKPOINTS.indexOf(bp) + 1];
  const start = breakpointStart(bp);
  return next ? `${start} – ${breakpointStart(next) - 1} px` : `${start} px en adelante`;
}

const columnsLabel = (n: number) => `${n} columnas`;

/** Valores de la retícula secundaria definidos en Figma; tokens.css todavía no los tiene (pendiente en tokens) */
const SECONDARY = {
  mobile: { open: 'Pantalla completa', closed: '80 px de alto', openSize: 0, closedSize: 80, width: 376, height: 812 },
  tablet: { open: '240 px', closed: '80 px de ancho', openSize: 240, closedSize: 80, width: 768, height: 1024 },
  desktop: { open: '300 px', closed: '120 px de ancho', openSize: 300, closedSize: 120, width: 1440, height: 1080 },
} as const;

/** Medidas del lienzo de tablet según tokens.css */
const TABLET = spec('tablet');

const SCREENS = [
  { label: 'Móvil', width: 376, height: 800 },
  { label: 'Tablet', width: TABLET.width, height: TABLET.height },
  { label: 'Escritorio', width: 1440, height: 1024 },
  { label: 'Escritorio', width: 1920, height: 1080 },
];

function Definicion(): ReactNode {
  const specs = BREAKPOINTS.map((bp) => ({ bp, ...spec(bp) }));
  const d = specs[2];
  return (
    <>
      <DocSection title="Definición">
        <DocText>
          La retícula es la estructura que organiza los elementos visuales en pantalla. Garantiza un maquetado
          consistente, proporcional y adaptable en todos los dispositivos y puntos de contacto de los productos digitales
          de CAOS.
        </DocText>
      </DocSection>

      <DocSection title="Pantallas">
        <DocText>
          Definimos cuatro formatos estándar para la creación de prototipos e interfaces, asegurando la adaptabilidad
          responsiva en cada proyecto de diseño:
        </DocText>
        <DocList items={['Móvil: 376 px.', 'Tablet: 768 px.', 'Escritorio: 1440 px.', 'Escritorio: 1920 px.']} />
        <DocNote>Figma documenta la tablet con 834 px en el texto y 744 px en la retícula derecha; tokens.css fija el lienzo de tablet en 768 px, valor que se usa en esta página.</DocNote>
        <DocFigure caption="Formatos de pantalla a la misma escala (ancho × alto del lienzo de trabajo).">
          <ScreenRow
            name="Formatos de pantalla a escala"
            screens={SCREENS.map((s) => ({
              width: s.width,
              node: (
                <figure className="m-0 flex flex-col items-center gap-ds-space-general-lg">
                  <div
                    className="w-full border border-ds-border-general-gray-fifth bg-ds-background-container-default-on-canva"
                    style={{ aspectRatio: `${s.width} / ${s.height}` }}
                  >
                    <div className="h-[4%] bg-ds-text-neutral-heading" />
                  </div>
                  <figcaption className="text-center text-ds-primitives-typography-size-sm leading-snug text-ds-text-neutral-body">
                    {s.label}
                    <br />
                    {s.width} × {s.height}
                  </figcaption>
                </figure>
              ),
            }))}
          />
        </DocFigure>
      </DocSection>

      <DocSection title="Estructura de la retícula">
        <DocText>
          La retícula se estructura sobre <strong>tres parámetros esenciales: columnas, canales (gutters) y márgenes</strong>.
          Estos elementos garantizan la consistencia visual de la interfaz y facilitan la adaptación responsiva del
          contenido a los distintos formatos de pantalla.
        </DocText>
        <DocFigure caption={`Retícula de escritorio dibujada con los valores de tokens.css: margen de ${d.lateral} px, canal de ${d.gutter} px y ${d.columns} columnas.`}>
          <div className="flex flex-col gap-ds-space-general-4xl">
            <GridDiagram width={d.width} height={420} columns={d.columns} gutter={d.gutter} lateral={d.lateral} />
            <Legend
              items={[
                { className: MARGIN_CLASS, label: `Margen (${d.lateral} px)` },
                { className: COLUMN_CLASS, label: 'Columna' },
                { className: 'bg-ds-background-container-default-on-canva', label: `Canal (${d.gutter} px)` },
              ]}
            />
          </div>
        </DocFigure>
      </DocSection>

      <DocSection title="Retículas">
        <DocText>
          Las retículas se configuran bajo los <strong>parámetros de Bootstrap</strong>, utilizando una guía base de 12
          columnas. A partir de esta base <strong>se generan configuraciones de 4, 6 o 12 columnas</strong>, según el
          formato de pantalla y el caso de uso.
        </DocText>
        <DocText>Este sistema permite mantener coherencia estructural y adaptabilidad entre dispositivos.</DocText>
        <DocFigure caption="Una retícula por formato, dibujada a la misma escala.">
          <ScreenRow
            name="Retículas de 4, 6 y 12 columnas"
            screens={specs.map((s) => ({
              width: s.width,
              node: (
                <GridDiagram
                  width={s.width}
                  height={s.height}
                  columns={s.columns}
                  gutter={s.gutter}
                  lateral={s.lateral}
                  label={
                    <>
                      <strong className="text-ds-text-neutral-heading">{columnsLabel(s.columns)}</strong>
                      <br />
                      {s.width} px
                    </>
                  }
                />
              ),
            }))}
          />
        </DocFigure>
        <TokenTable
          caption="Columnas por breakpoint"
          minWidth={480}
          columns={['Valor', 'Definición']}
          rows={specs.map((s) => [columnsLabel(s.columns), breakpointRange(s.bp)])}
        />
      </DocSection>

      <DocSection title="Breakpoints">
        <DocText>
          Los breakpoints definen los puntos de transición entre versiones de una interfaz (móvil, tablet y escritorio).
          Indican cuándo el diseño debe adaptarse ante cambios en el tamaño de pantalla.
        </DocText>
        <DocText>
          En cada breakpoint se establecen parámetros específicos como número de columnas, márgenes y espaciados,
          permitiendo reorganizar el contenido de manera clara y funcional, según el dispositivo.
        </DocText>

        <DocSubsection title="Márgenes laterales">
          <DocText>Se definen dos tipos de márgenes laterales:</DocText>
          <DocList
            items={[
              <>
                <strong>Variables:</strong> presentan diferentes valores según el breakpoint. Aplican para sitios web y
                landing pages.
              </>,
              <>
                <strong>Fijas:</strong> mantienen el mismo valor en todos los breakpoints. Aplican para aplicaciones web y
                móviles.
              </>,
            ]}
          />
          <DocFigure caption="Márgenes variables (sitios web y landing pages): el margen lateral cambia en cada breakpoint.">
            <ScreenRow
              name="Márgenes laterales variables"
              screens={specs.map((s) => ({
                width: s.width,
                node: <GridDiagram width={s.width} height={s.height} columns={s.columns} gutter={s.gutter} lateral={s.lateralWeb} chrome label={`${s.lateralWeb} px`} />,
              }))}
            />
          </DocFigure>
          <DocFigure caption="Márgenes fijas (aplicaciones web y móviles): se mantienen los valores definidos por el sistema.">
            <ScreenRow
              name="Márgenes laterales fijas"
              screens={specs.map((s) => ({
                width: s.width,
                node: <GridDiagram width={s.width} height={s.height} columns={s.columns} gutter={s.gutter} lateral={s.lateral} chrome label={`${s.lateral} px`} />,
              }))}
            />
          </DocFigure>
        </DocSubsection>

        <DocSubsection title="Márgenes superior e inferior">
          <DocText>
            En las márgenes superior e inferior <strong>se estandarizan tres rangos de medidas para todos los productos digitales</strong>,
            independientemente de si son fijas o variables. Ten en cuenta que:
          </DocText>
          <DocList items={['El margen superior se aplica después de la barra de navegación.', 'El margen inferior se aplica antes del pie de página.']} />
          <DocText>Esta configuración garantiza uniformidad en la estructura vertical de las pantallas.</DocText>
          <DocFigure caption="Barra de navegación arriba, pie de página abajo y, entre ellos y la retícula, los márgenes superior e inferior.">
            <ScreenRow
              name="Márgenes superior e inferior"
              screens={specs.map((s) => ({
                width: s.width,
                node: (
                  <GridDiagram
                    width={s.width}
                    height={s.height}
                    columns={s.columns}
                    gutter={s.gutter}
                    lateral={s.lateral}
                    top={s.top}
                    bottom={s.bottom}
                    chrome
                    label={
                      <>
                        Superior {s.top} px
                        <br />
                        Inferior {s.bottom} px
                      </>
                    }
                  />
                ),
              }))}
            />
          </DocFigure>
        </DocSubsection>
      </DocSection>

      <DocSection title="Retícula con función secundaria">
        <DocText>
          En una retícula con función secundaria <strong>pueden coexistir dos estructuras dentro de una misma pantalla</strong>:
          una retícula base y una retícula secundaria.
        </DocText>
        <DocText>Se establecen lineamientos específicos de tamaño y comportamiento según el caso de uso.</DocText>

        <DocSubsection title="Retícula móvil">
          <DocText>
            En la versión móvil, la retícula secundaria se establece como pantalla completa y se superpone sobre la
            retícula base, similar al comportamiento de un menú principal.
          </DocText>
          <DocText>Cuando se contrae, se alinea en la parte superior con una altura estándar de 80 px.</DocText>
          <DocFigure caption="Retícula secundaria en móvil: desplegada (pantalla completa) y contraída (80 px de alto).">
            <div className="mx-auto flex max-w-[480px] items-end gap-ds-space-general-4xl">
              <GridDiagram className="flex-1" width={376} height={812} columns={4} gutter={16} lateral={16} secondary={{ side: 'full', size: 0 }} label="Pantalla completa" />
              <GridDiagram className="flex-1" width={376} height={812} columns={4} gutter={16} lateral={16} secondary={{ side: 'top', size: 80 }} label="80 px" />
            </div>
          </DocFigure>
        </DocSubsection>

        <DocSubsection title="Retícula tablet y desktop">
          <DocText>En tablet y escritorio, la retícula base se configura entre 6 y 12 columnas.</DocText>
          <DocText>La <strong>retícula secundaria</strong> tiene un ancho de:</DocText>
          <DocList items={['240 px en tablet.', '300 px en escritorio.']} />
          <DocText><strong>Cuando se pliega</strong>, sus valores son:</DocText>
          <DocList items={['80 px en tablet.', '120 px en escritorio.']} />
          <DocText>
            En tablet, la retícula secundaria puede superponerse sobre la base, generando una columna plegable que facilita
            la adaptación del contenido.
          </DocText>
          <DocFigure caption="Arriba, la retícula secundaria desplegada; abajo, plegada.">
            <div className="flex flex-col gap-ds-space-general-4xl">
              {(['open', 'closed'] as const).map((state) => (
                <ScreenRow
                  key={state}
                  name={state === 'open' ? 'Retícula secundaria desplegada' : 'Retícula secundaria plegada'}
                  screens={(['tablet', 'desktop'] as const).map((bp) => {
                    const s = spec(bp);
                    const sec = SECONDARY[bp];
                    return {
                      width: s.width,
                      node: (
                        <GridDiagram
                          width={s.width}
                          height={s.height}
                          columns={s.columns}
                          gutter={s.gutter}
                          lateral={s.lateral}
                          secondary={{ side: 'left', size: state === 'open' ? sec.openSize : sec.closedSize }}
                          label={`${s.width} px · ${state === 'open' ? sec.open : sec.closed}`}
                        />
                      ),
                    };
                  })}
                />
              ))}
            </div>
          </DocFigure>
          <DocNote>Los anchos de la retícula secundaria aún no existen como token.</DocNote>
        </DocSubsection>
      </DocSection>
    </>
  );
}

const TOKEN_ROWS: { prop: string; variable: string; utility: string }[] = [
  { prop: 'Columnas', variable: '--ds-responsive-column-default', utility: 'grid-cols-ds-default' },
  { prop: 'Canal', variable: '--ds-responsive-gutter-default', utility: 'gap-ds-gutter-default' },
  { prop: 'Margen lateral (fijo)', variable: '--ds-responsive-space-canva-lateral', utility: 'px-ds-space-canva-lateral' },
  { prop: 'Margen lateral (web)', variable: '--ds-responsive-space-canva-lateral-web', utility: 'px-ds-space-canva-lateral-web' },
  { prop: 'Margen superior', variable: '--ds-responsive-space-canva-top', utility: 'pt-ds-space-canva-top' },
  { prop: 'Margen inferior', variable: '--ds-responsive-space-canva-bottom', utility: 'pb-ds-space-canva-bottom' },
];

function ValoresDeToken(): ReactNode {
  const specs = BREAKPOINTS.map((bp) => ({ bp, ...spec(bp) }));
  const u = (n: number) => `${n} px`;
  return (
    <>
      <DocSection title="Especificaciones de retícula">
        <DocText>
          Al diseñar con retículas (fijas o variables) en Figma, es fundamental <strong>ajustar los parámetros de las guías según su comportamiento</strong>.
          Cada tipo de retícula requiere una configuración específica de márgenes y columnas para garantizar la correcta
          adaptación de los elementos en distintos dispositivos.
        </DocText>

        <DocSubsection title="Retícula estrecha">
          <DocText>
            Al implementar retículas dentro de la interfaz, <strong>se utiliza el parámetro de tipo Elástico (Stretch) en la configuración de guías</strong>{' '}
            (ver imagen). Esto permite mantener consistencia en los márgenes entre pantallas.
          </DocText>
          <DocText>
            Este parámetro se aplica en productos con márgenes fijas definidas por sistema, como aplicaciones (que cuentan
            con tres tipos de márgenes) y sitios web con pantallas menores a 1512 px.
          </DocText>
          <DocFigure image={panelEstiramiento} alt="Panel de guías de Figma con tipo Stretch: 12 columnas, margen 120 y canal 16. A la derecha, una retícula de 12 columnas con márgenes de 120 px a cada lado." />
        </DocSubsection>

        <DocSubsection title="Retícula central (más de 1920 px)">
          <DocText>
            La retícula central se aplica en casos específicos cuando una pantalla supera los 1920 px. En este escenario,{' '}
            <strong>el tipo de guía cambia de Elástico (Stretch), que cuenta con un margen de valor fijo, a guía Central</strong>.
          </DocText>
          <DocText>
            En la guía Central, el contenido de la retícula mantiene un ancho fijo y los márgenes laterales se expanden
            proporcionalmente. Este comportamiento aplica únicamente en productos web.
          </DocText>
          <DocFigure image={panelCentro} alt="Panel de guías de Figma con tipo Center: 12 columnas, ancho de columna 65 y canal 16. A la derecha, la retícula centrada con márgenes laterales que crecen." />
        </DocSubsection>

        <DocSubsection title="Tabla de especificaciones">
          <DocText>
            Valores leídos de tokens.css para cada breakpoint. El margen lateral web es el variable (sitios web y landing pages);
            el de apps es el fijo (aplicaciones).
          </DocText>
          <TokenTable
            caption="Especificaciones de la retícula por breakpoint"
            minWidth={780}
            columns={['Breakpoint', 'Rango', 'Columnas', 'Lateral web', 'Lateral apps', 'Superior', 'Inferior', 'Canal']}
            rows={specs.map((s) => [
              BREAKPOINT_LABELS[s.bp],
              breakpointRange(s.bp),
              s.columns,
              u(s.lateralWeb),
              u(s.lateral),
              u(s.top),
              u(s.bottom),
              u(s.gutter),
            ])}
          />
          <TokenTable
            caption="Tokens de la retícula"
            minWidth={720}
            columns={['Parámetro', 'Variable', 'Utilidad de Tailwind']}
            rows={TOKEN_ROWS.map((t) => [t.prop, <TokenChip key="v">{t.variable}</TokenChip>, <TokenChip key="u">{t.utility}</TokenChip>])}
          />
          <DocNote>
            Los breakpoints intermedios aún no existen como token: la guía de diseño define seis cortes web (hasta 643,
            644–1079, 1080–1339, 1340–1439, 1440–1919 y desde 1920 px) con márgenes laterales de 24, 32, 80, 160, 240 y
            más de 240 px, y tokens.css solo define tres breakpoints (móvil, tablet y escritorio).
          </DocNote>
        </DocSubsection>

        <DocSubsection title="Retícula derecha">
          <DocText>
            En la retícula base debe adoptarse una alineación de tipo derecha, manteniendo los parámetros de retícula fija
            y sus valores de margen (ver esquema).
          </DocText>
          <DocFigure image={panelDerecha} alt="Panel de guías de Figma con tipo Right: 12 columnas, ancho 70, offset 56 y canal 16. A la derecha, la retícula alineada a la derecha junto a la retícula secundaria." />
          <TokenTable
            caption="Retícula derecha y secundaria por dispositivo"
            minWidth={680}
            columns={['Dispositivo', 'Tamaño', 'Tipo', 'Retícula secundaria desplegada', 'Retícula secundaria plegada']}
            rows={[
              ['Móvil', '340 px', 'Derecha', SECONDARY.mobile.open, SECONDARY.mobile.closed],
              ['Tablet', `${TABLET.width} px`, 'Derecha', SECONDARY.tablet.open, SECONDARY.tablet.closed],
              ['Escritorio', '1440 px', 'Derecha', SECONDARY.desktop.open, SECONDARY.desktop.closed],
            ]}
          />
          <DocNote>Los valores de la retícula secundaria aún no existen como token. Para la tablet, Figma indica 744 px; aquí se usa el ancho de tablet de tokens.css (768 px).</DocNote>
        </DocSubsection>
      </DocSection>
    </>
  );
}

/** Bloque de composición dentro de la retícula */
function Block({ col, span, row, children }: { col: number; span: number; row: number; children?: ReactNode }) {
  return (
    <div
      className={`flex items-center justify-center border border-ds-border-semantic-information text-ds-primitives-typography-size-xs text-ds-text-neutral-heading ${PANEL_CLASS}`}
      style={{ gridColumn: `${col} / span ${span}`, gridRow: row }}
    >
      {children}
    </div>
  );
}

const ESPAN = [1, 2, 4, 6, 8, 12];

interface UseCase {
  name: string;
  width: number;
  height: number;
  columns: number;
  lateral: number;
  rows: string;
  blocks: [col: number, span: number, row: number][];
}

const CASES: UseCase[] = [
  { name: 'Portada, tres tarjetas y dos paneles', width: 1440, height: 1024, columns: 12, lateral: 56, rows: '2fr 1.4fr 1.4fr', blocks: [[1, 12, 1], [1, 4, 2], [5, 4, 2], [9, 4, 2], [1, 6, 3], [7, 6, 3]] },
  { name: 'Tres tarjetas, bloque central y dos paneles', width: 1440, height: 1024, columns: 12, lateral: 56, rows: '1.2fr 2fr 1.4fr', blocks: [[1, 4, 1], [5, 4, 1], [9, 4, 1], [1, 12, 2], [1, 6, 3], [7, 6, 3]] },
  { name: 'Retícula de 12 columnas en tablet, con portada', width: TABLET.width, height: TABLET.height, columns: 12, lateral: TABLET.lateral, rows: '2fr 1.4fr 1.4fr', blocks: [[1, 12, 1], [1, 4, 2], [5, 4, 2], [9, 4, 2], [1, 6, 3], [7, 6, 3]] },
  { name: 'Retícula de 12 columnas en tablet, bloque central', width: TABLET.width, height: TABLET.height, columns: 12, lateral: TABLET.lateral, rows: '1.2fr 2fr 1.4fr', blocks: [[1, 4, 1], [5, 4, 1], [9, 4, 1], [1, 12, 2], [1, 6, 3], [7, 6, 3]] },
  { name: 'Móvil de 4 columnas', width: 376, height: 812, columns: 4, lateral: 16, rows: '2fr 1.4fr 1.2fr', blocks: [[1, 4, 1], [1, 4, 2], [1, 2, 3], [3, 2, 3]] },
  { name: 'Móvil con contenido a ancho completo', width: 376, height: 812, columns: 4, lateral: 16, rows: '1.6fr 2fr 1fr', blocks: [[1, 4, 1], [1, 4, 2], [1, 4, 3]] },
];

function Aplicacion(): ReactNode {
  const d = spec('desktop');
  return (
    <>
      <DocSection title="Composición en retículas">
        <DocText>
          En la interfaz pueden coexistir múltiples contenedores dentro del mismo entorno digital, cuyos tamaños varían
          según su funcionalidad.
        </DocText>
        <DocText>
          Al estructurar contenedores dentro de la retícula, es posible asignar el número de columnas requerido según cada
          caso. En el esquema se presentan variaciones posibles, desde configuraciones de 4 columnas hasta retícula completa.
        </DocText>
        <DocFigure caption="Contenedores de 1, 2, 4, 6, 8 y 12 columnas sobre la retícula de escritorio.">
          <GridDiagram width={d.width} height={560} columns={d.columns} gutter={d.gutter} lateral={0} rows={`repeat(${ESPAN.length}, 1fr)`}>
            {ESPAN.map((n, i) => (
              <Block key={n} col={1} span={n} row={i + 1}>
                {n === 1 ? '1 col.' : `${n} columnas`}
              </Block>
            ))}
          </GridDiagram>
        </DocFigure>
      </DocSection>

      <DocSection title="Casos de uso">
        <DocText>
          A continuación, se presentan composiciones basadas en una retícula de 12 columnas, con ejemplos de cómo los
          contenedores se adaptan y definen la narrativa visual dentro de la interfaz.
        </DocText>
        <div className="grid grid-cols-1 gap-ds-space-general-4xl tablet:grid-cols-2">
          {CASES.map((c) => (
            <DocFigure key={c.name} caption={c.name}>
              <div className={c.columns === 4 ? 'mx-auto max-w-[180px]' : undefined}>
                <GridDiagram width={c.width} height={c.height} columns={c.columns} gutter={16} lateral={c.lateral} rows={c.rows}>
                  {c.blocks.map(([col, span, row], i) => (
                    <Block key={i} col={col} span={span} row={row} />
                  ))}
                </GridDiagram>
              </div>
            </DocFigure>
          ))}
        </div>
      </DocSection>
    </>
  );
}

/**
 * Página "Retículas" de Fundamentos de diseño.
 * `initialTab` permite abrirla directamente en una pestaña (una historia por pestaña).
 */
export function Reticulas({ initialTab = 'definicion' }: { initialTab?: ReticulasTab }) {
  return (
    <FoundationPage
      iconSvg={iconSvg}
      title="Retículas"
      subtitle="Fundamentos y lineamientos para el uso de retículas en los productos digitales de CAOS."
      initialTab={initialTab}
      tabs={[
        { id: 'definicion', label: 'Definición', content: <Definicion /> },
        { id: 'valores-de-token', label: 'Valores de token', content: <ValoresDeToken /> },
        { id: 'aplicacion', label: 'Aplicación', content: <Aplicacion /> },
      ]}
    />
  );
}
