import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGetHomepageSettings } from "@workspace/api-client-react";

export default function Returns() {
  const { t, dir } = useLanguage();
  const { data: settings } = useGetHomepageSettings();
  const whatsapp = settings?.whatsappNumber || "966500000000";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir={dir}>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-foreground mb-4">{t.returns.title}</h1>
          <div className="w-16 h-1 bg-primary mx-auto rounded mb-4"></div>
          <p className="text-muted-foreground">{t.returns.subtitle}</p>
        </div>

        <div className="space-y-6">
          {t.returns.sections.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6">
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
          <p className="font-bold mb-3">{t.returns.hasQuestion}</p>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
            {t.returns.contactBtn}
          </a>
        </div>
      </div>
    </div>
  );
}
