#!/usr/bin/env node
/**
 * Verifica las páginas Docs de Storybook (plantilla v2) contra un Storybook en marcha (dev o build estático).
 *
 * Uso:
 *   node scripts/docs/verificar-docs.mjs --port 6013 --id general-controls-button--docs [--id otro--docs …]
 *   node scripts/docs/verificar-docs.mjs --port 6013 --todos --salida resultado.json
 *
 * Opciones: --host <h> (localhost) · --sin-axe (omite axe) · --anchos 1440,1288,1000,900,390 · --salida <archivo.json>
 * Los ids son los de index.json terminados en `--docs`. Tema por URL: `&globals=theme:light`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

// ───────── argumentos ─────────
const args = process.argv.slice(2);
const opt = { port: null, host: 'localhost', ids: [], todos: false, salida: null, axe: true, anchos: [1440, 1288, 1000, 900, 390] };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--port') opt.port = args[++i];
  else if (a === '--host') opt.host = args[++i];
  else if (a === '--id') opt.ids.push(args[++i]);
  else if (a === '--todos') opt.todos = true;
  else if (a === '--salida') opt.salida = args[++i];
  else if (a === '--sin-axe') opt.axe = false;
  else if (a === '--anchos') opt.anchos = args[++i].split(',').map(Number);
  else if (a === '-h' || a === '--help') {
    console.log(readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0].replace(/^\/\*\*|^ \* ?/gm, ''));
    process.exit(0);
  }
}
if (!opt.port || (!opt.ids.length && !opt.todos)) {
  console.error('Uso: node scripts/docs/verificar-docs.mjs --port <p> (--id <docs-id> … | --todos) [--salida <archivo.json>]');
  process.exit(1);
}
const base = `http://${opt.host}:${opt.port}`;
const PESTANAS = ['Definición', 'Aplicación', 'Desarrollo'];
const normalizar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ───────── funciones que corren dentro de la página ─────────

/** Elementos en flujo más anchos que su padre (dentro de `raiz`). */
function enPaginaDesbordes(raizSel) {
  const raiz = document.querySelector(raizSel) ?? document.body;
  const sel = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += `#${el.id}`;
    const slot = el.getAttribute('data-slot');
    if (slot) s += `[data-slot=${slot}]`;
    const cls = [...el.classList].slice(0, 2).join('.');
    if (cls) s += `.${cls}`;
    return s;
  };
  const fuera = [];
  for (const el of raiz.querySelectorAll('*')) {
    if (el instanceof SVGElement && el.tagName.toLowerCase() !== 'svg') continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.display === 'contents' || cs.position === 'absolute' || cs.position === 'fixed') continue;
    if (el.getAttribute('data-slot') === 'icon') continue; // el tamaño del ícono no es de maquetación
    if (parseFloat(cs.marginLeft) < 0 || parseFloat(cs.marginRight) < 0) continue; // sección a sangre (margen negativo)
    const padre = el.parentElement;
    if (!padre) continue;
    const ps = getComputedStyle(padre);
    if (ps.display === 'none' || ps.display === 'contents' || ps.overflowX !== 'visible') continue; // un padre con scroll o recorte es intencional
    const r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1) continue; // sr-only y similares
    const pr = padre.getBoundingClientRect();
    const interior = pr.width - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight) - parseFloat(ps.borderLeftWidth) - parseFloat(ps.borderRightWidth);
    // Se compara con el ancho del padre (no con el interior) para no marcar márgenes negativos; tolerancia de 1 px.
    if (r.width > Math.max(pr.width, interior) + 1) fuera.push({ el: sel(el), padre: sel(padre), ancho: Math.round(r.width), anchoPadre: Math.round(pr.width) });
    if (fuera.length >= 8) break;
  }
  return { paginaScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 0, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, fuera };
}

/** Chips de la tarjeta de tokens: [{nombre, hex}] leídos de los botones "Copiar <hex> (<token>)". */
function leerChips(raizSel) {
  const raiz = document.querySelector(raizSel) ?? document.body;
  return [...raiz.querySelectorAll('button[aria-label^="Copiar "]')].map((b) => {
    const m = b.getAttribute('aria-label').match(/^Copiar (.*) \((.+)\)$/);
    const fijo = b.closest('[data-doc-token-mode]')?.getAttribute('data-doc-token-mode') ?? null;
    return { nombre: m ? m[2] : b.getAttribute('aria-label'), hex: m ? m[1] : '', fijo };
  });
}

/** Valor esperado (hex) de cada token de color en oscuro y claro, con un elemento sonda con `data-theme`. Autocontenida. */
function esperados(nombres) {
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const aHex = (css) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    const h = (v) => v.toString(16).padStart(2, '0').toUpperCase();
    return `#${h(r)}${h(g)}${h(b)}${a < 255 ? h(a) : ''}`;
  };
  const valor = (nombre, modo) => {
    const s = document.createElement('span');
    s.setAttribute('data-theme', modo);
    s.className = modo;
    s.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden';
    s.style.color = `var(--color-ds-${nombre})`;
    document.body.appendChild(s);
    const v = aHex(getComputedStyle(s).color);
    s.remove();
    return v;
  };
  return nombres.map((n) => ({ n, dark: valor(n, 'dark'), light: valor(n, 'light') }));
}

/** Marcadores y cotas de la anatomía (contrato de `DocV2`, ver JSDoc de `DocAnatomyGroup` en src/docs/types.ts). */
function medirAnatomia(raizSel) {
  const raiz = document.querySelector(raizSel) ?? document.body;
  const lienzos = [...raiz.querySelectorAll('[data-doc-anatomy-canvas]')].filter((c) => c.getBoundingClientRect().width > 0);
  if (!lienzos.length) return { contrato: false };
  const marcadores = [];
  const cotas = [];
  const parteDe = (vista, selector, idx) => {
    const lista = [...vista.querySelectorAll(selector)];
    return lista[idx < 0 ? lista.length + idx : idx];
  };
  lienzos.forEach((lienzo, li) => {
    const base = lienzo.getBoundingClientRect();
    const vm = lienzo.querySelector('[data-doc-anatomy-view="marks"]');
    const vd = lienzo.querySelector('[data-doc-anatomy-view="dims"]');
    for (const m of lienzo.querySelectorAll('[data-doc-mark]')) {
      const n = m.getAttribute('data-doc-mark');
      const id = `${li + 1}.${n}`;
      const selector = m.getAttribute('data-doc-mark-selector');
      const idx = Number(m.getAttribute('data-doc-mark-index') ?? 0);
      const lado = m.getAttribute('data-doc-mark-side');
      const parte = vm && selector ? parteDe(vm, selector, idx) : null;
      if (!parte) {
        marcadores.push({ n: id, ok: false, motivo: `no se encuentra "${selector}"[${idx}] en la vista de marcadores` });
        continue;
      }
      const linea = lienzo.querySelector(`[data-doc-mark-line="${n}"]`);
      if (!linea) {
        marcadores.push({ n: id, ok: false, motivo: 'sin línea guía' });
        continue;
      }
      const r = parte.getBoundingClientRect();
      const x2 = Number(linea.getAttribute('x2')) + base.left;
      const y2 = Number(linea.getAttribute('y2')) + base.top;
      const dist = lado === 'top' ? Math.abs(y2 - r.top) : lado === 'bottom' ? Math.abs(y2 - r.bottom) : lado === 'left' ? Math.abs(x2 - r.left) : Math.abs(x2 - r.right);
      const dentro = lado === 'top' || lado === 'bottom' ? x2 >= r.left - 2 && x2 <= r.right + 2 : y2 >= r.top - 2 && y2 <= r.bottom + 2;
      marcadores.push({ n: id, distancia: Math.round(dist * 10) / 10, dentroDeLaParte: dentro, ok: dist <= 2 && dentro });
    }
    for (const c of lienzo.querySelectorAll('[data-doc-dim]')) {
      const tipo = c.getAttribute('data-doc-dim');
      const valor = Number(c.getAttribute('data-doc-dim-value'));
      const escala = Number(vd?.getAttribute('data-doc-anatomy-scale') ?? 1) || 1;
      let medido = NaN;
      if (vd) {
        const sel = c.getAttribute('data-doc-dim-selector');
        const idx = Number(c.getAttribute('data-doc-dim-index') ?? 0);
        if (tipo === 'padding' && sel) {
          const el = parteDe(vd, sel, idx);
          const lado = c.getAttribute('data-doc-dim-side') ?? 'top';
          if (el) medido = parseFloat(getComputedStyle(el)[`padding${lado[0].toUpperCase()}${lado.slice(1)}`]);
        } else if (tipo === 'height' && sel) {
          const el = parteDe(vd, sel, idx);
          if (el) medido = el.getBoundingClientRect().height / escala;
        } else if (tipo === 'gap') {
          const a = parteDe(vd, c.getAttribute('data-doc-dim-from') ?? '', 0);
          const b = parteDe(vd, c.getAttribute('data-doc-dim-to') ?? '', 0);
          if (a && b) {
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();
            medido = (c.getAttribute('data-doc-dim-axis') === 'y' ? Math.max(rb.top - ra.bottom, ra.top - rb.bottom) : Math.max(rb.left - ra.right, ra.left - rb.right)) / escala;
          }
        }
      }
      const texto = (c.textContent ?? '').match(/\d+(?:[.,]\d+)?/);
      const textoNum = texto ? parseFloat(texto[0].replace(',', '.')) : null;
      const ok = Number.isFinite(valor) && Number.isFinite(medido) && Math.abs(medido - valor) <= 0.6 && (textoNum === null || Math.abs(textoNum - valor) <= 0.6);
      cotas.push({ tipo, valor, medido: Number.isFinite(medido) ? Math.round(medido * 10) / 10 : null, texto: textoNum, escala, ok });
    }
  });
  return { contrato: true, marcadores, cotas };
}

// ───────── utilidades del lado de Node ─────────
/** Compara dos hex (con o sin alfa) con ±1 por canal. */
function mismoColor(a, b) {
  if (!a || !b) return false;
  const canales = (h) => {
    const m = h.replace('#', '').match(/.{2}/g)?.map((x) => parseInt(x, 16));
    return m && m.length === 3 ? [...m, 255] : m;
  };
  const x = canales(a);
  const y = canales(b);
  return !!x && !!y && x.length === y.length && x.every((v, i) => Math.abs(v - y[i]) <= 1);
}
async function esperarPagina(page) {
  await page.waitForSelector('[role=tab], h1:not(.sb-nopreview_heading), .sbdocs-title', { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(900);
}
async function activarPestana(page, nombre) {
  const tab = page.getByRole('tab', { name: new RegExp(`^\\s*${nombre}\\s*$`, 'i') });
  if (!(await tab.count())) return null;
  await tab.first().click();
  await page.waitForTimeout(600);
  return await tab.first().getAttribute('aria-controls');
}
const selId = (id) => `[id="${id}"]`;

async function correrAxe(page) {
  await page.addScriptTag({ path: axePath }).catch(() => {});
  return page.evaluate(async () => {
    const r = await window.axe.run(document, { resultTypes: ['violations'] });
    const nodos = (v) =>
      v.nodes.slice(0, 6).map((n) => ({ destino: n.target.join(' '), html: n.html.slice(0, 120), ...(v.id === 'color-contrast' ? { contraste: n.any[0]?.data?.contrastRatio, fg: n.any[0]?.data?.fgColor, bg: n.any[0]?.data?.bgColor } : {}) }));
    return r.violations.map((v) => ({ id: v.id, impacto: v.impact, total: v.nodes.length, nodos: nodos(v) }));
  });
}

// ───────── una página ─────────
async function verificarPagina(browser, id) {
  const res = { id, url: `${base}/iframe.html?id=${id}&viewMode=docs`, consola: [], pestanas: [], h1: null, tabsPresentes: [], reglas: {} };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') res.consola.push(m.text().slice(0, 240));
  });
  page.on('pageerror', (e) => res.consola.push(`pageerror: ${e.message.slice(0, 240)}`));

  for (const tema of ['dark', 'light']) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${res.url}&globals=theme:${tema}`, { waitUntil: 'load' });
    await esperarPagina(page);

    if (tema === 'dark') {
      res.h1 = await page.evaluate(() => {
        const h = [...document.querySelectorAll('h1')].filter((x) => !x.classList.contains('sb-nopreview_heading') && x.getBoundingClientRect().height > 0);
        return h[0]?.textContent?.trim() ?? null;
      });
      res.tabsPresentes = await page.evaluate(() => [...document.querySelectorAll('[role=tab]')].map((t) => t.textContent.trim()));
    }
    const tieneTabs = res.tabsPresentes.length > 0;
    const lista = tieneTabs ? PESTANAS : ['(página)'];

    for (const nombre of lista) {
      let panelSel = 'body';
      if (tieneTabs) {
        const ctl = await activarPestana(page, nombre);
        if (!ctl) {
          if (tema === 'dark') res.pestanas.push({ nombre, falta: true });
          continue;
        }
        panelSel = selId(ctl);
      }
      let p = res.pestanas.find((x) => x.nombre === nombre);
      if (!p) res.pestanas.push((p = { nombre, idsFigma: [], desbordes: {}, axe: {}, anatomia: null, tokens: null }));

      if (tema === 'dark') {
        // IDs de Figma en el texto visible
        const texto = await page.evaluate((s) => (document.querySelector(s) ?? document.body).innerText, panelSel);
        p.idsFigma = [...new Set(texto.match(/\b\d{3,6}:\d{2,6}\b/g) ?? [])];
        // Anatomía (contrato de B)
        p.anatomia = await page.evaluate(medirAnatomia, panelSel);
        // Tokens y modos: el hex cambia al pasar la tarjeta a claro
        const hayTarjeta = await page.locator(`${panelSel} [role=group][aria-label="Modo de color"]`).count();
        if (hayTarjeta) {
          const modos = {};
          for (const [modo, etiqueta] of [['light', 'Modo claro'], ['dark', 'Modo oscuro']]) {
            await page.locator(`${panelSel} button[aria-label="${etiqueta}"]`).first().click();
            await page.waitForTimeout(400);
            modos[modo] = await page.evaluate(leerChips, panelSel);
          }
          const nombres = [...new Set(modos.dark.map((c) => c.nombre))];
          const exp = await page.evaluate(esperados, nombres);
          const detalle = [];
          if (exp) {
            for (const e of exp) {
              const dc = modos.dark.find((c) => c.nombre === e.n);
              const lc = modos.light.find((c) => c.nombre === e.n);
              const d = dc?.hex;
              const l = lc?.hex;
              const fijo = dc?.fijo ?? null; // chip con modo fijo (p. ej. burbuja siempre oscura): no debe cambiar
              const esperadoD = fijo ? e[fijo] : e.dark;
              const esperadoL = fijo ? e[fijo] : e.light;
              const cambia = !mismoColor(d, l);
              const ok = mismoColor(d, esperadoD) && mismoColor(l, esperadoL) && (fijo ? !cambia : e.dark === e.light || mismoColor(e.dark, e.light) || cambia);
              if (!ok) detalle.push({ token: e.n, fijo, esperadoOscuro: esperadoD, esperadoClaro: esperadoL, chipOscuro: d, chipClaro: l });
            }
          }
          p.tokens = { total: modos.dark.length, conValoresDistintos: exp ? exp.filter((e) => !mismoColor(e.dark, e.light)).length : null, fallas: detalle };
        }
      }

      // axe
      if (opt.axe) {
        const v = await correrAxe(page);
        p.axe[tema] = { violaciones: v.filter((x) => x.id !== 'color-contrast'), contraste: v.filter((x) => x.id === 'color-contrast') };
      }

      // Desbordes por ancho (solo en la pasada oscura)
      if (tema === 'dark') {
        for (const w of opt.anchos) {
          await page.setViewportSize({ width: w, height: 900 });
          await page.waitForTimeout(350);
          p.desbordes[w] = await page.evaluate(enPaginaDesbordes, panelSel);
        }
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(250);
      }
    }
  }
  await ctx.close();
  return res;
}

// ───────── reglas y resumen ─────────
function evaluar(res) {
  const r = {};
  const ok = (v, nota) => ({ estado: v === null ? 'n/a' : v ? 'ok' : 'falla', nota });
  r['h1'] = ok(!!res.h1, res.h1 ?? 'sin h1');
  const faltan = PESTANAS.filter((t) => !res.tabsPresentes.some((x) => normalizar(x) === normalizar(t)));
  r['3 pestañas'] = ok(!faltan.length, faltan.length ? `faltan: ${faltan.join(', ')}` : '');
  r['consola'] = ok(!res.consola.length, res.consola.length ? `${res.consola.length} error(es): ${res.consola[0]}` : '');
  const ids = res.pestanas.flatMap((p) => p.idsFigma.map((i) => `${p.nombre}: ${i}`));
  r['sin IDs de Figma'] = ok(!ids.length, ids.slice(0, 4).join('; '));
  const des = [];
  for (const p of res.pestanas) for (const [w, d] of Object.entries(p.desbordes)) {
    if (d.paginaScroll) des.push(`${p.nombre}@${w}: scroll de página (${d.scrollWidth}>${d.clientWidth})`);
    if (d.fuera.length) des.push(`${p.nombre}@${w}: ${d.fuera[0].el} ${d.fuera[0].ancho}>${d.fuera[0].anchoPadre}${d.fuera.length > 1 ? ` (+${d.fuera.length - 1})` : ''}`);
  }
  r['sin desbordes'] = ok(!des.length, des.slice(0, 3).join('; ') + (des.length > 3 ? ` …(+${des.length - 3})` : ''));
  const axeV = [];
  const contraste = [];
  for (const p of res.pestanas) for (const [t, a] of Object.entries(p.axe)) {
    for (const v of a.violaciones) axeV.push(`${p.nombre}/${t}: ${v.id} (${v.total})`);
    if (a.contraste.length) contraste.push(`${p.nombre}/${t}: ${a.contraste.reduce((s, c) => s + c.total, 0)}`);
  }
  r['axe (sin contraste)'] = opt.axe ? ok(!axeV.length, axeV.slice(0, 4).join('; ')) : ok(null, 'omitido');
  r['contraste (aparte)'] = opt.axe ? { estado: contraste.length ? 'aviso' : 'ok', nota: contraste.join('; ') } : ok(null, 'omitido');
  const an = res.pestanas.map((p) => p.anatomia).filter((a) => a?.contrato);
  if (!an.length) r['anatomía'] = { estado: 'sin contrato', nota: 'la página no trae data-doc-mark*/data-doc-dim*' };
  else {
    const m = an.flatMap((a) => a.marcadores ?? []);
    const c = an.flatMap((a) => a.cotas ?? []);
    const malM = m.filter((x) => !x.ok);
    const malC = c.filter((x) => !x.ok);
    r['anatomía'] = ok(!malM.length && !malC.length, `${m.length} marcadores, ${c.length} cotas${malM.length ? `; marcador(es) fuera de ±2 px: ${malM.map((x) => `${x.n} (${x.motivo ?? x.distancia + ' px'})`).join(', ')}` : ''}${malC.length ? `; cota(s) con valor distinto: ${malC.map((x) => `${x.tipo} ${x.valor}≠${x.medido ?? 'sin medir'}`).join(', ')}` : ''}`);
  }
  const tk = res.pestanas.map((p) => p.tokens).filter(Boolean);
  if (!tk.length) r['tokens por modo'] = { estado: 'n/a', nota: 'sin tarjeta de tokens' };
  else {
    const f = tk.flatMap((t) => t.fallas);
    r['tokens por modo'] = ok(!f.length, f.length ? f.slice(0, 3).map((x) => `${x.token}: oscuro ${x.chipOscuro} (esp. ${x.esperadoOscuro}), claro ${x.chipClaro} (esp. ${x.esperadoClaro})`).join('; ') : `${tk.reduce((s, t) => s + t.total, 0)} chips, ${tk.reduce((s, t) => s + (t.conValoresDistintos ?? 0), 0)} con valores distintos por modo`);
  }
  return r;
}
const marca = { ok: '✓', falla: '✕', aviso: '!', 'n/a': '–', 'sin contrato': '–' };

// ───────── principal ─────────
let ids = opt.ids;
if (opt.todos) {
  const idx = await fetch(`${base}/index.json`).then((r) => r.json());
  ids = Object.values(idx.entries).filter((e) => e.type === 'docs').map((e) => e.id);
}
const browser = await chromium.launch();
const todo = [];
for (const id of ids) {
  const t0 = Date.now();
  let res;
  try {
    res = await verificarPagina(browser, id);
  } catch (e) {
    res = { id, error: String(e.message ?? e).slice(0, 300), reglas: {} };
  }
  if (!res.error) res.reglas = evaluar(res);
  todo.push(res);
  console.log(`\n${id}  (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  if (res.error) console.log(`  ✕ error al verificar: ${res.error}`);
  for (const [k, v] of Object.entries(res.reglas)) console.log(`  ${marca[v.estado] ?? '?'} ${k}${v.nota ? ` · ${v.nota}` : ''}`);
}
await browser.close();
if (opt.salida) {
  writeFileSync(opt.salida, JSON.stringify({ fecha: new Date().toISOString(), base, paginas: todo }, null, 2));
  console.log(`\nJSON: ${opt.salida}`);
}
