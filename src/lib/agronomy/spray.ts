/**
 * Spray suitability assessment.
 *
 * Built on Delta T — the gap between dry-bulb and wet-bulb temperature — which
 * is the standard index for deciding whether conditions suit spraying. Delta T
 * captures evaporation risk in a single number: a fine droplet leaving the
 * nozzle in high Delta T shrinks before it reaches the leaf, so the product
 * drifts away instead of landing.
 *
 * Delta T alone is not sufficient, so wind and rain are assessed alongside it:
 *   - Too little wind signals a temperature inversion, where fine droplets hang
 *     in still air and move off-target later. Calm is not safe, it is dangerous.
 *   - Too much wind causes immediate drift.
 *   - Rain too soon after spraying washes the product off before it is absorbed.
 */

import { HourlyForecastEntry } from '@/lib/open-meteo';

export type SprayVerdict = 'ideal' | 'marginal' | 'unsuitable';

export interface SprayAssessment {
  verdict: SprayVerdict;
  deltaT: number;
  /** Ordered worst-first, so the first entry is the limiting factor. */
  reasons: string[];
}

export interface SprayHour extends SprayAssessment {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitationProbability: number;
}

/* -------------------------------------------------------------------------- */
/* Thresholds                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Delta T bands in °C, as used in standard spray guidance.
 * Below 2 the air is close to saturated and droplets stay airborne; above 10
 * evaporation is severe enough that much of the spray never lands.
 */
const DELTA_T_IDEAL_MIN = 2;
const DELTA_T_IDEAL_MAX = 8;
const DELTA_T_MARGINAL_MAX = 10;

/** Wind in km/h. Below 3 is inversion territory, not "perfectly calm". */
const WIND_INVERSION_MAX = 3;
const WIND_IDEAL_MAX = 15;
const WIND_UNSUITABLE = 20;

/** Rain probability that makes wash-off likely. */
const RAIN_RISK_PCT = 50;
/** Hours a product typically needs on the leaf before rain stops mattering. */
export const RAINFAST_HOURS = 2;

const TEMP_HIGH_C = 30;

/* -------------------------------------------------------------------------- */
/* Wet bulb and Delta T                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Wet-bulb temperature from dry-bulb temperature and relative humidity, using
 * Stull's empirical approximation.
 *
 * Accurate to roughly ±0.3 °C over the range that matters for spraying, and it
 * needs no pressure input — which the forecast may not carry per hour.
 */
export const wetBulbTemperature = (temperatureC: number, relativeHumidityPct: number): number => {
  const rh = Math.min(100, Math.max(0, relativeHumidityPct));
  const t = temperatureC;

  return (
    t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
    Math.atan(t + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035
  );
};

/** Delta T in °C. Higher means faster droplet evaporation. */
export const deltaT = (temperatureC: number, relativeHumidityPct: number): number =>
  temperatureC - wetBulbTemperature(temperatureC, relativeHumidityPct);

/* -------------------------------------------------------------------------- */
/* Assessment                                                                 */
/* -------------------------------------------------------------------------- */

const RANK: Record<SprayVerdict, number> = { ideal: 0, marginal: 1, unsuitable: 2 };

const worst = (a: SprayVerdict, b: SprayVerdict): SprayVerdict => (RANK[b] > RANK[a] ? b : a);

/**
 * Grades one set of conditions.
 *
 * `rainSoonPct` is the highest rain probability across the rainfast window
 * after this hour, not the probability during it — spraying just before rain is
 * the mistake worth catching.
 */
export const assessSprayConditions = (input: {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainSoonPct: number;
}): SprayAssessment => {
  const dt = deltaT(input.temperature, input.humidity);
  const reasons: string[] = [];
  let verdict: SprayVerdict = 'ideal';

  if (dt > DELTA_T_MARGINAL_MAX) {
    verdict = worst(verdict, 'unsuitable');
    reasons.push(`Delta T ${dt.toFixed(1)} — droplets evaporate before reaching the leaf`);
  } else if (dt > DELTA_T_IDEAL_MAX) {
    verdict = worst(verdict, 'marginal');
    reasons.push(`Delta T ${dt.toFixed(1)} — use coarse droplets and keep the boom low`);
  } else if (dt < DELTA_T_IDEAL_MIN) {
    verdict = worst(verdict, 'unsuitable');
    reasons.push(`Delta T ${dt.toFixed(1)} — air near saturation, spray will not dry onto the leaf`);
  }

  if (input.windSpeed >= WIND_UNSUITABLE) {
    verdict = worst(verdict, 'unsuitable');
    reasons.push(`Wind ${Math.round(input.windSpeed)} km/h — too strong, spray will drift off-target`);
  } else if (input.windSpeed > WIND_IDEAL_MAX) {
    verdict = worst(verdict, 'marginal');
    reasons.push(`Wind ${Math.round(input.windSpeed)} km/h — spray low and use coarse nozzles`);
  } else if (input.windSpeed < WIND_INVERSION_MAX) {
    // Deliberately flagged: still air is the classic inversion trap.
    verdict = worst(verdict, 'unsuitable');
    reasons.push(
      `Wind ${Math.round(input.windSpeed)} km/h — too still, risk of temperature inversion carrying spray away`,
    );
  }

  if (input.rainSoonPct >= RAIN_RISK_PCT) {
    verdict = worst(verdict, 'unsuitable');
    reasons.push(`${Math.round(input.rainSoonPct)}% rain within ${RAINFAST_HOURS}h — product will wash off`);
  }

  if (input.temperature > TEMP_HIGH_C) {
    verdict = worst(verdict, 'marginal');
    reasons.push(`${Math.round(input.temperature)} °C — heat increases evaporation and crop stress`);
  }

  if (reasons.length === 0) {
    reasons.push(`Delta T ${dt.toFixed(1)} and wind ${Math.round(input.windSpeed)} km/h are both in range`);
  }

  // Worst first, so the caller can show the limiting factor without sorting.
  reasons.sort((a, b) => Number(b.includes('—')) - Number(a.includes('—')));

  return { verdict, deltaT: Number(dt.toFixed(1)), reasons };
};

/**
 * Grades each forecast hour, looking ahead for rain so an hour that is calm and
 * dry but sits two hours before a downpour is still marked unsuitable.
 */
export const buildSprayWindow = (hourly: HourlyForecastEntry[]): SprayHour[] =>
  hourly.map((hour, index) => {
    const lookahead = hourly.slice(index + 1, index + 1 + RAINFAST_HOURS);
    const rainSoonPct = Math.max(
      hour.precipitationProbability,
      ...lookahead.map((entry) => entry.precipitationProbability),
      0,
    );

    return {
      time: hour.time,
      temperature: hour.temperature,
      humidity: hour.humidity,
      windSpeed: hour.windSpeed,
      precipitationProbability: hour.precipitationProbability,
      ...assessSprayConditions({
        temperature: hour.temperature,
        humidity: hour.humidity,
        windSpeed: hour.windSpeed,
        rainSoonPct,
      }),
    };
  });

/** The next run of ideal hours, or null when none of the forecast qualifies. */
export const nextSprayWindow = (hours: SprayHour[]): { start: SprayHour; length: number } | null => {
  const startIndex = hours.findIndex((hour) => hour.verdict === 'ideal');
  if (startIndex === -1) return null;

  let length = 0;
  while (hours[startIndex + length]?.verdict === 'ideal') length += 1;

  return { start: hours[startIndex], length };
};
