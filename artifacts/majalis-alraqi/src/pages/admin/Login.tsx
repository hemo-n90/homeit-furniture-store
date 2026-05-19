import { useState } from "react";
import { useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const login = useLogin();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { email: form.email, password: form.password } },
      {
        onSuccess: (data) => {
          localStorage.setItem("admin_token", data.token);
          setLocation("/admin");
        },
        onError: () => {
          toast({ title: "بيانات الدخول غير صحيحة", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl shadow-2xl p-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-primary-foreground font-black text-3xl leading-none">H</span>
          </div>
          <h1 className="text-2xl font-black text-foreground mb-1">هوميت للأثاث</h1>
          <p className="text-muted-foreground text-sm">لوحة التحكم — تسجيل الدخول</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="admin@homeitfurniture.com"
              className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
              dir="ltr"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">كلمة المرور</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full bg-muted/50 border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary outline-none transition-all"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black text-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {login.isPending ? "جاري الدخول..." : "دخول"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 bg-muted/50 rounded-lg p-3">
          admin@majalis-alraqi.com / admin123456
        </p>
      </motion.div>
    </div>
  );
}
