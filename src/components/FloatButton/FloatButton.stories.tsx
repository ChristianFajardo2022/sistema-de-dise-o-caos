import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FloatButton } from './FloatButton';
import type { FloatButtonBaseProps } from './FloatButton.types';

/** Args de Storybook: props base más texto (los args son parciales y no exigen aria-label). */
type FloatButtonArgs = FloatButtonBaseProps & { children?: string };

const meta: Meta<FloatButtonArgs> = {
  title: 'General Controls/FloatButton',
  component: FloatButton as unknown as ComponentType<FloatButtonArgs>,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text', description: 'Nombre del ícono de la biblioteca CAOS' },
    children: { control: 'text', description: 'Texto: con texto el botón es extendido (With text)' },
    state: {
      type: { name: 'enum', value: ['default', 'hover', 'press', 'focus'] },
      control: 'select',
      options: ['default', 'hover', 'press', 'focus'],
      description: 'Aspecto forzado, solo para documentación (no existe en Figma: para diseño)',
    },
  },
  args: { icon: 'heart', 'aria-label': 'Favoritos', state: 'default', onClick: fn() },
};

export default meta;
type Story = StoryObj<FloatButtonArgs>;

export const Interactive: Story = {};

export const WithText: Story = { args: { children: 'Button', 'aria-label': undefined } };

/** La posición la decide quien lo usa: aquí, fijo abajo a la derecha del recuadro. */
export const Positioned: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="relative h-64 w-full bg-ds-background-general-black">
      <FloatButton {...(args as React.ComponentProps<typeof FloatButton>)} className="absolute right-6 bottom-6" />
    </div>
  ),
};

/** Status=Icon single y With text de Figma (set 21900:67738). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-6 bg-ds-background-general-black p-6">
      <FloatButton data-figma="Status=Icon single" aria-label="Favoritos" />
      <FloatButton data-figma="Status=With text">Button</FloatButton>
    </div>
  ),
};

/** Aspecto de hover, press y foco (no definidos en Figma). */
export const States: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-6 bg-ds-background-general-black p-6">
      {(['default', 'hover', 'press', 'focus'] as const).map((s) => (
        <FloatButton key={s} state={s} aria-label={`Favoritos ${s}`} />
      ))}
    </div>
  ),
};

/** Test: solo ícono tiene nombre accesible; Enter y Espacio lo activan. */
export const IconOnlyTest: Story = {
  tags: ['!autodocs'],
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Favoritos' });
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

/** Test: con texto, el texto es el nombre accesible. */
export const WithTextTest: Story = {
  tags: ['!autodocs'],
  args: { children: 'Crear', 'aria-label': undefined },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Crear' })).toBeVisible();
  },
};
