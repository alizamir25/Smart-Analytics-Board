export interface DashboardTemplate {
  id: string;
  name: string;
  category: 'sales' | 'marketing' | 'operations';
  description: string;
  preview: string;
  widgets: TemplateWidget[];
  metrics: string[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface TemplateWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'map' | 'heatmap';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  sampleData?: any[];
}

export interface ClonedTemplate {
  id: string;
  templateId: string;
  name: string;
  customizations: TemplateCustomization[];
  createdAt: Date;
  lastModified: Date;
}

export interface TemplateCustomization {
  widgetId: string;
  property: string;
  value: any;
  timestamp: Date;
}