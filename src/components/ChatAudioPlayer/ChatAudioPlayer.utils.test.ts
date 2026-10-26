import { describe, expect, it } from 'vitest';
import { DEFAULT_WAVEFORM, playedBars, resampleWaveform, visibleBarCount } from './ChatAudioPlayer.utils';

describe('visibleBarCount', () => {
  it('cuenta barras de 3 con separación de 3', () => {
    expect(visibleBarCount(3)).toBe(1);
    expect(visibleBarCount(9)).toBe(2);
    expect(visibleBarCount(417)).toBe(70);
    expect(visibleBarCount(0)).toBe(0);
  });
});

describe('resampleWaveform', () => {
  it('reduce la onda a las barras visibles y conserva el principio y el orden', () => {
    const bars = resampleWaveform(DEFAULT_WAVEFORM, 70);
    expect(bars).toHaveLength(70);
    expect(bars[0]).toBe(DEFAULT_WAVEFORM[0]);
    expect(bars[69]).toBe(DEFAULT_WAVEFORM[Math.floor((69 * 179) / 70)]);
  });

  it('no estira una onda que ya cabe', () => {
    const short = [0.2, 0.5, 1];
    expect(resampleWaveform(short, 10)).toBe(short);
    expect(resampleWaveform(short, 0)).toBe(short);
  });
});

describe('playedBars sobre las barras visibles', () => {
  it('50 % del audio con 70 barras visibles enciende 35', () => {
    const visible = resampleWaveform(DEFAULT_WAVEFORM, visibleBarCount(417));
    expect(playedBars(visible.length, 37, 74)).toBe(35);
  });

  it('sin duración no enciende ninguna', () => {
    expect(playedBars(70, 10, 0)).toBe(0);
  });
});
