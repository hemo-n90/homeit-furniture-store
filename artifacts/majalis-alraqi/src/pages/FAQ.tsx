import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir={dir}>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-foreground mb-4">{t.faq.title}</h1>
          <div className="w-16 h-1 bg-primary mx-auto rounded"></div>
        </div>

        <div className="space-y-3">
          {t.faq.items.map((faq, i) => (
            <motion.div key={i} initial={false} className="bg-card border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={`w-full flex items-center justify-between p-5 font-bold text-foreground hover:text-primary transition-colors ${dir === "rtl" ? "text-right" : "text-left"}`}
              >
                <span>{faq.q}</span>
                <ChevronDown size={20} className={`text-primary transition-transform duration-200 shrink-0 ${dir === "rtl" ? "mr-3" : "ml-3"} ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
