import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface ChartBuilderProps {
  data?: any[];
  title?: string;
  description?: string;
}

export const CustomChartBuilder = ({ 
  data = [], 
  title = "Custom Chart Builder", 
  description = "Build your own visualizations" 
}: ChartBuilderProps) => {
  const [chartType, setChartType] = useState<string>('');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [showChart, setShowChart] = useState(false);

  // Sample data if none provided
  const sampleData = [
    { month: 'Jan', sales: 4000, revenue: 2400, customers: 240 },
    { month: 'Feb', sales: 3000, revenue: 1398, customers: 221 },
    { month: 'Mar', sales: 2000, revenue: 9800, customers: 229 },
    { month: 'Apr', sales: 2780, revenue: 3908, customers: 200 },
    { month: 'May', sales: 1890, revenue: 4800, customers: 218 },
    { month: 'Jun', sales: 2390, revenue: 3800, customers: 250 },
  ];

  const chartData = data.length > 0 ? data : sampleData;

  // Extract column names from data
  const columns = chartData.length > 0 ? Object.keys(chartData[0]) : [];
  const numericColumns = columns.filter(col => 
    typeof chartData[0]?.[col] === 'number'
  );
  const allColumns = columns;

  const chartTypes = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'area', label: 'Area Chart' },
    { value: 'pie', label: 'Pie Chart' },
  ];

  const colors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#82ca9d', '#ffc658'];

  const buildChart = () => {
    if (!chartType || !xAxis || !yAxis) return;
    setShowChart(true);
  };

  const renderChart = () => {
    if (!showChart || !chartType || !xAxis || !yAxis) return null;

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={yAxis} 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yAxis} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={yAxis} 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={yAxis}
                nameKey={xAxis}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="chart-type">Chart Type</Label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="x-axis">X-Axis (Dimension)</Label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger>
                <SelectValue placeholder="Select X-axis" />
              </SelectTrigger>
              <SelectContent>
                {allColumns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="y-axis">Y-Axis (Measure)</Label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger>
                <SelectValue placeholder="Select Y-axis" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={buildChart} 
          disabled={!chartType || !xAxis || !yAxis}
          className="w-full"
        >
          Generate Chart
        </Button>

        {/* Chart Display */}
        <div className="border border-border rounded-lg p-4 bg-card">
          {showChart ? (
            renderChart()
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Configure your chart settings above and click "Generate Chart"
            </div>
          )}
        </div>

        {/* Sample Data Preview */}
        <div className="space-y-2">
          <Label>Data Preview (First 3 rows)</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((column) => (
                    <th key={column} className="p-2 text-left font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chartData.slice(0, 3).map((row, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0">
                    {columns.map((column) => (
                      <td key={column} className="p-2">
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};