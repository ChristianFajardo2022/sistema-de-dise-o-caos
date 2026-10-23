import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { NotificationText } from './NotificationText';
import type { NotificationTextState } from './NotificationText.types';

const STATE_OPTIONS: NotificationTextState[] = ['error', 'helper', 'confirmation', 'information'];

const meta = {
  title: 'Form Controls/NotificationText',
  component: NotificationText,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    state: {
      name: 'state',
      control: 'radio',
      options: STATE_OPTIONS,
      type: { name: 'enum', value: STATE_OPTIONS },
      description: 'State de Figma: Error, Helper text, Confirmation o Information',
    },
    announce: {
      name: 'announce',
      control: 'boolean',
      type: { name: 'boolean' },
      description: 'Error usa role="alert" y confirmation role="status"; con false no añade rol',
    },
    children: { control: 'text', type: { name: 'string' }, description: 'Prop Text helper de Figma' },
  },
  args: { state: 'helper', announce: true, children: 'Texto de ayuda' },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NotificationText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

const VARIANTS: { state: NotificationTextState; figma: string; text: string }[] = [
  { state: 'error', figma: 'Error', text: 'Error text' },
  { state: 'helper', figma: 'Helper text', text: 'Helper text' },
  { state: 'confirmation', figma: 'Confirmation', text: 'Confirmation text' },
  { state: 'information', figma: 'Information', text: 'Information text' },
];

/** Las 4 variantes de Figma (State), cada una una vez, sobre la superficie del tema. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="flex flex-col gap-4">
        {VARIANTS.map((v) => (
          <div key={v.state} className="flex items-center gap-8">
            <span className="w-24 text-xs text-ds-text-neutral-body">{v.state}</span>
            <div className="w-[202.33px]">
              <NotificationText state={v.state} announce={false} data-figma={`State=${v.figma}`}>
                {v.text}
              </NotificationText>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Test: error se anuncia con role="alert" (sin aria-live duplicado); announce=false quita el rol */
export const RolesTest: Story = {
  tags: ['!autodocs'],
  decorators: [],
  render: () => (
    <div>
      <NotificationText state="error">Correo no válido</NotificationText>
      <NotificationText state="confirmation">Guardado</NotificationText>
      <NotificationText state="helper" data-testid="helper">Usa tu correo de trabajo</NotificationText>
      <NotificationText state="error" announce={false} data-testid="silent">Sin anuncio</NotificationText>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alert = canvas.getByRole('alert');
    await expect(alert).toHaveTextContent('Correo no válido');
    await expect(alert).not.toHaveAttribute('aria-live');
    await expect(canvas.getByRole('status')).toHaveTextContent('Guardado');
    await expect(canvas.getByTestId('helper')).not.toHaveAttribute('role');
    await expect(canvas.getByTestId('silent')).not.toHaveAttribute('role');
    await expect(canvas.getAllByRole('alert')).toHaveLength(1);
  },
};
