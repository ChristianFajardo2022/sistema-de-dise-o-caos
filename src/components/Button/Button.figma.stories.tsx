import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
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

/**
 * Con `href` el botón es un `<a>`: navegación real y los mismos efectos del tipo (barrido de Primary incluido).
 * Inactive quita el href y deja `role="link"` + `aria-disabled`.
 */
export const AsLink: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 bg-ds-background-general-black p-6">
      <Button href="#inicio">Volver al inicio</Button>
      <Button href="#inicio" variant="secondary" rightIcon={<AddIcon />}>
        Ver más
      </Button>
      <Button href="#inicio" variant="tertiary">
        Ver todo
      </Button>
      <Button href="#inicio" disabled>
        No disponible
      </Button>
    </div>
  ),
};

/** Test: con href es un enlace con el efecto de Primary; inactivo no navega ni recibe foco */
export const AsLinkTest: Story = {
  tags: ['!autodocs'],
  render: () => {
    const onClick = fn();
    return (
      <div className="flex gap-4 bg-ds-background-general-black p-6">
        <Button href="#destino" onClick={onClick}>
          Ir
        </Button>
        <Button href="#otro" disabled onClick={onClick}>
          No disponible
        </Button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Ir' });
    await expect(link.tagName).toBe('A');
    await expect(link).toHaveAttribute('href', '#destino');
    await expect(link).not.toHaveAttribute('type');
    // Forma Union del barrido de Primary
    await expect(link.querySelector('svg circle')).not.toBeNull();
    await userEvent.tab();
    await expect(link).toHaveFocus();

    const inactive = canvas.getByRole('link', { name: 'No disponible' });
    await expect(inactive).toHaveAttribute('aria-disabled', 'true');
    await expect(inactive).not.toHaveAttribute('href');
    await userEvent.tab();
    await expect(inactive).not.toHaveFocus();
  },
};

/** Test: medidas de ícono por tamaño (Figma) y `iconSize`; xs con ícono de 20 crece a 36 */
export const IconSizeTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex items-center gap-4 bg-ds-background-general-black p-6">
      <Button size="xs" iconOnly aria-label="xs">
        <AddIcon />
      </Button>
      <Button size="xs" variant="tertiary" iconOnly aria-label="xs tertiary">
        <AddIcon />
      </Button>
      <Button size="xs" leftIcon={<AddIcon />}>
        Texto xs
      </Button>
      <Button size="xs" iconSize={20} leftIcon={<AddIcon />}>
        Texto xs 20
      </Button>
      <Button size="md" leftIcon={<AddIcon />}>
        Texto md
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slot = (name: string) => canvas.getByRole('button', { name }).querySelector<HTMLElement>('[data-slot="icon"]')!;
    const box = (name: string) => canvas.getByRole('button', { name }).getBoundingClientRect();
    await expect(slot('xs').getBoundingClientRect().width).toBe(16);
    await expect(slot('xs tertiary').getBoundingClientRect().width).toBe(20);
    await expect(slot('Texto xs').getBoundingClientRect().width).toBe(14);
    await expect(slot('Texto md').getBoundingClientRect().width).toBe(20);
    // Icon-single xs: 32×32 (padding 8 + caja de 16) en todos los modos
    await expect(box('xs').width).toBe(32);
    await expect(box('xs').height).toBe(32);
    await expect(box('Texto xs').height).toBe(32);
    await expect(box('Texto xs 20').height).toBe(36);
  },
};

/** Test: Load usa el Spinner dots (decorativo) y conserva el foco */
export const LoadSpinnerTest: Story = {
  tags: ['!autodocs'],
  render: () => <Button loading>Guardar</Button>,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: /Guardar/ });
    const spinner = button.querySelector('[data-slot="load"]');
    await expect(spinner).not.toBeNull();
    await expect(spinner).toHaveAttribute('aria-hidden', 'true');
    await expect(spinner?.querySelectorAll('[data-figma-part^="Ellipse"]').length).toBe(3);
  },
};
