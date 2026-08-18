/**
 * Spray tank-mix calculations.
 *
 * Product labels state a rate in one of two ways, and mixing them up is the
 * usual cause of over- or under-dosing:
 *
 *   per-area  — e.g. "400 ml per acre". The total product is fixed by the area,
 *               and the water only decides how it is spread. Increasing spray
 *               volume must NOT increase the amount of product used.
 *   per-litre — e.g. "2 ml per litre of water". The concentration is fixed, so
 *               total product rises with the water volume.
 *
 * Everything below works in millilitres or grams of formulated product, and in
 * litres of water, because that is what a farmer measures at the tank.
 */

export type DoseBasis = 'per_area' | 'per_litre';

/** Sprayers a smallholder is likely to own. */
export interface SprayerOption {
  label: string;
  litres: number;
}

export const SPRAYERS: SprayerOption[] = [
  { label: 'Manual knapsack', litres: 12 },
  { label: 'Battery knapsack', litres: 16 },
  { label: 'Heavy-duty knapsack', litres: 20 },
  { label: 'Power sprayer', litres: 50 },
];

/**
 * Typical spray volumes in litres per acre.
 *
 * Volume is driven by canopy size, not by the product: a knee-high field crop
 * needs far less water to cover than a full orchard tree.
 */
export interface SprayVolumeOption {
  label: string;
  litresPerAcre: number;
  hint: string;
}

export const SPRAY_VOLUMES: SprayVolumeOption[] = [
  { label: 'Low / early crop', litresPerAcre: 120, hint: 'Seedlings and short canopy' },
  { label: 'Standard field crop', litresPerAcre: 200, hint: 'Most vegetables and cereals' },
  { label: 'Dense canopy', litresPerAcre: 300, hint: 'Full crop cover before harvest' },
  { label: 'Orchard / vine', litresPerAcre: 500, hint: 'Trees and trellised vines' },
];

export interface DosageInput {
  areaAcres: number;
  tankLitres: number;
  litresPerAcre: number;
  basis: DoseBasis;
  /** ml or g per acre when basis is `per_area`, per litre when `per_litre`. */
  doseRate: number;
}

export interface DosageResult {
  totalWaterLitres: number;
  /** Whole tanks plus any part tank; what the farmer actually mixes. */
  fullTanks: number;
  partTankLitres: number;
  totalTanks: number;
  /** Product per full tank, in ml or g. */
  productPerTank: number;
  /** Product for the part tank, in ml or g. Zero when tanks divide evenly. */
  productPartTank: number;
  totalProduct: number;
  /** Working concentration, useful as a sanity check against the label. */
  concentrationPerLitre: number;
}

const round = (value: number, dp = 2): number => {
  const factor = 10 ** dp;
  return Math.round(value * factor) / factor;
};

/**
 * Works out the full mixing plan for a field.
 *
 * The part tank is calculated separately rather than rounding tanks up, because
 * filling the last tank as though it were full is exactly how a farmer ends up
 * over-applying on the final strip.
 */
export const calculateDosage = (input: DosageInput): DosageResult => {
  const area = Math.max(0, input.areaAcres);
  const tank = Math.max(1, input.tankLitres);

  const totalWaterLitres = area * input.litresPerAcre;

  const fullTanks = Math.floor(totalWaterLitres / tank);
  const partTankLitres = round(totalWaterLitres - fullTanks * tank, 1);
  const totalTanks = fullTanks + (partTankLitres > 0 ? 1 : 0);

  // Per-area rates fix the total; per-litre rates fix the concentration.
  const totalProduct =
    input.basis === 'per_area' ? input.doseRate * area : input.doseRate * totalWaterLitres;

  const concentrationPerLitre = totalWaterLitres > 0 ? totalProduct / totalWaterLitres : 0;

  return {
    totalWaterLitres: round(totalWaterLitres, 1),
    fullTanks,
    partTankLitres,
    totalTanks,
    productPerTank: round(concentrationPerLitre * tank),
    productPartTank: round(concentrationPerLitre * partTankLitres),
    totalProduct: round(totalProduct),
    concentrationPerLitre: round(concentrationPerLitre, 3),
  };
};

/**
 * Flags mixes that fall outside normal working strength.
 *
 * Most foliar products sit near 0.1-1% (1-10 ml/L). Well outside that usually
 * means the label rate was entered on the wrong basis.
 */
export const dosageWarning = (result: DosageResult): string | null => {
  if (result.totalWaterLitres <= 0) return null;

  if (result.concentrationPerLitre > 15) {
    return 'This works out far stronger than a normal foliar spray. Check whether the label rate is per acre rather than per litre.';
  }
  if (result.concentrationPerLitre > 0 && result.concentrationPerLitre < 0.2) {
    return 'This is a very dilute mix. Check whether the label rate is per litre rather than per acre.';
  }
  return null;
};
