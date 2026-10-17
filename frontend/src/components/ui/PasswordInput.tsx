"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

type Props = Omit<ComponentProps<"input">, "type"> & {
  inputClassName?: string;
};

/** Password field with an inline show/hide toggle. */
export function PasswordInput({ inputClassName, className, ...props }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cx("relative w-full", className)}>
      <input
        type={visible ? "text" : "password"}
        className={cx(
          "w-full rounded-lg px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none",
          inputClassName,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-2 my-auto h-8 w-8 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-800 transition-colors"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
