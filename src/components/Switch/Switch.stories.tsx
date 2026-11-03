import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Switch, SwitchTrack } from './Switch';
import type { SwitchProps } from './Switch.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Switch.doc';
import docsJson from './Switch.docs.json';

const meta = {
  title: 'Form Controls/Switch',
  component: Switch,
  // `checked` lo maneja el estado de la historia Interactive: sin control en Personalizar (sigue en Props)
  parameters: { layout: 'centered', docs: componentDocsParameters(doc, docsJson), docsLive: { exclude: ['checked', 'defaultChecked'] } },
  tags: ['autodocs'],
  // Tipos explícitos en las uniones: sin ellos Storybook descarta los args de la URL
  argTypes: argTypesFromDocsJson(docsJson, {
    type: { control: 'radio', options: ['simple', 'complex'], type: { name: 'enum', value: ['simple', 'complex'] } },
    checked: { control: 'boolean', type: { name: 'boolean' } },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
    trackLabel: { control: 'text' },
    children: { control: 'text' },
  }),
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

// Figma: 9335:5863
/**
 * Los 8 Toggle de Figma: Type × State × Active.
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

// Figma: 9504:6567
/**
 * Los 8 Toggle (Atom) de Figma: Type × State.
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

/** Test: la página Docs (plantilla v2) se dibuja con su encabezado, sus secciones y la referencia de código */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Switch' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Switch en Figma:']);
    // Marcadores de la anatomía: uno por pauta (3 grupos de 4)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(12);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
    const props = canvas.getByRole('table', { name: 'Props de Switch' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
    await expect(within(props).getByRole('rowheader', { name: /trackLabel/ })).toBeInTheDocument();
  },
};
