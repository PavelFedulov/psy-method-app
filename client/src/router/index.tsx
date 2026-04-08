import { Routes, Route, Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">Psy Method App</h1>
        <p className="mt-4 text-slate-600">
          Skeleton проекта для компьютеризации психологической методики.
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

function AdminLoginPage() {
  return <div className="p-8">Admin Login Page</div>;
}

function SuperAdminLoginPage() {
  return <div className="p-8">Super Admin Login Page</div>;
}

function ParticipantEntryPage() {
  return <div className="p-8">Participant Public Flow</div>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
      <Route path="/r/:token" element={<ParticipantEntryPage />} />
    </Routes>
  );
}
