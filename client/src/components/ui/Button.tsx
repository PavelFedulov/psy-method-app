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
    "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses =
    variant === "primary"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : variant === "secondary"
        ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
        : "bg-red-600 text-white hover:bg-red-500";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
