import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { Tab, TabList, TabOverflow, TabPanel, Tabs } from './Tabs';
import { doc } from './Tabs.doc';
import docsJson from './Tabs.docs.json';
import type { TabState, TabsActivationMode, TabsContrast, TabsProps, TabsSize } from './Tabs.types';
import { DropdownMenuItem } from '../DropdownMenu';

const SIZE_OPTIONS: TabsSize[] = ['md', 'sm'];
const CONTRAST_OPTIONS: TabsContrast[] = ['on-canva', 'on-card'];
const ACTIVATION_OPTIONS: TabsActivationMode[] = ['automatic', 'manual'];

// Código copiable de Personalizar: el estado de la pestaña seleccionada y las pestañas del ejemplo del lienzo
const liveCode = ({ defaultValue: _defaultValue, value: _value, ...a }: Record<string, unknown>) => {
  const props = [
    'value={value}',
    'onValueChange={(value) => setValue(value)}',
    ...Object.entries(a).flatMap(([name, v]) => (typeof v === 'string' ? [`${name}="${v}"`] : [])),
  ];
  return `const [value, setValue] = useState('inicio');

<Tabs
${props.map((p) => `  ${p}`).join('\n')}
>
  <TabList aria-label="Secciones del espacio">
    <Tab value="inicio" icon="homepage" badge={3} badgeLabel="sin leer">
      Inicio
    </Tab>
    <Tab value="documentos" icon="document" badge={12} badgeLabel="sin leer">
      Documentos
    </Tab>
    <Tab value="proyectos" icon="folder">
      Proyectos
    </Tab>
    <Tab value="archivo" icon="archive" disabled>
      Archivo
    </Tab>
  </TabList>
  <TabPanel value="inicio">Tienes tres mensajes sin leer.</TabPanel>
  <TabPanel value="documentos">Hay doce documentos sin leer.</TabPanel>
  <TabPanel value="proyectos">Sin proyectos activos hoy.</TabPanel>
  <TabPanel value="archivo">Archivo no disponible.</TabPanel>
</Tabs>`;
};

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel, TabOverflow },
  parameters: {
    layout: 'padded',
    // La página Docs usa la plantilla de documentación (Tabs.doc.tsx) con la referencia de código al final
    docs: componentDocsParameters(doc, docsJson),
    // El lienzo cambia de pestaña con clic y teclado. La selección la lleva el render (`defaultValue`): sin controles
    docsLive: { story: 'Interactive', exclude: ['value', 'defaultValue'], code: liveCode },
  },
  tags: ['autodocs'],
  // Las descripciones salen de Tabs.docs.json; aquí solo los controles y los tipos explícitos
  argTypes: argTypesFromDocsJson(docsJson, {
    size: { control: 'radio', options: SIZE_OPTIONS, type: { name: 'enum', value: SIZE_OPTIONS } },
    contrast: { control: 'radio', options: CONTRAST_OPTIONS, type: { name: 'enum', value: CONTRAST_OPTIONS } },
    activationMode: { control: 'radio', options: ACTIVATION_OPTIONS, type: { name: 'enum', value: ACTIVATION_OPTIONS } },
    defaultValue: { control: 'text', type: { name: 'string' } },
  }),
  args: { size: 'md', contrast: 'on-canva', activationMode: 'automatic', defaultValue: 'inicio' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelText = 'm-0 pt-4 font-ds-primitives-typography-family-primary text-ds-typography-body-size-md text-ds-text-neutral-body';

function SampleTabs(args: TabsProps) {
  return (
    <Tabs {...args}>
      <TabList aria-label="Secciones del espacio">
        <Tab value="inicio" icon="homepage" badge={3} badgeLabel="sin leer">
          Inicio
        </Tab>
        <Tab value="documentos" icon="document" badge={12} badgeLabel="sin leer">
          Documentos
        </Tab>
        <Tab value="proyectos" icon="folder">
          Proyectos
        </Tab>
        <Tab value="archivo" icon="archive" disabled>
          Archivo
        </Tab>
      </TabList>
      <TabPanel value="inicio">
        <p className={panelText}>Tienes tres mensajes sin leer.</p>
      </TabPanel>
      <TabPanel value="documentos">
        <p className={panelText}>Hay doce documentos sin leer.</p>
      </TabPanel>
      <TabPanel value="proyectos">
        <p className={panelText}>Sin proyectos activos hoy.</p>
      </TabPanel>
      <TabPanel value="archivo">
        <p className={panelText}>Archivo no disponible.</p>
      </TabPanel>
    </Tabs>
  );
}

const SURFACE: Record<TabsContrast, string> = {
  'on-canva': 'bg-ds-background-general-black',
  'on-card': 'bg-ds-background-container-default-on-canva',
};

export const Interactive: Story = {
  render: (args) => (
    <div className={`p-6 ${SURFACE[args.contrast ?? 'on-canva']}`}>
      <SampleTabs {...args} />
    </div>
  ),
};

/** Single Icon=Yes de Figma: pestañas de solo ícono, con `aria-label` obligatorio. */
export const IconOnly: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="favoritos">
      <TabList aria-label="Vistas">
        <Tab value="favoritos" icon="heart" badge={2} badgeLabel="nuevos" aria-label="Favoritos" />
        <Tab value="buscar" icon="search" aria-label="Buscar" />
        <Tab value="ajustes" icon="setting" aria-label="Ajustes" />
      </TabList>
      <TabPanel value="favoritos">
        <p className={panelText}>Favoritos</p>
      </TabPanel>
      <TabPanel value="buscar">
        <p className={panelText}>Buscar</p>
      </TabPanel>
      <TabPanel value="ajustes">
        <p className={panelText}>Ajustes</p>
      </TabPanel>
    </Tabs>
  ),
};

/** Marco "mobile" de Figma: las pestañas se reparten todo el ancho. */
export const FullWidth: Story = {
  render: (args) => (
    <div className="w-[360px] max-w-full">
      <Tabs {...args} defaultValue="hoy">
        <TabList aria-label="Periodo" fullWidth>
          <Tab value="hoy" badge={4}>
            Hoy
          </Tab>
          <Tab value="semana">Semana</Tab>
        </TabList>
        <TabPanel value="hoy">
          <p className={panelText}>Cuatro tareas para hoy.</p>
        </TabPanel>
        <TabPanel value="semana">
          <p className={panelText}>Resumen semanal.</p>
        </TabPanel>
      </Tabs>
    </div>
  ),
};

const SECTIONS = ['Inicio', 'Documentos', 'Proyectos', 'Equipos', 'Calendario', 'Reportes', 'Perfil', 'Ajustes'];
const VISIBLE = 4;

/**
 * Options=more options de Figma: lo que no cabe va al menú del botón Dots (`TabOverflow`). Al elegir una sección
 * del menú se selecciona y ocupa el último lugar visible, para que la pestaña seleccionada exista siempre.
 */
function OverflowDemo(args: TabsProps) {
  const [value, setValue] = useState(SECTIONS[0]);
  const index = SECTIONS.indexOf(value);
  const visible = index < VISIBLE ? SECTIONS.slice(0, VISIBLE) : [...SECTIONS.slice(0, VISIBLE - 1), value];
  const hidden = SECTIONS.filter((s) => !visible.includes(s));
  // Al elegir del menú, el foco pasa a la pestaña recién seleccionada (y no vuelve al botón Dots)
  const selectFromMenu = (section: string) => {
    setValue(section);
    setTimeout(() => {
      document.querySelector<HTMLElement>(`[role="tab"][data-value="${section}"]`)?.focus();
    }, 0);
  };
  return (
    <Tabs {...args} value={value} onValueChange={setValue}>
      <TabList
        aria-label="Secciones"
        overflow={
          <TabOverflow label="Más secciones">
            {hidden.map((s) => (
              <DropdownMenuItem key={s} onSelect={() => selectFromMenu(s)}>
                {s}
              </DropdownMenuItem>
            ))}
          </TabOverflow>
        }
      >
        {visible.map((s) => (
          <Tab key={s} value={s}>
            {s}
          </Tab>
        ))}
      </TabList>
      {SECTIONS.map((s) => (
        <TabPanel key={s} value={s}>
          <p className={panelText}>Contenido de {s}.</p>
        </TabPanel>
      ))}
    </Tabs>
  );
}

export const Overflow: Story = {
  render: (args) => <OverflowDemo {...args} />,
};

// ───────────────────────── Matrices de Figma ─────────────────────────

const SURFACES: { contrast: TabsContrast; figma: string }[] = [
  { contrast: 'on-canva', figma: 'On canva' },
  { contrast: 'on-card', figma: 'On card' },
];

const ATOM_STATES: { state: TabState; figma: string }[] = [
  { state: 'default', figma: 'Default' },
  { state: 'hover', figma: 'Hover' },
  { state: 'focus', figma: 'Focus' },
  { state: 'select', figma: 'Select' },
  { state: 'inactive', figma: 'Inactive' },
];

/** Variantes que el set de Figma no trae (no se dibujan para que el comparador no las cuente de más). */
const ATOM_MISSING = new Set(['Single Icon=Yes, Size=sm, State=Inactive, Contrast=On card']);

const BADGE_00 = '00';
const label = 'text-xs text-ds-text-neutral-body';

// Figma: 11666:4226
/**
 * Set "Tab (Atom)": Single Icon × Size × State × Contrast, cada Contrast sobre su superficie
 * (background/general/black y background/container/default-on-canva). Las pestañas Default no tienen relleno y se
 * funden con la superficie, como en Figma. State forzado con `state`; Focus agrega el outline de teclado.
 */
export const FigmaMatrixAtom: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex w-fit max-w-full flex-col">
      {SURFACES.map((s) => (
        <div key={s.contrast} className={`relative overflow-x-auto p-6 ${SURFACE[s.contrast]}`}>
          <div className="grid grid-cols-[auto_repeat(5,auto)] items-center justify-items-start gap-x-10 gap-y-4">
            <span className={label}>Contrast={s.figma}</span>
            {ATOM_STATES.map((st) => (
              <span key={st.state} className={label}>
                {st.figma}
              </span>
            ))}
            {(['No', 'Yes'] as const).map((single) =>
              SIZE_OPTIONS.map((size) => (
                <div key={`${single}-${size}`} role="tablist" aria-label={`Single Icon ${single}, ${size}, ${s.figma}`} className="contents">
                  <span className={label}>
                    Single Icon={single}, {size}
                  </span>
                  {ATOM_STATES.map((st) => {
                    const name = `Single Icon=${single}, Size=${size}, State=${st.figma}, Contrast=${s.figma}`;
                    if (ATOM_MISSING.has(name)) return <span key={st.state} />;
                    const common = { value: name, size, contrast: s.contrast, state: st.state, icon: 'heart', badge: BADGE_00, 'data-figma': name } as const;
                    return single === 'Yes' ? (
                      <Tab key={st.state} {...common} aria-label="Mis documentos" />
                    ) : (
                      <Tab key={st.state} {...common}>
                        Mis documentos
                      </Tab>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};

const OPTIONS = [
  { figma: 'two', n: 2 },
  { figma: 'three', n: 3 },
  { figma: 'four', n: 4 },
  { figma: 'five', n: 5 },
  { figma: 'six', n: 6 },
  { figma: 'more options', n: 6, more: true },
] as const;

const FIGMA_SIZE: Record<TabsSize, string> = { md: 'Md', sm: 'Sm' };

// Figma: 11793:14729
/**
 * Set "Tab": Options × Size × Contrast, cada Contrast sobre su superficie. La primera pestaña está
 * seleccionada. En "two" Figma envuelve el contenedor en un marco transparente (con un duplicado "mobile" que solo se
 * ve en móvil): aquí el marco lleva `data-figma` y el contenedor va dentro.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="flex w-fit max-w-full flex-col">
      {SURFACES.map((s) => (
        <div key={s.contrast} className={`relative flex flex-col items-start gap-4 overflow-x-auto p-6 ${SURFACE[s.contrast]}`}>
          <span className={label}>Contrast={s.figma}</span>
          {SIZE_OPTIONS.map((size) =>
            OPTIONS.map((o) => {
              const name = `Options=${o.figma}, Size=${FIGMA_SIZE[size]}, Contrast=${s.figma}`;
              const list = (
                <TabList
                  aria-label={name}
                  rootProps={o.figma === 'two' ? undefined : { 'data-figma': name }}
                  overflow={
                    'more' in o ? (
                      <TabOverflow label={`Más pestañas ${name}`}>
                        <DropdownMenuItem>Mis documentos</DropdownMenuItem>
                      </TabOverflow>
                    ) : undefined
                  }
                >
                  {Array.from({ length: o.n }, (_, i) => (
                    <Tab key={i} value={`t${i}`} icon="heart" badge={BADGE_00}>
                      <span data-figma-part="En alistamiento">Mis documentos</span>
                    </Tab>
                  ))}
                </TabList>
              );
              return (
                <Tabs key={name} size={size} contrast={s.contrast} defaultValue="t0">
                  {o.figma === 'two' ? (
                    <span data-figma={name} className="inline-flex gap-ds-space-general-lg">
                      {list}
                    </span>
                  ) : (
                    list
                  )}
                </Tabs>
              );
            })
          )}
        </div>
      ))}
    </div>
  ),
};

// ───────────────────────── Tests ─────────────────────────

/** Test: roles, aria-selected/controls/labelledby, roving tabindex y teclado con activación automática. */
export const KeyboardAutomaticTest: Story = {
  tags: ['!autodocs'],
  args: { onValueChange: fn() },
  render: (args) => <SampleTabs {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('tablist', { name: 'Secciones del espacio' });
    const inicio = canvas.getByRole('tab', { name: /Inicio/ });
    const documentos = canvas.getByRole('tab', { name: /Documentos/ });
    const proyectos = canvas.getByRole('tab', { name: /Proyectos/ });
    const archivo = canvas.getByRole('tab', { name: /Archivo/ });
    await expect(list).toContainElement(inicio);
    await expect(inicio).toHaveAccessibleName('Inicio 3 sin leer');

    // Selección inicial, paneles enlazados y roving tabindex
    await expect(inicio).toHaveAttribute('aria-selected', 'true');
    await waitFor(() => expect(inicio).toHaveAttribute('tabindex', '0'));
    await expect(documentos).toHaveAttribute('tabindex', '-1');
    const panel = canvas.getByRole('tabpanel');
    await expect(panel).toHaveAttribute('id', inicio.getAttribute('aria-controls'));
    await expect(panel).toHaveAccessibleName(/Inicio/);
    await expect(archivo).toBeDisabled();

    // Tab entra en la pestaña seleccionada; flechas mueven y seleccionan
    await userEvent.tab();
    await expect(inicio).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(documentos).toHaveFocus();
    await expect(documentos).toHaveAttribute('aria-selected', 'true');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('documentos');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('doce documentos');

    // Fin salta a la última habilitada (Archivo está deshabilitada) y la derecha vuelve al principio
    await userEvent.keyboard('{End}');
    await expect(proyectos).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(inicio).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(proyectos).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(inicio).toHaveFocus();
    await expect(inicio).toHaveAttribute('aria-selected', 'true');

    // Tab sale del tablist al panel (enfocable)
    await userEvent.tab();
    await expect(canvas.getByRole('tabpanel')).toHaveFocus();

    // Clic selecciona; la deshabilitada no
    await userEvent.click(proyectos);
    await expect(proyectos).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(archivo);
    await expect(proyectos).toHaveAttribute('aria-selected', 'true');
  },
};

/** Test: activación manual, las flechas solo mueven el foco; Enter y Espacio seleccionan. */
export const KeyboardManualTest: Story = {
  tags: ['!autodocs'],
  args: { activationMode: 'manual', onValueChange: fn() },
  render: (args) => <SampleTabs {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const inicio = canvas.getByRole('tab', { name: /Inicio/ });
    const documentos = canvas.getByRole('tab', { name: /Documentos/ });
    const proyectos = canvas.getByRole('tab', { name: /Proyectos/ });
    await waitFor(() => expect(inicio).toHaveAttribute('tabindex', '0'));
    inicio.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(documentos).toHaveFocus();
    await expect(documentos).toHaveAttribute('aria-selected', 'false');
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await userEvent.keyboard('{Enter}');
    await expect(documentos).toHaveAttribute('aria-selected', 'true');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('documentos');
    await userEvent.keyboard('{ArrowRight}');
    await expect(proyectos).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(proyectos).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Sin proyectos');
  },
};

/** Test: sin defaultValue se selecciona la primera habilitada; solo ícono con nombre accesible; controlado. */
export const ControlledAndIconOnlyTest: Story = {
  tags: ['!autodocs'],
  render: function Render() {
    const [value, setValue] = useState('b');
    return (
      <div className="flex flex-col gap-4">
        <Tabs value={value} onValueChange={setValue}>
          <TabList aria-label="Controlado">
            <Tab value="a">Uno</Tab>
            <Tab value="b">Dos</Tab>
          </TabList>
          <TabPanel value="a">Panel uno</TabPanel>
          <TabPanel value="b">Panel dos</TabPanel>
        </Tabs>
        <span data-testid="valor">{value}</span>
        <Tabs>
          <TabList aria-label="Solo ícono">
            <Tab value="x" icon="heart" aria-label="Favoritos" disabled />
            <Tab value="y" icon="setting" aria-label="Ajustes" />
          </TabList>
          <TabPanel value="x">Panel favoritos</TabPanel>
          <TabPanel value="y">Panel ajustes</TabPanel>
        </Tabs>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'Dos' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(canvas.getByRole('tab', { name: 'Uno' }));
    await expect(canvas.getByTestId('valor')).toHaveTextContent('a');
    await expect(canvas.getByRole('tab', { name: 'Uno' })).toHaveAttribute('aria-selected', 'true');
    // La primera está deshabilitada: se selecciona y entra en el orden de Tab la segunda
    const ajustes = canvas.getByRole('tab', { name: 'Ajustes' });
    await waitFor(() => expect(ajustes).toHaveAttribute('aria-selected', 'true'));
    await waitFor(() => expect(ajustes).toHaveAttribute('tabindex', '0'));
    await expect(canvas.getByRole('tab', { name: 'Favoritos' })).toBeDisabled();
  },
};

/** Test: el botón Dots abre el menú de desborde y elegir una sección la selecciona y la muestra. */
export const OverflowTest: Story = {
  tags: ['!autodocs'],
  render: (args) => <OverflowDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const more = canvas.getByRole('button', { name: 'Más secciones' });
    await expect(canvas.getByRole('tablist')).not.toContainElement(more);
    await userEvent.click(more);
    const doc = within(canvasElement.ownerDocument.body);
    const item = await doc.findByRole('menuitem', { name: 'Reportes' });
    await userEvent.click(item);
    const tab = await canvas.findByRole('tab', { name: 'Reportes' });
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Contenido de Reportes');
    // El foco pasa a la pestaña elegida
    await waitFor(() => expect(tab).toHaveFocus());
  },
};

/**
 * Test de reflow (WCAG 1.4.10): en un ancho de 320 px las pestañas no caben. La lista hace scroll dentro de la
 * píldora, la página no se desborda y la pestaña enfocada con flechas queda a la vista.
 */
export const NarrowReflowTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <div data-testid="narrow" className="w-80 max-w-full overflow-hidden">
      <SampleTabs {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('tablist');
    const box = canvas.getByTestId('narrow');
    await expect(list.scrollWidth).toBeGreaterThan(list.clientWidth);
    await expect(list).toHaveStyle({ overflowX: 'auto' });
    const doc = canvasElement.ownerDocument.documentElement;
    await expect(doc.scrollWidth).toBeLessThanOrEqual(canvasElement.ownerDocument.defaultView?.innerWidth ?? Infinity);
    canvas.getByRole('tab', { name: /Inicio/ }).focus();
    await userEvent.keyboard('{End}');
    // Archivo está deshabilitada: End va a Proyectos
    const last = canvas.getByRole('tab', { name: /Proyectos/ });
    await expect(last).toHaveFocus();
    await waitFor(() => {
      const t = last.getBoundingClientRect();
      const l = list.getBoundingClientRect();
      expect(t.right).toBeLessThanOrEqual(l.right + 1);
      expect(t.left).toBeGreaterThanOrEqual(l.left - 1);
    });
    await expect(box.scrollWidth).toBeLessThanOrEqual(box.clientWidth);
  },
};

export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Tabs' })).toBeInTheDocument();
    // Las muestras traen sus propias pestañas: las de la página son las tres primeras del documento
    const tabs = canvas.getAllByRole('tab').slice(0, 3);
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Tabs en Figma:']);
    await expect(canvasElement.querySelectorAll('[data-doc-mark]').length).toBeGreaterThan(0);
    await userEvent.click(tabs[1]);
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}'); // activación automática
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Tabs' }); // sin Storybook: solo lectura
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
