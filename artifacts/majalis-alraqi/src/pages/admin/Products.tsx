import { useState } from "react";
import { useListProducts, useDeleteProduct, useCreateProduct, useUpdateProduct, useListCategories } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface ProductForm {
  name: string; nameAr: string; description: string; descriptionAr: string;
  price: string; discountPrice: string; categoryId: string; images: string;
  inStock: boolean; isFeatured: boolean; isOnHomepage: boolean; isBestseller: boolean; badge: string;
}

const emptyForm: ProductForm = {
  name: "", nameAr: "", description: "", descriptionAr: "",
  price: "", discountPrice: "", categoryId: "", images: "",
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

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (p: any) => {
    setForm({
      name: p.name || "", nameAr: p.nameAr || "", description: p.description || "",
      descriptionAr: p.descriptionAr || "", price: String(p.price || ""), discountPrice: String(p.discountPrice || ""),
      categoryId: String(p.categoryId || ""), images: (p.images || []).join("\n"),
      inStock: p.inStock !== false, isFeatured: !!p.isFeatured, isOnHomepage: !!p.isOnHomepage,
      isBestseller: !!p.isBestseller, badge: p.badge || "",
    });
    setEditId(p.id); setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    deleteProduct.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/products"] }); toast({ title: "تم الحذف" }); },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const images = form.images.split("\n").map(s => s.trim()).filter(Boolean);
    const payload = {
      name: form.name, nameAr: form.nameAr, description: form.description || undefined,
      descriptionAr: form.descriptionAr || undefined, price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      images, inStock: form.inStock, isFeatured: form.isFeatured,
      isOnHomepage: form.isOnHomepage, isBestseller: form.isBestseller,
      badge: form.badge || undefined,
    };
    const onSuccess = () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowModal(false);
      toast({ title: editId ? "تم التحديث" : "تم الإضافة" });
    };
    if (editId) updateProduct.mutate({ id: editId, data: payload }, { onSuccess });
    else createProduct.mutate({ data: payload }, { onSuccess });
  };

  const adminToken = localStorage.getItem("admin_token");
  const authHeader = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-foreground">إدارة المنتجات</h1>
          <button onClick={openCreate} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus size={18} /> إضافة منتج
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">المنتج</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">الفئة</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">السعر</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">الحالة</th>
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
                        <img src={(p.images as string[])?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=60&q=80"} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-foreground">{p.nameAr}</p>
                          <p className="text-xs text-muted-foreground">{p.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{p.categoryNameAr || "—"}</td>
                    <td className="px-5 py-4">
                      {p.discountPrice ? (
                        <div>
                          <span className="font-bold text-primary">{parseFloat(String(p.discountPrice)).toLocaleString()} ر.س</span>
                          <span className="text-xs text-muted-foreground line-through mr-2">{parseFloat(String(p.price)).toLocaleString()}</span>
                        </div>
                      ) : <span className="font-bold text-primary">{parseFloat(String(p.price)).toLocaleString()} ر.س</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.inStock ? "متوفر" : "غير متوفر"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-foreground">{editId ? "تعديل المنتج" : "إضافة منتج جديد"}</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={22} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">الاسم بالعربية *</label>
                    <input required value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">الاسم بالإنجليزية</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">السعر (ر.س) *</label>
                    <input required type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">سعر الخصم (ر.س)</label>
                    <input type="number" step="0.01" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none" dir="ltr" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">الفئة</label>
                  <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none">
                    <option value="">بدون فئة</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">الوصف بالعربية</label>
                  <textarea value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} rows={3} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">روابط الصور (كل رابط في سطر)</label>
                  <textarea value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} rows={3} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none resize-none" dir="ltr" placeholder="https://example.com/image.jpg" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: "inStock", label: "متوفر" },
                    { key: "isFeatured", label: "مميز" },
                    { key: "isOnHomepage", label: "الرئيسية" },
                    { key: "isBestseller", label: "الأكثر مبيعاً" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="accent-primary w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={createProduct.isPending || updateProduct.isPending} className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-black hover:bg-primary/90 transition-colors disabled:opacity-70">
                    {editId ? "حفظ التعديلات" : "إضافة المنتج"}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 border border-border rounded-xl font-bold hover:bg-muted transition-colors">
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
