import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Target, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export interface KPI {
  id: string;
  name: string;
  category: string;
  current: number;
  target: number;
  threshold: number;
  unit: string;
  trend: number;
  lastUpdated: Date;
}

interface KPICardProps {
  kpi: KPI;
  onEdit?: (kpi: KPI) => void;
  onDelete?: (id: string) => void;
}

export const KPICard = ({ kpi, onEdit, onDelete }: KPICardProps) => {
  const { t, formatNumber } = useLanguage();
  
  const getStatus = () => {
    const percentage = (kpi.current / kpi.target) * 100;
    if (percentage >= kpi.threshold) return 'good';
    if (percentage >= kpi.threshold * 0.8) return 'warning';
    return 'critical';
  };

  const status = getStatus();
  const percentage = Math.min((kpi.current / kpi.target) * 100, 100);
  
  const statusConfig = {
    good: {
      color: 'bg-accent',
      textColor: 'text-accent',
      badgeVariant: 'default' as const,
      label: t('kpi.status.good'),
    },
    warning: {
      color: 'bg-chart-4',
      textColor: 'text-chart-4',
      badgeVariant: 'secondary' as const,
      label: t('kpi.status.warning'),
    },
    critical: {
      color: 'bg-destructive',
      textColor: 'text-destructive',
      badgeVariant: 'destructive' as const,
      label: t('kpi.status.critical'),
    },
  };

  const currentConfig = statusConfig[status];

  return (
    <Card className="hover:shadow-elevated transition-all duration-200 cursor-pointer" onClick={() => onEdit?.(kpi)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold">{kpi.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{kpi.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={currentConfig.badgeVariant} className="text-xs">
              {currentConfig.label}
            </Badge>
            {status === 'critical' && <AlertTriangle className="h-4 w-4 text-destructive" />}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current vs Target */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t('kpi.current')}</span>
            <span className="text-2xl font-bold">
              {formatNumber(kpi.current)} {kpi.unit}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{t('kpi.target')}: {formatNumber(kpi.target)} {kpi.unit}</span>
            <span>{percentage.toFixed(1)}%</span>
          </div>
          
          <Progress
            value={percentage}
            className="h-2"
            style={{
              '--progress-background': `hsl(var(--muted))`,
              '--progress-foreground': `var(--chart-${status === 'good' ? '2' : status === 'warning' ? '4' : '5'})`,
            } as React.CSSProperties}
          />
        </div>

        {/* Trend */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            {kpi.trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-accent" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm font-medium">{t('kpi.trend')}</span>
          </div>
          <span className={cn(
            "text-sm font-medium",
            kpi.trend > 0 ? "text-accent" : "text-destructive"
          )}>
            {kpi.trend > 0 ? '+' : ''}{kpi.trend.toFixed(1)}%
          </span>
        </div>

        {/* Performance Indicator */}
        <div className="flex items-center gap-2 pt-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {t('kpi.threshold')}: {kpi.threshold}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};