import { forwardRef, useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { PaginationLabels, PaginationProps } from './Pagination.types';
import { paginationListClass, paginationTextClass, paginationVariants } from './Pagination.variants';
import { getPaginationItems } from './Pagination.utils';
import { PaginationPage } from './PaginationPage';
import { Button } from '../Button';
import { DigitInput } from '../DigitInput';
import { Icon } from '../Icon';
import { useIsMobile } from '../../utils/useMediaQuery';
import { cn } from '../../utils/cn';

const DEFAULT_LABELS: Required<PaginationLabels> = {
  navigation: 'Paginación',
  previous: 'Anterior',
  next: 'Siguiente',
  page: (page) => `Página ${page}`,
  status: (page, total) => `Página ${page} de ${total}`,
  loadMore: 'Mostrar más',
  pageWord: 'Página',
  ofTotal: (total) => `de ${total}`,
  input: 'Número de página',
  outOfRange: (total) => `Escribe un número entre 1 y ${total}`,
};

const clamp = (value: number, total: number) => Math.min(Math.max(Math.trunc(value) || 1, 1), total);

/**
 * Paginación (WAI-ARIA: `<nav>` con lista, `aria-current="page"` en la actual). Tres Types:
 * `numeric` (botones de página), `input` (campo numérico: valida el rango y confirma con Enter)
 * y `more` (botón "Mostrar más", que avanza una página por clic).
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      type = 'numeric',
      page: pageProp,
      defaultPage = 1,
      totalPages: totalProp,
      onPageChange,
      siblingCount = 2,
      boundaryCount = 0,
      labels,
      className,
      ...restProps
    },
    ref
  ) => {
    const totalPages = Math.max(Math.trunc(totalProp) || 1, 1);
    const [inner, setInner] = useState(defaultPage);
    const page = clamp(pageProp ?? inner, totalPages);
    const text = { ...DEFAULT_LABELS, ...labels };
    const isMobile = useIsMobile();

    const goTo = (target: number) => {
      const next = clamp(target, totalPages);
      if (pageProp === undefined) setInner(next);
      if (next !== page) onPageChange?.(next);
    };

    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    const previous = (
      <Button
        variant="secondary"
        size="xs"
        iconOnly
        aria-label={text.previous}
        disabled={isFirst}
        onClick={() => goTo(page - 1)}
        data-figma-part="Button"
      >
        <Icon name="chevron-left" variant="fill" size={16} data-figma-part="Icon-sizes" />
      </Button>
    );
    const nextButton = (
      <Button
        variant="secondary"
        size="xs"
        iconOnly
        aria-label={text.next}
        disabled={isLast}
        onClick={() => goTo(page + 1)}
        data-figma-part="Button"
      >
        <Icon name="chevron-right" variant="fill" size={16} data-figma-part="Icon-sizes" />
      </Button>
    );

    return (
      <nav
        {...restProps}
        ref={ref}
        aria-label={restProps['aria-label'] ?? text.navigation}
        className={cn(paginationVariants({ type }), className)}
      >
        {type === 'numeric' && (
          <>
            <p aria-live="polite" className={cn(paginationTextClass, 'm-0 w-full')} data-figma-part="Página">
              {text.status(page, totalPages)}
            </p>
            <ul className={paginationListClass} data-figma-part="Pages">
              <li>{previous}</li>
              {getPaginationItems(page, totalPages, siblingCount, boundaryCount).map((item) =>
                typeof item === 'number' ? (
                  <li key={item}>
                    <PaginationPage
                      number={item}
                      selected={item === page}
                      aria-label={text.page(item)}
                      onClick={() => goTo(item)}
                      data-figma-part="Page (Atom)"
                    />
                  </li>
                ) : (
                  <li key={item} aria-hidden="true" className={cn(paginationTextClass, 'inline-flex size-8 items-center justify-center')}>
                    …
                  </li>
                )
              )}
              <li>{nextButton}</li>
            </ul>
          </>
        )}

        {type === 'input' && (
          <>
            <PageField page={page} totalPages={totalPages} text={text} onCommit={goTo} />
            <ul className={paginationListClass} data-figma-part="buttons">
              <li>{previous}</li>
              <li>{nextButton}</li>
            </ul>
          </>
        )}

        {type === 'more' && (
          <>
            <p aria-live="polite" className={cn(paginationTextClass, 'm-0 w-full')} data-figma-part="Página">
              {text.status(page, totalPages)}
            </p>
            <Button
              variant="primary"
              size="md"
              disabled={isLast}
              onClick={() => goTo(page + 1)}
              fullWidth={isMobile}
              data-figma-part="Button"
            >
              {text.loadMore}
            </Button>
          </>
        )}
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

/** Type input: "Página [campo] de y". Enter confirma si está en rango; fuera de rango marca error y avisa. */
function PageField({
  page,
  totalPages,
  text,
  onCommit,
}: {
  page: number;
  totalPages: number;
  text: Required<PaginationLabels>;
  onCommit: (page: number) => void;
}) {
  const [draft, setDraft] = useState(String(page));
  const [invalid, setInvalid] = useState(false);
  const messageId = useId();

  // Si la página cambia (botones o controlada), el campo la sigue
  const [seenPage, setSeenPage] = useState(page);
  if (seenPage !== page) {
    setSeenPage(page);
    setDraft(String(page));
    setInvalid(false);
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const value = Number(draft);
    if (draft !== '' && Number.isInteger(value) && value >= 1 && value <= totalPages) {
      setInvalid(false);
      onCommit(value);
    } else {
      setInvalid(true);
    }
  };

  // Al salir sin confirmar, el campo vuelve a la página actual
  const onBlur = () => {
    setDraft(String(page));
    setInvalid(false);
  };

  return (
    <>
      <span className={paginationTextClass} aria-hidden="true" data-figma-part="Página">
        {text.pageWord}
      </span>
      <DigitInput
        size="32"
        value={draft}
        maxLength={String(totalPages).length}
        invalid={invalid}
        aria-label={text.input}
        aria-describedby={invalid ? messageId : undefined}
        placeholder={String(page)}
        onChange={(event) => {
          setDraft(event.target.value);
          setInvalid(false);
        }}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        data-figma-part="Input number (Atom)"
      />
      <span className={paginationTextClass} aria-hidden="true" data-figma-part="de 20">
        {text.ofTotal(totalPages)}
      </span>
      <span id={messageId} role="status" className="sr-only">
        {invalid ? text.outOfRange(totalPages) : text.status(page, totalPages)}
      </span>
    </>
  );
}
