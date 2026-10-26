import { describe, expect, it } from 'vitest';
import { closestThumb, directionalKey, pageStep, snapToStep, toPercent, valueForKey } from './Slider.utils';

describe('snapToStep', () => {
  it('redondea al paso desde min y limita al rango', () => {
    expect(snapToStep(26, 0, 100, 5)).toBe(25);
    expect(snapToStep(-3, 0, 100, 1)).toBe(0);
    expect(snapToStep(140, 0, 100, 1)).toBe(100);
    expect(snapToStep(7, 2, 20, 4)).toBe(6);
  });
  it('sin errores de coma flotante', () => {
    expect(snapToStep(0.30000000004, 0, 1, 0.1)).toBe(0.3);
    expect(snapToStep(0.7, 0, 1, 0.1)).toBe(0.7);
  });
  it('no pasa de max cuando el rango no es múltiplo del paso', () => {
    expect(snapToStep(9.9, 0, 10, 3)).toBe(9);
  });
});

describe('toPercent', () => {
  it('convierte a 0–100 y limita', () => {
    expect(toPercent(50, 0, 200)).toBe(25);
    expect(toPercent(-10, 0, 100)).toBe(0);
    expect(toPercent(5, 5, 5)).toBe(0);
  });
});

describe('teclado', () => {
  const bounds = { min: 0, max: 100, step: 1, page: pageStep(0, 100, 1) };
  it('flechas, RePág/AvPág, Inicio/Fin', () => {
    expect(valueForKey('ArrowRight', 10, bounds)).toBe(11);
    expect(valueForKey('ArrowUp', 10, bounds)).toBe(11);
    expect(valueForKey('ArrowLeft', 10, bounds)).toBe(9);
    expect(valueForKey('ArrowDown', 10, bounds)).toBe(9);
    expect(valueForKey('PageUp', 10, bounds)).toBe(20);
    expect(valueForKey('PageDown', 10, bounds)).toBe(0);
    expect(valueForKey('Home', 10, bounds)).toBe(0);
    expect(valueForKey('End', 10, bounds)).toBe(100);
    expect(valueForKey('a', 10, bounds)).toBeNull();
  });
  it('el salto de página es al menos un paso', () => {
    expect(pageStep(0, 10, 5)).toBe(5);
    expect(pageStep(0, 1000, 25)).toBe(100);
  });
});

describe('closestThumb', () => {
  it('elige el pulgar más cercano', () => {
    expect(closestThumb([20, 80], 30, 100)).toBe(0);
    expect(closestThumb([20, 80], 70, 100)).toBe(1);
  });
  it('con los pulgares juntos decide el lado del clic, o el que puede moverse', () => {
    expect(closestThumb([50, 50], 40, 100)).toBe(0);
    expect(closestThumb([50, 50], 60, 100)).toBe(1);
    expect(closestThumb([50, 50], 50, 100)).toBe(1);
    expect(closestThumb([100, 100], 100, 100)).toBe(0);
  });
});

describe('directionalKey', () => {
  it('invierte solo las flechas horizontales de derecha a izquierda', () => {
    expect(directionalKey('ArrowRight', true)).toBe('ArrowLeft');
    expect(directionalKey('ArrowLeft', true)).toBe('ArrowRight');
    expect(directionalKey('ArrowUp', true)).toBe('ArrowUp');
    expect(directionalKey('ArrowRight', false)).toBe('ArrowRight');
  });
});
