import type { ReactNode } from 'react';
import { Tab, TabList, TabPanel, Tabs } from '../components/Tabs';
import { CodeReference } from './CodeReference';
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
      return <DocAnatomy title={block.title} preview={block.preview} parts={block.parts} />;
    case 'gallery':
      return <DocGallery title={block.title} columns={block.columns} align={block.align} items={block.items} />;
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

function Sections({ sections, start }: { sections: DocSectionContent[]; start: number }) {
  return sections.map((section, i) => (
    <DocSection key={section.title} number={start + i} title={section.title} description={section.description}>
      {section.blocks.map((block, b) => (
        <DocBlockView key={b} block={block} />
      ))}
    </DocSection>
  ));
}

export type ComponentDocTab = 'definicion' | 'aplicacion' | 'codigo';

interface ComponentDocProps {
  /** Contenido del componente (`<Nombre>.doc.tsx`). */
  doc: ComponentDocContent;
  /** Referencia de código (pestaña Código). Sin ella la pestaña no aparece. */
  code?: DocCodeReference;
  /** Pestaña inicial. Por defecto Definición. */
  initialTab?: ComponentDocTab;
}

/**
 * Página de documentación de un componente (plantilla "Documentación" de Figma): encabezado con ícono, nombre y
 * descripción, pestañas Definición | Aplicación | Código (patrón WAI-ARIA Tabs, componente `Tabs`) y las secciones
 * numeradas. La numeración es continua: Aplicación sigue después de la última sección de Definición.
 * La raíz es un `<main>`; ocupa todo el ancho disponible (hasta 1440).
 */
export function ComponentDoc({ doc, code, initialTab = 'definicion' }: ComponentDocProps) {
  const applicationStart = doc.definition.length + 1;
  return (
    <Tabs defaultValue={initialTab} className="block">
      <main className="sb-unstyled mx-auto min-h-dvh w-full max-w-[1440px] bg-ds-background-container-surface font-ds-primitives-typography-family-primary text-ds-text-neutral-body">
        <DocHeader
          icon={doc.icon}
          name={doc.name}
          summary={doc.summary}
          tabs={
            <TabList aria-label={`Documentación de ${doc.name}`} className="max-w-full">
              <Tab value="definicion" icon="document-text">
                Definición
              </Tab>
              <Tab value="aplicacion" icon="smart-cursor">
                Aplicación
              </Tab>
              {code && (
                <Tab value="codigo" icon="setting">
                  Código
                </Tab>
              )}
            </TabList>
          }
        />
        {/* Los paneles traen controles enfocables (ejemplos vivos, tablas con scroll): no suman un tab stop propio */}
        <TabPanel value="definicion" focusable={false}>
          <Sections sections={doc.definition} start={1} />
        </TabPanel>
        <TabPanel value="aplicacion" focusable={false}>
          <Sections sections={doc.application} start={applicationStart} />
        </TabPanel>
        {code && (
          <TabPanel value="codigo">
            <CodeReference {...code} />
          </TabPanel>
        )}
      </main>
    </Tabs>
  );
}
