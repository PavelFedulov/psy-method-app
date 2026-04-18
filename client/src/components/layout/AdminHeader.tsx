import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../api/admin-auth";
import type { AdminUser } from "../../features/admin-auth/admin-auth.types";
import { Button } from "../ui/Button";

type Props = {
  admin: AdminUser;
};

export function AdminHeader({ admin }: Props) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logoutAdmin();
      navigate("/admin/login", { replace: true });
    } catch (error) {
      console.error(error);
      navigate("/admin/login", { replace: true });
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/65 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            Админ-панель
          </p>
          <p className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
            {admin.username}
          </p>
        </div>

        <Button type="button" variant="secondary" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </header>
  );
}
