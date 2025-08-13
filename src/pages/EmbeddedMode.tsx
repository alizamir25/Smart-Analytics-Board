import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmbedGenerator } from "@/components/embed/EmbedGenerator";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Code, 
  ExternalLink, 
  Shield, 
  Zap, 
  Palette, 
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";

export const EmbeddedMode = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure Embedding",
      description: "All embedded dashboards are served over HTTPS with proper CORS headers",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Fast Loading",
      description: "Optimized for quick loading with minimal resource usage",
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: "Theme Support",
      description: "Automatic light/dark theme detection or manual override",
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      title: "Auto Refresh",
      description: "Configurable auto-refresh intervals for real-time data",
    },
    {
      icon: <Monitor className="h-5 w-5" />,
      title: "Responsive Design",
      description: "Adapts to different screen sizes and orientations",
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Mobile Optimized",
      description: "Touch-friendly interface for mobile and tablet devices",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{t('embed.title')}</h1>
          <p className="text-muted-foreground mt-2">
            Generate embed codes to display your dashboards in external applications
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1">
            <Code className="h-3 w-3" />
            HTML
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <ExternalLink className="h-3 w-3" />
            React
          </Badge>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-elevated transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Embed Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            {t('embed.generate')}
          </CardTitle>
          <CardDescription>
            Configure and generate embed codes for your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmbedGenerator />
        </CardContent>
      </Card>

      {/* Integration Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>
            Common scenarios for embedding dashboards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Website Integration</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Company websites</li>
                <li>• Client portals</li>
                <li>• Internal wikis</li>
                <li>• Documentation sites</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Application Integration</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• React/Vue applications</li>
                <li>• CRM systems</li>
                <li>• Project management tools</li>
                <li>• Business intelligence platforms</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Communication Platforms</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Slack/Teams integrations</li>
                <li>• Email newsletters</li>
                <li>• Presentation tools</li>
                <li>• Digital signage</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Content Management</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• WordPress sites</li>
                <li>• Notion pages</li>
                <li>• Confluence</li>
                <li>• SharePoint</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};