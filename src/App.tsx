import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import DesignDetail from "./pages/DesignDetail";
import Measurements from "./pages/Measurements";
import Uniforms from "./pages/Uniforms";
import MensTailoring from "./pages/MensTailoring";
import Materials from "./pages/Materials";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import UserLogin from "./pages/UserLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import TailorManagement from "./pages/admin/TailorManagement";
import DesignModeration from "./pages/admin/DesignModeration";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import TailorDashboard from "./pages/tailor/TailorDashboard";
import TailorOverview from "./pages/tailor/TailorOverview";
import TailorDesigns from "./pages/tailor/TailorDesigns";
import TailorOrders from "./pages/tailor/TailorOrders";
import TailorEarnings from "./pages/tailor/TailorEarnings";
import TailorProfile from "./pages/tailor/TailorProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:id" element={<Categories />} />
                <Route path="/design/:id" element={<DesignDetail />} />
                <Route path="/measurements" element={<Measurements />} />
                <Route path="/uniforms" element={<Uniforms />} />
                <Route path="/mens" element={<MensTailoring />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/user-login" element={<UserLogin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="tailors" element={<TailorManagement />} />
                  <Route path="designs" element={<DesignModeration />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                </Route>
                <Route path="/tailor" element={<TailorDashboard />}>
                  <Route index element={<TailorOverview />} />
                  <Route path="designs" element={<TailorDesigns />} />
                  <Route path="orders" element={<TailorOrders />} />
                  <Route path="earnings" element={<TailorEarnings />} />
                  <Route path="profile" element={<TailorProfile />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
