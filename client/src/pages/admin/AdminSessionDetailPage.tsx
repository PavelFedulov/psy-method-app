import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteAdminSession,
  getAdminSessionDetail,
  type AdminSessionDetailResponse,
} from '../../api/admin-sessions';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { BackButton } from '../../components/ui/BackButton';
import type { AdminUser } from '../../features/admin-auth/admin-auth.types';

type Props = {
  admin: AdminUser;
};

function mapSessionStatus(status: string) {
  switch (status) {
    case 'in_progress':
      return 'В процессе';
    case 'completed':
      return 'Завершено';
    default:
      return status;
  }
}

function mapLinkStatus(status: string) {
  switch (status) {
    case 'new':
      return 'Новая';
    case 'in_progress':
      return 'В процессе';
    case 'completed':
      return 'Завершена';
    case 'revoked':
      return 'Отозвана';
    default:
      return status;
  }
}

export function AdminSessionDetailPage({ admin }: Props) {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const sessionId = Number(id);

  const [data, setData] = useState<AdminSessionDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setPageError('');
        const result = await getAdminSessionDetail(sessionId);

        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof Error) {
            setPageError(error.message);
          } else {
            setPageError('Не удалось загрузить карточку прохождения');
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
      setPageError('Некорректный id прохождения');
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
      setPageError('');
      setIsDeleting(true);
      await deleteAdminSession(data.session.id);
      navigate('/admin/sessions', { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message);
      } else {
        setPageError('Не удалось удалить прохождение');
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
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Ошибка
            </h1>
            <p className="text-red-500">{pageError}</p>
            <BackButton fallbackPath="/admin/sessions" />
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
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-wide text-slate-500">
            Карточка прохождения
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Прохождение #{data.session.id}
          </h1>
          <p className="text-slate-600">
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
            {isDeleting ? 'Удаление...' : 'Удалить прохождение'}
          </Button>
        </div>
      </section>

      {pageError ? (
        <Card>
          <div className="text-sm text-red-500">{pageError}</div>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Общая информация
            </h2>

            <div className="grid gap-3 text-sm text-slate-700">
              <div><strong>Participant ID:</strong> {data.session.participantCode}</div>
              <div><strong>Статус:</strong> {mapSessionStatus(data.session.status)}</div>
              <div><strong>Текущий шаг:</strong> {data.session.currentStep}</div>
              <div><strong>Сохранено шагов:</strong> {data.session.stepsCompleted}</div>
              <div><strong>Общее время:</strong> {data.session.totalTimeFormatted}</div>
              <div><strong>Общее число нажатий:</strong> {data.session.totalClicks}</div>
              <div><strong>Начато:</strong> {data.session.startedAt}</div>
              <div><strong>Последняя активность:</strong> {data.session.lastActivityAt}</div>
              <div><strong>Завершено:</strong> {data.session.completedAt ?? '—'}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Связанная ссылка
            </h2>

            <div className="grid gap-3 text-sm text-slate-700">
              <div><strong>ID ссылки:</strong> {data.link.id}</div>
              <div className="break-all"><strong>Токен:</strong> {data.link.token}</div>
              <div><strong>Статус:</strong> {mapLinkStatus(data.link.status)}</div>
              <div><strong>Создана:</strong> {data.link.createdAt}</div>
              <div><strong>Начата:</strong> {data.link.startedAt ?? '—'}</div>
              <div><strong>Завершена:</strong> {data.link.completedAt ?? '—'}</div>
              <div><strong>Отозвана:</strong> {data.link.revokedAt ?? '—'}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Шаги методики
          </h2>

          {data.steps.length === 0 ? (
            <div className="text-slate-600">Шаги пока не сохранены.</div>
          ) : (
            <div className="space-y-4">
              {data.steps.map((step) => (
                <div
                  key={step.id}
                  className="rounded-[24px] border border-white/70 bg-white/65 p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <div className="text-lg font-semibold tracking-tight text-slate-900">
                        Шаг {step.stepNumber}
                      </div>
                      <div className="text-sm text-slate-600">{step.stimulusLabel}</div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">
                        {step.stimulusType}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                      {step.timeSpentFormatted}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2 xl:grid-cols-5">
                    <div><strong>Изменяемая часть:</strong> {step.adjustablePartLabel}</div>
                    <div><strong>Эталон:</strong> {step.referenceValue}</div>
                    <div><strong>Итог:</strong> {step.finalValue}</div>
                    <div><strong>Отклонение:</strong> {step.deviation}</div>
                    <div><strong>Нажатий всего:</strong> {step.clicksTotal}</div>
                    <div><strong>Больше:</strong> {step.clicksMore}</div>
                    <div><strong>Меньше:</strong> {step.clicksLess}</div>
                    <div><strong>Время (сек):</strong> {step.timeSpentSeconds}</div>
                    <div className="md:col-span-2">
                      <strong>Сохранено:</strong> {step.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}