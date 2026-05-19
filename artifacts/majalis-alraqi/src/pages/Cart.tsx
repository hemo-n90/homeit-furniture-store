import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();
  const { t, dir } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background flex items-center justify-center" dir={dir}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-4">{t.cart.empty}</h1>
          <p className="text-muted-foreground mb-8">{t.cart.emptyDesc}</p>
          <Link href="/products" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 hover:bg-primary/90 transition-colors">
            <ShoppingBag size={20} />
            {t.cart.shopNow}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir={dir}>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-black text-foreground mb-8">{t.cart.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(({ product, quantity }) => {
                const price = parseFloat(String(product.discountPrice || product.price));
                const discountPrice = product.discountPrice ? parseFloat(String(product.discountPrice)) : null;
                const originalPrice = parseFloat(String(product.price));
                const images = (product.images as string[]) || [];
                const currency = dir === "rtl" ? "ر.س" : "SAR";

                return (
                  <motion.div key={product.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center">
                    <img
                      src={images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80"}
                      alt={product.nameAr}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0 bg-muted"
                      onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{product.nameAr}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {discountPrice ? (
                          <>
                            <span className="text-primary font-black">{discountPrice.toLocaleString()} {currency}</span>
                            <span className="text-muted-foreground text-sm line-through">{originalPrice.toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="text-primary font-black">{price.toLocaleString()} {currency}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-2 hover:bg-muted transition-colors"><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                          <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-2 hover:bg-muted transition-colors"><Plus size={14} /></button>
                        </div>
                        <button onClick={() => removeItem(product.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="font-black text-primary">{(price * quantity).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{currency}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-black text-foreground mb-6">{t.cart.orderSummary}</h2>
              <div className="space-y-4 mb-6">
                {items.map(({ product, quantity }) => {
                  const price = parseFloat(String(product.discountPrice || product.price));
                  const currency = dir === "rtl" ? "ر.س" : "SAR";
                  return (
                    <div key={product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate max-w-[140px]">{product.nameAr} × {quantity}</span>
                      <span className="font-medium">{(price * quantity).toLocaleString()} {currency}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.cart.shipping}</span>
                  <span className="text-green-600 font-medium">{t.cart.free}</span>
                </div>
                <div className="flex justify-between font-black text-lg pt-2 border-t border-border">
                  <span>{t.cart.total}</span>
                  <span className="text-primary">{totalAmount.toLocaleString()} {dir === "rtl" ? "ر.س" : "SAR"}</span>
                </div>
              </div>
              <Link href="/checkout" className="block w-full bg-primary text-primary-foreground text-center py-4 rounded-xl font-black text-lg mt-6 hover:bg-primary/90 transition-colors">
                {t.cart.checkout}
              </Link>
              <Link href="/products" className="block w-full text-center text-muted-foreground text-sm mt-4 hover:text-primary transition-colors">
                {t.cart.continueShopping}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
