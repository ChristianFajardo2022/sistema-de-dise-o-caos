import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Badge } from './Badge';
import type { BadgeState, BadgeType } from './Badge.types';
import { caosIcons } from '../../icons/caos/registry.generated';
import type { IconName } from '../../icons/caos/registry.generated';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Badge.doc';
import docsJson from './Badge.docs.json';

const TYPE_OPTIONS: BadgeType[] = ['simple', 'icon', 'number', 'icon-number'];
const STATE_OPTIONS: BadgeState[] = [
  'default', 'success', 'alert', 'error', 'info', 'neutral', 'negative', 'positive', 'inactive',
];

const ICON_NAMES = Object.keys(caosIcons) as IconName[];

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  parameters: { layout: 'centered', docs: componentDocsParameters(doc, docsJson) },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    type: {
      name: 'type',
      control: 'radio',
      options: TYPE_OPTIONS,
      type: { name: 'enum', value: TYPE_OPTIONS },
      description: 'Type de Figma: punto, ícono, número o ícono + número',
    },
    state: {
      name: 'state',
      control: 'select',
      options: STATE_OPTIONS,
      type: { name: 'enum', value: STATE_OPTIONS },
      description: 'State de Figma: color semántico (el badge no es interactivo)',
    },
    children: { control: 'text', type: { name: 'string' }, description: 'Prop Text de Figma (number e icon-number)' },
    label: { control: 'text', type: { name: 'string' }, description: 'Texto para lectores de pantalla' },
    icon: { control: 'select', options: ICON_NAMES, description: 'Nombre del ícono (tipos icon e icon-number)' },
  }),
  args: { type: 'icon-number', state: 'default', children: '5', label: 'notificaciones sin leer' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const NotificationCounter: Story = {
  args: { type: 'number', state: 'error', children: '99+', label: 'notificaciones sin leer' },
};

const TYPES: { type: BadgeType; figma: string }[] = [
  { type: 'simple', figma: 'Simple' },
  { type: 'icon', figma: 'Icon' },
  { type: 'number', figma: 'Number' },
  { type: 'icon-number', figma: 'Icon + number' },
];
const STATES: { state: BadgeState; figma: string }[] = [
  { state: 'default', figma: 'Default' },
  { state: 'success', figma: 'Success' },
  { state: 'alert', figma: 'Alert' },
  { state: 'error', figma: 'Error' },
  { state: 'info', figma: 'Info' },
  { state: 'neutral', figma: 'Neutral' },
  { state: 'negative', figma: 'Negative' },
  { state: 'positive', figma: 'Positive' },
  { state: 'inactive', figma: 'Inactive' },
];

/**
 * Las 36 variantes de Figma (Type × State), cada una una vez.
 * Va sobre la superficie del tema (background/general/black): negative y positive
 * son blanco y negro del tema, así que una de las dos se funde con el fondo según el tema.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
     <div role="region" tabIndex={0} aria-label="Matriz de Badge" className="max-w-full overflow-x-auto">
      <div className="grid grid-cols-[auto_repeat(9,auto)] items-center justify-items-start gap-x-8 gap-y-4">
        <span />
        {STATES.map((s) => (
          <span key={s.state} className="text-xs text-ds-text-neutral-body">{s.state}</span>
        ))}
        {TYPES.map((t) => (
          <div key={t.type} className="contents">
            <span className="text-xs text-ds-text-neutral-body">{t.type}</span>
            {STATES.map((s) => (
              <span key={s.state} className="inline-flex">
                <Badge
                  type={t.type}
                  state={s.state}
                  label={`${t.figma} ${s.figma}`}
                  data-figma={`Type=${t.figma}, State=${s.figma}`}
                >
                  00
                </Badge>
              </span>
            ))}
          </div>
        ))}
      </div>
     </div>
    </div>
  ),
};

/** Test: número con label expone ambos textos; simple e icon sin label son decorativos */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <Badge data-testid="counter" type="number" state="error" label="notificaciones sin leer">5</Badge>
      <Badge data-testid="dot" type="simple" />
      <Badge data-testid="status" type="icon" state="success" label="Completado" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('counter')).toHaveTextContent('5 notificaciones sin leer');
    await expect(canvas.getByTestId('counter')).not.toHaveAttribute('aria-hidden');
    await expect(canvas.getByTestId('dot')).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByTestId('status')).toHaveTextContent('Completado');
    await expect(canvas.getByTestId('status').tagName).toBe('SPAN');
  },
};

/** Página de documentación completa (la revisan vitest y axe). */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [],
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Badge' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Badge en Figma:']);
    // Marcadores de la anatomía: uno por pauta (3 + 3 + 2)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(8);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Badge' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
