import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ContactCard } from './ContactCard';
import type { ContactCardVariant } from './ContactCard.types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { DropdownMenuItem } from '../DropdownMenu';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { buildCode } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './ContactCard.doc';
import docsJson from './ContactCard.docs.json';

const VARIANT_OPTIONS: ContactCardVariant[] = ['more', 'communication', 'external-link'];

/**
 * Args de Personalizar → código copiable (`docsLive.args` y `docsLive.code`): lo mismo que dibuja `Interactive`.
 * Agrega el avatar y, según la variante, el menú o los manejadores de los botones (nombres genéricos).
 */
function docsArgs(args: Record<string, unknown>): Record<string, unknown> {
  const out = { ...args };
  out['leading'] = <Avatar variant="photo" size="lg" src="/images/ana-perez.jpg" alt="" />;
  if (out['variant'] === 'more' || out['variant'] === undefined) out['menuItems'] = <DropdownMenuItem>Ver perfil</DropdownMenuItem>;
  return out;
}

const PHOTO_DECLARATION = "const foto = '/ruta/de/la/foto.jpg'; // usa la foto de la persona";

function docsCode(args: Record<string, unknown>): string {
  const code = buildCode('ContactCard', args, { variant: 'more', headingLevel: 3 }).replace('src="/images/ana-perez.jpg"', 'src={foto}');
  const variant = args['variant'];
  if (variant === 'communication') {
    return `${PHOTO_DECLARATION}\nconst call = () => {};\nconst openChat = () => {};\n\n${code.replace(/\n\/>$/, '\n  onCall={() => call()}\n  onChat={() => openChat()}\n/>')}`;
  }
  if (variant === 'external-link') {
    return `${PHOTO_DECLARATION}\nconst call = () => {};\n\n${code.replace(/\n\/>$/, '\n  onCall={() => call()}\n/>')}`;
  }
  return `${PHOTO_DECLARATION}\n\n${code}`;
}

const meta = {
  title: 'Data Display/ContactCard',
  component: ContactCard,
  parameters: {
    layout: 'padded',
    docs: componentDocsParameters(doc, docsJson),
    // Lo que no es texto ni número (avatar, menú, manejadores) lo pone el render; el código copiable lo escribe `docsCode`
    docsLive: { story: 'Interactive', args: docsArgs, code: docsCode, exclude: ['leading', 'menuItems', 'actions'] },
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { parameters }) =>
      parameters.fullWidth ? (
        <Story />
      ) : (
        <div className="w-full max-w-[498px]">
          <Story />
        </div>
      ),
  ],
  argTypes: {
    ...argTypesFromDocsJson(docsJson),
    variant: {
      name: 'variant',
      control: 'radio',
      options: VARIANT_OPTIONS,
      type: { name: 'enum', value: VARIANT_OPTIONS },
    },
    title: { control: 'text', type: { name: 'string' } },
    eyebrow: { control: 'text', type: { name: 'string' } },
    rating: { control: 'number', type: { name: 'number' } },
    headingLevel: {
      control: 'select',
      options: [2, 3, 4, 5, 6, 'none'],
      type: { name: 'enum', value: [2, 3, 4, 5, 6, 'none'] },
    },
  },
  args: {
    variant: 'more',
    title: 'Ana Pérez',
    eyebrow: 'Diseñadora de producto',
    rating: 4.5,
  },
} satisfies Meta<typeof ContactCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const avatar = <Avatar variant="photo" size="lg" src={PHOTO_SRC.Men_4} alt="" />;

const menu = (
  <>
    <DropdownMenuItem>Ver perfil</DropdownMenuItem>
    <DropdownMenuItem>Silenciar</DropdownMenuItem>
  </>
);

/** Playground: elige la acción desde los controles. */
export const Interactive: Story = {
  render: (args) => (
    <div className="w-[400px] max-w-full">
      <ContactCard {...args} leading={avatar} menuItems={menu} onCall={fn()} onChat={fn()} />
    </div>
  ),
};

export const More: Story = {
  args: { variant: 'more' },
  render: (args) => <ContactCard {...args} leading={avatar} menuItems={menu} />,
};

export const Communication: Story = {
  args: { variant: 'communication' },
  render: (args) => <ContactCard {...args} leading={avatar} onCall={fn()} onChat={fn()} />,
};

export const ExternalLink: Story = {
  args: { variant: 'external-link' },
  render: (args) => <ContactCard {...args} leading={avatar} onCall={fn()} />,
};

const FIGMA: { name: string; variant: ContactCardVariant }[] = [
  { name: 'Propiedad 1=More', variant: 'more' },
  { name: 'Propiedad 1=Communication', variant: 'communication' },
  { name: 'Propiedad 1=External Link', variant: 'external-link' },
];

function MatrixCards({ figma }: { figma: boolean }) {
  return (
    <>
      {FIGMA.map((v) => (
        <ContactCard
          key={v.name}
          data-figma={figma ? v.name : undefined}
          variant={v.variant}
          title="Subtitulo"
          eyebrow="Titulo"
          personName="Ana Pérez"
          rating={4.5}
          leading={avatar}
          menuItems={menu}
        />
      ))}
    </>
  );
}

/** Las tres variantes de Figma (402.33 de ancho), con los textos de Figma. */
export const FigmaMatrix: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de ContactCard" className="max-w-full overflow-x-auto">
        <div className="flex flex-wrap items-start gap-6 [&>*]:w-[402.33px]">
          <MatrixCards figma />
        </div>
        <p className="mt-6 mb-2 text-xs text-ds-text-neutral-body">Revisión a ojo sobre background/container/default-on-card (sin data-figma)</p>
        <div className="flex flex-wrap items-start gap-6 bg-ds-background-container-default-on-card p-6 [&>*]:w-[402.33px]">
          <MatrixCards figma={false} />
        </div>
      </div>
    </div>
  ),
};

/** Página de documentación v2: la revisan vitest y axe. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'ContactCard' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente ContactCard en Figma:']);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de ContactCard' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};

/** Test: artículo nombrado por el título, línea corta después del encabezado y acciones con el nombre de la persona. */
export const AccessibleNamesTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex w-[498px] flex-col gap-4">
      <ContactCard variant="communication" eyebrow="Rol" title="Ana Pérez" rating={4.5} leading={avatar} onCall={fn()} onChat={fn()} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('article', { name: 'Ana Pérez' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Ana Pérez' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Llamar a Ana Pérez' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Chatear con Ana Pérez' })).toBeInTheDocument();
    await expect(canvas.getByText('4,5')).toBeInTheDocument();
    await expect(canvas.getByText('de 5 estrellas')).toBeInTheDocument();
    // Encabezado primero en el DOM; la línea corta se ve arriba (order-first)
    const heading = canvas.getByRole('heading', { name: 'Ana Pérez' });
    const eyebrow = canvas.getByText('Rol');
    await expect(heading.compareDocumentPosition(eyebrow) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await expect(eyebrow.getBoundingClientRect().top).toBeLessThan(heading.getBoundingClientRect().top);
  },
};

/** Test: los botones disparan sus callbacks y el menú se abre con teclado. */
export const InteractionTest: Story = {
  tags: ['!autodocs'],
  args: { onCall: fn(), onChat: fn() },
  render: (args) => (
    <div className="flex w-[498px] flex-col gap-4">
      <ContactCard variant="communication" title="Ana Pérez" leading={avatar} onCall={args.onCall} onChat={args.onChat} />
      <ContactCard variant="more" title="Hugo García" leading={avatar} menuItems={menu} />
      <ContactCard
        variant="external-link"
        title="Sara Molina, coordinadora de proyectos especiales de la región"
        personName="Sara Molina"
        leading={avatar}
        onCall={args.onCall}
      />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Llamar a Ana Pérez' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Chatear con Ana Pérez' }));
    await expect(args.onCall).toHaveBeenCalledTimes(1);
    await expect(args.onChat).toHaveBeenCalledTimes(1);
    // Los manejadores reciben el evento del clic
    await expect(args.onCall).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
    // Con un nombre largo, el encabezado no pasa por debajo del botón de la esquina
    const long = canvas.getByRole('heading', { name: /Sara Molina/ });
    const call = canvas.getByRole('button', { name: 'Llamar a Sara Molina' });
    await expect(long.getBoundingClientRect().right).toBeLessThanOrEqual(call.getBoundingClientRect().left);
    // More va después del encabezado en el orden de tabulación
    const hugo = canvas.getByRole('article', { name: 'Hugo García' });
    const heading = within(hugo).getByRole('heading');
    const more = canvas.getByRole('button', { name: 'Más opciones de Hugo García' });
    await expect(heading.compareDocumentPosition(more) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    more.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(within(document.body).getByRole('menuitem', { name: 'Ver perfil' })).toBeInTheDocument());
  },
};
