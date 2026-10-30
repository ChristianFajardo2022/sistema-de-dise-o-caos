import { forwardRef, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import type { ProductCardProps } from './ProductCard.types';
import {
  productCardActionsClass,
  productCardDescriptionClass,
  productCardFavoriteClass,
  productCardImageClass,
  productCardLinkClass,
  productCardOverlayVariants,
  productCardPriceClass,
  productCardPriceRowClass,
  productCardRevealVariants,
  productCardTextGroupClass,
  productCardTitleClass,
  productCardVariants,
} from './ProductCard.variants';
import { Button } from '../Button';
import { ButtonCorner } from '../ButtonCorner';
import { NumberPicker } from '../NumberPicker';
import { NumberRating } from '../Rating';
import { MediaScrim } from '../_internal/MediaScrim';
import { NotchedSurface } from '../_internal/NotchedSurface';
import { cornerShadowClass } from '../_internal/shadows';
import { cn } from '../../utils/cn';

// Figma: 15863:66763
/**
 * Tarjeta de producto (component set "Card producto" de Figma).
 * Contenedor (`<article>`) con foto, nombre, precio, calificación y tres controles: favorito (toggle con
 * `aria-pressed`), "Agregar al carrito" y, con el producto agregado (State "+"), el selector de cantidad.
 * Hover de Figma = la tarjeta se expande con hover, foco dentro o en pantallas táctiles y muestra la descripción y las
 * acciones; plegadas siguen en el árbol de accesibilidad y en el orden de tabulación. Con `href`, el título es un
 * enlace estirado que cubre la tarjeta; los controles quedan encima, sin anidarse en el enlace.
 * El `ref` va a la raíz.
 */
export const ProductCard = forwardRef<HTMLElement, ProductCardProps>(
  (
    {
      title,
      description,
      price,
      rating,
      ratingCount,
      src,
      alt = '',
      href,
      headingLevel = 3,
      quantity: quantityProp,
      defaultQuantity = 0,
      onQuantityChange,
      maxQuantity,
      onAddToCart,
      addToCartText = 'Agregar al carrito',
      addToCartLabel,
      quantityLabel,
      action,
      favorite: favoriteProp,
      defaultFavorite = false,
      onFavoriteChange,
      favoriteLabel,
      favoriteButtonProps,
      state,
      className,
      ...restProps
    },
    ref
  ) => {
    const isQuantityControlled = quantityProp !== undefined;
    const [innerQuantity, setInnerQuantity] = useState(defaultQuantity);
    const quantity = isQuantityControlled ? quantityProp : innerQuantity;
    const added = quantity > 0;

    const isFavoriteControlled = favoriteProp !== undefined;
    const [innerFavorite, setInnerFavorite] = useState(defaultFavorite);
    const favorite = isFavoriteControlled ? favoriteProp : innerFavorite;

    // Al pasar de botón a selector (y al revés) el control con foco desaparece: el foco va al que lo reemplaza
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const pickerRef = useRef<HTMLInputElement>(null);
    const pendingFocus = useRef<'picker' | 'add' | null>(null);
    useEffect(() => {
      if (pendingFocus.current === 'picker' && added) pickerRef.current?.focus();
      if (pendingFocus.current === 'add' && !added) addButtonRef.current?.focus();
      pendingFocus.current = null;
    }, [added]);

    const setQuantity = (next: number) => {
      if (next === quantity) return;
      if (!isQuantityControlled) setInnerQuantity(next);
      onQuantityChange?.(next);
    };

    const handleAdd = (event: MouseEvent<HTMLButtonElement>) => {
      onAddToCart?.(event);
      if (event.defaultPrevented) return;
      pendingFocus.current = 'picker';
      setQuantity(1);
    };

    const handlePickerChange = (next: number | undefined) => {
      // Campo vacío: se conserva la cantidad (el selector vuelve a mostrarla)
      if (next === undefined) return;
      if (next <= 0) pendingFocus.current = 'add';
      setQuantity(Math.max(0, next));
    };

    const toggleFavorite = () => {
      const next = !favorite;
      if (!isFavoriteControlled) setInnerFavorite(next);
      onFavoriteChange?.(next);
    };

    const reveal: 'auto' | 'expanded' | 'collapsed' =
      state === 'hover' || added ? 'expanded' : state === 'default' ? 'collapsed' : 'auto';

    const Heading = headingLevel === 'none' ? 'p' : (`h${headingLevel}` as const);
    const hasDescription = description != null && description !== false && description !== '';

    return (
      <article ref={ref} {...restProps} className={cn(productCardVariants(), className)}>
        {/* La silueta de la foto no lleva trazo (Figma no lo dibuja): la foto llena la silueta (`bleed`) */}
        <NotchedSurface notch="md" bleed data-figma-part="Subtract">
          <img src={src} alt={alt} className={productCardImageClass} />
        </NotchedSurface>

        <MediaScrim edge="bottom" data-figma-part="Text" className={productCardOverlayVariants({ reveal })}>
          <div className={productCardTextGroupClass}>
            <Heading data-figma-part="Filename" className={productCardTitleClass}>
              {href ? (
                <a href={href} className={productCardLinkClass}>
                  {title}
                </a>
              ) : (
                title
              )}
            </Heading>
            {hasDescription && (
              <p data-figma-part="Status" className={cn(productCardDescriptionClass, productCardRevealVariants({ reveal }))}>
                {description}
              </p>
            )}
            <div className={productCardPriceRowClass}>
              <p className={productCardPriceClass}>
                <span className="sr-only">Precio: </span>
                <span data-figma-part="Filename">{price}</span>
              </p>
              {rating !== undefined && <NumberRating value={rating} total={ratingCount} data-figma-part="Number rating" />}
            </div>
          </div>

          {added ? (
            <div className="relative z-10">
              <NumberPicker
                ref={pickerRef}
                fullWidth
                value={quantity}
                onValueChange={handlePickerChange}
                min={0}
                max={maxQuantity}
                aria-label={quantityLabel ?? `Cantidad de ${title}`}
                decrementLabel={`Quitar una unidad de ${title}`}
                incrementLabel={`Agregar una unidad de ${title}`}
                rootProps={{ 'data-figma-part': 'Number picker input' }}
              />
            </div>
          ) : (
            <div className={productCardRevealVariants({ reveal })}>
              <div data-figma-part="Desktop" className={cn(productCardActionsClass, 'relative z-10')}>
                <Button
                  ref={addButtonRef}
                  variant="primary"
                  size="sm"
                  aria-label={addToCartLabel ?? `${addToCartText}: ${title}`}
                  onClick={handleAdd}
                  className="min-w-0 flex-1"
                  data-figma-part="Button"
                >
                  {addToCartText}
                </Button>
                {action}
              </div>
            </div>
          )}
        </MediaScrim>

        <ButtonCorner
          {...favoriteButtonProps}
          variant="favorite"
          contrast="on-card"
          size="md"
          pressed={favorite}
          aria-label={favoriteLabel ?? `Agregar ${title} a favoritos`}
          onClick={toggleFavorite}
          className={cn(productCardFavoriteClass, cornerShadowClass, favoriteButtonProps?.className)}
          data-figma-part="Button corner "
        />
      </article>
    );
  }
);

ProductCard.displayName = 'ProductCard';
