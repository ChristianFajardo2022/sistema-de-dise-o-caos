import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Normalizes any string or array path into a standard CSS variable name format.
 * E.g., "color/primary/G01" -> "--color-primary-g01"
 *       ["space", "lg"]     -> "--space-lg"
 */
function toCssVarName(input) {
  const str = Array.isArray(input) ? input.join('/') : input;
  return '--' + str
    .trim()
    .replace(/[\/\s\_]+/g, '-')
    .replace(/[^a-zA-Z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
}

/**
 * Formats primitive values (hex colors, px units for numbers, strings).
 */
function formatPrimitiveValue(pathArr, token) {
  const val = token.$value;
  const type = token.$type;

  // Color token
  if (type === 'color' || (val && typeof val === 'object' && val.hex)) {
    if (val.alpha !== undefined && val.alpha < 1 && val.components) {
      const r = Math.round(val.components[0] * 255);
      const g = Math.round(val.components[1] * 255);
      const b = Math.round(val.components[2] * 255);
      return `rgb(${r} ${g} ${b} / ${val.alpha})`;
    }
    return val.hex ? val.hex : val;
  }

  // Number token
  if (typeof val === 'number') {
    const fullPath = pathArr.join('/').toLowerCase();
    const needsPx = /space|radius|dimention|stroke|gap|gutter|column|width|height|size|line-height|margin|padding/.test(fullPath)
      && !/weight|opacity|count/.test(fullPath);
    
    if (needsPx) {
      return `${val}px`;
    }
    return `${val}`;
  }

  // String token
  if (typeof val === 'string') {
    if (pathArr.includes('family')) {
      return `"${val}", sans-serif`;
    }
    return `"${val}"`;
  }

  return String(val);
}

/**
 * Formats semantic mode tokens (alias resolution or composed colors).
 */
function formatSemanticValue(token) {
  const ext = token.$extensions || {};
  const alias = ext['com.figma.aliasData'];
  const composed = ext['com.figma.composedColor'];

  // 1. Direct alias reference
  if (alias && alias.targetVariableName) {
    const refVar = toCssVarName(alias.targetVariableName);
    return `var(${refVar})`;
  }

  // 2. Composed color with opacity modifier
  if (composed) {
    const colorArg = composed.colorArg;
    const opacityArg = composed.opacityArg;
    let baseRef = '';

    if (colorArg?.type === 'alias' && colorArg.alias?.targetVariableName) {
      baseRef = `var(${toCssVarName(colorArg.alias.targetVariableName)})`;
    } else if (colorArg?.value) {
      baseRef = colorArg.value;
    }

    let alpha = 1;
    if (opacityArg?.value !== undefined) {
      alpha = parseFloat((opacityArg.value / 100).toFixed(4));
    }

    return `rgb(from ${baseRef} r g b / ${alpha})`;
  }

  // 3. Direct value fallback
  if (token.$value) {
    if (typeof token.$value === 'object' && token.$value.hex) {
      return token.$value.hex;
    }
    return String(token.$value);
  }

  return '';
}

function buildTokens() {
  console.log('Building CAOS Design System tokens...');

  const outputLines = [
    '/* ========================================================================= */',
    '/*  CAOS Design System - Consolidate CSS Tokens                              */',
    '/*  Auto-generated from Figma Tokens. DO NOT EDIT DIRECTLY.                   */',
    '/* ========================================================================= */',
    ''
  ];

  const primPath = path.join(projectRoot, 'tokens', 'primitives', 'Mode 1.tokens.json');
  if (fs.existsSync(primPath)) {
    outputLines.push(':root {');
    outputLines.push('  /* Primitive Tokens */');
    const primData = JSON.parse(fs.readFileSync(primPath, 'utf-8'));
    function traversePrimitives(obj, pathArr = []) {
      if (!obj || typeof obj !== 'object') return;
      if ('$value' in obj) {
        const varName = toCssVarName(pathArr);
        const cssVal = formatPrimitiveValue(pathArr, obj);
        outputLines.push(`  ${varName}: ${cssVal};`);
        return;
      }
      for (const k of Object.keys(obj)) {
        if (k.startsWith('$')) continue;
        traversePrimitives(obj[k], [...pathArr, k]);
      }
    }
    traversePrimitives(primData);
    outputLines.push('}');
    outputLines.push('');
  }

  const lightPath = path.join(projectRoot, 'tokens', 'mode', 'Light.tokens.json');
  if (fs.existsSync(lightPath)) {
    outputLines.push(':root {');
    outputLines.push('  /* Light Mode Semantic Tokens */');
    const lightData = JSON.parse(fs.readFileSync(lightPath, 'utf-8'));
    function traverseLight(obj, pathArr = []) {
      if (!obj || typeof obj !== 'object') return;
      if ('$value' in obj) {
        const varName = toCssVarName(pathArr);
        const cssVal = formatSemanticValue(obj);
        outputLines.push(`  ${varName}: ${cssVal};`);
        return;
      }
      for (const k of Object.keys(obj)) {
        if (k.startsWith('$')) continue;
        traverseLight(obj[k], [...pathArr, k]);
      }
    }
    traverseLight(lightData);
    outputLines.push('}');
    outputLines.push('');
  }

  const deskPath = path.join(projectRoot, 'tokens', 'responsive', 'Desktop.tokens.json');
  if (fs.existsSync(deskPath)) {
    outputLines.push(':root {');
    outputLines.push('  /* Responsive Tokens (Desktop Default) */');
    const deskData = JSON.parse(fs.readFileSync(deskPath, 'utf-8'));
    function traverseDesk(obj, pathArr = []) {
      if (!obj || typeof obj !== 'object') return;
      if ('$value' in obj) {
        const varName = toCssVarName(pathArr);
        const cssVal = formatSemanticValue(obj) || formatPrimitiveValue(pathArr, obj);
        outputLines.push(`  ${varName}: ${cssVal};`);
        return;
      }
      for (const k of Object.keys(obj)) {
        if (k.startsWith('$')) continue;
        traverseDesk(obj[k], [...pathArr, k]);
      }
    }
    traverseDesk(deskData);
    outputLines.push('}');
    outputLines.push('');
  }

  const darkPath = path.join(projectRoot, 'tokens', 'mode', 'Dark.tokens.json');
  if (fs.existsSync(darkPath)) {
    outputLines.push('[data-theme="dark"] {');
    outputLines.push('  /* Dark Mode Semantic Tokens */');
    const darkData = JSON.parse(fs.readFileSync(darkPath, 'utf-8'));
    function traverseDark(obj, pathArr = []) {
      if (!obj || typeof obj !== 'object') return;
      if ('$value' in obj) {
        const varName = toCssVarName(pathArr);
        const cssVal = formatSemanticValue(obj);
        outputLines.push(`  ${varName}: ${cssVal};`);
        return;
      }
      for (const k of Object.keys(obj)) {
        if (k.startsWith('$')) continue;
        traverseDark(obj[k], [...pathArr, k]);
      }
    }
    traverseDark(darkData);
    outputLines.push('}');
    outputLines.push('');
  }

  // 5. Mobile Responsive Overrides
  const mobPath = path.join(projectRoot, 'tokens', 'responsive', 'Mobile.tokens.json');
  if (fs.existsSync(mobPath)) {
    outputLines.push('@media (max-width: 768px) {');
    outputLines.push('  :root {');
    const mobData = JSON.parse(fs.readFileSync(mobPath, 'utf-8'));
    function traverseMob(obj, pathArr = []) {
      if (!obj || typeof obj !== 'object') return;
      if ('$value' in obj) {
        const varName = toCssVarName(pathArr);
        const cssVal = formatSemanticValue(obj) || formatPrimitiveValue(pathArr, obj);
        outputLines.push(`    ${varName}: ${cssVal};`);
        return;
      }
      for (const k of Object.keys(obj)) {
        if (k.startsWith('$')) continue;
        traverseMob(obj[k], [...pathArr, k]);
      }
    }
    traverseMob(mobData);
    outputLines.push('  }');
    outputLines.push('}');
    outputLines.push('');
  }

  // Save result to src/styles/tokens.css
  const targetDir = path.join(projectRoot, 'src', 'styles');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'tokens.css');
  let finalCss = outputLines.join('\n');
  
  fs.writeFileSync(targetFile, finalCss, 'utf-8');

  console.log(`Tokens compiled successfully -> ${targetFile}`);
}

buildTokens();
