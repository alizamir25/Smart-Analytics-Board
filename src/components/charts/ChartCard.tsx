import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  value?: string | number;
  change?: number;
  children: ReactNode;
  className?: string;
}

export const ChartCard = ({ 
  title, 
  description, 
  value, 
  change, 
  children, 
  className 
}: ChartCardProps) => {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-accent" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return "";
    if (change > 0) return "text-accent";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card className={cn("shadow-card hover:shadow-elevated transition-shadow duration-200", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          {value && (
            <div className="text-right">
              <div className="text-2xl font-bold">{value}</div>
              {change !== undefined && (
                <div className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
                  {getTrendIcon()}
                  <span>{Math.abs(change)}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};