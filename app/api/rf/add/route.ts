import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { RFReading } from '@/types';

const DATA_FILE = join(process.cwd(), 'data', 'rf_readings.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Read existing data
    const fileContents = readFileSync(DATA_FILE, 'utf-8');
    const data: RFReading[] = JSON.parse(fileContents);
    
    // Create new reading with required fields
    const newReading: RFReading = {
      id: body.id || `ESP32-${Date.now()}`,
      device_id: body.device_id || body.deviceId || 'ESP32-001',
      lat: body.lat || body.latitude || 0,
      lng: body.lng || body.longitude || body.lon || 0,
      rf_dbm: body.rf_dbm || body.rssi || body.RSSI || -100,
      rssi: body.rssi || body.RSSI || body.rf_dbm || -100,
      noise_floor: body.noise_floor || body.noiseFloor || body.noise || -100,
      snr: body.snr || body.SNR || (body.rssi - (body.noise_floor || body.noiseFloor || -100)),
      frequency: body.frequency || body.freq || 2412,
      timestamp: body.timestamp || new Date().toISOString(),
      battery: body.battery || body.batteryLevel || undefined,
    };
    
    // Append to array
    data.push(newReading);
    
    // Write back to file
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, data: newReading }, { status: 201 });
  } catch (error) {
    console.error('Error adding RF reading:', error);
    return NextResponse.json({ error: 'Failed to add RF reading' }, { status: 500 });
  }
}

