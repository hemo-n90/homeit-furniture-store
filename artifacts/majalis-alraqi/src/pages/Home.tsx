import { useGetHomepageSettings, useListProducts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ProductCard } from "@/components/ui/ProductCard";
import { HeroSlider } from "@/components/ui/HeroSlider";
import { motion } from "framer-motion";
import { Truck, Shield, Phone, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const benefitIcons = [Truck, Shield, Phone, Award];

export default function Home() {
  const { data: settings } = useGetHomepageSettings();
  const { data: bestSellers } = useListProducts({ isBestseller: true, limit: 4 });
  const { data: featured } = useListProducts({ featured: true, limit: 4 });
  const { t, dir } = useLanguage();

  let sliderSlides: { image: string; titleAr?: string; descriptionAr?: string }[] | undefined;
  if (settings?.heroImage) {
    try {
      const parsed = JSON.parse(settings.heroImage);
      if (Array.isArray(parsed) && parsed.length > 0) sliderSlides = parsed;
    } catch { /* use defaults */ }
  }

  return (
    <div className="min-h-screen" dir={dir}>
      {settings?.announcementBarAr && (
        <div className="bg-secondary text-secondary-foreground text-sm py-2.5 text-center font-medium tracking-wide">
          {settings.announcementBarAr}
        </div>
      )}

      <HeroSlider slides={sliderSlides} />

      {/* Benefits Bar */}
      <section className="bg-card border-y border-border py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {t.home.benefits.map(({ title, desc }, i) => {
              const Icon = benefitIcons[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {(featured?.products?.length ?? 0) > 0 && (
        <section className="py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14"
            >
              <p className="text-primary text-sm font-bold tracking-widest mb-2 uppercase">{t.home.featuredSub}</p>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">{t.home.featuredTitle}</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded"></div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {featured?.products?.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-secondary/85" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-primary text-sm font-bold tracking-widest mb-4 uppercase">{t.home.featuredSub}</p>
            <h2 className="text-3xl sm:text-5xl font-black text-secondary-foreground mb-6 leading-tight">{t.home.bannerTitle}</h2>
            <p className="text-secondary-foreground/70 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">{t.home.bannerDesc}</p>
            <Link href="/about" className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black text-lg hover:bg-primary/90 transition-all hover:scale-105">
              {t.home.learnMore}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bestsellers */}
      {(bestSellers?.products?.length ?? 0) > 0 && (
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-14">
              <p className="text-primary text-sm font-bold tracking-widest mb-2 uppercase">{t.home.bestsellersSub}</p>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">{t.home.bestsellersTitle}</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded"></div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {bestSellers?.products?.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
              <Link href="/products" className="inline-block border-2 border-primary text-primary font-bold px-10 py-4 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105">
                {t.home.viewAll}
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats Strip */}
      <section className="py-12 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary-foreground/60 text-sm font-semibold tracking-widest mb-6 uppercase">
            {dir === "rtl" ? "يثق بنا أكثر من" : "Trusted by"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {t.home.stats.map((stat, i) => {
              const parts = stat.split(" ");
              const num = parts[0];
              const label = parts.slice(1).join(" ");
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <p className="text-2xl sm:text-3xl font-black text-primary">{num}</p>
                  <p className="text-secondary-foreground/70 text-sm">{label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
