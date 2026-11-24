import { Link, useLocation } from "wouter";
import { ShoppingBag, Heart, Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useGetHomepageSettings } from "@workspace/api-client-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const [location] = useLocation();
  const { t, lang, dir, toggleLang } = useLanguage();
  const { data: settings } = useGetHomepageSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  const isHome = location === "/";
  const isTransparent = isHome && !isScrolled && !mobileMenuOpen;

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/products", label: t.nav.products },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  const logoUrl = settings?.logoUrl;
  const storeName = lang === "ar" ? t.storeName : t.storeNameLatin;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent"
            : "bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
        }`}
        dir={dir}
      >
        <div className="container mx-auto px-4 h-18 sm:h-20 flex items-center justify-between gap-4 py-4">
          {/* Logo + Store Name */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={storeName}
                className="h-10 w-auto object-contain rounded-lg"
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-primary-foreground font-black text-lg leading-none">H</span>
              </div>
            )}
            <span className={`text-lg sm:text-xl font-black tracking-tight transition-colors ${isTransparent ? "text-white" : "text-primary"}`}>
              {storeName}
            </span>
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-bold border px-3 py-1.5 rounded-full transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary ${
                isTransparent
                  ? "border-white/40 text-white/90"
                  : "border-border text-foreground"
              }`}
              title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
            >
              <Globe size={13} />
              {t.switchLang}
            </button>

            <Link
              href="/wishlist"
              className={`transition-colors hover:text-primary ${isTransparent ? "text-white/90" : "text-foreground"}`}
              title={t.nav.wishlist}
            >
              <Heart size={20} />
            </Link>
            <Link
              href="/cart"
              className={`relative transition-colors hover:text-primary ${isTransparent ? "text-white/90" : "text-foreground"}`}
              title={t.nav.cart}
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
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
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
              initial={dir === "rtl" ? { x: "100%" } : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={dir === "rtl" ? { x: "100%" } : { x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className={`fixed top-0 ${dir === "rtl" ? "right-0" : "left-0"} bottom-0 z-50 w-72 bg-card shadow-2xl flex flex-col lg:hidden`}
              dir={dir}
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  {logoUrl ? (
                    <img src={logoUrl} alt={storeName} className="h-8 w-auto object-contain rounded-lg" />
                  ) : (
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-black text-base leading-none">H</span>
                    </div>
                  )}
                  <span className="text-lg font-black text-primary">{storeName}</span>
                </div>
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
                      location === href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                <div className="border-t border-border pt-3 mt-3 space-y-1">
                  <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-foreground hover:bg-muted transition-all">
                    <Heart size={18} className="text-primary" />
                    {t.nav.wishlist}
                  </Link>
                  <Link href="/cart" className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-foreground hover:bg-muted transition-all">
                    <ShoppingBag size={18} className="text-primary" />
                    {t.nav.cart}
                    {itemCount > 0 && (
                      <span className="ms-auto bg-primary text-primary-foreground text-xs font-black px-2 py-0.5 rounded-full">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  {/* Language toggle in mobile */}
                  <button
                    onClick={toggleLang}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-foreground hover:bg-muted transition-all"
                  >
                    <Globe size={18} className="text-primary" />
                    {lang === "ar" ? "English" : "العربية"}
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-border">
                <Link href="/faq" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors py-2">
                  {t.nav.faq}
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for the fixed header; the home hero sits underneath it instead. */}
      {!isHome && <div className="h-18 sm:h-20" />}
    </>
  );
}
