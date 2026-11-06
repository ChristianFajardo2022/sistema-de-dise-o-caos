import type { DocInline, DocPractice } from '../../docs/types';
import type { FoundationBlock, FoundationDocContent } from '../_doc/foundationDoc.types';
import { ListaVinetas } from '../_doc/ListaVinetas';
import {
  EjemploEnMarco,
  EnCaos,
  EtiquetaCelebracion,
  ListaCitas,
  MuestraBoton,
  MuestraBotones,
  MuestraCampo,
  MuestraCampoConAyuda,
  MuestraErrorCampo,
  MuestraPatron,
  PreguntaChecklist,
  PreguntasTono,
  SuenaAsi,
} from './VozYTonoMuestras';
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
import type { Principio, UsoPar } from './vozYTono.content';

/*
 * Contenido de la página Voz y tono (plantilla v2 de fundamentos). El texto es la Guía de voz, tono y estilo y vive en
 * `vozYTono.content.ts` (fuente única): aquí solo se reparte en las cuatro pestañas. Se conserva la marca y el rubro de la
 * guía a propósito. Reparto: Definición = Voz + Tono + Glosario; Aplicación = Cómo escribimos + Mecánica + Patrones;
 * Accesibilidad = la tabla «Accesibilidad aplicada» de la guía y criterio propio basado en WCAG 2.2; Desarrollo =
 * Revisión + Anexo + consumo técnico.
 */

// Figma: la guía no tiene página propia en Figma; la fuente es la Guía de voz, tono y estilo v2.0 (octubre de 2026)

// ───────────────────────── ayudas ─────────────────────────

/** Subtítulo de un grupo (Heading-lg-600), como en Texturas, Formas y Retículas. */
const subTitle = (text: string): FoundationBlock => ({
  type: 'custom',
  content: (
    <h3 className="m-0 font-ds-primitives-typography-family-secondary text-ds-typography-heading-size-xl leading-ds-typography-heading-line-height-xl font-ds-primitives-typography-weight-semibold text-ds-text-neutral-heading [overflow-wrap:anywhere]">
      {text}
    </h3>
  ),
});

const practice = (kind: DocPractice['kind'], title: string, description: DocInline, preview: DocPractice['preview']): DocPractice => ({
  kind,
  framed: true,
  title,
  description,
  preview,
});

/** Tabla de pares correcto / incorrecto (con la columna de contexto solo si algún par la trae). */
const tablaPares = (caption: string, pares: UsoPar[]): FoundationBlock => {
  const conContexto = pares.some((p) => p.contexto);
  return {
    type: 'table',
    caption,
    minWidth: conContexto ? 680 : 560,
    columns: conContexto
      ? [{ header: 'Contexto', width: 160 }, { header: 'Correcto', width: 420 }, { header: 'Incorrecto', width: 420 }]
      : [{ header: 'Correcto', width: 480 }, { header: 'Incorrecto', width: 480 }],
    rows: pares.map((p) => (conContexto ? [p.contexto ?? '', p.correcto, p.incorrecto] : [p.correcto, p.incorrecto])),
  };
};

/** Un principio de la guía: subtítulo, texto y sus ejemplos en tabla. */
const principioBlocks = (p: Principio): FoundationBlock[] => [
  subTitle(p.titulo),
  { type: 'text', content: p.texto },
  ...(p.ejemplos ? [tablaPares(`Ejemplos: ${p.titulo}`, p.ejemplos)] : []),
];

const principios = (items: Principio[]): FoundationBlock[] => items.flatMap(principioBlocks);

const patron = (componente: string) => patrones.find((p) => p.componente === componente);

/** Celda de varias líneas (una por elemento). */
const lineas = (...items: DocInline[]): DocInline => (
  <>
    {items.map((item, i) => (
      <span key={i} className="block">
        {item}
      </span>
    ))}
  </>
);

// ───────────────────────── código de ejemplo ─────────────────────────

const CODIGO_CONSUMO = [
  "import { Input } from '../../components/Input';",
  "import { patrones } from './vozYTono.content';",
  '',
  "// La fórmula y el ejemplo salen de la guía: no se copian a mano",
  "const campo = patrones.find((p) => p.componente === 'Error en un campo');",
  '',
  '<Input label="Celular" state="error" errorText={campo?.ejemplo} />',
].join('\n');

const CODIGO_REVISION = [
  "import { revisionComponente } from './vozYTono.content';",
  '',
  '// Una fila por punto de revisión: { punto, regla }',
  'revisionComponente.map(({ punto, regla }) => `${punto}: ${regla}`);',
].join('\n');

const CODIGO_TEXTOS_ACCESIBLES = [
  '{/* Ícono solo: el nombre dice la función, sin la palabra "botón" */}',
  '<button type="button" aria-label="Cerrar">',
  '  <Icon name="close-circle" aria-hidden="true" />',
  '</button>',
  '',
  '{/* Imagen que informa: describe la información */}',
  '<img src="envio.png" alt="Envío en camino" />',
  '',
  '{/* Imagen decorativa: alt vacío */}',
  '<img src="fondo.svg" alt="" />',
  '',
  '{/* Campo: etiqueta visible; la instrucción va antes de escribir */}',
  '<label htmlFor="celular">Celular</label>',
  '<p id="celular-ayuda">Escribe los 10 dígitos, sin el indicativo.</p>',
  '<input id="celular" aria-describedby="celular-ayuda" />',
].join('\n');

// ───────────────────────── contenido ─────────────────────────

export const doc: FoundationDocContent = {
  name: 'Voz y tono',
  icon: 'quote-down',
  summary: 'Cómo suena CAOS: palabras que guían, simplifican y generan confianza en cada pantalla.',
  definition: [
    {
      title: 'Propósito de la guía',
      description: proposito,
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: `Guía de voz, tono y estilo · ${ficha.version}`,
          content: [
            <><strong>Responsable:</strong> {ficha.responsable}.</>,
            <><strong>Aplica a:</strong> {ficha.aplicaA}.</>,
            <><strong>Cómo proponer cambios:</strong> {ficha.cambios}</>,
          ],
        },
      ],
    },
    {
      title: 'Ruta rápida',
      description: '',
      blocks: [
        {
          type: 'table',
          caption: 'Ruta rápida: qué necesitas y dónde está',
          minWidth: 640,
          columns: [{ header: 'Necesito', width: 420 }, { header: 'Pestaña', width: 160 }, { header: 'Sección', width: 380 }],
          rows: rutaRapida.map((r) => [r.necesidad, r.pestana, r.seccion]),
        },
      ],
    },
    {
      title: 'Voz en 30 segundos',
      description: '',
      blocks: [
        { type: 'text', content: <strong className="text-ds-primitives-typography-size-lg">{vozEn30}</strong> },
        {
          type: 'cards',
          columns: 2,
          items: atributos.map((a) => ({
            title: a.nombre,
            content: a.enUnaLinea,
            preview: <SuenaAsi>{a.suenaAsi}</SuenaAsi>,
          })),
        },
      ],
    },
    {
      title: 'Checklist antes de publicar',
      description: '',
      blocks: [
        {
          type: 'table',
          caption: 'Checklist antes de publicar un texto',
          minWidth: 640,
          columns: [{ header: 'Pregunta', width: 560 }, { header: 'Dónde ver el detalle', width: 400 }],
          rows: checklist.map((c) => [<PreguntaChecklist key={c.pregunta}>{c.pregunta}</PreguntaChecklist>, c.dondeVer]),
        },
      ],
    },
    {
      title: 'La voz de Inter Rapidísimo',
      description: vozDescripcion,
      blocks: [
        subTitle('ADN del contenido'),
        { type: 'text', content: adn.texto },
        { type: 'cards', items: [{ preview: <ListaVinetas items={adn.rasgos} /> }] },
      ],
    },
    {
      title: 'Atributos de la voz',
      description: '',
      blocks: [
        {
          type: 'cards',
          columns: 2,
          items: atributos.map((a) => ({
            title: a.nombre,
            content: a.descripcion,
            preview: <ListaCitas items={a.ejemplos} />,
          })),
        },
      ],
    },
    {
      title: 'Somos / No somos',
      description: '',
      blocks: atributos.flatMap((a): FoundationBlock[] => [
        subTitle(a.nombre),
        {
          type: 'practices',
          items: [
            practice(
              'do',
              `${a.nombre}: cómo suena`,
              <><strong>Somos</strong> {a.somos}</>,
              <EjemploEnMarco>{a.suenaAsi}</EjemploEnMarco>,
            ),
            practice(
              'dont',
              `${a.nombre}: cómo no suena`,
              <><strong>No somos</strong> {a.noSomos}</>,
              <EjemploEnMarco contexto="Así no suena">{a.asiNo}</EjemploEnMarco>,
            ),
          ],
        },
      ]),
    },
    {
      title: 'Para quién escribimos',
      description: '',
      blocks: [
        {
          type: 'table',
          caption: 'Audiencias, qué necesitan y cómo ajustamos el texto',
          minWidth: 720,
          columns: [{ header: 'Audiencia', width: 240 }, { header: 'Qué necesita', width: 340 }, { header: 'Cómo ajustamos el texto', width: 420 }],
          rows: audiencias.map((a) => [a.audiencia, a.necesita, a.ajuste]),
        },
      ],
    },
    {
      title: 'Tono',
      description: tonoIntro[0],
      blocks: tonoIntro.slice(1).map((t): FoundationBlock => ({ type: 'text', content: t })),
    },
    {
      title: 'Tono en un flujo',
      description: tonoEnFlujo.flujo,
      blocks: [
        {
          type: 'table',
          caption: `Tono en un flujo: ${tonoEnFlujo.flujo}`,
          minWidth: 800,
          columns: [{ header: 'Etapa', width: 180 }, { header: 'Emoción del usuario', width: 200 }, { header: 'Tono', width: 240 }, { header: 'Ejemplo', width: 380 }],
          rows: tonoEnFlujo.etapas.map((e) => [e.etapa, e.emocion, e.tono, e.ejemplo]),
        },
      ],
    },
    {
      title: 'Mapa de tonos por situación',
      description: humorRegla,
      blocks: [
        {
          type: 'table',
          caption: 'Mapa de tonos por situación',
          minWidth: 900,
          columns: [{ header: 'Situación', width: 220 }, { header: 'Tono', width: 240 }, { header: 'Humor y celebración', width: 220 }, { header: 'Ejemplo', width: 320 }],
          rows: mapaDeTonos.map((m) => [
            m.situacion,
            m.tono,
            <EtiquetaCelebracion key="t" tipo={m.celebracion}>
              {m.celebracionTexto}
            </EtiquetaCelebracion>,
            m.ejemplo,
          ]),
        },
      ],
    },
    {
      title: 'Cómo elegir el tono en 4 preguntas',
      description: 'Responde en orden y aplica la primera que corresponda.',
      blocks: [{ type: 'custom', content: <PreguntasTono items={elegirTono} /> }],
    },
    {
      title: 'Glosario',
      description: glosarioIntro,
      blocks: glosario.flatMap((g): FoundationBlock[] => [
        subTitle(g.grupo),
        ...(g.intro ? ([{ type: 'text', content: g.intro }] as FoundationBlock[]) : []),
        {
          type: 'table',
          caption: `Glosario: ${g.grupo}`,
          minWidth: 880,
          columns: [{ header: 'Concepto', width: 200 }, { header: 'Definición', width: 340 }, { header: 'Ejemplo de uso', width: 300 }, { header: 'Evitar', width: 240 }],
          rows: g.terminos.map((t) => [t.concepto, t.definicion, t.ejemplo, t.evitar]),
        },
      ]),
    },
  ],
  application: [
    {
      title: 'Persona y trato',
      description: comoEscribimosIntro,
      blocks: principios(persona),
    },
    { title: 'Estilo', description: '', blocks: principios(estilo) },
    { title: 'Estructura sin relleno', description: '', blocks: principios(estructuraSinRelleno) },
    {
      title: 'Botones',
      description: botones.intro,
      blocks: [
        ...principios(botones.principios),
        subTitle('Ejemplos de botones'),
        tablaPares('Ejemplos de botones correctos e incorrectos', botones.ejemplos),
        {
          type: 'practices',
          items: [
            practice('do', 'Botones que nombran la acción', 'Nombran la acción y su resultado.', <MuestraBotones bueno />),
            practice('dont', 'Botones genéricos', 'Genéricos o con instrucciones que no dicen qué ocurre.', <MuestraBotones bueno={false} />),
          ],
        },
      ],
    },
    {
      title: 'Campos',
      description: campos.intro,
      blocks: [
        ...principios(campos.principios),
        subTitle('Placeholders en campos reales'),
        ...placeholders.map(
          (p): FoundationBlock => ({
            type: 'practices',
            items: [
              practice('do', `${p.etiqueta}: placeholder correcto`, 'Un ejemplo real, en el formato esperado.', <MuestraCampo etiqueta={p.etiqueta} placeholder={p.correcto} />),
              practice('dont', `${p.etiqueta}: placeholder incorrecto`, 'Da una instrucción o repite la etiqueta.', <MuestraCampo etiqueta={p.etiqueta} placeholder={p.incorrecto} />),
            ],
          }),
        ),
      ],
    },
    {
      title: 'Lenguaje neutro',
      description: '',
      blocks: [
        ...lenguajeNeutro.intro.map((t): FoundationBlock => ({ type: 'text', content: t })),
        ...principios(lenguajeNeutro.pronombres),
        subTitle('Referencias por contexto'),
        {
          type: 'table',
          caption: 'Lenguaje neutro: qué evitar y qué usar según el contexto',
          minWidth: 720,
          columns: [{ header: 'Contexto', width: 220 }, { header: 'Evita', width: 360 }, { header: 'Usa', width: 380 }],
          rows: lenguajeNeutro.referencias.map((r) => [r.contexto, r.evita, r.usa]),
        },
      ],
    },
    {
      title: 'Mecánica de escritura',
      description: '',
      blocks: [
        {
          type: 'table',
          caption: 'Mecánica de escritura',
          minWidth: 800,
          columns: [{ header: 'Tema', width: 220 }, { header: 'Regla', width: 460 }, { header: 'Ejemplo', width: 300 }],
          rows: mecanica.map((m) => [m.tema, m.regla, m.ejemplo]),
        },
      ],
    },
    {
      title: 'Límites de caracteres',
      description: 'Son referencias de partida: se ajustan al componente y al canal.',
      blocks: [
        {
          type: 'table',
          caption: 'Límites de caracteres sugeridos',
          minWidth: 560,
          columns: [{ header: 'Elemento', width: 280 }, { header: 'Límite', width: 140 }, { header: 'Nota', width: 480 }],
          rows: limites.map((l) => [l.elemento, l.limite, l.nota]),
        },
      ],
    },
    {
      title: 'Abreviaturas',
      description: abreviaturas.intro,
      blocks: [
        { type: 'cards', items: [{ preview: <ListaVinetas items={abreviaturas.principios} /> }] },
        {
          type: 'table',
          caption: 'Abreviaturas aprobadas y formas incorrectas',
          minWidth: 560,
          columns: [{ header: 'Palabra', width: 300 }, { header: 'Correcto', width: 320 }, { header: 'Incorrecto', width: 320 }],
          rows: abreviaturas.tabla.map((a) => [a.palabra, a.correcto, a.incorrecto]),
        },
      ],
    },
    {
      title: 'Patrones por componente',
      description: patronesIntro,
      blocks: [
        {
          type: 'table',
          caption: 'Patrones de mensajes por componente',
          minWidth: 960,
          columns: [{ header: 'Componente', width: 220 }, { header: 'Fórmula', width: 240 }, { header: 'Ejemplo', width: 280 }, { header: 'En CAOS', width: 260 }],
          rows: patrones.map((p) => [p.componente, p.formula, p.ejemplo, <EnCaos key="c" nombres={p.enCaos} />]),
        },
      ],
    },
    {
      title: 'Así se ve en los componentes',
      description: '',
      blocks: [
        {
          type: 'cards',
          items: [
            'Error en un campo',
            'Error que impide una acción',
            'Estado vacío',
            'Éxito (toast)',
            'Confirmación de acción riesgosa',
          ].flatMap((nombre) => {
            const p = patron(nombre);
            return p
              ? [
                  {
                    title: p.componente,
                    preview: <MuestraPatron patron={p} />,
                    footer: (
                      <>
                        <strong>Fórmula:</strong> {p.formula}
                      </>
                    ),
                  },
                ]
              : [];
          }),
        },
      ],
    },
  ],
  accessibility: [
    {
      title: 'Accesibilidad / WCAG 2.2',
      description: 'Un texto también puede ser accesible o no. Estos criterios de WCAG 2.2 aplican a las palabras de la interfaz: enlaces, botones, etiquetas, errores y textos alternativos.',
      blocks: [
        {
          type: 'note',
          tone: 'neutral',
          title: 'Criterio propio',
          content:
            'La guía de voz, tono y estilo solo trae la tabla «Accesibilidad aplicada». El resto de esta pestaña es criterio propio del sistema de diseño, basado en WCAG 2.2. Revísalo con el equipo de UX Writing.',
        },
        {
          type: 'cards',
          columns: 3,
          items: [
            {
              title: 'Lenguaje claro',
              figure: '3.1.5',
              content:
                'Los textos se entienden con un nivel de lectura de educación secundaria inferior. WCAG lo pide en el nivel AAA: en CAOS es una meta de escritura, no un requisito de conformidad.',
            },
            {
              title: 'Enlaces y botones',
              figure: '2.4.4',
              content: 'El enlace o el botón dice a dónde lleva o qué hace, y se entiende fuera de la frase que lo rodea (A).',
            },
            {
              title: 'Errores',
              figure: '3.3.1 y 3.3.3',
              content: 'El error se dice con palabras, junto al campo, y explica cómo corregirlo (A y AA).',
            },
          ],
        },
        {
          type: 'table',
          caption: 'Criterios WCAG que aplican a los textos',
          minWidth: 720,
          columns: [
            { header: 'Criterio', width: 340 },
            { header: 'Qué pide a los textos', width: 700 },
          ],
          rows: [
            ['1.1.1 · Contenido no textual (A)', 'El texto alternativo describe la información o la función, no el objeto. Si la imagen es decorativa, lleva el alt vacío.'],
            ['1.4.5 · Imágenes de texto (AA)', 'El texto va escrito como texto y no dentro de una imagen, para que un lector de pantalla lo lea y se pueda ampliar.'],
            ['2.4.4 · Propósito de los enlaces, en contexto (A)', 'El enlace dice a dónde lleva o qué hace. «Haz clic aquí» no lo dice.'],
            ['2.4.6 · Encabezados y etiquetas (AA)', 'Los titulares y las etiquetas describen el tema o el propósito, con palabras de la persona.'],
            ['2.5.3 · Etiqueta en el nombre (A)', 'El nombre accesible de un botón o un campo empieza por su texto visible. El aria-label no lo reemplaza por otra frase.'],
            ['3.1.4 · Abreviaturas (AAA)', 'La sigla se explica la primera vez o se escribe completa.'],
            ['3.1.5 · Nivel de lectura (AAA)', 'El texto se entiende sin estudios más allá de la educación secundaria inferior, o hay una versión más sencilla.'],
            ['3.3.1 · Identificación de errores (A)', 'El error se dice con texto y se asocia al campo. El color solo no basta.'],
            ['3.3.2 · Etiquetas o instrucciones (A)', 'Cada campo tiene una etiqueta visible y las instrucciones se leen antes de escribir, no solo como placeholder.'],
            ['3.3.3 · Sugerencias ante errores (AA)', 'El mensaje dice cómo corregir el dato cuando se puede saber.'],
          ],
        },
      ],
    },
    {
      title: 'Accesibilidad aplicada',
      description: 'La accesibilidad también se escribe. Estas reglas son de la guía de voz, tono y estilo.',
      blocks: [
        {
          type: 'table',
          caption: 'Accesibilidad aplicada a los textos',
          minWidth: 800,
          columns: [{ header: 'Regla', width: 420 }, { header: 'Correcto', width: 280 }, { header: 'Incorrecto', width: 280 }],
          rows: accesibilidad.map((a) => [a.regla, a.correcto, a.incorrecto]),
        },
      ],
    },
    {
      title: 'Enlaces, botones y etiquetas',
      description: 'Una persona que usa un lector de pantalla recorre la lista de enlaces y de campos sin ver lo que los rodea. Cada texto tiene que bastar solo.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice('do', 'Botón que dice qué hace', 'El texto dice qué hace el botón y se entiende en una lista de elementos, sin la frase de al lado.', <MuestraBoton texto="Ver detalle del envío" />),
            practice('dont', 'Botón que depende del contexto', 'Varios «Ver más» seguidos suenan igual en una lista de elementos y no dicen a qué llevan.', <MuestraBoton texto="Ver más" variante="secondary" />),
          ],
        },
        {
          type: 'practices',
          items: [
            practice(
              'do',
              'Instrucción visible',
              'La etiqueta es visible y la instrucción se lee antes de escribir. El placeholder solo muestra un ejemplo.',
              <MuestraCampoConAyuda etiqueta="Celular" ayuda="Escribe los 10 dígitos, sin el indicativo." placeholder="310 123 4567" />,
            ),
            practice(
              'dont',
              'Instrucción solo en el placeholder',
              'La instrucción desaparece al escribir y un lector de pantalla puede no leerla.',
              <MuestraCampoConAyuda etiqueta="Celular" placeholder="Escribe los 10 dígitos, sin el indicativo" />,
            ),
          ],
        },
      ],
    },
    {
      title: 'Mensajes de error',
      description: 'El error dice qué pasó y cómo seguir, con palabras, y va pegado al campo. Reusa las fórmulas de la guía.',
      blocks: [
        {
          type: 'practices',
          items: [
            practice(
              'do',
              'Error que dice qué corregir',
              'Dice qué se necesita, sin culpar, y el estado no depende del color.',
              <MuestraErrorCampo etiqueta="Celular" valor="310 123 45" error={patron('Error en un campo')?.ejemplo ?? ''} />,
            ),
            practice(
              'dont',
              'Error que no explica',
              'Dice que algo falló, pero no qué dato ni cómo corregirlo.',
              <MuestraErrorCampo etiqueta="Celular" valor="310 123 45" error="Dato inválido" />,
            ),
          ],
        },
      ],
    },
    {
      title: 'Cómo lo lee un lector de pantalla',
      description: 'La forma de escribir una cifra, una fecha o una sigla cambia cómo la lee una persona que no la ve. Cada lector se comporta distinto: estas son pautas de escritura, no promesas de lectura.',
      blocks: [
        {
          type: 'table',
          caption: 'Cifras, fechas, siglas y símbolos: cómo escribirlos para que se lean bien',
          minWidth: 800,
          columns: [
            { header: 'Elemento', width: 200 },
            { header: 'Escríbelo así', width: 300 },
            { header: 'Por qué ayuda', width: 500 },
          ],
          rows: [
            ['Horas', '5:00 p.m.', 'Los puntos separan las letras y evitan que «pm» se lea como una palabra suelta. La guía de mecánica pide el formato de 12 horas.'],
            ['Dinero', lineas('$12.340', '10.000 pesos'), 'El separador de miles agrupa la cifra y la palabra «pesos» deja claro de qué es en una frase corrida.'],
            ['Fechas', lineas('26 de octubre', '26/10/2026 (solo en tablas y campos)'), 'Con el mes en letras no hay duda entre día/mes y mes/día.'],
            ['Celular', '310 123 4567', 'Los bloques 3-3-4 se leen en grupos y no como un número corrido.'],
            ['Siglas', 'Punto de atención móvil (PAMI)', 'Se explican la primera vez. Sin explicación, se deletrean sin sentido.'],
            ['Símbolos', 'Mis envíos y recogidas', 'La palabra se lee siempre igual; el «&» depende del lector.'],
            ['Mayúsculas sostenidas', 'Importante:', 'Algunos lectores deletrean las palabras en mayúsculas y cuestan más de leer. El énfasis va en negrita, con moderación.'],
            ['Emojis', 'Uno, al final, sin reemplazar palabras', 'El lector lee el nombre del emoji dentro de la frase. Un emoji que reemplaza una palabra deja la frase incompleta.'],
          ],
        },
      ],
    },
    {
      title: 'Textos alternativos y aria-label',
      description: 'Los textos que no se ven en pantalla también llevan la voz de la guía: claros, en español neutro y sin relleno.',
      blocks: [
        {
          type: 'table',
          caption: 'Textos alternativos y nombres accesibles',
          minWidth: 800,
          columns: [
            { header: 'Caso', width: 220 },
            { header: 'Ejemplo', width: 240 },
            { header: 'Regla', width: 540 },
          ],
          rows: [
            ['Imagen que informa', <code key="a">alt=&quot;Envío en camino&quot;</code>, 'Describe la información, no el objeto. «Imagen de un camión» no dice nada del envío.'],
            ['Imagen decorativa', <code key="b">alt=&quot;&quot;</code>, 'El alt vacío hace que el lector la ignore. Un texto inventado solo estorba.'],
            ['Botón con un ícono solo', <code key="c">aria-label=&quot;Cerrar&quot;</code>, 'Dice la función, en el mismo tono. No repite el rol: el lector ya dice «botón».'],
            ['Botón con texto visible', 'Crear envío', 'El nombre accesible empieza por el texto visible (2.5.3). No lo cambies por otra frase con aria-label.'],
            ['Campo', 'Celular', 'Etiqueta visible. El label solo para lectores (sr-only) se reserva para cuando el diseño no puede mostrarla.'],
          ],
        },
        { type: 'code', sample: { label: 'Textos alternativos, nombres accesibles y campos', code: CODIGO_TEXTOS_ACCESIBLES } },
        {
          type: 'note',
          tone: 'alert',
          title: 'Sin comprobar con un lector de pantalla',
          content:
            'Estos criterios salen de WCAG 2.2 y de la guía; los textos no se probaron con VoiceOver, NVDA ni TalkBack. Cómo se lee una cifra o una sigla cambia según el lector y el idioma configurado.',
        },
      ],
    },
  ],
  development: [
    {
      title: 'Revisión de textos de un componente nuevo',
      description: 'Cada componente nuevo del sistema, con sus historias y su documentación, pasa esta revisión de textos antes de cerrarse.',
      blocks: [
        {
          type: 'table',
          caption: 'Revisión de textos de un componente nuevo',
          minWidth: 720,
          columns: [{ header: 'Punto a revisar', width: 260 }, { header: 'Regla', width: 700 }],
          rows: revisionComponente.map((r) => [r.punto, r.regla]),
        },
      ],
    },
    {
      title: 'Cómo se usa al crear un componente',
      description: 'La lista se aplica a todo texto que el componente muestra o que lo documenta.',
      blocks: [
        {
          type: 'cards',
          items: [
            {
              title: 'Pasos de la revisión',
              steps: [
                { title: 'Reúne los textos', content: 'Etiquetas, placeholders, ayudas, errores, botones, textos para lectores de pantalla y los ejemplos de las historias y de la documentación.' },
                { title: 'Recorre la tabla', content: 'Compara cada texto con el punto que le corresponde y corrige lo que no cumple. Si falta un término, búscalo en el glosario.' },
                { title: 'Aplica el tono', content: 'Elige el tono según el momento con el mapa de tonos. Un error, un pago o un retraso no llevan humor ni exclamaciones.' },
                { title: 'Cierra el componente', content: 'El componente se da por terminado cuando todos sus textos pasan la revisión.' },
              ],
            },
          ],
        },
        { type: 'code', sample: { label: 'Leer la lista de revisión desde el código', code: CODIGO_REVISION } },
      ],
    },
    {
      title: 'Fundamentos de UX Writing',
      description: anexo.intro,
      blocks: [
        subTitle('Objetivos'),
        { type: 'cards', items: [{ preview: <ListaVinetas items={anexo.objetivos.map((o) => <><strong>{o.titulo}.</strong> {o.texto}</>)} /> }] },
        subTitle('Cuándo usar las heurísticas'),
        { type: 'cards', items: [{ preview: <ListaVinetas items={anexo.cuandoUsar} /> }] },
        subTitle('Heurísticas de UX Writing'),
        { type: 'text', content: anexo.heuristicasIntro },
        { type: 'cards', items: [{ preview: <ListaVinetas items={anexo.heuristicas.map((h) => <><strong>{h.titulo}.</strong> {h.texto}</>)} /> }] },
        subTitle('Cómo son los buenos contenidos'),
        { type: 'cards', items: [{ preview: <ListaVinetas items={anexo.contenidos.map((c) => <><strong>{c.titulo}.</strong> {c.texto}</>)} /> }] },
      ],
    },
    {
      title: 'Consumo técnico',
      description: (
        <>
          El texto de esta página no está escrito en la página: vive en <code>vozYTono.content.ts</code> y la página lo reparte en las cuatro pestañas.
        </>
      ),
      blocks: [
        {
          type: 'note',
          tone: 'accent',
          title: 'Una sola fuente',
          content: (
            <>
              <code>src/foundations/VozYTono/vozYTono.content.ts</code> es la fuente única de la guía. Si la guía cambia, se edita ahí y la página se actualiza sola. No copies sus frases a una historia o a una documentación: impórtalas.
            </>
          ),
        },
        {
          type: 'table',
          caption: 'Exports de vozYTono.content.ts y la pestaña donde se muestran',
          minWidth: 800,
          columns: [
            { header: 'Exports', width: 420 },
            { header: 'Contenido', width: 300 },
            { header: 'Pestaña', width: 200 },
          ],
          rows: [
            [<code key="1">ficha</code>, 'Versión, responsable, a quién aplica y cómo proponer cambios', 'Definición'],
            [<code key="2">proposito</code>, 'Propósito de la guía', 'Definición'],
            [<code key="3">rutaRapida</code>, 'Qué necesitas y en qué pestaña y sección está', 'Definición'],
            [<code key="4">vozEn30, atributos, checklist</code>, 'Voz en 30 segundos, atributos y checklist', 'Definición'],
            [<code key="5">vozDescripcion, adn, audiencias</code>, 'La voz de la marca y sus audiencias', 'Definición'],
            [<code key="6">tonoIntro, tonoEnFlujo, humorRegla, mapaDeTonos, elegirTono</code>, 'Tono', 'Definición'],
            [<code key="7">glosarioIntro, glosario</code>, 'Términos aprobados', 'Definición'],
            [<code key="8">terminosBaseIntro</code>, 'Introducción a los términos base. No se muestra en la página.', 'Ninguna'],
            [<code key="9">comoEscribimosIntro, persona, estilo, estructuraSinRelleno, botones, campos, placeholders, lenguajeNeutro</code>, 'Cómo escribimos', 'Aplicación'],
            [<code key="10">mecanica, limites, abreviaturas</code>, 'Mecánica de escritura', 'Aplicación'],
            [<code key="11">patronesIntro, patrones</code>, 'Fórmulas por componente y muestras', 'Aplicación'],
            [<code key="12">accesibilidad</code>, 'Accesibilidad aplicada', 'Accesibilidad'],
            [<code key="13">revisionComponente, anexo</code>, 'Revisión de un componente nuevo y fundamentos de UX Writing', 'Desarrollo'],
          ],
        },
        { type: 'code', sample: { label: 'Usar un patrón de la guía en un componente', code: CODIGO_CONSUMO } },
        {
          type: 'cards',
          items: [
            {
              title: 'Cambiar el texto de la guía',
              steps: [
                { title: 'Edita el archivo', content: <>Cambia el texto en <code>vozYTono.content.ts</code> y deja la estructura de la página como está.</> },
                { title: 'Actualiza las referencias', content: <>Si renombras una sección, ajusta <code>rutaRapida</code> y la columna «Dónde ver el detalle» de <code>checklist</code>, que nombran la pestaña y la sección.</> },
                { title: 'Verifica', content: 'Revisa que ninguna otra parte del repo dependa del export que cambiaste y que la página siga completa a 390 px.' },
              ],
            },
          ],
        },
      ],
    },
  ],
};
