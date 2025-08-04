import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Share2, Copy, Users, Link, Mail, Trash2, Crown, Eye, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SharedUser {
  id: string;
  email: string;
  permission: 'view' | 'edit' | 'admin';
  addedBy: string;
  addedDate: Date;
}

interface ShareDashboardProps {
  dashboardId: string;
  user: { email: string; role: string };
  onPermissionChange?: (users: SharedUser[]) => void;
}

export const ShareDashboard = ({ dashboardId, user, onPermissionChange }: ShareDashboardProps) => {
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState<'view' | 'edit'>('view');
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([
    {
      id: '1',
      email: 'alice@company.com',
      permission: 'edit',
      addedBy: user.email,
      addedDate: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: '2',
      email: 'bob@company.com',
      permission: 'view',
      addedBy: user.email,
      addedDate: new Date(Date.now() - 172800000) // 2 days ago
    }
  ]);
  const [shareLink, setShareLink] = useState("");
  const [linkPermission, setLinkPermission] = useState<'view' | 'edit'>('view');
  const { toast } = useToast();

  const generateShareLink = () => {
    const link = `${window.location.origin}/shared/${dashboardId}?permission=${linkPermission}&token=${Math.random().toString(36).slice(2)}`;
    setShareLink(link);
    
    toast({
      title: "Share link generated",
      description: "Link copied to clipboard",
    });
    
    navigator.clipboard.writeText(link);
  };

  const shareWithUser = () => {
    if (!shareEmail.trim()) return;

    const newUser: SharedUser = {
      id: Date.now().toString(),
      email: shareEmail,
      permission: sharePermission,
      addedBy: user.email,
      addedDate: new Date()
    };

    const updatedUsers = [...sharedUsers, newUser];
    setSharedUsers(updatedUsers);
    onPermissionChange?.(updatedUsers);
    setShareEmail("");

    toast({
      title: "User invited",
      description: `${shareEmail} has been invited with ${sharePermission} access`,
    });
  };

  const updatePermission = (userId: string, newPermission: 'view' | 'edit' | 'admin') => {
    const updatedUsers = sharedUsers.map(u => 
      u.id === userId ? { ...u, permission: newPermission } : u
    );
    setSharedUsers(updatedUsers);
    onPermissionChange?.(updatedUsers);

    toast({
      title: "Permission updated",
      description: "User permissions have been changed",
    });
  };

  const removeUser = (userId: string) => {
    const updatedUsers = sharedUsers.filter(u => u.id !== userId);
    setSharedUsers(updatedUsers);
    onPermissionChange?.(updatedUsers);

    toast({
      title: "User removed",
      description: "User access has been revoked",
    });
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'edit': return <Edit3 className="h-4 w-4" />;
      case 'view': return <Eye className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'edit': return 'bg-primary text-primary-foreground';
      case 'view': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Dashboard</DialogTitle>
          <DialogDescription>
            Invite others to view or collaborate on this dashboard
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link className="h-4 w-4 mr-2" />
              Share Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4 mt-4">
            {/* Add new user */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Invite People</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address..."
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Permission</Label>
                    <Select value={sharePermission} onValueChange={(value: 'view' | 'edit') => setSharePermission(value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={shareWithUser} disabled={!shareEmail.trim()}>
                      <Mail className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current users */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">People with access</CardTitle>
                <CardDescription>
                  {sharedUsers.length} {sharedUsers.length === 1 ? 'person has' : 'people have'} access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Owner */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-muted-foreground">Owner</p>
                      </div>
                    </div>
                    <Badge className="bg-destructive text-destructive-foreground">
                      <Crown className="h-3 w-3 mr-1" />
                      Owner
                    </Badge>
                  </div>

                  {/* Shared users */}
                  {sharedUsers.map((sharedUser) => (
                    <div key={sharedUser.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {sharedUser.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{sharedUser.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Added {sharedUser.addedDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select 
                          value={sharedUser.permission} 
                          onValueChange={(value: 'view' | 'edit' | 'admin') => updatePermission(sharedUser.id, value)}
                        >
                          <SelectTrigger className="w-20">
                            <div className="flex items-center gap-1">
                              {getPermissionIcon(sharedUser.permission)}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">View</SelectItem>
                            <SelectItem value="edit">Edit</SelectItem>
                            {user.role === 'admin' && (
                              <SelectItem value="admin">Admin</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeUser(sharedUser.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Generate Share Link</CardTitle>
                <CardDescription>
                  Anyone with this link will be able to access the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label>Permission level</Label>
                    <Select value={linkPermission} onValueChange={(value: 'view' | 'edit') => setLinkPermission(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View only</SelectItem>
                        <SelectItem value="edit">Can edit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={generateShareLink}>
                      <Link className="h-4 w-4 mr-2" />
                      Generate Link
                    </Button>
                  </div>
                </div>

                {shareLink && (
                  <div className="space-y-2">
                    <Label>Share link</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={shareLink} 
                        readOnly 
                        className="font-mono text-xs"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => navigator.clipboard.writeText(shareLink)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};