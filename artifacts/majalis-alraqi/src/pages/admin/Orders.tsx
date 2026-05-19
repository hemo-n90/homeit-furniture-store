import { useState } from "react";
import { useListOrders, useGetOrder, useUpdateOrderStatus } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

const statusOptions = [
  { value: "new", label: "جديد", color: "bg-blue-100 text-blue-700" },
  { value: "processing", label: "قيد المعالجة", color: "bg-yellow-100 text-yellow-700" },
  { value: "shipped", label: "تم الشحن", color: "bg-purple-100 text-purple-700" },
  { value: "completed", label: "مكتمل", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "ملغي", color: "bg-red-100 text-red-700" },
];

function getStatusStyle(status: string) {
  return statusOptions.find(s => s.value === status) || { label: status, color: "bg-muted text-muted-foreground" };
}

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: orders, isLoading } = useListOrders({ limit: 100 });
  const updateStatus = useUpdateOrderStatus();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: selectedOrder } = useGetOrder(selectedId ?? 0, { query: { enabled: !!selectedId, queryKey: [`/api/orders/${selectedId}`] } });

  const handleStatusChange = (id: number, status: string) => {
    updateStatus.mutate(
      { id, data: { status: status as any } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
          toast({ title: "تم تحديث الحالة" });
        },
      }
    );
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <h1 className="text-2xl font-black text-foreground mb-6">إدارة الطلبات</h1>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">#</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">العميل</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">المدينة</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">المبلغ</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">الحالة</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">التاريخ</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">جاري التحميل...</td></tr>
                ) : orders?.orders?.map(order => {
                  const st = getStatusStyle(order.status);
                  return (
                    <tr key={order.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-foreground">#{order.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground" dir="ltr">{order.customerPhone}</p>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{order.city}</td>
                      <td className="px-5 py-4 font-bold text-primary">{parseFloat(String(order.totalAmount)).toLocaleString()} ر.س</td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onChange={e => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer ${st.color}`}
                        >
                          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => setSelectedId(order.id)} className="text-primary hover:underline text-sm font-semibold">
                          التفاصيل
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {!orders?.orders?.length && !isLoading && (
                  <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">لا توجد طلبات</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedId && selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black">تفاصيل الطلب #{selectedOrder.id}</h2>
                <button onClick={() => setSelectedId(null)} className="text-muted-foreground hover:text-foreground"><X size={22} /></button>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                {[
                  ["الاسم", selectedOrder.customerName],
                  ["الهاتف", selectedOrder.customerPhone],
                  ["المدينة", selectedOrder.city],
                  ["العنوان", selectedOrder.address],
                  ["الدفع", selectedOrder.paymentMethod === "cod" ? "الدفع عند الاستلام" : "بطاقة"],
                  ["الملاحظات", selectedOrder.notes || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-black text-base mb-3">المنتجات</h3>
              <div className="space-y-2 mb-5">
                {(selectedOrder as any).items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                    {item.productImage && <img src={item.productImage} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.productNameAr}</p>
                      <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-primary text-sm">{parseFloat(String(item.totalPrice)).toLocaleString()} ر.س</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 flex justify-between font-black text-lg">
                <span>الإجمالي</span>
                <span className="text-primary">{parseFloat(String(selectedOrder.totalAmount)).toLocaleString()} ر.س</span>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  );
}
