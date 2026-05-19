import { useParams, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function OrderSuccess() {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || "0");
  const { data: order } = useGetOrder(orderId, { query: { enabled: !!orderId } });
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background flex items-center justify-center" dir={dir}>
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-3xl p-10 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-black text-foreground mb-2">{t.orderSuccess.confirmed}</h1>
          <p className="text-muted-foreground mb-2">
            {t.orderSuccess.orderNumber}: <span className="font-bold text-foreground">#{orderId}</span>
          </p>
          <p className="text-muted-foreground mb-8">{t.orderSuccess.willContact}</p>

          {order && (
            <div className={`bg-muted/50 rounded-2xl p-6 ${dir === "rtl" ? "text-right" : "text-left"} mb-8`}>
              <h2 className="font-black text-lg text-foreground mb-4 text-center">{t.orderSuccess.orderDetails}</h2>
              <div className="space-y-2 text-sm">
                {[
                  { label: t.orderSuccess.name, value: order.customerName },
                  { label: t.orderSuccess.phone, value: order.customerPhone, ltr: true },
                  { label: t.orderSuccess.city, value: order.city },
                  { label: t.orderSuccess.payment, value: order.paymentMethod === "cod" ? t.orderSuccess.cod : t.orderSuccess.card },
                ].map(({ label, value, ltr }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}:</span>
                    <span className="font-semibold" dir={ltr ? "ltr" : undefined}>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="text-muted-foreground">{t.orderSuccess.total}:</span>
                  <span className="font-black text-primary text-lg">
                    {parseFloat(String(order.totalAmount)).toLocaleString()} {dir === "rtl" ? "ر.س" : "SAR"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              <ShoppingBag size={18} />
              {t.orderSuccess.continueShopping}
            </Link>
            <Link href="/" className="border border-border text-foreground px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted transition-colors">
              {t.orderSuccess.home}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
