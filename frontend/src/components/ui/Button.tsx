import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-on-brand hover:bg-brand-strong",
  secondary:
    "bg-surface-elevated text-text border border-border hover:bg-surface-hover hover:border-border-strong",
  outline:
    "bg-transparent text-text border border-border hover:border-border-strong hover:bg-surface-hover",
  ghost: "bg-transparent text-text-secondary hover:text-text hover:bg-surface-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
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
        "inline-flex items-center justify-center rounded-md font-semibold transition-colors duration-150",
        "disabled:opacity-50 disabled:cursor-not-allowed",
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
