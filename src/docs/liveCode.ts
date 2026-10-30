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
  | { kind: 'radio'; options: (string | number)[] }
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
  if (options.length === 0) return NONE;
  // Hasta 3 valores caben como grupo de radios; con más, una lista
  return options.length <= 3 ? { kind: 'radio', options } : { kind: 'select', options };
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
  if (control.kind === 'radio' || control.kind === 'select') {
    return control.options.find((o) => String(o) === text);
  }
  return text;
}

// ───────────────────────── código JSX ─────────────────────────

function nameOfType(type: ReactElement['type']): string {
  if (typeof type === 'string') return type;
  const t = type as { displayName?: string; name?: string; render?: { name?: string } };
  return t.displayName || t.name || t.render?.name || 'Componente';
}

const quote = (s: string) => (s.includes('"') ? `{${JSON.stringify(s)}}` : `"${s}"`);

function formatValue(value: unknown): string | undefined {
  if (typeof value === 'string') return quote(value);
  if (typeof value === 'number') return `{${value}}`;
  if (typeof value === 'boolean') return value ? '' : '{false}';
  if (value === null) return '{null}';
  if (isValidElement(value)) return `{${elementToJsx(value, 0)}}`;
  if (typeof value === 'object') {
    try {
      return `{${JSON.stringify(value)}}`;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/** `name="x"`, `name`, `name={3}`… o `undefined` si el valor no se puede escribir (funciones, símbolos). */
function formatProp(name: string, value: unknown): string | undefined {
  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') return undefined;
  const v = formatValue(value);
  if (v === undefined) return undefined;
  return v === '' ? name : `${name}=${v}`;
}

const indent = (level: number) => '  '.repeat(level);

function childrenLines(children: ReactNode, level: number): string[] {
  if (children === undefined || children === null || children === false || children === true || children === '') return [];
  if (Array.isArray(children)) return children.flatMap((c) => childrenLines(c as ReactNode, level));
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
    .map(([k, v]) => formatProp(k, v))
    .filter((p): p is string => p !== undefined);
  return jsx(tag, props, childrenLines(children as ReactNode, level + 1), level);
}

function jsx(tag: string, props: string[], inner: string[], level: number): string {
  const oneLine = `<${tag}${props.map((p) => ` ${p}`).join('')}`;
  const multiline = props.length > 2 || oneLine.length > 60;
  const open = multiline ? `<${tag}\n${props.map((p) => `${indent(level + 1)}${p}`).join('\n')}\n${indent(level)}` : oneLine;
  if (inner.length === 0) return `${open}${multiline ? '/>' : ' />'}`;
  return `${open}>\n${inner.join('\n')}\n${indent(level)}</${tag}>`;
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
  for (const [name, value] of Object.entries(args)) {
    if (name === 'children' || value === undefined || typeof value === 'function') continue;
    if (name in defaults && defaults[name] !== undefined && String(defaults[name]) === String(value)) continue;
    // Sin default conocido, un booleano en false equivale a omitirlo
    if (value === false && defaults[name] === undefined) continue;
    const p = formatProp(name, value);
    if (p !== undefined) props.push(p);
  }
  return jsx(importName, props, childrenLines(args['children'] as ReactNode, 1), 0);
}
