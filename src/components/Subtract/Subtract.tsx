import { cn } from '../../utils/cn';
import './Subtract.css';

export interface SubtractProps {
  className?: string;
  width?: number | string;
}

export function Subtract({ className, width }: SubtractProps) {
  return (
    <div
      aria-label="Forma Subtract de CAOS"
      className={cn('subtract', className)}
      role="img"
      style={width === undefined ? undefined : { width }}
    />
  );
}
