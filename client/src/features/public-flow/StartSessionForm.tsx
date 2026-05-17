import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

type Gender = "male" | "female";

type Props = {
  isSubmitting: boolean;
  error: string;
  onSubmit: (payload: {
    participantCode: string;
    age: number;
    gender: Gender;
    consentAccepted: boolean;
  }) => void;
};

export function StartSessionForm({ isSubmitting, error, onSubmit }: Props) {
  const [participantCode, setParticipantCode] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [localError, setLocalError] = useState("");

  const numericAge = Number(age);

  const canSubmit =
    participantCode.trim().length > 0 &&
    Number.isInteger(numericAge) &&
    numericAge >= 18 &&
    gender !== "" &&
    consentAccepted &&
    !isSubmitting;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedParticipantCode = participantCode.trim();

    if (!trimmedParticipantCode) {
      setLocalError("Введите participant ID");
      return;
    }

    if (!Number.isInteger(numericAge) || numericAge < 18) {
      setLocalError("Возраст должен быть не меньше 18 лет");
      return;
    }

    if (!gender) {
      setLocalError("Выберите пол");
      return;
    }

    if (!consentAccepted) {
      setLocalError("Необходимо принять информированное согласие");
      return;
    }

    setLocalError("");

    onSubmit({
      participantCode: trimmedParticipantCode,
      age: numericAge,
      gender,
      consentAccepted,
    });
  }

  return (
    <Card>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Начало исследования
      </h1>

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
          Исследование анонимно. В системе сохраняется participant ID, возраст,
          пол и результаты выполнения заданий.
        </p>
      </div>

      <div className="mt-6 rounded-[24px] bg-white/60 p-4 text-sm leading-6 text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
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

        <Input
          label="Возраст"
          type="number"
          min={18}
          value={age}
          onChange={(event) => setAge(event.target.value)}
          placeholder="Введите возраст"
        />

        <div className="space-y-2.5">
          <p className="text-sm font-medium tracking-tight text-slate-700">
            Пол
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-[0_6px_20px_rgba(15,23,42,0.05)] backdrop-blur-md transition-all hover:bg-white active:scale-[0.985]">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              <span>Мужской</span>
            </label>

            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-[0_6px_20px_rgba(15,23,42,0.05)] backdrop-blur-md transition-all hover:bg-white active:scale-[0.985]">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
              <span>Женский</span>
            </label>
          </div>
        </div>

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

        {localError ? (
          <div className="text-sm text-red-500">{localError}</div>
        ) : null}
        {error ? <div className="text-sm text-red-500">{error}</div> : null}

        <Button type="submit" fullWidth disabled={!canSubmit}>
          {isSubmitting ? "Запуск..." : "Начать"}
        </Button>
      </form>
    </Card>
  );
}
