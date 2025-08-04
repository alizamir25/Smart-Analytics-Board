import { ChartCard } from "@/components/charts/ChartCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareDashboard } from "@/components/collaboration/ShareDashboard";
import { RealTimeIndicator } from "@/components/collaboration/RealTimeIndicator";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowRight,
  Download,
  Filter
} from "lucide-react";

interface DashboardProps {
  user: { email: string; role: 'admin' | 'analyst' | 'viewer' };
}

export const Dashboard = ({ user }: DashboardProps) => {
  // Sample data for charts
  const sampleData = [
    { name: 'Jan', value: 4000, target: 3800 },
    { name: 'Feb', value: 3000, target: 3900 },
    { name: 'Mar', value: 5000, target: 4100 },
    { name: 'Apr', value: 4500, target: 4200 },
    { name: 'May', value: 6000, target: 4300 },
    { name: 'Jun', value: 5500, target: 4400 },
  ];

  const roleFeatures = {
    admin: ['Full access', 'User management', 'System settings'],
    analyst: ['Data analysis', 'Create reports', 'ML insights'],
    viewer: ['View dashboards', 'Export reports']
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your analytics today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RealTimeIndicator currentUser={user} dashboardId="main-dashboard" />
          <Badge variant="outline" className="capitalize">
            {user.role}
          </Badge>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <ShareDashboard dashboardId="main-dashboard" user={user} />
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ChartCard 
          title="Total Revenue" 
          value="$45,231" 
          change={20.1}
          enableComments={true}
          user={user}
          chartId="revenue-metric"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>+20.1% from last month</span>
          </div>
        </ChartCard>
        
        <ChartCard 
          title="Active Users" 
          value="2,350" 
          change={15.3}
          enableComments={true}
          user={user}
          chartId="users-metric"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>+15.3% from last month</span>
          </div>
        </ChartCard>
        
        <ChartCard 
          title="Conversion Rate" 
          value="3.24%" 
          change={-2.4}
          enableComments={true}
          user={user}
          chartId="conversion-metric"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>-2.4% from last month</span>
          </div>
        </ChartCard>
        
        <ChartCard 
          title="Avg. Session" 
          value="4m 32s" 
          change={8.7}
          enableComments={true}
          user={user}
          chartId="session-metric"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>+8.7% from last month</span>
          </div>
        </ChartCard>
      </div>

      {/* Charts section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard 
          title="Revenue vs Target" 
          description="Monthly performance comparison"
          enableComments={true}
          user={user}
          chartId="revenue-chart"
        >
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chart will render here</p>
              <p className="text-xs">Connect to Recharts for full implementation</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard 
          title="User Growth" 
          description="User acquisition over time"
          enableComments={true}
          user={user}
          chartId="growth-chart"
        >
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Growth chart placeholder</p>
              <p className="text-xs">Real-time data visualization</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Role-specific features */}
      <Card>
        <CardHeader>
          <CardTitle>Your Access Level: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</CardTitle>
          <CardDescription>
            Available features for your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {roleFeatures[user.role].map((feature, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">Upload CSV Data</span>
                <span className="text-xs text-muted-foreground">Import new dataset</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">Create Report</span>
                <span className="text-xs text-muted-foreground">Generate insights</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">View Analytics</span>
                <span className="text-xs text-muted-foreground">Predictive models</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">ML Insights</span>
                <span className="text-xs text-muted-foreground">AI-powered analysis</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};