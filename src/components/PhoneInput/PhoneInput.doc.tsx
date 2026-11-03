import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { PhoneInput } from './PhoneInput';

/*
 * Contenido de la página de documentación de PhoneInput (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`PhoneInput.types.ts`, `PhoneInput.variants.ts`, `PhoneInput.tsx`), luego `PhoneInput.docs.json`. Medidas: dos campos
 * del Input (alto 56 en Desktop y Tablet y 48 en Mobile, padding 12 a los lados y 8 arriba y abajo, radio 16) separados
 * por 8; el del prefijo mide 83 como mínimo y el del número ocupa el resto; el mensaje va debajo, a 8; ancho 320 o 100%
 * con `fullWidth`.
 *
 * La lista de países se abre en la capa superior (`popover`) y no se puede medir ni recortar en un lienzo: ni la
 * anatomía ni los estados la dibujan; el borde de Active/Focus se fuerza con la variable `--input-border`.
 * Diferencias con Figma: Figma dibuja el prefijo sin elegir (su label dentro del campo) y el código elige el primer
 * país de la lista; Figma no tiene Hover; Helper text es un estado en Figma y en el código es `helperText`; el set de
 * Figma no deja leer sus propiedades (error "Component set has existing errors").
 */

// Figma: 7856:1485 (component set General input, Type=Number)

type PhoneProps = Partial<ComponentProps<typeof PhoneInput>>;

/** Número de ejemplo ficticio (sin indicativo). */
const NUMBER = '3000000000';

/** PhoneInput de ejemplo: label real y número ficticio, sin el nombre del componente como texto. */
const phone = (props: PhoneProps = {}) => <PhoneInput label="Celular" placeholder="300 000 0000" {...props} />;

/** Con el número escrito (el label sube). */
const filled = (props: PhoneProps = {}) => phone({ defaultValue: NUMBER, groupDigits: true, ...props });

/** Pila de muestras con clave (evita el aviso de React en modo dev). */
const stack = (...items: ReactNode[]) => (
  <div className="flex w-full flex-col items-center gap-ds-space-general-xl">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Borde de foco en los dos campos, sin abrir la lista (que va en la capa superior y no cabe en un lienzo). */
const focusBorder = (node: ReactNode) => <div className="[--input-border:var(--color-ds-border-field-active)]">{node}</div>;

/** En el marco del teléfono (unos 150 px) el control no cabe: a 390 se dibuja reducido para verlo completo. */
const fit = (node: ReactNode) => <div className="max-sm:w-[230px] max-sm:[zoom:0.6]">{node}</div>;

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Cada campo lleva su label dentro y el borde es el neutro de formulario.',
    samples: [fit(phone())],
  },
  {
    label: 'Filled',
    tone: 'neutral',
    description: (
      <>
        Con número. El label sube y el número queda debajo. Sale del texto escrito; <code>state</code> solo lo fuerza.
      </>
    ),
    samples: [fit(filled({ state: 'filled' }))],
  },
  {
    label: 'Active/Focus',
    tone: 'accent',
    description: (
      <>
        Con foco. El borde pasa al color activo y el placeholder se ve. Sale del foco real; <code>state=&quot;active&quot;</code> abre además la lista de países en la capa superior, y aquí se dibuja solo el borde.
      </>
    ),
    samples: [fit(focusBorder(phone({ state: 'filled', defaultValue: '' })))],
  },
  {
    label: 'Burnt-In',
    tone: 'neutral',
    description: (
      <>
        Solo lectura (<code>readOnly</code>). Valor atenuado, y se puede enfocar y copiar, pero el prefijo no abre la lista.
      </>
    ),
    samples: [fit(filled({ readOnly: true }))],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        No editable ni enfocable (<code>disabled</code>) y no se envía con el formulario. Bordes, labels y valores atenuados.
      </>
    ),
    samples: [fit(filled({ disabled: true }))],
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Con <code>errorText</code>. Bordes y labels en rojo, <code>aria-invalid</code> en el número y el mensaje debajo. Gana sobre éxito y ayuda.
      </>
    ),
    samples: [fit(phone({ defaultValue: '300', errorText: 'Escribe el número completo' }))],
  },
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Con <code>successText</code>. Bordes y labels en verde, y el mensaje debajo.
      </>
    ),
    samples: [fit(filled({ successText: 'Celular verificado' }))],
  },
];

export const doc: ComponentDocContent = {
  name: 'PhoneInput',
  icon: 'call',
  classification: 'composicion',
  summary:
    'El PhoneInput es la composición para pedir un teléfono con su indicativo en un formulario. Une un selector de país (Select) y un campo de número (Input) bajo un solo label y un solo mensaje, y devuelve los dígitos limpios o el número completo en formato internacional.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila con el campo del indicativo y el del número, y un solo mensaje debajo. Cada campo es el de Input.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Indicativo, número y ayuda',
                  preview: filled({ helperText: 'Sin el indicativo' }),
                  marks: [
                    { n: 1, selector: '[role="group"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Input"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Icon Right"]', index: 0, side: 'top' },
                    { n: 4, selector: '[data-slot="field"]', side: 'top' },
                    { n: 5, selector: '[data-figma-part="Label"]', index: -1, side: 'top' },
                    { n: 6, selector: '[data-figma-part="Helper text"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-slot="field"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Grupo:</strong> contenedor con <code>role=&quot;group&quot;</code> y el label del número como nombre. Mide 320 de ancho, o el 100% con <code>fullWidth</code>, y deja 8 entre la fila y el mensaje (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Campo del indicativo:</strong> es un Select de 83 de ancho como mínimo. Muestra solo el indicativo (+57), y su label, &quot;Indicativo&quot; por defecto, se cambia con <code>prefixLabel</code>.
                </>,
                <>
                  <strong>Chevron:</strong> de 16 px, a la derecha del campo del indicativo. Abre y cierra la lista de países.
                </>,
                <>
                  <strong>Campo del número:</strong> es un Input que ocupa el resto de la fila, a 8 del indicativo. Mide 56 de alto en Desktop y Tablet y 48 en Mobile, con padding de 12 a los lados (<code>space/field/md</code>) y de 8 arriba y abajo (<code>space/field/sm</code>), y radio de 16 (<code>radius/field/md</code>).
                </>,
                <>
                  <strong>Label del número:</strong> siempre visible. Vacío y sin foco va dentro del campo; con foco o número sube arriba, en 12/16. <code>optional</code> suma &quot; | Opcional&quot;.
                </>,
                <>
                  <strong>Mensaje:</strong> uno solo para los dos campos, debajo de la fila. Es ayuda, éxito o error, y ambos campos lo describen con <code>aria-describedby</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Opcional y tooltip',
                  preview: filled({ optional: true, tooltip: 'Incluye solo el número, sin indicativo' }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="| Opcional"]', index: -1, side: 'top' },
                    { n: 2, selector: 'button[aria-label="Incluye solo el número, sin indicativo"]', side: 'top' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-slot="field"]', to: 'button[aria-label="Incluye solo el número, sin indicativo"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>| Opcional:</strong> se suma al label de los dos campos con <code>optional</code>.
                </>,
                <>
                  <strong>Tooltip:</strong> ícono de información de 16 px fuera de la fila, a 8 de su borde derecho (<code>tooltip</code>). Abre el texto con clic, toque, Enter o Espacio.
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
          PhoneInput tiene 7 estados. Filled y Active/Focus se fuerzan con <code>state</code> solo para documentar; en uso salen del número y del foco. No tiene Hover: el borde solo cambia con el foco.
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
              preview: fit(phone({ optional: true })),
              entries: [
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Label dentro del campo', color: 'text-field-label', text: 'typography-field-size-sm' },
                { part: 'Label arriba (con número)', color: 'text-field-label-secondary', text: 'typography-field-size-xs' },
                { part: 'Número y placeholder', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
                { part: 'Chevron', color: 'icon-general-default' },
                { part: '| Opcional', color: 'text-acent-firts' },
                { part: 'Borde (aparece en Active/Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Error',
              preview: fit(phone({ defaultValue: '300', errorText: 'Escribe el número completo' })),
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
              preview: fit(filled({ successText: 'Celular verificado' })),
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
              preview: fit(filled({ readOnly: true })),
              entries: [
                { part: 'Fondo', color: 'background-field-burnt-in' },
                { part: 'Borde', color: 'border-field-default' },
                { part: 'Label arriba', color: 'text-field-label-secondary' },
                { part: 'Número', color: 'text-field-disabled-negative' },
                { part: 'Chevron', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'Disabled',
              preview: fit(filled({ disabled: true })),
              entries: [
                { part: 'Borde', color: 'border-field-disabled' },
                { part: 'Label y número', color: 'text-field-disabled-negative' },
                { part: 'Chevron', color: 'icon-general-disabled-positive' },
              ],
            },
            {
              title: 'Mensaje de ayuda (helperText)',
              preview: fit(filled({ helperText: 'Sin el indicativo' })),
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
      title: 'Uso del componente PhoneInput en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como General input en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type y State; los labels, el placeholder y el mensaje se editan como texto de la instancia.
            </>,
            <>
              <strong>Type:</strong> Number es el PhoneInput. El mismo set trae Text, Password, Search, Search header, Code, Coment, Dropdown, Multiple y Time picker, que en código son otros componentes (Input, CodeInput, Textarea, Select, TripleSelect y TimePicker).
            </>,
            <>
              <strong>State:</strong> Default, Filled, Active/Focus, Burnt-In, Disabled, Error, Success y Helper text. Helper text es un valor de State en Figma, pero en código es un mensaje (<code>helperText</code>), no un estado. El resto sale del uso: <code>readOnly</code> da Burnt-In, <code>errorText</code> Error y <code>successText</code> Success. <code>state</code> solo fuerza Filled y Active/Focus.
            </>,
            <>
              <strong>Diferencias:</strong> Figma dibuja el indicativo sin elegir, con su label dentro del campo, y en Active/Focus abre la lista con ítems de texto. El código elige el primer país de <code>countries</code> y la lista muestra el país con su indicativo (Colombia +57). El set de Figma tiene errores y no deja leer sus propiedades.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el PhoneInput es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Teléfono con país:</strong> celular o fijo de usuarios de varios países. El indicativo se elige en el selector y el número se escribe aparte.
            </>,
            <>
              <strong>Valor limpio:</strong> <code>onValueChange</code> devuelve solo dígitos, aunque el usuario escriba espacios o guiones. Con <code>name</code>, el formulario envía <code>+&lt;indicativo&gt;&lt;número&gt;</code>, o vacío sin número.
            </>,
            <>
              <strong>Número fácil de revisar:</strong> <code>groupDigits</code> muestra los dígitos agrupados (300 000 0000) y <code>maxDigits</code> limita el largo (15 por defecto).
            </>,
            <>
              <strong>Teclado:</strong> el prefijo es un combobox con flechas, Inicio, Fin, Enter y Esc, y escribir el nombre del país salta a él. Tab pasa del prefijo al número.
            </>,
            <>
              <strong>Validar con mensaje:</strong> <code>errorText</code> pone <code>aria-invalid</code>, y el mensaje es uno solo para los dos campos. El error gana sobre éxito y ayuda.
            </>,
          ],
          avoid: [
            <>
              <strong>Teléfono sin país:</strong> si todos los números son del mismo país, el selector sobra. (Alternativa: <code>Input</code> con <code>type=&quot;tel&quot;</code>).
            </>,
            <>
              <strong>Códigos de un solo uso:</strong> un dígito por casilla con avance automático. (Alternativa: <code>CodeInput</code>).
            </>,
            <>
              <strong>Elegir solo el país:</strong> sin número que escribir, basta una lista. (Alternativa: <code>Select</code>).
            </>,
            <>
              <strong>Validar el formato por país:</strong> el PhoneInput no revisa largo ni formato. Valida en el formulario y muestra el resultado con <code>errorText</code>.
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
                title: 'Campos',
                bullets: [
                  <>
                    <strong>Alto:</strong> 56 en los dos campos, con padding de 12 a los lados y de 8 arriba y abajo, y radio de 16.
                  </>,
                  <>
                    <strong>Texto:</strong> label de 12/16 arriba y número de 14/18, iguales en todos los breakpoints.
                  </>,
                ],
                preview: fit(filled()),
              },
              {
                title: 'Ancho',
                bullets: [
                  <>
                    <strong>Fila:</strong> el indicativo mide 83 como mínimo, a 8 del número, que ocupa el resto.
                  </>,
                  <>
                    <strong>Ancho:</strong> 320 por defecto; con <code>fullWidth</code> ocupa el 100% del contenedor.
                  </>,
                ],
                preview: fit(phone({ fullWidth: true })),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Alto:</strong> 48 en los dos campos y el padding vertical baja a 4.
              </>,
              <>
                <strong>Texto:</strong> no cambia, con label de 12/16 y número de 14/18.
              </>,
              <>
                <strong>Ancho:</strong> 320 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: fit(stack(filled(), phone({ fullWidth: true }))),
          },
          tablet: {
            bullets: [
              <>
                <strong>Alto:</strong> 56 en los dos campos, como en Desktop.
              </>,
              <>
                <strong>Texto:</strong> no cambia, con label de 12/16 y número de 14/18.
              </>,
              <>
                <strong>Ancho:</strong> 320 como máximo y nunca más que el contenedor; con <code>fullWidth</code> ocupa el 100%.
              </>,
            ],
            preview: fit(stack(filled(), phone({ fullWidth: true }))),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de label, mensajes de error y formato del número en el PhoneInput.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Label corto',
              description: 'Nombra el dato con un label corto.',
              preview: phone({ label: 'Celular' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Label largo',
              description: 'No escribas frases en el label: se trunca.',
              preview: phone({ label: 'Escribe aquí el número donde recibirás los avisos' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error con mensaje',
              description: 'Di en el mensaje qué se necesita: el color solo no basta.',
              preview: phone({ defaultValue: '300', errorText: 'Escribe el número completo' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error solo en rojo',
              description: 'No dejes el error solo en rojo: agrega el mensaje.',
              preview: phone({ defaultValue: '300', state: 'error' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Número agrupado',
              description: 'Agrupa los dígitos para revisarlos de un vistazo.',
              preview: phone({ defaultValue: NUMBER, groupDigits: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Dígitos seguidos',
              description: 'No muestres el número seguido: cuesta encontrar un error.',
              preview: phone({ defaultValue: NUMBER }),
            },
          ],
        },
      ],
    },
  ],
};
