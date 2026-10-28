import { forwardRef } from 'react';
import type {
  TableActionsProps,
  TableBadgeTextProps,
  TableHighlightedTextProps,
  TableProfileProps,
  TableTextProps,
} from './Table.types';
import {
  tableActionsClass,
  tableDescriptionClass,
  tableHighlightClass,
  tableProfileNameClass,
  tableTextBlockClass,
  tableTextTitleClass,
} from './Table.variants';
import { Badge } from '../Badge';
import { cn } from '../../utils/cn';

/*
 * Piezas de contenido de celda según el Type de `Item table (Atom)`. Los tipos que ya son un componente de CAOS
 * (Link, Tag, Progress bar, Checkbox, Toggle, Raiting, Button) se ponen tal cual dentro de `TableCell`:
 * ButtonLink, Tag, ProgressBar, Checkbox, Switch, StarRating / NumberRating y Button o Dots dentro de `TableActions`.
 */

/** Type=Profile: avatar (32) + nombre semibold y descripción, gap 8. */
export const TableProfile = forwardRef<HTMLDivElement, TableProfileProps>(
  ({ avatar, name, description, className, ...restProps }, ref) => (
    <div ref={ref} className={cn('flex min-w-0 flex-1 items-center gap-ds-space-general-lg', className)} {...restProps}>
      {avatar}
      <div className={tableTextBlockClass} data-figma-part="Text Container">
        <span className={tableProfileNameClass} data-figma-part="Filename">
          {name}
        </span>
        {description != null && (
          <span className={tableDescriptionClass} data-figma-part="Filename">
            {description}
          </span>
        )}
      </div>
    </div>
  )
);
TableProfile.displayName = 'TableProfile';

/** Type=Text: título regular y descripción. */
export const TableText = forwardRef<HTMLDivElement, TableTextProps>(
  ({ children, description, className, ...restProps }, ref) => (
    <div ref={ref} className={cn(tableTextBlockClass, 'flex-1', className)} {...restProps}>
      <span className={tableTextTitleClass} data-figma-part="Filename">
        {children}
      </span>
      {description != null && (
        <span className={tableDescriptionClass} data-figma-part="Filename">
          {description}
        </span>
      )}
    </div>
  )
);
TableText.displayName = 'TableText';

/** Type=Highlighted text: 14/20 semibold en text/semantic/information-secondary. */
export const TableHighlightedText = forwardRef<HTMLSpanElement, TableHighlightedTextProps>(
  ({ className, ...restProps }, ref) => (
    <span ref={ref} data-figma-part="Filename" className={cn(tableHighlightClass, className)} {...restProps} />
  )
);
TableHighlightedText.displayName = 'TableHighlightedText';

/** Type=Text+badge: punto de 12 (Badge simple) y textos, gap 8. */
export const TableBadgeText = forwardRef<HTMLDivElement, TableBadgeTextProps>(
  ({ children, description, badgeState = 'default', badgeLabel, className, ...restProps }, ref) => (
    <div ref={ref} className={cn('flex min-w-0 flex-1 items-center gap-ds-space-general-lg', className)} {...restProps}>
      <Badge type="simple" state={badgeState} label={badgeLabel} data-figma-part="Badge" />
      <TableText description={description}>{children}</TableText>
    </div>
  )
);
TableBadgeText.displayName = 'TableBadgeText';

/** Type=Button (Actions Block): acciones centradas con gap 4. */
export const TableActions = forwardRef<HTMLDivElement, TableActionsProps>(({ className, ...restProps }, ref) => (
  <div ref={ref} data-figma-part="Actions Block" className={cn(tableActionsClass, className)} {...restProps} />
));
TableActions.displayName = 'TableActions';
