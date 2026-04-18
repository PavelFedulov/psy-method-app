import type { PropsWithChildren } from "react";
import type { AdminUser } from "../../features/admin-auth/admin-auth.types";
import { AdminHeader } from "./AdminHeader";

type Props = PropsWithChildren<{
  admin: AdminUser;
}>;

export function AdminLayout({ admin, children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader admin={admin} />

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
