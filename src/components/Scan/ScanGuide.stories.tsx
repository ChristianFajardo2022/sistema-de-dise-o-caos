import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ScanGuide } from './ScanGuide';
import type { ScanGuideFrame, ScanGuideType } from './Scan.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Scan.doc';
import docsJson from './ScanGuide.docs.json';

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

// La página Docs de Scan la lleva ScanGuide y documenta también ScanPoints y ScanProgress (sus historias quedan sin
// página propia, con `tags: ['!autodocs']`)
const meta = {
  title: 'Feedback/Scan',
  component: ScanGuide,
  parameters: { layout: 'centered', docs: componentDocsParameters(doc, docsJson) },
  tags: ['autodocs'],
  // Tipos explícitos en las uniones: sin ellos Storybook descarta los args de la URL
  argTypes: argTypesFromDocsJson(docsJson, {
    type: { control: 'radio', options: TYPE_OPTIONS, type: { name: 'enum', value: TYPE_OPTIONS }, description: 'Qué se guía (Type de Figma)' },
    frame: { control: 'radio', options: FRAME_OPTIONS, type: { name: 'enum', value: FRAME_OPTIONS }, description: 'Fotograma fijo (Transition de Figma)' },
    animated: { control: 'boolean', type: { name: 'boolean' }, description: 'Recorre los fotogramas en bucle; se apaga con prefers-reduced-motion' },
    label: { control: 'text', type: { name: 'string' }, description: 'Texto para lectores de pantalla (sin él es decorativo)' },
  }),
  args: { type: 'face', frame: 2, animated: true },
  decorators: [
    // La guía mide 334 de ancho fijo: en lienzos angostos se recorta por los bordes (centrada) en vez de desbordar
    (Story) => (
      <div className="flex max-w-full justify-center overflow-hidden bg-ds-background-container-default-on-canva p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScanGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Alimenta el lienzo de Desarrollo: con `label`, el código muestra el uso accesible (receta R2). */
export const Interactive: Story = { args: { label: 'Ubica tu rostro dentro del marco' } };

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

/** Página de documentación (plantilla v2): encabezado, 3 pestañas y sus secciones. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Scan' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Scan en Figma:']);
    // Marcadores de la anatomía: uno por pauta (ScanGuide 5, ScanPoints 3, ScanProgress 5)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(13);
    // ScanPoints y ScanProgress van sobre la vista oscura de la cámara: sus tokens se leen en modo oscuro
    await expect(canvasElement.querySelectorAll('[data-doc-token-mode="dark"]').length).toBeGreaterThan(0);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de ScanGuide' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
