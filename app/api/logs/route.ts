// app/api/logs/route.ts
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'cookies.json');

  if (!fs.existsSync(filePath)) {
    return NextResponse.json([]);
  }

  const data = fs.readFileSync(filePath, 'utf8');
  const logs = data
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line))
    .reverse(); // latest first

  return NextResponse.json(logs);
}