/**
 * Open-Meteo is the single source of truth for every piece of weather data in
 * this app. All request building, typing and normalisation lives here so no
 * component ever talks to the API directly.
 *
 * Docs: https://open-meteo.com/en/docs
 */

const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_ENDPOINT = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';

/** Forecasts update roughly every 15 minutes upstream. */
export const FORECAST_REVALIDATE_SECONDS = 900;
/** Air quality moves slower and the endpoint is hourly. */
export const AIR_QUALITY_REVALIDATE_SECONDS = 1800;
/** Place coordinates effectively never change. */
export const GEOCODING_REVALIDATE_SECONDS = 60 * 60 * 24 * 30;

/* -------------------------------------------------------------------------- */
/* Raw API response types                                                     */
/* -------------------------------------------------------------------------- */

export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
  elevation: number;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: 0 | 1;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    uv_index: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export interface OpenMeteoAirQualityResponse {
  current?: {
    time: string;
    european_aqi: number | null;
    us_aqi: number | null;
    pm10: number | null;
    pm2_5: number | null;
  };
}

export interface OpenMeteoGeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
}

/* -------------------------------------------------------------------------- */
/* Normalised domain types consumed by the UI                                 */
/* -------------------------------------------------------------------------- */

export type SprayingCondition = 'Optimal' | 'Favorable' | 'Unfavorable';

export interface WeatherCondition {
  code: number;
  label: string;
  icon: string;
  /** Broad grouping, handy for styling. */
  group: 'clear' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  windDirectionLabel: string;
  windGusts: number;
  cloudCover: number;
  pressure: number;
  isDay: boolean;
  condition: WeatherCondition;
  observedAt: string;
}

export interface HourlyForecastEntry {
  time: string;
  temperature: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  uvIndex: number;
  condition: WeatherCondition;
}

export interface DailyForecastEntry {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
  condition: WeatherCondition;
}

export interface AirQuality {
  europeanAqi: number | null;
  usAqi: number | null;
  pm10: number | null;
  pm25: number | null;
  label: string;
  tone: 'good' | 'fair' | 'moderate' | 'poor' | 'very-poor';
}

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  name: string;
  region?: string;
  country?: string;
  timezone: string;
  /** True when the coordinates came from the device rather than a place lookup. */
  fromDevice: boolean;
}

export interface WeatherBundle {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyForecastEntry[];
  daily: DailyForecastEntry[];
  airQuality: AirQuality | null;
  /** Farm-specific advice derived from wind, rain and humidity. */
  spraying: {
    condition: SprayingCondition;
    reason: string;
  };
  fetchedAt: string;
}

/* -------------------------------------------------------------------------- */
/* WMO weather code mapping                                                   */
/* -------------------------------------------------------------------------- */

interface WeatherCodeEntry {
  label: string;
  group: WeatherCondition['group'];
  day: string;
  night?: string;
}

/** WMO 4677 codes as published in the Open-Meteo docs. */
const WEATHER_CODES: Record<number, WeatherCodeEntry> = {
  0: { label: 'Clear sky', group: 'clear', day: '☀️', night: '🌙' },
  1: { label: 'Mainly clear', group: 'clear', day: '🌤️', night: '🌙' },
  2: { label: 'Partly cloudy', group: 'cloud', day: '⛅', night: '☁️' },
  3: { label: 'Overcast', group: 'cloud', day: '☁️' },
  45: { label: 'Fog', group: 'fog', day: '🌫️' },
  48: { label: 'Depositing rime fog', group: 'fog', day: '🌫️' },
  51: { label: 'Light drizzle', group: 'drizzle', day: '🌦️' },
  53: { label: 'Moderate drizzle', group: 'drizzle', day: '🌦️' },
  55: { label: 'Dense drizzle', group: 'drizzle', day: '🌧️' },
  56: { label: 'Light freezing drizzle', group: 'drizzle', day: '🌧️' },
  57: { label: 'Dense freezing drizzle', group: 'drizzle', day: '🌧️' },
  61: { label: 'Slight rain', group: 'rain', day: '🌦️' },
  63: { label: 'Moderate rain', group: 'rain', day: '🌧️' },
  65: { label: 'Heavy rain', group: 'rain', day: '🌧️' },
  66: { label: 'Light freezing rain', group: 'rain', day: '🌧️' },
  67: { label: 'Heavy freezing rain', group: 'rain', day: '🌧️' },
  71: { label: 'Slight snowfall', group: 'snow', day: '🌨️' },
  73: { label: 'Moderate snowfall', group: 'snow', day: '🌨️' },
  75: { label: 'Heavy snowfall', group: 'snow', day: '❄️' },
  77: { label: 'Snow grains', group: 'snow', day: '🌨️' },
  80: { label: 'Slight rain showers', group: 'rain', day: '🌦️' },
  81: { label: 'Moderate rain showers', group: 'rain', day: '🌧️' },
  82: { label: 'Violent rain showers', group: 'rain', day: '⛈️' },
  85: { label: 'Slight snow showers', group: 'snow', day: '🌨️' },
  86: { label: 'Heavy snow showers', group: 'snow', day: '❄️' },
  95: { label: 'Thunderstorm', group: 'storm', day: '⛈️' },
  96: { label: 'Thunderstorm with slight hail', group: 'storm', day: '⛈️' },
  99: { label: 'Thunderstorm with heavy hail', group: 'storm', day: '⛈️' },
};

export const describeWeatherCode = (code: number, isDay = true): WeatherCondition => {
  const entry = WEATHER_CODES[code];

  if (!entry) {
    return { code, label: 'Unknown conditions', icon: '🌡️', group: 'cloud' };
  }

  return {
    code,
    label: entry.label,
    icon: !isDay && entry.night ? entry.night : entry.day,
    group: entry.group,
  };
};

const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export const describeWindDirection = (degrees: number): string =>
  COMPASS_POINTS[Math.round(degrees / 45) % 8];

/* -------------------------------------------------------------------------- */
/* Derived agricultural guidance                                              */
/* -------------------------------------------------------------------------- */

/**
 * Spray advice from real measurements: drift rises with wind, rain washes the
 * product off, and very dry air evaporates droplets before they land.
 */
const evaluateSpraying = (
  current: CurrentWeather,
  nextHours: HourlyForecastEntry[]
): WeatherBundle['spraying'] => {
  const rainSoon = nextHours.some((hour) => hour.precipitationProbability >= 60);
  const maxWind = Math.max(current.windSpeed, ...nextHours.map((hour) => hour.windSpeed));

  if (current.precipitation > 0.2 || rainSoon) {
    return { condition: 'Unfavorable', reason: 'Rain expected within 6 hours' };
  }
  if (maxWind > 20) {
    return { condition: 'Unfavorable', reason: `Wind up to ${Math.round(maxWind)} km/h causes drift` };
  }
  if (current.humidity < 40) {
    return { condition: 'Favorable', reason: 'Dry air — droplets evaporate quickly' };
  }
  if (maxWind > 12) {
    return { condition: 'Favorable', reason: 'Breezy — spray low and use coarse nozzles' };
  }
  return { condition: 'Optimal', reason: 'Low wind and no rain expected' };
};

const AQI_BANDS: Array<{ max: number; label: string; tone: AirQuality['tone'] }> = [
  { max: 20, label: 'Good', tone: 'good' },
  { max: 40, label: 'Fair', tone: 'fair' },
  { max: 60, label: 'Moderate', tone: 'moderate' },
  { max: 80, label: 'Poor', tone: 'poor' },
  { max: Infinity, label: 'Very poor', tone: 'very-poor' },
];

const describeAqi = (europeanAqi: number | null): { label: string; tone: AirQuality['tone'] } => {
  if (europeanAqi === null) return { label: 'Unavailable', tone: 'good' };
  const band = AQI_BANDS.find((entry) => europeanAqi <= entry.max) ?? AQI_BANDS[AQI_BANDS.length - 1];
  // Destructured rather than spread: `max` is an internal threshold and must not
  // leak into the API response.
  return { label: band.label, tone: band.tone };
};

/* -------------------------------------------------------------------------- */
/* Fetch helpers                                                              */
/* -------------------------------------------------------------------------- */

export class OpenMeteoError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = 'OpenMeteoError';
  }
}

const buildUrl = (endpoint: string, params: Record<string, string | number>): string => {
  const url = new URL(endpoint);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
};

/**
 * `next.revalidate` is honoured when this runs on the server (route handlers,
 * server components) and harmlessly ignored in the browser.
 */
const requestJson = async <T>(url: string, revalidate: number): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(url, { next: { revalidate } });
  } catch (cause) {
    throw new OpenMeteoError(
      `Could not reach Open-Meteo: ${cause instanceof Error ? cause.message : 'network error'}`
    );
  }

  if (!response.ok) {
    throw new OpenMeteoError(`Open-Meteo responded with ${response.status}`, response.status);
  }

  return (await response.json()) as T;
};

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

/** Resolves a place name to coordinates. Returns null when nothing matches. */
export const geocodeLocation = async (
  query: string
): Promise<OpenMeteoGeocodingResult | null> => {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const data = await requestJson<OpenMeteoGeocodingResponse>(
    buildUrl(GEOCODING_ENDPOINT, { name: trimmed, count: 1, language: 'en', format: 'json' }),
    GEOCODING_REVALIDATE_SECONDS
  );

  return data.results?.[0] ?? null;
};

export const fetchForecast = async (
  latitude: number,
  longitude: number
): Promise<OpenMeteoForecastResponse> =>
  requestJson<OpenMeteoForecastResponse>(
    buildUrl(FORECAST_ENDPOINT, {
      latitude: latitude.toFixed(4),
      longitude: longitude.toFixed(4),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'uv_index',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'uv_index_max',
        'sunrise',
        'sunset',
      ].join(','),
      timezone: 'auto',
      forecast_days: 7,
    }),
    FORECAST_REVALIDATE_SECONDS
  );

export const fetchAirQuality = async (
  latitude: number,
  longitude: number
): Promise<OpenMeteoAirQualityResponse> =>
  requestJson<OpenMeteoAirQualityResponse>(
    buildUrl(AIR_QUALITY_ENDPOINT, {
      latitude: latitude.toFixed(4),
      longitude: longitude.toFixed(4),
      current: ['european_aqi', 'us_aqi', 'pm10', 'pm2_5'].join(','),
      timezone: 'auto',
      forecast_days: 1,
    }),
    AIR_QUALITY_REVALIDATE_SECONDS
  );

/* -------------------------------------------------------------------------- */
/* Normalisation                                                              */
/* -------------------------------------------------------------------------- */

const toHourlyEntries = (forecast: OpenMeteoForecastResponse): HourlyForecastEntry[] => {
  const { hourly } = forecast;
  return hourly.time.map((time, index) => ({
    time,
    temperature: hourly.temperature_2m[index],
    humidity: hourly.relative_humidity_2m[index],
    precipitationProbability: hourly.precipitation_probability[index] ?? 0,
    precipitation: hourly.precipitation[index] ?? 0,
    windSpeed: hourly.wind_speed_10m[index],
    uvIndex: hourly.uv_index[index] ?? 0,
    condition: describeWeatherCode(hourly.weather_code[index]),
  }));
};

const toDailyEntries = (forecast: OpenMeteoForecastResponse): DailyForecastEntry[] => {
  const { daily } = forecast;
  return daily.time.map((date, index) => ({
    date,
    temperatureMax: daily.temperature_2m_max[index],
    temperatureMin: daily.temperature_2m_min[index],
    precipitationSum: daily.precipitation_sum[index] ?? 0,
    precipitationProbability: daily.precipitation_probability_max[index] ?? 0,
    windSpeedMax: daily.wind_speed_10m_max[index],
    uvIndexMax: daily.uv_index_max[index] ?? 0,
    sunrise: daily.sunrise[index],
    sunset: daily.sunset[index],
    condition: describeWeatherCode(daily.weather_code[index]),
  }));
};

/** Hours from now onwards — the API always returns the full day from midnight. */
const upcomingHours = (
  entries: HourlyForecastEntry[],
  fromIso: string,
  count: number
): HourlyForecastEntry[] => {
  const startIndex = entries.findIndex((entry) => entry.time >= fromIso);
  const safeIndex = startIndex === -1 ? 0 : startIndex;
  return entries.slice(safeIndex, safeIndex + count);
};

/**
 * Composes one request bundle for the UI: current conditions, forecasts,
 * air quality and derived spraying guidance.
 */
export const getWeatherBundle = async (
  location: Pick<WeatherLocation, 'latitude' | 'longitude'> &
    Partial<Omit<WeatherLocation, 'latitude' | 'longitude'>>
): Promise<WeatherBundle> => {
  const [forecast, airQualityResponse] = await Promise.all([
    fetchForecast(location.latitude, location.longitude),
    // Air quality is a bonus signal — never fail the whole bundle over it.
    fetchAirQuality(location.latitude, location.longitude).catch(() => null),
  ]);

  const hourly = toHourlyEntries(forecast);
  const daily = toDailyEntries(forecast);

  const current: CurrentWeather = {
    temperature: forecast.current.temperature_2m,
    apparentTemperature: forecast.current.apparent_temperature,
    humidity: forecast.current.relative_humidity_2m,
    precipitation: forecast.current.precipitation,
    windSpeed: forecast.current.wind_speed_10m,
    windDirection: forecast.current.wind_direction_10m,
    windDirectionLabel: describeWindDirection(forecast.current.wind_direction_10m),
    windGusts: forecast.current.wind_gusts_10m,
    cloudCover: forecast.current.cloud_cover,
    pressure: forecast.current.surface_pressure,
    isDay: forecast.current.is_day === 1,
    condition: describeWeatherCode(forecast.current.weather_code, forecast.current.is_day === 1),
    observedAt: forecast.current.time,
  };

  const nextHours = upcomingHours(hourly, forecast.current.time, 6);

  const aqiCurrent = airQualityResponse?.current;
  const airQuality: AirQuality | null = aqiCurrent
    ? {
        europeanAqi: aqiCurrent.european_aqi,
        usAqi: aqiCurrent.us_aqi,
        pm10: aqiCurrent.pm10,
        pm25: aqiCurrent.pm2_5,
        ...describeAqi(aqiCurrent.european_aqi),
      }
    : null;

  return {
    location: {
      latitude: forecast.latitude,
      longitude: forecast.longitude,
      name: location.name ?? 'Current location',
      region: location.region,
      country: location.country,
      timezone: forecast.timezone,
      fromDevice: location.fromDevice ?? false,
    },
    current,
    hourly: upcomingHours(hourly, forecast.current.time, 24),
    daily,
    airQuality,
    spraying: evaluateSpraying(current, nextHours),
    fetchedAt: new Date().toISOString(),
  };
};
