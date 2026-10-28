import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { ScanGuide } from './ScanGuide';
import type { ScanGuideFrame, ScanGuideType } from './Scan.types';

const TYPE_OPTIONS: ScanGuideType[] = ['face', 'code', 'id', 'qr'];
const FRAME_OPTIONS: ScanGuideFrame[] = [1, 2, 3];
const FIGMA_TYPE: Record<ScanGuideType, string> = { face: 'Face', code: 'Code', id: 'Id', qr: 'QR' };
/** Las 9 variantes del set 20889:54087. */
const VARIANTS: { type: ScanGuideType; frame: ScanGuideFrame }[] = [
  { type: 'face', frame: 1 },
  { type: 'face', frame: 2 },
  { type: 'code', frame: 1 },
  { type: 'code', frame: 2 },
  { type: 'id', frame: 1 },
  { type: 'id', frame: 2 },
  { type: 'id', frame: 3 },
  { type: 'qr', frame: 1 },
  { type: 'qr', frame: 2 },
];

const meta = {
  title: 'Feedback/Scan/ScanGuide',
  component: ScanGuide,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: TYPE_OPTIONS, type: { name: 'enum', value: TYPE_OPTIONS }, description: 'Qué se guía (Type de Figma)' },
    frame: { control: 'radio', options: FRAME_OPTIONS, type: { name: 'enum', value: FRAME_OPTIONS }, description: 'Fotograma fijo (Transition de Figma)' },
    animated: { control: 'boolean', type: { name: 'boolean' }, description: 'Recorre los fotogramas en bucle; se apaga con prefers-reduced-motion' },
    label: { control: 'text', type: { name: 'string' }, description: 'Texto para lectores de pantalla (sin él es decorativo)' },
  },
  args: { type: 'face', frame: 2, animated: true },
  decorators: [
    (Story) => (
      <div className="bg-ds-background-container-default-on-canva p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScanGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const Static: Story = { args: { animated: false, frame: 1 } };

/** Las 9 variantes del set, cada una como fotograma fijo. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-container-default-on-canva p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de ScanGuide" className="max-w-full overflow-x-auto">
        <div className="grid grid-cols-[repeat(3,auto)] justify-start gap-x-6 gap-y-6">
          {VARIANTS.map(({ type, frame }) => (
            <div key={`${type}-${frame}`} className="flex flex-col items-start gap-ds-space-general-md">
              <span className="text-xs text-ds-text-neutral-body">
                {FIGMA_TYPE[type]} · {frame}
              </span>
              <ScanGuide data-figma={`Type=${FIGMA_TYPE[type]}, Transition=${frame}`} type={type} frame={frame} animated={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: con label es una imagen con nombre; sin label es decorativa. */
export const AccessibleNameTest: Story = {
  tags: ['!autodocs'],
  args: { label: 'Ubica tu rostro dentro del marco', animated: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: 'Ubica tu rostro dentro del marco' })).toBeInTheDocument();
  },
};

export const DecorativeTest: Story = {
  tags: ['!autodocs'],
  args: { type: 'id', animated: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('img')).toBeNull();
  },
};
