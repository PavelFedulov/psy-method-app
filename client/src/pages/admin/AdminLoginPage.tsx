import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminMe, loginAdmin } from "../../api/admin-auth";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

export function AdminLoginPage() {
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
        const result = await getAdminMe();

        if (!cancelled && result.authenticated) {
          navigate("/admin", { replace: true });
          return;
        }
      } catch (error) {
        console.error(error);
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

      await loginAdmin({
        username,
        password,
      });

      navigate("/admin", { replace: true });
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
    <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Card>
          <h1 className="text-2xl font-bold text-slate-900">
            Вход исследователя
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Войдите в админ-панель, чтобы управлять ссылками и результатами.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
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
              <div className="text-sm text-red-600">{formError}</div>
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
