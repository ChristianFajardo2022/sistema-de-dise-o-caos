# Sistema de diseño CAOS

Librería de componentes React fiel a Figma, construida con React 19, TypeScript, Tailwind v4 y Storybook.

## Requisitos y comandos

Node.js reciente y npm.

```bash
npm install                      # instala dependencias
npm run dev                      # showcase en Vite
npm run storybook                # Storybook en http://localhost:6006
npm run build                    # tsc -b y build de producción
npm run lint                     # oxlint
npm run check:tokens             # verifica las variables CSS usadas
npx vitest run                   # pruebas
node scripts/build-icons.mjs     # regenera src/icons desde icons/svg
```

## Tokens

`src/styles/tokens.css` es la fuente de verdad, exportada de Figma. No se edita a mano. Las utilidades de Tailwind con prefijo `ds-` (por ejemplo `bg-ds-background-container-default-on-card` o `p-ds-space-general-xl`) salen de ese archivo. `npm run check:tokens` falla si un componente usa una variable que no existe en él.

## Íconos

Los SVG exportados de Figma viven en `icons/svg/`. `scripts/build-icons.mjs` los convierte en componentes en `src/icons/`, con `currentColor` para que hereden el color del texto.

## Estructura de un componente

```
src/components/Button/
  Button.tsx          implementación
  Button.types.ts     props y tipos
  Button.variants.ts  variantes (class-variance-authority)
  Button.stories.tsx  historias de Storybook
  Button.docs.json    documentación legible por herramientas e IA
  index.ts            exportaciones públicas
```

`*.docs.json` describe el componente, sus props, valores por defecto y el nodo de Figma de origen en un formato estructurado, para que herramientas y asistentes de IA lo lean sin analizar el código.

## Temas

Oscuro por defecto. Para el tema claro, agrega `data-theme="light"` al elemento `<html>`.

## Componentes

| Componente | Historia de Storybook |
| --- | --- |
| Button | `General Controls/Button` |
| ButtonLink | `General Controls/Button link` |
| ButtonCorner | `General Controls/Button corner` |
| Input | `Form Controls/Input` |
| Checkbox | `Form Controls/Checkbox` |
| Radio | `Form Controls/Radio` |
| Subtract | `Components/Subtract` |
