type Props = {
  title: string;
  adjustablePartLabel: string;
  referenceValue: number;
  currentValue: number;
};

export function StimulusPreview({
  title,
  adjustablePartLabel,
  referenceValue,
  currentValue,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <p className="mb-3 text-sm font-medium text-slate-500">Эталон</p>
        <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
          <div className="text-center">
            <p className="text-base font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm text-slate-600">
              {adjustablePartLabel}: <strong>{referenceValue}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <p className="mb-3 text-sm font-medium text-slate-500">
          Регулируемая фигура
        </p>
        <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
          <div className="text-center">
            <p className="text-base font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm text-slate-600">
              {adjustablePartLabel}: <strong>{currentValue}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
