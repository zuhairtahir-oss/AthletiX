import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand text-on-brand hover:bg-brand-strong shadow-[0_1px_0_0_rgb(255_255_255/0.15)_inset,0_6px_16px_-8px_var(--color-brand)]",
  secondary:
    "bg-surface-elevated text-text border border-border hover:bg-surface-hover hover:border-border-strong",
  outline:
    "bg-transparent text-text border border-border hover:border-border-strong hover:bg-surface-hover",
  ghost: "bg-transparent text-text-secondary hover:text-text hover:bg-surface-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

/**
 * Base interactive button. Variants map directly to design tokens so
 * changing brand colors never requires touching component files.
 */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-soft)] active:translate-y-px",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
