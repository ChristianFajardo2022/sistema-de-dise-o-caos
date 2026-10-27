import type { ComponentDocContent } from '../../docs/types';
import { DocTag } from '../../docs/DocParts';
import { Avatar, AvatarGroup } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/Icon.types';
import { PopoverPanel } from '../Popover/PopoverPanel';
import { Tooltip } from './Tooltip';
import { TooltipBubble } from './TooltipBubble';
import type { TooltipBubbleProps } from './Tooltip.types';

/*
 * Contenido de la página de documentación de Tooltip (Figma: "Documentación Tooltip — Definición" 22159:22799 y
 * "— Aplicación" 22159:22689). Los textos son los de Figma salvo donde contradicen al código (manda el código):
 * nombres y valores de props, retardos (300 / 150 ms), separación con el disparador (4 px), ancho máximo (288 px),
 * y el sentido de las posiciones (`arrow` es el borde de la flecha; la burbuja va del lado opuesto).
 */

/**
 * Disparador vivo: botón de ícono con su tooltip real (pasa el puntero o enfócalo). El tooltip es el nombre del botón
 * (`describes="label"`): `aria-labelledby` apunta a la burbuja, sin `aria-label`. `id` debe ser único en la página.
 */
const liveTrigger = (id: string, icon: IconName, label: string, focused = false) => (
  <Tooltip id={id} content={label} describes="label">
    <Button iconOnly variant="secondary" size="sm" state={focused ? 'focus' : undefined} aria-labelledby={id}>
      <Icon name={icon} size={20} variant="line" />
    </Button>
  </Tooltip>
);

const PEOPLE = [
  { name: 'Ana Pérez', photo: PHOTO_SRC.Woman_1 },
  { name: 'Hugo García', photo: PHOTO_SRC.Men_1 },
  { name: 'Lucía Torres', photo: PHOTO_SRC.Woman_2 },
  { name: 'Mateo Ruiz', photo: PHOTO_SRC.Men_2 },
  { name: 'Sara Molina', photo: PHOTO_SRC.Woman_3 },
  { name: 'Diego Vega', photo: PHOTO_SRC.Men_3 },
];

const actions = (
  <>
    <Button variant="tertiary" size="xs" unicolor>
      Omitir
    </Button>
    <Button variant="secondary" contrast="low" size="xs" unicolor>
      Siguiente
    </Button>
  </>
);

const bubble = (text: string, props: TooltipBubbleProps = {}) => (
  <TooltipBubble {...props}>
    {text}
  </TooltipBubble>
);

export const doc: ComponentDocContent = {
  name: 'Tooltip',
  icon: 'info-circle',
  classification: 'atomo',
  summary:
    'Mensaje contextual breve que proporciona aclaraciones sobre un elemento o función sin interrumpir el flujo del usuario. Se clasifica como un Átomo (Tooltip simple) y evoluciona a una Molécula / Composición (Rich Tooltip) para guías asistidas.',

  definition: [
    {
      title: 'Definición del componente',
      description:
        'El Tooltip muestra información complementaria no vital al pasar el puntero (hover) o al enfocar (focus) un elemento. Aclara el significado de iconos, controles o datos abreviados sin sustituir etiquetas esenciales ni requerir una acción obligatoria.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Tooltip simple',
              eyebrow: 'Átomo principal',
              previewSize: 'lg',
              preview: bubble('Editar perfil'),
              description: [
                'Uso exclusivo para mensajes breves, informativos y no interactivos asociados a un único elemento disparador.',
                <>
                  <strong>Anatomía:</strong> contenedor, indicador/flecha y texto descriptivo. <strong>Posiciones soportadas:</strong>{' '}
                  top, bottom, left, right (prop <code>arrow</code>).
                  <br />
                  <strong>Comportamiento:</strong> se activa por hover o focus. Se oculta al retirar el puntero o desenfocar (blur).
                </>,
              ],
            },
            {
              title: 'Rich tooltip',
              eyebrow: 'Composición',
              preview: (
                <PopoverPanel arrow="center-top" headingLevel="none" title="Personaliza tu espacio" page="1 de 2" actions={actions}>
                  Conoce cómo personalizar tu espacio de trabajo.
                </PopoverPanel>
              ),
              description: [
                <>
                  Contenedor usado para orientación progresiva, onboarding o explicaciones compuestas. Puede incluir elementos interactivos. En
                  código es el componente <code>Popover</code>.
                </>,
                <>
                  <strong>Anatomía:</strong> contenedor, título, cuerpo/párrafo, contenido visual/imagen opcional, paginación y acciones (botones).
                  <br />
                  <strong>Posiciones soportadas:</strong> 8 posiciones de flecha (<code>top-left</code>, <code>center-top</code>,{' '}
                  <code>top-right</code>, <code>bottom-left</code>, etc.).
                  <br />
                  <strong>Comportamiento:</strong> se activa por click o interacción guiada. Requiere un mecanismo explícito de cierre (botón o clic
                  fuera).
                </>,
              ],
            },
          ],
        },
        {
          type: 'table',
          caption: 'Niveles del componente',
          columns: ['Nivel', 'Propiedades reales', 'Uso'],
          rows: [
            [
              'Tooltip',
              <>
                <code>arrow</code>: top · bottom · right · left | <code>solid</code>: true · false
              </>,
              'Ayuda contextual breve y no interactiva.',
            ],
            [
              'Rich tooltip (Popover)',
              <>
                <code>type</code>: simple · complex | <code>arrow</code>: 8 posiciones | <code>media</code>: con o sin |{' '}
                <code>title</code> · <code>link</code> · <code>actions</code>
              </>,
              'Explicación compuesta, onboarding o guía contextual.',
            ],
          ],
        },
      ],
    },
    {
      title: 'Propósito y anatomía',
      description:
        'Revelar información contextual secundaria en el momento preciso de la interacción. Se vincula visual y semánticamente a un elemento disparador (trigger) mediante un indicador visual (flecha).',
      blocks: [
        {
          type: 'usage',
          use: [
            'Aclarar iconografía: explicar iconos interactivos o descriptivos cuyo significado no sea universal.',
            'Expandir datos reducidos: ampliar información abreviada, textos truncados o términos técnicos/especializados.',
            'Contexto secundario: aportar información breve sin interrumpir la tarea actual ni cambiar el flujo de navegación.',
          ],
          avoid: [
            'Información crítica: no ocultar instrucciones necesarias para completar una tarea o formulario (usar texto de ayuda permanente / helper text).',
            'Contenido interactivo: no incluir formularios, enlaces ni acciones dentro de un Tooltip simple (usar Rich Tooltip).',
            'Notificaciones de estado: no usar para mensajes de error, confirmaciones ni textos extensos (usar Alert o Toast).',
          ],
        },
        {
          type: 'anatomy',
          preview: (
            <>
              {bubble('Descargar reporte', { arrow: 'bottom' })}
              {liveTrigger('tooltip-doc-anatomia', 'download', 'Descargar reporte')}
            </>
          ),
          parts: [
            { name: 'Contenedor', description: 'superficie que agrupa y da contraste al mensaje.' },
            { name: 'Flecha', description: 'indicador direccional que une visualmente el tooltip con su disparador.' },
            { name: 'Icono opcional', description: 'refuerza el carácter informativo sin reemplazar el texto.' },
            { name: 'Mensaje', description: 'texto breve, conciso y específico asociado directamente al elemento.' },
            { name: 'Disparador', description: 'control o elemento interactivo (ej. Botón, Icono) que recibe el hover o focus.' },
          ],
        },
      ],
    },
    {
      title: 'Propiedades y variantes',
      description:
        'Las propiedades controlan la orientación espacial, el tratamiento visual de la superficie, la presencia de elementos gráficos y el contenido del Tooltip.',
      blocks: [
        {
          type: 'table',
          caption: 'Propiedades del Tooltip',
          columns: ['Propiedad', 'Valores', 'Descripción'],
          rows: [
            [
              <code key="p">arrow</code>,
              'top · bottom · right · left',
              'Borde de la burbuja donde va la flecha (Position en Figma). La burbuja aparece del lado opuesto del disparador y la flecha lo apunta. Por defecto bottom.',
            ],
            [<code key="p">solid</code>, 'true · false', '“true” usa superficie opaca. “false” usa una superficie translúcida para contextos con menor contraste.'],
            [<code key="p">content</code>, 'ReactNode', 'Contenido breve; recomendado entre 2 y 8 palabras y una sola idea.'],
          ],
        },
        {
          type: 'gallery',
          title: 'Posiciones básicas',
          items: [
            {
              label: 'Top',
              preview: bubble('Información adicional', { arrow: 'top' }),
              description: 'Flecha arriba: la burbuja aparece debajo del disparador. Para elementos junto al borde superior de la pantalla o cuando no cabe encima.',
            },
            {
              label: 'Bottom',
              preview: bubble('Información adicional', { arrow: 'bottom' }),
              description: 'Posición por defecto. Flecha abajo: la burbuja se ubica encima del disparador, centrada, si hay espacio libre suficiente.',
            },
            {
              label: 'Right',
              preview: bubble('Información adicional', { arrow: 'right' }),
              description: 'Flecha a la derecha: la burbuja aparece a la izquierda del disparador. Útil en paneles laterales derechos o controles de margen final.',
            },
            {
              label: 'Left',
              preview: bubble('Información adicional', { arrow: 'left' }),
              description: 'Flecha a la izquierda: la burbuja aparece a la derecha del disparador. Útil en barras de navegación laterales (sidebars) o listas compactas.',
            },
          ],
        },
        {
          type: 'cards',
          items: [
            {
              title: 'Solid · true',
              preview: bubble('Ver detalle'),
              description:
                'Uso recomendado: variante predeterminada y preferida. Mantiene un contraste elevado y consistente sobre cualquier tipo de fondo o contenido dinámico.',
            },
            {
              title: 'Solid · false',
              preview: bubble('Ver detalle', { solid: false }),
              description:
                'Uso recomendado: úsalo únicamente cuando el fondo de la interfaz sea homogéneo, garantice la accesibilidad de contraste suficiente y no compita visualmente con el texto del tooltip.',
            },
          ],
        },
      ],
    },
    {
      title: 'Estados y especificaciones de layout',
      description:
        'El Tooltip permanece oculto en reposo y se despliega tras recibir un evento de hover o focus. Su geometría e intervalos se mantienen idénticos independientemente del método de entrada (puntero o teclado). La posición puede variar para evitar recortes con los bordes de la pantalla (viewport).',
      blocks: [
        {
          type: 'gallery',
          title: 'Matriz de estados',
          align: 'start',
          items: [
            { label: 'Reposo', preview: liveTrigger('tooltip-doc-reposo', 'message-question', 'Ayuda'), description: 'Oculto hasta que el disparador recibe hover o foco.' },
            { label: 'Hover / Focus', preview: bubble('Hover / Focus'), description: 'Espera breve y conserva visible el disparador.' },
            { label: 'Visible', preview: bubble('Visible'), description: 'Mensaje legible y flecha alineada al centro del objetivo.' },
            { label: 'Salida', preview: liveTrigger('tooltip-doc-salida', 'message-question', 'Más ayuda'), description: 'Se oculta al perder hover/foco o pulsar Escape.' },
          ],
        },
        {
          type: 'table',
          caption: 'Especificaciones de layout',
          columns: ['Elemento', 'Medida', 'Separación', 'Alineación'],
          rows: [
            ['Contenedor simple', 'Alto 34 px (42 con la flecha arriba o abajo) · ancho según texto', 'Padding 8 px', 'Texto centrado verticalmente'],
            ['Flecha', '16 × 8 px', 'Unida al borde del contenedor', 'Apunta al centro del disparador'],
            ['Distancia al disparador', '4 px', 'Nunca superponer el objetivo; 8 px mínimos con el borde de la pantalla', 'Centrada; admite desplazamiento seguro'],
            ['Ancho máximo', '288 px', 'Una idea por mensaje', 'Texto alineado al inicio si envuelve'],
          ],
        },
        {
          type: 'note',
          tone: 'info',
          content:
            'La posición declarada por el diseñador o desarrollador actúa como preferencia. Si el tooltip colisiona con los bordes del viewport o con un contenedor con propiedad overflow: hidden, debe invertir su orientación (ej. de Top a Bottom) o desplazarse lateralmente sin perder la conexión visual con su disparador.',
        },
      ],
    },
    {
      title: 'Estados compuestos y ejemplos base',
      description:
        'El Rich Tooltip extiende el patrón básico para proporcionar orientación contextual de mayor jerarquía (onboarding, explicaciones compuestas o funciones nuevas). Al contener elementos interactivos, sus acciones deben ser explícitas, limitadas y completamente accesibles mediante navegación por teclado.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Orientación breve',
              preview: (
                <>
                  <PopoverPanel arrow="center-top" headingLevel="none" title="Filtra tus pedidos" page="1 de 2" actions={actions}>
                    Usa los filtros para encontrar pedidos por estado.
                  </PopoverPanel>
                  <DocTag>Sin recurso visual</DocTag>
                </>
              ),
              description: [
                'Estructura ligera diseñada para onboarding progresivo o introducción de características dentro del flujo de trabajo.',
                <>
                  <strong>Anatomía:</strong> título, párrafo descriptivo, enlace opcional, paginación y hasta 2 botones de acción.
                  <br />
                  <strong>Uso recomendado:</strong> mostrar pasos secuenciales en herramientas complejas o guiar en la configuración inicial de una
                  función.
                </>,
              ],
            },
            {
              title: 'Orientación con contenido visual',
              preview: (
                <>
                  <Avatar name="Hugo García" size="lg" />
                  <PopoverPanel
                    arrow="center-top"
                    headingLevel="none"
                    title="Gestiona tu equipo"
                    page="2 de 2"
                    actions={actions}
                    onClose={() => {}}
                    media={
                      <>
                        <AvatarGroup aria-label="Participantes" max={4} size="sm">
                          {PEOPLE.map((p) => (
                            <Avatar key={p.name} variant="photo" src={p.photo} alt={p.name} />
                          ))}
                        </AvatarGroup>
                        <Button size="xs">Unirme</Button>
                      </>
                    }
                  >
                    Revisa participantes y permisos antes de compartir.
                  </PopoverPanel>
                </>
              ),
              description: [
                'Estructura de alto impacto que incorpora elementos gráficos (imágenes, avatares o agrupaciones de usuarios).',
                <>
                  <strong>Anatomía:</strong> botón de cierre (CloseButton), área visual / media slot, título, párrafo descriptivo, paginación y
                  acciones (máximo 2).
                  <br />
                  <strong>Uso recomendado:</strong> explicar funciones conceptuales donde una imagen o avatar añada contexto inmediato.
                </>,
              ],
            },
          ],
        },
        {
          type: 'table',
          caption: 'Composiciones base',
          columns: ['Composición', 'Incluye', 'Recomendación'],
          rows: [
            ['Tooltip', 'Icono opcional + mensaje', 'Ayuda inmediata de una sola idea.'],
            ['Rich tooltip informativo', 'Título + párrafo + cerrar', 'Explicación contextual extensa que el usuario puede descartar voluntariamente.'],
            ['Rich tooltip guiado', 'Contenido + paginación + hasta 2 acciones', 'Secuencia corta, con progreso y salida disponible.'],
          ],
        },
      ],
    },
  ],

  application: [
    {
      title: 'Comportamiento y reglas de uso',
      description:
        'El Tooltip actúa como una respuesta secundaria a eventos de hover o focus. Permanece visible mientras el usuario interactúa con el elemento disparador o con el propio contenedor, y se oculta automáticamente sin alterar el estado actual de la interfaz.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Apertura y permanencia',
              bullets: [
                <>
                  <strong>Disparadores (Triggers):</strong> se activa mediante paso del puntero (hover) o al recibir foco mediante teclado (focus). No
                  aparece con toque.
                </>,
                <>
                  <strong>Retardo de apertura (intent delay):</strong> se aplica una demora intencional de 300 ms (prop <code>delay</code>) antes de
                  desplegar la superficie para evitar apariciones accidentales durante el movimiento rápido del cursor.
                </>,
                <>
                  <strong>Área de recorrido seguro (hoverable):</strong> el tooltip debe permanecer visible si el puntero se desplaza desde el
                  disparador hacia el interior del propio tooltip. La separación (4 px) no rompe el evento de hover: el retardo de salida da tiempo a
                  cruzarla.
                </>,
                <>
                  <strong>Persistencia de posición:</strong> mantiene la relación visual con el disparador aunque la posición se invierta por colisión
                  con los bordes de la pantalla (auto-placement).
                </>,
              ],
            },
            {
              title: 'Cierre y disponibilidad',
              bullets: [
                <>
                  Retardo de salida (exit delay): al retirar el puntero se aplica un retraso breve de 150 ms (prop <code>closeDelay</code>) para
                  permitir movimientos accidentales sin cerrar el mensaje de forma abrupta. Al perder el foco se oculta de inmediato.
                </>,
                'Descarte por teclado: presionar la tecla Escape cierra el tooltip de inmediato sin perder ni desplazar el foco del elemento disparador.',
                'Bloqueo e interacción: un Tooltip simple nunca debe bloquear el resto de la interfaz ni capturar el foco del teclado.',
              ],
            },
          ],
        },
        {
          type: 'gallery',
          title: 'Respuesta a la interacción',
          columns: 3,
          items: [
            { label: 'Reposo', preview: liveTrigger('tooltip-doc-respuesta', 'download', 'Descargar reporte'), description: 'Tooltip oculto' },
            { label: 'Hover / Focus', preview: bubble('Descargar reporte'), description: 'Aparece tras una demora breve' },
            { label: 'Escape / Salida', preview: liveTrigger('tooltip-doc-escape', 'download', 'Descargar informe', true), description: 'Se oculta; el foco permanece' },
          ],
        },
        {
          type: 'note',
          tone: 'warning',
          content:
            'No utilices Tooltips para información crítica, errores de validación o instrucciones indispensables para completar una tarea. Todo contenido esencial que el usuario deba recordar o consultar continuamente debe permanecer visible en la interfaz o presentarse a través de un patrón persistente (Helper Text, Inline Alert o Banner).',
        },
      ],
    },
    {
      title: 'Buenas y malas prácticas (Dos and Don’ts)',
      description:
        'Conoce las reglas de aplicación del Tooltip para garantizar mensajes oportunos, concisos, legibles, accesibles y correctamente anclados al elemento que describen.',
      blocks: [
        {
          type: 'practices',
          items: [
            { kind: 'do', title: 'Describe el resultado', description: 'Describe con precisión la función o el resultado de la acción.' },
            {
              kind: 'dont',
              title: 'No repitas la misma palabra o etiqueta que ya es visible en el elemento',
              description: 'Si el botón muestra el texto "Descargar", no agregues un tooltip que vuelva a decir "Descargar".',
            },
            {
              kind: 'do',
              title: 'Mantén la brevedad del mensaje',
              description: 'Transmite una sola idea directa con una longitud que se pueda leer de un vistazo (2 a 8 palabras).',
            },
            {
              kind: 'dont',
              title: 'No incluyas elementos interactivos',
              description: 'No incluyas enlaces, botones, formularios ni controles interactivos dentro de un Tooltip simple.',
            },
            {
              kind: 'do',
              title: 'Garantiza la accesibilidad por foco',
              description: 'Haz que el tooltip esté disponible tanto al pasar el puntero (hover) como al navegar con teclado (focus-visible).',
            },
            { kind: 'dont', title: 'No dependas exclusivamente del hover', description: 'No diseñes interacciones que funcionen únicamente con el mouse.' },
            {
              kind: 'do',
              title: 'Reubica automáticamente',
              description:
                'Invierte o desplaza la orientación (Top/Bottom, Left/Right) cuando falte espacio en el viewport, conservando la flecha orientada al disparador.',
            },
            {
              kind: 'dont',
              title: 'No ocultes el disparador',
              description:
                'No permitas que el contenedor del tooltip se superponga o tape el elemento disparador ni la información adyacente indispensable.',
            },
          ],
        },
      ],
    },
  ],
};
