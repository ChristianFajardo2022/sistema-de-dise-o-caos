import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Modal, ModalPanel } from './Modal';
import type { ModalProps } from './Modal.types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import { DropdownMenuItem } from '../DropdownMenu';
import { InteractiveCard } from '../InteractiveCard';
import { ListItem } from '../ListItem';
import { ProfileCard } from '../ProfileCard';
import { Tag } from '../Tag';

const SURFACE = 'bg-ds-background-general-black';
const LABEL = 'font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm text-ds-text-neutral-gray';
const SECTION_TITLE = [
  'm-0 font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-heading',
].join(' ');

type DemoArgs = ModalProps & { withTertiary?: boolean };

const meta = {
  title: 'Overlays/Modal',
  component: Modal,
  subcomponents: { ModalPanel },
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    lateral: { control: 'boolean', type: { name: 'boolean' }, description: 'Lateral de Figma: panel lateral derecho' },
    title: { control: 'text', type: { name: 'string' }, description: 'Heading de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Description2 de Figma' },
    closable: { control: 'boolean', type: { name: 'boolean' }, description: 'Icon close de Figma' },
    closeOnBackdrop: { control: 'boolean', type: { name: 'boolean' } },
    withTertiary: { control: 'boolean', type: { name: 'boolean' }, description: 'Btn tertiary de Figma (solo en la historia)' },
  },
  args: {
    lateral: false,
    title: 'Mover a una carpeta',
    description: 'Elige el destino de los archivos.',
    icon: 'notification',
    closable: true,
    closeOnBackdrop: true,
    withTertiary: false,
  },
} satisfies Meta<DemoArgs>;

export default meta;
type Story = StoryObj<DemoArgs>;

const folder = <Avatar variant="icon" size="sm" />;
const menuItems = [
  <DropdownMenuItem key="dup" type="icon" icon="add-circle">
    Duplicar
  </DropdownMenuItem>,
];

/** Contenido de ejemplo: un grupo de tarjetas de radio y una lista (componentes de CAOS en el slot). */
function FolderPicker({ titles = ['Proyectos', 'Archivo'] }: { titles?: string[] }) {
  const [value, setValue] = useState(titles[0].toLowerCase());
  return (
    <>
      <fieldset className="m-0 flex flex-col gap-ds-space-general-2xl border-0 p-0">
        <legend className="sr-only">Carpeta de destino</legend>
        {titles.map((t) => (
          <InteractiveCard
            key={t}
            name="carpeta"
            value={t.toLowerCase()}
            title={t}
            subtitle="12 archivos"
            leading={folder}
            checked={value === t.toLowerCase()}
            onChange={(event) => setValue(event.target.value)}
          />
        ))}
      </fieldset>
      <ul role="list" aria-label="Archivos" className="m-0 p-0">
        <ListItem variant="simple" title="Informe trimestral" description="PDF" selectable onEdit={() => {}} onDelete={() => {}} menu={menuItems} />
        <ListItem variant="simple" title="Presupuesto" description="Hoja de cálculo" selectable onEdit={() => {}} onDelete={() => {}} menu={menuItems} />
      </ul>
    </>
  );
}

function Demo({ withTertiary, ...args }: DemoArgs) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Abrir modal
      </Button>
      <Modal
        {...args}
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          args.onOpenChange?.(next);
        }}
        primaryAction={{ label: 'Mover', onClick: args.primaryAction?.onClick }}
        secondaryAction={{ label: 'Cancelar' }}
        tertiaryAction={withTertiary ? { label: 'Nueva carpeta', onClick: (event) => event.preventDefault() } : undefined}
      >
        <FolderPicker titles={args.lateral ? ['Proyectos', 'Archivo', 'Compartido'] : undefined} />
      </Modal>
    </>
  );
}

/** Preview con controles: el botón abre el modal (centrado o lateral). */
export const Interactive: Story = {
  render: (args) => <Demo {...args} />,
};

/** Lateral: panel derecho a todo el alto con el contenido desplazable; en móvil, hoja inferior. */
export const Lateral: Story = {
  args: { lateral: true, withTertiary: true },
  render: (args) => <Demo {...args} />,
};

// ——— FigmaMatrix: las dos variantes con el contenido de ejemplo de Figma ———

// Los textos de Figma se llaman como su contenido: el comparador los busca por `data-figma-part`
const FIGMA_DESCRIPTION = <span data-figma-part="Lorem ipsum dolor sit amet.">Lorem ipsum dolor sit amet.</span>;
const LOREM = 'Lorem ipsum dolor sit amet consectetur. Tempus ornare maecenas integer viverra vitae faucibus. ';

function FigmaCards({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-ds-space-general-2xl">
      {Array.from({ length: count }, (_, i) => (
        <InteractiveCard key={i} name={`figma-${count}`} value={String(i)} title="Título" subtitle="Subtítulo" leading={folder} />
      ))}
    </div>
  );
}

function FigmaList({ variant, count }: { variant: 'simple' | 'complex'; count: number }) {
  return (
    <ul role="list" className="m-0 p-0">
      {Array.from({ length: count }, (_, i) => (
        <ListItem
          key={i}
          variant={variant}
          title="Nombre del item"
          description="Descripción"
          category={variant === 'complex' ? 'Categoría' : undefined}
          leading={variant === 'complex' ? folder : undefined}
          selectable
          onEdit={() => {}}
          onDelete={() => {}}
          menu={menuItems}
        />
      ))}
    </ul>
  );
}

function FigmaProfiles() {
  return (
    <div className="grid grid-cols-2 gap-ds-space-general-2xl">
      {[0, 1].map((i) => (
        <ProfileCard
          key={i}
          layout="vertical"
          title="Titulo"
          subtitle={['Bogotá D.C', 'Bogotá D.C']}
          description={LOREM}
          rating={4.5}
          leading={<Avatar variant="photo" size="lg" src={PHOTO_SRC.Woman_1} />}
          tags={
            <>
              <Tag iconLeft={false}>
                <span data-figma-part="Text">Text</span>
              </Tag>
              <Tag iconLeft={false}>
                <span data-figma-part="Text">Text</span>
              </Tag>
            </>
          }
          selection="checkbox"
          selectionLabel={`Elegir perfil ${i + 1}`}
          headingLevel={4}
        />
      ))}
    </div>
  );
}

const figmaActions = (tertiary: boolean) => ({
  primaryAction: { label: 'Button' },
  secondaryAction: { label: 'Button' },
  tertiaryAction: tertiary ? { label: 'Button' } : undefined,
});

/** Las dos variantes del set de Figma (superficie suelta, sin diálogo). */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className={`flex w-fit flex-wrap items-start gap-10 p-6 ${SURFACE}`}>
      <div className="flex flex-col gap-ds-space-general-lg">
        <span className={LABEL}>Lateral=on</span>
        <div className="h-[1080px]">
          <ModalPanel
            data-figma="Lateral=on"
            lateral
            title="Heading"
            description={FIGMA_DESCRIPTION}
            icon="notification"
            onClose={() => {}}
            {...figmaActions(true)}
          >
            <FigmaCards count={3} />
            <section className="flex flex-col gap-ds-space-general-2xl">
              <h3 className={SECTION_TITLE}>Heading</h3>
              <FigmaProfiles />
            </section>
            <section className="flex flex-col gap-ds-space-general-2xl">
              <h3 className={SECTION_TITLE}>Heading</h3>
              <FigmaList variant="complex" count={4} />
            </section>
          </ModalPanel>
        </div>
      </div>
      <div className="flex flex-col gap-ds-space-general-lg">
        <span className={LABEL}>Lateral=off</span>
        <ModalPanel
          data-figma="Lateral=off"
          title="Heading"
          description={FIGMA_DESCRIPTION}
          icon="notification"
          onClose={() => {}}
          {...figmaActions(false)}
        >
          <FigmaCards count={2} />
          <FigmaList variant="simple" count={2} />
        </ModalPanel>
      </div>
    </div>
  ),
};

/** Test: rol y nombre, foco inicial en el título, botón cerrar, Escape y retorno del foco. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { onOpenChange: fn() },
  render: (args) => <Demo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Abrir modal' });
    await userEvent.click(trigger);

    const dialog = await canvas.findByRole('dialog', { name: 'Mover a una carpeta' });
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await expect(dialog).toHaveAccessibleDescription('Elige el destino de los archivos.');
    const modal = within(dialog);
    await expect(modal.getByRole('heading', { name: 'Mover a una carpeta' })).toHaveFocus();

    // Tab: primero el cerrar (Button corner), después el contenido
    await userEvent.tab();
    await expect(modal.getByRole('button', { name: 'Cerrar' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveFocus();
    await expect(document.documentElement.style.overflow).toBe('');
  },
};

/** Test: lateral con su cerrar de 24; la acción cierra y la que llama a `preventDefault` no. */
export const LateralTest: Story = {
  tags: ['!autodocs'],
  args: { lateral: true, withTertiary: true, primaryAction: { label: 'Mover', onClick: fn() } },
  render: (args) => <Demo {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Abrir modal' });
    await userEvent.click(trigger);
    const dialog = await canvas.findByRole('dialog', { name: 'Mover a una carpeta' });
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await expect(document.documentElement.style.overflow).toBe('hidden');
    const modal = within(dialog);
    // Lateral: la fila Close va antes del encabezado (Shift+Tab desde el título)
    await expect(modal.getByRole('heading', { name: 'Mover a una carpeta' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(modal.getByRole('button', { name: 'Cerrar' })).toHaveFocus();

    // Tertiary con preventDefault: sigue abierto
    await userEvent.click(modal.getByRole('button', { name: 'Nueva carpeta' }));
    await expect(dialog).toHaveAttribute('open');

    // Primary: llama a onClick y cierra
    await userEvent.click(modal.getByRole('button', { name: 'Mover' }));
    await expect(args.primaryAction?.onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));

    // Cerrar del panel lateral
    await userEvent.click(trigger);
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await userEvent.click(modal.getByRole('button', { name: 'Cerrar' }));
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    await expect(trigger).toHaveFocus();
  },
};
