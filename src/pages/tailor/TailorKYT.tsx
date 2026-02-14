import { useState, useEffect } from 'react';
import { useAuth, KYTData, KYTStatus } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Save, ArrowRight, ArrowLeft, CheckCircle2, Circle, AlertCircle, File, Upload, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GlobalLoader } from '@/components/ui/GlobalLoader';
import { FileUploader } from '@/components/ui/file-uploader';
import { cn } from '@/lib/utils';
import { DatePicker } from "@/components/ui/date-picker";

const steps = [
    { id: 1, name: 'Personal & Address', icon: UserIcon },
    { id: 2, name: 'Documents', icon: FileTextIcon },
    { id: 3, name: 'Bank', icon: BankIcon }
];

// FileUploader component removed (moved to @/components/ui/file-uploader)

function UserIcon({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}

function FileTextIcon({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>;
}

function BankIcon({ className }: { className?: string }) {
    return <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>;
}

export default function TailorKYT() {
    const { user, kytData, kytStatus, updateKYTData, logout } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isFetchingZip, setIsFetchingZip] = useState(false);

    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(0);

    // Initial State derived from KYT Data
    const [formData, setFormData] = useState<KYTData>({
        currentStep: 1,
        personal: {
            fullName: user?.displayName || '',
            phone: user?.phoneNumber || '',
            profileImage: '',
            dob: '',
            isMobileVerified: false
        },
        address: { shopName: '', shopAddress: '', city: '', state: '', zip: '' },
        professional: { experienceYears: '', specialization: [] },
        documents: { aadharNumber: '', panNumber: '', gstNumber: '', aadharImage: '', panImage: '' },
        bank: { accountNumber: '', confirmAccountNumber: '', ifsc: '', holderName: '', bankName: '' }
    });

    useEffect(() => {
        if (kytData) {
            setFormData(prev => ({
                ...prev,
                ...kytData,
                personal: {
                    ...prev.personal!,
                    ...kytData.personal,
                    // Persist verification if phone hasn't changed
                    isMobileVerified: kytData.personal?.isMobileVerified ?? false
                }
            }));
            if (kytData.currentStep) {
                setCurrentStep(Math.min(kytData.currentStep, 3));
            }
        }
    }, [kytData]);

    // OTP Timer
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Zip Code Automation
    useEffect(() => {
        const fetchZipDetails = async (pin: string) => {
            if (kytStatus === 'submitted' || kytStatus === 'approved') return;
            if (pin.length !== 6 || !/^\d{6}$/.test(pin)) return;

            setIsFetchingZip(true);
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                const data = await response.json();

                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    setFormData(prev => ({
                        ...prev,
                        address: { ...prev.address!, city: postOffice.District, state: postOffice.State }
                    }));
                    toast.success(`Location found: ${postOffice.District}, ${postOffice.State}`);
                }
            } catch (error) {
                console.error("Zip Fetch Error:", error);
            } finally {
                setIsFetchingZip(false);
            }
        };

        const pin = formData.address?.zip;
        if (pin && pin.length === 6) fetchZipDetails(pin);
    }, [formData.address?.zip]);

    const handleSendOtp = () => {
        if (!formData.personal?.phone || formData.personal.phone.length !== 10) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }
        setShowOtpInput(true);
        setTimer(30);
        toast.info("OTP sent to your mobile (Use 111111).");
    };

    const handleVerifyOtp = () => {
        if (otp === "111111") {
            updateField('personal', 'isMobileVerified', true);
            setShowOtpInput(false);
            toast.success("Mobile number verified successfully!");
        } else {
            toast.error("Invalid OTP. Try 111111");
        }
    };

    // Validation for "Next" button state
    const isStepValid = () => {
        if (currentStep === 1) {
            const p = formData.personal;
            const a = formData.address;
            const isPersonalValid = !!(p?.fullName && p?.phone?.length === 10 && p?.dob && p?.profileImage && p?.isMobileVerified);
            const isAddressValid = !!(a?.shopName && a?.shopAddress && a?.city && a?.state && a?.zip?.length === 6);
            return isPersonalValid && isAddressValid;
        }
        if (currentStep === 2) {
            const d = formData.documents;
            return !!(d?.aadharNumber?.length === 12 && d?.panNumber?.length === 10 && d?.aadharImage && d?.panImage);
        }
        if (currentStep === 3) {
            const b = formData.bank;
            return !!(b?.holderName && b?.bankName && b?.accountNumber && b?.ifsc && b?.accountNumber === b?.confirmAccountNumber);
        }
        return false;
    };

    const handleNext = async () => {
        if (!isStepValid()) {
            toast.error("Please fill all mandatory fields correctly.");
            return;
        }
        setIsLoading(true);
        try {
            if (currentStep < 3) {
                await updateKYTData({ ...formData, currentStep: currentStep + 1 });
                setCurrentStep(prev => prev + 1);
            } else {
                await updateKYTData(formData, 'submitted');
                toast.success("Profile submitted for verification!");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        try {
            await updateKYTData({ ...formData, currentStep });
            toast.success("Progress saved!");
        } catch (error: any) {
            toast.error("Failed to save progress.");
        } finally {
            setIsSaving(false);
        }
    };

    const removeImage = (section: 'personal' | 'documents', field: string) => {
        updateField(section, field, '');
    };

    // Avatar Upload Handler
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateField('personal', 'profileImage', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateField = (section: keyof KYTData, field: string, value: any) => {
        let finalValue = value;

        if (section === 'documents' && field === 'panNumber') finalValue = value.toUpperCase();

        const numericFields = ['zip', 'aadharNumber', 'accountNumber', 'confirmAccountNumber'];
        if (numericFields.includes(field)) finalValue = value.replace(/\D/g, '');

        // Strict 10-digit mobile number
        if (field === 'phone') {
            finalValue = value.replace(/\D/g, '').slice(0, 10);
        }

        if (field === 'zip') finalValue = finalValue.slice(0, 6);
        if (field === 'aadharNumber') finalValue = finalValue.slice(0, 12);
        if (field === 'panNumber') finalValue = finalValue.slice(0, 10);

        // Reset verification if phone changes
        if (section === 'personal' && field === 'phone' && value !== formData.personal?.phone) {
            setFormData(prev => ({
                ...prev,
                personal: { ...prev.personal!, [field]: finalValue, isMobileVerified: false }
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [section]: { ...(prev[section] as any), [field]: finalValue }
        }));
    };

    const handleReturnHome = async () => {
        try { await logout(); navigate('/', { replace: true }); } catch (e) { window.location.href = '/'; }
    };

    // Render Success/Pending Screens
    if (kytStatus === 'submitted' || kytStatus === 'approved') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center bg-background">
                {/* Status UI remains same */}
                <div className="max-w-md w-full p-8 rounded-2xl border border-border bg-card shadow-lg">
                    {kytStatus === 'approved' ? (
                        <div className="mb-6 flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-amber-600" />
                            </div>
                        </div>
                    )}
                    <h2 className="text-2xl font-display font-bold mb-4 text-foreground">
                        {kytStatus === 'approved' ? "Profile Verified!" : "Verification Pending"}
                    </h2>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        {kytStatus === 'approved'
                            ? "Great news! Your profile is verified. You can now access your dashboard."
                            : "Your profile is under review (24-48 hours)."}
                    </p>
                    <div className="space-y-4">
                        {kytStatus === 'approved' ? (
                            <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-[#2d1f14] font-bold text-lg rounded-xl" onClick={() => window.location.reload()}>
                                Enter Dashboard
                            </Button>
                        ) : (
                            <Button variant="outline" className="w-full h-12 rounded-xl" onClick={handleReturnHome}>
                                Return Home
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 lg:p-6">
            <div className="mb-6 relative">
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-display font-bold text-foreground">Complete Profile</h1>
                    <span className="text-xs font-medium px-2 py-1 bg-amber-50 rounded-md text-amber-700 border border-amber-200">
                        Step {currentStep} of 3
                    </span>
                </div>
                <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                </div>
                {kytStatus === 'rejected' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 shadow-sm text-sm"
                    >
                        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-red-900">Revision Requested</h4>
                            <p className="text-red-700 mt-1">{formData.rejectionReason}</p>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Step 1: Personal (Compact) */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                {/* Personal Details Row */}
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Avatar/Profile Photo Uploader */}
                                    <div className="flex flex-col items-center gap-2 md:w-32 shrink-0">
                                        <div className="relative group cursor-pointer">
                                            <div className={cn(
                                                "w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted/30 transition-all",
                                                formData.personal?.profileImage ? "border-amber-500 border-solid" : "border-muted-foreground/30 hover:border-amber-400"
                                            )}>
                                                {formData.personal?.profileImage ? (
                                                    <img src={formData.personal.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserIcon className="w-8 h-8 text-muted-foreground/50" />
                                                )}
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                                    <Upload className="w-6 h-6 text-white" />
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            {!formData.personal?.profileImage && (
                                                <span className="text-[10px] text-muted-foreground mt-1 text-center block">Upload Photo</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Fields */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 content-start">
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">Full Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.personal?.fullName || ''}
                                                onChange={(e) => updateField('personal', 'fullName', e.target.value)}
                                                className="h-9 text-sm"
                                                placeholder="Legal Name"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">Email Address</Label>
                                            <Input value={user?.email || ''} disabled className="h-9 bg-muted/50 text-sm cursor-not-allowed" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">Date of Birth <span className="text-red-500">*</span></Label>
                                            <DatePicker
                                                date={formData.personal?.dob ? new Date(formData.personal.dob) : undefined}
                                                onChange={(date) => updateField('personal', 'dob', date?.toISOString())}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs font-semibold">Mobile Number <span className="text-red-500">*</span></Label>
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Input
                                                        value={formData.personal?.phone || ''}
                                                        onChange={(e) => updateField('personal', 'phone', e.target.value)}
                                                        className={cn("h-9 text-sm", formData.personal?.isMobileVerified ? "border-green-500 bg-green-50/20 pr-8" : "")}
                                                        placeholder="10-digit number"
                                                        maxLength={10}
                                                        disabled={formData.personal?.isMobileVerified}
                                                    />
                                                    {formData.personal?.isMobileVerified && (
                                                        <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                                                    )}
                                                </div>
                                                {!formData.personal?.isMobileVerified && !showOtpInput && (
                                                    <Button
                                                        size="sm"
                                                        onClick={handleSendOtp}
                                                        className="h-9 px-4 shrink-0"
                                                        disabled={!formData.personal?.phone || formData.personal.phone.length !== 10}
                                                    >
                                                        Verify
                                                    </Button>
                                                )}
                                            </div>

                                            {/* OTP Input Refined */}
                                            <AnimatePresence>
                                                {showOtpInput && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="pt-2 flex items-center gap-2"
                                                    >
                                                        <Input
                                                            value={otp}
                                                            onChange={(e) => setOtp(e.target.value)}
                                                            placeholder="Enter OTP (111111)"
                                                            className="h-9 text-sm w-40 tracking-widest text-center"
                                                            maxLength={6}
                                                        />
                                                        <Button size="sm" onClick={handleVerifyOtp} className="h-9 bg-green-600 hover:bg-green-700 text-white">Confirm</Button>
                                                        <span className="text-xs text-muted-foreground ml-2">
                                                            Resend in {timer}s
                                                        </span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-border/50" />

                                {/* Address Section Compact */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                                        <div className="w-1 h-4 bg-amber-500 rounded-full" />
                                        Address Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="md:col-span-2 space-y-1">
                                            <Label className="text-xs">Shop Name <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.address?.shopName}
                                                onChange={(e) => updateField('address', 'shopName', e.target.value)}
                                                className="h-9 text-sm"
                                                placeholder="Business Name"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Pin Code <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Input
                                                    value={formData.address?.zip}
                                                    onChange={(e) => updateField('address', 'zip', e.target.value)}
                                                    maxLength={6}
                                                    className="h-9 text-sm"
                                                    placeholder="6 Digits"
                                                />
                                                {isFetchingZip && <Loader2 className="absolute right-2 top-2 w-4 h-4 animate-spin text-muted-foreground" />}
                                            </div>
                                        </div>
                                        <div className="md:col-span-3 space-y-1">
                                            <Label className="text-xs">Full Address <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.address?.shopAddress}
                                                onChange={(e) => updateField('address', 'shopAddress', e.target.value)}
                                                className="h-9 text-sm"
                                                placeholder="Shop No, Street, Landmark"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">City <span className="text-red-500">*</span></Label>
                                            <Input value={formData.address?.city} onChange={(e) => updateField('address', 'city', e.target.value)} className="h-9 text-sm" />
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <Label className="text-xs">State <span className="text-red-500">*</span></Label>
                                            <Input value={formData.address?.state} onChange={(e) => updateField('address', 'state', e.target.value)} className="h-9 text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Documents (Compact) */}
                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Aadhar Number <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.documents?.aadharNumber}
                                            onChange={(e) => updateField('documents', 'aadharNumber', e.target.value)}
                                            maxLength={12}
                                            className="h-9 text-sm"
                                            placeholder="12-digit number"
                                        />
                                    </div>
                                    <FileUploader
                                        label="Aadhar Card"
                                        value={formData.documents?.aadharImage || ''}
                                        onChange={(base64) => updateField('documents', 'aadharImage', base64)}
                                        onRemove={() => removeImage('documents', 'aadharImage')}
                                        icon={Upload}
                                        className="h-32"
                                        description="Front Side"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">PAN Number <span className="text-red-500">*</span></Label>
                                        <Input
                                            value={formData.documents?.panNumber}
                                            onChange={(e) => updateField('documents', 'panNumber', e.target.value)}
                                            maxLength={10}
                                            className="h-9 text-sm uppercase"
                                            placeholder="ABCDE1234F"
                                        />
                                    </div>
                                    <FileUploader
                                        label="PAN Card"
                                        value={formData.documents?.panImage || ''}
                                        onChange={(base64) => updateField('documents', 'panImage', base64)}
                                        onRemove={() => removeImage('documents', 'panImage')}
                                        icon={Upload}
                                        className="h-32"
                                        description="Clear photo"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <Label className="text-xs">GST Number (Optional)</Label>
                                    <Input
                                        value={formData.documents?.gstNumber}
                                        onChange={(e) => updateField('documents', 'gstNumber', e.target.value)}
                                        className="h-9 text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Bank Details (Compact) */}
                        {currentStep === 3 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs">Account Holder <span className="text-red-500">*</span></Label>
                                    <Input value={formData.bank?.holderName} onChange={(e) => updateField('bank', 'holderName', e.target.value)} className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Bank Name <span className="text-red-500">*</span></Label>
                                    <Input value={formData.bank?.bankName} onChange={(e) => updateField('bank', 'bankName', e.target.value)} className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Account Number <span className="text-red-500">*</span></Label>
                                    <Input type="password" value={formData.bank?.accountNumber} onChange={(e) => updateField('bank', 'accountNumber', e.target.value)} className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Confirm A/C Number <span className="text-red-500">*</span></Label>
                                    <Input value={formData.bank?.confirmAccountNumber} onChange={(e) => updateField('bank', 'confirmAccountNumber', e.target.value)} className="h-9 text-sm" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">IFSC Code <span className="text-red-500">*</span></Label>
                                    <Input value={formData.bank?.ifsc} onChange={(e) => updateField('bank', 'ifsc', e.target.value)} className="h-9 text-sm uppercase" />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        disabled={currentStep === 1 || isLoading}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveDraft}
                            disabled={isSaving || isLoading}
                            className="hidden sm:flex text-xs"
                        >
                            {isSaving ? "Saving..." : "Save Draft"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleNext}
                            disabled={isLoading || !isStepValid()}
                            className={cn(
                                "min-w-[100px] transition-all",
                                !isStepValid() ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700 text-white"
                            )}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : currentStep === 3 ? "Submit" : "Next"}
                            {!isLoading && currentStep !== 3 && <ArrowRight className="w-4 h-4 ml-1" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

}

