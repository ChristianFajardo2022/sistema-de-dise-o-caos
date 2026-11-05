import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './FeatureCard.doc';
import docsJson from './FeatureCard.docs.json';
import { FeatureCard } from './FeatureCard';
import type { FeatureCardProps } from './FeatureCard.types';
import featurePhoto from './assets/destacar-archivo.png';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { ButtonCorner } from '../ButtonCorner';
import { Icon } from '../Icon';
import { ListItem } from '../ListItem';

const VARIANT_OPTIONS = ['photo', 'surface', 'cutout'] as const;
const HEADING_OPTIONS = [2, 3, 4, 5, 6, 'none'] as const;

/** Anchos de Figma por tipo. */
const WIDTH: Record<(typeof VARIANT_OPTIONS)[number], string> = {
  photo: 'max-w-[498px]',
  surface: 'max-w-[498px]',
  cutout: 'max-w-[612px]',
};

const SURFACE_LIST = [
  '  <ul role="list" className="m-0 flex min-w-0 flex-col p-0">',
  '    <ListItem title="Informe trimestral" leading={<Avatar name="Hugo García" size="sm" />} />',
  '    <ListItem variant="simple" title="Acta de reunión" />',
  '  </ul>',
];

/**
 * Código de Personalizar: reproduce lo que dibuja `Interactive` (foto, acción y lista según el tipo). El código
 * generado omite lo que el `render` arma por su cuenta, así que se escribe completo y se puede copiar tal cual.
 */
function interactiveCode(args: Record<string, unknown>): string {
  const variant = (args['variant'] as string | undefined) ?? 'photo';
  const title = String(args['title'] ?? '');
  const lines: string[] = [];
  const prop = (name: string, value: unknown) => {
    if (value === undefined || value === '' || value === null) return;
    lines.push(typeof value === 'string' ? `  ${name}=${JSON.stringify(value)}` : `  ${name}={${JSON.stringify(value)}}`);
  };
  lines.push(`  variant="${variant}"`);
  prop('title', title);
  if (variant !== 'cutout') {
    prop('description', args['description']);
    prop('date', args['date']);
    prop('dateTime', args['dateTime']);
  } else {
    prop('eyebrow', args['eyebrow']);
  }
  prop('headingLevel', args['headingLevel']);
  if (variant !== 'surface') lines.push('  src={foto}');
  if (variant === 'photo') {
    lines.push(`  action={\n    <Button variant="secondary" size="sm" unicolor aria-label=${JSON.stringify(`Ver más sobre ${title}`)}>\n      Ver más\n    </Button>\n  }`);
  }
  if (variant === 'surface') {
    lines.push(
      `  action={\n    <ButtonCorner\n      contrast="on-card"\n      aria-label=${JSON.stringify(`Abrir ${title}`)}\n      icon={<Icon name="arrow-diagonal-right" size={16} variant="line" />}\n    />\n  }`
    );
  }
  const head = variant === 'surface' ? '' : "const foto = '/imagen-destacada.png'; // usa tu propia imagen\n\n";
  if (variant === 'surface') return `${head}<FeatureCard\n${lines.join('\n')}\n>\n${SURFACE_LIST.join('\n')}\n</FeatureCard>`;
  return `${head}<FeatureCard\n${lines.join('\n')}\n/>`;
}

const meta = {
  title: 'Data Display/FeatureCard',
  component: FeatureCard,
  parameters: {
    layout: 'padded',
    docs: componentDocsParameters(doc, docsJson),
    // Lo que el `render` arma por tipo (foto, acción y lista) no son controles: el código de Personalizar lo escribe completo
    docsLive: { story: 'Interactive', exclude: ['src', 'alt', 'action', 'children', 'className'], code: interactiveCode },
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { parameters, args }) =>
      parameters.fullWidth ? (
        <Story />
      ) : (
        <div className={`w-full ${WIDTH[(args.variant as keyof typeof WIDTH) ?? 'photo']}`}>
          <Story />
        </div>
      ),
  ],
  argTypes: argTypesFromDocsJson(docsJson, {
    variant: { control: 'radio', options: VARIANT_OPTIONS, type: { name: 'enum', value: [...VARIANT_OPTIONS] } },
    title: { control: 'text', type: { name: 'string' } },
    description: { control: 'text', type: { name: 'string' } },
    eyebrow: { control: 'text', type: { name: 'string' } },
    date: { control: 'text', type: { name: 'string' } },
    dateTime: { control: 'text', type: { name: 'string' } },
    headingLevel: { control: 'select', options: HEADING_OPTIONS, type: { name: 'enum', value: [...HEADING_OPTIONS] } },
  }),
  args: {
    variant: 'photo',
    title: 'Nueva guía de estilo',
    description: 'Reglas de color y tipografía para todo el equipo.',
    eyebrow: 'Guía',
    date: '7 feb 2024',
    dateTime: '2024-02-07',
  },
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Lista del slot "Espacio": un ítem con avatar y uno solo con título. */
function ItemList({ figma = false }: { figma?: boolean }) {
  return (
    <ul role="list" data-figma-part="List" className="m-0 flex min-w-0 flex-col p-0">
      <ListItem
        title={figma ? 'Nombre del item' : 'Informe trimestral'}
        leading={<Avatar name="Hugo García" size="sm" />}
      />
      <ListItem variant="simple" title={figma ? 'Nombre del item' : 'Acta de reunión'} />
    </ul>
  );
}

function Corner({ label }: { label: string }) {
  return (
    <ButtonCorner
      contrast="on-card"
      size="md"
      aria-label={label}
      icon={<Icon name="arrow-diagonal-right" size={16} variant="line" data-figma-part="Icon-sizes" />}
    />
  );
}

/** Interactivo: cambia el tipo con los controles. */
export const Interactive: Story = {
  render: (args) => (
    <FeatureCard
      {...args}
      src={args.variant === 'surface' ? undefined : featurePhoto}
      eyebrow={args.variant === 'cutout' ? args.eyebrow : undefined}
      action={
        args.variant === 'photo' ? (
          <Button variant="secondary" size="sm" unicolor aria-label={`Ver más sobre ${String(args.title)}`}>
            Ver más
          </Button>
        ) : args.variant === 'surface' ? (
          <Corner label={`Abrir ${String(args.title)}`} />
        ) : undefined
      }
    >
      {args.variant === 'surface' ? <ItemList /> : undefined}
    </FeatureCard>
  ),
};

/** photo: foto de fondo, texto y un botón. */
export const Photo: Story = {
  render: (args) => (
    <FeatureCard
      {...args}
      variant="photo"
      src={featurePhoto}
      action={
        <Button variant="secondary" size="sm" unicolor aria-label={`Ver más sobre ${String(args.title)}`}>
          Ver más
        </Button>
      }
    />
  ),
};

/** surface: superficie con muesca para el Button corner y una lista en el slot. */
export const Surface: Story = {
  args: { variant: 'surface', title: 'Tareas por revisar', description: 'Dos documentos esperan aprobación.' },
  render: (args) => (
    <FeatureCard {...args} action={<Corner label="Abrir Tareas por revisar" />}>
      <ItemList />
    </FeatureCard>
  ),
};

/**
 * cutout: foto grande con recorte para el texto. La imagen de Figma está excluida a propósito (es un producto real):
 * sin `src` se ve el marcador neutro. El recorte se ajusta al bloque de texto.
 */
export const Cutout: Story = {
  args: { variant: 'cutout', eyebrow: 'Guía', title: 'Cómo preparar\nuna presentación', description: undefined, date: undefined },
};

const FIGMA_TEXT = {
  title: 'Esto es un texto',
  description: 'Esto es un texto descriptivo',
  date: '7 Feb 2024',
  dateTime: '2024-02-07',
} satisfies Partial<FeatureCardProps>;

/**
 * Las 3 variantes con los textos de Figma. El set vigente (16903:57057) solo tiene `Type=2` (= cutout): `photo` y `surface`
 * ya no tienen set y no llevan `data-figma`. `figma` pone `data-figma` (solo una copia lo lleva).
 */
function MatrixCards({ figma }: { figma: boolean }) {
  return (
    <>
      <FeatureCard
        className="w-[498px]"
        variant="photo"
        {...FIGMA_TEXT}
        src={featurePhoto}
        action={
          <Button variant="secondary" size="sm" unicolor data-figma-part="Button">
            Button
          </Button>
        }
      />
      <FeatureCard
        data-figma={figma ? 'Type=2' : undefined}
        className="w-[612px]"
        variant="cutout"
        eyebrow="Subtítulo"
        title={'Best Full Body\nHome Gym Machines'}
      />
      <FeatureCard
        className="w-[498px]"
        variant="surface"
        {...FIGMA_TEXT}
        action={<Corner label="Abrir Esto es un texto" />}
      >
        <ItemList figma />
      </FeatureCard>
    </>
  );
}

/**
 * Cada variante de Figma una vez (con `data-figma`). Debajo, solo para revisar a ojo, las mismas tarjetas sobre
 * background/container/default-on-card: sobre background/general/black la superficie de `surface` se funde.
 */
export const FigmaMatrix: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de FeatureCard" className="max-w-full overflow-x-auto">
        <div className="flex flex-wrap items-start gap-6">
          <MatrixCards figma />
        </div>
        <p className="mt-6 mb-2 text-xs text-ds-text-neutral-body">Revisión a ojo sobre background/container/default-on-card (sin data-figma)</p>
        <div className="flex flex-wrap items-start gap-6 bg-ds-background-container-default-on-card p-6">
          <MatrixCards figma={false} />
        </div>
      </div>
    </div>
  ),
};

/** Test: cada tipo es un artículo nombrado por su título; la fecha va en `<time>` y las acciones tienen nombre */
export const AccessibleNamesTest: Story = {
  tags: ['!autodocs'],
  parameters: { fullWidth: true },
  render: () => (
    <div className="flex flex-col gap-6">
      <FeatureCard className="max-w-[498px]" variant="photo" title="Novedades" date="7 feb 2024" dateTime="2024-02-07" src={featurePhoto} action={<Button size="sm" aria-label="Ver más sobre Novedades">Ver más</Button>} />
      <FeatureCard className="max-w-[498px]" variant="surface" title="Documentos" headingLevel={2} action={<Corner label="Abrir Tareas" />}>
        <ItemList />
      </FeatureCard>
      <FeatureCard className="max-w-[612px]" variant="cutout" eyebrow="Guía" title="Primera presentación" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('article', { name: 'Novedades' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Novedades' })).toBeInTheDocument();
    await expect(canvasElement.querySelector('time[datetime="2024-02-07"]')).toHaveTextContent('7 feb 2024');
    await expect(canvas.getByRole('button', { name: 'Ver más sobre Novedades' })).toBeInTheDocument();
    await expect(canvas.getByRole('article', { name: 'Documentos' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 2, name: 'Documentos' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Abrir Tareas' })).toBeInTheDocument();
    await expect(canvas.getByRole('article', { name: 'Primera presentación' })).toBeInTheDocument();
    // Cutout: el recorte se mide del bloque de texto
    const cutout = canvas.getByRole('article', { name: 'Primera presentación' });
    await expect(parseFloat(cutout.style.getPropertyValue('--fc-cut-w'))).toBeGreaterThan(0);
    // El encabezado va antes que la línea corta en el DOM (la línea se ve arriba con order-first)
    const heading = within(cutout).getByRole('heading', { name: 'Primera presentación' });
    const eyebrow = within(cutout).getByText('Guía');
    await expect(heading.compareDocumentPosition(eyebrow) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // El texto no se sale de la tarjeta: la tarjeta crece si no cabe
    const card = cutout.getBoundingClientRect();
    const text = heading.parentElement!.getBoundingClientRect();
    await expect(text.top).toBeGreaterThanOrEqual(card.top - 0.5);
  },
};

/** Test de la página de documentación (plantilla v2). */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'FeatureCard' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente FeatureCard en Figma:']);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de FeatureCard' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
