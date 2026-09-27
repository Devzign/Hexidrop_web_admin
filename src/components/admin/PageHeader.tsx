import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {breadcrumb && (
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/50">/</span>}
                <span className={i === breadcrumb.length - 1 ? "text-foreground" : ""}>{b}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className,
  padding = "default",
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: "default" | "none";
}) {
  return (
    <div className={cn("rounded-2xl border bg-card shadow-card", className)}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
          <div>
            {title && <h3 className="text-sm font-semibold tracking-tight">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={padding === "none" ? "" : "p-5"}>{children}</div>
    </div>
  );
}
