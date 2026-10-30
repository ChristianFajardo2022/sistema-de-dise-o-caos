/**
 * Menú lateral de CAOS para Storybook (Figma: Menu Library dev 22202:85840; segundo nivel: List Item Dropdown 22685:15174).
 * Riel de íconos (Buscar, Fundamentos, Componentes, tema y contraer) y panel con la lista de la pestaña activa.
 * Se monta fuera del árbol de Storybook y lee su estado con la API del administrador.
 */
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { API } from 'storybook/manager-api';
import { buildTree, search } from './tree';
import type { Branch, Leaf, SearchHit } from './tree';
import {
  IconChevronDown16,
  IconChevronDown20,
  IconChevronRight,
  IconColorSwatch,
  IconLogo,
  IconMainComponent,
  IconMoon,
  IconSearch,
  IconSun,
} from './icons';

type Tab = 'search' | 'foundations' | 'components';
type Mode = 'dark' | 'light';

/** Anchos de Figma: riel 63, panel 298. */
export const RAIL_WIDTH = 63;
export const PANEL_WIDTH = 298;

const STORE_KEY = 'caos-sidebar';

function readStore(): { tab?: Tab; collapsed?: boolean } {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function writeStore(value: { tab: Tab; collapsed: boolean }) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {
    // Sin almacenamiento (ventana privada): el menú funciona igual, solo no recuerda la pestaña
  }
}

interface Snapshot {
  storyId?: string;
  index?: Parameters<typeof buildTree>[0];
  navShown: boolean;
  navSize?: number;
  mode: Mode;
}

/** Ancho actual de la navegación: Storybook lo publica como --nav-width en el contenedor del layout. */
function readNavWidth(): number | undefined {
  const layout = document.querySelector<HTMLElement>('#root > div');
  const value = layout ? parseFloat(layout.style.getPropertyValue('--nav-width')) : NaN;
  return Number.isNaN(value) ? undefined : value;
}

function readSnapshot(api: API): Snapshot {
  return {
    storyId: api.getUrlState()?.storyId,
    index: api.getIndex()?.entries as Snapshot['index'],
    navShown: api.getIsNavShown(),
    navSize: readNavWidth(),
    mode: api.getGlobals()?.['theme'] === 'light' ? 'light' : 'dark',
  };
}

/** El estado del administrador no avisa fuera de su árbol de React: se lee cada 200 ms y solo se actualiza si cambió. */
function useManagerSnapshot(api: API): Snapshot {
  const [snap, setSnap] = useState(() => readSnapshot(api));
  useEffect(() => {
    const tick = () =>
      setSnap((prev) => {
        const next = readSnapshot(api);
        const same =
          prev.storyId === next.storyId &&
          prev.index === next.index &&
          prev.navShown === next.navShown &&
          prev.navSize === next.navSize &&
          prev.mode === next.mode;
        return same ? prev : next;
      });
    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [api]);
  return snap;
}

const leafHref = (leaf: Leaf) => `./?path=/${leaf.type === 'docs' ? 'docs' : 'story'}/${leaf.id}`;

interface LinkProps {
  leaf: Leaf;
  active: boolean;
  onSelect: (id: string) => void;
}

/** List Item simple: una página o historia. */
function LeafLink({ leaf, active, onSelect }: LinkProps) {
  return (
    <a
      className="caos-sb-item"
      data-state={active ? 'select' : undefined}
      href={leafHref(leaf)}
      aria-current={active ? 'page' : undefined}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onSelect(leaf.id);
      }}
    >
      <span className="caos-sb-item-text">{leaf.name}</span>
    </a>
  );
}

/** Hamburguer menu atom (With text / Dropdown Select): primer nivel, abre su lista debajo. */
function TopItem({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const listId = useId();
  return (
    <li className="caos-sb-top">
      <button
        type="button"
        className="caos-sb-top-btn"
        data-state={open ? 'select' : undefined}
        aria-expanded={open}
        aria-controls={listId}
        onClick={onToggle}
      >
        <span className="caos-sb-top-text">{label}</span>
        <IconChevronDown20 className="caos-sb-top-chevron" />
      </button>
      {open && (
        <ul id={listId} className="caos-sb-sub">
          {children}
        </ul>
      )}
    </li>
  );
}

/** List Item Dropdown: resultado de búsqueda (fundamento o componente) con sus páginas o historias. */
function BranchItem({
  branch,
  leaves,
  open,
  activeId,
  onToggle,
  onSelect,
}: {
  branch: Branch;
  leaves: Leaf[];
  open: boolean;
  activeId?: string;
  onToggle: () => void;
  onSelect: (id: string) => void;
}) {
  const listId = useId();
  return (
    <li>
      <button
        type="button"
        className="caos-sb-item"
        data-state={open ? 'select' : undefined}
        aria-expanded={open}
        aria-controls={listId}
        onClick={onToggle}
      >
        <span className="caos-sb-item-text">{branch.label}</span>
        <IconChevronDown16 className="caos-sb-item-chevron" />
      </button>
      {open && (
        <ul id={listId} className="caos-sb-leaves">
          {leaves.map((leaf) => (
            <li key={leaf.id}>
              <LeafLink leaf={leaf} active={leaf.id === activeId} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

interface Props {
  api: API;
  /** Tema del administrador (marco de Storybook) para cada modo. */
  onModeChange: (mode: Mode) => void;
}

export function CaosSidebar({ api, onModeChange }: Props) {
  const snap = useManagerSnapshot(api);
  const tree = useMemo(() => buildTree(snap.index), [snap.index]);
  const [stored] = useState(readStore);
  const [tab, setTab] = useState<Tab>(stored.tab ?? 'components');
  const [collapsed, setCollapsed] = useState(stored.collapsed ?? false);
  const [openTop, setOpenTop] = useState<{ foundations: string | null; components: string | null }>({
    foundations: null,
    components: null,
  });
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => writeStore({ tab, collapsed }), [tab, collapsed]);

  // El ancho de la navegación de Storybook sigue al menú (riel solo o riel + panel)
  const navSize = collapsed ? RAIL_WIDTH : RAIL_WIDTH + PANEL_WIDTH;
  useEffect(() => {
    if (snap.navShown && snap.navSize !== navSize) api.setSizes({ navSize });
  }, [api, navSize, snap.navShown, snap.navSize]);

  useEffect(() => onModeChange(snap.mode), [onModeChange, snap.mode]);

  // Abre la ruta de la historia actual al cambiar de historia
  const activePath = snap.storyId ? tree.byLeaf.get(snap.storyId) : undefined;
  useEffect(() => {
    if (!activePath) return;
    setOpenTop((o) => ({ ...o, [activePath.tab]: activePath.branch.key }));
    // Solo al cambiar de historia: después el usuario puede cerrar la ruta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snap.storyId, tree]);

  useEffect(() => {
    const current = scrollRef.current?.querySelector('[aria-current="page"]');
    current?.scrollIntoView({ block: 'nearest' });
  }, [snap.storyId, tab, collapsed]);

  const openSearch = useCallback(() => {
    setTab('search');
    setCollapsed(false);
    requestAnimationFrame(() => searchRef.current?.focus());
  }, []);

  // ⌘K / Ctrl+K y "/" abren la búsqueda (el buscador de Storybook queda oculto)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [openSearch]);

  const selectStory = useCallback((id: string) => api.selectStory(id), [api]);

  const onRail = (next: Tab) => {
    if (collapsed) {
      setCollapsed(false);
      setTab(next);
    } else if (next === tab) {
      setCollapsed(true);
    } else {
      setTab(next);
    }
    if (next === 'search') requestAnimationFrame(() => searchRef.current?.focus());
  };

  const toggleMode = () => api.updateGlobals({ theme: snap.mode === 'dark' ? 'light' : 'dark' });

  const results = useMemo(() => search(tree, query), [tree, query]);

  if (!snap.navShown) return null;

  const railButton = (id: Tab, label: string, icon: React.ReactNode) => {
    const selected = !collapsed && tab === id;
    return (
      <button
        type="button"
        className="caos-sb-rail-btn"
        data-state={selected ? 'select' : undefined}
        aria-pressed={selected}
        aria-controls={panelId}
        aria-label={label}
        title={label}
        onClick={() => onRail(id)}
      >
        {icon}
      </button>
    );
  };

  const renderHits = (hits: SearchHit[]) =>
    hits.map((hit) => {
      const open = searchOpen[hit.branch.key] ?? hit.leafMatch;
      return (
        <BranchItem
          key={hit.branch.key}
          branch={hit.branch}
          leaves={hit.leaves}
          open={open}
          activeId={snap.storyId}
          onToggle={() => setSearchOpen((s) => ({ ...s, [hit.branch.key]: !open }))}
          onSelect={selectStory}
        />
      );
    });

  return (
    <nav className="caos-sb" data-theme={snap.mode} aria-label="CAOS · Sistema de diseño" style={{ width: navSize }}>
      <div className="caos-sb-rail">
        <a className="caos-sb-logo" href="./" aria-label="CAOS, inicio">
          <IconLogo />
        </a>
        <div className="caos-sb-rail-tabs">
          {railButton('search', 'Buscar', <IconSearch />)}
          {railButton('foundations', 'Fundamentos', <IconColorSwatch />)}
          {railButton('components', 'Componentes', <IconMainComponent />)}
        </div>
        <div className="caos-sb-rail-actions">
          <button
            type="button"
            className="caos-sb-round"
            aria-label={snap.mode === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            title={snap.mode === 'dark' ? 'Tema claro' : 'Tema oscuro'}
            onClick={toggleMode}
          >
            {snap.mode === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
          <button
            type="button"
            className="caos-sb-round"
            data-collapsed={collapsed}
            aria-expanded={!collapsed}
            aria-controls={panelId}
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
            title={collapsed ? 'Expandir menú' : 'Contraer menú'}
            onClick={() => setCollapsed((c) => !c)}
          >
            <IconChevronRight />
          </button>
        </div>
      </div>

      <div className="caos-sb-panel" id={panelId} hidden={collapsed}>
        <div className="caos-sb-scroll" ref={scrollRef}>
          <p className="caos-sb-caption">CAOS By Inter Rapidísimo</p>

          {tab === 'search' && (
            <div className="caos-sb-search">
              <label className="caos-sb-field">
                <IconSearch />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  placeholder="Buscar fundamentos y componentes"
                  aria-label="Buscar fundamentos y componentes"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchOpen({});
                  }}
                />
              </label>
              {!query.trim() && <p className="caos-sb-hint">Escribe un nombre: un fundamento, un componente o una historia.</p>}
              {!!query.trim() && !results.foundations.length && !results.components.length && (
                <p className="caos-sb-hint" role="status">
                  Sin resultados para «{query.trim()}».
                </p>
              )}
              {!!results.foundations.length && (
                <section aria-label="Fundamentos">
                  <p className="caos-sb-caption">Fundamentos ({results.foundations.length})</p>
                  <ul className="caos-sb-sub caos-sb-sub--flush">{renderHits(results.foundations)}</ul>
                </section>
              )}
              {!!results.components.length && (
                <section aria-label="Componentes">
                  <p className="caos-sb-caption">Componentes ({results.components.length})</p>
                  <ul className="caos-sb-sub caos-sb-sub--flush">{renderHits(results.components)}</ul>
                </section>
              )}
            </div>
          )}

          {tab === 'foundations' && (
            <ul className="caos-sb-list">
              {tree.foundations.map((f) => (
                <TopItem
                  key={f.key}
                  label={f.label}
                  open={openTop.foundations === f.key}
                  onToggle={() => setOpenTop((o) => ({ ...o, foundations: o.foundations === f.key ? null : f.key }))}
                >
                  {f.leaves.map((leaf) => (
                    <li key={leaf.id}>
                      <LeafLink leaf={leaf} active={leaf.id === snap.storyId} onSelect={selectStory} />
                    </li>
                  ))}
                </TopItem>
              ))}
            </ul>
          )}

          {/* Una sola lista de componentes, sin categorías: componente → historias, como los fundamentos */}
          {tab === 'components' && (
            <ul className="caos-sb-list">
              {tree.components.map((b) => (
                <TopItem
                  key={b.key}
                  label={b.label}
                  open={openTop.components === b.key}
                  onToggle={() => setOpenTop((o) => ({ ...o, components: o.components === b.key ? null : b.key }))}
                >
                  {b.leaves.map((leaf) => (
                    <li key={leaf.id}>
                      <LeafLink leaf={leaf} active={leaf.id === snap.storyId} onSelect={selectStory} />
                    </li>
                  ))}
                </TopItem>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
