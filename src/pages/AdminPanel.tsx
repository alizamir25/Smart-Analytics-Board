import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Settings, 
  Activity, 
  Database,
  Plus,
  Search,
  MoreHorizontal,
  Shield,
  UserPlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminPanelProps {
  user: { email: string; role: 'admin' | 'analyst' | 'viewer' };
}

interface User {
  id: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  status: 'active' | 'inactive';
  lastActive: Date;
  createdAt: Date;
}

export const AdminPanel = ({ user }: AdminPanelProps) => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@demo.com',
      role: 'admin',
      status: 'active',
      lastActive: new Date(),
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      email: 'analyst@demo.com',
      role: 'analyst',
      status: 'active',
      lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      createdAt: new Date('2024-02-10'),
    },
    {
      id: '3',
      email: 'viewer@demo.com',
      role: 'viewer',
      status: 'active',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      createdAt: new Date('2024-03-01'),
    },
    {
      id: '4',
      email: 'inactive@demo.com',
      role: 'viewer',
      status: 'inactive',
      lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      createdAt: new Date('2024-01-20'),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const systemStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalDatabases: 5,
    totalReports: 23,
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const updateUserRole = (userId: string, newRole: 'admin' | 'analyst' | 'viewer') => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };

  return (
    <div className="space-y-6">
      {/* System overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalDatabases}</div>
            <p className="text-xs text-muted-foreground">
              Connected databases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              Generated this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User list */}
          <div className="space-y-4">
            {filteredUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {u.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{u.email}</p>
                      <Badge 
                        variant={u.status === 'active' ? 'default' : 'secondary'}
                      >
                        {u.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="capitalize flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {u.role}
                      </span>
                      <span>Last active: {formatLastActive(u.lastActive)}</span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateUserRole(u.id, 'admin')}>
                      Make Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateUserRole(u.id, 'analyst')}>
                      Make Analyst
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateUserRole(u.id, 'viewer')}>
                      Make Viewer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleUserStatus(u.id)}>
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System settings */}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            Configure system-wide settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="retention">Data Retention (days)</Label>
                <Input
                  id="retention"
                  type="number"
                  defaultValue="365"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="backup">Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="max-upload">Max Upload Size (MB)</Label>
                <Input
                  id="max-upload"
                  type="number"
                  defaultValue="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="session">Session Timeout (minutes)</Label>
                <Input
                  id="session"
                  type="number"
                  defaultValue="30"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};