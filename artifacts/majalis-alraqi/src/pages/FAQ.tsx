import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "كيف أطلب منتجاً؟", a: "يمكنك تصفح منتجاتنا وإضافة ما تريده إلى السلة، ثم إتمام الطلب بإدخال بيانات التوصيل. سنتواصل معك لتأكيد الطلب وموعد التوصيل." },
  { q: "هل التوصيل متاح لجميع مناطق المملكة؟", a: "نعم، نوصّل لجميع مناطق المملكة العربية السعودية. التوصيل مجاني للطلبات التي تتجاوز 2000 ريال." },
  { q: "ما هي طرق الدفع المتاحة؟", a: "حالياً نوفر الدفع عند الاستلام (نقداً أو بالبطاقة). الدفع الإلكتروني قيد التطوير وسيتوفر قريباً." },
  { q: "كم تستغرق مدة التوصيل؟", a: "تتراوح مدة التوصيل عادةً بين 3 إلى 7 أيام عمل، تبعاً لمنطقتك والكميات المطلوبة." },
  { q: "هل يمكنني إرجاع المنتج؟", a: "نعم، نقبل الإرجاع خلال 7 أيام من تاريخ الاستلام إذا كان المنتج في حالته الأصلية وغير مستخدم. يرجى التواصل معنا أولاً." },
  { q: "هل المنتجات مصنوعة محلياً؟", a: "نعم، معظم منتجاتنا تُصنع محلياً بأيدي حرفيين سعوديين موهوبين، مع استخدام أجود الخامات المستوردة." },
  { q: "هل يمكنني تخصيص التصميم؟", a: "بالتأكيد! نوفر خدمة التصميم حسب الطلب للمجالس والكنبات. يرجى التواصل معنا عبر واتساب لمزيد من التفاصيل." },
  { q: "هل تتوفر ضمان على المنتجات؟", a: "نعم، جميع منتجاتنا مضمونة لمدة سنة من تاريخ الشراء ضد عيوب الصناعة." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-foreground mb-4">الأسئلة الشائعة</h1>
          <div className="w-16 h-1 bg-primary mx-auto rounded"></div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={false}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-right font-bold text-foreground hover:text-primary transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-primary transition-transform duration-200 shrink-0 mr-3 ${open === i ? "rotate-180" : ""}`}
                />
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
