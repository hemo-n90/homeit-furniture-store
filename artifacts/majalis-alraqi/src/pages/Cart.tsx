import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background flex items-center justify-center" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-4">سلة التسوق فارغة</h1>
          <p className="text-muted-foreground mb-8">لم تضف أي منتجات بعد. استكشف تشكيلتنا الفاخرة.</p>
          <Link href="/products" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 hover:bg-primary/90 transition-colors">
            <ShoppingBag size={20} />
            تسوق الآن
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-black text-foreground mb-8">سلة التسوق</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(({ product, quantity }) => {
                const price = parseFloat(String(product.discountPrice || product.price));
                const originalPrice = parseFloat(String(product.price));
                const discountPrice = product.discountPrice ? parseFloat(String(product.discountPrice)) : null;
                const images = (product.images as string[]) || [];

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-start"
                  >
                    <Link href={`/products/${product.id}`}>
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                        <img
                          src={images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80"}
                          alt={product.nameAr}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-bold text-foreground hover:text-primary transition-colors truncate">{product.nameAr}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">{product.categoryNameAr}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="px-3 py-1 bg-muted hover:bg-muted/80 transition-colors font-bold"
                          >-</button>
                          <span className="px-4 py-1 font-bold">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="px-3 py-1 bg-muted hover:bg-muted/80 transition-colors font-bold"
                          >+</button>
                        </div>

                        <div className="text-left">
                          {discountPrice ? (
                            <div>
                              <p className="font-black text-primary">{(discountPrice * quantity).toLocaleString()} ر.س</p>
                              <p className="text-xs text-muted-foreground line-through">{(originalPrice * quantity).toLocaleString()} ر.س</p>
                            </div>
                          ) : (
                            <p className="font-black text-primary">{(price * quantity).toLocaleString()} ر.س</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
            >
              <Trash2 size={16} />
              إفراغ السلة
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-28">
              <h2 className="text-xl font-black text-foreground mb-6">ملخص الطلب</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>المجموع الفرعي</span>
                  <span>{totalAmount.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>الشحن</span>
                  <span className="text-green-600 font-semibold">{totalAmount >= 2000 ? "مجاني" : "يُحدد عند الطلب"}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-black text-xl text-foreground">
                  <span>الإجمالي</span>
                  <span className="text-primary">{totalAmount.toLocaleString()} ر.س</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors"
              >
                إتمام الطلب
                <ArrowRight size={20} className="rotate-180" />
              </Link>

              <Link
                href="/products"
                className="w-full mt-3 border border-border text-foreground py-3 rounded-xl font-medium text-center flex items-center justify-center gap-2 hover:bg-muted transition-colors"
              >
                متابعة التسوق
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
