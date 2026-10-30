import { forwardRef, useId, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { ReactNode } from 'react';
import type { FooterItem, FooterProps, FooterSection } from './Footer.types';
import {
  footerBottomClass,
  footerBrandClass,
  footerBulletBoxClass,
  footerBulletClass,
  footerColumnVariants,
  footerBadgesClass,
  footerContainerVariants,
  footerContentVariants,
  footerItemClass,
  footerLabelClass,
  footerLinkClass,
  footerListClass,
  footerRootVariants,
  footerRowClass,
  footerTitleClass,
} from './Footer.variants';
import { Accordion, AccordionItem } from '../Accordion';
import { cn } from '../../utils/cn';
import { useMergedRefs } from '../../utils/refs';
import { matchesMedia } from '../../utils/useMediaQuery';

/** Ancho del `<footer>` (no de la ventana) desde el que va la composición de escritorio; el mismo `@5xl` de las clases. */
const DESKTOP_REM = 64;

/**
 * `true` cuando el `<footer>` mide menos de 64rem: acordeón y acción móvil. Lo demás lo resuelven las container
 * queries de las clases; esto cubre lo que cambia el DOM. Antes de medir usa la ventana.
 */
function useCompact(ref: RefObject<HTMLElement | null>): boolean {
  const [compact, setCompact] = useState(() => matchesMedia(`(width < ${DESKTOP_REM}rem)`));
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      setCompact(el.getBoundingClientRect().width < DESKTOP_REM * rem);
    };
    check();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return compact;
}

/** En Figma el texto del copyright es una capa con su propio texto como nombre. */
const figmaName = (node: ReactNode) => (typeof node === 'string' ? node : undefined);

const has = (node: ReactNode) => node != null && node !== false && node !== '';

function ItemText({ item, children }: { item: FooterItem; children: ReactNode }) {
  if (!item.href) return <>{children}</>;
  return (
    <a {...item.linkProps} href={item.href} className={cn(footerLinkClass, item.linkProps?.className)}>
      {children}
    </a>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <span className={footerRowClass} data-figma-part="Content">
      <span aria-hidden="true" className={footerBulletBoxClass} data-figma-part="Icon">
        <span className={footerBulletClass} data-figma-part="Ellipse 1" />
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </span>
  );
}

function Item({ item }: { item: FooterItem }) {
  const { label, value } = item;
  if (has(label) && has(value)) {
    // Rótulo con viñeta; el valor va debajo (enlace si hay href)
    return (
      <li className={footerItemClass} data-figma-part="Info">
        <Row>
          <span className={footerLabelClass}>{label}</span>
        </Row>
        <span>
          <ItemText item={item}>{value}</ItemText>
        </span>
      </li>
    );
  }
  return (
    <li className={footerItemClass}>
      <Row>
        <ItemText item={item}>{has(label) ? label : value}</ItemText>
      </Row>
    </li>
  );
}

function ItemList({ items, className }: { items: FooterItem[]; className?: string }) {
  return (
    <ul className={cn(footerListClass, className)} data-figma-part="Container">
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </ul>
  );
}

/**
 * Footer: `<footer>` (landmark contentinfo). Los grupos van dentro de un único `<nav aria-label>`,
 * cada uno como `<div>` con encabezado y lista; así no hay cinco landmarks de navegación ni de región.
 * Con menos de 64rem de ancho del propio footer (no de la ventana) va la composición móvil de Figma: los grupos pasan a
 * un Accordion (APG: botón con aria-expanded), la acción usa `mobileAction` y los sellos van en su propia fila.
 */
export const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      type = 'portals',
      logo,
      aboutTitle,
      about,
      contact,
      sections = [],
      social = [],
      badges,
      action,
      mobileAction,
      copyright,
      legal,
      headingLevel = 2,
      navLabel = 'Enlaces del pie de página',
      socialLabel = 'Redes sociales',
      mobileAccordion = true,
      className,
      ...restProps
    },
    ref
  ) => {
    const baseId = useId();
    const footerRef = useRef<HTMLElement | null>(null);
    const mergedRef = useMergedRefs(footerRef, ref);
    const mobile = useCompact(footerRef);
    const Heading = `h${headingLevel}` as 'h2';
    const groups: FooterSection[] = [...(contact ? [contact] : []), ...sections];
    const web = type === 'web';
    const useAccordion = mobile && mobileAccordion;
    const actionNode = mobile && has(mobileAction) ? mobileAction : action;

    const socialList = social.length > 0 && (
      <ul className="m-0 flex list-none gap-ds-space-general-2xl p-0" aria-label={socialLabel} data-figma-part="Social">
        {social.map((s) => (
          <li key={s.name} className="m-0 flex p-0">
            <a
              {...s.linkProps}
              href={s.href}
              aria-label={s.name}
              className={cn('flex size-6 items-center justify-center', footerLinkClass, s.linkProps?.className)}
            >
              {s.icon}
            </a>
          </li>
        ))}
      </ul>
    );

    const brand = !web && (has(logo) || has(about) || socialList) && (
      <div className={footerBrandClass}>
        {has(logo) && (
          <div className="flex w-fit" data-figma-part="Logo ">
            {logo}
          </div>
        )}
        {has(about) && (
          <div className="flex flex-col gap-ds-space-general-2xl @max-5xl:gap-ds-space-general-xl" data-figma-part="Content">
            {has(aboutTitle) && <Heading className={footerTitleClass}>{aboutTitle}</Heading>}
            <p className="m-0">{about}</p>
          </div>
        )}
        {socialList}
      </div>
    );

    const columns = groups.map((group, i) => {
      const id = `${baseId}-g${i}`;
      return (
        <div key={i} className={footerColumnVariants({ type })} data-figma-part="Content">
          <Heading id={id} className={footerTitleClass}>
            {group.title}
          </Heading>
          <ItemList items={group.items} />
        </div>
      );
    });

    const links = groups.length > 0 && (
      <nav aria-label={navLabel} className="contents">
        {useAccordion ? (
          <Accordion type="single" headingLevel={headingLevel}>
            {groups.map((group, i) => (
              <AccordionItem key={i} value={`g${i}`} title={group.title} icon={false}>
                {/* El contenido del Accordion se alinea a la derecha (su botón de Figma va ahí): la lista ocupa todo el ancho */}
                <ItemList items={group.items} className="w-full self-stretch" />
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          columns
        )}
      </nav>
    );

    return (
      <footer {...restProps} ref={mergedRef} className={cn('@container', className)}>
        <div className={footerRootVariants()} data-figma-part="Desktop">
          <div className={footerContainerVariants()} data-figma-part="Container">
            <div className={footerContentVariants({ type })}>
              {brand}
              {links}
              {has(actionNode) && (
                <div className="shrink-0 @max-5xl:[&>*]:w-full" data-figma-part="Button">
                  {actionNode}
                </div>
              )}
            </div>
            {has(badges) && (
              <div className={footerBadgesClass} data-figma-part="Logos gov">
                {badges}
              </div>
            )}
          </div>

          <div
            className={cn(
              footerBottomClass,
              'items-center justify-between gap-ds-space-general-2xl @max-5xl:flex-col',
              // Mobile de Figma: Web centra logo y copyright; Portals centra copyright y nota legal a todo el ancho
              web ? '@max-5xl:items-center' : '@max-5xl:items-stretch'
            )}
            data-figma-part="Content"
          >
            {web ? (
              <>
                <div className="flex min-w-0 items-center gap-ds-space-general-lg" data-figma-part="Content">
                  {has(logo) && (
                    <span className="flex shrink-0" data-figma-part="Logo ">
                      {logo}
                    </span>
                  )}
                  {has(copyright) && (
                    <p className="m-0 min-w-0 [font-weight:var(--ds-primitives-typography-weight-regular)]" data-figma-part={figmaName(copyright)}>
                      {copyright}
                    </p>
                  )}
                </div>
                {socialList}
              </>
            ) : (
              <>
                {has(copyright) && (
                  <p
                    className="m-0 flex-1 [font-weight:var(--ds-primitives-typography-weight-regular)] @max-5xl:text-center"
                    data-figma-part={figmaName(copyright)}
                  >
                    {copyright}
                  </p>
                )}
                {has(legal) && <p className="m-0 flex-1 @max-5xl:text-center @5xl:text-right">{legal}</p>}
              </>
            )}
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';
