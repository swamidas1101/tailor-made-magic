import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import DesignDetail from "./pages/DesignDetail";
import Measurements from "./pages/Measurements";
import Uniforms from "./pages/Uniforms";
import MensTailoring from "./pages/MensTailoring";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
