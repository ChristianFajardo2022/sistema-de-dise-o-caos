import { describe, expect, it } from 'vitest';
import { computeAnchoredPosition } from './anchoredPosition';

const viewport = { width: 375, height: 667 };
const anchorAt = (top: number, left = 20, width = 200, height = 56) => ({ top, bottom: top + height, left, right: left + width, width });

describe('computeAnchoredPosition', () => {
  it('abre abajo cuando cabe, alineado al inicio', () => {
    expect(computeAnchoredPosition(anchorAt(100), { width: 200, height: 100 }, viewport, { offset: 8 })).toEqual({ left: 20, top: 164, maxHeight: null });
  });

  it('align end: borde derecho con el del ancla', () => {
    expect(computeAnchoredPosition(anchorAt(100), { width: 120, height: 100 }, viewport, { offset: 4, align: 'end' }).left).toBe(100);
  });

  it('no se sale por la izquierda ni por la derecha', () => {
    expect(computeAnchoredPosition(anchorAt(100, 300), { width: 200, height: 100 }, viewport, { offset: 8 }).left).toBe(375 - 200 - 8);
    expect(computeAnchoredPosition(anchorAt(100, 20, 50), { width: 200, height: 100 }, viewport, { offset: 8, align: 'end' }).left).toBe(8);
  });

  it('pasa arriba si abajo no cabe', () => {
    const pos = computeAnchoredPosition(anchorAt(500), { width: 200, height: 200 }, viewport, { offset: 8 });
    expect(pos).toEqual({ left: 20, top: 500 - 8 - 200, maxHeight: null });
  });

  it('side top: arriba si cabe; abajo si solo cabe abajo', () => {
    expect(computeAnchoredPosition(anchorAt(300), { width: 200, height: 100 }, viewport, { offset: 4, side: 'top' }).top).toBe(196);
    expect(computeAnchoredPosition(anchorAt(50), { width: 200, height: 100 }, viewport, { offset: 4, side: 'top' }).top).toBe(110);
  });

  it('no cabe en ningún lado: el lado con más espacio y el alto limitado (caso del calendario en móvil)', () => {
    // Campo en y=348, calendario de 479: abajo quedan 667-8-412=247, arriba 348-8-8=332
    const pos = computeAnchoredPosition(anchorAt(348), { width: 320, height: 479 }, viewport, { offset: 8 });
    expect(pos).toEqual({ left: 20, top: 8, maxHeight: 332 });
    const low = computeAnchoredPosition(anchorAt(150), { width: 320, height: 479 }, viewport, { offset: 8 });
    expect(low).toEqual({ left: 20, top: 214, maxHeight: 667 - 8 - 214 });
  });
});
