import { DataLineageViewer } from "@/components/lineage/DataLineageViewer";
import { QualityMetrics } from "@/components/quality/QualityMetrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Shield, 
  RefreshCw, 
  Download, 
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const DataLineageQuality = () => {
  const { t } = useLanguage();

  const qualityTrends = [
    { period: 'Last 7 days', score: 87, change: '+2%' },
    { period: 'Last 30 days', score: 85, change: '+5%' },
    { period: 'Last 90 days', score: 82, change: '+8%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{t('dataLineage.pageTitle')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('dataLineage.pageDescription')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t('common.exportReport')}
          </Button>
          <Button size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('common.refreshData')}
          </Button>
        </div>
      </div>

      {/* Quality Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t('quality.currentScore')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              +2% from last week
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              {t('dataLineage.activeSources')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center gap-1">
              <Badge variant="default" className="text-xs">All healthy</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {t('quality.activeIssues')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">1 high priority</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="lineage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lineage" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            {t('dataLineage.title')}
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('quality.title')}
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('quality.trends')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lineage" className="space-y-4">
          <DataLineageViewer />
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <QualityMetrics />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('quality.historicalTrends')}
              </CardTitle>
              <CardDescription>
                {t('quality.trendsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="font-medium">{trend.period}</div>
                      <div className="text-sm text-muted-foreground">Average quality score</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold">{trend.score}%</div>
                      <Badge variant="default" className="text-green-600">
                        {trend.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};