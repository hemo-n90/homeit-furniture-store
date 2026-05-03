import { useListContactMessages } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { MessageSquare } from "lucide-react";

export default function AdminMessages() {
  const { data: messages, isLoading } = useListContactMessages();

  return (
    <AdminRoute>
      <AdminLayout>
        <h1 className="text-2xl font-black text-foreground mb-6">رسائل التواصل</h1>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="animate-pulse bg-card rounded-2xl h-28 border"></div>)}
          </div>
        ) : !messages?.length ? (
          <div className="text-center py-20">
            <MessageSquare size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">لا توجد رسائل بعد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-black text-foreground">{msg.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      {msg.phone && <span dir="ltr">{msg.phone}</span>}
                      {msg.email && <span dir="ltr">{msg.email}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString("ar-SA")}
                  </span>
                </div>
                <p className="text-foreground/80 bg-muted/50 rounded-xl p-4 text-sm leading-relaxed">{msg.message}</p>
                {msg.phone && (
                  <div className="flex gap-3 mt-3">
                    <a
                      href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-200 transition-colors"
                    >
                      واتساب
                    </a>
                    <a
                      href={`tel:${msg.phone}`}
                      className="text-xs bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold hover:bg-blue-200 transition-colors"
                    >
                      اتصال
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </AdminRoute>
  );
}
