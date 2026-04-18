import type { AdminUser } from "../../features/admin-auth/admin-auth.types";
import { Card } from "../../components/ui/Card";

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
        <h2 className="text-xl font-semibold text-slate-900">
          Следующие разделы
        </h2>
        <div className="mt-4 space-y-2 text-slate-700">
          <p>• Управление participant-ссылками</p>
          <p>• Просмотр прохождений</p>
          <p>• Детальная карточка участника</p>
          <p>• Экспорт CSV / XLSX</p>
        </div>
      </Card>
    </div>
  );
}
