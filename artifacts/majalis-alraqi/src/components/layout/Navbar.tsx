import { Link } from "wouter";
import { ShoppingBag, Heart, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="text-2xl font-black text-primary tracking-tight">
          مجالس الراقي
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <Link href="/products" className="hover:text-primary transition-colors">المنتجات</Link>
          <Link href="/about" className="hover:text-primary transition-colors">من نحن</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">تواصل معنا</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/wishlist" className="text-foreground hover:text-primary transition-colors">
            <Heart size={20} />
          </Link>
          <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-background border-b shadow-lg p-4 flex flex-col gap-4">
          <Link href="/" className="hover:text-primary" onClick={() => setMobileMenuOpen(false)}>الرئيسية</Link>
          <Link href="/products" className="hover:text-primary" onClick={() => setMobileMenuOpen(false)}>المنتجات</Link>
          <Link href="/about" className="hover:text-primary" onClick={() => setMobileMenuOpen(false)}>من نحن</Link>
          <Link href="/contact" className="hover:text-primary" onClick={() => setMobileMenuOpen(false)}>تواصل معنا</Link>
        </div>
      )}
    </header>
  );
}
