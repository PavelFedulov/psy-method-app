import { Routes, Route, Link, Navigate } from "react-router-dom";
import { PublicCompletedPage } from "../pages/public/PublicCompletedPage";
import { PublicEntryPage } from "../pages/public/PublicEntryPage";
import { PublicStepPage } from "../pages/public/PublicStepPage";
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminLinksPage } from "../pages/admin/AdminLinksPage";
import { RequireAdminAuth } from "../features/admin-auth/RequireAdminAuth";

function HomePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Psy Method App</h1>
        <p className="mt-4 text-slate-600">
          Веб-приложение для компьютеризации психологической методики.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link className="text-blue-600 underline" to="/admin/login">
            Вход исследователя
          </Link>
          <Link className="text-blue-600 underline" to="/super-admin/login">
            Вход супер-админа
          </Link>
          <Link className="text-blue-600 underline" to="/r/demo-token">
            Тестовая participant-ссылка
          </Link>
        </div>
      </div>
    </div>
  );
}

function SuperAdminLoginPage() {
  return <div className="p-8">Super Admin Login Page</div>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <RequireAdminAuth>
            {(admin) => <AdminDashboardPage admin={admin} />}
          </RequireAdminAuth>
        }
      />

      <Route
        path="/admin/links"
        element={
          <RequireAdminAuth>
            {(admin) => <AdminLinksPage admin={admin} />}
          </RequireAdminAuth>
        }
      />

      <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />

      <Route path="/r/:token" element={<PublicEntryPage />} />
      <Route path="/r/:token/steps/:stepNumber" element={<PublicStepPage />} />
      <Route path="/r/:token/completed" element={<PublicCompletedPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
