import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Alert } from './Alert';
import type { AlertType } from './Alert.types';

/*
 * Contenido de la página de documentación de Alert (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Alert.types.ts`, `Alert.variants.ts`, `Alert.tsx`), luego `Alert.docs.json`. Medidas: fila a todo el ancho del
 * contenedor (Figma la dibuja a 344), gap de 8, ícono de 20, título de 12/16 y descripción de 12/18; con fondo, padding de
 * 16 (12 en Mobile), radio de 16 y contorno de 0.5.
 * Diferencias con Figma: Figma suma el contorno al alto (75) y el código no (74). Figma no tiene `role` ni texto del tipo
 * para lectores de pantalla; el código antepone el tipo como texto sr-only y usa `role="status"` por defecto.
 */

// Figma: 11521:9733 (component set Alerts)

type AlertProps = Partial<ComponentProps<typeof Alert>>;

/** Aviso de ejemplo con título y descripción, al ancho de Figma (344) sin pasar del ancho disponible. */
const titled = (props: AlertProps = {}, title: ReactNode = 'Cambios guardados', description: ReactNode = 'Tu perfil se actualizó.') => (
  <div className="w-86 max-w-full">
    <Alert title={title} {...props}>
      {description}
    </Alert>
  </div>
);

/** Varios avisos en una columna, con `key`. */
const stack = (...items: ReactNode[]) => (
  <div className="flex w-full flex-col gap-ds-space-general-lg">
    {items.map((item, i) => (
      <Fragment key={i}>{item}</Fragment>
    ))}
  </div>
);

/** Por tipo, el título y la descripción de ejemplo. */
const COPY: Record<AlertType, [string, string]> = {
  success: ['Cambios guardados', 'Tu perfil se actualizó.'],
  alert: ['Sesión por vencer', 'Guarda tu trabajo antes de salir.'],
  error: ['No se pudo enviar', 'Revisa los campos marcados.'],
  info: ['Nueva versión', 'Actualiza para ver los cambios.'],
};

/** Un tipo con fondo y sin fondo. */
const byType = (type: AlertType): ReactNode[] => [
  titled({ type }, COPY[type][0], COPY[type][1]),
  titled({ type, background: false }, COPY[type][0], COPY[type][1]),
];

const states: DocStateItem[] = [
  {
    label: 'Success',
    tone: 'success',
    description: (
      <>
        Algo salió bien. Contorno e ícono en verde, con el ícono <code>tick-circle</code>. Es el valor por defecto (<code>type=&quot;success&quot;</code>).
      </>
    ),
    samples: byType('success'),
  },
  {
    label: 'Alert',
    tone: 'alert',
    description: (
      <>
        Algo requiere atención sin ser un fallo. Contorno e ícono en ámbar, con el ícono <code>warning</code>.
      </>
    ),
    samples: byType('alert'),
  },
  {
    label: 'Error',
    tone: 'error',
    description: (
      <>
        Algo falló o necesita corrección. Contorno e ícono en rojo, con el ícono <code>forbidden-2</code>.
      </>
    ),
    samples: byType('error'),
  },
  {
    label: 'Info',
    tone: 'neutral',
    description: (
      <>
        Dato que informa sin pedir nada. Contorno e ícono en azul, con el ícono <code>info-circle</code>.
      </>
    ),
    samples: byType('info'),
  },
];

/** Entradas de Tokens y modos de un tipo: contorno e ícono cambian; los textos son los mismos. */
const tokenEntries = (semantic: string, borderName = semantic) => [
  { part: 'Contorno', color: `border-semantic-${borderName}` },
  { part: 'Ícono', color: `icon-semantic-${semantic}-secondary` },
  { part: 'Título', color: 'text-neutral-heading', text: 'typography-heading-size-xs' },
  { part: 'Descripción', color: 'text-neutral-body', text: 'typography-body-size-sm' },
];

export const doc: ComponentDocContent = {
  name: 'Alert',
  icon: 'info-circle',
  classification: 'atomo',
  summary:
    'El Alert es el átomo para dar un mensaje en línea sobre el resultado de algo: éxito, advertencia, error o información. Une un ícono, un título y una descripción opcionales, y cambia de color según su tipo. Es solo lectura: no se cierra ni recibe foco.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una fila con el ícono a la izquierda y, a su lado, el título y la descripción en columna.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Alert con fondo',
                  preview: titled({ 'data-slot': 'alert' } as AlertProps),
                  marks: [
                    { n: 1, selector: '[data-slot="alert"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Subheading"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Description"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="alert"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Icon"]', to: '[data-figma-part="Information"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> fila a todo el ancho disponible, con radio de 16 (<code>radius/general/xl</code>) y un contorno de 0.5 por tipo (<code>border/semantic/*</code>). Su padding es de 16 (<code>space/container/on-card-stretch</code>) y entre el ícono y el texto hay 8.
                </>,
                <>
                  <strong>Ícono:</strong> 20 px y relleno, del color del tipo. Por defecto es el del tipo y se cambia con <code>icon</code>. Es decorativo: el tipo lo anuncia un texto solo para lectores de pantalla.
                </>,
                <>
                  <strong>Título:</strong> Prospero semibold de 12 con alto de línea de 16 (<code>typography/heading/size/xs</code>) y 4 de padding superior (<code>space/general/md</code>). Se escribe con <code>title</code> y es opcional.
                </>,
                <>
                  <strong>Descripción:</strong> Helvetica Neue regular de 12 con alto de línea de 18 (<code>typography/body/size/sm</code>), a 4 del título (<code>space/md</code>). Es el contenido (<code>children</code>) y es opcional.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Alert sin fondo',
                  preview: titled({ type: 'info', background: false, 'data-slot': 'alert' } as AlertProps, 'Nueva versión', 'Actualiza para ver los cambios.'),
                  marks: [
                    { n: 1, selector: '[data-slot="alert"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Information"]', side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'gap', from: '[data-figma-part="Icon"]', to: '[data-figma-part="Information"]' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> con <code>background=&#123;false&#125;</code> pierde el padding y el contorno, y el radio sube a 24 (<code>radius/general/2xl</code>). Sigue ocupando todo el ancho.
                </>,
                <>
                  <strong>Ícono:</strong> mide lo mismo y conserva el color del tipo, que es lo único que distingue al aviso sin contorno.
                </>,
                <>
                  <strong>Título y descripción:</strong> no cambian. Si falta uno, no se dibuja y el otro ocupa su lugar; el Alert funciona con solo título o con solo descripción.
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
          Alert tiene 4 variantes de aspecto, una por tipo. No es interactivo: no tiene hover, focus ni press y no recibe foco. Cada tipo se muestra con fondo y sin fondo.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de cada tipo con fondo. Sin fondo desaparece el contorno y lo demás no cambia. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            { title: 'Success', preview: titled({ type: 'success' }, COPY.success[0], COPY.success[1]), entries: tokenEntries('success') },
            { title: 'Alert', preview: titled({ type: 'alert' }, COPY.alert[0], COPY.alert[1]), entries: tokenEntries('alert') },
            { title: 'Error', preview: titled({ type: 'error' }, COPY.error[0], COPY.error[1]), entries: tokenEntries('error') },
            { title: 'Info', preview: titled({ type: 'info' }, COPY.info[0], COPY.info[1]), entries: tokenEntries('information') },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Alert en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Alerts en la librería de Assets y arrástralo a la vista. Sus propiedades son Type, Background, Tittle y Description.
            </>,
            <>
              <strong>Type y Background:</strong> Type tiene Success, Alert, Error e Info, que en código son <code>type</code> en minúscula. Background es True o False y en código es <code>background</code>, con true por defecto.
            </>,
            <>
              <strong>Tittle y Description:</strong> son un interruptor y un texto cada uno. En código no hay interruptor: el título se dibuja si pasas <code>title</code> y la descripción, si pasas <code>children</code>.
            </>,
            <>
              <strong>Diferencias:</strong> Figma no define el <code>role</code> ni el texto del tipo para lectores de pantalla; el código usa <code>role=&quot;status&quot;</code> y antepone el tipo (<code>label</code>). Figma suma el contorno al alto (75) y el código no (74).
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Alert es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Resultado de una acción:</strong> confirma, advierte o informa en la misma vista, como Cambios guardados. Queda visible hasta que la vista cambie.
            </>,
            <>
              <strong>Mensaje que ya estaba al cargar:</strong> con el <code>role=&quot;status&quot;</code> por defecto, el lector lo anuncia con cortesía y sin interrumpir.
            </>,
            <>
              <strong>Error urgente que aparece después:</strong> pasa <code>role=&quot;alert&quot;</code> para un error que surge tras enviar un formulario. Interrumpe al lector.
            </>,
            <>
              <strong>Aviso dentro de otra superficie:</strong> con <code>background=&#123;false&#125;</code> queda solo el ícono y el texto, sin contorno ni padding.
            </>,
          ],
          avoid: [
            <>
              <strong>Mensaje que desaparece solo:</strong> el Alert no se cierra ni tiene temporizador. (Alternativa: <code>Toast</code>).
            </>,
            <>
              <strong>Decisión que exige confirmar:</strong> el Alert no bloquea la vista ni espera una respuesta. (Alternativa: <code>AlertModal</code>).
            </>,
            <>
              <strong>Botones o enlaces dentro del aviso:</strong> el Alert es solo lectura y no recibe foco. (Alternativa: <code>Snackbar</code>, que admite una acción).
            </>,
            <>
              <strong>role=&quot;alert&quot; en avisos presentes al cargar:</strong> interrumpe al lector sin necesidad. Deja el <code>role=&quot;status&quot;</code> por defecto.
            </>,
            <>
              <strong>Informar solo con el color:</strong> el texto del tipo para lectores de pantalla no se quita. Una cadena vacía en <code>label</code> solo se usa si el título ya dice el tipo.
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
                title: 'Con fondo',
                bullets: [
                  <>
                    <strong>Padding:</strong> 16 (<code>space/container/on-card-stretch</code>), igual que en Tablet.
                  </>,
                  <>
                    <strong>Medidas:</strong> radio de 16, ícono de 20, título de 12/16 y descripción de 12/18.
                  </>,
                ],
                preview: titled({ type: 'info' }, COPY.info[0], COPY.info[1]),
              },
              {
                title: 'Sin fondo',
                bullets: [
                  <>
                    <strong>Padding:</strong> no tiene en ningún breakpoint.
                  </>,
                  <>
                    <strong>Medidas:</strong> radio de 24, ícono de 20, título de 12/16 y descripción de 12/18.
                  </>,
                ],
                preview: titled({ type: 'info', background: false }, COPY.info[0], COPY.info[1]),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Padding:</strong> 12 en Mobile (<code>space/container/on-card-stretch</code>), 4 menos que en Desktop y Tablet.
              </>,
              <>
                <strong>Medidas:</strong> radio de 16, ícono de 20 y texto de 12, sin cambios.
              </>,
              <>
                <strong>Ancho:</strong> ocupa todo el ancho del contenedor y el texto salta de línea; el alto crece con él.
              </>,
            ],
            preview: titled({ type: 'info' }, COPY.info[0], COPY.info[1]),
          },
          tablet: {
            bullets: [
              <>
                <strong>Padding:</strong> 16 (<code>space/container/on-card-stretch</code>), igual que en Desktop.
              </>,
              <>
                <strong>Medidas:</strong> radio de 16, ícono de 20 y texto de 12.
              </>,
              <>
                <strong>Ancho:</strong> ocupa todo el ancho del contenedor y el texto salta de línea; el alto crece con él.
              </>,
            ],
            preview: titled({ type: 'info' }, COPY.info[0], COPY.info[1]),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de tipo, texto y cantidad de avisos.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Tipo según el resultado',
              description: 'Usa success para un resultado correcto.',
              preview: titled({ type: 'success' }, 'Cambios guardados', 'Tu perfil se actualizó.'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tipo que contradice',
              description: 'No uses error para un resultado correcto.',
              preview: titled({ type: 'error' }, 'Cambios guardados', 'Tu perfil se actualizó.'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Error con salida',
              description: 'Di qué pasó y qué hacer.',
              preview: titled({ type: 'error', role: 'alert' }, 'No se pudo enviar', 'Revisa los campos marcados.'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Error sin salida',
              description: 'No dejes un error sin indicar qué corregir.',
              preview: titled({ type: 'error', role: 'alert' }, 'Error', 'Algo salió mal.'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Un aviso por mensaje',
              description: 'Deja uno: el segundo solo empuja el contenido.',
              preview: titled({ type: 'info' }, 'Nueva versión', 'Actualiza para ver los cambios.'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Avisos repetidos',
              description: 'No apiles avisos con el mismo mensaje.',
              preview: stack(
                titled({ type: 'info' }, 'Nueva versión', 'Actualiza para ver los cambios.'),
                titled({ type: 'info' }, 'Nueva versión', 'Actualiza para ver los cambios.')
              ),
            },
          ],
        },
      ],
    },
  ],
};
