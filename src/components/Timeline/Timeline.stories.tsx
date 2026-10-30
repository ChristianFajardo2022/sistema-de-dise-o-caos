import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Icon } from '../Icon';
import { StatusTracker } from './StatusTracker';
import { Timeline } from './Timeline';
import { TimelineItem } from './TimelineItem';
import type {
  TimelineItemData,
  TimelineOrientation,
  TimelinePosition,
  TimelineProgress,
  TimelineStatus,
} from './Timeline.types';

const meta = {
  title: 'Feedback/Timeline',
  component: Timeline,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      type: { name: 'enum', value: ['vertical', 'horizontal'] },
      description: 'Orientation de Figma',
    },
  },
  args: { orientation: 'vertical', 'aria-label': 'Historial de la solicitud' },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS: TimelineItemData[] = [
  { title: 'Recibido', description: 'La solicitud quedó registrada.', date: 'Ayer', time: '9:15am', dateTime: '2026-10-27T09:15', status: 'complete' },
  { title: 'En revisión', description: 'Un equipo valida los datos enviados.', date: 'Ayer', time: '4:40pm', dateTime: '2026-10-27T16:40', status: 'complete' },
  { title: 'En proceso', description: 'Se está preparando el resultado.', date: 'Hoy', time: '8:00pm', dateTime: '2026-10-28T20:00', status: 'current' },
  { title: 'Listo', description: 'Podrás recogerlo cuando esté disponible.', status: 'incomplete' },
];

export const Interactive: Story = {
  args: { items: ITEMS },
  render: (args) => (
    <div className={args.orientation === 'horizontal' ? 'w-[720px] max-w-full' : 'w-[335px]'}>
      <Timeline {...args} />
    </div>
  ),
};

/** Composición con `TimelineItem` (el slot Espacio de Figma). */
export const Composition: Story = {
  render: (args) => (
    <div className="w-[335px]">
      <Timeline {...args}>
        <TimelineItem title="Recibido" status="complete" date="Hoy" time="8:00pm" dateTime="2026-10-28T20:00" />
        <TimelineItem title="Con un problema" description="Falta un dato para continuar." status="error" />
        <TimelineItem title="Pendiente de confirmar" status="warning" />
        <TimelineItem title="Listo" status="incomplete" />
      </Timeline>
    </div>
  ),
};

// ───────────────────────── FigmaMatrix ─────────────────────────

const ORIENTATIONS: { v: TimelineOrientation; f: string }[] = [
  { v: 'vertical', f: 'Vertical' },
  { v: 'horizontal', f: 'Horizontal' },
];
const TYPES: { v: TimelinePosition; f: string }[] = [
  { v: 'initial', f: 'Initial' },
  { v: 'middle', f: 'Middle' },
  { v: 'finally', f: 'Finally' },
];
const STATES: { v: TimelineStatus; f: string; p: TimelineProgress; fp: string }[] = [
  { v: 'incomplete', f: 'Incomplete', p: 0, fp: '0%' },
  { v: 'current', f: 'Currently', p: 50, fp: '50%' },
  { v: 'error', f: 'Error', p: 50, fp: '50%' },
  { v: 'warning', f: 'Warning', p: 50, fp: '50%' },
  { v: 'complete', f: 'Check', p: 100, fp: '100' },
];

// Figma: 13576:32508
/** Set Indicator: las 30 variantes, una vez (ancho 335). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex w-fit max-w-full flex-col gap-6 bg-ds-background-general-black p-6">
      {ORIENTATIONS.map((o) => (
        <div key={o.v} className="grid grid-cols-[repeat(auto-fill,335px)] gap-6">
          {STATES.flatMap((s) =>
            TYPES.map((t) => {
              const figma = `Orientation=${o.f}, Type=${t.f}, Percentage=${s.fp}, State=${s.f}`;
              return (
                <Timeline key={figma} orientation={o.v} aria-label={figma}>
                  <TimelineItem
                    title="En revisión"
                    description={o.v === 'vertical' ? 'El elemento llegó a la oficina de origen y está en proceso.' : 'El elemento llegó a la oficina y está en proceso.'}
                    date="Hoy"
                    time="8:00pm"
                    orientation={o.v}
                    position={t.v}
                    status={s.v}
                    progress={s.p}
                    data-figma={figma}
                  />
                </Timeline>
              );
            })
          )}
        </div>
      ))}
    </div>
  ),
};

// Figma: 13687:11466
/** Timeline (Propiedad 1=Vertical): inicio, tres intermedios con uno en curso y final. */
export const FigmaTimeline: Story = {
  render: () => (
    <div className="w-[335px] bg-ds-background-general-black">
      <Timeline aria-label="Historial de ejemplo" data-figma="Propiedad 1=Vertical">
        {['Recibido', 'En revisión', 'En proceso', 'Preparado'].map((title, i) => (
          <TimelineItem
            key={title}
            title={title}
            description="El elemento llegó a la etapa de origen y está en proceso."
            date="Hoy"
            time="8:00pm"
            status={i === 3 ? 'current' : 'incomplete'}
          />
        ))}
        <TimelineItem title="Listo" description="El elemento llegó a la etapa de origen y está en proceso." date="Hoy" time="8:00pm" status="complete" />
      </Timeline>
    </div>
  ),
};

// ───────────────────────── StatusTracker ─────────────────────────

const TRACKER_ITEMS: TimelineItemData[] = [
  { title: 'Recibido', date: 'Hoy', time: '8:00pm', status: 'current' },
  { title: 'En revisión', date: 'Hoy', time: '8:00pm', status: 'incomplete' },
  { title: 'En proceso', date: 'Hoy', time: '8:00pm', status: 'incomplete' },
  { title: 'Verificado', date: 'Hoy', time: '8:00pm', status: 'incomplete' },
  { title: 'Preparado', date: 'Hoy', time: '8:00pm', status: 'incomplete' },
  { title: 'Listo', date: 'Hoy', time: '8:00pm', status: 'incomplete' },
];

const MARKER = <span className="block size-8 rounded-ds-radius-general-full bg-ds-background-acent-tertiary" />;

// Figma: 13770:10884
/** Status tracker (sin botón de historial, como el defecto de Figma). */
export const FigmaStatusTracker: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="w-full max-w-[1094px]">
        <StatusTracker items={TRACKER_ITEMS} marker={MARKER} reference="Ref. 1234567890" data-figma="Status tracker" />
      </div>
    </div>
  ),
};

function TrackerDemo() {
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState(false);
  const items = TRACKER_ITEMS.map((i, n): TimelineItemData => ({
    ...i,
    status: n < step ? 'complete' : n === step ? 'current' : 'incomplete',
  }));
  return (
    <div className="flex w-[900px] max-w-full flex-col gap-6">
      <StatusTracker items={items} marker={MARKER} reference="Ref. 1234567890" onShowHistory={() => setHistory((v) => !v)} />
      <div className="flex gap-2">
        <button type="button" onClick={() => setStep((s) => Math.min(s + 1, items.length - 1))} className="text-ds-text-neutral-white underline">
          Avanzar
        </button>
        <button type="button" onClick={() => setStep((s) => Math.max(s - 1, 0))} className="text-ds-text-neutral-white underline">
          Retroceder
        </button>
      </div>
      {history && <p role="status" className="text-ds-text-neutral-body">Historial abierto</p>}
    </div>
  );
}

export const StatusTrackerInteractive: Story = {
  render: () => <TrackerDemo />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const group = c.getByRole('group', { name: 'Estado actual' });
    await expect(within(group).getByRole('list')).toBeInTheDocument();
    await expect(c.getAllByRole('listitem').filter((li) => li.getAttribute('aria-current') === 'step')).toHaveLength(1);
    await userEvent.click(c.getByRole('button', { name: 'Avanzar' }));
    await expect(c.getByRole('listitem', { current: 'step' })).toHaveTextContent('En proceso');
    await userEvent.tab();
    await userEvent.click(c.getByRole('button', { name: 'Ver historial' }));
    await expect(await c.findByRole('status')).toHaveTextContent('Historial abierto');
  },
};

// ───────────────────────── tests ─────────────────────────

export const TestSemantics: Story = {
  tags: ['!autodocs'],
  args: { items: ITEMS },
  render: (args) => <Timeline {...args} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const list = c.getByRole('list', { name: 'Historial de la solicitud' });
    await expect(list.tagName).toBe('OL');
    const rows = within(list).getAllByRole('listitem');
    await expect(rows).toHaveLength(4);
    // Solo el paso en curso lleva aria-current
    await expect(rows.map((r) => r.getAttribute('aria-current'))).toEqual([null, null, 'step', null]);
    // El estado se lee como texto
    await expect(rows[0]).toHaveTextContent('Completado: Recibido');
    await expect(rows[2]).toHaveTextContent('En curso: En proceso');
    // Fecha y hora en <time dateTime>
    const t = canvasElement.querySelector('time');
    await expect(t?.getAttribute('datetime')).toBe('2026-10-27T09:15');
    // Barra y nodo decorativos
    await expect(canvasElement.querySelectorAll('[data-figma-part="Indicator"][aria-hidden="true"]')).toHaveLength(4);
  },
};

export const TestStatusTracker: Story = {
  tags: ['!autodocs'],
  render: () => (
    <StatusTracker items={TRACKER_ITEMS} reference="Ref. 1" onShowHistory={() => {}} historyLabel="Ver historial" />
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('group', { name: 'Estado actual' })).toBeInTheDocument();
    await expect(c.getAllByRole('listitem')).toHaveLength(6);
    await expect(c.getByRole('listitem', { current: 'step' })).toHaveTextContent('Recibido');
    const button = c.getByRole('button', { name: 'Ver historial' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
  },
};

/** Slot `icon` en el nodo: decorativo, centrado sobre el punto o el anillo sin cambiar su huella. */
export const WithNodeIcons: Story = {
  render: (args) => (
    <Timeline {...args}>
      <TimelineItem status="complete" title="Recibido" icon={<Icon name="tick-circle" size={12} variant="line" className="text-ds-icon-general-default-unicolor" />} />
      <TimelineItem status="current" title="En proceso" icon={<Icon name="clock" size={12} variant="line" className="text-ds-icon-general-default-unicolor" />} />
      <TimelineItem status="incomplete" title="Listo" />
    </Timeline>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getAllByRole('listitem')).toHaveLength(3);
    // El ícono es decorativo: no aparece en el árbol de accesibilidad
    await expect(c.queryByRole('img')).toBeNull();
    await expect(canvasElement.querySelectorAll('[data-figma-part="Icon"] svg[aria-hidden="true"]')).toHaveLength(2);
  },
};

function LiveDemo() {
  const [step, setStep] = useState(0);
  const items = TRACKER_ITEMS.map((i, n): TimelineItemData => ({ ...i, status: n < step ? 'complete' : n === step ? 'current' : 'incomplete' }));
  return (
    <div className="flex w-[900px] max-w-full flex-col gap-6">
      <StatusTracker items={items} live="polite" />
      <button type="button" onClick={() => setStep((s) => Math.min(s + 1, items.length - 1))} className="text-ds-text-neutral-white underline">
        Avanzar
      </button>
    </div>
  );
}

/** `live="polite"`: una región `aria-live` oculta dice "Estado actual: En curso: <paso>" cuando cambia el paso. */
export const StatusTrackerLive: Story = {
  tags: ['!autodocs'],
  render: () => <LiveDemo />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const region = canvasElement.querySelector('[aria-live="polite"]');
    await expect(region).not.toBeNull();
    await expect(region).toHaveTextContent(`Estado actual: En curso: ${TRACKER_ITEMS[0].title}`);
    await userEvent.click(c.getByRole('button', { name: 'Avanzar' }));
    await expect(region).toHaveTextContent(`Estado actual: En curso: ${TRACKER_ITEMS[1].title}`);
  },
};
