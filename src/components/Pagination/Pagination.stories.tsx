import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Pagination } from './Pagination';
import type { PaginationProps, PaginationType } from './Pagination.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { formatLiteral } from '../../docs/liveCode';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Pagination.doc';
import docsJson from './Pagination.docs.json';

/**
 * Lienzo de Desarrollo (`docsLive.render`, receta R6): la página la lleva el lienzo con `useState` y la paginación va
 * controlada, así que los botones, los números, el campo y Mostrar más cambian de página de verdad. `defaultPage` es la
 * página inicial del estado.
 */
function DocsCanvas(args: Record<string, unknown>) {
  const { page: _page, defaultPage, onPageChange: _onPageChange, ...rest } = args as Partial<PaginationProps>;
  const [page, setPage] = useState(defaultPage ?? 1);
  return (
    <div className="w-full">
      <Pagination totalPages={20} {...rest} page={page} onPageChange={setPage} />
    </div>
  );
}

/** Valor de una prop escrito como en JSX. */
const jsxProp = (name: string, value: unknown) =>
  typeof value === 'string' ? `${name}="${value.replace(/"/g, '&quot;')}"` : value === true ? name : `${name}={${formatLiteral(value)}}`;

/** Código de Desarrollo: el mismo estado del lienzo, listo para copiar (receta R6). */
function docsCode(args: Record<string, unknown>) {
  const { page: _page, defaultPage, onPageChange: _onPageChange, children: _children, ...rest } = args;
  const props = [
    ...Object.entries({ totalPages: 20, ...rest }).map(([name, value]) => jsxProp(name, value)),
    'page={page}',
    'onPageChange={(next) => setPage(next)}',
  ];
  return [`const [page, setPage] = useState(${formatLiteral(defaultPage ?? 1)});`, '', '<Pagination', ...props.map((p) => `  ${p}`), '/>'].join('\n');
}

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: componentDocsParameters(doc, docsJson),
    // La página es del estado del lienzo (R6): `page` queda fuera de Personalizar y `labels` no se puede escribir en un control
    docsLive: { render: DocsCanvas, code: docsCode, exclude: ['page', 'labels'] },
  },
  tags: ['autodocs'],
  // Las descripciones salen de Pagination.docs.json; aquí solo los controles y los tipos explícitos
  argTypes: argTypesFromDocsJson(docsJson, {
    type: { control: 'radio', options: ['numeric', 'input', 'more'], type: { name: 'enum', value: ['numeric', 'input', 'more'] } },
    totalPages: { control: 'number', type: { name: 'number' } },
    defaultPage: { control: 'number', type: { name: 'number' } },
    siblingCount: { control: 'number', type: { name: 'number' } },
    boundaryCount: { control: 'number', type: { name: 'number' } },
  }),
  args: { type: 'numeric', totalPages: 20, siblingCount: 2, boundaryCount: 0 },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveDemo(args: PaginationProps) {
  const [page, setPage] = useState(1);
  return <Pagination {...args} page={page} onPageChange={setPage} />;
}

export const Interactive: Story = { render: (args) => <InteractiveDemo {...args} /> };

export const WithEllipsis: Story = {
  args: { boundaryCount: 1, siblingCount: 1, defaultPage: 10 },
};

export const InputType: Story = { args: { type: 'input', defaultPage: 3 } };

export const MoreType: Story = { args: { type: 'more' } };

export const CustomLabels: Story = {
  args: {
    defaultPage: 2,
    totalPages: 8,
    labels: {
      navigation: 'Pagination',
      previous: 'Previous',
      next: 'Next',
      page: (p) => `Page ${p}`,
      status: (p, t) => `Page ${p} of ${t}`,
    },
  },
};

/**
 * Los 7 variantes del set `Pagination` (12048:7622) sobre la superficie del tema. La ventana numérica de 5 números
 * empieza en la página actual, como en Figma.
 */
const FIGMA: { name: string; type: PaginationType; page: number }[] = [
  { name: 'Type=numeric, Pages=initial', type: 'numeric', page: 1 },
  { name: 'Type=numeric, Pages=middle', type: 'numeric', page: 6 },
  { name: 'Type=numeric, Pages=final', type: 'numeric', page: 11 },
  { name: 'Type=input, Pages=initial', type: 'input', page: 1 },
  { name: 'Type=input, Pages=middle', type: 'input', page: 10 },
  { name: 'Type=input, Pages=final', type: 'input', page: 20 },
  { name: 'Type=More, Pages=initial', type: 'more', page: 1 },
];

export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div role="region" tabIndex={0} aria-label="Matriz de Pagination" className="max-w-full overflow-x-auto">
        <div className="grid grid-cols-[auto_auto] items-start justify-start gap-x-8 gap-y-8">
          {FIGMA.map((v) => (
            <div key={v.name} className="contents">
              <span className="text-xs text-ds-text-neutral-body">{v.name}</span>
              <div data-figma={v.name} className={v.type === 'input' ? 'w-fit' : 'w-62'}>
                <Pagination type={v.type} page={v.page} totalPages={20} aria-label={`Paginación ${v.name}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

/** Test: rol de navegación, página actual y botones en los extremos */
export const NavigationTest: Story = {
  tags: ['!autodocs'],
  args: { onPageChange: fn() },
  play: async ({ args, canvasElement }) => {
    const c = within(canvasElement);
    const nav = c.getByRole('navigation', { name: 'Paginación' });
    await expect(nav).toBeInTheDocument();
    await expect(c.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page');
    await expect(c.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    await expect(c.getAllByRole('listitem').length).toBe(7);
    await userEvent.click(c.getByRole('button', { name: 'Siguiente' }));
    await expect(args.onPageChange).toHaveBeenLastCalledWith(2);
    await expect(c.getByRole('button', { name: 'Página 2' })).toHaveAttribute('aria-current', 'page');
    await expect(c.getByRole('button', { name: 'Anterior' })).toBeEnabled();
    c.getByRole('button', { name: 'Página 4' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onPageChange).toHaveBeenLastCalledWith(4);
  },
};

/** Test: en la última página, Siguiente queda deshabilitado */
export const LastPageTest: Story = {
  tags: ['!autodocs'],
  args: { defaultPage: 20 },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
    await expect(c.getByRole('button', { name: 'Página 20' })).toHaveAttribute('aria-current', 'page');
  },
};

/** Test: la ventana de números empieza en la actual y cerca del final se queda en las últimas 5 */
export const WindowTest: Story = {
  tags: ['!autodocs'],
  args: { defaultPage: 6 },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const pages = () => c.getAllByRole('button').map((b) => b.getAttribute('aria-label')).filter((l) => l !== 'Anterior' && l !== 'Siguiente');
    await expect(pages()).toEqual(['Página 6', 'Página 7', 'Página 8', 'Página 9', 'Página 10']);
    await expect(c.getByRole('button', { name: 'Página 6' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(c.getByRole('button', { name: 'Página 10' }));
    await expect(pages()).toEqual(['Página 10', 'Página 11', 'Página 12', 'Página 13', 'Página 14']);
    await userEvent.click(c.getByRole('button', { name: 'Página 14' }));
    await userEvent.click(c.getByRole('button', { name: 'Página 15' }));
    await userEvent.click(c.getByRole('button', { name: 'Página 16' }));
    await userEvent.click(c.getByRole('button', { name: 'Página 17' }));
    await expect(pages()).toEqual(['Página 16', 'Página 17', 'Página 18', 'Página 19', 'Página 20']);
    await expect(c.getByRole('button', { name: 'Página 17' })).toHaveAttribute('aria-current', 'page');
  },
};

/** Test: con boundaryCount aparecen puntos suspensivos ocultos al lector */
export const EllipsisTest: Story = {
  tags: ['!autodocs'],
  args: { boundaryCount: 1, siblingCount: 1, defaultPage: 10 },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const labels = c.getAllByRole('button').map((b) => b.getAttribute('aria-label'));
    await expect(labels).toEqual(['Anterior', 'Página 1', 'Página 9', 'Página 10', 'Página 11', 'Página 20', 'Siguiente']);
    await expect(canvasElement.querySelectorAll('li[aria-hidden="true"]').length).toBe(2);
  },
};

/** Test: el campo valida el rango y confirma con Enter */
export const InputTest: Story = {
  tags: ['!autodocs'],
  args: { type: 'input', onPageChange: fn() },
  play: async ({ args, canvasElement }) => {
    const c = within(canvasElement);
    const field = c.getByRole('textbox', { name: 'Número de página' });
    await expect(field).toHaveValue('1');
    await userEvent.clear(field);
    await userEvent.type(field, '99{Enter}');
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(args.onPageChange).not.toHaveBeenCalled();
    await expect(c.getByText('Escribe un número entre 1 y 20')).toBeInTheDocument();
    await userEvent.clear(field);
    await userEvent.type(field, '12{Enter}');
    await expect(args.onPageChange).toHaveBeenCalledWith(12);
    await expect(field).not.toHaveAttribute('aria-invalid');
    await expect(field).toHaveValue('12');
    await userEvent.click(c.getByRole('button', { name: 'Anterior' }));
    await expect(field).toHaveValue('11');
  },
};

/** Test: "Mostrar más" avanza una página y se deshabilita en la última */
export const MoreTest: Story = {
  tags: ['!autodocs'],
  args: { type: 'more', totalPages: 2, onPageChange: fn() },
  play: async ({ args, canvasElement }) => {
    const c = within(canvasElement);
    await expect(c.getByText('Página 1 de 2')).toBeInTheDocument();
    await userEvent.click(c.getByRole('button', { name: 'Mostrar más' }));
    await expect(args.onPageChange).toHaveBeenCalledWith(2);
    await expect(c.getByText('Página 2 de 2')).toBeInTheDocument();
    await expect(c.getByRole('button', { name: 'Mostrar más' })).toBeDisabled();
  },
};

/** Página de documentación (plantilla v2), con Page dentro: la revisan vitest y axe. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Pagination' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Pagination en Figma:']);
    // Marcadores de la anatomía: uno por pauta (6 de numeric + 5 de input + 3 de more + 3 de Page)
    await expect(canvasElement.querySelectorAll('[data-doc-mark]')).toHaveLength(17);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Pagination' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
