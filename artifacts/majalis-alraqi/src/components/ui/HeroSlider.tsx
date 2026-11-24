import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { HERO_IMAGES } from "@/lib/images";

interface Slide {
  image: string;
  titleAr?: string;
  descriptionAr?: string;
}

interface HeroSliderProps {
  slides?: Slide[];
}

const SLIDE_IMAGES = HERO_IMAGES;

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
};

export function HeroSlider({ slides }: HeroSliderProps) {
  const { t, dir } = useLanguage();
  const defaultSlides: Slide[] = t.home.slides.map((s, i) => ({
    image: SLIDE_IMAGES[i] || SLIDE_IMAGES[0],
    titleAr: s.titleAr,
    descriptionAr: s.descriptionAr,
  }));

  const allSlides = slides && slides.length > 0 ? slides : defaultSlides;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((index: number, slideDir?: number) => {
    setDirection(slideDir ?? (index > current ? 1 : -1));
    setCurrent((index + allSlides.length) % allSlides.length);
  }, [current, allSlides.length]);

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const slide = allSlides[current];

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
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto w-full" dir={dir}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div className="inline-block bg-primary/20 backdrop-blur-sm border border-primary/40 text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider">
              {t.home.badge}
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
              {slide.titleAr}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl mb-10 text-white/90 font-light leading-relaxed drop-shadow-lg max-w-2xl mx-auto">
              {slide.descriptionAr}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/products"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 shadow-xl w-full sm:w-auto text-center"
              >
                {t.home.shopNow}
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all hover:scale-105 w-full sm:w-auto text-center"
              >
                {t.home.contactUs}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrow Navigation — flipped for RTL */}
      <button
        onClick={dir === "rtl" ? prev : next}
        className="hidden sm:block absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 sm:p-4 rounded-full hover:bg-white/20 transition-all hover:scale-110"
        aria-label="Previous"
      >
        <ChevronRight size={22} />
      </button>
      <button
        onClick={dir === "rtl" ? next : prev}
        className="hidden sm:block absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 sm:p-4 rounded-full hover:bg-white/20 transition-all hover:scale-110"
        aria-label="Next"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {allSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? "bg-primary w-8 h-3" : "bg-white/40 hover:bg-white/70 w-3 h-3"}`}
            aria-label={`Slide ${i + 1}`}
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
      <div dir="ltr" className={`absolute top-24 sm:top-28 ${dir === "rtl" ? "left-6" : "right-6"} z-20 bg-black/30 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full`}>
        {current + 1} / {allSlides.length}
      </div>
    </section>
  );
}
