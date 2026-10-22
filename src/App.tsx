import { useEffect, useId, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, type ButtonState, type ButtonProps } from './components/Button';
import { ButtonCorner } from './components/ButtonCorner';
import { ButtonLink } from './components/ButtonLink';
import { Checkbox } from './components/Checkbox';
import { Input, type InputState } from './components/Input';
import { Radio } from './components/Radio';
import { Subtract } from './components/Subtract';
import { AddIcon } from './icons/AddIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { ExportIcon } from './icons/ExportIcon';
import { SettingIcon } from './icons/SettingIcon';
import { TrashIcon } from './icons/TrashIcon';

type Theme = 'dark' | 'light';

/** Clases compartidas, todas con utilidades ds- generadas desde tokens.css */
const card =
  'rounded-ds-radius-container-on-card border border-ds-border-general-gray-fifth bg-ds-background-container-default-on-card p-ds-space-general-5xl';
const h2Class =
  'm-0 mb-ds-space-general-4xl text-ds-typography-heading-size-lg leading-ds-typography-heading-line-height-lg font-semibold text-ds-text-neutral-heading text-balance';
const h3Class =
  'm-0 mb-ds-space-general-xl text-ds-typography-body-size-md leading-ds-typography-body-line-height-short-md font-semibold text-ds-text-neutral-heading';
const noteClass =
  'm-0 text-ds-typography-body-size-sm leading-ds-typography-body-line-height-short-sm text-pretty';
/** Superficie oscura fija: Unicolor lleva texto e ícono blancos en ambos temas */
const darkSurface =
  'rounded-ds-radius-general-xl bg-ds-primitives-color-primary-n01 p-ds-space-general-4xl text-ds-primitives-color-primary-b01';

function Block({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-ds-space-general-lg">
      <h3 className={h3Class}>{title}</h3>
      {note && <p className={noteClass}>{note}</p>}
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={card}>
      <h2 id={id} className={h2Class}>
        {title}
      </h2>
      <div className="flex flex-col gap-ds-space-general-5xl">{children}</div>
    </section>
  );
}

const STATES: { state: ButtonState; label: string }[] = [
  { state: 'default', label: 'Default' },
  { state: 'hover', label: 'Hover' },
  { state: 'focus', label: 'Focus' },
  { state: 'press', label: 'Press' },
  { state: 'inactive', label: 'Inactive' },
  { state: 'delete', label: 'Delete' },
  { state: 'load', label: 'Load' },
];

type Row = { label: string; props: Partial<ButtonProps> & { variant: 'primary' | 'secondary' | 'tertiary' } };

const ROWS: Row[] = [
  { label: 'Primary', props: { variant: 'primary' } },
  { label: 'Secondary low', props: { variant: 'secondary', contrast: 'low' } },
  { label: 'Secondary high', props: { variant: 'secondary', contrast: 'high' } },
  { label: 'Tertiary', props: { variant: 'tertiary' } },
];
const UNICOLOR_ROWS: Row[] = [
  { label: 'Secondary low', props: { variant: 'secondary', contrast: 'low', unicolor: true } },
  { label: 'Secondary high', props: { variant: 'secondary', contrast: 'high', unicolor: true } },
  { label: 'Tertiary', props: { variant: 'tertiary', unicolor: true } },
];

function StateTable({ caption, rows }: { caption: string; rows: Row[] }) {
  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      className="overflow-x-auto rounded-ds-radius-general-sm"
    >
      <table className="border-separate border-spacing-ds-space-general-lg text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="sr-only">
              Tipo
            </th>
            {STATES.map((s) => (
              <th key={s.state} scope="col" className="font-normal text-ds-typography-body-size-sm">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="whitespace-nowrap pr-ds-space-general-xl font-normal text-ds-typography-body-size-sm">
                {row.label}
              </th>
              {STATES.map((s) => (
                <td key={s.state}>
                  {row.props.variant === 'tertiary' && s.state === 'load' ? (
                    <span className="text-ds-typography-body-size-sm">No aplica</span>
                  ) : (
                    <Button {...(row.props as ButtonProps)} state={s.state}>
                      Botón
                    </Button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const INPUT_STATES: { state: InputState; label: string; extra?: Record<string, unknown> }[] = [
  { state: 'default', label: 'Default' },
  { state: 'filled', label: 'Filled' },
  { state: 'active', label: 'Active' },
  { state: 'burnt-in', label: 'Burnt-in' },
  { state: 'disabled', label: 'Disabled' },
  { state: 'error', label: 'Error', extra: { errorText: 'Revisa este campo' } },
  { state: 'success', label: 'Success', extra: { successText: 'Dato verificado' } },
];

function InputStates() {
  return (
    <div className="grid grid-cols-1 gap-ds-space-general-4xl sm:grid-cols-2 lg:grid-cols-3">
      {INPUT_STATES.map(({ state, label, extra }) => (
        <Input
          key={state}
          label={label}
          state={state}
          defaultValue={state === 'default' ? undefined : 'Texto de ejemplo'}
          readOnly={state === 'burnt-in'}
          disabled={state === 'disabled'}
          {...extra}
        />
      ))}
    </div>
  );
}

function Selection() {
  const [plan, setPlan] = useState('mensual');
  const surfaces = [
    { contrast: 'positive' as const, className: 'bg-ds-background-general-black text-ds-text-neutral-white', title: 'Positive' },
    { contrast: 'negative' as const, className: 'bg-ds-background-general-white text-ds-text-neutral-black', title: 'Negative' },
  ];
  return (
    <div className="grid grid-cols-1 gap-ds-space-general-4xl md:grid-cols-2">
      {surfaces.map(({ contrast, className, title }) => (
        <div
          key={contrast}
          className={`${className} flex flex-col gap-ds-space-general-4xl rounded-ds-radius-general-xl border border-ds-border-general-gray-fifth p-ds-space-general-4xl`}
        >
          <p className={`${noteClass} font-semibold`}>{title}</p>
          <fieldset className="m-0 flex flex-col gap-ds-space-general-xl border-0 p-0">
            <legend className={`${noteClass} mb-ds-space-general-lg`}>Checkbox</legend>
            <Checkbox contrast={contrast} defaultChecked>
              Recibir novedades
            </Checkbox>
            <Checkbox contrast={contrast}>Aceptar términos</Checkbox>
            <Checkbox contrast={contrast} disabled>
              Opción no disponible
            </Checkbox>
          </fieldset>
          <fieldset className="m-0 flex flex-col gap-ds-space-general-xl border-0 p-0">
            <legend className={`${noteClass} mb-ds-space-general-lg`}>Radio</legend>
            {[
              ['mensual', 'Plan mensual'],
              ['anual', 'Plan anual'],
            ].map(([value, text]) => (
              <Radio
                key={value}
                contrast={contrast}
                name={`plan-${contrast}`}
                value={value}
                checked={plan === value}
                onChange={() => setPlan(value)}
              >
                {text}
              </Radio>
            ))}
            <Radio contrast={contrast} name={`plan-${contrast}-off`} disabled>
              Plan no disponible
            </Radio>
          </fieldset>
        </div>
      ))}
    </div>
  );
}

export function App() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, [loading]);

  const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <div className="min-h-dvh bg-ds-background-container-default-on-canva font-ds-primitives-typography-family-primary text-ds-text-neutral-heading">
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-ds-space-general-2xl px-ds-space-general-4xl py-ds-space-general-5xl">
        <div>
          <h1 className="m-0 text-ds-typography-heading-size-2xl leading-ds-typography-heading-line-height-2xl font-semibold text-ds-text-neutral-heading text-balance">
            Sistema de diseño CAOS
          </h1>
          <p className={`${noteClass} mt-ds-space-general-md`}>
            Muestra de los componentes disponibles, con los tokens exportados de Figma.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setTheme(nextTheme)}>
          {nextTheme === 'light' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
        </Button>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-ds-space-general-5xl px-ds-space-general-4xl pb-ds-space-general-6xl">
        <Section title="Button">
          <Block title="Type y Contrast" note="Primary, Secondary (low y high) y Tertiary.">
            <div className="flex flex-wrap items-center gap-ds-space-general-xl">
              <Button variant="primary" leftIcon={<AddIcon />}>
                Primary
              </Button>
              <Button variant="secondary" rightIcon={<ArrowRightIcon />}>
                Secondary low
              </Button>
              <Button variant="secondary" contrast="high">
                Secondary high
              </Button>
              <Button variant="tertiary">Tertiary</Button>
            </div>
          </Block>

          <Block title="Tamaños" note="md 56 · sm 48 · xs 32.">
            <div className="flex flex-wrap items-center gap-ds-space-general-xl">
              <Button size="md">md 56</Button>
              <Button size="sm">sm 48</Button>
              <Button size="xs">xs 32</Button>
            </div>
          </Block>

          <Block title="Icon-single" note="Botón cuadrado solo con ícono: exige aria-label.">
            <div className="flex flex-wrap items-center gap-ds-space-general-xl">
              <Button iconOnly size="md" variant="primary" aria-label="Agregar">
                <AddIcon />
              </Button>
              <Button iconOnly size="sm" variant="secondary" aria-label="Exportar">
                <ExportIcon />
              </Button>
              <Button iconOnly size="xs" variant="tertiary" aria-label="Ajustes">
                <SettingIcon />
              </Button>
              <Button iconOnly size="md" variant="primary" state="delete" aria-label="Eliminar">
                <TrashIcon />
              </Button>
            </div>
          </Block>

          <Block title="Load en uso" note="Con loading el botón queda ocupado y anuncia aria-busy.">
            <div>
              <Button variant="primary" loading={loading} onClick={() => setLoading(true)}>
                {loading ? 'Guardando' : 'Guardar cambios'}
              </Button>
            </div>
          </Block>

          <Block
            title="Estados"
            note="La prop state fuerza el aspecto solo para documentación; en uso normal salen de la interacción."
          >
            <StateTable caption="Estados de Button por tipo" rows={ROWS} />
          </Block>

          <Block
            title="Unicolor"
            note="Texto e ícono de un solo color. Va sobre superficie oscura; Inactive y Delete conservan sus colores."
          >
            <div className={darkSurface}>
              <StateTable caption="Estados de Button unicolor" rows={UNICOLOR_ROWS} />
            </div>
          </Block>
        </Section>

        <Section title="ButtonLink">
          <div className="flex flex-wrap items-center gap-ds-space-general-4xl">
            <ButtonLink href="#button-link">Enlace</ButtonLink>
            <ButtonLink href="#button-link" iconRight>
              Enlace con ícono
            </ButtonLink>
            <ButtonLink href="#button-link" icon={<ArrowRightIcon />} iconRight>
              Ícono propio
            </ButtonLink>
            <ButtonLink disabled>Enlace inactivo</ButtonLink>
          </div>
        </Section>

        <Section title="Button corner">
          <Block title="Types" note="Icon, Dots, Radiobutton, Checkbox y Favorite (md 40 · sm 32). Sobre tarjeta usan On card.">
            <div className="flex flex-wrap items-center gap-ds-space-general-xl">
              <ButtonCorner variant="icon" status="on-card" aria-label="Abrir detalle" />
              <ButtonCorner variant="dots" status="on-card" aria-label="Más opciones" />
              <ButtonCorner variant="radiobutton" status="on-card" aria-label="Elegir" />
              <ButtonCorner variant="checkbox" status="on-card" aria-label="Seleccionar" />
              <ButtonCorner variant="favorite" status="on-card" aria-label="Agregar a favoritos" />
              <ButtonCorner variant="icon" status="on-card" size="sm" stroke aria-label="Abrir detalle" />
            </div>
          </Block>
          <Block title="Unicolor canva" note="Sobre foto o color: no cambia con el tema.">
            <div className={`${darkSurface} flex flex-wrap items-center gap-ds-space-general-xl`}>
              <ButtonCorner variant="icon" status="unicolor-canva" aria-label="Abrir detalle" />
              <ButtonCorner variant="dots" status="unicolor-canva" stroke aria-label="Más opciones" />
              <ButtonCorner variant="favorite" status="unicolor-canva" aria-label="Agregar a favoritos" />
            </div>
          </Block>
        </Section>

        <Section title="Input">
          <Block title="Types" note="Text, Password, Search (56) y Search header (48).">
            <div className="grid grid-cols-1 gap-ds-space-general-4xl md:grid-cols-2">
              <Input
                label="Nombre completo"
                optional
                value={name}
                onChange={(e) => setName(e.target.value)}
                helperText="Como aparece en tu documento"
                tooltip="Nombre registrado en tu documento"
              />
              <Input label="Contraseña" variant="password" helperText="Usa el ojo para mostrar u ocultar" />
              <Input
                label="Buscar"
                variant="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Input label="Buscar en el sitio" variant="search-header" />
            </div>
          </Block>
          <Block title="Estados" note="Los ocho estados de Figma; la prop state solo fuerza el aspecto.">
            <InputStates />
          </Block>
        </Section>

        <Section title="Checkbox y Radio">
          <Selection />
        </Section>

        <Section title="Subtract">
          <div className="flex flex-wrap items-start gap-ds-space-general-5xl">
            <div className="rounded-ds-radius-general-xl bg-ds-background-general-white p-ds-space-general-4xl">
              <Subtract width={184} />
            </div>
            <dl className="m-0 grid gap-ds-space-general-2xl text-ds-typography-body-size-md">
              <div>
                <dt className="font-semibold text-ds-text-neutral-heading">Color</dt>
                <dd className="m-0">background/container/default-on-canva</dd>
              </div>
              <div>
                <dt className="font-semibold text-ds-text-neutral-heading">Radio</dt>
                <dd className="m-0">radius/general/2xl, 24 px</dd>
              </div>
            </dl>
          </div>
        </Section>
      </main>
    </div>
  );
}

export default App;
