import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash, UserPlus, Shield, Database } from "lucide-react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: '2024-01-15 14:30:25',
    user: 'john.doe@company.com',
    action: 'CREATE',
    resource: 'Dashboard',
    details: 'Created new sales dashboard "Q1 Performance"',
    severity: 'low'
  },
  {
    id: '2',
    timestamp: '2024-01-15 14:25:10',
    user: 'admin@company.com',
    action: 'UPDATE',
    resource: 'User Permissions',
    details: 'Modified role permissions for Marketing team',
    severity: 'medium'
  },
  {
    id: '3',
    timestamp: '2024-01-15 14:20:33',
    user: 'jane.smith@company.com',
    action: 'DELETE',
    resource: 'Data Source',
    details: 'Removed connection to legacy CRM system',
    severity: 'high'
  },
  {
    id: '4',
    timestamp: '2024-01-15 14:15:47',
    user: 'mike.wilson@company.com',
    action: 'VIEW',
    resource: 'Sensitive Data',
    details: 'Accessed customer financial records',
    severity: 'medium'
  },
  {
    id: '5',
    timestamp: '2024-01-15 14:10:15',
    user: 'admin@company.com',
    action: 'CREATE',
    resource: 'Security Policy',
    details: 'Enabled RLS on customer_data table',
    severity: 'high'
  }
];

const getActionIcon = (action: string) => {
  switch (action) {
    case 'VIEW': return <Eye className="h-4 w-4" />;
    case 'CREATE': return <UserPlus className="h-4 w-4" />;
    case 'UPDATE': return <Edit className="h-4 w-4" />;
    case 'DELETE': return <Trash className="h-4 w-4" />;
    default: return <Database className="h-4 w-4" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    default: return 'outline';
  }
};

export const AuditLog: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Audit Log
        </CardTitle>
        <CardDescription>
          Track all system activities and user actions for compliance and security monitoring.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-sm">
                  {log.timestamp}
                </TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getActionIcon(log.action)}
                    {log.action}
                  </div>
                </TableCell>
                <TableCell>{log.resource}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {log.details}
                </TableCell>
                <TableCell>
                  <Badge variant={getSeverityColor(log.severity) as any}>
                    {log.severity.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};