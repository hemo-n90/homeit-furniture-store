import { useState, useEffect } from "react";
import { useGetHomepageSettings, useUpdateHomepageSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface HeroSlide {
  image: string;
  titleAr?: string;
  descriptionAr?: string;
}

const DEFAULT_SLIDE_IMAGES = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&q=90",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=90",
  "https://images.unsplash.com/photo-1567016520496-0cb37d8467a7?w=1920&q=90",
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=90",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=90",
];

export default function AdminHomepage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: settings } = useGetHomepageSettings();
  const updateSettings = useUpdateHomepageSettings();

  const [announcementBarAr, setAnnouncementBarAr] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [slides, setSlides] = useState<HeroSlide[]>([
    { image: DEFAULT_SLIDE_IMAGES[0], titleAr: "مجالس الراقي — أثاث عربي فاخر", descriptionAr: "نصنع لك مجالس وأثاثاً يعكس ذوقك الرفيع ويليق بضيوفك" },
    { image: DEFAULT_SLIDE_IMAGES[1], titleAr: "تشكيلة الكنبات الفاخرة", descriptionAr: "أناقة لا مثيل لها — مصنوعة بأرقى الأقمشة وأجود الخامات" },
    { image: DEFAULT_SLIDE_IMAGES[2], titleAr: "ديكور راقٍ يليق بمنزلك", descriptionAr: "اكتشف تشكيلتنا الحصرية من الأثاث المنزلي الفاخر" },
  ]);
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    if (settings) {
      setAnnouncementBarAr(settings.announcementBarAr || "");
      setWhatsappNumber(settings.whatsappNumber || "");
      if (settings.heroImage) {
        try {
          const parsed = JSON.parse(settings.heroImage);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(parsed);
          }
        } catch {
          if (settings.heroImage.startsWith("http")) {
            setSlides([{ image: settings.heroImage, titleAr: settings.heroTitleAr || "", descriptionAr: settings.heroDescriptionAr || "" }]);
          }
        }
      }
    }
  }, [settings]);

  const addSlide = () => {
    setSlides(s => [...s, { image: "", titleAr: "", descriptionAr: "" }]);
  };

  const removeSlide = (i: number) => {
    setSlides(s => s.filter((_, idx) => idx !== i));
  };

  const updateSlide = (i: number, field: keyof HeroSlide, value: string) => {
    setSlides(s => s.map((slide, idx) => idx === i ? { ...slide, [field]: value } : slide));
  };

  const handleImageUpload = async (i: number, file: File) => {
    const token = localStorage.getItem("admin_token");
    const formData = new FormData();
    formData.append("images", file);
    setUploading(i);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.urls?.[0]) {
        updateSlide(i, "image", data.urls[0]);
        toast({ title: "تم رفع الصورة بنجاح" });
      }
    } catch {
      toast({ title: "فشل رفع الصورة", variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const validSlides = slides.filter(s => s.image);
    updateSettings.mutate(
      {
        data: {
          heroImage: JSON.stringify(validSlides),
          announcementBarAr,
          whatsappNumber,
        },
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
          {/* Hero Slider Slides */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-lg text-foreground">شرائح السلايدر (Hero Slider)</h2>
              <button
                type="button"
                onClick={addSlide}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
              >
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
                    <button
                      type="button"
                      onClick={() => removeSlide(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Image */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">صورة الشريحة</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={slide.image}
                          onChange={e => updateSlide(i, "image", e.target.value)}
                          placeholder="https://... أو ارفع صورة"
                          className="flex-1 bg-background border border-border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                          dir="ltr"
                        />
                        <label className="shrink-0 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-2 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors whitespace-nowrap flex items-center gap-1.5">
                          {uploading === i ? "جاري الرفع..." : "رفع صورة"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(i, file);
                            }}
                          />
                        </label>
                      </div>
                      {slide.image && (
                        <img
                          src={slide.image}
                          alt=""
                          className="mt-2 w-full h-28 object-cover rounded-lg border border-border"
                          onError={e => (e.currentTarget.style.display = "none")}
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">العنوان</label>
                      <input
                        type="text"
                        value={slide.titleAr || ""}
                        onChange={e => updateSlide(i, "titleAr", e.target.value)}
                        placeholder="عنوان الشريحة"
                        className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-muted-foreground">الوصف</label>
                      <input
                        type="text"
                        value={slide.descriptionAr || ""}
                        onChange={e => updateSlide(i, "descriptionAr", e.target.value)}
                        placeholder="وصف الشريحة"
                        className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                      />
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
              <input
                value={announcementBarAr}
                onChange={e => setAnnouncementBarAr(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none"
                placeholder="توصيل مجاني للطلبات فوق 2000 ريال ✦ عروض خاصة طوال الأسبوع"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">رقم واتساب (بدون +)</label>
              <input
                value={whatsappNumber}
                onChange={e => setWhatsappNumber(e.target.value)}
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
