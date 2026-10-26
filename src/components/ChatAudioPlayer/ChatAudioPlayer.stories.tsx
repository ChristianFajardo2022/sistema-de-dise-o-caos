import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { ChatAudioPlayer } from './ChatAudioPlayer';

const meta = {
  title: 'Data Display/ChatAudioPlayer',
  component: ChatAudioPlayer,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    duration: { control: { type: 'number', min: 0 }, type: { name: 'number' }, description: 'Duración en segundos' },
    defaultCurrentTime: { control: { type: 'number', min: 0 }, type: { name: 'number' } },
    buttonVariant: {
      control: 'inline-radio',
      options: ['secondary', 'primary'],
      type: { name: 'enum', value: ['secondary', 'primary'] },
    },
    buttonPosition: {
      control: 'inline-radio',
      options: ['start', 'end'],
      type: { name: 'enum', value: ['start', 'end'] },
    },
  },
  args: { duration: 74, defaultCurrentTime: 0, buttonVariant: 'secondary', buttonPosition: 'start' },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[522px] rounded-ds-radius-general-full bg-ds-background-general-gray-seventh px-ds-space-general-2xl py-ds-space-general-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatAudioPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground (presentación: sin `src`, el botón alterna el estado y la onda mueve la posición). */
export const Interactive: Story = {
  args: { onPlayingChange: fn(), onCurrentTimeChange: fn() },
};

/** Reproducción simulada (controlado): el avance pinta las barras reproducidas. */
function PlaybackDemo() {
  const duration = 30;
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setTime((t) => {
        if (t + 1 >= duration) {
          setPlaying(false);
          return duration;
        }
        return t + 1;
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [playing]);
  return (
    <ChatAudioPlayer
      duration={duration}
      currentTime={time}
      onCurrentTimeChange={setTime}
      playing={playing}
      onPlayingChange={(next) => {
        if (next && time >= duration) setTime(0);
        setPlaying(next);
      }}
      waveform={Array.from({ length: 60 }, (_, i) => 0.3 + 0.7 * Math.abs(Math.sin(i * 0.7)))}
    />
  );
}

export const Playback: Story = { render: () => <PlaybackDemo /> };

/** Botón primary (composer móvil de Figma). */
export const PrimaryButton: Story = { args: { buttonVariant: 'primary', defaultCurrentTime: 20 } };

/** Test: el botón cambia de nombre al reproducir; la onda es un slider con valor legible. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { duration: 20, onPlayingChange: fn(), onCurrentTimeChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const play = canvas.getByRole('button', { name: 'Reproducir audio' });
    await expect(play).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onPlayingChange).toHaveBeenLastCalledWith(true);
    await expect(canvas.getByRole('button', { name: 'Pausar audio' })).toBeInTheDocument();
    await userEvent.tab();
    const seek = canvas.getByRole('slider', { name: 'Posición del audio' });
    await expect(seek).toHaveFocus();
    // Las flechas, Inicio y Fin las resuelve el range nativo (el teclado simulado no lo mueve): se prueba su cambio
    fireEvent.change(seek, { target: { value: '2' } });
    await expect(seek).toHaveAttribute('aria-valuetext', '0:02 de 0:20');
    await expect(args.onCurrentTimeChange).toHaveBeenLastCalledWith(2);
    await expect(seek).toHaveAttribute('max', '20');
    await expect(seek).toHaveAttribute('step', '1');
  },
};

/** Test: la onda se reduce a las barras que caben y la mitad del audio enciende la mitad de la onda visible. */
export const WaveProgressTest: Story = {
  tags: ['!autodocs'],
  args: { duration: 74, defaultCurrentTime: 37 },
  render: (args) => (
    <div className="w-[520px]">
      <ChatAudioPlayer {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const wave = canvasElement.querySelector<HTMLElement>('[data-figma-part="Onda de audio"]')!;
    await waitFor(() => expect(wave.querySelectorAll('span').length).toBeLessThan(179));
    const bars = [...wave.querySelectorAll('span')];
    // Todas las barras caben en el ancho (3 + separación 3)
    await expect(bars.length * 6 - 3).toBeLessThanOrEqual(wave.clientWidth);
    const played = bars.filter((bar) => bar.className.includes('bg-ds-background-acent-tertiary')).length;
    await expect(played).toBe(Math.round(bars.length / 2));
    // La última barra visible queda dentro de la onda (no recortada)
    await expect(bars[bars.length - 1].getBoundingClientRect().right).toBeLessThanOrEqual(wave.getBoundingClientRect().right + 0.5);
  },
};
