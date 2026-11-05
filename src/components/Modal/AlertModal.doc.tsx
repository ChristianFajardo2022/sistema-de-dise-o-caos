import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Button } from '../Button';
import type { ButtonState } from '../Button/Button.types';
import { AlertModalPanel } from './AlertModal';
import type { AlertModalType } from './Modal.types';

/*
 * Contenido de la página de documentación de AlertModal (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`AlertModal.tsx`, `AlertModal.variants.ts`, `Modal.types.ts`), luego `AlertModal.docs.json`. Medidas: Desktop y Tablet
 * a 480 de ancho con padding de 40, gap de 32, ícono de 56, título de 20/24, descripción destacada de 16/22 y texto de
 * apoyo de 14/20; Mobile es una hoja inferior con padding de 16 / 20 / 32 / 20, gap de 24, ícono de 48, título de 18/22
 * y descripción destacada de 14/20.
 * Diferencias con Figma: el componente de Figma (Simple modal) solo dibuja la superficie, sin velo, foco, Escape ni
 * clic en el fondo; el código los suma sobre `<dialog>` con `showModal()`.
 *
 * Las vistas usan la superficie suelta (`AlertModalPanel`) en el flujo: el `AlertModal` real se abre en la capa
 * superior y no se puede medir ni recortar dentro de un lienzo.
 */

// Figma: 11946:10227 (component set Simple modal)

type PanelProps = Partial<ComponentProps<typeof AlertModalPanel>>;

/** Textos de ejemplo por tipo: título, descripción destacada y texto de apoyo. */
const COPY: Record<AlertModalType, { title: string; lead: string; body: string }> = {
  alert: {
    title: '¿Eliminar el documento?',
    lead: 'El documento se borrará de la carpeta compartida.',
    body: 'Puedes recuperarlo desde la papelera durante 30 días.',
  },
  info: {
    title: 'Nueva versión disponible',
    lead: 'Hay una versión más reciente del documento.',
    body: 'Actualiza para ver los cambios de tu equipo.',
  },
  error: {
    title: 'No se pudo guardar',
    lead: 'Se perdió la conexión mientras guardabas.',
    body: 'Revisa tu conexión e inténtalo de nuevo.',
  },
  success: {
    title: 'Cambios guardados',
    lead: 'El documento se actualizó correctamente.',
    body: 'Tu equipo ya puede verlo.',
  },
};

/**
 * Superficie del diálogo con sus tres acciones. `copy` elige los textos (por defecto los del tipo); `body` cambia el texto de apoyo y `null` lo quita.
 * El título va en h3: es una ilustración y no debe sumar niveles a la página.
 */
const panel = ({ type = 'alert', copy = type, body, ...props }: Omit<PanelProps, 'children'> & { copy?: AlertModalType; body?: string | null } = {}) => (
  <AlertModalPanel
    type={type}
    headingLevel={3}
    title={COPY[copy].title}
    description={COPY[copy].lead}
    primaryAction={{ label: 'Eliminar' }}
    secondaryAction={{ label: 'Cancelar' }}
    tertiaryAction={{ label: 'Ver detalles' }}
    {...props}
  >
    {body === null ? undefined : (body ?? COPY[copy].body)}
  </AlertModalPanel>
);

/** Superficie de un tipo con el mismo contenido y una sola acción. */
const byType = (type: AlertModalType) =>
  panel({ type, primaryAction: { label: 'Entendido' }, secondaryAction: undefined, tertiaryAction: undefined });

/** Superficie mínima (título y descripción, sin cerrar ni acciones) para comparar los cuatro tipos. */
const compact = (type: AlertModalType) => (
  <AlertModalPanel type={type} headingLevel={3} title={COPY[type].title} description={COPY[type].lead} closable={false} />
);

/** Disparador de ejemplo: el botón que abre el diálogo. */
const trigger = (state?: ButtonState) => (
  <Button variant="primary" size="md" state={state}>
    Eliminar documento
  </Button>
);

const states: DocStateItem[] = [
  {
    label: 'Oculto',
    tone: 'neutral',
    description: (
      <>
        Reposo. El diálogo está montado pero cerrado, y solo se ve su disparador (<code>open</code> en <code>false</code>).
      </>
    ),
    samples: [trigger()],
  },
  {
    label: 'Abierto',
    tone: 'accent',
    description: (
      <>
        Con <code>open</code> o <code>defaultOpen</code>. El foco entra en la acción menos destructiva (Secondary, luego Tertiary y por último Primary) y el resto de la página queda inerte.
      </>
    ),
    samples: [panel({ secondaryAction: { label: 'Cancelar', state: 'focus' } })],
  },
  {
    label: 'Cierre',
    tone: 'neutral',
    description: (
      <>
        Es una transición: la tarjeta se ve como Oculto, con el disparador enfocado. Escape, un clic en el fondo (<code>closeOnBackdrop</code>), el botón cerrar o una acción piden cerrar con <code>onOpenChange(false)</code>. El foco vuelve al disparador, que es lo único que queda a la vista.
      </>
    ),
    samples: [trigger('focus')],
  },
  {
    label: 'Acción en carga',
    tone: 'neutral',
    description: (
      <>
        Una acción con <code>loading</code> muestra el indicador de carga; Tertiary no lo tiene. Para mantener el diálogo abierto mientras termina, llama a <code>event.preventDefault()</code> en <code>onClick</code>.
      </>
    ),
    samples: [panel({ primaryAction: { label: 'Eliminar', loading: true } })],
  },
  {
    label: 'Acción inactiva',
    tone: 'neutral',
    description: (
      <>
        Una acción con <code>disabled</code> no recibe el foco inicial: lo toma la siguiente menos destructiva.
      </>
    ),
    samples: [panel({ secondaryAction: { label: 'Cancelar', disabled: true }, tertiaryAction: { label: 'Ver detalles', state: 'focus' } })],
  },
];

/** Entradas de Tokens y modos de un tipo: solo cambia el color del ícono; lo demás es igual. */
const tokenEntries = (semantic: string) => [
  { part: 'Fondo', color: 'background-container-default-on-canva' },
  { part: 'Fondo (Mobile)', color: 'background-container-surface' },
  { part: 'Ícono', color: `icon-semantic-${semantic}-firts` },
  { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-lg' },
  { part: 'Descripción destacada', color: 'text-neutral-body', text: 'typography-body-size-lg' },
  { part: 'Texto de apoyo', color: 'text-neutral-body', text: 'typography-body-size-md' },
  { part: 'Asa (Mobile)', color: 'background-general-gray-fifth' },
];

export const doc: ComponentDocContent = {
  name: 'AlertModal',
  icon: 'warning',
  classification: 'molecula',
  summary:
    'El AlertModal es la molécula que interrumpe con un diálogo corto para avisar o pedir una confirmación. Une un ícono de tipo, un título, dos textos y hasta tres acciones, y deja inerte el resto de la página hasta que se responde.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una superficie con silueta y muesca. El ícono y el texto van centrados en columna; las acciones, debajo.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'AlertModal abierto',
                  preview: panel(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="desktop"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Heading"]', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Description group"]', side: 'right' },
                    { n: 5, selector: '[data-figma-part="Button corner "]', side: 'right' },
                    { n: 6, selector: '[data-figma-part="CTA"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="desktop"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Icon-sizes"]', fromIndex: 0, to: '[data-figma-part="Info"]', axis: 'y' },
                    { kind: 'gap', from: '[data-figma-part="Info"]', to: '[data-figma-part="CTA"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> 480 de ancho, padding de 40 (<code>space/general/5xl</code>) y 32 entre sus partes (<code>space/general/4xl</code>). Silueta de radio 24 (<code>radius/general/2xl</code>) sobre <code>background/container/default-on-canva</code>, con una muesca de 48 arriba a la derecha.
                </>,
                <>
                  <strong>Ícono:</strong> 56 px de línea (<code>dimention/icono/M</code>), del color del tipo. Es decorativo: el tipo lo cuentan el título y el texto.
                </>,
                <>
                  <strong>Título:</strong> Prospero semibold de 20 con interlineado de 24 (<code>typography/heading/size/lg</code>), centrado. Da el nombre accesible al diálogo y su nivel se cambia con <code>headingLevel</code>.
                </>,
                <>
                  <strong>Descripción:</strong> dos textos centrados con 4 entre ellos (<code>space/general/md</code>). El primero, <code>description</code>, es Helvetica Neue semibold de 16 con interlineado de 22; el segundo, <code>children</code>, es regular de 14 con interlineado de 20.
                </>,
                <>
                  <strong>Cerrar:</strong> un ButtonCorner de 40 con ícono <code>close</code> de 16, en la muesca. Se oculta con <code>closable=&quot;false&quot;</code> y su nombre accesible es <code>closeLabel</code>.
                </>,
                <>
                  <strong>Acciones:</strong> hasta tres Button md en el orden Tertiary, Secondary, Primary, centrados y con 16 entre ellos (<code>space/general/2xl</code>). Sin ninguna, el pie no se dibuja.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tipos',
                  preview: (
                    <div className="grid grid-cols-2 gap-ds-space-general-5xl">
                      {compact('info')}
                      {compact('error')}
                      {compact('alert')}
                      {compact('success')}
                    </div>
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Icon-sizes"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon-sizes"]', index: 1, side: 'right' },
                    { n: 3, selector: '[data-figma-part="Icon-sizes"]', index: 2, side: 'left' },
                    { n: 4, selector: '[data-figma-part="Icon-sizes"]', index: 3, side: 'right' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Info:</strong> ícono <code>info-circle</code> en <code>icon/semantic/information-firts</code>. Datos que informan sin pedir nada.
                </>,
                <>
                  <strong>Error:</strong> ícono <code>close-circle</code> en <code>icon/semantic/error-firts</code>. Algo falló y hay que corregirlo o repetirlo.
                </>,
                <>
                  <strong>Alert:</strong> ícono <code>warning</code> en <code>icon/semantic/alert-firts</code>. Una acción que pide cautela, como una eliminación.
                </>,
                <>
                  <strong>Success:</strong> ícono <code>tick-circle</code> en <code>icon/semantic/success-firts</code>. Es el valor por defecto (<code>type=&quot;success&quot;</code>) y confirma que algo salió bien.
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
          AlertModal tiene 5 estados. Oculto, Abierto y Cierre son del diálogo; Acción en carga y Acción inactiva son de sus botones. Aquí el diálogo se dibuja abierto y sin comportamiento; el foco de las muestras se fuerza con <code>state</code> solo para documentar.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Un grupo por tipo: solo cambia el color del ícono. Los botones y el cerrar usan los tokens de Button y de ButtonCorner.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            { title: 'Info', preview: byType('info'), entries: tokenEntries('information') },
            { title: 'Error', preview: byType('error'), entries: tokenEntries('error') },
            { title: 'Alert', preview: byType('alert'), entries: tokenEntries('alert') },
            { title: 'Success', preview: byType('success'), entries: tokenEntries('success') },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente AlertModal en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Simple modal en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type, Icon close, Heading, Description group, Btn secondary y Btn tertiary, más los textos Text heading, ↪ Text description1 y ↪ Text descriptio2.
            </>,
            <>
              <strong>Type:</strong> Success, Alert, Error o Info; en código es <code>type</code> y cambia el ícono y su color. El valor por defecto de Figma es Success.
            </>,
            <>
              <strong>Propiedades booleanas:</strong> Icon close es <code>closable</code>. Btn secondary y Btn tertiary son <code>secondaryAction</code> y <code>tertiaryAction</code>: se omiten para no dibujarlas. Los textos son <code>title</code>, <code>description</code> y <code>children</code>.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> el foco, Escape ni el clic en el fondo; el código los suma sobre <code>&lt;dialog&gt;</code>. El velo es el mismo de Backdrop (<code>background/effect/backdrop</code> y desenfoque de 12 px), pintado con el <code>::backdrop</code> nativo del diálogo. Los marcos Desktop y Mobile son la misma pieza: el código elige la hoja inferior por debajo de 768 px. El set Complex modal es el componente Modal.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el AlertModal es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Confirmar una acción que no se deshace:</strong> eliminar un documento o salir sin guardar. El diálogo bloquea el resto de la página hasta que se cierra. Para que un clic en el fondo no lo cierre, usa <code>{'closeOnBackdrop={false}'}</code>.
            </>,
            <>
              <strong>Resultados que no se pueden perder:</strong> un error o un éxito que debe leerse antes de continuar. Con <code>role=&quot;alertdialog&quot;</code>, el lector anuncia el título y la descripción al abrirse.
            </>,
            <>
              <strong>Decisiones con hasta tres acciones:</strong> Tertiary, Secondary y Primary. El foco empieza en la menos destructiva, así un Enter apresurado no borra nada.
            </>,
            <>
              <strong>Mensajes de una o dos frases:</strong> un título y, como máximo, una descripción destacada y un texto de apoyo.
            </>,
          ],
          avoid: [
            <>
              <strong>Mensajes que no necesitan respuesta:</strong> bloquear la página por un aviso cansa. (Alternativa: <code>Alert</code> para un mensaje en la página, <code>Toast</code> o <code>Snackbar</code> para uno temporal).
            </>,
            <>
              <strong>Formularios y contenido largo:</strong> solo admite texto, sin contenido libre. (Alternativa: <code>Modal</code>).
            </>,
            <>
              <strong>Un diálogo por cada acción:</strong> si se abre siempre, deja de leerse. Resérvalo para decisiones que lo valen.
            </>,
            <>
              <strong>Sin título ni nombre:</strong> sin <code>title</code>, el diálogo no tiene nombre accesible. Pasa un <code>aria-label</code>.
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
                title: 'Diálogo centrado',
                bullets: [
                  <>
                    <strong>Medidas:</strong> 480 de ancho, padding de 40 y 32 entre ícono, texto y acciones. El ícono mide 56 y el título 20/24.
                  </>,
                  <>
                    <strong>Muesca y velo:</strong> el cerrar de 40 va en la muesca y un velo con desenfoque cubre la página.
                  </>,
                ],
                preview: panel(),
              },
              {
                title: 'Acciones en fila',
                bullets: [
                  <>
                    <strong>Pie centrado:</strong> las acciones van en una fila con 16 entre ellas, en el orden Tertiary, Secondary, Primary.
                  </>,
                  <>
                    <strong>Si no caben:</strong> bajan a la línea siguiente sin salirse de la superficie.
                  </>,
                ],
                preview: panel({ tertiaryAction: undefined }),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Hoja inferior:</strong> por debajo de 768 px se pega al borde inferior, a todo el ancho y con radio de 24 arriba, sobre <code>background/container/surface</code>. Crece hasta el 90% del alto y el texto se desplaza. No dibuja el botón cerrar: cierran Escape, el fondo o una acción.
              </>,
              <>
                <strong>Medidas:</strong> asa de 48 × 2 arriba, padding de 16 arriba, 20 a los lados y 32 abajo, 24 entre partes, ícono de 48, título de 18/22 y descripción destacada de 14/20.
              </>,
              <>
                <strong>Acciones apiladas:</strong> ocupan todo el ancho, con Primary arriba. El tabulador mantiene el orden Tertiary, Secondary, Primary.
              </>,
            ],
            preview: panel(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> las mismas de Desktop, desde 768 px: 480 de ancho, padding de 40, ícono de 56 y título de 20/24.
              </>,
              <>
                <strong>Centrado:</strong> deja 16 px de margen con el borde de la pantalla y el cerrar va en la muesca.
              </>,
              <>
                <strong>Entrada mixta:</strong> con puntero, teclado o toque se cierra igual: Escape, el fondo, el cerrar o una acción.
              </>,
            ],
            preview: panel(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de redacción, tipo y longitud del mensaje.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Acciones con verbo',
              description: 'Nombra cada acción con el verbo que dice su resultado: Eliminar, Cancelar.',
              preview: panel({ tertiaryAction: undefined }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Sí y No',
              description: 'No uses Sí, No ni Aceptar: obligan a releer el título para saber qué pasará.',
              preview: panel({ tertiaryAction: undefined, primaryAction: { label: 'Sí' }, secondaryAction: { label: 'No' } }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Tipo según el mensaje',
              description: (
                <>
                  Usa <code>error</code> cuando algo falló y hay que repetirlo.
                </>
              ),
              preview: panel({ type: 'error', tertiaryAction: undefined, primaryAction: { label: 'Reintentar' } }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tipo que contradice',
              description: (
                <>
                  No uses <code>success</code> para un fallo: el ícono dice lo contrario del texto.
                </>
              ),
              preview: panel({ type: 'success', copy: 'error', tertiaryAction: undefined, primaryAction: { label: 'Reintentar' } }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Mensaje breve',
              description: 'Escribe un título y una descripción de una frase cada uno.',
              preview: panel({ tertiaryAction: undefined, body: null }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto extenso',
              description: (
                <>
                  No metas párrafos ni formularios: el diálogo no se hizo para leer ni rellenar. (Alternativa: <code>Modal</code>).
                </>
              ),
              preview: panel({
                tertiaryAction: undefined,
                body:
                  'Al eliminar el documento se borran también sus versiones, los comentarios de cada revisión, los permisos de las personas invitadas y los enlaces que compartiste fuera de la carpeta. Antes de continuar, revisa si alguien más necesita una copia y descárgala desde el historial de cambios.',
              }),
            },
          ],
        },
      ],
    },
  ],
};
