import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ErrorPage } from './ErrorPage';

// Figma: 21691:376
/**
 * Página de error 404 / 500 (component set "Error pages" de Figma). Solo la versión **sin juego**
 * (`Game=No`): logo, título, texto, botón "Volver al inicio" y el número grande en gris.
 *
 * - `main` con `h1`; el número grande es decorativo (`aria-hidden`): el título ya dice el error.
 * - Acción: con `href` es un enlace (navegación real); con `onAction` un botón; o un slot `action` propio.
 * - Responsive: en escritorio el número va sobre el logo; en móvil el logo va primero y el número baja de 250 a 150 px.
 * - `layout="desktop" | "mobile"` fuerza la disposición (documentación y comparador).
 * - El minijuego y el modal Game over de Figma no forman parte del sistema.
 */
const meta = {
  title: 'Patterns/ErrorPage',
  component: ErrorPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    code: { control: 'text' },
    layout: { name: 'enum', value: ['auto', 'desktop', 'mobile'], control: 'inline-radio' },
    logo: { control: false },
    action: { control: false },
  },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Página no encontrada. */
export const NotFound: Story = {
  args: {
    code: '404',
    title: 'Página no encontrada',
    description: 'El enlace podría estar dañado o la página pudo haber sido eliminada.',
    href: '/',
  },
};

/** Error del servidor. */
export const ServerError: Story = {
  args: {
    code: '500',
    title: 'Algo salió mal en el servidor',
    description: 'Ocurrió un error inesperado. Intenta de nuevo en unos minutos.',
    onAction: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('main')).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 1, name: 'Algo salió mal en el servidor' })).toBeInTheDocument();
    await expect(canvasElement.querySelector('[aria-hidden="true"]:not(svg)')?.textContent).toBe('500');
    await userEvent.click(canvas.getByRole('button', { name: 'Volver al inicio' }));
    await expect(args.onAction).toHaveBeenCalledTimes(1);
  },
  tags: ['!autodocs'],
};

/** Con `href` la acción es un enlace. */
export const LinkAction: Story = {
  args: { ...NotFound.args },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Volver al inicio' });
    await expect(link).toHaveAttribute('href', '/');
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
  tags: ['!autodocs'],
};

/** Disposición móvil forzada. */
export const Mobile: Story = {
  args: { ...NotFound.args, layout: 'mobile' },
};

const FRAME = 'relative h-[1080px] w-[1440px] max-w-none overflow-hidden';

/** Variante de Figma sin juego, en sus dos disposiciones (Desktop y Mobile), con los textos de cada una. */
export const FigmaMatrix: Story = {
  args: { title: 'Error' },
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div role="region" aria-label="Matriz de Error pages" tabIndex={0} className="flex max-w-full flex-col gap-10 overflow-x-auto bg-ds-background-general-black">
      <div>
        <p className="m-0 mb-2 text-xs text-ds-text-neutral-body">Desktop</p>
        <div data-figma="Game=No, State=404" className={FRAME}>
          <ErrorPage
            data-figma-part="Desktop"
            as="div"
            layout="desktop"
            title="Fallo general en el servidor de la página"
            description="El enlace podría estar dañado,o la página pudo haber sido eliminada."
            className="min-h-0 h-full"
            href="/"
          />
        </div>
      </div>
      <div>
        <p className="m-0 mb-2 text-xs text-ds-text-neutral-body">Mobile</p>
        <div className={FRAME}>
          <ErrorPage
            data-figma-part="Mobile"
            as="div"
            layout="mobile"
            title="Esta ruta no está en nuestro mapa"
            description="El enlace podría estar dañado,o la página pudo haber sido eliminada."
            className="min-h-0 h-full"
            href="/"
          />
        </div>
      </div>
    </div>
  ),
};
