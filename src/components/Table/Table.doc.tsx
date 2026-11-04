import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Dots } from '../Dots';
import { EmptyState } from '../EmptyState';
import { Tag } from '../Tag';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableItem, TableRow } from './Table';
import { TableActions, TableBadgeText, TableHighlightedText, TableProfile, TableText } from './TableContent';
import { TableMobileField, TableMobileList, TableMobileRow } from './TableMobile';
import { TableRowCard } from './TableRowCard';

/*
 * Contenido de la página de documentación de Table (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Table.tsx`, `TableContent.tsx`, `TableMobile.tsx`, `TableRowCard.tsx`, `Table.types.ts`, `Table.variants.ts`), luego
 * `Table.docs.json`. Medidas: encabezado de 48 (56 en Mobile), filas de 74 (1 + 16 + 40 + 16 + 1; 66 en Mobile)
 * separadas 8, radio de 16 en los extremos de la fila; fila móvil con cabecera, campos y fila desplegable de 56.
 *
 * Es un compuesto: las vistas eligen la parte con `index` y con los `data-figma-part` que ya traen las piezas
 * ("Header table/Text", "Cell table", "Item table (Atom)", "Actions Block", "Header", "Dropdown table (Atom)").
 * La tabla de escritorio se dibuja a 960 px y se escala; las cifras son las reales.
 * Diferencias con Figma: el trazo de Default (border/table/default) no existe en tokens.css y se usa
 * background/table/default (mismo valor, trazo invisible); Figma no dibuja el foco de teclado (el código pone un
 * contorno de 2 px en el botón de orden y en los chevrons, y el foco dentro de la fila le da el aspecto Hover).
 */

// Figma: 13751:23691 (component set Table), 13544:69540 (Header table), 13544:69578 (Cell table),
// 13544:69501 (Item table (Atom)), 13544:69601 (Dropdown table), 13544:69614 (Row mobile), 20231:8418 (Card tabla)

interface Person {
  id: string;
  name: string;
  role: string;
  area: string;
  city: string;
  status: string;
}

const ANA: Person = { id: 'ana', name: 'Ana Pérez', role: 'Diseño', area: 'Producto', city: 'Bogotá', status: 'Activo' };
const HUGO: Person = { id: 'hugo', name: 'Hugo García', role: 'Desarrollo', area: 'Plataforma', city: 'Medellín', status: 'En pausa' };

/** Manejador vacío: la casilla de la fila móvil solo aparece si hay quien escuche el cambio. */
const noop = () => {};

const profile = (p: Person) => (
  <TableProfile avatar={<Avatar variant="initials" size="sm" name={p.name} />} name={p.name} description={p.role} />
);

interface TableOptions {
  /** Nombre accesible. Cada muestra lleva uno distinto: si la tabla no cabe, su región de desplazamiento lo usa. */
  label?: string;
  rows?: Person[];
  /** Filas marcadas (ids): aspecto Select y casilla marcada. */
  selected?: string[];
  /** Fila con Hover forzado (`state="hover"`), por posición. */
  hover?: number;
  /** Columna de casillas. */
  checkbox?: boolean;
  /** Encabezados con botón de orden. */
  sortable?: boolean;
  /** Columna de acciones al final. */
  actions?: boolean;
  /** Columnas fijas al inicio (casilla y nombre). */
  sticky?: boolean;
  /** Sin filas: `true` muestra el EmptyState; `'blank'`, el cuerpo vacío. */
  empty?: boolean | 'blank';
  /** Ancho mínimo de 640 px: en un marco angosto la tabla se desplaza en horizontal en vez de apretar las columnas. */
  wide?: boolean;
}

/** Tabla de personas real (`layout="table"`), con las columnas que pida cada muestra. */
const table = ({
  label = 'Personas',
  rows = [ANA, HUGO],
  selected = [],
  hover,
  checkbox = true,
  sortable = false,
  actions = false,
  sticky = false,
  empty = false,
  wide = false,
}: TableOptions = {}) => {
  const all = rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const some = !all && rows.some((r) => selected.includes(r.id));
  const sort = sortable ? 'none' : undefined;
  const columns = 2 + (checkbox ? 1 : 0) + (actions ? 1 : 0);
  return (
    <Table label={label} layout="table" className={wide ? 'min-w-160' : undefined}>
      <TableHeader>
        <TableRow selected={all}>
          {checkbox && (
            <TableHead type="checkbox" sticky={sticky ? 'start' : undefined}>
              <Checkbox aria-label="Seleccionar todas las filas" defaultChecked={all} indeterminate={some} disabled={empty !== false} />
            </TableHead>
          )}
          <TableHead sort={sort} sticky={sticky ? 'start' : undefined} stickyOffset={sticky && checkbox ? '3rem' : undefined}>
            Nombre
          </TableHead>
          <TableHead sort={sort}>Área</TableHead>
          {actions && (
            <TableHead align="center">
              Acciones
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {empty === true && (
          <TableEmpty colSpan={columns}>
            <EmptyState
              type="first-use"
              title="Todavía no hay personas"
              description="Cuando agregues a alguien, aparecerá aquí."
              primaryAction={{ label: 'Agregar persona' }}
            />
          </TableEmpty>
        )}
        {empty === false &&
          rows.map((p, i) => (
            <TableRow key={p.id} selected={selected.includes(p.id)} state={hover === i ? 'hover' : undefined}>
              {checkbox && (
                <TableCell type="checkbox" sticky={sticky ? 'start' : undefined}>
                  <Checkbox aria-label={`Seleccionar a ${p.name}`} defaultChecked={selected.includes(p.id)} />
                </TableCell>
              )}
              <TableCell sticky={sticky ? 'start' : undefined} stickyOffset={sticky && checkbox ? '3rem' : undefined}>
                {profile(p)}
              </TableCell>
              <TableCell>
                <TableText description={p.city}>{p.area}</TableText>
              </TableCell>
              {actions && (
                <TableCell align="center">
                  <TableActions>
                    <Button variant="secondary" size="xs">
                      Ver perfil
                    </Button>
                    <Dots size="xs" label={`Más opciones de ${p.name}`} />
                  </TableActions>
                </TableCell>
              )}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

/** Contenidos de celda (Type de Item table), cada uno en su caja de 40. */
const cellContents = () => (
  <div className="flex flex-col gap-ds-space-general-lg">
    <TableItem>{profile(ANA)}</TableItem>
    <TableItem>
      <TableText description="Bogotá">Producto</TableText>
    </TableItem>
    <TableItem>
      <TableHighlightedText>12 documentos</TableHighlightedText>
    </TableItem>
    <TableItem>
      <TableBadgeText badgeState="success" badgeLabel="Activo" description="Desde el 12 de octubre">
        Activo
      </TableBadgeText>
    </TableItem>
    <TableItem>
      <TableActions>
        <Button variant="secondary" size="xs">
          Ver perfil
        </Button>
        <Dots size="xs" label="Más opciones de Ana Pérez" />
      </TableActions>
    </TableItem>
  </div>
);

/** Fila móvil de una persona: casilla, etiqueta, acciones y 4 campos (3 visibles y uno detrás de la fila desplegable). */
const mobileRow = (p: Person, selected = false) => (
  <TableMobileRow
    key={p.id}
    defaultSelected={selected}
    onSelectedChange={noop}
    selectionLabel={`Seleccionar a ${p.name}`}
    tag={
      <Tag size="sm" iconLeft={false}>
        {p.status}
      </Tag>
    }
    actions={<Dots size="xs" label={`Más opciones de ${p.name}`} />}
    visibleFields={3}
    expandLabel={`Ver más datos de ${p.name}`}
  >
    <TableMobileField label="Nombre">{profile(p)}</TableMobileField>
    <TableMobileField label="Área">
      <TableText description={p.city}>{p.area}</TableText>
    </TableMobileField>
    <TableMobileField label="Estado">
      <TableText>{p.status}</TableText>
    </TableMobileField>
    <TableMobileField label="Rol">
      <TableText>{p.role}</TableText>
    </TableMobileField>
  </TableMobileRow>
);

/** Versión móvil real (`layout="mobile"`): la tabla dibuja la lista de tarjetas. */
const mobileTable = (rows: Person[] = [ANA], selected: string[] = []) => (
  <Table
    label="Personas"
    layout="mobile"
    mobile={<TableMobileList aria-label="Personas">{rows.map((p) => mobileRow(p, selected.includes(p.id)))}</TableMobileList>}
  />
);

/** Tarjeta de fila: resumen de un documento y, abierta, quién lo revisó y el pie. */
const rowCard = (open = false) => (
  <TableRowCard
    className="w-full"
    defaultExpanded={open}
    data-figma={open ? 'Property 1=Variant2' : 'Property 1=Default'}
    summary={
      <>
        <TableText description="Referencia">REF-2041</TableText>
        <TableText description="Fecha">26/10/2026</TableText>
        <TableText description="Documentos">12</TableText>
      </>
    }
    footer={
      <Button variant="tertiary" size="sm">
        Ver más
      </Button>
    }
  >
    {profile({ ...ANA, role: 'Revisó el documento' })}
  </TableRowCard>
);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description: (
      <>
        Reposo. Fondo y trazo de la fila en <code>background/table/default</code>, así que el trazo no se ve.
      </>
    ),
    samples: [table()],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero por la fila o con el foco de teclado dentro de ella. El fondo pasa a <code>background/table/hover</code> y aparece el trazo de 1 px. Aquí se fuerza en la primera fila.
      </>
    ),
    samples: [table({ label: 'Integrantes', hover: 0 })],
  },
  {
    label: 'Select',
    tone: 'accent',
    description: (
      <>
        Fila marcada con su casilla (<code>selected</code>). Gana sobre Hover. Con algunas filas marcadas, la casilla del encabezado queda en mixto; con todas, el encabezado también pasa a Select.
      </>
    ),
    samples: [table({ label: 'Equipo', selected: ['ana'] })],
  },
  {
    label: 'Empty state',
    tone: 'neutral',
    description: (
      <>
        Sin filas. <code>TableEmpty</code> ocupa todas las columnas con un EmptyState y el encabezado se conserva.
      </>
    ),
    samples: [table({ label: 'Invitados', empty: true })],
  },
];

export const doc: ComponentDocContent = {
  name: 'Table',
  icon: 'row-vertical',
  classification: 'composicion',
  summary:
    'Table es la composición para mostrar datos en filas y columnas que se comparan. Une encabezados con orden, filas seleccionables y celdas con perfiles, textos y acciones; en Mobile pasa a tarjetas y, sin datos, muestra un estado vacío.',
  definition: [
    {
      title: 'Anatomía',
      description: (
        <>
          Un <code>&lt;table&gt;</code> real con encabezado, filas y celdas; cada celda lleva una caja de contenido de 40 de alto. En Mobile, cada fila pasa a una tarjeta. La tarjeta de fila presenta un registro con su detalle. Props, en Desarrollo, lista solo las de Table; las de cada pieza (<code>TableRow</code>, <code>TableHead</code>, <code>TableCell</code>, el contenido, la versión móvil y la tarjeta) están en estas pautas y en las historias de Table.
        </>
      ),
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Tabla de escritorio (960 px)',
                  width: 960,
                  preview: table({ sortable: true, actions: true }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Header table/Text"]', index: 2, side: 'top' },
                    { n: 2, selector: 'thead button', index: 0, side: 'top' },
                    { n: 3, selector: 'tbody [data-figma-part="Cell table"]', index: 0, side: 'left' },
                    { n: 4, selector: 'tbody tr', index: 1, side: 'left' },
                    { n: 5, selector: 'tbody [data-figma-part="Cell table"]', index: 6, side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Actions Block"]', index: -1, side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'thead th', index: -1 },
                    { kind: 'height', selector: 'tbody tr', index: 0 },
                    { kind: 'gap', from: 'tbody tr', fromIndex: 0, to: 'tbody tr', toIndex: 1, axis: 'y' },
                    { kind: 'padding', selector: 'tbody [data-figma-part="Cell table"]', index: 2, side: 'top' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Encabezado:</strong> <code>TableHead</code> es un <code>&lt;th scope=&quot;col&quot;&gt;</code> de 48 de alto (<code>dimention/table/header</code>) con padding de 16 (<code>space/general/2xl</code>). Texto de 12/18 semibold en <code>text/neutral/gray</code>. Toma el estado de su fila, como las celdas.
                </>,
                <>
                  <strong>Orden:</strong> con <code>sort</code>, el texto es un botón con el ícono transfer2 de 12 px, a 4 px del texto. La celda anuncia el orden con <code>aria-sort</code> y <code>onSortChange</code> recibe la dirección siguiente.
                </>,
                <>
                  <strong>Columna de selección:</strong> <code>type=&quot;checkbox&quot;</code> en <code>TableHead</code> y <code>TableCell</code>. Mide 48 de ancho, con la casilla de 24 y 4 a cada lado.
                </>,
                <>
                  <strong>Fila:</strong> 74 de alto (trazo de 1, padding de 16, contenido de 40, 16 y 1). Radio de 16 (<code>radius/general/xl</code>) y trazo lateral en la primera y la última celda. Las filas van separadas 8 px (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Celda:</strong> <code>TableCell</code> tiene padding de 12 a los lados (<code>space/general/xl</code>) y 16 arriba y abajo. Su contenido va en una caja de 40 de alto con gap de 8.
                </>,
                <>
                  <strong>Acciones:</strong> <code>TableActions</code> centra Button y Dots xs con gap de 4 en la última columna (<code>align=&quot;center&quot;</code>). Con <code>sticky</code>, la columna queda fija al desplazar en horizontal.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Contenido de la celda',
                  preview: cellContents(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Item table (Atom)"]', index: 0, side: 'left' },
                    { n: 2, selector: '[data-figma-part="Item table (Atom)"]', index: 1, side: 'left' },
                    { n: 3, selector: '[data-figma-part="Item table (Atom)"]', index: 2, side: 'left' },
                    { n: 4, selector: '[data-figma-part="Item table (Atom)"]', index: 3, side: 'left' },
                    { n: 5, selector: '[data-figma-part="Item table (Atom)"]', index: 4, side: 'left' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Item table (Atom)"]', index: 1 },
                    { kind: 'gap', from: '[data-figma-part="Actions Block"] > *', fromIndex: 0, to: '[data-figma-part="Actions Block"] > *', toIndex: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Perfil:</strong> <code>TableProfile</code> (Type Profile). Avatar sm de 32 y, a 8 px, el nombre en 14/20 semibold y la descripción en 12/18. Con <code>badge</code> dibuja el indicador del avatar.
                </>,
                <>
                  <strong>Texto:</strong> <code>TableText</code> (Type Text). Título de 14/20 en <code>text/neutral/white</code> y descripción opcional de 12/18 en <code>text/neutral/gray 2</code>.
                </>,
                <>
                  <strong>Texto destacado:</strong> <code>TableHighlightedText</code> (Type Highlighted text). 14/20 semibold en <code>text/semantic/information-secondary</code>.
                </>,
                <>
                  <strong>Texto con punto:</strong> <code>TableBadgeText</code> (Type Text+badge). Badge simple a 8 px de los textos. Pasa <code>badgeLabel</code>: sin él, el punto es decorativo.
                </>,
                <>
                  <strong>Acciones:</strong> <code>TableActions</code> (Type Button). Button y Dots xs separados 4 px.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Versión móvil (390 px)',
                  width: 390,
                  preview: mobileTable(),
                  marks: [
                    { n: 1, selector: 'li', side: 'right' },
                    { n: 2, selector: '[data-figma-part="Header"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Selection"]', side: 'left' },
                    { n: 4, selector: 'dt', index: 1, side: 'left' },
                    { n: 5, selector: 'dd', index: 1, side: 'right' },
                    { n: 6, selector: '[data-figma-part="Dropdown table (Atom)"]', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: '[data-figma-part="Header"]' },
                    { kind: 'height', selector: 'dd', index: 2 },
                    { kind: 'padding', selector: 'dd', index: 0, side: 'left' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Tarjeta:</strong> <code>TableMobileRow</code> dentro de <code>TableMobileList</code>. Radio de 16, trazo de 1 px y sombra <code>effect/shadow-on-canva-md</code>; las tarjetas van separadas 8 px.
                </>,
                <>
                  <strong>Cabecera:</strong> 56 de alto, con la casilla, la etiqueta (<code>tag</code>, un Tag sm) y las acciones (<code>actions</code>) a la derecha.
                </>,
                <>
                  <strong>Casilla:</strong> marca la fila (<code>selected</code> o <code>defaultSelected</code>) y lleva su propio nombre (<code>selectionLabel</code>).
                </>,
                <>
                  <strong>Nombre del campo:</strong> <code>TableMobileField</code> lo pone en un <code>&lt;dt&gt;</code> de 120 de ancho, en 12/18 semibold. Repite el encabezado de la columna.
                </>,
                <>
                  <strong>Valor:</strong> el contenido de la celda en un <code>&lt;dd&gt;</code>, con padding de 8 a los lados y 12 arriba y abajo. Cada campo mide 56 de alto.
                </>,
                <>
                  <strong>Fila desplegable:</strong> con <code>visibleFields</code>, los campos que sobran se muestran con el chevron (<code>aria-expanded</code>). Mide 56 de alto.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tarjeta de fila cerrada',
                  width: 'fill',
                  preview: rowCard(),
                  marks: [
                    { n: 1, selector: '[data-figma]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Filename"]', index: 0, side: 'top' },
                    { n: 3, selector: 'button[aria-expanded]', side: 'right' },
                  ],
                },
                {
                  label: 'Tarjeta de fila abierta',
                  width: 'fill',
                  preview: rowCard(true),
                  marks: [
                    { n: 4, selector: '[data-figma-part="Avatar"]', side: 'left' },
                    { n: 5, selector: 'button', index: -1, side: 'bottom' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Tarjeta:</strong> <code>TableRowCard</code> (Card tabla en Figma). Padding de 16, radio de 16 y fondo <code>background/container/default-on-canva</code>; abierta pasa a <code>background/container/select-on-canva</code>.
                </>,
                <>
                  <strong>Resumen:</strong> los campos de <code>summary</code>, siempre visibles, en una fila con gap de 32 (24 en Mobile). Si no caben, bajan de línea.
                </>,
                <>
                  <strong>Chevron:</strong> botón de 24 con <code>aria-expanded</code> y <code>aria-controls</code>. Su nombre (<code>toggleLabel</code>, por defecto &quot;Ver detalle&quot;) no cambia al abrir.
                </>,
                <>
                  <strong>Detalle:</strong> lo que pasas como <code>children</code>. Se muestra al abrir, en columna con gap de 24.
                </>,
                <>
                  <strong>Pie:</strong> <code>footer</code>, alineado a la derecha. Solo se ve con la tarjeta abierta.
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
          Table tiene 3 estados de fila y uno de datos (Empty state). Hover se fuerza con <code>state</code> de <code>TableRow</code> solo para documentar; en uso sale del puntero y del foco. Select sale de <code>selected</code>.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description:
        'Tokens del estado Default de cada parte; los de Hover y Select llevan el estado entre paréntesis. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Encabezado',
              preview: table({ label: 'Contactos', sortable: true, rows: [ANA] }),
              entries: [
                { part: 'Fondo', color: 'background-table-default' },
                { part: 'Texto', color: 'text-neutral-gray', text: 'typography-body-size-sm' },
                { part: 'Ícono de orden', color: 'background-general-white' },
              ],
            },
            {
              title: 'Fila',
              preview: table({ label: 'Responsables', rows: [ANA, HUGO], hover: 0, selected: ['hugo'] }),
              entries: [
                { part: 'Fondo', color: 'background-table-default' },
                { part: 'Trazo (mismo valor que el fondo)', color: 'background-table-default' },
                { part: 'Fondo (Hover)', color: 'background-table-hover' },
                { part: 'Trazo (Hover)', color: 'border-table-hover' },
                { part: 'Fondo (Select)', color: 'background-table-select' },
                { part: 'Trazo (Select)', color: 'border-table-select' },
              ],
            },
            {
              title: 'Contenido de la celda',
              preview: cellContents(),
              entries: [
                { part: 'Título y nombre', color: 'text-neutral-white', text: 'typography-body-size-md' },
                { part: 'Descripción', color: 'text-neutral-gray-2', text: 'typography-body-size-sm' },
                { part: 'Texto destacado', color: 'text-semantic-information-secondary', text: 'typography-body-size-md' },
              ],
            },
            {
              title: 'Versión móvil',
              preview: mobileTable(),
              entries: [
                { part: 'Fondo', color: 'background-table-default' },
                { part: 'Trazo (mismo valor que el fondo)', color: 'background-table-default' },
                { part: 'Nombre del campo', color: 'text-neutral-gray', text: 'typography-body-size-sm' },
                { part: 'Línea divisoria', color: 'border-general-default-on-canva' },
                { part: 'Fondo (Select)', color: 'background-table-select' },
                { part: 'Trazo (Select)', color: 'border-table-select' },
              ],
            },
            {
              title: 'Tarjeta de fila',
              preview: rowCard(),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-canva' },
                { part: 'Fondo (abierta)', color: 'background-container-select-on-canva' },
                { part: 'Chevron', color: 'icon-general-default' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Table en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Table en la librería de Assets. Type tiene Table y Empty state (<code>TableEmpty</code>); Sticky 1 y Sticky 2 fijan las dos primeras columnas (<code>sticky</code> y <code>stickyOffset</code>); Column, Column2, Column3 y Container son slots para las columnas.
            </>,
            <>
              <strong>Header table y Cell table:</strong> State Default, Hover y Select es el estado de la fila (<code>selected</code>; <code>state</code> solo lo fuerza). Radius no es una prop: sale de la posición, en la primera y la última celda. Type Text o Checkbox es <code>type</code>, e Icon es <code>sort</code>.
            </>,
            <>
              <strong>Item table (Atom):</strong> Type Profile, Text, Highlighted text, Text+badge y Button son <code>TableProfile</code>, <code>TableText</code>, <code>TableHighlightedText</code>, <code>TableBadgeText</code> y <code>TableActions</code>. Link, Tag, Progress bar, Checkbox, Toggle y Raiting son ButtonLink, Tag, ProgressBar, Checkbox, Switch y StarRating o NumberRating. Item table, sin Atom, es la versión anterior.
            </>,
            <>
              <strong>Row mobile, Dropdown table y Card tabla:</strong> son <code>TableMobileRow</code> (State Select = <code>selected</code>), <code>TableDisclosure</code> (Up On = <code>expanded</code>) y <code>TableRowCard</code> (Variant2 = abierta). Figma no dibuja el foco de teclado; el código marca el botón de orden y los chevrons con un contorno de 2 px.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo Table es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Datos que se comparan:</strong> varios registros con los mismos campos, como personas o documentos. Es un <code>&lt;table&gt;</code> real: el lector anuncia el encabezado de cada celda.
            </>,
            <>
              <strong>Selección de varias filas:</strong> una columna de casillas con <code>useTableSelection</code>. La casilla del encabezado marca todas y queda en mixto con algunas.
            </>,
            <>
              <strong>Orden por columna:</strong> <code>sort</code> vuelve el encabezado un botón y anuncia el orden con <code>aria-sort</code>.
            </>,
            <>
              <strong>Tablas anchas:</strong> si no caben, se desplazan en horizontal, también con las flechas. <code>sticky</code> fija la casilla, el nombre o las acciones.
            </>,
            <>
              <strong>Pantallas angostas:</strong> con <code>mobile</code>, cada fila pasa a una tarjeta con sus campos.
            </>,
          ],
          avoid: [
            <>
              <strong>Elementos con uno o dos datos:</strong> sin columnas que comparar, la tabla sobra. (Alternativa: <code>List item</code>).
            </>,
            <>
              <strong>Un solo registro:</strong> sus datos se leen mejor juntos en una tarjeta. (Alternativa: <code>InformationCard</code>).
            </>,
            <>
              <strong>Una métrica destacada:</strong> un número suelto no necesita filas ni columnas. (Alternativa: <code>DataCard</code>).
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
                title: 'Tabla',
                bullets: [
                  <>
                    <strong>Encabezado de 48</strong> y filas de 74, con padding de 16 arriba y abajo y de 12 a los lados. Las filas van separadas 8 px.
                  </>,
                  <>
                    <strong>Ancho del 100%</strong> del contenedor. Si no cabe, se desplaza en horizontal y las columnas con <code>sticky</code> quedan fijas.
                  </>,
                ],
                preview: table({ label: 'Miembros', sortable: true, actions: true }),
              },
              {
                title: 'Tarjeta de fila',
                bullets: [
                  <>
                    <strong>Resumen en una fila</strong> con los campos separados 32 px. Si no caben, bajan de línea.
                  </>,
                  <>
                    <strong>Detalle debajo</strong> al abrir, en bloques separados 24 px, con el pie a la derecha.
                  </>,
                ],
                preview: rowCard(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Tarjetas:</strong> con <code>layout=&quot;auto&quot;</code> y menos de 48rem, Table dibuja <code>mobile</code>, una tarjeta por fila.
              </>,
              <>
                <strong>Medidas:</strong> cabecera, campos y fila desplegable de 56 de alto; el nombre del campo mide 120 de ancho.
              </>,
              <>
                <strong>Sin <code>mobile</code>:</strong> se dibuja la tabla con encabezado de 56 y celdas con padding de 12 arriba y abajo y de 8 a los lados. Oculta el ícono de orden y se desplaza en horizontal.
              </>,
            ],
            preview: mobileTable([ANA, HUGO]),
          },
          tablet: {
            bullets: [
              <>
                <strong>Medidas:</strong> las mismas de Desktop, con el encabezado de 48 y las filas de 74.
              </>,
              <>
                <strong>Tabla:</strong> desde 48rem, <code>layout=&quot;auto&quot;</code> dibuja la tabla y no las tarjetas.
              </>,
              <>
                <strong>Columnas fijas:</strong> si la tabla no cabe, fija la casilla y el nombre con <code>sticky</code> para que no se pierdan al desplazar.
              </>,
            ],
            preview: table({ label: 'Participantes', sticky: true, wide: true, actions: true }),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de versión móvil, selección y estado vacío.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Tarjetas en Mobile',
              description: (
                <>
                  En Mobile, pasa <code>mobile</code> para mostrar una tarjeta por fila.
                </>
              ),
              preview: mobileTable(),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tabla ancha en Mobile',
              description: 'No dejes la tabla ancha en Mobile: obliga a desplazarse en horizontal.',
              preview: table({ label: 'Personas del equipo', actions: true, wide: true }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Selección con casilla',
              description: 'Marca la selección con la casilla de cada fila.',
              preview: table({ label: 'Revisores', selected: ['ana'] }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Selección solo con color',
              description: 'No marques la selección solo con el color: el lector de pantalla no la anuncia.',
              preview: table({ label: 'Autores', selected: ['ana'], checkbox: false }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Estado vacío con mensaje',
              description: 'Sin filas, deja el encabezado y di qué falta con un EmptyState.',
              preview: table({ label: 'Personas invitadas', empty: true }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Tabla vacía sin mensaje',
              description: 'No dejes la tabla vacía sin mensaje: no se sabe si faltan datos o si hubo un error.',
              preview: table({ label: 'Colaboradores', empty: 'blank' }),
            },
          ],
        },
      ],
    },
  ],
};
