import { NextRequest, NextResponse } from 'next/server';
import { getPaste } from '@/lib/paste-service';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // In Next.js 15+, params is a Promise, so we must await it
  const { id } = await params;

  const paste = await getPaste(id);

  if (!paste) {
    return NextResponse.json(
      { error: 'Paste not found or unavailable' }, 
      { status: 404 }
    );
  }

  return NextResponse.json(paste, { status: 200 });
}