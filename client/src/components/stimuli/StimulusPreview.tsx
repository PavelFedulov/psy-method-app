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
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-wide text-slate-500">
          Эталон
        </p>

        <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 md:min-h-[380px]">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900 md:text-xl">
              {title}
            </p>
            <p className="mt-4 text-base text-slate-600 md:text-lg">
              {adjustablePartLabel}: <strong>{referenceValue}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
        <p className="mb-4 text-center text-sm font-medium uppercase tracking-wide text-slate-500">
          Регулируемая фигура
        </p>

        <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 md:min-h-[380px]">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900 md:text-xl">
              {title}
            </p>
            <p className="mt-4 text-base text-slate-600 md:text-lg">
              {adjustablePartLabel}: <strong>{currentValue}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
