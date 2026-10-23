import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import {
  InteractiveCard,
  InteractiveCardDescription,
  InteractiveCardDetail,
  InteractiveCardDetails,
  InteractiveCardHeader,
  InteractiveCardList,
  InteractiveCardStat,
  InteractiveCardStats,
  InteractiveCardTags,
} from './InteractiveCard';
import type { InteractiveCardProps, InteractiveCardState, InteractiveCardVariant } from './InteractiveCard.types';
import { Avatar } from '../Avatar';
import { ListItem } from '../ListItem';
import { Tag } from '../Tag';

const VARIANT_OPTIONS: InteractiveCardVariant[] = ['simple', 'complex'];
const STATE_OPTIONS: InteractiveCardState[] = ['default', 'hover', 'select', 'inactive'];

const meta = {
  title: 'Data Display/InteractiveCard',
  component: InteractiveCard,
  subcomponents: {
    InteractiveCardHeader,
    InteractiveCardDescription,
    InteractiveCardTags,
    InteractiveCardDetails,
    InteractiveCardDetail,
    InteractiveCardList,
    InteractiveCardStats,
    InteractiveCardStat,
  },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  // Ancho de Figma, salvo en las historias con `parameters.fullWidth` (la matriz)
  decorators: [
    (Story, { parameters }) =>
      parameters.fullWidth ? (
        <Story />
      ) : (
        <div className="w-full max-w-[368.5px]">
          <Story />
        </div>
      ),
  ],
  argTypes: {
    variant: { control: 'radio', options: VARIANT_OPTIONS, type: { name: 'enum', value: VARIANT_OPTIONS }, description: 'Type de Figma' },
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Tittle de Figma (nombre del radio)' },
    subtitle: { control: 'text', type: { name: 'string' }, description: 'Prop Subtittle2 de Figma' },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'State Inactive' },
    indicator: { control: 'boolean', type: { name: 'boolean' }, description: 'Solo simple: dibuja el radio (prop Radio button)' },
    state: {
      control: 'select',
      options: STATE_OPTIONS,
      type: { name: 'enum', value: STATE_OPTIONS },
      description: 'Fuerza el aspecto, solo para documentación',
    },
    cornerLabel: { control: 'text', type: { name: 'string' }, description: 'Solo complex: nombre del Button corner' },
  },
  args: {
    variant: 'simple',
    title: 'Plan mensual',
    subtitle: 'Se renueva cada 30 días',
    disabled: false,
    indicator: true,
  },
} satisfies Meta<typeof InteractiveCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Preview con controles (simple). */
export const Interactive: Story = {};

/** Grupo de tarjetas simples: mismo `name`, flechas para moverse, Espacio para elegir. */
function PlanGroup(args: InteractiveCardProps) {
  const [plan, setPlan] = useState('mensual');
  const plans = [
    { value: 'mensual', title: 'Plan mensual', subtitle: 'Se renueva cada 30 días' },
    { value: 'anual', title: 'Plan anual', subtitle: 'Dos meses gratis' },
    { value: 'equipo', title: 'Plan de equipo', subtitle: 'Hasta 10 personas', disabled: true },
  ];
  return (
    <fieldset className="m-0 flex flex-col gap-ds-space-general-lg border-0 p-0">
      <legend className="mb-ds-space-general-lg font-ds-primitives-typography-family-primary text-ds-typography-body-size-md text-ds-text-neutral-body">
        Elige un plan
      </legend>
      {plans.map((p) => (
        <InteractiveCard
          {...args}
          key={p.value}
          name="plan"
          value={p.value}
          title={p.title}
          subtitle={p.subtitle}
          disabled={p.disabled}
          checked={plan === p.value}
          onChange={(event) => setPlan(event.target.value)}
        />
      ))}
    </fieldset>
  );
}

export const RadioGroup: Story = {
  render: (args) => <PlanGroup {...args} />,
};

const folder = <Avatar variant="icon" size="sm" />;

/** Contenido de muestra de la Complex, con los textos de Figma o reales. */
function ComplexSections({ disabled = false, figma = false }: { disabled?: boolean; figma?: boolean }) {
  const t = (figmaText: string, real: string) => (figma ? figmaText : real);
  return (
    <>
      <InteractiveCardDetails>
        <InteractiveCardDetail term={t('Título', 'Inicio')}>{t('Descripción', '12 de enero')}</InteractiveCardDetail>
        <InteractiveCardDetail term={t('Título', 'Entrega')}>{t('Descripción', '30 de marzo')}</InteractiveCardDetail>
      </InteractiveCardDetails>
      <InteractiveCardList>
        <ListItem
          title={t('Nombre del item', 'Brief inicial')}
          category={t('Categoría', 'Documento')}
          description={t('Descripción', 'Actualizado hoy')}
          leading={folder}
          disabled={disabled}
          onEdit={() => {}}
          onDelete={() => {}}
        />
        <ListItem
          title={t('Nombre del item', 'Presupuesto')}
          category={t('Categoría', 'Hoja de cálculo')}
          description={t('Descripción', 'Actualizado ayer')}
          leading={folder}
          disabled={disabled}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      </InteractiveCardList>
      <InteractiveCardStats>
        <InteractiveCardStat label={t('Subtítulo', 'Tareas')} value={t('Descripción', '24')} icon="eye" />
        <InteractiveCardStat label={t('Subtítulo', 'Archivos')} value={t('Descripción', '8')} icon="eye" />
      </InteractiveCardStats>
    </>
  );
}

function sampleTags(disabled: boolean, figma: boolean) {
  return (
    <>
      <Tag iconLeft={false} disabled={disabled} data-figma-part={figma ? 'Text' : undefined}>
        {figma ? 'Text' : 'Diseño'}
      </Tag>
      <Tag type="success" iconLeft={false} disabled={disabled} data-figma-part={figma ? 'Text' : undefined}>
        {figma ? 'Text' : 'Activo'}
      </Tag>
    </>
  );
}

/** Complex compuesta: encabezado de la tarjeta, `content` (otro encabezado, descripción, etiquetas) y secciones. */
export const Complex: Story = {
  args: {
    variant: 'complex',
    title: 'Proyecto web',
    subtitle: 'Equipo de producto',
    cornerLabel: 'Abrir proyecto web',
    onCornerClick: fn(),
  },
  render: (args) => (
    <InteractiveCard
      {...args}
      tags={sampleTags(!!args.disabled, false)}
      content={
        <>
          <InteractiveCardHeader title="Avance" subtitle="68 %" emphasis="subtitle" subtitleIcon="eye" tags={sampleTags(!!args.disabled, false)} />
          <InteractiveCardDescription>
            Rediseño del sitio con nuevas páginas de producto y un flujo de compra más corto.
          </InteractiveCardDescription>
          <InteractiveCardTags>{sampleTags(!!args.disabled, false)}</InteractiveCardTags>
        </>
      }
    >
      <ComplexSections disabled={args.disabled} />
    </InteractiveCard>
  ),
};

const FIGMA_VARIANTS: { variant: InteractiveCardVariant; state: InteractiveCardState }[] = [
  { variant: 'simple', state: 'default' },
  { variant: 'simple', state: 'hover' },
  { variant: 'simple', state: 'select' },
  { variant: 'simple', state: 'inactive' },
  { variant: 'complex', state: 'default' },
  { variant: 'complex', state: 'hover' },
  { variant: 'complex', state: 'select' },
  { variant: 'complex', state: 'inactive' },
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Clic "real" sobre el centro de un elemento: user-event despacha el evento al nodo que recibe, sin mirar qué hay
 * encima. Aquí se busca con `elementFromPoint` lo que el puntero tocaría (el label estirado de la tarjeta).
 */
async function clickAt(el: Element) {
  const box = el.getBoundingClientRect();
  const target = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
  if (!target) throw new Error('No hay nada bajo el puntero');
  await userEvent.click(target);
}

/** Las 8 variantes del set 13219:38332 con los textos de Figma (la Complex Default no lleva el segundo encabezado). */
function MatrixCard({ variant, state, figma }: { variant: InteractiveCardVariant; state: InteractiveCardState; figma: boolean }) {
  const name = `Type=${cap(variant)}, State=${cap(state)}`;
  const disabled = state === 'inactive';
  return (
    <InteractiveCard
      rootProps={figma ? { 'data-figma': name } : undefined}
      variant={variant}
      state={state}
      title="Título"
      subtitle="Subtítulo"
      cornerLabel={variant === 'complex' ? 'Abrir' : undefined}
      tags={sampleTags(disabled, true)}
      content={
        variant === 'complex' ? (
          <>
            {state !== 'default' && (
              <InteractiveCardHeader title="Título" subtitle="Subtítulo" emphasis="subtitle" subtitleIcon="eye" tags={sampleTags(disabled, true)} />
            )}
            <InteractiveCardDescription>
              Lorem ipsum dolor sit amet consectetur. Tempus ornare maecenas integer viverra vitae faucibus.
            </InteractiveCardDescription>
            <InteractiveCardTags>{sampleTags(disabled, true)}</InteractiveCardTags>
          </>
        ) : undefined
      }
    >
      {variant === 'complex' ? <ComplexSections disabled={disabled} figma /> : undefined}
    </InteractiveCard>
  );
}

/**
 * Cada variante de Figma una vez (con `data-figma`). Debajo, solo para revisar a ojo, las mismas tarjetas sobre una
 * superficie que contrasta: sobre background/general/black la tarjeta Complex (default-on-canva) se funde y no se ven la
 * muesca, el radio ni el trazo.
 */
export const FigmaMatrix: Story = {
  parameters: { fullWidth: true },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de InteractiveCard" className="max-w-full overflow-x-auto">
        <div className="grid w-max grid-cols-[repeat(4,368.5px)] items-start gap-6">
          {FIGMA_VARIANTS.map(({ variant, state }) => (
            <MatrixCard key={`${variant}-${state}`} variant={variant} state={state} figma />
          ))}
        </div>
        <p className="mt-6 mb-2 text-xs text-ds-text-neutral-body">Revisión a ojo sobre background/container/default-on-card (sin data-figma)</p>
        <div className="grid w-max grid-cols-[repeat(4,368.5px)] items-start gap-6 bg-ds-background-container-default-on-card p-6">
          {FIGMA_VARIANTS.map(({ variant, state }) => (
            <MatrixCard key={`${variant}-${state}`} variant={variant} state={state} figma={false} />
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: el radio se nombra con el título y se describe con el subtítulo; un clic en cualquier parte lo marca */
export const SelectByClickTest: Story = {
  tags: ['!autodocs'],
  args: { onCheckedChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole('radio', { name: 'Plan mensual' });
    await expect(radio).toHaveAccessibleDescription('Se renueva cada 30 días');
    await expect(radio).not.toBeChecked();
    await clickAt(canvas.getByText('Se renueva cada 30 días'));
    await expect(radio).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};

/** Test: en un grupo, Tab entra al radio marcado, las flechas cambian la selección y la tarjeta deshabilitada se salta */
export const KeyboardGroupTest: Story = {
  tags: ['!autodocs'],
  render: (args) => <PlanGroup {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const mensual = canvas.getByRole('radio', { name: 'Plan mensual' });
    await expect(mensual).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    const anual = canvas.getByRole('radio', { name: 'Plan anual' });
    await expect(anual).toHaveFocus();
    await expect(anual).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Plan de equipo' })).toBeDisabled();
  },
};

/** Test: el Button corner y las acciones de la lista responden sin marcar la tarjeta */
export const NestedControlsTest: Story = {
  tags: ['!autodocs'],
  args: {
    variant: 'complex',
    title: 'Proyecto web',
    subtitle: 'Equipo de producto',
    cornerLabel: 'Abrir proyecto web',
    onCornerClick: fn(),
  },
  render: Complex.render,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole('radio', { name: 'Proyecto web' });
    await clickAt(canvas.getByRole('button', { name: 'Abrir proyecto web' }));
    await expect(args.onCornerClick).toHaveBeenCalled();
    await expect(radio).not.toBeChecked();
    await clickAt(canvas.getByRole('button', { name: 'Editar Brief inicial' }));
    await expect(radio).not.toBeChecked();
    await clickAt(canvas.getByText('Rediseño del sitio con nuevas páginas de producto y un flujo de compra más corto.'));
    await expect(radio).toBeChecked();
  },
};

/** Test: Inactive deshabilita el radio y el Button corner */
export const InactiveTest: Story = {
  tags: ['!autodocs'],
  args: { variant: 'complex', title: 'Proyecto web', subtitle: 'Equipo de producto', cornerLabel: 'Abrir proyecto web', disabled: true },
  render: Complex.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'Proyecto web' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Abrir proyecto web' })).toBeDisabled();
  },
};
