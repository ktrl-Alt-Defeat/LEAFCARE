import { Home, Users, ShoppingBag, User, Sprout, BookOpen, type LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  labelKey: string;
  defaultLabel: string;
  icon: LucideIcon;
  /** Shown in the desktop sidebar only — the mobile bar has room for four. */
  desktopOnly?: boolean;
}

/** Single source of truth so the mobile bar and the desktop sidebar never drift. */
export const NAV_ITEMS: NavItem[] = [
  { href: '/home', labelKey: 'navHome', defaultLabel: 'Home', icon: Home },
  { href: '/community', labelKey: 'navCommunity', defaultLabel: 'Community', icon: Users },
  { href: '/market', labelKey: 'navMarket', defaultLabel: 'Market', icon: ShoppingBag },
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

export const isNavItemActive = (pathname: string, href: string): boolean =>
  pathname === href ||
  (href === '/home' && pathname === '/') ||
  // Keep the catalog entry lit while viewing an individual crop sheet.
  (href === '/catalog' && pathname.startsWith('/catalog/'));
