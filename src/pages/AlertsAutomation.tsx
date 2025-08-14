import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertRuleForm, AlertRule } from "@/components/alerts/AlertRuleForm";
import { AlertHistory, AlertEvent } from "@/components/alerts/AlertHistory";
import { ReportScheduler, ScheduledReport } from "@/components/alerts/ReportScheduler";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Mail,
  Brain
} from "lucide-react";

// Mock data
const mockAlertRules: AlertRule[] = [
  {
    id: '1',
    name: 'Daily Sales Drop Alert',
    description: 'Alert when daily sales drop by more than 15%',
    metric: 'sales',
    condition: 'percent_change',
    value: -15,
    timeframe: '24h',
    channels: ['email', 'slack'],
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'High Traffic Alert',
    description: 'Alert when traffic exceeds 10,000 visitors',
    metric: 'traffic',
    condition: 'greater_than',
    value: 10000,
    timeframe: '1h',
    channels: ['email'],
    isActive: true,
    createdAt: new Date(),
  },
];

const mockAlertEvents: AlertEvent[] = [
  {
    id: '1',
    ruleId: '1',
    ruleName: 'Daily Sales Drop Alert',
    message: 'Sales dropped by 18% compared to yesterday',
    severity: 'high',
    triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'triggered',
    channels: ['email', 'slack'],
    value: 8200,
    threshold: 10000,
  },
  {
    id: '2',
    ruleId: '2',
    ruleName: 'High Traffic Alert',
    message: 'Website traffic exceeded threshold',
    severity: 'medium',
    triggeredAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: 'resolved',
    channels: ['email'],
    value: 12500,
    threshold: 10000,
  },
];

const mockScheduledReports: ScheduledReport[] = [
  {
    id: '1',
    name: 'Weekly Performance Summary',
    description: 'Comprehensive weekly report with key metrics',
    frequency: 'weekly',
    time: '09:00',
    dayOfWeek: 1, // Monday
    recipients: ['manager@company.com', 'team@company.com'],
    channels: ['email'],
    metrics: ['revenue', 'sales', 'conversion_rate'],
    isActive: true,
    createdAt: new Date(),
    lastSent: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

export const AlertsAutomation = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [alertRules, setAlertRules] = useState<AlertRule[]>(mockAlertRules);
  const [alertEvents] = useState<AlertEvent[]>(mockAlertEvents);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(mockScheduledReports);
  const [showCreateRule, setShowCreateRule] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | undefined>();

  const handleSaveRule = (ruleData: Omit<AlertRule, 'id' | 'createdAt'>) => {
    if (editingRule) {
      setAlertRules(prev => prev.map(rule => 
        rule.id === editingRule.id 
          ? { ...ruleData, id: editingRule.id, createdAt: editingRule.createdAt }
          : rule
      ));
      setEditingRule(undefined);
    } else {
      const newRule: AlertRule = {
        ...ruleData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      setAlertRules(prev => [...prev, newRule]);
    }
    setShowCreateRule(false);
  };

  const handleDeleteRule = (id: string) => {
    setAlertRules(prev => prev.filter(rule => rule.id !== id));
    toast({
      title: "Rule Deleted",
      description: "Alert rule has been deleted successfully",
    });
  };

  const handleToggleRule = (id: string, isActive: boolean) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, isActive } : rule
    ));
    toast({
      title: isActive ? "Rule Activated" : "Rule Deactivated",
      description: `Alert rule has been ${isActive ? 'activated' : 'deactivated'}`,
    });
  };

  const handleSaveReport = (reportData: Omit<ScheduledReport, 'id' | 'createdAt'>) => {
    const newReport: ScheduledReport = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setScheduledReports(prev => [...prev, newReport]);
  };

  const handleDeleteReport = (id: string) => {
    setScheduledReports(prev => prev.filter(report => report.id !== id));
    toast({
      title: "Report Deleted",
      description: "Scheduled report has been deleted successfully",
    });
  };

  const handleToggleReport = (id: string, isActive: boolean) => {
    setScheduledReports(prev => prev.map(report => 
      report.id === id ? { ...report, isActive } : report
    ));
    toast({
      title: isActive ? "Report Activated" : "Report Deactivated",
      description: `Scheduled report has been ${isActive ? 'activated' : 'deactivated'}`,
    });
  };

  const activeRulesCount = alertRules.filter(rule => rule.isActive).length;
  const activeReportsCount = scheduledReports.filter(report => report.isActive).length;
  const recentAlertsCount = alertEvents.filter(event => 
    new Date(event.triggeredAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Automation</h1>
          <p className="text-muted-foreground mt-2">
            Set up intelligent alerts and automated reporting for your data
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRulesCount}</div>
            <p className="text-xs text-muted-foreground">
              of {alertRules.length} total rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAlertsCount}</div>
            <p className="text-xs text-muted-foreground">
              in the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReportsCount}</div>
            <p className="text-xs text-muted-foreground">
              active reports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predictive Alerts</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              ML-powered insights
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="reports">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          {showCreateRule || editingRule ? (
            <AlertRuleForm
              onSave={handleSaveRule}
              onCancel={() => {
                setShowCreateRule(false);
                setEditingRule(undefined);
              }}
              initialRule={editingRule}
            />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Alert Rules</CardTitle>
                    <CardDescription>
                      Configure conditions that trigger automated alerts
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateRule(true)}>
                    Create Rule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertRules.map((rule) => (
                    <div key={rule.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium">{rule.name}</h4>
                            <Badge variant={rule.isActive ? "default" : "secondary"}>
                              {rule.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="capitalize">{rule.metric}</span>
                            <span>{rule.condition.replace('_', ' ')}</span>
                            <span>{rule.value}{rule.condition === 'percent_change' ? '%' : ''}</span>
                            <span>({rule.timeframe})</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {rule.channels.map((channel) => (
                              <Badge key={channel} variant="outline" className="text-xs">
                                {channel === 'email' && <Mail className="h-3 w-3 mr-1" />}
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRule(rule)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleRule(rule.id, !rule.isActive)}
                          >
                            {rule.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <AlertHistory events={alertEvents} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportScheduler
            reports={scheduledReports}
            onSave={handleSaveReport}
            onDelete={handleDeleteReport}
            onToggle={handleToggleReport}
          />
        </TabsContent>

        <TabsContent value="predictive">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Predictive Alerts
              </CardTitle>
              <CardDescription>
                AI-powered alerts that predict potential issues before they occur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <TrendingDown className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-orange-900 dark:text-orange-100">
                        Predicted Sales Decline
                      </h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        Based on current trends, sales may drop by 12% next week. Consider launching promotional campaigns.
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-orange-600 dark:text-orange-400">
                        <span>Confidence: 78%</span>
                        <span>Forecast: 5-7 days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Peak Traffic Expected
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Website traffic is predicted to spike by 40% on Friday. Ensure server capacity is adequate.
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600 dark:text-blue-400">
                        <span>Confidence: 85%</span>
                        <span>Forecast: 3 days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-100">
                        Conversion Rate Improvement
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Recent optimization changes are predicted to increase conversion rate by 8% over the next month.
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-green-600 dark:text-green-400">
                        <span>Confidence: 92%</span>
                        <span>Forecast: 30 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};