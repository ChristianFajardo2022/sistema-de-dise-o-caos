#!/usr/bin/env node
/**
 * Propone las `entries` de "Tokens y modos" (DocTokenGroup, ver src/docs/types.ts) a partir de la spec de Figma.
 *
 * Uso:
 *   node scripts/docs/tokens-desde-spec.mjs .qa/figma/componentes/button/button
 *   node scripts/docs/tokens-desde-spec.mjs .qa/figma/componentes/input/general-input --variante "Type=Text,State=Filled"
 *
 * --variante "<filtro>": términos separados por coma; cada uno es `Prop=Valor` o un fragmento del nombre de la variante.
 *   Todos deben coincidir (Y). Se puede repetir la bandera (O). Sin filtro: variantes en estado Default/Enabled (o la primera).
 * --todas: no fija las props que no cambian los colores (por defecto Size y similares se fijan a su valor por defecto).
 * --json: salida en JSON en vez de TS.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

// ───────── argumentos ─────────
const args = process.argv.slice(2);
let carpeta;
const filtros = [];
let todas = false;
let comoJson = false;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--variante') filtros.push(args[++i] ?? '');
  else if (a === '--todas') todas = true;
  else if (a === '--json') comoJson = true;
  else if (a === '-h' || a === '--help') {
    console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0].replace(/^\/\*\*|^ \* ?/gm, ''));
    process.exit(0);
  } else if (!carpeta) carpeta = a;
}
if (!carpeta) {
  console.error('Falta la carpeta de la spec. Uso: node scripts/docs/tokens-desde-spec.mjs <carpeta> [--variante "<filtro>"]');
  process.exit(1);
}
const rutaSpec = existsSync(join(carpeta, 'spec.json')) ? join(carpeta, 'spec.json') : join(raiz, carpeta, 'spec.json');
if (!existsSync(rutaSpec)) {
  console.error(`No existe spec.json en ${carpeta}`);
  process.exit(1);
}
const spec = JSON.parse(readFileSync(rutaSpec, 'utf8'));
const tokensCss = readFileSync(join(raiz, 'src/styles/tokens.css'), 'utf8');

// ───────── utilidades ─────────
const slug = (nombre) => nombre.toLowerCase().trim().replace(/[\s/]+/g, '-');
const defineVar = (v) => new RegExp(`--${v}\\s*:`).test(tokensCss);
const existeColor = (s) => defineVar(`color-ds-${s}`);
const existeTipografia = (s) => defineVar(`text-ds-${s}`) || defineVar(`ds-responsive-${s}`);
const nombreVar = (id) => spec.variables?.[id]?.nombre;
const defecto = (prop) => spec.props?.[prop]?.defecto;

// ───────── selección de variantes ─────────
const variantes = (spec.variantes ?? []).map((v) => {
  if (v.props && Object.keys(v.props).length) return v;
  // Algunas specs traen `props` vacío: se recuperan del nombre ("Type=Text, State=Default").
  const props = {};
  for (const par of v.nombre.split(/,\s*(?=[^,=]+=)/)) {
    const i = par.indexOf('=');
    if (i > 0) props[par.slice(0, i).trim()] = par.slice(i + 1).trim();
  }
  return { ...v, props };
});
const claveEstado = Object.keys(variantes[0]?.props ?? {}).find((k) => k.toLowerCase() === 'state');

function coincide(v, filtro) {
  return filtro
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .every((t) => {
      if (t.includes('=')) {
        const [k, val] = t.split('=').map((x) => x.trim());
        return v.props?.[k] === val;
      }
      return v.nombre.toLowerCase().includes(t.toLowerCase());
    });
}

/** Tokens de una variante: [{part, color?, text?, nodo, ...}] más lo que no se pudo enlazar. */
function extraer(v) {
  const entradas = new Map(); // clave de parte → entrada
  const sinVariable = [];
  const typo = new Set();
  const visto = new Set();

  function agregar(parte, tipo, varId, nodo, hex) {
    const nombre = varId ? nombreVar(varId) : undefined;
    if (!varId || !nombre) {
      sinVariable.push({ nodo: nodo.nombre, parte, valor: hex ?? '?' });
      return;
    }
    const k = `${parte}|${tipo}|${nombre}`;
    if (visto.has(k)) return;
    visto.add(k);
    const s = slug(nombre);
    // Si la misma parte ya existe con otra variable (p. ej. dos nodos), se desambigua con el nombre del nodo.
    let clave = parte;
    if (entradas.has(clave) && entradas.get(clave).color !== s) clave = `${parte} (${nodo.nombre})`;
    if (!entradas.has(clave)) entradas.set(clave, { part: clave, nodo: nodo.nombre });
    entradas.get(clave).color = s;
    entradas.get(clave).figma = nombre;
  }

  function recorrer(n, esRaiz) {
    const tipoNodo = n.tipo;
    if (tipoNodo === 'TEXT') {
      for (const f of n.rellenos ?? []) agregar('Texto', 'texto', f.var, n, f.color);
      const entradaTexto = entradas.get('Texto');
      for (const clave of ['fontSize', 'lineHeight', 'letterSpacing']) {
        const id = n.vars?.[clave];
        const nombre = id && nombreVar(id);
        if (nombre) {
          typo.add(slug(nombre));
          if (entradaTexto && clave === 'fontSize') entradaTexto.text = slug(nombre);
        }
      }
    } else if (n.icono) {
      for (const f of n.icono.color ?? []) agregar('Ícono', 'icono', f.var, n, f.color);
    } else {
      for (const f of n.rellenos ?? []) if (f.tipo === 'SOLID') agregar(esRaiz ? 'Fondo' : n.nombre, 'relleno', f.var, n, f.color);
      for (const f of n.trazos ?? []) if (f.tipo === 'SOLID') agregar(esRaiz ? 'Borde' : `Borde (${n.nombre})`, 'trazo', f.var, n, f.color);
    }
    if (n.icono) {
      // los trazos/rellenos de la instancia no cuentan: el color vive en `icono.color`
    }
    for (const h of n.hijos ?? []) recorrer(h, false);
  }
  recorrer(v.arbol, true);
  const orden = (e) => {
    const i = ['Fondo', 'Borde', 'Texto', 'Ícono'].findIndex((x) => e.part === x);
    return i === -1 ? 9 : i;
  };
  return { entradas: [...entradas.values()].sort((a, b) => orden(a) - orden(b)), sinVariable, typo: [...typo] };
}

// Variantes candidatas
let elegidas;
let notaSeleccion = '';
if (filtros.length) {
  elegidas = variantes.filter((v) => filtros.some((f) => coincide(v, f)));
  if (!elegidas.length) {
    console.error(`Ninguna variante coincide con ${JSON.stringify(filtros)}.\nEjemplos: ${variantes.slice(0, 5).map((v) => v.nombre).join(' | ')}`);
    process.exit(1);
  }
} else if (claveEstado) {
  elegidas = variantes.filter((v) => /^(default|enabled|rest)$/i.test(v.props[claveEstado] ?? ''));
  if (!elegidas.length) elegidas = variantes.slice(0, 1);
  if (!todas) {
    // Fija a su valor por defecto las props que no cambian los tokens de color (p. ej. Size).
    const firma = (v) => JSON.stringify(extraer(v).entradas.map((e) => `${e.part}=${e.color}`).sort());
    const claves = Object.keys(elegidas[0].props).filter((k) => k !== claveEstado);
    for (const k of claves) {
      const valores = [...new Set(elegidas.map((v) => v.props[k]))];
      if (valores.length < 2) continue;
      const grupos = new Map();
      for (const v of elegidas) {
        const otras = JSON.stringify(Object.entries(v.props).filter(([c]) => c !== k && c !== claveEstado));
        if (!grupos.has(otras)) grupos.set(otras, new Set());
        grupos.get(otras).add(firma(v));
      }
      if ([...grupos.values()].every((s) => s.size === 1)) {
        const fijo = valores.includes(defecto(k)) ? defecto(k) : valores[valores.length - 1];
        elegidas = elegidas.filter((v) => v.props[k] === fijo);
        notaSeleccion += `  · ${k} fijada en "${fijo}" (no cambia los colores; usa --todas para verla).\n`;
      }
    }
  }
} else {
  elegidas = variantes.slice(0, 1);
  notaSeleccion = `  · Sin prop State: se usa la primera variante. Otras: ${variantes.slice(1, 6).map((v) => v.nombre).join(' | ')}${variantes.length > 6 ? ' …' : ''}\n`;
}

// ───────── grupos ─────────
const resultados = elegidas.map((v) => ({ v, ...extraer(v) }));
// Deduplica por firma de tokens
const unicos = [];
const porFirma = new Map();
for (const r of resultados) {
  const f = JSON.stringify(r.entradas.map((e) => [e.part, e.color, e.text]));
  if (porFirma.has(f)) porFirma.get(f).iguales.push(r.v.nombre);
  else {
    const u = { ...r, iguales: [] };
    porFirma.set(f, u);
    unicos.push(u);
  }
}
// Quita grupos cuyas entradas son subconjunto estricto de otro y que no se pidieron por filtro
const claveEntrada = (e) => `${e.part}|${e.color}|${e.text ?? ''}`;
const finales = filtros.length
  ? unicos
  : unicos.filter((a) => !unicos.some((b) => b !== a && b.entradas.length > a.entradas.length && a.entradas.every((e) => b.entradas.some((x) => claveEntrada(x) === claveEntrada(e)))));
const omitidosLista = unicos.filter((u) => !finales.includes(u));
const omitidos = omitidosLista.length;

// Título del grupo: props que difieren entre los grupos finales
const clavesVar = Object.keys(finales[0]?.v.props ?? {}).filter((k) => k !== claveEstado);
const quePropsDifieren = clavesVar.filter((k) => new Set(finales.map((g) => g.v.props[k])).size > 1);
for (const g of finales) {
  g.titulo = quePropsDifieren.length ? quePropsDifieren.map((k) => (/^(true|false|on|off)$/i.test(g.v.props[k]) ? `${k}: ${g.v.props[k]}` : g.v.props[k])).join(' · ') : g.v.nombre;
}

// Validación contra tokens.css
const paraDiseno = new Map(); // figma → slug
const tipografiaFaltante = new Map();
const avisos = [];
for (const g of finales) {
  for (const e of g.entradas) {
    if (e.color && !existeColor(e.color)) paraDiseno.set(e.figma, e.color);
    if (e.text) {
      if (!existeTipografia(e.text)) tipografiaFaltante.set(e.text, e.text);
      else if (existeTipografia(`${e.text}-uniform`)) avisos.push(`typography-${e.text.replace(/^typography-/, '')}: también existe la variante "-uniform" (la usa el código si el componente no cambia de tamaño por breakpoint); elige según el componente.`);
    }
  }
}
const sinVarGlobal = new Map();
for (const g of finales) for (const s of g.sinVariable) sinVarGlobal.set(`${g.titulo}|${s.nodo}|${s.parte}|${s.valor}`, { grupo: g.titulo, ...s });

if (comoJson) {
  console.log(JSON.stringify({ spec: rutaSpec, grupos: finales.map((g) => ({ titulo: g.titulo, variante: g.v.nombre, iguales: g.iguales, entries: g.entradas.map(({ part, color, text }) => ({ part, color, text })) })), noExisten: Object.fromEntries(paraDiseno), tipografiaNoExiste: [...tipografiaFaltante.keys()], valorFijo: [...sinVarGlobal.values()] }, null, 2));
  process.exit(0);
}

// ───────── salida TS ─────────
const q = (s) => `'${s.replace(/'/g, "\\'")}'`;
const out = [];
out.push(`// Generado por scripts/docs/tokens-desde-spec.mjs desde ${rutaSpec.replace(raiz + '/', '')}`);
out.push(`// Variantes usadas: ${elegidas.length} de ${variantes.length}; grupos: ${finales.length}${omitidos ? ` (omitidos por ser subconjunto de otro: ${omitidosLista.map((u) => u.v.nombre).join(' | ')}; usa --variante para verlos)` : ''}`);
if (notaSeleccion) out.push(...notaSeleccion.trimEnd().split('\n').map((l) => `//${l}`));
out.push('// Falta `preview` en cada grupo (el componente real); el título es una propuesta.');
out.push('groups: [');
for (const g of finales) {
  out.push('  {');
  out.push(`    title: ${q(g.titulo)}, // ${g.v.nombre}${g.iguales.length ? ` (+${g.iguales.length} con los mismos tokens)` : ''}`);
  out.push('    entries: [');
  for (const e of g.entradas) {
    const partes = [`part: ${q(e.part)}`];
    if (e.color) partes.push(`color: ${q(e.color)}`);
    if (e.text) partes.push(`text: ${q(e.text)}`);
    const falta = e.color && !existeColor(e.color) ? ' // NO EXISTE en tokens.css' : '';
    out.push(`      { ${partes.join(', ')} },${falta}`);
  }
  out.push('    ],');
  out.push('  },');
}
out.push('],');
console.log(out.join('\n'));

console.log('\n// ── Variables de Figma que NO existen en src/styles/tokens.css (para diseño) ──');
if (!paraDiseno.size && !tipografiaFaltante.size) console.log('// (ninguna)');
for (const [fig, s] of paraDiseno) console.log(`// ${fig}  →  --color-ds-${s}`);
for (const s of tipografiaFaltante.keys()) console.log(`// (tipografía) ${s}`);
console.log('\n// ── Colores de valor fijo, sin variable enlazada ──');
if (!sinVarGlobal.size) console.log('// (ninguno)');
for (const s of sinVarGlobal.values()) console.log(`// ${s.grupo}: ${s.nodo} · ${s.parte} · ${s.valor}`);
if (avisos.length) {
  console.log('\n// ── Avisos ──');
  for (const a of [...new Set(avisos)]) console.log(`// ${a}`);
}
