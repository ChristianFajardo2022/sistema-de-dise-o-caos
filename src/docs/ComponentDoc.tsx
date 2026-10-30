import type { ReactNode } from 'react';
import { CodeReference } from './CodeReference';
import { DocAnatomyV2, DocBreakpointsV2, DocFigmaV2, DocStatesV2, DocTokensV2 } from './DocV2';
import {
  DocAnatomy,
  DocCallout,
  DocContentCard,
  DocGallery,
  DocGrid,
  DocHeader,
  DocPractices,
  DocSection,
  DocTable,
  DocText,
  DocUsage,
} from './DocParts';
import type { ComponentDocContent, DocBlock, DocCodeReference, DocSectionContent } from './types';

/** Dibuja un bloque del esquema con su pieza. */
export function DocBlockView({ block }: { block: DocBlock }): ReactNode {
  switch (block.type) {
    case 'cards':
      return (
        <DocGrid columns={block.columns ?? 2}>
          {block.items.map((item) => (
            <DocContentCard key={item.title} {...item} />
          ))}
        </DocGrid>
      );
    case 'table':
      return <DocTable caption={block.caption} columns={block.columns} rows={block.rows} />;
    case 'usage':
      return <DocUsage use={block.use} avoid={block.avoid} />;
    case 'anatomy':
      if ('groups' in block) return <DocAnatomyV2 groups={block.groups} />;
      return <DocAnatomy title={block.title} preview={block.preview} parts={block.parts} />;
    case 'gallery':
      return <DocGallery title={block.title} columns={block.columns} align={block.align} items={block.items} />;
    case 'states':
      return <DocStatesV2 items={block.items} />;
    case 'tokens':
      return <DocTokensV2 groups={block.groups} />;
    case 'breakpoints':
      return <DocBreakpointsV2 desktop={block.desktop} mobile={block.mobile} tablet={block.tablet} />;
    case 'figma':
      return <DocFigmaV2 bullets={block.bullets} />;
    case 'note':
      return <DocCallout tone={block.tone}>{block.content}</DocCallout>;
    case 'practices':
      return <DocPractices items={block.items} />;
    case 'text':
      return <DocText>{block.content}</DocText>;
    case 'custom':
      return block.content;
  }
}

function Sections({ sections }: { sections: DocSectionContent[] }) {
  return sections.map((section) => (
    <DocSection key={section.title} title={section.title} description={section.description} titleInside={section.titleInside}>
      {section.blocks.map((block, b) => (
        <DocBlockView key={b} block={block} />
      ))}
    </DocSection>
  ));
}

interface ComponentDocProps {
  /** Contenido del componente (`<Nombre>.doc.tsx`). */
  doc: ComponentDocContent;
  /** Referencia de código. Sin ella esa parte no aparece. */
  code?: DocCodeReference;
  /** Lienzo interactivo y Controls de Storybook (solo en la página Docs). En Desarrollo reemplazan a la tabla de props. */
  interactive?: ReactNode;
}

/**
 * Página de documentación de un componente (plantilla "Documentación" de Figma): encabezado con ícono, nombre y
 * descripción, y debajo, seguidas, las secciones de Definición, las de Aplicación y la referencia de código ("Desarrollo"). Las
 * pestañas (chips) del encabezado de Figma no van por ahora y las secciones no llevan número.
 * La raíz es un `<main>`; ocupa todo el ancho disponible (hasta 1440).
 */
export function ComponentDoc({ doc, code, interactive }: ComponentDocProps) {
  return (
    <main className="sb-unstyled mx-auto min-h-dvh w-full max-w-[1440px] bg-ds-background-container-surface font-ds-primitives-typography-family-primary text-ds-text-neutral-body">
      <DocHeader icon={doc.icon} name={doc.name} summary={doc.summary} />
      <Sections sections={doc.definition} />
      <Sections sections={doc.application} />
      {code && <CodeReference {...code} interactive={interactive} />}
    </main>
  );
}
