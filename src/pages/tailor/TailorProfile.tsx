import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function TailorProfile() {
  const [form, setForm] = useState({ name: "Master Tailor", email: "tailor@email.com", phone: "+91 98765 43210", specialty: "Blouses & Ethnic Wear", experience: "10", address: "123 Fashion Street, Mumbai" });
  const handleSave = () => toast.success("Profile updated successfully");
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8"><h1 className="text-2xl lg:text-3xl font-display font-bold">Profile Settings</h1><p className="text-muted-foreground mt-1">Manage your business profile</p></div>
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
            <div><Label>Experience (Years)</Label><Input type="number" value={form.experience} onChange={(e) => setForm({...form, experience: e.target.value})} /></div>
          </div>
          <div><Label>Specialty</Label><Input value={form.specialty} onChange={(e) => setForm({...form, specialty: e.target.value})} /></div>
          <div><Label>Address</Label><Textarea value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} /></div>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
