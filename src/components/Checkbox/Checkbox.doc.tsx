import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Checkbox } from './Checkbox';

/*
 * Contenido de la página de documentación de Checkbox (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Checkbox.types.ts`, `Checkbox.variants.ts`, `Checkbox.tsx`), luego `Checkbox.docs.json`. Diferencias con Figma: el
 * set no dibuja el estado mixto, el foco ni el hover; el código agrega el mixto (relleno de Select y raya de 8 × 1.5 px)
 * y un contorno de foco de 2 px. En Negative con Disabled, Figma pinta el fondo con `background/field/disabled-negative`
 * y el código usa `background/field/disabled`.
 */

// Figma: 9545:6413 y 9558:6975 (component set Selection: control solo y control con texto)

type CheckboxProps = Partial<ComponentProps<typeof Checkbox>>;

/** Checkbox de ejemplo con texto. */
const box = (props: CheckboxProps = {}, label: ReactNode = 'Recibir avisos') => <Checkbox {...props}>{label}</Checkbox>;

/** Checkbox solo con control: el nombre accesible va en `aria-label`. */
const bare = (props: CheckboxProps = {}) => <Checkbox aria-label="Recibir avisos" {...props} />;

/** Fila de ejemplos con separación para las cotas. */
const row = (...items: ReactNode[]) => (
  <div className="flex items-center gap-ds-primitives-space-6xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Pila de ejemplos. */
const stack = (...items: ReactNode[]) => (
  <div className="flex flex-col gap-ds-space-general-lg">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Superficie inversa al tema (`background/general/white`): ahí va el contraste Negative. */
const onInverse = (children: ReactNode) => <div className="bg-ds-background-general-white p-ds-space-general-2xl">{children}</div>;

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Solo el contorno de 1.5 px, sin relleno.',
    samples: [box({ state: 'default' })],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        Marcada (<code>checked</code>). Relleno de acento y check dentro.
      </>
    ),
    samples: [box({ state: 'select' })],
  },
  {
    label: 'Indeterminate',
    tone: 'accent',
    description: (
      <>
        Mixto (<code>indeterminate</code>). Mismo relleno que Select, con una raya en lugar del check.
      </>
    ),
    samples: [box({ state: 'indeterminate' })],
  },
  {
    label: 'Disabled Default',
    tone: 'neutral',
    description: (
      <>
        Sin marcar y sin respuesta (<code>disabled</code>). Contorno y texto atenuados.
      </>
    ),
    samples: [box({ state: 'disabled-default' })],
  },
  {
    label: 'Disabled Select',
    tone: 'neutral',
    description: 'Marcada y sin respuesta. Relleno y texto atenuados, con el check visible.',
    samples: [box({ state: 'disabled-select' })],
  },
  {
    label: 'Disabled Indeterminate',
    tone: 'neutral',
    description: 'Mixta y sin respuesta. Relleno atenuado con la raya visible.',
    samples: [box({ state: 'disabled-indeterminate' })],
  },
];

const mixedParent = (parentState: 'indeterminate' | 'select') =>
  stack(
    box({ state: parentState }, 'Todos los avisos'),
    <div className="flex flex-col gap-ds-space-general-lg pl-ds-space-general-3xl">
      {box({ state: 'select' }, 'Correo')}
      {box({ state: 'default' }, 'Mensaje de texto')}
    </div>
  );

export const doc: ComponentDocContent = {
  name: 'Checkbox',
  icon: 'clipboard-tick',
  classification: 'atomo',
  summary:
    'El Checkbox es el átomo para marcar o desmarcar una opción. Dibuja una casilla de 16 px con texto opcional, funciona controlado y no controlado, y admite el estado mixto para selecciones parciales. Usa un input nativo, así que el teclado y los lectores de pantalla lo reconocen sin código extra.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila agrupa el control y el texto. El input nativo queda oculto pero accesible dentro de la fila.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Con texto',
                  preview: box({ state: 'select' }),
                  marks: [
                    { n: 1, selector: 'label', side: 'top' },
                    { n: 2, selector: 'label > span[aria-hidden="true"]', side: 'left' },
                    { n: 3, selector: 'label > span[aria-hidden="true"] svg', side: 'bottom' },
                    { n: 4, selector: 'label > span:last-child', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: 'label > span[aria-hidden="true"]', to: 'label > span:last-child' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila:</strong> <code>label</code> en línea que une el control y el texto. Toda la fila responde al clic y recibe <code>className</code>.
                </>,
                <>
                  <strong>Control:</strong> casilla de 16 × 16 px con radio de 6 (<code>radius/<wbr />field/<wbr />checkbox-radiobutton/<wbr />sm</code>) y contorno interior de 1.5 px (<code>stroke/xl</code>).
                </>,
                <>
                  <strong>Check:</strong> marca de 8.05 × 6 px centrada en el control. Solo se ve con el input marcado.
                </>,
                <>
                  <strong>Texto:</strong> opcional. Tipografía de 16 px con alto de línea de 20 px (<code>typography/<wbr />field/<wbr />size/md</code>), a 8 px del control (<code>space/general/lg</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Solo control',
                  preview: bare({ state: 'default' }),
                  marks: [
                    { n: 1, selector: 'label', side: 'top' },
                    { n: 2, selector: 'label > span[aria-hidden="true"]', side: 'right' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'label > span[aria-hidden="true"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila:</strong> sin texto mide lo mismo que el control: 16 × 16 px.
                </>,
                <>
                  <strong>Control:</strong> el mismo control, sin texto. El nombre accesible sale de <code>aria-label</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Marcada y mixta',
                  preview: row(bare({ state: 'select' }), bare({ state: 'indeterminate' })),
                  marks: [
                    { n: 1, selector: 'label > span[aria-hidden="true"]', index: 0, side: 'top' },
                    { n: 2, selector: 'label > span[aria-hidden="true"]', index: 1, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'label > span[aria-hidden="true"]', index: 0 },
                    { kind: 'height', selector: 'label > span[aria-hidden="true"]', index: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Marcada:</strong> relleno de acento y check de 8.05 × 6 px.
                </>,
                <>
                  <strong>Mixta:</strong> el mismo relleno, con una raya de 8 × 1.5 px (<code>stroke/xl</code>) en el color del check.
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
          Checkbox tiene 6 estados. Se fuerzan con <code>state</code> solo para documentar; en uso salen del input nativo (<code>checked</code>, <code>indeterminate</code> y <code>disabled</code>). No cambia en Hover. El foco de teclado dibuja un contorno de 2 px que <code>state</code> no puede forzar.
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
              title: 'Positive',
              preview: box({ state: 'select' }),
              entries: [
                { part: 'Contorno', color: 'background-field-surface-tertiary' },
                { part: 'Relleno (Select y mixto)', color: 'background-field-active-high-contrast' },
                { part: 'Check y raya', color: 'icon-general-black' },
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Contorno y relleno (Disabled)', color: 'background-field-disabled' },
                { part: 'Texto (Disabled default)', color: 'text-neutral-disabled-on-canva' },
                { part: 'Texto (Disabled select)', color: 'text-neutral-disabled-on-card' },
                { part: 'Contorno de foco', color: 'border-field-active' },
              ],
            },
            {
              title: 'Negative',
              preview: onInverse(box({ state: 'select', contrast: 'negative' })),
              entries: [
                { part: 'Contorno y relleno', color: 'background-field-active-slow-contrast' },
                { part: 'Check y raya', color: 'icon-general-default' },
                { part: 'Texto', color: 'text-neutral-black', text: 'typography-field-size-md' },
                { part: 'Contorno y relleno (Disabled)', color: 'background-field-disabled' },
                { part: 'Check y raya (Disabled select)', color: 'icon-general-black' },
                { part: 'Texto (Disabled)', color: 'text-neutral-disabled-on-card' },
                { part: 'Contorno de foco', color: 'border-field-active' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Checkbox en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Selection en la librería de Assets. Hay dos sets: uno con el control solo y otro con el control y <code>Text description</code>. Sus propiedades son Type, State y Contrast.
            </>,
            <>
              <strong>Type:</strong> Checkbox corresponde a este componente y Radio button a <code>Radio</code>, que comparte el set.
            </>,
            <>
              <strong>State:</strong> Default y Select salen de <code>checked</code>; Disabled Default y Disabled Select suman <code>disabled</code>. Contrast Positive y Negative son los valores <code>positive</code> y <code>negative</code> de <code>contrast</code>.
            </>,
            <>
              <strong>Lo que no dibuja Figma:</strong> el estado mixto (<code>indeterminate</code>), el foco de teclado y el Hover. El código agrega los dos primeros y no tiene Hover.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Checkbox es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Opciones que se combinan:</strong> cada casilla se marca o desmarca sin afectar a las demás.
            </>,
            <>
              <strong>Aceptación de una condición:</strong> una casilla con texto, como &quot;Acepto los términos&quot;.
            </>,
            <>
              <strong>Selección parcial:</strong> <code>indeterminate</code> en la casilla que agrupa opciones cuando solo algunas están marcadas.
            </>,
            <>
              <strong>Superficie inversa al tema:</strong> <code>contrast=&quot;negative&quot;</code>; <code>positive</code> es para la superficie del tema.
            </>,
            <>
              <strong>Teclado y lectores de pantalla:</strong> Espacio alterna la casilla y el texto es su etiqueta. Sin texto, pasa <code>aria-label</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Una sola opción entre varias:</strong> las casillas no se excluyen entre sí. (Alternativa: <code>Radio</code>).
            </>,
            <>
              <strong>Efecto inmediato:</strong> si al cambiar se activa o desactiva algo al instante. (Alternativa: <code>Switch</code>).
            </>,
            <>
              <strong>Listas con grupos y subgrupos:</strong> la casilla padre debe resumir a las hijas. (Alternativa: <code>CheckboxTree</code>).
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
                title: 'Con texto',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas:</strong> control de 16 × 16 px, gap de 8 px y texto de 16 px con alto de línea de 20 px.
                  </>,
                ],
                preview: box({ state: 'select' }),
              },
              {
                title: 'Solo control',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> el control no cambia entre breakpoints.
                  </>,
                  <>
                    <strong>Medidas:</strong> 16 × 16 px, con el nombre accesible en <code>aria-label</code>.
                  </>,
                ],
                preview: bare({ state: 'select' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas:</strong> control de 16 × 16 px, gap de 8 px y texto de 16 px con alto de línea de 20 px.
              </>,
              <>
                <strong>Texto largo:</strong> pasa a la línea siguiente dentro del ancho disponible y el control conserva su tamaño.
              </>,
            ],
            preview: box({ state: 'select' }, 'Recibir avisos sobre cambios en la cuenta, recordatorios de tareas pendientes y novedades del equipo'),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas:</strong> control de 16 × 16 px, gap de 8 px y texto de 16 px con alto de línea de 20 px.
              </>,
              <>
                <strong>Texto largo:</strong> pasa a la línea siguiente dentro del ancho disponible y el control conserva su tamaño.
              </>,
            ],
            preview: box({ state: 'select' }, 'Recibir avisos sobre cambios en la cuenta, recordatorios de tareas pendientes y novedades del equipo'),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de etiqueta, selección parcial y tipo de opciones.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Etiqueta que nombra',
              description: 'Escribe en la etiqueta el nombre de la opción.',
              preview: box({ state: 'default' }, 'Recibir avisos'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Etiqueta con instrucción',
              description: 'No escribas instrucciones en la etiqueta.',
              preview: box({ state: 'default' }, 'Haz clic para recibir avisos'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Padre mixto',
              description: (
                <>
                  Usa <code>indeterminate</code> en la casilla padre si solo algunas hijas están marcadas.
                </>
              ),
              preview: mixedParent('indeterminate'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Padre marcado',
              description: 'No marques la casilla padre si faltan hijas por marcar.',
              preview: mixedParent('select'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Opciones que se combinan',
              description: 'Usa casillas cuando se pueden marcar varias opciones a la vez.',
              preview: stack(box({ state: 'select' }, 'Correo'), box({ state: 'select' }, 'Mensaje de texto')),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Opciones excluyentes',
              description: (
                <>
                  No uses casillas si solo cabe una respuesta: usa <code>Radio</code>.
                </>
              ),
              preview: stack(box({ state: 'select' }, 'Plan mensual'), box({ state: 'select' }, 'Plan anual')),
            },
          ],
        },
      ],
    },
  ],
};
