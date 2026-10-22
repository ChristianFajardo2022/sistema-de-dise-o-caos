import { useId } from 'react';
import type { ReactNode } from 'react';
import { CloseCircleIcon } from '../../icons/CloseCircleIcon';
import { TickCircleIcon } from '../../icons/TickCircleIcon';
import { cn } from '../../utils/cn';
import { ScrollRegion } from './ScrollRegion';

/** Texto de párrafo (16 px, color de cuerpo). Admite `<strong>` para negritas. */
export function DocText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'm-0 max-w-[75ch] text-ds-primitives-typography-size-lg leading-normal text-ds-text-neutral-body text-pretty',
        '[&_strong]:font-semibold [&_strong]:text-ds-text-neutral-heading',
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Lista con viñetas. Cada hijo es un `<li>` (usa `DocList items={[...]}`). */
export function DocList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul
      className={cn(
        'm-0 flex list-disc flex-col gap-ds-space-general-md pl-ds-space-general-4xl',
        'text-ds-primitives-typography-size-lg leading-normal text-ds-text-neutral-body marker:text-ds-text-neutral-gray',
        '[&_strong]:font-semibold [&_strong]:text-ds-text-neutral-heading',
        className,
      )}
    >
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

interface DocHeadingProps {
  /** Nivel de encabezado; respeta el orden de la página (h3 bajo el h2 de la sección) */
  level?: 'h2' | 'h3' | 'h4';
  /** `md` 24 px (subtítulos de sección) · `sm` 20 px (subtítulos dentro de figuras y tarjetas) */
  size?: 'md' | 'sm';
  id?: string;
  children: ReactNode;
  className?: string;
}

/** Encabezado de subapartado con la tipografía de la documentación (familia secundaria, semibold). */
export function DocHeading({ level: Level = 'h3', size = 'md', id, children, className }: DocHeadingProps) {
  return (
    <Level
      id={id}
      className={cn(
        'm-0 font-ds-primitives-typography-family-secundary leading-tight font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading',
        size === 'md' ? 'text-ds-primitives-typography-size-2xl tablet:text-ds-primitives-typography-size-3xl' : 'text-ds-primitives-typography-size-xl',
        className,
      )}
    >
      {children}
    </Level>
  );
}

interface DocSubsectionProps {
  title: string;
  children?: ReactNode;
  /** Tamaño del encabezado (`md` por defecto) */
  size?: 'md' | 'sm';
  level?: 'h3' | 'h4';
  /** Ancla para `DocToc` */
  id?: string;
}

/** Subtítulo h3 (24 px; `size="sm"` 20 px) con su contenido debajo; agrupa texto, listas y figuras de un subapartado. */
export function DocSubsection({ title, children, size = 'md', level = 'h3', id }: DocSubsectionProps) {
  return (
    <div id={id} className={cn('flex scroll-mt-ds-space-general-4xl flex-col', size === 'md' ? 'gap-ds-space-general-2xl' : 'gap-ds-space-general-lg')}>
      <DocHeading level={level} size={size}>
        {title}
      </DocHeading>
      {children}
    </div>
  );
}

/** Sección de la página: título h2 (32 px) y contenido en columna. Úsala una vez por tema grande. `id` crea el ancla para `DocToc`. */
export function DocSection({ title, children, id: anchor }: { title: string; children: ReactNode; id?: string }) {
  const headingId = useId();
  const id = headingId;
  return (
    <section id={anchor} aria-labelledby={id} className="flex scroll-mt-ds-space-general-4xl flex-col gap-ds-space-general-4xl">
      <h2
        id={id}
        className="m-0 font-ds-primitives-typography-family-secundary text-ds-primitives-typography-size-3xl leading-tight font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading text-balance tablet:text-ds-primitives-typography-size-4xl"
      >
        {title}
      </h2>
      <div className="flex flex-col gap-ds-space-general-4xl">{children}</div>
    </section>
  );
}

interface DocFigureBaseProps {
  /** Pie de figura, opcional */
  caption?: ReactNode;
  /** Clases extra para el área de contenido (modo `children`) */
  className?: string;
}

/** Con `image`, el texto alternativo es obligatorio; con `children` no hay imagen */
type DocFigureProps = DocFigureBaseProps &
  (
    | {
        /** Contenido propio (especímenes y diagramas hechos con tokens). Alternativa a `image`. */
        children?: ReactNode;
        image?: undefined;
        alt?: undefined;
      }
    | {
        children?: undefined;
        /** Imagen exportada de Figma (ya trae su fondo) */
        image: string;
        /** Texto alternativo útil de la imagen (describe lo que enseña, no "imagen de…") */
        alt: string;
      }
  );

/**
 * Figura: caja gris con padding grande y radio de tokens (las "cajas grises" de Figma).
 * Con `image` muestra el PNG a todo el ancho; las imágenes vienen en modo claro y se aceptan así en dark.
 */
export function DocFigure({ children, image, alt, caption, className }: DocFigureProps) {
  return (
    <figure className="m-0 flex flex-col gap-ds-space-general-lg">
      <div
        className={cn(
          'overflow-hidden rounded-ds-radius-container-on-canva border border-ds-border-general-gray-fifth bg-ds-background-container-default-on-card',
          !image && 'p-ds-space-general-4xl tablet:p-ds-primitives-space-6xl',
          className,
        )}
      >
        {image ? <img src={image} alt={alt} className="block h-auto w-full" /> : children}
      </div>
      {caption && (
        <figcaption className="text-ds-primitives-typography-size-md leading-normal text-ds-text-neutral-body">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Nombre de token en "chip" (fuente en cursiva sobre fondo suave), como en las tablas de Figma. */
export function TokenChip({ children }: { children: ReactNode }) {
  return (
    <code className="inline-block rounded-ds-radius-general-md bg-ds-background-tab-select-on-canva px-ds-space-general-lg py-ds-space-general-md font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-md font-medium whitespace-nowrap text-ds-text-neutral-heading italic">
      {children}
    </code>
  );
}

interface TokenTableProps {
  /** Nombre de la tabla (caption) y de su región con scroll cuando la tabla desborda */
  caption: string;
  /** Cabeceras de columna */
  columns: string[];
  /** Filas: una lista de celdas por fila. La primera celda es la cabecera de fila (usa `TokenChip` para tokens). */
  rows: ReactNode[][];
  /** Ancho mínimo antes de que la tabla haga scroll propio (default 640) */
  minWidth?: number;
}

/** Tabla de valores de token. Hace scroll horizontal propio en pantallas angostas. */
export function TokenTable({ caption, columns, rows, minWidth = 640 }: TokenTableProps) {
  const th = 'whitespace-nowrap px-ds-space-general-4xl py-ds-space-general-2xl text-left font-semibold text-ds-text-neutral-heading';
  return (
    <ScrollRegion
      label={caption}
      className="rounded-ds-radius-container-on-canva border border-ds-border-general-gray-fifth bg-ds-background-container-default-on-card"
    >
      <table
        className="w-full border-collapse text-ds-primitives-typography-size-md leading-normal text-ds-text-neutral-body"
        style={{ minWidth }}
      >
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-ds-border-general-gray-fifth">
            {columns.map((c) => (
              <th key={c} scope="col" className={th}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, r) => (
            <tr key={r} className="border-b border-ds-border-general-gray-fifth last:border-b-0">
              {cells.map((cell, c) =>
                c === 0 ? (
                  <th key={c} scope="row" className="px-ds-space-general-4xl py-ds-space-general-2xl text-left font-normal">
                    {cell}
                  </th>
                ) : (
                  <td key={c} className="px-ds-space-general-4xl py-ds-space-general-2xl">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}

interface DoDontProps {
  /** `do` = Correcto (verde), `dont` = Incorrecto (rojo) */
  variant: 'do' | 'dont';
  /** Ejemplo visual (mockup en código o imagen) */
  children: ReactNode;
  /** Explicación bajo el ejemplo (admite listas y negritas) */
  description?: ReactNode;
}

/** Par Correcto / Incorrecto: se usan dos (uno de cada variante) en una grilla de dos columnas. */
export function DoDont({ variant, children, description }: DoDontProps) {
  const isDo = variant === 'do';
  return (
    <figure
      className={cn(
        'm-0 flex flex-col gap-ds-space-general-4xl rounded-ds-radius-container-on-canva border p-ds-space-general-4xl',
        isDo
          ? 'border-ds-border-general-gray-fifth bg-ds-background-container-default-on-card'
          : 'border-ds-background-semantic-error-fourth bg-ds-background-graphic-error-secondary-opacity',
      )}
    >
      <span
        className={cn(
          'inline-flex w-fit items-center gap-ds-space-general-md rounded-full py-ds-space-general-md pr-ds-space-general-xl pl-ds-space-general-lg text-ds-primitives-typography-size-md font-medium',
          // Texto oscuro unicolor sobre el verde y blanco sobre el rojo: ambos pares superan 4.5:1 en los dos temas
          isDo
            ? 'bg-ds-background-semantic-success-fourth text-ds-text-neutral-black-unicolor'
            : 'bg-ds-background-semantic-error-fourth text-ds-primitives-color-primary-b01',
        )}
      >
        {isDo ? <TickCircleIcon width={16} height={16} /> : <CloseCircleIcon width={16} height={16} />}
        {isDo ? 'Correcto' : 'Incorrecto'}
      </span>
      <div>{children}</div>
      {description && (
        <figcaption className="flex flex-col gap-ds-space-general-md text-ds-primitives-typography-size-md leading-normal text-ds-text-neutral-body [&_strong]:font-semibold [&_strong]:text-ds-text-neutral-heading">
          {description}
        </figcaption>
      )}
    </figure>
  );
}

/** Grilla de dos columnas (una en móvil) para los pares de `DoDont`. */
export function DoDontGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 gap-ds-space-general-4xl tablet:grid-cols-2">{children}</div>;
}

interface DocNoteProps {
  /** Título breve en negrita, opcional */
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Nota para el lector (valor que aún no existe como token, aproximación en CSS, validación externa…).
 * No es un landmark: es un `role="note"` con estilo único para todas las páginas.
 */
export function DocNote({ title, children, className }: DocNoteProps) {
  return (
    <div
      role="note"
      className={cn(
        'flex flex-col gap-ds-space-general-md rounded-ds-radius-container-on-canva border border-ds-border-general-gray-fifth bg-ds-background-container-default-on-card p-ds-space-general-4xl text-ds-primitives-typography-size-md leading-normal text-ds-text-neutral-body',
        '[&_code]:font-medium [&_code]:text-ds-text-neutral-heading [&_strong]:font-semibold [&_strong]:text-ds-text-neutral-heading',
        className,
      )}
    >
      {title && <strong className="text-ds-primitives-typography-size-lg">{title}</strong>}
      {/* Envuelto: en flex-col, el texto suelto y un <code> en línea quedarían como bloques separados */}
      <div>{children}</div>
    </div>
  );
}

interface DocTocProps {
  /** Secciones con ancla: `id` es el que se pasa a `DocSection` */
  items: { id: string; label: string }[];
  title?: string;
}

/** "Contenido de la página": lista de enlaces a las secciones con ancla de la pestaña. */
export function DocToc({ items, title = 'Contenido de la página' }: DocTocProps) {
  return (
    <DocSection title={title}>
      <DocList
        items={items.map((item) => (
          <a key={item.id} href={`#${item.id}`} className="text-ds-text-neutral-heading underline underline-offset-4">
            {item.label}
          </a>
        ))}
      />
    </DocSection>
  );
}

/** Enlace a un sitio externo: abre en pestaña nueva con aviso para lectores de pantalla (como ButtonLink) y `rel` seguro. */
export function DocExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="underline" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </a>
  );
}
