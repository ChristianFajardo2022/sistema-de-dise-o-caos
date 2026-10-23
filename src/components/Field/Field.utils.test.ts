import { describe, expect, it } from 'vitest';
import { fieldIds, joinIds, resolveField } from './Field.utils';

describe('joinIds', () => {
  it('une, quita vacíos y repetidos', () => {
    expect(joinIds('a', undefined, false, 'b a', '', null)).toBe('a b');
    expect(joinIds(undefined, false)).toBeUndefined();
  });
});

describe('resolveField', () => {
  it('prioridad visual: disabled > error > success > burnt-in > state', () => {
    expect(resolveField({ disabled: true, errorText: 'x' }).visualState).toBe('disabled');
    expect(resolveField({ errorText: 'x', successText: 'y' }).visualState).toBe('error');
    expect(resolveField({ successText: 'y', readOnly: true }).visualState).toBe('success');
    expect(resolveField({ readOnly: true, state: 'active' }).visualState).toBe('burnt-in');
    expect(resolveField({ state: 'filled' }).visualState).toBe('filled');
    expect(resolveField({}).visualState).toBe('default');
  });

  it('los estados forzados cuentan como reales', () => {
    expect(resolveField({ state: 'disabled' }).isDisabled).toBe(true);
    expect(resolveField({ state: 'burnt-in' }).isReadOnly).toBe(true);
    expect(resolveField({ state: 'error' }).isError).toBe(true);
    expect(resolveField({ state: 'success' }).isSuccess).toBe(true);
  });

  it('mensaje: error > éxito > ayuda, con el state de NotificationText', () => {
    expect(resolveField({ errorText: 'e', successText: 's', helperText: 'h' }).message).toEqual({ kind: 'error', text: 'e' });
    expect(resolveField({ successText: 's', helperText: 'h' }).message).toEqual({ kind: 'confirmation', text: 's' });
    expect(resolveField({ helperText: 'h' }).message).toEqual({ kind: 'helper', text: 'h' });
    expect(resolveField({}).message).toBeNull();
  });
});

describe('fieldIds', () => {
  it('derivan del id del control', () => {
    expect(fieldIds('c')).toEqual({ control: 'c', label: 'c-label', message: 'c-message', tooltip: 'c-tooltip' });
  });
});
