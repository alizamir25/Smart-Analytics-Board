import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  GitBranch, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DataSource {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'external';
  lastUpdated: string;
  status: 'healthy' | 'warning' | 'error';
  recordCount: number;
  qualityScore: number;
}

interface DataLineageViewerProps {
  sources?: DataSource[];
}

const mockSources: DataSource[] = [
  {
    id: '1',
    name: 'Sales Database',
    type: 'database',
    lastUpdated: '2024-01-20T10:30:00Z',
    status: 'healthy',
    recordCount: 15420,
    qualityScore: 98
  },
  {
    id: '2',
    name: 'Customer API',
    type: 'api',
    lastUpdated: '2024-01-20T09:15:00Z',
    status: 'warning',
    recordCount: 8750,
    qualityScore: 87
  },
  {
    id: '3',
    name: 'Marketing CSV',
    type: 'file',
    lastUpdated: '2024-01-19T16:45:00Z',
    status: 'healthy',
    recordCount: 3200,
    qualityScore: 95
  }
];

export const DataLineageViewer = ({ sources = mockSources }: DataLineageViewerProps) => {
  const { t } = useLanguage();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'api':
        return <RefreshCw className="h-4 w-4" />;
      case 'file':
        return <FileText className="h-4 w-4" />;
      default:
        return <GitBranch className="h-4 w-4" />;
    }
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          {t('dataLineage.title')}
        </CardTitle>
        <CardDescription>
          {t('dataLineage.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sources.map((source, index) => (
          <div key={source.id}>
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                {getTypeIcon(source.type)}
                <div>
                  <div className="font-medium">{source.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {t('dataLineage.lastUpdated')}: {formatLastUpdated(source.lastUpdated)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">{source.recordCount.toLocaleString()} records</div>
                  <div className="text-sm text-muted-foreground">
                    Quality: {source.qualityScore}%
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(source.status)}
                  <Badge 
                    variant={source.status === 'healthy' ? 'default' : 
                            source.status === 'warning' ? 'secondary' : 'destructive'}
                  >
                    {source.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            {index < sources.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        
        <Separator />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {t('dataLineage.totalSources')}: {sources.length}
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('dataLineage.refresh')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};