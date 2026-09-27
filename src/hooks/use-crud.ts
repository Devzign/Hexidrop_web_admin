import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useCrud<T extends { id: string | number }>(initial: T[], entity = "Record") {
  const [rows, setRows] = useState<T[]>(initial);
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState<Partial<T> | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);

  const openEdit = useCallback((row: T) => setEditing(row), []);
  const openCreate = useCallback((seed: Partial<T> = {}) => setCreating(seed), []);
  const openDelete = useCallback((row: T) => setDeleting(row), []);

  const saveEdit = useCallback(
    (next: T) => {
      setRows((r) => r.map((x) => (x.id === next.id ? { ...x, ...next } : x)));
      toast.success(`${entity} updated`, { description: `${String(next.id)} saved successfully.` });
    },
    [entity],
  );

  const saveCreate = useCallback(
    (next: T) => {
      const withId = { ...next, id: next.id ?? `${entity.slice(0, 3).toUpperCase()}-${Date.now()}` } as T;
      setRows((r) => [withId, ...r]);
      toast.success(`${entity} created`, { description: `${String(withId.id)} added.` });
    },
    [entity],
  );

  const confirmDelete = useCallback(() => {
    if (!deleting) return;
    setRows((r) => r.filter((x) => x.id !== deleting.id));
    toast.success(`${entity} deleted`, { description: `${String(deleting.id)} removed.` });
    setDeleting(null);
  }, [deleting, entity]);

  const duplicate = useCallback(
    (row: T) => {
      const copy = { ...row, id: `${String(row.id)}-COPY-${Math.floor(Math.random() * 999)}` } as T;
      setRows((r) => [copy, ...r]);
      toast.success(`${entity} duplicated`);
    },
    [entity],
  );

  return {
    rows,
    setRows,
    editing,
    setEditing,
    creating,
    setCreating,
    deleting,
    setDeleting,
    openEdit,
    openCreate,
    openDelete,
    saveEdit,
    saveCreate,
    confirmDelete,
    duplicate,
  };
}
