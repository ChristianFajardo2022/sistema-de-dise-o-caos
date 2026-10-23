import { cva } from 'class-variance-authority';

/**
 * CAOS Design System — Select Variants
 *
 * Fuente: component set "General input" de Figma (7856:1485), Type=Dropdown (8 estados). En Active/Focus el campo
 * lleva debajo, a 8 (space/general/lg), una instancia del set "Dropdown" (11673:7804, Type Simple, ítems "Dropdown list").
 *
 * Reutiliza sin copiar:
 * - El campo de Input: `inputFieldVariants` (recuadro 56/48, padding 8/12, radio 16, borde de 1 por dentro y colores por
 *   estado), `inputLabelVariants` (label flotante) e `inputControlVariants` (el valor 14/18 bajo el label).
 * - El panel y los ítems de DropdownMenu: `dropdownMenuPanelVariants`, `dropdownMenuScrollVariants`,
 *   `dropdownMenuItemVariants` (Default, Hover, Select, Disabled). Los roles son propios (`listbox` / `option`).
 *
 * Aquí solo vive lo que Select agrega encima.
 */

/** El combobox: un `<button>` sobre el área de texto de 40, con el valor alineado como el `<input>` de Input. */
export const selectTriggerVariants = cva('cursor-pointer truncate text-left disabled:cursor-not-allowed', {
  variants: {
    readOnly: { true: 'cursor-default', false: '' },
  },
  defaultVariants: { readOnly: false },
});

/**
 * Marco. `none` quita el recuadro (alto, borde, padding, radio y fondo) y deja label, valor y chevron.
 * Los colores por estado (variables --lbl-*, --val, --ico) siguen saliendo de `inputFieldVariants`.
 */
export const selectFrameVariants = cva('', {
  variants: {
    frame: {
      field: 'cursor-pointer',
      // Quita alto, borde, padding, radio y fondo del campo (cn() resuelve el conflicto con las utilidades ds-).
      // Sin anillo propio (ni el de Error/Success de la base): el foco lo marca solo el borde del recuadro que contiene
      // las secciones (:focus-within), como Figma en TripleSelect. Decisión de producto; ver su doc.
      none: 'h-auto cursor-pointer rounded-ds-radius-field-sm border-0 bg-transparent p-0 has-[input:focus-visible,textarea:focus-visible,[role=combobox]:focus-visible]:outline-none',
    },
    // Burnt-In: Figma usa border/field/disabled (Input usa border/field/default)
    burntIn: { true: '', false: '' },
    /**
     * @deprecated El anillo de foco de Error y Success ya lo dibuja la base (`inputFieldVariants`). Se conserva por
     * compatibilidad.
     */
    focusRing: {
      true: 'has-[[role=combobox]:focus-visible]:outline-2 has-[[role=combobox]:focus-visible]:outline-offset-2 has-[[role=combobox]:focus-visible]:outline-solid has-[[role=combobox]:focus-visible]:outline-ds-border-field-active',
      false: '',
    },
    disabled: { true: 'cursor-not-allowed', false: '' },
  },
  compoundVariants: [{ frame: 'field', burntIn: true, class: 'border-ds-border-field-disabled' }],
  defaultVariants: { frame: 'field', burntIn: false, focusRing: false, disabled: false },
});

/** Opción activa con teclado (`aria-activedescendant`): el foco real se queda en el combobox, así que se dibuja aquí. */
export const selectOptionActiveClass =
  'outline-2 -outline-offset-2 outline-solid outline-ds-border-field-active';
