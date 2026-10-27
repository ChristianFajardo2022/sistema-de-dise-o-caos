import type { ReactNode } from 'react';
import {
  DoDont,
  DoDontGrid,
  DocFigure,
  DocHeading,
  DocList,
  DocNote,
  DocSection,
  DocSubsection,
  DocText,
  FoundationPage,
  TokenChip,
  TokenTable,
  resolveToken,
} from '../_doc';
import iconSvg from '../../../icons/caos/line/star.svg?raw';
import { Icon } from '../../components/Icon';
import type { IconName, IconSize } from '../../components/Icon/Icon.types';
import { cn } from '../../utils/cn';
import { CatalogoIconos } from './Catalogo';
import selCorrecto from './assets/accionables-desplegable-correcto.png';
import selIncorrecto from './assets/accionables-desplegable-incorrecto.png';
import calCorrecto from './assets/accionables-calendario-correcto.png';
import calIncorrecto from './assets/accionables-calendario-incorrecto.png';
import tipCorrecto from './assets/accionables-tooltip-correcto.png';
import tipIncorrecto from './assets/accionables-tooltip-incorrecto.png';
import acoCorrecto from './assets/accionables-acordeon-correcto.png';
import acoIncorrecto from './assets/accionables-acordeon-incorrecto.png';
import stepCorrecto from './assets/relleno-stepper-correcto.png';
import stepIncorrecto from './assets/relleno-stepper-incorrecto.png';
import dlgCorrecto from './assets/informativos-dialogo-confirmacion-correcto.png';
import dlgIncorrecto from './assets/informativos-dialogo-confirmacion-incorrecto.png';
import adjCorrecto from './assets/informativos-dialogo-adjuntar-correcto.png';
import adjIncorrecto from './assets/informativos-dialogo-adjuntar-incorrecto.png';
import alertCorrecto from './assets/informativos-alerta-correcto.png';
import alertIncorrecto from './assets/informativos-alerta-incorrecto.png';
import banCorrecto from './assets/informativos-banner-correcto.png';
import banIncorrecto from './assets/informativos-banner-incorrecto.png';

export type IconografiaTab = 'definicion' | 'valores' | 'catalogo';

/** Par de figuras de Figma (ya traen su insignia de correcto / incorrecto): izquierda correcta, derecha incorrecta */
function Pair({
  good,
  bad,
  goodAlt,
  badAlt,
  caption,
}: {
  good: string;
  bad: string;
  goodAlt: string;
  badAlt: string;
  caption: ReactNode;
}) {
  return (
    <figure className="m-0 flex flex-col gap-ds-space-general-lg">
      <div className="grid grid-cols-1 gap-ds-space-general-2xl tablet:grid-cols-2">
        <DocFigure image={good} alt={goodAlt} />
        <DocFigure image={bad} alt={badAlt} />
      </div>
      <figcaption className="text-ds-primitives-typography-size-md leading-normal text-ds-text-neutral-body">{caption}</figcaption>
    </figure>
  );
}

/** Tres tarjetas inclinadas con íconos reales (ilustración de apertura de cada familia) */
function IconTrio({ names, variant }: { names: [IconName, IconName, IconName]; variant: 'line' | 'fill' }) {
  const tilt = ['-rotate-6', '-translate-y-ds-space-general-lg', 'rotate-6'];
  return (
    <div className="flex items-center justify-center py-ds-space-general-4xl" aria-hidden="true">
      {names.map((n, i) => (
        <span
          key={n}
          className={cn(
            'mx-ds-space-general-md flex size-20 items-center justify-center rounded-ds-radius-container-on-canva border border-ds-border-general-default-on-card bg-ds-background-container-default-on-card text-ds-text-neutral-heading shadow-ds-on-card',
            tilt[i],
          )}
        >
          <Icon name={n} size={32} variant={variant} />
        </span>
      ))}
    </div>
  );
}

/**
 * Barra de navegación de ejemplo para los pares correcto / incorrecto de los íconos de menú.
 * Los colores son primitivos fijos (no cambian con el tema) para que el ejemplo se lea igual en oscuro y en claro.
 * `thin` simula el trazo Light line (la biblioteca solo publica línea y relleno): un contorno del color de la barra
 * adelgaza el dibujo de 2 px a 1.2 px. `activeFill` pinta la opción activa con ícono relleno sobre fondo resaltado.
 */
function NavBarMock({ thin = false, activeFill = false, activeLine = false }: { thin?: boolean; activeFill?: boolean; activeLine?: boolean }) {
  const items: { name: IconName }[] = [{ name: 'home1' }, { name: 'user' }, { name: 'shopping-cart' }];
  return (
    <div
      role="img"
      aria-label="Barra de navegación de ejemplo con los íconos de inicio, perfil y carrito"
      className="rounded-ds-radius-general-xl bg-ds-primitives-color-primary-g13 p-ds-space-general-4xl"
    >
      <div className="flex items-center justify-between gap-ds-space-general-4xl rounded-ds-radius-general-xl bg-ds-primitives-color-primary-b01 px-ds-space-general-2xl py-ds-space-general-lg">
        <span aria-hidden="true" className="h-6 w-16 rounded-ds-radius-general-md bg-ds-primitives-color-primary-g06" />
        <div aria-hidden="true" className="flex items-center gap-ds-space-general-md text-ds-primitives-color-primary-g13">
          {items.map((it, i) => {
            const active = (activeFill || activeLine) && i === 0;
            return (
              <span
                key={it.name}
                className={cn(
                  'flex size-12 items-center justify-center rounded-ds-radius-general-xl',
                  active && 'bg-ds-primitives-color-primary-g04',
                  thin && '[&_path]:stroke-ds-primitives-color-primary-b01 [&_path]:stroke-[0.8]',
                )}
              >
                <Icon name={it.name} size={24} variant={active && activeFill ? 'fill' : 'line'} />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Definicion(): ReactNode {
  return (
    <>
      <DocSection title="Iconografía">
        <DocText>
          La iconografía implementada en los diferentes productos digitales de CAOS cuenta con tres variantes principales:{' '}
          <strong>Bold line icon, Fill icon y Light line icon</strong>, las cuales pueden pertenecer a la categoría de{' '}
          <strong>íconos accionables, íconos informativos o íconos de marca</strong>.
        </DocText>
        <DocText>
          A continuación conocerás todos los lineamientos de aplicación y uso de la iconografía: sus casos de uso, tamaños
          permitidos, zonas de seguridad y aplicaciones de color.
        </DocText>
        <DocFigure caption="La biblioteca publica cada ícono en dos dibujos: línea (line) y relleno (fill).">
          <div className="flex flex-wrap items-end justify-center gap-ds-space-general-4xl text-ds-text-neutral-heading">
            {([
              ['line', 'Línea (line)'],
              ['fill', 'Relleno (fill)'],
            ] as const).map(([variant, label]) => (
              <div key={variant} className="flex flex-col items-center gap-ds-space-general-lg">
                <Icon name="heart" size={56} variant={variant} />
                <span className="text-ds-primitives-typography-size-md text-ds-text-neutral-body">{label}</span>
              </div>
            ))}
          </div>
        </DocFigure>
        <DocNote>
          La variante Light line aún no tiene un dibujo propio en la biblioteca: el componente usa relleno por debajo de 24
          px y línea desde 24 px, y se puede forzar con la propiedad <code>variant</code>.
        </DocNote>
      </DocSection>

      <DocSection title="Íconos accionables">
        <IconTrio names={['homepage', 'shopping-cart', 'box']} variant="fill" />
        <DocText>
          Los íconos accionables son todos aquellos que permiten al usuario realizar una acción específica dentro de la
          interfaz, por lo tanto cuentan con una <strong>zona tapeable</strong>, como es el ícono de descarga. Según sea su
          caso, se recurrirá a los siguientes tamaños establecidos: <strong>12 px, 16 px, 24 px y 32 px</strong>. Consulta los
          tamaños establecidos en la pestaña Valores.
        </DocText>

        <DocSubsection title="Bold line icon">
          <DocText>
            Usamos <strong>Bold line icon</strong> en los siguientes casos específicos:
          </DocText>
          <DocList
            items={[
              'Menú (Menu).',
              'Botón (Button).',
              'Flechas (Arrow).',
              'Caja de texto (Input box).',
              'Desplegable (Dropdown).',
              'Consejo emergente (Tooltip).',
              'Acordeón (Accordion).',
            ]}
          />
          <DoDontGrid>
            <DoDont variant="do" description="Barra de navegación: los íconos usan Bold line (trazo de 2 px).">
              <NavBarMock />
            </DoDont>
            <DoDont variant="dont" description="Los mismos íconos en trazo Light line (1.2 px): demasiado delgado para un ícono accionable.">
              <NavBarMock thin />
            </DoDont>
          </DoDontGrid>
          <Pair
            good={selCorrecto}
            bad={selIncorrecto}
            goodAlt="Correcto: campo desplegable «Tipo de envío» con una flecha hacia abajo en trazo Bold line."
            badAlt="Incorrecto: el mismo campo desplegable con la flecha en trazo Light line."
            caption="Desplegable con flecha."
          />
          <Pair
            good={calCorrecto}
            bad={calIncorrecto}
            goodAlt="Correcto: campo «Calendario» con formato DD/MM/AAAA y un ícono de calendario en trazo Bold line."
            badAlt="Incorrecto: el mismo campo de calendario con el ícono en trazo Light line."
            caption="Caja de texto con ícono de calendario."
          />
          <Pair
            good={tipCorrecto}
            bad={tipIncorrecto}
            goodAlt="Correcto: campo «Dirección de entrega» con un ícono de información en trazo Bold line junto al título."
            badAlt="Incorrecto: el mismo campo con el ícono de información en trazo Light line."
            caption="Consejo emergente (Tooltip) junto al título de un campo."
          />
          <Pair
            good={acoCorrecto}
            bad={acoIncorrecto}
            goodAlt="Correcto: dos filas de acordeón tituladas «Título», cada una con un ícono de más en trazo Bold line."
            badAlt="Incorrecto: las mismas filas de acordeón con el ícono de más en trazo Light line."
            caption="Acordeón."
          />
        </DocSubsection>

        <DocSubsection title="Fill icon">
          <DocText>
            Dentro de los íconos accionables encontramos los <strong>Fill icon</strong>: son visibles cuando se activa un
            ícono o botón, como es el caso de un menú o un motor paso a paso (Input Stepper). Según sea su caso, se
            recurrirá a los siguientes tamaños establecidos: <strong>16 px, 24 px y 32 px</strong>.
          </DocText>
          <DocText>
            Usamos <strong>Fill icon</strong> en los siguientes casos específicos:
          </DocText>
          <DocList items={['Botón (Me gusta y calificación).', 'Motor paso a paso de entrada (Input Stepper).']} />
          <DoDontGrid>
            <DoDont variant="do" description="Opción activa de un menú: el ícono pasa a relleno (Fill icon) sobre un fondo resaltado.">
              <NavBarMock activeFill />
            </DoDont>
            <DoDont variant="dont" description="La opción activa solo cambia de fondo y mantiene el ícono de línea.">
              <NavBarMock activeLine />
            </DoDont>
          </DoDontGrid>
          <Pair
            good={stepCorrecto}
            bad={stepIncorrecto}
            goodAlt="Correcto: motor paso a paso de tres pasos donde el paso completado muestra un ícono de verificación relleno."
            badAlt="Incorrecto: el mismo motor paso a paso con el paso completado en ícono de verificación de línea."
            caption="Motor paso a paso de entrada (Input Stepper)."
          />
        </DocSubsection>
      </DocSection>

      <DocSection title="Íconos informativos">
        <IconTrio names={['cloud', 'tick-circle', 'user']} variant="line" />
        <DocText>
          Los íconos informativos son todos aquellos que apoyan mensajes del sistema y que <strong>no</strong> cuentan con una
          zona tapeable, pero sí con un margen de seguridad, como son los íconos de advertencias. Según sea su caso, se
          recurrirá a los siguientes tamaños establecidos: <strong>48 px, 40 px, 32 px, 24 px y 16 px</strong>.
        </DocText>

        <DocSubsection title="Light line icon">
          <DocText>
            Usamos <strong>Light line icon</strong> en los siguientes casos específicos:
          </DocText>
          <DocList items={['Ventana de diálogo (Dialog).', 'Ventana emergente (Popup).', 'Tostadas (Snack bar).']} />
          <Pair
            good={dlgCorrecto}
            bad={dlgIncorrecto}
            goodAlt="Correcto: ventana de diálogo con un ícono de verificación grande en trazo Light line, un título, un texto y dos botones."
            badAlt="Incorrecto: la misma ventana con el ícono de verificación en trazo Bold line, demasiado pesado para su tamaño."
            caption="Ventana de diálogo."
          />
          <Pair
            good={adjCorrecto}
            bad={adjIncorrecto}
            goodAlt="Correcto: ventana emergente con un ícono de nube en trazo Light line, una zona para adjuntar archivo y dos botones."
            badAlt="Incorrecto: la misma ventana emergente con el ícono de nube en trazo Bold line."
            caption="Ventana emergente (Popup)."
          />
        </DocSubsection>

        <DocSubsection title="Bold line icon">
          <DocText>
            Usamos <strong>Bold line icon</strong> en los siguientes casos específicos:
          </DocText>
          <DocList items={['Toast.', 'Snack bar.', 'Alert.', 'Banner informativo (Banner).']} />
          <Pair
            good={alertCorrecto}
            bad={alertIncorrecto}
            goodAlt="Correcto: alerta amarilla con un ícono de advertencia en trazo Bold line, un mensaje y la acción «Deshacer»."
            badAlt="Incorrecto: la misma alerta con el ícono de advertencia en trazo Light line."
            caption="Alerta con acción."
          />
          <Pair
            good={banCorrecto}
            bad={banIncorrecto}
            goodAlt="Correcto: banner verde «Contraseña correcta» con un ícono de verificación en trazo Bold line."
            badAlt="Incorrecto: el mismo banner con el ícono de verificación más pequeño y en trazo Light line."
            caption="Banner informativo."
          />
        </DocSubsection>
      </DocSection>
    </>
  );
}

/** Tamaños de la tabla de Figma (Light 48/40/32, Bold 32/24/20/16/12) y sus casos de uso */
const SIZE_CASES: { title: string; items: string[] }[] = [
  {
    title: 'Caso 48 px light | Escritorio · Caso 40 px light | Móvil',
    items: ['Ventana de diálogo (Dialog).', 'Ventana emergente (Popup).', 'Tostadas (Snack bar).'],
  },
  {
    title: 'Caso 24 px bold | Escritorio y móvil',
    items: [
      'Menú (Menu).',
      'Flechas (Arrow).',
      'Motor paso a paso de entrada (Input Stepper).',
      'Tostadas (Snack bar).',
      'Acordeón (Accordion).',
      'Caja de texto (Input box).',
    ],
  },
  {
    title: 'Caso 16 px bold | Escritorio · Caso 12 px bold | Móvil',
    items: [
      'Tostadas (Snack bar).',
      'Banner informativo (Banner).',
      'Botón (Button).',
      'Desplegable (Dropdown).',
      'Consejo emergente (Tooltip).',
    ],
  },
];

const SIZE_STRIP: { size: IconSize; kind: string }[] = [
  { size: 48, kind: 'Light' },
  { size: 40, kind: 'Light' },
  { size: 32, kind: 'Light y Bold' },
  { size: 24, kind: 'Bold' },
  { size: 20, kind: 'Bold' },
  { size: 16, kind: 'Bold' },
  { size: 12, kind: 'Bold' },
];

/** Margen en px entre el contenedor y el ícono, por tamaño de ícono (valores de Figma) */
const SAFETY_LIGHT = [
  { icon: 48, margin: 24 },
  { icon: 40, margin: 16 },
  { icon: 32, margin: 16 },
];
const SAFETY_BOLD = [
  { icon: 32, margin: 16 },
  { icon: 24, margin: 16 },
  { icon: 20, margin: 8 },
  { icon: 16, margin: 8 },
  { icon: 12, margin: 8 },
];

/** Zonas tapeables: contenedor y los tamaños de ícono que admite. El margen sale de (zona − ícono) / 2 */
const TAP_ZONES: { zone: number; icons: number[] }[] = [
  { zone: 24, icons: [16] },
  { zone: 32, icons: [20, 16] },
  { zone: 40, icons: [24] },
  { zone: 48, icons: [32] },
];

/** Ícono dentro de su contenedor: la franja tintada es el margen y el recuadro punteado el límite exterior */
function GeometryBox({ icon, container, name }: { icon: number; container: number; name: IconName }) {
  return (
    <div className="flex flex-col items-center gap-ds-space-general-md">
      <div
        className="flex items-center justify-center rounded-ds-radius-general-md border border-dashed border-ds-border-general-gray-secondary bg-ds-background-tab-select-on-canva text-ds-text-neutral-heading"
        style={{ width: container, height: container }}
      >
        <Icon name={name} size={icon as IconSize} />
      </div>
      <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-body whitespace-nowrap">
        Ícono {icon} px
      </span>
    </div>
  );
}

function SafetyRow({ label, rows, name }: { label: string; rows: { icon: number; margin: number }[]; name: IconName }) {
  return (
    <div className="flex flex-col gap-ds-space-general-lg">
      <DocHeading size="sm">
        {label}
      </DocHeading>
      <ul className="m-0 flex list-none flex-wrap items-end gap-ds-space-general-4xl p-0">
        {rows.map((r) => (
          <li key={r.icon} className="flex flex-col items-center gap-ds-space-general-md">
            <GeometryBox icon={r.icon} container={r.icon + 2 * r.margin} name={name} />
            <span className="text-ds-primitives-typography-size-sm whitespace-nowrap text-ds-text-neutral-gray">Margen {r.margin} px</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Estilos de color de la página de Figma: token de ícono y nombre del estilo */
const COLOR_TOKENS: { style: string; token: string }[] = [
  { style: 'Monocromático · negro', token: '--color-ds-icon-general-black-unicolor' },
  { style: 'Monocromático · blanco', token: '--color-ds-icon-general-default-unicolor' },
  { style: 'Cromático · acento', token: '--color-ds-icon-acent-firts' },
  { style: 'Semántico · correcto', token: '--color-ds-icon-semantic-success-firts' },
  { style: 'Semántico · error', token: '--color-ds-icon-semantic-error-firts' },
  { style: 'Semántico · alerta', token: '--color-ds-icon-semantic-alert-firts' },
  { style: 'Semántico · información', token: '--color-ds-icon-semantic-information-firts' },
];

/** Muestra un color resuelto de tokens.css para un tema */
function Swatch({ token, theme }: { token: string; theme: 'dark' | 'light' }) {
  const value = resolveToken(token, theme) ?? '—';
  return (
    <span className="inline-flex items-center gap-ds-space-general-lg whitespace-nowrap">
      <span
        aria-hidden="true"
        className="size-5 rounded-full border border-ds-border-general-gray-secondary"
        style={{ background: value.startsWith('#') ? value : undefined }}
      />
      {value}
    </span>
  );
}

/**
 * Tarjeta de una regla de color: ícono sobre un fondo de prueba.
 * Fondo e ícono son primitivos fijos (no cambian con el tema): el ejemplo ilustra la regla igual en oscuro y en claro.
 */
function ColorSpecimen({ bg, icon, name = 'airplane' }: { bg: string; icon: string; name?: IconName }) {
  return (
    <div className={cn('flex h-28 items-center justify-center rounded-ds-radius-general-xl border border-ds-border-general-default-on-card', bg)}>
      <Icon name={name} size={48} variant="line" className={icon} />
    </div>
  );
}

/** Pares de color de las reglas de uso (primitivos de tokens.css) */
const ON_WHITE = 'bg-ds-primitives-color-primary-b01';
const ON_BLACK = 'bg-ds-primitives-color-primary-g13';
const ICON_BLACK = 'text-ds-primitives-color-primary-g13';
const ICON_WHITE = 'text-ds-primitives-color-primary-b01';

function Valores(): ReactNode {
  return (
    <>
      <DocSection title="Valores de línea">
        <DocSubsection title="Bold line icon">
          <DocText>
            El valor de línea a usar en los <strong>íconos de acción</strong> es de <strong>2 px</strong> en un tamaño
            proporcional a <strong>24 px</strong> de alto y ancho. Al vectorizar dentro de estos valores de medida, el
            grosor de línea no cambia entre las diferentes proporciones de tamaño asignadas, lo que da unidad visual a todo
            el kit de íconos.
          </DocText>
        </DocSubsection>
        <DocSubsection title="Light line icon">
          <DocText>
            El valor de línea a usar en los <strong>íconos de acción</strong> es de <strong>1.2 px</strong> en un tamaño
            proporcional a <strong>24 px</strong> de alto y ancho, con la misma regla de unidad visual.
          </DocText>
        </DocSubsection>
        <DocFigure caption="Ícono de la biblioteca a 24 px en sus dos variantes de dibujo.">
          <div className="flex flex-wrap items-end justify-center gap-ds-space-general-4xl text-ds-text-neutral-heading">
            {(['line', 'fill'] as const).map((v) => (
              <div key={v} className="flex flex-col items-center gap-ds-space-general-lg">
                <Icon name="clipboard-text" size={24} variant={v} />
                <span className="text-ds-primitives-typography-size-md text-ds-text-neutral-body">{v === 'line' ? 'line' : 'fill'}</span>
              </div>
            ))}
          </div>
        </DocFigure>
        <DocNote>
          La biblioteca no distingue Bold de Light: las medidas de 2 px y 1.2 px aún no existen como dibujos propios.
        </DocNote>
      </DocSection>

      <DocSection title="Tamaños permitidos">
        <DocText>
          La iconografía, tanto en versión <strong>Light como Bold</strong>, cuenta con cinco niveles de tamaño, desde los
          16 px hasta los 48 px, que se deben aplicar según corresponda a los casos de uso definidos. La versión Bold incluye
          además los 20 px y 12 px.
        </DocText>
        <DocFigure caption="Cada ícono se dibuja con la variante por defecto del componente para su tamaño.">
          <ul className="m-0 flex list-none flex-wrap items-end justify-center gap-ds-space-general-4xl p-0 text-ds-text-neutral-heading">
            {SIZE_STRIP.map((s) => (
              <li key={s.size} className="flex flex-col items-center gap-ds-space-general-md">
                <Icon name="tick-circle" size={s.size} />
                <span className="text-ds-primitives-typography-size-sm text-ds-text-neutral-gray">{s.kind}</span>
                <span className="text-ds-primitives-typography-size-lg text-ds-text-neutral-heading">{s.size} px</span>
              </li>
            ))}
          </ul>
        </DocFigure>
        <div className="flex flex-col gap-ds-space-general-2xl">
          {SIZE_CASES.map((c) => (
            <div
              key={c.title}
              className="flex flex-col gap-ds-space-general-lg rounded-ds-radius-container-on-canva bg-ds-background-container-default-on-card p-ds-space-general-4xl"
            >
              <DocHeading size="sm">
                {c.title}
              </DocHeading>
              <DocList items={c.items} />
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Márgenes de seguridad">
        <DocText>
          Se han establecido tres niveles de margen para los diferentes tipos de íconos, <strong>Light y Bold</strong>. Esto
          permite que la iconografía usada en los diferentes componentes no se vea afectada por otros elementos ajenos a
          ella. El margen de seguridad se debe aplicar tanto en versiones de escritorio como en móvil.
        </DocText>
        <DocFigure caption="La franja tintada es el margen de seguridad alrededor del ícono. Medidas a escala real.">
          <div className="flex flex-col gap-ds-space-general-4xl">
            <SafetyRow label="Light" rows={SAFETY_LIGHT} name="tick-circle" />
            <SafetyRow label="Bold" rows={SAFETY_BOLD} name="homepage" />
          </div>
        </DocFigure>
        <DocNote>Los tamaños y márgenes de íconos aún no existen como tokens en tokens.css.</DocNote>
      </DocSection>

      <DocSection title="Zona tapeable">
        <DocText>
          La zona tapeable se ha definido a través de cuatro niveles, que se aplican a los productos digitales de acuerdo
          con sus casos de uso.
        </DocText>
        <DocFigure caption="La franja tintada es la zona tapeable; el ícono queda centrado. Medidas a escala real.">
          <ul className="m-0 flex list-none flex-col gap-ds-space-general-4xl p-0">
            {TAP_ZONES.map((z) => (
              <li key={z.zone} className="flex flex-col gap-ds-space-general-lg">
                <DocHeading size="sm">
                  {z.zone} px
                </DocHeading>
                <ul className="m-0 flex list-none flex-wrap items-end gap-ds-space-general-4xl p-0">
                  {z.icons.map((i) => (
                    <li key={i} className="flex flex-col items-center gap-ds-space-general-md">
                      <GeometryBox icon={i} container={z.zone} name="homepage" />
                      <span className="text-ds-primitives-typography-size-sm whitespace-nowrap text-ds-text-neutral-gray">
                        Margen {(z.zone - i) / 2} px
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </DocFigure>
      </DocSection>

      <DocSection title="Aplicación de color">
        <DocText>
          Los íconos toman su color de los tokens de ícono, que cambian con el tema. La tabla muestra el valor resuelto de
          cada token en oscuro y en claro.
        </DocText>
        <DocFigure caption="Monocromático: negro y blanco digital sobre fondo fijo. Cromático y semántico: sobre la superficie del tema, con el color que cada tema define.">
          <div className="grid grid-cols-1 gap-ds-space-general-4xl tablet:grid-cols-3">
            <div className="flex flex-col items-center gap-ds-space-general-lg">
              <span className="text-ds-primitives-typography-size-md text-ds-text-neutral-gray">Monocromático</span>
              <div className="flex gap-ds-space-general-lg">
                <span className="flex size-24 items-center justify-center rounded-ds-radius-container-on-canva bg-ds-primitives-color-primary-g13 text-ds-icon-general-default-unicolor">
                  <Icon name="airplane" size={48} variant="line" />
                </span>
                <span className="flex size-24 items-center justify-center rounded-ds-radius-container-on-canva border border-ds-border-general-default-on-card bg-ds-primitives-color-primary-b01 text-ds-icon-general-black-unicolor">
                  <Icon name="airplane" size={48} variant="line" />
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-ds-space-general-lg">
              <span className="text-ds-primitives-typography-size-md text-ds-text-neutral-gray">Cromático</span>
              <span className="flex size-24 items-center justify-center rounded-ds-radius-container-on-canva border border-ds-border-general-default-on-card bg-ds-background-container-surface text-ds-icon-acent-firts">
                <Icon name="airplane" size={48} variant="line" />
              </span>
            </div>
            <div className="flex flex-col items-center gap-ds-space-general-lg">
              <span className="text-ds-primitives-typography-size-md text-ds-text-neutral-gray">Semántico</span>
              <div className="flex gap-ds-space-general-lg">
                {(
                  [
                    ['tick-circle', 'text-ds-icon-semantic-success-firts'],
                    ['close-circle', 'text-ds-icon-semantic-error-firts'],
                    ['warning-2', 'text-ds-icon-semantic-alert-firts'],
                    ['info-circle', 'text-ds-icon-semantic-information-firts'],
                  ] as const
                ).map(([n, c]) => (
                  <span
                    key={n}
                    className={cn(
                      'flex size-14 items-center justify-center rounded-ds-radius-general-xl border border-ds-border-general-default-on-card bg-ds-background-container-surface',
                      c,
                    )}
                  >
                    <Icon name={n} size={32} variant="line" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DocFigure>
        <TokenTable
          caption="Tokens de color de ícono por estilo"
          minWidth={720}
          columns={['Estilo', 'Token', 'Oscuro', 'Claro']}
          rows={COLOR_TOKENS.map((c) => [
            c.style,
            <TokenChip key="t">{c.token.replace('--color-', '')}</TokenChip>,
            <Swatch key="d" token={c.token} theme="dark" />,
            <Swatch key="l" token={c.token} theme="light" />,
          ])}
        />
      </DocSection>

      <DocSection title="Reglas de uso">
        <DocText>
          La iconografía se adapta a la paleta de color de marca según lo requerido; sin embargo, hay lineamientos clave que
          deben ser consistentes en su aplicación dentro de un producto digital. Para ello se implementan tres reglas
          fundamentales.
        </DocText>

        <DocSubsection title="Color sólido">
          <DocText>Todos los íconos deben mantener un color sólido; no se hace uso de degradados ni texturas.</DocText>
          <DoDontGrid>
            <DoDont variant="do" description="El ícono usa un único color sólido.">
              <ColorSpecimen bg={ON_WHITE} icon={ICON_BLACK} />
            </DoDont>
            <DoDont variant="dont" description="El ícono pierde solidez: se ve translúcido, como con degradado o textura.">
              <ColorSpecimen bg={ON_WHITE} icon={cn(ICON_BLACK, 'opacity-40')} />
            </DoDont>
          </DoDontGrid>
        </DocSubsection>

        <DocSubsection title="Ícono positivo">
          <DocText>
            El ícono solo tiene un color de fondo permitido, el negro digital. Hay algunas excepciones, como las tonalidades
            claras de la paleta secundaria y terciaria.
          </DocText>
          <DoDontGrid>
            <DoDont variant="do" description="Sobre negro digital, el ícono va en blanco.">
              <ColorSpecimen bg={ON_BLACK} icon={ICON_WHITE} />
            </DoDont>
            <DoDont variant="dont" description="Sobre un fondo azul saturado no se usa un ícono positivo.">
              <ColorSpecimen bg="bg-ds-primitives-color-secondary-a03" icon={ICON_WHITE} />
            </DoDont>
            <DoDont variant="do" description="Excepción: sobre una tonalidad clara de la paleta, el ícono toma el color semántico.">
              <ColorSpecimen bg="bg-ds-primitives-color-confirmation-v02" icon="text-ds-primitives-color-confirmation-v05" name="tick-circle" />
            </DoDont>
            <DoDont variant="dont" description="Un verde saturado de fondo con ícono blanco no está permitido.">
              <ColorSpecimen bg="bg-ds-primitives-color-confirmation-v04" icon={ICON_WHITE} name="tick-circle" />
            </DoDont>
          </DoDontGrid>
        </DocSubsection>

        <DocSubsection title="Ícono negativo">
          <DocText>
            Cuando el fondo es blanco, la variación principal debe ser negro digital o azul acento; como variaciones
            secundarias, los colores semánticos o el morado (en casos muy específicos).
          </DocText>
          <DoDontGrid>
            <DoDont variant="do" description="Sobre blanco, el ícono va en negro digital.">
              <ColorSpecimen bg={ON_WHITE} icon={ICON_BLACK} />
            </DoDont>
            {/* El rosa fuera de paleta es el ejemplo de lo que no se debe hacer: no hay token para él a propósito */}
            <DoDont variant="dont" description="Un color fuera de la paleta de marca no está permitido.">
              <ColorSpecimen bg={ON_WHITE} icon="text-[#ee44cc]" />
            </DoDont>
            <DoDont variant="do" description="Color semántico oscuro para un estado de éxito.">
              <ColorSpecimen bg={ON_WHITE} icon="text-ds-primitives-color-confirmation-v05" name="tick-circle" />
            </DoDont>
            <DoDont variant="dont" description="Un tono claro del mismo color no tiene contraste suficiente sobre blanco.">
              <ColorSpecimen bg={ON_WHITE} icon="text-ds-primitives-color-confirmation-v03" name="tick-circle" />
            </DoDont>
          </DoDontGrid>
        </DocSubsection>
      </DocSection>
    </>
  );
}

function Catalogo(): ReactNode {
  return (
    <DocSection title="Catálogo de íconos">
      <DocText>
        Todos los íconos de la biblioteca CAOS. Usa el buscador o la categoría para encontrarlos, elige variante y tamaño de
        vista previa, y activa un ícono para copiar su código, por ejemplo <strong>{'<Icon name="search" />'}</strong>.
      </DocText>
      <CatalogoIconos />
    </DocSection>
  );
}

/**
 * Página "Iconografía" de Fundamentos de diseño.
 * `initialTab` permite abrirla directamente en una pestaña (una historia por pestaña).
 */
export function Iconografia({ initialTab = 'definicion' }: { initialTab?: IconografiaTab }) {
  return (
    <FoundationPage
      iconSvg={iconSvg}
      title="Iconografía"
      subtitle="Fundamentos y lineamientos para el uso de la iconografía en los productos digitales de CAOS."
      initialTab={initialTab}
      tabs={[
        { id: 'definicion', label: 'Definición', content: <Definicion /> },
        { id: 'valores', label: 'Valores', content: <Valores /> },
        { id: 'catalogo', label: 'Catálogo', content: <Catalogo /> },
      ]}
    />
  );
}
