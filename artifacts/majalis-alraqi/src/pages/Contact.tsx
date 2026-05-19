import { useState } from "react";
import { useSendContactMessage, useGetHomepageSettings } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
  const { data: settings } = useGetHomepageSettings();
  const sendMessage = useSendContactMessage();
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const whatsapp = settings?.whatsappNumber || "966500000000";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast({ title: t.contact.fillRequired, variant: "destructive" });
      return;
    }
    sendMessage.mutate(
      { data: { name: form.name, email: form.email || undefined, phone: form.phone || undefined, message: form.message } },
      {
        onSuccess: () => {
          setSent(true);
          setForm({ name: "", email: "", phone: "", message: "" });
          toast({ title: t.contact.successToast, description: t.contact.successToastDesc });
        },
        onError: () => toast({ title: t.contact.errorSending, variant: "destructive" }),
      }
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir={dir}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-black text-foreground mb-4">{t.contact.title}</h1>
          <div className="w-16 h-1 bg-primary mx-auto rounded mb-4"></div>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t.contact.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: dir === "rtl" ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-5">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-600 text-white rounded-2xl p-5 hover:bg-green-700 transition-colors">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0"><MessageCircle size={24} /></div>
              <div>
                <p className="font-black text-lg">{t.contact.whatsapp}</p>
                <p className="text-white/80 text-sm" dir="ltr">+{whatsapp}</p>
              </div>
            </a>

            {[
              { icon: Phone, title: t.contact.phone, value: "+966 50 000 0000", isLtr: true },
              { icon: Mail, title: t.contact.email, value: "info@homeitfurniture.com", isLtr: true },
              { icon: MapPin, title: t.contact.location, value: t.contact.locationValue, isLtr: false },
            ].map(({ icon: Icon, title, value, isLtr }, i) => (
              <div key={i} className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-black text-lg text-foreground">{title}</p>
                  <p className="text-muted-foreground text-sm" dir={isLtr ? "ltr" : undefined}>{value}</p>
                </div>
              </div>
            ))}

            <div className="bg-muted/50 rounded-2xl p-5 text-sm text-muted-foreground">
              <p className="font-bold text-foreground mb-2">{t.contact.hours}</p>
              <p>{t.contact.hoursValue1}</p>
              <p>{t.contact.hoursValue2}</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
            {sent ? (
              <div className="bg-card border border-border rounded-3xl p-10 text-center h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={36} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-foreground mb-3">{t.contact.successTitle}</h2>
                <p className="text-muted-foreground mb-6">{t.contact.successDesc}</p>
                <button onClick={() => setSent(false)} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                  {t.contact.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 space-y-5">
                <h2 className="text-2xl font-black text-foreground mb-6">{t.contact.formTitle}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.contact.nameRequired}</label>
                    <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder={t.contact.namePlaceholder}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">{t.contact.phoneField}</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder={t.contact.phonePlaceholder}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all" dir="ltr" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-2">{t.contact.emailField}</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder={t.contact.emailPlaceholder}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all" dir="ltr" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-2">{t.contact.message}</label>
                    <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder={t.contact.messagePlaceholder} rows={5}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none" />
                  </div>
                </div>
                <button type="submit" disabled={sendMessage.isPending}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black text-lg hover:bg-primary/90 transition-colors disabled:opacity-70">
                  {sendMessage.isPending ? t.contact.sending : t.contact.send}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
