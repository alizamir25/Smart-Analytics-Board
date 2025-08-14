import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, CheckCircle, Clock, Mail, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export interface AlertEvent {
  id: string;
  ruleId: string;
  ruleName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggeredAt: Date;
  status: 'triggered' | 'acknowledged' | 'resolved';
  channels: string[];
  value: number;
  threshold: number;
}

interface AlertHistoryProps {
  events: AlertEvent[];
}

export const AlertHistory = ({ events }: AlertHistoryProps) => {
  const { t } = useLanguage();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'triggered': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'acknowledged': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />;
      case 'slack': 
      case 'teams': return <MessageSquare className="h-3 w-3" />;
      default: return <MessageSquare className="h-3 w-3" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert History</CardTitle>
        <CardDescription>
          Recent alert events and notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No alert events yet
              </p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(event.status)}
                      <h4 className="font-medium">{event.ruleName}</h4>
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(event.triggeredAt, 'MMM dd, HH:mm')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {event.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span>
                        Value: <span className="font-medium">{event.value}</span>
                      </span>
                      <span>
                        Threshold: <span className="font-medium">{event.threshold}</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">Sent via:</span>
                      {event.channels.map((channel) => (
                        <div key={channel} className="flex items-center space-x-1">
                          {getChannelIcon(channel)}
                          <span className="text-xs capitalize">{channel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};