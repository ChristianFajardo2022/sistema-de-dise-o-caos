import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { ChatAudioPlayer } from '../ChatAudioPlayer';
import { ChatMessage } from './ChatMessage';
import { ChatMessageList } from './ChatMessageList';

/*
 * Contenido de la página de documentación de ChatMessage (plantilla v2). Manda el código
 * (`ChatMessage.types.ts`, `ChatMessage.variants.ts`, `ChatMessage.tsx`), luego `ChatMessage.docs.json`.
 */

const avatar = (photo: 'Woman_1' | 'Men_4' = 'Woman_1') => (
  <Avatar variant="photo" size="sm" src={PHOTO_SRC[photo]} alt="" />
);

const messageItem = (
  props: Partial<ComponentProps<typeof ChatMessage>> = {},
  content: ReactNode = 'Revisé las notas de la reunión.'
) => (
  <ChatMessage author="Ana Pérez" time="9:12 a.m." dateTime="2026-11-04T09:12:00" avatar={avatar()} {...props}>
    {content}
  </ChatMessage>
);

/**
 * Muestra de un mensaje: ancho fijo de 360 px y sobre `container-default-on-canva`. La burbuja entrante
 * (`gray-seventh`) tiene el mismo valor que el fondo de la tarjeta de la plantilla y sin esta superficie se funde.
 */
const message = (props: Partial<ComponentProps<typeof ChatMessage>> = {}, content?: ReactNode) => (
  <div className="w-[360px] max-w-full rounded-ds-radius-general-xl bg-ds-background-container-default-on-canva p-ds-space-general-lg">
    <ol className="m-0 flex w-full list-none flex-col gap-ds-space-general-lg p-0">{messageItem(props, content)}</ol>
  </div>
);

const audioMessage = (props: Partial<ComponentProps<typeof ChatMessage>> = {}) => (
  message(
    { type: 'audio', ...props },
    <ChatAudioPlayer duration={42} defaultCurrentTime={8} timePosition="start" buttonPosition="end" />
  )
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Mensaje de texto entrante. El avatar queda a la izquierda y el contenido se ajusta a su ancho.',
    samples: [message()],
  },
  {
    label: 'Variant2',
    tone: 'neutral',
    description: 'Mensaje de texto saliente. La burbuja y el avatar se alinean a la derecha.',
    samples: [message({ direction: 'outgoing', author: 'Hugo García', avatar: avatar('Men_4') })],
  },
  {
    label: 'Variant4',
    tone: 'neutral',
    description: 'Mensaje de audio saliente. La burbuja se estira para dar espacio al reproductor.',
    samples: [audioMessage({ direction: 'outgoing', author: 'Hugo García', avatar: avatar('Men_4') })],
  },
  {
    label: 'Variant5',
    tone: 'neutral',
    description: 'Mensaje de audio entrante. El avatar queda a la izquierda y la burbuja ocupa el ancho disponible.',
    samples: [audioMessage()],
  },
];

const listSample = (children: ReactNode) => (
  <div className="h-28 w-full max-w-[381px]">
    <ChatMessageList aria-label="Mensajes con Ana Pérez" className="h-full">
      {children}
    </ChatMessageList>
  </div>
);

const breakpointPreview = listSample(
  <>
    {messageItem({ direction: 'incoming' })}
    {messageItem({ direction: 'outgoing', author: 'Hugo García', avatar: avatar('Men_4') })}
  </>
);

export const doc: ComponentDocContent = {
  name: 'ChatMessage',
  icon: 'info-circle',
  classification: 'atomo',
  summary: 'ChatMessage es el átomo que representa un mensaje recibido o enviado en una conversación. Muestra una burbuja de texto o audio, la hora y un avatar opcional; incluye el autor en el contenido accesible y se integra en una lista de mensajes.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Cada mensaje es un elemento de lista con autor accesible, burbuja y hora; el avatar aparece junto a la burbuja según la dirección.',
      blocks: [{ type: 'anatomy', groups: [{
        canvases: [{
          label: 'Texto entrante',
          preview: message(),
          marks: [
            { n: 1, selector: '[data-figma-part="Avatar"]', side: 'left' },
            { n: 2, selector: '[data-figma-part="Frame 1984080546"]', side: 'top' },
            { n: 3, selector: '[data-figma-part="Status"]', side: 'right' },
            { n: 4, selector: '[data-figma-part="Hora"]', index: -1, side: 'bottom' },
          ],
          dimensions: [
            { kind: 'padding', selector: '[data-figma-part="Frame 1984080546"]', side: 'left' },
          ],
        }],
        guidelines: [
          <><strong>Avatar:</strong> opcional, mide 32 px y solo aparece en mensajes entrantes a la izquierda o salientes a la derecha. Es decorativo para lectores de pantalla.</>,
          <><strong>Burbuja:</strong> radio de 16 px. En texto usa padding vertical de 8 px y horizontal de 12 px; en audio usa 12 px alrededor y ocupa el espacio disponible.</>,
          <><strong>Contenido:</strong> el autor se anuncia antes del mensaje, aunque no se vea. El texto usa tipografía semibold de 14 px con interlineado de 18 px.</>,
          <><strong>Hora:</strong> opcional; se muestra bajo el contenido con tipografía regular de 10 px/14 px dentro de un elemento <code>time</code>.</>,
        ],
      }, {
        canvases: [{
          label: 'Texto saliente',
          preview: message({ direction: 'outgoing', author: 'Hugo García', avatar: avatar('Men_4') }),
          marks: [
            { n: 1, selector: '[data-figma-part="Frame 1984080546"]', side: 'top' },
            { n: 2, selector: '[data-figma-part="Status"]', side: 'left' },
            { n: 3, selector: '[data-figma-part="Hora"]', side: 'right' },
            { n: 4, selector: '[data-figma-part="Avatar"]', side: 'top' },
          ],
        }],
        guidelines: [
          <><strong>Burbuja saliente:</strong> se alinea a la derecha, con fondo <code>background-acent-secondary</code> y texto unicolor.</>,
          <><strong>Contenido:</strong> conserva la tipografía semibold de 14 px/18 px y ajusta las palabras largas dentro de la burbuja.</>,
          <><strong>Hora:</strong> usa el color <code>text-acent-secondary</code> debajo del texto.</>,
          <><strong>Avatar:</strong> opcional y alineado a la derecha. El nombre del autor ya forma parte del contenido accesible.</>,
        ],
      }, {
        canvases: [
          { label: 'Audio entrante', preview: audioMessage(), marks: [
            { n: 1, selector: '[data-figma-part="Frame 1984080545"]', side: 'top' },
            { n: 2, selector: '[data-figma-part="Reproductor"]', side: 'top' },
            { n: 3, selector: '[data-figma-part="Hora"]', index: -1, side: 'bottom' },
            { n: 4, selector: '[data-figma-part="Avatar"]', side: 'left' },
          ] },
          { label: 'Audio saliente', preview: audioMessage({ direction: 'outgoing', author: 'Hugo García', avatar: avatar('Men_4') }), marks: [
            { n: 1, selector: '[data-figma-part="Frame 1984080545"]', side: 'top' },
            { n: 2, selector: '[data-figma-part="Reproductor"]', side: 'top' },
            { n: 3, selector: '[data-figma-part="Hora"]', index: -1, side: 'bottom' },
            { n: 4, selector: '[data-figma-part="Avatar"]', side: 'right' },
          ] },
        ],
        guidelines: [
          <><strong>Burbuja de audio:</strong> se estira al espacio disponible y usa padding de 12 px en sus cuatro lados.</>,
          <><strong>Reproductor:</strong> pasa <code>ChatAudioPlayer</code> como contenido y configura <code>type=&quot;audio&quot;</code> para aplicar el ancho y espaciado del audio.</>,
          <><strong>Hora:</strong> la hora del mensaje queda bajo el reproductor. La duración del audio pertenece al reproductor.</>,
          <><strong>Dirección:</strong> el mensaje entrante pone el avatar a la izquierda; el saliente, a la derecha.</>,
        ],
      }] }],
    },
    {
      title: 'Estados',
      description: 'ChatMessage no es interactivo: tiene 4 estados de aspecto, uno por variante del set de Figma. Todos son de la misma pieza y cambian con la dirección (entrante o saliente) y el tipo de contenido (texto o audio).',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del fondo, texto y hora de cada variante. Los colores salientes unicolor mantienen su valor en ambos modos.',
      titleInside: true,
      blocks: [{ type: 'tokens', groups: [
        {
          title: 'Default · texto entrante',
          preview: message(),
          entries: [
            { part: 'Fondo', color: 'background-general-gray-seventh' },
            { part: 'Texto', color: 'text-neutral-gray', text: 'primitives-typography-size-md' },
            { part: 'Hora', color: 'text-neutral-gray-2', text: 'typography-body-size-xs' },
          ],
        },
        {
          title: 'Variant2 · texto saliente',
          preview: message({ direction: 'outgoing', author: 'Hugo García', avatar: avatar('Men_4') }),
          entries: [
            { part: 'Fondo', color: 'background-acent-secondary' },
            { part: 'Texto', color: 'text-neutral-black-unicolor', text: 'primitives-typography-size-md' },
            { part: 'Hora', color: 'text-acent-secondary', text: 'typography-body-size-xs' },
          ],
        },
        {
          title: 'Variant4 · audio saliente',
          preview: audioMessage({ direction: 'outgoing', author: 'Hugo García', avatar: avatar('Men_4') }),
          entries: [
            { part: 'Fondo', color: 'background-acent-secondary' },
            { part: 'Texto (duración del audio)', color: 'text-acent-secondary' },
            { part: 'Hora del mensaje', color: 'text-acent-secondary', text: 'typography-body-size-xs' },
          ],
        },
        {
          title: 'Variant5 · audio entrante',
          preview: audioMessage(),
          entries: [
            { part: 'Fondo', color: 'background-general-gray-seventh' },
            { part: 'Texto (duración del audio)', color: 'text-neutral-gray' },
            { part: 'Hora del mensaje', color: 'text-neutral-gray-2', text: 'typography-body-size-xs' },
          ],
        },
      ] }],
    },
    {
      title: 'Uso del componente ChatMessage en Figma:',
      description: '',
      titleInside: true,
      blocks: [{ type: 'figma', bullets: [
        <><strong>Búsqueda y configuración:</strong> encuentra el set «Conversacion (Atom)» en Assets. Sus propiedades combinan dirección y contenido.</>,
        <><strong>Property 1:</strong> Default es incoming/text; Variant2, outgoing/text; Variant4, outgoing/audio; Variant5, incoming/audio.</>,
        <><strong>Diferencias:</strong> Figma no contiene el autor ni la hora accesible. El código añade ambos, oculta el avatar a lectores de pantalla y usa una lista de mensajes con anuncios y desplazamiento en <code>ChatMessageList</code>.</>,
        <><strong>Hora y duración:</strong> en el texto, «hora» es la marca de tiempo del mensaje. La capa «Hora» del reproductor de audio en Figma es la duración del audio.</>,
        <><strong>Tokens responsive:</strong> el código usa <code>space/general/6xl</code> para el margen del lado opuesto al avatar. Resuelve 40 px en Mobile y 56 px desde 48 rem (Tablet y Desktop).</>,
      ] }],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo ChatMessage es la pieza correcta y cuándo conviene otra.',
      blocks: [{ type: 'usage',
        use: [
          <><strong>Registro de conversación:</strong> usa cada mensaje como elemento de <code>ChatMessageList</code> o de una lista ordenada.</>,
          <><strong>Mensajes recibidos:</strong> configura <code>direction=&quot;incoming&quot;</code>; el avatar aparece a la izquierda.</>,
          <><strong>Mensajes enviados:</strong> configura <code>direction=&quot;outgoing&quot;</code>; el avatar aparece a la derecha.</>,
          <><strong>Audio:</strong> usa <code>type=&quot;audio&quot;</code> y pasa un <code>ChatAudioPlayer</code> como contenido para estirar la burbuja.</>,
          <><strong>Autoría y hora:</strong> pasa <code>author</code> y, si se conoce, <code>time</code> con su valor ISO en <code>dateTime</code>.</>,
        ],
        avoid: [
          <><strong>Mensaje fuera de una lista:</strong> el componente renderiza un <code>li</code>. (Alternativa: colócalo dentro de <code>ChatMessageList</code> o un <code>ol</code>).</>,
          <><strong>Registro con anuncios propios:</strong> no uses una lista simple si necesitas anunciar mensajes entrantes y seguir el final del registro. (Alternativa: <code>ChatMessageList</code>).</>,
          <><strong>Otro contenido de conversación:</strong> no uses la burbuja para adjuntos o controles que no sean texto o audio. (Alternativa: <code>FileCard</code> para archivos o <code>Button</code> para acciones).</>,
        ],
      }],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [{ type: 'breakpoints',
        desktop: { columns: [{ title: 'Conversación', bullets: [<>El margen opuesto al avatar usa <code>space/general/6xl</code>: 56 px en Desktop.</>, <>La fila mantiene 8 px entre mensajes y entre avatar y burbuja.</>], preview: breakpointPreview }] },
        mobile: { bullets: [<><strong>Margen lateral:</strong> <code>space/general/6xl</code> resuelve 40 px en Mobile, 16 px menos que en Desktop.</>, <>La burbuja conserva el radio de 16 px y el espacio de 8 px entre avatar y contenido.</>], preview: breakpointPreview },
        tablet: { bullets: [<><strong>Sin cambios:</strong> usa los mismos tokens que Desktop.</>, <>El margen opuesto al avatar es 56 px.</>, <>La fila conserva el gap de 8 px.</>], preview: breakpointPreview },
      }],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para distinguir mensajes, mantener la estructura de lista y presentar audio.',
      blocks: [{ type: 'practices', items: [
        { kind: 'do', framed: true, title: 'Alinea el mensaje recibido', description: <>Usa <code>incoming</code> para el mensaje de otra persona y deja el avatar a la izquierda.</>, preview: message({ direction: 'incoming' }) },
        { kind: 'dont', framed: true, title: 'Dirección invertida', description: 'No marques como saliente un mensaje que escribió otra persona.', preview: message({ direction: 'outgoing' }) },
        { kind: 'do', framed: true, title: 'Usa el registro', description: <>Agrupa los mensajes en <code>ChatMessageList</code> para anuncios corteses y desplazamiento hasta el final.</>, preview: listSample(messageItem()) },
        { kind: 'dont', framed: true, title: 'Lista sin seguimiento', description: 'No uses una lista simple si necesitas anunciar mensajes nuevos y mantener el desplazamiento.', preview: <ol className="m-0 flex list-none flex-col gap-ds-space-general-lg p-0">{messageItem()}</ol> },
        { kind: 'do', framed: true, title: 'Define el tipo audio', description: <>Usa <code>type=&quot;audio&quot;</code> para que la burbuja se estire alrededor del reproductor.</>, preview: audioMessage() },
        { kind: 'dont', framed: true, title: 'Reproductor como texto', description: 'No dejes el tipo text cuando el contenido sea un reproductor de audio.', preview: message({}, <ChatAudioPlayer duration={42} defaultCurrentTime={8} timePosition="start" buttonPosition="end" />) },
      ] }],
    },
  ],
};
