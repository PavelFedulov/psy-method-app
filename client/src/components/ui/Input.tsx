import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: Props) {
  return (
    <label className="flex flex-col gap-2.5">
      <span className="text-sm font-medium tracking-tight text-slate-700">
        {label}
      </span>

      <input
        className={`min-h-12 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-slate-900 shadow-[0_6px_20px_rgba(15,23,42,0.05)] outline-none backdrop-blur-md transition-all placeholder:text-slate-400 focus:border-slate-300 focus:bg-white ${className}`}
        {...props}
      />

      {error ? <span className="text-sm text-red-500">{error}</span> : null}
    </label>
  );
}
