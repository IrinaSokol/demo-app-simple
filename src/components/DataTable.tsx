export type TableColumn = { key: string; header: string };

type DataTableProps = {
  columns: TableColumn[];
  rows: Record<string, string>[];
  tableTestId: string;
};

export function DataTable({ columns, rows, tableTestId }: DataTableProps) {
  return (
    <div className="table-wrap">
      <table data-testid={tableTestId}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} data-testid="row">
              {columns.map((col) => (
                <td key={col.key}>{row[col.key] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
