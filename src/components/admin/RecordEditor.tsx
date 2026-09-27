import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export type FieldDef<T> = {
  name: keyof T & string;
  label: string;
  type?: "text" | "number" | "select" | "switch" | "date";
  options?: readonly string[];
  placeholder?: string;
  full?: boolean;
};

export function RecordEditor<T extends { id: string | number }>({
  open,
  onOpenChange,
  title,
  description,
  fields,
  value,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  fields: FieldDef<T>[];
  value: Partial<T> | null;
  onSubmit: (next: T) => void;
}) {
  const [draft, setDraft] = useState<Partial<T>>({});

  useEffect(() => {
    if (open) setDraft(value ?? {});
  }, [open, value]);

  const set = (name: string, v: unknown) =>
    setDraft((d) => ({ ...d, [name]: v } as Partial<T>));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-2">
          {fields.map((f) => {
            const v = (draft as any)[f.name];
            return (
              <div key={f.name} className={f.full ? "col-span-2" : "col-span-2 sm:col-span-1"}>
                <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">{f.label}</Label>
                <div className="mt-1.5">
                  {f.type === "select" ? (
                    <Select value={v ?? ""} onValueChange={(nv) => set(f.name, nv)}>
                      <SelectTrigger><SelectValue placeholder={f.placeholder ?? "Select…"} /></SelectTrigger>
                      <SelectContent>
                        {f.options?.map((o) => (
                          <SelectItem key={o} value={o}>{o}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : f.type === "switch" ? (
                    <div className="flex h-10 items-center">
                      <Switch checked={!!v} onCheckedChange={(nv) => set(f.name, nv)} />
                    </div>
                  ) : (
                    <Input
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                      value={v ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) =>
                        set(
                          f.name,
                          f.type === "number"
                            ? e.target.value === "" ? "" : Number(e.target.value)
                            : e.target.value,
                        )
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onSubmit(draft as T);
              onOpenChange(false);
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDelete({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete record?",
  description = "This action cannot be undone.",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
