// Lightweight in-memory audit log with pub/sub. Records every permission
// check made through the RBAC layer (both allowed and denied attempts).

import type { Module, Action, Role } from "./permissions";

export type AuditEntry = {
  id: string;
  ts: number;
  user: string;
  role: Role;
  module: Module | "route";
  action: Action | "navigate";
  route: string;
  outcome: "allowed" | "denied";
  detail?: string;
};

type Listener = (entries: AuditEntry[]) => void;

const MAX_ENTRIES = 500;
let entries: AuditEntry[] = [];
const listeners = new Set<Listener>();
let counter = 0;

function emit() {
  for (const l of listeners) l(entries);
}

export function recordAudit(e: Omit<AuditEntry, "id" | "ts">) {
  const entry: AuditEntry = {
    ...e,
    id: `AUD-${Date.now().toString(36)}-${counter++}`,
    ts: Date.now(),
  };
  entries = [entry, ...entries].slice(0, MAX_ENTRIES);
  emit();
  return entry;
}

export function getAuditEntries() {
  return entries;
}

export function clearAudit() {
  entries = [];
  emit();
}

export function subscribeAudit(fn: Listener) {
  listeners.add(fn);
  fn(entries);
  return () => {
    listeners.delete(fn);
  };
}

export function formatRelativeTime(ts: number, now = Date.now()) {
  const diff = Math.max(0, now - ts);
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}
