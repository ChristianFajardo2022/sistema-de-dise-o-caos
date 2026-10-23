import type { PhoneInputCountry } from './PhoneInput.types';

/** Lista corta de ejemplo que usa `PhoneInput` si no recibe `countries`. */
export const DEFAULT_PHONE_COUNTRIES: PhoneInputCountry[] = [
  { code: 'CO', dialCode: '+57', label: 'Colombia' },
  { code: 'US', dialCode: '+1', label: 'Estados Unidos' },
  { code: 'MX', dialCode: '+52', label: 'México' },
  { code: 'ES', dialCode: '+34', label: 'España' },
  { code: 'AR', dialCode: '+54', label: 'Argentina' },
];
