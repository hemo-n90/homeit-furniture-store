import { useState } from "react";
import { useSendContactMessage, useGetHomepageSettings } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

export default function Contact() {
  const { data: settings } = useGetHomepageSettings();
  const sendMessage = useSendContactMessage();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast({ title: "يرجى ملء الاسم والرسالة", variant: "destructive" });
      return;
    }
    sendMessage.mutate(
      { data: { name: form.name, email: form.email || undefined, phone: form.phone || undefined, message: form.message } },
      {
        onSuccess: () => {
          setSent(true);
          setForm({ name: "", email: "", phone: "", message: "" });
          toast({ title: "تم إرسال رسالتك بنجاح!", description: "سنرد عليك في أقرب وقت ممكن." });
        },
        onError: () => toast({ title: "حدث خطأ. يرجى المحاولة مجدداً.", variant: "destructive" }),
      }
    );
  };

  const whatsapp = settings?.whatsappNumber || "966500000000";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir="rtl">
      {/* Hero */}
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-black text-foreground mb-4">تواصل معنا</h1>
          <div className="w-16 h-1 bg-primary mx-auto rounded mb-4"></div>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">نحن هنا لمساعدتك. تواصل معنا بأي طريقة تناسبك.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-5"
          >
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-600 text-white rounded-2xl p-5 hover:bg-green-700 transition-colors"
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="font-black text-lg">واتساب</p>
                <p className="text-white/80 text-sm" dir="ltr">+{whatsapp}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-black text-lg text-foreground">هاتف</p>
                <p className="text-muted-foreground text-sm" dir="ltr">+966 50 000 0000</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Mail size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-black text-lg text-foreground">البريد الإلكتروني</p>
                <p className="text-muted-foreground text-sm" dir="ltr">info@majalis-alraqi.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-black text-lg text-foreground">الموقع</p>
                <p className="text-muted-foreground text-sm">الرياض، المملكة العربية السعودية</p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-2xl p-5 text-sm text-muted-foreground">
              <p className="font-bold text-foreground mb-2">ساعات العمل</p>
              <p>السبت – الخميس: 9 صباحاً – 10 مساءً</p>
              <p>الجمعة: 4 مساءً – 10 مساءً</p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <div className="bg-card border border-border rounded-3xl p-10 text-center h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={36} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-foreground mb-3">تم إرسال رسالتك!</h2>
                <p className="text-muted-foreground mb-6">سنرد عليك في أقرب وقت ممكن. شكراً لتواصلك معنا.</p>
                <button onClick={() => setSent(false)} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-3xl p-8 space-y-5">
                <h2 className="text-2xl font-black text-foreground mb-6">أرسل لنا رسالة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">الاسم *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="اسمك الكريم"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="05XXXXXXXX"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="example@email.com"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-2">الرسالة *</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="كيف يمكننا مساعدتك؟"
                      rows={5}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={sendMessage.isPending}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black text-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {sendMessage.isPending ? "جاري الإرسال..." : "إرسال الرسالة"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
