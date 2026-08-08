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
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-md border border-border bg-surface-elevated text-sm text-text placeholder:text-text-muted",
          "pr-4 outline-none transition-colors duration-150",
          icon ? "pl-11" : "pl-4",
          "focus:border-brand",
          // Neutralize native `type="search"` field chrome (WebKit adds its
          // own internal icon slot/decorations that fight with our custom
          // absolutely-positioned icon otherwise, causing icon/text overlap
          // regardless of the padding classes above).
          "appearance-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
          className
        )}
        {...props}
      />
    </div>
  );
});
