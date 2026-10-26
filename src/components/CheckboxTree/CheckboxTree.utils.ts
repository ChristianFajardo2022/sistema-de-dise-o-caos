import type { CheckboxTreeCheckedState, CheckboxTreeNode } from './CheckboxTree.types';

/** Hojas habilitadas bajo un nodo (incluido él si es hoja). Un grupo deshabilitado deshabilita su rama. */
export function enabledLeaves(node: CheckboxTreeNode, parentDisabled = false): string[] {
  const disabled = parentDisabled || Boolean(node.disabled);
  if (!node.children?.length) return disabled ? [] : [node.value];
  return node.children.flatMap((child) => enabledLeaves(child, disabled));
}

/** Todas las hojas (habilitadas o no) bajo un nodo, en orden del árbol. */
export function allLeaves(node: CheckboxTreeNode): string[] {
  if (!node.children?.length) return [node.value];
  return node.children.flatMap(allLeaves);
}

/** Estado de un nodo según las hojas marcadas: true (todas), false (ninguna) o 'mixed'. */
export function nodeState(node: CheckboxTreeNode, selected: ReadonlySet<string>): CheckboxTreeCheckedState {
  const leaves = allLeaves(node);
  const on = leaves.filter((v) => selected.has(v)).length;
  if (on === 0) return false;
  return on === leaves.length ? true : 'mixed';
}

/**
 * Alterna un nodo. Hoja: entra o sale. Grupo: si todas sus hojas habilitadas están marcadas, las desmarca;
 * si no, las marca todas (patrón APG "Checkbox (Mixed-State)"). Las hojas deshabilitadas no cambian.
 * Devuelve las hojas marcadas en el orden del árbol.
 */
export function toggleNode(
  items: CheckboxTreeNode[],
  node: CheckboxTreeNode,
  selected: ReadonlySet<string>,
  parentDisabled = false
): string[] {
  const target = enabledLeaves(node, parentDisabled);
  const next = new Set(selected);
  const allOn = target.length > 0 && target.every((v) => next.has(v));
  target.forEach((v) => (allOn ? next.delete(v) : next.add(v)));
  return items.flatMap(allLeaves).filter((v) => next.has(v));
}
