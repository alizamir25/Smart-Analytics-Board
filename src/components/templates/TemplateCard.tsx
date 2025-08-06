import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Copy, 
  Eye, 
  BarChart3,
  TrendingUp,
  Target,
  Settings,
  Loader2
} from 'lucide-react';
import { DashboardTemplate } from '@/types/templates';
import { cn } from '@/lib/utils';

interface TemplateCardProps {
  template: DashboardTemplate;
  onClone: (template: DashboardTemplate, customName?: string) => Promise<any>;
  isCloning?: boolean;
}

const categoryIcons = {
  sales: TrendingUp,
  marketing: Target,
  operations: Settings
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

export const TemplateCard = ({ template, onClone, isCloning = false }: TemplateCardProps) => {
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [customName, setCustomName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const CategoryIcon = categoryIcons[template.category];

  const handleClone = async (useCustomName = false) => {
    try {
      await onClone(template, useCustomName ? customName : undefined);
      setShowCloneDialog(false);
      setCustomName('');
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <>
      <Card className="group hover:shadow-elevated transition-all duration-300 border-border hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <CategoryIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                <CardDescription className="text-sm">
                  {template.category.charAt(0).toUpperCase() + template.category.slice(1)} Dashboard
                </CardDescription>
              </div>
            </div>
            <Badge 
              variant="secondary" 
              className={cn("text-xs", difficultyColors[template.difficulty])}
            >
              {template.difficulty}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {template.description}
          </p>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-2">Key Metrics</h4>
              <div className="flex flex-wrap gap-1">
                {template.metrics.slice(0, 3).map(metric => (
                  <Badge key={metric} variant="outline" className="text-xs">
                    {metric}
                  </Badge>
                ))}
                {template.metrics.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.metrics.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Widgets Included</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BarChart3 className="h-3 w-3" />
                <span>{template.widgets.length} interactive widgets</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            
            <Dialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
              <DialogTrigger asChild>
                <Button 
                  size="sm" 
                  className="flex-1"
                  disabled={isCloning}
                >
                  {isCloning ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  Clone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clone Template</DialogTitle>
                  <DialogDescription>
                    Choose a name for your cloned dashboard template.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Dashboard Name</Label>
                    <Input
                      id="template-name"
                      placeholder={`${template.name} (Copy)`}
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleClone(false)}
                      disabled={isCloning}
                      className="flex-1"
                    >
                      {isCloning ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Use Default Name
                    </Button>
                    <Button 
                      onClick={() => handleClone(true)}
                      disabled={isCloning || !customName.trim()}
                      className="flex-1"
                    >
                      {isCloning ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Clone with Custom Name
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CategoryIcon className="h-5 w-5 text-primary" />
              {template.name}
            </DialogTitle>
            <DialogDescription>
              {template.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Key Metrics</h4>
                <div className="space-y-1">
                  {template.metrics.map(metric => (
                    <div key={metric} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Widget Details</h4>
                <div className="space-y-1">
                  {template.widgets.map(widget => (
                    <div key={widget.id} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                      {widget.title} ({widget.type})
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Template Preview</h4>
              <div className="grid grid-cols-12 gap-2 h-40 bg-background border rounded">
                {template.widgets.map(widget => (
                  <div 
                    key={widget.id}
                    className="bg-card border rounded flex items-center justify-center text-xs font-medium text-muted-foreground"
                    style={{
                      gridColumn: `span ${widget.position.w}`,
                      gridRow: `span ${Math.min(widget.position.h, 4)}`
                    }}
                  >
                    {widget.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};