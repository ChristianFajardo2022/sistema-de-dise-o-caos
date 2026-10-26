import type { CSSProperties, ReactNode } from 'react';
import {
  BREAKPOINT_LABELS,
  DoDont,
  DoDontGrid,
  DocFigure,
  DocList,
  DocSection,
  DocSubsection,
  DocText,
  DocToc,
  FoundationPage,
  ScrollRegion,
  TokenChip,
  TokenTable,
  px,
  tokensIn,
} from '../_doc';
import type { TokenBreakpoint } from '../_doc';
import iconSvg from '../../../icons/caos/line/row-vertical.svg?raw';
import { cn } from '../../utils/cn';

export type ContenedoresYEspaciosTab = 'definicion' | 'valores-de-token' | 'aplicacion';

const BREAKPOINTS: TokenBreakpoint[] = ['mobile', 'tablet', 'desktop'];

const PAD = 'bg-ds-background-graphic-information-secondary-opacity';
const GAP = 'bg-ds-background-graphic-tertiary-secondary-opacity';

interface PrimitiveSpace {
  /** Sufijo del token, p. ej. "2xl" */
  key: string;
  variable: string;
  value: number;
}

/** Escala de espacios primitivos de tokens.css, ordenada por valor */
function readPrimitiveSpaces(): PrimitiveSpace[] {
  const out: PrimitiveSpace[] = [];
  for (const [name, value] of tokensIn('base')) {
    const m = name.match(/^--ds-primitives-space-(.+)$/);
    if (m) out.push({ key: m[1], variable: name, value: parseFloat(value) });
  }
  return out.sort((a, b) => a.value - b.value);
}

/** Espacios responsivos "general" (los que usan las utilidades `p-ds-space-general-*`), ordenados por su valor en móvil */
function readGeneralSpaces(): string[] {
  const names = new Set<string>();
  for (const scope of ['common', 'tablet', 'desktop'] as const) {
    for (const name of tokensIn(scope).keys()) if (name.startsWith('--ds-responsive-space-general-')) names.add(name);
  }
  return [...names].sort((a, b) => px(a) - px(b) || a.localeCompare(b));
}

/** Rellena un hueco de espacio con su medida, para los esquemas de padding y gap */
function Spacer({ size, label, className, horizontal }: { size: string; label: string; className: string; horizontal?: boolean }) {
  const style: CSSProperties = horizontal ? { width: size } : { height: size };
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center text-ds-primitives-typography-size-xs text-ds-text-neutral-heading', className)}
      style={style}
    >
      {label}
    </div>
  );
}

/** Prefijo de los espacios primitivos; `sp('6xl')` devuelve la referencia CSS a ese token (la clave sale de la escala de tokens.css) */
const SPACE_PREFIX = '--ds-primitives-space-';
const sp = (key: string) => 'var(' + SPACE_PREFIX + key + ')';

/** Contenedor con scroll propio para esquemas que no se comprimen */
function Scroll({ children, name, minWidth }: { children: ReactNode; name: string; minWidth: number }) {
  return (
    <ScrollRegion label={name}>
      <div style={{ minWidth }}>{children}</div>
    </ScrollRegion>
  );
}

const LEVELS = [
  { name: 'Contenedor madre', pad: '7xl', className: 'bg-ds-background-graphic-error-secondary-opacity' },
  { name: 'Contenedor hijo de 2.º nivel', pad: '6xl', className: 'bg-ds-background-graphic-alert-secondary-opacity' },
  { name: 'Contenedor hijo de 3.er nivel', pad: '4xl', className: 'bg-ds-background-graphic-success-secondary-opacity' },
  { name: 'Contenedor hijo de 4.º nivel', pad: '4xl', className: 'bg-ds-background-graphic-information-secondary-opacity' },
];

/** Contenedores anidados: cada nivel usa el padding real de su token */
function NestedContainers({ levels = LEVELS }: { levels?: typeof LEVELS }) {
  const [first, ...rest] = levels;
  const render = (level: (typeof LEVELS)[number], remaining: typeof rest): ReactNode => {
    const [next, ...others] = remaining;
    return (
      <div className={cn('border border-ds-border-general-gray-fifth', level.className)} style={{ padding: sp(level.pad) }}>
        {next ? render(next, others) : <div className="h-14" />}
      </div>
    );
  };
  return <>{render(first, rest)}</>;
}

function Definicion(): ReactNode {
  const scale = readPrimitiveSpaces();
  const max = Math.max(...scale.map((s) => s.value));
  return (
    <>
      <DocSection title="Definición">
        <DocText>
          Los contenedores organizan los elementos visuales de la interfaz en niveles de jerarquía, estructurando la
          información para facilitar la navegación y la toma de decisiones del usuario.
        </DocText>
      </DocSection>

      <DocToc
        items={[
          { id: 'contenedores-jerarquia', label: 'Jerarquía de contenedores' },
          { id: 'contenedores-padding', label: 'Padding' },
          { id: 'contenedores-gap', label: 'Gap' },
          { id: 'contenedores-equivalencias', label: 'Gráfica de equivalencias' },
        ]}
      />

      <DocSection title="Jerarquía de contenedores" id="contenedores-jerarquia">
        <DocText>Los contenidos y elementos que componen una interfaz se rigen por el principio de contenedor.</DocText>
        <DocText>
          Existe un contenedor de primer nivel (por ejemplo, el fondo) y contenedores de segundo, tercer o cuarto nivel
          (como tarjetas o modales) (ver esquema).
        </DocText>
        <DocText>
          En un mismo ecosistema digital <strong>pueden coexistir diferentes contenedores organizados mediante jerarquías de información</strong>.
          Estas jerarquías guían al usuario dentro del entorno y facilitan el cumplimiento de tareas.
        </DocText>
        <DocText>
          Un caso común es la página de inicio, donde conviven contenedores informativos y de acción dentro de un mismo
          entorno o incluso dentro de un mismo contenedor.
        </DocText>
        <DocText>
          Los contenedores cuentan con <strong>valores de espaciado como padding y gap</strong>, que permiten una correcta
          agrupación de contenidos y una jerarquía clara de la información.
        </DocText>
        <DocFigure caption="Contenedor madre y tres niveles de hijos anidados. El padding de cada nivel es el valor real de su token (56, 40, 24 y 24 px).">
          <div className="flex flex-col gap-ds-space-general-4xl tablet:flex-row tablet:items-center">
            <div className="flex-1">
              <NestedContainers />
            </div>
            <ol className="m-0 flex list-none flex-col gap-ds-space-general-lg p-0 text-ds-primitives-typography-size-md text-ds-text-neutral-heading">
              {LEVELS.map((l) => (
                <li key={l.name} className="flex items-center gap-ds-space-general-lg">
                  <span aria-hidden="true" className={cn('size-4 shrink-0 border border-ds-border-general-gray-fifth', l.className)} />
                  {l.name} <span className="text-ds-text-neutral-gray">· {px(SPACE_PREFIX + l.pad)} px</span>
                </li>
              ))}
            </ol>
          </div>
        </DocFigure>
      </DocSection>

      <DocSection title="Padding" id="contenedores-padding">
        <DocText>
          Los valores de padding <strong>se definen bajo la regla de ocho (8)</strong>.
        </DocText>
        <DocText>
          Esto significa que las medidas se establecen en múltiplos de ocho, como 16 px, 24 px o 32 px. Esta regla
          garantiza <strong>consistencia visual entre elementos</strong> y fortalece la usabilidad del sistema.
        </DocText>
        <DocFigure caption="El padding (franja resaltada) separa el contenido del borde del contenedor: 40 px arriba, abajo y a los lados.">
          <PaddingSpecimen />
        </DocFigure>
      </DocSection>

      <DocSection title="Gap" id="contenedores-gap">
        <DocText>
          Al igual que el padding, los valores de gap <strong>se definen bajo la regla de ocho (8)</strong>. Sin embargo,{' '}
          <strong>existen excepciones en las que se utilizan valores de 2 px y 4 px</strong>, especialmente en botones o
          componentes que integran iconografía y requieren menor separación entre elementos.
        </DocText>
        <DocFigure caption="Los gaps (franjas resaltadas) agrupan por proximidad: 16 px entre nombre y cargo, 40 px entre bloques, 24 px dentro del bloque.">
          <GapSpecimen />
        </DocFigure>
      </DocSection>

      <DocSection title="Gráfica de equivalencias" id="contenedores-equivalencias">
        <DocText>La gráfica muestra la escala de valores de padding y gap definidos en el sistema de diseño.</DocText>
        <DocFigure caption="Escala primitiva de tokens.css; cada barra mide lo que vale el token.">
          <ul className="m-0 grid list-none grid-cols-1 gap-x-ds-space-general-6xl gap-y-ds-space-general-lg p-0 tablet:grid-flow-col tablet:grid-cols-2 tablet:grid-rows-9">
            {scale.map((s) => (
              <li key={s.key} className="flex items-center gap-ds-space-general-xl text-ds-primitives-typography-size-md text-ds-text-neutral-heading">
                <span className="w-14 shrink-0 text-right tabular-nums">{s.value} px</span>
                <span aria-hidden="true" className="h-4 rounded-sm bg-ds-background-semantic-information-fourth" style={{ width: `${Math.max((s.value / max) * 60, 0.4)}%`, minWidth: s.value ? 2 : 0 }} />
              </li>
            ))}
          </ul>
        </DocFigure>
      </DocSection>
    </>
  );
}

/** Formulario con padding de 40 px resaltado */
function PaddingSpecimen() {
  return (
    <Scroll name="Esquema de padding" minWidth={420}>
      <div className="mx-auto max-w-[640px] overflow-hidden rounded-ds-radius-container-on-canva border border-ds-border-general-gray-fifth">
        <Spacer size={sp('6xl')} label="40 px" className={PAD} />
        <div className="flex">
          <Spacer horizontal size={sp('6xl')} label="40" className={PAD} />
          <div className="flex min-w-0 flex-1 flex-col gap-ds-space-general-2xl bg-ds-background-container-surface p-ds-space-general-2xl">
            <div className="flex items-center justify-between text-ds-primitives-typography-size-md text-ds-text-neutral-heading">
              <span className="font-semibold">Servicios Premium</span>
              <span className="rounded-full bg-ds-background-tab-select-on-canva px-ds-space-general-lg py-ds-space-general-sm text-ds-primitives-typography-size-sm">Envío rápido</span>
            </div>
            <span className="text-ds-primitives-typography-size-2xl font-semibold text-ds-text-neutral-heading">¿Dónde recogemos tu envío?</span>
            <div className="grid grid-cols-2 gap-ds-space-general-2xl">
              {['Nombres', 'Apellidos', 'Correo electrónico', 'Celular'].map((f) => (
                <span key={f} className="rounded-ds-radius-general-md border border-ds-border-general-gray-fifth px-ds-space-general-2xl py-ds-space-general-xl text-ds-primitives-typography-size-sm text-ds-text-neutral-body">
                  {f}
                </span>
              ))}
            </div>
            <div className="flex justify-end gap-ds-space-general-lg text-ds-primitives-typography-size-sm">
              <span className="rounded-full border border-ds-border-general-gray-fifth px-ds-space-general-4xl py-ds-space-general-lg text-ds-text-neutral-heading">Anterior</span>
              <span className="rounded-full bg-ds-text-neutral-heading px-ds-space-general-4xl py-ds-space-general-lg text-ds-background-container-surface">Siguiente</span>
            </div>
          </div>
          <Spacer horizontal size={sp('6xl')} label="40" className={PAD} />
        </div>
        <Spacer size={sp('6xl')} label="40 px" className={PAD} />
      </div>
    </Scroll>
  );
}

/** Tarjeta de perfil con gaps señalados */
function GapSpecimen() {
  const box = 'bg-ds-background-container-surface p-ds-space-general-2xl text-ds-primitives-typography-size-md text-ds-text-neutral-body';
  return (
    <Scroll name="Esquema de gap" minWidth={360}>
      <div className="mx-auto flex max-w-[480px] flex-col overflow-hidden rounded-ds-radius-container-on-canva border border-ds-border-general-gray-fifth">
        <div className={cn(box, 'flex items-center')}>
          <span aria-hidden="true" className="size-12 shrink-0 rounded-ds-radius-general-sm bg-ds-background-general-gray-secondary" />
          <Spacer horizontal size={sp('2xl')} label="" className={GAP} />
          <span className="flex flex-col">
            <span className="text-ds-primitives-typography-size-xl font-semibold text-ds-text-neutral-heading">Laura Sánchez</span>
            Coordinadora de bodega
          </span>
        </div>
        <Spacer size={sp('6xl')} label="40 px" className={GAP} />
        <div className={cn(box, 'flex flex-col')}>
          <span className="text-ds-primitives-typography-size-xl font-semibold text-ds-text-neutral-heading">Descripción del cargo</span>
          Responsable de gestión de inventarios y supervisión de equipos.
        </div>
        <Spacer size={sp('4xl')} label="24 px" className={GAP} />
        <div className={cn(box, 'flex justify-around')}>
          <span>Experiencia: 2 años</span>
          <span>Calificación: 4.5</span>
        </div>
        <Spacer size={sp('6xl')} label="40 px" className={GAP} />
        <div className={cn(box, 'flex gap-ds-space-general-lg')}>
          <span className="rounded-full border border-ds-border-general-gray-fifth px-ds-space-general-4xl py-ds-space-general-lg text-ds-text-neutral-heading">Ver más información</span>
          <span className="rounded-full bg-ds-text-neutral-heading px-ds-space-general-4xl py-ds-space-general-lg text-ds-background-container-surface">Aceptar</span>
        </div>
      </div>
    </Scroll>
  );
}

function ValoresDeToken(): ReactNode {
  const scale = readPrimitiveSpaces();
  const general = readGeneralSpaces();
  const containerVars = ['--ds-responsive-space-container-on-canva', '--ds-responsive-space-container-on-card'];
  const bpCells = (name: string) => BREAKPOINTS.map((bp) => `${px(name, bp)} px`);
  return (
    <>
      <DocSection title="Valores de token">
        <DocText>
          Los valores de padding y gap <strong>se definen en un rango de 4 px a 80 px</strong>. Estos valores garantizan
          consistencia en rellenos internos, espaciado entre elementos y márgenes de página.
        </DocText>

        <DocSubsection title="Escala de espacios">
          <DocText>Escala primitiva leída de tokens.css; la barra muestra el tamaño real de cada espacio.</DocText>
          <TokenTable
            caption="Escala de espacios primitivos"
            minWidth={520}
            columns={['Token', 'Valor', 'Espécimen']}
            rows={scale.map((s) => [
              <TokenChip key="t">{s.variable.replace('--', '')}</TokenChip>,
              `${s.value} px`,
              <span key="b" aria-hidden="true" className="block h-4 rounded-sm bg-ds-background-semantic-information-fourth" style={{ width: s.value, minWidth: s.value ? 1 : 0, maxWidth: '100%' }} />,
            ])}
          />
        </DocSubsection>

        <DocSubsection title="Espacios por breakpoint">
          <DocText>Los espacios responsivos toman un valor distinto según el breakpoint (móvil, tablet y escritorio).</DocText>
          <TokenTable
            caption="Espacios responsivos por breakpoint"
            minWidth={620}
            columns={['Token', ...BREAKPOINTS.map((b) => BREAKPOINT_LABELS[b])]}
            rows={[...general, ...containerVars].map((v) => [<TokenChip key="t">{v.replace('--ds-responsive-', '')}</TokenChip>, ...bpCells(v)])}
          />
        </DocSubsection>
      </DocSection>

      <DocSection title="Usos del espacio">
        <DocText>
          Las medidas de espacio se clasifican en tres niveles: <strong>pequeño, mediano y grande</strong>.
        </DocText>
        <DocSubsection title="Espaciado pequeño (4 px - 8 px)">
          <DocText>Aplica a componentes con relación icono–texto o texto–párrafo dentro de áreas reducidas, como:</DocText>
          <DocList
            items={[
              'Botones.',
              'Controles de selección (Checkbox, Radio Button, Switch, Segmented Control).',
              'Inputs de selección (Dropdown, Combobox, Date Picker).',
              'Indicadores (Tag, Badge).',
              'Filtros (Chips).',
              'Navegación dinámica (Breadcrumbs, Stepper).',
            ]}
          />
        </DocSubsection>
        <DocSubsection title="Espaciado mediano (16 px - 40 px)">
          <DocText>
            Se utiliza para agrupar componentes o secciones de contenido, como <strong>tarjetas, modales o listas</strong>.
          </DocText>
        </DocSubsection>
        <DocSubsection title="Espaciado grande (64 px - 80 px)">
          <DocText>
            Se usa para generar separación amplia entre contenedores de mayor jerarquía, como las <strong>secciones de una página</strong>.
          </DocText>
        </DocSubsection>
        <DocSubsection title="Espaciado de margen para páginas">
          <DocText>Las márgenes de página se definen según los niveles establecidos en la retícula del sistema de diseño.</DocText>
        </DocSubsection>
      </DocSection>
    </>
  );
}

/** Modal de confirmación: agrupa por proximidad (correcto) o separa todo por igual (incorrecto) */
function ModalMock({ good }: { good: boolean }) {
  return (
    <div className={cn('mx-auto flex max-w-[320px] flex-col items-center rounded-ds-radius-general-xl bg-ds-background-container-surface p-ds-space-general-4xl text-center', good ? 'gap-ds-space-general-lg' : 'gap-ds-space-general-4xl')}>
      <span aria-hidden="true" className="size-10 rounded-full border-2 border-ds-text-neutral-heading" />
      <span className="text-ds-primitives-typography-size-xl font-semibold text-ds-text-neutral-heading">Cédula inscrita exitosamente</span>
      <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-body">El campo de cédula se ha actualizado correctamente dentro de tu perfil.</span>
      <span className={cn('w-full rounded-ds-radius-general-md bg-ds-text-neutral-heading py-ds-space-general-xl text-ds-primitives-typography-size-sm text-ds-background-container-surface', good && 'mt-ds-space-general-4xl')}>Aceptar</span>
    </div>
  );
}

/** Tarjeta de perfil: contenidos alineados a la izquierda (correcto) o sin alineación común (incorrecto) */
function ProfileMock({ good }: { good: boolean }) {
  return (
    <div className="mx-auto flex max-w-[340px] flex-col gap-ds-space-general-4xl rounded-ds-radius-general-xl bg-ds-background-container-surface p-ds-space-general-4xl text-ds-primitives-typography-size-sm text-ds-text-neutral-body">
      <div className={cn('flex items-center gap-ds-space-general-lg', !good && 'justify-end')}>
        <span aria-hidden="true" className="size-10 shrink-0 rounded-ds-radius-general-sm bg-ds-background-general-gray-secondary" />
        <span className="flex flex-col text-ds-text-neutral-heading">
          <span className="text-ds-primitives-typography-size-lg font-semibold">Laura Sánchez</span>
          <span className="text-ds-text-neutral-body">Coordinadora de bodega</span>
        </span>
      </div>
      <div className={cn('flex flex-col gap-ds-space-general-md', !good && 'items-center text-center')}>
        <span className="text-ds-primitives-typography-size-xl font-semibold text-ds-text-neutral-heading">Descripción del cargo</span>
        Responsable de gestión de inventarios y supervisión de equipos.
      </div>
      <div className={cn('flex gap-ds-space-general-4xl', good ? 'justify-start' : 'justify-around')}>
        <span className="flex flex-col"><span className="text-ds-text-neutral-heading">Experiencia</span>2 años</span>
        <span className="flex flex-col"><span className="text-ds-text-neutral-heading">Calificación</span>4.5</span>
      </div>
    </div>
  );
}

/** Tarjeta de evento: con Auto Layout (columna con gaps de tokens) o con elementos separados a mano */
function EventMock({ good }: { good: boolean }) {
  const title = <span className="text-ds-primitives-typography-size-xl font-semibold text-ds-text-neutral-heading">Reconocimiento a nuestro equipo</span>;
  const body = <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-body">En nuestro aniversario, queremos reconocer la labor incansable de cada miembro de nuestro equipo.</span>;
  const meta = (
    <>
      <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-body">Octubre 27, 2026</span>
      <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-body">Villavicencio, Meta.</span>
    </>
  );
  const button = <span className="block rounded-ds-radius-general-md bg-ds-text-neutral-heading py-ds-space-general-xl text-center text-ds-primitives-typography-size-sm text-ds-background-container-surface">Ver evento</span>;
  return (
    <div className="mx-auto max-w-[340px] overflow-hidden rounded-ds-radius-general-xl bg-ds-background-container-surface">
      <div className="h-24 bg-ds-background-graphic-neutral-secondary-opacity" />
      {good ? (
        <div className="flex flex-col gap-ds-space-general-2xl p-ds-space-general-4xl">
          <div className="flex flex-col gap-ds-space-general-lg">{title}{body}</div>
          <div className="flex flex-col gap-ds-space-general-md">{meta}</div>
          {button}
        </div>
      ) : (
        <div className="p-ds-space-general-4xl">
          <div className="mb-[7px]">{title}</div>
          <div className="mb-[22px] ml-[5px]">{body}</div>
          <div className="mb-[13px] ml-[14px] flex flex-col">{meta}</div>
          <div className="mt-[31px]">{button}</div>
        </div>
      )}
    </div>
  );
}

function Aplicacion(): ReactNode {
  return (
    <DocSection title="Usos correctos e incorrectos">
      <DocText>A continuación, se presentan ejemplos de buenas y malas prácticas en la aplicación de parámetros de espacio.</DocText>

      <DocSubsection title="Jerarquía de información">
        <DocText>La agrupación de contenidos mediante reglas de espaciado es fundamental para garantizar consistencia y adaptabilidad en el tiempo.</DocText>
        <DoDontGrid>
          <DoDont variant="do" description={<span>El contenedor presenta equilibrio visual. <strong>El título y el cuerpo se agrupan por proximidad</strong>, mientras que el botón, como acción principal, se jerarquiza mediante un mayor espaciado superior.</span>}>
            <ModalMock good />
          </DoDont>
          <DoDont variant="dont" description={<span>No existe una agrupación clara. <strong>Todos los elementos del modal tienen el mismo nivel de espaciado</strong>, lo que genera pérdida de jerarquía.</span>}>
            <ModalMock good={false} />
          </DoDont>
        </DoDontGrid>
      </DocSubsection>

      <DocSubsection title="Alineación de elementos">
        <DocText>Los contenidos que pertenecen al mismo grupo deben estar alineados correctamente. Esto garantiza integración visual y guía al usuario de forma clara dentro de la interfaz.</DocText>
        <DoDontGrid>
          <DoDont variant="do" description={<span>Los elementos están alineados a la izquierda del contenedor, lo que <strong>facilita la lectura y mantiene coherencia visual</strong>.</span>}>
            <ProfileMock good />
          </DoDont>
          <DoDont variant="dont" description={<span>Los grupos de información no mantienen una alineación uniforme, lo que <strong>genera desequilibrio visual y rompe la jerarquía</strong>.</span>}>
            <ProfileMock good={false} />
          </DoDont>
        </DoDontGrid>
      </DocSubsection>

      <DocSubsection title="Aplicación del Auto Layout">
        <DocText>Todos los elementos que componen la interfaz deben integrar Auto Layout. Esto <strong>garantiza consistencia visual y optimiza la adaptación del contenido</strong> a diferentes tamaños de pantalla.</DocText>
        <DoDontGrid>
          <DoDont variant="do" description="El componente conserva alineación y jerarquía en diferentes resoluciones.">
            <EventMock good />
          </DoDont>
          <DoDont variant="dont" description="Sin Auto Layout se pierde precisión en el espaciado y coherencia entre componentes equivalentes.">
            <EventMock good={false} />
          </DoDont>
        </DoDontGrid>
      </DocSubsection>
    </DocSection>
  );
}

/**
 * Página "Contenedores y espacios" de Fundamentos de diseño.
 * `initialTab` permite abrirla directamente en una pestaña (una historia por pestaña).
 */
export function ContenedoresYEspacios({ initialTab = 'definicion' }: { initialTab?: ContenedoresYEspaciosTab }) {
  return (
    <FoundationPage
      iconSvg={iconSvg}
      title="Contenedores y espacios"
      subtitle="Fundamentos y lineamientos para la aplicación de contenedores y espacios en los productos digitales de CAOS."
      initialTab={initialTab}
      tabs={[
        { id: 'definicion', label: 'Definición', content: <Definicion /> },
        { id: 'valores-de-token', label: 'Valores de token', content: <ValoresDeToken /> },
        { id: 'aplicacion', label: 'Aplicación', content: <Aplicacion /> },
      ]}
    />
  );
}
