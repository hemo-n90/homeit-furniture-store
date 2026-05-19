import { useState, useRef } from "react";
import { useListProducts, useDeleteProduct, useCreateProduct, useUpdateProduct, useListCategories } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X, Upload, Link as LinkIcon } from "lucide-react";

interface ProductForm {
  name: string; nameAr: string; description: string; descriptionAr: string;
  price: string; discountPrice: string; categoryId: string;
  inStock: boolean; isFeatured: boolean; isOnHomepage: boolean; isBestseller: boolean; badge: string;
}

const emptyForm: ProductForm = {
  name: "", nameAr: "", description: "", descriptionAr: "",
  price: "", discountPrice: "", categoryId: "",
  inStock: true, isFeatured: false, isOnHomepage: false, isBestseller: false, badge: "",
};

export default function AdminProducts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useListProducts({ limit: 100 });
  const { data: categories } = useListCategories();
  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  // Image management
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setForm(emptyForm);
    setImages([]);
    setUrlInput("");
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (p: any) => {
    setForm({
      name: p.name || "", nameAr: p.nameAr || "", description: p.description || "",
      descriptionAr: p.descriptionAr || "", price: String(p.price || ""),
      discountPrice: p.discountPrice ? String(p.discountPrice) : "",
      categoryId: String(p.categoryId || ""),
      inStock: p.inStock !== false, isFeatured: !!p.isFeatured,
      isOnHomepage: !!p.isOnHomepage, isBestseller: !!p.isBestseller, badge: p.badge || "",
    });
    setImages((p.images as string[]) || []);
    setUrlInput("");
    setEditId(p.id);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    deleteProduct.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/products"] });
        toast({ title: "تم الحذف بنجاح" });
      },
    });
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const token = localStorage.getItem("admin_token");
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(f => formData.append("images", f));
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.urls?.length) {
        setImages(prev => [...prev, ...data.urls]);
        toast({ title: `تم رفع ${data.urls.length} صورة بنجاح` });
      } else {
        toast({ title: data.error || "فشل الرفع", variant: "destructive" });
      }
    } catch {
      toast({ title: "خطأ في الاتصال بالسيرفر", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const addUrlImage = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http")) {
      toast({ title: "يرجى إدخال رابط صحيح يبدأ بـ http", variant: "destructive" });
      return;
    }
    setImages(prev => [...prev, url]);
    setUrlInput("");
  };

  const removeImage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nameAr) { toast({ title: "الاسم العربي مطلوب", variant: "destructive" }); return; }
    if (!form.price || isNaN(parseFloat(form.price))) { toast({ title: "السعر مطلوب", variant: "destructive" }); return; }
    if (!form.categoryId) { toast({ title: "يرجى اختيار الفئة", variant: "destructive" }); return; }

    const payload = {
      name: form.name || form.nameAr,
      nameAr: form.nameAr,
      description: form.description || undefined,
      descriptionAr: form.descriptionAr || undefined,
      price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
      categoryId: parseInt(form.categoryId),
      images,
      inStock: form.inStock,
      isFeatured: form.isFeatured,
      isOnHomepage: form.isOnHomepage,
      isBestseller: form.isBestseller,
      badge: form.badge || undefined,
    };

    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowModal(false);
      toast({ title: editId ? "تم تحديث المنتج ✓" : "تم إضافة المنتج ✓" });
    };
    const onError = () => toast({ title: "حدث خطأ. يرجى المحاولة مجدداً.", variant: "destructive" });

    if (editId) updateProduct.mutate({ id: editId, data: payload }, { onSuccess, onError });
    else createProduct.mutate({ data: payload }, { onSuccess, onError });
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-foreground">إدارة المنتجات</h1>
          <button
            onClick={openCreate}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} /> إضافة منتج
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">المنتج</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground hidden md:table-cell">الفئة</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">السعر</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground hidden sm:table-cell">الحالة</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">جاري التحميل...</td></tr>
                ) : data?.products?.map(p => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={(p.images as string[])?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&q=80"}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                          onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&q=80"; }}
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-[140px] sm:max-w-none">{p.nameAr}</p>
                          <p className="text-xs text-muted-foreground">{p.name || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground hidden md:table-cell">{p.categoryNameAr || "—"}</td>
                    <td className="px-5 py-4">
                      {p.discountPrice ? (
                        <div>
                          <p className="font-bold text-primary">{parseFloat(String(p.discountPrice)).toLocaleString()} ر.س</p>
                          <p className="text-xs text-muted-foreground line-through">{parseFloat(String(p.price)).toLocaleString()}</p>
                        </div>
                      ) : (
                        <span className="font-bold text-primary">{parseFloat(String(p.price)).toLocaleString()} ر.س</span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.inStock ? "متوفر" : "غير متوفر"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                          title="تعديل"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                          title="حذف"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!data?.products?.length && !isLoading && (
                  <tr><td colSpan={5} className="px-5 py-16 text-center text-muted-foreground">لا توجد منتجات. أضف منتجاً جديداً.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-card rounded-3xl w-full max-w-2xl my-4 shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-black text-foreground">
                  {editId ? "تعديل المنتج" : "إضافة منتج جديد"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground p-1">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">الاسم بالعربية *</label>
                    <input
                      required
                      value={form.nameAr}
                      onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))}
                      className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none text-sm"
                      placeholder="طقم مجلس عربي فاخر"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">الاسم بالإنجليزية</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none text-sm"
                      dir="ltr"
                      placeholder="Luxury Arabic Majlis Set"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">السعر (ر.س) *</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none text-sm"
                      dir="ltr"
                      placeholder="5000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">سعر الخصم (ر.س)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.discountPrice}
                      onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))}
                      className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none text-sm"
                      dir="ltr"
                      placeholder="اتركه فارغاً إن لم يكن هناك خصم"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-1.5">الفئة</label>
                    <select
                      value={form.categoryId}
                      onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                      className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none text-sm"
                    >
                      <option value="">— بدون فئة —</option>
                      {categories?.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold mb-1.5">الوصف بالعربية</label>
                    <textarea
                      value={form.descriptionAr}
                      onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))}
                      rows={3}
                      className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none text-sm resize-none"
                      placeholder="وصف تفصيلي للمنتج..."
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-semibold mb-3">صور المنتج</label>

                  {/* Upload Zone */}
                  <div
                    className="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); }}
                    onDrop={e => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}
                  >
                    <Upload size={28} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-semibold text-foreground mb-1">
                      {uploading ? "جاري الرفع..." : "اسحب الصور هنا أو اضغط للاختيار"}
                    </p>
                    <p className="text-xs text-muted-foreground">JPEG, PNG, WebP — حتى 10 MB لكل صورة</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={e => handleFileUpload(e.target.files)}
                    />
                  </div>

                  {/* URL Input */}
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addUrlImage())}
                      placeholder="أو أدخل رابط صورة مباشرة..."
                      className="flex-1 bg-muted/50 border border-border rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={addUrlImage}
                      className="bg-muted border border-border px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-muted/80 transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <LinkIcon size={14} /> إضافة
                    </button>
                  </div>

                  {/* Image Previews */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                      {images.map((img, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-muted">
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={e => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=60"; }}
                          />
                          {i === 0 && (
                            <div className="absolute top-1 right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                              رئيسية
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 left-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {images.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">لم تتم إضافة أي صور بعد</p>
                  )}
                </div>

                {/* Flags */}
                <div>
                  <label className="block text-sm font-semibold mb-3">خصائص المنتج</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: "inStock", label: "متوفر في المخزن" },
                      { key: "isFeatured", label: "منتج مميز" },
                      { key: "isOnHomepage", label: "عرض في الرئيسية" },
                      { key: "isBestseller", label: "الأكثر مبيعاً" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center gap-2 cursor-pointer rounded-xl border p-3 transition-all ${(form as any)[key] ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <input
                          type="checkbox"
                          checked={(form as any)[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                          className="accent-primary w-4 h-4 shrink-0"
                        />
                        <span className="text-xs font-medium leading-tight">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5">شارة مخصصة (اختياري)</label>
                  <input
                    value={form.badge}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                    className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none text-sm"
                    placeholder="مثل: جديد، حصري، محدود..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-border">
                  <button
                    type="submit"
                    disabled={createProduct.isPending || updateProduct.isPending || uploading}
                    className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-xl font-black hover:bg-primary/90 transition-colors disabled:opacity-70"
                  >
                    {createProduct.isPending || updateProduct.isPending
                      ? "جاري الحفظ..."
                      : editId ? "حفظ التعديلات" : "إضافة المنتج"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 border border-border rounded-xl font-bold hover:bg-muted transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  );
}
