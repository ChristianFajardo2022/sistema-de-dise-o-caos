import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ContactCard } from './ContactCard';
import type { ContactCardVariant } from './ContactCard.types';
import { Avatar } from '../Avatar';
import { PHOTO_SRC } from '../Avatar/Avatar.sample-data';
import { DropdownMenuItem } from '../DropdownMenu';

const VARIANT_OPTIONS: ContactCardVariant[] = ['more', 'communication', 'external-link'];

const meta = {
  title: 'Data Display/ContactCard',
  component: ContactCard,
  parameters: { layout: 'padded' },
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
    variant: {
      name: 'variant',
      control: 'radio',
      options: VARIANT_OPTIONS,
      type: { name: 'enum', value: VARIANT_OPTIONS },
      description: 'Propiedad 1 de Figma: acción de la derecha',
    },
    title: { control: 'text', type: { name: 'string' }, description: 'Encabezado: el nombre (capa Subtitulo de Figma)' },
    eyebrow: { control: 'text', type: { name: 'string' }, description: 'Línea corta sobre el nombre (capa Titulo de Figma)' },
    rating: { control: 'number', type: { name: 'number' }, description: 'Calificación del Badge sobre el avatar (0 a 5)' },
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
  render: (args) => <ContactCard {...args} leading={avatar} menuItems={menu} onCall={fn()} onChat={fn()} />,
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
