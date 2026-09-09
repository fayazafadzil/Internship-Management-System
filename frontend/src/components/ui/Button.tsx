import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "dark" | "outline";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-[#1B4472] text-white shadow-sm hover:bg-[#16385F] hover:shadow-lg active:bg-[#122E4D]",
  dark: "bg-slate-900 text-white shadow-sm hover:bg-slate-800 hover:shadow-lg",
  outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400",
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={cx(base, variants[variant], className)} {...props} />
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant };

export function LinkButton({
  variant = "primary",
  className,
  ...props
}: LinkButtonProps) {
  return <Link className={cx(base, variants[variant], className)} {...props} />;
}

