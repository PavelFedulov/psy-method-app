import { Button } from "../../components/ui/Button";

type Props = {
  currentValue: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function StepControls({
  currentValue,
  onDecrease,
  onIncrease,
  onSubmit,
  isSubmitting,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-4 text-center">
        <p className="text-sm text-slate-500">Текущее значение</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{currentValue}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="secondary" onClick={onDecrease}>
          Меньше
        </Button>
        <Button type="button" variant="secondary" onClick={onIncrease}>
          Больше
        </Button>
      </div>

      <Button
        type="button"
        fullWidth
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Сохранение..." : "Готово"}
      </Button>
    </div>
  );
}
