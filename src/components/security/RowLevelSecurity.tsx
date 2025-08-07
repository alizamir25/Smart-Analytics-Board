import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Plus, Edit, Trash, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RLSPolicy {
  id: string;
  tableName: string;
  policyName: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  condition: string;
  role: string;
  enabled: boolean;
}

const mockPolicies: RLSPolicy[] = [
  {
    id: '1',
    tableName: 'customer_data',
    policyName: 'Department Access',
    operation: 'SELECT',
    condition: 'department = current_user_department()',
    role: 'authenticated',
    enabled: true
  },
  {
    id: '2',
    tableName: 'financial_records',
    policyName: 'Manager Only',
    operation: 'ALL',
    condition: 'user_role() = \'manager\'',
    role: 'authenticated',
    enabled: true
  },
  {
    id: '3',
    tableName: 'employee_salaries',
    policyName: 'HR Department',
    operation: 'SELECT',
    condition: 'department = \'HR\' OR user_id = auth.uid()',
    role: 'authenticated',
    enabled: false
  }
];

export const RowLevelSecurity: React.FC = () => {
  const [policies, setPolicies] = useState<RLSPolicy[]>(mockPolicies);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const togglePolicy = (id: string) => {
    setPolicies(prev => prev.map(policy => 
      policy.id === id ? { ...policy, enabled: !policy.enabled } : policy
    ));
    toast({
      title: "Policy Updated",
      description: "RLS policy status has been changed.",
    });
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'SELECT': return 'outline';
      case 'INSERT': return 'secondary';
      case 'UPDATE': return 'default';
      case 'DELETE': return 'destructive';
      case 'ALL': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Row-Level Security Policies
        </CardTitle>
        <CardDescription>
          Manage database access controls to ensure users only see data they're authorized to access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            {policies.filter(p => p.enabled).length} of {policies.length} policies active
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Policy
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create RLS Policy</DialogTitle>
                <DialogDescription>
                  Define a new row-level security policy for database access control.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tableName">Table Name</Label>
                  <Input id="tableName" placeholder="e.g., customer_data" />
                </div>
                <div>
                  <Label htmlFor="policyName">Policy Name</Label>
                  <Input id="policyName" placeholder="e.g., Department Access" />
                </div>
                <div>
                  <Label htmlFor="operation">Operation</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SELECT">SELECT</SelectItem>
                      <SelectItem value="INSERT">INSERT</SelectItem>
                      <SelectItem value="UPDATE">UPDATE</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="ALL">ALL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Textarea 
                    id="condition" 
                    placeholder="e.g., department = current_user_department()"
                    rows={3}
                  />
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
                        title: "Policy Created",
                        description: "New RLS policy has been created successfully.",
                      });
                    }}
                    className="flex-1"
                  >
                    Create Policy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table</TableHead>
              <TableHead>Policy Name</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-mono">{policy.tableName}</TableCell>
                <TableCell>{policy.policyName}</TableCell>
                <TableCell>
                  <Badge variant={getOperationColor(policy.operation) as any}>
                    {policy.operation}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {policy.condition}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant={policy.enabled ? "default" : "secondary"}>
                    {policy.enabled ? "Active" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePolicy(policy.id)}
                    >
                      {policy.enabled ? "Disable" : "Enable"}
                    </Button>
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
  );
};