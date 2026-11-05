import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NotificationItem } from './NotificationItem';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './NotificationItem.doc';
import docsJson from './NotificationItem.docs.json';

/** Código de Desarrollo: la misma fila del lienzo (un botón con `onClick`), dentro de su lista, lista para copiar. */
function docsCode(args: Record<string, unknown>) {
  const text = (value: unknown) => (/["{}\\]/.test(String(value)) ? `{${JSON.stringify(String(value))}}` : `"${String(value)}"`);
  const props = [
    ...(args.title !== undefined ? [`title=${text(args.title)}`] : []),
    ...(args.description ? [`description=${text(args.description)}`] : []),
    ...(args.unread === true ? ['unread'] : []),
    ...(args.unreadLabel ? [`unreadLabel=${text(args.unreadLabel)}`] : []),
    'onClick={openNotification}',
  ];
  return [
    'const openNotification = () => {};',
    '',
    '<ul role="list">',
    '  <NotificationItem',
    ...props.map((line) => `    ${line}`),
    '  />',
    '</ul>',
  ].join('\n');
}

const meta = {
  title: 'Data Display/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: componentDocsParameters(doc, docsJson),
    docsLive: { story: 'Interactive', code: docsCode, exclude: ['href', 'type', 'rootProps', 'className'] },
  },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <ul role="list" className="m-0 w-full max-w-[333px] list-none p-0">
          <Story />
        </ul>
      ),
  ],
  argTypes: {
    ...argTypesFromDocsJson(docsJson),
    title: { control: 'text', type: { name: 'string' } },
    description: { control: 'text', type: { name: 'string' } },
    unread: { control: 'boolean', type: { name: 'boolean' } },
    unreadLabel: { control: 'text', type: { name: 'string' } },
    href: { control: 'text', type: { name: 'string' } },
  },
  args: {
    title: 'Documento compartido',
    description: 'Ana Pérez compartió Informe anual contigo.',
    unread: true,
  },
} satisfies Meta<typeof NotificationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground. Con `onClick` el título pasa a ser un botón estirado sobre la fila. */
export const Interactive: Story = {
  args: { onClick: fn() },
};

/** Leída (Type=Default) y no leída (Type=Active), una junto a la otra. */
export const ReadAndUnread: Story = {
  render: () => (
    <>
      <NotificationItem title="Comentario nuevo" description="Hugo García respondió tu comentario." unread />
      <NotificationItem title="Reunión actualizada" description="El equipo cambió la sala del jueves." />
    </>
  ),
};

/** Solo informativa (sin `href` ni `onClick`): el título es un párrafo, sin control. */
export const Informative: Story = {
  args: { unread: false },
};

/** Con `href` el título es un enlace. */
export const AsLink: Story = {
  args: { href: '#detalle' },
};

const FIGMA = [
  { name: 'Type=Default', unread: false },
  { name: 'Type=Active', unread: true },
];

/** Las dos variantes de Figma (333 de ancho) con los textos de Figma. */
export const FigmaMatrix: Story = {
  parameters: { bare: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <ul role="list" className="m-0 flex w-[333px] list-none flex-col gap-6 p-0">
        {FIGMA.map((v) => (
          <NotificationItem
            key={v.name}
            rootProps={{ 'data-figma': v.name }}
            title="Text notification"
            description="Text description"
            unread={v.unread}
          />
        ))}
      </ul>
    </div>
  ),
};

/** Test: nombre accesible del control, "No leída" en la descripción y el clic. */
export const RoleTest: Story = {
  tags: ['!autodocs'],
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole('button', { name: 'Documento compartido' });
    await expect(control).toHaveAccessibleDescription('No leída Ana Pérez compartió Informe anual contigo.');
    await userEvent.click(control);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.tab();
    await expect(control).not.toHaveFocus();
  },
};

/** Test: sin acción la fila no es un control y el punto de no leída se anuncia. */
export const InformativeTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <>
      <NotificationItem title="Aviso" description="Mantenimiento programado." unread />
      <NotificationItem title="Resumen" description="Tienes 3 tareas." />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument();
    const items = canvas.getAllByRole('listitem');
    await expect(items).toHaveLength(2);
    await expect(items[0]).toHaveTextContent('No leída');
    await expect(items[1]).not.toHaveTextContent('No leída');
  },
};

/** Página de documentación (plantilla v2) para vitest y axe. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', bare: true },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'NotificationItem' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((tab) => tab.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const headings = () => canvas.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    await expect(headings()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente NotificationItem en Figma:']);
    await expect(canvasElement.querySelectorAll('[data-doc-mark]').length).toBe(8);
    await userEvent.click(tabs[1]);
    await expect(headings()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de NotificationItem' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
