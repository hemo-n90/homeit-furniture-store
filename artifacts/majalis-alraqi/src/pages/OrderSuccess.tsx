import { useParams, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag, Phone } from "lucide-react";

export default function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || "0");
  const { data: order } = useGetOrder(orderId, { query: { enabled: !!orderId } });

  const statusMap: Record<string, string> = {
    new: "طلب جديد",
    processing: "قيد المعالجة",
    shipped: "تم الشحن",
    completed: "مكتمل",
    cancelled: "ملغي",
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background flex items-center justify-center" dir="rtl">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-3xl p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} className="text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-black text-foreground mb-2">تم تأكيد طلبك!</h1>
          <p className="text-muted-foreground mb-2">رقم الطلب: <span className="font-bold text-foreground">#{orderId}</span></p>
          <p className="text-muted-foreground mb-8">سنتواصل معك قريباً لتأكيد موعد التوصيل.</p>

          {order && (
            <div className="bg-muted/50 rounded-2xl p-6 text-right mb-8">
              <h2 className="font-black text-lg text-foreground mb-4 text-center">تفاصيل الطلب</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الاسم:</span>
                  <span className="font-semibold">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الهاتف:</span>
                  <span className="font-semibold" dir="ltr">{order.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المدينة:</span>
                  <span className="font-semibold">{order.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">طريقة الدفع:</span>
                  <span className="font-semibold">{order.paymentMethod === "cod" ? "الدفع عند الاستلام" : "بطاقة ائتمانية"}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="text-muted-foreground">الإجمالي:</span>
                  <span className="font-black text-primary text-lg">{parseFloat(String(order.totalAmount)).toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              <ShoppingBag size={18} />
              متابعة التسوق
            </Link>
            <Link href="/" className="border border-border text-foreground px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted transition-colors">
              الرئيسية
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
