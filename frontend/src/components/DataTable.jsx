import { Link } from "react-router-dom";

function DataTable({ records, onDelete }) {
    if (!records.length) {
        return (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                <p className="text-gray-500">
                    No scraped records found.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">
                                ID
                            </th>

                            <th className="px-6 py-4 font-semibold text-gray-600">
                                Website
                            </th>

                            <th className="px-6 py-4 font-semibold text-gray-600">
                                Title
                            </th>

                            <th className="px-6 py-4 font-semibold text-gray-600">
                                Scraped At
                            </th>

                            <th className="px-6 py-4 text-right font-semibold text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {records.map((record) => (
                            <tr
                                key={record.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-6 py-4 font-medium">
                                    #{record.id}
                                </td>

                                <td className="max-w-xs px-6 py-4">
                                    <a
                                        href={record.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block truncate text-blue-600 hover:underline"
                                    >
                                        {record.url}
                                    </a>
                                </td>

                                <td className="max-w-xs px-6 py-4">
                                    <span className="block truncate">
                                        {record.title || "No title"}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-gray-500">
                                    {record.scraped_at
                                        ? new Date(record.scraped_at).toLocaleString()
                                        : "-"}
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            to={`/data/${record.id}`}
                                            className="rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                                        >
                                            View
                                        </Link>

                                        <Link
                                            to={`/data/${record.id}?edit=true`}
                                            className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-100"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => onDelete(record.id)}
                                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;