import { useState } from "react";
import { scrapeWebsite } from "../services/api";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

function ScrapeWebsite() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    try {
      setLoading(true);

      const data = await scrapeWebsite(url.trim());

      setResult(data);
      setUrl("");
    } catch (err) {
      console.error("Scraping failed:", err);

      const message =
        err.response?.data?.detail ||
        "Unable to scrape the website. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Scrape Website
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter any publicly accessible website URL to extract
          structured content.
        </p>
      </div>

      {/* Scrape Form */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="website-url"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Website URL
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="website-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Scraping..." : "Start Scraping"}
            </button>
          </div>
        </form>

        <p className="mt-3 text-xs text-gray-500">
          Example: https://example.com
        </p>
      </div>

      {/* Error */}
      <div className="mt-5">
        <ErrorMessage message={error} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-5 rounded-xl border bg-white shadow-sm">
          <Loading message="Scraping website and saving data..." />
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="mt-6">
          <ScrapeResult result={result} />
        </div>
      )}
    </div>
  );
}

function ScrapeResult({ result }) {
  const records = result.data || result.records || [];

  return (
    <div className="space-y-5">
      {/* Success */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <h3 className="font-semibold text-green-800">
          Scraping completed successfully
        </h3>

        <p className="mt-1 text-sm text-green-700">
          {result.message || "Website data has been scraped and saved."}
        </p>

        {result.scraped_count !== undefined && (
          <p className="mt-2 text-sm font-medium text-green-800">
            Records scraped: {result.scraped_count}
          </p>
        )}
      </div>

      {/* Preview */}
      {records.length > 0 && (
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold text-gray-800">
              Scraped Data Preview
            </h3>
          </div>

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
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {record.id}
                    </td>

                    <td className="max-w-xs truncate px-6 py-4 font-medium">
                      {record.title || "No title"}
                    </td>

                    <td className="max-w-sm truncate px-6 py-4 text-gray-500">
                      {record.url}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScrapeWebsite;