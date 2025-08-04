import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveUser {
  id: string;
  email: string;
  name: string;
  isEditing: boolean;
  lastSeen: Date;
  cursor?: { x: number; y: number };
  editingElement?: string;
}

interface RealTimeIndicatorProps {
  currentUser: { email: string; role: string };
  dashboardId: string;
}

export const RealTimeIndicator = ({ currentUser, dashboardId }: RealTimeIndicatorProps) => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Simulate real-time users - in production, this would use Supabase real-time presence
  useEffect(() => {
    // Simulate some active users
    const simulatedUsers: ActiveUser[] = [
      {
        id: '1',
        email: 'alice@company.com',
        name: 'Alice',
        isEditing: true,
        lastSeen: new Date(),
        editingElement: 'Revenue Chart'
      },
      {
        id: '2',
        email: 'bob@company.com',
        name: 'Bob',
        isEditing: false,
        lastSeen: new Date(Date.now() - 30000), // 30 seconds ago
      }
    ];

    const timer = setInterval(() => {
      // Simulate user activity changes
      setActiveUsers(prev => prev.map(user => ({
        ...user,
        isEditing: Math.random() > 0.7,
        lastSeen: Math.random() > 0.5 ? new Date() : user.lastSeen,
        editingElement: user.isEditing ? ['Revenue Chart', 'User Growth', 'Analytics Panel'][Math.floor(Math.random() * 3)] : undefined
      })));
      
      // Simulate connection status
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 5000);

    setActiveUsers(simulatedUsers);

    return () => clearInterval(timer);
  }, [dashboardId]);

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(new Date());
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  const getInitials = (email: string) => {
    return email.split('@')[0].charAt(0).toUpperCase();
  };

  const getStatusColor = (user: ActiveUser) => {
    const timeDiff = Date.now() - user.lastSeen.getTime();
    if (timeDiff < 30000) return 'bg-green-500'; // Active (green)
    if (timeDiff < 300000) return 'bg-yellow-500'; // Away (yellow)
    return 'bg-gray-500'; // Offline (gray)
  };

  const formatLastSeen = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Connection status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isConnected ? 'Connected' : 'Connection lost'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Active users count */}
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {activeUsers.length + 1} online
        </Badge>

        {/* Active user avatars */}
        <div className="flex items-center -space-x-2">
          {/* Current user */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar className="h-8 w-8 border-2 border-background">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(currentUser.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <p className="font-medium">You</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                <p className="text-xs text-green-600">Online</p>
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Other users */}
          {activeUsers.slice(0, 4).map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="text-xs">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background",
                    getStatusColor(user)
                  )} />
                  {user.isEditing && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-background animate-pulse" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <p className="text-xs">{formatLastSeen(user.lastSeen)}</p>
                  {user.isEditing && user.editingElement && (
                    <p className="text-xs text-blue-600">Editing: {user.editingElement}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))

          }

          {/* Show more indicator if there are additional users */}
          {activeUsers.length > 4 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-8 w-8 border-2 border-background bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">+{activeUsers.length - 4}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{activeUsers.length - 4} more users online</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Real-time editing indicators */}
        {activeUsers.some(u => u.isEditing) && (
          <div className="flex items-center gap-1">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <span className="text-xs text-muted-foreground">Live editing</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
