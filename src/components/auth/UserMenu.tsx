import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, UserCircle, ShoppingBag, Heart, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!isAuthenticated) {
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
            <Link to="/user-login" className="w-full cursor-pointer">
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative flex items-center gap-2 px-2 sm:px-3" 
          aria-label="Account"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
            {user?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role} Account</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {user?.role === "admin" && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="w-full cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        {user?.role === "tailor" && (
          <DropdownMenuItem asChild>
            <Link to="/tailor" className="w-full cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Tailor Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
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
        
        <DropdownMenuSeparator />
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
