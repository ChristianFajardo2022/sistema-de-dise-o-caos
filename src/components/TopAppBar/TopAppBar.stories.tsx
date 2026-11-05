import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './TopAppBar.doc';
import docsJson from './TopAppBar.docs.json';
import { TopAppBar } from './TopAppBar';
import type { TopAppBarPlatform, TopAppBarProps } from './TopAppBar.types';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Icon } from '../Icon';
import type { IconName } from '../Icon/Icon.types';

/** Botón de acción de la derecha: círculo blanco de 44 en Ios, botón de 48 sin relleno en Android */
function Action({ platform, icon, label, onClick }: { platform: TopAppBarPlatform; icon: IconName; label: string; onClick?: () => void }) {
  return platform === 'ios' ? (
    <Button variant="primary" iconOnly touchTarget aria-label={label} onClick={onClick}>
      <Icon name={icon} variant="fill" size={20} data-figma-part="Icon-sizes" />
    </Button>
  ) : (
    <Button variant="tertiary" size="sm" iconOnly aria-label={label} onClick={onClick}>
      <Icon name={icon} variant="fill" size={24} data-figma-part="Icon-sizes" />
    </Button>
  );
}

/** Icono y nombre de la acción de ejemplo de cada plataforma (el lienzo de Desarrollo y su código). */
const ACTION = { ios: { icon: 'add-2', label: 'Agregar', size: 20 }, android: { icon: 'search', label: 'Buscar', size: 24 } } as const;

/** Valores por defecto de las props con lista: el código de Personalizar omite lo que vale lo mismo. */
const DEFAULTS: Record<string, string | number> = { platform: 'ios', titlePosition: 'centered', headingLevel: 1, backLabel: 'Volver' };

/** Lienzo de Desarrollo: la barra con su botón de volver y la acción de su plataforma, al ancho disponible (hasta 1440) y nunca menos de 320, el ancho de una pantalla móvil: el lienzo la reduce si no cabe. */
function DocsCanvas(args: Record<string, unknown>) {
  const { platform = 'ios', onBack: _onBack, ...rest } = args as Partial<TopAppBarProps>;
  return (
    <div className="grid w-full" style={{ gridTemplateColumns: 'minmax(320px, 1440px)' }}>
      <TopAppBar {...rest} platform={platform} onBack={() => {}} actions={<Action platform={platform} icon={ACTION[platform].icon} label={ACTION[platform].label} />} />
    </div>
  );
}

/** Código de Personalizar: la barra con sus manejadores declarados arriba, para copiarlo y que compile. */
function docsCode(args: Record<string, unknown>): string {
  const platform = (args.platform as TopAppBarPlatform | undefined) ?? 'ios';
  const { icon, label, size } = ACTION[platform];
  const props: string[] = [];
  for (const name of ['platform', 'titlePosition', 'title', 'subtitle', 'headingLevel', 'backLabel']) {
    const value = args[name];
    if (value === undefined || value === '' || String(DEFAULTS[name]) === String(value)) continue;
    if (name === 'subtitle' && args.titlePosition === 'title-only') continue;
    props.push(typeof value === 'number' ? `${name}={${value}}` : `${name}=${String(value).includes('"') ? `{${JSON.stringify(value)}}` : `"${value}"`}`);
  }
  props.push('onBack={goBack}');
  const button =
    platform === 'ios'
      ? `<Button variant="primary" iconOnly touchTarget aria-label="${label}">`
      : `<Button variant="tertiary" size="sm" iconOnly aria-label="${label}">`;
  props.push(`actions={\n    ${button}\n      <Icon name="${icon}" variant="fill" size={${size}} />\n    </Button>\n  }`);
  return `const goBack = () => {};\n\n<TopAppBar\n${props.map((p) => `  ${p}`).join('\n')}\n/>`;
}

const meta = {
  title: 'Navigation/Tittle header/Top App Bar',
  component: TopAppBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: componentDocsParameters(doc, docsJson),
    // Lienzo de Desarrollo: la barra interactiva de la historia Interactive con su código copiable (receta R11)
    docsLive: { story: 'Interactive', render: (args: Record<string, unknown>) => <DocsCanvas {...args} />, code: docsCode },
    // Varias barras en la misma página de documentación: el landmark banner se repite solo allí
    a11y: { config: { rules: [{ id: 'landmark-no-duplicate-banner', enabled: false }, { id: 'landmark-unique', enabled: false }] } },
  },
  argTypes: argTypesFromDocsJson(docsJson, {
    platform: {
      control: 'radio',
      options: ['ios', 'android'],
      type: { name: 'enum', value: ['ios', 'android'] },
    },
    titlePosition: {
      control: 'radio',
      options: ['centered', 'left', 'action-only', 'title-only'],
      type: { name: 'enum', value: ['centered', 'left', 'action-only', 'title-only'] },
    },
    title: { control: 'text', type: { name: 'string' } },
    subtitle: { control: 'text', type: { name: 'string' } },
    headingLevel: {
      control: 'radio',
      options: [1, 2, 3, 4, 5, 6],
      type: { name: 'enum', value: [1, 2, 3, 4, 5, 6] },
    },
    backLabel: { control: 'text', type: { name: 'string' } },
  }),
  args: { title: 'Documentos', subtitle: 'Carpeta compartida', platform: 'ios', titlePosition: 'centered', headingLevel: 1 },
  decorators: [
    (Story) => (
      <div className="bg-ds-background-general-black text-ds-text-neutral-heading">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TopAppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: { onBack: fn() },
  render: (args) => {
    const platform = args.platform ?? 'ios';
    return <TopAppBar {...args} actions={<Action platform={platform} icon={ACTION[platform].icon} label={ACTION[platform].label} />} />;
  },
};

/** Teclado y nombres accesibles: el título es un heading y los botones solo con ícono tienen nombre. */
export const KeyboardAndNames: Story = {
  tags: ['!autodocs'],
  args: { onBack: fn() },
  render: (args) => <TopAppBar {...args} actions={<Action platform="ios" icon="add-2" label="Agregar" />} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('banner')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 1, name: 'Documentos' })).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Volver' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onBack).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Agregar' })).toHaveFocus();
  },
};

export const AndroidWithAvatar: Story = {
  args: { platform: 'android', titlePosition: 'left', onBack: fn() },
  render: (args) => (
    <TopAppBar
      {...args}
      avatar={<Avatar variant="initials" size="md" name="Ana Pérez" />}
      actions={<Action platform="android" icon="search" label="Buscar" />}
    />
  ),
};

const LABEL = 'font-ds-primitives-typography-family-primary text-ds-typography-body-size-sm text-ds-text-neutral-body';

/**
 * Cada variante de Figma una vez (Type × Position). El Centered Title de Android no trae título en Figma
 * (solo el menú y la búsqueda), por eso aquí también va sin título.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const Row = ({ name, children }: { name: string; children: ReactNode }) => (
      <div className="flex flex-col gap-ds-space-general-md">
        <span className={LABEL}>{name}</span>
        <div className="max-w-full overflow-x-auto"><div className="w-[1440px]">{children}</div></div>
      </div>
    );
    const menu = (
      <Button variant="tertiary" size="sm" iconOnly aria-label="Menú">
        <Icon name="menu" variant="fill" size={24} data-figma-part="Icon-sizes" />
      </Button>
    );
    return (
      <div className="flex flex-col gap-ds-space-general-2xl bg-ds-background-general-black p-6">
        <Row name="Type=Ios, Position=Centered Title">
          <TopAppBar data-figma="Type=Ios, Position=Centered Title" platform="ios" titlePosition="centered" title="Title" subtitle="Subtitle" onBack={() => {}} actions={<Action platform="ios" icon="add-2" label="Agregar" />} />
        </Row>
        <Row name="Type=Android, Position=Centered Title">
          <TopAppBar data-figma="Type=Android, Position=Centered Title" platform="android" titlePosition="centered" leading={menu} actions={<Action platform="android" icon="search" label="Buscar" />} />
        </Row>
        <Row name="Type=Ios, Position=Left-Aligned">
          <TopAppBar data-figma="Type=Ios, Position=Left-Aligned" platform="ios" titlePosition="left" title="Title" subtitle="Subtitle" onBack={() => {}} actions={<Action platform="ios" icon="add-2" label="Agregar" />} />
        </Row>
        <Row name="Type=Android, Position=Left-Aligned">
          <TopAppBar data-figma="Type=Android, Position=Left-Aligned" platform="android" titlePosition="left" title="Title" subtitle="Subtitle" leading={menu} actions={<Action platform="android" icon="search" label="Buscar" />} />
        </Row>
        <Row name="Type=Ios, Position=With Action Only">
          <TopAppBar data-figma="Type=Ios, Position=With Action Only" platform="ios" titlePosition="action-only" title="Title" subtitle="Subtitle" onBack={() => {}} actions={<Action platform="ios" icon="add-2" label="Agregar" />} />
        </Row>
        <Row name="Type=Android, Position=With Action Only">
          <TopAppBar data-figma="Type=Android, Position=With Action Only" platform="android" titlePosition="action-only" title="Title" subtitle="Subtitle" onBack={() => {}} actions={<Action platform="android" icon="search" label="Buscar" />} />
        </Row>
        <Row name="Type=Ios, Position=Title Only">
          <TopAppBar data-figma="Type=Ios, Position=Title Only" platform="ios" titlePosition="title-only" title="Title" actions={<Action platform="ios" icon="add-2" label="Agregar" />} />
        </Row>
        <Row name="Type=Android, Position=Title Only">
          <TopAppBar
            data-figma="Type=Android, Position=Title Only"
            platform="android"
            titlePosition="title-only"
            title="Title"
            onBack={() => {}}
            actions={
              <>
                <Action platform="android" icon="attach-circle" label="Adjuntar" />
                <Action platform="android" icon="calendar" label="Calendario" />
                <Action platform="android" icon="3-dots-more" label="Más opciones" />
              </>
            }
          />
        </Row>
      </div>
    );
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Top App Bar' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Top App Bar en Figma:']);
    // Marcadores: uno por pauta en cada lienzo de la anatomía (5 + 6 + 5)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]').length).toBe(16);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de TopAppBar' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
