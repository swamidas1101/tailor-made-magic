import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { ScrollToTop } from "@/components/utils/ScrollToTop";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import DesignDetail from "./pages/DesignDetail";
import Measurements from "./pages/Measurements";
import Uniforms from "./pages/Uniforms";
import MensTailoring from "./pages/MensTailoring";
import Materials from "./pages/Materials";
import MaterialDetail from "./pages/MaterialDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import TailorManagement from "./pages/admin/TailorManagement";
import DesignModeration from "./pages/admin/DesignModeration";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import CategoryManagement from "./pages/admin/CategoryManagement";
import MeasurementManagement from "./pages/admin/MeasurementManagement";
import FilterManagement from "./pages/admin/FilterManagement";
import DatabaseSeeder from "./pages/admin/DatabaseSeeder";
import AdminPromos from "./pages/admin/AdminPromos";
import AdminSettings from "./pages/admin/AdminSettings";
import TailorDashboard from "./pages/tailor/TailorDashboard";
import TailorOverview from "./pages/tailor/TailorOverview";
import TailorDesigns from "./pages/tailor/TailorDesigns";
import TailorOrders from "./pages/tailor/TailorOrders";
import TailorEarnings from "./pages/tailor/TailorEarnings";
import TailorProfile from "./pages/tailor/TailorProfile";
import About from "./pages/support/About";
import Contact from "./pages/support/Contact";
import HelpCenter from "./pages/support/HelpCenter";
import Legal from "./pages/support/Legal";
import OurTailors from "./pages/content/OurTailors";
import Pricing from "./pages/content/Pricing";
import HowItWorks from "./pages/content/HowItWorks";
import MeasurementGuide from "./pages/content/MeasurementGuide";
import NotFound from "./pages/NotFound";
import Seeder from "./pages/Seeder";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import AddressManagement from "./pages/customer/AddressManagement";
import CustomerOrders from "./pages/customer/CustomerOrders";

const queryClient = new QueryClient();

function AppContent() {
  // Check for new versions periodically
  useVersionCheck();

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:id" element={<Categories />} />
          <Route path="/design/:id" element={<DesignDetail />} />
          <Route path="/measurements" element={<Measurements />} />
          <Route path="/uniforms" element={<Uniforms />} />
          <Route path="/mens" element={<MensTailoring />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/material/:id" element={<MaterialDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          {/* Unified Auth Route */}
          <Route path="/auth" element={<Auth />} />
          {/* Legacy Routes - Redirect to unified auth */}
          <Route path="/user-login" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/business-signup" element={<Auth />} />
          <Route path="/auth/customer" element={<Auth />} />
          <Route path="/auth/business/login" element={<Auth />} />
          <Route path="/auth/business/signup" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<HelpCenter />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy" element={<Legal />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="/tailors" element={<OurTailors />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/measurements/guide" element={<MeasurementGuide />} />
          <Route path="/seed" element={<Seeder />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account/addresses" element={
            <ProtectedRoute allowedRoles={['customer', 'tailor', 'admin']}>
              <AddressManagement />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['customer', 'tailor', 'admin']}>
              <CustomerOrders />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="tailors" element={<TailorManagement />} />
            <Route path="designs" element={<DesignModeration />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="measurements" element={<MeasurementManagement />} />
            <Route path="filters" element={<FilterManagement />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="promos" element={<AdminPromos />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="seeder" element={<DatabaseSeeder />} />
          </Route>
          <Route path="/tailor" element={
            <ProtectedRoute allowedRoles={['tailor']}>
              <TailorDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<TailorOverview />} />
            <Route path="designs" element={<TailorDesigns />} />
            <Route path="orders" element={<TailorOrders />} />
            <Route path="earnings" element={<TailorEarnings />} />
            <Route path="profile" element={<TailorProfile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
