/**
 * Sowing and harvest windows derived from the crop's cropping seasons.
 *
 * The Indian cropping calendar is organised around the monsoon rather than
 * around fixed dates, so each season carries a sowing window, a harvest window
 * and the reason it falls where it does. Windows are approximate and shift by a
 * few weeks with latitude and monsoon onset — the UI says so rather than
 * implying a precision this data does not have.
 */

import { CropSeason } from '@/types';

export interface SeasonWindow {
  season: CropSeason;
  label: string;
  /** Month indices, 0 = January. Inclusive, and may wrap across the new year. */
  sowFrom: number;
  sowTo: number;
  harvestFrom: number;
  harvestTo: number;
  rationale: string;
}

export const SEASON_WINDOWS: Record<CropSeason, SeasonWindow> = {
  kharif: {
    season: 'kharif',
    label: 'Kharif (monsoon)',
    sowFrom: 5, // June
    sowTo: 6, // July
    harvestFrom: 8, // September
    harvestTo: 9, // October
    rationale: 'Sown with the south-west monsoon and harvested as the rains withdraw.',
  },
  rabi: {
    season: 'rabi',
    label: 'Rabi (winter)',
    sowFrom: 9, // October
    sowTo: 10, // November
    harvestFrom: 2, // March
    harvestTo: 3, // April
    rationale: 'Sown on residual soil moisture after the monsoon, ripening in the dry spring.',
  },
  zaid: {
    season: 'zaid',
    label: 'Zaid (summer)',
    sowFrom: 2, // March
    sowTo: 3, // April
    harvestFrom: 5, // June
    harvestTo: 6, // July
    rationale: 'A short irrigated season between rabi harvest and the monsoon.',
  },
  perennial: {
    season: 'perennial',
    label: 'Perennial',
    sowFrom: 5, // June
    sowTo: 7, // August
    harvestFrom: 0,
    harvestTo: 11,
    rationale: 'Planted into monsoon moisture so roots establish before the dry season.',
  },
};

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const monthName = (index: number): string => MONTHS[((index % 12) + 12) % 12];

/** Formats a window, collapsing a single-month range to one label. */
export const formatWindow = (from: number, to: number): string =>
  from === to ? monthName(from) : `${monthName(from)} – ${monthName(to)}`;

/** True when `month` falls inside a window that may wrap past December. */
export const isWithinWindow = (month: number, from: number, to: number): boolean => {
  const m = ((month % 12) + 12) % 12;
  return from <= to ? m >= from && m <= to : m >= from || m <= to;
};

export interface SeasonStatus extends SeasonWindow {
  /** True when the current month is inside the sowing window. */
  sowingNow: boolean;
  /** Months until sowing opens; 0 when it is open now. */
  monthsUntilSowing: number;
}

/** Distance forward from `month` to `target`, wrapping across the year end. */
const monthsAhead = (month: number, target: number): number => (((target - month) % 12) + 12) % 12;

/**
 * Turns a crop's seasons into dated guidance, ordered so whatever the farmer
 * can sow soonest appears first.
 */
export const seasonStatuses = (seasons: CropSeason[], currentMonth: number): SeasonStatus[] =>
  seasons
    .map((season) => SEASON_WINDOWS[season])
    .filter(Boolean)
    .map((window) => {
      const sowingNow = isWithinWindow(currentMonth, window.sowFrom, window.sowTo);
      return {
        ...window,
        sowingNow,
        monthsUntilSowing: sowingNow ? 0 : monthsAhead(currentMonth, window.sowFrom),
      };
    })
    .sort((a, b) => a.monthsUntilSowing - b.monthsUntilSowing);
