import type { ReactNode } from 'react';
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs';
import { CodeReference } from './CodeReference';
import type { DocLive } from './DocDevelopment';
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
  /** Referencia de código. Sin ella la pestaña Desarrollo no aparece. */
  code?: DocCodeReference;
  /** Conexión con la historia principal (solo en la página Docs): lienzo, código generado y controles. */
  live?: DocLive;
}

/**
 * Página de documentación de un componente (plantilla "Documentación" de Figma): encabezado con ícono, nombre,
 * descripción y pestañas (`Tabs` de CAOS): Definición, Aplicación y Desarrollo (la referencia de código). Cada
 * pestaña muestra sus secciones; las secciones no llevan número.
 * La raíz es un `<main>`; ocupa todo el ancho disponible (hasta 1440).
 */
export function ComponentDoc({ doc, code, live }: ComponentDocProps) {
  return (
    <main className="sb-unstyled mx-auto min-h-dvh w-full max-w-[1440px] bg-ds-background-container-surface font-ds-primitives-typography-family-primary text-ds-text-neutral-body">
      <Tabs defaultValue="definicion" size="md" contrast="on-canva">
        <DocHeader
          icon={doc.icon}
          name={doc.name}
          summary={doc.summary}
          tabs={
            <TabList aria-label="Secciones de la documentación">
              <Tab value="definicion" icon="document-text">
                Definición
              </Tab>
              <Tab value="aplicacion" icon="gallery-edit">
                Aplicación
              </Tab>
              {code && (
                <Tab value="desarrollo" icon="code">
                  Desarrollo
                </Tab>
              )}
            </TabList>
          }
        />
        <TabPanel value="definicion" focusable={false}>
          <Sections sections={doc.definition} />
        </TabPanel>
        <TabPanel value="aplicacion" focusable={false}>
          <Sections sections={doc.application} />
        </TabPanel>
        {code && (
          <TabPanel value="desarrollo" focusable={false}>
            <CodeReference {...code} live={live} />
          </TabPanel>
        )}
      </Tabs>
    </main>
  );
}
