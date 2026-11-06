import type { DocInline, DocPractice } from '../../docs/types';
import type { FoundationBlock, FoundationDocContent } from '../_doc/foundationDoc.types';
import { ListaVinetas } from '../_doc/ListaVinetas';
import { THEMES, THEME_LABELS, ratioText } from '../Colores/colorData';
import {
  ColorSombraCelda,
  ComposicionAnotada,
  ComposicionPorBreakpoint,
  DelimitaValor,
  EsquemaIntegracion,
  MuestraApilar,
  MuestraColoresForzados,
  MuestraJerarquia,
  MuestraSuperficieBorde,
  NivelesPorModo,
} from './ElevacionesMuestras';
import {
  BAJOS_BORDE,
  FIGMA_SOMBRAS,
  NIVELES,
  PARES_BORDE,
  PARES_BORDE_OK,
  SOMBRAS,
  SOMBRA_NOMBRES,
  colorSombra,
  geometria,
  invisibleEn,
  opacidades,
  pct,
  sinPx,
} from './elevacionData';
import type { SombraNombre } from './elevacionData';

/*
 * Contenido de la página Elevaciones (plantilla v2 de fundamentos, como Tipografía, Colores, Retículas, Contenedores y
 * espacios, Formas y Texturas). Manda `src/styles/tokens.css`: las sombras salen de `elevacionData.ts`. El texto de
 * Definición viene de la documentación anterior de Figma, sin IDs, sin el nombre de la empresa y con voz y tono. Los
 * ejemplos del rubro se cambiaron por otros neutros. Los Do and Dont’s de la documentación anterior eran de radios (van
 * en Formas): los de esta página, Accesibilidad y parte de Desarrollo son criterio propio.
 */

// Figma: 484:591 (página "Elevaciones"; documentación anterior 2466:1567: frames Definición 2466:1568, Valores de token
// 2466:1805 y Espacios 2466:1881, los usos correctos e incorrectos, que son de radios y no de elevación)

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

/** Nombre de una utilidad o de un token en `<code>`. */
const cd = (text: string): DocInline => <code>{text}</code>;

/** Nombre de la sombra de color de una variable responsive: `--color-ds-responsive-effect-shadow-on-card` → "on-card". */
const nombreDe = (colorVar: string): SombraNombre => colorVar.replace('--color-ds-responsive-effect-shadow-', '') as SombraNombre;

const OSCURO_SIN_SOMBRA = invisibleEn('on-card', 'dark') && invisibleEn('on-canva-md', 'dark');
const SM_OSCURO = colorSombra('on-canva-sm', 'dark', 'mobile');

// ───────────────────────── código de ejemplo ─────────────────────────

const TAILWIND_NIVELES = [
  '<article className="rounded-ds-radius-container-on-card',
  '  bg-ds-background-container-default-on-canva',
  '  shadow-ds-on-canva-md',
  '  p-ds-space-container-on-card">',
  '  <div className="rounded-ds-radius-general-xl',
  '    bg-ds-background-container-default-on-card',
  '    shadow-ds-on-card">',
  '    …',
  '  </div>',
  '</article>',
].join('\n');

const CSS_NIVELES = [
  '.contenedor {',
  '  /* Segundo nivel: 0 12 32 -2 */',
  '  box-shadow: 0px 12px 32px -2px',
  '    var(--color-ds-responsive-effect-shadow-on-canva-md);',
  '}',
  '',
  '.anidado {',
  '  /* Primer nivel: 0 4 12 0 */',
  '  box-shadow: 0px 4px 12px 0px',
  '    var(--color-ds-responsive-effect-shadow-on-card);',
  '}',
].join('\n');

const CSS_FLOTANTE = [
  '.flotante {',
  '  box-shadow:',
  '    inset 0 0 0 1px',
  '      var(--color-ds-border-general-default-on-card),',
  '    0px 12px 32px -2px',
  '      var(--color-ds-responsive-effect-shadow-on-canva-md);',
  '}',
].join('\n');

const CSS_FORZADOS = [
  '.flotante {',
  '  /* Borde real: el navegador lo conserva con colores forzados */',
  '  border: 1px solid var(--color-ds-border-general-default-on-card);',
  '  box-shadow: 0px 12px 32px -2px',
  '    var(--color-ds-responsive-effect-shadow-on-canva-md);',
  '}',
  '',
  '@media (forced-colors: active) {',
  '  .flotante {',
  '    border-color: CanvasText;',
  '  }',
  '}',
].join('\n');

const CSS_DROP_SHADOW = [
  '/* La sombra sigue la silueta recortada. */',
  '/* drop-shadow no admite spread. */',
  '.tarjeta-con-muesca {',
  '  filter: drop-shadow(0 12px 32px',
  '    var(--color-ds-responsive-effect-shadow-on-canva-md));',
  '}',
].join('\n');

const TAILWIND_MOVIMIENTO = [
  '<button className="shadow-ds-on-card',
  '  transition-shadow duration-150',
  '  hover:shadow-ds-on-canva-md',
  '  motion-reduce:transition-none">',
  '  Abrir',
  '</button>',
].join('\n');

// ───────────────────────── contenido ─────────────────────────

/** Fila de la tabla de tokens de sombra con utilidad. */
const filaSombra = (s: (typeof SOMBRAS)[number]): DocInline[] => {
  const nombre = nombreDe(s.colorVar);
  return [
    cd(s.name),
    sinPx(s.x),
    sinPx(s.y),
    sinPx(s.blur),
    sinPx(s.spread),
    <ColorSombraCelda key="d" nombre={nombre} theme="dark" />,
    <ColorSombraCelda key="l" nombre={nombre} theme="light" />,
  ];
};

export const doc: FoundationDocContent = {
  name: 'Elevaciones',
  icon: 'cards',
  summary: `Cómo se usan las sombras para dar profundidad y jerarquía: tres niveles de elevación y ${SOMBRAS.length} sombras con utilidad en tokens.css.${OSCURO_SIN_SOMBRA ? ' En oscuro, las sombras de tarjetas y contenedores valen 0%.' : ''}`,
  definition: [
    {
      title: 'Definición y propósito',
      description: 'Las elevaciones dan profundidad entre elementos, delimitan formas en la interfaz y fortalecen la jerarquía de la información.',
      blocks: [
        { type: 'text', content: 'Una sombra cumple tres funciones.' },
        {
          type: 'cards',
          columns: 3,
          items: [
            { title: 'Profundidad', content: 'Separa los elementos en capas y muestra cuál queda encima.' },
            { title: 'Delimitación', content: 'Marca el borde de un contenedor sobre su fondo.' },
            { title: 'Jerarquía', content: 'Ordena la información: lo principal estructura, lo anidado se apoya y lo flotante se superpone.' },
          ],
        },
        ...(OSCURO_SIN_SOMBRA
          ? [
              {
                type: 'note',
                tone: 'alert',
                title: 'En oscuro la sombra no se ve',
                content: (
                  <>
                    <code>shadow-ds-on-card</code> y <code>shadow-ds-on-canva-md</code> valen 0% en oscuro: la elevación se distingue por el tono de la superficie y por el borde. En claro sí se ven, y su opacidad cambia con el breakpoint.
                  </>
                ),
              } satisfies FoundationBlock,
            ]
          : []),
      ],
    },
    {
      title: 'Lógica de elevación',
      description: 'El sistema define tres niveles de elevación, según el tipo de contenedor.',
      blocks: [
        {
          type: 'text',
          content: (
            <>
              El <strong>primer nivel</strong> corresponde a los contenedores hijos (anidados), el <strong>segundo</strong> a los contenedores madre y el <strong>tercero</strong> a los contenedores flotantes.
            </>
          ),
        },
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Primer nivel',
              content: 'Elementos interactivos anidados dentro de contenedores madre, como:',
              preview: <ListaVinetas items={['Componentes de acción: botones, chips, badges.', 'Componentes informativos: acordeones, listas, tarjetas.']} />,
              footer: <>Sombra: <code>shadow-ds-on-card</code>.</>,
            },
            {
              title: 'Segundo nivel',
              content: 'Contenedores principales (contenedores madre), como:',
              preview: <ListaVinetas items={['Tarjetas.', 'Secciones de contenido.']} />,
              footer: <>Sombra: <code>shadow-ds-on-canva-md</code>.</>,
            },
            {
              title: 'Tercer nivel',
              content: 'Elementos que se superponen sobre la interfaz, como:',
              preview: <ListaVinetas items={['Modales.', 'Componentes flotantes.']} />,
              footer: <>Sombra: <code>shadow-ds-on-canva-md</code> y un borde interior de 1 px.</>,
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              preview: <NivelesPorModo />,
              footer: OSCURO_SIN_SOMBRA
                ? 'Cada caja usa la sombra real de su token. En oscuro las sombras valen 0%, así que los niveles se distinguen por el tono de su superficie y, en el tercero, por el borde.'
                : 'Cada caja usa la sombra real de su token.',
            },
          ],
        },
      ],
    },
    {
      title: 'Integración de elevaciones',
      description: 'Los niveles se organizan según la jerarquía de interacción.',
      blocks: [
        {
          type: 'custom',
          content: (
            <ListaVinetas
              items={[
                <>
                  Las elevaciones de <strong>segundo nivel</strong> estructuran el contenido principal.
                </>,
                <>
                  Dentro de estas, se ubican elementos de <strong>primer nivel</strong>.
                </>,
                <>
                  Los elementos superpuestos o flotantes usan elevación de <strong>tercer nivel</strong>.
                </>,
              ]}
            />
          ),
        },
        {
          type: 'cards',
          items: [{ preview: <EsquemaIntegracion />, footer: 'El primer nivel va dentro del segundo, y el tercero se superpone a los dos.' }],
        },
      ],
    },
    {
      title: 'Variables / Elevaciones',
      description: `${SOMBRAS.length} sombras con utilidad y ${SOMBRA_NOMBRES.length} colores de sombra en tokens.css. El color cambia con el modo y con el breakpoint; la posición, el desenfoque y la expansión no.`,
      blocks: [
        subTitle('Tokens de sombra'),
        {
          type: 'table',
          caption: 'Valores de los tokens de sombra por modo y breakpoint',
          minWidth: 1000,
          columns: [
            { header: 'Token', width: 240 },
            { header: 'X', width: 70 },
            { header: 'Y', width: 70 },
            { header: 'Blur', width: 80 },
            { header: 'Spread', width: 90 },
            { header: THEME_LABELS.dark, width: 240 },
            { header: THEME_LABELS.light, width: 240 },
          ],
          rows: [
            ...SOMBRAS.map(filaSombra),
            [
              cd('effect/shadow/on-canva-sm'),
              '—',
              '—',
              '—',
              '—',
              <ColorSombraCelda key="d" nombre="on-canva-sm" theme="dark" />,
              <ColorSombraCelda key="l" nombre="on-canva-sm" theme="light" />,
            ],
          ],
        },
        {
          type: 'text',
          content: (
            <>
              <code>on-canva-sm</code> es solo un color: no tiene utilidad ni geometría. La usa FloatButton con la geometría de la segunda sombra.
              {OSCURO_SIN_SOMBRA && SM_OSCURO ? <> En oscuro, <code>on-card</code> y <code>on-canva-md</code> valen 0%, y <code>on-canva-sm</code> vale {pct(SM_OSCURO.percent)}.</> : null}
            </>
          ),
        },
        {
          type: 'table',
          caption: 'Qué cambia por breakpoint en cada sombra',
          minWidth: 760,
          columns: [
            { header: 'Sombra', width: 260 },
            { header: THEME_LABELS.dark, width: 250 },
            { header: THEME_LABELS.light, width: 330 },
          ],
          rows: SOMBRA_NOMBRES.map((n) => [cd(n), opacidades(n, 'dark'), opacidades(n, 'light')]),
        },
        subTitle('Valores de referencia de diseño'),
        {
          type: 'note',
          tone: 'alert',
          title: 'La tabla de Figma no coincide con el código',
          content: 'Figma define shadow.s, shadow.m y shadow.l con color A06. tokens.css tiene dos sombras con utilidad y usa grises (G06 y G08). Manda el código. Pendiente con diseño.',
        },
        {
          type: 'table',
          caption: 'Valores de referencia de sombra de Figma',
          minWidth: 940,
          columns: [
            { header: 'Valor de Figma', width: 160 },
            { header: 'X', width: 70 },
            { header: 'Y', width: 70 },
            { header: 'Blur', width: 80 },
            { header: 'Color', width: 130 },
            { header: 'Se parece a', width: 240 },
            { header: 'Qué coincide', width: 400 },
          ],
          rows: FIGMA_SOMBRAS.map((f) => [
            cd(f.nombre),
            lines(...f.capas.map((c) => String(c.x))),
            lines(...f.capas.map((c) => String(c.y))),
            lines(...f.capas.map((c) => String(c.blur))),
            f.color,
            f.codigo === 'Ninguna' ? 'Ninguna' : lines(cd(f.codigo), `${geometria(f.codigo)}`),
            f.nota,
          ]),
        },
      ],
    },
  ],
  application: [
    {
      title: 'Dónde va cada nivel',
      description: 'Cada nivel tiene su lugar: el anidado se apoya, el madre estructura y el flotante se superpone.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              preview: <ComposicionAnotada />,
              footer: 'La misma vista con los niveles numerados: 1 un elemento anidado, 2 InformationCard como contenedor madre y 3 DropdownMenuPanel como menú flotante.',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Sombra y componentes de cada nivel',
          minWidth: 900,
          columns: [
            { header: 'Nivel', width: 160 },
            { header: 'Qué es', width: 280 },
            { header: 'Sombra', width: 260 },
            { header: 'Componentes que la llevan', width: 420 },
          ],
          rows: NIVELES.map((n) => [
            n.nombre,
            n.que,
            n.id === 'tercero' ? lines(cd(n.utilidad), 'y borde interior de 1 px') : cd(n.utilidad),
            n.componentes,
          ]),
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Los flotantes de la capa superior no llevan sombra',
          content: 'Modal, AlertModal, Popover, Toast y Tooltip no usan ningún token de sombra: el diálogo se separa con el velo de Backdrop y los demás, con su relleno. Hoy el tercer nivel solo se ve en DropdownMenu y SearchInput. Pendiente con diseño.',
        },
      ],
    },
    {
      title: 'Desktop / Tablet / Mobile',
      description: `Cada vista se dibuja con los valores de su breakpoint. Las sombras cambian solo en su opacidad: en claro, la del segundo nivel es de ${opacidades('on-canva-md', 'light')}.`,
      blocks: [
        ...(OSCURO_SIN_SOMBRA
          ? [{ type: 'text', content: 'Con el tema oscuro las tres vistas se ven sin sombra. Cambia al tema claro para ver la diferencia entre breakpoints.' } satisfies FoundationBlock]
          : []),
        { type: 'custom', content: <ComposicionPorBreakpoint /> },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Pautas para elegir y combinar los niveles de elevación al construir componentes.',
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: 'Criterio propio',
          content: 'Los Do and Dont’s de la documentación anterior de Figma eran de radios y pasaron a Formas. Los de esta página son criterio propio: revísalos con diseño. Las sombras de los ejemplos incorrectos se pintan a mano, para que se vean también en oscuro.',
        },
        subTitle('El nivel sigue a la jerarquía'),
        {
          type: 'text',
          content: 'Sube el nivel solo cuando el elemento esté más arriba en la jerarquía. Una sombra mayor no destaca un contenido.',
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Sombra según el nivel', 'El contenedor madre lleva la sombra mayor y los elementos anidados, la menor.', <MuestraJerarquia good />),
            practice('dont', 'Sombra para destacar', 'Un elemento secundario con la sombra mayor parece más importante que su contenedor.', <MuestraJerarquia good={false} />),
          ],
        },
        subTitle('No apiles sombras'),
        {
          type: 'text',
          content: 'En contenedores anidados, la sombra va en el madre. Separa el contenido de adentro con espacio, tono o una línea.',
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Una sombra y líneas', 'La lista comparte la sombra del contenedor y sus filas se separan con una línea.', <MuestraApilar good />),
            practice('dont', 'Una sombra por fila', 'Cada fila suma su propia sombra y se acumulan en el borde de las demás.', <MuestraApilar good={false} />),
          ],
        },
        subTitle('En oscuro, superficie y borde'),
        {
          type: 'text',
          content: OSCURO_SIN_SOMBRA
            ? 'En oscuro, las sombras de segundo y tercer nivel valen 0%. Un flotante necesita su propio tono de superficie y un borde.'
            : 'Un flotante necesita su propio tono de superficie y un borde, además de la sombra.',
        },
        {
          type: 'practices',
          items: [
            practice('do', 'Superficie y borde', 'El menú tiene borde de 1 px y su propio tono, así que se ve con o sin sombra.', <MuestraSuperficieBorde good />),
            practice('dont', 'Solo sombra', 'El menú comparte el tono del contenedor y no tiene borde: en oscuro desaparece.', <MuestraSuperficieBorde good={false} />),
          ],
        },
      ],
    },
  ],
  accessibility: [
    {
      title: 'Accesibilidad / WCAG 2.2',
      description: 'Una sombra no debe ser la única señal que delimita un control o un flotante. Estos criterios aplican a las superficies elevadas y a sus capas.',
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
              title: 'Delimitación',
              figure: '3:1',
              content: 'Contraste mínimo del borde o de la superficie cuando es lo único que delimita un control (1.4.11, AA).',
            },
            {
              title: 'Colores forzados',
              figure: 'forced-colors',
              content: 'El navegador quita las sombras y los rellenos: el flotante necesita un borde real.',
            },
            {
              title: 'Foco',
              figure: '2.4.11',
              content: 'Un flotante no tapa por completo el elemento con foco (AA).',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Criterios WCAG que aplican a las elevaciones',
          minWidth: 720,
          columns: [
            { header: 'Criterio', width: 340 },
            { header: 'Qué pide a las elevaciones', width: 700 },
          ],
          rows: [
            ['1.4.11 · Contraste de elementos no textuales (AA)', 'Si la sombra o el tono de la superficie es lo único que delimita un control, el borde o la superficie llega a 3:1 con su fondo. Una tarjeta que solo contiene texto no lo exige.'],
            ['1.4.1 · Uso del color (A)', 'Una sombra no dice un estado: un elemento elevado no significa "seleccionado" ni "importante" para quien no la percibe. Suma texto, un ícono o un borde.'],
            ['2.4.11 · Foco no oculto (AA)', 'Un flotante de tercer nivel no tapa por completo el elemento con foco. Si lo cubre, el foco pasa al flotante.'],
            ['2.1.2 · Sin trampas de teclado (A) y 2.4.3 · Orden del foco (A)', 'Un flotante se abre, recibe el foco y se cierra con Escape. Al cerrarse, el foco vuelve a quien lo abrió.'],
            ['2.3.3 · Animación de interacciones (AAA)', 'Si la elevación se anima, la animación se desactiva con prefers-reduced-motion.'],
          ],
        },
      ],
    },
    {
      title: 'Contraste de la superficie y el borde',
      description: 'Relación medida con la fórmula de WCAG 2 sobre los valores de tokens.css en cada modo. El mínimo es 3:1. La muestra dibuja la superficie o el borde sobre lo que tiene detrás.',
      blocks: [
        {
          type: 'table',
          caption: 'Contraste de superficies y bordes contra su fondo por modo',
          minWidth: 900,
          columns: [
            { header: 'Superficie o borde', width: 300 },
            { header: 'Tokens', width: 360 },
            ...THEMES.map((t) => ({ header: THEME_LABELS[t], width: 220 })),
          ],
          rows: PARES_BORDE.map((p) => [
            p.label,
            lines(<code key="f">{p.fg.replace(/^--color-ds-/, '')}</code>, <code key="b">{p.bg.replace(/^--color-ds-/, '')}</code>),
            ...THEMES.map((t) => <DelimitaValor key={t} par={p} theme={t} />),
          ]),
        },
        ...(BAJOS_BORDE.length
          ? [
              {
                type: 'note',
                tone: 'alert',
                title: 'La elevación no delimita por sí sola',
                content: `${BAJOS_BORDE.length} de ${PARES_BORDE.length * THEMES.length} combinaciones no llegan a 3:1 (de ${ratioText(Math.min(...BAJOS_BORDE.map((p) => p.ratio)))} a ${ratioText(Math.max(...BAJOS_BORDE.map((p) => p.ratio)))}): ${[...new Set(BAJOS_BORDE.map((p) => p.tipo))].length > 1 ? 'superficies y bordes de contenedores y flotantes' : 'las medidas'}. Un contenedor o un menú con texto no lo exige: el texto lo identifica. Si el borde o la superficie es lo único que delimita un control, usa un borde que sí llegue.`,
              } satisfies FoundationBlock,
            ]
          : []),
        ...(PARES_BORDE_OK.length
          ? [
              {
                type: 'text',
                content: (
                  <>
                    Llegan a 3:1 en los dos modos:{' '}
                    {[...new Set(PARES_BORDE_OK.map((p) => p.fg))].map((fg, i) => (
                      <span key={fg}>
                        {i > 0 ? '; ' : ''}
                        <code>{fg.replace(/^--color-ds-/, '')}</code> sobre {PARES_BORDE_OK.filter((p) => p.fg === fg).map((p) => p.sobre).join(' y sobre ')}
                      </span>
                    ))}
                    .
                  </>
                ),
              } satisfies FoundationBlock,
            ]
          : []),
        {
          type: 'text',
          content: 'La sombra no cuenta como delimitación: es decorativa y desaparece en oscuro y con colores forzados. Mide siempre la superficie o el borde.',
        },
      ],
    },
    {
      title: 'Colores forzados',
      description: 'Con el modo de contraste alto del sistema (forced-colors), el navegador quita las sombras y los rellenos. Un flotante que solo se delimita con sombra desaparece.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice('do', 'Borde que queda', 'El menú conserva una línea de 1 px: con la sombra fuera, aún se ve.', <MuestraColoresForzados good />),
            practice('dont', 'Solo sombra', 'Sin borde, al forzar los colores el menú pierde su sombra y se confunde con la vista.', <MuestraColoresForzados good={false} />),
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Los bordes de box-shadow también se pierden',
          content: 'Ningún componente declara estilos para forced-colors. DropdownMenu, SearchInput, Alert y NotificationPanel dibujan su borde con box-shadow inset, y el navegador lo quita con los colores forzados. Pendiente: probarlos con el modo de contraste alto de Windows.',
        },
        {
          type: 'text',
          content: (
            <>
              Un borde o un <code>outline</code> transparente sí se pinta en colores forzados. La muestra lo simula con los colores del sistema; no reemplaza una prueba real.
            </>
          ),
        },
      ],
    },
    {
      title: 'Flotantes: foco y diálogo',
      description: 'La sombra solo separa a un flotante a la vista. El foco, el rol y Escape los da el componente.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Qué hace el componente',
              content: (
                <>
                  Modal y AlertModal abren con <code>showModal()</code>; DropdownMenu se abre en la capa superior con <code>popover</code>.
                </>
              ),
              preview: (
                <ListaVinetas
                  items={[
                    'Modal y AlertModal atrapan el foco y dejan la vista de detrás inerte.',
                    'Escape cierra el flotante y el foco vuelve a quien lo abrió.',
                    'DropdownMenu se maneja con teclado y se cierra con Escape.',
                  ]}
                />
              ),
            },
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Una sombra no es un flotante',
          content: 'Un panel con sombra no avisa de nada a un lector de pantalla ni mueve el foco. Usa Modal, AlertModal o DropdownMenu: traen el rol, el foco y Escape.',
        },
      ],
    },
    {
      title: 'Movimiento',
      description: 'Si la elevación cambia con una interacción, la animación respeta la preferencia de movimiento reducido.',
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Qué hacen los componentes',
              content: 'InteractiveCard muestra la sombra al pasar el puntero, sin transición. SearchInput y Table animan el box-shadow de su trazo y lo apagan con motion-reduce y motion-safe.',
            },
            {
              title: 'Qué evitar',
              content: 'No animes una sombra grande en listas largas: cada cuadro obliga a repintar. Anima la opacidad o el transform de una capa aparte.',
            },
          ],
        },
      ],
    },
    {
      title: 'Criterios vs. evidencia',
      description: 'Esta página describe el uso de las elevaciones. No reemplaza una auditoría WCAG del producto.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Evidencia disponible',
              content:
                'Los contrastes se miden con los valores de tokens.css. No hay pruebas con colores forzados de Windows, con lector de pantalla ni con el foco de teclado en las pantallas del producto: hazlas en cada vista.',
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
                    'El nivel de cada elemento sigue su lugar en la jerarquía.',
                    'Un flotante tiene borde de 1 px y su propio tono de superficie.',
                    'Si la delimitación es solo el borde o la superficie, llega a 3:1.',
                    'El flotante tiene borde real para colores forzados.',
                    'Un flotante usa Modal, AlertModal o DropdownMenu, con foco y Escape.',
                    'Una sombra animada se apaga con prefers-reduced-motion.',
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
      description: 'Cada sombra se aplica con su estilo de efecto, no con valores escritos al ojo.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Elevación en un contenedor',
              steps: [
                {
                  title: 'Elegir el nivel',
                  content: (
                    <>
                      Primer nivel: <code>effect/shadow sm</code> (0, 4, 12). Segundo y tercer nivel: <code>effect/shadow md</code> (0, 12, 32, con expansión de -2).
                    </>
                  ),
                },
                {
                  title: 'Aplicar el estilo',
                  content: 'Selecciona el contenedor y aplica el estilo de efecto. El color de la sombra va enlazado a la variable, que cambia con el modo.',
                },
                {
                  title: 'Comprobar en oscuro',
                  content: 'Cambia el modo de la variable a oscuro. La sombra vale 0%: revisa que el nivel se distinga por el tono de la superficie y por el borde.',
                },
                {
                  title: 'Flotante',
                  content: 'Suma un trazo interior de 1 px con el borde por defecto del contenedor, para el tercer nivel.',
                },
              ],
            },
          ],
        },
        {
          type: 'note',
          tone: 'alert',
          title: 'Estilos por confirmar',
          content: 'La documentación anterior de Figma nombra shadow.s, shadow.m y shadow.l con color A06. Los nombres effect/shadow sm y md salen de los comentarios del código. Confirma con diseño los nombres de los estilos y de las variables.',
        },
      ],
    },
    {
      title: 'Consumo técnico',
      description: (
        <>
          Hay dos utilidades de Tailwind, <code>shadow-ds-on-card</code> y <code>shadow-ds-on-canva-md</code>. Su color sigue el modo y el breakpoint porque lee una variable responsive.
        </>
      ),
      blocks: [
        {
          type: 'table',
          caption: 'Utilidades de sombra y su valor',
          minWidth: 900,
          columns: [
            { header: 'Utilidad', width: 260 },
            { header: 'Valor', width: 340 },
            { header: 'Variable de color', width: 440 },
          ],
          rows: SOMBRAS.map((s) => [
            cd(s.name),
            `${sinPx(s.x)} ${sinPx(s.y)} ${sinPx(s.blur)} ${sinPx(s.spread)}`,
            cd(s.colorVar.replace(/^--/, '')),
          ]),
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Niveles en Tailwind',
              content: 'Las utilidades se aplican directo. El contenedor madre lleva la mayor y el elemento anidado, la menor.',
              code: { label: 'Contenedor con elemento anidado en Tailwind', code: TAILWIND_NIVELES },
            },
            {
              title: 'Niveles en CSS',
              content: 'La misma regla con la variable responsive, sin Tailwind.',
              code: { label: 'Sombras de dos niveles en CSS', code: CSS_NIVELES },
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Flotante con borde interior',
              content: (
                <>
                  Así lo dibuja DropdownMenu: un trazo interior con <code>box-shadow</code> inset y la sombra del segundo nivel. En Tailwind escribe el <code>box-shadow</code> entero con corchetes: la utilidad <code>shadow-*</code> antepone sombras vacías de ring e inset y pisaría el trazo.
                </>
              ),
              code: { label: 'Flotante con borde interior y sombra en CSS', code: CSS_FLOTANTE },
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Respaldo con colores forzados',
              content: (
                <>
                  Con <code>forced-colors</code> el navegador quita <code>box-shadow</code>, incluido el trazo inset. Un <code>border</code> sí se pinta: dale el color del sistema en el bloque de colores forzados.
                </>
              ),
              code: { label: 'Flotante con borde real y colores forzados en CSS', code: CSS_FORZADOS },
            },
          ],
        },
        {
          type: 'cards',
          columns: 2,
          items: [
            {
              title: 'Tarjeta con muesca',
              content: 'En una silueta recortada, la sombra va como drop-shadow sobre la capa que se recorta: sigue la silueta. No admite expansión, así que usa x, y y blur.',
              code: { label: 'Sombra con drop-shadow en CSS', code: CSS_DROP_SHADOW },
            },
            {
              title: 'Sombra que cambia al interactuar',
              content: (
                <>
                  Si la sombra cambia en hover, apaga la transición con <code>motion-reduce:transition-none</code>.
                </>
              ),
              code: { label: 'Sombra con transición en Tailwind', code: TAILWIND_MOVIMIENTO },
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
          caption: 'Auditoría de elevaciones',
          minWidth: 720,
          columns: [
            { header: 'Hallazgo', width: 340 },
            { header: 'Decisión o pendiente', width: 700 },
          ],
          rows: [
            [
              'Contenido de la página',
              'Las pestañas de Figma eran Definición, Valores de token y Espacios. Valores de token se repartió entre Definición (Variables) y Desarrollo; Espacios eran los usos correctos e incorrectos y pasaron a Aplicación con criterio nuevo.',
            ],
            [
              'Errores de la documentación anterior',
              'La bajada de Valores de token y de Espacios habla de espacios y de "padding y gap de 4 a 80 px", copiada de Contenedores y espacios. Los Do and Dont’s de Espacios (consistencia visual y efecto anidado) son de radios y de agrupar por proximidad, no de elevación. Errata en la pestaña "Denifición".',
            ],
            [
              'Tabla de sombras',
              'Figma define shadow.s (0, 4, 16), shadow.m (-3, 3, 32) y shadow.l (dos capas de 80), todas con A06. tokens.css tiene 0 4 12 0 y 0 12 32 -2 con G06 o G08, y ninguna sombra de 80. Mandan los valores del código.',
            ],
            [
              'Color de la sombra',
              'Figma usa A06 al 8 y al 12%. En claro el código usa G06 o G08 con opacidades de 8 a 30% según el breakpoint; en oscuro, 0%.',
            ],
            [
              'Niveles y tokens',
              'Figma no asigna una sombra a cada nivel. La asignación de la página sale de lo que hacen los componentes. En la muestra de claro de Figma solo el primer nivel lleva sombra, y en código las tarjetas (segundo nivel) llevan la menor, y algunas las dos. Confirmar con diseño.',
            ],
            [
              'Sombras en oscuro',
              'on-card y on-canva-md valen 0% en oscuro, como en la muestra de oscuro de Figma, donde los tres niveles se ven sin sombra. Solo on-canva-sm vale 60% (FloatButton).',
            ],
            [
              'on-canva-sm',
              'Existe como color, sin utilidad ni geometría. FloatButton escribe 0 12 32 -2 a mano y lee la variante de Desktop (-desktop): su sombra no cambia con el breakpoint.',
            ],
            [
              'Blur de los flotantes',
              'DropdownMenu y SearchInput escriben 0 12 28 -2; el token es 0 12 32 -2 (utilidad shadow-ds-on-canva-md). Diferencia de 4 px en el blur.',
            ],
            [
              'Flotantes sin sombra',
              'Modal, AlertModal, Popover, Toast y Tooltip no llevan sombra. Si el tercer nivel debe aplicarles shadow-ds-on-canva-md, falta definirlo con diseño.',
            ],
            [
              'Colores forzados',
              'Ningún componente declara estilos para forced-colors. Los bordes dibujados con box-shadow inset (DropdownMenu, SearchInput, Alert y NotificationPanel) desaparecen con los colores forzados. Pendiente.',
            ],
            [
              'Contraste',
              BAJOS_BORDE.length
                ? `${BAJOS_BORDE.length} combinaciones de superficie o borde no llegan a 3:1 con su fondo. El detalle está en la pestaña Accesibilidad. Los bordes de contenedores y de menús son decorativos si hay texto dentro.`
                : 'Todas las combinaciones medidas llegan a 3:1.',
            ],
            [
              'Imágenes de la documentación anterior',
              'Los dos PNG de assets (capas de elevación y pantallas de ejemplo) no se usan: el diagrama tiene un fondo claro fijo que no sigue el tema y las pantallas traen nombres y textos del rubro. Los reemplazan muestras con componentes de CAOS. No se borraron.',
            ],
            [
              'Ejemplos y marca',
              'Los ejemplos de la documentación anterior eran del rubro de la empresa. Se cambiaron por ejemplos neutros (plan semanal, tareas, agenda) y por componentes reales de CAOS.',
            ],
            [
              'Ícono del encabezado',
              <>Figma usa un cuadrado con esquinas marcadas, que no está en la biblioteca de CAOS (es el de Formas). Se usa <code key="i">cards</code>: dos tarjetas apiladas.</>,
            ],
            ['Accesibilidad', 'Criterio propio. Faltan pruebas con colores forzados de Windows, lector de pantalla y foco de teclado en las pantallas del producto.'],
          ],
        },
        {
          type: 'text',
          content: (
            <>
              Estilos de efecto de Figma, nombres de variable y asignación de niveles: <strong>por confirmar con diseño</strong>.
            </>
          ),
        },
      ],
    },
  ],
};
