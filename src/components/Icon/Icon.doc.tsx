import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Icon } from './Icon';
import type { IconName, IconSize, IconVariant } from './Icon.types';

/*
 * Contenido de la página de documentación de Icon (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Icon.types.ts`, `IconBase.tsx`, `Icon.tsx`), luego `Icon.docs.json` y el fundamento Iconografía
 * (`src/foundations/Iconografia/`). Icon no tiene set propio en Figma: se corresponde con las instancias del set
 * Icon-sizes de la biblioteca de Iconografía.
 */

// Figma: component set Icon-sizes (biblioteca de Iconografía, sin spec propia en `.qa/figma`)

/** Ícono de ejemplo: el corazón por defecto, con el tamaño, la variante y la clase que pida cada muestra. */
const icon = (size: IconSize = 24, variant?: IconVariant, name: IconName = 'heart', className?: string, label?: string): ReactNode => (
  <Icon name={name} size={size} variant={variant} className={className} aria-label={label} />
);

/** Fila de íconos del mismo dibujo en varios tamaños. */
const sizes = (list: IconSize[], variant?: IconVariant): ReactNode[] => list.map((s) => icon(s, variant));

const states: DocStateItem[] = [
  {
    label: 'Line',
    tone: 'neutral',
    description: (
      <>
        Contorno de 2 px (<code>variant=&quot;line&quot;</code>). Es el dibujo por defecto desde 24 px.
      </>
    ),
    samples: sizes([16, 24, 32], 'line'),
  },
  {
    label: 'Fill',
    tone: 'neutral',
    description: (
      <>
        Dibujo relleno (<code>variant=&quot;fill&quot;</code>). Es el dibujo por defecto por debajo de 24 px.
      </>
    ),
    samples: sizes([16, 24, 32], 'fill'),
  },
  {
    label: 'Menor de 24 px',
    tone: 'neutral',
    description: <>Sin <code>variant</code>, 12, 14, 16 y 20 px se dibujan en fill.</>,
    samples: sizes([12, 16, 20]),
  },
  {
    label: 'Desde 24 px',
    tone: 'neutral',
    description: <>Sin <code>variant</code>, 24, 32, 40, 48 y 56 px se dibujan en line.</>,
    samples: sizes([24, 32, 48]),
  },
];

/** Tres íconos de menú; `active` marca cuál va en fill. */
const menu = (active?: number, all?: IconVariant): ReactNode => (
  <div className="flex items-center gap-ds-space-general-2xl">
    {(['homepage', 'shopping-cart', 'user'] as const).map((n, i) => (
      <Icon key={n} name={n} size={24} variant={all ?? (i === active ? 'fill' : 'line')} />
    ))}
  </div>
);

/** Ícono 16, 24 y 32 en fila, para las vistas de breakpoints. */
const row = (): ReactNode => <div className="flex items-end gap-ds-space-general-2xl">{sizes([16, 24, 32]).map((s, i) => <Fragment key={i}>{s}</Fragment>)}</div>;

export const doc: ComponentDocContent = {
  name: 'Icon',
  icon: 'heart',
  classification: 'atomo',
  summary:
    'El Icon es el átomo que dibuja cualquier ícono de la biblioteca CAOS en dos variantes, line y fill, y en nueve tamaños de 12 a 56 px. No es interactivo y toma el color del texto que lo rodea.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un svg cuadrado con el glifo dibujado dentro; no tiene contenedor, texto ni padding propios.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Ícono de 24 px',
                  preview: icon(24, 'line', 'search'),
                  marks: [
                    { n: 1, selector: 'svg', side: 'left' },
                    { n: 2, selector: 'svg path', side: 'top' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'svg' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Caja:</strong> svg de 24 × 24 px (<code>viewBox</code> 0 0 24 24) que escala con <code>size</code>. Es <code>inline-block</code> y no se encoge dentro de un contenedor flex. Sin <code>aria-label</code> lleva <code>aria-hidden</code> y <code>focusable=&quot;false&quot;</code>.
                </>,
                <>
                  <strong>Glifo:</strong> uno o más <code>path</code> rellenos con <code>currentColor</code>. El margen alrededor lo define el contenedor del uso, no el ícono.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Line y fill',
                  preview: (
                    <>
                      {icon(24, 'line', 'heart')}
                      {icon(24, 'fill', 'heart')}
                    </>
                  ),
                  marks: [
                    { n: 1, selector: 'svg', index: 0, side: 'top' },
                    { n: 2, selector: 'svg', index: 1, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Line:</strong> contorno de 2 px sobre 24 px (el Bold line de Iconografía; el Light line no tiene dibujo propio). Es el dibujo por defecto desde 24 px.
                </>,
                <>
                  <strong>Fill:</strong> el mismo ícono relleno. Es el dibujo por defecto por debajo de 24 px y el del ícono activo en un menú.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños',
                  preview: (
                    <>
                      {icon(12)}
                      {icon(16)}
                      {icon(24)}
                      {icon(32)}
                      {icon(56)}
                    </>
                  ),
                  marks: [
                    { n: 1, selector: 'svg', index: 0, side: 'top' },
                    { n: 2, selector: 'svg', index: 1, side: 'top' },
                    { n: 3, selector: 'svg', index: 2, side: 'top' },
                    { n: 4, selector: 'svg', index: 3, side: 'top' },
                    { n: 5, selector: 'svg', index: 4, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'svg', index: 0 },
                    { kind: 'height', selector: 'svg', index: 2 },
                    { kind: 'height', selector: 'svg', index: 4 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>12 px:</strong> el más pequeño. Junto con 14, 16 y 20 se dibuja en fill por defecto.
                </>,
                <>
                  <strong>16 px:</strong> el tamaño para botones, banners y tooltips en escritorio.
                </>,
                <>
                  <strong>24 px:</strong> el tamaño por defecto. Desde aquí se dibuja en line.
                </>,
                <>
                  <strong>32 px:</strong> para íconos de estado y de menú que necesitan más peso.
                </>,
                <>
                  <strong>56 px:</strong> el más grande. Los tamaños intermedios son 14, 20, 40 y 48 px: <code>size</code> acepta 12, 14, 16, 20, 24, 32, 40, 48 y 56.
                </>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description: (
        <>
          Icon tiene 4 variantes de aspecto, según <code>variant</code> y <code>size</code>. No es interactivo: no tiene hover, focus ni press y no recibe foco.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Icon no fija color: hereda el del texto (currentColor). Estos son los tokens de ícono que se usan con él; cambia el modo para ver su valor.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Color por defecto',
              preview: icon(32, 'line', 'heart', 'text-ds-icon-general-default'),
              entries: [{ part: 'Ícono', color: 'icon-general-default' }],
            },
            {
              title: 'Monocromático',
              preview: (
                <div className="flex items-center gap-ds-space-general-lg">
                  <span className="flex size-14 items-center justify-center rounded-ds-radius-general-xl bg-ds-primitives-color-primary-g13 text-ds-icon-general-default-unicolor">
                    {icon(32, 'line', 'heart')}
                  </span>
                  <span className="flex size-14 items-center justify-center rounded-ds-radius-general-xl bg-ds-primitives-color-primary-b01 text-ds-icon-general-black-unicolor">
                    {icon(32, 'line', 'heart')}
                  </span>
                </div>
              ),
              entries: [
                { part: 'Ícono blanco', color: 'icon-general-default-unicolor' },
                { part: 'Ícono negro', color: 'icon-general-black-unicolor' },
              ],
            },
            {
              title: 'Cromático',
              preview: icon(32, 'line', 'heart', 'text-ds-icon-acent-firts'),
              entries: [{ part: 'Ícono de acento', color: 'icon-acent-firts' }],
            },
            {
              title: 'Semántico',
              preview: (
                <div className="flex items-center gap-ds-space-general-lg">
                  {icon(32, 'line', 'tick-circle', 'text-ds-icon-semantic-success-firts')}
                  {icon(32, 'line', 'close-circle', 'text-ds-icon-semantic-error-firts')}
                  {icon(32, 'line', 'warning', 'text-ds-icon-semantic-alert-firts')}
                  {icon(32, 'line', 'info-circle', 'text-ds-icon-semantic-information-firts')}
                </div>
              ),
              entries: [
                { part: 'Correcto', color: 'icon-semantic-success-firts' },
                { part: 'Error', color: 'icon-semantic-error-firts' },
                { part: 'Alerta', color: 'icon-semantic-alert-firts' },
                { part: 'Información', color: 'icon-semantic-information-firts' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Icon en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra cada ícono en la biblioteca de Iconografía y arrastra la instancia del set Icon-sizes. Sus propiedades son Size y Outline.
            </>,
            <>
              <strong>Size:</strong> 12, 14, 16, 20, 24, 32 o 56. En código es <code>size</code>, que además admite 40 y 48, los tamaños informativos de la página de Iconografía.
            </>,
            <>
              <strong>Outline:</strong> Yes es el dibujo de línea (<code>variant=&quot;line&quot;</code>) y No, el relleno (<code>variant=&quot;fill&quot;</code>). Sin <code>variant</code>, el código elige por tamaño.
            </>,
            <>
              <strong>Color y trazo:</strong> en Figma el color sale de las variables de ícono; en código se hereda con una clase <code>text-ds-icon-*</code>. La biblioteca solo publica line (el Bold line de Iconografía) y fill.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Icon es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Ícono junto a un texto:</strong> sin <code>aria-label</code> es decorativo (<code>aria-hidden</code>) y el lector de pantalla solo lee el texto.
            </>,
            <>
              <strong>Ícono que informa solo:</strong> con <code>aria-label</code> se expone como <code>role=&quot;img&quot;</code> con ese nombre.
            </>,
            <>
              <strong>Color del contexto:</strong> usa <code>currentColor</code>, así que toma el color del texto o de una clase <code>text-ds-icon-*</code>.
            </>,
            <>
              <strong>Variante por tamaño:</strong> fill por debajo de 24 px y line desde 24 px; <code>variant</code> fuerza cualquiera.
            </>,
            <>
              <strong>Paquetes pequeños:</strong> con <code>IconBase</code> y el ícono importado suelto el empaquetador solo incluye los usados.
            </>,
          ],
          avoid: [
            <>
              <strong>Íconos que se presionan:</strong> el svg no recibe clic ni foco. (Alternativa: <code>Button</code> con <code>iconOnly</code>).
            </>,
            <>
              <strong>Significado solo con color:</strong> un ícono rojo sin texto ni nombre no informa. (Alternativa: añadir un texto o <code>aria-label</code>).
            </>,
            <>
              <strong>Tamaños intermedios:</strong> 18 o 28 px no existen. (Alternativa: el valor más cercano de la lista).
            </>,
            <>
              <strong>SVG propios:</strong> rompen el tamaño, la variante y el color heredado. (Alternativa: <code>Icon</code> con <code>name</code> del catálogo).
            </>,
            <>
              <strong>Un <code>name</code> que no existe:</strong> no dibuja nada y no avisa. (Alternativa: elegirlo del catálogo de Iconografía).
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Tamaños',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medida fija:</strong> el svg mide <code>size</code> px de alto y de ancho, de 12 a 56.
                  </>,
                ],
                preview: row(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> no se ajusta al ancho del contenedor y no se encoge en una fila flex.
              </>,
              <>
                <strong>Tamaño por caso:</strong> Iconografía pide 16 px en escritorio y 12 px en móvil dentro de un Button; el cambio lo haces tú con <code>size</code>.
              </>,
            ],
            preview: row(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> no se ajusta al ancho del contenedor y no se encoge en una fila flex.
              </>,
              <>
                <strong>Variante:</strong> la regla por defecto (fill menor de 24 px, line desde 24 px) es la misma en los tres breakpoints.
              </>,
            ],
            preview: row(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre accesible, tamaño y variante.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Ícono con nombre accesible',
              description: (
                <>
                  Pon <code>aria-label</code> al ícono que informa solo, sin texto al lado.
                </>
              ),
              preview: icon(32, 'line', 'warning', 'text-ds-icon-semantic-alert-firts', 'Advertencia'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ícono sin nombre',
              description: (
                <>
                  No dejes sin <code>aria-label</code> un ícono que informa solo: el lector de pantalla lo ignora.
                </>
              ),
              preview: icon(32, 'line', 'warning', 'text-ds-icon-semantic-alert-firts'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Tamaño acorde al texto',
              description: 'Usa 16 px junto a un texto pequeño.',
              preview: (
                <div className="flex items-center gap-ds-space-general-md text-ds-text-neutral-body">
                  {icon(16, undefined, 'download')}
                  <span className="text-ds-primitives-typography-size-md">Descargar reporte</span>
                </div>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ícono que domina el texto',
              description: 'No pongas un ícono de 56 px junto a un texto de 14 px.',
              preview: (
                <div className="flex items-center gap-ds-space-general-md text-ds-text-neutral-body">
                  {icon(56, undefined, 'download')}
                  <span className="text-ds-primitives-typography-size-md">Descargar reporte</span>
                </div>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Fill solo para el activo',
              description: 'Deja line en el grupo y usa fill en el ícono activo.',
              preview: menu(1),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Todo el grupo en fill',
              description: 'No pongas todo el grupo en fill: el activo deja de distinguirse.',
              preview: menu(undefined, 'fill'),
            },
          ],
        },
      ],
    },
  ],
};
