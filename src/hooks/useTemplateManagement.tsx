import { useState, useCallback } from 'react';
import { DashboardTemplate, ClonedTemplate, TemplateCustomization } from '@/types/templates';
import { useToast } from '@/hooks/use-toast';

export const useTemplateManagement = () => {
  const [clonedTemplates, setClonedTemplates] = useState<ClonedTemplate[]>([]);
  const [isCloning, setIsCloning] = useState(false);
  const { toast } = useToast();

  const cloneTemplate = useCallback(async (template: DashboardTemplate, customName?: string) => {
    setIsCloning(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const clonedTemplate: ClonedTemplate = {
        id: `cloned_${template.id}_${Date.now()}`,
        templateId: template.id,
        name: customName || `${template.name} (Copy)`,
        customizations: [],
        createdAt: new Date(),
        lastModified: new Date()
      };
      
      setClonedTemplates(prev => [...prev, clonedTemplate]);
      
      toast({
        title: "Template Cloned Successfully",
        description: `"${clonedTemplate.name}" has been added to your dashboards.`,
      });
      
      return clonedTemplate;
    } catch (error) {
      toast({
        title: "Clone Failed",
        description: "Failed to clone the template. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsCloning(false);
    }
  }, [toast]);

  const customizeTemplate = useCallback((templateId: string, customization: Omit<TemplateCustomization, 'timestamp'>) => {
    setClonedTemplates(prev => 
      prev.map(template => 
        template.id === templateId 
          ? {
              ...template,
              customizations: [...template.customizations, { ...customization, timestamp: new Date() }],
              lastModified: new Date()
            }
          : template
      )
    );
    
    toast({
      title: "Template Updated",
      description: "Your customizations have been saved.",
    });
  }, [toast]);

  const deleteClonedTemplate = useCallback((templateId: string) => {
    setClonedTemplates(prev => prev.filter(template => template.id !== templateId));
    
    toast({
      title: "Template Deleted",
      description: "The cloned template has been removed.",
    });
  }, [toast]);

  const duplicateClonedTemplate = useCallback(async (templateId: string) => {
    const template = clonedTemplates.find(t => t.id === templateId);
    if (!template) return;

    setIsCloning(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const duplicatedTemplate: ClonedTemplate = {
        ...template,
        id: `${template.id}_copy_${Date.now()}`,
        name: `${template.name} (Copy)`,
        createdAt: new Date(),
        lastModified: new Date()
      };
      
      setClonedTemplates(prev => [...prev, duplicatedTemplate]);
      
      toast({
        title: "Template Duplicated",
        description: `"${duplicatedTemplate.name}" has been created.`,
      });
      
      return duplicatedTemplate;
    } catch (error) {
      toast({
        title: "Duplication Failed",
        description: "Failed to duplicate the template. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsCloning(false);
    }
  }, [clonedTemplates, toast]);

  return {
    clonedTemplates,
    isCloning,
    cloneTemplate,
    customizeTemplate,
    deleteClonedTemplate,
    duplicateClonedTemplate
  };
};