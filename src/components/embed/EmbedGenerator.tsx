import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Code } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface EmbedOptions {
  width: string;
  height: string;
  theme: 'light' | 'dark' | 'auto';
  showHeader: boolean;
  showFooter: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  allowInteraction: boolean;
}

export const EmbedGenerator = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<EmbedOptions>({
    width: '100%',
    height: '600px',
    theme: 'auto',
    showHeader: true,
    showFooter: false,
    autoRefresh: true,
    refreshInterval: 30,
    allowInteraction: true,
  });

  const baseUrl = window.location.origin;
  const embedUrl = `${baseUrl}/embed/dashboard?theme=${options.theme}&header=${options.showHeader}&footer=${options.showFooter}&refresh=${options.autoRefresh ? options.refreshInterval : 0}&interactive=${options.allowInteraction}`;

  const embedCode = `<iframe 
  src="${embedUrl}"
  width="${options.width}"
  height="${options.height}"
  frameborder="0"
  style="border: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  allowtransparency="true"
  ${options.allowInteraction ? 'allow="clipboard-write"' : ''}
></iframe>`;

  const reactCode = `import React from 'react';

const DashboardEmbed = () => (
  <iframe 
    src="${embedUrl}"
    width="${options.width}"
    height="${options.height}"
    frameBorder="0"
    style={{
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    }}
    allowTransparency="true"
    ${options.allowInteraction ? 'allow="clipboard-write"' : ''}
  />
);

export default DashboardEmbed;`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: t('embed.copied'),
        description: `${type} code copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: t('common.error'),
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              {t('embed.options')}
            </CardTitle>
            <CardDescription>
              Customize how your dashboard appears when embedded
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  value={options.width}
                  onChange={(e) => setOptions(prev => ({ ...prev, width: e.target.value }))}
                  placeholder="100%"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={options.height}
                  onChange={(e) => setOptions(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="600px"
                />
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <Label htmlFor="theme">{t('embed.theme')}</Label>
              <Select
                value={options.theme}
                onValueChange={(value: 'light' | 'dark' | 'auto') => 
                  setOptions(prev => ({ ...prev, theme: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Layout Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showHeader">Show Header</Label>
                <Switch
                  id="showHeader"
                  checked={options.showHeader}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, showHeader: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showFooter">Show Footer</Label>
                <Switch
                  id="showFooter"
                  checked={options.showFooter}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, showFooter: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="allowInteraction">Allow Interaction</Label>
                <Switch
                  id="allowInteraction"
                  checked={options.allowInteraction}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, allowInteraction: checked }))
                  }
                />
              </div>
            </div>

            {/* Auto Refresh */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoRefresh">{t('embed.autoRefresh')}</Label>
                <Switch
                  id="autoRefresh"
                  checked={options.autoRefresh}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, autoRefresh: checked }))
                  }
                />
              </div>
              
              {options.autoRefresh && (
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    min="10"
                    max="3600"
                    value={options.refreshInterval}
                    onChange={(e) => 
                      setOptions(prev => ({ ...prev, refreshInterval: Number(e.target.value) }))
                    }
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              {t('embed.preview')}
            </CardTitle>
            <CardDescription>
              See how your embedded dashboard will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="aspect-video bg-gradient-dashboard rounded border border-border flex items-center justify-center text-sm text-muted-foreground">
                <div className="text-center space-y-2">
                  <div className="w-8 h-8 bg-primary/20 rounded mx-auto flex items-center justify-center">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <p>Dashboard Preview</p>
                  <div className="flex gap-2 justify-center">
                    <Badge variant="outline" className="text-xs">
                      {options.theme} theme
                    </Badge>
                    {options.autoRefresh && (
                      <Badge variant="outline" className="text-xs">
                        Auto-refresh: {options.refreshInterval}s
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Embed URL:</p>
              <div className="flex gap-2">
                <Input value={embedUrl} readOnly className="text-xs" />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(embedUrl, 'URL')}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HTML Embed Code */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>HTML Embed Code</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(embedCode, 'HTML')}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {t('embed.copy')}
              </Button>
            </div>
            <CardDescription>
              Use this code to embed the dashboard in any HTML page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={embedCode}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* React Component */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>React Component</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(reactCode, 'React')}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {t('embed.copy')}
              </Button>
            </div>
            <CardDescription>
              Ready-to-use React component for your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={reactCode}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};