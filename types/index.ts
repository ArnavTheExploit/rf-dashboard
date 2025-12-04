export interface RFReading {
    device_id: string;
    device_name: string;
    latitude: number;
    longitude: number;
    battery_percentage: number;
    noise_floor: number;
    rssi: number;
    signal_strength: number;
    frequency: number;
    timestamp: string;
    // Optional legacy fields for compatibility during transition if needed, 
    // but I will update components to use the new ones.
    id: string;
    lat: number;
    lng: number;
    rf_dbm?: number;
    snr?: number;
    battery?: number;
}
