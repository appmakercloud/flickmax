export interface Country {
  code: string
  name: string
  currency: string
  locale: string
  marketId: string
  phoneNumber: string
  flag: string
}

export const countries: Country[] = [
  { code: 'US', name: 'United States', currency: 'USD', locale: 'en-US', marketId: 'en-US', phoneNumber: '(480) 624-2500', flag: '🇺🇸' },
  { code: 'AR', name: 'Argentina (USD)', currency: 'USD', locale: 'es-AR', marketId: 'es-AR', phoneNumber: '011 5984-0787', flag: '🇦🇷' },
  { code: 'AT', name: 'Austria', currency: 'EUR', locale: 'de-AT', marketId: 'de-AT', phoneNumber: '0720 116854', flag: '🇦🇹' },
  { code: 'AU', name: 'Australia', currency: 'AUD', locale: 'en-AU', marketId: 'en-AU', phoneNumber: '02 8042 8923', flag: '🇦🇺' },
  { code: 'BE', name: 'Belgium', currency: 'EUR', locale: 'nl-BE', marketId: 'nl-BE', phoneNumber: '078 48 03 42', flag: '🇧🇪' },
  { code: 'BR', name: 'Brazil (USD)', currency: 'USD', locale: 'pt-BR', marketId: 'pt-BR', phoneNumber: '(011) 3958-5682', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', currency: 'CAD', locale: 'en-CA', marketId: 'en-CA', phoneNumber: '844-494-9067', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', currency: 'CLP', locale: 'es-CL', marketId: 'es-CL', phoneNumber: '(022) 5940 640', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', currency: 'COP', locale: 'es-CO', marketId: 'es-CO', phoneNumber: '57 1 381 6881', flag: '🇨🇴' },
  { code: 'CZ', name: 'Czech Republic (EUR)', currency: 'EUR', locale: 'cs-CZ', marketId: 'cs-CZ', phoneNumber: '225 985 221', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', currency: 'DKK', locale: 'da-DK', marketId: 'da-DK', phoneNumber: '36-92-77-29', flag: '🇩🇰' },
  { code: 'FR', name: 'France', currency: 'EUR', locale: 'fr-FR', marketId: 'fr-FR', phoneNumber: '09 75 18 70 35', flag: '🇫🇷' },
  { code: 'FI', name: 'Finland', currency: 'EUR', locale: 'fi-FI', marketId: 'fi-FI', phoneNumber: '09 424 50 418', flag: '🇫🇮' },
  { code: 'DE', name: 'Germany', currency: 'EUR', locale: 'de-DE', marketId: 'de-DE', phoneNumber: '089 22 061 158', flag: '🇩🇪' },
  { code: 'GR', name: 'Greece', currency: 'EUR', locale: 'el-GR', marketId: 'el-GR', phoneNumber: '21 1 198 4545', flag: '🇬🇷' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD', locale: 'zh-HK', marketId: 'zh-HK', phoneNumber: '3050-7472', flag: '🇭🇰' },
  { code: 'HU', name: 'Hungary (EUR)', currency: 'EUR', locale: 'hu-HU', marketId: 'hu-HU', phoneNumber: '06 800 13671', flag: '🇭🇺' },
  { code: 'IN', name: 'India', currency: 'INR', locale: 'en-IN', marketId: 'en-IN', phoneNumber: '1-800-121-0120', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR', locale: 'id-ID', marketId: 'id-ID', phoneNumber: '(021) 2188-9044', flag: '🇮🇩' },
  { code: 'IE', name: 'Ireland', currency: 'EUR', locale: 'en-IE', marketId: 'en-IE', phoneNumber: '01 653 5977', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', currency: 'ILS', locale: 'he-IL', marketId: 'he-IL', phoneNumber: '03-3741564', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', currency: 'EUR', locale: 'it-IT', marketId: 'it-IT', phoneNumber: '800-790180', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', currency: 'JPY', locale: 'ja-JP', marketId: 'ja-JP', phoneNumber: '050-6864-8180', flag: '🇯🇵' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR', locale: 'ms-MY', marketId: 'ms-MY', phoneNumber: '015-4877 0212', flag: '🇲🇾' },
  { code: 'MX', name: 'Mexico', currency: 'MXN', locale: 'es-MX', marketId: 'es-MX', phoneNumber: '55 4631 2411', flag: '🇲🇽' },
  { code: 'MA', name: 'Morocco (USD)', currency: 'USD', locale: 'ar-MA', marketId: 'ar-MA', phoneNumber: '080 2000 964', flag: '🇲🇦' },
  { code: 'NO', name: 'Norway', currency: 'NOK', locale: 'nb-NO', marketId: 'nb-NO', phoneNumber: '852 85 055', flag: '🇳🇴' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', locale: 'nl-NL', marketId: 'nl-NL', phoneNumber: '085 888 3139', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', locale: 'en-NZ', marketId: 'en-NZ', phoneNumber: '(09) 975-9409', flag: '🇳🇿' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR', locale: 'en-PK', marketId: 'en-PK', phoneNumber: '1 480 463-8111', flag: '🇵🇰' },
  { code: 'PE', name: 'Peru', currency: 'PEN', locale: 'es-PE', marketId: 'es-PE', phoneNumber: '01 700 9339', flag: '🇵🇪' },
  { code: 'PL', name: 'Poland', currency: 'PLN', locale: 'pl-PL', marketId: 'pl-PL', phoneNumber: '22 307 46 99', flag: '🇵🇱' },
  { code: 'PH', name: 'Philippines', currency: 'PHP', locale: 'en-PH', marketId: 'en-PH', phoneNumber: '(02) 8231 3942', flag: '🇵🇭' },
  { code: 'PT', name: 'Portugal', currency: 'EUR', locale: 'pt-PT', marketId: 'pt-PT', phoneNumber: '308 801 713', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania (EUR)', currency: 'EUR', locale: 'ro-RO', marketId: 'ro-RO', phoneNumber: '0800 896 336', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia (USD)', currency: 'USD', locale: 'ru-RU', marketId: 'ru-RU', phoneNumber: '7 495 463 17 27', flag: '🇷🇺' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', locale: 'en-SG', marketId: 'en-SG', phoneNumber: '65 6349 4259', flag: '🇸🇬' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', locale: 'en-ZA', marketId: 'en-ZA', phoneNumber: '087 550 2198', flag: '🇿🇦' },
  { code: 'KR', name: 'South Korea', currency: 'KRW', locale: 'ko-KR', marketId: 'ko-KR', phoneNumber: '02 3483 3274', flag: '🇰🇷' },
  { code: 'ES', name: 'Spain', currency: 'EUR', locale: 'es-ES', marketId: 'es-ES', phoneNumber: '902 84 8316', flag: '🇪🇸' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', locale: 'de-CH', marketId: 'de-CH', phoneNumber: '043 508 3959', flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden', currency: 'SEK', locale: 'sv-SE', marketId: 'sv-SE', phoneNumber: '077 421 88 09', flag: '🇸🇪' },
  { code: 'TW', name: 'Taiwan', currency: 'TWD', locale: 'zh-TW', marketId: 'zh-TW', phoneNumber: '(02) 7703-9090', flag: '🇹🇼' },
  { code: 'TH', name: 'Thailand', currency: 'THB', locale: 'th-TH', marketId: 'th-TH', phoneNumber: '02 156 0902', flag: '🇹🇭' },
  { code: 'TR', name: 'Turkey (USD)', currency: 'USD', locale: 'tr-TR', marketId: 'tr-TR', phoneNumber: '0 850 390 21 86', flag: '🇹🇷' },
  { code: 'AE', name: 'UAE', currency: 'AED', locale: 'ar-AE', marketId: 'ar-AE', phoneNumber: '44 20 7660 1407', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', locale: 'en-GB', marketId: 'en-GB', phoneNumber: '020 3014 1446', flag: '🇬🇧' },
  { code: 'UA', name: 'Ukraine', currency: 'UAH', locale: 'uk-UA', marketId: 'uk-UA', phoneNumber: '089 324-04-66', flag: '🇺🇦' },
  { code: 'UY', name: 'Uruguay (USD)', currency: 'USD', locale: 'es-UY', marketId: 'es-UY', phoneNumber: '2901 0101', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', currency: 'VES', locale: 'es-VE', marketId: 'es-VE', phoneNumber: '0800 3622265', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', currency: 'VND', locale: 'vi-VN', marketId: 'vi-VN', phoneNumber: '0284 458 1498', flag: '🇻🇳' },
]

export const defaultCountry = countries[0] // US

export function getCountryByCode(code: string): Country | undefined {
  return countries.find(c => c.code === code)
}

export function formatCurrency(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Currency conversion rates (simplified - in production, use a real API)
// Base currency: USD
export const exchangeRates: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  INR: 83.12,
  AUD: 1.52,
  CAD: 1.36,
  SGD: 1.35,
  JPY: 149.50,
  HKD: 7.83,
  NZD: 1.63,
  CHF: 0.88,
  SEK: 10.47,
  DKK: 6.32,
  NOK: 10.64,
  MXN: 17.13,
  BRL: 4.98,
  ARS: 365.50,
  CLP: 928.00,
  COP: 3931.00,
  PEN: 3.76,
  MYR: 4.67,
  THB: 35.52,
  IDR: 15650.00,
  PHP: 55.89,
  VND: 24470.00,
  KRW: 1318.00,
  TWD: 31.98,
  ILS: 3.68,
  PLN: 3.99,
  CZK: 22.57,
  HUF: 353.00,
  RON: 4.46,
  BGN: 1.66,
  HRK: 6.40,
  RUB: 91.50,
  TRY: 30.22,
  ZAR: 18.91,
  PKR: 278.50,
  UAH: 38.00,
  AED: 3.67,
  VES: 36.20,
}

export function convertPrice(priceUSD: number, toCurrency: string): number {
  const rate = exchangeRates[toCurrency] || 1
  return priceUSD * rate
}