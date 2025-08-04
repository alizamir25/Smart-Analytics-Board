import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface CollaborationState {
  activeUsers: string[];
  isConnected: boolean;
  lastSync: Date;
  conflicts: string[];
}

interface UseRealTimeCollaborationProps {
  dashboardId: string;
  userId: string;
  onConflict?: (conflict: { element: string; users: string[] }) => void;
  onUserJoin?: (user: string) => void;
  onUserLeave?: (user: string) => void;
}

export const useRealTimeCollaboration = ({
  dashboardId,
  userId,
  onConflict,
  onUserJoin,
  onUserLeave
}: UseRealTimeCollaborationProps) => {
  const [state, setState] = useState<CollaborationState>({
    activeUsers: [],
    isConnected: false,
    lastSync: new Date(),
    conflicts: []
  });
  
  const [editingElements, setEditingElements] = useState<Record<string, string[]>>({});
  const { toast } = useToast();

  // Initialize collaboration session
  useEffect(() => {
    // Simulate connection
    const connectTimer = setTimeout(() => {
      setState(prev => ({ ...prev, isConnected: true }));
      toast({
        title: "Connected",
        description: "Real-time collaboration is active",
      });
    }, 1000);

    // Simulate other users joining/leaving
    const userActivityTimer = setInterval(() => {
      const users = ['alice@company.com', 'bob@company.com', 'charlie@company.com'];
      const activeCount = Math.floor(Math.random() * 3) + 1;
      const activeUsers = users.slice(0, activeCount);
      
      setState(prev => {
        const newUsers = activeUsers.filter(u => !prev.activeUsers.includes(u));
        const leftUsers = prev.activeUsers.filter(u => !activeUsers.includes(u));
        
        // Notify about user changes
        newUsers.forEach(user => onUserJoin?.(user));
        leftUsers.forEach(user => onUserLeave?.(user));
        
        return {
          ...prev,
          activeUsers,
          lastSync: new Date()
        };
      });
    }, 10000); // Update every 10 seconds

    return () => {
      clearTimeout(connectTimer);
      clearInterval(userActivityTimer);
    };
  }, [dashboardId, onUserJoin, onUserLeave, toast]);

  // Track element editing
  const startEditing = useCallback((elementId: string) => {
    setEditingElements(prev => {
      const currentEditors = prev[elementId] || [];
      
      // Check for conflicts
      if (currentEditors.length > 0) {
        const conflict = { element: elementId, users: [...currentEditors, userId] };
        onConflict?.(conflict);
        
        toast({
          title: "Editing conflict detected",
          description: `${currentEditors.join(', ')} ${currentEditors.length === 1 ? 'is' : 'are'} also editing this element`,
          variant: "destructive"
        });
      }
      
      return {
        ...prev,
        [elementId]: [...currentEditors, userId]
      };
    });

    // Simulate broadcasting to other users
    console.log(`User ${userId} started editing ${elementId}`);
  }, [userId, onConflict, toast]);

  const stopEditing = useCallback((elementId: string) => {
    setEditingElements(prev => {
      const currentEditors = prev[elementId] || [];
      const updatedEditors = currentEditors.filter(id => id !== userId);
      
      if (updatedEditors.length === 0) {
        const { [elementId]: removed, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [elementId]: updatedEditors
      };
    });

    // Simulate broadcasting to other users
    console.log(`User ${userId} stopped editing ${elementId}`);
  }, [userId]);

  // Sync changes with other users
  const syncChanges = useCallback((elementId: string, changes: any) => {
    if (!state.isConnected) {
      toast({
        title: "Sync failed",
        description: "Not connected to real-time service",
        variant: "destructive"
      });
      return false;
    }

    // Simulate successful sync
    setState(prev => ({ ...prev, lastSync: new Date() }));
    
    // In a real implementation, this would broadcast changes to other users
    console.log(`Syncing changes for ${elementId}:`, changes);
    
    return true;
  }, [state.isConnected, toast]);

  // Handle incoming changes from other users
  const handleIncomingChange = useCallback((elementId: string, changes: any, fromUser: string) => {
    // Apply changes from other users
    console.log(`Received changes for ${elementId} from ${fromUser}:`, changes);
    
    toast({
      title: "Dashboard updated",
      description: `${fromUser} made changes to ${elementId}`,
    });
  }, [toast]);

  // Check if an element is being edited by others
  const isElementLocked = useCallback((elementId: string) => {
    const editors = editingElements[elementId] || [];
    return editors.some(id => id !== userId);
  }, [editingElements, userId]);

  // Get users currently editing an element
  const getElementEditors = useCallback((elementId: string) => {
    return editingElements[elementId] || [];
  }, [editingElements]);

  // Resolve conflicts
  const resolveConflict = useCallback((elementId: string, resolution: 'mine' | 'theirs' | 'merge') => {
    setState(prev => ({
      ...prev,
      conflicts: prev.conflicts.filter(c => c !== elementId)
    }));

    toast({
      title: "Conflict resolved",
      description: `Applied ${resolution} changes to ${elementId}`,
    });
  }, [toast]);

  return {
    // State
    activeUsers: state.activeUsers,
    isConnected: state.isConnected,
    lastSync: state.lastSync,
    conflicts: state.conflicts,
    editingElements,

    // Actions
    startEditing,
    stopEditing,
    syncChanges,
    handleIncomingChange,
    isElementLocked,
    getElementEditors,
    resolveConflict,
  };
};