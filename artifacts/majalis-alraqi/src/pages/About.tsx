import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { ABOUT_IMAGE, HERO_IMAGES } from "@/lib/images";

const SECTION_IMAGES = HERO_IMAGES;

export default function About() {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir={dir}>
      {/* Hero */}
      <section className="relative h-72 flex items-center justify-center overflow-hidden mb-20">
        <img src={ABOUT_IMAGE} alt="About" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">{t.about.title}</h1>
          <p className="text-lg text-white/80">{t.about.subtitle}</p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {t.about.stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-4xl font-black text-primary mb-2">{stat.value}</p>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Sections */}
      <div className="container mx-auto px-4 space-y-20">
        {t.about.sections.map((section, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <div className="rounded-3xl overflow-hidden aspect-video">
                <img src={SECTION_IMAGES[i]} alt={section.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <div className="w-16 h-1 bg-primary rounded mb-6"></div>
              <h2 className="text-3xl font-black text-foreground mb-6">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{section.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <section className="container mx-auto px-4 mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-secondary text-secondary-foreground rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-black mb-4">{t.about.cta}</h2>
          <p className="text-secondary-foreground/70 mb-8 text-lg">{t.about.ctaDesc}</p>
          <Link href="/products" className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black text-lg hover:bg-primary/90 transition-colors">
            {t.about.ctaBtn}
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
