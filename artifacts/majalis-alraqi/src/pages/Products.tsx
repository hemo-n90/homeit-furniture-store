import { useState } from "react";
import { useListProducts, useListCategories, ListProductsSortBy } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function Products() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<ListProductsSortBy>(ListProductsSortBy.newest);

  // Simple debounce for search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setTimeout(() => setDebouncedSearch(e.target.value), 500);
  };

  const { data: categories } = useListCategories();
  const { data, isLoading } = useListProducts({
    search: debouncedSearch || undefined,
    categoryId,
    sortBy,
    limit: 50
  });

  return (
    <div className="min-h-screen py-12 bg-background">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black text-foreground mb-8 text-center">المنتجات</h1>
        
        {/* Filters and Search */}
        <div className="bg-card p-6 rounded-xl shadow-sm border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              value={search}
              onChange={handleSearchChange}
              className="w-full bg-muted/50 border-none rounded-lg py-3 pr-10 pl-4 focus:ring-2 focus:ring-primary outline-none transition-all text-foreground"
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-4">
            <div className="flex-1 md:w-48">
              <select 
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-muted/50 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all text-foreground appearance-none"
              >
                <option value="">كل الفئات</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.id}>{c.nameAr}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 md:w-48 relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as ListProductsSortBy)}
                className="w-full bg-muted/50 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all text-foreground appearance-none"
              >
                <option value="newest">الأحدث</option>
                <option value="price_desc">السعر: من الأعلى للأقل</option>
                <option value="price_asc">السعر: من الأقل للأعلى</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse bg-card rounded-xl overflow-hidden shadow-sm border h-80">
                <div className="bg-muted h-48 w-full"></div>
                <div className="p-5">
                  <div className="h-6 bg-muted rounded w-3/4 mb-3 mx-auto"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-4 mx-auto"></div>
                  <div className="h-6 bg-muted rounded w-1/3 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data?.products?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border">
            <h3 className="text-2xl font-bold text-muted-foreground">لم يتم العثور على منتجات</h3>
            <p className="text-muted-foreground mt-2">جرب البحث بكلمات مختلفة أو تغيير الفلتر</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data?.products?.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
