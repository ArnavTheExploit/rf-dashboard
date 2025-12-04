'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { RFReading } from '@/types';
import { useVoiceAssistant, generateExplanation } from '@/components/VoiceAssistant';

// Fix for default marker icons in Next.js/Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapComponentProps {
    data: RFReading[];
    selectedParam?: string;
}

// Component to ensure map is properly initialized
const MapInitializer = () => {
    const map = useMap();

    useEffect(() => {
        // Force map to recalculate size after container is ready
        const timer1 = setTimeout(() => {
            if (map && map.getContainer()) {
                try {
                    map.invalidateSize();
                    // Force a view update to trigger tile loading
                    const center = map.getCenter();
                    const zoom = map.getZoom();
                    map.setView(center, zoom, { animate: false });
                } catch (e) {
                    console.warn('Map initialization error:', e);
                }
            }
        }, 150);

        // Additional resize after a longer delay to catch any layout shifts
        const timer2 = setTimeout(() => {
            if (map && map.getContainer()) {
                try {
                    map.invalidateSize();
                    const center = map.getCenter();
                    const zoom = map.getZoom();
                    map.setView(center, zoom, { animate: false });
                } catch (e) {
                    console.warn('Map resize error:', e);
                }
            }
        }, 600);

        // Final check after 1.2 seconds
        const timer3 = setTimeout(() => {
            if (map && map.getContainer()) {
                try {
                    map.invalidateSize();
                } catch (e) {
                    console.warn('Map final resize error:', e);
                }
            }
        }, 1200);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [map]);

    return null;
};

const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
    const map = useMap();
    const heatLayerRef = useRef<L.Layer | null>(null);

    useEffect(() => {
        // Check if map is available
        if (!map) {
            return;
        }

        try {
            if (heatLayerRef.current && map.hasLayer(heatLayerRef.current)) {
                map.removeLayer(heatLayerRef.current);
            }

            // Check if heatLayer is available (leaflet.heat extends L namespace)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!(L as any).heatLayer) {
                console.error('Leaflet.heat plugin not loaded');
                return;
            }

            // Filter out invalid points
            const validPoints = points.filter(p =>
                Array.isArray(p) &&
                p.length === 3 &&
                !isNaN(p[0]) &&
                !isNaN(p[1]) &&
                !isNaN(p[2])
            );

            if (validPoints.length === 0) {
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const layer = (L as any).heatLayer(validPoints, {
                radius: 25,
                blur: 15,
                maxZoom: 17,
                max: 1.0, // Normalized intensity is between 0 and 1
                minOpacity: 0.4,
                gradient: {
                    0.4: 'blue',
                    0.6: 'cyan',
                    0.7: 'lime',
                    0.8: 'yellow',
                    1.0: 'red'
                }
            });

            if (layer) {
                // Safe add function to prevent "source height is 0" error
                let retryCount = 0;
                const maxRetries = 20; // Maximum 2 seconds of retries

                const safeAddLayer = () => {
                    try {
                        // Check if map is still available and has valid size
                        if (!map || !map.getContainer()) {
                            if (retryCount < maxRetries) {
                                retryCount++;
                                setTimeout(safeAddLayer, 100);
                            }
                            return;
                        }

                        const size = map.getSize();
                        if (size && size.y > 0 && size.x > 0) {
                            layer.addTo(map);
                            heatLayerRef.current = layer;
                        } else {
                            if (retryCount < maxRetries) {
                                retryCount++;
                                // Only call invalidateSize if map is ready
                                if (map && typeof map.invalidateSize === 'function') {
                                    map.invalidateSize();
                                }
                                setTimeout(safeAddLayer, 100);
                            }
                        }
                    } catch (err) {
                        console.error('Error in safeAddLayer:', err);
                        if (retryCount < maxRetries) {
                            retryCount++;
                            setTimeout(safeAddLayer, 100);
                        }
                    }
                };

                // Wait a bit for map to be fully initialized
                setTimeout(safeAddLayer, 100);
            }
        } catch (error) {
            console.error('Error in HeatmapLayer:', error);
        }

        return () => {
            try {
                if (map && heatLayerRef.current && map.hasLayer(heatLayerRef.current)) {
                    map.removeLayer(heatLayerRef.current);
                }
            } catch (cleanupError) {
                console.error('Error cleaning up HeatmapLayer:', cleanupError);
            }
        };
    }, [points, map]);

    return null;
};

const SearchControl = () => {
    const map = useMap();
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                map.setView([parseFloat(lat), parseFloat(lon)], 16);
            } else {
                alert('Location not found');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('Error searching for location');
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="leaflet-top leaflet-left mt-[80px] ml-[10px] z-1000">
            <div className="leaflet-control leaflet-bar">
                <form onSubmit={handleSearch} className="flex items-center bg-white rounded-md shadow-md overflow-hidden">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search area..."
                        className="px-3 py-2 text-sm text-slate-800 outline-none w-48"
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="px-3 py-2 bg-cyan-600 text-white hover:bg-cyan-700 transition-colors disabled:bg-slate-400"
                    >
                        {isSearching ? '...' : 'Go'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const RelocateControl = ({ data }: { data: RFReading[] }) => {
    const map = useMap();
    const [currentIndex, setCurrentIndex] = useState(-1);

    const handleRelocate = () => {
        if (data.length === 0) return;

        const nextIndex = (currentIndex + 1) % data.length;
        const point = data[nextIndex];

        if (point.lat !== undefined && point.lng !== undefined) {
            map.flyTo([point.lat, point.lng], 18, {
                duration: 1.5,
                easeLinearity: 0.25
            });
            setCurrentIndex(nextIndex);
        }
    };

    return (
        <div className="leaflet-top leaflet-right mt-[80px] mr-[10px] z-1000">
            <div className="leaflet-control leaflet-bar">
                <button
                    onClick={handleRelocate}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 rounded-md shadow-md hover:bg-slate-50 transition-colors font-medium"
                    title="Cycle through device locations"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span>Relocate</span>
                    <span className="text-xs text-slate-400 ml-1">({currentIndex + 1}/{data.length})</span>
                </button>
            </div>
        </div>
    );
};

// Popup content component with explain functionality
function PopupContent({ point }: { point: RFReading }) {
    const { speak, isSpeaking } = useVoiceAssistant();

    const handleExplain = () => {
        const explanation = generateExplanation('data_point', point);
        speak(explanation);
    };

    return (
        <div className="text-sm">
            <div className="flex items-center justify-between mb-2">
                <p className="font-bold">ID: {point.id}</p>
                <button
                    onClick={handleExplain}
                    disabled={isSpeaking}
                    className="px-2 py-1 text-xs glass-panel-got border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 rounded transition-all disabled:opacity-50"
                    title="Explain this data point"
                >
                    {isSpeaking ? '🗣...' : '🗣 Explain'}
                </button>
            </div>
            <p className="font-semibold text-cyan-300 mb-1">{point.device_name || 'Unknown Location'}</p>
            <p>Device: {point.device_id}</p>
            <p>Freq: {point.frequency} MHz</p>
            <p>RSSI: {point.rssi} dBm</p>
            <p>Noise: {point.noise_floor} dBm</p>
            {point.snr !== undefined && <p>SNR: {point.snr.toFixed(1)} dB</p>}
            {point.battery !== undefined && <p>Battery: {point.battery}%</p>}
        </div>
    );
}

export default function MapComponent({ data, selectedParam = 'rssi' }: MapComponentProps) {
    const center = (data.length > 0 && data[0].lat !== undefined && data[0].lng !== undefined)
        ? [data[0].lat, data[0].lng] as [number, number]
        : [13.1335, 77.5684] as [number, number];

    // Convert data to heatmap points: [lat, lng, intensity]
    const heatPoints = data
        .filter(d => d.lat !== undefined && d.lng !== undefined)
        .map(d => {
            let intensity = 0;

            if (selectedParam === 'noise') {
                // Noise floor: -120 (quiet) to -80 (loud)
                // Normalize: -120 -> 0, -80 -> 1
                intensity = Math.max(0, (d.noise_floor + 120) / 40);
            } else if (selectedParam === 'frequency') {
                // Frequency: 2400 to 2500 MHz
                // Normalize: 2400 -> 0, 2500 -> 1
                intensity = Math.max(0, (d.frequency - 2400) / 100);
            } else {
                // RSSI (default): -90 (weak) to -30 (strong)
                // Normalize: -90 -> 0.1, -30 -> 1.0
                intensity = Math.max(0, (d.rssi + 100) / 70);
            }

            return [d.lat!, d.lng!, intensity] as [number, number, number];
        });

    // Use useEffect to ensure map container has proper dimensions
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Force map to recalculate size after mount
        const timer1 = setTimeout(() => {
            if (mapContainerRef.current) {
                const mapElement = mapContainerRef.current.querySelector('.leaflet-container') as HTMLElement;
                if (mapElement) {
                    // Set explicit dimensions
                    const parent = mapContainerRef.current;
                    if (parent) {
                        const height = parent.offsetHeight || 500;
                        const width = parent.offsetWidth || 800;
                        mapElement.style.height = `${height}px`;
                        mapElement.style.width = `${width}px`;
                    }
                    // Trigger a resize event to help Leaflet initialize
                    window.dispatchEvent(new Event('resize'));
                }
            }
        }, 200);

        const timer2 = setTimeout(() => {
            if (mapContainerRef.current) {
                const mapElement = mapContainerRef.current.querySelector('.leaflet-container') as HTMLElement;
                if (mapElement) {
                    const parent = mapContainerRef.current;
                    if (parent) {
                        const height = parent.offsetHeight || 500;
                        const width = parent.offsetWidth || 800;
                        mapElement.style.height = `${height}px`;
                        mapElement.style.width = `${width}px`;
                    }
                    window.dispatchEvent(new Event('resize'));
                }
            }
        }, 600);

        const timer3 = setTimeout(() => {
            if (mapContainerRef.current) {
                const mapElement = mapContainerRef.current.querySelector('.leaflet-container') as HTMLElement;
                if (mapElement) {
                    window.dispatchEvent(new Event('resize'));
                }
            }
        }, 1200);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    // Don't render map until mounted to avoid SSR issues
    if (!isMounted) {
        return (
            <div className="h-full w-full relative flex items-center justify-center" style={{ minHeight: '500px' }}>
                <div className="text-cyan-400">Loading map...</div>
            </div>
        );
    }

    return (
        <div
            ref={mapContainerRef}
            className="w-full h-full relative"
            style={{
                minHeight: '500px',
                flex: '1 1 auto',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <MapContainer
                center={center}
                zoom={16}
                style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: '0.5rem',
                    position: 'relative',
                    zIndex: 1,
                    flex: '1 1 auto',
                    minHeight: '500px'
                }}
                scrollWheelZoom={true}
                key={`map-${isMounted}`}
            >
                <MapInitializer />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <HeatmapLayer points={heatPoints} />
                <SearchControl />
                <RelocateControl data={data} />
                {data.filter(p => p.lat !== undefined && p.lng !== undefined).map((point) => (
                    <Marker key={point.id} position={[point.lat!, point.lng!]} icon={customIcon}>
                        <Popup>
                            <PopupContent point={point} />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
