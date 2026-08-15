/**
 * Translates raw backend payloads into the domain types the UI renders.
 *
 * Two rules hold throughout:
 *  - `slug` becomes the frontend `id`. Existing deep links (`/catalog/tomato`)
 *    and saved `selectedCrops` in localStorage keep working, and the backend
 *    accepts a slug wherever it accepts an id.
 *  - Fields the backend does not model (styling, scan confidence, seller town)
 *    are filled from `presentation.ts` or left empty. Nothing is invented.
 */

import {
  CommunityPost,
  Crop,
  CropAgronomy,
  Disease,
  LanguageCode,
  LanguageOption,
  MarketProduct,
} from '@/types';
import { cropPresentation } from './presentation';
import type {
  ApiArticle,
  ApiCommunityPost,
  ApiCrop,
  ApiDisease,
  ApiLanguage,
  ApiProduct,
  ApiTranslation,
} from './types';

const LANGUAGE_CODES: LanguageCode[] = ['en', 'ta', 'hi', 'te', 'ml', 'kn'];

const isLanguageCode = (value: string): value is LanguageCode =>
  (LANGUAGE_CODES as string[]).includes(value);

/** `full_sun` -> `Full sun`, `kg_per_hectare` -> `Kg per hectare`. */
const humanise = (value: string | null | undefined): string => {
  if (!value) return '';
  const spaced = value.replace(/_/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

/** Renders a min/max pair, tolerating a missing half. */
const range = (min: unknown, max: unknown, unit: string): string => {
  const lo = min === null || min === undefined || min === '' ? null : String(min);
  const hi = max === null || max === undefined || max === '' ? null : String(max);
  if (lo && hi) return `${lo}–${hi}${unit}`;
  if (lo) return `${lo}${unit}+`;
  if (hi) return `Up to ${hi}${unit}`;
  return '—';
};

const measure = (value: unknown, unit: string): string =>
  value === null || value === undefined || value === '' ? '—' : `${value}${unit}`;

/* -------------------------------------------------------------------------- */
/* Languages                                                                  */
/* -------------------------------------------------------------------------- */

export const mapLanguage = (raw: ApiLanguage): LanguageOption => ({
  code: isLanguageCode(raw.language_code) ? raw.language_code : 'en',
  nativeName: raw.native_name,
  englishName: raw.language_name,
  description: raw.language_name,
});

/* -------------------------------------------------------------------------- */
/* Crops                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Builds the per-language name map. Languages the backend has no row for fall
 * back to the crop's base name rather than rendering blank.
 */
const buildTranslatedNames = (
  rows: ApiTranslation[] | undefined,
  fallback: string,
): Record<LanguageCode, string> => {
  const names = {} as Record<LanguageCode, string>;

  LANGUAGE_CODES.forEach((code) => {
    const match = rows?.find((row) => row.language_code === code);
    names[code] = match?.crop_name ?? match?.disease_name ?? fallback;
  });

  return names;
};

export const mapCrop = (raw: ApiCrop): Crop => {
  const presentation = cropPresentation(raw.slug);
  const name = raw.crop_name ?? humanise(raw.slug);

  return {
    id: raw.slug,
    name,
    translatedNames: buildTranslatedNames(raw.crop_translations, name),
    category: presentation.category,
    icon: presentation.icon,
    image: raw.image_url ?? presentation.image,
    color: presentation.color,
    description: raw.description ?? '',
  };
};

export const mapCropAgronomy = (raw: ApiCrop): CropAgronomy => {
  const nutrientUnit = raw.nutrient_unit ? ` ${humanise(raw.nutrient_unit).toLowerCase()}` : '';

  const companions = raw.companions ?? [];
  // `neutral` pairings are intentionally dropped — the sheet only shows crops
  // worth planting beside, or worth keeping apart.
  const companionNames = (relationship: string) =>
    companions
      .filter((entry) => entry.relationship === relationship)
      .map((entry) => entry.companion_name)
      .filter(Boolean);

  const labour = humanise(raw.labour_req);

  return {
    cropId: raw.slug,
    growing: {
      temperature: range(raw.temperature_min_c, raw.temperature_max_c, '°C'),
      exposure: humanise(raw.sunlight) || '—',
      rainfall: range(raw.rainfall_min_mm, raw.rainfall_max_mm, ' mm'),
      humidity:
        raw.humidity_min_pct === null && raw.humidity_max_pct === null
          ? undefined
          : range(raw.humidity_min_pct, raw.humidity_max_pct, '%'),
      watering: humanise(raw.water_req) || '—',
    },
    soil: {
      // The backend models drainage but not a soil-type column.
      type: humanise(raw.drainage) || 'Not specified',
      ph: range(raw.ph_min, raw.ph_max, ''),
      drainage: raw.drainage ? humanise(raw.drainage) : undefined,
    },
    cultivation: {
      lifeCycle: humanise(raw.life_cycle) || '—',
      labour: (labour === 'Low' || labour === 'Medium' || labour === 'High' ? labour : 'Medium'),
      plantingMethod: raw.sowing_method ?? '—',
      rowSpacing: measure(raw.row_spacing_cm, ' cm'),
      plantSpacing: measure(raw.plant_spacing_cm, ' cm'),
    },
    nutrients: {
      nitrogen: raw.nitrogen_requirement ? `${raw.nitrogen_requirement}${nutrientUnit}` : '—',
      phosphorus: raw.phosphorus_requirement ? `${raw.phosphorus_requirement}${nutrientUnit}` : '—',
      potassium: raw.potassium_requirement ? `${raw.potassium_requirement}${nutrientUnit}` : '—',
    },
    companions: {
      good: companionNames('good'),
      bad: companionNames('avoid'),
    },
  };
};

/* -------------------------------------------------------------------------- */
/* Diseases                                                                   */
/* -------------------------------------------------------------------------- */

const SEVERITIES: Disease['severity'][] = ['low', 'moderate', 'high', 'severe'];

/**
 * @param lang Used only when the backend has not flattened the translation
 *   onto the record — nested diseases (a crop's `crop_diseases`) arrive with
 *   just the translations array.
 */
export const mapDisease = (raw: ApiDisease, lang: string = 'en'): Disease => {
  const translation =
    raw.disease_translations?.find((row) => row.language_code === lang) ??
    raw.disease_translations?.find((row) => row.language_code === 'en');

  const name = raw.disease_name ?? translation?.disease_name ?? humanise(raw.slug);
  const host = raw.crop_diseases?.find((entry) => entry.is_primary_host) ?? raw.crop_diseases?.[0];
  const severity = (raw.severity ?? '').toLowerCase();

  return {
    id: raw.slug,
    cropId: host?.crop?.slug ?? '',
    cropName: host?.crop?.crop_name ?? humanise(host?.crop?.slug),
    name,
    scientificName: raw.scientific_name ?? '',
    translatedNames: buildTranslatedNames(raw.disease_translations, name),
    // Confidence is a property of a scan, not of the disease itself; the
    // scanner sets it when it records a result.
    confidence: 0,
    severity: (SEVERITIES as string[]).includes(severity)
      ? (severity as Disease['severity'])
      : 'moderate',
    imageUrl: raw.image_url ?? '',
    overview: raw.pathogen_type
      ? `${humanise(raw.pathogen_type)} disease${raw.contagious ? ', spreads between plants' : ''}.`
      : '',
    symptoms: raw.symptoms ?? translation?.symptoms ?? [],
    causes: raw.causes ?? translation?.causes ?? [],
    // Not modelled by the backend — left empty rather than fabricated.
    favorableConditions: [],
    immediateSteps: [],
    organicTreatment: raw.organic_treatment ?? translation?.organic_treatment ?? [],
    chemicalTreatment: raw.chemical_treatment ?? translation?.chemical_treatment ?? [],
    preventionTips: raw.prevention ?? translation?.prevention ?? [],
    disclaimer:
      'Guidance is advisory. Confirm with your local agricultural officer before applying chemicals.',
  };
};

/* -------------------------------------------------------------------------- */
/* Community                                                                  */
/* -------------------------------------------------------------------------- */

const COMMUNITY_CATEGORY_LABELS: Record<string, CommunityPost['category']> = {
  disease_help: 'Disease Help',
  crop_advice: 'Crop Advice',
  weather: 'Weather',
  fertilizer: 'Fertilizer',
  irrigation: 'Irrigation',
  marketplace: 'Marketplace',
  general: 'General Farming',
};

/** Turns an ISO timestamp into the "2 hours ago" phrasing the feed uses. */
export const relativeTime = (iso: string, now: number): string => {
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return '';

  const seconds = Math.max(0, Math.round((now - then) / 1000));
  if (seconds < 60) return 'Just now';

  const units: Array<[number, string]> = [
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.35, 'week'],
    [12, 'month'],
  ];

  let value = seconds;
  let label = 'second';
  for (const [step, nextLabel] of units) {
    if (value < step) break;
    value = Math.floor(value / step);
    label = nextLabel;
  }

  return `${value} ${label}${value === 1 ? '' : 's'} ago`;
};

export const mapCommunityPost = (raw: ApiCommunityPost, now: number): CommunityPost => ({
  id: raw.id,
  authorName: raw.author?.name ?? 'Farmer',
  // The backend stores no author town or avatar.
  authorLocation: '',
  authorAvatar: '👨‍🌾',
  timestamp: relativeTime(raw.created_at, now),
  cropName: raw.crop_summary?.crop_name ?? '',
  category: COMMUNITY_CATEGORY_LABELS[raw.category] ?? 'General Farming',
  title: raw.title,
  content: raw.content,
  imageUrl: raw.image_url ?? undefined,
  likes: raw.likes_count,
  repliesCount: raw.comments_count,
  isLiked: false,
});

/* -------------------------------------------------------------------------- */
/* Marketplace                                                                */
/* -------------------------------------------------------------------------- */

const PRODUCT_CATEGORY_LABELS: Record<string, MarketProduct['category']> = {
  seeds: 'Seeds',
  fertilizers: 'Fertilizers',
  crop_protection: 'Crop Protection',
  tools: 'Tools',
  equipment: 'Equipment',
};

export const mapProduct = (raw: ApiProduct): MarketProduct => ({
  id: raw.id,
  name: raw.name,
  category: PRODUCT_CATEGORY_LABELS[raw.category] ?? 'Tools',
  // Prices arrive as decimal strings to avoid float drift in transit.
  price: Number.parseFloat(raw.price) || 0,
  unit: humanise(raw.unit),
  rating: raw.average_rating,
  reviewsCount: raw.reviews_count,
  seller: raw.seller?.name ?? 'Verified seller',
  // The backend has no seller location column.
  location: '',
  imageUrl: raw.image_url ?? '',
  description: raw.description ?? '',
  isOrganic: raw.is_organic,
});

/* -------------------------------------------------------------------------- */
/* Knowledge                                                                  */
/* -------------------------------------------------------------------------- */

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  body: string;
  categoryName: string;
  heroImageUrl?: string;
  publishedAt?: string;
}

export const mapArticle = (raw: ApiArticle): KnowledgeArticle => ({
  id: raw.slug,
  title: raw.title ?? humanise(raw.slug),
  summary: raw.summary ?? '',
  body: raw.body ?? '',
  categoryName: raw.category_name ?? '',
  heroImageUrl: raw.hero_image_url ?? undefined,
  publishedAt: raw.published_at ?? undefined,
});
