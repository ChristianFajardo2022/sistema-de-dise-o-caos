import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { NotificationText } from './NotificationText';

/*
 * Contenido de la página de documentación de NotificationText (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el
 * código (`NotificationText.types.ts`, `NotificationText.variants.ts`, `NotificationText.tsx`), luego
 * `NotificationText.docs.json`. Medidas: fila de 18 de alto, ícono de 14, gap de 8, texto de 14/18 en Semibold y ancho
 * del 100% del contenedor, iguales en Desktop, Tablet y Mobile.
 * Diferencias con Figma: Figma llama a la prop State y a sus valores Error, Helper text, Confirmation e Information; el
 * código usa `error`, `helper`, `confirmation` e `information`. Figma no trae el rol de lector de pantalla; el código
 * añade `role="alert"` y `role="status"`.
 */

// Figma: 7851:2638 (component set Notification text)

type MessageProps = Partial<ComponentProps<typeof NotificationText>>;

/** Mensaje de ejemplo. Sin anuncio: las muestras son ilustraciones y no deben avisar a un lector de pantalla. */
const msg = (props: MessageProps = {}, text: ReactNode = 'Usa el correo de tu cuenta') => (
  <NotificationText announce={false} {...props}>
    {text}
  </NotificationText>
);

const ERROR_TEXT = 'Escribe un correo válido';
const OK_TEXT = 'Correo verificado';
const INFO_TEXT = 'Tu perfil es visible para el equipo';

const states: DocStateItem[] = [
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Algo falló y hay que corregirlo. Ícono de cierre en rojo y texto en rojo. Con <code>role=&quot;alert&quot;</code>.
      </>
    ),
    samples: [msg({ state: 'error' }, ERROR_TEXT)],
  },
  {
    label: 'Helper text',
    tone: 'neutral',
    description: (
      <>
        Ayuda para llenar el campo. Es el valor por defecto (<code>helper</code>), en cian y sin rol.
      </>
    ),
    samples: [msg({ state: 'helper' })],
  },
  {
    label: 'Confirmation',
    tone: 'success',
    description: (
      <>
        El dato es correcto. Ícono de check en verde y texto en verde. Con <code>role=&quot;status&quot;</code>.
      </>
    ),
    samples: [msg({ state: 'confirmation' }, OK_TEXT)],
  },
  {
    label: 'Information',
    tone: 'neutral',
    description: 'Aviso general que no pide acción. Ícono y texto en el color de texto neutro, sin rol.',
    samples: [msg({ state: 'information' }, INFO_TEXT)],
  },
];

/** Los cuatro mensajes en una pila. */
const all = () => (
  <div className="flex w-full flex-col gap-ds-space-general-lg">
    {msg({ state: 'error' }, ERROR_TEXT)}
    {msg({ state: 'helper' })}
    {msg({ state: 'confirmation' }, OK_TEXT)}
    {msg({ state: 'information' }, INFO_TEXT)}
  </div>
);

export const doc: ComponentDocContent = {
  name: 'NotificationText',
  icon: 'info-circle',
  classification: 'molecula',
  summary:
    'El NotificationText es la molécula para dar un mensaje breve bajo un campo de formulario: una ayuda, un error, una confirmación o un aviso. Une un ícono de 14 px con una línea de texto y cambia de color según su tipo. Los campos de CAOS lo usan para pintar sus mensajes.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila con un ícono a la izquierda y el texto del mensaje a su derecha.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Mensaje con ícono y texto',
                  preview: msg({ state: 'helper', 'data-slot': 'message' } as MessageProps),
                  marks: [
                    { n: 1, selector: '[data-slot="message"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon Message"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Helper text"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Icon Message"]', to: '[data-figma-part="Helper text"]' },
                    { kind: 'height', selector: '[data-slot="message"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> fila de 18 de alto sin padding ni fondo, al 100% del ancho disponible. Entre el ícono y el texto hay 8 (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Ícono:</strong> 14 px, relleno y decorativo (<code>aria-hidden</code>). Cambia con el tipo: info-circle en Helper text, close-circle en Error y tick-circle en Confirmation e Information.
                </>,
                <>
                  <strong>Texto:</strong> es el mensaje (<code>children</code>), en Helvetica Neue Semibold de 14/18 (<code>typography/field/size/sm</code>). Lleva el significado completo, sin depender del ícono ni del color.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Los cuatro tipos',
                  preview: all(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Icon Message"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon Message"]', index: 2, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Helper text"]', index: 0, side: 'right' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Ícono de Error:</strong> close-circle en rojo. Helper text usa info-circle en cian.
                </>,
                <>
                  <strong>Ícono de Confirmation:</strong> tick-circle en verde. Information usa el mismo ícono en el color de texto neutro: solo el color los distingue.
                </>,
                <>
                  <strong>Texto:</strong> una sola línea corta. Si no cabe, pasa a la línea siguiente y el ícono queda centrado en vertical.
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
          NotificationText tiene 4 variantes de aspecto, que se eligen con <code>state</code>. No es interactivo: no tiene Hover, Focus ni Press, y su única reacción es el anuncio a lectores de pantalla.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada tipo. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Error',
              preview: msg({ state: 'error' }, ERROR_TEXT),
              entries: [
                { part: 'Texto', color: 'text-semantic-error-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono', color: 'icon-semantic-error-firts' },
              ],
            },
            {
              title: 'Helper text',
              preview: msg({ state: 'helper' }),
              entries: [
                { part: 'Texto', color: 'text-semantic-information-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono', color: 'icon-semantic-information-secondary' },
              ],
            },
            {
              title: 'Confirmation',
              preview: msg({ state: 'confirmation' }, OK_TEXT),
              entries: [
                { part: 'Texto', color: 'text-semantic-success-secondary', text: 'typography-field-size-sm' },
                { part: 'Ícono', color: 'icon-semantic-success-secondary' },
              ],
            },
            {
              title: 'Information',
              preview: msg({ state: 'information' }, INFO_TEXT),
              entries: [
                { part: 'Texto', color: 'text-neutral-white', text: 'typography-field-size-sm' },
                { part: 'Ícono', color: 'icon-general-default' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente NotificationText en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Notification text en la librería de Assets y arrástralo bajo el campo. Su única propiedad es State y el mensaje se edita como Text helper en la instancia.
            </>,
            <>
              <strong>State:</strong> Error, Helper text, Confirmation e Information son los valores de <code>state</code> (<code>error</code>, <code>helper</code>, <code>confirmation</code> e <code>information</code>). Figma los llama State, pero no son estados de interacción: son tipos de mensaje.
            </>,
            <>
              <strong>Text helper:</strong> es el contenido del mensaje y en código es <code>children</code>.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no define el anuncio a lectores de pantalla; el código suma <code>role=&quot;alert&quot;</code> en Error y <code>role=&quot;status&quot;</code> en Confirmation, y los apaga con <code>announce</code>.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el NotificationText es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Ayuda bajo un campo:</strong> una línea que explica el formato o la regla. Enlázala con el campo usando <code>aria-describedby</code> y el <code>id</code> del mensaje.
            </>,
            <>
              <strong>Error de validación:</strong> dice qué se necesita para corregirlo. Con <code>state=&quot;error&quot;</code> se anuncia con <code>role=&quot;alert&quot;</code>; marca también el campo con <code>aria-invalid</code>.
            </>,
            <>
              <strong>Confirmación de un dato correcto:</strong> <code>state=&quot;confirmation&quot;</code> se anuncia con <code>role=&quot;status&quot;</code>, sin interrumpir.
            </>,
            <>
              <strong>Dentro de una región viva:</strong> si el contenedor ya tiene <code>aria-live</code>, pasa <code>announce={'{false}'}</code> para no anunciar dos veces.
            </>,
          ],
          avoid: [
            <>
              <strong>Mensajes con acción o enlace:</strong> el texto no es interactivo. (Alternativa: <code>Alert</code>).
            </>,
            <>
              <strong>Avisos de toda la pantalla:</strong> un mensaje bajo el campo no se ve en el resto del formulario. (Alternativa: <code>Alert</code> o <code>Toast</code>).
            </>,
            <>
              <strong>Texto largo:</strong> varias frases en la fila rompen el ritmo del formulario. Resume en una frase.
            </>,
            <>
              <strong>Significado solo con color:</strong> el texto debe decir qué pasa; el color y el ícono refuerzan, no reemplazan.
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
                title: 'Mensaje bajo un campo',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medida fija:</strong> 18 de alto por línea, ícono de 14 px, gap de 8 y texto de 14/18, sin variantes por breakpoint.
                  </>,
                ],
                preview: msg({ state: 'error' }, ERROR_TEXT),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> 18 de alto por línea, ícono de 14 px, gap de 8 y texto de 14/18.
              </>,
              <>
                <strong>Ancho:</strong> ocupa el 100% del contenedor; el texto largo pasa a la línea siguiente.
              </>,
            ],
            preview: msg({ state: 'error' }, ERROR_TEXT),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> 18 de alto por línea, ícono de 14 px, gap de 8 y texto de 14/18.
              </>,
              <>
                <strong>Ancho:</strong> ocupa el 100% del contenedor; el texto largo pasa a la línea siguiente.
              </>,
            ],
            preview: msg({ state: 'error' }, ERROR_TEXT),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de redacción y de tipo del NotificationText.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Error que dice qué hacer',
              description: 'Dile a quien escribe qué corregir: así puede resolverlo sin adivinar.',
              preview: msg({ state: 'error' }, ERROR_TEXT),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error que culpa',
              description: 'No culpes a quien escribe ni dejes el error sin salida.',
              preview: msg({ state: 'error' }, 'Escribiste mal el correo'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Ayuda en una línea',
              description: 'Resume la ayuda en una frase corta.',
              preview: msg({ state: 'helper' }, 'Usa 8 caracteres o más'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Ayuda extensa',
              description: 'No encadenes frases: alarga el campo y se lee a medias.',
              preview: msg({ state: 'helper' }, 'Usa 8 caracteres o más, con letras, números y un símbolo, sin tu nombre ni fechas'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Tipo según el mensaje',
              description: 'Usa confirmation para un dato correcto.',
              preview: msg({ state: 'confirmation' }, OK_TEXT),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tipo que contradice',
              description: 'No uses error para un mensaje que confirma.',
              preview: msg({ state: 'error' }, OK_TEXT),
            },
          ],
        },
      ],
    },
  ],
};
