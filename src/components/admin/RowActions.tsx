import { MoreHorizontal, Pencil, Trash2, Eye, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePermissions, type Module } from "@/lib/permissions";

export function RowActions({
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  module,
  recordId,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  module?: Module;
  recordId?: string;
}) {
  const { can, check } = usePermissions();
  const allowEdit = !module || can(module, "edit");
  const allowCreate = !module || can(module, "create");
  const allowDelete = !module || can(module, "delete");

  const showEdit = onEdit && allowEdit;
  const showDuplicate = onDuplicate && allowCreate;
  const showDelete = onDelete && allowDelete;

  if (!onView && !showEdit && !showDuplicate && !showDelete) return null;

  const audited = (
    action: "view" | "edit" | "create" | "delete",
    handler?: () => void,
  ) => () => {
    if (module) check(module, action, undefined, recordId ? `Row ${action} · ${recordId}` : `Row ${action}`);
    handler?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
          aria-label="Row actions"
          data-testid="row-actions-trigger"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
        {onView && (
          <DropdownMenuItem onClick={audited("view", onView)} data-testid="row-action-view">
            <Eye className="mr-2 h-3.5 w-3.5" /> View
          </DropdownMenuItem>
        )}
        {showEdit && (
          <DropdownMenuItem onClick={audited("edit", onEdit)} data-testid="row-action-edit">
            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
          </DropdownMenuItem>
        )}
        {showDuplicate && (
          <DropdownMenuItem onClick={audited("create", onDuplicate)} data-testid="row-action-duplicate">
            <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
          </DropdownMenuItem>
        )}
        {showDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={audited("delete", onDelete)}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              data-testid="row-action-delete"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
