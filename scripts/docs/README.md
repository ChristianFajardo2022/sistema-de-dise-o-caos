# Herramientas de documentación (plantilla v2)

Scripts de `scripts/docs/`. No tocan `src/`.

## `tokens-desde-spec.mjs`: tokens de "Tokens y modos" desde la spec de Figma
```
node scripts/docs/tokens-desde-spec.mjs .qa/figma/componentes/button/button
node scripts/docs/tokens-desde-spec.mjs .qa/figma/componentes/input/general-input --variante "Type=Text,State=Filled"
```
- Lee `spec.json`, toma las variantes en estado Default/Enabled (o la primera si no hay `State`) y recorre su árbol.
- Traduce cada variable de Figma a token del repo (minúsculas, `/` y espacios a `-`) y comprueba que exista en `src/styles/tokens.css`.
- Imprime `groups: [...]` listo para pegar en el bloque `tokens` (falta el `preview` de cada grupo). Al final, listas aparte: variables que no existen en `tokens.css` (para diseño) y colores de valor fijo sin variable.
- `--variante` filtra (`Prop=Valor` o fragmento del nombre; coma = Y; repetible = O). `--todas` no fija las props que no cambian los colores (p. ej. Size). `--json` da salida JSON.
- Lo que propone es el estado Default: partes que solo salen en otros estados (trazo en Hover, subrayado) se agregan a mano. Si existe la variante `-uniform` de un token de tipografía, avisa; elige según el componente.

## `verificar-docs.mjs`: comprobaciones por página Docs
```
npx storybook build -o <carpeta>/sb --quiet && python3 -m http.server 6013 -d <carpeta>/sb
node scripts/docs/verificar-docs.mjs --port 6013 --id general-controls-button--docs --salida resultado.json
node scripts/docs/verificar-docs.mjs --port 6013 --todos --salida todos.json
```
- Por página: h1, 3 pestañas, errores de consola, IDs de Figma visibles, desbordes (scroll de página y elementos más anchos que su padre) a 1440, 1288, 1000, 900 y 390, axe por pestaña en oscuro y claro (`color-contrast` va aparte), anatomía y tokens por modo.
- Anatomía: marcadores a 2 px o menos de su parte y cotas con valor igual al medido, según los atributos `data-doc-mark*` y `data-doc-dim*`. Sin ellos dice "sin contrato" (no es falla).
- Tokens por modo: pasa la tarjeta a claro y oscuro y compara el hex de cada chip con el valor real del token en ese modo.
- Marcas: `✓` pasa, `✕` falla, `!` aviso (contraste), `–` no aplica. Cada página tarda cerca de un minuto; `--sin-axe` lo acorta. `--anchos 1440,390` cambia los anchos.
- Un padre con scroll o recorte, los íconos y las secciones a sangre (margen negativo) no cuentan como desborde.
- Las páginas autodocs (sin plantilla v2) salen con ✕ en "3 pestañas" a propósito.
