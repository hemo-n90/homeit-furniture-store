import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Package, ShoppingCart, Tag, Settings, MessageSquare, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/categories", label: "الفئات", icon: Tag },
  { href: "/admin/homepage", label: "الصفحة الرئيسية", icon: Settings },
  { href: "/admin/messages", label: "الرسائل", icon: MessageSquare },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? location === href : location.startsWith(href);

  return (
    <div className="min-h-screen bg-muted/30 flex" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-secondary text-secondary-foreground transform transition-transform duration-300 flex flex-col
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
      >
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-black text-primary">مجالس الراقي</h2>
          <p className="text-xs text-secondary-foreground/50 mt-1">لوحة التحكم</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive(href, exact)
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground/70 hover:bg-white/10 hover:text-secondary-foreground"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary-foreground/70 hover:bg-white/10 transition-all font-medium text-sm mb-1"
          >
            عرض الموقع
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-secondary-foreground/70 hover:bg-white/10 hover:text-red-400 transition-all font-medium"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b border-border h-16 flex items-center px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-foreground"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="text-sm text-muted-foreground">
            {navItems.find(i => isActive(i.href, i.exact))?.label || "لوحة التحكم"}
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
