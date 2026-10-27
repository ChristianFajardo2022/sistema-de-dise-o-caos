import { useRef } from 'react';
import type { NotificationTabStripProps } from './NotificationPanel.types';
import { notificationTabStripVariants } from './NotificationPanel.variants';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Tab, TabList } from '../Tabs';
import { cn } from '../../utils/cn';
import { REDUCED_MOTION_QUERY, matchesMedia } from '../../utils/useMediaQuery';

/**
 * Fila de pestañas del panel complejo: la lista de pestañas (`TabList`) con, opcionalmente, un botón de desplazamiento a
 * cada lado (props "Left chevron tab" y "Right chevron tab" de Figma). Va dentro de un `Tabs`, que fija Size y Contrast.
 * Las pestañas de solo ícono (sin `label`) necesitan `aria-label`.
 */
export function NotificationTabStrip({
  tabs,
  'aria-label': ariaLabel = 'Categorías de notificaciones',
  scrollButtons = false,
  scrollLabels = { previous: 'Pestañas anteriores', next: 'Pestañas siguientes' },
  className,
}: NotificationTabStripProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: -1 | 1) => {
    const el = listRef.current;
    if (!el) return;
    const reduce = matchesMedia(REDUCED_MOTION_QUERY);
    el.scrollBy({ left: direction * el.clientWidth * 0.6, behavior: reduce ? 'auto' : 'smooth' });
  };

  const chevron = (direction: -1 | 1) => (
    <Button
      iconOnly
      variant="tertiary"
      size="xs"
      aria-label={direction < 0 ? scrollLabels.previous : scrollLabels.next}
      aria-hidden="true"
      tabIndex={-1}
      data-figma-part="Button"
      onClick={() => scroll(direction)}
    >
      <Icon name={direction < 0 ? 'chevron-left' : 'chevron-right'} size={20} variant="fill" data-figma-part="Icon-sizes" />
    </Button>
  );

  return (
    <div data-figma-part="Content" className={cn(notificationTabStripVariants(), className)}>
      {scrollButtons && chevron(-1)}
      <TabList ref={listRef} aria-label={ariaLabel} className={scrollButtons ? 'min-w-0 flex-1' : undefined}>
        {tabs.map(({ value, label, icon, badge, badgeLabel, 'aria-label': tabLabel }) =>
          label !== undefined && label !== null && label !== false ? (
            <Tab key={value} value={value} icon={icon} badge={badge} badgeLabel={badgeLabel} aria-label={tabLabel}>
              {label}
            </Tab>
          ) : (
            <Tab key={value} value={value} icon={icon ?? 'heart'} badge={badge} badgeLabel={badgeLabel} aria-label={tabLabel ?? value} />
          )
        )}
      </TabList>
      {scrollButtons && chevron(1)}
    </div>
  );
}
