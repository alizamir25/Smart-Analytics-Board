import { DashboardTemplate } from '@/types/templates';

export const dashboardTemplates: DashboardTemplate[] = [
  {
    id: 'sales-overview',
    name: 'Sales Performance Dashboard',
    category: 'sales',
    description: 'Comprehensive sales tracking with revenue metrics, conversion rates, and sales pipeline analysis.',
    preview: '/api/placeholder/400/300',
    difficulty: 'beginner',
    metrics: ['Revenue', 'Conversion Rate', 'Sales Pipeline', 'Lead Generation', 'Customer Acquisition Cost'],
    tags: ['revenue', 'leads', 'pipeline', 'performance'],
    widgets: [
      {
        id: 'revenue-chart',
        type: 'chart',
        title: 'Monthly Revenue Trend',
        size: 'large',
        position: { x: 0, y: 0, w: 8, h: 4 },
        config: {
          chartType: 'line',
          dataKey: 'revenue',
          color: 'hsl(var(--chart-1))'
        },
        sampleData: [
          { month: 'Jan', revenue: 65000, target: 60000 },
          { month: 'Feb', revenue: 78000, target: 65000 },
          { month: 'Mar', revenue: 82000, target: 70000 },
          { month: 'Apr', revenue: 94000, target: 75000 },
          { month: 'May', revenue: 88000, target: 80000 },
          { month: 'Jun', revenue: 102000, target: 85000 }
        ]
      },
      {
        id: 'conversion-metric',
        type: 'metric',
        title: 'Conversion Rate',
        size: 'small',
        position: { x: 8, y: 0, w: 4, h: 2 },
        config: {
          value: '12.5%',
          change: '+2.1%',
          trend: 'up'
        }
      },
      {
        id: 'pipeline-chart',
        type: 'chart',
        title: 'Sales Pipeline',
        size: 'medium',
        position: { x: 8, y: 2, w: 4, h: 3 },
        config: {
          chartType: 'funnel',
          stages: ['Leads', 'Qualified', 'Proposal', 'Negotiation', 'Closed']
        },
        sampleData: [
          { stage: 'Leads', count: 1250, value: 500000 },
          { stage: 'Qualified', count: 875, value: 420000 },
          { stage: 'Proposal', count: 320, value: 280000 },
          { stage: 'Negotiation', count: 180, value: 220000 },
          { stage: 'Closed', count: 95, value: 180000 }
        ]
      },
      {
        id: 'top-products',
        type: 'table',
        title: 'Top Performing Products',
        size: 'medium',
        position: { x: 0, y: 4, w: 6, h: 3 },
        config: {
          columns: ['Product', 'Sales', 'Revenue', 'Growth'],
          sortBy: 'revenue'
        },
        sampleData: [
          { product: 'Enterprise Suite', sales: 145, revenue: 87000, growth: 15.2 },
          { product: 'Professional Plan', sales: 320, revenue: 64000, growth: 8.7 },
          { product: 'Starter Package', sales: 580, revenue: 29000, growth: 22.1 }
        ]
      },
      {
        id: 'sales-map',
        type: 'map',
        title: 'Sales by Region',
        size: 'medium',
        position: { x: 6, y: 4, w: 6, h: 3 },
        config: {
          mapType: 'geo',
          colorScale: 'blue'
        },
        sampleData: [
          { region: 'North America', sales: 145000, lat: 45, lng: -100 },
          { region: 'Europe', sales: 98000, lat: 50, lng: 10 },
          { region: 'Asia Pacific', sales: 122000, lat: 35, lng: 120 }
        ]
      }
    ]
  },
  {
    id: 'marketing-analytics',
    name: 'Marketing Performance Dashboard',
    category: 'marketing',
    description: 'Track campaign performance, customer acquisition, and marketing ROI across all channels.',
    preview: '/api/placeholder/400/300',
    difficulty: 'intermediate',
    metrics: ['ROAS', 'CTR', 'CAC', 'LTV', 'Campaign Performance'],
    tags: ['campaigns', 'roi', 'acquisition', 'channels'],
    widgets: [
      {
        id: 'campaign-performance',
        type: 'chart',
        title: 'Campaign Performance Overview',
        size: 'large',
        position: { x: 0, y: 0, w: 8, h: 4 },
        config: {
          chartType: 'bar',
          dataKeys: ['impressions', 'clicks', 'conversions'],
          colors: ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))']
        },
        sampleData: [
          { campaign: 'Google Ads', impressions: 125000, clicks: 3200, conversions: 185, cost: 8500 },
          { campaign: 'Facebook', impressions: 98000, clicks: 2800, conversions: 165, cost: 6200 },
          { campaign: 'LinkedIn', impressions: 45000, clicks: 1200, conversions: 95, cost: 4800 },
          { campaign: 'Twitter', impressions: 32000, clicks: 850, conversions: 42, cost: 2100 }
        ]
      },
      {
        id: 'roas-metric',
        type: 'metric',
        title: 'ROAS',
        size: 'small',
        position: { x: 8, y: 0, w: 2, h: 2 },
        config: {
          value: '4.2x',
          change: '+0.8x',
          trend: 'up'
        }
      },
      {
        id: 'ctr-metric',
        type: 'metric',
        title: 'Avg CTR',
        size: 'small',
        position: { x: 10, y: 0, w: 2, h: 2 },
        config: {
          value: '2.8%',
          change: '+0.3%',
          trend: 'up'
        }
      },
      {
        id: 'channel-heatmap',
        type: 'heatmap',
        title: 'Channel Performance Heatmap',
        size: 'medium',
        position: { x: 8, y: 2, w: 4, h: 3 },
        config: {
          xAxis: 'time',
          yAxis: 'channel',
          valueKey: 'performance'
        },
        sampleData: [
          { channel: 'Google Ads', hour: '9AM', performance: 85 },
          { channel: 'Facebook', hour: '9AM', performance: 72 },
          { channel: 'LinkedIn', hour: '9AM', performance: 45 },
          { channel: 'Google Ads', hour: '12PM', performance: 92 },
          { channel: 'Facebook', hour: '12PM', performance: 88 },
          { channel: 'LinkedIn', hour: '12PM', performance: 65 }
        ]
      },
      {
        id: 'acquisition-funnel',
        type: 'chart',
        title: 'Customer Acquisition Funnel',
        size: 'medium',
        position: { x: 0, y: 4, w: 4, h: 3 },
        config: {
          chartType: 'funnel',
          stages: ['Visitors', 'Leads', 'MQLs', 'SQLs', 'Customers']
        },
        sampleData: [
          { stage: 'Visitors', count: 25000 },
          { stage: 'Leads', count: 5200 },
          { stage: 'MQLs', count: 1800 },
          { stage: 'SQLs', count: 650 },
          { stage: 'Customers', count: 185 }
        ]
      },
      {
        id: 'roi-trend',
        type: 'chart',
        title: 'Monthly ROI Trend',
        size: 'medium',
        position: { x: 4, y: 4, w: 4, h: 3 },
        config: {
          chartType: 'area',
          dataKey: 'roi',
          color: 'hsl(var(--chart-2))'
        },
        sampleData: [
          { month: 'Jan', roi: 3.2, spend: 15000 },
          { month: 'Feb', roi: 3.8, spend: 18000 },
          { month: 'Mar', roi: 4.1, spend: 22000 },
          { month: 'Apr', roi: 4.5, spend: 25000 },
          { month: 'May', roi: 4.2, spend: 28000 },
          { month: 'Jun', roi: 4.8, spend: 32000 }
        ]
      }
    ]
  },
  {
    id: 'operations-dashboard',
    name: 'Operations Excellence Dashboard',
    category: 'operations',
    description: 'Monitor operational efficiency, resource utilization, and process optimization metrics.',
    preview: '/api/placeholder/400/300',
    difficulty: 'advanced',
    metrics: ['OEE', 'Throughput', 'Quality Score', 'Resource Utilization', 'Process Efficiency'],
    tags: ['efficiency', 'resources', 'quality', 'processes'],
    widgets: [
      {
        id: 'oee-gauge',
        type: 'metric',
        title: 'Overall Equipment Effectiveness',
        size: 'medium',
        position: { x: 0, y: 0, w: 3, h: 3 },
        config: {
          type: 'gauge',
          value: 78.5,
          max: 100,
          unit: '%',
          thresholds: [60, 80, 95]
        }
      },
      {
        id: 'throughput-chart',
        type: 'chart',
        title: 'Daily Throughput',
        size: 'large',
        position: { x: 3, y: 0, w: 6, h: 3 },
        config: {
          chartType: 'line',
          dataKeys: ['actual', 'target'],
          colors: ['hsl(var(--chart-1))', 'hsl(var(--chart-4))']
        },
        sampleData: [
          { day: 'Mon', actual: 2850, target: 3000, efficiency: 95 },
          { day: 'Tue', actual: 2920, target: 3000, efficiency: 97 },
          { day: 'Wed', actual: 2780, target: 3000, efficiency: 93 },
          { day: 'Thu', actual: 3150, target: 3000, efficiency: 105 },
          { day: 'Fri', actual: 2980, target: 3000, efficiency: 99 },
          { day: 'Sat', actual: 2650, target: 2800, efficiency: 95 },
          { day: 'Sun', actual: 2420, target: 2500, efficiency: 97 }
        ]
      },
      {
        id: 'quality-metric',
        type: 'metric',
        title: 'Quality Score',
        size: 'small',
        position: { x: 9, y: 0, w: 3, h: 1.5 },
        config: {
          value: '96.2%',
          change: '+1.2%',
          trend: 'up'
        }
      },
      {
        id: 'defect-rate',
        type: 'metric',
        title: 'Defect Rate',
        size: 'small',
        position: { x: 9, y: 1.5, w: 3, h: 1.5 },
        config: {
          value: '0.8%',
          change: '-0.3%',
          trend: 'down'
        }
      },
      {
        id: 'resource-utilization',
        type: 'chart',
        title: 'Resource Utilization',
        size: 'medium',
        position: { x: 0, y: 3, w: 4, h: 3 },
        config: {
          chartType: 'radar',
          dataKeys: ['utilization'],
          resources: ['Manufacturing', 'Logistics', 'Quality Control', 'Maintenance', 'Planning']
        },
        sampleData: [
          { resource: 'Manufacturing', utilization: 85, capacity: 100 },
          { resource: 'Logistics', utilization: 72, capacity: 100 },
          { resource: 'Quality Control', utilization: 91, capacity: 100 },
          { resource: 'Maintenance', utilization: 68, capacity: 100 },
          { resource: 'Planning', utilization: 88, capacity: 100 }
        ]
      },
      {
        id: 'process-efficiency',
        type: 'table',
        title: 'Process Efficiency Metrics',
        size: 'medium',
        position: { x: 4, y: 3, w: 4, h: 3 },
        config: {
          columns: ['Process', 'Efficiency', 'Target', 'Status'],
          sortBy: 'efficiency'
        },
        sampleData: [
          { process: 'Assembly Line A', efficiency: 94.2, target: 92, status: 'Above Target' },
          { process: 'Assembly Line B', efficiency: 89.8, target: 92, status: 'Below Target' },
          { process: 'Quality Check', efficiency: 96.5, target: 95, status: 'Above Target' },
          { process: 'Packaging', efficiency: 91.2, target: 90, status: 'Above Target' },
          { process: 'Shipping', efficiency: 87.4, target: 88, status: 'Below Target' }
        ]
      },
      {
        id: 'maintenance-schedule',
        type: 'chart',
        title: 'Maintenance Schedule',
        size: 'medium',
        position: { x: 8, y: 3, w: 4, h: 3 },
        config: {
          chartType: 'gantt',
          timeScale: 'weekly'
        },
        sampleData: [
          { equipment: 'Line A', maintenance: 'Scheduled', start: '2024-01-15', duration: 4 },
          { equipment: 'Line B', maintenance: 'Preventive', start: '2024-01-18', duration: 2 },
          { equipment: 'QC Station', maintenance: 'Repair', start: '2024-01-20', duration: 6 },
          { equipment: 'Packaging', maintenance: 'Upgrade', start: '2024-01-25', duration: 8 }
        ]
      }
    ]
  },
  {
    id: 'executive-summary',
    name: 'Executive Summary Dashboard',
    category: 'sales',
    description: 'High-level KPIs and strategic metrics for executive decision making.',
    preview: '/api/placeholder/400/300',
    difficulty: 'intermediate',
    metrics: ['Revenue Growth', 'Profit Margin', 'Market Share', 'Customer Satisfaction', 'Employee Productivity'],
    tags: ['executive', 'kpis', 'strategic', 'summary'],
    widgets: [
      {
        id: 'revenue-growth',
        type: 'metric',
        title: 'YoY Revenue Growth',
        size: 'small',
        position: { x: 0, y: 0, w: 2, h: 2 },
        config: {
          value: '18.5%',
          change: '+3.2%',
          trend: 'up'
        }
      },
      {
        id: 'profit-margin',
        type: 'metric',
        title: 'Profit Margin',
        size: 'small',
        position: { x: 2, y: 0, w: 2, h: 2 },
        config: {
          value: '24.8%',
          change: '+1.5%',
          trend: 'up'
        }
      },
      {
        id: 'market-share',
        type: 'metric',
        title: 'Market Share',
        size: 'small',
        position: { x: 4, y: 0, w: 2, h: 2 },
        config: {
          value: '12.3%',
          change: '+0.8%',
          trend: 'up'
        }
      },
      {
        id: 'financial-overview',
        type: 'chart',
        title: 'Financial Performance Overview',
        size: 'large',
        position: { x: 6, y: 0, w: 6, h: 4 },
        config: {
          chartType: 'combo',
          primaryKey: 'revenue',
          secondaryKey: 'profit'
        },
        sampleData: [
          { quarter: 'Q1 2023', revenue: 2.1, profit: 0.52, margin: 24.8 },
          { quarter: 'Q2 2023', revenue: 2.3, profit: 0.58, margin: 25.2 },
          { quarter: 'Q3 2023', revenue: 2.5, profit: 0.63, margin: 25.2 },
          { quarter: 'Q4 2023', revenue: 2.8, profit: 0.71, margin: 25.4 }
        ]
      }
    ]
  },
  {
    id: 'customer-analytics',
    name: 'Customer Analytics Dashboard',
    category: 'marketing',
    description: 'Deep dive into customer behavior, satisfaction, and lifetime value metrics.',
    preview: '/api/placeholder/400/300',
    difficulty: 'intermediate',
    metrics: ['CLTV', 'Churn Rate', 'NPS', 'Customer Satisfaction', 'Retention Rate'],
    tags: ['customers', 'analytics', 'satisfaction', 'retention'],
    widgets: [
      {
        id: 'cltv-metric',
        type: 'metric',
        title: 'Customer Lifetime Value',
        size: 'small',
        position: { x: 0, y: 0, w: 3, h: 2 },
        config: {
          value: '$1,250',
          change: '+$180',
          trend: 'up'
        }
      },
      {
        id: 'churn-rate',
        type: 'metric',
        title: 'Monthly Churn Rate',
        size: 'small',
        position: { x: 3, y: 0, w: 3, h: 2 },
        config: {
          value: '3.2%',
          change: '-0.8%',
          trend: 'down'
        }
      },
      {
        id: 'customer-segmentation',
        type: 'chart',
        title: 'Customer Segmentation',
        size: 'medium',
        position: { x: 6, y: 0, w: 6, h: 4 },
        config: {
          chartType: 'pie',
          dataKey: 'customers'
        },
        sampleData: [
          { segment: 'High Value', customers: 1250, revenue: 850000 },
          { segment: 'Medium Value', customers: 3200, revenue: 680000 },
          { segment: 'Low Value', customers: 5800, revenue: 290000 },
          { segment: 'At Risk', customers: 850, revenue: 120000 }
        ]
      }
    ]
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Dashboard',
    category: 'operations',
    description: 'Monitor inventory levels, supplier performance, and logistics efficiency.',
    preview: '/api/placeholder/400/300',
    difficulty: 'advanced',
    metrics: ['Inventory Turnover', 'Supplier Performance', 'Delivery Accuracy', 'Cost Optimization'],
    tags: ['supply-chain', 'inventory', 'logistics', 'suppliers'],
    widgets: [
      {
        id: 'inventory-levels',
        type: 'chart',
        title: 'Inventory Levels by Category',
        size: 'large',
        position: { x: 0, y: 0, w: 8, h: 4 },
        config: {
          chartType: 'stacked-bar',
          dataKeys: ['current', 'optimal', 'reorder']
        },
        sampleData: [
          { category: 'Raw Materials', current: 850, optimal: 900, reorder: 300 },
          { category: 'Components', current: 1200, optimal: 1100, reorder: 400 },
          { category: 'Finished Goods', current: 650, optimal: 800, reorder: 200 }
        ]
      },
      {
        id: 'supplier-performance',
        type: 'table',
        title: 'Top Suppliers Performance',
        size: 'medium',
        position: { x: 8, y: 0, w: 4, h: 4 },
        config: {
          columns: ['Supplier', 'Quality', 'Delivery', 'Cost'],
          sortBy: 'quality'
        },
        sampleData: [
          { supplier: 'Acme Corp', quality: 98.5, delivery: 96.2, cost: 92.1 },
          { supplier: 'Global Parts', quality: 97.8, delivery: 94.8, cost: 95.3 },
          { supplier: 'Tech Solutions', quality: 96.9, delivery: 98.1, cost: 88.7 }
        ]
      }
    ]
  }
];

export const getTemplatesByCategory = (category: string) => {
  return dashboardTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return dashboardTemplates.find(template => template.id === id);
};

export const searchTemplates = (query: string) => {
  const searchTerm = query.toLowerCase();
  return dashboardTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    template.metrics.some(metric => metric.toLowerCase().includes(searchTerm))
  );
};