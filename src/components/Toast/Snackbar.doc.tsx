import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Snackbar } from './Snackbar';

/*
 * Contenido de la página de documentación de Snackbar (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Snackbar.tsx`, `Toast.types.ts`, `Toast.variants.ts`, `Toast.shared.ts`), luego `Snackbar.docs.json`. Medidas: 344
 * de ancho, radio 24 plano (sin muesca ni trazo), padding `space/container/on-card` (24 en Desktop y Tablet, 16 en
 * Mobile) arriba, abajo e izquierda y `space/general/5xl` (40; 32 en Mobile) a la derecha, gap de 8, círculo de ícono
 * de 24 con glifo de 20, Subheading Prospero semibold 12/16, Description Helvetica Neue regular 12/18 y una fila de
 * hasta dos Button tertiary xs unicolor separados 16.
 *
 * Los avisos de las muestras no llevan `duration`: no desaparecen mientras se miran. En uso real se lanzan con
 * `useToastQueue` (`kind: 'snackbar'`) dentro de un `Toaster`; aquí se dibujan sueltos en el flujo.
 */

// Figma: 11844:10443 (component set Snackbar)

// Sin la entrada animada (`starting:`): una muestra que se mueve al cargar descuadra marcadores y cotas.
const STILL = 'motion-safe:starting:translate-y-0 motion-safe:starting:opacity-100';

const snackbar = (props: Partial<ComponentProps<typeof Snackbar>> = {}) => (
  <Snackbar
    type="info"
    title="Archivo movido"
    description="Ahora está en Documentos."
    action={{ label: 'Deshacer', onClick: () => {} }}
    secondaryAction={{ label: 'Ver carpeta', onClick: () => {} }}
    className={STILL}
    {...props}
  />
);

/** Una columna de estados: un aviso del tipo pedido, con el mismo texto en todos para que cambie solo el aspecto. */
const typeSample = (type: ComponentProps<typeof Snackbar>['type']): ReactNode[] => [snackbar({ type })];

const states: DocStateItem[] = [
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Confirma que una acción terminó bien. Ícono <code>tick-circle</code> y rol <code>status</code>.
      </>
    ),
    samples: typeSample('success'),
  },
  {
    label: 'Alert',
    tone: 'alert',
    description: (
      <>
        Advierte de algo que pide atención. Ícono <code>warning</code> y rol <code>alert</code>.
      </>
    ),
    samples: typeSample('alert'),
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Informa que una acción falló. Ícono <code>forbidden-2</code> y rol <code>alert</code>.
      </>
    ),
    samples: typeSample('error'),
  },
  {
    label: 'Info',
    tone: 'neutral',
    description: (
      <>
        Da un dato sin urgencia. Ícono <code>info-circle</code> y rol <code>status</code>.
      </>
    ),
    samples: typeSample('info'),
  },
];

export const doc: ComponentDocContent = {
  name: 'Snackbar',
  icon: 'notification',
  classification: 'molecula',
  summary:
    'El Snackbar es la molécula que muestra un aviso breve y no modal con hasta dos acciones: un ícono según el resultado, un título, una descripción opcional y botones como Deshacer. Se lanza con Toaster y no interrumpe la tarea.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una tarjeta plana, sin muesca ni botón de cierre: ícono, texto y una fila de hasta dos acciones bajo el texto. En modo oscuro su relleno es igual al del panel, así que los marcadores señalan un borde que no se ve.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Snackbar con dos acciones',
                  preview: snackbar(),
                  marks: [
                    { n: 1, selector: '[data-type]', side: 'bottom' },
                    { n: 2, selector: '[data-figma-part="Icon"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Subheading"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Description"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="Button"]', side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Button 2"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-type]', side: 'left' },
                    { kind: 'padding', selector: '[data-type]', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="Icon"]', to: '[data-figma-part="Information"]' },
                    { kind: 'gap', from: '[data-figma-part="Button"]', to: '[data-figma-part="Button 2"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 344 de ancho y radio 24 (<code>radius/general/2xl</code>), plano, sin trazo. Padding de 24 arriba, abajo e izquierda (<code>space/container/on-card</code>) y 40 a la derecha (<code>space/general/5xl</code>). Relleno <code>background/container/default-unicolor</code>.
                </>,
                <>
                  <strong>Ícono:</strong> círculo de 24 (<code>background/general/gray-sixth-unicolor</code>) con padding de 2 y glifo relleno de 20. El Type define el ícono y su color; es decorativo, porque el tipo también está en el texto para lectores de pantalla.
                </>,
                <>
                  <strong>Título:</strong> título en Prospero semibold de 12 px, interlineado de 16 y 4 de padding superior (<code>typography/heading/size/xs</code>), en <code>text/neutral/white-unicolor</code>.
                </>,
                <>
                  <strong>Descripción:</strong> texto opcional en Helvetica Neue regular de 12 px y interlineado de 18 (<code>typography/body/size/sm</code>), a 4 de distancia del título. Sin descripción no se dibuja.
                </>,
                <>
                  <strong>Primera acción:</strong> Button tertiary xs unicolor de 32 de alto, bajo el texto, a 4 de la descripción. Se define con <code>action</code>.
                </>,
                <>
                  <strong>Segunda acción:</strong> otro Button igual, a 16 de la primera. Se define con <code>secondaryAction</code>; sin ella solo se dibuja la primera. Si las acciones no caben en la fila, bajan de línea.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tipos',
                  preview: (
                    <div className="flex flex-col gap-ds-space-general-lg">
                      {snackbar({ type: 'success' })}
                      {snackbar({ type: 'alert' })}
                      {snackbar({ type: 'error' })}
                      {snackbar({ type: 'info' })}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Icon"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon"]', index: 1, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Icon"]', index: 2, side: 'left' },
                    { n: 4, selector: '[data-figma-part="Icon"]', index: 3, side: 'left' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-type]', index: 0 }],
                },
              ],
              guidelines: [
                <>
                  <strong>Success:</strong> ícono <code>tick-circle</code> en <code>icon/semantic/success/firts</code>. Con título, descripción y acciones el aviso mide 126 de alto.
                </>,
                <>
                  <strong>Alert:</strong> ícono <code>warning</code> en <code>icon/semantic/alert/firts</code>.
                </>,
                <>
                  <strong>Error:</strong> ícono <code>forbidden-2</code> en <code>icon/semantic/error/firts</code>.
                </>,
                <>
                  <strong>Info:</strong> ícono <code>info-circle</code> en <code>icon/semantic/information/firts</code>. Con <code>icon</code> se cambia el ícono de cualquier tipo.
                </>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description:
        'Snackbar tiene 4 variantes de aspecto (Type en Figma). El aviso no es interactivo: solo sus acciones responden al puntero y al teclado, con los estados de Button tertiary. En modo oscuro la tarjeta tiene el mismo color que el panel y no se distingue: el texto y el ícono sí se ven.',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del aviso. Es unicolor y fuerza el modo oscuro: sus valores no cambian con el interruptor.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Aviso',
              preview: snackbar(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-unicolor', mode: 'dark' },
                { part: 'Círculo del ícono', color: 'background-general-gray-sixth-unicolor', mode: 'dark' },
                { part: 'Título', color: 'text-neutral-white-unicolor', text: 'typography-heading-size-xs', mode: 'dark' },
                { part: 'Descripción', color: 'text-neutral-white-unicolor', text: 'typography-body-size-sm', mode: 'dark' },
              ],
            },
            {
              title: 'Acciones',
              preview: snackbar({ type: 'info', title: 'Sincronización lista', description: undefined, secondaryAction: undefined }),
              entries: [
                { part: 'Texto de la acción', color: 'text-button-tertiary-unicolor', text: 'typography-button-size-md-uniform', mode: 'dark' },
              ],
            },
            {
              title: 'Ícono por tipo',
              preview: snackbar({ type: 'success', title: 'Sincronización lista', description: undefined, action: undefined, secondaryAction: undefined }),
              entries: [
                { part: 'Success', color: 'icon-semantic-success-firts', mode: 'dark' },
                { part: 'Alert', color: 'icon-semantic-alert-firts', mode: 'dark' },
                { part: 'Error', color: 'icon-semantic-error-firts', mode: 'dark' },
                { part: 'Info', color: 'icon-semantic-information-firts', mode: 'dark' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Snackbar en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Snackbar en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type, Description, Button 2, Text subheading y Text description.
            </>,
            <>
              <strong>Type:</strong> Success, Alert, Error o Info; en código es <code>type</code> con los valores <code>success</code>, <code>alert</code>, <code>error</code> e <code>info</code>. El rol de lector de pantalla (<code>role</code>) no existe en Figma.
            </>,
            <>
              <strong>Textos y acciones:</strong> Text subheading es <code>title</code> y Text description es <code>description</code>. Button es <code>action</code> y Button 2 es <code>secondaryAction</code>. Los booleanos Description y Button 2 se resuelven por presencia: sin la prop no se dibujan.
            </>,
            <>
              <strong>Diferencias:</strong> en Figma el primer Button siempre se dibuja; en código aparece solo con <code>action</code>. Toaster y <code>useToastQueue</code> no existen en Figma, y el set Toast (con botón de cierre y muesca, sin acciones) corresponde a Toast.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Snackbar es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Confirmar con una acción:</strong> un aviso breve que ofrece deshacer o ver el resultado, sin mover el foco. Admite hasta dos acciones (<code>action</code> y <code>secondaryAction</code>), cada una con <code>onClick</code> o con <code>href</code> si lleva a otra página.
            </>,
            <>
              <strong>Anuncio a lectores de pantalla:</strong> es una región viva. <code>success</code> e <code>info</code> usan <code>role=&quot;status&quot;</code> y esperan su turno; <code>alert</code> y <code>error</code> usan <code>role=&quot;alert&quot;</code> e interrumpen. Con <code>role</code> se cambia.
            </>,
            <>
              <strong>Cierre por acción:</strong> no tiene botón de cierre, así que activar una acción con <code>label</code> llama a <code>onClose</code> (<code>closeOnAction</code>, por defecto <code>true</code>). Con <code>closeOnAction</code> en <code>false</code> el aviso sigue abierto. En un nodo propio no aplica.
            </>,
            <>
              <strong>Cierre automático y manual:</strong> <code>duration</code> en ms, sin valor por defecto. La cuenta se pausa con el puntero encima o el foco dentro y se reinicia al salir. También se cierra con Escape si el foco está dentro. Al cerrar, el aviso sale en 200 ms (150 ms, solo fundido, con movimiento reducido) y se desmonta en <code>onExited</code>.
            </>,
            <>
              <strong>Varios avisos:</strong> <code>useToastQueue</code> con <code>kind: &quot;snackbar&quot;</code> dentro de un Toaster apila hasta 3 a la vez (<code>limit</code>); al pasarse, el más antiguo sale. La entrada es un fundido con 8 px de desplazamiento, solo si no hay movimiento reducido.
            </>,
          ],
          avoid: [
            <>
              <strong>Errores que se deben corregir:</strong> el aviso desaparece y no se puede releer. (Alternativa: <code>Alert</code> o el texto de ayuda del campo).
            </>,
            <>
              <strong>Avisos sin acciones:</strong> sin acciones ni <code>duration</code>, solo Escape lo cierra. (Alternativa: <code>Toast</code>, que trae botón de cierre).
            </>,
            <>
              <strong>Decisiones que bloquean:</strong> el Snackbar no detiene la pantalla ni admite más de dos acciones. (Alternativa: <code>AlertModal</code>).
            </>,
            <>
              <strong>Cierre automático con acciones:</strong> no uses <code>duration</code> en avisos con acción ni en <code>error</code> o <code>alert</code>; la persona debe poder leerlos con calma (WCAG 2.2.1).
            </>,
            <>
              <strong>Información fija de la página:</strong> un Snackbar no se queda. (Alternativa: <code>Alert</code>).
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
                title: 'Medidas',
                bullets: [
                  <>
                    <strong>Padding de 24</strong> arriba, abajo e izquierda, y 40 a la derecha.
                  </>,
                  <>
                    <strong>344 de ancho</strong> fijo; el alto crece con el texto (126 con título, descripción y acciones).
                  </>,
                ],
                preview: snackbar(),
              },
              {
                title: 'En pantalla',
                bullets: [
                  <>
                    <strong>Esquina:</strong> <code>bottom-end</code> por defecto, a 24 del borde.
                  </>,
                  <>
                    <strong>Pila:</strong> los avisos nuevos entran hacia el centro, a 8 de distancia entre sí.
                  </>,
                ],
                preview: snackbar({ type: 'success', title: 'Sincronización lista', description: undefined }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Padding de 16</strong> arriba, abajo e izquierda, y 32 a la derecha.
              </>,
              <>
                <strong>Ancho:</strong> 344 como máximo, sin pasar del ancho disponible; el Toaster deja 16 de margen a cada lado.
              </>,
              <>
                <strong>Texto y acciones:</strong> el texto mantiene los 12 px de Desktop y las acciones siguen separadas 16; si no caben en la fila, bajan de línea y el alto crece.
              </>,
            ],
            preview: snackbar(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> las mismas de Desktop, con padding de 24 y 40.
              </>,
              <>
                <strong>Esquina:</strong> <code>bottom-end</code> por defecto, a 24 del borde.
              </>,
              <>
                <strong>Texto y acciones:</strong> 12 px con interlineado de 16 y 18, y acciones separadas 16, igual que en Desktop.
              </>,
            ],
            preview: snackbar(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas para las acciones, el tipo y la longitud del mensaje.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Acción que nombra el efecto',
              description: 'Usa un verbo que diga el resultado, como Deshacer.',
              preview: snackbar({ title: 'Archivo movido', description: undefined, secondaryAction: undefined, action: { label: 'Deshacer', onClick: () => {} } }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Acción genérica',
              description: 'No uses un nombre que no diga qué pasará.',
              preview: snackbar({ title: 'Archivo movido', description: undefined, secondaryAction: undefined, action: { label: 'Aceptar', onClick: () => {} } }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Tipo según el resultado',
              description: (
                <>
                  Usa <code>error</code> para un fallo: el ícono y el rol coinciden con el texto.
                </>
              ),
              preview: snackbar({
                type: 'error',
                title: 'No se pudo guardar',
                description: 'Revisa tu conexión e inténtalo de nuevo.',
                action: { label: 'Reintentar', onClick: () => {} },
                secondaryAction: undefined,
              }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Éxito para un fallo',
              description: (
                <>
                  No uses <code>success</code> para un fallo: el ícono y el rol dicen lo contrario.
                </>
              ),
              preview: snackbar({
                type: 'success',
                title: 'No se pudo guardar',
                description: 'Revisa tu conexión e inténtalo de nuevo.',
                action: { label: 'Reintentar', onClick: () => {} },
                secondaryAction: undefined,
              }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Mensaje breve',
              description: 'Limita el aviso a un título y una frase, y deja las acciones a la vista.',
              preview: snackbar({ title: 'Archivo subido', description: 'Ya está en tu carpeta.' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto largo',
              description: 'No escribas párrafos: las acciones quedan lejos del título.',
              preview: snackbar({
                title: 'Archivo subido',
                description: 'Tu archivo se subió a la carpeta compartida y ahora todas las personas con acceso pueden verlo, editarlo y comentarlo desde cualquier dispositivo.',
              }),
            },
          ],
        },
      ],
    },
  ],
};
