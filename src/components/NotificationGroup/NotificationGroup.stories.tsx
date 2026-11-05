import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { NotificationGroup } from './NotificationGroup';
import { NotificationGroupItem } from './NotificationGroupItem';
import { NotificationCard } from '../NotificationCard';
import { FIGMA_LOREM } from '../NotificationItem/NotificationItem.shared';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './NotificationGroup.doc';
import docsJson from './NotificationGroup.docs.json';

/** Código de Desarrollo: el mismo grupo del lienzo, con sus filas y desplegado, listo para copiar. */
function docsCode(args: Record<string, unknown>) {
  const { children: _children, defaultExpanded: _defaultExpanded, expanded: _expanded, ...rest } = args;
  const props = Object.entries(rest).map(([name, value]) =>
    value === true ? `  ${name}` : `  ${name}=${typeof value === 'string' ? `"${value.replace(/"/g, '&quot;')}"` : `{${String(value)}}`}`
  );
  return [
    '<ul role="list">',
    '  <NotificationGroup',
    ...props.map((line) => `  ${line}`),
    '    defaultExpanded',
    '  >',
    '    <NotificationGroupItem time="Hace 22 min" description="Se actualizó la imagen de perfil." unread />',
    '    <NotificationGroupItem time="Hace 42 min" description="Se guardaron los ajustes de privacidad." unread />',
    '    <NotificationGroupItem time="Hace 62 min" description="Se añadió una nota de reunión." />',
    '  </NotificationGroup>',
    '</ul>',
  ].join('\n');
}

const meta = {
  title: 'Data Display/NotificationGroup',
  component: NotificationGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: componentDocsParameters(doc, docsJson),
    docsLive: { story: 'Interactive', code: docsCode, exclude: ['children', 'rootProps', 'contentProps', 'expanded', 'defaultExpanded', 'onExpandedChange', 'onDelete', 'revealed', 'defaultRevealed', 'onRevealedChange'] },
  },
  decorators: [
    (Story, { parameters }) =>
      parameters.bare ? (
        <Story />
      ) : (
        <ul role="list" className="m-0 w-full max-w-[351px] list-none p-0">
          <Story />
        </ul>
      ),
  ],
  argTypes: {
    ...argTypesFromDocsJson(docsJson),
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Heading de Figma' },
    time: { control: 'text', type: { name: 'string' }, description: 'Hora relativa de la última notificación' },
    unread: { control: 'boolean', type: { name: 'boolean' }, description: 'State=Unread de Figma' },
    count: { control: { type: 'number', min: 0 }, type: { name: 'number' }, description: 'Cantidad del Badge (por defecto, los hijos)' },
    expanded: { control: 'boolean', type: { name: 'boolean' }, description: 'Type=Dropdown group de Figma (controlado)' },
    revealed: { control: 'boolean', type: { name: 'boolean' }, description: 'Type=Group delete de Figma' },
  },
  args: {
    title: 'Actualizaciones del perfil',
    time: 'Hace 22 min',
    unread: true,
  },
} satisfies Meta<typeof NotificationGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (unread: boolean[]) =>
  unread.map((u, i) => (
    <NotificationGroupItem
      key={i}
      time={`Hace ${22 + i * 20} min`}
      description={['Se actualizó la imagen de perfil.', 'Se guardaron los ajustes de privacidad.', 'Se añadió una nota de reunión.'][i]}
      unread={u}
    />
  ));

/** Playground: recogido muestra la primera; el botón del chevron (o toda la tarjeta) lo despliega. */
export const Interactive: Story = {
  args: { defaultExpanded: true },
  render: (args) => <NotificationGroup {...args}>{items([true, true, false])}</NotificationGroup>,
};

/** Desplegado (Type=Dropdown group). */
export const Expanded: Story = {
  args: { defaultExpanded: true },
  render: (args) => <NotificationGroup {...args}>{items([true, true, false])}</NotificationGroup>,
};

/** Leído (State=Read): sin relleno; recogido lleva trazo inferior. */
export const Read: Story = {
  args: { unread: false },
  render: (args) => <NotificationGroup {...args}>{items([false, false])}</NotificationGroup>,
};

/** Con `onDelete` el botón eliminar quita todo el grupo. */
function DeleteDemo() {
  const [groups, setGroups] = useState(['Notas del equipo', 'Cambios de perfil']);
  return (
    <ul role="list" className="m-0 flex w-[351px] list-none flex-col gap-2 p-0">
      {groups.map((g) => (
        <NotificationGroup
          key={g}
          title={g}
          time="Hace 22 min"
          unread
          onDelete={() => setGroups((all) => all.filter((x) => x !== g))}
        >
          {items([true, false])}
        </NotificationGroup>
      ))}
    </ul>
  );
}
export const Deletable: Story = { parameters: { bare: true }, render: () => <DeleteDemo /> };

const FIGMA: { name: string; kind: 'card' | 'group' | 'dropdown'; unread: boolean; delete: boolean }[] = [
  { name: 'Type=Simple, State=Unread', kind: 'card', unread: true, delete: false },
  { name: 'Type=Simple delete, State=Unread', kind: 'card', unread: true, delete: true },
  { name: 'Type=Simple, State=Read', kind: 'card', unread: false, delete: false },
  { name: 'Type=Simple delete, State=Read', kind: 'card', unread: false, delete: true },
  { name: 'Type=Group, State=Unread', kind: 'group', unread: true, delete: false },
  { name: 'Type=Group delete, State=Unread', kind: 'group', unread: true, delete: true },
  { name: 'Type=Group, State=Read', kind: 'group', unread: false, delete: false },
  { name: 'Type=Group delete, State=Read', kind: 'group', unread: false, delete: true },
  { name: 'Type=Dropdown group, State=Unread', kind: 'dropdown', unread: true, delete: false },
  { name: 'Type=Dropdown group, State=Read', kind: 'dropdown', unread: false, delete: false },
];

const lorem = FIGMA_LOREM;

/**
 * Las diez variantes del set "Group notification" de Figma: Simple y Simple delete son `NotificationCard`; Group,
 * Group delete y Dropdown group son `NotificationGroup` (351 de ancho; el desplegado, 348, mide la tarjeta).
 * Group y Dropdown group llevan filas leídas o no leídas como en Figma (la vista previa, regular).
 */
export const FigmaMatrix: Story = {
  parameters: { bare: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <ul role="list" className="m-0 flex w-[351px] list-none flex-col gap-6 p-0">
        {FIGMA.map((v) =>
          v.kind === 'card' ? (
            <NotificationCard
              key={v.name}
              rootProps={{ 'data-figma': v.name }}
              time="Hace 22m"
              title="Heading"
              description={lorem}
              unread={v.unread}
              onDelete={v.delete ? () => {} : undefined}
              revealed={v.delete ? true : undefined}
            />
          ) : v.kind === 'group' ? (
            <NotificationGroup
              key={v.name}
              rootProps={{ 'data-figma': v.name }}
              time="Hace 22m"
              title="Heading"
              count={2}
              unread={v.unread}
              onDelete={v.delete ? () => {} : undefined}
              revealed={v.delete ? true : undefined}
            >
              <NotificationGroupItem time="Hace 22m" description={lorem} />
              <NotificationGroupItem time="Hace 22m" description={lorem} />
            </NotificationGroup>
          ) : (
            <NotificationGroup
              key={v.name}
              className="w-[348px]"
              contentProps={{ 'data-figma': v.name }}
              time="Hace 22m"
              title="Heading"
              count={2}
              unread={v.unread}
              expanded
            >
              <NotificationGroupItem time="Hace 22m" description={lorem} unread />
              <NotificationGroupItem time="Hace 22m" description={lorem} unread />
              <NotificationGroupItem time="Hace 22m" description={lorem} />
            </NotificationGroup>
          )
        )}
      </ul>
    </div>
  ),
};

/** Test: el botón anuncia aria-expanded y aria-controls, y al desplegar aparecen todas las filas. */
export const DisclosureTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <NotificationGroup title="Notas de reunión" time="Hace 22 min" unread onExpandedChange={fn()}>
      {items([true, true, false])}
    </NotificationGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Mostrar notificaciones Notas de reunión' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAccessibleDescription('Hace 22 min No leído');
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
    await userEvent.click(toggle);
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Ocultar notificaciones Notas de reunión' })).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);
    await expect(toggle).toHaveAttribute('aria-controls', canvas.getAllByRole('list')[1].id);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getAllByRole('listitem')).toHaveLength(2));
  },
};

/** Test: eliminar un grupo mueve el foco al siguiente. */
export const DeleteFocusTest: Story = {
  tags: ['!autodocs'],
  parameters: { bare: true },
  render: () => <DeleteDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Eliminar notificación: Notas del equipo' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Mostrar notificaciones Cambios de perfil' })).toHaveFocus());
  },
};

/** Página de documentación v2 para revisar la estructura y la pestaña Desarrollo. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', bare: true },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'NotificationGroup' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((tab) => tab.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const headings = () => canvas.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    await expect(headings()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente NotificationGroup en Figma:']);
    await userEvent.click(tabs[1]);
    await expect(headings()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    await userEvent.click(tabs[2]);
    await expect(headings()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
  },
};
