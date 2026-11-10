import { DataTable, type Column } from "./DataTable";
import { useReportRows, type ReportRow } from "./api";

const columns: Column<ReportRow>[] = [
  { key: "period", header: "Period", cell: (row) => row.period },
  { key: "region", header: "Region", cell: (row) => row.region },
  { key: "owner", header: "Owner", cell: (row) => row.ownerName },
  { key: "status", header: "Status", cell: (row) => row.status },
  { key: "revenue", header: "Revenue", align: "right", cell: (row) => row.revenueFormatted },
];

export function ReportsPage() {
  const { data = [], isLoading } = useReportRows();

  if (isLoading) {
    return <p className="py-8 text-center text-sm">Loading</p>;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-lg font-medium">Reports</h1>
      <DataTable columns={columns} rows={data} rowKey={(row) => row.id} emptyLabel="No report rows for this period" />
    </main>
  );
}
