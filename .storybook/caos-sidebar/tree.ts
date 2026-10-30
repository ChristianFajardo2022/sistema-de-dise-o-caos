/**
 * Convierte el índice de Storybook en las dos listas del menú:
 * Fundamentos (fundamento → páginas) y Componentes (componente → historias, en una sola lista alfabética).
 * Las categorías de los títulos (General Controls, Layout…) no se muestran: solo agrupan en el código.
 */

export const FOUNDATIONS_ROOT = 'Fundamentos de diseño';

export interface Leaf {
  id: string;
  name: string;
  type: 'docs' | 'story';
}

/** Fundamento o componente: agrupa sus páginas o historias. */
export interface Branch {
  key: string;
  label: string;
  leaves: Leaf[];
}

export interface Tree {
  foundations: Branch[];
  /** Todos los componentes, sin categoría, en orden alfabético. */
  components: Branch[];
  /** Hoja → rama, para marcar y abrir la ruta de la historia actual. */
  byLeaf: Map<string, { branch: Branch; tab: 'foundations' | 'components' }>;
}

interface IndexEntry {
  id: string;
  type: 'docs' | 'story';
  title: string;
  name: string;
}

/** El administrador traduce "Docs" en pantalla; aquí se nombra igual para que la búsqueda lo encuentre. */
const leafName = (e: IndexEntry) => (e.type === 'docs' && e.name === 'Docs' ? 'Documentación' : e.name);

/**
 * Entradas del índice ya ordenadas por storySort. El título "Raíz/Grupo/Componente" da la categoría (primer segmento)
 * y la rama (el resto, unido con ›). Los componentes se ordenan por nombre; las historias de cada uno, como storySort.
 */
export function buildTree(entries: Record<string, IndexEntry> | undefined): Tree {
  const tree: Tree = { foundations: [], components: [], byLeaf: new Map() };
  if (!entries) return tree;
  const branches = new Map<string, Branch>();
  for (const e of Object.values(entries)) {
    if (e.type !== 'docs' && e.type !== 'story') continue;
    const [root, ...rest] = e.title.split('/');
    const label = rest.length ? rest.join(' › ') : root;
    let branch = branches.get(e.title);
    if (!branch) {
      branch = { key: e.title, label, leaves: [] };
      branches.set(e.title, branch);
      (root === FOUNDATIONS_ROOT ? tree.foundations : tree.components).push(branch);
    }
    branch.leaves.push({ id: e.id, name: leafName(e), type: e.type });
    tree.byLeaf.set(e.id, { branch, tab: root === FOUNDATIONS_ROOT ? 'foundations' : 'components' });
  }
  tree.components.sort((a, b) => a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }));
  return tree;
}

/** Minúsculas y sin tildes, para buscar "tipografia" o "boton". */
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export interface SearchHit {
  branch: Branch;
  /** Hojas que coinciden; si coincide la rama completa, todas. */
  leaves: Leaf[];
  /** true si solo coinciden hojas: se muestran abiertas. */
  leafMatch: boolean;
}

export function search(tree: Tree, query: string): { foundations: SearchHit[]; components: SearchHit[] } {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  const empty = { foundations: [], components: [] };
  if (!terms.length) return empty;
  const matches = (text: string) => terms.every((t) => normalize(text).includes(t));
  const hit = (b: Branch): SearchHit | null => {
    if (matches(b.label)) return { branch: b, leaves: b.leaves, leafMatch: false };
    const leaves = b.leaves.filter((l) => matches(`${b.label} ${l.name}`));
    return leaves.length ? { branch: b, leaves, leafMatch: true } : null;
  };
  return {
    foundations: tree.foundations.map(hit).filter((h): h is SearchHit => !!h),
    components: tree.components.map(hit).filter((h): h is SearchHit => !!h),
  };
}
