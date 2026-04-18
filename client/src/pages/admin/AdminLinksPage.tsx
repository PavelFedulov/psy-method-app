import { useEffect, useMemo, useState } from "react";
import {
  createAdminLink,
  deleteAdminLink,
  getAdminLinks,
  revokeAdminLink,
  type AdminLink,
} from "../../api/admin-links";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { BackButton } from "../../components/ui/BackButton";
import { Loader } from "../../components/ui/Loader";
import type { AdminUser } from "../../features/admin-auth/admin-auth.types";

type Props = {
  admin: AdminUser;
};

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

function buildParticipantUrl(token: string) {
  return `${window.location.origin}/r/${token}`;
}

export function AdminLinksPage({ admin }: Props) {
  const [links, setLinks] = useState<AdminLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [actionError, setActionError] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  async function loadLinks() {
    try {
      setActionError("");
      const result = await getAdminLinks();
      setLinks(result.links);
    } catch (error) {
      if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError("Не удалось загрузить ссылки");
      }
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getAdminLinks();

        if (!cancelled) {
          setLinks(result.links);
        }
      } catch (error) {
        if (!cancelled) {
          if (error instanceof Error) {
            setActionError(error.message);
          } else {
            setActionError("Не удалось загрузить ссылки");
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

  async function handleCreateLink() {
    try {
      setActionError("");
      setIsCreating(true);

      const result = await createAdminLink();
      setLinks((prev) => [result.link, ...prev]);
    } catch (error) {
      if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError("Не удалось создать ссылку");
      }
    } finally {
      setIsCreating(false);
    }
  }

  async function handleRevoke(linkId: number) {
    try {
      setActionError("");
      await revokeAdminLink(linkId);
      await loadLinks();
    } catch (error) {
      if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError("Не удалось отозвать ссылку");
      }
    }
  }

  async function handleDelete(linkId: number) {
    try {
      setActionError("");
      await deleteAdminLink(linkId);
      await loadLinks();
    } catch (error) {
      if (error instanceof Error) {
        setActionError(error.message);
      } else {
        setActionError("Не удалось удалить ссылку");
      }
    }
  }

  async function handleCopy(token: string) {
    try {
      await navigator.clipboard.writeText(buildParticipantUrl(token));
      setCopiedToken(token);
      window.setTimeout(() => {
        setCopiedToken((prev) => (prev === token ? null : prev));
      }, 1500);
    } catch (error) {
      setActionError("Не удалось скопировать ссылку");
    }
  }

  const hasLinks = useMemo(() => links.length > 0, [links]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Participant-ссылки
            </h1>
            <p className="mt-2 text-slate-700">
              Исследователь: <strong>{admin.username}</strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <BackButton />
            <Button
              type="button"
              onClick={handleCreateLink}
              disabled={isCreating}
            >
              {isCreating ? "Создание..." : "Создать ссылку"}
            </Button>
          </div>
        </div>

        {actionError ? (
          <div className="mt-4 text-sm text-red-600">{actionError}</div>
        ) : null}
      </Card>

      <Card>
        {!hasLinks ? (
          <div className="text-slate-600">
            Ссылок пока нет. Создайте первую participant-ссылку.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="px-3 py-3 font-medium">ID</th>
                  <th className="px-3 py-3 font-medium">Ссылка</th>
                  <th className="px-3 py-3 font-medium">Статус</th>
                  <th className="px-3 py-3 font-medium">Создана</th>
                  <th className="px-3 py-3 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => {
                  const participantUrl = buildParticipantUrl(link.token);
                  const canDelete = link.status === "new";
                  const canRevoke =
                    link.status === "new" || link.status === "in_progress";

                  return (
                    <tr
                      key={link.id}
                      className="border-b border-slate-100 align-top"
                    >
                      <td className="px-3 py-4 text-slate-900">{link.id}</td>

                      <td className="px-3 py-4">
                        <div className="max-w-[420px]">
                          <div className="break-all text-slate-700">
                            {participantUrl}
                          </div>
                          {copiedToken === link.token ? (
                            <div className="mt-1 text-xs text-green-600">
                              Скопировано
                            </div>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-3 py-4 text-slate-700">
                        {mapLinkStatus(link.status)}
                      </td>

                      <td className="px-3 py-4 text-slate-700">
                        {link.createdAt}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleCopy(link.token)}
                          >
                            Копировать
                          </Button>

                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleRevoke(link.id)}
                            disabled={!canRevoke}
                          >
                            Отозвать
                          </Button>

                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => handleDelete(link.id)}
                            disabled={!canDelete}
                          >
                            Удалить
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
