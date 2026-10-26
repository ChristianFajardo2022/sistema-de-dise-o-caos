import { Fragment, forwardRef, useId, useMemo } from 'react';
import type { CheckboxTreeNode, CheckboxTreeProps } from './CheckboxTree.types';
import {
  checkboxTreeChildrenClass,
  checkboxTreeGroupClass,
  checkboxTreeRowClass,
  checkboxTreeVariants,
} from './CheckboxTree.variants';
import { nodeState, toggleNode } from './CheckboxTree.utils';
import { Checkbox } from '../Checkbox';
import { useControllableState } from '../../utils/controllableState';
import { cn } from '../../utils/cn';

const EMPTY: string[] = [];

/** Id estable de un nodo dentro del árbol (el `value` puede tener caracteres no válidos en un id). */
const nodeId = (base: string, value: string) => `${base}-${encodeURIComponent(value).replace(/%/g, '_')}`;

/**
 * Árbol de selección ("Selection tree" de Figma): casillas anidadas donde la madre refleja a sus hijas
 * (marcada, desmarcada o mixta).
 *
 * Patrón WAI-ARIA APG "Checkbox (Mixed-State)": cada fila es un `<input type="checkbox">` nativo; la madre usa la
 * propiedad `indeterminate` (los lectores anuncian "mixto") y `aria-controls` con sus hijas, y cada rama es un
 * `role="group"` nombrado por la madre. Se eligió este patrón y no APG Tree View porque Figma muestra todas las
 * ramas abiertas y sin control de expandir: un `role="tree"` obligaría a flechas y foco itinerante sin ganar nada.
 * Teclado: Tab recorre las casillas, Espacio alterna; alternar la madre marca o desmarca toda su rama.
 */
export const CheckboxTree = forwardRef<HTMLDivElement, CheckboxTreeProps>(
  (
    {
      items,
      value,
      defaultValue,
      onValueChange,
      contrast = 'positive',
      disabled = false,
      name,
      className,
      ...restProps
    },
    ref
  ) => {
    const baseId = useId();
    const [selectedList, setSelected] = useControllableState(value, defaultValue ?? EMPTY, onValueChange, 'CheckboxTree');
    const selected = useMemo(() => new Set(selectedList), [selectedList]);

    const renderNode = (node: CheckboxTreeNode, parentDisabled: boolean) => {
      const isDisabled = parentDisabled || Boolean(node.disabled);
      const state = nodeState(node, selected);
      const id = nodeId(baseId, node.value);
      const isGroup = Boolean(node.children?.length);
      const mixed = state === 'mixed';

      const checkbox = (
        <div className="flex" data-figma-part="Selection">
          <Checkbox
            id={id}
            contrast={contrast}
            disabled={isDisabled}
            checked={state === true}
            name={isGroup ? undefined : name}
            value={isGroup ? undefined : node.value}
            aria-controls={isGroup ? node.children!.map((c) => nodeId(baseId, c.value)).join(' ') : undefined}
            indeterminate={mixed}
            onChange={() => setSelected(toggleNode(items, node, selected, parentDisabled))}
            className={checkboxTreeRowClass}
          >
            <span id={`${id}-label`} data-figma-part="Text description">
              {node.label}
            </span>
          </Checkbox>
        </div>
      );

      if (!isGroup) return <Fragment key={node.value}>{checkbox}</Fragment>;

      return (
        <div key={node.value} className={checkboxTreeGroupClass} data-figma-part="Group ">
          {checkbox}
          <div role="group" aria-labelledby={`${id}-label`} className={checkboxTreeChildrenClass}>
            {node.children!.map((child) => renderNode(child, isDisabled))}
          </div>
        </div>
      );
    };

    return (
      <div
        role="group"
        {...restProps}
        ref={ref}
        className={cn(checkboxTreeVariants(), className)}
      >
        {items.map((node) => renderNode(node, disabled))}
      </div>
    );
  }
);

CheckboxTree.displayName = 'CheckboxTree';
