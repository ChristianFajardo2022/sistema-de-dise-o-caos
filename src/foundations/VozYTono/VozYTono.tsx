import type { ReactNode } from 'react';
import {
  DoDont,
  DoDontGrid,
  DocFigure,
  DocList,
  DocNote,
  DocSection,
  DocSubsection,
  DocText,
  DocToc,
  FoundationPage,
  TokenTable,
} from '../_doc';
import iconSvg from '../../../icons/caos/line/quote-down.svg?raw';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Checkbox } from '../../components/Checkbox';
import { EmptyState } from '../../components/EmptyState';
import { Input } from '../../components/Input';
import { AlertModalPanel } from '../../components/Modal';
import { Tag } from '../../components/Tag';
import type { TagType } from '../../components/Tag';
import { Toast } from '../../components/Toast';
import {
  abreviaturas,
  accesibilidad,
  adn,
  anexo,
  atributos,
  audiencias,
  botones,
  campos,
  checklist,
  comoEscribimosIntro,
  elegirTono,
  estilo,
  estructuraSinRelleno,
  ficha,
  glosario,
  glosarioIntro,
  humorRegla,
  lenguajeNeutro,
  limites,
  mapaDeTonos,
  mecanica,
  patrones,
  patronesIntro,
  persona,
  placeholders,
  proposito,
  revisionComponente,
  rutaRapida,
  tonoEnFlujo,
  tonoIntro,
  vozDescripcion,
  vozEn30,
} from './vozYTono.content';
import type { Celebracion, Principio, UsoPar } from './vozYTono.content';

export type VozYTonoTab = 'voz' | 'tono' | 'como-escribimos' | 'mecanica' | 'patrones' | 'glosario' | 'revision' | 'anexo';

/** Frase de la marca entre comillas tipográficas (las comillas las pone el componente, no el contenido) */
function Cita({ children }: { children: ReactNode }) {
  return (
    <q className="m-0 text-ds-primitives-typography-size-lg leading-normal text-ds-text-neutral-heading italic [quotes:'“''”'_'‘''’']">
      {children}
    </q>
  );
}

/** Ejemplo en un DoDont: contexto (si hay) y frase entre comillas */
function Ejemplo({ contexto, children }: { contexto?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-ds-space-general-md">
      {contexto && <span className="text-ds-primitives-typography-size-md font-medium text-ds-text-neutral-gray">{contexto}</span>}
      <Cita>{children}</Cita>
    </div>
  );
}

function Pares({ ejemplos }: { ejemplos: UsoPar[] }) {
  return (
    <div className="flex flex-col gap-ds-space-general-4xl">
      {ejemplos.map((e) => (
        <DoDontGrid key={e.correcto}>
          <DoDont variant="do">
            <Ejemplo contexto={e.contexto}>{e.correcto}</Ejemplo>
          </DoDont>
          <DoDont variant="dont">
            <Ejemplo contexto={e.contexto}>{e.incorrecto}</Ejemplo>
          </DoDont>
        </DoDontGrid>
      ))}
    </div>
  );
}

function PrincipioView({ principio }: { principio: Principio }) {
  return (
    <DocSubsection title={principio.titulo}>
      <DocText>{principio.texto}</DocText>
      {principio.ejemplos && <Pares ejemplos={principio.ejemplos} />}
    </DocSubsection>
  );
}

function Principios({ items }: { items: Principio[] }) {
  return (
    <>
      {items.map((p) => (
        <PrincipioView key={p.titulo} principio={p} />
      ))}
    </>
  );
}

/** Muestra viva de un componente de CAOS con su pie (fórmula) */
function Muestra({ formula, children }: { formula: string; children: ReactNode }) {
  return (
    <DocFigure
      caption={
        <>
          <strong className="font-semibold text-ds-text-neutral-heading">Fórmula:</strong> {formula}
        </>
      }
    >
      <div className="flex justify-center">{children}</div>
    </DocFigure>
  );
}

/* ------------------------------------------------------------------ Voz */

function Voz() {
  return (
    <>
      <DocToc
        items={[
          { id: 'ruta-rapida', label: 'Ruta rápida' },
          { id: 'voz-30', label: 'Voz en 30 segundos' },
          { id: 'checklist', label: 'Checklist antes de publicar' },
          { id: 'voz-inter', label: 'La voz de Inter Rapidísimo' },
          { id: 'atributos', label: 'Atributos de la voz' },
          { id: 'somos', label: 'Somos / No somos' },
          { id: 'audiencias', label: 'Para quién escribimos' },
        ]}
      />
      <DocNote title={`Guía de voz, tono y estilo · ${ficha.version}`}>
        <DocList
          items={[
            <><strong>Responsable:</strong> {ficha.responsable}.</>,
            <><strong>Aplica a:</strong> {ficha.aplicaA}.</>,
            <><strong>Cómo proponer cambios:</strong> {ficha.cambios}</>,
          ]}
          className="text-ds-primitives-typography-size-md"
        />
      </DocNote>
      <DocText>{proposito}</DocText>

      <DocSection title="Ruta rápida" id="ruta-rapida">
        <TokenTable
          caption="Ruta rápida: qué necesitas y dónde está"
          columns={['Necesito', 'Pestaña', 'Sección']}
          rows={rutaRapida.map((r) => [r.necesidad, r.pestana, r.seccion])}
        />
      </DocSection>

      <DocSection title="Voz en 30 segundos" id="voz-30">
        <DocNote>
          <strong className="text-ds-primitives-typography-size-lg">{vozEn30}</strong>
        </DocNote>
        <ul className="m-0 grid list-none grid-cols-1 gap-ds-space-general-4xl p-0 tablet:grid-cols-2">
          {atributos.map((a) => (
            <li
              key={a.nombre}
              className="flex flex-col gap-ds-space-general-lg rounded-ds-radius-container-on-canva border border-ds-border-general-default-on-card bg-ds-background-container-default-on-card p-ds-space-general-4xl"
            >
              <h3 className="m-0 font-ds-primitives-typography-family-secondary text-ds-primitives-typography-size-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading">
                {a.nombre}
              </h3>
              <p className="m-0 text-ds-primitives-typography-size-md leading-normal text-ds-text-neutral-body">{a.enUnaLinea}</p>
              <p className="m-0 flex flex-col gap-ds-space-general-md text-ds-primitives-typography-size-md text-ds-text-neutral-gray">
                <span className="font-medium">Suena así</span>
                <Cita>{a.suenaAsi}</Cita>
              </p>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="Checklist antes de publicar" id="checklist">
        <TokenTable
          caption="Checklist antes de publicar un texto"
          columns={['Pregunta', 'Dónde ver el detalle']}
          rows={checklist.map((c) => [<Checkbox key={c.pregunta}>{c.pregunta}</Checkbox>, c.dondeVer])}
        />
      </DocSection>

      <DocSection title="La voz de Inter Rapidísimo" id="voz-inter">
        <DocText>{vozDescripcion}</DocText>
        <DocSubsection title="ADN del contenido">
          <DocText>{adn.texto}</DocText>
          <DocList items={adn.rasgos} />
        </DocSubsection>
      </DocSection>

      <DocSection title="Atributos de la voz" id="atributos">
        {atributos.map((a) => (
          <DocSubsection key={a.nombre} title={a.nombre}>
            <DocText>{a.descripcion}</DocText>
            <div className="flex flex-col gap-ds-space-general-lg">
              {a.ejemplos.map((e) => (
                <Cita key={e}>{e}</Cita>
              ))}
            </div>
          </DocSubsection>
        ))}
      </DocSection>

      <DocSection title="Somos / No somos" id="somos">
        <div className="flex flex-col gap-ds-primitives-space-5xl">
          {atributos.map((a) => (
            <DocSubsection key={a.nombre} title={a.nombre} size="sm">
              <DoDontGrid>
                <DoDont variant="do" description={<><strong>Somos</strong> {a.somos}</>}>
                  <Cita>{a.suenaAsi}</Cita>
                </DoDont>
                <DoDont variant="dont" description={<><strong>No somos</strong> {a.noSomos}</>}>
                  <Ejemplo contexto="Así no suena">{a.asiNo}</Ejemplo>
                </DoDont>
              </DoDontGrid>
            </DocSubsection>
          ))}
        </div>
      </DocSection>

      <DocSection title="Para quién escribimos" id="audiencias">
        <TokenTable
          caption="Audiencias, qué necesitan y cómo ajustamos el texto"
          columns={['Audiencia', 'Qué necesita', 'Cómo ajustamos el texto']}
          rows={audiencias.map((a) => [<strong key={a.audiencia} className="font-semibold text-ds-text-neutral-heading">{a.audiencia}</strong>, a.necesita, a.ajuste])}
          minWidth={720}
        />
      </DocSection>
    </>
  );
}

/* ------------------------------------------------------------------ Tono */

const CELEBRACION_TAG: Record<Celebracion, TagType> = { si: 'success', una: 'info', no: 'neutral' };

function Tono() {
  return (
    <>
      <DocToc
        items={[
          { id: 'tono-flujo', label: 'Tono en un flujo' },
          { id: 'mapa-tonos', label: 'Mapa de tonos por situación' },
          { id: 'elegir-tono', label: 'Cómo elegir el tono en 4 preguntas' },
        ]}
      />
      <div className="flex flex-col gap-ds-space-general-2xl">
        {tonoIntro.map((t) => (
          <DocText key={t}>{t}</DocText>
        ))}
      </div>

      <DocSection title="Tono en un flujo" id="tono-flujo">
        <DocText>{tonoEnFlujo.flujo}</DocText>
        <TokenTable
          caption={`Tono en un flujo: ${tonoEnFlujo.flujo}`}
          columns={['Etapa', 'Emoción del usuario', 'Tono', 'Ejemplo']}
          rows={tonoEnFlujo.etapas.map((e) => [e.etapa, e.emocion, e.tono, e.ejemplo])}
          minWidth={800}
        />
      </DocSection>

      <DocSection title="Mapa de tonos por situación" id="mapa-tonos">
        <DocNote>{humorRegla}</DocNote>
        <TokenTable
          caption="Mapa de tonos por situación"
          columns={['Situación', 'Tono', 'Humor y celebración', 'Ejemplo']}
          rows={mapaDeTonos.map((m) => [
            <strong key={m.situacion} className="font-semibold text-ds-text-neutral-heading">{m.situacion}</strong>,
            m.tono,
            <Tag key="t" type={CELEBRACION_TAG[m.celebracion]} iconLeft={false}>
              {m.celebracionTexto}
            </Tag>,
            m.ejemplo,
          ])}
          minWidth={900}
        />
      </DocSection>

      <DocSection title="Cómo elegir el tono en 4 preguntas" id="elegir-tono">
        <DocText>Responde en orden y aplica la primera que corresponda.</DocText>
        <ol className="m-0 flex list-decimal flex-col gap-ds-space-general-2xl pl-ds-space-general-4xl text-ds-primitives-typography-size-lg leading-normal text-ds-text-neutral-body marker:font-semibold marker:text-ds-text-neutral-heading">
          {elegirTono.map((e) => (
            <li key={e.pregunta}>
              <strong className="font-semibold text-ds-text-neutral-heading">{e.pregunta}</strong> {e.entonces}
            </li>
          ))}
        </ol>
      </DocSection>
    </>
  );
}

/* ------------------------------------------------------------------ Cómo escribimos */

function ComoEscribimos() {
  return (
    <>
      <DocToc
        items={[
          { id: 'persona', label: 'Persona y trato' },
          { id: 'estilo', label: 'Estilo' },
          { id: 'estructura', label: 'Estructura sin relleno' },
          { id: 'botones', label: 'Botones' },
          { id: 'campos', label: 'Campos' },
          { id: 'neutro', label: 'Lenguaje neutro' },
        ]}
      />
      <DocText>{comoEscribimosIntro}</DocText>
      <DocSection title="Persona y trato" id="persona">
        <Principios items={persona} />
      </DocSection>
      <DocSection title="Estilo" id="estilo">
        <Principios items={estilo} />
      </DocSection>
      <DocSection title="Estructura sin relleno" id="estructura">
        <Principios items={estructuraSinRelleno} />
      </DocSection>

      <DocSection title="Botones" id="botones">
        <DocText>{botones.intro}</DocText>
        <Principios items={botones.principios} />
        <DocSubsection title="Ejemplos de botones">
          <TokenTable
            caption="Ejemplos de botones correctos e incorrectos"
            columns={['Correcto', 'Incorrecto']}
            rows={botones.ejemplos.map((e) => [e.correcto, e.incorrecto])}
          />
          <DoDontGrid>
            <DoDont variant="do" description="Nombran la acción y su resultado.">
              <div className="flex flex-wrap gap-ds-space-general-lg">
                <Button>Crear envío</Button>
                <Button variant="secondary">Programar recogida</Button>
              </div>
            </DoDont>
            <DoDont variant="dont" description="Genéricos o con instrucciones que no dicen qué ocurre.">
              <div className="flex flex-wrap gap-ds-space-general-lg">
                <Button>OK</Button>
                <Button variant="secondary">Haz clic aquí</Button>
              </div>
            </DoDont>
          </DoDontGrid>
        </DocSubsection>
      </DocSection>

      <DocSection title="Campos" id="campos">
        <DocText>{campos.intro}</DocText>
        <Principios items={campos.principios} />
        <DocSubsection title="Placeholders en campos reales">
          <div className="flex flex-col gap-ds-space-general-4xl">
            {placeholders.map((p) => (
              <DoDontGrid key={p.etiqueta}>
                <DoDont variant="do" description="Un ejemplo real, en el formato esperado.">
                  <Input label={p.etiqueta} placeholder={p.correcto} fullWidth />
                </DoDont>
                <DoDont variant="dont" description="Da una instrucción o repite la etiqueta.">
                  <Input label={p.etiqueta} placeholder={p.incorrecto} fullWidth />
                </DoDont>
              </DoDontGrid>
            ))}
          </div>
        </DocSubsection>
      </DocSection>

      <DocSection title="Lenguaje neutro" id="neutro">
        <div className="flex flex-col gap-ds-space-general-2xl">
          {lenguajeNeutro.intro.map((t) => (
            <DocText key={t}>{t}</DocText>
          ))}
        </div>
        <Principios items={lenguajeNeutro.pronombres} />
        <DocSubsection title="Referencias por contexto">
          <TokenTable
            caption="Lenguaje neutro: qué evitar y qué usar según el contexto"
            columns={['Contexto', 'Evita', 'Usa']}
            rows={lenguajeNeutro.referencias.map((r) => [r.contexto, r.evita, r.usa])}
            minWidth={720}
          />
        </DocSubsection>
      </DocSection>
    </>
  );
}

/* ------------------------------------------------------------------ Mecánica */

function Mecanica() {
  return (
    <>
      <DocToc
        items={[
          { id: 'mecanica-escritura', label: 'Mecánica de escritura' },
          { id: 'limites', label: 'Límites de caracteres' },
          { id: 'abreviaturas', label: 'Abreviaturas' },
          { id: 'accesibilidad', label: 'Accesibilidad aplicada' },
        ]}
      />
      <DocSection title="Mecánica de escritura" id="mecanica-escritura">
        <TokenTable
          caption="Mecánica de escritura"
          columns={['Tema', 'Regla', 'Ejemplo']}
          rows={mecanica.map((m) => [<strong key={m.tema} className="font-semibold text-ds-text-neutral-heading">{m.tema}</strong>, m.regla, m.ejemplo])}
          minWidth={800}
        />
      </DocSection>

      <DocSection title="Límites de caracteres" id="limites">
        <DocNote>Son referencias de partida: se ajustan al componente y al canal.</DocNote>
        <TokenTable
          caption="Límites de caracteres sugeridos"
          columns={['Elemento', 'Límite', 'Nota']}
          rows={limites.map((l) => [l.elemento, l.limite, l.nota])}
        />
      </DocSection>

      <DocSection title="Abreviaturas" id="abreviaturas">
        <DocText>{abreviaturas.intro}</DocText>
        <DocList items={abreviaturas.principios} />
        <TokenTable
          caption="Abreviaturas aprobadas y formas incorrectas"
          columns={['Palabra', 'Correcto', 'Incorrecto']}
          rows={abreviaturas.tabla.map((a) => [a.palabra, a.correcto, a.incorrecto])}
        />
      </DocSection>

      <DocSection title="Accesibilidad aplicada" id="accesibilidad">
        <TokenTable
          caption="Accesibilidad aplicada a los textos"
          columns={['Regla', 'Correcto', 'Incorrecto']}
          rows={accesibilidad.map((a) => [a.regla, a.correcto, a.incorrecto])}
          minWidth={800}
        />
      </DocSection>
    </>
  );
}

/* ------------------------------------------------------------------ Patrones */

function Patrones() {
  const get = (c: string) => patrones.find((p) => p.componente === c);
  const campo = get('Error en un campo');
  const error = get('Error que impide una acción');
  const vacio = get('Estado vacío');
  const exito = get('Éxito (toast)');
  const riesgo = get('Confirmación de acción riesgosa');


  return (
    <>
      <DocToc
        items={[
          { id: 'patrones-componente', label: 'Patrones por componente' },
          { id: 'en-componentes', label: 'Así se ve en los componentes' },
        ]}
      />
      <DocSection title="Patrones por componente" id="patrones-componente">
        <DocText>{patronesIntro}</DocText>
        <TokenTable
          caption="Patrones de mensajes por componente"
          columns={['Componente', 'Fórmula', 'Ejemplo', 'En CAOS']}
          rows={patrones.map((p) => [
            <strong key={p.componente} className="font-semibold text-ds-text-neutral-heading">{p.componente}</strong>,
            p.formula,
            p.ejemplo,
            p.enCaos.length ? (
              <span key="c" className="flex flex-wrap gap-ds-space-general-md">
                {p.enCaos.map((n) => (
                  <Tag key={n} type="neutral" size="sm" iconLeft={false}>
                    {n}
                  </Tag>
                ))}
              </span>
            ) : (
              'Fuera de la interfaz'
            ),
          ])}
          minWidth={960}
        />
      </DocSection>

      <DocSection title="Así se ve en los componentes" id="en-componentes">
        {campo && (
          <DocSubsection title={campo.componente}>
            <Muestra formula={campo.formula}>
              <div className="w-full max-w-sm">
                <Input label="Celular" state="error" errorText={campo.ejemplo} defaultValue="310 123 45" fullWidth />
              </div>
            </Muestra>
          </DocSubsection>
        )}
        {error && (
          <DocSubsection title={error.componente}>
            <Muestra formula={error.formula}>
              <div className="w-full max-w-xl">
                <Alert type="error" role="status">
                  {error.ejemplo}
                </Alert>
              </div>
            </Muestra>
          </DocSubsection>
        )}
        {vacio?.muestra && (
          <DocSubsection title={vacio.componente}>
            <Muestra formula={vacio.formula}>
              <EmptyState
                type="first-use"
                headingLevel={4}
                title={vacio.muestra.titulo}
                description={vacio.muestra.texto}
                primaryAction={{ label: vacio.muestra.acciones[0] }}
              />
            </Muestra>
          </DocSubsection>
        )}
        {exito && (
          <DocSubsection title={exito.componente}>
            <Muestra formula={exito.formula}>
              <Toast type="success" title={exito.ejemplo} />
            </Muestra>
          </DocSubsection>
        )}
        {riesgo?.muestra && (
          <DocSubsection title={riesgo.componente}>
            <Muestra formula={riesgo.formula}>
              <AlertModalPanel
                type="alert"
                title={riesgo.muestra.titulo}
                description={riesgo.muestra.texto}
                primaryAction={{ label: riesgo.muestra.acciones[0], state: 'delete' }}
                secondaryAction={{ label: riesgo.muestra.acciones[1] }}
              />
            </Muestra>
          </DocSubsection>
        )}
      </DocSection>
    </>
  );
}

/* ------------------------------------------------------------------ Glosario */

function Glosario() {
  return (
    <DocSection title="Glosario">
      <DocText>{glosarioIntro}</DocText>
      {glosario.map((g) => (
        <DocSubsection key={g.grupo} title={g.grupo}>
          {g.intro && <DocText>{g.intro}</DocText>}
          <TokenTable
            caption={`Glosario: ${g.grupo}`}
            columns={['Concepto', 'Definición', 'Ejemplo de uso', 'Evitar']}
            rows={g.terminos.map((t) => [
              <strong key={t.concepto} className="font-semibold text-ds-text-neutral-heading">{t.concepto}</strong>,
              t.definicion,
              t.ejemplo,
              t.evitar,
            ])}
            minWidth={880}
          />
        </DocSubsection>
      ))}
    </DocSection>
  );
}

/* ------------------------------------------------------------------ Revisión y anexo */

function Revision() {
  return (
    <DocSection title="Revisión de textos de un componente nuevo">
      <DocText>Cada componente nuevo del sistema, con sus historias y su documentación, pasa esta revisión de textos antes de cerrarse.</DocText>
      <TokenTable
        caption="Revisión de textos de un componente nuevo"
        columns={['Punto a revisar', 'Regla']}
        rows={revisionComponente.map((r) => [<strong key={r.punto} className="font-semibold text-ds-text-neutral-heading">{r.punto}</strong>, r.regla])}
        minWidth={720}
      />
    </DocSection>
  );
}

function Anexo() {
  return (
    <DocSection title="Fundamentos de UX Writing">
      <DocText>{anexo.intro}</DocText>
      <DocSubsection title="Objetivos">
        <DocList items={anexo.objetivos.map((o) => <><strong>{o.titulo}.</strong> {o.texto}</>)} />
      </DocSubsection>
      <DocSubsection title="Cuándo usar las heurísticas">
        <DocList items={anexo.cuandoUsar} />
      </DocSubsection>
      <DocSubsection title="Heurísticas de UX Writing">
        <DocText>{anexo.heuristicasIntro}</DocText>
        <DocList items={anexo.heuristicas.map((h) => <><strong>{h.titulo}.</strong> {h.texto}</>)} />
      </DocSubsection>
      <DocSubsection title="Cómo son los buenos contenidos">
        <DocList items={anexo.contenidos.map((c) => <><strong>{c.titulo}.</strong> {c.texto}</>)} />
      </DocSubsection>
    </DocSection>
  );
}

/** Página "Voz y tono" de Fundamentos de diseño. `initialTab` abre una pestaña concreta (una historia por pestaña). */
export function VozYTono({ initialTab = 'voz' }: { initialTab?: VozYTonoTab }) {
  return (
    <FoundationPage
      iconSvg={iconSvg}
      title="Voz y tono"
      subtitle="Cómo suena CAOS: palabras que guían, simplifican y generan confianza en cada pantalla."
      initialTab={initialTab}
      tabs={[
        { id: 'voz', label: 'Voz', content: <Voz /> },
        { id: 'tono', label: 'Tono', content: <Tono /> },
        { id: 'como-escribimos', label: 'Cómo escribimos', content: <ComoEscribimos /> },
        { id: 'mecanica', label: 'Mecánica', content: <Mecanica /> },
        { id: 'patrones', label: 'Patrones', content: <Patrones /> },
        { id: 'glosario', label: 'Glosario', content: <Glosario /> },
        { id: 'revision', label: 'Revisión', content: <Revision /> },
        { id: 'anexo', label: 'Anexo', content: <Anexo /> },
      ]}
    />
  );
}
