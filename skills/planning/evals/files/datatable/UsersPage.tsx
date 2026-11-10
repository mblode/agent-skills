import { DataTable, type Column } from "./DataTable";
import { useUsers, type User } from "./api";

const columns: Column<User>[] = [
  { key: "name", header: "Name", cell: (row) => row.name },
  { key: "email", header: "Email", cell: (row) => row.email },
  { key: "role", header: "Role", cell: (row) => row.role },
];

export function UsersPage() {
  const { data = [], isLoading } = useUsers();

  if (isLoading) {
    return <p className="py-8 text-center text-sm">Loading</p>;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-lg font-medium">Users</h1>
      <DataTable columns={columns} rows={data} rowKey={(row) => row.id} emptyLabel="No users yet" />
    </main>
  );
}
