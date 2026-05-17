import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSuperAdminMe, loginSuperAdmin } from "../../api/super-admin-auth";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function SuperAdminLoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const result = await getSuperAdminMe();

        if (!cancelled && result.authenticated) {
          navigate("/super-admin", { replace: true });
          return;
        }
      } catch {
        // пользователь просто не авторизован
      } finally {
        if (!cancelled) {
          setIsCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setFormError("");
      setIsSubmitting(true);

      await loginSuperAdmin({
        username,
        password,
      });

      navigate("/super-admin", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Не удалось выполнить вход");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-slate-500">Проверка авторизации...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex items-center">
          <div className="space-y-5">
            <div className="inline-flex rounded-2xl bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_8px_24px_rgba(15,23,42,0.05)] backdrop-blur-xl">
              Psy Method App
            </div>

            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Панель супер-администратора
            </h1>

            <p className="max-w-lg text-lg leading-8 text-slate-600">
              Войдите, чтобы создавать исследователей, управлять их статусом и
              доступом к системе.
            </p>
          </div>
        </div>

        <Card>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Вход супер-админа
            </h2>
            <p className="text-sm text-slate-600">
              Используйте учетные данные супер-администратора.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Логин"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Введите логин"
              autoComplete="username"
            />

            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Введите пароль"
              autoComplete="current-password"
            />

            {formError ? (
              <div className="text-sm text-red-500">{formError}</div>
            ) : null}

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Вход..." : "Войти"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
