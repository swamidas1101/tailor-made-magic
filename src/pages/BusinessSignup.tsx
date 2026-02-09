import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Scissors, Lock, Mail, User, ArrowRight, Eye, EyeOff,
    Phone, Building2, MapPin, Sparkles, ShieldCheck, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Checkbox } from "@/components/ui/checkbox";

const specializations = [
    "Blouse Stitching",
    "Kurti & Suits",
    "Lehenga & Bridal",
    "Men's Formal Wear",
    "Alterations",
    "Embroidery Work",
    "Designer Wear",
    "Kids Wear"
];

export default function BusinessSignup() {
    const { signupWithEmail, signupWithPhone, verifyPhoneOTP, loginWithGoogle, signupWithGoogle, user, activeRole } = useAuth();
    const navigate = useNavigate();

    // Multi-step form state
    const [step, setStep] = useState(1);
    const [authMethod, setAuthMethod] = useState<"email" | "phone" | "google">("email");

    // Form data
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [address, setAddress] = useState("");
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

    // Redirect if already logged in
    useEffect(() => {
        if (user && activeRole) {
            if (activeRole === 'tailor') navigate('/tailor');
            else if (activeRole === 'admin') navigate('/admin');
        }
    }, [user, activeRole, navigate]);

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

    const toggleSpecialization = (spec: string) => {
        setSelectedSpecializations(prev =>
            prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
        );
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (selectedSpecializations.length === 0) {
            toast.error("Please select at least one specialization");
            return;
        }

        setIsLoading(true);

        try {
            await signupWithEmail(email, password, name, "tailor", {
                businessName,
                address,
                specialization: selectedSpecializations,
                phone
            });
            toast.success("Account created successfully! Welcome to Tailo.");
            navigate("/tailor");
        } catch (error: any) {
            toast.error(error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!recaptchaVerifier) {
            toast.error("Please complete the reCAPTCHA verification");
            return;
        }

        if (selectedSpecializations.length === 0) {
            toast.error("Please select at least one specialization");
            return;
        }

        setIsLoading(true);

        try {
            // Format phone number (ensure it starts with country code)
            const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

            const result = await signupWithPhone(formattedPhone, recaptchaVerifier);
            setConfirmationResult(result);
            setOtpSent(true);
            toast.success("OTP sent to your phone number");
        } catch (error: any) {
            toast.error(error.message || "Failed to send OTP");
            // Reset reCAPTCHA on error
            if (recaptchaVerifier) {
                recaptchaVerifier.clear();
                setRecaptchaVerifier(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!confirmationResult) {
            toast.error("Please request OTP first");
            return;
        }

        setIsLoading(true);

        try {
            await verifyPhoneOTP(confirmationResult, otp, name, "tailor", {
                businessName,
                address,
                specialization: selectedSpecializations,
                phone: phone.startsWith('+') ? phone : `+91${phone}`
            });
            toast.success("Account created successfully! Welcome to Tailo.");
            navigate("/tailor");
        } catch (error: any) {
            toast.error(error.message || "Invalid OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        if (selectedSpecializations.length === 0) {
            toast.error("Please select at least one specialization first");
            return;
        }

        try {
            await signupWithGoogle('tailor', {
                businessName,
                address,
                specialization: selectedSpecializations,
                phone: phone
            });
            toast.success("Signed up as Tailor with Google!");
            // Auto-redirect handles navigation
        } catch (error: any) {
            toast.error(error.message || "Google signup failed");
        }
    };

    const canProceedToStep2 = name && businessName;
    const canProceedToStep3 = selectedSpecializations.length > 0;

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
                                <Building2 className="w-8 h-8 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-bold text-gradient-gold">Tailor Made Magic</h1>
                                <p className="text-white/60 tracking-wider text-sm uppercase">Join Our Network</p>
                            </div>
                        </div>

                        {/* Welcome Text */}
                        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-5xl font-display font-medium leading-tight text-white">
                                Expand Your <br />
                                <span className="text-primary italic">Reach & Business.</span>
                            </h2>
                            <p className="text-lg text-white/70 font-light leading-relaxed">
                                Connect with thousands of customers looking for premium tailoring services.
                                Manage your orders, showcase your portfolio, and grow with us.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="grid gap-6 pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-lg text-white">New Customers Daily</h3>
                                    <p className="text-sm text-white/60">Get discovered by people in your area</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Check className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-display font-semibold text-lg text-white">Seamless Management</h3>
                                    <p className="text-sm text-white/60">Track orders and payments effortlessly</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background overflow-y-auto">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-6 sm:mb-8 justify-center">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-display font-bold">Business Portal</h1>
                                <p className="text-xs text-muted-foreground">For Tailors</p>
                            </div>
                        </div>

                        {/* Progress Steps */}
                        <div className="mb-6 sm:mb-8">
                            <div className="flex items-center justify-between mb-2">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex items-center flex-1">
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= s ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md' : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {s}
                                        </div>
                                        {s < 3 && (
                                            <div className={`flex-1 h-1 mx-1 sm:mx-2 rounded transition-colors ${step > s ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 'bg-muted'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground px-1">
                                <span className="text-left">Basic Info</span>
                                <span className="text-center">Specialization</span>
                                <span className="text-right">Authentication</span>
                            </div>
                        </div>

                        {/* Step 1: Basic Information */}
                        {step === 1 && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="text-center mb-4 sm:mb-6">
                                    <h2 className="text-xl sm:text-2xl font-display font-bold">Basic Information</h2>
                                    <p className="text-sm text-muted-foreground mt-2">Tell us about yourself and your business</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Your Full Name *</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="businessName">Business/Shop Name *</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="businessName"
                                                type="text"
                                                placeholder="Elite Tailors"
                                                value={businessName}
                                                onChange={(e) => setBusinessName(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Business Address</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="address"
                                                type="text"
                                                placeholder="123 Main Street, City"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => setStep(2)}
                                        className="w-full"
                                        size="lg"
                                        disabled={!canProceedToStep2}
                                    >
                                        Continue <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Specialization */}
                        {step === 2 && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="text-center mb-4 sm:mb-6">
                                    <h2 className="text-xl sm:text-2xl font-display font-bold">Your Specialization</h2>
                                    <p className="text-sm text-muted-foreground mt-2">Select the services you offer (choose at least one)</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {specializations.map((spec) => (
                                        <button
                                            key={spec}
                                            type="button"
                                            onClick={() => toggleSpecialization(spec)}
                                            className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all min-h-[44px] ${selectedSpecializations.includes(spec)
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedSpecializations.includes(spec)
                                                    ? 'border-primary bg-primary'
                                                    : 'border-muted-foreground'
                                                    }`}>
                                                    {selectedSpecializations.includes(spec) && (
                                                        <Check className="w-3 h-3 text-primary-foreground" />
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">{spec}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setStep(1)}
                                        variant="outline"
                                        className="w-full"
                                        size="lg"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={() => setStep(3)}
                                        className="w-full"
                                        size="lg"
                                        disabled={!canProceedToStep3}
                                    >
                                        Continue <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Authentication */}
                        {step === 3 && (
                            <div className="space-y-4 sm:space-y-6">
                                <div className="text-center mb-4 sm:mb-6">
                                    <h2 className="text-xl sm:text-2xl font-display font-bold">Create Your Account</h2>
                                    <p className="text-sm text-muted-foreground mt-2">Choose your preferred signup method</p>
                                </div>

                                {/* Auth Method Selection */}
                                <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setAuthMethod("email")}
                                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${authMethod === "email" ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                            }`}
                                    >
                                        Email
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAuthMethod("phone")}
                                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${authMethod === "phone" ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                            }`}
                                    >
                                        Phone
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAuthMethod("google")}
                                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${authMethod === "google" ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                                            }`}
                                    >
                                        Google
                                    </button>
                                </div>

                                {/* Email Signup Form */}
                                {authMethod === "email" && (
                                    <form onSubmit={handleEmailSignup} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
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

                                        <div className="space-y-2">
                                            <Label htmlFor="phone-email">Phone Number (Optional)</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    id="phone-email"
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password *</Label>
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
                                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Confirm password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <Button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                variant="outline"
                                                className="w-full"
                                                size="lg"
                                            >
                                                Back
                                            </Button>
                                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                                {isLoading ? "Creating account..." : (
                                                    <>Create Account <ArrowRight className="ml-2 w-4 h-4" /></>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {/* Phone Signup Form */}
                                {authMethod === "phone" && !otpSent && (
                                    <form onSubmit={handlePhoneSignup} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="phone-number">Phone Number *</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    id="phone-number"
                                                    type="tel"
                                                    placeholder="+91 98765 43210"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Include country code (e.g., +91 for India)</p>
                                        </div>

                                        {/* reCAPTCHA Container */}
                                        <div id="recaptcha-container" className="flex justify-center"></div>

                                        <div className="flex gap-3 pt-2">
                                            <Button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                variant="outline"
                                                className="w-full"
                                                size="lg"
                                            >
                                                Back
                                            </Button>
                                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                                {isLoading ? "Sending OTP..." : "Send OTP"}
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {/* OTP Verification Form */}
                                {authMethod === "phone" && otpSent && (
                                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg">
                                            <p className="text-sm text-emerald-800 dark:text-emerald-200">
                                                OTP sent to {phone}. Please enter the code below.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="otp">Enter OTP *</Label>
                                            <Input
                                                id="otp"
                                                type="text"
                                                placeholder="Enter 6-digit code"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                maxLength={6}
                                                required
                                            />
                                        </div>

                                        <div className="flex gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    setOtpSent(false);
                                                    setOtp("");
                                                    setConfirmationResult(null);
                                                }}
                                                variant="outline"
                                                className="w-full"
                                                size="lg"
                                            >
                                                Resend OTP
                                            </Button>
                                            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                                                {isLoading ? "Verifying..." : "Verify & Create Account"}
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {/* Google Signup */}
                                {authMethod === "google" && (
                                    <div className="space-y-4">
                                        <Button
                                            type="button"
                                            onClick={handleGoogleSignup}
                                            variant="outline"
                                            className="w-full"
                                            size="lg"
                                        >
                                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Continue with Google
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            variant="outline"
                                            className="w-full"
                                            size="lg"
                                        >
                                            Back
                                        </Button>
                                    </div>
                                )}

                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    By creating an account, you agree to our{" "}
                                    <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}
                                    and{" "}
                                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                </p>
                            </div>
                        )}

                        {/* Already have account link */}
                        <p className="text-center mt-6 text-xs sm:text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/auth/business/login" className="text-primary hover:underline font-medium">Sign in here</Link>
                        </p>

                        {/* Customer signup link */}
                        <p className="text-center mt-2 text-xs sm:text-sm text-muted-foreground">
                            Looking for customer signup?{" "}
                            <Link to="/auth/customer" className="text-primary hover:underline font-medium">Customer Portal →</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
