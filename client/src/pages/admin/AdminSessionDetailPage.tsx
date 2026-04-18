import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteAdminSession,
  getAdminSessionDetail,
  type AdminSessionDetailResponse,
} from "../../api/admin-sessions";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { BackButton } from "../../components/ui/BackButton";
import { Loader } from "../../components/ui/Loader";
import type { AdminUser } from "../../features/admin-auth/admin-auth.types";

type Props = {
  admin: AdminUser;
};

function mapSessionStatus(status: string) {
  switch (status) {
    case "in_progress":
      return "В процессе";
    case "completed":
      return "Завершено";
    default:
      return status;
  }
}

function mapLinkStatus(status: string) {
  switch (status) {
    case "new":
      return "Новая";
    case "in_progress":
      return "В процессе";
    case "completed":
      return "Завершена";
    case "revoked":
      return "Отозвана";
    default:
      return status;
  }
}

export function AdminSessionDetailPage({ admin }: Props) {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const sessionId = Number(id);

  const [data, setData] = useState<AdminSessionDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setPageError("");
        const result = await getAdminSessionDetail(sessionId);

        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof Error) {
            setPageError(error.message);
          } else {
            setPageError("Не удалось загрузить карточку прохождения");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (Number.isInteger(sessionId) && sessionId > 0) {
      load();
    } else {
      setPageError("Некорректный id прохождения");
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  async function handleDelete() {
    if (!data) {
      return;
    }

    try {
      setPageError("");
      setIsDeleting(true);
      await deleteAdminSession(data.session.id);
      navigate("/admin/sessions", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message);
      } else {
        setPageError("Не удалось удалить прохождение");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Loader />
      </div>
    );
  }

  if (pageError && !data) {
    return (
      <div className="space-y-6">
        <Card>
          <h1 className="text-2xl font-bold text-slate-900">Ошибка</h1>
          <p className="mt-3 text-red-600">{pageError}</p>

          <div className="mt-6">
            <Link
              to="/admin/sessions"
              className="inline-flex items-center justify-center rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
            >
              Назад к прохождениям
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Карточка прохождения #{data.session.id}
            </h1>
            <p className="mt-2 text-slate-700">
              Исследователь: <strong>{admin.username}</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <BackButton fallbackPath="/admin/sessions" />

            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Удаление..." : "Удалить прохождение"}
            </Button>
          </div>
        </div>

        {pageError ? (
          <div className="mt-4 text-sm text-red-600">{pageError}</div>
        ) : null}
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-xl font-semibold text-slate-900">
            Общая информация
          </h2>

          <div className="mt-4 space-y-2 text-slate-700">
            <p>
              <strong>Participant ID:</strong> {data.session.participantCode}
            </p>
            <p>
              <strong>Статус:</strong> {mapSessionStatus(data.session.status)}
            </p>
            <p>
              <strong>Текущий шаг:</strong> {data.session.currentStep}
            </p>
            <p>
              <strong>Сохранено шагов:</strong> {data.session.stepsCompleted}
            </p>
            <p>
              <strong>Общее время:</strong> {data.session.totalTimeFormatted}
            </p>
            <p>
              <strong>Общее число нажатий:</strong> {data.session.totalClicks}
            </p>
            <p>
              <strong>Начато:</strong> {data.session.startedAt}
            </p>
            <p>
              <strong>Последняя активность:</strong>{" "}
              {data.session.lastActivityAt}
            </p>
            <p>
              <strong>Завершено:</strong> {data.session.completedAt ?? "—"}
            </p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-slate-900">
            Связанная ссылка
          </h2>

          <div className="mt-4 space-y-2 text-slate-700">
            <p>
              <strong>ID ссылки:</strong> {data.link.id}
            </p>
            <p className="break-all">
              <strong>Токен:</strong> {data.link.token}
            </p>
            <p>
              <strong>Статус:</strong> {mapLinkStatus(data.link.status)}
            </p>
            <p>
              <strong>Создана:</strong> {data.link.createdAt}
            </p>
            <p>
              <strong>Начата:</strong> {data.link.startedAt ?? "—"}
            </p>
            <p>
              <strong>Завершена:</strong> {data.link.completedAt ?? "—"}
            </p>
            <p>
              <strong>Отозвана:</strong> {data.link.revokedAt ?? "—"}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-slate-900">Шаги методики</h2>

        {data.steps.length === 0 ? (
          <div className="mt-4 text-slate-600">Шаги пока не сохранены.</div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-3 font-medium">Шаг</th>
                  <th className="px-3 py-3 font-medium">Стимул</th>
                  <th className="px-3 py-3 font-medium">Изменяемая часть</th>
                  <th className="px-3 py-3 font-medium">Эталон</th>
                  <th className="px-3 py-3 font-medium">Итог</th>
                  <th className="px-3 py-3 font-medium">Отклонение</th>
                  <th className="px-3 py-3 font-medium">Больше</th>
                  <th className="px-3 py-3 font-medium">Меньше</th>
                  <th className="px-3 py-3 font-medium">Всего</th>
                  <th className="px-3 py-3 font-medium">Время</th>
                </tr>
              </thead>
              <tbody>
                {data.steps.map((step) => (
                  <tr
                    key={step.id}
                    className="border-b border-slate-100 align-top"
                  >
                    <td className="px-3 py-4 text-slate-900">
                      {step.stepNumber}
                    </td>
                    <td className="px-3 py-4 text-slate-900">
                      <div className="font-medium">{step.stimulusLabel}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {step.stimulusType}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {step.adjustablePartLabel}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {step.referenceValue}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {step.finalValue}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {step.deviation}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {step.clicksMore}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {step.clicksLess}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {step.clicksTotal}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {step.timeSpentFormatted}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
