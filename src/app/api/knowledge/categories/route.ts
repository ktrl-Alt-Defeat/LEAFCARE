import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/client';
import { REVALIDATE } from '@/lib/api/config';
import { errorResponse, readLang } from '@/lib/api/route-helpers';

interface ApiKnowledgeCategory {
  id: string;
  slug: string;
  category_name?: string;
  description?: string | null;
}

/** Knowledge categories — the admin dashboard files each article under one. */
export async function GET(request: Request) {
  const lang = readLang(new URL(request.url).searchParams);

  try {
    const { data } = await apiRequest<ApiKnowledgeCategory[]>('/knowledge/categories', {
      searchParams: { lang },
      revalidate: REVALIDATE.knowledge,
    });

    return NextResponse.json({
      categories: data.map((category) => ({
        id: category.id,
        slug: category.slug,
        name: category.category_name ?? category.slug,
        description: category.description ?? '',
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
