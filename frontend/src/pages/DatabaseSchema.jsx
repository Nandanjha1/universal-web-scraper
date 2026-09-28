import { useEffect, useState } from "react";

import {
  getTables,
  getTableSchema,
} from "../services/api";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function DatabaseSchema() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [columns, setColumns] = useState([]);

  const [loadingTables, setLoadingTables] = useState(true);
  const [loadingSchema, setLoadingSchema] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoadingTables(true);
      setError("");

      const response = await getTables();

      const data = Array.isArray(response)
        ? response
        : response.data || response.tables || [];

      setTables(data);

      // Automatically select the first table
      if (data.length > 0) {
        const firstTable =
          typeof data[0] === "string"
            ? data[0]
            : data[0].table_name;

        if (firstTable) {
          loadTableSchema(firstTable);
        }
      }
    } catch (err) {
      console.error(
        "Failed to load tables:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load database tables."
      );
    } finally {
      setLoadingTables(false);
    }
  };

  const loadTableSchema = async (tableName) => {
    try {
      setLoadingSchema(true);
      setError("");
      setSelectedTable(tableName);

      const response =
        await getTableSchema(tableName);

      const data = Array.isArray(response)
        ? response
        : response.data || response.columns || [];

      setColumns(data);
    } catch (err) {
      console.error(
        "Failed to load table schema:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load table schema."
      );

      setColumns([]);
    } finally {
      setLoadingSchema(false);
    }
  };

  return (
    <div>
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Database Schema
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Explore PostgreSQL tables and their
          column definitions.
        </p>
      </div>

      <ErrorMessage message={error} />

      {loadingTables ? (
        <div className="rounded-xl border bg-white shadow-sm">
          <Loading message="Loading database tables..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Tables */}

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-800">
              Tables
            </h3>

            {tables.length === 0 ? (
              <p className="text-sm text-gray-500">
                No tables found.
              </p>
            ) : (
              <div className="space-y-2">
                {tables.map((table, index) => {
                  const tableName =
                    typeof table === "string"
                      ? table
                      : table.table_name;

                  return (
                    <button
                      key={tableName || index}
                      onClick={() =>
                        loadTableSchema(
                          tableName
                        )
                      }
                      className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                        selectedTable ===
                        tableName
                          ? "bg-blue-600 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      🗄️ {tableName}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Schema */}

          <div className="lg:col-span-3">
            {!selectedTable ? (
              <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                <p className="text-gray-500">
                  Select a table to view its schema.
                </p>
              </div>
            ) : loadingSchema ? (
              <div className="rounded-xl border bg-white shadow-sm">
                <Loading message="Loading table schema..." />
              </div>
            ) : (
              <SchemaTable
                tableName={selectedTable}
                columns={columns}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SchemaTable({
  tableName,
  columns,
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            🗄️
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              {tableName}
            </h3>

            <p className="text-xs text-gray-500">
              {columns.length} column
              {columns.length !== 1
                ? "s"
                : ""}
            </p>
          </div>
        </div>
      </div>

      {columns.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">
            No column information available.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">
                  Column
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  Data Type
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  Nullable
                </th>

                <th className="px-6 py-4 font-semibold text-gray-600">
                  Default
                </th>
              </tr>
            </thead>

            <tbody>
              {columns.map((column, index) => (
                <tr
                  key={
                    column.column_name ||
                    index
                  }
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {column.column_name ||
                      column.name ||
                      "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {column.data_type ||
                        column.type ||
                        "-"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {column.is_nullable ||
                      column.nullable ||
                      "-"}
                  </td>

                  <td className="max-w-xs truncate px-6 py-4 text-gray-500">
                    {column.column_default ||
                      column.default ||
                      "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DatabaseSchema;