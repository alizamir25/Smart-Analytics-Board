import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EyeOff, Plus, Edit, Trash2, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ColumnSecurityRule {
  id: string;
  tableName: string;
  columnName: string;
  ruleName: string;
  accessLevel: 'HIDDEN' | 'MASKED' | 'RESTRICTED' | 'VISIBLE';
  roles: string[];
  condition: string;
  enabled: boolean;
  description: string;
}

const mockColumnRules: ColumnSecurityRule[] = [
  {
    id: '1',
    tableName: 'customers',
    columnName: 'email',
    ruleName: 'PII Email Protection',
    accessLevel: 'MASKED',
    roles: ['analyst', 'viewer'],
    condition: 'role != \'admin\'',
    enabled: true,
    description: 'Mask email addresses for non-admin users'
  },
  {
    id: '2',
    tableName: 'employees',
    columnName: 'salary',
    ruleName: 'Salary Confidentiality',
    accessLevel: 'HIDDEN',
    roles: ['viewer'],
    condition: 'role = \'viewer\'',
    enabled: true,
    description: 'Hide salary information from viewers'
  },
  {
    id: '3',
    tableName: 'customers',
    columnName: 'phone',
    ruleName: 'Phone Number Security',
    accessLevel: 'RESTRICTED',
    roles: ['marketing'],
    condition: 'department != \'sales\'',
    enabled: false,
    description: 'Restrict phone access to sales team only'
  }
];

const getAccessLevelColor = (level: string) => {
  switch (level) {
    case 'HIDDEN': return 'destructive';
    case 'MASKED': return 'secondary';
    case 'RESTRICTED': return 'default';
    case 'VISIBLE': return 'outline';
    default: return 'outline';
  }
};

const getAccessLevelIcon = (level: string) => {
  switch (level) {
    case 'HIDDEN': return <EyeOff className="h-4 w-4" />;
    case 'MASKED': return <Shield className="h-4 w-4" />;
    case 'RESTRICTED': return <Users className="h-4 w-4" />;
    default: return <Shield className="h-4 w-4" />;
  }
};

export const ColumnLevelSecurity: React.FC = () => {
  const [rules, setRules] = useState<ColumnSecurityRule[]>(mockColumnRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
    toast({
      title: "Column Security Updated",
      description: "Column-level security rule status has been changed.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Column-Level Security
        </CardTitle>
        <CardDescription>
          Control access to specific columns based on user roles and conditions.
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
                Add Column Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Column Security Rule</DialogTitle>
                <DialogDescription>
                  Define column-level access controls for sensitive data fields.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tableName">Table Name</Label>
                    <Input id="tableName" placeholder="e.g., customers" />
                  </div>
                  <div>
                    <Label htmlFor="columnName">Column Name</Label>
                    <Input id="columnName" placeholder="e.g., email" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ruleName">Rule Name</Label>
                  <Input id="ruleName" placeholder="e.g., PII Email Protection" />
                </div>
                <div>
                  <Label htmlFor="accessLevel">Access Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VISIBLE">Visible - Show data as-is</SelectItem>
                      <SelectItem value="MASKED">Masked - Show partial data</SelectItem>
                      <SelectItem value="RESTRICTED">Restricted - Role-based access</SelectItem>
                      <SelectItem value="HIDDEN">Hidden - Completely hide column</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="roles">Affected Roles (comma-separated)</Label>
                  <Input id="roles" placeholder="e.g., analyst, viewer" />
                </div>
                <div>
                  <Label htmlFor="condition">Security Condition</Label>
                  <Textarea 
                    id="condition" 
                    placeholder="e.g., role != 'admin'"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe what this rule does..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-2 pt-4">
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
                        title: "Column Rule Created",
                        description: "New column-level security rule has been created.",
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
              <TableHead>Table.Column</TableHead>
              <TableHead>Rule Name</TableHead>
              <TableHead>Access Level</TableHead>
              <TableHead>Affected Roles</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-mono">
                  {rule.tableName}.{rule.columnName}
                </TableCell>
                <TableCell className="font-medium">{rule.ruleName}</TableCell>
                <TableCell>
                  <Badge variant={getAccessLevelColor(rule.accessLevel) as any}>
                    <div className="flex items-center gap-1">
                      {getAccessLevelIcon(rule.accessLevel)}
                      {rule.accessLevel}
                    </div>
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {rule.roles.map((role, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
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
                      {rule.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};