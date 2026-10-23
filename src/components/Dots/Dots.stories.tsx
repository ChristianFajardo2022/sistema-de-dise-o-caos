import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Dots } from './Dots';
import type { DotsProps, DotsSize, DotsState } from './Dots.types';
import { DropdownMenu, DropdownMenuItem, DropdownMenuPanel } from '../DropdownMenu';
import { cn } from '../../utils/cn';

const SIZE_OPTIONS: DotsSize[] = ['xs', 'sm', 'md'];
const STATE_OPTIONS: DotsState[] = ['default', 'hover', 'focus', 'press', 'inactive'];

const FRAME_SIZE: Record<DotsSize, string> = { xs: 'size-8', sm: 'size-12', md: 'size-14' };

const meta = {
  title: 'Navigation/Dots',
  component: Dots,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: SIZE_OPTIONS, type: { name: 'enum', value: SIZE_OPTIONS }, description: 'Size de Figma: xs 32, sm 48, md 56' },
    state: { control: 'select', options: [undefined, ...STATE_OPTIONS], type: { name: 'enum', value: STATE_OPTIONS }, description: 'State forzado, solo para documentación' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Inactive de Figma' },
  },
  args: { size: 'md', label: 'Más opciones', disabled: false },
} satisfies Meta<typeof Dots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

/** Dots como disparador de `DropdownMenu`: el menú pone `aria-expanded`, que Dots dibuja como Press. */
function MenuDemo(args: DotsProps) {
  const [last, setLast] = useState('');
  return (
    <div className="flex min-h-48 w-72 flex-col items-end gap-4 p-4">
      <DropdownMenu aria-label="Acciones de la fila" trigger={<Dots {...args} label="Acciones de la fila" />}>
        <DropdownMenuItem type="icon" icon="add-circle" onSelect={() => setLast('Agregar')}>
          Agregar
        </DropdownMenuItem>
        <DropdownMenuItem type="icon" icon="add-circle" onSelect={() => setLast('Duplicar')}>
          Duplicar
        </DropdownMenuItem>
      </DropdownMenu>
      <span className="text-xs text-ds-text-neutral-body" role="status">{last && `Elegiste: ${last}`}</span>
    </div>
  );
}

export const WithMenu: Story = {
  render: (args) => <MenuDemo {...args} />,
};

const FIGMA_STATE: Record<DotsState, string> = { default: 'Default', hover: 'Hover', focus: 'Focus', press: 'Press', inactive: 'Inactive' };

/** Las 15 variantes del set 11194:12200. En Press, el panel (DropdownMenuPanel en línea) queda abierto debajo, como en Figma. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de Dots" className="max-w-full overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(3,auto)] items-center justify-items-start gap-x-44 gap-y-4">
          <span />
          {SIZE_OPTIONS.map((s) => (
            <span key={s} className="text-xs text-ds-text-neutral-body">{s}</span>
          ))}
          {STATE_OPTIONS.map((state) => (
            <div key={state} className="contents">
              <span className="text-xs text-ds-text-neutral-body">{state}</span>
              {SIZE_OPTIONS.map((size) => (
                // Marco transparente de Figma (data-figma): columna con gap 4 (el OFFSET del DropdownMenu); en Press el
                // set Dropdown (200 de ancho) queda abierto debajo, con su borde derecho en el del botón
                <span
                  key={size}
                  data-figma={`State=${FIGMA_STATE[state]}, Size=${size}`}
                  className={cn(
                    'inline-flex flex-col items-end gap-ds-space-general-md',
                    // El marco raíz de Figma mide lo que el botón; el Dropdown de Press se sale por debajo
                    state === 'press' && FRAME_SIZE[size],
                    state === 'press' && 'mb-24'
                  )}
                >
                  <Dots size={size} state={state} label={`Más opciones ${state} ${size}`} data-figma-part="Button" />
                  {state === 'press' && (
                    <DropdownMenuPanel
                      aria-label={`Panel ${size}`}
                      scrollbar={false}
                      data-figma-part="Dropdown"
                      className="w-50 max-w-none"
                    >
                      <DropdownMenuItem type="icon" icon="add-circle">Text item</DropdownMenuItem>
                      <DropdownMenuItem type="icon" icon="add-circle">Text item</DropdownMenuItem>
                    </DropdownMenuPanel>
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: rol button con nombre accesible, activa con clic y con teclado */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  args: { label: 'Más opciones de la tarjeta', onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Más opciones de la tarjeta' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

/** Test: disabled no se activa ni se enfoca */
export const DisabledTest: Story = {
  tags: ['!autodocs'],
  args: { disabled: true, onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Más opciones' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** Test: como disparador de DropdownMenu abre con clic y con flecha abajo, y Esc devuelve el foco */
export const MenuTriggerTest: Story = {
  tags: ['!autodocs'],
  render: (args) => <MenuDemo {...args} />,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Acciones de la fila' });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
    const menu = within(document.body).getByRole('menu', { name: 'Acciones de la fila' });
    await waitFor(() => expect(within(menu).getAllByRole('menuitem')[0]).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
  },
};
