import React, { useMemo, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { kmeans } from 'ml-kmeans';

interface DataPoint {
  x: number;
  y: number;
  cluster?: number;
  label?: string;
}

const clusterColors = [
  "hsl(var(--primary))",
  "hsl(var(--destructive))",
  "hsl(var(--warning))",
  "hsl(var(--success))",
  "hsl(var(--info))",
];

export const ClusteringAnalysis = () => {
  const [kValue, setKValue] = useState<number>(3);
  const [refreshKey, setRefreshKey] = useState(0);

  // Generate sample 2D data points
  const generateData = useMemo(() => {
    const data: DataPoint[] = [];
    
    // Generate clusters with some natural grouping
    const centers = [
      { x: 20, y: 30 },
      { x: 60, y: 20 },
      { x: 40, y: 70 },
      { x: 80, y: 60 },
    ];
    
    centers.forEach((center, centerIndex) => {
      const pointsPerCenter = 15 + Math.floor(Math.random() * 10);
      for (let i = 0; i < pointsPerCenter; i++) {
        data.push({
          x: center.x + (Math.random() - 0.5) * 30,
          y: center.y + (Math.random() - 0.5) * 30,
          label: `Point ${data.length + 1}`,
        });
      }
    });
    
    // Add some random noise points
    for (let i = 0; i < 10; i++) {
      data.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        label: `Noise ${i + 1}`,
      });
    }
    
    return data;
  }, [refreshKey]);

  // Perform k-means clustering
  const clusteredData = useMemo(() => {
    try {
      const points = generateData.map(d => [d.x, d.y]);
      const result = kmeans(points, kValue, {
        initialization: 'random',
        maxIterations: 100,
      });
      
      return generateData.map((point, index) => ({
        ...point,
        cluster: result.clusters[index],
      }));
    } catch (error) {
      // Fallback to simple clustering if ML library fails
      return generateData.map((point, index) => ({
        ...point,
        cluster: index % kValue,
      }));
    }
  }, [generateData, kValue]);

  const clusterStats = useMemo(() => {
    const stats: { [key: number]: number } = {};
    clusteredData.forEach(point => {
      if (point.cluster !== undefined) {
        stats[point.cluster] = (stats[point.cluster] || 0) + 1;
      }
    });
    return stats;
  }, [clusteredData]);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              K-Means Clustering
            </CardTitle>
            <CardDescription>
              Unsupervised learning to group similar data points
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={kValue.toString()} onValueChange={(value) => setKValue(Number(value))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">K=2</SelectItem>
                <SelectItem value="3">K=3</SelectItem>
                <SelectItem value="4">K=4</SelectItem>
                <SelectItem value="5">K=5</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={refreshData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(clusterStats).map(([cluster, count]) => (
            <div key={cluster} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: clusterColors[Number(cluster)] }}
              />
              <Badge variant="secondary">
                Cluster {Number(cluster) + 1}: {count} points
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value, name) => [value, name]}
                labelFormatter={() => ''}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background p-2 border rounded shadow-lg">
                        <p className="font-medium">{data.label}</p>
                        <p className="text-sm">X: {data.x?.toFixed(1)}</p>
                        <p className="text-sm">Y: {data.y?.toFixed(1)}</p>
                        <p className="text-sm">Cluster: {(data.cluster || 0) + 1}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={clusteredData}>
                {clusteredData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={clusterColors[entry.cluster || 0]} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Points:</span>
            <span className="ml-2">{clusteredData.length}</span>
          </div>
          <div>
            <span className="font-medium">Clusters:</span>
            <span className="ml-2">{kValue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};