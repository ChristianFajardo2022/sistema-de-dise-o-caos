import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { TooltipBubble } from './TooltipBubble';
import type { TooltipArrow } from './Tooltip.types';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Tooltip.doc';
import docsJson from './Tooltip.docs.json';

const ARROW_OPTIONS: TooltipArrow[] = ['top', 'bottom', 'left', 'right'];
const SURFACE = 'bg-ds-background-general-black';
const LABEL = 'font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm text-ds-text-neutral-gray';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  subcomponents: { TooltipBubble },
  // La página Docs usa la plantilla de documentación (Tooltip.doc.tsx) con la referencia de código al final
  parameters: { layout: 'centered', docs: componentDocsParameters(doc, docsJson) },
  tags: ['autodocs'],
  argTypes: {
    arrow: {
      control: 'radio',
      options: ARROW_OPTIONS,
      type: { name: 'enum', value: ARROW_OPTIONS },
      description: 'Position de Figma: borde de la burbuja con la flecha (la burbuja aparece del lado opuesto)',
    },
    solid: { control: 'boolean', type: { name: 'boolean' }, description: 'Solid de Figma: relleno sólido o translúcido' },
    content: { control: 'text', description: 'Text de Figma: texto breve, sin contenido interactivo' },
    delay: { control: { type: 'number', min: 0, step: 50 }, type: { name: 'number' }, description: 'Retraso al abrir (ms)' },
    closeDelay: { control: { type: 'number', min: 0, step: 50 }, type: { name: 'number' }, description: 'Retraso al cerrar (ms)' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'No se muestra' },
    children: { control: false },
  },
  args: {
    arrow: 'bottom',
    solid: true,
    content: 'Guarda los cambios',
    delay: 300,
    closeDelay: 150,
    disabled: false,
    children: <span />,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Pasa el puntero o enfoca el botón (Tab). Escape lo cierra sin mover el foco. */
export const Interactive: Story = {
  // Sin padding extra: la burbuja va en la capa superior y no necesita espacio en el lienzo
  render: (args) => (
    <div className="p-ds-space-general-2xl">
      <Tooltip {...args}>
        <Button variant="secondary" size="sm">
          Guardar
        </Button>
      </Tooltip>
    </div>
  ),
};

const FIGMA_VARIANTS: { solid: boolean; arrow: TooltipArrow; name: string }[] = (['Yes', 'No'] as const).flatMap((solid) =>
  (['Top', 'Bottom', 'Right', 'Left'] as const).map((position) => ({
    solid: solid === 'Yes',
    arrow: position.toLowerCase() as TooltipArrow,
    name: `Solid=${solid}, Position=${position}`,
  }))
);

/** Las 7 variantes de Figma (Solid × Position; no existe Solid=No con Position=Bottom), sueltas y a la vez. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className={`grid w-fit grid-cols-[auto_repeat(4,8rem)] items-center gap-6 p-6 ${SURFACE}`}>
      <span />
      {['Top', 'Bottom', 'Right', 'Left'].map((p) => (
        <span key={p} className={LABEL}>
          Position={p}
        </span>
      ))}
      {(['Yes', 'No'] as const).map((solid) => [
        <span key={solid} className={LABEL}>
          Solid={solid}
        </span>,
        ...FIGMA_VARIANTS.filter((v) => v.solid === (solid === 'Yes')).map((v) =>
          v.name === 'Solid=No, Position=Bottom' ? (
            <span key={v.name} />
          ) : (
            <TooltipBubble key={v.name} arrow={v.arrow} solid={v.solid} data-figma={v.name}>
              Tooltips title
            </TooltipBubble>
          )
        ),
      ])}
    </div>
  ),
};

/** Las cuatro posiciones abiertas al cargar. La flecha siempre apunta al disparador. */
export const Positions: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-x-80 gap-y-24 p-24">
      {ARROW_OPTIONS.map((arrow) => (
        <Tooltip key={arrow} {...args} arrow={arrow} defaultOpen content={`Flecha ${arrow}`}>
          <Button variant="secondary" size="sm">
            {arrow}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * Botón solo con ícono: el tooltip es su nombre (`describes="label"`: `aria-labelledby` en vez de `aria-describedby`,
 * sin `aria-label`), así el lector no lo anuncia dos veces.
 */
export const IconButton: Story = {
  render: (args) => (
    <div className="p-24">
      <Tooltip {...args} id="tooltip-editar-perfil" content="Editar perfil" describes="label">
        <Button iconOnly variant="secondary" size="sm" aria-labelledby="tooltip-editar-perfil">
          <Icon name="edit" size={20} />
        </Button>
      </Tooltip>
    </div>
  ),
};

/**
 * Toggletip (`mode="toggletip"`): para información que solo vive en el globo, como el ícono de información de un campo.
 * Abre y cierra con clic, toque, Enter o Espacio; Escape o un clic fuera lo cierran. Al abrir, el contenido se anuncia
 * por una región `role="status"`.
 */
export const Toggletip: Story = {
  args: { content: 'Lo usamos solo para avisarte del envío' },
  render: (args) => (
    <div className="p-24">
      <Tooltip {...args} mode="toggletip">
        <Button iconOnly variant="tertiary" size="sm" aria-label="Más información">
          <Icon name="info-circle" size={16} variant="fill" />
        </Button>
      </Tooltip>
    </div>
  ),
};

/**
 * Dentro de un contenedor con `overflow: hidden` y junto al borde de la pantalla: la burbuja va en la capa superior
 * (no se corta), pasa al otro lado si no cabe y la flecha se corre para seguir apuntando al botón.
 */
export const InsideOverflow: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="flex justify-end p-2">
      <div className="h-16 w-40 overflow-hidden rounded-ds-radius-general-md bg-ds-background-container-default-on-canva p-ds-space-general-lg">
        <Tooltip {...args} arrow="bottom" defaultOpen content="Se ve completo aunque el contenedor lo recorte">
          <Button variant="secondary" size="xs">
            Ayuda
          </Button>
        </Tooltip>
      </div>
    </div>
  ),
};

// ───────────────────────── pruebas ─────────────────────────

export const HoverTest: Story = {
  tags: ['!autodocs'],
  args: { delay: 50, closeDelay: 50 },
  render: Interactive.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Guardar' });
    const tooltip = canvas.getByRole('tooltip', { hidden: true });
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
    expect(button).toHaveAccessibleDescription('Guarda los cambios');
    expect(tooltip.matches(':popover-open')).toBe(false);

    await userEvent.hover(button);
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true));
    expect(tooltip).toBeVisible();

    // Persistente: el puntero pasa a la burbuja y sigue abierta
    await userEvent.unhover(button);
    await userEvent.hover(tooltip);
    await new Promise((r) => setTimeout(r, 120));
    expect(tooltip.matches(':popover-open')).toBe(true);

    await userEvent.unhover(tooltip);
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(false));
  },
};

export const FocusEscapeTest: Story = {
  tags: ['!autodocs'],
  args: { delay: 0 },
  render: Interactive.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Guardar' });
    const tooltip = canvas.getByRole('tooltip', { hidden: true });

    await userEvent.tab();
    expect(button).toHaveFocus();
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true));

    // Escape la descarta sin mover el foco, y no reaparece mientras el foco siga ahí
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(false));
    expect(button).toHaveFocus();
    await new Promise((r) => setTimeout(r, 50));
    expect(tooltip.matches(':popover-open')).toBe(false);

    // Al perder el foco y volver, aparece otra vez
    await userEvent.tab();
    await userEvent.tab({ shift: true });
    expect(button).toHaveFocus();
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true));
    await userEvent.tab();
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(false));
  },
};

export const DisabledTest: Story = {
  tags: ['!autodocs'],
  args: { delay: 0, disabled: true },
  render: Interactive.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Guardar' });
    expect(button).not.toHaveAttribute('aria-describedby');
    await userEvent.hover(button);
    await new Promise((r) => setTimeout(r, 30));
    expect(canvas.getByRole('tooltip', { hidden: true }).matches(':popover-open')).toBe(false);
  },
};

export const BlurResetTest: Story = {
  tags: ['!autodocs'],
  args: { delay: 0, closeDelay: 0 },
  render: Interactive.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Guardar' });
    const tooltip = canvas.getByRole('tooltip', { hidden: true });

    // Escape con teclado y salir con Tab: el descarte se olvida y el hover lo vuelve a abrir
    await userEvent.hover(button);
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true));
    button.focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(false));
    button.blur();
    await userEvent.unhover(button);
    await userEvent.hover(button);
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true));
    await userEvent.unhover(button);
  },
};

export const EscapeConsumedTest: Story = {
  tags: ['!autodocs'],
  args: { delay: 0 },
  render: Interactive.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Guardar' });
    const tooltip = canvas.getByRole('tooltip', { hidden: true });
    // Un panel que contenga al disparador (p. ej. un Popover) escucha Escape en el documento
    const seen: string[] = [];
    const onKeyDown = (event: KeyboardEvent) => seen.push(event.key);
    document.addEventListener('keydown', onKeyDown);
    try {
      await userEvent.tab();
      await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true));
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(false));
      expect(button).toHaveFocus();
      // El Escape que cerró el tooltip no llega a nadie más; el siguiente (tooltip cerrado) sí
      expect(seen).not.toContain('Escape');
      await userEvent.keyboard('{Escape}');
      expect(seen).toContain('Escape');
    } finally {
      document.removeEventListener('keydown', onKeyDown);
    }
  },
};

export const TouchFocusTest: Story = {
  tags: ['!autodocs'],
  args: { delay: 0 },
  render: Interactive.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Guardar' });
    const tooltip = canvas.getByRole('tooltip', { hidden: true });
    // Un toque enfoca el botón en Chromium: ese foco no abre el tooltip
    button.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', bubbles: true }));
    button.focus();
    await new Promise((r) => setTimeout(r, 80));
    expect(tooltip.matches(':popover-open')).toBe(false);
    button.blur();
    // Con teclado (sin toque reciente) sí
    await new Promise((r) => setTimeout(r, 520));
    button.focus();
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true));
    button.blur();
  },
};

export const LabelTest: Story = {
  tags: ['!autodocs'],
  render: IconButton.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tooltip = canvas.getByRole('tooltip', { hidden: true });
    const button = canvas.getByRole('button', { name: 'Editar perfil' });
    expect(button).toHaveAttribute('aria-labelledby', tooltip.id);
    expect(button).not.toHaveAttribute('aria-describedby');
    expect(button).not.toHaveAttribute('aria-label');
  },
};

export const ToggletipTest: Story = {
  tags: ['!autodocs'],
  render: Toggletip.render,
  args: Toggletip.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Más información' });
    const tooltip = canvas.getByRole('tooltip', { hidden: true });
    const status = canvas.getByRole('status');
    expect(status).toBeEmptyDOMElement();

    // Hover y foco no lo abren
    await userEvent.hover(button);
    await new Promise((r) => setTimeout(r, 400));
    expect(tooltip.matches(':popover-open')).toBe(false);

    // Clic abre y llena la región viva; otro clic cierra
    await userEvent.click(button);
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true));
    expect(status).toHaveTextContent('Lo usamos solo para avisarte del envío');
    await userEvent.click(button);
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(false));
    expect(status).toBeEmptyDOMElement();

    // Enter abre; Escape cierra sin mover el foco
    button.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(false));
    expect(button).toHaveFocus();

    // Espacio abre; clic fuera cierra
    await userEvent.keyboard(' ');
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true));
    await userEvent.click(canvasElement);
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(false));
  },
};

/**
 * La página de documentación (la misma de la pestaña Docs) como historia: así las pruebas y axe la revisan. Pestañas
 * del encabezado (Definición, Aplicación y Desarrollo), cada una con su panel.
 */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Tooltip' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Tooltip en Figma:']);
    // Anatomía: un marcador por pauta en cada lienzo, y las vistas son ilustraciones (inert)
    const views = canvasElement.querySelectorAll('[data-doc-anatomy-view="marks"]');
    await expect(views).toHaveLength(2);
    for (const view of views) await expect(view).toHaveAttribute('inert');
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(8));
    // Tokens: la burbuja sólida tiene modo fijo y su hex no cambia con el interruptor
    await expect(canvas.getByRole('group', { name: 'Modo de color' })).toBeInTheDocument();
    const fixed = canvasElement.querySelector('[data-doc-token-mode="dark"]');
    const before = fixed?.textContent;
    await userEvent.click(canvas.getByRole('button', { name: 'Modo claro' }));
    await waitFor(() => expect(canvasElement.querySelector('[data-doc-token-mode="dark"]')?.textContent).toBe(before));
    await userEvent.click(canvas.getByRole('button', { name: 'Modo oscuro' }));
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática) se llega a Desarrollo
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    // Referencia de código: tabla de props (de solo lectura sin Storybook)
    const props = canvas.getByRole('table', { name: 'Props de Tooltip' });
    await expect(within(props).getByRole('rowheader', { name: /content/ })).toBeInTheDocument();
  },
};
