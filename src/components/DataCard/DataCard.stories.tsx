import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, within } from 'storybook/test';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Icon } from '../Icon';
import { Radio } from '../Radio';
import { Switch } from '../Switch';
import { DataCard } from './DataCard';

/** Gráfico de ejemplo para el slot (decorativo). */
function Sparkline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 196 46"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-auto w-48 text-ds-icon-semantic-information-neutral"
    >
      <path d="M1 44c10 0 12-6 18-22 4-10 9-10 13-2 3 6 6 7 10 2 5-6 9-16 14-16 6 0 9 12 14 24 4 9 9 12 20 12h104" />
    </svg>
  );
}

const meta = {
  title: 'Data Display/DataCard',
  component: DataCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Título (dato principal)' },
    description: { control: 'text', description: 'Descripción bajo el título' },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6, 'none'],
      description: "Nivel del encabezado del título; 'none' = párrafo",
      type: { name: 'enum', value: [2, 3, 4, 5, 6, 'none'] },
    },
  },
  args: { title: '1.284', description: 'Visitas esta semana', headingLevel: 3 },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => (
    <DataCard {...args}>
      <Sparkline />
    </DataCard>
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

/**
 * El único Data card de Figma (set 14043:59910). Sus hijos Toggle, Button y Selection están ocultos en esa variante:
 * en el código son el slot `action`. Los textos son los de Figma.
 */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="w-[757px]">
        <DataCard title="Título" description="Descripción" data-figma="Propiedad 1=Propiedad 14">
          {/* Solo en la matriz: el Container graphic de Figma mide 81 de alto */}
          <div className="flex h-[81px] items-center">
            <Sparkline />
          </div>
        </DataCard>
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
