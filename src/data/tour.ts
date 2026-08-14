import {
  Sparkles,
  Camera,
  ClipboardCheck,
  CloudSun,
  BookOpen,
  Calculator,
  Users,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';

export interface TourStep {
  id: string;
  icon: LucideIcon;
  /** Gradient applied to the step's icon tile. */
  accent: string;
  titleKey: string;
  defaultTitle: string;
  descKey: string;
  defaultDesc: string;
  /** Where the feature lives, so users can jump straight in. */
  href?: string;
}

/**
 * High-level product walkthrough. Each step answers "what is this and why does
 * it help me?" — no interface mechanics, no implementation detail.
 */
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    icon: Sparkles,
    accent: 'from-agro-500 to-emerald-600',
    titleKey: 'tourWelcomeTitle',
    defaultTitle: 'Your pocket crop doctor',
    descKey: 'tourWelcomeDesc',
    defaultDesc:
      'LeafCare spots crop diseases from a single photo and tells you exactly what to do next — plus local weather, farming guides and a marketplace, all in your language.',
  },
  {
    id: 'scan',
    icon: Camera,
    accent: 'from-emerald-500 to-teal-600',
    titleKey: 'tourScanTitle',
    defaultTitle: 'Scan a leaf',
    descKey: 'tourScanDesc',
    defaultDesc:
      'Point your camera at an affected leaf. The AI identifies the disease in seconds, so you can act before it spreads across the field.',
    href: '/scan',
  },
  {
    id: 'plan',
    icon: ClipboardCheck,
    accent: 'from-sky-500 to-blue-600',
    titleKey: 'tourPlanTitle',
    defaultTitle: 'Get a treatment plan',
    descKey: 'tourPlanDesc',
    defaultDesc:
      'Every diagnosis comes with symptoms, causes and a step-by-step action plan — organic and chemical options side by side.',
  },
  {
    id: 'weather',
    icon: CloudSun,
    accent: 'from-amber-400 to-orange-500',
    titleKey: 'tourWeatherTitle',
    defaultTitle: 'Know when to spray',
    descKey: 'tourWeatherDesc',
    defaultDesc:
      'Live weather for your village shows rain, wind and UV, and tells you whether right now is a safe window to spray.',
  },
  {
    id: 'catalog',
    icon: BookOpen,
    accent: 'from-lime-500 to-green-600',
    titleKey: 'tourCatalogTitle',
    defaultTitle: 'Look up any crop',
    descKey: 'tourCatalogDesc',
    defaultDesc:
      'Reference sheets for 35 crops cover soil and pH, spacing, nutrient doses and which crops to plant together.',
    href: '/catalog',
  },
  {
    id: 'tools',
    icon: Calculator,
    accent: 'from-violet-500 to-purple-600',
    titleKey: 'tourToolsTitle',
    defaultTitle: 'Calculate your inputs',
    descKey: 'tourToolsDesc',
    defaultDesc:
      'The fertilizer calculator works out exactly how many bags of urea, DAP and potash your land needs — no guesswork, no waste.',
  },
  {
    id: 'community',
    icon: Users,
    accent: 'from-rose-500 to-pink-600',
    titleKey: 'tourCommunityTitle',
    defaultTitle: 'Ask other farmers',
    descKey: 'tourCommunityDesc',
    defaultDesc:
      'Post a question to farmers growing the same crops nearby, and share what has worked on your own farm.',
    href: '/community',
  },
  {
    id: 'market',
    icon: ShoppingBag,
    accent: 'from-cyan-500 to-sky-600',
    titleKey: 'tourMarketTitle',
    defaultTitle: 'Buy what you need',
    descKey: 'tourMarketDesc',
    defaultDesc:
      'Browse seeds, crop protection and equipment from verified local sellers, with prices and ratings up front.',
    href: '/market',
  },
];
