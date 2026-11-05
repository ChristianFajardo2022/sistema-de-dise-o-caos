import type { ReactNode } from 'react';
import { Tab, TabList, TabPanel, Tabs } from '../../components/Tabs';
import type { IconName } from '../../components/Icon/Icon.types';
import { DocHeader, DocSection } from '../../docs/DocParts';
import { FoundationBlockView } from './FoundationBlocks';
import type { FoundationDocContent, FoundationDocTab, FoundationSectionContent } from './foundationDoc.types';

function Sections({ sections }: { sections: FoundationSectionContent[] }) {
  return sections.map((section) => (
    <DocSection key={section.title} title={section.title} description={section.description} titleInside={section.titleInside}>
      {section.blocks.map((block, b) => (
        <FoundationBlockView key={b} block={block} />
      ))}
    </DocSection>
  ));
}

/** Pestañas en su orden, con el ícono del encabezado de Figma. */
const TABS: { value: FoundationDocTab; label: string; icon: IconName; key: keyof Pick<FoundationDocContent, 'definition' | 'application' | 'accessibility' | 'development'> }[] = [
  { value: 'definicion', label: 'Definición', icon: 'document-text', key: 'definition' },
  { value: 'aplicacion', label: 'Aplicación', icon: 'gallery-edit', key: 'application' },
  // Figma usa `tools-reality-accessibility`, que no está en la biblioteca de íconos de CAOS: va `user` (silueta de persona)
  { value: 'accesibilidad', label: 'Accesibilidad', icon: 'user', key: 'accessibility' },
  { value: 'desarrollo', label: 'Desarrollo', icon: 'code', key: 'development' },
];

interface FoundationDocProps {
  doc: FoundationDocContent;
  /** Pestaña abierta al cargar (una historia por pestaña). */
  initialTab?: FoundationDocTab;
}

/**
 * Página de un fundamento con la plantilla v2: el mismo `<main>`, encabezado (`DocHeader`) y secciones (`DocSection`)
 * que la página de un componente (`ComponentDoc`), con hasta cuatro pestañas: Definición, Aplicación, Accesibilidad y
 * Desarrollo. Una pestaña sin secciones no aparece.
 */
export function FoundationDoc({ doc, initialTab = 'definicion' }: FoundationDocProps): ReactNode {
  const tabs = TABS.filter((tab) => (doc[tab.key]?.length ?? 0) > 0);
  return (
    <main className="sb-unstyled mx-auto min-h-dvh w-full max-w-[1440px] bg-ds-background-container-surface font-ds-primitives-typography-family-primary text-ds-text-neutral-body">
      <Tabs defaultValue={initialTab} size="md" contrast="on-canva">
        <DocHeader
          icon={doc.icon}
          name={doc.name}
          summary={doc.summary}
          tabs={
            <TabList aria-label="Secciones de la documentación">
              {tabs.map((tab) => (
                <Tab key={tab.value} value={tab.value} icon={tab.icon}>
                  {tab.label}
                </Tab>
              ))}
            </TabList>
          }
        />
        {tabs.map((tab) => (
          <TabPanel key={tab.value} value={tab.value} focusable={false}>
            <Sections sections={doc[tab.key] ?? []} />
          </TabPanel>
        ))}
      </Tabs>
    </main>
  );
}
