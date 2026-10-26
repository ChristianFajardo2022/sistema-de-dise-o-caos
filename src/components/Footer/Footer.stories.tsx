import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { Footer } from './Footer';
import type { FooterSection, FooterSocialLink } from './Footer.types';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Logo } from '../Logo';

const SOCIAL: FooterSocialLink[] = [
  { name: 'Facebook', href: '#facebook', icon: <Icon name="facebook-circle" size={24} className="text-ds-icon-general-white" /> },
  { name: 'Instagram', href: '#instagram', icon: <Icon name="instagram-line" size={24} className="text-ds-icon-general-white" /> },
];

const CONTACT: FooterSection = {
  title: 'Contacto',
  items: [
    { label: 'Línea de atención al cliente:', value: '000 000 0000', href: 'tel:0000000000' },
    { label: 'Línea secundaria:', value: '000 000 0000', href: 'tel:0000000000' },
    { label: 'Horarios de atención:', value: (<>Lunes a viernes 9:00 am a 5:00 pm.<br />Sábados 10:00 am a 2:00 pm y domingos 11:00 am a 1:00 pm.</>) },
    { label: 'Horarios de atención chat:', value: 'Lunes a viernes 9:00 am a 4:30 pm. Sábados 9:00 am a 1:00 pm' },
    { label: 'Correo electrónico:', value: 'contacto@ejemplo.com', href: 'mailto:contacto@ejemplo.com' },
  ],
};

const LEGAL: FooterSection = {
  title: 'Legal',
  items: [
    { label: 'Política de seguridad y salud', href: '#a' },
    { label: 'Políticas de privacidad', href: '#b' },
    { label: 'Política de navegación', href: '#c' },
    { label: 'Política de seguridad', href: '#d' },
  ],
};

const link = (label: string) => ({ label, href: '#' });
const WEB_SECTIONS: FooterSection[] = [
  {
    title: 'Políticas y normas:',
    items: [
      link('Aviso de privacidad y protección de la información'),
      link('Código de conducta'),
      link('Informe anual'),
      link('Línea de ayuda'),
      link('Manual de gestión'),
      link('Manual de cumplimiento'),
      link('Misión y visión'),
      link('Política de gestión integral de riesgos'),
      link('Políticas de cumplimiento'),
    ],
  },
  { title: 'Legal y contratos:', items: ['Contrato de servicio', 'Contrato marco', 'Condiciones de uso', 'Tablas documentales'].map(link) },
  { title: 'Regulación:', items: ['Documento de ejemplo uno', 'Documento de ejemplo dos', 'Indicadores', 'Recomendaciones de uso'].map(link) },
  { title: 'Otros documentos:', items: ['Documento de ejemplo tres', 'Documento de ejemplo cuatro', 'Política de seguridad', 'Términos y condiciones del portal'].map(link) },
  {
    title: 'Líneas de atención:',
    items: [
      { value: '000 000 0000' },
      { label: 'Oficina principal:', value: 'Avenida Principal 123, Ciudad' },
    ],
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
          className={`flex items-center justify-center rounded-sm border border-current text-[10px] text-ds-icon-general-white ${mobile ? 'h-6' : 'h-8'}`}
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
  'Lorem ipsum dolor sit amet consectetur. Cursus aliquet mattis id urna. Diam hendrerit vitae amet sed morbi. Eget pulvinar eu blandit commodo eget tincidunt. Non tincidunt montes tincidunt feugiat elit varius.';

const meta = {
  title: 'Navigation/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    type: { type: { name: 'enum', value: ['portals', 'web'] }, control: 'inline-radio', options: ['portals', 'web'] },
    headingLevel: { type: { name: 'enum', value: [2, 3, 4, 5, 6] }, control: 'select', options: [2, 3, 4, 5, 6] },
    mobileAccordion: { type: { name: 'boolean' }, control: 'boolean' },
    navLabel: { control: 'text' },
    socialLabel: { control: 'text' },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Type=Portals: marca, acerca de, redes, contacto, legal y acción. En móvil los grupos pasan a un acordeón. */
export const Interactive: Story = {
  args: {
    type: 'portals',
    logo: <Logo type="logo" size="lg" />,
    aboutTitle: 'Acerca de nosotros:',
    about: 'Somos una empresa de ejemplo. Este texto sirve para ver cómo se comporta el bloque "acerca de" con varias líneas.',
    contact: CONTACT,
    sections: [LEGAL],
    social: SOCIAL,
    action: ACTION,
    mobileAction: MOBILE_ACTION,
    copyright: 'Copyright © 2026 - Interrapidisimo.com',
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
    copyright: 'Copyright © 2026 - Interrapidisimo.com - Todos los derechos reservados',
  },
};

/** Sin acordeón en móvil: los grupos quedan como columnas apiladas. */
export const SinAcordeonMovil: Story = {
  args: { ...Web.args, mobileAccordion: false },
};

/** Cada variante de Figma una vez (a 1440). El logo, el nombre de la marca y el copyright son los reales; el resto de los textos (contacto, enlaces, sellos) sigue genérico. */
export const FigmaMatrix: Story = {
  // Dos footers en la misma página (una variante cada uno): el landmark contentinfo y el nav se repiten solo aquí
  parameters: { a11y: { config: { rules: [{ id: 'landmark-no-duplicate-contentinfo', enabled: false }, { id: 'landmark-unique', enabled: false }] } } },
  render: () => (
    <div className="flex w-[1440px] flex-col gap-5 bg-white">
      <Footer
        data-figma="Type=Portals"
        type="portals"
        logo={<Logo type="logo" size="lg" />}
        aboutTitle="Acerca de nosotros:"
        about={ABOUT}
        contact={CONTACT}
        sections={[LEGAL]}
        social={SOCIAL}
        action={ACTION}
        copyright="Copyright © 2026 - Interrapidisimo.com"
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
        copyright="Copyright © 2026 - Interrapidisimo.com - Todos los derechos reservados"
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
    await expect(within(nav).getByRole('link', { name: 'Políticas de privacidad' })).toHaveAttribute('href', '#b');
    await expect(canvas.getByRole('link', { name: 'Facebook' })).toHaveAttribute('href', '#facebook');
    await expect(canvas.getAllByRole('link', { name: /000 000 0000/ })).toHaveLength(2);
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
