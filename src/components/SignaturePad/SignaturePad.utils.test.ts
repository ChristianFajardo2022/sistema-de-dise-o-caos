import { describe, expect, it, vi } from 'vitest';
import { drawStroke, drawStrokes, isSamePoint, isSignatureEmpty, toNormalizedPoint } from './SignaturePad.utils';
import type { StrokeContext } from './SignaturePad.utils';

const fakeCtx = () =>
  ({
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    stroke: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    clearRect: vi.fn(),
  }) satisfies StrokeContext;

describe('isSignatureEmpty', () => {
  it('vacío sin trazos o con trazos sin puntos', () => {
    expect(isSignatureEmpty(undefined)).toBe(true);
    expect(isSignatureEmpty([])).toBe(true);
    expect(isSignatureEmpty([[]])).toBe(true);
    expect(isSignatureEmpty([[[0.1, 0.2]]])).toBe(false);
  });
});

describe('toNormalizedPoint', () => {
  it('normaliza y limita al área', () => {
    expect(toNormalizedPoint(50, 25, 100, 50)).toEqual([0.5, 0.5]);
    expect(toNormalizedPoint(-10, 80, 100, 50)).toEqual([0, 1]);
    expect(toNormalizedPoint(5, 5, 0, 0)).toEqual([0, 0]);
  });
});

describe('isSamePoint', () => {
  it('compara coordenadas', () => {
    expect(isSamePoint([0.1, 0.2], [0.1, 0.2])).toBe(true);
    expect(isSamePoint([0.1, 0.2], [0.1, 0.3])).toBe(false);
    expect(isSamePoint(undefined, [0, 0])).toBe(false);
  });
});

describe('drawStroke', () => {
  it('un punto es un círculo relleno', () => {
    const ctx = fakeCtx();
    drawStroke(ctx, [[0.5, 0.5]], 200, 100, 4);
    expect(ctx.arc).toHaveBeenCalledWith(100, 50, 2, 0, Math.PI * 2);
    expect(ctx.fill).toHaveBeenCalled();
    expect(ctx.stroke).not.toHaveBeenCalled();
  });
  it('dos puntos son una recta', () => {
    const ctx = fakeCtx();
    drawStroke(ctx, [[0, 0], [1, 1]], 200, 100, 4);
    expect(ctx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(ctx.lineTo).toHaveBeenCalledWith(200, 100);
    expect(ctx.quadraticCurveTo).not.toHaveBeenCalled();
  });
  it('tres o más puntos se suavizan por los puntos medios', () => {
    const ctx = fakeCtx();
    drawStroke(ctx, [[0, 0], [0.5, 1], [1, 0]], 100, 100, 4);
    expect(ctx.quadraticCurveTo).toHaveBeenCalledWith(50, 100, 75, 50);
    expect(ctx.lineTo).toHaveBeenCalledWith(100, 0);
  });
});

describe('drawStrokes', () => {
  it('limpia y aplica color y grosor', () => {
    const ctx = fakeCtx() as StrokeContext;
    drawStrokes(ctx, [[[0, 0], [1, 1]]], 10, 10, '#123456', 3);
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 10, 10);
    expect(ctx.strokeStyle).toBe('#123456');
    expect(ctx.lineWidth).toBe(3);
    expect(ctx.lineCap).toBe('round');
  });
});
