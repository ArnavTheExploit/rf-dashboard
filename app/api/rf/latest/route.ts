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
    let data: RFReading[] = JSON.parse(fileContents);

    // Add random variations to simulate real-time changes
    data = data.map(reading => {
      // Random fluctuation function
      const fluctuate = (value: number, range: number) => {
        const delta = (Math.random() * range * 2) - range;
        return Math.round(value + delta);
      };

      return {
        ...reading,
        rssi: fluctuate(reading.rssi, 5), // +/- 5 dBm
        noise_floor: fluctuate(reading.noise_floor, 2), // +/- 2 dBm
        signal_strength: Math.max(0, Math.min(100, fluctuate(reading.signal_strength, 5))), // 0-100%
        battery_percentage: Math.max(0, Math.min(100, fluctuate(reading.battery_percentage, 1))), // +/- 1%
        timestamp: new Date().toISOString() // Update timestamp to now
      };
    });

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

