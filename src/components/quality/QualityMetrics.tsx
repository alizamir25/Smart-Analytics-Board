import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Database,
  BarChart3
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface QualityIssue {
  id: string;
  type: 'missing_data' | 'duplicate' | 'format_error' | 'outlier';
  severity: 'low' | 'medium' | 'high';
  description: string;
  count: number;
  field?: string;
}

interface QualityMetricsProps {
  overallScore?: number;
  issues?: QualityIssue[];
}

const mockIssues: QualityIssue[] = [
  {
    id: '1',
    type: 'missing_data',
    severity: 'medium',
    description: 'Missing values in email field',
    count: 23,
    field: 'email'
  },
  {
    id: '2',
    type: 'duplicate',
    severity: 'high',
    description: 'Duplicate customer records found',
    count: 8,
    field: 'customer_id'
  },
  {
    id: '3',
    type: 'outlier',
    severity: 'low',
    description: 'Unusual sales values detected',
    count: 5,
    field: 'sales_amount'
  }
];

export const QualityMetrics = ({ 
  overallScore = 87, 
  issues = mockIssues 
}: QualityMetricsProps) => {
  const { t } = useLanguage();

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'missing_data':
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case 'duplicate':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'format_error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'outlier':
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const validationRules = [
    { name: 'Completeness Check', status: 'passed', description: '98% data completeness' },
    { name: 'Format Validation', status: 'passed', description: 'All formats valid' },
    { name: 'Duplicate Detection', status: 'warning', description: '8 duplicates found' },
    { name: 'Range Validation', status: 'passed', description: 'Values within expected ranges' }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Quality Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('quality.overallScore')}
          </CardTitle>
          <CardDescription>
            {t('quality.scoreDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold flex items-center gap-2">
              <span className={getScoreColor(overallScore)}>{overallScore}%</span>
              {overallScore >= 90 ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
              )}
            </div>
            <Badge variant={overallScore >= 90 ? 'default' : 'secondary'}>
              {overallScore >= 90 ? 'Excellent' : overallScore >= 75 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
          <Progress value={overallScore} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            {t('quality.basedOn')} {validationRules.length} validation rules
          </p>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {t('quality.validationRules')}
          </CardTitle>
          <CardDescription>
            {t('quality.automatedChecks')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {validationRules.map((rule, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {rule.status === 'passed' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                <div>
                  <div className="font-medium">{rule.name}</div>
                  <div className="text-sm text-muted-foreground">{rule.description}</div>
                </div>
              </div>
              <Badge variant={rule.status === 'passed' ? 'default' : 'secondary'}>
                {rule.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quality Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {t('quality.detectedIssues')}
          </CardTitle>
          <CardDescription>
            {t('quality.issuesRequireAttention')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {issues.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {t('quality.noIssuesFound')}
              </AlertDescription>
            </Alert>
          ) : (
            issues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getIssueIcon(issue.type)}
                  <div>
                    <div className="font-medium">{issue.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {issue.field && `Field: ${issue.field} • `}
                      {issue.count} {issue.count === 1 ? 'occurrence' : 'occurrences'}
                    </div>
                  </div>
                </div>
                <Badge variant={getSeverityColor(issue.severity) as any}>
                  {issue.severity}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};