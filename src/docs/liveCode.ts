import { isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { DocPropRow } from './types';

/*
 * Lógica pura de la sección Desarrollo (sin Storybook ni React de interfaz): qué control corresponde a cada prop,
 * valor por defecto tipado y código JSX generado a partir de los args actuales.
 */

/** Lo que usa la sección de un ArgType de la historia (control, opciones y tipo, tal como los prepara Storybook). */
export interface LiveArgType {
  control?: false | string | { type?: string };
  options?: readonly unknown[];
  type?: { name?: string; value?: unknown };
}

export type PropControl =
  | { kind: 'none' }
  | { kind: 'boolean' }
  | { kind: 'text' }
  | { kind: 'number' }
  | { kind: 'select'; options: (string | number)[] };

const NONE: PropControl = { kind: 'none' };

/** Valores de un tipo que es una unión de literales (`'a' | 'b'` o `14 | 16`); `undefined` si no lo es. */
export function literalsFromType(type: string | undefined): (string | number)[] | undefined {
  if (!type) return undefined;
  const parts = type.split('|').map((t) => t.trim());
  if (parts.length < 2) return undefined;
  if (parts.every((p) => /^'[^']*'$/.test(p))) return parts.map((p) => p.slice(1, -1));
  if (parts.every((p) => /^-?\d+(\.\d+)?$/.test(p))) return parts.map(Number);
  return undefined;
}

function choice(options: (string | number)[]): PropControl {
  // Uniones de literales y números con valores fijos: siempre una lista (Select), como el dropdown de reactbits
  return options.length === 0 ? NONE : { kind: 'select', options };
}

/**
 * Control de una prop: lo declara la historia (`argTypes`) y, si no dice nada, sale del tipo escrito. ReactNode,
 * funciones y objetos no tienen control (salvo que la historia pida uno de texto).
 */
export function controlFor(argType: LiveArgType | undefined, typeText: string | undefined): PropControl {
  const raw = argType?.control;
  const declared = raw === false ? false : typeof raw === 'string' ? raw : raw?.type;
  if (declared === false) return NONE;
  const fromArgType = Array.isArray(argType?.options)
    ? (argType.options as unknown[]).filter((o): o is string | number => typeof o === 'string' || typeof o === 'number')
    : Array.isArray(argType?.type?.value)
      ? (argType.type.value as unknown[]).filter((o): o is string | number => typeof o === 'string' || typeof o === 'number')
      : [];
  switch (declared) {
    case 'boolean':
      return { kind: 'boolean' };
    case 'text':
      return { kind: 'text' };
    case 'number':
    case 'range':
      return { kind: 'number' };
    case 'radio':
    case 'inline-radio':
    case 'select':
    case 'inline-select':
      return choice(fromArgType.length > 0 ? fromArgType : (literalsFromType(typeText) ?? []));
    case undefined:
      break;
    default:
      return NONE;
  }
  // Sin control declarado: por el tipo escrito
  if (!typeText || /ReactNode|ReactElement|=>/.test(typeText)) return NONE;
  if (typeText === 'boolean') return { kind: 'boolean' };
  if (typeText === 'string') return { kind: 'text' };
  if (typeText === 'number') return { kind: 'number' };
  const literals = literalsFromType(typeText);
  return literals ? choice(literals) : NONE;
}

/** Texto del valor por defecto sin comillas (`'primary'` → `primary`). */
function plainDefault(value: string): string {
  const m = /^(['"`])(.*)\1$/.exec(value.trim());
  return m ? m[2] : value.trim();
}

/** Valor por defecto tipado según el control (para compararlo con los args y para el modo de solo lectura). */
export function defaultValueOf(row: Pick<DocPropRow, 'defaultValue'>, control: PropControl): string | number | boolean | undefined {
  if (row.defaultValue === undefined) return control.kind === 'boolean' ? false : undefined;
  const text = plainDefault(row.defaultValue);
  if (control.kind === 'boolean') return text === 'true';
  if (control.kind === 'number') return Number.isFinite(Number(text)) ? Number(text) : undefined;
  if (control.kind === 'select') {
    return control.options.find((o) => String(o) === text);
  }
  return text;
}

// ───────────────────────── código JSX ─────────────────────────

const FRAGMENT = Symbol.for('react.fragment');

function nameOfType(type: ReactElement['type']): string {
  if (typeof type === 'string') return type;
  if ((type as unknown) === FRAGMENT) return '';
  // memo(): el componente está en `type`; forwardRef(): en `render`
  const t = type as { displayName?: string; name?: string; render?: { displayName?: string; name?: string }; type?: ReactElement['type'] };
  return t.displayName || t.name || t.render?.displayName || t.render?.name || (t.type ? nameOfType(t.type) : '') || 'Componente';
}

const quote = (s: string) => (s.includes('"') ? `{${JSON.stringify(s)}}` : `"${s}"`);

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
/** Hasta dónde se baja en objetos anidados (evita ciclos y bloques enormes). */
const MAX_DEPTH = 5;

/**
 * Valor de JavaScript escrito como en el código (`{ label: 'Mover' }`, `[1, 2]`, `<Icon />`, `() => {}`): lo usan las
 * props que son objetos, arreglos o funciones dentro de ellos. En una línea si cabe en 60 caracteres; si no, una
 * entrada por línea con la sangría de `level`. `undefined` si no se puede escribir.
 */
/**
 * Una fecha como se escribe a mano, en hora local: `new Date(2026, 9, 23)` (mes desde 0) y la hora solo si no es
 * medianoche. Una ISO en UTC (`'2026-10-23T05:00:00.000Z'`) no se lee y cambia de día según la zona horaria.
 */
function dateLiteral(date: Date): string {
  const parts = [date.getFullYear(), date.getMonth(), date.getDate()];
  const time = [date.getHours(), date.getMinutes(), date.getSeconds()];
  while (time.length && time[time.length - 1] === 0) time.pop();
  return `new Date(${[...parts, ...time].join(', ')})`;
}

function literal(value: unknown, level: number, depth = 0): string | undefined {
  if (value === undefined || typeof value === 'symbol') return undefined;
  if (value === null || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  if (typeof value === 'function') return '() => {}';
  if (isValidElement(value)) return elementToJsx(value, level);
  if (typeof value !== 'object' || depth >= MAX_DEPTH) return undefined;
  if (value instanceof Date) return dateLiteral(value);
  const isArray = Array.isArray(value);
  if (!isArray && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) return undefined;
  const entries = isArray
    ? (value as unknown[]).map((v) => literal(v, level + 1, depth + 1) ?? 'undefined')
    : Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => {
        const text = literal(v, level + 1, depth + 1);
        return text === undefined ? [] : [`${IDENTIFIER.test(k) ? k : `'${k}'`}: ${text}`];
      });
  const [open, close] = isArray ? ['[', ']'] : ['{ ', ' }'];
  if (entries.length === 0) return isArray ? '[]' : '{}';
  const oneLine = `${open}${entries.join(', ')}${close}`;
  if (oneLine.length <= 60 && !oneLine.includes('\n')) return oneLine;
  return `${open.trim()}\n${entries.map((e) => `${indent(level + 1)}${e},`).join('\n')}\n${indent(level)}${close.trim()}`;
}

function formatValue(value: unknown, level: number): string | undefined {
  if (typeof value === 'string') return quote(value);
  if (typeof value === 'number') return `{${value}}`;
  if (typeof value === 'boolean') return value ? '' : '{false}';
  if (value === null) return '{null}';
  const text = literal(value, level);
  return text === undefined ? undefined : `{${text}}`;
}

/**
 * `name="x"`, `name`, `name={3}`, `name={{ a: 1 }}`… o `undefined` si el valor no se puede escribir (funciones,
 * símbolos). `level` es la sangría de la línea de la prop (para objetos de varias líneas).
 */
function formatProp(name: string, value: unknown, level = 1): string | undefined {
  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') return undefined;
  const v = formatValue(value, level);
  if (v === undefined) return undefined;
  return v === '' ? name : `${name}=${v}`;
}

const indent = (level: number) => '  '.repeat(level);

function childrenLines(children: ReactNode, level: number): string[] {
  if (children === undefined || children === null || children === false || children === true || children === '') return [];
  if (Array.isArray(children)) return children.flatMap((c) => childrenLines(c as ReactNode, level));
  // Un fragmento como hijo se escribe con sus hijos directamente (`<>` no aporta nada dentro de otro elemento)
  if (isValidElement(children) && (children.type as unknown) === FRAGMENT) {
    return childrenLines((children.props as { children?: ReactNode }).children, level);
  }
  if (isValidElement(children)) return [indent(level) + elementToJsx(children as ReactElement, level)];
  if (typeof children === 'number') return [indent(level) + String(children)];
  if (typeof children === 'string') return [indent(level) + children.replace(/[{}<>]/g, (c) => `{'${c}'}`)];
  return [];
}

/** Escribe un elemento de React como JSX (solo para mostrar: nombres de componente y props simples). */
function elementToJsx(el: ReactElement, level: number): string {
  const { children, ...rest } = el.props as Record<string, unknown>;
  const tag = nameOfType(el.type);
  const props = Object.entries(rest)
    .map(([k, v]) => formatProp(k, v, level + 1))
    .filter((p): p is string => p !== undefined);
  return jsx(tag, props, childrenLines(children as ReactNode, level + 1), level);
}

function jsx(tag: string, props: string[], inner: string[], level: number): string {
  // Fragmento (`<>…</>`): sin props
  if (tag === '') return inner.length === 0 ? '<></>' : `<>\n${inner.join('\n')}\n${indent(level)}</>`;
  const oneLine = `<${tag}${props.map((p) => ` ${p}`).join('')}`;
  const multiline = props.length > 2 || oneLine.length > 60 || props.some((p) => p.includes('\n'));
  const open = multiline ? `<${tag}\n${props.map((p) => `${indent(level + 1)}${p}`).join('\n')}\n${indent(level)}` : oneLine;
  if (inner.length === 0) return `${open}${multiline ? '/>' : ' />'}`;
  // Elemento anidado con un texto corto (`<DropdownMenuItem>Mi perfil</DropdownMenuItem>`): en una línea. El elemento
  // principal (nivel 0) conserva su forma de bloque.
  const text = inner.length === 1 ? inner[0].trim() : '';
  if (level > 0 && !multiline && text && !text.startsWith('<') && !text.startsWith('{')) {
    const line = `${open}>${text}</${tag}>`;
    if (line.length <= 80) return line;
  }
  return `${open}>\n${inner.join('\n')}\n${indent(level)}</${tag}>`;
}

/**
 * Ejemplo de `docs.json` escrito en una sola línea → el mismo formato que el código generado (una prop por línea cuando
 * no cabe), para que no haya que desplazarse dentro del bloque. Solo reescribe un elemento suelto (`<X …>contenido</X>`
 * o `<X … />`) de más de 60 caracteres; lo demás (varias líneas, fragmentos, varios elementos) se devuelve tal cual.
 */
export function formatExample(code: string): string {
  const src = code.trim();
  const head = /^<([A-Z][\w.]*)/.exec(src);
  if (!head || src.includes('\n') || src.length <= 60) return code;
  const tag = head[1];
  const props: string[] = [];
  let current = '';
  let depth = 0;
  let quoteChar: string | null = null;
  let i = head[0].length;
  for (; i < src.length; i++) {
    const c = src[i];
    if (quoteChar) {
      current += c;
      if (c === quoteChar) quoteChar = null;
    } else if (depth > 0) {
      current += c;
      if (c === '{') depth++;
      else if (c === '}') depth--;
    } else if (c === '>' || (c === '/' && src[i + 1] === '>')) {
      break;
    } else if (/\s/.test(c)) {
      if (current) props.push(current);
      current = '';
    } else {
      if (c === '"' || c === "'") quoteChar = c;
      else if (c === '{') depth++;
      current += c;
    }
  }
  if (current) props.push(current);
  if (i >= src.length) return code;
  if (src[i] === '/') return src.slice(i) === '/>' ? jsx(tag, props, [], 0) : code;
  const close = `</${tag}>`;
  const inner = src.slice(i + 1, src.length - close.length).trim();
  if (!src.endsWith(close) || inner.includes(`<${tag}`)) return code;
  return jsx(tag, props, inner ? [indent(1) + inner] : [], 0);
}

/**
 * Args que cambian el código: sin los que valen lo mismo que su valor por defecto, los sin definir y las funciones
 * (acciones de la historia). Un booleano en `false` sin valor por defecto conocido equivale a omitirlo.
 */
export function changedArgs(
  args: Record<string, unknown>,
  defaults: Record<string, string | number | boolean | undefined>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(args)) {
    if (value === undefined || typeof value === 'function') continue;
    if (name !== 'children' && name in defaults && defaults[name] !== undefined && String(defaults[name]) === String(value)) continue;
    if (value === false && defaults[name] === undefined) continue;
    out[name] = value;
  }
  return out;
}

/**
 * Un valor escrito como en el código (`{ type: 'success', title: 'Guardado' }`). Para `docsLive.code`, cuando el
 * ejemplo no es un elemento JSX (p. ej. la llamada `add({ … })` de un componente imperativo).
 */
export function formatLiteral(value: unknown, level = 0): string {
  return literal(value, level) ?? 'undefined';
}

/**
 * Código JSX del componente con los args actuales. Omite lo que vale lo mismo que su valor por defecto, lo que está
 * sin definir y las funciones (acciones de la historia).
 */
export function buildCode(
  importName: string,
  args: Record<string, unknown>,
  defaults: Record<string, string | number | boolean | undefined>,
): string {
  const props: string[] = [];
  for (const [name, value] of Object.entries(changedArgs(args, defaults))) {
    if (name === 'children') continue;
    const p = formatProp(name, value);
    if (p !== undefined) props.push(p);
  }
  return jsx(importName, props, childrenLines(args['children'] as ReactNode, 1), 0);
}

/** Hooks de React que pueden aparecer en un ejemplo y no se importan del paquete. */
const REACT_HOOKS = new Set(['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useId', 'useReducer', 'useContext', 'useLayoutEffect']);

/**
 * Nombres del paquete que usa un ejemplo: las etiquetas JSX en PascalCase (`<Toaster>`, `<NotificationBell>`) y los
 * hooks propios (`useToastQueue`), para que la línea de importación traiga todo lo que el código necesita.
 */
export function packageNamesInCode(code: string): string[] {
  const tags = [...code.matchAll(/<([A-Z][A-Za-z0-9]*)[\s/>]/g)].map((m) => m[1]);
  const hooks = [...code.matchAll(/\b(use[A-Z][A-Za-z0-9]*)\s*\(/g)].map((m) => m[1]).filter((h) => !REACT_HOOKS.has(h));
  return [...new Set([...tags, ...hooks])].filter((name) => name !== 'Fragment');
}
