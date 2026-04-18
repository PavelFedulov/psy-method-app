import { Button } from "../../components/ui/Button";

type Props = {
  onDecrease: () => void;
  onIncrease: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export function StepControls({
  onDecrease,
  onIncrease,
  onSubmit,
  isSubmitting,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onDecrease}
          className="py-4 text-base"
        >
          Меньше
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onIncrease}
          className="py-4 text-base"
        >
          Больше
        </Button>
      </div>

      <Button
        type="button"
        fullWidth
        onClick={onSubmit}
        disabled={isSubmitting}
        className="py-4 text-base"
      >
        {isSubmitting ? "Сохранение..." : "Готово"}
      </Button>
    </div>
  );
}
