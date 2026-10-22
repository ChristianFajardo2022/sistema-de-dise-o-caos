/**
 * Extractor de component sets de Figma (Plugin API, pestaña del editor en Chrome).
 *
 * Se carga desde el receptor local (scripts/figma/receptor.py):
 *   (0, eval)(await fetch('http://127.0.0.1:8765/extraer.js').then((r) => r.text()));
 *   await caosExtraer('9625:3359', { carpeta: 'badge' });
 *
 * Escribe en <salida>/<carpeta>/:
 *   spec.json         props del set, variantes con su árbol, variables usadas resueltas por modo
 *   png/<variante>.png cada variante a 2x (modo por defecto del archivo)
 *   set.png           el set completo a 1x
 *
 * Opciones: offset/limite para sets grandes (se reparten en varias llamadas: spec-<offset>.json),
 * png:false para saltar las imágenes.
 */
(() => {
  const RECEPTOR = 'http://127.0.0.1:8765';
  const TOPE_MS = 35000;

  const r2 = (n) => (typeof n === 'number' ? Math.round(n * 100) / 100 : n);
  const hex = ({ r, g, b }, a = 1) => {
    const h = [r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
    return a < 1 ? `#${h}@${r2(a)}` : `#${h}`;
  };
  const slug = (s) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const paginaDe = (n) => {
    while (n && n.type !== 'PAGE') n = n.parent;
    return n ? n.name.replace(/^\S+\s/, '').trim() : null;
  };

  // Exportar variantes con fotos puede colgarse: tope por imagen
  const exportar = (nodo, escala) =>
    Promise.race([
      nodo.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: escala } }),
      new Promise((resolve) => setTimeout(() => resolve(null), 6000)),
    ]);

  async function enviar(ruta, cuerpo, b64 = false) {
    const res = await fetch(`${RECEPTOR}/${ruta}${b64 ? '?b64' : ''}`, { method: 'POST', body: cuerpo });
    if (!res.ok) throw new Error(`receptor ${res.status} en ${ruta}`);
  }

  // ---------- variables ----------
  const varIds = new Set();
  const anotarVars = (bv) => {
    const out = {};
    for (const [prop, v] of Object.entries(bv || {})) {
      const lista = Array.isArray(v) ? v : [v];
      const ids = lista.filter((x) => x && x.id).map((x) => x.id);
      ids.forEach((id) => varIds.add(id));
      if (ids.length) out[prop] = ids.length === 1 ? ids[0] : ids;
    }
    return out;
  };

  async function resolverVariables() {
    const tabla = {};
    const colecciones = {};
    const valor = (v, tipo) => {
      if (v && typeof v === 'object' && 'r' in v) return hex(v, v.a ?? 1);
      if (tipo === 'FLOAT') return r2(v);
      return v;
    };
    const resolver = async (id, modoNombre, profundidad = 0) => {
      const variable = await figma.variables.getVariableByIdAsync(id);
      if (!variable) return null;
      const col = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
      const modo = col.modes.find((m) => m.name === modoNombre) || col.modes.find((m) => m.modeId === col.defaultModeId);
      const v = variable.valuesByMode[modo.modeId];
      if (v && v.type === 'VARIABLE_ALIAS' && profundidad < 10) return resolver(v.id, modoNombre, profundidad + 1);
      return valor(v, variable.resolvedType);
    };
    for (const id of varIds) {
      const variable = await figma.variables.getVariableByIdAsync(id);
      if (!variable) {
        tabla[id] = { nombre: null, nota: 'variable remota o borrada' };
        continue;
      }
      const col = await figma.variables.getVariableCollectionByIdAsync(variable.variableCollectionId);
      colecciones[col.name] = col.modes.map((m) => m.name);
      const porModo = {};
      for (const m of col.modes) porModo[m.name] = await resolver(id, m.name);
      // Alias directo (primer salto), útil para saber de qué primitivo sale
      const primero = variable.valuesByMode[col.defaultModeId];
      let alias = null;
      if (primero && primero.type === 'VARIABLE_ALIAS') {
        const destino = await figma.variables.getVariableByIdAsync(primero.id);
        alias = destino ? destino.name : primero.id;
      }
      tabla[id] = { nombre: variable.name, coleccion: col.name, tipo: variable.resolvedType, alias, porModo };
    }
    return { tabla, colecciones };
  }

  // ---------- nodos ----------
  const pintura = (p) => {
    if (!p || p.visible === false) return null;
    const out = { tipo: p.type };
    if (p.type === 'SOLID') out.color = hex(p.color, p.opacity ?? 1);
    else if (p.type && p.type.startsWith('GRADIENT')) out.paradas = p.gradientStops.map((s) => `${hex(s.color, s.color.a)} ${r2(s.position)}`);
    if (p.boundVariables && p.boundVariables.color) out.var = anotarVars({ color: p.boundVariables.color }).color;
    return out;
  };

  async function nodo(n, profundidad = 0) {
    const o = { nombre: n.name, tipo: n.type, w: r2(n.width), h: r2(n.height) };
    if (n.visible === false) o.oculto = true;
    if (profundidad > 0 && 'x' in n) Object.assign(o, { x: r2(n.x), y: r2(n.y) });
    if ('layoutMode' in n && n.layoutMode !== 'NONE') {
      o.layout = {
        modo: n.layoutMode,
        padding: [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].map(r2),
        gap: r2(n.itemSpacing),
        principal: n.primaryAxisAlignItems,
        cruzado: n.counterAxisAlignItems,
        tamH: n.layoutSizingHorizontal,
        tamV: n.layoutSizingVertical,
      };
      if (n.layoutWrap === 'WRAP') o.layout.wrap = true;
    }
    if ('cornerRadius' in n) {
      o.radio = n.cornerRadius === figma.mixed ? [n.topLeftRadius, n.topRightRadius, n.bottomRightRadius, n.bottomLeftRadius].map(r2) : r2(n.cornerRadius);
    }
    if ('fills' in n && Array.isArray(n.fills)) {
      const f = n.fills.map(pintura).filter(Boolean);
      if (f.length) o.rellenos = f;
    }
    if ('strokes' in n && Array.isArray(n.strokes) && n.strokes.length) {
      const s = n.strokes.map(pintura).filter(Boolean);
      if (s.length) {
        o.trazos = s;
        o.trazo = { grosor: n.strokeWeight === figma.mixed ? [n.strokeTopWeight, n.strokeRightWeight, n.strokeBottomWeight, n.strokeLeftWeight] : r2(n.strokeWeight), alineado: n.strokeAlign };
        if (n.dashPattern && n.dashPattern.length) o.trazo.guiones = n.dashPattern;
      }
    }
    if ('effects' in n && n.effects.length) {
      o.efectos = n.effects
        .filter((e) => e.visible !== false)
        .map((e) => ({ tipo: e.type, radio: r2(e.radius), ...(e.color ? { color: hex(e.color, e.color.a), x: r2(e.offset.x), y: r2(e.offset.y), spread: r2(e.spread || 0) } : {}) }));
    }
    if ('opacity' in n && n.opacity < 1) o.opacidad = r2(n.opacity);
    if (n.type === 'TEXT') {
      const seg = n.getStyledTextSegments(['fontName', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'fills', 'textCase', 'textDecoration']);
      o.texto = {
        contenido: n.characters,
        alineado: n.textAlignHorizontal,
        autoAjuste: n.textAutoResize,
        segmentos: seg.map((s) => ({
          desde: s.start,
          familia: s.fontName.family,
          estilo: s.fontName.style,
          tamano: r2(s.fontSize),
          peso: s.fontWeight,
          linea: s.lineHeight.unit === 'AUTO' ? 'auto' : `${r2(s.lineHeight.value)}${s.lineHeight.unit === 'PIXELS' ? 'px' : '%'}`,
          espaciado: s.letterSpacing.value ? `${r2(s.letterSpacing.value)}${s.letterSpacing.unit === 'PIXELS' ? 'px' : '%'}` : 0,
          color: (s.fills || []).map(pintura).filter(Boolean),
          ...(s.textCase !== 'ORIGINAL' ? { caja: s.textCase } : {}),
          ...(s.textDecoration !== 'NONE' ? { decoracion: s.textDecoration } : {}),
        })),
      };
    }
    const bv = anotarVars(n.boundVariables);
    delete bv.fills;
    delete bv.strokes;
    if (Object.keys(bv).length) o.vars = bv;
    if (n.type === 'INSTANCE') {
      const main = await n.getMainComponentAsync();
      if (main) {
        const set = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
        o.instancia = {
          componente: (set || main).name.trim(),
          pagina: paginaDe(set || main),
          id: (set || main).id,
          ...(set ? { variante: main.variantProperties } : {}),
          remota: !!(set || main).remote,
        };
        const props = n.componentProperties;
        if (props && Object.keys(props).length) {
          o.instancia.props = Object.fromEntries(Object.entries(props).map(([k, v]) => [k.replace(/#\d+:\d+$/, ''), v.value]));
        }
      }
    }
    if ('children' in n && n.children.length) {
      // Los íconos (instancias de la biblioteca de Iconografía) no se recorren por dentro
      const esIcono = o.instancia && o.instancia.pagina && o.instancia.pagina.startsWith('Iconograf');
      if (!esIcono) o.hijos = await Promise.all(n.children.map((c) => nodo(c, profundidad + 1)));
      else {
        // El ícono real es la instancia anidada (swap): su set da el nombre (figmaSetId del manifest)
        const interna = n.findOne((c) => c.type === 'INSTANCE');
        const main = interna && (await interna.getMainComponentAsync());
        if (main) {
          const set = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : main;
          o.icono = { nombre: set.name.trim(), figmaSetId: set.id, variante: main.variantProperties || null };
          const relleno = interna.findOne((c) => 'fills' in c && Array.isArray(c.fills) && c.fills.some((f) => f.visible !== false));
          if (relleno) o.icono.color = relleno.fills.map(pintura).filter(Boolean);
        }
      }
    }
    return o;
  }

  // ---------- principal ----------
  globalThis.caosExtraer = async function caosExtraer(setId, { carpeta, offset = 0, limite = 400, png = true } = {}) {
    const t0 = Date.now();
    varIds.clear();
    const set = await figma.getNodeByIdAsync(setId);
    if (!set) throw new Error(`no existe el nodo ${setId}`);
    // Un set borrado del lienzo (que aún usan otras instancias) no tiene página
    const pagina = (() => {
      let p = set;
      while (p && p.type !== 'PAGE') p = p.parent;
      return p;
    })();
    if (pagina) await pagina.loadAsync();
    carpeta = carpeta || slug(set.name);

    let props = null;
    try {
      props = Object.fromEntries(
        Object.entries(set.componentPropertyDefinitions).map(([k, v]) => [
          k.replace(/#\d+:\d+$/, ''),
          { tipo: v.type, defecto: v.defaultValue, ...(v.variantOptions ? { opciones: v.variantOptions } : {}) },
        ]),
      );
    } catch (e) {
      props = { error: String(e.message || e) };
    }

    const todas = set.type === 'COMPONENT_SET' ? set.children : [set];
    const lote = todas.slice(offset, offset + limite);
    const variantes = [];
    let cortado = null;
    const sinPng = [];
    for (const v of lote) {
      if (Date.now() - t0 > TOPE_MS) {
        cortado = offset + variantes.length;
        break;
      }
      const arbol = await nodo(v);
      const nombre = v.variantProperties ? Object.entries(v.variantProperties).map(([k, x]) => `${k}=${x}`).join(', ') : v.name;
      const archivo = slug(nombre) || slug(v.id);
      variantes.push({ id: v.id, nombre, props: v.variantProperties || {}, png: `png/${archivo}.png`, arbol });
      if (png) {
        const bytes = await exportar(v, 2);
        if (bytes) await enviar(`${carpeta}/png/${archivo}.png`, figma.base64Encode(bytes), true);
        else sinPng.push(nombre);
      }
    }
    const { tabla, colecciones } = await resolverVariables();
    const spec = {
      fuente: { setId: set.id, nombre: set.name.trim(), pagina: paginaDe(set), ...(pagina ? {} : { fueraDelLienzo: true }), extraido: new Date().toISOString() },
      props,
      total: todas.length,
      offset,
      variantes,
      variables: tabla,
      colecciones,
      ...(sinPng.length ? { sinPng } : {}),
    };
    const nombreSpec = offset === 0 && !cortado && variantes.length === todas.length ? 'spec.json' : `spec-${offset}.json`;
    await enviar(`${carpeta}/${nombreSpec}`, JSON.stringify(spec, null, 1));
    if (png && offset === 0 && set.type === 'COMPONENT_SET') {
      try {
        const bytes = await exportar(set, 1);
        if (bytes) await enviar(`${carpeta}/set.png`, figma.base64Encode(bytes), true);
      } catch {
        /* sets enormes pueden fallar al exportar: no es crítico */
      }
    }
    return { carpeta, archivo: nombreSpec, variantes: variantes.length, total: todas.length, siguiente: cortado, sinPng: sinPng.length, ms: Date.now() - t0 };
  };
})();
