import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ShoppingBag, Building2, Mail, Lock, User, Eye, EyeOff, Check, ArrowRight, ArrowLeft, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { DatePicker } from "@/components/ui/date-picker";

type AuthMethod = "email" | "google" | "phone";

export default function Auth() {
    const {
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        signupWithGoogle,
        completeProfile,
        user,
        userRoles,
        activeRole,
        verifyAdminCode,
        resetPassword,
        logout
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

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
    const [signupStep, setSignupStep] = useState(1); // 1: Role selection, 2: Auth method, 3: Profile Details
    const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
    const [inviteCode, setInviteCode] = useState("");
    const [showInviteInput, setShowInviteInput] = useState(false);

    // Common signup fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState("+91");

    // Tailor-specific fields
    const [businessName, setBusinessName] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
    const [dob, setDob] = useState<Date | undefined>(undefined);

    const [isLoading, setIsLoading] = useState(false);
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

    const toggleSpecialization = (spec: string) => {
        if (selectedSpecializations.includes(spec)) {
            setSelectedSpecializations(prev => prev.filter(s => s !== spec));
        } else {
            setSelectedSpecializations(prev => [...prev, spec]);
        }
    };

    useEffect(() => {
        if (user && activeRole && !isAddingRole) {
            const destination = location.state?.from;
            if (destination) {
                navigate(destination, { replace: true });
            } else {
                if (activeRole === 'customer') navigate('/');
                else if (activeRole === 'tailor') navigate('/tailor');
                else if (activeRole === 'admin') navigate('/admin');
            }
        }
    }, [user, activeRole, isAddingRole, navigate, location.state]);

    // Unified Signup Trigger (After Step 1 Auth)
    const handleAuthSuccess = async (authUser: any) => {
        if (authUser?.displayName) {
            setName(authUser.displayName);
        }
        setSignupStep(3); // Move to Profile Details
        toast.success("Identity verified! Now, let's complete your profile.");
    };

    const getAuthErrorMessage = (error: any) => {
        const code = error?.code || "";
        switch (code) {
            case "auth/email-already-in-use":
                return "This email is already registered. Please sign in instead.";
            case "auth/invalid-email":
                return "Please enter a valid email address.";
            case "auth/weak-password":
                return "Password should be at least 6 characters.";
            case "auth/user-not-found":
                return "No account found with this email.";
            case "auth/wrong-password":
                return "Incorrect password. Please try again.";
            case "auth/invalid-credential":
                return "Invalid login credentials. Please check your email and password.";
            case "auth/network-request-failed":
                return "Network error. Please check your internet connection.";
            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";
            default:
                return error?.message || "An unexpected error occurred. Please try again.";
        }
    };

    // Handle Phone Signup (Refactored: No OTP, uses Phone+Password)
    const handlePhoneSignupStart = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            toast.error("Please enter a valid phone number");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        try {
            const cleanPhone = phoneNumber.replace(/\D/g, "");
            const fullPhone = `${countryCode}${cleanPhone}`;
            const syntheticEmail = `${fullPhone}@tailor-made-magic.com`;

            const newUser = await signupWithEmail(syntheticEmail, password);
            if (newUser) {
                await handleAuthSuccess(newUser);
            }
        } catch (error: any) {
            toast.error(getAuthErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteProfile = async () => {
        if (!user) return;
        if (!name || !dob || !selectedRole) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsLoading(true);
        try {
            const businessDetails = selectedRole === 'tailor' ? {
                businessName,
                address: businessAddress,
                specialization: selectedSpecializations,
                phone: phoneNumber
            } : undefined;

            await completeProfile(user.uid, {
                name,
                dob: dob.toISOString(),
                role: selectedRole,
                email: authMethod === 'phone' ? (email || undefined) : undefined,
                phone: authMethod !== 'phone' ? (phoneNumber || undefined) : undefined,
                businessDetails
            });

            toast.success("Profile completed successfully!");
        } catch (error: any) {
            toast.error(getAuthErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailSignupStart = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setIsLoading(true);
        try {
            const newUser = await signupWithEmail(email, password);
            if (newUser) {
                await handleAuthSuccess(newUser);
            }
        } catch (error: any) {
            toast.error(getAuthErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await loginWithEmail(signInEmail, signInPassword);
            toast.success("Welcome back!");
        } catch (error: any) {
            toast.error(getAuthErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'signin') {
                await loginWithGoogle();
                toast.success("Signed in with Google!");
            } else {
                const newUser = await signupWithGoogle();
                if (newUser) {
                    await handleAuthSuccess(newUser);
                }
            }
        } catch (error: any) {
            toast.error(getAuthErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    const resetAuthFields = () => {
        // Common Fields
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setPhoneNumber("");
        setCountryCode("+91");

        // Tailor Fields
        setBusinessName("");
        setBusinessAddress("");
        setSelectedSpecializations([]);
        setDob(undefined);

        // Sign In fields
        setSignInEmail("");
        setSignInPassword("");
        setResetEmail("");
    };

    const resetAllForms = () => {
        resetAuthFields();

        // Tab/Step Reset
        setSelectedRole(null);
        setSignupStep(1);
        setAuthMethod("email");
        setInviteCode("");
        setShowInviteInput(false);
        setIsAddingRole(false);
        setShowSignInPassword(false);
        setShowForgotPassword(false);
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail) return;
        setIsLoading(true);
        try {
            await resetPassword(resetEmail);
            toast.success("Reset link sent!");
            setShowForgotPassword(false);
        } catch (error: any) {
            toast.error(getAuthErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-background">
            {/* Left Side Visuals - Premium Experience */}
            <div className="hidden lg:flex w-1/2 bg-[#1a1a1a] relative overflow-hidden items-center justify-center text-ivory p-12">
                <div className="absolute inset-0 pattern-luxury opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-transparent to-primary/10" />
                <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
                <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-gold/10 blur-3xl animate-pulse-glow delay-1000" />

                <div className="relative z-10 max-w-lg space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-luxury">
                            <ShoppingBag className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold text-gradient-gold">Tailor Made Magic</h1>
                            <p className="text-white/60 tracking-wider text-sm uppercase">Premium Custom Tailoring</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-5xl font-display font-medium leading-tight text-white">
                            Discover the Art of <br />
                            <span className="text-primary italic">Perfect Fitting.</span>
                        </h2>
                        <p className="text-lg text-white/70 font-light leading-relaxed">
                            Join our community of style enthusiasts and expert tailors.
                            Experience fashion that is uniquely yours.
                        </p>
                    </div>

                    <div className="grid gap-6 pt-8">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Verified Designers</h3>
                                <p className="text-xs text-white/60">Curated experts for your needs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="bg-card lg:bg-transparent lg:shadow-none rounded-2xl shadow-elevated p-6 sm:p-0">
                        {isAddingRole ? (
                            <div className="mb-6 pb-6 border-b">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-display font-bold">Complete profile</h2>
                                    <Button variant="ghost" size="sm" onClick={() => setIsAddingRole(false)}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "signin" | "signup"); resetAllForms(); }}>
                                <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-muted/50">
                                    <TabsTrigger value="signin" className="h-full font-medium">Sign In</TabsTrigger>
                                    <TabsTrigger value="signup" className="h-full font-medium">Sign Up</TabsTrigger>
                                </TabsList>

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
                                                        <Input id="signin-email" type="email" placeholder="your@email.com" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} className="pl-10" required />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label htmlFor="signin-password">Password</Label>
                                                        <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-primary hover:underline">Forgot Password?</button>
                                                    </div>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                        <Input id="signin-password" type={showSignInPassword ? "text" : "password"} placeholder="Enter password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} className="pl-10 pr-10" required />
                                                        <button type="button" onClick={() => setShowSignInPassword(!showSignInPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                                            {showSignInPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Signing in..." : "Sign In"}</Button>
                                            </form>
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                                            </div>
                                            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={handleGoogleAuth} disabled={isLoading}>
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                                Google
                                            </Button>
                                        </>
                                    ) : (
                                        <form onSubmit={handleForgotPassword} className="space-y-4">
                                            <div className="text-center mb-4">
                                                <h2 className="text-2xl font-display font-bold">Reset Password</h2>
                                                <p className="text-sm text-muted-foreground mt-2">Enter your email for reset link</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="reset-email">Email</Label>
                                                <Input id="reset-email" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
                                            </div>
                                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Sending..." : "Send Reset Link"}</Button>
                                            <Button type="button" variant="ghost" className="w-full" onClick={() => setShowForgotPassword(false)}>Back</Button>
                                        </form>
                                    )}
                                </TabsContent>

                                <TabsContent value="signup" className="space-y-6">
                                    {signupStep === 1 && (
                                        <div className="space-y-6">
                                            <div className="text-center mb-6">
                                                <h2 className="text-2xl font-display font-bold">Join Tailor Made Magic</h2>
                                                <p className="text-sm text-muted-foreground mt-2">Choose how you want to use our platform</p>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {/* Customer Card */}
                                                <button
                                                    onClick={() => { setSelectedRole("customer"); setSignupStep(2); }}
                                                    className="p-6 rounded-xl border-2 border-border hover:border-blue-500 hover:bg-blue-500/5 transition-all text-left group"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <ShoppingBag className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-display font-bold mb-2">I'm a Customer</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">Browse designs, order custom clothing, and track your orders</p>
                                                    <ul className="space-y-2 text-sm">
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /><span>Browse catalog</span></li>
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-blue-500" /><span>Place orders</span></li>
                                                    </ul>
                                                </button>

                                                {/* Tailor Card */}
                                                <button
                                                    onClick={() => { setSelectedRole("tailor"); setSignupStep(2); }}
                                                    className="p-6 rounded-xl border-2 border-border hover:border-orange-500 hover:bg-orange-500/5 transition-all text-left group"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <Building2 className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-display font-bold mb-2">I'm a Tailor</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">Grow your business, manage orders, and connect with customers</p>
                                                    <ul className="space-y-2 text-sm">
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500" /><span>Manage orders</span></li>
                                                        <li className="flex items-center gap-2"><Check className="w-4 h-4 text-orange-500" /><span>Showcase work</span></li>
                                                    </ul>
                                                </button>
                                            </div>

                                            {/* Admin Invite Section */}
                                            <div className="mt-8 pt-6 border-t border-dashed">
                                                <button onClick={() => setShowInviteInput(!showInviteInput)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mx-auto">
                                                    <ShieldCheck className="w-4 h-4" /> Have an admin invite code?
                                                </button>
                                                {showInviteInput && (
                                                    <div className="mt-4 flex gap-2 max-w-sm mx-auto">
                                                        <Input placeholder="Enter code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
                                                        <Button onClick={async () => {
                                                            if (!inviteCode) return;
                                                            setIsLoading(true);
                                                            try {
                                                                const isValid = await verifyAdminCode(inviteCode);
                                                                if (isValid) {
                                                                    toast.success("Admin code valid!");
                                                                    setSelectedRole('admin');
                                                                    setSignupStep(2);
                                                                } else { toast.error("Invalid invite code"); }
                                                            } catch (err) { toast.error("Verification failed"); } finally { setIsLoading(false); }
                                                        }} disabled={isLoading}>{isLoading ? "..." : "Verify"}</Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        )}

                        {signupStep === 2 && selectedRole && (
                            <div className="space-y-6">
                                <Button variant="ghost" onClick={() => setSignupStep(1)} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-display font-bold">Verify Your Identity</h2>
                                    <p className="text-sm text-muted-foreground mt-2">Choose your preferred method</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
                                    {(["email", "google", "phone"] as AuthMethod[]).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => {
                                                setAuthMethod(m);
                                                resetAuthFields();
                                            }}
                                            className={`py-2 px-3 rounded-md text-xs font-medium transition-colors capitalize ${authMethod === m ? "bg-background shadow-sm" : "hover:bg-background/50"}`}
                                        >
                                            {m}
                                        </button>
                                    ))}
                                </div>

                                {authMethod === "google" && (
                                    <div className="space-y-4">
                                        <Button variant="outline" className="w-full h-12 flex items-center justify-center gap-2" onClick={handleGoogleAuth} disabled={isLoading}>
                                            <svg className="w-5 h-5 font-bold" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Continue with Google
                                        </Button>
                                    </div>
                                )}

                                {authMethod === "phone" && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Mobile Number</Label>
                                            <div className="flex gap-2">
                                                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="w-20 rounded-md border border-input bg-background px-2 py-2 text-sm">
                                                    <option value="+91">+91 (IN)</option>
                                                    <option value="+1">+1 (US)</option>
                                                    <option value="+44">+44 (UK)</option>
                                                </select>
                                                <Input id="phone" type="tel" placeholder="9876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone-password">Password</Label>
                                            <Input id="phone-password" type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone-confirm-password">Confirm Password</Label>
                                            <Input id="phone-confirm-password" type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                        </div>
                                        <Button onClick={handlePhoneSignupStart} className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Processing..." : "Continue"}</Button>
                                    </div>
                                )}

                                {authMethod === "email" && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input id="password" type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm Password</Label>
                                            <Input id="confirm-password" type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                        </div>
                                        <Button onClick={handleEmailSignupStart} className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Processing..." : "Continue"}</Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {signupStep === 3 && selectedRole && (
                            <div className="space-y-6">
                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-display font-bold">Complete Your Profile</h2>
                                    <p className="text-sm text-muted-foreground mt-2">Just a few more details to get you started</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="complete-name">Full Name</Label>
                                        <Input id="complete-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date of Birth</Label>
                                        <DatePicker date={dob} onChange={setDob} placeholder="Select birth date" />
                                    </div>

                                    {authMethod === "phone" ? (
                                        <div className="space-y-2">
                                            <Label htmlFor="extra-email">Email Address <span className="text-muted-foreground text-[10px] ml-1">(Optional)</span></Label>
                                            <Input id="extra-email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Label htmlFor="extra-phone">Mobile Number <span className="text-red-500">*</span></Label>
                                            <div className="flex gap-2">
                                                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="w-20 rounded-md border border-input bg-background px-2 py-2 text-sm">
                                                    <option value="+91">+91 (IN)</option>
                                                    <option value="+1">+1 (US)</option>
                                                </select>
                                                <Input id="extra-phone" type="tel" placeholder="9876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                                            </div>
                                        </div>
                                    )}

                                    {selectedRole === "tailor" && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <h3 className="font-semibold text-sm">Business Details</h3>
                                            <div className="space-y-2">
                                                <Label htmlFor="biz-name">Business Name</Label>
                                                <Input id="biz-name" placeholder="Boutique Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="biz-addr">Shop Address</Label>
                                                <Input id="biz-addr" placeholder="Full Address" value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Specializations</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {specializations.map(s => (
                                                        <button key={s} onClick={() => toggleSpecialization(s)} className={`text-xs p-2 rounded-md border transition-all ${selectedSpecializations.includes(s) ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{s}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <Button onClick={handleCompleteProfile} className="w-full" size="lg" disabled={isLoading}>{isLoading ? "Saving Profile..." : "Complete Signup"}</Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-center mt-6 text-sm text-muted-foreground">
                        <Link to="/" className="hover:text-foreground transition-colors">← Back to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
