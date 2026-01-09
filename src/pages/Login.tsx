import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Scissors, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const result = login(username, password);
      setIsLoading(false);

      if (result.success) {
        toast.success("Login successful!");
        // Redirect based on role
        if (username.toLowerCase() === "admin") {
          navigate("/admin");
        } else if (username.toLowerCase() === "tailor") {
          navigate("/tailor");
        }
      } else {
        toast.error(result.error || "Login failed");
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 pattern-fabric opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-primary/20" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-ivory">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-primary/30">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4 text-center">Business Portal</h1>
          <p className="text-lg opacity-80 text-center max-w-md">
            Secure access for administrators and tailors to manage the Tailo platform
          </p>
          <div className="mt-12 p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 max-w-sm">
            <p className="text-sm opacity-70 mb-4 text-center">This portal is for authorized personnel only</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm">Admin Dashboard Access</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm">Tailor Management Tools</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm">Order & Design Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-charcoal flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">Business Portal</h1>
              <p className="text-xs text-muted-foreground">Admin & Tailor Access</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold">Business Login</h2>
            <p className="text-muted-foreground mt-2">Sign in with your admin or tailor credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-border">
            <p className="text-sm text-muted-foreground text-center mb-3 font-medium">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-background rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p className="font-semibold">Admin</p>
                </div>
                <p className="text-muted-foreground text-xs font-mono">admin / admin</p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <p className="font-semibold">Tailor</p>
                </div>
                <p className="text-muted-foreground text-xs font-mono">tailor / tailor</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Home
            </Link>
            <p className="text-sm text-muted-foreground">
              Looking for customer login?{" "}
              <Link to="/user-login" className="text-primary hover:underline">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
