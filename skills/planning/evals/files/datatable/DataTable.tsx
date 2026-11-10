import type { ReactNode } from "react";

export type Column<Row> = {
  key: string;
  header: string;
  cell: (row: Row) => ReactNode;
  align?: "left" | "right";
};

type Props<Row> = {
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  emptyLabel: string;
  onRowClick?: (row: Row) => void;
};

export function DataTable<Row>({ columns, rows, rowKey, emptyLabel, onRowClick }: Props<Row>) {
  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className={column.align === "right" ? "text-right" : "text-left"}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={rowKey(row)} onClick={onRowClick ? () => onRowClick(row) : undefined}>
            {columns.map((column) => (
              <td key={column.key} className={column.align === "right" ? "text-right" : "text-left"}>
                {column.cell(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
