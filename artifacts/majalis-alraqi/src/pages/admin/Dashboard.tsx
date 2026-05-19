import { useGetProductStats, useGetOrderStats, useListOrders } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { motion } from "framer-motion";
import { Package, ShoppingCart, DollarSign, AlertCircle } from "lucide-react";
import { Link } from "wouter";

const statusMap: Record<string, { label: string; color: string }> = {
  new: { label: "جديد", color: "bg-blue-100 text-blue-700" },
  processing: { label: "قيد المعالجة", color: "bg-yellow-100 text-yellow-700" },
  shipped: { label: "تم الشحن", color: "bg-purple-100 text-purple-700" },
  completed: { label: "مكتمل", color: "bg-green-100 text-green-700" },
  cancelled: { label: "ملغي", color: "bg-red-100 text-red-700" },
};

export default function AdminDashboard() {
  const { data: productStats } = useGetProductStats();
  const { data: orderStats } = useGetOrderStats();
  const { data: orders } = useListOrders({ limit: 5 });

  const newOrdersCount = orderStats?.byStatus?.find(s => s.status === "new")?.count ?? 0;

  const stats = [
    { label: "إجمالي المنتجات", value: productStats?.total ?? "—", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "إجمالي الطلبات", value: orderStats?.totalOrders ?? "—", icon: ShoppingCart, color: "text-green-600", bg: "bg-green-50" },
    { label: "طلبات جديدة", value: newOrdersCount, icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "إيرادات المبيعات", value: orderStats?.totalRevenue ? `${parseFloat(String(orderStats.totalRevenue)).toLocaleString()} ر.س` : "—", icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <AdminRoute>
      <AdminLayout>
        <h1 className="text-2xl font-black text-foreground mb-6">لوحة التحكم</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
            >
              <div className={`${bg} ${color} w-14 h-14 rounded-2xl flex items-center justify-center shrink-0`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-black text-foreground">آخر الطلبات</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline font-semibold">
              عرض الكل
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">#</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">العميل</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">المبلغ</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">الحالة</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {orders?.orders?.map((order) => {
                  const status = statusMap[order.status] || { label: order.status, color: "bg-muted text-muted-foreground" };
                  return (
                    <tr key={order.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-foreground">#{order.id}</td>
                      <td className="px-5 py-4 text-foreground">{order.customerName}</td>
                      <td className="px-5 py-4 font-bold text-primary">{parseFloat(String(order.totalAmount)).toLocaleString()} ر.س</td>
                      <td className="px-5 py-4">
                        <span className={`${status.color} text-xs font-bold px-3 py-1 rounded-full`}>{status.label}</span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                    </tr>
                  );
                })}
                {!orders?.orders?.length && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">لا توجد طلبات بعد</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
