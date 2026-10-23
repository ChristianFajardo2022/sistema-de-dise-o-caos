import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { IconStar } from './IconStar';
import type { IconStarSize, IconStarState } from './Rating.types';

const STATES: IconStarState[] = ['default', 'select', 'hover'];
const SIZES: IconStarSize[] = [16, 20, 32];

const meta = {
  title: 'Data Display/Rating/IconStar',
  component: IconStar,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    state: { name: 'state', control: 'radio', options: STATES, type: { name: 'enum', value: STATES }, description: 'state de Figma' },
    size: { name: 'size', control: 'radio', options: SIZES, type: { name: 'enum', value: SIZES }, description: 'size de Figma: 16, 20 o 32' },
  },
  args: { state: 'select', size: 32 },
} satisfies Meta<typeof IconStar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

/** Las 9 variantes del set Icon Star (state × size), cada una una vez. */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="grid grid-cols-[auto_repeat(3,auto)] items-center justify-start gap-x-8 gap-y-6">
        <span />
        {SIZES.map((s) => (
          <span key={s} className="text-xs text-ds-text-neutral-body">size {s}</span>
        ))}
        {STATES.map((st) => (
          <div key={st} className="contents">
            <span className="text-xs text-ds-text-neutral-body">{st}</span>
            {SIZES.map((s) => (
              <IconStar key={s} state={st} size={s} data-figma={`state=${st}, size=${s}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Test: la estrella es decorativa (aria-hidden) */
export const DecorativeTest: Story = {
  tags: ['!autodocs'],
  render: () => <IconStar data-testid="star" state="select" />,
  play: async ({ canvasElement }) => {
    const star = within(canvasElement).getByTestId('star');
    await expect(star).toHaveAttribute('aria-hidden', 'true');
  },
};
