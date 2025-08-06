import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter,
  TrendingUp,
  Settings,
  BarChart3,
  Target
} from 'lucide-react';
import { dashboardTemplates, getTemplatesByCategory, searchTemplates } from '@/data/dashboardTemplates';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { useTemplateManagement } from '@/hooks/useTemplateManagement';

interface DashboardTemplatesProps {
  user: { email: string; role: 'admin' | 'analyst' | 'viewer' };
}

export const DashboardTemplates = ({ user }: DashboardTemplatesProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { cloneTemplate, isCloning } = useTemplateManagement();

  const filteredTemplates = searchQuery 
    ? searchTemplates(searchQuery)
    : selectedCategory === 'all' 
      ? dashboardTemplates 
      : getTemplatesByCategory(selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Templates</h1>
          <p className="text-muted-foreground">
            Choose from prebuilt templates for common business use cases. Clone and customize to fit your needs.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates, metrics, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by category:</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            All Templates
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Marketing
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Operations
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "Try adjusting your search terms or browse all categories."
                  : "Templates for this category are coming soon."
                }
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    onClone={cloneTemplate}
                    isCloning={isCloning}
                  />
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};