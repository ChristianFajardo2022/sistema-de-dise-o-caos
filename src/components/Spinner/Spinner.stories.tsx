import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Spinner } from './Spinner';
import type { SpinnerSize, SpinnerTone, SpinnerType, SpinnerVariant } from './Spinner.types';
import { Button } from '../Button';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Spinner.doc';
import docsJson from './Spinner.docs.json';

const VARIANTS: SpinnerVariant[] = ['ring', 'dots'];
const TYPES: SpinnerType[] = ['1', '2', '3'];
const SIZES: SpinnerSize[] = ['md', 'sm'];
const TONES: SpinnerTone[] = ['default', 'current'];

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  parameters: { layout: 'centered', docs: componentDocsParameters(doc, docsJson) },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    variant: { type: { name: 'enum', value: VARIANTS }, control: 'radio', options: VARIANTS },
    type: { type: { name: 'enum', value: TYPES }, control: 'radio', options: TYPES },
    size: { type: { name: 'enum', value: SIZES }, control: 'radio', options: SIZES },
    tone: { type: { name: 'enum', value: TONES }, control: 'radio', options: TONES },
    label: { type: { name: 'string' }, control: 'text' },
    decorative: { type: { name: 'boolean' }, control: 'boolean' },
    animated: { type: { name: 'boolean' }, control: 'boolean' },
  }),
  args: { variant: 'ring', type: '1', size: 'md', tone: 'default', label: 'Cargando', decorative: false, animated: true },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const Dots: Story = { args: { variant: 'dots' } };

/** Un spinner decorativo dentro de un control que ya anuncia el estado (aria-busy). */
export const InsideControl: Story = {
  render: () => (
    <button
      type="button"
      aria-busy="true"
      className="inline-flex items-center gap-2 rounded-ds-radius-button-full bg-ds-background-acent-tertiary px-4 py-2 text-ds-text-neutral-white-unicolor"
    >
      <Spinner variant="dots" size="sm" tone="current" decorative />
      Guardando
    </button>
  ),
};

/** Comparación con el Load de Button (que tiene su propio dibujo). */
export const NextToButtonLoad: Story = {
  render: () => (
    <div className="flex items-center gap-8 text-ds-text-neutral-white">
      <Button loading>Guardar</Button>
      <Spinner variant="dots" />
    </div>
  ),
};

/**
 * Las 8 variantes de Figma: Spinner (Type 1 y 2) y Spinner button (Type × Size), cada una una vez y sin
 * animar. `data-figma` usa el nombre de cada set. Va sobre la superficie del tema.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de Spinner" className="max-w-full overflow-x-auto">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-8" data-set="spinner/spinner">
            {(['1', '2'] as const).map((t) => (
              <Spinner key={t} type={t} animated={false} label={`Spinner tipo ${t}`} data-figma={`Type=${t}`} />
            ))}
          </div>
          <div className="grid grid-cols-[auto_repeat(3,auto)] items-center justify-items-start gap-x-8 gap-y-4" data-set="spinner/spinner-button">
            <span />
            {TYPES.map((t) => (
              <span key={t} className="text-xs text-ds-text-neutral-body">Type {t}</span>
            ))}
            {SIZES.map((s) => (
              <div key={s} className="contents">
                <span className="text-xs text-ds-text-neutral-body">{s.toUpperCase()}</span>
                {TYPES.map((t) => (
                  <Spinner
                    key={t}
                    variant="dots"
                    type={t}
                    size={s}
                    animated={false}
                    label={`Spinner button tipo ${t} ${s}`}
                    data-figma={`Type=${t}, Size=${s[0].toUpperCase()}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

/** Solo el set Spinner (para el comparador de spinner/spinner). */
export const FigmaMatrixSpinner: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex items-center gap-8 bg-ds-background-general-black p-6">
      {(['1', '2'] as const).map((t) => (
        <Spinner key={t} type={t} animated={false} label={`Spinner tipo ${t}`} data-figma={`Type=${t}`} />
      ))}
    </div>
  ),
};

/** Solo el set Spinner button (para el comparador de spinner/spinner-button). */
export const FigmaMatrixButton: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  render: () => (
    <div className="grid grid-cols-3 items-center justify-items-start gap-x-8 gap-y-4 bg-ds-background-general-black p-6">
      {SIZES.flatMap((s) =>
        TYPES.map((t) => (
          <Spinner
            key={`${t}${s}`}
            variant="dots"
            type={t}
            size={s}
            animated={false}
            label={`Spinner button tipo ${t} ${s}`}
            data-figma={`Type=${t}, Size=${s[0].toUpperCase()}`}
          />
        ))
      )}
    </div>
  ),
};

/** Test: role status con nombre accesible; decorative lo oculta */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <Spinner />
      <Spinner variant="dots" label="Guardando cambios" />
      <span data-testid="deco"><Spinner decorative /></span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status', { name: 'Cargando' })).toBeInTheDocument();
    await expect(canvas.getByRole('status', { name: 'Guardando cambios' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('status')).toHaveLength(2);
    const deco = within(canvas.getByTestId('deco')).queryByRole('status');
    await expect(deco).toBeNull();
    await expect(canvas.getByTestId('deco').firstElementChild).toHaveAttribute('aria-hidden', 'true');
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Spinner' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Spinner en Figma:']);
    // Marcadores de la anatomía: uno por pauta (3 + 4 + 2)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(9);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Spinner' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
