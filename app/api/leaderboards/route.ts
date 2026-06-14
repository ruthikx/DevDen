import { NextRequest, NextResponse } from 'next/server';
import { getTopDevelopers } from '@/app/actions/projects';

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit') || 25);
  const result = await getTopDevelopers(Number.isFinite(limit) ? limit : 25);

  if (!result.success) {
    return NextResponse.json({ error: 'Failed to load leaderboards' }, { status: 500 });
  }

  return NextResponse.json({
    developers: result.developers,
  });
}
