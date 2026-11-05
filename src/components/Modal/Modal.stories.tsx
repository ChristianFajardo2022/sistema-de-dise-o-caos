import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Modal, ModalPanel } from './Modal';
import { doc } from './Modal.doc';
import docsJson from './Modal.docs.json';
import type { ModalProps } from './Modal.types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import { DropdownMenuItem } from '../DropdownMenu';
import { InteractiveCard } from '../InteractiveCard';
import { ListItem } from '../ListItem';
import { ProfileCard } from '../ProfileCard';
import { Tag } from '../Tag';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { formatLiteral } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';

const SURFACE = 'bg-ds-background-general-black';
const LABEL = 'font-ds-primitives-typography-family-primary text-ds-primitives-typography-size-sm text-ds-text-neutral-gray';
const SECTION_TITLE = [
  'm-0 font-ds-primitives-typography-family-secondary [font-weight:var(--ds-primitives-typography-weight-semibold)]',
  'text-ds-typography-heading-size-md leading-ds-typography-heading-line-height-md text-ds-text-neutral-heading',
].join(' ');

const ICON_OPTIONS = ['notification', 'info-circle', 'folder', 'document-text'];

type DemoArgs = ModalProps & { withTertiary?: boolean };

/** Valor de una prop escrito como en JSX. */
const jsxProp = (name: string, value: unknown) =>
  typeof value === 'string' ? `${name}="${value.replace(/"/g, '&quot;')}"` : value === true ? name : `${name}={${formatLiteral(value)}}`;

/**
 * Código de Desarrollo: el mismo modal del lienzo con su estado y los manejadores definidos, listo para copiar. El
 * código generado omite las funciones, así que las acciones se escriben aquí (receta R5).
 */
function docsCode(args: Record<string, unknown>) {
  const { primaryAction: _p, secondaryAction: _s, tertiaryAction: _t, children: _c, open: _o, defaultOpen: _d, withTertiary: _w, ...rest } = args;
  const props = [
    'open={open}',
    'onOpenChange={setOpen}',
    ...Object.entries(rest).map(([name, value]) => jsxProp(name, value)),
    "primaryAction={{ label: 'Mover', onClick: moveFiles }}",
    "secondaryAction={{ label: 'Cancelar' }}",
    "tertiaryAction={{ label: 'Nueva carpeta', onClick: createFolder }}",
  ];
  return [
    'const [open, setOpen] = useState(false);',
    '',
    '// Tras onClick el modal se cierra, salvo que llames a event.preventDefault()',
    'const moveFiles = () => { /* mueve los archivos */ };',
    'const createFolder = (event) => {',
    '  event.preventDefault(); // el modal sigue abierto',
    '  /* crea la carpeta */',
    '};',
    '',
    '<Button onClick={() => setOpen(true)}>Abrir modal</Button>',
    '<Modal',
    ...props.map((p) => `  ${p}`),
    '>',
    '  <p>Los archivos elegidos pasan al nuevo destino.</p>',
    '</Modal>',
  ].join('\n');
}

const meta = {
  title: 'Overlays/Modal',
  component: Modal,
  subcomponents: { ModalPanel },
  parameters: {
    layout: 'centered',
    // Apertura y cierre son del diálogo, que el lienzo no abre: esas props quedan solo en la tabla Props
    docs: componentDocsParameters(doc, docsJson),
    // El lienzo es la historia Interactive: un botón abre el Modal real; el código lleva el estado y los manejadores
    docsLive: { code: docsCode, exclude: ['open', 'defaultOpen'] },
  },
  tags: ['autodocs'],
  // Las descripciones salen de Modal.docs.json; aquí solo los controles y los tipos explícitos
  argTypes: argTypesFromDocsJson(docsJson, {
    lateral: { control: 'boolean', type: { name: 'boolean' } },
    title: { control: 'text', type: { name: 'string' } },
    description: { control: 'text', type: { name: 'string' } },
    icon: { control: 'select', options: ICON_OPTIONS, type: { name: 'enum', value: ICON_OPTIONS } },
    headingLevel: { control: 'radio', options: [2, 3, 4], type: { name: 'enum', value: [2, 3, 4] } },
    closable: { control: 'boolean', type: { name: 'boolean' } },
    closeOnBackdrop: { control: 'boolean', type: { name: 'boolean' } },
  }),
  args: {
    lateral: false,
    title: 'Mover a una carpeta',
    description: 'Elige el destino de los archivos.',
    icon: 'notification',
    closable: true,
    closeOnBackdrop: true,
    withTertiary: true,
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

/** Página de documentación (plantilla v2): la revisan vitest y axe. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Modal' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    // Sin los títulos de los paneles de ejemplo, que también son h2 (`data-figma-part`)
    const h2 = () =>
      canvas
        .getAllByRole('heading', { level: 2 })
        .filter((h) => !h.hasAttribute('data-figma-part'))
        .map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Modal en Figma:']);
    // Marcadores de la anatomía: uno por pauta (6 del modal centrado + 5 del lateral)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(11);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Modal' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
