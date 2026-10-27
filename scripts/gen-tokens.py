#!/usr/bin/env python3
"""Genera src/styles/tokens.css a partir de las variables de Figma del archivo principal.

Uso (solo biblioteca estándar; se corre con `npm run build:tokens`):
  python3 -I scripts/gen-tokens.py [variables.json] [salida.css]
Por defecto lee tokens/variables-principal.json y escribe src/styles/tokens.css.

Flujo para actualizar los tokens:
  1. Exportar las variables del archivo principal de Figma (colecciones Primitives, Responsive, Mode y
     DataViz | Geometry) con el extractor de scripts/figma/ y guardarlas en tokens/variables-principal.json
     (solo colecciones y variables: id, nombre, tipo, valores por modo; no lleva nada más del archivo).
  2. `npm run build:tokens` y revisar el diff de src/styles/tokens.css.
  3. `npm run check` (el chequeo de tokens también falla con clases `*-ds-*` que dejen de existir).

Regla de nombres (Figma a CSS): minúsculas; se quitan `%`, `(` y `)`; tramos de `/` o espacios pasan a `-`;
prefijo por colección (Primitives `ds-primitives-`, Responsive `ds-responsive-`, Mode `ds-`, DataViz `ds-`);
las variables de tipo COLOR llevan `--color-` (namespace de Tailwind v4). `@theme inline` expone cada variable como
utilidad `ds-*` (ver `ns()`).

Lo que NO sale de una variable y vive escrito en este script (EDITAR AQUÍ, no en tokens.css, que se regenera):
  - HEADER: `@import "tailwindcss"` y los `@custom-variant` dark/light/mobile.
  - MANUAL_THEME: `--shadow-ds-on-card` y `--shadow-ds-on-canva-md` (geometría de la sombra) y los alias
    `--color-ds-effect-shadow-*`. La sombra `on-canva-sm` no tiene utilidad: Figma la define como estilo de efecto
    y la geometría no viene en las variables.
  - UTILITIES: `@utility` de grosor de borde y `grid-cols-ds-default`.
Las dos variables `--ds-external-*` son alias a una biblioteca externa que el JSON no resuelve (ver EXTERNAL).
"""
import json, re, sys, glob, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = sys.argv[1] if len(sys.argv) > 1 else f'{ROOT}/tokens/variables-principal.json'
out = sys.argv[2] if len(sys.argv) > 2 else f'{ROOT}/src/styles/tokens.css'
d = json.load(open(src))
cols = {c['id']: c for c in d['colecciones']}
vs = d['variables']
cname = {c['id']: c['nombre'].strip() for c in d['colecciones']}
PRE = {'Primitives': 'ds-primitives-', 'Responsive': 'ds-responsive-', 'Mode': 'ds-', 'DataViz | Geometry': 'ds-'}

def slug(n): return re.sub(r'[\s/]+', '-', re.sub(r'[%()]', '', n.lower()).strip())
def css(v): return ('--color-' if v['tipo'] == 'COLOR' else '--') + PRE[cname[v['coleccion']]] + slug(v['nombre'])
by = {}
for v in vs: by.setdefault(v['nombre'], []).append(v)
def target(n):
    c = by.get(n, [])
    return next((x for x in c if cname[x['coleccion']] == 'Primitives'), c[0] if c else None)
# ids de variables de Primitives (de los exports DTCG antiguos en tokens/), para los alias "color + opacidad"
idname = {}
def walk(o, p):
    if isinstance(o, dict):
        if '$value' in o:
            i = o.get('$extensions', {}).get('com.figma.variableId')
            if i: idname[i] = '/'.join(p)
            return
        for k, x in o.items(): walk(x, p + [k])
for f in glob.glob(f'{ROOT}/tokens/*/*.json'): walk(json.load(open(f)), [])
# alias a variables de una biblioteca externa (no resolubles desde el JSON): se conservan como hasta ahora
EXTERNAL = {'9740:928': ('--ds-external-confirmation-v06', '#084732'), '9740:934': ('--ds-external-error-r06', '#660000')}
warn = []
def num(x):
    f = float(x); return str(int(f)) if f.is_integer() else f'{round(f, 3):g}'
def lit(v, x):
    if v['tipo'] == 'COLOR': return x.lower()
    if v['tipo'] == 'BOOLEAN': return '1' if x else '0'
    if v['tipo'] == 'STRING': return f'"{x}"' if 'family' in v['nombre'] else x
    n = slug(v['nombre'])
    return num(x) if 'weight' in n or 'column' in n or v['nombre'] == 'Scroll bar' or 'opacity' in n else f'{num(x)}px'
def val(v, mid):
    x = v['valores'][mid]
    if isinstance(x, dict) and 'alias' in x:
        a = x['alias']; m = re.match(r'VariableID:[0-9a-f]{40}/(\d+:\d+)', a)
        if m:
            k = EXTERNAL.get(m.group(1))
            if not k: warn.append(f'alias externo sin mapa: {v["nombre"]} {a}'); return 'transparent'
            return f'var({k[0]})'
        t = target(a)
        if not t: warn.append(f'alias roto: {v["nombre"]} -> {a}'); return 'transparent'
        return f'var({css(t)})'
    if isinstance(x, dict) and 'color' in x:
        tn = idname.get(x['color']['id']); t = target(tn) if tn else None
        if t is None and v['nombre'].endswith('-opacity'): t = target(v['nombre'][:-8]); warn.append(f'opacidad {v["nombre"]}: id {x["color"]["id"]} no resuelto, se asume {t and t["nombre"]}')
        if t is None: warn.append(f'opacidad sin objetivo: {v["nombre"]}'); return 'transparent'
        return f'color-mix(in srgb, var({css(t)}) {num(x["opacity"])}%, transparent)'
    return lit(v, x)
def modes(col): return [m['id'] for m in cols[col]['modos']]
def name_of(col, i): return next(m['nombre'] for m in cols[col]['modos'] if m['id'] == i)
blocks = {'root': [(k[0], k[1]) for k in EXTERNAL.values()], 'Dark': [], 'Light': [], 'Mobile': {}, 'Tablet': {}, 'Desktop': {}}
for v in vs:
    c = cname[v['coleccion']]; n = css(v)
    if c in ('Primitives', 'DataViz | Geometry'): blocks['root'].append((n, val(v, modes(v['coleccion'])[0])))
    elif c == 'Mode':
        for i in modes(v['coleccion']): blocks[name_of(v['coleccion'], i)].append((n, val(v, i)))
    else:
        for i in modes(v['coleccion']): blocks[name_of(v['coleccion'], i)][n] = val(v, i)
L = ['@layer base {', '  :root {']
L += [f'    {n}: {x};' for n, x in blocks['root']] + ['  }', '  :where(:root, .dark, [data-theme="dark"]) {', '    color-scheme: dark;']
L += [f'    {n}: {x};' for n, x in blocks['Dark']] + ['  }', '  :where(.light, [data-theme="light"]) {', '    color-scheme: light;']
L += [f'    {n}: {x};' for n, x in blocks['Light']] + ['  }']
SEL = ':root, :where(.light, .dark, [data-theme="light"], [data-theme="dark"])'
L += [f'  {SEL} {{'] + [f'    {n}: {x};' for n, x in blocks['Mobile'].items()] + ['  }']
L += ['  @media (width >= 48rem) {', f'    {SEL} {{'] + [f'      {n}: {x};' for n, x in blocks['Tablet'].items() if blocks['Mobile'].get(n) != x] + ['    }', '  }']
L += ['  @media (width >= 64rem) {', f'    {SEL} {{'] + [f'      {n}: {x};' for n, x in blocks['Desktop'].items() if blocks['Tablet'].get(n) != x] + ['    }', '  }', '}']
# @theme inline por regla (ver diff-tokens.md, sección 1)
def ns(n, t):
    s = n.replace('--ds-', '')
    if t == 'COLOR' or s.startswith('dataviz'): return None
    if 'typography-spacing' in s: return 'spacing'
    if 'typography-size' in s or re.search(r'typography-(heading|body|button|field|interaction)-(size|font-size)', s): return 'text'
    if 'line-height' in s: return 'leading'
    if 'typography-weight' in s: return 'font-weight'
    if 'typography-family' in s: return 'font'
    if re.search(r'-(space|dimention|gap|gutter)-', s) or s.startswith(('primitives-space', 'primitives-dimention', 'responsive-space', 'responsive-dimention')): return 'spacing'
    if re.search(r'(^|-)radius-', s): return 'radius'
    return None
T = ['@theme inline {', '  --breakpoint-tablet: 48rem;', '  --breakpoint-desktop: 64rem;']
for v in vs:
    n = css(v); k = ns(n, v['tipo'])
    if v['tipo'] == 'COLOR': T.append(f'  {n}: var({n});')
    elif k:
        key = f'--{k}-' + n[2:].replace('ds-responsive-', 'ds-', 1)
        T.append(f'  {key}: var({n});')
HEADER = f"""/* Tailwind CSS v4.
 * GENERADO por scripts/gen-tokens.py (`npm run build:tokens`) desde tokens/variables-principal.json. No editar a mano.
 * {len(vs)} variables del sistema.
 * Tema predeterminado: Dark.
 * Responsive: Mobile base, Tablet 48rem, Desktop 64rem.
 * Los breakpoints son una decisión de implementación web.
 */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));
@custom-variant light (&:where(.light, .light *, [data-theme="light"], [data-theme="light"] *));

@custom-variant mobile {{
  @media (width < 48rem) {{
    @slot;
  }}
}}

"""
MANUAL_THEME = [
    '  --color-ds-effect-shadow-on-card: var(--color-ds-responsive-effect-shadow-on-card);',
    '  --color-ds-effect-shadow-on-canva-md: var(--color-ds-responsive-effect-shadow-on-canva-md);',
    '  --color-ds-effect-shadow-on-canva-sm: var(--color-ds-responsive-effect-shadow-on-canva-sm);',
    '  --shadow-ds-on-card: 0px 4px 12px 0px var(--color-ds-responsive-effect-shadow-on-card);',
    '  --shadow-ds-on-canva-md: 0px 12px 32px -2px var(--color-ds-responsive-effect-shadow-on-canva-md);',
]
UTILITIES = """
/* Utilidades de grosor de borde. */
@utility border-ds-border-general-sm {
  border-width: var(--ds-responsive-border-general-sm);
}

@utility border-ds-border-general-md {
  border-width: var(--ds-responsive-border-general-md);
}

@utility border-ds-border-general-lg {
  border-width: var(--ds-responsive-border-general-lg);
}

@utility border-ds-primitives-stroke-xs {
  border-width: var(--ds-primitives-stroke-xs);
}

@utility border-ds-primitives-stroke-sm {
  border-width: var(--ds-primitives-stroke-sm);
}

@utility border-ds-primitives-stroke-dm {
  border-width: var(--ds-primitives-stroke-dm);
}

@utility border-ds-primitives-stroke-lg {
  border-width: var(--ds-primitives-stroke-lg);
}

@utility border-ds-primitives-stroke-xl {
  border-width: var(--ds-primitives-stroke-xl);
}

/* Columnas: 4 Mobile, 6 Tablet y 12 Desktop. */
@utility grid-cols-ds-default {
  grid-template-columns: repeat(
    var(--ds-responsive-column-default),
    minmax(0, 1fr)
  );
}
"""
open(out, 'w').write(HEADER + '\n'.join(L + ['', *T, *MANUAL_THEME, '}']) + '\n' + UTILITIES)
print(f'{out}: {len(vs)} variables, {len(warn)} avisos')
for w in warn: print('  aviso:', w)
