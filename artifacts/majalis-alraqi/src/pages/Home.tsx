import { useGetHomepageSettings, useListProducts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { ProductCard } from "@/components/ui/ProductCard";
import { HeroSlider } from "@/components/ui/HeroSlider";
import { motion } from "framer-motion";
import { Truck, Shield, Phone, Award } from "lucide-react";

const benefits = [
  { icon: Truck, title: "توصيل مجاني", desc: "للطلبات فوق 2000 ر.س" },
  { icon: Shield, title: "ضمان الجودة", desc: "سنة كاملة على كل منتج" },
  { icon: Phone, title: "دعم متواصل", desc: "فريق خدمة عملاء متميز" },
  { icon: Award, title: "منتجات أصيلة", desc: "حرفية سعودية عريقة" },
];

export default function Home() {
  const { data: settings } = useGetHomepageSettings();
  const { data: bestSellers } = useListProducts({ isBestseller: true, limit: 4 });
  const { data: featured } = useListProducts({ featured: true, limit: 4 });

  // Parse heroSlides from JSON stored in heroImage field (only when it's a JSON array with multiple slides)
  let sliderSlides: { image: string; titleAr?: string; descriptionAr?: string }[] | undefined;
  if (settings?.heroImage) {
    try {
      const parsed = JSON.parse(settings.heroImage);
      if (Array.isArray(parsed) && parsed.length > 0) {
        sliderSlides = parsed; // Admin has configured custom slides
      }
    } catch {
      // Not JSON — single URL or legacy value, fall through to use defaults
    }
  }
  // If no custom slides configured, sliderSlides is undefined → HeroSlider shows 5 beautiful defaults

  return (
    <div className="min-h-screen" dir="rtl">
      {/* Announcement Bar */}
      {settings?.announcementBarAr && (
        <div className="bg-secondary text-secondary-foreground text-sm py-2.5 text-center font-medium tracking-wide">
          {settings.announcementBarAr}
        </div>
      )}

      {/* Hero Slider */}
      <HeroSlider
        slides={sliderSlides}
        titleAr={!sliderSlides ? (settings?.heroTitleAr || undefined) : undefined}
        descriptionAr={!sliderSlides ? (settings?.heroDescriptionAr || undefined) : undefined}
      />

      {/* Benefits Bar */}
      <section className="bg-card border-y border-border py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
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
            ))}
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
              <p className="text-primary text-sm font-bold tracking-widest mb-2 uppercase">اختيارات حصرية</p>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">تشكيلة مميزة</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded"></div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {featured?.products?.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banner Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80"
          alt="Luxury interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/85" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-primary text-sm font-bold tracking-widest mb-4">خدمة متميزة</p>
            <h2 className="text-3xl sm:text-5xl font-black text-secondary-foreground mb-6 leading-tight">
              أثاث يصنع ذكريات تدوم
            </h2>
            <p className="text-secondary-foreground/70 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              نؤمن بأن المنزل الجميل يبدأ من أثاث راقٍ. كل قطعة نصنعها هي استثمار في راحتك وسعادة عائلتك.
            </p>
            <Link
              href="/about"
              className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black text-lg hover:bg-primary/90 transition-all hover:scale-105"
            >
              اعرف أكثر عنا
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bestsellers */}
      {(bestSellers?.products?.length ?? 0) > 0 && (
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14"
            >
              <p className="text-primary text-sm font-bold tracking-widest mb-2 uppercase">الأكثر طلباً</p>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-3">الأكثر مبيعاً</h2>
              <div className="w-16 h-1 bg-primary mx-auto rounded"></div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {bestSellers?.products?.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link
                href="/products"
                className="inline-block border-2 border-primary text-primary font-bold px-10 py-4 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
              >
                عرض كل المنتجات
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonial / Brand Strip */}
      <section className="py-12 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <p className="text-secondary-foreground/60 text-sm font-semibold tracking-widest mb-6 uppercase">يثق بنا أكثر من</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {["+5000 عميل سعيد", "+200 تصميم حصري", "+20 سنة خبرة", "7 مراحل جودة"].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl sm:text-3xl font-black text-primary">{stat.split(" ")[0]}</p>
                <p className="text-secondary-foreground/70 text-sm">{stat.split(" ").slice(1).join(" ")}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
