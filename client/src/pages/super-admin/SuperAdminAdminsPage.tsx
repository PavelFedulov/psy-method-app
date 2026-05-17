import { useEffect, useMemo, useState } from "react";
import {
  createResearchAdmin,
  deleteResearchAdmin,
  getResearchAdmins,
  updateResearchAdminStatus,
  type ResearchAdmin,
} from "../../api/super-admin-admins";
import { BackButton } from "../../components/ui/BackButton";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import type { SuperAdminUser } from "../../features/super-admin-auth/super-admin-auth.types";

type Props = {
  superAdmin: SuperAdminUser;
};

function mapActiveStatus(isActive: boolean) {
  return isActive ? "Активен" : "Деактивирован";
}

export function SuperAdminAdminsPage({ superAdmin }: Props) {
  const [admins, setAdmins] = useState<ResearchAdmin[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [pageError, setPageError] = useState("");

  async function loadAdmins() {
    try {
      setPageError("");
      const result = await getResearchAdmins();
      setAdmins(result.admins);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Не удалось загрузить исследователей",
      );
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getResearchAdmins();

        if (!cancelled) {
          setAdmins(result.admins);
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(
            error instanceof Error
              ? error.message
              : "Не удалось загрузить исследователей",
          );
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

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setPageError("");
      setIsCreating(true);

      const result = await createResearchAdmin({
        username: username.trim(),
        password,
      });

      setAdmins((prev) => [result.admin, ...prev]);
      setUsername("");
      setPassword("");
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Не удалось создать исследователя",
      );
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleActive(admin: ResearchAdmin) {
    try {
      setPageError("");
      await updateResearchAdminStatus(admin.id, !admin.isActive);
      await loadAdmins();
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Не удалось изменить статус",
      );
    }
  }

  async function handleDelete(adminId: number) {
    try {
      setPageError("");
      await deleteResearchAdmin(adminId);
      await loadAdmins();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Не удалось удалить исследователя",
      );
    }
  }

  const hasAdmins = useMemo(() => admins.length > 0, [admins]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-wide text-slate-500">
            Исследователи
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Управление исследователями
          </h1>
          <p className="text-slate-600">
            Супер-админ: <strong>{superAdmin.username}</strong>
          </p>
        </div>

        <BackButton fallbackPath="/super-admin" />
      </section>

      {pageError ? (
        <Card>
          <div className="text-sm text-red-500">{pageError}</div>
        </Card>
      ) : null}

      <Card>
        <form
          className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
          onSubmit={handleCreate}
        >
          <Input
            label="Логин исследователя"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Например: researcher1"
          />

          <Input
            label="Пароль"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Введите пароль"
          />

          <div className="flex items-end">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Создание..." : "Создать"}
            </Button>
          </div>
        </form>
      </Card>

      {!hasAdmins ? (
        <Card>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Исследователей пока нет
          </h2>
          <p className="mt-2 text-slate-600">
            Создайте первого исследователя через форму выше.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {admins.map((admin) => (
            <Card key={admin.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex rounded-2xl bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      ID {admin.id}
                    </div>

                    <div
                      className={
                        admin.isActive
                          ? "text-sm font-medium text-green-600"
                          : "text-sm font-medium text-slate-500"
                      }
                    >
                      {mapActiveStatus(admin.isActive)}
                    </div>
                  </div>

                  <div className="text-xl font-semibold tracking-tight text-slate-900">
                    {admin.username}
                  </div>

                  <div className="text-sm text-slate-500">
                    Создан: {admin.createdAt}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleToggleActive(admin)}
                  >
                    {admin.isActive ? "Деактивировать" : "Активировать"}
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleDelete(admin.id)}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
