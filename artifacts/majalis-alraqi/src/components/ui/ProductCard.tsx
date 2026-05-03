import { Link } from "wouter";
import { Product } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, Heart } from "lucide-react";
import { useAddToWishlist } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const addToWishlist = useAddToWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast({
      title: "تم الإضافة بنجاح",
      description: `تم إضافة ${product.nameAr} إلى سلة التسوق.`,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    addToWishlist.mutate(
      { data: { productId: product.id } },
      {
        onSuccess: () => {
          toast({
            title: "تم الإضافة بنجاح",
            description: `تم إضافة ${product.nameAr} إلى قائمة الأمنيات.`,
          });
        },
      }
    );
  };

  return (
    <Link href={`/products/${product.id}`}>
      <motion.div 
        className="group relative bg-card rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-all duration-300"
        whileHover={{ y: -5 }}
      >
        {/* Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {product.discountPrice && (
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
              خصم
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
              الأكثر مبيعاً
            </span>
          )}
          {product.badge && (
            <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">
              {product.badge}
            </span>
          )}
        </div>

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img 
            src={product.images[0] || "/images/category-sofa.png"} 
            alt={product.nameAr}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Quick Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-2 translate-y-4 group-hover:translate-y-0">
            <button 
              onClick={handleAddToCart}
              className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors"
              title="أضف للسلة"
            >
              <ShoppingBag size={18} />
            </button>
            <button 
              onClick={handleAddToWishlist}
              className="bg-background text-foreground p-3 rounded-full hover:bg-background/90 transition-colors"
              title="أضف للمفضلة"
            >
              <Heart size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 text-center">
          <h3 className="font-bold text-lg mb-1 truncate text-foreground">{product.nameAr}</h3>
          <p className="text-sm text-muted-foreground mb-3">{product.categoryNameAr}</p>
          <div className="flex items-center justify-center gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-black text-primary">{product.discountPrice} ر.س</span>
                <span className="text-sm text-muted-foreground line-through">{product.price} ر.س</span>
              </>
            ) : (
              <span className="text-lg font-black text-primary">{product.price} ر.س</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
