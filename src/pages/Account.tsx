import { useNavigate, Link } from "react-router-dom";
import { LogOut, User, Mail, Phone, Shield, ChevronRight, ShoppingBag, Heart, Settings, Repeat, Users, Package, Ruler, ArrowLeft, Headphones, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Account() {
  const { user, userRoles, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSwitchRole = async (role: string) => {
    await switchRole(role as any);
    toast.success(`Switched to ${role} profile`);
    if (role === 'admin') navigate('/admin');
    else if (role === 'tailor') navigate('/tailor');
    else navigate('/');
  };

  // If not logged in, redirect to auth
  if (!user) {
    navigate("/auth");
    return null;
  }

  const availableRoles = userRoles?.filter(r => r !== activeRole) || [];
  const initials = user.displayName
    ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-lg relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-6 md:left-0 md:-ml-12"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <Avatar className="w-20 h-20 mb-4 ring-4 ring-primary/10">
            <AvatarImage src={user.photoURL || undefined} />
            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-orange-500 to-amber-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-display font-bold">{user.displayName || "User"}</h1>
          <p className="text-sm text-muted-foreground">{user.email || user.phoneNumber}</p>
          <span className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
            {activeRole} Account
          </span>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {/* Dashboard Link */}
          {activeRole === 'tailor' && (
            <Link to="/tailor" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-orange-600" />
                </div>
                <span className="font-medium">Tailor Dashboard</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          )}

          {activeRole === 'admin' && (
            <Link to="/admin" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-medium">Admin Dashboard</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          )}

          {activeRole === 'customer' && (
            <>
              <Link to="/wishlist" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-rose-600" />
                  </div>
                  <span className="font-medium">My Wishlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link to="/cart" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium">My Cart</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link to="/orders" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-medium">My Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link to="/account/addresses" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="font-medium">Manage Addresses</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link to="/measurements" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-yellow-600" />
                  </div>
                  <span className="font-medium">Measurements</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>


              <Link to="/support" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="font-medium">Help & Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </>
          )}

          {/* Switch Role */}
          {availableRoles.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1 mb-2">Switch Profile</p>
              {availableRoles.map(role => (
                <button
                  key={role}
                  onClick={() => handleSwitchRole(role)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors mb-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Repeat className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium capitalize">{role} Profile</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}

          {/* Manage Profiles */}
          <Link to="/auth" className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="font-medium">Manage Profiles</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          {/* Logout */}
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
              size="lg"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
