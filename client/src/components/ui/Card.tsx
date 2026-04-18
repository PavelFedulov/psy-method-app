import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
      {children}
    </div>
  );
}
