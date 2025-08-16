import { ThemeManager } from "@/components/branding/ThemeManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Palette, 
  Eye, 
  Download, 
  Upload,
  Settings,
  Sparkles,
  FileText
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const CustomBranding = () => {
  const { t } = useLanguage();

  const brandingFeatures = [
    {
      title: t('branding.customColors'),
      description: t('branding.colorDescription'),
      icon: <Palette className="h-5 w-5" />,
      status: 'Available'
    },
    {
      title: t('branding.logoUpload'),
      description: t('branding.logoFeatureDescription'),
      icon: <Upload className="h-5 w-5" />,
      status: 'Available'
    },
    {
      title: t('branding.customFonts'),
      description: t('branding.fontDescription'),
      icon: <FileText className="h-5 w-5" />,
      status: 'Available'
    },
    {
      title: t('branding.whiteLabel'),
      description: t('branding.whiteLabelDescription'),
      icon: <Sparkles className="h-5 w-5" />,
      status: 'Pro Feature'
    }
  ];

  const exportFormats = [
    {
      name: 'PDF Reports',
      description: 'Generate branded PDF reports with your logo and colors',
      icon: <FileText className="h-4 w-4" />
    },
    {
      name: 'Dashboard Screenshots',
      description: 'Export dashboard images with custom branding',
      icon: <Eye className="h-4 w-4" />
    },
    {
      name: 'Embedded Widgets',
      description: 'Embed charts with your brand styling',
      icon: <Settings className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{t('branding.customBranding')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('branding.brandingDescription')}
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          {t('branding.exportBrandKit')}
        </Button>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {brandingFeatures.map((feature) => (
          <Card key={feature.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {feature.icon}
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {feature.description}
              </p>
              <Badge 
                variant={feature.status === 'Available' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {feature.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList>
          <TabsTrigger value="theme">{t('branding.themeCustomization')}</TabsTrigger>
          <TabsTrigger value="exports">{t('branding.brandedExports')}</TabsTrigger>
          <TabsTrigger value="templates">{t('branding.brandTemplates')}</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <ThemeManager />
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                {t('branding.brandedExports')}
              </CardTitle>
              <CardDescription>
                {t('branding.exportDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exportFormats.map((format) => (
                  <div key={format.name} className="p-4 rounded-lg border hover:bg-accent cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      {format.icon}
                      <h4 className="font-medium">{format.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {format.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('common.configure')}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('branding.brandTemplates')}
              </CardTitle>
              <CardDescription>
                {t('branding.templatesDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">{t('branding.comingSoon')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('branding.templatesComingSoon')}
                </p>
                <Button variant="outline">
                  {t('branding.notifyWhenReady')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};