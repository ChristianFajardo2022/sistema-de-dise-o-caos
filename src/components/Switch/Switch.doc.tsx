import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Switch } from './Switch';
import { ThemeSwitch } from '../ThemeSwitch';

/*
 * Contenido de la página de documentación de Switch (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Switch.types.ts`, `Switch.variants.ts`, `Switch.tsx`), luego `Switch.docs.json`. Medidas: simple 48 × 32 con ficha
 * de 24; complex 38 de alto con ficha de 30. El padding de la pista (`space/field/xs`) es 4 en Desktop y Tablet y 2 en
 * Mobile, así que las alturas bajan a 28 y 34 en Mobile. Diferencias con Figma: Figma no dibuja foco ni Hover; el
 * código agrega un contorno de 2 px y no tiene Hover. El Type Toggle del átomo es el mismo dibujo que Simple.
 */

// Figma: 9335:5863 (component set Toggle), 9504:6567 (component set Toggle (Atom)) y 22357:25378 (Switch dark/light)

type SwitchSampleProps = Partial<ComponentProps<typeof Switch>>;

/** Switch simple con descripción. */
const simple = (props: SwitchSampleProps = {}, label: ReactNode = 'Modo oscuro') => <Switch {...props}>{label}</Switch>;

/** Switch complex: el texto va dentro de la pista y nombra al control. */
const complex = (props: SwitchSampleProps = {}, label: ReactNode = 'Sonido') => <Switch type="complex" trackLabel={label} {...props} />;

/** Switch de modo claro u oscuro (ThemeSwitch). Su nombre difiere del por defecto para no chocar con el interruptor de modo de la propia página. */
const themeSwitch = (props: ComponentProps<typeof ThemeSwitch> = {}) => <ThemeSwitch aria-label="Modo de la interfaz" {...props} />;

/** Fila de ejemplos con separación para las cotas. */
const wideRow = (...items: ReactNode[]) => (
  <div className="flex items-center gap-ds-primitives-space-6xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Columna de ejemplos: caben en el marco de teléfono. */
const column = (...items: ReactNode[]) => (
  <div className="flex flex-col items-start gap-ds-space-general-xl">{items.map((item, i) => <Fragment key={i}>{item}</Fragment>)}</div>
);

/** Muestras de un estado: simple con descripción y complex con texto dentro. */
const stateSamples = (props: SwitchSampleProps): ReactNode[] => [simple(props), complex(props, 'Activo')];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Apagado. Pista gris con la ficha a la izquierda; en Complex, el texto queda a la derecha de la ficha.',
    samples: stateSamples({}),
  },
  {
    label: 'Select',
    tone: 'accent',
    description: 'Encendido. La pista pasa a verde y la ficha a la derecha; en Complex, el texto pasa a la izquierda.',
    samples: stateSamples({ defaultChecked: true }),
  },
  {
    label: 'Disabled inactive',
    tone: 'neutral',
    description: (
      <>
        Apagado y sin respuesta (<code>disabled</code>). Ficha y texto atenuados; en oscuro la pista tiene el color de la superficie y se funde con ella, así que solo se ve la ficha. El cursor indica que no se puede usar.
      </>
    ),
    samples: stateSamples({ disabled: true }),
  },
  {
    label: 'Disabled active',
    tone: 'neutral',
    description: 'Encendido y sin respuesta. La ficha conserva su posición y el texto se atenúa; en oscuro la pista se funde con la superficie, como en Disabled inactive.',
    samples: stateSamples({ disabled: true, defaultChecked: true }),
  },
];

export const doc: ComponentDocContent = {
  name: 'Switch',
  icon: 'setting',
  classification: 'atomo',
  summary:
    'El Switch es el átomo para encender o apagar un ajuste que se aplica al instante. Tiene dos formas, simple y complex (con texto dentro de la pista), y funciona controlado o no controlado.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una pista con una ficha que se desplaza, y una descripción opcional al lado. En Complex, el texto va dentro de la pista.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Simple con descripción',
                  preview: simple(),
                  marks: [
                    { n: 1, selector: 'label', side: 'top' },
                    { n: 2, selector: '[data-figma-part="Toggle (Atom)"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Rectangle 3"]', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Text description"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Toggle (Atom)"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Toggle (Atom)"]', to: '[data-figma-part="Text description"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Fila:</strong> pista y descripción con una separación de 8 (<code>space/general/lg</code>), centradas en vertical. Toda la fila es el área de clic.
                </>,
                <>
                  <strong>Pista:</strong> 48 × 32 con radio de píldora (<code>radius/button/full</code>) y padding de 4 (<code>space/field/xs</code>). Apagada es gris y encendida, verde.
                </>,
                <>
                  <strong>Ficha:</strong> círculo de 24. Va a la izquierda apagada y a la derecha encendida.
                </>,
                <>
                  <strong>Descripción:</strong> texto de 16 con alto de línea de 20. Es el nombre accesible del control.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Complex apagado y encendido',
                  preview: wideRow(complex(), complex({ defaultChecked: true })),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Toggle (Atom)"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Rectangle 3"]', index: 0, side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Text"]', index: 0, side: 'top' },
                    { n: 4, selector: '[data-figma-part="Rectangle 3"]', index: 1, side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Toggle (Atom)"]', index: 0, side: 'left' },
                    { kind: 'height', selector: '[data-figma-part="Toggle (Atom)"]', index: 0 },
                    { kind: 'gap', from: '[data-figma-part="Rectangle 3"]', fromIndex: 0, to: '[data-figma-part="Text container"]', toIndex: 0 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Pista:</strong> 38 de alto y ancho según su texto. Padding de 4 y de 12 del lado del texto (<code>space/field/xs</code> y <code>space/field/md</code>), con 8 entre ficha y texto.
                </>,
                <>
                  <strong>Ficha:</strong> círculo de 30, más grande que en Simple.
                </>,
                <>
                  <strong>Texto:</strong> 16 con alto de línea de 20 y 2 de margen inferior (<code>space/text/sm</code>). Es el nombre accesible si no hay descripción.
                </>,
                <>
                  <strong>Encendido:</strong> la ficha pasa a la derecha y el texto a la izquierda; el padding de 12 cambia de lado.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Switch de modo',
                  preview: themeSwitch(),
                  marks: [
                    { n: 1, selector: 'button', side: 'left' },
                    { n: 2, selector: '[data-active]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Sun"] svg', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Moon"] svg', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'button', side: 'left' },
                    { kind: 'height', selector: 'button' },
                    { kind: 'gap', from: '[data-figma-part="Sun"]', to: '[data-figma-part="Moon"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> píldora de 104 × 56 (<code>radius/button/full</code>) con padding de 8 (<code>space/field/sm</code>), 8 entre casillas (<code>space/general/lg</code>) y sombra suave. En Mobile el padding baja a 4 y mide 96 × 48. El fondo cambia si se apoya en el lienzo o en una tarjeta.
                </>,
                <>
                  <strong>Casilla activa:</strong> círculo de 40 con fondo blanco (<code>background/general/white</code>) que marca el modo en uso.
                </>,
                <>
                  <strong>Ícono de sol:</strong> 24, a la izquierda. Es el modo claro.
                </>,
                <>
                  <strong>Ícono de luna:</strong> 24, a la derecha. Es el modo oscuro.
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
          Switch tiene 4 estados: apagado y encendido, cada uno habilitado o deshabilitado (el Switch de modo solo alterna entre claro y oscuro). Salen de <code>checked</code> (o <code>defaultChecked</code>) y <code>disabled</code>; no hay prop <code>state</code> ni Hover. El foco de teclado dibuja un contorno de 2 px.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada estado. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Default (apagado)',
              preview: column(simple(), complex({}, 'Activo')),
              entries: [
                { part: 'Fondo de la pista', color: 'background-general-gray-fifth' },
                { part: 'Ficha', color: 'icon-general-default-unicolor' },
                { part: 'Descripción', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Texto de la pista (Complex)', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Select (encendido)',
              preview: column(simple({ defaultChecked: true }), complex({ defaultChecked: true }, 'Activo')),
              entries: [
                { part: 'Fondo de la pista', color: 'background-semantic-success-fourth' },
                { part: 'Ficha', color: 'icon-general-default-unicolor' },
                { part: 'Descripción', color: 'text-neutral-white', text: 'typography-field-size-md' },
                { part: 'Texto de la pista (Complex)', color: 'text-field-placeholder', text: 'typography-field-size-md' },
              ],
            },
            {
              title: 'Disabled',
              preview: column(simple({ disabled: true }), complex({ disabled: true, defaultChecked: true }, 'Activo')),
              entries: [
                { part: 'Fondo de la pista', color: 'background-general-gray-seventh' },
                { part: 'Ficha', color: 'icon-general-disabled-negative' },
                { part: 'Descripción (apagado)', color: 'text-neutral-disabled-on-canva' },
                { part: 'Descripción (encendido)', color: 'text-neutral-disabled-on-card' },
                { part: 'Texto de la pista (Complex)', color: 'text-neutral-disabled-on-canva' },
              ],
            },
            {
              title: 'Switch de modo',
              preview: column(themeSwitch(), themeSwitch({ value: 'dark', contrast: 'on-card' })),
              entries: [
                { part: 'Contenedor (sobre el lienzo)', color: 'background-container-default-on-canva' },
                { part: 'Contenedor (sobre una tarjeta)', color: 'background-container-default-on-card' },
                { part: 'Casilla activa', color: 'background-general-white' },
                { part: 'Ícono de la casilla activa', color: 'icon-general-black' },
                { part: 'Ícono de la casilla inactiva', color: 'icon-general-default' },
                { part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Switch en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Toggle en la librería de Assets. La pista sola es el átomo Toggle (Atom), que en código es <code>SwitchTrack</code>.
            </>,
            <>
              <strong>Type en Toggle:</strong> Text es la pista simple con descripción (<code>children</code>) y Only es la pista complex con texto dentro y sin descripción (<code>type=&quot;complex&quot;</code> con <code>trackLabel</code>). Active ON y OFF son <code>checked</code>; State Disabled es <code>disabled</code>.
            </>,
            <>
              <strong>Type y State en Toggle (Atom):</strong> Simple, Complex o Toggle (<code>type</code>) y Default, Select, Disabled inactive o Disabled active, que combinan <code>checked</code> y <code>disabled</code>. Toggle es el mismo dibujo que Simple, solo existe en Disabled active y no tiene prop propia.
            </>,
            <>
              <strong>Switch dark/light:</strong> busca el set como Switch dark/light. State (Light o Dark) es <code>value</code> (<code>&quot;light&quot;</code> o <code>&quot;dark&quot;</code>) y Contrast (On canva u On card) es <code>contrast</code> (<code>&quot;on-canva&quot;</code> o <code>&quot;on-card&quot;</code>). En código es <code>ThemeSwitch</code>.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> no dibuja el foco ni el Hover. El código agrega un contorno de 2 px y no tiene Hover.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Switch es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Ajuste que se aplica al instante:</strong> encender o apagar notificaciones o un modo, sin botón para guardar.
            </>,
            <>
              <strong>Cambiar entre modo claro y oscuro:</strong> usa <code>ThemeSwitch</code>, con sol y luna, para alternar el tema de una interfaz.
            </>,
            <>
              <strong>Dos valores excluyentes:</strong> expone <code>role=&quot;switch&quot;</code> y <code>aria-checked</code>, así que el lector anuncia encendido o apagado.
            </>,
            <>
              <strong>Nombre siempre visible:</strong> una descripción en <code>children</code> o, en Complex, el texto de la pista. Si no hay ninguno, pasa <code>aria-label</code>.
            </>,
            <>
              <strong>Teclado:</strong> Espacio y Enter alternan. El foco dibuja un contorno de 2 px.
            </>,
            <>
              <strong>Controlado o no:</strong> <code>checked</code> con <code>onCheckedChange</code> cuando el valor vive en tu estado; <code>defaultChecked</code> cuando no.
            </>,
          ],
          avoid: [
            <>
              <strong>Confirmar con un botón:</strong> el Switch cambia al instante, no al enviar. (Alternativa: <code>Checkbox</code>).
            </>,
            <>
              <strong>Elegir una entre varias opciones:</strong> el Switch solo tiene dos valores. (Alternativa: <code>Radio</code>).
            </>,
            <>
              <strong>Texto de la pista que cambia con el estado:</strong> &quot;On&quot; y &quot;Off&quot; hacen que el nombre del control cambie al alternarlo. (Alternativa: un texto fijo en <code>trackLabel</code>, como &quot;Sonido&quot;).
            </>,
            <>
              <strong>Un ajuste que no es el modo:</strong> el sol y la luna solo significan claro y oscuro. (Alternativa: un <code>Switch</code> con su descripción).
            </>,
            <>
              <strong>Una acción puntual:</strong> el Switch guarda un estado, no ejecuta algo. (Alternativa: <code>Button</code>).
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
                title: 'Simple',
                bullets: [
                  <>
                    <strong>Pista:</strong> 48 × 32 con padding de 4 y ficha de 24.
                  </>,
                  <>
                    <strong>Descripción:</strong> 16 con alto de línea de 20, a 8 de la pista.
                  </>,
                ],
                preview: column(simple(), simple({ defaultChecked: true })),
              },
              {
                title: 'Complex',
                bullets: [
                  <>
                    <strong>Pista:</strong> 38 de alto con padding de 4 y ficha de 30; el ancho sigue al texto.
                  </>,
                  <>
                    <strong>Texto:</strong> 16 con alto de línea de 20, dentro de la pista.
                  </>,
                ],
                preview: column(complex(), complex({ defaultChecked: true })),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Pista más baja:</strong> el padding baja de 4 a 2 (<code>space/field/xs</code>) y la ficha no cambia. Simple mide 48 × 28 y Complex, 34 de alto.
              </>,
              <>
                <strong>Texto:</strong> igual que en Desktop, 16 con alto de línea de 20.
              </>,
              <>
                <strong>Área de clic:</strong> toda la fila, no solo la pista.
              </>,
            ],
            preview: column(simple(), complex({ defaultChecked: true })),
          },
          tablet: {
            bullets: [
              <>
                <strong>Mismas medidas que Desktop:</strong> Simple 48 × 32 y Complex 38 de alto, con padding de 4.
              </>,
              <>
                <strong>Tamaño fijo:</strong> no se estira con el ancho disponible; el ancho de Complex sigue a su texto.
              </>,
              <>
                <strong>Una línea:</strong> el texto no se parte (<code>whitespace-nowrap</code>); un texto largo ensancha la fila.
              </>,
            ],
            preview: column(simple(), complex({ defaultChecked: true })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre, texto y uso del Switch.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Nombre accesible',
              description: (
                <>
                  Da nombre a un Switch sin texto con <code>aria-label</code> que describa la función.
                </>
              ),
              preview: <Switch aria-label="Activar sonido" />,
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Nombre genérico',
              description: (
                <>
                  No uses un <code>aria-label</code> que no dice qué controla.
                </>
              ),
              preview: <Switch aria-label="Activar" />,
            },
            {
              kind: 'do',
              framed: true,
              title: 'Texto fijo en la pista',
              description: 'Deja el mismo texto de la pista encendido y apagado.',
              preview: column(complex(), complex({ defaultChecked: true })),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'On y Off en la pista',
              description: 'No cambies el texto de la pista con el estado.',
              preview: column(complex({}, 'Off'), complex({ defaultChecked: true }, 'On')),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Ajuste inmediato',
              description: 'Usa Switch para un ajuste que se aplica al alternarlo.',
              preview: simple({ defaultChecked: true }, 'Recibir avisos'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Confirmación de formulario',
              description: 'No uses Switch para aceptar algo que se envía después.',
              preview: simple({}, 'Aceptar términos'),
            },
          ],
        },
      ],
    },
  ],
};
