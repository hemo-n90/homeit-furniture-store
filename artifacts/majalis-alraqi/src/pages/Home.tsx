import { useGetHomepageSettings, useListProducts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion } from "framer-motion";

export default function Home() {
  const { data: settings } = useGetHomepageSettings();
  const { data: bestSellers } = useListProducts({ isBestseller: true, limit: 4 });
  const { data: featured } = useListProducts({ featured: true, limit: 4 });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={settings?.heroImage || "/images/hero.png"} 
            alt="Hero" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight"
          >
            {settings?.heroTitleAr || "لمسة من الفخامة في كل تفصيلة"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl mb-10 text-white/90"
          >
            {settings?.heroDescriptionAr || "نصنع لك مجالس وأثاثاً يعكس ذوقك الرفيع ويليق بضيوفك"}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/products" className="bg-primary text-primary-foreground px-8 py-4 rounded-md font-bold text-lg hover:bg-primary/90 transition-colors w-full sm:w-auto">
              تسوق الآن
            </Link>
            <Link href="/contact" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-md font-bold text-lg hover:bg-white/20 transition-colors w-full sm:w-auto">
              تواصل معنا
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">تشكيلة مميزة</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured?.products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">الأكثر مبيعاً</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers?.products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products" className="inline-block border-2 border-primary text-primary font-bold px-8 py-3 rounded-md hover:bg-primary hover:text-primary-foreground transition-colors">
              عرض كل المنتجات
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
