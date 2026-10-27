import { describe, expect, it } from 'vitest';
import { cn } from './cn';

describe('cn: utilidades de tokens (ds-) en conflicto con las de Tailwind', () => {
  it('alto: la última gana', () => {
    expect(cn('h-ds-dimention-field-input-default', 'h-auto')).toBe('h-auto');
    expect(cn('h-auto', 'h-ds-dimention-field-input-default')).toBe('h-ds-dimention-field-input-default');
  });

  it('ancho, size y mínimos', () => {
    expect(cn('w-ds-dimention-field-input-default', 'w-full')).toBe('w-full');
    expect(cn('size-ds-dimention-icono-m', 'size-4')).toBe('size-4');
    expect(cn('min-h-ds-dimention-field-input-default', 'min-h-0')).toBe('min-h-0');
  });

  it('padding: p-0 reemplaza px/py de tokens y py arbitrario reemplaza py de token', () => {
    expect(cn('px-ds-space-field-md py-ds-space-field-sm', 'p-0')).toBe('p-0');
    expect(cn('py-ds-space-field-sm', 'py-[calc(var(--ds-responsive-space-field-sm)-1px)]')).toBe('py-[calc(var(--ds-responsive-space-field-sm)-1px)]');
    expect(cn('pt-ds-space-general-lg', 'pt-0')).toBe('pt-0');
  });

  it('margin', () => {
    expect(cn('mt-ds-space-general-lg', 'mt-0')).toBe('mt-0');
  });

  it('gap: gap reemplaza gap; gap-x refina sin borrar gap', () => {
    expect(cn('gap-ds-space-general-lg', 'gap-ds-space-general-2xl')).toBe('gap-ds-space-general-2xl');
    expect(cn('gap-ds-space-general-lg', 'gap-x-ds-space-general-2xl')).toBe('gap-ds-space-general-lg gap-x-ds-space-general-2xl');
  });

  it('radio y sombra', () => {
    expect(cn('rounded-ds-radius-field-md', 'rounded-ds-radius-field-sm')).toBe('rounded-ds-radius-field-sm');
    expect(cn('rounded-ds-radius-field-md', 'rounded-none')).toBe('rounded-none');
    expect(cn('shadow-ds-on-canva-md', 'shadow-none')).toBe('shadow-none');
  });

  it('colores de token siguen en su grupo (fondo, borde, texto)', () => {
    expect(cn('bg-ds-background-field-burnt-in', 'bg-transparent')).toBe('bg-transparent');
    expect(cn('border-ds-border-field-disabled', 'border-ds-border-field-default')).toBe('border-ds-border-field-default');
    // ancho de borde y color de borde no chocan
    expect(cn('border border-ds-border-field-default', 'border-0')).toBe('border-ds-border-field-default border-0');
  });

  it('tipografía: tamaño, color, alto de línea, familia y peso conviven', () => {
    expect(cn('text-ds-typography-field-size-xs', 'text-ds-text-acent-firts')).toBe('text-ds-typography-field-size-xs text-ds-text-acent-firts');
    expect(cn('font-ds-primitives-typography-family-primary', 'font-ds-primitives-typography-weight-bold')).toBe(
      'font-ds-primitives-typography-family-primary font-ds-primitives-typography-weight-bold'
    );
    expect(cn('leading-ds-typography-field-line-height-xs', 'leading-none')).toBe('leading-none');
  });
});
