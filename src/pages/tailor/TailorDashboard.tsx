import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, ShoppingBag, User, IndianRupee, LogOut, Menu, Scissors, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const tailorNavItems = [
  { name: "Overview", path: "/tailor", icon: LayoutDashboard },
  { name: "My Designs", path: "/tailor/designs", icon: Upload },
  { name: "Orders", path: "/tailor/orders", icon: ShoppingBag },
  { name: "Earnings", path: "/tailor/earnings", icon: IndianRupee },
  { name: "Profile", path: "/tailor/profile", icon: User },
];

export default function TailorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path: string) => path === "/tailor" ? location.pathname === "/tailor" : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-0 bottom-0 bg-[#2d1f14] text-white z-40">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-[#2d1f14]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-white">Tailo</h1>
              <p className="text-xs text-white/60">Tailor Portal</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tailorNavItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? "bg-amber-500 text-[#2d1f14] font-semibold" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold text-[#2d1f14]">
              {user?.name?.charAt(0) || "T"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{user?.name}</p>
              <p className="text-xs text-white/60 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            className="w-full bg-red-600 hover:bg-red-700 text-white" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-[#2d1f14] text-white border-none">
              <SheetHeader className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-[#2d1f14]" />
                  </div>
                  <div>
                    <SheetTitle className="text-left font-display text-white">Tailo</SheetTitle>
                    <SheetDescription className="text-xs text-white/60">Tailor Portal</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <nav className="flex-1 p-4 space-y-1">
                {tailorNavItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setSidebarOpen(false)} 
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path) 
                        ? "bg-amber-500 text-[#2d1f14] font-semibold" 
                        : "text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-white/10">
                <Button 
                  variant="destructive" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white" 
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="font-display font-bold">Tailor Panel</h1>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">{user?.name?.charAt(0) || "T"}</div>
        </div>
      </div>
      <main className="flex-1 lg:ml-64 lg:pt-0 pt-14 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
