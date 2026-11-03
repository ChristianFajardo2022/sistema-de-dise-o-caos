import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { CodeInput } from './CodeInput';

/*
 * Contenido de la página de documentación de CodeInput (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`CodeInput.types.ts`, `CodeInput.variants.ts`, `CodeInput.tsx`), luego `CodeInput.docs.json`. Medidas: casillas de
 * 56 de alto (32 con `size="32"`), gap de 8 entre casillas y con el mensaje, radio de 12, trazo interior de 1 px,
 * texto de 14/18 centrado; ancho de 320 por defecto, repartido a partes iguales entre las casillas.
 * Diferencias con Figma: Figma no dibuja el label en Type=Code (el código lo pinta encima o lo deja solo para lectores
 * con `hideLabel`); Figma llama Success a lo que la casilla (DigitInput) llama Confirmation; Figma no tiene Hover ni
 * dibuja foco de teclado en Error y Success; el código suma un anillo de 2 px. El set `login/code-otp` es una pantalla
 * de inicio de sesión que usa este campo, no otro componente.
 */

// Figma: 7856:1485 (component set General input, Type=Code)

type CodeInputProps = Partial<ComponentProps<typeof CodeInput>>;

/** CodeInput de ejemplo: label y valores reales, sin el nombre del componente como texto. */
const code = (props: CodeInputProps = {}) => <CodeInput label="Código de verificación" {...props} />;

/** Pila de campos de ejemplo. */
const stack = (...items: ReactNode[]) => (
  <div className="flex w-full flex-col items-center gap-ds-space-general-xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

const CODE = '482916';
const HELP = 'Escribe los 6 dígitos que enviamos por SMS';

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Casillas vacías con el borde neutro de formulario.',
    samples: [code()],
  },
  {
    label: 'Filled',
    tone: 'neutral',
    description: (
      <>
        Con dígitos. Se ve igual que Default: cambia el contenido, no el aspecto. Sale del valor; <code>state</code> solo lo fuerza.
      </>
    ),
    samples: [code({ state: 'filled', defaultValue: CODE })],
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: 'Con foco. El borde pasa al color activo. En uso solo lo lleva la casilla enfocada; aquí se fuerza en todas.',
    samples: [code({ state: 'active', defaultValue: '4' })],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Valor atenuado: se recorre con las flechas, pero no se edita. En oscuro el fondo se funde con la superficie.
      </>
    ),
    samples: [code({ readOnly: true, defaultValue: CODE })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        No editable ni enfocable (<code>disabled</code>). Borde, label y valor atenuados.
      </>
    ),
    samples: [code({ disabled: true, defaultValue: CODE })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>errorText</code>. Borde rojo en todas las casillas, <code>aria-invalid</code> y el mensaje debajo. Gana sobre éxito y ayuda.
      </>
    ),
    samples: [code({ defaultValue: CODE, errorText: 'El código venció. Pide uno nuevo' })],
  },
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Con <code>successText</code> o <code>confirmed</code>. Borde verde en todas las casillas y, si hay texto, el mensaje debajo.
      </>
    ),
    samples: [code({ defaultValue: CODE, successText: 'Código verificado' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'CodeInput',
  icon: 'security-safe',
  classification: 'molecula',
  summary:
    'El CodeInput es la molécula para escribir un código de verificación de un solo uso. Une una casilla por dígito (DigitInput), un label y un mensaje de ayuda, éxito o error. El foco avanza solo y se puede pegar el código entero.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un label, una fila de casillas de un dígito y un mensaje debajo. Un ícono de información opcional va a la derecha de las casillas.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Casillas, tooltip y ayuda',
                  preview: code({
                    label: 'Código de verificación',
                    defaultValue: '4829',
                    tooltip: 'Llega en un mensaje de texto',
                    helperText: HELP,
                  }),
                  marks: [
                    { n: 1, selector: 'label', side: 'left' },
                    { n: 2, selector: '[role="group"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Placeholder"]', index: 3, side: 'top' },
                    { n: 4, selector: 'button[aria-label="Llega en un mensaje de texto"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Helper text"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Placeholder"]', index: 5 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Label:</strong> nombra el grupo y es su nombre accesible. Va encima de las casillas, en 14/18 (<code>text/field/label</code>). <code>hideLabel</code> lo deja solo para lectores de pantalla y <code>optional</code> suma &quot; | Opcional&quot;.
                </>,
                <>
                  <strong>Fila de casillas:</strong> un <code>role=&quot;group&quot;</code> con 6 casillas por defecto (<code>length</code>), separadas por 8 (<code>space/general/lg</code>). Repartida a partes iguales en 320 de ancho, o en el 100% con <code>fullWidth</code>.
                </>,
                <>
                  <strong>Casilla:</strong> un <code>&lt;input&gt;</code> de un dígito, de 56 de alto, radio de 12 (<code>radius/field/sm</code>) y trazo interior de 1 px. El dígito va centrado, en 14/18. Cada una se llama &quot;Dígito N de M&quot;.
                </>,
                <>
                  <strong>Tooltip:</strong> ícono de información de 16 px fuera de las casillas, a 8 de la última (<code>tooltip</code>). Abre el texto con clic, toque, Enter o Espacio.
                </>,
                <>
                  <strong>Mensaje:</strong> debajo de las casillas, a 8 de distancia. Es ayuda, éxito o error, y se anuncia en una región viva.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños de casilla',
                  preview: (
                    <div className="flex w-full flex-col items-center gap-ds-primitives-space-6xl">
                      {code({ label: 'Código Size 56', length: 4, size: '56', defaultValue: '48' })}
                      {code({ label: 'Código Size 32', length: 4, size: '32', defaultValue: '48' })}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Placeholder"]', index: 3, side: 'top' },
                    { n: 2, selector: '[data-figma-part="Placeholder"]', index: 7, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Placeholder"]', index: 3 },
                    { kind: 'height', selector: '[data-figma-part="Placeholder"]', index: 7 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Size 56:</strong> el tamaño de Figma y el predeterminado. Casilla de 56 de alto.
                </>,
                <>
                  <strong>Size 32:</strong> <code>size=&quot;32&quot;</code>. Casilla de 32 de alto, para espacios reducidos. Figma lo define en el átomo DigitInput, no en Type=Code.
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
          CodeInput tiene 7 estados. Filled y Active/Focus se fuerzan con <code>state</code> solo para documentar; en uso salen del valor y del foco. No tiene Hover: el borde solo cambia con el foco.
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
              title: 'Default',
              preview: code({ optional: true }),
              entries: [
                { part: 'Label', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Borde de la casilla', color: 'border-field-default' },
                { part: 'Dígito y placeholder', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: '| Opcional', color: 'text-acent-firts' },
                { part: 'Borde (aparece en Active/Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Error',
              preview: code({ defaultValue: CODE, errorText: 'El código venció. Pide uno nuevo' }),
              entries: [
                { part: 'Borde de la casilla', color: 'border-semantic-error' },
                { part: 'Mensaje', color: 'text-semantic-error-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-error-firts' },
                { part: 'Anillo de foco de teclado', color: 'border-field-active' },
              ],
            },
            {
              title: 'Success',
              preview: code({ defaultValue: CODE, successText: 'Código verificado' }),
              entries: [
                { part: 'Borde de la casilla', color: 'border-semantic-success' },
                { part: 'Mensaje', color: 'text-semantic-success-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-success-secondary' },
                { part: 'Anillo de foco de teclado', color: 'border-field-active' },
              ],
            },
            {
              title: 'Burnt-In',
              preview: code({ readOnly: true, defaultValue: CODE }),
              entries: [
                { part: 'Fondo de la casilla', color: 'background-field-burnt-in' },
                { part: 'Borde de la casilla', color: 'border-field-default' },
                { part: 'Dígito', color: 'text-field-disabled-negative' },
              ],
            },
            {
              title: 'Disabled',
              preview: code({ disabled: true, defaultValue: CODE }),
              entries: [
                { part: 'Label', color: 'text-field-disabled-negative' },
                { part: 'Borde de la casilla', color: 'border-field-disabled' },
                { part: 'Dígito', color: 'text-field-disabled-positive' },
              ],
            },
            {
              title: 'Mensaje de ayuda (helperText)',
              preview: code({ defaultValue: CODE, helperText: HELP }),
              entries: [
                { part: 'Borde de la casilla', color: 'border-field-default' },
                { part: 'Mensaje', color: 'text-semantic-information-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-information-secondary' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente CodeInput en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como General input en la librería de Assets, elige <strong>Type=Code</strong> y arrástralo al lienzo. Sus propiedades son Type y State; el mensaje se edita como texto de la instancia. Cada casilla es una instancia de Input number.
            </>,
            <>
              <strong>Type:</strong> Code es el CodeInput (6 casillas). Text, Password, Search, Search header, Coment, Dropdown, Multiple, Number y Time picker viven en el mismo set, pero en código son otros componentes. El set <strong>code-otp</strong> es una pantalla de inicio de sesión que usa este campo, no otro componente.
            </>,
            <>
              <strong>State:</strong> Default, Filled, Active/Focus, Burnt-In, Disabled, Error, Success y Helper text. Helper text es un valor de State en Figma, pero en código es un mensaje (<code>helperText</code>), no un estado. El resto sale del uso: <code>readOnly</code> da Burnt-In, <code>errorText</code> Error y <code>successText</code> (o <code>confirmed</code>) Success. <code>state</code> solo fuerza Filled y Active/Focus.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja el label en Type=Code; el código lo pinta encima o lo deja oculto con <code>hideLabel</code>. Figma no dibuja el foco de teclado en Error y Success; el código suma un anillo de 2 px. Figma no define Size 32 en este set.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el CodeInput es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Código de un solo uso:</strong> verificación por SMS o correo, con 4 a 8 dígitos. El foco avanza solo a la siguiente casilla.
            </>,
            <>
              <strong>Código recibido:</strong> pega el código entero en cualquier casilla y se reparte; las letras y los espacios se descartan. En móvil, la primera casilla acepta el autocompletado del sistema (<code>one-time-code</code>).
            </>,
            <>
              <strong>Teclado:</strong> Retroceso borra y vuelve a la casilla anterior, Suprimir borra sin moverse, y las flechas, Inicio y Fin recorren las casillas. Tab entra en la primera casilla libre y sale con el siguiente Tab.
            </>,
            <>
              <strong>Validar al completar:</strong> <code>onComplete</code> se llama una vez al llenar todas las casillas; <code>errorText</code> pone <code>aria-invalid</code> y se enlaza con <code>aria-describedby</code>.
            </>,
            <>
              <strong>Dentro de un formulario:</strong> con <code>name</code> el código viaja como un solo valor. Con <code>value</code> y <code>onValueChange</code> lo controlas desde afuera.
            </>,
          ],
          avoid: [
            <>
              <strong>Un solo dígito:</strong> una casilla suelta, como una cantidad pequeña. (Alternativa: <code>DigitInput</code>).
            </>,
            <>
              <strong>Códigos con letras:</strong> el CodeInput solo acepta dígitos. (Alternativa: <code>Input</code>).
            </>,
            <>
              <strong>Números con formato:</strong> un celular con prefijo de país. (Alternativa: <code>PhoneInput</code>).
            </>,
            <>
              <strong>Cantidades:</strong> sumar o restar unidades. (Alternativa: <code>NumberPicker</code>).
            </>,
            <>
              <strong>Más de 8 casillas:</strong> cada una queda muy angosta, sobre todo en móvil. (Alternativa: <code>Input</code>).
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
                title: 'Ancho por defecto',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Casillas:</strong> 56 de alto con radio de 12, y 8 entre ellas. Reparten a partes iguales los 320 de ancho.
                  </>,
                ],
                preview: code({ length: 4, defaultValue: '4829' }),
              },
              {
                title: 'Ancho completo',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> con <code>fullWidth</code> ocupa el 100% del contenedor en los tres breakpoints.
                  </>,
                  <>
                    <strong>Casillas:</strong> crecen con el ancho y conservan los 56 de alto.
                  </>,
                ],
                preview: code({ length: 4, fullWidth: true, defaultValue: '4829' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Casillas:</strong> 56 de alto, 8 entre ellas, y dígito en 14/18.
              </>,
              <>
                <strong>Ancho:</strong> 320 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: stack(code({ length: 4, defaultValue: '4829' })),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Casillas:</strong> 56 de alto, 8 entre ellas, y dígito en 14/18.
              </>,
              <>
                <strong>Ancho:</strong> 320 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: stack(code({ length: 4, defaultValue: '4829' })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de mensajes de error, de ayuda y de placeholder del CodeInput.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Error con mensaje',
              description: 'Explica qué corregir: así lo entiende también quien no distingue el rojo.',
              preview: code({ length: 4, defaultValue: '4829', errorText: 'El código venció. Pide uno nuevo' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error solo en rojo',
              description: 'Sin mensaje no hay texto que leer, y un lector de pantalla no tiene qué anunciar.',
              preview: code({ length: 4, defaultValue: '4829', state: 'error' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Ayuda que coincide',
              description: 'Cuenta los dígitos que hay: así se sabe cuántos escribir.',
              preview: code({ length: 4, helperText: 'Escribe los 4 dígitos' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ayuda que no coincide',
              description: 'Una ayuda que contradice las casillas confunde y provoca intentos fallidos.',
              preview: code({ length: 4, helperText: 'Escribe los 6 dígitos' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Placeholder de un dígito',
              description: 'Usa un solo carácter, como 0, para marcar cada casilla.',
              preview: code({ length: 4, placeholder: '0' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Placeholder como instrucción',
              description: 'Una frase no cabe en una casilla de un dígito y se recorta.',
              preview: code({ length: 4, placeholder: 'Código' }),
            },
          ],
        },
      ],
    },
  ],
};
