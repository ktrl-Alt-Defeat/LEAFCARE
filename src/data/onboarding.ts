export interface OnboardingSlideData {
  id: number;
  titleKey: string;
  descKey: string;
  defaultTitle: string;
  defaultDesc: string;
  icon: string;
  color: string;
  badge: string;
}

export const ONBOARDING_SLIDES: OnboardingSlideData[] = [
  {
    id: 1,
    titleKey: 'onboardingTitle1',
    descKey: 'onboardingDesc1',
    defaultTitle: 'Instant Crop Disease Detection',
    defaultDesc: 'Take a clear picture of your crop leaf and get instant AI disease diagnosis with treatment remedies in seconds.',
    icon: '🔍',
    color: 'from-emerald-500 to-green-600',
    badge: 'AI Powered'
  },
  {
    id: 2,
    titleKey: 'onboardingTitle2',
    descKey: 'onboardingDesc2',
    defaultTitle: 'Better Farming Decisions',
    defaultDesc: 'Understand crop health problems early and discover organic & chemical remedies tailored for your farm.',
    icon: '🌱',
    color: 'from-green-600 to-teal-700',
    badge: 'Farmer Guide'
  },
  {
    id: 3,
    titleKey: 'onboardingTitle3',
    descKey: 'onboardingDesc3',
    defaultTitle: 'Supportive Farming Community',
    defaultDesc: 'Connect with expert farmers in your region, ask questions, share crop protection tips, and grow together.',
    icon: '🤝',
    color: 'from-teal-600 to-emerald-700',
    badge: 'Community'
  }
];
