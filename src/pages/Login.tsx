import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Scissors, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithEmail, activeRole, user } = useAuth();
  const navigate = useNavigate();

  // Redirect based on role when user login state changes
  useEffect(() => {
    if (user && activeRole) {
      if (activeRole === 'admin') navigate('/admin');
      else if (activeRole === 'tailor') navigate('/tailor');
      else navigate('/'); // Customers shouldn't use this portal ideally, but fallback
    }
  }, [user, activeRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginWithEmail(email, password);
      // Redirect handled by useEffect
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <div className="w-full max-w-[1920px] min-h-screen flex shadow-2xl overflow-hidden">
        {/* Left Side - Premium Branding */}
        <div className="hidden lg:flex w-1/2 bg-[#1a1a1a] relative overflow-hidden items-center justify-center text-ivory p-12">
          {/* Background Effects */}
          <div className="absolute inset-0 pattern-luxury opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-transparent to-primary/10" />

          {/* Floating Elements Animation */}
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gold/10 blur-3xl animate-pulse-glow delay-1000" />

          <div className="relative z-10 max-w-lg space-y-8">
            {/* Logo & Brand */}
            <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-luxury">
                <ShieldCheck className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-gradient-gold">Tailor Made Magic</h1>
                <p className="text-white/60 tracking-wider text-sm uppercase">Business Portal</p>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-5xl font-display font-medium leading-tight text-white">
                Manage Your <br />
                <span className="text-primary italic">Craft & Business.</span>
              </h2>
              <p className="text-lg text-white/70 font-light leading-relaxed">
                Secure access for administrators and tailors.
                Streamline your workflow and grow your bespoke tailoring business.
              </p>
            </div>

            {/* Features List */}
            <div className="grid gap-6 pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">Tailor Management Tools</h3>
                  <p className="text-sm text-white/60">Manage orders, measurements, and customer profiles</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">Secure Admin Access</h3>
                  <p className="text-sm text-white/60">Advanced controls and platform analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-6 sm:mb-8 justify-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-display font-bold">Business Portal</h1>
                <p className="text-xs text-muted-foreground">For Tailors & Admins</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold">Business Login</h2>
              <p className="text-muted-foreground mt-2">Sign in with your email and password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
              <p className="text-sm text-muted-foreground text-center mb-3 font-medium">Demo Note</p>
              <p className="text-xs text-muted-foreground text-center">
                Please create an account first or ask admin for access.
              </p>
            </div>

            <div className="mt-6 text-center space-y-2">
              <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors block">
                ← Back to Portal Selection
              </Link>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/auth/business/signup" className="text-primary hover:underline font-medium">Sign up as Tailor</Link>
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Looking for customer login?{" "}
                <Link to="/auth/customer" className="text-primary hover:underline font-medium">Customer Portal →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
