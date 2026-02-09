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

    // Initial State derived from KYT Data
    const [formData, setFormData] = useState<KYTData>({
        currentStep: 1,
        personal: { fullName: user?.displayName || '', phone: user?.phoneNumber || '', profileImage: '' },
        address: { shopName: '', shopAddress: '', city: '', state: '', zip: '' },
        professional: { experienceYears: '', specialization: [] },
        documents: { aadharNumber: '', panNumber: '', gstNumber: '', aadharImage: '', panImage: '' },
        bank: { accountNumber: '', confirmAccountNumber: '', ifsc: '', holderName: '', bankName: '' }
    });

    useEffect(() => {
        if (kytData) {
            setFormData(prev => ({ ...prev, ...kytData }));
            if (kytData.currentStep) {
                // Adjust currentStep if it was saved as 4 in the old 4-step system
                setCurrentStep(Math.min(kytData.currentStep, 3));
            }
        }
    }, [kytData]);

    // Zip Code Automation
    useEffect(() => {
        const fetchZipDetails = async (pin: string) => {
            // Optimization: Don't fetch if already submitted or approved
            if (kytStatus === 'submitted' || kytStatus === 'approved') return;
            if (pin.length !== 6 || !/^\d{6}$/.test(pin)) return;

            setIsFetchingZip(true);
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
                const data = await response.json();

                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    const city = postOffice.District;
                    const state = postOffice.State;

                    setFormData(prev => ({
                        ...prev,
                        address: {
                            ...prev.address!,
                            city,
                            state
                        }
                    }));
                    toast.success(`Location found: ${city}, ${state}`);
                } else {
                    toast.error("Invalid Pin Code or no data found.");
                }
            } catch (error) {
                console.error("Zip Fetch Error:", error);
                toast.error("Failed to fetch location details.");
            } finally {
                setIsFetchingZip(false);
            }
        };

        const pin = formData.address?.zip;
        if (pin && pin.length === 6) {
            fetchZipDetails(pin);
        }
    }, [formData.address?.zip]);

    const validateStep = () => {
        if (currentStep === 1) {
            if (!formData.address?.shopAddress || !formData.address?.city || !formData.address?.state || !formData.address?.zip) {
                toast.error("Please fill in all address details.");
                return false;
            }
            if (!/^\d{6}$/.test(formData.address.zip)) {
                toast.error("Please enter a valid 6-digit Zip Code.");
                return false;
            }
            if (!formData.personal?.profileImage) {
                toast.error("Please upload a passport size photo.");
                return false;
            }
        } else if (currentStep === 2) {
            if (!formData.documents?.aadharNumber || !formData.documents?.panNumber) {
                toast.error("Aadhar and PAN numbers are required.");
                return false;
            }
            if (!/^\d{12}$/.test(formData.documents.aadharNumber)) {
                toast.error("Aadhar Number must be exactly 12 digits.");
                return false;
            }
            if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.documents.panNumber)) {
                toast.error("Invalid PAN Number format (e.g., ABCDE1234F).");
                return false;
            }
            if (!formData.documents?.aadharImage || !formData.documents?.panImage) {
                toast.error("Please upload images for both Aadhar and PAN cards.");
                return false;
            }
        } else if (currentStep === 3) {
            if (!formData.bank?.holderName || !formData.bank?.bankName || !formData.bank?.accountNumber || !formData.bank?.ifsc) {
                toast.error("Please fill in all bank details.");
                return false;
            }
            if (!/^\d{9,18}$/.test(formData.bank.accountNumber)) {
                toast.error("Account Number should be between 9 and 18 digits.");
                return false;
            }
            if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bank.ifsc)) {
                toast.error("Invalid IFSC Code format (e.g., HDFC0001234).");
                return false;
            }
            if (formData.bank.accountNumber !== formData.bank.confirmAccountNumber) {
                toast.error("Account Numbers do not match.");
                return false;
            }
        }
        return true;
    };

    const handleNext = async () => {
        if (!validateStep()) return;

        setIsLoading(true);
        try {
            if (currentStep < 3) {
                await updateKYTData({ ...formData, currentStep: currentStep + 1 });
                setCurrentStep(prev => prev + 1);
            } else {
                // Submit logic
                await updateKYTData(formData, 'submitted');
                toast.success("Profile submitted for verification!");
            }
        } catch (error: any) {
            console.error("KYT Error:", error);
            toast.error(error.message || "Something went wrong. Please try again.");
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
            console.error("Save Error:", error);
            toast.error("Failed to save progress.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (section: 'personal' | 'documents', field: string, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            updateField(section, field, base64String);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (section: 'personal' | 'documents', field: string) => {
        updateField(section, field, '');
    };

    const updateField = (section: keyof KYTData, field: string, value: any) => {
        let finalValue = value;

        // Auto uppercase for PAN
        if (section === 'documents' && field === 'panNumber') {
            finalValue = value.toUpperCase();
        }

        // Numeric restriction for specific fields
        const numericFields = ['zip', 'aadharNumber', 'accountNumber', 'confirmAccountNumber'];
        if (numericFields.includes(field)) {
            finalValue = value.replace(/\D/g, '');
        }

        // Character limits
        if (field === 'zip') finalValue = finalValue.slice(0, 6);
        if (field === 'aadharNumber') finalValue = finalValue.slice(0, 12);
        if (field === 'panNumber') finalValue = finalValue.slice(0, 10);

        setFormData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as any),
                [field]: finalValue
            }
        }));
    };

    const handleReturnHome = async () => {
        try {
            await logout();
            navigate('/', { replace: true });
        } catch (error) {
            console.error("Logout Error:", error);
            window.location.href = '/';
        }
    };

    if (kytStatus === 'submitted' || kytStatus === 'approved') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center bg-background">
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
                            ? "Great news! Your profile has been verified. You now have full access to your tailor dashboard and can start managing orders."
                            : "Your profile has been successfully submitted and is now under review by our administration team. This process typically takes 24-48 business hours."}
                    </p>

                    <div className="space-y-4">
                        {kytStatus === 'submitted' && (
                            <div className="p-4 rounded-lg bg-muted/50 border border-border text-left">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">What happens next?</p>
                                        <p className="text-xs text-muted-foreground mt-1">We will notify you via email once your verification is complete. Until then, your access to certain features will be limited.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {kytStatus === 'approved' ? (
                            <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-[#2d1f14] font-bold text-lg rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]" onClick={() => window.location.reload()}>
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
        <div className="max-w-4xl mx-auto p-4 lg:p-8">
            <div className="mb-8 relative">
                <h1 className="text-3xl font-display font-bold text-foreground">Complete Your Profile</h1>
                <p className="text-muted-foreground">We need a few details to verify your identity and business.</p>

                {/* Rejection Banner */}
                {kytStatus === 'rejected' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-4 shadow-sm"
                    >
                        <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-red-900">Revision Requested</h4>
                            <p className="text-sm text-red-700 mt-1">
                                {formData.rejectionReason || "Admin has requested some changes to your profile. Please review the details and re-submit."}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Stepper */}
            <div className="relative flex items-center justify-between mb-12 px-2 overflow-x-auto pb-4 lg:pb-0">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 hidden lg:block" />
                {steps.map((s, i) => {
                    const isActive = s.id === currentStep;
                    const isCompleted = s.id < currentStep;
                    return (
                        <div key={s.id} className="flex flex-col items-center min-w-[80px]">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background transition-colors duration-300
                                ${isActive ? 'border-primary text-primary shadow-[0_0_15px_rgba(234,179,8,0.3)]' : isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'}
                            `}>
                                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                            </div>
                            <span className={`text-xs font-medium mt-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{s.name}</span>
                        </div>
                    );
                })}
            </div>

            <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-sm">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Step 1: Personal & Address Info */}
                        {currentStep === 1 && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <div className="w-1 h-6 bg-primary rounded-full" />
                                        Personal Information
                                    </h3>
                                    <div className="grid grid-cols-12 gap-6 items-stretch">
                                        {/* Personal Info - Left 8 cols */}
                                        <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Full Name</Label>
                                                <Input
                                                    value={formData.personal?.fullName || user?.displayName || ''}
                                                    onChange={(e) => updateField('personal', 'fullName', e.target.value)}
                                                    className="h-9 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Phone Number</Label>
                                                <Input
                                                    value={formData.personal?.phone || user?.phoneNumber || ''}
                                                    onChange={(e) => updateField('personal', 'phone', e.target.value)}
                                                    className="h-9 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1 md:col-span-2">
                                                <Label className="text-xs">Email Address</Label>
                                                <Input value={user?.email || ''} disabled className="h-9 bg-muted/50 text-sm" />
                                            </div>
                                        </div>

                                        {/* Photo - Right 4 cols */}
                                        <div className="col-span-12 md:col-span-4">
                                            <FileUploader
                                                label="Passport Photo"
                                                value={formData.personal?.profileImage || ''}
                                                onChange={(base64) => updateField('personal', 'profileImage', base64)}
                                                onRemove={() => removeImage('personal', 'profileImage')}
                                                icon={UserIcon}
                                                aspectRatio="aspect-square"
                                                description="Face clearly visible."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4 border-t">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <div className="w-1 h-6 bg-primary rounded-full" />
                                        Shop / Business Address
                                    </h3>
                                    <div className="grid grid-cols-12 gap-3 sm:gap-4">
                                        <div className="col-span-12 space-y-1">
                                            <Label className="text-xs">Shop Name</Label>
                                            <Input
                                                placeholder="e.g. Royal Tailors"
                                                value={formData.address?.shopName}
                                                onChange={(e) => updateField('address', 'shopName', e.target.value)}
                                                className="h-9 text-sm"
                                            />
                                        </div>

                                        {/* Shop Address - Full Width */}
                                        <div className="col-span-12 space-y-1">
                                            <Label className="text-xs">Detailed Shop Address</Label>
                                            <Textarea
                                                placeholder="Shop No, Building Name, Street, Landmark..."
                                                value={formData.address?.shopAddress}
                                                onChange={(e) => updateField('address', 'shopAddress', e.target.value)}
                                                className="min-h-[60px] text-sm resize-none"
                                            />
                                        </div>

                                        {/* Pin Code, City, State - Compact Row */}
                                        <div className="col-span-12 md:col-span-4 space-y-1">
                                            <Label className="text-xs">Pin Code</Label>
                                            <div className="relative">
                                                <Input
                                                    value={formData.address?.zip}
                                                    onChange={(e) => updateField('address', 'zip', e.target.value)}
                                                    inputMode="numeric"
                                                    placeholder="6 Digit PIN"
                                                    maxLength={6}
                                                    className={cn("h-9 text-sm pr-8", isFetchingZip ? "pr-8" : "")}
                                                />
                                                {isFetchingZip && (
                                                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                        <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-12 md:col-span-4 space-y-1">
                                            <Label className="text-xs">City</Label>
                                            <Input
                                                placeholder="City"
                                                value={formData.address?.city}
                                                onChange={(e) => updateField('address', 'city', e.target.value)}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="col-span-12 md:col-span-4 space-y-1">
                                            <Label className="text-xs">State</Label>
                                            <Input
                                                placeholder="State"
                                                value={formData.address?.state}
                                                onChange={(e) => updateField('address', 'state', e.target.value)}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Documents */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Aadhar Number</Label>
                                        <Input
                                            placeholder="12 Digit Aadhar"
                                            value={formData.documents?.aadharNumber}
                                            onChange={(e) => updateField('documents', 'aadharNumber', e.target.value)}
                                            inputMode="numeric"
                                            maxLength={12}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>PAN Number</Label>
                                        <Input
                                            placeholder="ABCDE1234F"
                                            value={formData.documents?.panNumber}
                                            onChange={(e) => updateField('documents', 'panNumber', e.target.value)}
                                            maxLength={10}
                                            className="uppercase"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label>GST Number (Optional)</Label>
                                        <Input
                                            placeholder="22AAAAA0000A1Z5"
                                            value={formData.documents?.gstNumber}
                                            onChange={(e) => updateField('documents', 'gstNumber', e.target.value)}
                                        />
                                    </div>

                                    {/* Aadhar & PAN Side by Side */}
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                        <FileUploader
                                            label="Aadhar Card Front"
                                            value={formData.documents?.aadharImage || ''}
                                            onChange={(base64) => updateField('documents', 'aadharImage', base64)}
                                            onRemove={() => removeImage('documents', 'aadharImage')}
                                            icon={Upload}
                                            description="Upload a clear image of your Aadhar card front side."
                                        />
                                        <FileUploader
                                            label="PAN Card Image"
                                            value={formData.documents?.panImage || ''}
                                            onChange={(base64) => updateField('documents', 'panImage', base64)}
                                            onRemove={() => removeImage('documents', 'panImage')}
                                            icon={Upload}
                                            description="Upload a clear image of your PAN card."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Bank Details */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Account Holder Name</Label>
                                        <Input
                                            placeholder="Name as per bank records"
                                            value={formData.bank?.holderName}
                                            onChange={(e) => updateField('bank', 'holderName', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bank Name</Label>
                                        <Input
                                            placeholder="e.g. HDFC Bank"
                                            value={formData.bank?.bankName}
                                            onChange={(e) => updateField('bank', 'bankName', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Account Number</Label>
                                        <Input
                                            type="password"
                                            placeholder="Enter account number"
                                            value={formData.bank?.accountNumber}
                                            onChange={(e) => updateField('bank', 'accountNumber', e.target.value)}
                                            inputMode="numeric"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm Account Number</Label>
                                        <Input
                                            type="text"
                                            placeholder="Re-enter account number"
                                            value={formData.bank?.confirmAccountNumber || ''}
                                            onChange={(e) => updateField('bank', 'confirmAccountNumber', e.target.value)}
                                            inputMode="numeric"
                                            onPaste={(e) => e.preventDefault()} // Prevent pasting
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>IFSC Code</Label>
                                        <Input
                                            placeholder="HDFC0001234"
                                            value={formData.bank?.ifsc}
                                            onChange={(e) => updateField('bank', 'ifsc', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-8 pt-6 border-t border-border gap-4">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1 || isLoading}
                        className="w-full sm:w-auto gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <Button
                            variant="ghost"
                            onClick={handleSaveDraft}
                            disabled={isSaving || isLoading}
                            className="w-full sm:w-auto"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Draft
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={isLoading}
                            className="w-full sm:w-auto min-w-[120px]"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : currentStep === 3 ? "Submit Verification" : "Next Step"}
                            {!isLoading && currentStep !== 3 && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

