import { useState, useEffect } from "react";
import { useGetHomepageSettings, useUpdateHomepageSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, GripVertical, Upload, Image } from "lucide-react";
import { HERO_IMAGES } from "@/lib/images";

interface HeroSlide {
  image: string;
  titleAr?: string;
  descriptionAr?: string;
}

const DEFAULT_SLIDE_IMAGES = HERO_IMAGES;

export default function AdminHomepage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: settings } = useGetHomepageSettings();
  const updateSettings = useUpdateHomepageSettings();

  const [announcementBarAr, setAnnouncementBarAr] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([
    { image: DEFAULT_SLIDE_IMAGES[0], titleAr: "هوميت للأثاث — أثاث منزلي فاخر", descriptionAr: "نصنع لك أثاثاً يعكس ذوقك الرفيع ويليق بمنزلك الجميل" },
    { image: DEFAULT_SLIDE_IMAGES[1], titleAr: "تشكيلة الكنبات الفاخرة", descriptionAr: "أناقة لا مثيل لها — مصنوعة بأرقى الأقمشة وأجود الخامات" },
    { image: DEFAULT_SLIDE_IMAGES[2], titleAr: "ديكور راقٍ يليق بمنزلك", descriptionAr: "اكتشف تشكيلتنا الحصرية من الأثاث المنزلي الفاخر" },
  ]);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    if (settings) {
      setAnnouncementBarAr(settings.announcementBarAr || "");
      setWhatsappNumber(settings.whatsappNumber || "");
      setLogoUrl((settings as any).logoUrl || "");
      if (settings.heroImage) {
        try {
          const parsed = JSON.parse(settings.heroImage);
          if (Array.isArray(parsed) && parsed.length > 0) setSlides(parsed);
        } catch {
          if (settings.heroImage.startsWith("http")) {
            setSlides([{ image: settings.heroImage, titleAr: settings.heroTitleAr || "", descriptionAr: settings.heroDescriptionAr || "" }]);
          }
        }
      }
    }
  }, [settings]);

  const uploadFile = async (file: File): Promise<string | null> => {
    const token = localStorage.getItem("admin_token");
    const formData = new FormData();
    formData.append("images", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    return data.urls?.[0] || null;
  };

  const handleLogoUpload = async (file: File) => {
    setLogoUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) {
        setLogoUrl(url);
        toast({ title: "تم رفع الشعار بنجاح" });
      }
    } catch {
      toast({ title: "فشل رفع الشعار", variant: "destructive" });
    } finally {
      setLogoUploading(false);
    }
  };

  const handleImageUpload = async (i: number, file: File) => {
    setUploading(i);
    try {
      const url = await uploadFile(file);
      if (url) {
        updateSlide(i, "image", url);
        toast({ title: "تم رفع الصورة بنجاح" });
      }
    } catch {
      toast({ title: "فشل رفع الصورة", variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const addSlide = () => setSlides(s => [...s, { image: "", titleAr: "", descriptionAr: "" }]);
  const removeSlide = (i: number) => setSlides(s => s.filter((_, idx) => idx !== i));
  const updateSlide = (i: number, field: keyof HeroSlide, value: string) =>
    setSlides(s => s.map((slide, idx) => idx === i ? { ...slide, [field]: value } : slide));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const validSlides = slides.filter(s => s.image);
    updateSettings.mutate(
      {
        data: {
          heroImage: JSON.stringify(validSlides),
          announcementBarAr,
          whatsappNumber,
          logoUrl: logoUrl || undefined,
        } as any,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/homepage"] });
          toast({ title: "تم الحفظ بنجاح ✓" });
        },
        onError: () => toast({ title: "حدث خطأ أثناء الحفظ", variant: "destructive" }),
      }
    );
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <h1 className="text-2xl font-black text-foreground mb-6">إعدادات الصفحة الرئيسية</h1>

        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">

          {/* Logo Upload */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-black text-lg text-foreground mb-1">شعار المتجر</h2>
            <p className="text-sm text-muted-foreground mb-5">يظهر في شريط التنقل والتذييل. يُنصح بصورة شفافة PNG بخلفية شفافة.</p>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Logo Preview */}
              <div className="shrink-0">
                <div className="w-28 h-28 border-2 border-dashed border-border rounded-2xl flex items-center justify-center bg-muted/50 overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2"
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Image size={28} className="mx-auto mb-1 opacity-40" />
                      <p className="text-xs">الشعار</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {/* Upload from device */}
                <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-primary/40 rounded-xl p-4 cursor-pointer hover:bg-primary/5 transition-colors">
                  <Upload size={18} className="text-primary" />
                  <span className="text-sm font-bold text-primary">
                    {logoUploading ? "جاري الرفع..." : "رفع شعار من الجهاز / الكاميرا"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    disabled={logoUploading}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }}
                  />
                </label>

                {/* Or URL */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">أو أدخل رابط الشعار</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={e => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="flex-1 bg-muted/50 border border-border rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                      dir="ltr"
                    />
                    {logoUrl && (
                      <button type="button" onClick={() => setLogoUrl("")}
                        className="px-3 py-2 text-muted-foreground hover:text-destructive border border-border rounded-xl transition-colors text-sm">
                        حذف
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Slider Slides */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-lg text-foreground">شرائح السلايدر (Hero Slider)</h2>
              <button type="button" onClick={addSlide}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                <Plus size={16} /> إضافة شريحة
              </button>
            </div>

            <div className="space-y-5">
              {slides.map((slide, i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical size={16} className="text-muted-foreground" />
                      <span className="font-bold text-sm text-foreground">الشريحة {i + 1}</span>
                    </div>
                    <button type="button" onClick={() => removeSlide(i)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">صورة الشريحة</label>
                      <div className="flex gap-2">
                        <input type="text" value={slide.image} onChange={e => updateSlide(i, "image", e.target.value)}
                          placeholder="https://... أو ارفع صورة"
                          className="flex-1 bg-background border border-border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary outline-none" dir="ltr" />
                        <label className="shrink-0 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-2 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors whitespace-nowrap flex items-center gap-1.5">
                          {uploading === i ? "جاري الرفع..." : "رفع صورة"}
                          <input type="file" accept="image/*" className="hidden"
                            onChange={e => { const file = e.target.files?.[0]; if (file) handleImageUpload(i, file); }} />
                        </label>
                      </div>
                      {slide.image && (
                        <img src={slide.image} alt="" className="mt-2 w-full h-28 object-cover rounded-lg border border-border"
                          onError={e => (e.currentTarget.style.display = "none")} />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">العنوان</label>
                      <input type="text" value={slide.titleAr || ""} onChange={e => updateSlide(i, "titleAr", e.target.value)}
                        placeholder="عنوان الشريحة"
                        className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">الوصف</label>
                      <input type="text" value={slide.descriptionAr || ""} onChange={e => updateSlide(i, "descriptionAr", e.target.value)}
                        placeholder="وصف الشريحة"
                        className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                  </div>
                </div>
              ))}

              {slides.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-6">
                  لا توجد شرائح. أضف شريحة جديدة أو ستُستخدم الصور الافتراضية.
                </p>
              )}
            </div>
          </div>

          {/* General Settings */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="font-black text-lg text-foreground">إعدادات عامة</h2>
            <div>
              <label className="block text-sm font-semibold mb-2">نص شريط الإعلان</label>
              <input value={announcementBarAr} onChange={e => setAnnouncementBarAr(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                placeholder="توصيل مجاني للطلبات فوق 2000 ريال ✦ عروض خاصة طوال الأسبوع" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">رقم واتساب (بدون +)</label>
              <input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                dir="ltr" placeholder="966500000000" />
            </div>
          </div>

          <button type="submit" disabled={updateSettings.isPending}
            className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-black text-lg hover:bg-primary/90 transition-colors disabled:opacity-70">
            {updateSettings.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
        </form>
      </AdminLayout>
    </AdminRoute>
  );
}
