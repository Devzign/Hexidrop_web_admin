import { Download, Lock } from "lucide-react";
import { toast } from "sonner";
import { usePermissions, type Module } from "@/lib/permissions";
import { cn } from "@/lib/utils";

/**
 * Permission-aware export/download action for tables and reports.
 * Roles without the "export" action for the module see a locked, disabled
 * button and every attempt is recorded in the audit log.
 */
export function ExportButton({
  module,
  label = "Export",
  format = "CSV",
  variant = "outline",
  onExport,
  className,
}: {
  module: Module;
  label?: string;
  format?: "CSV" | "PDF" | "XLSX";
  variant?: "outline" | "primary";
  onExport?: () => void;
  className?: string;
}) {
  const { can, check, role } = usePermissions();
  const allowed = can(module, "export");

  const base =
    "inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-gradient-primary text-primary-foreground shadow-card hover:shadow-elegant"
      : "border bg-card hover:bg-accent";
  const disabledStyles =
    "cursor-not-allowed border bg-muted/40 text-muted-foreground hover:bg-muted/40";

  return (
    <button
      onClick={() => {
        const ok = check(module, "export", undefined, `Export ${format}: ${label}`);
        if (!ok) {
          toast.error(`Export blocked · ${role} cannot export ${module}`);
          return;
        }
        onExport?.();
        toast.success(`${label} · ${format} ready`);
      }}
      disabled={!allowed}
      title={allowed ? `Export ${format}` : `Your role (${role}) cannot export ${module}`}
      className={cn(base, allowed ? styles : disabledStyles, className)}
    >
      {allowed ? <Download className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
      {label}
      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
        {format}
      </span>
    </button>
  );
}
