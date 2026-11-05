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
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './ChatDetailsPanel.doc';
import docsJson from './ChatDetailsPanel.docs.json';

const meta = {
  title: 'Data Display/ChatDetailsPanel',
  component: ChatDetailsPanel,
  subcomponents: { ChatDetailsHeader, ChatDetailsProfile, ChatDetailsLink, ChatDetailsGrid },
  parameters: {
    layout: 'padded',
    docs: componentDocsParameters(doc, docsJson),
    // El lienzo maneja la vista y el plegado (R6); el código trae ese estado, los manejadores y el contenido (R2)
    docsLive: { code: docsCode, exclude: ['children', 'collapsed', 'defaultCollapsed', 'onCollapsedChange'] },
  },
  tags: ['autodocs'],
  argTypes: {
    ...argTypesFromDocsJson(docsJson),
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
type Section = Exclude<View, 'profile'>;

/**
 * Panel navegable: perfil → Documentos o Fotografías → Anterior, y botón de plegar al riel (si `collapsible`). Los accesos
 * del riel despliegan el panel y abren su vista. Cambiar de vista desmonta el botón pulsado: al abrir una vista el foco
 * pasa a "Anterior" y al volver, a la fila de la vista que se cerró. Es lo mismo que escribe `docsCode`.
 */
function PanelDemo({ collapsible = false, defaultCollapsed = false, onCollapsedChange, ...args }: Partial<Parameters<typeof ChatDetailsPanel>[0]>) {
  const [view, setView] = useState<View>('profile');
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const backRef = useRef<HTMLButtonElement>(null);
  const linkRefs = { documents: useRef<HTMLElement>(null), photos: useRef<HTMLElement>(null) };
  const opened = useRef<Section>('documents');
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    if (view === 'profile') linkRefs[opened.current].current?.focus();
    else backRef.current?.focus();
    // Los refs son estables; solo importa el cambio de vista
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const changeCollapsed = (next: boolean) => {
    setCollapsed(next);
    onCollapsedChange?.(next);
  };
  const openView = (next: Section) => {
    opened.current = next;
    moved.current = true;
    if (collapsed) changeCollapsed(false);
    setView(next);
  };
  const backToProfile = () => {
    moved.current = true;
    setView('profile');
  };

  return (
    <ChatDetailsPanel
      aria-label="Detalles de la conversación"
      {...args}
      collapsible={collapsible && view === 'profile'}
      collapsed={collapsible && collapsed}
      onCollapsedChange={changeCollapsed}
      className="h-[749px]"
    >
      {collapsible && collapsed ? (
        <>
          {profileAvatar('sm')}
          <div className="flex flex-col gap-ds-space-general-2xl">
            <ChatDetailsLink compact icon="folder" onClick={() => openView('documents')}>
              Documentos
            </ChatDetailsLink>
            <ChatDetailsLink compact icon="gallery" onClick={() => openView('photos')}>
              Fotografías
            </ChatDetailsLink>
          </div>
        </>
      ) : view === 'profile' ? (
        <>
          <ChatDetailsProfile avatar={profileAvatar()} name="Ana Pérez" description="Disponible para conversar" />
          <ul className="m-0 list-none p-0">
            <ChatDetailsLink ref={linkRefs.documents} icon="folder" onClick={() => openView('documents')}>
              Documentos
            </ChatDetailsLink>
            <ChatDetailsLink ref={linkRefs.photos} icon="gallery" onClick={() => openView('photos')}>
              Fotografías
            </ChatDetailsLink>
          </ul>
          <ChatDetailsGrid aria-label="Fotografías recientes">{photos(10)}</ChatDetailsGrid>
        </>
      ) : (
        <>
          <ChatDetailsHeader backRef={backRef} onBack={backToProfile} actions={fileActions()} />
          <ChatDetailsGrid aria-label={view === 'documents' ? 'Documentos' : 'Fotografías'}>
            {view === 'documents' ? documents(8, (i) => `Documento ${i + 1}.pdf`) : photos(12)}
          </ChatDetailsGrid>
        </>
      )}
    </ChatDetailsPanel>
  );
}

/** Una prop JSX con su valor de Personalizar. */
const jsxProp = (name: string, value: unknown) =>
  typeof value === 'string' ? `${name}="${value.replace(/"/g, '&quot;')}"` : value === true ? name : `${name}={${JSON.stringify(value)}}`;

/**
 * Código de Desarrollo (R2), listo para copiar (la plantilla pone la importación encima): el mismo panel del lienzo, con
 * el perfil, las vistas de documentos y fotografías, el foco al cambiar de vista y, con `collapsible`, el riel con sus
 * accesos compactos. La foto es una URL de ejemplo: cámbiala por la de la persona. Sin genéricos (`useRef<…>`): la
 * plantilla toma cada `<Nombre` del código como un componente que importar.
 */
function docsCode(args: Record<string, unknown>) {
  const { collapsible, children: _children, collapsed: _collapsed, defaultCollapsed: _default, onCollapsedChange: _change, ...rest } = args;
  const foldable = collapsible === true;
  const props = [
    ...Object.entries(rest).map(([name, value]) => jsxProp(name, value)),
    ...(foldable ? ["collapsible={view === 'profile'}", 'collapsed={collapsed}', 'onCollapsedChange={setCollapsed}'] : []),
    'className="h-[749px]"',
  ];
  const ind = (n: number, lines: string[]) => lines.map((l) => (l ? ' '.repeat(n) + l : l));
  const profile = [
    '<>',
    '  <ChatDetailsProfile',
    '    avatar={<Avatar variant="photo" size="md" src={photo} alt="" badge badgeState="success" badgeLabel="En línea" />}',
    '    name="Ana Pérez"',
    '    description="Disponible para conversar"',
    '  />',
    '  <ul className="m-0 list-none p-0">',
    '    <ChatDetailsLink ref={documentsRef} icon="folder" onClick={() => openView(\'documents\')}>',
    '      Documentos',
    '    </ChatDetailsLink>',
    '    <ChatDetailsLink ref={photosRef} icon="gallery" onClick={() => openView(\'photos\')}>',
    '      Fotografías',
    '    </ChatDetailsLink>',
    '  </ul>',
    '  <ChatDetailsGrid aria-label="Fotografías recientes">',
    '    {photos.map((title) => (',
    '      <FileCard key={title} type="thumbnail" title={title} selection="checkbox" className="size-auto aspect-square w-full" />',
    '    ))}',
    '  </ChatDetailsGrid>',
    '</>',
  ];
  const files = [
    '<>',
    '  <ChatDetailsHeader',
    '    backRef={backRef}',
    '    onBack={backToProfile}',
    '    actions={',
    '      <>',
    '        <Button iconOnly variant="secondary" size="xs" state="delete" aria-label="Eliminar seleccionados">',
    '          <Icon name="trash" size={16} variant="fill" />',
    '        </Button>',
    '        <Button iconOnly variant="secondary" size="xs" aria-label="Descargar seleccionados">',
    '          <Icon name="download" size={16} variant="fill" />',
    '        </Button>',
    '      </>',
    '    }',
    '  />',
    "  <ChatDetailsGrid aria-label={view === 'documents' ? 'Documentos' : 'Fotografías'}>",
    "    {view === 'documents'",
    '      ? documents.map((title) => <FileCard key={title} type="icon" title={title} description="Tamaño de archivo: 23 KB" selection="checkbox" />)',
    '      : photos.map((title) => (',
    '          <FileCard key={title} type="thumbnail" title={title} selection="checkbox" className="size-auto aspect-square w-full" />',
    '        ))}',
    '  </ChatDetailsGrid>',
    '</>',
  ];
  const rail = [
    '<>',
    '  <Avatar variant="photo" size="sm" src={photo} alt="" />',
    '  <div className="flex flex-col gap-ds-space-general-2xl">',
    "    <ChatDetailsLink compact icon=\"folder\" onClick={() => openView('documents')}>",
    '      Documentos',
    '    </ChatDetailsLink>',
    "    <ChatDetailsLink compact icon=\"gallery\" onClick={() => openView('photos')}>",
    '      Fotografías',
    '    </ChatDetailsLink>',
    '  </div>',
    '</>',
  ];
  const body = foldable
    ? ['{collapsed ? (', ...ind(2, rail), ") : view === 'profile' ? (", ...ind(2, profile), ') : (', ...ind(2, files), ')}']
    : ["{view === 'profile' ? (", ...ind(2, profile), ') : (', ...ind(2, files), ')}'];
  return [
    '// URL de ejemplo: usa la foto de la persona',
    "const photo = '/images/ana-perez.jpg';",
    'const photos = Array.from({ length: 10 }, (_, i) => `Fotografía ${i + 1}`);',
    'const documents = Array.from({ length: 8 }, (_, i) => `Documento ${i + 1}.pdf`);',
    '',
    "type View = 'profile' | 'documents' | 'photos';",
    "type Section = 'documents' | 'photos';",
    '',
    'export function ConversationDetails() {',
    "  const [view, setView] = useState('profile' as View);",
    ...(foldable ? ['  const [collapsed, setCollapsed] = useState(false);'] : []),
    '  const backRef = useRef(null as HTMLButtonElement | null);',
    '  const documentsRef = useRef(null as HTMLElement | null);',
    '  const photosRef = useRef(null as HTMLElement | null);',
    "  const opened = useRef('documents' as Section);",
    '  const moved = useRef(false);',
    '',
    '  // Cambiar de vista desmonta el botón pulsado: el foco va a Anterior y, al volver, a la fila que abrió la vista',
    '  useEffect(() => {',
    '    if (!moved.current) return;',
    '    moved.current = false;',
    "    if (view === 'profile') (opened.current === 'documents' ? documentsRef : photosRef).current?.focus();",
    '    else backRef.current?.focus();',
    '  }, [view]);',
    '',
    '  const openView = (next: Section) => {',
    '    opened.current = next;',
    '    moved.current = true;',
    ...(foldable ? ['    setCollapsed(false);'] : []),
    '    setView(next);',
    '  };',
    '  const backToProfile = () => {',
    '    moved.current = true;',
    "    setView('profile');",
    '  };',
    '',
    '  return (',
    '    <ChatDetailsPanel',
    ...props.map((p) => `      ${p}`),
    '    >',
    ...ind(6, body),
    '    </ChatDetailsPanel>',
    '  );',
    '}',
  ].join('\n');
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
 * Las seis variantes de Figma (320×749; el riel, 80 × 749). Type6 y Type5 traen en Figma un trazo de 1 que las demás no tienen
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

/** Página de documentación v2 para revisar la estructura y la pestaña Desarrollo. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'ChatDetailsPanel' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((tab) => tab.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const headings = () => canvas.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
    await expect(headings()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente ChatDetailsPanel en Figma:']);
    await userEvent.click(tabs[1]);
    await expect(headings()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    await userEvent.click(tabs[2]);
    await expect(headings()).toEqual(['Desarrollo', 'Props', 'Ejemplos de uso']);
  },
};
