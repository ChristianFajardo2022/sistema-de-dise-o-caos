import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    'aria-label': {
      control: 'text',
      description: 'Nombre accesible del landmark (por defecto "Ruta de navegación")',
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#inicio" home />
      <BreadcrumbItem href="#productos">Productos</BreadcrumbItem>
      <BreadcrumbItem href="#calzado">Calzado</BreadcrumbItem>
      <BreadcrumbItem current>Zapatillas</BreadcrumbItem>
    </Breadcrumb>
  ),
};

/** Sin ícono home: todos los niveles con texto */
export const TextOnly: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#a">Inicio</BreadcrumbItem>
      <BreadcrumbItem href="#b">Cuenta</BreadcrumbItem>
      <BreadcrumbItem current>Preferencias</BreadcrumbItem>
    </Breadcrumb>
  ),
};

/** Textos largos: envuelven por defecto; con `truncate` se recortan con elipsis y llevan `title` */
export const LongItems: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <div className="flex max-w-md flex-col gap-6">
      <Breadcrumb {...args}>
        <BreadcrumbItem href="#a" home />
        <BreadcrumbItem href="#b">Documentación técnica de la plataforma de pagos</BreadcrumbItem>
        <BreadcrumbItem current>Guía de integración paso a paso para comercios</BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb {...args} aria-label="Ruta de navegación recortada">
        <BreadcrumbItem href="#a" home />
        <BreadcrumbItem href="#b" truncate>Documentación técnica de la plataforma de pagos</BreadcrumbItem>
        <BreadcrumbItem current truncate>Guía de integración paso a paso para comercios</BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

function ItemOnly({ figma, children, ...props }: { figma: string } & React.ComponentProps<typeof BreadcrumbItem>) {
  return (
    <ol className="m-0 flex list-none p-0">
      <BreadcrumbItem {...props} data-figma={figma}>{children}</BreadcrumbItem>
    </ol>
  );
}

const LABEL = 'text-xs text-ds-text-neutral-body';

/**
 * Cada variante de Figma una vez. Los nombres de variante se repiten entre los dos sets
 * (Type=Default), por eso el comparador se corre una vez por carpeta: esta historia
 * para el set Breadcrumb (el primer Type=Default) y FigmaMatrixText para Text Breadcrumb.
 */
export const FigmaMatrix: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="grid grid-cols-[auto_auto] items-center justify-items-start gap-x-8 gap-y-4">
        <span className={LABEL}>Breadcrumb · Type=Default</span>
        <Breadcrumb data-figma="Type=Default">
          <BreadcrumbItem href="#inicio" home chevron />
          <BreadcrumbItem href="#texto" chevron>Text</BreadcrumbItem>
          <BreadcrumbItem current chevron>Text</BreadcrumbItem>
        </Breadcrumb>
        <span className={LABEL}>Text Breadcrumb · Type=Default</span>
        <ItemOnly figma="Type=Default" href="#texto" chevron>Text</ItemOnly>
        <span className={LABEL}>Text Breadcrumb · Type=Select</span>
        <ItemOnly figma="Type=Select" current chevron>Text</ItemOnly>
      </div>
    </div>
  ),
};

/** Solo las variantes de Text Breadcrumb (Type=Default, Type=Select), con Chevron activo */
export const FigmaMatrixText: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="bg-ds-background-general-black p-6">
      <div className="grid grid-cols-[auto_auto] items-center justify-items-start gap-x-8 gap-y-4">
        <span className={LABEL}>Type=Default</span>
        <ItemOnly figma="Type=Default" href="#texto" chevron>Text</ItemOnly>
        <span className={LABEL}>Type=Select</span>
        <ItemOnly figma="Type=Select" current chevron>Text</ItemOnly>
      </div>
    </div>
  ),
};

/** Test: landmark con nombre, lista, página actual sin enlace y chevrons ocultos a lectores */
export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#inicio" home />
      <BreadcrumbItem href="#productos">Productos</BreadcrumbItem>
      <BreadcrumbItem current>Zapatillas</BreadcrumbItem>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole('navigation', { name: 'Ruta de navegación' });
    await expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
    // El ícono home solo expone "Inicio"
    await expect(canvas.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '#inicio');
    await expect(canvas.getByRole('link', { name: 'Productos' })).toBeVisible();
    // Página actual: texto con aria-current, no enlace
    await expect(canvas.queryByRole('link', { name: 'Zapatillas' })).toBeNull();
    await expect(canvas.getByText('Zapatillas').closest('[aria-current="page"]')).not.toBeNull();
    // Chevrons decorativos; el último ítem no lo muestra
    const separators = nav.querySelectorAll('[data-separator]');
    separators.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'));
    await expect(getComputedStyle(separators[2]).display).toBe('none');
    await expect(getComputedStyle(separators[0]).display).not.toBe('none');
  },
};

/** Test: Tab recorre los enlaces en orden y salta la página actual */
export const KeyboardTest: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#a">Uno</BreadcrumbItem>
      <BreadcrumbItem href="#b">Dos</BreadcrumbItem>
      <BreadcrumbItem current>Tres</BreadcrumbItem>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Uno' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Dos' })).toHaveFocus();
  },
};
