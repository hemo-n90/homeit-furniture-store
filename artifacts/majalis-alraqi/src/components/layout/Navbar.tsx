import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/products", label: "المنتجات" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isHome = location === "/";
  const isTransparent = isHome && !isScrolled && !mobileMenuOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent"
            : "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
        }`}
        dir="rtl"
      >
        <div className="container mx-auto px-4 h-18 sm:h-20 flex items-center justify-between gap-4 py-4">
          {/* Logo */}
          <Link href="/" className="text-xl sm:text-2xl font-black text-primary tracking-tight shrink-0">
            مجالس الراقي
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors hover:text-primary relative py-1 ${
                  location === href
                    ? "text-primary font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded"
                    : isTransparent ? "text-white/90" : "text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/wishlist"
              className={`transition-colors hover:text-primary ${isTransparent ? "text-white/90" : "text-foreground"}`}
              title="المفضلة"
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/cart"
              className={`relative transition-colors hover:text-primary ${isTransparent ? "text-white/90" : "text-foreground"}`}
              title="السلة"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className={`lg:hidden transition-colors hover:text-primary ${isTransparent ? "text-white/90" : "text-foreground"}`}
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-card shadow-2xl flex flex-col lg:hidden"
              dir="rtl"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="text-xl font-black text-primary">مجالس الراقي</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                      location === href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                <div className="border-t border-border pt-3 mt-3 space-y-1">
                  <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-foreground hover:bg-muted transition-all">
                    <Heart size={18} className="text-primary" />
                    المفضلة
                  </Link>
                  <Link href="/cart" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-foreground hover:bg-muted transition-all">
                    <ShoppingBag size={18} className="text-primary" />
                    السلة
                    {itemCount > 0 && (
                      <span className="mr-auto bg-primary text-primary-foreground text-xs font-black px-2 py-0.5 rounded-full">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>

              <div className="p-4 border-t border-border">
                <Link
                  href="/faq"
                  className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                >
                  الأسئلة الشائعة
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't hide behind fixed navbar */}
      <div className="h-18 sm:h-20" />
    </>
  );
}
