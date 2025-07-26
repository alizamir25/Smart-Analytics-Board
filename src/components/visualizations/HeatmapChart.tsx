import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface HeatmapData {
  x: string;
  y: string;
  value: number;
}

interface HeatmapChartProps {
  data?: HeatmapData[];
  title?: string;
  description?: string;
  colorScheme?: 'blue' | 'green' | 'red' | 'purple';
}

export const HeatmapChart = ({ 
  data = [], 
  title = "Activity Heatmap", 
  description = "Data intensity visualization",
  colorScheme = 'blue'
}: HeatmapChartProps) => {
  // Sample data if none provided
  const sampleData: HeatmapData[] = [
    { x: 'Mon', y: '9AM', value: 45 },
    { x: 'Mon', y: '10AM', value: 72 },
    { x: 'Mon', y: '11AM', value: 38 },
    { x: 'Mon', y: '12PM', value: 91 },
    { x: 'Mon', y: '1PM', value: 62 },
    { x: 'Mon', y: '2PM', value: 55 },
    { x: 'Tue', y: '9AM', value: 58 },
    { x: 'Tue', y: '10AM', value: 83 },
    { x: 'Tue', y: '11AM', value: 47 },
    { x: 'Tue', y: '12PM', value: 95 },
    { x: 'Tue', y: '1PM', value: 71 },
    { x: 'Tue', y: '2PM', value: 64 },
    { x: 'Wed', y: '9AM', value: 42 },
    { x: 'Wed', y: '10AM', value: 76 },
    { x: 'Wed', y: '11AM', value: 53 },
    { x: 'Wed', y: '12PM', value: 88 },
    { x: 'Wed', y: '1PM', value: 67 },
    { x: 'Wed', y: '2PM', value: 59 },
    { x: 'Thu', y: '9AM', value: 51 },
    { x: 'Thu', y: '10AM', value: 79 },
    { x: 'Thu', y: '11AM', value: 44 },
    { x: 'Thu', y: '12PM', value: 93 },
    { x: 'Thu', y: '1PM', value: 68 },
    { x: 'Thu', y: '2PM', value: 61 },
    { x: 'Fri', y: '9AM', value: 37 },
    { x: 'Fri', y: '10AM', value: 64 },
    { x: 'Fri', y: '11AM', value: 41 },
    { x: 'Fri', y: '12PM', value: 77 },
    { x: 'Fri', y: '1PM', value: 54 },
    { x: 'Fri', y: '2PM', value: 48 },
  ];

  const heatmapData = data.length > 0 ? data : sampleData;

  // Get unique x and y values
  const xValues = Array.from(new Set(heatmapData.map(d => d.x)));
  const yValues = Array.from(new Set(heatmapData.map(d => d.y)));

  // Find min and max values for color scaling
  const values = heatmapData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const getColorIntensity = (value: number) => {
    const intensity = (value - minValue) / (maxValue - minValue);
    return Math.max(0.1, intensity); // Minimum 10% opacity
  };

  const getColorClass = (value: number) => {
    const intensity = getColorIntensity(value);
    
    const colorMap = {
      blue: `rgba(59, 130, 246, ${intensity})`, // blue-500
      green: `rgba(34, 197, 94, ${intensity})`, // green-500
      red: `rgba(239, 68, 68, ${intensity})`, // red-500
      purple: `rgba(168, 85, 247, ${intensity})` // purple-500
    };
    
    return colorMap[colorScheme];
  };

  const getValue = (x: string, y: string) => {
    const point = heatmapData.find(d => d.x === x && d.y === y);
    return point ? point.value : 0;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Low</span>
            <div className="flex gap-1">
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((intensity) => (
                <div
                  key={intensity}
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }}
                />
              ))}
            </div>
            <span className="text-muted-foreground">High</span>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Y-axis labels and grid */}
              <div className="grid grid-cols-[80px_repeat(var(--cols),1fr)]" style={{ '--cols': xValues.length } as any}>
                {/* Empty corner */}
                <div className="p-2"></div>
                
                {/* X-axis labels */}
                {xValues.map((x) => (
                  <div key={x} className="p-2 text-center text-sm font-medium border-b border-border">
                    {x}
                  </div>
                ))}

                {/* Heatmap cells */}
                {yValues.map((y) => (
                  <React.Fragment key={y}>
                    {/* Y-axis label */}
                    <div className="p-2 text-sm font-medium border-r border-border flex items-center">
                      {y}
                    </div>
                    
                    {/* Data cells */}
                    {xValues.map((x) => {
                      const value = getValue(x, y);
                      return (
                        <div
                          key={`${x}-${y}`}
                          className="relative p-2 border border-border min-h-[40px] flex items-center justify-center text-xs font-medium transition-all hover:scale-105 hover:z-10 cursor-pointer group"
                          style={{ backgroundColor: getColorIntensity(value) > 0.5 ? getColorClass(value) : getColorClass(value) }}
                        >
                          <span className={getColorIntensity(value) > 0.5 ? 'text-white' : 'text-foreground'}>
                            {value}
                          </span>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                            {x}, {y}: {value}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};