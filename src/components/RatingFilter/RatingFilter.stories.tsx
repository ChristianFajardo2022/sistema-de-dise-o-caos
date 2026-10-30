import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { RatingFilter } from './RatingFilter';

const meta = {
  title: 'Form Controls/RatingFilter',
  component: RatingFilter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [(Story, { parameters }) => (parameters.sinMarco ? <Story /> : <div className="w-76"><Story /></div>)],
  argTypes: {
    disabled: { control: 'boolean', type: { name: 'boolean' } },
    defaultValue: { control: 'number' },
  },
  args: { label: 'Calificación mínima', disabled: false },
} satisfies Meta<typeof RatingFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = { args: { defaultValue: 3 } };

export const WithoutFilter: Story = { args: { defaultValue: null } };

/** Type=Default (sin filtro) y Type=1…4 de Figma (= 2…5 estrellas). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded', sinMarco: true },
  render: () => (
    <div className="flex flex-wrap gap-8 bg-ds-background-general-black p-6">
      {(['Default', '1', '2', '3', '4'] as const).map((type) => (
        <div key={type} className="flex flex-col gap-2">
          <span className="text-xs text-ds-text-neutral-body">Type={type}</span>
          <RatingFilter
            className="w-75 max-w-full"
            value={type === 'Default' ? null : Number(type) + 1}
            label={`Calificación ${type}`}
            data-figma={`Type=${type}`}
          />
        </div>
      ))}
    </div>
  ),
};

/** Test: el slider es el control (flechas, Inicio, Fin) y las estrellas se pueden pulsar con el puntero. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { defaultValue: null, onValueChange: fn() },
  play: async ({ args, canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', { name: 'Calificación mínima' });
    await expect(slider).toHaveAttribute('aria-valuetext', 'Sin filtro');
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(2);
    await expect(slider).toHaveAttribute('aria-valuetext', '2 estrellas o más');
    await userEvent.keyboard('{End}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(5);
    // Inicio vuelve a "Sin filtro" (no existe "1 estrella o más": toda calificación es ≥ 1)
    await userEvent.keyboard('{Home}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    await expect(slider).toHaveAttribute('aria-valuetext', 'Sin filtro');
    // Clic en una estrella: atajo con puntero
    const stars = canvasElement.querySelector('[data-figma-part="Star rating"]')!;
    await userEvent.click(stars.children[2] as HTMLElement);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(3);
    await expect(slider).toHaveAttribute('aria-valuetext', '3 estrellas o más');
    // La primera estrella equivale a la primera posición: sin filtro
    await userEvent.click(stars.children[0] as HTMLElement);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    await expect(slider).toHaveAttribute('aria-valuetext', 'Sin filtro');
  },
};
