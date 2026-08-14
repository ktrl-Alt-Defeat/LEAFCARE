export type PesticideFormulation = 'liquid' | 'solid';

export interface PesticideCalculatorInputs {
  formulation: PesticideFormulation;
  recommendedDose: string; // Keep as string for controlled input handling
  sprayVolume: string;     // Keep as string for controlled input handling
  tankCapacity: string;    // Keep as string for controlled input handling
}

export interface PesticideCalculationResult {
  formulation: PesticideFormulation;
  recommendedDose: number;
  sprayVolume: number;
  tankCapacity: number;
  pesticideRequired: number; // Value per tank
  unit: 'mL' | 'g';
  doseUnit: 'mL/acre' | 'g/acre';
  volumeUnit: 'L/acre';
  tankUnit: 'L';
  displaySummary: string; // e.g. "Required pesticide: 32 mL per 16 L tank"
}

export interface PesticideValidationErrors {
  recommendedDose?: string;
  sprayVolume?: string;
  tankCapacity?: string;
}

/**
 * Validates user inputs for the pesticide dosage calculator.
 * All fields are required, must be valid positive numbers (> 0).
 */
export function validatePesticideInputs(
  inputs: PesticideCalculatorInputs
): { isValid: boolean; errors: PesticideValidationErrors } {
  const errors: PesticideValidationErrors = {};
  const doseLabel = inputs.formulation === 'liquid' ? 'mL/acre' : 'g/acre';

  // Validate Recommended Dose
  const doseTrimmed = inputs.recommendedDose.trim();
  if (!doseTrimmed) {
    errors.recommendedDose = `Please enter the recommended dose (${doseLabel}).`;
  } else {
    const doseNum = Number(doseTrimmed);
    if (isNaN(doseNum) || doseNum <= 0) {
      errors.recommendedDose = 'Recommended dose must be greater than 0.';
    }
  }

  // Validate Water Volume
  const volumeTrimmed = inputs.sprayVolume.trim();
  if (!volumeTrimmed) {
    errors.sprayVolume = 'Please enter the water volume (L/acre).';
  } else {
    const volumeNum = Number(volumeTrimmed);
    if (isNaN(volumeNum) || volumeNum <= 0) {
      errors.sprayVolume = 'Water volume must be greater than 0.';
    }
  }

  // Validate Sprayer Size
  const tankTrimmed = inputs.tankCapacity.trim();
  if (!tankTrimmed) {
    errors.tankCapacity = 'Please enter your sprayer size (L/tank).';
  } else {
    const tankNum = Number(tankTrimmed);
    if (isNaN(tankNum) || tankNum <= 0) {
      errors.tankCapacity = 'Sprayer size must be greater than 0.';
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
}

/**
 * Single calculation function for BOTH liquid and solid pesticides:
 * Pesticide Required Per Tank = (Recommended Dose Per Acre × Tank Capacity) / Spray Volume Per Acre
 *
 * For Liquid: unit is mL/tank
 * For Solid: unit is g/tank
 */
export function calculatePesticideDosage(
  inputs: PesticideCalculatorInputs
): PesticideCalculationResult {
  const validation = validatePesticideInputs(inputs);
  if (!validation.isValid) {
    throw new Error('Cannot calculate with invalid inputs');
  }

  const dose = Number(inputs.recommendedDose.trim());
  const volume = Number(inputs.sprayVolume.trim());
  const tank = Number(inputs.tankCapacity.trim());

  // Formula
  const required = (dose * tank) / volume;

  // Round neatly to max 2 decimal places if fractional, or integer if whole
  const roundedRequired = Math.round((required + Number.EPSILON) * 100) / 100;

  const unit: 'mL' | 'g' = inputs.formulation === 'liquid' ? 'mL' : 'g';
  const doseUnit: 'mL/acre' | 'g/acre' = inputs.formulation === 'liquid' ? 'mL/acre' : 'g/acre';

  return {
    formulation: inputs.formulation,
    recommendedDose: dose,
    sprayVolume: volume,
    tankCapacity: tank,
    pesticideRequired: roundedRequired,
    unit,
    doseUnit,
    volumeUnit: 'L/acre',
    tankUnit: 'L',
    displaySummary: `Required pesticide: ${roundedRequired} ${unit} per ${tank} L tank`,
  };
}
