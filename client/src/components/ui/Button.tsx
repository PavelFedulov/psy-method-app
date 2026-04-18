import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
  }
>;

export function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: Props) {
  const baseClasses =
    "inline-flex min-h-11 items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold tracking-tight transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses =
    variant === "primary"
      ? "bg-slate-900 text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] hover:bg-slate-800 hover:shadow-[0_10px_28px_rgba(15,23,42,0.22)] active:translate-y-[1px] active:scale-[0.985]"
      : variant === "secondary"
        ? "border border-white/70 bg-white/70 text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.06)] backdrop-blur-md hover:border-slate-200 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)] active:translate-y-[1px] active:scale-[0.985] active:bg-slate-100"
        : "bg-red-500 text-white shadow-[0_8px_24px_rgba(239,68,68,0.22)] hover:bg-red-400 hover:shadow-[0_10px_28px_rgba(239,68,68,0.28)] active:translate-y-[1px] active:scale-[0.985]";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
