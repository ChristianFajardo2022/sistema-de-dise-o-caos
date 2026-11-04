import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Toast } from './Toast';
import { Snackbar } from './Snackbar';
import { Toaster } from './Toaster';
import { useToastQueue } from './useToastQueue';
import type { ToastType } from './Toast.types';
import { Button } from '../Button';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { formatLiteral } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Toast.doc';
import docsJson from './Toast.docs.json';

const TYPE_OPTIONS: ToastType[] = ['success', 'alert', 'error', 'info'];

/**
 * Código de la sección Desarrollo: el aviso se usa de forma imperativa (`add` de `useToastQueue` dentro de un
 * `Toaster`), así que el ejemplo es esa llamada (dentro de un manejador) con los args que cambian; el lienzo muestra el aviso suelto.
 * `open` y `onExited` los maneja la cola.
 */
function docsCode({ open: _open, onExited: _onExited, ...args }: Record<string, unknown>): string {
  return [
    'const { items, add } = useToastQueue();',
    '',
    'function onSave() {',
    '  add(' + formatLiteral(args) + ');',
    '}',
    '',
    '<Toaster>',
    '  {items.map((item) => <Toast key={item.id} {...item.props} />)}',
    '</Toaster>',
  ].join('\n');
}

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  parameters: { layout: 'padded', docs: componentDocsParameters(doc, docsJson), docsLive: { code: docsCode, exclude: ['open', 'onExited'] } },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    type: { control: 'radio', options: TYPE_OPTIONS, type: { name: 'enum', value: TYPE_OPTIONS } },
    title: { control: 'text', type: { name: 'string' } },
    description: { control: 'text', type: { name: 'string' } },
    role: { control: 'radio', options: ['status', 'alert'], type: { name: 'enum', value: ['status', 'alert'] } },
    duration: { control: 'number', type: { name: 'number' } },
    closeLabel: { control: 'text', type: { name: 'string' } },
    label: { control: 'text', type: { name: 'string' } },
  }),
  args: { type: 'success', title: 'Cambios guardados', description: 'Tu perfil se actualizó correctamente.', onClose: fn() },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const onCloseSpy = fn();

export const Interactive: Story = {};

const TYPES: { type: ToastType; figma: string }[] = [
  { type: 'success', figma: 'Success' },
  { type: 'alert', figma: 'Alert' },
  { type: 'error', figma: 'Error' },
  { type: 'info', figma: 'Info' },
];

/** Las 4 variantes de Figma (Type). Son unicolor: no cambian con el tema, por eso se funden con la superficie oscura. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-wrap items-start gap-6 bg-ds-background-general-black p-6">
      {TYPES.map((t) => (
        <Toast
          key={t.type}
          type={t.type}
          title="Subheading"
          description="Description"
          onClose={() => {}}
          data-figma={`Type=${t.figma}`}
        />
      ))}
    </div>
  ),
};

/** Sin descripción (Description=false de Figma) y sin botón de cierre. */
export const Partial: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toast type="info" title="Solo título" onClose={() => {}} />
      <Toast type="alert" title="Sin botón de cierre" description="Se cierra con duration o desde fuera." />
    </div>
  ),
};

function ToasterDemo() {
  const [items, setItems] = useState<{ id: number; type: ToastType }[]>([]);
  const add = (type: ToastType) => setItems((l) => [...l, { id: Date.now() + l.length, type }]);
  return (
    <div className="relative h-96 w-full bg-ds-background-general-black p-6">
      <div className="flex gap-2">
        <Button variant="secondary" size="xs" onClick={() => add('success')}>Éxito</Button>
        <Button variant="secondary" size="xs" onClick={() => add('error')}>Error</Button>
      </div>
      <Toaster position="absolute" placement="bottom-end">
        {items.map((i) => (
          <Toast
            key={i.id}
            type={i.type}
            title={i.type === 'error' ? 'No se pudo guardar' : 'Guardado'}
            description="Detalle del aviso."
            duration={i.type === 'error' ? undefined : 6000}
            onClose={() => setItems((l) => l.filter((x) => x.id !== i.id))}
          />
        ))}
      </Toaster>
    </div>
  );
}

/** Región que apila avisos: cada uno con su región viva, sin robar el foco. */
export const WithToaster: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <ToasterDemo />,
};

/** Test: roles, nombre del cierre, Escape y cierre por teclado */
export const A11yTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <Toast type="success" title="Listo" data-testid="t-status" onClose={onCloseSpy} />
      <Toast type="error" title="Fallo" description="Sin conexión" data-testid="t-alert" onClose={onCloseSpy} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    onCloseSpy.mockClear();
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('t-status')).toHaveAttribute('role', 'status');
    await expect(canvas.getByTestId('t-alert')).toHaveAttribute('role', 'alert');
    await expect(canvas.getByTestId('t-alert')).toHaveTextContent('Error: FalloSin conexión');
    const closes = canvas.getAllByRole('button', { name: 'Cerrar notificación' });
    await userEvent.tab();
    await expect(closes[0]).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{Escape}');
    await expect(onCloseSpy).toHaveBeenCalledTimes(2);
  },
};

function QueueDemo() {
  const { items, add, remove, clear } = useToastQueue({ limit: 3 });
  const n = useRef(0);
  return (
    <div className="relative h-96 w-full bg-ds-background-general-black p-6">
      <div className="flex gap-2">
        <Button variant="secondary" size="xs" onClick={() => add({ type: 'success', title: `Aviso ${++n.current}`, description: 'Se cierra solo.', duration: 5000 })}>
          Agregar toast
        </Button>
        <Button variant="secondary" size="xs" onClick={() => add({ kind: 'snackbar', type: 'info', title: `Snackbar ${++n.current}`, action: { label: 'Deshacer' } })}>
          Agregar snackbar
        </Button>
        <Button variant="tertiary" size="xs" onClick={() => items[0] && remove(items[0].id)}>
          Quitar el primero
        </Button>
        <Button variant="tertiary" size="xs" onClick={clear}>
          Quitar todos
        </Button>
      </div>
      <Toaster position="absolute" placement="bottom-end">
        {items.map((i) => (i.kind === 'snackbar' ? <Snackbar key={i.id} {...i.props} /> : <Toast key={i.id} {...i.props} />))}
      </Toaster>
    </div>
  );
}

/** `useToastQueue`: agregar, quitar y límite de 3 visibles. Cada aviso sale con `animate-caos-toast-out` y se desmonta al terminar. */
export const WithQueue: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <QueueDemo />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const add = c.getByRole('button', { name: 'Agregar toast' });
    for (let i = 0; i < 4; i += 1) await userEvent.click(add);
    // Al cuarto, el más antiguo empieza a salir (data-state="closed") y luego se desmonta
    await expect(canvasElement.querySelectorAll('[data-state="open"]')).toHaveLength(3);
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-state]')).toHaveLength(3), { timeout: 2000 });
    await userEvent.click(c.getByRole('button', { name: 'Quitar todos' }));
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-state]')).toHaveLength(0), { timeout: 2000 });
  },
};

const onExitedSpy = fn();

/** Test: `open={false}` marca `data-state="closed"` y llama a `onExited` una sola vez al terminar la salida. */
export const ExitTest: Story = {
  tags: ['!autodocs'],
  render: () => <Toast type="info" title="Saliendo" open={false} onExited={onExitedSpy} data-testid="t-exit" />,
  play: async ({ canvasElement }) => {
    onExitedSpy.mockClear();
    await expect(within(canvasElement).getByTestId('t-exit')).toHaveAttribute('data-state', 'closed');
    await waitFor(() => expect(onExitedSpy).toHaveBeenCalledTimes(1), { timeout: 2000 });
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Toast' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Toast en Figma:']);
    // Anatomía: un marcador por pauta en cada lienzo (5 + 4), con las vistas como ilustraciones (inert)
    const views = canvasElement.querySelectorAll('[data-doc-anatomy-view="marks"]');
    await expect(views).toHaveLength(2);
    for (const view of views) await expect(view).toHaveAttribute('inert');
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(9));
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
    const props = canvas.getByRole('table', { name: 'Props de Toast' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
