import { useState, useEffect } from "react";
import { useGetHomepageSettings, useUpdateHomepageSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { useToast } from "@/hooks/use-toast";

export default function AdminHomepage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: settings } = useGetHomepageSettings();
  const updateSettings = useUpdateHomepageSettings();
  const [form, setForm] = useState({
    heroTitleAr: "", heroDescriptionAr: "", heroImage: "",
    announcementBarAr: "", whatsappNumber: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        heroTitleAr: settings.heroTitleAr || "",
        heroDescriptionAr: settings.heroDescriptionAr || "",
        heroImage: settings.heroImage || "",
        announcementBarAr: settings.announcementBarAr || "",
        whatsappNumber: settings.whatsappNumber || "",
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(
      { data: { heroTitleAr: form.heroTitleAr, heroDescriptionAr: form.heroDescriptionAr, heroImage: form.heroImage || undefined, announcementBarAr: form.announcementBarAr, whatsappNumber: form.whatsappNumber } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/homepage-settings"] });
          toast({ title: "تم الحفظ بنجاح" });
        },
        onError: () => toast({ title: "حدث خطأ", variant: "destructive" }),
      }
    );
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <h1 className="text-2xl font-black text-foreground mb-6">إعدادات الصفحة الرئيسية</h1>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-black text-lg text-foreground">قسم البطل (Hero)</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">العنوان الرئيسي</label>
              <input
                value={form.heroTitleAr}
                onChange={e => setForm(f => ({ ...f, heroTitleAr: e.target.value }))}
                className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                placeholder="مجالس الراقي — أثاث عربي فاخر"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">الوصف</label>
              <textarea
                value={form.heroDescriptionAr}
                onChange={e => setForm(f => ({ ...f, heroDescriptionAr: e.target.value }))}
                rows={3}
                className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none resize-none"
                placeholder="نصنع أثاثاً فاخراً..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">رابط صورة الخلفية</label>
              <input
                value={form.heroImage}
                onChange={e => setForm(f => ({ ...f, heroImage: e.target.value }))}
                className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                dir="ltr"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-black text-lg text-foreground">إعدادات عامة</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">نص شريط الإعلان</label>
              <input
                value={form.announcementBarAr}
                onChange={e => setForm(f => ({ ...f, announcementBarAr: e.target.value }))}
                className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                placeholder="توصيل مجاني للطلبات فوق 2000 ريال"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">رقم واتساب</label>
              <input
                value={form.whatsappNumber}
                onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))}
                className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                dir="ltr"
                placeholder="966500000000"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updateSettings.isPending}
            className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black text-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {updateSettings.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
        </form>
      </AdminLayout>
    </AdminRoute>
  );
}
