import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Scissors, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/categories", label: "Categories", icon: LayoutGrid },
  { path: "/materials", label: "Materials", icon: Scissors },
  { path: "/wishlist", label: "Wishlist", icon: Heart },
  { path: "/account", label: "Account", icon: User },
];

export function BottomNav() {
  const location = useLocation();
  const { items: wishlistItems } = useWishlist();
  const { user } = useAuth();

  // Don't show on admin/tailor dashboards
  if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/tailor")) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg border-t border-border shadow-[0_-2px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const actualPath = item.path === "/account" ? (user ? "/account" : "/auth") : item.path;

          return (
            <Link
              key={item.path}
              to={actualPath}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 w-full h-full relative transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {/* Active indicator dot */}
              {active && (
                <span className="absolute top-1 w-1 h-1 rounded-full bg-primary" />
              )}
              <div className="relative">
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all",
                    active && "scale-110"
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
                {/* Wishlist badge */}
                {item.path === "/wishlist" && wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                    {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium leading-none mt-0.5",
                active && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area for phones with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
