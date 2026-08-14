import {
  Sparkles,
  Camera,
  ClipboardCheck,
  CloudSun,
  BookOpen,
  Calculator,
  Users,
  ShoppingBag,
  Sprout,
  Rocket,
  type LucideIcon,
} from 'lucide-react';

export interface TourStep {
  id: string;
  /** Route the tour navigates to before showing this step. */
  route: string;
  /**
   * Value of the `data-tour` attribute on the element to spotlight.
   * Omitted for full-screen explanatory steps (welcome, wrap-up).
   */
  target?: string;
  icon: LucideIcon;
  /** Gradient for the step's icon tile. */
  accent: string;
  titleKey: string;
  defaultTitle: string;
  descKey: string;
  defaultDesc: string;
}

/**
 * A guided walkthrough: each step navigates to the screen the feature lives on
 * and highlights it in place, rather than describing it from inside a modal.
 */
export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    route: '/home',
    icon: Sparkles,
    accent: 'from-agro-500 to-emerald-600',
    titleKey: 'tourWelcomeTitle',
    defaultTitle: 'Your pocket crop doctor',
    descKey: 'tourWelcomeDesc',
    defaultDesc:
      'LeafCare spots crop diseases from a single photo and tells you exactly what to do next — plus local weather, farming guides and a marketplace, all in your language.',
  },
  {
    id: 'crops',
    route: '/home',
    target: 'my-crops',
    icon: Sprout,
    accent: 'from-lime-500 to-green-600',
    titleKey: 'tourCropsTitle',
    defaultTitle: 'Start with your crops',
    descKey: 'tourCropsDesc',
    defaultDesc:
      'These are the crops you grow. Everything else — diagnoses, advice and alerts — is tailored to them. Tap a crop to focus the dashboard on it.',
  },
  {
    id: 'scan',
    route: '/home',
    target: 'scan',
    icon: Camera,
    accent: 'from-emerald-500 to-teal-600',
    titleKey: 'tourScanTitle',
    defaultTitle: 'Scan a leaf',
    descKey: 'tourScanDesc',
    defaultDesc:
      'Point your camera at an affected leaf. The AI identifies the disease in seconds, so you can act before it spreads across the field.',
  },
  {
    id: 'plan',
    route: '/home',
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
    route: '/home',
    target: 'weather',
    icon: CloudSun,
    accent: 'from-amber-400 to-orange-500',
    titleKey: 'tourWeatherTitle',
    defaultTitle: 'Know when to spray',
    descKey: 'tourWeatherDesc',
    defaultDesc:
      'Live weather for your village shows rain, wind and UV, and tells you whether right now is a safe window to spray.',
  },
  {
    id: 'tools',
    route: '/home',
    target: 'tools',
    icon: Calculator,
    accent: 'from-violet-500 to-purple-600',
    titleKey: 'tourToolsTitle',
    defaultTitle: 'Calculate your inputs',
    descKey: 'tourToolsDesc',
    defaultDesc:
      'The fertilizer calculator works out exactly how many bags of urea, DAP and potash your land needs — no guesswork, no waste.',
  },
  {
    id: 'catalog',
    route: '/catalog',
    target: 'catalog',
    icon: BookOpen,
    accent: 'from-teal-500 to-emerald-600',
    titleKey: 'tourCatalogTitle',
    defaultTitle: 'Look up any crop',
    descKey: 'tourCatalogDesc',
    defaultDesc:
      'Reference sheets for 35 crops cover soil and pH, spacing, nutrient doses and which crops to plant together.',
  },
  {
    id: 'community',
    route: '/community',
    target: 'community',
    icon: Users,
    accent: 'from-rose-500 to-pink-600',
    titleKey: 'tourCommunityTitle',
    defaultTitle: 'Ask other farmers',
    descKey: 'tourCommunityDesc',
    defaultDesc:
      'Post a question to farmers growing the same crops nearby, and share what has worked on your own farm.',
  },
  {
    id: 'market',
    route: '/market',
    target: 'market',
    icon: ShoppingBag,
    accent: 'from-cyan-500 to-sky-600',
    titleKey: 'tourMarketTitle',
    defaultTitle: 'Buy what you need',
    descKey: 'tourMarketDesc',
    defaultDesc:
      'Browse seeds, crop protection and equipment from verified local sellers, with prices and ratings up front.',
  },
  {
    id: 'finish',
    route: '/home',
    icon: Rocket,
    accent: 'from-agro-600 to-emerald-500',
    titleKey: 'tourFinishTitle',
    defaultTitle: "You're ready to go",
    descKey: 'tourFinishDesc',
    defaultDesc:
      'That is the whole app. Start by scanning a leaf from your field — you can reopen this tour any time from the dashboard.',
  },
];
