export interface ToolItem {
  id: string;
  name: string;
  category: 'Calculators' | 'Guides' | 'Weather' | 'AI Assist';
  icon: string;
  description: string;
  isInteractive?: boolean;
  comingSoon?: boolean;
}

export const TOOLS_DATA: ToolItem[] = [
  {
    id: 'fertilizer_calc',
    name: 'Fertilizer Calculator',
    category: 'Calculators',
    icon: '🌱',
    description: 'Calculate precise N-P-K fertilizer bags needed for your land size.',
    isInteractive: true
  },
  {
    id: 'pesticide_calc',
    name: 'Pesticide Dosage',
    category: 'Calculators',
    icon: '🧴',
    description: 'Work out tank mixes from the label rate, spray volume and area.',
    isInteractive: true
  },
  {
    id: 'crop_doctor',
    name: 'Crop Doctor AI',
    category: 'AI Assist',
    icon: '🤖',
    description: 'Interactive voice & text assistant for immediate plant help.',
    comingSoon: true
  },
  {
    id: 'weather_radar',
    name: 'Spray Weather Radar',
    category: 'Weather',
    icon: '📡',
    description: 'Hour-by-hour spray windows from Delta T, wind and rain risk.',
    isInteractive: true
  },
  {
    id: 'planting_calendar',
    name: 'Sowing Calendar',
    category: 'Guides',
    icon: '🗓️',
    description: 'Sowing and harvest windows for each of your crop seasons.',
    isInteractive: true
  },
  {
    id: 'yield_calculator',
    name: 'Yield Estimator',
    category: 'Calculators',
    icon: '📊',
    description: 'Estimate crop yield per acre and expected market return.',
    comingSoon: true
  }
];
