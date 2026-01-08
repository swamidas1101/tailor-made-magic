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
  X,
  Scissors,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

const adminNavItems = [
  { name: "Overview", path: "/admin", icon: LayoutDashboard },
  { name: "Tailor Management", path: "/admin/tailors", icon: Users },
  { name: "Design Moderation", path: "/admin/designs", icon: FileCheck },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar text-sidebar-foreground">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <Scissors className="w-5 h-5 text-sidebar-accent-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">StitchCraft</h1>
              <p className="text-xs text-sidebar-foreground/70">Admin Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/20"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-bold text-sidebar-accent-foreground">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/20"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-sidebar text-sidebar-foreground">
              <SheetHeader className="p-4 border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-sidebar-accent-foreground" />
                  </div>
                  <div>
                    <SheetTitle className="text-left font-display text-sidebar-foreground">StitchCraft</SheetTitle>
                    <SheetDescription className="text-xs">Admin Portal</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <nav className="flex-1 p-4 space-y-1">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/20"
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

              <div className="p-4 border-t border-sidebar-border">
                <Button 
                  variant="outline" 
                  className="w-full border-sidebar-border text-sidebar-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="font-display font-bold">Admin Panel</h1>
          
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            {user?.name?.charAt(0) || "A"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:pt-0 pt-14 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
