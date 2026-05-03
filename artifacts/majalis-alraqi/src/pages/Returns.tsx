import { motion } from "framer-motion";

const sections = [
  {
    title: "شروط الإرجاع",
    items: [
      "يمكن إرجاع المنتج خلال 7 أيام من تاريخ الاستلام.",
      "يجب أن يكون المنتج في حالته الأصلية وغير مستخدم.",
      "يجب تقديم فاتورة الشراء الأصلية.",
      "لا يُقبل إرجاع المنتجات المخصصة أو المصنوعة حسب الطلب.",
    ],
  },
  {
    title: "خطوات الإرجاع",
    items: [
      "تواصل معنا عبر واتساب أو الهاتف خلال 7 أيام من الاستلام.",
      "أرسل صوراً للمنتج موضحاً سبب الإرجاع.",
      "سيقوم فريقنا بمراجعة طلبك والرد خلال 24 ساعة.",
      "سيتم تحديد موعد لاستلام المنتج من منزلك.",
      "بعد الفحص وتأكيد الحالة، يتم رد المبلغ أو إرسال بديل.",
    ],
  },
  {
    title: "حالات الإرجاع المقبولة",
    items: [
      "منتج معيب أو به خلل مصنعي.",
      "منتج مختلف عما تم طلبه.",
      "منتج تالف عند الاستلام.",
    ],
  },
  {
    title: "حالات الإرجاع غير المقبولة",
    items: [
      "تغيير الرأي بعد الاستخدام.",
      "الأضرار الناجمة عن سوء الاستخدام.",
      "المنتجات المخصصة حسب الطلب.",
      "مرور أكثر من 7 أيام على الاستلام.",
    ],
  },
];

export default function Returns() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir="rtl">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-foreground mb-4">سياسة الإرجاع والاستبدال</h1>
          <div className="w-16 h-1 bg-primary mx-auto rounded mb-4"></div>
          <p className="text-muted-foreground">رضاكم التام هو أولويتنا. نحرص على تجربة تسوق خالية من القلق.</p>
        </div>

        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-black shrink-0">
                  {i + 1}
                </span>
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-secondary text-secondary-foreground rounded-2xl p-6 text-center">
          <p className="font-bold mb-3">هل لديك استفسار عن الإرجاع؟</p>
          <a
            href="https://wa.me/966500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            تواصل معنا عبر واتساب
          </a>
        </div>
      </div>
    </div>
  );
}
