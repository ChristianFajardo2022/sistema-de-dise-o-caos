import type { Decorator, Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ButtonCorner } from './ButtonCorner';
import type {
  ButtonCornerBaseProps,
  ButtonCornerContrast,
  ButtonCornerSize,
  ButtonCornerState,
  ButtonCornerVariant,
} from './ButtonCorner.types';
import { cornerShadowClass } from '../_internal/shadows';

const VARIANTS: ButtonCornerVariant[] = ['icon', 'dots', 'radiobutton', 'checkbox', 'favorite'];
const CONTRASTS: ButtonCornerContrast[] = ['on-canva', 'on-card', 'unicolor-canva'];
const STATES: ButtonCornerState[] = ['default', 'hover', 'select', 'inactive'];
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
    contrast: {
      type: { name: 'enum', value: CONTRASTS },
      control: 'select',
      options: CONTRASTS,
      description: 'Contrast: relleno según la superficie. Unicolor canva no cambia con el tema.',
    },
    state: {
      type: { name: 'enum', value: STATES },
      control: 'radio',
      options: STATES,
      description:
        'Solo documentación: fuerza Hover, Select o Inactive. En uso real el hover es CSS, Select sale de pressed o aria-expanded e Inactive de disabled. Unicolor no tiene Hover, Select ni Inactive.',
    },
    status: {
      type: { name: 'enum', value: CONTRASTS },
      control: false,
      description: 'Obsoleto: alias de contrast.',
      table: { disable: true },
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
      description: 'Stroke: trazo de 1px',
    },
    pressed: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'aria-pressed (checkbox, radiobutton y favorite): aspecto Select; en favorite, corazón relleno.',
    },
    disabled: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'disabled nativo: aspecto State=Inactive de Figma (On canva y On card; Unicolor no lo define)',
    },
    'aria-label': {
      type: { name: 'string' },
      control: 'text',
      description: 'Nombre accesible (obligatorio: aria-label o aria-labelledby)',
    },
  },
  args: {
    variant: 'icon',
    contrast: 'on-canva',
    state: 'default',
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
  args: { contrast: 'unicolor-canva', stroke: true },
  decorators: [OnDarkSurface],
};

/** Matriz Type × Contrast × Size × Stroke en reposo (más estados en FigmaMatrix). */
export const StatesMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {CONTRASTS.map((contrast) => (
        <div
          key={contrast}
          // Superficie N01 fija: el relleno de On canva coincide con el fondo del tema y no se vería
          className="bg-ds-primitives-color-primary-n01 p-4"
        >
          <p className="mb-3 text-xs text-ds-primitives-color-primary-b01">{contrast}</p>
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
                        contrast={contrast}
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

const FIGMA_TYPE: Record<ButtonCornerVariant, string> = {
  icon: 'Icon',
  dots: 'Dots',
  radiobutton: 'Radiobutton',
  checkbox: 'Checkbox',
  favorite: 'Favorite',
};
const FIGMA_CONTRAST: Record<ButtonCornerContrast, string> = {
  'on-canva': 'On canva',
  'on-card': 'On card',
  'unicolor-canva': 'Unicolor canva',
};
const FIGMA_STATE: Record<ButtonCornerState, string> = { default: 'Default', hover: 'Hover', select: 'Select', inactive: 'Inactive' };

/** Las 70 combinaciones del set: Hover, Select e Inactive solo existen en md (Select solo en On canva; el set ya no trae Select en On card, que el código sigue admitiendo) */
const FIGMA_ROWS: { contrast: ButtonCornerContrast; state: ButtonCornerState; size: ButtonCornerSize; stroke: boolean }[] = [
  { contrast: 'on-canva', state: 'default', size: 'md', stroke: false },
  { contrast: 'on-canva', state: 'hover', size: 'md', stroke: true },
  { contrast: 'on-canva', state: 'select', size: 'md', stroke: true },
  { contrast: 'on-card', state: 'default', size: 'md', stroke: false },
  { contrast: 'on-canva', state: 'inactive', size: 'md', stroke: true },
  { contrast: 'on-card', state: 'inactive', size: 'md', stroke: false },
  { contrast: 'on-card', state: 'hover', size: 'md', stroke: true },
  { contrast: 'unicolor-canva', state: 'default', size: 'md', stroke: true },
  { contrast: 'on-canva', state: 'default', size: 'sm', stroke: false },
  { contrast: 'on-canva', state: 'default', size: 'sm', stroke: true },
  { contrast: 'on-card', state: 'default', size: 'sm', stroke: false },
  { contrast: 'on-card', state: 'default', size: 'sm', stroke: true },
  { contrast: 'unicolor-canva', state: 'default', size: 'sm', stroke: false },
  { contrast: 'unicolor-canva', state: 'default', size: 'sm', stroke: true },
];

/** Superficie de cada Contrast: la del tema, la de tarjeta y N01 fijo para Unicolor (va sobre foto o color) */
const SURFACE: Record<ButtonCornerContrast, string> = {
  'on-canva': 'bg-ds-background-general-black',
  'on-card': 'bg-ds-background-container-default-on-card',
  'unicolor-canva': 'bg-ds-primitives-color-primary-n01',
};

const figmaName = (v: ButtonCornerVariant, r: (typeof FIGMA_ROWS)[number]) =>
  `Type=${FIGMA_TYPE[v]}, Contrast=${FIGMA_CONTRAST[r.contrast]}, State=${FIGMA_STATE[r.state]}, Size=${r.size}, Stroke=${r.stroke ? 'Yes' : 'No'}`;

/**
 * Las 70 variantes del component set, una vez cada una, con `data-figma` = nombre de Figma (para el comparador).
 * La sombra effect/shadow sm la pone quien coloca el botón (`cornerShadowClass`); aquí se aplica para medirla.
 * En On card, el relleno Default coincide con la superficie de tarjeta: que se funda es esperable.
 */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {CONTRASTS.map((contrast) => (
        <div key={contrast} className={`${SURFACE[contrast]} p-4`}>
          <p
            className={
              contrast === 'unicolor-canva'
                ? 'mb-3 text-ds-typography-body-size-xs text-ds-primitives-color-primary-b01'
                : 'mb-3 text-ds-typography-body-size-xs text-ds-text-neutral-body'
            }
          >
            Contrast={FIGMA_CONTRAST[contrast]}
          </p>
          <div className="grid grid-cols-[auto_repeat(5,auto)] items-center justify-start gap-x-6 gap-y-4">
            {FIGMA_ROWS.filter((r) => r.contrast === contrast).map((r) => (
              <div key={`${r.state}-${r.size}-${r.stroke}`} className="contents">
                <span
                  className={
                    contrast === 'unicolor-canva'
                      ? 'text-ds-typography-body-size-xs text-ds-primitives-color-primary-b01'
                      : 'text-ds-typography-body-size-xs text-ds-text-neutral-body'
                  }
                >
                  {FIGMA_STATE[r.state]} · {r.size} · Stroke {r.stroke ? 'Yes' : 'No'}
                </span>
                {VARIANTS.map((v) => (
                  <div key={v} className="p-[2px]">
                    <ButtonCorner
                      variant={v}
                      contrast={r.contrast}
                      state={r.state}
                      size={r.size}
                      stroke={r.stroke}
                      aria-label={LABELS[v]}
                      className={cornerShadowClass}
                      data-figma={figmaName(v, r)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Test: nombre accesible y activación con clic */
export const NameAndClickTest: Story = {
  tags: ['!autodocs'],
  args: { 'aria-label': 'Abrir detalle', onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Abrir detalle' });
    await expect(button).not.toHaveAttribute('aria-pressed');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Test: pressed expone aria-pressed */
export const PressedTest: Story = {
  tags: ['!autodocs'],
  args: { variant: 'favorite', pressed: true, 'aria-label': 'Quitar de favoritos' },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Quitar de favoritos', pressed: true });
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    // Favorito presionado: el corazón se rellena (no solo cambia el atributo)
    const path = button.querySelector('svg path')!;
    await expect(getComputedStyle(path).fill).not.toBe('none');
  },
};

/** Test: Enter y Espacio disparan onClick */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { variant: 'dots', 'aria-label': 'Más opciones', onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Más opciones' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

/** Test: Select real con aria-pressed (y aria-expanded) igual al forzado con state="select"; status sigue como alias */
export const SelectStateTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex gap-4">
      <ButtonCorner variant="checkbox" contrast="on-card" pressed aria-label="Real" />
      <ButtonCorner variant="checkbox" contrast="on-card" state="select" aria-label="Forzado" />
      <ButtonCorner variant="dots" contrast="on-card" aria-expanded aria-label="Menú abierto" />
      <ButtonCorner variant="checkbox" contrast="on-card" aria-label="Reposo" />
      <ButtonCorner variant="checkbox" status="on-card" aria-label="Alias" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const bg = (name: string) => getComputedStyle(c.getByRole('button', { name })).backgroundColor;
    const shadow = (name: string) => getComputedStyle(c.getByRole('button', { name })).boxShadow;
    await expect(c.getByRole('button', { name: 'Real', pressed: true })).toBeInTheDocument();
    await expect(bg('Real')).toBe(bg('Forzado'));
    await expect(shadow('Real')).toBe(shadow('Forzado'));
    await expect(bg('Menú abierto')).toBe(bg('Forzado'));
    await expect(shadow('Reposo')).toBe('none');
    // state="select" solo cambia el aspecto: no inventa aria-pressed
    await expect(c.getByRole('button', { name: 'Forzado' })).not.toHaveAttribute('aria-pressed');
    await expect(bg('Alias')).toBe(bg('Reposo'));
  },
};

/** Test: `disabled` real se ve igual que State=Inactive forzado y no responde al clic */
export const InactiveTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex gap-4">
      <ButtonCorner aria-label="Real" disabled onClick={fn()} />
      <ButtonCorner aria-label="Forzado" state="inactive" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const real = c.getByRole('button', { name: 'Real' });
    const bg = (name: string) => getComputedStyle(c.getByRole('button', { name })).backgroundColor;
    await expect(real).toBeDisabled();
    await expect(bg('Real')).toBe(bg('Forzado'));
    await expect(getComputedStyle(real).boxShadow).toBe('none');
  },
};
