import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  bulkDeleteAdminSessions,
  deleteAdminSession,
  getAdminSessions,
  type AdminSession,
} from "../../api/admin-sessions";
import {
  exportAdminSessionsCsv,
  exportAdminSessionsXlsx,
} from "../../api/admin-export";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Loader } from "../../components/ui/Loader";
import { BackButton } from "../../components/ui/BackButton";
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

export function AdminSessionsPage({ admin }: Props) {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  async function loadSessions() {
    try {
      setPageError("");
      const result = await getAdminSessions();
      setSessions(result.sessions);
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message);
      } else {
        setPageError("Не удалось загрузить прохождения");
      }
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getAdminSessions();

        if (!cancelled) {
          setSessions(result.sessions);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof Error) {
            setPageError(error.message);
          } else {
            setPageError("Не удалось загрузить прохождения");
          }
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

  function toggleSelection(sessionId: number) {
    setSelectedIds((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId],
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === sessions.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(sessions.map((session) => session.id));
  }

  async function handleDeleteOne(sessionId: number) {
    try {
      setPageError("");
      await deleteAdminSession(sessionId);
      setSelectedIds((prev) => prev.filter((id) => id !== sessionId));
      await loadSessions();
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message);
      } else {
        setPageError("Не удалось удалить прохождение");
      }
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      setPageError("");
      setIsBulkDeleting(true);
      await bulkDeleteAdminSessions(selectedIds);
      setSelectedIds([]);
      await loadSessions();
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message);
      } else {
        setPageError("Не удалось удалить выбранные прохождения");
      }
    } finally {
      setIsBulkDeleting(false);
    }
  }

  async function handleExportCsvSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      setPageError("");
      setIsExporting(true);
      await exportAdminSessionsCsv({ sessionIds: selectedIds });
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message);
      } else {
        setPageError("Не удалось экспортировать CSV");
      }
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportXlsxSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    try {
      setPageError("");
      setIsExporting(true);
      await exportAdminSessionsXlsx({ sessionIds: selectedIds });
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message);
      } else {
        setPageError("Не удалось экспортировать XLSX");
      }
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportCsvAll() {
    try {
      setPageError("");
      setIsExporting(true);
      await exportAdminSessionsCsv({ exportAll: true });
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message);
      } else {
        setPageError("Не удалось экспортировать CSV");
      }
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportXlsxAll() {
    try {
      setPageError("");
      setIsExporting(true);
      await exportAdminSessionsXlsx({ exportAll: true });
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message);
      } else {
        setPageError("Не удалось экспортировать XLSX");
      }
    } finally {
      setIsExporting(false);
    }
  }

  const hasSessions = useMemo(() => sessions.length > 0, [sessions]);
  const allSelected = hasSessions && selectedIds.length === sessions.length;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-wide text-slate-500">
            Результаты
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Прохождения
          </h1>
          <p className="text-slate-600">
            Исследователь: <strong>{admin.username}</strong>
          </p>
        </div>

        <BackButton />
      </section>

      {pageError ? (
        <Card>
          <div className="text-sm text-red-500">{pageError}</div>
        </Card>
      ) : null}

      <Card>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="danger"
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0 || isBulkDeleting}
          >
            {isBulkDeleting ? "Удаление..." : "Удалить выбранные"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleExportCsvSelected}
            disabled={selectedIds.length === 0 || isExporting}
          >
            CSV выбранные
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleExportXlsxSelected}
            disabled={selectedIds.length === 0 || isExporting}
          >
            XLSX выбранные
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleExportCsvAll}
            disabled={!hasSessions || isExporting}
          >
            CSV все
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleExportXlsxAll}
            disabled={!hasSessions || isExporting}
          >
            XLSX все
          </Button>
        </div>
      </Card>

      {!hasSessions ? (
        <Card>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Пока нет прохождений
            </h2>
            <p className="text-slate-600">
              Когда участники начнут выполнять методику, результаты появятся
              здесь.
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-2 font-medium">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-2 font-medium">ID</th>
                  <th className="px-3 py-2 font-medium">Participant ID</th>
                  <th className="px-3 py-2 font-medium">Статус</th>
                  <th className="px-3 py-2 font-medium">Шаг</th>
                  <th className="px-3 py-2 font-medium">Статус ссылки</th>
                  <th className="px-3 py-2 font-medium">Начато</th>
                  <th className="px-3 py-2 font-medium">Завершено</th>
                  <th className="px-3 py-2 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="align-top rounded-[24px] bg-white/65 shadow-[0_8px_20px_rgba(15,23,42,0.05)]"
                  >
                    <td className="rounded-l-[24px] px-3 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(session.id)}
                        onChange={() => toggleSelection(session.id)}
                      />
                    </td>

                    <td className="px-3 py-4 text-slate-900">{session.id}</td>
                    <td className="px-3 py-4 text-slate-900">
                      {session.participantCode}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {mapSessionStatus(session.status)}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {session.currentStep}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {mapLinkStatus(session.linkStatus)}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {session.startedAt}
                    </td>
                    <td className="px-3 py-4 text-slate-700">
                      {session.completedAt ?? "—"}
                    </td>
                    <td className="rounded-r-[24px] px-3 py-4">
                      <div className="flex flex-nowrap items-center gap-2">
                        <Link
                          to={`/admin/sessions/${session.id}`}
                          className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-150 hover:border-slate-200 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)] active:translate-y-[1px] active:scale-[0.985] active:bg-slate-100"
                        >
                          Открыть
                        </Link>

                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDeleteOne(session.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
