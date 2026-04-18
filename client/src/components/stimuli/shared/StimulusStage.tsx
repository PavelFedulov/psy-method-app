import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  label: string;
}>;

export function StimulusStage({ label, children }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-7">
      <p className="mb-4 text-center text-sm font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-white ring-1 ring-slate-200 md:min-h-[360px]">
        {children}
      </div>
    </div>
  );
}
