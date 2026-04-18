import { Link } from "react-router-dom";
import type { AdminUser } from "../../features/admin-auth/admin-auth.types";
import { Card } from "../../components/ui/Card";

type Props = {
  admin: AdminUser;
};

export function AdminDashboardPage({ admin }: Props) {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <p className="text-sm font-medium tracking-wide text-slate-500">
          Главная
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Панель исследователя
        </h1>
        <p className="text-slate-600">
          Вы вошли как <strong>{admin.username}</strong>.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/admin/links" className="block">
          <Card>
            <div className="space-y-3">
              <div className="inline-flex rounded-2xl bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                Ссылки
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Participant-ссылки
              </h2>
              <p className="text-slate-600">
                Создание, копирование, отзыв и удаление participant-ссылок.
              </p>
            </div>
          </Card>
        </Link>

        <Link to="/admin/sessions" className="block">
          <Card>
            <div className="space-y-3">
              <div className="inline-flex rounded-2xl bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                Результаты
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Прохождения
              </h2>
              <p className="text-slate-600">
                Просмотр результатов, удаление и экспорт данных.
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
