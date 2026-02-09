import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, Building2, Mail, Lock, User, Eye, EyeOff, Phone, Check, ArrowRight, ArrowLeft, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

type AuthMethod = "email" | "google" | "phone";

export default function Auth() {
    const {
        loginWithEmail,
        signupWithEmail,
        signupWithPhone,
        verifyPhoneOTP,
        loginWithGoogle,
        signupWithGoogle,
        user,
        userRoles,
        activeRole,
        addRole,
        switchRole,
        verifyAdminCode,
        resetPassword,
        isEmailRegistered,
        logout
    } = useAuth();

    const navigate = useNavigate();

    // Tab state
    const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

    // Sign In state
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [showSignInPassword, setShowSignInPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    // Sign Up state
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [signupStep, setSignupStep] = useState(1); // 1: Role selection, 2: Basic info, 3: Tailor details, 4: Auth method
    const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
    const [inviteCode, setInviteCode] = useState("");
    const [showInviteInput, setShowInviteInput] = useState(false);

    // Common signup fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Tailor-specific fields
    const [businessName, setBusinessName] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

    // Phone auth state
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    // Is Adding Role View? (User logged in but wants to add role)
    const [isAddingRole, setIsAddingRole] = useState(false);

    const specializations = [
        "Men's Formal Wear",
        "Women's Formal Wear",
        "Traditional Wear",
        "Wedding Attire",
        "Casual Wear",
        "Alterations & Repairs",
        "Custom Suits",
        "Ethnic Wear"
    ];

    // Initialize reCAPTCHA for phone auth
    useEffect(() => {
        if (authMethod === "phone" && !recaptchaVerifier) {
            try {
                const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    size: 'normal',
                    callback: () => {
                        // reCAPTCHA solved
                    },
                    'expired-callback': () => {
                        toast.error("reCAPTCHA expired. Please try again.");
                    }
                });
                setRecaptchaVerifier(verifier);
            } catch (error) {
                console.error("reCAPTCHA initialization error:", error);
            }
        }
    }, [authMethod, recaptchaVerifier]);

    // Handle Navigation / Redirects
    const handleDashboardRedirect = () => {
        if (activeRole === 'customer') navigate('/');
        else if (activeRole === 'tailor') navigate('/tailor');
        else if (activeRole === 'admin') navigate('/admin');
    };

    // Auto-redirect on login
    useEffect(() => {
        if (user && activeRole && !isAddingRole) {
            if (activeRole === 'customer') navigate('/');
            else if (activeRole === 'tailor') navigate('/tailor');
            else if (activeRole === 'admin') navigate('/admin');
        }
    }, [user, activeRole, isAddingRole, navigate]);

    // Handle sign in
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await loginWithEmail(signInEmail, signInPassword);
            toast.success("Welcome back!");
            // Auto-redirect will happen via user interaction or generic effect if we kept it
            // But since we removed auto-redirect effect, we trigger it manually here
            // Wait for state update is tricky, so we rely on the "Logged In User" view to appear
        } catch (error: any) {
            toast.error(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Google sign in
    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            toast.success("Signed in with Google!");
        } catch (error: any) {
            toast.error(error.message || "Google sign in failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle forgot password
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Check if email is registered first
            const exists = await isEmailRegistered(resetEmail);
            if (!exists) {
                toast.error("No account found with this email. Please sign up instead.");
                return;
            }

            await resetPassword(resetEmail);
            toast.success("Password reset email sent! Check your inbox.");
            setShowForgotPassword(false);
            setResetEmail("");
        } catch (error: any) {
            toast.error(error.message || "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle specialization
    const toggleSpecialization = (spec: string) => {
        setSelectedSpecializations(prev =>
            prev.includes(spec)
                ? prev.filter(s => s !== spec)
                : [...prev, spec]
        );
    };

    // Handle Adding Role (For logged in users)
    const handleAddRole = async () => {
        if (!selectedRole) return;
        setIsLoading(true);

        try {
            const businessDetails = selectedRole === 'tailor' ? {
                businessName,
                address: businessAddress,
                specialization: selectedSpecializations,
                phone: phoneNumber || user?.phoneNumber || undefined
            } : undefined;

            await addRole(selectedRole, businessDetails);
            toast.success(`You are now a ${selectedRole}!`);
            setIsAddingRole(false);
            navigate(selectedRole === 'tailor' ? '/tailor' : '/');
        } catch (error: any) {
            toast.error(error.message || "Failed to add role");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle customer signup
    const handleCustomerSignup = async () => {
        if (isAddingRole) {
            await handleAddRole();
            return;
        }

        if (authMethod === "email") {
            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            if (password.length < 8) {
                toast.error("Password must be at least 8 characters");
                return;
            }
        }

        setIsLoading(true);

        try {
            if (authMethod === "email") {
                await signupWithEmail(email, password, name, "customer");
                toast.success("Account created successfully!");
            } else if (authMethod === "google") {
                await signupWithGoogle("customer");
                toast.success("Signed up with Google!");
            } else if (authMethod === "phone") {
                if (!otpSent) {
                    if (!recaptchaVerifier) {
                        toast.error("Please complete reCAPTCHA");
                        return;
                    }
                    const result = await signupWithPhone(phoneNumber, recaptchaVerifier);
                    setConfirmationResult(result);
                    setOtpSent(true);
                    toast.success("OTP sent to your phone!");
                } else {
                    if (!confirmationResult) {
                        toast.error("Please request OTP first");
                        return;
                    }
                    await verifyPhoneOTP(confirmationResult, otp, name, "customer");
                    toast.success("Account created successfully!");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle tailor signup
    const handleTailorSignup = async () => {
        if (isAddingRole) {
            await handleAddRole();
            return;
        }

        if (authMethod === "email") {
            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }
            if (password.length < 8) {
                toast.error("Password must be at least 8 characters");
                return;
            }
        }

        if (selectedSpecializations.length === 0) {
            toast.error("Please select at least one specialization");
            return;
        }

        setIsLoading(true);

        try {
            const businessDetails = {
                businessName,
                address: businessAddress,
                specialization: selectedSpecializations,
                phone: phoneNumber
            };

            if (authMethod === "email") {
                await signupWithEmail(email, password, name, "tailor", businessDetails);
                toast.success("Tailor account created successfully!");
            } else if (authMethod === "google") {
                await signupWithGoogle("tailor", businessDetails);
                toast.success("Signed up with Google!");
            } else if (authMethod === "phone") {
                if (!otpSent) {
                    if (!recaptchaVerifier) {
                        toast.error("Please complete reCAPTCHA");
                        return;
                    }
                    const result = await signupWithPhone(phoneNumber, recaptchaVerifier);
                    setConfirmationResult(result);
                    setOtpSent(true);
                    toast.success("OTP sent to your phone!");
                } else {
                    if (!confirmationResult) {
                        toast.error("Please request OTP first");
                        return;
                    }
                    await verifyPhoneOTP(confirmationResult, otp, name, "tailor", businessDetails);
                    toast.success("Tailor account created successfully!");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset signup flow
    const resetSignup = () => {
        setSelectedRole(null);
        setSignupStep(1);
        setIsAddingRole(false);
        // don't reset name/email if logged in (handled elsewhere)
    };

    return (
        <div className="min-h-screen w-full flex bg-background">
            {/* Left Side - Premium Visuals (Desktop Only) */}
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
                            <ShoppingBag className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold text-gradient-gold">Tailor Made Magic</h1>
                            <p className="text-white/60 tracking-wider text-sm uppercase">Premium Custom Tailoring</p>
                        </div>
                    </div>

                    {/* Welcome Text */}
                    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-5xl font-display font-medium leading-tight text-white">
                            Discover the Art of <br />
                            <span className="text-primary italic">Perfect Fitting.</span>
                        </h2>
                        <p className="text-lg text-white/70 font-light leading-relaxed">
                            Join our community of style enthusiasts and expert tailors.
                            Experience fashion that is uniquely yours.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="grid gap-6 pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-display font-semibold text-lg text-white">For Customers</h3>
                                <p className="text-sm text-white/60">Browse exclusive designs and book top-rated tailors</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-display font-semibold text-lg text-white">For Tailors</h3>
                                <p className="text-sm text-white/60">Grow your business and manage orders efficiently</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg mb-4">
                            <ShoppingBag className="w-8 h-8 text-primary-foreground" />
                        </Link>
                        <h1 className="text-3xl font-display font-bold">Tailor Made Magic</h1>
                        <p className="text-muted-foreground mt-2">Welcome! Sign in or create your account</p>
                    </div>

                    {/* Main Auth Card (No Shadow on Desktop split view, Shadow on Mobile) */}
                    <div className="bg-card lg:bg-transparent lg:shadow-none rounded-2xl shadow-elevated p-6 sm:p-0">
                        {/* If Adding Role, show simplified header */}
                        {isAddingRole ? (
                            <div className="mb-6 pb-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-display font-bold">Complete profile</h2>
                                    <Button variant="ghost" size="sm" onClick={() => setIsAddingRole(false)}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "signin" | "signup"); resetSignup(); }}>
                                <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-muted/50">
                                    <TabsTrigger value="signin" className="h-full font-medium">Sign In</TabsTrigger>
                                    <TabsTrigger value="signup" className="h-full font-medium">Sign Up</TabsTrigger>
                                </TabsList>

                                {/* SIGN IN TAB */}
                                <TabsContent value="signin" className="space-y-6">
                                    {!showForgotPassword ? (
                                        <>
                                            <div className="text-center mb-4">
                                                <h2 className="text-2xl font-display font-bold">Welcome Back</h2>
                                                <p className="text-sm text-muted-foreground mt-2">Sign in to your account</p>
                                            </div>

                                            <form onSubmit={handleSignIn} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="signin-email">Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                        <Input
                                                            id="signin-email"
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            value={signInEmail}
                                                            onChange={(e) => setSignInEmail(e.target.value)}
                                                            className="pl-10"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="signin-password">Password</Label>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowForgotPassword(true)}
                                                            className="text-sm text-primary hover:underline"
                                                        >
                                                            Forgot Password?
                                                        </button>
                                                    </div>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                        <Input
                                                            id="signin-password"
                                                            type={showSignInPassword ? "text" : "password"}
                                                            placeholder="Enter password"
                                                            value={signInPassword}
                                                            onChange={(e) => setSignInPassword(e.target.value)}
                                                            className="pl-10 pr-10"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSignInPassword(!showSignInPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                        >
                                                            {showSignInPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                                    {isLoading ? "Signing in..." : "Sign In"}
                                                </Button>
                                            </form>

                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <span className="w-full border-t" />
                                                </div>
                                                <div className="relative flex justify-center text-xs uppercase">
                                                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                                                </div>
                                            </div>

                                            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                                Google
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-center mb-4">
                                                <h2 className="text-2xl font-display font-bold">Reset Password</h2>
                                                <p className="text-sm text-muted-foreground mt-2">Enter your email to receive a password reset link</p>
                                            </div>

                                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="reset-email">Email</Label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                        <Input
                                                            id="reset-email"
                                                            type="email"
                                                            placeholder="your@email.com"
                                                            value={resetEmail}
                                                            onChange={(e) => setResetEmail(e.target.value)}
                                                            className="pl-10"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="w-full"
                                                    onClick={() => {
                                                        setShowForgotPassword(false);
                                                        setResetEmail("");
                                                    }}
                                                >
                                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                                    Back to Sign In
                                                </Button>
                                            </form>
                                        </>
                                    )}
                                </TabsContent>

                                {/* SIGN UP TAB */}
                                <TabsContent value="signup" className="space-y-6">
                                    {/* Step 1: Role Selection */}
                                    {signupStep === 1 && (
                                        <div className="space-y-6">
                                            <div className="text-center mb-6">
                                                <h2 className="text-2xl font-display font-bold">Join Tailor Made Magic</h2>
                                                <p className="text-sm text-muted-foreground mt-2">Choose how you want to use our platform</p>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {/* Customer Card */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedRole("customer");
                                                        setSignupStep(2);
                                                    }}
                                                    className="p-6 rounded-xl border-2 border-border hover:border-blue-500 hover:bg-blue-500/5 transition-all text-left group"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <ShoppingBag className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-display font-bold mb-2">I'm a Customer</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">Browse designs, order custom clothing, and track your orders</p>
                                                    <ul className="space-y-2 text-sm">
                                                        <li className="flex items-center gap-2">
                                                            <Check className="w-4 h-4 text-blue-500" />
                                                            <span>Browse catalog</span>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <Check className="w-4 h-4 text-blue-500" />
                                                            <span>Place orders</span>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <Check className="w-4 h-4 text-blue-500" />
                                                            <span>Track deliveries</span>
                                                        </li>
                                                    </ul>
                                                </button>

                                                {/* Tailor Card */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedRole("tailor");
                                                        setSignupStep(2);
                                                    }}
                                                    className="p-6 rounded-xl border-2 border-border hover:border-orange-500 hover:bg-orange-500/5 transition-all text-left group"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <Building2 className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-display font-bold mb-2">I'm a Tailor</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">Grow your business, manage orders, and connect with customers</p>
                                                    <ul className="space-y-2 text-sm">
                                                        <li className="flex items-center gap-2">
                                                            <Check className="w-4 h-4 text-orange-500" />
                                                            <span>Manage orders</span>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <Check className="w-4 h-4 text-orange-500" />
                                                            <span>Showcase work</span>
                                                        </li>
                                                        <li className="flex items-center gap-2">
                                                            <Check className="w-4 h-4 text-orange-500" />
                                                            <span>Grow business</span>
                                                        </li>
                                                    </ul>
                                                </button>
                                            </div>

                                            {/* Admin Invite Section */}
                                            <div className="mt-8 pt-6 border-t border-dashed">
                                                <button
                                                    onClick={() => setShowInviteInput(!showInviteInput)}
                                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mx-auto"
                                                >
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Have an admin invite code?
                                                </button>
                                                {showInviteInput && (
                                                    <div className="mt-4 flex gap-2 max-w-sm mx-auto">
                                                        <Input
                                                            placeholder="Enter code"
                                                            value={inviteCode}
                                                            onChange={(e) => setInviteCode(e.target.value)}
                                                        />
                                                        <Button
                                                            onClick={async () => {
                                                                if (!inviteCode) return;
                                                                setIsLoading(true);
                                                                try {
                                                                    const isValid = await verifyAdminCode(inviteCode);
                                                                    if (isValid) {
                                                                        toast.success("Admin code valid! You can now sign up as admin.");
                                                                        setSelectedRole('admin');
                                                                        setSignupStep(2);
                                                                        // Store code to mark as used later?
                                                                        // For now, assume possession of valid code is enough to enter signup flow
                                                                    } else {
                                                                        toast.error("Invalid or used invite code");
                                                                    }
                                                                } catch (err) {
                                                                    toast.error("Verification failed");
                                                                } finally {
                                                                    setIsLoading(false);
                                                                }
                                                            }}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? "Verifying..." : "Verify"}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        )}

                        {/* SHARED SIGNUP STEPS (Used by both Sign Up Tab and Add Role Flow) */}

                        {/* Step 2: Basic Info */}
                        {signupStep === 2 && selectedRole && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => isAddingRole ? setIsAddingRole(false) : setSignupStep(1)}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </button>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedRole === "customer"
                                        ? "bg-blue-500/10 text-blue-600"
                                        : selectedRole === "admin"
                                            ? "bg-purple-500/10 text-purple-600"
                                            : "bg-orange-500/10 text-orange-600"
                                        }`}>
                                        {selectedRole === "customer" ? "Customer" : selectedRole === "admin" ? "Admin" : "Tailor"} Signup
                                    </div>
                                </div>

                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-display font-bold">
                                        {isAddingRole ? "Profile Details" : "Basic Information"}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {isAddingRole ? "Complete your new profile" : "Tell us about yourself"}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {/* Only ask for Name/Email if NOT adding role to existing user */}
                                    {!isAddingRole && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        placeholder="Your full name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedRole === "tailor" && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="business-name">Business Name</Label>
                                                <Input
                                                    id="business-name"
                                                    type="text"
                                                    placeholder="Your business or shop name"
                                                    value={businessName}
                                                    onChange={(e) => setBusinessName(e.target.value)}
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="business-address">Business Address</Label>
                                                <Input
                                                    id="business-address"
                                                    type="text"
                                                    placeholder="Shop address"
                                                    value={businessAddress}
                                                    onChange={(e) => setBusinessAddress(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

                                    <Button
                                        onClick={() => setSignupStep(selectedRole === "tailor" ? 3 : 4)}
                                        className="w-full"
                                        size="lg"
                                        disabled={
                                            (!isAddingRole && (!name || !email)) ||
                                            (selectedRole === "tailor" && (!businessName || !businessAddress))
                                        }
                                    >
                                        Continue <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Specializations (Tailor Only) */}
                        {signupStep === 3 && selectedRole === "tailor" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => setSignupStep(2)}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </button>
                                </div>

                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-display font-bold">Your Specializations</h2>
                                    <p className="text-sm text-muted-foreground mt-2">Select the services you offer (choose at least one)</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {specializations.map((spec) => (
                                        <button
                                            key={spec}
                                            type="button"
                                            onClick={() => toggleSpecialization(spec)}
                                            className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all min-h-[44px] ${selectedSpecializations.includes(spec)
                                                ? 'border-orange-500 bg-orange-500/5'
                                                : 'border-border hover:border-orange-500/50'
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedSpecializations.includes(spec)
                                                    ? 'border-orange-500 bg-orange-500'
                                                    : 'border-muted-foreground'
                                                    }`}>
                                                    {selectedSpecializations.includes(spec) && (
                                                        <Check className="w-3 h-3 text-white" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{spec}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => setSignupStep(4)}
                                    className="w-full"
                                    size="lg"
                                    disabled={selectedSpecializations.length === 0}
                                >
                                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Step 4: Authentication / Confirmation */}
                        {signupStep === 4 && selectedRole && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <button
                                        onClick={() => setSignupStep(selectedRole === "tailor" ? 3 : 2)}
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back
                                    </button>
                                </div>

                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-display font-bold">
                                        {isAddingRole ? "Confirm Profile" : "Create Your Account"}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {isAddingRole ? "Review and create your new profile" : "Choose your preferred signup method"}
                                    </p>
                                </div>

                                {/* If ADDING ROLE, just show Confirm Button */}
                                {isAddingRole ? (
                                    <div className="space-y-4">
                                        <div className="bg-muted p-4 rounded-lg text-sm">
                                            <p><strong>Adding Role:</strong> {selectedRole}</p>
                                            {selectedRole === 'tailor' && (
                                                <>
                                                    <p><strong>Business:</strong> {businessName}</p>
                                                    <p><strong>Services:</strong> {selectedSpecializations.length} selected</p>
                                                </>
                                            )}
                                        </div>
                                        <Button onClick={handleAddRole} className="w-full" size="lg" disabled={isLoading}>
                                            {isLoading ? "Creating..." : "Confirm & Create Profile"}
                                        </Button>
                                    </div>
                                ) : (
                                    /* Standard Signup: Choose Auth Method */
                                    <>
                                        {/* Auth Method Selection */}
                                        <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
                                            <button
                                                onClick={() => setAuthMethod("email")}
                                                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${authMethod === "email" ? "bg-background shadow-sm" : "hover:bg-background/50"
                                                    }`}
                                            >
                                                Email
                                            </button>
                                            <button
                                                onClick={() => setAuthMethod("google")}
                                                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${authMethod === "google" ? "bg-background shadow-sm" : "hover:bg-background/50"
                                                    }`}
                                            >
                                                Google
                                            </button>
                                            <button
                                                onClick={() => setAuthMethod("phone")}
                                                className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${authMethod === "phone" ? "bg-background shadow-sm" : "hover:bg-background/50"
                                                    }`}
                                            >
                                                Phone
                                            </button>
                                        </div>

                                        {/* Email Auth */}
                                        {authMethod === "email" && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="password">Password</Label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                        <Input
                                                            id="password"
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Create password (min 8 characters)"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="pl-10 pr-10"
                                                            required
                                                            minLength={8}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                        >
                                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                                    <Input
                                                        id="confirm-password"
                                                        type="password"
                                                        placeholder="Confirm password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <Button
                                                    onClick={selectedRole === "customer" ? handleCustomerSignup : handleTailorSignup}
                                                    className="w-full"
                                                    size="lg"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? "Creating account..." : "Create Account"}
                                                </Button>
                                            </div>
                                        )}

                                        {/* Google Auth */}
                                        {authMethod === "google" && (
                                            <div className="space-y-4">
                                                <Button
                                                    onClick={handleGoogleSignIn}
                                                    variant="outline"
                                                    className="w-full"
                                                    size="lg"
                                                    disabled={isLoading}
                                                >
                                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                    </svg>
                                                    {isLoading ? "Signing up..." : "Continue with Google"}
                                                </Button>
                                            </div>
                                        )}

                                        {/* Phone Auth */}
                                        {authMethod === "phone" && (
                                            <div className="space-y-4">
                                                {!otpSent ? (
                                                    <>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="phone">Phone Number</Label>
                                                            <div className="relative">
                                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                                <Input
                                                                    id="phone"
                                                                    type="tel"
                                                                    placeholder="+1 234 567 8900"
                                                                    value={phoneNumber}
                                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                                    className="pl-10"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div id="recaptcha-container"></div>

                                                        <Button
                                                            onClick={selectedRole === "customer" ? handleCustomerSignup : handleTailorSignup}
                                                            className="w-full"
                                                            size="lg"
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? "Sending OTP..." : "Send OTP"}
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="otp">Enter OTP</Label>
                                                            <Input
                                                                id="otp"
                                                                type="text"
                                                                placeholder="6-digit code"
                                                                value={otp}
                                                                onChange={(e) => setOtp(e.target.value)}
                                                                maxLength={6}
                                                                required
                                                            />
                                                        </div>

                                                        <Button
                                                            onClick={selectedRole === "customer" ? handleCustomerSignup : handleTailorSignup}
                                                            className="w-full"
                                                            size="lg"
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? "Verifying..." : "Verify & Create Account"}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        <p className="text-xs text-center text-muted-foreground">
                                            By creating an account, you agree to our{" "}
                                            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                                            and{" "}
                                            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                        </p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Back to home link */}
                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-foreground transition-colors">← Back to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
