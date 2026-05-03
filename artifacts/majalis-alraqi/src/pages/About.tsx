import { motion } from "framer-motion";

const sections = [
  {
    title: "قصتنا",
    text: "بدأت مجالس الراقي من حلم بسيط: أن يجد كل بيت سعودي مجلساً يليق بضيوفه ويعكس أصالة ذوقه. منذ أكثر من عشرين عاماً، وصناع مهرة يجمعون بين الحرفة الأصيلة وروح العصر، نحوّل الأقمشة والخشب إلى تجارب لا تُنسى.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  },
  {
    title: "رؤيتنا",
    text: "أن نكون الاختيار الأول لكل من يؤمن بأن المنزل مرآة الروح. نسعى إلى إعادة تعريف الفخامة في الأثاث العربي — لا بالمظهر وحده، بل بالجوهر والجودة والخدمة الاستثنائية.",
    image: "https://images.unsplash.com/photo-1567016520496-0cb37d8467a7?w=800&q=80",
  },
  {
    title: "الجودة أولاً",
    text: "كل قطعة تخرج من ورشنا تمر بسبع مراحل فحص دقيقة. نختار الأقمشة بأيدينا من أسواق إسطنبول وميلانو ومراكش. الخشب لدينا مُعالج لأكثر من عامين. نحن لا نساوم على التفاصيل.",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
  },
];

const stats = [
  { value: "+20", label: "سنة خبرة" },
  { value: "+5000", label: "عميل سعيد" },
  { value: "+200", label: "تصميم حصري" },
  { value: "7", label: "مراحل جودة" },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir="rtl">
      {/* Hero */}
      <section className="relative h-72 flex items-center justify-center overflow-hidden mb-20">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80"
          alt="About"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center text-white"
        >
          <h1 className="text-5xl font-black mb-4">من نحن</h1>
          <p className="text-lg text-white/80">قصة فخر وأصالة منذ أكثر من عشرين عاماً</p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center"
            >
              <p className="text-4xl font-black text-primary mb-2">{stat.value}</p>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Sections */}
      <div className="container mx-auto px-4 space-y-20">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
          >
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <div className="rounded-3xl overflow-hidden aspect-video">
                <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-secondary text-secondary-foreground rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-black mb-4">هل أنت مستعد لتجربة الفخامة الحقيقية؟</h2>
          <p className="text-secondary-foreground/70 mb-8 text-lg">تصفح تشكيلتنا وابدأ رحلتك نحو منزل استثنائي</p>
          <a href="/products" className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black text-lg hover:bg-primary/90 transition-colors">
            اكتشف المنتجات
          </a>
        </motion.div>
      </section>
    </div>
  );
}
