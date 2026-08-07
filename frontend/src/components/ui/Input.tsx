import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

/**
 * Base text input, e.g. for search bars. Forwarding the ref lets pages
 * manage focus (e.g. "/" keyboard shortcut to focus search).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon, className, ...props },
  ref
) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="pointer-events-none absolute left-3 flex items-center text-text-muted">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-md border border-border bg-surface-elevated text-sm text-text placeholder:text-text-muted",
          "px-3.5 outline-none transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-soft)]",
          "hover:border-border-strong focus:border-brand focus:bg-surface-hover focus:ring-2 focus:ring-brand/20",
          icon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
});
