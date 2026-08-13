import { NextResponse } from 'next/server';
import {
  FORECAST_REVALIDATE_SECONDS,
  OpenMeteoError,
  geocodeLocation,
  getWeatherBundle,
} from '@/lib/open-meteo';

/**
 * Weather endpoint backed by Open-Meteo.
 *
 * Running the upstream calls here rather than in the browser means Next's fetch
 * cache is in play: many farmers on the same district share one cached upstream
 * response instead of each hitting the API.
 *
 * Query params:
 *   lat, lon  — device coordinates (preferred)
 *   place     — place name, geocoded through Open-Meteo when coordinates are absent
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const latParam = searchParams.get('lat');
  const lonParam = searchParams.get('lon');
  const place = searchParams.get('place');

  try {
    const latitude = latParam === null ? NaN : Number(latParam);
    const longitude = lonParam === null ? NaN : Number(lonParam);
    const hasCoordinates =
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      Math.abs(latitude) <= 90 &&
      Math.abs(longitude) <= 180;

    if (hasCoordinates) {
      const bundle = await getWeatherBundle({
        latitude,
        longitude,
        name: place?.trim() || 'Current location',
        fromDevice: true,
      });
      return NextResponse.json(bundle, {
        headers: { 'Cache-Control': `public, max-age=0, s-maxage=${FORECAST_REVALIDATE_SECONDS}` },
      });
    }

    if (!place?.trim()) {
      return NextResponse.json(
        { error: 'Provide either lat and lon, or a place name.' },
        { status: 400 }
      );
    }

    const match = await geocodeLocation(place);
    if (!match) {
      return NextResponse.json(
        { error: `No location found for “${place.trim()}”.` },
        { status: 404 }
      );
    }

    const bundle = await getWeatherBundle({
      latitude: match.latitude,
      longitude: match.longitude,
      name: match.name,
      region: match.admin1,
      country: match.country,
      fromDevice: false,
    });

    return NextResponse.json(bundle, {
      headers: { 'Cache-Control': `public, max-age=0, s-maxage=${FORECAST_REVALIDATE_SECONDS}` },
    });
  } catch (error) {
    const message =
      error instanceof OpenMeteoError ? error.message : 'Unable to load weather right now.';
    console.error('Weather route failed:', error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
