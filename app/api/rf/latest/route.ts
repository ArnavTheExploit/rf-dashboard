import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RFReading } from '@/types';

const DATA_FILE = join(process.cwd(), 'data', 'rf_readings.json');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    const fileContents = readFileSync(DATA_FILE, 'utf-8');
    const data: RFReading[] = JSON.parse(fileContents);
    
    // Sort by timestamp descending and take the latest N entries
    const sorted = data.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return NextResponse.json(sorted.slice(0, limit));
  } catch (error) {
    console.error('Error reading latest RF data:', error);
    return NextResponse.json({ error: 'Failed to read latest RF data' }, { status: 500 });
  }
}

