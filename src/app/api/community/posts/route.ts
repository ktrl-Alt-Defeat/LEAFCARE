import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { REVALIDATE } from '@/lib/api/config';
import { mapCommunityPost } from '@/lib/api/mappers';
import { errorResponse, readLimit } from '@/lib/api/route-helpers';
import type { ApiCommunityPost } from '@/lib/api/types';

/**
 * Community feed.
 *
 * Query params:
 *   category — backend category slug, e.g. `disease_help`
 *   search   — free-text search across posts
 *   limit    — page size
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim();
  const category = searchParams.get('category')?.trim();

  try {
    const { data, meta } = await apiRequest<ApiCommunityPost[]>(
      search ? '/community/search' : '/community/posts',
      {
        searchParams: { limit: readLimit(searchParams, 50), category, q: search },
        revalidate: REVALIDATE.community,
      },
    );

    // Relative timestamps are computed once here so every post in a response is
    // measured against the same instant.
    const now = Date.now();

    return NextResponse.json({
      posts: data.map((post) => mapCommunityPost(post, now)),
      total: meta?.total ?? data.length,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
