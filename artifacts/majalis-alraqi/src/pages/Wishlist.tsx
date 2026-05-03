import { useGetWishlist, useRemoveFromWishlist } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";

export default function Wishlist() {
  const { data: wishlist, isLoading } = useGetWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const queryClient = useQueryClient();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleRemove = (productId: number) => {
    removeFromWishlist.mutate(
      { productId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
          toast({ title: "تم الحذف من قائمة الأمنيات" });
        },
      }
    );
  };

  const handleAddToCart = (item: any) => {
    addItem(
      {
        id: item.productId,
        name: item.name,
        nameAr: item.nameAr,
        price: item.price,
        discountPrice: item.discountPrice,
        images: item.images,
        categoryNameAr: item.categoryNameAr,
        inStock: item.inStock,
      } as any,
      1
    );
    toast({ title: "تم الإضافة للسلة", description: item.nameAr });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Heart size={28} className="text-primary" />
          <h1 className="text-3xl font-black text-foreground">قائمة الأمنيات</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-card rounded-xl h-80 border"></div>
            ))}
          </div>
        ) : !wishlist?.length ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={36} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">قائمة الأمنيات فارغة</h2>
            <p className="text-muted-foreground mb-8">أضف منتجاتك المفضلة لتجدها هنا دائماً</p>
            <Link href="/products" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold inline-block hover:bg-primary/90 transition-colors">
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((item, i) => {
                const price = parseFloat(String(item.price || "0"));
                const discountPrice = item.discountPrice ? parseFloat(String(item.discountPrice)) : null;
                const images = (item.images as string[]) || [];
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-md transition-all"
                  >
                    <Link href={`/products/${item.productId}`}>
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                          src={images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80"}
                          alt={item.nameAr}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link href={`/products/${item.productId}`}>
                        <h3 className="font-bold text-foreground hover:text-primary transition-colors mb-1 truncate">{item.nameAr}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">{item.categoryNameAr}</p>

                      <div className="flex items-center gap-2 mb-4">
                        {discountPrice ? (
                          <>
                            <span className="font-black text-primary">{discountPrice.toLocaleString()} ر.س</span>
                            <span className="text-sm text-muted-foreground line-through">{price.toLocaleString()} ر.س</span>
                          </>
                        ) : (
                          <span className="font-black text-primary">{price.toLocaleString()} ر.س</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                        >
                          <ShoppingBag size={15} />
                          أضف للسلة
                        </button>
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="p-2 border border-border rounded-lg text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
