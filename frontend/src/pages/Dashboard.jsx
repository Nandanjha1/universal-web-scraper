import { useEffect, useMemo, useState } from "react";
import { getRecords } from "../services/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRecords();

      const data = Array.isArray(response)
        ? response
        : response.data || [];

      setRecords(data);
    } catch (err) {
      console.error(
        "Failed to load dashboard data:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load dashboard data."
      );

      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const uniqueWebsites = useMemo(() => {
    return new Set(
      records.map((record) => record.url)
    ).size;
  }, [records]);

  const latestRecord = useMemo(() => {
    if (!records.length) {
      return null;
    }

    return [...records].sort(
      (a, b) =>
        new Date(b.scraped_at) -
        new Date(a.scraped_at)
    )[0];
  }, [records]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white shadow-sm">
        <Loading message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your web scraping and stored data.
        </p>
      </div>

      {/* Error */}

      <div className="mb-5">
        <ErrorMessage message={error} />
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Records"
          value={records.length}
          icon="🗃️"
        />

        <StatCard
          title="Websites Scraped"
          value={uniqueWebsites}
          icon="🌐"
        />

        <StatCard
          title="Database Status"
          value={error ? "Unavailable" : "Connected"}
          icon="🗄️"
          valueClass={
            error
              ? "text-red-600"
              : "text-green-600"
          }
        />

        <StatCard
          title="Scraper Status"
          value="Ready"
          icon="⚡"
          valueClass="text-green-600"
        />
      </div>

      {/* Latest Scrape */}

      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h3 className="font-semibold text-gray-800">
            Latest Scrape
          </h3>
        </div>

        {latestRecord ? (
          <div className="p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Info
                label="Title"
                value={
                  latestRecord.title ||
                  "No title"
                }
              />

              <Info
                label="Scraped At"
                value={
                  latestRecord.scraped_at
                    ? new Date(
                        latestRecord.scraped_at
                      ).toLocaleString()
                    : "-"
                }
              />

              <div className="md:col-span-2">
                <p className="mb-1 text-xs font-medium uppercase text-gray-500">
                  Website
                </p>

                <a
                  href={latestRecord.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-blue-600 hover:underline"
                >
                  {latestRecord.url}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">
              No scraped records available yet.
            </p>
          </div>
        )}
      </div>

      {/* Recent Records */}

      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-semibold text-gray-800">
            Recent Records
          </h3>

          <span className="text-xs text-gray-500">
            {Math.min(records.length, 5)} records
          </span>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">
              No records found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-600">
                    ID
                  </th>

                  <th className="px-6 py-3 font-semibold text-gray-600">
                    Title
                  </th>

                  <th className="px-6 py-3 font-semibold text-gray-600">
                    URL
                  </th>

                  <th className="px-6 py-3 font-semibold text-gray-600">
                    Scraped At
                  </th>
                </tr>
              </thead>

              <tbody>
                {records
                  .slice(-5)
                  .reverse()
                  .map((record) => (
                    <tr
                      key={record.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium">
                        #{record.id}
                      </td>

                      <td className="max-w-xs truncate px-6 py-4">
                        {record.title ||
                          "No title"}
                      </td>

                      <td className="max-w-sm truncate px-6 py-4 text-blue-600">
                        {record.url}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {record.scraped_at
                          ? new Date(
                              record.scraped_at
                            ).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  valueClass = "text-gray-800",
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3
            className={`mt-2 text-2xl font-bold ${valueClass}`}
          >
            {value}
          </h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase text-gray-500">
        {label}
      </p>

      <p className="text-sm text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default Dashboard;