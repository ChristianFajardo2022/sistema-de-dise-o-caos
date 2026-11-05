import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { ChatAudioPlayer } from './ChatAudioPlayer';

/*
 * Contenido de la página de documentación de ChatAudioPlayer (plantilla v2). Manda el código
 * (`ChatAudioPlayer.types.ts`, `ChatAudioPlayer.variants.ts`, `ChatAudioPlayer.tsx`), luego `ChatAudioPlayer.docs.json`.
 * El componente no tiene set propio de Figma; sus partes se toman del marco Reproductor.
 */

const player = (props: Partial<ComponentProps<typeof ChatAudioPlayer>> = {}, width = 360) => (
  <div className="w-full" style={{ maxWidth: width }}>
    <ChatAudioPlayer duration={74} {...props} />
  </div>
);

/** Reproductor en un ancho dado (px), para mostrar la onda en un espacio justo. */
const playerWidth = (width: number) => (
  <div className="w-full" style={{ maxWidth: width }}>
    <ChatAudioPlayer duration={74} defaultCurrentTime={37} />
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'En pausa',
    tone: 'neutral',
    description: <>El botón anuncia «Reproducir audio» y las barras encendidas muestran la posición actual. La onda es un control <code>range</code> nativo: mueve la posición con teclado, clic o arrastre y expone el tiempo con <code>aria-valuetext</code>.</>,
    samples: [player({ defaultCurrentTime: 37 })],
  },
  {
    label: 'Reproduciendo',
    tone: 'accent',
    description: <>El botón anuncia «Pausar audio». Las barras encendidas representan el avance; con <code>src</code>, el elemento de audio interno reproduce el archivo.</>,
    samples: [player({ defaultPlaying: true, defaultCurrentTime: 37 })],
  },
  {
    label: 'Sin duración',
    tone: 'neutral',
    description: 'Si la duración no es mayor que cero, la búsqueda queda deshabilitada y la onda no responde a la posición.',
    samples: [player({ duration: 0 })],
  },
];

const samePlayer = () => player({ defaultCurrentTime: 20 });

export const doc: ComponentDocContent = {
  name: 'ChatAudioPlayer',
  icon: 'play',
  classification: 'molecula',
  summary: 'ChatAudioPlayer es la molécula que reproduce o presenta la duración y la posición de un audio en un mensaje o en el composer. Combina un botón de reproducción, una onda buscable y una duración; puede gestionar un archivo de audio o recibir el estado desde quien lo integra.',
  definition: [
    {
      title: 'Anatomía',
      description: 'El reproductor reúne un botón, una onda de barras y la duración; las posiciones del botón y de la duración dependen del contexto.',
      blocks: [{
        type: 'anatomy',
        groups: [{
          canvases: [{
            label: 'Reproductor en composer',
            preview: player(),
            marks: [
              { n: 1, selector: '[data-figma-part="Button"]', side: 'left' },
              { n: 2, selector: '[data-figma-part="Onda de audio"]', side: 'top' },
              { n: 3, selector: '[data-figma-part="Hora"]', side: 'right' },
            ],
            dimensions: [
              { kind: 'height', selector: '[data-figma-part="Button"]' },
              { kind: 'height', selector: '[data-figma-part="Onda de audio"]' },
            ],
          }, {
            label: 'Reproductor en mensaje',
            preview: player({ timePosition: 'start', buttonPosition: 'end' }),
            marks: [
              { n: 1, selector: '[data-figma-part="Button"]', side: 'right' },
              { n: 2, selector: '[data-figma-part="Onda de audio"]', side: 'top' },
              { n: 3, selector: '[data-figma-part="Hora"]', side: 'left' },
            ],
          }],
          guidelines: [
            <><strong>Botón:</strong> botón de solo ícono <code>Button</code> en tamaño xs (32 px), con variante <code>secondary</code> por defecto o <code>primary</code>. Su nombre accesible cambia entre reproducir y pausar.</>,
            <><strong>Onda de audio:</strong> ocupa el espacio disponible, mide 26 px de alto y contiene barras de 3 px con separación de 3 px. Las barras reproducidas usan <code>background-acent-tertiary</code>; las demás, <code>background-general-gray-fifth</code>.</>,
            <><strong>Duración:</strong> muestra la duración como <code>m:ss</code> (o <code>h:mm:ss</code> desde una hora), en tipografía de 12 px. Puede ir antes o después de la onda.</>,
          ],
        }],
      }],
    },
    {
      title: 'Estados',
      description: <>ChatAudioPlayer tiene 3 estados: en pausa, reproduciendo y sin duración. La posición de las barras encendidas cambia dentro de los dos primeros. El componente no expone una prop para forzar estados visuales de hover o foco.</>,
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: <>Tokens de color y tipografía usados por la onda y la duración. El botón hereda los tokens de <code>Button</code>. Dentro de un mensaje de chat, la duración hereda el color del texto de la burbuja.</>,
      titleInside: true,
      blocks: [{ type: 'tokens', groups: [{
        title: 'Onda y duración',
        preview: player(),
        entries: [
          { part: 'Barras reproducidas', color: 'background-acent-tertiary' },
          { part: 'Barras pendientes', color: 'background-general-gray-fifth' },
          { part: 'Foco de búsqueda', color: 'border-field-active' },
          { part: 'Duración', color: 'text-neutral-body', text: 'primitives-typography-size-sm' },
        ],
      }] }],
    },
    {
      title: 'Uso del componente ChatAudioPlayer en Figma:',
      description: '',
      titleInside: true,
      blocks: [{ type: 'figma', bullets: [
        <><strong>Ubicación:</strong> no hay un set propio. El marco «Reproductor» aparece en Conversacion (Atom), Audio (Atom) y en la pantalla Chat; el código lo reutilizan <code>ChatMessage</code> y <code>ChatComposer</code>.</>,
        <><strong>Composición:</strong> el botón, la onda y la duración corresponden a las capas «Button», «Onda de audio» y «Hora» (en Figma, «Hora» es la duración del audio). El código permite cambiar la posición con <code>buttonPosition</code> y <code>timePosition</code>.</>,
        <><strong>Variantes:</strong> <code>buttonVariant=&quot;primary&quot;</code> corresponde al botón relleno del composer móvil; <code>secondary</code> es el valor por defecto. Las variantes de posición se definen en código.</>,
        <><strong>Diferencias:</strong> Figma muestra el marco estático; el código añade reproducción, búsqueda por teclado, foco visible y etiquetas accesibles. No se encontró una spec con propiedades responsive del reproductor.</>,
      ] }],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo ChatAudioPlayer es la pieza correcta y cuándo conviene otra.',
      blocks: [{ type: 'usage',
        use: [
          <><strong>Audio en una conversación:</strong> muestra la duración y permite buscar dentro de una nota de voz junto al mensaje.</>,
          <><strong>Vista previa de audio:</strong> intégralo en el composer para revisar la grabación antes de enviarla.</>,
          <><strong>Reproducción interna:</strong> pasa <code>src</code> para que el componente gestione el elemento de audio, la pausa y el avance.</>,
          <><strong>Estado externo:</strong> usa <code>playing</code> y <code>currentTime</code> con sus callbacks si la reproducción la controla otra parte de la aplicación.</>,
        ],
        avoid: [
          <><strong>Audio sin duración:</strong> no uses el reproductor si no puedes proporcionar <code>duration</code>. (Alternativa: <code>FileCard</code>, que presenta el archivo sin duración).</>,
          <><strong>Reproductor de música completo:</strong> evita esta pieza si necesitas volumen, listas o selección de pistas. CAOS no tiene un componente para esa experiencia.</>,
          <><strong>Solo mostrar un archivo:</strong> no uses el reproductor si la acción es abrir o descargar el archivo. (Alternativa: <code>FileCard</code>).</>,
        ],
      }],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [{ type: 'breakpoints',
        desktop: { columns: [{ title: 'Composer', bullets: [<><strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.</>, <>La variante de botón por defecto es <code>secondary</code>.</>], preview: samePlayer() }] },
        mobile: { bullets: [<><strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.</>, <>El botón mantiene el tamaño xs de 32 px.</>, <>La onda ocupa el ancho disponible y reduce sus barras al espacio medido.</>], preview: samePlayer() },
        tablet: { bullets: [<><strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.</>, <>El botón mantiene el tamaño xs de 32 px.</>, <>La onda ocupa el ancho disponible y reduce sus barras al espacio medido.</>], preview: samePlayer() },
      }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios de uso para integrar el reproductor en un mensaje o composer.',
      blocks: [{ type: 'practices', items: [
        { kind: 'do', framed: true, title: 'Indica la duración', description: 'Pasa la duración real en segundos para que la etiqueta y la búsqueda compartan el mismo límite.', preview: player({ duration: 74 }) },
        { kind: 'dont', framed: true, title: 'Duración no disponible', description: 'No presentes una onda buscable cuando no conoces la duración real.', preview: player({ duration: 0 }) },
        { kind: 'do', framed: true, title: 'Etiquetas descriptivas', description: 'Mantén nombres que expliquen reproducir, pausar y buscar para la tecnología de asistencia.', preview: player({ playLabel: 'Reproducir nota de voz', pauseLabel: 'Pausar nota de voz', seekLabel: 'Posición de la nota de voz' }) },
        { kind: 'dont', framed: true, title: 'Etiquetas genéricas', description: 'No reemplaces los nombres accesibles por etiquetas sin contexto.', preview: player({ playLabel: 'Botón', pauseLabel: 'Botón', seekLabel: 'Control' }) },
        { kind: 'do', framed: true, title: 'Ancho suficiente', description: 'Dale el ancho de la burbuja o del composer para que la onda muestre la posición con claridad.', preview: playerWidth(360) },
        { kind: 'dont', framed: true, title: 'Ancho demasiado corto', description: 'No lo encajes en un espacio de pocos píxeles: la onda se reduce a unas pocas barras y la posición deja de leerse.', preview: playerWidth(140) },
      ] }],
    },
  ],
};
