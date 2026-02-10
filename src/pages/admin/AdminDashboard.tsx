import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  BarChart3,
  FileCheck,
  LogOut,
  Menu,
  Scissors,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { name: "Overview", path: "/admin", icon: LayoutDashboard },
  { name: "Tailor Management", path: "/admin/tailors", icon: Users },
  { name: "Design Moderation", path: "/admin/designs", icon: FileCheck },
  { name: "Categories", path: "/admin/categories", icon: Scissors },
  { name: "Filters", path: "/admin/filters", icon: Sparkles },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Database Seeder", path: "/admin/seeder", icon: Sparkles },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, activeRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen bg-[#FDFCFB] flex overflow-hidden font-body">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed left-0 top-0 bottom-0 bg-background text-foreground z-40 border-r border-border shadow-soft">
        <div className="p-8 border-b border-border/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-700" />
          <Link to="/" className="flex items-center gap-4 relative z-10 transition-transform hover:scale-[1.02]">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight text-[#1E1610]">Tailor Admin</h1>
              <p className="text-[10px] text-amber-600 uppercase tracking-[0.2em] font-bold leading-none mt-1">Sovereign Control</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2 overflow-y-auto custom-scrollbar">
          {adminNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative group",
                  active
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20"
                    : "text-muted-foreground hover:text-amber-600 hover:bg-amber-50/50"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                  active ? "text-white" : "text-inherit"
                )} />
                <span className={cn("tracking-tight text-sm", active ? "font-bold" : "font-semibold")}>{item.name}</span>
                {active && (
                  <Sparkles className="w-3 h-3 ml-auto text-white/60 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-lg font-bold text-white shadow-md">
                {user?.displayName?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-[#1E1610]">{user?.displayName || "Administrator"}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Core Admin</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50 h-10 px-3 rounded-xl gap-3 transition-colors group border border-transparent hover:border-red-100"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-bold text-xs uppercase tracking-wider">Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-6 h-16">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted rounded-xl">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 bg-background text-foreground border-r border-border shadow-2xl">
              <SheetHeader className="p-8 border-b border-border text-left">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <SheetTitle className="text-left font-display font-bold text-[#1E1610]">Tailor Admin</SheetTitle>
                    <SheetDescription className="text-xs text-amber-600 uppercase tracking-widest mt-0.5 font-bold text-left">Control Center</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <nav className="p-6 space-y-2">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-4 rounded-xl transition-all",
                      isActive(item.path)
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold shadow-md shadow-amber-500/20"
                        : "text-muted-foreground hover:text-amber-600 hover:bg-amber-50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="w-5 h-5" />
                      <span className="tracking-tight font-bold">{item.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                ))}
              </nav>

              <div className="p-6 mt-auto border-t border-border">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:bg-red-50 h-12 rounded-xl gap-4 font-bold uppercase tracking-wider text-xs"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="font-display font-bold text-[#1E1610] text-lg">System Oversight</h1>

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-sm font-black text-white shadow-lg">
                  {user?.displayName?.charAt(0) || "A"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <div className="px-3 py-3 border-b border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-base font-black text-white shadow-md">
                    {user?.displayName?.charAt(0) || "A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{user?.displayName || "Administrator"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Admin Access</span>
                </div>
              </div>
              <DropdownMenuItem
                onClick={handleLogout}
                className="mt-1 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer font-semibold"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Perspective */}
      <main className="flex-1 lg:ml-72 lg:pt-0 pt-16 overflow-auto custom-scrollbar">
        <div className="max-w-[1600px] mx-auto min-h-full pb-20">
          <Outlet />
        </div>
      </main>

      {/* PWA Install Prompt */}
      <InstallPrompt role="admin" />
    </div>
  );
}
