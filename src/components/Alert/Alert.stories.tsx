import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Alert } from './Alert';
import type { AlertType } from './Alert.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Alert.doc';
import docsJson from './Alert.docs.json';

const TYPE_OPTIONS: AlertType[] = ['success', 'alert', 'error', 'info'];

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: { layout: 'padded', docs: componentDocsParameters(doc, docsJson) },
  tags: ['autodocs'],
  // El Alert ocupa el ancho de su contenedor; aquí se muestra al ancho de Figma (344)
  decorators: [(Story, { parameters }) => (parameters.sinMarco ? <Story /> : <div className="w-86 max-w-full"><Story /></div>)],
  argTypes: argTypesFromDocsJson(docsJson, {
    type: {
      name: 'type',
      control: 'radio',
      options: TYPE_OPTIONS,
      type: { name: 'enum', value: TYPE_OPTIONS },
    },
    background: { control: 'boolean', type: { name: 'boolean' } },
    title: { control: 'text', type: { name: 'string' } },
    children: { control: 'text', type: { name: 'string' } },
    role: {
      control: 'radio',
      options: ['status', 'alert'],
      type: { name: 'enum', value: ['status', 'alert'] },
    },
    label: { control: 'text', type: { name: 'string' } },
  }),
  args: {
    type: 'success',
    background: true,
    title: 'Cambios guardados',
    children: 'Tu perfil se actualizó correctamente.',
    role: 'status',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

/** Error que aparece tras enviar un formulario: role="alert" interrumpe al lector. */
export const DynamicError: Story = {
  args: { type: 'error', title: 'No se pudo enviar', children: 'Revisa los campos marcados e inténtalo de nuevo.', role: 'alert' },
};

const TYPES: { type: AlertType; figma: string }[] = [
  { type: 'success', figma: 'Success' },
  { type: 'alert', figma: 'Alert' },
  { type: 'error', figma: 'Error' },
  { type: 'info', figma: 'Info' },
];

/** Las 8 variantes de Figma (Type × Background), con título y descripción visibles. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded', sinMarco: true },
  render: () => (
    <div className="flex flex-col gap-4 bg-ds-background-general-black p-6">
      {TYPES.map((t) => (
        <div key={t.type} className="flex items-start gap-x-8">
          <span className="w-16 shrink-0 text-xs text-ds-text-neutral-body">{t.type}</span>
          {/* Con fondo y sin fondo en la misma columna: si no caben lado a lado, la segunda baja alineada con la primera */}
          <div className="flex min-w-0 flex-1 flex-wrap items-start gap-x-8 gap-y-4">
            {[true, false].map((bg) => (
              <Alert
                key={String(bg)}
                type={t.type}
                background={bg}
                className="w-86 max-w-full shrink-0"
                title="Subheading"
                data-figma={`Type=${t.figma}, Background=${bg ? 'True' : 'False'}`}
              >
                Description
              </Alert>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Título y descripción opcionales (los booleanos Tittle y Description de Figma se resuelven por presencia: sin `title` o sin `children` no se dibuja). */
export const Partial: Story = {
  render: () => (
    <div className="flex w-86 max-w-full flex-col gap-4">
      <Alert type="info" title="Solo título" />
      <Alert type="alert">Solo descripción</Alert>
    </div>
  ),
};

/** Test: rol por defecto, rol alert, nombre accesible con el tipo */
export const RoleTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div>
      <Alert type="success" title="Listo" data-testid="a-status">Guardado</Alert>
      <Alert type="error" role="alert" title="Fallo" data-testid="a-alert">Sin conexión</Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('a-status')).toHaveAttribute('role', 'status');
    await expect(canvas.getByTestId('a-status')).toHaveTextContent('Éxito: ListoGuardado');
    await expect(canvas.getByTestId('a-alert')).toHaveAttribute('role', 'alert');
    await expect(canvas.getByRole('alert')).toHaveTextContent('Error: FalloSin conexión');
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen', sinMarco: true },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Alert' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Alert en Figma:']);
    // Marcadores de la anatomía: uno por pauta (4 + 3)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(7);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Alert' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
