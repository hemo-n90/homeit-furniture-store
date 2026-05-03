import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useCreateOrder } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, totalAmount, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    city: "",
    address: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone || !form.city || !form.address) {
      toast({ title: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "السلة فارغة", variant: "destructive" });
      return;
    }

    createOrder.mutate(
      {
        data: {
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          city: form.city,
          address: form.address,
          notes: form.notes || undefined,
          paymentMethod,
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
        },
      },
      {
        onSuccess: (order) => {
          clearCart();
          setLocation(`/order-success/${order.id}`);
        },
        onError: () => {
          toast({ title: "حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مجددًا.", variant: "destructive" });
        },
      }
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <ShoppingBag size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-2xl font-bold text-muted-foreground mb-4">سلة التسوق فارغة</p>
          <Link href="/products" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold">تسوق الآن</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background" dir="rtl">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-black text-foreground mb-8">إتمام الطلب</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="text-xl font-black text-foreground mb-5">معلومات التوصيل</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">الاسم الكامل *</label>
                    <input
                      type="text"
                      required
                      value={form.customerName}
                      onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
                      placeholder="أدخل اسمك الكامل"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">رقم الهاتف *</label>
                    <input
                      type="tel"
                      required
                      value={form.customerPhone}
                      onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
                      placeholder="05XXXXXXXX"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">المدينة *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                      placeholder="الرياض"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-foreground mb-2">العنوان التفصيلي *</label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="الحي، الشارع، رقم المبنى"
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-foreground mb-2">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="أي تعليمات خاصة للتوصيل..."
                      rows={3}
                      className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Payment */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="text-xl font-black text-foreground mb-5">طريقة الدفع</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-primary w-5 h-5"
                    />
                    <div>
                      <p className="font-bold text-foreground">الدفع عند الاستلام</p>
                      <p className="text-sm text-muted-foreground">ادفع نقداً أو بالبطاقة عند استلام طلبك</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-border cursor-not-allowed opacity-60">
                    <input type="radio" name="payment" value="card" disabled className="w-5 h-5" />
                    <div>
                      <p className="font-bold text-foreground">بطاقة ائتمانية / مدى</p>
                      <p className="text-sm text-muted-foreground">قريباً</p>
                    </div>
                    <span className="mr-auto bg-muted text-muted-foreground text-xs font-bold px-3 py-1 rounded-full">قريباً</span>
                  </label>
                </div>
              </motion.div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-28">
                <h2 className="text-xl font-black text-foreground mb-5">ملخص الطلب</h2>

                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                  {items.map(({ product, quantity }) => {
                    const price = parseFloat(String(product.discountPrice || product.price));
                    const images = (product.images as string[]) || [];
                    return (
                      <div key={product.id} className="flex items-center gap-3">
                        <img
                          src={images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&q=80"}
                          alt={product.nameAr}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{product.nameAr}</p>
                          <p className="text-xs text-muted-foreground">الكمية: {quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-primary shrink-0">{(price * quantity).toLocaleString()} ر.س</p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 border-t border-border pt-4 mb-6">
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>المجموع الفرعي</span>
                    <span>{totalAmount.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>الشحن</span>
                    <span className="text-green-600 font-semibold">{totalAmount >= 2000 ? "مجاني" : "يُحدد"}</span>
                  </div>
                  <div className="flex justify-between font-black text-lg text-foreground pt-2">
                    <span>الإجمالي</span>
                    <span className="text-primary">{totalAmount.toLocaleString()} ر.س</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createOrder.isPending}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {createOrder.isPending ? "جاري المعالجة..." : "تأكيد الطلب"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
