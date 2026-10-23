import { forwardRef } from 'react';
import { useMemo } from 'react';
import { DropdownMenuContext, useDropdownMenu } from './DropdownMenu.context';
import type { DropdownMenuPanelProps } from './DropdownMenu.types';
import {
  dropdownMenuPanelVariants,
  dropdownMenuScrollVariants,
  dropdownMenuSimpleGap,
  dropdownMenuSearchClass,
} from './DropdownMenu.variants';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { ScrollArea } from '../ScrollArea';
import { cn } from '../../utils/cn';

/**
 * Panel visual del set "Dropdown" de Figma (11673:7804): superficie con radio 16 y sombra, campo de búsqueda opcional
 * y área de ítems con riel de scroll. No abre ni cierra nada: para eso, `DropdownMenu`.
 * Sirve también en línea (documentación, medición contra Figma).
 * Con `listProps` el área de ítems puede cambiar de rol (p. ej. `role="listbox"` con opciones propias, como Select).
 */
export const DropdownMenuPanel = forwardRef<HTMLDivElement, DropdownMenuPanelProps>(
  (
    {
      type = 'simple',
      mode = 'menu',
      scrollbar = true,
      maxHeight = '20rem',
      'aria-label': ariaLabel,
      searchLabel = 'Buscar',
      searchValue,
      onSearchChange,
      listProps,
      children,
      className,
      ...restProps
    },
    ref
  ) => {
    const isList = mode === 'list';
    // `close` viene del DropdownMenu que lo envuelve; un panel suelto no cierra nada
    const { close } = useDropdownMenu();
    const context = useMemo(() => ({ mode, close }), [mode, close]);
    const scrollClass = dropdownMenuScrollVariants({ type, scrollbar, list: isList });
    const searchProps = searchValue === undefined ? {} : { value: searchValue };

    return (
      <DropdownMenuContext.Provider value={context}>
        <div {...restProps} ref={ref} className={cn(dropdownMenuPanelVariants({ type }), className)}>
          {type === 'search' && (
            <Input
              variant="search"
              label={searchLabel}
              fullWidth
              leftIcon={<Icon name="search" size={16} variant="line" aria-hidden="true" data-figma-part="Icon Search" />}
              data-figma-part="Input"
              {...searchProps}
              onChange={(event) => onSearchChange?.(event.target.value)}
              className={dropdownMenuSearchClass}
            />
          )}
          {isList ? (
            <ScrollArea aria-label={ariaLabel} maxHeight={maxHeight} className={scrollClass}>
              <ul aria-label={ariaLabel} className={cn('m-0 flex list-none flex-col p-0', type === 'search' ? 'gap-ds-space-field-sm' : dropdownMenuSimpleGap)}>
                {children}
              </ul>
            </ScrollArea>
          ) : (
            <ScrollArea
              role="menu"
              tabIndex={-1}
              aria-label={ariaLabel}
              maxHeight={maxHeight}
              data-figma-part="Check List"
              {...listProps}
              className={cn(scrollClass, listProps?.className)}
            >
              {children}
            </ScrollArea>
          )}
        </div>
      </DropdownMenuContext.Provider>
    );
  }
);

DropdownMenuPanel.displayName = 'DropdownMenuPanel';
