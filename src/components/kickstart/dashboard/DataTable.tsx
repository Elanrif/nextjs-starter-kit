import { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
};

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  emptyText = "Aucune donnée.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Header */}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-gray-100">
          {/* Loading */}
          {loading && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-400"
              >
                Chargement...
              </td>
            </tr>
          )}

          {/* Empty */}
          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-gray-400"
              >
                {emptyText}
              </td>
            </tr>
          )}

          {/* Data */}
          {!loading &&
            data.length > 0 &&
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key as string}
                    className={`px-6 py-4 ${col.className || ""}`}
                  >
                    {col.render
                      ? col.render(row)
                      : (row[col.key as keyof T] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
