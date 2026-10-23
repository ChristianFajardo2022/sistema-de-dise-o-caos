import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Switch, SwitchTrack } from './Switch';
import type { SwitchProps } from './Switch.types';

const meta = {
  title: 'Form Controls/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['simple', 'complex'],
      description: 'Type del átomo: simple o complex (texto dentro de la pista)',
      type: { name: 'enum', value: ['simple', 'complex'] },
    },
    checked: { control: 'boolean', description: 'Encendido (controlado)', type: { name: 'boolean' } },
    disabled: { control: 'boolean', description: 'Deshabilitado', type: { name: 'boolean' } },
    trackLabel: { control: 'text', description: 'Texto dentro de la pista (solo complex)' },
    children: { control: 'text', description: 'Descripción junto a la pista' },
  },
  args: { type: 'simple', disabled: false },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveDemo(args: SwitchProps) {
  const [checked, setChecked] = useState(false);
  return <Switch {...args} checked={checked} onCheckedChange={setChecked} />;
}

export const Interactive: Story = {
  args: { children: 'Recibir notificaciones' },
  render: (args) => <InteractiveDemo {...args} />,
};

export const WithDescription: Story = {
  args: { children: 'Modo avanzado', defaultChecked: true },
};

export const Complex: Story = {
  args: { type: 'complex', trackLabel: 'Activo' },
};

export const Disabled: Story = {
  args: { children: 'Opción no disponible', disabled: true, defaultChecked: true },
};

const LABEL = 'text-xs text-ds-text-neutral-body';

/**
 * Los 8 Toggle de Figma (set 9335:5863): Type × State × Active.
 * Text = pista simple con descripción; Only = pista complex con texto dentro y sin descripción.
 * Va sobre la superficie del tema (background/general/black).
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de Switch" className="max-w-full overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(4,auto)] items-center justify-items-start gap-x-8 gap-y-4">
          <span />
          {(['Default', 'Disabled'] as const).flatMap((state) =>
            (['ON', 'OFF'] as const).map((active) => (
              <span key={`${state}${active}`} className={LABEL}>{`${state} · ${active}`}</span>
            ))
          )}
          {(['Text', 'Only'] as const).map((figmaType) => (
            <div key={figmaType} className="contents">
              <span className={LABEL}>{figmaType}</span>
              {(['Default', 'Disabled'] as const).flatMap((state) =>
                (['ON', 'OFF'] as const).map((active) => {
                  const name = `Type=${figmaType}, State=${state}, Active=${active}`;
                  const common = {
                    rootProps: { 'data-figma': name },
                    defaultChecked: active === 'ON',
                    disabled: state === 'Disabled',
                  };
                  return figmaType === 'Text' ? (
                    <Switch key={name} {...common}>
                      Text description
                    </Switch>
                  ) : (
                    <Switch key={name} {...common} type="complex" trackLabel="Text" />
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/**
 * Los 8 Toggle (Atom) de Figma (set 9504:6567): Type × State.
 * "Toggle" solo existe en Disabled active y es el mismo dibujo que Simple.
 */
export const FigmaMatrixAtom: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const states = [
      { figma: 'Default', checked: false, disabled: false },
      { figma: 'Select', checked: true, disabled: false },
      { figma: 'Disabled inactive', checked: false, disabled: true },
      { figma: 'Disabled active', checked: true, disabled: true },
    ];
    const rows = [
      { figma: 'Simple', type: 'simple' as const, skip: ['Disabled active'] },
      { figma: 'Complex', type: 'complex' as const, skip: [] as string[] },
      { figma: 'Toggle', type: 'simple' as const, skip: ['Default', 'Select', 'Disabled inactive'] },
    ];
    return (
      <div className="bg-ds-background-general-black p-6">
        <div role="region" tabIndex={0} aria-label="Matriz del átomo de Switch" className="max-w-full overflow-x-auto">
          <div className="grid grid-cols-[auto_repeat(4,auto)] items-center justify-items-start gap-x-8 gap-y-4">
            <span />
            {states.map((s) => (
              <span key={s.figma} className={LABEL}>{s.figma}</span>
            ))}
            {rows.map((r) => (
              <div key={r.figma} className="contents">
                <span className={LABEL}>{r.figma}</span>
                {states.map((s) =>
                  r.skip.includes(s.figma) ? (
                    <span key={s.figma} />
                  ) : (
                    <SwitchTrack
                      key={s.figma}
                      type={r.type}
                      checked={s.checked}
                      disabled={s.disabled}
                      label="Text"
                      data-figma={`Type=${r.figma}, State=${s.figma}`}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/** Test: rol switch con nombre, clic, Espacio y Enter alternan; onCheckedChange recibe el valor */
export const ToggleTest: Story = {
  tags: ['!autodocs'],
  args: { children: 'Notificaciones', onCheckedChange: fn() },
  play: async ({ args, canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch', { name: 'Notificaciones' });
    await expect(within(canvasElement).getByLabelText('Notificaciones')).toBe(sw);
    await expect(sw).not.toBeChecked();
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(within(canvasElement).getByText('Notificaciones'));
    await expect(sw).not.toBeChecked();
    sw.focus();
    await expect(sw).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(sw).toBeChecked();
    await userEvent.keyboard('{Enter}');
    await expect(sw).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(4);
  },
};

/** Test: controlado, el valor lo manda checked; disabled no cambia ni avisa */
export const DisabledTest: Story = {
  tags: ['!autodocs'],
  args: { children: 'No disponible', disabled: true, onCheckedChange: fn() },
  play: async ({ args, canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch', { name: 'No disponible' });
    await expect(sw).toBeDisabled();
    await userEvent.click(sw);
    await userEvent.click(within(canvasElement).getByText('No disponible'));
    await expect(sw).not.toBeChecked();
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

/** Test: el texto de la pista complex es el nombre accesible cuando no hay descripción */
export const ComplexNameTest: Story = {
  tags: ['!autodocs'],
  args: { type: 'complex', trackLabel: 'Sonido', defaultChecked: true },
  play: async ({ canvasElement }) => {
    const sw = within(canvasElement).getByRole('switch', { name: 'Sonido' });
    await expect(sw).toBeChecked();
    // El texto de la pista nombra al control por aria-labelledby y la pista queda oculta: no se lee dos veces
    await expect(sw).toHaveAttribute('aria-labelledby');
    await expect(canvasElement.querySelector('[data-figma-part="Toggle (Atom)"]')).toHaveAttribute('aria-hidden', 'true');
  },
};
