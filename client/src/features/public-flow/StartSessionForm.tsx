import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

type Props = {
  isSubmitting: boolean;
  error: string;
  onSubmit: (payload: {
    participantCode: string;
    consentAccepted: boolean;
  }) => void;
};

export function StartSessionForm({ isSubmitting, error, onSubmit }: Props) {
  const [participantCode, setParticipantCode] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      participantCode,
      consentAccepted,
    });
  }

  return (
    <Card>
      <h1 className="text-2xl font-bold text-slate-900">Начало исследования</h1>

      <div className="mt-6 space-y-4 text-sm leading-6 text-slate-700">
        <p>
          Вам будет предложено последовательно выполнить 10 заданий на сравнение
          визуальных стимулов.
        </p>
        <p>
          На каждом шаге слева будет показана эталонная фигура, справа —
          регулируемая. Ваша задача — изменять указанную часть фигуры, пока она
          не будет максимально соответствовать эталону.
        </p>
        <p>
          Исследование анонимно. В системе сохраняется только participant ID и
          результаты выполнения заданий.
        </p>
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <p className="font-semibold text-slate-900">Информированное согласие</p>
        <p className="mt-2">
          Я подтверждаю, что ознакомлен(а) с целью исследования, понимаю
          характер выполняемых заданий и добровольно соглашаюсь принять участие.
        </p>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <Input
          label="Participant ID"
          value={participantCode}
          onChange={(event) => setParticipantCode(event.target.value)}
          placeholder="Введите participant ID"
        />

        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={consentAccepted}
            onChange={(event) => setConsentAccepted(event.target.checked)}
            className="mt-1"
          />
          <span>
            Я принимаю информированное согласие и согласен(а) участвовать в
            исследовании.
          </span>
        </label>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Запуск..." : "Начать"}
        </Button>
      </form>
    </Card>
  );
}
