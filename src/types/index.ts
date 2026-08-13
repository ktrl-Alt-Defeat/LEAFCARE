export type LanguageCode = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  description: string;
  flagSymbol?: string;
}

export interface PermissionStatus {
  location: 'prompt' | 'granted' | 'denied' | 'skipped';
  camera: 'prompt' | 'granted' | 'denied' | 'skipped';
  microphone: 'prompt' | 'granted' | 'denied' | 'skipped';
  notifications: 'prompt' | 'granted' | 'denied' | 'skipped';
}

export interface Crop {
  id: string;
  name: string;
  translatedNames: Record<LanguageCode, string>;
  category: 'Cereals' | 'Vegetables' | 'Fruits' | 'Herbs' | 'Cash Crops';
  icon: string;
  color: string;
  description: string;
}

/** Agronomy reference sheet shown in the crops catalog. */
export interface CropAgronomy {
  cropId: string;
  growing: {
    temperature: string;
    exposure: string;
    rainfall: string;
    humidity?: string;
    watering: string;
  };
  soil: {
    type: string;
    ph: string;
    drainage?: string;
  };
  cultivation: {
    lifeCycle: string;
    labour: 'Low' | 'Medium' | 'High';
    plantingMethod: string;
    rowSpacing: string;
    plantSpacing: string;
  };
  nutrients: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  companions: {
    good: string[];
    bad: string[];
  };
}

export interface Disease {
  id: string;
  cropId: string;
  cropName: string;
  name: string;
  scientificName: string;
  translatedNames: Record<LanguageCode, string>;
  confidence: number; // e.g. 92%
  severity: 'low' | 'moderate' | 'high' | 'severe';
  imageUrl: string;
  overview: string;
  symptoms: string[];
  causes: string[];
  favorableConditions: string[];
  immediateSteps: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventionTips: string[];
  disclaimer: string;
}

// Weather types live with the Open-Meteo service in `@/lib/open-meteo`, which is
// the single source of truth for meteorological data.

export interface ScanResult {
  id: string;
  timestamp: string;
  cropId: string;
  cropName: string;
  disease: Disease;
  capturedImageData: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorLocation: string;
  authorAvatar: string;
  timestamp: string;
  cropName: string;
  category: 'Disease Help' | 'Crop Advice' | 'Weather' | 'Fertilizer' | 'General Farming';
  title: string;
  content: string;
  imageUrl?: string;
  likes: number;
  repliesCount: number;
  isLiked?: boolean;
}

export interface MarketProduct {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Crop Protection' | 'Tools' | 'Equipment';
  price: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  seller: string;
  location: string;
  imageUrl: string;
  description: string;
  isOrganic?: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  location: string;
  farmSize: string;
  experienceYears: string;
}
