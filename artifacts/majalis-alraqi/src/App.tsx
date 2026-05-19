import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import NotFound from "@/pages/not-found";
import { setAuthTokenGetter } from "@workspace/api-client-react";

// Wire admin JWT token into every API call automatically
setAuthTokenGetter(() => localStorage.getItem("admin_token"));

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Wishlist from "@/pages/Wishlist";
import FAQ from "@/pages/FAQ";
import Returns from "@/pages/Returns";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";
import AdminCategories from "@/pages/admin/Categories";
import AdminHomepage from "@/pages/admin/Homepage";
import AdminMessages from "@/pages/admin/Messages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const isAdminPath = (path: string) => path.startsWith("/admin");

function Router() {
  return (
    <Switch>
      {/* Admin routes — no navbar/footer */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/homepage" component={AdminHomepage} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/admin" component={AdminDashboard} />

      {/* Public routes — with navbar/footer */}
      <Route>
        {() => (
          <div className="flex flex-col min-h-screen" dir="rtl">
            <Navbar />
            <main className="flex-grow">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/products" component={Products} />
                <Route path="/products/:id" component={ProductDetail} />
                <Route path="/cart" component={Cart} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/order-success/:id" component={OrderSuccess} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/wishlist" component={Wishlist} />
                <Route path="/faq" component={FAQ} />
                <Route path="/returns" component={Returns} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
            <WhatsAppButton />
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
