import type { ReactNode } from 'react';
import {
  DoDont,
  DoDontGrid,
  DocFigure,
  DocList,
  DocNote,
  DocSection,
  DocSubsection,
  DocText,
  FoundationPage,
  TokenChip,
  TokenTable,
  colorRef,
  tokensIn,
} from '../_doc';
import type { TokenTheme } from '../_doc';
import iconSvg from '../../../icons/caos/line/magic-star.svg?raw';
import lineas6 from './assets/patron-lineas-6.svg?raw';
import lineas7 from './assets/patron-lineas-7.svg?raw';
import lineas9 from './assets/patron-lineas-9.svg?raw';
import lineas10 from './assets/patron-lineas-10.svg?raw';
import { cn } from '../../utils/cn';

export type TexturasTab = 'definicion' | 'valores-de-token' | 'aplicacion';

/** Degradado de contenedores principales: lineal a 45°, de N01 (0 %) a A06 (100 %), como indica Figma */
const GRADIENT = 'bg-linear-45 from-ds-primitives-color-primary-n01 to-ds-primitives-color-secondary-a06 text-ds-primitives-color-primary-b01';

/** Fondo con formas de color para que se note lo que hay detrás del glass y del blur */
function ColorfulBackdrop({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative isolate flex items-center justify-center overflow-hidden rounded-ds-radius-container-on-card bg-ds-background-container-default-on-canva p-ds-space-general-4xl',
        className,
      )}
    >
      <span aria-hidden="true" className="absolute -top-10 -left-6 -z-10 size-32 rounded-full bg-ds-primitives-color-secondary-a03" />
      <span aria-hidden="true" className="absolute -right-8 -bottom-12 -z-10 size-40 rounded-full bg-ds-primitives-color-tertiary-m03" />
      <span aria-hidden="true" className="absolute bottom-4 left-[4%] -z-10 h-8 w-40 -rotate-12 rounded-full bg-ds-primitives-color-information-ai04" />
      {children}
    </div>
  );
}

/** Texto de ejemplo dentro de los paneles de muestra */
function PanelText({ title, body }: { title: string; body: string }) {
  return (
    <span className="flex flex-col gap-ds-space-general-sm">
      <span className="text-ds-primitives-typography-size-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">{title}</span>
      <span className="text-ds-primitives-typography-size-md text-ds-text-neutral-body">{body}</span>
    </span>
  );
}

/** Glass puro: solo efecto (desenfoque 4), sin relleno */
function GlassPure({ shadow = false }: { shadow?: boolean }) {
  return (
    <div
      className={cn(
        'w-full max-w-sm rounded-ds-radius-container-on-card border border-ds-border-general-gray-fifth p-ds-space-general-4xl',
        shadow && 'shadow-ds-on-canva',
      )}
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <PanelText title="Glass puro" body="Interviene directamente en el fondo del contenedor." />
    </div>
  );
}

/** Glass con opacidad: efecto + relleno B01 al 60 %, para elementos flotantes */
function GlassOpacity() {
  return (
    <div
      className="w-full max-w-sm rounded-ds-radius-container-on-card border border-ds-border-general-gray-fifth bg-ds-primitives-color-primary-b01/60 p-ds-space-general-4xl"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <span className="flex flex-col gap-ds-space-general-sm">
        <span className="text-ds-primitives-typography-size-xl font-ds-primitives-typography-weight-semibold text-ds-primitives-color-primary-n01">Glass con opacidad</span>
        <span className="text-ds-primitives-typography-size-md text-ds-primitives-color-primary-g13">Menús y modales flotantes.</span>
      </span>
    </div>
  );
}

const PATTERNS = [
  { id: 'patron-lineas-6', svg: lineas6, name: 'Patrón de líneas 6' },
  { id: 'patron-lineas-7', svg: lineas7, name: 'Patrón de líneas 7' },
  { id: 'patron-lineas-9', svg: lineas9, name: 'Patrón de líneas 9' },
  { id: 'patron-lineas-10', svg: lineas10, name: 'Patrón de líneas 10' },
];

/** URL de descarga generada desde el SVG ya importado (`?raw`), sin importar cada archivo dos veces */
const svgDownloadUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

function Definicion(): ReactNode {
  return (
    <>
      <DocSection title="Texturas">
        <DocText>
          En la composición de contenedores, se implementan texturas que generan dinamismo a la interfaz y crean
          jerarquía visual a los diferentes contenidos relacionados.
        </DocText>
        <DocText>Las texturas aportan dinamismo y jerarquía visual a la interfaz. Se definen tres tipos:</DocText>
        <DocList items={['Degradado.', 'Glass.', 'Blur.']} />
      </DocSection>

      <DocSection title="Degradado">
        <DocText>
          El degradado se aplica a contenedores que tienen un <strong>nivel jerárquico mayor</strong> frente a otros
          elementos de la interfaz. Su aplicación dentro del sistema de diseño mantiene una lógica de valores
          consistente, permitiendo una unidad gráfica.
        </DocText>
        <DocFigure caption="Lineal, inclinación de 45°, de 0 % a 100 %, del color N01 al A06.">
          <div className={cn('mx-auto h-48 w-full max-w-lg rounded-ds-radius-container-on-card', GRADIENT)} role="img" aria-label="Contenedor con degradado lineal de negro a azul oscuro" />
        </DocFigure>
      </DocSection>

      <DocSection title="Glass">
        <DocText>
          La interfaz maneja el efecto glass en dos escenarios puntuales: como textura de fondo (glass puro) o en
          componentes flotantes (glass con opacidad).
        </DocText>
        <DocSubsection title="Glass puro">
          <DocText>
            El glass puro se trabaja bajo valores exclusivos del efecto, sin relacionarlo con un valor de relleno.
            Interviene directamente en el fondo del contenedor.
          </DocText>
          <DocFigure caption="Aproximación en CSS con backdrop-filter; el efecto de refracción de Figma no tiene equivalente exacto.">
            <ColorfulBackdrop className="min-h-60">
              <GlassPure />
            </ColorfulBackdrop>
          </DocFigure>
        </DocSubsection>
        <DocSubsection title="Glass opacidad">
          <DocText>
            El glass con opacidad combina los valores de glass con un color de relleno, logrando contraste con los
            elementos externos que intervienen con la textura. Se aplica <strong>exclusivamente a elementos flotantes</strong>,
            como menús o modales.
          </DocText>
          <DocFigure>
            <ColorfulBackdrop className="min-h-60">
              <GlassOpacity />
            </ColorfulBackdrop>
          </DocFigure>
        </DocSubsection>
      </DocSection>

      <DocSection title="Blur">
        <DocText>
          La textura blur estará relacionada con un <strong>relleno blanco</strong> y se aplicará directamente como
          filtro al momento de abrir un modal de diálogo.
        </DocText>
        <DocFigure caption="El contenido detrás del diálogo se desenfoca (16) con un relleno blanco semitransparente.">
          <ColorfulBackdrop className="min-h-72">
            <div className="absolute inset-0 flex flex-col gap-ds-space-general-lg p-ds-space-general-4xl">
              <PanelText title="Contenido de la vista" body="Se desenfoca al abrir el modal." />
              <span className="h-10 w-48 rounded-ds-radius-general-full bg-ds-text-neutral-heading" />
            </div>
            <div className="absolute inset-0 bg-ds-primitives-color-primary-b01/30" style={{ backdropFilter: 'blur(16px)' }} />
            <div className="relative w-full max-w-xs rounded-ds-radius-container-on-card bg-ds-background-container-surface p-ds-space-general-4xl">
              <PanelText title="Modal de diálogo" body="Nitidez total sobre el fondo desenfocado." />
            </div>
          </ColorfulBackdrop>
        </DocFigure>
      </DocSection>

      <DocSection title="Recursos de textura">
        <DocText>
          Patrones vectoriales de líneas para fondos de contenedores. Usan <code>currentColor</code>: toman el color de
          texto del elemento que los contiene y se desvanecen hacia transparente, por lo que funcionan en dark y light.
        </DocText>
        <DocFigure caption="Para tintarlos, insértalos en línea (no con img) y define el color del contenedor.">
          <ul className="m-0 grid list-none grid-cols-1 gap-ds-space-general-4xl p-0 tablet:grid-cols-2">
            {PATTERNS.map((p) => (
              <li key={p.id} className="flex flex-col gap-ds-space-general-lg">
                <div
                  role="img"
                  aria-label={`${p.name}: líneas finas de contorno que se desvanecen`}
                  className="aspect-square overflow-hidden rounded-ds-radius-container-on-card bg-ds-background-container-default-on-canva text-ds-text-neutral-heading [&>svg]:block [&>svg]:size-full"
                  dangerouslySetInnerHTML={{ __html: p.svg }}
                />
                <span className="flex items-center justify-between gap-ds-space-general-lg text-ds-primitives-typography-size-md text-ds-text-neutral-body">
                  <TokenChip>{p.id}.svg</TokenChip>
                  <a href={svgDownloadUrl(p.svg)} download={`${p.id}.svg`} className="text-ds-text-neutral-heading underline underline-offset-4">
                    Descargar<span className="sr-only"> {p.id}.svg</span>
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </DocFigure>
      </DocSection>
    </>
  );
}

/** "primitivo + opacidad" de un token de color en un tema */
function colorCell(token: string, theme: TokenTheme): string {
  const ref = colorRef(token, theme);
  return ref ? `${ref.primitive} ${Number(ref.percent.toFixed(2))} %` : '—';
}

const REFERENCE_GLASS: [string, string, string, string, string, string, string][] = [
  ['glass.default', '80', '20', '50', '4', '0', '0'],
  ['glass.opacity', '80', '20', '50', '4', '0', '60 %, B01'],
];

function ValoresDeToken(): ReactNode {
  const degrade = [...tokensIn('dark').keys()].filter((k) => k.startsWith('--color-ds-background-degrade-'));
  const effects = [...tokensIn('dark').keys()].filter((k) => k.startsWith('--color-ds-background-effect-') && /backdrop|filter/.test(k));
  const rowFor = (k: string) => [
    <TokenChip key="n">{k.replace(/^--color-/, '')}</TokenChip>,
    colorCell(k, 'light'),
    colorCell(k, 'dark'),
  ];
  return (
    <DocSection title="Valores de textura">
      <DocSubsection title="Tokens en tokens.css">
        <DocText>
          tokens.css define colores de degradado (extremos de cada gradiente) y de efecto, que cambian con el tema. Se
          leen directamente del archivo.
        </DocText>
        <TokenTable
          caption="Tokens de color de degradado y de efecto en tokens.css"
          minWidth={620}
          columns={['Token', 'Color en claro', 'Color en oscuro']}
          rows={[...degrade, ...effects].map(rowFor)}
        />
      </DocSubsection>

      <DocSubsection title="Valores de referencia de diseño">
        <DocNote>
          Estos cuatro tokens de textura aún no existen en tokens.css: <code>degraded.default</code>,{' '}
          <code>glass.default</code>, <code>glass.opacity</code> y <code>blur.default</code>. Se muestran como referencia
          (las muestras de esta página los usan en código) hasta que se incorporen a los tokens.
        </DocNote>
        <TokenTable
          caption="Degradado por defecto, referencia de Figma"
          columns={['Token (Figma)', 'Propiedades', 'Función principal']}
          rows={[
            [
              <TokenChip key="n">degraded.default</TokenChip>,
              'Lineal, inclinación de 45°, de 0° a 100°. Código de color N01 a A06.',
              'Fondo para contenedores principales.',
            ],
          ]}
        />
        <TokenTable
          caption="Valores de glass, referencia de Figma"
          minWidth={720}
          columns={['Token (Figma)', 'Refracción', 'Profundidad', 'Dispersión', 'Desenfoque', 'Luz', 'Opacidad']}
          rows={REFERENCE_GLASS.map(([n, ...vals]) => [<TokenChip key="n">{n}</TokenChip>, ...vals])}
        />
        <TokenTable
          caption="Valor de blur, referencia de Figma"
          columns={['Token (Figma)', 'Blur']}
          rows={[[<TokenChip key="n">blur.default</TokenChip>, '16']]}
        />
      </DocSubsection>
    </DocSection>
  );
}

/** Vista de ejemplo con contenedores principales: `gradients` indica cuáles llevan degradado */
function ScreenMock({ layout }: { layout: 'good' | 'bad' }) {
  const card = 'flex flex-col gap-ds-space-general-sm rounded-ds-radius-container-on-card p-ds-space-general-xl';
  const grad = (title: string, body: string) => (
    <div className={cn(card, GRADIENT)}>
      <span className="text-ds-primitives-typography-size-xl font-ds-primitives-typography-weight-semibold">{title}</span>
      <span className="text-ds-primitives-typography-size-sm">{body}</span>
    </div>
  );
  const plain = (title: string, body: string) => (
    <div className={cn(card, 'bg-ds-background-tab-select-on-canva')}>
      <span className="text-ds-primitives-typography-size-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">{title}</span>
      <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-heading">{body}</span>
    </div>
  );
  return (
    <div className="flex flex-col gap-ds-space-general-lg rounded-ds-radius-container-on-canva bg-ds-background-container-default-on-canva p-ds-space-general-lg">
      {plain('Te damos la bienvenida', 'Resumen de tu cuenta')}
      {grad('Sigue tu envío', 'Número de guía')}
      {layout === 'good' ? plain('Tus pedidos semanales', 'Entregado 45 · En reparto 15 · Devolución 45') : grad('Tus pedidos semanales', 'Entregado 45 · En reparto 15 · Devolución 45')}
      {layout === 'good' ? plain('Nuevo envío', 'Genera tu guía y programa la recolección.') : grad('Nuevo envío', 'Genera tu guía y programa la recolección.')}
      {grad('Pago en Casa', 'Paga el producto y el envío al recibir.')}
    </div>
  );
}

function Aplicacion(): ReactNode {
  return (
    <DocSection title="Usos correctos e incorrectos">
      <DocText>Buenas prácticas para la implementación de degradados y glass en la construcción de componentes.</DocText>
      <DocSubsection title="Degradados">
        <DocText>
          El degradado solo se implementa en contenedores principales que necesiten destacar dentro de la interfaz. No
          deben implementarse en elementos consecutivos; en un mismo espacio pueden coexistir{' '}
          <strong>máximo dos contenedores con degradado</strong>.
        </DocText>
        <DoDontGrid>
          <DoDont
            variant="do"
            description="Se utilizan máximo dos contenedores con degradado dentro de una misma vista y están separados entre sí."
          >
            <ScreenMock layout="good" />
          </DoDont>
          <DoDont
            variant="dont"
            description="El degradado se usa más de dos veces o en contenedores consecutivos, generando saturación visual."
          >
            <ScreenMock layout="bad" />
          </DoDont>
        </DoDontGrid>
      </DocSubsection>

      <DocSubsection title="Glass no cuenta con elevación">
        <DocText>La textura glass no debe combinarse con sombras.</DocText>
        <DoDontGrid>
          <DoDont variant="do" description="El contenedor con textura glass no utiliza elevación.">
            <ColorfulBackdrop className="min-h-60">
              <GlassPure />
            </ColorfulBackdrop>
          </DoDont>
          <DoDont variant="dont" description="La textura glass incluye sombra, lo que contradice su naturaleza visual.">
            <ColorfulBackdrop className="min-h-60">
              <GlassPure shadow />
            </ColorfulBackdrop>
          </DoDont>
        </DoDontGrid>
      </DocSubsection>
    </DocSection>
  );
}

/** Página "Texturas" de Fundamentos de diseño. `initialTab` abre una pestaña concreta (una historia por pestaña). */
export function Texturas({ initialTab = 'definicion' }: { initialTab?: TexturasTab }) {
  return (
    <FoundationPage
      iconSvg={iconSvg}
      title="Texturas"
      subtitle="Fundamentos y lineamientos para el uso de degradados, glass y blur en los productos digitales de CAOS."
      initialTab={initialTab}
      tabs={[
        { id: 'definicion', label: 'Definición', content: <Definicion /> },
        { id: 'valores-de-token', label: 'Valores de token', content: <ValoresDeToken /> },
        { id: 'aplicacion', label: 'Aplicación', content: <Aplicacion /> },
      ]}
    />
  );
}
