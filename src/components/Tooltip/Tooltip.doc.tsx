import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Button } from '../Button';
import type { ButtonState } from '../Button/Button.types';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { TooltipBubble } from './TooltipBubble';
import type { TooltipBubbleProps } from './Tooltip.types';

/*
 * Contenido de la página de documentación de Tooltip (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Tooltip.tsx`, `Tooltip.types.ts`, `Tooltip.variants.ts`), luego `Tooltip.docs.json`. Medidas: Content con padding 8
 * y radio 8, flecha de 16 × 8, texto Semibold 12/16, ancho máximo 288, 4 px entre la punta y el disparador, retrasos de
 * 300 ms (abrir) y 150 ms (cerrar).
 *
 * Las vistas usan la burbuja estática (`TooltipBubble`) en el flujo: el `Tooltip` real se abre en la capa superior y no
 * se puede medir ni recortar dentro de un lienzo.
 */

// Figma: 11097:4782 (component set Tooltip (Atom)); Rich tooltip = set Tooltip (Type Simple/Complex) → Popover

const bubble = (text: ReactNode, props: TooltipBubbleProps = {}) => <TooltipBubble {...props}>{text}</TooltipBubble>;

/** Disparador de ejemplo: botón solo con ícono (en uso real, el tooltip es su nombre con `describes="label"`). */
const trigger = (label = 'Descargar reporte', state?: ButtonState) => (
  <Button iconOnly variant="secondary" size="sm" state={state} aria-label={label}>
    <Icon name="download" size={20} variant="line" />
  </Button>
);

/** Tooltip abierto: burbuja con la flecha abajo y el disparador debajo, a 4 px (`OFFSET` de `Tooltip.tsx`). */
const opened = (text = 'Descargar reporte', state?: ButtonState, content: ReactNode = trigger(text, state)) => (
  <div className="flex flex-col items-center gap-ds-space-general-md">
    {bubble(text)}
    {content}
  </div>
);

const states: DocStateItem[] = [
  {
    label: 'Oculto',
    tone: 'neutral',
    description: 'Reposo. La burbuja no se ve, pero ya está en el DOM y el disparador la referencia.',
    samples: [trigger()],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero, tras 300 ms (<code>delay</code>). El puntero puede pasar a la burbuja sin que se cierre.
      </>
    ),
    samples: [opened(undefined, 'hover')],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al enfocar el disparador con el teclado, con el mismo retraso. El foco que sigue a un toque no lo abre.',
    samples: [opened(undefined, 'focus')],
  },
  {
    label: 'Salida',
    tone: 'neutral',
    description: (
      <>
        Se oculta al salir el puntero (150 ms, <code>closeDelay</code>), al perder el foco o con Escape, que no mueve el foco.
      </>
    ),
    samples: [trigger(undefined, 'focus')],
  },
  {
    label: 'Disabled',
    tone: 'neutral',
    description: (
      <>
        Con <code>disabled</code> no se muestra ni se enlaza con el disparador, que queda igual.
      </>
    ),
    samples: [trigger()],
  },
];

export const doc: ComponentDocContent = {
  name: 'Tooltip',
  icon: 'info-circle',
  classification: 'atomo',
  summary:
    'El Tooltip es el átomo que muestra un texto breve junto a un elemento al pasar el puntero o al enfocarlo. Aclara íconos y datos abreviados sin interrumpir la tarea; para contenido interactivo se usa Popover.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Una burbuja con flecha que apunta a su disparador. La posición dice en qué borde va la flecha.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Tooltip abierto',
                  preview: opened(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Content"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Supporting text"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Arrow"]', side: 'left' },
                    { n: 4, selector: 'button', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Content"]', side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Content"]', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="div"]', to: 'button', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> padding de 8 (<code>space/general/lg</code>) y radio de 8 (<code>radius/general/md</code>). Mide 34 de alto con una línea y crece con el texto hasta 288 de ancho. Relleno sólido o translúcido, con desenfoque de fondo de 12.
                </>,
                <>
                  <strong>Texto:</strong> Helvetica Neue Semibold de 12 px con interlineado de 16, centrado y en blanco unicolor. Si pasa de 288 de ancho, se divide en varias líneas.
                </>,
                <>
                  <strong>Flecha:</strong> triángulo de 16 × 8 (8 × 16 a los lados) del mismo relleno, centrado. Si la burbuja se corre para no salirse de la pantalla, la flecha sigue apuntando al disparador.
                </>,
                <>
                  <strong>Disparador:</strong> un único elemento enfocable (botón, enlace o campo). La punta de la flecha queda a 4 px de él.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Posiciones',
                  preview: (
                    <>
                      {bubble('Izquierda', { arrow: 'left' })}
                      {bubble('Arriba', { arrow: 'top' })}
                      {bubble('Abajo', { arrow: 'bottom' })}
                      {bubble('Derecha', { arrow: 'right' })}
                    </>
                  ),
                  marks: [
                    { n: 1, selector: '[data-figma-part="div"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="div"]', index: 1, side: 'top' },
                    { n: 3, selector: '[data-figma-part="div"]', index: 2, side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="div"]', index: 3, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: ':scope > div', index: 0 },
                    { kind: 'height', selector: ':scope > div', index: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Left:</strong> flecha a la izquierda; la burbuja aparece a la derecha del disparador. Con la flecha a un lado mide 34 de alto.
                </>,
                <>
                  <strong>Top:</strong> flecha arriba; la burbuja aparece debajo del disparador. Con la flecha arriba o abajo mide 42 de alto.
                </>,
                <>
                  <strong>Bottom:</strong> la posición por defecto. Flecha abajo; la burbuja aparece encima del disparador, así el puntero no la tapa.
                </>,
                <>
                  <strong>Right:</strong> flecha a la derecha; la burbuja aparece a la izquierda. Toda posición es una preferencia: si no cabe, pasa al lado opuesto.
                </>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description: 'Tooltip tiene 5 estados. Aquí la burbuja se dibuja abierta y sin comportamiento; en uso se abre con el puntero o el foco.',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens de la burbuja sólida y de la translúcida. La sólida queda siempre en modo oscuro; la translúcida cambia con el modo.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Sólido',
              preview: bubble('Guardar cambios'),
              entries: [
                { part: 'Fondo y flecha', color: 'background-general-gray-sixth', mode: 'dark' },
                { part: 'Texto', color: 'text-neutral-white-unicolor', text: 'primitives-typography-size-sm', mode: 'dark' },
              ],
            },
            {
              title: 'Translúcido',
              preview: bubble('Guardar cambios', { solid: false }),
              entries: [
                { part: 'Fondo y flecha', color: 'background-field-active-opacity' },
                { part: 'Texto', color: 'text-neutral-white-unicolor', text: 'primitives-typography-size-sm' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Tooltip en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Tooltip (Atom) en la librería de Assets y arrástralo al lienzo. Sus propiedades son Solid, Position y Text.
            </>,
            <>
              <strong>Position:</strong> el borde de la burbuja con la flecha (Top, Bottom, Left o Right); en código es <code>arrow</code>. La burbuja aparece en el lado opuesto a la flecha.
            </>,
            <>
              <strong>Solid:</strong> Yes para el relleno sólido y No para el translúcido con desenfoque. Figma no tiene Solid No con Position Bottom; el código sí lo admite.
            </>,
            <>
              <strong>Rich tooltip:</strong> el set Tooltip de Figma (Type Simple o Complex, con título, paginación y acciones) es el componente Popover en código.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Tooltip es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Botones solo con ícono:</strong> el tooltip es su nombre con <code>describes=&quot;label&quot;</code>; el botón no lleva <code>aria-label</code>.
            </>,
            <>
              <strong>Aclarar un ícono o un dato abreviado:</strong> un texto breve que amplía lo que ya se ve, con <code>aria-describedby</code>.
            </>,
            <>
              <strong>Información que solo aparece en la burbuja:</strong> <code>mode=&quot;toggletip&quot;</code> abre con clic, toque, Enter o Espacio y anuncia el contenido.
            </>,
            <>
              <strong>Contexto secundario:</strong> una sola idea que no interrumpe la tarea ni cambia la navegación.
            </>,
          ],
          avoid: [
            <>
              <strong>Información esencial o errores:</strong> no aparece con toque y se pierde al mover el puntero. (Alternativa: el texto de ayuda del campo o un Alert).
            </>,
            <>
              <strong>Botones, enlaces o formularios:</strong> la burbuja nunca recibe el foco. (Alternativa: Popover).
            </>,
            <>
              <strong>Repetir la etiqueta visible:</strong> el lector la anuncia dos veces y no aporta nada.
            </>,
            <>
              <strong>Textos largos:</strong> el ancho máximo es 288 px y la burbuja desaparece al salir el puntero. (Alternativa: Popover o texto en la interfaz).
            </>,
            <>
              <strong>Translúcido sobre fondos variados:</strong> el texto pierde contraste. (Alternativa: <code>solid</code>, el valor por defecto).
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'La burbuja mide lo mismo en todos los breakpoints. Se abre con puntero y teclado, pero no con toque.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Con puntero',
                bullets: [
                  <>
                    <strong>Aparece tras 300 ms</strong> y se oculta 150 ms después de salir, tiempo para pasar el puntero a la burbuja.
                  </>,
                  <>
                    <strong>Bottom por defecto:</strong> encima del disparador, así el puntero no la tapa.
                  </>,
                ],
                preview: opened('Descargar reporte', 'hover'),
              },
              {
                title: 'Con teclado',
                bullets: [
                  <>
                    <strong>Aparece al enfocar</strong> el disparador y se oculta al perder el foco.
                  </>,
                  <>
                    <strong>Escape</strong> la cierra sin mover el foco y no la vuelve a abrir hasta salir y volver.
                  </>,
                ],
                preview: opened('Descargar reporte', 'focus'),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin toque:</strong> el tooltip no aparece con toque, así que su texto también debe estar en el nombre accesible o en la interfaz.
              </>,
              <>
                <strong>Toggletip:</strong> para información que solo aparece en la burbuja, como el ícono de información de un campo. Abre con toque.
              </>,
              <>
                <strong>Medidas:</strong> 288 de ancho máximo y 8 px de margen con el borde de la pantalla.
              </>,
            ],
            preview: <Input label="Celular" type="tel" optional tooltip="Solo lo usamos para contactarte" fullWidth />,
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> las mismas de Desktop.
              </>,
              <>
                <strong>Entrada mixta:</strong> con puntero o teclado se abre igual que en Desktop; con toque no aparece.
              </>,
              <>
                <strong>Bordes de la pantalla:</strong> si no cabe, pasa al lado opuesto y la flecha sigue apuntando al disparador.
              </>,
            ],
            preview: opened('Descargar reporte', 'focus'),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de contenido, longitud y qué información puede vivir en un tooltip.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Nombra el botón de ícono',
              description: 'Usa el tooltip para nombrar un botón solo con ícono o para decir qué resultado tiene.',
              preview: opened('Descargar reporte'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Repetir la etiqueta',
              description: 'No repitas lo que el botón ya dice: no aporta nada y el lector lo anuncia dos veces.',
              preview: opened(
                'Descargar',
                undefined,
                <Button variant="secondary" size="sm">
                  Descargar
                </Button>,
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Una idea breve',
              description: 'Escribe una sola idea de 2 a 8 palabras que se lea de un vistazo.',
              preview: bubble('Guardar cambios'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Texto largo',
              description: 'No escribas párrafos: la burbuja mide 288 px como máximo y desaparece al mover el puntero.',
              preview: bubble('Guardar los cambios que hiciste en el formulario para que no se pierdan cuando cierres la ventana o cambies de página'),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Requisito a la vista',
              description: 'Deja visible lo que se necesita para completar la tarea, como el texto de ayuda del campo.',
              preview: <Input variant="password" label="Contraseña" helperText="Mínimo 8 caracteres" fullWidth />,
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Requisito escondido',
              description: 'No escondas requisitos ni errores en un tooltip: con toque no aparece y se pierde al mover el puntero.',
              preview: <Input variant="password" label="Contraseña" tooltip="Mínimo 8 caracteres" fullWidth />,
            },
          ],
        },
      ],
    },
  ],
};
