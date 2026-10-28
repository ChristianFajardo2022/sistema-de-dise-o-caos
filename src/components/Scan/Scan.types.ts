import type { HTMLAttributes, SVGProps } from 'react';

/** Número de puntos del marco de captura (set `points-scan` de Figma). */
export const SCAN_POINTS_COUNT = 8;

export interface ScanPointsProps extends Omit<SVGProps<SVGSVGElement>, 'children' | 'ref' | 'width' | 'height' | 'viewBox'> {
  /**
   * Fotograma estático (`Propiedad 1` de Figma, 0 a 8): cuántos puntos ya están capturados.
   * 0 = todos apagados; 1 a 8 = los primeros `step` puntos (en el orden de captura) en opacidad completa y el resto atenuados.
   * Solo se usa con `animated={false}` o con reducción de movimiento. Por defecto 8.
   */
  step?: number;
  /** Recorre los fotogramas 0 a 8 en bucle. Por defecto `true`; se apaga solo con `prefers-reduced-motion: reduce`. */
  animated?: boolean;
  /** Texto para lectores de pantalla. Sin él, el dibujo es decorativo (`aria-hidden`). */
  label?: string;
}

export interface ScanProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Avance del escaneo, de 0 a 100 (se acota y se redondea para el texto). Por defecto 0. */
  value?: number;
  /** Estado terminado (`Variante12` de Figma): disco relleno con ícono de confirmación. */
  complete?: boolean;
  /** Nombre accesible del `progressbar`. Por defecto "Progreso del escaneo". */
  label?: string;
  /** Muestra el porcentaje en el centro. Por defecto `true`. */
  showValue?: boolean;
}

export type ScanGuideType = 'face' | 'code' | 'id' | 'qr';
/** Fotograma de la guía (`Transition` de Figma). Id tiene 1 a 3; el resto, 1 a 2. */
export type ScanGuideFrame = 1 | 2 | 3;

export interface ScanGuideProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Qué se guía: rostro, código de barras, documento de identidad o QR (`Type` de Figma). Por defecto `face`. */
  type?: ScanGuideType;
  /** Fotograma estático (`Transition` de Figma). Solo se usa con `animated={false}` o con reducción de movimiento. Por defecto 2. */
  frame?: ScanGuideFrame;
  /** Recorre los fotogramas del tipo en bucle. Por defecto `true`; se apaga solo con `prefers-reduced-motion: reduce`. */
  animated?: boolean;
  /** Texto para lectores de pantalla (p. ej. "Ubica tu rostro dentro del marco"). Sin él, el dibujo es decorativo (`aria-hidden`). */
  label?: string;
}
