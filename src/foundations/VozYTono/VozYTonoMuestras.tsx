import type { ReactNode } from 'react';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Input } from '../../components/Input';
import { AlertModalPanel } from '../../components/Modal';
import { Tag } from '../../components/Tag';
import type { TagType } from '../../components/Tag';
import { Toast } from '../../components/Toast';
import { ShrinkToFit } from '../../docs/DocParts';
import { cn } from '../../utils/cn';
import type { Celebracion, Patron } from './vozYTono.content';

/*
 * Muestras de la página Voz y tono (plantilla v2). Las frases son las de `vozYTono.content.ts`; los componentes son los
 * reales de CAOS. Las muestras son ilustraciones: van con `inert` para que no sumen paradas de teclado.
 */

const primary = 'font-ds-primitives-typography-family-primary';

/** Ilustración: se ve pero no entra al foco ni al árbol de accesibilidad como controles. */
function Ilustracion({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div inert className={className}>
      {children}
    </div>
  );
}

/** Frase de la marca entre comillas tipográficas (las comillas las pone el componente, no el contenido). */
export function Cita({ children }: { children: ReactNode }) {
  return (
    <q className={cn(primary, 'm-0 text-ds-primitives-typography-size-lg leading-normal text-ds-text-neutral-heading italic [quotes:"“""”"_"‘""’"]')}>
      {children}
    </q>
  );
}

/** Ejemplo: contexto (si hay) y frase entre comillas. */
export function Ejemplo({ contexto, children }: { contexto?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-ds-space-general-md">
      {contexto && <span className={cn(primary, 'text-ds-primitives-typography-size-md font-medium text-ds-text-neutral-gray')}>{contexto}</span>}
      <Cita>{children}</Cita>
    </div>
  );
}

/** Ejemplo dentro del marco de dispositivo de una buena o mala práctica: centrado y con aire. */
export function EjemploEnMarco({ contexto, children }: { contexto?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-40 w-full flex-col justify-center p-ds-space-general-4xl">
      <Ejemplo contexto={contexto}>{children}</Ejemplo>
    </div>
  );
}

/** "Suena así" con la frase de ejemplo, al pie de una tarjeta de atributo. */
export function SuenaAsi({ children }: { children: ReactNode }) {
  return (
    <p className={cn(primary, 'm-0 flex flex-col gap-ds-space-general-md text-ds-primitives-typography-size-md text-ds-text-neutral-gray')}>
      <span className="font-medium">Suena así</span>
      <Cita>{children}</Cita>
    </p>
  );
}

/** Varias frases de ejemplo, una bajo otra. */
export function ListaCitas({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-ds-space-general-lg">
      {items.map((e) => (
        <Cita key={e}>{e}</Cita>
      ))}
    </div>
  );
}

/** Texto en negrita del encabezado de fila de una tabla. */
export function Fuerte({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ds-text-neutral-heading">{children}</strong>;
}

/** Pregunta del checklist con una casilla decorativa: marca que es un punto por revisar (la casilla no se marca ni se lee). */
export function PreguntaChecklist({ children }: { children: string }) {
  return (
    <span className="flex items-start gap-ds-space-general-lg">
      <span aria-hidden="true" className="mt-0.5 size-4 shrink-0 rounded-ds-radius-general-sm border border-ds-border-general-default-on-card" />
      <span>{children}</span>
    </span>
  );
}

const CELEBRACION_TAG: Record<Celebracion, TagType> = { si: 'success', una: 'info', no: 'neutral' };

export function EtiquetaCelebracion({ tipo, children }: { tipo: Celebracion; children: ReactNode }) {
  return (
    <Tag type={CELEBRACION_TAG[tipo]} iconLeft={false}>
      {children}
    </Tag>
  );
}

/** Componentes de CAOS donde aplica una fórmula (el nombre de su carpeta, en `code`). */
export function EnCaos({ nombres }: { nombres: string[] }) {
  if (!nombres.length) return 'Fuera de la interfaz';
  return (
    <span className="flex flex-wrap gap-ds-space-general-md">
      {nombres.map((n) => (
        <code key={n}>{n}</code>
      ))}
    </span>
  );
}

/** Lista numerada de las cuatro preguntas para elegir el tono. */
export function PreguntasTono({ items }: { items: { pregunta: string; entonces: string }[] }) {
  return (
    <ol className={cn(primary, 'm-0 flex list-decimal flex-col gap-ds-space-general-2xl pl-ds-space-general-4xl text-ds-primitives-typography-size-md leading-normal text-ds-text-neutral-body marker:font-semibold marker:text-ds-text-neutral-heading')}>
      {items.map((e) => (
        <li key={e.pregunta}>
          <Fuerte>{e.pregunta}</Fuerte> {e.entonces}
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ Muestras de componentes */

/** Botones del par Hacer / Evitar. */
export function MuestraBotones({ bueno }: { bueno: boolean }) {
  return (
    <Ilustracion className="flex w-full flex-wrap justify-center gap-ds-space-general-lg p-ds-space-general-4xl">
      {bueno ? (
        <>
          <Button>Crear envío</Button>
          <Button variant="secondary">Programar recogida</Button>
        </>
      ) : (
        <>
          <Button>OK</Button>
          <Button variant="secondary">Haz clic aquí</Button>
        </>
      )}
    </Ilustracion>
  );
}

/** Campo con su placeholder, correcto o incorrecto (estado forzado: el label arriba y el placeholder visible). */
export function MuestraCampo({ etiqueta, placeholder }: { etiqueta: string; placeholder: string }) {
  return (
    <Ilustracion className="w-full p-ds-space-general-4xl">
      <Input label={etiqueta} placeholder={placeholder} state="active" fullWidth />
    </Ilustracion>
  );
}

/** Campo con error: texto del error con la voz de la guía. */
export function MuestraErrorCampo({ etiqueta, valor, error }: { etiqueta: string; valor: string; error: string }) {
  return (
    <Ilustracion className="w-full p-ds-space-general-4xl">
      <Input label={etiqueta} state="error" errorText={error} defaultValue={valor} fullWidth />
    </Ilustracion>
  );
}

/** Campo con etiqueta e instrucción visible. */
export function MuestraCampoConAyuda({ etiqueta, ayuda, placeholder }: { etiqueta: string; ayuda?: string; placeholder?: string }) {
  return (
    <Ilustracion className="w-full p-ds-space-general-4xl">
      <Input label={etiqueta} helperText={ayuda} placeholder={placeholder} state="active" fullWidth />
    </Ilustracion>
  );
}

/** Botón suelto (texto de un enlace o de una acción). */
export function MuestraBoton({ texto, variante = 'primary' }: { texto: string; variante?: 'primary' | 'secondary' }) {
  return (
    <Ilustracion className="flex w-full justify-center p-ds-space-general-4xl">
      <Button variant={variante}>{texto}</Button>
    </Ilustracion>
  );
}

/** Muestras vivas de la sección "Así se ve en los componentes". Devuelve la muestra de un patrón, o nada si no tiene. */
export function MuestraPatron({ patron }: { patron: Patron }): ReactNode {
  const { componente, ejemplo, muestra } = patron;
  if (componente === 'Error en un campo') {
    return (
      <ShrinkToFit>
        <Ilustracion className="w-full max-w-sm">
          <Input label="Celular" state="error" errorText={ejemplo} defaultValue="310 123 45" fullWidth />
        </Ilustracion>
      </ShrinkToFit>
    );
  }
  if (componente === 'Error que impide una acción') {
    return (
      <ShrinkToFit>
        <Ilustracion className="w-full max-w-xl">
          <Alert type="error" role="status">
            {ejemplo}
          </Alert>
        </Ilustracion>
      </ShrinkToFit>
    );
  }
  if (componente === 'Estado vacío' && muestra) {
    return (
      <ShrinkToFit>
        <Ilustracion>
          <EmptyState type="first-use" headingLevel={4} title={muestra.titulo} description={muestra.texto} primaryAction={{ label: muestra.acciones[0] }} />
        </Ilustracion>
      </ShrinkToFit>
    );
  }
  if (componente === 'Éxito (toast)') {
    return (
      <ShrinkToFit>
        <Ilustracion>
          <Toast type="success" title={ejemplo} />
        </Ilustracion>
      </ShrinkToFit>
    );
  }
  if (componente === 'Confirmación de acción riesgosa' && muestra) {
    return (
      <ShrinkToFit>
        <Ilustracion>
          <AlertModalPanel
            type="alert"
            headingLevel={4}
            title={muestra.titulo}
            description={muestra.texto}
            primaryAction={{ label: muestra.acciones[0], state: 'delete' }}
            secondaryAction={{ label: muestra.acciones[1] }}
          />
        </Ilustracion>
      </ShrinkToFit>
    );
  }
  return null;
}
