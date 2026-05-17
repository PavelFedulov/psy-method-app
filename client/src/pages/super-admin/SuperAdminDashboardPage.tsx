import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import type { SuperAdminUser } from "../../features/super-admin-auth/super-admin-auth.types";

type Props = {
  superAdmin: SuperAdminUser;
};

export function SuperAdminDashboardPage({ superAdmin }: Props) {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-medium tracking-wide text-slate-500">
          Главная
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Панель супер-админа
        </h1>
        <p className="text-slate-600">
          Вы вошли как <strong>{superAdmin.username}</strong>.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/super-admin/admins" className="block">
          <Card>
            <div className="space-y-3">
              <div className="inline-flex rounded-2xl bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                Исследователи
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Управление админами
              </h2>

              <p className="text-slate-600">
                Создание, просмотр, деактивация и удаление учетных записей
                исследователей.
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
