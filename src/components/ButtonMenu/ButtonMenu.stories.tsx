import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ButtonMenu } from './ButtonMenu';
import type { ButtonMenuProps, ButtonMenuState } from './ButtonMenu.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './ButtonMenu.doc';
import docsJson from './ButtonMenu.docs.json';

/** Un botón con submenú (sin `href` y con chevron) alterna `aria-expanded` al hacer clic. */
const opensSubmenu = (args: Record<string, unknown>) => args.iconRight === true && !args.href;

/**
 * Código de Desarrollo: el mismo botón del lienzo, listo para copiar. Si abre un submenú, declara su estado y
 * alterna `aria-expanded`; `aria-controls` apunta al id del submenú que arma quien lo usa.
 */
function docsCode(args: Record<string, unknown>) {
  const { children, ...rest } = args;
  const props = Object.entries(rest).flatMap(([name, value]) =>
    typeof value === 'string' && value ? [`${name}="${value.replace(/"/g, '&quot;')}"`] : value === true ? [name] : []
  );
  const toggles = opensSubmenu(args) ? ['aria-expanded={open}', 'aria-controls="submenu-proyectos"', 'onClick={() => setOpen(!open)}'] : [];
  const all = [...props, ...toggles];
  const tag = all.length > 2 ? ['<ButtonMenu', ...all.map((p) => `  ${p}`), '>'].join('\n') : `<ButtonMenu${all.map((p) => ` ${p}`).join('')}>`;
  const state = toggles.length ? 'const [open, setOpen] = useState(false);\n\n' : '';
  return `${state}${tag}\n  ${String(children ?? '')}\n</ButtonMenu>`;
}

/** Lienzo de Interactive: el botón con submenú alterna `aria-expanded` de verdad. */
function InteractiveButtonMenu(args: ButtonMenuProps) {
  const [open, setOpen] = useState(false);
  const toggles = opensSubmenu(args as Record<string, unknown>);
  return <ButtonMenu {...args} aria-expanded={toggles ? open : args['aria-expanded']} onClick={toggles ? () => setOpen(!open) : args.onClick} />;
}

const meta = {
  title: 'Navigation/Button menu',
  component: ButtonMenu,
  tags: ['autodocs'],
  parameters: { docs: componentDocsParameters(doc, docsJson), docsLive: { story: 'Interactive', code: docsCode } },
  argTypes: argTypesFromDocsJson(docsJson, {
    iconRight: { control: 'boolean', type: { name: 'boolean' }, description: 'Icon-rigth de Figma: chevron hacia abajo (abre un submenú)' },
    selected: { control: 'boolean', type: { name: 'boolean' }, description: 'Sección actual (Press/select, aria-current)' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'State Inactive' },
    state: {
      control: 'select',
      options: [undefined, 'default', 'hover', 'focus', 'press', 'inactive'],
      type: { name: 'enum', value: ['default', 'hover', 'focus', 'press', 'inactive'] },
      description: 'Fuerza el aspecto de un State (solo documentación)',
    },
    href: { control: 'text', type: { name: 'string' }, description: 'Con href es un enlace; sin él, un botón' },
    children: { control: 'text', type: { name: 'string' }, description: 'Text de Figma' },
  }),
  args: { children: 'Proyectos', iconRight: true },
  // Los botones se pintan sobre la superficie del tema
  decorators: [
    (Story) => (
      <div className="bg-ds-background-container-surface p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ButtonMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. */
export const Interactive: Story = {
  render: (args) => <InteractiveButtonMenu {...args} />,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Proyectos' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  },
};

/** Con `href` es un enlace; la sección actual se marca con `selected` (aria-current="page"). */
export const AsLink: Story = {
  args: { href: '#inicio', iconRight: false, children: 'Inicio', selected: true },
};

/** Un botón con submenú expone `aria-expanded`; abierto se pinta en Press/select. */
export const Expanded: Story = { args: { 'aria-expanded': true } };

/** Con ícono de la biblioteca antes del texto (Icon-left de Figma). */
export const WithLeftIcon: Story = { args: { iconLeft: 'heart', iconRight: false } };

const STATES: { name: string; label: ButtonMenuState }[] = [
  { name: 'Default', label: 'default' },
  { name: 'Hover', label: 'hover' },
  { name: 'Focus', label: 'focus' },
  { name: 'Press/select', label: 'press' },
  { name: 'Inactive', label: 'inactive' },
];

/** Los cinco State del set de Figma (Type Default). Sin chevron ni ícono: en el set de Figma ambos están ocultos (Icon-left e Icon-rigth en false). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8 bg-ds-background-container-surface p-6">
      {STATES.map((s) => (
        <ButtonMenu key={s.name} data-figma={`Type=Default, State=${s.name}`} state={s.label}>
          Button
        </ButtonMenu>
      ))}
    </div>
  ),
};

/** Test: rol y nombre, estado expandido, enlace actual y foco con teclado. */
export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex items-center gap-4 bg-ds-background-container-surface p-6">
      <ButtonMenu iconRight aria-expanded="false" aria-controls="x">
        Productos
      </ButtonMenu>
      <ButtonMenu href="#inicio" selected>
        Inicio
      </ButtonMenu>
      <ButtonMenu disabled>Soporte</ButtonMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Productos' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('link', { name: 'Inicio' })).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('button', { name: 'Soporte' })).toBeDisabled();
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Button menu' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Button menu en Figma:']);
    await expect(canvas.getByRole('switch', { name: 'Modo oscuro' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
    // Sin Storybook no hay lienzo, código ni Personalizar: solo el bloque Props, de solo lectura
    const props = canvas.getByRole('table', { name: 'Props de ButtonMenu' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
    await expect(canvas.queryByRole('group', { name: 'Personalizar' })).not.toBeInTheDocument();
  },
};
