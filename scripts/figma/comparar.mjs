#!/usr/bin/env node
/**
 * Comparador genérico Storybook vs Figma.
 *
 * Uso:
 *   node scripts/figma/comparar.mjs --carpeta badge --story data-display-badge--figma-matrix \
 *        [--port 6006] [--temas dark,light] [--tol 0.5] [--out <carpeta>]
 *
 * `--out` escribe comparacion.json/html y capturas en otra carpeta (para no pisar la de otro agente).
 *
 * Lee .qa/figma/componentes/<carpeta>/spec.json (generado por extraer.js), abre la historia
 * FigmaMatrix en Storybook y compara cada variante (`[data-figma="<nombre>"]`) contra la spec.
 * Escribe comparacion.json, comparacion.html y capturas/<tema>/<slug>.png en la misma carpeta.
 * Código de salida: 0 sin diferencias, 1 con diferencias, 2 error de uso/ejecución.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MANIFEST_POR_SET = Object.fromEntries(
  // Los sets que son copia exacta de otro ("copias") apuntan al mismo ícono
  JSON.parse(fs.readFileSync(new URL('../../icons/caos/manifest.json', import.meta.url), 'utf8')).flatMap((m) =>
    [m.figmaSetId, ...(m.copias || [])].map((id) => [id, m.name]),
  ),
);

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MODO_RESPONSIVE = 'Desktop';
const TOL_COLOR = 2;
const TOL_ALPHA = 0.02;

// Sombra inset sin blur ni spread desplazada en un solo eje: trazo de un lado
const esTrazoLado = (s) => s.inset && s.blur === 0 && s.spread === 0 && (s.x === 0) !== (s.y === 0);

// ───────────────────────── argumentos ─────────────────────────
function leerArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const k = argv[i].slice(2);
    const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
    a[k] = v;
  }
  return a;
}

// ───────────────────────── utilidades de color ─────────────────────────
/** "#rrggbb" o "#rrggbb@alpha" -> [r,g,b,a] */
function parseHex(s) {
  if (typeof s !== 'string') return null;
  const m = /^#([0-9a-f]{6})(?:@([\d.]+))?$/i.exec(s.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, m[2] !== undefined ? parseFloat(m[2]) : 1];
}
const fmtColor = (c) => (c ? `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${+c[3].toFixed(3)})` : '—');
function coloresIguales(a, b) {
  if (!a || !b) return false;
  if (Math.abs(a[3] - b[3]) > TOL_ALPHA) return false;
  // con alfa casi nulo el color no se ve: no se compara
  if (a[3] < 0.01 && b[3] < 0.01) return true;
  return [0, 1, 2].every((i) => Math.abs(a[i] - b[i]) <= TOL_COLOR);
}

// ───────────────────────── resolución de la spec ─────────────────────────
function crearResolvedor(spec, tema) {
  const modoColor = tema === 'dark' ? 'Dark' : 'Light';
  const vars = spec.variables || {};
  const colorDe = (literal, varId) => {
    const v = varId && vars[varId];
    if (v && v.porModo) {
      const val = v.porModo[modoColor] ?? Object.values(v.porModo)[0];
      const c = parseHex(val);
      if (c) return c;
    }
    return parseHex(literal);
  };
  const numDe = (literal, varId) => {
    const v = varId && vars[varId];
    if (v && v.porModo) {
      const val = v.porModo[MODO_RESPONSIVE] ?? Object.values(v.porModo)[0];
      if (typeof val === 'number') return val;
    }
    return literal;
  };
  const primerSolido = (lista) => (Array.isArray(lista) ? lista.find((p) => p.tipo === 'SOLID') : null);
  const colorPintura = (lista) => {
    const p = primerSolido(lista);
    return p ? colorDe(p.color, p.var) : null;
  };
  // Color de un efecto. Si está enlazado a una variable de la colección Responsive, el modo trae
  // `{ color: alias, opacity }` (no un hex): se resuelve el alias del color y se aplica la opacidad.
  const colorEfecto = (e) => {
    const v = e.vars && e.vars.color && vars[e.vars.color];
    const val = v && v.porModo && (v.porModo[MODO_RESPONSIVE] ?? Object.values(v.porModo)[0]);
    if (val && typeof val === 'object' && val.color) {
      const base = vars[val.color.id];
      const mc = base && base.porModo && parseHex(base.porModo[modoColor] ?? Object.values(base.porModo)[0]);
      const rgb = mc || parseHex(e.color) || [0, 0, 0, 1];
      return [rgb[0], rgb[1], rgb[2], typeof val.opacity === 'number' ? val.opacity : rgb[3]];
    }
    if (typeof val === 'string') return parseHex(val) || parseHex(e.color);
    return parseHex(e.color);
  };
  return { colorDe, numDe, colorPintura, primerSolido, colorEfecto };
}

function recorrer(nodo, fn) {
  // Lo oculto en Figma (y todo lo que cuelga de ahí) no se dibuja: no se mide
  if (nodo.oculto) return;
  fn(nodo);
  (nodo.hijos || []).forEach((h) => recorrer(h, fn));
}

// ───────────────────────── medición en la página ─────────────────────────
/** Se ejecuta en el navegador. Devuelve valores crudos ya normalizados a rgba. */
function medirEnPagina({ nombre, partes }) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const rgba = (css) => {
    if (!css) return null;
    const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(css.trim());
    if (m) {
      let a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
      return [Math.round(+m[1]), Math.round(+m[2]), Math.round(+m[3]), a];
    }
    if (css === 'transparent') return [0, 0, 0, 0];
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const px = (v) => {
    if (v === 'normal' || v === 'auto' || v === '') return 0;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const sel = (n) => `[data-figma-part="${CSS.escape(n)}"]`;
  const raiz = [...document.querySelectorAll('[data-figma]')].find((e) => e.getAttribute('data-figma') === nombre);
  if (!raiz) return null;

  const r = raiz.getBoundingClientRect();
  const cs = getComputedStyle(raiz);
  const radio = (prop, el, csx) => {
    const v = csx[prop].split(' ')[0];
    if (v.endsWith('%')) return (parseFloat(v) / 100) * el.getBoundingClientRect().width;
    return px(v);
  };
  const sombras = [];
  if (cs.boxShadow && cs.boxShadow !== 'none') {
    const partes2 = cs.boxShadow.split(/,(?![^(]*\))/);
    for (const p of partes2) {
      const inset = /\binset\b/.test(p);
      const col = /(rgba?\([^)]*\)|color\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\)|#[0-9a-f]+)/i.exec(p);
      const resto = p.replace(col ? col[0] : '', '').replace('inset', '').trim().split(/\s+/).map(px);
      sombras.push({ inset, color: rgba(col ? col[0] : null), x: resto[0] || 0, y: resto[1] || 0, blur: resto[2] || 0, spread: resto[3] || 0 });
    }
  }
  // `filter: drop-shadow(...)` (siluetas con muesca): en la raíz y en la capa de superficie `Canva`.
  // drop-shadow no admite spread; el valor computado trae el color primero.
  const filtros = (el) => {
    const f = getComputedStyle(el).filter;
    const res = [];
    if (!f || f === 'none') return res;
    let i = 0;
    while ((i = f.indexOf('drop-shadow(', i)) >= 0) {
      let j = i + 12, nivel = 1;
      while (j < f.length && nivel > 0) {
        if (f[j] === '(') nivel++;
        else if (f[j] === ')') nivel--;
        j++;
      }
      const cuerpo = f.slice(i + 12, j - 1);
      const col = /(rgba?\([^)]*\)|color\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\)|#[0-9a-f]+)/i.exec(cuerpo);
      const resto = cuerpo.replace(col ? col[0] : '', '').trim().split(/\s+/).map(px);
      res.push({ inset: false, filtro: true, color: rgba(col ? col[0] : null), x: resto[0] || 0, y: resto[1] || 0, blur: resto[2] || 0, spread: 0 });
      i = j;
    }
    return res;
  };
  sombras.push(...filtros(raiz));
  for (const capa of raiz.querySelectorAll(sel('Canva'))) sombras.push(...filtros(capa).map((f) => ({ ...f, deCanva: true })));
  // Distancia real entre los dos primeros hijos visibles (para gaps negativos de Figma, que en CSS son márgenes)
  const hijosVis = [...raiz.children].filter((h) => h.getBoundingClientRect().height > 0 || h.getBoundingClientRect().width > 0);
  const vertical = cs.flexDirection.startsWith('column') || (cs.display !== 'flex' && cs.display !== 'inline-flex');
  let gapReal = null;
  if (hijosVis.length > 1) {
    const a = hijosVis[0].getBoundingClientRect();
    const b = hijosVis[1].getBoundingClientRect();
    gapReal = vertical ? b.top - a.bottom : b.left - a.right;
  }
  const lados = ['Top', 'Right', 'Bottom', 'Left'];
  const borde = {
    grosores: lados.map((l) => px(cs[`border${l}Width`]) * (cs[`border${l}Style`] === 'none' ? 0 : 1)),
    colores: lados.map((l) => rgba(cs[`border${l}Color`])),
  };
  const out = {
    raiz: {
      w: r.width,
      h: r.height,
      padding: lados.map((l) => px(cs[`padding${l}`])),
      columnGap: px(cs.columnGap),
      gapReal,
      rowGap: px(cs.rowGap),
      radios: ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map((c) => radio(`border${c}Radius`, raiz, cs)),
      fondo: rgba(cs.backgroundColor),
      borde,
      sombras,
      opacidad: parseFloat(cs.opacity),
      nHijos: raiz.children.length,
    },
    textos: {},
    iconos: {},
    conteos: {},
    partesPresentes: [...raiz.querySelectorAll('[data-figma-part]')].map((e) => e.getAttribute('data-figma-part')),
  };

  const primerTexto = (el) => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let t;
    while ((t = w.nextNode())) if (t.textContent.trim()) return t.parentElement;
    // Campos de formulario: el valor o el placeholder no son nodos de texto
    if (el.matches('input:not([type=checkbox]):not([type=radio]), textarea')) return el;
    return el.querySelector('input:not([type=checkbox]):not([type=radio]), textarea');
  };
  const medirTexto = (el) => {
    const campo = el.matches('input, textarea');
    // Campo vacío: lo que se ve es el placeholder, con su propio color
    const c = getComputedStyle(el);
    const color = campo && !el.value ? getComputedStyle(el, '::placeholder').color : c.color;
    return {
      familia: c.fontFamily,
      tamano: px(c.fontSize),
      peso: parseInt(c.fontWeight, 10),
      linea: c.lineHeight === 'normal' ? null : px(c.lineHeight),
      color: rgba(color),
      espaciado: px(c.letterSpacing),
      contenido: (campo ? el.value || el.placeholder : el.textContent).trim().slice(0, 40),
    };
  };
  const marcados = (n) => [...(raiz.matches(sel(n)) ? [raiz] : []), ...raiz.querySelectorAll(sel(n))];
  for (const t of partes.textos) {
    let el = null;
    const todos = marcados(t.nombre);
    out.conteos[t.nombre] = todos.length;
    if (t.parte) {
      // Un nombre puede repetirse en elementos que no son este texto (p. ej. un botón de otra parte llamado
      // igual): para un nodo TEXT solo se emparejan los marcados con texto propio y sin hijos marcados iguales
      const conTexto = todos.filter((x) => primerTexto(x) && !x.querySelector(sel(t.nombre)));
      const e = (conTexto.length >= 1 && conTexto.length < todos.length ? conTexto : todos)[t.ord] || null;
      el = e && (primerTexto(e) || e);
    }
    if (!el && t.primero && todos.length === 0) el = primerTexto(raiz);
    if (el) out.textos[t.nombre + '#' + t.ord] = medirTexto(el);
  }
  const svgs = [...raiz.querySelectorAll('svg')];
  partes.iconos.forEach((ic, i) => {
    let svg = null;
    const todos = marcados(ic.nombre);
    out.conteos[ic.nombre] = todos.length;
    const e = todos[ic.ord];
    if (e) svg = e.tagName.toLowerCase() === 'svg' ? e : e.querySelector('svg');
    if (!svg && todos.length === 0) svg = svgs[i] || null;
    if (!svg) return;
    const b = svg.getBoundingClientRect();
    const c = getComputedStyle(svg);
    let color = null;
    if (c.fill && c.fill !== 'none') color = rgba(c.fill);
    else if (c.stroke && c.stroke !== 'none') color = rgba(c.stroke);
    else color = rgba(c.color);
    out.iconos[ic.nombre + '#' + ic.ord] = { w: b.width, h: b.height, color, nombre: svg.getAttribute('data-icon'), variante: svg.getAttribute('data-icon-variant') };
  });
  return out;
}

// ───────────────────────── comparación ─────────────────────────
function crearComparacion(tol) {
  const lista = [];
  const num = (prop, figma, sb, tolerancia = tol) => {
    lista.push({ propiedad: prop, figma, storybook: sb == null ? null : +(+sb).toFixed(3), ok: sb != null && Math.abs(figma - sb) <= tolerancia });
  };
  const col = (prop, figma, sb) => {
    lista.push({ propiedad: prop, figma: fmtColor(figma), storybook: fmtColor(sb), ok: coloresIguales(figma, sb) });
  };
  const txt = (prop, figma, sb, ok) => lista.push({ propiedad: prop, figma, storybook: sb, ok });
  return { lista, num, col, txt };
}

function compararVariante(variante, m, spec, tema, tol) {
  const { lista, num, col, txt } = crearComparacion(tol);
  const R = crearResolvedor(spec, tema);
  const n = variante.arbol;
  const v = n.vars || {};
  const lay = n.layout;
  const rz = m.raiz;

  // tamaño
  // Ancho HUG que depende de texto: Figma usa Helvetica y el navegador Helvetica Neue, y la métrica de la fuente
  // mueve el ancho unas décimas. Tolerancia relativa de 1 % (con tope de 3 px) solo en ese caso.
  const tolAncho = lay && lay.tamH === 'HUG' && m.__textos.length ? Math.max(tol, Math.min(n.w * 0.01, 3)) : tol;
  if (!lay || lay.tamH === 'HUG' || lay.tamH === 'FIXED') num('ancho', n.w, rz.w, tolAncho);
  if (!lay || lay.tamV === 'HUG' || lay.tamV === 'FIXED') num('alto', n.h, rz.h);

  // layout
  if (lay) {
    const claves = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
    ['arriba', 'derecha', 'abajo', 'izquierda'].forEach((lado, i) => {
      num(`padding ${lado}`, R.numDe(lay.padding[i], v[claves[i]]), rz.padding[i]);
    });
    const visibles = (n.hijos || []).filter((h) => !h.oculto).length;
    if (visibles > 1) {
      const gap = R.numDe(lay.gap, v.itemSpacing);
      // Un gap negativo no existe en CSS (se resuelve con margen negativo): se mide la distancia real entre hermanos
      const medido = gap < 0 && rz.gapReal != null ? rz.gapReal : lay.modo === 'VERTICAL' ? rz.rowGap : rz.columnGap;
      num(lay.modo === 'VERTICAL' ? 'gap (row-gap)' : 'gap (column-gap)', gap, medido);
    }
  }

  // radio
  if (n.radio !== undefined) {
    const esquinas = ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'];
    const nombres = ['sup-izq', 'sup-der', 'inf-der', 'inf-izq'];
    const valores = Array.isArray(n.radio) ? n.radio : [n.radio, n.radio, n.radio, n.radio];
    const mitad = Math.min(n.w, n.h) / 2;
    const iguales = valores.every((x) => x === valores[0]) && rz.radios.every((x) => Math.abs(x - rz.radios[0]) < 0.01);
    const lim = iguales ? [0] : [0, 1, 2, 3];
    for (const i of lim) {
      const f = R.numDe(valores[i], v[esquinas[i]]);
      const etiqueta = iguales ? 'border-radius' : `border-radius ${nombres[i]}`;
      if (f >= mitad && f > 0) {
        lista.push({ propiedad: etiqueta, figma: `${f} (píldora, ≥ ${mitad})`, storybook: +rz.radios[i].toFixed(3), ok: rz.radios[i] >= mitad - tol });
      } else {
        num(etiqueta, f, rz.radios[i]);
      }
    }
  }

  // fondo
  const rel = R.primerSolido(n.rellenos);
  if (rel || !n.rellenos) {
    const esperado = rel ? R.colorDe(rel.color, rel.var) : [0, 0, 0, 0];
    col('fondo', esperado, rz.fondo);
  }

  // trazo
  if (n.trazos && n.trazo) {
    const colorTrazo = R.colorPintura(n.trazos);
    const g = Array.isArray(n.trazo.grosor) ? n.trazo.grosor : [n.trazo.grosor, n.trazo.grosor, n.trazo.grosor, n.trazo.grosor];
    const insets = rz.sombras.filter((s) => s.inset && s.blur === 0 && s.x === 0 && s.y === 0);
    // Trazo de un solo lado con box-shadow inset desplazado (p. ej. `inset 0 1px 0 0` = arriba)
    const ladoDe = (s) => (s.y > 0 ? 0 : s.x < 0 ? 1 : s.y < 0 ? 2 : 3);
    const porLado = [0, 0, 0, 0];
    const deLado = rz.sombras.filter(esTrazoLado);
    deLado.forEach((s) => (porLado[ladoDe(s)] = Math.abs(s.x || s.y)));
    const bordeMax = Math.max(...rz.borde.grosores);
    const usaBorde = bordeMax > 0;
    const lados = ['arriba', 'derecha', 'abajo', 'izquierda'];
    const grosorSb = (i) => (usaBorde ? rz.borde.grosores[i] : insets[0] ? insets[0].spread : porLado[i]);
    const iguales = g.every((x) => x === g[0]);
    for (const i of iguales ? [0] : [0, 1, 2, 3]) {
      const sb = iguales && usaBorde ? Math.max(...rz.borde.grosores) : grosorSb(i);
      num(iguales ? 'trazo grosor' : `trazo grosor ${lados[i]}`, g[i], sb);
    }
    const idx = g.findIndex((x) => x > 0);
    const colorSb = usaBorde ? rz.borde.colores[rz.borde.grosores.findIndex((x) => x > 0)] : insets[0] ? insets[0].color : deLado[0] ? deLado[0].color : null;
    if (idx >= 0) col('trazo color', colorTrazo, colorSb || [0, 0, 0, 0]);
  } else if (!n.trazos && Math.max(...rz.borde.grosores) > 0) {
    lista.push({ propiedad: 'trazo', figma: 'sin trazo', storybook: `borde ${Math.max(...rz.borde.grosores)}px`, ok: false });
  }

  // opacidad
  num('opacidad', n.opacidad ?? 1, rz.opacidad, 0.02);

  // sombras
  const efectos = (n.efectos || []).filter((e) => e.tipo === 'DROP_SHADOW' || e.tipo === 'INNER_SHADOW');
  // La sombra de la capa `Canva` solo cuenta si Figma define el efecto en este nodo (si vive en un hijo, no se mide aquí)
  const sbSombras = rz.sombras.filter((s) => !(s.deCanva && !efectos.length)).filter((s) => !(n.trazos && ((s.inset && s.blur === 0 && s.x === 0 && s.y === 0) || esTrazoLado(s))));
  const dropSb = sbSombras.filter((s) => !s.inset);
  const innerSb = sbSombras.filter((s) => s.inset);
  const cuenta = { DROP_SHADOW: 0, INNER_SHADOW: 0 };
  for (const e of efectos) {
    const k = cuenta[e.tipo]++;
    const s = (e.tipo === 'DROP_SHADOW' ? dropSb : innerSb)[k];
    const etq = `${e.tipo === 'DROP_SHADOW' ? 'sombra' : 'sombra interior'} ${k + 1}`;
    if (!s) {
      lista.push({ propiedad: etq, figma: 'definida', storybook: 'ausente', ok: false });
      continue;
    }
    num(`${etq} x`, e.x, s.x);
    num(`${etq} y`, e.y, s.y);
    num(`${etq} blur`, e.radio, s.blur);
    // drop-shadow no tiene spread: no se compara
    if (!s.filtro) num(`${etq} spread`, e.spread || 0, s.spread);
    col(`${etq} color`, R.colorEfecto(e), s.color);
  }
  const sobran = dropSb.length - (cuenta.DROP_SHADOW || 0);
  if (sobran > 0) lista.push({ propiedad: 'sombra extra', figma: 'sin sombra', storybook: `${sobran} box-shadow`, ok: false });

  // textos
  for (const t of m.__textos) {
    const sb = m.textos[t.nombre + '#' + t.ord];
    const seg = t.nodo.texto.segmentos[0];
    const pre = `texto "${t.nombre}" `;
    if (!sb) {
      if (m.conteos[t.nombre] > 0) continue; // sin par: se resume en la entrada informativa
      lista.push({ propiedad: `${pre}presente`, figma: 'sí', storybook: 'no encontrado', ok: false });
      continue;
    }
    const fam = seg.familia.toLowerCase();
    txt(`${pre}font-family`, seg.familia, sb.familia, sb.familia.toLowerCase().includes(fam));
    const vt = t.nodo.vars || {};
    const tam = R.numDe(seg.tamano, vt.fontSize);
    num(`${pre}font-size`, tam, sb.tamano);
    num(`${pre}font-weight`, R.numDe(seg.peso, vt.fontWeight), sb.peso, 0);
    if (seg.linea !== 'auto') {
      let lh = null;
      if (typeof seg.linea === 'string' && seg.linea.endsWith('%')) lh = (parseFloat(seg.linea) / 100) * tam;
      else lh = R.numDe(parseFloat(seg.linea), vt.lineHeight);
      if (sb.linea == null) txt(`${pre}line-height`, lh, 'normal', false);
      else num(`${pre}line-height`, lh, sb.linea);
    }
    let ls = 0;
    if (typeof seg.espaciado === 'string') ls = seg.espaciado.endsWith('%') ? (parseFloat(seg.espaciado) / 100) * tam : parseFloat(seg.espaciado);
    num(`${pre}letter-spacing`, ls, sb.espaciado);
    const c = R.colorPintura(seg.color) || R.colorPintura(t.nodo.rellenos);
    if (c) col(`${pre}color`, c, sb.color);
  }

  // íconos
  m.__iconos.forEach((ic) => {
    const sb = m.iconos[ic.nombre + '#' + ic.ord];
    const pre = `ícono "${ic.nombre}" `;
    if (!sb) {
      if (m.conteos[ic.nombre] > 0) return;
      lista.push({ propiedad: `${pre}presente`, figma: 'sí', storybook: 'svg no encontrado', ok: false });
      return;
    }
    const tam = ic.size ?? ic.nodo.w;
    num(`${pre}ancho`, tam, sb.w);
    num(`${pre}alto`, tam, sb.h);
    const c = R.colorPintura(ic.nodo.icono.color);
    if (c) col(`${pre}color`, c, sb.color);
    // Dibujo: el nombre sale del manifest por figmaSetId (en Figma hay nombres repetidos)
    const esperado = MANIFEST_POR_SET[ic.nodo.icono.figmaSetId];
    lista.push({ propiedad: `${pre}dibujo`, figma: esperado ?? `${ic.nodo.icono.nombre} (${ic.nodo.icono.figmaSetId}, no está en la biblioteca)`, storybook: sb.nombre ?? '—', ok: !!esperado && sb.nombre === esperado });
    const outline = ic.nodo.icono.variante && ic.nodo.icono.variante.Outline;
    if (outline) {
      const v = outline === 'Yes' ? 'line' : 'fill';
      lista.push({ propiedad: `${pre}variante`, figma: v, storybook: sb.variante ?? '—', ok: sb.variante === v });
    }
  });
  // Nodos de la spec vs elementos marcados con el mismo nombre (solo si hay marcados)
  const enSpec = {};
  for (const x of [...m.__textos, ...m.__iconos]) enSpec[x.nombre] = (enSpec[x.nombre] || 0) + 1;
  for (const [nombre, nSpec] of Object.entries(enSpec)) {
    const nSb = m.conteos[nombre];
    if (nSb > 0 && nSb !== nSpec) lista.push({ propiedad: `partes "${nombre}"`, figma: nSpec, storybook: nSb, ok: true });
  }
  return lista;
}

// ───────────────────────── HTML ─────────────────────────
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function generarHtml(res) {
  const temas = res.temas;
  const resumen = temas
    .map((t) => {
      const r = res.resumen.porTema[t];
      const malo = r.fallos > 0 || r.faltantes > 0 || r.sobrantes > 0;
      return `<div class="card ${malo ? 'mal' : 'bien'}"><h3>${esc(t)}</h3>
        <p>${r.variantesOk}/${r.variantes} variantes sin diferencias</p>
        <p>${r.fallos} propiedades distintas de ${r.comprobaciones}</p>
        <p>${r.faltantes} variantes faltantes · ${r.sobrantes} sobrantes</p></div>`;
    })
    .join('');
  const filas = res.variantes
    .map((v) => {
      const celdas = temas
        .map((t) => {
          const d = v.porTema[t];
          const img = d.captura
            ? `<img src="${esc(d.captura)}" alt="${esc(v.nombre)} ${esc(t)}" style="width:${d.capturaW}px;height:${d.capturaH}px">`
            : '<em>No renderizada</em>';
          return `<td><div class="lienzo">${img}</div></td>`;
        })
        .join('');
      const tablas = temas
        .map((t) => {
          const d = v.porTema[t];
          if (!d.encontrada) return `<p class="err"><b>${esc(t)}</b>: no se encontró <code>data-figma="${esc(v.nombre)}"</code></p>`;
          const malas = d.comparaciones.filter((c) => !c.ok);
          if (!malas.length) return `<p class="ok"><b>${esc(t)}</b>: sin diferencias (${d.comparaciones.length} propiedades)</p>`;
          return `<table><caption>${esc(t)}</caption><thead><tr><th>Propiedad</th><th>Figma</th><th>Storybook</th></tr></thead><tbody>${malas
            .map((c) => `<tr><td>${esc(c.propiedad)}</td><td>${esc(c.figma)}</td><td>${esc(c.storybook)}</td></tr>`)
            .join('')}</tbody></table>`;
        })
        .join('');
      return `<section><h2>${esc(v.nombre)}</h2>
        <table class="fila"><thead><tr><th>Figma (2x a la mitad)</th>${temas.map((t) => `<th>Storybook ${esc(t)}</th>`).join('')}</tr></thead>
        <tbody><tr><td><div class="lienzo">${
          v.png ? `<img src="${esc((res.pngBase ? res.pngBase + '/' : '') + v.png)}" alt="Figma ${esc(v.nombre)}" style="width:${v.w}px;height:${v.h}px">` : '<em>Sin PNG</em>'
        }</div></td>${celdas}</tr></tbody></table>${tablas}</section>`;
    })
    .join('');
  const sobrantes = temas
    .map((t) => (res.sobrantes[t].length ? `<p class="err"><b>${esc(t)}</b>: data-figma sin variante en la spec: ${res.sobrantes[t].map((s) => `<code>${esc(s)}</code>`).join(', ')}</p>` : ''))
    .join('');
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Comparación ${esc(res.carpeta)}</title>
<style>
:root{--bg:#fff;--fg:#1d1c1c;--mut:#5e6165;--card:#f0f2f4;--line:#dbdde0;--ok:#016242;--err:#b3261e;--checker:#e8e8e8}
@media (prefers-color-scheme:dark){:root{--bg:#1d1c1c;--fg:#f0f2f4;--mut:#b0b4ba;--card:#2e3033;--line:#45484c;--ok:#7dd1b5;--err:#ff8a80;--checker:#3a3a3a}}
body{margin:0;padding:24px 16px;background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,sans-serif}
main{max-width:1100px;margin:0 auto}h1{margin:0 0 4px}h2{font-size:15px;margin:0 0 8px;font-family:ui-monospace,monospace}
.sub{color:var(--mut);margin:0 0 16px}.cards{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}
.card{background:var(--card);border-left:4px solid var(--ok);padding:10px 14px;border-radius:6px;min-width:220px}.card.mal{border-color:var(--err)}.card h3{margin:0 0 4px}.card p{margin:2px 0}
section{border-top:1px solid var(--line);padding:16px 0}table{border-collapse:collapse;margin:8px 0}th,td{border:1px solid var(--line);padding:4px 8px;text-align:left;vertical-align:top}
caption{text-align:left;font-weight:600;padding:4px 0}.fila td{padding:12px}
.lienzo{background:repeating-conic-gradient(var(--checker) 0 25%,transparent 0 50%) 0 0/12px 12px;padding:8px;display:inline-block;min-width:24px;min-height:24px}
.lienzo img{display:block;max-width:100%;image-rendering:pixelated}.ok{color:var(--ok)}.err{color:var(--err)}code{font-family:ui-monospace,monospace}
</style></head><body><main>
<h1>Comparación ${esc(res.carpeta)}</h1>
<p class="sub">${esc(res.story)} · tolerancia ${res.tol}px · ${esc(res.fecha)}</p>
<div class="cards">${resumen}</div>${sobrantes}${filas}
</main></body></html>`;
}

// ───────────────────────── principal ─────────────────────────
async function main() {
  const args = leerArgs(process.argv.slice(2));
  if (!args.carpeta || !args.story) {
    console.error('Uso: node scripts/figma/comparar.mjs --carpeta <carpeta> --story <id-historia> [--port 6006] [--temas dark,light] [--tol 0.5]');
    process.exit(2);
  }
  const port = args.port || '6006';
  const temas = (args.temas || 'dark,light').split(',').map((s) => s.trim()).filter(Boolean);
  const tol = args.tol !== undefined ? parseFloat(args.tol) : 0.5;
  const dirSpec = path.join(RAIZ, '.qa', 'figma', 'componentes', args.carpeta);
  const dir = args.out ? path.resolve(args.out) : dirSpec;
  fs.mkdirSync(dir, { recursive: true });
  const specPath = path.join(dirSpec, 'spec.json');
  if (!fs.existsSync(specPath)) {
    console.error(`No existe ${specPath}`);
    process.exit(2);
  }
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const slugDe = (v) =>
    v.png ? path.basename(v.png, path.extname(v.png)) : v.nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const variantes = spec.variantes.map((v) => {
    const textos = [];
    const iconos = [];
    let primero = true;
    const ords = {};
    const ordDe = (n) => (ords[n] = (ords[n] ?? -1) + 1);
    recorrer(v.arbol, (nodo) => {
      if (nodo.oculto) return;
      if (nodo.tipo === 'TEXT' && nodo.texto?.segmentos?.length) {
        textos.push({ nombre: nodo.nombre, nodo, parte: true, primero, ord: ordDe('t:' + nodo.nombre) });
        primero = false;
      }
      if (nodo.icono) {
        const size = nodo.instancia?.variante?.Size;
        iconos.push({ nombre: nodo.nombre, nodo, ord: ordDe('i:' + nodo.nombre), size: size !== undefined && !Number.isNaN(parseFloat(size)) ? parseFloat(size) : undefined });
      }
    });
    return { def: v, slug: slugDe(v), textos, iconos };
  });

  // Sin --hide-scrollbars (default de Playwright): las barras de scroll también son parte del diseño
  const browser = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
  const resultado = {
    carpeta: args.carpeta,
    story: args.story,
    tol,
    fecha: new Date().toISOString().slice(0, 16).replace('T', ' '),
    temas,
    pngBase: args.out ? path.relative(dir, dirSpec).split(path.sep).join('/') : '',
    variantes: variantes.map((v) => ({
      nombre: v.def.nombre,
      png: v.def.png || null,
      w: v.def.arbol.w,
      h: v.def.arbol.h,
      porTema: {},
    })),
    sobrantes: {},
    resumen: { porTema: {}, total: {} },
  };

  try {
    for (const tema of temas) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      const url = `http://localhost:${port}/iframe.html?id=${encodeURIComponent(args.story)}&viewMode=story&globals=theme:${tema}`;
      await page.goto(url, { waitUntil: 'load' });
      try {
        await page.waitForSelector('[data-figma]', { timeout: 20000 });
      } catch {
        await ctx.close();
        throw new Error(`La historia no renderizó ningún [data-figma] (${url}). ¿Storybook corre en el puerto ${port} y el id es correcto?`);
      }
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, tema, { timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(500); // transición de fondo del tema
      await page.evaluate(() => document.fonts.ready);

      const presentes = await page.evaluate(() => [...document.querySelectorAll('[data-figma]')].map((e) => e.getAttribute('data-figma')));
      const esperados = new Set(variantes.map((v) => v.def.nombre));
      resultado.sobrantes[tema] = [...new Set(presentes.filter((p) => !esperados.has(p)))];

      const sumario = { variantes: variantes.length, variantesOk: 0, comprobaciones: 0, fallos: 0, faltantes: 0, sobrantes: resultado.sobrantes[tema].length };
      for (let i = 0; i < variantes.length; i++) {
        const v = variantes[i];
        const salida = resultado.variantes[i].porTema;
        const m = await page.evaluate(medirEnPagina, {
          nombre: v.def.nombre,
          partes: { textos: v.textos.map((t) => ({ nombre: t.nombre, parte: t.parte, primero: t.primero, ord: t.ord })), iconos: v.iconos.map((x) => ({ nombre: x.nombre, ord: x.ord })) },
        });
        if (!m) {
          salida[tema] = { encontrada: false, comparaciones: [] };
          sumario.faltantes++;
          continue;
        }
        m.__textos = v.textos;
        m.__iconos = v.iconos;
        const comparaciones = compararVariante(v.def, m, spec, tema, tol);
        const rel = path.join('capturas', tema, `${v.slug}.png`);
        fs.mkdirSync(path.join(dir, 'capturas', tema), { recursive: true });
        const handle = await page.evaluateHandle((n) => [...document.querySelectorAll('[data-figma]')].find((e) => e.getAttribute('data-figma') === n), v.def.nombre);
        const el = handle.asElement();
        await el.scrollIntoViewIfNeeded();
        await el.screenshot({ path: path.join(dir, rel), omitBackground: false });
        const caja = await el.boundingBox();
        const fallos = comparaciones.filter((c) => !c.ok).length;
        sumario.comprobaciones += comparaciones.length;
        sumario.fallos += fallos;
        if (!fallos) sumario.variantesOk++;
        salida[tema] = { encontrada: true, captura: rel.split(path.sep).join('/'), capturaW: caja ? caja.width : 0, capturaH: caja ? caja.height : 0, comparaciones };
      }
      // variantes no encontradas cuentan como no ok
      resultado.resumen.porTema[tema] = sumario;
      await ctx.close();
    }
  } finally {
    await browser.close();
  }

  const tot = { comprobaciones: 0, fallos: 0, faltantes: 0, sobrantes: 0 };
  for (const t of temas) for (const k of Object.keys(tot)) tot[k] += resultado.resumen.porTema[t][k];
  resultado.resumen.total = tot;

  // JSON: por tema -> por variante -> lista
  const json = { carpeta: args.carpeta, story: args.story, tolerancia: tol, resumen: resultado.resumen, sobrantes: resultado.sobrantes, temas: {} };
  for (const t of temas) {
    json.temas[t] = {};
    resultado.variantes.forEach((v) => {
      const d = v.porTema[t];
      json.temas[t][v.nombre] = d.encontrada ? d.comparaciones : { faltante: true };
    });
  }
  fs.writeFileSync(path.join(dir, 'comparacion.json'), JSON.stringify(json, null, 2));
  fs.writeFileSync(path.join(dir, 'comparacion.html'), generarHtml(resultado));

  console.log(`Comparación ${args.carpeta} (${args.story}), tol ${tol}px`);
  for (const t of temas) {
    const r = resultado.resumen.porTema[t];
    console.log(`  ${t}: ${r.variantesOk}/${r.variantes} variantes ok, ${r.fallos}/${r.comprobaciones} propiedades distintas, ${r.faltantes} faltantes, ${r.sobrantes} sobrantes`);
    if (r.sobrantes) console.log(`    sobran data-figma: ${resultado.sobrantes[t].join(' | ')}`);
    for (const v of resultado.variantes) {
      const d = v.porTema[t];
      if (!d.encontrada) console.log(`    FALTA  ${v.nombre}`);
      else for (const c of d.comparaciones.filter((x) => !x.ok)) console.log(`    DIF    ${v.nombre} :: ${c.propiedad}  figma=${c.figma}  storybook=${c.storybook}`);
    }
  }
  console.log(`Informe: ${path.join(dir, 'comparacion.html')}`);
  const hayDif = tot.fallos + tot.faltantes + tot.sobrantes > 0;
  console.log(hayDif ? 'RESULTADO: con diferencias' : 'RESULTADO: sin diferencias');
  process.exit(hayDif ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(2);
});
