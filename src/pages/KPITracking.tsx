import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KPICard, KPI } from "@/components/kpi/KPICard";
import { AddKPIDialog } from "@/components/kpi/AddKPIDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, Target, AlertTriangle, CheckCircle } from "lucide-react";

const mockKPIs: KPI[] = [
  {
    id: '1',
    name: 'Revenue Growth',
    category: 'Sales',
    current: 85,
    target: 100,
    threshold: 90,
    unit: '%',
    trend: 12.5,
    lastUpdated: new Date(),
  },
  {
    id: '2',
    name: 'Customer Satisfaction',
    category: 'Customer Service',
    current: 4.2,
    target: 4.5,
    threshold: 95,
    unit: 'score',
    trend: -2.1,
    lastUpdated: new Date(),
  },
  {
    id: '3',
    name: 'Conversion Rate',
    category: 'Marketing',
    current: 3.8,
    target: 5.0,
    threshold: 80,
    unit: '%',
    trend: 8.3,
    lastUpdated: new Date(),
  },
  {
    id: '4',
    name: 'Employee Retention',
    category: 'HR',
    current: 92,
    target: 95,
    threshold: 90,
    unit: '%',
    trend: 1.5,
    lastUpdated: new Date(),
  },
];

export const KPITracking = () => {
  const { t } = useLanguage();
  const [kpis, setKPIs] = useState<KPI[]>(mockKPIs);

  const handleAddKPI = (newKPI: Omit<KPI, 'id' | 'lastUpdated'>) => {
    const kpi: KPI = {
      ...newKPI,
      id: Date.now().toString(),
      lastUpdated: new Date(),
    };
    setKPIs(prev => [...prev, kpi]);
  };

  const handleEditKPI = (kpi: KPI) => {
    console.log('Edit KPI:', kpi);
  };

  const handleDeleteKPI = (id: string) => {
    setKPIs(prev => prev.filter(kpi => kpi.id !== id));
  };

  const getKPIStatus = (kpi: KPI) => {
    const percentage = (kpi.current / kpi.target) * 100;
    if (percentage >= kpi.threshold) return 'good';
    if (percentage >= kpi.threshold * 0.8) return 'warning';
    return 'critical';
  };

  const statusCounts = kpis.reduce((acc, kpi) => {
    const status = getKPIStatus(kpi);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = kpis.map(kpi => ({
    name: kpi.name,
    current: kpi.current,
    target: kpi.target,
    percentage: (kpi.current / kpi.target) * 100,
    status: getKPIStatus(kpi),
  }));

  const getBarColor = (status: string) => {
    switch (status) {
      case 'good': return 'hsl(var(--chart-2))';
      case 'warning': return 'hsl(var(--chart-4))';
      case 'critical': return 'hsl(var(--chart-5))';
      default: return 'hsl(var(--chart-1))';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('kpi.title')}</h1>
          <p className="text-muted-foreground mt-2">
            Monitor key performance indicators with targets and thresholds
          </p>
        </div>
        <AddKPIDialog onAdd={handleAddKPI} />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total KPIs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('kpi.status.good')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{statusCounts.good || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('kpi.status.warning')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{statusCounts.warning || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('kpi.status.critical')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{statusCounts.critical || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('kpi.performance')} Overview</CardTitle>
          <CardDescription>Current vs Target performance across all KPIs</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.id}
            kpi={kpi}
            onEdit={handleEditKPI}
            onDelete={handleDeleteKPI}
          />
        ))}
      </div>
    </div>
  );
};