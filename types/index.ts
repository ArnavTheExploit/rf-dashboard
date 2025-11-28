export interface RFReading {
    id: string;
    device_id: string;
    lat: number;
    lng: number;
    rf_dbm: number;
    timestamp: string;
    battery?: number;
    frequency: number;
    rssi: number;
    noise_floor: number;
    snr?: number;
}
