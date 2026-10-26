import { describe, expect, it } from 'vitest';
import { enabledLeaves, nodeState, toggleNode } from './CheckboxTree.utils';
import type { CheckboxTreeNode } from './CheckboxTree.types';

const items: CheckboxTreeNode[] = [
  { value: 'a', label: 'A', children: [{ value: 'a1', label: 'A1' }, { value: 'a2', label: 'A2' }, { value: 'a3', label: 'A3', disabled: true }] },
  { value: 'b', label: 'B', children: [{ value: 'b1', label: 'B1' }] },
];

describe('CheckboxTree utils', () => {
  it('deriva el estado del grupo', () => {
    expect(nodeState(items[0], new Set())).toBe(false);
    expect(nodeState(items[0], new Set(['a1']))).toBe('mixed');
    expect(nodeState(items[0], new Set(['a1', 'a2', 'a3']))).toBe(true);
  });

  it('ignora hojas deshabilitadas al alternar un grupo', () => {
    expect(enabledLeaves(items[0])).toEqual(['a1', 'a2']);
    expect(toggleNode(items, items[0], new Set())).toEqual(['a1', 'a2']);
    // Todas las habilitadas marcadas: el grupo las desmarca, la deshabilitada queda como estaba
    expect(toggleNode(items, items[0], new Set(['a1', 'a2', 'a3']))).toEqual(['a3']);
  });

  it('desde mixto marca todo y conserva el orden del árbol', () => {
    expect(toggleNode(items, items[0], new Set(['b1', 'a2']))).toEqual(['a1', 'a2', 'b1']);
  });
});
