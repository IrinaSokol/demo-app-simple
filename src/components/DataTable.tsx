import type { KeyboardEvent } from 'react';

export type TableColumn = { key: string; header: string };

type DataTableProps = {
  columns: TableColumn[];
  rows: Record<string, string>[];
  tableTestId: string;
  /** When set, each row is clickable and opens the record with this id. */
  onRowClick?: (id: string) => void;
};

export function DataTable({ columns, rows, tableTestId, onRowClick }: DataTableProps) {
  function handleRowKeyDown(e: KeyboardEvent<HTMLTableRowElement>, id: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRowClick?.(id);
    }
  }

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
            <tr
              key={row.id}
              data-testid="row"
              data-row-id={row.id}
              className={onRowClick ? 'row-clickable' : undefined}
              role={onRowClick ? 'button' : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row.id) : undefined}
              onKeyDown={onRowClick ? (e) => handleRowKeyDown(e, row.id) : undefined}
            >
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
