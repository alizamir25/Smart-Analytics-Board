import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { KPI } from "./KPICard";

interface AddKPIDialogProps {
  onAdd: (kpi: Omit<KPI, 'id' | 'lastUpdated'>) => void;
}

const categories = [
  'Sales',
  'Marketing',
  'Operations',
  'Finance',
  'Customer Service',
  'HR',
  'IT',
  'Quality',
];

const units = [
  '%',
  '$',
  '€',
  '£',
  'units',
  'hours',
  'days',
  'score',
];

export const AddKPIDialog = ({ onAdd }: AddKPIDialogProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    current: 0,
    target: 0,
    threshold: 90,
    unit: '%',
    trend: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return;
    
    onAdd(formData);
    setFormData({
      name: '',
      category: '',
      current: 0,
      target: 0,
      threshold: 90,
      unit: '%',
      trend: 0,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t('kpi.addNew')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('kpi.addNew')}</DialogTitle>
          <DialogDescription>
            Set targets and thresholds for tracking performance metrics.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="col-span-3"
              placeholder="e.g., Revenue Growth"
              required
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current" className="text-right">
              {t('kpi.current')}
            </Label>
            <Input
              id="current"
              type="number"
              value={formData.current}
              onChange={(e) => setFormData(prev => ({ ...prev, current: Number(e.target.value) }))}
              className="col-span-3"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target" className="text-right">
              {t('kpi.target')}
            </Label>
            <Input
              id="target"
              type="number"
              value={formData.target}
              onChange={(e) => setFormData(prev => ({ ...prev, target: Number(e.target.value) }))}
              className="col-span-3"
              placeholder="100"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="threshold" className="text-right">
              {t('kpi.threshold')} (%)
            </Label>
            <Input
              id="threshold"
              type="number"
              min="0"
              max="100"
              value={formData.threshold}
              onChange={(e) => setFormData(prev => ({ ...prev, threshold: Number(e.target.value) }))}
              className="col-span-3"
              placeholder="90"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">
              Unit
            </Label>
            <Select
              value={formData.unit}
              onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};