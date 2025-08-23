import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Key, Shield, Users, Settings, ExternalLink, Check, X, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SSOProvider {
  id: string;
  name: string;
  type: 'SAML' | 'OIDC' | 'OAuth2';
  status: 'active' | 'inactive' | 'testing';
  domain: string;
  userCount: number;
  lastSync: string;
  config: {
    clientId?: string;
    issuerUrl?: string;
    callbackUrl?: string;
  };
}

interface RoleMapping {
  id: string;
  providerGroup: string;
  appRole: 'admin' | 'analyst' | 'viewer';
  description: string;
  userCount: number;
}

const mockProviders: SSOProvider[] = [
  {
    id: '1',
    name: 'Okta Enterprise',
    type: 'OIDC',
    status: 'active',
    domain: 'company.okta.com',
    userCount: 245,
    lastSync: '2024-01-15 14:30:00',
    config: {
      clientId: 'app_123456',
      issuerUrl: 'https://company.okta.com/oauth2/default',
      callbackUrl: 'https://app.company.com/auth/callback'
    }
  },
  {
    id: '2',
    name: 'Azure AD',
    type: 'SAML',
    status: 'testing',
    domain: 'company.onmicrosoft.com',
    userCount: 0,
    lastSync: 'Never',
    config: {
      clientId: 'azure_app_789',
      issuerUrl: 'https://login.microsoftonline.com/tenant-id'
    }
  }
];

const mockRoleMappings: RoleMapping[] = [
  {
    id: '1',
    providerGroup: 'Analytics-Admins',
    appRole: 'admin',
    description: 'Full system administration access',
    userCount: 5
  },
  {
    id: '2',
    providerGroup: 'Data-Analysts',
    appRole: 'analyst',
    description: 'Data analysis and dashboard creation',
    userCount: 45
  },
  {
    id: '3',
    providerGroup: 'Business-Users',
    appRole: 'viewer',
    description: 'Read-only dashboard access',
    userCount: 195
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'default';
    case 'testing': return 'secondary';
    case 'inactive': return 'outline';
    default: return 'outline';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <Check className="h-4 w-4" />;
    case 'testing': return <Settings className="h-4 w-4" />;
    case 'inactive': return <X className="h-4 w-4" />;
    default: return <X className="h-4 w-4" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'destructive';
    case 'analyst': return 'default';
    case 'viewer': return 'secondary';
    default: return 'outline';
  }
};

export const SSOConfiguration: React.FC = () => {
  const [providers, setProviders] = useState<SSOProvider[]>(mockProviders);
  const [roleMappings, setRoleMappings] = useState<RoleMapping[]>(mockRoleMappings);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const { toast } = useToast();

  const toggleProvider = (id: string) => {
    setProviders(prev => prev.map(provider => 
      provider.id === id 
        ? { ...provider, status: provider.status === 'active' ? 'inactive' : 'active' as any }
        : provider
    ));
    toast({
      title: "SSO Provider Updated",
      description: "SSO provider status has been changed.",
    });
  };

  const testConnection = (providerId: string) => {
    toast({
      title: "Testing Connection",
      description: "SSO connection test initiated. Check logs for results.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Single Sign-On Configuration
          </CardTitle>
          <CardDescription>
            Manage enterprise SSO providers and authentication settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="providers">SSO Providers</TabsTrigger>
              <TabsTrigger value="mappings">Role Mappings</TabsTrigger>
            </TabsList>

            <TabsContent value="providers" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {providers.filter(p => p.status === 'active').length} of {providers.length} providers active
                </div>
                <Dialog open={isProviderDialogOpen} onOpenChange={setIsProviderDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Provider
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Configure SSO Provider</DialogTitle>
                      <DialogDescription>
                        Add a new enterprise identity provider for single sign-on.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="providerName">Provider Name</Label>
                          <Input id="providerName" placeholder="e.g., Okta Enterprise" />
                        </div>
                        <div>
                          <Label htmlFor="providerType">Provider Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OIDC">OpenID Connect</SelectItem>
                              <SelectItem value="SAML">SAML 2.0</SelectItem>
                              <SelectItem value="OAuth2">OAuth 2.0</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="domain">Domain</Label>
                        <Input id="domain" placeholder="e.g., company.okta.com" />
                      </div>
                      <div>
                        <Label htmlFor="clientId">Client ID</Label>
                        <Input id="clientId" placeholder="Provider-specific client identifier" />
                      </div>
                      <div>
                        <Label htmlFor="issuerUrl">Issuer URL</Label>
                        <Input id="issuerUrl" placeholder="e.g., https://company.okta.com/oauth2/default" />
                      </div>
                      <div>
                        <Label htmlFor="callbackUrl">Callback URL</Label>
                        <Input id="callbackUrl" placeholder="e.g., https://app.company.com/auth/callback" />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsProviderDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsProviderDialogOpen(false);
                            toast({
                              title: "SSO Provider Added",
                              description: "New SSO provider configuration saved.",
                            });
                          }}
                          className="flex-1"
                        >
                          Save Configuration
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {providers.map((provider) => (
                  <Card key={provider.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <Shield className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {provider.type} • {provider.domain}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusColor(provider.status) as any}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(provider.status)}
                            {provider.status.toUpperCase()}
                          </div>
                        </Badge>
                        <div className="text-right text-sm">
                          <div className="font-medium">{provider.userCount} users</div>
                          <div className="text-muted-foreground">
                            Last sync: {provider.lastSync}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleProvider(provider.id)}
                      >
                        {provider.status === 'active' ? 'Disable' : 'Enable'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testConnection(provider.id)}
                      >
                        Test Connection
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mappings" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {roleMappings.reduce((sum, mapping) => sum + mapping.userCount, 0)} users mapped across {roleMappings.length} role mappings
                </div>
                <Dialog open={isMappingDialogOpen} onOpenChange={setIsMappingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Mapping
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Role Mapping</DialogTitle>
                      <DialogDescription>
                        Map enterprise groups to application roles.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="providerGroup">Provider Group Name</Label>
                        <Input id="providerGroup" placeholder="e.g., Analytics-Admins" />
                      </div>
                      <div>
                        <Label htmlFor="appRole">Application Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin - Full system access</SelectItem>
                            <SelectItem value="analyst">Analyst - Create & edit dashboards</SelectItem>
                            <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          placeholder="Describe the permissions this mapping provides..."
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsMappingDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsMappingDialogOpen(false);
                            toast({
                              title: "Role Mapping Created",
                              description: "New role mapping has been configured.",
                            });
                          }}
                          className="flex-1"
                        >
                          Create Mapping
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {roleMappings.map((mapping) => (
                  <Card key={mapping.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-lg">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{mapping.providerGroup}</span>
                            <span className="text-muted-foreground">→</span>
                            <Badge variant={getRoleColor(mapping.appRole) as any}>
                              {mapping.appRole.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {mapping.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{mapping.userCount} users</div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};