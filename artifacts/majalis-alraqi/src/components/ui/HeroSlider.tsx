import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface Slide {
  image: string;
  titleAr?: string;
  descriptionAr?: string;
}

interface HeroSliderProps {
  slides?: Slide[];
  titleAr?: string;
  descriptionAr?: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=90",
    titleAr: "مجالس الراقي — أثاث عربي فاخر",
    descriptionAr: "نصنع لك مجالس وأثاثاً يعكس ذوقك الرفيع ويليق بضيوفك",
  },
  {
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=90",
    titleAr: "تشكيلة الكنبات الفاخرة",
    descriptionAr: "أناقة لا مثيل لها — مصنوعة بأرقى الأقمشة وأجود الخامات",
  },
  {
    image: "https://images.unsplash.com/photo-1567016520496-0cb37d8467a7?w=1920&q=90",
    titleAr: "ديكور راقٍ يليق بمنزلك",
    descriptionAr: "اكتشف تشكيلتنا الحصرية من الأثاث المنزلي الفاخر",
  },
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=90",
    titleAr: "غرف المعيشة الفاخرة",
    descriptionAr: "حوّل منزلك إلى تحفة فنية بلمسة مجالس الراقي",
  },
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=90",
    titleAr: "أثاث بمعايير عالمية",
    descriptionAr: "جودة تدوم وفخامة تبقى — كل قطعة حكاية",
  },
];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
};

export function HeroSlider({ slides, titleAr, descriptionAr }: HeroSliderProps) {
  const allSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (index: number, dir?: number) => {
      setDirection(dir ?? (index > current ? 1 : -1));
      setCurrent((index + allSlides.length) % allSlides.length);
    },
    [current, allSlides.length]
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const slide = allSlides[current];
  const heroTitle = titleAr || slide.titleAr || DEFAULT_SLIDES[0].titleAr;
  const heroDesc = descriptionAr || slide.descriptionAr || DEFAULT_SLIDES[0].descriptionAr;

  return (
    <section
      className="relative h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.titleAr || ""}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Multi-layer overlay for text clarity */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto w-full" dir="rtl">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="inline-block bg-primary/20 backdrop-blur-sm border border-primary/40 text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider"
            >
              ✦ مجالس الراقي ✦
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
              {heroTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl mb-10 text-white/90 font-light leading-relaxed drop-shadow-lg max-w-2xl mx-auto">
              {heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-xl w-full sm:w-auto text-center"
              >
                تسوق الآن
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all hover:scale-105 w-full sm:w-auto text-center"
              >
                تواصل معنا
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={prev}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 sm:p-4 rounded-full hover:bg-white/20 transition-all hover:scale-110 group"
        aria-label="السابق"
      >
        <ChevronRight size={22} className="group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={next}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 sm:p-4 rounded-full hover:bg-white/20 transition-all hover:scale-110 group"
        aria-label="التالي"
      >
        <ChevronLeft size={22} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {allSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "bg-primary w-8 h-3"
                : "bg-white/40 hover:bg-white/70 w-3 h-3"
            }`}
            aria-label={`الشريحة ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!isPaused && (
        <motion.div
          key={`progress-${current}`}
          className="absolute bottom-0 left-0 h-1 bg-primary z-20"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      )}

      {/* Slide counter */}
      <div className="absolute top-6 left-6 z-20 bg-black/30 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
        {current + 1} / {allSlides.length}
      </div>
    </section>
  );
}
