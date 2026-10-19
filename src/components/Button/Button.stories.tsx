import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Plus, ArrowRight, Trash2, Settings, Download } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'General Controls/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destructive', 'link'],
      description: 'Jerarquía visual del botón',
    },
    contrast: {
      control: 'radio',
      options: ['low', 'high'],
      description: 'Nivel de contraste para fondos claros/oscuros',
    },
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Tamaño del componente',
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'press', 'focus', 'disabled', 'delete', 'load'],
      description: 'Estado interactivo forzado (para visualización)',
    },
    loading: {
      control: 'boolean',
      description: 'Muestra el spinner de carga y deshabilita la interacción',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita el botón visual y funcionalmente',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Establece el padding simétrico para botones que solo contienen un icono',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    contrast: 'low',
    size: 'md',
    state: 'default',
    loading: false,
    disabled: false,
    iconOnly: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Button',
  },
};

export const HoverSpecifications: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-neutral-400">
          Interacción en vivo (Hover y salida con Dissolve 300 ms, Ease out)
        </h3>
        <p className="text-xs text-neutral-500 mb-4">
          Pasa el cursor por encima para ver el ciclo de 4 estados por disolución en Primary, el cambio de borde en Secondary y el subrayado automático en Tertiary.
        </p>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-neutral-400">Primary (md)</span>
            <Button variant="primary">Button</Button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-neutral-400">Secondary (md)</span>
            <Button variant="secondary">Button</Button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-neutral-400">Tertiary (md)</span>
            <Button variant="tertiary">Button</Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-neutral-400">
          Comparativa Default vs Hover forzado
        </h3>
        <div className="grid grid-cols-2 gap-4 max-w-md items-center">
          <div className="text-xs font-medium text-neutral-400">Default</div>
          <div className="text-xs font-medium text-neutral-400">Hover forzado</div>

          <div><Button variant="primary" state="default">Button</Button></div>
          <div><Button variant="primary" state="hover">Button</Button></div>

          <div><Button variant="secondary" state="default">Button</Button></div>
          <div><Button variant="secondary" state="hover">Button</Button></div>

          <div><Button variant="tertiary" state="default">Button</Button></div>
          <div><Button variant="tertiary" state="hover">Button</Button></div>
        </div>
      </div>
    </div>
  ),
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Eliminar Elemento',
    leftIcon: <Trash2 className="w-4 h-4" />,
  },
};

export const WithIcons: Story = {
  args: {
    variant: 'primary',
    children: 'Continuar',
    leftIcon: <Plus className="w-4 h-4" />,
    rightIcon: <ArrowRight className="w-4 h-4" />,
  },
};

export const LoadingState: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Guardando datos...',
  },
};

export const DisabledState: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Botón Deshabilitado',
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'secondary',
    iconOnly: true,
    children: <Settings className="w-4 h-4" />,
    'aria-label': 'Configuración',
  },
};

export const VariantsMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="primary">Primario</Button>
        <Button variant="secondary">Secundario</Button>
        <Button variant="tertiary">Terciario</Button>
        <Button variant="destructive">Destructivo</Button>
        <Button variant="link">Enlace</Button>
      </div>

      <div className="flex items-center gap-3">
        <Button size="xs" variant="primary">XS (40px)</Button>
        <Button size="sm" variant="primary">SM (40px)</Button>
        <Button size="md" variant="primary">MD (56px)</Button>
        <Button size="lg" variant="primary">LG (64px)</Button>
      </div>

      <div className="flex items-center gap-3">
        <Button loading variant="primary">Cargando</Button>
        <Button disabled variant="primary">Deshabilitado</Button>
        <Button iconOnly variant="secondary" aria-label="Descargar">
          <Download className="w-4 h-4" />
        </Button>
      </div>
    </div>
  ),
};
