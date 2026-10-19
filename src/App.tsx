import { useState } from 'react';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { Subtract } from './components/Subtract';
import { Mail, Lock, User, ShieldCheck, Plus, ArrowRight, Trash2, Download, Settings, RefreshCw } from 'lucide-react';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [textValue, setTextValue] = useState('Christian Camilo');
  const [searchValue, setSearchValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('Secret123!');
  const [errorValue, setErrorValue] = useState('usuario.invalido@domain');
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  const handleSimulateLoading = () => {
    setIsBtnLoading(true);
    setTimeout(() => setIsBtnLoading(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[var(--background-container-surface,#f6f8f9)] text-[var(--text-neutral-heading,#1d1c1c)] p-8 transition-colors duration-300 font-sans">
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-8 mb-8 border-b border-[var(--border-general-gray-fourth,#d0d4dc)]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-left m-0 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[var(--border-field-active,#aa3bff)]" />
            CAOS Design System
          </h1>
          <p className="text-sm text-[var(--text-neutral-body,#5e6165)] mt-1">
            Component Showcase — Input & Button Components
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg font-medium text-sm bg-[var(--background-container-default-on-card,#ffffff)] border border-[var(--border-general-gray-tertiary,#898e98)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm cursor-pointer"
        >
          {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>
      </header>

      <main className="max-w-4xl mx-auto space-y-10 text-left">
        {/* ================================================================= */}
        {/* BUTTON COMPONENT MATRIX                                            */}
        {/* ================================================================= */}
        <section className="bg-[var(--background-field-surface,#ffffff)] p-6 rounded-2xl shadow-sm border border-[var(--border-general-gray-fifth,#e5e8ec)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold m-0 text-left">Matriz del Componente Button</h2>
            <Button
              size="sm"
              variant="tertiary"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleSimulateLoading}
            >
              Simular Carga
            </Button>
          </div>

          {/* 1. Variants Showcase */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-neutral-body,#5e6165)] mb-3">
                Variantes Principales (Variants)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Primary Button
                </Button>
                <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Secondary Button
                </Button>
                <Button variant="tertiary">Tertiary Button</Button>
                <Button variant="destructive" leftIcon={<Trash2 className="w-4 h-4" />}>
                  Destructive
                </Button>
                <Button variant="link">Link Button</Button>
              </div>
            </div>

            {/* 2. States Matrix */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-neutral-body,#5e6165)] mb-3">
                Estados (States & Loading)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" loading={isBtnLoading}>
                  {isBtnLoading ? 'Guardando...' : 'Estado Normal / Carga'}
                </Button>
                <Button variant="secondary" loading>
                  Cargando...
                </Button>
                <Button variant="primary" disabled>
                  Deshabilitado
                </Button>
                <Button variant="destructive" state="delete">
                  Confirmar Borrado
                </Button>
              </div>
            </div>

            {/* 3. Sizes Matrix */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-neutral-body,#5e6165)] mb-3">
                Tamaños (Sizes: XS, SM, MD, LG)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs" variant="primary">
                  Size XS (32px)
                </Button>
                <Button size="sm" variant="primary">
                  Size SM (40px)
                </Button>
                <Button size="md" variant="primary">
                  Size MD (48px)
                </Button>
                <Button size="lg" variant="primary">
                  Size LG (56px)
                </Button>
              </div>
            </div>

            {/* 4. Icon Only Mode */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-neutral-body,#5e6165)] mb-3">
                Modo Solo Icono (Icon Only)
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs" iconOnly variant="primary" aria-label="Ajustes">
                  <Settings className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" iconOnly variant="secondary" aria-label="Descargar">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="md" iconOnly variant="primary" aria-label="Agregar">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button size="lg" iconOnly variant="destructive" aria-label="Eliminar">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* INPUT COMPONENT SHOWCASE                                          */}
        {/* ================================================================= */}
        <section className="bg-[var(--background-field-surface,#ffffff)] p-6 rounded-2xl shadow-sm border border-[var(--border-general-gray-fifth,#e5e8ec)]">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 m-0 text-left">
            <span>Variantes de Estado de Input</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Nombre de usuario (Default)"
                secondaryLabel="Opcional"
                placeholder="Ej. camilofhernandez"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                helperText="Nombre visible en la plataforma"
                leftIcon={<User className="w-4 h-4 text-gray-400" />}
                tooltip="Nombre oficial registrado"
              />
            </div>

            <div>
              <Input
                label="Búsqueda global (Search Type / Active)"
                inputType="search"
                placeholder="Buscar componente o token..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                helperText="Presiona Enter para buscar"
                state="active"
              />
            </div>

            <div>
              <Input
                label="Contraseña (Password Type)"
                inputType="password"
                placeholder="Ingresa tu contraseña"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                helperText="Haz clic en el icono del ojo para alternar visibilidad"
                leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
              />
            </div>

            <div>
              <Input
                label="Correo electrónico (Error State)"
                inputType="email"
                value={errorValue}
                onChange={(e) => setErrorValue(e.target.value)}
                errorText="El formato del correo electrónico no es válido"
                leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
              />
            </div>
          </div>
        </section>

        <section className="bg-[var(--background-field-surface,#ffffff)] p-6 rounded-2xl shadow-sm border border-[var(--border-general-gray-fifth,#e5e8ec)]">
          <h2 className="text-xl font-semibold mb-6 m-0 text-left">
            Componente Subtract de Figma
          </h2>
          <div className="flex flex-wrap items-start gap-8">
            <div className="rounded-2xl bg-white p-4">
              <Subtract width={184} />
            </div>
            <dl className="m-0 grid gap-4 text-sm">
              <div>
                <dt className="font-semibold">
                  background/container/default-on-canva
                </dt>
                <dd className="m-0 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block h-4 w-4 rounded border border-black/10 bg-[#1d1c1c]"
                  />
                  #1D1C1C
                </dd>
              </div>
              <div>
                <dt className="font-semibold">radius/general/2xl</dt>
                <dd className="m-0">24 px</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
