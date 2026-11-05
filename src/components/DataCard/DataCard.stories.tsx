import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { ProgressBar } from '../ProgressBar';
import { Radio } from '../Radio';
import { Switch } from '../Switch';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { DataCard } from './DataCard';
import { doc } from './DataCard.doc';
import docsJson from './DataCard.docs.json';

/** Gráfico de ejemplo para el slot (decorativo). */
function Sparkline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 196 46"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-auto w-48 max-w-full text-ds-icon-semantic-information-secondary"
    >
      <path d="M1 44c10 0 12-6 18-22 4-10 9-10 13-2 3 6 6 7 10 2 5-6 9-16 14-16 6 0 9 12 14 24 4 9 9 12 20 12h104" />
    </svg>
  );
}

const meta = {
  title: 'Data Display/DataCard',
  component: DataCard,
  parameters: { layout: 'padded', docs: componentDocsParameters(doc, docsJson) },
  tags: ['autodocs'],
  argTypes: {
    ...argTypesFromDocsJson(docsJson),
    selected: { control: 'boolean', type: { name: 'boolean' } },
    inactive: { control: 'boolean', type: { name: 'boolean' } },
    state: {
      control: 'select',
      options: ['default', 'hover', 'select', 'inactive'],
      type: { name: 'enum', value: ['default', 'hover', 'select', 'inactive'] },
    },
    title: { control: 'text' },
    description: { control: 'text' },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6, 'none'],
      type: { name: 'enum', value: [2, 3, 4, 5, 6, 'none'] },
    },
  },
  args: { title: '72%', description: 'Avance del proyecto', headingLevel: 3 },
  decorators: [
    (Story, { parameters }) =>
      parameters.sinMarco ? (
        <Story />
      ) : (
        <div className="w-140 max-w-full">
          <Story />
        </div>
      ),
  ],
} satisfies Meta<typeof DataCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: { children: <ProgressBar label="Avance del proyecto" value={72} showValue={false} /> },
};

/** Estados Select e Inactive: `selected` e `inactive` son visuales; el control de `action` lleva el estado real. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <DataCard title="12" description="Seleccionada" selected action={<Checkbox aria-label="Elegir equipo A" defaultChecked />} />
      <DataCard title="9" description="Inactiva" inactive action={<Checkbox aria-label="Elegir equipo B" disabled />} />
    </div>
  ),
};

export const WithoutGraphic: Story = {};

function SwitchDemo() {
  const [on, setOn] = useState(true);
  return (
    <DataCard
      title="Alertas"
      description="Avisar cuando baje el rendimiento"
      icon="notification"
      action={<Switch checked={on} onCheckedChange={setOn} aria-label="Activar alertas" />}
    />
  );
}

export const WithSwitch: Story = { render: () => <SwitchDemo /> };

export const WithButton: Story = {
  render: () => (
    <DataCard
      title="24"
      description="Reportes generados"
      action={
        <Button variant="tertiary" size="sm" iconOnly aria-label="Abrir reportes">
          <Icon name="arrow-right3" size={24} />
        </Button>
      }
    >
      <Sparkline />
    </DataCard>
  ),
};

export const WithSelection: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <DataCard title="12" description="Equipo A" action={<Checkbox aria-label="Elegir equipo A" />} />
      <DataCard title="9" description="Equipo B" action={<Radio name="equipo" aria-label="Elegir equipo B" />} />
    </div>
  ),
};

const FIGMA_STATES = [
  { name: 'Propiedad 1=Propiedad 14', props: {} },
  { name: 'Propiedad 1=Hover', props: { state: 'hover' as const } },
  { name: 'Propiedad 1=Select', props: { selected: true } },
  { name: 'Propiedad 1=Inactive', props: { inactive: true } },
];

// Figma: 14043:59910
/**
 * Las 4 variantes del Data card de Figma. Sus hijos Toggle, Button y Selection están ocultos en esas
 * variantes: en el código son el slot `action`. Los textos son los de Figma.
 */
export const FigmaMatrix: Story = {
  parameters: { sinMarco: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="flex w-full max-w-[757px] flex-col gap-6">
        {FIGMA_STATES.map(({ name, props }) => (
          <DataCard key={name} title="Título" description="Descripción" data-figma={name} {...props}>
            {/* Solo en la matriz: el Container graphic de Figma mide 81 de alto */}
            <div className="flex h-[81px] items-center">
              <Sparkline />
            </div>
          </DataCard>
        ))}
      </div>
    </div>
  ),
};

/** Test: el título es un encabezado y la descripción se lee; el slot de acción conserva su rol */
export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4">
      <DataCard
        title="Alertas"
        description="Avisar cuando baje el rendimiento"
        action={<Switch aria-label="Activar alertas" />}
      />
      <DataCard title="1.284" description="Visitas esta semana" headingLevel="none" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { name: 'Alertas', level: 3 })).toBeInTheDocument();
    // headingLevel="none": el título es un párrafo, fuera del esquema de encabezados
    await expect(c.getAllByRole('heading')).toHaveLength(1);
    await expect(c.getByText('1.284').tagName).toBe('P');
    await expect(c.getByText('Avisar cuando baje el rendimiento')).toBeInTheDocument();
    await expect(c.getByRole('switch', { name: 'Activar alertas' })).not.toBeChecked();
  },
};

/** Página de documentación v2 (la revisan vitest y axe). */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', sinMarco: true },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'DataCard' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente DataCard en Figma:']);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de DataCard' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
