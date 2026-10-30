/**
 * Voz y tono: contenido de la Guía de voz, tono y estilo (v2.0, octubre de 2026, equipo de UX Writing).
 *
 * Fuente única de la página "Fundamentos de diseño/Voz y tono" y de la revisión de textos de cada
 * componente nuevo (labels, placeholders, ayudas, errores, estados vacíos, botones y textos de ejemplo
 * de historias y docs). Si la guía cambia, se actualiza aquí y la página se actualiza sola.
 *
 * Criterio editorial al pasar la guía al sistema de diseño:
 * - Se corrigieron erratas evidentes ("Tú envío" → "Tu envío"; "N.°" → "N.º", como en Abreviaturas).
 * - Las filas incompletas o repetidas de la fuente no se publican hasta que UX Writing las complete
 *   (lista en `.qa/voz-y-tono/pendientes.md`, fuera del repo).
 */

/** Par de ejemplos: lo que sí y lo que no */
export interface UsoPar {
  correcto: string;
  incorrecto: string;
  /** Prefijo de contexto ("1ª plural", "Titular", "CTA"…) */
  contexto?: string;
}

/** Principio con su explicación y, si aplica, ejemplos */
export interface Principio {
  titulo: string;
  texto: string;
  ejemplos?: UsoPar[];
}

export const ficha = {
  version: '2.0 · Octubre de 2026',
  responsable: 'Equipo de UX Writing',
  aplicaA: 'App, web, correos, notificaciones push y SMS de Inter Rapidísimo',
  cambios:
    'Se envía al equipo de UX Writing el texto actual, el texto sugerido y el motivo. Los cambios aprobados se publican en una nueva versión de la guía y de esta página.',
};

export const proposito =
  'Diseñamos interfaces digitales a través de palabras que guían, simplifican y generan confianza. Transformamos la complejidad en claridad y creamos un lenguaje accesible que acerca a las personas a lo que realmente necesitan lograr.';

/** Ruta rápida: qué necesitas → en qué pestaña está */
export const rutaRapida: { necesidad: string; pestana: string; seccion: string }[] = [
  { necesidad: 'Entender la voz en un minuto', pestana: 'Voz', seccion: 'Voz en 30 segundos' },
  { necesidad: 'Revisar un texto antes de publicarlo', pestana: 'Voz', seccion: 'Checklist antes de publicar' },
  { necesidad: 'Elegir el tono para un mensaje', pestana: 'Tono', seccion: 'Mapa de tonos por situación' },
  { necesidad: 'Nombrar un botón, un titular o un campo', pestana: 'Cómo escribimos', seccion: 'Estructura sin relleno, Botones y Campos' },
  { necesidad: 'Resolver dudas de forma (mayúsculas, dinero, fechas, límites)', pestana: 'Mecánica', seccion: 'Mecánica de escritura' },
  { necesidad: 'Escribir un error, un estado vacío, un correo o un SMS', pestana: 'Patrones', seccion: 'Patrones por componente' },
  { necesidad: 'Confirmar cómo se llama algo en el producto', pestana: 'Glosario', seccion: 'Glosario' },
];

/* ------------------------------------------------------------------ Voz */

export const vozEn30 =
  'Somos el socio de confianza que entiende que cada envío es importante: hablamos claro, humano y real, con entusiasmo sin exagerar.';

export interface Atributo {
  nombre: string;
  enUnaLinea: string;
  suenaAsi: string;
  /** Desarrollo del atributo */
  descripcion: string;
  ejemplos: string[];
  somos: string;
  noSomos: string;
  /** Texto que no suena a la marca */
  asiNo: string;
}

export const atributos: Atributo[] = [
  {
    nombre: 'Clara',
    enUnaLinea: 'Una idea por mensaje. La acción se entiende en menos de un segundo.',
    suenaAsi: 'Listo, programamos tu recogida.',
    descripcion:
      'Sin rodeos. La rapidez también aplica para entender: la persona debe captar la acción en menos de un segundo. Priorizamos esa comprensión sobre los adornos literarios; un mensaje corto y preciso demuestra respeto por el tiempo del usuario.',
    ejemplos: ['¿Quieres eliminar el cuarto envío? Si lo eliminas, perderás su información.'],
    somos: 'Directos, con una idea por mensaje.',
    noSomos: 'Rebuscados, literarios ni llenos de jerga logística.',
    asiNo: 'Su solicitud de recolección fue registrada exitosamente en nuestro sistema.',
  },
  {
    nombre: 'Humana y empática',
    enUnaLinea: 'Hablamos como colegas y cuidamos el momento de la persona.',
    suenaAsi: 'Tu envío se retrasó. Te avisaremos apenas avance.',
    descripcion:
      'Hablamos en lenguaje cotidiano, como en una conversación entre colegas de trabajo. Evitamos los tecnicismos logísticos: lo que es entendible para nosotros puede no serlo para nuestros usuarios, así que traducimos ese conocimiento a su lenguaje. Y como todos los envíos son importantes, cuidamos la experiencia y el momento que vive la persona en la interfaz.',
    ejemplos: [
      'Pago en Casa: ¿Quieres que cobremos el dinero de tu producto y lo enviemos a tu cuenta?',
      'Antes de empezar, puedes descargar esta plantilla, completar los datos y subirla cuando te lo indiquemos.',
      'Importante: las opciones que elijas al momento de crear el envío masivo se aplicarán a todos los registros de tu archivo.',
    ],
    somos: 'Colegas que cuidan el momento de la persona.',
    noSomos: 'Corporativos y fríos.',
    asiNo: 'Estimado usuario, su envío presenta una novedad.',
  },
  {
    nombre: 'Real',
    enUnaLinea: 'Usamos las palabras del día a día: entregar, recoger, cobrar.',
    suenaAsi: 'Hasta 2.000 paquetes en un solo envío.',
    descripcion:
      'Nos conectamos con la operación del día a día: recoger, enviar, rastrear, cobrar y recibir. Usamos las palabras y las situaciones que las personas viven con sus paquetes, sus clientes y el dinero que entra.',
    ejemplos: ['¿Cuántos paquetes quieres enviar hoy?'],
    somos: 'Hablamos de lo que la persona vive: enviar, recoger, cobrar.',
    noSomos: 'Genéricos ni abstractos.',
    asiNo: 'Optimiza tu gestión logística con soluciones integrales.',
  },
  {
    nombre: 'Entusiasta y cercana',
    enUnaLinea: 'Positivos con los siguientes pasos, sin exagerar ni falsear.',
    suenaAsi: '¡Tu envío va en camino! Te notificaremos cuando esté cerca de ti.',
    descripcion:
      'Nos enfocamos en las soluciones y los siguientes pasos, incluso cuando ocurre un error. Acompañamos con entusiasmo genuino, sin positivismo exagerado ni exceso de adjetivos. Indicamos qué puede hacer el usuario, evitamos frases alarmistas y celebramos solo lo que vale la pena celebrar.',
    ejemplos: ['Tu envío tendrá prioridad y lo enviaremos tan pronto llegue a la bodega de destino.'],
    somos: 'Positivos con los siguientes pasos; celebramos lo que vale la pena.',
    noSomos: 'Exagerados, falsos ni alarmistas.',
    asiNo: '¡Error crítico! No se pudo procesar el envío.',
  },
];

/** Checklist antes de publicar: pregunta → pestaña donde está el detalle */
export const checklist: { pregunta: string; dondeVer: string }[] = [
  { pregunta: '¿La acción se entiende en menos de un segundo?', dondeVer: 'Voz · Atributos' },
  { pregunta: '¿Suena a una persona? (tú, primera persona, voz activa)', dondeVer: 'Cómo escribimos' },
  { pregunta: '¿El titular y el subtítulo dicen cosas distintas, y cada palabra aporta?', dondeVer: 'Cómo escribimos · Estructura sin relleno' },
  { pregunta: '¿Los botones y los campos usan palabras del usuario y términos del glosario?', dondeVer: 'Cómo escribimos · Botones, Campos · Glosario' },
  { pregunta: '¿El tono corresponde al momento: dinero, error, espera o logro?', dondeVer: 'Tono' },
  { pregunta: '¿Es neutro en género, accesible y respeta la mecánica (moneda, fechas, límites)?', dondeVer: 'Cómo escribimos · Lenguaje neutro · Mecánica' },
  { pregunta: '¿Sobra algo? Si al quitarlo el significado no cambia, se quita.', dondeVer: 'Cómo escribimos · Estructura sin relleno' },
];

export const vozDescripcion =
  'La voz debe ser clara, humana, real y entusiasta, siempre con propósito. Hablamos como un socio de confianza que facilita la operación: comunicamos soluciones en lugar de problemas, eliminamos la distancia corporativa y mantenemos un tono cercano que motive y genere confianza en cada interacción. Inter Rapidísimo transmite que cada envío une historias, personas y oportunidades.';

export const adn = {
  texto:
    'Lo que decimos refleja la realidad de quienes envían, reciben y emprenden en Colombia: cotidiana, dinámica y enfocada en resolver. Hablamos como lo haría un aliado que conoce el día a día de la persona, sin lenguaje corporativo ni tecnicismos que la alejen de lo que necesita lograr.',
  rasgos: [
    'Es clara y útil primero.',
    'Mantiene un tono entusiasta y cercano.',
    'Refuerza la confianza y el acompañamiento.',
    'Reconoce que detrás de cada envío hay algo importante para el usuario.',
    'Parte de la realidad del día a día: enviar, recoger, cobrar y recibir.',
    'En los productos digitales guía, informa y tranquiliza, con la misma calidez, pero con precisión funcional.',
  ],
};

export const audiencias: { audiencia: string; necesita: string; ajuste: string }[] = [
  {
    audiencia: 'Remitente / cliente',
    necesita: 'Crear, pagar y seguir envíos sin fricción.',
    ajuste: 'Instrucciones cortas, lenguaje cotidiano y el siguiente paso siempre a la vista.',
  },
  {
    audiencia: 'Destinatario',
    necesita: 'Saber cuándo y dónde llega su envío.',
    ajuste: 'Mensajes breves y sin jerga, con un solo dato clave por mensaje: fecha, lugar o código.',
  },
  {
    audiencia: 'Emprendedor o comerciante',
    necesita: 'Control de su operación y de su dinero.',
    ajuste: 'Tono real y de negocio: cifras claras, tiempos exactos y términos del glosario.',
  },
  {
    audiencia: 'Aliado operativo',
    necesita: 'Ejecutar la operación rápido y sin errores.',
    ajuste:
      'Pueden usarse términos operativos del glosario (estiba, casillero, auditoría de pesos), porque los conocen. Instrucciones precisas y sin adornos.',
  },
];

/* ------------------------------------------------------------------ Tono */

export const tonoIntro = [
  'Los tonos varían según el momento y el contexto que vive la persona; la voz es siempre la misma.',
  'Podemos movernos entre lo informativo, lo cercano y lo motivador, pero nunca hacia lo demasiado formal y distante. En cada tono mantenemos la misma actitud: la de un socio de confianza que facilita la operación.',
  'Una persona puede pasar de consultar el estado de una guía a hacer cambios en su envío, así que el tono depende del contexto y de la necesidad del momento. Identificar la emoción del usuario para escribir con el tono adecuado es tarea de UX Writing.',
];

/** Ejemplo de variación de tono dentro de un mismo flujo (Inter Pay, transferencia a cuenta frecuente) */
export const tonoEnFlujo = {
  flujo: 'Inter Pay · Transferencia a una cuenta frecuente',
  etapas: [
    { etapa: 'Consulta de saldo', emocion: 'Esperanza, ansiedad', tono: 'Informativo, directo y neutral', ejemplo: 'Saldo disponible · Mis movimientos · Transferir' },
    { etapa: 'Transferir', emocion: 'Cautela, curiosidad', tono: 'Preciso, claro y directo', ejemplo: 'Valor a transferir · Cuenta' },
    {
      etapa: 'Finalización',
      emocion: 'Alivio, duda',
      tono: 'Informativo, amigable y útil',
      ejemplo: 'Esta transferencia está pendiente de validación por la entidad bancaria. Puede tardar hasta 12 horas en días hábiles.',
    },
  ],
};

export const humorRegla =
  'El humor y la celebración solo caben donde el riesgo es bajo (bienvenidas, logros y promociones). Nunca en errores, dinero, retrasos, pérdidas ni temas legales, y siempre sin sarcasmo.';

export type Celebracion = 'si' | 'una' | 'no';

export interface TonoSituacion {
  situacion: string;
  tono: string;
  celebracion: Celebracion;
  /** Texto de la columna "Humor y celebración" */
  celebracionTexto: string;
  ejemplo: string;
}

export const mapaDeTonos: TonoSituacion[] = [
  { situacion: 'Bienvenida', tono: 'Cálido y motivador', celebracion: 'si', celebracionTexto: 'Sí, con medida', ejemplo: 'Te damos la bienvenida a Inter Pay.' },
  { situacion: 'Seguimiento', tono: 'Informativo, directo y neutral', celebracion: 'no', celebracionTexto: 'No', ejemplo: 'Tu envío salió de la bodega de origen.' },
  { situacion: 'Acción completada', tono: 'Amigable y breve', celebracion: 'una', celebracionTexto: 'Sí, una como máximo', ejemplo: 'Listo, creamos tu envío.' },
  {
    situacion: 'Espera o validación',
    tono: 'Tranquilizador y preciso: da el tiempo',
    celebracion: 'no',
    celebracionTexto: 'No',
    ejemplo: 'Estamos validando tu transferencia. Puede tardar hasta 12 horas en días hábiles.',
  },
  {
    situacion: 'Error corregible',
    tono: 'Claro, sin culpar y con salida',
    celebracion: 'no',
    celebracionTexto: 'No',
    ejemplo: 'No pudimos crear tu envío. Puedes revisar la dirección e intentarlo de nuevo.',
  },
  {
    situacion: 'Error del sistema',
    tono: 'Empático y responsable, sin tecnicismos',
    celebracion: 'no',
    celebracionTexto: 'No',
    ejemplo: 'Hubo una falla de nuestro lado. Puedes intentarlo de nuevo en unos minutos.',
  },
  {
    situacion: 'Retraso o novedad',
    tono: 'Empático y transparente, con el siguiente paso',
    celebracion: 'no',
    celebracionTexto: 'No',
    ejemplo: 'Tu envío se retrasó. Te avisaremos apenas avance.',
  },
  {
    situacion: 'Pérdida o daño',
    tono: 'Serio, empático y accionable',
    celebracion: 'no',
    celebracionTexto: 'No',
    ejemplo: 'Sentimos lo que pasó con tu envío. Puedes contarnos qué ocurrió para ayudarte.',
  },
  { situacion: 'Dinero', tono: 'Preciso y transparente, sin adornos', celebracion: 'no', celebracionTexto: 'No', ejemplo: 'Te cobramos $12.340 por este envío.' },
  {
    situacion: 'Legal y términos',
    tono: 'Claro, formal pero cercano',
    celebracion: 'no',
    celebracionTexto: 'No',
    ejemplo: 'Al continuar, aceptas los Términos y condiciones.',
  },
  {
    situacion: 'Promociones',
    tono: 'Entusiasta y concreto',
    celebracion: 'si',
    celebracionTexto: 'Sí, con medida',
    ejemplo: 'Este mes tienes 15% de descuento usando Inter Pay.',
  },
];

/** Cómo elegir el tono: se responden en orden y se aplica la primera que corresponda */
export const elegirTono: { pregunta: string; entonces: string }[] = [
  { pregunta: '¿Hay dinero, datos personales o un problema con el envío?', entonces: 'Tono serio y preciso. Sin humor ni celebración.' },
  { pregunta: '¿La persona está esperando o preocupada?', entonces: 'Tono tranquilizador: qué pasa, cuánto falta y qué sigue.' },
  { pregunta: '¿Acaba de lograr algo?', entonces: 'Tono amigable y breve. Una celebración como máximo.' },
  { pregunta: '¿Ninguna de las anteriores?', entonces: 'Tono base: informativo y cercano.' },
];

/* ------------------------------------------------------------------ Cómo escribimos */

export const comoEscribimosIntro =
  'Escribimos como personas: claros, amables y en primera persona. Evitamos las narraciones impersonales y los imperativos.';

export const persona: Principio[] = [
  {
    titulo: 'Primera persona',
    texto:
      'Cuando hablamos desde Inter Rapidísimo usamos la primera persona del plural. Las acciones que puede hacer el usuario se escriben en primera persona del singular o en forma neutra.',
    ejemplos: [
      { contexto: '1ª plural', correcto: 'Te cargamos 10.000 pesos en Inter Pay.', incorrecto: 'Inter Rapidísimo te cargó 10.000 pesos en Inter Pay.' },
      { contexto: '1ª singular', correcto: 'Quiero saber más.', incorrecto: 'Haz clic para saber más.' },
      { contexto: 'Neutro', correcto: 'Cancelar pedido.', incorrecto: 'Cancela pedido.' },
    ],
  },
  {
    titulo: 'Voz activa',
    texto:
      'Redactamos en voz activa, con el foco en quien hace la acción. Los mensajes quedan más claros, directos y fáciles de entender; la voz pasiva resulta distante y menos dinámica.',
    ejemplos: [{ correcto: 'Enviamos la factura a tu correo electrónico.', incorrecto: 'Tu factura fue enviada por correo electrónico.' }],
  },
  {
    titulo: 'Tuteo',
    texto: 'Nos dirigimos al usuario de tú, nunca de usted ni de vos. Es más cercano y se mantiene igual en todo el producto.',
    ejemplos: [
      { correcto: '¿Quieres eliminar el cuarto envío?', incorrecto: '¿Desea eliminar el cuarto envío?' },
      { correcto: 'Tu envío llegó a la oficina.', incorrecto: 'Su envío llegó a la oficina.' },
    ],
  },
  {
    titulo: 'Cómo nombramos la marca',
    texto:
      'La marca se escribe siempre completa y con tilde: Inter Rapidísimo. Los productos llevan mayúscula inicial en cada palabra, tal como se aprobaron. "Rapidísimo" se usa solo como nombre del servicio, no como abreviatura de la marca. Después de nombrarla, hablamos desde "nosotros".',
    ejemplos: [
      { correcto: 'Inter Rapidísimo · Inter Pay · Pago en Casa', incorrecto: 'Inter · InterRapidisimo · IR · inter pay' },
      { correcto: 'Te cargamos 10.000 pesos en Inter Pay.', incorrecto: 'Inter Rapidísimo te cargó 10.000 pesos en Inter Pay.' },
    ],
  },
];

export const estilo: Principio[] = [
  {
    titulo: 'No repetir palabras en un mismo párrafo',
    texto:
      'Repetir la misma palabra empobrece el texto y dificulta la lectura. Reorganiza la frase o usa sinónimos o pronombres que mantengan el significado.',
    ejemplos: [
      {
        correcto:
          'Los usuarios deben cumplir con los requisitos establecidos en los Términos y condiciones para disfrutar de estos descuentos. Además, deben haber realizado más de dos pedidos y no pueden acumular otro tipo de beneficios.',
        incorrecto:
          'Los usuarios deben cumplir con los requisitos establecidos en los Términos y condiciones para disfrutar de estos descuentos. Además los usuarios deben haber realizado más de dos pedidos y no pueden acumular otro tipo de descuento.',
      },
    ],
  },
  {
    titulo: 'Asterisco para notas',
    texto:
      'El asterisco añade notas o aclaraciones de un nivel inferior al texto principal. En una frase suelta o un párrafo independiente va al inicio; dentro de un párrafo, al final de la frase y antes de los signos de puntuación, para no interrumpir la lectura.',
    ejemplos: [
      { correcto: '*En descuentos por llevar 4 ofertas: $12.340', incorrecto: 'En descuentos por llevar 4 ofertas:* $12.340' },
      {
        correcto:
          'Para disfrutar de este descuento, debes cumplir con los requisitos establecidos*. Además debes haber realizado más de dos pedidos y no puedes acumular otro tipo de beneficios.',
        incorrecto:
          'Para disfrutar de este descuento, debes cumplir con los requisitos establecidos.*Además debes haber realizado más de dos pedidos y no puedes acumular otro tipo de beneficios.',
      },
    ],
  },
  {
    titulo: 'Lo esencial, de un vistazo',
    texto:
      'Organiza la información para que lo esencial se identifique con un vistazo rápido: jerarquía con tamaños, negritas, viñetas o listas, de modo que el contenido se entienda incluso sin leerlo todo.',
    ejemplos: [{ correcto: 'Entrega hoy: llega el mismo día en la ciudad.', incorrecto: 'Hoy el envío llega a la ciudad' }],
  },
];

export const estructuraSinRelleno: Principio[] = [
  {
    titulo: 'Titulares directos',
    texto: 'Los titulares van directo a la acción o al concepto central de la pantalla: dicen de qué trata o qué se puede hacer, sin saludos ni introducciones.',
    ejemplos: [
      { contexto: 'Titular', correcto: 'Crear envío masivo', incorrecto: 'Bienvenido a la sección donde podrás crear envíos masivos' },
      { contexto: 'Titular', correcto: 'Mis sucursales', incorrecto: 'Gestión y administración de sucursales' },
    ],
  },
  {
    titulo: 'Subtítulos que aportan',
    texto: 'Los subtítulos aportan valor real o explican el beneficio de la acción. Nunca repiten lo que ya dicen el titular o las etiquetas de los campos.',
  },
  {
    titulo: 'Economía de palabras',
    texto: 'No estamos obligados a hacer listas de tres elementos ni a usar frases largas. Si una idea se explica con uno o dos conceptos contundentes, se deja ahí.',
    ejemplos: [
      { correcto: 'Recogemos en tu puerta y entregamos en destino.', incorrecto: 'Recogemos, entregamos y cuidamos tu envío con rapidez, seguridad y confianza.' },
      { correcto: 'Listo, creamos tu envío.', incorrecto: '¡Excelente! Tu envío fue creado exitosamente y ahora está en proceso de ser gestionado.' },
    ],
  },
];

export const botones: { intro: string; principios: Principio[]; ejemplos: UsoPar[] } = {
  intro:
    'Los botones anticipan la acción concreta que hará el usuario; no son comodines genéricos. Un buen CTA elimina la incertidumbre y aumenta la confianza en cada paso del flujo.',
  principios: [
    {
      titulo: 'Nombra la acción y su resultado',
      texto: 'El botón nombra la acción concreta y anticipa el resultado inmediato del clic. Evita etiquetas genéricas que no explican qué ocurrirá.',
      ejemplos: [{ contexto: 'CTA', correcto: 'Contactar · Ir al formulario', incorrecto: 'OK · Siguiente' }],
    },
    {
      titulo: 'Infinitivo, de una a tres palabras',
      texto:
        'Salvo en acciones de validación de información (por ejemplo, Entendido), el CTA va en infinitivo, idealmente de una sola palabra; si necesita más contexto, dos o tres, no más. El contexto puede ir después; evita el imperativo, que suena brusco y confunde.',
      ejemplos: [
        { correcto: 'Pagar · Continuar · Cancelar', incorrecto: 'Paga · Continúa · Cancela' },
        { correcto: 'Iniciar prueba gratis', incorrecto: 'Inicia una prueba gratis' },
      ],
    },
    {
      titulo: 'En positivo',
      texto: 'Nombramos lo que la persona sí va a hacer, no lo que quiere evitar: las formulaciones negativas generan confusión.',
      ejemplos: [{ correcto: 'Mantener la suscripción', incorrecto: 'No quiero cancelar la suscripción' }],
    },
  ],
  ejemplos: [
    { correcto: 'Crear envío', incorrecto: 'Aceptar / OK' },
    { correcto: 'Programar recogida', incorrecto: 'Programa tu recogida ahora' },
    { correcto: 'Mantener envío', incorrecto: 'No cancelar' },
    { correcto: 'Entendido (acción de validación)', incorrecto: 'Haz clic aquí' },
  ],
};

export const campos: { intro: string; principios: Principio[] } = {
  intro: 'Los campos son el punto donde el usuario trabaja. Sus textos deben sonar a lo que la persona ya sabe y vive, no a la base de datos.',
  principios: [
    {
      titulo: 'Etiquetas con nombres comunes',
      texto:
        'Usamos nombres comunes y funcionales en lugar de terminología técnica: la etiqueta habla como lo haría la persona para describir esa información. Si existe un término aprobado en el glosario, se usa ese.',
      ejemplos: [
        { correcto: '¿Qué vas a enviar?', incorrecto: 'Atributos o categoría' },
        { correcto: '¿Cuánto pesa?', incorrecto: 'Parámetros de peso y volumen' },
        { correcto: 'Nombre del destinatario', incorrecto: 'Nombre del receptor' },
      ],
    },
    {
      titulo: 'Placeholders como ejemplos reales',
      texto:
        'El placeholder muestra cómo luce una respuesta correcta, con datos cotidianos y en el formato esperado. No repite la etiqueta ni da instrucciones. Tampoco la reemplaza: desaparece al escribir, por eso lo esencial va siempre en la etiqueta o en el texto de ayuda.',
    },
  ],
};

/** Placeholders: etiqueta + placeholder correcto e incorrecto (se muestran en Input de CAOS) */
export const placeholders: { etiqueta: string; correcto: string; incorrecto: string }[] = [
  { etiqueta: 'Nombre del destinatario', correcto: 'Laura Gómez', incorrecto: 'Escribe aquí el nombre' },
  { etiqueta: 'Celular', correcto: '310 123 4567', incorrecto: 'Ingresa el número' },
  { etiqueta: 'Dirección', correcto: 'Cl. 72 # 10-34', incorrecto: 'Dirección completa' },
  { etiqueta: '¿Qué vas a enviar?', correcto: 'Dos camisetas y una gorra', incorrecto: 'Descripción del contenido' },
];

export const lenguajeNeutro = {
  intro: [
    'Preferimos sustantivos, pronombres y adjetivos neutros al género siempre que sea posible: "Hola" o "Te damos la bienvenida" en lugar de "Bienvenido".',
    'Diseñamos para todas las personas y no asumimos que nuestros usuarios son únicamente hombres. Usamos la riqueza del español (colectivos u omisión del sujeto) siempre que no comprometa la claridad ni la economía del lenguaje. No usamos "@" ni "x": afectan la accesibilidad.',
  ],
  pronombres: [
    { titulo: 'Evita asumir', texto: 'Evita los pronombres que asumen un género (él/ella), salvo que te refieras a una persona conocida.' },
    {
      titulo: 'Sin desdoblar',
      texto:
        'Para mantener la fluidez, evita el desdoblamiento constante ("los y las clientes"): prefiere términos neutros o, como último recurso, el masculino genérico, buscando minimizar su uso.',
    },
    { titulo: 'Construcciones impersonales', texto: '"¿Quieres eliminar la cuenta seleccionada?" en lugar de "¿Estás seguro de que quieres eliminar la cuenta seleccionada?". "Mi perfil" en lugar de "Perfil del usuario".' },
  ],
  referencias: [
    { contexto: 'Onboarding', evita: 'Bienvenido a Inter Pay', usa: 'Te damos la bienvenida a Inter Pay · ¡Hola, Juan!' },
    { contexto: 'Formularios', evita: '¿Eres ciudadano colombiano?', usa: '¿Tienes ciudadanía colombiana?' },
    { contexto: 'CTA', evita: 'Sé miembro', usa: 'Quiero unirme' },
    { contexto: 'Modales de confirmación', evita: '¿Estás seguro que quieres guardar los cambios?', usa: '¿Quieres guardar los cambios?' },
    { contexto: 'Errores', evita: 'Estimado usuario no tiene permiso para gestionar esta guía', usa: 'No tienes permisos para gestionar esta guía' },
  ],
};

/* ------------------------------------------------------------------ Mecánica */

export const mecanica: { tema: string; regla: string; ejemplo: string }[] = [
  { tema: 'Mayúsculas', regla: 'Solo la primera palabra y los nombres propios en titulares, botones y etiquetas.', ejemplo: '"Crear envío masivo", no "Crear Envío Masivo"' },
  { tema: 'Punto final', regla: 'Sin punto en titulares, botones, etiquetas ni textos de una sola línea. Con punto en mensajes de una o más oraciones.', ejemplo: '"Mis sucursales" · "Listo, creamos tu envío."' },
  { tema: 'Interrogación y exclamación', regla: 'Siempre con signo de apertura y de cierre.', ejemplo: '"¿Quieres eliminar el envío?"' },
  { tema: 'Exclamaciones', regla: 'Máximo una por pantalla y solo para celebrar un logro real. Nunca en errores, dinero, retrasos ni temas legales.', ejemplo: '"¡Hola, Juan!"' },
  { tema: 'Emojis', regla: 'Solo en notificaciones y mensajes promocionales: uno como máximo, al final y sin reemplazar palabras. Nunca en errores, pagos ni textos legales.', ejemplo: 'Un emoji, al final' },
  { tema: 'Mayúsculas sostenidas', regla: 'No se usan para dar énfasis. El énfasis va en negrita y con moderación.', ejemplo: '"Importante:", no "IMPORTANTE"' },
  { tema: 'Dinero', regla: 'Signo $ antes del valor, punto como separador de miles y sin decimales salvo que hagan falta. En frases corridas puede escribirse "pesos".', ejemplo: '"$12.340" · "10.000 pesos"' },
  { tema: 'Porcentajes', regla: 'Sin espacio entre el número y el signo.', ejemplo: '"15%"' },
  { tema: 'Fechas', regla: 'En texto: día y mes en letras, y el año solo si cambia. En tablas y campos: dd/mm/aaaa.', ejemplo: '"26 de octubre" · "26/10/2026"' },
  { tema: 'Horas', regla: 'Formato de 12 horas con "a.m." y "p.m." (ver Abreviaturas).', ejemplo: '"5:00 p.m."' },
  { tema: 'Plazos', regla: 'Se indica si son días hábiles o calendario.', ejemplo: '"Hasta 12 horas en días hábiles"' },
  { tema: 'Teléfonos y guías', regla: 'Celular en bloques de 3-3-4. El número de guía va sin espacios ni puntos.', ejemplo: '"310 123 4567"' },
];

/** Límites de caracteres sugeridos: referencia de partida, se ajustan al componente y al canal */
export const limites: { elemento: string; limite: string; nota: string }[] = [
  { elemento: 'Titular de pantalla', limite: '40', nota: 'Directo a la acción o al concepto central.' },
  { elemento: 'Subtítulo', limite: '100', nota: 'Una o dos líneas.' },
  { elemento: 'Botón', limite: '25', nota: 'Una palabra siempre que sea posible; máximo tres.' },
  { elemento: 'Etiqueta de campo', limite: '30', nota: 'Nombre común y funcional.' },
  { elemento: 'Mensaje de error', limite: '120', nota: 'Qué pasó y qué sigue.' },
  { elemento: 'Toast o confirmación breve', limite: '60', nota: 'Resultado en pocas palabras.' },
  { elemento: 'Push: título / cuerpo', limite: '40 / 120', nota: 'El título se corta primero en pantallas pequeñas.' },
  { elemento: 'Asunto de correo', limite: '50', nota: 'El dato clave va al comienzo.' },
  { elemento: 'SMS', limite: '160', nota: 'Incluye el nombre de la marca.' },
];

export const abreviaturas = {
  intro: 'Se escriben en minúscula, con punto abreviativo y plural correcto. No inventamos formas ni mezclamos variantes en una misma vista.',
  principios: [
    'La abreviatura nunca debe generar dudas: si no es ampliamente entendida, se escribe la palabra completa.',
    'Siempre la misma forma aprobada en todos los puntos de contacto (app, correos, notificaciones, recibos).',
    'Nada de abreviaturas inventadas o poco comunes: preferimos las de la RAE o las más usadas en el contexto local.',
    'Debe ahorrar espacio sin sacrificar la comprensión: "pág." es válido, "pa." no.',
    'Puntos y separadores que faciliten la lectura rápida: "a.m." y "p.m.", nunca "am".',
    'Respetar número y género cuando aplique: "uds." para el plural, no "un.".',
    'Nunca una abreviatura que se confunda con otras siglas o términos: "c." no se usa para "código".',
  ],
  tabla: [
    { palabra: 'Descuento', correcto: 'desct. o dto.', incorrecto: 'dcto. o dct' },
    { palabra: 'Unidad / unidades', correcto: 'ud. / uds.', incorrecto: 'un. / uns.' },
    { palabra: 'Ante meridiem', correcto: 'a.m.', incorrecto: 'am o a m' },
    { palabra: 'Post meridiem', correcto: 'p.m.', incorrecto: 'pm o p m' },
    { palabra: 'Documento / documentos', correcto: 'doc. / docs.', incorrecto: 'docu. / docus.' },
    { palabra: 'Volumen / volúmenes', correcto: 'vol. / vols.', incorrecto: 'volum. / volus.' },
    { palabra: 'Código', correcto: 'cód.', incorrecto: 'c. o codi.' },
    { palabra: 'Página / páginas', correcto: 'pág. o p. / págs. o pp.', incorrecto: 'pa. / ps.' },
    { palabra: 'Dirección', correcto: 'dir.', incorrecto: 'dir o direc.' },
    { palabra: 'Calle', correcto: 'cl., c. o c/', incorrecto: 'cl o call.' },
    { palabra: 'Avenida', correcto: 'av., avd. o avda.', incorrecto: 'av o ave.' },
    { palabra: 'Número', correcto: 'N.º, n.º o #', incorrecto: 'num. o nu.' },
    { palabra: 'Ejemplo', correcto: 'ej.', incorrecto: 'ejem. o ej' },
  ],
};

/** Accesibilidad aplicada: la accesibilidad también se escribe */
export const accesibilidad: { regla: string; correcto: string; incorrecto: string }[] = [
  { regla: 'El enlace dice a dónde lleva o qué hace.', correcto: 'Descargar plantilla', incorrecto: 'Haz clic aquí' },
  { regla: 'El estado se dice con palabras, no solo con color.', correcto: 'Este campo es obligatorio', incorrecto: 'Un campo en rojo sin texto' },
  { regla: 'Las siglas se explican la primera vez, o se evitan con quien no las conoce.', correcto: 'Punto de atención móvil (PAMI)', incorrecto: 'PAMI sin contexto' },
  { regla: 'El error va junto al campo y dice qué corregir.', correcto: 'El celular debe tener 10 dígitos', incorrecto: 'Dato inválido' },
  { regla: 'El texto alternativo describe la información, no el objeto.', correcto: 'Envío en camino', incorrecto: 'Imagen de un camión' },
  { regla: 'Palabras en lugar de símbolos que se leen mal.', correcto: 'Mis envíos y recogidas', incorrecto: 'Mis envíos & recogidas' },
];

/* ------------------------------------------------------------------ Patrones por componente */

export interface Patron {
  componente: string;
  formula: string;
  ejemplo: string;
  /** Componentes de CAOS donde aplica la fórmula (nombre de la carpeta en src/components) */
  enCaos: string[];
  /** Partes del ejemplo para la muestra viva (título sin punto final, como pide la mecánica) */
  muestra?: { titulo: string; texto?: string; acciones: string[] };
}

export const patronesIntro = 'Fórmulas y ejemplos para los mensajes que más se escriben. Se adaptan al caso: no se copian al pie de la letra.';

export const patrones: Patron[] = [
  { componente: 'Error en un campo', formula: 'Qué se necesita, sin culpar', ejemplo: 'El número de celular debe tener 10 dígitos.', enCaos: ['Input', 'Select', 'Textarea', 'PhoneInput', 'NotificationText'] },
  {
    componente: 'Error que impide una acción',
    formula: 'Qué pasó + qué sigue',
    ejemplo: 'No pudimos crear tu envío. Puedes revisar los datos e intentarlo de nuevo.',
    enCaos: ['Alert', 'Toast'],
  },
  {
    componente: 'Error del sistema',
    formula: 'Responsabilidad + cuándo reintentar',
    ejemplo: 'Algo falló de nuestro lado. Puedes intentarlo de nuevo en unos minutos.',
    enCaos: ['EmptyState', 'Alert'],
  },
  {
    componente: 'Estado vacío',
    formula: 'Qué va aquí + cómo empezar, con un botón que nombra la acción',
    ejemplo: 'Aún no tienes envíos. Cuando crees uno, lo verás aquí. Botón: Crear envío',
    enCaos: ['EmptyState'],
    muestra: { titulo: 'Aún no tienes envíos', texto: 'Cuando crees uno, lo verás aquí.', acciones: ['Crear envío'] },
  },
  { componente: 'Éxito (toast)', formula: 'Resultado en pocas palabras', ejemplo: 'Contacto creado.', enCaos: ['Toast'] },
  {
    componente: 'Confirmación de acción riesgosa',
    formula: 'Pregunta directa + consecuencia + botones que nombran la acción',
    ejemplo: 'Título: ¿Quieres eliminar este destinatario? Texto: Si lo eliminas, perderás sus datos. Botones: Eliminar · Cancelar',
    enCaos: ['Modal'],
    muestra: { titulo: '¿Quieres eliminar este destinatario?', texto: 'Si lo eliminas, perderás sus datos.', acciones: ['Eliminar', 'Cancelar'] },
  },
  { componente: 'Carga o progreso', formula: 'Qué está pasando, y cuánto falta si se sabe', ejemplo: 'Estamos cargando tus envíos.', enCaos: ['Spinner', 'ProgressBar'] },
  {
    componente: 'Notificación push',
    formula: 'Novedad + dato útil, sin relleno',
    ejemplo: 'Título: Novedad en tu envío. Cuerpo: Llegó a la oficina de destino. Ya puedes recogerlo.',
    enCaos: ['NotificationCard', 'NotificationItem'],
  },
  { componente: 'Asunto de correo', formula: 'Contenido concreto + dato clave', ejemplo: 'Tu envío está en camino', enCaos: [] },
  { componente: 'SMS', formula: 'Marca + un dato + una acción', ejemplo: 'Inter Rapidísimo: tu envío llega hoy. Código de entrega: 4821.', enCaos: [] },
  {
    componente: 'Onboarding',
    formula: 'Bienvenida + qué logrará la persona',
    ejemplo: 'Te damos la bienvenida a Inter Pay. Aquí manejas el dinero de tus envíos.',
    enCaos: ['EmptyState', 'Modal'],
  },
];

/* ------------------------------------------------------------------ Glosario */

export const glosarioIntro =
  'Cada término tiene una definición y un uso aprobado. La columna "Evitar" recoge palabras que se confunden con otro término o que el usuario no usa; es una propuesta inicial, pendiente de validar con producto y operaciones.';

export const terminosBaseIntro =
  'Hablamos de envío cuando nos referimos al servicio o a su gestión, de paquete cuando es el objeto físico y de guía cuando es el número de seguimiento.';

export interface Termino {
  concepto: string;
  definicion: string;
  ejemplo: string;
  evitar: string;
}

export const glosario: { grupo: string; intro?: string; terminos: Termino[] }[] = [
  {
    grupo: 'Términos base',
    intro: terminosBaseIntro,
    terminos: [
      { concepto: 'Envío', definicion: 'Servicio de transporte de un paquete desde el remitente hasta el destinatario.', ejemplo: 'Crear envío · Mis envíos', evitar: 'Pedido, orden' },
      { concepto: 'Paquete', definicion: 'Objeto físico que se transporta.', ejemplo: 'Peso del paquete', evitar: 'Bulto, encomienda' },
      { concepto: 'Guía', definicion: 'Número que identifica un envío y permite rastrearlo.', ejemplo: 'Rastrear guía', evitar: 'Código de envío, tracking' },
    ],
  },
  {
    grupo: 'Financiero',
    terminos: [
      {
        concepto: 'Bolsillo',
        definicion:
          'Servicio financiero de Inter Rapidísimo que permite a comerciantes y emprendedores recibir el pago de los envíos que realizan a través de nuestros servicios de mensajería.',
        ejemplo: 'Tu bolsillo en Inter Rapidísimo. Puedes mover tu dinero y ahorrar en cada envío.',
        evitar: 'Billetera, monedero',
      },
      {
        concepto: 'Código del bolsillo',
        definicion:
          'Identificador del bolsillo, usado para que los usuarios de Inter Pay puedan transferirse entre ellos. Puede ser el documento de identidad del titular (C.C., C.E., PA) o un número secuencial generado en el registro.',
        ejemplo: 'Puedes hacer tus transferencias usando el código del bolsillo de otro Inter Pay · Bolsillo: 1234567890',
        evitar: 'Número de cuenta, ID',
      },
      {
        concepto: 'Cuentas frecuentes',
        definicion: 'Cuenta guardada automáticamente en Inter Pay al finalizar una transferencia desde el bolsillo.',
        ejemplo: 'Al terminar la transferencia, los datos de esta cuenta se guardarán en tus cuentas frecuentes.',
        evitar: 'Favoritas, contactos',
      },
      {
        concepto: 'Movimientos / Mis movimientos',
        definicion: 'Transacciones realizadas en el bolsillo de Inter Pay: recargas, transferencias, Pago en Casa, pago de servicios, entre otros.',
        ejemplo: 'Mis movimientos · Últimos movimientos · Historial de movimientos · ¿Cómo quieres descargar tus movimientos?',
        evitar: 'Transacciones, operaciones',
      },
    ],
  },
  {
    grupo: 'Productos internos',
    terminos: [
      {
        concepto: 'Logística inversa',
        definicion: 'Gestión del retorno de paquetes desde el destinatario al remitente o al punto de origen, por devoluciones o cambios.',
        ejemplo: 'Logística inversa',
        evitar: 'Reversa, retornos',
      },
      {
        concepto: 'Telemercadeo',
        definicion: 'Contacto telefónico con el destinatario o el remitente para gestionar envíos no entregados.',
        ejemplo: 'Telemercadeo y almacenamiento',
        evitar: 'Call center',
      },
      {
        concepto: 'Almacenamiento',
        definicion: 'Depósito en bodega de paquetes que pasan a custodia o que el destinatario solicita almacenar.',
        ejemplo: 'Almacenamiento temporal · Telemercadeo y almacenamiento',
        evitar: 'Bodegaje',
      },
      {
        concepto: 'Auditoría de pesos',
        definicion: 'Funcionalidad para agencias, aliados operativos y PAMI que permite conocer el peso de un paquete según la guía generada.',
        ejemplo: 'Auditoría de pesos · Ya tienes un proceso de auditoría de pesos',
        evitar: 'Pesaje, revisión de peso',
      },
      {
        concepto: 'PAMI',
        definicion:
          'Punto de atención móvil independiente: vehículo de carga (camioneta tipo van o moto carguero) de un emprendedor afiliado.',
        ejemplo: 'Este es tu usuario y contraseña, y son personales. Si los olvidas, puedes comunicarte con tu PAMI.',
        evitar: 'La sigla sin explicar fuera del contexto operativo',
      },
      { concepto: 'Estiba', definicion: 'Espacio designado para paquetes de dimensiones grandes.', ejemplo: 'Tipo y número del lugar de almacenamiento', evitar: 'Pallet, tarima' },
      { concepto: 'Casillero', definicion: 'Espacio de almacenamiento para paquetes pequeños.', ejemplo: 'Tipo y número del lugar de almacenamiento', evitar: 'Locker, cubículo' },
    ],
  },
  {
    grupo: 'Productos externos',
    terminos: [
      {
        concepto: 'Preenvío',
        definicion: 'Envío creado por el cliente que Inter Rapidísimo aún no ha recogido.',
        ejemplo: 'Asociar preenvíos · Desasociar preenvíos · Crear preenvío masivo',
        evitar: 'Pedido, orden',
      },
      { concepto: 'Preguía', definicion: 'Número de identificación del preenvío.', ejemplo: 'N.º de preguía', evitar: 'Guía provisional' },
      { concepto: 'Flete', definicion: 'Valor del transporte.', ejemplo: '¿Quién paga el flete? · Costo del servicio:', evitar: 'Tarifa (se confunde con el costo del servicio)' },
      {
        concepto: 'Envío personalizado',
        definicion: 'Funcionalidad que permite al cliente personalizar el contenido del envío y elegir uno o varios destinatarios durante su creación.',
        ejemplo: 'Crear envío personalizado',
        evitar: 'Envío custom, envío especial',
      },
      {
        concepto: 'Envío masivo',
        definicion: 'Funcionalidad que permite al cliente cargar y administrar hasta 2.000 paquetes y enviarlos a varios destinatarios.',
        ejemplo: 'Crear envío masivo',
        evitar: 'Carga masiva, envío por lote',
      },
      {
        concepto: 'Sucursal',
        definicion: 'Lugar donde el cliente puede almacenar paquetes o productos para que Inter Rapidísimo recoja los envíos.',
        ejemplo: 'Mis sucursales · Seleccionar sucursal · Sucursal de origen · Direcciones y sucursales',
        evitar: 'Sede, local',
      },
      {
        concepto: 'Contacto',
        definicion: 'Datos de una persona a la que el cliente envía paquetes con frecuencia.',
        ejemplo: 'Mis contactos · Contacto · Contacto creado.',
        evitar: 'Cliente frecuente, favorito',
      },
      {
        concepto: 'Destinatario',
        definicion: 'Persona a la que se le envía el paquete.',
        ejemplo: 'Destinatarios · Crear destinatario · Uno o varios destinatarios · Puedes filtrar el destinatario por ciudad y elegir el tipo de entrega',
        evitar: 'Receptor, consignatario',
      },
      { concepto: 'Remitente', definicion: 'Persona que envía el paquete.', ejemplo: 'Soy remitente · Devuelto a remitente', evitar: 'Emisor, consignador' },
      {
        concepto: 'Recogida',
        definicion: 'Acción que hace Inter Rapidísimo para recoger los paquetes.',
        ejemplo: 'Solicitar recogida · Puedes programar la recogida de tus envíos o encontrar una oficina cercana',
        evitar: 'Recolección, pickup',
      },
      {
        concepto: 'Oficina / Punto',
        definicion: 'Punto físico de Inter Rapidísimo que funciona bajo el modelo de franquicia y es administrado por un tercero.',
        ejemplo: 'Reclamo en oficina · Llevar a una oficina · El punto Inter Rapidísimo más cercano donde puedes llevar tu paquete',
        evitar: 'Sucursal (es otro concepto)',
      },
    ],
  },
];

/* ------------------------------------------------------------------ Anexo */

export const anexo = {
  intro: 'Marco teórico que respalda las decisiones de esta guía. Sirve para entender el porqué; para escribir en el día a día bastan las otras pestañas.',
  heuristicasIntro:
    'Principios de diseño y usabilidad aplicados al proceso de redacción para mejorar la interacción del usuario con el contenido. Derivan de investigaciones en usabilidad, en buena parte de Jakob Nielsen y Don Norman, adaptadas al contenido digital.',
  objetivos: [
    { titulo: 'Claridad', texto: 'Que el contenido sea fácil de entender, con la menor carga cognitiva posible.' },
    { titulo: 'Consistencia', texto: 'Un tono y un estilo coherentes en toda la experiencia.' },
    { titulo: 'Usabilidad', texto: 'Navegación y uso eficiente de la interfaz gracias a un lenguaje claro y directo.' },
    { titulo: 'Accesibilidad', texto: 'Contenido comprensible para todas las personas, sin importar sus capacidades.' },
  ],
  cuandoUsar: [
    'Definir la estructura y el flujo del contenido.',
    'Seleccionar el tono y el estilo.',
    'Revisar la claridad del mensaje.',
    'Identificar y corregir errores de usabilidad.',
    'Comparar la efectividad de distintas versiones del contenido.',
    'Interpretar la retroalimentación de las pruebas.',
    'Refinar el contenido con base en datos.',
    'Mantener el contenido alineado con las buenas prácticas de UX.',
  ],
  heuristicas: [
    { titulo: 'Visibilidad del estado del sistema', texto: 'Mantener informada a la persona sobre lo que pasa en la interfaz. Ej.: una barra de progreso con microcopy que indica el avance de una carga.' },
    { titulo: 'Correspondencia con el mundo real', texto: 'Lenguaje familiar para las personas, sin jerga técnica que confunda.' },
    { titulo: 'Control y libertad del usuario', texto: 'Permitir corregir errores con facilidad. Ej.: un botón "Deshacer" que revierte la última acción.' },
    { titulo: 'Consistencia y estándares', texto: 'Los mismos términos y el mismo estilo en toda la interfaz. Ej.: si se usa "perfil" para la cuenta, no alternar con "cuenta" o "usuario".' },
    { titulo: 'Prevención de errores', texto: 'Contenido que minimiza la posibilidad de equivocarse. Ej.: una advertencia antes de una acción irreversible, como eliminar una cuenta.' },
    { titulo: 'Reconocer es mejor que recordar', texto: 'Opciones y acciones visibles; terminología consistente y familiar en lugar de términos nuevos que haya que aprender.' },
    { titulo: 'Flexibilidad y eficiencia de uso', texto: 'Que tanto quien empieza como quien tiene experiencia use la interfaz con eficiencia. Ej.: accesos directos para usuarios frecuentes.' },
    { titulo: 'Diseño estético y minimalista', texto: 'Sin exceso de información ni elementos que distraigan del objetivo principal.' },
    { titulo: 'Ayuda y documentación', texto: 'Ayuda accesible para tareas complejas. Ej.: un centro de ayuda con artículos y tutoriales.' },
    { titulo: 'Diagnóstico, reconocimiento y recuperación de errores', texto: 'Mensajes de error claros que proponen una solución, incluso cuando no es inmediata.' },
  ],
  contenidos: [
    { titulo: 'Funcionales', texto: 'Ayudan al usuario a cumplir su objetivo de manera correcta.' },
    { titulo: 'Comprensibles', texto: 'Simples y entendibles, sin tecnicismos ni términos ajenos al usuario. Traer palabras de su propia jerga genera cercanía.' },
    { titulo: 'Usables', texto: 'Guían de forma efectiva, ayudan a entender la funcionalidad y eliminan procesos tediosos.' },
    { titulo: 'Disfrutables', texto: 'Generan un vínculo positivo con el usuario.' },
    { titulo: 'Motivantes', texto: 'Incentivan a seguir usando la plataforma.' },
  ],
};

/* ------------------------------------------------------------------ Revisión de componentes nuevos */

/**
 * Revisión de textos para cada componente nuevo del sistema (y para sus historias y docs).
 * Se aplica antes de cerrar el componente; cada punto remite a la sección de esta página.
 */
export const revisionComponente: { punto: string; regla: string }[] = [
  { punto: 'Botones y enlaces', regla: 'Infinitivo, de una a tres palabras, en positivo y nombrando la acción (Crear envío, no OK ni Haz clic aquí). Validación: Entendido.' },
  { punto: 'Etiquetas', regla: 'Nombre común y funcional del glosario, mayúscula solo inicial, sin punto final, máximo 30 caracteres.' },
  { punto: 'Placeholders', regla: 'Un ejemplo real en el formato esperado (Laura Gómez, 310 123 4567); nunca instrucciones ni la etiqueta repetida.' },
  { punto: 'Ayuda y errores', regla: 'Error junto al campo: qué se necesita, sin culpar, máximo 120 caracteres. El estado se dice con palabras, no solo con color.' },
  { punto: 'Titulares y descripciones', regla: 'Titular directo (máximo 40); la descripción aporta y no repite el titular (máximo 100).' },
  { punto: 'Persona y trato', regla: 'Tú (nunca usted ni vos), primera persona del plural para la marca, voz activa, lenguaje neutro en género.' },
  { punto: 'Tono', regla: 'Según el momento (mapa de tonos): sin exclamaciones ni emojis en errores, dinero, retrasos ni temas legales.' },
  { punto: 'Mecánica', regla: '$12.340, 15%, 26 de octubre o 26/10/2026, 5:00 p.m., celular 310 123 4567, signos de apertura.' },
  { punto: 'Textos para lectores de pantalla', regla: 'aria-label, label sr-only y alt describen la función o la información, en el mismo tono (Cerrar, Envío en camino).' },
  { punto: 'Textos de ejemplo en historias', regla: 'Siguen la misma guía; usan los patrones por componente como base.' },
];
