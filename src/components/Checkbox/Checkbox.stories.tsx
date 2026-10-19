import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'radio',
      options: [true, false, 'indeterminate'],
      description: 'Estado de selección',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita el checkbox visual y funcionalmente',
    },
    error: {
      control: 'text',
      description: 'Mensaje de error para estado inválido',
    },
    align: {
      control: 'radio',
      options: ['top', 'center'],
      description: 'Alineación vertical del checkbox con respecto al texto',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper for interactive states in Storybook
const CheckboxInteractive = (args: any) => {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(args.checked || false);
  return (
    <Checkbox
      {...args}
      checked={checked}
      onCheckedChange={(c) => {
        // Toggle logic for interactive preview
        if (checked === 'indeterminate') setChecked(true);
        else setChecked(c);
      }}
    />
  );
};

export const Default: Story = {
  args: {
    label: 'Aceptar términos y condiciones',
    size: 'md',
  },
  render: (args) => <CheckboxInteractive {...args} />,
};

export const WithDescription: Story = {
  args: {
    label: 'Suscribirse al newsletter',
    description: 'Recibe noticias y ofertas especiales cada semana en tu correo.',
    size: 'md',
  },
  render: (args) => <CheckboxInteractive {...args} />,
};

export const Indeterminate: Story = {
  args: {
    label: 'Seleccionar todos los elementos',
    checked: 'indeterminate',
    size: 'md',
  },
  render: (args) => <CheckboxInteractive {...args} />,
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex gap-8">
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold mb-2">Desmarcado</h4>
          <Checkbox label="Por defecto" />
          <Checkbox label="Hover/Focus" className="group-hover:border-[var(--border-field-active)]" />
          <Checkbox label="Deshabilitado" disabled />
          <Checkbox label="Error" error="Debes aceptar esto" />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold mb-2">Marcado</h4>
          <Checkbox checked label="Por defecto" />
          <Checkbox checked label="Hover/Focus" />
          <Checkbox checked label="Deshabilitado" disabled />
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold mb-2">Indeterminado</h4>
          <Checkbox checked="indeterminate" label="Por defecto" />
          <Checkbox checked="indeterminate" label="Hover/Focus" />
          <Checkbox checked="indeterminate" label="Deshabilitado" disabled />
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Checkbox size="sm" label="Pequeño (16px)" description="Texto de soporte para checkbox pequeño" />
      <Checkbox size="md" label="Mediano (20px)" description="Texto de soporte para checkbox mediano" />
      <Checkbox size="lg" label="Grande (24px)" description="Texto de soporte para checkbox grande" />
    </div>
  ),
};
