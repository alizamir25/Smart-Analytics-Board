import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Scatter, ScatterChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataPoint {
  timestamp: string;
  value: number;
  isAnomaly?: boolean;
}

export const AnomalyDetection = () => {
  const [threshold, setThreshold] = useState<number>(2);
  const [refreshKey, setRefreshKey] = useState(0);

  // Generate sample time series data with some anomalies
  const generateData = useMemo(() => {
    const data: DataPoint[] = [];
    const baseValue = 100;
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const date = new Date(now.getTime() - (49 - i) * 24 * 60 * 60 * 1000);
      let value = baseValue + Math.sin(i * 0.3) * 20 + (Math.random() - 0.5) * 10;
      
      // Inject some anomalies
      if (Math.random() < 0.1) {
        value += (Math.random() - 0.5) * 80;
      }
      
      data.push({
        timestamp: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100,
      });
    }
    
    return data;
  }, [refreshKey]);

  // Simple anomaly detection using z-score
  const detectAnomalies = useMemo(() => {
    const values = generateData.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return generateData.map(point => ({
      ...point,
      isAnomaly: Math.abs(point.value - mean) > threshold * stdDev,
      zScore: Math.abs(point.value - mean) / stdDev,
    }));
  }, [generateData, threshold]);

  const anomalies = detectAnomalies.filter(d => d.isAnomaly);

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Anomaly Detection
            </CardTitle>
            <CardDescription>
              Statistical outlier detection using z-score analysis
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={threshold.toString()} onValueChange={(value) => setThreshold(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.5">1.5σ</SelectItem>
                <SelectItem value="2">2σ</SelectItem>
                <SelectItem value="2.5">2.5σ</SelectItem>
                <SelectItem value="3">3σ</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={refreshData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{anomalies.length}</Badge>
            <span className="text-sm text-muted-foreground">Anomalies detected</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{((anomalies.length / detectAnomalies.length) * 100).toFixed(1)}%</Badge>
            <span className="text-sm text-muted-foreground">Anomaly rate</span>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={detectAnomalies}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [
                  Array.isArray(value) ? value[0] : value,
                  name === 'value' ? 'Value' : name
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={(props) => {
                  if (props.payload?.isAnomaly) {
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={4}
                        fill="hsl(var(--destructive))"
                        stroke="white"
                        strokeWidth={2}
                      />
                    );
                  }
                  return <circle cx={props.cx} cy={props.cy} r={2} fill="hsl(var(--primary))" />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recent Anomalies</h4>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {anomalies.slice(-5).map((anomaly, index) => (
              <div key={index} className="flex justify-between items-center text-xs p-2 bg-destructive/10 rounded">
                <span>{new Date(anomaly.timestamp).toLocaleDateString()}</span>
                <span className="font-mono">{anomaly.value}</span>
                <Badge variant="outline" className="text-xs">
                  {anomaly.zScore?.toFixed(2)}σ
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};