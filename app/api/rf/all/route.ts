import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RFReading } from '@/types';

const DATA_FILE = join(process.cwd(), 'data', 'rf_readings.json');

export async function GET() {
  try {
    const fileContents = readFileSync(DATA_FILE, 'utf-8');
    const data: RFReading[] = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading RF data:', error);
    return NextResponse.json({ error: 'Failed to read RF data' }, { status: 500 });
  }
}

