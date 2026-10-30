import { convert, create } from 'storybook/theming';
import { colorVar, toHex } from './colorUtils';

/**
 * Tema de Storybook (para sus bloques `Primary` y `Controls` dentro de la página de documentación) con los colores de
 * CAOS. Las funciones de color de Storybook no aceptan `var()`: los tokens se resuelven a su valor real (hex) con un
 * elemento sonda en el modo pedido (`.dark` / `.light` + `data-theme` redeclaran los tokens por contenedor).
 */
export function caosStorybookTheme(mode: 'dark' | 'light') {
  const host = document.createElement('div');
  host.className = mode;
  host.setAttribute('data-theme', mode);
  host.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
  document.body.appendChild(host);
  const probe = document.createElement('span');
  host.appendChild(probe);
  const color = (token: string) => {
    probe.style.color = colorVar(token);
    return toHex(getComputedStyle(probe).color);
  };
  const length = (variable: string) => {
    probe.style.borderRadius = ['var(-', '-', variable, ')'].join('');
    return parseFloat(getComputedStyle(probe).borderTopLeftRadius) || 0;
  };
  const font = getComputedStyle(host).getPropertyValue(['-', '-ds-primitives-typography-family-primary'].join('')).trim();
  const vars = create({
    base: mode,
    colorPrimary: color('text-acent-firts'),
    colorSecondary: color('text-acent-firts'),
    appBg: color('background-container-surface'),
    appContentBg: color('background-container-default-on-card'),
    appPreviewBg: color('background-container-default-on-card'),
    appBorderColor: color('border-general-default-on-canva'),
    appBorderRadius: length('ds-responsive-radius-container-on-card'),
    textColor: color('text-neutral-body'),
    textInverseColor: color('text-neutral-black'),
    textMutedColor: color('text-neutral-gray-2'),
    barTextColor: color('text-neutral-body'),
    barHoverColor: color('text-acent-firts'),
    barSelectedColor: color('text-neutral-heading'),
    barBg: color('background-container-default-on-card'),
    buttonBg: color('background-general-gray-seventh'),
    buttonBorder: color('border-general-default-on-canva'),
    booleanBg: color('background-container-default-on-canva'),
    booleanSelectedBg: color('background-acent-tertiary'),
    inputBg: color('background-container-default-on-canva'),
    inputBorder: color('border-general-default-on-canva'),
    inputTextColor: color('text-neutral-heading'),
    inputBorderRadius: length('ds-responsive-radius-container-on-card') / 3,
    fontBase: `${font || 'Helvetica Neue'}, sans-serif`,
  });
  host.remove();
  return convert(vars);
}
