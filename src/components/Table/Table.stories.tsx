import type { Meta, StoryObj } from '@storybook/react';
import { Fragment, useState } from 'react';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableItem,
  TableRow,
} from './Table';
import { TableActions, TableBadgeText, TableHighlightedText, TableProfile, TableText } from './TableContent';
import { TableDisclosure } from './TableDisclosure';
import { TableMobileField, TableMobileList, TableMobileRow } from './TableMobile';
import { TableRowCard } from './TableRowCard';
import { useTableSelection } from './useTableSelection';
import type { TableLayout, TableRowState, TableSortDirection } from './Table.types';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { ButtonLink } from '../ButtonLink';
import { Checkbox } from '../Checkbox';
import { Chip } from '../Chip';
import { Dots } from '../Dots';
import { EmptyState } from '../EmptyState';
import { Icon } from '../Icon';
import { ProgressBar } from '../ProgressBar';
import { NumberRating, StarRating } from '../Rating';
import { Switch } from '../Switch';
import { Tag } from '../Tag';
import { cn } from '../../utils/cn';

const meta = {
  title: 'Data Display/Table',
  component: Table,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'radio',
      options: ['auto', 'table', 'mobile'],
      type: { name: 'enum', value: ['auto', 'table', 'mobile'] },
      description: 'auto: tabla y, en móvil, la versión `mobile`; table o mobile la fuerzan',
    },
    label: { control: 'text', type: { name: 'string', required: true }, description: 'Nombre accesible de la tabla' },
  },
  args: { label: 'Personas', layout: 'auto' },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// ───────────────────────── datos de ejemplo ─────────────────────────

interface Person {
  id: string;
  name: string;
  role: string;
  area: string;
  city: string;
  status: string;
  updated: string;
  count: number;
}

const PEOPLE: Person[] = [
  { id: 'p1', name: 'Ana Pérez', role: 'Diseño', area: 'Producto', city: 'Bogotá', status: 'Activo', updated: '12 oct. 2026', count: 3 },
  { id: 'p2', name: 'Hugo García', role: 'Desarrollo', area: 'Plataforma', city: 'Medellín', status: 'Activo', updated: '10 oct. 2026', count: 1 },
  { id: 'p3', name: 'Laura Gómez', role: 'Investigación', area: 'Producto', city: 'Cali', status: 'En pausa', updated: '08 oct. 2026', count: 0 },
  { id: 'p4', name: 'Mario Ruiz', role: 'Soporte', area: 'Operación', city: 'Bogotá', status: 'Activo', updated: '05 oct. 2026', count: 5 },
  { id: 'p5', name: 'Sofía Díaz', role: 'Datos', area: 'Plataforma', city: 'Barranquilla', status: 'Activo', updated: '01 oct. 2026', count: 2 },
];

type SortKey = 'name' | 'role' | 'area' | 'city' | 'updated';

function sortPeople(rows: Person[], key: SortKey | null, dir: TableSortDirection): Person[] {
  if (!key || dir === 'none') return rows;
  const sorted = [...rows].sort((a, b) => a[key].localeCompare(b[key], 'es'));
  return dir === 'descending' ? sorted.reverse() : sorted;
}

/** Acciones de la última columna: Button secondary xs con contador, y Dots xs. */
function RowActions({ person }: { person: Person }) {
  return (
    <TableActions>
      <Button
        variant="secondary"
        size="xs"
        iconSize={16}
        rightIcon={<Badge type="number" state="info">{String(person.count).padStart(2, '0')}</Badge>}
      >
        Detalle<span className="sr-only">, {person.count} elementos</span>
      </Button>
      <Dots size="xs" label={`Más opciones de ${person.name}`} />
    </TableActions>
  );
}

// ───────────────────────── historias ─────────────────────────

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'role', label: 'Rol' },
  { key: 'area', label: 'Área' },
  { key: 'city', label: 'Ciudad' },
  { key: 'updated', label: 'Actualizado' },
];

function PeopleTable({ label, layout, rows = PEOPLE }: { label: string; layout?: TableLayout; rows?: Person[] }) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<TableSortDirection>('none');
  const selection = useTableSelection(rows.map((r) => r.id));
  const sorted = sortPeople(rows, sortKey, sortDir);
  const sortOf = (key: SortKey): TableSortDirection => (sortKey === key ? sortDir : 'none');
  const onSort = (key: SortKey) => (next: Exclude<TableSortDirection, 'none'>) => {
    setSortKey(key);
    setSortDir(next);
  };

  const mobile = (
    <TableMobileList aria-label={label}>
      {sorted.map((p) => (
        <TableMobileRow
          key={p.id}
          selected={selection.isSelected(p.id)}
          onSelectedChange={(on) => selection.toggle(p.id, on)}
          selectionLabel={`Seleccionar a ${p.name}`}
          tag={<Tag size="sm" iconLeft={false}>{p.status}</Tag>}
          actions={<Dots size="xs" label={`Más opciones de ${p.name}`} />}
          visibleFields={3}
          expandLabel={`Ver más datos de ${p.name}`}
        >
          <TableMobileField label="Nombre">
            <TableProfile avatar={<Avatar variant="initials" size="sm" name={p.name} />} name={p.name} description={p.role} />
          </TableMobileField>
          <TableMobileField label="Área">
            <TableText description={p.city}>{p.area}</TableText>
          </TableMobileField>
          <TableMobileField label="Actualizado">
            <TableText>{p.updated}</TableText>
          </TableMobileField>
          <TableMobileField label="Elementos">
            <TableText>{p.count}</TableText>
          </TableMobileField>
        </TableMobileRow>
      ))}
    </TableMobileList>
  );

  return (
    <Table label={label} layout={layout} mobile={mobile} className="min-w-240">
      <TableHeader>
        <TableRow selected={selection.allSelected}>
          <TableHead type="checkbox" sticky="start">
            <Checkbox
              aria-label="Seleccionar todas las filas"
              checked={selection.allSelected}
              indeterminate={selection.someSelected}
              onChange={selection.toggleAll}
            />
          </TableHead>
          <TableHead sticky="start" stickyOffset="3rem" className="w-66" sort={sortOf('name')} onSortChange={onSort('name')}>
            Nombre
          </TableHead>
          {COLUMNS.map((c) => (
            <TableHead key={c.key} sort={sortOf(c.key)} onSortChange={onSort(c.key)}>
              {c.label}
            </TableHead>
          ))}
          <TableHead align="center" sticky="end">
            Acciones
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((p) => (
          <TableRow key={p.id} selected={selection.isSelected(p.id)}>
            <TableCell type="checkbox" sticky="start">
              <Checkbox
                aria-label={`Seleccionar a ${p.name}`}
                checked={selection.isSelected(p.id)}
                onChange={(e) => selection.toggle(p.id, e.target.checked)}
              />
            </TableCell>
            <TableCell sticky="start" stickyOffset="3rem">
              <TableProfile avatar={<Avatar variant="initials" size="sm" name={p.name} />} name={p.name} description={p.status} />
            </TableCell>
            <TableCell>
              <TableText description="Rol">{p.role}</TableText>
            </TableCell>
            <TableCell>
              <TableText description="Equipo">{p.area}</TableText>
            </TableCell>
            <TableCell>
              <TableText description="Sede">{p.city}</TableText>
            </TableCell>
            <TableCell>
              <TableText description="Último cambio">{p.updated}</TableText>
            </TableCell>
            <TableCell align="center" sticky="end">
              <RowActions person={p} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Tabla completa: selección por fila (cabecera con estado mixto), orden por columna, columnas fijas y acciones. */
export const Interactive: Story = {
  render: (args) => <PeopleTable label={args.label} layout={args.layout} />,
};

/** Estado vacío: la cabecera se conserva y el EmptyState ocupa todas las columnas. */
export const Empty: Story = {
  render: (args) => (
    <Table label={args.label} layout="table">
      <TableHeader>
        <TableRow>
          <TableHead type="checkbox">
            <Checkbox aria-label="Seleccionar todas las filas" disabled />
          </TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead align="center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty colSpan={4}>
          <EmptyState
            type="first-use"
            title="Todavía no hay personas"
            description="Cuando agregues a alguien, aparecerá en esta tabla."
            primaryAction={{ label: 'Agregar persona' }}
          />
        </TableEmpty>
      </TableBody>
    </Table>
  ),
};

/** Versión móvil forzada: una tarjeta por fila; el botón de abajo muestra los campos restantes. */
export const Mobile: Story = {
  args: { layout: 'mobile' },
  render: (args) => <PeopleTable label={args.label} layout="mobile" />,
};

function ExpandableDemo() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Table label="Personas con detalle" layout="table">
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Área</TableHead>
          <TableHead align="center">Detalle</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {PEOPLE.slice(0, 3).map((p) => {
          const expanded = open === p.id;
          const detailId = `detalle-${p.id}`;
          return (
            <Fragment key={p.id}>
              <TableRow>
                <TableCell>
                  <TableProfile avatar={<Avatar variant="initials" size="sm" name={p.name} />} name={p.name} description={p.role} />
                </TableCell>
                <TableCell>
                  <TableText description={p.city}>{p.area}</TableText>
                </TableCell>
                <TableCell align="center">
                  <TableActions>
                    <Button
                      variant="tertiary"
                      size="xs"
                      iconOnly
                      aria-label={`Detalle de ${p.name}`}
                      aria-expanded={expanded}
                      aria-controls={detailId}
                      onClick={() => setOpen(expanded ? null : p.id)}
                    >
                      <Icon name={expanded ? 'chevron-up' : 'chevron-down'} variant="fill" />
                    </Button>
                  </TableActions>
                </TableCell>
              </TableRow>
              <TableRow id={detailId} hidden={!expanded}>
                <TableCell colSpan={3}>
                  <TableText description={`Actualizado el ${p.updated}`}>{`${p.name} tiene ${p.count} elementos asignados.`}</TableText>
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

/** Fila desplegable en escritorio: el chevron de la columna de acciones abre una fila de detalle (APG Disclosure). */
export const ExpandableRow: Story = {
  render: () => <ExpandableDemo />,
};

function RowCardSummary() {
  return (
    <>
      <span data-figma-part="Filename" className="w-43 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-white">
        REF-2041
      </span>
      <span className="flex w-43 items-center gap-ds-space-general-lg">
        <Badge type="simple" state="negative" />
        <span data-figma-part="Filename" className="font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-gray-2">
          26 oct. 2026
        </span>
      </span>
      <span data-figma-part="Filename" className="w-43 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-gray-2">
        12 elementos
      </span>
      <span data-figma-part="Filename" className="w-43 font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)] text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-gray-2">
        $ 1.326.000
      </span>
      <Chip icon={false}>Adjuntos</Chip>
    </>
  );
}

const cardText = 'font-ds-primitives-typography-family-primary [font-weight:var(--ds-primitives-typography-weight-regular)]';

function RowCardItem({ name, units }: { name: string; units: string }) {
  return (
    <div className="flex items-center justify-between gap-ds-space-general-4xl">
      <span className="flex w-88 items-center gap-ds-space-general-2xl">
        <Avatar variant="initials" size="sm" name={name} />
        <span data-figma-part="Filename" className={`${cardText} text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-white`}>
          {name}
        </span>
      </span>
      <span data-figma-part="Filename" className={`${cardText} w-40 text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-gray-2`}>
        {units}
      </span>
      <span data-figma-part="Filename" className={`${cardText} w-40 text-ds-typography-body-size-sm leading-ds-typography-body-line-height-large-sm text-ds-text-neutral-gray-2`}>
        $ 366.000
      </span>
    </div>
  );
}

/** Bloque de detalle de la tarjeta abierta: cabecera (ícono, título, estado, referencia y acción) y sus elementos. */
function RowCardDetail({ title, status, statusType }: { title: string; status: string; statusType: 'alert' | 'info' }) {
  return (
    <div className="flex flex-col gap-ds-space-general-3xl rounded-ds-radius-general-xl bg-ds-background-container-select-on-canva p-ds-space-general-3xl shadow-[inset_0_0_0_var(--ds-responsive-border-general-md)_var(--color-ds-border-general-default-on-card)]">
      <div className="flex items-center gap-ds-space-general-2xl">
        <Avatar variant="icon" size="xs" icon="box-2" />
        <h3 className="m-0 font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)] text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-white">
          {title}
        </h3>
        <div className="flex flex-1 items-center justify-between gap-ds-space-general-sm">
          <Tag type={statusType} iconLeft={false}>
            {status}
          </Tag>
          <span className={`${cardText} text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-white`}>
            Referencia{' '}
            <ButtonLink href="#tabla" iconRight={false}>
              0012-4471
            </ButtonLink>
          </span>
        </div>
        <Button variant="secondary" size="xs" iconOnly aria-label={`Imprimir ${title}`}>
          <Icon name="print" variant="fill" data-figma-part="Icon-sizes" />
        </Button>
      </div>
      <div className="flex flex-col gap-ds-space-general-2xl">
        <RowCardItem name="Elemento A" units="4 unidades" />
        <RowCardItem name="Elemento B" units="2 unidades" />
      </div>
    </div>
  );
}

/** Tarjeta de fila: resumen siempre visible y detalle que se abre con el chevron. */
export const RowCard: Story = {
  render: () => (
    <div className="flex flex-col gap-ds-space-general-3xl">
      <TableRowCard summary={<RowCardSummary />} footer={<Button variant="tertiary" size="sm">Ver más</Button>}>
        <RowCardDetail title="Grupo 1" status="Pendiente" statusType="alert" />
      </TableRowCard>
      <TableRowCard defaultExpanded summary={<RowCardSummary />} footer={<Button variant="tertiary" size="sm">Ver más</Button>}>
        <RowCardDetail title="Grupo 1" status="Pendiente" statusType="alert" />
        <RowCardDetail title="Grupo 2" status="Recibido" statusType="info" />
      </TableRowCard>
    </div>
  ),
};

// ───────────────────────── tests ─────────────────────────

/** Teclado: Espacio en la casilla de una fila deja la cabecera en mixto; la de la cabecera selecciona todas. */
export const SelectionTest: Story = {
  tags: ['!autodocs'],
  render: (args) => <PeopleTable label={args.label} layout="table" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('table', { name: 'Personas' })).toBeInTheDocument();
    const all = canvas.getByRole<HTMLInputElement>('checkbox', { name: 'Seleccionar todas las filas' });
    const first = canvas.getByRole<HTMLInputElement>('checkbox', { name: 'Seleccionar a Ana Pérez' });
    first.focus();
    await userEvent.keyboard(' ');
    await expect(first).toBeChecked();
    await expect(all.indeterminate).toBe(true);
    await expect(first.closest('tr')).toHaveAttribute('data-selected');
    await userEvent.click(all);
    await expect(all).toBeChecked();
    for (const box of canvas.getAllByRole<HTMLInputElement>('checkbox')) await expect(box).toBeChecked();
    await userEvent.click(all);
    await expect(first).not.toBeChecked();
  },
};

/** Orden: el botón del encabezado alterna ascendente y descendente y la celda anuncia `aria-sort`. */
export const SortTest: Story = {
  tags: ['!autodocs'],
  render: (args) => <PeopleTable label={args.label} layout="table" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Nombre' });
    const header = button.closest('th');
    await expect(header).not.toHaveAttribute('aria-sort');
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.keyboard(' ');
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    const firstName = canvas.getAllByRole('row')[1];
    await expect(within(firstName).getByText('Sofía Díaz')).toBeInTheDocument();
  },
};

/** Fila móvil: la casilla selecciona y el botón de abajo (aria-expanded) muestra el campo oculto. */
export const MobileTest: Story = {
  tags: ['!autodocs'],
  render: (args) => <PeopleTable label={args.label} layout="mobile" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'Personas' })).toBeInTheDocument();
    await expect(canvas.queryAllByText('Elementos')).toHaveLength(0);
    const toggle = canvas.getByRole('button', { name: 'Ver más datos de Ana Pérez' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    toggle.focus();
    await userEvent.keyboard('{Enter}');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getAllByText('Elementos')).toHaveLength(1);
    const box = canvas.getByRole('checkbox', { name: 'Seleccionar a Ana Pérez' });
    await userEvent.click(box);
    await expect(box.closest('li')).toHaveAttribute('data-selected');
  },
};

/** Tarjeta de fila: el chevron abre y cierra el detalle. */
export const RowCardTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <TableRowCard summary={<RowCardSummary />}>
      <RowCardDetail title="Grupo 1" status="Pendiente" statusType="alert" />
    </TableRowCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Ver detalle' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('heading', { name: 'Grupo 1' })).toBeNull();
    toggle.focus();
    await userEvent.keyboard(' ');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('heading', { name: 'Grupo 1' })).toBeVisible();
  },
};

// ───────────────────────── matrices de Figma ─────────────────────────

const ITEM = 'Nombre del item';
const DESC = 'Descripción';
const ROW_STATES: { figma: string; state: TableRowState }[] = [
  { figma: 'Default', state: 'default' },
  { figma: 'Hover', state: 'hover' },
  { figma: 'Select', state: 'select' },
];

const label = 'text-xs text-ds-text-neutral-body';

function ProfileItem() {
  return <TableProfile avatar={<Avatar variant="initials" size="sm" name="Hugo García" />} name={ITEM} description={DESC} />;
}

/** Acciones del Type=Button (fila de 40): Button con contador, editar, eliminar, más opciones y chevron. */
function FullActions({ edit = true, chevron = true, start = false }: { edit?: boolean; chevron?: boolean; start?: boolean }) {
  return (
    <TableActions className={start ? 'flex-none justify-start' : undefined}>
      <Button variant="secondary" size="xs" iconSize={16} rightIcon={
          <Badge type="number" state="info">
            <span data-figma-part="00">03</span>
          </Badge>
        }
      >
        Detalle<span className="sr-only">, 3 elementos</span>
      </Button>
      {edit && (
        <span className="inline-flex gap-ds-space-general-md" data-figma-part="Icon Buttons">
          <Button variant="tertiary" size="xs" iconOnly aria-label="Editar">
            <Icon name="edit" variant="fill" data-figma-part="Icon-sizes" />
          </Button>
          <Button variant="tertiary" size="xs" state="delete" iconOnly aria-label="Eliminar">
            <Icon name="trash" variant="fill" data-figma-part="Icon-sizes" />
          </Button>
        </span>
      )}
      <Dots size="xs" />
      {chevron && (
        <Button variant="tertiary" size="xs" iconOnly aria-label="Ver detalle" data-figma-part="Chevron">
          <Icon name="chevron-down" variant="fill" data-figma-part="Icon-sizes" />
        </Button>
      )}
    </TableActions>
  );
}

/**
 * Set `Table` (13751:23691): Type=Table (cabecera + 10 filas, columnas fijas Sticky 1 y 2) y Type=Empty state.
 * Superficie: background/general/black. El texto del botón "Guía" de Figma se cambia por "Detalle" (texto neutro).
 */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-ds-space-general-4xl bg-ds-background-general-black p-6">
      <span className={label}>Type=Table</span>
      <Table label="Tabla de ejemplo" layout="table" data-figma="Type=Table">
        <TableHeader>
          <TableRow>
            <TableHead type="checkbox" sticky="start" data-figma-part="Header table">
              <Checkbox aria-label="Seleccionar todas las filas" />
            </TableHead>
            <TableHead sticky="start" stickyOffset="3rem" className="w-66" sort="none">
              {ITEM}
            </TableHead>
            {[1, 2, 3, 4].map((n) => (
              <TableHead key={n} sort="none">
                {ITEM}
              </TableHead>
            ))}
            <TableHead align="center" sticky="end" className="w-48">
              {ITEM}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }, (_, i) => (
            <TableRow key={i}>
              <TableCell type="checkbox" sticky="start">
                <Checkbox aria-label={`Seleccionar fila ${i + 1}`} />
              </TableCell>
              <TableCell sticky="start" stickyOffset="3rem">
                <ProfileItem />
              </TableCell>
              {[1, 2, 3, 4].map((n) => (
                <TableCell key={n}>
                  <TableText description={DESC}>{ITEM}</TableText>
                </TableCell>
              ))}
              <TableCell align="center" sticky="end">
                <FullActions edit={false} chevron={false} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <span className={label}>Type=Empty state</span>
      <Table label="Tabla vacía de ejemplo" layout="table" data-figma="Type=Empty state">
        <TableHeader>
          <TableRow>
            <TableHead type="checkbox">
              <Checkbox aria-label="Seleccionar todas las filas" disabled />
            </TableHead>
            <TableHead className="w-66" sort="none">
              {ITEM}
            </TableHead>
            {[1, 2, 3, 4].map((n) => (
              <TableHead key={n} sort="none">
                {ITEM}
              </TableHead>
            ))}
            <TableHead align="center">{ITEM}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableEmpty colSpan={7}>
            <EmptyState type="first-use" title="Title" description={DESC} data-figma-part="Empty states" />
          </TableEmpty>
        </TableBody>
      </Table>
    </div>
  ),
};

/**
 * Set `Header table (Atom)` (13544:69540): Type × State × Radius. Radius sale de la posición en la fila
 * (On en la primera casilla y en la última columna), así que cada fila de State lleva las cuatro combinaciones.
 */
export const FigmaMatrixHeader: Story = {
  render: () => (
    <div className="flex flex-col gap-ds-space-general-2xl bg-ds-background-general-black p-6">
      {ROW_STATES.map((s) => (
        <div key={s.figma} className="flex flex-col gap-ds-space-general-lg">
          <span className={label}>State={s.figma}</span>
          <Table label={`Encabezados ${s.figma}`} layout="table">
            <TableHeader>
              <TableRow state={s.state}>
                <TableHead type="checkbox" data-figma={`Type=Checkbox, State=${s.figma}, Radius=On`}>
                  <Checkbox aria-label={`Casilla ${s.figma} 1`} data-figma-part="Selection" />
                </TableHead>
                <TableHead type="checkbox" data-figma={`Type=Checkbox, State=${s.figma}, Radius=Off`}>
                  <Checkbox aria-label={`Casilla ${s.figma} 2`} data-figma-part="Selection" />
                </TableHead>
                <TableHead sort="none" data-figma={`Type=Text, State=${s.figma}, Radius=Off`}>
                  {ITEM}
                </TableHead>
                <TableHead sort="none" data-figma={`Type=Text, State=${s.figma}, Radius=On`}>
                  {ITEM}
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
      ))}
    </div>
  ),
};

/** Set `Cell table (Atom)` (13544:69578): State × Radius (Left = primera celda, Right = última). */
export const FigmaMatrixCell: Story = {
  render: () => (
    <div className="flex flex-col gap-ds-space-general-2xl bg-ds-background-general-black p-6">
      {ROW_STATES.map((s) => (
        <div key={s.figma} className="flex flex-col gap-ds-space-general-lg">
          <span className={label}>State={s.figma}</span>
          <Table label={`Celdas ${s.figma}`} layout="table">
            <TableBody>
              <TableRow state={s.state}>
                {(['Left', 'None', 'Right'] as const).map((r) => (
                  <TableCell key={r} data-figma={`State=${s.figma}, Radius=${r}`}>
                    <ProfileItem />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  ),
};

/** Contenido de cada Type de `Item table (Atom)` / `Item table`. */
function itemContent(type: string, atom: boolean): ReactNode {
  switch (type) {
    case 'Profile':
      return <ProfileItem />;
    case 'Text':
      return <TableText description={DESC}>{ITEM}</TableText>;
    case 'Highlighted text':
      return <TableHighlightedText>{ITEM}</TableHighlightedText>;
    case 'Link':
      return (
        <ButtonLink href="#tabla" data-figma-part="Button link">
          Button
        </ButtonLink>
      );
    case 'Text+badge':
      return (
        <TableBadgeText description={DESC} badgeLabel="Activo">
          {ITEM}
        </TableBadgeText>
      );
    case 'Progress bar':
      return <ProgressBar value={0} label="Avance" className="flex-1" data-figma-part="Progress bar" />;
    case 'Tag':
      return (
        <Tag iconLeft={false} data-figma-part="Tag">
          Text
        </Tag>
      );
    case 'Checkbox':
      return <Checkbox aria-label="Seleccionar" data-figma-part="Selection" />;
    case 'Toggle':
      return <Switch aria-label="Activar" />;
    case 'Raiting':
    case 'Raiting (Only stars)':
      return <StarRating value={0} data-figma-part="Star rating" />;
    case 'Raiting (Number+star)':
      return <NumberRating value={4.5} data-figma-part="Number rating" />;
    case 'Button':
      return atom ? <FullActions /> : <FullActions chevron={false} start />;
    default:
      return null;
  }
}

/**
 * `atom`: el átomo actual (casilla con 4 a cada lado y Tag sin el alto fijo de 40); sin él, el set anterior
 * `Item table` (casilla sin padding).
 */
function ItemMatrix({ types, atom = false }: { types: string[]; atom?: boolean }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,26rem)] items-center gap-x-8 gap-y-4 bg-ds-background-table-default p-6">
      {types.map((t) => (
        <div key={t} className="contents">
          <span className={label}>{t}</span>
          <TableItem
            checkbox={atom && t === 'Checkbox'}
            className={cn(t === 'Checkbox' && 'w-fit', atom && t === 'Tag' && 'min-h-0')}
            data-figma={`Type=${t}`}
          >
            {itemContent(t, atom)}
          </TableItem>
        </div>
      ))}
    </div>
  );
}

const ITEM_TYPES = ['Profile', 'Text', 'Highlighted text', 'Link', 'Text+badge', 'Progress bar', 'Tag', 'Checkbox', 'Toggle', 'Raiting', 'Button'];
const ITEM_ATOM_TYPES = [
  'Profile',
  'Text',
  'Highlighted text',
  'Link',
  'Text+badge',
  'Progress bar',
  'Tag',
  'Checkbox',
  'Toggle',
  'Raiting (Only stars)',
  'Raiting (Number+star)',
  'Button',
];

/**
 * Set `Item table (Atom)` (13544:69501): contenido de celda por Type, sobre background/table/default. Los Type que ya
 * son componentes de CAOS (Link, Tag, Progress bar, Checkbox, Toggle, Raiting, Button) se usan tal cual.
 */
export const FigmaMatrixItemAtom: Story = { render: () => <ItemMatrix types={ITEM_ATOM_TYPES} atom /> };

/** Set `Item table` (13059:16129): la versión anterior del átomo, mismo contenido (Raiting = solo estrellas). */
export const FigmaMatrixItem: Story = { render: () => <ItemMatrix types={ITEM_TYPES} /> };

/** Set `Dropdown table (Atom)` (13544:69601): State (Default, Select) × Up (Off = cerrada, On = abierta). */
export const FigmaMatrixDropdown: Story = {
  render: () => (
    <div className="flex flex-col gap-ds-space-general-2xl bg-ds-background-general-black p-6">
      {(['Default', 'Select'] as const).map((s) =>
        (['Off', 'On'] as const).map((up) => (
          <TableDisclosure
            key={`${s}-${up}`}
            selected={s === 'Select'}
            defaultExpanded={up === 'On'}
            data-figma={`State=${s}, Up=${up}`}
          />
        ))
      )}
    </div>
  ),
};

/** Set `Row mobile (Atom)` (13544:69614): State Default y Select, con un cuarto campo detrás de la fila desplegable. */
export const FigmaMatrixRowMobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => (
    <div className="bg-ds-background-general-black p-4">
      <TableMobileList aria-label="Filas de ejemplo">
        {(['Default', 'Select'] as const).map((s) => (
          <TableMobileRow
            key={s}
            state={s === 'Select' ? 'select' : 'default'}
            onSelectedChange={() => {}}
            selectionLabel={`Seleccionar fila ${s}`}
            tag={
              <Tag size="sm" iconLeft={false} data-figma-part="Tag">
                Text
              </Tag>
            }
            actions={<Dots size="xs" />}
            visibleFields={3}
            data-figma={`State=${s}`}
          >
            <TableMobileField label={ITEM}>
              <ProfileItem />
            </TableMobileField>
            <TableMobileField label={ITEM}>
              <TableText description={DESC}>{ITEM}</TableText>
            </TableMobileField>
            <TableMobileField label={ITEM}>
              <TableText description={DESC}>{ITEM}</TableText>
            </TableMobileField>
            <TableMobileField label={ITEM}>
              <TableText description={DESC}>{ITEM}</TableText>
            </TableMobileField>
          </TableMobileRow>
        ))}
      </TableMobileList>
    </div>
  ),
};

/**
 * Set `Card tabla` (20231:8418): Property 1 = Default (cerrada) y Variant2 (abierta). Textos neutros en lugar de los
 * del archivo de Figma.
 */
export const FigmaMatrixRowCard: Story = {
  render: () => (
    <div className="flex flex-col gap-ds-space-general-4xl bg-ds-background-general-black p-6">
      <TableRowCard summary={<RowCardSummary />} data-figma="Property 1=Default" className="w-256">
        <RowCardDetail title="Grupo 1" status="Pendiente" statusType="alert" />
      </TableRowCard>
      <TableRowCard
        defaultExpanded
        summary={<RowCardSummary />}
        footer={<Button variant="tertiary" size="sm">Ver más</Button>}
        data-figma="Property 1=Variant2"
        className="w-256"
      >
        <RowCardDetail title="Grupo 1" status="Pendiente" statusType="alert" />
        <RowCardDetail title="Grupo 2" status="Recibido" statusType="info" />
      </TableRowCard>
    </div>
  ),
};
