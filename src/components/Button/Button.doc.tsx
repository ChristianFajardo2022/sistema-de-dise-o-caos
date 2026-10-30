import type { ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { AddIcon } from '../../icons/AddIcon';
import { ArrowRightIcon } from '../../icons/ArrowRightIcon';
import { SettingIcon } from '../../icons/SettingIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { Button } from './Button';
import type { ButtonProps, ButtonState } from './Button.types';

/*
 * Contenido de la página de documentación de Button (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Button.types.ts`, `Button.variants.ts`, `Button.tsx`), luego `Button.docs.json`. Las medidas son las de los tokens
 * (md 56 · sm 48 · xs 32 en escritorio y tableta; md 48 · sm 40 · xs 32 en móvil).
 */

// Figma: 155:1315 (component set Button)

/** Botón de ejemplo: texto genérico y la medida que pida cada muestra. */
const btn = (props: Partial<ButtonProps> = {}, label: ReactNode = 'Continuar') => (
  <Button {...(props as ButtonProps)}>{label}</Button>
);

/** Icon-single de ejemplo con nombre accesible. */
const single = (props: Partial<ButtonProps> = {}) => (
  <Button {...(props as ButtonProps)} iconOnly aria-label="Ajustes">
    <SettingIcon />
  </Button>
);

/** Una muestra de estado por tipo (Primary, Secondary y Tertiary), con `state` forzado. */
const stateSamples = (state: ButtonState, tertiary = true): ReactNode[] => [
  btn({ variant: 'primary', state }),
  btn({ variant: 'secondary', state }),
  ...(tertiary ? [btn({ variant: 'tertiary', state })] : []),
];

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: 'Reposo. Primary tiene fondo sólido; Secondary, solo borde; Tertiary, texto subrayado sin contenedor.',
    samples: stateSamples('default'),
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero. Primary muestra el barrido de luz y su trazo; los tres tipos cambian a los colores de hover.',
    samples: stateSamples('hover'),
  },
  {
    label: 'Focus',
    tone: 'accent',
    description: 'Al recibir el foco del teclado. Primary pasa a un trazo de 1 px. No hay anillo de foco: cada tipo usa sus tokens.',
    samples: stateSamples('focus'),
  },
  {
    label: 'Press',
    tone: 'accent',
    description: 'Mientras se presiona. La luz de Primary queda fija abajo a la derecha.',
    samples: stateSamples('press'),
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: (
      <>
        No interactivo (<code>disabled</code> o <code>state=&quot;inactive&quot;</code>). Conserva el tipo con colores atenuados.
      </>
    ),
    samples: stateSamples('inactive'),
  },
  {
    label: 'Delete',
    tone: 'error',
    description: (
      <>
        Acción destructiva (<code>state=&quot;delete&quot;</code>) con los colores de error propios de cada tipo.
      </>
    ),
    samples: stateSamples('delete'),
  },
  {
    label: 'Load',
    tone: 'neutral',
    description: (
      <>
        Espera (<code>loading</code>): oculta el contenido, muestra tres puntos y conserva el foco. <strong>Tertiary no tiene Load</strong>: se ve como Inactive.
      </>
    ),
    samples: stateSamples('load', false),
  },
];

const withIcons = { leftIcon: <AddIcon />, rightIcon: <ArrowRightIcon /> };

export const doc: ComponentDocContent = {
  name: 'Button',
  icon: 'smart-cursor',
  classification: 'atomo',
  summary:
    'El Button es el átomo para ejecutar una acción o navegar con aspecto de botón. Tiene tres jerarquías (Primary, Secondary y Tertiary), tres tamaños y estados de interacción, error y espera.',
  definition: [
    {
      title: 'Anatomía',
      description: 'El botón con texto y el Icon-single comparten contenedor y tokens; cambia la forma de medir el contenido.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Botón con texto',
                  preview: btn({ variant: 'primary', size: 'md', ...withIcons }),
                  marks: [
                    { n: 1, selector: 'button', side: 'left' },
                    { n: 2, selector: '[data-slot="icon"]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-slot="label"]', side: 'top' },
                    { n: 4, selector: '[data-slot="icon"]', index: -1, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'button', side: 'left' },
                    { kind: 'padding', selector: 'button', side: 'top' },
                    { kind: 'gap', from: '[data-slot="icon"]', fromIndex: 0, to: '[data-slot="label"]' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> píldora de radio completo (48). Alto mínimo md 56, sm 48 y xs 32; ancho mínimo de 92 en md y sm. Padding X 24 en md y sm y 16 en xs; padding Y 8. Primary dibuja un trazo interior de 0.5 px (1 px en Focus) y Secondary, un borde de 1 px; Tertiary no tiene contenedor visible.
                </>,
                <>
                  <strong>Ícono izquierdo:</strong> opcional (<code>leftIcon</code>). Mide 20 px en md y sm y 14 px en xs, y toma el color del ícono del estado.
                </>,
                <>
                  <strong>Texto:</strong> Helvetica Neue Semibold de 14 px fijo en todos los breakpoints, interlineado 100 %. No se divide en varias líneas.
                </>,
                <>
                  <strong>Ícono derecho:</strong> opcional (<code>rightIcon</code>), con las mismas medidas. Entre ícono y texto hay 8 px (<code>space/button/lg</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Icon-single',
                  preview: single({ variant: 'primary', size: 'md' }),
                  marks: [
                    { n: 1, selector: 'button', side: 'left' },
                    { n: 2, selector: '[data-slot="icon"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: 'button', side: 'left' },
                    { kind: 'padding', selector: 'button', side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor del Icon-single:</strong> cuadrado sin alto fijo, con radio completo. Padding Y 8 y padding X por tamaño sobre una caja de contenido de 16 px de ancho: md 56, sm 48 y xs 32 en escritorio; md 48, sm 40 y xs 32 en móvil.
                </>,
                <>
                  <strong>Ícono:</strong> 20 px en md y sm y 16 px en xs en Primary y Secondary; 24 y 20 px en Tertiary. Exige <code>aria-label</code> o <code>aria-labelledby</code>.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños con texto',
                  preview: (
                    <>
                      {btn({ size: 'md' }, 'md')}
                      {btn({ size: 'sm' }, 'sm')}
                      {btn({ size: 'xs' }, 'xs')}
                    </>
                  ),
                  marks: [
                    { n: 1, selector: 'button', index: 0, side: 'top' },
                    { n: 2, selector: 'button', index: 1, side: 'top' },
                    { n: 3, selector: 'button', index: 2, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'button', index: 0 },
                    { kind: 'height', selector: 'button', index: 1 },
                    { kind: 'height', selector: 'button', index: 2 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>md:</strong> alto mínimo de 56.
                </>,
                <>
                  <strong>sm:</strong> alto mínimo de 48.
                </>,
                <>
                  <strong>xs:</strong> alto mínimo de 32. Un ícono de 20 px lo estira a 36.
                </>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description: 'El átomo Button cuenta con 7 estados y 3 tipos. Hover, Focus y Press se fuerzan con state solo para documentar; en uso salen de la interacción.',
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default de cada tipo. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Primary',
              preview: btn({ variant: 'primary', ...withIcons }),
              entries: [
                { part: 'Fondo', color: 'background-button-primary-default' },
                { part: 'Texto', color: 'text-button-primary-default', text: 'typography-button-size-md-uniform' },
                { part: 'Ícono', color: 'icon-button-primary-default' },
                { part: 'Trazo (aparece en Hover)', color: 'border-button-primary-default' },
              ],
            },
            {
              title: 'Secondary low',
              preview: btn({ variant: 'secondary', contrast: 'low', ...withIcons }),
              entries: [
                { part: 'Borde', color: 'border-button-secondary-low-default' },
                { part: 'Texto', color: 'text-button-secondary-low-default', text: 'typography-button-size-md-uniform' },
                { part: 'Ícono', color: 'icon-button-secondary-low-default' },
              ],
            },
            {
              title: 'Secondary high',
              preview: btn({ variant: 'secondary', contrast: 'high', ...withIcons }),
              entries: [
                { part: 'Borde', color: 'border-button-secondary-high-default' },
                { part: 'Texto', color: 'text-button-secondary-high-default', text: 'typography-button-size-md-uniform' },
                { part: 'Ícono', color: 'icon-button-secondary-high-default' },
              ],
            },
            {
              title: 'Tertiary',
              preview: btn({ variant: 'tertiary', ...withIcons }),
              entries: [
                { part: 'Texto', color: 'text-button-tertiary-default', text: 'typography-button-size-md-uniform' },
                { part: 'Ícono', color: 'icon-button-tertiary-default' },
                { part: 'Subrayado', color: 'border-general-gray-fourth' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Button en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Button en la librería de Assets y arrástralo al lienzo. Sus propiedades son Type, Contrats, Size, State, Unicolor e Icon-single.
            </>,
            <>
              <strong>Type y Contrats:</strong> elige Primary, Secondary o Tertiary. Contrats (low o high) solo aplica a Secondary. Para un enlace de texto usa el componente Button link.
            </>,
            <>
              <strong>Size y State:</strong> md, sm o xs; y Default, Hover, Focus, Press, Inactive, Delete o Load (Tertiary no tiene Load).
            </>,
            <>
              <strong>Unicolor e Icon-single:</strong> Unicolor aplica a Secondary y Tertiary con texto. Con Icon-single el botón es cuadrado y lleva solo el ícono; en código exige un nombre accesible.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Button es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Acciones del usuario:</strong> guardar, enviar o confirmar en la misma página. Primary para la acción principal, Secondary para las alternativas y Tertiary para las de menor énfasis.
            </>,
            <>
              <strong>Navegación con aspecto de botón:</strong> con <code>href</code> se dibuja como enlace real (admite Cmd/Ctrl y clic medio) y conserva todos los efectos.
            </>,
            <>
              <strong>Acciones destructivas:</strong> <code>state=&quot;delete&quot;</code> muestra los colores de error del tipo elegido.
            </>,
            <>
              <strong>Procesos en espera:</strong> <code>loading</code> deshabilita el clic, muestra el indicador y anuncia <code>aria-busy</code>.
            </>,
            <>
              <strong>Acciones solo con ícono:</strong> Icon-single con <code>aria-label</code> o <code>aria-labelledby</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Enlaces de texto:</strong> dentro de un párrafo o una lista usa <code>ButtonLink</code>. (Alternativa: Button con <code>href</code> si necesita aspecto de botón).
            </>,
            <>
              <strong>Textos largos:</strong> la etiqueta no se divide en varias líneas. (Alternativa: una acción corta y el detalle en el texto cercano).
            </>,
            <>
              <strong>Navegar desde un <code>onClick</code>:</strong> pierde el clic medio y Cmd/Ctrl. (Alternativa: <code>href</code>).
            </>,
            <>
              <strong>Esperar con Inactive:</strong> un botón atenuado no dice por qué. (Alternativa: <code>loading</code>).
            </>,
            <>
              <strong>Tertiary con estado Load:</strong> no existe; se vería como Inactive.
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
                title: 'Con texto',
                bullets: [
                  <>
                    <strong>Alto mínimo:</strong> md 56, sm 48 y xs 32; ancho mínimo de 92 en md y sm.
                  </>,
                  <>
                    <strong>Ícono de 20 px</strong> en md y sm y de 14 px en xs. Un ícono de 20 px en xs lleva el botón a 36.
                  </>,
                ],
                preview: (
                  <>
                    {btn({ size: 'md' }, 'Botón md')}
                    {btn({ size: 'sm' }, 'Botón sm')}
                    {btn({ size: 'xs' }, 'Botón xs')}
                  </>
                ),
              },
              {
                title: 'Icon-single',
                bullets: [
                  <>
                    <strong>Cuadrado:</strong> md 56, sm 48 y xs 32.
                  </>,
                  <>
                    <strong>Radio completo</strong> y caja de contenido de 16 px de ancho; el ícono se centra.
                  </>,
                ],
                preview: (
                  <div className="flex items-center gap-4">
                    {single({ size: 'md' })}
                    {single({ size: 'sm' })}
                    {single({ size: 'xs' })}
                  </div>
                ),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Con texto:</strong> md 48, sm 40 y xs 32, porque el alto sale de los tokens responsive de Mobile.
              </>,
              <>
                <strong>Icon-single:</strong> md 48, sm 40 y xs 32.
              </>,
              <>
                <strong>Tipografía:</strong> 14 px fijo, igual que en Desktop.
              </>,
            ],
            preview: (
              <>
                {btn({ size: 'md', fullWidth: true }, 'Botón md')}
                {btn({ size: 'sm', fullWidth: true }, 'Botón sm')}
                {btn({ size: 'xs', fullWidth: true }, 'Botón xs')}
                <div className="flex items-center gap-4">
                  {single({ size: 'md' })}
                  {single({ size: 'sm' })}
                  {single({ size: 'xs' })}
                </div>
              </>
            ),
          },
          tablet: {
            bullets: [
              <>
                <strong>Con texto:</strong> md 56, sm 48 y xs 32, los mismos valores que Desktop.
              </>,
              <>
                <strong>Icon-single:</strong> md 56, sm 48 y xs 32.
              </>,
              <>
                <strong>Ancho:</strong> con <code>fullWidth</code> el botón ocupa todo el ancho del contenedor.
              </>,
            ],
            preview: (
              <>
                {btn({ size: 'md', fullWidth: true }, 'Botón md')}
                {btn({ size: 'sm', fullWidth: true }, 'Botón sm')}
                {btn({ size: 'xs', fullWidth: true }, 'Botón xs')}
                <div className="flex items-center gap-4">
                  {single({ size: 'md' })}
                  {single({ size: 'sm' })}
                  {single({ size: 'xs' })}
                </div>
              </>
            ),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de jerarquía, acción destructiva y texto del botón.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Una acción principal',
              description: 'Deja un solo Primary por vista y las alternativas en Secondary o Tertiary.',
              preview: (
                <div className="flex flex-wrap gap-2">
                  {btn({ variant: 'primary' }, 'Guardar')}
                  {btn({ variant: 'secondary' }, 'Cancelar')}
                </div>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Dos acciones principales',
              description: 'No pongas varios Primary juntos: la jerarquía se pierde y no se sabe cuál es la acción principal.',
              preview: (
                <div className="flex flex-wrap gap-2">
                  {btn({ variant: 'primary' }, 'Guardar')}
                  {btn({ variant: 'primary' }, 'Cancelar')}
                </div>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Delete para lo destructivo',
              description: 'Usa state="delete" en la acción que borra o no se puede deshacer, y una alternativa segura al lado.',
              preview: (
                <div className="flex flex-wrap gap-2">
                  {btn({ variant: 'secondary' }, 'Cancelar')}
                  {btn({ variant: 'primary', state: 'delete', leftIcon: <TrashIcon /> }, 'Eliminar')}
                </div>
              ),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Destructiva sin Delete',
              description: 'No presentes una acción destructiva con el aspecto normal de Primary: se confunde con una acción segura.',
              preview: (
                <div className="flex flex-wrap gap-2">
                  {btn({ variant: 'secondary' }, 'Cancelar')}
                  {btn({ variant: 'primary', leftIcon: <TrashIcon /> }, 'Eliminar')}
                </div>
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Texto corto y de acción',
              description: 'Escribe un verbo o una frase breve que diga qué pasa al presionar.',
              preview: btn({ variant: 'primary' }, 'Guardar cambios'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Etiqueta vaga',
              description: 'No uses etiquetas vagas como "Haz clic aquí": no dicen qué pasa al presionar. Nombra la acción.',
              preview: btn({ variant: 'primary' }, 'Haz clic aquí'),
            },
          ],
        },
      ],
    },
  ],
};
