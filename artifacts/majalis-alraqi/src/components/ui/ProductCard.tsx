import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Heart } from "lucide-react";
import { useAddToWishlist } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const addToWishlist = useAddToWishlist();
  const { lang, t } = useLanguage();

  const price = parseFloat(String(product.price));
  const discountPrice = product.discountPrice ? parseFloat(String(product.discountPrice)) : null;
  const images = (product.images as string[]) || [];
  const mainImage = images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80";
  const displayName = lang === "en" && product.name ? product.name : product.nameAr;
  const displayCategory = lang === "en" && (product as any).categoryName
    ? (product as any).categoryName
    : product.categoryNameAr;
  const currency = lang === "ar" ? "ر.س" : "SAR";
  const discount = discountPrice ? Math.round((1 - discountPrice / price) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({ title: t.wishlist.addedToCart, description: displayName });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist.mutate(
      { data: { productId: product.id } },
      { onSuccess: () => toast({ title: lang === "ar" ? "تم الإضافة للمفضلة" : "Added to wishlist", description: displayName }) }
    );
  };

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div
        className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
        whileHover={{ y: -4 }}
      >
        {/* Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
          {discountPrice && (
            <span className="bg-destructive text-destructive-foreground text-[11px] font-black px-2 py-1 rounded-md shadow-sm">
              {discount}% {lang === "ar" ? "خصم" : "OFF"}
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-primary text-primary-foreground text-[11px] font-black px-2 py-1 rounded-md shadow-sm">
              {lang === "ar" ? "الأكثر مبيعاً" : "Best Seller"}
            </span>
          )}
          {product.badge && !product.isBestseller && (
            <span className="bg-secondary text-secondary-foreground text-[11px] font-black px-2 py-1 rounded-md shadow-sm">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-muted text-muted-foreground text-[11px] font-bold px-2 py-1 rounded-md">
              {t.productDetail.outOfStock}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleAddToWishlist}
          className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow-sm sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground"
          title={t.productDetail.addToWishlist}
        >
          <Heart size={15} />
        </button>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={mainImage}
            alt={displayName}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            onError={e => {
              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80";
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} />
              {product.inStock ? t.productDetail.addToCart : t.productDetail.outOfStock}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <h3 className="font-bold text-base mb-1 text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
            {displayName}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">{displayCategory}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {discountPrice ? (
              <>
                <span className="text-base font-black text-primary">{discountPrice.toLocaleString()} {currency}</span>
                <span className="text-xs text-muted-foreground line-through">{price.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-base font-black text-primary">{price.toLocaleString()} {currency}</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
