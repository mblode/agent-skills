import { DataTable, type Column } from "./DataTable";
import { useAuditLog, type AuditEntry } from "./api";

const columns: Column<AuditEntry>[] = [
  { key: "at", header: "When", cell: (row) => row.at },
  { key: "actor", header: "Who", cell: (row) => row.actorName },
  { key: "action", header: "Action", cell: (row) => row.action },
];

export function AuditLogPage() {
  const { data = [], isLoading } = useAuditLog();

  if (isLoading) {
    return <p className="py-8 text-center text-sm">Loading</p>;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-lg font-medium">Audit log</h1>
      <DataTable columns={columns} rows={data} rowKey={(row) => row.id} emptyLabel="Nothing recorded yet" />
    </main>
  );
}
