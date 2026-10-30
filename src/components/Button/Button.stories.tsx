import type { Decorator, Meta, StoryObj } from '@storybook/react';
import type { ComponentType } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import type { ButtonBaseProps, ButtonProps, ButtonState } from './Button.types';
import { AddIcon } from '../../icons/AddIcon';
import { ArrowRightIcon } from '../../icons/ArrowRightIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { SettingIcon } from '../../icons/SettingIcon';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Button.doc';
import docsJson from './Button.docs.json';

/** Args de Storybook: props base sin la unión (los args son parciales); iconOnly sin exigir aria-label */
type ButtonArgs = ButtonBaseProps & { iconOnly?: boolean };

/** Omit que conserva la unión discriminada de ButtonProps */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

const meta: Meta<ButtonArgs> = {
  title: 'General Controls/Button',
  component: Button as unknown as ComponentType<ButtonArgs>,
  tags: ['autodocs'],
  parameters: { docs: componentDocsParameters(doc, docsJson) },
  // Tipos explícitos: con la unión discriminada de ButtonProps el docgen no los infiere y Storybook descarta los args de la URL
  argTypes: argTypesFromDocsJson(docsJson, {
    variant: {
      type: { name: 'enum', value: ['primary', 'secondary', 'tertiary'] },
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Type: jerarquía visual del botón',
    },
    contrast: {
      type: { name: 'enum', value: ['low', 'high'] },
      control: 'radio',
      options: ['low', 'high'],
      description: 'Contrats: solo aplica a secondary',
    },
    unicolor: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Unicolor: secondary y tertiary sin icon-single',
    },
    size: {
      type: { name: 'enum', value: ['md', 'sm', 'xs'] },
      control: 'radio',
      options: ['md', 'sm', 'xs'],
      description: 'Size: md 56 · sm 48 · xs 32',
    },
    state: {
      type: { name: 'enum', value: ['default', 'hover', 'focus', 'press', 'inactive', 'delete', 'load'] },
      control: 'select',
      options: ['default', 'hover', 'focus', 'press', 'inactive', 'delete', 'load'],
      description: 'State forzado (hover, focus y press solo para visualización). Tertiary no tiene load.',
    },
    loading: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Estado load: spinner y aria-busy',
    },
    disabled: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Estado inactive',
    },
    iconOnly: {
      type: { name: 'boolean' },
      control: 'boolean',
      description: 'Icon-single: botón cuadrado solo con ícono',
    },
  }),
  args: {
    children: 'Button',
    variant: 'primary',
    contrast: 'low',
    unicolor: false,
    size: 'md',
    state: 'default',
    loading: false,
    disabled: false,
    iconOnly: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATES: ButtonState[] = ['default', 'hover', 'focus', 'press', 'inactive', 'delete', 'load'];

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const SecondaryLow: Story = {
  args: { variant: 'secondary', contrast: 'low' },
};

export const SecondaryHigh: Story = {
  args: { variant: 'secondary', contrast: 'high' },
};

export const Tertiary: Story = {
  args: { variant: 'tertiary' },
};

/** Unicolor se usa sobre foto o color: texto e ícono son blancos en ambos modos, así que se muestra sobre N01. */
const OnDarkSurface: Decorator = (Story) => (
  <div className="inline-flex bg-ds-primitives-color-primary-n01 p-6">
    <Story />
  </div>
);

export const Unicolor: Story = {
  args: { variant: 'secondary', unicolor: true },
  decorators: [OnDarkSurface],
};

export const WithIcons: Story = {
  args: {
    variant: 'primary',
    leftIcon: <AddIcon />,
    rightIcon: <ArrowRightIcon />,
  },
};

export const IconSingle: Story = {
  args: {
    variant: 'secondary',
    iconOnly: true,
    children: <SettingIcon />,
    'aria-label': 'Configuración',
  },
};

export const Delete: Story = {
  args: {
    variant: 'primary',
    state: 'delete',
    leftIcon: <TrashIcon />,
    children: 'Eliminar',
  },
};

export const Load: Story = {
  args: { variant: 'primary', loading: true },
};

export const Inactive: Story = {
  args: { variant: 'primary', disabled: true },
};

/** Matriz de Type × State, como el component set de Figma. */
export const StatesMatrix: Story = {
  render: () => {
    // Orden de Figma: texto (con Unicolor) y luego Icon-single
    const rows: { label: string; props: DistributiveOmit<ButtonProps, 'state'> }[] = [
      { label: 'Primary', props: { variant: 'primary' } },
      { label: 'Secondary low', props: { variant: 'secondary', contrast: 'low' } },
      { label: 'Unicolor', props: { variant: 'secondary', contrast: 'low', unicolor: true } },
      { label: 'Secondary high', props: { variant: 'secondary', contrast: 'high' } },
      { label: 'Unicolor', props: { variant: 'secondary', contrast: 'high', unicolor: true } },
      { label: 'Tertiary', props: { variant: 'tertiary' } },
      { label: 'Tertiary unicolor', props: { variant: 'tertiary', unicolor: true } },
      { label: 'Primary · ícono', props: { variant: 'primary', iconOnly: true, 'aria-label': 'Agregar', children: <AddIcon /> } },
      { label: 'Secondary low · ícono', props: { variant: 'secondary', contrast: 'low', iconOnly: true, 'aria-label': 'Agregar', children: <AddIcon /> } },
      { label: 'Secondary high · ícono', props: { variant: 'secondary', contrast: 'high', iconOnly: true, 'aria-label': 'Agregar', children: <AddIcon /> } },
      { label: 'Tertiary · ícono', props: { variant: 'tertiary', iconOnly: true, 'aria-label': 'Agregar', children: <AddIcon /> } },
    ];
    // Si el ancho no alcanza, la matriz se desplaza dentro de su marco en vez de salirse (-m-2 p-2: deja ver el fondo de Unicolor en los bordes)
    return (
      <div className="-m-2 overflow-x-auto p-2">
        <div className="grid w-max grid-cols-[5rem_repeat(7,auto)] items-center gap-4">
          <span />
          {STATES.map((s) => (
            <span key={s} className="text-xs text-ds-text-neutral-body">{s}</span>
          ))}
          {rows.map((row, i) => (
            <div key={`${row.label}-${i}`} className="contents">
              <span className="text-xs text-ds-text-neutral-body">{row.label}</span>
              {STATES.map((s) =>
                row.props.variant === 'tertiary' && s === 'load' ? (
                  <span key={s} />
                ) : (
                  // Unicolor sobre N01 para que se lea también en modo claro; -m-2 compensa el relleno y no ensancha la columna
                  <div key={s} className={row.props.unicolor ? '-m-2 bg-ds-primitives-color-primary-n01 p-2' : undefined}>
                    <Button {...row.props} state={s}>{row.props.children ?? 'Button'}</Button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

/** Icon-single en los tres tamaños y tipos. */
export const IconSingleMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['md', 'sm', 'xs'] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-8 text-xs text-ds-text-neutral-body">{size}</span>
          <Button size={size} iconOnly variant="primary" aria-label="Agregar"><AddIcon /></Button>
          <Button size={size} iconOnly variant="secondary" aria-label="Agregar"><AddIcon /></Button>
          <Button size={size} iconOnly variant="secondary" contrast="high" aria-label="Agregar"><AddIcon /></Button>
          <Button size={size} iconOnly variant="tertiary" aria-label="Agregar"><AddIcon /></Button>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['primary', 'secondary', 'tertiary'] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <Button size="md" variant={variant} leftIcon={<AddIcon />}>md 56</Button>
          <Button size="sm" variant={variant} leftIcon={<AddIcon />}>sm 48</Button>
          <Button size="xs" variant={variant} leftIcon={<AddIcon />}>xs 32</Button>
        </div>
      ))}
    </div>
  ),
};

export const HoverSpecifications: Story = {
  args: {
    variant: "primary"
  },

  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-ds-text-neutral-body">
          Interacción en vivo (Dissolve 300 ms, Ease out)
        </h3>
        <p className="text-xs text-ds-text-neutral-body mb-4">
          Pasa el cursor para ver el ciclo de 4 fases en Primary, el cambio de borde en Secondary y el fondo y subrayado en Tertiary. Usa Tab para ver Focus y mantén presionado para ver Press.
        </p>
        <div className="flex items-center gap-6">
          <Button variant="primary">Button</Button>
          <Button variant="secondary">Button</Button>
          <Button variant="secondary" contrast="high">Button</Button>
          <Button variant="tertiary">Button</Button>
        </div>
      </div>
    </div>
  )
};

/** Test: el clic llama a onClick */
export const ClickTest: Story = {
  tags: ['!autodocs'],
  args: { onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Button' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Test: Tab llega al botón y Enter y Espacio lo activan */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Button' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

/** Test: en Load no se llama a onClick, hay aria-busy, el foco se conserva y el nombre incluye el texto */
export const LoadingTest: Story = {
  tags: ['!autodocs'],
  args: { variant: 'primary', loading: true, onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: /Button/ });
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.click(button);
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(button).toHaveFocus();
  },
};

/** Test: inactive no recibe clic ni foco */
export const InactiveTest: Story = {
  tags: ['!autodocs'],
  args: { disabled: true, onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Button' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await userEvent.tab();
    await expect(button).not.toHaveFocus();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** Test: la página Docs (plantilla v2) se dibuja con su encabezado, sus secciones y la referencia de código */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Button' })).toBeInTheDocument();
    // Pestañas del encabezado: Definición, Aplicación y Desarrollo; cada una muestra su panel
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Button en Figma:']);
    await expect(canvas.getByRole('group', { name: 'Modo de color' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Desarrollo', 'Ejemplos de uso']);
    // Sin Storybook no hay lienzo ni código: la tabla de props queda de solo lectura con los valores por defecto
    const props = canvas.getByRole('table', { name: 'Props de Button' });
    await expect(within(props).getByRole('rowheader', { name: /variant/ })).toBeInTheDocument();
    await expect(canvas.getByRole('switch', { name: 'unicolor' })).toBeDisabled();
    await expect(canvas.queryByRole('button', { name: 'Restablecer' })).not.toBeInTheDocument();
  },
};
