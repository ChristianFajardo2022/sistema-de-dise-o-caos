import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { DigitInput } from './DigitInput';

/*
 * Contenido de la página de documentación de DigitInput (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`DigitInput.types.ts`, `DigitInput.variants.ts`, `DigitInput.tsx`), luego `DigitInput.docs.json`. Medidas: Size 56
 * mide 37 × 56 y Size 32 mide 40 × 32, padding de 12 a los lados, radio de 12, trazo interior de 1 px y valor de 14/18
 * centrado. Diferencias con Figma: Figma no tiene Hover ni dibuja el foco de teclado; el código suma un outline de 2 px.
 * Default y Filled se ven igual en Figma y en el código. El padding vertical es 4 en Mobile y 8 desde Tablet (coincide con Figma en Tablet y Desktop); con alto fijo no se nota.
 */

// Figma: 12070:15078 (component set Input number)

type DigitProps = Partial<ComponentProps<typeof DigitInput>>;

/** Casilla de ejemplo con nombre accesible. */
const digit = (props: DigitProps = {}) => <DigitInput aria-label="Dígito 1 de 6" {...props} />;

/** Fila de casillas de ejemplo. */
const row = (...items: ReactNode[]) => (
  <div className="flex items-center justify-center gap-ds-space-general-lg">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Una casilla en cada tamaño, forzada a un estado. */
const both = (props: DigitProps = {}) =>
  row(digit({ size: '56', ...props }), digit({ size: '32', ...props }));

/** Grupo de tres casillas con valor, como parte de un código. */
const group = (props: DigitProps[] = [{}, {}, {}]) =>
  row(
    ...props.map((p, i) =>
      digit({ defaultValue: String(i + 4), 'aria-label': `Dígito ${i + 1} de 3`, ...p })
    )
  );

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Casilla vacía con el borde neutro de formulario.',
    samples: [both()],
  },
  {
    label: 'Filled',
    tone: 'neutral',
    description: (
      <>
        Con valor. Se ve igual que Default: solo cambia que hay un dígito. Sale del texto escrito; <code>state</code> solo lo fuerza.
      </>
    ),
    samples: [both({ state: 'filled', defaultValue: '7' })],
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: (
      <>
        Con foco. El borde pasa al color activo. Sale del foco real; <code>state</code> solo lo fuerza.
      </>
    ),
    samples: [both({ state: 'active', defaultValue: '7' })],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Relleno y dígito atenuados; se puede enfocar y copiar. En oscuro el fondo se funde con la superficie.
      </>
    ),
    samples: [both({ readOnly: true, defaultValue: '7' })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        No editable ni enfocable (<code>disabled</code>). El dígito se atenúa y el cursor indica que no se puede usar.
      </>
    ),
    samples: [both({ disabled: true, defaultValue: '7' })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>invalid</code>. Contorno de error y <code>aria-invalid</code>. Gana sobre Confirmation.
      </>
    ),
    samples: [both({ invalid: true, defaultValue: '7' })],
  },
  {
    label: 'Confirmation',
    tone: 'success',
    description: (
      <>
        Con <code>confirmed</code>. Contorno de confirmación.
      </>
    ),
    samples: [both({ confirmed: true, defaultValue: '7' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'DigitInput',
  icon: 'edit',
  classification: 'atomo',
  summary:
    'El DigitInput es el átomo para escribir un solo dígito en una casilla de formulario. Es la pieza con la que se arma un código de verificación, una casilla por dígito. Tiene dos tamaños y siete estados.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una casilla con borde interior de 1 px y un valor centrado. No lleva label, íconos ni mensaje: el nombre accesible va en cada casilla.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Casilla de un dígito',
                  preview: digit({ defaultValue: '7' }),
                  marks: [
                    { n: 1, selector: 'input', side: 'bottom' },
                    { n: 2, selector: 'input', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'input', side: 'left' },
                    { kind: 'height', selector: 'input' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> es el <code>&lt;input&gt;</code> nativo. Mide 37 × 56 px, con padding de 12 a los lados (<code>space/field/md</code>), padding vertical de 4 en Mobile y 8 desde Tablet (<code>space/field/sm</code>), radio de 12 (<code>radius/field/sm</code>) y trazo interior de 1 px.
                </>,
                <>
                  <strong>Valor:</strong> un carácter centrado, en 14/18 (<code>typography/field/size/sm</code>). Sin valor, el espacio queda vacío.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños',
                  preview: (
                    <div className="flex items-end justify-center gap-ds-primitives-space-6xl">
                      {digit({ size: '56', defaultValue: '7' })}
                      {digit({ size: '32', defaultValue: '7' })}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: 'input', index: 0, side: 'top' },
                    { n: 2, selector: 'input', index: 1, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'input', index: 0 },
                    { kind: 'height', selector: 'input', index: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Size 56:</strong> 37 × 56 px. Es el tamaño por defecto.
                </>,
                <>
                  <strong>Size 32:</strong> 40 × 32 px, con el mismo padding, radio y tipografía.
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
          DigitInput tiene 7 estados. Filled y Active/Focus se fuerzan con <code>state</code> solo para documentar; en uso salen del valor y del foco. No tiene Hover: el borde solo cambia con el foco.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default y de los que cambian en cada estado. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Default y Filled',
              preview: digit({ defaultValue: '7' }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Valor', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: 'Borde (aparece en Active/Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Burnt-In',
              preview: digit({ readOnly: true, defaultValue: '7' }),
              entries: [
                { part: 'Fondo', color: 'background-field-burnt-in' },
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Valor', color: 'text-field-disabled-negative' },
              ],
            },
            {
              title: 'Disabled',
              preview: digit({ disabled: true, defaultValue: '7' }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Valor', color: 'text-field-disabled-positive' },
              ],
            },
            {
              title: 'Error',
              preview: digit({ invalid: true, defaultValue: '7' }),
              entries: [
                { part: 'Borde', color: 'border-semantic-error' },
                { part: 'Valor', color: 'text-field-placeholder' },
              ],
            },
            {
              title: 'Confirmation',
              preview: digit({ confirmed: true, defaultValue: '7' }),
              entries: [
                { part: 'Borde', color: 'border-semantic-success' },
                { part: 'Valor', color: 'text-field-placeholder' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente DigitInput en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Input number en la librería de Assets y arrástralo al lienzo. Sus propiedades son Size y State; el dígito se edita como texto de la instancia.
            </>,
            <>
              <strong>Size:</strong> 56 y 32 (<code>size=&quot;56&quot;</code> y <code>size=&quot;32&quot;</code>). El número es el alto de la casilla en px.
            </>,
            <>
              <strong>State:</strong> Default, Filled, Active/Focus, Burnt-In, Disabled, Error y Confirmation. En código Burnt-In sale de <code>readOnly</code>, Error de <code>invalid</code> y Confirmation de <code>confirmed</code>; <code>state</code> solo fuerza el aspecto.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja el foco de teclado; el código suma un outline de 2 px. El set de Figma Type Code, dentro de General input, corresponde a otro componente: <code>CodeInput</code>, que une varias casillas.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el DigitInput es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Una casilla por dígito:</strong> varias casillas juntas forman un código. Cada una acepta un carácter y descarta lo que no sea un dígito, también al pegar.
            </>,
            <>
              <strong>Primera casilla de un código SMS:</strong> <code>oneTimeCode</code> activa el autocompletado del sistema. Con varias casillas, solo la primera lo lleva.
            </>,
            <>
              <strong>Campo corto de varios caracteres:</strong> con <code>maxLength</code> o <code>placeholder</code> el ancho crece solo. Útil para un número de página.
            </>,
            <>
              <strong>Códigos alfanuméricos:</strong> con otro <code>inputMode</code> la casilla deja de filtrar dígitos. Ajusta también <code>pattern</code>.
            </>,
            <>
              <strong>Validar:</strong> <code>invalid</code> pone <code>aria-invalid</code> y el contorno de error; <code>confirmed</code> marca el éxito. El error gana.
            </>,
          ],
          avoid: [
            <>
              <strong>Código completo con avance automático:</strong> la casilla suelta no mueve el foco ni reparte lo pegado. (Alternativa: <code>CodeInput</code>).
            </>,
            <>
              <strong>Número de celular:</strong> necesita prefijo y formato. (Alternativa: <code>PhoneInput</code>).
            </>,
            <>
              <strong>Texto libre con label:</strong> la casilla no tiene label visible ni mensaje. (Alternativa: <code>Input</code>).
            </>,
            <>
              <strong>Cantidad que sube y baja:</strong> escribir un dígito no basta para ajustar valores. (Alternativa: <code>NumberPicker</code>).
            </>,
            <>
              <strong>Casilla sin nombre accesible:</strong> <code>aria-label</code> o <code>aria-labelledby</code> es obligatorio, por ejemplo &quot;Dígito 1 de 6&quot;.
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
                title: 'Size 56',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas:</strong> 37 × 56 px, con valor de 14/18 centrado.
                  </>,
                ],
                preview: digit({ size: '56', defaultValue: '7' }),
              },
              {
                title: 'Size 32',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medidas:</strong> 40 × 32 px, con valor de 14/18 centrado.
                  </>,
                ],
                preview: digit({ size: '32', defaultValue: '7' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas:</strong> 37 × 56 px en Size 56 y 40 × 32 px en Size 32.
              </>,
              <>
                <strong>Ancho:</strong> es fijo con un carácter. Si pones varias casillas en fila, cuida que quepan en el ancho disponible.
              </>,
            ],
            preview: both({ defaultValue: '7' }),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medidas:</strong> 37 × 56 px en Size 56 y 40 × 32 px en Size 32.
              </>,
              <>
                <strong>Ancho:</strong> es fijo con un carácter. Si pones varias casillas en fila, cuida que quepan en el ancho disponible.
              </>,
            ],
            preview: both({ defaultValue: '7' }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre accesible, error y tamaño del DigitInput en un grupo.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Nombre por casilla',
              description: 'Da a cada casilla su posición: "Dígito 1 de 3", "Dígito 2 de 3".',
              preview: group(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Mismo nombre',
              description: 'No repitas el mismo nombre en todas: el lector de pantalla no distingue cuál es cuál.',
              preview: group([{ 'aria-label': 'Dígito' }, { 'aria-label': 'Dígito' }, { 'aria-label': 'Dígito' }]),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error en todo el grupo',
              description: 'Marca el error en todas las casillas: el fallo es del código completo.',
              preview: group([{ invalid: true }, { invalid: true }, { invalid: true }]),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error en una casilla',
              description: 'No marques solo una casilla: parece que el resto está bien.',
              preview: group([{}, { invalid: true }, {}]),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Mismo tamaño',
              description: 'Usa un solo tamaño por grupo: así las casillas se leen como un conjunto.',
              preview: group([{ size: '56' }, { size: '56' }, { size: '56' }]),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tamaños mezclados',
              description: 'No mezcles tamaños en un grupo: se rompe el ritmo de la fila.',
              preview: group([{ size: '56' }, { size: '32' }, { size: '56' }]),
            },
          ],
        },
      ],
    },
  ],
};
