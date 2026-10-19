import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Mail, Lock, Search } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'Form Controls/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    inputType: {
      control: 'select',
      options: ['text', 'search', 'password', 'email', 'number', 'tel'],
      description: 'Tipo de input HTML',
    },
    state: {
      control: 'select',
      options: ['default', 'filled', 'active', 'disabled', 'error', 'success'],
      description: 'Estado de validación o interacción',
    },
    sizeVariant: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del componente',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Ocupa el 100% del contenedor padre',
    },
    disabled: {
      control: 'boolean',
      description: 'Deshabilita el campo visual y funcionalmente',
    },
    required: {
      control: 'boolean',
      description: 'Marca el campo como obligatorio',
    },
  },
  args: {
    label: 'Nombre de usuario',
    placeholder: 'Ingresa tu usuario...',
    inputType: 'text',
    state: 'default',
    sizeVariant: 'md',
    fullWidth: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Nombre completo',
    placeholder: 'Ej. Christian Camilo',
    helperText: 'Escribe tu nombre oficial registrado',
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: 'Correo electrónico',
    inputType: 'email',
    placeholder: 'correo@dominio.com',
    leftIcon: <Mail className="w-4 h-4 text-gray-400" />,
  },
};

export const SearchType: Story = {
  args: {
    label: 'Búsqueda global',
    inputType: 'search',
    placeholder: 'Buscar componentes, tokens...',
    leftIcon: <Search className="w-4 h-4 text-gray-400" />,
  },
};

export const PasswordType: Story = {
  args: {
    label: 'Contraseña de acceso',
    inputType: 'password',
    placeholder: '••••••••',
    leftIcon: <Lock className="w-4 h-4 text-gray-400" />,
    helperText: 'Haz clic en el ojo para alternar la visibilidad',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Correo electrónico',
    value: 'correo-invalido-sin-arroba',
    errorText: 'Introduce una dirección de correo electrónico válida.',
    leftIcon: <Mail className="w-4 h-4 text-gray-400" />,
  },
};

export const SuccessState: Story = {
  args: {
    label: 'Verificación de cuenta',
    value: 'verificado@interrapidisimo.com',
    state: 'success',
    successText: 'Cuenta verificada con éxito',
  },
};

export const DisabledState: Story = {
  args: {
    label: 'Código asignado',
    value: 'CAOS-8026-2056',
    state: 'disabled',
    disabled: true,
    helperText: 'Este campo no es modificable',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <Input sizeVariant="sm" label="Tamaño Small (sm - 40px)" placeholder="Pequeño..." />
      <Input sizeVariant="md" label="Tamaño Medium (md - 48px)" placeholder="Mediano..." />
      <Input sizeVariant="lg" label="Tamaño Large (lg - 56px)" placeholder="Grande..." />
    </div>
  ),
};
