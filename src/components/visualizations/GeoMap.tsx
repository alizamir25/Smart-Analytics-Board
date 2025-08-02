import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface GeoMapProps {
  data?: Array<{
    lng: number;
    lat: number;
    value: number;
    label: string;
  }>;
  title?: string;
  description?: string;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const GeoMap = ({ data = [], title = "Geographic Data", description = "Location-based analytics" }: GeoMapProps) => {
  const [hoveredGeo, setHoveredGeo] = useState<string | null>(null);

  // Sample data if none provided
  const sampleData = [
    { lng: -74.006, lat: 40.7128, value: 100, label: "New York" },
    { lng: -118.2437, lat: 34.0522, value: 85, label: "Los Angeles" },
    { lng: -87.6298, lat: 41.8781, value: 75, label: "Chicago" },
    { lng: 2.3522, lat: 48.8566, value: 90, label: "Paris" },
    { lng: 139.6917, lat: 35.6895, value: 95, label: "Tokyo" },
    { lng: -0.1276, lat: 51.5074, value: 88, label: "London" },
    { lng: 13.4050, lat: 52.5200, value: 82, label: "Berlin" },
    { lng: -43.1729, lat: -22.9068, value: 78, label: "Rio de Janeiro" },
  ];

  const mapData = data.length > 0 ? data : sampleData;

  return (
    <TooltipProvider>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 border rounded-lg bg-slate-50 dark:bg-slate-900 relative">
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{
                scale: 160,
                center: [0, 0],
              }}
              width={800}
              height={400}
            >
              <ZoomableGroup zoom={1}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => setHoveredGeo(geo.properties?.NAME)}
                        onMouseLeave={() => setHoveredGeo(null)}
                        style={{
                          default: {
                            fill: hoveredGeo === geo.properties?.NAME 
                              ? "hsl(var(--primary))" 
                              : "hsl(var(--muted))",
                            outline: "none",
                            stroke: "hsl(var(--border))",
                            strokeWidth: 0.5,
                          },
                          hover: {
                            fill: "hsl(var(--primary))",
                            outline: "none",
                            stroke: "hsl(var(--border))",
                            strokeWidth: 0.5,
                          },
                          pressed: {
                            fill: "hsl(var(--primary))",
                            outline: "none",
                            stroke: "hsl(var(--border))",
                            strokeWidth: 0.5,
                          },
                        }}
                      />
                    ))
                  }
                </Geographies>
                {mapData.map((marker) => (
                  <Tooltip key={marker.label}>
                    <TooltipTrigger asChild>
                      <Marker coordinates={[marker.lng, marker.lat]}>
                        <circle
                          r={Math.max(4, marker.value / 10)}
                          fill="hsl(var(--primary))"
                          stroke="white"
                          strokeWidth={2}
                          className="cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                        />
                      </Marker>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-sm">
                        <strong>{marker.label}</strong><br/>
                        Value: {marker.value}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </ZoomableGroup>
            </ComposableMap>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};