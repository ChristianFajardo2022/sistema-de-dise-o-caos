/**
 * Convierte el índice de Storybook en las dos listas del menú:
 * Fundamentos (fundamento → páginas) y Componentes (categoría → componente → historias).
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
  /** Nombre de la categoría (raíz) a la que pertenece. */
  category: string;
  leaves: Leaf[];
}

export interface Category {
  key: string;
  label: string;
  branches: Branch[];
}

export interface Tree {
  foundations: Branch[];
  categories: Category[];
  /** Hoja → rama y categoría, para marcar y abrir la ruta de la historia actual. */
  byLeaf: Map<string, { branch: Branch; tab: 'foundations' | 'components'; categoryKey: string }>;
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
 * y la rama (el resto, unido con ›).
 */
export function buildTree(entries: Record<string, IndexEntry> | undefined): Tree {
  const tree: Tree = { foundations: [], categories: [], byLeaf: new Map() };
  if (!entries) return tree;
  const categories = new Map<string, Category>();
  const branches = new Map<string, Branch>();
  for (const e of Object.values(entries)) {
    if (e.type !== 'docs' && e.type !== 'story') continue;
    const [root, ...rest] = e.title.split('/');
    const label = rest.length ? rest.join(' › ') : root;
    let branch = branches.get(e.title);
    if (!branch) {
      branch = { key: e.title, label, category: root, leaves: [] };
      branches.set(e.title, branch);
      if (root === FOUNDATIONS_ROOT) {
        tree.foundations.push(branch);
      } else {
        let category = categories.get(root);
        if (!category) {
          category = { key: root, label: root, branches: [] };
          categories.set(root, category);
          tree.categories.push(category);
        }
        category.branches.push(branch);
      }
    }
    branch.leaves.push({ id: e.id, name: leafName(e), type: e.type });
    tree.byLeaf.set(e.id, {
      branch,
      tab: root === FOUNDATIONS_ROOT ? 'foundations' : 'components',
      categoryKey: root === FOUNDATIONS_ROOT ? branch.key : root,
    });
  }
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
    if (matches(`${b.category} ${b.label}`)) return { branch: b, leaves: b.leaves, leafMatch: false };
    const leaves = b.leaves.filter((l) => matches(`${b.category} ${b.label} ${l.name}`));
    return leaves.length ? { branch: b, leaves, leafMatch: true } : null;
  };
  return {
    foundations: tree.foundations.map(hit).filter((h): h is SearchHit => !!h),
    components: tree.categories.flatMap((c) => c.branches.map(hit)).filter((h): h is SearchHit => !!h),
  };
}
