import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import CartSidebar from "@/components/CartSidebar";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import SubcategoryPage from "./pages/SubcategoryPage";
import ProductPage from "./pages/ProductPage";
import ServicesPage from "./pages/ServicesPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartSidebar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categorie/:categorySlug" element={<CategoryPage />} />
            <Route path="/categorie/:categorySlug/:subcategorySlug" element={<SubcategoryPage />} />
            <Route path="/produit/:productId" element={<ProductPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/commande" element={<CheckoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
