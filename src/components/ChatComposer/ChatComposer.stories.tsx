import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import { ChatComposer } from './ChatComposer';
import { Button } from '../Button';
import { ChatAudioPlayer } from '../ChatAudioPlayer';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/Icon.types';

const meta = {
  title: 'Data Display/ChatComposer',
  component: ChatComposer,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text', type: { name: 'string' } },
    label: { control: 'text', type: { name: 'string' }, description: 'Etiqueta sr-only del campo' },
    touch: { control: 'boolean', type: { name: 'boolean' }, description: 'Botones grandes (composer móvil)' },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
  },
  args: { placeholder: 'Escribe un mensaje...', label: 'Mensaje', touch: false, disabled: false },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[618px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

const action = (icon: IconName, label: string, touch = false) => (
  <Button
    iconOnly
    variant="secondary"
    size={touch ? 'sm' : 'xs'}
    aria-label={label}
    className={touch ? undefined : '[&_[data-slot=icon]]:size-4'}
  >
    <Icon name={icon} size={touch ? 20 : 16} variant="fill" data-figma-part="Icon-sizes" />
  </Button>
);

const attachments = (
  <>
    {action('folder', 'Adjuntar documento')}
    {action('image', 'Adjuntar imagen')}
  </>
);

/** Playground: Enter envía, Shift+Enter hace un salto de línea. */
export const Interactive: Story = {
  args: { onSend: fn(), onRecord: fn() },
};

/** Con adjuntos (State=Default de Figma). */
export const WithAttachments: Story = {
  args: { onSend: fn(), onRecord: fn(), attachments },
};

/** Audio grabado listo para enviar con reproducir a la izquierda (ya no está en el set de Figma). */
export const WithAudio: Story = {
  args: {
    onRecord: fn(),
    onSendAudio: fn(),
    attachments,
    audio: <ChatAudioPlayer duration={42} />,
  },
};

/** Composer móvil (`touch`): botones de 40 e ícono `add` como adjunto. */
export const Touch: Story = {
  args: {
    touch: true,
    onRecord: fn(),
    onSendAudio: fn(),
    attachments: action('add-2', 'Adjuntar', true),
    audio: <ChatAudioPlayer duration={42} buttonVariant="primary" />,
  },
  decorators: [
    (Story) => (
      <div className="w-[344px]">
        <Story />
      </div>
    ),
  ],
};

/** Lista de mensajes enviados (controlado). */
function SendDemo() {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-4">
      <ChatComposer
        value={value}
        onValueChange={setValue}
        onSend={(m) => {
          setSent((list) => [...list, m]);
          setValue('');
        }}
        onRecord={() => {}}
      />
      <ol aria-label="Enviados" className="m-0 flex list-decimal flex-col gap-1 pl-6 text-sm whitespace-pre-wrap text-ds-text-neutral-body">
        {sent.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ol>
    </div>
  );
}

export const Controlled: Story = { render: () => <SendDemo /> };

const FIGMA: { name: string; render: (name: string) => ReactNode }[] = [
  { name: 'State=Default', render: (name) => <ChatComposer data-figma={name} onRecord={() => {}} attachments={attachments} /> },
  {
    name: 'State=State3',
    render: (name) => (
      <ChatComposer
        data-figma={name}
        attachments={attachments}
        audio={<ChatAudioPlayer duration={1214} defaultCurrentTime={(1214 * 10) / 179} buttonPosition="end" />}
      />
    ),
  },
];

/**
 * Las dos variantes de Figma (1269 de ancho), en orden.
 */
export const FigmaMatrix: Story = {
  decorators: [(Story) => <Story />],
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de ChatComposer" className="max-w-full overflow-x-auto">
        <div className="flex w-[1269px] flex-col gap-6">
          {FIGMA.map((v, i) => (
            <div key={i}>{v.render(v.name)}</div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: campo con etiqueta, Enter envía, Shift+Enter no, y el campo se vacía al enviar. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { onSend: fn(), onRecord: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole('textbox', { name: 'Mensaje' });
    await userEvent.click(field);
    await userEvent.keyboard('Hola{Shift>}{Enter}{/Shift}mundo');
    await expect(field).toHaveValue('Hola\nmundo');
    await expect(args.onSend).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSend).toHaveBeenCalledWith('Hola\nmundo');
    await expect(field).toHaveValue('');
    // Vacío no envía
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar mensaje' }));
    await expect(args.onSend).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Grabar audio' }));
    await expect(args.onRecord).toHaveBeenCalledTimes(1);
  },
};

/** Test: el Enter que confirma un IME en Safari (keyCode 229, `isComposing` falso) no envía. */
export const ImeEnterTest: Story = {
  tags: ['!autodocs'],
  args: { onSend: fn() },
  play: async ({ canvasElement, args }) => {
    const field = within(canvasElement).getByRole('textbox', { name: 'Mensaje' });
    await userEvent.click(field);
    await userEvent.keyboard('Hola');
    fireEvent.keyDown(field, { key: 'Enter', code: 'Enter', keyCode: 229 });
    await expect(args.onSend).not.toHaveBeenCalled();
    fireEvent.keyDown(field, { key: 'Enter', code: 'Enter', keyCode: 13 });
    await expect(args.onSend).toHaveBeenCalledWith('Hola');
  },
};
