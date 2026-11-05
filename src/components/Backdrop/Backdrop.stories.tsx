import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Backdrop } from './Backdrop';
import { Button } from '../Button';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Backdrop.doc';
import docsJson from './Backdrop.docs.json';

const POSITION_OPTIONS = ['fixed', 'absolute'];

/**
 * Lienzo de Desarrollo: un disparador y la capa con su estado. Tocar la capa la cierra (`onClick`) y el botón la abre
 * de nuevo. El recuadro lleva `transform`, que contiene también la capa con `position="fixed"`: no cubre la página.
 */
function DocsCanvas(args: Record<string, unknown>) {
  const [open, setOpen] = useState(true);
  const { position, className } = args as { position?: 'fixed' | 'absolute'; className?: string };
  return (
    <div className="relative isolate h-80 w-full max-w-2xl transform-gpu overflow-hidden rounded-ds-radius-container-on-canva bg-ds-background-general-black p-6 text-ds-text-neutral-body">
      <p className="mb-4">Contenido de la página detrás de la capa.</p>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Mostrar fondo
      </Button>
      <Backdrop open={open} position={position} className={['rounded-[inherit]', className].filter(Boolean).join(' ')} onClick={() => setOpen(false)} />
    </div>
  );
}

/** Código copiable: el estado y el cierre al tocar la capa, con las props que cambian los controles. */
function docsCode(args: Record<string, unknown>): string {
  const props = Object.entries(args).map(([name, value]) => `${name}="${String(value)}"`);
  return [
    'const [open, setOpen] = useState(true);',
    '',
    '<Button onClick={() => setOpen(true)}>Mostrar fondo</Button>',
    `<Backdrop open={open} ${props.join(' ')}${props.length ? ' ' : ''}onClick={() => setOpen(false)} />`,
  ].join('\n');
}

const meta = {
  title: 'Overlays/Backdrop',
  component: Backdrop,
  parameters: {
    layout: 'fullscreen',
    docs: componentDocsParameters(doc, docsJson),
    // El lienzo maneja su estado: `open` y `onClick` los lleva el render y siguen solo en la tabla Props
    docsLive: { render: DocsCanvas, code: docsCode, exclude: ['open', 'onClick'] },
  },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    open: { control: 'boolean', type: { name: 'boolean' } },
    position: {
      control: 'radio',
      options: POSITION_OPTIONS,
      type: { name: 'enum', value: POSITION_OPTIONS },
    },
  }),
  args: { open: true, position: 'absolute' },
} satisfies Meta<typeof Backdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

function Fondo({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-80 overflow-hidden bg-ds-background-general-black p-6 text-ds-text-neutral-body">
      <p>Contenido de la página detrás del backdrop. Se desenfoca y oscurece al abrir un overlay.</p>
      {children}
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => (
    <Fondo>
      <Backdrop {...args} />
    </Fondo>
  ),
};

/** Una sola variante en Figma: Property 1=Predeterminada (1440×1080). */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="w-full max-w-[1440px] bg-ds-background-general-black">
      <div className="relative h-[1080px] w-full p-6 text-ds-text-neutral-body">
        <p>Contenido detrás del backdrop.</p>
        <Backdrop position="absolute" data-figma="Property 1=Predeterminada" />
      </div>
    </div>
  ),
};

export const Closed: Story = {
  args: { open: false },
  render: (args) => (
    <Fondo>
      <Backdrop {...args} data-testid="backdrop" />
    </Fondo>
  ),
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByTestId('backdrop')).toBeNull();
  },
};

function ClickDemo({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(true);
  return (
    <Fondo>
      <Backdrop
        open={open}
        position="absolute"
        data-testid="backdrop"
        onClick={() => {
          onClose();
          setOpen(false);
        }}
      />
    </Fondo>
  );
}

export const CloseOnClick: Story = {
  tags: ['!autodocs'],
  args: { onClick: fn() },
  render: () => {
    const spy = fn();
    return <ClickDemo onClose={spy} />;
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const el = c.getByTestId('backdrop');
    await expect(el).toHaveAttribute('aria-hidden', 'true');
    await userEvent.click(el);
    await expect(c.queryByTestId('backdrop')).toBeNull();
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Backdrop' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Backdrop en Figma:']);
    // Anatomía: un marcador por pauta (2 + 3) y la capa decorativa
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(5));
    await expect(canvasElement.querySelector('[data-figma-part="Backdrop"]')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Backdrop' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
