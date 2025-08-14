import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, Mail, MessageSquare, Plus, Trash2 } from "lucide-react";

export interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  recipients: string[];
  channels: string[];
  metrics: string[];
  isActive: boolean;
  createdAt: Date;
  lastSent?: Date;
}

interface ReportSchedulerProps {
  reports: ScheduledReport[];
  onSave: (report: Omit<ScheduledReport, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

export const ReportScheduler = ({ reports, onSave, onDelete, onToggle }: ReportSchedulerProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    dayOfWeek: number | undefined;
    dayOfMonth: number | undefined;
    recipients: string[];
    channels: string[];
    metrics: string[];
    isActive: boolean;
  }>({
    name: '',
    description: '',
    frequency: 'daily',
    time: '09:00',
    dayOfWeek: undefined,
    dayOfMonth: undefined,
    recipients: [''],
    channels: ['email'],
    metrics: ['revenue'],
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || formData.recipients.some(r => !r.trim())) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const validRecipients = formData.recipients.filter(r => r.trim());
    
    onSave({
      ...formData,
      recipients: validRecipients,
    });
    
    setFormData({
      name: '',
      description: '',
      frequency: 'daily',
      time: '09:00',
      dayOfWeek: undefined,
      dayOfMonth: undefined,
      recipients: [''],
      channels: ['email'],
      metrics: ['revenue'],
      isActive: true,
    });
    
    setIsCreating(false);
    
    toast({
      title: "Success",
      description: "Scheduled report created successfully",
    });
  };

  const addRecipient = () => {
    setFormData(prev => ({ ...prev, recipients: [...prev.recipients, ''] }));
  };

  const removeRecipient = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      recipients: prev.recipients.filter((_, i) => i !== index) 
    }));
  };

  const updateRecipient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => i === index ? value : r)
    }));
  };

  const getFrequencyText = (report: ScheduledReport) => {
    let text = `${report.frequency} at ${report.time}`;
    if (report.frequency === 'weekly' && report.dayOfWeek !== undefined) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      text += ` on ${days[report.dayOfWeek]}`;
    } else if (report.frequency === 'monthly' && report.dayOfMonth) {
      text += ` on day ${report.dayOfMonth}`;
    }
    return text;
  };

  return (
    <div className="space-y-6">
      {/* Existing Reports */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Automated summary reports sent to your team
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No scheduled reports yet
              </p>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium">{report.name}</h4>
                        <Badge variant={report.isActive ? "default" : "secondary"}>
                          {report.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span className="capitalize">{getFrequencyText(report)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{report.recipients.length} recipient(s)</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {report.metrics.map((metric) => (
                          <Badge key={metric} variant="outline" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={report.isActive}
                        onCheckedChange={(checked) => onToggle(report.id, checked)}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create New Report Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create Scheduled Report</CardTitle>
            <CardDescription>
              Set up automated reports to be sent to your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Report Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Weekly Sales Summary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this report includes..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                
                {formData.frequency === 'weekly' && (
                  <div className="space-y-2">
                    <Label htmlFor="dayOfWeek">Day of Week</Label>
                    <Select 
                      value={formData.dayOfWeek?.toString()} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                        <SelectItem value="0">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {formData.frequency === 'monthly' && (
                  <div className="space-y-2">
                    <Label htmlFor="dayOfMonth">Day of Month</Label>
                    <Input
                      id="dayOfMonth"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.dayOfMonth || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                      placeholder="1-31"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label>Recipients *</Label>
                {formData.recipients.map((recipient, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={recipient}
                      onChange={(e) => updateRecipient(index, e.target.value)}
                      placeholder="email@example.com"
                      type="email"
                    />
                    {formData.recipients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRecipient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addRecipient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recipient
                </Button>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Report
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
