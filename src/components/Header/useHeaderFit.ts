import { useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

const px = (value: string) => parseFloat(value) || 0;

/** Ancho mínimo de una fila flex: relleno, bordes, huecos y lo mínimo que acepta cada hijo en flujo. */
function minRowWidth(row: HTMLElement): number {
  const cs = getComputedStyle(row);
  const children = [...row.children].filter((child): child is HTMLElement => {
    if (!(child instanceof HTMLElement)) return false;
    const style = getComputedStyle(child);
    return style.display !== 'none' && style.position !== 'absolute' && style.position !== 'fixed';
  });
  const box = px(cs.paddingLeft) + px(cs.paddingRight) + px(cs.borderLeftWidth) + px(cs.borderRightWidth);
  const gaps = px(cs.columnGap) * Math.max(0, children.length - 1);
  return children.reduce((sum, child) => sum + minItemWidth(child), box + gaps);
}

/**
 * Lo mínimo que ocupa un hijo de la barra: su ancho si no encoge (logo, campana, avatar, acciones); la suma de sus
 * hijos si es otra fila flex que encoge (logo + navegación); su `min-width` (buscador); si no, su contenido completo
 * (`scrollWidth`, la navegación aunque esté apretada).
 */
function minItemWidth(el: HTMLElement): number {
  const cs = getComputedStyle(el);
  if (cs.flexShrink === '0') return el.getBoundingClientRect().width;
  if (cs.display.endsWith('flex') && cs.flexDirection.startsWith('row')) return minRowWidth(el);
  const min = px(cs.minWidth);
  return min > 0 ? min : el.scrollWidth;
}

/** Lo que necesita la barra de escritorio, medido para un contenido (`key`); 0 si aún no se midió. */
interface Required {
  key: string;
  width: number;
}

/** Si se ve la barra de escritorio, actualiza lo que necesita; ¿cabe en el ancho del `<header>`? */
function fitsDesktop(header: HTMLElement, required: Required): boolean {
  const bar = header.querySelector<HTMLElement>(':scope > [data-header-bar="desktop"]');
  if (bar) required.width = minRowWidth(bar);
  return header.getBoundingClientRect().width + 0.5 >= required.width;
}

/**
 * `layout="auto"`: decide la composición por el ancho del propio `<header>`, no por el de la ventana. Mientras se ve la
 * barra de escritorio mide lo mínimo que necesita (depende de cuántas secciones, acciones, campana y avatar haya); si el
 * `<header>` es más angosto pasa a la composición móvil y vuelve cuando hay sitio. Todo ocurre en efectos de diseño,
 * antes de pintar: no se ve la barra montada.
 *
 * @param contentKey cambia cuando cambia lo que va en la barra: se olvida la medida y se prueba de nuevo la de escritorio.
 */
export function useHeaderFit(headerRef: RefObject<HTMLElement | null>, enabled: boolean, contentKey: string): boolean {
  const [fits, setFits] = useState(true);
  const required = useRef<Required>({ key: contentKey, width: 0 });

  // Tras cada render, a propósito sin dependencias: lo que mide (anchos del DOM) cambia con cualquier render de la barra.
  // setFits con el mismo valor no vuelve a renderizar, así que no hay cadena de renders.
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (!enabled || !headerRef.current) return;
    if (required.current.key !== contentKey) required.current = { key: contentKey, width: 0 };
    // oxlint-disable-next-line react/set-state-in-effect -- medida del DOM antes de pintar
    setFits(fitsDesktop(headerRef.current, required.current));
  });

  // El <header> cambia de ancho (ventana, panel lateral, lienzo) o terminan de cargar las fuentes
  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!enabled || !header) return;
    const check = () => setFits(fitsDesktop(header, required.current));
    let alive = true;
    void document.fonts?.ready.then(() => alive && check());
    if (typeof ResizeObserver === 'undefined') return () => void (alive = false);
    const observer = new ResizeObserver(check);
    observer.observe(header);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [enabled, headerRef]);

  return !enabled || fits;
}
