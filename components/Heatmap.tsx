"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import "leaflet.heat";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type HeatmapProps = {
  points: [number, number, number][];
};

export default function Heatmap({ points }: HeatmapProps) {
  return (
    <div className="relative w-full h-full">

      <MapContainer
        center={[13.135, 77.565]}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <HeatLayer points={points} />

        {/* Map controls must be INSIDE MapContainer */}
        <MapControlWrapper />
      </MapContainer>
    </div>
  );
}

/* ------------------------------------------
   Heat Layer
------------------------------------------- */
function HeatLayer({ points }: HeatmapProps) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    const heat = (L as any).heatLayer(points as LatLngExpression[], {
      radius: 35,
      blur: 20,
      maxZoom: 18,
    });

    heat.addTo(map);

    return () => heat.remove();
  }, [points]);

  return null;
}

/* ------------------------------------------
   Map Controls Wrapper (INSIDE MapContainer)
------------------------------------------- */
function MapControlWrapper() {
  const map = useMap(); // now works!
  const [query, setQuery] = useState("");

  // SEARCH FUNCTION
  const searchLocation = async () => {
    if (!query.trim()) return;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const results = await res.json();

    if (results.length > 0) {
      const lat = parseFloat(results[0].lat);
      const lon = parseFloat(results[0].lon);

      map.setView([lat, lon], 16);
    } else {
      alert("No location found");
    }
  };

  // RECENTER TO USER LOCATION
  const recenterMap = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      map.setView([pos.coords.latitude, pos.coords.longitude], 16);
    });
  };

  return createPortal(
    <div className="absolute top-4 left-4 z-9999 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2">
      <input
        type="text"
        placeholder="Search place..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border px-2 py-1 rounded-md text-sm w-40"
      />

      <button
        onClick={searchLocation}
        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
      >
        Go
      </button>

      <button
        onClick={recenterMap}
        className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-900"
      >
        Locate Me
      </button>
    </div>,
    document.body
  );
}
