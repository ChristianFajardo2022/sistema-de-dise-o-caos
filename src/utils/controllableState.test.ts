import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { controllableModeWarning, isControlledState, useControllableState } from './controllableState';
import type { ControllableStateOptions } from './controllableState';

/** Renderiza el hook una vez (sin DOM) y devuelve el valor y el setter del primer render. */
function renderHook<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void, options?: string | ControllableStateOptions) {
  let result: { value: T; set: (next: T) => void } | undefined;
  const report = (current: T, set: (next: T) => void) => {
    result = { value: current, set };
  };
  function Probe({ onRender }: { onRender: typeof report }) {
    const [current, set] = useControllableState(value, defaultValue, onChange, options);
    onRender(current, set);
    return null;
  }
  renderToString(createElement(Probe, { onRender: report }));
  return result!;
}

describe('isControlledState', () => {
  it('sin opción: controlado si el valor no es undefined', () => {
    expect(isControlledState('a')).toBe(true);
    expect(isControlledState(null)).toBe(true);
    expect(isControlledState(undefined)).toBe(false);
  });

  it('con `controlled`, manda la opción', () => {
    expect(isControlledState(undefined, true)).toBe(true);
    expect(isControlledState('a', false)).toBe(false);
  });
});

describe('controllableModeWarning', () => {
  it('nombra al componente y el sentido del cambio', () => {
    expect(controllableModeWarning('FilterSection', true)).toMatch(/^FilterSection: el componente pasó de controlado a no controlado/);
    expect(controllableModeWarning('useControllableState', false)).toMatch(/no controlado a controlado/);
  });
});

describe('useControllableState', () => {
  it('controlado: devuelve el valor y avisa del cambio sin tocar el estado', () => {
    const onChange = vi.fn();
    const { value, set } = renderHook<string>('b', 'a', onChange);
    expect(value).toBe('b');
    set('c');
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('no controlado: parte de defaultValue y llama a onChange', () => {
    const onChange = vi.fn();
    const { value, set } = renderHook<string | undefined>(undefined, 'a', onChange);
    expect(value).toBe('a');
    set('z');
    expect(onChange).toHaveBeenCalledWith('z');
  });

  it('controlado con undefined y `controlled: true`: undefined es el valor, no el defecto', () => {
    const { value } = renderHook<string | undefined>(undefined, 'a', undefined, { controlled: true, name: 'Prueba' });
    expect(value).toBeUndefined();
  });

  it('el 4.º argumento acepta solo el nombre', () => {
    const { value } = renderHook<string | undefined>(undefined, 'a', undefined, 'Prueba');
    expect(value).toBe('a');
  });
});
