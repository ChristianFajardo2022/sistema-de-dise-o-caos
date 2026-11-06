import type { DocInline, DocPractice } from '../../docs/types';
import type { FoundationBlock, FoundationDocContent } from '../_doc/foundationDoc.types';
import { ListaVinetas } from '../_doc/ListaVinetas';
import { THEMES, THEME_LABELS, ratioText } from '../Colores/colorData';
import { CatalogoIconos } from './Catalogo';
import {
  ComposicionAnotada,
  ComposicionPorBreakpoint,
  EsquemaObjetivo,
  EsquemaSeguridad,
  EsquemaZonas,
  IconoToken,
  IconoValor,
  MuestraActivo,
  MuestraColorSolido,
  MuestraDialogo,
  MuestraDireccional,
  MuestraFormatos,
  MuestraIconoGrande,
  MuestraIconoPequeno,
  MuestraLineaRelleno,
  MuestraNombreAccesible,
  MuestraSoloIcono,
  MuestraTamanos,
  PaletaIconos,
} from './IconografiaMuestras';
import {
  BAJOS,
  BREAKPOINTS_ASC,
  COLOR_ACENTO,
  COLOR_BOTON,
  COLOR_GENERAL,
  COLOR_OTROS,
  COLOR_SEMANTICO,
  DIM_TOKENS,
  FIGMA_SIZES,
  FONDO_ICONO,
  GRANDES,
  MIN_OBJETIVO,
  NIVELES,
  PARES,
  PEQUENOS,
  REFERENCIA,
  SEMANTICOS,
  SPACE_TOKENS,
  TAMANOS,
  TOTAL_CATEGORIAS,
  TOTAL_ICONOS,
  UMBRAL_LINEA,
  USADO_POR,
  colorCell,
  margenGeometrico,
  pxAt,
  pxText,
  shortName,
  tokenSlash,
  utilidad,
  utilidadColor,
} from './iconografiaData';

/*
 * Contenido de la página Iconografía (plantilla v2 de fundamentos, como Tipografía, Colores, Retículas, Contenedores y
 * espacios, Formas y Texturas). La fuente principal es el comienzo de la documentación nueva de Figma (estilo y tamaño,
 * paleta de acento y semántica); lo que no cubre sale de la documentación anterior (casos de uso, valores de línea,
 * tamaños, márgenes de seguridad, zona tapeable y reglas de color). Mandan el componente `Icon` y `tokens.css`. Sin IDs,
 * sin el nombre de la empresa y con voz y tono. Accesibilidad y parte de Desarrollo son criterio propio.
 */

// Figma: 22279:15911 (frame "Iconografía", documentación nueva: encabezado, "Fundamentos de Estilo y Tamaño" y "Paleta
// Cromática y Semántica"). La documentación anterior (frame "Frame 104", 9207:19098) ya no existe en el archivo: su texto
// está en `.qa/figma/fundamentos/md/iconografia.md`. Biblioteca: "Iconos" 9265:10513; sets "Icon-sizes" 9207:23386 e
// "Icon-primitive" 9248:39

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

/** Subtítulo de un grupo de variables o de un par de Do and Dont’s (Heading-lg-600), como en Formas y Texturas. */
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

/** Lista de medidas: "12, 14, 16 y 20 px". */
const medidas = (sizes: readonly number[]): string => `${sizes.slice(0, -1).join(', ')} y ${sizes[sizes.length - 1]} px`;

/** Token de color en `<code>`, con barras. */
const tk = (variable: string): DocInline => <code>{tokenSlash(variable)}</code>;

const tablaColores = (caption: string, tokens: string[], usadoPor?: string): FoundationBlock => ({
  type: 'table',
  caption,
  minWidth: usadoPor ? 900 : 720,
  columns: [
    { header: 'Token', width: 380 },
    ...THEMES.map((t) => ({ header: THEME_LABELS[t], width: 200 })),
    ...(usadoPor ? [{ header: 'Se usa en', width: 240 }] : []),
  ],
  rows: tokens.map((t) => [
    tk(t),
    ...THEMES.map((theme) => <IconoToken key={theme} token={t} theme={theme} valor={colorCell(t, theme)} fondo={t.startsWith('--color-ds-background-')} />),
    ...(usadoPor ? [usadoPor] : []),
  ]),
});

const semanticos = (family: string) => COLOR_SEMANTICO.filter((t) => t.includes(`-semantic-${family}-`));

/** Pares por debajo de 3:1, agrupados por modo: "En claro: gris de bajo contraste (1,31:1), …". */
const describirBajos = THEMES.map((theme) => {
  const lista = BAJOS.filter((p) => p.theme === theme);
  return lista.length ? `En ${THEME_LABELS[theme].toLowerCase()}: ${lista.map((p) => `${p.label.charAt(0).toLowerCase()}${p.label.slice(1)} (${ratioText(p.ratio)})`).join(', ')}.` : '';
})
  .filter(Boolean)
  .join(' ');

/** Zonas en las que el margen de Figma no coincide con la geometría. */
const ZONAS_DESCUADRADAS = REFERENCIA.zonas.flatMap((z) =>
  z.icons.filter((i) => margenGeometrico(z.zone, i.icon) !== i.figma).map((i) => ({ zone: z.zone, icon: i.icon, figma: i.figma, geo: margenGeometrico(z.zone, i.icon) })),
);
const descuadreTexto = ZONAS_DESCUADRADAS.map((d) => `zona de ${d.zone} con ícono de ${d.icon}: Figma anota ${d.figma} y la geometría da ${d.geo}`).join('; ');

const ICONO_M = '--ds-responsive-dimention-icono-m';

// ───────────────────────── código de ejemplo ─────────────────────────

const CODIGO_BASICO = [
  "import { Icon } from 'caos-design-system';",
  '',
  '// Decorativo: el texto de al lado ya lo dice',
  '<Icon name="calendar" size={16} />',
  '',
  '// Con significado: nombre accesible',
  '<Icon',
  '  name="warning"',
  '  size={24}',
  '  aria-label="Advertencia"',
  '/>',
].join('\n');

const CODIGO_VARIANTE = [
  '// Relleno por debajo de 24 px',
  '<Icon name="notification" size={16} />',
  '// Línea desde 24 px',
  '<Icon name="notification" size={24} />',
  '',
  '// Opción activa (liked): relleno',
  '<Icon',
  '  name="heart"',
  '  size={20}',
  "  variant={liked ? 'fill' : 'line'}",
  '/>',
].join('\n');

const CODIGO_COLOR = [
  '// El ícono toma el color del texto (currentColor)',
  '<Icon',
  '  name="tick-circle"',
  '  size={24}',
  '  className="text-ds-icon-semantic-success-secondary"',
  '/>',
].join('\n');

const CODIGO_BOTON = [
  '<Button',
  '  leftIcon={<Icon name="document-download" size={16} />}',
  '  iconSize={16}',
  '>',
  '  Descargar',
  '</Button>',
  '',
  '// Solo ícono: aria-label es obligatorio',
  '<Button',
  '  variant="tertiary"',
  '  iconOnly',
  '  aria-label="Buscar"',
  '  leftIcon={<Icon name="search" size={24} />}',
  '  iconSize={24}',
  '/>',
].join('\n');

const CODIGO_TOKEN = [
  `// ${pxText(pxAt(ICONO_M, 'mobile'))} en Mobile y ${pxText(pxAt(ICONO_M, 'desktop'))} desde Tablet`,
  '<Icon',
  '  name="tick-circle"',
  '  size={56}',
  '  className="size-ds-dimention-icono-m"',
  '/>',
].join('\n');

const CODIGO_RTL = [
  '// Se refleja en una interfaz de derecha a izquierda',
  '<Icon',
  '  name="chevron-right"',
  '  size={16}',
  '  className="rtl:-scale-x-100"',
  '/>',
].join('\n');

const CODIGO_SUELTO = [
  "import { IconBase } from 'caos-design-system';",
  "import { searchIcon } from './icons/caos/icons.generated';",
  '',
  '// Solo este ícono entra en el código final',
  '<IconBase icon={searchIcon} size={16} />',
].join('\n');

const CODIGO_AGREGAR = [
  '# 1. Un SVG de 24 × 24 por variante, con el mismo nombre',
  'icons/caos/line/nombre-del-icono.svg',
  'icons/caos/fill/nombre-del-icono.svg',
  '',
  '# 2. Una entrada en icons/caos/manifest.json',
  '#    { "name", "category", "figmaSetId" }',
  '',
  '# 3. Regenera el registro',
  'npm run build:icons:caos',
].join('\n');

// ───────────────────────── contenido ─────────────────────────

export const doc: FoundationDocContent = {
  name: 'Iconografía',
  icon: 'image',
  summary: `Los íconos son atajos visuales que comunican acciones y estados al instante. Mantienen la interfaz clara y fácil de recorrer sin saturarla de texto. ${TOTAL_ICONOS} íconos en ${TOTAL_CATEGORIAS} categorías, cada uno en línea y en relleno.`,
  definition: [
    {
      title: 'Definición y propósito',
      description: 'Un ícono resume una acción o un estado en un dibujo de 24 × 24 px. La biblioteca publica cada ícono en dos dibujos: línea (line) y relleno (fill).',
      blocks: [
        { type: 'text', content: 'Cada ícono pertenece a una de tres categorías según lo que hace en la interfaz.' },
        {
          type: 'cards',
          columns: 3,
          items: [
            { title: 'Accionables', content: 'Ejecutan una acción, como descargar o cerrar. Tienen zona tapeable.' },
            { title: 'Informativos', content: 'Apoyan un mensaje del sistema, como una advertencia. No se tocan: tienen margen de seguridad.' },
            { title: 'De marca', content: 'Identifican una marca o una red. Están en la categoría Brand de la biblioteca.' },
          ],
        },
        {
          type: 'table',
          caption: 'Categorías de ícono, tamaños y ejemplos',
          minWidth: 820,
          columns: [
            { header: 'Categoría', width: 200 },
            { header: 'Qué tiene', width: 300 },
            { header: 'Tamaños', width: 220 },
            { header: 'Ejemplos en CAOS', width: 300 },
          ],
          rows: [
            ['Accionable', 'Zona tapeable de 24 px o más.', '12, 16, 24 y 32 px', 'Button, ButtonCorner, Select, Accordion, NavBar'],
            ['Informativo', 'Margen de seguridad, sin zona tapeable.', '16, 24, 32, 40 y 48 px', 'Alert, Toast, Snackbar, Tag, AlertModal'],
            ['De marca', 'El dibujo de la marca, sin cambios.', 'Los del componente', 'Íconos de la categoría Brand'],
          ],
        },
      ],
    },
    {
      title: 'Estilo y tamaño',
      description: 'Para conservar la legibilidad, el peso del ícono cambia con su tamaño: relleno en los formatos pequeños y línea en los medianos y grandes.',
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Formatos pequeños',
              preview: <MuestraFormatos sizes={PEQUENOS} />,
              footer: `Relleno (fill) en ${medidas(PEQUENOS)}. El dibujo lleno no pierde definición ni se ve difuso en tamaños mínimos.`,
            },
            {
              title: 'Formatos medianos y grandes',
              preview: <MuestraFormatos sizes={GRANDES} />,
              footer: `Línea (line) en ${medidas(GRANDES)}. Los trazos delineados aportan ligereza sin recargar la pantalla.`,
            },
          ],
        },
        {
          type: 'note',
          tone: 'neutral',
          title: 'Regla del componente',
          content: (
            <>
              <code>Icon</code> la aplica por defecto: relleno por debajo de {UMBRAL_LINEA} px y línea desde {UMBRAL_LINEA} px. Con <code>variant</code> la cambias cuando el caso lo pide, como una opción activa.
            </>
          ),
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Bold tiene dos significados en Figma',
          content: 'La documentación nueva llama Bold al relleno. La anterior llamaba Bold line a la línea de 2 px. En esta página se dice relleno (fill) y línea (line), como en el código.',
        },
      ],
    },
    {
      title: 'Accionables e informativos',
      description: 'Cada componente fija el tamaño y el dibujo de sus íconos. La tabla compara lo que pedía la documentación anterior con lo que dibuja hoy el código.',
      blocks: [
        subTitle('Íconos accionables'),
        {
          type: 'text',
          content: (
            <>
              Permiten hacer una acción, así que tienen <strong>zona tapeable</strong>. En reposo van en línea, o en relleno si miden menos de 24 px. Pasan a relleno al activarse: me gusta, calificación y el paso completo de un Stepper.
            </>
          ),
        },
        subTitle('Íconos informativos'),
        {
          type: 'text',
          content: (
            <>
              Apoyan un mensaje del sistema y <strong>no</strong> se tocan, pero tienen margen de seguridad. Los grandes de un diálogo van en línea; los de 20 px de un aviso, en relleno.
            </>
          ),
        },
        {
          type: 'table',
          caption: 'Íconos de los componentes: documentación anterior y código',
          minWidth: 900,
          columns: [
            { header: 'Componente', width: 200 },
            { header: 'Categoría', width: 160 },
            { header: 'Documentación anterior', width: 240 },
            { header: 'Código hoy', width: 340 },
          ],
          rows: [
            ['Button', 'Accionable', 'Bold line, 16 px', <>El que le pases en <code key="l">leftIcon</code> o <code key="r">rightIcon</code>; a 16 px, relleno por defecto</>],
            ['Select y Accordion', 'Accionable', 'Bold line', <><code key="c">chevron-down</code> de 16 px en línea</>],
            ['Input (ayuda y contraseña)', 'Accionable', 'Bold line', <><code key="i">info-circle</code>, <code key="e">eye</code> de 16 px en relleno</>],
            ['NavBar', 'Accionable', 'Bold line; relleno al activar', '20 px: línea en reposo y relleno en la opción activa'],
            ['Stepper', 'Accionable', 'Relleno en el paso completo', '14 px: relleno en completo y error, línea en incompleto'],
            ['Tag', 'Informativo', '—', '14 px en relleno'],
            ['Alert, Toast y Snackbar', 'Informativo', 'Bold line', '20 px en relleno'],
            ['AlertModal', 'Informativo', 'Light line, 48 y 40 px', <>Línea, con <code key="d">dimention/icono-m</code>: {pxText(pxAt(ICONO_M, 'mobile'))} en Mobile y {pxText(pxAt(ICONO_M, 'desktop'))} desde Tablet</>],
            ['EmptyState', 'Informativo', '—', '32 px en línea'],
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Las flechas de 16 px van en línea',
          content: 'Select, Accordion y el cierre de Modal dibujan chevron-down y close de 16 px en línea, contra la regla de tamaño de la documentación nueva. Pendiente con diseño.',
        },
      ],
    },
    {
      title: 'Valores de línea',
      description: `La documentación anterior define dos grosores de línea, medidos sobre un ícono de ${REFERENCIA.linea.base} × ${REFERENCIA.linea.base} px.`,
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Bold line',
              figure: pxText(REFERENCIA.linea.bold),
              content: 'Línea de los íconos de acción. Al escalar el ícono, el trazo mantiene la proporción y da unidad a toda la biblioteca.',
            },
            {
              title: 'Light line',
              figure: pxText(REFERENCIA.linea.light),
              content: 'Línea fina de los íconos informativos grandes, en diálogos y ventanas emergentes.',
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              preview: <MuestraLineaRelleno />,
              footer: 'El mismo ícono a 24 y a 56 px, en sus dos dibujos.',
            },
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'La biblioteca no tiene Light line',
          content: 'Cada ícono se publica en línea y en relleno. Los trazos son contornos rellenos (sin stroke): el grosor no se cambia con CSS. Para Light line hace falta un tercer dibujo. Pendiente con diseño.',
        },
      ],
    },
    {
      title: 'Tamaños permitidos',
      description: `El componente acepta ${TAMANOS.length} tamaños. El set Icon-sizes de Figma tiene ${FIGMA_SIZES.length}; los otros vienen de los casos de la documentación anterior.`,
      blocks: [
        { type: 'custom', content: <MuestraTamanos /> },
        {
          type: 'table',
          caption: 'Casos de tamaño de la documentación anterior',
          minWidth: 820,
          columns: [
            { header: 'Tamaño', width: 280 },
            { header: 'Estilo', width: 160 },
            { header: 'Casos', width: 480 },
          ],
          rows: REFERENCIA.casos.map((c) => [c.tamano, c.estilo, c.usos.join(', ')]),
        },
        {
          type: 'text',
          content: 'Estos casos son de la documentación anterior. Hoy cada componente fija su tamaño (tabla de Accionables e informativos).',
        },
      ],
    },
    {
      title: 'Márgenes de seguridad',
      description: 'Espacio libre alrededor de un ícono informativo, para que otros elementos no lo afecten. Se aplica igual en Desktop y en Mobile.',
      blocks: [
        { type: 'custom', content: <EsquemaSeguridad /> },
        { type: 'text', content: 'Medidas a escala real. El relleno tintado es el margen y el borde punteado, su límite.' },
        {
          type: 'note',
          tone: 'alert',
          title: 'Los márgenes no tienen token',
          content: `Los valores de 8, 16 y 24 px son de la documentación anterior. tokens.css tiene space/icon/sm y space/icon/md (${pxText(pxAt(SPACE_TOKENS[0], 'mobile'))} y ${pxText(pxAt(SPACE_TOKENS[1], 'mobile'))} en Mobile), pero no coinciden y ningún componente los usa.`,
        },
      ],
    },
    {
      title: 'Zona tapeable',
      description: `Área que responde al toque alrededor de un ícono accionable. Hay cuatro niveles, de ${REFERENCIA.zonas[0].zone} a ${REFERENCIA.zonas[REFERENCIA.zonas.length - 1].zone} px, con el ícono centrado.`,
      blocks: [
        { type: 'custom', content: <EsquemaZonas /> },
        { type: 'text', content: 'Medidas a escala real. El margen es el que da la geometría: (zona − ícono) / 2.' },
        ...(ZONAS_DESCUADRADAS.length
          ? [
              {
                type: 'note',
                tone: 'alert',
                title: 'Dos márgenes de Figma no cuadran',
                content: `En rojo los casos donde la cifra de Figma no coincide con la geometría: ${descuadreTexto}. Pendiente con diseño.`,
              } satisfies FoundationBlock,
            ]
          : []),
      ],
    },
    {
      title: 'Color',
      description: 'El color del ícono sale solo de los tokens icon/*. Cambian con el modo y garantizan contraste y coherencia.',
      blocks: [
        subTitle('Acento'),
        { type: 'text', content: 'Para destacar acciones principales, elementos interactivos o íconos sobre fondos de color.' },
        { type: 'custom', content: <PaletaIconos tokens={COLOR_ACENTO} /> },
        subTitle('Semánticos de estado'),
        {
          type: 'cards',
          columns: 2,
          items: SEMANTICOS.map((s) => ({ title: s.label, content: s.uso, preview: <PaletaIconos tokens={semanticos(s.family)} lista /> })),
        },
        subTitle('Generales'),
        {
          type: 'text',
          content: (
            <>
              Para la mayoría de los íconos: <code>icon/general/default</code>, los grises y los inactivos. Los <code>-unicolor</code> no cambian con el modo: van sobre superficies fijas.
            </>
          ),
        },
        { type: 'custom', content: <PaletaIconos tokens={COLOR_GENERAL} /> },
        {
          type: 'text',
          content: (
            <>
              <code>icon/general/black</code> es el inverso de <code>default</code>: va sobre la superficie inversa. <code>default-unicolor</code> va sobre <code>G13</code> y <code>black-unicolor</code>, sobre <code>B01</code>.
            </>
          ),
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Ícono positivo',
              content: (
                <>
                  Sobre el relleno <code>G13</code>, el ícono usa <code>icon/general/default-unicolor</code>. Excepción: sobre los tonos claros de las paletas secundaria y terciaria, el ícono toma el color de la familia.
                </>
              ),
            },
            {
              title: 'Ícono negativo',
              content: (
                <>
                  Sobre el relleno <code>B01</code>, el ícono usa <code>icon/general/black-unicolor</code> o el acento. Los semánticos van como segunda opción.
                </>
              ),
            },
          ],
        },
      ],
    },
    {
      title: 'Variables / Iconografía',
      description: `${TAMANOS.length} tamaños del componente, ${DIM_TOKENS.length + SPACE_TOKENS.length} tokens de dimensión y espacio y ${COLOR_GENERAL.length + COLOR_ACENTO.length + COLOR_SEMANTICO.length + COLOR_OTROS.length} colores de ícono en tokens.css. Los colores cambian con el modo.`,
      blocks: [
        subTitle('Tamaños del componente'),
        {
          type: 'table',
          caption: 'Tamaños de Icon y su variante por defecto',
          minWidth: 640,
          columns: [
            { header: 'size', width: 160 },
            { header: 'Variante por defecto', width: 260 },
            { header: 'En Figma', width: 260 },
          ],
          rows: TAMANOS.map((t) => [<code key="s">{t.size}</code>, t.variant === 'fill' ? 'Relleno (fill)' : 'Línea (line)', t.figma ? 'Icon-sizes' : 'Solo en código y en la documentación anterior']),
        },
        subTitle('Dimensiones y espacios'),
        {
          type: 'table',
          caption: 'Tokens de dimensión y de espacio de ícono por breakpoint',
          minWidth: 960,
          columns: [
            { header: 'Token', width: 260 },
            ...BREAKPOINTS_ASC.map((b) => ({ header: b.label, width: 120 })),
            { header: 'Utilidad', width: 280 },
            { header: 'Se usa en', width: 240 },
          ],
          rows: [...DIM_TOKENS, ...SPACE_TOKENS].map((t) => [
            <code key="t">{shortName(t)}</code>,
            ...BREAKPOINTS_ASC.map((b) => pxText(pxAt(t, b.bp))),
            <code key="u">{utilidad(t, t.includes('dimention') ? 'size' : 'p') ?? '?'}</code>,
            USADO_POR[t] ?? 'Ningún componente todavía',
          ]),
        },
        subTitle('Colores de ícono'),
        tablaColores('Colores de ícono generales por modo', [...COLOR_GENERAL, ...COLOR_OTROS]),
        tablaColores('Colores de ícono de acento por modo', COLOR_ACENTO),
        tablaColores('Colores de ícono semánticos por modo', COLOR_SEMANTICO),
        {
          type: 'text',
          content: `Los ${COLOR_BOTON.length} tokens icon/button/* son de Button y se documentan en su página.`,
        },
        subTitle('Fondos de ícono'),
        tablaColores('Fondos de ícono por modo', FONDO_ICONO, 'Avatar, ButtonCorner, FileCard e InteractiveCard'),
      ],
    },
    {
      title: 'Catálogo',
      description: `Los ${TOTAL_ICONOS} íconos de la biblioteca. Busca por nombre o por categoría, cambia la vista previa y activa un ícono para copiar su código.`,
      blocks: [{ type: 'custom', content: <CatalogoIconos /> }],
    },
  ],
  application: [
    {
      title: 'Accionable frente a informativo',
      description: 'La misma tarjeta con íconos de las dos categorías, todos dentro de componentes reales.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              preview: <ComposicionAnotada />,
              footer: '1 y 5 son accionables: ButtonCorner y Button, con zona tapeable y nombre accesible. 2 y 4 son informativos: Tag y Alert. 3 es el Stepper: el paso completo pasa a relleno.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Íconos de la composición',
          minWidth: 820,
          columns: [
            { header: 'Pieza', width: 200 },
            { header: 'Categoría', width: 160 },
            { header: 'Ícono', width: 220 },
            { header: 'Por qué', width: 380 },
          ],
          rows: [
            ['1 · ButtonCorner', 'Accionable', <><code key="i">3-dots-more</code>, 16 px, relleno</>, 'Botón de solo ícono: el nombre accesible es «Más opciones».'],
            ['2 · Tag', 'Informativo', <><code key="i">clock</code> y <code key="t">tick-circle</code>, 14 px, relleno</>, 'Acompaña al texto del estado; el texto dice lo mismo.'],
            ['3 · Stepper', 'Accionable', '14 px, relleno en el paso completo', 'El relleno marca lo hecho; el texto del estado lo confirma.'],
            ['4 · Alert', 'Informativo', <><code key="i">warning</code>, 20 px, relleno</>, 'Refuerza el tipo del aviso, que también está en el título.'],
            ['5 · Button', 'Accionable', <><code key="i">document-download</code> de 16 y <code key="s">share</code> de 20, relleno</>, 'Por debajo de 24 px, relleno. El de solo ícono lleva aria-label.'],
          ],
        },
      ],
    },
    {
      title: 'Desktop / Tablet / Mobile',
      description: `Cada vista se dibuja con los valores de su breakpoint. El ícono de AlertModal usa dimention/icono-m: ${pxText(pxAt(ICONO_M, 'mobile'))} en Mobile y ${pxText(pxAt(ICONO_M, 'tablet'))} desde Tablet. Los demás íconos tienen un tamaño fijo.`,
      blocks: [{ type: 'custom', content: <ComposicionPorBreakpoint breakpoints={BREAKPOINTS_ASC} /> }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Pautas para elegir el dibujo y el color de un ícono al construir componentes.',
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: 'De dónde salen',
          content: 'Los pares vienen de la documentación anterior (accionables, informativos, relleno al activar y color sólido), rehechos con componentes de CAOS y ajustados a la regla de tamaño de la documentación nueva.',
        },
        subTitle('Accionables pequeños'),
        { type: 'text', content: 'Por debajo de 24 px usa el relleno: la línea se adelgaza y el ícono pierde definición.' },
        {
          type: 'practices',
          items: [
            practice('do', 'Relleno a 16 px', 'Los íconos de 16 px de los botones conservan su forma.', <MuestraIconoPequeno good />),
            practice('dont', 'Línea a 16 px', 'El trazo fino se ve difuso al lado del texto.', <MuestraIconoPequeno good={false} />),
          ],
        },
        subTitle('Accionables grandes'),
        { type: 'text', content: 'Desde 24 px usa la línea en reposo.' },
        {
          type: 'practices',
          items: [
            practice('do', 'Línea a 24 px', 'La barra se ve ligera y cada acción se distingue.', <MuestraIconoGrande good />),
            practice('dont', 'Relleno a 24 px', 'Cuatro dibujos llenos seguidos pesan más que el contenido.', <MuestraIconoGrande good={false} />),
          ],
        },
        subTitle('Relleno al activar'),
        {
          type: 'text',
          content: 'Al activar una opción, como me gusta o una calificación, su ícono pasa a relleno. NavBar y Stepper ya lo hacen solos.',
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Activo en relleno', 'La opción activa cambia de fondo y su ícono pasa a relleno.', <MuestraActivo good />),
            practice('dont', 'Activo en línea', 'Solo cambia el fondo, y el estado se lee peor.', <MuestraActivo good={false} />),
          ],
        },
        subTitle('Informativos grandes'),
        { type: 'text', content: 'En un diálogo, el ícono grande va en línea. AlertModal ya lo dibuja así.' },
        {
          type: 'practices',
          items: [
            practice('do', 'Línea en un diálogo', 'El ícono de 48 px acompaña el mensaje sin competir con el título.', <MuestraDialogo good />),
            practice('dont', 'Relleno en un diálogo', 'El dibujo lleno de 48 px pesa más que el título y los botones.', <MuestraDialogo good={false} />),
          ],
        },
        subTitle('Color sólido'),
        { type: 'text', content: 'Usa un solo color por ícono, de un token icon/*. Sin degradados, texturas ni transparencia.' },
        {
          type: 'practices',
          items: [
            practice('do', 'Un color sólido', 'Cada ícono usa su token semántico, sin transparencia.', <MuestraColorSolido good />),
            practice('dont', 'Ícono translúcido', 'Con transparencia, el ícono pierde contraste y se confunde con el fondo.', <MuestraColorSolido good={false} />),
          ],
        },
      ],
    },
  ],
  accessibility: [
    {
      title: 'Accesibilidad / WCAG 2.2',
      description: 'Un ícono con significado debe verse, tener nombre y no ser la única señal. Estos criterios aplican a los íconos de toda la interfaz.',
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: 'Criterio propio',
          content: 'La documentación de Figma no tiene esta pestaña. Los criterios salen de WCAG 2.2; las cifras, de tokens.css y de los componentes. Revísalos con diseño.',
        },
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Ícono con significado',
              figure: '3:1',
              content: 'Contraste mínimo entre el ícono y su fondo (1.4.11, AA).',
            },
            {
              title: 'Zona tapeable',
              figure: pxText(MIN_OBJETIVO),
              content: 'Tamaño mínimo del área que se toca, aunque el dibujo sea menor (2.5.8, AA).',
            },
            {
              title: 'Nombre accesible',
              figure: 'aria-label',
              content: 'Todo botón de solo ícono lo lleva. Un ícono decorativo queda oculto (4.1.2 y 1.1.1, A).',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Criterios WCAG que aplican a los íconos',
          minWidth: 720,
          columns: [
            { header: 'Criterio', width: 340 },
            { header: 'Qué pide a los íconos', width: 700 },
          ],
          rows: [
            ['1.1.1 · Contenido no textual (A)', 'Un ícono con significado tiene nombre accesible. Uno decorativo queda fuera del árbol de accesibilidad.'],
            ['4.1.2 · Nombre, función y valor (A)', 'Un botón de solo ícono anuncia su acción. Sin aria-label, el lector dice solo «botón».'],
            ['2.5.3 · Etiqueta en el nombre (A)', 'Si el botón tiene texto visible, el nombre accesible empieza con ese texto, no con el nombre del ícono.'],
            ['1.4.11 · Contraste de elementos no textuales (AA)', 'El ícono que transmite algo llega a 3:1 con su fondo. Los decorativos y los inactivos quedan fuera.'],
            ['1.4.1 · Uso del color (A) y 1.3.3 · Características sensoriales (A)', 'Ni el ícono ni su color son la única señal de un estado. Suma texto.'],
            ['2.5.8 · Tamaño del objetivo, mínimo (AA)', `El área que se toca mide ${MIN_OBJETIVO} × ${MIN_OBJETIVO} px o más, o tiene separación suficiente.`],
          ],
        },
      ],
    },
    {
      title: 'Decorativo o con significado',
      description: 'Si el texto de al lado ya dice lo mismo, el ícono es decorativo. Si es lo único que transmite algo, necesita nombre.',
      blocks: [
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Decorativo',
              content: (
                <>
                  Sin <code>aria-label</code>, <code>Icon</code> se dibuja con <code>aria-hidden</code>. Es el caso de los íconos junto a un texto.
                </>
              ),
            },
            {
              title: 'Con significado',
              content: (
                <>
                  Con <code>aria-label</code>, <code>Icon</code> pasa a <code>role=&quot;img&quot;</code> y se anuncia con ese nombre.
                </>
              ),
            },
            {
              title: 'Botón de solo ícono',
              content: (
                <>
                  El nombre va en el botón, no en el ícono. <code>Button</code> con <code>iconOnly</code> y <code>ButtonCorner</code> exigen <code>aria-label</code>.
                </>
              ),
            },
          ],
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Botón con nombre', 'El aria-label describe la acción y el lector anuncia «Buscar, botón».', <MuestraNombreAccesible good />),
            practice('dont', 'Botón sin nombre', 'Sin aria-label el lector solo dice «Botón» y la acción queda oculta.', <MuestraNombreAccesible good={false} />),
          ],
        },
      ],
    },
    {
      title: 'Contraste del ícono',
      description: 'Relación medida con la fórmula de WCAG 2 sobre los valores de tokens.css en cada modo. Cada muestra pinta su propio modo. El mínimo es 3:1.',
      blocks: [
        {
          type: 'table',
          caption: 'Contraste de pares de ícono y fondo por modo',
          minWidth: 900,
          columns: [
            { header: 'Ícono', width: 240 },
            { header: 'Tokens', width: 380 },
            ...THEMES.map((t) => ({ header: THEME_LABELS[t], width: 220 })),
          ],
          rows: PARES.map((p) => [
            p.label,
            lines(<code key="f">{p.fg.replace(/^--color-ds-/, '')}</code>, <code key="b">{p.bg.replace(/^--color-ds-/, '')}</code>),
            ...THEMES.map((t) => <IconoValor key={t} par={p} theme={t} />),
          ]),
        },
        ...(BAJOS.length
          ? [
              {
                type: 'note',
                tone: 'alert',
                title: 'Algunos tokens no llegan a 3:1 sobre la superficie',
                content: `${describirBajos} Úsalos solo en íconos decorativos o junto a un texto que diga lo mismo. Pendiente con diseño.`,
              } satisfies FoundationBlock,
            ]
          : []),
        {
          type: 'text',
          content: 'Los íconos inactivos quedan fuera de 1.4.11. Aun así, el control inactivo debe tener texto que lo explique.',
        },
      ],
    },
    {
      title: 'No comuniques solo con el ícono',
      description: 'Un ícono o su color no bastan para decir un estado: no todos lo ven, ni lo interpretan igual.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice('do', 'Ícono y texto', 'Tag suma el texto del estado al ícono y al color.', <MuestraSoloIcono good />),
            practice('dont', 'Solo el ícono', 'Sin texto, el estado depende de ver el color y reconocer el dibujo.', <MuestraSoloIcono good={false} />),
          ],
        },
      ],
    },
    {
      title: 'Zona tapeable y tamaño del dibujo',
      description: `WCAG mide el área que se toca, no el dibujo. Un ícono de 16 px cumple si su zona tapeable mide ${MIN_OBJETIVO} px o más.`,
      blocks: [
        { type: 'custom', content: <EsquemaObjetivo /> },
        {
          type: 'text',
          content: (
            <>
              Para un ícono accionable usa <code>Button</code> con <code>iconOnly</code> o <code>ButtonCorner</code>, que ya dan la zona; no pongas un <code>onClick</code> en el ícono.
            </>
          ),
        },
      ],
    },
    {
      title: 'Íconos direccionales',
      description: 'Las flechas y los chevrones indican un sentido. En una interfaz de derecha a izquierda se reflejan; el resto de los íconos no.',
      blocks: [
        { type: 'custom', content: <MuestraDireccional /> },
        {
          type: 'text',
          content: (
            <>
              La muestra simula <code>dir=&quot;rtl&quot;</code>. Los productos de CAOS hoy son solo de izquierda a derecha: deja la clase <code>rtl:-scale-x-100</code> en los íconos de sentido para cuando haga falta.
            </>
          ),
        },
      ],
    },
    {
      title: 'Criterios vs. evidencia',
      description: 'Esta página describe el uso de los íconos. No reemplaza una auditoría WCAG del producto.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Evidencia disponible',
              content: 'Los contrastes se miden con los valores de tokens.css. Los nombres accesibles y los tamaños salen del código de los componentes. No hay pruebas con lector de pantalla ni con colores forzados en las pantallas del producto: hazlas en cada vista.',
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
                    'Íconos decorativos sin nombre y fuera del árbol de accesibilidad.',
                    'Botones de solo ícono con aria-label que describe la acción.',
                    'Íconos con significado de 3:1 o más contra su fondo.',
                    'Ningún estado dicho solo con un ícono o su color.',
                    `Zona tapeable de ${MIN_OBJETIVO} px o más en cada ícono accionable.`,
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
      description: 'Los íconos se insertan como instancias del set de la biblioteca, nunca como dibujos sueltos.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Ícono con la biblioteca',
              steps: [
                {
                  title: 'Inserta la instancia',
                  content: 'Usa el componente Icon-sizes y cambia el ícono con el intercambio de instancia. No desagrupes ni pegues el vector.',
                },
                {
                  title: 'Elige el tamaño',
                  content: `Size del set: ${medidas(FIGMA_SIZES)}.`,
                },
                {
                  title: 'Elige el dibujo',
                  content: (
                    <>
                      Outline <code>Yes</code> es línea y Outline <code>No</code>, relleno. Sigue la regla de tamaño salvo en una opción activa.
                    </>
                  ),
                },
                {
                  title: 'Enlaza el color',
                  content: (
                    <>
                      Aplica una variable <code>icon/*</code> al relleno. Nunca un color suelto.
                    </>
                  ),
                },
              ],
            },
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Nombres de variable distintos',
          content: 'La documentación nueva escribe icon/accent/first; las variables y el código se llaman icon/acent/firts. Manda el nombre de la variable.',
        },
      ],
    },
    {
      title: 'Consumo técnico',
      description: (
        <>
          <code>Icon</code> dibuja un <code>&lt;svg&gt;</code> de 24 × 24 con <code>fill=&quot;currentColor&quot;</code>: toma el color del texto y el tamaño de <code>size</code>.
        </>
      ),
      blocks: [
        {
          type: 'table',
          caption: 'Props de Icon',
          minWidth: 820,
          columns: [
            { header: 'Prop', width: 180 },
            { header: 'Tipo', width: 300 },
            { header: 'Qué hace', width: 460 },
          ],
          rows: [
            [<code key="p">name</code>, <code key="t">IconName</code>, `Nombre del ícono en la biblioteca (${TOTAL_ICONOS}). TypeScript avisa si no existe.`],
            [<code key="p">icon</code>, <code key="t">CaosIconData</code>, <>Datos de un ícono importado suelto. Tiene prioridad sobre <code key="n">name</code>.</>],
            [<code key="p">size</code>, <code key="t">{TAMANOS.map((t) => t.size).join(' | ')}</code>, 'Alto y ancho en px. Por defecto 24.'],
            [<code key="p">variant</code>, <code key="t">&apos;line&apos; | &apos;fill&apos;</code>, `Dibujo. Por defecto, relleno por debajo de ${UMBRAL_LINEA} px y línea desde ${UMBRAL_LINEA} px.`],
            [<code key="p">aria-label</code>, <code key="t">string</code>, <>Nombre accesible. Con él, <code key="r">role=&quot;img&quot;</code>; sin él, <code key="h">aria-hidden</code>.</>],
            [<code key="p">className</code>, <code key="t">string</code>, 'Clases extra: color, tamaño por token o reflejo en RTL.'],
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Uso básico',
              content: 'Importa Icon de caos-design-system y elige el ícono por su nombre.',
              code: { label: 'Ícono decorativo y con significado', code: CODIGO_BASICO },
            },
            {
              title: 'Variante',
              content: 'Deja la regla de tamaño y fuerza el relleno solo en una opción activa.',
              code: { label: 'Variante por defecto y forzada', code: CODIGO_VARIANTE },
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Color',
              content: (
                <>
                  Usa las utilidades <code>text-ds-icon-*</code> en el ícono o en su contenedor.
                </>
              ),
              code: { label: 'Ícono con color semántico', code: CODIGO_COLOR },
            },
            {
              title: 'En un botón',
              content: (
                <>
                  Pasa el ícono en <code>leftIcon</code> o <code>rightIcon</code> con su <code>iconSize</code>. Con <code>iconOnly</code>, el nombre va en el botón.
                </>
              ),
              code: { label: 'Button con ícono y de solo ícono', code: CODIGO_BOTON },
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Tamaño por token',
              content: (
                <>
                  Si el tamaño cambia con el breakpoint, usa <code>size-ds-dimention-icono-m</code> o <code>-s</code>, como AlertModal.
                </>
              ),
              code: { label: 'Ícono con tamaño responsive', code: CODIGO_TOKEN },
            },
            {
              title: 'Derecha a izquierda',
              content: 'Refleja las flechas y los chevrones con la variante rtl de Tailwind.',
              code: { label: 'Ícono direccional en RTL', code: CODIGO_RTL },
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Solo los íconos que usas',
              content: (
                <>
                  <code>name</code> importa el registro completo. Con <code>IconBase</code> y los datos sueltos de <code>icons.generated.ts</code>, el empaquetador deja fuera el resto.
                </>
              ),
              code: { label: 'Ícono suelto con IconBase', code: CODIGO_SUELTO },
            },
          ],
        },
        {
          type: 'text',
          content: (
            <>
              Cada token <code>icon/*</code> tiene su utilidad de texto: <code>icon/semantic/success-firts</code> se escribe <code>{utilidadColor('--color-ds-icon-semantic-success-firts')}</code>. La lista completa está en la tabla de Variables.
            </>
          ),
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
      title: 'Agregar un ícono a la biblioteca',
      description: 'La biblioteca se genera desde los SVG de icons/caos con un script. No edites los archivos generados.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Del SVG al componente',
              steps: [
                {
                  title: 'Exporta los dos dibujos',
                  content: (
                    <>
                      Desde el set de Figma, un SVG por variante en <code>icons/caos/line/</code> y <code>icons/caos/fill/</code>, con el mismo nombre en minúsculas y guiones. El repositorio no tiene un exportador automático.
                    </>
                  ),
                },
                {
                  title: 'Regístralo',
                  content: (
                    <>
                      Agrega su entrada en <code>icons/caos/manifest.json</code>: <code>name</code>, <code>category</code> y <code>figmaSetId</code>. Si el nombre ya existe, usa un sufijo (<code>-2</code>).
                    </>
                  ),
                },
                {
                  title: 'Genera el registro',
                  content: (
                    <>
                      Corre <code>npm run build:icons:caos</code>. Optimiza cada SVG y escribe <code>icons.generated.ts</code> y <code>registry.generated.ts</code> en <code>src/icons/caos/</code>.
                    </>
                  ),
                },
              ],
              code: { label: 'Archivos y comando para agregar un ícono', code: CODIGO_AGREGAR },
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Lo que el script exige',
              preview: (
                <ListaVinetas
                  items={[
                    <>
                      <code key="v">viewBox=&quot;0 0 24 24&quot;</code>.
                    </>,
                    <>Solo trazados (<code key="p">path</code>).</>,
                    'Sin máscaras, recortes, grupos, ids ni stroke.',
                    <>
                      Relleno <code key="c">currentColor</code> o <code key="n">none</code>: un color fijo falla.
                    </>,
                  ]}
                />
              ),
            },
            {
              title: 'Lo que hace el componente',
              preview: (
                <ListaVinetas
                  items={[
                    <>Arma el <code key="s">&lt;svg&gt;</code> con el viewBox y el color.</>,
                    'Elige el dibujo según el tamaño o la variante.',
                    <>Pone <code key="h">aria-hidden</code> si no hay nombre accesible.</>,
                  ]}
                />
              ),
            },
          ],
        },
      ],
    },
    {
      title: 'Auditoría, supuestos y pendientes',
      description: 'Lo que se revisó en las documentaciones de Figma y cómo queda en código.',
      blocks: [
        {
          type: 'table',
          caption: 'Auditoría de iconografía',
          minWidth: 720,
          columns: [
            { header: 'Hallazgo', width: 340 },
            { header: 'Decisión o pendiente', width: 700 },
          ],
          rows: [
            ['Fuentes', 'La documentación nueva cubre estilo y tamaño y la paleta de acento y semántica. El resto sale de la anterior, que ya no está en el archivo de Figma: se usó su texto extraído.'],
            ['Bold y relleno', 'La documentación nueva llama Bold al relleno y la anterior, Bold line a la línea de 2 px. La página usa relleno y línea, como el código.'],
            ['Regla de tamaño', `La nueva pide relleno de 12 a 20 px y línea desde 24 px, igual que Icon. La anterior pedía línea en los accionables de 12 y 16 px. Manda la nueva.`],
            ['Flechas de 16 px', 'Select, Accordion y el cierre de Modal dibujan chevron-down y close de 16 px en línea. Pendiente con diseño.'],
            ['Light line', `La biblioteca no tiene el dibujo de ${pxText(REFERENCIA.linea.light)}. Los trazos son contornos rellenos: el grosor no se cambia en código.`],
            ['Tamaños', `Icon-sizes tiene ${medidas(FIGMA_SIZES)}. El componente suma 40 y 48, de la documentación anterior. La anterior no tenía 14 ni 56.`],
            ['Márgenes y zonas', 'No tienen token. space/icon/sm y md existen, no coinciden con los márgenes de Figma y ningún componente los usa.'],
            ['Zona tapeable', ZONAS_DESCUADRADAS.length ? `Cifras que no cuadran con la geometría: ${descuadreTexto}.` : 'Las cifras cuadran con la geometría.'],
            ['Tabla de la paleta', 'La tabla «Token aplicable» de la documentación nueva trae filas de Tooltip (Solid, Icon, Text). No se copió.'],
            ['Nombres de token', 'La documentación nueva escribe icon/accent/first; las variables se llaman icon/acent/firts.'],
            ['Contraste', BAJOS.length ? `Por debajo de 3:1 sobre la superficie. ${describirBajos} Los semánticos first y secondary fallan en claro y los tertiary, en oscuro.` : 'Todos los pares medidos llegan a 3:1.'],
            [
              'Biblioteca',
              'Hay variantes mal nombradas en Figma, sets donde la línea y el relleno son el mismo dibujo y nombres repetidos publicados con sufijo (add-2, warning-2, forbidden-2). Están anotados para diseño.',
            ],
            ['Íconos sueltos', 'caos-design-system exporta Icon e IconBase, pero no los datos de cada ícono: hoy se importan de src/icons/caos/icons.generated.ts. Pendiente.'],
            ['Ejemplos', 'Los 18 PNG de la página anterior mostraban pantallas del rubro de la empresa. Los pares se rehicieron con componentes de CAOS y los PNG quedaron sin uso.'],
            ['Ícono del encabezado', <>El de Figma es <code key="i">image</code> y está en la biblioteca.</>],
            ['Accesibilidad', 'Criterio propio. Faltan pruebas con lector de pantalla, colores forzados y RTL en las pantallas del producto.'],
          ],
        },
        {
          type: 'note',
          tone: 'neutral',
          title: 'Niveles semánticos',
          content: `Cada familia semántica tiene ${NIVELES.length} niveles (first, secondary y tertiary). La documentación nueva no dice cuándo usar cada uno: pendiente con diseño.`,
        },
      ],
    },
  ],
};
