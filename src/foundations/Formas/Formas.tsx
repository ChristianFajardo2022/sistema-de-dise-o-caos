import type { ReactNode } from 'react';
import {
  BREAKPOINT_LABELS,
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
  resolveToken,
  tokensIn,
} from '../_doc';
import type { TokenBreakpoint } from '../_doc';
import iconSvg from '../../../icons/caos/line/grid.svg?raw';
import linea1Img from './assets/linea-1px-ejemplo-formulario-tabla.png';
import linea2Img from './assets/linea-2px-ejemplo-divisor.png';
import { cn } from '../../utils/cn';

export type FormasTab = 'definicion' | 'valores-de-token' | 'aplicacion';

const BREAKPOINTS: TokenBreakpoint[] = ['mobile', 'tablet', 'desktop'];

/** Clases literales (Tailwind solo detecta nombres completos) de los radios primitivos usados en los diagramas */
const RADIUS_CLASS = {
  lg: 'rounded-ds-primitives-radius-lg',
  xl: 'rounded-ds-primitives-radius-xl',
  '2xl': 'rounded-ds-primitives-radius-2xl',
  '3xl': 'rounded-ds-primitives-radius-3xl',
  '4xl': 'rounded-ds-primitives-radius-4xl',
} as const;
type RadiusKey = keyof typeof RADIUS_CLASS;

/** Etiqueta oscura con el valor, como las de Figma */
function ValueTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit rounded-ds-radius-general-md bg-ds-text-neutral-heading px-ds-space-general-lg py-ds-space-general-md text-ds-primitives-typography-size-md text-ds-background-container-surface">
      {children}
    </span>
  );
}

/** Contenedores anidados: cada nivel baja un paso de radio, con su etiqueta */
function NestedRadii({ label, levels }: { label: string; levels: RadiusKey[] }) {
  const px: Record<RadiusKey, string> = { lg: '8 px', xl: '12 px', '2xl': '16 px', '3xl': '24 px', '4xl': '32 px' };
  const surfaces = [
    'bg-ds-background-tab-select-on-canva',
    'bg-ds-background-container-default-on-canva',
    'bg-ds-background-container-default-on-card',
    'bg-ds-background-container-surface',
  ];
  const build = (i: number): ReactNode =>
    i >= levels.length ? null : (
      <div
        className={cn(
          'flex flex-1 flex-col gap-ds-space-general-lg border border-ds-border-general-default-on-card p-ds-space-general-lg',
          RADIUS_CLASS[levels[i]],
          surfaces[i % surfaces.length],
        )}
      >
        <ValueTag>{px[levels[i]]}</ValueTag>
        {build(i + 1)}
      </div>
    );
  return (
    <div className="flex min-h-72 flex-col gap-ds-space-general-lg">
      <span className="w-fit rounded-full bg-ds-text-neutral-heading px-ds-space-general-xl py-ds-space-general-sm text-ds-primitives-typography-size-md font-medium text-ds-background-container-surface">
        {label}
      </span>
      {build(0)}
    </div>
  );
}

/** Muestra de un radio concreto: caja con la esquina redondeada y su etiqueta */
function RadiusSample({ className, size, tag }: { className: string; size: string; tag: string }) {
  return (
    <div className="flex flex-col items-center gap-ds-space-general-lg">
      <div className={cn('bg-ds-background-tab-select-on-canva border border-ds-border-general-default-on-card', className, size)} />
      <ValueTag>{tag}</ValueTag>
    </div>
  );
}

function Definicion(): ReactNode {
  return (
    <>
      <DocSection title="Formas">
        <DocText>
          La interfaz está conformada principalmente por formas cuadradas y circulares, utilizadas como contenedores a lo
          largo del sistema de diseño.
        </DocText>
        <DocText>Según su funcionalidad, estas formas pueden variar mediante:</DocText>
        <DocList
          items={['Tamaño (dimensions).', 'Radio de borde (border-radius).', 'Grosor de línea (stroke).']}
        />
        <DocFigure>
          <div className="grid grid-cols-1 gap-ds-space-general-4xl tablet:grid-cols-2">
            <div className="rounded-ds-radius-container-on-card bg-ds-background-container-default-on-canva p-ds-space-general-4xl">
              <DocSubsection title="Cuadrada" size="sm">
                <p className="m-0 text-ds-primitives-typography-size-md leading-normal text-ds-text-neutral-body">
                  Los contenedores cuadrados deben incluir radio de borde. Este varía según su tamaño y función dentro de la interfaz.
                </p>
                <div className="flex items-end gap-ds-space-general-4xl pt-ds-space-general-4xl">
                  <span aria-hidden="true" className="size-20 bg-ds-text-neutral-heading" />
                  <span aria-hidden="true" className="size-20 rounded-ds-primitives-radius-xl bg-ds-text-neutral-heading" />
                  <span aria-hidden="true" className="h-20 w-32 rounded-ds-primitives-radius-3xl bg-ds-text-neutral-heading" />
                </div>
              </DocSubsection>
            </div>
            <div className="rounded-ds-radius-container-on-card bg-ds-background-container-default-on-canva p-ds-space-general-4xl">
              <DocSubsection title="Circular" size="sm">
                <p className="m-0 text-ds-primitives-typography-size-md leading-normal text-ds-text-neutral-body">
                  Las formas circulares pueden ajustar su tamaño (alto y ancho), manteniendo siempre su proporción.
                </p>
                <div className="flex items-end gap-ds-space-general-4xl pt-ds-space-general-4xl">
                  <span aria-hidden="true" className="size-20 rounded-full bg-ds-text-neutral-heading" />
                  <span aria-hidden="true" className="size-12 rounded-full bg-ds-text-neutral-heading" />
                  <span aria-hidden="true" className="h-12 w-32 rounded-full bg-ds-text-neutral-heading" />
                </div>
              </DocSubsection>
            </div>
          </div>
        </DocFigure>
      </DocSection>

      <DocSection title="Radio de borde">
        <DocText>El uso de radio de borde garantiza una interfaz moderna, consistente y amigable.</DocText>
        <DocText>
          En contenedores anidados, el radio disminuye según la profundidad jerárquica. Se definen los siguientes valores:
        </DocText>
        <DocList
          items={[
            <>
              <strong>Móvil:</strong> 8 px, 12 px, 16 px, 24 px y 48 px (casos específicos).
            </>,
            <>
              <strong>Escritorio:</strong> 12 px, 16 px, 24 px, 32 px y 48 px (casos específicos).
            </>,
          ]}
        />
        <DocFigure caption="Los radios de cada anidación son los de los tokens primitivos de radio.">
          <div className="grid grid-cols-1 gap-ds-space-general-4xl tablet:grid-cols-2">
            <NestedRadii label="Móvil" levels={['3xl', '2xl', 'xl', 'lg']} />
            <NestedRadii label="Escritorio" levels={['4xl', '3xl', '2xl', 'xl']} />
          </div>
        </DocFigure>
        <DocFigure>
          <div className="flex justify-center py-ds-space-general-4xl">
            <div className="flex flex-col items-center gap-ds-space-general-lg">
              <span className="h-12 w-64 rounded-ds-radius-general-full border border-ds-border-general-default-on-card bg-ds-background-tab-select-on-canva" />
              <ValueTag>48 px</ValueTag>
            </div>
          </div>
        </DocFigure>

        <DocSubsection title="24 px - 32 px">
          <DocText>
            Aplicado a contenedores principales (contenedores madre). Permite la coexistencia de contenedores anidados.
          </DocText>
          <DocFigure caption="Radio del token container-on-canva: 24 px en móvil y 32 px en escritorio.">
            <div className="flex justify-center">
              <RadiusSample className="rounded-ds-radius-container-on-canva" size="h-40 w-96 max-w-full" tag="24 px - 32 px" />
            </div>
          </DocFigure>
        </DocSubsection>
        <DocSubsection title="16 px - 24 px">
          <DocText>Aplicado a contenedores secundarios dentro de un contenedor principal.</DocText>
          <DocFigure caption="Radio del token container-on-card: 16 px en móvil y 24 px en escritorio.">
            <div className="flex justify-center">
              <RadiusSample className="rounded-ds-radius-container-on-card" size="h-32 w-64 max-w-full" tag="16 px - 24 px" />
            </div>
          </DocFigure>
        </DocSubsection>
        <DocSubsection title="8 px - 12 px">
          <DocList items={['Contenedores entre 40 px y 70 px: 12 px.', 'Contenedores menores a 40 px: 8 px.']} />
          <DocFigure>
            <div className="flex items-end justify-center gap-ds-space-general-6xl">
              <RadiusSample className="rounded-ds-radius-general-md" size="size-8" tag="8 px" />
              <RadiusSample className="rounded-ds-radius-general-lg" size="size-16" tag="12 px" />
            </div>
          </DocFigure>
        </DocSubsection>
        <DocSubsection title="48 px">
          <DocText>Uso exclusivo en elementos completamente redondeados como:</DocText>
          <DocList items={['Botones.', 'Tags.', 'Chips.']} />
          <DocFigure>
            <div className="flex justify-center">
              <RadiusSample className="rounded-ds-radius-general-full" size="h-10 w-48" tag="48 px" />
            </div>
          </DocFigure>
        </DocSubsection>
      </DocSection>

      <DocSection title="Valores de línea">
        <DocText>Los valores de línea delimitan contenedores y ayudan a establecer jerarquías visuales.</DocText>
        <DocText>Se definen dos valores principales:</DocText>
        <DocList items={['1 px.', '2 px.']} />
        <DocFigure>
          <div className="mx-auto flex max-w-xl flex-col gap-ds-space-general-4xl">
            {[1, 2, 3].map((w) => (
              <div key={w} className="flex items-center gap-ds-space-general-4xl">
                <ValueTag>{w} px</ValueTag>
                <span aria-hidden="true" className="flex-1 bg-ds-text-neutral-heading" style={{ height: w }} />
              </div>
            ))}
          </div>
        </DocFigure>
        <DocNote>Los grosores de 2 px y 3 px aún no existen como token: tokens.css solo define strokes primitivos menores o iguales a 1.5 px.</DocNote>

        <DocSubsection title="Línea de 1 px">
          <DocText>Uso principal en:</DocText>
          <DocList items={['Contenedores estructurales.', 'Formularios.', 'Tablas.', 'Tarjetas.', 'Modales.', 'Botones.']} />
          <DocFigure
            image={linea1Img}
            alt="Modal con el título «¿Dónde recogemos tu envío?», un campo de búsqueda y una tabla de tres filas con columnas Nombre, Fecha y Actividad, y el botón «Mostrar más». Campo, tabla y modal están delimitados por líneas de 1 px."
          />
        </DocSubsection>
        <DocSubsection title="Línea de 2 px - 3 px">
          <DocText>Uso en divisores de sección, según necesidad visual.</DocText>
          <DocFigure
            image={linea2Img}
            alt="Tarjeta «Servicios Premium» con la etiqueta «Envío rápido» y el texto «¿Dónde recogemos tu envío?», separada de su contenido por un divisor grueso de 2 a 3 px."
          />
        </DocSubsection>
      </DocSection>
    </>
  );
}

/**
 * Línea de un grosor dado. Chrome redondea `border-width` a píxeles enteros (0.2, 0.5 y 1.5 px salen como 1 px),
 * así que la línea es una caja de 1 px escalada en vertical: `scaleY` no se redondea y el borde se dibuja
 * con el grosor real (suavizado) en vez de uno entero.
 */
function StrokeSample({ width }: { width: number }) {
  return (
    <span aria-hidden="true" className="flex h-4 w-24 items-center">
      <span
        data-stroke={width}
        className="block h-px w-full bg-ds-text-neutral-heading"
        style={{ transform: `scaleY(${width})`, visibility: width > 0 ? 'visible' : 'hidden' }}
      />
    </span>
  );
}

/** Ordena nombres de token por su valor en px */
const pxOf = (v: string | undefined) => parseFloat(v ?? '0');

function ValoresDeToken(): ReactNode {
  const base = tokensIn('base');
  const common = tokensIn('common');
  const primRadius = [...base].filter(([k]) => k.startsWith('--ds-primitives-radius-')).sort((a, b) => pxOf(a[1]) - pxOf(b[1]));
  const primStroke = [...base].filter(([k]) => k.startsWith('--ds-primitives-stroke-')).sort((a, b) => pxOf(a[1]) - pxOf(b[1]));
  const respRadius = [...common.keys()].filter((k) => k.startsWith('--ds-responsive-radius-'));
  const respBorder = [...common.keys()].filter((k) => k.startsWith('--ds-responsive-border-'));
  const name = (k: string) => k.replace(/^--ds-/, '');

  return (
    <>
      <DocSection title="Valores de radio de borde">
        <DocSubsection title="Radios primitivos">
          <DocText>Escala base de radios. Los tokens responsivos apuntan a estos valores.</DocText>
          <TokenTable
            caption="Tokens primitivos de radio de borde"
            columns={['Token', 'Valor (px)', 'Muestra', 'Clase']}
            rows={primRadius.map(([k, v]) => [
              <TokenChip key="n">{name(k)}</TokenChip>,
              v.replace('px', ''),
              <span
                key="m"
                aria-hidden="true"
                className="block size-10 border border-ds-border-general-default-on-card bg-ds-background-tab-select-on-canva"
                style={{ borderRadius: v }}
              />,
              <TokenChip key="c">{`rounded-ds-${name(k)}`}</TokenChip>,
            ])}
          />
        </DocSubsection>
        <DocSubsection title="Radios responsivos">
          <DocText>
            Cada token responsivo cambia de valor con el breakpoint: se muestra el valor resuelto en móvil, tablet y
            escritorio. La clase de Tailwind es <code>rounded-ds-radius-*</code> con el nombre sin el prefijo
            «responsive-radius-» (por ejemplo, <code>rounded-ds-radius-container-on-canva</code>).
          </DocText>
          <TokenTable
            caption="Tokens responsivos de radio de borde por breakpoint"
            minWidth={640}
            columns={['Token', ...BREAKPOINTS.map((b) => `Valor en ${BREAKPOINT_LABELS[b]} (px)`)]}
            rows={respRadius.map((k) => [
              <TokenChip key="n">{name(k)}</TokenChip>,
              ...BREAKPOINTS.map((b) => (resolveToken(k, 'dark', b) ?? '—').replace('px', '')),
            ])}
          />
        </DocSubsection>
      </DocSection>

      <DocSection title="Valores de línea">
        <DocSubsection title="Strokes primitivos">
          <TokenTable
            caption="Tokens primitivos de grosor de línea"
            columns={['Token', 'Valor (px)', 'Muestra', 'Clase']}
            rows={primStroke.map(([k, v]) => [
              <TokenChip key="n">{name(k)}</TokenChip>,
              v.replace('px', ''),
              <StrokeSample key="m" width={pxOf(v)} />,
              <TokenChip key="c">{`border-ds-${name(k)}`}</TokenChip>,
            ])}
          />
        </DocSubsection>
        <DocSubsection title="Bordes responsivos">
          <TokenTable
            caption="Tokens responsivos de borde"
            columns={['Token', 'Apunta a', 'Valor (px)', 'Clase']}
            rows={respBorder.map((k) => [
              <TokenChip key="n">{name(k)}</TokenChip>,
              (common.get(k) ?? '').replace(/var\(--ds-(.*)\)/, '$1'),
              (resolveToken(k, 'dark') ?? '—').replace('px', ''),
              <TokenChip key="c">{`border-ds-${name(k).replace('responsive-', '')}`}</TokenChip>,
            ])}
          />
        </DocSubsection>
      </DocSection>
    </>
  );
}

/** Tarjeta de pago con radios configurables (Adaptabilidad) */
function PaymentCard({ label, outer, inner, btn }: { label: string; outer: string; inner: string; btn: string }) {
  return (
    <div className="flex flex-1 flex-col gap-ds-space-general-lg">
      <ValueTag>{label}</ValueTag>
      <div className={cn('flex flex-col gap-ds-space-general-xl bg-ds-background-container-default-on-canva p-ds-space-general-xl', outer)}>
        <span className="text-ds-primitives-typography-size-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
          Método de pago
        </span>
        {['Transferencia', 'Tarjeta', 'Efectivo'].map((m) => (
          <span key={m} className="flex items-center gap-ds-space-general-lg text-ds-primitives-typography-size-md text-ds-text-neutral-heading">
            <span aria-hidden="true" className={cn('size-8 shrink-0 bg-ds-background-tab-select-on-canva', inner)} />
            {m}
          </span>
        ))}
        <span className={cn('w-fit bg-ds-text-neutral-heading px-ds-space-general-4xl py-ds-space-general-lg text-ds-primitives-typography-size-sm text-ds-background-container-surface', btn)}>
          Siguiente
        </span>
      </div>
    </div>
  );
}

/** Tarjeta de perfil con tres niveles anidados: `good` baja el radio por nivel */
function NestedMock({ good }: { good: boolean }) {
  const outer = good ? 'rounded-ds-primitives-radius-3xl' : 'rounded-ds-primitives-radius-2xl';
  const mid = 'rounded-ds-primitives-radius-2xl';
  const inner = good ? 'rounded-ds-primitives-radius-xl' : 'rounded-ds-primitives-radius-2xl';
  return (
    <div className={cn('flex flex-col gap-ds-space-general-xl bg-ds-background-container-default-on-canva p-ds-space-general-lg', outer)}>
      <div className={cn('flex flex-col gap-ds-space-general-lg bg-ds-background-tab-select-on-canva p-ds-space-general-lg', mid)}>
        <span className="text-ds-primitives-typography-size-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
          Descripción del cargo
        </span>
        <span className={cn('bg-ds-background-container-surface p-ds-space-general-lg text-ds-primitives-typography-size-sm leading-normal text-ds-text-neutral-body', inner)}>
          Responsable de gestión de inventarios, optimización de almacén y supervisión de equipos.
        </span>
        <span className="flex justify-between text-ds-primitives-typography-size-sm text-ds-text-neutral-heading">
          <span className={cn('border border-ds-border-general-default-on-card px-ds-space-general-xl py-ds-space-general-md', inner)}>Anterior</span>
          <span className={cn('bg-ds-text-neutral-heading px-ds-space-general-xl py-ds-space-general-md text-ds-background-container-surface', inner)}>Siguiente</span>
        </span>
      </div>
    </div>
  );
}

function Aplicacion(): ReactNode {
  return (
    <DocSection title="Usos correctos e incorrectos">
      <DocText>Buenas prácticas para la implementación de radio de borde y bordes en la construcción de componentes.</DocText>
      <DocSubsection title="Consistencia visual">
        <DocText>Es necesario mantener una jerarquía clara en los radios de borde para asegurar armonía entre contenedores.</DocText>
        <DoDontGrid>
          <DoDont
            variant="do"
            description="La tarjeta respeta los niveles de radio frente a sus contenedores internos (24, 16 y 12 px), generando equilibrio y jerarquía visual."
          >
            <NestedMock good />
          </DoDont>
          <DoDont
            variant="dont"
            description="La tarjeta no respeta los niveles de radio: el contenedor hijo y el interno tienen el mismo valor (16 px), lo que rompe la armonía visual."
          >
            <NestedMock good={false} />
          </DoDont>
        </DoDontGrid>
      </DocSubsection>

      <DocSubsection title="Adaptabilidad">
        <DocText>Los valores de borde deben ajustarse según el dispositivo para mantener la proporción visual.</DocText>
        <DoDontGrid>
          <DoDont
            variant="do"
            description="Las versiones móvil y de escritorio adaptan los radios de borde de forma proporcional, manteniendo consistencia visual."
          >
            <div className="flex flex-col gap-ds-space-general-xl">
              <PaymentCard label="Móvil" outer="rounded-ds-primitives-radius-3xl" inner="rounded-ds-primitives-radius-lg" btn="rounded-ds-radius-general-full" />
              <PaymentCard label="Escritorio" outer="rounded-ds-primitives-radius-4xl" inner="rounded-ds-primitives-radius-xl" btn="rounded-ds-radius-general-full" />
            </div>
          </DoDont>
          <DoDont
            variant="dont"
            description="Se usan los mismos valores de borde en todos los dispositivos, afectando la proporción y la legibilidad."
          >
            <div className="flex flex-col gap-ds-space-general-xl">
              <PaymentCard label="Móvil" outer="rounded-ds-primitives-radius-3xl" inner="rounded-ds-primitives-radius-lg" btn="rounded-ds-radius-general-full" />
              <PaymentCard label="Escritorio" outer="rounded-ds-primitives-radius-3xl" inner="rounded-ds-primitives-radius-lg" btn="rounded-ds-radius-general-full" />
            </div>
          </DoDont>
        </DoDontGrid>
      </DocSubsection>
    </DocSection>
  );
}

/** Página "Formas" de Fundamentos de diseño. `initialTab` abre una pestaña concreta (una historia por pestaña). */
export function Formas({ initialTab = 'definicion' }: { initialTab?: FormasTab }) {
  return (
    <FoundationPage
      iconSvg={iconSvg}
      title="Formas"
      subtitle="Fundamentos y lineamientos para el uso de formas, radios de borde y líneas en los productos digitales de CAOS."
      initialTab={initialTab}
      tabs={[
        { id: 'definicion', label: 'Definición', content: <Definicion /> },
        { id: 'valores-de-token', label: 'Valores de token', content: <ValoresDeToken /> },
        { id: 'aplicacion', label: 'Aplicación', content: <Aplicacion /> },
      ]}
    />
  );
}
