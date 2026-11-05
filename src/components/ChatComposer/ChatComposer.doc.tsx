import type { ComponentProps, ReactNode } from 'react';
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

/**
 * Superficie de muestra: el contenedor usa `background-container-default-on-card` y en oscuro vale lo mismo que el lienzo
 * de la página, así que se funde. Se apoya en `background-general-black` (la misma que usa Accordion para On canva) y fija
 * un ancho de muestra para que la plantilla no la encoja.
 */
const onSurface = (node: ReactNode) => (
  <div style={{ width: 360 }} className="bg-ds-background-general-black p-ds-space-general-2xl">
    {node}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Campo de texto con Enviar, Grabar y la fila opcional de adjuntos. Enter envía el texto; Shift+Enter agrega una línea.',
    samples: [onSurface(composer())],
  },
  {
    label: 'State3',
    tone: 'neutral',
    description: <>El audio grabado reemplaza el campo. En Figma, dos variantes comparten el nombre <code>State3</code>; el código activa este aspecto con <code>audio</code>.</>,
    samples: [onSurface(withAudio())],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: 'Deshabilita el campo y los botones propios. Los controles que se pasan por slots, como los adjuntos, mantienen su estado independiente.',
    samples: [onSurface(composer({ disabled: true }))],
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
          preview: onSurface(composer()),
          marks: [
            { n: 1, selector: 'form', side: 'left' },
            { n: 2, selector: '[data-figma-part="Frame 1984080613"]', side: 'top' },
            { n: 3, selector: '[data-figma-part="Escribe un mensaje..."]', side: 'bottom' },
            { n: 4, selector: '[data-figma-part="Button"]', side: 'top' },
            { n: 5, selector: '[data-figma-part="CTA"]', side: 'bottom' },
          ],
          dimensions: [
            { kind: 'padding', selector: 'form', side: 'right' },
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
          preview: onSurface(withAudio()),
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
      description: <>ChatComposer tiene 3 estados: Default y State3 son las variantes de Figma, y Disabled existe solo en código. State3 reemplaza el campo por el audio grabado y Disabled deshabilita el campo y los botones propios.</>,
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del campo y del contenedor. Cambia el modo para comparar sus valores en claro y en oscuro.',
      titleInside: true,
      blocks: [{ type: 'tokens', groups: [{
        title: 'Campo de mensaje',
        preview: onSurface(composer()),
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
          <><strong>Elegir entre respuestas fijas:</strong> no pidas escribir cuando la persona solo debe escoger una opción. (Alternativa: <code>Button</code> por cada respuesta).</>,
          <><strong>Subir archivos sin botón:</strong> no esperes que la persona pegue el archivo en el campo como texto. (Alternativa: <code>Button</code> de solo ícono en <code>attachments</code>).</>,
        ],
      }],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [{ type: 'breakpoints',
        desktop: { columns: [
          { title: 'Mensaje', bullets: [<>Contenedor con radio de 24 px (<code>radius/container/on-card</code>).</>, <>Botones xs de 32 px e íconos de 16 px.</>, <>El campo permite hasta siete líneas en navegadores compatibles.</>], preview: composer() },
          { title: 'Audio grabado', bullets: [<>El audio reemplaza el campo de texto.</>, <>Grabar y Enviar aparecen a la derecha de la fila inferior.</>], preview: withAudio() },
        ] },
        mobile: { bullets: [<><strong>Radio:</strong> <code>radius/container/on-card</code> baja de 24 a 16 px por debajo de 48 rem.</>, <><strong>Modo táctil:</strong> <code>touch</code> es una prop, no cambia con el breakpoint. Activa botones sm de 40 px, íconos de 20 px y padding de 8 px arriba, abajo y a la derecha, y 16 px a la izquierda.</>, <>La pantalla Chat usa un botón de adjunto <code>add-2</code>.</>], preview: touchComposer() },
        tablet: { bullets: [<><strong>Sin cambios:</strong> Tablet usa los mismos tokens que Desktop, con el radio de 24 px.</>, <>Los botones son xs de 32 px y los íconos miden 16 px.</>], preview: composer() },
      }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para redactar, enviar y presentar mensajes de forma accesible.',
      blocks: [{ type: 'practices', items: [
        { kind: 'do', framed: true, title: 'Etiqueta el campo', description: 'Define un nombre accesible que identifique el campo aunque la etiqueta no se vea.', preview: composer({ label: 'Mensaje' }) },
        { kind: 'dont', framed: true, title: 'Campo sin nombre', description: 'No dejes la etiqueta vacía: el campo perdería su nombre para lectores de pantalla.', preview: composer({ label: '' }) },
        { kind: 'do', framed: true, title: 'Adjuntos del mismo tamaño', description: <>Con <code>touch</code>, pasa por <code>attachments</code> botones sm de 40 px, como los del composer.</>, preview: composer({ touch: true, attachments: attachmentButtons(true) }) },
        { kind: 'dont', framed: true, title: 'Adjuntos de otro tamaño', description: <>No mezcles botones xs en un composer con <code>touch</code>: la fila queda desigual y con áreas pequeñas.</>, preview: composer({ touch: true, attachments: attachmentButtons() }) },
        { kind: 'do', framed: true, title: 'Envía la grabación', description: <>Pasa <code>onSendAudio</code> para mostrar la acción Enviar junto al audio preparado.</>, preview: withAudio() },
        { kind: 'dont', framed: true, title: 'Audio sin envío', description: 'No presentes una grabación lista si la persona no tiene una acción para enviarla.', preview: <ChatComposer audio={audioPreview()} onRecord={() => {}} /> },
      ] }],
    },
  ],
};
