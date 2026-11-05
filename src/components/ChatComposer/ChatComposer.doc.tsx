import type { ComponentProps } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Button } from '../Button';
import { ChatAudioPlayer } from '../ChatAudioPlayer';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/Icon.types';
import { ChatComposer } from './ChatComposer';

/*
 * Contenido de la página de documentación de ChatComposer (plantilla v2). Manda el código
 * (`ChatComposer.types.ts`, `ChatComposer.variants.ts`, `ChatComposer.tsx`), luego `ChatComposer.docs.json`.
 * El set de Figma se llama "Audio (Atom)", aunque representa el composer de texto.
 */

const iconButton = (icon: IconName, label: string, touch = false) => (
  <Button iconOnly variant="secondary" size={touch ? 'sm' : 'xs'} aria-label={label}>
    <Icon name={icon} size={touch ? 20 : 16} variant="fill" />
  </Button>
);

const attachmentButtons = (touch = false) => (
  <>
    {iconButton('folder', 'Adjuntar documento', touch)}
    {iconButton('image', 'Adjuntar imagen', touch)}
  </>
);

const audioPreview = (touch = false) => (
  <ChatAudioPlayer duration={42} defaultCurrentTime={8} buttonVariant={touch ? 'primary' : 'secondary'} buttonPosition="end" />
);

const composer = (props: Partial<ComponentProps<typeof ChatComposer>> = {}) => (
  <ChatComposer
    placeholder="Revisar las notas de la reunión"
    onSend={() => {}}
    onRecord={() => {}}
    attachments={attachmentButtons()}
    {...props}
  />
);

const withAudio = (props: Partial<ComponentProps<typeof ChatComposer>> = {}) => (
  <ChatComposer
    attachments={attachmentButtons()}
    audio={audioPreview()}
    onRecord={() => {}}
    onSendAudio={() => {}}
    {...props}
  />
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Campo de texto con Enviar, Grabar y la fila opcional de adjuntos. Enter envía el texto; Shift+Enter agrega una línea.',
    samples: [composer()],
  },
  {
    label: 'State3',
    tone: 'neutral',
    description: <>El audio grabado reemplaza el campo. En Figma, dos variantes comparten el nombre <code>State3</code>; el código activa este aspecto con <code>audio</code>.</>,
    samples: [withAudio()],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: 'Deshabilita el campo y los botones propios. Los controles que se pasan por slots, como los adjuntos, mantienen su estado independiente.',
    samples: [composer({ disabled: true })],
  },
];

const touchComposer = () => composer({ touch: true, attachments: iconButton('add-2', 'Adjuntar', true) });

export const doc: ComponentDocContent = {
  name: 'ChatComposer',
  icon: 'send2',
  classification: 'molecula',
  summary: 'ChatComposer es la molécula para escribir y enviar mensajes dentro de una conversación. Combina un campo accesible con acciones de envío, grabación y adjuntos; también puede reemplazar el campo por una grabación lista para enviar.',
  definition: [
    {
      title: 'Anatomía',
      description: 'El composer agrupa el campo y sus controles en una fila superior; los adjuntos y las acciones de audio pueden ocupar una fila inferior.',
      blocks: [{ type: 'anatomy', groups: [{
        canvases: [{
          label: 'Mensaje con adjuntos',
          preview: composer(),
          marks: [
            { n: 1, selector: '[data-figma-part="Frame 1984080613"]', side: 'left' },
            { n: 2, selector: '[data-figma-part="Escribe un mensaje..."]', side: 'top' },
            { n: 3, selector: '[data-figma-part="Button"]', side: 'right' },
            { n: 4, selector: '[data-figma-part="Button"]', index: -1, side: 'right' },
            { n: 5, selector: '[data-figma-part="CTA"]', side: 'bottom' },
          ],
          dimensions: [
            { kind: 'height', selector: '[data-figma-part="Frame 1984080613"]' },
            { kind: 'padding', selector: '[data-figma-part="Frame 1984080613"]', side: 'left' },
          ],
        }],
        guidelines: [
          <><strong>Contenedor:</strong> fondo <code>background-container-default-on-card</code>, radio de 24 px en escritorio y padding de 16 px. El modo táctil quita el borde y cambia el padding a 8 px arriba, abajo y a la derecha, y 16 px a la izquierda.</>,
          <><strong>Campo:</strong> superficie secundaria con radio de 16 px, padding de 12 px y altura mínima de 64 px. El foco visible aparece en el contenedor del campo.</>,
          <><strong>Texto:</strong> usa la tipografía de campo sm (14 px/18 px). El área crece con el contenido hasta siete líneas; como mejora progresiva, en navegadores sin <code>field-sizing</code> conserva dos filas con desplazamiento.</>,
          <><strong>Enviar:</strong> botón Primary de solo ícono con nombre accesible <code>Enviar mensaje</code>. Se mantiene habilitado con el campo vacío, pero no envía texto vacío.</>,
          <><strong>Grabar y adjuntos:</strong> Grabar aparece cuando pasas <code>onRecord</code>. Los controles de <code>attachments</code> se muestran en la fila inferior y conservan sus nombres accesibles.</>,
        ],
      }, {
        canvases: [{
          label: 'Audio listo para enviar',
          preview: withAudio(),
          marks: [
            { n: 1, selector: '[data-figma-part="Onda de audio"]', side: 'top' },
            { n: 2, selector: '[data-figma-part="CTA"]', side: 'bottom' },
            { n: 3, selector: '[data-figma-part="Button"]', index: -1, side: 'right' },
          ],
        }],
        guidelines: [
          <><strong>Reproductor:</strong> pasa el audio grabado con <code>audio</code>; reemplaza al campo de texto y expone sus controles de reproducción.</>,
          <><strong>Fila inferior:</strong> <code>attachments</code> queda a la izquierda; los controles de grabar y enviar aparecen a la derecha.</>,
          <><strong>Enviar audio:</strong> pasa <code>onSendAudio</code> para mostrar el botón de envío junto al botón de grabación.</>,
        ],
      }] }],
    },
    {
      title: 'Estados',
      description: 'ChatComposer presenta el campo de texto, el modo con audio y el estado Disabled. El modo de audio reemplaza el campo y cambia las acciones disponibles.',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del campo y del contenedor. Cambia el modo para comparar sus valores en claro y en oscuro.',
      titleInside: true,
      blocks: [{ type: 'tokens', groups: [{
        title: 'Campo de mensaje',
        preview: composer(),
        entries: [
          { part: 'Fondo del contenedor', color: 'background-container-default-on-card' },
          { part: 'Borde', color: 'border-general-default-on-canva' },
          { part: 'Superficie del campo', color: 'background-field-surface-secondary' },
          { part: 'Texto', color: 'text-field-placeholder', text: 'typography-field-size-sm' },
          { part: 'Ayuda', color: 'text-field-label-secondary' },
          { part: 'Foco', color: 'border-field-active' },
        ],
      }] }],
    },
    {
      title: 'Uso del componente ChatComposer en Figma:',
      description: '',
      titleInside: true,
      blocks: [{ type: 'figma', bullets: [
        <><strong>Búsqueda y configuración:</strong> encuentra el set «Audio (Atom)». Aunque el nombre del set dice Audio, sus variantes documentan el campo para escribir de la conversación.</>,
        <><strong>State:</strong> Default representa el campo de mensaje; State3 muestra la grabación preparada. El set repite por error el nombre State3 en dos variantes.</>,
        <><strong>CTA:</strong> la fila inferior contiene los controles de adjuntos. En código se configura con <code>attachments</code>; el modo de audio se activa con <code>audio</code>.</>,
        <><strong>Diferencias:</strong> Figma no incluye la etiqueta accesible del campo. El código agrega <code>label</code> sr-only, soporta Enter y Shift+Enter, evita enviar durante la composición IME y ofrece el modo <code>touch</code>.</>,
      ] }],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo ChatComposer es la pieza correcta y cuándo conviene otra.',
      blocks: [{ type: 'usage',
        use: [
          <><strong>Mensajes de conversación:</strong> usa el campo para redactar y enviar texto con <code>onSend</code>.</>,
          <><strong>Adjuntos:</strong> pasa botones u otros controles accesibles por <code>attachments</code>; el composer los coloca en la fila inferior.</>,
          <><strong>Grabación de audio:</strong> activa el botón con <code>onRecord</code> y presenta la grabación mediante <code>audio</code>.</>,
          <><strong>Formulario controlado:</strong> usa <code>value</code> con <code>onValueChange</code> cuando el estado del texto pertenezca al padre.</>,
          <><strong>Pantallas táctiles:</strong> activa <code>touch</code> para botones e íconos de mayor tamaño.</>,
        ],
        avoid: [
          <><strong>Campos de formulario generales:</strong> no uses este composer para datos distintos a un mensaje. (Alternativa: <code>Textarea</code>).</>,
          <><strong>Enviar texto vacío:</strong> el formulario no llama a <code>onSend</code> si el texto solo contiene espacios. (Alternativa: pide contenido antes de enviar).</>,
          <><strong>Subir archivos sin controles:</strong> no pases archivos directamente como texto ni reemplaces los botones de adjuntos. (Alternativa: coloca controles de carga accesibles en <code>attachments</code>).</>,
        ],
      }],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [{ type: 'breakpoints',
        desktop: { columns: [
          { title: 'Mensaje', bullets: [<>Botones xs de 32 px e íconos de 16 px.</>, <>El campo permite hasta siete líneas en navegadores compatibles.</>], preview: composer() },
          { title: 'Audio grabado', bullets: [<>El audio reemplaza el campo de texto.</>, <>Grabar y Enviar aparecen a la derecha de la fila inferior.</>], preview: withAudio() },
        ] },
        mobile: { bullets: [<><strong>Modo táctil:</strong> activa <code>touch</code> para usar botones sm de 40 px e íconos de 20 px.</>, <>El padding del contenedor cambia a 8 px arriba, abajo y a la derecha, y 16 px a la izquierda.</>, <>La pantalla Chat usa un botón de adjunto <code>add-2</code>.</>], preview: touchComposer() },
        tablet: { bullets: [<>Tablet usa los mismos tokens de tamaño que Desktop; <code>touch</code> se activa explícitamente.</>, <>Los botones son xs de 32 px y los íconos miden 16 px.</>, <>Activa <code>touch</code> si necesitas controles grandes en una superficie táctil.</>], preview: composer() },
      }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para redactar, enviar y presentar mensajes de forma accesible.',
      blocks: [{ type: 'practices', items: [
        { kind: 'do', framed: true, title: 'Etiqueta el campo', description: 'Define un nombre accesible que identifique el campo aunque la etiqueta no se vea.', preview: composer({ label: 'Mensaje' }) },
        { kind: 'dont', framed: true, title: 'Campo sin nombre', description: 'No dejes la etiqueta vacía: el campo perdería su nombre para lectores de pantalla.', preview: composer({ label: '' }) },
        { kind: 'do', framed: true, title: 'Adjuntos en su fila', description: <>Pasa los botones por <code>attachments</code> para mantenerlos debajo del campo.</>, preview: composer({ attachments: attachmentButtons() }) },
        { kind: 'dont', framed: true, title: 'Audio como adjunto', description: 'No pongas el reproductor en la fila de adjuntos mientras mantienes el campo de texto.', preview: composer({ attachments: audioPreview() }) },
        { kind: 'do', framed: true, title: 'Envía la grabación', description: <>Pasa <code>onSendAudio</code> para mostrar la acción Enviar junto al audio preparado.</>, preview: withAudio() },
        { kind: 'dont', framed: true, title: 'Audio sin envío', description: 'No presentes una grabación lista si la persona no tiene una acción para enviarla.', preview: <ChatComposer audio={audioPreview()} onRecord={() => {}} /> },
      ] }],
    },
  ],
};
