import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Accordion, AccordionItem } from './Accordion';
import type { AccordionContrast, AccordionProps } from './Accordion.types';
import { Button } from '../Button';
import { ButtonLink } from '../ButtonLink';

const TABLE_CELLS = ['8937484782', 'Nombre del item', 'Nombre del item', 'Nombre del item', 'Nombre del item'];

const CONTRAST_OPTIONS: AccordionContrast[] = ['on-canva', 'on-card'];

/** Contenido de muestra del slot Container de Figma: texto con enlace, Button link y Button secundario. */
function SampleContent() {
  return (
    <>
      <p className="m-0 self-stretch font-ds-primitives-typography-family-primary text-ds-typography-body-size-md leading-ds-typography-body-line-height-large-md text-ds-text-neutral-body">
        Lorem ipsum dolor sit amet consectetur. Viverra imperdiet accumsan amet mauris sagittis mattis neque. Ut tempus
        ultricies et pulvinar mattis. Nunc purus sit magna ac aliquam egestas in adipiscing venenatis. Sapien molestie
        porttitor aliquam neque eget tellus. Blandit sed nascetur lobortis nam nibh nulla.{' '}
        <a href="#enlace" className="text-ds-text-link-default underline">
          Enlace
        </a>
      </p>
      <div className="self-stretch">
        <ButtonLink href="#boton" iconRight data-figma-part="Button">
          Button
        </ButtonLink>
      </div>
      <Button variant="secondary" size="sm">
        Button
      </Button>
    </>
  );
}

const meta = {
  title: 'Layout/Accordion',
  component: AccordionItem,
  subcomponents: { Accordion },
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  // La tarjeta ocupa el ancho de su contenedor; Figma la muestra a 1286
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: { control: 'text', type: { name: 'string' }, description: 'Prop Tittle de Figma' },
    description: { control: 'text', type: { name: 'string' }, description: 'Props Description y Description-2 de Figma' },
    type: {
      control: 'radio',
      options: ['normal', 'table'],
      type: { name: 'enum', value: ['normal', 'table'] },
      description: 'Type de Figma: normal o table (fila de celdas en el encabezado)',
    },
    icon: { control: 'boolean', type: { name: 'boolean' }, description: 'Prop Icon de Figma' },
    contrast: {
      name: 'contrast',
      control: 'radio',
      options: CONTRAST_OPTIONS,
      type: { name: 'enum', value: CONTRAST_OPTIONS },
      description: 'Contrast de Figma: on-canva u on-card',
    },
    headingLevel: {
      control: 'radio',
      options: [2, 3, 4, 5, 6],
      type: { name: 'enum', value: [2, 3, 4, 5, 6] },
      description: 'Nivel del encabezado que envuelve el botón',
    },
    defaultOpen: { control: 'boolean', type: { name: 'boolean' }, description: 'State=Dropdown al inicio (no controlado)' },
  },
  args: {
    title: 'Nombre del archivo',
    description: 'Estado',
    icon: true,
    contrast: 'on-card',
    headingLevel: 3,
    defaultOpen: true,
    children: <SampleContent />,
  },
} satisfies Meta<typeof AccordionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

/** Type=Table: el encabezado es una fila de celdas; al abrir, título y contenido van en un marco interior. */
export const Table: Story = {
  args: { type: 'table', cells: TABLE_CELLS, contrast: 'on-canva', defaultOpen: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: /8937484782/ });
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(canvas.getByText('Nombre del archivo')).toBeVisible());
  },
};

/** Sin ícono ni descripción (props Icon y Description de Figma en false): el alto mínimo sigue siendo 70. */
export const Minimal: Story = {
  args: { icon: false, description: undefined, defaultOpen: false },
};

const SURFACES: { contrast: AccordionContrast; figma: string; surface: string }[] = [
  { contrast: 'on-canva', figma: 'On canva', surface: 'bg-ds-background-general-black' },
  { contrast: 'on-card', figma: 'On card', surface: 'bg-ds-background-container-default-on-canva' },
];

/** Las 6 variantes de Figma (Type × State × Contrast; Table solo existe On canva) al ancho de la muestra (1286). Cada Contrast sobre su superficie. */
export const FigmaMatrix: Story = {
  // Las tarjetas abiertas repiten el mismo título de muestra, así que sus regiones comparten nombre
  parameters: { layout: 'fullscreen', a11y: { config: { rules: [{ id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className="flex w-fit flex-col">
      {SURFACES.map((s) => (
        <div key={s.contrast} className={`flex flex-col gap-6 p-6 ${s.surface}`}>
          <span className="text-xs text-ds-text-neutral-body">Contrast={s.figma}</span>
          {(['normal', 'table'] as const).flatMap((type) =>
            type === 'table' && s.contrast === 'on-card'
              ? []
              : (['Default', 'Dropdown'] as const).map((state) => (
                  <AccordionItem
                    key={`${type}-${state}`}
                    type={type}
                    cells={type === 'table' ? TABLE_CELLS : undefined}
                    contrast={s.contrast}
                    open={state === 'Dropdown'}
                    title="Nombre del archivo "
                    description="Estado"
                    className="w-[1286px]"
                    data-figma={`Type=${type === 'table' ? 'Table' : 'Normal'}, State=${state}, Contrast=${s.figma}`}
                  >
                    <SampleContent />
                  </AccordionItem>
                ))
          )}
        </div>
      ))}
    </div>
  ),
};

/** Componente suelto "Accordion" de Figma: lista de tarjetas con gap 8 (muestra a 1328). */
export const FigmaMatrixAccordion: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="w-fit bg-ds-background-container-default-on-canva p-6">
      <Accordion className="w-[1328px]" contrast="on-card" defaultValue="uno" data-figma="Accordion">
        <AccordionItem value="uno" title="Nombre del archivo " description="Estado">
          <SampleContent />
        </AccordionItem>
        <AccordionItem value="dos" title="Nombre del archivo ">
          <SampleContent />
        </AccordionItem>
        <AccordionItem value="tres" title="Nombre del archivo ">
          <SampleContent />
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

/** type="single": al abrir uno se cierra el otro. */
export const Single: Story = {
  render: () => (
    <Accordion defaultValue="a" data-testid="single">
      <AccordionItem value="a" title="Primer archivo" description="Estado">
        <SampleContent />
      </AccordionItem>
      <AccordionItem value="b" title="Segundo archivo">
        <SampleContent />
      </AccordionItem>
      <AccordionItem value="c" title="Tercer archivo">
        <SampleContent />
      </AccordionItem>
    </Accordion>
  ),
};

/** type="multiple": cada ítem se abre y cierra por separado. */
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['a', 'b']}>
      <AccordionItem value="a" title="Primer archivo" description="Estado">
        <SampleContent />
      </AccordionItem>
      <AccordionItem value="b" title="Segundo archivo">
        <SampleContent />
      </AccordionItem>
      <AccordionItem value="c" title="Tercer archivo">
        <SampleContent />
      </AccordionItem>
    </Accordion>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState('b');
  return (
    <div className="flex flex-col gap-4 bg-ds-background-general-black p-6">
      <p className="m-0 text-sm text-ds-text-neutral-body">Abierto: {value || 'ninguno'}</p>
      <Accordion contrast="on-canva" value={value} onValueChange={setValue}>
        <AccordionItem value="a" title="Primer archivo" description="Estado">
          <SampleContent />
        </AccordionItem>
        <AccordionItem value="b" title="Segundo archivo">
          <SampleContent />
        </AccordionItem>
      </Accordion>
    </div>
  );
}

/** Controlado con value y onValueChange, y contrast="on-canva" sobre la superficie general. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};

/** Pruebas: ARIA del patrón APG, alternar con Enter y Espacio, single cierra el otro, flechas, Inicio y Fin. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Accordion defaultValue="a" headingLevel={4}>
      <AccordionItem value="a" title="Uno">
        <p className="m-0">Contenido uno</p>
      </AccordionItem>
      <AccordionItem value="b" title="Dos">
        <p className="m-0">Contenido dos</p>
      </AccordionItem>
      <AccordionItem value="c" title="Tres">
        <p className="m-0">Contenido tres</p>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const uno = canvas.getByRole('button', { name: 'Uno' });
    const dos = canvas.getByRole('button', { name: 'Dos' });
    const tres = canvas.getByRole('button', { name: 'Tres' });

    // Encabezado con el nivel pedido que contiene el botón
    await expect(canvas.getByRole('heading', { level: 4, name: 'Uno' })).toContainElement(uno);
    await expect(uno).toHaveAttribute('aria-expanded', 'true');
    await expect(dos).toHaveAttribute('aria-expanded', 'false');
    const panel = canvasElement.querySelector(`#${CSS.escape(uno.getAttribute('aria-controls') ?? '')}`);
    await expect(panel).toHaveAttribute('role', 'region');
    await expect(panel).toHaveAttribute('aria-labelledby', uno.id);
    await expect(canvas.getByRole('region', { name: 'Uno' })).toBeVisible();

    // Enter abre Dos y single cierra Uno
    dos.focus();
    await userEvent.keyboard('{Enter}');
    await expect(dos).toHaveAttribute('aria-expanded', 'true');
    await expect(uno).toHaveAttribute('aria-expanded', 'false');

    // Espacio cierra Dos (collapsible)
    await userEvent.keyboard(' ');
    await expect(dos).toHaveAttribute('aria-expanded', 'false');

    // Flechas, Inicio y Fin mueven el foco entre encabezados
    await userEvent.keyboard('{ArrowDown}');
    await expect(tres).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(uno).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(tres).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(uno).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(tres).toHaveFocus();

    // El panel cerrado queda fuera del árbol de accesibilidad cuando termina la animación
    await waitFor(() => expect(canvas.queryByRole('region', { name: 'Dos' })).toBeNull(), { timeout: 1500 });
  },
};

/** Pruebas: ítem suelto no controlado y type="multiple". */
export const StandaloneAndMultipleTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4">
      <AccordionItem title="Suelto" description="Estado">
        <p className="m-0">Contenido suelto</p>
      </AccordionItem>
      <Accordion type="multiple">
        <AccordionItem value="x" title="Equis">
          <p className="m-0">Contenido equis</p>
        </AccordionItem>
        <AccordionItem value="y" title="Ye">
          <p className="m-0">Contenido ye</p>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const suelto = canvas.getByRole('button', { name: /Suelto/ });
    await expect(suelto).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(suelto);
    await expect(suelto).toHaveAttribute('aria-expanded', 'true');

    const x = canvas.getByRole('button', { name: 'Equis' });
    const y = canvas.getByRole('button', { name: 'Ye' });
    await userEvent.click(x);
    await userEvent.click(y);
    await expect(x).toHaveAttribute('aria-expanded', 'true');
    await expect(y).toHaveAttribute('aria-expanded', 'true');
  },
};

/** Título largo: envuelve en 2-3 líneas sin cortarse; la silueta con muesca y el Button corner siguen en su sitio. */
export const LongTitle: Story = {
  args: {
    title:
      'Un título de archivo muy largo que ocupa varias líneas para comprobar que el texto envuelve sin cortarse ni solaparse con el botón de la esquina',
    description: 'Estado',
    defaultOpen: false,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[343px] min-[600px]:max-w-3xl">
        <Story />
      </div>
    ),
  ],
};

/** Grupo con controles: `type`, `collapsible`, `contrast` y `headingLevel` (también por URL). */
export const Playground: StoryObj<typeof Accordion> = {
  tags: ['!autodocs'],
  argTypes: {
    type: { control: 'radio', options: ['single', 'multiple'], type: { name: 'enum', value: ['single', 'multiple'] } },
    collapsible: { control: 'boolean', type: { name: 'boolean' } },
    contrast: { control: 'radio', options: CONTRAST_OPTIONS, type: { name: 'enum', value: CONTRAST_OPTIONS } },
    headingLevel: { control: 'radio', options: [2, 3, 4, 5, 6], type: { name: 'enum', value: [2, 3, 4, 5, 6] } },
  },
  args: { type: 'single', collapsible: true, contrast: 'on-card', headingLevel: 3 },
  render: (args) => (
    <Accordion {...(args as AccordionProps)}>
      <AccordionItem value="a" title="Primer archivo" description="Estado">
        <SampleContent />
      </AccordionItem>
      <AccordionItem value="b" title="Segundo archivo">
        <SampleContent />
      </AccordionItem>
    </Accordion>
  ),
};

/** Pruebas: `collapsible={false}` deja `aria-disabled` en el ítem abierto y el clic no lo cierra. */
export const NotCollapsibleTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <Accordion defaultValue="a" collapsible={false}>
      <AccordionItem value="a" title="Uno">
        <p className="m-0">Contenido uno</p>
      </AccordionItem>
      <AccordionItem value="b" title="Dos">
        <p className="m-0">Contenido dos</p>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const uno = canvas.getByRole('button', { name: 'Uno' });
    const dos = canvas.getByRole('button', { name: 'Dos' });
    await expect(uno).toHaveAttribute('aria-disabled', 'true');
    await expect(dos).not.toHaveAttribute('aria-disabled');
    await userEvent.click(uno);
    await expect(uno).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(dos);
    await expect(dos).toHaveAttribute('aria-expanded', 'true');
    await expect(uno).toHaveAttribute('aria-expanded', 'false');
    await expect(uno).not.toHaveAttribute('aria-disabled');
    await expect(dos).toHaveAttribute('aria-disabled', 'true');
  },
};

function ControlledItemExample() {
  const [open, setOpen] = useState(false);
  return (
    <AccordionItem title="Controlado" open={open} onOpenChange={setOpen}>
      <p className="m-0">Contenido controlado</p>
    </AccordionItem>
  );
}

/** Pruebas: `Controlled` cambia de ítem, ítem suelto controlado y `headingLevel` desde el grupo. */
export const ControlledTest: Story = {
  tags: ['!autodocs'],
  render: () => (
    <div className="flex flex-col gap-4">
      <ControlledExample />
      <ControlledItemExample />
      <Accordion headingLevel={4}>
        <AccordionItem value="n" title="Nivel">
          <p className="m-0">Contenido nivel</p>
        </AccordionItem>
        <AccordionItem value="m" title="Propio" headingLevel={3}>
          <p className="m-0">Contenido propio</p>
        </AccordionItem>
      </Accordion>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const a = canvas.getByRole('button', { name: /Primer archivo/ });
    const b = canvas.getByRole('button', { name: 'Segundo archivo' });
    await expect(b).toHaveAttribute('aria-expanded', 'true');
    await expect(a).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(a);
    await expect(a).toHaveAttribute('aria-expanded', 'true');
    await expect(b).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByText('Abierto: a')).toBeVisible();

    const suelto = canvas.getByRole('button', { name: 'Controlado' });
    await expect(suelto).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(suelto);
    await expect(suelto).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(suelto);
    await expect(suelto).toHaveAttribute('aria-expanded', 'false');

    await expect(canvas.getByRole('heading', { level: 4, name: 'Nivel' })).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Propio' })).toBeVisible();
  },
};
