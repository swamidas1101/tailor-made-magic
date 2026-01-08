import { useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Design { id: number; name: string; category: string; price: number; priceWithMaterial: number; status: "pending" | "approved" | "rejected"; image: string; description: string; }

const initialDesigns: Design[] = [
  { id: 1, name: "Elegant Silk Blouse", category: "Blouse", price: 1200, priceWithMaterial: 2400, status: "approved", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", description: "Beautiful silk blouse with intricate embroidery." },
  { id: 2, name: "Designer Saree Blouse", category: "Blouse", price: 1500, priceWithMaterial: 2800, status: "pending", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400", description: "Premium designer saree blouse." },
];

export default function TailorDesigns() {
  const [designs, setDesigns] = useState<Design[]>(initialDesigns);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "", price: "", priceWithMaterial: "", description: "", image: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDesign: Design = { id: Date.now(), name: formData.name, category: formData.category, price: Number(formData.price), priceWithMaterial: Number(formData.priceWithMaterial), status: "pending", image: formData.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", description: formData.description };
    setDesigns([newDesign, ...designs]);
    setDialogOpen(false);
    setFormData({ name: "", category: "", price: "", priceWithMaterial: "", description: "", image: "" });
    toast.success("Design submitted for approval");
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl lg:text-3xl font-display font-bold">My Designs</h1><p className="text-muted-foreground mt-1">Manage your design portfolio</p></div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4 mr-2" />Add Design</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <Card key={design.id} className="overflow-hidden hover-lift">
            <div className="relative aspect-[4/3]">
              <img src={design.image} alt={design.name} className="w-full h-full object-cover" />
              <Badge className="absolute top-3 right-3" variant={design.status === "approved" ? "default" : design.status === "pending" ? "secondary" : "destructive"}>{design.status}</Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{design.name}</h3>
              <p className="text-sm text-muted-foreground">{design.category}</p>
              <div className="flex items-center justify-between mt-3">
                <div><p className="font-bold text-primary">₹{design.price.toLocaleString()}</p><p className="text-xs text-muted-foreground">₹{design.priceWithMaterial.toLocaleString()} with material</p></div>
                <div className="flex gap-1"><Button variant="ghost" size="icon"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="w-4 h-4" /></Button></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>Add New Design</DialogTitle><DialogDescription>Submit a new design for approval</DialogDescription></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Design Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
            <div><Label>Category</Label><Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem value="Blouse">Blouse</SelectItem><SelectItem value="Men's Wear">Men's Wear</SelectItem><SelectItem value="Ethnic Wear">Ethnic Wear</SelectItem><SelectItem value="Kids Wear">Kids Wear</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4"><div><Label>Price (Without Material)</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required /></div><div><Label>Price (With Material)</Label><Input type="number" value={formData.priceWithMaterial} onChange={(e) => setFormData({...formData, priceWithMaterial: e.target.value})} required /></div></div>
            <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
            <div><Label>Image URL</Label><Input value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." /></div>
            <Button type="submit" className="w-full">Submit for Approval</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
