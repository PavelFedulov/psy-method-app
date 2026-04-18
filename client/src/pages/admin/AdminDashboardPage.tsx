import { Link } from 'react-router-dom';
import type { AdminUser } from '../../features/admin-auth/admin-auth.types';
import { Card } from '../../components/ui/Card';

type Props = {
  admin: AdminUser;
};

export function AdminDashboardPage({ admin }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Добро пожаловать</h1>
        <p className="mt-3 text-slate-700">
          Вы вошли как исследователь <strong>{admin.username}</strong>.
        </p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-slate-900">Разделы</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Link
            to="/admin/links"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
          >
            <div className="text-lg font-semibold text-slate-900">Participant-ссылки</div>
            <p className="mt-2 text-sm text-slate-600">
              Создание, отзыв и удаление participant-ссылок.
            </p>
          </Link>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-400">
            <div className="text-lg font-semibold">Прохождения</div>
            <p className="mt-2 text-sm">Следующий шаг: список результатов и детальная карточка.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}