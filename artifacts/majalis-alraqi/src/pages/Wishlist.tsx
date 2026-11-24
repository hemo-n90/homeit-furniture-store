import { useGetWishlist, useRemoveFromWishlist } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { PLACEHOLDER_IMAGE } from "@/lib/images";

export default function Wishlist() {
  const { data: wishlist, isLoading } = useGetWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const queryClient = useQueryClient();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { t, dir } = useLanguage();

  const handleRemove = (productId: number) => {
    removeFromWishlist.mutate(
      { productId },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] }); toast({ title: t.wishlist.removed }); } }
    );
  };

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.productId, name: item.name, nameAr: item.nameAr,
      price: item.price, discountPrice: item.discountPrice,
      images: item.images, categoryNameAr: item.categoryNameAr, inStock: item.inStock,
    } as any, 1);
    toast({ title: t.wishlist.addedToCart, description: item.nameAr });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir={dir}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Heart size={28} className="text-primary" />
          <h1 className="text-3xl font-black text-foreground">{t.wishlist.title}</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="animate-pulse bg-card rounded-xl h-80 border" />)}
          </div>
        ) : !wishlist?.length ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">{t.wishlist.empty}</h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">{t.wishlist.emptyDesc}</p>
            <Link href="/products" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-primary/90 transition-colors">
              <ShoppingBag size={20} />
              {t.wishlist.browse}
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlist.map((item: any, i: number) => {
                const price = parseFloat(String(item.price));
                const discountPrice = item.discountPrice ? parseFloat(String(item.discountPrice)) : null;
                const images = (item.images as string[]) || [];
                const currency = dir === "rtl" ? "ر.س" : "SAR";

                return (
                  <motion.div key={item.productId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden">
                    <Link href={`/products/${item.productId}`}>
                      <div className="relative aspect-square bg-muted overflow-hidden">
                        <img src={images[0] || PLACEHOLDER_IMAGE} alt={item.nameAr}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    </Link>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground mb-1 line-clamp-1">{item.nameAr}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        {discountPrice ? (
                          <>
                            <span className="text-primary font-black">{discountPrice.toLocaleString()} {currency}</span>
                            <span className="text-xs text-muted-foreground line-through">{price.toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="text-primary font-black">{price.toLocaleString()} {currency}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors">
                          <ShoppingBag size={14} />
                          {t.wishlist.addToCart}
                        </button>
                        <button onClick={() => handleRemove(item.productId)}
                          className="p-2 border border-border rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
