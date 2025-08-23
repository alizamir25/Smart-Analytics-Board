import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Download, AlertTriangle, CheckCircle, XCircle, FileText, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComplianceFramework {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  compliance: number;
  requirements: number;
  lastAudit: string;
  features: string[];
}

interface ComplianceReport {
  id: string;
  type: 'audit' | 'access' | 'breach' | 'compliance';
  title: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  recordCount: number;
  size: string;
}

const mockFrameworks: ComplianceFramework[] = [
  {
    id: 'gdpr',
    name: 'GDPR (General Data Protection Regulation)',
    status: 'active',
    compliance: 95,
    requirements: 12,
    lastAudit: '2024-01-10',
    features: ['Data Encryption', 'Right to Delete', 'Consent Management', 'Breach Notification']
  },
  {
    id: 'ccpa',
    name: 'CCPA (California Consumer Privacy Act)',
    status: 'active',
    compliance: 88,
    requirements: 8,
    lastAudit: '2024-01-08',
    features: ['Data Disclosure', 'Opt-out Rights', 'Personal Data Inventory']
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    status: 'inactive',
    compliance: 72,
    requirements: 15,
    lastAudit: '2023-12-15',
    features: ['Access Controls', 'Audit Logging', 'Data Retention', 'Security Monitoring']
  }
];

const mockReports: ComplianceReport[] = [
  {
    id: '1',
    type: 'audit',
    title: 'Monthly GDPR Compliance Audit',
    date: '2024-01-15',
    status: 'completed',
    recordCount: 15420,
    size: '2.3 MB'
  },
  {
    id: '2',
    type: 'access',
    title: 'User Access Report - Q1',
    date: '2024-01-12',
    status: 'completed',
    recordCount: 8934,
    size: '1.1 MB'
  },
  {
    id: '3',
    type: 'compliance',
    title: 'CCPA Data Processing Report',
    date: '2024-01-10',
    status: 'pending',
    recordCount: 0,
    size: '-'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'default';
    case 'inactive': return 'secondary';
    case 'completed': return 'default';
    case 'pending': return 'secondary';
    case 'failed': return 'destructive';
    default: return 'outline';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': 
    case 'completed': return <CheckCircle className="h-4 w-4" />;
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'failed':
    case 'inactive': return <XCircle className="h-4 w-4" />;
    default: return <XCircle className="h-4 w-4" />;
  }
};

const getComplianceColor = (score: number) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
};

const getReportIcon = (type: string) => {
  switch (type) {
    case 'audit': return <Shield className="h-4 w-4" />;
    case 'access': return <Users className="h-4 w-4" />;
    case 'breach': return <AlertTriangle className="h-4 w-4" />;
    case 'compliance': return <FileText className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

export const ComplianceManager: React.FC = () => {
  const [frameworks, setFrameworks] = useState<ComplianceFramework[]>(mockFrameworks);
  const [reports] = useState<ComplianceReport[]>(mockReports);
  const { toast } = useToast();

  const toggleFramework = (id: string) => {
    setFrameworks(prev => prev.map(framework => 
      framework.id === id 
        ? { ...framework, status: framework.status === 'active' ? 'inactive' : 'active' as any }
        : framework
    ));
    toast({
      title: "Compliance Framework Updated",
      description: "Compliance framework status has been changed.",
    });
  };

  const generateReport = (type: string) => {
    toast({
      title: "Report Generation Started",
      description: `${type} report generation has been initiated. You'll be notified when ready.`,
    });
  };

  const downloadReport = (reportId: string) => {
    toast({
      title: "Download Started",
      description: "Compliance report download has been initiated.",
    });
  };

  const overallCompliance = Math.round(
    frameworks.filter(f => f.status === 'active').reduce((sum, f) => sum + f.compliance, 0) / 
    frameworks.filter(f => f.status === 'active').length
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Management
          </CardTitle>
          <CardDescription>
            Manage regulatory compliance frameworks and generate audit reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Compliance</p>
                  <p className={`text-2xl font-bold ${getComplianceColor(overallCompliance)}`}>
                    {overallCompliance}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <Progress value={overallCompliance} className="mt-2" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Frameworks</p>
                  <p className="text-2xl font-bold">
                    {frameworks.filter(f => f.status === 'active').length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reports</p>
                  <p className="text-2xl font-bold">
                    {reports.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </Card>
          </div>

          <Tabs defaultValue="frameworks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="frameworks">Compliance Frameworks</TabsTrigger>
              <TabsTrigger value="reports">Audit Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="frameworks" className="space-y-4">
              {overallCompliance < 90 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Your overall compliance score is below 90%. Review inactive frameworks and address compliance gaps.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {frameworks.map((framework) => (
                  <Card key={framework.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{framework.name}</h3>
                          <Badge variant={getStatusColor(framework.status) as any}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(framework.status)}
                              {framework.status.toUpperCase()}
                            </div>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Compliance Score</p>
                            <div className="flex items-center gap-2">
                              <Progress value={framework.compliance} className="flex-1" />
                              <span className={`font-medium ${getComplianceColor(framework.compliance)}`}>
                                {framework.compliance}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Requirements: {framework.requirements} | Last Audit: {framework.lastAudit}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {framework.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Switch
                          checked={framework.status === 'active'}
                          onCheckedChange={() => toggleFramework(framework.id)}
                        />
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {reports.length} reports available for download
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => generateReport('Audit')}>
                    Generate Audit Report
                  </Button>
                  <Button variant="outline" onClick={() => generateReport('Access')}>
                    Generate Access Report
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <div className="flex items-center gap-1">
                            {getReportIcon(report.type)}
                            {report.type.toUpperCase()}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.recordCount.toLocaleString()}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(report.status) as any}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(report.status)}
                            {report.status.toUpperCase()}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadReport(report.id)}
                          disabled={report.status !== 'completed'}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};