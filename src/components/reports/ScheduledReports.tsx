import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, Mail, Webhook, MessageSquare, Slack, Users, FileText, Settings, Plus, Edit, Trash2 } from 'lucide-react';

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  dashboards: string[];
  active: boolean;
  nextRun: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  triggers: string[];
  active: boolean;
  lastRun?: string;
}

interface SlackIntegration {
  id: string;
  channel: string;
  webhook: string;
  alertTypes: string[];
  active: boolean;
}

export default function ScheduledReports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Daily Sales Report',
      frequency: 'daily',
      time: '09:00',
      recipients: ['sales@company.com', 'manager@company.com'],
      format: 'pdf',
      dashboards: ['Sales Dashboard', 'KPI Overview'],
      active: true,
      nextRun: '2024-01-16 09:00'
    }
  ]);
  
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'CRM Data Sync',
      url: 'https://api.salesforce.com/webhook',
      triggers: ['new_lead', 'deal_closed'],
      active: true,
      lastRun: '2024-01-15 14:30'
    }
  ]);
  
  const [slackIntegrations, setSlackIntegrations] = useState<SlackIntegration[]>([
    {
      id: '1',
      channel: '#analytics',
      webhook: 'https://hooks.slack.com/services/...',
      alertTypes: ['threshold_breached', 'anomaly_detected'],
      active: true
    }
  ]);

  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [isCreateWebhookOpen, setIsCreateWebhookOpen] = useState(false);
  const [isCreateSlackOpen, setIsCreateSlackOpen] = useState(false);

  const [newReport, setNewReport] = useState({
    name: '',
    frequency: 'daily',
    time: '09:00',
    recipients: '',
    format: 'pdf',
    dashboards: ''
  });

  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    triggers: ''
  });

  const [newSlack, setNewSlack] = useState({
    channel: '',
    webhook: '',
    alertTypes: ''
  });

  const handleCreateReport = async () => {
    if (!newReport.name || !newReport.recipients) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/scheduled-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newReport.name,
          frequency: newReport.frequency,
          time: newReport.time,
          recipients: newReport.recipients.split(',').map(email => email.trim()),
          format: newReport.format,
          dashboards: newReport.dashboards.split(',').map(d => d.trim())
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Scheduled report created successfully"
        });
        setIsCreateReportOpen(false);
        setNewReport({ name: '', frequency: 'daily', time: '09:00', recipients: '', format: 'pdf', dashboards: '' });
        // Refresh reports list
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create scheduled report",
        variant: "destructive"
      });
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWebhook.name,
          url: newWebhook.url,
          triggers: newWebhook.triggers.split(',').map(t => t.trim())
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Webhook created successfully"
        });
        setIsCreateWebhookOpen(false);
        setNewWebhook({ name: '', url: '', triggers: '' });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create webhook",
        variant: "destructive"
      });
    }
  };

  const handleCreateSlackIntegration = async () => {
    if (!newSlack.channel || !newSlack.webhook) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/slack-integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: newSlack.channel,
          webhook: newSlack.webhook,
          alertTypes: newSlack.alertTypes.split(',').map(t => t.trim())
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Slack integration created successfully"
        });
        setIsCreateSlackOpen(false);
        setNewSlack({ channel: '', webhook: '', alertTypes: '' });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create Slack integration",
        variant: "destructive"
      });
    }
  };

  const toggleReportStatus = async (reportId: string, active: boolean) => {
    try {
      await fetch(`/api/scheduled-reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      
      setReports(reports.map(r => r.id === reportId ? { ...r, active } : r));
      toast({
        title: "Success",
        description: `Report ${active ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scheduled Reports & Integrations</h2>
          <p className="text-muted-foreground">
            Automate your reporting with scheduled emails, webhooks, and team notifications
          </p>
        </div>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Scheduled Reports
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="slack" className="flex items-center gap-2">
            <Slack className="h-4 w-4" />
            Team Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Email Reports</h3>
            <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Scheduled Report</DialogTitle>
                  <DialogDescription>
                    Set up automatic PDF reports sent via email
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      value={newReport.name}
                      onChange={(e) => setNewReport({...newReport, name: e.target.value})}
                      placeholder="Daily Sales Report"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select value={newReport.frequency} onValueChange={(value) => setNewReport({...newReport, frequency: value as any})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newReport.time}
                        onChange={(e) => setNewReport({...newReport, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="recipients">Recipients (comma-separated)</Label>
                    <Input
                      id="recipients"
                      value={newReport.recipients}
                      onChange={(e) => setNewReport({...newReport, recipients: e.target.value})}
                      placeholder="user1@company.com, user2@company.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="format">Format</Label>
                    <Select value={newReport.format} onValueChange={(value) => setNewReport({...newReport, format: value as any})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dashboards">Dashboards (comma-separated)</Label>
                    <Input
                      id="dashboards"
                      value={newReport.dashboards}
                      onChange={(e) => setNewReport({...newReport, dashboards: e.target.value})}
                      placeholder="Sales Dashboard, KPI Overview"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateReport}>Create Report</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{report.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={report.active ? "default" : "secondary"}>
                      {report.active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Switch
                      checked={report.active}
                      onCheckedChange={(checked) => toggleReportStatus(report.id, checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {report.frequency}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {report.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {report.recipients.length} recipients
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {report.format.toUpperCase()}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Next run: {report.nextRun}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Dashboards: {report.dashboards.join(', ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Webhook Integrations</h3>
            <Dialog open={isCreateWebhookOpen} onOpenChange={setIsCreateWebhookOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Webhook</DialogTitle>
                  <DialogDescription>
                    Push data to external tools and services
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="webhook-name">Webhook Name</Label>
                    <Input
                      id="webhook-name"
                      value={newWebhook.name}
                      onChange={(e) => setNewWebhook({...newWebhook, name: e.target.value})}
                      placeholder="CRM Data Sync"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      value={newWebhook.url}
                      onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                      placeholder="https://api.external-service.com/webhook"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="triggers">Triggers (comma-separated)</Label>
                    <Input
                      id="triggers"
                      value={newWebhook.triggers}
                      onChange={(e) => setNewWebhook({...newWebhook, triggers: e.target.value})}
                      placeholder="new_lead, deal_closed, data_updated"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateWebhook}>Create Webhook</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{webhook.name}</CardTitle>
                  <Badge variant={webhook.active ? "default" : "secondary"}>
                    {webhook.active ? 'Active' : 'Inactive'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      URL: {webhook.url}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Triggers: {webhook.triggers.join(', ')}
                    </p>
                    {webhook.lastRun && (
                      <p className="text-sm text-muted-foreground">
                        Last run: {webhook.lastRun}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="slack" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Team Integrations</h3>
            <Dialog open={isCreateSlackOpen} onOpenChange={setIsCreateSlackOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Team Integration</DialogTitle>
                  <DialogDescription>
                    Send insights and alerts to Slack or Teams
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="channel">Channel</Label>
                    <Input
                      id="channel"
                      value={newSlack.channel}
                      onChange={(e) => setNewSlack({...newSlack, channel: e.target.value})}
                      placeholder="#analytics"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="slack-webhook">Webhook URL</Label>
                    <Input
                      id="slack-webhook"
                      value={newSlack.webhook}
                      onChange={(e) => setNewSlack({...newSlack, webhook: e.target.value})}
                      placeholder="https://hooks.slack.com/services/..."
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="alert-types">Alert Types (comma-separated)</Label>
                    <Input
                      id="alert-types"
                      value={newSlack.alertTypes}
                      onChange={(e) => setNewSlack({...newSlack, alertTypes: e.target.value})}
                      placeholder="threshold_breached, anomaly_detected"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateSlackIntegration}>Create Integration</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {slackIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Slack className="h-4 w-4" />
                    {integration.channel}
                  </CardTitle>
                  <Badge variant={integration.active ? "default" : "secondary"}>
                    {integration.active ? 'Active' : 'Inactive'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Alert Types: {integration.alertTypes.join(', ')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}