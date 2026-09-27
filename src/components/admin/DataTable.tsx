import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
};

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  onRowClick,
  compact,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  compact?: boolean;
  empty?: ReactNode;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
          ∅
        </div>
        <p className="text-sm font-medium">Nothing here yet</p>
        {empty && <p className="text-xs text-muted-foreground">{empty}</p>}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="text-left">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "sticky top-0 z-10 border-b border-border/80 bg-slate-100/90 px-4 py-3 text-[12px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur-xs first:rounded-tl-2xl last:rounded-tr-2xl dark:bg-slate-800/90 dark:text-slate-200",
                  c.align === "right" && "text-right",
                  c.align === "center" && "text-center",
                  c.className,
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "group transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
                onRowClick && "cursor-pointer",
              )}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "border-b border-border/70 px-4 align-middle text-[13px] font-medium text-slate-800 dark:text-slate-100",
                    compact ? "py-2.5" : "py-3.5",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    i === rows.length - 1 && "border-b-0",
                  )}
                >
                  {c.render ? c.render(row) : (row as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
