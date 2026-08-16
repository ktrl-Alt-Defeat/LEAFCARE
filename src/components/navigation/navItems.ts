import {
  Home,
  Users,
  ShoppingBag,
  User,
  Sprout,
  BookOpen,
  Store,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { UserRole } from '@/types';

export interface NavItem {
  href: string;
  labelKey: string;
  defaultLabel: string;
  icon: LucideIcon;
  /** Shown in the desktop sidebar only — the mobile bar has room for four. */
  desktopOnly?: boolean;
  /** Roles that see this entry. Omitted means everyone. */
  roles?: UserRole[];
}

/** Single source of truth so the mobile bar and the desktop sidebar never drift. */
export const NAV_ITEMS: NavItem[] = [
  { href: '/home', labelKey: 'navHome', defaultLabel: 'Home', icon: Home },
  { href: '/community', labelKey: 'navCommunity', defaultLabel: 'Community', icon: Users },
  { href: '/market', labelKey: 'navMarket', defaultLabel: 'Market', icon: ShoppingBag },

  // Role dashboards sit above the secondary entries so they are the first thing
  // a seller or admin reaches for. Both keep the full farmer app underneath —
  // these are additions, not replacements.
  {
    href: '/seller',
    labelKey: 'navSeller',
    defaultLabel: 'My Shop',
    icon: Store,
    roles: ['seller'],
  },
  {
    href: '/admin',
    labelKey: 'navAdmin',
    defaultLabel: 'Admin',
    icon: ShieldCheck,
    roles: ['admin'],
  },

  { href: '/crops', labelKey: 'navCrops', defaultLabel: 'My Crops', icon: Sprout, desktopOnly: true },
  {
    href: '/catalog',
    labelKey: 'navCatalog',
    defaultLabel: 'Crop Catalog',
    icon: BookOpen,
    desktopOnly: true,
  },
  { href: '/profile', labelKey: 'navProfile', defaultLabel: 'Profile', icon: User },
];

/** Entries visible to a role, in declaration order. */
export const navItemsForRole = (role: UserRole): NavItem[] =>
  NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));

export const isNavItemActive = (pathname: string, href: string): boolean =>
  pathname === href ||
  (href === '/home' && pathname === '/') ||
  // Keep the catalog entry lit while viewing an individual crop sheet.
  (href === '/catalog' && pathname.startsWith('/catalog/'));
