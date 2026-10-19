import type { Meta, StoryObj } from '@storybook/react';
import { Subtract } from './Subtract';

const meta = {
  title: 'Components/Subtract',
  component: Subtract,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Subtract>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-start gap-8 rounded-2xl bg-white p-6 text-left text-[#1d1c1c]">
      <Subtract width={184} />
      <dl className="m-0 grid gap-4 text-sm">
        <div>
          <dt className="font-semibold">background/container/default-on-canva</dt>
          <dd className="m-0 flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-4 w-4 rounded border border-black/10 bg-[#1d1c1c]"
            />
            #1D1C1C
          </dd>
        </div>
        <div>
          <dt className="font-semibold">radius/general/2xl</dt>
          <dd className="m-0">24 px</dd>
        </div>
      </dl>
    </div>
  ),
};
