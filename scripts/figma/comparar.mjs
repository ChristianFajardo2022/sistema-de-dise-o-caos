#!/usr/bin/env node
/**
 * Comparador genérico Storybook vs Figma.
 *
 * Uso:
 *   node scripts/figma/comparar.mjs --carpeta badge --story data-display-badge--figma-matrix \
 *        [--port 6006] [--temas dark,light] [--tol 0.5] [--out <carpeta>] [--modo Desktop|Tablet|Mobile]
 *
 * Modo Responsive: cada variante se mide con el viewport de su modo (Desktop 1440, Tablet 800, Mobile 390) y
 * resolviendo las variables en ese modo. Sale de la spec (`modos`), o se infiere de las variables enlazadas, o
 * se fuerza con `--modo`. Variantes con nombre repetido (sets con errores) se emparejan por orden de aparición.
 *
 * Ámbito por parte (H1): cada texto de Figma se busca dentro del ancestro más cercano de Figma cuyo nombre (o alias)
 * exista como `data-figma-part` en esa variante; sin ancestro marcado se empareja en toda la variante.
 * Avisos (no cuentan como diferencia): marco que no cabe en la vista del modo (H2) y familia tipográfica de Figma sin
 * enlazar a `typography/family/*` (H4, "para diseño"). H3 mide el relleno de formas hoja con variable enlazada y
 * reporta textos del DOM sin pareja en Figma dentro de una parte marcada.
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
// Modos de la colección Responsive y el ancho de vista que activa cada uno en tokens.css
// (< 48rem = Mobile, 48rem a < 64rem = Tablet, >= 64rem = Desktop; se mide en el centro de cada tramo).
const MODOS = ['Desktop', 'Tablet', 'Mobile'];
const VIEWPORT_POR_MODO = { Desktop: 1440, Tablet: 800, Mobile: 390 };
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
function crearResolvedor(spec, tema, modoResponsive = 'Desktop') {
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
      const val = v.porModo[modoResponsive] ?? Object.values(v.porModo)[0];
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
    const val = v && v.porModo && (v.porModo[modoResponsive] ?? Object.values(v.porModo)[0]);
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

// ───────────────────────── modo Responsive de una variante ─────────────────────────
/** Nombre del modo Responsive guardado en la spec por extraer.js (`modos.explicitos` > `modos.resueltos`). */
function modoGuardado(variante) {
  const m = variante.modos || {};
  for (const grupo of [m.explicitos, m.resueltos]) {
    for (const val of Object.values(grupo || {})) if (MODOS.includes(val)) return val;
  }
  return null;
}

/**
 * Inferencia del modo para specs extraídas antes de guardar `modos`. Los frames de Figma tienen medidas (w/h)
 * y literales (padding, gap, radio, tamaño de fuente...) tomados en el modo Responsive en que estaban, mientras
 * que `variables[id].porModo` guarda el valor de la variable en cada modo. Para cada propiedad enlazada a una
 * variable cuyos valores difieren entre modos, se cuenta en qué modos coincide el literal del nodo. Gana el modo
 * con más coincidencias; en empate (p. ej. Desktop y Tablet valen igual) se prefiere Desktop > Tablet > Mobile.
 * Sin propiedades que distingan modos, devuelve null (se usa el modo por defecto).
 */
function inferirModo(variante, spec) {
  const vars = spec.variables || {};
  const puntos = Object.fromEntries(MODOS.map((m) => [m, 0]));
  let informativos = 0;
  const idDe = (x) => (Array.isArray(x) ? x[0] : x);
  const evalua = (varId, literal) => {
    const v = varId && vars[varId];
    if (!v || !v.porModo || typeof literal !== 'number' || !Number.isFinite(literal)) return;
    const vals = MODOS.map((m) => v.porModo[m]);
    if (vals.some((x) => typeof x !== 'number')) return;
    if (new Set(vals).size < 2) return;
    informativos++;
    MODOS.forEach((m, i) => {
      if (Math.abs(vals[i] - literal) < 0.01) puntos[m]++;
    });
  };
  const visitar = (n) => {
    if (n.oculto) return;
    const vv = n.vars || {};
    const pad = n.layout?.padding;
    if (pad) ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'].forEach((k, i) => evalua(idDe(vv[k]), pad[i]));
    if (n.layout) evalua(idDe(vv.itemSpacing), n.layout.gap);
    const rad = n.radio === undefined ? null : Array.isArray(n.radio) ? n.radio : [n.radio, n.radio, n.radio, n.radio];
    if (rad) {
      ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'].forEach((k, i) => evalua(idDe(vv[k]) ?? idDe(vv.cornerRadius), rad[i]));
    }
    if (n.trazo && typeof n.trazo.grosor === 'number') evalua(idDe(vv.strokeWeight), n.trazo.grosor);
    const seg = n.texto?.segmentos?.[0];
    if (seg) {
      evalua(idDe(vv.fontSize), seg.tamano);
      if (typeof seg.linea === 'string' && seg.linea.endsWith('px')) evalua(idDe(vv.lineHeight), parseFloat(seg.linea));
    }
    (n.hijos || []).forEach(visitar);
  };
  visitar(variante.arbol);
  if (!informativos) return null;
  return MODOS.reduce((mejor, m) => (puntos[m] > puntos[mejor] ? m : mejor), 'Desktop');
}

// ───────────────────────── medición en la página ─────────────────────────
/** Se ejecuta en el navegador. Devuelve valores crudos ya normalizados a rgba. */
function medirEnPagina({ nombre, k = 0, partes, conocidos = [] }) {
  const pareados = new Set();
  const busca = (x) => x.busca ?? x.nombre;
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
  // H2: si el nombre se repite en la spec, la k-ésima variante va con el k-ésimo [data-figma] igual (orden de documento)
  const raiz = [...document.querySelectorAll('[data-figma]')].filter((e) => e.getAttribute('data-figma') === nombre)[k];
  if (!raiz) return null;

  const marcados = (n) => [...(raiz.matches(sel(n)) ? [raiz] : []), ...raiz.querySelectorAll(sel(n))];
  const r = raiz.getBoundingClientRect();
  const cs = getComputedStyle(raiz);
  const radio = (prop, el, csx) => {
    const v = csx[prop].split(' ')[0];
    if (v.endsWith('%')) return (parseFloat(v) / 100) * el.getBoundingClientRect().width;
    return px(v);
  };
  // box-shadow computado -> lista. Tailwind v4 compone `--tw-inset-shadow, --tw-inset-ring-shadow,
  // --tw-ring-offset-shadow, --tw-ring-shadow, --tw-shadow` y el valor trae sombras nulas
  // (`rgba(0,0,0,0) 0 0 0 0`) antes de la real: no dibujan nada y se descartan (H1).
  const cajas = (el) => {
    const css = getComputedStyle(el).boxShadow;
    const res = [];
    if (!css || css === 'none') return res;
    for (const p of css.split(/,(?![^(]*\))/)) {
      const inset = /\binset\b/.test(p);
      const col = /(rgba?\([^)]*\)|color\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\)|#[0-9a-f]+)/i.exec(p);
      const resto = p.replace(col ? col[0] : '', '').replace('inset', '').trim().split(/\s+/).map(px);
      const s = { inset, color: rgba(col ? col[0] : null), x: resto[0] || 0, y: resto[1] || 0, blur: resto[2] || 0, spread: resto[3] || 0 };
      const nula = s.x === 0 && s.y === 0 && s.blur === 0 && s.spread === 0 && (!s.color || s.color[3] === 0);
      if (!nula) res.push(s);
    }
    return res;
  };
  const sombras = cajas(raiz);
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
  // Capa de superficie `Canva`: filter y box-shadow, en la capa (on-card) o en su primer hijo (on-canva) (H2)
  for (const capa of raiz.querySelectorAll(sel('Canva'))) {
    // Si la capa ya trae sombra (on-card) se usa esa; la del primer hijo es la variante on-canva y solo cuenta
    // cuando la capa no tiene ninguna (si no, cada tarjeta mostraría dos sombras)
    let propias = [...filtros(capa), ...cajas(capa)];
    if (!propias.length && capa.firstElementChild) propias = cajas(capa.firstElementChild);
    sombras.push(...propias.map((f) => ({ ...f, deCanva: true })));
  }
  // Distancia real entre los dos primeros hijos visibles (para gaps negativos de Figma, que en CSS son márgenes)
  const hijosVis = [...raiz.children].filter((h) => h.getBoundingClientRect().height > 0 || h.getBoundingClientRect().width > 0);
  const vertical = cs.flexDirection.startsWith('column') || (cs.display !== 'flex' && cs.display !== 'inline-flex');
  let gapReal = null;
  if (hijosVis.length > 1) {
    const a = hijosVis[0].getBoundingClientRect();
    const b = hijosVis[1].getBoundingClientRect();
    gapReal = vertical ? b.top - a.bottom : b.left - a.right;
  }
  // Hijos absolutos + posición del primer texto respecto de la raíz (H4: gaps negativos de Figma)
  const hayAbs = [...raiz.children].some((h) => getComputedStyle(h).position === 'absolute');
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
      hayAbs,
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
    // H2: la caja de la raíz frente al ancho de la vista (con el scroll horizontal, que no cambia lo medido)
    vista: { ancho: document.documentElement.clientWidth, izq: r.left + window.scrollX, der: r.right + window.scrollX },
    formas: {},
    sinPareja: [],
  };
  // H1: ancestro más cercano de Figma que existe como parte marcada en el DOM de esta variante
  const alcanceDe = (cadena) => {
    for (const [k, a] of (cadena || []).entries()) {
      const els = marcados(a.b);
      if (els.length && els.length === a.cnt) return { el: els[a.idx], ord: a.ordEn, k, tot: a.tot };
    }
    return null;
  };

  const primerTexto = (el) => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let t;
    while ((t = w.nextNode())) if (t.textContent.trim()) return t.parentElement;
    // Campos de formulario: el valor o el placeholder no son nodos de texto
    if (el.matches('input:not([type=checkbox]):not([type=radio]), textarea')) return el;
    return el.querySelector('input:not([type=checkbox]):not([type=radio]), textarea');
  };
  // Primer texto visual (menor y, luego menor x): el orden del DOM no siempre es el orden en que se ve (H4)
  const primerTextoVisual = (el) => {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let t, mejor = null, mb = null;
    while ((t = w.nextNode())) {
      if (!t.textContent.trim()) continue;
      const p = t.parentElement;
      const b = p.getBoundingClientRect();
      if (!b.width && !b.height) continue;
      if (!mejor || b.top < mb.top - 0.5 || (Math.abs(b.top - mb.top) <= 0.5 && b.left < mb.left)) {
        mejor = p;
        mb = b;
      }
    }
    return mejor || primerTexto(el);
  };
  {
    const pt = primerTextoVisual(raiz);
    if (pt) {
      const b = pt.getBoundingClientRect();
      out.raiz.primerTextoPos = { x: b.left - r.left, y: b.top - r.top };
    }
  }
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
  for (const t of partes.textos) {
    let el = null;
    let todos = marcados(busca(t));
    // H3: un texto del mismo nombre que vive dentro de otra parte marcada es otro elemento (p. ej. el "+2" de un
    // AvatarGroup, también marcado "Button", dentro del bloque de medios "Frame 6"): se excluye, igual que los svg.
    // Solo cuenta la parte que existe en la spec con otro nombre y no es ancestro de este texto; las partes que la
    // spec no conoce (envoltorios propios del código) no excluyen. Solo se aplica si tras excluir quedan al menos
    // tantos elementos como textos con ese nombre en la spec (si no, se perdería el emparejamiento por orden).
    if (t.parte && t.anc) {
      const permitidos = new Set(t.anc);
      const sabidos = new Set(conocidos);
      const propios = todos.filter((x) => {
        for (let a = x.parentElement; a && a !== raiz; a = a.parentElement) {
          const nom = a.getAttribute('data-figma-part');
          if (nom && sabidos.has(nom) && !permitidos.has(nom)) return false;
        }
        return true;
      });
      const nSpec = partes.textos.filter((x) => x.nombre === t.nombre).length;
      if (propios.length >= nSpec) todos = propios;
    }
    out.conteos[t.nombre] = todos.length;
    // H1: candidatos solo dentro del ancestro marcado más cercano (y el ordinal se cuenta dentro de él); si ahí no
    // hay ninguno se vuelve al comportamiento de toda la variante
    let ordT = t.ord;
    const alc = alcanceDe(t.cadena);
    if (alc) {
      const dentro = todos.filter((x) => alc.el.contains(x));
      if (dentro.length) {
        todos = dentro;
        ordT = alc.ord;
      }
    }
    if (t.parte) {
      // Un nombre puede repetirse en elementos que no son este texto (p. ej. un botón de otra parte llamado
      // igual): para un nodo TEXT solo se emparejan los marcados con texto propio y sin hijos marcados iguales
      const conTexto = todos.filter((x) => primerTexto(x) && !x.querySelector(sel(busca(t))));
      const e = (conTexto.length >= 1 && conTexto.length < todos.length ? conTexto : todos)[ordT] || null;
      el = e && (primerTexto(e) || e);
    }
    if (!el && t.primero && todos.length === 0) el = primerTexto(raiz);
    if (el) {
      out.textos[t.nombre + '#' + t.ord] = medirTexto(el);
      pareados.add(el);
    }
  }
  // H3: formas hoja con relleno enlazado a variable. Se buscan, dentro de la parte marcada más cercana, los elementos
  // visibles del mismo tamaño y se emparejan por orden (como los íconos). Sin parte marcada o sin candidato no se mide.
  (partes.formas || []).forEach((f, i) => {
    const alc = alcanceDe(f.cadena);
    if (!alc) return;
    const visible = (e) => {
      const c = getComputedStyle(e);
      const col = rgba(c.backgroundColor);
      if (col && col[3] > 0.01) return col;
      const rel = e instanceof SVGElement && c.fill && c.fill !== 'none' ? rgba(c.fill) : null;
      return rel && rel[3] > 0.01 ? rel : null;
    };
    // Forma marcada con su nombre dentro de la parte: se mide ella (o su primer descendiente con relleno visible)
    const propias = marcados(f.busca ?? f.nombre).filter((e) => alc.el.contains(e));
    if (propias.length) {
      // Solo si el DOM trae tantas como Figma dentro de esa parte (si no, el orden no es comparable)
      if (propias.length !== f.totNombre[alc.k]) return;
      const e = propias[f.ordNombre[alc.k] ?? 0] || null;
      if (!e) return;
      const col = [e, ...e.querySelectorAll('*')].map(visible).find(Boolean);
      if (col) out.formas[i] = col;
      return;
    }
    const cand = [];
    for (const e of alc.el.querySelectorAll('*')) {
      if (e.hasAttribute('data-icon') || e.closest('[data-icon]')) continue;
      const b = e.getBoundingClientRect();
      if (Math.abs(b.width - f.w) > 1.5 || Math.abs(b.height - f.h) > 1.5) continue;
      const c = getComputedStyle(e);
      const col = rgba(c.backgroundColor);
      const rel = col && col[3] > 0.01 ? col : e instanceof SVGElement && c.fill && c.fill !== 'none' ? rgba(c.fill) : null;
      if (rel && rel[3] > 0.01) cand.push({ e, color: rel });
    }
    // Se queda la más interna cuando una envuelve a otra del mismo tamaño
    const hojas = cand.filter((x) => !cand.some((y) => y !== x && x.e.contains(y.e)));
    if (hojas.length !== alc.tot) return;
    const hit = hojas[alc.ord];
    if (hit) out.formas[i] = hit.color;
  });
  // H3: textos del DOM sin pareja en Figma dentro de una parte marcada (que Figma conoce por nombre)
  {
    const sabidos = new Set(conocidos);
    const vistos = new Set();
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    let tn;
    while ((tn = w.nextNode())) {
      if (!tn.textContent.trim()) continue;
      const p = tn.parentElement;
      if (!p || vistos.has(p) || p.closest('svg, script, style')) continue;
      vistos.add(p);
      const b = p.getBoundingClientRect();
      if (b.width <= 1 || b.height <= 1) continue;
      if ([...pareados].some((e) => e === p || e.contains(p) || p.contains(e))) continue;
      const parte = p.closest('[data-figma-part]');
      if (!parte || parte === raiz || !raiz.contains(parte) || !sabidos.has(parte.getAttribute('data-figma-part'))) continue;
      out.sinPareja.push({ parte: parte.getAttribute('data-figma-part'), contenido: p.textContent.trim().slice(0, 40) });
    }
  }
  const svgs = [...raiz.querySelectorAll('svg')];
  // Íconos sin marca propia: se emparejan por cercanía de posición respecto de la raíz (no por orden del DOM)
  const libresDe = (ic) =>
    svgs.filter((x) => {
      const dueno = x.closest('[data-figma-part]');
      return !dueno || dueno.getAttribute('data-figma-part') === busca(ic);
    });
  // Candidatos de un ícono: los svg de las partes marcadas con su nombre o, si no hay marcadas, los libres
  const candidatos = (ic) => {
    const todos = marcados(busca(ic));
    if (!todos.length) return libresDe(ic);
    return todos.map((e) => (e.tagName.toLowerCase() === 'svg' ? e : e.querySelector('svg'))).filter(Boolean);
  };
  const asignado = new Map();
  {
    // Con una sola parte marcada el emparejamiento ya es trivial; con varias (o ninguna) se usa la posición
    const pend = partes.iconos.map((ic, i) => ({ ic, i })).filter(({ ic }) => marcados(busca(ic)).length !== 1 && ic.pos);
    const pares = [];
    for (const { ic, i } of pend) {
      for (const sv of candidatos(ic)) {
        const b = sv.getBoundingClientRect();
        pares.push({ i, sv, d: Math.hypot(b.left - r.left - ic.pos.x, b.top - r.top - ic.pos.y) });
      }
    }
    pares.sort((a, b) => a.d - b.d);
    const usados = new Set();
    for (const p of pares) {
      if (asignado.has(p.i) || usados.has(p.sv)) continue;
      asignado.set(p.i, p.sv);
      usados.add(p.sv);
    }
  }
  partes.iconos.forEach((ic, i) => {
    let svg = null;
    const todos = marcados(busca(ic));
    out.conteos[ic.nombre] = todos.length;
    const e = todos[ic.ord];
    if (asignado.has(i)) svg = asignado.get(i);
    else if (e) svg = e.tagName.toLowerCase() === 'svg' ? e : e.querySelector('svg');
    if (!svg && todos.length === 0) {
      // Respaldo por posición (H3: se ignoran los svg que viven dentro de otra parte marcada con otro nombre)
      svg = asignado.get(i) || libresDe(ic)[i] || null;
    }
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

/** Posición {x,y} del primer nodo de texto visible respecto de la raíz (suma de x/y de los ancestros). */
function posPrimerTexto(raiz) {
  // El primero en orden visual (menor y, luego menor x), igual que en la página
  let mejor = null;
  const buscar = (nodo, x, y) => {
    if (nodo.oculto) return;
    if (nodo.tipo === 'TEXT' && nodo.texto?.segmentos?.length) {
      if (!mejor || y < mejor.y - 0.5 || (Math.abs(y - mejor.y) <= 0.5 && x < mejor.x)) mejor = { x, y };
    }
    for (const h of nodo.hijos || []) buscar(h, x + (h.x || 0), y + (h.y || 0));
  };
  buscar(raiz, 0, 0);
  return mejor;
}

function compararVariante(variante, m, spec, tema, tol, modo) {
  const { lista, num, col, txt } = crearComparacion(tol);
  // Avisos del informe (no cuentan como diferencia): H2 marco fuera de la vista, H4 tipografía "para diseño"
  const avisos = [];
  const diseno = [];
  const R = crearResolvedor(spec, tema, modo);
  const n = variante.arbol;
  const v = n.vars || {};
  const lay = n.layout;
  const rz = m.raiz;

  // tamaño
  // Ancho HUG que depende de texto: Figma usa Helvetica y el navegador Helvetica Neue, y la métrica de la fuente
  // mueve el ancho unas décimas. Solo en ese caso: max(tol, 1,5 px, 1 % del ancho) con tope de 3 px.
  const tolAncho = lay && lay.tamH === 'HUG' && m.__textos.length ? Math.min(Math.max(tol, 1.5, n.w * 0.01), 3) : tol;
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
      const pos = gap < 0 && rz.hayAbs && rz.primerTextoPos ? posPrimerTexto(n) : null;
      if (pos) {
        // Gap negativo con hijos absolutos: en Figma el aire va por fuera de la caja y en código dentro (padding),
        // así que la distancia entre cajas no es comparable; se compara dónde queda el primer texto (H4)
        const eje = lay.modo === 'VERTICAL' ? 'y' : 'x';
        num(`posición ${eje} del primer texto (gap negativo ${gap})`, pos[eje], rz.primerTextoPos[eje]);
      } else num(lay.modo === 'VERTICAL' ? 'gap (row-gap)' : 'gap (column-gap)', gap, medido);
    }
  }

  // radio
  // Raíz de Figma sin relleno ni trazo: el radio no se ve ahí (vive en un hijo) y el código lo necesita en la raíz
  // para recortar la sombra; no se compara (H5)
  // Solo se omite cuando Figma da radio 0 y el código tiene radio (si Figma pide un radio, se sigue comparando).
  const sinCuerpo =
    !R.primerSolido(n.rellenos) &&
    !(n.trazos && n.trazos.length) &&
    (n.hijos || []).some((h) => !h.oculto) &&
    [].concat(n.radio ?? 0).every((x) => x === 0) &&
    rz.radios.some((x) => x > 0);
  if (n.radio !== undefined && sinCuerpo) {
    lista.push({ propiedad: 'border-radius (raíz sin relleno ni trazo)', figma: 'no se compara', storybook: +rz.radios[0].toFixed(3), ok: true });
  } else if (n.radio !== undefined) {
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
    const vt = t.nodo.vars || {};
    // H4: una familia de Figma que no está enlazada a `typography/family/*` es un asunto de diseño, no de código
    const famVar = vt.fontFamily && spec.variables?.[vt.fontFamily];
    const famEnlazada = vt.fontFamily ? (famVar ? /^typography\/family\//i.test(famVar.nombre || '') : true) : false;
    const famIgual = sb.familia.toLowerCase().includes(fam);
    if (!famEnlazada && !famIgual) {
      diseno.push({ propiedad: `${pre}font-family (sin variable typography/family/*)`, figma: seg.familia, storybook: sb.familia });
    } else {
      txt(`${pre}font-family`, seg.familia, sb.familia, famIgual);
    }
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
  // H3: relleno de las formas hoja con variable enlazada
  (m.__formas || []).forEach((f, i) => {
    const sb = m.formas && m.formas[i];
    if (!sb) return;
    const c = R.colorPintura(f.nodo.rellenos);
    if (c) col(`forma "${f.nombre}" relleno`, c, sb);
  });
  // H3: textos del DOM sin pareja en Figma dentro de una parte marcada
  // (si el texto del DOM se llama igual que un texto de Figma que quedó sin pareja, ya lo cubre su entrada "presente")
  const sinParNombres = new Set(m.__textos.filter((t) => !m.textos[t.nombre + '#' + t.ord]).map((t) => t.nombre.trim().toLowerCase()));
  const sinParejaVisibles = (m.sinPareja || []).filter((y) => !sinParNombres.has(y.contenido.trim().toLowerCase()));
  // H2: el marco no cabe en la vista del modo
  if (m.vista && (m.vista.der > m.vista.ancho + 0.5 || m.vista.izq < -0.5)) {
    avisos.push({
      propiedad: 'marco fuera de la vista',
      detalle: `vista ${modo} de ${m.vista.ancho} px; el marco va de ${+m.vista.izq.toFixed(1)} a ${+m.vista.der.toFixed(1)} px: la captura y las medidas pueden salir cortadas (revisar el padding de la historia)`,
    });
  }
  // Los textos sin pareja son avisos (sección propia), no diferencias
  for (const x of sinParejaVisibles) avisos.push({ tipo: 'sin-pareja', propiedad: `parte "${x.parte}"`, detalle: x.contenido });
  lista.avisos = avisos;
  lista.diseno = diseno;
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
          const av =
            (d.avisos || []).filter((a) => a.tipo !== 'sin-pareja').map((a) => `<p class="warn"><b>${esc(t)}</b> · aviso: ${esc(a.propiedad)}. ${esc(a.detalle)}</p>`).join('') +
            ((d.avisos || []).some((a) => a.tipo === 'sin-pareja')
              ? `<table class="dis"><caption>${esc(t)} · Textos sin pareja en Figma (aviso, no cuenta como diferencia)</caption><thead><tr><th>Parte marcada</th><th>Texto del DOM</th></tr></thead><tbody>${d.avisos
                  .filter((a) => a.tipo === 'sin-pareja')
                  .map((a) => `<tr><td>${esc(a.propiedad)}</td><td>${esc(a.detalle)}</td></tr>`)
                  .join('')}</tbody></table>`
              : '');
          const di = (d.diseno || []).length
            ? `<table class="dis"><caption>${esc(t)} · para diseño (no cuenta como diferencia de código)</caption><thead><tr><th>Propiedad</th><th>Figma</th><th>Storybook</th></tr></thead><tbody>${d.diseno
                .map((c) => `<tr><td>${esc(c.propiedad)}</td><td>${esc(c.figma)}</td><td>${esc(c.storybook)}</td></tr>`)
                .join('')}</tbody></table>`
            : '';
          if (!malas.length) return `${av}<p class="ok"><b>${esc(t)}</b>: sin diferencias (${d.comparaciones.length} propiedades)</p>${di}`;
          return `${av}${di}<table><caption>${esc(t)}</caption><thead><tr><th>Propiedad</th><th>Figma</th><th>Storybook</th></tr></thead><tbody>${malas
            .map((c) => `<tr><td>${esc(c.propiedad)}</td><td>${esc(c.figma)}</td><td>${esc(c.storybook)}</td></tr>`)
            .join('')}</tbody></table>`;
        })
        .join('');
      return `<section><h2>${esc(v.nombre)} <small>· modo ${esc(v.modo)} (${esc(v.origenModo)}, vista ${VIEWPORT_POR_MODO[v.modo]} px)</small></h2>
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
:root{--bg:#fff;--fg:#1d1c1c;--mut:#5e6165;--card:#f0f2f4;--line:#dbdde0;--ok:#016242;--err:#b3261e;--warn:#8a5a00;--checker:#e8e8e8}
@media (prefers-color-scheme:dark){:root{--bg:#1d1c1c;--fg:#f0f2f4;--mut:#b0b4ba;--card:#2e3033;--line:#45484c;--ok:#7dd1b5;--err:#ff8a80;--warn:#f2c14e;--checker:#3a3a3a}}
body{margin:0;padding:24px 16px;background:var(--bg);color:var(--fg);font:14px/1.45 system-ui,sans-serif}
main{max-width:1100px;margin:0 auto}h1{margin:0 0 4px}h2{font-size:15px;margin:0 0 8px;font-family:ui-monospace,monospace}
.sub{color:var(--mut);margin:0 0 16px}.cards{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}
.card{background:var(--card);border-left:4px solid var(--ok);padding:10px 14px;border-radius:6px;min-width:220px}.card.mal{border-color:var(--err)}.card h3{margin:0 0 4px}.card p{margin:2px 0}
section{border-top:1px solid var(--line);padding:16px 0}table{border-collapse:collapse;margin:8px 0}th,td{border:1px solid var(--line);padding:4px 8px;text-align:left;vertical-align:top}
caption{text-align:left;font-weight:600;padding:4px 0}.fila td{padding:12px}
.lienzo{background:repeating-conic-gradient(var(--checker) 0 25%,transparent 0 50%) 0 0/12px 12px;padding:8px;display:inline-block;min-width:24px;min-height:24px}
.lienzo img{display:block;max-width:100%;image-rendering:pixelated}.ok{color:var(--ok)}.err{color:var(--err)}.warn{color:var(--warn)}.dis caption{color:var(--mut)}code{font-family:ui-monospace,monospace}
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
    console.error('Uso: node scripts/figma/comparar.mjs --carpeta <carpeta> --story <id-historia> [--port 6006] [--temas dark,light] [--tol 0.5] [--modo Desktop|Tablet|Mobile]');
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

  // Mapa opcional de alias (fuera del repo): nombre de capa en Figma -> data-figma-part en código
  let aliasCarpeta = {};
  try {
    aliasCarpeta = JSON.parse(fs.readFileSync(path.join(RAIZ, '.qa', 'figma', 'alias.json'), 'utf8'))[args.carpeta] || {};
  } catch {}

  const R0 = crearResolvedor(spec, 'dark');
  const variantes = spec.variantes.map((v) => {
    const textos = [];
    const iconos = [];
    const formas = [];
    // H1/H3: cadena de ancestros (la raíz de la variante no cuenta) con el índice de cada uno entre los de su nombre y
    // los ordinales de los textos / formas dentro de él
    const idxAnc = {};
    const cadenaDe = (ancs, clave) =>
      ancs.slice().reverse().map((a) => ({ a, clave, ordEn: (a.conteo[clave] = (a.conteo[clave] ?? -1) + 1) }));
    const esForma = (n) =>
      ['ELLIPSE', 'RECTANGLE', 'VECTOR', 'POLYGON', 'STAR', 'LINE', 'BOOLEAN_OPERATION'].includes(n.tipo) &&
      !n.icono &&
      !(n.hijos || []).some((h) => !h.oculto) &&
      (n.opacidad ?? 1) === 1;
    let primero = true;
    const ords = {};
    const ordDe = (n) => (ords[n] = (ords[n] ?? -1) + 1);
    const visitar = (nodo, x, y, anc = [], ancs = []) => {
      if (nodo.oculto) return;
      if (nodo.tipo === 'TEXT' && nodo.texto?.segmentos?.length) {
        textos.push({ nombre: nodo.nombre, busca: aliasCarpeta[nodo.nombre], nodo, parte: true, primero, ord: ordDe('t:' + nodo.nombre), anc, cadena: cadenaDe(ancs, 't:' + nodo.nombre) });
        primero = false;
      }
      if (esForma(nodo) && R0.primerSolido(nodo.rellenos)?.var) {
        formas.push({ nombre: nodo.nombre, busca: aliasCarpeta[nodo.nombre], nodo, w: nodo.w, h: nodo.h, cadena: cadenaDe(ancs, `f:${nodo.w}x${nodo.h}`), cadenaNombre: cadenaDe(ancs, `fn:${nodo.nombre}`) });
      }
      if (nodo.icono) {
        const size = nodo.instancia?.variante?.Size;
        iconos.push({ nombre: nodo.nombre, busca: aliasCarpeta[nodo.nombre], pos: { x, y }, nodo, ord: ordDe('i:' + nodo.nombre), size: size !== undefined && !Number.isNaN(parseFloat(size)) ? parseFloat(size) : undefined });
      }
      // Nombres de los ancestros (y su alias en código) para H3; la raíz de la variante no cuenta
      const sig = nodo === v.arbol ? anc : [...anc, nodo.nombre, ...(aliasCarpeta[nodo.nombre] ? [aliasCarpeta[nodo.nombre]] : [])];
      let sigAncs = ancs;
      if (nodo !== v.arbol) {
        const idx = (idxAnc[nodo.nombre] = (idxAnc[nodo.nombre] ?? -1) + 1);
        sigAncs = [...ancs, { nombre: nodo.nombre, b: aliasCarpeta[nodo.nombre] ?? nodo.nombre, idx, conteo: {} }];
      }
      for (const h of nodo.hijos || []) visitar(h, x + (h.x || 0), y + (h.y || 0), sig, sigAncs);
    };
    visitar(v.arbol, 0, 0);
    // Total de nodos de Figma por nombre (para saber si el DOM trae las mismas instancias de una parte)
    const totAnc = {};
    const contar = (n) => {
      if (n.oculto) return;
      if (n !== v.arbol) totAnc[n.nombre] = (totAnc[n.nombre] || 0) + 1;
      (n.hijos || []).forEach(contar);
    };
    contar(v.arbol);
    const aPlano = (lista) =>
      lista.forEach((t) => (t.cadena = t.cadena.map(({ a, ordEn, clave }) => ({ n: a.nombre, b: a.b, idx: a.idx, cnt: totAnc[a.nombre], ordEn, tot: a.conteo[clave] }))));
    aPlano(textos);
    aPlano(formas);
    // ordinal de cada forma dentro de su ancestro entre las del mismo nombre (partes marcadas)
    formas.forEach((f) => (f.ordNombre = f.cadenaNombre.map(({ ordEn }) => ordEn)));
    formas.forEach((f) => (f.totNombre = f.cadenaNombre.map(({ a, clave }) => a.conteo[clave])));
    const conocidos = new Set();
    const nombrar = (n) => {
      conocidos.add(n.nombre);
      if (aliasCarpeta[n.nombre]) conocidos.add(aliasCarpeta[n.nombre]);
      (n.hijos || []).forEach(nombrar);
    };
    (v.arbol.hijos || []).forEach(nombrar);
    return { def: v, slug: slugDe(v), textos, iconos, formas, conocidos: [...conocidos] };
  });

  // H2: nombres repetidos en la spec (sets con errores): la k-ésima con el mismo nombre se mide contra el k-ésimo
  // [data-figma] igual; la clave del informe pasa a `nombre#k` (k desde 1) solo para los repetidos.
  const vistos = {};
  const total = {};
  variantes.forEach((v) => (total[v.def.nombre] = (total[v.def.nombre] || 0) + 1));
  for (const v of variantes) {
    v.k = vistos[v.def.nombre] = (vistos[v.def.nombre] ?? -1) + 1;
    v.clave = total[v.def.nombre] > 1 ? `${v.def.nombre}#${v.k + 1}` : v.def.nombre;
    if (total[v.def.nombre] > 1) v.slug = `${v.slug}-${v.k + 1}`;
    // Modo Responsive: --modo (forzado) > guardado en la spec > inferido de las variables > Desktop
    const forzado = args.modo && MODOS.find((m) => m.toLowerCase() === args.modo.toLowerCase());
    if (args.modo && !forzado) throw new Error(`--modo debe ser ${MODOS.join(', ')}`);
    const guardado = modoGuardado(v.def);
    const inferido = guardado || forzado ? null : inferirModo(v.def, spec);
    v.modo = forzado || guardado || inferido || 'Desktop';
    v.origenModo = forzado ? 'forzado' : guardado ? 'spec' : inferido ? 'inferido' : 'por defecto';
  }

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
      nombre: v.clave,
      modo: v.modo,
      origenModo: v.origenModo,
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
      const sumario = { variantes: variantes.length, variantesOk: 0, comprobaciones: 0, fallos: 0, faltantes: 0, sobrantes: 0 };
      // Una página por modo Responsive, con el ancho de vista que activa ese modo en tokens.css
      for (const modo of MODOS) {
        const grupo = variantes.map((v, i) => ({ v, i })).filter(({ v }) => v.modo === modo);
        if (!grupo.length) continue;
        const ctx = await browser.newContext({ viewport: { width: VIEWPORT_POR_MODO[modo], height: 900 }, deviceScaleFactor: 2 });
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

        if (!resultado.sobrantes[tema]) {
          const presentes = await page.evaluate(() => [...document.querySelectorAll('[data-figma]')].map((e) => e.getAttribute('data-figma')));
          const esperados = new Set(variantes.map((v) => v.def.nombre));
          resultado.sobrantes[tema] = [...new Set(presentes.filter((p) => !esperados.has(p)))];
          sumario.sobrantes = resultado.sobrantes[tema].length;
        }

        for (const { v, i } of grupo) {
          const salida = resultado.variantes[i].porTema;
          const m = await page.evaluate(medirEnPagina, {
            nombre: v.def.nombre,
            k: v.k,
            conocidos: v.conocidos,
            partes: { textos: v.textos.map((t) => ({ nombre: t.nombre, busca: t.busca, parte: t.parte, primero: t.primero, ord: t.ord, anc: t.anc, cadena: t.cadena })), formas: v.formas.map((f) => ({ nombre: f.nombre, busca: f.busca, w: f.w, h: f.h, cadena: f.cadena, ordNombre: f.ordNombre, totNombre: f.totNombre })), iconos: v.iconos.map((x) => ({ nombre: x.nombre, busca: x.busca, ord: x.ord, pos: x.pos })) },
          });
          if (!m) {
            salida[tema] = { encontrada: false, comparaciones: [] };
            sumario.faltantes++;
            continue;
          }
          m.__textos = v.textos;
          m.__iconos = v.iconos;
          m.__formas = v.formas;
          const comparaciones = compararVariante(v.def, m, spec, tema, tol, v.modo);
          const rel = path.join('capturas', tema, `${v.slug}.png`);
          fs.mkdirSync(path.join(dir, 'capturas', tema), { recursive: true });
          const handle = await page.evaluateHandle(([n, k]) => [...document.querySelectorAll('[data-figma]')].filter((e) => e.getAttribute('data-figma') === n)[k], [v.def.nombre, v.k]);
          const el = handle.asElement();
          await el.scrollIntoViewIfNeeded();
          await el.screenshot({ path: path.join(dir, rel), omitBackground: false });
          const caja = await el.boundingBox();
          const fallos = comparaciones.filter((c) => !c.ok).length;
          sumario.comprobaciones += comparaciones.length;
          sumario.fallos += fallos;
          if (!fallos) sumario.variantesOk++;
          salida[tema] = { encontrada: true, captura: rel.split(path.sep).join('/'), capturaW: caja ? caja.width : 0, capturaH: caja ? caja.height : 0, comparaciones, avisos: comparaciones.avisos || [], diseno: comparaciones.diseno || [] };
        }
        await ctx.close();
      }
      // variantes no encontradas cuentan como no ok
      resultado.resumen.porTema[tema] = sumario;
    }
  } finally {
    await browser.close();
  }

  const tot = { comprobaciones: 0, fallos: 0, faltantes: 0, sobrantes: 0 };
  for (const t of temas) for (const k of Object.keys(tot)) tot[k] += resultado.resumen.porTema[t][k];
  resultado.resumen.total = tot;

  // JSON: por tema -> por variante -> lista
  const json = { carpeta: args.carpeta, story: args.story, tolerancia: tol, resumen: resultado.resumen, sobrantes: resultado.sobrantes, modos: Object.fromEntries(resultado.variantes.map((v) => [v.nombre, `${v.modo} (${v.origenModo})`])), temas: {} };
  for (const t of temas) {
    json.temas[t] = {};
    resultado.variantes.forEach((v) => {
      const d = v.porTema[t];
      json.temas[t][v.nombre] = d.encontrada ? d.comparaciones : { faltante: true };
    });
  }
  // Avisos (H2) y "para diseño" (H4) por tema -> variante; solo si hay
  for (const clave of ['avisos', 'diseno']) {
    for (const t of temas) {
      for (const v of resultado.variantes) {
        const lst = v.porTema[t][clave];
        if (lst && lst.length) ((json[clave] ??= {})[t] ??= {})[v.nombre] = lst;
      }
    }
  }
  fs.writeFileSync(path.join(dir, 'comparacion.json'), JSON.stringify(json, null, 2));
  fs.writeFileSync(path.join(dir, 'comparacion.html'), generarHtml(resultado));

  console.log(`Comparación ${args.carpeta} (${args.story}), tol ${tol}px`);
  const porModo = {};
  for (const v of resultado.variantes) porModo[`${v.modo} (${v.origenModo})`] = (porModo[`${v.modo} (${v.origenModo})`] || 0) + 1;
  console.log(`  modos Responsive: ${Object.entries(porModo).map(([k, n]) => `${k} ×${n}`).join(', ')}`);
  for (const t of temas) {
    const r = resultado.resumen.porTema[t];
    console.log(`  ${t}: ${r.variantesOk}/${r.variantes} variantes ok, ${r.fallos}/${r.comprobaciones} propiedades distintas, ${r.faltantes} faltantes, ${r.sobrantes} sobrantes`);
    if (r.sobrantes) console.log(`    sobran data-figma: ${resultado.sobrantes[t].join(' | ')}`);
    for (const v of resultado.variantes) {
      const d = v.porTema[t];
      if (!d.encontrada) console.log(`    FALTA  ${v.nombre}`);
      else {
        for (const c of d.comparaciones.filter((x) => !x.ok)) console.log(`    DIF    ${v.nombre} :: ${c.propiedad}  figma=${c.figma}  storybook=${c.storybook}`);
        for (const a of d.avisos || []) console.log(a.tipo === 'sin-pareja' ? `    SIN PAREJA EN FIGMA  ${v.nombre} :: ${a.propiedad}: "${a.detalle}"` : `    AVISO  ${v.nombre} :: ${a.propiedad}: ${a.detalle}`);
        for (const c of d.diseno || []) console.log(`    DISEÑO ${v.nombre} :: ${c.propiedad}  figma=${c.figma}  storybook=${c.storybook}`);
      }
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
