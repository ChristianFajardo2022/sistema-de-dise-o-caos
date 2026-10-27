import type { ReactNode } from 'react';
import {
  BREAKPOINT_LABELS,
  DoDont,
  DoDontGrid,
  DocFigure,
  DocList,
  DocSection,
  DocSubsection,
  DocText,
  FoundationPage,
  TokenChip,
  TokenTable,
  colorRef,
  readShadowTokens,
  stripPx,
} from '../_doc';
import type { TokenBreakpoint, TokenTheme } from '../_doc';
import iconSvg from '../../../icons/caos/line/scan.svg?raw';
import capasImg from './assets/niveles-de-elevacion-capas.png';
import pantallasImg from './assets/niveles-de-elevacion-pantallas.png';
import { cn } from '../../utils/cn';

export type ElevacionesTab = 'definicion' | 'valores-de-token' | 'aplicacion';

const BREAKPOINTS: TokenBreakpoint[] = ['mobile', 'tablet', 'desktop'];

/** Celda de color de una sombra: primitivo y opacidad por breakpoint, leídos de tokens.css */
function ShadowColorCell({ colorVar, theme }: { colorVar: string; theme: TokenTheme }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-ds-space-general-sm p-0">
      {BREAKPOINTS.map((bp) => {
        const ref = colorRef(colorVar, theme, bp);
        return (
          <li key={bp} className="whitespace-nowrap">
            <span className="text-ds-text-neutral-gray">{BREAKPOINT_LABELS[bp]}</span>{' '}
            {ref ? `${ref.primitive} ${Number(ref.percent.toFixed(2))} %` : '—'}
          </li>
        );
      })}
    </ul>
  );
}

/** Caja de nivel para el espécimen: usa la sombra real del token indicado */
function LevelBox({ label, token, shadow }: { label: string; token: string; shadow: string }) {
  return (
    <div className="flex flex-col items-center gap-ds-space-general-lg">
      <div
        className={cn(
          'flex h-32 w-full items-center justify-center rounded-ds-radius-container-on-canva bg-ds-background-container-default-on-canva text-ds-primitives-typography-size-md text-ds-text-neutral-heading tablet:h-40',
          shadow,
        )}
      >
        {label}
      </div>
      <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-body">{token}</span>
    </div>
  );
}

function Definicion(): ReactNode {
  return (
    <>
      <DocSection title="Elevaciones">
        <DocText>
          Las elevaciones dentro del sistema de diseño <strong>permiten generar profundidad entre elementos</strong>,
          delimitar formas en la interfaz y fortalecer la jerarquía de la información.
        </DocText>
      </DocSection>

      <DocSection title="Lógica de elevación">
        <DocText>El sistema define tres niveles de elevación, aplicados según el tipo de contenedor:</DocText>
        <DocList items={['Contenedores madre.', 'Contenedores hijos (anidados).', 'Contenedores flotantes.']} />
        <DocText>Estos niveles se clasifican de la siguiente manera:</DocText>
        <DocFigure
          image={capasImg}
          alt="Diagrama en perspectiva con tres planos apilados sobre los ejes x, y y w: el primer nivel es el plano superior celeste, el segundo nivel el plano intermedio azul y el tercer nivel el plano inferior azul oscuro."
        />

        <DocSubsection title="Elevación de primer nivel">
          <DocText>Corresponde a elementos interactivos anidados dentro de contenedores madre, como:</DocText>
          <DocList
            items={[
              'Componentes de acción: botones, chips, badges.',
              'Componentes informativos: acordeones, listas, tarjetas.',
            ]}
          />
        </DocSubsection>
        <DocSubsection title="Elevación de segundo nivel">
          <DocText>Aplica a contenedores principales (contenedores madre), como:</DocText>
          <DocList items={['Tarjetas.', 'Secciones de contenido.']} />
        </DocSubsection>
        <DocSubsection title="Elevación de tercer nivel">
          <DocText>Incluye elementos que se superponen sobre la interfaz, como:</DocText>
          <DocList items={['Modales.', 'Componentes flotantes.']} />
        </DocSubsection>

        <DocFigure caption="Cada caja usa la sombra real del token indicado. Si el tema activo define la sombra sin opacidad, la caja se distingue solo por el tono de su superficie.">
          <div className="grid grid-cols-1 gap-ds-space-general-4xl tablet:grid-cols-3">
            <LevelBox label="Primer nivel" token="shadow-ds-on-card" shadow="shadow-ds-on-card" />
            <LevelBox label="Segundo nivel" token="shadow-ds-on-canva-md" shadow="shadow-ds-on-canva-md" />
            <LevelBox label="Tercer nivel" token="shadow-ds-on-canva-md" shadow="shadow-ds-on-canva-md" />
          </div>
        </DocFigure>
      </DocSection>

      <DocSection title="Integración de elevaciones">
        <DocText>Los niveles de elevación se organizan según la jerarquía de interacción:</DocText>
        <DocList
          items={[
            <>
              Las elevaciones de <strong>segundo nivel</strong> estructuran el contenido principal.
            </>,
            <>
              Dentro de estas, se ubican elementos de <strong>primer nivel.</strong>
            </>,
            <>
              Los elementos superpuestos o flotantes utilizan elevación de <strong>tercer nivel.</strong>
            </>,
          ]}
        />
        <DocFigure
          image={pantallasImg}
          alt="Dos pantallas móviles de ejemplo. Una tarjeta de perfil con botón y una tarjeta de calificación semestral; en la otra, una hoja flotante con un aviso de error. Líneas guía señalan el primer nivel (chip y botón dentro de la tarjeta), el segundo nivel (la tarjeta) y el tercer nivel (la barra de navegación y la hoja flotante)."
        />
      </DocSection>
    </>
  );
}

function ValoresDeToken(): ReactNode {
  const shadows = readShadowTokens();
  return (
    <DocSection title="Valores de sombra">
      <DocText>
        Cada token de sombra define el desplazamiento (posición X e Y), el desenfoque (blur), la expansión (spread) y el
        color, que cambia con el tema y con el breakpoint.
      </DocText>
      <TokenTable
        caption="Valores de los tokens de sombra"
        minWidth={820}
        columns={['Token', 'Posición X', 'Posición Y', 'Blur', 'Spread', 'Color en claro', 'Color en oscuro']}
        rows={shadows.map((s) => [
          <TokenChip key="n">{s.name}</TokenChip>,
          stripPx(s.x),
          stripPx(s.y),
          stripPx(s.blur),
          stripPx(s.spread),
          <ShadowColorCell key="l" colorVar={s.colorVar} theme="light" />,
          <ShadowColorCell key="d" colorVar={s.colorVar} theme="dark" />,
        ])}
      />
      <DocText>
        Cuando el color en oscuro tiene 0 % de opacidad, la sombra no se ve en el tema dark y la elevación se distingue
        por el tono de la superficie.
      </DocText>
    </DocSection>
  );
}

/** Mockup de pasos de pago: agrupa por proximidad (correcto) o separa todo por igual (incorrecto) */
function PaymentMock({ good }: { good: boolean }) {
  const item = 'flex items-center gap-ds-space-general-xl text-ds-primitives-typography-size-md text-ds-text-neutral-heading';
  const dot = 'size-10 shrink-0 rounded-ds-radius-general-md bg-ds-background-tab-select-on-canva';
  return (
    <div
      className={cn(
        'flex flex-col rounded-ds-radius-general-xl bg-ds-background-container-default-on-canva p-ds-space-general-4xl',
        good ? '' : 'gap-ds-space-general-4xl',
      )}
    >
      <div className={cn('flex flex-col', good ? 'gap-ds-space-general-sm' : 'gap-ds-space-general-4xl')}>
        <span className="text-ds-primitives-typography-size-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
          Método de pago
        </span>
        <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-body">Selecciona tu medio de pago</span>
      </div>
      <div className={cn('flex flex-col', good ? 'mt-ds-space-general-4xl gap-ds-space-general-lg' : 'gap-ds-space-general-4xl')}>
        {['Transferencia bancaria', 'Tarjeta', 'Efectivo'].map((m) => (
          <span key={m} className={item}>
            <span aria-hidden="true" className={dot} />
            {m}
          </span>
        ))}
      </div>
      <div className={cn('flex justify-between', good ? 'mt-ds-primitives-space-6xl' : '')}>
        <span className="rounded-full border border-ds-border-general-default-on-card px-ds-space-general-4xl py-ds-space-general-lg text-ds-primitives-typography-size-sm text-ds-text-neutral-heading">
          Anterior
        </span>
        <span className="rounded-full bg-ds-text-neutral-heading px-ds-space-general-4xl py-ds-space-general-lg text-ds-primitives-typography-size-sm text-ds-background-container-surface">
          Siguiente
        </span>
      </div>
    </div>
  );
}

/** Mockup de tarjeta con tres contenedores anidados; `good` aplica la jerarquía de radios 16 / 8 / 4 */
function NestedMock({ good }: { good: boolean }) {
  const outer = 'rounded-ds-radius-general-xl';
  const mid = good ? 'rounded-ds-radius-general-md' : 'rounded-ds-radius-general-xl';
  const inner = good ? 'rounded-ds-radius-general-sm' : 'rounded-ds-radius-general-xl';
  return (
    <div className={cn('flex flex-col gap-ds-space-general-xl bg-ds-background-container-default-on-canva p-ds-space-general-lg', outer)}>
      <div className={cn('flex items-center gap-ds-space-general-xl bg-ds-background-tab-select-on-canva p-ds-space-general-lg', mid)}>
        <span aria-hidden="true" className={cn('size-10 shrink-0 bg-ds-background-general-gray-secondary', inner)} />
        <span className="flex flex-col text-ds-primitives-typography-size-md text-ds-text-neutral-heading">
          Perfil
          <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-heading">Coordinación de bodega</span>
        </span>
      </div>
      <div className="flex flex-col gap-ds-space-general-md px-ds-space-general-lg pb-ds-space-general-lg">
        <span className="text-ds-primitives-typography-size-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
          Descripción del cargo
        </span>
        <span className="text-ds-primitives-typography-size-sm leading-normal text-ds-text-neutral-body">
          Responsable de gestión de inventarios, optimización de almacén y supervisión de equipos.
        </span>
      </div>
    </div>
  );
}

function Aplicacion(): ReactNode {
  return (
    <DocSection title="Usos correctos e incorrectos">
      <DocSubsection title="Consistencia visual">
        <DocText>
          Los componentes utilizan valores de <strong>border-radius (16 px, 8 px y 4 px)</strong> según su jerarquía y
          escala, definidos en la guía de estilos.
        </DocText>
        <DoDontGrid>
          <DoDont
            variant="do"
            description="El contenedor presenta un equilibrio visual claro. El título y el cuerpo se agrupan por proximidad, mientras que el botón se jerarquiza mediante un mayor espaciado superior."
          >
            <PaymentMock good />
          </DoDont>
          <DoDont
            variant="dont"
            description="No hay una agrupación clara de la información. Todos los elementos tienen el mismo espaciado, lo que genera pérdida de jerarquía."
          >
            <PaymentMock good={false} />
          </DoDont>
        </DoDontGrid>
      </DocSubsection>

      <DocSubsection title="Efecto anidado">
        <DocText>Cuando existen contenedores anidados, se debe mantener una jerarquía de radios:</DocText>
        <DocList items={['El contenedor madre tiene un radio mayor.', 'Los contenedores hijos tienen radios progresivamente menores.']} />
        <DoDontGrid>
          <DoDont
            variant="do"
            description={
              <>
                <span>La tarjeta mantiene la jerarquía de radios:</span>
                <DocList items={['Contenedor madre: 16 px.', 'Contenedor hijo: 8 px.', 'Contenedor interno (imagen): 4 px.']} className="text-ds-primitives-typography-size-md" />
                <span>Esto genera equilibrio y jerarquía visual.</span>
              </>
            }
          >
            <NestedMock good />
          </DoDont>
          <DoDont
            variant="dont"
            description="Los contenedores tienen el mismo valor de radio, lo que rompe la jerarquía y la armonía visual."
          >
            <NestedMock good={false} />
          </DoDont>
        </DoDontGrid>
      </DocSubsection>
    </DocSection>
  );
}

/**
 * Página "Elevaciones" de Fundamentos de diseño.
 * `initialTab` permite abrirla directamente en una pestaña (una historia por pestaña).
 */
export function Elevaciones({ initialTab = 'definicion' }: { initialTab?: ElevacionesTab }) {
  return (
    <FoundationPage
      iconSvg={iconSvg}
      title="Elevaciones"
      subtitle="Fundamentos y lineamientos para el uso de elevaciones en los productos digitales de CAOS."
      initialTab={initialTab}
      tabs={[
        { id: 'definicion', label: 'Definición', content: <Definicion /> },
        { id: 'valores-de-token', label: 'Valores de token', content: <ValoresDeToken /> },
        { id: 'aplicacion', label: 'Aplicación', content: <Aplicacion /> },
      ]}
    />
  );
}
