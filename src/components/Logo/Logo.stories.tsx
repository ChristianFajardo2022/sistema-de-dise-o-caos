import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Logo } from './Logo';
import type { LogoSize, LogoType } from './Logo.types';

const TYPE_OPTIONS: LogoType[] = ['logo', 'icon'];
const SIZE_OPTIONS: LogoSize[] = ['xs', 'sm', 'md', 'lg'];

const meta = {
  title: 'Data Display/Logo',
  component: Logo,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      name: 'type',
      control: 'radio',
      options: TYPE_OPTIONS,
      type: { name: 'enum', value: TYPE_OPTIONS },
      description: 'Type de Figma: marca completa o solo el símbolo',
    },
    size: {
      name: 'size',
      control: 'radio',
      options: SIZE_OPTIONS,
      type: { name: 'enum', value: SIZE_OPTIONS },
      description: 'Size de Figma: xs, sm, md o lg',
    },
    title: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible' },
    decorative: { control: 'boolean', type: { name: 'boolean' }, description: 'Oculta el logo a lectores de pantalla' },
  },
  args: { type: 'logo', size: 'lg', decorative: false },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const IconOnly: Story = { args: { type: 'icon', size: 'md' } };

/** Las 8 variantes de Figma (Type × Size), cada una una vez, sobre la superficie del tema. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="grid grid-cols-[auto_repeat(4,auto)] items-center justify-items-start gap-x-8 gap-y-4">
        <span />
        {SIZE_OPTIONS.map((s) => (
          <span key={s} className="text-xs text-ds-text-neutral-body">{s}</span>
        ))}
        {TYPE_OPTIONS.map((t) => (
          <div key={t} className="contents">
            <span className="text-xs text-ds-text-neutral-body">{t}</span>
            {SIZE_OPTIONS.map((s) => (
              <Logo key={s} type={t} size={s} data-figma={`Type=${t === 'logo' ? 'Logo' : 'Icon'}, Size=${s}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Test: rol img con el nombre de la marca por defecto, nombre propio con title y oculto con decorative */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <Logo />
      <Logo type="icon" size="sm" title="Inicio" />
      <Logo type="icon" size="xs" decorative data-testid="deco" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'Inter Rapidísimo' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'Inicio' })).toBeVisible();
    await expect(canvas.getAllByRole('img')).toHaveLength(2);
    await expect(canvas.getByTestId('deco')).toHaveAttribute('aria-hidden', 'true');
  },
};

/** Test: cada Size fija las medidas de Figma */
export const SizeTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <Logo size="lg" title="lg" />
      <Logo size="xs" title="xs" />
      <Logo type="icon" size="md" title="icon-md" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: 'lg' })).toHaveAttribute('width', '158');
    await expect(canvas.getByRole('img', { name: 'xs' })).toHaveAttribute('height', '24');
    await expect(canvas.getByRole('img', { name: 'icon-md' })).toHaveAttribute('width', '48');
  },
};
