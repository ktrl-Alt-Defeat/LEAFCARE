/**
 * Raw response shapes from the LeafCare backend, mirrored exactly as the API
 * returns them (snake_case, stringified decimals, nullable columns).
 *
 * Nothing outside `mappers.ts` should consume these directly — the UI works in
 * the domain types from `@/types`.
 */

/** Every endpoint wraps its payload in this envelope. */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  meta?: ApiMeta;
}

export interface ApiMeta {
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiLanguage {
  language_code: string;
  language_name: string;
  native_name: string;
  sort_order: number;
  is_active: boolean;
}

/**
 * A single translation row. The list endpoints flatten the requested language
 * onto the parent object, but nested records (a crop's diseases, for example)
 * arrive with only this array, so mappers read from here as a fallback.
 */
export interface ApiTranslation {
  language_code: string;
  crop_name?: string;
  disease_name?: string;
  description?: string | null;
  sowing_method?: string | null;
  harvesting_guide?: string | null;
  symptoms?: string[];
  causes?: string[];
  prevention?: string[];
  organic_treatment?: string[];
  chemical_treatment?: string[];
}

export interface ApiCrop {
  id: string;
  slug: string;
  scientific_name: string | null;
  temperature_min_c: string | null;
  temperature_max_c: string | null;
  ph_min: string | null;
  ph_max: string | null;
  rainfall_min_mm: number | null;
  rainfall_max_mm: number | null;
  humidity_min_pct: number | null;
  humidity_max_pct: number | null;
  water_req: string | null;
  sunlight: string | null;
  drainage: string | null;
  life_cycle: string | null;
  labour_req: string | null;
  nutrient_unit: string | null;
  nitrogen_requirement: string | null;
  phosphorus_requirement: string | null;
  potassium_requirement: string | null;
  row_spacing_cm: number | null;
  plant_spacing_cm: number | null;
  sowing_depth_cm: number | null;
  icon_name: string | null;
  image_url: string | null;
  crop_translations?: ApiTranslation[];
  /** Flattened for the requested `lang`. */
  crop_name?: string;
  description?: string | null;
  sowing_method?: string | null;
  harvesting_guide?: string | null;
  seasons?: string[];
  /**
   * Present on the detail endpoint only, already flattened by the backend.
   * `relationship` is one of `good`, `avoid` or `neutral`.
   */
  companions?: Array<{ companion_crop_id: string; companion_name: string; relationship: string }>;
  /** Diseases this crop hosts. Detail endpoint only. */
  crop_diseases?: Array<{ is_primary_host: boolean; disease?: ApiDisease }>;
}

export interface ApiDisease {
  id: string;
  slug: string;
  scientific_name: string | null;
  severity: string | null;
  pathogen_type: string | null;
  contagious: boolean;
  icon_name: string | null;
  image_url: string | null;
  disease_translations?: ApiTranslation[];
  /** Flattened for the requested `lang`. */
  disease_name?: string;
  symptoms?: string[];
  causes?: string[];
  prevention?: string[];
  organic_treatment?: string[];
  chemical_treatment?: string[];
  /** Present on the detail endpoint only. */
  crop_diseases?: Array<{ is_primary_host: boolean; crop?: ApiCrop; disease?: ApiDisease }>;
}

export interface ApiCommunityPost {
  id: string;
  category: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author?: { id: string; name: string } | null;
  crop_summary?: { slug?: string; crop_name?: string } | null;
  comments_count: number;
  likes_count: number;
}

export interface ApiProduct {
  id: string;
  category: string;
  name: string;
  description: string | null;
  price: string;
  currency_code: string;
  unit: string;
  stock_quantity: number;
  is_organic: boolean;
  image_url: string | null;
  seller?: { id: string; name: string } | null;
  average_rating: number;
  reviews_count: number;
}

export interface ApiArticle {
  id: string;
  slug: string;
  hero_image_url: string | null;
  published_at: string | null;
  title?: string;
  summary?: string;
  body?: string;
  category_name?: string;
}

/** Shared by community and marketplace: a slug plus display copy. */
export interface ApiCategory {
  category: string;
  title: string;
  description: string;
}
