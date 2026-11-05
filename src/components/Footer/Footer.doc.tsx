import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Footer } from './Footer';
import type { FooterSection, FooterSocialLink } from './Footer.types';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Logo } from '../Logo';

/*
 * Contenido de la página de documentación de Footer (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Footer.types.ts`, `Footer.variants.ts`, `Footer.tsx`), luego `Footer.docs.json`. Diferencias con Figma: Figma trae un
 * marco Desktop y uno Mobile por variante (se alternan con modos); el código es un solo DOM que sigue el ancho del propio
 * `<footer>` (container query, composición de escritorio desde 64rem) y no tiene marco Tablet. Figma no dibuja el foco ni
 * los nombres accesibles. Las muestras van a su ancho de diseño (1440, 768 o 376) porque el footer mide su propio ancho,
 * no el de la ventana.
 */

// Figma: 13408:32915 (component set Footer)

type FooterProps = Partial<ComponentProps<typeof Footer>>;

const social: FooterSocialLink[] = [
  { name: 'Facebook', href: '#', icon: <Icon name="facebook-circle" size={24} className="text-ds-icon-general-default" /> },
  { name: 'Instagram', href: '#', icon: <Icon name="instagram-line" size={24} className="text-ds-icon-general-default" /> },
];

const contact: FooterSection = {
  title: 'Contacto',
  items: [
    { label: 'Teléfono:', value: '000 000 0000', href: '#' },
    { label: 'Horario de atención:', value: 'Lunes a viernes, 9:00 am a 5:00 pm' },
    { label: 'Correo electrónico:', value: 'ayuda@ejemplo.com', href: '#' },
  ],
};

const link = (label: string) => ({ label, href: '#' });
const legal: FooterSection = { title: 'Legal', items: ['Términos y condiciones', 'Política de privacidad', 'Política de cookies'].map(link) };
const columns: FooterSection[] = [
  { title: 'Ayuda', items: ['Preguntas frecuentes', 'Guías de uso', 'Soporte', 'Estado del servicio', 'Novedades', 'Comunidad', 'Glosario'].map(link) },
  { title: 'Legal', items: ['Términos y condiciones', 'Política de privacidad', 'Política de cookies'].map(link) },
  { title: 'Recursos', items: ['Documentación', 'Descargas', 'Informe anual'].map(link) },
  { title: 'Contacto', items: [{ value: '000 000 0000' }, { label: 'Dirección:', value: 'Avenida Principal 123, Ciudad' }] },
];

/** Sellos de ejemplo: cuadros con borde, sin marca real. */
const badges = () =>
  [57, 136, 85].map((w, i) => (
    <span
      key={i}
      role="img"
      aria-label={`Sello ${i + 1}`}
      style={{ width: w }}
      className="flex h-8 items-center justify-center rounded-sm border border-current text-[10px] text-ds-icon-general-default"
    >
      {`Sello ${i + 1}`}
    </span>
  ));

/**
 * Footer de muestra. `id` da un nombre distinto al `nav` de cada muestra (axe `landmark-unique`); los grupos son h3 para
 * no sumar h2 a los de la página.
 */
const footer = (id: string, props: FooterProps = {}) => (
  <Footer headingLevel={3} navLabel={`Enlaces del pie de página (${id})`} copyright="Copyright © 2026" {...props} />
);

/** Type=Portals completo: marca, acerca de, redes, contacto, legal y acción. */
const portals = (id: string, props: FooterProps = {}) =>
  footer(id, {
    type: 'portals',
    logo: <Logo type="logo" size="lg" decorative />,
    aboutTitle: 'Acerca de',
    about: 'Texto de ejemplo que presenta el sitio y su propósito.',
    contact,
    sections: [legal],
    social,
    action: <Button variant="secondary" size="sm">Ayuda</Button>,
    mobileAction: <Button variant="primary" size="md">Ayuda</Button>,
    legal: 'Todos los derechos reservados',
    ...props,
  });

/** Type=Web completo: columnas de enlaces, sellos, acción y barra inferior con marca compacta y redes. */
const web = (id: string, props: FooterProps = {}) =>
  footer(id, {
    type: 'web',
    logo: <Logo type="icon" size="sm" decorative />,
    sections: columns,
    social,
    badges: badges(),
    action: <Button variant="secondary" size="sm">Ayuda</Button>,
    mobileAction: <Button variant="primary" size="md">Ayuda</Button>,
    ...props,
  });

/** Footer pequeño para los Do / Don't: Web sin marca, redes ni sellos, con los grupos como columnas apiladas. */
const mini = (id: string, props: FooterProps = {}) => (
  // El footer es un contenedor de tamaño en línea: sin un ancho del padre colapsa a 0 dentro del marco.
  <div className="w-full">
    {footer(id, {
      type: 'web',
      mobileAccordion: false,
      sections: [{ title: 'Ayuda', items: ['Preguntas frecuentes', 'Soporte'].map(link) }],
      ...props,
    })}
  </div>
);

/** Muestra a un ancho de diseño: el footer mide el suyo, así que se dibuja a 1440, 768 o 376 y la plantilla lo reduce. */
const at = (width: number, node: ReactNode) => <div style={{ width }}>{node}</div>;

const states: DocStateItem[] = [
  {
    label: 'Portals',
    tone: 'neutral',
    description: 'Type por defecto. Marca, acerca de y redes a la izquierda, grupos de contacto y legal, y acción. La barra inferior lleva el copyright y la nota legal.',
    samples: [at(1440, portals('estado portals'))],
  },
  {
    label: 'Web',
    tone: 'neutral',
    description: 'Columnas de enlaces con sellos abajo a la derecha. La barra inferior lleva la marca compacta, el copyright y las redes.',
    samples: [at(1440, web('estado web'))],
  },
  {
    label: 'Móvil con acordeón',
    tone: 'neutral',
    description: 'Por debajo de 64rem de ancho del footer, los grupos pasan a un Accordion, la acción usa un Button primary md a todo el ancho y los sellos bajan a su fila.',
    samples: [at(376, web('estado móvil'))],
  },
  {
    label: 'Móvil sin acordeón',
    tone: 'neutral',
    description: (
      <>
        Con <code>mobileAccordion={'{false}'}</code> los grupos quedan como columnas apiladas, con sus enlaces a la vista.
      </>
    ),
    samples: [at(376, web('estado apilado', { mobileAccordion: false }))],
  },
];

export const doc: ComponentDocContent = {
  name: 'Footer',
  icon: 'row-vertical',
  classification: 'composicion',
  summary:
    'El Footer es la composición que cierra cada página: reúne marca, texto de presentación, grupos de enlaces, redes, una acción y la barra inferior con el copyright. Combina Logo, Button, Accordion e Icon, y cambia de composición según su ancho.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Una superficie en columna con un contenedor de columnas y, debajo, la barra inferior. Portals y Web reparten marca, grupos y redes de forma distinta; en móvil los grupos pasan a un acordeón.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Portals (1440)',
                  width: 1440,
                  preview: portals('anatomía portals'),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Desktop"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Logo "]', index: 0, side: 'top' },
                    { n: 3, selector: '[data-figma-part="Social"]', side: 'bottom' },
                    { n: 4, selector: 'nav > div', index: 0, side: 'top' },
                    { n: 5, selector: '[data-figma-part="Button"]', side: 'top' },
                    { n: 6, selector: '[data-figma-part="Desktop"] > div:last-child', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Desktop"]', side: 'left' },
                    { kind: 'padding', selector: '[data-figma-part="Desktop"]', side: 'top' },
                    { kind: 'gap', from: '[data-figma-part="Container"]', to: '[data-figma-part="Desktop"] > div:last-child', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Marco:</strong> <code>background/container/surface</code>, padding vertical de 32 (<code>space/container/on-canva</code>) y lateral de 56 (<code>space/general/6xl</code>), con 24 entre el contenedor y la barra inferior (<code>space/general/3xl</code>).
                </>,
                <>
                  <strong>Marca y acerca de:</strong> columna de 300 de ancho con el Logo (<code>logo</code>), el título y el texto (<code>aboutTitle</code> y <code>about</code>), separados por 24 (<code>space/general/3xl</code>; 20 con ventana móvil). Sin <code>about</code> el bloque no se dibuja.
                </>,
                <>
                  <strong>Redes:</strong> fila de íconos de 24 con 16 de separación (<code>space/general/2xl</code>). Cada enlace exige <code>name</code>, su nombre accesible.
                </>,
                <>
                  <strong>Grupo:</strong> columna con título semibold de 16/20 y filas de 14/18 separadas por 8 (<code>space/general/lg</code>). El contacto (<code>contact</code>) va antes de <code>sections</code>.
                </>,
                <>
                  <strong>Acción:</strong> un Button secondary sm (<code>action</code>), al final de las columnas.
                </>,
                <>
                  <strong>Barra inferior:</strong> trazo superior de 0,5 (<code>border/general/default-on-card</code>) y padding superior de 24. Lleva el copyright a la izquierda y la nota legal a la derecha (<code>copyright</code> y <code>legal</code>).
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Web (1440)',
                  width: 1440,
                  preview: web('anatomía web'),
                  marks: [
                    { n: 1, selector: 'nav > div', index: 0, side: 'top' },
                    { n: 2, selector: '[data-figma-part="Logos gov"]', side: 'right' },
                    { n: 3, selector: '[data-figma-part="Button"]', side: 'top' },
                    { n: 4, selector: '[data-figma-part="Logo "]', index: 0, side: 'left' },
                    { n: 5, selector: '[data-figma-part="Social"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Logo "]', to: '[data-figma-part="Desktop"] > div:last-child p' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Columnas:</strong> cada grupo ocupa el mismo ancho (<code>flex-1</code>) con 16 de separación (<code>space/general/2xl</code>). Cada fila lleva una viñeta de 8 y el texto o enlace a su lado, separados por 8.
                </>,
                <>
                  <strong>Sellos:</strong> el slot <code>badges</code> se coloca abajo a la derecha de las columnas, con 32 entre sellos. El espacio lo da la columna más alta.
                </>,
                <>
                  <strong>Acción:</strong> el mismo Button secondary sm, a la derecha de las columnas.
                </>,
                <>
                  <strong>Marca compacta:</strong> Logo de ícono sm (32), junto al copyright con 16 de separación (<code>space/general/lg</code>).
                </>,
                <>
                  <strong>Redes:</strong> a la derecha de la barra inferior, en vez de bajo la marca.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Móvil (376)',
                  width: 376,
                  preview: web('anatomía móvil'),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Desktop"]', side: 'left' },
                    { n: 2, selector: '[data-accordion-root]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Button"]', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Logos gov"]', side: 'left' },
                    { n: 5, selector: '[data-figma-part="Desktop"] > div:last-child', side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Desktop"]', side: 'left' },
                    { kind: 'gap', from: '[data-accordion-root]', to: '[data-figma-part="Button"]', axis: 'y' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Marco:</strong> padding por los cuatro lados (<code>space/container/on-canva</code>) y separación entre contenedor y barra inferior (<code>space/general/4xl</code>). Son tokens responsive: 20 y 24 con ventana móvil, 24 y 32 en tablet, 32 y 32 en escritorio. La cota muestra los de la ventana actual.
                </>,
                <>
                  <strong>Acordeón:</strong> un Accordion de selección única con un ítem por grupo, sin ícono. El título es el botón y la lista queda a todo el ancho.
                </>,
                <>
                  <strong>Acción:</strong> <code>mobileAction</code>, un Button primary md a todo el ancho. Sin él se usa <code>action</code>.
                </>,
                <>
                  <strong>Sellos:</strong> bajan a su propia fila, centrados y con ajuste de línea.
                </>,
                <>
                  <strong>Barra inferior:</strong> en columna y centrada: marca y copyright en Web; copyright y nota legal en Portals.
                </>,
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Estados',
      description: (
        <>
          Footer tiene 4 variantes de aspecto. No es interactivo como conjunto y no tiene prop <code>state</code>: cambia por <code>type</code> y por el ancho del footer. Sus enlaces se subrayan al pasar el puntero y dibujan un contorno de 2 px con el foco del teclado.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del estado Default de Portals y Web. Cambia el modo para ver su valor en claro y en oscuro.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Superficie y grupos',
              preview: at(1440, portals('tokens superficie')),
              entries: [
                { part: 'Fondo', color: 'background-container-surface' },
                { part: 'Texto', color: 'text-neutral-white', text: 'primitives-typography-size-md' },
                { part: 'Título de grupo', color: 'text-neutral-white', text: 'primitives-typography-size-lg' },
                { part: 'Viñeta', color: 'background-general-gray-fifth' },
                { part: 'Contorno de foco (aparece en Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Barra inferior y redes',
              preview: at(1440, web('tokens barra')),
              entries: [
                { part: 'Divisor', color: 'border-general-default-on-card' },
                { part: 'Copyright', color: 'text-neutral-white', text: 'primitives-typography-size-md' },
                { part: 'Ícono de redes', color: 'icon-general-default' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Footer en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Footer en la librería de Assets. Tiene las propiedades Type, Acerca de nosotros y Text. En código es <code>Footer</code>; Acerca de nosotros y Text equivalen a <code>aboutTitle</code> y <code>about</code>.
            </>,
            <>
              <strong>Type:</strong> Portals es <code>type=&quot;portals&quot;</code> (el valor por defecto) y Web es <code>type=&quot;web&quot;</code>. Los sellos son el slot <code>badges</code> y los botones, <code>action</code> y <code>mobileAction</code>.
            </>,
            <>
              <strong>Marcos Desktop y Mobile:</strong> cada Type trae los dos, que se alternan con los modos de responsive. En código es un solo componente que sigue el ancho de su propio footer: composición de escritorio desde 64rem, móvil por debajo. Figma no tiene marco Tablet.
            </>,
            <>
              <strong>Lo que Figma no tiene:</strong> el foco con teclado, los nombres accesibles de las redes y del <code>nav</code> (<code>navLabel</code>), el nivel de los títulos (<code>headingLevel</code>) y la opción de dejar los grupos apilados en móvil (<code>mobileAccordion</code>).
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Footer es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Cierre de cada página:</strong> reúne lo que se busca al llegar al final: enlaces legales, contacto y redes. Es un <code>&lt;footer&gt;</code>, así que los lectores de pantalla lo anuncian como información del sitio.
            </>,
            <>
              <strong>Enlaces agrupados por tema:</strong> cada grupo de <code>sections</code> lleva su título y su lista. Todos van dentro de un solo <code>nav</code> con nombre (<code>navLabel</code>).
            </>,
            <>
              <strong>Datos de contacto:</strong> una fila con rótulo y valor (<code>label</code> y <code>value</code>); con <code>href</code> el valor es el enlace (<code>tel:</code> o <code>mailto:</code>).
            </>,
            <>
              <strong>Una acción de apoyo:</strong> <code>action</code> admite un botón, como Ayuda. En móvil se usa <code>mobileAction</code> a todo el ancho.
            </>,
            <>
              <strong>Pantallas angostas:</strong> por debajo de 64rem de ancho del footer, los grupos se pliegan en un acordeón con teclado y <code>aria-expanded</code>. Con <code>mobileAccordion={'{false}'}</code> quedan apilados.
            </>,
          ],
          avoid: [
            <>
              <strong>Navegación principal:</strong> el pie no debe ser el único camino a las secciones del sitio. (Alternativa: <code>Header</code> o <code>NavBar</code>).
            </>,
            <>
              <strong>Avisos que hay que leer antes de actuar:</strong> el pie queda al final y se pasa por alto. (Alternativa: <code>Alert</code>).
            </>,
            <>
              <strong>Acciones de un diálogo o panel:</strong> el Footer cierra la página, no una superficie flotante. (Alternativa: <code>Modal</code>).
            </>,
            <>
              <strong>Redes sin nombre:</strong> el ícono no tiene texto y <code>name</code> es obligatorio en cada enlace.
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet no usa los mismos tokens que Desktop: a 768 el footer sigue en la composición móvil, con padding de 24 y separación de 32.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Portals',
                bullets: [
                  <>
                    <strong>Composición de escritorio:</strong> desde 64rem de ancho del footer. Marco con padding de 32 arriba y abajo y de 56 a los lados.
                  </>,
                  <>
                    <strong>Columnas en fila:</strong> la marca mide 300 y los grupos ocupan lo que necesitan, repartidos con <code>space-between</code>.
                  </>,
                ],
                preview: at(1440, portals('desktop portals')),
              },
              {
                title: 'Web',
                bullets: [
                  <>
                    <strong>Columnas iguales:</strong> cada grupo ocupa el mismo ancho, con 16 de separación y la acción al final.
                  </>,
                  <>
                    <strong>Sellos y redes:</strong> los sellos van abajo a la derecha de las columnas; las redes, en la barra inferior.
                  </>,
                ],
                preview: at(1440, web('desktop web')),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Composición móvil:</strong> por debajo de 64rem de ancho del footer. Padding de 20 por los cuatro lados y 24 entre contenedor y barra inferior.
              </>,
              <>
                <strong>Acordeón y acción:</strong> los grupos se pliegan en un Accordion y la acción pasa a <code>mobileAction</code>, a todo el ancho.
              </>,
              <>
                <strong>Barra inferior en columna:</strong> el copyright, la nota legal y las redes se centran. Los sellos bajan a su propia fila.
              </>,
            ],
            preview: at(376, web('mobile')),
          },
          tablet: {
            bullets: [
              <>
                <strong>Como Mobile:</strong> 768 de ancho sigue por debajo de 64rem, así que usa la composición móvil con acordeón. Figma no tiene marco Tablet.
              </>,
              <>
                <strong>Espacios de Tablet:</strong> el padding sube a 24 por los cuatro lados y la separación entre contenedor y barra inferior, a 32.
              </>,
              <>
                <strong>Sellos en fila:</strong> con más ancho disponible, los sellos se reparten en una sola línea centrada.
              </>,
            ],
            preview: at(768, web('tablet')),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de títulos, acciones y texto de los enlaces.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Título por tema',
              description: 'Titula cada grupo con su tema: Ayuda, Legal o Contacto.',
              preview: mini('do títulos'),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Título genérico',
              description: 'No uses títulos genéricos como Enlaces: no dicen qué hay dentro.',
              preview: mini('dont títulos', { sections: [{ title: 'Enlaces', items: ['Preguntas frecuentes', 'Soporte'].map(link) }] }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Una sola acción',
              description: 'Deja una sola acción en el pie, la que más se busca.',
              preview: mini('do acción', { action: <Button variant="secondary" size="sm">Ayuda</Button>, mobileAction: <Button variant="primary" size="md">Ayuda</Button> }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Varias acciones',
              description: 'No pongas varias acciones juntas: compiten con los enlaces.',
              preview: mini('dont acción', {
                action: (
                  <>
                    <Button variant="secondary" size="sm">Ayuda</Button>
                    <Button variant="secondary" size="sm">Contacto</Button>
                  </>
                ),
                mobileAction: (
                  <>
                    <Button variant="primary" size="md">Ayuda</Button>
                    <Button variant="secondary" size="md">Contacto</Button>
                  </>
                ),
              }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Enlace descriptivo',
              description: 'Escribe enlaces que nombren su destino: Política de privacidad.',
              preview: mini('do enlaces', { sections: [{ title: 'Legal', items: ['Política de privacidad', 'Términos y condiciones'].map(link) }] }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Enlace genérico',
              description: 'No uses enlaces como Ver más o Aquí: fuera de contexto no dicen nada.',
              preview: mini('dont enlaces', { sections: [{ title: 'Legal', items: ['Ver más', 'Aquí'].map(link) }] }),
            },
          ],
        },
      ],
    },
  ],
};
