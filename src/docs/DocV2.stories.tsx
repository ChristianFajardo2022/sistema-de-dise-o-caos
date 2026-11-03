import type { Meta, StoryObj } from '@storybook/react';
import { expect, waitFor } from 'storybook/test';
import { Button } from '../components/Button';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Icon } from '../components/Icon';
import { ModalPanel } from '../components/Modal';
import { Tab, TabList, Tabs } from '../components/Tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/Table';
import { TooltipBubble } from '../components/Tooltip';
import { DocAnatomyV2 } from './DocV2';
import type { DocAnatomyGroup } from './types';

/*
 * Historias de prueba permanentes de los bloques de la plantilla v2 (no salen en el menú ni en autodocs). Cada una
 * prueba la anatomía con una forma distinta de componente real: overlay abierto, vista más ancha que el lienzo,
 * varias instancias y compuestos, y ancho completo. El `play` comprueba el contrato `data-doc-mark*` / `data-doc-dim*`:
 * cada línea guía termina a 2 px o menos del borde de su parte y cada cota dice el valor real.
 */

const meta = {
  title: 'Docs/Plantilla v2/Anatomía',
  component: DocAnatomyV2,
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      // Mismo ancho útil que una sección de la página (columna de ~1079 menos el padding de la sección)
      <div className="@container mx-auto max-w-[839px] p-ds-primitives-space-6xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocAnatomyV2>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Distancia (px) de la punta de una línea guía al borde `side` de su parte, y del valor de cada cota al medido. */
async function checkContract(root: HTMLElement) {
  await waitFor(() => expect(root.querySelectorAll('[data-doc-mark]').length).toBeGreaterThan(0));
  for (const canvas of root.querySelectorAll<HTMLElement>('[data-doc-anatomy-canvas]')) {
    const view = canvas.querySelector<HTMLElement>('[data-doc-anatomy-view="marks"]');
    if (!view) throw new Error('Lienzo sin vista de marcadores');
    for (const mark of canvas.querySelectorAll<HTMLElement>('[data-doc-mark]')) {
      const n = mark.dataset.docMark;
      const all = view.querySelectorAll<HTMLElement>(mark.dataset.docMarkSelector ?? '');
      const index = Number(mark.dataset.docMarkIndex ?? 0);
      const part = index < 0 ? all[all.length + index] : all[index];
      await expect(part, `parte del marcador ${n}`).toBeTruthy();
      const line = canvas.querySelector<SVGLineElement>(`[data-doc-mark-line="${n}"]`);
      await expect(line, `línea del marcador ${n}`).toBeTruthy();
      const base = canvas.getBoundingClientRect();
      const r = part.getBoundingClientRect();
      const x2 = Number(line?.getAttribute('x2')) + base.left;
      const y2 = Number(line?.getAttribute('y2')) + base.top;
      const side = mark.dataset.docMarkSide;
      const gap =
        side === 'top' ? Math.abs(y2 - r.top) : side === 'bottom' ? Math.abs(y2 - r.bottom) : side === 'left' ? Math.abs(x2 - r.left) : Math.abs(x2 - r.right);
      // La punta cae en el borde y dentro del tramo de la parte
      const inside = side === 'top' || side === 'bottom' ? x2 >= r.left - 2 && x2 <= r.right + 2 : y2 >= r.top - 2 && y2 <= r.bottom + 2;
      await expect(gap, `marcador ${n}: distancia al borde`).toBeLessThanOrEqual(2);
      await expect(inside, `marcador ${n}: dentro de la parte`).toBe(true);
    }
    const dims = canvas.querySelector<HTMLElement>('[data-doc-anatomy-view="dims"]');
    for (const dim of canvas.querySelectorAll<SVGElement>('[data-doc-dim="padding"]')) {
      const el = dims?.querySelectorAll<HTMLElement>(dim.dataset.docDimSelector ?? '')[Number(dim.dataset.docDimIndex ?? 0)];
      const side = dim.dataset.docDimSide as 'top' | 'bottom' | 'left' | 'right';
      const real = el ? parseFloat(getComputedStyle(el)[`padding${side[0].toUpperCase()}${side.slice(1)}` as 'paddingTop']) : NaN;
      await expect(Number(dim.dataset.docDimValue)).toBeCloseTo(real, 0);
    }
  }
}

// ───────────────────────── (a) overlays abiertos ─────────────────────────

const overlayGroups: DocAnatomyGroup[] = [
  {
    canvases: [
      {
        label: 'Burbuja sobre su disparador',
        preview: (
          <div className="flex flex-col items-center gap-ds-space-general-md">
            <TooltipBubble>Descargar reporte</TooltipBubble>
            <Button iconOnly variant="secondary" size="sm" aria-label="Descargar reporte">
              <Icon name="download" size={20} variant="line" />
            </Button>
          </div>
        ),
        marks: [
          { n: 1, selector: '[data-figma-part="Content"]', side: 'left' },
          { n: 2, selector: '[data-figma-part="Arrow"]', side: 'left' },
          { n: 3, selector: 'button', side: 'bottom' },
        ],
        dimensions: [
          { kind: 'padding', selector: '[data-figma-part="Content"]', side: 'left' },
          { kind: 'gap', from: '[data-figma-part="div"]', to: 'button', axis: 'y' },
        ],
      },
    ],
    guidelines: ['Contenedor de la burbuja', 'Flecha', 'Disparador'],
  },
  {
    canvases: [
      {
        label: 'Modal abierto',
        preview: (
          <ModalPanel title="Confirma el envío" description="Revisa los datos antes de continuar." primaryAction={{ label: 'Confirmar' }} secondaryAction={{ label: 'Cancelar' }} onClose={() => {}}>
            Puedes cambiar la dirección hasta que el envío salga.
          </ModalPanel>
        ),
        marks: [
          { n: 1, selector: '[data-figma-part="Header"]', side: 'left' },
          { n: 2, selector: '[data-figma-part="Heading"]', side: 'top' },
          { n: 3, selector: '[data-figma-part="Button corner "]', side: 'right' },
          { n: 4, selector: '[data-figma-part="CTA"]', side: 'bottom' },
        ],
      },
    ],
    guidelines: ['Encabezado', 'Título', 'Cerrar', 'Acciones'],
  },
];

/**
 * (a) Overlays abiertos: la forma estática (`TooltipBubble`, `ModalPanel`) en el flujo. El modal, más ancho que su
 * lienzo de dos columnas, se escala.
 */
export const OverlayAbierto: Story = {
  args: { groups: overlayGroups },
  play: async ({ canvasElement }) => {
    await checkContract(canvasElement);
    // Los dos marcadores de la izquierda del primer lienzo (contenedor y flecha) no se pisan: se separan solos
    const [one, two] = [...canvasElement.querySelectorAll<HTMLElement>('[data-doc-anatomy-canvas]')[0].querySelectorAll<HTMLElement>('[data-doc-mark]')];
    const dy = Math.abs(one.getBoundingClientRect().top - two.getBoundingClientRect().top);
    await expect(dy).toBeGreaterThanOrEqual(24);
  },
};

// ───────────────────────── (b) y (c) vistas anchas y compuestos ─────────────────────────

const PEOPLE = [
  ['Ana Pérez', 'Administración', 'Activa'],
  ['Hugo García', 'Soporte', 'Activa'],
  ['Lucía Torres', 'Ventas', 'Pendiente'],
];

const wideGroups: DocAnatomyGroup[] = [
  {
    canvases: [
      {
        label: 'Tabla a 960 px',
        width: 960,
        preview: (
          <Table label="Personas" layout="table">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PEOPLE.map(([name, area, state]) => (
                <TableRow key={name}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{area}</TableCell>
                  <TableCell>{state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ),
        marks: [
          { n: 1, selector: 'table', side: 'right' },
          { n: 2, selector: 'th', index: 0, side: 'top' },
          { n: 3, selector: 'th', index: 1, side: 'top' },
          { n: 4, selector: 'tbody tr', index: 0, side: 'left' },
          { n: 5, selector: 'tbody tr', index: 1, side: 'left' },
        ],
        dimensions: [
          { kind: 'padding', selector: '[data-figma-part="Cell table"]', side: 'left' },
          { kind: 'gap', from: 'tbody tr', fromIndex: 0, to: 'tbody tr', toIndex: 1, axis: 'y' },
          { kind: 'height', selector: 'tbody tr', index: 0 },
        ],
      },
    ],
    guidelines: ['Tabla', 'Encabezado de la primera columna', 'Encabezado de la segunda columna', 'Primera fila', 'Segunda fila'],
  },
  {
    canvases: [
      {
        label: 'Pestañas',
        preview: (
          <Tabs defaultValue="todos" size="md" contrast="on-canva">
            <TabList aria-label="Filtro de ejemplo">
              <Tab value="todos">Todos</Tab>
              <Tab value="activos">Activos</Tab>
              <Tab value="archivados">Archivados</Tab>
            </TabList>
          </Tabs>
        ),
        marks: [
          { n: 1, selector: '[role="tablist"]', side: 'left' },
          { n: 2, selector: '[role="tab"]', index: 0, side: 'top' },
          { n: 3, selector: '[role="tab"]', index: 1, side: 'top' },
          { n: 4, selector: '[role="tab"]', index: -1, side: 'top' },
        ],
        dimensions: [
          { kind: 'gap', from: '[role="tab"]', fromIndex: 0, to: '[role="tab"]', toIndex: 1 },
          { kind: 'height', selector: '[role="tab"]', index: -1 },
        ],
      },
    ],
    guidelines: ['Lista de pestañas', 'Pestaña activa', 'Segunda pestaña', 'Última pestaña'],
  },
];

/**
 * (b) Vista más ancha que el lienzo (Table a 960 px, escalada; las cifras son reales) y (c) varias instancias de un
 * compuesto (filas, encabezados y pestañas elegidas con `index`).
 */
export const VistaAnchaYCompuestos: Story = {
  args: { groups: wideGroups },
  play: async ({ canvasElement }) => {
    await checkContract(canvasElement);
    const view = canvasElement.querySelector<HTMLElement>('[data-doc-anatomy-view="marks"]');
    await waitFor(() => expect(Number(view?.dataset.docAnatomyScale)).toBeLessThan(1));
    // La cifra del alto es la real aunque la vista esté escalada
    const height = canvasElement.querySelector<SVGElement>('[data-doc-dim="height"]');
    const row = canvasElement.querySelector<HTMLElement>('[data-doc-anatomy-view="dims"] tbody tr');
    await expect(Number(height?.dataset.docDimValue)).toBeCloseTo(row?.offsetHeight ?? 0, 0);
  },
};

// ───────────────────────── (d) ancho completo ─────────────────────────

const fullGroups: DocAnatomyGroup[] = [
  {
    canvases: [
      {
        label: 'Header de escritorio (1440)',
        width: 1440,
        preview: (
          <Header
            layout="desktop"
            logo={<Icon name="homepage" size={24} variant="fill" />}
            homeHref="#inicio"
            items={[
              { id: 'inicio', label: 'Inicio', href: '#inicio', current: true },
              { id: 'pedidos', label: 'Pedidos', href: '#pedidos' },
              { id: 'ayuda', label: 'Ayuda', href: '#ayuda' },
            ]}
            user={{ name: 'Ana Pérez' }}
          />
        ),
        marks: [
          { n: 1, selector: '[data-figma-part="Header desktop"]', side: 'left' },
          { n: 2, selector: '[data-figma-part="Logo "]', side: 'top' },
          { n: 3, selector: '[data-figma-part="Menu list1"]', side: 'top' },
          { n: 4, selector: '[data-figma-part="Avatar"]', side: 'top' },
        ],
      },
    ],
    guidelines: ['Barra', 'Logo', 'Menú', 'Perfil'],
  },
  {
    canvases: [
      {
        label: 'Footer a todo el ancho',
        width: 'fill',
        preview: (
          <Footer
            type="portals"
            aboutTitle="Acerca de nosotros:"
            about="Texto de ejemplo para el bloque de presentación."
            contact={{ title: 'Contacto', items: [{ label: 'Correo', value: 'hola@ejemplo.com', href: 'mailto:hola@ejemplo.com' }] }}
            sections={[{ title: 'Legal', items: [{ label: 'Términos', href: '#terminos' }, { label: 'Privacidad', href: '#privacidad' }] }]}
            copyright="© 2026 Ejemplo"
          />
        ),
        marks: [
          { n: 1, selector: 'footer', side: 'left' },
          { n: 2, selector: 'h2, h3', index: 0, side: 'top' },
          { n: 3, selector: '[data-figma-part="Card accordion (Atom)"]', index: 0, side: 'right' },
        ],
        dimensions: [
          { kind: 'padding', selector: '[data-figma-part="Desktop"]', side: 'left' },
          { kind: 'padding', selector: '[data-figma-part="Card accordion (Atom)"]', index: 0, side: 'top' },
        ],
      },
    ],
    guidelines: ['Pie de página', 'Título del bloque de presentación', 'Primer grupo (acordeón en anchos chicos)'],
  },
];

/** (d) Componentes de ancho completo: Header dibujado a 1440 y escalado; Footer a todo el ancho del lienzo. */
export const AnchoCompleto: Story = {
  args: { groups: fullGroups },
  play: async ({ canvasElement }) => {
    await checkContract(canvasElement);
    const [header, footer] = canvasElement.querySelectorAll<HTMLElement>('[data-doc-anatomy-view="marks"]');
    await expect(header.offsetWidth).toBe(1440);
    await waitFor(() => expect(Number(header.dataset.docAnatomyScale)).toBeLessThan(1));
    // El Footer llena el lienzo sin escalar y sin salirse de él
    await expect(footer.dataset.docAnatomyScale).toBe('1');
    const canvas = footer.closest<HTMLElement>('[data-doc-anatomy-canvas]');
    await expect(footer.getBoundingClientRect().right).toBeLessThanOrEqual(canvas?.getBoundingClientRect().right ?? 0);
    // Las copias son ilustraciones: sin landmarks ni foco duplicados
    await expect(header).toHaveAttribute('inert');
  },
};
