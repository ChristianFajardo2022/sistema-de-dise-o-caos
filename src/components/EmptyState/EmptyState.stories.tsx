import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { EmptyState } from './EmptyState';
import type { EmptyStateProps, EmptyStateType } from './EmptyState.types';

const TYPES: EmptyStateType[] = ['first-use', 'no-results', 'errors-issues', 'no-content'];

// Variantes del set de Figma 12304:6287 con su botón y los textos que traen.
const FIGMA: { type: EmptyStateType; figma: string; button?: string }[] = [
  { type: 'first-use', figma: 'Type=First Use', button: 'Crear o agregar' },
  { type: 'no-results', figma: 'Type=No Results', button: 'Limpiar' },
  { type: 'errors-issues', figma: 'Type=Errors & Issues', button: 'Reintentar' },
  { type: 'no-content', figma: 'Type=No Content' },
];

/** Marco de 326 (ancho del componente en Figma) para las historias de un solo mensaje. */
const frame: Decorator = (Story) => (
  <div className="w-[326px] max-w-full bg-ds-background-general-black p-6">
    <Story />
  </div>
);

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: TYPES,
      type: { name: 'enum', value: TYPES },
      description: 'Situación que explica el mensaje; define el ícono',
    },
    title: { control: 'text', type: { name: 'string' }, description: 'Título del mensaje' },
    description: { control: 'text', type: { name: 'string' }, description: 'Texto bajo el título' },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6],
      type: { name: 'enum', value: [2, 3, 4, 5, 6] },
      description: 'Nivel del encabezado del título',
    },
  },
  args: {
    type: 'first-use',
    title: 'Aún no hay proyectos',
    description: 'Crea el primero para empezar a trabajar con tu equipo.',
    headingLevel: 3,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mensaje con sus dos acciones. Cambia el tipo, el título o el texto desde los controles. */
export const Interactive: Story = {
  decorators: [frame],
  render: (args: EmptyStateProps) => (
    <EmptyState
      {...args}
      primaryAction={{ label: 'Crear proyecto', onClick: fn() }}
      secondaryAction={{ label: 'Ver ayuda', onClick: fn() }}
    />
  ),
};

// Figma: set 12304:6287, cada variante una vez con los textos de Figma (ancho 326, modo Desktop).
/** Los cuatro tipos tal como están en el diseño, con sus textos de ejemplo, para compararlos con Figma. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex max-w-full flex-wrap items-start gap-6 bg-ds-background-general-black p-6">
      {FIGMA.map((v) => (
        <div key={v.type} className="flex w-[326px] shrink-0 flex-col gap-2">
          <span className="text-xs text-ds-text-neutral-body">{v.figma}</span>
          <EmptyState
            type={v.type}
            title="Title"
            description="Descripción"
            primaryAction={v.button ? { label: v.button } : undefined}
            secondaryAction={v.button ? { label: v.button } : undefined}
            data-figma={v.figma}
          />
        </div>
      ))}
    </div>
  ),
};

/** Los cuatro tipos con textos reales y la acción que corresponde a cada uno. */
export const Types: Story = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,326px),1fr))] gap-12">
      <EmptyState
        type="first-use"
        title="Aún no hay archivos"
        description="Sube tu primer archivo para verlo aquí."
        primaryAction={{ label: 'Subir archivo' }}
        secondaryAction={{ label: 'Cómo funciona' }}
      />
      <EmptyState
        type="no-results"
        title="Sin resultados"
        description="Prueba con otras palabras o quita algún filtro."
        primaryAction={{ label: 'Limpiar filtros' }}
      />
      <EmptyState
        type="errors-issues"
        title="No pudimos cargar los datos"
        description="Revisa tu conexión e inténtalo de nuevo."
        primaryAction={{ label: 'Reintentar' }}
        secondaryAction={{ label: 'Reportar problema' }}
      />
      <EmptyState type="no-content" title="Nada por aquí" description="Esta sección todavía no tiene contenido." />
    </div>
  ),
};

// ─────────────────────── tests ───────────────────────

export const TestAccessibility: Story = {
  tags: ['!autodocs'],
  decorators: [frame],
  args: { title: 'Sin resultados', description: 'Prueba con otro filtro.', headingLevel: 2 },
  render: (args: EmptyStateProps) => (
    <EmptyState
      {...args}
      primaryAction={{ label: 'Limpiar', onClick: fn() }}
      secondaryAction={{ label: 'Volver', onClick: fn() }}
    />
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('heading', { level: 2, name: 'Sin resultados' })).toBeInTheDocument();
    // La composición de cuadros es decorativa
    await expect(canvasElement.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    // El orden de tabulación sigue el de Figma: secundaria y luego principal
    const [first, second] = c.getAllByRole('button');
    await expect(first).toHaveTextContent('Volver');
    await expect(second).toHaveTextContent('Limpiar');
    await userEvent.tab();
    await expect(first).toHaveFocus();
  },
};

export const TestActions: Story = {
  tags: ['!autodocs'],
  decorators: [frame],
  args: {
    type: 'errors-issues',
    title: 'Error',
    description: 'Algo falló.',
    primaryAction: { label: 'Reintentar', onClick: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    // Sin segunda acción solo hay un botón
    await expect(c.getAllByRole('button')).toHaveLength(1);
    await userEvent.click(c.getByRole('button', { name: 'Reintentar' }));
    await expect(args.primaryAction?.onClick).toHaveBeenCalledTimes(1);
  },
};

export const TestOptionalParts: Story = {
  tags: ['!autodocs'],
  decorators: [frame],
  args: { type: 'no-content', title: undefined, description: undefined },
  render: (args: EmptyStateProps) => <EmptyState {...args} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.queryByRole('heading')).toBeNull();
    await expect(c.queryByRole('button')).toBeNull();
  },
};
