import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ChatDetailsGrid, ChatDetailsHeader, ChatDetailsLink, ChatDetailsPanel, ChatDetailsProfile } from './ChatDetailsPanel';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { Button } from '../Button';
import { FileCard } from '../FileCard';
import { Icon } from '../Icon';

const meta = {
  title: 'Data Display/ChatDetailsPanel',
  component: ChatDetailsPanel,
  subcomponents: { ChatDetailsHeader, ChatDetailsProfile, ChatDetailsLink, ChatDetailsGrid },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    collapsible: { control: 'boolean', type: { name: 'boolean' } },
    defaultCollapsed: { control: 'boolean', type: { name: 'boolean' } },
  },
  args: { 'aria-label': 'Detalles de la conversación', collapsible: true, defaultCollapsed: false },
} satisfies Meta<typeof ChatDetailsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const profileAvatar = (size: 'md' | 'sm' = 'md') => (
  <Avatar variant="photo" size={size} src={PHOTO_SRC.Woman_1} alt="" badge={size === 'md'} badgeState="success" badgeLabel="En línea" />
);

const photos = (count: number, label = 'Fotografía') =>
  Array.from({ length: count }, (_, i) => (
    <FileCard key={i} type="thumbnail" title={`${label} ${i + 1}`} selection="checkbox" className="size-auto aspect-square w-full" />
  ));

const documents = (count: number, title = (i: number) => `Documento ${i + 1}`, description = 'Tamaño de archivo: 23 KB') =>
  Array.from({ length: count }, (_, i) => (
    <FileCard key={i} type="icon" title={title(i)} description={description} selection="checkbox" />
  ));

const fileActions = (download = true) => (
  <>
    <Button iconOnly variant="secondary" size="xs" state="delete" aria-label="Eliminar seleccionados">
      <Icon name="trash" size={16} variant="fill" data-figma-part="Icon-sizes" />
    </Button>
    {download && (
      <Button iconOnly variant="secondary" size="xs" aria-label="Descargar seleccionados">
        <Icon name="download" size={16} variant="fill" data-figma-part="Icon-sizes" />
      </Button>
    )}
  </>
);

type View = 'profile' | 'documents' | 'photos';

/**
 * Panel navegable: perfil → Documentos o Fotografías → Anterior, y botón de plegar al riel. Cambiar de vista desmonta el
 * botón pulsado: al abrir una vista el foco pasa a "Anterior" y al volver, a la fila de la vista que se cerró.
 */
function PanelDemo(args: Partial<Parameters<typeof ChatDetailsPanel>[0]>) {
  const [view, setView] = useState<View>('profile');
  const backRef = useRef<HTMLButtonElement>(null);
  const linkRefs = { documents: useRef<HTMLElement>(null), photos: useRef<HTMLElement>(null) };
  const lastView = useRef<View>('profile');
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    if (view === 'profile') linkRefs[lastView.current as 'documents' | 'photos']?.current?.focus();
    else backRef.current?.focus();
    // Los refs son estables; solo importa el cambio de vista
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const go = (next: View) => {
    lastView.current = view === 'profile' ? next : view;
    moved.current = true;
    setView(next);
  };

  return (
    <ChatDetailsPanel aria-label="Detalles de la conversación" {...args} collapsible={view === 'profile'} className="h-[749px]">
      {({ collapsed }) =>
        collapsed ? (
          <>
            {profileAvatar('sm')}
            <div className="flex flex-col gap-ds-space-general-2xl">
              <ChatDetailsLink compact icon="folder">
                Documentos
              </ChatDetailsLink>
              <ChatDetailsLink compact icon="gallery">
                Fotografías
              </ChatDetailsLink>
            </div>
          </>
        ) : view === 'profile' ? (
          <>
            <ChatDetailsProfile avatar={profileAvatar()} name="Ana Pérez" description="Cliente desde 2021" />
            <ul className="m-0 list-none p-0">
              <ChatDetailsLink ref={linkRefs.documents} icon="folder" onClick={() => go('documents')}>
                Documentos
              </ChatDetailsLink>
              <ChatDetailsLink ref={linkRefs.photos} icon="gallery" onClick={() => go('photos')}>
                Fotografías
              </ChatDetailsLink>
            </ul>
            <ChatDetailsGrid aria-label="Fotografías recientes">{photos(10)}</ChatDetailsGrid>
          </>
        ) : (
          <>
            <ChatDetailsHeader backRef={backRef} onBack={() => go('profile')} actions={fileActions()} />
            <ChatDetailsGrid aria-label={view === 'documents' ? 'Documentos' : 'Fotografías'}>
              {view === 'documents' ? documents(8, (i) => `Factura ${i + 1}.pdf`) : photos(12)}
            </ChatDetailsGrid>
          </>
        )
      }
    </ChatDetailsPanel>
  );
}

/** Playground navegable. */
export const Interactive: Story = { render: (args) => <PanelDemo {...args} /> };

/** Riel plegado (Type4). */
export const Collapsed: Story = { args: { defaultCollapsed: true }, render: (args) => <PanelDemo {...args} /> };

const FIGMA: { name: string; render: (name: string) => ReactNode }[] = [
  {
    name: 'Type=Photo',
    render: (name) => (
      <ChatDetailsPanel data-figma={name} aria-label={`Panel ${name}`} collapsible className="h-[749px]">
        <ChatDetailsProfile avatar={profileAvatar()} name="Heading" description="Lorem ipsum dolor sit amet." />
        <ul data-figma-part="List" className="m-0 list-none p-0">
          <ChatDetailsLink icon="folder">Documentos</ChatDetailsLink>
          <ChatDetailsLink icon="gallery">Fotografías</ChatDetailsLink>
        </ul>
        <ChatDetailsGrid aria-label={`Fotografías ${name}`}>{photos(10)}</ChatDetailsGrid>
      </ChatDetailsPanel>
    ),
  },
  {
    name: 'Type=Type4',
    render: (name) => (
      <ChatDetailsPanel data-figma={name} aria-label={`Panel ${name}`} collapsible defaultCollapsed className="h-[749px]">
        {profileAvatar('sm')}
        <div className="flex flex-col gap-ds-space-general-2xl">
          <ChatDetailsLink compact icon="folder">
            Documentos
          </ChatDetailsLink>
          <ChatDetailsLink compact icon="gallery">
            Fotografías
          </ChatDetailsLink>
        </div>
      </ChatDetailsPanel>
    ),
  },
  {
    name: 'Type=Document',
    render: (name) => (
      <ChatDetailsPanel data-figma={name} aria-label={`Panel ${name}`} className="h-[749px]">
        <ChatDetailsHeader onBack={() => {}} backLabel="Button" />
        <ChatDetailsGrid aria-label={`Documentos ${name}`}>{documents(8, () => 'Titulo')}</ChatDetailsGrid>
      </ChatDetailsPanel>
    ),
  },
  {
    name: 'Type=Phot',
    render: (name) => (
      <ChatDetailsPanel data-figma={name} aria-label={`Panel ${name}`} className="h-[749px]">
        <ChatDetailsHeader onBack={() => {}} />
        <ChatDetailsGrid aria-label={`Fotografías ${name}`}>{photos(10)}</ChatDetailsGrid>
      </ChatDetailsPanel>
    ),
  },
  {
    name: 'Type=Type6',
    render: (name) => (
      <ChatDetailsPanel
        data-figma={name}
        aria-label={`Panel ${name}`}
        className="h-[749px] gap-ds-space-general-4xl [box-shadow:inset_0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-default-on-canva),var(--shadow-ds-on-canva-md)]"
      >
        <ChatDetailsHeader onBack={() => {}} actions={fileActions()} />
        <ChatDetailsGrid aria-label={`Documentos ${name}`}>{documents(8, () => 'Titulo')}</ChatDetailsGrid>
      </ChatDetailsPanel>
    ),
  },
  {
    name: 'Type=Type5',
    render: (name) => (
      <ChatDetailsPanel
        data-figma={name}
        aria-label={`Panel ${name}`}
        className="h-[749px] [box-shadow:inset_0_0_0_var(--ds-responsive-border-general-lg)_var(--color-ds-border-general-default-on-canva),var(--shadow-ds-on-canva-md)]"
      >
        {/* La segunda acción de Figma usa "Icon-primitive" (9248:39), que no está en la biblioteca: se omite */}
        <ChatDetailsHeader onBack={() => {}} actions={fileActions(false)} />
        <ChatDetailsGrid aria-label={`Fotografías ${name}`}>{photos(10)}</ChatDetailsGrid>
      </ChatDetailsPanel>
    ),
  },
];

/**
 * Las seis variantes de Figma (320×749; el riel, 64). Type6 y Type5 traen en Figma un trazo de 1 que las demás no tienen
 * (y Type6 un gap de 32): se reproducen con `className`, no con una prop.
 */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de ChatDetailsPanel" className="max-w-full overflow-x-auto">
        <div className="flex w-max items-start gap-6">
          {FIGMA.map((v) => (
            <div key={v.name}>{v.render(v.name)}</div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: aside con nombre, botón de plegar con aria-expanded, filas como botones, vuelta atrás y foco al cambiar de vista. */
export const NavigationTest: Story = {
  tags: ['!autodocs'],
  args: { onCollapsedChange: fn() },
  render: (args) => <PanelDemo {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('complementary', { name: 'Detalles de la conversación' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 2, name: 'Ana Pérez' })).toBeInTheDocument();
    const toggle = canvas.getByRole('button', { name: 'Ocultar detalles' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    // Región de fotos con nombre (una sola vez: la lista de dentro no lo repite)
    await expect(canvas.getByRole('region', { name: 'Fotografías recientes' })).toBeInTheDocument();
    await expect(canvas.queryByRole('list', { name: 'Fotografías recientes' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Documentos' }));
    await expect(canvas.getByRole('region', { name: 'Documentos' })).toBeInTheDocument();
    // La fila pulsada desaparece: el foco pasa a "Anterior"
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Anterior' })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Anterior' }));
    // Al volver, a la fila de la vista que se cerró
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Documentos' })).toHaveFocus());
    await userEvent.click(canvas.getByRole('button', { name: 'Ocultar detalles' }));
    await expect(args.onCollapsedChange).toHaveBeenCalledWith(true);
    const expand = canvas.getByRole('button', { name: 'Mostrar detalles' });
    await expect(expand).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByRole('button', { name: 'Fotografías' })).toBeInTheDocument();
  },
};
