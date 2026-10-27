import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { SearchInputSection } from './SearchInput.types';
import {
  searchInputChipOptionClass,
  searchInputKeywordVariants,
  searchInputPanelClass,
  searchInputPanelDividerClass,
  searchInputSectionTitleClass,
} from './SearchInput.variants';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Tag } from '../Tag';
import { cn } from '../../utils/cn';

/** Opción ya normalizada, con su id y su posición en el recorrido con flechas. */
export interface SearchInputFlatOption {
  id: string;
  value: string;
  label: string;
  section: SearchInputSection;
  index: number;
}

export interface SearchInputPanelSection {
  section: SearchInputSection;
  /** id del listbox de la sección. */
  listId: string;
  /** id del título (nombra el listbox de chips). */
  titleId: string;
  title?: string;
  /** Nombre del listbox de palabras clave (no tiene título visible). */
  listLabel?: string;
  options: SearchInputFlatOption[];
  clear?: { label: string; onClear: () => void };
}

interface SearchInputPanelProps {
  sections: SearchInputPanelSection[];
  activeIndex: number;
  onChoose: (option: SearchInputFlatOption) => void;
  /** Se pulsa una papelera: recibe el `onClear` de la sección. */
  onClear: (clear: () => void) => void;
  className?: string;
}

/** Ícono del chip por sección (Figma: lupa en recientes, etiqueta en populares). */
const CHIP_ICON = { recent: 'search', popular: 'tag' } as const;

/**
 * Panel de sugerencias (el "Dropdown" de Active/Focus). Interno de SearchInput: no se exporta.
 * Cada sección es un `listbox` con sus `option`; el foco nunca entra en las opciones (las recorre el combobox con
 * `aria-activedescendant`). Los botones de papelera sí son enfocables (Tab desde el campo).
 */
export function SearchInputPanel({ sections, activeIndex, onChoose, onClear, className }: SearchInputPanelProps) {
  const option = (opt: SearchInputFlatOption, children: ReactNode, optionClass: string, figmaPart: string) => (
    <div
      key={opt.id}
      id={opt.id}
      role="option"
      aria-selected={opt.index === activeIndex}
      data-figma-part={figmaPart}
      onClick={() => onChoose(opt)}
      className={optionClass}
    >
      {children}
    </div>
  );

  return (
    <div
      data-figma-part="Dropdown"
      // El foco se queda en el campo al pulsar opciones o el fondo del panel
      onMouseDown={(event) => event.preventDefault()}
      className={cn(searchInputPanelClass, className)}
    >
      {sections.map((s, i) => (
        <Fragment key={s.section}>
          {i > 0 && <div aria-hidden="true" data-figma-part="Line 10" className={searchInputPanelDividerClass} />}
          {s.section === 'keywords' ? (
            <div id={s.listId} role="listbox" aria-label={s.listLabel} className="flex min-w-0 flex-col gap-ds-space-general-lg">
              {s.options.map((opt) =>
                option(opt, opt.label, searchInputKeywordVariants({ active: opt.index === activeIndex }), 'Palabra clave')
              )}
            </div>
          ) : (
            <div className="flex min-w-0 flex-col gap-ds-space-general-2xl">
              <div className="flex min-h-8 items-center justify-between gap-ds-space-general-2xl">
                <span id={s.titleId} data-figma-part={s.title} className={searchInputSectionTitleClass}>
                  {s.title}
                </span>
                {s.clear && (
                  <Button
                    variant="tertiary"
                    size="xs"
                    state="delete"
                    iconOnly
                    aria-label={s.clear.label}
                    data-figma-part="Button"
                    onClick={() => s.clear && onClear(s.clear.onClear)}
                  >
                    <Icon name="trash" size={20} variant="fill" data-figma-part="Icon-sizes" />
                  </Button>
                )}
              </div>
              <div id={s.listId} role="listbox" aria-labelledby={s.titleId} className="flex min-w-0 flex-wrap gap-ds-space-general-lg">
                {s.options.map((opt) =>
                  option(
                    opt,
                    <Tag
                      type="neutral"
                      size="md"
                      icon={CHIP_ICON[s.section as 'recent' | 'popular']}
                      state={opt.index === activeIndex ? 'focus' : 'default'}
                    >
                      <span data-figma-part="Text">{opt.label}</span>
                    </Tag>,
                    searchInputChipOptionClass,
                    'Tag'
                  )
                )}
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
