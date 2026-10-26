import { describe, expect, it } from 'vitest';
import { countFilterValue, countFilters, omitFilter } from './FilterPanel.utils';

describe('FilterPanel utils', () => {
  it('cuenta listas de opciones por elemento', () => {
    expect(countFilterValue(['a', 'b'])).toBe(2);
    expect(countFilterValue([])).toBe(0);
  });

  it('cuenta rangos, objetos, fechas y escalares como uno', () => {
    expect(countFilterValue([10, 50])).toBe(1);
    expect(countFilterValue({ from: '', to: '20' })).toBe(1);
    expect(countFilterValue({ from: '', to: '' })).toBe(0);
    expect(countFilterValue(new Date(2026, 0, 1))).toBe(1);
    expect(countFilterValue(0)).toBe(1);
    expect(countFilterValue(true)).toBe(1);
    expect(countFilterValue(false)).toBe(0);
    expect(countFilterValue(null)).toBe(0);
    expect(countFilterValue('')).toBe(0);
  });

  it('suma todas las secciones y quita una sin mutar', () => {
    const values = { color: ['rojo', 'azul'], calificacion: 4, envio: false };
    expect(countFilters(values)).toBe(3);
    expect(countFilters(undefined)).toBe(0);
    const next = omitFilter(values, 'color');
    expect(next).toEqual({ calificacion: 4, envio: false });
    expect(values.color).toEqual(['rojo', 'azul']);
  });
});
