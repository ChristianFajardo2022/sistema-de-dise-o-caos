import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import type { ButtonState } from './Button.types';
// Pendiente: migrar a Iconsax cuando el paquete esté en el proyecto. El slot de ícono
// del Button dibuja cualquier SVG a 20px con el color del estado.
import { Plus, ArrowRight, Trash2, Settings } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'General Controls/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Type: jerarquía visual del botón',
    },
    contrast: {
      control: 'radio',
      options: ['low', 'high'],
      description: 'Contrats: solo aplica a secondary',
    },
    unicolor: {
      control: 'boolean',
      description: 'Unicolor: secondary y tertiary sin icon-single',
    },
    size: {
      control: 'radio',
      options: ['md', 'sm', 'xs'],
      description: 'Size: md 56 · sm 48 · xs 32',
    },
    state: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'press', 'inactive', 'delete', 'load'],
      description: 'State forzado (hover, focus y press solo para visualización). Tertiary no tiene load.',
    },
    loading: {
      control: 'boolean',
      description: 'Estado load: spinner y aria-busy',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado inactive',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Icon-single: botón cuadrado solo con ícono',
    },
  },
  args: {
    children: 'Button',
    variant: 'primary',
    contrast: 'low',
    unicolor: false,
    size: 'md',
    state: 'default',
    loading: false,
    disabled: false,
    iconOnly: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATES: ButtonState[] = ['default', 'hover', 'focus', 'press', 'inactive', 'delete', 'load'];

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const SecondaryLow: Story = {
  args: { variant: 'secondary', contrast: 'low' },
};

export const SecondaryHigh: Story = {
  args: { variant: 'secondary', contrast: 'high' },
};

export const Tertiary: Story = {
  args: { variant: 'tertiary' },
};

export const Unicolor: Story = {
  args: { variant: 'secondary', unicolor: true },
};

export const WithIcons: Story = {
  args: {
    variant: 'primary',
    leftIcon: <Plus />,
    rightIcon: <ArrowRight />,
  },
};

export const IconSingle: Story = {
  args: {
    variant: 'secondary',
    iconOnly: true,
    children: <Settings />,
    'aria-label': 'Configuración',
  },
};

export const Delete: Story = {
  args: {
    variant: 'primary',
    state: 'delete',
    leftIcon: <Trash2 />,
    children: 'Eliminar',
  },
};

export const Load: Story = {
  args: { variant: 'primary', loading: true },
};

export const Inactive: Story = {
  args: { variant: 'primary', disabled: true },
};

/** Matriz de Type × State, como el component set de Figma. */
export const StatesMatrix: Story = {
  render: () => {
    const rows = [
      { label: 'Primary', props: { variant: 'primary' as const } },
      { label: 'Secondary low', props: { variant: 'secondary' as const, contrast: 'low' as const } },
      { label: 'Secondary high', props: { variant: 'secondary' as const, contrast: 'high' as const } },
      { label: 'Tertiary', props: { variant: 'tertiary' as const } },
    ];
    return (
      <div className="grid grid-cols-[auto_repeat(7,auto)] items-center gap-4">
        <span />
        {STATES.map((s) => (
          <span key={s} className="text-xs text-neutral-400">{s}</span>
        ))}
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <span className="text-xs text-neutral-400">{row.label}</span>
            {STATES.map((s) =>
              row.props.variant === 'tertiary' && s === 'load' ? (
                <span key={s} />
              ) : (
                <div key={s}>
                  <Button {...row.props} state={s}>Button</Button>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    );
  },
};

/** Icon-single en los tres tamaños y tipos. */
export const IconSingleMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['md', 'sm', 'xs'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-8 text-xs text-neutral-400">{size}</span>
          <Button size={size} iconOnly variant="primary" aria-label="Agregar"><Plus /></Button>
          <Button size={size} iconOnly variant="secondary" aria-label="Agregar"><Plus /></Button>
          <Button size={size} iconOnly variant="secondary" contrast="high" aria-label="Agregar"><Plus /></Button>
          <Button size={size} iconOnly variant="tertiary" aria-label="Agregar"><Plus /></Button>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <Button size="md" variant={variant} leftIcon={<Plus />}>md 56</Button>
          <Button size="sm" variant={variant} leftIcon={<Plus />}>sm 48</Button>
          <Button size="xs" variant={variant} leftIcon={<Plus />}>xs 32</Button>
        </div>
      ))}
    </div>
  ),
};

export const HoverSpecifications: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-neutral-400">
          Interacción en vivo (Dissolve 300 ms, Ease out)
        </h3>
        <p className="text-xs text-neutral-500 mb-4">
          Pasa el cursor para ver el ciclo de 4 fases en Primary, el cambio de borde en Secondary y el fondo y subrayado en Tertiary. Usa Tab para ver Focus y mantén presionado para ver Press.
        </p>
        <div className="flex items-center gap-6">
          <Button variant="primary">Button</Button>
          <Button variant="secondary">Button</Button>
          <Button variant="secondary" contrast="high">Button</Button>
          <Button variant="tertiary">Button</Button>
        </div>
      </div>
    </div>
  ),
};
