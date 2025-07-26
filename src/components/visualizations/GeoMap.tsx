import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

export const GeoMap = ({ data = [], title = "Geographic Data", description = "Location-based analytics" }: GeoMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { toast } = useToast();

  // Sample data if none provided
  const sampleData = [
    { lng: -74.006, lat: 40.7128, value: 100, label: "New York" },
    { lng: -118.2437, lat: 34.0522, value: 85, label: "Los Angeles" },
    { lng: -87.6298, lat: 41.8781, value: 75, label: "Chicago" },
    { lng: 2.3522, lat: 48.8566, value: 90, label: "Paris" },
    { lng: 139.6917, lat: 35.6895, value: 95, label: "Tokyo" },
  ];

  const mapData = data.length > 0 ? data : sampleData;

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 2,
        center: [0, 20],
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        // Add markers for each data point
        mapData.forEach((point) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundColor = 'hsl(var(--primary))';
          el.style.width = `${Math.max(10, point.value / 5)}px`;
          el.style.height = `${Math.max(10, point.value / 5)}px`;
          el.style.borderRadius = '50%';
          el.style.cursor = 'pointer';
          el.style.opacity = '0.8';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false
          }).setHTML(`
            <div class="text-sm">
              <strong>${point.label}</strong><br/>
              Value: ${point.value}
            </div>
          `);

          new mapboxgl.Marker(el)
            .setLngLat([point.lng, point.lat])
            .setPopup(popup)
            .addTo(map.current!);

          el.addEventListener('mouseenter', () => popup.addTo(map.current!));
          el.addEventListener('mouseleave', () => popup.remove());
        });
      });

      setIsMapInitialized(true);
      toast({
        title: "Map initialized",
        description: "Mapbox map loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize map. Please check your token.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isMapInitialized && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Get your token from{' '}
                <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  mapbox.com
                </a>
              </p>
            </div>
            <Button onClick={initializeMap} disabled={!mapboxToken}>
              Initialize Map
            </Button>
          </div>
        )}
        <div 
          ref={mapContainer} 
          className={`w-full ${isMapInitialized ? 'h-96' : 'h-48 bg-muted rounded-lg flex items-center justify-center'}`}
        >
          {!isMapInitialized && (
            <p className="text-muted-foreground">Enter your Mapbox token to load the map</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};