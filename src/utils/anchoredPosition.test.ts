import { describe, expect, it } from 'vitest';
import { computeAnchoredPlacement, computeAnchoredPosition } from './anchoredPosition';

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

// Paneles con flecha (Tooltip y Popover): antes en `Tooltip/overlayPosition`, mismos casos con las opciones nuevas
describe('computeAnchoredPlacement (paneles con flecha)', () => {
  const vp = { width: 400, height: 600 };
  const at = (left: number, top: number, width = 40, height = 40) => ({ top, bottom: top + height, left, right: left + width, width, height });
  const panel = { width: 100, height: 50 };
  const arrow = { offset: 4, overflow: 'none', arrowInset: 16 } as const;

  it('abajo y centrado: la flecha queda en el centro del panel', () => {
    expect(computeAnchoredPlacement(at(180, 100), panel, vp, { ...arrow, side: 'bottom', align: 'center' })).toEqual({
      left: 150,
      top: 144,
      maxHeight: null,
      side: 'bottom',
      align: 'center',
      arrowOffset: 50,
    });
  });

  it('pasa arriba si abajo no cabe', () => {
    const pos = computeAnchoredPlacement(at(180, 540), panel, vp, { ...arrow, side: 'bottom', align: 'center' });
    expect(pos.side).toBe('top');
    expect(pos.top).toBe(540 - 4 - 50);
  });

  it('centrado junto al borde: el panel no se sale y la flecha sigue al ancla', () => {
    const pos = computeAnchoredPlacement(at(0, 100, 20), panel, vp, { ...arrow, side: 'bottom', align: 'center' });
    expect(pos.left).toBe(8);
    // centro del ancla en x = 10 -> 2 px dentro del panel, limitado a la distancia mínima
    expect(pos.arrowOffset).toBe(16);
  });

  it('esquina (alignTo center): la punta sobre el centro del ancla; cambia de alineación si no cabe', () => {
    const corner = { ...arrow, side: 'bottom', align: 'start', alignTo: 'center', flipAlign: true } as const;
    expect(computeAnchoredPlacement(at(100, 100), panel, vp, corner)).toMatchObject({ left: 120, align: 'start', arrowOffset: null });
    expect(computeAnchoredPlacement(at(340, 100), panel, vp, corner)).toMatchObject({ left: 360 - 100, align: 'end' });
  });

  it('lados laterales: a la derecha o a la izquierda, centrado en vertical', () => {
    const right = computeAnchoredPlacement(at(100, 200), panel, vp, { ...arrow, side: 'right', align: 'center' });
    expect(right).toEqual({ left: 144, top: 195, maxHeight: null, side: 'right', align: 'center', arrowOffset: 25 });
    const flipped = computeAnchoredPlacement(at(300, 200), panel, vp, { ...arrow, side: 'right', align: 'center' });
    expect(flipped).toMatchObject({ side: 'left', left: 300 - 4 - 100 });
  });

  it('sin espacio en ningún lado: el que tenga más, sin limitar el alto', () => {
    const pos = computeAnchoredPlacement(at(100, 30, 40, 520), { width: 100, height: 200 }, vp, { ...arrow, side: 'top', align: 'center' });
    expect(pos).toMatchObject({ side: 'bottom', maxHeight: null });
  });
});

describe('computeAnchoredPlacement (valores por defecto = DropdownMenu, Select, DatePicker)', () => {
  it('devuelve también el lado y la alineación usados, sin flecha', () => {
    const pos = computeAnchoredPlacement(anchorAt(500), { width: 200, height: 200 }, viewport, { offset: 8 });
    expect(pos).toEqual({ left: 20, top: 292, maxHeight: null, side: 'top', align: 'start', arrowOffset: null });
  });

  it('sin flipAlign, start/end solo se recortan contra el borde', () => {
    const pos = computeAnchoredPlacement(anchorAt(100, 300), { width: 200, height: 100 }, viewport, { offset: 8 });
    expect(pos).toMatchObject({ left: 375 - 200 - 8, align: 'start' });
  });
});
