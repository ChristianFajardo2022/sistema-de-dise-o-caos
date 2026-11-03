import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ButtonLink } from './ButtonLink';
import type { ButtonLinkState } from './ButtonLink.types';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './ButtonLink.doc';
import docsJson from './ButtonLink.docs.json';

const meta: Meta<typeof ButtonLink> = {
  title: 'General Controls/Button link',
  component: ButtonLink,
  tags: ['autodocs'],
  // La página Docs usa la plantilla de documentación (ButtonLink.doc.tsx) con la referencia de código al final
  parameters: { docs: componentDocsParameters(doc, docsJson) },
  argTypes: argTypesFromDocsJson(docsJson, {
    state: {
      control: 'select',
      options: ['default', 'hover', 'focus', 'press', 'inactive'],
      description: 'State forzado (hover, focus y press solo para visualización)',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado inactive: sin href y con aria-disabled',
    },
    iconRight: {
      control: 'boolean',
      description: 'Icon right: ícono de enlace externo después del texto',
    },
  }),
  args: {
    children: 'Ver guía',
    href: '#',
    state: 'default',
    disabled: false,
    iconRight: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const STATES: ButtonLinkState[] = ['default', 'hover', 'focus', 'press', 'inactive'];

export const Default: Story = {};

export const WithoutIcon: Story = {
  args: { iconRight: false },
};

export const Inactive: Story = {
  args: { disabled: true },
};

/** Los 5 estados del component set de Figma, con y sin ícono. */
export const StatesMatrix: Story = {
  render: () => (
    <div className="max-w-full overflow-x-auto">
    <div className="grid w-max min-w-full grid-cols-[auto_repeat(5,auto)] items-center gap-x-8 gap-y-4">
      <span />
      {STATES.map((s) => (
        <span key={s} className="text-xs text-ds-text-neutral-body">{s}</span>
      ))}
      {[true, false].map((iconRight) => (
        <div key={String(iconRight)} className="contents">
          <span className="text-xs text-ds-text-neutral-body">{iconRight ? 'Icon right' : 'Sin ícono'}</span>
          {STATES.map((s) => (
            <div key={s}>
              <ButtonLink href="#" state={s} iconRight={iconRight}>Ver guía</ButtonLink>
            </div>
          ))}
        </div>
      ))}
    </div>
    </div>
  ),
};

/** Los 5 estados de `button/button-link` (Icon right activo, como el defecto de Figma), con `data-figma` = nombre exacto. */
export const FigmaMatrix: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8 bg-ds-background-general-black p-6">
      {STATES.map((s) => (
        <ButtonLink key={s} href="#" state={s} iconRight data-figma={`State=${s.charAt(0).toUpperCase() + s.slice(1)}`}>
          Ver guía
        </ButtonLink>
      ))}
    </div>
  ),
};

/** Test: rol link con href y nombre accesible */
export const LinkRoleTest: Story = {
  tags: ['!autodocs'],
  args: { href: '#destino', children: 'Ver detalle' },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Ver detalle' });
    await expect(link).toHaveAttribute('href', '#destino');
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
};

/** Test: inactivo tiene aria-disabled, no tiene href, no entra en el orden de tabulación y el clic no navega */
export const InactiveLinkTest: Story = {
  tags: ['!autodocs'],
  args: { disabled: true, href: '#destino', children: 'No disponible', onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'No disponible' });
    await expect(link).toHaveAttribute('aria-disabled', 'true');
    await expect(link).not.toHaveAttribute('href');
    await userEvent.click(link);
    await userEvent.tab();
    await expect(link).not.toHaveFocus();
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(window.location.hash).not.toBe('#destino');
  },
};

/** Test: con target="_blank" el nombre accesible avisa de la pestaña nueva */
export const NewTabNameTest: Story = {
  tags: ['!autodocs'],
  args: { href: 'https://example.com', target: '_blank', rel: 'noopener noreferrer', children: 'Documentación' },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: /Documentación.*pestaña nueva/ });
    await expect(link).toHaveAttribute('target', '_blank');
  },
};

/**
 * Sin `href`: `<button type="button">` real con el aspecto de Button link, para acciones en línea ("Reenviar").
 * Enter y Espacio son nativos; Inactive usa `disabled` nativo.
 */
export const ActionButton: Story = {
  args: { href: undefined, iconRight: false, children: 'Reenviar' },
};

/** Test: sin href es un botón y Enter y Espacio lo activan */
export const ActionButtonTest: Story = {
  tags: ['!autodocs'],
  args: { href: undefined, iconRight: false, children: 'Reenviar', onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Reenviar' });
    await expect(button).toHaveAttribute('type', 'button');
    await expect(within(canvasElement).queryByRole('link')).toBeNull();
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

/** Test: botón inactivo con disabled nativo */
export const ActionButtonInactiveTest: Story = {
  tags: ['!autodocs'],
  args: { href: undefined, iconRight: false, disabled: true, children: 'Reenviar', onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Reenviar' });
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await userEvent.tab();
    await expect(button).not.toHaveFocus();
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/** Test: la página Docs (plantilla v2) se dibuja con su encabezado, sus secciones y la referencia de código */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Button link' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Button link en Figma:']);
    await expect(canvas.getByRole('switch', { name: 'Modo oscuro' })).toBeInTheDocument();
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    // Con las flechas (activación automática)
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    // Sin Storybook no hay lienzo ni Personalizar: solo el bloque Props, de solo lectura
    const props = canvas.getByRole('table', { name: 'Props de ButtonLink' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
    await expect(within(props).queryByRole('switch')).not.toBeInTheDocument();
  },
};
