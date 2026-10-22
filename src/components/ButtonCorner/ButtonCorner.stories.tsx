import type { Decorator, Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { ButtonCorner } from './ButtonCorner';
import type {
  ButtonCornerBaseProps,
  ButtonCornerSize,
  ButtonCornerStatus,
  ButtonCornerVariant,
} from './ButtonCorner.types';

const VARIANTS: ButtonCornerVariant[] = ['icon', 'dots', 'radiobutton', 'checkbox', 'favorite'];
const STATUSES: ButtonCornerStatus[] = ['on-canva', 'on-card', 'unicolor-canva'];
const SIZES: ButtonCornerSize[] = ['sm', 'md'];

const LABELS: Record<ButtonCornerVariant, string> = {
  icon: 'Abrir',
  dots: 'Más opciones',
  radiobutton: 'Seleccionar opción',
  checkbox: 'Seleccionar elemento',
  favorite: 'Marcar como favorito',
};

/** Args de Storybook: props base sin la unión (los args son parciales) */
type ButtonCornerArgs = ButtonCornerBaseProps & { 'aria-label'?: string };

/** Unicolor se usa sobre foto o color: se muestra sobre N01 para que se lea en claro y oscuro. */
const OnDarkSurface: Decorator = (Story) => (
  <div className="inline-flex bg-ds-primitives-color-primary-n01 p-6">
    <Story />
  </div>
);

const meta: Meta<ButtonCornerArgs> = {
  title: 'General Controls/Button corner',
  component: ButtonCorner as unknown as ComponentType<ButtonCornerArgs>,
  tags: ['autodocs'],
  // Tipos explícitos: con la unión discriminada de ButtonCornerProps el docgen no los infiere y Storybook descarta los args de la URL
  argTypes: {
    variant: {
      type: { name: 'enum', value: VARIANTS },
      control: 'select',
      options: VARIANTS,
      description: 'Type: contenido del botón',
    },
    status: {
      type: { name: 'enum', value: STATUSES },
      control: 'select',
      options: STATUSES,
      description: 'Status: relleno. Unicolor canva no cambia con el tema.',
    },
    size: {
      type: { name: 'enum', value: SIZES },
      control: 'radio',
      options: SIZES,
      description: 'Size: md 40 · sm 32',
    },
    stroke: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Stroke: borde exterior de 1px',
    },
    pressed: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'aria-pressed (checkbox, radiobutton y favorite). No cambia el aspecto.',
    },
    disabled: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'disabled nativo (sin aspecto propio en Figma)',
    },
    'aria-label': {
      type: { name: 'string' },
      control: 'text',
      description: 'Nombre accesible (obligatorio: aria-label o aria-labelledby)',
    },
  },
  args: {
    variant: 'icon',
    status: 'on-canva',
    size: 'md',
    stroke: false,
    disabled: false,
    'aria-label': 'Abrir',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const Dots: Story = {
  args: { variant: 'dots', 'aria-label': 'Más opciones' },
};

export const Favorite: Story = {
  args: { variant: 'favorite', pressed: false, 'aria-label': 'Marcar como favorito' },
};

export const Checkbox: Story = {
  args: { variant: 'checkbox', pressed: false, 'aria-label': 'Seleccionar elemento' },
};

export const Radiobutton: Story = {
  args: { variant: 'radiobutton', pressed: false, 'aria-label': 'Seleccionar opción' },
};

export const UnicolorCanva: Story = {
  args: { status: 'unicolor-canva', stroke: true },
  decorators: [OnDarkSurface],
};

/** Matriz Type × Status × Size × Stroke: las 60 variantes del component set. */
export const StatesMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {STATUSES.map((status) => (
        <div
          key={status}
          // Superficie N01 fija: el relleno de On canva coincide con el fondo del tema y no se vería
          className="bg-ds-primitives-color-primary-n01 p-4"
        >
          <p className="mb-3 text-xs text-ds-primitives-color-primary-b01">{status}</p>
          <div className="grid grid-cols-[auto_repeat(5,auto)] items-center justify-start gap-x-6 gap-y-4">
            <span />
            {VARIANTS.map((v) => (
              <span key={v} className="text-xs text-ds-text-neutral-body">{v}</span>
            ))}
            {SIZES.flatMap((size) =>
              [false, true].map((stroke) => (
                <div key={`${size}-${stroke}`} className="contents">
                  <span className="text-xs text-ds-text-neutral-body">
                    {size} · stroke {stroke ? 'yes' : 'no'}
                  </span>
                  {VARIANTS.map((v) => (
                    <div key={v} className="p-[2px]">
                      <ButtonCorner
                        variant={v}
                        status={status}
                        size={size}
                        stroke={stroke}
                        aria-label={LABELS[v]}
                      />
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};
