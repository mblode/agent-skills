import { DataTable, type Column } from "./DataTable";
import { useTeams, type Team } from "./api";

const columns: Column<Team>[] = [
  { key: "name", header: "Team", cell: (row) => row.name },
  { key: "members", header: "Members", align: "right", cell: (row) => row.memberCount },
];

export function TeamsPage() {
  const { data = [], isLoading } = useTeams();

  if (isLoading) {
    return <p className="py-8 text-center text-sm">Loading</p>;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-lg font-medium">Teams</h1>
      <DataTable columns={columns} rows={data} rowKey={(row) => row.id} emptyLabel="No teams yet" />
    </main>
  );
}
