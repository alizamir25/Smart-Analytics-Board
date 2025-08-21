import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";

interface ForecastData {
  month: string;
  actual?: number;
  predicted: number;
  confidence: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  category: string;
  expectedIncrease: number;
  priority: number;
}

export const PredictiveAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [forecastPeriod, setForecastPeriod] = useState("6");

  const forecastData = useMemo(() => {
    const baseData: ForecastData[] = [
      { month: "Jan", actual: 45000, predicted: 45000, confidence: 100 },
      { month: "Feb", actual: 52000, predicted: 52000, confidence: 100 },
      { month: "Mar", actual: 48000, predicted: 48000, confidence: 100 },
      { month: "Apr", actual: 61000, predicted: 61000, confidence: 100 },
      { month: "May", actual: 55000, predicted: 55000, confidence: 100 },
      { month: "Jun", actual: 67000, predicted: 67000, confidence: 100 },
    ];

    const futureData: ForecastData[] = [
      { month: "Jul", predicted: 72000, confidence: 85 },
      { month: "Aug", predicted: 68000, confidence: 82 },
      { month: "Sep", predicted: 75000, confidence: 78 },
      { month: "Oct", predicted: 82000, confidence: 75 },
      { month: "Nov", predicted: 88000, confidence: 72 },
      { month: "Dec", predicted: 95000, confidence: 68 },
    ];

    return [...baseData, ...futureData.slice(0, parseInt(forecastPeriod))];
  }, [forecastPeriod]);

  const recommendations: Recommendation[] = [
    {
      id: "1",
      title: "Optimize Pricing Strategy",
      description: "Implement dynamic pricing to capture 15% more revenue during peak demand periods",
      impact: "high",
      effort: "medium",
      category: "Revenue",
      expectedIncrease: 15,
      priority: 1
    },
    {
      id: "2",
      title: "Expand Digital Marketing",
      description: "Increase social media ad spend by 30% to reach high-converting demographics",
      impact: "high",
      effort: "low",
      category: "Marketing",
      expectedIncrease: 12,
      priority: 2
    },
    {
      id: "3",
      title: "Customer Retention Program",
      description: "Launch loyalty program to reduce churn by 8% and increase customer lifetime value",
      impact: "medium",
      effort: "high",
      category: "Customer",
      expectedIncrease: 10,
      priority: 3
    },
    {
      id: "4",
      title: "Product Bundle Optimization",
      description: "Create targeted bundles for top product combinations to increase average order value",
      impact: "medium",
      effort: "medium",
      category: "Product",
      expectedIncrease: 8,
      priority: 4
    },
    {
      id: "5",
      title: "Inventory Management AI",
      description: "Implement predictive inventory system to reduce stockouts and carrying costs",
      impact: "low",
      effort: "high",
      category: "Operations",
      expectedIncrease: 5,
      priority: 5
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const currentValue = 67000;
  const forecastedValue = forecastData[forecastData.length - 1]?.predicted || 0;
  const growth = ((forecastedValue - currentValue) / currentValue) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Predictive + Prescriptive Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Forecast future performance and get actionable recommendations to exceed targets
        </p>
      </div>

      {/* Forecast Controls */}
      <div className="flex gap-4 items-center">
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Monthly Revenue</SelectItem>
            <SelectItem value="customers">New Customers</SelectItem>
            <SelectItem value="sales">Sales Volume</SelectItem>
            <SelectItem value="conversion">Conversion Rate</SelectItem>
          </SelectContent>
        </Select>

        <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Forecast period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 months ahead</SelectItem>
            <SelectItem value="6">6 months ahead</SelectItem>
            <SelectItem value="12">12 months ahead</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">June 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Forecasted Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${forecastedValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">End of forecast period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projected Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{growth.toFixed(1)}%</div>
              {growth > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">vs current period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confidence Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {forecastData[forecastData.length - 1]?.confidence || 0}%
            </div>
            <Progress value={forecastData[forecastData.length - 1]?.confidence || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Forecast</CardTitle>
          <CardDescription>Historical data and predictions with confidence intervals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === 'actual' ? 'Actual' : 'Predicted'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Prescriptive Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered action items ranked by expected impact to exceed forecasted targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={rec.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{rec.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">+{rec.expectedIncrease}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getImpactColor(rec.impact)}>
                      {rec.impact} impact
                    </Badge>
                    <Badge variant="outline" className={getEffortColor(rec.effort)}>
                      {rec.effort} effort
                    </Badge>
                    <Badge variant="secondary">{rec.category}</Badge>
                  </div>
                  <Button size="sm">
                    Implement
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Expected Impact Analysis</CardTitle>
          <CardDescription>Potential revenue increase by implementing recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recommendations.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Expected Increase']} />
                <Bar dataKey="expectedIncrease" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};