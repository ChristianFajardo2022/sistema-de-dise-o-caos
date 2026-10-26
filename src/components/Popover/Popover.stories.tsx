import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Popover } from './Popover';
import { PopoverPanel } from './PopoverPanel';
import type { PopoverArrow, PopoverProps } from './Popover.types';
import { Avatar, AvatarGroup } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import type { PhotoName } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import { Icon } from '../Icon';

const ARROW_OPTIONS: PopoverArrow[] = [
  'top-left',
  'top-right',
  'middle-left',
  'middle-right',
  'bottom-left',
  'bottom-right',
  'center-top',
  'center-bottom',
];
const SURFACE = 'bg-ds-background-general-black';
const LABEL = 'font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm text-ds-text-neutral-gray';

const PEOPLE: { name: string; photo: PhotoName }[] = [
  { name: 'Ana Pérez', photo: 'Woman_1' },
  { name: 'Hugo García', photo: 'Men_1' },
  { name: 'Lucía Torres', photo: 'Woman_2' },
  { name: 'Mateo Ruiz', photo: 'Men_2' },
  { name: 'Sara Molina', photo: 'Woman_3' },
  { name: 'Diego Vega', photo: 'Men_3' },
];

/** Bloque de medios de muestra: AvatarGroup (4 + "+2") y un Button, como la captura de Figma. */
function SampleMedia({ action = 'Unirme' }: { action?: string }) {
  return (
    <>
      <AvatarGroup aria-label="Participantes" max={4} size="sm">
        {PEOPLE.map((p) => (
          <Avatar key={p.name} variant="photo" src={PHOTO_SRC[p.photo]} alt={p.name} />
        ))}
      </AvatarGroup>
      <Button size="xs">{action}</Button>
    </>
  );
}

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  subcomponents: { PopoverPanel },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    arrow: {
      control: 'select',
      options: ARROW_OPTIONS,
      type: { name: 'enum', value: ARROW_OPTIONS },
      description: 'Type de Figma: dónde está la flecha (el panel aparece del lado opuesto del ancla)',
    },
    title: { control: 'text', description: 'Text title de Figma' },
    children: { control: 'text', description: 'Text de Figma' },
    page: { control: 'text', description: 'Page de Figma: contador ("1 de 2")' },
    icon: { control: 'boolean', type: { name: 'boolean' }, description: 'Icon de Figma: info-circle antes del título' },
    trigger: { control: false },
    anchor: { control: false },
    media: { control: false },
    actions: { control: false },
  },
  args: {
    arrow: 'top-left',
    title: 'Nuevo panel de pedidos',
    children: 'Desde aquí ves el estado de cada pedido y lo que falta por despachar.',
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveDemo(args: PopoverProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-6 md:p-48">
      <Popover
        {...args}
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button variant="secondary" size="sm">
            Ver novedades
          </Button>
        }
        actions={
          <>
            <Button variant="tertiary" size="xs" unicolor onClick={() => setOpen(false)}>
              Ahora no
            </Button>
            <Button variant="secondary" contrast="low" size="xs" unicolor onClick={() => setOpen(false)}>
              Entendido
            </Button>
          </>
        }
      />
    </div>
  );
}

/** Clic en el botón: se abre un diálogo no modal anclado. Escape, clic fuera o sus botones lo cierran. */
export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
};

const FIGMA_VARIANTS = (['no', 'yes'] as const).flatMap((photo) =>
  ARROW_OPTIONS.map((arrow) => ({ arrow, photo, name: `Type=${arrow}, Photo=${photo}` }))
);

const figmaActions = (
  <>
    <Button variant="tertiary" size="xs" unicolor data-figma-part="Button">
      Button
    </Button>
    <Button variant="secondary" contrast="low" size="xs" unicolor data-figma-part="Button">
      Button
    </Button>
  </>
);

/** Las 16 variantes de Figma (Type × Photo), sueltas y visibles a la vez, con los textos de Figma. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className={`grid w-fit grid-cols-[repeat(4,305px)] items-start gap-x-8 gap-y-10 p-6 ${SURFACE}`}>
      {FIGMA_VARIANTS.map(({ arrow, photo, name }) => (
        <div key={name} className="flex flex-col gap-ds-space-general-lg">
          <span className={LABEL}>{name}</span>
          <PopoverPanel
            arrow={arrow}
            title="Tooltip Title"
            page="1 de 2"
            actions={figmaActions}
            media={photo === 'yes' ? <SampleMedia action="Button" /> : undefined}
            onClose={photo === 'yes' ? () => {} : undefined}
            data-figma={name}
          >
            Lorem ipsum dolor sit amet consectetur. Turpis.
          </PopoverPanel>
        </div>
      ))}
    </div>
  ),
};

/** Con bloque de medios (Photo=yes): AvatarGroup y Button reales en el slot `media`, y el botón cerrar en la muesca. */
export const WithMedia: Story = {
  args: { arrow: 'center-top', title: 'Tu equipo ya está aquí', children: 'Invita a más personas o únete a la conversación del grupo.' },
  render: (args) => (
    <div className="p-6 md:p-48">
      <Popover
        {...args}
        media={<SampleMedia />}
        trigger={
          <Button variant="secondary" size="sm">
            Ver equipo
          </Button>
        }
      />
    </div>
  ),
};

const TOUR = [
  { label: 'Buscar', icon: 'search', title: 'Busca lo que necesites', text: 'Escribe un pedido, un cliente o una guía.' },
  { label: 'Filtrar', icon: 'filter', title: 'Filtra la lista', text: 'Combina estado, fecha y ciudad para encontrar más rápido.' },
  { label: 'Notificaciones', icon: 'notification', title: 'Entérate a tiempo', text: 'Aquí llegan los avisos de cada pedido.' },
] as const;

function TourDemo({ onFinish, arrow = 'center-top' }: { onFinish?: () => void; arrow?: PopoverArrow }) {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const targets = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];
  const current = TOUR[step - 1];
  return (
    <div className="flex flex-col items-start gap-ds-space-general-2xl p-12">
      <Button
        size="sm"
        onClick={() => {
          setStep(1);
          setOpen(true);
        }}
      >
        Iniciar recorrido
      </Button>
      <div className="flex gap-ds-space-general-2xl">
        {TOUR.map((t, i) => (
          <Button
            key={t.label}
            ref={targets[i]}
            iconOnly
            variant="secondary"
            size="sm"
            aria-label={t.label}
          >
            <Icon name={t.icon} size={20} />
          </Button>
        ))}
      </div>
      <Popover
        anchor={targets[step - 1]}
        open={open}
        onOpenChange={setOpen}
        arrow={arrow}
        title={current.title}
        step={step}
        totalSteps={TOUR.length}
        onStepChange={setStep}
        onFinish={onFinish}
      >
        {current.text}
      </Popover>
    </div>
  );
}

/**
 * Recorrido paso a paso: el panel señala un elemento distinto en cada paso, con el contador y Anterior / Siguiente
 * (Finalizar en el último). Al terminar, el foco vuelve a "Iniciar recorrido".
 */
export const Tour: Story = {
  render: () => <TourDemo />,
};

/**
 * Dentro de un contenedor con `overflow: hidden` y junto al borde derecho: el panel va en la capa superior (no se
 * corta) y, como `top-left` no cabe, pasa a `top-right` con la flecha en la otra esquina.
 */
export const InsideOverflow: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="flex justify-end p-2">
      <div className="h-16 w-40 overflow-hidden rounded-ds-radius-general-md bg-ds-background-container-default-on-canva p-ds-space-general-lg">
        <Popover
          {...args}
          arrow="top-left"
          defaultOpen
          trigger={
            <Button variant="secondary" size="xs">
              Ayuda
            </Button>
          }
        />
      </div>
    </div>
  ),
};

// ───────────────────────── pruebas ─────────────────────────

export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  render: (args) => <InteractiveDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Ver novedades' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    const dialog = await canvas.findByRole('dialog', { name: 'Nuevo panel de pedidos' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(dialog).toHaveAccessibleDescription(/estado de cada pedido/);
    expect(dialog).not.toHaveAttribute('aria-modal');
    await waitFor(() => expect(dialog).toHaveFocus());

    await userEvent.tab();
    expect(canvas.getByRole('button', { name: 'Ahora no' })).toHaveFocus();
    await userEvent.tab();
    expect(canvas.getByRole('button', { name: 'Entendido' })).toHaveFocus();

    // Escape cierra y devuelve el foco al disparador
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    expect(dialog.matches(':popover-open')).toBe(false);
    expect(trigger).toHaveFocus();

    // Una acción también cierra y devuelve el foco
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(true));
    await userEvent.click(canvas.getByRole('button', { name: 'Entendido' }));
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(false));
    expect(trigger).toHaveFocus();
  },
};

export const OutsideClickTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <div className="flex flex-col items-start gap-24">
      <InteractiveDemo {...args} />
      <p className={LABEL}>Fuera del panel</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Ver novedades' });
    await userEvent.click(trigger);
    const dialog = await canvas.findByRole('dialog');
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(true));
    await userEvent.click(canvas.getByText('Fuera del panel'));
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(false));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};

export const MediaCloseTest: Story = {
  ...WithMedia,
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Ver equipo' });
    await userEvent.click(trigger);
    const dialog = await canvas.findByRole('dialog', { name: 'Tu equipo ya está aquí' });
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(true));
    expect(within(dialog).getByRole('group', { name: 'Participantes' })).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Cerrar' }));
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(false));
    expect(trigger).toHaveFocus();
  },
};

const finishSpy = fn();

export const TourTest: Story = {
  tags: ['!autodocs'],
  render: () => <TourDemo onFinish={finishSpy} />,
  play: async ({ canvasElement }) => {
    finishSpy.mockClear();
    const canvas = within(canvasElement);
    const start = canvas.getByRole('button', { name: 'Iniciar recorrido' });
    await userEvent.click(start);
    const dialog = await canvas.findByRole('dialog', { name: 'Busca lo que necesites' });
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(true));
    expect(within(dialog).getByText('1 de 3')).toBeInTheDocument();
    expect(within(dialog).queryByRole('button', { name: 'Anterior' })).toBeNull();

    // El panel queda debajo del elemento del paso y la flecha apunta a su centro
    const near = (target: string) => {
      const a = canvas.getByRole('button', { name: target }).getBoundingClientRect();
      const d = dialog.getBoundingClientRect();
      const arrowOffset = parseFloat(dialog.style.getPropertyValue('--anchored-arrow-offset'));
      return Math.abs(d.top - (a.bottom + 4)) < 1 && Math.abs(d.left + arrowOffset - (a.left + a.width / 2)) < 1;
    };
    await waitFor(() => expect(near('Buscar')).toBe(true));

    await userEvent.click(within(dialog).getByRole('button', { name: 'Siguiente' }));
    await waitFor(() => expect(dialog).toHaveAccessibleName('Filtra la lista'));
    expect(within(dialog).getByText('2 de 3')).toBeInTheDocument();
    await waitFor(() => expect(near('Filtrar')).toBe(true));

    // Anterior vuelve al paso 1; el botón desaparece y el foco pasa a Siguiente
    await userEvent.click(within(dialog).getByRole('button', { name: 'Anterior' }));
    await waitFor(() => expect(within(dialog).getByText('1 de 3')).toBeInTheDocument());
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Siguiente' })).toHaveFocus());

    // Con teclado hasta el final
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(within(dialog).getByText('2 de 3')).toBeInTheDocument());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(within(dialog).getByText('3 de 3')).toBeInTheDocument());
    const finish = within(dialog).getByRole('button', { name: 'Finalizar' });
    expect(finish).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(false));
    expect(finishSpy).toHaveBeenCalledTimes(1);
    expect(start).toHaveFocus();
  },
};

export const NestedEscapeTest: Story = {
  ...WithMedia,
  tags: ['!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Ver equipo' }));
    const dialog = await canvas.findByRole('dialog', { name: 'Tu equipo ya está aquí' });
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(true));
    // El "+N" del AvatarGroup abre otro panel de la capa superior dentro del Popover
    await userEvent.click(within(dialog).getByRole('button', { name: /\+2/ }));
    await waitFor(() => expect(dialog.querySelector(':popover-open')).not.toBeNull());
    // Un Escape cierra solo el de arriba
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog.querySelector(':popover-open')).toBeNull());
    expect(dialog.matches(':popover-open')).toBe(true);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(false));
  },
};

/** El padre no acepta el cierre: `open` siempre verdadero. */
function ControlledDemo() {
  const anchor = useRef<HTMLButtonElement>(null);
  const [changes, setChanges] = useState(0);
  return (
    <div className="p-6 md:p-48">
      <Button ref={anchor} variant="secondary" size="sm">
        Ancla
      </Button>
      <p className={LABEL} data-testid="changes">
        {changes}
      </p>
      <Popover
        open
        onOpenChange={() => setChanges((n) => n + 1)}
        anchor={anchor}
        title="Siempre abierto"
        actions={
          <Button variant="secondary" contrast="low" size="xs" unicolor>
            Entendido
          </Button>
        }
      >
        El padre mantiene open.
      </Popover>
    </div>
  );
}

export const ControlledTest: Story = {
  tags: ['!autodocs'],
  render: () => <ControlledDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole('dialog', { name: 'Siempre abierto' });
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(true));
    // Escape (nativo) lo cierra y avisa; como el padre no acepta, vuelve a abrirse
    dialog.focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getByTestId('changes')).toHaveTextContent('1'));
    await waitFor(() => expect(dialog.matches(':popover-open')).toBe(true));
  },
};
