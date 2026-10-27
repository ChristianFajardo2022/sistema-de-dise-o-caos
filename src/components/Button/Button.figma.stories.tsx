import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import type { ButtonContrast, ButtonSize, ButtonState, ButtonVariant } from './Button.types';
import { AddIcon } from '../../icons/AddIcon';

const meta: Meta = {
  title: 'General Controls/Button matrix',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATES: { figma: string; state: ButtonState }[] = [
  { figma: 'Default', state: 'default' },
  { figma: 'Hover', state: 'hover' },
  { figma: 'Focus', state: 'focus' },
  { figma: 'Press', state: 'press' },
  { figma: 'Inactive', state: 'inactive' },
  { figma: 'Delete', state: 'delete' },
  { figma: 'Load', state: 'load' },
];
const SIZES: ButtonSize[] = ['md', 'sm', 'xs'];

interface Block {
  type: ButtonVariant;
  contrast: ButtonContrast;
  unicolor: boolean;
  iconOnly: boolean;
}

/**
 * Bloques de combinaciones que existen en el set `button/button` (240 variantes):
 * Unicolor solo en secondary y tertiary con texto; Contrats Low/High solo en secondary.
 */
const BLOCKS: Block[] = [
  { type: 'primary', contrast: 'low', unicolor: false, iconOnly: false },
  { type: 'secondary', contrast: 'low', unicolor: false, iconOnly: false },
  { type: 'secondary', contrast: 'low', unicolor: true, iconOnly: false },
  { type: 'secondary', contrast: 'high', unicolor: false, iconOnly: false },
  { type: 'secondary', contrast: 'high', unicolor: true, iconOnly: false },
  { type: 'tertiary', contrast: 'low', unicolor: false, iconOnly: false },
  { type: 'tertiary', contrast: 'low', unicolor: true, iconOnly: false },
  { type: 'primary', contrast: 'low', unicolor: false, iconOnly: true },
  { type: 'secondary', contrast: 'low', unicolor: false, iconOnly: true },
  { type: 'secondary', contrast: 'high', unicolor: false, iconOnly: true },
  { type: 'tertiary', contrast: 'low', unicolor: false, iconOnly: true },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Las variantes de `button/button` de Figma, cada una una vez, con `data-figma` = nombre exacto.
 * No se dibujan: `State=Hover2`, `Hover3` y `Hover4` (solo Primary; copias idénticas de Hover, sobran en Figma)
 * ni `Load` en tertiary (no existe en Figma). Unicolor va sobre N01 (blanco fijo en ambos temas).
 */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-8 bg-ds-background-general-black p-6">
      {BLOCKS.map((b) => {
        const states = b.type === 'tertiary' ? STATES.filter((s) => s.state !== 'load') : STATES;
        return (
          <div key={`${b.type}-${b.contrast}-${b.unicolor}-${b.iconOnly}`} className={b.unicolor ? 'bg-ds-primitives-color-primary-n01 p-4' : undefined}>
            <div className="mb-2 text-xs text-ds-text-neutral-body">
              {cap(b.type)} · {cap(b.contrast)}
              {b.unicolor ? ' · Unicolor' : ''}
              {b.iconOnly ? ' · Icon-single' : ''}
            </div>
            <div className="flex flex-col gap-3">
              {SIZES.map((size) => (
                <div key={size} className="flex flex-wrap items-center gap-4">
                  <span className="w-8 text-xs text-ds-text-neutral-body">{size}</span>
                  {states.map((s) => {
                    const figma = `Type=${cap(b.type)}, State=${s.figma}, Size=${size}, Contrats=${cap(b.contrast)}, Icon-single=${b.iconOnly ? 'True' : 'False'}, Unicolor=${b.unicolor ? 'On' : 'Off'}`;
                    return b.iconOnly ? (
                      <Button
                        key={s.figma}
                        data-figma={figma}
                        variant={b.type}
                        contrast={b.contrast}
                        size={size}
                        state={s.state}
                        iconOnly
                        aria-label="Agregar"
                      >
                        <AddIcon />
                      </Button>
                    ) : (
                      <Button
                        key={s.figma}
                        data-figma={figma}
                        variant={b.type}
                        contrast={b.contrast}
                        unicolor={b.unicolor}
                        size={size}
                        state={s.state}
                      >
                        Button
                      </Button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  ),
};
