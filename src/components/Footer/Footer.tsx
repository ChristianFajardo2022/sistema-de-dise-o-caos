import { forwardRef, useId, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import type { FooterItem, FooterProps, FooterSection } from './Footer.types';
import {
  footerBottomClass,
  footerBrandClass,
  footerBulletBoxClass,
  footerBulletClass,
  footerColumnVariants,
  footerContainerVariants,
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

/** Móvil = menos de 48rem, el mismo corte de tokens.css (modo Mobile de Figma). */
const MOBILE_QUERY = '(max-width: 47.999rem)';
const subscribe = (onChange: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};
const useIsMobile = () =>
  useSyncExternalStore(
    subscribe,
    () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(MOBILE_QUERY).matches),
    () => false
  );

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

function ItemList({ items }: { items: FooterItem[] }) {
  return (
    <ul className={footerListClass} data-figma-part="Container">
      {items.map((item, i) => (
        <Item key={i} item={item} />
      ))}
    </ul>
  );
}

/**
 * Footer: `<footer>` (landmark contentinfo). Los grupos van dentro de un único `<nav aria-label>`,
 * cada uno como `<div>` con encabezado y lista; así no hay cinco landmarks de navegación ni de región.
 * En móvil los grupos pasan a un Accordion (APG: botón con aria-expanded).
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
    const mobile = useIsMobile();
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
          <div className="flex w-fit p-ds-space-general-lg" data-figma-part="Logo ">
            {logo}
          </div>
        )}
        {has(about) && (
          <div className="flex flex-col gap-ds-space-general-2xl max-md:gap-ds-space-general-xl" data-figma-part="Content">
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
                <ItemList items={group.items} />
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          columns
        )}
      </nav>
    );

    return (
      <footer {...restProps} ref={ref} className={className}>
        <div className={footerRootVariants()} data-figma-part="Desktop">
          <div className={footerContainerVariants({ type })} data-figma-part="Container">
            {brand}
            {links}
            {has(actionNode) && (
              <div className="shrink-0 max-md:[&>*]:w-full" data-figma-part="Button">
                {actionNode}
              </div>
            )}
            {has(badges) && (
              <div
                className="flex flex-wrap items-center gap-ds-primitives-space-5xl md:absolute md:right-0 md:bottom-0 md:flex-nowrap md:justify-center"
                data-figma-part="Logos gov"
              >
                {badges}
              </div>
            )}
          </div>

          <div
            className={cn(
              footerBottomClass,
              'items-center justify-between gap-ds-space-general-2xl max-md:flex-col',
              web ? 'max-md:items-center' : 'max-md:items-start'
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
                  {has(copyright) && <p className="m-0 min-w-0">{copyright}</p>}
                </div>
                {socialList}
              </>
            ) : (
              <>
                {has(copyright) && <p className="m-0 flex-1">{copyright}</p>}
                {has(legal) && <p className="m-0 flex-1 md:text-right">{legal}</p>}
              </>
            )}
          </div>
        </div>
      </footer>
    );
  }
);

Footer.displayName = 'Footer';
