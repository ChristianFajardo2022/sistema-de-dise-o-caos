import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Tag } from './Tag';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Tag.doc';
import docsJson from './Tag.docs.json';
import type { TagSize, TagState, TagType } from './Tag.types';

const TYPES: { type: TagType; figma: string }[] = [
  { type: 'default', figma: 'Default' },
  { type: 'success', figma: 'Success' },
  { type: 'alert', figma: 'Alert' },
  { type: 'error', figma: 'Error' },
  { type: 'info', figma: 'Info' },
  { type: 'neutral', figma: 'Neutral' },
];
const STATES: { state: TagState; figma: string }[] = [
  { state: 'default', figma: 'Default' },
  { state: 'hover', figma: 'Hover' },
  { state: 'focus', figma: 'Focus' },
  { state: 'press', figma: 'Press' },
  { state: 'inactive', figma: 'Inactive' },
];
const SIZES: TagSize[] = ['md', 'sm'];

const meta = {
  title: 'Data Display/Tag',
  component: Tag,
  tags: ['autodocs'],
  parameters: { docs: componentDocsParameters(doc, docsJson) },
  argTypes: argTypesFromDocsJson(docsJson, {
    type: {
      type: { name: 'enum', value: ['default', 'success', 'alert', 'error', 'info', 'neutral'] },
      control: 'select',
      options: ['default', 'success', 'alert', 'error', 'info', 'neutral'],
      description: 'Type: color semántico',
    },
    size: {
      type: { name: 'enum', value: ['sm', 'md'] },
      control: 'radio',
      options: ['sm', 'md'],
      description: 'Size: md 32 · sm 24',
    },
    state: {
      type: { name: 'enum', value: ['default', 'hover', 'focus', 'press', 'inactive'] },
      control: 'select',
      options: ['default', 'hover', 'focus', 'press', 'inactive'],
      description: 'State forzado, solo para documentación. En uso real lo dan :hover, :focus-visible, :active y disabled.',
    },
    iconLeft: { type: { name: 'boolean' }, control: 'boolean', description: 'Icon-left' },
    disabled: { type: { name: 'boolean' }, control: 'boolean', description: 'Inactive' },
    children: { control: 'text', description: 'Text' },
  }),
  args: { type: 'default', size: 'md', iconLeft: true, children: 'Activo' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Etiqueta estática (span): sin hover, foco ni press. */
export const Interactive: Story = {};

/** Con `onClick` es un botón con hover, foco visible y press reales. */
export const Clickable: Story = {
  args: { onClick: fn() },
};

/** Las 60 variantes de Figma: Type × State × Size. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de Tag" className="max-w-full overflow-x-auto">
        {SIZES.map((size) => (
          <div key={size} className="mb-8 grid grid-cols-[auto_repeat(5,auto)] items-center justify-items-start gap-x-8 gap-y-4">
            <span className="text-xs text-ds-text-neutral-body">{size}</span>
            {STATES.map((s) => (
              <span key={s.state} className="text-xs text-ds-text-neutral-body">{s.state}</span>
            ))}
            {TYPES.map((t) => (
              <div key={t.type} className="contents">
                <span className="text-xs text-ds-text-neutral-body">{t.type}</span>
                {STATES.map((s) => (
                  <span key={s.state} className="inline-flex p-1">
                    <Tag
                      type={t.type}
                      size={size}
                      state={s.state}
                      onClick={() => {}}
                      data-figma={`Type=${t.figma}, State=${s.figma}, Size=${size}`}
                    >
                      Text
                    </Tag>
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
};

/** Test: sin onClick es un span; con onClick es un botón con nombre, activable con teclado. */
export const RoleTest: Story = {
  tags: ['!autodocs'],
  render: () => {
    const onClick = fn();
    return (
      <div>
        <Tag data-testid="static">Estática</Tag>
        <Tag data-testid="btn" onClick={onClick}>Filtro</Tag>
        <Tag data-testid="off" onClick={onClick} disabled>Apagada</Tag>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('static').tagName).toBe('SPAN');
    const btn = canvas.getByRole('button', { name: 'Filtro' });
    await expect(btn).toHaveAttribute('type', 'button');
    await userEvent.tab();
    await expect(btn).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await userEvent.click(btn);
    await expect(canvas.getByRole('button', { name: 'Apagada' })).toBeDisabled();
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Tag' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Tag en Figma:']);
    // Marcadores de la anatomía: uno por pauta (3 + 3)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(6);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Tag' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
