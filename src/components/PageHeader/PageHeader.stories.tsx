import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { PageHeader } from './PageHeader';
import { Breadcrumb, BreadcrumbItem } from '../Breadcrumb';
import { Button } from '../Button';

const DESCRIPTION =
  'Lorem ipsum dolor sit amet consectetur. Adipiscing egestas pellentesque faucibus lectus purus viverra curabitur risus metus. Sit ut donec cras viverra massa purus in egestas. Nibh id purus duis nisl volutpat feugiat. Et lectus amet mi dolor. Magna etiam mauris velit egestas.';

const meta = {
  title: 'Navigation/Tittle header/Page Header',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    title: { control: 'text', type: { name: 'string' }, description: 'Text header de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Text description (prop Description de Figma)' },
    headingLevel: {
      control: 'radio',
      options: [1, 2, 3, 4, 5, 6],
      type: { name: 'enum', value: [1, 2, 3, 4, 5, 6] },
      description: 'Nivel del heading del título',
    },
    backLabel: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible del botón de volver' },
  },
  args: { title: 'Encabezado', description: DESCRIPTION, headingLevel: 1, onBack: fn() },
  decorators: [
    (Story) => (
      <div className="bg-ds-background-general-black p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('banner')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 1, name: 'Encabezado' })).toBeInTheDocument();
    const back = canvas.getByRole('button', { name: 'Volver' });
    back.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onBack).toHaveBeenCalledTimes(1);
  },
  tags: ['!autodocs'],
};

export const WithBreadcrumbAndActions: Story = {
  args: { onBack: undefined },
  render: (args) => (
    <PageHeader
      {...args}
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem href="#inicio" home />
          <BreadcrumbItem current>Cuenta</BreadcrumbItem>
        </Breadcrumb>
      }
      actions={<Button size="sm">Guardar</Button>}
    />
  ),
};

/** Una variante en Figma (Property 1=Default). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="w-[2144px]">
      <PageHeader title="Encabezado" description={DESCRIPTION} onBack={() => {}} data-figma="Property 1=Default" />
    </div>
  ),
};
