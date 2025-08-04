import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, MoreHorizontal, Trash2, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  text: string;
  author: string;
  authorEmail: string;
  timestamp: Date;
  x: number;
  y: number;
  resolved?: boolean;
}

interface CommentSystemProps {
  chartId: string;
  user: { email: string; role: string };
  className?: string;
  children: React.ReactNode;
}

export const CommentSystem = ({ chartId, user, className, children }: CommentSystemProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const { toast } = useToast();

  // Simulated real-time comments - in production, this would use Supabase real-time subscriptions
  useEffect(() => {
    // Load existing comments for this chart
    const savedComments = localStorage.getItem(`comments-${chartId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments).map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp)
      })));
    }
  }, [chartId]);

  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`comments-${chartId}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  const handleChartClick = (event: React.MouseEvent) => {
    if (!isAnnotationMode) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setCommentPosition({ x, y });
    setShowCommentForm(true);
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment,
      author: user.email.split('@')[0],
      authorEmail: user.email,
      timestamp: new Date(),
      x: commentPosition.x,
      y: commentPosition.y,
    };

    const updatedComments = [...comments, comment];
    saveComments(updatedComments);
    setNewComment("");
    setShowCommentForm(false);
    setIsAnnotationMode(false);

    toast({
      title: "Comment added",
      description: "Your annotation has been saved.",
    });
  };

  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    saveComments(updatedComments);
    
    toast({
      title: "Comment deleted",
      description: "The annotation has been removed.",
    });
  };

  const toggleResolve = (commentId: string) => {
    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    );
    saveComments(updatedComments);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Comment toggle and annotation mode */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={isAnnotationMode ? "default" : "outline"}
          size="sm"
          onClick={() => setIsAnnotationMode(!isAnnotationMode)}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          {isAnnotationMode ? "Adding annotations..." : "Add annotation"}
        </Button>
        {comments.length > 0 && (
          <Badge variant="secondary">
            {comments.filter(c => !c.resolved).length} active comments
          </Badge>
        )}
      </div>

      {/* Chart wrapper with click handler */}
      <div 
        className="relative cursor-crosshair"
        onClick={handleChartClick}
        style={{ cursor: isAnnotationMode ? 'crosshair' : 'default' }}
      >
        {children}
        {/* Comment markers */}
        {comments.map((comment) => (
          <Popover key={comment.id}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "absolute w-6 h-6 rounded-full border-2 border-background shadow-md flex items-center justify-center text-xs font-bold z-10 transition-all hover:scale-110",
                  comment.resolved 
                    ? "bg-muted text-muted-foreground" 
                    : "bg-primary text-primary-foreground"
                )}
                style={{
                  left: `${comment.x}%`,
                  top: `${comment.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <MessageCircle className="h-3 w-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="right">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {comment.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {comment.timestamp.toLocaleDateString()}
                      </span>
                      {comment.resolved && (
                        <Badge variant="outline" className="text-xs">Resolved</Badge>
                      )}
                    </div>
                    <p className="text-sm mt-1">{comment.text}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleResolve(comment.id)}
                  >
                    {comment.resolved ? "Unresolve" : "Resolve"}
                  </Button>
                  {(user.email === comment.authorEmail || user.role === 'admin') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}

        {/* New comment form */}
        {showCommentForm && (
          <div
            className="absolute z-20"
            style={{
              left: `${commentPosition.x}%`,
              top: `${commentPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Card className="w-64 shadow-lg">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={addComment} disabled={!newComment.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setShowCommentForm(false);
                        setIsAnnotationMode(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};