import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Snackbar } from './Snackbar';
import type { ToastType } from './Toast.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { formatLiteral } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Snackbar.doc';
import docsJson from './Snackbar.docs.json';

const TYPE_OPTIONS: ToastType[] = ['success', 'alert', 'error', 'info'];

/**
 * Código de la sección Desarrollo: el aviso se usa de forma imperativa (`add` de `useToastQueue` con
 * `kind: 'snackbar'` dentro de un `Toaster`), así que el ejemplo es esa llamada con los args que cambian; el lienzo
 * muestra el aviso suelto. `open` y `onExited` los maneja la cola. El generado omite las funciones, así que cada
 * acción lleva un manejador genérico (`() => run()`) para que el código se pueda copiar.
 */
function docsCode({ open: _open, onExited: _onExited, ...args }: Record<string, unknown>): string {
  const props = Object.fromEntries(Object.entries(args).filter(([, value]) => typeof value !== 'function'));
  const literal = formatLiteral({ kind: 'snackbar', ...props }).replace(/onClick: \(\) => \{\}/g, 'onClick: () => run()');
  return [
    'const { items, add } = useToastQueue();',
    '',
    'function onArchive() {',
    `  add(${literal.replace(/\n/g, '\n  ')});`,
    '}',
    '',
    '<Toaster>',
    '  {items.map((item) => <Snackbar key={item.id} {...item.props} />)}',
    '</Toaster>',
  ].join('\n');
}

const meta = {
  title: 'Feedback/Snackbar',
  component: Snackbar,
  parameters: { layout: 'padded', docs: componentDocsParameters(doc, docsJson), docsLive: { code: docsCode, exclude: ['open', 'onExited'] } },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    type: { control: 'radio', options: TYPE_OPTIONS, type: { name: 'enum', value: TYPE_OPTIONS } },
    title: { control: 'text', type: { name: 'string' } },
    description: { control: 'text', type: { name: 'string' } },
    role: { control: 'radio', options: ['status', 'alert'], type: { name: 'enum', value: ['status', 'alert'] } },
    duration: { control: 'number', type: { name: 'number' } },
    closeOnAction: { control: 'boolean', type: { name: 'boolean' } },
    label: { control: 'text', type: { name: 'string' } },
  }),
  args: {
    type: 'success',
    title: 'Archivo movido',
    description: 'Ahora está en Documentos.',
    action: { label: 'Deshacer', onClick: fn() },
    secondaryAction: { label: 'Ver carpeta', onClick: fn() },
    onClose: fn(),
  },
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

const TYPES: { type: ToastType; figma: string }[] = [
  { type: 'success', figma: 'Success' },
  { type: 'alert', figma: 'Alert' },
  { type: 'error', figma: 'Error' },
  { type: 'info', figma: 'Info' },
];

/** Las 4 variantes de Figma (Type), con las dos acciones. Unicolor: no cambian con el tema. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-start gap-6 bg-ds-background-general-black p-6">
      {TYPES.map((t) => (
        <Snackbar
          key={t.type}
          type={t.type}
          title="Subheading"
          description="Description"
          action={{ label: 'Button' }}
          secondaryAction={{ label: 'Button' }}
          data-figma={`Type=${t.figma}`}
        />
      ))}
    </div>
  ),
};

/** Sin segunda acción (Button 2=false) ni descripción. */
export const Partial: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Snackbar type="success" title="Enviado" action={{ label: 'Deshacer' }} />
      <Snackbar type="alert" title="Solo texto" description="Sin acciones." />
    </div>
  ),
};

/** Test: rol, acciones por teclado, cierre tras la acción y Escape */
export const A11yTest: Story = {
  tags: ['!autodocs'],
  args: { type: 'error', title: 'Fallo', description: 'Sin conexión', action: { label: 'Reintentar', onClick: fn() }, secondaryAction: undefined, onClose: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Error: FalloSin conexión');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Reintentar' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect((args.action as { onClick: () => void }).onClick).toHaveBeenCalled();
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    await expect(args.onClose).toHaveBeenCalledTimes(2);
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Snackbar' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Snackbar en Figma:']);
    // Anatomía: un marcador por pauta en cada lienzo (6 + 4), con las vistas como ilustraciones (inert)
    const views = canvasElement.querySelectorAll('[data-doc-anatomy-view="marks"]');
    await expect(views).toHaveLength(2);
    for (const view of views) await expect(view).toHaveAttribute('inert');
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(10));
    // Tokens: el aviso fuerza el modo oscuro, así que todas sus entradas tienen modo fijo
    await expect(canvas.getByRole('switch', { name: 'Modo oscuro' })).toBeInTheDocument();
    await expect(canvasElement.querySelector('[data-doc-token-mode="dark"]')).not.toBeNull();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática) se llega a Desarrollo
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Snackbar' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
