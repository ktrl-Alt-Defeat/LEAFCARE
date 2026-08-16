import { RoleOption } from '@/types';

/**
 * Roles offered during onboarding, in the order they are shown.
 *
 * Farmer is first and is the default: it is what almost everyone selecting is,
 * and the other two are additive rather than separate products.
 */
export const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'farmer',
    title: 'Farmer',
    description: 'Scan crops for disease, track weather and ask the community.',
    icon: '👨‍🌾',
  },
  {
    role: 'seller',
    title: 'Seller',
    description: 'Everything a farmer gets, plus list and manage your products in the marketplace.',
    icon: '🏪',
  },
  {
    role: 'admin',
    title: 'Admin',
    description: 'Curate the crop library and knowledge base for every LeafCare user.',
    icon: '🛠️',
  },
];
