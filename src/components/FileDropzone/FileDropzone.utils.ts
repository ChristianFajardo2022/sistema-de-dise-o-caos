import type { FileRejection, FileRejectionReason } from './FileDropzone.types';

const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

/** Tamaño legible en base 1024 con un decimal como máximo: 23 GB, 1,5 MB, 800 KB. */
export function formatFileSize(bytes: number): string {
  let value = Math.max(0, bytes);
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const text = value.toLocaleString('es', { maximumFractionDigits: unit === 0 ? 0 : 1 });
  return `${text} ${UNITS[unit]}`;
}

const GROUP_LABEL: Record<string, string> = { image: 'Imágenes', video: 'Videos', audio: 'Audios', text: 'Texto' };

function tokens(accept: string): string[] {
  return accept
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

/** Texto de los tipos admitidos a partir de `accept`: ".pdf, .jpg" -> "PDF, JPG"; "image/*" -> "Imágenes". */
export function describeAccept(accept: string | undefined): string {
  if (!accept) return '';
  const labels = tokens(accept).map((t) => {
    if (t.startsWith('.')) return t.slice(1).toUpperCase();
    const [group, sub] = t.split('/');
    if (sub === '*' || sub === undefined) return GROUP_LABEL[group] ?? group.toUpperCase();
    return sub.replace(/^(x-|vnd\.)/, '').toUpperCase();
  });
  return [...new Set(labels)].join(', ');
}

/** `true` si el archivo cumple `accept` (extensión, tipo MIME exacto o comodín `grupo/*`). Sin `accept` admite todo. */
export function matchesAccept(file: Pick<File, 'name' | 'type'>, accept: string | undefined): boolean {
  const list = accept ? tokens(accept) : [];
  if (list.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return list.some((t) => {
    if (t.startsWith('.')) return name.endsWith(t);
    if (t.endsWith('/*')) return type.startsWith(t.slice(0, -1));
    return type === t;
  });
}

/** Separa los archivos en válidos y descartados (tipo, tamaño y cantidad). */
export function filterFiles(
  files: File[],
  { accept, maxSize, multiple }: { accept?: string; maxSize?: number; multiple?: boolean }
): { accepted: File[]; rejected: FileRejection[] } {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  files.forEach((file, index) => {
    let reason: FileRejectionReason | null = null;
    if (!multiple && index > 0) reason = 'count';
    else if (!matchesAccept(file, accept)) reason = 'type';
    else if (maxSize !== undefined && file.size > maxSize) reason = 'size';
    if (reason) rejected.push({ file, reason });
    else accepted.push(file);
  });
  return { accepted, rejected };
}

const REASON_TEXT: Record<FileRejectionReason, string> = {
  type: 'tipo no admitido',
  size: 'supera el tamaño máximo',
  count: 'solo se admite un archivo',
};

/** Mensaje por defecto para lectores de pantalla al descartar archivos. */
export function defaultRejectionMessage(rejections: FileRejection[]): string {
  const detail = rejections.map((r) => `${r.file.name}: ${REASON_TEXT[r.reason]}`).join('. ');
  const n = rejections.length;
  return `${n === 1 ? '1 archivo no se agregó' : `${n} archivos no se agregaron`}. ${detail}.`;
}
