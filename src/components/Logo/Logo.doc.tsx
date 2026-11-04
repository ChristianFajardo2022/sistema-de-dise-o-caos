import { Fragment } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { ComponentDocContent, DocStateItem } from '../../docs/types';
import { Logo } from './Logo';
import type { LogoSize } from './Logo.types';

/*
 * Contenido de la página de documentación de Logo (plantilla v2, `.qa/docs/plantilla-v2.md`). Manda el código
 * (`Logo.types.ts`, `Logo.variants.ts`, `Logo.data.ts`), luego `Logo.docs.json`. Medidas del set de Figma: logo
 * lg 158 × 56, md 131 × 48, sm 101 × 32, xs 87 × 24; icon 56, 48, 32 y 24 (cuadrados). Padding del logo: lg y md 8 en
 * los cuatro lados; sm 4 × 8; xs 2 × 8. El logo no cambia entre Desktop, Tablet y Mobile.
 * Sin diferencias entre Figma y código: Type es `type` (logo, icon) y Size es `size` (xs, sm, md, lg).
 */

// Figma: 12946:2771 (component set Logo)

const logo = (props: Partial<ComponentProps<typeof Logo>> = {}): ReactNode => <Logo {...props} />;

/** Logo e ícono del mismo tamaño, una muestra por tipo. */
const pair = (size: LogoSize): ReactNode[] => [logo({ size }), logo({ type: 'icon', size })];

/** Logo y símbolo juntos, para las vistas de breakpoints. */
const row = (): ReactNode => (
  <div className="flex items-center gap-ds-space-general-2xl">
    {[logo({ size: 'md' }), logo({ type: 'icon', size: 'md' })].map((s, i) => (
      <Fragment key={i}>{s}</Fragment>
    ))}
  </div>
);

/** Espacio angosto: el logo completo se recorta, el símbolo cabe. */
const narrow = (props: Partial<ComponentProps<typeof Logo>>): ReactNode => (
  <div className="box-content w-16 overflow-hidden border border-ds-border-field-default">{logo(props)}</div>
);

const states: DocStateItem[] = [
  { label: 'xs', tone: 'neutral', description: <>Alto de 24 px. El logo mide 87 px de ancho y el ícono 24 px.</>, samples: pair('xs') },
  { label: 'sm', tone: 'neutral', description: <>Alto de 32 px. El logo mide 101 px de ancho y el ícono 32 px.</>, samples: pair('sm') },
  { label: 'md', tone: 'neutral', description: <>Alto de 48 px. El logo mide 131 px de ancho y el ícono 48 px.</>, samples: pair('md') },
  { label: 'lg', tone: 'neutral', description: <>Alto de 56 px, el valor por defecto. El logo mide 158 px de ancho y el ícono 56 px.</>, samples: pair('lg') },
];

export const doc: ComponentDocContent = {
  name: 'Logo',
  icon: 'gallery',
  classification: 'atomo',
  summary:
    'El Logo es el átomo que dibuja el logo completo, con símbolo y nombre, o solo el símbolo, en cuatro tamaños de 24 a 56 px de alto. No es interactivo y toma el color del tema.',
  definition: [
    {
      title: 'Anatomía',
      description: 'Un svg con el dibujo vectorial dentro y un padding que depende del tamaño.',
      blocks: [
        {
          type: 'anatomy',
          groups: [
            {
              canvases: [
                {
                  label: 'Logo completo',
                  preview: logo({ size: 'lg' }),
                  marks: [
                    { n: 1, selector: 'svg', side: 'left' },
                    { n: 2, selector: 'svg path', index: 0, side: 'top' },
                    { n: 3, selector: 'svg path', index: -1, side: 'bottom' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'svg' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> svg de 158 × 56 px en lg, con padding de 8 px (<code>space/general/lg</code>) en los cuatro lados. Es <code>inline-block</code> y no se encoge dentro de una fila flex.
                </>,
                <>
                  <strong>Símbolo:</strong> cuatro trazados rellenos con <code>currentColor</code> a la izquierda del dibujo.
                </>,
                <>
                  <strong>Nombre:</strong> quince trazados con las letras, a la derecha del símbolo. El svg completo tiene <code>role=&quot;img&quot;</code> y un nombre accesible.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Solo el símbolo',
                  preview: logo({ type: 'icon', size: 'lg' }),
                  marks: [
                    { n: 1, selector: 'svg', side: 'left' },
                    { n: 2, selector: 'svg path', index: 0, side: 'top' },
                  ],
                  dimensions: [{ kind: 'height', selector: 'svg' }],
                },
              ],
              guidelines: [
                <>
                  <strong>Contenedor:</strong> svg cuadrado de 56 × 56 px en lg, sin padding: el dibujo ya queda centrado.
                </>,
                <>
                  <strong>Símbolo:</strong> los mismos cuatro trazados del logo completo, a mayor escala.
                </>,
              ],
            },
            {
              canvases: [
                {
                  label: 'Tamaños del logo',
                  preview: (
                    <>
                      {logo({ size: 'xs' })}
                      {logo({ size: 'sm' })}
                      {logo({ size: 'md' })}
                      {logo({ size: 'lg' })}
                    </>
                  ),
                  marks: [
                    { n: 1, selector: 'svg', index: 0, side: 'top' },
                    { n: 2, selector: 'svg', index: 1, side: 'top' },
                    { n: 3, selector: 'svg', index: 2, side: 'top' },
                    { n: 4, selector: 'svg', index: 3, side: 'top' },
                  ],
                  dimensions: [
                    { kind: 'height', selector: 'svg', index: 0 },
                    { kind: 'height', selector: 'svg', index: 3 },
                  ],
                },
              ],
              guidelines: [
                <>
                  <strong>xs:</strong> 87 × 24 px, con padding de 2 px vertical (<code>space/general/sm</code>) y 8 px horizontal.
                </>,
                <>
                  <strong>sm:</strong> 101 × 32 px, con padding de 4 px vertical (<code>space/general/md</code>) y 8 px horizontal.
                </>,
                <>
                  <strong>md:</strong> 131 × 48 px, con padding de 8 px en los cuatro lados.
                </>,
                <>
                  <strong>lg:</strong> 158 × 56 px, el tamaño por defecto, con el mismo padding de 8 px. El ícono mide 24, 32, 48 y 56 px de lado.
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
          Logo tiene 8 variantes de aspecto: 2 tipos (<code>type</code>) por 4 tamaños (<code>size</code>). No es interactivo: no tiene hover, focus ni press y no recibe foco.
        </>
      ),
      blocks: [{ type: 'states', items: states }],
    },
    {
      title: 'Tokens y modos',
      description: 'Tokens del logo y del ícono, que usan el mismo color. Cambia el modo para ver su valor.',
      titleInside: true,
      blocks: [
        {
          type: 'tokens',
          groups: [
            { title: 'Logo', preview: logo(), entries: [{ part: 'Dibujo', color: 'background-logo-default' }] },
            { title: 'Icon', preview: logo({ type: 'icon' }), entries: [{ part: 'Símbolo', color: 'background-logo-default' }] },
          ],
        },
      ],
    },
    {
      title: 'Uso del componente Logo en Figma:',
      description: '',
      titleInside: true,
      blocks: [
        {
          type: 'figma',
          bullets: [
            <>
              <strong>Búsqueda y configuración:</strong> encuentra el componente como Logo en la librería de Assets. Sus propiedades son Type y Size.
            </>,
            <>
              <strong>Type:</strong> Logo es el dibujo completo (<code>type=&quot;logo&quot;</code>) e Icon, solo el símbolo (<code>type=&quot;icon&quot;</code>).
            </>,
            <>
              <strong>Size:</strong> xs, sm, md o lg, con el mismo nombre en <code>size</code>. Fija el ancho y el alto del svg, padding incluido.
            </>,
            <>
              <strong>Color y accesibilidad:</strong> en Figma el relleno usa la variable <code>background/logo/default</code>. El código añade <code>title</code> y <code>decorative</code>, que Figma no tiene.
            </>,
          ],
        },
      ],
    },
  ],
  application: [
    {
      title: 'Comportamiento',
      description: 'Cuándo el Logo es la pieza correcta y cuándo conviene otra.',
      blocks: [
        {
          type: 'usage',
          use: [
            <>
              <strong>Identificar la marca:</strong> es una imagen con <code>role=&quot;img&quot;</code> y un nombre accesible, que puedes cambiar con <code>title</code>.
            </>,
            <>
              <strong>Logo junto a su nombre escrito:</strong> con <code>decorative</code> se oculta a los lectores de pantalla y no repite el nombre.
            </>,
            <>
              <strong>Poco ancho disponible:</strong> usa <code>type=&quot;icon&quot;</code>, que mide lo mismo de ancho que de alto.
            </>,
            <>
              <strong>Cambio de tema:</strong> el color sigue al tema solo, porque el dibujo usa <code>currentColor</code> con el token <code>background-logo-default</code>.
            </>,
          ],
          avoid: [
            <>
              <strong>Acciones con el logo:</strong> el svg no recibe foco ni clic. (Alternativa: envuelve el logo en <code>ButtonLink</code> y pon el nombre en <code>title</code>).
            </>,
            <>
              <strong>Otros colores:</strong> recolorear el logo con clases rompe su contraste con el tema. (Alternativa: deja el token por defecto).
            </>,
            <>
              <strong>Tamaños intermedios:</strong> <code>size</code> solo admite xs, sm, md y lg. (Alternativa: el valor más cercano).
            </>,
            <>
              <strong>Ilustrar un símbolo cualquiera:</strong> el dibujo es solo el del logo. (Alternativa: <code>Icon</code> para íconos de interfaz).
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
                title: 'Logo e ícono',
                bullets: [
                  <>
                    <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
                  </>,
                  <>
                    <strong>Medida fija:</strong> el alto va de 24 a 56 px y el ancho del logo de 87 a 158 px, según <code>size</code>.
                  </>,
                ],
                preview: row(),
              },
            ],
          },
          mobile: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> no se ajusta al ancho del contenedor y no se encoge en una fila flex.
              </>,
              <>
                <strong>Espacio angosto:</strong> si el logo no cabe, cambia a <code>type=&quot;icon&quot;</code> o baja <code>size</code>; el código no lo hace solo.
              </>,
            ],
            preview: row(),
          },
          tablet: {
            bullets: [
              <>
                <strong>Sin cambios:</strong> mide lo mismo en Desktop, Tablet y Mobile.
              </>,
              <>
                <strong>Medida fija:</strong> no se ajusta al ancho del contenedor y no se encoge en una fila flex.
              </>,
              <>
                <strong>Padding:</strong> usa <code>space/general/*</code>, que vale lo mismo en los tres breakpoints.
              </>,
            ],
            preview: row(),
          },
        },
      ],
    },
    {
      title: 'Do and Dont’s',
      description: 'Reglas de nombre accesible, ancho disponible y color.',
      blocks: [
        {
          type: 'practices',
          items: [
            {
              kind: 'do',
              framed: true,
              title: 'Logo con nombre',
              description: (
                <>
                  Deja el nombre accesible cuando el logo va solo, sin texto al lado.
                </>
              ),
              preview: logo({ type: 'icon', size: 'md', title: 'Inicio' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Logo solo y decorativo',
              description: (
                <>
                  No pongas <code>decorative</code> si el logo va solo: el lector de pantalla lo ignora.
                </>
              ),
              preview: logo({ type: 'icon', size: 'md', decorative: true }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Símbolo en espacio angosto',
              description: (
                <>
                  Usa <code>type=&quot;icon&quot;</code> cuando no cabe el logo completo.
                </>
              ),
              preview: narrow({ type: 'icon', size: 'md' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Logo recortado',
              description: 'No metas el logo completo en un espacio angosto: se recorta.',
              preview: narrow({ size: 'md' }),
            },
            {
              kind: 'do',
              framed: true,
              title: 'Color del tema',
              description: 'Deja el color por defecto: cambia con el tema.',
              preview: logo({ size: 'md' }),
            },
            {
              kind: 'dont',
              framed: true,
              title: 'Logo recoloreado',
              description: 'No cambies el color del logo con otra clase.',
              preview: logo({ size: 'md', className: 'text-ds-icon-semantic-error-firts' }),
            },
          ],
        },
      ],
    },
  ],
};
