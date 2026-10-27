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
    icon: { control: 'boolean', type: { name: 'boolean' }, description: 'Icon de Figma: ícono info-circle' },
    content: { control: 'text', description: 'Text de Figma: texto breve, sin contenido interactivo' },
    delay: { control: { type: 'number', min: 0, step: 50 }, type: { name: 'number' }, description: 'Retraso al abrir (ms)' },
    closeDelay: { control: { type: 'number', min: 0, step: 50 }, type: { name: 'number' }, description: 'Retraso al cerrar (ms)' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'No se muestra' },
    children: { control: false },
  },
  args: {
    arrow: 'bottom',
    solid: true,
    icon: true,
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
  render: (args) => (
    <div className="p-24">
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

/** Las 8 variantes de Figma (Solid × Position), sueltas y visibles a la vez, con el texto de Figma. */
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
        ...FIGMA_VARIANTS.filter((v) => v.solid === (solid === 'Yes')).map((v) => (
          <TooltipBubble key={v.name} arrow={v.arrow} solid={v.solid} data-figma={v.name}>
            Tooltips title
          </TooltipBubble>
        )),
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
      <Tooltip {...args} id="tooltip-editar-perfil" content="Editar perfil" icon={false} describes="label">
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
 * La página de documentación (la misma de la pestaña Docs) como historia: así las pruebas y axe la revisan. Recorre
 * las pestañas con teclado (patrón Tabs) y comprueba los encabezados numerados.
 */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole('heading', { level: 1, name: 'Tooltip' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Código']);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    // Definición: secciones 01 a 05
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2()).toEqual([
      'Definición del componente',
      'Propósito y anatomía',
      'Propiedades y variantes',
      'Estados y especificaciones de layout',
      'Estados compuestos y ejemplos base',
    ]);
    expect(canvas.getByText('05')).toBeInTheDocument();
    expect(canvas.getAllByRole('table').length).toBe(4);
    // Flecha derecha: Aplicación (activación automática), numeración continua 06 y 07
    tabs[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();
    await waitFor(() => expect(tabs[1]).toHaveAttribute('aria-selected', 'true'));
    expect(h2()).toEqual(['Comportamiento y reglas de uso', 'Buenas y malas prácticas (Dos and Don’ts)']);
    expect(canvas.getByText('06')).toBeInTheDocument();
    expect(canvas.getByText('07')).toBeInTheDocument();
    expect(canvas.getAllByRole('img', { name: 'Buena práctica' })).toHaveLength(4);
    // End: Código, con la tabla de props
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(tabs[2]).toHaveAttribute('aria-selected', 'true'));
    const props = canvas.getByRole('table', { name: 'Props de Tooltip' });
    expect(within(props).getByRole('rowheader', { name: /content/ })).toBeInTheDocument();
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(tabs[0]).toHaveAttribute('aria-selected', 'true'));
  },
};
