import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-text-tertiary pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full h-10 rounded-[var(--radius-md)] text-sm",
            "bg-bg-elevated border text-text-primary placeholder:text-text-tertiary",
            "transition-all duration-150",
            "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-indigo-500/20",
            error
              ? "border-brand-danger focus:border-brand-danger focus:ring-red-500/20"
              : "border-[var(--border-subtle)] hover:border-[var(--border-default)]",
            leftIcon ? "pl-10 pr-3" : "px-3",
            rightIcon ? "pr-10" : "",
            className
          )}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
              ? `${inputId}-helper`
              : undefined
          }
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-text-tertiary">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-xs text-brand-danger"
        >
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="text-xs text-text-tertiary">
          {helperText}
        </p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  charCount?: { current: number; max: number };
}

export function Textarea({
  label,
  helperText,
  error,
  charCount,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full px-3 py-2.5 rounded-[var(--radius-md)] text-sm resize-none",
          "bg-bg-elevated border text-text-primary placeholder:text-text-tertiary",
          "transition-all duration-150",
          "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-indigo-500/20",
          error
            ? "border-brand-danger"
            : "border-[var(--border-subtle)] hover:border-[var(--border-default)]",
          className
        )}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      <div className="flex items-center justify-between">
        {error ? (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-brand-danger">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="text-xs text-text-tertiary">
            {helperText}
          </p>
        ) : (
          <span />
        )}
        {charCount && (
          <p className={cn("text-xs tabular-nums", charCount.current > charCount.max * 0.9 ? "text-brand-warning" : "text-text-tertiary")}>
            {charCount.current}/{charCount.max}
          </p>
        )}
      </div>
    </div>
  );
}
