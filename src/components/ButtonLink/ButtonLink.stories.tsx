import type { Meta, StoryObj } from '@storybook/react';
import { ButtonLink } from './ButtonLink';
import type { ButtonLinkState } from './ButtonLink.types';

const meta: Meta<typeof ButtonLink> = {
  title: 'General Controls/Button link',
  component: ButtonLink,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'press', 'inactive'],
      description: 'State forzado (hover, focus y press solo para visualización)',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado inactive: sin href y con aria-disabled',
    },
    iconRight: {
      control: 'boolean',
      description: 'Icon right: ícono de enlace externo después del texto',
    },
  },
  args: {
    children: 'Button',
    href: '#',
    state: 'default',
    disabled: false,
    iconRight: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATES: ButtonLinkState[] = ['default', 'hover', 'focus', 'press', 'inactive'];

export const Default: Story = {};

export const WithoutIcon: Story = {
  args: { iconRight: false },
};

export const Inactive: Story = {
  args: { disabled: true },
};

/** Los 5 estados del component set de Figma, con y sin ícono. */
export const StatesMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-[auto_repeat(5,auto)] items-center gap-x-8 gap-y-4">
      <span />
      {STATES.map((s) => (
        <span key={s} className="text-xs text-ds-text-neutral-body">{s}</span>
      ))}
      {[true, false].map((iconRight) => (
        <div key={String(iconRight)} className="contents">
          <span className="text-xs text-ds-text-neutral-body">{iconRight ? 'Icon right' : 'Sin ícono'}</span>
          {STATES.map((s) => (
            <div key={s}>
              <ButtonLink href="#" state={s} iconRight={iconRight}>Button</ButtonLink>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
