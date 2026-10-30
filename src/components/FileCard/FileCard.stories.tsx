import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { FileCard } from './FileCard';
import type { FileCardProps, FileCardSelection, FileCardState, FileCardType } from './FileCard.types';
import { Tag } from '../Tag';

const TYPES: FileCardType[] = ['photo', 'icon', 'thumbnail'];
const STATES: FileCardState[] = ['default', 'hover', 'select'];
const SELECTIONS: FileCardSelection[] = ['checkbox', 'radio'];

/**
 * Marcador de foto: el sistema no trae una imagen de muestra para esta tarjeta (Figma solo dibuja el Avatar icon).
 * Es un degradado plano generado aquí, no una foto.
 */
const PHOTO_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 344 160'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2361a7f2'/%3E%3Cstop offset='1' stop-color='%23004999'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='344' height='160' fill='url(%23g)'/%3E%3C/svg%3E";

const meta = {
  title: 'Data Display/FileCard',
  component: FileCard,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: TYPES,
      type: { name: 'enum', value: TYPES },
      // Figma: thumbnail = set 15005:15958
      description: 'Type de Figma; thumbnail = otro set de Figma (miniatura)',
    },
    title: { control: 'text', type: { name: 'string' }, description: 'Props Title text / Tittle de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Capa Status de Figma' },
    selection: {
      control: 'select',
      options: [undefined, ...SELECTIONS],
      type: { name: 'enum', value: SELECTIONS },
      description: 'Props Select / Radio button de Figma',
    },
    state: {
      control: 'select',
      options: [undefined, ...STATES],
      type: { name: 'enum', value: STATES },
      description: 'State forzado, solo para documentación',
    },
    disabled: { control: 'boolean', type: { name: 'boolean' } },
    src: { control: 'text', type: { name: 'string' } },
  },
  args: {
    type: 'icon',
    title: 'Informe trimestral.pdf',
    description: 'Tamaño de archivo: 1,2 MB',
  },
  decorators: [
    (Story) => (
      <div className="bg-ds-background-general-black p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: { selection: 'checkbox' },
  render: (args: FileCardProps) => (
    <div className={args.type === 'thumbnail' ? '' : args.type === 'photo' ? 'w-full max-w-[344px]' : 'w-full max-w-[498px]'}>
      <FileCard {...args} onMoreClick={fn()} onDownload={fn()} onDelete={fn()} />
    </div>
  ),
};

// Figma: 14043:59452
/** Set de Figma: cada variante una vez, con los textos de Figma. */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [],
  render: () => (
    <div className="flex max-w-full flex-col gap-6 bg-ds-background-general-black p-6">
      <div className="flex flex-wrap gap-6">
        {STATES.map((s) => (
          <div key={s} className="flex w-full max-w-[344px] flex-col gap-2">
            <span className="text-xs text-ds-text-neutral-body">Type=Photo, State={s}</span>
            <FileCard
              type="photo"
              state={s}
              title="Titulo"
              description="Tamaño de archivo: 23 KB"
              onMoreClick={() => {}}
              data-figma={`Type=Photo, State=${s[0].toUpperCase()}${s.slice(1)}`}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-6">
        {STATES.map((s) => (
          <div key={s} className="flex w-full max-w-[498px] flex-col gap-2">
            <span className="text-xs text-ds-text-neutral-body">Type=Icon, State={s}</span>
            <FileCard
              type="icon"
              state={s}
              title="Titulo"
              description="Tamaño de archivo: 23 KB"
              selection="checkbox"
              defaultChecked={s === 'select'}
              data-figma={`Type=Icon, State=${s[0].toUpperCase()}${s.slice(1)}`}
            />
          </div>
        ))}
      </div>
    </div>
  ),
};

// Figma: 15005:15958
/** Set de Figma (miniatura): cada variante una vez. */
export const FigmaMatrixThumbnail: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [],
  render: () => (
    <div className="flex max-w-full flex-wrap gap-6 bg-ds-background-general-black p-6">
      {STATES.map((s) => (
        <div key={s} className="flex flex-col gap-2">
          <span className="text-xs text-ds-text-neutral-body">State={s}</span>
          <FileCard
            type="thumbnail"
            state={s}
            title="Titulo"
            selection="checkbox"
            defaultChecked={s === 'select'}
            onDownload={() => {}}
            onDelete={() => {}}
            data-figma={`Type=Icon, State=${s[0].toUpperCase()}${s.slice(1)}`}
          />
        </div>
      ))}
    </div>
  ),
};

/** Photo con foto (`src`). La imagen es un marcador: el sistema no incluye fotos de muestra. */
export const WithPhoto: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-full max-w-[344px]">
        <FileCard
          type="photo"
          title="Portada de campaña.png"
          description="Tamaño de archivo: 840 KB"
          src={PHOTO_PLACEHOLDER}
          onMoreClick={() => {}}
        />
      </div>
      <FileCard type="thumbnail" title="Portada de campaña.png" src={PHOTO_PLACEHOLDER} selection="checkbox" />
    </div>
  ),
};

function SelectionDemo() {
  const files = ['Contrato firmado.pdf', 'Anexo técnico.docx', 'Presupuesto 2027.xlsx'];
  const [selected, setSelected] = useState<string[]>([files[0]]);
  return (
    <div className="flex w-full max-w-[498px] flex-col gap-4">
      <p className="m-0 text-sm text-ds-text-neutral-body" data-testid="count">
        {selected.length} seleccionados
      </p>
      {files.map((f) => (
        <FileCard
          key={f}
          type="icon"
          title={f}
          description="Tamaño de archivo: 23 KB"
          selection="checkbox"
          checked={selected.includes(f)}
          onCheckedChange={(on) => setSelected((prev) => (on ? [...prev, f] : prev.filter((x) => x !== f)))}
        />
      ))}
    </div>
  );
}

/** Selección múltiple controlada: el Checkbox es un input real con el título como nombre. */
export const MultipleSelection: Story = {
  render: () => <SelectionDemo />,
};

/** Elección única: con `selection="radio"` y el mismo `name`, las flechas mueven la selección. */
export const SingleSelection: Story = {
  render: () => (
    <fieldset className="m-0 flex w-full max-w-[498px] flex-col gap-4 border-0 p-0">
      <legend className="mb-2 text-sm text-ds-text-neutral-body">Archivo principal</legend>
      <FileCard type="icon" title="Versión A.pdf" description="Tamaño de archivo: 23 KB" selection="radio" name="principal" value="a" defaultChecked />
      <FileCard type="icon" title="Versión B.pdf" description="Tamaño de archivo: 25 KB" selection="radio" name="principal" value="b" />
    </fieldset>
  ),
};

/** Miniaturas: Descargar y Eliminar aparecen con hover o al llegar con Tab. */
export const Thumbnails: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {['Plano planta baja.png', 'Plano planta alta.png', 'Fachada.png'].map((f) => (
        <FileCard key={f} type="thumbnail" title={f} selection="checkbox" onDownload={() => {}} onDelete={() => {}} />
      ))}
    </div>
  ),
};

/** Contenido extra (slots de Figma) como `children`. */
export const WithChildren: Story = {
  render: () => (
    <div className="w-[344px]">
      <FileCard type="photo" title="Brief de marca.pdf" description="Tamaño de archivo: 2,4 MB" onMoreClick={() => {}}>
        <div className="flex gap-2">
          <Tag type="success" size="sm" iconLeft={false}>
            Aprobado
          </Tag>
          <Tag type="neutral" size="sm" iconLeft={false}>
            PDF
          </Tag>
        </div>
      </FileCard>
    </div>
  ),
};

// ─────────────────────── tests ───────────────────────

export const TestCheckbox: Story = {
  tags: ['!autodocs'],
  render: () => <SelectionDemo />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const box = c.getByRole('checkbox', { name: 'Anexo técnico.docx' });
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
    await expect(c.getByTestId('count')).toHaveTextContent('2 seleccionados');
    // Teclado: Espacio en el input enfocado
    box.focus();
    await userEvent.keyboard(' ');
    await expect(box).not.toBeChecked();
  },
};

export const TestRadio: Story = {
  tags: ['!autodocs'],
  render: SingleSelection.render,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const a = c.getByRole('radio', { name: 'Versión A.pdf' });
    const b = c.getByRole('radio', { name: 'Versión B.pdf' });
    await expect(a).toBeChecked();
    a.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(b).toBeChecked();
    await expect(a).not.toBeChecked();
  },
};

export const TestActions: Story = {
  tags: ['!autodocs'],
  args: { onMoreClick: fn(), onDownload: fn(), onDelete: fn() },
  render: (args: FileCardProps) => (
    <div className="flex items-start gap-6">
      <div className="w-[344px]">
        <FileCard type="photo" title="Portada.png" description="Tamaño de archivo: 23 KB" onMoreClick={args.onMoreClick} />
      </div>
      <FileCard type="thumbnail" title="Foto 01.jpg" onDownload={args.onDownload} onDelete={args.onDelete} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    // Cada acción se nombra con el archivo, como ListItem (no "Descargar, Descargar…" en una lista)
    const more = c.getByRole('button', { name: 'Más opciones de Portada.png' });
    await expect(more).not.toHaveAttribute('aria-describedby');
    await userEvent.click(more);
    await expect(args.onMoreClick).toHaveBeenCalledTimes(1);
    const download = c.getByRole('button', { name: 'Descargar Foto 01.jpg' });
    const del = c.getByRole('button', { name: 'Eliminar Foto 01.jpg' });
    // Con Tab las acciones de la miniatura se vuelven visibles (foco dentro)
    download.focus();
    const overlay = download.parentElement as HTMLElement;
    await waitFor(() => expect(getComputedStyle(overlay).opacity).toBe('1'));
    await userEvent.click(download);
    await userEvent.click(del);
    await expect(args.onDownload).toHaveBeenCalledTimes(1);
    await expect(args.onDelete).toHaveBeenCalledTimes(1);
  },
};

/** `onCheckedChange` recibe solo el valor; el evento y el `ref` del input llegan por `selectionProps`. */
export const TestSelectionProps: Story = {
  tags: ['!autodocs'],
  args: { onCheckedChange: fn(), selectionProps: { onChange: fn(), 'data-testid': 'seleccion' } as FileCardProps['selectionProps'] },
  render: (args: FileCardProps) => (
    <div className="w-[498px]">
      <FileCard
        type="icon"
        title="Acta.pdf"
        selection="checkbox"
        onCheckedChange={args.onCheckedChange}
        selectionProps={args.selectionProps}
      />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const c = within(canvasElement);
    const box = c.getByRole('checkbox', { name: 'Acta.pdf' });
    await expect(box).toBe(c.getByTestId('seleccion'));
    await userEvent.click(box);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
    await expect(args.selectionProps?.onChange).toHaveBeenCalledTimes(1);
  },
};
