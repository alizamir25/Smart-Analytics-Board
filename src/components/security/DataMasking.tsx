import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { EyeOff, Plus, Edit, Trash, CreditCard, Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MaskingRule {
  id: string;
  fieldName: string;
  tableName: string;
  maskingType: 'partial' | 'full' | 'hash' | 'redact';
  pattern: string;
  enabled: boolean;
  description: string;
}

const mockMaskingRules: MaskingRule[] = [
  {
    id: '1',
    fieldName: 'credit_card',
    tableName: 'payments',
    maskingType: 'partial',
    pattern: 'XXXX-XXXX-XXXX-****',
    enabled: true,
    description: 'Mask credit card numbers, show last 4 digits'
  },
  {
    id: '2',
    fieldName: 'email',
    tableName: 'customers',
    maskingType: 'partial',
    pattern: '***@***.com',
    enabled: true,
    description: 'Partial email masking for privacy'
  },
  {
    id: '3',
    fieldName: 'ssn',
    tableName: 'employees',
    maskingType: 'full',
    pattern: 'XXX-XX-XXXX',
    enabled: true,
    description: 'Complete masking of social security numbers'
  },
  {
    id: '4',
    fieldName: 'salary',
    tableName: 'employees',
    maskingType: 'redact',
    pattern: '[REDACTED]',
    enabled: false,
    description: 'Hide salary information from unauthorized users'
  }
];

const getMaskingIcon = (type: string) => {
  switch (type) {
    case 'partial': return <EyeOff className="h-4 w-4" />;
    case 'full': return <EyeOff className="h-4 w-4" />;
    case 'hash': return <User className="h-4 w-4" />;
    case 'redact': return <EyeOff className="h-4 w-4" />;
    default: return <EyeOff className="h-4 w-4" />;
  }
};

const getMaskingColor = (type: string) => {
  switch (type) {
    case 'partial': return 'secondary';
    case 'full': return 'destructive';
    case 'hash': return 'default';
    case 'redact': return 'outline';
    default: return 'outline';
  }
};

// Demo component to show masking in action
const MaskedDataPreview: React.FC<{ rule: MaskingRule }> = ({ rule }) => {
  const originalData = {
    credit_card: '4532-1234-5678-9012',
    email: 'john.doe@company.com',
    ssn: '123-45-6789',
    salary: '$85,000'
  };

  const getMaskedValue = (fieldName: string, original: string, rule: MaskingRule) => {
    if (!rule.enabled) return original;
    
    switch (rule.maskingType) {
      case 'partial':
        if (fieldName === 'credit_card') return 'XXXX-XXXX-XXXX-9012';
        if (fieldName === 'email') return 'j***@c***.com';
        return original;
      case 'full':
        return rule.pattern;
      case 'redact':
        return '[REDACTED]';
      case 'hash':
        return 'a1b2c3d4e5f6';
      default:
        return original;
    }
  };

  const fieldKey = rule.fieldName as keyof typeof originalData;
  const original = originalData[fieldKey];
  const masked = getMaskedValue(rule.fieldName, original, rule);

  return (
    <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
      <div className="text-sm">
        <span className="font-medium">Original:</span> {original}
      </div>
      <div className="text-sm">
        <span className="font-medium">Masked:</span> {masked}
      </div>
    </div>
  );
};

export const DataMasking: React.FC = () => {
  const [rules, setRules] = useState<MaskingRule[]>(mockMaskingRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
    toast({
      title: "Masking Rule Updated",
      description: "Data masking rule status has been changed.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EyeOff className="h-5 w-5" />
            Data Masking Rules
          </CardTitle>
          <CardDescription>
            Configure data masking to protect sensitive information from unauthorized access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              {rules.filter(r => r.enabled).length} of {rules.length} rules active
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Masking Rule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Masking Rule</DialogTitle>
                  <DialogDescription>
                    Define how sensitive data should be masked when displayed to users.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tableName">Table Name</Label>
                    <Input id="tableName" placeholder="e.g., customers" />
                  </div>
                  <div>
                    <Label htmlFor="fieldName">Field Name</Label>
                    <Input id="fieldName" placeholder="e.g., credit_card" />
                  </div>
                  <div>
                    <Label htmlFor="maskingType">Masking Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select masking type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="partial">Partial (show some characters)</SelectItem>
                        <SelectItem value="full">Full (replace with pattern)</SelectItem>
                        <SelectItem value="hash">Hash (one-way encryption)</SelectItem>
                        <SelectItem value="redact">Redact (completely hide)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pattern">Masking Pattern</Label>
                    <Input id="pattern" placeholder="e.g., XXXX-XXXX-XXXX-****" />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsDialogOpen(false);
                        toast({
                          title: "Masking Rule Created",
                          description: "New data masking rule has been created successfully.",
                        });
                      }}
                      className="flex-1"
                    >
                      Create Rule
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table.Field</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Pattern</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-mono">
                    {rule.tableName}.{rule.fieldName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getMaskingColor(rule.maskingType) as any}>
                      <div className="flex items-center gap-1">
                        {getMaskingIcon(rule.maskingType)}
                        {rule.maskingType.toUpperCase()}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {rule.pattern}
                  </TableCell>
                  <TableCell className="max-w-xs text-sm text-muted-foreground">
                    {rule.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                      <span className="text-sm">
                        {rule.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Masking Preview</CardTitle>
          <CardDescription>
            See how your masking rules affect data display in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.slice(0, 3).map((rule) => (
              <MaskedDataPreview key={rule.id} rule={rule} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};