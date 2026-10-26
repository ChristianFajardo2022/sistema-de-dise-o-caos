import { describe, expect, it } from 'vitest';
import { SOLID_MASK, maskStyle, notchMask } from './mask';

/** Máscara anterior a `radius` (solo 2xl, radio cóncavo `a - v`): referencia para que las tarjetas no cambien. */
function legacyNotchMask(a: number, v: number) {
  const c = a - v;
  return maskStyle([
    [SOLID_MASK, `calc(100% - ${a + v}px) 100%`, 'left top'],
    [SOLID_MASK, `100% calc(100% - ${a + v}px)`, 'left bottom'],
    [`radial-gradient(circle at 0 100%,#000 ${v - 0.5}px,transparent ${v + 0.5}px)`, `${v}px ${v}px`, `right ${a}px top 0`],
    [SOLID_MASK, `${v}px ${a}px`, `right ${a}px top ${v}px`],
    [`radial-gradient(circle at 100% 0,transparent ${c - 0.5}px,#000 ${c + 0.5}px)`, `${c}px ${c}px`, `right ${v}px top ${v}px`],
    [SOLID_MASK, `${c}px ${v}px`, `right ${v}px top ${a}px`],
    [`radial-gradient(circle at 0 100%,#000 ${v - 0.5}px,transparent ${v + 0.5}px)`, `${v}px ${v}px`, `right 0 top ${a}px`],
  ]);
}

describe('notchMask', () => {
  it('radius 2xl: misma máscara que antes en las tres muescas (exterior e interior)', () => {
    for (const a of [40, 48, 54]) {
      expect(notchMask(a, a / 2)).toEqual(legacyNotchMask(a, a / 2));
      expect(notchMask(a, a / 2, a / 2)).toEqual(legacyNotchMask(a, a / 2));
      // Capa interior: convexas v - 1, cóncava v + 1
      expect(notchMask(a, a / 2 - 1, a / 2 + 1)).toEqual(legacyNotchMask(a, a / 2 - 1));
    }
  });

  it('radius xl: convexas y cóncava de 16 con el tramo recto del fondo de la muesca', () => {
    const style = notchMask(48, 16, 16);
    const images = String(style.maskImage).split(/,(?=linear|radial)/);
    const positions = String(style.maskPosition).split(',');
    expect(images).toHaveLength(8);
    // Curva cóncava con centro a 32 del borde derecho y 32 del superior (48 - 16)
    expect(images[4]).toContain('transparent 15.5px');
    expect(positions[4]).toBe('right 32px top 32px');
    // Tramo recto de 16 entre la curva cóncava y la esquina del borde derecho
    expect(String(style.maskSize).split(',')[6]).toBe('16px 16px');
    expect(positions[6]).toBe('right 16px top 48px');
  });
});
