import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, UserCircle, ShoppingBag, Heart, Settings, Users, Repeat, Ruler, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function UserMenu() {
  const { user, userRoles, activeRole, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSwitchRole = async (role: UserRole) => {
    await switchRole(role);
    toast.success(`Switched to ${role} profile`);
    // Redirect to appropriate dashboard
    if (role === 'admin') navigate('/admin');
    else if (role === 'tailor') navigate('/tailor');
    else navigate('/');
  };

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Account">
            <User className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/auth" className="w-full cursor-pointer">
              <UserCircle className="w-4 h-4 mr-2" />
              Sign In / Sign Up
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/wishlist" className="w-full cursor-pointer">
              <Heart className="w-4 h-4 mr-2" />
              My Wishlist
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/cart" className="w-full cursor-pointer">
              <ShoppingBag className="w-4 h-4 mr-2" />
              My Cart
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Filter accessible roles that are NOT the current one
  const availableRoles = userRoles?.filter(role => role !== activeRole) || [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex items-center gap-2 px-2 sm:px-3"
          aria-label="Account"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeRole === 'tailor' ? 'bg-orange-500/10' : activeRole === 'admin' ? 'bg-purple-500/10' : 'bg-blue-500/10'
            }`}>
            <User className={`w-4 h-4 ${activeRole === 'tailor' ? 'text-orange-600' : activeRole === 'admin' ? 'text-purple-600' : 'text-blue-600'
              }`} />
          </div>
          <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">
            {user?.displayName || "User"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
              {activeRole} Profile
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Role Specific Dashboard Link */}
        {activeRole === "admin" && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="w-full cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        {activeRole === "tailor" && (
          <DropdownMenuItem asChild>
            <Link to="/tailor" className="w-full cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Tailor Dashboard
            </Link>
          </DropdownMenuItem>
        )}

        {/* Role Switcher Submenu */}
        {availableRoles.length > 0 && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Repeat className="w-4 h-4 mr-2" />
              Switch Profile
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {availableRoles.map(role => (
                <DropdownMenuItem key={role} onClick={() => handleSwitchRole(role)}>
                  <span className="capitalize">{role}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}

        {/* Link to Manage Roles / Profile */}
        <DropdownMenuItem asChild>
          <Link to="/auth" className="w-full cursor-pointer">
            <Users className="w-4 h-4 mr-2" />
            Manage Profiles
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {activeRole === 'customer' && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/wishlist" className="w-full cursor-pointer">
                <Heart className="w-4 h-4 mr-2" />
                My Wishlist
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/cart" className="w-full cursor-pointer">
                <ShoppingBag className="w-4 h-4 mr-2" />
                My Cart
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/orders" className="w-full cursor-pointer">
                <Package className="w-4 h-4 mr-2" />
                My Orders
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/measurements" className="w-full cursor-pointer">
                <Ruler className="w-4 h-4 mr-2" />
                Measurements
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
