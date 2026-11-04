import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { Chip } from './Chip';
import { ChipGroup } from './ChipGroup';
import { ChipPlus } from './ChipPlus';

/*
 * Contenido de la página de documentación de Chip (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Chip.types.ts`, `Chip.variants.ts`, `Chip.tsx`), luego `Chip.docs.json`. Diferencias con Figma: el trazo es de 1 px
 * (`border/general/md`) y Figma dibuja 0.5 px (`border/general/sm`); Figma no dibuja el anillo de foco y el código
 * agrega uno de 2 px; Figma cambia el color del punto en cada estado de Primary color y el código lo fija con `color`.
 */

// Figma: 9347:46000 (component set Chips) y 15236:72238 (component set Chips plus)

type ChipProps = Partial<ComponentProps<typeof Chip>>;

const noop = () => {};

/** Chip de ejemplo con acción y botón de quitar, para que Hover y Focus tengan sentido. */
const chip = (props: ChipProps = {}, label: ReactNode = 'Diseño') => (
  <Chip onClick={noop} onRemove={noop} {...props}>
    {label}
  </Chip>
);

/** Chip con avatar de iniciales. */
const person = (props: ChipProps = {}, name = 'Ana Pérez') =>
  chip({ type: 'primary-avatar', avatar: <Avatar variant="initials" name={name} />, ...props }, name);

/** Chip con punto de color. */
const dot = (props: ChipProps = {}, label: ReactNode = 'Disponible') =>
  chip({ type: 'primary-color', colorLabel: 'Verde', color: 'green', ...props }, label);

/** Fila de ejemplos con separación para las cotas. */
const row = (...items: ReactNode[]) => (
  <div className="flex flex-wrap items-center gap-ds-primitives-space-6xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Fila de chips a la distancia de un grupo. */
const group = (...items: ReactNode[]) => (
  <div className="flex flex-wrap items-center gap-ds-space-general-lg">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Pila de ejemplos. */
const stack = (...items: ReactNode[]) => (
  <div className="flex flex-col items-start gap-ds-space-general-lg">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Muestras de un estado: el chip con ícono y el chip con punto de color. */
const stateSamples = (state: ProbeState) => [chip({ state }), dot({ state })];
type ProbeState = NonNullable<ChipProps['state']>;

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Sin relleno y con un trazo fino alrededor.',
    samples: stateSamples('default'),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero. Fondo gris (<code>background/general/gray-seventh</code>) y el mismo trazo.
      </>
    ),
    samples: stateSamples('hover'),
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Con el foco de teclado. Fondo gris, trazo más marcado y un anillo de 2 px.',
    samples: stateSamples('focus'),
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        Chip marcado (<code>selected</code>). Fondo gris y sin trazo.
      </>
    ),
    samples: stateSamples('select'),
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        Sin respuesta (<code>disabled</code>). Fondo, texto e ícono atenuados, y sin acción ni botón de quitar.
      </>
    ),
    samples: stateSamples('inactive'),
  },
];

export const doc: ComponentDocContent = {
  name: 'Chip',
  icon: 'tag',
  classification: 'molecula',
  summary:
    'El Chip es la molécula para mostrar un valor compacto que se puede marcar o quitar, como un filtro o una etiqueta aplicada. Une un texto, un adorno (ícono, avatar, punto de color o Badge) y un botón para quitar. ChipGroup los agrupa con selección única o múltiple, y ChipPlus resume los que sobran.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Una cápsula agrupa el cuerpo y el botón de quitar. El cuerpo une el adorno y el texto, y toda la cápsula es su área de clic.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Primary',
                  preview: chip(),
                  marks: [
                    { n: 1, selector: '[data-chip-root]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', index: 0, side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Text-button"]', side: 'bottom' },
                    { n: 4, selector: '[data-chip-close]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Icon-sizes"]', fromIndex: 0, to: '[data-figma-part="Text-button"]' },
                    { kind: 'height', selector: '[data-chip-root]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Cápsula:</strong> alto de 32 px con radio completo (<code>radius/button/full</code>). Padding de 12 px en horizontal (<code>space/button/xl</code>) y 8 px en vertical (<code>space/button/lg</code>). Recibe <code>className</code>.
                </>,
                <>
                  <strong>Ícono:</strong> 14 px, a la izquierda (<code>iconName</code>, por defecto <code>clock</code>). Se oculta con <code>icon=&#123;false&#125;</code>.
                </>,
                <>
                  <strong>Texto:</strong> 12 px regular (<code>typography/button/size/sm</code>) en un marco de 16 px de alto y a 4 px del ícono (<code>gap/button/internal-margin/md</code>).
                </>,
                <>
                  <strong>Botón de quitar:</strong> ícono de 14 px con área de 24 × 24 px. Es un botón aparte, con el nombre &quot;Quitar&quot; y el texto del chip.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Primary avatar y Primary color',
                  preview: row(person(), dot({ tone: 'strong' })),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Avatar"]', index: 0, side: 'top' },
                    { n: 2, selector: '[data-figma-part="Ellipse 1"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-chip-root]', index: 1, side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-chip-root]', index: 0, side: 'left' },
                    { kind: 'padding', selector: '[data-chip-root]', index: 1, side: 'left' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Avatar:</strong> círculo de 24 px (<code>avatar</code>). El chip lo pasa a tamaño <code>xs</code> y lo marca decorativo: el nombre ya va en el texto.
                </>,
                <>
                  <strong>Punto de color:</strong> círculo de 24 px (<code>color</code> y <code>tone</code>). Solo informa con <code>colorLabel</code>.
                </>,
                <>
                  <strong>Cápsula:</strong> con avatar o punto el alto sigue en 32 px. El padding izquierdo baja a 4 px (<code>space/button/md</code>) y el derecho a 8 px (<code>space/button/lg</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Primary box',
                  preview: (
                    <div className="w-56">
                      {chip({ type: 'primary-box' }, 'Reunión en horario extendido con todo el equipo de diseño')}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-chip-root]', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Text-button"]', side: 'left' },
                    { n: 3, selector: '[data-chip-close]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-chip-root]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Cápsula:</strong> versión rectangular con radio de 16 px (<code>radius/general/xl</code>). Mismo padding que Primary y contenido alineado arriba.
                </>,
                <>
                  <strong>Texto:</strong> ocupa el ancho disponible y se parte en varias líneas, con alto de línea de 14 px (<code>typography/body/line-height-short/xs</code>).
                </>,
                <>
                  <strong>Botón de quitar:</strong> queda alineado arriba, junto a la primera línea.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Chip con Badge y ChipPlus',
                  preview: row(chip({ badge: 3, badgeLabel: 'pendientes' }, 'Adjuntos'), <ChipPlus count={3} />),
                  marks: [
                    { n: 1, selector: '[data-chip-body] > :first-child', index: 0, side: 'top' },
                    { n: 2, selector: '[data-figma-part="Button"]', index: 0, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-chip-root]', index: 0 },
                    { kind: 'height', selector: '[data-figma-part="Button"]', index: 0 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Badge:</strong> contador de 16 px de alto (<code>badge</code>). Ocupa el lugar del ícono en Primary y Primary box.
                </>,
                <>
                  <strong>ChipPlus:</strong> botón &quot;+N&quot; de 32 px de alto, sin botón de quitar. Resume los chips que sobran y abre una lista con ellos.
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
          Chip tiene 5 estados. Hover y Focus se fuerzan con <code>state</code> solo para documentar; en uso salen del puntero, del teclado, de <code>selected</code> y de <code>disabled</code>. Hover solo responde si el chip tiene acción o selección.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default y de los estados que cambian el color. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Primary, Primary avatar y Primary box',
              preview: stack(chip(), person(), chip({ type: 'primary-box' }, 'Reunión')),
              entries: [
                { part: 'Trazo', color: 'border-general-gray-fourth' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-button-size-sm' },
                { part: 'Ícono y botón de quitar', color: 'icon-general-default' },
                { part: 'Fondo (Hover)', color: 'background-general-gray-seventh' },
                { part: 'Fondo (Focus y Select)', color: 'background-general-gray-sixth' },
                { part: 'Trazo (Focus)', color: 'border-general-gray-tertiary' },
                { part: 'Anillo de foco (Focus)', color: 'border-field-active' },
                { part: 'Fondo (Inactive)', color: 'background-container-disabled-on-canva' },
                { part: 'Trazo (Inactive)', color: 'border-general-disabled' },
                { part: 'Texto (Inactive)', color: 'text-neutral-disabled-on-card' },
                { part: 'Ícono (Inactive)', color: 'icon-general-disabled-negative' },
              ],
            },
            {
              title: 'Primary color, tono soft',
              preview: stack(
                dot({ color: 'purple', colorLabel: 'Morado' }, 'Diseño'),
                dot({ color: 'green' }, 'Disponible'),
                dot({ color: 'red', colorLabel: 'Rojo' }, 'Pendiente')
              ),
              entries: [
                { part: 'Punto purple', color: 'background-graphic-acent-firts' },
                { part: 'Punto violet', color: 'background-graphic-acent-secondary' },
                { part: 'Punto green', color: 'background-graphic-success-firts' },
                { part: 'Punto yellow', color: 'background-graphic-alert-firts' },
                { part: 'Punto red', color: 'background-graphic-error-firts' },
                { part: 'Punto blue', color: 'background-tertiary-secondary' },
                { part: 'Punto cyan', color: 'background-graphic-information-firts' },
              ],
            },
            {
              title: 'Primary color, tono strong',
              preview: stack(
                dot({ color: 'green', tone: 'strong' }, 'Disponible'),
                dot({ color: 'red', tone: 'strong', colorLabel: 'Rojo' }, 'Pendiente')
              ),
              entries: [
                { part: 'Punto green', color: 'background-graphic-success-secondary' },
                { part: 'Punto yellow', color: 'background-graphic-alert-secondary' },
                { part: 'Punto red', color: 'background-graphic-error-secondary' },
                { part: 'Punto blue', color: 'background-graphic-tertiary-secondary' },
                { part: 'Punto cyan', color: 'background-graphic-information-secondary' },
              ],
            },
            {
              title: 'ChipPlus',
              preview: row(<ChipPlus count={3} />, <ChipPlus count={3} state="select" />),
              entries: [
                { part: 'Trazo', color: 'border-general-gray-fourth' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-button-size-sm' },
                { part: 'Fondo (Hover, Focus y Select)', color: 'background-general-gray-sixth' },
                { part: 'Anillo de foco (Focus)', color: 'border-field-active' },
                { part: 'Fondo (Inactive)', color: 'background-container-disabled-on-canva' },
                { part: 'Texto (Inactive)', color: 'text-neutral-disabled-on-card' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Chip en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Chips en la librería de Assets. Sus propiedades son Text, Close, Icon, Type y State. El &quot;+N&quot; es otro set, Chips plus.
            </>,
            <>
              <strong>Type:</strong> Primary, Primary avatar, Primary color y Primary box son <code>type=&quot;primary&quot;</code>, <code>&quot;primary-avatar&quot;</code>, <code>&quot;primary-color&quot;</code> y <code>&quot;primary-box&quot;</code>. Text es <code>children</code>, Icon es <code>icon</code> y Close es <code>close</code>.
            </>,
            <>
              <strong>State:</strong> Hover y Focus salen del puntero y del teclado (<code>state</code> solo los fuerza). Select es <code>selected</code> e Inactive es <code>disabled</code>. Chips plus tiene los mismos valores.
            </>,
            <>
              <strong>Lo que difiere de Figma:</strong> Figma cambia el color del punto en cada estado de Primary color y el código lo fija con <code>color</code>. Figma no dibuja el anillo de foco ni ChipGroup, y el código los agrega.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Chip es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Valores que se pueden quitar:</strong> filtros o etiquetas aplicadas, con <code>onRemove</code>. Supr y Retroceso sobre el chip también lo quitan.
            </>,
            <>
              <strong>Filtros que se activan:</strong> <code>selected</code> o <code>defaultSelected</code> lo vuelven un botón de alternancia. En un <code>ChipGroup</code>, <code>single</code> elige una opción y <code>multiple</code> varias.
            </>,
            <>
              <strong>Personas y categorías:</strong> <code>primary-avatar</code> para personas y <code>primary-color</code> para categorías, con <code>colorLabel</code> que diga qué significa el color.
            </>,
            <>
              <strong>Más chips que espacio:</strong> <code>max</code> en <code>ChipGroup</code> resume los que sobran en un <code>ChipPlus</code> (&quot;+N&quot;) que abre la lista.
            </>,
          ],
          avoid: [
            <>
              <strong>Acciones principales o de formulario:</strong> el chip no tiene jerarquía de acción. (Alternativa: <code>Button</code>).
            </>,
            <>
              <strong>Etiquetas fijas, sin acción:</strong> una categoría o un estado que no se quita ni se elige. (Alternativa: <code>Tag</code>).
            </>,
            <>
              <strong>Listas largas de opciones:</strong> con muchas opciones, los chips ocupan demasiado espacio. (Alternativa: <code>Select</code>).
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
                title: 'Primary',
                bullets: [
                  <>
                    <strong>Medidas:</strong> alto de 32 px, padding de 12 × 8 px y gap de 4 px entre el ícono y el texto.
                  </>,
                  <>
                    <strong>Texto:</strong> 12 px regular en una sola línea.
                  </>,
                ],
                preview: chip(),
              },
              {
                title: 'Primary box',
                bullets: [
                  <>
                    <strong>Medidas:</strong> radio de 16 px y el mismo padding que Primary.
                  </>,
                  <>
                    <strong>Texto:</strong> ocupa el ancho disponible y se parte en varias líneas.
                  </>,
                ],
                preview: (
                  <div className="w-56">
                    {chip({ type: 'primary-box' }, 'Reunión en horario extendido con todo el equipo de diseño')}
                  </div>
                ),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Padding:</strong> en Primary y Primary box baja a 8 px en horizontal (<code>space/button/xl</code>); en Desktop y Tablet es de 12 px.
              </>,
              <>
                <strong>Sin cambios:</strong> el alto de 32 px, el gap, el texto de 12 px y el área de 24 × 24 px del botón de quitar.
              </>,
              <>
                <strong>Avatar y punto de color:</strong> conservan su padding de 4 px a la izquierda y 8 px a la derecha.
              </>,
            ],
            preview: stack(chip(), person()),
          },
          tablet: {
            bullets: [
              <>
                <strong>Padding:</strong> 12 px en horizontal en Primary y Primary box, igual que en Desktop.
              </>,
              <>
                <strong>Sin cambios:</strong> el alto de 32 px, el gap, el texto de 12 px y el área de 24 × 24 px del botón de quitar.
              </>,
              <>
                <strong>Avatar y punto de color:</strong> conservan su padding de 4 px a la izquierda y 8 px a la derecha.
              </>,
            ],
            preview: stack(chip(), person()),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de longitud del texto, adornos y grupos con desbordamiento.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Texto breve',
              description: 'Escribe una o dos palabras en el chip.',
              preview: group(chip({}, 'Reunión'), chip({}, 'Diseño')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto extenso',
              description: 'No escribas frases completas en el chip.',
              preview: group(chip({}, 'Reunión semanal de diseño y producto')),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Mismo adorno',
              description: 'Usa el mismo tipo de adorno en todos los chips de un grupo.',
              preview: group(person({}, 'Ana Pérez'), person({}, 'Hugo García')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Adornos mezclados',
              description: 'No mezcles ícono, avatar y punto de color en el mismo grupo.',
              preview: group(chip({}, 'Ana Pérez'), person({}, 'Hugo García')),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Exceso en +N',
              description: (
                <>
                  Define <code>max</code> para resumir los chips que no caben.
                </>
              ),
              preview: (
                <ChipGroup aria-label="Temas" max={3}>
                  {['Diseño', 'Código', 'Datos', 'Escritura', 'Música', 'Fotografía', 'Ilustración', 'Animación'].map((t) => (
                    <Chip key={t} icon={false}>
                      {t}
                    </Chip>
                  ))}
                </ChipGroup>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Exceso en varias filas',
              description: 'No dejes que los chips ocupen filas sin límite.',
              preview: (
                <ChipGroup aria-label="Temas">
                  {['Diseño', 'Código', 'Datos', 'Escritura', 'Música', 'Fotografía', 'Ilustración', 'Animación'].map((t) => (
                    <Chip key={t} icon={false}>
                      {t}
                    </Chip>
                  ))}
                </ChipGroup>
              ),
            },
          ],
        },
      ],
    },
  ],
};
