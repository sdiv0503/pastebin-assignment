import { NextResponse } from 'next/server';
import { redis } from '../../../lib/redis';
// GET /api/healthz
export async function GET() {
  try {
    // Attempt to ping Redis to ensure the connection works
    await redis.ping();
    
    // Return 200 OK if successful
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    // Return 503 Service Unavailable if Redis is down
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}