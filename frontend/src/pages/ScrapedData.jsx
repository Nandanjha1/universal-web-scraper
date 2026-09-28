import { useEffect, useMemo, useState } from "react";
import { deleteRecord, getRecords } from "../services/api";
import DataTable from "../components/DataTable";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ExportCsvButton from "../components/ExportCsvButton";

function ScrapedData() {
    const [records, setRecords] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadRecords = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getRecords();
            const data = Array.isArray(response)
                ? response
                : response.data || [];

            setRecords(data);
        } catch (err) {
            console.error("Failed to load records:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to load scraped records."
            );

            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecords();
    }, []);

    const filteredRecords = useMemo(() => {
        const query = search.toLowerCase().trim();

        if (!query) {
            return records;
        }

        // return records.filter((record) => {
        //     return (
        //         String(record.id).includes(query) ||
        //         record.url?.toLowerCase().includes(query) ||
        //         record.title?.toLowerCase().includes(query)
        //     );
        // });

        return Array.isArray(records)
            ? records.filter((record) => {
                return (
                    String(record.id).includes(query) ||
                    record.url?.toLowerCase().includes(query) ||
                    record.title?.toLowerCase().includes(query)
                );
            })
            : [];

    }, [records, search]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteRecord(id);

            setRecords((currentRecords) =>
                currentRecords.filter(
                    (record) => record.id !== id
                )
            );
        } catch (err) {
            console.error("Delete failed:", err);

            setError(
                err.response?.data?.detail ||
                "Unable to delete the record."
            );
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Scraped Data
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        View and manage all scraped website records.
                    </p>
                </div>

                <div className="flex gap-2">
                    <ExportCsvButton />

                    <button
                        onClick={loadRecords}
                        disabled={loading}
                        className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        🔄 Refresh
                    </button>
                </div>

            </div>

            {/* Search */}
            <div className="mb-5 rounded-xl border bg-white p-4 shadow-sm">
                <input
                    type="text"
                    placeholder="Search by ID, website URL or title..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {/* Error */}
            <div className="mb-5">
                <ErrorMessage message={error} />
            </div>

            {/* Content */}
            {loading ? (
                <div className="rounded-xl border bg-white shadow-sm">
                    <Loading message="Loading scraped records..." />
                </div>
            ) : (
                <>
                    <div className="mb-3 text-sm text-gray-500">
                        Showing{" "}
                        <span className="font-semibold text-gray-700">
                            {filteredRecords.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-700">
                            {records.length}
                        </span>{" "}
                        records
                    </div>

                    <DataTable
                        records={filteredRecords}
                        onDelete={handleDelete}
                    />
                </>
            )}
        </div>
    );
}

export default ScrapedData;