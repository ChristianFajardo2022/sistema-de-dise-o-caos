import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Footer } from './Footer';
import type { FooterProps, FooterSection, FooterSocialLink } from './Footer.types';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Logo } from '../Logo';
import { ComponentDoc } from '../../docs/ComponentDoc';
import { argTypesFromDocsJson, codeFromDocsJson } from '../../docs/code';
import { componentDocsParameters } from '../../docs/storybook';
import { doc } from './Footer.doc';
import docsJson from './Footer.docs.json';

const SOCIAL: FooterSocialLink[] = [
  { name: 'Facebook', href: '#facebook', icon: <Icon name="facebook-circle" size={24} className="text-ds-icon-general-default" /> },
  { name: 'Instagram', href: '#instagram', icon: <Icon name="instagram-line" size={24} className="text-ds-icon-general-default" /> },
];

const CONTACT: FooterSection = {
  title: 'Contacto',
  items: [
    { label: 'Teléfono:', value: '000 000 0000', href: 'tel:0000000000' },
    { label: 'Horario de atención:', value: (<>Lunes a viernes, 9:00 am a 5:00 pm.<br />Sábados, 10:00 am a 2:00 pm.</>) },
    { label: 'Horario del chat:', value: 'Lunes a viernes, 9:00 am a 4:30 pm' },
    { label: 'Correo electrónico:', value: 'ayuda@ejemplo.com', href: 'mailto:ayuda@ejemplo.com' },
  ],
};

const LEGAL: FooterSection = {
  title: 'Legal',
  items: [
    { label: 'Términos y condiciones', href: '#a' },
    { label: 'Política de privacidad', href: '#b' },
    { label: 'Política de cookies', href: '#c' },
    { label: 'Aviso legal', href: '#d' },
  ],
};

const link = (label: string) => ({ label, href: '#' });
const WEB_SECTIONS: FooterSection[] = [
  { title: 'Ayuda', items: ['Preguntas frecuentes', 'Guías de uso', 'Soporte', 'Estado del servicio'].map(link) },
  { title: 'Legal', items: ['Términos y condiciones', 'Política de privacidad', 'Política de cookies', 'Aviso legal'].map(link) },
  { title: 'Recursos', items: ['Documentación', 'Novedades', 'Descargas', 'Comunidad'].map(link) },
  { title: 'Documentos', items: ['Informe anual', 'Código de conducta', 'Manual de uso', 'Glosario'].map(link) },
  {
    title: 'Contacto',
    items: [{ value: '000 000 0000' }, { label: 'Dirección:', value: 'Avenida Principal 123, Ciudad' }],
  },
];

/** Cuadros genéricos con las medidas de los sellos de Figma. */
function Badges({ widths, mobile = false }: { widths: number[]; mobile?: boolean }) {
  return (
    <>
      {widths.map((w, i) => (
        <span
          key={i}
          role="img"
          aria-label={`Sello ${i + 1}`}
          style={{ width: mobile ? Math.round(w * 0.75) : w }}
          className={`flex items-center justify-center rounded-sm border border-current text-[10px] text-ds-icon-general-default ${mobile ? 'h-6' : 'h-8'}`}
        >
          {w > 40 ? `Sello ${i + 1}` : ''}
        </span>
      ))}
    </>
  );
}

const WIDTHS = [57, 184, 136, 23, 22, 85];

const ACTION = (
  <Button variant="secondary" size="sm">
    Ayuda
  </Button>
);
const MOBILE_ACTION = <Button variant="primary" size="md">Ayuda</Button>;

const ABOUT =
  'Texto de ejemplo que presenta el sitio y su propósito. Sirve para ver cómo se comporta el bloque con varias líneas.';

const meta = {
  title: 'Navigation/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: componentDocsParameters(doc, docsJson),
    docsLive: {
      story: 'Interactive',
      // El Footer decide su composición por su propio ancho: la columna de la grilla va de 0 a 1440 (el lienzo no la reduce con
      // `zoom`) y le da el ancho disponible. Los títulos de grupo van en h3 para no sumar h2 a los de la página
      render: (a: Record<string, unknown>) => (
        <div className="grid w-full" style={{ gridTemplateColumns: 'minmax(0, 1440px)' }}>
          <Footer {...(a as FooterProps)} headingLevel={3} />
        </div>
      ),
      exclude: ['headingLevel'],
    },
  },
  tags: ['autodocs'],
  argTypes: argTypesFromDocsJson(docsJson, {
    type: { type: { name: 'enum', value: ['portals', 'web'] }, control: 'inline-radio', options: ['portals', 'web'] },
    headingLevel: { type: { name: 'enum', value: [2, 3, 4, 5, 6] }, control: 'select', options: [2, 3, 4, 5, 6] },
    mobileAccordion: { type: { name: 'boolean' }, control: 'boolean' },
    navLabel: { control: 'text' },
    socialLabel: { control: 'text' },
  }),
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Type=Portals: marca, acerca de, redes, contacto, legal y acción. En móvil los grupos pasan a un acordeón. */
export const Interactive: Story = {
  args: {
    type: 'portals',
    logo: <Logo type="logo" size="lg" />,
    aboutTitle: 'Acerca de',
    about: 'Texto de ejemplo que presenta el sitio y su propósito. Sirve para ver cómo se comporta el bloque con varias líneas.',
    contact: CONTACT,
    sections: [LEGAL],
    social: SOCIAL,
    action: ACTION,
    mobileAction: MOBILE_ACTION,
    copyright: 'Copyright © 2026',
    legal: 'Todos los derechos reservados',
  },
};

/** Type=Web: cinco columnas de enlaces, sellos abajo a la derecha y barra inferior con marca compacta y redes. */
export const Web: Story = {
  args: {
    type: 'web',
    logo: <Logo type="icon" size="sm" />,
    sections: WEB_SECTIONS,
    social: SOCIAL,
    badges: <Badges widths={WIDTHS} />,
    action: ACTION,
    mobileAction: MOBILE_ACTION,
    copyright: 'Copyright © 2026 - Todos los derechos reservados',
  },
};

/** Sin acordeón en móvil: los grupos quedan como columnas apiladas. */
export const SinAcordeonMovil: Story = {
  args: { ...Web.args, mobileAccordion: false },
};

/** Cada variante de Figma una vez (a 1440). Los textos de contacto, enlaces y sellos son de ejemplo. */
export const FigmaMatrix: Story = {
  // Dos footers en la misma página (una variante cada uno): el landmark contentinfo y el nav se repiten solo aquí
  parameters: { a11y: { config: { rules: [{ id: 'landmark-no-duplicate-contentinfo', enabled: false }, { id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className="flex w-full max-w-[1440px] flex-col gap-5 bg-white">
      <Footer
        data-figma="Type=Portals"
        type="portals"
        logo={<Logo type="logo" size="lg" />}
        aboutTitle="Acerca de"
        about={ABOUT}
        contact={CONTACT}
        sections={[LEGAL]}
        social={SOCIAL}
        action={ACTION}
        copyright="Copyright © 2026"
        legal="Todos los derechos reservados"
      />
      <Footer
        data-figma="Type=Web"
        type="web"
        logo={<Logo type="icon" size="sm" />}
        sections={WEB_SECTIONS}
        social={SOCIAL}
        badges={<Badges widths={WIDTHS} />}
        action={ACTION}
        copyright="Copyright © 2026 - Todos los derechos reservados"
      />
    </div>
  ),
};

/** Test: landmark contentinfo, nav con nombre, encabezados por grupo y enlaces con nombre accesible */
export const AccessibilityTest: Story = {
  tags: ['!autodocs'],
  args: Interactive.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('contentinfo')).toBeVisible();
    const nav = canvas.getByRole('navigation', { name: 'Enlaces del pie de página' });
    await expect(within(nav).getByRole('heading', { name: 'Legal' })).toBeVisible();
    await expect(within(nav).getByRole('link', { name: 'Política de privacidad' })).toHaveAttribute('href', '#b');
    await expect(canvas.getByRole('link', { name: 'Facebook' })).toHaveAttribute('href', '#facebook');
    await expect(canvas.getAllByRole('link', { name: /000 000 0000/ })).toHaveLength(1);
    await expect(canvas.getByRole('button', { name: 'Ayuda' })).toBeVisible();
  },
};

/** Test: Web con sellos con nombre y sin la columna de marca */
export const WebTest: Story = {
  tags: ['!autodocs'],
  args: Web.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('heading', { level: 2 })).toHaveLength(5);
    await expect(canvas.getByRole('img', { name: 'Sello 1' })).toBeVisible();
    await expect(canvas.getByRole('list', { name: 'Redes sociales' })).toBeVisible();
  },
};

/** Test: los grupos no son landmarks `region` y la etiqueta de las redes se puede cambiar */
export const LandmarksTest: Story = {
  tags: ['!autodocs'],
  args: { ...Web.args, socialLabel: 'Síguenos' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryAllByRole('region')).toHaveLength(0);
    await expect(canvas.getAllByRole('heading', { level: 2 })).toHaveLength(5);
    await expect(canvas.getByRole('list', { name: 'Síguenos' })).toBeVisible();
    await expect(canvas.queryByRole('list', { name: 'Redes sociales' })).toBeNull();
  },
};

/** Página de documentación (plantilla v2): la revisan vitest y axe. */
export const DocPageTest: Story = {
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <ComponentDoc doc={doc} code={codeFromDocsJson(docsJson)} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1, name: 'Footer' })).toBeInTheDocument();
    const tabs = canvas.getAllByRole('tab');
    await expect(tabs.map((t) => t.textContent)).toEqual(['Definición', 'Aplicación', 'Desarrollo']);
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    const h2 = () => canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(h2()).toEqual(['Anatomía', 'Estados', 'Tokens y modos', 'Uso del componente Footer en Figma:']);
    await userEvent.click(tabs[1]);
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await expect(h2()).toEqual(['Comportamiento', 'Aplicaciones de breakpoints', 'Do and Dont’s']);
    tabs[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    const props = canvas.getByRole('table', { name: 'Props de Footer' });
    await expect(within(props).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Prop', 'Tipo', 'Por defecto', 'Descripción']);
  },
};
