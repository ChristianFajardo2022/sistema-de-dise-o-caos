import { memo, useCallback, useDeferredValue, useId, useMemo, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, ReactNode } from 'react';
import { Icon } from '../../components/Icon';
import { ICON_SIZES, defaultIconVariant } from '../../components/Icon/Icon.types';
import type { IconName, IconSize, IconVariant } from '../../components/Icon/Icon.types';
import { Input } from '../../components/Input';
import { caosIconCategories, caosIcons } from '../../icons/caos/registry.generated';
import { cn } from '../../utils/cn';
import { DocHeading } from '../_doc';

const ALL = 'todas';
const DEFAULT_SIZE: IconSize = 24;

/** "Support- Like- Question" → "Support, Like, Question" (los nombres de categoría vienen de Figma) */
const categoryLabel = (c: string) => c.replace(/-\s*/g, ', ');

interface Entry {
  name: IconName;
  category: string;
}

/** Los 404 íconos agrupados por categoría, calculado una sola vez */
const ENTRIES: Entry[] = (Object.keys(caosIcons) as IconName[]).map((name) => ({ name, category: caosIconCategories[name] }));
const CATEGORIES = Array.from(new Set(ENTRIES.map((e) => e.category)));

/** Código que se copia al activar un ícono; añade size y variant solo si la vista previa se aparta de los valores por defecto del componente */
function snippet(name: IconName, size: IconSize, variant: IconVariant): string {
  const extra = `${size === DEFAULT_SIZE ? '' : ` size={${size}}`}${variant === defaultIconVariant(size) ? '' : ` variant="${variant}"`}`;
  return `<Icon name="${name}"${extra} />`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Dentro de un iframe sin permiso de portapapeles: se usa el método antiguo
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-ds-text-neutral-heading';

/** Celda del catálogo. Memoizada: al escribir en el buscador solo se vuelven a pintar las que cambian */
const IconCell = memo(function IconCell({
  name,
  size,
  variant,
  tabStop,
  onCopy,
}: {
  name: IconName;
  size: IconSize;
  variant: IconVariant;
  /** Roving tabindex: solo la celda activa entra en el orden de Tab; las demás se alcanzan con las flechas */
  tabStop: boolean;
  onCopy: (name: IconName) => void;
}) {
  return (
    <li className="flex">
      <button
        type="button"
        data-icon={name}
        tabIndex={tabStop ? 0 : -1}
        onClick={() => onCopy(name)}
        // El nombre accesible empieza con el texto visible (2.5.3); el código que se copia queda en el tooltip
        aria-label={`${name}, copiar código`}
        title={`Copiar ${snippet(name, size, variant)}`}
        className={cn(
          'flex min-h-28 w-full cursor-pointer flex-col items-center justify-between gap-ds-space-general-lg rounded-ds-radius-general-xl border border-ds-border-general-gray-fifth bg-ds-background-container-default-on-card p-ds-space-general-lg text-ds-text-neutral-heading',
          'hover:bg-ds-background-container-hover-on-card',
          focusRing,
        )}
      >
        <span className="flex h-14 items-center justify-center">
          <Icon name={name} size={size} variant={variant} />
        </span>
        <span aria-hidden="true" className="w-full text-center text-ds-primitives-typography-size-sm leading-tight break-words text-ds-text-neutral-body">
          {name}
        </span>
      </button>
    </li>
  );
});

function Segmented<T extends string | number>({
  legend,
  value,
  options,
  onChange,
  className,
}: {
  className?: string;
  legend: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className={cn('m-0 flex min-w-0 flex-col gap-ds-space-general-md border-0 p-0', className)}>
      <legend className="mb-ds-space-general-md p-0 text-ds-primitives-typography-size-md font-medium text-ds-text-neutral-heading">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-ds-space-general-md">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={o.value === value}
            onClick={() => onChange(o.value)}
            className={cn(
              'min-h-10 min-w-10 cursor-pointer rounded-full border px-ds-space-general-xl text-ds-primitives-typography-size-md',
              o.value === value
                ? 'border-ds-text-neutral-heading bg-ds-text-neutral-heading text-ds-background-container-surface'
                : 'border-ds-border-general-gray-fifth bg-transparent text-ds-text-neutral-heading hover:bg-ds-background-container-hover-on-canva',
              focusRing,
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

interface CatalogoIconosProps {
  /** Pantalla completa: añade título propio y ocupa toda la altura (historia enlazable) */
  fullscreen?: boolean;
}

/**
 * Catálogo navegable de los íconos CAOS: buscador, categoría, línea/relleno y tamaño de vista previa.
 * Activar un ícono copia su código `<Icon name="…" />` y lo anuncia con aria-live.
 */
export function CatalogoIconos({ fullscreen = false }: CatalogoIconosProps): ReactNode {
  const selectId = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);
  const [variant, setVariant] = useState<IconVariant>('line');
  const [size, setSize] = useState<IconSize>(DEFAULT_SIZE);
  const [status, setStatus] = useState('');
  const [activeIcon, setActiveIcon] = useState<IconName | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // El filtrado usa un valor diferido: escribir no se bloquea aunque la grilla tarde en repintarse
  const deferredQuery = useDeferredValue(query);
  const groups = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return CATEGORIES.filter((c) => category === ALL || c === category)
      .map((c) => ({ category: c, items: ENTRIES.filter((e) => e.category === c && (!q || e.name.includes(q))) }))
      .filter((g) => g.items.length > 0);
  }, [deferredQuery, category]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  // Una sola parada de Tab en toda la grilla: la celda activa si sigue visible con el filtro, o la primera
  const firstIcon = groups[0]?.items[0]?.name;
  const tabStopIcon = groups.some((g) => g.items.some((e) => e.name === activeIcon)) ? activeIcon : firstIcon;

  const onCopy = useCallback(
    async (name: IconName) => {
      const code = snippet(name, size, variant);
      const ok = await copyText(code);
      setStatus(ok ? `Copiado: ${code}` : 'No se pudo copiar');
      clearTimeout(clearTimer.current);
      clearTimer.current = setTimeout(() => setStatus(''), 2500);
    },
    [size, variant],
  );

  /** Foco al entrar en una celda (con Tab, clic o flechas): pasa a ser la parada de Tab */
  const onGridFocus = useCallback((e: FocusEvent<HTMLDivElement>) => {
    const name = (e.target as HTMLElement).dataset.icon as IconName | undefined;
    if (name) setActiveIcon(name);
  }, []);

  /** Flechas izquierda/derecha recorren en orden; arriba/abajo buscan la celda más cercana en la fila contigua; Inicio/Fin saltan a los extremos */
  const onGridKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (!keys.includes(e.key) || e.altKey || e.ctrlKey || e.metaKey) return;
    const cells = Array.from(gridRef.current?.querySelectorAll<HTMLButtonElement>('button[data-icon]') ?? []);
    const index = cells.indexOf(e.target as HTMLButtonElement);
    if (index < 0) return;
    let next = index;
    if (e.key === 'ArrowRight') next = Math.min(index + 1, cells.length - 1);
    else if (e.key === 'ArrowLeft') next = Math.max(index - 1, 0);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = cells.length - 1;
    else {
      const from = cells[index].getBoundingClientRect();
      const down = e.key === 'ArrowDown';
      // Candidatas: celdas en filas por debajo (o por encima); se elige la fila más cercana y, dentro de ella, la más próxima en horizontal
      const rows = cells
        .map((c, i) => ({ i, r: c.getBoundingClientRect() }))
        .filter(({ r }) => (down ? r.top > from.top + 1 : r.top < from.top - 1));
      if (rows.length) {
        const rowTop = down ? Math.min(...rows.map(({ r }) => r.top)) : Math.max(...rows.map(({ r }) => r.top));
        const row = rows.filter(({ r }) => Math.abs(r.top - rowTop) < 1);
        next = row.reduce((best, c) => (Math.abs(c.r.left - from.left) < Math.abs(best.r.left - from.left) ? c : best)).i;
      }
    }
    e.preventDefault();
    cells[next].focus();
    cells[next].scrollIntoView({ block: 'nearest' });
  }, []);

  // Bajo el h1 de la historia a pantalla completa los grupos son h2; dentro de la página, h3 bajo el h2 de la sección
  const Root = fullscreen ? 'main' : 'div';
  return (
    <Root
      className={cn(
        'flex flex-col gap-ds-space-general-4xl',
        fullscreen &&
          'min-h-dvh bg-ds-background-container-surface px-ds-space-general-2xl py-ds-primitives-space-5xl font-ds-primitives-typography-family-primary text-ds-text-neutral-body tablet:px-ds-primitives-space-5xl',
      )}
    >
      {fullscreen && (
        <header className="flex flex-col gap-ds-space-general-md">
          <h1 className="m-0 font-ds-primitives-typography-family-secundary text-ds-primitives-typography-size-4xl leading-tight font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
            Catálogo de íconos
          </h1>
          <p className="m-0 text-ds-primitives-typography-size-lg leading-normal">
            Busca un ícono, ajusta la vista previa y actívalo para copiar su código.
          </p>
        </header>
      )}

      <div
        role="search"
        aria-label="Filtros del catálogo"
        className="grid grid-cols-1 items-start gap-ds-space-general-4xl rounded-ds-radius-container-on-canva border border-ds-border-general-gray-fifth bg-ds-background-container-default-on-card p-ds-space-general-4xl tablet:grid-cols-2"
      >
        <Input
          variant="search"
          label="Buscar ícono"
          placeholder="Ej. calendar"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-col gap-ds-space-general-md">
          <label htmlFor={selectId} className="text-ds-primitives-typography-size-md font-medium text-ds-text-neutral-heading">
            Categoría
          </label>
          <select
            id={selectId}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={cn(
              'min-h-10 w-full cursor-pointer rounded-ds-radius-general-xl border border-ds-border-general-gray-fifth bg-ds-background-container-surface px-ds-space-general-xl text-ds-primitives-typography-size-md text-ds-text-neutral-heading',
              focusRing,
            )}
          >
            <option value={ALL}>Todas ({ENTRIES.length})</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)} ({ENTRIES.filter((e) => e.category === c).length})
              </option>
            ))}
          </select>
        </div>
        <Segmented
          legend="Variante"
          value={variant}
          onChange={setVariant}
          options={[
            { value: 'line', label: 'Línea' },
            { value: 'fill', label: 'Relleno' },
          ]}
        />
        <Segmented
          className="tablet:col-span-2"
          legend="Tamaño de vista previa (px)"
          value={size}
          onChange={setSize}
          options={ICON_SIZES.map((s) => ({ value: s, label: String(s) }))}
        />
      </div>

      <p role="status" className="m-0 text-ds-primitives-typography-size-md text-ds-text-neutral-body">
        {total === ENTRIES.length ? `${total} íconos` : `${total} de ${ENTRIES.length} íconos`}
      </p>
      {/* Región aria-live: anuncia "Copiado" al activar un ícono (siempre presente para que los lectores la registren) */}
      <p aria-live="polite" className="sr-only">
        {status}
      </p>
      {status && (
        <p
          aria-hidden="true"
          className="fixed right-ds-space-general-4xl bottom-ds-space-general-4xl z-50 m-0 rounded-ds-radius-general-xl bg-ds-text-neutral-heading px-ds-space-general-4xl py-ds-space-general-xl text-ds-primitives-typography-size-md text-ds-background-container-surface shadow-ds-on-canva"
        >
          {status}
        </p>
      )}

      {total === 0 ? (
        <p className="m-0 text-ds-primitives-typography-size-lg">Ningún ícono coincide con la búsqueda.</p>
      ) : (
        <div ref={gridRef} onFocus={onGridFocus} onKeyDown={onGridKeyDown} className="flex flex-col gap-ds-space-general-4xl">
          {groups.map((g) => (
          <section key={g.category} aria-labelledby={`${selectId}-${g.category}`} className="flex flex-col gap-ds-space-general-2xl">
            <DocHeading
              id={`${selectId}-${g.category}`}
              level={fullscreen ? 'h2' : 'h3'}
              size="sm"
              className="border-b border-ds-border-general-gray-fifth pb-ds-space-general-lg"
            >
              {categoryLabel(g.category)} <span className="font-normal text-ds-text-neutral-gray">· {g.items.length}</span>
            </DocHeading>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-ds-space-general-lg p-0">
              {g.items.map((e) => (
                <IconCell key={e.name} name={e.name} size={size} variant={variant} tabStop={e.name === tabStopIcon} onCopy={onCopy} />
              ))}
            </ul>
          </section>
          ))}
        </div>
      )}
    </Root>
  );
}
