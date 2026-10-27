import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { SearchInput } from './SearchInput';
import type { SearchInputCategory, SearchInputState, SearchInputSuggestions } from './SearchInput.types';

const CATEGORIES: SearchInputCategory[] = [
  { value: 'todo', label: 'Todo' },
  { value: 'productos', label: 'Productos' },
  { value: 'ayuda', label: 'Ayuda' },
];

const KEYWORDS = ['Configuración de la cuenta', 'Cambiar contraseña', 'Métodos de pago', 'Preguntas frecuentes', 'Contacto'];

const SUGGESTIONS: SearchInputSuggestions = {
  keywords: KEYWORDS.slice(0, 3),
  recent: ['Facturas', 'Perfil', 'Soporte'],
  popular: ['Ofertas', 'Novedades', 'Guías'],
};

const STATES: SearchInputState[] = ['default', 'filled', 'active', 'burnt-in', 'disabled', 'error', 'success', 'helper'];
const SURFACE = 'bg-ds-background-general-black';

const meta: Meta<typeof SearchInput> = {
  title: 'Form Controls/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    state: {
      control: 'select',
      options: STATES,
      type: { name: 'enum', value: STATES },
      description: 'State forzado (solo documentación). `active` dibuja el panel abierto en el flujo.',
    },
    disabled: { control: 'boolean', type: { name: 'boolean' }, description: 'Estado Disabled' },
    readOnly: { control: 'boolean', type: { name: 'boolean' }, description: 'Estado Burnt-In (solo lectura)' },
    placeholder: { control: 'text', type: { name: 'string' }, description: 'Prop Placeholder de Figma' },
    label: { control: 'text', type: { name: 'string' }, description: 'Nombre accesible del campo (sr-only)' },
    helperText: { control: 'text', type: { name: 'string' }, description: 'Mensaje de ayuda (borde de información)' },
    errorText: { control: 'text', type: { name: 'string' }, description: 'Mensaje de error' },
    successText: { control: 'text', type: { name: 'string' }, description: 'Mensaje de éxito' },
  },
  args: {
    label: 'Buscar en el sitio',
    placeholder: 'Buscar',
    categories: CATEGORIES,
    suggestions: SUGGESTIONS,
    state: 'default',
    disabled: false,
    readOnly: false,
    onSearch: fn(),
    onValueChange: fn(),
    onCategoryChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-[495px] pb-[420px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Las palabras clave se filtran con lo escrito; cada búsqueda se suma a las recientes y la papelera las borra. */
function InteractiveDemo(args: ComponentProps<typeof SearchInput>) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(['Facturas', 'Perfil']);
  const [last, setLast] = useState<string | null>(null);
  const keywords = KEYWORDS.filter((k) => k.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 3);
  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        {...args}
        value={query}
        onValueChange={setQuery}
        suggestions={{ keywords, recent, popular: SUGGESTIONS.popular }}
        onClearRecent={() => setRecent([])}
        onSearch={(text, category) => {
          args.onSearch?.(text, category);
          if (!text.trim()) return;
          setLast(`${text} (${category})`);
          setRecent((r) => [text, ...r.filter((x) => x !== text)].slice(0, 3));
        }}
      />
      <p role="status" className="m-0 text-ds-typography-body-size-sm text-ds-text-neutral-white">
        {last ? `Última búsqueda: ${last}` : ''}
      </p>
    </div>
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveDemo {...args} />,
};

/** Sin `categories` no se dibujan el selector ni el separador. */
export const WithoutCategories: Story = {
  args: { categories: undefined },
};

/** Mensajes debajo de la barra (NotificationText): error > éxito > ayuda. */
export const Messages: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <SearchInput {...args} suggestions={undefined} errorText="No se pudo completar la búsqueda" />
      <SearchInput {...args} suggestions={undefined} successText="Búsqueda guardada" />
      <SearchInput {...args} suggestions={undefined} helperText="Escribe al menos tres letras" />
    </div>
  ),
};

// ───────────────────────── Figma ─────────────────────────

const FIGMA_PANEL: SearchInputSuggestions = {
  keywords: ['Palabra clave', 'Palabra clave', 'Palabra clave'],
  recent: ['Text', 'Text', 'Text'],
  popular: ['Text', 'Text', 'Text'],
};

const FIGMA_VARIANTS: { name: string; props: Partial<ComponentProps<typeof SearchInput>> }[] = [
  { name: 'Default', props: {} },
  { name: 'Burnt-In', props: { state: 'burnt-in' } },
  { name: 'Disabled', props: { state: 'disabled' } },
  { name: 'Error', props: { state: 'error' } },
  { name: 'Confirmation', props: { state: 'success' } },
  { name: 'Helper text', props: { state: 'helper' } },
  { name: 'Active/Focus', props: { state: 'active', suggestions: FIGMA_PANEL, onClearRecent: () => {}, onClearPopular: () => {} } },
  { name: 'Filled', props: { state: 'filled', defaultValue: 'Placeholder' } },
];

/**
 * Las 8 variantes del set "Search input (Avance)". Figma no dibuja mensajes en Error, Confirmation ni Helper text:
 * solo cambia el trazo. Active/Focus dibuja el panel en el flujo (sobre la fila siguiente, como en Figma).
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [(Story) => <Story />],
  render: () => (
    <div className={`grid w-fit grid-cols-[repeat(2,495px)] items-start gap-x-6 gap-y-10 p-6 ${SURFACE}`}>
      {FIGMA_VARIANTS.map(({ name, props }) => (
        <div key={name} className={`flex flex-col gap-2 ${name === 'Active/Focus' ? 'pb-[396px]' : ''}`}>
          <span className="text-ds-typography-body-size-xs text-ds-text-neutral-white">{name}</span>
          <SearchInput
            label="Buscar"
            placeholder="Placeholder"
            categories={[{ value: 'label', label: 'Label' }]}
            rootProps={{ 'data-figma': `State=${name}` }}
            {...props}
          />
        </div>
      ))}
    </div>
  ),
};

// ───────────────────────── pruebas ─────────────────────────

const renderTest = (args: ComponentProps<typeof SearchInput>) => (
  <div className="flex flex-col items-start gap-4">
    <SearchInput {...args} />
    <button type="button">Siguiente</button>
  </div>
);

/** APG Combobox: el foco abre el panel, las flechas recorren las tres secciones y Enter elige y busca. */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  args: { helperText: 'Escribe al menos tres letras', onSuggestionSelect: fn() },
  render: renderTest,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const combo = canvas.getByRole('combobox', { name: 'Buscar en el sitio' });
    await expect(combo).toHaveAttribute('aria-expanded', 'false');
    await expect(combo).toHaveAccessibleDescription('Escribe al menos tres letras');
    const option = (name: string) => canvas.getByRole('option', { name });

    await userEvent.click(combo);
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
    await expect(canvas.getByRole('listbox', { name: 'Sugerencias' })).toBeVisible();
    await expect(canvas.getByRole('listbox', { name: 'Búsquedas recientes' })).toBeVisible();
    await expect(combo).not.toHaveAttribute('aria-activedescendant');

    await userEvent.keyboard('{ArrowDown}');
    await expect(combo).toHaveAttribute('aria-activedescendant', option(KEYWORDS[0]).id);
    await expect(option(KEYWORDS[0])).toHaveAttribute('aria-selected', 'true');
    // 3 palabras clave y el primer chip de recientes
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Facturas').id);
    await expect(combo).toHaveFocus();
    // Flecha arriba desde la primera vuelve al texto
    await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}{ArrowUp}');
    await expect(combo).not.toHaveAttribute('aria-activedescendant');
    await userEvent.keyboard('{ArrowUp}');
    await expect(combo).toHaveAttribute('aria-activedescendant', option('Guías').id);

    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));
    await expect(combo).toHaveValue('Guías');
    await expect(args.onSuggestionSelect).toHaveBeenCalledWith('Guías', 'popular');
    await expect(args.onSearch).toHaveBeenLastCalledWith('Guías', 'todo');

    // Cerrado: Flecha abajo reabre; Esc cierra y, cerrado, borra el texto
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));
    await expect(combo).toHaveValue('Guías');
    await userEvent.keyboard('{Escape}');
    await expect(combo).toHaveValue('');
  },
};

/** Enter sin opción activa y el botón buscan lo escrito con la categoría; Tab llega a la papelera; salir cierra. */
export const SearchAndClearTest: Story = {
  tags: ['!autodocs'],
  args: { onClearRecent: fn() },
  render: renderTest,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const combo = canvas.getByRole('combobox', { name: 'Buscar en el sitio' });
    await userEvent.type(combo, 'hola');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('hola');
    await userEvent.keyboard('{Enter}');
    await expect(args.onSearch).toHaveBeenLastCalledWith('hola', 'todo');

    await userEvent.click(combo);
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
    const button = canvas.getByRole('button', { name: 'Buscar' });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(combo).toHaveAttribute('aria-expanded', 'true');
    await userEvent.tab();
    const clear = canvas.getByRole('button', { name: 'Borrar búsquedas recientes' });
    await expect(clear).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClearRecent).toHaveBeenCalledTimes(1);
    await expect(combo).toHaveFocus();

    await userEvent.click(button);
    await expect(args.onSearch).toHaveBeenLastCalledWith('hola', 'todo');
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));

    // El foco fuera del componente cierra el panel
    await userEvent.click(combo);
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'true'));
    await userEvent.click(canvas.getByRole('button', { name: 'Siguiente' }));
    await waitFor(() => expect(combo).toHaveAttribute('aria-expanded', 'false'));
  },
};

/** Selector de categoría: Menu Button con el nombre "Categoría: <elegida>"; la búsqueda usa la nueva categoría. */
export const CategoryTest: Story = {
  tags: ['!autodocs'],
  render: renderTest,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Categoría: Todo' });
    await userEvent.click(trigger);
    const menu = await within(document.body).findByRole('menu', { name: 'Categoría' });
    await waitFor(() => expect(menu).toBeVisible());
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Ayuda' }));
    await expect(args.onCategoryChange).toHaveBeenCalledWith('ayuda');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Categoría: Ayuda' })).toHaveFocus());

    const combo = canvas.getByRole('combobox', { name: 'Buscar en el sitio' });
    await userEvent.type(combo, 'x{Enter}');
    await expect(args.onSearch).toHaveBeenLastCalledWith('x', 'ayuda');
  },
};

/** Disabled, Burnt-In y Error: atributos nativos y ARIA. */
export const StatesTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <div className="flex flex-col gap-4">
      <SearchInput {...args} label="Deshabilitado" disabled />
      <SearchInput {...args} label="Solo lectura" readOnly defaultValue="Facturas" />
      <SearchInput {...args} label="Con error" errorText="Sin resultados" />
      <SearchInput {...args} label="Sin categorías" categories={undefined} suggestions={undefined} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disabled = canvas.getByRole('combobox', { name: 'Deshabilitado' });
    await expect(disabled).toBeDisabled();
    await expect(canvas.getAllByRole('button', { name: 'Buscar' })[0]).toBeDisabled();
    await expect(canvas.getAllByRole('button', { name: /^Categoría/ })[0]).toBeDisabled();

    const readOnly = canvas.getByRole('combobox', { name: 'Solo lectura' });
    await expect(readOnly).toHaveAttribute('readonly');
    await userEvent.click(readOnly);
    await expect(readOnly).toHaveAttribute('aria-expanded', 'false');

    const error = canvas.getByRole('combobox', { name: 'Con error' });
    await expect(error).toHaveAttribute('aria-invalid', 'true');
    await expect(error).toHaveAccessibleDescription('Sin resultados');

    const plain = canvas.getByRole('combobox', { name: 'Sin categorías' });
    await userEvent.click(plain);
    await expect(plain).toHaveAttribute('aria-expanded', 'false');
    // Botones: 3 de búsqueda + 3 selectores (el último no tiene)
    await expect(canvas.getAllByRole('button', { name: /^Categoría/ })).toHaveLength(3);
  },
};
