import { NextRequest, NextResponse } from 'next/server';
import { redis } from '../../../lib/redis';
import { getCurrentTime } from '../../../lib/time';
import { nanoid } from 'nanoid';
import { Paste } from '../../../types/paste';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    // --- Validation Rules ---
    
    // 1. Content is required and must be a string
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // 2. TTL is optional, but if present must be integer >= 1
    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json({ error: 'Invalid ttl_seconds' }, { status: 400 });
      }
    }

    // 3. max_views is optional, but if present must be integer >= 1
    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json({ error: 'Invalid max_views' }, { status: 400 });
      }
    }

    // --- Logic ---

    // Generate a unique short ID (8 chars is usually plenty)
    const id = nanoid(8);
    
    // Get the current time (handling test mode automatically)
    const now = await getCurrentTime();

    // Calculate expiry timestamp
    // If ttl_seconds exists, add it to 'now'. Otherwise null.
    const expires_at = ttl_seconds ? now + (ttl_seconds * 1000) : null;

    // Construct the Paste object
    const paste: Paste = {
      id,
      content,
      created_at: now,
      expires_at,
      max_views: max_views ?? null, // Use null if undefined
      remaining_views: max_views ?? null, // Initially same as max_views
    };

    // --- Persistence ---
    // Save to Redis.
    // Key: "paste:abc12345"
    // Value: The stringified JSON object
    
    // Note: We generally do NOT use Redis EXPIRE here because the assignment 
    // requires us to serve the paste until the *simulated* time in the header passes.
    // If we used Redis EXPIRE, the key might delete itself based on real time, 
    // breaking the test cases.
    
    await redis.set(`paste:${id}`, JSON.stringify(paste));

    // Return success
    // The requirement says return the ID and the full URL
    const baseUrl = req.nextUrl.origin; // e.g. http://localhost:3000 or https://your-app.vercel.app
    
    return NextResponse.json({
      id,
      url: `${baseUrl}/p/${id}`
    }, { status: 200 });

  } catch (error) {
    console.error('Create paste error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}