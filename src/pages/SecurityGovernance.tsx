import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditLog } from "@/components/security/AuditLog";
import { RowLevelSecurity } from "@/components/security/RowLevelSecurity";
import { ColumnLevelSecurity } from "@/components/security/ColumnLevelSecurity";
import { DataMasking } from "@/components/security/DataMasking";
import { SSOConfiguration } from "@/components/security/SSOConfiguration";
import { ComplianceManager } from "@/components/security/ComplianceManager";
import { Shield, Database, EyeOff, Key, FileCheck, Lock } from "lucide-react";

const SecurityGovernance: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Data Security & Governance</h1>
        <p className="text-muted-foreground">
          Comprehensive security controls to protect sensitive data and ensure compliance.
        </p>
      </div>

      <Tabs defaultValue="audit" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="rls" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Row Security
          </TabsTrigger>
          <TabsTrigger value="cls" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Column Security
          </TabsTrigger>
          <TabsTrigger value="masking" className="flex items-center gap-2">
            <EyeOff className="h-4 w-4" />
            Data Masking
          </TabsTrigger>
          <TabsTrigger value="sso" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            SSO Config
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="mt-6">
          <AuditLog />
        </TabsContent>

        <TabsContent value="rls" className="mt-6">
          <RowLevelSecurity />
        </TabsContent>

        <TabsContent value="cls" className="mt-6">
          <ColumnLevelSecurity />
        </TabsContent>

        <TabsContent value="masking" className="mt-6">
          <DataMasking />
        </TabsContent>

        <TabsContent value="sso" className="mt-6">
          <SSOConfiguration />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityGovernance;