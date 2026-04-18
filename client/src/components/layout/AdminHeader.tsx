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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-sm text-slate-500">Админ-панель исследователя</p>
          <p className="text-lg font-semibold text-slate-900">
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
