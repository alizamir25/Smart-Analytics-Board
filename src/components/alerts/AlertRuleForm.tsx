import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'percent_change';
  value: number;
  timeframe: '1h' | '24h' | '7d' | '30d';
  channels: string[];
  isActive: boolean;
  createdAt: Date;
}

interface AlertRuleFormProps {
  onSave: (rule: Omit<AlertRule, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialRule?: AlertRule;
}

export const AlertRuleForm = ({ onSave, onCancel, initialRule }: AlertRuleFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: initialRule?.name || '',
    description: initialRule?.description || '',
    metric: initialRule?.metric || '',
    condition: initialRule?.condition || 'less_than' as const,
    value: initialRule?.value || 0,
    timeframe: initialRule?.timeframe || '24h' as const,
    channels: initialRule?.channels || ['email'],
    isActive: initialRule?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.metric || formData.value === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Success",
      description: `Alert rule ${initialRule ? 'updated' : 'created'} successfully`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialRule ? 'Edit Alert Rule' : 'Create Alert Rule'}</CardTitle>
        <CardDescription>
          Set up automated alerts based on your data metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rule Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Daily Sales Drop Alert"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metric">Metric *</Label>
              <Select value={formData.metric} onValueChange={(value) => setFormData(prev => ({ ...prev, metric: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                  <SelectItem value="traffic">Website Traffic</SelectItem>
                  <SelectItem value="user_engagement">User Engagement</SelectItem>
                  <SelectItem value="inventory">Inventory Level</SelectItem>
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
              placeholder="Describe what this alert monitors..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value: any) => setFormData(prev => ({ ...prev, condition: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater_than">Greater than</SelectItem>
                  <SelectItem value="less_than">Less than</SelectItem>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="percent_change">% Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">
                Threshold Value * {formData.condition === 'percent_change' && '(%)'}
              </Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
                placeholder="e.g., 15"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Time Frame</Label>
              <Select value={formData.timeframe} onValueChange={(value: any) => setFormData(prev => ({ ...prev, timeframe: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Notification Channels</Label>
            <div className="flex flex-wrap gap-4">
              {['email', 'slack', 'teams', 'webhook'].map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Switch
                    id={channel}
                    checked={formData.channels.includes(channel)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, channels: [...prev.channels, channel] }));
                      } else {
                        setFormData(prev => ({ ...prev, channels: prev.channels.filter(c => c !== channel) }));
                      }
                    }}
                  />
                  <Label htmlFor={channel} className="capitalize">{channel}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {initialRule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};