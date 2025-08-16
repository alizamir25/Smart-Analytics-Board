import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  Palette, 
  Upload, 
  Type, 
  Image as ImageIcon, 
  Download,
  Eye,
  RotateCcw
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

interface BrandingConfig {
  logo: string | null;
  companyName: string;
  colors: ColorPalette;
  fonts: {
    heading: string;
    body: string;
  };
}

export const ThemeManager = () => {
  const { t } = useLanguage();
  
  const [config, setConfig] = useState<BrandingConfig>({
    logo: null,
    companyName: "Your Company",
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#8b5cf6",
      background: "#ffffff",
      foreground: "#0f172a"
    },
    fonts: {
      heading: "Inter",
      body: "Inter"
    }
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = (colorKey: keyof ColorPalette, value: string) => {
    setConfig(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleFontChange = (fontType: 'heading' | 'body', value: string) => {
    setConfig(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontType]: value
      }
    }));
  };

  const predefinedPalettes = [
    {
      name: "Ocean Blue",
      colors: { primary: "#0ea5e9", secondary: "#64748b", accent: "#06b6d4", background: "#ffffff", foreground: "#0f172a" }
    },
    {
      name: "Forest Green",
      colors: { primary: "#10b981", secondary: "#64748b", accent: "#34d399", background: "#ffffff", foreground: "#0f172a" }
    },
    {
      name: "Sunset Orange",
      colors: { primary: "#f97316", secondary: "#64748b", accent: "#fb923c", background: "#ffffff", foreground: "#0f172a" }
    },
    {
      name: "Royal Purple",
      colors: { primary: "#8b5cf6", secondary: "#64748b", accent: "#a78bfa", background: "#ffffff", foreground: "#0f172a" }
    }
  ];

  const fontOptions = [
    "Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Source Sans Pro", "Raleway", "Poppins"
  ];

  const applyPalette = (palette: ColorPalette) => {
    setConfig(prev => ({ ...prev, colors: palette }));
  };

  const resetToDefault = () => {
    setConfig({
      logo: null,
      companyName: "Your Company",
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#8b5cf6",
        background: "#ffffff",
        foreground: "#0f172a"
      },
      fonts: {
        heading: "Inter",
        body: "Inter"
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{t('branding.themeManager')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('branding.customizeAppearance')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? t('common.exitPreview') : t('common.preview')}
          </Button>
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('common.reset')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="colors">{t('branding.colors')}</TabsTrigger>
          <TabsTrigger value="logo">{t('branding.logoAndBranding')}</TabsTrigger>
          <TabsTrigger value="fonts">{t('branding.typography')}</TabsTrigger>
          <TabsTrigger value="export">{t('branding.exportTheme')}</TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Color Picker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  {t('branding.customColors')}
                </CardTitle>
                <CardDescription>
                  {t('branding.adjustColors')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(config.colors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <Label className="w-20 capitalize">{key}</Label>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                        className="w-12 h-8 rounded border cursor-pointer"
                      />
                      <Input
                        value={value}
                        onChange={(e) => handleColorChange(key as keyof ColorPalette, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Predefined Palettes */}
            <Card>
              <CardHeader>
                <CardTitle>{t('branding.predefinedPalettes')}</CardTitle>
                <CardDescription>
                  {t('branding.quickColorSchemes')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {predefinedPalettes.map((palette) => (
                  <div key={palette.name} className="p-3 rounded-lg border hover:bg-accent cursor-pointer"
                       onClick={() => applyPalette(palette.colors)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{palette.name}</span>
                      <Button variant="ghost" size="sm">
                        {t('common.apply')}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {Object.values(palette.colors).slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Logo Tab */}
        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                {t('branding.logoUpload')}
              </CardTitle>
              <CardDescription>
                {t('branding.logoDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                {config.logo ? (
                  <div className="space-y-4">
                    <img src={config.logo} alt="Logo" className="mx-auto max-h-20" />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      {t('branding.changeLogo')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('branding.uploadLogo')}
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        PNG, JPG, SVG up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="company-name">{t('branding.companyName')}</Label>
                <Input
                  id="company-name"
                  value={config.companyName}
                  onChange={(e) => setConfig(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder={t('branding.enterCompanyName')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fonts Tab */}
        <TabsContent value="fonts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                {t('branding.typography')}
              </CardTitle>
              <CardDescription>
                {t('branding.selectFonts')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('branding.headingFont')}</Label>
                  <select
                    value={config.fonts.heading}
                    onChange={(e) => handleFontChange('heading', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                  <div className="p-3 border rounded-lg" style={{ fontFamily: config.fonts.heading }}>
                    <h3 className="text-lg font-bold">{t('branding.headingPreview')}</h3>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('branding.bodyFont')}</Label>
                  <select
                    value={config.fonts.body}
                    onChange={(e) => handleFontChange('body', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                  <div className="p-3 border rounded-lg" style={{ fontFamily: config.fonts.body }}>
                    <p>{t('branding.bodyPreview')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                {t('branding.exportTheme')}
              </CardTitle>
              <CardDescription>
                {t('branding.exportDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  {t('branding.downloadTheme')}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  {t('branding.importTheme')}
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">{t('branding.currentConfiguration')}</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(config, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Mode Overlay */}
      {previewMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{t('branding.themePreview')}</CardTitle>
              <CardDescription>
                {t('branding.previewDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="p-6 rounded-lg border-2"
                style={{ 
                  backgroundColor: config.colors.background,
                  color: config.colors.foreground,
                  fontFamily: config.fonts.body
                }}
              >
                <h1 
                  className="text-2xl font-bold mb-4"
                  style={{ 
                    color: config.colors.primary,
                    fontFamily: config.fonts.heading
                  }}
                >
                  {config.companyName}
                </h1>
                <p className="mb-4">
                  This is how your dashboard will look with the selected theme.
                </p>
                <div className="flex gap-2">
                  <Badge style={{ backgroundColor: config.colors.primary }}>
                    Primary
                  </Badge>
                  <Badge 
                    variant="secondary"
                    style={{ backgroundColor: config.colors.secondary }}
                  >
                    Secondary
                  </Badge>
                  <Badge style={{ backgroundColor: config.colors.accent }}>
                    Accent
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setPreviewMode(false)}>
                  {t('common.close')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};