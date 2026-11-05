import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NotificationGroupItem } from './NotificationGroupItem';
import { FIGMA_LOREM } from '../NotificationItem/NotificationItem.shared';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './NotificationGroupItem.doc';
import docsJson from './NotificationGroupItem.docs.json';

/** Código de Desarrollo: la fila interactiva del lienzo (botón con `onClick`), lista para copiar. */
function docsCode(args: Record<string, unknown>) {
  const props = Object.entries(args).map(([name, value]) =>
    value === true ? `    ${name}` : `    ${name}=${typeof value === 'string' ? `"${value.replace(/"/g, '&quot;')}"` : `{${String(value)}}`}`
  );
  return ['const abrir = () => {};', '', '<ul role="list">', '  <NotificationGroupItem', ...props, '    onClick={abrir}', '  />', '</ul>'].join('\n');
}

const meta = {
  title: 'Data Display/NotificationGroupItem',
  component: NotificationGroupItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: componentDocsParameters(doc, docsJson),
    docsLive: { story: 'Interactive', code: docsCode, exclude: ['href', 'rootProps', 'contentProps', 'onDelete', 'revealed', 'defaultRevealed', 'onRevealedChange'] },
  },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <ul role="list" className="m-0 w-full max-w-[316px] list-none p-0">
          <Story />
        </ul>
      ),
  ],
  argTypes: {
    ...argTypesFromDocsJson(docsJson),
    description: { control: 'text', type: { name: 'string' }, description: 'Prop Description de Figma' },
    time: { control: 'text', type: { name: 'string' }, description: 'Prop Time de Figma' },
    unread: { control: 'boolean', type: { name: 'boolean' }, description: 'State=Unread de Figma' },
    revealed: { control: 'boolean', type: { name: 'boolean' }, description: 'Type=Eliminate de Figma' },
  },
  args: {
    description: 'Se actualizó la imagen de perfil.',
    time: 'Hace 22 min',
    unread: true,
  },
} satisfies Meta<typeof NotificationGroupItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. Normalmente va dentro de un `NotificationGroup`. */
export const Interactive: Story = { args: { onClick: fn() } };

/** Leída: sin punto y con la descripción en peso regular. */
export const Read: Story = { args: { unread: false } };

const FIGMA = [
  { name: 'Type=Default, State=Unread', unread: true, eliminate: false },
  { name: 'Type=Default, State=Read', unread: false, eliminate: false },
  { name: 'Type=Eliminate, State=Unread', unread: true, eliminate: true },
  { name: 'Type=Eliminate, State=Read', unread: false, eliminate: true },
];

/** Las cuatro variantes de Figma (316 de ancho, 318 con el botón eliminar). */
export const FigmaMatrix: Story = {
  parameters: { bare: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <ul role="list" className="m-0 flex list-none flex-col gap-6 p-0">
        {FIGMA.map((v) => (
          <NotificationGroupItem
            key={v.name}
            className={v.eliminate ? 'w-[318px]' : 'w-[316px]'}
            rootProps={{ 'data-figma': v.name }}
            time="Hace 22m"
            description={FIGMA_LOREM}
            unread={v.unread}
            onDelete={v.eliminate ? () => {} : undefined}
            revealed={v.eliminate ? true : undefined}
          />
        ))}
      </ul>
    </div>
  ),
};

/** Test: el control es la descripción y la hora y "No leída" son su descripción accesible. */
export const RoleTest: Story = {
  tags: ['!autodocs'],
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('button', { name: 'Se actualizó la imagen de perfil.' });
    await expect(control).toHaveAccessibleDescription('Hace 22 min No leída');
    await userEvent.click(control);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Página de documentación v2 para revisar la estructura y la pestaña Desarrollo. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', bare: true },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'NotificationGroupItem' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((tab) => tab.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const headings = () => canvas.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    await expect(headings()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente NotificationGroupItem en Figma:']);
    await userEvent.click(tabs[1]);
    await expect(headings()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    await userEvent.click(tabs[2]);
    await expect(headings()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
  },
};
