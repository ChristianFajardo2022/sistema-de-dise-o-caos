import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ThemeSwitch } from './ThemeSwitch';
import type { ThemeSwitchProps, ThemeSwitchValue } from './ThemeSwitch.types';
import { argTypesFromDocsJson } from '../../docs/code';
import docsJson from './ThemeSwitch.docs.json';

const meta = {
  title: 'Form Controls/Switch/ThemeSwitch',
  component: ThemeSwitch,
  parameters: { layout: 'centered' },
  // Sin página propia: se documenta dentro de la de Switch
  tags: ['!autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    value: { control: 'radio', options: ['light', 'dark'], type: { name: 'enum', value: ['light', 'dark'] } },
    defaultValue: { control: 'radio', options: ['light', 'dark'], type: { name: 'enum', value: ['light', 'dark'] } },
    contrast: { control: 'radio', options: ['on-canva', 'on-card'], type: { name: 'enum', value: ['on-canva', 'on-card'] } },
  }),
  args: { contrast: 'on-canva' },
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveDemo(args: ThemeSwitchProps) {
  const [value, setValue] = useState<ThemeSwitchValue>('light');
  return <ThemeSwitch {...args} value={value} onValueChange={setValue} />;
}

export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
};

const LABEL = 'text-xs text-ds-text-neutral-body';

// Figma: 22357:25378
/**
 * Las 4 variantes de Figma: State × Contrast. On canva va sobre la superficie del tema
 * (background/general/black) y On card sobre un contenedor de tarjeta.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de ThemeSwitch" className="max-w-full overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(2,auto)] items-center justify-items-start gap-x-8 gap-y-4">
          <span />
          <span className={LABEL}>Light</span>
          <span className={LABEL}>Dark</span>
          {([['On canva', 'on-canva'], ['On card', 'on-card']] as const).map(([figma, contrast]) => (
            <div key={contrast} className="contents">
              <span className={LABEL}>{figma}</span>
              {([['Light', 'light'], ['Dark', 'dark']] as const).map(([state, value]) => (
                <ThemeSwitch
                  key={state}
                  value={value}
                  contrast={contrast}
                  data-figma={`State=${state}, Contrast=${figma}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: rol switch con nombre fijo, clic y Espacio alternan; aria-checked y onValueChange siguen el modo */
export const ToggleTest: Story = {
  args: { onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch', { name: 'Modo oscuro' });
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(sw);
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('dark');
    sw.focus();
    await expect(sw).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(sw).toHaveAttribute('aria-checked', 'false');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('light');
    await userEvent.keyboard('{Enter}');
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(args.onValueChange).toHaveBeenCalledTimes(3);
  },
};

/** Test: controlado, el valor lo manda value; los íconos son decorativos */
export const ControlledTest: Story = {
  args: { value: 'dark', onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch', { name: 'Modo oscuro' });
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(sw);
    await expect(args.onValueChange).toHaveBeenCalledWith('light');
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await expect(canvasElement.querySelectorAll('button svg[aria-hidden="true"]')).toHaveLength(2);
  },
};
