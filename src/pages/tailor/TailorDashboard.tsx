import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, ShoppingBag, User, IndianRupee, LogOut, Menu, Scissors, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "@/components/auth/UserMenu";

const tailorNavItems = [
  { name: "Overview", path: "/tailor", icon: LayoutDashboard },
  { name: "My Designs", path: "/tailor/designs", icon: Upload },
  { name: "Orders", path: "/tailor/orders", icon: ShoppingBag },
  { name: "Earnings", path: "/tailor/earnings", icon: IndianRupee },
  { name: "Profile", path: "/tailor/profile", icon: User },
];

import TailorKYT from "./TailorKYT";

export default function TailorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, kytStatus, activeRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path: string) => path === "/tailor" ? location.pathname === "/tailor" : location.pathname.startsWith(path);

  // If KYT is not approved, show restricted view
  const isKYTApproved = kytStatus === 'approved';
  const isKYTComplete = kytStatus === 'submitted' || kytStatus === 'approved';

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-0 bottom-0 bg-background border-r border-border shadow-lg z-40">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground">Tailo</h1>
              <p className="text-xs text-muted-foreground">Tailor Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {isKYTApproved ? (
            tailorNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(item.path)
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-md"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))
          ) : (
            <div className="px-4 py-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700 font-medium mb-1">Verification Pending</p>
              <p className="text-xs text-amber-600">Complete your profile to access the dashboard.</p>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {user?.displayName?.charAt(0) || "T"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{user?.displayName}</p>
              <p className="text-xs text-muted-foreground capitalize">{activeRole}</p>
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

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button></SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-background border-r">
              <SheetHeader className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
                    <Scissors className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-left font-display text-foreground">Tailo</SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground">Tailor Portal</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <nav className="flex-1 p-4 space-y-1">
                {isKYTApproved ? (
                  tailorNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-md"
                        : "text-foreground/70 hover:bg-muted"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-700 font-medium mb-1">Verification Pending</p>
                    <p className="text-xs text-amber-600">Complete your profile to access all features.</p>
                  </div>
                )}
              </nav>
              <div className="p-4 border-t border-border">
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
          <UserMenu />
        </div>
      </div>
      <main className="flex-1 lg:ml-64 lg:pt-0 pt-14 overflow-auto pb-20 sm:pb-0">
        {isKYTApproved ? <Outlet /> : <TailorKYT />}
      </main>

      {/* Mobile FAB - Persistent Quick Action */}
      {isKYTApproved && (
        <Button
          onClick={() => navigate("/tailor/designs")}
          className="lg:hidden fixed right-4 bottom-20 z-40 w-14 h-14 rounded-full bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-900/40 flex items-center justify-center p-0 transition-transform active:scale-90"
        >
          <Plus className="w-7 h-7 text-white" />
        </Button>
      )}
    </div>
  );
}

