import { describe, expect, it } from 'vitest';
import { defaultRejectionMessage, describeAccept, filterFiles, formatFileSize, matchesAccept } from './FileDropzone.utils';

const file = (name: string, type: string, size = 10) => ({ name, type, size }) as File;

describe('formatFileSize', () => {
  it('usa base 1024 y quita decimales sobrantes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(800 * 1024)).toBe('800 KB');
    expect(formatFileSize(23 * 1024 ** 3)).toBe('23 GB');
    expect(formatFileSize(1.5 * 1024 ** 2)).toBe('1,5 MB');
  });
});

describe('describeAccept', () => {
  it('traduce extensiones, MIME y comodines', () => {
    expect(describeAccept('.pdf, .jpg')).toBe('PDF, JPG');
    expect(describeAccept('image/*,application/pdf')).toBe('Imágenes, PDF');
    expect(describeAccept('.png,image/png')).toBe('PNG');
    expect(describeAccept(undefined)).toBe('');
  });
});

describe('matchesAccept', () => {
  it('valida extensión sin importar mayúsculas, MIME exacto y comodín', () => {
    expect(matchesAccept(file('A.PDF', ''), '.pdf')).toBe(true);
    expect(matchesAccept(file('a.png', 'image/png'), 'image/*')).toBe(true);
    expect(matchesAccept(file('a.txt', 'text/plain'), 'image/*,.pdf')).toBe(false);
    expect(matchesAccept(file('a.pdf', 'application/pdf'), 'application/pdf')).toBe(true);
    expect(matchesAccept(file('a.txt', 'text/plain'), undefined)).toBe(true);
  });
});

describe('filterFiles', () => {
  const files = [file('a.pdf', 'application/pdf', 5), file('b.pdf', 'application/pdf', 50), file('c.txt', 'text/plain', 5)];
  it('descarta por tipo y tamaño', () => {
    const { accepted, rejected } = filterFiles(files, { accept: '.pdf', maxSize: 10, multiple: true });
    expect(accepted.map((f) => f.name)).toEqual(['a.pdf']);
    expect(rejected.map((r) => [r.file.name, r.reason])).toEqual([
      ['b.pdf', 'size'],
      ['c.txt', 'type'],
    ]);
  });
  it('sin multiple toma solo el primero', () => {
    const { accepted, rejected } = filterFiles(files, {});
    expect(accepted).toHaveLength(1);
    expect(rejected.every((r) => r.reason === 'count')).toBe(true);
  });
  it('arma el mensaje para lectores de pantalla', () => {
    expect(defaultRejectionMessage([{ file: file('c.txt', ''), reason: 'type' }])).toBe(
      '1 archivo no se agregó. c.txt: tipo no admitido.'
    );
  });
});
