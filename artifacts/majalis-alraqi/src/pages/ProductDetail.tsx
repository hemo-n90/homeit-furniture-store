import { useState } from "react";
import { useParams, Link } from "wouter";
import { useGetProduct, useListProducts, useAddToWishlist } from "@workspace/api-client-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "0");
  const { data: product, isLoading } = useGetProduct(productId, { query: { enabled: !!productId } });
  const { data: relatedData } = useListProducts(
    { categoryId: product?.categoryId ?? undefined, limit: 4 },
    { query: { enabled: !!product?.categoryId } }
  );
  const { addItem } = useCart();
  const { toast } = useToast();
  const addToWishlist = useAddToWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product as any, quantity);
    toast({ title: "تم الإضافة للسلة", description: product.nameAr });
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    addToWishlist.mutate(
      { data: { productId: product.id } },
      { onSuccess: () => toast({ title: "تم الإضافة للمفضلة", description: product.nameAr }) }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div className="bg-muted rounded-2xl aspect-square"></div>
            <div className="space-y-4 pt-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-10 bg-muted rounded w-1/3"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-bold text-muted-foreground mb-4">المنتج غير موجود</p>
        <Link href="/products" className="text-primary hover:underline">العودة للمنتجات</Link>
      </div>
    </div>
  );

  const images = (product.images as string[]) || [];
  const price = parseFloat(String(product.price));
  const discountPrice = product.discountPrice ? parseFloat(String(product.discountPrice)) : null;
  const relatedProducts = (relatedData?.products || []).filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <Link href="/products" className="hover:text-primary transition-colors">المنتجات</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <span className="text-foreground font-medium">{product.nameAr}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-muted mb-4">
              <img
                src={images[activeImage] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"}
                alt={product.nameAr}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(i => Math.max(0, i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActiveImage(i => Math.min(images.length - 1, i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`rounded-xl overflow-hidden w-20 h-20 border-2 transition-all ${activeImage === i ? "border-primary" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {discountPrice && <span className="bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded-full">خصم</span>}
              {product.isBestseller && <span className="bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">الأكثر مبيعاً</span>}
              {!product.inStock && <span className="bg-muted text-muted-foreground text-sm font-bold px-3 py-1 rounded-full">غير متوفر</span>}
            </div>

            <div>
              <p className="text-primary text-sm font-semibold mb-2">{product.categoryNameAr}</p>
              <h1 className="text-3xl lg:text-4xl font-black text-foreground leading-tight">{product.nameAr}</h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {discountPrice ? (
                <>
                  <span className="text-4xl font-black text-primary">{discountPrice.toLocaleString()} ر.س</span>
                  <span className="text-xl text-muted-foreground line-through">{price.toLocaleString()} ر.س</span>
                  <span className="bg-destructive/10 text-destructive text-sm font-bold px-3 py-1 rounded-full">
                    وفر {((1 - discountPrice / price) * 100).toFixed(0)}%
                  </span>
                </>
              ) : (
                <span className="text-4xl font-black text-primary">{price.toLocaleString()} ر.س</span>
              )}
            </div>

            {/* Description */}
            {product.descriptionAr && (
              <p className="text-muted-foreground leading-relaxed text-base border-t border-border pt-6">
                {product.descriptionAr}
              </p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-semibold text-foreground">الكمية:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 transition-colors font-bold text-lg"
                >-</button>
                <span className="px-6 py-2 font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 transition-colors font-bold text-lg"
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={22} />
                {product.inStock ? "أضف للسلة" : "غير متوفر"}
              </button>
              <button
                onClick={handleAddToWishlist}
                className="bg-card border border-border p-4 rounded-xl hover:bg-muted transition-colors"
              >
                <Heart size={22} />
              </button>
            </div>

            {/* Benefits */}
            <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-bold text-foreground">توصيل مجاني</p>
                <p className="text-muted-foreground text-xs">للطلبات فوق 2000 ر.س</p>
              </div>
              <div>
                <p className="font-bold text-foreground">ضمان الجودة</p>
                <p className="text-muted-foreground text-xs">منتجات مضمونة</p>
              </div>
              <div>
                <p className="font-bold text-foreground">دعم فوري</p>
                <p className="text-muted-foreground text-xs">عبر واتساب</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-foreground mb-3">منتجات ذات صلة</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p as any} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
