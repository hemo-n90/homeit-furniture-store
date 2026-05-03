import { useState } from "react";
import { useListCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface CategoryForm { name: string; nameAr: string; slug: string; image: string; }
const emptyForm: CategoryForm = { name: "", nameAr: "", slug: "", image: "" };

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: categories, isLoading } = useListCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (c: any) => {
    setForm({ name: c.name || "", nameAr: c.nameAr || "", slug: c.slug || "", image: c.image || "" });
    setEditId(c.id); setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("هل أنت متأكد؟")) return;
    deleteCategory.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/categories"] }); toast({ title: "تم الحذف" }); },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const onSuccess = () => { queryClient.invalidateQueries({ queryKey: ["/api/categories"] }); setShowModal(false); toast({ title: editId ? "تم التحديث" : "تم الإضافة" }); };
    if (editId) updateCategory.mutate({ id: editId, data: { name: form.name, nameAr: form.nameAr, slug: form.slug, image: form.image || undefined } }, { onSuccess });
    else createCategory.mutate({ data: { name: form.name, nameAr: form.nameAr, slug: form.slug, image: form.image || undefined } }, { onSuccess });
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-foreground">إدارة الفئات</h1>
          <button onClick={openCreate} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus size={18} /> إضافة فئة
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? [1,2,3].map(i => <div key={i} className="animate-pulse bg-card rounded-2xl h-40 border"></div>) :
            categories?.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden flex items-center gap-4 p-4">
                <img
                  src={c.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80"}
                  alt={c.nameAr}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-foreground truncate">{c.nameAr}</h3>
                  <p className="text-sm text-muted-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{(c as any).productCount || 0} منتج</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => openEdit(c)} className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-3xl w-full max-w-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black">{editId ? "تعديل الفئة" : "إضافة فئة جديدة"}</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={22} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">الاسم بالعربية *</label>
                  <input required value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">الاسم بالإنجليزية</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">الرابط (Slug) *</label>
                  <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none" dir="ltr" placeholder="majalis" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">رابط الصورة</label>
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="w-full bg-muted/50 border border-border rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none" dir="ltr" placeholder="https://..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-black hover:bg-primary/90 transition-colors">
                    {editId ? "حفظ" : "إضافة"}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 border border-border rounded-xl font-bold hover:bg-muted transition-colors">إلغاء</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  );
}
