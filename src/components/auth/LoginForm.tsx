import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, BarChart3 } from "lucide-react";

interface LoginFormProps {
  onLogin: (email: string, role: 'admin' | 'analyst' | 'viewer') => void;
  onToggleMode: () => void;
  isSignUp: boolean;
}

export const LoginForm = ({ onLogin, onToggleMode, isSignUp }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (email && password) {
        // Demo role assignment based on email
        const role = email.includes('admin') ? 'admin' : 
                    email.includes('analyst') ? 'analyst' : 'viewer';
        
        onLogin(email, role);
        toast({
          title: isSignUp ? "Account created!" : "Welcome back!",
          description: `Logged in as ${role}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-dashboard">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? "Set up your analytics dashboard account" 
              : "Sign in to your analytics dashboard"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Try: admin@demo.com, analyst@demo.com, or viewer@demo.com
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <Button
              variant="link"
              className="p-0 ml-1 h-auto text-primary"
              onClick={onToggleMode}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};