"use client";

import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

type Props = {
  lat: number;
  lng: number;
};

export default function LiveNodeMarker({ lat, lng }: Props) {
  const map = useMap();

  useEffect(() => {
    // nothing special; the Marker below will handle position updates via props
  }, [lat, lng, map]);

  const pulsingIcon = L.divIcon({
    className: "live-pulse",
    html: `<span style="display:inline-block;width:14px;height:14px;border-radius:9999px;background:#06b6d4;box-shadow:0 0 10px rgba(6,182,212,0.6)"></span>`,
    iconSize: [14, 14],
  });

  return <Marker position={[lat, lng]} icon={pulsingIcon as any} />;
}
