import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { matchesMedia, useMediaQuery } from './useMediaQuery';

afterEach(() => vi.unstubAllGlobals());

describe('matchesMedia', () => {
  it('lee el valor actual de la consulta', () => {
    vi.stubGlobal('window', { matchMedia: vi.fn(() => ({ matches: true })) });
    expect(matchesMedia('(width < 10px)')).toBe(true);
  });

  it('sin matchMedia devuelve false', () => {
    vi.stubGlobal('window', {});
    expect(matchesMedia('(width < 10px)')).toBe(false);
  });
});

describe('useMediaQuery', () => {
  const Probe = ({ serverValue }: { serverValue?: boolean }) =>
    createElement('span', null, String(useMediaQuery('(width < 10px)', serverValue)));

  it('en servidor devuelve el valor por defecto', () => {
    expect(renderToString(createElement(Probe))).toContain('false');
    expect(renderToString(createElement(Probe, { serverValue: true }))).toContain('true');
  });
});
