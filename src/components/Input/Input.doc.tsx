import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Icon } from '../Icon';
import { Input } from './Input';

/*
 * Contenido de la página de documentación de Input (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Input.types.ts`, `Input.variants.ts`, `Input.tsx`), luego `Input.docs.json`. Medidas: alto 56 en Desktop y Tablet
 * y 48 en Mobile (Search header 48 en todos), padding 12 a los lados y 8 arriba y abajo (4 en Mobile), radio 16
 * (Search header 12), trazo interior de 1 px, gap de 8, ícono de 16 px, label flotante de 12/16 y valor de 14/18.
 * Diferencias con Figma: Figma no tiene Hover; el set trae Type=Search, State=Default dos veces; Figma no dibuja foco
 * de teclado en Error y Success, el código suma un anillo de 2 px.
 */

// Figma: set "General input" (Type Text, Coment, Search, Search header, Password, Code, Dropdown, Multiple, Number y Time picker × State)

type InputProps = Partial<ComponentProps<typeof Input>>;

/** Input de ejemplo: label y placeholder reales, sin el nombre del componente como texto. */
const input = (props: InputProps = {}) => <Input label="Correo" placeholder="ana@ejemplo.com" {...props} />;

/** Pila de campos de ejemplo. */
const stack = (...items: ReactNode[]) => (
  <div className="flex w-full flex-col items-center gap-ds-space-general-xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

const MAIL = 'ana@ejemplo.com';

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. El label va dentro del campo y el borde es el neutro de formulario.',
    samples: [input()],
  },
  {
    label: 'Filled',
    tone: 'neutral',
    description: (
      <>
        Con valor. El label sube y el valor queda debajo. Sale del texto escrito; <code>state</code> solo lo fuerza.
      </>
    ),
    samples: [input({ state: 'filled', defaultValue: MAIL })],
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: 'Con foco. El borde pasa al color activo y el placeholder se ve. Sale del foco real.',
    samples: [input({ state: 'active' })],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Valor atenuado, y se puede enfocar y copiar. En oscuro el fondo se funde con la superficie.
      </>
    ),
    samples: [input({ readOnly: true, defaultValue: MAIL })],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        No editable ni enfocable (<code>disabled</code>). Borde, label y valor atenuados.
      </>
    ),
    samples: [input({ disabled: true })],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>errorText</code>. Borde y label en rojo, <code>aria-invalid</code> y el mensaje debajo. Gana sobre éxito y ayuda.
      </>
    ),
    samples: [input({ defaultValue: 'ana@', errorText: 'Escribe un correo válido' })],
  },
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Con <code>successText</code>. Borde y label en verde, y el mensaje debajo.
      </>
    ),
    samples: [input({ defaultValue: MAIL, successText: 'Correo válido' })],
  },
];

export const doc: ComponentDocContent = {
  name: 'Input',
  icon: 'edit',
  classification: 'molecula',
  summary:
    'El Input es la molécula para escribir una línea de texto en un formulario: un nombre, un correo, una contraseña o una búsqueda. Une un recuadro con label flotante, íconos opcionales y un mensaje de ayuda, éxito o error. Es la base visual de los demás campos.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un recuadro con el label flotante y el valor apilados, íconos de 16 px a los lados y un mensaje debajo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Text con íconos y ayuda',
                  preview: input({
                    label: 'Usuario',
                    state: 'filled',
                    defaultValue: 'ana.perez',
                    leftIcon: <Icon name="user" size={16} variant="line" />,
                    rightIcon: <Icon name="tick-circle" size={16} variant="line" />,
                    helperText: 'Usa letras y números',
                  }),
                  marks: [
                    { n: 1, selector: '[data-slot="field"]', side: 'left' },
                    { n: 2, selector: '[data-slot="icon-left"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Label"]', side: 'top' },
                    { n: 4, selector: 'input', side: 'bottom' },
                    { n: 5, selector: '[data-slot="icon-right"]', side: 'top' },
                    { n: 6, selector: '[data-figma-part="Helper text"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="field"]', side: 'left' },
                    { kind: 'padding', selector: '[data-slot="field"]', side: 'top' },
                    { kind: 'height', selector: '[data-slot="field"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 56 de alto en Desktop y Tablet y 48 en Mobile. Padding de 12 a los lados (<code>space/field/md</code>) y de 8 arriba y abajo (<code>space/field/sm</code>), radio de 16 (<code>radius/field/md</code>) y trazo interior de 1 px. Entre las partes hay 8 (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Ícono izquierdo:</strong> opcional (<code>leftIcon</code>), de 16 px y decorativo. Search y Search header traen la lupa por defecto.
                </>,
                <>
                  <strong>Label:</strong> siempre visible y asociado al campo. Vacío y sin foco va dentro del campo; con foco o valor sube arriba, en 12/16. <code>optional</code> suma &quot; | Opcional&quot;.
                </>,
                <>
                  <strong>Valor:</strong> es el <code>&lt;input&gt;</code> nativo, en 14/18, debajo del label.
                </>,
                <>
                  <strong>Ícono derecho:</strong> opcional (<code>rightIcon</code>), de 16 px y decorativo.
                </>,
                <>
                  <strong>Mensaje:</strong> debajo del campo, a 8 de distancia. Es ayuda, éxito o error, y se anuncia en una región viva.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Password y tooltip',
                  preview: input({
                    variant: 'password',
                    label: 'Contraseña',
                    state: 'filled',
                    defaultValue: 'secreto123',
                    tooltip: 'Usa 8 caracteres o más',
                  }),
                  marks: [
                    { n: 1, selector: 'input', side: 'bottom' },
                    { n: 2, selector: 'button[aria-pressed]', side: 'top' },
                    { n: 3, selector: 'button[aria-label="Usa 8 caracteres o más"]', side: 'top' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-slot="field"]', to: 'button[aria-label="Usa 8 caracteres o más"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Valor oculto:</strong> en Password el <code>&lt;input&gt;</code> es de tipo contraseña y muestra puntos.
                </>,
                <>
                  <strong>Botón de mostrar u ocultar:</strong> 16 px dentro del campo, a la derecha. Cambia su nombre entre &quot;Mostrar contraseña&quot; y &quot;Ocultar contraseña&quot; y expone <code>aria-pressed</code>.
                </>,
                <>
                  <strong>Tooltip:</strong> ícono de información de 16 px fuera del campo, a 8 de su borde derecho (<code>tooltip</code>). Abre el texto con clic, toque, Enter o Espacio.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Search y Search header',
                  preview: (
                    <div className="flex w-full flex-col items-center gap-ds-primitives-space-6xl">
                      {input({ variant: 'search', label: 'Buscar' })}
                      {input({ variant: 'search-header', label: 'Buscar' })}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-slot="field"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-slot="icon-left"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-slot="field"]', index: 1, side: 'left' },
                    { n: 4, selector: '[data-slot="icon-left"]', index: 1, side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-slot="field"]', index: 0 },
                    { kind: 'height', selector: '[data-slot="field"]', index: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Search:</strong> el mismo contenedor de Text: 56 de alto en Desktop y Tablet y 48 en Mobile, radio de 16.
                </>,
                <>
                  <strong>Lupa:</strong> 16 px, a la izquierda y decorativa. Se reemplaza con <code>leftIcon</code>.
                </>,
                <>
                  <strong>Search header:</strong> 48 de alto en todos los breakpoints y radio de 12 (<code>radius/field/sm</code>).
                </>,
                <>
                  <strong>Lupa de Search header:</strong> igual que la de Search, de 16 px.
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
          Input tiene 7 estados. Filled y Active/Focus se fuerzan con <code>state</code> solo para documentar; en uso salen del valor y del foco. No tiene Hover: el borde solo cambia con el foco.
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
              preview: input({ optional: true }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Label dentro del campo', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Label arriba (con valor)', color: 'text-field-label-secondary', text: 'typography-field-size-xs' },
                { part: 'Valor y placeholder', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: '| Opcional', color: 'text-acent-firts' },
                { part: 'Borde (aparece en Active/Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Error',
              preview: input({ defaultValue: 'ana@', errorText: 'Escribe un correo válido' }),
              entries: [
                { part: 'Borde', color: 'border-semantic-error' },
                { part: 'Label arriba', color: 'text-semantic-error-secondary' },
                { part: 'Mensaje', color: 'text-semantic-error-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-error-firts' },
                { part: 'Anillo de foco de teclado', color: 'border-field-active' },
              ],
            },
            {
              title: 'Success',
              preview: input({ defaultValue: MAIL, successText: 'Correo válido' }),
              entries: [
                { part: 'Borde', color: 'border-semantic-success' },
                { part: 'Label arriba', color: 'text-semantic-success-secondary' },
                { part: 'Mensaje', color: 'text-semantic-success-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-success-secondary' },
                { part: 'Anillo de foco de teclado', color: 'border-field-active' },
              ],
            },
            {
              title: 'Burnt-In',
              preview: input({ readOnly: true, defaultValue: MAIL }),
              entries: [
                { part: 'Fondo', color: 'background-field-burnt-in' },
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Label arriba', color: 'text-field-label-secondary' },
                { part: 'Valor', color: 'text-field-disabled-negative' },
                { part: 'Ícono', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'Disabled',
              preview: input({ disabled: true }),
              entries: [
                { part: 'Borde', color: 'border-field-disabled' },
                { part: 'Label y valor', color: 'text-field-disabled-negative' },
                { part: 'Ícono', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'Mensaje de ayuda (helperText)',
              preview: input({ defaultValue: MAIL, helperText: 'Usa el correo de tu cuenta' }),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Mensaje', color: 'text-semantic-information-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono del mensaje', color: 'icon-semantic-information-secondary' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Input en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como General input en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type y State; el label, el placeholder y el mensaje se editan como texto de la instancia.
            </>,
            <>
              <strong>Type:</strong> Text, Password, Search y Search header son el Input (<code>variant</code> con <code>text</code>, <code>password</code>, <code>search</code> y <code>search-header</code>). Code, Coment, Dropdown, Multiple, Number y Time picker viven en el mismo set, pero en código son otros componentes (CodeInput, Textarea, Select, TripleSelect, PhoneInput y TimePicker).
            </>,
            <>
              <strong>State:</strong> Default, Filled, Active/Focus, Burnt-In, Disabled, Error, Success y Helper text. Helper text es un valor de State en Figma, pero en código es un mensaje (<code>helperText</code>), no un estado. El resto sale del uso: <code>readOnly</code> da Burnt-In, <code>errorText</code> Error y <code>successText</code> Success. <code>state</code> solo fuerza Filled y Active/Focus.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no dibuja el foco de teclado en Error y Success; el código suma un anillo de 2 px. El set trae Search con Default dos veces; el código tiene un solo Default.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Input es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Dato corto de una línea:</strong> nombre, correo, usuario o celular. Para Text pasa el <code>type</code> nativo (<code>email</code>, <code>tel</code>, <code>url</code>) y el teclado móvil se ajusta.
            </>,
            <>
              <strong>Contraseña:</strong> Password, con el botón para mostrar u ocultar el valor y alcanzable con teclado.
            </>,
            <>
              <strong>Buscar dentro de una pantalla:</strong> Search en el contenido y Search header en el encabezado, que mide 48.
            </>,
            <>
              <strong>Validar con mensaje:</strong> <code>errorText</code> pone <code>aria-invalid</code> y se enlaza con <code>aria-describedby</code>; el error gana sobre éxito y ayuda.
            </>,
            <>
              <strong>Campo no obligatorio o con ayuda extra:</strong> <code>optional</code> suma &quot; | Opcional&quot; y <code>tooltip</code> agrega un texto de apoyo fuera del campo.
            </>,
          ],
          avoid: [
            <>
              <strong>Texto de varias líneas:</strong> comentarios o descripciones largas. (Alternativa: <code>Textarea</code>).
            </>,
            <>
              <strong>Elegir entre opciones:</strong> escribir libre invita a errores. (Alternativa: <code>Select</code>).
            </>,
            <>
              <strong>Códigos de un solo uso:</strong> un dígito por casilla con avance automático. (Alternativa: <code>CodeInput</code>).
            </>,
            <>
              <strong>Celular con prefijo de país:</strong> el Input no separa el prefijo. (Alternativa: <code>PhoneInput</code>).
            </>,
            <>
              <strong>Campo sin label:</strong> el label es obligatorio y el placeholder no lo reemplaza, porque desaparece al escribir.
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
                title: 'Text, Password y Search',
                bullets: [
                  <>
                    <strong>Alto:</strong> 56, con padding de 12 a los lados y de 8 arriba y abajo, y radio de 16.
                  </>,
                  <>
                    <strong>Texto:</strong> label de 12/16 arriba y valor de 14/18, iguales en todos los breakpoints.
                  </>,
                ],
                preview: stack(input({ defaultValue: MAIL, state: 'filled' }), input({ variant: 'search', label: 'Buscar' })),
              },
              {
                title: 'Search header',
                bullets: [
                  <>
                    <strong>Alto:</strong> 48 y radio de 12 en todos los breakpoints.
                  </>,
                  <>
                    <strong>Ancho:</strong> 320 por defecto; con <code>fullWidth</code> ocupa el 100% del contenedor.
                  </>,
                ],
                preview: input({ variant: 'search-header', label: 'Buscar' }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Alto:</strong> 48 en Text, Password y Search, y el padding vertical baja a 4. Search header sigue en 48.
              </>,
              <>
                <strong>Texto:</strong> no cambia, con label de 12/16 y valor de 14/18.
              </>,
              <>
                <strong>Ancho:</strong> 320 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: stack(input({ defaultValue: MAIL, state: 'filled' }), input({ variant: 'search-header', label: 'Buscar' })),
          },
          tablet: {
            bullets: [
              <>
                <strong>Alto:</strong> 56 en Text, Password y Search, y 48 en Search header, como en Desktop.
              </>,
              <>
                <strong>Texto:</strong> no cambia, con label de 12/16 y valor de 14/18.
              </>,
              <>
                <strong>Ancho:</strong> 320 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: stack(input({ defaultValue: MAIL, state: 'filled' }), input({ variant: 'search-header', label: 'Buscar' })),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de placeholder, mensajes de error y label del Input.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Placeholder con ejemplo',
              description: 'Usa el placeholder para mostrar un ejemplo real del dato.',
              preview: input({ state: 'active', placeholder: 'ana@ejemplo.com' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Placeholder como instrucción',
              description: 'No uses el placeholder para dar instrucciones: desaparece al escribir.',
              preview: input({ state: 'active', placeholder: 'Escribe tu correo' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error con mensaje',
              description: 'Di en el mensaje qué se necesita: el color solo no basta.',
              preview: input({ defaultValue: 'ana@', errorText: 'Escribe un correo válido' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error solo en rojo',
              description: 'No dejes el error solo en rojo: agrega el mensaje.',
              preview: input({ defaultValue: 'ana@', state: 'error' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Label corto',
              description: 'Nombra el dato con un label corto.',
              preview: input({ label: 'Celular', placeholder: '300 123 4567', type: 'tel' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Label largo',
              description: 'No escribas frases en el label: se trunca.',
              preview: input({ label: 'Escribe aquí el número de celular donde recibirás los avisos', placeholder: '300 123 4567', type: 'tel' }),
            },
          ],
        },
      ],
    },
  ],
};
