import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Checkbox } from '../Checkbox';
import { ProgressBar } from '../ProgressBar';
import { Switch } from '../Switch';
import { DataCard } from './DataCard';

/*
 * Contenido de la página de documentación de DataCard (plantilla v2). Manda el código (`DataCard.types.ts`,
 * `DataCard.variants.ts`, `DataCard.tsx`), luego `DataCard.docs.json`. Diferencias con Figma: el set llama a sus
 * estados `Propiedad 1` (Propiedad 14, Hover, Select, Inactive); Inactive pinta la superficie como Hover y con trazo
 * y el código la deja como Default; el trazo de Select mide 1 px en el código y md en Figma.
 */

// Figma: 14043:59910 (component set Data card)

const graphic = () => <ProgressBar label="Avance del proyecto" value={72} showValue={false} />;
// Muestras a 560 px (Anatomía, Estados, Tokens, Desktop); `narrow` = ancho del marco de teléfono (Do and Dont’s, Mobile)
const sample = (node: ReactNode, narrow = false) => (narrow ? node : <div className="w-140">{node}</div>);
// En el lienzo de Anatomía la superficie de la tarjeta se funde con el fondo: se apoya en la superficie del tema
const onCanva = (node: ReactNode) => (
  <div className="w-100 rounded-ds-radius-general-2xl bg-ds-background-general-black p-ds-space-general-xl">{node}</div>
);
const card = (props: Partial<ComponentProps<typeof DataCard>> = {}, narrow = false) =>
  sample(
    <DataCard title="72%" description="Avance del proyecto" {...props}>
      {graphic()}
    </DataCard>,
    narrow
  );
const plain = (props: Partial<ComponentProps<typeof DataCard>> = {}, narrow = false) =>
  sample(<DataCard title="24" description="Reportes generados" {...props} />, narrow);
const withSwitch = (props: Partial<ComponentProps<typeof DataCard>> = {}, narrow = false) =>
  sample(
    <DataCard
      title="Alertas"
      description="Avisar si baja el avance"
      icon="notification"
      action={<Switch defaultChecked aria-label="Activar alertas" />}
      {...props}
    />,
    narrow
  );
const toggle = (props: Partial<ComponentProps<typeof DataCard>> = {}, control: Partial<ComponentProps<typeof Switch>> = {}) =>
  plain({ title: '12', description: 'Equipo A', action: <Switch aria-label="Activar equipo A" {...control} />, ...props }, true);
const choice = (props: Partial<ComponentProps<typeof DataCard>> = {}, checkbox: Partial<ComponentProps<typeof Checkbox>> = {}, narrow = false) =>
  plain({ title: '12', description: 'Equipo A', action: <Checkbox aria-label="Elegir equipo A" {...checkbox} />, ...props }, narrow);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: <>Reposo. Superficie <code>background/container/default-on-card</code> y avatar sobre el lienzo.</>,
    samples: [card()],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: 'Al pasar el puntero, la superficie y el avatar cambian de tono. La tarjeta no se pulsa: el cambio es solo visual.',
    samples: [card({ state: 'hover' })],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: <>Con <code>selected</code>, la superficie toma el tono de hover y suma un trazo de 1 px. Es solo visual: el control de <code>action</code> lleva la selección real.</>,
    samples: [choice({ selected: true }, { defaultChecked: true })],
  },
  {
    label: 'Inactive',
    tone: 'neutral',
    description: <>Con <code>inactive</code>, el título, la descripción y el glifo pasan a gris. Es solo visual: deshabilita también el control de <code>action</code>.</>,
    samples: [choice({ inactive: true }, { disabled: true })],
  },
];

export const doc: ComponentDocContent = {
  name: 'DataCard',
  icon: 'chart-square',
  classification: 'molecula',
  summary:
    'DataCard es la molécula para mostrar un dato o una métrica con su contexto. Combina un avatar de ícono, un título grande, una descripción, un espacio para un gráfico y un control opcional al final de la fila.',
  definition: [
    {
      title: 'Anatomía',
      description: 'La tarjeta es una fila: el avatar y el texto a la izquierda, y el gráfico o el control a la derecha.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Tarjeta con gráfico',
                  preview: onCanva(card({}, true)),
                  marks: [
                    { n: 1, selector: '[data-slot="card"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon Right"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Título"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Descripción"]', side: 'bottom' },
                    { n: 5, selector: '[data-figma-part="Container graphic"]', side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-slot="card"]', side: 'left' },
                    { kind: 'gap', from: '[data-figma-part="Text container"]', to: '[data-figma-part="Container graphic"]' },
                  ],
                },
                {
                  label: 'Tarjeta con control',
                  preview: onCanva(withSwitch({}, true)),
                  marks: [
                    { n: 1, selector: '[data-slot="card"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Icon Right"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Título"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Descripción"]', side: 'bottom' },
                    { n: 6, selector: '[data-slot="action"]', side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <><strong>Contenedor:</strong> fila de ancho completo, con el padding <code>space/container/on-card</code>, la separación <code>space/general/3xl</code> y la esquina <code>radius/general/2xl</code>. La superficie es la común de las tarjetas, sin muesca ni sombra.</>,
                <><strong>Avatar:</strong> <code>Avatar</code> de tipo <code>icon</code>, con el ícono de <code>icon</code> (por defecto <code>chart-square</code>). <code>leading</code> lo reemplaza, por ejemplo por un <code>Avatar</code> con foto; con <code>null</code> se quita.</>,
                <><strong>Título:</strong> el dato o la métrica principal, en la fuente secundaria semibold de 48 px. Es un encabezado <code>h3</code>; <code>headingLevel</code> cambia el nivel y <code>&quot;none&quot;</code> lo deja como párrafo.</>,
                <><strong>Descripción:</strong> el contexto del dato, en la fuente primaria regular, con <code>typography/body/size/lg</code>. Es opcional.</>,
                <><strong>Gráfico:</strong> el slot <code>children</code>. Comparte el ancho de la fila con el texto. Es decorativo salvo que traiga su propio texto o nombre accesible.</>,
                <><strong>Control:</strong> el slot <code>action</code>, un solo control al final de la fila: <code>Switch</code>, <code>Button</code>, <code>Checkbox</code> o <code>Radio</code>.</>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description: <>DataCard tiene 4 estados, los del set de Figma. No es interactiva: no tiene Focus ni Press, y el foco lo recibe el control de <code>action</code>. Hover se fuerza con <code>state</code> solo para documentar.</>,
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default y de los estados Select e Inactive. La tarjeta no fuerza un modo de color.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Default y Hover',
              preview: card(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-card' },
                { part: 'Fondo (aparece en Hover)', color: 'background-container-hover-on-card' },
                { part: 'Avatar', color: 'background-icon-default-on-canva' },
                { part: 'Avatar (aparece en Hover)', color: 'background-icon-default-on-card' },
                { part: 'Título', color: 'text-neutral-heading', text: 'primitives-typography-size-6xl' },
                { part: 'Descripción', color: 'text-neutral-body', text: 'typography-body-size-lg' },
              ],
            },
            {
              title: 'Select',
              preview: choice({ selected: true }, { defaultChecked: true }),
              entries: [
                { part: 'Fondo', color: 'background-container-hover-on-card' },
                { part: 'Trazo', color: 'border-general-default-on-card' },
                { part: 'Avatar', color: 'background-icon-default-on-card' },
              ],
            },
            {
              title: 'Inactive',
              preview: choice({ inactive: true }, { disabled: true }),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-card' },
                { part: 'Título', color: 'text-neutral-disabled-on-canva', text: 'primitives-typography-size-6xl' },
                { part: 'Descripción', color: 'text-neutral-disabled-on-canva', text: 'typography-body-size-lg' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente DataCard en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <><strong>Búsqueda y configuración:</strong> encuentra el componente como Data card en la librería de Assets. Sus propiedades son Tittle, Description, Container graphic y la variante.</>,
            <><strong>Tittle y Description:</strong> son el texto de la tarjeta. En el código son <code>title</code> y <code>description</code>.</>,
            <><strong>Container graphic:</strong> es un slot para el gráfico. En el código es <code>children</code>.</>,
            <><strong>Propiedad 1:</strong> es la variante, con los valores Propiedad 14, Hover, Select e Inactive. Propiedad 14 equivale a Default. En el código son <code>state</code>, <code>selected</code> e <code>inactive</code>.</>,
            <><strong>Diferencias:</strong> Toggle, Button y Selection están ocultos en las cuatro variantes; en el código son el slot <code>action</code>. Inactive pinta la superficie como Hover y con trazo; el código la deja como Default.</>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo DataCard es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <><strong>Mostrar una métrica:</strong> pon el dato en <code>title</code> y su contexto en <code>description</code>. Suma un gráfico en <code>children</code> si ayuda a leerlo.</>,
            <><strong>Activar o desactivar algo:</strong> pasa un <code>Switch</code> en <code>action</code>, con su <code>aria-label</code>.</>,
            <><strong>Elegir entre tarjetas:</strong> usa <code>Checkbox</code> o <code>Radio</code> en <code>action</code> y marca <code>selected</code> en la elegida.</>,
            <><strong>Ordenar los encabezados:</strong> ajusta <code>headingLevel</code> al nivel de la sección. Usa <code>&quot;none&quot;</code> cuando la rejilla repite muchas tarjetas.</>,
          ],
          avoid: [
            <><strong>Tarjeta que se elige entera:</strong> DataCard no se pulsa, solo su control. (Alternativa: <code>InteractiveCard</code>).</>,
            <><strong>Contenido con varias secciones:</strong> no pongas etiquetas, pie ni botones en una fila de dato. (Alternativa: <code>InformationCard</code>).</>,
            <><strong>Gráfico que dice algo que el texto no dice:</strong> el slot es decorativo por defecto. (Alternativa: repite el dato en <code>title</code> o <code>description</code>).</>,
            <><strong>Persona, archivo o producto:</strong> no tienen datos propios aquí. (Alternativa: <code>ContactCard</code>, <code>FileCard</code>, <code>ProductCard</code> o <code>ProfileCard</code>).</>,
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
                title: 'Con gráfico',
                bullets: [
                  <>Padding de 24 px y separación de 24 px entre el avatar, el texto y el gráfico.</>,
                  <>Título de 48 px con altura de línea de 52 px. Descripción de 16 px con altura de línea de 22 px.</>,
                ],
                preview: card(),
              },
              {
                title: 'Con control',
                bullets: [
                  <>El control ocupa su propio ancho al final de la fila; el texto toma el espacio que queda.</>,
                  <>Con gráfico y control a la vez, el texto y el gráfico se reparten el ancho que deja el control.</>,
                ],
                preview: withSwitch(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>Padding de 16 px y separación de 20 px entre el avatar, el texto y el gráfico.</>,
              <>El título sigue en 48 px, con altura de línea de 44 px. La descripción baja a 14 px, con altura de línea de 20 px.</>,
              <>La tarjeta ocupa el ancho disponible y el texto ajusta línea.</>,
            ],
            preview: card({}, true),
          },
          tablet: {
            bullets: [
              <>Padding de 24 px y separación de 24 px, como en Desktop.</>,
              <>Título de 48 px con altura de línea de 52 px. Descripción de 16 px con altura de línea de 22 px.</>,
              <>La tarjeta ocupa el ancho disponible y el texto ajusta línea.</>,
            ],
            preview: card({}, true),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Criterios para presentar datos claros y controles que respondan igual que se ven.',
      blocks: [
        {
          type: 'practices',
          items: [
            { kind: 'do', framed: true, title: 'Dato en el título', description: 'Pon el dato en el título y su contexto en la descripción.', preview: plain({ title: '72%', description: 'Avance del proyecto' }, true) },
            { kind: 'dont', framed: true, title: 'Frase en el título', description: 'No pongas una frase en el título: a 48 px ocupa varias líneas.', preview: plain({ title: 'Avance general del proyecto', description: '72%' }, true) },
            { kind: 'do', framed: true, title: 'Selección completa', description: <>Enciende el control de <code>action</code> junto con <code>selected</code>.</>, preview: toggle({ selected: true }, { defaultChecked: true }) },
            { kind: 'dont', framed: true, title: 'Selección solo visual', description: <>No uses <code>selected</code> con el control apagado: la selección real la lleva el control.</>, preview: toggle({ selected: true }) },
            { kind: 'do', framed: true, title: 'Inactiva y deshabilitada', description: <>Deshabilita el control de <code>action</code> cuando uses <code>inactive</code>.</>, preview: toggle({ inactive: true }, { defaultChecked: true, disabled: true }) },
            { kind: 'dont', framed: true, title: 'Inactiva con control activo', description: <>No uses <code>inactive</code> con el control habilitado: la tarjeta se ve apagada, pero el interruptor sigue operable.</>, preview: toggle({ inactive: true }, { defaultChecked: true }) },
          ],
        },
      ],
    },
  ],
};
