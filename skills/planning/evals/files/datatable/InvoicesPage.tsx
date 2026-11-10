import { DataTable, type Column } from "./DataTable";
import { useInvoices, type Invoice } from "./api";

const columns: Column<Invoice>[] = [
  { key: "number", header: "Invoice", cell: (row) => row.number },
  { key: "customer", header: "Customer", cell: (row) => row.customerName },
  { key: "total", header: "Total", align: "right", cell: (row) => row.totalFormatted },
];

export function InvoicesPage() {
  const { data = [], isLoading } = useInvoices();

  if (isLoading) {
    return <p className="py-8 text-center text-sm">Loading</p>;
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-lg font-medium">Invoices</h1>
      <DataTable columns={columns} rows={data} rowKey={(row) => row.id} emptyLabel="No invoices yet" />
    </main>
  );
}
