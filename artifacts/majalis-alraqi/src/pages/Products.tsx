import { useState } from "react";
import { useListProducts, useListCategories, ListProductsSortBy } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Products() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<ListProductsSortBy>(ListProductsSortBy.newest);
  const { t, dir, lang } = useLanguage();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setTimeout(() => setDebouncedSearch(e.target.value), 500);
  };

  const { data: categories } = useListCategories();
  const { data, isLoading } = useListProducts({ search: debouncedSearch || undefined, categoryId, sortBy, limit: 50 });

  return (
    <div className="min-h-screen py-12 bg-background" dir={dir}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black text-foreground mb-8 text-center">{t.products.title}</h1>

        {/* Filters */}
        <div className="bg-card p-6 rounded-xl shadow-sm border mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className={`absolute ${dir === "rtl" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-muted-foreground`} size={20} />
            <input
              type="text"
              placeholder={t.products.search}
              value={search}
              onChange={handleSearchChange}
              className={`w-full bg-muted/50 border-none rounded-lg py-3 focus:ring-2 focus:ring-primary outline-none transition-all text-foreground ${dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"}`}
            />
          </div>

          <div className="flex w-full md:w-auto gap-4">
            <select
              value={categoryId || ""}
              onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
              className="flex-1 md:w-48 bg-muted/50 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all text-foreground appearance-none"
            >
              <option value="">{t.products.allCategories}</option>
              {categories?.map(c => (
                <option key={c.id} value={c.id}>
                  {lang === "en" && c.name ? c.name : c.nameAr}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as ListProductsSortBy)}
              className="flex-1 md:w-48 bg-muted/50 border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all text-foreground appearance-none"
            >
              <option value={ListProductsSortBy.newest}>{t.products.newest}</option>
              <option value={ListProductsSortBy.price_desc}>{t.products.priceHigh}</option>
              <option value={ListProductsSortBy.price_asc}>{t.products.priceLow}</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl h-80 border" />
            ))}
          </div>
        ) : data?.products?.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="text-2xl font-bold text-muted-foreground mb-3">{t.products.noResults}</p>
            <p className="text-muted-foreground">{t.products.noResultsDesc}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.products?.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
