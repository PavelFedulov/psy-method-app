import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAdminMe } from "../../api/admin-auth";
import type { AdminUser } from "./admin-auth.types";
import { Loader } from "../../components/ui/Loader";
import { AdminLayout } from "../../components/layout/AdminLayout";

type Props = {
  children: (admin: AdminUser) => React.ReactNode;
};

export function RequireAdminAuth({ children }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getAdminMe();

        if (!cancelled) {
          setAdmin(result.authenticated && result.admin ? result.admin : null);
        }
      } catch (error) {
        if (!cancelled) {
          setAdmin(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Loader />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout admin={admin}>{children(admin)}</AdminLayout>;
}
