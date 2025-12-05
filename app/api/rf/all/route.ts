import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { RFReading } from '@/types';

const DATA_FILE = join(process.cwd(), 'data', 'rf_readings.json');

export async function GET() {
  try {
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

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading RF data:', error);
    return NextResponse.json({ error: 'Failed to read RF data' }, { status: 500 });
  }
}

