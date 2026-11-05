import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Breadcrumb.doc';
import docsJson from './Breadcrumb.docs.json';

/**
 * Niveles que muestra el código de la sección Desarrollo (`docsLive.args`): cómo se arma la ruta. El lienzo dibuja
 * la historia `Interactive`, con enlaces que no navegan.
 */
const DOCS_CODE_CHILDREN = [
  <BreadcrumbItem key="home" href="/" home />,
  <BreadcrumbItem key="projects" href="/proyectos">Proyectos</BreadcrumbItem>,
  <BreadcrumbItem key="documents" href="/documentos">Documentos</BreadcrumbItem>,
  <BreadcrumbItem key="report" current>Informe trimestral</BreadcrumbItem>,
];

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
    // La página Docs usa la plantilla de documentación (Breadcrumb.doc.tsx) con la referencia de código al final
    docs: componentDocsParameters(doc, docsJson),
    // Los niveles no son un control: se agregan a los args para que el código generado muestre la ruta
    docsLive: { story: 'Interactive', args: (a: Record<string, unknown>) => ({ ...a, children: DOCS_CODE_CHILDREN }) },
  },
  tags: ['autodocs'],
  // Las descripciones salen de Breadcrumb.docs.json (solo las props de Breadcrumb; las de BreadcrumbItem van en `subcomponents`)
  argTypes: argTypesFromDocsJson(docsJson, {
    'aria-label': { control: 'text' },
    children: { control: false },
  }),
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#inicio" home />
      <BreadcrumbItem href="#proyectos">Proyectos</BreadcrumbItem>
      <BreadcrumbItem href="#documentos">Documentos</BreadcrumbItem>
      <BreadcrumbItem current>Informe trimestral</BreadcrumbItem>
    </Breadcrumb>
  ),
};

/** Sin ícono home: todos los niveles con texto */
export const TextOnly: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#a">Inicio</BreadcrumbItem>
      <BreadcrumbItem href="#b">Ajustes</BreadcrumbItem>
      <BreadcrumbItem current>Perfil</BreadcrumbItem>
    </Breadcrumb>
  ),
};

/** Textos largos: envuelven por defecto; con `truncate` se recortan con elipsis y llevan `title` */
export const LongItems: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex max-w-md flex-col gap-6">
      <Breadcrumb {...args}>
        <BreadcrumbItem href="#a" home />
        <BreadcrumbItem href="#b">Carpeta de documentos compartidos del equipo</BreadcrumbItem>
        <BreadcrumbItem current>Informe trimestral de avance de los proyectos</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb {...args} aria-label="Ruta de navegación recortada">
        <BreadcrumbItem href="#a" home />
        <BreadcrumbItem href="#b" truncate>Carpeta de documentos compartidos del equipo</BreadcrumbItem>
        <BreadcrumbItem current truncate>Informe trimestral de avance de los proyectos</BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

function ItemOnly({ figma, children, ...props }: { figma: string } & React.ComponentProps<typeof BreadcrumbItem>) {
  return (
    <ol className="m-0 flex list-none p-0">
      <BreadcrumbItem {...props} data-figma={figma}>{children}</BreadcrumbItem>
    </ol>
  );
}

const LABEL = 'text-xs text-ds-text-neutral-body';

/**
 * Cada variante de Figma una vez. Los nombres de variante se repiten entre los dos sets
 * (Type=Default), por eso el comparador se corre una vez por carpeta: esta historia
 * para el set Breadcrumb (el primer Type=Default) y FigmaMatrixText para Text Breadcrumb.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="grid grid-cols-[auto_auto] items-center justify-items-start gap-x-8 gap-y-4">
        <span className={LABEL}>Breadcrumb · Type=Default</span>
        <Breadcrumb data-figma="Type=Default">
          <BreadcrumbItem href="#inicio" home chevron />
          <BreadcrumbItem href="#texto" chevron>Text</BreadcrumbItem>
          <BreadcrumbItem current chevron>Text</BreadcrumbItem>
        </Breadcrumb>
        <span className={LABEL}>Text Breadcrumb · Type=Default</span>
        <ItemOnly figma="Type=Default" href="#texto" chevron>Text</ItemOnly>
        <span className={LABEL}>Text Breadcrumb · Type=Select</span>
        <ItemOnly figma="Type=Select" current chevron>Text</ItemOnly>
      </div>
    </div>
  ),
};

/** Solo las variantes de Text Breadcrumb (Type=Default, Type=Select), con Chevron activo */
export const FigmaMatrixText: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="grid grid-cols-[auto_auto] items-center justify-items-start gap-x-8 gap-y-4">
        <span className={LABEL}>Type=Default</span>
        <ItemOnly figma="Type=Default" href="#texto" chevron>Text</ItemOnly>
        <span className={LABEL}>Type=Select</span>
        <ItemOnly figma="Type=Select" current chevron>Text</ItemOnly>
      </div>
    </div>
  ),
};

/** Test: landmark con nombre, lista, página actual sin enlace y chevrons ocultos a lectores */
export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#inicio" home />
      <BreadcrumbItem href="#proyectos">Proyectos</BreadcrumbItem>
      <BreadcrumbItem current>Informe trimestral</BreadcrumbItem>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Ruta de navegación' });
    await expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
    // El ícono home solo expone "Inicio"
    await expect(canvas.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '#inicio');
    await expect(canvas.getByRole('link', { name: 'Proyectos' })).toBeVisible();
    // Página actual: texto con aria-current, no enlace
    await expect(canvas.queryByRole('link', { name: 'Informe trimestral' })).toBeNull();
    await expect(canvas.getByText('Informe trimestral').closest('[aria-current="page"]')).not.toBeNull();
    // Chevrons decorativos; el último ítem no lo muestra
    const separators = nav.querySelectorAll('[data-separator]');
    separators.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'));
    await expect(getComputedStyle(separators[2]).display).toBe('none');
    await expect(getComputedStyle(separators[0]).display).not.toBe('none');
  },
};

/** Test: Tab recorre los enlaces en orden y salta la página actual */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#a">Proyectos</BreadcrumbItem>
      <BreadcrumbItem href="#b">Documentos</BreadcrumbItem>
      <BreadcrumbItem current>Informe trimestral</BreadcrumbItem>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Proyectos' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Documentos' })).toHaveFocus();
  },
};

/** Test: la página de documentación (plantilla v2) con sus tres pestañas */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Breadcrumb' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Breadcrumb en Figma:']);
    await expect(canvas.getByRole('switch', { name: 'Modo oscuro' })).toBeInTheDocument();
    // Una pauta por marcador en cada lienzo de anatomía
    await expect(canvasElement.querySelectorAll('[data-doc-mark]').length).toBeGreaterThan(0);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    // Sin Storybook no hay lienzo ni Personalizar: solo el bloque Props, de solo lectura
    const props = canvas.getByRole('table', { name: 'Props de Breadcrumb' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
