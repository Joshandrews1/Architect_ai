
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'This API route is deprecated. Please use /api/live-assistant/conversation.' },
    { status: 410 } // 410 Gone
  );
}
