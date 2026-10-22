/**
 * Reduce un nombre a iniciales: primera letra de la primera y de la última palabra
 * ("Hugo García" -> "HG"). Una sola palabra aporta hasta dos letras ("HG" -> "HG", "Ana" -> "AN").
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return Array.from(words[0]).slice(0, 2).join('').toUpperCase();
  const first = Array.from(words[0])[0];
  const last = Array.from(words[words.length - 1])[0];
  return `${first}${last}`.toUpperCase();
}
