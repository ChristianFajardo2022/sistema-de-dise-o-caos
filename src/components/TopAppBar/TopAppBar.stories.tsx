import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TopAppBar } from './TopAppBar';
import type { TopAppBarPlatform } from './TopAppBar.types';
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

const meta = {
  title: 'Navigation/Tittle header/Top App Bar',
  component: TopAppBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    // Varias barras en la misma página de documentación: el landmark banner se repite solo allí
    a11y: { config: { rules: [{ id: 'landmark-no-duplicate-banner', enabled: false }, { id: 'landmark-unique', enabled: false }] } },
  },
  argTypes: {
    platform: {
      control: 'radio',
      options: ['ios', 'android'],
      type: { name: 'enum', value: ['ios', 'android'] },
      description: 'Type de Figma: medidas y tipo de botón',
    },
    titlePosition: {
      control: 'radio',
      options: ['centered', 'left', 'action-only', 'title-only'],
      type: { name: 'enum', value: ['centered', 'left', 'action-only', 'title-only'] },
      description: 'Position de Figma',
    },
    title: { control: 'text', type: { name: 'string' }, description: 'Title de Figma' },
    subtitle: { control: 'text', type: { name: 'string' }, description: 'Subtitletext de Figma' },
    headingLevel: {
      control: 'radio',
      options: [1, 2, 3, 4, 5, 6],
      type: { name: 'enum', value: [1, 2, 3, 4, 5, 6] },
    },
    backLabel: { control: 'text', type: { name: 'string' } },
  },
  args: { title: 'Title', subtitle: 'Subtitle', platform: 'ios', titlePosition: 'centered', headingLevel: 1 },
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
  render: (args) => (
    <TopAppBar
      {...args}
      actions={<Action platform={args.platform ?? 'ios'} icon="add-2" label="Agregar" />}
    />
  ),
};

/** Teclado y nombres accesibles: el título es un heading y los botones solo con ícono tienen nombre. */
export const KeyboardAndNames: Story = {
  tags: ['!autodocs'],
  args: { onBack: fn() },
  render: (args) => <TopAppBar {...args} actions={<Action platform="ios" icon="add-2" label="Agregar" />} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('banner')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument();
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
