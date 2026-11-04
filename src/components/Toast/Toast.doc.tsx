import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Toast } from './Toast';

/*
 * Contenido de la página de documentación de Toast (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Toast.tsx`, `Toast.types.ts`, `Toast.variants.ts`, `Toast.shared.ts`), luego `Toast.docs.json`. Medidas: 344 de
 * ancho, padding `space/container/on-card` (24 en Desktop y Tablet, 16 en Mobile) arriba, abajo e izquierda y
 * `space/general/5xl` (40; 32 en Mobile) a la derecha, gap de 8, círculo de ícono de 24 con glifo de 20, Subheading
 * Prospero semibold 12/16 y Description Helvetica Neue regular 12/18.
 *
 * Los avisos de las muestras no llevan `duration`: no desaparecen mientras se miran. En uso real se lanzan con
 * `useToastQueue` dentro de un `Toaster`; aquí se dibujan sueltos en el flujo.
 */

// Figma: 11198:12704 (component set Toast)

// Sin la entrada animada (`starting:`): una muestra que se mueve al cargar descuadra marcadores y cotas.
const STILL = 'motion-safe:starting:translate-y-0 motion-safe:starting:opacity-100';

const toast = (props: Partial<ComponentProps<typeof Toast>> = {}) => (
  <Toast type="success" title="Cambios guardados" description="Tu perfil se actualizó." onClose={() => {}} className={STILL} {...props} />
);

/** Una columna de estados: un aviso del tipo pedido, con el mismo texto en todos para que cambie solo el aspecto. */
const typeSample = (type: ComponentProps<typeof Toast>['type']): ReactNode[] => [toast({ type })];

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
  name: 'Toast',
  icon: 'notification',
  classification: 'molecula',
  summary:
    'El Toast es la molécula que muestra un aviso breve y no modal: un ícono según el resultado, un título, una descripción opcional y un botón de cierre. Se lanza con Toaster y no interrumpe la tarea.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una tarjeta con muesca arriba a la derecha: ícono, texto y el botón de cierre sobre la muesca.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Toast con cierre',
                  preview: toast(),
                  marks: [
                    { n: 1, selector: '[data-type]', side: 'bottom' },
                    { n: 2, selector: '[data-figma-part="Icon"]', side: 'left' },
                    { n: 3, selector: '[data-figma-part="Subheading"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Description"]', side: 'bottom' },
                    { n: 5, selector: 'button', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-type]', side: 'left' },
                    { kind: 'padding', selector: '[data-type]', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="Icon"]', to: '[data-figma-part="Information"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 344 de ancho con padding de 24 arriba, abajo e izquierda (<code>space/container/on-card</code>) y 40 a la derecha (<code>space/general/5xl</code>), que deja sitio al botón. Muesca de radio 24 arriba a la derecha, con relleno <code>background/container/default-unicolor</code> y trazo <code>border/general/gray-fifth-unicolor</code>.
                </>,
                <>
                  <strong>Ícono:</strong> círculo de 24 (<code>background/general/gray-sixth-unicolor</code>) con padding de 2 y glifo relleno de 20. El Type define el ícono y su color; es decorativo, porque el tipo también está en el texto para lectores de pantalla.
                </>,
                <>
                  <strong>Título:</strong> texto en Prospero semibold de 12 px, interlineado de 16 y 4 de padding superior (<code>typography/heading/size/xs</code>), en <code>text/neutral/white-unicolor</code>.
                </>,
                <>
                  <strong>Descripción:</strong> texto opcional en Helvetica Neue regular de 12 px y interlineado de 18 (<code>typography/body/size/sm</code>), a 4 de distancia del título. Sin descripción no se dibuja.
                </>,
                <>
                  <strong>Botón de cierre:</strong> ButtonCorner sm de 32 con ícono de 16, sobre la muesca. Solo aparece con <code>onClose</code>; su nombre accesible es <code>closeLabel</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tipos',
                  preview: (
                    <div className="flex flex-col gap-ds-space-general-lg">
                      {toast({ type: 'success' })}
                      {toast({ type: 'alert' })}
                      {toast({ type: 'error' })}
                      {toast({ type: 'info' })}
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
                  <strong>Success:</strong> ícono <code>tick-circle</code> en <code>icon/semantic/success/firts</code>. Con título y descripción el aviso mide 90 de alto.
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
        'Toast tiene 4 variantes de aspecto (Type en Figma). El aviso no es interactivo: solo su botón de cierre responde al puntero y al teclado.',
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
              preview: toast(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-unicolor', mode: 'dark' },
                { part: 'Trazo', color: 'border-general-gray-fifth-unicolor', mode: 'dark' },
                { part: 'Círculo del ícono', color: 'background-general-gray-sixth-unicolor', mode: 'dark' },
                { part: 'Título', color: 'text-neutral-white-unicolor', text: 'typography-heading-size-xs', mode: 'dark' },
                { part: 'Descripción', color: 'text-neutral-white-unicolor', text: 'typography-body-size-sm', mode: 'dark' },
              ],
            },
            {
              title: 'Ícono por tipo',
              preview: toast({ type: 'info', title: 'Sincronización lista', description: undefined }),
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
      title: 'Uso del componente Toast en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Toast en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type, Description, Text subheading y Text description.
            </>,
            <>
              <strong>Type:</strong> Success, Alert, Error o Info; en código es <code>type</code> con los valores <code>success</code>, <code>alert</code>, <code>error</code> e <code>info</code>. El rol de lector de pantalla (<code>role</code>) no existe en Figma.
            </>,
            <>
              <strong>Textos:</strong> Text subheading es <code>title</code> y Text description es <code>description</code>. El booleano Description se resuelve por presencia: sin <code>description</code> no se dibuja.
            </>,
            <>
              <strong>Diferencias:</strong> en Figma el botón de cierre siempre se dibuja; en código aparece solo con <code>onClose</code>. Toaster y <code>useToastQueue</code> no existen en Figma, y el set Snackbar (con acciones y sin botón de cierre) corresponde a Snackbar.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Toast es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Confirmar una acción:</strong> un aviso breve de que algo salió bien o falló, sin pedir nada y sin mover el foco. El tipo (<code>type</code>) define el ícono y el color.
            </>,
            <>
              <strong>Anuncio a lectores de pantalla:</strong> es una región viva. <code>success</code> e <code>info</code> usan <code>role=&quot;status&quot;</code> y esperan su turno; <code>alert</code> y <code>error</code> usan <code>role=&quot;alert&quot;</code> e interrumpen. Con <code>role</code> se cambia.
            </>,
            <>
              <strong>Cierre automático:</strong> <code>duration</code> en ms, sin valor por defecto. La cuenta se pausa con el puntero encima o el foco dentro y se reinicia al salir. Al cumplirse llama a <code>onClose</code>.
            </>,
            <>
              <strong>Cierre manual:</strong> con el botón de cierre o con Escape si el foco está dentro. Al cerrar, el aviso sale en 200 ms (150 ms, solo fundido, con movimiento reducido) y se desmonta en <code>onExited</code>.
            </>,
            <>
              <strong>Varios avisos:</strong> <code>useToastQueue</code> dentro de un Toaster apila hasta 3 a la vez (<code>limit</code>); al pasarse, el más antiguo sale. La entrada es un fundido con 8 px de desplazamiento, solo si no hay movimiento reducido.
            </>,
          ],
          avoid: [
            <>
              <strong>Errores que se deben corregir:</strong> el aviso desaparece y no se puede releer. (Alternativa: <code>Alert</code> o el texto de ayuda del campo).
            </>,
            <>
              <strong>Acciones o decisiones:</strong> el Toast no trae botones de acción. (Alternativa: <code>Snackbar</code>).
            </>,
            <>
              <strong>Confirmaciones que exigen respuesta:</strong> el Toast no bloquea la pantalla. (Alternativa: <code>AlertModal</code>).
            </>,
            <>
              <strong>Cierre automático en avisos importantes:</strong> no uses <code>duration</code> en <code>error</code> ni <code>alert</code>; la persona debe poder leerlos con calma (WCAG 2.2.1).
            </>,
            <>
              <strong>Información fija de la página:</strong> un Toast no se queda. (Alternativa: <code>Alert</code>).
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
                    <strong>344 de ancho</strong> fijo; el alto crece con el texto (90 con título y descripción).
                  </>,
                ],
                preview: toast(),
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
                preview: toast({ type: 'info', title: 'Sincronización lista', description: undefined }),
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
                <strong>Texto:</strong> mismo tamaño (12 px) que en Desktop; si no cabe, baja de línea y el alto crece.
              </>,
            ],
            preview: toast(),
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
                <strong>Texto:</strong> 12 px con interlineado de 16 y 18, igual que en Desktop.
              </>,
            ],
            preview: toast(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas para el título, el tipo y la longitud del mensaje.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título con el resultado',
              description: 'Escribe en el título qué pasó, en pocas palabras.',
              preview: toast({ title: 'Cambios guardados' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título genérico',
              description: 'No uses un título que no diga qué pasó.',
              preview: toast({ title: 'Aviso' }),
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
              preview: toast({ type: 'error', title: 'No se pudo guardar', description: 'Revisa tu conexión e inténtalo de nuevo.' }),
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
              preview: toast({ type: 'success', title: 'No se pudo guardar', description: 'Revisa tu conexión e inténtalo de nuevo.' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Mensaje breve',
              description: 'Limita el aviso a un título y una frase.',
              preview: toast({ title: 'Archivo subido', description: 'Ya está en tu carpeta.' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto largo',
              description: 'No escribas párrafos: el aviso mide 344 y el alto crece sin control.',
              preview: toast({
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
