import { Card } from "../../components/ui/Card";

export function PublicCompletedPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">
          Спасибо за участие
        </h1>
        <p className="mt-4 text-slate-700">
          Исследование завершено. Ваши ответы успешно сохранены.
        </p>
      </Card>
    </div>
  );
}
