import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PageHeader } from './PageHeader';
import { Breadcrumb, BreadcrumbItem } from '../Breadcrumb';
import { Button } from '../Button';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { buildCode } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './PageHeader.doc';
import docsJson from './PageHeader.docs.json';

const DESCRIPTION = 'Cambia tus datos y tus preferencias. Los cambios se aplican en todos tus dispositivos.';

/**
 * Código de Personalizar: el generado más el manejador de la flecha de volver, declarado arriba (el código generado
 * omite las funciones y el lienzo siempre dibuja la flecha), para que se copie y compile tal cual.
 */
function docsCode(args: Record<string, unknown>): string {
  const code = buildCode('PageHeader', args, { headingLevel: 1, backLabel: 'Volver' });
  const withBack = code.includes('<PageHeader\n')
    ? code.replace('<PageHeader\n', '<PageHeader\n  onBack={goBack}\n')
    : code.replace('<PageHeader', '<PageHeader onBack={goBack}');
  return `const goBack = () => {};\n\n${withBack}`;
}

const meta = {
  title: 'Navigation/Tittle header/Page Header',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    // La página Docs usa la plantilla de documentación (PageHeader.doc.tsx) con la referencia de código al final
    docs: componentDocsParameters(doc, docsJson),
    // El código se copia y compila tal cual: declara `goBack` (el código generado omite las funciones)
    docsLive: { story: 'Interactive', code: docsCode },
  },
  // Tipos explícitos en las uniones: sin ellos Storybook descarta los args de la URL
  argTypes: argTypesFromDocsJson(docsJson, {
    title: { control: 'text', type: { name: 'string' } },
    description: { control: 'text', type: { name: 'string' } },
    headingLevel: {
      control: 'radio',
      options: [1, 2, 3, 4, 5, 6],
      type: { name: 'enum', value: [1, 2, 3, 4, 5, 6] },
    },
    backLabel: { control: 'text', type: { name: 'string' } },
  }),
  args: { title: 'Ajustes de perfil', description: DESCRIPTION, headingLevel: 1, backLabel: 'Volver', onBack: fn() },
  decorators: [
    (Story) => (
      <div className="bg-ds-background-general-black p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('banner')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 1, name: 'Ajustes de perfil' })).toBeInTheDocument();
    const back = canvas.getByRole('button', { name: 'Volver' });
    back.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onBack).toHaveBeenCalledTimes(1);
  },
  tags: ['!autodocs'],
};

export const WithBreadcrumbAndActions: Story = {
  args: { onBack: undefined },
  render: (args) => (
    <PageHeader
      {...args}
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem href="#inicio" home />
          <BreadcrumbItem current>Ajustes</BreadcrumbItem>
        </Breadcrumb>
      }
      actions={<Button size="sm">Guardar</Button>}
    />
  ),
};

/** Una variante en Figma (Property 1=Default). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="max-w-full overflow-x-auto"><div className="w-[2144px]">
      <PageHeader title="Ajustes de perfil" description={DESCRIPTION} onBack={() => {}} data-figma="Property 1=Default" />
    </div></div>
  ),
};


export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Page Header' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Page Header en Figma:']);
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
    const props = canvas.getByRole('table', { name: 'Props de PageHeader' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
