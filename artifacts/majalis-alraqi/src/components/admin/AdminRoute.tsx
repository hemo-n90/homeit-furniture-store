import { useEffect } from "react";
import { useLocation } from "wouter";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const token = localStorage.getItem("admin_token");
  if (!token) return null;

  return <>{children}</>;
}
