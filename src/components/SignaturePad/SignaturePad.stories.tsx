import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { SignaturePad } from './SignaturePad';
import type { SignaturePadHandle, SignaturePadProps, SignatureValue } from './SignaturePad.types';

const meta = {
  title: 'Form Controls/SignaturePad',
  component: SignaturePad,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      type: { name: 'enum', value: ['horizontal', 'vertical'] },
      description: 'Position de Figma',
    },
    disabled: { control: 'boolean', description: 'Deshabilitado', type: { name: 'boolean' } },
    maximizable: { control: 'boolean', description: 'Muestra el botón de maximizar', type: { name: 'boolean' } },
    requireSignature: { control: 'boolean', description: '"Crear firma" inactivo sin firma (vertical)', type: { name: 'boolean' } },
    strokeWidth: { control: 'number', description: 'Grosor del trazo en px', type: { name: 'number' } },
    signerName: { control: 'text', description: 'Nombre del firmante (vertical)', type: { name: 'string' } },
    signerId: { control: 'text', description: 'Documento del firmante (vertical)', type: { name: 'string' } },
  },
  args: { orientation: 'horizontal', disabled: false, maximizable: false, requireSignature: true, strokeWidth: 2.5 },
} satisfies Meta<typeof SignaturePad>;

export default meta;
type Story = StoryObj<typeof meta>;

const LABEL = 'text-xs text-ds-text-neutral-gray';

/** Firmante inventado para todas las historias. */
const SIGNER = { signerName: 'Ana Pérez', signerId: '1.000.000.000' } as const;

/** Firma inventada (un garabato con subrayado), normalizada: nada de la firma de Figma. */
const SAMPLE: SignatureValue = [
  Array.from({ length: 40 }, (_, i): [number, number] => {
    const t = i / 39;
    return [0.3 + 0.4 * t, 0.5 + 0.18 * Math.sin(t * Math.PI * 5) * (1 - t * 0.5) - 0.1 * t];
  }),
  [
    [0.32, 0.78],
    [0.5, 0.74],
    [0.68, 0.76],
  ],
];

function InteractiveDemo(args: SignaturePadProps) {
  const [value, setValue] = useState<SignatureValue>([]);
  const ref = useRef<SignaturePadHandle>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className={args.orientation === 'vertical' ? 'w-fit' : 'w-full max-w-3xl'}>
        <SignaturePad {...args} ref={ref} value={value} onValueChange={setValue} />
      </div>
      <span className={LABEL}>
        {value.length === 0 ? 'Sin firma' : `${value.length} trazo${value.length === 1 ? '' : 's'}`}
      </span>
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
};

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-full max-w-3xl">
      <SignaturePad {...args} />
    </div>
  ),
};

export const WithSignature: Story = {
  render: (args) => (
    <div className="w-full max-w-3xl">
      <SignaturePad {...args} defaultValue={SAMPLE} />
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical', ...SIGNER },
  render: (args) => <SignaturePad {...args} onCreate={fn()} />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="w-full max-w-3xl">
      <SignaturePad {...args} defaultValue={SAMPLE} />
    </div>
  ),
};

/** Con `ref`: leer la firma como imagen. Quien compone decide dónde guardarla. */
function HandleDemo() {
  const ref = useRef<SignaturePadHandle>(null);
  const [url, setUrl] = useState<string | null>(null);
  return (
    <div className="flex w-full max-w-3xl flex-col gap-3">
      <SignaturePad ref={ref} />
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-ds-radius-general-xl bg-ds-background-general-gray-sixth px-4 py-2 text-ds-text-neutral-white"
          onClick={() => setUrl(ref.current?.toDataURL({ strokeColor: '#000000', background: '#ffffff' }) ?? null)}
        >
          Exportar PNG
        </button>
        <span className={LABEL}>{url ? 'Imagen generada' : 'Firma y exporta'}</span>
      </div>
      {url && <img src={url} alt="Vista previa de la firma exportada" className="h-24 w-fit rounded bg-white" />}
    </div>
  );
}

export const ExportAsImage: Story = {
  render: () => <HandleDemo />,
};

const POSITIONS = ['Horizontal', 'Vertical'] as const;
const VALUES = ['Default', 'Filled'] as const;

/**
 * Las 4 variantes de "Firm" (set 17805:32039): Position × Propiedad 1. Filled lleva un trazo inventado.
 * Va sobre la superficie del tema (background/general/black).
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de SignaturePad" className="max-w-full overflow-x-auto">
        <div className="flex flex-col gap-y-10 py-4">
          {POSITIONS.map((position) => (
            <div key={position} className="flex flex-col gap-y-4">
              <span className={LABEL}>{position}</span>
              <div className="flex flex-wrap items-start gap-x-8 gap-y-6">
                {VALUES.map((state) => {
                  const name = `Position=${position}, Propiedad 1=${state}`;
                  const filled = state === 'Filled';
                  return (
                    <div key={state} className="flex flex-col gap-y-3">
                      <span className={LABEL}>{state}</span>
                      {position === 'Horizontal' ? (
                        <div className="w-[1102px]">
                          <SignaturePad data-figma={name} defaultValue={filled ? SAMPLE : undefined} />
                        </div>
                      ) : (
                        <SignaturePad
                          data-figma={name}
                          orientation="vertical"
                          defaultValue={filled ? SAMPLE : undefined}
                          requireSignature={false}
                          {...SIGNER}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Dibuja un trazo con el puntero sobre el lienzo, con pasos intermedios. */
async function drawStroke(canvas: HTMLElement, points: [number, number][], rotated = false) {
  const rect = canvas.getBoundingClientRect();
  // Girado −90° (vertical): el eje x local sube por la pantalla y el eje y local avanza hacia la derecha
  const at = ([x, y]: [number, number]) =>
    rotated
      ? { clientX: rect.left + rect.width * y, clientY: rect.bottom - rect.height * x }
      : { clientX: rect.left + rect.width * x, clientY: rect.top + rect.height * y };
  await userEvent.pointer([
    { keys: '[MouseLeft>]', target: canvas, coords: at(points[0]) },
    ...points.slice(1).map((p) => ({ target: canvas, coords: at(p) })),
    { keys: '[/MouseLeft]', target: canvas, coords: at(points[points.length - 1]) },
  ]);
}

/** Test: nombre accesible y estado del lienzo, texto guía y botones con nombre */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  render: () => <SignaturePad />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pad = canvas.getByRole('img', { name: 'Firma vacía' });
    await expect(pad).toBeInTheDocument();
    await expect(canvas.getByText('Dibuja tu firma aquí')).toBeVisible();
    await expect(pad).toHaveAccessibleDescription('Dibuja tu firma aquí');
    await expect(canvas.getByRole('button', { name: 'Deshacer último trazo' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Borrar firma' })).toBeInTheDocument();
  },
};

/** Test: dibujar registra la firma, deshacer quita el último trazo y borrar vacía; onValueChange en cada paso */
export const DrawUndoClearTest: Story = {
  tags: ['!autodocs'],
  args: { onValueChange: fn() },
  render: (args) => <SignaturePad {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const pad = canvasElement.querySelector('canvas')!;
    await drawStroke(pad, [[0.2, 0.3], [0.4, 0.6], [0.6, 0.4], [0.8, 0.7]]);
    await expect(canvas.getByRole('img', { name: 'Firma registrada' })).toBeInTheDocument();
    await expect(canvas.queryByText('Dibuja tu firma aquí')).toBeNull();
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      const ctx = pad.getContext('2d')!;
      const data = ctx.getImageData(0, 0, pad.width, pad.height).data;
      expect(data.some((v, i) => i % 4 === 3 && v > 0)).toBe(true);
    });
    await drawStroke(pad, [[0.2, 0.8], [0.7, 0.8]]);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(expect.arrayContaining([expect.any(Array), expect.any(Array)]));
    const last = (args.onValueChange as ReturnType<typeof fn>).mock.lastCall![0] as SignatureValue;
    await expect(last).toHaveLength(2);
    await userEvent.click(canvas.getByRole('button', { name: 'Deshacer último trazo' }));
    await expect((args.onValueChange as ReturnType<typeof fn>).mock.lastCall![0]).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Borrar firma' }));
    await expect((args.onValueChange as ReturnType<typeof fn>).mock.lastCall![0]).toHaveLength(0);
    await expect(canvas.getByRole('img', { name: 'Firma vacía' })).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Firma borrada'));
  },
};

/** Test: cada trazo vuelve a anunciar "Firma registrada" (la región se vacía antes de repetir el mensaje) */
export const RepeatedAnnouncementTest: Story = {
  tags: ['!autodocs'],
  render: (args) => <SignaturePad {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pad = canvasElement.querySelector('canvas')!;
    const status = canvas.getByRole('status');
    const texts: string[] = [];
    const observer = new MutationObserver(() => texts.push(status.textContent ?? ''));
    observer.observe(status, { childList: true, characterData: true, subtree: true });
    await drawStroke(pad, [[0.2, 0.3], [0.4, 0.6]]);
    await waitFor(() => expect(status).toHaveTextContent('Firma registrada'));
    await drawStroke(pad, [[0.2, 0.8], [0.7, 0.8]]);
    await waitFor(() => expect(status).toHaveTextContent('Firma registrada'));
    observer.disconnect();
    // Entre el primer y el segundo mensaje la región pasó por vacío
    await expect(texts.filter((t) => t === 'Firma registrada')).toHaveLength(2);
    await expect(texts).toContain('');
  },
};

/** Test: deshabilitado no dibuja ni borra */
export const DisabledTest: Story = {
  tags: ['!autodocs'],
  args: { onValueChange: fn(), disabled: true },
  render: (args) => <SignaturePad {...args} />,
  play: async ({ args, canvasElement }) => {
    const pad = canvasElement.querySelector('canvas')!;
    await drawStroke(pad, [[0.2, 0.3], [0.6, 0.6]]);
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(within(canvasElement).getByRole('img', { name: 'Firma vacía' })).toHaveAttribute('aria-disabled', 'true');
  },
};

/** Test: versión vertical, trazo dentro de la columna girada y botones del pie */
export const VerticalTest: Story = {
  tags: ['!autodocs'],
  args: { orientation: 'vertical', ...SIGNER, onValueChange: fn(), onCreate: fn(), onCancel: fn(), onClose: fn() },
  render: (args) => <SignaturePad {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Ana Pérez')).toBeVisible();
    const create = canvas.getByRole('button', { name: 'Crear firma' });
    await expect(create).toBeDisabled();
    const pad = canvasElement.querySelector('canvas')!;
    await drawStroke(pad, [[0.2, 0.3], [0.5, 0.7], [0.8, 0.4]], true);
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    // Los puntos quedan normalizados al lienzo local aunque la columna esté girada
    const stroke = (args.onValueChange as ReturnType<typeof fn>).mock.lastCall![0][0] as [number, number][];
    await expect(stroke[0][0]).toBeCloseTo(0.2, 1);
    await expect(stroke[0][1]).toBeCloseTo(0.3, 1);
    await expect(create).toBeEnabled();
    await userEvent.click(create);
    await expect(args.onCreate).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Cancelar' }));
    await expect(args.onCancel).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Cerrar' }));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

/** Test: el ref expone clear, undo, isEmpty y toDataURL */
function RefHarness() {
  const ref = useRef<SignaturePadHandle>(null);
  const [out, setOut] = useState('');
  return (
    <div className="flex flex-col gap-2">
      <SignaturePad ref={ref} defaultValue={SAMPLE} />
      <button type="button" onClick={() => setOut(String(ref.current?.toDataURL()?.startsWith('data:image/png')))}>
        exportar
      </button>
      <button type="button" onClick={() => ref.current?.undo()}>
        deshacer-ref
      </button>
      <button type="button" onClick={() => ref.current?.clear()}>
        borrar-ref
      </button>
      <button type="button" onClick={() => setOut(String(ref.current?.isEmpty()))}>
        vacio
      </button>
      <output>{out}</output>
    </div>
  );
}

export const ImperativeHandleTest: Story = {
  tags: ['!autodocs'],
  render: () => <RefHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'exportar' }));
    await expect(canvasElement.querySelector('output')).toHaveTextContent('true');
    await userEvent.click(canvas.getByRole('button', { name: 'deshacer-ref' }));
    await userEvent.click(canvas.getByRole('button', { name: 'vacio' }));
    await expect(canvasElement.querySelector('output')).toHaveTextContent('false');
    await userEvent.click(canvas.getByRole('button', { name: 'borrar-ref' }));
    await userEvent.click(canvas.getByRole('button', { name: 'vacio' }));
    await expect(canvasElement.querySelector('output')).toHaveTextContent('true');
    await expect(canvas.getByRole('img', { name: 'Firma vacía' })).toBeInTheDocument();
  },
};
