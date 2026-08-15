/**
 * Presentation metadata for crops.
 *
 * The backend owns agronomy and translations but carries no styling: it has no
 * category, emoji or colour. Those stay here, keyed by the crop slug, so the
 * catalogue keeps its visual identity while the data comes from the API.
 *
 * Slugs with no entry fall back to `DEFAULT_CROP_PRESENTATION`, so a crop added
 * to the backend renders correctly without a frontend deploy.
 */

import { Crop } from '@/types';

export interface CropPresentation {
  category: Crop['category'];
  icon: string;
  color: string;
  /** Only set when `public/crops/<name>.jpg` actually exists. */
  image?: string;
}

export const DEFAULT_CROP_PRESENTATION: CropPresentation = {
  category: 'Vegetables',
  icon: '🌱',
  color: 'bg-agro-100 text-agro-800 border-agro-300',
};

const CROP_PRESENTATION: Record<string, CropPresentation> = {
  // Crops currently served by the backend.
  banana: { category: 'Fruits', icon: '🍌', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  chilli: { category: 'Vegetables', icon: '🌶️', color: 'bg-red-100 text-red-800 border-red-300' },
  rice: { category: 'Cereals', icon: '🌾', color: 'bg-lime-100 text-lime-800 border-lime-300' },
  wheat: { category: 'Cereals', icon: '🌾', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  tomato: {
    category: 'Vegetables',
    icon: '🍅',
    color: 'bg-red-100 text-red-800 border-red-300',
    image: '/crops/tomato.jpg',
  },
  potato: {
    category: 'Vegetables',
    icon: '🥔',
    color: 'bg-amber-100 text-amber-900 border-amber-400',
    image: '/crops/potato.jpg',
  },

  // Retained so the styling survives if these are added to the backend later;
  // their artwork is already in `public/crops`.
  apple: { category: 'Fruits', icon: '🍎', color: 'bg-red-100 text-red-800 border-red-300', image: '/crops/apple.jpg' },
  bell_pepper: {
    category: 'Vegetables',
    icon: '🫑',
    color: 'bg-green-100 text-green-800 border-green-300',
    image: '/crops/bell-pepper.jpg',
  },
  blueberry: {
    category: 'Fruits',
    icon: '🫐',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    image: '/crops/blueberry.jpg',
  },
  cherry: { category: 'Fruits', icon: '🍒', color: 'bg-rose-100 text-rose-800 border-rose-300', image: '/crops/cherry.jpg' },
  corn: {
    category: 'Cereals',
    icon: '🌽',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    image: '/crops/corn-maize.jpg',
  },
  grape: { category: 'Fruits', icon: '🍇', color: 'bg-purple-100 text-purple-800 border-purple-300', image: '/crops/grape.jpg' },
  orange: { category: 'Fruits', icon: '🍊', color: 'bg-orange-100 text-orange-800 border-orange-300', image: '/crops/orange.jpg' },
  peach: { category: 'Fruits', icon: '🍑', color: 'bg-orange-100 text-orange-900 border-orange-300', image: '/crops/peach.jpg' },
  raspberry: {
    category: 'Fruits',
    icon: '🫐',
    color: 'bg-pink-100 text-pink-800 border-pink-300',
    image: '/crops/raspberry.jpg',
  },
  soybean: { category: 'Cash Crops', icon: '🫘', color: 'bg-lime-100 text-lime-800 border-lime-300', image: '/crops/soybean.jpg' },
  squash: {
    category: 'Vegetables',
    icon: '🎃',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    image: '/crops/squash.jpg',
  },
  strawberry: {
    category: 'Fruits',
    icon: '🍓',
    color: 'bg-red-100 text-red-800 border-red-300',
    image: '/crops/strawberry.jpg',
  },
};

export const cropPresentation = (slug: string): CropPresentation =>
  CROP_PRESENTATION[slug] ?? DEFAULT_CROP_PRESENTATION;
