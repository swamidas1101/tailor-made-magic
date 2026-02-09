import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  User as UserIcon,
  ShieldCheck,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function TailorProfile() {
  const { user, kytData, kytStatus: currentKytStatus } = useAuth();

  // Use KYT data if available, otherwise fallback to user data or defaults
  const profileData = {
    name: kytData?.personal?.fullName || user?.displayName || "Member",
    email: user?.email || "",
    phone: kytData?.personal?.phone || "Not provided",
    shopName: kytData?.address?.shopName || "My Design Studio",
    shopAddress: kytData?.address?.shopAddress || "",
    city: kytData?.address?.city || "",
    state: kytData?.address?.state || "",
    zip: kytData?.address?.zip || "",
    experience: kytData?.professional?.experienceYears || "0",
    specialty: kytData?.professional?.specialization || ["General Tailoring"],
    kytStatus: currentKytStatus || "verified"
  };

  const InfoItem = ({ icon: Icon, label, value, className }: { icon: any, label: string, value: string | string[], className?: string }) => (
    <div className={`flex items-start gap-4 ${className}`}>
      <div className="mt-1 w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
        <Icon className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        {Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {value.map((v, i) => (
              <Badge key={i} variant="secondary" className="bg-amber-50 text-amber-900 border-amber-200/50 hover:bg-amber-100 font-medium">
                {v}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm font-semibold text-foreground leading-tight">{value || "—"}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <Card className="border-border/50 shadow-soft overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center border border-amber-300/50">
                <Building2 className="w-10 h-10 text-amber-700" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-display font-bold text-foreground">{profileData.shopName}</h1>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <UserIcon className="w-4 h-4" /> {profileData.name}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="border-border/50 shadow-sm">
                <ExternalLink className="w-4 h-4 mr-2" /> Public Link
              </Button>
              <Button variant="outline" className="border-border/50 shadow-sm">
                <MessageSquare className="w-4 h-4 mr-2" /> Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Info Column */}
        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <InfoItem icon={Mail} label="Professional Email" value={profileData.email} />
            <InfoItem icon={Phone} label="Business Phone" value={profileData.phone} />
            <InfoItem icon={UserIcon} label="Primary Contact" value={profileData.name} />
          </CardContent>
        </Card>

        {/* Business Specialties Column */}
        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <InfoItem icon={Briefcase} label="Years Active" value={`${profileData.experience} Years of Experience`} />
            <InfoItem
              icon={Award}
              label="Signature Specialties"
              value={profileData.specialty}
            />
          </CardContent>
        </Card>

        {/* Location Column */}
        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Store Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <InfoItem icon={MapPin} label="Full Address" value={profileData.shopAddress} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">City / State</p>
                <p className="text-sm font-semibold">{profileData.city}, {profileData.state}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Postal Code</p>
                <p className="text-sm font-semibold">{profileData.zip}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Notice */}
      <div className="bg-muted/40 border border-border/50 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shrink-0 shadow-sm border">
          <ShieldCheck className="w-6 h-6 text-green-500" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="font-bold text-foreground">Verified Business Account</h4>
          <p className="text-xs text-muted-foreground">This profile is locked to maintain the integrity of our verified tailors network. Changes require a review from our compliance team.</p>
        </div>
        <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
          Request Information Update
        </Button>
      </div>
    </div>
  );
}
