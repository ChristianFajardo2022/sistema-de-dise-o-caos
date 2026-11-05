import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ProductCard } from './ProductCard';
import productPhoto from './assets/producto.jpg';

/*
 * Contenido de la página de documentación de ProductCard (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`ProductCard.types.ts`, `ProductCard.variants.ts`, `ProductCard.tsx`), luego `ProductCard.docs.json`. Medidas: proporción
 * 337 / 413, radio de 24 px, muesca de 48 px con Button corner md de 40, bloque de texto con padding 40/16/16/16 en Desktop
 * y Tablet (32 arriba en Mobile) y separación de 24 px hacia las acciones (20 en Mobile). Diferencias con Figma: Figma
 * dibuja el velo con un degradado sin variable y el código usa uno opaco bajo el texto (G11 plegada, G12 expandida) para
 * llegar a 4,5:1; Figma tiene un frame Mobile con las acciones apiladas a ancho completo y el código mantiene una fila;
 * Figma no dibuja el foco, que el código añade en toda la tarjeta cuando lleva `href`; en Hover y «+» Figma separa
 * los bloques con 16 px y el código mantiene 24 (20 en Mobile).
 */

// Figma: 15863:66763 (component set Card producto)

type CardProps = Partial<ComponentProps<typeof ProductCard>>;

const TITLE = 'Audífonos inalámbricos';
const DESCRIPTION = 'Cancelación de ruido activa, 30 horas de batería y carga rápida por USB-C.';

/** Anillo de foco de la tarjeta con enlace: las mismas clases que el enlace estirado aplica con `:focus-visible`. */
const FOCUS_RING = '[&_a]:after:outline-2 [&_a]:after:outline-offset-2 [&_a]:after:outline-solid [&_a]:after:outline-ds-border-field-active';

/** Acción secundaria de Figma: Button secondary sm solo ícono con el ícono `edit`. */
const editAction = (title = TITLE) => (
  <Button variant="secondary" size="sm" iconOnly aria-label={`Personalizar ${title}`}>
    <Icon name="edit" size={20} />
  </Button>
);

/** Ancho de muestra: sin él la tarjeta ocupa todo el ancho del lienzo. La plantilla reduce lo que no cabe. */
const sized = (node: ReactNode, width = 337) => (
  <div style={{ width }} className="max-w-full">
    {node}
  </div>
);

/** Tarjeta de ejemplo. */
const card = (props: CardProps = {}, width?: number) =>
  sized(
    <ProductCard title={TITLE} description={DESCRIPTION} price="$129.999" rating={4.5} ratingCount={128} src={productPhoto} {...props} />,
    width
  );

/** Tarjeta expandida con su acción secundaria (Hover de Figma). */
const expanded = (props: CardProps = {}, width?: number) => card({ state: 'hover', action: editAction(props.title ?? TITLE), ...props }, width);

const states: DocStateItem[] = [
  {
    label: 'Default',
    tone: 'neutral',
    description:
      'Reposo. Sobre el velo solo se ven el título, el precio y la calificación. La descripción y las acciones siguen en el árbol de accesibilidad y entran con el foco.',
    samples: [card({ state: 'default' })],
  },
  {
    label: 'Hover',
    tone: 'accent',
    description: (
      <>
        Al pasar el puntero, al recibir el foco dentro o en pantallas táctiles. La tarjeta se expande: aparecen la descripción, <code>action</code> y
        «Agregar al carrito», y el velo pasa a un tono más oscuro.
      </>
    ),
    samples: [expanded()],
  },
  {
    label: 'Focus',
    tone: 'accent',
    description:
      'Al llegar al enlace con el teclado, la tarjeta se expande y un anillo de 2 px la rodea, a 2 px del borde. Figma no lo dibuja. La muestra usa las clases del componente porque el foco real no se puede dejar fijo.',
    samples: [expanded({ href: '#producto', className: FOCUS_RING })],
  },
  {
    label: '+',
    tone: 'accent',
    description: (
      <>
        Producto agregado (<code>quantity</code> mayor que 0). El selector de cantidad reemplaza a «Agregar al carrito» y a la acción secundaria, y la tarjeta
        queda expandida. El trazo del selector (<code>border-field-disabled</code>) tiene el mismo color que el velo y no se distingue.
      </>
    ),
    samples: [card({ defaultQuantity: 2 })],
  },
];

export const doc: ComponentDocContent = {
  name: 'ProductCard',
  icon: 'shopping-cart',
  classification: 'composicion',
  summary:
    'ProductCard es la composición para mostrar un producto con su foto, nombre, precio y calificación, y agregarlo o marcarlo como favorito sin salir de la lista. Une Button, Button corner, NumberPicker y NumberRating, y se expande con el puntero o el foco.',
  definition: [
    {
      title: 'Anatomía',
      description:
        'Una foto recortada por una silueta con muesca, un bloque de texto sobre un velo oscuro y un favorito en la muesca. Al expandirse suma la descripción y las acciones; con el producto agregado, el selector de cantidad.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Plegada',
                  preview: card({ state: 'default' }),
                  marks: [
                    { n: 1, selector: 'article', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Subtract"]', side: 'top' },
                    { n: 3, selector: '[data-figma-part="Button corner "]', side: 'right' },
                    { n: 4, selector: '[data-figma-part="Filename"]', index: 0, side: 'left' },
                    { n: 5, selector: '[data-figma-part="Filename"]', index: 1, side: 'bottom' },
                    { n: 6, selector: '[data-figma-part="Number rating"]', side: 'right' },
                  ],
                  dimensions: [
                    { kind: 'padding', selector: '[data-figma-part="Text"]', side: 'left' },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> <code>article</code> del ancho disponible, con proporción 337 / 413 y radio de 24 px (<code>radius-general-2xl</code>) que recorta la foto y
                  el velo.
                </>,
                <>
                  <strong>Foto:</strong> <code>src</code>, a toda la silueta con <code>object-fit: cover</code> y sin trazo. <code>alt</code> va vacío por defecto: el título ya nombra el
                  producto.
                </>,
                <>
                  <strong>Favorito:</strong> <code>ButtonCorner</code> md de 40 px en la muesca de 48 px, con <code>aria-pressed</code>. <code>favorite</code> o <code>defaultFavorite</code>
                  lo marcan y <code>favoriteLabel</code> es su nombre accesible.
                </>,
                <>
                  <strong>Título:</strong> <code>title</code>, en tipografía secundaria semibold (<code>typography-heading-size-xs</code>), que el componente recorta a una línea. Es un encabezado de nivel 3
                  que <code>headingLevel</code> cambia.
                </>,
                <>
                  <strong>Precio:</strong> <code>price</code> ya formateado, en tipografía secundaria semibold (<code>typography-heading-size-md</code>). Los lectores de pantalla lo anuncian
                  como «Precio: …».
                </>,
                <>
                  <strong>Calificación:</strong> <code>NumberRating</code> con <code>rating</code> de 0 a 5. <code>ratingCount</code> suma «N reseñas» junto a la calificación y se anuncia con ella. Sin <code>rating</code> no se dibuja.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Expandida',
                  preview: expanded(),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Text"]', side: 'left' },
                    { n: 2, selector: '[data-figma-part="Status"]', side: 'right' },
                    { n: 3, selector: '[data-figma-part="Desktop"] > button', index: 0, side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Desktop"] > button', index: 1, side: 'bottom' },
                  ],
                  dimensions: [
                    { kind: 'gap', from: '[data-figma-part="Desktop"] > button', fromIndex: 0, to: '[data-figma-part="Desktop"] > button', toIndex: 1 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>Bloque de texto:</strong> velo oscuro opaco desde donde empieza el texto, con padding de 40 px arriba y 16 px a los lados y abajo. Usa siempre los tokens del modo
                  oscuro y no cambia con el tema.
                </>,
                <>
                  <strong>Descripción:</strong> <code>description</code>, en tipografía primaria regular (<code>typography-body-size-md</code>) y <code>text-neutral-gray</code>. Solo se ve con la
                  tarjeta expandida.
                </>,
                <>
                  <strong>Agregar al carrito:</strong> <code>Button</code> primary sm, de ancho flexible. <code>addToCartText</code> cambia su texto y el nombre accesible es «texto: título»
                  (<code>addToCartLabel</code> lo reemplaza).
                </>,
                <>
                  <strong>Acción secundaria:</strong> <code>action</code>, un <code>Button</code> secondary sm solo ícono con su propio nombre accesible, a 8 px del botón principal. Con el producto
                  agregado no se muestra.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Con cantidad',
                  preview: card({ defaultQuantity: 2 }),
                  marks: [
                    { n: 1, selector: '[data-figma-part="Number picker input"]', side: 'right' },
                    { n: 2, selector: '[data-figma-part="Number picker input"] button', index: 0, side: 'bottom' },
                    { n: 3, selector: '[data-figma-part="Number picker input"] input', side: 'bottom' },
                    { n: 4, selector: '[data-figma-part="Number picker input"] button', index: -1, side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'height', selector: '[data-figma-part="Number picker input"] > div' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Selector de cantidad:</strong> <code>NumberPicker</code> sm de ancho completo. Aparece con <code>quantity</code> mayor que 0; <code>maxQuantity</code> fija el máximo y
                  <code>quantityLabel</code> es su nombre accesible.
                </>,
                <>
                  <strong>Quitar:</strong> resta una unidad. Con la última, la tarjeta vuelve a «Agregar al carrito» y el foco pasa a ese botón.
                </>,
                <>
                  <strong>Cantidad:</strong> campo numérico que se edita con el teclado; las flechas suman y restan una unidad.
                </>,
                <>
                  <strong>Agregar:</strong> suma una unidad hasta <code>maxQuantity</code>.
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
          ProductCard tiene 4 estados. Default, Hover y «+» son del set de Figma; Focus lo añade el código. Hover se fuerza con <code>state</code> solo para documentar y «+» sale de{' '}
          <code>quantity</code>. Focus se dibuja con las clases del componente. Press no tiene aspecto propio: lo tienen sus botones.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description:
        'Tokens de la tarjeta en reposo y los que suma al expandirse. El bloque de texto queda siempre en modo oscuro; el favorito cambia con el modo.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            {
              title: 'Velo y textos',
              preview: card({ state: 'default' }),
              entries: [
                { part: 'Velo plegado', color: 'primitives-color-primary-g11', mode: 'dark' },
                { part: 'Título', color: 'text-neutral-white-unicolor', text: 'typography-heading-size-xs', mode: 'dark' },
                { part: 'Precio', color: 'text-neutral-white-unicolor', text: 'typography-heading-size-md', mode: 'dark' },
                { part: 'Estrella de la calificación', color: 'icon-semantic-alert-firts', mode: 'dark' },
              ],
            },
            {
              title: 'Favorito',
              preview: card({ state: 'default', defaultFavorite: true }),
              entries: [
                { part: 'Fondo', color: 'background-container-default-on-card' },
                { part: 'Ícono', color: 'icon-general-default' },
                { part: 'Fondo (marcado)', color: 'background-container-select-on-card' },
                { part: 'Trazo (marcado)', color: 'border-general-select-on-card' },
              ],
            },
            {
              title: 'Expandida',
              preview: expanded(),
              entries: [
                { part: 'Velo expandido', color: 'primitives-color-primary-g12', mode: 'dark' },
                { part: 'Descripción', color: 'text-neutral-gray', text: 'typography-body-size-md', mode: 'dark' },
                { part: 'Botón principal', color: 'background-button-primary-default', mode: 'dark' },
                { part: 'Texto del botón', color: 'text-button-primary-default', text: 'typography-button-size-md-uniform', mode: 'dark' },
                { part: 'Anillo (Focus)', color: 'border-field-active' },
              ],
            },
            {
              title: 'Con cantidad',
              preview: card({ defaultQuantity: 2 }),
              entries: [
                { part: 'Trazo del selector', color: 'border-field-disabled', mode: 'dark' },
                { part: 'Trazo (foco dentro)', color: 'border-field-active', mode: 'dark' },
                { part: 'Cantidad', color: 'text-field-label', text: 'typography-field-size-sm', mode: 'dark' },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente ProductCard en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el set «Card producto» en la librería de Assets. Su única propiedad es State, con Default, Hover y «+».
            </>,
            <>
              <strong>State:</strong> Default y Hover son <code>state=&quot;default&quot;</code> y <code>state=&quot;hover&quot;</code>; en el código Hover sale de <code>:hover</code>, del foco dentro y de las
              pantallas táctiles. «+» es el producto agregado: se activa con <code>quantity</code> mayor que 0, no con <code>state</code>.
            </>,
            <>
              <strong>Capas:</strong> Filename es <code>title</code> (en el bloque del precio, <code>price</code>), Status es <code>description</code> y Number rating es <code>rating</code>. Button es «Agregar al
              carrito», el Button secondary solo ícono es <code>action</code>, Button corner es el favorito y Number picker input es el selector de cantidad.
            </>,
            <>
              <strong>Diferencias:</strong> Figma dibuja la foto como relleno de la silueta Subtract; el código la recibe en <code>src</code>. Figma tiene un frame Desktop y otro Mobile con las acciones
              (en Mobile, apiladas a ancho completo); el código mantiene una fila en todos los breakpoints. Figma no dibuja el foco.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo ProductCard es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Producto en una lista:</strong> muestra foto, nombre, precio y calificación en una cuadrícula o un carrusel, con la descripción y las acciones al expandirse.
            </>,
            <>
              <strong>Agregar sin salir de la lista:</strong> <code>quantity</code> y <code>onQuantityChange</code> controlan la cantidad. El botón pasa al selector y, con 0, vuelve.
            </>,
            <>
              <strong>Tarjeta que lleva a la ficha:</strong> con <code>href</code>, el título es un enlace que cubre la tarjeta y los controles quedan encima, sin anidarse.
            </>,
            <>
              <strong>Favorito:</strong> el botón es un toggle con <code>aria-pressed</code>. <code>favorite</code> y <code>onFavoriteChange</code> lo controlan.
            </>,
            <>
              <strong>Descripción opcional:</strong> aparece con el puntero, el foco o el toque. No pongas ahí lo que la persona necesita para decidir.
            </>,
          ],
          avoid: [
            <>
              <strong>Elegir una opción entre varias:</strong> ProductCard no se marca como una opción. (Alternativa: <code>InteractiveCard</code>).
            </>,
            <>
              <strong>Destacar un contenido:</strong> una noticia o una guía con foto no lleva precio ni cantidad. (Alternativa: <code>FeatureCard</code>).
            </>,
            <>
              <strong>Mostrar un dato:</strong> una cifra con su etiqueta no necesita foto. (Alternativa: <code>DataCard</code>).
            </>,
            <>
              <strong>Mostrar un archivo o una persona:</strong> tienen sus propias tarjetas. (Alternativas: <code>FileCard</code>, <code>ProfileCard</code> y <code>ContactCard</code>).
            </>,
          ],
        },
      ],
    },
    {
      title: 'Aplicaciones de breakpoints',
      description: 'Cada vista se dibuja con los valores responsive de su breakpoint. Tablet usa los mismos tokens que Desktop.',
      blocks: [
        {
          type: 'breakpoints',
          desktop: {
            columns: [
              {
                title: 'Plegada',
                bullets: [
                  <>Ocupa el ancho del contenedor, con proporción 337 / 413 y radio de 24 px.</>,
                  <>El bloque de texto tiene padding de 40 px arriba y 16 px a los lados y abajo.</>,
                ],
                preview: card({ state: 'default' }),
              },
              {
                title: 'Expandida',
                bullets: [
                  <>Separa los textos de las acciones con 24 px (<code>space-general-3xl</code>).</>,
                  <>El botón principal mide 48 px de alto.</>,
                ],
                preview: expanded(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>El padding superior del bloque de texto baja de 40 a 32 px; los laterales y el inferior siguen en 16 px.</>,
              <>La separación entre textos y acciones baja de 24 a 20 px y el botón principal, de 48 a 40 px de alto.</>,
              <>En pantallas táctiles la tarjeta se muestra expandida, sin depender del puntero.</>,
            ],
            preview: expanded(),
          },
          tablet: {
            bullets: [
              <>Padding superior de 40 px, igual que en Desktop.</>,
              <>Separación de 24 px entre textos y acciones, igual que en Desktop.</>,
              <>El botón principal mide 48 px de alto y la tarjeta ocupa el ancho del contenedor.</>,
            ],
            preview: expanded(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas para que la tarjeta se lea de un vistazo y se pueda usar con teclado.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Nombre corto',
              description: 'Nombra el producto con pocas palabras.',
              preview: card({ state: 'default' }, 310),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Nombre largo',
              description: 'No escribas la ficha completa: el componente recorta el título a una línea y pierde el resto.',
              preview: card({ state: 'default', title: 'Audífonos inalámbricos de diadema con cancelación de ruido activa y estuche rígido' }, 310),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Descripción breve',
              description: 'Resume el producto en una frase.',
              preview: expanded({}, 310),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Descripción larga',
              description: 'No pongas un párrafo: empuja el resto y tapa la foto.',
              preview: expanded(
                {
                  description:
                    'Audífonos de diadema con cancelación de ruido activa, modo ambiente, 30 horas de batería continua, carga rápida por USB-C, conexión con dos dispositivos a la vez y estuche rígido de viaje.',
                },
                310
              ),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Precio con formato',
              description: 'Pasa el precio ya formateado, con su símbolo.',
              preview: card({ state: 'default', price: '$89.900' }, 310),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Precio sin formato',
              description: 'No pases el número suelto: se lee como una cifra sin sentido.',
              preview: card({ state: 'default', price: '89900' }, 310),
            },
          ],
        },
      ],
    },
  ],
};
