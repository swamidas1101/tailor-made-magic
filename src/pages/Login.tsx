import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scissors, Lock, User, ArrowRight } from "lucide-react";
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
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 pattern-fabric opacity-20" />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-primary-foreground">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
            <Scissors className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4 text-center">StitchCraft</h1>
          <p className="text-lg opacity-90 text-center max-w-md">
            Premium tailoring management system for administrators and tailors
          </p>
          <div className="mt-12 grid grid-cols-2 gap-8 text-center">
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm opacity-80">Designs</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm opacity-80">Tailors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center">
              <Scissors className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">StitchCraft</h1>
              <p className="text-xs text-muted-foreground">Management Portal</p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your account</p>
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

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-background rounded-lg border">
                <p className="font-medium">Admin</p>
                <p className="text-muted-foreground text-xs">admin / admin</p>
              </div>
              <div className="p-3 bg-background rounded-lg border">
                <p className="font-medium">Tailor</p>
                <p className="text-muted-foreground text-xs">tailor / tailor</p>
              </div>
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            <a href="/" className="text-primary hover:underline">← Back to Home</a>
          </p>
        </div>
      </div>
    </div>
  );
}
